import { ExternalLink, Megaphone } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

type Promotion = { id: string; title: string; description: string; url: string; ctaLabel: string; active: boolean; placeholder: boolean };
const INITIAL_OWNER_PLACEMENTS: Promotion[] = [
  { id: "optimised-marketing", title: "Optimised Marketing", description: "Explore the digital marketing and web work behind XTZ.News.", url: "https://optimised.marketing", ctaLabel: "Visit site", active: true, placeholder: false },
  { id: "next-owner-app", title: "Your next app", description: "A reserved space for another owner-managed business or app.", url: "", ctaLabel: "Reserved", active: true, placeholder: true },
];
export default function FirstPartyPromotion() {
  const { data } = trpc.settings.getFirstPartyPromotions.useQuery();
  const configured = Array.isArray(data) && data.length ? data as Promotion[] : INITIAL_OWNER_PLACEMENTS;
  const promotions = configured.filter((promotion) => promotion.active);
  const [index, setIndex] = useState(0);
  useEffect(() => { setIndex(0); }, [promotions.length]);
  useEffect(() => { if (promotions.length < 2) return; const timer = window.setInterval(() => setIndex((current: number) => (current + 1) % promotions.length), 8000); return () => window.clearInterval(timer); }, [promotions.length]);
  if (!promotions.length) return null;
  const promotion = promotions[index % promotions.length];
  const content = <><div style={{ width: "42px", height: "42px", borderRadius: "9px", display: "grid", placeItems: "center", background: promotion.placeholder ? "rgba(251,191,36,.13)" : "rgba(99,247,177,.13)", border: "1px solid rgba(99,247,177,.28)", color: promotion.placeholder ? "#fbbf24" : "#63f7b1", flexShrink: 0 }}><Megaphone size={19} aria-hidden="true" /></div><div style={{ minWidth: 0, flex: 1 }}><p style={{ margin: "0 0 .25rem", color: promotion.placeholder ? "#fbbf24" : "#63f7b1", fontSize: ".62rem", fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase" }}>{promotion.placeholder ? "Future owner placement" : "From our network"}</p><h2 style={{ color: "#fff", margin: 0, fontSize: "1rem", lineHeight: 1.25 }}>{promotion.title}</h2>{promotion.description && <p style={{ color: "rgba(255,255,255,.62)", margin: ".45rem 0 0", fontSize: ".8rem", lineHeight: 1.55 }}>{promotion.description}</p>}</div>{promotion.url ? <span style={{ display: "inline-flex", alignItems: "center", gap: ".35rem", color: "#071d40", background: "#63f7b1", padding: ".62rem .8rem", borderRadius: "4px", fontSize: ".72rem", fontWeight: 900, whiteSpace: "nowrap", flexShrink: 0 }}>{promotion.ctaLabel || "Explore"}<ExternalLink size={13} aria-hidden="true" /></span> : <span style={{ color: "rgba(255,255,255,.48)", border: "1px dashed rgba(255,255,255,.28)", padding: ".62rem .8rem", borderRadius: "4px", fontSize: ".72rem", fontWeight: 800 }}>Reserved</span>}</>;
  return <aside aria-label="First-party promotion" style={{ background: "linear-gradient(135deg,#082742,#05152e)", borderTop: "1px solid rgba(99,247,177,.26)", borderBottom: "1px solid rgba(99,247,177,.2)" }}><div className="container" style={{ padding: "1rem 1.25rem" }}>{promotion.url ? promotion.url.startsWith("/") ? <Link href={promotion.url} style={{ display: "flex", alignItems: "center", gap: ".85rem", textDecoration: "none", flexWrap: "wrap" }}>{content}</Link> : <a href={promotion.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: ".85rem", textDecoration: "none", flexWrap: "wrap" }}>{content}</a> : <div style={{ display: "flex", alignItems: "center", gap: ".85rem", flexWrap: "wrap" }}>{content}</div>}{promotions.length > 1 && <div aria-label="Promotion rotation" style={{ display: "flex", gap: ".3rem", marginTop: ".65rem" }}>{promotions.map((item, dotIndex) => <button key={item.id} onClick={() => setIndex(dotIndex)} aria-label={`Show ${item.title}`} aria-current={dotIndex === index} style={{ width: dotIndex === index ? "20px" : "6px", height: "6px", borderRadius: "99px", border: 0, background: dotIndex === index ? "#63f7b1" : "rgba(255,255,255,.28)", padding: 0, cursor: "pointer", transition: "width .18s ease-out" }} />)}</div>}</div></aside>;
}
