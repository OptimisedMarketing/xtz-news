import React from "react";
import { Archive, ArrowRight, UsersRound } from "lucide-react";
import { Link } from "wouter";

export default function OnchainCommunityArchivesHomepageFeature() {
  return (
    <section aria-labelledby="onchain-archives-home-title" style={{ background: "linear-gradient(120deg, #071d29 0%, #151035 56%, #0a1f2b 100%)", borderBottom: "1px solid rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "2.25rem 0", overflow: "hidden" }}>
      <div className="container archive-home-feature" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(220px, 0.7fr)", gap: "2rem", alignItems: "center" }}>
        <div>
          <p style={{ margin: "0 0 0.55rem", color: "#99f6e4", fontWeight: 900, fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", display: "flex", gap: "0.4rem", alignItems: "center" }}><Archive size={13} aria-hidden="true" /> Tezos culture route</p>
          <h2 id="onchain-archives-home-title" style={{ margin: "0 0 0.65rem", color: "#fff", fontSize: "clamp(1.35rem, 3vw, 2rem)", lineHeight: 1.15, fontWeight: 900 }}>Onchain community archives.</h2>
          <p style={{ margin: 0, maxWidth: "650px", color: "rgba(255,255,255,0.74)", lineHeight: 1.6, fontSize: "0.92rem" }}>Follow THE WALL Today’s early beta alongside Tezos culture projects, community-made work and editorial stories that preserve shared digital moments.</p>
        </div>
        <Link href="/onchain-community-archives" style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "0.55rem", padding: "0.85rem 1rem", textDecoration: "none", color: "#06201e", background: "#99f6e4", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 900, alignSelf: "center" }}>
          <UsersRound size={16} aria-hidden="true" /> Explore the hub <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <style>{`@media (max-width: 680px) { .archive-home-feature { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
