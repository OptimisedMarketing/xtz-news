import { useState, useEffect, useCallback } from "react";
import { ExternalLink, RefreshCw, Clock, Gavel, TrendingDown, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import ToolBreadcrumb from "@/components/ToolBreadcrumb";

function useCountdown(endTime: string | null) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!endTime) { setRemaining("No end time"); return; }
    const update = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) { setRemaining("Ended"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (d > 0) setRemaining(`${d}d ${h}h ${m}m`);
      else if (h > 0) setRemaining(`${h}h ${m}m ${s}s`);
      else setRemaining(`${m}m ${s}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return remaining;
}

function AuctionCard({ auction }: { auction: any }) {
  const countdown = useCountdown(auction.endTime);
  const isEnding = auction.endTime && (new Date(auction.endTime).getTime() - Date.now()) < 3600000;
  const isEnded = auction.endTime && new Date(auction.endTime).getTime() < Date.now();

  return (
    <a href={auction.objktUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        background: "#05152e", border: `1px solid ${isEnding && !isEnded ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "8px", overflow: "hidden",
        transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
      }}
        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)"; }}
        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>

        {/* Thumbnail */}
        <div style={{ aspectRatio: "16/9", background: "#000", overflow: "hidden", position: "relative" }}>
          {auction.thumbnailUri ? (
            <img src={auction.thumbnailUri} alt={auction.tokenName} loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", opacity: 0.2 }}>🖼️</div>
          )}
          {/* Auction type badge */}
          <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", display: "flex", gap: "0.3rem" }}>
            <span style={{
              fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
              padding: "2px 7px", borderRadius: "2px",
              background: auction.type === 'english' ? "rgba(44,125,247,0.9)" : "rgba(124,58,237,0.9)",
              color: "#fff",
            }}>
              {auction.type === 'english' ? '🔨 English' : '📉 Dutch'}
            </span>
            {isEnding && !isEnded && (
              <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", padding: "2px 7px", borderRadius: "2px", background: "rgba(249,115,22,0.9)", color: "#fff" }}>
                ⚡ Ending Soon
              </span>
            )}
          </div>
          {/* Countdown */}
          <div style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", background: "rgba(0,0,0,0.8)", borderRadius: "3px", padding: "3px 8px", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Clock size={11} style={{ color: isEnding && !isEnded ? "#f97316" : "rgba(255,255,255,0.6)" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: isEnding && !isEnded ? "#f97316" : "rgba(255,255,255,0.8)", fontVariantNumeric: "tabular-nums" }}>
              {countdown}
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "0.875rem" }}>
          <h3 style={{ margin: "0 0 0.25rem", fontSize: "0.88rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {auction.tokenName}
          </h3>
          {auction.collectionName && (
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {auction.collectionName}
            </p>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ margin: "0 0 1px", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}>
                {auction.type === 'english' ? (auction.currentBid ? 'Current Bid' : 'Reserve') : 'Current Price'}
              </p>
              <p style={{ margin: 0, fontSize: "1rem", fontWeight: 900, color: "#fff" }}>
                {(auction.currentBid ?? auction.reserve ?? 0).toFixed(2)} <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>ꜩ</span>
              </p>
            </div>
            {auction.seller && (
              <p style={{ margin: 0, fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", textAlign: "right" }}>
                by {auction.seller}
              </p>
            )}
          </div>

          {auction.topBidder && (
            <p style={{ margin: "0.4rem 0 0", fontSize: "0.65rem", color: "#2c7df7" }}>
              Top bidder: {auction.topBidder}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}

export default function LiveAuctionTrackerPage() {
  const [auctionType, setAuctionType] = useState<'all' | 'english' | 'dutch'>('all');
  const [minBid, setMinBid] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useSEO({
    title: "Live Tezos Auction Tracker | XTZ.News — Active NFT Auctions",
    description: "Track all active Tezos NFT auctions in real time — English and Dutch auctions from objkt.com with live countdown timers, current bids, and thumbnail previews.",
    keywords: "Tezos NFT auction, objkt auction, Tezos English auction, Tezos Dutch auction, live NFT auction",
    canonical: "https://xtz.news/tools/auctions",
  });

  const { data: auctions = [], isLoading, refetch } = trpc.tools.liveAuctions.useQuery(
    { type: auctionType, limit: 40 },
    { staleTime: 30_000, refetchInterval: 60_000 }
  );

  const filteredAuctions = auctions.filter((a: any) => (a.currentBid ?? a.reserve ?? 0) >= minBid);

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
    refetch();
  }, [refetch]);

  const englishCount = auctions.filter((a: any) => a.type === 'english').length;
  const dutchCount = auctions.filter((a: any) => a.type === 'dutch').length;
  const endingSoon = auctions.filter((a: any) => a.endTime && (new Date(a.endTime).getTime() - Date.now()) < 3600000).length;

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <ToolBreadcrumb items={[{ label: "Live Auction Tracker" }]} />

      {/* Header */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "2rem 0 1.5rem" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                <Gavel size={20} style={{ color: "#2c7df7" }} />
                <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 900, color: "#fff" }}>Live Auction Tracker</h1>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
                All active Tezos NFT auctions from objkt.com — auto-refreshes every 60 seconds
              </p>
            </div>
            <button onClick={handleRefresh} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.4)", borderRadius: "4px", color: "#2c7df7", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, transition: "all 0.2s" }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", marginTop: "1.5rem" }}>
            {[
              { label: "Total Active", value: auctions.length, color: "#2c7df7" },
              { label: "English Auctions", value: englishCount, color: "#2c7df7", icon: <Gavel size={13} /> },
              { label: "Dutch Auctions", value: dutchCount, color: "#7c3aed", icon: <TrendingDown size={13} /> },
              { label: "Ending < 1hr", value: endingSoon, color: "#f97316" },
            ].map(({ label, value, color, icon }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "0.75rem 1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.2rem" }}>
                  {icon && <span style={{ color }}>{icon}</span>}
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>{label}</span>
                </div>
                <span style={{ fontSize: "1.5rem", fontWeight: 900, color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.75rem 0" }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
          <Filter size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {(['all', 'english', 'dutch'] as const).map((t) => (
              <button key={t} onClick={() => setAuctionType(t)}
                style={{ padding: "0.35rem 0.875rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, textTransform: "capitalize", cursor: "pointer", border: auctionType === t ? "1px solid #2c7df7" : "1px solid rgba(255,255,255,0.12)", background: auctionType === t ? "#2c7df7" : "transparent", color: auctionType === t ? "#fff" : "rgba(255,255,255,0.5)", transition: "all 0.15s" }}>
                {t === 'all' ? 'All Types' : t === 'english' ? '🔨 English' : '📉 Dutch'}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Min price:</span>
            <select value={minBid} onChange={(e) => setMinBid(Number(e.target.value))}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px", color: "#fff", padding: "0.35rem 0.5rem", fontSize: "0.75rem", cursor: "pointer" }}>
              <option value={0}>Any</option>
              <option value={1}>1+ ꜩ</option>
              <option value={5}>5+ ꜩ</option>
              <option value={10}>10+ ꜩ</option>
              <option value={50}>50+ ꜩ</option>
              <option value={100}>100+ ꜩ</option>
            </select>
          </div>
          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>{filteredAuctions.length} auctions</span>
        </div>
      </div>

      {/* Auction grid */}
      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "280px", borderRadius: "8px" }} />
            ))}
          </div>
        ) : filteredAuctions.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {filteredAuctions.map((auction: any) => (
              <AuctionCard key={`${auction.type}-${auction.id}`} auction={auction} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>No active auctions found matching your filters.</p>
            <a href="https://objkt.com/explore/auctions" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "1rem", color: "#2c7df7", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}>
              Browse auctions on objkt.com <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
