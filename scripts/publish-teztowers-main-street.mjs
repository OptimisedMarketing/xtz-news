import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const featuredImageUrl = "/manus-storage/teztowers-main-street-official_179fe977.png";
const article = {
  title: "TezTowers Says 79 Main St Plots Sold on Day One of Its Tezos Virtual City",
  slug: "teztowers-main-street-virtual-real-estate-tezos",
  excerpt: "TezTowers, a 3D virtual-real-estate project on Tezos, says 79 sequential Main St plots were claimed on its first day, with future destinations and advertising features planned.",
  seoTitle: "TezTowers Sells 79 Main St Plots on Day One | XTZ.News",
  seoDescription: "TezTowers says 79 virtual Main St plots were claimed on its first day. Here is what its public Tezos 3D city, dynamic plot NFTs and advertising proposal say today.",
  featuredImageAlt: "Official TezTowers night-city visual with a glowing T over a waterfront skyline",
  featuredImageCredit: "TezTowers",
  featuredImageSourceUrl: "https://teztowers.com/",
  authorSlug: "lee-evans",
  keyTakeaways: [
    "TezTowers describes itself as a living 3D city and virtual-real-estate project on Tezos, built around sequential Main St plots.",
    "The official account said 79 plots were sold on its first day and that first-day plot holders received a balloon perk.",
    "Its public site says plot NFTs can evolve with upgrades and that self-serve billboard advertising is part of the product proposition.",
    "TezTowers has also offered free advertising to Tezos institutions and non-profit projects; availability and integration terms should be confirmed directly with the project.",
  ].map((item) => `- ${item}`).join("\n"),
  content: `
<p><strong>TezTowers says 79 plots were claimed on the first day of its Tezos-based virtual city, as the project begins to populate a sequential stretch of Main St.</strong> The project presents itself as a navigable 3D metropolis where people can claim virtual real estate, view buildings and billboards, and explore the street from the browser.</p>

<p>In an <a href="https://x.com/TezTowers/status/2105488167042515017" target="_blank" rel="noopener noreferrer">1 October post</a>, the official account welcomed new “neighbors,” said 79 plots had sold on day one and said people who acquired a plot that day received balloons. That is a project-reported launch metric, rather than an independently audited total, and the live figure may change after publication.</p>

<h2>A browser-based Main St on Tezos</h2>

<p>TezTowers’ public site describes the project as “The Living 3D City &amp; Virtual Real Estate on Tezos.” Its current interface lets visitors move through the scene, search for a plot or brand, inspect the street and connect a Tezos wallet. The project’s public description says users can claim sequential Main St parcels, watch dynamic 3D NFTs evolve as they upgrade, and launch self-serve billboard advertising campaigns.</p>

<p>The live experience is best understood as a product surface rather than a fixed roadmap: availability, pricing, plot order, upgrades and advertising terms can change. Readers considering a purchase or campaign should check the project’s own site and wallet prompts before taking action.</p>

<div data-teztowers-gallery="launch"></div>

<h2>Plots, destinations and a growing street</h2>

<p>TezTowers had signalled momentum one day earlier, posting that plots were “filling fast” alongside a wide Main St overview. The image shows an early waterfront street with a mix of taller towers, small parcels and billboard placements — a compact snapshot of the city as it began to grow.</p>

<p>In the first-day update, the project also said that new destinations and perks were coming. No complete public schedule for those additions was included in the post, so the announcement is useful as a signal of direction rather than a timetable.</p>

<h2>An invitation to the wider Tezos community</h2>

<p>TezTowers has also made a direct outreach offer to Tezos institutions and non-profit projects. In a <a href="https://x.com/TezTowers/status/2105168454487785496" target="_blank" rel="noopener noreferrer">30 September open letter</a>, it said it would offer free advertising and explore bespoke ways to integrate Tezos projects into Main St. The post names <a href="https://x.com/TheTezos" target="_blank" rel="noopener noreferrer">@TheTezos</a> and <a href="https://x.com/TeiaCommunity" target="_blank" rel="noopener noreferrer">@TeiaCommunity</a>, but does not publish eligibility rules, placements or contractual terms.</p>

<p>That distinction matters. The offer is an invitation from the project, not a confirmed partnership or endorsement by the organisations mentioned. Teams interested in it should contact TezTowers directly to confirm scope, availability and any conditions.</p>

<h2>Where to explore</h2>

<p>Visit <a href="https://teztowers.com/" target="_blank" rel="noopener noreferrer">TezTowers</a> to inspect the live city interface, read the <a href="https://x.com/TezTowers/status/2105352862570365315" target="_blank" rel="noopener noreferrer">early Main St post</a>, or follow <a href="https://x.com/TezTowers" target="_blank" rel="noopener noreferrer">@TezTowers</a> for project updates.</p>

<p>XTZ.News has also added a <a href="/projects/teztowers">TezTowers project profile</a> with the currently available public information.</p>
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
  const [categories] = await connection.execute("SELECT id FROM categories WHERE slug IN ('games', 'adoption', 'latest-news')");
  const [tags] = await connection.execute("SELECT id FROM tags WHERE slug IN ('tezos', 'nfts', 'community', 'adoption')");

  await connection.execute("DELETE FROM post_categories WHERE postId = ?", [post.id]);
  await connection.execute("DELETE FROM post_tags WHERE postId = ?", [post.id]);
  for (const category of categories) await connection.execute("INSERT INTO post_categories (postId, categoryId) VALUES (?, ?)", [post.id, category.id]);
  for (const tag of tags) await connection.execute("INSERT INTO post_tags (postId, tagId) VALUES (?, ?)", [post.id, tag.id]);

  await connection.commit();
  console.log(JSON.stringify({ articleUrl: `https://xtz.news/${article.slug}`, featuredImageUrl, categories: categories.map(({ id }) => id), tags: tags.map(({ id }) => id) }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
