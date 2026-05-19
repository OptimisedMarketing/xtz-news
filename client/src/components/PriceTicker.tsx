import { TrendingUp, TrendingDown } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(4)}`;
  return `$${price.toExponential(2)}`;
}

function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

/** Tiny inline SVG sparkline */
function Sparkline({ data, isUp }: { data: number[]; isUp: boolean }) {
  if (!data || data.length < 2) return null;
  const w = 48, h = 20;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ flexShrink: 0 }}>
      <polyline
        points={pts}
        fill="none"
        stroke={isUp ? "#4ade80" : "#f87171"}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PriceTicker() {
  const [, navigate] = useLocation();
  const { data: tokens = [], isLoading } = trpc.prices.tezosTokens.useQuery(undefined, {
    refetchInterval: 90_000,
    staleTime: 60_000,
  });

  if (isLoading || tokens.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...tokens, ...tokens];

  return (
    <div style={{
      background: "#0a1f3d",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      overflow: "hidden",
      height: "36px",
      display: "flex",
      alignItems: "center",
    }}>
      {/* Label */}
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

      {/* Scrolling track */}
      <div style={{
        flex: 1,
        overflow: "hidden",
        position: "relative",
        maskImage: "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",
      }}>
        <div
          className="ticker-track"
          style={{
            display: "flex",
            alignItems: "center",
            animation: "ticker-scroll 80s linear infinite",
            width: "max-content",
          }}
        >
          {items.map((token, idx) => {
            const isUp = token.change24h >= 0;
            const sparkline = (token as any).sparkline ?? [];
            return (
              <button
                key={`${token.id}-${idx}`}
                onClick={() => navigate("/prices")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0 1.25rem",
                  borderRight: "1px solid rgba(255,255,255,0.07)",
                  height: "36px",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  background: "none",
                  border: "none",
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.12)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                {/* Token logo */}
                {token.image && (
                  <img
                    src={token.image}
                    alt={token.symbol}
                    style={{ width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0 }}
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                  />
                )}

                {/* Symbol */}
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff", letterSpacing: "0.03em" }}>
                  {token.symbol}
                </span>

                {/* Price */}
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.75)", fontVariantNumeric: "tabular-nums" }}>
                  {formatPrice(token.price)}
                </span>

                {/* Sparkline */}
                {sparkline.length >= 2 && (
                  <Sparkline data={sparkline} isUp={isUp} />
                )}

                {/* 24h change */}
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: isUp ? "#4ade80" : "#f87171",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.1rem",
                }}>
                  {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {formatChange(token.change24h)}
                </span>
              </button>
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
