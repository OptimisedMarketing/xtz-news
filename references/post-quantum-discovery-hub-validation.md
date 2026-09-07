# Post-Quantum Discovery Hub — Validation

**Validated:** 7 September 2026

| Surface | Validation result |
| --- | --- |
| Homepage feature | Passed. A prominent post-quantum feature appears beneath reader filters and above network context, with direct links to the `tz5` guide and the new hub. It explicitly describes the work as testnet-stage research. |
| Post-quantum hub | Passed. `/post-quantum` displays the two currently published articles tagged `post-quantum`, alongside the `tz5` guide, glossary, and official Tezos Spotlight explainer. The article list is tag-driven, so future tagged coverage appears automatically. |
| Prefix glossary | Passed. `/glossary/tezos-prefixes` supports real-time search across `tz1`–`tz5`, `KT1`, and `sr1`; it distinguishes `tz5` as testnet-stage while explaining established account, contract, and rollup prefixes. |
| Cross-navigation | Passed. The Explore menu links to the resource hub; the Tools hub links to the hub alongside the featured `tz5` guide; guides and hub pages interlink. |
| Responsive behaviour | Passed. Desktop and 390px mobile captures showed readable hierarchy, single-column cards on mobile, visible focusable links, and no clipped controls. |
| Automated checks | Passed. `pnpm test` completed with **87 tests across 37 files**. `pnpm check` completed successfully. |

## Source framing

The glossary and hub are grounded in the [Octez accounts documentation](https://octez.tezos.com/docs/active/accounts.html), [Tezos account architecture documentation](https://docs.tezos.com/architecture/accounts), and [Tezos Spotlight post-quantum explainer](https://spotlight.tezos.com/why-post-quantum-why-now/). The reader experience does not present `tz5` as a standard Mainnet wallet feature.

