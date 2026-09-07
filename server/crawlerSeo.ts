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
};

export type CrawlerTranslation = {
  locale: string;
  title: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

export const CRAWLER_ROUTE_PREFIXES = [
  "category", "tag", "projects", "timeline", "contact", "admin", "explorer",
  "staking", "tools", "guides", "glossary", "post-quantum", "art", "prices",
  "etherlink", "search", "unsubscribe", "manage-subscriptions",
];

export const SEO_STATIC_PAGES = [
  { url: "/post-quantum", priority: "0.8", changefreq: "weekly" },
  { url: "/guides/tz5-wallet", priority: "0.8", changefreq: "monthly" },
  { url: "/glossary/tezos-prefixes", priority: "0.7", changefreq: "monthly" },
  { url: "/etherlink", priority: "0.8", changefreq: "weekly" },
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
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const escapeAttribute = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function toRelayedMediaUrl(value: string | null, baseUrl: string): string {
  if (!value) return `${baseUrl}/media/xtz-logo-square_c6689606.png`;
  if (value.startsWith("http")) return value;
  if (value.startsWith("/media/")) return `${baseUrl}${value}`;
  if (value.startsWith("/manus-storage/")) return `${baseUrl}${value.replace(/^\/manus-storage\//, "/media/")}`;
  return `${baseUrl}/${value.replace(/^\/+/, "")}`;
}

export function getCrawlerStaticMeta(pathname: string): StaticMeta {
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
    author: { "@type": "Organization", name: "XTZ.News", url: baseUrl },
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
    faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` : "",
  ].filter(Boolean).join("\n    ");

  return rendered.replace("</head>", `    ${extraHead}\n  </head>`);
}
