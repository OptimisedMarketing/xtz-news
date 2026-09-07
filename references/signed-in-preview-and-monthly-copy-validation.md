# Signed-In Preview and Monthly Digest Copy — Validation

**Validated:** 7 September 2026

## Preview WebSocket repair

The managed HTTPS preview proxy can serve Vite source modules but does not reliably forward Vite’s middleware-mode WebSocket upgrades. To prevent the user-facing development-console error, the development HTML is now served as the raw project template rather than passing through Vite’s index transformer. This means Vite cannot inject `/@vite/client` or initiate an HMR WebSocket connection.

| Check | Result |
| --- | --- |
| Fresh local preview HTML | Passed. A cache-busted request contained no `vite`, `@vite/client`, or `__vite__` reference. |
| Cache control | Passed. The development HTML response includes `Cache-Control: no-store`, preventing an authenticated preview browser from retaining an older HMR-enabled document. |
| Signed-in HTTPS preview | Passed. The authenticated `/?from_webdev=1&hmr=disabled` preview rendered the full homepage after the change. |
| Retry-window console inspection | Passed. After waiting longer than the prior WebSocket retry interval, no new Vite connection or WebSocket error was recorded; the latest failure remains from the pre-repair document at 16:34:58 UTC. |
| Application validation | Passed. `pnpm test` completed **109 tests across 44 files** and `pnpm check` completed without TypeScript errors. |

Production traffic is unaffected. Development updates now require a normal browser refresh rather than a hot-module update.

## Monthly digest copy alignment

All subscriber-facing newsletter surfaces now describe the actual monthly digest, which covers the prior calendar month and sends on the first of each month.

| Surface | Updated wording |
| --- | --- |
| Homepage newsletter | “Monthly digest on the first of each month.” |
| Article signup | “Previous month’s Tezos stories on the first of each month.” |
| Mid-article CTA | “XTZ.News monthly roundup” and “One concise monthly email.” |
| Subscription management | “Monthly Digest” with the prior-calendar-month delivery description. |

Focused homepage and mid-article newsletter regression tests protect this monthly language.

