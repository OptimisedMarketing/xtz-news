/** @vitest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KentoSharePanel from "./KentoSharePanel";
import { ART_COLLECTION_FILTERS, ART_ON_TEZOS_FAQS, filterArtProjects, getArtProjectGroup } from "@/pages/ArtOnTezosPage";

describe("Art on Tezos discovery", () => {
  it("keeps the collection hub FAQ reader-safe and non-endorsement based", () => {
    expect(ART_ON_TEZOS_FAQS.map((faq) => faq.question)).toContain("Does XTZ.News endorse the listed art projects or collections?");
  });

  it("renders campaign sharing actions for Kento without a posting side effect", () => {
    render(<KentoSharePanel contentType="article" title="Kento campaign" url="https://xtz.news/kento-story" />);
    expect(screen.getByRole("link", { name: "Share this Kento campaign story on X" }).getAttribute("href")).toContain("twitter.com/intent/tweet");
    expect(screen.getByRole("link", { name: "Share this Kento campaign story on LinkedIn" }).getAttribute("href")).toContain("linkedin.com/sharing");
  });

  it("keeps the exhibition, marketplace, and creator-tool collection filters available", () => {
    expect(ART_COLLECTION_FILTERS.map((filter) => filter.label)).toEqual(expect.arrayContaining(["Exhibitions", "Marketplaces", "Creator tools"]));
    expect(getArtProjectGroup({ slug: "hek-tezos-digital-art" })).toBe("exhibition");
    expect(getArtProjectGroup({ slug: "teia" })).toBe("marketplace");
    expect(getArtProjectGroup({ slug: "infiniteink" })).toBe("creator_tool");
  });

  it("returns only the selected curated project group", () => {
    const projects = [{ slug: "hek-tezos-digital-art" }, { slug: "teia" }, { slug: "infiniteink" }, { slug: "kento" }];
    expect(filterArtProjects(projects, "exhibition")).toEqual([{ slug: "hek-tezos-digital-art" }]);
    expect(filterArtProjects(projects, "marketplace")).toEqual([{ slug: "teia" }]);
    expect(filterArtProjects(projects, "creator_tool")).toEqual([{ slug: "infiniteink" }]);
  });
});
