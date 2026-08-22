import { BookOpen, ChevronRight } from "lucide-react";
import React from "react";

const sections = [
  { href: "#ganesha-interfaces", label: "Two interfaces, one ledger" },
  { href: "#ganesha-nac", label: "What NAC changes" },
  { href: "#ganesha-tezos-x", label: "A foundation for Tezos X" },
];

export default function GaneshaTechnicalToc() {
  return (
    <nav aria-labelledby="ganesha-toc-title" style={{ background: "linear-gradient(145deg, #071c35, #05152e)", border: "1px solid rgba(99,247,177,0.2)", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.9rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ width: "26px", height: "26px", display: "grid", placeItems: "center", borderRadius: "6px", background: "rgba(99,247,177,0.13)", color: "#63f7b1" }}><BookOpen size={14} aria-hidden="true" /></div>
        <div>
          <p style={{ margin: 0, color: "#63f7b1", fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Technical guide</p>
          <h2 id="ganesha-toc-title" style={{ margin: "0.1rem 0 0", color: "#fff", fontSize: "0.8rem", fontWeight: 850 }}>In this Ganesha update</h2>
        </div>
      </div>
      <ol style={{ listStyle: "none", padding: "0.45rem", margin: 0 }}>
        {sections.map((section, index) => (
          <li key={section.href}>
            <a href={section.href} style={{ display: "grid", gridTemplateColumns: "1.2rem minmax(0, 1fr) auto", alignItems: "center", gap: "0.45rem", padding: "0.65rem 0.55rem", color: "rgba(255,255,255,0.72)", textDecoration: "none", borderRadius: "5px", fontSize: "0.72rem", lineHeight: 1.35, fontWeight: 700, transition: "background 160ms cubic-bezier(0.23, 1, 0.32, 1), color 160ms cubic-bezier(0.23, 1, 0.32, 1)" }} onMouseEnter={(event) => { event.currentTarget.style.background = "rgba(99,247,177,0.09)"; event.currentTarget.style.color = "#fff"; }} onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; event.currentTarget.style.color = "rgba(255,255,255,0.72)"; }}>
              <span aria-hidden="true" style={{ color: "rgba(99,247,177,0.7)", fontSize: "0.64rem", fontVariantNumeric: "tabular-nums" }}>0{index + 1}</span>
              <span>{section.label}</span>
              <ChevronRight size={13} aria-hidden="true" color="#63f7b1" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
