import { Link } from "wouter";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function XtzPriceWidget() {
  const { data: prices, isLoading } = trpc.prices.tezosTokens.useQuery(undefined, {
    staleTime: 90_000,
    refetchInterval: 90_000,
  });

  const xtz = prices?.find((p: any) => p.symbol === "XTZ" || p.id === "tezos");

  if (isLoading || !xtz) {
    return (
      <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "1rem", marginBottom: "1.5rem" }}>
        <div className="skeleton" style={{ height: "14px", width: "80px", marginBottom: "8px" }} />
        <div className="skeleton" style={{ height: "24px", width: "120px", marginBottom: "6px" }} />
        <div className="skeleton" style={{ height: "12px", width: "60px" }} />
      </div>
    );
  }

  const price = typeof xtz.price === "number" ? xtz.price : parseFloat(xtz.price || "0");
  const change = typeof xtz.change24h === "number" ? xtz.change24h : parseFloat(xtz.change24h || "0");
  const isUp = change >= 0;

  return (
    <Link href="/prices" style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          background: "#05152e",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "6px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          transition: "border-color 0.2s, background 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.4)";
          (e.currentTarget as HTMLElement).style.background = "#0a1f3d";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLElement).style.background = "#05152e";
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            {xtz.image && (
              <img src={xtz.image} alt="XTZ" style={{ width: "18px", height: "18px", borderRadius: "50%" }} />
            )}
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Tezos (XTZ)
            </span>
          </div>
          <ExternalLink size={11} style={{ color: "rgba(255,255,255,0.25)" }} />
        </div>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
            ${price < 1 ? price.toFixed(4) : price.toFixed(2)}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            {isUp ? (
              <TrendingUp size={12} style={{ color: "#22c55e" }} />
            ) : (
              <TrendingDown size={12} style={{ color: "#ef4444" }} />
            )}
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isUp ? "#22c55e" : "#ef4444" }}>
              {isUp ? "+" : ""}{change.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Sparkline if available */}
        {xtz.sparkline && xtz.sparkline.length > 1 && (
          <div style={{ marginTop: "0.6rem", height: "28px", position: "relative", overflow: "hidden" }}>
            <svg viewBox={`0 0 ${xtz.sparkline.length - 1} 28`} preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              {(() => {
                const vals: number[] = xtz.sparkline;
                const min = Math.min(...vals);
                const max = Math.max(...vals);
                const range = max - min || 1;
                const points = vals.map((v: number, i: number) =>
                  `${i},${28 - ((v - min) / range) * 24}`
                ).join(" ");
                return (
                  <polyline
                    points={points}
                    fill="none"
                    stroke={isUp ? "#22c55e" : "#ef4444"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />
                );
              })()}
            </svg>
          </div>
        )}

        <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", margin: "0.5rem 0 0", textAlign: "right" }}>
          View all Tezos token prices →
        </p>
      </div>
    </Link>
  );
}
