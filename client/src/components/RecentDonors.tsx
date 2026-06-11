/**
 * RecentDonors — shows recent and top donors to XTZ.News wallet via TzKT API.
 * Two tabs: Recent (last 5) and Top Donors (largest all-time).
 */

import { useEffect, useState } from "react";

const WALLET_ADDRESS = "tz1VjHjMkdWdrqbWLswcd6QentEgqexSd27Q";
const TZKT_RECENT = `https://api.tzkt.io/v1/operations/transactions?target=${WALLET_ADDRESS}&limit=20&sort.desc=id&status=applied`;
const TZKT_TOP = `https://api.tzkt.io/v1/operations/transactions?target=${WALLET_ADDRESS}&limit=100&status=applied`;

interface Donation {
  hash: string;
  sender: { address: string; alias?: string };
  amount: number;
  timestamp: string;
}

interface TopDonor {
  address: string;
  alias?: string;
  total: number;
  count: number;
}

function truncateAddress(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function mutezToXtz(mutez: number) {
  return (mutez / 1_000_000).toFixed(2);
}

function aggregateTopDonors(donations: Donation[]): TopDonor[] {
  const map = new Map<string, TopDonor>();
  for (const d of donations) {
    if (!d.sender?.address || d.sender.address === WALLET_ADDRESS || d.amount <= 0) continue;
    const key = d.sender.address;
    const existing = map.get(key);
    if (existing) {
      existing.total += d.amount;
      existing.count += 1;
    } else {
      map.set(key, { address: key, alias: d.sender.alias, total: d.amount, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 5);
}

export default function RecentDonors() {
  const [recent, setRecent] = useState<Donation[]>([]);
  const [top, setTop] = useState<TopDonor[]>([]);
  const [activeTab, setActiveTab] = useState<"recent" | "top">("recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent and top in parallel
    Promise.all([
      fetch(TZKT_RECENT).then(r => r.json()).catch(() => []),
      fetch(TZKT_TOP).then(r => r.json()).catch(() => []),
    ]).then(([recentData, topData]) => {
      const filteredRecent = (recentData as Donation[]).filter(
        d => d.sender?.address !== WALLET_ADDRESS && d.amount > 0
      ).slice(0, 5);
      setRecent(filteredRecent);
      setTop(aggregateTopDonors(topData as Donation[]));
      setLoading(false);
    });
  }, []);

  if (loading || (recent.length === 0 && top.length === 0)) return null;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.3rem 0.75rem",
    borderRadius: "20px",
    border: active ? "1px solid rgba(44,125,247,0.5)" : "1px solid rgba(255,255,255,0.1)",
    background: active ? "rgba(44,125,247,0.15)" : "transparent",
    color: active ? "#2c7df7" : "rgba(255,255,255,0.4)",
    fontSize: "0.68rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "inherit",
  });

  return (
    <div style={{
      background: "rgba(44,125,247,0.06)",
      border: "1px solid rgba(44,125,247,0.15)",
      borderRadius: "10px",
      padding: "1.25rem 1.5rem",
      marginBottom: "2rem",
    }}>
      {/* Header with tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <svg width="16" height="16" viewBox="0 0 32 32" fill="#2c7df7">
          <path d="M16 2L2 9.5v13L16 30l14-7.5v-13L16 2zm0 3.09l10.5 5.63v11.56L16 27.91 5.5 22.28V10.72L16 5.09z"/>
          <path d="M13 10v12h2v-5h4a3 3 0 000-6h-4V9h-2v1zm2 2h4a1 1 0 010 2h-4v-2z"/>
        </svg>
        <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c7df7" }}>
          Donors
        </span>
        <div style={{ display: "flex", gap: "0.35rem", marginLeft: "0.25rem" }}>
          <button style={tabStyle(activeTab === "recent")} onClick={() => setActiveTab("recent")}>Recent</button>
          <button style={tabStyle(activeTab === "top")} onClick={() => setActiveTab("top")}>Top All-Time</button>
        </div>
        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>Thank you! ❤️</span>
      </div>

      {/* Recent tab */}
      {activeTab === "recent" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {recent.length === 0 ? (
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.3)", textAlign: "center", margin: "0.5rem 0" }}>No recent donations yet. Be the first!</p>
          ) : recent.map((d) => (
            <a
              key={d.hash}
              href={`https://tzkt.io/${d.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", textDecoration: "none", transition: "all 0.15s", gap: "0.75rem" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.2)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #2c7df7, #1a6ae0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.7rem", fontWeight: 900, color: "#fff" }}>
                  {(d.sender.alias || d.sender.address).charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.75)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {d.sender.alias || truncateAddress(d.sender.address)}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#2c7df7" }}>{mutezToXtz(d.amount)} ꜩ</span>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{timeAgo(d.timestamp)}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Top Donors tab */}
      {activeTab === "top" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {top.length === 0 ? (
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.3)", textAlign: "center", margin: "0.5rem 0" }}>No donations yet. Be the first!</p>
          ) : top.map((d, i) => (
            <a
              key={d.address}
              href={`https://tzkt.io/${d.address}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", textDecoration: "none", transition: "all 0.15s", gap: "0.75rem" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.2)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: i === 0 ? "linear-gradient(135deg, #f59e0b, #d97706)" : i === 1 ? "linear-gradient(135deg, #9ca3af, #6b7280)" : i === 2 ? "linear-gradient(135deg, #b45309, #92400e)" : "linear-gradient(135deg, #2c7df7, #1a6ae0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.72rem", fontWeight: 900, color: "#fff" }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </div>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.75)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                    {d.alias || truncateAddress(d.address)}
                  </span>
                  <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)" }}>{d.count} donation{d.count !== 1 ? "s" : ""}</span>
                </div>
              </div>
              <span style={{ fontSize: "0.88rem", fontWeight: 900, color: i === 0 ? "#f59e0b" : "#2c7df7", flexShrink: 0 }}>
                {mutezToXtz(d.total)} ꜩ
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
