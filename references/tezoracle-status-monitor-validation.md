# TezOracle Official Status Monitor — Validation Record

**Implementation date:** 31 August 2026  
**Official monitored source:** [tezoracle.com](https://tezoracle.com/)

The monitor uses a dedicated Ed25519 signing identity held only on the attached cloud computer. Its public verification key is bundled into the XTZ.News server. The server accepts only fresh signed payloads that name the exact official TezOracle source, enforces replay protection through delivery identifiers, and records the source-derived payload hash.

| Validation | Result |
| --- | --- |
| Cloud source-parser dry run | Passed. It derived **Architecture: Defined**, **Implementation: Next**, **Testnet: Planned**, and **Production: Gated** from the official status markup. |
| Address safety | Passed. The official source presently exposes no official testnet or production contract address; the monitor imported an empty list and the profile states this explicitly. |
| Signed development import | Passed. The first signed source-derived update was accepted by the development endpoint at 21:27 UTC, with `changed: true`. |
| Profile experience | Passed in production. `https://xtz.news/projects/tezoracle` displays official-source milestones, an explicit no-address state, last-verified time, profile sharing actions, and the corrected **In development** label. |
| Article discovery | Passed in production. The TezOracle story links directly to `/projects/tezoracle`, provides its own labelled X and LinkedIn sharing actions, and retains the tailored related-reading section. |
| Daily scheduler | Passed. The root-owned `xtz-tezoracle-status.timer` is enabled and active for 03:15 UTC daily with a bounded 20-minute random delay. Its first hardened service-unit run exited successfully, produced the same source-derived statuses, and opened no listener. |
| Mobile presentation | Passed. Full-page 390px captures show the project monitor, status grid, no-address state, sharing controls, and article cross-link without clipping or overlap. |
| Final automated checks | Passed. `pnpm test` completed 75 tests across 32 files, and `pnpm check` completed with no TypeScript errors. |

The scheduler targets the published stable custom domain and refreshes source freshness even when the official milestones remain unchanged. It does not use AI credits or infer unpublished contract data.

## Source

1. [TezOracle — official project status](https://tezoracle.com/)
