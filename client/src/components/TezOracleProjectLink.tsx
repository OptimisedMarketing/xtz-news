import React from "react";
import { ArrowUpRight, Network } from "lucide-react";
import { Link } from "wouter";

export default function TezOracleProjectLink() {
  return (
    <section aria-labelledby="tezoracle-project-profile-title" style={{ marginTop: "2rem", padding: "1.1rem 1.15rem", borderRadius: "10px", background: "linear-gradient(135deg, rgba(44,125,247,0.12), rgba(128,92,255,0.08))", border: "1px solid rgba(86,147,255,0.3)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ maxWidth: "550px" }}>
          <p style={{ margin: "0 0 0.25rem", color: "#7cb4ff", fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", gap: "0.4rem", alignItems: "center" }}><Network size={14} /> Project directory</p>
          <h2 id="tezoracle-project-profile-title" style={{ margin: "0 0 0.35rem", color: "#fff", fontSize: "1rem", fontWeight: 800 }}>Follow TezOracle’s build progress</h2>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.66)", fontSize: "0.8rem", lineHeight: 1.55 }}>Visit the TezOracle project profile for verified build milestones, future published addresses, and related coverage.</p>
        </div>
        <Link href="/projects/tezoracle" aria-label="Open the TezOracle project profile" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.62rem 0.8rem", borderRadius: "6px", background: "#2c7df7", color: "#fff", fontSize: "0.75rem", fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}>
          Explore TezOracle <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
