import { createHash } from "node:crypto";
import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const featuredImageUrl = "/manus-storage/tezos-token2049-post-quantum-panel_234eb254.webp";
const article = {
  title: "Arthur Breitman to Join TOKEN2049 Panel on Quantum Risks for Crypto",
  slug: "arthur-breitman-token2049-quantum-risks-crypto",
  excerpt: "Tezos co-founder Arthur Breitman will join Eli Ben-Sasson, Alex Pruden and Ren CF at TOKEN2049 Singapore for a panel on whether quantum computing poses an existential threat to crypto.",
  seoTitle: "Arthur Breitman Joins TOKEN2049 Quantum Crypto Panel | XTZ.News",
  seoDescription: "Arthur Breitman joins Eli Ben-Sasson, Alex Pruden and Ren CF at TOKEN2049 Singapore to discuss quantum risks and cryptographic migration for crypto.",
  featuredImageAlt: "Official Tezos TOKEN2049 announcement graphic showing Arthur Breitman, the BingX Stage, and the 7 October 4:20 to 4:50pm SGT panel time",
  authorSlug: "lee-evans",
  keyTakeaways: [
    "Arthur Breitman is scheduled to speak on TOKEN2049 Singapore’s BingX Labs Stage on 7 October, from 4:20 to 4:50pm SGT.",
    "The panel is titled “Quantum: An Existential Threat to Crypto?” and will include Eli Ben-Sasson, Alex Pruden and moderator Ren CF.",
    "The discussion arrives as Tezos tests post-quantum protocol work publicly through Quantumnet and develops a path for cryptographic migration.",
    "The listing is an event announcement; readers should check TOKEN2049’s official agenda for any last-minute programme changes.",
  ].map((item) => `- ${item}`).join("\n"),
  content: `
<p><strong>Tezos co-founder Arthur Breitman is scheduled to join a TOKEN2049 Singapore panel on the quantum-computing challenge facing crypto.</strong> The session, titled <em>“Quantum: An Existential Threat to Crypto?”</em>, is listed for the BingX Labs Stage on Wednesday, 7 October, from 4:20 to 4:50pm Singapore time.</p>
<p>The official TOKEN2049 agenda lists Breitman alongside Eli Ben-Sasson, co-founder and CEO of StarkWare, and Alex Pruden, co-founder and CEO of Project Eleven. Ren CF, a general partner at Electric Capital, is listed as moderator.</p>
<h2>A panel about the migration question</h2>
<p>Tezos’ announcement frames the session around a practical question: post-quantum cryptography standards already exist, but how can networks agree on the process of moving to them? That shifts the conversation beyond whether quantum computers are a future concern and toward the technical, governance and operational work needed to replace cryptographic building blocks responsibly.</p>
<p>The title of the TOKEN2049 session is deliberately direct. Public-key cryptography underpins account control and many other blockchain systems, yet a migration cannot be reduced to swapping a single wallet signature. Networks may need changes across consensus, data availability, tooling and the ways users adopt new account protection.</p>
<h2>Why this matters to Tezos now</h2>
<p>Tezos has already started testing parts of that broader problem in public. Its experimental Quantumnet testnet brings together post-quantum account work, revised baking-rights selection, consensus-attestation research and data-availability experimentation. Quantumnet remains experimental, but it gives engineers and bakers a common setting to evaluate how several proposed changes operate together.</p>
<p>Earlier Tezos post-quantum work also introduced feature-flagged testnet support for <code>tz5</code> accounts using ML-DSA-44. The objective is not to claim that a completed migration already exists. It is to start testing and refining the steps that a long-term transition would require before an urgent change is needed.</p>
<h2>Who is on the stage</h2>
<p>Breitman will represent Tezos in the conversation. Ben-Sasson brings experience from cryptography and proof systems through StarkWare, while Pruden’s Project Eleven focuses on quantum-era cryptographic security. Ren CF will moderate the panel for Electric Capital.</p>
<p>For readers following Tezos’ post-quantum work, the event offers a public discussion that sits alongside the protocol research being tested through Quantumnet. It does not announce a mainnet migration or a new production release; it is a scheduled conference panel about the problem, the standards and the practical challenge of coordinating a transition.</p>
<h2>Event details</h2>
<ul>
  <li><strong>Session:</strong> Quantum: An Existential Threat to Crypto?</li>
  <li><strong>When:</strong> Wednesday, 7 October 2026, 4:20–4:50pm SGT</li>
  <li><strong>Where:</strong> BingX Labs Stage, TOKEN2049 Singapore</li>
  <li><strong>Speakers:</strong> Arthur Breitman, Eli Ben-Sasson and Alex Pruden</li>
  <li><strong>Moderator:</strong> Ren CF</li>
</ul>
<p>See the <a href="https://www.token2049.com/singapore/agenda?630073d5_page=2" target="_blank" rel="noopener noreferrer">official TOKEN2049 agenda</a> for the current programme, and read Tezos’ <a href="https://x.com/tezos/status/2105223020407308467" target="_blank" rel="noopener noreferrer">announcement</a>. For background, XTZ.News has also covered the <a href="/quantumnet-live-tezos-experimental-post-quantum-testnet">Quantumnet experimental post-quantum testnet</a>.</p>
`,
};

