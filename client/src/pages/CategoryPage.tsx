import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { Home, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";

const PAGE_SIZE = 12;

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data: category } = trpc.categories.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data, isLoading } = trpc.posts.byCategory.useQuery(
    { slug: slug || "", limit: loadedCount, offset: 0 },
    { enabled: !!slug }
  );

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;
  const hasMore = posts.length < total;

  // Clear loading state when new data arrives
  useEffect(() => {
    if (!isLoading) setLoadingMore(false);
  }, [isLoading, posts.length]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setLoadedCount((c) => c + PAGE_SIZE);
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "3rem 0 2rem" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.35rem", marginBottom: "1rem", fontSize: "0.8rem", fontWeight: 600 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}>
              <Home size={13} />
            </Link>
            <ChevronRight size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <Link href="/categories" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>Categories</Link>
            <ChevronRight size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.85)" }}>{category?.name || slug?.replace(/-/g, " ")}</span>
          </nav>

          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.02em", margin: 0 }}>
            {category?.name || slug?.replace(/-/g, " ")}
          </h1>
          {total > 0 && (
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>
              {total} articles
            </p>
          )}
        </div>
      </div>

      {/* Posts grid */}
      <div className="container" style={{ padding: "2.5rem 1.25rem" }}>
        {isLoading && posts.length === 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "260px", borderRadius: "4px" }} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} variant="default" />
              ))}
            </div>

            {/* Load More button — centred, no page numbers */}
            {hasMore && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3rem", gap: "0.75rem" }}>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>
                  Showing {posts.length} of {total} articles
                </p>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore || isLoading}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.875rem 2.5rem",
                    background: "transparent",
                    border: "2px solid #2c7df7",
                    borderRadius: "3px",
                    color: "#2c7df7",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    opacity: loadingMore ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMore) {
                      (e.currentTarget as HTMLElement).style.background = "#2c7df7";
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#2c7df7";
                  }}
                >
                  {loadingMore ? (
                    <><Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} /> Loading...</>
                  ) : (
                    <><ChevronDown size={15} /> Load More Articles</>
                  )}
                </button>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* All loaded message */}
            {!hasMore && total > PAGE_SIZE && (
              <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
                  All {total} articles loaded
                </p>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
