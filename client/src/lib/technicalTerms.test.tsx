import { describe, expect, it } from "vitest";
import { annotateGaneshaTechnicalTerms } from "./technicalTerms";

describe("annotateGaneshaTechnicalTerms", () => {
  it("adds accessible definitions for EVM, Michelson, and NAC in the Ganesha article", () => {
    const annotated = annotateGaneshaTechnicalTerms("EVM-side gateway to Etherlink’s Michelson interface. NAC is Etherlink’s name. Tezos’ EVM-compatible execution layer adds a Michelson interface. Accounts are assigned a KT1 address and an account implementing EIP-1271.");
    expect(annotated).toContain('aria-label="EVM: Ethereum Virtual Machine');
    expect(annotated).toContain('aria-label="Michelson: Tezos’s smart-contract language');
    expect(annotated).toContain('aria-label="NAC: Native Atomic Composability');
    expect(annotated).toContain('aria-label="KT1 address: The address prefix');
    expect(annotated).toContain('aria-label="EIP-1271: An Ethereum standard');
    expect(annotated.match(/technical-term/g)?.length).toBeGreaterThanOrEqual(5);
  });
});
