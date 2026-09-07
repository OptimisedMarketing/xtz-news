import React from "react";
import { ArrowRight, Palette, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function ArtOnTezosHomepageFeature() {
  return (
    <section aria-labelledby="art-on-tezos-home-title" style={{ background: "linear-gradient(120deg, #161039 0%, #103b4f 54%, #25113b 100%)", borderBottom: "1px solid rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "2.25rem 0", overflow: "hidden" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(220px, 0.7fr)", gap: "2rem", alignItems: "center" }}>
        <div>
          <p style={{ margin: "0 0 0.55rem", color: "#f9a8d4", fontWeight: 900, fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", display: "flex", gap: "0.4rem", alignItems: "center" }}><Sparkles size={13} aria-hidden="true" /> Tezos cultural collection</p>
          <h2 id="art-on-tezos-home-title" style={{ margin: "0 0 0.65rem", color: "#fff", fontSize: "clamp(1.35rem, 3vw, 2rem)", lineHeight: 1.15, fontWeight: 900 }}>Art on Tezos, in one place.</h2>
          <p style={{ margin: 0, maxWidth: "650px", color: "rgba(255,255,255,0.74)", lineHeight: 1.6, fontSize: "0.92rem" }}>Follow art projects, creator-led coverage, exhibitions, collecting context, and the latest XTZ.News stories from the Tezos art ecosystem.</p>
        </div>
        <Link href="/art-on-tezos" style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "0.55rem", padding: "0.85rem 1rem", textDecoration: "none", color: "#171022", background: "#f9a8d4", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 900, alignSelf: "center" }}>
          <Palette size={16} aria-hidden="true" /> Explore the collection <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
