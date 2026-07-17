import { CheckCircle2 } from "lucide-react";

interface KeyTakeawaysProps {
  takeaways: string | null | undefined;
}

/**
 * Displays a "Key Takeaways" bulleted summary at the top of articles.
 * Stored as newline-separated bullet points in the DB (keyTakeaways field).
 * Improves readability and optimises for Google AI Overviews / rich snippets.
 */
export default function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  if (!takeaways) return null;

  const bullets = takeaways
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter((line) => line.length > 0);

  if (bullets.length === 0) return null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(44,125,247,0.08) 0%, rgba(26,106,224,0.05) 100%)",
        border: "1px solid rgba(44,125,247,0.2)",
        borderLeft: "3px solid #2c7df7",
        borderRadius: "6px",
        padding: "1.25rem 1.5rem",
        marginBottom: "1.75rem",
      }}
      aria-label="Key Takeaways"
    >
      <h2
        style={{
          fontSize: "0.72rem",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#2c7df7",
          margin: "0 0 0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <CheckCircle2 size={13} />
        Key Takeaways
      </h2>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {bullets.map((bullet, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.625rem",
              fontSize: "0.88rem",
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.55,
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#2c7df7",
                flexShrink: 0,
                marginTop: "0.45rem",
              }}
            />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
