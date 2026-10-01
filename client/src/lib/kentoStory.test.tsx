import { isKentoStory, prioritiseKentoRelatedStories } from "./kentoStory";
import { describe, expect, it } from "vitest";

describe("Kento related-reading presentation", () => {
  it("recognises the Kento campaign story", () => {
    expect(isKentoStory("kento-objkt-physical-digital-art-cards-kickstarter")).toBe(true);
    expect(isKentoStory("kento-season-one-funded-951-backers-215920")).toBe(true);
    expect(isKentoStory("art-on-tezos-weekly-recap-2026-08-21")).toBe(false);
  });

  it("prioritises creator and art-collecting context before general art coverage", () => {
    const ordered = prioritiseKentoRelatedStories([
      { id: 1, title: "Tezos community update", categories: [{ slug: "art", name: "Art" }], publishedAt: "2026-09-02" },
      { id: 2, title: "Digital Art Exhibition and NFT Collectors on Tezos", categories: [{ slug: "art", name: "Art" }], publishedAt: "2026-08-20" },
      { id: 3, title: "Protocol update", categories: [{ slug: "latest-news", name: "Latest News" }], publishedAt: "2026-09-04" },
    ]);

    expect(ordered.map((story) => story.id)).toEqual([2, 1, 3]);
  });
});
