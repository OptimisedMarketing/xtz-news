# Google News Sitemap and Optimised Marketing Profile Validation

**Validated:** 18 September 2026

## Root cause and repair

The Search Console report shows the Google News sitemap at a point when it contained an empty `<urlset>`. The pre-existing renderer correctly limited News entries to the 48-hour Google News window, but emitted no `<url>` element if that window contained no articles. Google Search Console requires at least one `<url>` child under `<urlset>` and reported the missing tag at line 3.

The renderer now keeps the 48-hour eligibility rule for normal Google News entries while preserving a parser-safe fallback. If no post is inside the window, it uses the most recently dated published article as a placeholder entry. If the site has no dated posts at all, it emits the canonical homepage as a standard sitemap URL. This prevents an empty `<urlset>` without fabricating recent publication timestamps or misrepresenting an archive article as new. The primary canonical sitemap remains the authoritative full-archive discovery feed.

Regression coverage now verifies the normal 48-hour filtering, a dated-article fallback during an editorial gap, and a canonical homepage fallback when there are no dated posts. TypeScript passes and the full suite passes with 176 tests across 62 files.

## Current sitemap state

The local current News sitemap is well-formed and contains two recent Google News entries, each with a `<url>`, `<loc>`, `news:news`, publication, language, publication date and title. The deployed production sitemap had the same non-empty structure during this validation. The cache has a 15-minute maximum age and resets on a server restart; the updated fallback will be deployed with the release checkpoint.

## Optimised Marketing directory profile

A clearly labelled first-party Optimised Marketing profile is published at `/projects/optimised-marketing`. It states that Optimised Marketing builds and supports XTZ.News, offers website development, web application and marketing services to the wider Tezos community, and makes the stated **25% off services** offer available with code **XTZ2026**. The profile directs readers to discuss scope, availability and terms with Optimised Marketing, and explicitly says that it is a first-party directory profile rather than independent editorial endorsement.

The profile uses the existing first-party Optimised Marketing × XTZ.News promotion artwork through the same-origin media relay and links to `https://optimised.marketing`. Desktop and 390 px mobile checks show the shared header, clear Community label, website action, first-party disclosure and profile copy without visible horizontal overflow.

## Sources

[1]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap "Google News sitemap documentation"
[2]: https://optimised.marketing "Optimised Marketing service overview"

A full-page mobile capture additionally confirmed that the offer is visible in the reader journey: it presents the exact `XTZ2026` code, the **25% off services** benefit, scoped-engagement caveat, first-party disclosure, category, status, external website, footer, and Back to Top control at 390 px width.
