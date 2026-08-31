import { isValidLocale, type SupportedLocale } from "@shared/locales";

const LANGUAGE_PREFERENCE_KEY = "xtz_preferred_locale";

export function getPreferredLocale(): SupportedLocale | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
    return saved && isValidLocale(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function savePreferredLocale(locale: SupportedLocale): void {
  if (typeof window === "undefined" || !isValidLocale(locale)) return;
  try {
    window.localStorage.setItem(LANGUAGE_PREFERENCE_KEY, locale);
  } catch {
    // Preference persistence is optional; reading remains fully functional.
  }
}

export function clearPreferredLocale(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LANGUAGE_PREFERENCE_KEY);
  } catch {
    // Ignore unavailable browser storage.
  }
}
