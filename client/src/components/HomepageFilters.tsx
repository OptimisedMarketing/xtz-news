import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function HomepageFilters() {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();
  const { data: categories = [] } = trpc.categories.all.useQuery();

  // Top categories by post count
  const topCats = categories
    .filter((c) => (c.postCount ?? 0) >= 5)
    .slice(0, 10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1rem 0" }}>
      <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ position: "relative", flex: "0 0 280px" }}>
          <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", pointerEvents: "none" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            style={{
              width: "100%",
              padding: "0.55rem 1rem 0.55rem 2.25rem",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "3px",
              color: "#fff",
              fontSize: "0.8rem",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
            onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")}
          />
        </form>

        {/* Divider */}
        <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

        {/* Category pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", flex: 1 }}>
          {topCats.map((cat) => (
            <a
              key={cat.id}
              href={`/category/${cat.slug}`}
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "0.3rem 0.7rem",
                borderRadius: "2px",
                background: "rgba(44,125,247,0.1)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(44,125,247,0.2)",
                textDecoration: "none",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#2c7df7";
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.borderColor = "#2c7df7";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.1)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.2)";
              }}
            >
              {cat.name}
            </a>
          ))}
          <a
            href="/categories"
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "0.3rem 0.7rem",
              borderRadius: "2px",
              background: "transparent",
              color: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.12)",
              textDecoration: "none",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            All Categories →
          </a>
        </div>
      </div>
    </div>
  );
}
