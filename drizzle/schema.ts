import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  longtext,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = mysqlTable(
  "categories",
  {
    id: int("id").autoincrement().primaryKey(),
    wpId: int("wpId"),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    parentId: int("parentId"),
    postCount: int("postCount").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug)]
);

export type Category = typeof categories.$inferSelect;

// ─── Tags ─────────────────────────────────────────────────────────────────────
export const tags = mysqlTable(
  "tags",
  {
    id: int("id").autoincrement().primaryKey(),
    wpId: int("wpId"),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    postCount: int("postCount").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("tags_slug_idx").on(t.slug)]
);

export type Tag = typeof tags.$inferSelect;

// ─── Posts ────────────────────────────────────────────────────────────────────
export const posts = mysqlTable(
  "posts",
  {
    id: int("id").autoincrement().primaryKey(),
    wpId: int("wpId"),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull(),
    content: longtext("content"),
    excerpt: text("excerpt"),
    featuredImageUrl: text("featuredImageUrl"),
    featuredImageAlt: text("featuredImageAlt"),
    status: mysqlEnum("status", ["publish", "draft", "private"]).default("publish").notNull(),
    isFeatured: boolean("isFeatured").default(false).notNull(),
    viewCount: int("viewCount").default(0).notNull(),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: text("seoDescription"),
  audioUrl: varchar("audioUrl", { length: 500 }),
  },
  (t) => [
    uniqueIndex("posts_slug_idx").on(t.slug),
    index("posts_status_idx").on(t.status),
    index("posts_published_idx").on(t.publishedAt),
    index("posts_featured_idx").on(t.isFeatured),
  ]
);

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

// ─── Post ↔ Category (many-to-many) ──────────────────────────────────────────
export const postCategories = mysqlTable(
  "post_categories",
  {
    postId: int("postId").notNull(),
    categoryId: int("categoryId").notNull(),
  },
  (t) => [
    index("pc_post_idx").on(t.postId),
    index("pc_cat_idx").on(t.categoryId),
  ]
);

// ─── Post ↔ Tag (many-to-many) ────────────────────────────────────────────────
export const postTags = mysqlTable(
  "post_tags",
  {
    postId: int("postId").notNull(),
    tagId: int("tagId").notNull(),
  },
  (t) => [
    index("pt_post_idx").on(t.postId),
    index("pt_tag_idx").on(t.tagId),
  ]
);

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projects = mysqlTable(
  "projects",
  {
    id: int("id").autoincrement().primaryKey(),
    wpId: int("wpId"),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull(),
    content: longtext("content"),
    excerpt: text("excerpt"),
    featuredImageUrl: text("featuredImageUrl"),
    featuredImageAlt: text("featuredImageAlt"),
    category: varchar("category", { length: 100 }),
    websiteUrl: text("websiteUrl"),
    status: mysqlEnum("status", ["publish", "draft"]).default("publish").notNull(),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("projects_slug_idx").on(t.slug)]
);

export type Project = typeof projects.$inferSelect;

// ─── Events ───────────────────────────────────────────────────────────────────
export const events = mysqlTable(
  "events",
  {
    id: int("id").autoincrement().primaryKey(),
    wpId: int("wpId"),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull(),
    content: longtext("content"),
    excerpt: text("excerpt"),
    featuredImageUrl: text("featuredImageUrl"),
    status: mysqlEnum("status", ["publish", "draft"]).default("publish").notNull(),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("events_slug_idx").on(t.slug)]
);

export type Event = typeof events.$inferSelect;

// ─── Pages ────────────────────────────────────────────────────────────────────
export const pages = mysqlTable(
  "pages",
  {
    id: int("id").autoincrement().primaryKey(),
    wpId: int("wpId"),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull(),
    content: longtext("content"),
    featuredImageUrl: text("featuredImageUrl"),
    status: mysqlEnum("status", ["publish", "draft"]).default("publish").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("pages_slug_idx").on(t.slug)]
);

export type Page = typeof pages.$inferSelect;

// ─── Article Submissions ──────────────────────────────────────────────────────
export const articleSubmissions = mysqlTable("article_submissions", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }),
  email: varchar("email", { length: 320 }),
  articleTitle: varchar("articleTitle", { length: 500 }),
  articleFileUrl: text("articleFileUrl"),
  articleFileKey: text("articleFileKey"),
  bannerImageUrl: text("bannerImageUrl"),
  bannerImageKey: text("bannerImageKey"),
  image2Url: text("image2Url"),
  image2Key: text("image2Key"),
  agreedToTerms: boolean("agreedToTerms").default(false).notNull(),
  status: mysqlEnum("status", ["pending", "reviewed", "approved", "rejected"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ArticleSubmission = typeof articleSubmissions.$inferSelect;

// ─── Newsletter Subscribers ─────────────────────────────────────────────────────
export const newsletterSubscribers = mysqlTable(
  "newsletter_subscribers",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    name: varchar("name", { length: 255 }),
    status: mysqlEnum("status", ["active", "unsubscribed"]).default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("newsletter_email_idx").on(t.email)]
);

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// ─── Site Settings ────────────────────────────────────────────────────────────
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: longtext("value"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
