import { afterEach, describe, expect, it, vi } from "vitest";

const { sendEmail } = vi.hoisted(() => ({ sendEmail: vi.fn() }));

vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send: sendEmail } })),
}));

import { sendCorrectionReportNotification } from "./correctionReportNotifications";

describe("sendCorrectionReportNotification", () => {
  const originalKey = process.env.RESEND_API_KEY;

  afterEach(() => {
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
    sendEmail.mockReset();
  });

  it("sends private correction-report alerts to info@optimised.marketing", async () => {
    process.env.RESEND_API_KEY = "test-key";
    sendEmail.mockResolvedValue({ data: { id: "message-1" }, error: null });

    await expect(sendCorrectionReportNotification({
      reporterName: "Careful Reader",
      reporterEmail: "reader@example.com",
      articleUrl: "https://xtz.news/example-story",
      articleTitle: "Example story",
      correctionDetail: "Please check the date against the official source.",
    })).resolves.toBe(true);

    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
      to: ["info@optimised.marketing"],
      subject: expect.stringContaining("Example story"),
    }));
  });

  it("does not attempt delivery when the managed mail key is unavailable", async () => {
    delete process.env.RESEND_API_KEY;
    await expect(sendCorrectionReportNotification({
      reporterName: "Careful Reader",
      reporterEmail: "reader@example.com",
      articleUrl: "https://xtz.news/example-story",
      correctionDetail: "Please check the date against the official source.",
    })).resolves.toBe(false);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
