import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import * as db from "./db";
import { explorerRouter } from "./explorerRouter";
import { toolsRouter } from "./toolsRouter";
import { translationsRouter } from "./translationsRouter";
import { preferencesRouter } from "./preferencesRouter";
import { customAuthRouter } from "./customAuthRouter";
import { executeMonthlyDigest } from "./monthlyDigestRouter";
import { isValidMonthlyDigestPayload, verifyMonthlyDigestScheduleSignature } from "./monthlyDigestScheduler";
import { MONTHLY_DIGEST_SCHEDULER_PUBLIC_KEY } from "./monthlyDigestSchedulerPublicKey";

// ─── Admin guard ──────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ─── Posts Router ─────────────────────────────────────────────────────────────
const postsRouter = router({
  // Timeline query — higher limit, supports year/category filters
  timeline: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(1000).default(50),
      offset: z.number().default(0),
      year: z.number().optional(),
      categorySlug: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { getDb } = await import('./db');
      const { posts, postCategories, categories } = await import('../drizzle/schema');
      const { eq, desc, and, sql, inArray } = await import('drizzle-orm');
      const db = await getDb();
      if (!db) return [];

      let conditions: any[] = [eq(posts.status, 'publish')];

      // Year filter
      if (input.year) {
        conditions.push(sql`YEAR(${posts.publishedAt}) = ${input.year}`);
      }

      // Category filter
      if (input.categorySlug) {
        const [cat] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, input.categorySlug)).limit(1);
        if (cat) {
          const postIds = await db.select({ postId: postCategories.postId }).from(postCategories).where(eq(postCategories.categoryId, cat.id));
          if (postIds.length > 0) {
            conditions.push(inArray(posts.id, postIds.map(p => p.postId)));
          } else {
            return [];
          }
        }
      }

      const result = await db.select().from(posts)
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(desc(posts.publishedAt))
        .limit(input.limit)
        .offset(input.offset);

      return Promise.all(result.map(async (p) => ({ ...p, categories: await import('./db').then(m => m.getPostCategories(p.id)) })));
    }),

  latest: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(1000).default(10), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const postList = await db.getLatestPosts(input.limit, input.offset);
      const withCats = await Promise.all(
        postList.map(async (p) => ({ ...p, categories: await db.getPostCategories(p.id) }))
      );
      return withCats;
    }),

  mostRead: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ input }) => {
      const postList = await db.getMostReadPosts(input.limit);
      const withCats = await Promise.all(
        postList.map(async (p) => ({ ...p, categories: await db.getPostCategories(p.id) }))
      );
      return withCats;
    }),

  mostReadThisWeek: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ input }) => {
      const postList = await db.getMostReadThisWeek(input.limit);
      const withCats = await Promise.all(
        postList.map(async (p) => ({ ...p, categories: await db.getPostCategories(p.id) }))
      );
      return withCats;
    }),

  featured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(6) }))
    .query(async ({ input }) => {
      const postList = await db.getFeaturedPosts(input.limit);
      const withCats = await Promise.all(
        postList.map(async (p) => ({ ...p, categories: await db.getPostCategories(p.id) }))
      );
      return withCats;
    }),

  // Trending news — articles published in the last 48 hours
  trendingNews: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(8) }))
    .query(async ({ input }) => {
      const postList = await db.getTrendingPosts(input.limit);
      const withCats = await Promise.all(
        postList.map(async (p) => ({ ...p, categories: await db.getPostCategories(p.id) }))
      );
      return withCats;
    }),

  // Combined homepage query — single round trip
  homepageData: publicProcedure.query(async () => {
    const [latestRaw, mostReadRaw, trendingRaw, trendingNewsRaw] = await Promise.all([
      db.getLatestPosts(10, 0),
      db.getMostReadPosts(8),
      db.getMostReadThisWeek(10),
      db.getTrendingPosts(8),
    ]);
    const allPosts = [...latestRaw, ...mostReadRaw, ...trendingRaw, ...trendingNewsRaw];
    const uniqueIds = Array.from(new Set(allPosts.map((p) => p.id)));
    const catsMap: Record<number, Awaited<ReturnType<typeof db.getPostCategories>>> = {};
    await Promise.all(uniqueIds.map(async (id) => { catsMap[id] = await db.getPostCategories(id); }));
    const withCats = (posts: typeof latestRaw) => posts.map((p) => ({ ...p, categories: catsMap[p.id] ?? [] }));
    const latest = withCats(latestRaw);
    const mostRead = withCats(mostReadRaw);
    const trending = withCats(trendingRaw);
    const trendingNews = withCats(trendingNewsRaw);
    const featured = latest.filter((p) => p.isFeatured).slice(0, 6);
    const featuredToShow = featured.length >= 3 ? featured : latest.slice(0, 6);
    return { latest, mostRead, trending, trendingNews, featured: featuredToShow };
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await db.getPostBySlug(input.slug);
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      const [postCats, postTagsList] = await Promise.all([
        db.getPostCategories(post.id),
        db.getPostTags(post.id),
      ]);
      db.incrementPostViewCount(post.id).catch(() => {});
      return { ...post, categories: postCats, tags: postTagsList };
    }),

  byCategory: publicProcedure
    .input(z.object({ slug: z.string(), limit: z.number().default(12), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const { posts: postList, total } = await db.getPostsByCategorySlug(input.slug, input.limit, input.offset);
      const withCats = await Promise.all(postList.map(async (p) => ({ ...p, categories: await db.getPostCategories(p.id) })));
      return { posts: withCats, total };
    }),

  byTag: publicProcedure
    .input(z.object({ slug: z.string(), limit: z.number().default(12), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const { posts: postList, total } = await db.getPostsByTagSlug(input.slug, input.limit, input.offset);
      const withCats = await Promise.all(postList.map(async (p) => ({ ...p, categories: await db.getPostCategories(p.id) })));
      return { posts: withCats, total };
    }),

  related: publicProcedure
    .input(z.object({ postId: z.number(), categoryIds: z.array(z.number()), limit: z.number().default(4) }))
    .query(async ({ input }) => {
      const postList = await db.getRelatedPosts(input.postId, input.categoryIds, input.limit);
      const withCats = await Promise.all(postList.map(async (p) => ({ ...p, categories: await db.getPostCategories(p.id) })));
      return withCats;
    }),

  search: publicProcedure
    .input(z.object({ q: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      if (input.q.length < 2) return [];
      return db.searchPosts(input.q, input.limit);
    }),

  searchAll: publicProcedure
    .input(z.object({ q: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      if (input.q.length < 2) return { posts: [], projects: [] };
      const [posts, projects] = await Promise.all([
        db.searchPosts(input.q, input.limit),
        db.searchProjects(input.q, Math.ceil(input.limit / 2)),
      ]);
      return { posts, projects };
    }),

  count: publicProcedure.query(() => db.getTotalPostCount()),

  adminList: adminProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(({ input }) => db.getAllPosts(input.limit, input.offset)),

  adminCreate: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      featuredImageUrl: z.string().optional(),
      status: z.enum(["publish", "draft", "private"]).default("draft"),
      isFeatured: z.boolean().default(false),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await db.createPost({ ...input, publishedAt: input.status === "publish" ? new Date() : null });
      return { success: true };
    }),

  adminUpdate: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      slug: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      status: z.enum(["publish", "draft", "private"]).optional(),
      isFeatured: z.boolean().optional(),
      featuredImageUrl: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updatePost(id, data);
      return { success: true };
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deletePost(input.id);
      return { success: true };
    }),
});

