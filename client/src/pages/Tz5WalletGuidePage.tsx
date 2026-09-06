import React from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, ExternalLink, FlaskConical, Home, KeyRound, ShieldCheck } from "lucide-react";
import { buildFAQSchema, useSEO } from "@/hooks/useSEO";

const sourceLinks = [
  { label: "Octez documentation — Accounts and addresses", href: "https://octez.tezos.com/docs/active/accounts.html" },
  { label: "Tezos Spotlight — Ushuaia is Live", href: "https://spotlight.tezos.com/ushuaia-is-live/" },
  { label: "Tezos Docs — Installing and funding a wallet", href: "https://docs.tezos.com/developing/wallet-setup" },
];

export default function Tz5WalletGuidePage() {
  useSEO({
    title: "tz5 Wallet Guide: Tezos Post-Quantum Accounts Explained | XTZ.News",
    description: "A plain-English guide to tz5, Tezos’ testnet-stage post-quantum account type: what it is, what it is not, and how to approach future testing safely.",
    keywords: "tz5 wallet, Tezos post-quantum, ML-DSA-44, Tezos testnet, Tezos wallet guide",
    canonical: "https://xtz.news/guides/tz5-wallet",
    jsonLd: [buildFAQSchema([
      { question: "What is a tz5 address?", answer: "A tz5 address identifies a Tezos account that uses the ML-DSA-44 signature scheme. It is part of Tezos post-quantum testing work." },
      { question: "Can I use tz5 for ordinary Mainnet funds?", answer: "No. The tz5 account feature is disabled by default on Tezos Mainnet. It is intended for testnet evaluation while compatible tools and protocol changes are tested." },
      { question: "Do I need to create a tz5 wallet now?", answer: "No. Ordinary holders do not need to take action. Wait for a public test network and a wallet’s own support guidance before attempting any testnet activity." },
    ])],
  });

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      <section style={{ background: "radial-gradient(circle at 75% 12%, rgba(102,82,220,0.28), transparent 34%), linear-gradient(135deg, #05152e, #071a35)", borderBottom: "1px solid rgba(44,125,247,0.22)", padding: "2.6rem 0 2.2rem" }}>
        <div className="container" style={{ maxWidth: "1000px" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.25rem", fontSize: "0.75rem" }}>
            <Link href="/" aria-label="XTZ.News home" style={{ color: "rgba(255,255,255,0.58)", display: "inline-flex" }}><Home size={13} /></Link>
            <ChevronRight size={12} aria-hidden="true" style={{ color: "rgba(255,255,255,0.35)" }} />
            <span style={{ color: "rgba(255,255,255,0.58)" }}>Guides</span>
            <ChevronRight size={12} aria-hidden="true" style={{ color: "rgba(255,255,255,0.35)" }} />
            <span aria-current="page" style={{ color: "#c4b5fd" }}>tz5 wallet guide</span>
          </nav>
          <div style={{ maxWidth: "720px" }}>
            <p style={{ margin: "0 0 0.65rem", color: "#b7a9ff", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>Plain-English guide</p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.07, letterSpacing: "-0.04em", margin: "0 0 0.85rem", maxWidth: "680px" }}>tz5 wallet guide: what Tezos’ post-quantum account type means</h1>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", maxWidth: "650px", fontSize: "1.03rem", lineHeight: 1.65 }}>A calm, practical explanation of what `tz5` is, what you can do today, and why it is important not to confuse early testnet work with a new Mainnet wallet product.</p>
          </div>
        </div>
      </section>

      <div className="container" style={{ maxWidth: "1000px", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <section aria-label="Important tz5 status" style={{ display: "flex", gap: "0.85rem", padding: "1rem 1.1rem", border: "1px solid rgba(245,158,11,0.38)", background: "rgba(245,158,11,0.09)", borderRadius: "9px", marginBottom: "2rem" }}>
          <FlaskConical aria-hidden="true" size={20} style={{ color: "#fbbf24", flexShrink: 0, marginTop: "0.1rem" }} />
          <div><strong style={{ display: "block", marginBottom: "0.2rem", color: "#fff" }}>Current status: testing work, not an ordinary Mainnet wallet feature.</strong><span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", lineHeight: 1.55 }}>The `tz5` account feature is disabled by default on Tezos Mainnet. Do not move real funds in expectation of using `tz5` today.</span></div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(245px, 0.38fr)", gap: "2rem", alignItems: "start" }} className="tz5-guide-grid">
          <article style={{ minWidth: 0 }}>
            <section aria-labelledby="tz5-meaning"><h2 id="tz5-meaning">What `tz5` means</h2><p>A Tezos account address normally begins with a prefix such as `tz1`. A `tz5` address identifies a different account family that uses ML-DSA-44 signatures. In plain English, it is one part of Tezos research into account security designed for a future where quantum computers may become far more capable.</p><p>It does not mean that today’s Tezos accounts are broken, or that every holder needs a replacement wallet. The work exists so wallets, custodians and protocol tooling can be tested well before any broader change would be needed.</p></section>
            <section aria-labelledby="tz5-today"><h2 id="tz5-today">What you should do today</h2><p>For most readers, the right action is simply to stay informed. Continue using your existing wallet as you normally would, and do not send real funds to an address or network solely because it refers to `tz5`.</p><p>If Tezos publishes a public test network and your wallet separately documents `tz5` support for that exact test network, use test funds only. Test tez has no Mainnet value. Follow the wallet’s own network instructions instead of importing recovery phrases into unfamiliar tools.</p></section>
            <section aria-labelledby="tz5-later"><h2 id="tz5-later">How to approach future testing</h2><ol><li>Check the official Tezos announcement for the named public test network.</li><li>Confirm that your chosen wallet explicitly supports `tz5` on that same network.</li><li>Create a separate test account and fund it only with test tez from the relevant faucet.</li><li>Keep recovery phrases, private keys and signing material private. No legitimate helper needs them.</li><li>Expect experimental features to change or fail; use testing feedback channels published by the project.</li></ol></section>
            <section aria-labelledby="tz5-article"><h2 id="tz5-article">Why this guide exists</h2><p>The first XTZ.News post-quantum report covers the planned previewnet and the wider protocol work around it. This guide is its practical companion: a short explanation of the account prefix without turning a developing technical feature into a promise of immediate wallet availability.</p><Link href="/tezos-post-quantum-previewnet-why-now" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem", color: "#86b8ff", fontWeight: 800, textDecoration: "none" }}>Read the post-quantum previewnet report <ArrowRight size={15} aria-hidden="true" /></Link></section>
          </article>
          <aside aria-label="tz5 guide supporting information" style={{ display: "grid", gap: "1rem" }}>
            <section style={{ padding: "1rem", background: "#05152e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}><ShieldCheck aria-hidden="true" size={19} style={{ color: "#66a9ff", marginBottom: "0.55rem" }} /><h2 style={{ margin: "0 0 0.45rem", fontSize: "0.9rem" }}>The short version</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.68)", fontSize: "0.8rem", lineHeight: 1.55 }}>`tz5` is a testnet-stage Tezos account type for post-quantum research. It is not a new wallet requirement for Mainnet holders.</p></section>
            <section style={{ padding: "1rem", background: "#05152e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}><KeyRound aria-hidden="true" size={19} style={{ color: "#c4b5fd", marginBottom: "0.55rem" }} /><h2 style={{ margin: "0 0 0.45rem", fontSize: "0.9rem" }}>Keep control</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.68)", fontSize: "0.8rem", lineHeight: 1.55 }}>Never share a recovery phrase or private key. When testing eventually opens, start with a separate test account and valueless test tez.</p></section>
            <section aria-labelledby="tz5-sources" style={{ padding: "1rem", background: "#05152e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}><h2 id="tz5-sources" style={{ margin: "0 0 0.65rem", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.48)" }}>Official reading</h2>{sourceLinks.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start", color: "#8bbaff", textDecoration: "none", fontSize: "0.75rem", lineHeight: 1.45, marginBottom: "0.6rem" }}><ExternalLink size={12} aria-hidden="true" style={{ flexShrink: 0, marginTop: "0.12rem" }} />{source.label}</a>)}</section>
          </aside>
        </div>
      </div>
    </main>
  );
}
