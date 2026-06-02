import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";

const DISMISSED_KEY = "xtz_breaking_news_dismissed";

export default function BreakingNewsBanner() {
  const { data } = trpc.settings.getBreakingNews.useQuery(undefined, {
    staleTime: 5 * 60_000,
  });

  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Check session storage once data loads
  useEffect(() => {
    if (!data?.text) return;
    try {
      const stored = sessionStorage.getItem(DISMISSED_KEY);
      if (stored === data.text) {
        setDismissed(true);
        return;
      }
    } catch {}
    // Trigger slide-down animation after a brief delay
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, [data?.text]);

  const handleDismiss = () => {
    // Slide up before removing
    setVisible(false);
    setTimeout(() => {
      try {
        sessionStorage.setItem(DISMISSED_KEY, data?.text || "");
      } catch {}
      setDismissed(true);
    }, 300);
  };

  if (!data?.active || !data?.text || dismissed) return null;

  const content = (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
        <Zap
          size={13}
          style={{
            color: "#fbbf24",
            animation: "zapPulse 1.5s ease-in-out infinite",
          }}
        />
        <span style={{
          fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase",
          letterSpacing: "0.12em", color: "#fbbf24", background: "rgba(251,191,36,0.15)",
          padding: "2px 7px", borderRadius: "2px", border: "1px solid rgba(251,191,36,0.3)",
          whiteSpace: "nowrap",
        }}>
          Breaking
        </span>
      </div>
      <p style={{
        margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "#fff",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {data.text}
      </p>
      {data.url && (
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fbbf24", whiteSpace: "nowrap", flexShrink: 0 }}>
          Read more →
        </span>
      )}
    </div>
  );

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes zapPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        @keyframes bannerShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div
        style={{
          background: "linear-gradient(90deg, #1a0a00 0%, #2d1500 50%, #1a0a00 100%)",
          borderBottom: "1px solid rgba(251,191,36,0.3)",
          position: "relative",
          zIndex: 50,
          overflow: "hidden",
          // Slide-down animation
          maxHeight: visible ? "60px" : "0px",
          opacity: visible ? 1 : 0,
          transition: "max-height 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease-out",
        }}
      >
        {/* Subtle shimmer effect on the background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.04) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "bannerShimmer 3s linear infinite",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.6rem 1.25rem",
            position: "relative",
          }}
        >
          {data.url ? (
            <Link href={data.url} style={{ textDecoration: "none", flex: 1, minWidth: 0, display: "flex" }}>
              {content}
            </Link>
          ) : (
            <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
              {content}
            </div>
          )}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss breaking news"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.4)", padding: "0.2rem", flexShrink: 0,
              display: "flex", alignItems: "center",
              transition: "color 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
              (e.currentTarget as HTMLElement).style.transform = "rotate(0deg)";
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
