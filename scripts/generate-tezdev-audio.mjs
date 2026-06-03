import { createConnection } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DB_URL = process.env.DATABASE_URL;
const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!DB_URL) throw new Error('DATABASE_URL not set');
if (!ELEVEN_KEY) throw new Error('ELEVENLABS_API_KEY not set');

const GEORGE_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb';
const SLUG = 'tezos-x-solidity-michelson-dual-runtime-tezdev-2026';

// Connect to DB and get article
const url = new URL(DB_URL);
const conn = await createConnection({
  host: url.hostname,
  port: parseInt(url.port || '4000'),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
});

const [rows] = await conn.execute('SELECT title, content FROM posts WHERE slug = ?', [SLUG]);
const post = rows[0];
if (!post) throw new Error('Article not found');

console.log('Article:', post.title);

// Strip HTML and clean text for speech
let text = post.content
  // Remove iframe/video embeds
  .replace(/<div[^>]*>[\s\S]*?<\/div>/gi, (match) => {
    if (match.includes('iframe') || match.includes('youtube')) return '';
    return match;
  })
  // Strip all HTML tags
  .replace(/<[^>]+>/g, ' ')
  // Decode HTML entities
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, ' ')
  // Clean up whitespace
  .replace(/\s+/g, ' ')
  .trim();

// Add title at the start
text = `${post.title}. ${text}`;

// ElevenLabs has a 5000 character limit per request — split if needed
const MAX_CHARS = 4500;
const chunks = [];
let remaining = text;
while (remaining.length > 0) {
  if (remaining.length <= MAX_CHARS) {
    chunks.push(remaining);
    break;
  }
  // Find a sentence boundary near the limit
  const cutPoint = remaining.lastIndexOf('. ', MAX_CHARS);
  if (cutPoint === -1) {
    chunks.push(remaining.slice(0, MAX_CHARS));
    remaining = remaining.slice(MAX_CHARS);
  } else {
    chunks.push(remaining.slice(0, cutPoint + 1));
    remaining = remaining.slice(cutPoint + 2);
  }
}

console.log(`Text length: ${text.length} chars, ${chunks.length} chunk(s)`);

// Generate audio for each chunk
const audioBuffers = [];
for (let i = 0; i < chunks.length; i++) {
  console.log(`Generating chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)...`);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${GEORGE_VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVEN_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text: chunks[i],
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error: ${res.status} ${err}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  audioBuffers.push(buffer);
  console.log(`Chunk ${i + 1} done: ${buffer.length} bytes`);
}

// Combine chunks if multiple
let finalBuffer;
if (audioBuffers.length === 1) {
  finalBuffer = audioBuffers[0];
} else {
  // Concatenate MP3 buffers (simple concatenation works for MP3)
  finalBuffer = Buffer.concat(audioBuffers);
}

// Save locally first
const tmpPath = `/tmp/tezdev-audio-${Date.now()}.mp3`;
fs.writeFileSync(tmpPath, finalBuffer);
console.log(`Audio saved locally: ${tmpPath} (${finalBuffer.length} bytes)`);

// Upload to Manus Storage
console.log('Uploading to Manus Storage...');
const uploadResult = execSync(`manus-upload-file --webdev ${tmpPath}`, { encoding: 'utf-8' });
console.log('Upload result:', uploadResult.trim());

// Extract the storage path from the output
const storagePathMatch = uploadResult.match(/Storage Path: (\/manus-storage\/[^\s]+)/);
if (!storagePathMatch) throw new Error('Could not extract storage path from upload output');
const storagePath = storagePathMatch[1];
console.log('Storage path:', storagePath);

// Update the article with the audioUrl
await conn.execute('UPDATE posts SET audioUrl = ?, updatedAt = NOW() WHERE slug = ?', [storagePath, SLUG]);
console.log('Article updated with audioUrl:', storagePath);

// Cleanup
fs.unlinkSync(tmpPath);
await conn.end();
console.log('Done! Audio is now live on the article.');
