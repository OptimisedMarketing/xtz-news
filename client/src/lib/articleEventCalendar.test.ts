import { describe, expect, it } from "vitest";
import { getArticleEventCalendarCallout } from "./articleEventCalendar";

describe("article event calendar callouts", () => {
  it("places a targeted calendar route on both latest event-related stories", () => {
    expect(getArticleEventCalendarCallout("arthur-breitman-token2049-quantum-risks-crypto")).toMatchObject({ eventQuery: "?topic=Post-Quantum" });
    expect(getArticleEventCalendarCallout("tezos-art-recap-responsive-signals-vienna-digital-works")).toMatchObject({ eventQuery: "?topic=Art%20on%20Tezos" });
  });

  it("does not place event controls on unrelated articles", () => {
    expect(getArticleEventCalendarCallout("anchorage-digital-etherlink-custody-tokenized-uranium")).toBeUndefined();
  });
});
