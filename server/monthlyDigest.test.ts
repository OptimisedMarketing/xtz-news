import { describe, expect, it } from "vitest";
import { getPreviousCalendarMonth } from "./monthlyDigest";

describe("getPreviousCalendarMonth", () => {
  it("selects the complete previous calendar month", () => {
    const result = getPreviousCalendarMonth(new Date("2026-09-07T09:00:00.000Z"));

    expect(result.digestPeriod).toBe("2026-08");
    expect(result.label).toBe("August 2026");
    expect(result.start.toISOString()).toBe("2026-08-01T00:00:00.000Z");
    expect(result.end.toISOString()).toBe("2026-09-01T00:00:00.000Z");
  });

  it("handles the January-to-December year boundary", () => {
    const result = getPreviousCalendarMonth(new Date("2027-01-01T09:00:00.000Z"));

    expect(result.digestPeriod).toBe("2026-12");
    expect(result.label).toBe("December 2026");
    expect(result.start.toISOString()).toBe("2026-12-01T00:00:00.000Z");
    expect(result.end.toISOString()).toBe("2027-01-01T00:00:00.000Z");
  });
});

