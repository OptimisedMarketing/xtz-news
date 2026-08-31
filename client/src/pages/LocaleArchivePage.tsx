import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import { getLocaleFromPath } from "@/lib/readerUtils";
import { LOCALE_NAMES, LOCALE_ENGLISH_NAMES, LOCALE_FLAGS, SUPPORTED_LOCALES, isValidLocale, type SupportedLocale } from "@shared/locales";
import { Globe } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { savePreferredLocale } from "@/lib/languagePreference";

export default function LocaleArchivePage() {
  const [location] = useLocation();
  // See TranslatedArticlePage: these routes use literal locale prefixes.
  const locale = getLocaleFromPath(location) as SupportedLocale;
  const validLocale = isValidLocale(locale);

  const { data: articles, isLoading } = trpc.translations.latestByLocale.useQuery(
    { locale: locale as SupportedLocale, limit: 24 },
    { enabled: validLocale }
  );

  const localeName = LOCALE_NAMES[locale as SupportedLocale] ?? locale;
  const localeEnglishName = LOCALE_ENGLISH_NAMES[locale as SupportedLocale] ?? locale;
  const flag = LOCALE_FLAGS[locale as SupportedLocale] ?? "🌐";

  useEffect(() => {
    if (validLocale) savePreferredLocale(locale as SupportedLocale);
  }, [locale, validLocale]);

  useSEO({
    title: `${flag} Tezos News in ${localeEnglishName} (${localeName}) — XTZ.News`,
    description: `Latest Tezos blockchain news translated into ${localeEnglishName}. XTZ price, DeFi, NFTs, protocol upgrades and ecosystem developments.`,
    canonical: `https://xtz.news/${locale}`,
  });

  if (!validLocale) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
          <p>Invalid language: {locale}</p>
          <Link href="/" style={{ color: "#2c7df7" }}>← Back to XTZ.News</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)",
        borderBottom: "1px solid rgba(44,125,247,0.2)",
        padding: "3rem 0 2.5rem",
      }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <Globe size={16} style={{ color: "#2c7df7" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              International Edition
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#fff", margin: "0 0 0.5rem", lineHeight: 1.1 }}>
            {flag} XTZ.News — {localeName}
          </h1>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", margin: "0 0 1.5rem" }}>
            Tezos blockchain news in {localeEnglishName} · AI-translated from English
          </p>
          {/* Language switcher */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            <Link href="/" style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", padding: "0.25rem 0.75rem", textDecoration: "none" }}>
              🇬🇧 English
            </Link>
            {SUPPORTED_LOCALES.map((l: SupportedLocale) => (
              <Link
                key={l}
                href={`/${l}`}
                style={{
                  fontSize: "0.7rem",
                  fontWeight: l === locale ? 800 : 600,
                  color: l === locale ? "#2c7df7" : "rgba(255,255,255,0.45)",
                  background: l === locale ? "rgba(44,125,247,0.15)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${l === locale ? "rgba(44,125,247,0.4)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "20px",
                  padding: "0.25rem 0.75rem",
                  textDecoration: "none",
                }}
              >
                {LOCALE_FLAGS[l]} {LOCALE_NAMES[l]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Article grid */}
      <div className="container" style={{ padding: "2.5rem 1.25rem" }}>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ background: "#05152e", borderRadius: "8px", padding: "1.25rem" }}>
                <div className="skeleton" style={{ height: "140px", marginBottom: "1rem", borderRadius: "6px" }} />
                <div className="skeleton" style={{ height: "1rem", width: "80%", marginBottom: "0.5rem" }} />
                <div className="skeleton" style={{ height: "0.8rem", width: "60%" }} />
              </div>
            ))}
          </div>
        ) : !articles?.length ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{flag}</div>
            <h2 style={{ color: "#fff", marginBottom: "0.75rem" }}>Coming Soon</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: "400px", margin: "0 auto 1.5rem" }}>
              We're working on translating XTZ.News articles into {localeName}. Check back soon!
            </p>
            <Link href="/" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>
              ← Read in English
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
                Latest Articles — {localeName}
              </h2>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>
                {articles.length} articles
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/${locale}/${article.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    style={{
                      background: "#05152e",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      transition: "border-color 0.2s, transform 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.4)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ padding: "1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#2c7df7", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {flag} {localeName}
                        </span>
                        <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)" }}>·</span>
                        <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)" }}>
                          {new Date(article.translatedAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <h3 style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1.4,
                        margin: "0 0 0.5rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p style={{
                          fontSize: "0.8rem",
                          color: "rgba(255,255,255,0.4)",
                          lineHeight: 1.5,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
