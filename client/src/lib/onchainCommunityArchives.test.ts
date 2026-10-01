import { describe, expect, it } from "vitest";
import {
  ONCHAIN_COMMUNITY_ARCHIVE_ARTICLE_SLUGS,
  ONCHAIN_COMMUNITY_ARCHIVE_PROJECT_SLUGS,
  selectOnchainArchiveArticles,
  selectOnchainArchiveProjects,
} from "./onchainCommunityArchives";

describe("Onchain Community Archives selections", () => {
  it("selects curated culture projects in an intentional profile order", () => {
    const selected = selectOnchainArchiveProjects([
      { slug: "objkt", title: "Objkt" },
      { slug: "unrelated", title: "Unrelated" },
      { slug: "the-wall-today", title: "THE WALL Today" },
      { slug: "teia", title: "Teia" },
    ]);

    expect(selected.map((project) => project.slug)).toEqual(["the-wall-today", "teia", "objkt"]);
    expect(ONCHAIN_COMMUNITY_ARCHIVE_PROJECT_SLUGS).toContain("kento");
  });

  it("selects archive coverage in the intended reading order", () => {
    const selected = selectOnchainArchiveArticles([
      { slug: "tezos-art-recap-responsive-signals-vienna-digital-works" },
      { slug: "other-story" },
      { slug: "the-wall-today-freezes-genesis-board-tezos-archive" },
    ]);

    expect(selected.map((article) => article.slug)).toEqual([
      "the-wall-today-freezes-genesis-board-tezos-archive",
      "tezos-art-recap-responsive-signals-vienna-digital-works",
    ]);
    expect(ONCHAIN_COMMUNITY_ARCHIVE_ARTICLE_SLUGS).toContain("kento-objkt-physical-digital-art-cards-kickstarter");
  });
});
