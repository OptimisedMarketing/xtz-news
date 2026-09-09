/** @vitest-environment jsdom */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KentoSharePanel from "./KentoSharePanel";
import ArtExhibitionTimeline from "./ArtExhibitionTimeline";
import { ART_COLLECTION_FILTERS, ART_EXHIBITION_TIMELINE, ART_ON_TEZOS_FAQS, filterArtProjects, getArtProjectGroup, getTimelineStatus, getWeeklyHeroProject } from "@/pages/ArtOnTezosPage";

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

  it("rotates the curated hero by ISO week without a background process", () => {
    const projects = [{ slug: "objkt" }, { slug: "teia" }, { slug: "fxhash" }, { slug: "editart" }, { slug: "infiniteink" }];
    expect(getWeeklyHeroProject(projects, new Date("2026-01-05"))?.slug).toBe("teia");
    expect(getWeeklyHeroProject(projects, new Date("2026-01-12"))?.slug).toBe("fxhash");
  });

  it("keeps confirmed future, current, and historical exhibition dates distinct", () => {
    const onDate = new Date("2026-09-08T12:00:00Z");
    expect(getTimelineStatus(ART_EXHIBITION_TIMELINE.find((entry) => entry.id === "responsive-signals")!, onDate)).toBe("upcoming");
    expect(getTimelineStatus(ART_EXHIBITION_TIMELINE.find((entry) => entry.id === "terms-of-agreement")!, onDate)).toBe("current");
    expect(getTimelineStatus(ART_EXHIBITION_TIMELINE.find((entry) => entry.id === "404-land")!, onDate)).toBe("past");
  });

  it("offers a source-linked calendar download and quick preview for an upcoming exhibition", () => {
    render(<ArtExhibitionTimeline entries={[{ id: "future-art", title: "Future Tezos Art", startDate: "2030-09-22", endDate: "2030-09-22", location: "New York", description: "A confirmed programme.", sourceLabel: "Open source", sourceUrl: "https://movingimage.org/event/future-art" }]} />);
    const eventButton = screen.getByRole("button", { name: /future tezos art/i });
    fireEvent.focus(eventButton);
    expect(screen.getByRole("status", { name: /future tezos art quick preview/i })).toBeTruthy();
    const calendarLink = screen.getByRole("link", { name: /add to calendar/i });
    expect(calendarLink.getAttribute("href")).toContain("data:text/calendar");
    expect(calendarLink.getAttribute("download")).toBe("future-tezos-art.ics");
  });
});