// ─── Categories Router ────────────────────────────────────────────────────────
const categoriesRouter = router({
  all: publicProcedure.query(() => db.getAllCategories()),

  withImages: publicProcedure.query(async () => {
    const cats = await db.getAllCategories();
    // For each category, get the most recent post image
    const withImages = await Promise.all(
      cats.map(async (cat) => {
        const { posts } = await db.getPostsByCategorySlug(cat.slug, 1, 0);
        const image = posts[0]?.featuredImageUrl ?? null;
        return { ...cat, coverImage: image };
      })
    );
    return withImages;
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const cat = await db.getCategoryBySlug(input.slug);
      if (!cat) throw new TRPCError({ code: "NOT_FOUND" });
      return cat;
    }),
});

// ─── Tags Router ──────────────────────────────────────────────────────────────
const tagsRouter = router({
  all: publicProcedure.query(() => db.getAllTags()),
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const tag = await db.getTagBySlug(input.slug);
      if (!tag) throw new TRPCError({ code: "NOT_FOUND" });
      return tag;
    }),
});

// ─── Projects Router ──────────────────────────────────────────────────────────
const projectsRouter = router({
  all: publicProcedure
    .input(z.object({ category: z.string().optional() }))
    .query(async ({ input }) => {
      const allProjects = await db.getAllProjects(200);
      if (input.category && input.category !== "all") {
        return allProjects.filter((p) => p.category?.toLowerCase() === input.category!.toLowerCase());
      }
      return allProjects;
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const project = await db.getProjectBySlug(input.slug);
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      return project;
    }),

  tezoracleStatus: publicProcedure.query(() => db.getLatestTezOracleStatus()),

  adminList: adminProcedure.query(() => db.getAllProjectsAdmin()),

  // Fetch latest GitHub commits for a project by its GitHub repo URL
  githubCommits: publicProcedure
    .input(z.object({ githubUrl: z.string() }))
    .query(async ({ input }) => {
      try {
        // Extract owner/repo from GitHub URL
        const match = input.githubUrl.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
        if (!match) return [];
        const [, owner, repo] = match;
        const cleanRepo = repo.replace(/\.git$/, '');
        const url = `https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=5`;
        const res = await fetch(url, {
          headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'XTZNews/1.0' },
          signal: AbortSignal.timeout(6000),
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((c: any) => ({
          sha: c.sha?.substring(0, 7),
          message: c.commit?.message?.split('\n')[0]?.substring(0, 100),
          author: c.commit?.author?.name,
          date: c.commit?.author?.date,
          url: c.html_url,
        }));
      } catch { return []; }
    }),
});

// ─── Events Router ────────────────────────────────────────────────────────────
const eventsRouter = router({
  all: publicProcedure.query(() => db.getAllEvents()),
});

// ─── Pages Router ─────────────────────────────────────────────────────────────
const pagesRouter = router({
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const page = await db.getPageBySlug(input.slug);
      if (!page) throw new TRPCError({ code: "NOT_FOUND" });
      return page;
    }),
  all: adminProcedure.query(() => db.getAllPages()),
});

