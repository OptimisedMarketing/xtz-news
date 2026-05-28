import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import {
  Shield, ChevronRight, Home, TrendingUp, ExternalLink,
  ArrowRight, ArrowUpDown, Search, ChevronUp, ChevronDown,
  ChevronLeft, X, Info, GitCompare,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";

const PAGE_SIZE = 10;
const MAX_COMPARE = 4;

// Distinct colours for each compared baker
const COMPARE_COLORS = ["#2c7df7", "#22c55e", "#f59e0b", "#ec4899"];

function formatXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K ꜩ`;
  return `${v.toFixed(2)} ꜩ`;
}

function templeDelegate(address: string) {
  return `https://app.templewallet.com/delegate?to=${address}`;
}

type SortKey = "rank" | "stakingBalance" | "ownBalance" | "numDelegators" | "apy";
type SortDir = "asc" | "desc";

// ── APY badge ─────────────────────────────────────────────────────────────────
function ApyBadge({ apy }: { apy: number | null }) {
  if (apy === null) return <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>;
  const color = apy >= 8 ? "#22c55e" : apy >= 5 ? "#f59e0b" : "#ef4444";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.5rem", borderRadius: "20px", background: `${color}18`, border: `1px solid ${color}40`, color, fontWeight: 800, fontSize: "0.78rem" }}>
      {apy.toFixed(2)}%
    </span>
  );
}

