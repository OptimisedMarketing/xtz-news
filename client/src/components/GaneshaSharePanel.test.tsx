// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GaneshaSharePanel from "./GaneshaSharePanel";

describe("Ganesha share panel", () => {
  it("provides labelled X and LinkedIn sharing links for the Ganesha story", () => {
    render(<GaneshaSharePanel title="Ganesha gateway" url="https://xtz.news/ganesha" />);

    expect(screen.getByRole("link", { name: "Share Ganesha news on X" }).getAttribute("href")).toContain("twitter.com/intent/tweet");
    expect(screen.getByRole("link", { name: "Share Ganesha news on LinkedIn" }).getAttribute("href")).toContain("linkedin.com/sharing");
  });
});
