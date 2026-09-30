import React from "react";
import { CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getHomepageEvent } from "@/lib/eventFilters";

function formatEventDate(value: Date | string, timeZone?: string | null) {
  const date = new Date(value);
  const dateTime = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", ...(timeZone ? { timeZone } : {}) }).format(date);
  if (!timeZone) return dateTime;
  const zone = new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "short" }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value;
  return zone ? `${dateTime} ${zone}` : dateTime;
}

export default function NextTezosEventWidget() {
  const { data: events = [], isLoading } = trpc.tezosEventCandidates.published.useQuery(undefined, { staleTime: 5 * 60_000 });
  const selection = getHomepageEvent(events);

  if (!isLoading && !selection) {
    return (
      <aside aria-label="Tezos events" style={{ background: "#05152e", border: "1px solid rgba(251,191,36,0.22)", borderRadius: "8px", padding: "1.1rem" }}>
        <p style={{ margin: 0, color: "#fcd34d", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase" }}>Tezos events</p>
        <h2 style={{ margin: "0.5rem 0", color: "#fff", fontSize: "1.05rem", lineHeight: 1.25 }}>No upcoming event is currently published</h2>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.58)", fontSize: "0.78rem", lineHeight: 1.55 }}>Browse the editor-reviewed calendar or submit an official listing for review.</p>
        <Link href="/events" style={{ display: "inline-flex", marginTop: "0.8rem", color: "#fcd34d", fontSize: "0.72rem", fontWeight: 800, textDecoration: "none" }}>Browse events →</Link>
      </aside>
    );
  }

  const event = selection?.event;
  const stateLabel = selection?.state === "ongoing" ? "Now showing" : "Next event";
  return (
    <aside aria-label="Next Tezos event" style={{ background: "linear-gradient(135deg, #0b2144 0%, #05152e 100%)", border: "1px solid rgba(251,191,36,0.38)", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", padding: "0.85rem 1rem", borderBottom: "1px solid rgba(251,191,36,0.18)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#fcd34d", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase" }}><CalendarDays size={14} aria-hidden="true" /> {stateLabel}</span>
        <Link href="/events" style={{ color: "rgba(255,255,255,0.63)", fontSize: "0.68rem", fontWeight: 800, textDecoration: "none" }}>All events →</Link>
      </div>
      <div style={{ padding: "1rem" }}>
        {isLoading || !event ? <div className="skeleton" style={{ height: "136px" }} /> : <>
          <p style={{ margin: 0, color: "#fcd34d", fontSize: "0.7rem", fontWeight: 800, lineHeight: 1.45 }}>{formatEventDate(event.startAt, event.timezone)}</p>
          <h2 style={{ margin: "0.5rem 0", color: "#fff", fontSize: "1.08rem", lineHeight: 1.25 }}>{event.title}</h2>
          {event.location && <p style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", margin: "0.6rem 0", color: "rgba(255,255,255,0.62)", fontSize: "0.73rem", lineHeight: 1.45 }}><MapPin size={13} style={{ flexShrink: 0, marginTop: "0.1rem" }} aria-hidden="true" />{event.location}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem", marginTop: "0.9rem" }}>
            <Link href="/events" style={{ color: "#fcd34d", fontSize: "0.72rem", fontWeight: 900, textDecoration: "none" }}>View calendar →</Link>
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "rgba(255,255,255,0.72)", fontSize: "0.72rem", fontWeight: 800, textDecoration: "none" }}>Official listing <ExternalLink size={12} aria-hidden="true" /></a>
          </div>
        </>}
      </div>
    </aside>
  );
}
