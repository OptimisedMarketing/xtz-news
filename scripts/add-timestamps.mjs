import { createConnection } from 'mysql2/promise';

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error('DATABASE_URL not set');

const url = new URL(DB_URL);
const conn = await createConnection({
  host: url.hostname,
  port: parseInt(url.port || '4000'),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
});

// Fetch current content
const [rows] = await conn.execute(
  "SELECT content FROM posts WHERE slug = 'tezos-x-solidity-michelson-dual-runtime-tezdev-2026'"
);
let content = rows[0]?.content || '';

// Timestamps from video analysis (quote fragment -> timestamp in seconds)
const timestamps = [
  { fragment: 'On Tezos X, you can build in Solidity and Michelson', seconds: 126 },  // 02:06
  { fragment: 'kernel defines the logic', seconds: 484 },  // 08:04
  { fragment: 'gateway that provides some kind of abstraction', seconds: 534 },  // 08:54
  { fragment: 'call an EVM contract, it will work in two steps', seconds: 558 },  // 09:18
  { fragment: 'famous protocol called HTTP', seconds: 599 },  // 09:59
  { fragment: 'Michelson is still a beautiful language', seconds: 383 },  // 06:23
  { fragment: 'AI agents were able to prove', seconds: 420 },  // 07:00
  { fragment: 'formal verification can be a security primitive', seconds: 453 },  // 07:33
  { fragment: 'Baking Bad', seconds: 614 },  // 10:14
  { fragment: "smart contract doesn't change", seconds: 330 },  // 05:30
  { fragment: "smart contract does not change", seconds: 330 },  // 05:30 (alternate)
  { fragment: 'One wallet, no need to have two wallets', seconds: 633 },  // 10:33
  { fragment: 'testnet in April 2026', seconds: 677 },  // 11:17
  { fragment: 'what will you do with it', seconds: 697 },  // 11:37
];

// Helper to convert seconds to MM:SS
function toTimestamp(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// Helper to convert seconds to YouTube URL with t= parameter
function toYTUrl(s) {
  return `https://youtu.be/zh6Ov2RObK0?t=${s}`;
}

// Update each <cite> tag that follows a blockquote containing the matching quote fragment
// Strategy: find blockquotes, check their content, update their cite
let updated = content;

for (const { fragment, seconds } of timestamps) {
  // Find blockquotes containing this fragment
  const fragmentLower = fragment.toLowerCase();
  
  // Replace cite tags in blockquotes that contain this fragment
  // Pattern: find the blockquote containing the fragment, then update its cite
  const blockquoteRegex = /<blockquote>([\s\S]*?)<\/blockquote>/gi;
  updated = updated.replace(blockquoteRegex, (match, inner) => {
    if (inner.toLowerCase().includes(fragmentLower)) {
      // Add timestamp to cite if not already there
      if (inner.includes('<cite>') && !inner.includes('youtu.be')) {
        const ts = toTimestamp(seconds);
        const ytUrl = toYTUrl(seconds);
        return match.replace(
          /<cite>(.*?)<\/cite>/,
          `<cite>$1 — <a href="${ytUrl}" target="_blank" rel="noopener noreferrer" style="color:#2c7df7;font-style:normal;text-decoration:none;font-size:0.68rem;">▶ ${ts}</a></cite>`
        );
      }
    }
    return match;
  });
}

// Count how many cites were updated
const originalCiteCount = (content.match(/<cite>/g) || []).length;
const updatedCiteCount = (updated.match(/youtu\.be/g) || []).length;
console.log(`Updated ${updatedCiteCount} of ${originalCiteCount} blockquote cites with timestamps`);

await conn.execute(
  "UPDATE posts SET content=?, updatedAt=NOW() WHERE slug=?",
  [updated, 'tezos-x-solidity-michelson-dual-runtime-tezdev-2026']
);

await conn.end();
console.log('Done!');
