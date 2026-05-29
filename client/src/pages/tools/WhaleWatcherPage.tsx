import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronRight, Home, ExternalLink, RefreshCw, ArrowUpRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

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
function sizeLabel(xtz: number) {
  if (xtz >= 1_000_000) return { label: "🐳 Mega Whale", color: "#ef4444" };
  if (xtz >= 100_000) return { label: "🐋 Whale", color: "#f97316" };
  if (xtz >= 10_000) return { label: "🦈 Shark", color: "#f59e0b" };
  return { label: "🐟 Fish", color: "#2c7df7" };
}

const THRESHOLDS = [
  { label: "10K+", value: 10_000 },
  { label: "50K+", value: 50_000 },
  { label: "100K+", value: 100_000 },
  { label: "500K+", value: 500_000 },
  { label: "1M+", value: 1_000_000 },
];

export default function WhaleWatcherPage() {
  const [minXtz, setMinXtz] = useState(10_000);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [newTxIds, setNewTxIds] = useState<Set<string>>(new Set());
  const prevHashesRef = useRef<Set<string>>(new Set());
  const [tick, setTick] = useState(0);

  const { data: txs = [], isLoading, refetch } = trpc.tools.whaleTxs.useQuery(
    { minXtz, limit: 30 },
    { staleTime: 15_000 }
  );

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      refetch();
      setLastRefresh(Date.now());
      setTick(t => t + 1);
    }, 15_000);
    return () => clearInterval(id);
  }, [autoRefresh, refetch]);

  // Countdown timer
  const [countdown, setCountdown] = useState(15);
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) return 15;
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [autoRefresh, lastRefresh]);

  // Detect new transactions
  useEffect(() => {
    if (!txs.length) return;
    const currentHashes = new Set(txs.map((t: any) => t.hash));
    const newOnes = new Set<string>();
        currentHashes.forEach((h: unknown) => {
      const hash = h as string;
      if (!prevHashesRef.current.has(hash) && prevHashesRef.current.size > 0) {
        newOnes.add(hash);
      }
    });
    if (newOnes.size > 0) {
      setNewTxIds(newOnes);
      setTimeout(() => setNewTxIds(new Set()), 3000);
    }
    prevHashesRef.current = currentHashes as Set<string>;
  }, [txs]);

  const handleRefresh = () => {
    refetch();
    setLastRefresh(Date.now());
    setCountdown(15);
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
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Whale Watcher</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "40px", height: "40px", background: "rgba(44,125,247,0.2)", border: "1px solid rgba(44,125,247,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🐋</div>
              <div>
                <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Whale Watcher</h1>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>Live feed of large XTZ transfers on the Tezos network</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              {/* Live indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.875rem", background: autoRefresh ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.06)", border: `1px solid ${autoRefresh ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: "20px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: autoRefresh ? "#22c55e" : "rgba(255,255,255,0.3)", animation: autoRefresh ? "pulse 2s infinite" : "none" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: autoRefresh ? "#22c55e" : "rgba(255,255,255,0.4)" }}>
                  {autoRefresh ? `LIVE · ${countdown}s` : "PAUSED"}
                </span>
              </div>
              {/* Toggle auto-refresh */}
              <button onClick={() => setAutoRefresh(v => !v)}
                style={{ padding: "0.4rem 0.875rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>
                {autoRefresh ? "⏸ Pause" : "▶ Resume"}
              </button>
              {/* Manual refresh */}
              <button onClick={handleRefresh}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.875rem", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "6px", color: "#2c7df7", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
          </div>

          {/* Threshold selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Min size:</span>
            {THRESHOLDS.map(t => (
              <button key={t.value} onClick={() => { setMinXtz(t.value); setCountdown(15); }}
                style={{ padding: "0.3rem 0.875rem", background: minXtz === t.value ? "rgba(44,125,247,0.25)" : "rgba(255,255,255,0.05)", border: `1px solid ${minXtz === t.value ? "rgba(44,125,247,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "20px", color: minXtz === t.value ? "#2c7df7" : "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "1.5rem 1.25rem 4rem" }}>
        {/* Loading */}
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "64px", borderRadius: "8px" }} />
            ))}
          </div>
        )}

        {/* Transactions */}
        {!isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {txs.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.3)", background: "#05152e", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌊</div>
                <p>No transactions above {fmtXtz(minXtz)} found recently. Try a lower threshold.</p>
              </div>
            )}
            {txs.map((tx: any, i: number) => {
              const size = sizeLabel(tx.amount);
              const isNew = newTxIds.has(tx.hash);
              return (
                <div key={tx.hash} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1.25rem", background: isNew ? "rgba(34,197,94,0.08)" : "#05152e", border: `1px solid ${isNew ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: "8px", transition: "background 0.5s, border-color 0.5s", flexWrap: "wrap" }}>
                  {/* Size badge */}
                  <div style={{ fontSize: "1.1rem", flexShrink: 0 }}>{size.label.split(" ")[0]}</div>
                  {/* Amount */}
                  <div style={{ minWidth: "120px" }}>
                    <div style={{ fontSize: "1rem", fontWeight: 900, color: size.color }}>{fmtXtz(tx.amount)}</div>
                    <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)" }}>{size.label.split(" ").slice(1).join(" ")}</div>
                  </div>
                  {/* From → To */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <Link href={`/explorer/address/${tx.senderAddress}`} style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2c7df7", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
                        {tx.sender || tx.senderAddress.slice(0, 14) + "…"}
                      </Link>
                      <ArrowUpRight size={12} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                      <Link href={`/explorer/address/${tx.targetAddress}`} style={{ fontSize: "0.78rem", fontWeight: 700, color: "#5a9fff", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
                        {tx.target || tx.targetAddress.slice(0, 14) + "…"}
                      </Link>
                    </div>
                  </div>
                  {/* Time + TzKT link */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>{timeAgo(tx.timestamp)}</span>
                    <a href={`https://tzkt.io/${tx.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.3)", display: "flex" }}>
                      <ExternalLink size={12} />
                    </a>
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
