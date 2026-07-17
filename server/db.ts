import { eq, desc, asc, like, or, sql, and, inArray, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  users, InsertUser,
  posts, Post, InsertPost,
  categories, Category,
  tags, Tag,
  postCategories, postTags,
  projects, Project,
  events, Event,
  pages, Page,
  articleSubmissions, ArticleSubmission,
  siteSettings,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

// ─── Posts ────────────────────────────────────────────────────────────────────
export async function getLatestPosts(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(posts)
    .where(eq(posts.status, "publish"))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getMostReadPosts(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(posts)
    .where(eq(posts.status, "publish"))
    .orderBy(desc(posts.viewCount), desc(posts.publishedAt))
    .limit(limit);
}

export async function getTrendingPosts(limit = 8) {
  const db = await getDb();
  if (!db) return [];
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const results = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "publish"), sql`${posts.publishedAt} >= ${fortyEightHoursAgo}`))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  // Fall back to latest 8 posts if fewer than 3 in last 48h
  if (results.length < 3) {
    return getLatestPosts(limit);
  }
  return results;
}

export async function getMostReadThisWeek(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const results = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "publish"), sql`${posts.publishedAt} >= ${sevenDaysAgo}`))
    .orderBy(desc(posts.viewCount), desc(posts.publishedAt))
    .limit(limit);
  // Fall back to all-time if fewer than 5 results this week
  if (results.length < 5) {
    return getMostReadPosts(limit);
  }
  return results;
}

export async function getFeaturedPosts(limit = 6) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "publish"), eq(posts.isFeatured, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "publish")))
    .limit(1);
  return result[0];
}

export async function getPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0];
}

export async function getTotalPostCount(status = "publish") {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(eq(posts.status, status as "publish" | "draft" | "private"));
  return Number(result[0]?.count ?? 0);
}

export async function incrementPostViewCount(id: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(posts)
    .set({ viewCount: sql`${posts.viewCount} + 1` })
    .where(eq(posts.id, id));
}

export async function searchPosts(query: string, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  const q = `%${query}%`;
  return db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.status, "publish"),
        or(like(posts.title, q), like(posts.excerpt, q))
      )
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function getAllPosts(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(posts)
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function updatePost(id: number, data: Partial<InsertPost>) {
  const db = await getDb();
  if (!db) return;
  await db.update(posts).set(data).where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(postCategories).where(eq(postCategories.postId, id));
  await db.delete(postTags).where(eq(postTags.postId, id));
  await db.delete(posts).where(eq(posts.id, id));
}

export async function createPost(data: InsertPost) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(posts).values(data);
  return result;
}

// ─── Post Categories ──────────────────────────────────────────────────────────
export async function getPostCategories(postId: number): Promise<Category[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({ category: categories })
    .from(postCategories)
    .innerJoin(categories, eq(postCategories.categoryId, categories.id))
    .where(eq(postCategories.postId, postId));
  return rows.map((r) => r.category);
}

export async function getPostTags(postId: number): Promise<Tag[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({ tag: tags })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, postId));
  return rows.map((r) => r.tag);
}

export async function getPostsByCategorySlug(slug: string, limit = 12, offset = 0) {
  const db = await getDb();
  if (!db) return { posts: [], total: 0 };
  const cat = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  if (!cat[0]) return { posts: [], total: 0 };
  const catId = cat[0].id;
  const postRows = await db
    .select({ post: posts })
    .from(postCategories)
    .innerJoin(posts, eq(postCategories.postId, posts.id))
    .where(and(eq(postCategories.categoryId, catId), eq(posts.status, "publish")))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);
  const countRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(postCategories)
    .innerJoin(posts, eq(postCategories.postId, posts.id))
    .where(and(eq(postCategories.categoryId, catId), eq(posts.status, "publish")));
  return { posts: postRows.map((r) => r.post), total: Number(countRows[0]?.count ?? 0) };
}

export async function getPostsByTagSlug(slug: string, limit = 12, offset = 0) {
  const db = await getDb();
  if (!db) return { posts: [], total: 0 };
  const tag = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  if (!tag[0]) return { posts: [], total: 0 };
  const tagId = tag[0].id;
  const postRows = await db
    .select({ post: posts })
    .from(postTags)
    .innerJoin(posts, eq(postTags.postId, posts.id))
    .where(and(eq(postTags.tagId, tagId), eq(posts.status, "publish")))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);
  const countRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(postTags)
    .innerJoin(posts, eq(postTags.postId, posts.id))
    .where(and(eq(postTags.tagId, tagId), eq(posts.status, "publish")));
  return { posts: postRows.map((r) => r.post), total: Number(countRows[0]?.count ?? 0) };
}

export async function getRelatedPosts(postId: number, categoryIds: number[], limit = 4) {
  const db = await getDb();
  if (!db) return [];
  if (categoryIds.length === 0) return getLatestPosts(limit);
  const rows = await db
    .select({ post: posts })
    .from(postCategories)
    .innerJoin(posts, eq(postCategories.postId, posts.id))
    .where(
      and(
        inArray(postCategories.categoryId, categoryIds),
        ne(posts.id, postId),
        eq(posts.status, "publish")
      )
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return rows.map((r) => r.post);
}

// ─── Categories ───────────────────────────────────────────────────────────────
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(desc(categories.postCount));
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

// ─── Tags ─────────────────────────────────────────────────────────────────────
export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tags).orderBy(desc(tags.postCount));
}

export async function getTagBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  return result[0];
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export async function getAllProjects(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(projects)
    .where(eq(projects.status, "publish"))
    .orderBy(desc(projects.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function searchProjects(query: string, limit = 5) {
  const db = await getDb();
  if (!db) return [];
  const q = `%${query}%`;
  return db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.status, "publish"),
        or(like(projects.title, q), like(projects.excerpt, q))
      )
    )
    .orderBy(desc(projects.publishedAt))
    .limit(limit);
}

export async function getProjectBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return result[0];
}

export async function getAllProjectsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(desc(projects.publishedAt));
}

// ─── Events ───────────────────────────────────────────────────────────────────
export async function getAllEvents() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(events)
    .where(eq(events.status, "publish"))
    .orderBy(desc(events.publishedAt));
}

// ─── Pages ────────────────────────────────────────────────────────────────────
export async function getPageBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return result[0];
}

export async function getAllPages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pages).orderBy(asc(pages.title));
}

// ─── Article Submissions ──────────────────────────────────────────────────────
export async function createSubmission(data: typeof articleSubmissions.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(articleSubmissions).values(data);
  return result;
}

export async function getAllSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(articleSubmissions).orderBy(desc(articleSubmissions.createdAt));
}

export async function updateSubmissionStatus(id: number, status: "pending" | "reviewed" | "approved" | "rejected", notes?: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(articleSubmissions).set({ status, ...(notes ? { adminNotes: notes } : {}) }).where(eq(articleSubmissions.id, id));
}

// ─── Site Settings ────────────────────────────────────────────────────────────
export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result[0]?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(siteSettings)
    .values({ key, value })
    .onDuplicateKeyUpdate({ set: { value } });
}
