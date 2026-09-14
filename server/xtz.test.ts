import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { COOKIE_NAME } from "../shared/const";

// ─── Mock DB helpers ──────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  getLatestPosts: vi.fn().mockResolvedValue([
    { id: 1, title: "Test Post", slug: "test-post", status: "publish", publishedAt: new Date("2025-01-01"), viewCount: 10, isFeatured: false, content: "<p>Content</p>", excerpt: "Excerpt", featuredImageUrl: "https://example.com/img.jpg", featuredImageAlt: null, wpId: 100, seoTitle: null, seoDescription: null, createdAt: new Date(), updatedAt: new Date() },
  ]),
  getMostReadPosts: vi.fn().mockResolvedValue([]),
  getFeaturedPosts: vi.fn().mockResolvedValue([]),
  getPostBySlug: vi.fn().mockResolvedValue({
    id: 1, title: "Test Post", slug: "test-post", status: "publish", publishedAt: new Date("2025-01-01"), viewCount: 10, isFeatured: false, content: "<p>Content</p>", excerpt: "Excerpt", featuredImageUrl: null, featuredImageAlt: null, wpId: 100, seoTitle: null, seoDescription: null, createdAt: new Date(), updatedAt: new Date()
  }),
  getPostCategories: vi.fn().mockResolvedValue([{ id: 1, name: "Latest News", slug: "latest-news", postCount: 50, wpId: 1, parentId: null, description: null, createdAt: new Date() }]),
  getPostTags: vi.fn().mockResolvedValue([]),
  getPostsByAuthorSlug: vi.fn().mockResolvedValue([]),
  incrementPostViewCount: vi.fn().mockResolvedValue(undefined),
  getPostsByCategorySlug: vi.fn().mockResolvedValue({ posts: [], total: 0 }),
  getPostsByTagSlug: vi.fn().mockResolvedValue({ posts: [], total: 0 }),
  getRelatedPosts: vi.fn().mockResolvedValue([]),
  searchPosts: vi.fn().mockResolvedValue([]),
  getTotalPostCount: vi.fn().mockResolvedValue(888),
  getAllPosts: vi.fn().mockResolvedValue([]),
  updatePost: vi.fn().mockResolvedValue(undefined),
  deletePost: vi.fn().mockResolvedValue(undefined),
  createPost: vi.fn().mockResolvedValue({}),
  getAllCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "Latest News", slug: "latest-news", postCount: 74, wpId: 1, parentId: null, description: null, createdAt: new Date() },
    { id: 2, name: "Games", slug: "games", postCount: 47, wpId: 14, parentId: null, description: null, createdAt: new Date() },
  ]),
  getCategoryBySlug: vi.fn().mockResolvedValue({ id: 1, name: "Latest News", slug: "latest-news", postCount: 74, wpId: 1, parentId: null, description: null, createdAt: new Date() }),
  getAllTags: vi.fn().mockResolvedValue([]),
  getTagBySlug: vi.fn().mockResolvedValue({ id: 1, name: "Tezos", slug: "tezos", postCount: 10, wpId: 1, createdAt: new Date() }),
  getAllProjects: vi.fn().mockResolvedValue([
    { id: 1, title: "Lyzi", slug: "lyzi", status: "publish", category: "Payments", content: "", excerpt: "", featuredImageUrl: null, featuredImageAlt: null, websiteUrl: null, wpId: 1, publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
  ]),
  getProjectBySlug: vi.fn().mockResolvedValue({ id: 1, title: "Lyzi", slug: "lyzi", status: "publish", category: "Payments", content: "", excerpt: "", featuredImageUrl: null, featuredImageAlt: null, websiteUrl: null, wpId: 1, publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() }),
  getAllProjectsAdmin: vi.fn().mockResolvedValue([]),
  getAllEvents: vi.fn().mockResolvedValue([]),
  getPageBySlug: vi.fn().mockResolvedValue({ id: 1, title: "Contact", slug: "contact", content: "<p>Contact us</p>", status: "publish", featuredImageUrl: null, wpId: 1, createdAt: new Date(), updatedAt: new Date() }),
  getAllPages: vi.fn().mockResolvedValue([]),
  createSubmission: vi.fn().mockResolvedValue({}),
  getAllSubmissions: vi.fn().mockResolvedValue([]),
  updateSubmissionStatus: vi.fn().mockResolvedValue(undefined),
  createArtProjectSubmission: vi.fn().mockResolvedValue({}),
  getAllArtProjectSubmissions: vi.fn().mockResolvedValue([]),
  updateArtProjectSubmissionStatus: vi.fn().mockResolvedValue(undefined),
  createCorrectionReport: vi.fn().mockResolvedValue(undefined),
  getAllCorrectionReports: vi.fn().mockResolvedValue([]),
  updateCorrectionReportStatus: vi.fn().mockResolvedValue(undefined),
  bulkUpdateCorrectionReportStatus: vi.fn().mockResolvedValue({ updated: 2 }),
  createAdvertiserEnquiry: vi.fn().mockResolvedValue(undefined),
  getAllAdvertiserEnquiries: vi.fn().mockResolvedValue([]),
  updateAdvertiserEnquiryStatus: vi.fn().mockResolvedValue(undefined),
  bulkUpdateAdvertiserEnquiryStatus: vi.fn().mockResolvedValue({ updated: 2 }),
  getAllTezosEventCandidates: vi.fn().mockResolvedValue([]),
  getPublishedTezosEventCandidates: vi.fn().mockResolvedValue([]),
  updateTezosEventCandidateStatus: vi.fn().mockResolvedValue(undefined),
  createTezosEventSubmission: vi.fn().mockResolvedValue(undefined),
  bulkUpdateTezosEventCandidateStatus: vi.fn().mockResolvedValue({ updated: 2 }),
  getSetting: vi.fn().mockResolvedValue(null),
  setSetting: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));
