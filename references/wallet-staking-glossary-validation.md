# Wallet Options, Staking Starter, and Article Glossary Links — Validation

**Validated:** 7 September 2026

| Area | Result |
| --- | --- |
| Wallet options | Passed. `/wallets` now presents Temple, Umami, Kukai, Trust Wallet, AirGap, Ledger, and MetaMask as current options listed in official Tezos wallet documentation. Each card states its documented form factor and links directly to the provider; the page explicitly does not rank or endorse providers. |
| Staking starter hub | Passed. `/staking/start` provides a reader-first delegation-versus-staking comparison, four pre-action checks, current official staking-app entry point, public baker/rewards research links, and beginner FAQ content. The page avoids reward predictions and frames itself as educational rather than personalised advice. |
| Discovery | Passed. The staking starter route is linked from desktop and mobile Explore navigation, the homepage, baker/reward tool paths, static crawler metadata, FAQPage schema, and dynamic sitemap. |
| Automatic glossary links | Passed. The article renderer now adds a single contextual glossary link per supported term across article body text, including Tezos prefixes, tez/XTZ, baker, delegation, staking, Smart Rollup, Etherlink, WXTZ, and KT1. It does not alter headings, existing links, code blocks, blockquotes, custom technical-term widgets, scripts, or styles. |
| Accessibility | Passed. Glossary terms remain real keyboard-reachable links. Hover and keyboard focus reveal an accessible visible definition; the link label announces the definition and the related XTZ.News resource. Motion respects reduced-motion preferences. |
| Desktop/mobile | Passed. Full-page 1280px and 390px captures show wallet options and the staking starter’s comparison, steps, FAQ, header, and footer without clipping or overlap. The post-quantum article remains readable on mobile with contextual glossary-linked terms. |
| Automated validation | Passed. `pnpm test` completed **101 tests across 41 files** and `pnpm check` completed without TypeScript errors. |

## Sources

1. [Installing and funding a wallet — Tezos documentation](https://docs.tezos.com/developing/wallet-setup)
2. [Stake your tez — Tezos](https://tezos.com/stake-tez)
3. [Bakers — Tezos documentation](https://docs.tezos.com/architecture/bakers)

