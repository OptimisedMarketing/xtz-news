import { useEffect, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { trpc } from "@/lib/trpc";

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(4)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toExponential(2)}`;
}

function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

export default function PriceTicker() {
  const { data: tokens = [], isLoading } = trpc.prices.tezosTokens.useQuery(undefined, {
    refetchInterval: 90_000, // Refresh every 90 seconds
    staleTime: 60_000,
  });

  const tickerRef = useRef<HTMLDivElement>(null);

  if (isLoading || tokens.length === 0) return null;

  // Duplicate tokens for seamless loop
  const items = [...tokens, ...tokens];

  return (
    <div
      style={{
        background: "#0a1f3d",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        height: "32px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* TEZOS TOKENS label */}
      <div style={{
        flexShrink: 0,
        padding: "0 0.875rem",
        fontSize: "0.6rem",
        fontWeight: 900,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#fff",
        background: "#2c7df7",
        height: "100%",
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        zIndex: 2,
      }}>
        TEZOS TOKENS
      </div>

      {/* Scrolling ticker */}
      <div
        ref={tickerRef}
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
          maskImage: "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
        }}
      >
        <div
          className="ticker-track"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            animation: "ticker-scroll 60s linear infinite",
            width: "max-content",
          }}
        >
          {items.map((token, idx) => {
            const isUp = token.change24h >= 0;
            return (
              <div
                key={`${token.id}-${idx}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0 1.25rem",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                  height: "32px",
                  whiteSpace: "nowrap",
                  cursor: "default",
                }}
              >
                {/* Token image */}
                {token.image && (
                  <img
                    src={token.image}
                    alt={token.symbol}
                    style={{ width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0 }}
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                  />
                )}

                {/* Symbol */}
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>
                  {token.symbol}
                </span>

                {/* Price */}
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.8)", fontVariantNumeric: "tabular-nums" }}>
                  {formatPrice(token.price)}
                </span>

                {/* Change */}
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: isUp ? "#4ade80" : "#f87171",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.15rem",
                }}>
                  {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {formatChange(token.change24h)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
