// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EventCalendarSubscription from "./EventCalendarSubscription";

describe("EventCalendarSubscription", () => {
  it("offers a webcal subscription and a visible standards feed fallback", () => {
    render(<EventCalendarSubscription />);

    expect(screen.getByRole("heading", { name: /subscribe to upcoming tezos events/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /^subscribe$/i }).getAttribute("href")).toBe("webcal://xtz.news/events.ics");
    expect(screen.getByRole("link", { name: /open \.ics feed/i }).getAttribute("href")).toBe("https://xtz.news/events.ics");
  });
});
