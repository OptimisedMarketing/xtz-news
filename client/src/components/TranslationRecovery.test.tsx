// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TranslationRecovery from "./TranslationRecovery";

describe("TranslationRecovery", () => {
  it("gives an unavailable reader a source story, edition, and genuine alternatives", () => {
    render(<TranslationRecovery locale="zh" source={{ title: "A Tezos update", slug: "tezos-update" }} translations={[
      { locale: "ko", slug: "tezos-update-ko" },
      { locale: "zh", slug: "tezos-update-zh" },
    ]} />);

    expect(screen.getByRole("heading", { name: "Not yet available in 中文" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Read the English original" }).getAttribute("href")).toBe("/tezos-update");
    expect(screen.getByRole("link", { name: "Browse the 中文 edition →" }).getAttribute("href")).toBe("/zh");
    expect(screen.getByRole("link", { name: "Read this article in 한국어" }).getAttribute("href")).toBe("/ko/tezos-update-ko");
  });
});
