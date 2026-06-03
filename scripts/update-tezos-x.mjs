import { createConnection } from 'mysql2/promise';

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error('DATABASE_URL not set');

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const TRANSCRIPT = `
Full transcript of Saroupille (François Thiré) from Labos Nomades / Nomadic Labs at TezDev 2026:

INTRODUCTION:
"On Tezos X, you can build in Solidity and Michelson. Contracts talk to each other natively, in a single transaction. Tap into EVM liquidity, secure contracts with Michelson's formal verification. All on one chain."

THE PROBLEM:
The Tezos ecosystem currently has two separate worlds — the Michelson world on Layer 1 (with formal verification, tickets, strong typing) and the EVM world via Etherlink (DeFi liquidity). Builders must choose one; users need two wallets.

ARCHITECTURE:
"So, this is the only architecture diagram for this talk, a bit technical. You have in this diagram two things. First, Tezos X, the execution layer, and Tezos Layer 1. Here, because it's a rollup, Tezos X settles on the Layer 1, and you have a bridge from the Layer 1 to Tezos X. But the important part is the kernel. The kernel defines the logic of your application. And what we did is to have two runtimes within it. On one side, Michelson, where you can do formal verification, for example. And on the other side, EVM, where you will get DeFi, etc. We call it interface here, because what we will expose with Tezos X is really one chain with two interfaces. So for RPCs, for example, you will have two sets of RPCs. One for Michelson and one for the EVM part."

THE GATEWAY:
"The way we build the interactions is compounded with two components. On one side, we will give you automatically an address. If you are on the Michelson side, you will get an address on the EVM side and vice versa. And on the other side, we have a gateway that provides some kind of abstraction that makes you interact with an EVM contract as if it was a Michelson contract. And it's rather easy, okay? And it's especially atomic."

"If you are in Ligo, if you want to call an EVM contract, it will work in two steps. First step, you will need to encode the parameters, and we will provide at the tooling level an ABI so that you can do that for you, translating types from Michelson to EVM. And once it's done, then you just need to call the gateway as if you were calling a smart contract. And it works."

"This is based on another famous protocol called HTTP, and you have the full control on that. Modulo some security features to make sure that it's safe to do that way."

FORMAL VERIFICATION:
"We already know that EVM is the place to be if you want to have DeFi and liquidity. This is the case with Etherlink. But with Michelson actually, we can make contracts safer and easier to verify. The reason is that from the start, the design of Michelson was made in a way that it's easy to ensure that your contract just works. We have strong typing, we have tickets, and it was built with formal verification in mind. So actually Michelson is still a beautiful language. And thanks to Tezos X, it's composable."

"We are living in a world with AI agents now, and we are using them in general to do security audits. This is what we did internally. And it was remarkably easy to realize that those agents were able to prove easily some properties for Michelson contract, while it would take hours to ensure that an EVM contract was safe. That's a real case example."

"So, if you are using an EVM, thanks to Tezos X, formal verification can be a security primitive for you. You don't need to migrate your app, you will extend it."

TOOLING:
"We are also working with other companies such as Baking Bad to have day one indexers and explorers to make sure that it's easy for you to build on Tezos X."

"There is a trick though, is that we will put this complexity in the tooling, but be reassured, it's not that much complex and we are already building this tooling showing that it actually works. So your smart contract doesn't change, and with Tezos X actually your user base will grow across ecosystems."

THE VISION:
"So the world that we are building is the following one. For your users, they can use the stack they are familiar with. One wallet, no need to have two wallets, but they can use both runtimes. On one side, they have the ability to use Michelson's, and it will give you some kind of formal guarantees. And it will be available to every Solidity dApp. And thanks to the AI agentic world, it's much easier now to have your smart contract formally verified. On the other side, you will have EVM's liquidity that will be available to every Tezos builder. And everything is made in a way that it's atomic, so that it's easy to use."

TIMELINE:
"We plan to release this testnet in April 2026, so in about a month or less, and we plan to submit to the community Tezos X as a vote, an Etherlink upgrade for production by the end of Q2."

CLOSING:
"So now that we have built the primitive, the question is, what will you do with it? Thank you."
`;

