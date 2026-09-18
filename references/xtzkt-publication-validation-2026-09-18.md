# XTZKT Publication Validation

**Validated:** 18 September 2026

## Source and publication scope

The published article and project directory profile use the supplied 0xTzKT image. Editorial claims are limited to the public teaser page and Baking Bad repository: the work is an in-development multi-chain indexer and API for Tezos L1 and Tezos X, including the EVM runtime. Both reader-facing records explicitly state that the service is coming soon and that the repository warns about potential data-correctness and breaking-change risk during development.

## Desktop visual validation

Preview screenshots at 1280 × 720 confirmed that the shared XTZ.News header, primary navigation, search control, utility controls, and attribution are present on both the article and project pages.

The article page displays the supplied wide featured image through the first-party media relay without stretching or cropping. The project profile displays the same image as a darkened background and a clear 0xTzKT identity card, with Block Explorer classification plus Website and X links. The project description begins with an explicit in-development disclosure.

## Technical validation completed

The published article uses slug `/0xtzkt-one-explorer-tezos-l1-tezos-x` and the project profile uses `/projects/0xtzkt`. The article has the Lee Evans byline, the supplied featured-image alternative text, SEO title and description, four bullet Key Takeaways, Infrastructure and Latest News category assignments, and Tezos, Tezos X, EVM, and Michelson tags.

A Googlebot-News request returned a canonical XTZ.News URL, Open Graph image at `/media/Untitleddesign(1)_33aa5dc6.webp`, `NewsArticle` JSON-LD, Lee Evans `Person` author markup, publication and modification timestamps, and the image caption. The article is present in the canonical sitemap and the Google News sitemap. The media relay returns `200 OK`, `image/webp`, and an immutable public cache header.

The project-field synchronization migration was applied with idempotent `ADD COLUMN IF NOT EXISTS` statements because the production columns predated Drizzle tracking. TypeScript and the full 174-test suite passed after the source changes.

## References

[1]: https://xtzkt.io "0xTzKT teaser site"
[2]: https://github.com/baking-bad/xtzkt "baking-bad/xtzkt: Multi-chain indexer and API for Tezos L1 and Tezos X"

## Mobile visual validation

At 390 × 844, the article keeps the shared mobile header, menu trigger, and global search in the first viewport. The supplied featured image is fully visible at the mobile width, the two selected category badges are legible, the full headline wraps cleanly, the Lee Evans byline and dates remain readable, and the Key Takeaways component begins immediately below the title area.

The initial mobile project capture showed the established loading skeleton while its public tRPC request was pending. A follow-up capture is required after the project data settles; this does not affect the article’s confirmed mobile rendering.

A settled full-page mobile capture then confirmed that the profile renders cleanly after its query resolves. It preserves the header and menu, keeps the featured visual and Block Explorer label legible, shows the Website and X controls, presents the full in-development caveat, and exposes Category, Status, Website, GitHub activity, related news, footer navigation, and the accessible Back to Top control without horizontal overflow.
