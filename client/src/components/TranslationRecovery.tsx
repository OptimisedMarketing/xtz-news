import React from "react";
import { ArrowLeft, Globe } from "lucide-react";
import { Link } from "wouter";
import { LOCALE_NAMES, type SupportedLocale } from "@shared/locales";
import ArticleLanguageChooser from "@/components/ArticleLanguageChooser";
import type { ArticleTranslationLink } from "@/lib/translationPresentation";

interface TranslationRecoveryProps {
  locale: SupportedLocale;
  source: { title: string; slug: string };
  translations: ArticleTranslationLink[];
}

export default function TranslationRecovery({ locale, source, translations }: TranslationRecoveryProps) {
  const localeName = LOCALE_NAMES[locale];

  return (
    <main style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <section aria-labelledby="translation-unavailable-title" style={{ width: "min(100%, 620px)", padding: "2rem", background: "#05152e", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "12px", textAlign: "center" }}>
        <Globe size={28} aria-hidden="true" style={{ color: "#5a9fff", marginBottom: "0.85rem" }} />
        <p style={{ margin: "0 0 0.45rem", fontSize: "0.68rem", color: "#5a9fff", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>Translation status</p>
        <h1 id="translation-unavailable-title" style={{ color: "#fff", margin: "0 0 0.8rem", fontSize: "clamp(1.35rem, 4vw, 2rem)" }}>Not yet available in {localeName}</h1>
        <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.6, margin: "0 auto 1.25rem", maxWidth: "510px" }}>
          <strong style={{ color: "#fff" }}>{source.title}</strong> is available in English. Choose the original story or one of the languages that is already published.
        </p>
        <Link href={`/${source.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.7rem 1rem", background: "#2c7df7", borderRadius: "5px", color: "#fff", fontWeight: 800, fontSize: "0.82rem", textDecoration: "none", marginBottom: "1.15rem" }}>
          <ArrowLeft size={15} aria-hidden="true" /> Read the English original
        </Link>
        <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "left" }}>
          <ArticleLanguageChooser currentLocale={locale} translations={translations} label="Available in" />
          <Link href={`/${locale}`} style={{ display: "inline-block", marginTop: "1rem", color: "#8cbcff", fontSize: "0.78rem", fontWeight: 700, textDecoration: "none" }}>
            Browse the {localeName} edition →
          </Link>
        </div>
      </section>
    </main>
  );
}
