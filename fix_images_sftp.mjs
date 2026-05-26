/**
 * Download all WordPress images from Fasthosts SFTP and re-upload to Manus Storage
 * with correct MIME types. Updates database URLs to /manus-storage/wp-media-v3/...
 * 
 * This is the definitive fix - images come directly from the original server
 * so they are guaranteed to be real image bytes with correct content.
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import os from 'os';

dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const require = createRequire(import.meta.url);
const paramiko = null; // We'll use child_process to run Python for SFTP

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const SFTP_HOST = 'access-5016615871.webspace-host.com';
const SFTP_USER = 'a2363231';
const SFTP_PASS = "Ya7jz}u+H)fGVSy$";

const MIME_TYPES = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
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

// Get all posts that need fixing (currently have wp-media-v2 URLs which are corrupted)
const [posts] = await conn.query(
  "SELECT id, featuredImageUrl FROM posts WHERE featuredImageUrl LIKE '/manus-storage/wp-media-v2/%' OR featuredImageUrl LIKE '/api/img/%' ORDER BY id"
);

console.log(`Found ${posts.length} posts to fix via SFTP`);

// Extract unique filenames needed
const filenameToPostIds = new Map();
for (const post of posts) {
  const filename = post.featuredImageUrl
    .replace('/manus-storage/wp-media-v2/', '')
    .replace('/api/img/', '');
  if (!filenameToPostIds.has(filename)) {
    filenameToPostIds.set(filename, []);
  }
  filenameToPostIds.get(filename).push(post.id);
}

console.log(`Unique filenames to download: ${filenameToPostIds.size}`);

// Write a Python SFTP download script
const pythonScript = `
import paramiko
import os
import sys
import json

SFTP_HOST = '${SFTP_HOST}'
SFTP_USER = '${SFTP_USER}'
SFTP_PASS = '${SFTP_PASS.replace(/'/g, "\\'")}'
TMPDIR = '${os.tmpdir()}/wp-images'

os.makedirs(TMPDIR, exist_ok=True)

filenames = json.loads(sys.argv[1])

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(SFTP_HOST, port=22, username=SFTP_USER, password=SFTP_PASS, timeout=30)
sftp = ssh.open_sftp()

results = {}
for filename in filenames:
    local_path = os.path.join(TMPDIR, filename)
    
    # Skip if already downloaded
    if os.path.exists(local_path) and os.path.getsize(local_path) > 100:
        results[filename] = local_path
        continue
    
    # Search for the file in uploads directory
    # The filename has a hash suffix like: originalname_HASH.ext
    # The original name (without hash) is the WordPress filename
    # Strip the hash: filename_HASH.ext -> filename.ext
    import re
    base_with_hash = os.path.splitext(filename)[0]  # remove extension
    ext = os.path.splitext(filename)[1]  # get extension
    # Remove the hash suffix (last _XXXXXXXX part)
    base_no_hash = re.sub(r'_[a-f0-9]{8}$', '', base_with_hash)
    wp_filename = base_no_hash + ext
    
    found = False
    for year in ['2025', '2024', '2023', '2022', '2021', '2020', '2026']:
        try:
            months = sftp.listdir(f'uploads/{year}')
            for month in sorted(months, reverse=True):
                try:
                    remote_path = f'uploads/{year}/{month}/{wp_filename}'
                    sftp.stat(remote_path)
                    sftp.get(remote_path, local_path)
                    results[filename] = local_path
                    found = True
                    break
                except:
                    pass
            if found:
                break
        except:
            pass
    
    if not found:
        results[filename] = None

sftp.close()
ssh.close()

print(json.dumps(results))
`;

const scriptPath = '/tmp/sftp_download.py';
fs.writeFileSync(scriptPath, pythonScript);

// Process in batches of 50
const filenames = Array.from(filenameToPostIds.keys());
let success = 0, failed = 0;

for (let i = 0; i < filenames.length; i += 50) {
  const batch = filenames.slice(i, i + 50);
  
  // Run Python SFTP download
  const { execSync } = await import('child_process');
  let results;
  try {
    const output = execSync(
      `python3 ${scriptPath} '${JSON.stringify(batch).replace(/'/g, "'\\''")}'`,
      { timeout: 120000, maxBuffer: 10 * 1024 * 1024 }
    ).toString().trim();
    results = JSON.parse(output);
  } catch (e) {
    console.log(`Batch ${i}-${i+50} SFTP error: ${e.message}`);
    continue;
  }
  
  // Upload each downloaded file to Manus Storage
  for (const [filename, localPath] of Object.entries(results)) {
    if (!localPath) {
      console.log(`  ✗ Not found on SFTP: ${filename}`);
      failed++;
      continue;
    }
    
    try {
      const buffer = fs.readFileSync(localPath);
      if (buffer.length < 100) throw new Error(`File too small: ${buffer.length}`);
      
      // Verify it's actually an image (not HTML)
      const header = buffer.slice(0, 10).toString('hex');
      const isHtml = buffer.slice(0, 15).toString().toLowerCase().includes('<!doctype');
      if (isHtml) throw new Error('File is HTML, not an image');
      
      const mimeType = getMimeType(filename);
      const key = `wp-media-v3/${filename}`;
      const newUrl = await storagePut(key, buffer, mimeType);
      
      // Update all posts with this filename
      const postIds = filenameToPostIds.get(filename);
      for (const postId of postIds) {
        await conn.query('UPDATE posts SET featuredImageUrl = ? WHERE id = ?', [newUrl, postId]);
      }
      
      success++;
      if (success % 50 === 0) {
        console.log(`Progress: ${success}/${filenames.length} uploaded (${failed} failed)`);
      }
    } catch (e) {
      console.log(`  ✗ Upload error for ${filename}: ${e.message}`);
      failed++;
    }
  }
  
  console.log(`Batch ${i}-${Math.min(i+50, filenames.length)} done. Total: ${success} success, ${failed} failed`);
}

console.log(`\n✅ Complete: ${success} images fixed, ${failed} failed`);
await conn.end();
