import { describe, expect, it } from "vitest";
import { getPreviousCalendarMonth } from "./monthlyDigest";
import { formatMonthlyDigestEventDate, getEventsInDigestMonth, getUpcomingDigestEvents, type MonthlyDigestEvent } from "./monthlyDigestEvents";

const event = (overrides: Partial<MonthlyDigestEvent> = {}): MonthlyDigestEvent => ({
  title: "Example Tezos event",
  startAt: new Date("2026-09-23T16:00:00.000Z"),
  endAt: new Date("2026-09-23T20:00:00.000Z"),
  location: "Vienna, Austria",
  timezone: "Europe/Vienna",
  eventType: "exhibition",
  sourceUrl: "https://example.test/event",
  ...overrides,
});

describe("monthly digest event selection", () => {
  const september = getPreviousCalendarMonth(new Date("2026-10-01T08:00:00.000Z"));

  it("includes events that overlap the completed digest month", () => {
    const results = getEventsInDigestMonth([
      event({ title: "August–October exhibition", startAt: new Date("2026-08-06T04:00:00.000Z"), endAt: new Date("2026-10-26T03:59:59.000Z") }),
      event({ title: "September event" }),
      event({ title: "October event", startAt: new Date("2026-10-07T08:20:00.000Z"), endAt: new Date("2026-10-07T08:50:00.000Z") }),
      event({ title: "Finished before September", startAt: new Date("2026-08-20T08:00:00.000Z"), endAt: new Date("2026-09-01T00:00:00.000Z") }),
    ], september);

    expect(results.map((item) => item.title)).toEqual(["August–October exhibition", "September event"]);
  });

  it("returns a bounded, chronological list of upcoming confirmed events", () => {
    const results = getUpcomingDigestEvents([
      event({ title: "Later", startAt: new Date("2026-10-09T08:00:00.000Z") }),
      event({ title: "Sooner", startAt: new Date("2026-10-07T08:00:00.000Z") }),
      event({ title: "Already started", startAt: new Date("2026-09-30T08:00:00.000Z") }),
    ], new Date("2026-10-01T08:00:00.000Z"), 1);

    expect(results.map((item) => item.title)).toEqual(["Sooner"]);
  });

  it("formats dates in the organiser's declared timezone", () => {
    expect(formatMonthlyDigestEventDate(event())).toContain("23 Sept 2026");
    expect(formatMonthlyDigestEventDate(event())).toContain("CEST");
  });
});
