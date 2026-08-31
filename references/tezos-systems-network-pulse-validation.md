# Tezos Systems Network Pulse — Validation Record

The homepage now includes an attributed **Tezos Network Pulse** module immediately after the topic filters and before Latest News. It complements XTZ.News editorial content rather than reproducing third-party metrics.

The module provides four direct, clearly labelled Tezos Systems destinations: Network & health, Capital, Bakers, and Governance. Each opens in a new tab and has an accessible label describing the destination. The related component test asserts all four approved URLs and the attribution link.

The full suite passes: **69 tests across 29 files**, and `tsc --noEmit` succeeds. Full-page 1280px and 390px captures show a two-column module on desktop and a compact one-column destination list on mobile, with no horizontal overflow or clipped action.