// ─── Submissions Router ───────────────────────────────────────────────────────
const submissionsRouter = router({
  create: publicProcedure
    .input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      articleTitle: z.string().optional(),
      articleFileUrl: z.string().optional(),
      articleFileKey: z.string().optional(),
      bannerImageUrl: z.string().optional(),
      bannerImageKey: z.string().optional(),
      image2Url: z.string().optional(),
      image2Key: z.string().optional(),
      agreedToTerms: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      if (!input.agreedToTerms) throw new TRPCError({ code: "BAD_REQUEST", message: "You must agree to the terms" });
      await db.createSubmission(input);
      const fileLink = input.articleFileUrl ? `\n\nArticle file: ${input.articleFileUrl}` : "";
      const bannerLink = input.bannerImageUrl ? `\nBanner image: ${input.bannerImageUrl}` : "";
      await notifyOwner({
        title: `New Article Submission: ${input.articleTitle || "Untitled"}`,
        content: `New submission from ${input.firstName} ${input.lastName || ""}${input.email ? ` (${input.email})` : ""}.\n\nTitle: ${input.articleTitle || "Not provided"}${fileLink}${bannerLink}`,
      }).catch(() => {});
      return { success: true };
    }),

  list: adminProcedure.query(() => db.getAllSubmissions()),

  updateStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "reviewed", "approved", "rejected"]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await db.updateSubmissionStatus(input.id, input.status, input.notes);
      return { success: true };
    }),
});

