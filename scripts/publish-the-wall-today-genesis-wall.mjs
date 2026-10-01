import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const featuredImageUrl = "/manus-storage/the-wall-today-september-wall_72e4858b.png";
const article = {
  title: "The Wall Today Freezes Its Genesis Board as a Tezos Archive Takes Shape",
  slug: "the-wall-today-freezes-genesis-board-tezos-archive",
  excerpt: "THE WALL Today says its September board is now frozen, closing the first Genesis Wall cycle for an invite-only early beta that describes itself as a monthly archive on Tezos.",
  seoTitle: "The Wall Today Freezes Genesis Board | Tezos Archive News",
  seoDescription: "THE WALL Today has frozen its September Genesis Wall. Here is what the invite-only Tezos beta says publicly about its monthly onchain archive and what remains to be announced.",
  featuredImageAlt: "Official THE WALL Today September Wall composite showing a dense collage of Tezos community artwork, projects and visual references",
  featuredImageCredit: "THE WALL Today",
  featuredImageSourceUrl: "https://x.com/thewall_today/status/2105452628633321624",
  authorSlug: "lee-evans",
  keyTakeaways: [
    "THE WALL Today says its September board has been frozen and calls the completed first cycle the Genesis Wall.",
    "The public welcome page describes the project as an invite-only early beta and a monthly snapshot on Tezos, rather than a finished public product.",
    "The launch post promises more statistics, but does not yet publish a full breakdown of the Genesis Wall or its participation rules.",
    "An AuRo404 animation in this article shows an early community mark and a 64,900-mark counter from 21 September; it should not be read as a current total.",
  ].map((item) => `- ${item}`).join("\n"),
  content: `
<p><strong>THE WALL Today says its first September board has been frozen, bringing what it calls the Genesis Wall to a close.</strong> In a September 30 post, the invite-only early beta said the “SEPT WALL” was frozen and that its first board was “officially history,” adding that further statistics would follow.</p>

<p>Public information remains deliberately compact. The project’s welcome page describes THE WALL as “a living archive” with a monthly snapshot on Tezos: “real people, ideas, culture, chaos. Onchain.” It is not presented as a completed mainstream release. The site is in private beta and directs prospective participants to redeem an invite.</p>

<h2>What has been confirmed</h2>

<p>The official account uses the phrase <strong>THE WALL Remembers</strong> and labels the project an early beta. Its public proposition is a record of a month’s activity rather than a continuously editable feed: today’s internet, the project says, becomes tomorrow’s history.</p>

<p>The September close is the clearest public milestone so far. THE WALL Today has said the Genesis Wall is history and that it will release “fun stats” later. The public post does not set out a full participation breakdown, the final number of marks, or the detailed rules behind the archived monthly record, so those points should be treated as pending rather than inferred.</p>

<h2>A Tezos-native monthly record</h2>

<p>The choice of Tezos is explicit on the welcome page. THE WALL Today says its archive is a monthly snapshot on Tezos and frames the project around people and culture as much as technical activity. That makes the frozen September board a useful early reference point: an onchain-facing record of a beta community moment, not simply a stream of posts that disappears into a timeline.</p>

<p>The approach also puts the emphasis on a bounded period. Readers can see that a board is collected and then frozen, but the publicly available material does not yet explain every contribution mechanism or how future monthly snapshots will be displayed. The early-beta framing matters: the project is inviting people to follow the experiment while its public surface is still taking shape.</p>

<h2>An early community mark</h2>

<p>AuRo404, also known as RubisCO, shared the following animated post during the September cycle. At the time of that September 21 post, the account said it had left a mark on THE WALL and showed <strong>64,900 marks</strong> with just over nine days until the snapshot. That is a dated community observation, not a current total or a verified final Genesis Wall figure.</p>

<figure class="article-source-visual article-source-video">
  <video src="/manus-storage/auro404-the-wall-mark-original_c053792f.mp4" poster="/manus-storage/auro404-the-wall-mark-still_ecf72dd4.webp" autoplay muted loop playsinline controls preload="metadata" aria-label="Animated AuRo404 post showing a mark left on THE WALL"></video>
  <figcaption><strong>AuRo404 / RubisCO</strong> shared this animated early-beta post on 21 September. Source: <a href="https://x.com/AuRo404/status/2102158531331772668" target="_blank" rel="noopener noreferrer">AuRo404’s original post on X</a>. The counter shown is historical and not presented as the final Genesis Wall total.</figcaption>
</figure>

<h2>What comes next</h2>

<p>For now, the next confirmed update is the project’s promised Genesis Wall statistics. Until those arrive, the most reliable public references are THE WALL Today’s own announcement, its invite-only welcome page and the project account’s early-beta status. Readers who are interested can follow the official account or visit the welcome page; anyone considering an invite should use the project’s own redemption path and check any current terms there.</p>

<p>Read the <a href="https://x.com/thewall_today/status/2105452628633321624" target="_blank" rel="noopener noreferrer">official September Wall announcement</a>, visit <a href="https://thewalltoday.com/welcome" target="_blank" rel="noopener noreferrer">THE WALL Today’s welcome page</a>, or follow <a href="https://x.com/thewall_today" target="_blank" rel="noopener noreferrer">@thewall_today</a> for the promised Genesis Wall update.</p>

<p>XTZ.News has also added a <a href="/projects/the-wall-today">THE WALL Today project profile</a> with the currently available public beta information. For adjacent culture projects and related reading, visit the <a href="/onchain-community-archives">Onchain Community Archives</a> hub.</p>
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
    "SELECT id FROM categories WHERE slug IN ('art', 'latest-news', 'adoption')",
  );
  const [tags] = await connection.execute(
    "SELECT id FROM tags WHERE slug IN ('tezos', 'art-on-tezos', 'digital-art', 'nfts', 'community')",
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
    categories: categories.map(({ id }) => id),
    tags: tags.map(({ id }) => id),
  }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
