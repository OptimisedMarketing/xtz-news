import { Link } from "wouter";
import { Shield, ChevronRight, Home, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";

function formatXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K ꜩ`;
  return `${v.toFixed(2)} ꜩ`;
}

export default function BakersPage() {
  useSEO({
    title: "Tezos Baker Leaderboard | XTZ.News — Top Tezos Validators",
    description: "The top Tezos bakers (validators) ranked by staking balance. Find the best Tezos bakers to delegate your XTZ to.",
    keywords: "Tezos bakers, Tezos validators, Tezos staking, XTZ delegation, best Tezos baker",
    canonical: "https://xtz.news/explorer/bakers",
  });

  const { data: bakers = [], isLoading } = trpc.explorer.bakers.useQuery({ limit: 50 });

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}><Home size={12} /></Link>
            <ChevronRight size={10} />
            <Link href="/explorer" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Explorer</Link>
            <ChevronRight size={10} />
            <span style={{ color: "#fff" }}>Bakers</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(249,115,22,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={20} style={{ color: "#f97316" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>Baker Leaderboard</h1>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>Top 50 Tezos bakers by staking balance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Rank", "Baker", "Staking Balance", "Own Balance", "Delegators", "Est. Reward"].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 20 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td colSpan={6} style={{ padding: "0.75rem 1rem" }}><div className="skeleton" style={{ height: "14px", width: "100%" }} /></td>
                    </tr>
                  ))
                ) : (bakers as any[]).map((baker: any, i: number) => (
                  <tr key={baker.address} style={{ borderBottom: i < bakers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.04)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 900, color: baker.rank <= 3 ? "#f59e0b" : "rgba(255,255,255,0.4)" }}>
                        {baker.rank <= 3 ? "🏆" : ""} #{baker.rank}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <Link href={`/explorer/address/${baker.address}`} style={{ textDecoration: "none" }}>
                        <div style={{ fontWeight: 700, color: "#fff" }}>{baker.alias || "Unknown Baker"}</div>
                        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{baker.address.slice(0, 12)}...</div>
                      </Link>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#f97316" }}>{formatXtz(baker.stakingBalance)}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.7)" }}>{formatXtz(baker.ownBalance)}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.7)" }}>{baker.numDelegators.toLocaleString()}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#22c55e", fontWeight: 600 }}>
                      {baker.estimatedSharedReward != null ? `${(baker.estimatedSharedReward * 100).toFixed(2)}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: "2rem", padding: "1.25rem", background: "rgba(44,125,247,0.06)", border: "1px solid rgba(44,125,247,0.15)", borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <TrendingUp size={18} style={{ color: "#2c7df7", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff", margin: "0 0 0.4rem" }}>How to Stake Tezos</h3>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.6 }}>
                Delegate your XTZ to a baker to earn staking rewards (~5-6% APY). Use Temple Wallet or Kukai to delegate in minutes. Your XTZ stays in your wallet — you can undelegate anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
