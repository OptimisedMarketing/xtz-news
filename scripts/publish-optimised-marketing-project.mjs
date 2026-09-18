import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const project = {
  title: "Optimised Marketing",
  slug: "optimised-marketing",
  excerpt: "The first-party team building XTZ.News, offering website, app and marketing services to the wider Tezos community. Use code XTZ2026 for 25% off services.",
  shortDescription: "Websites, apps and marketing services for the wider Tezos community — 25% off with XTZ2026.",
  content: `
<p><strong>Optimised Marketing is the first-party team that builds and supports XTZ.News.</strong> It offers website development, web application and marketing services to projects and organisations in the wider Tezos community.</p>

<p><strong>XTZ.News community offer:</strong> use referral code <strong>XTZ2026</strong> to receive <strong>25% off services</strong>. The offer applies to a scoped service engagement; prospective clients should contact Optimised Marketing to discuss requirements, availability and applicable terms before proceeding.</p>

<p>Explore the <a href="https://optimised.marketing" target="_blank" rel="noopener noreferrer">Optimised Marketing website</a> for its current website, application, marketing, SEO, automation and Tezos project-launch services. This is a clearly labelled first-party directory profile, not an independent editorial endorsement.</p>
`,
  featuredImageUrl: "/manus-storage/optimised-marketing-xtz-news-wide_fbd697e0.png",
  featuredImageAlt: "Optimised Marketing and XTZ.News first-party promotion artwork",
  category: "Community",
  websiteUrl: "https://optimised.marketing",
  tags: JSON.stringify(["Website development", "Web applications", "Marketing", "Tezos community", "XTZ2026"]),
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
      title, slug, content, excerpt, featuredImageUrl, featuredImageAlt, category, websiteUrl,
      status, publishedAt, shortDescription, tags, featured, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'publish', NOW(), ?, ?, false, NOW())
    ON DUPLICATE KEY UPDATE
      title = VALUES(title), content = VALUES(content), excerpt = VALUES(excerpt),
      featuredImageUrl = VALUES(featuredImageUrl), featuredImageAlt = VALUES(featuredImageAlt),
      category = VALUES(category), websiteUrl = VALUES(websiteUrl), status = 'publish',
      shortDescription = VALUES(shortDescription), tags = VALUES(tags), featured = false, updatedAt = NOW()`,
    [
      project.title, project.slug, project.content, project.excerpt, project.featuredImageUrl, project.featuredImageAlt,
      project.category, project.websiteUrl, project.shortDescription, project.tags,
    ],
  );

  console.log(JSON.stringify({
    projectUrl: `https://xtz.news/projects/${project.slug}`,
    mediaPath: project.featuredImageUrl,
  }, null, 2));
} finally {
  await connection.end();
}
