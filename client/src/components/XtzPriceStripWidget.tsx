import { trpc } from "@/lib/trpc";

/**
 * XtzPriceStripWidget — matches the tezos.systems Abyss widget style
 * but uses our own price data (CoinGecko via our server, not rate-limited)
 * Used in the Live Network strip on the home page
 */
export default function XtzPriceStripWidget({ width = 220, height = 100 }: { width?: number; height?: number }) {
  const { data: tokens } = trpc.prices.tezosTokens.useQuery(undefined, {
    staleTime: 60_000,
    refetchInterval: 90_000,
  });

  const xtz = tokens?.find((t: any) => t.id === "tezos" || t.symbol?.toUpperCase() === "XTZ");
  const price = xtz?.price ?? xtz?.current_price;
  // change24h is a decimal fraction (e.g. -0.00277 = -0.277%), multiply by 100
  const rawChange = xtz?.change24h ?? xtz?.price_change_percentage_24h;
  const change = rawChange != null ? (Math.abs(Number(rawChange)) < 1 ? Number(rawChange) * 100 : Number(rawChange)) : null;

  const isUp = change != null && change >= 0;
  const changeStr = change != null ? `${isUp ? "+" : ""}${change.toFixed(2)}%` : "—%";
  const priceStr = price != null ? `$${Number(price).toFixed(4)}` : "—";

  return (
    <div style={{
      width,
      height,
      background: "#0A0E1A",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      flexShrink: 0,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Live dot + label */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <span style={{
          display: "inline-block", width: "6px", height: "6px", borderRadius: "50%",
          background: "#2c7df7", animation: "xtzStripPulse 2s ease-in-out infinite"
        }} />
        <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c7df7" }}>
          XTZ PRICE
        </span>
      </div>

      {/* Price */}
      <div style={{
        fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 800,
        color: "#2c7df7", lineHeight: 1, letterSpacing: "-0.02em"
      }}>
        {priceStr}
      </div>

      {/* 24h change badge */}
      <div>
        <span style={{
          fontSize: "11px", fontWeight: 700,
          padding: "2px 7px", borderRadius: "4px",
          background: isUp ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
          color: isUp ? "#22c55e" : "#ef4444",
          border: `1px solid ${isUp ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
        }}>
          {changeStr}
        </span>
      </div>

      {/* Sub label */}
      <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
        24h change · CoinGecko · USD
      </div>

      <style>{`
        @keyframes xtzStripPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
