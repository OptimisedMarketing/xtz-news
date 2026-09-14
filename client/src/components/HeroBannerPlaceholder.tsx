import React from "react";
import { ImagePlus } from "lucide-react";

/**
 * Intentionally static until the site owner supplies an approved first-party banner.
 * Keeping this placement free of ad-network scripts avoids third-party tracking.
 */
export default function HeroBannerPlaceholder() {
  return (
    <aside aria-label="Hero banner advertising placeholder" style={{ background: "#000", padding: "1rem 0 .35rem" }}>
      <div className="container" style={{ padding: "0 1.25rem" }}>
        <div
          data-testid="hero-banner-placeholder"
          style={{ minHeight: "90px", boxSizing: "border-box", border: "1px dashed rgba(251,191,36,.64)", borderRadius: "5px", background: "linear-gradient(135deg, rgba(33,25,10,.86), rgba(8,21,46,.94))", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: ".9rem 1.1rem", flexWrap: "wrap" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".8rem", minWidth: 0 }}>
            <span aria-hidden="true" style={{ width: "40px", height: "40px", display: "grid", placeItems: "center", flexShrink: 0, borderRadius: "7px", color: "#fbbf24", background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.28)" }}><ImagePlus size={19} /></span>
            <div>
              <p style={{ margin: "0 0 .22rem", color: "#fbbf24", fontWeight: 900, fontSize: ".62rem", letterSpacing: ".12em", textTransform: "uppercase" }}>Advertising space</p>
              <h2 style={{ margin: 0, color: "#fff", fontSize: "clamp(.95rem, 2vw, 1.12rem)", lineHeight: 1.25 }}>Hero banner reserved for your next owner-run app</h2>
              <p style={{ margin: ".25rem 0 0", color: "rgba(255,255,255,.58)", fontSize: ".76rem", lineHeight: 1.45 }}>First-party placement only · recommended creative: 970 × 90 desktop and 320 × 100 mobile.</p>
            </div>
          </div>
          <span style={{ color: "rgba(255,255,255,.62)", border: "1px solid rgba(255,255,255,.18)", borderRadius: "4px", padding: ".56rem .72rem", fontSize: ".68rem", fontWeight: 900, whiteSpace: "nowrap" }}>CREATIVE PENDING</span>
        </div>
      </div>
    </aside>
  );
}
