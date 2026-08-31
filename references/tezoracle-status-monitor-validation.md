# TezOracle Official Status Monitor — Validation Record

**Implementation date:** 31 August 2026  
**Official monitored source:** [tezoracle.com](https://tezoracle.com/)

The monitor uses a dedicated Ed25519 signing identity held only on the attached cloud computer. Its public verification key is bundled into the XTZ.News server. The server accepts only fresh signed payloads that name the exact official TezOracle source, enforces replay protection through delivery identifiers, and records the source-derived payload hash.

| Validation | Result |
| --- | --- |
| Cloud source-parser dry run | Passed. It derived **Architecture: Defined**, **Implementation: Next**, **Testnet: Planned**, and **Production: Gated** from the official status markup. |
| Address safety | Passed. The official source presently exposes no official testnet or production contract address; the monitor imported an empty list and the profile states this explicitly. |
| Signed development import | Passed. The first signed source-derived update was accepted by the development endpoint at 21:27 UTC, with `changed: true`. |
| Profile experience | Passed. `/projects/tezoracle` displays official-source milestones, an explicit no-address state, last-verified time, profile sharing actions, and the corrected **In development** label. |
| Article discovery | Implemented. The TezOracle story links directly to `/projects/tezoracle` and provides its own X and LinkedIn sharing actions. |

The final production daily scheduler remains intentionally pending until the updated XTZ.News site is published, so the cloud monitor can target the stable custom domain rather than a development preview.

## Source

1. [TezOracle — official project status](https://tezoracle.com/)

