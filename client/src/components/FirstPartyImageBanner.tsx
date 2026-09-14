import React from "react";
import { getMediaUrl } from "@/lib/mediaUrl";

const OPTIMISED_MARKETING_BANNER = "/manus-storage/xtz-news-optimised-marketing-premium-mobile@2x_6154575a.webp";

type FirstPartyImageBannerProps = {
  placement: "home" | "article";
};

/** A first-party promotion with no network scripts, tracking redirects, or third-party assets. */
export default function FirstPartyImageBanner({ placement }: FirstPartyImageBannerProps) {
  const isHome = placement === "home";
  return (
    <aside aria-label="First-party promotion for Optimised Marketing" style={{ background: isHome ? "#000" : "transparent", padding: isHome ? ".9rem 0 .35rem" : "2rem 0 0" }}>
      <div className={isHome ? "container" : undefined} style={isHome ? { padding: "0 1.25rem" } : undefined}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p style={{ margin: "0 0 .35rem", color: "#63f7b1", fontSize: ".62rem", fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase" }}>From our network</p>
          <a
            href="https://optimised.marketing"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Optimised Marketing, the team building and supporting XTZ.News"
            style={{ display: "block", borderRadius: "5px", overflow: "hidden", border: "1px solid rgba(99,247,177,.3)", lineHeight: 0, boxShadow: "0 8px 24px rgba(0,0,0,.2)" }}
          >
            <img
              src={getMediaUrl(OPTIMISED_MARKETING_BANNER)}
              alt="Optimised Marketing proudly building and supporting XTZ.News — Web3 sites, apps, and digital products"
              width={640}
              height={200}
              loading={isHome ? "eager" : "lazy"}
              decoding="async"
              style={{ display: "block", width: "100%", height: "auto", aspectRatio: "16 / 5", objectFit: "contain", background: "#06142b" }}
            />
          </a>
        </div>
      </div>
    </aside>
  );
}
