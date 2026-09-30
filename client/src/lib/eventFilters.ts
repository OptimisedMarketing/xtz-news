export const EVENT_TYPE_LABELS: Record<string, string> = {
  community: "Community gathering", conference: "Conference", meetup: "Meetup", workshop: "Workshop", exhibition: "Exhibition", online: "Online event", other: "Other",
};

type FilterableEvent = { eventType?: string | null; location?: string | null };
type TimedEvent = FilterableEvent & { startAt: Date | string; endAt?: Date | string | null };

export const RECENT_EVENT_WINDOW_MS = 45 * 24 * 60 * 60 * 1000;

export function getEventLocations<T extends FilterableEvent>(events: T[]) {
  return Array.from(new Set(events.map((event) => event.location?.trim()).filter((location): location is string => Boolean(location)))).sort((left, right) => left.localeCompare(right));
}

export function getEventTypes<T extends FilterableEvent>(events: T[]) {
  return Array.from(new Set(events.map((event) => event.eventType).filter((type): type is string => Boolean(type)))).sort((left, right) => (EVENT_TYPE_LABELS[left] || left).localeCompare(EVENT_TYPE_LABELS[right] || right));
}

export function filterPublishedEvents<T extends FilterableEvent>(events: T[], location: string, eventType: string) {
  return events.filter((event) => (location === "all" || event.location?.trim() === location) && (eventType === "all" || event.eventType === eventType));
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
