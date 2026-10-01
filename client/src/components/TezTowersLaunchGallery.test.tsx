// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TezTowersLaunchGallery from "./TezTowersLaunchGallery";

describe("TezTowersLaunchGallery", () => {
  it("opens an enlarged, labelled visual and closes it with Escape", () => {
    render(<TezTowersLaunchGallery />);

    expect(screen.getByText("A compact look at TezTowers")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Enlarge Main St starts to fill" }));

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("link", { name: /TezTowers post — 30 September 2026/i }).getAttribute("href")).toBe("https://x.com/TezTowers/status/2105352862570365315");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
