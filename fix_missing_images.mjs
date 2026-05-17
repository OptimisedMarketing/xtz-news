/**
 * Second extraction pass: fetch featured image URLs for posts missing them.
 * Uses the WP REST API to get featured_media IDs, then fetches media URLs,
 * then updates the database directly via mysql2.
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const WP_BASE = 'https://xtz.news/wp-json/wp/v2';
const WP_AUTH = 'Basic ' + Buffer.from('info@optimised.marketing:6sry WCpG 6yYv gcaJ 8uJb fzz9').toString('base64');

const conn = await mysql.createConnection(process.env.DATABASE_URL);
console.log('Connected to DB');

// Get all posts missing featured images with their wpId
const [missing] = await conn.query(
  'SELECT id, wpId FROM posts WHERE featuredImageUrl IS NULL AND wpId IS NOT NULL ORDER BY publishedAt DESC'
);
console.log(`Posts missing featured image: ${missing.length}`);

if (missing.length === 0) {
  console.log('All posts already have images!');
  await conn.end();
  process.exit(0);
}

const wpIdToDbId = {};
for (const row of missing) {
  wpIdToDbId[row.wpId] = row.id;
}

const wpIds = missing.map(r => r.wpId);
const BATCH = 50;
let updated = 0;
let errors = 0;

// Media URL cache to avoid re-fetching same media
const mediaCache = {};

async function getMediaUrl(mediaId) {
  if (mediaCache[mediaId]) return mediaCache[mediaId];
  try {
    const r = await fetch(`${WP_BASE}/media/${mediaId}?_fields=id,source_url,media_details`, {
      headers: { Authorization: WP_AUTH },
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return null;
    const data = await r.json();
    const sizes = data?.media_details?.sizes || {};
    const url = sizes.medium_large?.source_url || sizes.large?.source_url || sizes.medium?.source_url || data.source_url;
    if (url) mediaCache[mediaId] = url;
    return url || null;
  } catch {
    return null;
  }
}

for (let i = 0; i < wpIds.length; i += BATCH) {
  const batch = wpIds.slice(i, i + BATCH);
  const idsStr = batch.join(',');
  
  try {
    const r = await fetch(
      `${WP_BASE}/posts?include=${idsStr}&per_page=${BATCH}&_fields=id,featured_media`,
      { headers: { Authorization: WP_AUTH }, signal: AbortSignal.timeout(30000) }
    );
    
    if (!r.ok) {
      console.log(`  Batch ${Math.floor(i/BATCH)+1}: HTTP ${r.status}`);
      errors++;
      await new Promise(res => setTimeout(res, 2000));
      continue;
    }
    
    const wpPosts = await r.json();
    console.log(`  Batch ${Math.floor(i/BATCH)+1}: ${wpPosts.length} posts`);
    
    for (const wp of wpPosts) {
      const mediaId = wp.featured_media;
      if (!mediaId) continue;
      
      const mediaUrl = await getMediaUrl(mediaId);
      if (!mediaUrl) continue;
      
      const dbId = wpIdToDbId[wp.id];
      if (!dbId) continue;
      
      await conn.query('UPDATE posts SET featuredImageUrl = ? WHERE id = ?', [mediaUrl, dbId]);
      updated++;
    }
    
    if (updated % 20 === 0 && updated > 0) {
      console.log(`    Progress: ${updated} updated, ${i + BATCH} processed`);
    }
    
    await new Promise(res => setTimeout(res, 400));
    
  } catch (e) {
    console.log(`  Batch error: ${e.message}`);
    errors++;
    await new Promise(res => setTimeout(res, 2000));
  }
}

// Final count
const [result] = await conn.query('SELECT COUNT(*) as cnt FROM posts WHERE featuredImageUrl IS NULL');
const stillMissing = result[0].cnt;

await conn.end();

console.log('\n' + '='.repeat(50));
console.log('DONE');
console.log(`Updated:       ${updated}`);
console.log(`Errors:        ${errors}`);
console.log(`Still missing: ${stillMissing}`);
