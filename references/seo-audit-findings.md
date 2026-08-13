# XTZ.News SEO Audit Findings — 13 August 2026

## Verified live foundations

- `robots.txt` allows public crawling, blocks administrative/API paths, and declares both the main and news sitemaps.
- The main sitemap returned `200` and contained 8,242 URLs at audit time. It included 6,396 translated URLs and 270 tag URLs.
- The Google News sitemap returned `200` and contained one currently eligible `news:news` entry, which is consistent with Google News’ short recency window for news sitemap entries.
- A representative English article and its Chinese alternate both render readable article content to a text extractor.

## Indexation and discovery observations

The 270-tag taxonomy is unusually shallow: 249 tags have one or zero posts, 260 have two or fewer posts, and only two have five or more posts. The main sitemap currently exposes all 270 tag URLs. This makes tag-archive indexation the leading crawl-budget and thin-archive review opportunity.

The main sitemap is within Google’s 50,000-URL technical limit, but the 6,396 translated URLs represent the vast majority of its 8,242 entries. Translation coverage is an opportunity only if the crawler-visible canonical and reciprocal hreflang clusters are fully correct; otherwise the translated URL volume can magnify duplicate-indexing risk.

## Critical live crawler inconsistency

Using a Googlebot user agent against the public custom domain, both the English Ganesha article and its Chinese alternate returned a canonical link to `https://xtz.news/`, no detected `hreflang` annotations, and no detected crawler-facing `NewsArticle` JSON-LD. The same article content is visible to normal browser readers.

This suggests that the public crawler path is not reliably receiving the intended article-level prerendered head markup. It is the highest-priority technical item to validate through Google Search Console URL Inspection and then repair at the public edge/origin path.

## Authoritative reference notes

- Google recommends Article/NewsArticle properties that apply to the page, crawlable representative images, author identity URLs, and validation with Rich Results Test plus URL Inspection.
- Google expects reciprocal hreflang annotations including self-references and recommends an `x-default` fallback for unmatched language selectors.
- Google treats redirects and self-referential canonicals as strong canonicalisation signals. For JavaScript-rendered sites, canonical signals should be clear in the HTML source.
- Core Web Vitals targets are LCP within 2.5 seconds, INP below 200ms, and CLS below 0.1.
