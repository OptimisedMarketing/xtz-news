import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  }).toUpperCase();
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
}

// ─── Skeleton components shown instantly while data loads ─────────────────────
function HeroSkeleton() {
  return (
    <section style={{ background: "#000", display: "flex", minHeight: "511px" }}>
      <div style={{ flex: "0 0 67%", background: "#05152e", position: "relative", overflow: "hidden" }}>
        <div className="skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />
        <div style={{ position: "absolute", bottom: "2.5rem", left: "2rem", right: "2rem" }}>
          <div className="skeleton" style={{ height: "14px", width: "120px", marginBottom: "12px" }} />
          <div className="skeleton" style={{ height: "12px", width: "100px", marginBottom: "16px" }} />
          <div className="skeleton" style={{ height: "28px", width: "80%", marginBottom: "10px" }} />
          <div className="skeleton" style={{ height: "28px", width: "60%", marginBottom: "16px" }} />
          <div className="skeleton" style={{ height: "14px", width: "90%", marginBottom: "8px" }} />
          <div className="skeleton" style={{ height: "14px", width: "75%", marginBottom: "20px" }} />
          <div className="skeleton" style={{ height: "38px", width: "130px" }} />
        </div>
      </div>
      <div style={{ flex: "0 0 33%", background: "#000", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div className="skeleton" style={{ flex: 1, height: "44px", borderRadius: 0 }} />
          <div className="skeleton" style={{ flex: 1, height: "44px", borderRadius: 0, opacity: 0.5 }} />
        </div>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="skeleton" style={{ height: "14px", width: "90%", marginBottom: "8px" }} />
            <div className="skeleton" style={{ height: "14px", width: "70%" }} />
          </div>
        ))}
      </div>
    </section>
  );
}

