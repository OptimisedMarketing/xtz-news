export const EVENT_TYPE_LABELS: Record<string, string> = {
  community: "Community gathering", conference: "Conference", meetup: "Meetup", workshop: "Workshop", exhibition: "Exhibition", online: "Online event", other: "Other",
};

type FilterableEvent = { eventType?: string | null; location?: string | null };

export function getEventLocations<T extends FilterableEvent>(events: T[]) {
  return Array.from(new Set(events.map((event) => event.location?.trim()).filter((location): location is string => Boolean(location)))).sort((left, right) => left.localeCompare(right));
}

export function getEventTypes<T extends FilterableEvent>(events: T[]) {
  return Array.from(new Set(events.map((event) => event.eventType).filter((type): type is string => Boolean(type)))).sort((left, right) => (EVENT_TYPE_LABELS[left] || left).localeCompare(EVENT_TYPE_LABELS[right] || right));
}

export function filterPublishedEvents<T extends FilterableEvent>(events: T[], location: string, eventType: string) {
  return events.filter((event) => (location === "all" || event.location?.trim() === location) && (eventType === "all" || event.eventType === eventType));
}
