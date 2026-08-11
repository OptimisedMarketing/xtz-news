import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import { getLocaleFromPath, getTranslatedSlugFromPath } from "@/lib/readerUtils";
import { LOCALE_NAMES, LOCALE_ENGLISH_NAMES, LOCALE_FLAGS, RTL_LOCALES, SUPPORTED_LOCALES, isValidLocale, type SupportedLocale } from "@shared/locales";
import { ArrowLeft, Globe, Calendar } from "lucide-react";
import ArticleContent from "@/components/ArticleContent";
import { Link, useLocation } from "wouter";

export default function TranslatedArticlePage() {
  const [location] = useLocation();
  // Locale routes are registered explicitly in App.tsx, so wouter has no
  // `:locale` parameter to expose. Derive it from the path instead.
  const locale = getLocaleFromPath(location) as SupportedLocale;
  const slug = getTranslatedSlugFromPath(location);

  // Validate locale
  const validLocale = isValidLocale(locale);

  const { data: translation, isLoading } = trpc.translations.byLocaleSlug.useQuery(
    { locale: locale as SupportedLocale, slug },
    { enabled: validLocale }
  );

  const isRTL = RTL_LOCALES.includes(locale as SupportedLocale);
  const localeName = LOCALE_NAMES[locale as SupportedLocale] ?? locale;
  const localeEnglishName = LOCALE_ENGLISH_NAMES[locale as SupportedLocale] ?? locale;

  useSEO({
    title: translation?.metaTitle ?? translation?.title ?? `${localeEnglishName} — XTZ.News`,
    description: translation?.metaDescription ?? translation?.excerpt ?? `Tezos news in ${localeEnglishName}`,
    canonical: translation ? `https://xtz.news/${locale}/${translation.slug}` : undefined,
    ogType: "article",
  });

  if (!validLocale) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
          <p>Invalid language code: {locale}</p>
          <Link href="/" style={{ color: "#2c7df7" }}>← Back to XTZ.News</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ background: "#000", minHeight: "100vh" }}>
        <div className="container" style={{ padding: "3rem 1.25rem" }}>
          <div className="skeleton" style={{ height: "2rem", width: "60%", marginBottom: "1rem" }} />
          <div className="skeleton" style={{ height: "1rem", width: "40%", marginBottom: "2rem" }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "1rem", width: `${80 + Math.random() * 20}%`, marginBottom: "0.75rem" }} />
          ))}
        </div>
      </div>
    );
  }

  if (!translation) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#fff", marginBottom: "1rem" }}>Article not found</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>
            This article is not yet available in {localeName}.
          </p>
          <Link href="/" style={{ color: "#2c7df7", textDecoration: "none" }}>← Back to XTZ.News (English)</Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ background: "#000", minHeight: "100vh" }}
      dir={isRTL ? "rtl" : "ltr"}
      lang={locale}
    >
      {/* Language banner */}
      <div style={{
        background: "rgba(44,125,247,0.1)",
        borderBottom: "1px solid rgba(44,125,247,0.2)",
        padding: "0.5rem 0",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>
            <Globe size={12} />
            <span>{LOCALE_FLAGS[locale as SupportedLocale]} Reading in {localeName} ({localeEnglishName})</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span style={{ fontSize: "0.65rem", background: "rgba(255,255,255,0.1)", padding: "0.1rem 0.4rem", borderRadius: "3px" }}>
              AI Translated
            </span>
          </div>
          <Link
            href={`/${slug}`}
            style={{ fontSize: "0.72rem", color: "#2c7df7", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}
          >
            <ArrowLeft size={11} /> Read in English
          </Link>
        </div>
      </div>

      {/* Article */}
      <div className="container" style={{ padding: "2.5rem 1.25rem", maxWidth: "760px", margin: "0 auto" }}>
        {/* Title */}
        <h1 style={{
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1.2,
          marginBottom: "1rem",
          letterSpacing: "-0.02em",
          textAlign: isRTL ? "right" : "left",
        }}>
          {translation.title}
        </h1>

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
            <Calendar size={11} />
            <span>{new Date(translation.translatedAt).toLocaleDateString(locale === "zh" ? "zh-CN" : locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : locale === "ar" ? "ar-SA" : "en-GB", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <span style={{ fontSize: "0.65rem", background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.3)", color: "#2c7df7", padding: "0.15rem 0.5rem", borderRadius: "3px", fontWeight: 700 }}>
            {LOCALE_FLAGS[locale as SupportedLocale]} {localeName}
          </span>
        </div>

        {/* Content */}
        <ArticleContent
          html={translation.content}
          className="post-content"
          style={{ textAlign: isRTL ? "right" : "left" }}
        />

        {/* Footer */}
        <div style={{
          marginTop: "3rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
            🤖 This article was automatically translated by AI. For the original English version, please{" "}
            <Link href={`/${slug}`} style={{ color: "#2c7df7", textDecoration: "none" }}>click here</Link>.
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {SUPPORTED_LOCALES.filter((l: SupportedLocale) => l !== locale).slice(0, 5).map((l: SupportedLocale) => (
              <Link
                key={l}
                href={`/${l}/${slug}`}
                style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "0.2rem 0.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "3px", transition: "all 0.15s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
              >
                {LOCALE_FLAGS[l]} {LOCALE_NAMES[l]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
