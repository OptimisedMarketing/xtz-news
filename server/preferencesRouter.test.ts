import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const fixtures = vi.hoisted(() => {
  const category = { id: 9, name: "Etherlink", slug: "etherlink", postCount: 12, wpId: 9, parentId: null, description: null, createdAt: new Date() };
  const post = { id: 88, title: "Etherlink update", slug: "etherlink-update", status: "publish" as const, isFeatured: false, viewCount: 2, content: null, excerpt: "", featuredImageUrl: null, featuredImageAlt: null, wpId: null, publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date(), seoTitle: null, seoDescription: null, audioUrl: null, keyTakeaways: null };
  return { category, post };
});

vi.mock("./db", () => ({
  getFollowedCategories: vi.fn().mockResolvedValue([fixtures.category]),
  getForYouPosts: vi.fn().mockResolvedValue([fixtures.post]),
  getPostCategories: vi.fn().mockResolvedValue([fixtures.category]),
  getCategoryById: vi.fn().mockResolvedValue(fixtures.category),
  followCategory: vi.fn().mockResolvedValue(undefined),
  unfollowCategory: vi.fn().mockResolvedValue(undefined),
}));

import * as db from "./db";
import { preferencesRouter } from "./preferencesRouter";

function makeUserContext(): TrpcContext {
  return {
    user: { id: 21, openId: "reader-open-id", name: "Reader", email: "reader@example.com", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("preferencesRouter", () => {
  it("returns a For You feed scoped to the signed-in reader's followed categories", async () => {
    const caller = preferencesRouter.createCaller(makeUserContext());
    const result = await caller.forYou({ limit: 4 });

    expect(db.getFollowedCategories).toHaveBeenCalledWith(21);
    expect(db.getForYouPosts).toHaveBeenCalledWith(21, 4);
    expect(result.followedCategories).toEqual([fixtures.category]);
    expect(result.posts[0]).toMatchObject({ id: 88, categories: [fixtures.category] });
  });

  it("persists follow and unfollow choices for the signed-in reader", async () => {
    const caller = preferencesRouter.createCaller(makeUserContext());
    await expect(caller.toggleCategory({ categoryId: 9, following: true })).resolves.toEqual({ categoryId: 9, following: true });
    await expect(caller.toggleCategory({ categoryId: 9, following: false })).resolves.toEqual({ categoryId: 9, following: false });

    expect(db.followCategory).toHaveBeenCalledWith(21, 9);
    expect(db.unfollowCategory).toHaveBeenCalledWith(21, 9);
  });
});
