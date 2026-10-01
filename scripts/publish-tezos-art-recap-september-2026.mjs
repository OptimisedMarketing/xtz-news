import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const featuredImageUrl = "/manus-storage/tezos-art-on-tezos-friday-recap-animated-optimized_d43e9862.webp";
const article = {
  title: "Tezos Art Recap: Museum Signals, Vienna Screens and New Digital Works",
  slug: "tezos-art-recap-responsive-signals-vienna-digital-works",
  excerpt: "Tezos’ latest Art on Tezos recap looks back at Responsive Signals in New York, the Stories We Tell Online one-night exhibition in Vienna, and a run of digital-art releases, auctions and open calls.",
  seoTitle: "Tezos Art Recap: Responsive Signals, Vienna & New Digital Works | XTZ.News",
  seoDescription: "A source-grounded Tezos art recap covering Responsive Signals at New York’s Museum of the Moving Image, Vienna’s Stories We Tell Online, objkt.one releases, calls and auctions.",
  featuredImageAlt: "Animated collage of works and exhibition scenes from the official Tezos Art on Tezos Friday Recap",
  featuredImageCredit: "Tezos / Art on Tezos Friday Recap (animated)",
  featuredImageSourceUrl: "https://x.com/tezos/status/2103485035299156358",
  authorSlug: "lee-evans",
  keyTakeaways: [
    "Tezos’ September 25 Art on Tezos recap put Responsive Signals at New York’s Museum of the Moving Image alongside a one-night, 22-artist internet-café exhibition in Vienna.",
    "The recap highlighted current and recent activity across art commissions, generative-art auctions, collector features and new releases connected with objkt and objkt.one.",
    "Responsive Signals brought artist talks and interactive works by Jonas Lund, Yoshi Sodeoka, Nick Fox-Gieg and Kat Zhang to MoMI as part of its annual Tezos Foundation partnership.",
    "Dates and submission windows in a weekly round-up can change, so readers should confirm any current call, release or event status through the original organiser before acting.",
  ].map((item) => `- ${item}`).join("\n"),
  content: `
<p><strong>Tezos’ latest Art on Tezos Friday Recap draws a line between museum programming, a one-night internet-café exhibition and the steady rhythm of releases, auctions and open calls around the ecosystem.</strong> Published by the official Tezos account on September 25, the round-up covers activity in New York and Vienna as well as digital releases and collecting initiatives that were highlighted across the week.</p>

<p>The recap is a snapshot rather than a live calendar. Some items were tied to specific September dates and some calls may have since changed status, so the original organiser remains the best place to confirm whether an event, release or submission window is current.</p>

<h2>Responsive Signals at the Museum of the Moving Image</h2>

<p>At the centre of the recap was <a href="https://movingimage.org/event/responsive-signals/" target="_blank" rel="noopener noreferrer">Responsive Signals</a>, an evening of artist talks and interactive installations held at the Museum of the Moving Image in New York on September 22. The museum listed the programme as part of its Open Worlds 2026 series and the second of two events organised with the Tezos Foundation under their annual partnership.</p>

<p>The bill brought together <strong>Jonas Lund</strong>, <strong>Yoshi Sodeoka</strong>, <strong>Nick Fox-Gieg</strong> and <strong>Kat Zhang</strong>, also known as the Poet Engineer. Lund and Sodeoka discussed <em>Terms of Agreement 🐳</em>, their commission for MoMI’s Schlosser Media Wall. Fox-Gieg premiered an interactive work made in Telidon/NAPLPS, an early vector-graphics format, while Zhang presented works focused on gesture, coding and machine memory.</p>

<p>That combination is a useful picture of the kind of work the recap is following: artists using networked formats and interactive systems not as a backdrop, but as part of the material of the artwork itself.</p>

<h2>Twenty-two artists, one Vienna internet café</h2>

<p>Tezos also looked back at <strong>Stories We Tell Online</strong>, a one-night exhibition that transformed computers at a Vienna internet café into a distributed exhibition on September 23. The official recap said the project featured 22 artists and was curated by <strong>Postanika</strong>, <strong>Kika Nicolela</strong> and <strong>Micol</strong>.</p>

<figure class="article-source-visual">
  <a href="https://x.com/artontezos_/status/2102674387048800679" target="_blank" rel="noopener noreferrer"><img src="/manus-storage/stories-we-tell-online_7b675162.webp" alt="Official promotional visual for Stories We Tell Online in Vienna, showing the exhibition title over a vintage computer-screen motif" loading="lazy" /></a>
  <figcaption><strong>Stories We Tell Online</strong> promotional visual. Source: <a href="https://x.com/artontezos_/status/2102674387048800679" target="_blank" rel="noopener noreferrer">Art on Tezos official announcement</a>. Displayed as credited editorial context; rights remain with the respective owner.</figcaption>
</figure>

<p>Among the works later singled out in the round-up were <em>Stance</em> by <strong>Emily Edelman</strong>, which turns candid photographs into abstracted human gestures, and <em>One Long Blur</em> by <strong>Joëlle Snaith</strong>, a generative work connecting personal survival mechanisms with online behaviours. Tezos also noted that Juan Rodríguez García’s <em>Estados Posibles</em> and Rhea Myers’ <em>Context Collapse</em> were scheduled for a September 29 release on objkt.one as part of the wider project.</p>

<p>The exhibition format matters as much as the roster: using everyday desktop screens as a temporary exhibition surface places the act of encountering digital art inside one of the internet’s familiar social spaces.</p>

<h2>Open calls, auctions and collector context</h2>

<p>The roundup included <strong>Art Commission Tezos’</strong> October <em>Texture</em> edition, for which Tezos said submissions were open at the time of its post. The initiative planned to select 20 artists, with curators placing the opening bids on their auctions. It also highlighted <strong>Searching for Balance</strong>, a September 29 generative-art auction featuring 15 artists and curated by Shendrik and MCHX17.</p>

<figure class="article-source-visual">
  <a href="https://x.com/artontezos_/status/2103152745805197585/photo/1" target="_blank" rel="noopener noreferrer"><img src="/manus-storage/art-commission-texture_13e8f835.jpg" alt="Official Art Commission Tezos promotional artwork for the October Texture edition" loading="lazy" /></a>
  <figcaption><strong>Texture</strong> open-call visual. Source: <a href="https://x.com/artontezos_/status/2103152745805197585/photo/1" target="_blank" rel="noopener noreferrer">Art on Tezos official announcement</a>. The image represents the call, not a confirmed selected work.</figcaption>
</figure>

<figure class="article-source-visual">
  <a href="https://accomparts.com/journal/accompartscomjournalsearching-for-balance-generative-art-auction" target="_blank" rel="noopener noreferrer"><img src="/manus-storage/searching-for-balance_840accc7.png" alt="Representative generative artwork from the Searching for Balance auction" loading="lazy" /></a>
  <figcaption><strong>Searching for Balance</strong> auction visual. Source: <a href="https://accomparts.com/journal/accompartscomjournalsearching-for-balance-generative-art-auction" target="_blank" rel="noopener noreferrer">ACCOMPART’S official auction note</a>. Displayed as credited editorial context; rights remain with the respective owner.</figcaption>
</figure>

<p>Collecting received its own spotlight through objkt’s Collector of the Week feature on <strong>UnityOfMulti</strong>. Tezos described the collector as discussing a collection of approximately 50,000 works across Ethereum, Tezos and Base, with an approach led by personal instinct rather than trends. On the platform side, objkt teased a forthcoming project called <strong>PULSE</strong>; the recap did not provide launch detail beyond that early signal.</p>

<h2>Further works highlighted by Tezos</h2>

<p>The recap’s recommendations moved from pixel work to AI-assisted and generative practice. They included Tornado Rodriguez’ <em>(REC ●) me harder</em>, a set of 30 unique 1/1 pixel compositions made with scripts in Aseprite; <strong>M04ASA’s</strong> <em>Everyday Mythologies</em>, presented by Ìtàn: West African Artistry; and <strong>stipinpixel’s</strong> <em>Uncommon Dwellings</em>, which the artist describes as growing from experiments by a designer and pixel artist.</p>

<p>Tezos also pointed readers to new work on drop.art: <em>Noise Research</em> by jotta_rs, <em>Random I</em> by Pomelo, and <em>$P00KY SYNDROME_</em> by _Iraconda. Taken together, the selections show a broad editorial range: physical installations and artist talks sit alongside web-native work, collecting activity and artist-led releases.</p>

<h2>A weekly record of a moving art scene</h2>

<p>Weekly recaps can be easy to dismiss as a list of names and links. In this case, the picture is more connected: a museum partnership in New York, a temporary computer-based exhibition in Vienna, and a set of releases and auctions that extend the conversation online. For artists, collectors and readers following Art on Tezos, the value is in seeing those contexts alongside one another.</p>

<p>Read the <a href="https://x.com/tezos/status/2103485035299156358" target="_blank" rel="noopener noreferrer">official Tezos Art on Tezos Friday Recap</a> for the complete list of artists and updates, and consult the named organisers directly for the latest information on submissions, auctions and releases.</p>
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
  if (featuredImageUrl === "__FEATURED_IMAGE_URL__") {
    throw new Error("Set featuredImageUrl before publishing");
  }

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
      article.title, article.slug, article.content, article.excerpt, featuredImageUrl, article.featuredImageAlt, article.featuredImageCredit, article.featuredImageSourceUrl,
      article.seoTitle, article.seoDescription, article.keyTakeaways, article.authorSlug,
    ],
  );

  const [[post]] = await connection.execute("SELECT id FROM posts WHERE slug = ?", [article.slug]);
  const [categories] = await connection.execute(
    "SELECT id FROM categories WHERE slug IN ('art', 'exhibition', 'latest-news')",
  );
  const [tags] = await connection.execute(
    "SELECT id FROM tags WHERE slug IN ('tezos', 'art-on-tezos', 'digital-art', 'exhibitions', 'objkt', 'nfts')",
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
    mediaPath: featuredImageUrl,
    categories: categories.map(({ id }) => id),
    tags: tags.map(({ id }) => id),
  }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
