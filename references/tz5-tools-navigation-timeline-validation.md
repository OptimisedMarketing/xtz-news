# tz5 Tools Navigation and Address-Family Timeline — Validation

**Validated:** 6 September 2026

| Area | Result |
| --- | --- |
| Main Tools hub | Passed. `/tools` now begins with a full-width **tz5 wallet guide** feature panel and a clear `Read guide` action linking to `/guides/tz5-wallet`. |
| Main navigation | Passed by source review. The desktop Explore menu and mobile Explore section both include a direct **tz5 Wallet Guide** entry. |
| Guide timeline | Passed. `/guides/tz5-wallet` displays a five-stage visual address-family map covering `tz1` (Ed25519), `tz2` (Secp256k1), `tz3` (P-256), `tz4` (BLS12-381), and `tz5` (ML-DSA-44). |
| Accuracy safeguard | Passed. The timeline explains that these are distinct account families, rather than a user-upgrade sequence, and marks `tz5` as testnet stage. |
| Responsive rendering | Passed. Full-page desktop and 390px mobile captures show the Tools feature and timeline without clipping, overlap, or loss of the testnet-stage qualification. |
| Automated validation | Passed. `pnpm test` completed 81 tests across 34 files and `pnpm check` completed without TypeScript errors. |

## Source

1. [Octez documentation — Accounts and addresses](https://octez.tezos.com/docs/active/accounts.html)
2. [Tezos Spotlight — Why post-quantum, why now?](https://spotlight.tezos.com/why-post-quantum-why-now/)

