# First-Party Promotion, Editorial Policy, and Historic Author Attribution Validation

## First-party promotion

The homepage now contains a clearly labelled **From our network** placement for owner-managed businesses and apps. It is configured through `/admin/first-party-promotion`, rather than through third-party ad technology. The initial configured placement is Optimised Marketing, pointing to the owner-declared `https://optimised.marketing` destination with a factual, editable description. It can be hidden, changed, or redirected by an authenticated administrator without code changes.

The public configuration permits only an internal path or an HTTPS destination. The placement does not load a third-party advertising script or tracker, and its visible label distinguishes it from the site's editorial modules.

## Editorial transparency and author discovery

The new `/newsroom/editorial-policy` page explains XTZ.News source context, author attribution, article update dates, corrections contact, and the first-party promotion label. It has a unique title, description, canonical URL, `WebPage` structured data, crawler metadata, sitemap inclusion, and footer discovery. Both public author profiles link to the policy.

The reusable article author box now gives each attributed writer a direct author-profile link. Previously unassigned published articles were checked before the change; there were 1,517 unassigned stories and one already assigned Lee Evans story. The migration assigned the 1,517 unassigned published posts to Lee Evans without changing the existing named Lee byline. The Lee archive now lists the newest 12 assigned articles.

## Validation

| Check | Result |
| --- | --- |
| Desktop and mobile UI | Homepage promotion, policy page, Lee author archive, policy links, shared header, and back-to-top control were readable at 1280px and 390px widths. |
| Administrator controls | The responsive promotion editor showed the active state, title, description, destination, button label, and visual preview. |
| Bot-facing output | A Googlebot-style request returned the newsroom policy title, canonical path, and `WebPage` JSON-LD. |
| Test suite | `pnpm test` passed with **144 tests across 55 files**. |
| Type validation | `pnpm check` passed without TypeScript errors. |
