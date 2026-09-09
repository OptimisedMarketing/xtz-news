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
  passwordHash: varchar("passwordHash", { length: 255 }),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  emailVerifyToken: varchar("emailVerifyToken", { length: 128 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, (t) => [uniqueIndex("users_email_unique_idx").on(t.email)]);

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

// ─── Reader Category Follows ──────────────────────────────────────────────────
// A reader can follow multiple editorial categories. This is intentionally a
// small, explicit preference store rather than inferred behavioural tracking.
export const userCategoryFollows = mysqlTable(
  "user_category_follows",
  {
    userId: int("userId").notNull(),
    categoryId: int("categoryId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("ucf_user_category_idx").on(t.userId, t.categoryId),
    index("ucf_user_idx").on(t.userId),
    index("ucf_category_idx").on(t.categoryId),
  ]
);

export type UserCategoryFollow = typeof userCategoryFollows.$inferSelect;

// ─── Custom Reader Authentication ────────────────────────────────────────────
export const passwordResetTokens = mysqlTable(
  "password_reset_tokens",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    token: varchar("token", { length: 128 }).notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    used: boolean("used").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("password_reset_tokens_token_unique_idx").on(t.token),
    index("password_reset_tokens_user_idx").on(t.userId),
  ]
);

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
  keyTakeaways: text("keyTakeaways"),
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

// ─── TezOracle official status monitor ────────────────────────────────────────
// Stores source-derived project milestones and the contract addresses explicitly
// published by TezOracle. The cloud monitor is the only writer.
export const tezoracleStatusSnapshots = mysqlTable(
  "tezoracle_status_snapshots",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceUrl: varchar("sourceUrl", { length: 500 }).notNull(),
    sourceHash: varchar("sourceHash", { length: 64 }).notNull(),
    architectureStatus: varchar("architectureStatus", { length: 64 }).notNull(),
    implementationStatus: varchar("implementationStatus", { length: 64 }).notNull(),
    testnetStatus: varchar("testnetStatus", { length: 64 }).notNull(),
    productionStatus: varchar("productionStatus", { length: 64 }).notNull(),
    contractAddresses: longtext("contractAddresses").notNull(),
    sourceCheckedAt: timestamp("sourceCheckedAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [index("tss_checked_idx").on(t.sourceCheckedAt), index("tss_hash_idx").on(t.sourceHash)]
);

export const tezoracleStatusImportDeliveries = mysqlTable(
  "tezoracle_status_import_deliveries",
  {
    id: int("id").autoincrement().primaryKey(),
    deliveryId: varchar("deliveryId", { length: 128 }).notNull(),
    payloadHash: varchar("payloadHash", { length: 64 }).notNull(),
    changed: boolean("changed").notNull(),
    receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("tsid_delivery_idx").on(t.deliveryId)]
);

export type TezOracleStatusSnapshot = typeof tezoracleStatusSnapshots.$inferSelect;

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

// ─── Art on Tezos Editorial Submissions ───────────────────────────────────────
// Public submissions are held for editorial review and are never published automatically.
export const artProjectSubmissions = mysqlTable("art_project_submissions", {
  id: int("id").autoincrement().primaryKey(),
  submitterName: varchar("submitterName", { length: 255 }).notNull(),
  submitterEmail: varchar("submitterEmail", { length: 320 }).notNull(),
  submitterType: mysqlEnum("submitterType", ["artist", "gallery", "collective", "other"]).notNull(),
  projectName: varchar("projectName", { length: 500 }).notNull(),
  projectType: mysqlEnum("projectType", ["exhibition", "marketplace", "creator_tool", "other"]).notNull(),
  websiteUrl: text("websiteUrl").notNull(),
  description: text("description").notNull(),
  agreedToReview: boolean("agreedToReview").default(false).notNull(),
  status: mysqlEnum("status", ["pending", "reviewed", "approved", "rejected"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("art_project_submissions_status_idx").on(t.status), index("art_project_submissions_created_idx").on(t.createdAt)]);

export type ArtProjectSubmission = typeof artProjectSubmissions.$inferSelect;

// ─── Cloud-discovered Tezos Event Candidates ───────────────────────────────────
// The cloud importer can only create or refresh pending review records. Reader-facing
// events are created only after an administrator deliberately publishes a candidate.
export const tezosEventCandidates = mysqlTable("tezos_event_candidates", {
  id: int("id").autoincrement().primaryKey(),
  sourceKey: varchar("sourceKey", { length: 64 }).notNull(),
  sourceEventId: varchar("sourceEventId", { length: 512 }).notNull(),
  sourceUrl: text("sourceUrl").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  startAt: timestamp("startAt").notNull(),
  endAt: timestamp("endAt"),
  location: varchar("location", { length: 500 }),
  timezone: varchar("timezone", { length: 64 }),
  eventType: mysqlEnum("eventType", ["community", "conference", "meetup", "workshop", "exhibition", "online", "other"]).default("community").notNull(),
  submitterName: varchar("submitterName", { length: 255 }),
  submitterEmail: varchar("submitterEmail", { length: 320 }),
  agreedToReview: boolean("agreedToReview").default(false).notNull(),
  sourceHash: varchar("sourceHash", { length: 64 }).notNull(),
  sourceCheckedAt: timestamp("sourceCheckedAt").notNull(),
  status: mysqlEnum("status", ["pending", "reviewed", "published", "rejected"]).default("pending").notNull(),
  eventId: int("eventId"),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  uniqueIndex("tezos_event_candidate_source_idx").on(t.sourceKey, t.sourceEventId),
  index("tezos_event_candidate_status_idx").on(t.status),
  index("tezos_event_candidate_start_idx").on(t.startAt),
  index("tezos_event_candidate_type_idx").on(t.eventType),
]);

export type TezosEventCandidate = typeof tezosEventCandidates.$inferSelect;

export const tezosEventImportDeliveries = mysqlTable("tezos_event_import_deliveries", {
  id: int("id").autoincrement().primaryKey(),
  deliveryId: varchar("deliveryId", { length: 128 }).notNull(),
  payloadHash: varchar("payloadHash", { length: 64 }).notNull(),
  candidateCount: int("candidateCount").notNull(),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
}, (t) => [uniqueIndex("tezos_event_import_delivery_idx").on(t.deliveryId)]);

export type TezosEventImportDelivery = typeof tezosEventImportDeliveries.$inferSelect;

// ─── Newsletter Subscribers ─────────────────────────────────────────────────────
export const newsletterSubscribers = mysqlTable(
  "newsletter_subscribers",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    name: varchar("name", { length: 255 }),
    status: mysqlEnum("status", ["active", "unsubscribed"]).default("active").notNull(),
    govAlerts: boolean("govAlerts").default(false).notNull(),
    unsubToken: varchar("unsubToken", { length: 64 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("newsletter_email_idx").on(t.email)]
);

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// ─── Newsletter Monthly Digest Deliveries ──────────────────────────────────────
// Records a successful subscriber-period delivery so scheduled retries cannot
// send the same month's digest twice once Resend has accepted it.
export const newsletterMonthlyDigestDeliveries = mysqlTable(
  "newsletter_monthly_digest_deliveries",
  {
    id: int("id").autoincrement().primaryKey(),
    subscriberId: int("subscriberId").notNull(),
    digestPeriod: varchar("digestPeriod", { length: 7 }).notNull(), // YYYY-MM
    resendEmailId: varchar("resendEmailId", { length: 255 }),
    sentAt: timestamp("sentAt").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("newsletter_monthly_digest_subscriber_period_idx").on(t.subscriberId, t.digestPeriod),
    index("newsletter_monthly_digest_period_idx").on(t.digestPeriod),
  ]
);

export type NewsletterMonthlyDigestDelivery = typeof newsletterMonthlyDigestDeliveries.$inferSelect;

// ─── Site Settings ────────────────────────────────────────────────────────────
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: longtext("value"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Post Translations ────────────────────────────────────────────────────────
// Stores translated versions of articles for 10 international locales.
// No new categories/tags are created — same taxonomy, translated display names only.
// Locales: zh, ko, ja, de, es, fr, pt, ru, ar, tr
export const postTranslations = mysqlTable(
  "post_translations",
  {
    id: int("id").autoincrement().primaryKey(),
    postId: int("postId").notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 500 }).notNull(),
    excerpt: text("excerpt"),
    content: longtext("content").notNull(),
    metaTitle: varchar("metaTitle", { length: 255 }),
    metaDescription: text("metaDescription"),
    audioUrl: text("audioUrl"),
    keyTakeaways: text("keyTakeaways"),
    status: mysqlEnum("status", ["draft", "published"]).default("published").notNull(),
    translatedAt: timestamp("translatedAt").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("pt_post_locale_idx").on(t.postId, t.locale),
    index("pt_locale_idx").on(t.locale),
    index("pt_postId_idx").on(t.postId),
  ]
);
export type PostTranslation = typeof postTranslations.$inferSelect;
export type InsertPostTranslation = typeof postTranslations.$inferInsert;

// ─── Translation Import Deliveries ───────────────────────────────────────────
// Stores accepted cloud-to-site delivery IDs so signed imports are replay-safe.
export const translationImportDeliveries = mysqlTable(
  "translation_import_deliveries",
  {
    id: int("id").autoincrement().primaryKey(),
    deliveryId: varchar("deliveryId", { length: 128 }).notNull(),
    payloadHash: varchar("payloadHash", { length: 64 }).notNull(),
    importedCount: int("importedCount").notNull(),
    receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("tid_delivery_idx").on(t.deliveryId)]
);
export type TranslationImportDelivery = typeof translationImportDeliveries.$inferSelect;

// Supported locales for the translation system
export const SUPPORTED_LOCALES = ["zh", "ko", "ja", "de", "es", "fr", "pt", "ru", "ar", "tr"] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  zh: "中文",
  ko: "한국어",
  ja: "日本語",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  pt: "Português",
  ru: "Русский",
  ar: "العربية",
  tr: "Türkçe",
};

export const LOCALE_ENGLISH_NAMES: Record<SupportedLocale, string> = {
  zh: "Chinese",
  ko: "Korean",
  ja: "Japanese",
  de: "German",
  es: "Spanish",
  fr: "French",
  pt: "Portuguese",
  ru: "Russian",
  ar: "Arabic",
  tr: "Turkish",
};

export const RTL_LOCALES: SupportedLocale[] = ["ar"];
