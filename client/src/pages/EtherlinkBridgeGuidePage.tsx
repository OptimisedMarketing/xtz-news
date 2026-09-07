import React from "react";
import { Link } from "wouter";
import { ArrowDownUp, ArrowRight, BadgeCheck, CheckCircle2, ChevronRight, Clock3, ExternalLink, Layers3, ShieldAlert, TimerReset } from "lucide-react";
import { buildFAQSchema, buildWebPageSchema, useSEO } from "@/hooks/useSEO";

export const ETHERLINK_BRIDGE_FAQS = [
  {
    question: "What does bridging XTZ to Etherlink mean?",
    answer: "The official Etherlink documentation calls a transfer from Tezos layer 1 to Etherlink EVM a deposit. It moves XTZ into the Etherlink EVM context so it can be used there.",
  },
  {
    question: "How long does an Etherlink bridge transfer take?",
    answer: "Official documentation says deposits from Tezos layer 1 are available on Etherlink immediately. Standard withdrawals back to Tezos layer 1 are normally available after 15 days; the optional fast-withdrawal path has a fee and may be available within approximately one minute.",
  },
  {
    question: "Which bridge should I use?",
    answer: "Use the current official Etherlink bridge and verify the website address, selected network, asset, destination, and displayed timing before confirming any transaction.",
  },
];

const OFFICIAL_BRIDGE_URL = "https://bridge.etherlink.com/tezos";
const OFFICIAL_BRIDGE_DOCS = "https://docs.etherlink.com/evm/bridging/bridging-tezos/";

const STEPS = [
  { number: "01", title: "Identify the direction", body: "A Tezos layer 1 → Etherlink EVM transfer is a deposit. An Etherlink EVM → Tezos layer 1 transfer is a withdrawal.", icon: ArrowDownUp },
  { number: "02", title: "Open the official bridge", body: "Start from the official Etherlink bridge or its documentation—not from an unsolicited link or an unfamiliar lookalike site.", icon: BadgeCheck },
  { number: "03", title: "Check the route before you sign", body: "Confirm the selected source network, destination network, asset, amount, wallet addresses, and the timing shown by the official interface.", icon: CheckCircle2 },
  { number: "04", title: "Keep the reference", body: "Save the transaction reference and use the official bridge explorer or your wallet activity to follow the public status.", icon: Layers3 },
];

