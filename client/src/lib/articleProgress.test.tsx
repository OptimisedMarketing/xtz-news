import { describe, expect, it } from "vitest";
import { getArticleReadingProgress } from "./articleProgress";

describe("getArticleReadingProgress", () => {
  const article = { articleTop: 1000, articleHeight: 3000, viewportHeight: 1000 };

  it("tracks progress through the article body rather than the full document", () => {
    expect(getArticleReadingProgress({ ...article, scrollY: 0 })).toBe(0);
    expect(getArticleReadingProgress({ ...article, scrollY: 2250 })).toBe(55);
    expect(getArticleReadingProgress({ ...article, scrollY: 4000 })).toBe(100);
  });
});
