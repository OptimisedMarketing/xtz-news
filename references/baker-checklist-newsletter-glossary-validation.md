# Baker Checklist and Newsletter Glossary Coverage — Validation

**Validated:** 7 September 2026

| Area | Result |
| --- | --- |
| Interactive baker checklist | Passed. `/staking/start` now includes six private on-page review criteria: delegation availability, external staking availability, capacity, current terms, public activity context, and official communication. It records only the reader’s own completed checks. |
| Non-ranking safeguard | Passed. The module explicitly states that it does not score, rank, recommend, or validate bakers. It uses no baker data, no reward projections, and no provider comparison. The reset control remains disabled until a reader marks at least one item. |
| Glossary coverage around newsletters | Passed. The shared rich-article renderer applies contextual definitions before safely separating newsletter placeholders. A focused regression test confirms newsletter placeholder rendering remains intact while surrounding `tez`, delegation/baker, and Etherlink content keeps its glossary links. |
| Newsletter-archive scope | Documented. The current project has no standalone newsletter-archive route or separate newsletter-body renderer. The shared `ArticleContent` path now provides the requested consistent glossary treatment wherever newsletter placeholders appear within archived article content, and establishes the behaviour for future archive bodies using this renderer. |
| Desktop/mobile validation | Passed. Full-page 1280px and 390px captures show the six-item checklist, counter, reset control, official-information link, page header, and footer without clipping or overlap. The mobile article remains readable with glossary-enabled rich content. |
| Automated checks | Passed. `pnpm test` completed **103 tests across 42 files** and `pnpm check` completed without TypeScript errors. |

## References

1. [Stake your tez — Tezos](https://tezos.com/stake-tez)
2. [Bakers — Tezos documentation](https://docs.tezos.com/architecture/bakers)

