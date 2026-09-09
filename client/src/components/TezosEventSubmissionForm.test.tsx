import { describe, expect, it } from "vitest";
import { EVENT_TYPE_OPTIONS, TEZOS_EVENT_SUBMISSION_COPY } from "./TezosEventSubmissionForm";

describe("Tezos event submission form", () => {
  it("keeps the review-only promise and reader event types explicit", () => {
    expect(TEZOS_EVENT_SUBMISSION_COPY.reviewNote).toContain("nothing is published automatically");
    expect(EVENT_TYPE_OPTIONS.map((option) => option.value)).toEqual(expect.arrayContaining(["meetup", "workshop", "exhibition", "online"]));
  });
});
