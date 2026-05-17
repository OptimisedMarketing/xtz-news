import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Tag, Share2 } from "lucide-react";
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

// ─── Hero Section (full-width image, left content, right panel) ───────────────
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
    <section className="relative w-full overflow-hidden" style={{ minHeight: "520px" }}>
      {/* Full-width background image */}
      <div className="absolute inset-0">
        {post.featuredImageUrl ? (
          <img
            key={post.id}
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{ transition: "opacity 0.5s ease" }}
          />
        ) : (
          <div className="w-full h-full" style={{ background: "#05152e" }} />
        )}
        {/* Dark overlay — stronger on left, lighter on right */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(5,21,46,0.95) 0%, rgba(5,21,46,0.7) 55%, rgba(5,21,46,0.3) 100%)",
          }}
        />
      </div>

      {/* Content row */}
      <div className="relative container flex items-stretch gap-0" style={{ minHeight: "520px" }}>
        {/* Left: Article content */}
        <div className="flex-1 flex flex-col justify-center py-12 pr-6 max-w-[580px]">
          {/* Category tag */}
          {primaryCat && (
            <div className="flex items-center gap-2 mb-3">
              <Link href={`/category/${primaryCat.slug}`} className="cat-tag">
                <Tag size={9} className="cat-tag-icon" />
                {primaryCat.name.toUpperCase()}
              </Link>
            </div>
          )}

          {/* LATEST NEWS label */}
          <div
            className="flex items-center gap-2 mb-3"
            style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)" }}
          >
            <span
              style={{
                width: "3px",
                height: "14px",
                background: "#2c7df7",
                display: "inline-block",
                borderRadius: "2px",
              }}
            />
            LATEST NEWS
          </div>

          {/* Date */}
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)", marginBottom: "0.75rem" }}>
            {formatDate(post.publishedAt)}
          </p>

          {/* Title */}
          <Link href={`/${post.slug}`}>
            <h1
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                fontWeight: 900,
                lineHeight: 1.2,
                color: "#fff",
                marginBottom: "1rem",
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
                fontSize: "0.875rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.65)",
                marginBottom: "1.5rem",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {stripHtml(post.excerpt)}
            </p>
          )}

          {/* Read More button */}
          <Link href={`/${post.slug}`} className="btn-read-more" style={{ alignSelf: "flex-start" }}>
            READ MORE ›
          </Link>
        </div>

        {/* Right: Sidebar panel with tabs */}
        <div
          className="hidden lg:flex flex-col w-[340px] shrink-0 self-stretch"
          style={{
            background: "rgba(5,21,46,0.85)",
            backdropFilter: "blur(8px)",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <button
              onClick={() => setActiveTab("latest")}
              style={{
                flex: 1,
                padding: "0.875rem",
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
                padding: "0.875rem",
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

          {/* Article list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {sidebarPosts.map((p, i) => (
              <button
                key={p.id}
                onClick={() => activeTab === "latest" ? goTo(i) : null}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.875rem 1rem",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: (activeTab === "latest" && i === current) ? "rgba(44,125,247,0.08)" : "none",
                  borderLeft: (activeTab === "latest" && i === current) ? "3px solid #2c7df7" : "3px solid transparent",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!(activeTab === "latest" && i === current)) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(activeTab === "latest" && i === current)) {
                    (e.currentTarget as HTMLElement).style.background = "none";
                  }
                }}
              >
                <Link href={`/${p.slug}`} onClick={(e) => e.stopPropagation()}>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: (activeTab === "latest" && i === current) ? 700 : 500,
                      lineHeight: 1.4,
                      color: (activeTab === "latest" && i === current) ? "#fff" : "rgba(255,255,255,0.65)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.title}
                  </p>
                </Link>
              </button>
            ))}
          </div>

          {/* Prev/Next arrows */}
          {posts.length > 1 && activeTab === "latest" && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <button
                onClick={() => goTo((current - 1 + posts.length) % posts.length)}
                className="carousel-arrow"
                aria-label="Previous"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => goTo((current + 1) % posts.length)}
                className="carousel-arrow"
                aria-label="Next"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Breaking News Ticker (slow, matches original) ────────────────────────────
function NewsTicker({ posts }: { posts: any[] }) {
  if (!posts.length) return null;
  const items = [...posts, ...posts];
  return (
    <div
      style={{
        background: "#123262",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "0.6rem 0",
        overflow: "hidden",
      }}
    >
      <div className="container flex items-center gap-4">
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: "#2c7df7",
            color: "#fff",
            padding: "0.25rem 0.6rem",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        >
          BREAKING
        </span>
        <div className="ticker-wrap flex-1">
          <div className="ticker-content">
            {items.map((p, i) => (
              <span key={`${p.id}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: "1rem", marginRight: "2.5rem" }}>
                <Link
                  href={`/${p.slug}`}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.75)",
                    whiteSpace: "nowrap",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)")}
                >
                  {p.title}
                </Link>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.5rem" }}>◆</span>
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
    <section style={{ padding: "2.5rem 0", background: "#05152e" }}>
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
    <section style={{ padding: "2.5rem 0", background: "#071830" }}>
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
    <section style={{ padding: "2.5rem 0", background: "#05152e" }}>
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
    <div>
      <HeroSection posts={heroPosts} />
      <NewsTicker posts={latestPosts.slice(0, 10)} />
      <MostPopularCarousel posts={mostReadPosts} />
      <FeaturedNewsGrid posts={featuredToShow} />
      <LatestNewsSection posts={latestToShow} />
    </div>
  );
}
