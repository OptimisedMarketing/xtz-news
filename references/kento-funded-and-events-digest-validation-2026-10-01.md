# Kento Funded Follow-up and Events Digest Validation

**Validated:** 1 October 2026

## Kento Season 01 follow-up

- Published: [`/kento-season-one-funded-951-backers-215920`](https://xtz.news/kento-season-one-funded-951-backers-215920)
- Headline and copy attribute the funding result to Kento’s 1 October campaign-close announcement: **951 backers** and **approximately US$215,920**.
- The article distinguishes the reported campaign result from resale or delivery guarantees, explains that pre-sales are only stated as forthcoming, and retains links to the Kickstarter campaign and Kento’s own pages.
- The supplied Kento product visual was edited into a dark neon editorial setting while retaining the box, foil packs, product marks, printed elements and layout. It is uploaded through the first-party media relay and credited as an XTZ.News edit based on a Kento product image supplied by XTZ.News.
- The roster contains all **40** Season 01 artists from Kento’s official directory. A conservative per-profile check found **36** direct Objkt links. The four pages without a Kento-linked Objkt profile (ALIENQUEEN, Amber Vittoria, cemhah and Travess Smalley) link to their official Kento artist pages rather than an inferred Objkt address.
- Crawler verification confirmed canonical metadata, `NewsArticle` structured data, publication/modified dates, News sitemap discovery, and HTTP 200 same-origin media delivery.
- Desktop and 390px mobile full-page visual captures confirmed the readable hero, image credit, bullet takeaways, two-column then one-column roster, source links and responsive article layout.

## Monthly newsletter event extension

- Added a compact **Event of the Month** lead panel at the top of each monthly digest. It selects the first event from the completed period; if none took place, it uses the nearest upcoming verified event.
- Added reader-facing event badges: **Art**, **Conference**, **Workshop**, **Meetup**, **Online**, or **Tezos event**, mapped from the established editor-reviewed event type.
- Added the **Events-only Monthly Digest** setting to `/manage-subscriptions?token=...`. The full monthly digest remains the default. Enabling the setting sends only the existing monthly event recap/upcoming sections, and suppresses a send when no verified event coverage exists.
- Added database migration `0021_noisy_deathstrike.sql`; existing subscribers retain `eventsOnly = false`.
- TypeScript passes. Full regression validation passed: **213 tests across 73 files**.
