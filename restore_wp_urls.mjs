/**
 * Restore original WordPress image URLs from the WP API
 * The /manus-storage/ URLs are broken due to CloudFront signed URL expiry
 * This script re-fetches the original WP URLs and restores them
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get all posts with /manus-storage/ URLs
const [posts] = await conn.query(
  "SELECT id, featuredImageUrl FROM posts WHERE featuredImageUrl LIKE '/manus-storage/wp-media/%'"
);

console.log(`Found ${posts.length} posts with manus-storage URLs`);

// Parse the migration log to get original filename -> post ID mapping
const logContent = readFileSync('/home/ubuntu/xtz-news/migration_log_backup.txt', 'utf8').catch ? null : null;

// The filenames in manus-storage are: /manus-storage/wp-media/FILENAME_HASH.ext
// The original WP URLs are: https://xtz.news/wp-content/uploads/YEAR/MONTH/FILENAME.ext
// We need to fetch the original URLs from the WP API

const WP_BASE = 'https://xtz.news';
const WP_USER = 'info@optimised.marketing';
const WP_PASS = '6sry WCpG 6yYv gcaJ 8uJb fzz9';
const AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

let restored = 0;
let failed = 0;

// Process in batches of 20
const batchSize = 20;
for (let i = 0; i < posts.length; i += batchSize) {
  const batch = posts.slice(i, i + batchSize);
  const ids = batch.map(p => p.id).join(',');
  
  // Fetch original WP data for these posts
  try {
    const res = await fetch(
      `${WP_BASE}/wp-json/wp/v2/posts?include=${ids}&per_page=${batchSize}&_fields=id,featured_media,_links`,
      { headers: { Authorization: `Basic ${AUTH}` } }
    );
    
    if (!res.ok) {
      console.log(`WP API error for batch ${i}: ${res.status}`);
      failed += batch.length;
      continue;
    }
    
    const wpPosts = await res.json();
    
    for (const wpPost of wpPosts) {
      if (!wpPost.featured_media) continue;
      
      // Get the media URL
      try {
        const mediaRes = await fetch(
          `${WP_BASE}/wp-json/wp/v2/media/${wpPost.featured_media}?_fields=source_url`,
          { headers: { Authorization: `Basic ${AUTH}` } }
        );
        
        if (!mediaRes.ok) continue;
        const media = await mediaRes.json();
        
        if (media.source_url) {
          await conn.query(
            'UPDATE posts SET featuredImageUrl = ? WHERE id = ?',
            [media.source_url, wpPost.id]
          );
          restored++;
          console.log(`✓ Post ${wpPost.id}: ${media.source_url}`);
        }
      } catch (e) {
        console.log(`✗ Post ${wpPost.id} media fetch: ${e.message}`);
        failed++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 100));
    }
  } catch (e) {
    console.log(`Batch error: ${e.message}`);
    failed += batch.length;
  }
  
  console.log(`Progress: ${i + batch.length}/${posts.length} (${restored} restored, ${failed} failed)`);
}

console.log(`\nDone: ${restored} restored, ${failed} failed`);
await conn.end();
