// @vitest-environment jsdom

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WalletStarterHomepageFeature from "./WalletStarterHomepageFeature";
import { ETHERLINK_BRIDGE_FAQS } from "@/pages/EtherlinkBridgeGuidePage";
import { WALLET_STARTER_FAQS } from "@/pages/TezosWalletStarterPage";

describe("evergreen guide hubs", () => {
  it("features the Tezos wallet starter on the homepage", () => {
    render(<WalletStarterHomepageFeature />);

    expect(screen.getByRole("heading", { name: /New to Tezos\? Start with a calm wallet guide/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Open the Tezos wallet starter guide/i }).getAttribute("href")).toBe("/wallets");
  });

  it("keeps bridge and wallet guide FAQ content grounded in practical reader questions", () => {
    expect(ETHERLINK_BRIDGE_FAQS.map((faq) => faq.question)).toEqual(expect.arrayContaining([
      "What does bridging XTZ to Etherlink mean?",
      "How long does an Etherlink bridge transfer take?",
    ]));
    expect(WALLET_STARTER_FAQS.map((faq) => faq.question)).toEqual(expect.arrayContaining([
      "What is a Tezos wallet?",
      "What is the difference between tz1 and KT1?",
    ]));
  });
});
