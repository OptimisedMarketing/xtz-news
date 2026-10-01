// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ArticleFeaturedImageCredit from "./ArticleFeaturedImageCredit";

describe("ArticleFeaturedImageCredit", () => {
  it("renders a linked, clearly labelled source credit", () => {
    render(
      <ArticleFeaturedImageCredit
        credit="Art on Tezos / Museum of the Moving Image"
        sourceUrl="https://movingimage.org/event/responsive-signals/"
      />,
    );

    const link = screen.getByRole("link", { name: /image: art on tezos/i });
    expect(link.getAttribute("href")).toBe("https://movingimage.org/event/responsive-signals/");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("does not render an empty credit treatment", () => {
    const { container } = render(<ArticleFeaturedImageCredit />);
    expect(container.innerHTML).toBe("");
  });
});
