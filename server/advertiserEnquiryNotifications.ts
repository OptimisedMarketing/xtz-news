import { Resend } from "resend";

const ADVERTISING_INBOX = "info@optimised.marketing";
const EMAIL_FROM = "XTZ.News <newsletter@xtz.news>";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

export async function sendAdvertiserEnquiryNotification(input: {
  contactName: string;
  contactEmail: string;
  companyName: string;
  websiteUrl?: string;
  placementInterest: string;
  campaignBrief: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const website = input.websiteUrl ? `<p><strong>Website:</strong> <a href="${escapeHtml(input.websiteUrl)}" style="color:#73a8ff">${escapeHtml(input.websiteUrl)}</a></p>` : "";
  const html = `<!doctype html><html><body style="margin:0;background:#020817;font-family:Arial,sans-serif;color:#eef5ff"><div style="max-width:640px;margin:0 auto;padding:28px 18px"><div style="border-bottom:2px solid #63f7b1;padding-bottom:16px"><img src="https://xtz.news/manus-storage/xtz-logo-square_c6689606.png" alt="XTZ.News" width="56" height="56" style="display:block" /><h1 style="font-size:22px;margin:14px 0 0;color:#ffffff">Advertising enquiry received</h1></div><div style="margin-top:20px;background:#05152e;border:1px solid rgba(99,247,177,.35);border-radius:10px;padding:20px"><p><strong>Company:</strong> ${escapeHtml(input.companyName)}</p><p><strong>Contact:</strong> ${escapeHtml(input.contactName)} (${escapeHtml(input.contactEmail)})</p>${website}<p><strong>Placement interest:</strong> ${escapeHtml(input.placementInterest.replace(/_/g, " "))}</p><p><strong>Campaign details:</strong><br/>${escapeHtml(input.campaignBrief).replace(/\n/g, "<br/>")}</p><p style="margin-bottom:0;color:#9fb4d6;font-size:13px">This enquiry is private, pending review, and has not created a public promotion.</p></div></div></body></html>`;
  const result = await new Resend(apiKey).emails.send({ from: EMAIL_FROM, to: [ADVERTISING_INBOX], subject: `XTZ.News advertising enquiry: ${input.companyName.slice(0, 120)}`, html });
  return !result.error;
}
