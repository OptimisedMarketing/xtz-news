// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const queryState = vi.hoisted(() => ({ data: [] as any[], isLoading: false }));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    tezosEventCandidates: {
      published: { useQuery: () => queryState },
    },
  },
}));

import NextTezosEventWidget from "./NextTezosEventWidget";

describe("NextTezosEventWidget", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-30T12:00:00.000Z"));
  });

  afterEach(() => vi.useRealTimers());

  it("shows the nearest future editor-published event with local and official links", () => {
    queryState.data = [
      { id: 1, title: "Current exhibition", startAt: new Date("2026-08-06T04:00:00.000Z"), endAt: new Date("2026-10-26T03:59:59.000Z"), location: "New York", sourceUrl: "https://example.com/current" },
      { id: 2, title: "Quantum: An Existential Threat to Crypto?", startAt: new Date("2026-10-07T08:20:00.000Z"), endAt: new Date("2026-10-07T08:50:00.000Z"), location: "BingX Labs Stage, TOKEN2049 Singapore", timezone: "Asia/Singapore", sourceUrl: "https://example.com/token2049" },
    ];

    render(<NextTezosEventWidget />);

    expect(screen.getByRole("complementary", { name: /next tezos event/i })).toBeTruthy();
    expect(screen.getByText("Quantum: An Existential Threat to Crypto?")).toBeTruthy();
    expect(screen.getByText(/7 Oct 2026.*16:20.*GMT\+8/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /view calendar/i }).getAttribute("href")).toBe("/events");
    expect(screen.getByRole("link", { name: /official listing/i }).getAttribute("href")).toBe("https://example.com/token2049");
  });

  it("offers the calendar when no current or future event has been published", () => {
    queryState.data = [];

    render(<NextTezosEventWidget />);

    expect(screen.getByText(/no upcoming event is currently published/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /browse events/i }).getAttribute("href")).toBe("/events");
  });
});
