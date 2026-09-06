import { describe, expect, it } from "vitest";
import { isPostQuantumStory, prioritisePostQuantumRelatedStories } from "./postQuantumStory";

describe("post-quantum article discovery", () => {
  it("recognises only the dedicated post-quantum news story", () => {
    expect(isPostQuantumStory("tezos-post-quantum-previewnet-why-now")).toBe(true);
    expect(isPostQuantumStory("tezoracle-aims-to-restore-tezos-native-price-feeds")).toBe(false);
  });

  it("puts cryptography-specific Tezos context ahead of generic recent stories", () => {
    const ordered = prioritisePostQuantumRelatedStories([
      { title: "Teztree Gives Tezos Users One Link for Their On-Chain Presence", publishedAt: "2026-09-05", categories: [{ slug: "latest-news" }] },
      { title: "Tezos Ushuaia Protocol Upgrade and tz5 Testing", publishedAt: "2026-08-01", categories: [{ slug: "infrastructure" }] },
    ]);

    expect(ordered[0].title).toContain("Ushuaia");
  });
});
