import { describe, expect, it } from "vitest";
import { buildEventCalendarIcs } from "./eventCalendar";

describe("event calendar download", () => {
  it("creates a portable calendar event with an escaped source-linked description", () => {
    const calendar = buildEventCalendarIcs({ id: "responsive-signals", title: "Responsive Signals", startAt: "2026-09-22T22:00:00.000Z", endAt: "2026-09-23T01:00:00.000Z", location: "New York, USA", description: "Talks; installations", sourceUrl: "https://movingimage.org/event" });
    expect(calendar).toContain("BEGIN:VCALENDAR");
    expect(calendar).toContain("DTSTART:20260922T220000Z");
    expect(calendar).toContain("LOCATION:New York\\, USA");
    expect(calendar).toContain("DESCRIPTION:Talks\\; installations\\n\\nSource: https://movingimage.org/event");
    expect(calendar).toContain("END:VCALENDAR");
  });
});
