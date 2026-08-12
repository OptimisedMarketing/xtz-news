import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import { getMediaUrl } from "@/lib/mediaUrl";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getYear(d: Date | string | null | undefined) { return d ? new Date(d).getFullYear() : 0; }
function getMonth(d: Date | string | null | undefined) { return d ? new Date(d).getMonth() : -1; } // 0-indexed

export default function TimelinePage() {
  useSEO({
    title: "Tezos News Timeline | XTZ.News — Tezos Blockchain History",
    description: "Browse the complete history of Tezos news chronologically. Explore Tezos protocol upgrades, ecosystem milestones, DeFi launches, NFT events, and XTZ developments by month and year.",
    keywords: "Tezos timeline, Tezos history, Tezos protocol upgrades, Tezos milestones, XTZ blockchain history",
    canonical: "https://xtz.news/timeline",
  });
  const { data: allPosts = [], isLoading } = trpc.posts.timeline.useQuery({ limit: 1000 });
  const { data: categories = [] } = trpc.categories.all.useQuery();

  // Derive available years
  const years = useMemo(() => {
    const s = new Set<number>();
    allPosts.forEach(p => { const y = getYear(p.publishedAt); if (y > 0) s.add(y); });
    return Array.from(s).sort((a, b) => b - a);
  }, [allPosts]);

  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth());
  const [timePeriod, setTimePeriod] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Set default year to most recent year with content
  useEffect(() => {
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  }, [years]);

  // Available months for selected year
  const monthsWithContent = useMemo(() => {
    const s = new Set<number>();
    allPosts.forEach(p => {
      if (getYear(p.publishedAt) === selectedYear) s.add(getMonth(p.publishedAt));
    });
    return s;
  }, [allPosts, selectedYear]);

  // Auto-select first month with content when year changes
  useEffect(() => {
    if (monthsWithContent.size > 0 && !monthsWithContent.has(selectedMonth)) {
      const first = Math.min(...Array.from(monthsWithContent));
      setSelectedMonth(first);
    }
  }, [selectedYear, monthsWithContent]);

  // Filter posts for selected year + month + filters
  const filteredPosts = useMemo(() => {
    let posts = allPosts.filter(p =>
      getYear(p.publishedAt) === selectedYear &&
      getMonth(p.publishedAt) === selectedMonth
    );

    // Time period filter
    if (timePeriod !== "all") {
      const now = Date.now();
      const cutoff = timePeriod === "week" ? now - 7*86400000
        : timePeriod === "month" ? now - 30*86400000
        : now - 365*86400000;
      posts = posts.filter(p => p.publishedAt && new Date(p.publishedAt).getTime() >= cutoff);
    }

    // Category filter
    if (selectedCategory !== "all") {
      posts = posts.filter(p => p.categories?.some((c: any) => c.slug === selectedCategory));
    }

    return posts;
  }, [allPosts, selectedYear, selectedMonth, timePeriod, selectedCategory]);

  const prevYear = years.find(y => y < selectedYear);
  const nextYear = years.find(y => y > selectedYear);

  const monthScrollRef = useRef<HTMLDivElement>(null);

  // Scroll active month into view
  useEffect(() => {
    const el = monthScrollRef.current?.querySelector(`[data-month="${selectedMonth}"]`) as HTMLElement;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedMonth]);

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        position: "relative",
        minHeight: "280px",
        background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 100%), url('https://xtz.news/wp-content/uploads/2023/08/hero-bg-4.jpg') center/cover no-repeat",
        display: "flex",
        alignItems: "flex-end",
        padding: "0 0 2.5rem",
      }}>
        <div className="container">
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 1rem" }}>
            News Timeline
          </h1>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", maxWidth: "600px", lineHeight: 1.7, margin: 0 }}>
            Welcome to XTZ News timeline, your dedicated source for all things Tezos. Our chronologically ordered timeline provides you with a comprehensive view of Tezos' news history, from its latest innovations to significant milestones. We aim to serve our readers with up-to-date news, thought-provoking articles, and in-depth analysis. Dive into our archives or stay current with our latest updates, all through this timeline.
          </p>
        </div>
      </div>

      {/* Year navigation + month tabs */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)",           padding: "1.5rem 0 0", position: "sticky", top: "140px", zIndex: 30 }}>
        <div className="container">
          {/* Year row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            {/* Prev year */}
            {nextYear ? (
              <button onClick={() => setSelectedYear(nextYear)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "1rem", fontWeight: 700, cursor: "pointer", padding: "0.25rem 0.5rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
              >
                <ChevronLeft size={16} /> {nextYear}
              </button>
            ) : <div style={{ width: "80px" }} />}

            {/* Current year */}
            <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "0.04em" }}>
              {selectedYear}
            </h2>

            {/* Next year */}
            {prevYear ? (
              <button onClick={() => setSelectedYear(prevYear)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "1rem", fontWeight: 700, cursor: "pointer", padding: "0.25rem 0.5rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
              >
                {prevYear} <ChevronRight size={16} />
              </button>
            ) : <div style={{ width: "80px" }} />}
          </div>

          {/* Month tabs */}
          <div ref={monthScrollRef} style={{ display: "flex", overflowX: "auto", gap: 0, scrollbarWidth: "none", msOverflowStyle: "none", position: "relative" }}>
            {MONTHS.map((month, idx) => {
              const hasContent = monthsWithContent.has(idx);
              const isActive = idx === selectedMonth;
              return (
                <button
                  key={month}
                  data-month={idx}
                  onClick={() => hasContent && setSelectedMonth(idx)}
                  disabled={!hasContent}
                  style={{
                    flex: "0 0 auto",
                    padding: "0.6rem 1rem",
                    background: "none",
                    border: "none",
                    borderBottom: isActive ? "3px solid #2c7df7" : "3px solid transparent",
                    color: isActive ? "#fff" : hasContent ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                    fontSize: "0.85rem",
                    fontWeight: isActive ? 700 : 500,
                    cursor: hasContent ? "pointer" : "default",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => { if (hasContent && !isActive) (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = hasContent ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)"; }}
                >
                  {month}
                  {/* Blue dot under active month */}
                  {isActive && (
                    <div style={{ position: "absolute", bottom: "-5px", left: "50%", transform: "translateX(-50%)", width: "8px", height: "8px", borderRadius: "50%", background: "#2c7df7", border: "2px solid #05152e" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="container" style={{ padding: "2.5rem 1.25rem 4rem" }}>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "280px", borderRadius: "6px" }} />)}
          </div>
        ) : (
          <>
            {/* Month + filter header */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem", paddingBottom: "1.25rem", borderBottom: "3px solid #2c7df7" }}>
              <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>
                {MONTHS[selectedMonth]} {selectedYear}
              </h2>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  style={{ padding: "0.5rem 1rem", background: "#2c7df7", border: "none", borderRadius: "3px", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", outline: "none" }}
                >
                  <option value="all">Time Period</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ padding: "0.5rem 1rem", background: "#2c7df7", border: "none", borderRadius: "3px", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", outline: "none", maxWidth: "160px" }}
                >
                  <option value="all">Category</option>
                  {categories.filter((c) => (c.postCount ?? 0) >= 5).map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Article grid */}
            {filteredPosts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p style={{ color: "rgba(255,255,255,0.4)" }}>No articles found for {MONTHS[selectedMonth]} {selectedYear}.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
                {filteredPosts.map((post) => {
                  const cats = post.categories ?? [];
                  return (
                    <Link key={post.id} href={`/${post.slug}`} style={{ textDecoration: "none" }}>
                      <article
                        style={{
                          position: "relative",
                          borderRadius: "6px",
                          overflow: "hidden",
                          background: "#05152e",
                          border: "1px solid rgba(255,255,255,0.07)",
                          height: "100%",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.5)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                      >
                        {/* Featured image */}
                        {post.featuredImageUrl ? (
                          <div style={{ height: "200px", overflow: "hidden" }}>
                            <img src={getMediaUrl(post.featuredImageUrl)} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")} />
                          </div>
                        ) : (
                          <div style={{ height: "200px", background: "linear-gradient(135deg, #05152e 0%, #123262 100%)" }} />
                        )}

                        {/* Category tags + share button overlay */}
                        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", right: "0.75rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                            {cats.slice(0, 2).map((cat: any) => (
                              <span key={cat.id} style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#fff", background: "rgba(0,0,0,0.6)", padding: "3px 8px", borderRadius: "2px", backdropFilter: "blur(4px)" }}>
                                {cat.name}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={(e) => e.preventDefault()}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(44,125,247,0.8)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                          >
                            <Share2 size={12} />
                          </button>
                        </div>

                        {/* Title */}
                        <div style={{ padding: "1rem" }}>
                          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", lineHeight: 1.45, margin: 0 }}>
                            {post.title}
                          </h3>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
