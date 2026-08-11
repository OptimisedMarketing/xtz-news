import { describe, expect, it } from "vitest";
import { compactTakeaway, getLocaleFromPath, getTranslatedSlugFromPath } from "../client/src/lib/readerUtils";

describe("translation route helpers", () => {
  it("derives the locale and article slug from explicit locale routes", () => {
    const path = "/zh/etherlink-70-ganesha-unites-tezos-and-evm-ecosystems";
    expect(getLocaleFromPath(path)).toBe("zh");
    expect(getTranslatedSlugFromPath(path)).toBe("etherlink-70-ganesha-unites-tezos-and-evm-ecosystems");
  });

  it("returns a locale for locale archive routes without an article slug", () => {
    expect(getLocaleFromPath("/fr")).toBe("fr");
    expect(getTranslatedSlugFromPath("/fr")).toBe("");
  });
});

describe("compactTakeaway", () => {
  it("preserves short reader summaries and trims long ones on a word boundary", () => {
    expect(compactTakeaway("Native composability connects Michelson and EVM.")).toBe("Native composability connects Michelson and EVM.");
    const long = "Etherlink 7.0 creates a dual-interface execution layer that lets Tezos native Michelson contracts and EVM applications share one ledger without relying on external bridges for cross-interface calls.";
    const compact = compactTakeaway(long, 92);
    expect(compact).toMatch(/…$/);
    expect(compact.length).toBeLessThanOrEqual(92);
    expect(compact).not.toContain("bridg…");
  });
});
