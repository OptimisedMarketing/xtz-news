import { describe, expect, it } from "vitest";
import { getNewsletterConfirmationCopy } from "./newsletterConfirmation";

describe("getNewsletterConfirmationCopy", () => {
  it("explains the Resend welcome-email path and preference links after a confirmed request", () => {
    const copy = getNewsletterConfirmationCopy(true);
    expect(copy.description).toContain("Resend welcome email");
    expect(copy.preferenceNote).toContain("manage preferences");
  });
});
