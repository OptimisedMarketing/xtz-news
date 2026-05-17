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

// ─── Hero + Tabs (matches original layout exactly per AI analysis) ────────────
function HeroSection({ posts }: { posts: any[] }) {
  const [current, setCurrent] = useState(0);
  const [activeTab, setActiveTab] = useState<"latest" | "most-read">("latest");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { data: mostReadPosts = [] } = trpc.posts.mostRead.useQuery({ limit: 5 });

  const startTimer = () => {
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % posts.length), 7000);
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
    <section style={{ background: "#000", padding: "0" }}>
      {/* Container: matches original's col-md-8 + col-md-4 grid */}
      <div
        className="container"
        style={{ display: "flex", alignItems: "stretch", padding: "0 1.25rem", gap: 0 }}
      >
        {/* ── LEFT: Hero slider — ~67% width, matches original's col-md-8 ── */}
        <div
          style={{
            flex: "0 0 67%",
            position: "relative",
            overflow: "hidden",
            // Original hero height: 511px
            minHeight: "511px",
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
            {/* Gradient — matches original: strong on left, fades right */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.2) 100%)" }} />
          </div>

          {/* Category tag + share icon — top right of hero box */}
          <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", zIndex: 2 }}>
            {primaryCat && (
              <Link href={`/category/${primaryCat.slug}`} className="cat-tag">
                {primaryCat.name.toUpperCase()}
              </Link>
            )}
            <button style={{ background: "rgba(44,125,247,0.2)", border: "1px solid rgba(44,125,247,0.4)", color: "#2c7df7", width: "28px", height: "28px", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Share2 size={12} />
            </button>
          </div>

          {/* Article content — bottom left */}
          <div style={{ position: "relative", zIndex: 2, padding: "2rem 2rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
            {/* LATEST NEWS label with blue left bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{ width: "3px", height: "18px", background: "#2c7df7", display: "inline-block", borderRadius: "1px", flexShrink: 0 }} />
              <span style={{ fontSize: "0.8rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>
                LATEST NEWS
              </span>
            </div>

            {/* Date badge — solid blue pill, matches original exactly */}
            <div style={{ display: "inline-flex", alignItems: "center", background: "#2c7df7", color: "#fff", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "0px", marginBottom: "0.875rem", alignSelf: "flex-start" }}>
              {formatDate(post.publishedAt)}
            </div>

            {/* Title — larger, heavier per AI analysis */}
            <Link href={`/${post.slug}`} style={{ textDecoration: "none" }}>
              <h1
                style={{ fontSize: "clamp(1.35rem, 2.2vw, 1.85rem)", fontWeight: 900, lineHeight: 1.25, color: "#fff", marginBottom: "0.875rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#2c7df7")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
              >
                {post.title}
              </h1>
            </Link>

            {/* Excerpt */}
            {post.excerpt && (
              <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "rgba(255,255,255,0.75)", marginBottom: "1.5rem", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {stripHtml(post.excerpt)}
              </p>
            )}

            {/* READ MORE — solid blue fill (not outlined) per AI analysis */}
            <Link
              href={`/${post.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "0.6rem 1.5rem",
                background: "#2c7df7",
                color: "#fff",
                border: "none",
                borderRadius: "2px",
                textDecoration: "none",
                alignSelf: "flex-start",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a6ae0")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c7df7")}
            >
              READ MORE ›
            </Link>
          </div>

          {/* Prev/Next arrows — bottom right, stacked vertically */}
          {posts.length > 1 && (
            <div style={{ position: "absolute", bottom: "1rem", right: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem", zIndex: 2 }}>
              <button
                onClick={() => goTo((current + 1) % posts.length)}
                style={{ background: "#2c7df7", border: "none", color: "#fff", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "2px" }}
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => goTo((current - 1 + posts.length) % posts.length)}
                style={{ background: "#2c7df7", border: "none", color: "#fff", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "2px" }}
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Tabs panel — ~33% width, matches original's col-md-4 ── */}
        <div
          style={{
            flex: "0 0 33%",
            display: "flex",
            flexDirection: "column",
            background: "#000",  // Original is pure black
            borderLeft: "1px solid rgba(255,255,255,0.1)",
            position: "relative",
            minHeight: "511px",
          }}
        >
          {/* Tab buttons — original: active tab has solid blue fill, inactive is plain white text */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.12)", flexShrink: 0 }}>
            {(["latest", "most-read"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "0.75rem 0.5rem",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  // Active: solid blue background + white text (matches original)
                  // Inactive: transparent background + white text
                  color: "#fff",
                  background: activeTab === tab ? "#2c7df7" : "transparent",
                  border: "none",
                  borderBottom: activeTab === tab ? "2px solid #2c7df7" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {tab === "latest" ? "LATEST STORIES" : "MOST READ"}
              </button>
            ))}
          </div>

          {/* Article list — original: black bg, thin grey dividers, generous padding, titles unclamped */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {sidebarPosts.map((p, i) => (
              <div
                key={p.id}
                onClick={() => activeTab === "latest" && goTo(i)}
                style={{
                  // Thin white/grey divider between items
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  // Active: left blue border + very subtle bg
                  background: (activeTab === "latest" && i === current) ? "rgba(44,125,247,0.08)" : "transparent",
                  borderLeft: (activeTab === "latest" && i === current) ? "4px solid #2c7df7" : "4px solid transparent",
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { if (!(activeTab === "latest" && i === current)) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { if (!(activeTab === "latest" && i === current)) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <Link
                  href={`/${p.slug}`}
                  style={{ display: "block", padding: "1rem 1.25rem", textDecoration: "none" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p style={{
                    // Original: ~14px, weight 400, white, line-height 1.4, NOT clamped
                    fontSize: "0.9rem",
                    fontWeight: (activeTab === "latest" && i === current) ? 700 : 400,
                    lineHeight: 1.5,
                    color: "#fff",
                    margin: 0,
                    // No line clamping — let titles wrap naturally like the original
                  }}>
                    {p.title}
                  </p>
                </Link>
              </div>
            ))}
          </div>
          {/* No blue scrollbar strip — original doesn't have it */}
        </div>
      </div>
    </section>
  );
}

// ─── Breaking News Ticker (90s slow scroll) ───────────────────────────────────
function NewsTicker({ posts }: { posts: any[] }) {
  if (!posts.length) return null;
  const items = [...posts, ...posts];
  return (
    <div style={{ background: "#123262", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "0.55rem 0", overflow: "hidden" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", background: "#2c7df7", color: "#fff", padding: "0.2rem 0.55rem", borderRadius: "2px", flexShrink: 0 }}>
          BREAKING
        </span>
        <div className="ticker-wrap" style={{ flex: 1 }}>
          <div className="ticker-content">
            {items.map((p, i) => (
              <span key={`${p.id}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", marginRight: "2rem" }}>
                <Link href={`/${p.slug}`} style={{ fontSize: "0.75rem", fontWeight: 400, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap", textDecoration: "none", transition: "color 0.2s" }}
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
            <button onClick={() => setStart(Math.max(0, start - visible))} disabled={start === 0} className="carousel-arrow" style={{ opacity: start === 0 ? 0.3 : 1 }}><ChevronLeft size={14} /></button>
            <button onClick={() => setStart(Math.min(posts.length - visible, start + visible))} disabled={start + visible >= posts.length} className="carousel-arrow" style={{ opacity: start + visible >= posts.length ? 0.3 : 1 }}><ChevronRight size={14} /></button>
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
          <Link href="/category/latest-news" className="btn-read-more" style={{ fontSize: "0.65rem", padding: "0.4rem 1rem" }}>VIEW MORE</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ height: "340px" }}><PostCard post={main} variant="hero" /></div>
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "1rem" }}>
            {rest.slice(0, 2).map((post) => <PostCard key={post.id} post={post} variant="hero" />)}
          </div>
        </div>
        {rest.length > 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {rest.slice(2, 5).map((post) => <PostCard key={post.id} post={post} variant="default" />)}
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
          <Link href="/category/latest-news" className="btn-read-more" style={{ fontSize: "0.65rem", padding: "0.4rem 1rem" }}>VIEW MORE</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
          {posts.map((post) => <PostCard key={post.id} post={post} variant="default" />)}
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

  return (
    <div style={{ background: "#000" }}>
      <HeroSection posts={heroPosts} />
      <NewsTicker posts={latestPosts.slice(0, 10)} />
      <MostPopularCarousel posts={mostReadPosts} />
      <FeaturedNewsGrid posts={featuredToShow} />
      <LatestNewsSection posts={latestPosts.slice(0, 8)} />
    </div>
  );
}
