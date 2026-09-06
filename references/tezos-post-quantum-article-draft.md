# Tezos Post-Quantum Previewnet — Publication Draft

## Publication metadata

| Field | Value |
| --- | --- |
| Title | Tezos Prepares Experimental Post-Quantum Previewnet, Arthur Breitman Explains Why Now |
| Slug | `tezos-post-quantum-previewnet-why-now` |
| Excerpt | Tezos contributors are preparing an experimental post-quantum previewnet, extending earlier testnet work on quantum-resistant `tz5` user keys to a wider set of protocol components. |
| Categories | Latest News; Infrastructure |
| Tags | Tezos; Post-Quantum; Cryptography; Quantum Computing; Data Availability Layer; Ushuaia; tz5; ML-DSA-44; Previewnet |
| Meta title | Tezos Prepares Experimental Post-Quantum Previewnet | XTZ.News |
| Meta description | Arthur Breitman explains why Tezos contributors are preparing an experimental post-quantum previewnet, building on the Ushuaia upgrade’s testnet-only tz5 account support. |
| Featured image | `/manus-storage/tezos-post-quantum-user-supplied-cover_067f9211.png` |
| Image alt text | Abstract geometric structure of blue and gold tessellated forms connected by fine coloured strands, illustrating post-quantum Tezos research |

## Key Takeaways

- Tezos contributors say an experimental post-quantum previewnet has been tested internally and is planned for public availability during September 2026.
- Ushuaia introduced `tz5` accounts using ML-DSA-44 for testnet evaluation; the feature remains disabled by default on Mainnet.
- The stated research scope extends beyond user keys to consensus-signature aggregation and the Data Availability Layer, so the previewnet is not a finished Mainnet migration.

## Article body

```html
<p><strong>Tezos contributors are preparing an experimental previewnet for a fully post-quantum version of the network, according to a new explainer from Tezos co-founder Arthur Breitman.</strong> In a 2 September post, Breitman said Tezos would “lead in the transition to post-quantum,” linking to a detailed account of why the work is being prioritised now.</p>

<p>The central point is preparation, rather than an immediate crisis. Today’s blockchain signatures commonly rely on elliptic-curve cryptography, which remains beyond the reach of classical computers at practical scale. Breitman’s argument is that the long lead time needed to change wallets, tooling and core protocol components means migration work needs to begin before a quantum attack becomes realistic.</p>

<figure class="article-embed-card">
  <blockquote>
    <p>“Tezos will lead in the transition to post-quantum! Why post-quantum, why now?”</p>
    <cite>Arthur Breitman, Tezos co-founder</cite>
  </blockquote>
  <p><a href="https://x.com/ArthurB/status/2095157897772638528?s=20" target="_blank" rel="noopener noreferrer">View Arthur Breitman’s announcement on X</a></p>
</figure>

<h2>Why post-quantum, and why now?</h2>

<p>Post-quantum cryptography refers to cryptographic approaches designed to resist attacks from sufficiently capable quantum computers. Breitman notes that quantum hardware is not yet at the point where it can threaten existing Tezos accounts. However, he argues that experimental progress in error correction and lower resource estimates for breaking elliptic-curve cryptography have made a long-term migration problem more concrete.</p>

<p>That framing matters for readers: the announcement is not saying that Tezos cryptography has been broken, nor that users must immediately move their funds. It is setting out why a network that can amend its protocol should test future cryptographic choices before a change is urgent.</p>

<h2>Ushuaia laid a testnet-only foundation</h2>

<p>The effort builds on the Ushuaia protocol upgrade, activated on Tezos Mainnet on 30 June 2026. Ushuaia included feature-flagged support for a new <code>tz5</code> account type using the ML-DSA-44 signature scheme. That capability is available for community testing, while remaining disabled by default on Mainnet.</p>

<p>This distinction is important. The upgrade established a route for wallets, custodians and other tooling to test quantum-resistant user keys without presenting the Mainnet feature as generally enabled. The Tezos protocol documentation likewise identifies <code>tz5</code> as an ML-DSA-44 account type and records the Mainnet feature flag as disabled by default.</p>

<h2>More than a wallet-key change</h2>

<p>Breitman’s explainer says a fully post-quantum Tezos will need to address more than user accounts. It identifies the aggregation of consensus operations and the Data Availability Layer (DAL) among the protocol functions currently connected to quantum-vulnerable cryptographic primitives.</p>

<p>For consensus aggregation, the post describes an experimental, STARK-based approach for aggregating hash-based signatures. For the DAL, it names ZODA, a data-availability design based on two-dimensional tensor codes, as the selected direction. These are development choices described for the previewnet; they should not be mistaken for activated Mainnet functionality.</p>

<h2>What the previewnet means for Tezos readers</h2>

<p>The planned previewnet is a testing environment for a broader protocol transition. Breitman says it was being tested internally and was expected to become publicly available during September. He also cautions that it is experimental software and may break, which is precisely why the testing stage is needed.</p>

<p>For now, the practical signal is that Tezos is continuing the path begun with Ushuaia: make the protocol’s cryptographic transition testable early, learn from wallet and infrastructure integration, and bring changes forward through the network’s amendment process over time. XTZ.News will follow the public previewnet and later protocol proposals as verifiable technical details are released.</p>

<h2>Sources</h2>

<ul>
  <li><a href="https://x.com/ArthurB/status/2095157897772638528?s=20" target="_blank" rel="noopener noreferrer">Arthur Breitman — post-quantum announcement on X</a></li>
  <li><a href="https://ex.rs/why-post-quantum-why-now/" target="_blank" rel="noopener noreferrer">Arthur Breitman — Why post-quantum, why now?</a></li>
  <li><a href="https://spotlight.tezos.com/ushuaia-is-live/" target="_blank" rel="noopener noreferrer">Tezos Spotlight — Ushuaia is Live</a></li>
  <li><a href="https://octez.tezos.com/docs/active/accounts.html" target="_blank" rel="noopener noreferrer">Octez documentation — Accounts and addresses</a></li>
</ul>
```
