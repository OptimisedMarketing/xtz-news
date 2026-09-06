# tz5 Guide Editorial Redesign — Validation Record

**Validated:** 6 September 2026

The guide was rebuilt from a dense prose-and-sidebar layout into a guided editorial learning journey. It retains the prior testnet-stage safety message while making the core information easier to scan.

| Improvement | Result |
| --- | --- |
| Information hierarchy | Passed. The guide now opens with a concise title, status signal, warning, and three-card explanation before the detailed material. |
| Readability | Passed. Long paragraphs were reduced to short explanatory sections, an address-prefix comparison, paired Do/Do not cards, a numbered future-testing checklist, and disclosure-based common questions. |
| Navigation | Passed. A compact in-page guide navigation and official-reading panel replace the previous visually heavy static sidebar. |
| Accessibility | Passed. Semantic sections, labelled navigation, descriptive link text, native keyboard-accessible disclosure controls, visible focus styling, and colour-independent Do/Do not labels are retained. |
| Desktop validation | Passed. The 1280px full-page view shows the intended editorial hierarchy without the former oversized body-text block. |
| Mobile validation | Passed. The 390px full-page view stacks the cards, address comparison, checklist, answers, navigation, and source links without clipping or overlap. |
| Automated checks | Passed. `pnpm test` completed 80 tests across 34 files and `pnpm check` completed without TypeScript errors. |

