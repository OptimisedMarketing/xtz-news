/**
 * Recover 10 missing images with URL-encoded accented filenames
 * These were never uploaded to Manus Storage because the filenames had special characters
 * Fetch from WordPress API using wpId, upload to wp-media-v2/ with correct MIME type
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// The 10 posts still with /api/img/ URLs (accented filenames that failed)
const FAILED_POSTS = [
  { id: 175, wpId: 12180 },
  { id: 176, wpId: 12172 },
  { id: 177, wpId: 12171 },
  { id: 178, wpId: 12168 },
  { id: 179, wpId: 11916 },
  { id: 451, wpId: 2555 },
  { id: 493, wpId: 2340 },
  { id: 629, wpId: 1628 },
  { id: 689, wpId: 1502 },
  { id: 817, wpId: 1200 },
];

const WP_AUTH = Buffer.from('info@optimised.marketing:6sry WCpG 6yYv gcaJ 8uJb fzz9').toString('base64');
// WordPress is still running on FastHosts but xtz.news now points to new site
// Try the FastHosts server IP directly
const WP_HOSTS = [
  'https://xtz.news', // try new site first (WP API might still be accessible)
];

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const MIME_TYPES = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
};

function getMimeType(filename) {
  const ext = filename.toLowerCase().match(/\.[^.]+$/)?.[0] || '.jpg';
  return MIME_TYPES[ext] || 'image/jpeg';
}

async function storagePut(key, buffer, contentType) {
  const presignUrl = new URL('v1/storage/presign/put', FORGE_URL + '/');
  presignUrl.searchParams.set('path', key);
  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${FORGE_KEY}` },
  });
  if (!presignResp.ok) throw new Error(`Presign PUT failed: ${presignResp.status}`);
  const { url: s3Url } = await presignResp.json();
  const uploadResp = await fetch(s3Url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: buffer,
  });
  if (!uploadResp.ok) throw new Error(`S3 upload failed: ${uploadResp.status}`);
  return `/manus-storage/${key}`;
}

async function fetchWpMediaUrl(wpId) {
  // Try each WP host
  for (const host of WP_HOSTS) {
    try {
      // Get post's featured_media ID
      const postResp = await fetch(`${host}/wp-json/wp/v2/posts/${wpId}?_fields=id,featured_media`, {
        headers: { Authorization: `Basic ${WP_AUTH}` },
        signal: AbortSignal.timeout(10000),
      });
      if (!postResp.ok) continue;
      const postData = await postResp.json();
      if (!postData.featured_media) continue;
      
      // Get media source URL
      const mediaResp = await fetch(`${host}/wp-json/wp/v2/media/${postData.featured_media}?_fields=id,source_url,media_details`, {
        headers: { Authorization: `Basic ${WP_AUTH}` },
        signal: AbortSignal.timeout(10000),
      });
      if (!mediaResp.ok) continue;
      const mediaData = await mediaResp.json();
      
      // Try to get a 768px wide version
      const sizes = mediaData.media_details?.sizes;
      const url = sizes?.['medium_large']?.source_url || 
                  sizes?.['large']?.source_url || 
                  mediaData.source_url;
      if (url) return url;
    } catch (e) {
      console.log(`  ${host}: ${e.message}`);
    }
  }
  return null;
}

console.log('=== Recovering 10 missing images with accented filenames ===\n');

let recovered = 0;

for (const post of FAILED_POSTS) {
  console.log(`Post ${post.id} (wpId: ${post.wpId})...`);
  
  try {
    // Step 1: Get the WordPress media URL
    const sourceUrl = await fetchWpMediaUrl(post.wpId);
    if (!sourceUrl) {
      console.log(`  ✗ Could not find media URL from WP API`);
      continue;
    }
    console.log(`  Source: ${sourceUrl}`);
    
    // Step 2: Download the image
    const imgResp = await fetch(sourceUrl, { 
      signal: AbortSignal.timeout(20000),
      headers: { 'User-Agent': 'XTZNews/1.0' },
    });
    if (!imgResp.ok) throw new Error(`Download failed: ${imgResp.status}`);
    const buffer = Buffer.from(await imgResp.arrayBuffer());
    if (buffer.length < 100) throw new Error(`File too small: ${buffer.length} bytes`);
    
    // Step 3: Create a safe filename (use post ID to avoid encoding issues)
    const origFilename = sourceUrl.split('/').pop() || `post-${post.id}.jpg`;
    const ext = origFilename.match(/\.[^.]+$/)?.[0] || '.jpg';
    const safeFilename = `post-${post.id}-featured${ext}`;
    const key = `wp-media-v2/${safeFilename}`;
    const mimeType = getMimeType(safeFilename);
    
    // Step 4: Upload to Manus Storage with correct MIME type
    const newUrl = await storagePut(key, buffer, mimeType);
    
    // Step 5: Update DB
    await conn.query('UPDATE posts SET featuredImageUrl = ? WHERE id = ?', [newUrl, post.id]);
    console.log(`  ✓ Uploaded: ${newUrl} (${buffer.length} bytes, ${mimeType})`);
    recovered++;
    
  } catch (e) {
    console.log(`  ✗ Error: ${e.message}`);
  }
  
  await new Promise(r => setTimeout(r, 500));
}

console.log(`\n✅ Recovered ${recovered} / ${FAILED_POSTS.length} images`);
await conn.end();
