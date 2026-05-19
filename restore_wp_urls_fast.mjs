/**
 * Fast restore: fetch all post featured images from WP API in bulk
 * and update the database with the original WordPress URLs
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const WP_BASE = 'https://xtz.news';
const WP_USER = 'info@optimised.marketing';
const WP_PASS = '6sry WCpG 6yYv gcaJ 8uJb fzz9';
const AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

// Get all posts with manus-storage URLs (need restoring)
const [posts] = await conn.query(
  "SELECT id, wpId FROM posts WHERE featuredImageUrl LIKE '/manus-storage/wp-media/%' AND wpId IS NOT NULL"
);

console.log(`Found ${posts.length} posts to restore`);

let restored = 0;
let failed = 0;
const PAGE_SIZE = 100;

// Fetch all posts from WP API with featured_media field
let page = 1;
const wpPostMap = new Map(); // wpId -> source_url

while (true) {
  try {
    const res = await fetch(
      `${WP_BASE}/wp-json/wp/v2/posts?per_page=${PAGE_SIZE}&page=${page}&_fields=id,featured_media&_embed=wp:featuredmedia`,
      { headers: { Authorization: `Basic ${AUTH}` } }
    );
    
    if (res.status === 400) break; // No more pages
    if (!res.ok) {
      console.log(`WP API error page ${page}: ${res.status}`);
      break;
    }
    
    const wpPosts = await res.json();
    if (!wpPosts.length) break;
    
    for (const wp of wpPosts) {
      const media = wp._embedded?.['wp:featuredmedia']?.[0];
      if (media?.source_url) {
        wpPostMap.set(wp.id, media.source_url);
      }
    }
    
    console.log(`Fetched WP page ${page}: ${wpPosts.length} posts (total mapped: ${wpPostMap.size})`);
    
    if (wpPosts.length < PAGE_SIZE) break;
    page++;
    await new Promise(r => setTimeout(r, 200));
  } catch (e) {
    console.log(`Error on page ${page}: ${e.message}`);
    break;
  }
}

console.log(`\nWP API returned ${wpPostMap.size} posts with featured images`);
console.log('Updating database...');

// Update each post
for (const post of posts) {
  const sourceUrl = wpPostMap.get(post.wpId);
  if (sourceUrl) {
    await conn.query(
      'UPDATE posts SET featuredImageUrl = ? WHERE id = ?',
      [sourceUrl, post.id]
    );
    restored++;
    if (restored % 50 === 0) console.log(`  Restored ${restored}/${posts.length}...`);
  } else {
    failed++;
  }
}

console.log(`\nDone: ${restored} restored, ${failed} not found in WP API`);
await conn.end();
