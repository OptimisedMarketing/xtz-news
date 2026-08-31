// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ArticleLanguageChooser from "./ArticleLanguageChooser";

describe("ArticleLanguageChooser", () => {
  it("renders only published translation choices supplied by the article query", () => {
    render(<ArticleLanguageChooser currentLocale="zh" translations={[
      { locale: "zh", slug: "story-zh" },
      { locale: "ko", slug: "story-ko" },
      { locale: "fr", slug: "story-fr" },
    ]} />);

    expect(screen.getByRole("navigation", { name: "Available article translations" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Read this article in 한국어" }).getAttribute("href")).toBe("/ko/story-ko");
    expect(screen.queryByRole("link", { name: "Read this article in 中文" })).toBeNull();
  });
});
