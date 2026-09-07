export type TezosPrefixGlossaryEntry = {
  prefix: string;
  title: string;
  kind: "User account" | "Smart contract" | "Smart Rollup";
  status: "Established" | "Testnet stage";
  summary: string;
  detail: string;
  searchTerms: string[];
};

export const TEZOS_PREFIX_GLOSSARY: TezosPrefixGlossaryEntry[] = [
  {
    prefix: "tz1",
    title: "Ed25519 user account",
    kind: "User account",
    status: "Established",
    summary: "The familiar Tezos account family many wallet users recognise.",
    detail: "tz1 addresses are hashes of Ed25519 public keys. Octez uses this as its default key scheme when generating key pairs.",
    searchTerms: ["ed25519", "eddsa", "wallet", "implicit account", "user account"],
  },
  {
    prefix: "tz2",
    title: "Secp256k1 user account",
    kind: "User account",
    status: "Established",
    summary: "A Tezos account family using the Secp256k1 signing scheme.",
    detail: "tz2 addresses are hashes of Secp256k1 public keys and use ECDSA signatures.",
    searchTerms: ["secp256k1", "ecdsa", "wallet", "implicit account", "user account"],
  },
  {
    prefix: "tz3",
    title: "P-256 user account",
    kind: "User account",
    status: "Established",
    summary: "A Tezos account family using the P-256 signing scheme.",
    detail: "tz3 addresses are hashes of P-256 public keys and use ECDSA signatures.",
    searchTerms: ["p-256", "secp256r1", "ecdsa", "hsm", "wallet", "implicit account"],
  },
  {
    prefix: "tz4",
    title: "BLS user account",
    kind: "User account",
    status: "Established",
    summary: "A Tezos account family using BLS12-381 signatures, including specialised consensus use.",
    detail: "BLS signatures can be aggregated, helping reduce signature overhead in certain protocol operations.",
    searchTerms: ["bls", "bls12-381", "aggregation", "baker", "consensus", "multisig"],
  },
  {
    prefix: "tz5",
    title: "ML-DSA-44 post-quantum account",
    kind: "User account",
    status: "Testnet stage",
    summary: "A Tezos account family being evaluated for post-quantum security research.",
    detail: "tz5 addresses use ML-DSA-44. The feature is disabled by default on Tezos Mainnet and is intended for enabled testing networks.",
    searchTerms: ["ml-dsa-44", "post quantum", "quantum", "testnet", "wallet", "research"],
  },
  {
    prefix: "KT1",
    title: "Originated smart contract",
    kind: "Smart contract",
    status: "Established",
    summary: "The address prefix for a programmable Tezos smart contract.",
    detail: "KT1 accounts hold Michelson code, mutable storage, tez, and tickets. They are created through an origination operation.",
    searchTerms: ["contract", "michelson", "originated account", "dapp", "storage"],
  },
  {
    prefix: "sr1",
    title: "Smart Rollup address",
    kind: "Smart Rollup",
    status: "Established",
    summary: "The address prefix for a Tezos Smart Rollup.",
    detail: "Smart Rollups have their own address and commitment tree; they are not user accounts that hold tez.",
    searchTerms: ["smart rollup", "rollup", "commitments", "layer 2", "etherlink"],
  },
];

export function searchTezosPrefixes(query: string) {
  const normalised = query.trim().toLowerCase();
  if (!normalised) return TEZOS_PREFIX_GLOSSARY;
  return TEZOS_PREFIX_GLOSSARY.filter((entry) => [
    entry.prefix,
    entry.title,
    entry.kind,
    entry.status,
    entry.summary,
    entry.detail,
    ...entry.searchTerms,
  ].join(" ").toLowerCase().includes(normalised));
}
