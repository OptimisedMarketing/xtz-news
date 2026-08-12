import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getMediaUrl } from "@/lib/mediaUrl";

interface RelatedArticlesProps {
  /** Current article's post ID — used to exclude it from results */
  postId?: number;
  /** Category IDs to find related articles within */
  categoryIds?: number[];
  /** Category name for the "More from X" link */
  categoryName?: string;
  /** Category slug for the "More from X" link */
  categorySlug?: string;
  /** How many articles to show (default 6) */
  limit?: number;
  /** Section heading (default "Related Articles") */
  heading?: string;
  /** Sub-heading label (default "You might also like") */
  subHeading?: string;
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function RelatedArticles({
  postId = 0,
  categoryIds = [],
  categoryName,
  categorySlug,
  limit = 6,
  heading = "Related Articles",
  subHeading = "You might also like",
}: RelatedArticlesProps) {
  const { data: related = [] } = trpc.posts.related.useQuery(
    { postId, categoryIds, limit },
    { enabled: categoryIds.length > 0 || postId > 0, staleTime: 5 * 60_000 }
  );

  // Fallback: latest articles when no category match
  const { data: latestData } = trpc.posts.latest.useQuery(
    { limit: limit + 2 },
    { enabled: related.length < 3, staleTime: 5 * 60_000 }
  );

  const articles = related.length >= 3
    ? related
    : (latestData ?? []).filter((p: any) => p.id !== postId).slice(0, limit);

  if (!articles.length) return null;

  return (
    <section style={{ marginTop: "4rem", marginBottom: "2rem" }}>
      {/* Section header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.75rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "4px", height: "28px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2c7df7", marginBottom: "2px" }}>
              {subHeading}
            </p>
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
              {heading}
            </h2>
          </div>
        </div>
        {categoryName && categorySlug && (
          <Link
            href={`/category/${categorySlug}`}
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#2c7df7",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "0.4rem 0.875rem",
              border: "1px solid rgba(44,125,247,0.35)",
              borderRadius: "4px",
              transition: "background 0.2s, border-color 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.1)";
              (e.currentTarget as HTMLElement).style.borderColor = "#2c7df7";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.35)";
            }}
          >
            More from {categoryName} →
          </Link>
        )}
      </div>

      {/* Article cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "1.25rem",
      }}>
        {articles.map((p: any) => (
          <Link key={p.id} href={`/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <div
              style={{
                background: "#05152e",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-3px)";
                el.style.borderColor = "rgba(44,125,247,0.4)";
                el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Card image */}
              {p.featuredImageUrl ? (
                <div style={{ aspectRatio: "16/9", overflow: "hidden", flexShrink: 0 }}>
                  <img
                    src={getMediaUrl(p.featuredImageUrl)}
                    alt={p.title}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              ) : (
                <div style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "2rem", opacity: 0.3 }}>📰</span>
                </div>
              )}

              {/* Card content */}
              <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {/* Category badge */}
                {p.categories?.[0] && (
                  <span style={{
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#2c7df7",
                    background: "rgba(44,125,247,0.1)",
                    padding: "2px 7px",
                    borderRadius: "2px",
                    display: "inline-block",
                    width: "fit-content",
                  }}>
                    {p.categories[0].name}
                  </span>
                )}

                {/* Title */}
                <h3 style={{
                  margin: 0,
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  flex: 1,
                }}>
                  {p.title}
                </h3>

                {/* Date */}
                {p.publishedAt && (
                  <time style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                    {formatDate(p.publishedAt)}
                  </time>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
