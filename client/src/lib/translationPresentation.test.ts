import { describe, expect, it } from "vitest";
import { getAlternativeTranslations } from "./translationPresentation";

describe("getAlternativeTranslations", () => {
  it("keeps only unique available alternatives to the current language", () => {
    expect(getAlternativeTranslations([
      { locale: "zh", slug: "story-zh" },
      { locale: "ko", slug: "story-ko" },
      { locale: "zh", slug: "duplicate" },
      { locale: "fr", slug: "story-fr" },
    ], "zh")).toEqual([
      { locale: "ko", slug: "story-ko" },
      { locale: "fr", slug: "story-fr" },
    ]);
  });
});
