import { describe, expect, it } from "vitest";
import { CRAWLER_ROUTE_PREFIXES, SEO_STATIC_PAGES, getCrawlerStaticFaqs, getCrawlerStaticMeta, renderCrawlerHtml, renderNewsSitemapXml, renderTranslationSitemapXml, toRelayedMediaUrl } from "./crawlerSeo";

const html = `<!doctype html><html lang="en"><head><title>Default title</title><meta name="description" content="Default description" /><link rel="canonical" href="https://xtz.news/" /><meta property="og:title" content="Default title" /><meta property="og:description" content="Default description" /><meta property="og:image" content="https://xtz.news/manus-storage/logo.png" /><meta property="og:url" content="https://xtz.news/" /><meta property="og:type" content="website" /></head><body></body></html>`;

describe("crawler SEO rendering", () => {
  it("uses the same-origin media relay for stored article media", () => {
    expect(toRelayedMediaUrl("/manus-storage/cover.png", "https://xtz.news")).toBe("https://xtz.news/media/cover.png");
  });

  it("renders a page-specific canonical and NewsArticle schema for article crawlers", () => {
    const output = renderCrawlerHtml({
      html,
      baseUrl: "https://xtz.news",
      pathname: "/tezos-wallet-guide",
      article: {
        title: "Tezos wallet guide",
        slug: "tezos-wallet-guide",
        excerpt: "A helpful Tezos wallet guide.",
        seoTitle: "Tezos Wallet Guide | XTZ.News",
        seoDescription: "Learn Tezos wallet basics.",
        featuredImageUrl: "/manus-storage/wallet-cover.png",
        featuredImageAlt: "Tezos wallet guide cover",
        publishedAt: new Date("2026-09-01T00:00:00.000Z"),
        updatedAt: new Date("2026-09-02T00:00:00.000Z"),
      },
      translationLocales: ["fr", "de"],
    });

    expect(output).toContain('<link rel="canonical" href="https://xtz.news/tezos-wallet-guide" />');
    expect(output).toContain('https://xtz.news/media/wallet-cover.png');
    expect(output).toContain('"@type":"NewsArticle"');
    expect(output).toContain('"articleSection":"Tezos News"');
    expect(output).toContain('"isAccessibleForFree":true');
    expect(output).toContain('hreflang="fr" href="https://xtz.news/fr/tezos-wallet-guide"');
    expect(output).toContain('hreflang="x-default"');
  });

  it("keeps priority evergreen routes crawlable and protected from article-slug handling", () => {
    expect(SEO_STATIC_PAGES.map(page => page.url)).toEqual(expect.arrayContaining([
      "/post-quantum", "/guides/tz5-wallet", "/glossary/tezos-prefixes", "/etherlink", "/etherlink/bridge", "/wallets", "/art-on-tezos", "/advertise",
    ]));
    expect(CRAWLER_ROUTE_PREFIXES).toEqual(expect.arrayContaining(["guides", "glossary", "post-quantum", "etherlink", "wallets", "art-on-tezos", "advertise"]));
  });

  it("renders unique advertising-page metadata", () => {
    const output = renderCrawlerHtml({ html, baseUrl: "https://xtz.news", pathname: "/advertise" });
    expect(getCrawlerStaticMeta("/advertise").title).toBe("Advertise With XTZ.News | Tezos News Partnerships");
    expect(output).toContain("advertising and partnership enquiries");
    expect(output).toContain('<link rel="canonical" href="https://xtz.news/advertise" />');
  });

  it("renders complete FAQPage schema for priority Tezos tool routes", () => {
    const output = renderCrawlerHtml({ html, baseUrl: "https://xtz.news", pathname: "/tools/wallet" });

    expect(getCrawlerStaticFaqs("/tools/wallet")).toHaveLength(3);
    expect(output).toContain('"@type":"FAQPage"');
    expect(output).toContain("What can the Tezos Wallet Inspector show?");
    expect(output).toContain("What Tezos address prefixes might I see?");
  });

  it("renders complete FAQPage schema for every selected priority tool route", () => {
    ["/tools/wallet", "/staking", "/tools/rewards", "/prices", "/explorer"].forEach((pathname) => {
      const output = renderCrawlerHtml({ html, baseUrl: "https://xtz.news", pathname });
      expect(getCrawlerStaticFaqs(pathname).length).toBeGreaterThan(0);
      expect(output).toContain('"@type":"FAQPage"');
    });
  });

  it("renders FAQPage schema for the new Etherlink bridge and wallet starter guides", () => {
    ["/etherlink/bridge", "/wallets"].forEach((pathname) => {
      const output = renderCrawlerHtml({ html, baseUrl: "https://xtz.news", pathname });
      expect(getCrawlerStaticFaqs(pathname).length).toBeGreaterThan(0);
      expect(output).toContain('"@type":"FAQPage"');
    });
  });

  it("renders FAQPage schema for the Art on Tezos collection hub", () => {
    const output = renderCrawlerHtml({ html, baseUrl: "https://xtz.news", pathname: "/art-on-tezos" });
    expect(getCrawlerStaticFaqs("/art-on-tezos")).toHaveLength(3);
    expect(output).toContain('"@type":"FAQPage"');
    expect(output).toContain("What is the Art on Tezos collection hub?");
  });

  it("creates a dynamic, escaped News sitemap that contains only recently published articles", () => {
    const output = renderNewsSitemapXml({
      baseUrl: "https://xtz.news",
      now: new Date("2026-09-14T12:00:00.000Z"),
      articles: [
        { slug: "hek-tezos-foundation-digital-art-partnership-2026", title: "HEK & Tezos < Digital Art", publishedAt: new Date("2026-09-14T10:00:00.000Z") },
        { slug: "archive-story", title: "Archive story", publishedAt: new Date("2026-09-11T10:00:00.000Z") },
      ],
    });

    expect(output).toContain('<news:name>XTZ.News</news:name>');
    expect(output).toContain('https://xtz.news/hek-tezos-foundation-digital-art-partnership-2026');
    expect(output).toContain('HEK &amp; Tezos &lt; Digital Art');
    expect(output).not.toContain('archive-story');
  });

  it("keeps a News sitemap parser-safe during an editorial gap", () => {
    const output = renderNewsSitemapXml({
      baseUrl: "https://xtz.news",
      now: new Date("2026-09-14T12:00:00.000Z"),
      articles: [
        { slug: "most-recent-story", title: "Most recent story", publishedAt: new Date("2026-09-10T10:00:00.000Z") },
      ],
    });

    expect(output).toContain("<url>");
    expect(output).toContain("https://xtz.news/most-recent-story");
    expect(output).toContain("<news:news>");
  });

  it("uses a valid canonical fallback when no dated articles are available", () => {
    const output = renderNewsSitemapXml({
      baseUrl: "https://xtz.news",
      articles: [],
    });

    expect(output).toContain("<url>");
    expect(output).toContain("<loc>https://xtz.news</loc>");
    expect(output).toContain("</urlset>");
  });

  it("renders translated article URLs in a distinct escaped sitemap", () => {
    const output = renderTranslationSitemapXml({
      baseUrl: "https://xtz.news",
      generatedAt: new Date("2026-09-15T12:00:00.000Z"),
      translations: [
        { locale: "fr", slug: "tezos-guide", translatedAt: new Date("2026-09-14T10:00:00.000Z") },
        { locale: "de", slug: "wallet & safety", translatedAt: null },
      ],
    });

    expect(output).toContain('https://xtz.news/fr/tezos-guide');
    expect(output).toContain('https://xtz.news/de/wallet &amp; safety');
    expect(output).toContain('<lastmod>2026-09-15</lastmod>');
    expect(output).not.toContain('<news:news>');
  });

  it("renders a named Person schema for editorial author pages and assigned article bylines", () => {
    const profileOutput = renderCrawlerHtml({ html, baseUrl: "https://xtz.news", pathname: "/authors/lee-evans" });
    const articleOutput = renderCrawlerHtml({
      html,
      baseUrl: "https://xtz.news",
      pathname: "/hek-tezos-foundation-digital-art-partnership-2026",
      article: {
        title: "HEK and Tezos Foundation partnership",
        slug: "hek-tezos-foundation-digital-art-partnership-2026",
        excerpt: "A source-led art partnership story.",
        seoTitle: null,
        seoDescription: null,
        featuredImageUrl: null,
        featuredImageAlt: null,
        publishedAt: new Date("2026-09-14T10:00:00.000Z"),
        updatedAt: new Date("2026-09-14T11:00:00.000Z"),
        authorSlug: "lee-evans",
      },
    });

    expect(getCrawlerStaticMeta("/authors/lee-evans").title).toBe("Lee Evans | XTZ.News");
    expect(CRAWLER_ROUTE_PREFIXES).toContain("authors");
    expect(SEO_STATIC_PAGES.map((page) => page.url)).toEqual(expect.arrayContaining(["/authors/lee-evans", "/authors/rossa-browne"]));
    expect(profileOutput).toContain('"@type":"Person"');
    expect(profileOutput).toContain('"name":"Lee Evans"');
    expect(articleOutput).toContain('"author":{"@type":"Person","name":"Lee Evans"');
  });
});
