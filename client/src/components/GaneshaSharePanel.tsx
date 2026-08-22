import { Linkedin, Share2 } from "lucide-react";
import React from "react";

interface GaneshaSharePanelProps {
  title: string;
  url: string;
}

export default function GaneshaSharePanel({ title, url }: GaneshaSharePanelProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const actions = [
    {
      label: "Share Ganesha news on X",
      shortLabel: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <span aria-hidden="true" style={{ fontWeight: 900, fontSize: "0.95rem", lineHeight: 1 }}>X</span>,
      color: "#111827",
    },
    {
      label: "Share Ganesha news on LinkedIn",
      shortLabel: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Linkedin aria-hidden="true" size={16} />,
      color: "#0A66C2",
    },
  ];

  return (
    <section aria-labelledby="ganesha-share-title" style={{ marginTop: "2rem", padding: "1rem 1.1rem", borderRadius: "10px", background: "linear-gradient(135deg, rgba(42,255,170,0.11), rgba(44,125,247,0.08))", border: "1px solid rgba(85,255,183,0.25)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: "0 0 0.2rem", display: "flex", alignItems: "center", gap: "0.45rem", color: "#63f7b1", fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}><Share2 size={13} /> Spread the update</p>
          <h2 id="ganesha-share-title" style={{ margin: 0, color: "#fff", fontSize: "0.98rem", fontWeight: 800 }}>Share the Ganesha gateway story</h2>
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
