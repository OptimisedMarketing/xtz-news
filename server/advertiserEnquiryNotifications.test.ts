import { afterEach, describe, expect, it, vi } from "vitest";

const sendEmail = vi.fn();
vi.mock("resend", () => ({ Resend: vi.fn(() => ({ emails: { send: sendEmail } })) }));

import { sendAdvertiserEnquiryConfirmation, sendAdvertiserEnquiryNotification } from "./advertiserEnquiryNotifications";

describe("sendAdvertiserEnquiryNotification", () => {
  const originalKey = process.env.RESEND_API_KEY;
  afterEach(() => { if (originalKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = originalKey; sendEmail.mockReset(); });

  it("sends private advertising enquiries to info@optimised.marketing", async () => {
    process.env.RESEND_API_KEY = "test-key";
    sendEmail.mockResolvedValue({ data: { id: "message-1" }, error: null });
    await expect(sendAdvertiserEnquiryNotification({ contactName: "Alex Partner", contactEmail: "alex@example.com", companyName: "Tezos Example", websiteUrl: "https://example.com", placementInterest: "homepage_banner", campaignBrief: "A clearly labelled homepage campaign." })).resolves.toBe(true);
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: ["info@optimised.marketing"], subject: expect.stringContaining("Tezos Example") }));
  });

  it("sends a branded receipt to the consented enquirer and copies the private advertising inbox", async () => {
    process.env.RESEND_API_KEY = "test-key";
    sendEmail.mockResolvedValue({ data: { id: "message-2" }, error: null });
    await expect(sendAdvertiserEnquiryConfirmation({ contactName: "Alex Partner", contactEmail: "alex@example.com", companyName: "Tezos Example", placementInterest: "homepage_banner" })).resolves.toBe(true);
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: ["alex@example.com"], bcc: ["info@optimised.marketing"], subject: expect.stringContaining("received your advertising enquiry") }));
  });
});
