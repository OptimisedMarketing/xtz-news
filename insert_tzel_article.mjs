import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const title = "Introducing TzEL: Private Post-Quantum Payments, Live on Tezos Testnet";
const slug = "introducing-tzel-private-post-quantum-payments-live-on-tezos-testnet";
const excerpt = "A new post-quantum privacy solution has launched on testnet for the Tezos blockchain. TzEL enables private payments that remain fully private even as quantum computing advances threaten elliptic curve cryptography — the first working prototype of its kind.";
const featuredImageUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310519663300283832/b4WZurEggWt4nzJXT2vL9d/tzel-post-quantum-B4E7DxGkFQuwZRPK95sN6w.webp";
const publishedAt = new Date('2026-05-18T09:00:00Z'); // Today
const seoTitle = "TzEL: Private Post-Quantum Payments Launch on Tezos Testnet | XTZ.News";
const seoDescription = "TzEL launches on Tezos testnet bringing post-quantum cryptography to private payments. Uses zk-STARK proofs and Tezos DAL to enable fully private transactions resistant to quantum attacks.";

const content = `<p>A new privacy-focused rollup called TzEL has launched on the Tezos testnet, bringing post-quantum cryptography to private payments in what developers describe as the first working prototype of its kind.</p>
<p>The launch, announced on 14 May 2026, addresses growing concerns about the vulnerability of current blockchain privacy solutions to future quantum computing attacks. TzEL is designed to enable private payments that remain fully private, even as advances in quantum computing compromise the security of the elliptic curve cryptography used for privacy on blockchains today.</p>
<p>The timing reflects a shift in how the blockchain industry views quantum threats. In recent months, concerns around the quantum threat facing blockchains have increasingly moved from academic curiosity into practical risk management. Privacy on blockchains today relies on elliptic curve cryptography that quantum computers will break. Critically, while existing systems can keep a payment private today, the associated encrypted note payloads and memos are permanently recorded on-chain, presenting malicious actors with a real opportunity to harvest data now for decryption later.</p>
<p>TzEL neutralizes this threat by implementing quantum-resistant cryptography for both payments and the associated data. The system ensures users can continue to transact privately, with full control over who can view transaction data through features like encrypted payment memos, viewing keys, and detector keys.</p>
<p>Tezos co-founder Arthur Breitman emphasized the long-term thinking behind the project. <strong>"Private transactions have a long memory: the data encrypted today may still be around when tomorrow's attacks arrive. With TzEL, we set out to build a shielded ledger for Tezos whose privacy stack is post-quantum end to end."</strong></p>
<p>The development team faced significant technical hurdles in bringing the system to life. One particular technical challenge involved in building a post-quantum privacy system has been the size of the cryptographic proofs. The quantum-resistant zk-STARK proofs used by TzEL are around 300KB – much larger than currently used privacy proofs – which make post-quantum private systems economically and technically prohibitive for many blockchains.</p>
<p>TzEL overcomes this obstacle by utilizing Tezos' built-in Data Availability Layer (DAL). Integrated into the Tezos protocol in 2024, the DAL significantly increases the amount of transaction data that can be published on-chain, making it possible to offer a full private transaction stack without congesting the network.</p>
<p>While still in development, and while Tezos itself is still only beginning to transition to post-quantum cryptography, TzEL demonstrates that private, post-quantum transactions are achievable today, and points toward a future where long-term transaction privacy is the baseline, not the exception.</p>
<p>More information about TzEL is available at <a href="http://tzel.tezos.com">http://tzel.tezos.com</a>.</p>`;

// Check if exists
const [existing] = await conn.query('SELECT id FROM posts WHERE slug = ?', [slug]);
if (existing.length > 0) {
  console.log('Article already exists with ID:', existing[0].id);
  await conn.end();
  process.exit(0);
}

const [result] = await conn.query(
  `INSERT INTO posts (title, slug, content, excerpt, featuredImageUrl, status, publishedAt, isFeatured, viewCount, seoTitle, seoDescription, createdAt, updatedAt)
   VALUES (?, ?, ?, ?, ?, 'publish', ?, 1, 0, ?, ?, NOW(), NOW())`,
  [title, slug, content, excerpt, featuredImageUrl, publishedAt, seoTitle, seoDescription]
);

const postId = result.insertId;
console.log('Article inserted with ID:', postId);

// Link to categories: Latest News + Adoption
const [cats] = await conn.query(
  "SELECT id, name FROM categories WHERE slug IN ('latest-news', 'adoption')"
);
for (const cat of cats) {
  await conn.query('INSERT IGNORE INTO post_categories (postId, categoryId) VALUES (?, ?)', [postId, cat.id]);
  console.log('Linked to category:', cat.name);
}

// Add tags
const tagNames = ['TzEL', 'Post-Quantum', 'Privacy', 'zk-STARK', 'Tezos DAL', 'Cryptography', 'Arthur Breitman'];
for (const tagName of tagNames) {
  const tagSlug = tagName.toLowerCase().replace(/[\s-]+/g, '-').replace(/[^a-z0-9-]/g, '');
  let [tagRows] = await conn.query('SELECT id FROM tags WHERE slug = ?', [tagSlug]);
  let tagId;
  if (tagRows.length === 0) {
    const [r] = await conn.query('INSERT INTO tags (name, slug, postCount) VALUES (?, ?, 1)', [tagName, tagSlug]);
    tagId = r.insertId;
  } else {
    tagId = tagRows[0].id;
    await conn.query('UPDATE tags SET postCount = postCount + 1 WHERE id = ?', [tagId]);
  }
  await conn.query('INSERT IGNORE INTO post_tags (postId, tagId) VALUES (?, ?)', [postId, tagId]);
}

console.log('Tags linked');
await conn.end();
console.log('\nDone! Article live at: /' + slug);
