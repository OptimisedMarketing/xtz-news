import { describe, expect, it } from "vitest";
// @vitest-environment jsdom

import { normaliseArticleMediaUrls, parseSegments } from "./ArticleContent";
import { linkArticleGlossaryTerms } from "@/lib/articleGlossary";

describe("ArticleContent embeds", () => {
  it("turns the newsletter placeholder into a functional inline newsletter segment", () => {
    expect(parseSegments("<p>Before</p><div class=\"newsletter-cta\" data-article-newsletter=\"ganesha\"></div><p>After</p>")).toEqual([
      { type: "html", content: "<p>Before</p>" },
      { type: "newsletter" },
      { type: "html", content: "<p>After</p>" },
    ]);
  });

  it("turns the Kento roster marker into an inline interactive directory segment", () => {
    expect(parseSegments("<h2>Artists</h2><div data-kento-artist-directory=\"season-one\" aria-hidden=\"true\"></div><h2>Sources</h2>")).toEqual([
      { type: "html", content: "<h2>Artists</h2>" },
      { type: "kentoArtists" },
      { type: "html", content: "<h2>Sources</h2>" },
    ]);
  });

  it("preserves newsletter placeholders while linking glossary terms in surrounding archive-style content", () => {
    const output = linkArticleGlossaryTerms('<p>Tez can be delegated to a baker.</p><div class="newsletter-cta" data-article-newsletter="weekly"></div><p>Etherlink updates follow.</p>');
    expect(parseSegments(output).some((segment) => segment.type === "newsletter")).toBe(true);
    expect(output).toContain('href="/staking/start"');
    expect(output).toContain('href="/etherlink"');
  });

  it("routes first-party body images through the same-origin media relay", () => {
    const output = normaliseArticleMediaUrls('<figure><img src="/manus-storage/art/cover.webp" alt="Source visual" /><img src="https://xtz.news/manus-storage/legacy/image.png" alt="Legacy visual" /><video src="/manus-storage/art/recap.mp4" poster="/manus-storage/art/recap-still.webp"></video></figure>');
    expect(output).toContain('src="/media/art/cover.webp"');
    expect(output).toContain('src="/media/legacy/image.png"');
    expect(output).toContain('src="/media/art/recap.mp4"');
    expect(output).toContain('poster="/media/art/recap-still.webp"');
    expect(output).not.toContain('/manus-storage/');
  });
});
