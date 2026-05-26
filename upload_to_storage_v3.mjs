/**
 * Upload all downloaded images from /tmp/wp-images/ to Manus Storage wp-media-v3/
 * with correct MIME types. Updates database URLs.
 * Images were downloaded from Fasthosts SFTP - they are real image bytes.
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const DB_URL = process.env.DATABASE_URL;
const IMG_DIR = '/tmp/wp-images';
const PROGRESS_FILE = '/tmp/upload_v3_progress.json';

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
  const presignResp = await fetch(presignUrl, { headers: { Authorization: `Bearer ${FORGE_KEY}` } });
  if (!presignResp.ok) throw new Error(`Presign PUT failed: ${presignResp.status} ${await presignResp.text()}`);
  const { url: s3Url } = await presignResp.json();
  const uploadResp = await fetch(s3Url, {
    method: 'PUT', headers: { 'Content-Type': contentType }, body: buffer,
  });
  if (!uploadResp.ok) throw new Error(`S3 upload failed: ${uploadResp.status}`);
  return `/manus-storage/${key}`;
}

// Load progress
let progress = { done: new Set(), failed: [] };
if (fs.existsSync(PROGRESS_FILE)) {
  const p = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  progress.done = new Set(p.done || []);
  progress.failed = p.failed || [];
  console.log(`Resuming: ${progress.done.size} already done, ${progress.failed.length} failed`);
}

// Get all images in the directory
const files = fs.readdirSync(IMG_DIR);
console.log(`Found ${files.length} images in ${IMG_DIR}`);

// Connect to DB
let conn = await mysql.createConnection(DB_URL);
let dbOps = 0;

// Get filename -> post IDs mapping from DB
const [posts] = await conn.query(
  "SELECT id, featuredImageUrl FROM posts WHERE featuredImageUrl LIKE '/manus-storage/wp-media-v2/%' OR featuredImageUrl LIKE '/api/img/%' OR featuredImageUrl LIKE '/manus-storage/wp-media-v3/%' ORDER BY id"
);

const filenameToPostIds = new Map();
for (const post of posts) {
  const filename = post.featuredImageUrl
    .replace('/manus-storage/wp-media-v2/', '')
    .replace('/manus-storage/wp-media-v3/', '')
    .replace('/api/img/', '');
  if (!filenameToPostIds.has(filename)) filenameToPostIds.set(filename, []);
  filenameToPostIds.get(filename).push(post.id);
}

console.log(`${filenameToPostIds.size} unique filenames to update in DB`);

let success = 0, failed = 0, skipped = 0;

for (let i = 0; i < files.length; i++) {
  const filename = files[i];
  
  // Skip if already done
  if (progress.done.has(filename)) {
    skipped++;
    continue;
  }
  
  const localPath = path.join(IMG_DIR, filename);
  
  try {
    const buffer = fs.readFileSync(localPath);
    if (buffer.length < 100) throw new Error(`File too small: ${buffer.length}`);
    
    // Verify it's a real image
    const header = buffer.slice(0, 15).toString();
    if (header.toLowerCase().includes('<!doctype') || header.toLowerCase().includes('<html')) {
      throw new Error('File is HTML, not an image');
    }
    
    const mimeType = getMimeType(filename);
    const key = `wp-media-v3/${filename}`;
    const newUrl = await storagePut(key, buffer, mimeType);
    
    // Reconnect DB if needed
    dbOps++;
    if (dbOps % 100 === 0) {
      try { await conn.end(); } catch {}
      conn = await mysql.createConnection(DB_URL);
    }
    
    // Update DB
    const postIds = filenameToPostIds.get(filename);
    if (postIds) {
      for (const postId of postIds) {
        await conn.query('UPDATE posts SET featuredImageUrl = ? WHERE id = ?', [newUrl, postId]);
      }
    }
    
    progress.done.add(filename);
    success++;
    
    if (success % 50 === 0) {
      console.log(`Progress: ${success}/${files.length - skipped} uploaded (${failed} failed, ${skipped} skipped)`);
      // Save progress
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ done: Array.from(progress.done), failed: progress.failed }));
    }
  } catch (e) {
    console.log(`  ✗ ${filename}: ${e.message}`);
    failed++;
    progress.failed.push(filename);
  }
  
  // Small delay
  await new Promise(r => setTimeout(r, 100));
}

// Save final progress
fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ done: Array.from(progress.done), failed: progress.failed }));
console.log(`\n✅ Complete: ${success} uploaded, ${failed} failed, ${skipped} skipped`);

try { await conn.end(); } catch {}
