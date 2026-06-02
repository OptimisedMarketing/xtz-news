/**
 * Publish Art on Tezos Friday Recap article
 * Uses Claude via Manus Forge to rewrite with original voice
 */
import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';

const DB_URL = process.env.DATABASE_URL || readFileSync('/home/ubuntu/xtz-cron/xtz-spotlight.env', 'utf8')
  .split('\n').find(l => l.startsWith('DATABASE_URL='))?.split('=').slice(1).join('=') || '';

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

async function invokeLLM(messages) {
  const res = await fetch(`${FORGE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${FORGE_KEY}` },
    body: JSON.stringify({ model: 'claude-opus-4-5', messages, max_tokens: 4000 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

const rawContent = `
Art on Tezos Friday Recap — May 29, 2026

This week's Art on Tezos Friday Recap brings together a rich collection of institutional acquisitions, community milestones, upcoming exhibitions, and platform updates from across the Tezos art ecosystem.

INSTITUTIONAL ACQUISITION: FRANCISCO CAROLINUM LINZ
The Francisco Carolinum in Linz (OÖ Kulturquartier) has acquired works from four artists facilitated and curated by The Second-Guess collective: madebyoona, Boris Eldagsen, Jess Tucker (akajesstucker), and Francis Ost. The Second-Guess is a Berlin and Los Angeles-based curatorial collective that explores the relationship between humans and technology. Boris Eldagsen is particularly notable — the German artist who famously won and then turned down a Sony World Photography Award in 2023 for an AI-generated image, sparking global debate about AI in photography. This acquisition marks a significant moment for Tezos NFTs entering a major European cultural institution.

TEIA COMMUNITY: CYCLES AT NFC SUMMIT LISBON
Teia Community has announced the 20 artists selected for Cycles, an upcoming exhibition presented with Art on Tezos during the NFC Summit in Lisbon (June 4-6, 2026). NFC Summit 2026 is a major digital culture festival taking place at the Unicorn Factory Lisboa — a 50,000 sq m former agro-industrial complex — where art is the central focus for the first time. The summit sits between the Venice Biennale opening and Art Basel, positioning Tezos art at the heart of the international art calendar.

HEK BASEL × TEZOS FOUNDATION: QUAYOLA EN PLEIN AIR AT ART BASEL
The HEK Basel × Tezos Foundation reception for Quayola's "En plein air" has been announced for Art Basel week (June 15-21, 2026). The outdoor installation will be presented at HEK (House of Electronic Arts) in Münchenstein/Basel, with a reception event on June 17. Quayola is also launching "Provenance", a new release on objkt.one, on June 17. This marks the second major Tezos Foundation × HEK collaboration of 2026, following the 404_LAND virtual exhibition opening June 12.

PROOF OF PALM 2026: MIDPOINT STATISTICS
absurdeity shared midpoint statistics for #ProofOfPalm2026 via NFTBiker: 406 artists participated, 737 artworks minted, 542 artworks sold, and more than 18,600 tez in sales — with several days still remaining before the May 31 close. Art on Tezos also announced the three guest collectors for the Proof of Palm #TezosTuesday initiative: FereshtehFarma3, taimei_886, and ivnhgo, each receiving 300 tez to collect from the event.

404_LAND ARTIST LINE-UP ANNOUNCED
The artist line-up for 404_LAND at VIRTUAL HEK has been announced. The group exhibition — where error becomes both metaphor and framework — opens June 12 on virtual.hek.ch and runs through August 9. Curated by Auronda Scalera and Dr. Alfredo Cramerotti (curatorview), the exhibition explores what happens when identity, memory, and meaning break down online.

OBJKT PLATFORM UPDATE
Tezos Commons published a deep dive into the latest objkt.com platform update, highlighting improvements to discovery, usability, and the overall collecting experience. Additionally, objkt announced #FYP (For Your Page), a group exhibition at NFC Summit exploring GIFs, loops, and contemporary image circulation. The release opens June 5 and features 20 artists working with loop-based media.

COMMUNITY EVENTS
- Tezos Commons announced this week's Artz Friday Community Call, celebrating #ProofOfPalm and inviting the community to share their palm-themed creations. Hosted by YinYangYoeshi and Crypt0nio.
- objkt featured coneheadsquid as Collector of the Week #47, discussing experimentation, glitches, digital textures, and collecting as a dialogue with artists.
- #lookattheflowerstez, organized by BonsaiFox1, began this week with a theme centered on flowers with a darker twist.
- Fabrizio Brarez published a new edition of Seen By Brarez, spotlighting Luciana Guerra and her practice navigating the space between surrealism and abstraction.
- artcommissiontz's Streets edition auctions featured 20 works selected by 328_lad, spike_0124 and guest curators WildMissingNos and photonisdead.
- Benjamin Bardou's "A Work In Progress" — a continuously evolving artwork generated in real time.
- Generated Flowrs series by V4wEnko — abstract organic GLB flowers generated with custom codes.
- "Repression" by ZerorezeroA, curated by hartverse, presenting digitally transformed paintings created during a period of political repression in Serbia.
- ELSEWHERE — a community curation bringing together more than 160 artists exploring realities shaped entirely through imagination, organized by Boundless8D.
`;

async function main() {
  console.log('Rewriting article with Claude...');
  
  const article = await invokeLLM([
    {
      role: 'system',
      content: `You are a senior arts journalist writing for XTZ.News, the leading Tezos blockchain news platform. 
Write in a professional, engaging editorial style — clear, informative, and enthusiastic about the Tezos art ecosystem without being promotional. 
Use complete paragraphs, not bullet points. Include specific details from the source material.
Write HTML-formatted content suitable for a news article body. Use <p>, <h2>, <h3>, <strong>, <em> tags.
Do not include a title in the content — just the article body starting with the first paragraph.
Aim for approximately 800-1000 words.`
    },
    {
      role: 'user',
      content: `Rewrite this Art on Tezos Friday Recap as a polished news article for XTZ.News. Keep all specific facts, names, numbers, and dates. Write in third person. Make it feel like a proper news roundup, not a social media recap:\n\n${rawContent}`
    }
  ]);

  console.log('Article generated, length:', article.length);

  // Connect to DB
  const url = new URL(DB_URL.replace('mysql://', 'http://'));
  const sslParam = DB_URL.includes('ssl=') ? DB_URL.split('ssl=')[1] : null;
  const sslConfig = sslParam ? JSON.parse(decodeURIComponent(sslParam)) : { rejectUnauthorized: true };
  
  const conn = await createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 4000,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1).split('?')[0],
    ssl: sslConfig,
  });

  const slug = 'art-on-tezos-friday-recap-may-29-2026';
  const title = 'Art on Tezos Friday Recap: Francisco Carolinum Acquisition, Proof of Palm Milestones, and NFC Summit Previews';
  const excerpt = 'This week\'s Art on Tezos Friday Recap covers the Francisco Carolinum Linz\'s NFT acquisitions, Teia\'s Cycles exhibition at NFC Summit Lisbon, Quayola\'s En plein air at Art Basel, and Proof of Palm 2026 midpoint statistics.';
  const imageUrl = '/manus-storage/pasted_file_16tAXj_image_a53559a0.webp'; // reuse 404_LAND image as placeholder

  // Check if exists
  const [existing] = await conn.execute('SELECT id FROM posts WHERE slug = ?', [slug]);
  if (existing.length > 0) {
    console.log('Article already exists, updating...');
    await conn.execute(
      'UPDATE posts SET title = ?, content = ?, excerpt = ?, status = "publish", published_at = NOW() WHERE slug = ?',
      [title, article, excerpt, slug]
    );
  } else {
    await conn.execute(
      `INSERT INTO posts (title, slug, content, excerpt, featuredImageUrl, status, publishedAt, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 'publish', NOW(), NOW(), NOW())`,
      [title, slug, article, excerpt, imageUrl]
    );
  }

  // Get post ID
  const [rows] = await conn.execute('SELECT id FROM posts WHERE slug = ?', [slug]);
  const postId = rows[0].id;

  // Assign to Art category (create if doesn't exist)
  let [catRows] = await conn.execute("SELECT id FROM categories WHERE slug = 'art'");
  let catId;
  if (catRows.length === 0) {
    const [result] = await conn.execute(
      "INSERT INTO categories (name, slug, description, createdAt) VALUES ('Art', 'art', 'Tezos digital art, NFTs, exhibitions, and creative ecosystem news', NOW())"
    );
    catId = result.insertId;
    console.log('Created Art category, id:', catId);
  } else {
    catId = catRows[0].id;
    console.log('Using existing Art category, id:', catId);
  }

  // Link post to category
  await conn.execute(
    'INSERT IGNORE INTO post_categories (postId, categoryId) VALUES (?, ?)',
    [postId, catId]
  );

  // Also assign to NFT category if exists
  const [nftCat] = await conn.execute("SELECT id FROM categories WHERE slug = 'nft' OR name LIKE '%NFT%' LIMIT 1");
  if (nftCat.length > 0) {
    await conn.execute('INSERT IGNORE INTO post_categories (postId, categoryId) VALUES (?, ?)', [postId, nftCat[0].id]);
  }

  await conn.end();
  console.log('✓ Article published:', title);
  console.log('  Slug:', slug);
  console.log('  Post ID:', postId);
  console.log('  Category ID:', catId);
}

main().catch(console.error);
