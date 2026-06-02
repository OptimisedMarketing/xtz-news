import { useState } from "react";
import { Link } from "wouter";
import { X, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";

const DISMISSED_KEY = "xtz_breaking_news_dismissed";

export default function BreakingNewsBanner() {
  const { data } = trpc.settings.getBreakingNews.useQuery(undefined, {
    staleTime: 5 * 60_000,
  });

  const [dismissed, setDismissed] = useState(() => {
    try {
      const stored = sessionStorage.getItem(DISMISSED_KEY);
      return stored === (data?.text || "");
    } catch {
      return false;
    }
  });

  if (!data?.active || !data?.text || dismissed) return null;

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISSED_KEY, data.text || "");
    } catch {}
    setDismissed(true);
  };

  const content = (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
        <Zap size={13} style={{ color: "#fbbf24" }} />
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
    <div style={{
      background: "linear-gradient(90deg, #1a0a00 0%, #2d1500 50%, #1a0a00 100%)",
      borderBottom: "1px solid rgba(251,191,36,0.3)",
      padding: "0.6rem 0",
      position: "relative",
      zIndex: 50,
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