const event = {
  sourceKey: "xtz-news-editorial-tezos-token2049-2026",
  sourceEventId: "quantum-existential-threat-crypto-token2049-2026",
  sourceUrl: "https://www.token2049.com/singapore/agenda?630073d5_page=2",
  title: "Quantum: An Existential Threat to Crypto?",
  description: "Arthur Breitman joins Eli Ben-Sasson and Alex Pruden for a TOKEN2049 Singapore panel on quantum risks for crypto and the challenge of coordinating cryptographic migration. Ren CF moderates.",
  startAt: "2026-10-07T16:20:00+08:00",
  endAt: "2026-10-07T16:50:00+08:00",
  location: "BingX Labs Stage, TOKEN2049 Singapore",
  timezone: "Asia/Singapore",
  speakers: ["Arthur Breitman", "Eli Ben-Sasson", "Alex Pruden", "Ren CF"],
  topics: ["Post-Quantum", "Cryptography", "Quantum Computing", "Tezos", "TOKEN2049"],
  eventType: "conference",
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
      title, slug, content, excerpt, featuredImageUrl, featuredImageAlt, status,
      isFeatured, publishedAt, seoTitle, seoDescription, keyTakeaways, authorSlug, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, 'publish', false, NOW(), ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      title = VALUES(title), content = VALUES(content), excerpt = VALUES(excerpt),
      featuredImageUrl = VALUES(featuredImageUrl), featuredImageAlt = VALUES(featuredImageAlt),
      status = 'publish', seoTitle = VALUES(seoTitle), seoDescription = VALUES(seoDescription),
      keyTakeaways = VALUES(keyTakeaways), authorSlug = VALUES(authorSlug), updatedAt = NOW()`,
    [article.title, article.slug, article.content, article.excerpt, featuredImageUrl, article.featuredImageAlt, article.seoTitle, article.seoDescription, article.keyTakeaways, article.authorSlug],
  );

  const [[post]] = await connection.execute("SELECT id FROM posts WHERE slug = ?", [article.slug]);
  const [categories] = await connection.execute("SELECT id FROM categories WHERE slug IN ('latest-news', 'infrastructure')");
  const [tags] = await connection.execute("SELECT id FROM tags WHERE slug IN ('tezos', 'post-quantum', 'cryptography', 'quantum-computing', 'arthur-breitman')");
  await connection.execute("DELETE FROM post_categories WHERE postId = ?", [post.id]);
  await connection.execute("DELETE FROM post_tags WHERE postId = ?", [post.id]);
  for (const category of categories) await connection.execute("INSERT INTO post_categories (postId, categoryId) VALUES (?, ?)", [post.id, category.id]);
  for (const tag of tags) await connection.execute("INSERT INTO post_tags (postId, tagId) VALUES (?, ?)", [post.id, tag.id]);

  const sourceHash = createHash("sha256").update(JSON.stringify(event)).digest("hex");
  const sourceCheckedAt = new Date("2026-09-30T16:55:00.000Z");
  const reviewedNote = "Editor-published from the official Tezos announcement and TOKEN2049 agenda on 30 September 2026. Timing and availability should be reconfirmed with the organiser.";
  await connection.execute(
    `INSERT INTO tezos_event_candidates
      (sourceKey, sourceEventId, sourceUrl, title, description, startAt, endAt, location, timezone, speakers, topics, eventType, agreedToReview, sourceHash, sourceCheckedAt, status, adminNotes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, 'published', ?)
     ON DUPLICATE KEY UPDATE
      sourceUrl = VALUES(sourceUrl), title = VALUES(title), description = VALUES(description),
      startAt = VALUES(startAt), endAt = VALUES(endAt), location = VALUES(location), timezone = VALUES(timezone), speakers = VALUES(speakers), topics = VALUES(topics),
      eventType = VALUES(eventType), agreedToReview = VALUES(agreedToReview), sourceHash = VALUES(sourceHash),
      sourceCheckedAt = VALUES(sourceCheckedAt), status = 'published', adminNotes = VALUES(adminNotes)`,
    [event.sourceKey, event.sourceEventId, event.sourceUrl, event.title, event.description, new Date(event.startAt), new Date(event.endAt), event.location, event.timezone, JSON.stringify(event.speakers), JSON.stringify(event.topics), event.eventType, sourceHash, sourceCheckedAt, reviewedNote],
  );

  await connection.commit();
  console.log(JSON.stringify({ articleUrl: `https://xtz.news/${article.slug}`, featuredImageUrl, event: { title: event.title, startAt: event.startAt, location: event.location } }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
