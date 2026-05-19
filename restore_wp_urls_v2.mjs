/**
 * Restore original WP image URLs using WP API directly
 * No migration log needed - fetches featured_media from WP API for each post
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const WP_BASE = 'https://xtz.news';
const AUTH = Buffer.from('info@optimised.marketing:6sry WCpG 6yYv gcaJ 8uJb fzz9').toString('base64');

// Get all posts with manus-storage URLs
const [posts] = await conn.query(
  "SELECT id, wpId FROM posts WHERE featuredImageUrl LIKE '/manus-storage/wp-media/%' AND wpId IS NOT NULL ORDER BY id"
);
console.log(`Found ${posts.length} posts to restore`);

let restored = 0, failed = 0;

// Process in batches of 50
for (let i = 0; i < posts.length; i += 50) {
  const batch = posts.slice(i, i + 50);
  const wpIds = batch.map(p => p.wpId).join(',');
  
  try {
    // Step 1: Get featured_media IDs from WP posts API
    const postsRes = await fetch(
      `${WP_BASE}/wp-json/wp/v2/posts?include=${wpIds}&per_page=50&_fields=id,featured_media`,
      { headers: { Authorization: `Basic ${AUTH}` }, signal: AbortSignal.timeout(20000) }
    );
    
    if (!postsRes.ok) {
      console.log(`WP posts API error ${postsRes.status} for batch ${Math.floor(i/50)+1}`);
      failed += batch.length;
      continue;
    }
    
    const wpPosts = await postsRes.json();
    const wpPostMap = new Map(wpPosts.map(p => [p.id, p.featured_media]));
    
    // Step 2: Get media source URLs
    const mediaIds = wpPosts.filter(p => p.featured_media).map(p => p.featured_media);
    if (!mediaIds.length) { failed += batch.length; continue; }
    
    const mediaRes = await fetch(
      `${WP_BASE}/wp-json/wp/v2/media?include=${mediaIds.join(',')}&per_page=100&_fields=id,source_url`,
      { headers: { Authorization: `Basic ${AUTH}` }, signal: AbortSignal.timeout(20000) }
    );
    
    if (!mediaRes.ok) { failed += batch.length; continue; }
    const mediaItems = await mediaRes.json();
    const mediaMap = new Map(mediaItems.map(m => [m.id, m.source_url]));
    
    // Step 3: Update database
    for (const post of batch) {
      const mediaId = wpPostMap.get(post.wpId);
      const sourceUrl = mediaId ? mediaMap.get(mediaId) : null;
      if (sourceUrl) {
        await conn.query('UPDATE posts SET featuredImageUrl = ? WHERE id = ?', [sourceUrl, post.id]);
        restored++;
      } else {
        failed++;
      }
    }
    
    console.log(`Batch ${Math.floor(i/50)+1}/${Math.ceil(posts.length/50)}: ${restored} restored, ${failed} failed`);
    await new Promise(r => setTimeout(r, 400));
    
  } catch (e) {
    console.log(`Batch ${Math.floor(i/50)+1} error: ${e.message}`);
    failed += batch.length;
  }
}

console.log(`\n✅ Done: ${restored} restored, ${failed} failed out of ${posts.length} total`);
await conn.end();
