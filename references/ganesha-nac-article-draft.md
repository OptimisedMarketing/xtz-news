# Etherlink’s Ganesha Gateway Is on Chain: Why Native Atomic Composability Matters

**Slug:** `etherlink-ganesha-native-atomic-composability-gateway-on-chain`  
**Published:** 22 August 2026  
**Categories:** Etherlink, Tezos, Latest News  
**Tags:** Etherlink, Ganesha, Native Atomic Composability, NAC, Tezos X, Michelson, EVM, Smart Contracts  
**SEO title:** Etherlink Ganesha Gateway Is on Chain: Native Atomic Composability Explained  
**SEO description:** A successful Etherlink transaction reached Ganesha’s documented NAC gateway. Here is what Etherlink 7.0 means for Michelson, EVM and Tezos X.  
**Featured-image alt:** Etherlink logo connected by a luminous green atomic gateway between Michelson and EVM pathways.

## Key Takeaways

- A successful 0.01 XTZ transaction on 21 August reached the Etherlink EVM precompile documented as Ganesha’s gateway to the Michelson interface.[^explorer]
- Ganesha, also called Etherlink 7.0, introduces a Michelson interface alongside Etherlink’s EVM interface, with both sharing one ledger.[^medium]
- Native Atomic Composability (NAC) is designed so a cross-interface action succeeds or fails as one operation, rather than relying on a bridge to reconcile state.[^medium]

## Article

A small transaction has given the Etherlink community a useful, concrete look at one of Ganesha’s most important building blocks. On 21 August, a successful transaction sent **0.01 XTZ** to `0xfF00000000000000000000000000000000000007` on Etherlink. The explorer records the destination as the new precompile described in the Ganesha announcement: the EVM-side gateway to Etherlink’s Michelson interface.[^explorer] [^medium]

The transfer alone does not reveal the sender’s purpose, nor does it prove every application path is ready for production use. It does, however, place a documented piece of Etherlink 7.0’s cross-interface design directly on chain. That makes it a useful moment to revisit what **Native Atomic Composability**, or **NAC**, is intended to change.

## Two interfaces, one ledger

Etherlink began as Tezos’ EVM-compatible execution layer. The Ganesha proposal, formally Etherlink 7.0, adds a Michelson interface so Tezos accounts and Michelson contracts can operate natively on Etherlink rather than through a conventional bridge. The proposal describes both the EVM and Michelson interfaces as operating over the same ledger.[^medium]

For builders, that means the familiar tools of the Tezos stack and the EVM stack are intended to sit closer together. Ganesha’s Michelson interface supports `tz1`, `tz2`, and `tz3` accounts, Michelson contracts, Ligo and SmartPy. Etherlink nodes also expose a subset of `octez-node` RPCs, helping existing Tezos wallets, indexers and dApps interact with Etherlink’s Michelson interface using patterns they already understand.[^medium]

The first release remains deliberately scoped. The announcement lists several exclusions, including `tz4` implicit accounts, BLS, Tickets, Sapling, Timelock and certain paid-storage operations. It also keeps Tezos consensus, delegation, staking, governance and DAL operations outside Etherlink’s scope.[^medium]

## What NAC changes

NAC is Etherlink’s name for allowing an account from either supported interface to interact with an Etherlink dApp without breaking the established rules of either interface. In practical terms, the proposal says a Tezos account can own and use native assets hosted in the EVM interface, while EVM accounts can reach Michelson contracts — and the action is atomic in both directions.[^medium]

The design uses a gateway on each side. On the EVM side, calls to the precompile at `0xfF00000000000000000000000000000000000007` are assigned a KT1 address on the Michelson runtime. On the Michelson side, calls to the L2-native contract `KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw` are assigned an Ethereum address associated with an account implementing EIP-1271. Tez sent to an address assigned behind the other interface is automatically forwarded through the relevant gateway.[^medium]

The key word is **atomic**. Etherlink’s published cross-interface counter example keeps state in a Michelson contract while a Solidity contract forwards `increment()` and `decrement()` calls through the gateway. If the Michelson call fails, the full EVM transaction reverts: no partial state is committed and no event is emitted. The proposal says this removes the need to depend on bridge trust or complex state reconciliation for that interaction.[^medium]

## A foundation for Tezos X

Ganesha is positioned as infrastructure for Tezos X: a unified execution environment secured by Tezos Layer 1 and accessible through both interfaces. Tezos Spotlight describes the proposal as preparation for the broader Tezos X rollout, while Etherlink’s announcement says the Michelson interface and NAC infrastructure had already been available for developer experimentation on Tezos X Previewnet since May.[^spotlight] [^medium]

The practical opportunity is broader composability. A Michelson-native application could reach liquidity already present in Etherlink’s EVM ecosystem. Equally, an EVM application could move particularly sensitive components into Michelson, where formal-verification workflows are more familiar to Tezos developers. The successful transaction now visible at the documented EVM gateway is a small on-chain marker of that larger architectural direction.[^explorer]

As ever with a major kernel proposal, teams should consult the current governance status and the relevant technical documentation before depending on a feature in production. But the direction is clear: Etherlink is working toward a chain where Michelson and EVM applications can cooperate without being separated by a conventional bridge.

## Sources

[^explorer]: [Etherlink Explorer — transaction `0xf4f48…76492c`](https://explorer.etherlink.com/tx/0xf4f48ca755363f51db8a835849aaa05bb1fc912d845dd940971748c45176492c?tab=index)
[^medium]: [Etherlink — “Announcing Ganesha: A 7th Upgrade Proposal for Etherlink Mainnet”](https://medium.com/@etherlink/announcing-ganesha-a-7th-upgrade-proposal-for-etherlink-mainnet-ae0a3af93aba)
[^spotlight]: [Tezos Spotlight — “Announcing Ganesha: A 7th Upgrade Proposal for Etherlink Mainnet”](https://spotlight.tezos.com/announcing-ganesha-etherlink-7th-upgrade-proposal/)
