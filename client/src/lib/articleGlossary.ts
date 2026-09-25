export type ArticleGlossaryTerm = {
  key: string;
  matcher: RegExp;
  definition: string;
  href: string;
};

export const ARTICLE_GLOSSARY_TERMS: ArticleGlossaryTerm[] = [
  { key: "ml-dsa-44", matcher: /\bML-DSA-44\b/gi, definition: "ML-DSA-44 is a NIST-standardised post-quantum digital-signature scheme used by tz5 testnet accounts.", href: "/post-quantum#pq-glossary-ml-dsa-44" },
  { key: "stark-aggregation", matcher: /\bSTARK aggregation\b/gi, definition: "STARK aggregation combines many attestations into a proof that can be checked together; Quantumnet is testing a post-quantum approach.", href: "/post-quantum#pq-glossary-stark-aggregation" },
  { key: "xmss", matcher: /\bXMSS\b/gi, definition: "XMSS is a hash-based digital-signature scheme that Quantumnet is testing for consensus attestations.", href: "/post-quantum#pq-glossary-xmss" },
  { key: "zoda", matcher: /\bZODA\b/gi, definition: "ZODA is a two-dimensional tensor-code data-availability approach being evaluated in Quantumnet.", href: "/post-quantum#pq-glossary-zoda" },
  { key: "smart-rollup", matcher: /\bSmart Rollups?\b/gi, definition: "A Tezos Smart Rollup is a layer 2 system with its own sr1 address and commitment tree.", href: "/glossary/tezos-prefixes#sr1" },
  { key: "etherlink", matcher: /\bEtherlink\b/gi, definition: "Etherlink is a Tezos execution layer with EVM and Michelson interfaces.", href: "/etherlink" },
  { key: "michelson", matcher: /\bMichelson\b/gi, definition: "Michelson is Tezos’ smart-contract language.", href: "/glossary/tezos-prefixes#kt1" },
  { key: "delegation", matcher: /\bdelegat(?:e|ed|ing|ion)\b/gi, definition: "Delegation assigns a baker to an account while keeping its tez liquid.", href: "/staking/start" },
  { key: "staking", matcher: /\bstak(?:e|ed|ing)\b/gi, definition: "Staking locks tez with a baker and has different liquidity and risk characteristics from delegation.", href: "/staking/start" },
  { key: "baker", matcher: /\bbakers?\b/gi, definition: "A baker is a Tezos validator that participates in block production and can receive delegation or stake.", href: "/staking/start" },
  { key: "wxtz", matcher: /\bWXTZ\b/gi, definition: "WXTZ is an ERC-20-compatible wrapped representation of XTZ for relevant Etherlink EVM applications.", href: "/etherlink" },
  { key: "kt1", matcher: /\bKT1\b/g, definition: "KT1 identifies an originated Tezos smart contract.", href: "/glossary/tezos-prefixes#kt1" },
  { key: "sr1", matcher: /\bsr1\b/gi, definition: "sr1 identifies a Tezos Smart Rollup address.", href: "/glossary/tezos-prefixes#sr1" },
  { key: "tz5", matcher: /\btz5\b/gi, definition: "tz5 is a testnet-stage post-quantum Tezos account family; it is not an ordinary Mainnet wallet migration.", href: "/guides/tz5-wallet" },
  { key: "tz4", matcher: /\btz4\b/gi, definition: "tz4 identifies a Tezos BLS user-account family.", href: "/glossary/tezos-prefixes#tz4" },
  { key: "tz3", matcher: /\btz3\b/gi, definition: "tz3 identifies a Tezos P-256 user-account family.", href: "/glossary/tezos-prefixes#tz3" },
  { key: "tz2", matcher: /\btz2\b/gi, definition: "tz2 identifies a Tezos Secp256k1 user-account family.", href: "/glossary/tezos-prefixes#tz2" },
  { key: "tz1", matcher: /\btz1\b/gi, definition: "tz1 identifies a Tezos Ed25519 user-account family.", href: "/glossary/tezos-prefixes#tz1" },
  { key: "xtz", matcher: /\bXTZ\b/g, definition: "XTZ is the native coin of the Tezos network.", href: "/wallets" },
  { key: "tez", matcher: /\btez\b/gi, definition: "Tez is the native coin used on the Tezos network.", href: "/wallets" },
];

const SKIP_SELECTOR = "a, code, pre, script, style, h1, h2, h3, h4, h5, h6, blockquote, [data-technical-term], [data-glossary-definition]";

function cloneMatcher(matcher: RegExp) {
  return new RegExp(matcher.source, matcher.flags.includes("g") ? matcher.flags : `${matcher.flags}g`);
}

function firstMatch(text: string, usedKeys: Set<string>) {
  let earliest: { term: ArticleGlossaryTerm; index: number; length: number; value: string } | null = null;
  for (const term of ARTICLE_GLOSSARY_TERMS) {
    if (usedKeys.has(term.key)) continue;
    const matcher = cloneMatcher(term.matcher);
    const match = matcher.exec(text);
    if (!match || match.index === undefined) continue;
    if (!earliest || match.index < earliest.index || (match.index === earliest.index && match[0].length > earliest.length)) {
      earliest = { term, index: match.index, length: match[0].length, value: match[0] };
    }
  }
  return earliest;
}

/**
 * Adds one contextual definition for each supported term in article body text.
 * It deliberately avoids headings, existing links, code and custom article widgets.
 */
export function linkArticleGlossaryTerms(html: string): string {
  if (!html || typeof DOMParser === "undefined") return html;

  const document = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) textNodes.push(node as Text);

  const usedKeys = new Set<string>();
  for (const textNode of textNodes) {
    const parent = textNode.parentElement;
    if (!parent || parent.closest(SKIP_SELECTOR) || !textNode.textContent?.trim()) continue;

    const original = textNode.textContent;
    let cursor = 0;
    let remainder = original;
    const fragment = document.createDocumentFragment();
    let match = firstMatch(remainder, usedKeys);
    if (!match) continue;

    while (match) {
      if (match.index > 0) fragment.append(document.createTextNode(remainder.slice(0, match.index)));
      const anchor = document.createElement("a");
      anchor.className = "article-glossary-term";
      anchor.href = match.term.href;
      anchor.dataset.glossaryDefinition = match.term.definition;
      anchor.setAttribute("aria-label", `${match.value}: ${match.term.definition} Open the related XTZ.News guide.`);
      anchor.textContent = match.value;
      fragment.append(anchor);
      usedKeys.add(match.term.key);
      cursor = match.index + match.length;
      remainder = remainder.slice(cursor);
      match = firstMatch(remainder, usedKeys);
    }
    if (remainder) fragment.append(document.createTextNode(remainder));
    textNode.replaceWith(fragment);
  }

  return document.body.innerHTML;
}
