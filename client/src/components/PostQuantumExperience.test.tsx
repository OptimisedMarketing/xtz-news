// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PostQuantumTopicFilter from "./PostQuantumTopicFilter";
import Tz5WalletGuideLink from "./Tz5WalletGuideLink";
import Tz5WalletGuidePage from "@/pages/Tz5WalletGuidePage";

describe("post-quantum reader discovery", () => {
  it("provides a labelled sidebar filter for the post-quantum topic archive", () => {
    render(<PostQuantumTopicFilter />);
    expect(screen.getByRole("link", { name: "Browse post-quantum articles" }).getAttribute("href")).toBe("/tag/post-quantum");
  });

  it("links the news story to its plain-English tz5 wallet guide", () => {
    render(<Tz5WalletGuideLink />);
    expect(screen.getByRole("link", { name: /Read the tz5 wallet guide/i }).getAttribute("href")).toBe("/guides/tz5-wallet");
  });

  it("keeps the tz5 guide clear that the feature is not an ordinary Mainnet wallet product", () => {
    render(<Tz5WalletGuidePage />);
    expect(screen.getByText(/testing work, not an ordinary Mainnet wallet feature/i)).toBeTruthy();
    expect(screen.getByText(/Do not move real funds/i)).toBeTruthy();
    expect(screen.getByRole("heading", { name: /The short version/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /A safer way to approach future testing/i })).toBeTruthy();
    expect(screen.getByText(/It is an address type/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /Accounts and addresses/i }).getAttribute("href")).toBe("https://octez.tezos.com/docs/active/accounts.html");
  });
});
