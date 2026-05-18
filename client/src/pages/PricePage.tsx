import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, ArrowUpDown, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toExponential(2)}`;
}

function formatLarge(n: number): string {
  if (!n) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

/** Inline sparkline SVG */
function Sparkline({ data, isUp }: { data: number[]; isUp: boolean }) {
  if (!data || data.length < 2) return <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>—</span>;
  const w = 64, h = 24;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={isUp ? "#4ade80" : "#f87171"} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

type SortKey = "name" | "price" | "change24h" | "change7d" | "marketCap" | "volume24h";

export default function PricePage() {
  const { data: tokens = [], isLoading } = trpc.prices.tezosTokens.useQuery(undefined, {
    refetchInterval: 90_000,
    staleTime: 60_000,
  });

  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const xtz = tokens.find((t: any) => t.id === "tezos");

  // Build XTZ 7-day chart from sparkline
  const xtzChartData = useMemo(() => {
    const sp = (xtz as any)?.sparkline ?? [];
    if (!sp.length) return [];
    const now = Date.now();
    const step = (7 * 24 * 60 * 60 * 1000) / sp.length;
    return (sp as number[]).map((price: number, i: number) => ({
      time: new Date(now - (sp.length - 1 - i) * step).toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
      price: +price.toFixed(6),
    }));
  }, [xtz]);

  const sorted = useMemo(() => {
    return [...tokens].sort((a, b) => {
      let av: number, bv: number;
      switch (sortKey) {
        case "name": return sortDir === "asc" ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
        case "price": av = a.price; bv = b.price; break;
        case "change24h": av = a.change24h; bv = b.change24h; break;
        case "change7d": av = (a as any).change7d ?? 0; bv = (b as any).change7d ?? 0; break;
        case "marketCap": av = (a as any).marketCap ?? 0; bv = (b as any).marketCap ?? 0; break;
        case "volume24h": av = (a as any).volume24h ?? 0; bv = (b as any).volume24h ?? 0; break;
        default: av = 0; bv = 0;
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [tokens, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const setDir = setSortDir;

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      onClick={() => handleSort(k)}
      style={{ padding: "0.75rem 1rem", textAlign: k === "name" ? "left" : "right", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: sortKey === k ? "#2c7df7" : "rgba(255,255,255,0.4)", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none" }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
        {label}
        <ArrowUpDown size={10} style={{ opacity: sortKey === k ? 1 : 0.4 }} />
      </span>
    </th>
  );

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "3rem 0 2.5rem" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <div style={{ width: "4px", height: "48px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>
                Tezos Prices
              </h1>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", margin: "0.4rem 0 0" }}>
                Live prices for XTZ and all Tezos ecosystem tokens · Updated every 90 seconds
              </p>
            </div>
          </div>

          {/* XTZ hero stats */}
          {xtz && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: "2rem" }}>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", margin: "0 0 0.25rem" }}>XTZ Price</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <img src={xtz.image} alt="XTZ" style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
                  <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{formatPrice(xtz.price)}</span>
                  <span style={{ fontSize: "1rem", fontWeight: 700, color: xtz.change24h >= 0 ? "#4ade80" : "#f87171", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {xtz.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {formatChange(xtz.change24h)}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "2rem", alignItems: "flex-end" }}>
                {[
                  { label: "Market Cap", value: formatLarge((xtz as any).marketCap) },
                  { label: "24h Volume", value: formatLarge((xtz as any).volume24h) },
                  { label: "7d Change", value: formatChange((xtz as any).change7d ?? 0), color: ((xtz as any).change7d ?? 0) >= 0 ? "#4ade80" : "#f87171" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", margin: "0 0 0.25rem" }}>{stat.label}</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: stat.color ?? "#fff", margin: 0 }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {/* XTZ 7-day price chart */}
        {xtzChartData.length > 0 && (
          <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 1.25rem" }}>
              XTZ / USD — 7 Day Price Chart
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={xtzChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(3)}`} width={65} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "4px", color: "#fff", fontSize: "0.8rem" }}
                  formatter={(v: any) => [`$${Number(v).toFixed(6)}`, "XTZ"]}
                />
                <Line type="monotone" dataKey="price" stroke="#2c7df7" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#2c7df7" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Token table */}
        <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              All Tezos Ecosystem Tokens
            </h2>
          </div>

          {isLoading ? (
            <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "48px", borderRadius: "4px" }} />)}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", width: "32px" }}>#</th>
                    <SortHeader label="Token" k="name" />
                    <SortHeader label="Price" k="price" />
                    <SortHeader label="24h %" k="change24h" />
                    <SortHeader label="7d %" k="change7d" />
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>7d Chart</th>
                    <SortHeader label="Market Cap" k="marketCap" />
                    <SortHeader label="24h Volume" k="volume24h" />
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>Trade</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((token, idx) => {
                    const isUp24 = token.change24h >= 0;
                    const change7d = (token as any).change7d ?? 0;
                    const isUp7 = change7d >= 0;
                    const sparkline = (token as any).sparkline ?? [];
                    const dexUrl = (token as any).dexUrl ?? `https://www.coingecko.com/en/coins/${token.id}`;

                    return (
                      <tr
                        key={token.id}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.15s" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.05)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                      >
                        {/* Rank */}
                        <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>{idx + 1}</td>

                        {/* Token */}
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            {token.image && <img src={token.image} alt={token.symbol} style={{ width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0 }} onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")} />}
                            <div>
                              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", margin: 0 }}>{token.symbol}</p>
                              <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>{token.name}</p>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td style={{ padding: "0.875rem 1rem", textAlign: "right", fontSize: "0.85rem", fontWeight: 600, color: "#fff", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                          {formatPrice(token.price)}
                        </td>

                        {/* 24h change */}
                        <td style={{ padding: "0.875rem 1rem", textAlign: "right" }}>
                          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: isUp24 ? "#4ade80" : "#f87171", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                            {isUp24 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {formatChange(token.change24h)}
                          </span>
                        </td>

                        {/* 7d change */}
                        <td style={{ padding: "0.875rem 1rem", textAlign: "right" }}>
                          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: isUp7 ? "#4ade80" : "#f87171" }}>
                            {formatChange(change7d)}
                          </span>
                        </td>

                        {/* Sparkline */}
                        <td style={{ padding: "0.875rem 1rem", textAlign: "center" }}>
                          <Sparkline data={sparkline} isUp={isUp24} />
                        </td>

                        {/* Market Cap */}
                        <td style={{ padding: "0.875rem 1rem", textAlign: "right", fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", fontVariantNumeric: "tabular-nums" }}>
                          {formatLarge((token as any).marketCap)}
                        </td>

                        {/* Volume */}
                        <td style={{ padding: "0.875rem 1rem", textAlign: "right", fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", fontVariantNumeric: "tabular-nums" }}>
                          {formatLarge((token as any).volume24h)}
                        </td>

                        {/* Trade link */}
                        <td style={{ padding: "0.875rem 1rem", textAlign: "center" }}>
                          <a
                            href={dexUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.75rem", background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "3px", color: "#2c7df7", fontSize: "0.7rem", fontWeight: 700, textDecoration: "none", transition: "all 0.2s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2c7df7"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.15)"; (e.currentTarget as HTMLElement).style.color = "#2c7df7"; }}
                          >
                            Trade <ExternalLink size={10} />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
