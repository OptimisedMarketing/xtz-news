import React from "react";
import { Atom, ArrowRight } from "lucide-react";
import { Link } from "wouter";

/** A compact, permanent discovery control for the post-quantum topic archive. */
export default function PostQuantumTopicFilter() {
  return (
    <section aria-labelledby="post-quantum-topic-title" style={{ background: "linear-gradient(135deg, rgba(83, 62, 183, 0.19), rgba(5,21,46,0.96) 58%)", border: "1px solid rgba(137,113,255,0.32)", borderRadius: "8px", padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span aria-hidden="true" style={{ display: "grid", placeItems: "center", width: "24px", height: "24px", borderRadius: "50%", background: "rgba(137,113,255,0.2)", color: "#c4b5fd" }}><Atom size={14} /></span>
        <span id="post-quantum-topic-title" style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#d8d0ff" }}>Topic filter</span>
      </div>
      <h2 style={{ margin: "0 0 0.35rem", fontSize: "0.95rem", lineHeight: 1.3, color: "#fff" }}>Post-quantum</h2>
      <p style={{ margin: "0 0 0.75rem", color: "rgba(255,255,255,0.63)", fontSize: "0.75rem", lineHeight: 1.55 }}>Find XTZ.News coverage of Tezos cryptography research, `tz5` testing and protocol-readiness work.</p>
      <Link href="/tag/post-quantum" aria-label="Browse post-quantum articles" style={{ color: "#c4b5fd", textDecoration: "none", fontSize: "0.72rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
        Browse post-quantum <ArrowRight size={13} aria-hidden="true" />
      </Link>
    </section>
  );
}
