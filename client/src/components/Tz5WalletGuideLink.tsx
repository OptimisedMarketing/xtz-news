import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function Tz5WalletGuideLink() {
  return (
    <aside aria-labelledby="tz5-guide-link-title" style={{ marginTop: "1.5rem", padding: "1.1rem 1.15rem", background: "linear-gradient(135deg, rgba(44,125,247,0.18), rgba(5,21,46,0.94) 58%)", border: "1px solid rgba(44,125,247,0.36)", borderRadius: "9px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <span aria-hidden="true" style={{ display: "grid", placeItems: "center", width: "32px", height: "32px", flexShrink: 0, borderRadius: "7px", background: "rgba(44,125,247,0.2)", color: "#9bc5ff" }}><ShieldCheck size={17} /></span>
        <div>
          <p style={{ margin: "0 0 0.18rem", fontSize: "0.62rem", fontWeight: 800, color: "#72aaff", textTransform: "uppercase", letterSpacing: "0.1em" }}>Reader guide</p>
          <h2 id="tz5-guide-link-title" style={{ margin: 0, color: "#fff", fontSize: "1rem", lineHeight: 1.35 }}>What is a tz5 wallet account?</h2>
          <p style={{ margin: "0.4rem 0 0.7rem", color: "rgba(255,255,255,0.68)", fontSize: "0.8rem", lineHeight: 1.55 }}>Read the plain-English guide to Tezos’ testnet-stage post-quantum account type and what ordinary holders should do today.</p>
          <Link href="/guides/tz5-wallet" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#9bc5ff", fontSize: "0.75rem", fontWeight: 800, textDecoration: "none" }}>
            Read the tz5 wallet guide <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
