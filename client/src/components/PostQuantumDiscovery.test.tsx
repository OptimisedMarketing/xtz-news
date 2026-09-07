// @vitest-environment jsdom

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PostQuantumHomepageFeature from "./PostQuantumHomepageFeature";
import TezosPrefixGlossaryPage from "@/pages/TezosPrefixGlossaryPage";

describe("post-quantum discovery surfaces", () => {
  it("features the tz5 guide on the homepage with clear testnet-stage context", () => {
    render(<PostQuantumHomepageFeature />);
    expect(screen.getByRole("heading", { name: /Understand tz5 before you encounter it/i })).toBeTruthy();
    expect(screen.getByText(/Testnet-stage research/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /Read the tz5 wallet guide/i }).getAttribute("href")).toBe("/guides/tz5-wallet");
  });

  it("provides a searchable Tezos-prefix glossary with core address families", () => {
    render(<TezosPrefixGlossaryPage />);
    const search = screen.getByRole("searchbox", { name: /Search terms, prefixes/i });
    expect(search).toBeTruthy();
    expect(screen.getByText("ML-DSA-44 post-quantum account")).toBeTruthy();
    expect(screen.getByText("Originated smart contract")).toBeTruthy();

    fireEvent.change(search, { target: { value: "rollup" } });
    expect(screen.getByText("Smart Rollup address")).toBeTruthy();
    expect(screen.queryByText("Ed25519 user account")).toBeNull();
  });
});
