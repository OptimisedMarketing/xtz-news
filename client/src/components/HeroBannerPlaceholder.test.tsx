// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroBannerPlaceholder from "./HeroBannerPlaceholder";

describe("HeroBannerPlaceholder", () => {
  it("labels the reserved hero banner as a first-party advertising placeholder", () => {
    render(<HeroBannerPlaceholder />);
    expect(screen.getByLabelText("Hero banner advertising placeholder")).toBeTruthy();
    expect(screen.getByText("Hero banner reserved for your next owner-run app")).toBeTruthy();
    expect(screen.getByText(/970 × 90 desktop and 320 × 100 mobile/i)).toBeTruthy();
  });
});
