import { useEffect } from "react";

const SITE_URL = "https://xtz.news";
const SITE_NAME = "XTZ.News";
const DEFAULT_IMAGE = `${SITE_URL}/manus-storage/xtz-logo-square_c6689606.png`;
const TWITTER_HANDLE = "@XTZNews";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: "website" | "article" | "profile";
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

export function useSEO({
  title, description, keywords, canonical, ogType = "website", ogImage,
  twitterCard = "summary_large_image", article, jsonLd, noIndex = false,
}: SEOProps) {
  useEffect(() => {
    const image = ogImage || DEFAULT_IMAGE;
    const url = canonical || SITE_URL;
    document.title = title;

    const setMeta = (nameOrProp: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, nameOrProp); document.head.appendChild(el); }
      el.content = content;
    };
    const removeMeta = (nameOrProp: string, attr: "name" | "property" = "name") => {
      document.querySelector(`meta[${attr}="${nameOrProp}"]`)?.remove();
    };
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) { el = document.createElement("link"); el.rel = rel; document.head.appendChild(el); }
      el.href = href;
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setLink("canonical", url);

    // Open Graph
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:image", image, "property");
    setMeta("og:image:width", "1200", "property");
    setMeta("og:image:height", "630", "property");
    setMeta("og:url", url, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:locale", "en_GB", "property");

    // Article OG
    if (ogType === "article" && article) {
      if (article.publishedTime) setMeta("article:published_time", article.publishedTime, "property");
      if (article.modifiedTime) setMeta("article:modified_time", article.modifiedTime, "property");
      if (article.author) setMeta("article:author", article.author, "property");
      if (article.section) setMeta("article:section", article.section, "property");
      if (article.tags) {
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
        article.tags.slice(0, 5).forEach(tag => {
          const el = document.createElement("meta");
          el.setAttribute("property", "article:tag");
          el.content = tag;
          document.head.appendChild(el);
        });
      }
    } else {
      removeMeta("article:published_time", "property");
      removeMeta("article:modified_time", "property");
      removeMeta("article:author", "property");
      removeMeta("article:section", "property");
    }

    // Twitter Card
    setMeta("twitter:card", twitterCard);
    setMeta("twitter:site", TWITTER_HANDLE);
    setMeta("twitter:creator", TWITTER_HANDLE);
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
    setMeta("twitter:image:alt", title);

    // JSON-LD
    document.querySelector('script[data-seo="true"]')?.remove();
    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      document.head.appendChild(script);
    }

    return () => {
      document.title = `${SITE_NAME} — Tezos News`;
      document.querySelector('script[data-seo="true"]')?.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, keywords, canonical, ogType, ogImage, twitterCard, noIndex]);
}

// Schema builders
export const buildArticleSchema = (opts: {
  title: string; description: string; url: string; image?: string;
  datePublished?: string; dateModified?: string; authorName?: string; categoryName?: string;
}) => ({
  "@context": "https://schema.org", "@type": "NewsArticle",
  "headline": opts.title, "description": opts.description, "url": opts.url,
  "image": opts.image || DEFAULT_IMAGE,
  "datePublished": opts.datePublished, "dateModified": opts.dateModified || opts.datePublished,
  "author": { "@type": "Organization", "name": opts.authorName || SITE_NAME, "url": SITE_URL },
  "publisher": { "@type": "Organization", "name": SITE_NAME, "url": SITE_URL, "logo": { "@type": "ImageObject", "url": DEFAULT_IMAGE } },
  "mainEntityOfPage": { "@type": "WebPage", "@id": opts.url },
  ...(opts.categoryName ? { "articleSection": opts.categoryName } : {}),
});

export const buildWebPageSchema = (opts: {
  title: string; description: string; url: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}) => ({
  "@context": "https://schema.org", "@type": "WebPage",
  "name": opts.title, "description": opts.description, "url": opts.url,
  "isPartOf": { "@type": "WebSite", "name": SITE_NAME, "url": SITE_URL },
  ...(opts.breadcrumbs ? {
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": opts.breadcrumbs.map((b, i) => ({ "@type": "ListItem", "position": i + 1, "name": b.name, "item": b.url })),
    },
  } : {}),
});

export const buildToolSchema = (opts: { name: string; description: string; url: string }) => ({
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  "name": opts.name, "description": opts.description, "url": opts.url,
  "applicationCategory": "FinanceApplication", "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "publisher": { "@type": "Organization", "name": SITE_NAME, "url": SITE_URL },
});

export const SITE_URL_CONST = SITE_URL;
