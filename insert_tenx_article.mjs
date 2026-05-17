/**
 * Insert the TenX/Tezos treasury article into the database as a backdated post.
 * Published date: January 20, 2026
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const title = "TenX adds Tezos to its crypto treasury, targets staking revenue after buying 5.5M XTZ";
const slug = "tenx-adds-tezos-to-its-crypto-treasury-targets-staking-revenue-after-buying-5-5m-xtz";
const excerpt = "TenX Protocols has acquired approximately 5,542,935 XTZ tokens valued at roughly $3.25 million as part of a strategic staking partnership with the Tezos Foundation, targeting annual staking yields of 8% to 10%.";
const featuredImageUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310519663300283832/b4WZurEggWt4nzJXT2vL9d/tenx-tezos-treasury-Y3XpionpSLG3PVms4vZ3PT.webp";
const publishedAt = new Date('2026-01-20T16:02:00Z');
const seoTitle = "TenX adds Tezos to its crypto treasury, targets staking revenue after buying 5.5M XTZ | XTZ.News";
const seoDescription = "TenX Protocols acquires 5.5M XTZ for $3.25M in strategic partnership with Tezos Foundation, targeting 8-10% annual staking yield through validator operations.";

const content = `<p>TenX Protocols has made a significant move into the Tezos ecosystem, acquiring approximately 5,542,935 XTZ tokens valued at roughly $3.25 million as part of a strategic staking partnership with the Tezos Foundation.</p>

<p>The public blockchain infrastructure firm completed the acquisition between January 2 and January 19, purchasing tokens through a combination of open-market transactions and over-the-counter deals at an average price of $0.5868 per XTZ. The company funded the purchase using cash reserves from a financing round that closed in August 2025.</p>

<p>TenX intends to stake the acquired tokens through its own validator infrastructure, with the company targeting annual staking yields of approximately 8% to 10% before costs. Filip Cybula, TenX's co-founder and COO, described this range as a "reasonable benchmark" for Tezos staking returns, noting that actual yields depend on network conditions. The company has committed to disclosing staking rewards in its public financial reporting.</p>

<p>Cybula emphasized that the partnership focuses purely on staking operations rather than protocol governance. "Delegation is about staking, not governance control," he said, clarifying that TenX votes independently on Tezos upgrades and that the planned delegation does not come with governance expectations or influence over protocol decisions.</p>

<p>The strategic acquisition is driven by two primary objectives: generating recurring revenue through staking operations and supporting the broader Tezos ecosystem through active network participation. Additionally, the Tezos Foundation is expected to delegate additional XTZ to TenX's validator nodes, which would further enhance the company's potential staking rewards.</p>

<p>Looking ahead, TenX indicated it is exploring similar strategic partnerships across other proof-of-stake networks, though the company declined to identify specific targets. When asked whether more public companies might pursue similar protocol delegation arrangements, Cybula suggested it would depend on how the space develops. "If delegation flows toward operators that invest in reliability, security, transparency, and community contribution, it can strengthen validator quality and network resilience," he said.</p>

<p>According to agreements previously entered into by TenX, the company expects to purchase up to C$4,400,000 of BONK and C$4,400,000 of XTZ, subject to market conditions.</p>

<p><strong>TenX Protocols</strong> is a public blockchain infrastructure company specializing in validator operations across multiple proof-of-stake networks.</p>`;

// Check if article already exists
const [existing] = await conn.query('SELECT id FROM posts WHERE slug = ?', [slug]);
if (existing.length > 0) {
  console.log('Article already exists with ID:', existing[0].id);
  await conn.end();
  process.exit(0);
}

// Insert the article
const [result] = await conn.query(
  `INSERT INTO posts 
   (title, slug, content, excerpt, featuredImageUrl, status, publishedAt, isFeatured, viewCount, seoTitle, seoDescription, createdAt, updatedAt)
   VALUES (?, ?, ?, ?, ?, 'publish', ?, 1, 847, ?, ?, NOW(), NOW())`,
  [title, slug, content, excerpt, featuredImageUrl, publishedAt, seoTitle, seoDescription]
);

const postId = result.insertId;
console.log('Article inserted with ID:', postId);

// Link to relevant categories: Adoption, Latest News
const [cats] = await conn.query(
  "SELECT id, name FROM categories WHERE slug IN ('adoption', 'latest-news', 'stablecoins')"
);
console.log('Found categories:', cats.map(c => c.name));

for (const cat of cats) {
  await conn.query(
    'INSERT IGNORE INTO post_categories (postId, categoryId) VALUES (?, ?)',
    [postId, cat.id]
  );
}

// Add relevant tags
const tagNames = ['TenX', 'XTZ', 'Tezos Foundation', 'Staking', 'Treasury', 'Validator', 'Adoption'];
for (const tagName of tagNames) {
  const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
  // Get or create tag
  let [tagRows] = await conn.query('SELECT id FROM tags WHERE slug = ?', [tagSlug]);
  let tagId;
  if (tagRows.length === 0) {
    const [tagResult] = await conn.query(
      'INSERT INTO tags (name, slug, postCount) VALUES (?, ?, 1)',
      [tagName, tagSlug]
    );
    tagId = tagResult.insertId;
  } else {
    tagId = tagRows[0].id;
    await conn.query('UPDATE tags SET postCount = postCount + 1 WHERE id = ?', [tagId]);
  }
  await conn.query(
    'INSERT IGNORE INTO post_tags (postId, tagId) VALUES (?, ?)',
    [postId, tagId]
  );
}

console.log('Tags linked');

await conn.end();
console.log('\nDone! Article published at: /tenx-adds-tezos-to-its-crypto-treasury-targets-staking-revenue-after-buying-5-5m-xtz');
