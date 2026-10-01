# Official Recap Cover and Credit Validation

**Updated and validated:** 1 October 2026

The cover for **Tezos Art Recap: Museum Signals, Vienna Screens and New Digital Works** now uses the official **Responsive Signals** event poster. The page presents a visible credit immediately beneath the featured image: **Art on Tezos / Museum of the Moving Image**. The credit opens the Museum of the Moving Image’s official Responsive Signals listing in a new tab with safe external-link attributes.

The article stores the source image, alternative text, credit, and source URL as first-class featured-image metadata. This lets the same attribution pattern be used for other editorial covers without hard-coding article-specific copy into the page template.

Validation completed:

- Official cover returns HTTP 200 through the same-origin `/media/*` relay.
- Googlebot receives the revised cover URL and descriptive image metadata in `NewsArticle` structured data.
- Desktop and 390px mobile previews show the official poster, readable linked credit, and clean responsive layout.
- TypeScript passes; the full suite passes: **201 tests across 69 files**.