export default function EtherlinkBridgeGuidePage() {
  useSEO({
    title: "How to Bridge XTZ to Etherlink: Timing & Safety Guide | XTZ.News",
    description: "A plain-English Etherlink bridge explainer: deposits, withdrawals, timing context, and the official resources to review before moving XTZ between Tezos and Etherlink.",
    keywords: "bridge XTZ to Etherlink, Etherlink bridge, Tezos to Etherlink, Etherlink withdrawal, Etherlink deposit",
    canonical: "https://xtz.news/etherlink/bridge",
    jsonLd: [
      buildWebPageSchema({
        title: "How to Bridge XTZ to Etherlink",
        description: "A source-grounded guide to Etherlink bridge directions, timing context, and official resources.",
        url: "https://xtz.news/etherlink/bridge",
        breadcrumbs: [
          { name: "Home", url: "https://xtz.news" },
          { name: "Etherlink Hub", url: "https://xtz.news/etherlink" },
          { name: "Bridge XTZ", url: "https://xtz.news/etherlink/bridge" },
        ],
      }),
      buildFAQSchema(ETHERLINK_BRIDGE_FAQS),
    ],
  });

  return (
    <main id="main-content" style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      <section style={{ background: "radial-gradient(circle at 88% 0%, rgba(56,189,248,0.25), transparent 34%), linear-gradient(135deg, #061a39 0%, #071631 58%, #020817 100%)", borderBottom: "1px solid rgba(125,211,252,0.22)", padding: "3.35rem 0 3rem" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.35rem", color: "rgba(255,255,255,0.55)", fontSize: "0.76rem", marginBottom: "1.25rem" }}>
            <Link href="/" style={{ color: "inherit" }}>Home</Link><ChevronRight size={13} aria-hidden="true" /><Link href="/etherlink" style={{ color: "inherit" }}>Etherlink Hub</Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">Bridge explainer</span>
          </nav>
          <div className="bridge-hero-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.45fr) minmax(240px,0.62fr)", alignItems: "end", gap: "2.25rem" }}>
            <div>
              <p style={{ margin: 0, color: "#7dd3fc", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.42rem" }}><ArrowDownUp size={15} aria-hidden="true" /> Etherlink bridge explainer</p>
              <h1 style={{ margin: "0.75rem 0 1rem", maxWidth: "12ch", fontSize: "clamp(2.2rem, 5vw, 4.4rem)", lineHeight: 0.98, letterSpacing: "-0.06em", fontWeight: 950 }}>Bridge XTZ with the timing in mind.</h1>
              <p style={{ margin: 0, maxWidth: "65ch", color: "rgba(255,255,255,0.74)", lineHeight: 1.7, fontSize: "1.02rem" }}>A practical reading guide for understanding the direction, the official route, and the different timing expectations when moving XTZ between Tezos layer 1 and Etherlink EVM.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem", marginTop: "1.45rem" }}>
                <a href={OFFICIAL_BRIDGE_URL} target="_blank" rel="noopener noreferrer" style={{ background: "#2c7df7", color: "#fff", padding: "0.78rem 1rem", borderRadius: "8px", fontWeight: 850, fontSize: "0.82rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>Open official bridge <ExternalLink size={14} aria-hidden="true" /></a>
                <a href={OFFICIAL_BRIDGE_DOCS} target="_blank" rel="noopener noreferrer" style={{ border: "1px solid rgba(255,255,255,0.24)", color: "#fff", padding: "0.78rem 1rem", borderRadius: "8px", fontWeight: 850, fontSize: "0.82rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>Read official instructions <ExternalLink size={14} aria-hidden="true" /></a>
              </div>
            </div>
            <aside aria-label="Important bridge timing" style={{ padding: "1.1rem", background: "rgba(3,15,35,0.64)", border: "1px solid rgba(125,211,252,0.28)", borderRadius: "13px" }}>
              <Clock3 size={21} style={{ color: "#7dd3fc" }} aria-hidden="true" />
              <p style={{ margin: "0.65rem 0 0.25rem", color: "#9edcff", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 900, fontSize: "0.64rem" }}>The key difference</p>
              <strong style={{ display: "block", fontSize: "1.04rem", lineHeight: 1.3 }}>Deposits and withdrawals do not follow the same timing path.</strong>
              <p style={{ margin: "0.55rem 0 0", color: "rgba(255,255,255,0.62)", fontSize: "0.82rem", lineHeight: 1.55 }}>Review the official bridge’s current timing before you confirm a transfer.</p>
            </aside>
          </div>
        </div>
      </section>

      <div className="container" style={{ maxWidth: "1080px", padding: "3rem 1.25rem 4.5rem" }}>
        <section aria-labelledby="bridge-directions-title">
          <p style={{ margin: 0, color: "#7dd3fc", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>The route at a glance</p>
          <h2 id="bridge-directions-title" style={{ margin: "0.4rem 0 1rem", fontSize: "clamp(1.45rem, 3vw, 2.1rem)", letterSpacing: "-0.035em" }}>Two directions. Different expectations.</h2>
          <div className="bridge-direction-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.9rem" }}>
            <article style={{ padding: "1.35rem", borderRadius: "12px", border: "1px solid rgba(74,222,128,0.26)", background: "linear-gradient(135deg, rgba(4,58,45,0.62), rgba(5,21,46,0.9))" }}>
              <span style={{ display: "inline-flex", padding: "0.25rem 0.48rem", borderRadius: "999px", background: "rgba(74,222,128,0.15)", color: "#86efac", fontSize: "0.64rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Deposit</span>
              <h3 style={{ margin: "0.7rem 0 0.35rem", fontSize: "1.15rem" }}>Tezos layer 1 → Etherlink EVM</h3>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.66)", lineHeight: 1.6, fontSize: "0.88rem" }}>Official documentation states that XTZ deposited from Tezos layer 1 is available for use on Etherlink immediately. Check the official interface for the selected asset and network before confirming.</p>
            </article>
            <article style={{ padding: "1.35rem", borderRadius: "12px", border: "1px solid rgba(251,191,36,0.3)", background: "linear-gradient(135deg, rgba(81,49,8,0.6), rgba(5,21,46,0.9))" }}>
              <span style={{ display: "inline-flex", padding: "0.25rem 0.48rem", borderRadius: "999px", background: "rgba(251,191,36,0.15)", color: "#fde68a", fontSize: "0.64rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Withdrawal</span>
              <h3 style={{ margin: "0.7rem 0 0.35rem", fontSize: "1.15rem" }}>Etherlink EVM → Tezos layer 1</h3>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.66)", lineHeight: 1.6, fontSize: "0.88rem" }}>Standard withdrawals are normally available after 15 days. The official bridge may offer a faster route for a fee; compare the displayed terms and timing before proceeding.</p>
            </article>
          </div>
        </section>

        <section aria-labelledby="bridge-steps-title" style={{ marginTop: "3.5rem" }}>
          <p style={{ margin: 0, color: "#7dd3fc", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>Before you confirm</p>
          <h2 id="bridge-steps-title" style={{ margin: "0.4rem 0 1.15rem", fontSize: "clamp(1.45rem, 3vw, 2.1rem)", letterSpacing: "-0.035em" }}>A safer bridge-reading sequence.</h2>
          <div className="bridge-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.75rem" }}>
            {STEPS.map(({ number, title, body, icon: Icon }) => <article key={number} style={{ padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.11)", background: "#061a39" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}><span style={{ color: "#7dd3fc", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.1em" }}>{number}</span><Icon size={18} color="#7dd3fc" aria-hidden="true" /></div>
              <h3 style={{ margin: "0.75rem 0 0.38rem", fontSize: "0.98rem", lineHeight: 1.25 }}>{title}</h3>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", lineHeight: 1.55 }}>{body}</p>
            </article>)}
          </div>
        </section>

        <section aria-labelledby="bridge-timing-title" style={{ marginTop: "3.5rem", display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(260px,0.7fr)", gap: "1.4rem", alignItems: "start" }} className="bridge-timing-grid">
          <div>
            <p style={{ margin: 0, color: "#7dd3fc", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>Why the return route takes longer</p>
            <h2 id="bridge-timing-title" style={{ margin: "0.4rem 0 0.75rem", fontSize: "clamp(1.45rem, 3vw, 2.1rem)", letterSpacing: "-0.035em" }}>Withdrawal timing is part of the design, not a stuck transaction.</h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.68)", lineHeight: 1.7 }}>The official documentation explains that Etherlink’s standard return path waits for the Smart Rollup refutation period before the corresponding commitment is cemented on Tezos layer 1. That is why a standard withdrawal can have a materially longer wait than a deposit.[1]</p>
            <p style={{ margin: "0.8rem 0 0", color: "rgba(255,255,255,0.68)", lineHeight: 1.7 }}>If the bridge offers a fast withdrawal, it is a separate option with a fee. Treat the timing and fee shown in the official interface as the source of truth for that specific transfer.[1]</p>
          </div>
          <aside style={{ padding: "1.15rem", borderRadius: "12px", border: "1px solid rgba(251,191,36,0.3)", background: "rgba(75,45,5,0.33)" }}><TimerReset size={22} color="#fde68a" aria-hidden="true" /><strong style={{ display: "block", marginTop: "0.65rem", fontSize: "1rem" }}>Do not treat a standard withdrawal as instant liquidity.</strong><p style={{ color: "rgba(255,255,255,0.64)", fontSize: "0.83rem", lineHeight: 1.55, margin: "0.55rem 0 0" }}>Read the direction and displayed timing before confirming. Do not use a route whose timing does not match your needs.</p></aside>
        </section>

        <section aria-labelledby="bridge-faq-title" style={{ maxWidth: "820px", marginTop: "3.5rem" }}>
          <p style={{ margin: 0, color: "#7dd3fc", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>Quick answers</p>
          <h2 id="bridge-faq-title" style={{ margin: "0.4rem 0 0.85rem", fontSize: "clamp(1.45rem, 3vw, 2.1rem)", letterSpacing: "-0.035em" }}>Common Etherlink bridge questions</h2>
          {ETHERLINK_BRIDGE_FAQS.map((faq) => <details key={faq.question} style={{ padding: "0.9rem 0", borderTop: "1px solid rgba(255,255,255,0.13)" }}><summary style={{ cursor: "pointer", fontWeight: 800, fontSize: "0.95rem" }}>{faq.question}</summary><p style={{ color: "rgba(255,255,255,0.64)", lineHeight: 1.6, fontSize: "0.86rem", margin: "0.7rem 1.4rem 0 0" }}>{faq.answer}</p></details>)}
        </section>

        <section aria-label="Bridge guide next steps" style={{ marginTop: "3.25rem", padding: "1.2rem", borderRadius: "12px", background: "linear-gradient(135deg, rgba(44,125,247,0.18), rgba(5,21,46,0.9))", border: "1px solid rgba(96,165,250,0.28)", display: "flex", alignItems: "flex-start", gap: "0.8rem" }}><ShieldAlert size={22} color="#8ac0ff" aria-hidden="true" /><div><strong>Use the guide to understand the route—not as a substitute for the bridge interface.</strong><p style={{ margin: "0.35rem 0 0.75rem", color: "rgba(255,255,255,0.66)", lineHeight: 1.55, fontSize: "0.84rem" }}>Before making a transfer, verify the current official bridge URL and the direction, asset, destination, fee, and timing shown there.</p><Link href="/etherlink" style={{ color: "#8ac0ff", textDecoration: "none", fontWeight: 850, fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>Back to the Etherlink hub <ArrowRight size={14} aria-hidden="true" /></Link></div></section>

        <p style={{ margin: "2rem 0 0", color: "rgba(255,255,255,0.42)", fontSize: "0.73rem", lineHeight: 1.55 }}>[1] <a href={OFFICIAL_BRIDGE_DOCS} target="_blank" rel="noopener noreferrer" style={{ color: "#8ac0ff" }}>Bridging XTZ between Tezos layer 1 and Etherlink EVM — official Etherlink documentation</a>.</p>
      </div>
      <style>{`@media (max-width: 700px) { .bridge-hero-grid, .bridge-timing-grid, .bridge-direction-grid { grid-template-columns: 1fr !important; } .bridge-steps-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }`}</style>
    </main>
  );
}
