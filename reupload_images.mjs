/**
 * Re-upload all wp-media images with correct MIME types
 * The original upload used content-type from HTTP response which was wrong (text/html)
 * This script downloads each image from the original WordPress source and re-uploads
 * with the correct MIME type based on file extension
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// MIME type map by extension
const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

function getMimeType(filename) {
  const ext = filename.toLowerCase().match(/\.[^.]+$/)?.[0] || '.jpg';
  return MIME_TYPES[ext] || 'image/jpeg';
}

// Get Forge API credentials from environment
const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_URL || !FORGE_KEY) {
  console.error('Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY');
  process.exit(1);
}

async function storagePut(key, buffer, contentType) {
  // Get presigned PUT URL
  const presignUrl = new URL('v1/storage/presign/put', FORGE_URL + '/');
  presignUrl.searchParams.set('path', key);
  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${FORGE_KEY}` },
  });
  if (!presignResp.ok) throw new Error(`Presign failed: ${presignResp.status}`);
  const { url: s3Url } = await presignResp.json();
  
  // PUT to S3
  const uploadResp = await fetch(s3Url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: buffer,
  });
  if (!uploadResp.ok) throw new Error(`Upload failed: ${uploadResp.status}`);
  
  // Return the /manus-storage/ URL
  return `/manus-storage/${key}`;
}

async function storageGetSignedUrl(key) {
  const getUrl = new URL('v1/storage/presign/get', FORGE_URL + '/');
  getUrl.searchParams.set('path', key);
  const resp = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${FORGE_KEY}` },
  });
  if (!resp.ok) throw new Error(`Get presign failed: ${resp.status}`);
  const { url } = await resp.json();
  return url;
}

// Get all posts with /api/img/ URLs (these need re-uploading)
const [posts] = await conn.query(
  "SELECT id, featuredImageUrl FROM posts WHERE featuredImageUrl LIKE '/api/img/%' ORDER BY id"
);

console.log(`Found ${posts.length} posts to re-upload`);

let success = 0, failed = 0;

for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const filename = post.featuredImageUrl.replace('/api/img/', '');
  const key = `wp-media/${filename}`;
  const mimeType = getMimeType(filename);
  
  try {
    // Step 1: Get current signed URL from Manus Storage
    const signedUrl = await storageGetSignedUrl(key);
    
    // Step 2: Download the image (it's stored with wrong content-type but bytes are correct)
    const imgResp = await fetch(signedUrl, { signal: AbortSignal.timeout(20000) });
    if (!imgResp.ok) throw new Error(`Download failed: ${imgResp.status}`);
    const buffer = Buffer.from(await imgResp.arrayBuffer());
    
    if (buffer.length < 100) throw new Error(`File too small: ${buffer.length} bytes`);
    
    // Step 3: Re-upload with correct MIME type using a new key with -v2 suffix
    const newKey = `wp-media-v2/${filename}`;
    const newUrl = await storagePut(newKey, buffer, mimeType);
    
    // Step 4: Update DB with new URL
    await conn.query('UPDATE posts SET featuredImageUrl = ? WHERE id = ?', [newUrl, post.id]);
    success++;
    
    if (success % 50 === 0) {
      console.log(`Progress: ${success}/${posts.length} re-uploaded (${failed} failed)`);
    }
  } catch (e) {
    console.log(`✗ Post ${post.id} (${filename}): ${e.message}`);
    failed++;
  }
  
  // Small delay to avoid rate limiting
  await new Promise(r => setTimeout(r, 150));
}

console.log(`\n✅ Done: ${success} re-uploaded, ${failed} failed`);
await conn.end();
