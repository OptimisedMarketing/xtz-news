import { describe, expect, it } from "vitest";
import { renderEventsCalendarFeed } from "./eventCalendarFeed";

describe("events calendar subscription feed", () => {
  it("emits only future editor-published event records as a standards-compatible calendar", () => {
    const feed = renderEventsCalendarFeed([
      { id: 1, title: "Completed event", startAt: "2026-09-22T22:00:00.000Z", endAt: "2026-09-23T01:00:00.000Z", sourceUrl: "https://example.com/completed" },
      { id: 2, title: "Quantum; research, panel", description: "A future session\nwith speakers.", startAt: "2026-10-07T08:20:00.000Z", endAt: "2026-10-07T08:50:00.000Z", location: "Singapore, SG", sourceUrl: "https://example.com/future", updatedAt: "2026-09-30T16:00:00.000Z" },
    ], { baseUrl: "https://xtz.news", now: new Date("2026-09-30T12:00:00.000Z") });

    expect(feed).toContain("BEGIN:VCALENDAR");
    expect(feed).toContain("X-WR-CALNAME:XTZ.News Tezos Events");
    expect(feed).toContain("REFRESH-INTERVAL;VALUE=DURATION:PT6H");
    expect(feed).toContain("UID:xtz-news-event-2@xtz.news");
    expect(feed).toContain("DTSTART:20261007T082000Z");
    expect(feed).toContain("SUMMARY:Quantum\\; research\\, panel");
    expect(feed).toContain("LOCATION:Singapore\\, SG");
    expect(feed).not.toContain("Completed event");
    expect(feed).toContain("END:VCALENDAR");
  });
});