vi.mock("./correctionReportNotifications", () => ({
  sendCorrectionReportNotification: vi.fn().mockResolvedValue(true),
}));
vi.mock("./advertiserEnquiryNotifications", () => ({
  sendAdvertiserEnquiryNotification: vi.fn().mockResolvedValue(true),
}));

// ─── Context helpers ──────────────────────────────────────────────────────────
function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeAdminCtx(): TrpcContext {
  return {
    user: {
      id: 1, openId: "admin-open-id", name: "Admin", email: "admin@xtz.news",
      loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeUserCtx(): TrpcContext {
  return {
    user: {
      id: 2, openId: "user-open-id", name: "User", email: "user@xtz.news",
      loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("auth", () => {
  it("me returns null for unauthenticated user", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("me returns user for authenticated user", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.role).toBe("admin");
  });

  it("logout clears session cookie", async () => {
    const ctx = makeAdminCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalledWith(COOKIE_NAME, expect.objectContaining({ maxAge: -1 }));
  });
});

describe("posts", () => {
  it("latest returns posts", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.posts.latest({ limit: 5 });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("title");
    expect(result[0]).toHaveProperty("categories");
  });

  it("bySlug returns post with categories and tags", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.posts.bySlug({ slug: "test-post" });
    expect(result.slug).toBe("test-post");
    expect(result.categories).toBeDefined();
    expect(result.tags).toBeDefined();
  });

  it("lists only published stories assigned to a requested author profile", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.posts.byAuthor({ authorSlug: "lee-evans" })).resolves.toEqual([]);
  });

  it("search returns results for valid query", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.posts.search({ q: "tezos" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("search returns empty for short query", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.posts.search({ q: "t" });
    expect(result).toEqual([]);
  });

  it("count returns total post count", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const count = await caller.posts.count();
    expect(typeof count).toBe("number");
    expect(count).toBe(888);
  });

  it("adminList requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.posts.adminList({ limit: 10, offset: 0 })).rejects.toThrow();
  });

  it("adminList works for admin", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.posts.adminList({ limit: 10, offset: 0 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows administrators to assign a specific post to Rossa Browne", async () => {
    const adminCaller = appRouter.createCaller(makeAdminCtx());
    await expect(adminCaller.posts.adminUpdate({ id: 1, authorSlug: "rossa-browne" })).resolves.toEqual({ success: true });
  });

  it("does not allow a reader to reassign a published post", async () => {
    const readerCaller = appRouter.createCaller(makeUserCtx());
    await expect(readerCaller.posts.adminUpdate({ id: 1, authorSlug: "rossa-browne" })).rejects.toThrow();
  });
});

describe("categories", () => {
  it("all returns categories", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.categories.all();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("slug");
  });

  it("bySlug returns category", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.categories.bySlug({ slug: "latest-news" });
    expect(result.slug).toBe("latest-news");
    expect(result.name).toBe("Latest News");
  });
});

describe("projects", () => {
  it("all returns projects", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.projects.all({});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("bySlug returns project", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.projects.bySlug({ slug: "lyzi" });
    expect(result.slug).toBe("lyzi");
    expect(result.category).toBe("Payments");
  });
});

