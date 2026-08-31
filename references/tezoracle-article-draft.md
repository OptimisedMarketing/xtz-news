# TezOracle Aims to Restore Tezos-Native Price Feeds From Layer 1 to Tezos X

## Publication metadata

| Field | Proposed value |
| --- | --- |
| Slug | `tezoracle-aims-to-restore-tezos-native-price-feeds` |
| Excerpt | TezOracle is being developed as Tezos-native oracle infrastructure, with a planned L1-to-L2 design for price updates across Michelson and EVM applications. |
| Categories | Latest News; Infrastructure; DeFi |
| Tags | TezOracle; Tezos; Tezos X; Oracles; DeFi; Michelson; EVM; Native Atomic Composability |
| Meta title | TezOracle Aims to Restore Tezos-Native Price Feeds | XTZ.News |
| Meta description | TezOracle outlines a Tezos-native oracle design for independently authorised price updates from Layer 1 to Tezos X, while the project remains in development. |

## Key Takeaways

- TezOracle is being developed to restore Tezos-native price-feed infrastructure for Layer 1 and the Tezos X roadmap.
- Its proposed design combines independent market observations, signer attestations, and threshold-based oracle consensus before an update is authorised.
- TezOracle plans local Michelson oracle state across Layer 1 and Layer 2, with NAC carrying data to EVM applications inside the Tezos X execution layer.

## Article body

```html
<p><strong>TezOracle is being developed as a Tezos-native oracle project intended to restore price-feed infrastructure for the Tezos ecosystem, from Layer 1 to the wider Tezos X roadmap.</strong> The initiative was announced by Kevin Mehrabi, who positioned it as independent oracle infrastructure for uses including lending, synthetics, perpetuals, prediction markets and commerce.</p>

<p>TezOracle’s own website is clear about its current stage: the architecture is defined, while implementation, testnet operation, shadow publication and release milestones remain ahead. That distinction matters. The announcement is not a claim that a production feed is already live; it is a look at the infrastructure the team is proposing to build.</p>

<figure class="article-embed-card">
  <blockquote>
    <p>“To restore a price feed to the Tezos ecosystem, for L1 and the full Tezos X roadmap, we’re now working on TezOracle for a Tezos-native, independent oracle infrastructure.”</p>
    <cite>Kevin Mehrabi, TezOracle announcement</cite>
  </blockquote>
  <p><a href="https://x.com/KMehrabi/status/2094236172968939971?s=20" target="_blank" rel="noopener noreferrer">View the announcement on X</a></p>
</figure>

<h2>What TezOracle proposes</h2>

<p>Oracles bring off-chain or external information into applications that need it. For price feeds, the central question is how a protocol obtains a dependable update without asking one data source or one operator to be the final authority.</p>

<p>TezOracle’s published design answers that question through several independent steps. Multiple paths gather approved market evidence under a versioned policy. Each path derives its own value and a signer attests only to the result it independently validates. Oracle consensus then determines whether enough independent attestations agree for a price update to be authorised.</p>

<p>That proposed separation is important for applications such as lending or collateral management, where a price is not merely display information. The site’s interactive design describes threshold authorisation: the required validation paths must be represented and in agreement before a single update is published.</p>

<h2>From Layer 1 to Tezos X</h2>

<p>The project is designed around local Michelson oracle contracts on Tezos Layer 1 and within the Tezos X execution layer. TezOracle says it intends to publish destination-bound price updates to both locations, allowing applications to access local oracle state where they run.</p>

<p>Within Layer 2, the proposed architecture uses Native Atomic Composability (NAC) to carry an independently validated TezOracle price into EVM applications. Compatible EVM oracle readings can also travel back as additional evidence for TezOracle’s validation process. In practical terms, the design is trying to make oracle information a shared Tezos X resource rather than a feature isolated to one smart-contract interface.</p>

<h2>What comes next</h2>

<p>TezOracle’s roadmap places implementation next, followed by verified testnet operation, shadow publication, independent review and release gating. The project says contract addresses, feed availability, signer performance and policy versions will be published as those milestones are reached.</p>

<p>For now, TezOracle is best understood as a new piece of planned Tezos infrastructure: a price-feed architecture designed to develop with the protocol and reach applications across Layer 1 and Tezos X. XTZ.News will follow the project as implementation and testnet evidence become public.</p>

<h2>Sources</h2>

<ul>
  <li><a href="https://tezoracle.com/" target="_blank" rel="noopener noreferrer">TezOracle — official website</a></li>
  <li><a href="https://x.com/KMehrabi/status/2094236172968939971?s=20" target="_blank" rel="noopener noreferrer">Kevin Mehrabi — TezOracle announcement on X</a></li>
</ul>
```
