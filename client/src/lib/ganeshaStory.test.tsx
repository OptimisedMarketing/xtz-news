import { describe, expect, it } from "vitest";
import { GANESHA_STORY_SLUG, isGaneshaStory, prioritiseGaneshaRelatedStories } from "./ganeshaStory";

describe("Ganesha story helpers", () => {
  it("identifies only the Ganesha story for the specialised article experience", () => {
    expect(isGaneshaStory(GANESHA_STORY_SLUG)).toBe(true);
    expect(isGaneshaStory("teztree-community-spotlight")).toBe(false);
  });

  it("prioritises Etherlink and Tezos stories for Ganesha readers", () => {
    const stories = prioritiseGaneshaRelatedStories([
      { id: 1, title: "Tezos art update", categories: [{ slug: "art", name: "Art" }], publishedAt: "2026-08-22" },
      { id: 2, title: "Etherlink kernel update", categories: [{ slug: "etherlink", name: "Etherlink" }], publishedAt: "2026-08-10" },
      { id: 3, title: "Tezos protocol news", categories: [{ slug: "tezos", name: "Tezos" }], publishedAt: "2026-08-21" },
    ]);

    expect(stories.map((story) => story.id)).toEqual([2, 3, 1]);
  });
});