describe("submissions", () => {
  it("create succeeds with valid data", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.submissions.create({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      articleTitle: "My Tezos Article",
      agreedToTerms: true,
    });
    expect(result).toEqual({ success: true });
  });

  it("create fails without terms agreement", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.submissions.create({
        firstName: "John",
        agreedToTerms: false,
      })
    ).rejects.toThrow("You must agree to the terms");
  });

  it("list requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.submissions.list()).rejects.toThrow();
  });

  it("list works for admin", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.submissions.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("artProjectSubmissions", () => {
  const submission = {
    submitterName: "Ada Artist",
    submitterEmail: "ada@example.com",
    submitterType: "artist" as const,
    projectName: "Ada Studio",
    projectType: "creator_tool" as const,
    websiteUrl: "https://ada.example",
    description: "A source-grounded Tezos art profile with a useful official starting point for readers.",
    agreedToReview: true as const,
  };

  it("stores a complete consented project submission for editorial review", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.artProjectSubmissions.create(submission)).resolves.toEqual({ success: true });
  });

  it("requires explicit review consent and protects the editorial queue", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.artProjectSubmissions.create({ ...submission, agreedToReview: false })).rejects.toThrow();
    await expect(caller.artProjectSubmissions.list()).rejects.toThrow();
  });
});

describe("tezosEventCandidates", () => {
  it("keeps the review queue private while allowing readers to list editor-published events", async () => {
    const publicCaller = appRouter.createCaller(makePublicCtx());
    await expect(publicCaller.tezosEventCandidates.list()).rejects.toThrow();
    await expect(publicCaller.tezosEventCandidates.published()).resolves.toEqual([]);
  });

  it("allows only administrators to change a candidate’s public status", async () => {
    const userCaller = appRouter.createCaller(makeUserCtx());
    const adminCaller = appRouter.createCaller(makeAdminCtx());
    await expect(userCaller.tezosEventCandidates.updateStatus({ id: 4, status: "published" })).rejects.toThrow();
    await expect(adminCaller.tezosEventCandidates.updateStatus({ id: 4, status: "published", notes: "Reviewed against source." })).resolves.toEqual({ success: true });
  });

  it("stores a consented community event for review without allowing a reader to self-publish", async () => {
    const publicCaller = appRouter.createCaller(makePublicCtx());
    const userCaller = appRouter.createCaller(makeUserCtx());
    const submission = {
      submitterName: "Tezos Community",
      submitterEmail: "events@example.com",
      eventTitle: "Tezos Builders Meetup",
      eventType: "meetup" as const,
      sourceUrl: "https://example.com/tezos-meetup",
      startAt: "2026-10-01T18:00:00.000Z",
      location: "London, United Kingdom",
      description: "A community event for Tezos builders, contributors, and people who want to learn about the ecosystem.",
      agreedToReview: true as const,
    };
    await expect(publicCaller.tezosEventCandidates.create(submission)).resolves.toEqual({ success: true });
    await expect(userCaller.tezosEventCandidates.bulkUpdateStatus({ ids: [1], status: "published" })).rejects.toThrow();
  });

  it("allows administrators to update a bounded selected set in one explicit action", async () => {
    const adminCaller = appRouter.createCaller(makeAdminCtx());
    await expect(adminCaller.tezosEventCandidates.bulkUpdateStatus({ ids: [1, 2], status: "reviewed", notes: "Checked as a batch." })).resolves.toEqual({ updated: 2 });
    await expect(adminCaller.tezosEventCandidates.bulkUpdateStatus({ ids: [1, 1], status: "reviewed" })).rejects.toThrow();
  });
});

describe("correction reports", () => {
  const report = {
    reporterName: "Careful Reader",
    reporterEmail: "reader@example.com",
    articleUrl: "https://xtz.news/example-story",
    articleTitle: "Example story",
    correctionDetail: "The date in the second paragraph should be checked against the linked official source.",
    sourceUrl: "https://example.com/official-source",
    agreedToReview: true as const,
  };

  it("stores a consented correction privately for editorial review", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.correctionReports.create(report)).resolves.toEqual({ success: true });
  });

  it("requires consent and protects correction reports from non-administrators", async () => {
    const publicCaller = appRouter.createCaller(makePublicCtx());
    const readerCaller = appRouter.createCaller(makeUserCtx());
    await expect(publicCaller.correctionReports.create({ ...report, agreedToReview: false })).rejects.toThrow();
    await expect(publicCaller.correctionReports.create({ ...report, articleUrl: "https://example.com/other-story" })).rejects.toThrow("Use the canonical XTZ.News article URL.");
    await expect(readerCaller.correctionReports.list()).rejects.toThrow();
  });

  it("allows administrators to update a bounded selected correction-report set", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    await expect(caller.correctionReports.bulkUpdateStatus({ ids: [1, 2], status: "resolved", notes: "Checked against source." })).resolves.toEqual({ updated: 2 });
    await expect(caller.correctionReports.bulkUpdateStatus({ ids: [1, 1], status: "resolved" })).rejects.toThrow();
  });
});

