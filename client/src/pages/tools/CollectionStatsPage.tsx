import { useState } from "react";
import { ExternalLink, Search, Twitter, Globe, BarChart2, Users, Package, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import ToolBreadcrumb from "@/components/ToolBreadcrumb";

const QUICK_COLLECTIONS = [
  { name: "hic et nunc", contract: "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton" },
  { name: "fxhash v1", contract: "KT1KEa8z6vWXDJrVqtMrAeDVzsvxoV85NxAp" },
  { name: "objkt.com Open", contract: "KT1Aq4wWmVanpQhq4TTfjZXB5AjFpx15iQMM" },
  { name: "Teia", contract: "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton" },
];

function formatXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toFixed(1);
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function CollectionStatsPage() {
  const [input, setInput] = useState('');
  const [contract, setContract] = useState('');

  useSEO({
    title: "Tezos Collection Stats | XTZ.News — Floor Price, Volume & Sales",
    description: "Enter any Tezos NFT collection contract address to see floor price, 24h volume, total volume, items, owners, and recent sales. Powered by objkt.com.",
    keywords: "Tezos NFT collection stats, objkt collection, floor price, NFT volume, Tezos collection analytics",
    canonical: "https://xtz.news/tools/collection-stats",
  });

  const { data: stats, isLoading, error } = trpc.tools.collectionStats.useQuery(
    { contract },
    { enabled: contract.length > 10, staleTime: 5 * 60_000 }
  );

  const handleSearch = () => {
    const trimmed = input.trim();
    if (trimmed.length > 10) setContract(trimmed);
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <ToolBreadcrumb items={[{ label: "Collection Stats" }]} />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "2rem 0 1.5rem" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <BarChart2 size={20} style={{ color: "#2c7df7" }} />
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 900, color: "#fff" }}>Collection Stats</h1>
          </div>
          <p style={{ margin: "0 0 1.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
            Enter any Tezos NFT collection contract address to see floor price, volume, and recent sales
          </p>

          {/* Search */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="KT1... collection contract address"
              style={{ flex: "1 1 300px", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "#fff", fontSize: "0.88rem", outline: "none", fontFamily: "inherit" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
            />
            <button onClick={handleSearch}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.75rem 1.5rem", background: "#2c7df7", border: "none", borderRadius: "4px", color: "#fff", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1a6ae0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2c7df7"; }}>
              <Search size={14} /> Lookup
            </button>
          </div>

          {/* Quick select */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.75rem" }}>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontWeight: 600, alignSelf: "center" }}>Quick:</span>
            {QUICK_COLLECTIONS.map((c) => (
              <button key={c.contract} onClick={() => { setInput(c.contract); setContract(c.contract); }}
                style={{ padding: "0.25rem 0.75rem", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "3px", color: "#2c7df7", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.2)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.1)"; }}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="skeleton" style={{ height: "120px", borderRadius: "8px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "6px" }} />)}
            </div>
          </div>
        )}

        {!isLoading && contract && !stats && (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Collection not found. Make sure the contract address is correct.</p>
          </div>
        )}

        {stats && (
          <div>
            {/* Collection header */}
            <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem", display: "flex", gap: "1.25rem", alignItems: "flex-start", flexWrap: "wrap" }}>
              {stats.logo ? (
                <img src={stats.logo} alt={stats.name || ''} style={{ width: "72px", height: "72px", borderRadius: "10px", objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div style={{ width: "72px", height: "72px", borderRadius: "10px", background: "rgba(44,125,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", flexShrink: 0 }}>🖼️</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                  <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 900, color: "#fff" }}>{stats.name || 'Unnamed Collection'}</h2>
                  {stats.collectionType && (
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "2px 8px", borderRadius: "3px", background: "rgba(44,125,247,0.15)", color: "#2c7df7", border: "1px solid rgba(44,125,247,0.3)" }}>
                      {stats.collectionType}
                    </span>
                  )}
                </div>
                {stats.description && (
                  <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{stats.description}</p>
                )}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                  {stats.creator && (
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>by <span style={{ color: "#2c7df7", fontWeight: 700 }}>{stats.creator}</span></span>
                  )}
                  {stats.twitter && (
                    <a href={stats.twitter.startsWith('http') ? stats.twitter : `https://twitter.com/${stats.twitter}`} target="_blank" rel="noopener noreferrer"
                      style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.15s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#1DA1F2"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
                      <Twitter size={14} />
                    </a>
                  )}
                  {stats.website && (
                    <a href={stats.website} target="_blank" rel="noopener noreferrer"
                      style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.15s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
                      <Globe size={14} />
                    </a>
                  )}
                  <a href={stats.objktUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.75rem", background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.4)", borderRadius: "4px", color: "#2c7df7", textDecoration: "none", fontSize: "0.7rem", fontWeight: 700 }}>
                    View on objkt <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.875rem", marginBottom: "1.5rem" }}>
              {[
                { icon: <TrendingUp size={16} />, label: "Floor Price", value: stats.floorPrice ? `${stats.floorPrice.toFixed(2)} ꜩ` : "—", color: "#22c55e" },
                { icon: <BarChart2 size={16} />, label: "24h Volume", value: `${formatXtz(stats.volume24h)} ꜩ`, color: "#2c7df7" },
                { icon: <BarChart2 size={16} />, label: "Total Volume", value: `${formatXtz(stats.volumeTotal)} ꜩ`, color: "#a78bfa" },
                { icon: <Package size={16} />, label: "Items", value: stats.items?.toLocaleString() || "—", color: "#f97316" },
                { icon: <Users size={16} />, label: "Owners", value: stats.owners?.toLocaleString() || "—", color: "#fbbf24" },
              ].map(({ icon, label, value, color }) => (
                <div key={label} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem", color }}>
                    {icon}
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>{label}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 900, color: "#fff" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Recent sales */}
            {stats.recentSales.length > 0 && (
              <div>
                <h3 style={{ margin: "0 0 1rem", fontSize: "0.88rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent Sales</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {stats.recentSales.map((sale: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.875rem", background: "#05152e", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {sale.thumbnailUri ? (
                        <img src={sale.thumbnailUri} alt={sale.tokenName} style={{ width: "36px", height: "36px", borderRadius: "4px", objectFit: "cover", flexShrink: 0 }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div style={{ width: "36px", height: "36px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sale.tokenName}</p>
                        {sale.seller && <p style={{ margin: "1px 0 0", fontSize: "0.62rem", color: "rgba(255,255,255,0.35)" }}>by {sale.seller}</p>}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 800, color: "#22c55e" }}>{sale.price.toFixed(1)} ꜩ</p>
                        <p style={{ margin: "1px 0 0", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)" }}>{timeAgo(sale.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!contract && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🖼️</div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Enter a Tezos collection contract address above</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.78rem" }}>Or click one of the quick-select collections to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
