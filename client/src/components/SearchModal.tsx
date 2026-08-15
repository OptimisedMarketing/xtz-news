import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, X, ArrowRight, Clock, TrendingUp, Loader2, Boxes } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getMediaUrl } from "@/lib/mediaUrl";

interface SearchModalProps {
  onClose: () => void;
}

const RECENT_KEY = "xtz_recent_searches";

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]").slice(0, 5); } catch { return []; }
}
function saveRecent(q: string) {
  try {
    const prev = getRecent().filter((s) => s !== q);
    localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, 5)));
  } catch {}
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [recent, setRecent] = useState<string[]>(getRecent);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 60);
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: results, isLoading } = trpc.posts.searchAll.useQuery(
    { q: debounced, limit: 8 },
    { enabled: debounced.length >= 2 }
  );
  const posts = results?.posts ?? [];
  const projects = results?.projects ?? [];

  const go = (q: string) => {
    if (!q.trim()) return;
    saveRecent(q.trim());
    setRecent(getRecent());
    onClose();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const fmt = (d: Date | string | null | undefined) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

  const hasResults = debounced.length >= 2 && !isLoading && (posts.length > 0 || projects.length > 0);
  const noResults = debounced.length >= 2 && !isLoading && posts.length === 0 && projects.length === 0;
  const searchStatus = isLoading && debounced.length >= 2
    ? "Searching XTZ.News"
    : hasResults
      ? `${posts.length + projects.length} results found for ${debounced}`
      : noResults
        ? `No results found for ${debounced}`
        : "";

  return (
    <>
      {/* Backdrop */}
      <div aria-hidden="true" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", animation: "srFadeIn 0.15s ease" }} />

      {/* Panel */}
      <div role="dialog" aria-modal="true" aria-labelledby="site-search-title" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, background: "#05152e", borderBottom: "1px solid rgba(44,125,247,0.3)", boxShadow: "0 24px 64px rgba(0,0,0,0.7)", animation: "srSlideDown 0.2s cubic-bezier(0.23,1,0.32,1)", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        <h2 id="site-search-title" className="sr-only">Search XTZ.News</h2>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{searchStatus}</p>

        {/* Input row */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color: isLoading ? "#2c7df7" : "rgba(255,255,255,0.4)", flexShrink: 0, transition: "color 0.2s" }}>
            {isLoading ? <Loader2 size={22} style={{ animation: "srSpin 0.8s linear infinite" }} /> : <Search size={22} />}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go(query)}
            placeholder="Search articles, projects, categories..."
            aria-label="Search articles, projects, and categories"
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: "1.15rem", fontFamily: "inherit", fontWeight: 500 }}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search query" style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)", flexShrink: 0, transition: "all 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
            ><X size={14} /></button>
          )}
          <button onClick={onClose} aria-label="Close search" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "0.3rem 0.6rem", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0, transition: "all 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
          ><X size={11} /> ESC</button>
        </div>

        {/* Scrollable results area */}
        <div style={{ overflowY: "auto", flex: 1 }}>

          {/* Loading skeleton */}
          {isLoading && debounced.length >= 2 && (
            <div style={{ padding: "1rem 1.5rem" }}>
              <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", margin: "0 0 0.75rem" }}>Searching...</p>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.7rem 0.75rem", marginBottom: "0.25rem" }}>
                  <div style={{ width: "54px", height: "40px", borderRadius: "4px", background: "linear-gradient(90deg, #0a1f3d 25%, #123262 50%, #0a1f3d 75%)", backgroundSize: "200% 100%", animation: "srShimmer 1.4s infinite", flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <div style={{ height: "14px", borderRadius: "3px", background: "linear-gradient(90deg, #0a1f3d 25%, #123262 50%, #0a1f3d 75%)", backgroundSize: "200% 100%", animation: "srShimmer 1.4s infinite", width: `${70 + (i * 7) % 25}%` }} />
                    <div style={{ height: "10px", borderRadius: "3px", background: "linear-gradient(90deg, #0a1f3d 25%, #123262 50%, #0a1f3d 75%)", backgroundSize: "200% 100%", animation: "srShimmer 1.4s infinite", width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Live results */}
          {hasResults && (
            <div style={{ padding: "1rem 1.5rem" }}>
              <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", margin: "0 0 0.75rem" }}>
                {posts.length + projects.length} result{posts.length + projects.length !== 1 ? "s" : ""} for "{debounced}"
              </p>
              {posts.map((post: any) => (
                <Link key={post.id} href={`/${post.slug}`} onClick={() => { saveRecent(query); onClose(); }} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.7rem 0.75rem", borderRadius: "6px", transition: "background 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.08)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <div style={{ width: "54px", height: "40px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, background: "#0a1f3d" }}>
                    {post.featuredImageUrl && <img src={getMediaUrl(post.featuredImageUrl)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.2rem" }}>
                      {post.categories?.[0] && <span style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#2c7df7", background: "rgba(44,125,247,0.1)", padding: "1px 5px", borderRadius: "2px" }}>{post.categories[0].name}</span>}
                      <span style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.3)" }}>{fmt(post.publishedAt)}</span>
                    </div>
                  </div>
                  <ArrowRight size={13} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                </Link>
              ))}
              {projects.length > 0 && (
                <>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", margin: "1.1rem 0 0.55rem", display: "flex", alignItems: "center", gap: "0.35rem" }}><Boxes size={11} /> Tezos projects</p>
                  {projects.map((project: any) => (
                    <Link key={project.id} href={`/projects/${project.slug}`} onClick={() => { saveRecent(query); onClose(); }} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.7rem 0.75rem", borderRadius: "6px", transition: "background 0.15s" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.08)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                      <div style={{ width: "54px", height: "40px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, background: "#0a1f3d", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a9fff" }}>
                        {project.logoUrl ? <img src={project.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Boxes size={18} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.title}</p>
                        <span style={{ display: "inline-block", marginTop: "0.2rem", fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#2c7df7", background: "rgba(44,125,247,0.1)", padding: "1px 5px", borderRadius: "2px" }}>Project</span>
                      </div>
                      <ArrowRight size={13} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                    </Link>
                  ))}
                </>
              )}
              <button onClick={() => go(query)} style={{ width: "100%", marginTop: "0.5rem", padding: "0.7rem", background: "rgba(44,125,247,0.07)", border: "1px solid rgba(44,125,247,0.18)", borderRadius: "6px", color: "#2c7df7", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2c7df7"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.07)"; (e.currentTarget as HTMLElement).style.color = "#2c7df7"; }}
              >View all results for "{debounced}" <ArrowRight size={13} /></button>
            </div>
          )}

          {/* No results */}
          {noResults && (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", margin: "0 0 0.4rem" }}>No results for "{debounced}"</p>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)", margin: 0 }}>Try different keywords or browse below</p>
            </div>
          )}

          {/* Default: recent + popular */}
          {debounced.length < 2 && (
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {recent.length > 0 && (
                <div>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Clock size={11} /> Recent Searches
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {recent.map((s) => (
                      <button key={s} onClick={() => { setQuery(s); setDebounced(s); }}
                        style={{ padding: "0.4rem 0.875rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.3)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <TrendingUp size={11} /> Popular Topics
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {["Etherlink", "DeFi", "NFT", "QuipuSwap", "Youves", "Governance", "Staking", "TzEL", "Tezos X", "Gaming", "Adoption", "Wallets"].map((t) => (
                    <button key={t} onClick={() => { setQuery(t); setDebounced(t); }}
                      style={{ padding: "0.4rem 0.875rem", background: "rgba(44,125,247,0.07)", border: "1px solid rgba(44,125,247,0.18)", borderRadius: "100px", color: "#2c7df7", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2c7df7"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.07)"; (e.currentTarget as HTMLElement).style.color = "#2c7df7"; }}
                    >{t}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "0.625rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {[["↵", "to search"], ["ESC", "to close"]].map(([key, label]) => (
            <span key={key} style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <kbd style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px", padding: "1px 5px", fontSize: "0.58rem", fontFamily: "inherit" }}>{key}</kbd>
              {label}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes srFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes srSlideDown { from { transform:translateY(-16px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        @keyframes srSpin { to { transform:rotate(360deg) } }
        @keyframes srShimmer { 0% { background-position:200% 0 } 100% { background-position:-200% 0 } }
      `}</style>
    </>
  );
}
