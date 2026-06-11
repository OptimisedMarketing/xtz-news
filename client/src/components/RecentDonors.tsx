/**
 * RecentDonors — shows the last 5 donations to XTZ.News wallet via TzKT API.
 * Displays donor address (truncated), amount in XTZ, and time ago.
 */

import { useEffect, useState } from "react";

const WALLET_ADDRESS = "tz1VjHjMkdWdrqbWLswcd6QentEgqexSd27Q";
const TZKT_API = `https://api.tzkt.io/v1/operations/transactions?target=${WALLET_ADDRESS}&limit=5&sort.desc=id&status=applied`;

interface Donation {
  hash: string;
  sender: { address: string; alias?: string };
  amount: number; // in mutez
  timestamp: string;
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

export default function RecentDonors() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(TZKT_API)
      .then((r) => r.json())
      .then((data: Donation[]) => {
        // Filter out self-sends and zero-amount ops
        const filtered = (data || []).filter(
          (d) => d.sender?.address !== WALLET_ADDRESS && d.amount > 0
        );
        setDonations(filtered.slice(0, 5));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading || error || donations.length === 0) return null;

  return (
    <div style={{
      background: "rgba(44,125,247,0.06)",
      border: "1px solid rgba(44,125,247,0.15)",
      borderRadius: "10px",
      padding: "1.25rem 1.5rem",
      marginBottom: "2rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
        <svg width="16" height="16" viewBox="0 0 32 32" fill="#2c7df7">
          <path d="M16 2L2 9.5v13L16 30l14-7.5v-13L16 2zm0 3.09l10.5 5.63v11.56L16 27.91 5.5 22.28V10.72L16 5.09z"/>
          <path d="M13 10v12h2v-5h4a3 3 0 000-6h-4V9h-2v1zm2 2h4a1 1 0 010 2h-4v-2z"/>
        </svg>
        <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c7df7" }}>
          Recent Donors
        </span>
        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>Thank you! ❤️</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {donations.map((d) => (
          <a
            key={d.hash}
            href={`https://tzkt.io/${d.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.5rem 0.75rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "6px",
              textDecoration: "none",
              transition: "all 0.15s",
              gap: "0.75rem",
            }}
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
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#2c7df7" }}>
                {mutezToXtz(d.amount)} ꜩ
              </span>
              <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
                {timeAgo(d.timestamp)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
