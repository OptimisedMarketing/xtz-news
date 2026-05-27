import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, Tag, TrendingUp, AlignLeft, ArrowUpDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";

type SortOption = "popular" | "alphabetical" | "recent";

export default function CategoriesPage() {
  useSEO({
    title: "Tezos News Categories | XTZ.News — Browse by Topic",
    description: "Browse all Tezos news categories on XTZ.News. Find articles on Tezos DeFi, NFTs, gaming, stablecoins, wallets, adoption, protocol upgrades, and more.",
    keywords: "Tezos news categories, Tezos DeFi news, Tezos NFT news, Tezos gaming, Tezos stablecoins, Tezos adoption",
    canonical: "https://xtz.news/categories",
  });
  const { data: categories = [], isLoading } = trpc.categories.withImages.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const active = categories.filter((c) => (c.postCount ?? 0) > 0);

  const filtered = useMemo(() => {
    let result = [...active];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (sortBy === "popular") result.sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0));
    else if (sortBy === "alphabetical") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [active, searchQuery, sortBy]);

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: "popular", label: "Most Popular", icon: <TrendingUp size={13} /> },
    { value: "alphabetical", label: "A–Z", icon: <AlignLeft size={13} /> },
    { value: "recent", label: "Recently Added", icon: <ArrowUpDown size={13} /> },
  ];

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Page title header */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "3rem 0 1.5rem" }}>
        <div className="container">
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.02em", margin: 0 }}>
            ALL CATEGORIES
          </h1>
        </div>
      </div>

      {/* ── Sticky search + sort bar ── */}
      <div
        style={{
          position: "sticky",
          top: "140px", // below ticker (32px) + top bar (36px) + main header (72px)
          zIndex: 40,
          background: "#05152e",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "0.875rem 0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "0 0 260px" }}>
            <Search size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", pointerEvents: "none" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              style={{
                width: "100%",
                padding: "0.55rem 1rem 0.55rem 2.2rem",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "3px",
                color: "#fff",
                fontSize: "0.82rem",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
              onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)")}
            />
          </div>

          {/* Sort buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", marginRight: "0.2rem" }}>Sort:</span>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.3rem",
                  padding: "0.45rem 0.8rem",
                  fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                  background: sortBy === opt.value ? "#2c7df7" : "rgba(255,255,255,0.06)",
                  color: sortBy === opt.value ? "#fff" : "rgba(255,255,255,0.6)",
                  border: sortBy === opt.value ? "1px solid #2c7df7" : "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "3px", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { if (sortBy !== opt.value) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#fff"; } }}
                onMouseLeave={(e) => { if (sortBy !== opt.value) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; } }}
              >
                {opt.icon}{opt.label}
              </button>
            ))}
          </div>

          {/* Result count */}
          {!isLoading && (
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>
              {filtered.length} {filtered.length === 1 ? "category" : "categories"}
              {searchQuery ? ` for "${searchQuery}"` : ""}
            </span>
          )}
        </div>
      </div>

      {/* Category cards */}
      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 12 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "180px", borderRadius: "4px" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>No categories found</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
              No categories match &ldquo;{searchQuery}&rdquo;. Try a different search term.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              style={{ padding: "0.6rem 1.5rem", background: "#2c7df7", border: "none", borderRadius: "3px", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {filtered.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <article
                  style={{ position: "relative", height: "180px", borderRadius: "4px", overflow: "hidden", cursor: "pointer", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.6)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  {(cat as any).coverImage ? (
                    <img src={(cat as any).coverImage} alt={cat.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #05152e 0%, #123262 100%)" }} />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.1) 100%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                      <Tag size={10} style={{ color: "#2c7df7", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c7df7" }}>{cat.postCount} articles</span>
                    </div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.2, textTransform: "uppercase", letterSpacing: "0.03em" }}>{cat.name}</h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
