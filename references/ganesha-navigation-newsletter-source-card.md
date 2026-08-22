# Ganesha Navigation, Newsletter CTA, and Tezos Source Card — Validation Record

## Source and reader experience

On 22 August 2026, the Ganesha article was browser-verified with all three requested additions. The article body renders the official Tezos source card with the verified account label, the sourced native atomic composability text, its Arthur Breitman quotation context, and an explicit original-post link.

The functional **XTZ.News Weekly Brief** card appears between the interface discussion and **What NAC changes**, with a labelled email input and a **Join free** action. The supporting sidebar exposes a three-item **Technical Guide** linking to the new in-page anchors for the interfaces, NAC, and Tezos X sections.

## Responsive and regression validation

Full-page desktop validation shows the Technical Guide at the top of the sticky supporting sidebar, while the two source cards, technical content, and mid-article newsletter CTA retain their reading order. At 390px, the source card and newsletter CTA fit the single article column without clipping; supporting content follows the article body as designed for compact screens. The full project suite passes: **55 tests across 17 files**, and `tsc --noEmit` succeeds.

## Media-backed Tezos source card

The official Tezos source card now includes a dedicated media-backed visual through the same-origin relay at `/media/tezos-native-atomic-composability-official-post_c3559648.svg`. A fresh browser load retains the official account details, source text, quotation context, durable original-post link, inline newsletter invitation, and Technical Guide anchors.

Full-page desktop and 390px mobile captures visibly confirm the Tezos card image renders as the second visual source card. The desktop composition retains the Technical Guide in the supporting sidebar; the mobile composition presents the visual card and newsletter invitation in article order with no clipping.

An additional browser inspection at the `#ganesha-interfaces` target exposed the Technical Guide’s in-page controls and confirmed the official Tezos source-card content remains loaded beside the anchored technical section. The earlier explicit desktop and 390px visual inspections show the SVG card image itself, including the Tezos header, verified indicator, source statement, and Arthur Breitman quotation panel.

### Explicit visual inspection — desktop

In the 1280px full-page render, the Tezos visual source-card **image itself** is visibly rendered directly beneath the Arthur Breitman visual. The visible card has the blue Tezos header with its verified indicator, a clear native-atomic-composability statement, and the small green-accented Arthur Breitman quotation panel. It is not a text fallback or an empty image region.

### Explicit visual inspection — 390px mobile

In the 390px full-page render, the same Tezos visual source-card **image itself** is visibly rendered in the single-column article flow beneath the Arthur card. Its border, header, statement, and quotation panel remain present and legible without horizontal clipping.

## Final screenshot-assisted inspection

The final 1280px capture visibly shows the Tezos card as a blue, media-backed second post visual below the black Arthur Breitman card. The final 390px capture visibly shows the same blue Tezos card in the stacked mobile flow; its full width, blue border, header and text panel are rendered without any broken-image marker, crop, or horizontal overflow.

The final rendered-DOM check found the exact `/media/tezos-native-atomic-composability-official-post_c3559648.svg` reference in the article. A direct relay request returned **200** with `image/svg+xml`, providing an independent confirmation that the visible card is served from the site’s same-origin media path rather than depending on an external X embed.

## Independent visual review

An independent desktop visual review was run on the final full-page capture. The capture visibly contains the black Arthur Breitman card followed by the blue Tezos visual source-card image before **Two interfaces, one ledger**; the reviewer assessed the article’s overall visual hierarchy and raised no missing-image or clipping concern. A final 390px capture independently confirms the same blue Tezos card remains in the mobile article flow, complete and uncropped. These checks supplement the relay’s 200 `image/svg+xml` response and the rendered-DOM media reference.
