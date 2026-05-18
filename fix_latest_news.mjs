/**
 * Fix Latest News category:
 * 1. Re-insert the category with a new ID (auto-increment)
 * 2. Link ALL published posts to it
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// 1. Insert Latest News category (let DB assign new ID)
const [existing] = await conn.query("SELECT id FROM categories WHERE slug = 'latest-news'");
let latestNewsCatId;

if (existing.length > 0) {
  latestNewsCatId = existing[0].id;
  console.log('Latest News category already exists with ID:', latestNewsCatId);
} else {
  const [result] = await conn.query(
    "INSERT INTO categories (name, slug, postCount) VALUES ('Latest News', 'latest-news', 889)"
  );
  latestNewsCatId = result.insertId;
  console.log('Created Latest News category with ID:', latestNewsCatId);
}

// 2. Get all published post IDs
const [posts] = await conn.query("SELECT id FROM posts WHERE status = 'publish'");
console.log(`Linking ${posts.length} posts to Latest News (category ID ${latestNewsCatId})...`);

// 3. Insert post_categories rows for all posts (ignore duplicates)
let linked = 0;
const BATCH = 200;
for (let i = 0; i < posts.length; i += BATCH) {
  const batch = posts.slice(i, i + BATCH);
  const values = batch.map(p => `(${p.id}, ${latestNewsCatId})`).join(', ');
  await conn.query(`INSERT IGNORE INTO post_categories (postId, categoryId) VALUES ${values}`);
  linked += batch.length;
  console.log(`  Linked ${linked}/${posts.length}...`);
}

// 4. Update postCount
await conn.query(
  "UPDATE categories SET postCount = (SELECT COUNT(*) FROM post_categories WHERE categoryId = ?) WHERE id = ?",
  [latestNewsCatId, latestNewsCatId]
);

const [count] = await conn.query(
  "SELECT COUNT(*) as cnt FROM post_categories WHERE categoryId = ?",
  [latestNewsCatId]
);
console.log(`\nDone! Latest News now has ${count[0].cnt} posts linked.`);

await conn.end();
