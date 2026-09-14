# Editorial Author Profiles and Article Revision Discovery Validation

## Author profiles

The public profiles are available at `/authors/lee-evans` and `/authors/rossa-browne`. Lee Evans is presented as a Writer based in the United Kingdom, with the user-provided headshot and declared personal website, `https://optimised.marketing`. Rossa Browne is presented as a Writer based in Ireland, using a clearly non-photographic `RB` initial mark pending any approved profile image.

Both profile routes use their supplied names, roles, locations, editorial descriptions, canonical URLs, and `Person` JSON-LD. The profiles are included in the main sitemap and excluded from article-slug lookup. No unsupported credentials, awards, social accounts, or biographies have been added.

## Article byline and revision information

The HEK × Tezos Foundation article is assigned to Lee Evans. Its header and author card link to `/authors/lee-evans`, and the profile lists the story under the contributor's latest coverage. The shared article header now displays both the original publication date and a visible **Last updated** timestamp on every news article, using the stored modification date when available.

The HEK article continues to use the established accessible full sharing panel, which includes X and LinkedIn, and the full-width Related Articles section beneath the story. Desktop and 390px mobile screenshots confirmed the author profiles, byline, revision information, sharing controls, related content, shared header, and back-to-top control remain readable.

## Crawler and automated verification

A Googlebot-style request confirmed that the HEK article's `NewsArticle` schema declares Lee Evans as a `Person` author with the canonical author URL and stored modification timestamp. The Lee Evans author route returned its own canonical metadata and `Person` schema. The complete suite passed with **141 tests across 55 files**, and TypeScript validation passed.
