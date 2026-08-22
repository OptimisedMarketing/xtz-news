import { describe, expect, it } from "vitest";
import { parseSegments } from "./ArticleContent";

describe("ArticleContent embeds", () => {
  it("turns the newsletter placeholder into a functional inline newsletter segment", () => {
    expect(parseSegments("<p>Before</p><div class=\"newsletter-cta\" data-article-newsletter=\"ganesha\"></div><p>After</p>")).toEqual([
      { type: "html", content: "<p>Before</p>" },
      { type: "newsletter" },
      { type: "html", content: "<p>After</p>" },
    ]);
  });
});
