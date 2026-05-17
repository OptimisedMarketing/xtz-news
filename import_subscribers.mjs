/**
 * Import existing subscribers from CSV into the newsletter_subscribers table.
 * Skips duplicates, invalid emails, and obvious spam/bot addresses.
 */
import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const CSV_PATH = '/home/ubuntu/upload/subscribers_0pvN8ExXEJozR0Gl7m9sNw20221216-4-1s89m1e.csv';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
console.log('Connected to DB');

// Parse CSV
const raw = readFileSync(CSV_PATH, 'utf-8');
const lines = raw.trim().split('\n');
const header = lines[0].split(',');
const emailIdx = header.indexOf('email');
const firstIdx = header.indexOf('first_name');
const lastIdx = header.indexOf('last_name');
const dateIdx = header.indexOf('created_at');

console.log(`CSV rows: ${lines.length - 1}`);

// Known spam/disposable domain patterns to skip
const SPAM_PATTERNS = [
  /\.mailaddress\.site$/i, /\.webmailmeta\.site$/i, /\.inwebmail\.fun$/i,
  /\.officemail\.fun$/i, /\.meta1\.in\.net$/i, /tupop\.online$/i,
  /sretop\.site$/i, /hotmails\.com$/i, /mai1www\./i, /course-fitness\.com$/i,
];

function isValidEmail(email) {
  if (!email || email.length < 5 || email.length > 320) return false;
  if (!email.includes('@') || !email.includes('.')) return false;
  // Basic RFC check
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(email)) return false;
  // Skip obvious spam domains
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(email)) return false;
  }
  return true;
}

let imported = 0;
let skipped = 0;
let invalid = 0;

const BATCH_SIZE = 100;
const validRows = [];

for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',');
  const email = (parts[emailIdx] || '').trim().toLowerCase();
  const firstName = (parts[firstIdx] || '').trim();
  const lastName = (parts[lastIdx] || '').trim();
  const name = [firstName, lastName].filter(Boolean).join(' ') || null;
  const createdAt = (parts[dateIdx] || '').trim().replace(' ', 'T').split('.')[0];

  if (!isValidEmail(email)) {
    invalid++;
    continue;
  }

  validRows.push({ email, name, createdAt });
}

console.log(`Valid rows to import: ${validRows.length} (${invalid} invalid/spam skipped)`);

// Insert in batches
for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
  const batch = validRows.slice(i, i + BATCH_SIZE);
  try {
    const placeholders = batch.map(() => '(?, ?, ?, ?)').join(', ');
    const values = batch.flatMap((r) => [r.email, r.name, 'active', r.createdAt || new Date().toISOString()]);
    await conn.query(
      `INSERT IGNORE INTO newsletter_subscribers (email, name, status, createdAt) VALUES ${placeholders}`,
      values
    );
    imported += batch.length;
    if (imported % 200 === 0) console.log(`  Imported ${imported}...`);
  } catch (e) {
    console.error(`  Batch error at ${i}: ${e.message}`);
    skipped += batch.length;
  }
}

// Final count
const [rows] = await conn.query('SELECT COUNT(*) as total FROM newsletter_subscribers');
const total = rows[0].total;

await conn.end();

console.log('\n' + '='.repeat(50));
console.log('IMPORT COMPLETE');
console.log('='.repeat(50));
console.log(`Processed:   ${validRows.length}`);
console.log(`Invalid/spam: ${invalid}`);
console.log(`Total in DB:  ${total}`);