async function invokeLLM(messages) {
  const res = await fetch(`${FORGE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${FORGE_KEY}` },
    body: JSON.stringify({ model: 'claude-opus-4-5', messages, max_tokens: 5000 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

const systemPrompt = `You are a senior journalist for XTZ.News, the leading Tezos blockchain news publication.
Rewrite this article based on the TezDev 2026 transcript. Requirements:

1. Professional news article, 800-1000 words
2. HTML format using: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote> tags
3. Start with a compelling 2-3 sentence intro paragraph (NO video embed — that's added separately)
4. Include at least 5 direct blockquote pull-quotes from the transcript, spread throughout the article
5. Use <blockquote><p>"exact quote here"</p><cite>— François Thiré (Saroupille), TezDev 2026</cite></blockquote> format for quotes
6. Use <h2> for major sections (The Problem, The Architecture, The Gateway, Formal Verification as a Security Primitive, The Vision, Timeline)
7. Use <h3> for subsections
8. Make the headings descriptive and compelling, not generic
9. Cover: dual runtimes, atomic cross-runtime calls, gateway mechanism, LIGO example, formal verification + AI agents, Baking Bad indexers, one wallet for users, Q2 2026 timeline
10. End with a strong forward-looking conclusion
11. Do NOT wrap in markdown code fences
12. Do NOT include a title/h1`;

console.log('Generating rewritten article with Claude...');
const articleHtml = await invokeLLM([
  { role: 'system', content: systemPrompt },
  { role: 'user', content: `Rewrite the article based on this transcript:\n\n${TRANSCRIPT}` }
]);

// Build the final content: intro paragraph first, then video embed, then rest of article
// We'll insert the video after the first </p> tag
const videoEmbed = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:2rem 0;border-radius:8px;"><iframe src="https://www.youtube.com/embed/zh6Ov2RObK0" title="Tezos X: Native Atomic Composability — TezDev 2026" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;"></iframe></div>`;

const transcriptDownload = `
<div style="margin:3rem 0;padding:1.5rem 2rem;background:rgba(44,125,247,0.06);border:1px solid rgba(44,125,247,0.25);border-left:4px solid #2c7df7;border-radius:0 8px 8px 0;">
  <p style="margin:0 0 0.5rem;font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#2c7df7;">Full Transcript</p>
  <p style="margin:0 0 1rem;font-size:0.9rem;color:rgba(255,255,255,0.7);">Download the complete transcript of François Thiré's TezDev 2026 talk on Tezos X native atomic composability.</p>
  <a href="/manus-storage/tezos-x-tezdev-2026-transcript_e8309bbb.txt" download="tezos-x-tezdev-2026-transcript.txt" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1.25rem;background:#2c7df7;border-radius:4px;color:#fff;text-decoration:none;font-size:0.82rem;font-weight:700;">
    ⬇ Download Transcript (.txt)
  </a>
</div>`;

// Insert video after first paragraph, transcript download before closing
const firstPEnd = articleHtml.indexOf('</p>');
let finalContent;
if (firstPEnd !== -1) {
  finalContent = articleHtml.slice(0, firstPEnd + 4) + '\n' + videoEmbed + '\n' + articleHtml.slice(firstPEnd + 4) + '\n' + transcriptDownload;
} else {
  finalContent = videoEmbed + '\n' + articleHtml + '\n' + transcriptDownload;
}

console.log('Publishing to DB...');
const url = new URL(DB_URL);
const conn = await createConnection({
  host: url.hostname,
  port: parseInt(url.port || '4000'),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
});

await conn.execute(
  "UPDATE posts SET content=?, updatedAt=NOW() WHERE slug=?",
  [finalContent, 'tezos-x-solidity-michelson-dual-runtime-tezdev-2026']
);

await conn.end();
console.log('Done! Article updated at: https://xtz.news/tezos-x-solidity-michelson-dual-runtime-tezdev-2026');
