// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const queryState = vi.hoisted(() => ({
  data: [
    {
      id: 30001,
      title: "Terms of Agreement 🐳",
      description: "A Museum of the Moving Image commission.",
      startAt: new Date("2026-08-06T04:00:00.000Z"),
      endAt: new Date("2026-10-26T03:59:59.000Z"),
      location: "Museum of the Moving Image",
      timezone: "America/New_York",
      imageUrl: "/manus-storage/terms-of-agreement-momi-tezos_4ce5ed85.webp",
      imageAlt: "Installation view of Terms of Agreement",
      imageCredit: "Tezos / Museum of the Moving Image",
      speakers: ["Jonas Lund"],
      topics: ["Art on Tezos"],
      eventType: "exhibition",
      sourceUrl: "https://movingimage.org/event/terms-of-agreement/",
    },
    {
      id: 30004,
      title: "Quantum: An Existential Threat to Crypto?",
      description: "A TOKEN2049 panel.",
      startAt: new Date("2026-10-07T08:20:00.000Z"),
      endAt: new Date("2026-10-07T08:50:00.000Z"),
      location: "TOKEN2049 Singapore",
      timezone: "Asia/Singapore",
      imageUrl: "/manus-storage/token2049-quantum-panel-tezos_54c590ff.webp",
      imageAlt: "Official Tezos TOKEN2049 announcement graphic",
      imageCredit: "Tezos",
      speakers: ["Arthur Breitman"],
      topics: ["Post-Quantum"],
      eventType: "conference",
      sourceUrl: "https://www.token2049.com/singapore/agenda",
    },
  ],
  isLoading: false,
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    tezosEventCandidates: {
      published: { useQuery: () => queryState },
      create: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}));

import EventsPage from "./EventsPage";

describe("EventsPage event imagery", () => {
  it("renders credited event imagery through the same-origin media relay", () => {
    render(<EventsPage />);

    expect(screen.getByRole("img", { name: /installation view of terms of agreement/i }).getAttribute("src")).toBe("/media/terms-of-agreement-momi-tezos_4ce5ed85.webp");
    expect(screen.getByRole("img", { name: /official tezos token2049 announcement graphic/i }).getAttribute("src")).toBe("/media/token2049-quantum-panel-tezos_54c590ff.webp");
    expect(screen.getByText("Image: Tezos / Museum of the Moving Image")).toBeTruthy();
    expect(screen.getByText("Image: Tezos")).toBeTruthy();
  });
});