// ─── Art on Tezos Editorial Submissions ──────────────────────────────────────
const artProjectSubmissionsRouter = router({
  create: publicProcedure
    .input(z.object({
      submitterName: z.string().trim().min(2).max(255),
      submitterEmail: z.string().trim().email().max(320),
      submitterType: z.enum(["artist", "gallery", "collective", "other"]),
      projectName: z.string().trim().min(2).max(500),
      projectType: z.enum(["exhibition", "marketplace", "creator_tool", "other"]),
      websiteUrl: z.string().trim().url().max(2000),
      description: z.string().trim().min(40).max(1600),
      agreedToReview: z.literal(true),
    }))
    .mutation(async ({ input }) => {
      await db.createArtProjectSubmission(input);
      await notifyOwner({
        title: `Art on Tezos project submission: ${input.projectName}`,
        content: `A new Art on Tezos submission is ready for review.\n\nProject: ${input.projectName}\nGroup: ${input.projectType}\nSubmitted by: ${input.submitterName} (${input.submitterType})\nEmail: ${input.submitterEmail}\nWebsite: ${input.websiteUrl}\n\nDescription:\n${input.description}\n\nThe submission is pending editorial review and has not been published.`,
      }).catch(() => {});
      return { success: true } as const;
    }),
  list: adminProcedure.query(() => db.getAllArtProjectSubmissions()),
  updateStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.enum(["pending", "reviewed", "approved", "rejected"]), notes: z.string().max(2000).optional() }))
    .mutation(async ({ input }) => {
      await db.updateArtProjectSubmissionStatus(input.id, input.status, input.notes);
      return { success: true } as const;
    }),
});

// ─── Cloud-discovered Tezos Event Candidates ──────────────────────────────────
const tezosEventCandidatesRouter = router({
  published: publicProcedure.query(() => db.getPublishedTezosEventCandidates()),
  list: adminProcedure.query(() => db.getAllTezosEventCandidates()),
  updateStatus: adminProcedure
    .input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "reviewed", "published", "rejected"]), notes: z.string().max(2000).optional() }))
    .mutation(async ({ input }) => {
      await db.updateTezosEventCandidateStatus(input.id, input.status, input.notes);
      return { success: true } as const;
    }),
});

