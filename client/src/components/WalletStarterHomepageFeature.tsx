import React from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, WalletCards } from "lucide-react";

export default function WalletStarterHomepageFeature() {
  return (
    <section aria-labelledby="wallet-starter-home-title" style={{ background: "#000", padding: "0 0 1.5rem" }}>
      <div className="container">
        <div className="wallet-starter-home-grid" style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", alignItems: "center", gap: "1rem", padding: "1.15rem", borderRadius: "12px", border: "1px solid rgba(134,239,172,0.23)", background: "linear-gradient(115deg, rgba(5,38,52,0.95), rgba(7,30,65,0.95) 58%, rgba(7,22,49,0.95))" }}>
          <span aria-hidden="true" style={{ display: "grid", placeItems: "center", height: "46px", width: "46px", borderRadius: "10px", background: "rgba(134,239,172,0.12)", color: "#86efac" }}><WalletCards size={23} /></span>
          <div><p style={{ margin: 0, color: "#86efac", fontSize: "0.64rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Tezos wallet starter</p><h2 id="wallet-starter-home-title" style={{ margin: "0.2rem 0", fontSize: "clamp(1.12rem, 2vw, 1.45rem)", letterSpacing: "-0.025em" }}>New to Tezos? Start with a calm wallet guide.</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", lineHeight: 1.5 }}>Learn the address prefixes, official setup route, and read-only tools before you connect or sign.</p></div>
          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}><Link href="/wallets" aria-label="Open the Tezos wallet starter guide" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#061a39", background: "#86efac", padding: "0.68rem 0.82rem", borderRadius: "7px", fontSize: "0.76rem", fontWeight: 900, textDecoration: "none", whiteSpace: "nowrap" }}>Start here <ArrowRight size={14} aria-hidden="true" /></Link><Link href="/glossary/tezos-prefixes" aria-label="Open the Tezos address prefix glossary" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#b8ffd0", fontSize: "0.75rem", fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}><BookOpen size={14} aria-hidden="true" /> Prefix glossary</Link></div>
        </div>
      </div>
      <style>{`@media (max-width: 700px) { .wallet-starter-home-grid { grid-template-columns: auto minmax(0,1fr) !important; } .wallet-starter-home-grid > div:last-child { grid-column: 1 / -1; } }`}</style>
    </section>
  );
}
