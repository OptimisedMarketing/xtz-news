# Etherlink Hub and Tool FAQ Schema — Validation Record

**Validated:** 7 September 2026

| Area | Result |
| --- | --- |
| Search-intent selection | Passed. DataForSEO’s live US SERP for `etherlink tezos` was ecosystem-relevant: official Etherlink documentation and website, Tezos coverage, bridge documentation, and Etherlink network resources. Unrelated hardware and price-prediction content was excluded. |
| Etherlink hub | Passed. `/etherlink` provides source-led context, three official-resource cards, real dynamic XTZ.News posts tagged `etherlink`, careful bridge-timing guidance, an Etherlink archive path, and reader-safe expandable answers. |
| Internal discovery | Passed. The desktop and mobile Explore menus include **Etherlink Hub**, and the server’s route-prefix and static-sitemap lists include `/etherlink`. |
| Priority-tool FAQ schema | Implemented. Crawler-visible `FAQPage` JSON-LD is emitted for `/tools/wallet`, `/staking`, `/tools/rewards`, `/prices`, and `/explorer`, using informational and non-advisory answers. |
| Crawler validation | Passed. Googlebot-style requests returned one `FAQPage` schema for each priority route. The Etherlink hub returned its unique title, canonical `https://xtz.news/etherlink`, and one `FAQPage` schema. |
| Sitemap validation | Passed. The exact `<loc>https://xtz.news/etherlink</loc>` entry occurs once in the dynamic sitemap; the initial broad text count reflected non-location sitemap text rather than duplicate canonical entries. |
| Desktop presentation | Passed. The hub renders its hero, resource cards, current archive cards, FAQ section, safety note, header, and footer without overlap. |
| Mobile presentation | Passed. The 390px layout stacks the resource cards and real article cards cleanly, with readable actions and FAQ controls. |
| Automated checks | Passed. `pnpm test` completed 95 tests across 39 files and `pnpm check` completed without TypeScript errors. |

## Primary sources

1. [DataForSEO live SERP — `etherlink tezos`](file:///home/ubuntu/.mcp/tool-results/2026-09-07_12-23-39.673688060_dataforseo_serp_organic_live_advanced_4302684a.json)
2. [What is Etherlink? — Etherlink documentation](https://docs.etherlink.com/)
3. [Bridging XTZ between Tezos layer 1 and Etherlink EVM — Etherlink documentation](https://docs.etherlink.com/evm/bridging/bridging-tezos/)
