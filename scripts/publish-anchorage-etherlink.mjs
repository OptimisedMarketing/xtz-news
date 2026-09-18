import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const featuredImageUrl = "/manus-storage/anchorage-etherlink-institutional-custody-hero-a_a225f097.jpg";
const article = {
  title: "Anchorage Digital Adds Etherlink Custody Support, Including Tokenized Uranium",
  slug: "anchorage-digital-etherlink-custody-tokenized-uranium",
  excerpt: "Anchorage Digital Bank has added institutional custody support for Etherlink-based assets, including xU3O8, tokenized physical uranium, alongside WXTZ, stXTZ, USDT, USDC, USDSM and WETH.",
  seoTitle: "Anchorage Digital Adds Etherlink Custody for Tokenized Uranium | XTZ.News",
  seoDescription: "Anchorage Digital Bank adds institutional custody support for Etherlink assets, including xU3O8 tokenized physical uranium, WXTZ, stXTZ and major stablecoins.",
  featuredImageAlt: "Editorial illustration of a secure digital-asset vault connected to a gold uranium commodity token by blue and violet network lines",
  authorSlug: "lee-evans",
  keyTakeaways: [
    "Anchorage Digital Bank says institutional clients can now custody Etherlink-based assets through segregated accounts at its federally chartered bank.",
    "The initial supported set includes xU3O8, WXTZ, stXTZ, USDT, USDC, USDSM and WETH.",
    "xU3O8 is described by its issuer as a token representing fractional ownership of physical uranium ore concentrate held through regulated custody arrangements.",
    "The announcement expands the custody options available to institutions evaluating tokenized real-world assets issued on Etherlink.",
  ].map((item) => `- ${item}`).join("\n"),
  content: `
<p><strong>Anchorage Digital Bank says it has added custody support for Etherlink and an initial set of assets issued on the Tezos-linked network, including xU3O8, a token representing fractional ownership of physical uranium ore concentrate.</strong> The 16 September announcement makes the assets available to Anchorage Digital institutional clients through segregated custody accounts at the company’s federally chartered bank.</p>

<p>The initial supported Etherlink asset set comprises xU3O8, wrapped XTZ (WXTZ), liquid-staking token stXTZ, Tether’s USDT, Circle’s USDC, Stable Mint’s USDSM and wrapped ether (WETH). Anchorage says the support uses the same institutional custody infrastructure and policy-based controls that clients use for its other holdings.</p>

<h2>Custody arrives for Etherlink-based assets</h2>

<p>Etherlink is an EVM-compatible rollup built on Tezos. Its website describes the network as a non-custodial rollup with low fees and fast transactions, while Anchorage’s announcement focuses on the institutional operational question: whether assets issued on the network can be held inside an established custody framework.</p>

<p>Anchorage Digital CEO and co-founder Nathan McCauley said the constraint for tokenized real-world assets is not only issuance. “Institutions are not short on interest in tokenized real-world assets. They are short on places to hold them that satisfy a risk framework,” he said in the announcement. The company says clients can access the new Etherlink support now.</p>

<h2>xU3O8 and tokenized uranium</h2>

<p>xU3O8 is one of the assets named in the launch. Its issuer describes the token as a blockchain-based record of fractional ownership of physical uranium ore concentrate, also known as U3O8 or yellowcake, held through custody arrangements. The issuer also notes that buying, transferring and redeeming the asset can involve eligibility, approved-venue and regulatory constraints, so token ownership should not be read as an unrestricted right to take physical delivery.</p>

<p>That distinction is important. Anchorage’s announcement is about institutional custody of the token, rather than a recommendation or assessment of the underlying commodity. The availability of custody can reduce an operational hurdle for institutions that have independently chosen to evaluate tokenized commodity exposure, but it does not eliminate market, liquidity, legal, eligibility or asset-specific risks.</p>

<h2>Why the support matters for Etherlink</h2>

<p>For issuers and asset managers, an institutional custody route can be an important part of the path from a token’s technical deployment to broader operational accessibility. Anchorage says its clients can hold supported Etherlink assets in segregated accounts under the controls used for their other digital-asset positions. Ben Elvidge, Head of Alternative Assets at Trillitech, described institutional custody as necessary for tokenized real-world assets to reach institutional balance sheets.</p>

<p>The integration is also a concrete example of Etherlink’s EVM-compatible infrastructure being used for a mix of commodity-linked, Tezos-native and stablecoin assets. The supported list spans WXTZ and stXTZ alongside dollar stablecoins, wrapped ether and xU3O8, showing the breadth of the initial custody scope rather than limiting it to a single token.</p>

<h2>What is confirmed today</h2>

<p>Anchorage Digital’s official statement says the Etherlink support is live for existing institutional clients. It does not change the terms, eligibility requirements or risks of the individual assets. Readers considering xU3O8 should review its issuer’s documentation, custody arrangements, approved-venue rules and risk disclosures directly. Those considering any Etherlink asset should also confirm current support and applicable terms with their own providers.</p>

<p>Read Anchorage Digital’s <a href="https://www.anchorage.com/insights/anchorage-digital-adds-support-for-etherlink-expanding-institutional-access-to-tokenized-real-world-assets" target="_blank" rel="noopener noreferrer">official announcement</a>, the company’s <a href="https://x.com/Anchorage/status/2100239612648321209" target="_blank" rel="noopener noreferrer">social post</a>, and the xU3O8 issuer’s <a href="https://uranium.io/en" target="_blank" rel="noopener noreferrer">product documentation</a>. XTZ.News has also added <a href="/projects/anchorage-digital">Anchorage Digital to the Tezos Projects directory</a> for source-linked discovery.</p>
`,
};

