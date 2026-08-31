// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import TezosSystemsNetworkPulse, { TEZOS_SYSTEMS_PULSE_LINKS } from "./TezosSystemsNetworkPulse";

afterEach(cleanup);

describe("TezosSystemsNetworkPulse", () => {
  it("attributes the live destinations to Tezos Systems", () => {
    render(<TezosSystemsNetworkPulse />);

    expect(screen.getByRole("heading", { name: "Tezos Network Pulse" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Explore Tezos Systems live dashboard/i }).getAttribute("href")).toBe("https://tezos.systems/");
  });

  it("exposes all four official destination links", () => {
    render(<TezosSystemsNetworkPulse />);

    TEZOS_SYSTEMS_PULSE_LINKS.forEach(({ label, href }) => {
      expect(screen.getByRole("link", { name: new RegExp(label, "i") }).getAttribute("href")).toBe(href);
    });
  });
});
