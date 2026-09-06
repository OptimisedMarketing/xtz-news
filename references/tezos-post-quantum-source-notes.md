# Tezos Post-Quantum Story — Source Notes

**Research date:** 6 September 2026  
**Primary sources:** Arthur Breitman’s [2 September 2026 post on X](https://x.com/ArthurB/status/2095157897772638528) and his [technical explainer](https://ex.rs/why-post-quantum-why-now/).

## News peg

Arthur Breitman wrote that Tezos will lead in the transition to post-quantum cryptography, linking to his explainer. The explainer says contributors including Nomadic Labs and Trilitech are unveiling an **upcoming post-quantum Tezos previewnet**. It says this network was being tested internally and was expected to become publicly available during September 2026.

## Claims suitable for the article

| Subject | Source-grounded statement | Necessary framing |
| --- | --- | --- |
| Immediate purpose | Existing elliptic-curve cryptography is expected to become vulnerable once sufficiently capable quantum computers exist; post-quantum techniques aim to retain security against that class of attack. | This is a preparation programme, not evidence of a current break of Tezos cryptography. |
| Initial Tezos measure | The Ushuaia amendment, activated 30 June 2026, introduced feature-flagged, testnet-only `tz5` account support using ML-DSA-44. | Testnet-only; not a statement that all accounts are already post-quantum. |
| Previewnet scope | The previewnet is described as experimental work covering user keys and other protocol functions, including consensus aggregation and the Data Availability Layer (DAL). | The author warns that previewnet software is experimental and may break. |
| Proposed technical directions | The article describes a STARK-based approach for aggregating hash-based signatures and ZODA for a post-quantum-oriented DAL design. | Present as the stated development approach, not an activated mainnet feature. |
| Reader relevance | The author emphasises early user migration because moving cryptographic keys and recovering inactive holders can take time. | Avoid suggesting users take immediate action unless official Tezos migration instructions are available. |

## Publication constraints

- Do not claim that Tezos mainnet is fully post-quantum today.
- Do not claim that the public previewnet is already live; the source says it was planned for September 2026.
- Attribute detailed design statements to Breitman’s explainer and link directly to both primary sources.
- Use **Post-Quantum Cryptography**, **Tezos**, **Ushuaia**, **tz5**, **ML-DSA-44**, **Data Availability Layer**, and **Previewnet** as likely search tags where they match existing taxonomy.

## Official corroboration

| Fact | Corroborating source |
| --- | --- |
| Ushuaia activated on Tezos Mainnet on 30 June 2026, while quantum-resistant `tz5` accounts were retained for testnet evaluation. | [Tezos Spotlight: Ushuaia is Live](https://spotlight.tezos.com/ushuaia-is-live/) |
| The `tz5` prefix corresponds to ML-DSA-44 keys, and its account feature flag is disabled by default on Mainnet. | [Octez documentation: Accounts and addresses](https://octez.tezos.com/docs/active/accounts.html) |
| The Tezos media release calls Ushuaia an early step towards post-quantum readiness and identifies the user-key feature as testnet-only. | [Tezos Media Center: Ushuaia is Live](https://tezos.com/media-center/2026/ushuaia-is-live/) |

These sources support a precise distinction between the activated Ushuaia base and the later experimental post-quantum previewnet described in the news peg.
