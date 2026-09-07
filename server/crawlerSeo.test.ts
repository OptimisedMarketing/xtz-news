import { describe, expect, it } from "vitest";
import { CRAWLER_ROUTE_PREFIXES, SEO_STATIC_PAGES, renderCrawlerHtml, toRelayedMediaUrl } from "./crawlerSeo";

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
    expect(output).toContain('hreflang="fr" href="https://xtz.news/fr/tezos-wallet-guide"');
    expect(output).toContain('hreflang="x-default"');
  });

  it("keeps priority evergreen routes crawlable and protected from article-slug handling", () => {
    expect(SEO_STATIC_PAGES.map(page => page.url)).toEqual(expect.arrayContaining([
      "/post-quantum", "/guides/tz5-wallet", "/glossary/tezos-prefixes",
    ]));
    expect(CRAWLER_ROUTE_PREFIXES).toEqual(expect.arrayContaining(["guides", "glossary", "post-quantum"]));
  });
});
