import React from "react";
import { ArrowRight, BookOpen, Compass, ShieldCheck, WalletCards } from "lucide-react";
import { Link } from "wouter";

type ResourceContext = "wallet" | "staking" | "prices" | "explorer";

const resourceSets: Record<ResourceContext, {
  eyebrow: string;
  title: string;
  description: string;
  links: { title: string; copy: string; href: string; icon: "wallet" | "book" | "compass" | "shield" }[];
}> = {
  wallet: {
    eyebrow: "Tezos wallet help",
    title: "Understand an address before you act",
    description: "Use this read-only inspector for public on-chain information, then explore the account-prefix guide or current testnet-stage tz5 research.",
    links: [
      { title: "Tezos address-prefix glossary", copy: "Learn what tz1–tz5, KT1, and sr1 identify.", href: "/glossary/tezos-prefixes", icon: "book" },
      { title: "tz5 wallet guide", copy: "Plain-English post-quantum account context, with testnet-stage safeguards.", href: "/guides/tz5-wallet", icon: "shield" },
      { title: "Tezos Explorer", copy: "Search blocks, operations, bakers, and public chain activity.", href: "/explorer", icon: "compass" },
    ],
  },
  staking: {
    eyebrow: "Tezos staking help",
    title: "Explore rewards with the right context",
    description: "Compare public baker information here, then inspect a wallet address or review the rewards history tool before making your own decision.",
    links: [
      { title: "Tezos rewards history", copy: "Review baker and delegator reward history by address.", href: "/tools/rewards", icon: "compass" },
      { title: "Tezos Wallet Inspector", copy: "Check public delegation and account activity without connecting a wallet.", href: "/tools/wallet", icon: "wallet" },
      { title: "Tezos address-prefix glossary", copy: "Understand the account and contract prefixes you see on-chain.", href: "/glossary/tezos-prefixes", icon: "book" },
    ],
  },
  prices: {
    eyebrow: "Tezos market context",
    title: "Go beyond the price screen",
    description: "Use live token data alongside source-led Tezos news and practical tools. Market information is not personalised financial advice.",
    links: [
      { title: "Tezos staking calculator", copy: "Explore public baker and rewards data in a separate tool.", href: "/staking", icon: "compass" },
      { title: "Tezos Explorer", copy: "Check public network activity, blocks, transactions, and bakers.", href: "/explorer", icon: "compass" },
      { title: "Tezos Wallet Inspector", copy: "Understand a public address, tokens, delegation, and activity.", href: "/tools/wallet", icon: "wallet" },
    ],
  },
  explorer: {
    eyebrow: "Tezos explorer help",
    title: "Know what you are looking at",
    description: "Search public chain data here, then use the address glossary or wallet inspector for a clearer explanation of Tezos account information.",
    links: [
      { title: "Tezos Wallet Inspector", copy: "View public balances, delegation, tokens, and activity for an address.", href: "/tools/wallet", icon: "wallet" },
      { title: "Tezos address-prefix glossary", copy: "A plain-English reference for tz1–tz5, KT1, and sr1.", href: "/glossary/tezos-prefixes", icon: "book" },
      { title: "Tezos staking calculator", copy: "Review baker and reward context from the staking tool.", href: "/staking", icon: "shield" },
    ],
  },
};

const icons = {
  wallet: WalletCards,
  book: BookOpen,
  compass: Compass,
  shield: ShieldCheck,
};

export function TezosResourceLinks({ context }: { context: ResourceContext }) {
  const set = resourceSets[context];

  return (
    <section aria-labelledby={`tezos-learning-${context}`} style={{ marginTop: "2rem", padding: "1.25rem", borderRadius: "14px", border: "1px solid rgba(44,125,247,0.22)", background: "linear-gradient(135deg, rgba(5,21,46,0.96), rgba(13,42,94,0.62))" }}>
      <p style={{ margin: 0, color: "#68a4ff", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>{set.eyebrow}</p>
      <h2 id={`tezos-learning-${context}`} style={{ margin: "0.35rem 0 0", color: "#fff", fontSize: "1.25rem", fontWeight: 900 }}>{set.title}</h2>
      <p style={{ margin: "0.5rem 0 1rem", color: "rgba(255,255,255,0.62)", fontSize: "0.88rem", lineHeight: 1.6, maxWidth: "72ch" }}>{set.description}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.7rem" }}>
        {set.links.map((item) => {
          const Icon = icons[item.icon];
          return (
            <Link key={item.href} href={item.href} aria-label={`${item.title}: ${item.copy}`} style={{ display: "block", padding: "0.9rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "inherit", textDecoration: "none" }}>
              <Icon size={17} style={{ color: "#68a4ff", marginBottom: "0.55rem" }} aria-hidden="true" />
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#fff", fontWeight: 800, fontSize: "0.84rem" }}>{item.title} <ArrowRight size={13} aria-hidden="true" /></span>
              <span style={{ display: "block", marginTop: "0.35rem", color: "rgba(255,255,255,0.5)", fontSize: "0.74rem", lineHeight: 1.45 }}>{item.copy}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
