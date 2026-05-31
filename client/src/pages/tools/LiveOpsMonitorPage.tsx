import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronRight, Home, RefreshCw, ExternalLink, ArrowUpRight, ArrowDownLeft, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO, buildToolSchema } from "@/hooks/useSEO";

function fmtXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K ꜩ`;
  return `${v.toFixed(2)} ꜩ`;
}
function timeAgo(ts: string) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const TYPE_COLORS: Record<string, string> = {
  transaction: "#2c7df7",
  delegation: "#22c55e",
  origination: "#8b5cf6",
  transfer: "#f97316",
};
const TYPE_ICONS: Record<string, string> = {
  transaction: "↔️",
  delegation: "🔗",
  origination: "🏗️",
  transfer: "🪙",
};

type OpType = 'transaction' | 'delegation' | 'origination' | 'transfer';

export default function LiveOpsMonitorPage() {
  useSEO({
    title: "Tezos Live Operations Monitor — Real-Time On-Chain Activity | XTZ.News",
    description: "Real-time feed of Tezos on-chain operations: transactions, delegations, originations, and token transfers. Filter by type and minimum XTZ amount.",
    keywords: "Tezos live transactions, XTZ on-chain activity, Tezos blockchain monitor, Tezos operations feed",
    canonical: "https://xtz.news/tools/live-ops",
    jsonLd: buildToolSchema({ name: "Tezos Live Operations Monitor", description: "Real-time feed of Tezos on-chain operations: transactions, delegations, originations, and token transfers. Filter by type and minimum XTZ amount.", url: "https://xtz.news/tools/live-ops" }),
  });

  const [selectedTypes, setSelectedTypes] = useState<OpType[]>(['transaction', 'delegation']);
  const [minAmount, setMinAmount] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(8);
  const [newHashes, setNewHashes] = useState<Set<string>>(new Set());
  const prevHashesRef = useRef<Set<string>>(new Set());

  const { data: ops = [], isLoading, refetch } = trpc.tools.liveOps.useQuery(
    { types: selectedTypes, minAmount, limit: 40 },
    { staleTime: 5_000 }
  );

  // Auto-refresh every 8 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => { refetch(); setCountdown(8); }, 8_000);
    return () => clearInterval(id);
  }, [autoRefresh, refetch, selectedTypes, minAmount]);

  // Countdown
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => setCountdown(c => c <= 1 ? 8 : c - 1), 1_000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  // Detect new ops
  useEffect(() => {
    if (!(ops as any[]).length) return;
    const current = new Set((ops as any[]).map((o: any) => o.hash || o.timestamp));
    const newOnes = new Set<string>();
    current.forEach((h: unknown) => {
      const hash = h as string;
      if (!prevHashesRef.current.has(hash) && prevHashesRef.current.size > 0) newOnes.add(hash);
    });
    if (newOnes.size > 0) {
      setNewHashes(newOnes);
      setTimeout(() => setNewHashes(new Set()), 2500);
    }
    prevHashesRef.current = current as Set<string>;
  }, [ops]);

  const toggleType = (type: OpType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

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
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Live Operations</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "40px", height: "40px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>⚡</div>
              <div>
                <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Live Operations Monitor</h1>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>Real-time feed of Tezos on-chain operations — transactions, delegations, originations, token transfers</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.875rem", background: autoRefresh ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.06)", border: `1px solid ${autoRefresh ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: "20px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: autoRefresh ? "#22c55e" : "rgba(255,255,255,0.3)", animation: autoRefresh ? "pulse 2s infinite" : "none" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: autoRefresh ? "#22c55e" : "rgba(255,255,255,0.4)" }}>
                  {autoRefresh ? `LIVE · ${countdown}s` : "PAUSED"}
                </span>
              </div>
              <button onClick={() => setAutoRefresh(v => !v)}
                style={{ padding: "0.4rem 0.875rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>
                {autoRefresh ? "⏸ Pause" : "▶ Resume"}
              </button>
              <button onClick={() => { refetch(); setCountdown(8); }}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.875rem", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "6px", color: "#2c7df7", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Show:</span>
            {(['transaction', 'delegation', 'origination', 'transfer'] as OpType[]).map(type => (
              <button key={type} onClick={() => toggleType(type)}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.875rem", background: selectedTypes.includes(type) ? `${TYPE_COLORS[type]}22` : "rgba(255,255,255,0.05)", border: `1px solid ${selectedTypes.includes(type) ? TYPE_COLORS[type] + "55" : "rgba(255,255,255,0.1)"}`, borderRadius: "20px", color: selectedTypes.includes(type) ? TYPE_COLORS[type] : "rgba(255,255,255,0.4)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>
                {TYPE_ICONS[type]} {type.charAt(0).toUpperCase() + type.slice(1)}s
              </button>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Min XTZ:</span>
              <select value={minAmount} onChange={(e) => setMinAmount(Number(e.target.value))}
                style={{ padding: "0.25rem 0.5rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px", color: "#fff", fontSize: "0.72rem", cursor: "pointer" }}>
                {[0, 100, 1000, 10000, 100000].map(v => (
                  <option key={v} value={v} style={{ background: "#05152e" }}>{v === 0 ? "Any" : `${v.toLocaleString()} ꜩ`}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "1.5rem 1.25rem 4rem" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "56px", borderRadius: "6px" }} />)}
          </div>
        )}

        {!isLoading && (ops as any[]).length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", background: "#05152e", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡</div>
            <p>No operations found for the selected filters. Try enabling more operation types.</p>
          </div>
        )}

        {!isLoading && (ops as any[]).length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {(ops as any[]).map((op: any, i: number) => {
              const isNew = newHashes.has(op.hash || op.timestamp);
              const color = TYPE_COLORS[op.type] || "#2c7df7";
              return (
                <div key={`${op.hash}-${i}`} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.75rem 1.25rem", background: isNew ? `${color}11` : "#05152e", border: `1px solid ${isNew ? color + "44" : "rgba(255,255,255,0.06)"}`, borderRadius: "7px", transition: "background 0.5s, border-color 0.5s", flexWrap: "wrap" }}>
                  {/* Type badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.9rem" }}>{TYPE_ICONS[op.type]}</span>
                    <span style={{ fontSize: "0.6rem", fontWeight: 800, padding: "1px 6px", borderRadius: "8px", background: `${color}22`, color, border: `1px solid ${color}44`, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                      {op.type}
                    </span>
                  </div>

                  {/* From → To */}
                  <div style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                    {op.senderAddress ? (
                      <Link href={`/explorer/address/${op.senderAddress}`} style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2c7df7", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "150px" }}>
                        {op.sender || op.senderAddress.slice(0, 12) + "…"}
                      </Link>
                    ) : <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>—</span>}
                    <ArrowUpRight size={11} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                    {op.targetAddress ? (
                      <Link href={`/explorer/address/${op.targetAddress}`} style={{ fontSize: "0.78rem", fontWeight: 700, color: "#5a9fff", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "150px" }}>
                        {op.target || op.targetAddress.slice(0, 12) + "…"}
                      </Link>
                    ) : <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>{op.target || "—"}</span>}
                  </div>

                  {/* Amount / token */}
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    {op.type === 'transfer' && op.tokenName ? (
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#f97316" }}>
                        {op.tokenAmount} {op.tokenName.slice(0, 12)}
                      </div>
                    ) : op.amount > 0 ? (
                      <div style={{ fontSize: "0.82rem", fontWeight: 800, color: color }}>{fmtXtz(op.amount)}</div>
                    ) : null}
                  </div>

                  {/* Time + TzKT link */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>{timeAgo(op.timestamp)}</span>
                    {op.hash && (
                      <a href={`https://tzkt.io/${op.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.25)", display: "flex" }}>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
