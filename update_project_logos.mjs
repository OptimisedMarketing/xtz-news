import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const logos = JSON.parse(readFileSync('/home/ubuntu/xtz-migration/project_logos.json', 'utf8'));

let updated = 0;
for (const [slug, logoUrl] of Object.entries(logos)) {
  if (!logoUrl) continue;
  const [result] = await conn.query(
    'UPDATE projects SET featuredImageUrl = ? WHERE slug = ? AND (featuredImageUrl IS NULL OR featuredImageUrl = "")',
    [logoUrl, slug]
  );
  if (result.affectedRows > 0) {
    updated++;
    console.log(`✓ ${slug}`);
  }
}

console.log(`\n✓ Updated ${updated} project logos`);
await conn.end();
