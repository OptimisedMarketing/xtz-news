# Kento Directory and Related Reading — Validation

**Validated:** 8 September 2026

| Surface | Validation result |
| --- | --- |
| Public directory profile | Passed. Kento is published under the `NFTs` project category at `/projects/kento`, with the supplied milestone visual delivered through the same-origin media path and an official `https://kento.art/` destination. |
| Article discovery | Passed. The Kento profile’s About section includes a direct internal link to `/kento-objkt-physical-digital-art-cards-kickstarter`; its Related News panel also returns that published story. |
| Campaign framing | Passed. The profile identifies Kento as an active crowdfunding campaign and directs readers to official campaign terms and updates instead of presenting a milestone image as live data. |
| Related Articles | Passed. The Kento article’s full-width bottom section is labelled **“More Tezos Art & Collecting”** and ranks candidate Art/NFT/Exhibition coverage by creator and collecting relevance before recency. |
| Desktop and mobile | Passed. Desktop and 390px mobile captures showed a readable Kento profile, a working internal article link, and a responsive article related-reading grid. |
| Automated checks | Passed. `pnpm test` completed **111 tests across 45 files**, including the Kento relevance helper, and `pnpm check` completed successfully. |

## Deferred scope

The requested daily Kickstarter campaign tracker and homepage campaign metrics remain **deferred at the user’s direction**. The public Kickstarter campaign page returned HTTP 403 to ordinary cloud requests; no attempt was made to bypass those controls or fabricate live totals.

