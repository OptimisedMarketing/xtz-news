import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const featuredImageUrl = "/manus-storage/quantumnet-post-quantum-testnet-hero-a_897ac92d.jpg";
const article = {
  title: "Quantumnet Goes Live as Tezos Opens Its Experimental Post-Quantum Testnet",
  slug: "quantumnet-live-tezos-experimental-post-quantum-testnet",
  excerpt: "Tezos’ Quantumnet is live: an experimental public testnet bringing tz5 accounts, revised baking-rights selection, post-quantum consensus work and data-availability research into one open technical testbed.",
  seoTitle: "Quantumnet Is Live: Tezos Experimental Post-Quantum Testnet | XTZ.News",
  seoDescription: "Tezos launches Quantumnet, an experimental post-quantum testnet for tz5 accounts, baking rights, consensus attestations and data availability research.",
  featuredImageAlt: "Abstract blue and violet technical network with a luminous geometric core representing Tezos Quantumnet post-quantum testnet research",
  authorSlug: "lee-evans",
  keyTakeaways: [
    "Quantumnet is a public experimental Tezos testnet for evaluating post-quantum changes together; it is not intended for production use.",
    "The testnet activates tz5 accounts using ML-DSA-44 and expands the work to baking rights, consensus attestations and the Data Availability Layer.",
    "Its current design replaces protocol randomness with Smooth Weighted Round Robin, uses XMSS signatures with STARK aggregation for attestations, and evaluates ZODA for data availability.",
    "Engineers, bakers and technical contributors can follow the work through the public dashboard as the testnet is tested and refined in the open.",
  ].map((item) => `- ${item}`).join("\n"),
  content: `
<p><strong>Quantumnet, Tezos’ first experimental post-quantum testnet, is now live.</strong> The public network brings together a set of protocol changes intended to test what a future post-quantum Tezos layer 1 could require—not only for user accounts, but also for baking rights, consensus attestations and data availability.</p>

<p>The Tezos Spotlight announcement describes Quantumnet as an engineering testbed developed by contributors including Nomadic Labs and Trilitech. It is deliberately an experimental network, with a technical focus and limited user experience. That distinction matters: Quantumnet is not a production network or a recommendation to move funds. Its current role is to let engineers, bakers and the wider technical community examine how several post-quantum approaches behave together in public.</p>

<h2>From tz5 accounts to a wider protocol test</h2>

<p>Tezos took an earlier step toward post-quantum accounts when the Ushuaia protocol amendment activated in June 2026. Ushuaia introduced testnet-only, feature-flagged support for <code>tz5</code> accounts using ML-DSA-44, a post-quantum signature scheme standardised by the US National Institute of Standards and Technology.</p>

<p>Quantumnet is the first Tezos testnet to switch that capability on. The key change is scope: accounts are only one part of a blockchain’s cryptographic design. The network also needs ways to select baking rights, aggregate consensus operations and make data available to participants. Quantumnet places proposed approaches to those duties in the same testbed so their trade-offs can be assessed together.</p>

<h2>What changes inside Quantumnet</h2>

<p>For baking rights, Quantumnet removes the existing Verifiable Delay Function and its use of protocol randomness. The testnet instead uses Smooth Weighted Round Robin, a mechanism intended to distribute baking opportunities fairly according to baker weight. The move is notable because it changes a core part of how the network schedules block production rather than adding a new account type in isolation.</p>

<p>Consensus attestations receive a different treatment too. Tezos mainnet uses BLS signatures to combine many attestations efficiently. Quantumnet replaces that approach with hash-based XMSS signatures and a post-quantum STARK aggregation system developed by the LeanEthereum project. The aim is to test whether a large set of attestations can still be processed without relying on the cryptographic primitives the experiment is designed to move beyond.</p>

<p>For the Data Availability Layer, the testnet replaces current KZG commitments and proofs with ZODA, a design based on two-dimensional tensor codes. The Tezos Spotlight article presents ZODA as a possible post-quantum route for data availability that does not materially increase the information nodes need to exchange. Quantumnet is the venue for checking how these pieces operate collectively, rather than treating each one as a separate paper exercise.</p>

<h2>An open technical testbed, not a finished migration</h2>

<p>Quantumnet’s first iteration intentionally leaves out the Michelson Sapling feature and timelock puzzles, both of which rely on cryptography that would need further work in a post-quantum transition. The project also says that exact hardware needs are still being evaluated, although current expectations sit above the lightest Tezos node setups while remaining within reach of readily available consumer hardware.</p>

<p>That cautious framing is important. No known quantum computer is currently capable of breaking the public-key cryptography widely used by blockchains, according to the announcement. The rationale for starting now is that cryptographic migrations take time: designs need evaluation, node software and tooling need changes, and account holders eventually need a practical way to adopt new protection. Quantumnet is an early shared test rather than proof that every operational question has been resolved.</p>

<h2>What engineers and bakers can do next</h2>

<p>The project’s immediate audience is technical. Engineers can inspect how the protocols interact, bakers can follow the revised baking-rights and consensus paths, and other contributors can observe performance and implementation issues as they arise. The <a href="https://quantumnet.pqpark.dal.nomadic-labs.com/" target="_blank" rel="noopener noreferrer">public Quantumnet dashboard</a> provides a live view of network activity and links to available technical resources.</p>

<p>Later iterations may add security analysis, performance improvements, more functionality and better tooling. If the components mature, Tezos’ established amendment process provides a route for individual changes to be proposed, reviewed and voted on. For now, the clear result is narrower but still significant: Tezos has moved from previewing a post-quantum testnet to operating a public experimental network where the underlying protocol work can be tested in the open.</p>

<p>Read the <a href="https://spotlight.tezos.com/introducing-quantumnet/" target="_blank" rel="noopener noreferrer">official Quantumnet announcement</a> and Arthur Breitman’s earlier <a href="https://spotlight.tezos.com/why-post-quantum-why-now/" target="_blank" rel="noopener noreferrer">post-quantum background article</a>. For a plain-English introduction to Tezos’ earlier account-level work, see XTZ.News’ <a href="/tezos-post-quantum-previewnet-why-now">coverage of the tz5 previewnet</a>.</p>
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
    "SELECT id FROM tags WHERE slug IN ('tezos', 'post-quantum', 'cryptography', 'tz5', 'ushuaia')",
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
  }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
