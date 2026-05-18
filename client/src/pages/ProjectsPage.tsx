import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ExternalLink, Search, Globe } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: projects = [], isLoading } = trpc.projects.all.useQuery({ category: "all" });

  const availableCategories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category).filter(Boolean));
    const ordered = ["DeFi","NFTs","Gaming","Dev Tools","Wallets","Stablecoins","Layer 2","Block Explorer","DAOs","Governance","Digital Identity","Baking Tools","Core Development","Foundation","Community","Privacy","Payments","Security Tokens","RWA","Web3 Infrastructure"];
    return ["All", ...ordered.filter((c) => cats.has(c)), ...Array.from(cats).filter((c) => !ordered.includes(c as string))];
  }, [projects]);

  const filtered = useMemo(() => {
    let result = [...projects];
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      if ((b as any).featured && !(a as any).featured) return 1;
      if ((a as any).featured && !(b as any).featured) return -1;
      return 0;
    });
    return result;
  }, [projects, activeCategory, searchQuery]);

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "3.5rem 0 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(44,125,247,0.8) 40px, rgba(44,125,247,0.8) 41px)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ width: "4px", height: "52px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0, lineHeight: 1 }}>Tezos Projects</h1>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", margin: "0.4rem 0 0" }}>
                {projects.length} verified live projects across the Tezos ecosystem
              </p>
            </div>
          </div>
          <div style={{ position: "relative", maxWidth: "400px", marginTop: "1.5rem" }}>
            <Search size={14} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", pointerEvents: "none" }} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects..."
              style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "#fff", fontSize: "0.85rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
              onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)")}
            />
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.08)", overflowX: "auto", scrollbarWidth: "none" }}>
        <div className="container" style={{ display: "flex", gap: "0.35rem", padding: "0.875rem 1.25rem", width: "max-content", minWidth: "100%" }}>
          {availableCategories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat as string)}
              style={{ padding: "0.4rem 0.875rem", borderRadius: "100px", border: activeCategory === cat ? "1px solid #2c7df7" : "1px solid rgba(255,255,255,0.12)", background: activeCategory === cat ? "#2c7df7" : "rgba(255,255,255,0.04)", color: activeCategory === cat ? "#fff" : "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ padding: "2.5rem 1.25rem 4rem" }}>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem", fontWeight: 600 }}>
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}{activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        </p>

        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 12 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "200px", borderRadius: "8px" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No projects found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {filtered.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        )}

        {/* Submit CTA */}
        <div style={{ marginTop: "3rem", padding: "2rem", background: "rgba(44,125,247,0.06)", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "8px", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", margin: "0 0 0.5rem" }}>Submit Your Project</h3>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", margin: "0 0 1.25rem", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
            Building on Tezos? Submit your project to be featured on XTZ.News. We only list projects actively building in the Tezos ecosystem.
          </p>
          <Link href="/submit-article" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem", background: "#2c7df7", borderRadius: "3px", color: "#fff", textDecoration: "none", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Submit a Project
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  const tags: string[] = (() => { try { return JSON.parse(project.tags || "[]"); } catch { return []; } })();

  return (
    <Link href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
      <article
        style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden", transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}
        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.borderColor = "rgba(44,125,247,0.4)"; el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.5)"; }}
        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.borderColor = "rgba(255,255,255,0.07)"; el.style.boxShadow = "none"; }}
      >
        <div style={{ height: "140px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          {project.featuredImageUrl ? (
            <img src={project.featuredImageUrl} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #05152e 0%, #123262 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={32} style={{ color: "rgba(44,125,247,0.4)" }} />
            </div>
          )}
          <div style={{ position: "absolute", top: "0.625rem", left: "0.625rem" }}>
            <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff", background: "rgba(44,125,247,0.85)", padding: "3px 8px", borderRadius: "2px" }}>{project.category}</span>
          </div>
          {project.featured && (
            <div style={{ position: "absolute", top: "0.625rem", right: "0.625rem" }}>
              <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#fff", background: "rgba(250,204,21,0.9)", padding: "3px 7px", borderRadius: "2px" }}>⭐ Featured</span>
            </div>
          )}
        </div>
        <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", margin: "0 0 0.5rem", lineHeight: 1.3 }}>{project.title}</h3>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: "0 0 0.875rem", flex: 1 }}>
            {project.excerpt || project.shortDescription || ""}
          </p>
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.875rem" }}>
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} style={{ fontSize: "0.6rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: "2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{tag}</span>
              ))}
            </div>
          )}
          {project.websiteUrl && (
            <a href={project.websiteUrl} target="_blank" rel="nofollow noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", fontWeight: 600, color: "#2c7df7", textDecoration: "none", marginTop: "auto" }}>
              <ExternalLink size={11} />Visit Website
            </a>
          )}
        </div>
      </article>
    </Link>
  );
}
