// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TezosResourceLinks } from "./TezosResourceLinks";

describe("TezosResourceLinks", () => {
  it("connects Tezos wallet readers to glossary, tz5 guide, and explorer paths", () => {
    render(<TezosResourceLinks context="wallet" />);

    expect(screen.getByRole("heading", { name: "Understand an address before you act" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Tezos address-prefix glossary/i }).getAttribute("href")).toBe("/glossary/tezos-prefixes");
    expect(screen.getByRole("link", { name: /tz5 wallet guide/i }).getAttribute("href")).toBe("/guides/tz5-wallet");
    expect(screen.getByRole("link", { name: /Tezos Explorer/i }).getAttribute("href")).toBe("/explorer");
  });

  it("keeps price-page resource links explanatory and non-advisory", () => {
    render(<TezosResourceLinks context="prices" />);

    expect(screen.getByText(/not personalised financial advice/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /Tezos staking calculator/i }).getAttribute("href")).toBe("/staking");
  });
});
