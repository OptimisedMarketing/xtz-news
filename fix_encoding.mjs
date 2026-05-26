import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get all posts with encoding issues
const [posts] = await conn.query("SELECT id, title FROM posts WHERE title LIKE '%Â%' OR title LIKE '%â€%'");
console.log(`Found ${posts.length} posts with encoding issues`);

let fixed = 0;
for (const post of posts) {
  let title = post.title;
  
  // Fix common UTF-8 double-encoding artifacts
  // These occur when UTF-8 text is read as Latin-1
  title = title
    .replace(/Â\u00a0/g, ' ')   // non-breaking space
    .replace(/Â /g, ' ')          // Â followed by space
    .replace(/â€"/g, '–')         // em dash
    .replace(/â€™/g, '\u2019')    // right single quote
    .replace(/â€œ/g, '\u201c')    // left double quote
    .replace(/â€\u009d/g, '\u201d') // right double quote
    .replace(/â€¦/g, '…')         // ellipsis
    .replace(/Â£/g, '£')          // pound sign
    .replace(/Â©/g, '©')          // copyright
    .replace(/Â®/g, '®')          // registered
    .replace(/â€"â€"/g, '—')      // em dash doubled
    .trim();
  
  if (title !== post.title) {
    await conn.query('UPDATE posts SET title = ? WHERE id = ?', [title, post.id]);
    fixed++;
    console.log(`Fixed: "${post.title}" -> "${title}"`);
  }
}

console.log(`\nFixed ${fixed} titles`);

// Also fix the pipeline script to clean titles before saving
// Check remaining issues
const [[{remaining}]] = await conn.query("SELECT COUNT(*) as remaining FROM posts WHERE title LIKE '%Â%'");
console.log(`Remaining with Â: ${remaining}`);

await conn.end();
