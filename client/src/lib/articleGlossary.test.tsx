// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { linkArticleGlossaryTerms } from "./articleGlossary";

describe("automatic article glossary links", () => {
  it("adds one accessible contextual link for recognised terms", () => {
    const output = linkArticleGlossaryTerms("<p>A tz1 account can delegate tez to a baker through Etherlink.</p>");

    expect(output).toContain('href="/glossary/tezos-prefixes#tz1"');
    expect(output).toContain('href="/staking/start"');
    expect(output).toContain('href="/wallets"');
    expect(output).toContain('data-glossary-definition="tz1 identifies a Tezos Ed25519 user-account family."');
    expect(output).toContain("Open the related XTZ.News guide.");
  });

  it("does not alter headings, code, existing links, or technical-term widgets", () => {
    const input = '<h2>Etherlink bridge</h2><p><a href="/source">KT1</a> <code>tz5</code> <span data-technical-term="EVM">EVM</span> and a tz1 address.</p>';
    const output = linkArticleGlossaryTerms(input);

    expect(output).toContain("<h2>Etherlink bridge</h2>");
    expect(output).toContain('<a href="/source">KT1</a>');
    expect(output).toContain("<code>tz5</code>");
    expect(output).toContain('data-technical-term="EVM"');
    expect(output).toContain('href="/glossary/tezos-prefixes#tz1"');
  });

  it("links Quantumnet's specialist terms to the visual glossary once per article", () => {
    const output = linkArticleGlossaryTerms("<p>ML-DSA-44, XMSS, STARK aggregation and ZODA are each being evaluated in Quantumnet.</p><p>XMSS appears again.</p>");

    expect(output).toContain('href="/post-quantum#pq-glossary-ml-dsa-44"');
    expect(output).toContain('href="/post-quantum#pq-glossary-xmss"');
    expect(output).toContain('href="/post-quantum#pq-glossary-stark-aggregation"');
    expect(output).toContain('href="/post-quantum#pq-glossary-zoda"');
    expect(output.match(/href="\/post-quantum#pq-glossary-xmss"/g)).toHaveLength(1);
    expect(output).toContain('data-glossary-definition="ML-DSA-44 is a NIST-standardised post-quantum digital-signature scheme used by tz5 testnet accounts."');
  });
});
