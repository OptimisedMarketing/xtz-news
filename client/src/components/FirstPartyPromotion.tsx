import { ExternalLink, Megaphone } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function FirstPartyPromotion() {
  const { data: promotion } = trpc.settings.getFirstPartyPromotion.useQuery();

  if (!promotion?.active || !promotion.title || !promotion.url) return null;

  const content = (
    <>
      <div style={{ width: "42px", height: "42px", borderRadius: "9px", display: "grid", placeItems: "center", background: "rgba(99,247,177,0.13)", border: "1px solid rgba(99,247,177,0.28)", color: "#63f7b1", flexShrink: 0 }}><Megaphone size={19} aria-hidden="true" /></div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ margin: "0 0 0.25rem", color: "#63f7b1", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>From our network</p>
        <h2 style={{ color: "#fff", margin: 0, fontSize: "1rem", lineHeight: 1.25 }}>{promotion.title}</h2>
        {promotion.description && <p style={{ color: "rgba(255,255,255,0.62)", margin: "0.45rem 0 0", fontSize: "0.8rem", lineHeight: 1.55 }}>{promotion.description}</p>}
      </div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#071d40", background: "#63f7b1", padding: "0.62rem 0.8rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 900, whiteSpace: "nowrap", flexShrink: 0 }}>{promotion.ctaLabel || "Explore"}<ExternalLink size={13} aria-hidden="true" /></span>
    </>
  );

  return (
    <aside aria-label="First-party promotion" style={{ background: "linear-gradient(135deg, #082742, #05152e)", borderTop: "1px solid rgba(99,247,177,0.26)", borderBottom: "1px solid rgba(99,247,177,0.2)" }}>
      <div className="container" style={{ padding: "1rem 1.25rem" }}>
        {promotion.url.startsWith("/") ? (
          <Link href={promotion.url} style={{ display: "flex", alignItems: "center", gap: "0.85rem", textDecoration: "none", flexWrap: "wrap" }}>{content}</Link>
        ) : (
          <a href={promotion.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.85rem", textDecoration: "none", flexWrap: "wrap" }}>{content}</a>
        )}
      </div>
    </aside>
  );
}
