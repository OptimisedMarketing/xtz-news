import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Calendar, ChevronDown, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

function formatDateShort(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function getYear(date: Date | string | null | undefined) {
  if (!date) return 0;
  return new Date(date).getFullYear();
}

const INITIAL_LOAD = 30;
const LOAD_MORE_COUNT = 20;

export default function TimelinePage() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data: posts = [], isLoading } = trpc.posts.latest.useQuery({ limit: 889, offset: 0 });

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((c) => c + LOAD_MORE_COUNT);
      setLoadingMore(false);
    }, 300);
  };

  const grouped = useMemo(() => {
    const map: Record<number, typeof visiblePosts> = {};
    for (const post of visiblePosts) {
      const year = getYear(post.publishedAt);
      if (!map[year]) map[year] = [];
      map[year].push(post);
    }
    return Object.entries(map)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, ps]) => ({ year: Number(year), posts: ps }));
  }, [visiblePosts]);

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero header */}
      <div style={{
        background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)",
        borderBottom: "1px solid rgba(44,125,247,0.2)",
        padding: "4rem 0 3rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(44,125,247,0.8) 40px, rgba(44,125,247,0.8) 41px)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "4px", height: "52px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0, lineHeight: 1 }}>
                Timeline
              </h1>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", margin: "0.4rem 0 0", fontWeight: 400 }}>
                A chronological history of Tezos news
              </p>
            </div>
          </div>
          {!isLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
              <Calendar size={13} style={{ color: "#2c7df7" }} />
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
                {posts.length} articles · {grouped.length} years of Tezos history
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline body */}
      <div className="container" style={{ padding: "3rem 1.25rem 5rem" }}>
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "120px", borderRadius: "8px" }} />
            ))}
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            {/* Central vertical line — desktop only */}
            <div className="hidden md:block" style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 0,
              bottom: 0,
              width: "2px",
              background: "linear-gradient(to bottom, #2c7df7 0%, rgba(44,125,247,0.15) 100%)",
              zIndex: 0,
            }} />

            {/* Mobile left line */}
            <div className="md:hidden" style={{
              position: "absolute",
              left: "16px",
              top: 0,
              bottom: 0,
              width: "2px",
              background: "linear-gradient(to bottom, #2c7df7 0%, rgba(44,125,247,0.15) 100%)",
              zIndex: 0,
            }} />

            {grouped.map(({ year, posts: yearPosts }) => (
              <div key={year}>
                {/* Year badge */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 2,
                  margin: "3rem 0 2rem",
                }}>
                  <div style={{
                    background: "linear-gradient(135deg, #1a5fd4 0%, #2c7df7 100%)",
                    color: "#fff",
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    letterSpacing: "0.05em",
                    padding: "0.6rem 2.5rem",
                    borderRadius: "100px",
                    boxShadow: "0 0 0 4px rgba(44,125,247,0.2), 0 0 0 8px rgba(44,125,247,0.07), 0 8px 32px rgba(44,125,247,0.3)",
                  }}>
                    {year}
                  </div>
                </div>

                {/* Articles */}
                {yearPosts.map((post, idx) => {
                  const isLeft = idx % 2 === 0;
                  const primaryCat = post.categories?.[0];

                  return (
                    <div key={post.id} style={{ marginBottom: "1.75rem", position: "relative", zIndex: 1 }}>
                      {/* Desktop: alternating left/right */}
                      <div className="hidden md:grid" style={{ gridTemplateColumns: "1fr 60px 1fr", alignItems: "start" }}>
                        {/* Left slot */}
                        {isLeft ? (
                          <Link href={`/${post.slug}`} style={{ textDecoration: "none", paddingRight: "1.5rem" }}>
                            <TimelineCard post={post} primaryCat={primaryCat} direction="left" />
                          </Link>
                        ) : <div />}

                        {/* Centre dot */}
                        <div style={{ display: "flex", justifyContent: "center", paddingTop: post.featuredImageUrl ? "70px" : "20px" }}>
                          <div style={{
                            width: "16px", height: "16px", borderRadius: "50%",
                            background: "#2c7df7",
                            border: "3px solid #000",
                            boxShadow: "0 0 0 3px rgba(44,125,247,0.4)",
                            flexShrink: 0, zIndex: 2,
                          }} />
                        </div>

                        {/* Right slot */}
                        {!isLeft ? (
                          <Link href={`/${post.slug}`} style={{ textDecoration: "none", paddingLeft: "1.5rem" }}>
                            <TimelineCard post={post} primaryCat={primaryCat} direction="right" />
                          </Link>
                        ) : <div />}
                      </div>

                      {/* Mobile: single column */}
                      <div className="md:hidden" style={{ display: "flex", gap: "1rem", paddingLeft: "0.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#2c7df7", border: "3px solid #000", boxShadow: "0 0 0 2px rgba(44,125,247,0.4)", marginTop: "20px", zIndex: 2 }} />
                        </div>
                        <Link href={`/${post.slug}`} style={{ textDecoration: "none", flex: 1 }}>
                          <TimelineCard post={post} primaryCat={primaryCat} direction="right" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Load More */}
            {hasMore && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3rem", gap: "0.75rem", position: "relative", zIndex: 2 }}>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", margin: 0 }}>
                  Showing {visibleCount} of {posts.length} articles
                </p>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.875rem 2.5rem",
                    background: "transparent",
                    border: "2px solid #2c7df7",
                    borderRadius: "3px",
                    color: "#2c7df7",
                    fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2c7df7"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#2c7df7"; }}
                >
                  {loadingMore
                    ? <><Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} /> Loading...</>
                    : <><ChevronDown size={15} /> Load More</>
                  }
                </button>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineCard({ post, primaryCat, direction }: {
  post: any;
  primaryCat: any;
  direction: "left" | "right";
}) {
  return (
    <article
      style={{
        background: "#05152e",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = direction === "left" ? "translateX(-4px)" : "translateX(4px)";
        el.style.borderColor = "rgba(44,125,247,0.4)";
        el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateX(0)";
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.boxShadow = "none";
      }}
    >
      {post.featuredImageUrl && (
        <div style={{ height: "140px", overflow: "hidden" }}>
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
          />
        </div>
      )}
      <div style={{ padding: "0.875rem 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
          {primaryCat && (
            <span style={{
              fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
              color: "#2c7df7", background: "rgba(44,125,247,0.12)", padding: "2px 7px", borderRadius: "2px",
            }}>
              {primaryCat.name}
            </span>
          )}
          <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
            {formatDateShort(post.publishedAt)}
          </span>
        </div>
        <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff", lineHeight: 1.45, margin: 0 }}>
          {post.title}
        </h3>
      </div>
    </article>
  );
}
