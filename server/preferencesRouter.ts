import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const preferencesRouter = router({
  followedCategories: protectedProcedure.query(({ ctx }) => db.getFollowedCategories(ctx.user.id)),

  toggleCategory: protectedProcedure
    .input(z.object({ categoryId: z.number().int().positive(), following: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const category = await db.getCategoryById(input.categoryId);
      if (!category) throw new TRPCError({ code: "NOT_FOUND", message: "Category not found" });

      if (input.following) {
        await db.followCategory(ctx.user.id, input.categoryId);
      } else {
        await db.unfollowCategory(ctx.user.id, input.categoryId);
      }
      return { categoryId: input.categoryId, following: input.following };
    }),

  forYou: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(12).default(6) }))
    .query(async ({ ctx, input }) => {
      const [followedCategories, postList] = await Promise.all([
        db.getFollowedCategories(ctx.user.id),
        db.getForYouPosts(ctx.user.id, input.limit),
      ]);
      const posts = await Promise.all(postList.map(async (post) => ({
        ...post,
        categories: await db.getPostCategories(post.id),
      })));
      return { followedCategories, posts };
    }),
});
