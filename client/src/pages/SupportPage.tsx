import { useSEO } from "@/hooks/useSEO";
import DonateButton from "@/components/DonateButton";
import RecentDonors from "@/components/RecentDonors";

const WALLET_ADDRESS = "tz1VjHjMkdWdrqbWLswcd6QentEgqexSd27Q";

export default function SupportPage() {
  useSEO({
    title: "Support XTZ.News — Donate XTZ to Keep Tezos News Independent",
    description: "XTZ.News is an independent, community-funded Tezos news platform. Support us with a XTZ donation to keep the coverage free and unbiased.",
    canonical: "https://xtz.news/support",
  });

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "5rem 0 4rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(44,125,247,0.8) 40px, rgba(44,125,247,0.8) 41px)", pointerEvents: "none" }} />
        <div className="container" style={{ maxWidth: "760px", position: "relative", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "20px", padding: "0.3rem 0.9rem", marginBottom: "1.5rem" }}>
            <svg width="13" height="13" viewBox="0 0 32 32" fill="#2c7df7">
              <path d="M16 2L2 9.5v13L16 30l14-7.5v-13L16 2zm0 3.09l10.5 5.63v11.56L16 27.91 5.5 22.28V10.72L16 5.09z"/>
              <path d="M13 10v12h2v-5h4a3 3 0 000-6h-4V9h-2v1zm2 2h4a1 1 0 010 2h-4v-2z"/>
            </svg>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2c7df7", textTransform: "uppercase", letterSpacing: "0.08em" }}>Support XTZ.News</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", margin: "0 0 1rem", lineHeight: 1.1 }}>
            Keep Tezos News Independent
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 2.5rem", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            XTZ.News is a community-funded, independent news platform covering the Tezos blockchain ecosystem. We don't take money from VCs, foundations, or advertisers — we rely on readers like you.
          </p>
          <DonateButton variant="article" />
        </div>
      </div>

      <div className="container" style={{ maxWidth: "760px", padding: "4rem 1.25rem" }}>

        {/* Recent Donors */}
        <RecentDonors />

        {/* Why donate */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "4px", height: "28px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
            Why Your Support Matters
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {[
              { icon: "📰", title: "Independent Coverage", desc: "No foundation funding, no VC pressure. We cover Tezos honestly — the good and the bad." },
              { icon: "🌍", title: "10 Languages", desc: "We translate every article into 10 languages to make Tezos news accessible globally." },
              { icon: "🔊", title: "Audio Articles", desc: "Every article gets an AI-narrated audio version via ElevenLabs so you can listen on the go." },
              { icon: "⚡", title: "Real-time Data", desc: "Live XTZ prices, block explorer, staking calculator, NFT tools — all free, no paywalls." },
            ].map((item) => (
              <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1.5rem" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff", margin: "0 0 0.4rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What donations fund */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "4px", height: "28px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
            What Donations Fund
          </h2>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1.75rem" }}>
            {[
              { label: "Server & infrastructure costs", pct: 40 },
              { label: "AI translation (10 languages × 1,500+ articles)", pct: 30 },
              { label: "ElevenLabs audio narration API", pct: 20 },
              { label: "Development & new features", pct: 10 },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: "0.78rem", color: "#2c7df7", fontWeight: 700 }}>{item.pct}%</span>
                </div>
                <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: "linear-gradient(90deg, #2c7df7, #1a6ae0)", borderRadius: "2px", transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to donate */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "4px", height: "28px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
            How to Donate
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "rgba(44,125,247,0.08)", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "10px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#2c7df7", margin: "0 0 0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Via Wallet</h3>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: "0 0 1rem" }}>
                Click the <strong style={{ color: "#fff" }}>Donate XTZ</strong> button at the top of any page. Connect your Temple, Kukai, or AirGap wallet and send any amount.
              </p>
              <DonateButton variant="article" />
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "rgba(255,255,255,0.7)", margin: "0 0 0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Manual Transfer</h3>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                Send XTZ directly to our wallet address:
              </p>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "0.625rem 0.875rem" }}>
                <code style={{ fontSize: "0.68rem", color: "#2c7df7", fontFamily: "monospace", wordBreak: "break-all" as const }}>
                  {WALLET_ADDRESS}
                </code>
              </div>
              <a
                href={`https://tzkt.io/${WALLET_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "0.75rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 600 }}
              >
                View on TzKT →
              </a>
            </div>
          </div>
        </section>

        {/* Thank you */}
        <div style={{ textAlign: "center", padding: "2rem", background: "rgba(44,125,247,0.06)", border: "1px solid rgba(44,125,247,0.15)", borderRadius: "12px" }}>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
            Every donation — big or small — helps us keep the lights on and the Tezos community informed. Thank you for being part of XTZ.News. ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
