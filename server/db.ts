import { eq, desc, asc, like, or, sql, and, inArray, ne } from "drizzle-orm";
import mysql from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import {
  users, InsertUser,
  posts, Post, InsertPost,
  categories, Category,
  userCategoryFollows,
  tags, Tag,
  postCategories, postTags,
  projects, Project,
  events, Event,
  pages, Page,
  articleSubmissions, ArticleSubmission,
  artProjectSubmissions, ArtProjectSubmission,
  siteSettings,
  postTranslations,
  translationImportDeliveries,
  tezoracleStatusSnapshots,
  tezoracleStatusImportDeliveries,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import type { TranslationImportPayload, TranslationImportResult } from "./translationImportRouter";
import type { TranslationJob } from "./translationJobRouter";
import type { TezOracleStatusImportPayload, TezOracleStatusImportResult } from "./tezoracleStatusImportRouter";
import { SUPPORTED_LOCALES } from "../shared/locales";

let _db: MySql2Database | null = null;
let _pool: mysql.Pool | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _pool = mysql.createPool(process.env.DATABASE_URL);
      _db = drizzle(_pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _pool = null;
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

export class TranslationImportConflictError extends Error {}

export async function importTranslationBatch(
  payload: TranslationImportPayload,
  payloadHash: string,
): Promise<TranslationImportResult> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const localeSet = new Set(SUPPORTED_LOCALES);
  const sourceIds = Array.from(new Set(payload.translations.map((translation) => translation.postId)));
  const recordKeys = new Set<string>();
  for (const translation of payload.translations) {
    const recordKey = `${translation.postId}:${translation.locale}`;
    if (!Number.isInteger(translation.postId) || translation.postId <= 0 || !localeSet.has(translation.locale as typeof SUPPORTED_LOCALES[number]) || !translation.content.trim() || !translation.keyTakeaways.trim() || recordKeys.has(recordKey)) {
      throw new TranslationImportConflictError("Translation payload contains an invalid or duplicate record");
    }
    recordKeys.add(recordKey);
  }

  return db.transaction(async (tx) => {
    const existing = await tx
      .select({ payloadHash: translationImportDeliveries.payloadHash, importedCount: translationImportDeliveries.importedCount })
      .from(translationImportDeliveries)
      .where(eq(translationImportDeliveries.deliveryId, payload.deliveryId))
      .limit(1);
    if (existing[0]) {
      if (existing[0].payloadHash !== payloadHash) {
        throw new TranslationImportConflictError("Delivery ID has already been used with different content");
      }
      return { imported: existing[0].importedCount, duplicate: true };
    }

    const sources = await tx
      .select({ id: posts.id })
      .from(posts)
      .where(and(inArray(posts.id, sourceIds), eq(posts.status, "publish")));
    if (sources.length !== sourceIds.length) {
      throw new TranslationImportConflictError("One or more source posts are unavailable for translation import");
    }

    for (const translation of payload.translations) {
      await tx
        .insert(postTranslations)
        .values({ ...translation, status: "published" })
        .onDuplicateKeyUpdate({
          set: {
            title: translation.title,
            slug: translation.slug,
            excerpt: translation.excerpt,
            content: translation.content,
            metaTitle: translation.metaTitle,
            metaDescription: translation.metaDescription,
            keyTakeaways: translation.keyTakeaways,
            status: "published",
            translatedAt: new Date(),
          },
        });
    }

    await tx.insert(translationImportDeliveries).values({
      deliveryId: payload.deliveryId,
      payloadHash,
      importedCount: payload.translations.length,
    });
    return { imported: payload.translations.length };
  });
}

export async function getUntranslatedTranslationJobs(locale: string, limit: number, slug?: string): Promise<TranslationJob[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [
    eq(posts.status, "publish"),
    sql`${posts.content} IS NOT NULL`,
    sql`${postTranslations.id} IS NULL`,
  ];
  if (slug) conditions.push(eq(posts.slug, slug));

  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      keyTakeaways: posts.keyTakeaways,
    })
    .from(posts)
    .leftJoin(postTranslations, and(eq(postTranslations.postId, posts.id), eq(postTranslations.locale, locale)))
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

  return rows.filter((row): row is TranslationJob => Boolean(row.content));
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

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0];
}

// ─── Reader Category Follows ──────────────────────────────────────────────────
export async function getFollowedCategories(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({ category: categories })
    .from(userCategoryFollows)
    .innerJoin(categories, eq(userCategoryFollows.categoryId, categories.id))
    .where(eq(userCategoryFollows.userId, userId))
    .orderBy(desc(userCategoryFollows.createdAt));
  return rows.map((row) => row.category);
}

