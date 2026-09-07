/** @vitest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KentoSharePanel from "./KentoSharePanel";
import { ART_ON_TEZOS_FAQS } from "@/pages/ArtOnTezosPage";

describe("Art on Tezos discovery", () => {
  it("keeps the collection hub FAQ reader-safe and non-endorsement based", () => {
    expect(ART_ON_TEZOS_FAQS.map((faq) => faq.question)).toContain("Does XTZ.News endorse the listed art projects or collections?");
  });

  it("renders campaign sharing actions for Kento without a posting side effect", () => {
    render(<KentoSharePanel contentType="article" title="Kento campaign" url="https://xtz.news/kento-story" />);
    expect(screen.getByRole("link", { name: "Share this Kento campaign story on X" }).getAttribute("href")).toContain("twitter.com/intent/tweet");
    expect(screen.getByRole("link", { name: "Share this Kento campaign story on LinkedIn" }).getAttribute("href")).toContain("linkedin.com/sharing");
  });
});
