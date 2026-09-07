# Wallet Options, Staking Starter, and Article Glossary — Source Notes

**Research date:** 7 September 2026

## Wallet options

The official Tezos wallet-setup documentation lists **Temple** as a mobile application and browser extension; **Umami** as a standalone application for Windows, macOS, and Linux; **Kukai** as an identity-linked application; **Trust** as a mobile application and browser extension; **AirGap** as standalone and mobile applications; and **Ledger** as a hardware-wallet option.[1]

It also says MetaMask supports Tezos through its browser extension on Mainnet, using the Tezos Snap flow. The wallet starter must present this as an official-documentation-listed option, not a recommendation or an assurance of every wallet feature.[1]

## Staking starter guidance

The official Tezos staking site distinguishes **delegation** from **staking**. Delegation keeps tez liquid; staking locks tez and creates slashing exposure. The official account/baker documentation explains that stakers receive protocol rewards directly and describes the comparison between the two routes. Readers should use the current official staking interface for actual available baker capacity, fees, and action steps.[2] [3]

The official staking site states that people who self-custody tez can use the current staking application after connecting a supported wallet. The user flow is: connect a wallet, delegate to a baker if needed, then stake with that baker. The Tezos documentation cautions that delegation rewards are provided by bakers and are not a protocol guarantee.[2] [3]

## Automatic glossary-linking rules

Automatic in-article definitions should be limited to neutral, stable educational terms. Initial candidates are `tez`, `XTZ`, `tz1`–`tz5`, `KT1`, `sr1`, `baker`, `delegation`, `staking`, `Smart Rollup`, `EVM`, `Michelson`, `Etherlink`, `bridge`, `WXTZ`, `FA2`, and `NFT`. The renderer must avoid changing content inside HTML tags, links, headings, code, blockquotes, scripts, and already-linked terms. Each definition should expose an accessible hover/focus popover and a durable link to the relevant glossary or guide.

## References

1. [Installing and funding a wallet — Tezos documentation](https://docs.tezos.com/developing/wallet-setup)
2. [Stake your tez — Tezos](https://tezos.com/stake-tez)
3. [Bakers — Tezos documentation](https://docs.tezos.com/architecture/bakers)
4. [How to stake your tez — Tezos Spotlight](https://spotlight.tezos.com/how-to-stake/)

