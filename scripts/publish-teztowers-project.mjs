import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const project = {
  title: "TezTowers",
  slug: "teztowers",
  excerpt: "A browser-based 3D virtual city on Tezos where the project says participants can claim sequential Main St plots, upgrade dynamic 3D NFTs and run billboard campaigns.",
  shortDescription: "A browser-based 3D virtual city and Main St real-estate experience on Tezos.",
  content: `
<p><strong>TezTowers describes itself as a living 3D city and virtual-real-estate experience on Tezos.</strong> Its public interface lets visitors explore Main St, search for plots or brands, inspect buildings and connect a Tezos wallet.</p>

<p>The project says users can claim sequential Main St parcels, watch dynamic 3D NFTs change as they upgrade, and launch self-serve billboard advertising campaigns. Product availability, pricing, upgrades and advertising terms can change, so use TezTowers’ own site for current information before connecting a wallet or making a purchase.</p>

<p>In its early launch updates, TezTowers said 79 plots were sold on its first day and invited Tezos institutions and non-profit projects to discuss free advertising or bespoke Main St integrations. That is an offer made by TezTowers; it is not a confirmed partnership or endorsement by organisations mentioned in its post.</p>

<p>Read the <a href="/teztowers-main-street-virtual-real-estate-tezos">XTZ.News launch coverage</a> for the source posts and a visual look at Main St.</p>
`,
  featuredImageUrl: "/manus-storage/teztowers-main-street-official_179fe977.png",
  featuredImageAlt: "Official TezTowers night-city visual with a glowing T over a waterfront skyline",
  category: "Games",
  websiteUrl: "https://teztowers.com/",
  twitter: "https://x.com/TezTowers",
  tags: JSON.stringify(["Tezos", "Virtual city", "3D", "NFTs", "Community", "Advertising"]),
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

  console.log(JSON.stringify({ projectUrl: `https://xtz.news/projects/${project.slug}`, mediaPath: project.featuredImageUrl, category: project.category }, null, 2));
} finally {
  await connection.end();
}
