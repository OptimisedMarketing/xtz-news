import React from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Compass, ExternalLink, KeyRound, ShieldCheck, WalletCards } from "lucide-react";
import { buildFAQSchema, buildWebPageSchema, useSEO } from "@/hooks/useSEO";

export const WALLET_STARTER_FAQS = [
  { question: "What is a Tezos wallet?", answer: "A Tezos wallet is an application that maintains your account and signs Tezos transactions on your behalf. Wallets allow dApp interaction without exposing the account private key." },
  { question: "Which Tezos wallet should I use?", answer: "Wallet choice depends on your needs and preferred form factor. Consult the current official Tezos wallet documentation and each wallet provider’s own information before installing or using a wallet." },
  { question: "What is the difference between tz1 and KT1?", answer: "Tezos user accounts can use prefixes such as tz1, tz2, tz3, or tz4. KT1 identifies a smart contract. Use the XTZ.News prefix glossary for a plain-English reference." },
  { question: "Do I need a tz5 wallet today?", answer: "No. The XTZ.News tz5 guide covers testnet-stage post-quantum research. It is not an ordinary Mainnet wallet migration or a reason to move real funds." },
];

const STARTER_STEPS = [
  { number: "01", title: "Choose the form factor", body: "Start with the official Tezos wallet guide to compare the currently documented browser, mobile, desktop, identity-linked, and hardware options.", icon: WalletCards, href: "https://docs.tezos.com/developing/wallet-setup", external: true },
  { number: "02", title: "Create and protect access", body: "Follow your selected wallet’s own setup instructions. Keep recovery information and private keys private; a legitimate helper should not need them.", icon: KeyRound, href: "https://docs.tezos.com/developing/wallet-setup", external: true },
  { number: "03", title: "Recognise the address", body: "Learn the common Tezos prefixes before copying or sharing an address. User accounts and smart contracts are not the same thing.", icon: BookOpen, href: "/glossary/tezos-prefixes", external: false },
  { number: "04", title: "Use read-only tools first", body: "Explore public wallet and chain information without connecting a wallet, then decide what you want to do next.", icon: Compass, href: "/tools/wallet", external: false },
];

const NEXT_GUIDES = [
  { title: "Tezos Wallet Inspector", copy: "Look up public balances, tokens, delegation, and activity without connecting a wallet.", href: "/tools/wallet", icon: Compass },
  { title: "Tezos address-prefix glossary", copy: "Understand `tz1`–`tz5`, `KT1`, and `sr1` before you act on an address.", href: "/glossary/tezos-prefixes", icon: BookOpen },
  { title: "Tezos staking guide", copy: "Learn how delegation and baker rewards work before exploring staking options.", href: "/staking", icon: ShieldCheck },
  { title: "tz5 wallet guide", copy: "Learn about the separate testnet-stage post-quantum account research without treating it as a Mainnet migration.", href: "/guides/tz5-wallet", icon: KeyRound },
];

const WALLET_OPTIONS = [
  { name: "Temple", type: "Browser extension and mobile app", note: "A Tezos wallet option listed in the official setup guide.", href: "https://templewallet.com/" },
  { name: "Umami", type: "Desktop application", note: "A Windows, macOS, and Linux option listed in the official setup guide.", href: "https://umamiwallet.com/" },
  { name: "Kukai", type: "Identity-linked application", note: "An account option that can use linked identity methods, listed in official Tezos documentation.", href: "https://wallet.kukai.app/" },
  { name: "Trust Wallet", type: "Mobile app and browser extension", note: "A Tezos-compatible option listed in the official setup guide.", href: "https://trustwallet.com/tezos-wallet" },
  { name: "AirGap", type: "Standalone and mobile apps", note: "A Tezos wallet option listed in the official setup guide.", href: "https://airgap.it/" },
  { name: "Ledger", type: "Hardware wallet", note: "A hardware-wallet option listed in the official setup guide.", href: "https://www.ledger.com/" },
  { name: "MetaMask", type: "Browser extension on Mainnet", note: "Official documentation describes Tezos support through the MetaMask browser extension and Tezos Snap flow on Mainnet.", href: "https://metamask.tezos.com/" },
];

