import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const featuredImageUrl = "/manus-storage/Untitleddesign(1)_33aa5dc6.webp";
const article = {
  title: "0xTzKT Previews One Explorer for Tezos L1 and Tezos X",
  slug: "0xtzkt-one-explorer-tezos-l1-tezos-x",
  excerpt: "Baking Bad’s in-development 0xTzKT project aims to aggregate Tezos L1 and Tezos X data, including the EVM runtime, into one explorer and API. Its public teaser site says the product is coming soon.",
  seoTitle: "0xTzKT Previews One Explorer for Tezos L1 and Tezos X | XTZ.News",
  seoDescription: "Baking Bad previews 0xTzKT, an in-development multi-chain indexer and API intended to bring Tezos L1, Tezos X, Michelson and EVM data together.",
  featuredImageAlt: "0xTzKT artwork showing a cat bridging Tezos L1 and Tezos X trucks",
  authorSlug: "lee-evans",
  keyTakeaways: [
    "0xTzKT is an in-development Baking Bad indexer and API intended to aggregate Tezos L1 and Tezos X data in one place.",
    "The public repository says the project includes Tezos X and EVM-runtime indexing alongside Tezos L1 support.",
    "The teaser site describes a single explorer for two chains, but currently states that the product is coming soon.",
    "Baking Bad warns that the project remains under development, so data correctness and interfaces may change before launch.",
  ].map((item) => `- ${item}`).join("\n"),
  content: `
<p><strong>0xTzKT, a new project from the Baking Bad team, is being positioned as a single explorer and data layer for Tezos L1 and Tezos X.</strong> Its public teaser page is deliberately brief: “One explorer. Two chains. Soon.” The accompanying open-source repository provides a clearer view of the work underway, describing 0xTzKT as a multi-chain indexer and API designed to aggregate data from Tezos L1 and Tezos X, including the EVM runtime, in one place.</p>

<p>The project is not presented as a finished public product. Baking Bad’s README explicitly says that 0xTzKT is under development, that data correctness is not guaranteed, and that breaking changes are possible. For readers, that distinction matters: this is an early look at infrastructure being built for a more interconnected Tezos ecosystem, rather than a confirmation that every explorer feature is available today.</p>

<h2>What 0xTzKT is intended to connect</h2>

<p>Tezos is evolving into an ecosystem with more than one execution environment. Tezos L1 remains the base layer associated with Michelson smart contracts, while Tezos X is being developed with both Michelson and EVM interfaces. An explorer that can surface data across those environments could give developers and users a more coherent way to follow activity without treating each layer and runtime as an entirely separate destination.</p>

<p>According to the repository, 0xTzKT is intended to index both Tezos L1 and Tezos X data, including Tezos X’s EVM runtime, then expose that information through a single API. The source tree is organised around separate L1 and Tezos X indexers as well as an API, metadata service and shared data components. That architecture reflects the project’s stated goal of joining layers while retaining the distinct technical contexts they serve.</p>

<h2>Why a shared explorer layer could matter</h2>

<p>Explorers are often the practical entry point for understanding an on-chain action. They help users inspect transactions and accounts, while developers rely on indexed data and APIs to build dashboards, applications and operational tools. As Tezos X expands the ecosystem’s runtime choices, the challenge is not simply making more data available; it is making the relationships between data sources legible.</p>

<p>0xTzKT’s stated direction is therefore notable. Rather than presenting Tezos L1, Tezos X, Michelson and EVM activity as disconnected information silos, the project aims to consolidate them in one data surface. The eventual value of that approach will depend on the explorer’s coverage, reliability and interface design once the service is available, but the goal aligns with the broader need for tooling that can follow activity across the Tezos stack.</p>

<h2>Open-source work, with an early-stage warning</h2>

<p>The public repository is released under the MIT licence and includes Docker and source-installation instructions. Its documentation describes independent indexers for Tezos X and Tezos L1, with the L1 indexer included in the full Compose profile. This gives technical users a way to inspect the project’s direction while development continues.</p>

<p>The same documentation also provides the most important caveat: 0xTzKT is still under development. Readers should not rely on it as a source of definitive chain data until the team confirms the public service is ready and its coverage is documented. When it launches, the project will need to demonstrate how it handles the changing interfaces and data models around Tezos X as well as established L1 activity.</p>

<h2>Where to follow the project</h2>

<p>The 0xTzKT teaser page is available at <a href="https://xtzkt.io" target="_blank" rel="noopener noreferrer">xtzkt.io</a>, and the source code is published in the <a href="https://github.com/baking-bad/xtzkt" target="_blank" rel="noopener noreferrer">Baking Bad GitHub repository</a>. XTZ.News has also added <a href="/projects/0xtzkt">a 0xTzKT project-directory profile</a> with those official links and the project’s current in-development status.</p>
`,
};

