import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Flame, Clock } from "lucide-react";
import { getMediaUrl } from "@/lib/mediaUrl";

function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function TrendingNewsWidget() {
  const { data: posts = [], isLoading } = trpc.posts.trendingNews.useQuery({ limit: 8 });

  if (isLoading) {
    return (
      <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.25rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <Flame size={16} style={{ color: "#f97316" }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#f97316" }}>Trending Now</span>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", padding: "0.625rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="skeleton" style={{ width: "60px", height: "44px", borderRadius: "4px", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: "12px", borderRadius: "3px", width: "90%", marginBottom: "0.4rem" }} />
              <div className="skeleton" style={{ height: "12px", borderRadius: "3px", width: "60%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts.length) return null;

  return (
    <section
      aria-label="Trending Tezos News — Last 48 Hours"
      style={{ background: "linear-gradient(135deg, #05152e 0%, #0a1f3d 100%)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: "8px", padding: "1.25rem", marginBottom: "2rem" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Flame size={16} style={{ color: "#f97316" }} />
          <h2 style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#f97316", margin: 0 }}>
            Trending Now
          </h2>
          <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>· last 48h</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <Clock size={11} style={{ color: "rgba(255,255,255,0.25)" }} />
          <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)" }}>Live</span>
        </div>
      </div>

      {/* Article list */}
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {posts.map((post, i) => (
          <li
            key={post.id}
            style={{
              borderBottom: i < posts.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          >
            <Link
              href={`/${post.slug}`}
              style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", padding: "0.625rem 0", textDecoration: "none" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              {/* Rank number */}
              <span style={{
                fontSize: "1rem", fontWeight: 900, color: i < 3 ? "#f97316" : "rgba(255,255,255,0.15)",
                width: "20px", flexShrink: 0, lineHeight: 1, paddingTop: "2px", textAlign: "center",
              }}>
                {i + 1}
              </span>

              {/* Thumbnail */}
              {post.featuredImageUrl ? (
                <div style={{ width: "60px", height: "44px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, background: "#0d2a5e" }}>
                  <img
                    src={getMediaUrl(post.featuredImageUrl)}
                    alt={post.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              ) : (
                <div style={{ width: "60px", height: "44px", borderRadius: "4px", background: "rgba(44,125,247,0.1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Flame size={16} style={{ color: "rgba(44,125,247,0.3)" }} />
                </div>
              )}

              {/* Title + meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: "0.78rem", fontWeight: 700, color: "#fff", margin: "0 0 0.25rem",
                  lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {post.title}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {(post.categories as any)?.[0] && (
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#2c7df7", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {(post.categories as any)[0].name}
                    </span>
                  )}
                  <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)" }}>
                    {timeAgo(post.publishedAt)}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      {/* Footer link */}
      <Link
        href="/category/latest-news"
        style={{ display: "block", textAlign: "center", marginTop: "0.75rem", fontSize: "0.72rem", color: "#f97316", textDecoration: "none", fontWeight: 700, opacity: 0.8 }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
      >
        View all latest news →
      </Link>
    </section>
  );
}
