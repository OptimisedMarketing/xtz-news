import { useMemo } from "react";
import { Link } from "wouter";
import { ChevronRight, Home, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import { trpc } from "@/lib/trpc";

function fmtUsd(v: number) {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(2)}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  Dexs: "#2c7df7",
  Synthetics: "#8b5cf6",
  CDP: "#f97316",
  Lending: "#22c55e",
  Yield: "#f59e0b",
  Liquid_Staking: "#06b6d4",
  "Liquid Staking": "#06b6d4",
  Other: "rgba(255,255,255,0.3)",
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;
}

export default function DefiDashboardPage() {
  const { data, isLoading } = trpc.tools.defiDashboard.useQuery(undefined, {
    staleTime: 5 * 60_000, // 5 min cache
  });

  // Build TVL chart
  const chartData = data?.tvlHistory || [];
  const maxTvl = chartData.length > 0 ? Math.max(...chartData.map((d: any) => d.tvl)) : 1;
  const minTvl = chartData.length > 0 ? Math.min(...chartData.map((d: any) => d.tvl)) : 0;
  const tvlRange = maxTvl - minTvl || 1;

  const sparkPath = useMemo(() => {
    if (chartData.length < 2) return "";
    return chartData.map((d: any, i: number) => {
      const x = (i / (chartData.length - 1)) * 580 + 10;
      const y = 90 - ((d.tvl - minTvl) / tvlRange) * 80;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  }, [chartData, minTvl, tvlRange]);

  const areaPath = sparkPath
    ? `${sparkPath} L ${580 + 10} 90 L 10 90 Z`
    : "";

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
            <span style={{ color: "rgba(255,255,255,0.7)" }}>DeFi Dashboard</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(44,125,247,0.2)", border: "1px solid rgba(44,125,247,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🏦</div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Tezos DeFi Dashboard</h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>Live TVL, protocol rankings, and category breakdown — powered by DeFiLlama</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[200, 300, 150].map((_, i) => <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "8px" }} />)}
          </div>
        )}

        {!isLoading && data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Top stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
              {[
                {
                  label: "Tezos Chain TVL",
                  value: fmtUsd(data.chainTvl),
                  change: data.chainTvlChange1d,
                  sub: `7d: ${data.chainTvlChange7d >= 0 ? "+" : ""}${data.chainTvlChange7d.toFixed(1)}%`,
                  color: "#2c7df7",
                  icon: "⛓️",
                },
                {
                  label: "DeFi TVL (excl. CEX)",
                  value: fmtUsd(data.totalDeFiTvl),
                  change: null,
                  sub: `${data.protocols.length} protocols`,
                  color: "#8b5cf6",
                  icon: "🏦",
                },
                {
                  label: "XTZ Price",
                  value: data.xtzPrice > 0 ? `$${data.xtzPrice.toFixed(4)}` : "—",
                  change: null,
                  sub: "Live from TzKT",
                  color: "#22c55e",
                  icon: "ꜩ",
                },
                {
                  label: "30d TVL Change",
                  value: `${data.chainTvlChange30d >= 0 ? "+" : ""}${data.chainTvlChange30d.toFixed(1)}%`,
                  change: data.chainTvlChange30d,
                  sub: "vs 30 days ago",
                  color: data.chainTvlChange30d >= 0 ? "#22c55e" : "#ef4444",
                  icon: "📅",
                },
              ].map(s => (
                <div key={s.label} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.1rem 1.25rem" }}>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>{s.icon} {s.label}</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.2rem" }}>
                    {s.change !== null && (
                      <>
                        {s.change >= 0 ? <TrendingUp size={11} style={{ color: "#22c55e" }} /> : <TrendingDown size={11} style={{ color: "#ef4444" }} />}
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: s.change >= 0 ? "#22c55e" : "#ef4444" }}>
                          {s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}% 24h
                        </span>
                      </>
                    )}
                    {s.sub && <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)" }}>{s.change !== null ? "· " : ""}{s.sub}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* TVL Chart + Category breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
              {/* TVL Chart */}
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.25rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                  Tezos Chain TVL — 90 Days
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "0.75rem 0.5rem 0.25rem", overflow: "hidden" }}>
                  <svg width="100%" height="100" viewBox="0 0 600 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="tvlGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2c7df7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2c7df7" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {areaPath && <path d={areaPath} fill="url(#tvlGrad)" />}
                    {sparkPath && <path d={sparkPath} stroke="#2c7df7" strokeWidth="2" fill="none" strokeLinejoin="round" />}
                  </svg>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                    <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.2)" }}>90 days ago</span>
                    <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.2)" }}>Today: {fmtUsd(data.chainTvl)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem" }}>
                  {[
                    { label: "Min (90d)", value: fmtUsd(minTvl) },
                    { label: "Max (90d)", value: fmtUsd(maxTvl) },
                    { label: "Current", value: fmtUsd(data.chainTvl) },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff" }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category breakdown */}
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.25rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                  By Category
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {data.categories.map((cat: any) => {
                    const pct = data.totalDeFiTvl > 0 ? (cat.tvl / data.totalDeFiTvl) * 100 : 0;
                    const color = getCategoryColor(cat.name);
                    return (
                      <div key={cat.name}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color }}>{cat.name}</span>
                          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>{fmtUsd(cat.tvl)}</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "3px", transition: "width 0.5s ease" }} />
                        </div>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", marginTop: "0.1rem" }}>{pct.toFixed(1)}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Protocol table */}
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>Tezos DeFi Protocols</span>
                <a href="https://defillama.com/chain/Tezos" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>
                  View on DeFiLlama <ExternalLink size={10} />
                </a>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["#", "Protocol", "Category", "TVL", "24h Change", "7d Change"].map(h => (
                        <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.protocols.map((p: any, i: number) => (
                      <tr key={p.slug} style={{ borderBottom: i < data.protocols.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.3)", fontSize: "0.72rem" }}>{i + 1}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            {p.logo && (
                              <img src={p.logo} alt="" style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                            )}
                            <div>
                              <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.85rem" }}>{p.name}</div>
                              {p.description && (
                                <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {p.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: "8px", background: `${getCategoryColor(p.category)}22`, color: getCategoryColor(p.category), border: `1px solid ${getCategoryColor(p.category)}44`, whiteSpace: "nowrap" }}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>{fmtUsd(p.tvl)}</td>
                        <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap" }}>
                          {p.change1d != null ? (
                            <span style={{ fontWeight: 700, color: p.change1d >= 0 ? "#22c55e" : "#ef4444", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                              {p.change1d >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                              {p.change1d >= 0 ? "+" : ""}{p.change1d.toFixed(2)}%
                            </span>
                          ) : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                        </td>
                        <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap" }}>
                          {p.change7d != null ? (
                            <span style={{ fontWeight: 700, color: p.change7d >= 0 ? "#22c55e" : "#ef4444" }}>
                              {p.change7d >= 0 ? "+" : ""}{p.change7d.toFixed(2)}%
                            </span>
                          ) : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attribution */}
            <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
              Data from <a href="https://defillama.com" target="_blank" rel="noopener noreferrer" style={{ color: "#2c7df7", textDecoration: "none" }}>DeFiLlama</a> and TzKT. Updated every 5 minutes. CEX and bridge protocols excluded from DeFi TVL.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