const project = {
  title: "0xTzKT",
  slug: "0xtzkt",
  excerpt: "An in-development multi-chain Tezos indexer and API from Baking Bad, intended to aggregate Tezos L1, Tezos X, Michelson and EVM data in one place.",
  shortDescription: "One explorer for Tezos L1 and Tezos X — currently in development.",
  content: `
<p><strong>0xTzKT is an in-development multi-chain indexer and API from Baking Bad.</strong> The project’s public repository says it is intended to index Tezos L1 and Tezos X, including the EVM runtime, and aggregate the resulting data in one place.</p>

<p>The public teaser page describes the direction simply as “One explorer. Two chains.” The service is not yet presented as a finished public product. Baking Bad’s documentation warns that data correctness is not guaranteed while the project remains under development and that breaking changes are possible.</p>

<p>Follow the project through its <a href="https://xtzkt.io" target="_blank" rel="noopener noreferrer">official teaser site</a> and <a href="https://github.com/baking-bad/xtzkt" target="_blank" rel="noopener noreferrer">open-source GitHub repository</a>. Read XTZ.News coverage: <a href="/0xtzkt-one-explorer-tezos-l1-tezos-x">0xTzKT Previews One Explorer for Tezos L1 and Tezos X</a>.</p>
`,
  featuredImageAlt: "0xTzKT artwork showing a cat bridging Tezos L1 and Tezos X trucks",
  category: "Block Explorer",
  websiteUrl: "https://xtzkt.io",
  github: "https://github.com/baking-bad/xtzkt",
  twitter: "https://x.com/TezosBakingBad",
  tags: JSON.stringify(["Tezos L1", "Tezos X", "Michelson", "EVM", "Indexer", "API"]),
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
    [
      article.title, article.slug, article.content, article.excerpt, featuredImageUrl, article.featuredImageAlt,
      article.seoTitle, article.seoDescription, article.keyTakeaways, article.authorSlug,
    ],
  );

  const [[post]] = await connection.execute("SELECT id FROM posts WHERE slug = ?", [article.slug]);
  const [categories] = await connection.execute(
    "SELECT id FROM categories WHERE slug IN ('infrastructure', 'latest-news')",
  );
  const [tags] = await connection.execute(
    "SELECT id FROM tags WHERE slug IN ('tezos', 'tezos-x', 'evm', 'michelson')",
  );

  await connection.execute("DELETE FROM post_categories WHERE postId = ?", [post.id]);
  await connection.execute("DELETE FROM post_tags WHERE postId = ?", [post.id]);
  for (const category of categories) {
    await connection.execute("INSERT INTO post_categories (postId, categoryId) VALUES (?, ?)", [post.id, category.id]);
  }
  for (const tag of tags) {
    await connection.execute("INSERT INTO post_tags (postId, tagId) VALUES (?, ?)", [post.id, tag.id]);
  }

  await connection.execute(
    `INSERT INTO projects (
      title, slug, content, excerpt, featuredImageUrl, featuredImageAlt, category, websiteUrl,
      status, publishedAt, twitter, github, shortDescription, tags, featured, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'publish', NOW(), ?, ?, ?, ?, false, NOW())
    ON DUPLICATE KEY UPDATE
      title = VALUES(title), content = VALUES(content), excerpt = VALUES(excerpt),
      featuredImageUrl = VALUES(featuredImageUrl), featuredImageAlt = VALUES(featuredImageAlt),
      category = VALUES(category), websiteUrl = VALUES(websiteUrl), status = 'publish',
      twitter = VALUES(twitter), github = VALUES(github), shortDescription = VALUES(shortDescription),
      tags = VALUES(tags), featured = false, updatedAt = NOW()`,
    [
      project.title, project.slug, project.content, project.excerpt, featuredImageUrl, project.featuredImageAlt,
      project.category, project.websiteUrl, project.twitter, project.github, project.shortDescription, project.tags,
    ],
  );

  await connection.commit();
  console.log(JSON.stringify({
    articleUrl: `https://xtz.news/${article.slug}`,
    projectUrl: `https://xtz.news/projects/${project.slug}`,
    mediaPath: featuredImageUrl,
  }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
