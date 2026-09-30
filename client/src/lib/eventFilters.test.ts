import { describe, expect, it } from "vitest";
import { EVENT_TYPE_LABELS, filterPublishedEvents, getEventDisplayGroups, getEventLocations, getEventTypes } from "./eventFilters";

describe("public Tezos event filters", () => {
  const events = [
    { id: 1, location: "London, United Kingdom", eventType: "meetup" },
    { id: 2, location: "Online", eventType: "workshop" },
    { id: 3, location: "London, United Kingdom", eventType: "meetup" },
  ];

  it("derives stable location and event-type options from published events", () => {
    expect(getEventLocations(events)).toEqual(["London, United Kingdom", "Online"]);
    expect(getEventTypes(events)).toEqual(["meetup", "workshop"]);
    expect(EVENT_TYPE_LABELS.meetup).toBe("Meetup");
  });

  it("filters published events by location and event type together", () => {
    expect(filterPublishedEvents(events, "London, United Kingdom", "meetup").map((event) => event.id)).toEqual([1, 3]);
    expect(filterPublishedEvents(events, "Online", "meetup")).toEqual([]);
    expect(filterPublishedEvents(events, "all", "workshop").map((event) => event.id)).toEqual([2]);
  });

  it("keeps active multi-day listings separate from recently passed editorial records", () => {
    const now = Date.parse("2026-09-30T12:00:00.000Z");
    const grouped = getEventDisplayGroups([
      { id: 1, startAt: "2026-08-06T04:00:00.000Z", endAt: "2026-10-26T03:59:59.000Z", location: "New York", eventType: "exhibition" },
      { id: 2, startAt: "2026-09-23T16:00:00.000Z", endAt: "2026-09-23T20:00:00.000Z", location: "Vienna", eventType: "exhibition" },
      { id: 3, startAt: "2026-06-01T10:00:00.000Z", endAt: "2026-06-01T12:00:00.000Z", location: "London", eventType: "meetup" },
    ], now);

    expect(grouped.currentOrUpcoming.map((event) => event.id)).toEqual([1]);
    expect(grouped.recentlyPassed.map((event) => event.id)).toEqual([2]);
  });
});
