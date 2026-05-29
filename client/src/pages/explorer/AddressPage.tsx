import { useState } from "react";
import { Link, useParams } from "wouter";
import { User, ChevronRight, Home, ArrowRightLeft, Shield, Copy, TrendingUp, TrendingDown, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "sonner";

function shortHash(h: string, len = 10) { return h ? `${h.slice(0, len)}...${h.slice(-6)}` : ""; }
function timeAgo(ts: string | null | undefined) {
  if (!ts) return "—";
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}
function formatXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K ꜩ`;
  return `${v.toFixed(2)} ꜩ`;
}

// ── Delegation History Chart ───────────────────────────────────────────────────
function DelegationHistoryTab({ address }: { address: string }) {
  const [range, setRange] = useState<20 | 50 | 100>(50);
  const { data: history = [], isLoading } = trpc.explorer.delegationHistory.useQuery(
    { address, cycles: range },
    { staleTime: 5 * 60_000 }
  );

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: "14px", width: `${70 + i * 8}%` }} />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>
        No delegation history available for this address.
      </div>
    );
  }

  // Compute trend
  const first = history[0];
  const last = history[history.length - 1];
  const delegatorDelta = last.delegatorsCount - first.delegatorsCount;
  const balanceDelta = last.totalDelegated - first.totalDelegated;
  const trend = delegatorDelta > 0 ? "growing" : delegatorDelta < 0 ? "shrinking" : "stable";

  // Chart dimensions
  const maxDelegators = Math.max(...history.map(h => h.delegatorsCount), 1);
  const minDelegators = Math.min(...history.map(h => h.delegatorsCount));
  const maxBalance = Math.max(...history.map(h => h.totalDelegated), 1);

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* Range selector + trend summary */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Trend badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", background: trend === "growing" ? "rgba(34,197,94,0.12)" : trend === "shrinking" ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.06)", border: `1px solid ${trend === "growing" ? "rgba(34,197,94,0.3)" : trend === "shrinking" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: "20px" }}>
            {trend === "growing" ? <TrendingUp size={13} style={{ color: "#22c55e" }} /> : trend === "shrinking" ? <TrendingDown size={13} style={{ color: "#ef4444" }} /> : <Users size={13} style={{ color: "rgba(255,255,255,0.4)" }} />}
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: trend === "growing" ? "#22c55e" : trend === "shrinking" ? "#ef4444" : "rgba(255,255,255,0.5)" }}>
              {trend === "growing" ? `+${delegatorDelta} delegators` : trend === "shrinking" ? `${delegatorDelta} delegators` : "Stable"}
            </span>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>over {history.length} cycles</span>
          </div>
          {/* Balance delta */}
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
            Delegated: <span style={{ fontWeight: 700, color: balanceDelta >= 0 ? "#22c55e" : "#ef4444" }}>
              {balanceDelta >= 0 ? "+" : ""}{formatXtz(balanceDelta)}
            </span>
          </div>
        </div>
        {/* Range buttons */}
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {([20, 50, 100] as const).map(r => (
            <button key={r} onClick={() => setRange(r)}
              style={{ padding: "0.3rem 0.7rem", background: range === r ? "rgba(44,125,247,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${range === r ? "rgba(44,125,247,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "4px", color: range === r ? "#2c7df7" : "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer" }}>
              {r} cycles
            </button>
          ))}
        </div>
      </div>

      {/* Delegator count chart */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Users size={12} /> Delegator Count
          <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.25)", textTransform: "none", letterSpacing: 0 }}>— current: {last.delegatorsCount.toLocaleString()}</span>
        </div>
        {/* Bar chart */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "100px", background: "rgba(255,255,255,0.02)", borderRadius: "6px", padding: "8px 8px 0" }}>
          {history.map((h, i) => {
            const pct = maxDelegators > minDelegators
              ? Math.max(4, ((h.delegatorsCount - minDelegators) / (maxDelegators - minDelegators)) * 100)
              : 50;
            const isLast = i === history.length - 1;
            return (
              <div key={h.cycle} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }} title={`Cycle ${h.cycle}: ${h.delegatorsCount} delegators`}>
                <div style={{ width: "100%", height: `${pct}%`, background: isLast ? "#2c7df7" : "rgba(44,125,247,0.5)", borderRadius: "2px 2px 0 0", minHeight: "3px", transition: "height 0.3s" }} />
              </div>
            );
          })}
        </div>
        {/* X-axis labels (first, mid, last) */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.2)" }}>{first.cycle}</span>
          <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.2)" }}>{history[Math.floor(history.length / 2)]?.cycle}</span>
          <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.2)" }}>{last.cycle}</span>
        </div>
      </div>

      {/* Total delegated balance chart */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <TrendingUp size={12} /> Total Delegated Balance
          <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.25)", textTransform: "none", letterSpacing: 0 }}>— current: {formatXtz(last.totalDelegated)}</span>
        </div>
        {/* Line chart using SVG */}
        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "6px", padding: "8px", overflow: "hidden" }}>
          <svg width="100%" height="80" viewBox={`0 0 ${history.length * 10} 80`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d={[
                `M 0 80`,
                ...history.map((h, i) => {
                  const x = i * 10 + 5;
                  const y = 80 - Math.max(2, (h.totalDelegated / maxBalance) * 76);
                  return `L ${x} ${y}`;
                }),
                `L ${(history.length - 1) * 10 + 5} 80`,
                `Z`,
              ].join(" ")}
              fill="url(#balGrad)"
            />
            {/* Line */}
            <polyline
              points={history.map((h, i) => {
                const x = i * 10 + 5;
                const y = 80 - Math.max(2, (h.totalDelegated / maxBalance) * 76);
                return `${x},${y}`;
              }).join(" ")}
              fill="none"
              stroke="#f97316"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.2)" }}>{first.cycle}</span>
          <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.2)" }}>{last.cycle}</span>
        </div>
      </div>

      {/* Data table */}
      <div>
        <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>Cycle Data</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["Cycle", "Delegators", "Stakers", "Delegated Balance", "Staked Balance"].map(h => (
                  <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((h, i) => {
                const prev = history[history.length - 2 - i];
                const deltaDel = prev ? h.delegatorsCount - prev.delegatorsCount : 0;
                return (
                  <tr key={h.cycle} style={{ borderBottom: i < history.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <td style={{ padding: "0.5rem 0.75rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{h.cycle}</td>
                    <td style={{ padding: "0.5rem 0.75rem" }}>
                      <span style={{ fontWeight: 700, color: "#2c7df7" }}>{h.delegatorsCount.toLocaleString()}</span>
                      {deltaDel !== 0 && (
                        <span style={{ fontSize: "0.65rem", marginLeft: "0.35rem", color: deltaDel > 0 ? "#22c55e" : "#ef4444" }}>
                          {deltaDel > 0 ? `+${deltaDel}` : deltaDel}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "0.5rem 0.75rem", color: "rgba(255,255,255,0.6)" }}>{h.stakersCount}</td>
                    <td style={{ padding: "0.5rem 0.75rem", color: "#f97316", fontWeight: 600, whiteSpace: "nowrap" }}>{formatXtz(h.externalDelegatedBalance)}</td>
                    <td style={{ padding: "0.5rem 0.75rem", color: "#8b5cf6", fontWeight: 600, whiteSpace: "nowrap" }}>{h.externalStakedBalance > 0 ? formatXtz(h.externalStakedBalance) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AddressPage() {
  const { address } = useParams<{ address: string }>();
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "delegation">("overview");

  useSEO({
    title: `Address ${address?.slice(0, 12)}... | Tezos Explorer — XTZ.News`,
    description: `Tezos address ${address} — balance, transactions, delegation history, and activity.`,
    canonical: `https://xtz.news/explorer/address/${address}`,
  });

  const { data: account, isLoading, error } = trpc.explorer.accountByAddress.useQuery(
    { address: address || "" },
    { enabled: !!address }
  );

  const copyAddress = () => {
    navigator.clipboard.writeText(address || "");
    toast.success("Address copied!");
  };

  if (isLoading) return (
    <div className="container py-12">
      <div className="skeleton" style={{ height: "24px", width: "300px", marginBottom: "16px" }} />
      <div className="skeleton" style={{ height: "200px", borderRadius: "8px", marginBottom: "16px" }} />
      <div className="skeleton" style={{ height: "300px", borderRadius: "8px" }} />
    </div>
  );

  if (error || !account) return (
    <div className="container py-12 text-center">
      <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "1.5rem", marginBottom: "0.5rem" }}>Address Not Found</h1>
      <Link href="/explorer" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>← Back to Explorer</Link>
    </div>
  );

  const isBaker = account.type === "delegate";

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "transactions" as const, label: `Transactions (${account.numTransactions.toLocaleString()})` },
    ...(isBaker ? [{ id: "delegation" as const, label: "Delegation History" }] : []),
  ];

  const details = [
    { label: "Address", value: account.address, mono: true, copy: true },
    ...(account.alias ? [{ label: "Alias", value: account.alias, mono: false }] : []),
    { label: "Type", value: account.type, mono: false },
    { label: "Balance", value: `${account.balance.toFixed(6)} ꜩ`, mono: false },
    ...(account.stakedBalance > 0 ? [{ label: "Staked", value: `${account.stakedBalance.toFixed(6)} ꜩ`, mono: false }] : []),
    ...(account.delegate ? [{ label: "Delegated To", value: account.delegate, mono: false, link: `/explorer/address/${account.delegateAddress}` }] : []),
    { label: "Transactions", value: account.numTransactions.toLocaleString(), mono: false },
    ...(isBaker ? [
      { label: "Delegators", value: account.numDelegators.toLocaleString(), mono: false },
      { label: "Staking Balance", value: `${account.stakingBalance.toFixed(2)} ꜩ`, mono: false },
    ] : []),
    { label: "First Activity", value: timeAgo(account.firstActivity), mono: false },
    { label: "Last Activity", value: timeAgo(account.lastActivity), mono: false },
  ];

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}><Home size={12} /></Link>
            <ChevronRight size={10} />
            <Link href="/explorer" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Explorer</Link>
            <ChevronRight size={10} />
            <span style={{ color: "#fff" }}>Address</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", background: isBaker ? "rgba(249,115,22,0.2)" : "rgba(44,125,247,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isBaker ? <Shield size={20} style={{ color: "#f97316" }} /> : <User size={20} style={{ color: "#2c7df7" }} />}
            </div>
            <div>
              <h1 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", margin: 0 }}>
                {account.alias || (isBaker ? "Baker" : "Account")}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: "monospace" }}>{shortHash(account.address, 16)}</p>
                <button onClick={copyAddress} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center" }}>
                  <Copy size={11} />
                </button>
              </div>
            </div>
            {isBaker && (
              <span style={{ marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700, padding: "3px 8px", borderRadius: "3px", background: "rgba(249,115,22,0.15)", color: "#f97316", textTransform: "uppercase", letterSpacing: "0.08em" }}>Baker</span>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        {/* Balance cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Balance", value: `${account.balance.toFixed(2)} ꜩ`, color: "#2c7df7" },
            { label: "Staked", value: `${account.stakedBalance.toFixed(2)} ꜩ`, color: "#8b5cf6" },
            { label: "Transactions", value: account.numTransactions.toLocaleString(), color: "#f59e0b" },
            ...(isBaker ? [{ label: "Delegators", value: account.numDelegators.toLocaleString(), color: "#f97316" }] : []),
          ].map(c => (
            <div key={c.label} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "1rem" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>{c.label}</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 900, color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "0" }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.65rem 1.25rem",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.id ? "#2c7df7" : "transparent"}`,
                color: activeTab === tab.id ? "#2c7df7" : "rgba(255,255,255,0.45)",
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden", marginBottom: "1.5rem" }}>

          {/* Overview tab */}
          {activeTab === "overview" && (
            <div>
              {details.map((d: any, i: number) => (
                <div key={d.label} style={{ display: "flex", padding: "0.75rem 1.25rem", borderBottom: i < details.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ width: "160px", flexShrink: 0, fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</div>
                  <div style={{ flex: 1, fontSize: "0.85rem", color: "#fff", fontFamily: d.mono ? "monospace" : "inherit", wordBreak: "break-all", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    {d.link ? (
                      <Link href={d.link} style={{ color: "#2c7df7", textDecoration: "none" }}>{d.value}</Link>
                    ) : d.value}
                    {d.copy && (
                      <button onClick={copyAddress} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center" }}>
                        <Copy size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Transactions tab */}
          {activeTab === "transactions" && (
            <div>
              {!account.transactions || account.transactions.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No recent transactions found.</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        {["Hash", "From", "To", "Amount", "Status", "Time"].map(h => (
                          <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(account.transactions as any[]).map((op: any, i: number) => (
                        <tr key={op.hash + i} style={{ borderBottom: i < account.transactions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <td style={{ padding: "0.6rem 1rem" }}>
                            <Link href={`/explorer/tx/${op.hash}`} style={{ color: "#8b5cf6", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem" }}>{shortHash(op.hash)}</Link>
                          </td>
                          <td style={{ padding: "0.6rem 1rem" }}>
                            <Link href={`/explorer/address/${op.senderAddress}`} style={{ color: op.senderAddress === address ? "#fff" : "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem", fontWeight: op.senderAddress === address ? 700 : 400 }}>{op.sender || shortHash(op.senderAddress)}</Link>
                          </td>
                          <td style={{ padding: "0.6rem 1rem" }}>
                            <Link href={`/explorer/address/${op.targetAddress}`} style={{ color: op.targetAddress === address ? "#fff" : "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem", fontWeight: op.targetAddress === address ? 700 : 400 }}>{op.target || shortHash(op.targetAddress)}</Link>
                          </td>
                          <td style={{ padding: "0.6rem 1rem", color: op.senderAddress === address ? "#ef4444" : "#22c55e", fontWeight: 700 }}>
                            {op.senderAddress === address ? "-" : "+"}{op.amount.toFixed(4)} ꜩ
                          </td>
                          <td style={{ padding: "0.6rem 1rem" }}>
                            <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", background: op.status === "applied" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: op.status === "applied" ? "#22c55e" : "#ef4444" }}>{op.status}</span>
                          </td>
                          <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>{timeAgo(op.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Delegation History tab (bakers only) */}
          {activeTab === "delegation" && isBaker && (
            <DelegationHistoryTab address={account.address} />
          )}
        </div>

        {/* Baker CTA */}
        {isBaker && (
          <div style={{ padding: "1rem 1.25rem", background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>
              Want to delegate your XTZ to <strong style={{ color: "#fff" }}>{account.alias || "this baker"}</strong>?
            </div>
            <a
              href={`https://app.templewallet.com/delegating?baker=${account.address}`}
              target="_blank"
              rel="nofollow noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.1rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "6px", color: "#fff", fontWeight: 700, fontSize: "0.8rem", textDecoration: "none" }}>
              Delegate via Temple Wallet
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
