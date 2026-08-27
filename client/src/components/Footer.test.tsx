// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("wouter", () => ({
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

import Footer from "./Footer";

describe("Footer", () => {
  it("uses the relay-backed logo and offers a smooth back-to-top control", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(<Footer />);
    expect(screen.getByAltText("XTZ.News").getAttribute("src")).toBe("/media/xtz-logo-square_c6689606.png");
    fireEvent.click(screen.getByRole("button", { name: /back to the top/i }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    scrollTo.mockRestore();
  });

  it("acknowledges Optimised Marketing with a standard followable external link", () => {
    render(<Footer />);

    const credit = screen.getAllByRole("link", { name: "Built by Optimised Marketing" }).at(-1)!;
    expect(credit.getAttribute("href")).toBe("https://optimised.marketing");
    expect(credit.getAttribute("rel")).toBeNull();
  });
});
