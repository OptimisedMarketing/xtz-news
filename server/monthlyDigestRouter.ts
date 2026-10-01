import express, { type RequestHandler } from "express";
import { and, asc, eq, gte, gt, isNull, lt, or } from "drizzle-orm";
import { getDb } from "./db";
import { newsletterMonthlyDigestDeliveries, newsletterSubscribers, posts, tezosEventCandidates } from "../drizzle/schema";
import { getPreviousCalendarMonth } from "./monthlyDigest";
import { formatMonthlyDigestEventDate, getEventsInDigestMonth, getUpcomingDigestEvents, type MonthlyDigestEvent } from "./monthlyDigestEvents";
import { isValidMonthlyDigestPayload, verifyMonthlyDigestScheduleSignature, type MonthlyDigestSchedulePayload } from "./monthlyDigestScheduler";

const baseUrl = "https://xtz.news";

export type MonthlyDigestPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
};

type MonthlyDigestEmailOptions = {
  label: string;
  posts: MonthlyDigestPost[];
  pastEvents: MonthlyDigestEvent[];
  upcomingEvents: MonthlyDigestEvent[];
  token: string | null;
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function renderMonthlyDigestEvent(event: MonthlyDigestEvent) {
  const date = escapeHtml(formatMonthlyDigestEventDate(event));
  const location = event.location ? `<span style="color:rgba(255,255,255,0.54);font-size:13px"> · ${escapeHtml(event.location)}</span>` : "";
  const type = event.eventType ? `<span style="color:#99f6e4;font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase">${escapeHtml(event.eventType)}</span>` : "";
  return `<div style="margin-bottom:16px;padding:16px;border:1px solid rgba(153,246,228,0.2);border-radius:6px;background:#06142b"><div style="margin-bottom:6px">${type}</div><a href="${escapeHtml(event.sourceUrl)}" style="color:#fff;font-size:16px;font-weight:700;text-decoration:none;line-height:1.35">${escapeHtml(event.title)}</a><p style="color:rgba(255,255,255,0.7);font-size:13px;line-height:1.5;margin:7px 0 0">${date}${location}</p><a href="${escapeHtml(event.sourceUrl)}" style="color:#99f6e4;font-size:12px;font-weight:700;text-decoration:none;display:inline-block;margin-top:9px">Event details →</a></div>`;
}

export function renderMonthlyDigestEmail({ label, posts, pastEvents, upcomingEvents, token }: MonthlyDigestEmailOptions) {
  const articlesHtml = posts.map((post) => {
    const excerpt = escapeHtml((post.excerpt || "").replace(/<[^>]*>/g, "").slice(0, 120));
    const imageUrl = post.featuredImageUrl?.startsWith("/")
      ? `${baseUrl}${post.featuredImageUrl.replace(/^\/manus-storage\//, "/media/")}`
      : post.featuredImageUrl;
    const image = imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" style="width:100%;max-height:200px;object-fit:cover;border-radius:6px;margin-bottom:12px" />` : "";
    const url = `${baseUrl}/${post.slug}`;
    return `<div style="margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.08)">${image}<a href="${escapeHtml(url)}" style="color:#fff;font-size:18px;font-weight:700;text-decoration:none;line-height:1.3">${escapeHtml(post.title)}</a>${excerpt ? `<p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.5;margin:8px 0 0">${excerpt}</p>` : ""}<a href="${escapeHtml(url)}" style="color:#2c7df7;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;margin-top:10px">Read more →</a></div>`;
  }).join("");

  const manageUrl = token ? `${baseUrl}/manage-subscriptions?token=${token}` : baseUrl;
  const unsubUrl = token ? `${baseUrl}/unsubscribe?token=${token}` : baseUrl;
  const pastEventsHtml = pastEvents.map(renderMonthlyDigestEvent).join("");
  const upcomingEventsHtml = upcomingEvents.map(renderMonthlyDigestEvent).join("");
  const roundup = [
    posts.length ? pluralize(posts.length, "published story") : null,
    pastEvents.length ? pluralize(pastEvents.length, "past editor-published event") : null,
    upcomingEvents.length ? pluralize(upcomingEvents.length, "upcoming confirmed event") : null,
  ].filter(Boolean).join(", ");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif"><div style="max-width:600px;margin:0 auto;padding:20px"><div style="text-align:center;padding:24px 0;border-bottom:2px solid #2c7df7;margin-bottom:28px"><img src="${baseUrl}/media/xtz-logo-square_c6689606.png" alt="XTZ.News" style="height:60px" /><h1 style="color:#fff;font-size:22px;margin:12px 0 4px">XTZ.News Monthly Digest</h1><p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0">News and editor-published Tezos events for ${escapeHtml(label)}</p></div><p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;margin:0 0 24px">Here is your complete Tezos monthly roundup: ${escapeHtml(roundup || "editorial updates")}.</p>${posts.length ? `<h2 style="color:#fff;font-size:20px;margin:0 0 16px">News published in ${escapeHtml(label)}</h2>${articlesHtml}` : ""}${pastEvents.length ? `<section style="margin:8px 0 28px;padding:22px 0 4px;border-top:2px solid rgba(153,246,228,0.5)"><h2 style="color:#fff;font-size:20px;margin:0 0 8px">Events from ${escapeHtml(label)}</h2><p style="color:rgba(255,255,255,0.62);font-size:13px;line-height:1.5;margin:0 0 16px">A record of editor-published Tezos events that took place during the month.</p>${pastEventsHtml}</section>` : ""}${upcomingEvents.length ? `<section style="margin:8px 0 28px;padding:22px 0 4px;border-top:2px solid rgba(44,125,247,0.7)"><h2 style="color:#fff;font-size:20px;margin:0 0 8px">Upcoming Tezos events</h2><p style="color:rgba(255,255,255,0.62);font-size:13px;line-height:1.5;margin:0 0 16px">Confirmed editor-published listings after this digest was prepared. Times and availability can change, so check the organiser link before attending.</p>${upcomingEventsHtml}<a href="${baseUrl}/events" style="color:#2c7df7;font-size:13px;font-weight:700;text-decoration:none">Browse the Tezos events calendar →</a></section>` : ""}<div style="text-align:center;padding:20px 0;border-top:1px solid rgba(255,255,255,0.08);margin-top:8px"><p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0 0 8px">You're receiving this because you subscribed to XTZ.News. <a href="${baseUrl}" style="color:#2c7df7">Visit XTZ.News</a></p><p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0"><a href="${escapeHtml(manageUrl)}" style="color:#2c7df7;text-decoration:none">Manage preferences</a> &nbsp;·&nbsp; <a href="${escapeHtml(unsubUrl)}" style="color:rgba(255,255,255,0.3);text-decoration:none">Unsubscribe</a></p></div></div></body></html>`;
}

export async function executeMonthlyDigest(payload: MonthlyDigestSchedulePayload, now: Date = new Date()) {
  const db = await getDb();
  if (!db) return { ok: true, skipped: "no-db" as const };

  const { digestPeriod, end, label, start } = getPreviousCalendarMonth(now);
  const [monthlyPosts, pastEventRows, upcomingEventRows] = await Promise.all([
    db.select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      featuredImageUrl: posts.featuredImageUrl,
    })
      .from(posts)
      .where(and(eq(posts.status, "publish"), gte(posts.publishedAt, start), lt(posts.publishedAt, end)))
      .orderBy(asc(posts.publishedAt)),
    db.select({
      title: tezosEventCandidates.title,
      startAt: tezosEventCandidates.startAt,
      endAt: tezosEventCandidates.endAt,
      location: tezosEventCandidates.location,
      timezone: tezosEventCandidates.timezone,
      eventType: tezosEventCandidates.eventType,
      sourceUrl: tezosEventCandidates.sourceUrl,
    })
      .from(tezosEventCandidates)
      .where(and(
        eq(tezosEventCandidates.status, "published"),
        lt(tezosEventCandidates.startAt, end),
        or(
          and(isNull(tezosEventCandidates.endAt), gte(tezosEventCandidates.startAt, start)),
          gt(tezosEventCandidates.endAt, start),
        ),
      ))
      .orderBy(asc(tezosEventCandidates.startAt))
      .limit(20),
    db.select({
      title: tezosEventCandidates.title,
      startAt: tezosEventCandidates.startAt,
      endAt: tezosEventCandidates.endAt,
      location: tezosEventCandidates.location,
      timezone: tezosEventCandidates.timezone,
      eventType: tezosEventCandidates.eventType,
      sourceUrl: tezosEventCandidates.sourceUrl,
    })
      .from(tezosEventCandidates)
      .where(and(eq(tezosEventCandidates.status, "published"), gte(tezosEventCandidates.startAt, now)))
      .orderBy(asc(tezosEventCandidates.startAt))
      .limit(8),
  ]);
  const pastEvents = getEventsInDigestMonth(pastEventRows, { digestPeriod, label, start, end });
  const upcomingEvents = getUpcomingDigestEvents(upcomingEventRows, now);

  if (!monthlyPosts.length && !pastEvents.length && !upcomingEvents.length) {
    return { ok: true, digestPeriod, skipped: "no-digest-content" as const };
  }

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
      pastEventCount: pastEvents.length,
      upcomingEventCount: upcomingEvents.length,
      subscriberCount: subscribers.length,
      firstArticle: monthlyPosts[0]?.slug ?? null,
      lastArticle: monthlyPosts.at(-1)?.slug ?? null,
      firstPastEvent: pastEvents[0]?.title ?? null,
      firstUpcomingEvent: upcomingEvents[0]?.title ?? null,
    };
  }

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
          html: renderMonthlyDigestEmail({ label, posts: monthlyPosts, pastEvents, upcomingEvents, token: subscriber.unsubToken }),
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
      title: `Monthly Digest Ready — ${monthlyPosts.length} articles, ${pastEvents.length} past events, ${upcomingEvents.length} upcoming events`,
      content: `Published in ${label}:\n${monthlyPosts.map((post, index) => `${index + 1}. ${post.title} — ${baseUrl}/${post.slug}`).join("\n") || "No articles published."}\n\nEvents from ${label}:\n${pastEvents.map((event, index) => `${index + 1}. ${event.title} — ${formatMonthlyDigestEventDate(event)}`).join("\n") || "No editor-published events."}\n\nUpcoming events:\n${upcomingEvents.map((event, index) => `${index + 1}. ${event.title} — ${formatMonthlyDigestEventDate(event)}`).join("\n") || "No confirmed upcoming events."}\n\nSubscribers: ${subscribers.length}\nNote: Set RESEND_API_KEY to enable actual email delivery.`,
    });
  }

  if (failures.length) return { ok: false, error: "monthly-digest-partial-delivery" as const, digestPeriod, sent, alreadyDelivered, failures };
  return {
    ok: true,
    digestPeriod,
    articles: monthlyPosts.length,
    pastEvents: pastEvents.length,
    upcomingEvents: upcomingEvents.length,
    subscribers: subscribers.length,
    sent,
    alreadyDelivered,
  };
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