const project = {
  title: "Anchorage Digital",
  slug: "anchorage-digital",
  excerpt: "A federally chartered crypto bank and digital-asset platform that now supports institutional custody of selected Etherlink-based assets, including xU3O8 tokenized uranium.",
  shortDescription: "Institutional digital-asset custody provider with support for selected Etherlink assets.",
  content: `
<p><strong>Anchorage Digital is a digital-asset platform and federally chartered crypto bank that provides institutional custody services.</strong> On 16 September 2026, Anchorage Digital announced support for Etherlink and an initial set of Etherlink-based assets through its institutional custody offering.</p>

<p>The announced asset set includes xU3O8, WXTZ, stXTZ, USDT, USDC, USDSM and WETH. Anchorage says existing institutional clients can custody those assets in segregated accounts at Anchorage Digital Bank, N.A. This directory listing records the confirmed Etherlink support; it is not an endorsement of any asset or service.</p>

<p>Use the <a href="https://www.anchorage.com/insights/anchorage-digital-adds-support-for-etherlink-expanding-institutional-access-to-tokenized-real-world-assets" target="_blank" rel="noopener noreferrer">official Anchorage announcement</a> for current terms and availability. Read XTZ.News coverage: <a href="/anchorage-digital-etherlink-custody-tokenized-uranium">Anchorage Digital Adds Etherlink Custody Support, Including Tokenized Uranium</a>.</p>
`,
  featuredImageAlt: "Editorial illustration of a secure digital-asset vault connected to a gold uranium commodity token by blue and violet network lines",
  category: "Web3 Infrastructure",
  websiteUrl: "https://www.anchorage.com/",
  twitter: "https://x.com/Anchorage",
  tags: JSON.stringify(["Institutional custody", "Etherlink", "Tokenized assets", "xU3O8", "RWA"]),
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
    "SELECT id FROM tags WHERE slug IN ('tezos', 'tezos-x', 'evm')",
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
      status, publishedAt, twitter, shortDescription, tags, featured, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'publish', NOW(), ?, ?, ?, false, NOW())
    ON DUPLICATE KEY UPDATE
      title = VALUES(title), content = VALUES(content), excerpt = VALUES(excerpt),
      featuredImageUrl = VALUES(featuredImageUrl), featuredImageAlt = VALUES(featuredImageAlt),
      category = VALUES(category), websiteUrl = VALUES(websiteUrl), status = 'publish',
      twitter = VALUES(twitter), shortDescription = VALUES(shortDescription),
      tags = VALUES(tags), featured = false, updatedAt = NOW()`,
    [
      project.title, project.slug, project.content, project.excerpt, featuredImageUrl, project.featuredImageAlt,
      project.category, project.websiteUrl, project.twitter, project.shortDescription, project.tags,
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
