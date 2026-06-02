import { useState, useEffect } from "react";
import { ExternalLink, Trophy, Twitter, Globe, TrendingUp, X, ShoppingCart, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import ToolBreadcrumb from "@/components/ToolBreadcrumb";

function CollectorProfileModal({ collector, onClose }: { collector: any; onClose: () => void }) {
  const { data: purchases = [], isLoading } = trpc.tools.collectorProfile.useQuery(
    { address: collector.address, limit: 8 },
    { staleTime: 5 * 60_000 }
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const rankColor = getRankColor(collector.rank);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={onClose}>
      <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", width: "100%", maxWidth: "600px", maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: `${rankColor}20`, border: `2px solid ${rankColor}60`, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {collector.logo ? (
              <img src={collector.logo} alt={collector.alias || ''} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            ) : <span style={{ fontSize: "1.2rem" }}>🎨</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 900, color: "#fff" }}>
                {collector.alias || `${collector.address.slice(0, 8)}...${collector.address.slice(-4)}`}
              </h2>
              <span style={{ fontSize: "0.75rem" }}>{getRankEmoji(collector.rank) || `#${collector.rank}`}</span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: rankColor, fontWeight: 700 }}>
              {formatXtz(collector.volume)} ꜩ total spend
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {collector.twitter && (
              <a href={collector.twitter} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", transition: "color 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#1DA1F2"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}>
                <Twitter size={16} />
              </a>
            )}
            <a href={collector.objktUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.4rem 0.875rem", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: "4px", color: "#fbbf24", textDecoration: "none", fontSize: "0.72rem", fontWeight: 700 }}>
              objkt <ExternalLink size={11} />
            </a>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: "0.2rem", display: "flex", alignItems: "center", transition: "color 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Recent purchases */}
        <div style={{ padding: "1.25rem", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <ShoppingCart size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>Recent Purchases</span>
          </div>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "60px", borderRadius: "6px" }} />)}
            </div>
          ) : purchases.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {(purchases as any[]).map((p: any, i: number) => (
                <a key={i} href={p.objktUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}>
                    {p.thumbnailUri ? (
                      <img src={p.thumbnailUri} alt={p.tokenName} style={{ width: "40px", height: "40px", borderRadius: "4px", objectFit: "cover", flexShrink: 0 }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div style={{ width: "40px", height: "40px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🖼️</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.tokenName}</p>
                      {p.collectionName && <p style={{ margin: "1px 0 0", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.collectionName}</p>}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 800, color: "#fbbf24" }}>{p.price.toFixed(1)} ꜩ</p>
                      <p style={{ margin: "1px 0 0", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "0.2rem", justifyContent: "flex-end" }}>
                        <Clock size={9} /> {new Date(p.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", textAlign: "center", padding: "2rem 0" }}>No recent purchases found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function formatXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toFixed(0);
}

function getRankColor(rank: number) {
  if (rank === 1) return "#fbbf24"; // gold
  if (rank === 2) return "#94a3b8"; // silver
  if (rank === 3) return "#cd7c2f"; // bronze
  return "rgba(255,255,255,0.2)";
}

function getRankEmoji(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

export default function TopCollectorsPage() {
  const [period, setPeriod] = useState<'7' | '30' | 'all'>('30');
  const [tab, setTab] = useState<'collectors' | 'sellers' | 'collections'>('collectors');
  const [selectedCollector, setSelectedCollector] = useState<any>(null);
  const [collectionsSortBy, setCollectionsSortBy] = useState<'volume_total' | 'volume_24h' | 'items' | 'owners'>('volume_total');
  const [visibleCount, setVisibleCount] = useState(50);

  useSEO({
    title: "Top Tezos NFT Collectors, Sellers & Collections | XTZ.News",
    description: "Leaderboard of the top 1,000 Tezos NFT collectors, artists, and collections ranked by volume. Filter by 7d, 30d, or All Time. USD equivalents included.",
    keywords: "Tezos NFT collectors, Tezos NFT sellers, Tezos collections, objkt leaderboard, Tezos art",
    canonical: "https://xtz.news/tools/top-collectors",
  });

  const [showUsd, setShowUsd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: collectorsData, isLoading: collectorsLoading } = trpc.tools.topCollectors.useQuery(
    { period, limit: 1000 },
    { staleTime: 5 * 60_000, refetchInterval: 10 * 60_000 }
  );

  const { data: sellersData, isLoading: sellersLoading } = trpc.tools.topSellers.useQuery(
    { period, limit: 1000 },
    { staleTime: 5 * 60_000, refetchInterval: 10 * 60_000 }
  );

  const { data: collectionsData, isLoading: collectionsLoading } = trpc.tools.topCollections.useQuery(
    { sortBy: collectionsSortBy, limit: 1000 },
    { staleTime: 5 * 60_000, refetchInterval: 10 * 60_000 }
  );

  const activeData = tab === 'collectors' ? collectorsData : tab === 'sellers' ? sellersData : collectionsData;
  const xtzUsd = (activeData as any)?.xtzUsd || 0;
  const allResults: any[] = (activeData as any)?.results || [];
  const filteredResults = searchQuery.trim()
    ? allResults.filter((c: any) => {
        const q = searchQuery.toLowerCase();
        if (tab === 'collections') return (c.name || '').toLowerCase().includes(q) || c.contract.toLowerCase().includes(q);
        return (c.alias || '').toLowerCase().includes(q) || c.address.toLowerCase().includes(q);
      })
    : allResults;
  const isLoading = tab === 'collectors' ? collectorsLoading : tab === 'sellers' ? sellersLoading : collectionsLoading;
  const activeList = filteredResults.slice(0, visibleCount);
  const totalVolume = allResults.reduce((sum: number, c: any) => sum + (c.volume || c.volumeTotal || 0), 0);

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {selectedCollector && (
        <CollectorProfileModal collector={selectedCollector} onClose={() => setSelectedCollector(null)} />
      )}
      <ToolBreadcrumb items={[{ label: "Top Collectors" }]} />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #1a0a3e 100%)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "2rem 0 1.5rem" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                <Trophy size={20} style={{ color: "#fbbf24" }} />
                <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 900, color: "#fff" }}>Top {tab === 'collectors' ? 'Collectors' : 'Sellers'}</h1>
              </div>
              {/* Tab toggle */}
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <button onClick={() => setTab('collectors')}
                  style={{ padding: "0.4rem 1rem", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: tab === 'collectors' ? "1px solid #fbbf24" : "1px solid rgba(255,255,255,0.15)", background: tab === 'collectors' ? "rgba(251,191,36,0.15)" : "transparent", color: tab === 'collectors' ? "#fbbf24" : "rgba(255,255,255,0.5)", transition: "all 0.15s" }}>
                  🏆 Collectors
                </button>
                <button onClick={() => { setTab('sellers'); setVisibleCount(50); }}
                  style={{ padding: "0.4rem 1rem", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: tab === 'sellers' ? "1px solid #a78bfa" : "1px solid rgba(255,255,255,0.15)", background: tab === 'sellers' ? "rgba(167,139,250,0.15)" : "transparent", color: tab === 'sellers' ? "#a78bfa" : "rgba(255,255,255,0.5)", transition: "all 0.15s" }}>
                  🎨 Artists / Sellers
                </button>
                <button onClick={() => { setTab('collections'); setVisibleCount(50); }}
                  style={{ padding: "0.4rem 1rem", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: tab === 'collections' ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.15)", background: tab === 'collections' ? "rgba(34,197,94,0.15)" : "transparent", color: tab === 'collections' ? "#22c55e" : "rgba(255,255,255,0.5)", transition: "all 0.15s" }}>
                  🖼️ Collections
                </button>
              </div>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>
                {tab === 'collectors' ? 'Most active Tezos NFT collectors ranked by spend volume on objkt.com' : tab === 'sellers' ? 'Highest-earning Tezos artists ranked by sales volume on objkt.com' : 'Top Tezos NFT collections ranked by all-time volume, 24h volume, items, or owners'}
              </p>
              {tab === 'collections' && (
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  {([['volume_total', 'All-Time Vol'], ['volume_24h', '24h Vol'], ['items', 'Items'], ['owners', 'Owners']] as const).map(([val, label]) => (
                    <button key={val} onClick={() => { setCollectionsSortBy(val); setVisibleCount(50); }}
                      style={{ padding: "0.3rem 0.75rem", borderRadius: "3px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", border: collectionsSortBy === val ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.12)", background: collectionsSortBy === val ? "rgba(34,197,94,0.15)" : "transparent", color: collectionsSortBy === val ? "#22c55e" : "rgba(255,255,255,0.4)", transition: "all 0.15s" }}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Controls row */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              {/* Search */}
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or address..."
                style={{ flex: "1 1 200px", minWidth: "160px", padding: "0.45rem 0.75rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px", color: "#fff", fontSize: "0.8rem", outline: "none", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#fbbf24")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
              {/* USD toggle */}
              {xtzUsd > 0 && (
                <button onClick={() => setShowUsd(!showUsd)}
                  style={{ padding: "0.45rem 0.875rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", border: showUsd ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.15)", background: showUsd ? "rgba(34,197,94,0.15)" : "transparent", color: showUsd ? "#22c55e" : "rgba(255,255,255,0.5)", transition: "all 0.15s" }}>
                  {showUsd ? '$ USD' : 'ꜩ XTZ'}
                </button>
              )}
            </div>
            {/* Period selector */}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {([['7', '7d'], ['30', '30d'], ['all', 'All Time']] as const).map(([val, label]) => (
                <button key={val} onClick={() => setPeriod(val)}
                  style={{ padding: "0.5rem 1rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", border: period === val ? "1px solid #fbbf24" : "1px solid rgba(255,255,255,0.15)", background: period === val ? "rgba(251,191,36,0.15)" : "transparent", color: period === val ? "#fbbf24" : "rgba(255,255,255,0.5)", transition: "all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          {allResults.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", marginTop: "1.5rem" }}>
              {[
                { label: `${tab === 'collectors' ? 'Collectors' : 'Artists'} ranked`, value: allResults.length.toLocaleString() },
                { label: `Total volume (${period === 'all' ? 'all time' : period + 'd'})`, value: `${formatXtz(totalVolume)} ꜩ` },
                { label: `Top ${tab === 'collectors' ? 'collector' : 'artist'}`, value: allResults[0]?.alias || `${allResults[0]?.address?.slice(0, 8)}...` },
                { label: tab === 'collectors' ? 'Top spend' : 'Top earnings', value: showUsd && allResults[0]?.volumeUsd ? `$${(allResults[0].volumeUsd / 1000).toFixed(1)}K` : `${formatXtz(allResults[0]?.volume || 0)} ꜩ` },
                ...(xtzUsd > 0 ? [{ label: 'XTZ Price', value: `$${xtzUsd.toFixed(3)}` }] : []),
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "0.75rem 1.25rem" }}>
                  <p style={{ margin: "0 0 0.2rem", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>{label}</p>
                  <p style={{ margin: 0, fontSize: "1rem", fontWeight: 900, color: "#fff" }}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "72px", borderRadius: "8px" }} />
            ))}
          </div>
        ) : allResults.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {tab === 'collections' ? (
              (activeList as any[]).map((col: any) => {
                const rankColor = getRankColor(col.rank);
                const rankEmoji = getRankEmoji(col.rank);
                const vol = collectionsSortBy === 'volume_24h' ? col.volume24h : col.volumeTotal;
                const volUsd = collectionsSortBy === 'volume_24h' ? col.volume24hUsd : col.volumeTotalUsd;
                const maxVol = allResults[0] ? (collectionsSortBy === 'volume_24h' ? allResults[0].volume24h : allResults[0].volumeTotal) : 1;
                const barWidth = maxVol > 0 ? (vol / maxVol) * 100 : 0;
                return (
                  <a key={col.contract} href={col.objktUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ background: "#05152e", border: `1px solid ${col.rank <= 3 ? `${rankColor}30` : "rgba(255,255,255,0.07)"}`, borderRadius: "8px", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", transition: "transform 0.15s, border-color 0.15s", position: "relative", overflow: "hidden" }}
                      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateX(4px)"; el.style.borderColor = `${rankColor}60`; }}
                      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateX(0)"; el.style.borderColor = col.rank <= 3 ? `${rankColor}30` : "rgba(255,255,255,0.07)"; }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barWidth}%`, background: `${rankColor}08`, pointerEvents: "none" }} />
                      <div style={{ width: "2.5rem", flexShrink: 0, textAlign: "center" }}>
                        {rankEmoji ? <span style={{ fontSize: "1.3rem" }}>{rankEmoji}</span> : <span style={{ fontSize: "1rem", fontWeight: 900, color: rankColor }}>{col.rank}</span>}
                      </div>
                      <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: `${rankColor}20`, border: `2px solid ${rankColor}40`, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {col.logo ? <img src={col.logo} alt={col.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /> : <span style={{ fontSize: "1rem" }}>🖼️</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{col.name}</span>
                          {col.collectionType && <span style={{ fontSize: "0.58rem", fontWeight: 700, padding: "1px 6px", borderRadius: "2px", background: "rgba(34,197,94,0.15)", color: "#22c55e", flexShrink: 0 }}>{col.collectionType}</span>}
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "2px" }}>
                          <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{col.items?.toLocaleString()} items</span>
                          <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{col.owners?.toLocaleString()} owners</span>
                          {col.floorPrice && <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>Floor: {col.floorPrice.toFixed(2)} ꜩ</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ margin: 0, fontSize: "1rem", fontWeight: 900, color: rankColor }}>
                          {showUsd && volUsd ? `$${volUsd >= 1_000_000 ? (volUsd / 1_000_000).toFixed(1) + 'M' : volUsd >= 1000 ? (volUsd / 1000).toFixed(1) + 'K' : volUsd.toFixed(0)}` : `${formatXtz(vol)} ꜩ`}
                        </p>
                        <p style={{ margin: "1px 0 0", fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                          {collectionsSortBy === 'volume_24h' ? '24h vol' : collectionsSortBy === 'items' ? 'items' : collectionsSortBy === 'owners' ? 'owners' : 'total vol'}
                        </p>
                      </div>
                      <ExternalLink size={12} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                    </div>
                  </a>
                );
              })
            ) : (
            (activeList as any[]).map((collector: any) => {
              const rankColor = getRankColor(collector.rank);
              const rankEmoji = getRankEmoji(collector.rank);
              const barWidth = allResults.length > 0 && allResults[0].volume > 0 ? (collector.volume / allResults[0].volume) * 100 : 0;

              return (
                <div key={collector.address} onClick={() => setSelectedCollector(collector)}
                  style={{ cursor: "pointer" }}>
                  <div style={{
                    background: "#05152e", border: `1px solid ${collector.rank <= 3 ? `${rankColor}30` : "rgba(255,255,255,0.07)"}`,
                    borderRadius: "8px", padding: "0.875rem 1.25rem",
                    display: "flex", alignItems: "center", gap: "1rem",
                    transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
                    position: "relative", overflow: "hidden",
                  }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateX(4px)"; el.style.borderColor = `${rankColor}60`; el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)"; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateX(0)"; el.style.borderColor = collector.rank <= 3 ? `${rankColor}30` : "rgba(255,255,255,0.07)"; el.style.boxShadow = "none"; }}>

                    {/* Volume bar background */}
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barWidth}%`, background: `${rankColor}08`, pointerEvents: "none" }} />

                    {/* Rank */}
                    <div style={{ width: "2.5rem", flexShrink: 0, textAlign: "center" }}>
                      {rankEmoji ? (
                        <span style={{ fontSize: "1.3rem" }}>{rankEmoji}</span>
                      ) : (
                        <span style={{ fontSize: "1rem", fontWeight: 900, color: rankColor }}>{collector.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `${rankColor}20`, border: `2px solid ${rankColor}40`, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {collector.logo ? (
                        <img src={collector.logo} alt={collector.alias || ''} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <span style={{ fontSize: "1rem" }}>🎨</span>
                      )}
                    </div>

                    {/* Name & description */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <a href={collector.objktUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                          style={{ fontSize: "0.92rem", fontWeight: 800, color: "#fff", textDecoration: "none", transition: "color 0.15s" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = rankColor; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}>
                          {collector.alias || `${collector.address.slice(0, 8)}...${collector.address.slice(-4)}`}
                        </a>
                        {collector.twitter && (
                          <a href={collector.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                            style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.15s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#1DA1F2"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
                            <Twitter size={12} />
                          </a>
                        )}
                        {collector.website && (
                          <a href={collector.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                            style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.15s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
                            <Globe size={12} />
                          </a>
                        )}
                      </div>
                      {collector.description && (
                        <p style={{ margin: "1px 0 0", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {collector.description}
                        </p>
                      )}
                    </div>

                    {/* Volume */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: "1rem", fontWeight: 900, color: rankColor }}>
                        {showUsd && collector.volumeUsd
                          ? `$${collector.volumeUsd >= 1000 ? (collector.volumeUsd / 1000).toFixed(1) + 'K' : collector.volumeUsd.toFixed(0)}`
                          : `${formatXtz(collector.volume)} ꜩ`}
                      </p>
                      <p style={{ margin: "1px 0 0", fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                        {period === 'all' ? 'all time' : `${period}d`} {tab === 'collectors' ? 'spend' : 'earned'}
                      </p>
                    </div>

                    <ExternalLink size={12} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                  </div>
                </div>
              );
            }))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No data available.</p>
          </div>
        )}

        {/* Load More */}
        {filteredResults.length > visibleCount && (
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button onClick={() => setVisibleCount(v => v + 50)}
              style={{ padding: "0.75rem 2rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}>
              Load More ({filteredResults.length - visibleCount} remaining)
            </button>
          </div>
        )}
        {filteredResults.length > 0 && filteredResults.length <= visibleCount && filteredResults.length > 50 && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>Showing all {filteredResults.length.toLocaleString()} results</p>
          </div>
        )}

        <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", background: "rgba(255,255,255,0.03)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ margin: 0, fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
            <TrendingUp size={11} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
            Rankings based on total spend volume on objkt.com for the selected period. Data from the objkt.com public API. Updated every 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
