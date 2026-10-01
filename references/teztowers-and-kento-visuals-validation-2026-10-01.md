# TezTowers Publication and Kento Thumbnail Validation

**Validated:** 1 October 2026

## Published TezTowers coverage

The article **“TezTowers Says 79 Main St Plots Sold on Day One of Its Tezos Virtual City”** is available at `/teztowers-main-street-virtual-real-estate-tezos`. It uses a credited official TezTowers cover, with a linked source beneath the hero image. The article attributes the 79-plot figure to TezTowers, distinguishes the project’s public proposition from independently verified facts, and makes clear that the free-advertising invitation is not a partnership or endorsement by the named organisations.

The publication has bullet Key Takeaways, the Lee Evans byline, Games / Adoption / Latest News categories, and Tezos / NFTs / Community / Adoption tags. Its body contains a compact, source-attributed three-visual gallery. Each card opens an accessible lightbox, has a direct primary-source link, and closes with Escape or the close control.

## Project profile

`/projects/teztowers` is published in the **Games** directory category. It has the official TezTowers city image, current-product and availability caveats, and a reciprocal link to the XTZ.News launch coverage. The article likewise links to the directory profile.

## Kento artwork thumbnails

All 40 Kento Season 01 creator cards now show a compact artwork thumbnail sourced from the creator’s public Kento profile. Assets were resized without cropping to at most 240 × 240 pixels, compressed as WebP, uploaded through project storage, and served via the same-origin `/media/*` relay. Existing search, **All artists**, **Verified Objkt**, and **Kento profile** filters remain intact.

## Technical checks

| Check | Result |
| --- | --- |
| TypeScript | Passed (`pnpm check`) |
| Regression suite | **217 tests across 75 files passed** |
| TezTowers article | HTTP 200; desktop and 390 px mobile visual checks completed |
| TezTowers directory profile | HTTP 200; desktop and 390 px mobile visual checks completed |
| Kento funded follow-up | HTTP 200; desktop and 390 px mobile visual checks completed |
| Article gallery interaction | Focused test covers opening the labelled lightbox and Escape dismissal |
| Kento thumbnails | Focused test confirms 40 thumbnails and relay-backed image paths |
| Google News | Googlebot HTML contains canonical URL, `NewsArticle` JSON-LD, image object, author `Person`, publication dates, and free-access signal |
| Sitemap discovery | Article URL present in `/sitemap.xml` and `/news-sitemap.xml` |
| Media delivery | The three TezTowers images and representative first/last Kento thumbnails returned HTTP 200 through `/media/*` |

## Primary sources

- [TezTowers public site](https://teztowers.com/)
- [TezTowers first-day update](https://x.com/TezTowers/status/2105488167042515017)
- [TezTowers Main St update](https://x.com/TezTowers/status/2105352862570365315)
- [TezTowers institutional / non-profit invitation](https://x.com/TezTowers/status/2105168454487785496)
- [Kento Season 01 artist directory](https://kento.art/artists/)
