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

## Source locations

- `client/src/pages/ArticlePage.tsx`
- `client/src/pages/TranslatedArticlePage.tsx`
- `client/src/pages/LocaleArchivePage.tsx`
- `client/src/components/Header.tsx`
- `server/translationsRouter.ts`
