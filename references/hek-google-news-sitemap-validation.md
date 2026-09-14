# HEK Partnership Google News Metadata and Sitemap Validation

The HEK × Tezos Foundation article now emits a Google News-compatible `NewsArticle` JSON-LD object for crawler requests. The metadata includes canonical identity, headline, description, same-origin featured image, publication and modification dates, English language, the `Tezos News` article section, free-access declaration, organisation author, and XTZ.News publisher information.

The dynamic `/news-sitemap.xml` feed reads the published article list at request time and limits `news:news` entries to the most recent 48 hours. Its entries include the XTZ.News publication name, English publication language, ISO publication date, escaped title, and canonical article URL. The feed remains listed in `/robots.txt`, while `/sitemap.xml` continues to retain the full canonical archive.

Local Googlebot-style verification confirmed that the HEK article emits `NewsArticle`, `articleSection: Tezos News`, `isAccessibleForFree: true`, and its actual publication time. The dynamic News sitemap contained the HEK canonical URL with a matching publication date and title, and robots discovery referenced the News sitemap. The full suite passed with **139 tests across 54 files**, and TypeScript validation passed.
