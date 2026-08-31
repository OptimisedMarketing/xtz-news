import React from "react";
import { Activity, ArrowUpRight, Building2, Landmark, ShieldCheck } from "lucide-react";

export const TEZOS_SYSTEMS_PULSE_LINKS = [
  {
    label: "Network & health",
    description: "Consensus, finality and live chain context",
    href: "https://tezos.systems/",
    icon: Activity,
  },
  {
    label: "Capital",
    description: "Tezos and Etherlink market intelligence",
    href: "https://tezos.systems/capital/",
    icon: Landmark,
  },
  {
    label: "Bakers",
    description: "Validator capacity and staking signals",
    href: "https://tezos.systems/bakers/",
    icon: Building2,
  },
  {
    label: "Governance",
    description: "Current votes and protocol history",
    href: "https://tezos.systems/governance/",
    icon: ShieldCheck,
  },
] as const;

export default function TezosSystemsNetworkPulse() {
  return (
    <section
      aria-labelledby="network-pulse-title"
      style={{ background: "#05152e", borderTop: "1px solid rgba(44,125,247,0.24)", borderBottom: "1px solid rgba(44,125,247,0.18)", padding: "2.25rem 0" }}
    >
      <div className="container" style={{ padding: "0 1.25rem" }}>
        <div className="network-pulse-shell">
          <div className="network-pulse-intro">
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.6rem" }}>
              <span aria-hidden="true" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 0 5px rgba(52,211,153,0.12)" }} />
              <span style={{ fontSize: "0.67rem", letterSpacing: "0.14em", fontWeight: 900, color: "#6ee7b7", textTransform: "uppercase" }}>Live network context</span>
            </div>
            <h2 id="network-pulse-title" style={{ margin: 0, color: "#fff", fontSize: "clamp(1.35rem, 3vw, 2rem)", lineHeight: 1.1, fontWeight: 900 }}>
              Tezos Network Pulse
            </h2>
            <p style={{ maxWidth: "32rem", margin: "0.85rem 0 0", color: "rgba(255,255,255,0.66)", lineHeight: 1.65, fontSize: "0.92rem" }}>
              Continue from the headlines into live network, capital, baker and governance context from Tezos Systems.
            </p>
            <a
              href="https://tezos.systems/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Explore Tezos Systems live dashboard (opens in a new tab)"
              className="network-pulse-explore"
            >
              Explore Tezos Systems <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          <ul className="network-pulse-links" aria-label="Tezos Systems live destinations">
            {TEZOS_SYSTEMS_PULSE_LINKS.map(({ label, description, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label}: ${description} (opens in a new tab)`}
                  className="network-pulse-link"
                >
                  <span className="network-pulse-icon" aria-hidden="true"><Icon size={17} /></span>
                  <span style={{ minWidth: 0 }}>
                    <span className="network-pulse-link-title">{label}</span>
                    <span className="network-pulse-link-description">{description}</span>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" style={{ marginLeft: "auto", color: "#60a5fa", flexShrink: 0 }} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
