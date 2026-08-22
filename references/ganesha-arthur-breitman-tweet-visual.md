# Arthur Breitman Tweet Visual — Validation Record

## Article integration

On 22 August 2026, the supplied screenshot of Arthur Breitman’s cross-runtime transaction post was uploaded to durable project media storage and inserted as a linked visual card in the Ganesha article immediately before **Two interfaces, one ledger**.

The live article’s reader output confirms the visual-card caption, the supplied quote, and the **View the original post on X** link appear in the expected editorial position. The image itself remains independently useful when X embeds are unavailable because it is served from the site’s project media storage.

## Responsive validation

Full-page desktop and 390px mobile captures confirm the tweet visual renders directly after the article introduction, before the **Two interfaces, one ledger** section. The desktop card preserves the supplied screenshot at a readable editorial width; the mobile card scales to the article column without clipping. The full project regression suite passes: **53 tests across 15 files**, and `tsc --noEmit` succeeds.

## Media-relay correction

The card image now uses the same-origin `/media/arthur-breitman-cross-runtime-transaction-tweet_8213e2dc.png` route rather than a direct storage path. A fresh browser reload retained the caption and original-post link in the intended article position after this correction.

Fresh full-page desktop and 390px mobile captures after the relay correction visibly show the supplied tweet screenshot. It remains readable at desktop width and fits the mobile article column with no clipping.

## Original-post link check

The card’s original-post destination is the supplied Arthur Breitman URL, `https://x.com/ArthurB/status/2090740735884570802?s=20`. Opening it in the browser reached X’s own Cloudflare verification screen; this is an external-provider bot-verification barrier, not a broken XTZ.News link. No content was submitted.

The rendered article DOM was inspected after the relay correction and contains the expected anchor exactly: `href="https://x.com/ArthurB/status/2090740735884570802?s=20"`. The post-correction full-page desktop and mobile renders visibly show the tweet image itself, not merely its caption.
