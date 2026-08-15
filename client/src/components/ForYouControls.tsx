import React from "react";
import { getTopicSelectionLabel } from "@/lib/forYouPresentation";

export function ForYouEmptyState() {
  return (
    <p role="status" aria-live="polite" style={{ margin: "0 0 0.65rem", color: "rgba(255,255,255,0.68)", fontSize: "0.78rem" }}>
      New stories from your followed topics will appear here as they are published. You can adjust your topics below.
    </p>
  );
}

export function TopicSelectionChip({
  name,
  following,
  onToggle,
  disabled = false,
  compact = false,
}: {
  name: string;
  following: boolean;
  onToggle: () => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={following}
      aria-label={getTopicSelectionLabel(name, following)}
      style={{
        padding: compact ? "0.4rem 0.58rem" : "0.42rem 0.6rem",
        border: `1px solid ${following ? "rgba(54,211,153,0.6)" : "rgba(255,255,255,0.14)"}`,
        background: following ? "rgba(54,211,153,0.12)" : "rgba(255,255,255,0.045)",
        color: following ? "#5fe4b1" : "rgba(255,255,255,0.78)",
        borderRadius: "999px",
        cursor: "pointer",
        fontSize: compact ? "0.68rem" : "0.7rem",
        fontWeight: 700,
      }}
    >
      {following ? "✓ " : "+ "}{name}
    </button>
  );
}
