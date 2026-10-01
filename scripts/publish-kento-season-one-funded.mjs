import { readFile } from "node:fs/promises";
import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const featuredImageUrl = "/manus-storage/kento-season-01-funded-feature_992b2d03.png";
const artistDataUrl = new URL("../references/kento-season-one-artist-profiles-2026-10-01.json", import.meta.url);
const artistData = JSON.parse(await readFile(artistDataUrl, "utf8"));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function displayArtistName(name) {
  return name.replace(/ (USA|United States|United Kingdom|England|France|Germany|Turkey|Mexico|Indonesia|Argentina|Netherlands|India|South Korea|Poland|Brazil|Serbia|Japan|Philippines|Denmark|Canada|China\/Canada|US|Austria)$/, "");
}

const artistLinks = artistData.artists.map((artist) => {
  const objktUrl = artist.objktProfiles[0];
  const destination = objktUrl || artist.kentoUrl;
  const label = objktUrl ? "Objkt profile" : "Kento artist page";
  return `<li><a href="${escapeHtml(destination)}" target="_blank" rel="noopener noreferrer">${escapeHtml(displayArtistName(artist.name))}</a><span class="artist-profile-note"> · ${label}</span></li>`;
}).join("\n");

const linkedObjktCount = artistData.artists.filter((artist) => artist.objktProfiles.length > 0).length;

const article = {
  title: "Kento Season 01 Finishes Funded: 951 Backers Pledge About $215,920",
  slug: "kento-season-one-funded-951-backers-215920",
  excerpt: "Kento says 951 backers pledged approximately $215,920 to fund its First Edition Web Nostalgia art-card collection, which brings 40 artists and 117 cards into the project’s first season.",
  seoTitle: "Kento Season 01 Funded: 951 Backers Pledge $215,920 | XTZ.News",
  seoDescription: "Kento says its Web Nostalgia Kickstarter ended funded with 951 backers pledging approximately $215,920. See the 40-artist roster and verified Objkt profile links.",
  featuredImageAlt: "Kento Season 1 Web Nostalgia physical art-card display box and foil packs presented on a dark neon editorial set",
  featuredImageCredit: "XTZ.News image edit based on a Kento product image supplied by XTZ.News",
  featuredImageSourceUrl: "https://kento.art/",
  authorSlug: "lee-evans",
  keyTakeaways: [
    "Kento says 951 backers pledged approximately US$215,920 to fund Season 01: Web Nostalgia.",
    "The Kickstarter First Edition is exclusive to campaign backers; Kento says pre-sales will open later through kento.art.",
    "The finished Season 01 roster includes 117 physical cards by 40 artists across seven rarities.",
    `Kento artist pages publicly linked ${linkedObjktCount} of the 40 artists to Objkt profiles when XTZ.News checked them on 1 October 2026.`,
  ].map((item) => `- ${item}`).join("\n"),
  content: `
<p><strong>Kento says its first Kickstarter campaign has closed funded, with 951 backers pledging approximately US$215,920 for Season 01: Web Nostalgia.</strong> The physical art-card project, created by the team behind Tezos digital-art marketplace <a href="https://objkt.com/" target="_blank" rel="noopener noreferrer">objkt</a>, announced the final figure on 1 October and thanked the campaign’s supporters and 40 participating artists.</p>

<p>The figure is attributed to <a href="https://x.com/kentocards/status/2105642726704435640" target="_blank" rel="noopener noreferrer">Kento’s campaign-close post</a>, which describes the First Edition as funded. Kento also says that while pre-sales will open later at <a href="https://kento.art/" target="_blank" rel="noopener noreferrer">kento.art</a>, the Kickstarter First Edition will remain exclusive to people who backed the campaign.</p>

<h2>From early momentum to a funded first season</h2>

<p>This is the next chapter after Kento’s early campaign momentum, which XTZ.News covered when the project had passed $100,000 in its first 24 hours. The campaign-close announcement moves the story from a live crowdfunding milestone to a stated funded outcome: 951 backers and approximately $215,920 pledged.</p>

<p>The closing post also confirms the season’s scope: <strong>Web Nostalgia</strong>, a collection of physical cards built around original work by 40 artists. Kento’s official catalogue lists <strong>117 cards</strong> across Common, Uncommon, Rare, Ultra Rare, Secret Rare, Grail and Promo rarities. The project presents the cards as physical collecting objects with a route back to the linked digital art through its published QR and scratch-off claim system.</p>

<figure class="article-source-visual">
  <img src="${featuredImageUrl}" alt="Kento Season 1 Web Nostalgia physical art-card display box and foil packs on a dark neon set" loading="lazy" />
  <figcaption>XTZ.News image edit based on a Kento product image supplied by XTZ.News. Product artwork and marks remain Kento’s.</figcaption>
</figure>

<h2>What happens after the campaign</h2>

<p>Kento’s public update says the campaign edition is closed to new backers. That does not make the project’s future inventory or delivery schedule a certainty: prospective collectors should rely on Kento’s own store, campaign updates and published terms for current availability, production and fulfilment information. The project says pre-sales are planned, but has not given a full public pre-sale timetable in the campaign-close post.</p>

<p>For the Tezos art scene, the finished campaign is a practical proof point for a format that brings physical packs, artist discovery and a digital collecting path into the same project. The announced figure should not be treated as a valuation or a resale forecast; it is Kento’s reported crowdfunding result for this particular first season.</p>

<h2>Season 01 artist roster and Objkt links</h2>

<p>Kento’s official artist directory lists 40 artists. XTZ.News checked the public profile pages on 1 October 2026: <strong>${linkedObjktCount} pages linked directly to Objkt profiles</strong>. Where a direct Objkt profile was not linked from Kento’s public page, the name below instead goes to Kento’s artist page rather than guessing an address. This is a directory for discovery, not a claim that every artist has the same marketplace activity or availability.</p>

<ul class="article-artist-directory">
${artistLinks}
</ul>

<h2>Where to read more</h2>

<p>Readers can revisit XTZ.News’ <a href="/kento-objkt-physical-digital-art-cards-kickstarter">original Kento campaign coverage</a>, browse the <a href="https://kento.art/artists/" target="_blank" rel="noopener noreferrer">official Season 01 artist directory</a>, or consult Kento’s <a href="https://www.kickstarter.com/projects/objkt/kento-a-new-way-to-collect-art" target="_blank" rel="noopener noreferrer">Kickstarter campaign page</a> and <a href="https://x.com/kentocards/status/2105642726704435640" target="_blank" rel="noopener noreferrer">funded announcement</a> for the project’s own updates.</p>

<h2>Sources</h2>
<ul>
  <li><a href="https://x.com/kentocards/status/2105642726704435640" target="_blank" rel="noopener noreferrer">Kento — Season 01 funded announcement on X</a></li>
  <li><a href="https://x.com/kentocards/status/2105597939036860805" target="_blank" rel="noopener noreferrer">Kento — final-hours campaign update on X</a></li>
  <li><a href="https://kento.art/" target="_blank" rel="noopener noreferrer">Kento — official Season 01 catalogue</a></li>
  <li><a href="https://kento.art/artists/" target="_blank" rel="noopener noreferrer">Kento — official artist directory</a></li>
  <li><a href="https://www.kickstarter.com/projects/objkt/kento-a-new-way-to-collect-art" target="_blank" rel="noopener noreferrer">Kento: A New Way to Collect Art — Kickstarter</a></li>
</ul>
`,
};

