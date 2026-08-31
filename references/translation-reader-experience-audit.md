# Translation-Focused Reader Experience Audit

## Scope and method

This audit reviewed the English article language controls, the translated-article route, a Chinese edition archive, the shared translation router, and published-translation coverage.

## Key findings

1. The site currently has **1,514** published English articles. Only **645** have at least one published translation (6,406 translated records in total), so many article/language combinations legitimately do not exist.
2. The Ganesha route at `/zh/etherlink-ganesha-native-atomic-composability-gateway-on-chain` gives a clear unavailable message and English return link, but it provides no available-language alternatives and does not guide readers to the Chinese archive.
3. The English article page exposes its available translation buttons only after the article content and tags. This makes the main language decision late in the reader journey.
4. The translated article footer currently renders a fixed first five alternative languages regardless of whether those translations exist. This can send readers to an avoidable unavailable-page state.
5. The global header lists all edition archives rather than switching the current article to languages that are known to exist. It is useful for discovery but ambiguous as an article-language control.
6. The Chinese edition archive has a clear edition heading and language picker. During initial rendering it presents a full 24-card skeleton; this needs an explicit progress/status cue and a faster perceived loading treatment.
7. Once loaded, the Chinese edition archive successfully exposes 24 translated stories with Chinese titles and excerpts. The content is useful, but the dated card grid has no topical filters, pagination or clear indication of how much translated back-catalogue is available.
8. The restored preview data set does not currently resolve the later Ganesha source slug, so implementation validation will use a translated story that is present in the active database rather than relying on that historical preview route.
9. A known published translated story also currently remains in the preview loading state after an English article request. A one-off mysql2 and Drizzle diagnostic resolves the same post successfully, so the active server request path requires further verification before live article interaction validation can be recorded.
10. After server restart, the active English article endpoint returned the known translated Art on Tezos story and displayed the new above-fold list of ten published-language links. The Chinese Ganesha recovery route began with the expected translated-article loading state; its completed recovery rendering is being validated separately.
11. The English Art on Tezos article now loads successfully with the availability-aware **Read this article in** chooser directly below its date/read-time metadata. All ten links are drawn from published translation records. The Chinese Ganesha route now produces the dedicated **Not yet available in 中文** recovery state, with the English-original action and Chinese-edition action; because no other Ganesha translations are published yet, it correctly shows no speculative language links.
12. The restored preview’s lookup error was caused by database initialization that did not create a mysql2 pool. Initializing Drizzle with a real promise-based pool restored published article loading. A direct endpoint check, browser article view, full test suite, and TypeScript validation confirm the repaired active path.

## Current validation note

After the translation updates, the local `posts.bySlug` tRPC endpoint returned the full published Art on Tezos article payload for the sample slug. The persistent browser preview retained an older article-loading shell despite the successful API response and a clean server restart. This is a preview-client state issue rather than a failed article lookup; final release validation should use a fresh published preview after checkpointing.

## Source locations

- `client/src/pages/ArticlePage.tsx`
- `client/src/pages/TranslatedArticlePage.tsx`
- `client/src/pages/LocaleArchivePage.tsx`
- `client/src/components/Header.tsx`
- `server/translationsRouter.ts`
