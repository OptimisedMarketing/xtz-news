/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import {
  ART_ARCHIVE_FILTERS,
  filterArtArchivePosts,
  getArtArchiveFilter,
  getArtArchiveType,
  type ArtArchivePost,
} from "./ArtArchiveFilters";
import { ART_ON_TEZOS_CONTRIBUTORS } from "./ArtOnTezosWeeklyModule";

const recap: ArtArchivePost = {
  id: 1,
  title: "Art on Tezos Friday Recap: Museum Signals",
  slug: "art-recap",
  categories: [{ id: 1, name: "Art", slug: "art" }],
};
const exhibition: ArtArchivePost = {
  id: 2,
  title: "Museum Programme Opens a New Digital Art Exhibition",
  slug: "museum-programme",
  categories: [{ id: 2, name: "Exhibition", slug: "exhibition" }],
};
const release: ArtArchivePost = {
  id: 3,
  title: "New Generative Works Arrive on objkt",
  slug: "new-generative-works",
  categories: [{ id: 1, name: "Art", slug: "art" }],
};

describe("Art on Tezos archive filters", () => {
  it("keeps weekly recaps, exhibitions, and artist releases available as reader-facing filters", () => {
    expect(ART_ARCHIVE_FILTERS.map((filter) => filter.label)).toEqual(expect.arrayContaining(["Weekly recaps", "Exhibitions", "Artist releases"]));
  });

  it("classifies recap, exhibition, and release coverage without relying on a scheduled job", () => {
    expect(getArtArchiveType(recap)).toBe("recaps");
    expect(getArtArchiveType(exhibition)).toBe("exhibitions");
    expect(getArtArchiveType(release)).toBe("releases");
  });

  it("filters the combined archive predictably", () => {
    const posts = [recap, exhibition, release];
    expect(filterArtArchivePosts(posts, "recaps")).toEqual([recap]);
    expect(filterArtArchivePosts(posts, "exhibitions")).toEqual([exhibition]);
    expect(filterArtArchivePosts(posts, "releases")).toEqual([release]);
  });

  it("supports shareable type-filter URLs and defaults safely", () => {
    expect(getArtArchiveFilter("?type=recaps")).toBe("recaps");
    expect(getArtArchiveFilter("?type=exhibitions")).toBe("exhibitions");
    expect(getArtArchiveFilter("?type=not-a-real-filter")).toBe("all");
  });

  it("keeps source-linked individual cards for artists and curators in current coverage", () => {
    expect(ART_ON_TEZOS_CONTRIBUTORS.map((contributor) => contributor.name)).toEqual(expect.arrayContaining(["Jonas Lund", "Yoshi Sodeoka", "Kat Zhang", "Micol"]));
    expect(ART_ON_TEZOS_CONTRIBUTORS.every((contributor) => contributor.sourceUrl.startsWith("https://"))).toBe(true);
  });
});
