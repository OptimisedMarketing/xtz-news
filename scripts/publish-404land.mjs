/**
 * Publish 404_LAND article — generate AI image + rewrite with Claude + publish to DB
 */
import { createConnection } from "mysql2/promise";
import { randomBytes } from "crypto";

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

// ── 1. Use provided image (already uploaded to Manus Storage) ────────────────
const storedImageUrl = "/manus-storage/pasted_file_16tAXj_image_a53559a0.webp";
console.log("Using provided image:", storedImageUrl);

// ── 3. Rewrite with Claude ────────────────────────────────────────────────────
console.log("Rewriting article with Claude...");

const SOURCE_CONTENT = `
HEK and the Tezos Foundation are launching 404_LAND, a virtual digital art exhibition opening June 12 and running through August 9, 2026.

The exhibition is curated by Auronda Scalera and Dr. Alfredo Cramerotti.

Six artists are participating: Gabriel Massan, dmstfctn, Varvara & Mar, Hind Al Saad, Kat Zhang the Poet Engineer, and Alida Sun.

Each artist will also release NFTs on Tezos through objkt.com.

HEK and the Tezos Foundation will open 404_LAND, a new virtual group exhibition examining digital error, unstable identity and algorithmic interpretation.

The exhibition opens on June 12, 2026, on HEK's virtual platform and runs through August 9, 2026. It will also have a physical presence at HEK in Basel during Art Basel week.

The show brings together six artists: Gabriel Massan, dmstfctn, Varvara & Mar, Hind Al Saad, Kat Zhang the Poet Engineer, and Alida Sun.

Curated by Auronda Scalera and Dr. Alfredo Cramerotti, 404_LAND takes its name from the HTTP 404 error. But the exhibition does not treat the broken link as a dead end. Instead, it uses the error as a way to explore political disappearance, machine misreading, fragmented memory, data extraction and planetary instability.

HEK's website lists 404_LAND as the first virtual exhibition in its 2026 partnership with the Tezos Foundation. The broader collaboration includes digital art programming, virtual exhibitions and an outdoor presentation tied to Art Basel 2026.

Art Basel's Basel edition is scheduled for June 18–21, 2026, placing the HEK presentation inside one of the global art market's most closely watched weeks.

The exhibition reflects a wider push by cultural institutions to treat blockchain not only as a market infrastructure for NFTs, but also as a distribution, preservation and public-access layer for digital art. Tezos has positioned itself strongly in that field. The blockchain has previously been used in cultural programs involving institutions including Serpentine, Musée d'Orsay and LAS Art Foundation.

404_LAND's participating artists work across machinima, generative systems, AI dialogue, machine vision, interactive simulation and speculative worldbuilding.

Gabriel Massan's Victims, from the ongoing Ball Of Terror series, places the idea of error inside systems of violence and fear. The machinima work builds a looping world of falling bodies, gunfire and suspended motion, presenting terror as routine rather than exception. Massan has previously worked with Serpentine on Tezos-based digital collectibles connected to a custom computer game.

The London-based duo dmstfctn, made up of Oliver Smith and Francesco Tacchini, contributes The Models. The work is described as an infinite interactive simulation featuring two AI-driven characters modelled on Commedia dell'Arte masks. The characters improvise across 26,880 possible scenes, with dialogue generated using access to Supercomputer Leonardo. The piece uses theatre to expose how machine intelligence can appear knowledgeable while still performing obedience, absurdity and misunderstanding.

Varvara & Mar present Everything Is In Your Hands, a webcam-based net.art work. Visitors navigate a glitch system using hand gestures. In the work, signs of love, protest and refusal become keys, data and misreadings, turning participation itself into a form of exposure.

Hind Al Saad, working with Martin Juras and Levi Hammett, presents SELF(ENCODED). The work places the viewer inside a recursive exchange with a machine. Facial features are converted into pixels, patterns and language until the signal becomes difficult for both human and machine to read. The work asks what remains of the self when a face becomes extractable data.

Kat Zhang the Poet Engineer contributes Hypomnemata: Memory is a Flock of Birds. The game-like landscape draws on Hopfield networks, a model of associative memory where memories exist as valleys in an energy landscape. The work frames corrupted or incomplete memory not as failure, but as the beginning of new forms of relation.

Alida Sun's The world isn't ending / Their world is ending expands the show's focus from computational error to climate, social and planetary instability. The work questions who is forced to adapt, who disappears and who gets to continue when systems collapse. Sun's practice includes daily hand-coded generative systems, which she has continued for more than 2,500 days.

The exhibition's interface also follows its theme. 404_LAND will not have a conventional home screen or map. Visitors enter mid-stream and move through six artistic zones connected by thresholds, fragments and atmospheric transitions.

Each artist will also release NFTs on Tezos through objkt.com.

A kiosk inside HEK's Basel lobby will provide public access during the exhibition run, while a virtual opening tour with the curators is scheduled for June 12.
`;

