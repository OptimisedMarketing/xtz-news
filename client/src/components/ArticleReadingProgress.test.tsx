// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ArticleReadingProgress from "./ArticleReadingProgress";

describe("ArticleReadingProgress", () => {
  it("exposes the current reading percentage to assistive technology", () => {
    render(<ArticleReadingProgress progress={42.4} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("42");
    expect(screen.getByLabelText("Article reading progress: 42%")).toBeTruthy();
  });
});
