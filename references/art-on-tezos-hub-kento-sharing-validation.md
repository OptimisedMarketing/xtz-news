# Art on Tezos Hub and Kento Sharing Validation

## Scope

This record covers the dedicated `/art-on-tezos` collection route, homepage and navigation discovery, Kento article and project sharing controls, crawler treatment, and the previously corrected Kento campaign-image attribution.

## Reader-facing checks

| Route or surface | Desktop and mobile result |
| --- | --- |
| `/art-on-tezos` | The collection hub loaded with published project cards and grouped Art/NFT editorial cards. Its project, coverage, archive, directory, and official objkt paths were visible and readable. |
| `/projects/kento` | The Kento profile showed labelled X and LinkedIn sharing links, the direct story path, the active-campaign context, and the Art on Tezos collection link. |
| `/kento-objkt-physical-digital-art-cards-kickstarter` | The Kento story rendered with its reader controls, Art on Tezos discovery link, Kento X/LinkedIn sharing panel, early-milestone framing, and existing related-reading section. |
| Homepage | The “Art on Tezos, in one place.” feature appeared in the homepage editorial flow and linked to the new hub. |
| Shared header | The responsive header continued to provide the existing Explore navigation structure; regression coverage preserves the Art on Tezos hub entry for desktop and mobile menus. |

Screenshots were captured at 1280px and 390px widths. The mobile hub became a single-column reading flow, and the Kento share actions wrapped into tappable controls without clipped text.

## Sharing and crawler checks

| Check | Result |
| --- | --- |
| Kento X share target | `https://twitter.com/intent/tweet` with encoded title and XTZ.News URL. |
| Kento LinkedIn share target | `https://www.linkedin.com/sharing/share-offsite/` with encoded XTZ.News URL. |
| Outbound-link safeguards | Both links open in a separate tab and use `rel="noopener noreferrer"`; no publishing action is performed by XTZ.News. |
| Bot-facing title and canonical | A Googlebot-style local request returned the Art on Tezos title and `https://xtz.news/art-on-tezos` canonical. |
| Structured data | The same crawler response included `FAQPage` JSON-LD with all three hub FAQs, including the explicit non-endorsement statement. |
| Sitemap | The exact serialized `<loc>https://xtz.news/art-on-tezos</loc>` entry appeared once. Similar article slugs were excluded from this exact-entry check. |

## Automated checks

`pnpm test` passed with **115 tests across 46 files**. `pnpm check` passed with TypeScript reporting no errors. Focused regression coverage also verifies the two Kento sharing destinations, reader-safe FAQ content, responsive Explore-menu discovery, sitemap registration, and crawler FAQ output.

## Attribution note

The Kento campaign image wording was previously confirmed in the persisted article content as “The featured image records a campaign milestone of more than $100,000 raised in 24 hours.” The prior “supplied to XTZ.News” wording was absent. The sentence retains the dated early-milestone snapshot and the distinction from a current Kickstarter total. The database confirmation remains the definitive validation for that stored editorial correction.
