import { describe, expect, it } from "vitest";
// @vitest-environment jsdom

import { parseSegments } from "./ArticleContent";
import { linkArticleGlossaryTerms } from "@/lib/articleGlossary";

describe("ArticleContent embeds", () => {
  it("turns the newsletter placeholder into a functional inline newsletter segment", () => {
    expect(parseSegments("<p>Before</p><div class=\"newsletter-cta\" data-article-newsletter=\"ganesha\"></div><p>After</p>")).toEqual([
      { type: "html", content: "<p>Before</p>" },
      { type: "newsletter" },
      { type: "html", content: "<p>After</p>" },
    ]);
  });

  it("preserves newsletter placeholders while linking glossary terms in surrounding archive-style content", () => {
    const output = linkArticleGlossaryTerms('<p>Tez can be delegated to a baker.</p><div class="newsletter-cta" data-article-newsletter="weekly"></div><p>Etherlink updates follow.</p>');
    expect(parseSegments(output).some((segment) => segment.type === "newsletter")).toBe(true);
    expect(output).toContain('href="/staking/start"');
    expect(output).toContain('href="/etherlink"');
  });
});
