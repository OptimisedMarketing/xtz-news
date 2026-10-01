import React, { useEffect, useRef, useState } from "react";
import { Expand, ExternalLink, X } from "lucide-react";
import { getMediaUrl } from "@/lib/mediaUrl";

type TezTowersVisual = {
  src: string;
  alt: string;
  title: string;
  detail: string;
  sourceLabel: string;
  sourceUrl: string;
};

const VISUALS: TezTowersVisual[] = [
  {
    src: "/manus-storage/teztowers-main-street-official_179fe977.png",
    alt: "Official TezTowers night city visual with a glowing golden T above the waterfront skyline",
    title: "Official city preview",
    detail: "The official city visual used in TezTowers’ first-day update, which linked readers to the public city interface.",
    sourceLabel: "TezTowers launch-day post — 1 October 2026",
    sourceUrl: "https://x.com/TezTowers/status/2105488167042515017",
  },
  {
    src: "/manus-storage/teztowers-plots-filling_4b402214.jpg",
    alt: "Wide overhead view of TezTowers Main St with rows of virtual buildings and billboards beside the waterfront",
    title: "Main St starts to fill",
    detail: "Shared by TezTowers on 30 September alongside its early-neighbourhood update.",
    sourceLabel: "TezTowers post — 30 September 2026",
    sourceUrl: "https://x.com/TezTowers/status/2105352862570365315",
  },
  {
    src: "/manus-storage/teztowers-official-avatar_9f05469a.png",
    alt: "Official TezTowers golden T mark in a night-time virtual city scene",
    title: "A city-facing identity",
    detail: "The project’s official mark and city scene, as published on its own site.",
    sourceLabel: "TezTowers official site",
    sourceUrl: "https://teztowers.com/",
  },
];

export default function TezTowersLaunchGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selected = selectedIndex === null ? null : VISUALS[selectedIndex];

  useEffect(() => {
    if (selected) closeButtonRef.current?.focus();
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <section aria-labelledby="teztowers-gallery-title" style={{ margin: "1.75rem 0 2rem", padding: "1rem", border: "1px solid rgba(250,204,21,0.23)", borderRadius: "10px", background: "linear-gradient(145deg, rgba(12,19,42,0.95), rgba(5,21,46,0.82))" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.85rem" }}>
        <div>
          <p style={{ margin: "0 0 0.28rem", color: "#facc15", fontSize: "0.66rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Launch visuals</p>
          <h3 id="teztowers-gallery-title" style={{ margin: 0, color: "#fff", fontSize: "1.08rem", lineHeight: 1.3 }}>A compact look at TezTowers</h3>
        </div>
        <span style={{ flexShrink: 0, color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", fontWeight: 700 }}>Click an image to enlarge</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: "0.65rem" }}>
        {VISUALS.map((visual, index) => (
          <button
            key={visual.title}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-haspopup="dialog"
            aria-label={`Enlarge ${visual.title}`}
            style={{ padding: 0, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "7px", background: "rgba(255,255,255,0.04)", color: "#fff", cursor: "zoom-in", textAlign: "left" }}
          >
            <span style={{ position: "relative", display: "block", aspectRatio: "16 / 9", overflow: "hidden", background: "#050b18" }}>
              <img src={getMediaUrl(visual.src)} alt={visual.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <span aria-hidden="true" style={{ position: "absolute", right: "0.45rem", bottom: "0.45rem", width: "28px", height: "28px", display: "grid", placeItems: "center", borderRadius: "999px", background: "rgba(0,0,0,0.68)", color: "#fff" }}><Expand size={14} /></span>
            </span>
            <span style={{ display: "block", padding: "0.58rem 0.65rem" }}>
              <span style={{ display: "block", color: "#fff", fontWeight: 800, fontSize: "0.75rem" }}>{visual.title}</span>
              <span style={{ display: "block", marginTop: "0.2rem", color: "rgba(255,255,255,0.52)", fontSize: "0.64rem", lineHeight: 1.35 }}>{visual.sourceLabel}</span>
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div role="dialog" aria-modal="true" aria-labelledby="teztowers-lightbox-title" style={{ position: "fixed", inset: 0, zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(0,0,0,0.9)" }} onMouseDown={() => setSelectedIndex(null)}>
          <div style={{ width: "min(920px, 100%)", maxHeight: "calc(100vh - 2rem)", overflow: "auto", border: "1px solid rgba(250,204,21,0.34)", borderRadius: "10px", background: "#07152d" }} onMouseDown={(event) => event.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "0.6rem 0.6rem 0" }}>
              <button ref={closeButtonRef} type="button" onClick={() => setSelectedIndex(null)} aria-label="Close enlarged TezTowers visual" style={{ display: "inline-grid", placeItems: "center", width: "36px", height: "36px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)", color: "#fff", cursor: "pointer" }}><X size={17} /></button>
            </div>
            <img src={getMediaUrl(selected.src)} alt={selected.alt} style={{ display: "block", width: "100%", maxHeight: "68vh", objectFit: "contain", background: "#020611" }} />
            <div style={{ padding: "1rem 1.15rem 1.2rem" }}>
              <h3 id="teztowers-lightbox-title" style={{ margin: 0, color: "#fff", fontSize: "1rem" }}>{selected.title}</h3>
              <p style={{ margin: "0.45rem 0 0.8rem", color: "rgba(255,255,255,0.68)", fontSize: "0.82rem", lineHeight: 1.55 }}>{selected.detail}</p>
              <a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#facc15", fontWeight: 800, fontSize: "0.78rem", textDecoration: "none" }}>{selected.sourceLabel} <ExternalLink size={13} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
