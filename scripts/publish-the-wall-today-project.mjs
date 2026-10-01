import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const project = {
  title: "THE WALL Today",
  slug: "the-wall-today",
  excerpt: "An invite-only early beta that describes itself as a recurring onchain record of people, ideas and culture on Tezos.",
  shortDescription: "Invite-only early beta for a recurring Tezos record of people, ideas and culture.",
  content: `
<p><strong>THE WALL Today is an invite-only early beta that describes its work as a recurring onchain record of people, ideas and culture on Tezos.</strong> The project’s public welcome page calls it a monthly snapshot rather than a finished general-release product.</p>

<p>Its first completed cycle, the September 2026 Genesis Wall, was frozen at the end of the month. THE WALL Today has said that additional Genesis Wall statistics will follow, but its public materials do not yet set out a complete participation breakdown or all contribution mechanics.</p>

<p><strong>Beta access:</strong> the current welcome page directs prospective participants to an invite redemption path. Availability, eligibility and participation details can change while the project remains in early beta, so use THE WALL Today’s own website for the current information.</p>

<p>Read the <a href="/the-wall-today-freezes-genesis-board-tezos-archive">XTZ.News Genesis Wall coverage</a> or explore adjacent culture projects in the <a href="/onchain-community-archives">Onchain Community Archives</a> hub.</p>
`,
  featuredImageUrl: "/manus-storage/the-wall-today-september-wall_72e4858b.png",
  featuredImageAlt: "THE WALL Today September Wall composite showing Tezos community artwork, projects and visual references",
  category: "Community",
  websiteUrl: "https://thewalltoday.com/welcome",
  twitter: "https://x.com/thewall_today",
  tags: JSON.stringify(["Tezos culture", "Onchain archive", "Community", "Early beta", "Digital art"]),
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
  await connection.execute(
    `INSERT INTO projects (
      title, slug, content, excerpt, featuredImageUrl, featuredImageAlt, category, websiteUrl, twitter,
      status, publishedAt, shortDescription, tags, featured, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'publish', NOW(), ?, ?, false, NOW())
    ON DUPLICATE KEY UPDATE
      title = VALUES(title), content = VALUES(content), excerpt = VALUES(excerpt),
      featuredImageUrl = VALUES(featuredImageUrl), featuredImageAlt = VALUES(featuredImageAlt),
      category = VALUES(category), websiteUrl = VALUES(websiteUrl), twitter = VALUES(twitter), status = 'publish',
      shortDescription = VALUES(shortDescription), tags = VALUES(tags), featured = false, updatedAt = NOW()`,
    [
      project.title, project.slug, project.content, project.excerpt, project.featuredImageUrl, project.featuredImageAlt,
      project.category, project.websiteUrl, project.twitter, project.shortDescription, project.tags,
    ],
  );

  console.log(JSON.stringify({
    projectUrl: `https://xtz.news/projects/${project.slug}`,
    mediaPath: project.featuredImageUrl,
    category: project.category,
  }, null, 2));
} finally {
  await connection.end();
}
