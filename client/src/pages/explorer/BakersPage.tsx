import { Link } from "wouter";
import { Shield, ChevronRight, Home, TrendingUp, ExternalLink, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";

function formatXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K ꜩ`;
  return `${v.toFixed(2)} ꜩ`;
}

// Temple Wallet delegation deeplink for a given baker address
function templeDelegate(address: string) {
  return `https://app.templewallet.com/delegate?to=${address}`;
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
      {/* Page header */}
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
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>Top 50 Tezos bakers by staking balance</p>
              </div>
            </div>
            {/* Header-level CTA */}
              <a
              href="/how-to-stake-on-tezos"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "6px", color: "#fff", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", boxShadow: "0 4px 14px rgba(249,115,22,0.35)", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(249,115,22,0.45)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(249,115,22,0.35)"; }}
            >
              <TrendingUp size={14} /> How to Delegate XTZ
            </a>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem" }}>

        {/* ── Delegate XTZ CTA Banner ── */}
        <div style={{ marginBottom: "1.75rem", padding: "1.5rem", background: "linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(234,88,12,0.06) 100%)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{ width: "44px", height: "44px", background: "rgba(249,115,22,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TrendingUp size={22} style={{ color: "#f97316" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 900, color: "#fff", margin: "0 0 0.3rem" }}>
                Earn ~5–6% APY by Delegating Your XTZ
              </h2>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6, maxWidth: "520px" }}>
                Choose a baker below and delegate your XTZ in minutes. Your coins stay in your wallet — you can undelegate anytime. No lock-up period.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", flexShrink: 0 }}>
            <a
              href="/how-to-stake-on-tezos"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.25rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "6px", color: "#fff", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", boxShadow: "0 4px 14px rgba(249,115,22,0.3)", transition: "transform 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
            >
              Delegation Guide <ArrowRight size={13} />
            </a>
            <a
              href="https://templewallet.com"
              target="_blank"
              rel="nofollow noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.25rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: "0.82rem", textDecoration: "none", transition: "border-color 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.5)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)")}
            >
              <ExternalLink size={13} /> Get Temple Wallet
            </a>
          </div>
        </div>

        {/* ── Baker table ── */}
        <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Rank", "Baker", "Staking Balance", "Own Balance", "Delegators", "Est. Reward", ""].map((h, i) => (
                    <th key={i} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 20 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td colSpan={7} style={{ padding: "0.75rem 1rem" }}><div className="skeleton" style={{ height: "14px", width: "100%" }} /></td>
                    </tr>
                  ))
                ) : (bakers as any[]).map((baker: any, i: number) => (
                  <tr key={baker.address}
                    style={{ borderBottom: i < bakers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.04)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                    {/* Rank */}
                    <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 900, color: baker.rank <= 3 ? "#f59e0b" : "rgba(255,255,255,0.4)" }}>
                        {baker.rank <= 3 ? "🏆" : ""} #{baker.rank}
                      </span>
                    </td>
                    {/* Baker name + address */}
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <Link href={`/explorer/address/${baker.address}`} style={{ textDecoration: "none" }}>
                        <div style={{ fontWeight: 700, color: "#fff" }}>{baker.alias || "Unknown Baker"}</div>
                        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{baker.address.slice(0, 12)}...</div>
                      </Link>
                    </td>
                    {/* Staking balance */}
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#f97316", whiteSpace: "nowrap" }}>{formatXtz(baker.stakingBalance)}</td>
                    {/* Own balance */}
                    <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>{formatXtz(baker.ownBalance)}</td>
                    {/* Delegators */}
                    <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.7)" }}>{baker.numDelegators.toLocaleString()}</td>
                    {/* Est. reward */}
                    <td style={{ padding: "0.75rem 1rem", color: "#22c55e", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {baker.estimatedSharedReward != null ? `${(baker.estimatedSharedReward * 100).toFixed(2)}%` : "—"}
                    </td>
                    {/* Delegate CTA */}
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <a
                        href={templeDelegate(baker.address)}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.35)", borderRadius: "4px", color: "#f97316", fontWeight: 700, fontSize: "0.7rem", textDecoration: "none", whiteSpace: "nowrap", transition: "background 0.15s, border-color 0.15s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.25)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.6)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.15)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.35)"; }}
                      >
                        Delegate <ExternalLink size={10} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Bottom info box ── */}
        <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {[
            { icon: "🔒", title: "Non-custodial", body: "Your XTZ never leaves your wallet. Bakers cannot spend your funds." },
            { icon: "💸", title: "~5–6% APY", body: "Rewards are paid every 3 days (one cycle). No minimum amount required." },
            { icon: "🔓", title: "No lock-up", body: "Undelegate at any time. Rewards stop at the end of the current cycle." },
          ].map(card => (
            <div key={card.title} style={{ padding: "1.1rem 1.25rem", background: "rgba(44,125,247,0.05)", border: "1px solid rgba(44,125,247,0.12)", borderRadius: "8px" }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{card.icon}</div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.85rem", marginBottom: "0.3rem" }}>{card.title}</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{card.body}</div>
            </div>
          ))}
        </div>

        {/* ── Read more link ── */}
        <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
          <a href="/how-to-stake-on-tezos" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#2c7df7", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none" }}>
            Read the full Tezos staking &amp; delegation guide <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
