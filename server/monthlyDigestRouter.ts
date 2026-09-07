import express, { type RequestHandler } from "express";
import { and, asc, eq, gte, lt } from "drizzle-orm";
import { getDb } from "./db";
import { newsletterMonthlyDigestDeliveries, newsletterSubscribers, posts } from "../drizzle/schema";
import { getPreviousCalendarMonth } from "./monthlyDigest";
import { isValidMonthlyDigestPayload, verifyMonthlyDigestScheduleSignature, type MonthlyDigestSchedulePayload } from "./monthlyDigestScheduler";

const baseUrl = "https://xtz.news";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export async function executeMonthlyDigest(payload: MonthlyDigestSchedulePayload) {
  const db = await getDb();
  if (!db) return { ok: true, skipped: "no-db" as const };

  const { digestPeriod, end, label, start } = getPreviousCalendarMonth();
  const monthlyPosts = await db.select({
    id: posts.id,
    title: posts.title,
    slug: posts.slug,
    excerpt: posts.excerpt,
    featuredImageUrl: posts.featuredImageUrl,
  })
    .from(posts)
    .where(and(eq(posts.status, "publish"), gte(posts.publishedAt, start), lt(posts.publishedAt, end)))
    .orderBy(asc(posts.publishedAt));

  if (!monthlyPosts.length) return { ok: true, digestPeriod, skipped: "no-posts" as const };

  const subscribers = await db.select({
    id: newsletterSubscribers.id,
    email: newsletterSubscribers.email,
    unsubToken: newsletterSubscribers.unsubToken,
  }).from(newsletterSubscribers).where(eq(newsletterSubscribers.status, "active"));

  if (!subscribers.length) return { ok: true, digestPeriod, skipped: "no-subscribers" as const };

  if (payload.dryRun) {
    return {
      ok: true,
      dryRun: true,
      digestPeriod,
      month: label,
      articleCount: monthlyPosts.length,
      subscriberCount: subscribers.length,
      firstArticle: monthlyPosts[0]?.slug ?? null,
      lastArticle: monthlyPosts.at(-1)?.slug ?? null,
    };
  }

  const articlesHtml = monthlyPosts.map((post) => {
    const excerpt = escapeHtml((post.excerpt || "").replace(/<[^>]*>/g, "").slice(0, 120));
    const imageUrl = post.featuredImageUrl?.startsWith("/")
      ? `${baseUrl}${post.featuredImageUrl.replace(/^\/manus-storage\//, "/media/")}`
      : post.featuredImageUrl;
    const image = imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" style="width:100%;max-height:200px;object-fit:cover;border-radius:6px;margin-bottom:12px" />` : "";
    const url = `${baseUrl}/${post.slug}`;
    return `<div style="margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.08)">${image}<a href="${escapeHtml(url)}" style="color:#fff;font-size:18px;font-weight:700;text-decoration:none;line-height:1.3">${escapeHtml(post.title)}</a>${excerpt ? `<p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.5;margin:8px 0 0">${excerpt}</p>` : ""}<a href="${escapeHtml(url)}" style="color:#2c7df7;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;margin-top:10px">Read more →</a></div>`;
  }).join("");

  const emailHtml = (token: string | null) => {
    const manageUrl = token ? `${baseUrl}/manage-subscriptions?token=${token}` : baseUrl;
    const unsubUrl = token ? `${baseUrl}/unsubscribe?token=${token}` : baseUrl;
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif"><div style="max-width:600px;margin:0 auto;padding:20px"><div style="text-align:center;padding:24px 0;border-bottom:2px solid #2c7df7;margin-bottom:28px"><img src="${baseUrl}/media/xtz-logo-square_c6689606.png" alt="XTZ.News" style="height:60px" /><h1 style="color:#fff;font-size:22px;margin:12px 0 4px">XTZ.News Monthly Digest</h1><p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0">Every XTZ.News story published in ${escapeHtml(label)}</p></div><p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;margin:0 0 24px">Here is your complete monthly Tezos news roundup: ${monthlyPosts.length} published ${monthlyPosts.length === 1 ? "story" : "stories"} from ${escapeHtml(label)}.</p>${articlesHtml}<div style="text-align:center;padding:20px 0;border-top:1px solid rgba(255,255,255,0.08);margin-top:8px"><p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0 0 8px">You're receiving this because you subscribed to XTZ.News. <a href="${baseUrl}" style="color:#2c7df7">Visit XTZ.News</a></p><p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0"><a href="${escapeHtml(manageUrl)}" style="color:#2c7df7;text-decoration:none">Manage preferences</a> &nbsp;·&nbsp; <a href="${escapeHtml(unsubUrl)}" style="color:rgba(255,255,255,0.3);text-decoration:none">Unsubscribe</a></p></div></div></body></html>`;
  };

  const resendApiKey = process.env.RESEND_API_KEY;
  let sent = 0;
  let alreadyDelivered = 0;
  const failures: string[] = [];
  if (resendApiKey) {
    for (const subscriber of subscribers) {
      const [existing] = await db.select({ id: newsletterMonthlyDigestDeliveries.id })
        .from(newsletterMonthlyDigestDeliveries)
        .where(and(eq(newsletterMonthlyDigestDeliveries.subscriberId, subscriber.id), eq(newsletterMonthlyDigestDeliveries.digestPeriod, digestPeriod)))
        .limit(1);
      if (existing) {
        alreadyDelivered += 1;
        continue;
      }
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `xtz-monthly-digest:${digestPeriod}:${subscriber.id}`,
        },
        body: JSON.stringify({
          from: "XTZ.News <newsletter@xtz.news>",
          to: [subscriber.email],
          subject: `📰 XTZ.News Monthly Digest — ${label}`,
          html: emailHtml(subscriber.unsubToken),
        }),
      });
      if (!resendResponse.ok) {
        failures.push(`${subscriber.id}:${resendResponse.status}`);
        continue;
      }
      const resendPayload = await resendResponse.json().catch(() => null) as { id?: string } | null;
      await db.insert(newsletterMonthlyDigestDeliveries).values({
        subscriberId: subscriber.id,
        digestPeriod,
        resendEmailId: resendPayload?.id ?? null,
      }).onDuplicateKeyUpdate({ set: { resendEmailId: resendPayload?.id ?? null } });
      sent += 1;
    }
  } else {
    const { notifyOwner } = await import("./_core/notification");
    await notifyOwner({
      title: `Monthly Digest Ready — ${monthlyPosts.length} articles, ${subscribers.length} subscribers`,
      content: `Published in ${label}:\n${monthlyPosts.map((post, index) => `${index + 1}. ${post.title} — ${baseUrl}/${post.slug}`).join("\n")}\n\nSubscribers: ${subscribers.length}\nNote: Set RESEND_API_KEY to enable actual email delivery.`,
    });
  }

  if (failures.length) return { ok: false, error: "monthly-digest-partial-delivery" as const, digestPeriod, sent, alreadyDelivered, failures };
  return { ok: true, digestPeriod, articles: monthlyPosts.length, subscribers: subscribers.length, sent, alreadyDelivered };
}

export function createMonthlyDigestRouter(publicKey: string): RequestHandler {
  const router = express.Router();
  router.post("/run", async (req, res) => {
    const payload = req.body as MonthlyDigestSchedulePayload;
    const signature = req.header("X-XTZ-Monthly-Digest-Signature") ?? undefined;
    if (!isValidMonthlyDigestPayload(payload) || !verifyMonthlyDigestScheduleSignature(payload, signature, publicKey)) {
      return res.status(401).json({ error: "invalid-monthly-digest-signature" });
    }
    try {
      const result = await executeMonthlyDigest(payload);
      return res.status(result.ok ? 200 : 502).json(result);
    } catch (error) {
      console.error("[monthly-digest] error:", error instanceof Error ? error.message : error);
      return res.status(500).json({ error: "monthly-digest-failed" });
    }
  });
  return router;
}
