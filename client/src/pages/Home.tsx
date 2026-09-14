import { useState, useEffect, useRef } from "react";
import React from "react";
import { Link } from "wouter";
import { CheckCircle, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";
import ForYouFeed from "@/components/ForYouFeed";
import HomepageFilters from "@/components/HomepageFilters";
import TezosSystemsNetworkPulse from "@/components/TezosSystemsNetworkPulse";
import PostQuantumHomepageFeature from "@/components/PostQuantumHomepageFeature";
import WalletStarterHomepageFeature from "@/components/WalletStarterHomepageFeature";
import StakingStarterHomepageFeature from "@/components/StakingStarterHomepageFeature";
import ArtOnTezosHomepageFeature from "@/components/ArtOnTezosHomepageFeature";
import FirstPartyPromotion from "@/components/FirstPartyPromotion";
import { useSEO } from "@/hooks/useSEO";
import { getMediaUrl } from "@/lib/mediaUrl";
import { getNewsletterConfirmationCopy } from "@/lib/newsletterConfirmation";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  }).toUpperCase();
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <section style={{ background: "#000" }}>
      <div style={{ minHeight: "480px", background: "#05152e", position: "relative", overflow: "hidden" }}>
        <div className="skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />
        <div style={{ position: "absolute", bottom: "2rem", left: "1.25rem", right: "1.25rem" }}>
          <div className="skeleton" style={{ height: "14px", width: "120px", marginBottom: "12px" }} />
          <div className="skeleton" style={{ height: "12px", width: "100px", marginBottom: "16px" }} />
          <div className="skeleton" style={{ height: "28px", width: "85%", marginBottom: "8px" }} />
          <div className="skeleton" style={{ height: "28px", width: "65%", marginBottom: "16px" }} />
          <div className="skeleton" style={{ height: "38px", width: "130px" }} />
        </div>
      </div>
    </section>
  );
}

