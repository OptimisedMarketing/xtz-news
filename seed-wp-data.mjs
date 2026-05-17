/**
 * XTZ.News WordPress Data Seeder
 * Seeds categories, tags, posts, projects, and events from extracted WP data.
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { eq, sql } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config();

const DATA_DIR = "/home/ubuntu/xtz-migration/content";

// ─── Load extracted data ──────────────────────────────────────────────────────
const cleanCats = JSON.parse(readFileSync(`${DATA_DIR}/clean_categories.json`, "utf-8"));
const tags = JSON.parse(readFileSync(`${DATA_DIR}/tags.json`, "utf-8"));
const posts = JSON.parse(readFileSync(`${DATA_DIR}/posts.json`, "utf-8"));
const projects = JSON.parse(readFileSync(`${DATA_DIR}/projects.json`, "utf-8"));
const events = JSON.parse(readFileSync(`${DATA_DIR}/events.json`, "utf-8"));
const media = JSON.parse(readFileSync(`${DATA_DIR}/media.json`, "utf-8"));

console.log(`Loaded: ${cleanCats.length} cats, ${tags.length} tags, ${posts.length} posts, ${projects.length} projects, ${events.length} events, ${Object.keys(media).length} media`);

// ─── DB connection ────────────────────────────────────────────────────────────
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// ─── Schema (inline for seeder) ───────────────────────────────────────────────
import {
  int, mysqlTable, text, timestamp, varchar, boolean, longtext, uniqueIndex, index, mysqlEnum
} from "drizzle-orm/mysql-core";

const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  wpId: int("wpId"),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  parentId: int("parentId"),
  postCount: int("postCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

const tagsTable = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  wpId: int("wpId"),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  postCount: int("postCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

const postsTable = mysqlTable("posts", {
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
  seoTitle: varchar("seoTitle", { length: 500 }),
  seoDescription: text("seoDescription"),
});

const postCategoriesTable = mysqlTable("post_categories", {
  postId: int("postId").notNull(),
  categoryId: int("categoryId").notNull(),
});

const postTagsTable = mysqlTable("post_tags", {
  postId: int("postId").notNull(),
  tagId: int("tagId").notNull(),
});

const projectsTable = mysqlTable("projects", {
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
});

const eventsTable = mysqlTable("events", {
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
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function decodeHtml(str) {
  if (!str) return str;
  return str
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function getMediaUrl(mediaId, mediaMap) {
  if (!mediaId || !mediaMap[mediaId]) return null;
  const m = mediaMap[mediaId];
  // Prefer medium_large or large size, fall back to full
  const sizes = m.sizes || {};
  return sizes.medium_large?.source_url || sizes.large?.source_url || m.url || null;
}

function safeSlug(slug) {
  // Ensure slug is safe ASCII
  return slug.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 490);
}

function safeTitle(title) {
  return decodeHtml(title || "").slice(0, 490);
}

// ─── 1. Seed Categories ───────────────────────────────────────────────────────
console.log("\n=== Seeding Categories ===");
const catWpIdToDbId = {};
let catCount = 0;

// WPML-generated category names to exclude (translated duplicates)
const WPML_EXCLUDE = new Set([
  'non categorizzato', 'sin categorizar', 'unkategorisiert', 'non classifié(e)',
  'uncategorized @hi', 'giochi', 'jeux', 'juegos', 'spiele',
  'ausstellung', 'esposizione', 'exposición', 'exposition',
  'ausgewählte neuigkeiten', 'noticias destacadas', 'notizie in primo piano',
  "boulangers d'entreprise", 'firmenbäcker', 'panaderos corporativos', 'panettieri aziendali',
  'défi', 'defi的', 'defi(分散型金融)', 'web3(英語)', 'web3的',
]);

for (const cat of cleanCats) {
  if (WPML_EXCLUDE.has(cat.name.toLowerCase().trim())) continue;
  try {
    const slug = safeSlug(cat.slug);
    await db.insert(categories).values({
      wpId: cat.id,
      name: cat.name.slice(0, 250),
      slug,
      description: cat.description || null,
      postCount: cat.count || 0,
    }).onDuplicateKeyUpdate({ set: { postCount: cat.count || 0 } });
    
    // Get the inserted/existing id
    const rows = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
    if (rows[0]) catWpIdToDbId[cat.id] = rows[0].id;
    catCount++;
  } catch (e) {
    // Skip duplicates
  }
}
console.log(`Seeded ${catCount} categories`);

// ─── 2. Seed Tags ─────────────────────────────────────────────────────────────
console.log("\n=== Seeding Tags ===");
const tagWpIdToDbId = {};
let tagCount = 0;

for (const tag of tags) {
  try {
    const slug = safeSlug(tag.slug);
    await db.insert(tagsTable).values({
      wpId: tag.id,
      name: tag.name.slice(0, 250),
      slug,
      postCount: tag.count || 0,
    }).onDuplicateKeyUpdate({ set: { postCount: tag.count || 0 } });
    
    const rows = await db.select({ id: tagsTable.id }).from(tagsTable).where(eq(tagsTable.slug, slug)).limit(1);
    if (rows[0]) tagWpIdToDbId[tag.id] = rows[0].id;
    tagCount++;
  } catch (e) {
    // Skip
  }
}
console.log(`Seeded ${tagCount} tags`);

// ─── 3. Seed Posts ────────────────────────────────────────────────────────────
console.log("\n=== Seeding Posts ===");
let postCount = 0;
let postErrors = 0;
const postWpIdToDbId = {};

// Featured post WP IDs (most recent + high-view posts)
const FEATURED_WP_IDS = new Set(posts.slice(0, 20).map(p => p.id));

for (const post of posts) {
  try {
    const slug = safeSlug(post.slug);
    const title = safeTitle(post.title);
    const mediaUrl = getMediaUrl(post.featured_media, media);
    const mediaAlt = post.featured_media && media[post.featured_media] ? media[post.featured_media].alt || null : null;
    const publishedAt = post.date ? new Date(post.date) : null;
    
    // SEO from Yoast
    const yoast = post.yoast || {};
    const seoTitle = yoast.title ? yoast.title.slice(0, 490) : null;
    const seoDesc = yoast.description ? yoast.description.slice(0, 500) : null;

    await db.insert(postsTable).values({
      wpId: post.id,
      title,
      slug,
      content: post.content || null,
      excerpt: post.excerpt || null,
      featuredImageUrl: mediaUrl,
      featuredImageAlt: mediaAlt,
      status: "publish",
      isFeatured: FEATURED_WP_IDS.has(post.id),
      publishedAt,
      seoTitle,
      seoDescription: seoDesc,
    }).onDuplicateKeyUpdate({ set: { wpId: post.id } });

    const rows = await db.select({ id: postsTable.id }).from(postsTable).where(eq(postsTable.slug, slug)).limit(1);
    if (rows[0]) {
      postWpIdToDbId[post.id] = rows[0].id;
      postCount++;
    }
  } catch (e) {
    postErrors++;
    if (postErrors <= 5) console.error(`  Error post ${post.id}: ${e.message}`);
  }
}
console.log(`Seeded ${postCount} posts (${postErrors} errors)`);

// ─── 4. Seed Post-Category relationships ──────────────────────────────────────
console.log("\n=== Seeding Post-Category links ===");
let pcCount = 0;
for (const post of posts) {
  const dbPostId = postWpIdToDbId[post.id];
  if (!dbPostId) continue;
  for (const wpCatId of (post.categories || [])) {
    const dbCatId = catWpIdToDbId[wpCatId];
    if (!dbCatId) continue;
    try {
      await db.insert(postCategoriesTable).values({ postId: dbPostId, categoryId: dbCatId })
        .onDuplicateKeyUpdate({ set: { postId: dbPostId } });
      pcCount++;
    } catch (e) { /* skip dup */ }
  }
}
console.log(`Seeded ${pcCount} post-category links`);

