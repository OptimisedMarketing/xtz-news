# Quantumnet Article Glossary Links Validation

**Validated:** 25 September 2026

## Reader experience

The Quantumnet article now automatically links its first contextual mention of four specialist terms: **ML-DSA-44**, **XMSS**, **STARK aggregation**, and **ZODA**. Each term uses the existing keyboard-focusable `article-glossary-term` pattern: hovering or focusing a link reveals a compact plain-English definition, while activating it takes the reader to the matching anchored card in the Post-quantum hub’s visual glossary.

The links intentionally skip headings, code, existing links, quotations and technical widgets. Each term is linked only once per article so the prose remains readable. The same automatic treatment will also apply to a future article that uses one of these exact terms.

## Anchor destinations

| Term | Visual glossary destination |
| --- | --- |
| ML-DSA-44 | `/post-quantum#pq-glossary-ml-dsa-44` |
| XMSS | `/post-quantum#pq-glossary-xmss` |
| STARK aggregation | `/post-quantum#pq-glossary-stark-aggregation` |
| ZODA | `/post-quantum#pq-glossary-zoda` |

## Validation

A rendered-DOM check of the live Quantumnet article confirmed exactly one anchor for each of the four destinations and confirmed the matching tooltip definition metadata. The full desktop and 390 px mobile article layouts retain the shared header, reading controls, article content, footer and global scroll-to-top control.

TypeScript passes and the complete regression suite passes: **181 tests across 62 files**. Focused glossary tests confirm the four destinations, one-link-per-term handling and ML-DSA-44 tooltip definition.
