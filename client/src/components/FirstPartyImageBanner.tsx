import React from "react";
import { getMediaUrl } from "@/lib/mediaUrl";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

const OPTIMISED_MARKETING_BANNER = "/manus-storage/optimised-marketing-xtz-news-wide_fbd697e0.png";

type FirstPartyImageBannerProps = {
  placement: "home" | "article";
};
type BannerCampaign = { active: boolean; endAt: string | null };

export function isFirstPartyBannerVisible(campaign: BannerCampaign, now = Date.now()) {
  if (!campaign.active) return false;
  if (!campaign.endAt) return true;
  const endAt = Date.parse(campaign.endAt);
  return Number.isNaN(endAt) || endAt > now;
}

/** A first-party promotion with no network scripts, tracking redirects, or third-party assets. */
export function FirstPartyImageBannerPresentation({ placement, campaign, now }: FirstPartyImageBannerProps & { campaign: BannerCampaign; now: number }) {
  if (!isFirstPartyBannerVisible(campaign, now)) return null;
  const isHome = placement === "home";
  const maxWidth = isHome ? "980px" : "760px";
  return (
    <aside aria-label="First-party promotion for Optimised Marketing" style={{ background: isHome ? "#000" : "transparent", padding: isHome ? ".35rem 0 .15rem" : "2rem 0 0" }}>
      <div className={isHome ? "container" : undefined} style={isHome ? { padding: "0 1.25rem" } : undefined}>
        <div style={{ maxWidth, margin: "0 auto" }}>
          <p style={{ margin: "0 0 .2rem", color: "#63f7b1", fontSize: ".58rem", fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase" }}>From our network</p>
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
              width={2172}
              height={724}
              loading={isHome ? "eager" : "lazy"}
              decoding="async"
              style={{ display: "block", width: "100%", height: "auto", aspectRatio: "3 / 1", objectFit: "contain", background: "#06142b" }}
            />
          </a>
        </div>
      </div>
    </aside>
  );
}

export default function FirstPartyImageBanner({ placement }: FirstPartyImageBannerProps) {
  const { data } = trpc.settings.getFirstPartyBannerCampaign.useQuery();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return <FirstPartyImageBannerPresentation placement={placement} campaign={data ?? { active: true, endAt: null }} now={now} />;
}