function CardsSkeleton({ count = 4, cols = 4 }: { count?: number; cols?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "1rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ borderRadius: "4px", overflow: "hidden" }}>
          <div className="skeleton" style={{ height: "160px", borderRadius: 0 }} />
          <div style={{ padding: "1rem", background: "#05152e" }}>
            <div className="skeleton" style={{ height: "12px", width: "60px", marginBottom: "10px" }} />
            <div className="skeleton" style={{ height: "16px", width: "90%", marginBottom: "8px" }} />
            <div className="skeleton" style={{ height: "16px", width: "70%", marginBottom: "12px" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
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
    <section style={{ background: "#000" }}>
      {/* Outer wrapper: black background fills full width */}
      {/* Inner container: constrained with side gutters like the original */}
      <div className="container" style={{ padding: "0 1.25rem" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>

        {/* ── Hero image area ── */}
        <div
          style={{ position: "relative", overflow: "hidden", minHeight: "480px", flex: "none" }}
          className="hero-image-area"
        >
          {/* Background */}
          <div style={{ position: "absolute", inset: 0 }}>
            {post.featuredImageUrl ? (
              <img key={post.id} src={getMediaUrl(post.featuredImageUrl)} alt={post.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#05152e" }} />
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.2) 100%)" }} />
          </div>

          {/* Category + share */}
          <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", zIndex: 2 }}>
            {primaryCat && (
              <Link href={`/category/${primaryCat.slug}`} className="cat-tag">{primaryCat.name.toUpperCase()}</Link>
            )}
            <button style={{ background: "rgba(44,125,247,0.2)", border: "1px solid rgba(44,125,247,0.4)", color: "#2c7df7", width: "28px", height: "28px", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Share2 size={12} />
            </button>
          </div>

          {/* Article content */}
          <div style={{ position: "relative", zIndex: 2, padding: "2rem 1.25rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{ width: "3px", height: "18px", background: "#2c7df7", display: "inline-block", borderRadius: "1px", flexShrink: 0 }} />
              <span style={{ fontSize: "0.8rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>LATEST NEWS</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", background: "#2c7df7", color: "#fff", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", marginBottom: "0.875rem", alignSelf: "flex-start" }}>
              {formatDate(post.publishedAt)}
            </div>
            <Link href={`/${post.slug}`} style={{ textDecoration: "none" }}>
              <h1
                style={{ fontSize: "clamp(1.4rem, 4vw, 1.85rem)", fontWeight: 900, lineHeight: 1.25, color: "#fff", marginBottom: "0.875rem", transition: "color 0.2s" }}
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
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.7rem 1.75rem", background: "#2c7df7", color: "#fff", border: "none", borderRadius: "2px", textDecoration: "none", alignSelf: "flex-start", transition: "background 0.2s" }}
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

        {/* ── Tabs panel — below hero on mobile, beside on desktop ── */}
        <div
          style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.1)" }}
          className="tabs-panel"
        >
          {/* Tab buttons */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
            {(["latest", "most-read"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ flex: 1, padding: "0.875rem 0.5rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", background: activeTab === tab ? "#2c7df7" : "transparent", border: "none", borderBottom: activeTab === tab ? "2px solid #2c7df7" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>
                {tab === "latest" ? "LATEST STORIES" : "MOST READ"}
              </button>
            ))}
          </div>
          {/* Article list */}
          <div>
            {sidebarPosts.map((p, i) => (
              <div key={p.id} onClick={() => activeTab === "latest" && goTo(i)}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: (activeTab === "latest" && i === current) ? "rgba(44,125,247,0.08)" : "transparent", borderLeft: (activeTab === "latest" && i === current) ? "4px solid #2c7df7" : "4px solid transparent", transition: "background 0.2s", cursor: "pointer" }}
                onMouseEnter={(e) => { if (!(activeTab === "latest" && i === current)) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { if (!(activeTab === "latest" && i === current)) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <Link href={`/${p.slug}`} style={{ display: "block", padding: "0.875rem 1.25rem", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.4, color: "#fff", margin: 0 }}>{p.title}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Responsive CSS for desktop layout */}
      <style>{`
        @media (min-width: 1024px) {
          section > div > div {
            flex-direction: row !important;
          }
          .hero-image-area {
            flex: 0 0 67% !important;
            min-height: 511px !important;
          }
          .tabs-panel {
            flex: 0 0 33% !important;
            border-top: none !important;
            border-left: 1px solid rgba(255,255,255,0.1) !important;
            min-height: 511px !important;
          }
        }
      `}</style>
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
                <Link href={`/${p.slug}`} style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", textDecoration: "none", transition: "color 0.2s" }}
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

// ─── NFT Sales Ticker ────────────────────────────────────────────────────────
function NftSalesTicker() {
  const { data: sales = [] } = trpc.tools.recentNftSales.useQuery(
    { limit: 15, minPrice: 1 },
    { staleTime: 30_000, refetchInterval: 60_000 }
  );
  if (!sales.length) return null;
  const items = [...sales, ...sales];
  return (
    <div style={{ background: "#0a0a1a", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.5rem 0", overflow: "hidden" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <span style={{ fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", background: "rgba(124,58,237,0.9)", color: "#fff", padding: "0.2rem 0.55rem", borderRadius: "2px", flexShrink: 0, whiteSpace: "nowrap" }}>NFT SALES</span>
        <div className="ticker-wrap" style={{ flex: 1 }}>
          <div className="ticker-content">
            {items.map((s: any, i: number) => (
              <a key={i} href={s.objktUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginRight: "2rem", textDecoration: "none" }}>
                {s.thumbnailUri && (
                  <img src={s.thumbnailUri} alt="" style={{ width: "18px", height: "18px", borderRadius: "2px", objectFit: "cover", flexShrink: 0 }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                )}
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap" }}>{s.tokenName}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 900, color: "#a78bfa", whiteSpace: "nowrap" }}>{s.price.toFixed(1)} ꜩ</span>
                <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.4rem" }}>◆</span>
              </a>
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
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const update = () => setCols(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const visible = cols;
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
        {posts.length === 0 ? <CardsSkeleton count={cols} cols={cols} /> : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "1rem" }}>
            {posts.slice(start, start + visible).map((post) => <PostCard key={post.id} post={post} variant="default" />)}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Featured News ────────────────────────────────────────────────────────────
function FeaturedNewsGrid({ posts }: { posts: any[] }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!posts.length) return (
    <section style={{ padding: "2.5rem 0", background: "#05152e" }}>
      <div className="container"><h2 className="section-title">FEATURED NEWS</h2><CardsSkeleton count={3} cols={isMobile ? 1 : 3} /></div>
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
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {posts.slice(0, 4).map((post) => <PostCard key={post.id} post={post} variant="default" />)}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
}

// ─── Latest News ──────────────────────────────────────────────────────────────
function TrendingNowWidget({ weekPosts, allTimePosts }: { weekPosts: any[]; allTimePosts: any[] }) {
  const [tab, setTab] = useState<"week" | "alltime">("week");
  const posts = tab === "week" ? weekPosts : allTimePosts;
  if (!weekPosts.length && !allTimePosts.length) return null;
  return (
    <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden", position: "sticky", top: "1rem" }}>
      <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f97316", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff" }}>Trending</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.3rem" }}>
          {(["week", "alltime"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "0.25rem 0.65rem", borderRadius: "3px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", border: tab === t ? "1px solid #f97316" : "1px solid rgba(255,255,255,0.12)", background: tab === t ? "rgba(249,115,22,0.15)" : "transparent", color: tab === t ? "#f97316" : "rgba(255,255,255,0.4)", transition: "all 0.15s" }}>
              {t === "week" ? "This Week" : "All Time"}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "0.5rem 0" }}>
        {posts.slice(0, 7).map((post, i) => (
          <Link key={post.id} href={`/${post.slug}`} style={{ textDecoration: "none", display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem 1.25rem", transition: "background 0.15s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            <span style={{ fontSize: "1.1rem", fontWeight: 900, color: i < 3 ? "#f97316" : "rgba(255,255,255,0.2)", flexShrink: 0, width: "1.5rem", lineHeight: 1.3 }}>{i + 1}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.title}</p>
              {post.categories?.[0] && (
                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#2c7df7", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.2rem", display: "block" }}>{post.categories[0].name}</span>
              )}
            </div>
            {post.viewCount > 0 && (
              <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", flexShrink: 0, fontWeight: 600 }}>{post.viewCount >= 1000 ? `${(post.viewCount / 1000).toFixed(1)}k` : post.viewCount}</span>
            )}
          </Link>
        ))}
      </div>
      <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/search" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2c7df7", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          View all trending →
        </Link>
      </div>
    </div>
  );
}

export function NewsletterCTABanner() {
  const [email, setEmail] = useState("");
  const previewSuccess = typeof window !== "undefined" && import.meta.env.DEV && new URLSearchParams(window.location.search).get("newsletterPreview") === "success";
  const [submitted, setSubmitted] = useState(previewSuccess);
  const [welcomeEmailRequested, setWelcomeEmailRequested] = useState(previewSuccess);
  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (result) => { setWelcomeEmailRequested(result.welcomeEmailRequested); setSubmitted(true); setEmail(""); },
  });
  const { data: countData } = trpc.newsletter.subscriberCount.useQuery(undefined, { staleTime: 5 * 60_000 });
  const count = typeof countData === "number" ? countData : 1026;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribeMutation.mutate({ email: email.trim(), govAlerts: false });
  };
  return (
    <section style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 60%, #05152e 100%)", borderTop: "1px solid rgba(44,125,247,0.2)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2.5rem 0" }}>
      <div className="container">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
          <div style={{ flex: "1 1 300px" }}>
            <p style={{ margin: "0 0 0.3rem", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2c7df7" }}>Free Newsletter</p>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "clamp(1.2rem, 3vw, 1.75rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>Stay ahead of Tezos</h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>Join {count.toLocaleString()}+ readers. Monthly digest on the first of each month.</p>
          </div>
          <div style={{ flex: "1 1 360px" }}>
            {submitted ? (
              <div className="newsletter-success-card" role="status" aria-live="polite" style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, rgba(44,125,247,0.24), rgba(99,247,177,0.16))", border: "1px solid rgba(99,247,177,0.42)", borderRadius: "7px", padding: "1rem 1.25rem", textAlign: "center" }}>
                <span className="newsletter-success-card__glow" aria-hidden="true" />
                <div style={{ position: "relative" }}>
                  <CheckCircle className="newsletter-success-card__icon" size={25} color="#63f7b1" aria-hidden="true" />
                  <p style={{ margin: "0.25rem 0", color: "#fff", fontWeight: 800 }}>{getNewsletterConfirmationCopy(welcomeEmailRequested).headline}</p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.74)", fontSize: "0.76rem", lineHeight: 1.5 }}>{getNewsletterConfirmationCopy(welcomeEmailRequested).description}</p>
                  <p style={{ margin: "0.4rem 0 0", color: "rgba(255,255,255,0.5)", fontSize: "0.68rem", lineHeight: 1.4 }}>{getNewsletterConfirmationCopy(welcomeEmailRequested).preferenceNote}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
                  style={{ flex: 1, padding: "0.75rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "#fff", fontSize: "0.88rem", outline: "none", fontFamily: "inherit" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")} />
                <button type="submit" disabled={subscribeMutation.isPending}
                  style={{ padding: "0.75rem 1.5rem", background: "#2c7df7", border: "none", borderRadius: "4px", color: "#fff", fontSize: "0.82rem", fontWeight: 700, cursor: subscribeMutation.isPending ? "not-allowed" : "pointer", whiteSpace: "nowrap", transition: "background 0.2s", opacity: subscribeMutation.isPending ? 0.7 : 1 }}
                  onMouseEnter={(e) => { if (!subscribeMutation.isPending) (e.currentTarget as HTMLElement).style.background = "#1a6ae0"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2c7df7"; }}>
                  {subscribeMutation.isPending ? "Subscribing…" : "Subscribe Free"}
                </button>
              </form>
            )}
            {subscribeMutation.isError && <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: "#ef4444" }}>Something went wrong. Please try again.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function LatestNewsSection({ posts, weekPosts, allTimePosts }: { posts: any[]; weekPosts: any[]; allTimePosts: any[] }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 900);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const visiblePosts = showAll ? posts : posts.slice(0, 8);
  return (
    <section style={{ padding: "2.5rem 0", background: "#000" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: "2rem", alignItems: "start" }}>
          {/* Main article grid */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>LATEST NEWS</h2>
              <Link href="/category/latest-news" className="btn-read-more" style={{ fontSize: "0.65rem", padding: "0.4rem 1rem" }}>VIEW MORE</Link>
            </div>
            {posts.length === 0 ? <CardsSkeleton count={isMobile ? 2 : 4} cols={isMobile ? 1 : 2} /> : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
                  {visiblePosts.map((post) => <PostCard key={post.id} post={post} variant="default" />)}
                </div>
                {/* Load More button */}
                {!showAll && posts.length > 8 && (
                  <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
                    <button onClick={() => setShowAll(true)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem", background: "transparent", border: "2px solid rgba(44,125,247,0.5)", borderRadius: "3px", color: "#2c7df7", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "#2c7df7"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.5)"; }}>
                      Load More Articles
                    </button>
                  </div>
                )}
                {showAll && (
                  <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <Link href="/category/latest-news" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2c7df7", textDecoration: "none" }}>View all latest news →</Link>
                  </div>
                )}
              </>
            )}
          </div>
          {/* Trending Now sidebar */}
          {!isMobile && <TrendingNowWidget weekPosts={weekPosts} allTimePosts={allTimePosts} />}
        </div>
        {/* Trending on mobile — below the grid */}
        {isMobile && (weekPosts.length > 0 || allTimePosts.length > 0) && (
          <div style={{ marginTop: "2rem" }}>
            <TrendingNowWidget weekPosts={weekPosts} allTimePosts={allTimePosts} />
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { data, isLoading } = trpc.posts.homepageData.useQuery(undefined, { staleTime: 60_000 });

  const latest = data?.latest ?? [];
  const mostRead = data?.mostRead ?? [];
  const featured = data?.featured ?? [];

  useSEO({
    title: "Tezos News | XTZ.News — Latest Tezos Blockchain Updates",
    description: "XTZ.News is the leading source for Tezos news. Get the latest Tezos blockchain updates, XTZ price, DeFi, NFTs, protocol upgrades, and ecosystem developments.",
    keywords: "Tezos news, XTZ news, Tezos blockchain, Tezos updates, XTZ price, Tezos DeFi, Tezos NFT, Tezos ecosystem, Tezos protocol upgrade",
    canonical: "https://xtz.news/",
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "XTZ.News",
        "url": "https://xtz.news",
        "description": "The leading source for Tezos blockchain news, XTZ price, DeFi, NFTs, and ecosystem developments.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": "https://xtz.news/search?q={search_term_string}" },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "XTZ.News",
        "url": "https://xtz.news",
        "logo": "https://xtz.news/manus-storage/xtz-logo-square_c6689606.png",
        "sameAs": ["https://twitter.com/XTZNews"]
      }
    ],
  });

  return (
    <div style={{ background: "#000" }}>
      {/* SEO: visually hidden H1 with primary keyword */}
      <h1 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
        Tezos News — Latest XTZ Blockchain Updates, DeFi, NFTs &amp; Ecosystem
      </h1>
      {isLoading ? <HeroSkeleton /> : <HeroSection latestPosts={latest} mostReadPosts={mostRead} />}
      <HomepageFilters />
      <WalletStarterHomepageFeature />
      <StakingStarterHomepageFeature />
      <ArtOnTezosHomepageFeature />
      <FirstPartyPromotion />
      <PostQuantumHomepageFeature />
      <TezosSystemsNetworkPulse />
      <LatestNewsSection posts={latest.slice(0, 8)} weekPosts={(data as any)?.trending ?? mostRead} allTimePosts={mostRead} />
      <ForYouFeed />
      <FeaturedNewsGrid posts={featured} />
      <MostPopularCarousel posts={mostRead} />
      <NewsletterCTABanner />
    </div>
  );
}
