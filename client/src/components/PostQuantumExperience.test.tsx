// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PostQuantumTopicFilter from "./PostQuantumTopicFilter";
import Tz5WalletGuideLink from "./Tz5WalletGuideLink";
import Tz5WalletGuidePage from "@/pages/Tz5WalletGuidePage";
import ToolsPage from "@/pages/tools/ToolsPage";
import { POST_QUANTUM_FEATURED_RESOURCES, POST_QUANTUM_VISUAL_GLOSSARY } from "@/pages/PostQuantumPage";

describe("post-quantum reader discovery", () => {
  it("provides a labelled sidebar filter for the post-quantum topic archive", () => {
    render(<PostQuantumTopicFilter />);
    expect(screen.getByRole("link", { name: "Browse post-quantum articles" }).getAttribute("href")).toBe("/tag/post-quantum");
  });

  it("links the news story to its plain-English tz5 wallet guide", () => {
    render(<Tz5WalletGuideLink />);
    expect(screen.getByRole("link", { name: /Read the tz5 wallet guide/i }).getAttribute("href")).toBe("/guides/tz5-wallet");
  });

  it("features the tz5 wallet guide prominently in the main Tools hub", () => {
    const { container } = render(<ToolsPage />);
    expect(screen.getByRole("heading", { name: "tz5 wallet guide" })).toBeTruthy();
    expect(container.querySelector('a[aria-label="Read the tz5 wallet guide"]')?.getAttribute("href")).toBe("/guides/tz5-wallet");
  });

  it("features the published Quantumnet reporting in the post-quantum resource collection", () => {
    expect(POST_QUANTUM_FEATURED_RESOURCES).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: "Quantumnet: experimental testnet",
        href: "/quantumnet-live-tezos-experimental-post-quantum-testnet",
        label: "Read the Quantumnet story",
      }),
    ]));
  });

  it("explains Quantumnet's key post-quantum terms in a source-linked visual glossary", () => {
    expect(POST_QUANTUM_VISUAL_GLOSSARY.map((item) => item.term)).toEqual([
      "ML-DSA-44",
      "XMSS",
      "STARK aggregation",
      "ZODA",
    ]);
    expect(POST_QUANTUM_VISUAL_GLOSSARY).toEqual(expect.arrayContaining([
      expect.objectContaining({ term: "ML-DSA-44", sourceHref: "https://csrc.nist.gov/pubs/fips/204/final" }),
      expect.objectContaining({ term: "XMSS", sourceHref: "https://www.rfc-editor.org/rfc/rfc8391" }),
      expect.objectContaining({ term: "ZODA", sourceHref: "https://spotlight.tezos.com/introducing-quantumnet/" }),
    ]));
  });

  it("keeps the tz5 guide clear that the feature is not an ordinary Mainnet wallet product", () => {
    render(<Tz5WalletGuidePage />);
    expect(screen.getByText(/testing work, not an ordinary Mainnet wallet feature/i)).toBeTruthy();
    expect(screen.getByText(/Do not move real funds/i)).toBeTruthy();
    expect(screen.getByRole("heading", { name: /The short version/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /A safer way to approach future testing/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /From tz1 to tz5, at a glance/i })).toBeTruthy();
    expect(screen.getByText(/It is an address type/i)).toBeTruthy();
    expect(screen.getByText(/different cryptographic account families/i)).toBeTruthy();
    expect(screen.getByText("ML-DSA-44")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Accounts and addresses/i }).getAttribute("href")).toBe("https://octez.tezos.com/docs/active/accounts.html");
  });
});
