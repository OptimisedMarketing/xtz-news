/**
 * Seed all 54 Tezos projects into the database.
 * Clears existing projects first, then inserts all new ones.
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const projects = JSON.parse(readFileSync('/home/ubuntu/xtz-migration/tezos_projects_final.json', 'utf8'));

// Clear existing projects
await conn.query('DELETE FROM post_categories WHERE categoryId IN (SELECT id FROM categories WHERE slug = "tezos-projects")');
await conn.query('DELETE FROM projects');
console.log('Cleared existing projects');

// Category logo/image map for well-known projects
const LOGO_URLS = {
  'quipuswap': 'https://light-power-29443cc779.media.strapiapp.com/quipuswap_94fb55007d.svg',
  'smartpy': 'https://light-power-29443cc779.media.strapiapp.com/smartpy_4fea58b5c3.svg',
  'taquito': 'https://light-power-29443cc779.media.strapiapp.com/taquito_2x_994d8301f6.webp',
  'teia': 'https://light-power-29443cc779.media.strapiapp.com/teia_2x_bc80f2fc1b.webp',
  'tether-usdt': 'https://light-power-29443cc779.media.strapiapp.com/tether_9b6daaa203.svg',
  'stables': 'https://light-power-29443cc779.media.strapiapp.com/Logo_Stables_Neon_500_500_c2c861b89d.jpg',
  'sugar-gaming': 'https://light-power-29443cc779.media.strapiapp.com/sugar_gaming_2x_19d500b321.webp',
  'raster': 'https://light-power-29443cc779.media.strapiapp.com/Raster_edf4709db4.webp',
  'objkt': 'https://objkt.com/assets/objkt-logo.svg',
};

// Category order for featured display
const FEATURED_SLUGS = ['quipuswap', 'youves', 'objkt', 'etherlink', 'tezos-domains', 'kolibri', 'teia', 'fxhash', 'dogami', 'crunchy', '3route', 'temple-wallet'];

let inserted = 0;
for (const p of projects) {
  const tags = JSON.stringify(p.tags || []);
  const isFeatured = FEATURED_SLUGS.includes(p.slug) ? 1 : 0;
  const logoUrl = LOGO_URLS[p.slug] || null;
  
  try {
    await conn.query(
      `INSERT INTO projects 
       (title, slug, category, content, excerpt, websiteUrl, twitter, github, discord, telegram, featuredImageUrl, shortDescription, tags, status, featured, viewCount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'publish', ?, 0, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         content = VALUES(content),
         excerpt = VALUES(excerpt),
         websiteUrl = VALUES(websiteUrl),
         twitter = VALUES(twitter),
         tags = VALUES(tags),
         featured = VALUES(featured),
         updatedAt = NOW()`,
      [
        p.name,
        p.slug,
        p.category,
        p.description || p.description_raw,
        (p.description || p.description_raw || '').substring(0, 300),
        p.website || null,
        p.twitter || null,
        p.github || null,
        p.discord || null,
        p.telegram || null,
        logoUrl,
        (p.description || p.description_raw || '').substring(0, 200),
        tags,
        isFeatured
      ]
    );
    inserted++;
    console.log(`✓ ${p.name} (${p.category})`);
  } catch (e) {
    console.error(`✗ ${p.name}: ${e.message}`);
  }
}

console.log(`\n✓ Inserted ${inserted}/${projects.length} projects`);

// Verify
const [count] = await conn.query('SELECT COUNT(*) as cnt FROM projects');
console.log(`Total projects in DB: ${count[0].cnt}`);

await conn.end();
