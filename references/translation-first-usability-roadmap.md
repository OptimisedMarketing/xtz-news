# XTZ.News Reader Experience Roadmap

## Executive recommendation

The strongest next usability investment is **translation confidence and discoverability**, rather than simply adding more language routes. XTZ.News has meaningful translated coverage—645 of 1,514 published articles have at least one published translation—but a reader can still be led from a language picker to an unavailable article, while available article translations are discovered only late in the English reading flow.[1]

> **Goal:** Let any reader understand, before they navigate, which languages are available for the current story; reach a translation in one action; and reliably return to the original source.

| Current strength | Reader friction to address |
| --- | --- |
| Ten international edition archives and 6,406 published translations offer a substantive multilingual base. | Translation coverage is incomplete at the story level, and the current global picker cannot indicate whether the article a reader is viewing exists in that language.[1] |
| The translation route accepts both localised and original English slugs. | An unavailable translation currently becomes a generic “Article not found” experience, even though the English source and the edition archive are known. |
| English articles already query the available translations. | The translation selector is positioned after the article body and tags, too late for readers who arrived specifically to find their language. |

## Ten prioritised improvements

| Priority | Improvement | User outcome | Delivery approach |
| --- | --- | --- | --- |
| **P0** | **Move the article language chooser into the title/meta area.** | Readers see “Read in: 中文 · 한국어 · …” before committing to the English article. | Reuse the existing `availableTranslations` query, but render a compact, keyboard-accessible selector beside the date/read-time row; keep the lower selector as a secondary reminder. |
| **P0** | **Show only languages that exist for the current article.** | No reader is sent to a dead translation route from an article-level control. | Keep edition browsing in the global header, but make in-article and translated-article alternatives data-driven from `availableLocales`/`byPostId`, not from a fixed locale list. |
| **P0** | **Replace the unavailable-translation page with a recovery state.** | A reader sees the English story title, a direct “Read English original” button, available-language chips, and a “Browse Chinese edition” link instead of an apparent 404. | Resolve the original post by slug before rendering the empty state; explicitly label it “Translation not available yet”, not “Article not found.” |
| **P0** | **Translate every newly published story before it is promoted as latest news.** | The newest and most important reporting does not create an avoidable multilingual dead end. | Let the cloud translation job run immediately after publication; record per-language status and surface only completed translations. The newly published Ganesha story demonstrates the gap: the Chinese edition has related Ganesha coverage but not this new story.[1] |
| **P1** | **Preserve source context on translated pages.** | Readers can assess provenance without jumping back and losing place. | Add the original publication date, original English headline, featured image, translated Key Takeaways, author/publisher card, and share controls to translated pages; distinguish “Published” from “Translated on”. |
| **P1** | **Make the language picker route-aware.** | The header becomes clear rather than misleading. | When on an article, label the control “This story” and show available translations first; keep a separately labelled “Browse an edition” group for all ten locale archives. |
| **P1** | **Add a simple translation-quality feedback action.** | Readers can report an unclear term or mistranslation without abandoning the page. | Add a non-blocking “Report translation issue” button that pre-fills story URL, language, and selected paragraph context in the existing contact flow; do not imply human review times that are not guaranteed. |
| **P1** | **Add locale-aware search.** | A reader can find an already translated story without manually scanning an archive. | Add a “Search this edition” filter to locale archives and let global search distinguish “This language” from “All XTZ.News”; search translated title/excerpt/content where indexed. |
| **P2** | **Turn locale archives into browsable editions.** | International readers can explore more than the latest 24 cards. | Add topical filters, a visible total/updated timestamp, pagination or “Load more”, and saved query state. Keep the current clean edition heading. |
| **P2** | **Remember a reader’s preferred language with an unobtrusive choice.** | Returning visitors can start in their preferred edition without forced redirection. | After a reader intentionally selects a language, save a local preference. On English pages, show a dismissible “Prefer 中文?” suggestion only when that story is available; never auto-redirect search or shared links. |

## Broader usability improvements enabled by this work

Translation should also become the organising principle for a calmer, more intentional reader journey. The homepage currently has a strong editorial hero, personalised feed, topic filters, latest stories, featured stories, popular content and newsletter invitation, but its density makes international discovery easy to miss.[1] A small **International editions** entry point beside the homepage search, a language-aware result count, and a “Latest in your language” strip would make the translated catalogue visible without adding another heavy page section.

The existing article experience already has good building blocks: Key Takeaways, technical navigation for the Ganesha piece, reader controls, a reliable media relay, related stories, and an accessible progress bar. The immediate design rule should be to **carry those benefits into translated pages** instead of treating them as simplified copies. Translation is a first-class reading mode, not an exit from the editorial product.

## Recommended first implementation sprint

| Sprint order | Scope | Why it comes first | Acceptance check |
| --- | --- | --- | --- |
| **1** | Article-level availability-aware language selector | Prevents the most frustrating outcome immediately. | Every language shown for a story resolves to a published translation. |
| **2** | Recovery state for unavailable translations | Converts the current dead end into a useful next step. | An unavailable `/zh/<slug>` page displays an English-source action, Chinese edition action, and only genuine alternatives. |
| **3** | Cloud translation trigger/status for every new post | Closes the coverage gap at the point it is created while respecting the existing low-cost cloud workflow. | New articles show per-locale progress internally; public pages show only completed translations. |
| **4** | Expanded translated-page parity | Makes readers trust and stay with translated stories. | Translated pages retain source context, takeaways, image, sharing, related content, and clear AI-translation disclosure. |

## Measurement

Track a small set of outcome metrics rather than only the number of translations: article-level language-selector click-through; translation-route unavailable rate; return-to-English rate; translated-page depth/read completion; translated search success; and translation-feedback submissions per 1,000 views. A falling unavailable-route rate and growing translated-page read completion are the clearest signs that the language experience is becoming easier.

## References

[1] [XTZ.News translation-focused reader experience audit](translation-reader-experience-audit.md)
