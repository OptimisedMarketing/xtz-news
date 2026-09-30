# Art on Tezos Discovery and Recap Visuals Validation

**Validated:** 30 September 2026  
**Scope:** Art hub discovery module, contributor cards, archive filters, source-attributed inline recap imagery, and media relay handling.

## Delivered reader experience

- **`/art-on-tezos`** now presents an **Art on Tezos this week** module that selects the newest published recap from the Art category. It does not add or restore a recurring background job.
- The module includes four source-linked contributor cards for **Jonas Lund**, **Yoshi Sodeoka**, **Kat Zhang**, and **Micol**, each with an internal XTZ.News search action to make further coverage discoverable.
- **`/art`** now combines published **Art** and **Exhibition** posts and provides shareable query-string filters:
  - `/art?type=recaps`
  - `/art?type=exhibitions`
  - `/art?type=releases`
- The former recap CTA now accurately states that new official recaps are added after editorial review. It no longer claims that a Friday automated generation task is active.

## Article visual gallery

The published September Art Recap now includes three contextual, source-linked visuals, each placed next to the relevant editorial section with a visible caption and source link:

| Item | Source page | Managed media path | Validation |
| --- | --- | --- | --- |
| Stories We Tell Online promotional artwork | [Art on Tezos official announcement](https://x.com/artontezos_/status/2102674387048800679) | `/manus-storage/stories-we-tell-online_7b675162.webp` | 200 `image/webp`, 440,980 bytes through `/media/` |
| Art Commission Tezos “Texture” open-call artwork | [Art on Tezos official announcement](https://x.com/artontezos_/status/2103152745805197585/photo/1) | `/manus-storage/art-commission-texture_13e8f835.jpg` | 200 `image/jpeg`, 1,644,719 bytes through `/media/` |
| Searching for Balance auction artwork | [ACCOMPART’S official auction note](https://accomparts.com/journal/accompartscomjournalsearching-for-balance-generative-art-auction) | `/manus-storage/searching-for-balance_840accc7.png` | 200 `image/png`, 523,852 bytes through `/media/` |

The captions identify each source and preserve a rights boundary. Two additional recap items were deliberately **not** illustrated: the verified MoMI representative image was protected by Cloudflare from server retrieval, while the objkt.one pieces were verified as video/directory media rather than reliably fetchable static images. No substitute or unverified image was used.

## Media and SEO validation

- The article-body renderer now rewrites first-party `/manus-storage/` image sources to the existing same-origin `/media/` relay before inserting stored HTML.
- All three new image URLs returned successful `GET` responses through the relay with their expected content types.
- Googlebot response for `/tezos-art-recap-responsive-signals-vienna-digital-works` contained `NewsArticle` structured data, `og:type=article`, a 2026-09-30 publication timestamp, indexable robots metadata, and a canonical first-party OG image.
- `/news-sitemap.xml` contains the published recap URL and its `news:publication_date`.
- Published category data returned 10 Art posts and 20 Exhibition posts; the combined archive presents 29 unique posts, classified as 8 recaps, 19 exhibitions, and 2 artist releases.

## Visual and automated checks

- Desktop and mobile full-page captures confirmed the new hub module, contributor cards, recaps filter, source gallery, captions, and responsive stacking.
- `pnpm check && pnpm test` passed: **63 test files / 187 tests**.
- `git diff --check` passed.
