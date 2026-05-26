/**
 * Full image fix: download from Fasthosts SFTP, upload to Manus Storage wp-media-v3/
 * with correct MIME types. This is the definitive fix.
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';

dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);
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
  const presignResp = await fetch(presignUrl, { headers: { Authorization: `Bearer ${FORGE_KEY}` } });
  if (!presignResp.ok) throw new Error(`Presign PUT failed: ${presignResp.status}`);
  const { url: s3Url } = await presignResp.json();
  const uploadResp = await fetch(s3Url, {
    method: 'PUT', headers: { 'Content-Type': contentType }, body: buffer,
  });
  if (!uploadResp.ok) throw new Error(`S3 upload failed: ${uploadResp.status}`);
  return `/manus-storage/${key}`;
}

// Get all posts that need fixing
const [posts] = await conn.query(
  "SELECT id, featuredImageUrl FROM posts WHERE featuredImageUrl LIKE '/manus-storage/wp-media-v2/%' OR featuredImageUrl LIKE '/api/img/%' ORDER BY id"
);

console.log(`Found ${posts.length} posts to fix`);

// Build filename -> post IDs map
const filenameToPostIds = new Map();
for (const post of posts) {
  const filename = post.featuredImageUrl
    .replace('/manus-storage/wp-media-v2/', '')
    .replace('/api/img/', '');
  if (!filenameToPostIds.has(filename)) filenameToPostIds.set(filename, []);
  filenameToPostIds.get(filename).push(post.id);
}

const filenames = Array.from(filenameToPostIds.keys());
console.log(`Unique filenames: ${filenames.length}`);

// Download all from SFTP in one batch (index already built)
console.log('Downloading from Fasthosts SFTP...');
const SFTP_SCRIPT = '/home/ubuntu/xtz-news/sftp_bulk_download.py';
let sftpResults = {};

try {
  const output = execSync(
    `python3 ${SFTP_SCRIPT} '${JSON.stringify(filenames).replace(/'/g, "'\\''")}'`,
    { timeout: 600000, maxBuffer: 50 * 1024 * 1024 }
  ).toString();
  // Extract the last JSON line
  const lines = output.trim().split('\n');
  const jsonLine = lines[lines.length - 1];
  sftpResults = JSON.parse(jsonLine);
  console.log(`SFTP download complete`);
} catch (e) {
  console.error(`SFTP download failed: ${e.message}`);
  process.exit(1);
}

// Upload to Manus Storage v3
let success = 0, failed = 0;

for (const [filename, localPath] of Object.entries(sftpResults)) {
  if (!localPath) {
    console.log(`  ✗ Not found on SFTP: ${filename}`);
    failed++;
    continue;
  }
  
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
    
    // Update all posts with this filename
    const postIds = filenameToPostIds.get(filename);
    for (const postId of postIds) {
      await conn.query('UPDATE posts SET featuredImageUrl = ? WHERE id = ?', [newUrl, postId]);
    }
    
    success++;
    if (success % 100 === 0) {
      console.log(`Progress: ${success}/${filenames.length} uploaded (${failed} failed)`);
    }
  } catch (e) {
    console.log(`  ✗ Upload error for ${filename}: ${e.message}`);
    failed++;
  }
  
  // Small delay to avoid rate limiting
  await new Promise(r => setTimeout(r, 50));
}

console.log(`\n✅ Complete: ${success} images fixed, ${failed} failed`);
await conn.end();
