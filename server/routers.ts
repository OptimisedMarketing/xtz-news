import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import * as db from "./db";

// ─── Admin guard ──────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ─── Posts Router ─────────────────────────────────────────────────────────────
const postsRouter = router({
  latest: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10), offset: z.number().default(0) }))
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

  featured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(6) }))
    .query(async ({ input }) => {
      const postList = await db.getFeaturedPosts(input.limit);
      const withCats = await Promise.all(
        postList.map(async (p) => ({ ...p, categories: await db.getPostCategories(p.id) }))
      );
      return withCats;
    }),

  // Combined homepage query — single round trip
  homepageData: publicProcedure.query(async () => {
    const [latestRaw, mostReadRaw] = await Promise.all([
      db.getLatestPosts(10, 0),
      db.getMostReadPosts(8),
    ]);
    const allPosts = [...latestRaw, ...mostReadRaw];
    const uniqueIds = Array.from(new Set(allPosts.map((p) => p.id)));
    const catsMap: Record<number, Awaited<ReturnType<typeof db.getPostCategories>>> = {};
    await Promise.all(uniqueIds.map(async (id) => { catsMap[id] = await db.getPostCategories(id); }));
    const withCats = (posts: typeof latestRaw) => posts.map((p) => ({ ...p, categories: catsMap[p.id] ?? [] }));
    const latest = withCats(latestRaw);
    const mostRead = withCats(mostReadRaw);
    const featured = latest.filter((p) => p.isFeatured).slice(0, 6);
    const featuredToShow = featured.length >= 3 ? featured : latest.slice(0, 6);
    return { latest, mostRead, featured: featuredToShow };
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

  adminList: adminProcedure.query(() => db.getAllProjectsAdmin()),
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

// ─── Newsletter Router ───────────────────────────────────────────────────────
const newsletterRouter = router({
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email(), name: z.string().optional() }))
    .mutation(async ({ input }) => {
      const { getDb } = await import('./db');
      const { newsletterSubscribers } = await import('../drizzle/schema');
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      try {
        await dbConn.insert(newsletterSubscribers)
          .values({ email: input.email, name: input.name ?? null, status: 'active' })
          .onDuplicateKeyUpdate({ set: { status: 'active' } });
        await notifyOwner({
          title: 'New Newsletter Subscriber',
          content: `${input.name ? input.name + ' (' + input.email + ')' : input.email} subscribed to the XTZ.News newsletter.`,
        }).catch(() => {});
        return { success: true };
      } catch {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid email address' });
      }
    }),

  list: adminProcedure.query(async () => {
    const { getDb } = await import('./db');
    const { newsletterSubscribers } = await import('../drizzle/schema');
    const { desc } = await import('drizzle-orm');
    const dbConn = await getDb();
    if (!dbConn) return [];
    return dbConn.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
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
  newsletter: newsletterRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