// ─── Newsletter Router ───────────────────────────────────────────────────────
const newsletterRouter = router({
  subscribe: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().optional(),
      govAlerts: z.boolean().optional().default(false),
    }))
    .mutation(async ({ input }) => {
      const { getDb } = await import('./db');
      const { newsletterSubscribers } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      try {
        // Generate a secure unsubscribe token
        const crypto = await import('crypto');
        const unsubToken = crypto.randomBytes(32).toString('hex');

        await dbConn.insert(newsletterSubscribers)
          .values({
            email: input.email,
            name: input.name ?? null,
            status: 'active',
            govAlerts: input.govAlerts ?? false,
            unsubToken,
          })
          .onDuplicateKeyUpdate({
            set: { status: 'active', govAlerts: input.govAlerts ?? false },
          });

        // Fetch the actual token (may have been existing if duplicate)
        const [row] = await dbConn.select({ unsubToken: newsletterSubscribers.unsubToken })
          .from(newsletterSubscribers)
          .where(eq(newsletterSubscribers.email, input.email))
          .limit(1);
        const finalToken = row?.unsubToken || unsubToken;

        // Send welcome email via Resend
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        let welcomeEmailRequested = false;
        if (RESEND_API_KEY) {
          const baseUrl = 'https://xtz.news';
          const unsubUrl = `${baseUrl}/unsubscribe?token=${finalToken}`;
          const manageUrl = `${baseUrl}/manage-subscriptions?token=${finalToken}`;
          const welcomeHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif"><div style="max-width:600px;margin:0 auto;padding:20px"><div style="text-align:center;padding:24px 0;border-bottom:2px solid #2c7df7;margin-bottom:28px"><img src="${baseUrl}/manus-storage/xtz-logo-square_c6689606.png" alt="XTZ.News" style="height:60px" /><h1 style="color:#fff;font-size:22px;margin:12px 0 4px">Welcome to XTZ.News!</h1><p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0">You're now part of the Tezos community newsletter</p></div><div style="background:#05152e;border:1px solid rgba(44,125,247,0.3);border-radius:8px;padding:24px;margin-bottom:24px"><h2 style="color:#fff;font-size:18px;margin:0 0 12px">You're subscribed! 🎉</h2><p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0 0 16px;line-height:1.6">Every Monday you'll receive the top Tezos stories of the week, delivered straight to your inbox from <strong style="color:#2c7df7">newsletter@xtz.news</strong>.</p>${input.govAlerts ? `<div style="background:rgba(44,125,247,0.1);border:1px solid rgba(44,125,247,0.3);border-radius:6px;padding:14px;margin-bottom:16px"><p style="color:#2c7df7;font-size:13px;margin:0;font-weight:700">🗳️ Governance Alerts enabled</p><p style="color:rgba(255,255,255,0.6);font-size:13px;margin:4px 0 0">You'll also be notified when a new Tezos protocol upgrade proposal enters the voting phase.</p></div>` : ''}<a href="${baseUrl}" style="display:inline-block;padding:12px 24px;background:#2c7df7;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:700">Visit XTZ.News →</a></div><div style="text-align:center;padding:20px 0;border-top:1px solid rgba(255,255,255,0.08)"><p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0 0 8px">You can <a href="${manageUrl}" style="color:#2c7df7">manage your preferences</a> or <a href="${unsubUrl}" style="color:rgba(255,255,255,0.4)">unsubscribe</a> at any time.</p></div></div></body></html>`;
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'XTZ.News <newsletter@xtz.news>',
              to: [input.email],
              subject: '👋 Welcome to XTZ.News — Your Tezos Newsletter',
              html: welcomeHtml,
            }),
          }).catch(() => null); // Don't fail subscription if email fails
          welcomeEmailRequested = Boolean(resendResponse?.ok);
        }

        await notifyOwner({
          title: 'New Newsletter Subscriber',
          content: `${input.name ? input.name + ' (' + input.email + ')' : input.email} subscribed to the XTZ.News newsletter.${input.govAlerts ? ' (Governance Alerts: ON)' : ''}`,
        }).catch(() => {});
        return { success: true, welcomeEmailRequested };
      } catch {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid email address' });
      }
    }),

  unsubscribe: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const { getDb } = await import('./db');
      const { newsletterSubscribers } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      const [row] = await dbConn.select({ id: newsletterSubscribers.id, email: newsletterSubscribers.email })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.unsubToken, input.token))
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid or expired unsubscribe link.' });
      await dbConn.update(newsletterSubscribers)
        .set({ status: 'unsubscribed' })
        .where(eq(newsletterSubscribers.unsubToken, input.token));
      return { success: true, email: row.email };
    }),

  getPreferences: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { getDb } = await import('./db');
      const { newsletterSubscribers } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      const [row] = await dbConn.select({
        email: newsletterSubscribers.email,
        name: newsletterSubscribers.name,
        status: newsletterSubscribers.status,
        govAlerts: newsletterSubscribers.govAlerts,
      })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.unsubToken, input.token))
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid or expired link.' });
      return row;
    }),

  updatePreferences: publicProcedure
    .input(z.object({
      token: z.string(),
      govAlerts: z.boolean(),
      status: z.enum(['active', 'unsubscribed']),
    }))
    .mutation(async ({ input }) => {
      const { getDb } = await import('./db');
      const { newsletterSubscribers } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      const [row] = await dbConn.select({ id: newsletterSubscribers.id })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.unsubToken, input.token))
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid or expired link.' });
      await dbConn.update(newsletterSubscribers)
        .set({ govAlerts: input.govAlerts, status: input.status })
        .where(eq(newsletterSubscribers.unsubToken, input.token));
      return { success: true };
    }),

  list: adminProcedure.query(async () => {
    const { getDb } = await import('./db');
    const { newsletterSubscribers } = await import('../drizzle/schema');
    const { desc } = await import('drizzle-orm');
    const dbConn = await getDb();
    if (!dbConn) return [];
    return dbConn.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
  }),

  // Public count — used by newsletter signup components
  subscriberCount: publicProcedure.query(async () => {
    const { getDb } = await import('./db');
    const { newsletterSubscribers } = await import('../drizzle/schema');
    const { eq, sql } = await import('drizzle-orm');
    const dbConn = await getDb();
    if (!dbConn) return 1026; // fallback
    const [row] = await dbConn
      .select({ count: sql<number>`COUNT(*)` })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, 'active'));
    return Number(row?.count ?? 1026);
  }),
});

