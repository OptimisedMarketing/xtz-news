// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import FirstPartyPromotion from "./FirstPartyPromotion";

vi.mock("@/lib/trpc", () => ({ trpc: { settings: { getFirstPartyPromotions: { useQuery: () => ({ data: [{ id: "owner-app", title: "Owner app", description: "A factual first-party placement.", url: "https://example.com", ctaLabel: "Open", active: true, placeholder: false }, { id: "placeholder", title: "Your next app", description: "Reserved owner space.", url: "", ctaLabel: "Reserved", active: true, placeholder: true }] }) } } } }));

describe("FirstPartyPromotion", () => {
  it("labels first-party promotion and exposes rotation controls for multiple owner placements", () => {
    render(<FirstPartyPromotion />);
    expect(screen.getByText("From our network")).toBeTruthy();
    expect(screen.getByLabelText("Promotion rotation")).toBeTruthy();
    expect(screen.getByRole("link", { name: /owner app/i }).getAttribute("href")).toBe("https://example.com");
  });
});
