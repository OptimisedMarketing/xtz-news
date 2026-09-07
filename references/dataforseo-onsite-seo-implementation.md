# DataForSEO-Led On-Site SEO Implementation — September 2026

This record maps the measured keyword evidence to immediate XTZ.News improvements. It intentionally excludes unrelated generic-wallet, price-prediction, and EtherLink hardware queries that appeared in broad DataForSEO results.

| Opportunity | Evidence | On-site implementation |
| --- | --- | --- |
| Tezos wallet / address help | `tezos wallet` showed 457 US and 157 UK clickstream searches in the bounded seed set; the live SERP favoured established wallet brands and educational answer content. | The existing `/tools/wallet` page now links descriptively to the prefix glossary, the testnet-stage tz5 guide, and the Tezos Explorer. |
| Tezos staking | The seed had 152 US clickstream searches and informational intent. | `/staking` now connects to reward history, the Wallet Inspector, and the address-prefix glossary without presenting a personal staking recommendation. |
| Tezos price | `tezos price` showed 864 US and 78 UK clickstream searches, with a high-difficulty commercial SERP. | `/prices` now makes its non-advisory context explicit and links readers to staking, explorer, and wallet tools rather than duplicate price content. |
| Tezos explorer / TzKT-adjacent intent | XTZ.News’s `/explorer` was the sole returned measured top-20 organic result, ranking 16th for `tzkt`. | `/explorer` now provides direct paths to the Wallet Inspector, prefix glossary, and staking calculator, clarifying the page’s address and on-chain data purpose. |
| Post-quantum / tz5 depth | No qualifying volume was returned in the bounded seed data. | Existing `/post-quantum`, `/guides/tz5-wallet`, and `/glossary/tezos-prefixes` are retained as source-grounded resource routes—not misrepresented as high-volume keyword targets. |

## Crawler-visible improvements

The crawler-facing server layer now supplies unique title, description, canonical, Open Graph, Twitter, and same-origin relayed image metadata for each priority evergreen route. Published articles now receive `NewsArticle` and `BreadcrumbList` JSON-LD, accurate publication/modified times, and `hreflang` alternatives only for published translations. The dynamic sitemap now explicitly includes the post-quantum hub, tz5 guide, and Tezos-prefix glossary.

Local crawler checks using a Googlebot user agent confirmed that the post-quantum article emits its canonical URL, `/media/` featured image URL, `NewsArticle` JSON-LD, English and x-default alternates, and article published time. The sitemap confirmed the three new evergreen resource routes.

A final Googlebot-user-agent check confirmed unique title, meta-description, and canonical output for all seven priority routes: `/tools/wallet`, `/staking`, `/prices`, `/explorer`, `/post-quantum`, `/guides/tz5-wallet`, and `/glossary/tezos-prefixes`.

## Validation

Desktop and 390px mobile captures confirmed all four selected entry pages render the new learning-path panels without clipping or overlap. The full project test suite completed **92 tests across 39 files**, including crawler-metadata and resource-link regression coverage. TypeScript compilation passed.

## Measurement hand-off

Use Google Search Console after publishing to monitor impressions, clicks, average position, and indexed URLs for the priority routes. Re-run the same bounded DataForSEO keyword overview and rank-tracking queries after 8–12 weeks; retain only high-relevance Tezos terms, and compare URL-level changes rather than making traffic guarantees.

## References

1. [DataForSEO Labs — Keyword Overview, Suggestions, Ideas, and Ranked Keywords](https://dataforseo.com/help-center/dataforseo-labs-api)
2. [Google Search Central — Links crawlability guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
3. [Google Search Central — Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
4. [Google Search Central — Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