export async function followCategory(userId: number, categoryId: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(userCategoryFollows)
    .values({ userId, categoryId })
    .onDuplicateKeyUpdate({ set: { categoryId } });
}

export async function unfollowCategory(userId: number, categoryId: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .delete(userCategoryFollows)
    .where(and(eq(userCategoryFollows.userId, userId), eq(userCategoryFollows.categoryId, categoryId)));
}

export async function getForYouPosts(userId: number, limit = 6) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({ post: posts })
    .from(userCategoryFollows)
    .innerJoin(postCategories, eq(userCategoryFollows.categoryId, postCategories.categoryId))
    .innerJoin(posts, eq(postCategories.postId, posts.id))
    .where(and(eq(userCategoryFollows.userId, userId), eq(posts.status, "publish")))
    .orderBy(desc(posts.publishedAt))
    .limit(limit * 4);

  const uniquePosts = Array.from(new Map(rows.map((row) => [row.post.id, row.post])).values());
  return uniquePosts.slice(0, limit);
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

export class TezOracleStatusImportConflictError extends Error {}

export async function getLatestTezOracleStatus() {
  const db = await getDb();
  if (!db) return undefined;
  const snapshot = await db.select().from(tezoracleStatusSnapshots).orderBy(desc(tezoracleStatusSnapshots.sourceCheckedAt)).limit(1);
  if (!snapshot[0]) return undefined;
  try {
    return { ...snapshot[0], contractAddresses: JSON.parse(snapshot[0].contractAddresses) as Array<{ network: string; address: string; label?: string }> };
  } catch {
    return { ...snapshot[0], contractAddresses: [] as Array<{ network: string; address: string; label?: string }> };
  }
}

export async function importTezOracleStatus(
  payload: TezOracleStatusImportPayload,
  payloadHash: string,
): Promise<TezOracleStatusImportResult> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  return db.transaction(async (tx) => {
    const existingDelivery = await tx.select({ payloadHash: tezoracleStatusImportDeliveries.payloadHash, changed: tezoracleStatusImportDeliveries.changed })
      .from(tezoracleStatusImportDeliveries)
      .where(eq(tezoracleStatusImportDeliveries.deliveryId, payload.deliveryId))
      .limit(1);
    if (existingDelivery[0]) {
      if (existingDelivery[0].payloadHash !== payloadHash) throw new TezOracleStatusImportConflictError("Delivery ID has already been used with different content");
      return { changed: existingDelivery[0].changed, duplicate: true };
    }

    const sourceCheckedAt = new Date(payload.sourceCheckedAt);
    const latest = await tx.select().from(tezoracleStatusSnapshots).orderBy(desc(tezoracleStatusSnapshots.sourceCheckedAt)).limit(1);
    const hasChanged = latest[0]?.sourceHash !== payload.sourceHash;
    const values = {
      sourceUrl: payload.sourceUrl,
      sourceHash: payload.sourceHash,
      architectureStatus: payload.milestones.architecture,
      implementationStatus: payload.milestones.implementation,
      testnetStatus: payload.milestones.testnet,
      productionStatus: payload.milestones.production,
      contractAddresses: JSON.stringify(payload.contractAddresses),
      sourceCheckedAt,
    };

    if (hasChanged || !latest[0]) {
      await tx.insert(tezoracleStatusSnapshots).values(values);
    } else {
      await tx.update(tezoracleStatusSnapshots).set({ sourceCheckedAt }).where(eq(tezoracleStatusSnapshots.id, latest[0].id));
    }
    await tx.insert(tezoracleStatusImportDeliveries).values({ deliveryId: payload.deliveryId, payloadHash, changed: hasChanged || !latest[0] });
    return { changed: hasChanged || !latest[0] };
  });
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

// ─── Art on Tezos Editorial Submissions ───────────────────────────────────────
export async function createArtProjectSubmission(data: typeof artProjectSubmissions.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(artProjectSubmissions).values(data);
}

export async function getAllArtProjectSubmissions(): Promise<ArtProjectSubmission[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(artProjectSubmissions).orderBy(desc(artProjectSubmissions.createdAt));
}

export async function updateArtProjectSubmissionStatus(id: number, status: "pending" | "reviewed" | "approved" | "rejected", notes?: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(artProjectSubmissions).set({ status, ...(notes ? { adminNotes: notes } : {}) }).where(eq(artProjectSubmissions.id, id));
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
