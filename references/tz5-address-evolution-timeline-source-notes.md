# tz1–tz5 Address Evolution Timeline — Source Notes

**Purpose:** Keep the reader-facing address comparison accurate and avoid implying that the five prefixes are a sequence of wallet upgrades.

| Prefix | Cryptographic signing scheme | Reader-facing framing |
| --- | --- | --- |
| `tz1` | Ed25519 / EdDSA | The familiar default user-account prefix in Tezos tooling. |
| `tz2` | Secp256k1 / ECDSA | An alternative user-account key family. |
| `tz3` | P-256 / ECDSA | An alternative user-account key family, commonly relevant to hardware security modules. |
| `tz4` | BLS / BLS12-381 | An alternative user-account key family with aggregatable signatures, including consensus use. |
| `tz5` | ML-DSA-44 | A post-quantum user-account key family, feature-flagged and disabled by default on Tezos Mainnet. |

The page must call this an **address-family map**, not a chronological upgrade path. The visual order provides a simple comparison, while `tz5` is separately labelled as **testnet-stage research**.

## Official sources

1. [Octez documentation — Accounts and addresses](https://octez.tezos.com/docs/active/accounts.html)
2. [Tezos Spotlight — Why post-quantum, why now?](https://spotlight.tezos.com/why-post-quantum-why-now/)
3. [Tezos Docs — Accounts](https://docs.tezos.com/using/user-accounts)

