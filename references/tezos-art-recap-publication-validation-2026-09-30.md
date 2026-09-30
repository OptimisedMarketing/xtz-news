# Tezos Art Recap Publication Validation

**Published and validated:** 30 September 2026

## Source and editorial scope

The article reports on the official Tezos **Art on Tezos Friday Recap** published on 25 September 2026. It treats the recap as a dated editorial snapshot rather than a live event calendar. This preserves the distinction between items that had a fixed September date and any calls or releases whose status may have changed after the recap was posted.

Primary sources checked:

- Official Tezos recap: <https://x.com/tezos/status/2103485035299156358>
- Museum of the Moving Image event page for **Responsive Signals**: <https://movingimage.org/event/responsive-signals/>

The article accurately identifies Responsive Signals as a September 22 MoMI programme within the MoMI × Tezos Foundation partnership and names Jonas Lund, Yoshi Sodeoka, Nick Fox-Gieg and Kat Zhang. It also distinguishes Tezos’ reporting of the 22-artist Vienna event, planned releases, open call, auction, collecting feature and platform teaser from independently verified current status.

## Editorial configuration

- **Title:** Tezos Art Recap: Museum Signals, Vienna Screens and New Digital Works
- **Byline:** Lee Evans
- **Categories:** Art, Exhibition, Latest News
- **Tags:** Art on Tezos, Digital Art, Exhibitions, NFTs, objkt, Tezos
- **Featured image:** Original text-free AI editorial illustration. It is managed in project storage and appears through the same-origin `/media/` relay.
- **Key Takeaways:** Four reader-facing bullets, including the dated-recap status caveat.

## Search and discovery checks

A Googlebot request returned the intended unique title, SEO description, canonical URL and `NewsArticle` JSON-LD. The article is present in both `news-sitemap.xml` and the canonical sitemap after the local sitemap cache refresh. Social metadata resolves the cover through `https://xtz.news/media/tezos-art-recap-september-2026-hero-b_1cfb1833.jpg`; the local media relay returned **200 image/jpeg**.

## Visual and technical checks

Full-page desktop (1280 px) and mobile (390 px) captures confirm the shared header/menu, article hero, supplied cover, Key Takeaways, reader controls, author box, related articles, footer and existing global scroll-to-top control. The mobile article retains a single-column reading flow without horizontal overflow.

`pnpm check` passed and the complete suite passed: **181 tests across 62 files**.
