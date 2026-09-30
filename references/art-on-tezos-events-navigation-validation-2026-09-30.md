# Art on Tezos Events and Primary Navigation Validation

**Validated:** 30 September 2026  
**Scope:** Source-grounded publication of selected Art on Tezos event records, event-calendar presentation, and shared primary navigation.

## Published event records

| Event | Schedule and status | Location | Primary source |
| --- | --- | --- | --- |
| Terms of Agreement 🐳 | **Current exhibition** — 6 August to 25 October 2026 | Museum of the Moving Image, Astoria, New York | [MoMI listing](https://movingimage.org/event/terms-of-agreement/) |
| Responsive Signals | **Recently passed** — 22 September 2026, 6–9 p.m. EDT | William Fox Amphitheater, Museum of the Moving Image, Astoria, New York | [MoMI listing](https://movingimage.org/event/responsive-signals/) |
| Stories We Tell Online | **Recently passed** — 23 September 2026, 6–10 p.m. CEST | Click-Net, Martinstraße 91, Vienna | [Art on Tezos announcement](https://x.com/artontezos_/status/2102674387048800679) |

All three records are inserted as editor-published event candidates with a source check dated 30 September 2026. The operation is idempotent by source key and source event identifier.

## Calendar presentation

The public calendar now separates **Current & upcoming** listings from **Recently passed** editor-reviewed records. A current multi-day exhibition remains in the first section through its listed end time. Single-day completed events remain visibly labelled as historical records for a 45-day review window and are not described as future plans. Every record retains the official source link and an ICS calendar download.

## Navigation

**EVENTS** now appears as a direct first-view item in the desktop primary navigation between **PROJECTS** and **COMMUNITY SERVICES**. The mobile **Read** section includes **Events**, and the former duplicate entry in the mobile Explore section was removed. The shared layout continues to provide the site-wide header, route-change scroll reset, and scroll-to-top control.

## Validation

- The public `tezosEventCandidates.published` tRPC endpoint returned all three published records with expected titles, schedule fields, locations, event type, and source URLs.
- Googlebot output for `/events` returned the expected title and canonical URL.
- Desktop and 390px mobile full-page checks confirmed Events is visible in the desktop first-view navigation, current and recent sections render clearly, filters remain usable, and event cards stack responsively.
- `pnpm check && pnpm test` passed: **63 test files / 189 tests**.
- `git diff --check` passed.