const url = new URL(databaseUrl);
const connection = await createConnection({
  host: url.hostname,
  port: Number(url.port || 4000),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1).split("?")[0],
  ssl: { rejectUnauthorized: false },
});

try {
  await connection.beginTransaction();
  await connection.execute(
    `INSERT INTO posts (
      title, slug, content, excerpt, featuredImageUrl, featuredImageAlt, featuredImageCredit, featuredImageSourceUrl, status,
      isFeatured, publishedAt, seoTitle, seoDescription, keyTakeaways, authorSlug, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'publish', false, NOW(), ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      title = VALUES(title), content = VALUES(content), excerpt = VALUES(excerpt),
      featuredImageUrl = VALUES(featuredImageUrl), featuredImageAlt = VALUES(featuredImageAlt),
      featuredImageCredit = VALUES(featuredImageCredit), featuredImageSourceUrl = VALUES(featuredImageSourceUrl),
      status = 'publish', seoTitle = VALUES(seoTitle), seoDescription = VALUES(seoDescription),
      keyTakeaways = VALUES(keyTakeaways), authorSlug = VALUES(authorSlug), updatedAt = NOW()`,
    [
      article.title, article.slug, article.content, article.excerpt, featuredImageUrl, article.featuredImageAlt,
      article.featuredImageCredit, article.featuredImageSourceUrl, article.seoTitle, article.seoDescription,
      article.keyTakeaways, article.authorSlug,
    ],
  );

  const [[post]] = await connection.execute("SELECT id FROM posts WHERE slug = ?", [article.slug]);
  const [categories] = await connection.execute(
    "SELECT id FROM categories WHERE slug IN ('art', 'latest-news', 'nfts')",
  );
  const [tags] = await connection.execute(
    "SELECT id FROM tags WHERE slug IN ('kento', 'objkt', 'tezos', 'digital-art', 'collectibles', 'kickstarter', 'nfts', 'artists')",
  );

  await connection.execute("DELETE FROM post_categories WHERE postId = ?", [post.id]);
  await connection.execute("DELETE FROM post_tags WHERE postId = ?", [post.id]);
  for (const category of categories) {
    await connection.execute("INSERT INTO post_categories (postId, categoryId) VALUES (?, ?)", [post.id, category.id]);
  }
  for (const tag of tags) {
    await connection.execute("INSERT INTO post_tags (postId, tagId) VALUES (?, ?)", [post.id, tag.id]);
  }

  await connection.commit();
  console.log(JSON.stringify({
    articleUrl: `https://xtz.news/${article.slug}`,
    featuredImageUrl,
    artistCount: artistData.artistCount,
    linkedObjktCount,
    categories: categories.map(({ id }) => id),
    tags: tags.map(({ id }) => id),
  }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
