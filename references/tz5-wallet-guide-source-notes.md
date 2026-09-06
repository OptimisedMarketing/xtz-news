# tz5 Wallet Guide — Source Notes

## Scope and reader-safety boundary

This guide is a plain-English orientation page, not a wallet setup instruction for production assets. It must state that `tz5` is a quantum-resistant account type intended for testing, and it must not claim that a named wallet currently creates, imports, or signs for `tz5` accounts unless that wallet publishes its own explicit support documentation.

| Verified point | Reader-facing interpretation | Source |
| --- | --- | --- |
| A `tz5` address is the hash of an ML-DSA-44 public key. | The different prefix tells tools which family of account and signature they are working with. | [Octez documentation — Accounts and addresses](https://octez.tezos.com/docs/active/accounts.html) |
| The `tz5` account feature is disabled by default on Mainnet. | Readers should not move real Mainnet assets in expectation of using `tz5` today. | [Octez documentation — Accounts and addresses](https://octez.tezos.com/docs/active/accounts.html) |
| Ushuaia added the account type behind a feature flag for testnet evaluation. | The current purpose is wallet, custodian, and infrastructure testing. | [Tezos Spotlight — Ushuaia is Live](https://spotlight.tezos.com/ushuaia-is-live/) |
| Wallet network switching is wallet-specific; testnets use valueless test tez, and a supported testnet can be added by RPC when needed. | Readers should only follow their wallet’s official instructions and use test funds for experimental networks. | [Tezos Docs — Installing and funding a wallet](https://docs.tezos.com/developing/wallet-setup) |

## Required wording

- Describe `tz5` as **testnet-stage** and **not a required action for ordinary Tezos holders**.
- Do not call it a new Mainnet wallet product or imply that a public previewnet is already available.
- Advise readers never to share a recovery phrase, private key, or signing material, and to use only test funds on testnets.

