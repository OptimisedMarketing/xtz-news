export const EVENT_TYPE_LABELS: Record<string, string> = {
  community: "Community gathering", conference: "Conference", meetup: "Meetup", workshop: "Workshop", exhibition: "Exhibition", online: "Online event", other: "Other",
};

type FilterableEvent = { eventType?: string | null; location?: string | null; speakers?: string[] | null; topics?: string[] | null };
type TimedEvent = FilterableEvent & { startAt: Date | string; endAt?: Date | string | null };
export type EventDateScope = "current" | "upcoming" | "past" | "all";

export const RECENT_EVENT_WINDOW_MS = 45 * 24 * 60 * 60 * 1000;

export function getEventLocations<T extends FilterableEvent>(events: T[]) {
  return Array.from(new Set(events.map((event) => event.location?.trim()).filter((location): location is string => Boolean(location)))).sort((left, right) => left.localeCompare(right));
}

export function getEventTypes<T extends FilterableEvent>(events: T[]) {
  return Array.from(new Set(events.map((event) => event.eventType).filter((type): type is string => Boolean(type)))).sort((left, right) => (EVENT_TYPE_LABELS[left] || left).localeCompare(EVENT_TYPE_LABELS[right] || right));
}

function normaliseDiscoveryLabel(value: string) {
  return value.trim();
}

function getDiscoveryLabels(events: Array<FilterableEvent>, field: "speakers" | "topics") {
  return Array.from(new Set(events.flatMap((event) => event[field] ?? []).map(normaliseDiscoveryLabel).filter(Boolean))).sort((left, right) => left.localeCompare(right));
}

export function getEventSpeakers<T extends FilterableEvent>(events: T[]) {
  return getDiscoveryLabels(events, "speakers");
}

export function getEventTopics<T extends FilterableEvent>(events: T[]) {
  return getDiscoveryLabels(events, "topics");
}

function includesDiscoveryLabel(labels: string[] | null | undefined, selected: string) {
  return selected === "all" || (labels ?? []).some((label) => normaliseDiscoveryLabel(label) === selected);
}

export function filterPublishedEvents<T extends FilterableEvent>(events: T[], location: string, eventType: string, speaker = "all", topic = "all") {
  return events.filter((event) => (
    (location === "all" || event.location?.trim() === location)
    && (eventType === "all" || event.eventType === eventType)
    && includesDiscoveryLabel(event.speakers, speaker)
    && includesDiscoveryLabel(event.topics, topic)
  ));
}

/**
 * Keep a compact editorial record of recently completed events without placing
 * them among active plans. Multi-day exhibitions remain current until their
 * stated end time, while passed events remain visible for a short review window.
 */
export function getEventDisplayGroups<T extends TimedEvent>(events: T[], now = Date.now(), recentWindowMs = RECENT_EVENT_WINDOW_MS) {
  const currentOrUpcoming: T[] = [];
  const recentlyPassed: T[] = [];

  for (const event of events) {
    const startAt = new Date(event.startAt).getTime();
    const endAt = event.endAt ? new Date(event.endAt).getTime() : startAt;
    if (!Number.isFinite(startAt) || !Number.isFinite(endAt)) continue;
    if (endAt >= now) currentOrUpcoming.push(event);
    else if (endAt >= now - recentWindowMs) recentlyPassed.push(event);
  }

  return {
    currentOrUpcoming: currentOrUpcoming.sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime()),
    recentlyPassed: recentlyPassed.sort((left, right) => new Date(right.endAt ?? right.startAt).getTime() - new Date(left.endAt ?? left.startAt).getTime()),
  };
}

function getEventStart(event: TimedEvent) {
  return new Date(event.startAt).getTime();
}

function getEventEnd(event: TimedEvent) {
  return new Date(event.endAt ?? event.startAt).getTime();
}

function getStartOfDate(value: string) {
  return new Date(`${value}T00:00:00`).getTime();
}

function getEndOfDate(value: string) {
  return new Date(`${value}T23:59:59.999`).getTime();
}

export function filterEventsByDateScope<T extends TimedEvent>(events: T[], options: { scope: EventDateScope; from?: string; to?: string; now?: number }) {
  const now = options.now ?? Date.now();
  const from = options.from ? getStartOfDate(options.from) : undefined;
  const to = options.to ? getEndOfDate(options.to) : undefined;

  return events
    .filter((event) => {
      const start = getEventStart(event);
      const end = getEventEnd(event);
      if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
      if (options.scope === "current" && end < now) return false;
      if (options.scope === "upcoming" && start < now) return false;
      if (options.scope === "past" && end >= now) return false;
      if (from !== undefined && start < from) return false;
      if (to !== undefined && start > to) return false;
      return true;
    })
    .sort((left, right) => {
      if (options.scope === "past") return getEventEnd(right) - getEventEnd(left);
      return getEventStart(left) - getEventStart(right);
    });
}

/** Prefer the next scheduled event; retain a currently running event only when there is no future listing. */
export function getHomepageEvent<T extends TimedEvent>(events: T[], now = Date.now()) {
  const upcoming = events.filter((event) => getEventStart(event) >= now).sort((left, right) => getEventStart(left) - getEventStart(right))[0];
  if (upcoming) return { event: upcoming, state: "upcoming" as const };

  const ongoing = events.filter((event) => getEventStart(event) < now && getEventEnd(event) >= now).sort((left, right) => getEventEnd(left) - getEventEnd(right))[0];
  return ongoing ? { event: ongoing, state: "ongoing" as const } : undefined;
}
