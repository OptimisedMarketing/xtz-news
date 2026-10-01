# The Wall Today Genesis Wall Publication Validation

**Published and validated:** 1 October 2026

The article **“The Wall Today Freezes Its Genesis Board as a Tezos Archive Takes Shape”** is source-grounded in THE WALL Today’s public welcome page, its official September 30 announcement, its public profile, and AuRo404’s September 21 post.

The feature cover uses the supplied official September Wall composite and presents a visible linked credit to THE WALL Today’s September Wall post. The article distinguishes confirmed public facts from unannounced details: it reports that the September board is frozen and named the Genesis Wall, that the welcome page describes an invite-only early beta and monthly Tezos snapshot, and that project statistics are promised but not yet supplied.

The AuRo404 animation is included as a muted, looping, controllable inline video with a source-linked caption. It is served through the same-origin media relay and explicitly identified as an historical 64,900-mark counter rather than a current or final count.

Validation completed:

- Featured PNG, animation MP4, and video poster return HTTP 200 through `/media/*`.
- The article body normalizes both `src` and `poster` first-party paths through the media relay; targeted regression coverage passes.
- Googlebot receives `NewsArticle` metadata, canonical feature-cover image, published and modified timestamps.
- The article appears in `/news-sitemap.xml` with a valid XTZ.News publication entry.
- Desktop and 390px mobile captures confirm the cover, credited animation, bullet Key Takeaways, responsive article layout, and readable source credit.
- TypeScript and the full suite pass: **201 tests across 69 files**.
