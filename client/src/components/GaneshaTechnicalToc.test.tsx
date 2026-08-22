// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GaneshaTechnicalToc from "./GaneshaTechnicalToc";

describe("Ganesha technical table of contents", () => {
  it("exposes in-page navigation for each technical section", () => {
    render(<GaneshaTechnicalToc />);
    expect(screen.getByRole("link", { name: "Two interfaces, one ledger" }).getAttribute("href")).toBe("#ganesha-interfaces");
    expect(screen.getByRole("link", { name: "What NAC changes" }).getAttribute("href")).toBe("#ganesha-nac");
    expect(screen.getByRole("link", { name: "A foundation for Tezos X" }).getAttribute("href")).toBe("#ganesha-tezos-x");
  });
});
