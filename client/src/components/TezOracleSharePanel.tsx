import React from "react";
import { Linkedin, Share2 } from "lucide-react";

interface TezOracleSharePanelProps {
  contentType: "article" | "project";
  title: string;
  url: string;
}

export default function TezOracleSharePanel({ contentType, title, url }: TezOracleSharePanelProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const label = contentType === "article" ? "TezOracle news" : "TezOracle project";
  const actions = [
    { label: `Share ${label} on X`, shortLabel: "Share on X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, color: "#111827", icon: <span aria-hidden="true" style={{ fontWeight: 900, fontSize: "0.95rem", lineHeight: 1 }}>X</span> },
    { label: `Share ${label} on LinkedIn`, shortLabel: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: "#0A66C2", icon: <Linkedin aria-hidden="true" size={16} /> },
  ];

  return (
    <section aria-labelledby={`tezoracle-${contentType}-share-title`} style={{ marginTop: "1.5rem", padding: "1rem 1.1rem", borderRadius: "10px", background: "rgba(44,125,247,0.07)", border: "1px solid rgba(44,125,247,0.23)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: "0 0 0.2rem", display: "flex", alignItems: "center", gap: "0.45rem", color: "#7cb4ff", fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}><Share2 size={13} /> Share this update</p>
          <h2 id={`tezoracle-${contentType}-share-title`} style={{ margin: 0, color: "#fff", fontSize: "0.98rem", fontWeight: 800 }}>Help others follow TezOracle</h2>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {actions.map((action) => (
            <a key={action.shortLabel} href={action.href} target="_blank" rel="noopener noreferrer" aria-label={action.label} style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.55rem 0.75rem", borderRadius: "6px", background: action.color, border: "1px solid rgba(255,255,255,0.18)", color: "#fff", fontSize: "0.74rem", fontWeight: 800, textDecoration: "none", transition: "transform 160ms cubic-bezier(0.23, 1, 0.32, 1), filter 160ms" }} onMouseEnter={(event) => { event.currentTarget.style.transform = "translateY(-2px)"; event.currentTarget.style.filter = "brightness(1.15)"; }} onMouseLeave={(event) => { event.currentTarget.style.transform = "translateY(0)"; event.currentTarget.style.filter = "none"; }}>
              {action.icon}{action.shortLabel}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
