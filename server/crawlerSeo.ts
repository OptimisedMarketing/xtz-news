import { getEditorialAuthor, getEditorialAuthorFromPath } from "../shared/editorialAuthors";

export type CrawlerArticle = {
  title: string;
  slug: string;
  excerpt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  publishedAt: Date | null;
  updatedAt: Date | null;
  authorSlug?: string | null;
};

export type CrawlerTranslation = {
  locale: string;
  title: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type NewsSitemapArticle = {
  slug: string;
  title: string;
  publishedAt: Date | null;
};

export type TranslationSitemapEntry = {
  locale: string;
  slug: string;
  translatedAt: Date | null;
};

export const CRAWLER_ROUTE_PREFIXES = [
  "category", "tag", "projects", "timeline", "events", "contact", "admin", "explorer",
  "staking", "tools", "guides", "glossary", "post-quantum", "art", "prices",
  "etherlink", "wallets", "art-on-tezos", "community-services", "onchain-community-archives", "search", "unsubscribe", "manage-subscriptions", "authors", "newsroom", "advertise",
];

export const SEO_STATIC_PAGES = [
  { url: "/post-quantum", priority: "0.8", changefreq: "weekly" },
  { url: "/guides/tz5-wallet", priority: "0.8", changefreq: "monthly" },
  { url: "/glossary/tezos-prefixes", priority: "0.7", changefreq: "monthly" },
  { url: "/etherlink", priority: "0.8", changefreq: "weekly" },
  { url: "/etherlink/bridge", priority: "0.8", changefreq: "monthly" },
  { url: "/wallets", priority: "0.8", changefreq: "monthly" },
  { url: "/staking/start", priority: "0.8", changefreq: "monthly" },
  { url: "/art-on-tezos", priority: "0.8", changefreq: "weekly" },
  { url: "/community-services", priority: "0.6", changefreq: "monthly" },
  { url: "/onchain-community-archives", priority: "0.7", changefreq: "weekly" },
  { url: "/events", priority: "0.7", changefreq: "weekly" },
  { url: "/authors/lee-evans", priority: "0.5", changefreq: "monthly" },
  { url: "/authors/rossa-browne", priority: "0.5", changefreq: "monthly" },
  { url: "/newsroom/editorial-policy", priority: "0.5", changefreq: "monthly" },
  { url: "/advertise", priority: "0.4", changefreq: "monthly" },
];

type StaticMeta = { title: string; description: string };
type FaqItem = { question: string; answer: string };

const STATIC_META: Record<string, StaticMeta> = {
  "/": {
    title: "Tezos News | XTZ.News — Latest Tezos Blockchain Updates",
    description: "Tezos news, protocol updates, Etherlink coverage, XTZ tools, and ecosystem explainers from XTZ.News.",
  },
  "/tools/wallet": {
    title: "Tezos Wallet Inspector | Check Tezos Addresses | XTZ.News",
    description: "Inspect a Tezos wallet address, understand account prefixes, and find safe Tezos wallet guidance on XTZ.News.",
  },
  "/glossary/tezos-prefixes": {
    title: "Tezos Address Prefix Glossary: tz1, tz2, tz3, tz4, tz5, KT1 and sr1 | XTZ.News",
    description: "A plain-English Tezos address-prefix glossary covering tz1, tz2, tz3, tz4, tz5, KT1 contracts, sr1 rollups, and how to recognise them.",
  },
  "/guides/tz5-wallet": {
    title: "tz5 Wallet Guide: Tezos Post-Quantum Account Prefix Explained | XTZ.News",
    description: "Understand the Tezos tz5 account prefix, its ML-DSA-44 cryptography, current testnet-stage status, and safe next steps.",
  },
  "/staking": {
    title: "Tezos Staking Guide and Rewards Tool | XTZ.News",
    description: "Learn how Tezos staking works, explore rewards context, and use the XTZ.News Tezos staking tools.",
  },
  "/tools/rewards": {
    title: "Tezos Staking Rewards Calculator | XTZ.News",
    description: "Explore Tezos staking reward scenarios with the XTZ.News calculator and linked plain-English staking guidance.",
  },
  "/prices": {
    title: "Tezos Price (XTZ) | Live Market Context and Tezos News | XTZ.News",
    description: "Follow current Tezos price context alongside source-led XTZ news, ecosystem updates, and practical Tezos resources.",
  },
  "/explorer": {
    title: "Tezos Blockchain Explorer | Transactions, Addresses and Bakers | XTZ.News",
    description: "Explore Tezos blocks, transactions, addresses, bakers, and token activity with the XTZ.News blockchain explorer.",
  },
  "/tools/contract": {
    title: "Tezos Contract Inspector | Understand KT1 Contracts | XTZ.News",
    description: "Inspect Tezos contract information and learn what KT1 contract addresses represent with XTZ.News.",
  },
  "/post-quantum": {
    title: "Tezos Post-Quantum Hub | tz5, Cryptography and Network Updates | XTZ.News",
    description: "Follow Tezos post-quantum research, tz5 account guidance, explainer resources, and related XTZ.News coverage.",
  },
  "/etherlink": {
    title: "Etherlink Hub: Tezos EVM News, Bridge & Resources | XTZ.News",
    description: "A source-led Etherlink hub for Tezos readers: XTZ.News coverage, EVM and Michelson context, bridge documentation, and official network resources.",
  },
  "/etherlink/bridge": {
    title: "How to Bridge XTZ to Etherlink: Timing & Safety Guide | XTZ.News",
    description: "A plain-English Etherlink bridge explainer: deposits, withdrawals, timing context, and the official resources to review before moving XTZ between Tezos and Etherlink.",
  },
  "/wallets": {
    title: "Tezos Wallet Starter Guide: First Steps for New Users | XTZ.News",
    description: "A clear Tezos wallet starter hub for new users: official wallet setup guidance, address prefixes, read-only tools, staking context, and safe next steps.",
  },
  "/staking/start": {
    title: "Tezos Staking Starter Guide: Delegation Explained | XTZ.News",
    description: "A beginner-friendly Tezos staking starter hub explaining delegation, staking, bakers, liquidity, and the official route to check before you act.",
  },
  "/art-on-tezos": {
    title: "Art on Tezos Hub: Projects, Artists and News | XTZ.News",
    description: "Explore Tezos art projects, creator-led coverage, collecting context, exhibitions, and digital-art resources from XTZ.News.",
  },
  "/community-services": {
    title: "Tezos Community Services | Agencies, Studios & Marketing | XTZ.News",
    description: "Discover Tezos-facing agencies, development studios and marketing providers in the XTZ.News Community Services directory.",
  },
  "/onchain-community-archives": {
    title: "Onchain Community Archives | Tezos Culture Projects | XTZ.News",
    description: "Discover Tezos culture projects and editorial coverage that preserve community-made work, shared digital art, and recurring onchain records.",
  },
  "/events": {
    title: "Tezos Events | Editor-Reviewed Calendar | XTZ.News",
    description: "Browse editor-reviewed Tezos event listings with source links and calendar downloads from XTZ.News.",
  },
  "/newsroom/editorial-policy": {
    title: "Newsroom Editorial Policy | XTZ.News",
    description: "Read how XTZ.News approaches source-led Tezos reporting, corrections, author attribution, and transparent first-party promotions.",
  },
  "/advertise": {
    title: "Advertise With XTZ.News | Tezos News Partnerships",
    description: "Explore advertising and partnership enquiries for XTZ.News, including clearly labelled sponsorship, promotion, and project-directory opportunities.",
  },
};

const STATIC_FAQS: Record<string, FaqItem[]> = {
  "/tools/wallet": [
    { question: "What can the Tezos Wallet Inspector show?", answer: "The XTZ.News Wallet Inspector can show public address information such as balances, tokens, NFTs, delegation and recent transactions. It does not require a private key or recovery phrase." },
    { question: "What Tezos address prefixes might I see?", answer: "Tezos account and contract identifiers can begin with prefixes such as tz1, tz2, tz3, tz4, tz5 or KT1. Use the XTZ.News address-prefix glossary for a plain-English explanation of each family." },
    { question: "Can I move funds with the Wallet Inspector?", answer: "No. The Wallet Inspector is read-only. It is designed to help readers understand public on-chain information without connecting or authorising a wallet." },
  ],
  "/staking": [
    { question: "What is Tezos staking?", answer: "Tezos staking allows holders to delegate baking power to a validator, commonly called a baker, while retaining control of their tokens. Rewards and conditions can vary by baker and protocol rules." },
    { question: "How can I use the Tezos staking calculator?", answer: "Use the calculator to compare public baker information and indicative reward context. Review a baker's current information and make your own decision before delegating." },
    { question: "Is the staking calculator personalised financial advice?", answer: "No. The calculator presents public data and illustrative reward context. It does not provide personalised financial, tax, legal, or investment advice." },
  ],
  "/tools/rewards": [
    { question: "What does the Tezos rewards history tool show?", answer: "The rewards tool presents available baker and delegator reward history for a public Tezos address over the selected cycles." },
    { question: "Do historical Tezos rewards guarantee future rewards?", answer: "No. Historical reward data is context only. Baker performance, protocol conditions, fees and delegation choices can change over time." },
  ],
  "/prices": [
    { question: "What does the Tezos price page show?", answer: "The XTZ.News price page displays live market context for XTZ and selected Tezos ecosystem tokens, alongside direct paths to news and practical Tezos resources." },
    { question: "Is Tezos price information financial advice?", answer: "No. Price information is provided for general context and is not personalised financial, investment, legal, or tax advice." },
    { question: "Where can I learn about Tezos beyond market data?", answer: "Readers can use the linked Tezos Explorer, Wallet Inspector, staking guide, and source-led XTZ.News coverage to explore the ecosystem further." },
  ],
  "/explorer": [
    { question: "What can I search in the Tezos Explorer?", answer: "The XTZ.News Tezos Explorer supports public on-chain discovery for blocks, transactions, common Tezos addresses, bakers and token activity." },
    { question: "Do I need to connect a wallet to use the Tezos Explorer?", answer: "No. The Explorer is a public, read-only discovery tool and does not require a wallet connection to look up available chain information." },
    { question: "How can I understand a Tezos address prefix?", answer: "Use the linked Tezos address-prefix glossary for a plain-English reference to common account, contract and rollup address families." },
  ],
  "/etherlink": [
    { question: "What is Etherlink?", answer: "Etherlink is a non-custodial execution layer for Tezos powered by Tezos Smart Rollup technology. Its official documentation describes EVM and Michelson interfaces for the same blockchain." },
    { question: "Can I bridge XTZ between Tezos and Etherlink?", answer: "The official Etherlink bridge supports transfers between Tezos layer 1 and Etherlink EVM. Read the current official bridge instructions and timing information before initiating a transfer." },
    { question: "Is Etherlink a separate token?", answer: "Etherlink uses XTZ as its native coin. Its documentation also describes WXTZ, an ERC-20-compatible wrapped representation for use in relevant EVM applications." },
  ],
  "/etherlink/bridge": [
    { question: "What does bridging XTZ to Etherlink mean?", answer: "The official Etherlink documentation calls a transfer from Tezos layer 1 to Etherlink EVM a deposit. It moves XTZ into the Etherlink EVM context so it can be used there." },
    { question: "How long does an Etherlink bridge transfer take?", answer: "Official documentation says deposits from Tezos layer 1 are available on Etherlink immediately. Standard withdrawals back to Tezos layer 1 are normally available after 15 days; the optional fast-withdrawal path has a fee and may be available within approximately one minute." },
    { question: "Which bridge should I use?", answer: "Use the current official Etherlink bridge and verify the website address, selected network, asset, destination, and displayed timing before confirming any transaction." },
  ],
  "/wallets": [
    { question: "What is a Tezos wallet?", answer: "A Tezos wallet is an application that maintains your account and signs Tezos transactions on your behalf. Wallets allow dApp interaction without exposing the account private key." },
    { question: "Which Tezos wallet should I use?", answer: "Wallet choice depends on your needs and preferred form factor. Consult the current official Tezos wallet documentation and each wallet provider’s own information before installing or using a wallet." },
    { question: "What is the difference between tz1 and KT1?", answer: "Tezos user accounts can use prefixes such as tz1, tz2, tz3, or tz4. KT1 identifies a smart contract. Use the XTZ.News prefix glossary for a plain-English reference." },
  ],
  "/staking/start": [
    { question: "What is the difference between Tezos delegation and staking?", answer: "Delegation keeps your tez liquid and lets a baker use its associated baking power. Staking locks tez with a baker, increases the baker’s baking power more fully, and brings slashing exposure. Review the current official staking information before acting." },
    { question: "Do I have to run a baker to delegate or stake?", answer: "No. The official Tezos documentation describes delegation and staking with a baker as options for people who do not want to run a baking node themselves." },
    { question: "How do I start staking tez?", answer: "The official Tezos staking application provides the current workflow. If you are not already delegated, the official guidance says you first delegate to a baker that accepts external stakers and then choose the staking action." },
  ],
  "/art-on-tezos": [
    { question: "What is the Art on Tezos collection hub?", answer: "It is an XTZ.News reading and discovery page that groups published Tezos art projects, relevant editorial coverage, and practical ecosystem paths in one place." },
    { question: "Does XTZ.News endorse the listed art projects or collections?", answer: "No. The hub is an editorial discovery surface. Readers should review each project’s official information and make their own decisions before collecting, supporting, or using any service." },
    { question: "Where can I find more Tezos art coverage?", answer: "Use the Art on Tezos news collection, the XTZ.News project directory, and the linked category archives to follow new published coverage." },
  ],
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const escapeAttribute = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/**
 * Google News accepts recently published articles only. Keep the feed dynamic
 * and bounded to the last 48 hours, while the primary sitemap retains the
 * complete canonical article archive.
 */
export function renderNewsSitemapXml({
  articles,
  baseUrl,
  now = new Date(),
}: {
  articles: NewsSitemapArticle[];
  baseUrl: string;
  now?: Date;
}): string {
  const cutoff = now.getTime() - 2 * 24 * 60 * 60 * 1000;
  const datedArticles = articles
    .filter((article) => article.publishedAt)
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
  const recentArticles = datedArticles
    .filter((article) => article.publishedAt && new Date(article.publishedAt).getTime() >= cutoff)
  // Google Search Console rejects an empty <urlset>. During an editorial gap,
  // retain the most recent article as a parser-safe placeholder; Google News
  // can ignore it as outside its recency window, while canonical discovery
  // remains on /sitemap.xml.
  const feedArticles = recentArticles.length ? recentArticles : datedArticles.slice(0, 1);
  const entries = feedArticles
    .map((article) => {
      const publishedAt = new Date(article.publishedAt!).toISOString();
      return `  <url>\n    <loc>${escapeXml(`${baseUrl}/${article.slug}`)}</loc>\n    <news:news>\n      <news:publication><news:name>XTZ.News</news:name><news:language>en</news:language></news:publication>\n      <news:publication_date>${publishedAt}</news:publication_date>\n      <news:title>${escapeXml(article.title)}</news:title>\n    </news:news>\n  </url>`;
    });
  const fallbackUrl = entries.length === 0
    ? `  <url>\n    <loc>${escapeXml(baseUrl)}</loc>\n  </url>`
    : "";
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ...entries,
    fallbackUrl,
    '</urlset>',
  ].filter(Boolean).join("\n");
}

/**
 * Keep translated URLs separate from the primary canonical sitemap. This keeps
 * the canonical map compact and lets the substantially larger translated set
 * use a longer, independent cache lifetime.
 */
export function renderTranslationSitemapXml({
  translations,
  baseUrl,
  generatedAt = new Date(),
}: {
  translations: TranslationSitemapEntry[];
  baseUrl: string;
  generatedAt?: Date;
}): string {
  const fallbackDate = generatedAt.toISOString().split("T")[0];
  const entries = translations.map((translation) => {
    const lastmod = translation.translatedAt
      ? new Date(translation.translatedAt).toISOString().split("T")[0]
      : fallbackDate;
    return `  <url>\n    <loc>${escapeXml(`${baseUrl}/${translation.locale}/${translation.slug}`)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
  ].join("\n");
}

export function toRelayedMediaUrl(value: string | null, baseUrl: string): string {
  if (!value) return `${baseUrl}/media/xtz-logo-square_c6689606.png`;
  if (value.startsWith("http")) return value;
  if (value.startsWith("/media/")) return `${baseUrl}${value}`;
  if (value.startsWith("/manus-storage/")) return `${baseUrl}${value.replace(/^\/manus-storage\//, "/media/")}`;
  return `${baseUrl}/${value.replace(/^\/+/, "")}`;
}

export function getCrawlerStaticMeta(pathname: string): StaticMeta {
  const author = getEditorialAuthorFromPath(pathname);
  if (author) {
    return { title: `${author.name} | XTZ.News`, description: author.description };
  }
  return STATIC_META[pathname] || STATIC_META["/"];
}

export function getCrawlerStaticFaqs(pathname: string): FaqItem[] {
  return STATIC_FAQS[pathname] || [];
}

export function renderCrawlerHtml({
  html,
  baseUrl,
  pathname,
  article,
  translation,
  translationLocales = [],
}: {
  html: string;
  baseUrl: string;
  pathname: string;
  article?: CrawlerArticle;
  translation?: CrawlerTranslation;
  translationLocales?: string[];
}): string {
  const canonical = `${baseUrl}${pathname}`;
  const editorialAuthor = getEditorialAuthor(article?.authorSlug) || getEditorialAuthorFromPath(pathname);
  const staticMeta = getCrawlerStaticMeta(pathname);
  const title = article
    ? translation?.metaTitle || translation?.title || article.seoTitle || article.title
    : staticMeta.title;
  const description = article
    ? translation?.metaDescription || translation?.excerpt || article.seoDescription || article.excerpt || staticMeta.description
    : staticMeta.description;
  const cleanDescription = stripHtml(description).slice(0, 300);
  const image = toRelayedMediaUrl(article?.featuredImageUrl || null, baseUrl);
  const type = article ? "article" : "website";
  const published = article?.publishedAt ? new Date(article.publishedAt).toISOString() : "";
  const modified = article?.updatedAt ? new Date(article.updatedAt).toISOString() : "";
  const htmlLanguage = translation?.locale || "en";

  const articleSchema = article ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline: title,
    description: cleanDescription,
    image: {
      "@type": "ImageObject",
      url: image,
      caption: article.featuredImageAlt || title,
    },
    datePublished: published || undefined,
    dateModified: modified || published || undefined,
    inLanguage: htmlLanguage,
    articleSection: "Tezos News",
    isAccessibleForFree: true,
    author: editorialAuthor
      ? { "@type": "Person", name: editorialAuthor.name, url: `${baseUrl}/authors/${editorialAuthor.slug}` }
      : { "@type": "Organization", name: "XTZ.News", url: baseUrl },
    publisher: {
      "@type": "Organization",
      name: "XTZ.News",
      url: baseUrl,
      logo: { "@type": "ImageObject", url: `${baseUrl}/media/xtz-logo-square_c6689606.png` },
    },
  } : undefined;

  const breadcrumbSchema = article ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: title, item: canonical },
    ],
  } : undefined;

  const personSchema = editorialAuthor ? {
    "@context": "https://schema.org",
    "@type": "Person",
    name: editorialAuthor.name,
    url: `${baseUrl}/authors/${editorialAuthor.slug}`,
    jobTitle: editorialAuthor.jobTitle,
    description: editorialAuthor.description,
    homeLocation: { "@type": "Place", name: editorialAuthor.location },
    ...(editorialAuthor.imageUrl ? { image: toRelayedMediaUrl(editorialAuthor.imageUrl, baseUrl) } : {}),
    ...(editorialAuthor.websiteUrl ? { sameAs: [editorialAuthor.websiteUrl] } : {}),
    worksFor: { "@type": "Organization", name: "XTZ.News", url: baseUrl },
  } : undefined;

  const staticFaqs = article ? [] : getCrawlerStaticFaqs(pathname);
  const faqSchema = staticFaqs.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: staticFaqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  } : undefined;

  const alternates = article
    ? [
        `<link rel="alternate" hreflang="en" href="${baseUrl}/${article.slug}" />`,
        ...translationLocales.map(locale => `<link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}/${article.slug}" />`),
        `<link rel="alternate" hreflang="x-default" href="${baseUrl}/${article.slug}" />`,
      ].join("\n    ")
    : "";

  const replace = (source: string, matcher: RegExp, replacement: string) => matcher.test(source)
    ? source.replace(matcher, replacement)
    : source;

  let rendered = html
    .replace(/<html\s+lang=["'][^"']+["']>/i, `<html lang="${htmlLanguage}">`)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(title)}</title>`)
    .replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeAttribute(cleanDescription)}" />`)
    .replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}" />`);

  rendered = replace(rendered, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeAttribute(title)}" />`);
  rendered = replace(rendered, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeAttribute(cleanDescription)}" />`);
  rendered = replace(rendered, /<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${image}" />`);
  rendered = replace(rendered, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonical}" />`);
  rendered = replace(rendered, /<meta\s+property=["']og:type["'][^>]*>/i, `<meta property="og:type" content="${type}" />`);

  const extraHead = [
    alternates,
    `<meta name="twitter:title" content="${escapeAttribute(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(cleanDescription)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    published ? `<meta property="article:published_time" content="${published}" />` : "",
    modified ? `<meta property="article:modified_time" content="${modified}" />` : "",
    articleSchema ? `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>` : "",
    breadcrumbSchema ? `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>` : "",
    personSchema ? `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>` : "",
    faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` : "",
  ].filter(Boolean).join("\n    ");

  return rendered.replace("</head>", `    ${extraHead}\n  </head>`);
}
