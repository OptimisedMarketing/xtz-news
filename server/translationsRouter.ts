import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { postTranslations } from "../drizzle/schema";
import { SUPPORTED_LOCALES, type SupportedLocale } from "../shared/locales";
import { eq, and, desc } from "drizzle-orm";

const localeSchema = z.enum(SUPPORTED_LOCALES);

export const translationsRouter = router({
  // Get a single translated article by locale + slug
  byLocaleSlug: publicProcedure
    .input(z.object({ locale: localeSchema, slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [row] = await db
        .select()
        .from(postTranslations)
        .where(
          and(
            eq(postTranslations.locale, input.locale),
            eq(postTranslations.slug, input.slug)
          )
        )
        .limit(1);
      return row ?? null;
    }),

  // Get all translations for a given postId (for hreflang tags)
  byPostId: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select({
          locale: postTranslations.locale,
          slug: postTranslations.slug,
          title: postTranslations.title,
        })
        .from(postTranslations)
        .where(
          and(
            eq(postTranslations.postId, input.postId),
            eq(postTranslations.status, "published")
          )
        );
    }),

  // Get latest translated articles for a locale (for localised homepage/archive)
  latestByLocale: publicProcedure
    .input(z.object({ locale: localeSchema, limit: z.number().min(1).max(50).default(12) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(postTranslations)
        .where(
          and(
            eq(postTranslations.locale, input.locale),
            eq(postTranslations.status, "published")
          )
        )
        .orderBy(desc(postTranslations.translatedAt))
        .limit(input.limit);
    }),

  // Get translation count per locale (for admin stats)
  countByLocale: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return {};
    const rows = await db
      .select({ locale: postTranslations.locale })
      .from(postTranslations)
      .where(eq(postTranslations.status, "published"));

    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.locale] = (counts[row.locale] ?? 0) + 1;
    }
    return counts;
  }),

  // Check which locales have a translation for a given postId
  availableLocales: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [] as SupportedLocale[];
      const rows = await db
        .select({ locale: postTranslations.locale })
        .from(postTranslations)
        .where(
          and(
            eq(postTranslations.postId, input.postId),
            eq(postTranslations.status, "published")
          )
        );
      return rows.map((r) => r.locale as SupportedLocale);
    }),
});