// ── Delegate button with tooltip ───────────────────────────────────────────────
function DelegateButton({ address }: { address: string }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <a
        href={templeDelegate(address)} target="_blank" rel="nofollow noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)} onBlur={() => setShow(false)}
        style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.35)", borderRadius: "4px", color: "#f97316", fontWeight: 700, fontSize: "0.7rem", textDecoration: "none", whiteSpace: "nowrap", transition: "background 0.15s, border-color 0.15s" }}
        onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.25)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.6)"; }}
        onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.15)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.35)"; }}
      >
        Delegate <ExternalLink size={10} />
      </a>
      {show && (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, background: "#1a2f52", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "6px", padding: "0.6rem 0.85rem", width: "210px", zIndex: 50, boxShadow: "0 8px 24px rgba(0,0,0,0.5)", pointerEvents: "none" }}>
          <div style={{ position: "absolute", bottom: "-5px", right: "18px", width: "9px", height: "9px", background: "#1a2f52", border: "1px solid rgba(44,125,247,0.3)", borderTop: "none", borderLeft: "none", transform: "rotate(45deg)" }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>🏛️</span>
            <div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.75rem", marginBottom: "0.2rem" }}>Opens Temple Wallet</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>Pre-filled with this baker's address so you can delegate in one click.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Baker detail modal ─────────────────────────────────────────────────────────
function BakerModal({ address, onClose }: { address: string; onClose: () => void }) {
  const { data, isLoading } = trpc.explorer.bakerDetail.useQuery({ address });
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const maxApy = data ? Math.max(...(data.cycles as any[]).map((c: any) => c.apy ?? 0), 1) : 1;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "12px", width: "100%", maxWidth: "680px", maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.7)" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#05152e", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "36px", height: "36px", background: "rgba(249,115,22,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={18} style={{ color: "#f97316" }} />
            </div>
            <div>
              <div style={{ fontWeight: 900, color: "#fff", fontSize: "1rem" }}>{isLoading ? "Loading…" : (data?.alias || "Unknown Baker")}</div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{address.slice(0, 20)}…</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "0.4rem", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex" }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: "1.5rem" }}>
          {isLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "1rem" }}><div className="skeleton" style={{ height: "10px", width: "60%", marginBottom: "8px" }} /><div className="skeleton" style={{ height: "20px", width: "80%" }} /></div>)}
            </div>
          ) : data ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {[
                  { label: "Avg APY (10 cycles)", value: data.avgApy != null ? `${data.avgApy}%` : "—", color: data.avgApy != null ? (data.avgApy >= 8 ? "#22c55e" : data.avgApy >= 5 ? "#f59e0b" : "#ef4444") : "rgba(255,255,255,0.4)" },
                  { label: "Avg Uptime", value: data.avgUptime != null ? `${data.avgUptime}%` : "—", color: data.avgUptime != null ? (data.avgUptime >= 99 ? "#22c55e" : "#f59e0b") : "rgba(255,255,255,0.4)" },
                  { label: "Fee Rate", value: data.feeRate != null ? `${data.feeRate}%` : "—", color: data.feeRate != null ? (data.feeRate <= 5 ? "#22c55e" : data.feeRate <= 15 ? "#f59e0b" : "#ef4444") : "rgba(255,255,255,0.4)" },
                  { label: "Staking Balance", value: formatXtz(data.stakingBalance), color: "#f97316" },
                  { label: "Delegators", value: data.numDelegators.toLocaleString(), color: "#2c7df7" },
                  { label: "Active Since", value: data.activeSince ? new Date(data.activeSince).getFullYear().toString() : "—", color: "rgba(255,255,255,0.7)" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "0.9rem 1rem" }}>
                    <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>{s.label}</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 900, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem" }}>APY History — Last 10 Cycles</h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "80px" }}>
                  {(data.cycles as any[]).slice().reverse().map((c: any) => {
                    const pct = c.apy != null ? Math.max(4, (c.apy / maxApy) * 100) : 4;
                    const color = c.apy != null ? (c.apy >= 8 ? "#22c55e" : c.apy >= 5 ? "#f59e0b" : "#ef4444") : "rgba(255,255,255,0.1)";
                    return (
                      <div key={c.cycle} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.35)" }}>{c.apy != null ? `${c.apy}%` : "—"}</div>
                        <div style={{ width: "100%", height: `${pct}%`, background: color, borderRadius: "3px 3px 0 0", minHeight: "4px", opacity: 0.85 }} />
                        <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.2)" }}>{c.cycle}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem" }}>Cycle Breakdown</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                  <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {["Cycle", "APY", "Uptime", "Rewards", "Blocks", "Missed"].map(h => (
                      <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {(data.cycles as any[]).map((c: any, i: number) => (
                      <tr key={c.cycle} style={{ borderBottom: i < data.cycles.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <td style={{ padding: "0.5rem 0.75rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{c.cycle}</td>
                        <td style={{ padding: "0.5rem 0.75rem" }}><ApyBadge apy={c.apy} /></td>
                        <td style={{ padding: "0.5rem 0.75rem", color: c.uptime != null ? (c.uptime >= 99 ? "#22c55e" : "#f59e0b") : "rgba(255,255,255,0.3)", fontWeight: 700 }}>{c.uptime != null ? `${c.uptime}%` : "—"}</td>
                        <td style={{ padding: "0.5rem 0.75rem", color: "#f97316", fontWeight: 600, whiteSpace: "nowrap" }}>{formatXtz(c.rewards)}</td>
                        <td style={{ padding: "0.5rem 0.75rem", color: "rgba(255,255,255,0.6)" }}>{c.blocks}/{c.expectedBlocks}</td>
                        <td style={{ padding: "0.5rem 0.75rem", color: c.missedBlocks > 0 ? "#ef4444" : "rgba(255,255,255,0.3)" }}>{c.missedBlocks > 0 ? c.missedBlocks : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <a href={templeDelegate(address)} target="_blank" rel="nofollow noopener noreferrer"
                  style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "6px", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", transition: "transform 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}>
                  <ExternalLink size={14} /> Delegate to this Baker
                </a>
                <Link href={`/explorer/address/${address}`} onClick={onClose}
                  style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "6px", color: "#2c7df7", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
                  View Full Address <ChevronRight size={14} />
                </Link>
              </div>
            </>
          ) : <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Failed to load baker data.</div>}
        </div>
      </div>
    </div>
  );
}

// ── Compare modal ──────────────────────────────────────────────────────────────
function CompareModal({ addresses, allBakers, onClose }: { addresses: string[]; allBakers: any[]; onClose: () => void }) {
  const queries = [
    trpc.explorer.bakerDetail.useQuery({ address: addresses[0] ?? "" }, { enabled: !!addresses[0] }),
    trpc.explorer.bakerDetail.useQuery({ address: addresses[1] ?? "" }, { enabled: !!addresses[1] }),
    trpc.explorer.bakerDetail.useQuery({ address: addresses[2] ?? "" }, { enabled: !!addresses[2] }),
    trpc.explorer.bakerDetail.useQuery({ address: addresses[3] ?? "" }, { enabled: !!addresses[3] }),
  ];

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const results = addresses.map((addr, i) => ({ addr, data: queries[i].data, loading: queries[i].isLoading }));
  const isLoading = results.some(r => r.loading);

  // Build aligned cycle list (union of all cycles, sorted desc)
  const allCycles = Array.from(new Set(
    results.flatMap(r => (r.data?.cycles as any[] ?? []).map((c: any) => c.cycle))
  )).sort((a, b) => b - a).slice(0, 10);

  // Max APY across all bakers for chart scaling
  const maxApy = Math.max(
    ...results.flatMap(r => (r.data?.cycles as any[] ?? []).map((c: any) => c.apy ?? 0)),
    1
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "12px", width: "100%", maxWidth: "900px", maxHeight: "92vh", overflow: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.7)" }}>
        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#05152e", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <GitCompare size={20} style={{ color: "#2c7df7" }} />
            <div>
              <div style={{ fontWeight: 900, color: "#fff", fontSize: "1rem" }}>Compare Bakers</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>{addresses.length} bakers selected</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "0.4rem", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.4)" }}>Loading baker data…</div>
          ) : (
            <>
              {/* Baker name chips */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {results.map((r, idx) => (
                  <div key={r.addr} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.9rem", background: `${COMPARE_COLORS[idx]}18`, border: `1px solid ${COMPARE_COLORS[idx]}50`, borderRadius: "20px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: COMPARE_COLORS[idx], flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.82rem" }}>{r.data?.alias || "Unknown Baker"}</span>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{r.addr.slice(0, 8)}…</span>
                  </div>
                ))}
              </div>

              {/* Key stats comparison table */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem" }}>Key Stats</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>Metric</th>
                        {results.map((r, idx) => (
                          <th key={r.addr} style={{ padding: "0.6rem 0.75rem", textAlign: "left", fontWeight: 700, color: COMPARE_COLORS[idx], fontSize: "0.75rem" }}>
                            {r.data?.alias || "Unknown"}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Avg APY (10 cycles)", get: (d: any) => d?.avgApy != null ? `${d.avgApy}%` : "—", highlight: (d: any) => d?.avgApy != null ? (d.avgApy >= 8 ? "#22c55e" : d.avgApy >= 5 ? "#f59e0b" : "#ef4444") : "rgba(255,255,255,0.4)" },
                        { label: "Avg Uptime", get: (d: any) => d?.avgUptime != null ? `${d.avgUptime}%` : "—", highlight: (d: any) => d?.avgUptime != null ? (d.avgUptime >= 99 ? "#22c55e" : "#f59e0b") : "rgba(255,255,255,0.4)" },
                        { label: "Fee Rate", get: (d: any) => d?.feeRate != null ? `${d.feeRate}%` : "—", highlight: (d: any) => d?.feeRate != null ? (d.feeRate <= 5 ? "#22c55e" : d.feeRate <= 15 ? "#f59e0b" : "#ef4444") : "rgba(255,255,255,0.4)" },
                        { label: "Staking Balance", get: (d: any) => d ? formatXtz(d.stakingBalance) : "—", highlight: () => "#f97316" },
                        { label: "Delegators", get: (d: any) => d ? d.numDelegators.toLocaleString() : "—", highlight: () => "rgba(255,255,255,0.7)" },
                        { label: "Active Since", get: (d: any) => d?.activeSince ? new Date(d.activeSince).getFullYear().toString() : "—", highlight: () => "rgba(255,255,255,0.6)" },
                      ].map((row, ri) => (
                        <tr key={row.label} style={{ borderBottom: ri < 5 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <td style={{ padding: "0.6rem 0.75rem", color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", fontWeight: 600 }}>{row.label}</td>
                          {results.map((r, idx) => (
                            <td key={r.addr} style={{ padding: "0.6rem 0.75rem", fontWeight: 800, color: row.highlight(r.data), fontSize: "0.85rem" }}>
                              {row.get(r.data)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* APY history side-by-side bar chart */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem" }}>
                  APY History — Last 10 Cycles (side-by-side)
                </h3>
                {/* Legend */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {results.map((r, idx) => (
                    <div key={r.addr} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: COMPARE_COLORS[idx] }} />
                      <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{r.data?.alias || "Unknown"}</span>
                    </div>
                  ))}
                </div>
                {/* Chart */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px" }}>
                  {allCycles.map(cycle => (
                    <div key={cycle} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                      {/* Grouped bars */}
                      <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", width: "100%", height: "95px" }}>
                        {results.map((r, idx) => {
                          const cycleData = (r.data?.cycles as any[] ?? []).find((c: any) => c.cycle === cycle);
                          const apy = cycleData?.apy ?? null;
                          const pct = apy != null ? Math.max(3, (apy / maxApy) * 100) : 3;
                          return (
                            <div key={idx} title={apy != null ? `${r.data?.alias || "Baker"}: ${apy}%` : "No data"}
                              style={{ flex: 1, height: `${pct}%`, background: apy != null ? COMPARE_COLORS[idx] : "rgba(255,255,255,0.06)", borderRadius: "2px 2px 0 0", minHeight: "3px", opacity: apy != null ? 0.85 : 0.4, transition: "opacity 0.15s" }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = apy != null ? "0.85" : "0.4")}
                            />
                          );
                        })}
                      </div>
                      <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>{cycle}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-cycle APY table */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem" }}>APY Per Cycle</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase" }}>Cycle</th>
                        {results.map((r, idx) => (
                          <th key={r.addr} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontWeight: 700, color: COMPARE_COLORS[idx], fontSize: "0.72rem" }}>
                            {r.data?.alias || "Unknown"}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allCycles.map((cycle, ci) => (
                        <tr key={cycle} style={{ borderBottom: ci < allCycles.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <td style={{ padding: "0.5rem 0.75rem", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>{cycle}</td>
                          {results.map((r, idx) => {
                            const c = (r.data?.cycles as any[] ?? []).find((x: any) => x.cycle === cycle);
                            return <td key={r.addr} style={{ padding: "0.5rem 0.75rem" }}><ApyBadge apy={c?.apy ?? null} /></td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Delegate CTAs */}
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                {results.map((r, idx) => (
                  <a key={r.addr} href={templeDelegate(r.addr)} target="_blank" rel="nofollow noopener noreferrer"
                    style={{ flex: 1, minWidth: "160px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.65rem 1rem", background: `${COMPARE_COLORS[idx]}20`, border: `1px solid ${COMPARE_COLORS[idx]}50`, borderRadius: "6px", color: COMPARE_COLORS[idx], fontWeight: 700, fontSize: "0.78rem", textDecoration: "none", transition: "background 0.15s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = `${COMPARE_COLORS[idx]}35`)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = `${COMPARE_COLORS[idx]}20`)}>
                    <ExternalLink size={12} /> Delegate to {r.data?.alias || "Baker"}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sortable column header ─────────────────────────────────────────────────────
function SortTh({ label, field, current, dir, onSort }: { label: string; field: SortKey; current: SortKey; dir: SortDir; onSort: (f: SortKey) => void }) {
  const active = current === field;
  return (
    <th onClick={() => onSort(field)}
      style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: active ? "#2c7df7" : "rgba(255,255,255,0.4)", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", transition: "color 0.15s" }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
        {label}
        {active ? (dir === "desc" ? <ChevronDown size={11} /> : <ChevronUp size={11} />) : <ArrowUpDown size={10} style={{ opacity: 0.4 }} />}
      </span>
    </th>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
  else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }
  const btn: React.CSSProperties = { minWidth: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", padding: "0 0.4rem" };
  const active: React.CSSProperties = { ...btn, background: "#2c7df7", borderColor: "#2c7df7", color: "#fff" };
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
      <button disabled={page === 1} onClick={() => onChange(page - 1)} style={{ ...btn, opacity: page === 1 ? 0.3 : 1 }}><ChevronLeft size={14} /></button>
      {pages.map((p, i) => p === "…"
        ? <span key={`e${i}`} style={{ color: "rgba(255,255,255,0.3)", padding: "0 0.25rem" }}>…</span>
        : <button key={p} onClick={() => onChange(p as number)} style={p === page ? active : btn}
            onMouseEnter={(e) => { if (p !== page) (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.5)"; }}
            onMouseLeave={(e) => { if (p !== page) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>{p}</button>
      )}
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)} style={{ ...btn, opacity: page === totalPages ? 0.3 : 1 }}><ChevronRight size={14} /></button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function BakersPage() {
  useSEO({
    title: "Tezos Baker Leaderboard | XTZ.News — Top Tezos Validators",
    description: "Compare Tezos bakers side-by-side. Real APY data, uptime, fee rates. Find the best baker to delegate your XTZ to.",
    keywords: "Tezos bakers, Tezos validators, Tezos staking APY, XTZ delegation, compare bakers",
    canonical: "https://xtz.news/explorer/bakers",
  });

  const { data: bakers = [], isLoading } = trpc.explorer.bakers.useQuery({ limit: 50 });

  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterQuery, setFilterQuery] = useState("");
  const [minDelegators, setMinDelegators] = useState<number | "">("");
  const [page, setPage] = useState(1);
  const [selectedBaker, setSelectedBaker] = useState<string | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  function toggleCompare(address: string, e: React.MouseEvent) {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.includes(address)) return prev.filter(a => a !== address);
      if (prev.length >= MAX_COMPARE) return prev; // max 4
      return [...prev, address];
    });
  }

  function handleSort(field: SortKey) {
    if (sortKey === field) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(field); setSortDir("desc"); }
    setPage(1);
  }

  function handleFilterChange(fn: () => void) { fn(); setPage(1); }

  const processed = useMemo(() => {
    let list = [...(bakers as any[])];
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      list = list.filter(b => (b.alias || "").toLowerCase().includes(q) || b.address.toLowerCase().includes(q));
    }
    if (minDelegators !== "" && !isNaN(Number(minDelegators))) {
      list = list.filter(b => b.numDelegators >= Number(minDelegators));
    }
    list.sort((a, b) => {
      const av = a[sortKey] ?? (sortKey === "apy" ? -1 : 0);
      const bv = b[sortKey] ?? (sortKey === "apy" ? -1 : 0);
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return list;
  }, [bakers, sortKey, sortDir, filterQuery, minDelegators]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = processed.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Modals */}
      {selectedBaker && <BakerModal address={selectedBaker} onClose={() => setSelectedBaker(null)} />}
      {showCompare && compareList.length >= 2 && (
        <CompareModal addresses={compareList} allBakers={bakers as any[]} onClose={() => setShowCompare(false)} />
      )}

      {/* Sticky compare bar */}
      {compareList.length > 0 && (
        <div style={{ position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 100, background: "#0d2a5e", border: "1px solid rgba(44,125,247,0.4)", borderRadius: "12px", padding: "0.75rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 8px 32px rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", flexWrap: "wrap", maxWidth: "calc(100vw - 2rem)" }}>
          <GitCompare size={16} style={{ color: "#2c7df7", flexShrink: 0 }} />
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {compareList.map((addr, idx) => {
              const baker = (bakers as any[]).find((b: any) => b.address === addr);
              return (
                <div key={addr} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", background: `${COMPARE_COLORS[idx]}20`, border: `1px solid ${COMPARE_COLORS[idx]}50`, borderRadius: "20px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COMPARE_COLORS[idx] }} />
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>{baker?.alias || addr.slice(0, 8) + "…"}</span>
                  <button onClick={(e) => toggleCompare(addr, e)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: "0", display: "flex", lineHeight: 1 }}>
                    <X size={11} />
                  </button>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
            {compareList.length >= 2 && (
              <button onClick={() => setShowCompare(true)}
                style={{ padding: "0.45rem 1rem", background: "#2c7df7", border: "none", borderRadius: "6px", color: "#fff", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.15s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a6de0")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c7df7")}>
                Compare {compareList.length} Bakers
              </button>
            )}
            {compareList.length < MAX_COMPARE && (
              <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", alignSelf: "center", whiteSpace: "nowrap" }}>
                +{MAX_COMPARE - compareList.length} more
              </span>
            )}
            <button onClick={() => setCompareList([])} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "0.4rem 0.6rem", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", fontSize: "0.7rem" }}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}><Home size={12} /></Link>
            <ChevronRight size={10} />
            <Link href="/explorer" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Explorer</Link>
            <ChevronRight size={10} />
            <span style={{ color: "#fff" }}>Bakers</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "40px", height: "40px", background: "rgba(249,115,22,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={20} style={{ color: "#f97316" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>Baker Leaderboard</h1>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>Real APY · Sort & filter · Click row to inspect · Tick to compare</p>
              </div>
            </div>
            <a href="/how-to-stake-on-tezos"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "6px", color: "#fff", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", boxShadow: "0 4px 14px rgba(249,115,22,0.35)", transition: "transform 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
              <TrendingUp size={14} /> How to Delegate XTZ
            </a>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem", paddingBottom: compareList.length > 0 ? "6rem" : "2rem" }}>
        {/* CTA Banner */}
        <div style={{ marginBottom: "1.75rem", padding: "1.5rem", background: "linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(234,88,12,0.06) 100%)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{ width: "44px", height: "44px", background: "rgba(249,115,22,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TrendingUp size={22} style={{ color: "#f97316" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 900, color: "#fff", margin: "0 0 0.3rem" }}>Earn up to ~9% APY by Delegating Your XTZ</h2>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6, maxWidth: "520px" }}>
                <strong style={{ color: "#fff" }}>Tick the checkbox</strong> on up to 4 bakers to compare their APY history side-by-side. Click any row to inspect details. Then <strong style={{ color: "#f97316" }}>Delegate</strong> in one click via Temple Wallet.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", flexShrink: 0 }}>
            <a href="/how-to-stake-on-tezos"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.25rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "6px", color: "#fff", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", boxShadow: "0 4px 14px rgba(249,115,22,0.3)", transition: "transform 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}>
              Delegation Guide <ArrowRight size={13} />
            </a>
            <a href="https://templewallet.com" target="_blank" rel="nofollow noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.25rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: "0.82rem", textDecoration: "none", transition: "border-color 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.5)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)")}>
              <ExternalLink size={13} /> Get Temple Wallet
            </a>
          </div>
        </div>

        {/* Filter / sort controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: "180px" }}>
            <Search size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.35)", pointerEvents: "none" }} />
            <input value={filterQuery}
              onChange={(e) => handleFilterChange(() => setFilterQuery(e.target.value))}
              placeholder="Search by baker name or address…"
              style={{ width: "100%", padding: "0.55rem 0.75rem 0.55rem 2.2rem", background: "#05152e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", color: "#fff", fontSize: "0.8rem", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>Min delegators:</span>
            <input type="number" min={0} value={minDelegators}
              onChange={(e) => handleFilterChange(() => setMinDelegators(e.target.value === "" ? "" : Number(e.target.value)))}
              placeholder="Any"
              style={{ width: "70px", padding: "0.55rem 0.6rem", background: "#05152e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", color: "#fff", fontSize: "0.8rem", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {([
              { label: "Highest APY", key: "apy" as SortKey, dir: "desc" as SortDir },
              { label: "Most Delegators", key: "numDelegators" as SortKey, dir: "desc" as SortDir },
              { label: "Largest Baker", key: "stakingBalance" as SortKey, dir: "desc" as SortDir },
            ]).map(btn => {
              const active = sortKey === btn.key && sortDir === btn.dir;
              return (
                <button key={btn.label} onClick={() => { setSortKey(btn.key); setSortDir(btn.dir); setPage(1); }}
                  style={{ padding: "0.4rem 0.8rem", background: active ? "rgba(44,125,247,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${active ? "rgba(44,125,247,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "20px", color: active ? "#2c7df7" : "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                  {btn.label}
                </button>
              );
            })}
            {(filterQuery || minDelegators !== "") && (
              <button onClick={() => handleFilterChange(() => { setFilterQuery(""); setMinDelegators(""); })}
                style={{ padding: "0.4rem 0.8rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "20px", color: "#ef4444", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer" }}>
                Clear filters
              </button>
            )}
          </div>
          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>
            {processed.length} baker{processed.length !== 1 ? "s" : ""}
            {totalPages > 1 && ` · page ${safePage}/${totalPages}`}
          </span>
        </div>

        {/* Baker table */}
        <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {/* Compare checkbox header */}
                  <th style={{ padding: "0.75rem 0.5rem 0.75rem 1rem", width: "36px" }}>
                    <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.06em" }}>CMP</span>
                  </th>
                  <SortTh label="Rank" field="rank" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Baker</th>
                  <SortTh label="Staking Balance" field="stakingBalance" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Own Balance" field="ownBalance" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Delegators" field="numDelegators" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="APY (30d)" field="apy" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <th style={{ padding: "0.75rem 1rem" }} />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td colSpan={8} style={{ padding: "0.75rem 1rem" }}><div className="skeleton" style={{ height: "14px", width: "100%" }} /></td>
                    </tr>
                  ))
                ) : pageItems.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No bakers match your filters.</td></tr>
                ) : pageItems.map((baker: any, i: number) => {
                  const inCompare = compareList.includes(baker.address);
                  const compareIdx = compareList.indexOf(baker.address);
                  const compareColor = inCompare ? COMPARE_COLORS[compareIdx] : null;
                  const atMax = !inCompare && compareList.length >= MAX_COMPARE;
                  return (
                    <tr key={baker.address}
                      style={{ borderBottom: i < pageItems.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s", cursor: "pointer", background: inCompare ? `${compareColor}08` : "transparent" }}
                      onMouseEnter={(e) => { if (!inCompare) (e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.04)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = inCompare ? `${compareColor}08` : "transparent"; }}
                      onClick={() => setSelectedBaker(baker.address)}>
                      {/* Compare checkbox */}
                      <td style={{ padding: "0.75rem 0.5rem 0.75rem 1rem" }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => toggleCompare(baker.address, e)}
                          disabled={atMax}
                          title={atMax ? `Max ${MAX_COMPARE} bakers` : inCompare ? "Remove from compare" : "Add to compare"}
                          style={{
                            width: "20px", height: "20px", borderRadius: "4px", cursor: atMax ? "not-allowed" : "pointer",
                            border: `2px solid ${inCompare ? compareColor! : "rgba(255,255,255,0.2)"}`,
                            background: inCompare ? `${compareColor}30` : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s", opacity: atMax ? 0.3 : 1,
                          }}>
                          {inCompare && <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: compareColor! }} />}
                        </button>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 900, color: baker.rank <= 3 ? "#f59e0b" : "rgba(255,255,255,0.4)" }}>
                          {baker.rank <= 3 ? "🏆" : ""} #{baker.rank}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ fontWeight: 700, color: inCompare ? compareColor! : "#fff", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          {inCompare && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: compareColor!, flexShrink: 0 }} />}
                          {baker.alias || "Unknown Baker"}
                          <Info size={11} style={{ color: "rgba(44,125,247,0.5)", flexShrink: 0 }} />
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{baker.address.slice(0, 12)}...</div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#f97316", whiteSpace: "nowrap" }}>{formatXtz(baker.stakingBalance)}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>{formatXtz(baker.ownBalance)}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.7)" }}>{baker.numDelegators.toLocaleString()}</td>
                      <td style={{ padding: "0.75rem 1rem" }}><ApyBadge apy={baker.apy} /></td>
                      <td style={{ padding: "0.75rem 1rem" }} onClick={(e) => e.stopPropagation()}>
                        <DelegateButton address={baker.address} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && <Pagination page={safePage} totalPages={totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}

        {/* APY note */}
        {!isLoading && (
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: "0.75rem" }}>
            APY calculated from the last completed cycle's actual rewards ÷ baking power × 365. Tick checkboxes to compare up to 4 bakers. Past performance does not guarantee future returns.
          </p>
        )}

        {/* Info cards */}
        <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {[
            { icon: "🔒", title: "Non-custodial", body: "Your XTZ never leaves your wallet. Bakers cannot spend your funds." },
            { icon: "💸", title: "Up to ~9% APY", body: "Rewards are paid every cycle (~1 day). No minimum amount required." },
            { icon: "🔓", title: "No lock-up", body: "Undelegate at any time. Rewards stop at the end of the current cycle." },
          ].map(card => (
            <div key={card.title} style={{ padding: "1.1rem 1.25rem", background: "rgba(44,125,247,0.05)", border: "1px solid rgba(44,125,247,0.12)", borderRadius: "8px" }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{card.icon}</div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.85rem", marginBottom: "0.3rem" }}>{card.title}</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{card.body}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
          <a href="/how-to-stake-on-tezos" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#2c7df7", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none" }}>
            Read the full Tezos staking &amp; delegation guide <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
