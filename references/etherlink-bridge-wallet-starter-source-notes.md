# Etherlink Bridge Explainer and Tezos Wallet Starter — Source Notes

**Research date:** 7 September 2026

## Etherlink bridge explainer

The explainer will use only the current official Etherlink bridge documentation. The official documentation calls a Tezos layer 1 to Etherlink EVM transfer a **deposit**, and an Etherlink EVM to Tezos layer 1 transfer a **withdrawal**. It states that deposits are available on Etherlink immediately; standard withdrawals are normally available on Tezos after 15 days, while the optional fast-withdrawal path can be available within approximately one minute for an added fee.[1]

The guide will not reproduce bridge contract addresses or tell readers which transfer to make. Its reader flow is: confirm the network and asset, use the official bridge, review timing before confirmation, and use the official bridge explorer to follow public bridge activity. It will describe standard withdrawal timing as an operational property of the Smart Rollup refutation period, not as a promise.[1]

## Tezos wallet starter hub

Official Tezos documentation defines a wallet as an application that maintains accounts and signs transactions on a user’s behalf, allowing dApp interaction without exposing a private key. It lists wallet examples across browser, mobile, desktop, identity-linked, and hardware form factors. The starter hub will not rank or endorse those wallets; it will direct users to the official wallet documentation to check current support.[2]

The official account documentation states that user accounts use `tz1`, `tz2`, `tz3`, or `tz4` prefixes, smart contracts use `KT1`, and Smart Rollups use `sr1`. The existing XTZ.News prefix glossary supplies explanatory context. The `tz5` guide will remain visibly separated as testnet-stage post-quantum research rather than a routine Mainnet onboarding step.[3]

## References

1. [Bridging XTZ between Tezos layer 1 and Etherlink EVM — Etherlink documentation](https://docs.etherlink.com/evm/bridging/bridging-tezos/)
2. [Installing and funding a wallet — Tezos documentation](https://docs.tezos.com/developing/wallet-setup)
3. [Accounts and addresses — Tezos documentation](https://docs.tezos.com/architecture/accounts)

