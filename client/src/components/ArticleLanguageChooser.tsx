import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { Link } from "wouter";
import { LOCALE_FLAGS, LOCALE_NAMES, type SupportedLocale } from "@shared/locales";
import { getAlternativeTranslations, type ArticleTranslationLink } from "@/lib/translationPresentation";
import { getPreferredLocale, savePreferredLocale } from "@/lib/languagePreference";

interface ArticleLanguageChooserProps {
  translations: ArticleTranslationLink[];
  currentLocale?: SupportedLocale;
  label?: string;
  className?: string;
}

export default function ArticleLanguageChooser({
  translations,
  currentLocale,
  label = "Read this article in",
  className,
}: ArticleLanguageChooserProps) {
  const choices = getAlternativeTranslations(translations, currentLocale);
  const [preferredLocale, setPreferredLocale] = useState<SupportedLocale | null>(null);

  useEffect(() => setPreferredLocale(getPreferredLocale()), []);

  if (!choices.length) return null;
  const preferredChoice = choices.find((choice) => choice.locale === preferredLocale);

  return (
    <nav
      className={className}
      aria-label="Available article translations"
      style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.45rem" }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)" }}>
        <Globe size={13} aria-hidden="true" /> {label}
      </span>
      {preferredChoice && (
        <Link
          href={`/${preferredChoice.locale}/${preferredChoice.slug}`}
          onClick={() => savePreferredLocale(preferredChoice.locale as SupportedLocale)}
          aria-label={`Read this article in your preferred language, ${LOCALE_NAMES[preferredChoice.locale as SupportedLocale]}`}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.32rem 0.7rem", background: "rgba(91,247,160,0.12)", border: "1px solid rgba(91,247,160,0.42)", borderRadius: "20px", color: "#8ff4c0", fontSize: "0.72rem", fontWeight: 800, textDecoration: "none" }}
        >
          Your language: {LOCALE_FLAGS[preferredChoice.locale as SupportedLocale]} {LOCALE_NAMES[preferredChoice.locale as SupportedLocale]}
        </Link>
      )}
      {choices.map((translation) => {
        const locale = translation.locale as SupportedLocale;
        return (
          <Link
            key={locale}
            href={`/${locale}/${translation.slug}`}
            onClick={() => savePreferredLocale(locale)}
            aria-label={`Read this article in ${LOCALE_NAMES[locale]}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.32rem 0.7rem", background: "rgba(44,125,247,0.12)", border: "1px solid rgba(44,125,247,0.28)", borderRadius: "20px", color: "#a7c9ff", fontSize: "0.72rem", fontWeight: 700, textDecoration: "none" }}
          >
            {LOCALE_FLAGS[locale]} {LOCALE_NAMES[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
