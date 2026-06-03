import { createConnection } from 'mysql2/promise';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error('DATABASE_URL not set');

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const TRANSCRIPT = `
On Tezos X, you can build in Solidity and Michelson. Contracts talk to each other natively, in a single transaction. Tap into EVM liquidity, secure contracts with Michelson's formal verification. All on one chain.

The speaker, Saroupille from Labos Nomades, presented at TezDev 2026 and explained:

The core problem: Tezos has two worlds — the Michelson world (Layer 1, with formal verification, tickets, strong typing) and the EVM world (Etherlink, with DeFi liquidity). Builders have to choose one, and users need two wallets.

Tezos X solves this. It is a rollup that settles on Tezos Layer 1 and exposes two runtimes in a single kernel: Michelson and EVM. One chain, two interfaces. One wallet for users.

Key technical details:
- Every contract automatically gets a mirror address on the other runtime
- A "gateway" provides abstraction to call EVM contracts from Michelson (and vice versa) as if they were native contracts
- All cross-runtime calls are atomic — they happen in a single transaction
- RPCs are provided for both runtimes separately
- The gateway is based on HTTP protocol with security features
- Baking Bad is building day-one indexers and explorers for Tezos X
- Tooling handles the complexity — smart contracts themselves don't need to change

Formal verification advantage: AI agents can prove properties of Michelson contracts far more easily than EVM contracts. This makes Michelson a security primitive available to every Solidity dApp on Tezos X.

Example in LIGO: calling an EVM contract from Michelson requires (1) encoding parameters using a provided ABI that translates types between runtimes, then (2) calling the gateway as a normal smart contract call.

Timeline: Testnet planned for April 2026. Community vote to upgrade Etherlink to Tezos X production by end of Q2 2026.

Quote: "Your smart contract doesn't change, and with Tezos X your user base will grow across ecosystems."
`;

async function invokeLLM(messages) {
  const res = await fetch(`${FORGE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${FORGE_KEY}` },
    body: JSON.stringify({ model: 'claude-opus-4-5', messages, max_tokens: 4000 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

const systemPrompt = `You are a senior journalist for XTZ.News, the leading Tezos blockchain news publication. 
Write a professional, in-depth news article based on the provided transcript from TezDev 2026.

Requirements:
- Professional news article style, 600-900 words
- HTML format (use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote> tags)
- Include a compelling intro paragraph that hooks the reader
- Cover all technical details accurately: dual runtimes, atomic cross-runtime calls, gateway, formal verification, timeline
- Include the direct quote about user base growing
- Mention Saroupille from Labos Nomades as the speaker
- Mention Baking Bad building day-one indexers
- End with a forward-looking conclusion about what this means for the Tezos ecosystem
- Do NOT wrap in markdown code fences
- Do NOT include a title/h1 (that's handled separately)`;

console.log('Generating article with Claude...');
const articleHtml = await invokeLLM([
  { role: 'system', content: systemPrompt },
  { role: 'user', content: `Write the article based on this transcript from TezDev 2026:\n\n${TRANSCRIPT}` }
]);

console.log('Article generated, publishing to DB...');

const url = new URL(DB_URL);
const conn = await createConnection({
  host: url.hostname,
  port: parseInt(url.port || '4000'),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
});

// Get or create category
const [cats] = await conn.execute("SELECT id FROM categories WHERE slug = 'development'");
let categoryId;
if (cats.length > 0) {
  categoryId = cats[0].id;
} else {
  const [cats2] = await conn.execute("SELECT id FROM categories LIMIT 1");
  categoryId = cats2[0]?.id;
}

// Get author
const [authors] = await conn.execute("SELECT id FROM users LIMIT 1");
const authorId = authors[0]?.id;

const slug = 'tezos-x-solidity-michelson-dual-runtime-tezdev-2026';
const title = 'Tezos X: Build in Solidity and Michelson on One Chain — TezDev 2026';
const excerpt = 'Saroupille from Labos Nomades unveiled Tezos X at TezDev 2026 — a rollup that lets Solidity and Michelson contracts call each other atomically in a single transaction, bringing EVM liquidity and Michelson\'s formal verification together on one chain.';

// Check if already exists
const [existing] = await conn.execute("SELECT id FROM posts WHERE slug = ?", [slug]);
if (existing.length > 0) {
  console.log('Article already exists, updating...');
  await conn.execute(
    "UPDATE posts SET title=?, content=?, excerpt=?, updatedAt=NOW() WHERE slug=?",
    [title, articleHtml, excerpt, slug]
  );
} else {
  const [result] = await conn.execute(
    `INSERT INTO posts (title, slug, content, excerpt, status, publishedAt, createdAt, updatedAt) 
     VALUES (?, ?, ?, ?, 'publish', NOW(), NOW(), NOW())`,
    [title, slug, articleHtml, excerpt]
  );
  const postId = result.insertId;
  if (categoryId) {
    await conn.execute("INSERT INTO post_categories (postId, categoryId) VALUES (?, ?)", [postId, categoryId]);
  }
  console.log('Article published! Post ID:', postId);
}

await conn.end();
console.log('Done! Article URL: https://xtz.news/' + slug);