function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${count}, 1fr)`, gap: "1rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ borderRadius: "4px", overflow: "hidden" }}>
          <div className="skeleton" style={{ height: "160px", borderRadius: 0 }} />
          <div style={{ padding: "1rem", background: "#05152e" }}>
            <div className="skeleton" style={{ height: "12px", width: "60px", marginBottom: "10px" }} />
            <div className="skeleton" style={{ height: "16px", width: "90%", marginBottom: "8px" }} />
            <div className="skeleton" style={{ height: "16px", width: "70%", marginBottom: "12px" }} />
            <div className="skeleton" style={{ height: "12px", width: "80px" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Hero + Tabs ──────────────────────────────────────────────────────────────
function HeroSection({ latestPosts, mostReadPosts }: { latestPosts: any[]; mostReadPosts: any[] }) {
  const [current, setCurrent] = useState(0);
  const [activeTab, setActiveTab] = useState<"latest" | "most-read">("latest");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % latestPosts.length), 7000);
  };

  useEffect(() => {
    if (latestPosts.length > 1) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [latestPosts.length]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  if (!latestPosts.length) return <HeroSkeleton />;

  const post = latestPosts[current];
  const primaryCat = post.categories?.[0];
  const sidebarPosts = activeTab === "latest" ? latestPosts.slice(0, 5) : mostReadPosts.slice(0, 5);

  return (
    <section style={{ background: "#000", padding: "0" }}>
      <div className="container" style={{ display: "flex", alignItems: "stretch", padding: "0 1.25rem", gap: 0 }}>
        {/* Hero slider */}
        <div style={{ flex: "0 0 67%", position: "relative", overflow: "hidden", minHeight: "511px" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            {post.featuredImageUrl ? (
              <img key={post.id} src={post.featuredImageUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#05152e" }} />
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.2) 100%)" }} />
          </div>

          {/* Category + share top-right */}
          <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", zIndex: 2 }}>
            {primaryCat && (
              <Link href={`/category/${primaryCat.slug}`} className="cat-tag">{primaryCat.name.toUpperCase()}</Link>
            )}
            <button style={{ background: "rgba(44,125,247,0.2)", border: "1px solid rgba(44,125,247,0.4)", color: "#2c7df7", width: "28px", height: "28px", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Share2 size={12} />
            </button>
          </div>

          {/* Article content */}
          <div style={{ position: "relative", zIndex: 2, padding: "2rem 2rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{ width: "3px", height: "18px", background: "#2c7df7", display: "inline-block", borderRadius: "1px", flexShrink: 0 }} />
              <span style={{ fontSize: "0.8rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>LATEST NEWS</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", background: "#2c7df7", color: "#fff", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "0px", marginBottom: "0.875rem", alignSelf: "flex-start" }}>
              {formatDate(post.publishedAt)}
            </div>
            <Link href={`/${post.slug}`} style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: "clamp(1.35rem, 2.2vw, 1.85rem)", fontWeight: 900, lineHeight: 1.25, color: "#fff", marginBottom: "0.875rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#2c7df7")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
              >
                {post.title}
              </h1>
            </Link>
            {post.excerpt && (
              <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "rgba(255,255,255,0.75)", marginBottom: "1.5rem", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {stripHtml(post.excerpt)}
              </p>
            )}
            <Link href={`/${post.slug}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.6rem 1.5rem", background: "#2c7df7", color: "#fff", border: "none", borderRadius: "2px", textDecoration: "none", alignSelf: "flex-start", transition: "background 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a6ae0")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c7df7")}
            >
              READ MORE ›
            </Link>
          </div>

          {/* Arrows */}
          {latestPosts.length > 1 && (
            <div style={{ position: "absolute", bottom: "1rem", right: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem", zIndex: 2 }}>
              <button onClick={() => goTo((current + 1) % latestPosts.length)} style={{ background: "#2c7df7", border: "none", color: "#fff", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "2px" }}><ChevronRight size={18} /></button>
              <button onClick={() => goTo((current - 1 + latestPosts.length) % latestPosts.length)} style={{ background: "#2c7df7", border: "none", color: "#fff", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "2px" }}><ChevronLeft size={18} /></button>
            </div>
          )}
        </div>

        {/* Tabs panel */}
        <div style={{ flex: "0 0 33%", display: "flex", flexDirection: "column", background: "#000", borderLeft: "1px solid rgba(255,255,255,0.1)", position: "relative", minHeight: "511px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.12)", flexShrink: 0 }}>
            {(["latest", "most-read"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ flex: 1, padding: "0.75rem 0.5rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", background: activeTab === tab ? "#2c7df7" : "transparent", border: "none", borderBottom: activeTab === tab ? "2px solid #2c7df7" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>
                {tab === "latest" ? "LATEST STORIES" : "MOST READ"}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {sidebarPosts.map((p, i) => (
              <div key={p.id} onClick={() => activeTab === "latest" && goTo(i)}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", background: (activeTab === "latest" && i === current) ? "rgba(44,125,247,0.08)" : "transparent", borderLeft: (activeTab === "latest" && i === current) ? "4px solid #2c7df7" : "4px solid transparent", transition: "background 0.2s", cursor: "pointer" }}
                onMouseEnter={(e) => { if (!(activeTab === "latest" && i === current)) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { if (!(activeTab === "latest" && i === current)) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <Link href={`/${p.slug}`} style={{ display: "block", padding: "1rem 1.25rem", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, lineHeight: 1.5, color: "#fff", margin: 0 }}>{p.title}</p>
                </Link>
              </div>
            ))}
          </div>
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
    <div style={{ background: "#123262", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "0.55rem 0", overflow: "hidden" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", background: "#2c7df7", color: "#fff", padding: "0.2rem 0.55rem", borderRadius: "2px", flexShrink: 0 }}>BREAKING</span>
        <div className="ticker-wrap" style={{ flex: 1 }}>
          <div className="ticker-content">
            {items.map((p, i) => (
              <span key={`${p.id}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", marginRight: "2rem" }}>
                <Link href={`/${p.slug}`} style={{ fontSize: "0.75rem", fontWeight: 400, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)")}
                >{p.title}</Link>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.4rem" }}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Most Popular ─────────────────────────────────────────────────────────────
function MostPopularCarousel({ posts }: { posts: any[] }) {
  const [start, setStart] = useState(0);
  const visible = 4;
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
        {posts.length === 0 ? <CardsSkeleton count={4} /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {posts.slice(start, start + visible).map((post) => <PostCard key={post.id} post={post} variant="default" />)}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Featured News ────────────────────────────────────────────────────────────
function FeaturedNewsGrid({ posts }: { posts: any[] }) {
  if (!posts.length) return (
    <section style={{ padding: "2.5rem 0", background: "#05152e" }}>
      <div className="container">
        <h2 className="section-title">FEATURED NEWS</h2>
        <CardsSkeleton count={3} />
      </div>
    </section>
  );
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

// ─── Latest News ──────────────────────────────────────────────────────────────
function LatestNewsSection({ posts }: { posts: any[] }) {
  return (
    <section style={{ padding: "2.5rem 0", background: "#000" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>LATEST NEWS</h2>
          <Link href="/category/latest-news" className="btn-read-more" style={{ fontSize: "0.65rem", padding: "0.4rem 1rem" }}>VIEW MORE</Link>
        </div>
        {posts.length === 0 ? <CardsSkeleton count={4} /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {posts.map((post) => <PostCard key={post.id} post={post} variant="default" />)}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  // Single combined query — one round trip instead of three
  const { data, isLoading } = trpc.posts.homepageData.useQuery(undefined, {
    staleTime: 60_000, // Cache for 1 minute
  });

  const latest = data?.latest ?? [];
  const mostRead = data?.mostRead ?? [];
  const featured = data?.featured ?? [];

  return (
    <div style={{ background: "#000" }}>
      {/* Show hero skeleton immediately while loading */}
      {isLoading ? <HeroSkeleton /> : <HeroSection latestPosts={latest} mostReadPosts={mostRead} />}

      {/* Ticker — show as soon as we have any posts */}
      <NewsTicker posts={latest.slice(0, 10)} />

      {/* Most Popular */}
      <MostPopularCarousel posts={mostRead} />

      {/* Featured News */}
      <FeaturedNewsGrid posts={featured} />

      {/* Latest News */}
      <LatestNewsSection posts={latest.slice(0, 8)} />
    </div>
  );
}
