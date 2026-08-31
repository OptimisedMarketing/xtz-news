import { describe, expect, it } from "vitest";
import { isTezOracleStory, prioritiseTezOracleRelatedStories } from "./tezoracleStory";

describe("TezOracle related-reading presentation", () => {
  it("recognises the TezOracle editorial story", () => {
    expect(isTezOracleStory("tezoracle-aims-to-restore-tezos-native-price-feeds")).toBe(true);
    expect(isTezOracleStory("etherlink-ganesha-native-atomic-composability-gateway-on-chain")).toBe(false);
  });

  it("prioritises infrastructure and DeFi context before broader coverage", () => {
    const ordered = prioritiseTezOracleRelatedStories([
      { id: 1, title: "Tezos art roundup", categories: [{ slug: "art", name: "Art" }], publishedAt: "2026-08-31" },
      { id: 2, title: "Etherlink EVM tools update", categories: [{ slug: "infrastructure", name: "Infrastructure" }], publishedAt: "2026-08-20" },
      { id: 3, title: "Tezos DeFi application report", categories: [{ slug: "defi", name: "DeFi" }], publishedAt: "2026-08-19" },
    ]);

    expect(ordered.map((story) => story.id)).toEqual([2, 3, 1]);
  });
});
