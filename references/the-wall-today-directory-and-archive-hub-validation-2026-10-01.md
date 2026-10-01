# THE WALL Today Directory Profile and Onchain Community Archives Validation

**Validated:** 1 October 2026

## Published routes

- **THE WALL Today project profile:** `/projects/the-wall-today`
- **Onchain Community Archives topic hub:** `/onchain-community-archives`
- **Connected article:** `/the-wall-today-freezes-genesis-board-tezos-archive`

## Public-beta presentation

The project profile is labelled **Early beta (invite-only)**. Its concise profile summary and longer explanatory copy make only the public claims visible on THE WALL Today’s welcome page and official announcement:

- the service describes a recurring Tezos record of people, ideas and culture;
- the September 2026 Genesis Wall was frozen;
- further statistics were promised but have not been inferred; and
- participation information is directed back to the official invite-redemption path.

The profile uses the existing credited THE WALL Today September Wall image through XTZ.News’ same-origin media relay.

## Reciprocal discovery paths

- The article links to the project profile and the new topic hub.
- The project profile visibly links to the article and topic hub.
- The topic hub puts THE WALL Today first and groups it with Teia, Objkt.com, the HEK × Tezos Digital Art Programme and Kento.
- The hub includes the connected Wall Today, art-recap and Kento coverage cards.
- The hub is surfaced in desktop and mobile **Explore** navigation and through a dedicated homepage feature.

## SEO and technical validation

- Googlebot response for `/onchain-community-archives` contains its unique title, description and canonical URL.
- The canonical sitemap includes `/onchain-community-archives`.
- `projects.bySlug` returns the THE WALL Today profile with the official welcome URL and public-beta summary.
- The shared `/media/` relay returns the profile image with an image content type.
- All four reciprocal content links were checked directly against the saved article and project records.
- Desktop and 390 px mobile full-page captures passed for the hub, project profile, existing article and homepage entry.
- `pnpm check` passed.
- Full Vitest suite passed: **205 tests across 70 files**.
- `git diff --check` passed.
