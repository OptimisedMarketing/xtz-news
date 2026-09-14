# Advertising Header and Wide Banner Validation

**Validated:** 14 September 2026

## First-party banner

The supplied 2172 × 724 Optimised Marketing × XTZ.News creative has replaced the prior banner asset. It is uploaded through project media storage, delivered through the same-origin `/media/` relay, and retains its native 3:1 aspect ratio. The homepage placement may extend to 1100 px; article placement remains bounded to 760 px. Both placements preserve the full asset without cropping.

## Header discovery

The shared desktop utility bar now includes a compact **OPTIMISED MARKETING** external link with an accessible chain-link icon and external-destination marker. It has a subtle translate, colour, and background response on hover and keyboard focus, plus a visible focus outline. The header also contains an internal **ADVERTISE WITH US** link to `/advertise`. Equivalent links are available inside the opened mobile menu, keeping the closed mobile header compact.

## Advertising page

The existing `/advertise` page is now included in the crawler route registry and XML sitemap static-page list. It emits its own canonical URL, title, and description rather than falling through to article metadata.

## Validation

Desktop (1440 px) and mobile (390 px) checks confirmed the header remains readable, primary navigation remains intact, the wide creative scales proportionally, and the advertising page is reachable and readable. `pnpm test` passed with **160 tests across 59 files**, and `pnpm check` passed.
