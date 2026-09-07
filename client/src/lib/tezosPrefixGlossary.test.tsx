import { describe, expect, it } from "vitest";
import { searchTezosPrefixes } from "./tezosPrefixGlossary";

describe("Tezos prefix glossary search", () => {
  it("finds post-quantum tz5 terminology and preserves its testnet-stage label", () => {
    const results = searchTezosPrefixes("quantum");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ prefix: "tz5", status: "Testnet stage" });
  });

  it("finds contract and rollup entries by their address prefix", () => {
    expect(searchTezosPrefixes("KT1")[0]).toMatchObject({ kind: "Smart contract" });
    expect(searchTezosPrefixes("sr1")[0]).toMatchObject({ kind: "Smart Rollup" });
  });
});
