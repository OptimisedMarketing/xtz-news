import React from "react";
import { Linkedin, Share2 } from "lucide-react";

interface KentoSharePanelProps {
  contentType: "article" | "project";
  title: string;
  url: string;
}

export default function KentoSharePanel({ contentType, title, url }: KentoSharePanelProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const context = contentType === "article" ? "Kento campaign story" : "Kento project";
  const actions = [
    { label: `Share this ${context} on X`, shortLabel: "Share on X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, color: "#111827", icon: <span aria-hidden="true" style={{ fontWeight: 900, fontSize: "0.95rem", lineHeight: 1 }}>X</span> },
    { label: `Share this ${context} on LinkedIn`, shortLabel: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: "#0A66C2", icon: <Linkedin aria-hidden="true" size={16} /> },
  ];

  return (
    <section aria-labelledby={`kento-${contentType}-share-title`} style={{ marginTop: "1.5rem", padding: "1rem 1.1rem", borderRadius: "10px", background: "linear-gradient(135deg, rgba(249,168,212,0.11), rgba(45,212,191,0.08))", border: "1px solid rgba(249,168,212,0.28)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: "0 0 0.2rem", display: "flex", alignItems: "center", gap: "0.45rem", color: "#f9a8d4", fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}><Share2 size={13} /> Share this story</p>
          <h2 id={`kento-${contentType}-share-title`} style={{ margin: 0, color: "#fff", fontSize: "0.98rem", fontWeight: 800 }}>Help others discover Kento</h2>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {actions.map((action) => <a key={action.shortLabel} href={action.href} target="_blank" rel="noopener noreferrer" aria-label={action.label} style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.55rem 0.75rem", borderRadius: "6px", background: action.color, border: "1px solid rgba(255,255,255,0.18)", color: "#fff", fontSize: "0.74rem", fontWeight: 800, textDecoration: "none" }}>{action.icon}{action.shortLabel}</a>)}
        </div>
      </div>
    </section>
  );
}
