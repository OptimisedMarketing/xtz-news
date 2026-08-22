type TechnicalTerm = {
  label: string;
  definition: string;
};

const terms = {
  EVM: {
    label: "EVM",
    definition: "Ethereum Virtual Machine: the Ethereum-compatible environment used to run smart contracts.",
  },
  Michelson: {
    label: "Michelson",
    definition: "Tezos’s smart-contract language and execution interface.",
  },
  NAC: {
    label: "NAC",
    definition: "Native Atomic Composability: cross-interface actions succeed together or revert together.",
  },
  EIP1271: {
    label: "EIP-1271",
    definition: "An Ethereum standard that lets a smart-contract account validate signatures.",
  },
  KT1: {
    label: "KT1 address",
    definition: "The address prefix used by originated Tezos smart contracts.",
  },
} satisfies Record<string, TechnicalTerm>;

function tooltip(term: TechnicalTerm) {
  return `<span class="technical-term" tabindex="0" role="term" aria-label="${term.label}: ${term.definition}"><span class="technical-term__label">${term.label}</span><span class="technical-term__tooltip" role="tooltip">${term.definition}</span></span>`;
}

/** Adds definitions only to the carefully-selected Ganesha editorial passages. */
export function annotateGaneshaTechnicalTerms(html: string) {
  return html
    .replace("EVM-side gateway to Etherlink’s Michelson interface", `${tooltip(terms.EVM)}-side gateway to Etherlink’s ${tooltip(terms.Michelson)} interface`)
    .replace("Native Atomic Composability, or NAC,", `Native Atomic Composability, or ${tooltip(terms.NAC)},`)
    .replace("NAC is Etherlink’s name", `${tooltip(terms.NAC)} is Etherlink’s name`)
    .replace("Tezos’ EVM-compatible execution layer", `Tezos’ ${tooltip(terms.EVM)}-compatible execution layer`)
    .replace("adds a Michelson interface", `adds a ${tooltip(terms.Michelson)} interface`)
    .replace("assigned a KT1 address", `assigned a ${tooltip(terms.KT1)}`)
    .replace("account implementing EIP-1271", `account implementing ${tooltip(terms.EIP1271)}`);
}

export { terms as technicalTerms };