describe("first-party promotion settings", () => {
  const promotion = {
    title: "Example owner app",
    description: "A concise owner-managed promotion.",
    url: "https://example.com/app",
    ctaLabel: "Explore",
    active: true,
  };

  it("keeps public display data readable and requires an administrator to configure it", async () => {
    const publicCaller = appRouter.createCaller(makePublicCtx());
    const readerCaller = appRouter.createCaller(makeUserCtx());
    const adminCaller = appRouter.createCaller(makeAdminCtx());
    await expect(publicCaller.settings.getFirstPartyPromotion()).resolves.toMatchObject({ active: false });
    await expect(readerCaller.settings.setFirstPartyPromotion(promotion)).rejects.toThrow();
    await expect(adminCaller.settings.setFirstPartyPromotion(promotion)).resolves.toEqual({ success: true });
  });

  it("accepts internal paths or HTTPS destinations and rejects unsafe promotion destinations", async () => {
    const adminCaller = appRouter.createCaller(makeAdminCtx());
    await expect(adminCaller.settings.setFirstPartyPromotion({ ...promotion, url: "/tools" })).resolves.toEqual({ success: true });
    await expect(adminCaller.settings.setFirstPartyPromotion({ ...promotion, url: "javascript:alert(1)" })).rejects.toThrow("Use an internal path or an HTTPS URL.");
  });

  it("allows administrators to configure rotating owner placements and placeholders without external destinations", async () => {
    const adminCaller = appRouter.createCaller(makeAdminCtx());
    await expect(adminCaller.settings.setFirstPartyPromotions([
      { id: "owner-app", title: "Owner app", description: "A factual first-party app placement.", url: "https://example.com", ctaLabel: "Open", active: true, placeholder: false },
      { id: "reserved-app", title: "Your next app", description: "A reserved owner placement.", url: "", ctaLabel: "Reserved", active: true, placeholder: true },
    ])).resolves.toEqual({ success: true });
    await expect(adminCaller.settings.setFirstPartyPromotions([{ id: "unsafe", title: "Unsafe", description: "Unsafe destination.", url: "javascript:alert(1)", ctaLabel: "Open", active: true, placeholder: false }])).rejects.toThrow("A live promotion needs an internal path or HTTPS URL.");
  });

  it("keeps the banner campaign publicly readable and reserves expiry edits for administrators", async () => {
    const publicCaller = appRouter.createCaller(makePublicCtx());
    const readerCaller = appRouter.createCaller(makeUserCtx());
    const adminCaller = appRouter.createCaller(makeAdminCtx());
    await expect(publicCaller.settings.getFirstPartyBannerCampaign()).resolves.toEqual({ active: true, endAt: null });
    await expect(readerCaller.settings.setFirstPartyBannerCampaign({ active: true, endAt: "2026-10-01T00:00:00.000Z" })).rejects.toThrow();
    await expect(adminCaller.settings.setFirstPartyBannerCampaign({ active: true, endAt: "2026-10-01T00:00:00.000Z" })).resolves.toEqual({ success: true });
    await expect(adminCaller.settings.setFirstPartyBannerCampaign({ active: true, endAt: "not-a-date" })).rejects.toThrow();
  });
});

describe("advertiser enquiries", () => {
  const enquiry = {
    contactName: "Alex Partner",
    contactEmail: "alex@example.com",
    companyName: "Tezos Example",
    websiteUrl: "https://example.com",
    placementInterest: "homepage_banner" as const,
    campaignBrief: "We would like to discuss a clearly labelled homepage campaign for a Tezos-native product launch.",
    agreedToContact: true as const,
  };

  it("stores consented advertiser enquiries privately for review", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.advertiserEnquiries.create(enquiry)).resolves.toEqual({ success: true });
  });

  it("requires consent and protects advertiser enquiry records from non-administrators", async () => {
    const publicCaller = appRouter.createCaller(makePublicCtx());
    const readerCaller = appRouter.createCaller(makeUserCtx());
    await expect(publicCaller.advertiserEnquiries.create({ ...enquiry, agreedToContact: false })).rejects.toThrow();
    await expect(readerCaller.advertiserEnquiries.list()).rejects.toThrow();
  });

  it("allows administrators to bulk progress selected advertiser enquiries", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    await expect(caller.advertiserEnquiries.bulkUpdateStatus({ ids: [1, 2], status: "replied", notes: "Contacted with availability." })).resolves.toEqual({ updated: 2 });
    await expect(caller.advertiserEnquiries.bulkUpdateStatus({ ids: [1, 1], status: "replied" })).rejects.toThrow();
  });
});

describe("pages", () => {
  it("bySlug returns page", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.pages.bySlug({ slug: "contact" });
    expect(result.slug).toBe("contact");
    expect(result.content).toBeDefined();
  });
});
