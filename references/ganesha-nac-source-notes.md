# Etherlink Ganesha / Native Atomic Composability — Source Notes

Research date: 22 August 2026.

| Source | Research status | Usable finding |
| --- | --- | --- |
| Arthur Breitman X post | Direct browser access attempted; blocked by X Cloudflare verification | Treated as a supplied contextual source only; no unverified wording will be quoted. |
| Tezos X post | Direct browser access attempted; blocked by X Cloudflare verification | Treated as a supplied contextual source only; no unverified wording will be quoted. |
| Etherlink explorer transaction | Direct browser review completed | A successful 0.01 XTZ transaction was sent on 21 August 2026 at 08:20:48 +01:00 UTC to `0xfF00000000000000000000000000000000000007`, the EVM gateway address identified in the supplied excerpt. This supports a narrowly framed on-chain demonstration, not a claim about the sender’s intent. |
| Etherlink X post | Direct browser access attempted; blocked by X Cloudflare verification | Treated as a supplied contextual source only; no unverified wording will be quoted. |
| Etherlink Medium announcement | Pending direct review | Primary technical source for Ganesha and Native Atomic Composability. |

## User-supplied technical excerpt

The supplied excerpt defines Native Atomic Composability (NAC) as the ability for an account in any Etherlink interface to interact with any Etherlink dApp without breaking either interface’s established invariants. It identifies an EVM-side precompile at `0xfF00000000000000000000000000000000000007` and a Michelson-side L2 native contract at `KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw` as gateways between the EVM and Michelson interfaces. It also states that cross-interface tez transfers are automatically forwarded through the appropriate gateway.

The article must attribute implementation details to the Etherlink announcement, distinguish an upgrade proposal from a completed activation unless independently confirmed, and avoid asserting a transaction’s purpose without explorer evidence.

## Confirmed announcement details

Etherlink’s Medium announcement calls Ganesha **Etherlink 7.0**, a major kernel-upgrade proposal. It presents a Michelson interface alongside the existing EVM interface, with both operating over the same ledger. The announcement says the new Michelson interface supports Tezos `tz1`, `tz2`, and `tz3` implicit accounts, Michelson smart contracts, Ligo, and SmartPy, while also listing notable first-release limitations including no `tz4` account support and no BLS, Tickets, Sapling, Timelock, Global Constant, or paid-storage increase support.

The announcement says the supporting infrastructure was live on Tezos X Previewnet since May 2026. It describes an atomic cross-interface counter demonstration where a failure on the Michelson side reverts the full EVM transaction, so no partial state is committed. It also says node operators require Octez EVM node version 0.64 and must plan upgrade/restart activity to expose the Michelson RPCs after activation.

Tezos Spotlight independently frames Ganesha as Etherlink 7.0, a proposal introducing the Michelson interface and NAC as Tezos X preparation. Its article header records the governance vote beginning on 3 August 2026. Social-post wording remains unavailable because X’s Cloudflare verification blocked direct reading of all three supplied X links.

## Published-article validation

The preview article at `/etherlink-ganesha-native-atomic-composability-gateway-on-chain` was browser-verified on 22 August 2026. The full article title, three concise Key Takeaways, categories, seven tags, source links, and accessible featured-image alternative text rendered correctly. The generated 16:9 cover visibly uses the Etherlink chain-link mark as its focal logo, with an emerald gateway joining the Tezos/Michelson visual side to an EVM-side circuit treatment.
