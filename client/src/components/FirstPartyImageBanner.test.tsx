// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FirstPartyImageBannerPresentation } from "./FirstPartyImageBanner";

describe("FirstPartyImageBanner", () => {
  afterEach(() => cleanup());

  it("renders a clearly labelled, accessible first-party Optimised Marketing link", () => {
    render(<FirstPartyImageBannerPresentation placement="home" campaign={{ active: true, endAt: null }} now={Date.now()} />);
    expect(screen.getByText("From our network")).toBeTruthy();
    const link = screen.getByRole("link", { name: /visit optimised marketing/i });
    expect(link.getAttribute("href")).toBe("https://optimised.marketing");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(screen.getByAltText(/proudly building and supporting xtz.news/i)).toBeTruthy();
  });

  it("supports the compact article placement", () => {
    render(<FirstPartyImageBannerPresentation placement="article" campaign={{ active: true, endAt: null }} now={Date.now()} />);
    expect(screen.getByLabelText("First-party promotion for Optimised Marketing")).toBeTruthy();
  });

  it("hides an expired or disabled campaign automatically", () => {
    const { rerender } = render(<FirstPartyImageBannerPresentation placement="home" campaign={{ active: true, endAt: "2026-09-14T10:00:00.000Z" }} now={Date.parse("2026-09-14T10:01:00.000Z")} />);
    expect(screen.queryByLabelText("First-party promotion for Optimised Marketing")).toBeNull();
    rerender(<FirstPartyImageBannerPresentation placement="home" campaign={{ active: false, endAt: null }} now={Date.now()} />);
    expect(screen.queryByLabelText("First-party promotion for Optimised Marketing")).toBeNull();
  });
});
