import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, Layers, ArrowRightLeft, TrendingUp, TrendingDown, Users, Zap, Shield, ExternalLink, RefreshCw, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";

function formatXtz(v: number, decimals = 2) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K ꜩ`;
  return `${v.toFixed(decimals)} ꜩ`;
}
function formatUsd(v: number) {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  return `$${v.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}
function timeAgo(ts: string) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
function shortHash(h: string, len = 8) {
  if (!h) return "";
  return `${h.slice(0, len)}...${h.slice(-4)}`;
}

export default function ExplorerPage() {
  useSEO({
    title: "Tezos Blockchain Explorer | XTZ.News — Blocks, Transactions & Addresses",
    description: "Explore the Tezos blockchain live. Search blocks, transactions, addresses, bakers, and token transfers on the XTZ.News Tezos explorer.",
    keywords: "Tezos explorer, Tezos blockchain explorer, XTZ explorer, Tezos blocks, Tezos transactions, Tezos address lookup",
    canonical: "https://xtz.news/explorer",
  });

  const [, navigate] = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: stats, refetch: refetchStats } = trpc.explorer.networkStats.useQuery(undefined, {
    staleTime: 30_000,
    refetchInterval: autoRefresh ? 30_000 : false,
  });
  const { data: blocks = [], refetch: refetchBlocks } = trpc.explorer.latestBlocks.useQuery({ limit: 10 }, {
    staleTime: 15_000,
    refetchInterval: autoRefresh ? 15_000 : false,
  });
  const { data: txs = [], refetch: refetchTxs } = trpc.explorer.latestTransactions.useQuery({ limit: 10 }, {
    staleTime: 15_000,
    refetchInterval: autoRefresh ? 15_000 : false,
  });
  const { data: tokenTransfers = [] } = trpc.explorer.tokenTransfers.useQuery({ limit: 8 }, {
    staleTime: 30_000,
    refetchInterval: autoRefresh ? 30_000 : false,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    if (/^\d+$/.test(q)) { navigate(`/explorer/block/${q}`); return; }
    if (q.startsWith("B") && q.length > 30) { navigate(`/explorer/block/${q}`); return; }
    if (q.startsWith("o") && q.length > 30) { navigate(`/explorer/tx/${q}`); return; }
    if (/^(tz1|tz2|tz3|KT1)/.test(q)) { navigate(`/explorer/address/${q}`); return; }
    alert("Unknown search query. Try a block level, tx hash, or address.");
  };

  const statCards = stats ? [
    { label: "Block Height", value: stats.level.toLocaleString(), icon: <Layers size={18} />, color: "#2c7df7" },
    { label: "Cycle", value: stats.cycle.toLocaleString(), icon: <RefreshCw size={18} />, color: "#8b5cf6" },
    { label: "XTZ Price", value: `$${stats.xtzUsd.toFixed(4)}`, sub: `${stats.priceChange24h >= 0 ? "+" : ""}${stats.priceChange24h.toFixed(2)}% 24h`, subColor: stats.priceChange24h >= 0 ? "#22c55e" : "#ef4444", icon: stats.priceChange24h >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />, color: stats.priceChange24h >= 0 ? "#22c55e" : "#ef4444" },
    { label: "Market Cap", value: formatUsd(stats.marketCap), icon: <TrendingUp size={18} />, color: "#f59e0b" },
    { label: "Total Supply", value: formatXtz(stats.totalSupply, 0), icon: <Zap size={18} />, color: "#06b6d4" },
    { label: "Circulating", value: formatXtz(stats.circulatingSupply, 0), icon: <Zap size={18} />, color: "#10b981" },
    { label: "Active Bakers", value: stats.totalBakers.toLocaleString(), icon: <Shield size={18} />, color: "#f97316" },
    { label: "Delegators", value: stats.totalDelegators.toLocaleString(), icon: <Users size={18} />, color: "#ec4899" },
  ] : [];

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero + Search */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "3rem 0 2.5rem" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Live · Tezos Mainnet</span>
            <button onClick={() => { refetchStats(); refetchBlocks(); refetchTxs(); }} style={{ marginLeft: "auto", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", padding: "0.3rem 0.75rem", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <RefreshCw size={11} /> Refresh
            </button>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#fff", margin: "0 0 0.5rem", lineHeight: 1.1 }}>
            Tezos Explorer
          </h1>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", margin: "0 0 2rem" }}>
            Search blocks, transactions, addresses, and bakers on the Tezos blockchain
          </p>
          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0", maxWidth: "680px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", pointerEvents: "none" }} />
              <input
                ref={inputRef}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Block level, tx hash (o...), address (tz1/KT1), baker..."
                style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRight: "none", borderRadius: "4px 0 0 4px", color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
              />
            </div>
            <button type="submit" style={{ padding: "0 1.5rem", background: "#2c7df7", border: "none", borderRadius: "0 4px 4px 0", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap" }}>
              Search
            </button>
          </form>
          {/* Quick links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
            {[
              { label: "Latest Blocks", href: "/explorer" },
              { label: "Baker Leaderboard", href: "/explorer/bakers" },
              { label: "Token Transfers", href: "/explorer" },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "0.25rem 0.75rem", textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.4)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
          {statCards.map(card => (
            <div key={card.label} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <span style={{ color: card.color }}>{card.icon}</span>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{card.label}</span>
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{card.value}</div>
              {card.sub && <div style={{ fontSize: "0.72rem", fontWeight: 700, color: card.subColor, marginTop: "0.25rem" }}>{card.sub}</div>}
            </div>
          ))}
          {!stats && Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "1rem" }}>
              <div className="skeleton" style={{ height: "10px", width: "80px", marginBottom: "10px" }} />
              <div className="skeleton" style={{ height: "20px", width: "100px" }} />
            </div>
          ))}
        </div>

        {/* Two-column: blocks + txs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* Latest Blocks */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Layers size={14} style={{ color: "#2c7df7" }} /> Latest Blocks
              </h2>
            </div>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", overflow: "hidden" }}>
              {blocks.length === 0 ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="skeleton" style={{ height: "12px", width: "60%", marginBottom: "6px" }} />
                    <div className="skeleton" style={{ height: "10px", width: "40%" }} />
                  </div>
                ))
              ) : (blocks as any[]).map((block: any, i: number) => (
                <Link key={block.level} href={`/explorer/block/${block.level}`} style={{ display: "block", padding: "0.7rem 1rem", borderBottom: i < blocks.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", textDecoration: "none", transition: "background 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.06)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{ width: "32px", height: "32px", background: "rgba(44,125,247,0.15)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Layers size={13} style={{ color: "#2c7df7" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2c7df7" }}>{block.level.toLocaleString()}</div>
                        <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>{block.baker}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)" }}>{block.transactions} txs</div>
                      <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{timeAgo(block.timestamp)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Transactions */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <ArrowRightLeft size={14} style={{ color: "#8b5cf6" }} /> Latest Transactions
              </h2>
            </div>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", overflow: "hidden" }}>
              {txs.length === 0 ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="skeleton" style={{ height: "12px", width: "70%", marginBottom: "6px" }} />
                    <div className="skeleton" style={{ height: "10px", width: "50%" }} />
                  </div>
                ))
              ) : (txs as any[]).map((tx: any, i: number) => (
                <Link key={tx.hash + i} href={`/explorer/tx/${tx.hash}`} style={{ display: "block", padding: "0.7rem 1rem", borderBottom: i < txs.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", textDecoration: "none", transition: "background 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.06)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
                      <div style={{ width: "32px", height: "32px", background: "rgba(139,92,246,0.15)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ArrowRightLeft size={13} style={{ color: "#8b5cf6" }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8b5cf6", fontFamily: "monospace" }}>{shortHash(tx.hash)}</div>
                        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {tx.sender || shortHash(tx.senderAddress)} → {tx.target || shortHash(tx.targetAddress)}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "0.5rem" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>{tx.amount.toFixed(2)} ꜩ</div>
                      <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{timeAgo(tx.timestamp)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Token Transfers */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Zap size={14} style={{ color: "#f59e0b" }} /> Recent Token Transfers
          </h2>
          <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["Token", "From", "To", "Amount", "Time"].map(h => (
                      <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tokenTransfers.length === 0 ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}><td colSpan={5} style={{ padding: "0.75rem 1rem" }}><div className="skeleton" style={{ height: "12px", width: "100%" }} /></td></tr>
                    ))
                  ) : (tokenTransfers as any[]).map((t: any, i: number) => (
                    <tr key={t.id} style={{ borderBottom: i < tokenTransfers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.04)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                      <td style={{ padding: "0.6rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          {t.token.thumbnail && <img src={t.token.thumbnail.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="" style={{ width: "18px", height: "18px", borderRadius: "50%", objectFit: "cover" }} onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} />}
                          <span style={{ fontWeight: 700, color: "#f59e0b" }}>{t.token.symbol}</span>
                        </div>
                      </td>
                      <td style={{ padding: "0.6rem 1rem" }}>
                        <Link href={`/explorer/address/${t.fromAddress || ""}`} style={{ color: "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem" }}>
                          {t.from === "mint" ? <span style={{ color: "#22c55e" }}>mint</span> : shortHash(t.fromAddress || t.from)}
                        </Link>
                      </td>
                      <td style={{ padding: "0.6rem 1rem" }}>
                        <Link href={`/explorer/address/${t.toAddress || ""}`} style={{ color: "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem" }}>
                          {t.to === "burn" ? <span style={{ color: "#ef4444" }}>burn</span> : shortHash(t.toAddress || t.to)}
                        </Link>
                      </td>
                      <td style={{ padding: "0.6rem 1rem", color: "#fff", fontWeight: 600 }}>
                        {(parseInt(t.amount) / Math.pow(10, t.token.decimals)).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </td>
                      <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>
                        {timeAgo(t.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Links to TzKT */}
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)" }}>
            Data powered by{" "}
            <a href="https://tzkt.io" target="_blank" rel="nofollow noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)" }}>TzKT</a>
            {" "}·{" "}
            <a href="https://coingecko.com" target="_blank" rel="nofollow noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)" }}>CoinGecko</a>
          </p>
        </div>
      </div>
    </div>
  );
}
