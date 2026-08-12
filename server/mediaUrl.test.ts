import { describe, expect, it } from "vitest";
import { getMediaUrl } from "../client/src/lib/mediaUrl";

describe("getMediaUrl", () => {
  it("routes manuscript-storage paths through the same-origin media relay", () => {
    expect(getMediaUrl("/manus-storage/article/cover.webp")).toBe("/media/article/cover.webp");
    expect(getMediaUrl("https://xtz.news/manus-storage/article/cover.webp")).toBe("/media/article/cover.webp");
  });

  it("preserves external media and returns a safe empty source for missing media", () => {
    expect(getMediaUrl("https://images.example.org/cover.webp")).toBe("https://images.example.org/cover.webp");
    expect(getMediaUrl(null)).toBe("");
  });
});
