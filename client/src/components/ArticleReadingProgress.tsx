import React from "react";

export default function ArticleReadingProgress({ progress }: { progress: number }) {
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));
  return (
    <div aria-label={`Article reading progress: ${safeProgress}%`} style={{ position: "fixed", top: 0, left: 0, right: 0, height: "4px", zIndex: 9999, pointerEvents: "none", background: "rgba(255,255,255,0.08)", boxShadow: "0 1px 10px rgba(0,0,0,0.28)" }}>
      <div role="progressbar" aria-label="Article reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeProgress} style={{ height: "100%", width: `${safeProgress}%`, minWidth: safeProgress > 0 ? "4px" : 0, background: "linear-gradient(90deg, #2c7df7 0%, #5a9fff 58%, #63f7b1 100%)", boxShadow: "0 0 10px rgba(99,247,177,0.55)", transition: "width 120ms linear" }} />
      <span className="sr-only">{safeProgress}% of this article read</span>
    </div>
  );
}
