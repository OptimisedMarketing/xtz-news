import type { SupportedLocale } from "@shared/locales";

export interface ArticleTranslationLink {
  locale: string;
  slug: string;
  title?: string | null;
}

export function getAlternativeTranslations(
  translations: ArticleTranslationLink[],
  currentLocale?: SupportedLocale,
) {
  const seen = new Set<string>();
  return translations.filter((translation) => {
    if (translation.locale === currentLocale || seen.has(translation.locale)) return false;
    seen.add(translation.locale);
    return true;
  });
}