// ─── Price Ticker Router ──────────────────────────────────────────────────────────
let priceCache: { data: any[]; ts: number } | null = null;
const CACHE_TTL = 90_000; // 90 seconds

const priceRouter = router({
  tezosTokens: publicProcedure.query(async () => {
    if (priceCache && Date.now() - priceCache.ts < CACHE_TTL) {
      return priceCache.data;
    }
    try {
      // Fetch full Tezos ecosystem category from CoinGecko with sparkline data
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=tezos-ecosystem&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h,7d`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'XTZNews/1.0' },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
      const data = await res.json();
      // Filter out tokens with null prices and sort: XTZ first, then by market cap
      // DEX trading links for known tokens
      const DEX_LINKS: Record<string, string> = {
        'tezos': 'https://www.coingecko.com/en/coins/tezos',
        'youves-uusd': 'https://app.youves.com/swap',
        'kolibri-usd': 'https://kolibri.finance',
        'plenty-dao': 'https://www.plentydefi.com',
        'quipuswap-governance-token': 'https://quipuswap.com',
        'vnx-gold': 'https://vnx.finance',
        'vnx-swiss-franc': 'https://vnx.finance',
        'vnx-euro': 'https://vnx.finance',
        'tezos-domains': 'https://tezos.domains',
        'usdtez': 'https://usdtz.com',
        'stacy-staked-xtz': 'https://stacy.finance',
        'tether': 'https://quipuswap.com',
        'wrapped-busd': 'https://quipuswap.com',
      };

      // Tokens to exclude from the ticker
      const EXCLUDED_IDS = new Set(['plenty-dao', 'ted-2']);

      const tokens = data
        .filter((t: any) => t.current_price !== null && t.current_price !== undefined && !EXCLUDED_IDS.has(t.id))
        .map((t: any) => ({
          id: t.id,
          symbol: t.symbol.toUpperCase(),
          name: t.name,
          price: t.current_price,
          change24h: t.price_change_percentage_24h ?? 0,
          change7d: t.price_change_percentage_7d_in_currency ?? 0,
          image: t.image,
          marketCap: t.market_cap ?? 0,
          volume24h: t.total_volume ?? 0,
          sparkline: (t.sparkline_in_7d?.price ?? []).filter((_: any, i: number) => i % 6 === 0), // downsample to ~28 points
          dexUrl: DEX_LINKS[t.id] ?? `https://www.coingecko.com/en/coins/${t.id}`,
        }))
        .sort((a: any, b: any) => {
          if (a.id === 'tezos') return -1;
          if (b.id === 'tezos') return 1;
          return b.marketCap - a.marketCap;
        });
      priceCache = { data: tokens, ts: Date.now() };
      return tokens;
    } catch (e) {
      if (priceCache) return priceCache.data;
      return [];
    }
  }),
});

