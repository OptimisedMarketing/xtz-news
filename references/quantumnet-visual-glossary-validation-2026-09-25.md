# Quantumnet Visual Glossary Validation

**Validated:** 25 September 2026

## Scope and content

The Post-quantum hub now contains a dedicated **Visual glossary** section titled **“Four terms behind Quantumnet.”** It gives four source-linked cards for **ML-DSA-44**, **XMSS**, **STARK aggregation**, and **ZODA**.

Every card uses the same reader-first sequence:

1. a distinct icon, sequence marker and Quantumnet protocol area;
2. a short Plain English definition;
3. a highlighted **In Quantumnet** explanation of the component’s confirmed experimental role; and
4. a restrained reader note explaining why it is not an instruction to move funds, replace a wallet or acquire an asset.

ML-DSA-44 links to NIST FIPS 204; XMSS links to RFC 8391; the STARK aggregation and ZODA cards link to the Tezos Spotlight Quantumnet announcement. The wording matches the official announcement’s current scope: ML-DSA-44 for tz5 accounts, XMSS plus post-quantum STARK aggregation for consensus attestations, and ZODA evaluation for the Data Availability Layer.

## Screenshot request interpretation

The supplied screenshot has a 5.67:1 aspect ratio, which is an unusual-dimension screening signal. Its requested text was inspected in three ordered, overlapping left-to-right crops. The merged instruction was clear: add a visual glossary for ML-DSA-44, XMSS, STARK aggregation and ZODA.

## Visual, responsive and technical checks

At 1280 px, the glossary forms a clear two-by-two visual grid between Featured resources and Post-quantum reporting. Each card maintains a visually distinct header, scannable term, highlighted Quantumnet role and source link. At 390 px, the cards collapse to one column with readable line lengths, visible focusable source links and no horizontal overflow.

The existing post-quantum hub keeps its crawler title and canonical URL. TypeScript passes and the full regression suite passes: **180 tests across 62 files**. Focused test coverage locks the four required terms and source destinations.