export default function TezosWalletStarterPage() {
  useSEO({
    title: "Tezos Wallet Starter Guide: First Steps for New Users | XTZ.News",
    description: "A clear Tezos wallet starter hub for new users: official wallet setup guidance, address prefixes, read-only tools, staking context, and safe next steps.",
    keywords: "Tezos wallet, Tezos wallet guide, Tezos wallet setup, tz1 wallet, Tezos address, Tezos wallet beginner guide",
    canonical: "https://xtz.news/wallets",
    jsonLd: [
      buildWebPageSchema({
        title: "Tezos Wallet Starter Guide",
        description: "A plain-English start page for Tezos wallets, account prefixes, and safe next steps.",
        url: "https://xtz.news/wallets",
        breadcrumbs: [{ name: "Home", url: "https://xtz.news" }, { name: "Tezos Wallet Starter", url: "https://xtz.news/wallets" }],
      }),
      buildFAQSchema(WALLET_STARTER_FAQS),
    ],
  });

  return (
    <main id="main-content" style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      <section style={{ background: "radial-gradient(circle at 84% 12%, rgba(34,197,94,0.21), transparent 30%), radial-gradient(circle at 16% 0%, rgba(44,125,247,0.3), transparent 37%), linear-gradient(135deg, #05152e, #071b3c 58%, #030a18)", borderBottom: "1px solid rgba(96,165,250,0.2)", padding: "3.35rem 0 3rem" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.35rem", color: "rgba(255,255,255,0.55)", fontSize: "0.76rem", marginBottom: "1.25rem" }}><Link href="/" style={{ color: "inherit" }}>Home</Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">Tezos wallet starter</span></nav>
          <div className="wallet-starter-hero-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.45fr) minmax(240px,0.62fr)", gap: "2.2rem", alignItems: "end" }}>
            <div>
              <p style={{ margin: 0, color: "#86efac", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.42rem" }}><WalletCards size={15} aria-hidden="true" /> New to Tezos</p>
              <h1 style={{ margin: "0.75rem 0 1rem", maxWidth: "13ch", fontSize: "clamp(2.2rem, 5vw, 4.4rem)", lineHeight: 0.98, letterSpacing: "-0.06em", fontWeight: 950 }}>Start with your Tezos wallet, not the noise.</h1>
              <p style={{ margin: 0, maxWidth: "64ch", color: "rgba(255,255,255,0.74)", lineHeight: 1.7, fontSize: "1.02rem" }}>A calm first-stop for understanding what a wallet does, how Tezos addresses work, and which official and read-only resources can help before you take the next step.</p>
              <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", marginTop: "1.45rem" }}><a href="https://docs.tezos.com/developing/wallet-setup" target="_blank" rel="noopener noreferrer" style={{ background: "#2c7df7", color: "#fff", padding: "0.78rem 1rem", borderRadius: "8px", fontWeight: 850, fontSize: "0.82rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>Read official wallet setup <ExternalLink size={14} aria-hidden="true" /></a><Link href="/tools/wallet" style={{ border: "1px solid rgba(255,255,255,0.24)", color: "#fff", padding: "0.78rem 1rem", borderRadius: "8px", fontWeight: 850, fontSize: "0.82rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>Open Wallet Inspector <ArrowRight size={14} aria-hidden="true" /></Link></div>
            </div>
            <aside aria-label="Wallet starter promise" style={{ padding: "1.1rem", background: "rgba(3,15,35,0.62)", border: "1px solid rgba(134,239,172,0.28)", borderRadius: "13px" }}><ShieldCheck size={22} color="#86efac" aria-hidden="true" /><p style={{ margin: "0.65rem 0 0.25rem", color: "#86efac", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 900, fontSize: "0.64rem" }}>Start small</p><strong style={{ display: "block", fontSize: "1.04rem", lineHeight: 1.3 }}>Understand the public information before you connect or sign.</strong><p style={{ margin: "0.55rem 0 0", color: "rgba(255,255,255,0.62)", fontSize: "0.82rem", lineHeight: 1.55 }}>This hub is educational. It does not ask for a recovery phrase, private key, or wallet connection.</p></aside>
          </div>
        </div>
      </section>

      <div className="container" style={{ maxWidth: "1080px", padding: "3rem 1.25rem 4.5rem" }}>
        <section aria-labelledby="wallet-starter-steps-title">
          <p style={{ margin: 0, color: "#86efac", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>Your first route</p>
          <h2 id="wallet-starter-steps-title" style={{ margin: "0.4rem 0 1.15rem", fontSize: "clamp(1.45rem, 3vw, 2.1rem)", letterSpacing: "-0.035em" }}>Four useful steps, in the right order.</h2>
          <div className="wallet-starter-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.75rem" }}>
            {STARTER_STEPS.map(({ number, title, body, icon: Icon, href, external }) => <article key={number} style={{ padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.11)", background: "#061a39" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ color: "#86efac", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.1em" }}>{number}</span><Icon size={18} color="#86efac" aria-hidden="true" /></div><h3 style={{ margin: "0.75rem 0 0.4rem", fontSize: "0.98rem", lineHeight: 1.25 }}>{title}</h3><p style={{ margin: 0, color: "rgba(255,255,255,0.61)", fontSize: "0.8rem", lineHeight: 1.55 }}>{body}</p>{external ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", marginTop: "0.8rem", color: "#86efac", textDecoration: "none", fontSize: "0.75rem", fontWeight: 850 }}>Official guide <ExternalLink size={13} aria-hidden="true" /></a> : <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", marginTop: "0.8rem", color: "#86efac", textDecoration: "none", fontSize: "0.75rem", fontWeight: 850 }}>Explore <ArrowRight size={13} aria-hidden="true" /></Link>}</article>)}
          </div>
        </section>

        <section aria-labelledby="wallet-options-title" style={{ marginTop: "3.5rem" }}>
          <p style={{ margin: 0, color: "#86efac", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>Officially listed options</p>
          <h2 id="wallet-options-title" style={{ margin: "0.4rem 0 0.55rem", fontSize: "clamp(1.45rem, 3vw, 2.1rem)", letterSpacing: "-0.035em" }}>Choose the wallet shape that fits your starting point.</h2>
          <p style={{ margin: "0 0 1.15rem", maxWidth: "72ch", color: "rgba(255,255,255,0.66)", lineHeight: 1.65, fontSize: "0.9rem" }}>These providers are listed in the current official Tezos wallet-setup documentation. XTZ.News does not rank or endorse them; check the provider’s current information and the official setup guide before installing or connecting any wallet.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
            {WALLET_OPTIONS.map((wallet) => <article key={wallet.name} style={{ padding: "1rem", borderRadius: "12px", border: "1px solid rgba(134,239,172,0.18)", background: "linear-gradient(135deg, rgba(6,37,50,0.86), rgba(6,26,57,0.95))" }}><WalletCards size={19} color="#86efac" aria-hidden="true" /><h3 style={{ margin: "0.72rem 0 0.24rem", fontSize: "1rem" }}>{wallet.name}</h3><p style={{ margin: 0, color: "#b7f7c9", fontSize: "0.72rem", fontWeight: 800 }}>{wallet.type}</p><p style={{ margin: "0.55rem 0 0", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", lineHeight: 1.5 }}>{wallet.note}</p><a href={wallet.href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "#86efac", textDecoration: "none", fontSize: "0.75rem", fontWeight: 850, marginTop: "0.8rem" }}>Visit provider <ExternalLink size={13} aria-hidden="true" /></a></article>)}
          </div>
        </section>

        <section aria-labelledby="wallet-prefix-title" style={{ marginTop: "3.5rem", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(280px,0.7fr)", gap: "1.4rem", alignItems: "start" }} className="wallet-prefix-grid">
          <div><p style={{ margin: 0, color: "#86efac", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>Know the label</p><h2 id="wallet-prefix-title" style={{ margin: "0.4rem 0 0.75rem", fontSize: "clamp(1.45rem, 3vw, 2.1rem)", letterSpacing: "-0.035em" }}>A prefix helps you recognise what you are looking at.</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.68)", lineHeight: 1.7 }}>Official Tezos documentation explains that user accounts can start with `tz1`, `tz2`, `tz3`, or `tz4`; smart contracts start with `KT1`; and Smart Rollups start with `sr1`.[1] A prefix is context, not permission to send funds—always confirm the full destination through the tool or service you are using.</p><Link href="/glossary/tezos-prefixes" style={{ color: "#86efac", fontWeight: 850, textDecoration: "none", display: "inline-flex", gap: "0.35rem", alignItems: "center", marginTop: "0.85rem", fontSize: "0.82rem" }}>Read the prefix glossary <ArrowRight size={14} aria-hidden="true" /></Link></div><aside style={{ padding: "1.15rem", borderRadius: "12px", border: "1px solid rgba(96,165,250,0.28)", background: "rgba(10,39,79,0.62)" }}><BookOpen size={22} color="#8ac0ff" aria-hidden="true" /><strong style={{ display: "block", marginTop: "0.65rem", fontSize: "1rem" }}>Treat `tz5` separately.</strong><p style={{ color: "rgba(255,255,255,0.64)", fontSize: "0.83rem", lineHeight: 1.55, margin: "0.5rem 0 0.75rem" }}>The `tz5` prefix is discussed in XTZ.News’ testnet-stage post-quantum research guide. It is not an ordinary Mainnet onboarding requirement.</p><Link href="/guides/tz5-wallet" style={{ color: "#8ac0ff", fontSize: "0.78rem", fontWeight: 850, textDecoration: "none" }}>Read the tz5 guide →</Link></aside></section>

        <section aria-labelledby="wallet-next-title" style={{ marginTop: "3.5rem" }}><p style={{ margin: 0, color: "#86efac", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>Build confidence gradually</p><h2 id="wallet-next-title" style={{ margin: "0.4rem 0 1.15rem", fontSize: "clamp(1.45rem, 3vw, 2.1rem)", letterSpacing: "-0.035em" }}>Choose the guide that matches your next question.</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }}>{NEXT_GUIDES.map(({ title, copy, href, icon: Icon }) => <Link key={title} href={href} style={{ textDecoration: "none", color: "inherit", padding: "1.1rem", borderRadius: "12px", border: "1px solid rgba(96,165,250,0.2)", background: "linear-gradient(135deg, rgba(6,26,57,0.94), rgba(8,32,72,0.65))" }}><Icon size={20} color="#8ac0ff" aria-hidden="true" /><h3 style={{ margin: "0.72rem 0 0.35rem", fontSize: "1rem" }}>{title}</h3><p style={{ margin: 0, color: "rgba(255,255,255,0.61)", fontSize: "0.82rem", lineHeight: 1.55 }}>{copy}</p><span style={{ display: "inline-flex", gap: "0.3rem", alignItems: "center", color: "#8ac0ff", fontSize: "0.75rem", fontWeight: 850, marginTop: "0.8rem" }}>Open guide <ArrowRight size={13} aria-hidden="true" /></span></Link>)}</div></section>

        <section aria-labelledby="wallet-faq-title" style={{ maxWidth: "820px", marginTop: "3.5rem" }}><p style={{ margin: 0, color: "#86efac", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>Quick answers</p><h2 id="wallet-faq-title" style={{ margin: "0.4rem 0 0.85rem", fontSize: "clamp(1.45rem, 3vw, 2.1rem)", letterSpacing: "-0.035em" }}>New-user wallet questions</h2>{WALLET_STARTER_FAQS.map((faq) => <details key={faq.question} style={{ padding: "0.9rem 0", borderTop: "1px solid rgba(255,255,255,0.13)" }}><summary style={{ cursor: "pointer", fontWeight: 800, fontSize: "0.95rem" }}>{faq.question}</summary><p style={{ color: "rgba(255,255,255,0.64)", lineHeight: 1.6, fontSize: "0.86rem", margin: "0.7rem 1.4rem 0 0" }}>{faq.answer}</p></details>)}</section>

        <section aria-label="Wallet safety note" style={{ marginTop: "3.25rem", padding: "1.2rem", borderRadius: "12px", background: "linear-gradient(135deg, rgba(34,197,94,0.11), rgba(5,21,46,0.9))", border: "1px solid rgba(134,239,172,0.25)", display: "flex", alignItems: "flex-start", gap: "0.8rem" }}><CheckCircle2 size={22} color="#86efac" aria-hidden="true" /><div><strong>Learn with public information first.</strong><p style={{ margin: "0.35rem 0 0", color: "rgba(255,255,255,0.66)", lineHeight: 1.55, fontSize: "0.84rem" }}>XTZ.News tools and guides can help you understand public addresses and terminology. Keep private keys and recovery details private, and use the provider’s current instructions for any wallet action.</p></div></section>
        <p style={{ margin: "2rem 0 0", color: "rgba(255,255,255,0.42)", fontSize: "0.73rem", lineHeight: 1.55 }}>[1] <a href="https://docs.tezos.com/architecture/accounts" target="_blank" rel="noopener noreferrer" style={{ color: "#8ac0ff" }}>Accounts and addresses — official Tezos documentation</a>. [2] <a href="https://docs.tezos.com/developing/wallet-setup" target="_blank" rel="noopener noreferrer" style={{ color: "#8ac0ff" }}>Installing and funding a wallet — official Tezos documentation</a>.</p>
      </div>
      <style>{`@media (max-width: 700px) { .wallet-starter-hero-grid, .wallet-prefix-grid { grid-template-columns: 1fr !important; } .wallet-starter-steps-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }`}</style>
    </main>
  );
}
