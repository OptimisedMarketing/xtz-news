import type { MonthlyDigestWindow } from "./monthlyDigest";

export type MonthlyDigestEvent = {
  title: string;
  startAt: Date;
  endAt: Date | null;
  location: string | null;
  timezone: string | null;
  eventType: string;
  sourceUrl: string;
};

export type MonthlyDigestEventBadge = {
  label: string;
  color: string;
  background: string;
};

export type MonthlyDigestEventOfTheMonth = MonthlyDigestEvent & {
  month: "past" | "upcoming";
};

/**
 * The first past event is the period's lead editorial highlight. When no event
 * took place in the completed month, the nearest confirmed upcoming event fills
 * that compact position instead.
 */
export function getMonthlyDigestEventOfTheMonth(
  pastEvents: MonthlyDigestEvent[],
  upcomingEvents: MonthlyDigestEvent[],
): MonthlyDigestEventOfTheMonth | null {
  if (pastEvents.length) return { ...pastEvents[0], month: "past" };
  if (upcomingEvents.length) return { ...upcomingEvents[0], month: "upcoming" };
  return null;
}

/** Maps existing reviewed event types to concise, reader-facing email badges. */
export function getMonthlyDigestEventBadge(eventType: string): MonthlyDigestEventBadge {
  switch (eventType) {
    case "exhibition":
      return { label: "Art", color: "#f0abfc", background: "rgba(240,171,252,0.14)" };
    case "conference":
      return { label: "Conference", color: "#93c5fd", background: "rgba(147,197,253,0.14)" };
    case "workshop":
      return { label: "Workshop", color: "#fde68a", background: "rgba(253,230,138,0.14)" };
    case "meetup":
    case "community":
      return { label: "Meetup", color: "#86efac", background: "rgba(134,239,172,0.14)" };
    case "online":
      return { label: "Online", color: "#99f6e4", background: "rgba(153,246,228,0.14)" };
    default:
      return { label: "Tezos event", color: "#c4b5fd", background: "rgba(196,181,253,0.14)" };
  }
}

/**
 * Returns editor-published events that took place at any point in the completed
 * digest month. This includes a multi-day exhibition already underway on the
 * first of the month, but excludes events that ended precisely at the boundary.
 */
export function getEventsInDigestMonth(events: MonthlyDigestEvent[], window: MonthlyDigestWindow): MonthlyDigestEvent[] {
  return events
    .filter((event) => event.startAt < window.end && (event.endAt ?? event.startAt) > window.start)
    .sort((left, right) => left.startAt.getTime() - right.startAt.getTime());
}

/**
 * Returns the nearest confirmed, editor-published event dates after the digest
 * has been sent. A bounded list keeps the newsletter useful on months where the
 * calendar has a larger backlog, while the full calendar remains one click away.
 */
export function getUpcomingDigestEvents(events: MonthlyDigestEvent[], now: Date, limit = 8): MonthlyDigestEvent[] {
  return events
    .filter((event) => event.startAt >= now)
    .sort((left, right) => left.startAt.getTime() - right.startAt.getTime())
    .slice(0, limit);
}

export function formatMonthlyDigestEventDate(event: MonthlyDigestEvent): string {
  const timeZone = event.timezone || "UTC";
  const format = (value: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", {
    timeZone,
    ...options,
  }).format(value);

  const startDate = format(event.startAt, { day: "numeric", month: "short", year: "numeric" });
  const startTime = format(event.startAt, { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
  if (!event.endAt || event.endAt.getTime() <= event.startAt.getTime()) return `${startDate}, ${startTime}`;

  const endDate = format(event.endAt, { day: "numeric", month: "short", year: "numeric" });
  const endTime = format(event.endAt, { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
  return startDate === endDate
    ? `${startDate}, ${startTime}–${endTime}`
    : `${startDate}, ${startTime} – ${endDate}, ${endTime}`;
}
