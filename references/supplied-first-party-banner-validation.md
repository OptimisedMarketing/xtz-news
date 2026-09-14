# Supplied First-Party Banner Validation

**Validated:** 14 September 2026  
**Asset:** User-supplied Optimised Marketing × XTZ.News WebP banner.

## Deployment

The supplied 640 × 200 creative is stored outside the source tree, uploaded through the managed project-media workflow, and requested through the XTZ.News same-origin `/media/` relay. The shared `FirstPartyImageBanner` component presents it as a clearly labelled **From our network** promotion linking directly to `https://optimised.marketing` with `target="_blank"` and `rel="noopener noreferrer"`.

## Reader placement and responsiveness

On the homepage, the banner replaces the former reserved placeholder directly below the completed lead-story hero and before category filters. It remains clearly separated from the headline, hero controls, and editorial content.

On news article pages, the same banner appears after the author bio box and before the newsletter form. This avoids interrupting the article body, reading controls, tags, sharing controls, related articles, and supporting sidebar.

Desktop and 390 px mobile captures confirmed that the full 16:5 creative is visible with no horizontal overflow. Its responsive width is capped at 640 px, preserving the supplied artwork’s proportions while letting it scale down to the available content width.

## Automated validation

`pnpm test` passed with **157 tests across 59 files**, and `pnpm check` passed. New coverage verifies the visible first-party label, accessible Optimised Marketing link, safe external-link relationship, supplied banner alt text, media-relay image path, and article placement mode.
