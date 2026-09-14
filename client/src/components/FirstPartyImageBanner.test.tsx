// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import FirstPartyImageBanner from "./FirstPartyImageBanner";

describe("FirstPartyImageBanner", () => {
  afterEach(() => cleanup());

  it("renders a clearly labelled, accessible first-party Optimised Marketing link", () => {
    render(<FirstPartyImageBanner placement="home" />);
    expect(screen.getByText("From our network")).toBeTruthy();
    const link = screen.getByRole("link", { name: /visit optimised marketing/i });
    expect(link.getAttribute("href")).toBe("https://optimised.marketing");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(screen.getByAltText(/proudly building and supporting xtz.news/i)).toBeTruthy();
  });

  it("supports the compact article placement", () => {
    render(<FirstPartyImageBanner placement="article" />);
    expect(screen.getByLabelText("First-party promotion for Optimised Marketing")).toBeTruthy();
  });
});
