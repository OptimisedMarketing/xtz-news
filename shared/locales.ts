// Shared locale constants for the XTZ.News translation system
// Used by both client and server

export const SUPPORTED_LOCALES = ["zh", "ko", "ja", "de", "es", "fr", "pt", "ru", "ar", "tr"] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  zh: "中文",
  ko: "한국어",
  ja: "日本語",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  pt: "Português",
  ru: "Русский",
  ar: "العربية",
  tr: "Türkçe",
};

export const LOCALE_ENGLISH_NAMES: Record<SupportedLocale, string> = {
  zh: "Chinese",
  ko: "Korean",
  ja: "Japanese",
  de: "German",
  es: "Spanish",
  fr: "French",
  pt: "Portuguese",
  ru: "Russian",
  ar: "Arabic",
  tr: "Turkish",
};

export const LOCALE_FLAGS: Record<SupportedLocale, string> = {
  zh: "🇨🇳",
  ko: "🇰🇷",
  ja: "🇯🇵",
  de: "🇩🇪",
  es: "🇪🇸",
  fr: "🇫🇷",
  pt: "🇧🇷",
  ru: "🇷🇺",
  ar: "🇸🇦",
  tr: "🇹🇷",
};

export const RTL_LOCALES: SupportedLocale[] = ["ar"];

export function isRTL(locale: string): boolean {
  return RTL_LOCALES.includes(locale as SupportedLocale);
}

export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}
