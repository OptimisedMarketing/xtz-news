import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
}

// ─── Hero + Tabs section (matches original layout exactly) ───────────────────
function HeroSection({ posts }: { posts: any[] }) {
  const [current, setCurrent] = useState(0);
  const [activeTab, setActiveTab] = useState<"latest" | "most-read">("latest");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: mostReadPosts = [] } = trpc.posts.mostRead.useQuery({ limit: 5 });

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % posts.length);
    }, 7000);
  };

  useEffect(() => {
    if (posts.length > 1) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [posts.length]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  if (!posts.length) return null;

  const post = posts[current];
  const primaryCat = post.categories?.[0];
  const sidebarPosts = activeTab === "latest" ? posts.slice(0, 5) : mostReadPosts.slice(0, 5);

  return (
    /* Outer wrapper: black background, full width */
    <section style={{ background: "#000", padding: "0" }}>
      {/* Container: limits width and uses flex to place hero + tabs side by side */}
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 0,
          padding: 0,
          maxWidth: "var(--container-max)",
          margin: "0 auto",
        }}
      >
        {/* ── LEFT: Hero slider (contained box, ~67% width) ── */}
        <div
          style={{
            flex: "0 0 67%",
            position: "relative",
            overflow: "hidden",
            minHeight: "480px",
          }}
        >
          {/* Background image */}
          <div style={{ position: "absolute", inset: 0 }}>
            {post.featuredImageUrl ? (
              <img
                key={post.id}
                src={post.featuredImageUrl}
                alt={post.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#05152e" }} />
            )}
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.15) 100%)",
              }}
            />
          </div>

          {/* Category tag + share (top-right of hero) */}
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              zIndex: 2,
            }}
          >
            {primaryCat && (
              <Link href={`/category/${primaryCat.slug}`} className="cat-tag">
                {primaryCat.name.toUpperCase()}
              </Link>
            )}
            <button
              style={{
                background: "rgba(44,125,247,0.2)",
                border: "1px solid rgba(44,125,247,0.4)",
                color: "#2c7df7",
                width: "28px",
                height: "28px",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Share2 size={12} />
            </button>
          </div>

          {/* Article content (bottom-left) */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: "2rem 2rem 2.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              height: "100%",
            }}
          >
            {/* LATEST NEWS label with blue left bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  width: "3px",
                  height: "16px",
                  background: "#2c7df7",
                  display: "inline-block",
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                LATEST NEWS
              </span>
            </div>

            {/* Date badge (blue pill) */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#2c7df7",
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.2rem 0.6rem",
                borderRadius: "2px",
                marginBottom: "0.75rem",
                alignSelf: "flex-start",
              }}
            >
              {formatDate(post.publishedAt)}
            </div>

            {/* Title */}
            <Link href={`/${post.slug}`} style={{ textDecoration: "none" }}>
              <h1
                style={{
                  fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
                  fontWeight: 900,
                  lineHeight: 1.25,
                  color: "#fff",
                  marginBottom: "0.75rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#2c7df7")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
              >
                {post.title}
              </h1>
            </Link>

            {/* Excerpt */}
            {post.excerpt && (
              <p
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "1.25rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {stripHtml(post.excerpt)}
              </p>
            )}

            {/* READ MORE button */}
            <Link href={`/${post.slug}`} className="btn-read-more" style={{ alignSelf: "flex-start" }}>
              READ MORE ›
            </Link>
          </div>

          {/* Prev/Next arrows (bottom-right of hero) */}
          {posts.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                right: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                zIndex: 2,
              }}
            >
              <button
                onClick={() => goTo((current + 1) % posts.length)}
                style={{
                  background: "#2c7df7",
                  border: "none",
                  color: "#fff",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderRadius: "2px",
                }}
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => goTo((current - 1 + posts.length) % posts.length)}
                style={{
                  background: "#2c7df7",
                  border: "none",
                  color: "#fff",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderRadius: "2px",
                }}
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Tabs panel (LATEST STORIES / MOST READ) ── */}
        <div
          style={{
            flex: "0 0 33%",
            display: "flex",
            flexDirection: "column",
            background: "#05152e",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            position: "relative",
          }}
        >
          {/* Tab buttons */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setActiveTab("latest")}
              style={{
                flex: 1,
                padding: "0.875rem 0.5rem",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: activeTab === "latest" ? "#2c7df7" : "rgba(255,255,255,0.5)",
                background: "none",
                border: "none",
                borderBottom: activeTab === "latest" ? "2px solid #2c7df7" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              LATEST STORIES
            </button>
            <button
              onClick={() => setActiveTab("most-read")}
              style={{
                flex: 1,
                padding: "0.875rem 0.5rem",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: activeTab === "most-read" ? "#2c7df7" : "rgba(255,255,255,0.5)",
                background: "none",
                border: "none",
                borderBottom: activeTab === "most-read" ? "2px solid #2c7df7" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              MOST READ
            </button>
          </div>

          {/* Article list with blue scrollbar */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#2c7df7 #05152e",
            }}
          >
            {sidebarPosts.map((p, i) => (
              <div
                key={p.id}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: (activeTab === "latest" && i === current) ? "rgba(44,125,247,0.06)" : "none",
                  borderLeft: (activeTab === "latest" && i === current) ? "3px solid #2c7df7" : "3px solid transparent",
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
                onClick={() => activeTab === "latest" && goTo(i)}
                onMouseEnter={(e) => {
                  if (!(activeTab === "latest" && i === current)) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(activeTab === "latest" && i === current)) {
                    (e.currentTarget as HTMLElement).style.background = "none";
                  }
                }}
              >
                <Link
                  href={`/${p.slug}`}
                  style={{ display: "block", padding: "0.875rem 1rem", textDecoration: "none" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: (activeTab === "latest" && i === current) ? 700 : 400,
                      lineHeight: 1.45,
                      color: (activeTab === "latest" && i === current) ? "#fff" : "rgba(255,255,255,0.7)",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.title}
                  </p>
                </Link>
              </div>
            ))}
          </div>

          {/* Blue vertical scrollbar indicator (decorative, matches original) */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "48px",
              bottom: 0,
              width: "4px",
              background: "#2c7df7",
              opacity: 0.8,
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Breaking News Ticker ─────────────────────────────────────────────────────
function NewsTicker({ posts }: { posts: any[] }) {
  if (!posts.length) return null;
  const items = [...posts, ...posts];
  return (
    <div
      style={{
        background: "#123262",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "0.55rem 0",
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: "#2c7df7",
            color: "#fff",
            padding: "0.2rem 0.55rem",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        >
          BREAKING
        </span>
        <div className="ticker-wrap" style={{ flex: 1 }}>
          <div className="ticker-content">
            {items.map((p, i) => (
              <span key={`${p.id}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", marginRight: "2rem" }}>
                <Link
                  href={`/${p.slug}`}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.75)",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)")}
                >
                  {p.title}
                </Link>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.4rem" }}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Most Popular Carousel ────────────────────────────────────────────────────
function MostPopularCarousel({ posts }: { posts: any[] }) {
  const [start, setStart] = useState(0);
  const visible = 4;
  if (!posts.length) return null;

  return (
    <section style={{ padding: "2.5rem 0", background: "#000" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>MOST POPULAR</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setStart(Math.max(0, start - visible))}
              disabled={start === 0}
              className="carousel-arrow"
              style={{ opacity: start === 0 ? 0.3 : 1 }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setStart(Math.min(posts.length - visible, start + visible))}
              disabled={start + visible >= posts.length}
              className="carousel-arrow"
              style={{ opacity: start + visible >= posts.length ? 0.3 : 1 }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {posts.slice(start, start + visible).map((post) => (
            <PostCard key={post.id} post={post} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured News Grid ───────────────────────────────────────────────────────
function FeaturedNewsGrid({ posts }: { posts: any[] }) {
  if (!posts.length) return null;
  const [main, ...rest] = posts;

  return (
    <section style={{ padding: "2.5rem 0", background: "#05152e" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>FEATURED NEWS</h2>
          <Link href="/category/latest-news" className="btn-read-more" style={{ fontSize: "0.65rem", padding: "0.4rem 1rem" }}>
            VIEW MORE
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ height: "340px" }}>
            <PostCard post={main} variant="hero" />
          </div>
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "1rem" }}>
            {rest.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} variant="hero" />
            ))}
          </div>
        </div>
        {rest.length > 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {rest.slice(2, 5).map((post) => (
              <PostCard key={post.id} post={post} variant="default" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Latest News Section ──────────────────────────────────────────────────────
function LatestNewsSection({ posts }: { posts: any[] }) {
  if (!posts.length) return null;
  return (
    <section style={{ padding: "2.5rem 0", background: "#000" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>LATEST NEWS</h2>
          <Link href="/category/latest-news" className="btn-read-more" style={{ fontSize: "0.65rem", padding: "0.4rem 1rem" }}>
            VIEW MORE
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { data: latestPosts = [] } = trpc.posts.latest.useQuery({ limit: 10 });
  const { data: mostReadPosts = [] } = trpc.posts.mostRead.useQuery({ limit: 8 });
  const { data: featuredPosts = [] } = trpc.posts.featured.useQuery({ limit: 6 });

  const heroPosts = latestPosts.slice(0, 6);
  const featuredToShow = featuredPosts.length >= 3 ? featuredPosts : latestPosts.slice(0, 6);
  const latestToShow = latestPosts.slice(0, 8);

  return (
    <div style={{ background: "#000" }}>
      <HeroSection posts={heroPosts} />
      <NewsTicker posts={latestPosts.slice(0, 10)} />
      <MostPopularCarousel posts={mostReadPosts} />
      <FeaturedNewsGrid posts={featuredToShow} />
      <LatestNewsSection posts={latestToShow} />
    </div>
  );
}
