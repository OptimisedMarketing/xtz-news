import { describe, expect, it } from "vitest";
import { EVENT_TYPE_LABELS, filterPublishedEvents, getEventLocations, getEventTypes } from "./eventFilters";

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
});
