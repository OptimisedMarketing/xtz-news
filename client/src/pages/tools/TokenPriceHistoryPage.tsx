import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ChevronRight, Home, Search, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import { trpc } from "@/lib/trpc";

function fmtXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K ꜩ`;
  return `${v.toFixed(4)} ꜩ`;
}
function timeAgo(ts: string) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const KNOWN_TOKENS = [
  { label: "QUIPU", contract: "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb", tokenId: "0" },
  { label: "UUSD", contract: "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW", tokenId: "0" },
  { label: "kUSD", contract: "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV", tokenId: "0" },
  { label: "VNXAU", contract: "KT1TgmD7kXQzofpuc9VbTRMdZCS2e7kSCdeB", tokenId: "0" },
  { label: "tzBTC", contract: "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn", tokenId: "0" },
];

export default function TokenPriceHistoryPage() {
  const [contractInput, setContractInput] = useState("");
  const [tokenIdInput, setTokenIdInput] = useState("0");
  const [contract, setContract] = useState("");
  const [tokenId, setTokenId] = useState("0");

  const { data, isLoading, error } = trpc.tools.tokenPriceHistory.useQuery(
    { contract, tokenId },
    { enabled: !!contract, staleTime: 60_000 }
  );

  const handleSearch = (c?: string, tid?: string) => {
    const addr = (c || contractInput).trim();
    if (!addr) return;
    setContract(addr);
    setTokenId(tid ?? tokenIdInput);
    if (!c) setContractInput(addr);
  };

  // Build price chart from trade data
  const chartData = useMemo(() => {
    if (!data?.trades?.length) return [];
    return [...data.trades].reverse(); // oldest first for chart
  }, [data]);

  const maxPrice = chartData.length > 0 ? Math.max(...chartData.map(t => t.priceXtz)) : 1;
  const minPrice = chartData.length > 0 ? Math.min(...chartData.map(t => t.priceXtz)) : 0;
  const priceRange = maxPrice - minPrice || 1;

  const firstPrice = chartData[0]?.priceXtz ?? 0;
  const lastPrice = chartData[chartData.length - 1]?.priceXtz ?? 0;
  const priceChange = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1rem", fontSize: "0.75rem", fontWeight: 600 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}><Home size={12} /></Link>
            <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
            <Link href="/tools" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Tools</Link>
            <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Token Price History</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📈</div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Token Price History</h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>View trade history and price chart for any FA2 token on Tezos</p>
            </div>
          </div>

          {/* Search */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "2 1 300px" }}>
              <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input value={contractInput} onChange={(e) => setContractInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="FA2 contract address (KT1…)"
                style={{ width: "100%", padding: "0.7rem 1rem 0.7rem 2.5rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "8px", color: "#fff", fontSize: "0.88rem", outline: "none", fontFamily: "monospace", transition: "border-color 0.15s" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,125,247,0.3)")} />
            </div>
            <input value={tokenIdInput} onChange={(e) => setTokenIdInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Token ID (0)"
              style={{ flex: "0 0 100px", padding: "0.7rem 0.875rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#fff", fontSize: "0.88rem", outline: "none", fontFamily: "monospace" }} />
            <button onClick={() => handleSearch()}
              style={{ padding: "0.7rem 1.5rem", background: "#f97316", border: "none", borderRadius: "8px", color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}>
              View Chart
            </button>
          </div>

          {/* Quick-select known tokens */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>Popular:</span>
            {KNOWN_TOKENS.map(tok => (
              <button key={tok.contract} onClick={() => { setContractInput(tok.contract); setTokenIdInput(tok.tokenId); handleSearch(tok.contract, tok.tokenId); }}
                style={{ padding: "0.2rem 0.7rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer" }}>
                {tok.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="skeleton" style={{ height: "300px", borderRadius: "10px" }} />
            <div className="skeleton" style={{ height: "200px", borderRadius: "10px" }} />
          </div>
        )}

        {!isLoading && contract && (!data || error) && (
          <div style={{ textAlign: "center", padding: "3rem", background: "#05152e", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📈</div>
            <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.5rem" }}>No Trade Data Found</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>No sales found for this token on objkt.com. Try a different contract or token ID.</p>
          </div>
        )}

        {!isLoading && data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Token info header */}
            <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "12px", padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", margin: "0 0 0.25rem" }}>{data.name || "Unknown Token"}</h2>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                    <code style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{contract.slice(0, 20)}…</code>
                    {data.objktUrl && (
                      <a href={data.objktUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>
                        <ExternalLink size={10} /> objkt.com
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {lastPrice > 0 && (
                    <>
                      <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff" }}>{fmtXtz(lastPrice)}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", justifyContent: "flex-end" }}>
                        {priceChange >= 0 ? <TrendingUp size={12} style={{ color: "#22c55e" }} /> : <TrendingDown size={12} style={{ color: "#ef4444" }} />}
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: priceChange >= 0 ? "#22c55e" : "#ef4444" }}>
                          {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(1)}% over {data.trades.length} trades
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {[
                  { label: "Total Trades", value: data.trades.length.toLocaleString(), color: "#2c7df7" },
                  { label: "Total Volume", value: fmtXtz(data.totalVolume), color: "#f97316" },
                  { label: "Highest Sale", value: fmtXtz(data.highPrice), color: "#22c55e" },
                  { label: "Lowest Sale", value: fmtXtz(data.lowPrice), color: "#f59e0b" },
                  { label: "Avg Price", value: fmtXtz(data.avgPrice), color: "rgba(255,255,255,0.7)" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "0.6rem 0.75rem" }}>
                    <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.25rem" }}>{s.label}</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price chart */}
            {chartData.length > 1 && (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.5rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                  Price History (last {chartData.length} trades)
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "1rem 0.5rem 0.5rem", overflow: "hidden" }}>
                  <svg width="100%" height="160" viewBox="0 0 600 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d={[
                        `M 0 150`,
                        ...chartData.map((t, i) => {
                          const x = (i / (chartData.length - 1)) * 590 + 5;
                          const y = 140 - ((t.priceXtz - minPrice) / priceRange) * 130;
                          return `L ${x} ${y}`;
                        }),
                        `L 595 150 Z`
                      ].join(" ")}
                      fill="url(#priceGrad)"
                    />
                    {/* Line */}
                    <polyline
                      points={chartData.map((t, i) => {
                        const x = (i / (chartData.length - 1)) * 590 + 5;
                        const y = 140 - ((t.priceXtz - minPrice) / priceRange) * 130;
                        return `${x},${y}`;
                      }).join(" ")}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    {/* Dots for last 20 trades if small dataset */}
                    {chartData.length <= 50 && chartData.map((t, i) => {
                      const x = (i / (chartData.length - 1)) * 590 + 5;
                      const y = 140 - ((t.priceXtz - minPrice) / priceRange) * 130;
                      return <circle key={i} cx={x} cy={y} r="3" fill="#f97316" opacity="0.8"><title>{fmtXtz(t.priceXtz)} — {timeAgo(t.timestamp)}</title></circle>;
                    })}
                  </svg>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)" }}>{timeAgo(chartData[0]?.timestamp)}</span>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)" }}>Latest</span>
                  </div>
                </div>
              </div>
            )}

            {/* Trade history table */}
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>Recent Trades</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Time", "Price", "Amount", "Buyer", "Seller"].map(h => (
                        <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.trades.slice(0, 50).map((t: any, i: number) => (
                      <tr key={i} style={{ borderBottom: i < Math.min(data.trades.length, 50) - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{timeAgo(t.timestamp)}</td>
                        <td style={{ padding: "0.6rem 1rem", fontWeight: 700, color: "#f97316" }}>{fmtXtz(t.priceXtz)}</td>
                        <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.6)" }}>{t.amount}</td>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          {t.buyer ? (
                            <Link href={`/explorer/address/${t.buyer}`} style={{ color: "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem" }}>
                              {t.buyer.slice(0, 10)}…
                            </Link>
                          ) : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                        </td>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          {t.seller ? (
                            <Link href={`/explorer/address/${t.seller}`} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem" }}>
                              {t.seller.slice(0, 10)}…
                            </Link>
                          ) : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!contract && !isLoading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📈</div>
            <p style={{ fontSize: "0.9rem" }}>Enter a FA2 contract address above or select a popular token</p>
          </div>
        )}
      </div>
    </div>
  );
}
