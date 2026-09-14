import { Resend } from "resend";

const CORRECTIONS_INBOX = "info@optimised.marketing";
const EMAIL_FROM = "XTZ.News <newsletter@xtz.news>";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

export async function sendCorrectionReportNotification(input: {
  reporterName: string;
  reporterEmail: string;
  articleUrl: string;
  articleTitle?: string;
  correctionDetail: string;
  sourceUrl?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const resend = new Resend(apiKey);
  const articleLabel = input.articleTitle?.trim() || input.articleUrl;
  const html = `<!doctype html><html><body style="margin:0;background:#020817;font-family:Arial,sans-serif;color:#eef5ff"><div style="max-width:640px;margin:0 auto;padding:28px 18px"><div style="border-bottom:2px solid #2c7df7;padding-bottom:16px"><img src="https://xtz.news/manus-storage/xtz-logo-square_c6689606.png" alt="XTZ.News" width="56" height="56" style="display:block" /><h1 style="font-size:22px;margin:14px 0 0;color:#ffffff">Correction report received</h1></div><div style="margin-top:20px;background:#05152e;border:1px solid rgba(44,125,247,.35);border-radius:10px;padding:20px"><p><strong>Article:</strong> ${escapeHtml(articleLabel)}</p><p><strong>Article URL:</strong> <a href="${escapeHtml(input.articleUrl)}" style="color:#73a8ff">${escapeHtml(input.articleUrl)}</a></p><p><strong>Reporter:</strong> ${escapeHtml(input.reporterName)} (${escapeHtml(input.reporterEmail)})</p><p><strong>Reported issue:</strong><br/>${escapeHtml(input.correctionDetail).replace(/\n/g, "<br/>")}</p>${input.sourceUrl ? `<p><strong>Suggested source:</strong> <a href="${escapeHtml(input.sourceUrl)}" style="color:#73a8ff">${escapeHtml(input.sourceUrl)}</a></p>` : ""}<p style="margin-bottom:0;color:#9fb4d6;font-size:13px">This report is pending editorial review and has not changed any published content.</p></div></div></body></html>`;
  const result = await resend.emails.send({ from: EMAIL_FROM, to: [CORRECTIONS_INBOX], subject: `XTZ.News correction report: ${articleLabel.slice(0, 120)}`, html });
  return !result.error;
}
