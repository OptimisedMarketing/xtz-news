// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KentoArtistDirectory from "./KentoArtistDirectory";

describe("KentoArtistDirectory", () => {
  it("filters the Season 01 roster to direct Objkt profiles and supports name search", () => {
    render(<KentoArtistDirectory />);

    expect(screen.getByText("Showing 40 artists")).toBeTruthy();
    expect(screen.getByRole("link", { name: /ADHD.*verified Objkt profile/i }).getAttribute("href")).toBe("https://objkt.com/@adhd");
    expect(screen.getByRole("link", { name: /Amber Vittoria.*official Kento artist page/i }).getAttribute("href")).toBe("https://kento.art/artists/amber-vittoria/");

    fireEvent.click(screen.getByRole("button", { name: /verified objkt/i }));
    expect(screen.getByText("Showing 36 artists")).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Amber Vittoria/i })).toBeNull();

    fireEvent.change(screen.getByRole("searchbox", { name: /search kento season 01 artists/i }), { target: { value: "zancan" } });
    expect(screen.getByText("Showing 1 artist")).toBeTruthy();
    expect(screen.getByRole("link", { name: /zancan.*verified Objkt profile/i }).getAttribute("href")).toBe("https://objkt.com/@zancan");
  });
});
