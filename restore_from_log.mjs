/**
 * Restore original WP URLs by reconstructing them from the migration log
 * Log format: ✓ Post N: FILENAME.ext → /manus-storage/wp-media/FILENAME_HASH.ext
 * 
 * We know the filename, and we can search the WP media API by filename
 * OR we can use the WP API posts endpoint with featured_media field
 * and then fetch each media item
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const WP_BASE = 'https://xtz.news';
const WP_USER = 'info@optimised.marketing';
const WP_PASS = '6sry WCpG 6yYv gcaJ 8uJb fzz9';
const AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

// Parse migration log to get post ID -> filename mapping
const logPath = '/home/ubuntu/xtz-image-migration/migration.log';
const log = readFileSync(logPath, 'utf8');
const lines = log.split('\n');

// Map: postId -> original filename (without path)
const postFilenames = new Map();
for (const line of lines) {
  const match = line.match(/✓ Post (\d+): (.+?) → \/manus-storage/);
  if (match) {
    postFilenames.set(parseInt(match[1]), match[2]);
  }
}

console.log(`Parsed ${postFilenames.size} post->filename mappings from log`);

// Get all posts with manus-storage URLs
const [posts] = await conn.query(
  "SELECT id, wpId FROM posts WHERE featuredImageUrl LIKE '/manus-storage/wp-media/%'"
);
console.log(`Found ${posts.length} posts to restore`);

// Fetch posts from WP API in batches to get featured_media IDs
const PAGE_SIZE = 100;
let page = 1;
const wpMediaIds = new Map(); // wpId -> mediaId

while (true) {
  try {
    const res = await fetch(
      `${WP_BASE}/wp-json/wp/v2/posts?per_page=${PAGE_SIZE}&page=${page}&_fields=id,featured_media&status=publish`,
      { headers: { Authorization: `Basic ${AUTH}` } }
    );
    
    if (!res.ok) { console.log(`WP posts API error: ${res.status}`); break; }
    const wpPosts = await res.json();
    if (!wpPosts.length) break;
    
    for (const wp of wpPosts) {
      if (wp.featured_media) wpMediaIds.set(wp.id, wp.featured_media);
    }
    
    console.log(`WP page ${page}: ${wpPosts.length} posts (${wpMediaIds.size} with media)`);
    if (wpPosts.length < PAGE_SIZE) break;
    page++;
    await new Promise(r => setTimeout(r, 300));
  } catch (e) {
    console.log(`Error: ${e.message}`);
    break;
  }
}

console.log(`\nFetched ${wpMediaIds.size} media IDs from WP API`);

// Now fetch media URLs in batches
let restored = 0;
let failed = 0;
const mediaUrlCache = new Map(); // mediaId -> source_url

// Get media IDs we need
const neededMediaIds = new Set();
for (const post of posts) {
  if (post.wpId && wpMediaIds.has(post.wpId)) {
    neededMediaIds.add(wpMediaIds.get(post.wpId));
  }
}

console.log(`Need to fetch ${neededMediaIds.size} unique media URLs`);

// Fetch media in batches of 100
const mediaIdArray = [...neededMediaIds];
for (let i = 0; i < mediaIdArray.length; i += 100) {
  const batch = mediaIdArray.slice(i, i + 100);
  try {
    const res = await fetch(
      `${WP_BASE}/wp-json/wp/v2/media?include=${batch.join(',')}&per_page=100&_fields=id,source_url`,
      { headers: { Authorization: `Basic ${AUTH}` } }
    );
    if (!res.ok) { console.log(`Media API error: ${res.status}`); continue; }
    const mediaItems = await res.json();
    for (const m of mediaItems) {
      if (m.source_url) mediaUrlCache.set(m.id, m.source_url);
    }
    console.log(`Fetched media batch ${i/100 + 1}: ${mediaItems.length} items`);
    await new Promise(r => setTimeout(r, 300));
  } catch (e) {
    console.log(`Media batch error: ${e.message}`);
  }
}

console.log(`\nGot ${mediaUrlCache.size} media URLs. Updating database...`);

// Update posts
for (const post of posts) {
  if (!post.wpId) { failed++; continue; }
  const mediaId = wpMediaIds.get(post.wpId);
  if (!mediaId) { failed++; continue; }
  const sourceUrl = mediaUrlCache.get(mediaId);
  if (!sourceUrl) { failed++; continue; }
  
  await conn.query('UPDATE posts SET featuredImageUrl = ? WHERE id = ?', [sourceUrl, post.id]);
  restored++;
  if (restored % 100 === 0) console.log(`  Restored ${restored}/${posts.length}...`);
}

console.log(`\nDone: ${restored} restored, ${failed} not found`);
await conn.end();
