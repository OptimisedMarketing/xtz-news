# Media Relay and Footer Navigation — Validation Record

The source audit found no direct first-party Manus Storage paths in client source. The remaining server-side occurrences were in podcast RSS, newsletter/governance email HTML, and social crawler metadata. Those first-party logo and featured-image paths now resolve through `/media/`, while external media URLs remain unchanged.

The homepage’s full-page 1280px and 390px renders show the footer’s relay-backed XTZ.News logo alongside the newly added **Back to top** control. The control has an explicit accessible label and a focused unit test for smooth-scroll invocation. Its hover movement is gated behind `prefers-reduced-motion: no-preference`.

The completion audit confirms all client-side first-party storage media is routed through `getMediaUrl()` and therefore `/media/*`. Server-side RSS, newsletter/governance email HTML, and crawler metadata now use the same relay for first-party logo and article-image paths; the original storage route definitions remain only as compatibility infrastructure. The full suite passes: **62 tests across 24 files**, and `tsc --noEmit` succeeds.