// ─── 5. Seed Post-Tag relationships ───────────────────────────────────────────
console.log("\n=== Seeding Post-Tag links ===");
let ptCount = 0;
for (const post of posts) {
  const dbPostId = postWpIdToDbId[post.id];
  if (!dbPostId) continue;
  for (const wpTagId of (post.tags || [])) {
    const dbTagId = tagWpIdToDbId[wpTagId];
    if (!dbTagId) continue;
    try {
      await db.insert(postTagsTable).values({ postId: dbPostId, tagId: dbTagId })
        .onDuplicateKeyUpdate({ set: { postId: dbPostId } });
      ptCount++;
    } catch (e) { /* skip dup */ }
  }
}
console.log(`Seeded ${ptCount} post-tag links`);

// ─── 6. Seed Projects ─────────────────────────────────────────────────────────
console.log("\n=== Seeding Projects ===");
let projCount = 0;

// Map project categories from WP categories
const PROJECT_CAT_MAP = {
  'payments': 'Payments',
  'defi': 'DeFi',
  'nft': 'NFT',
  'baking': 'Baking',
  'games': 'Games',
  'authentication': 'Authentication',
  'real-world-usecase': 'Real-World Usecase',
};

for (const proj of projects) {
  try {
    const slug = safeSlug(proj.slug);
    const title = safeTitle(proj.title);
    const mediaUrl = getMediaUrl(proj.featured_media, media);
    const publishedAt = proj.date ? new Date(proj.date) : null;
    
    // Extract category from content/slug
    let category = null;
    for (const [key, val] of Object.entries(PROJECT_CAT_MAP)) {
      if (slug.includes(key) || (proj.content || '').toLowerCase().includes(key)) {
        category = val;
        break;
      }
    }

    await db.insert(projectsTable).values({
      wpId: proj.id,
      title,
      slug,
      content: proj.content || null,
      excerpt: proj.excerpt || null,
      featuredImageUrl: mediaUrl,
      status: "publish",
      category,
      publishedAt,
    }).onDuplicateKeyUpdate({ set: { wpId: proj.id } });
    projCount++;
  } catch (e) {
    if (projCount < 5) console.error(`  Project error: ${e.message}`);
  }
}
console.log(`Seeded ${projCount} projects`);

// ─── 7. Seed Events ───────────────────────────────────────────────────────────
console.log("\n=== Seeding Events ===");
let evtCount = 0;
for (const evt of events) {
  try {
    const slug = safeSlug(evt.slug);
    const title = safeTitle(evt.title);
    const mediaUrl = getMediaUrl(evt.featured_media, media);
    await db.insert(eventsTable).values({
      wpId: evt.id,
      title,
      slug,
      content: evt.content || null,
      excerpt: evt.excerpt || null,
      featuredImageUrl: mediaUrl,
      status: "publish",
      publishedAt: evt.date ? new Date(evt.date) : null,
    }).onDuplicateKeyUpdate({ set: { wpId: evt.id } });
    evtCount++;
  } catch (e) { /* skip */ }
}
console.log(`Seeded ${evtCount} events`);

// ─── Done ─────────────────────────────────────────────────────────────────────
console.log("\n" + "=".repeat(50));
console.log("SEEDING COMPLETE");
console.log("=".repeat(50));
console.log(`Categories: ${catCount}`);
console.log(`Tags:       ${tagCount}`);
console.log(`Posts:      ${postCount}`);
console.log(`Projects:   ${projCount}`);
console.log(`Events:     ${evtCount}`);

await connection.end();
process.exit(0);
