# Post-Quantum Discovery Hub — Source Notes

**Purpose:** Support a reader-friendly Tezos-prefix glossary and post-quantum resource hub without implying that `tz5` is a generally available Mainnet wallet product.

| Term | Verified reader-facing framing | Source |
| --- | --- | --- |
| `tz1` | A Tezos user-account prefix using Ed25519. | [Octez accounts documentation](https://octez.tezos.com/docs/active/accounts.html) |
| `tz2` | A Tezos user-account prefix using Secp256k1. | [Octez accounts documentation](https://octez.tezos.com/docs/active/accounts.html) |
| `tz3` | A Tezos user-account prefix using P-256. | [Octez accounts documentation](https://octez.tezos.com/docs/active/accounts.html) |
| `tz4` | A Tezos user-account prefix using BLS12-381; its aggregatable-signature property supports specialised uses. | [Octez accounts documentation](https://octez.tezos.com/docs/active/accounts.html) |
| `tz5` | A Tezos user-account prefix using ML-DSA-44. The `tz5_account_enable` feature flag is disabled by default on Mainnet; enabled testing networks have additional limits. | [Octez accounts documentation](https://octez.tezos.com/docs/active/accounts.html) |
| `KT1` | A Tezos smart-contract / originated-account address prefix. | [Tezos account architecture](https://docs.tezos.com/architecture/accounts) |
| `sr1` | A Smart Rollup address prefix, rather than a user account that holds tez. | [Tezos account architecture](https://docs.tezos.com/architecture/accounts) |

The Tezos Spotlight post dated 2 September 2026 describes an upcoming fully post-quantum Tezos previewnet as internally tested and planned for public availability during September. It identifies the Ushuaia amendment as introducing testnet-only `tz5` support behind a feature flag. The hub must therefore present any testing guidance as **experimental** and direct readers to official announcements for activation details.

## Sources

1. [Octez & Protocol documentation — Accounts and addresses](https://octez.tezos.com/docs/active/accounts.html)
2. [Tezos Documentation — Accounts and addresses](https://docs.tezos.com/architecture/accounts)
3. [Tezos Spotlight — Why post-quantum, why now?](https://spotlight.tezos.com/why-post-quantum-why-now/)
