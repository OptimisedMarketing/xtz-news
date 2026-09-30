import React from "react";
import { CalendarDays, ChevronRight, Rss } from "lucide-react";
import { Link } from "wouter";
import type { ArticleEventCalendarCallout } from "@/lib/articleEventCalendar";

export default function ArticleEventCalendarLink({ callout }: { callout: ArticleEventCalendarCallout }) {
  return (
    <aside aria-label="Related Tezos events" style={{ marginTop: "1.65rem", padding: "1.15rem 1.2rem", borderRadius: "10px", background: "linear-gradient(120deg, rgba(245,158,11,0.13), rgba(44,125,247,0.09))", border: "1px solid rgba(251,191,36,0.32)", boxShadow: "0 10px 28px rgba(0,0,0,0.16)" }}>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <div aria-hidden="true" style={{ display: "grid", placeItems: "center", flex: "0 0 auto", width: "34px", height: "34px", borderRadius: "8px", background: "rgba(251,191,36,0.15)", color: "#fcd34d" }}><CalendarDays size={18} /></div>
        <div>
          <p style={{ margin: 0, color: "#fcd34d", fontSize: "0.63rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em" }}>{callout.eyebrow}</p>
          <h2 style={{ margin: "0.35rem 0 0", color: "#fff", fontSize: "1.05rem", lineHeight: 1.25 }}>{callout.title}</h2>
          <p style={{ margin: "0.45rem 0 0", color: "rgba(255,255,255,0.72)", fontSize: "0.85rem", lineHeight: 1.55 }}>{callout.description}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", marginTop: "1rem" }}>
        <Link href={`/events${callout.eventQuery}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", minHeight: "38px", borderRadius: "5px", padding: "0.55rem 0.8rem", background: "#fbbf24", color: "#1d1603", textDecoration: "none", fontSize: "0.78rem", fontWeight: 900 }}>Open events <ChevronRight size={15} /></Link>
        <a href="https://xtz.news/events.ics" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", minHeight: "38px", borderRadius: "5px", padding: "0.55rem 0.8rem", border: "1px solid rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.9)", textDecoration: "none", fontSize: "0.78rem", fontWeight: 800 }}><Rss size={14} /> Calendar feed</a>
      </div>
    </aside>
  );
}
