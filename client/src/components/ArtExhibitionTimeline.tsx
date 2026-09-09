import React, { useMemo, useState } from "react";
import { CalendarDays, ChevronDown, ExternalLink, MapPin, Plus } from "lucide-react";
import { getEventCalendarDownloadHref } from "@/lib/eventCalendar";

export type TimelineFilter = "all" | "upcoming" | "current" | "past";
export type ExhibitionTimelineEntry = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  calendarStartAt?: string;
  calendarEndAt?: string;
  location: string;
  description: string;
  sourceLabel: string;
  sourceUrl: string;
};

const FILTER_LABELS: Record<TimelineFilter, string> = { all: "All dates", upcoming: "Upcoming", current: "On now", past: "Past" };

export function getExhibitionTimelineStatus(event: Pick<ExhibitionTimelineEntry, "startDate" | "endDate">, date = new Date()): Exclude<TimelineFilter, "all"> {
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const start = new Date(`${event.startDate}T00:00:00Z`).getTime();
  const end = new Date(`${event.endDate}T23:59:59Z`).getTime();
  return today < start ? "upcoming" : today > end ? "past" : "current";
}

function formatTimelineDate(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function calendarFileName(title: string) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tezos-event"}.ics`;
}

export default function ArtExhibitionTimeline({ entries }: { entries: readonly ExhibitionTimelineEntry[] }) {
  const [filter, setFilter] = useState<TimelineFilter>("all");
  const [openId, setOpenId] = useState<string | null>(() => entries.find((entry) => getExhibitionTimelineStatus(entry) !== "past")?.id ?? null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const visibleEntries = useMemo(() => entries.filter((entry) => filter === "all" || getExhibitionTimelineStatus(entry) === filter), [entries, filter]);

  return <section id="art-timeline" style={{ padding: "3.25rem 0", background: "#0a0b17", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
    <div className="container">
      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div><p style={{ display: "flex", gap: "0.4rem", alignItems: "center", margin: 0, color: "#f6c453", fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}><CalendarDays size={14} aria-hidden="true" /> Exhibition timeline</p><h2 style={{ margin: "0.35rem 0 0", color: "#fff", fontSize: "1.55rem" }}>Tezos digital-art dates</h2></div>
        <p style={{ margin: 0, maxWidth: "430px", color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", lineHeight: 1.5 }}>Hover or focus a date for a quick preview, then open the original listing before arranging a visit or relying on availability.</p>
      </div>
      <div role="group" aria-label="Filter exhibitions by timing" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "1.35rem 0" }}>{(Object.keys(FILTER_LABELS) as TimelineFilter[]).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} style={{ minHeight: "38px", padding: "0.5rem 0.75rem", borderRadius: "999px", border: filter === value ? "1px solid #f6c453" : "1px solid rgba(255,255,255,0.18)", background: filter === value ? "rgba(246,196,83,0.14)" : "transparent", color: filter === value ? "#f6c453" : "rgba(255,255,255,0.72)", fontSize: "0.75rem", fontWeight: 800, cursor: "pointer" }}>{FILTER_LABELS[value]}</button>)}</div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, borderLeft: "2px solid rgba(246,196,83,0.45)", marginLeft: "0.5rem" }}>{visibleEntries.map((entry) => {
        const status = getExhibitionTimelineStatus(entry);
        const expanded = openId === entry.id;
        const previewing = previewId === entry.id;
        const dateRange = `${formatTimelineDate(entry.startDate)}${entry.endDate !== entry.startDate ? ` – ${formatTimelineDate(entry.endDate)}` : ""}`;
        const calendarHref = getEventCalendarDownloadHref({ id: entry.id, title: entry.title, startAt: entry.calendarStartAt ?? `${entry.startDate}T00:00:00.000Z`, endAt: entry.calendarEndAt ?? `${entry.endDate}T23:59:59.000Z`, location: entry.location, description: entry.description, sourceUrl: entry.sourceUrl });
        return <li key={entry.id} onMouseEnter={() => setPreviewId(entry.id)} onMouseLeave={() => setPreviewId(null)} style={{ position: "relative", padding: "0 0 1.1rem 1.35rem" }}>
          <span aria-hidden="true" style={{ position: "absolute", top: "1rem", left: "-7px", width: "12px", height: "12px", borderRadius: "50%", background: status === "upcoming" ? "#f6c453" : status === "current" ? "#5eead4" : "#64748b", boxShadow: status === "current" ? "0 0 0 4px rgba(94,234,212,0.12)" : "none" }} />
          <article style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", background: "#060b17", overflow: "hidden" }}>
            <button type="button" onFocus={() => setPreviewId(entry.id)} onBlur={() => setPreviewId(null)} onClick={() => setOpenId((id) => id === entry.id ? null : entry.id)} aria-expanded={expanded} aria-controls={`timeline-${entry.id}`} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "1rem", border: 0, color: "#fff", background: "transparent", textAlign: "left", cursor: "pointer" }}><span><span style={{ display: "block", marginBottom: "0.28rem", color: status === "upcoming" ? "#f6c453" : status === "current" ? "#5eead4" : "rgba(255,255,255,0.47)", fontSize: "0.66rem", fontWeight: 900, letterSpacing: "0.09em", textTransform: "uppercase" }}>{status === "current" ? "On now" : status} · {dateRange}</span><strong style={{ fontSize: "1rem" }}>{entry.title}</strong></span><ChevronDown size={18} aria-hidden="true" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 180ms cubic-bezier(0.23, 1, 0.32, 1)", flexShrink: 0 }} /></button>
            {expanded && <div id={`timeline-${entry.id}`} style={{ padding: "0 1rem 1rem" }}><p style={{ margin: "0 0 0.45rem", color: "rgba(255,255,255,0.68)", fontSize: "0.83rem", lineHeight: 1.55 }}>{entry.description}</p><p style={{ margin: "0 0 0.7rem", color: "rgba(255,255,255,0.48)", fontSize: "0.75rem" }}>{entry.location}</p><div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}><a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#f6c453", fontSize: "0.75rem", fontWeight: 800 }}>{entry.sourceLabel} <ExternalLink size={13} /></a>{status === "upcoming" && <a href={calendarHref} download={calendarFileName(entry.title)} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#5eead4", fontSize: "0.75rem", fontWeight: 800 }}><Plus size={13} /> Add to calendar</a>}</div></div>}
          </article>
          {previewing && <aside role="status" aria-label={`${entry.title} quick preview`} style={{ marginTop: "0.5rem", border: "1px solid rgba(246,196,83,0.3)", borderRadius: "8px", padding: "0.8rem 1rem", background: "rgba(246,196,83,0.08)", color: "#fff", animation: "artTimelinePreview 180ms cubic-bezier(0.23, 1, 0.32, 1) both" }}><strong style={{ display: "block", fontSize: "0.8rem" }}>Quick preview · {entry.title}</strong><span style={{ display: "block", marginTop: "0.3rem", color: "rgba(255,255,255,0.68)", fontSize: "0.74rem", lineHeight: 1.45 }}><MapPin size={12} style={{ display: "inline", verticalAlign: "-1px", marginRight: "0.25rem" }} />{entry.location} · {dateRange}</span><a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", marginTop: "0.5rem", color: "#f6c453", fontSize: "0.72rem", fontWeight: 800 }}>View event details <ExternalLink size={12} /></a></aside>}
        </li>;
      })}</ol>
      {visibleEntries.length === 0 && <p style={{ margin: "1rem 0 0", color: "rgba(255,255,255,0.55)" }}>No confirmed events match this view.</p>}
    </div>
    <style>{`@keyframes artTimelinePreview { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } } @media (prefers-reduced-motion: reduce) { [aria-label$="quick preview"] { animation: none !important; } }`}</style>
  </section>;
}
