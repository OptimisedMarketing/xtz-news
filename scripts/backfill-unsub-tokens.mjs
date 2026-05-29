/**
 * One-time script: backfill unsubToken for all existing newsletter subscribers
 * Run: node scripts/backfill-unsub-tokens.mjs
 */
import { createConnection } from "mysql2/promise";
import { randomBytes } from "crypto";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Parse TiDB connection string
const url = new URL(DATABASE_URL.replace("mysql://", "http://"));
const [user, password] = url.username
  ? [decodeURIComponent(url.username), decodeURIComponent(url.password)]
  : ["", ""];
const host = url.hostname;
const port = parseInt(url.port) || 4000;
const database = url.pathname.slice(1).split("?")[0];

const conn = await createConnection({
  host, port, user, password, database,
  ssl: { rejectUnauthorized: false },
});

console.log("Connected to database");

// Fetch all subscribers without a token
const [rows] = await conn.execute(
  "SELECT id, email FROM newsletter_subscribers WHERE unsubToken IS NULL"
);

console.log(`Found ${rows.length} subscribers without unsubToken`);

let updated = 0;
for (const row of rows) {
  const token = randomBytes(32).toString("hex");
  await conn.execute(
    "UPDATE newsletter_subscribers SET unsubToken = ? WHERE id = ? AND unsubToken IS NULL",
    [token, row.id]
  );
  updated++;
  if (updated % 100 === 0) {
    console.log(`Updated ${updated}/${rows.length}...`);
  }
}

console.log(`Done! Generated tokens for ${updated} subscribers.`);
await conn.end();
