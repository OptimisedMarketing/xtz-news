import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { ChevronRight, Home, ExternalLink, Twitter, Github, Shield, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ToolBreadcrumb from "@/components/ToolBreadcrumb";
import { useSEO, buildWebPageSchema } from "@/hooks/useSEO";

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
  "Liquid Staking": "#06b6d4",
  Other: "rgba(255,255,255,0.4)",
};

export default function DefiProtocolPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = trpc.tools.defiProtocol.useQuery(
    { slug: slug || "" },
    { enabled: !!slug, staleTime: 5 * 60_000 }
  );

  useSEO({
    title: data ? `${data.name} — Tezos DeFi Protocol | XTZ.News` : "Tezos DeFi Protocol | XTZ.News",
    description: data?.description?.slice(0, 155) || `View TVL, token price, and smart contract details for ${slug || ""} on Tezos.`,
    keywords: data ? `${data.name}, Tezos DeFi, ${data.symbol || ""}, TVL, Tezos protocol` : "Tezos DeFi protocol",
    canonical: `https://xtz.news/tools/defi/${slug || ""}`,
    ogImage: data?.logo || undefined,
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
      const y = 110 - ((d.tvl - minTvl) / tvlRange) * 100;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  }, [chartData, minTvl, tvlRange]);

  const areaPath = sparkPath ? `${sparkPath} L 590 110 L 10 110 Z` : "";

  const catColor = data?.category ? (CATEGORY_COLORS[data.category] || CATEGORY_COLORS.Other) : "#2c7df7";

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <ToolBreadcrumb items={[{ label: "Tools", href: "/tools" }, { label: "DeFi Dashboard", href: "/tools/defi" }, { label: data?.name || slug || "" }]} />

          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div className="skeleton" style={{ width: "48px", height: "48px", borderRadius: "10px" }} />
              <div>
                <div className="skeleton" style={{ width: "200px", height: "28px", marginBottom: "8px" }} />
                <div className="skeleton" style={{ width: "120px", height: "16px" }} />
              </div>
            </div>
          ) : data ? (
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {data.logo ? (
                  <img src={data.logo} alt={data.name} style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover" }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div style={{ width: "48px", height: "48px", background: `${catColor}22`, border: `1px solid ${catColor}44`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🏦</div>
                )}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>{data.name}</h1>
                    {data.symbol && <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "2px 8px", borderRadius: "8px", background: `${catColor}22`, color: catColor, border: `1px solid ${catColor}44` }}>{data.symbol}</span>}
                    {data.category && <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>{data.category}</span>}
                  </div>
                  {data.description && (
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", margin: "0.35rem 0 0", maxWidth: "600px" }}>{data.description}</p>
                  )}
                  {/* Links */}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                    {data.url && (
                      <a href={data.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.75rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.72rem", fontWeight: 700 }}>
                        <ExternalLink size={11} /> Website
                      </a>
                    )}
                    {data.twitter && (
                      <a href={`https://twitter.com/${data.twitter}`} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.75rem", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "6px", color: "#2c7df7", textDecoration: "none", fontSize: "0.72rem", fontWeight: 700 }}>
                        <Twitter size={11} /> @{data.twitter}
                      </a>
                    )}
                    {data.github && Array.isArray(data.github) && data.github[0] && (
                      <a href={`https://github.com/${data.github[0]}`} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.75rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.72rem", fontWeight: 700 }}>
                        <Github size={11} /> GitHub
                      </a>
                    )}
                    {data.audits > 0 && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.75rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "6px", color: "#22c55e", fontSize: "0.72rem", fontWeight: 700 }}>
                        <Shield size={11} /> {data.audits} Audit{data.audits > 1 ? "s" : ""}
                      </span>
                    )}
                    <a href={`https://defillama.com/protocol/${slug}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.75rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.72rem", fontWeight: 700 }}>
                      <ExternalLink size={11} /> DeFiLlama
                    </a>
                  </div>
                </div>
              </div>
              {/* TVL hero number */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>TVL</div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>{fmtUsd(data.currentTvl)}</div>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.25rem" }}>
                  {[
                    { label: "24h", v: data.tvlChange1d },
                    { label: "7d", v: data.tvlChange7d },
                    { label: "30d", v: data.tvlChange30d },
                  ].map(s => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                      {s.v >= 0 ? <TrendingUp size={10} style={{ color: "#22c55e" }} /> : <TrendingDown size={10} style={{ color: "#ef4444" }} />}
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: s.v >= 0 ? "#22c55e" : "#ef4444" }}>
                        {s.v >= 0 ? "+" : ""}{s.v.toFixed(1)}% {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[300, 200, 150].map((_, i) => <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "8px" }} />)}
          </div>
        )}

        {!isLoading && !data && (
          <div style={{ textAlign: "center", padding: "3rem", background: "#05152e", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🏦</div>
            <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.5rem" }}>Protocol Not Found</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>Protocol <code>{slug}</code> not found on DeFiLlama.</p>
            <Link href="/tools/defi" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "1rem", color: "#2c7df7", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
              <ArrowLeft size={14} /> Back to DeFi Dashboard
            </Link>
          </div>
        )}

        {!isLoading && data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
              {[
                { label: "Current TVL", value: fmtUsd(data.currentTvl), color: "#fff", icon: "💰" },
                { label: "All-Time High TVL", value: fmtUsd(data.maxTvl), color: "#f59e0b", icon: "🏆" },
                ...(data.tokenPrice ? [{ label: `${data.symbol || "Token"} Price`, value: `$${data.tokenPrice.toFixed(4)}`, color: catColor, icon: "🪙" }] : []),
                ...(data.tokenMarketCap ? [{ label: "Market Cap", value: fmtUsd(data.tokenMarketCap), color: "rgba(255,255,255,0.7)", icon: "📊" }] : []),
                { label: "Chains", value: data.chains.length.toString(), color: "#2c7df7", icon: "⛓️" },
                ...(data.audits > 0 ? [{ label: "Security Audits", value: data.audits.toString(), color: "#22c55e", icon: "🛡️" }] : []),
              ].map(s => (
                <div key={s.label} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "0.875rem 1rem" }}>
                  <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.3rem" }}>{s.icon} {s.label}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* TVL Chart */}
            {chartData.length > 1 && (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.25rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                  TVL History — 90 Days
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "0.75rem 0.5rem 0.25rem", overflow: "hidden" }}>
                  <svg width="100%" height="120" viewBox="0 0 600 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="protGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={catColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={catColor} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {areaPath && <path d={areaPath} fill="url(#protGrad)" />}
                    {sparkPath && <path d={sparkPath} stroke={catColor} strokeWidth="2" fill="none" strokeLinejoin="round" />}
                    {/* Current value dot */}
                    {chartData.length > 0 && (() => {
                      const last = chartData[chartData.length - 1];
                      const x = 590;
                      const y = 110 - ((last.tvl - minTvl) / tvlRange) * 100;
                      return <circle cx={x} cy={y} r="4" fill={catColor} />;
                    })()}
                  </svg>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                    <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.2)" }}>
                      {new Date(chartData[0]?.date * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                    <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.2)" }}>Today: {fmtUsd(data.currentTvl)}</span>
                  </div>
                </div>
                {/* Min/Max labels */}
                <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem" }}>
                  {[
                    { label: "Min (90d)", value: fmtUsd(minTvl) },
                    { label: "Max (90d)", value: fmtUsd(maxTvl) },
                    { label: "Avg (90d)", value: fmtUsd(chartData.reduce((s: number, d: any) => s + d.tvl, 0) / chartData.length) },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff" }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Two-column: contract + audit links */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Contract addresses */}
              {data.contractAddresses.length > 0 && (
                <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.85rem" }}>📜 Smart Contracts</span>
                  </div>
                  {data.contractAddresses.map((addr: string, i: number) => (
                    <div key={addr} style={{ padding: "0.875rem 1.25rem", borderBottom: i < data.contractAddresses.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <code style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", fontFamily: "monospace", display: "block", marginBottom: "0.4rem" }}>{addr}</code>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Link href={`/tools/contract?address=${addr}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "5px", color: "#8b5cf6", textDecoration: "none", fontSize: "0.65rem", fontWeight: 700 }}>
                          📜 Inspect Contract
                        </Link>
                        <Link href={`/explorer/address/${addr}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "5px", color: "#2c7df7", textDecoration: "none", fontSize: "0.65rem", fontWeight: 700 }}>
                          Explorer →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Audit links + stablecoins */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {data.auditLinks.length > 0 && (
                  <div style={{ background: "#05152e", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontWeight: 800, color: "#22c55e", fontSize: "0.85rem" }}>🛡️ Security Audits</span>
                    </div>
                    {data.auditLinks.map((link: string, i: number) => (
                      <div key={i} style={{ padding: "0.75rem 1.25rem", borderBottom: i < data.auditLinks.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <a href={link} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "#22c55e", textDecoration: "none", fontSize: "0.75rem", fontWeight: 600 }}>
                          <ExternalLink size={11} /> Audit Report {i + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {data.stablecoins.length > 0 && (
                  <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>💵 Stablecoins</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {data.stablecoins.map((sc: string) => (
                        <span key={sc} style={{ fontSize: "0.72rem", fontWeight: 700, padding: "3px 9px", borderRadius: "10px", background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Back button */}
            <div>
              <Link href="/tools/defi" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700 }}>
                <ArrowLeft size={13} /> Back to DeFi Dashboard
              </Link>
            </div>

            {/* Attribution */}
            <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
              Data from <a href="https://defillama.com" target="_blank" rel="noopener noreferrer" style={{ color: "#2c7df7", textDecoration: "none" }}>DeFiLlama</a> and CoinGecko. Updated every 5 minutes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
