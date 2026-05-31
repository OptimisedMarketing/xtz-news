import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, ChevronRight, Home, ExternalLink, TrendingUp, Award, ChevronUp, ChevronDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO, buildToolSchema } from "@/hooks/useSEO";

function fmtXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K ꜩ`;
  return `${v.toFixed(4)} ꜩ`;
}

const EXAMPLE_ADDRESSES = [
  { label: "Coinbase Baker", address: "tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk" },
  { label: "TF Baker 1", address: "tz3cqThj23fe5UWiHMWMGRSiSYGEMdFhGmPM" },
];

type DelegSortKey = "baker" | "from" | "duration" | "rewards" | "apy";
type SortDir = "asc" | "desc";

export default function RewardCalculatorPage() {
  useSEO({
    title: "Tezos Reward Calculator — Baking & Delegation History | XTZ.News",
    description: "View baking or delegation reward history for any Tezos address. See APY per cycle, past bakers, total rewards earned, and delegation history.",
    keywords: "Tezos reward calculator, XTZ staking rewards, Tezos delegation rewards, Tezos baking APY, XTZ yield",
    canonical: "https://xtz.news/tools/rewards",
    jsonLd: buildToolSchema({ name: "Tezos Reward Calculator", description: "View baking or delegation reward history for any Tezos address. See APY per cycle, past bakers, total rewards earned, and delegation history.", url: "https://xtz.news/tools/rewards" }),
  });

  const [input, setInput] = useState("");
  const [address, setAddress] = useState("");
  const [cycles, setCycles] = useState(30);
  const [delegSortKey, setDelegSortKey] = useState<DelegSortKey>("from");
  const [delegSortDir, setDelegSortDir] = useState<SortDir>("desc");

  const handleDelegSort = (key: DelegSortKey) => {
    if (delegSortKey === key) {
      setDelegSortDir(d => d === "desc" ? "asc" : "desc");
    } else {
      setDelegSortKey(key);
      setDelegSortDir("desc");
    }
  };

  const { data, isLoading, error } = trpc.tools.rewardHistory.useQuery(
    { address, cycles },
    { enabled: !!address, staleTime: 60_000 }
  );

  const handleSearch = (addr?: string) => {
    const a = (addr || input).trim();
    if (!a) return;
    setAddress(a);
    if (!addr) setInput(a);
  };

  // Compute totals for baker
  const bakerTotals = data?.type === "baker" ? {
    totalRewards: data.cycles.reduce((s: number, c: any) => s + c.totalRewards, 0),
    avgApy: data.cycles.filter((c: any) => c.apy != null).reduce((s: number, c: any) => s + (c.apy ?? 0), 0) / Math.max(1, data.cycles.filter((c: any) => c.apy != null).length),
    totalBlocks: data.cycles.reduce((s: number, c: any) => s + c.blocks, 0),
    totalMissed: data.cycles.reduce((s: number, c: any) => s + c.missedBlocks, 0),
  } : null;

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
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Reward Calculator</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>💰</div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Reward Calculator</h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>View baking or delegation reward history for any Tezos address</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 400px" }}>
              <Search size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter baker or delegator address…"
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "8px", color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,125,247,0.3)")} />
            </div>
            <button onClick={() => handleSearch()} style={{ padding: "0.75rem 1.5rem", background: "#22c55e", border: "none", borderRadius: "8px", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
              View Rewards
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>Try:</span>
            {EXAMPLE_ADDRESSES.map(ex => (
              <button key={ex.address} onClick={() => { setInput(ex.address); handleSearch(ex.address); }}
                style={{ padding: "0.2rem 0.7rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer" }}>
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "56px", borderRadius: "8px" }} />)}
          </div>
        )}

        {!isLoading && address && (data === null || error) && (
          <div style={{ textAlign: "center", padding: "3rem", background: "#05152e", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>💰</div>
            <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.5rem" }}>No Reward Data</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>This address has no baking or delegation reward history, or it doesn't exist.</p>
          </div>
        )}

        {!isLoading && data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Identity */}
            <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  {data.alias && <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff", marginBottom: "0.25rem" }}>{data.alias}</div>}
                  <code style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{data.address}</code>
                  <div style={{ marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: data.type === "baker" ? "rgba(249,115,22,0.15)" : "rgba(44,125,247,0.15)", color: data.type === "baker" ? "#f97316" : "#2c7df7", border: `1px solid ${data.type === "baker" ? "rgba(249,115,22,0.3)" : "rgba(44,125,247,0.3)"}` }}>
                      {data.type === "baker" ? "🏦 Baker" : "👤 Delegator"}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>Balance</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff" }}>{fmtXtz(data.balance)}</div>
                </div>
              </div>

              {/* Baker summary stats */}
              {data.type === "baker" && bakerTotals && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  {[
                    { label: "Avg APY", value: `${bakerTotals.avgApy.toFixed(2)}%`, color: "#22c55e", icon: "📈" },
                    { label: "Total Rewards", value: fmtXtz(bakerTotals.totalRewards), color: "#f97316", icon: "💰" },
                    { label: "Blocks Baked", value: bakerTotals.totalBlocks.toLocaleString(), color: "#2c7df7", icon: "🧱" },
                    { label: "Missed Blocks", value: bakerTotals.totalMissed.toLocaleString(), color: bakerTotals.totalMissed > 0 ? "#ef4444" : "#22c55e", icon: "⚠️" },
                    { label: "Cycles Tracked", value: data.cycles.length.toString(), color: "rgba(255,255,255,0.6)", icon: "🔄" },
                  ].map(s => (
                    <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "0.75rem" }}>
                      <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.3rem" }}>{s.icon} {s.label}</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delegator info */}
              {data.type === "delegator" && data.delegatedTo && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                    Delegated to: <Link href={`/tools/rewards?address=${data.delegatedToAddress}`} style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>{data.delegatedTo}</Link>
                  </span>
                  {data.stakedBalance > 0 && (
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                      Staked: <span style={{ color: "#f97316", fontWeight: 700 }}>{fmtXtz(data.stakedBalance)}</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Cycle range selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Show cycles:</span>
              {[10, 20, 30, 50].map(n => (
                <button key={n} onClick={() => setCycles(n)}
                  style={{ padding: "0.3rem 0.7rem", background: cycles === n ? "rgba(44,125,247,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${cycles === n ? "rgba(44,125,247,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "4px", color: cycles === n ? "#2c7df7" : "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer" }}>
                  {n}
                </button>
              ))}
            </div>

            {/* Baker reward table */}
            {data.type === "baker" && data.cycles.length > 0 && (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Award size={14} style={{ color: "#f97316" }} />
                  <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>Baking Rewards by Cycle</span>
                </div>
                {/* APY sparkline */}
                <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.4rem" }}>APY trend</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "40px" }}>
                    {[...data.cycles].reverse().map((c: any, i: number) => {
                      const maxApy = Math.max(...data.cycles.map((x: any) => x.apy ?? 0), 1);
                      const pct = c.apy != null ? Math.max(4, (c.apy / maxApy) * 100) : 4;
                      return (
                        <div key={c.cycle} style={{ flex: 1, height: `${pct}%`, background: c.apy != null ? "#22c55e" : "rgba(255,255,255,0.1)", borderRadius: "2px 2px 0 0", minHeight: "3px", transition: "height 0.3s" }} title={`Cycle ${c.cycle}: ${c.apy?.toFixed(2) ?? "n/a"}% APY`} />
                      );
                    })}
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Cycle", "APY", "Total Rewards", "Baking Power", "Blocks", "Missed"].map(h => (
                          <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.cycles.map((c: any, i: number) => (
                        <tr key={c.cycle} style={{ borderBottom: i < data.cycles.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{c.cycle}</td>
                          <td style={{ padding: "0.6rem 1rem" }}>
                            {c.apy != null ? (
                              <span style={{ fontWeight: 800, color: c.apy >= 8 ? "#22c55e" : c.apy >= 5 ? "#f59e0b" : "#ef4444" }}>{c.apy.toFixed(2)}%</span>
                            ) : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                          </td>
                          <td style={{ padding: "0.6rem 1rem", color: "#22c55e", fontWeight: 700 }}>+{fmtXtz(c.totalRewards)}</td>
                          <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.5)" }}>{fmtXtz(c.bakingPower)}</td>
                          <td style={{ padding: "0.6rem 1rem", color: "#2c7df7", fontWeight: 600 }}>{c.blocks}</td>
                          <td style={{ padding: "0.6rem 1rem", color: c.missedBlocks > 0 ? "#ef4444" : "rgba(255,255,255,0.2)" }}>{c.missedBlocks > 0 ? c.missedBlocks : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Delegator: Delegation History with per-baker breakdown */}
            {data.type === "delegator" && (data as any).delegationPeriods?.length > 0 && (() => {
              const periods = [...(data as any).delegationPeriods].sort((a: any, b: any) => {
                const dir = delegSortDir === "desc" ? -1 : 1;
                if (delegSortKey === "baker") return dir * (a.baker || "").localeCompare(b.baker || "");
                if (delegSortKey === "from") return dir * (new Date(a.from).getTime() - new Date(b.from).getTime());
                if (delegSortKey === "duration") {
                  const durA = (a.to ? new Date(a.to) : new Date()).getTime() - new Date(a.from).getTime();
                  const durB = (b.to ? new Date(b.to) : new Date()).getTime() - new Date(b.from).getTime();
                  return dir * (durA - durB);
                }
                if (delegSortKey === "rewards") return dir * ((a.totalRewards ?? 0) - (b.totalRewards ?? 0));
                if (delegSortKey === "apy") return dir * ((a.avgApy ?? -1) - (b.avgApy ?? -1));
                return 0;
              });
              const SortTh = ({ label, field }: { label: string; field: DelegSortKey }) => (
                <th onClick={() => handleDelegSort(field)}
                  style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: delegSortKey === field ? "#2c7df7" : "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap", cursor: "pointer", userSelect: "none" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                    {label}
                    {delegSortKey === field ? (delegSortDir === "desc" ? <ChevronDown size={10} /> : <ChevronUp size={10} />) : null}
                  </span>
                </th>
              );
              return (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>🏦 Delegation History</span>
                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{periods.length} baker{periods.length !== 1 ? 's' : ''}</span>
                    <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.2)" }}>· Click column headers to sort</span>
                  </div>
                  {(data as any).totalDelegatorRewards > 0 && (
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                      Total rewards: <span style={{ color: "#22c55e", fontWeight: 700 }}>{fmtXtz((data as any).totalDelegatorRewards)}</span>
                    </span>
                  )}
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <SortTh label="Baker" field="baker" />
                        <SortTh label="From" field="from" />
                        <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>To</th>
                        <SortTh label="Duration" field="duration" />
                        <SortTh label="Rewards Earned" field="rewards" />
                        <SortTh label="Avg APY" field="apy" />
                      </tr>
                    </thead>
                    <tbody>
                      {periods.map((p: any, i: number) => {
                        const fromDate = new Date(p.from);
                        const toDate = p.to ? new Date(p.to) : new Date();
                        const days = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
                        const isCurrentBaker = !p.to;
                        return (
                          <tr key={i} style={{ borderBottom: i < (data as any).delegationPeriods.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: isCurrentBaker ? "rgba(34,197,94,0.05)" : "transparent" }}>
                            <td style={{ padding: "0.75rem 1rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                {isCurrentBaker && <span style={{ fontSize: "0.55rem", fontWeight: 800, padding: "1px 5px", borderRadius: "8px", background: "rgba(34,197,94,0.2)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", whiteSpace: "nowrap" }}>CURRENT</span>}
                                <Link href={`/explorer/address/${p.bakerAddress}`} style={{ fontWeight: 700, color: isCurrentBaker ? "#22c55e" : "#2c7df7", textDecoration: "none", fontSize: "0.82rem" }}>
                                  {p.bakerAlias || p.baker}
                                </Link>
                              </div>
                            </td>
                            <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{fromDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                            <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{p.to ? new Date(p.to).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : <span style={{ color: "#22c55e", fontWeight: 700 }}>Present</span>}</td>
                            <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>
                              {days >= 365 ? `${Math.floor(days / 365)}y ${Math.floor((days % 365) / 30)}m` : days >= 30 ? `${Math.floor(days / 30)}m ${days % 30}d` : `${days}d`}
                            </td>
                            <td style={{ padding: "0.75rem 1rem", color: p.totalRewards > 0 ? "#22c55e" : "rgba(255,255,255,0.25)", fontWeight: p.totalRewards > 0 ? 700 : 400 }}>
                              {p.totalRewards > 0 ? `+${fmtXtz(p.totalRewards)}` : "—"}
                            </td>
                            <td style={{ padding: "0.75rem 1rem" }}>
                              {p.avgApy != null ? (
                                <span style={{ fontWeight: 800, color: p.avgApy >= 8 ? "#22c55e" : p.avgApy >= 5 ? "#f59e0b" : "#ef4444" }}>{p.avgApy.toFixed(2)}%</span>
                              ) : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              );
            })()}

            {/* Delegator: Recent reward cycles */}
            {data.type === "delegator" && (data as any).rewardCycles?.length > 0 && (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>💰 Recent Reward Cycles</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Cycle", "Baker", "Delegated Balance", "Rewards"].map(h => (
                          <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(data as any).rewardCycles.map((c: any, i: number) => (
                        <tr key={c.cycle} style={{ borderBottom: i < (data as any).rewardCycles.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{c.cycle}</td>
                          <td style={{ padding: "0.6rem 1rem" }}>
                            <Link href={`/explorer/address/${c.bakerAddress}`} style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700, fontSize: "0.78rem" }}>{c.baker}</Link>
                          </td>
                          <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.6)" }}>{fmtXtz(c.delegatedBalance)}</td>
                          <td style={{ padding: "0.6rem 1rem", color: c.rewards > 0 ? "#22c55e" : "rgba(255,255,255,0.25)", fontWeight: c.rewards > 0 ? 700 : 400 }}>
                            {c.rewards > 0 ? `+${fmtXtz(c.rewards)}` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quick links */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href={`https://tzkt.io/${data.address}/rewards`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700 }}>
                <ExternalLink size={12} /> View on TzKT
              </a>
              <Link href={`/staking`} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: "6px", color: "#f97316", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700 }}>
                🧭 Staking Calculator →
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!address && !isLoading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💰</div>
            <p style={{ fontSize: "0.9rem" }}>Enter a baker or delegator address above to view reward history</p>
          </div>
        )}
      </div>
    </div>
  );
}
