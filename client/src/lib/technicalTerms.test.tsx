import { describe, expect, it } from "vitest";
import { annotateGaneshaTechnicalTerms } from "./technicalTerms";

describe("annotateGaneshaTechnicalTerms", () => {
  it("adds accessible definitions for EVM, Michelson, and NAC in the Ganesha article", () => {
    const annotated = annotateGaneshaTechnicalTerms("EVM-side gateway to Etherlink’s Michelson interface. NAC is Etherlink’s name. Tezos’ EVM-compatible execution layer adds a Michelson interface.");
    expect(annotated).toContain('aria-label="EVM: Ethereum Virtual Machine');
    expect(annotated).toContain('aria-label="Michelson: Tezos’s smart-contract language');
    expect(annotated).toContain('aria-label="NAC: Native Atomic Composability');
    expect(annotated.match(/technical-term/g)?.length).toBeGreaterThanOrEqual(3);
  });
});
