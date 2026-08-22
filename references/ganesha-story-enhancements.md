# Ganesha Story Enhancements — Validation Record

## Desktop reader validation — 22 August 2026

The enhanced Ganesha article was browser-verified after the page completed loading. The article renders the interactive EVM-to-Michelson gateway explainer directly below Key Takeaways, including two keyboard-focusable direction controls, the documented EVM precompile address, and an atomic commit-or-revert explanation.

The article also renders a dedicated **Share the Ganesha gateway story** panel with labelled X and LinkedIn links. The lower **More Etherlink and Tezos News** section prioritises Etherlink stories ahead of broader related coverage, while retaining a link to the Etherlink archive.

The browser’s accessibility-oriented interaction map also exposes both gateway-direction controls as buttons: **EVM → Michelson** and **Michelson → EVM**. This confirms the explainer is operable independently of hover, not merely decorative.

The Michelson-to-EVM control was activated in the browser. The gateway address changed to `KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw`, and the active explanation changed to the Michelson native gateway and EIP-1271-associated EVM address flow. Full-page desktop and 390px mobile captures both confirm a responsive single-column treatment on small screens and a readable multi-column explainer with related-content sidebar on desktop.

## Regression and link validation

The dedicated X action now uses the same established `twitter.com/intent/tweet` share endpoint as the article page’s existing sharing implementation, while retaining the reader-facing **X** label. Its regression test confirms the X and LinkedIn URLs. The related-story ordering test was moved into the configured TypeScript JSX test pattern and executed, confirming Etherlink and Tezos stories are prioritised. A 390px viewport regression test confirms the Michelson-to-EVM control remains operable. The full suite now passes: **53 tests across 15 files**, and `tsc --noEmit` succeeds.

The browser-level share-destination check was then opened from the fully loaded article, where the dedicated X and LinkedIn controls were present in the reader-facing share panel.

During the same validation, the lower article section visibly presented **More Etherlink and Tezos News** with the two Etherlink stories first, followed by broader Tezos coverage. This matches the Ganesha-specific relevance ordering.

## Browser share-destination check

The standardised X intent URL resolved to X’s own `x.com/account/access` Cloudflare verification page. This is an external-provider bot-verification barrier rather than an invalid share URL; no share was submitted. The LinkedIn share URL resolved to LinkedIn with `shareActive=true` and the encoded Ganesha article URL in the destination query parameters. No content was posted during either check.
