// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TezOracleProjectLink from "./TezOracleProjectLink";
import TezOracleSharePanel from "./TezOracleSharePanel";
import TezOracleStatusPanel from "./TezOracleStatusPanel";

describe("TezOracle reader discovery and status", () => {
  it("links the article reader directly to the TezOracle project profile", () => {
    render(<TezOracleProjectLink />);
    expect(screen.getByRole("link", { name: "Open the TezOracle project profile" }).getAttribute("href")).toBe("/projects/tezoracle");
  });

  it("provides labelled X and LinkedIn sharing actions for TezOracle coverage", () => {
    render(<TezOracleSharePanel contentType="article" title="TezOracle update" url="https://xtz.news/tezoracle" />);
    expect(screen.getByRole("link", { name: "Share TezOracle news on X" }).getAttribute("href")).toContain("twitter.com/intent/tweet");
    expect(screen.getByRole("link", { name: "Share TezOracle news on LinkedIn" }).getAttribute("href")).toContain("linkedin.com/sharing");
  });

  it("states clearly when official addresses have not been published", () => {
    render(<TezOracleStatusPanel status={{ sourceUrl: "https://tezoracle.com/", architectureStatus: "Defined", implementationStatus: "Next", testnetStatus: "Planned", productionStatus: "Gated", contractAddresses: [], sourceCheckedAt: "2026-08-31T20:00:00.000Z" }} />);
    expect(screen.getByText("No official testnet or production contract addresses have been published yet.")).toBeTruthy();
    expect(screen.getByText("Planned")).toBeTruthy();
  });
});