// ─── Upload Router ────────────────────────────────────────────────────────────
const uploadRouter = router({
  getUploadUrl: publicProcedure
    .input(z.object({ filename: z.string(), contentType: z.string(), folder: z.string().default("submissions") }))
    .mutation(async () => {
      return { uploadEndpoint: "/api/upload" };
    }),
});

// ─── Image Migration Router ─────────────────────────────────────────────────
const imageMigrationRouter = router({
  // Migrate a single image: download from WordPress, upload to Manus Storage, return new URL
  migrateImage: publicProcedure
    .input(z.object({
      imageUrl: z.string().url(),
      secret: z.string(),
    }))
    .mutation(async ({ input }) => {
      if (input.secret !== (process.env.CRON_SECRET_KEY || 'xtz-migrate-2026')) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      try {
        const { storagePut } = await import('./storage');
        // Download the image
        const res = await fetch(input.imageUrl, {
          signal: AbortSignal.timeout(15000),
          headers: { 'User-Agent': 'XTZNews/1.0' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get('content-type') || 'image/jpeg';
        const buffer = Buffer.from(await res.arrayBuffer());
        // Extract filename from URL
        const urlPath = new URL(input.imageUrl).pathname;
        const filename = urlPath.split('/').pop() || 'image.jpg';
        const key = `wp-media/${filename}`;
        const { url } = await storagePut(key, buffer, contentType);
        return { success: true, url };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }),

  // Bulk update post featuredImageUrl in DB
  updatePostImage: publicProcedure
    .input(z.object({
      postId: z.number(),
      newUrl: z.string(),
      secret: z.string(),
    }))
    .mutation(async ({ input }) => {
      if (input.secret !== (process.env.CRON_SECRET_KEY || 'xtz-migrate-2026')) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const { getDb } = await import('./db');
      const { posts } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const database = await getDb();
      if (!database) throw new Error('DB not available');
      await database.update(posts).set({ featuredImageUrl: input.newUrl }).where(eq(posts.id, input.postId));
      return { success: true };
    }),

  // Get all posts with WordPress image URLs that need migrating
  getPendingImages: publicProcedure
    .input(z.object({ secret: z.string(), limit: z.number().default(100), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      if (input.secret !== (process.env.CRON_SECRET_KEY || 'xtz-migrate-2026')) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const { getDb } = await import('./db');
      const { posts } = await import('../drizzle/schema');
      const { like, and, isNotNull, sql } = await import('drizzle-orm');
      const database = await getDb();
      if (!database) return { posts: [], total: 0 };
      const results = await database.select({ id: posts.id, featuredImageUrl: posts.featuredImageUrl })
        .from(posts)
        .where(like(posts.featuredImageUrl, '%xtz.news/wp-content%'))
        .limit(input.limit)
        .offset(input.offset);
      const [{ count }] = await database.select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(like(posts.featuredImageUrl, '%xtz.news/wp-content%'));
      return { posts: results, total: Number(count) };
    }),
});


// ─── Settings Router ──────────────────────────────────────────────────────────
const settingsRouter = router({
  getBreakingNews: publicProcedure.query(async () => {
    const [text, url, active] = await Promise.all([
      db.getSetting('breaking_news_text'),
      db.getSetting('breaking_news_url'),
      db.getSetting('breaking_news_active'),
    ]);
    return { text, url, active: active === 'true' };
  }),
  setBreakingNews: adminProcedure
    .input(z.object({ text: z.string(), url: z.string().optional(), active: z.boolean() }))
    .mutation(async ({ input }) => {
      await Promise.all([
        db.setSetting('breaking_news_text', input.text),
        db.setSetting('breaking_news_url', input.url || ''),
        db.setSetting('breaking_news_active', input.active ? 'true' : 'false'),
      ]);
      return { success: true };
    }),
});

// ─── Audio Router (on-demand ElevenLabs generation) ──────────────────────────
const GEORGE_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb';
const MAX_CHARS = 4500;

function htmlToSpeechText(html: string, title: string): string {
  let text = html
    .replace(/<div[^>]*>(?:[\s\S]*?)<\/div>/gi, (m) => m.includes('iframe') || m.includes('youtube') ? '' : m)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
  return `${title}. ${text}`;
}

async function generateElevenLabsAudio(text: string, apiKey: string): Promise<Buffer> {
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= MAX_CHARS) { chunks.push(remaining); break; }
    const cut = remaining.lastIndexOf('. ', MAX_CHARS);
    if (cut === -1) { chunks.push(remaining.slice(0, MAX_CHARS)); remaining = remaining.slice(MAX_CHARS); }
    else { chunks.push(remaining.slice(0, cut + 1)); remaining = remaining.slice(cut + 2); }
  }
  const buffers: Buffer[] = [];
  for (const chunk of chunks) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${GEORGE_VOICE_ID}`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
      body: JSON.stringify({ text: chunk, model_id: 'eleven_flash_v2_5', voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true } }),
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) throw new Error(`ElevenLabs error: ${res.status}`);
    buffers.push(Buffer.from(await res.arrayBuffer()));
  }
  return Buffer.concat(buffers);
}

const audioRouter = router({
  getOrGenerate: publicProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input }) => {
      const { getDb } = await import('./db');
      const { posts } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const { storagePut } = await import('./storage');
      const db = await getDb();
      if (!db) throw new Error('DB unavailable');
      const [post] = await db.select({ id: posts.id, title: posts.title, content: posts.content, audioUrl: posts.audioUrl, slug: posts.slug })
        .from(posts).where(eq(posts.id, input.postId)).limit(1);
      if (!post) throw new Error('Post not found');
      if (post.audioUrl) return { audioUrl: post.audioUrl, cached: true };
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) throw new Error('ELEVENLABS_API_KEY not configured');
      const speechText = htmlToSpeechText(post.content || '', post.title);
      const audioBuffer = await generateElevenLabsAudio(speechText, apiKey);
      const key = `article-audio/${post.slug}-audio.mp3`;
      const { url } = await storagePut(key, audioBuffer, 'audio/mpeg');
      await db.update(posts).set({ audioUrl: url }).where(eq(posts.id, input.postId));
      return { audioUrl: url, cached: false };
    }),
});
// ─────────────────────────────────────────────────────────────────────────────

const monthlyDigestRouter = router({
  run: publicProcedure
    .input(z.object({
      payload: z.object({
        deliveryId: z.string(),
        sentAt: z.string(),
        dryRun: z.boolean(),
      }),
      signature: z.string(),
    }))
    .mutation(async ({ input }) => {
      if (!isValidMonthlyDigestPayload(input.payload) || !verifyMonthlyDigestScheduleSignature(input.payload, input.signature, MONTHLY_DIGEST_SCHEDULER_PUBLIC_KEY)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid monthly digest scheduler signature" });
      }
      const result = await executeMonthlyDigest(input.payload);
      if (!result.ok) throw new TRPCError({ code: "BAD_GATEWAY", message: "Monthly digest delivery was partial" });
      return result;
    }),
});

// ─── App Router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  posts: postsRouter,
  categories: categoriesRouter,
  tags: tagsRouter,
  projects: projectsRouter,
  events: eventsRouter,
  pages: pagesRouter,
  submissions: submissionsRouter,
  artProjectSubmissions: artProjectSubmissionsRouter,
  tezosEventCandidates: tezosEventCandidatesRouter,
  newsletter: newsletterRouter,
  prices: priceRouter,
  upload: uploadRouter,
  imageMigration: imageMigrationRouter,
  explorer: explorerRouter,
  tools: toolsRouter,
  settings: settingsRouter,
  audio: audioRouter,
  translations: translationsRouter,
  preferences: preferencesRouter,
  customAuth: customAuthRouter,
  monthlyDigest: monthlyDigestRouter,
})
export type AppRouter = typeof appRouter;