const llmRes = await fetch(`${FORGE_URL}/v1/chat/completions`, {
  method: "POST",
  headers: { "Authorization": `Bearer ${FORGE_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-opus-4-5",
    max_tokens: 4000,
    messages: [
      {
        role: "system",
        content: `You are a senior journalist for XTZ.News, the leading Tezos blockchain news platform. 
Write a compelling, original news article for XTZ.News readers. 
CRITICAL RULES:
- Keep ALL specific facts: dates (June 12, August 9, 2026), all six artist names, all artwork titles, all technical details (26,880 scenes, Supercomputer Leonardo, Hopfield networks, 2,500 days, objkt.com, Art Basel June 18-21)
- Keep all institution names: HEK, Tezos Foundation, Serpentine, Musée d'Orsay, LAS Art Foundation
- Keep curator names: Auronda Scalera, Dr. Alfredo Cramerotti
- Write in a fresh, engaging voice — not a press release
- Structure: compelling lede, context paragraph, curatorial vision, each artist's work described vividly, Tezos ecosystem context, closing
- Use HTML paragraph tags <p> for body text, <h2> for section headers
- No markdown, only HTML
- Length: 600-800 words
- Angle: frame this as a significant moment where Tezos cements its position at the intersection of blockchain infrastructure and serious cultural institutions`
      },
      {
        role: "user",
        content: `Rewrite this article for XTZ.News:\n\n${SOURCE_CONTENT}`
      }
    ]
  }),
});

const llmData = await llmRes.json();
const articleContent = llmData.choices?.[0]?.message?.content || "";
console.log("Article length:", articleContent.length, "chars");
if (!articleContent) {
  console.error("LLM response:", JSON.stringify(llmData).slice(0, 500));
  process.exit(1);
}

// ── 4. Publish to DB ──────────────────────────────────────────────────────────
console.log("Publishing to database...");

const url = new URL(DATABASE_URL.replace("mysql://", "http://"));
const [user, password] = [decodeURIComponent(url.username), decodeURIComponent(url.password)];
const host = url.hostname;
const port = parseInt(url.port) || 4000;
const database = url.pathname.slice(1).split("?")[0];

const conn = await createConnection({
  host, port, user, password, database,
  ssl: { rejectUnauthorized: false },
});

const slug = "404-land-hek-tezos-digital-art-exhibition";
const title = "HEK and Tezos Launch 404_LAND: A Virtual Exhibition Where Digital Error Becomes Art";
const excerpt = "HEK and the Tezos Foundation open 404_LAND on June 12, a virtual group exhibition featuring six artists exploring digital identity, machine vision and political disappearance through the lens of the HTTP 404 error.";
const publishedAt = new Date("2026-05-29T09:00:00Z");

// Check if slug already exists
const [existing] = await conn.execute("SELECT id FROM posts WHERE slug = ?", [slug]);
if (existing.length > 0) {
  console.log("Article already exists, updating...");
  await conn.execute(
    `UPDATE posts SET title=?, content=?, excerpt=?, featuredImageUrl=?, status='publish', publishedAt=? WHERE slug=?`,
    [title, articleContent, excerpt, storedImageUrl, publishedAt, slug]
  );
} else {
  await conn.execute(
    `INSERT INTO posts (title, slug, content, excerpt, featuredImageUrl, status, publishedAt, updatedAt) 
     VALUES (?, ?, ?, ?, ?, 'publish', ?, NOW())`,
    [title, slug, articleContent, excerpt, storedImageUrl, publishedAt]
  );
}

// Get the post ID and add to exhibition category
const [postRows] = await conn.execute("SELECT id FROM posts WHERE slug = ?", [slug]);
const postId = postRows[0]?.id;

if (postId) {
  // Find or create exhibition category
  const [catRows] = await conn.execute("SELECT id FROM categories WHERE slug = 'exhibition'");
  if (catRows.length > 0) {
    const catId = catRows[0].id;
    await conn.execute(
      "INSERT IGNORE INTO post_categories (postId, categoryId) VALUES (?, ?)",
      [postId, catId]
    ).catch(() => {});
    console.log("Added to exhibition category");
  }
}

await conn.end();
console.log(`\n✅ Published: "${title}"`);
console.log(`   Slug: ${slug}`);
console.log(`   Image: ${storedImageUrl}`);
console.log(`   URL: https://xtz.news/${slug}`);
