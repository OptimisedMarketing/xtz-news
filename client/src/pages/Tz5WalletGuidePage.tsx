import React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  FlaskConical,
  Home,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TestTube2,
} from "lucide-react";
import { buildFAQSchema, useSEO } from "@/hooks/useSEO";

const sourceLinks = [
  { label: "Octez documentation — Accounts and addresses", href: "https://octez.tezos.com/docs/active/accounts.html" },
  { label: "Tezos Spotlight — Ushuaia is Live", href: "https://spotlight.tezos.com/ushuaia-is-live/" },
  { label: "Tezos Docs — Installing and funding a wallet", href: "https://docs.tezos.com/developing/wallet-setup" },
];

const futureSteps = [
  ["1", "Wait for the official network name", "Use an announcement from Tezos rather than a link shared in a private message or an unfamiliar chat."],
  ["2", "Check the wallet’s own release notes", "A wallet should explicitly state that it supports tz5 on that exact testing network."],
  ["3", "Start with a clean test account", "Use only test tez from the named faucet. It has no Mainnet value."],
  ["4", "Keep your keys where they belong", "Never enter a recovery phrase or private key into a tool just because it mentions tz5 or post-quantum security."],
] as const;

const addressFamilies = [
  { prefix: "tz1", scheme: "Ed25519", detail: "The familiar default account family in Tezos tooling.", research: false },
  { prefix: "tz2", scheme: "Secp256k1", detail: "An alternative user-account signing scheme.", research: false },
  { prefix: "tz3", scheme: "P-256", detail: "An alternative user-account signing scheme.", research: false },
  { prefix: "tz4", scheme: "BLS12-381", detail: "An aggregatable-signature account type for specialised use.", research: false },
  { prefix: "tz5", scheme: "ML-DSA-44", detail: "The post-quantum account type being evaluated on enabled test networks.", research: true },
] as const;

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
    <main className="tz5-guide" id="main-content">
      <section className="tz5-guide-hero">
        <div className="container tz5-guide-shell">
          <nav aria-label="Breadcrumb" className="tz5-guide-breadcrumb">
            <Link href="/" aria-label="XTZ.News home"><Home size={13} /></Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span>Guides</span>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">tz5 wallet guide</span>
          </nav>
          <div className="tz5-guide-hero-grid">
            <div>
              <p className="tz5-guide-eyebrow"><Sparkles size={13} aria-hidden="true" /> Plain-English guide</p>
              <h1>Understand <code>tz5</code> in five minutes.</h1>
              <p className="tz5-guide-lede">A practical guide to Tezos’ post-quantum account research—what the address prefix means, what has not changed, and how to approach any future testing safely.</p>
              <Link href="/tezos-post-quantum-previewnet-why-now" className="tz5-guide-hero-link">Read the post-quantum report <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className="tz5-guide-hero-signal" aria-label="tz5 at a glance">
              <span className="tz5-guide-signal-label">Current focus</span>
              <strong>Testnet research</strong>
              <span>Not a new Mainnet wallet product</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container tz5-guide-shell tz5-guide-content">
        <section aria-label="Important tz5 status" className="tz5-guide-status">
          <FlaskConical aria-hidden="true" size={22} />
          <div>
            <strong>Current status: testing work, not an ordinary Mainnet wallet feature.</strong>
            <p>The <code>tz5</code> account feature is disabled by default on Tezos Mainnet. Do not move real funds in expectation of using <code>tz5</code> today.</p>
          </div>
        </section>

        <section aria-labelledby="tz5-at-a-glance" className="tz5-guide-glance-section">
          <div className="tz5-guide-section-intro">
            <p className="tz5-guide-kicker">Start here</p>
            <h2 id="tz5-at-a-glance">The short version</h2>
          </div>
          <div className="tz5-guide-glance-grid">
            <article className="tz5-guide-glance-card">
              <span className="tz5-guide-icon tz5-guide-icon--blue"><KeyRound size={19} aria-hidden="true" /></span>
              <h3>It is an address type</h3>
              <p><code>tz5</code> identifies a Tezos account family using ML-DSA-44 signatures. It is not an app or a replacement wallet download.</p>
            </article>
            <article className="tz5-guide-glance-card">
              <span className="tz5-guide-icon tz5-guide-icon--violet"><TestTube2 size={19} aria-hidden="true" /></span>
              <h3>It is being tested</h3>
              <p>The work lets wallets and technical tooling be evaluated ahead of any wider protocol decision.</p>
            </article>
            <article className="tz5-guide-glance-card">
              <span className="tz5-guide-icon tz5-guide-icon--gold"><ShieldCheck size={19} aria-hidden="true" /></span>
              <h3>You do not need to act</h3>
              <p>Continue using your existing Tezos wallet normally. No migration is expected from ordinary Mainnet holders today.</p>
            </article>
          </div>
        </section>

        <section id="address-family-map" aria-labelledby="tz5-family-map-title" className="tz5-guide-timeline-section">
          <div className="tz5-guide-timeline-heading">
            <div>
              <p className="tz5-guide-kicker">Address-family map</p>
              <h2 id="tz5-family-map-title">From <code>tz1</code> to <code>tz5</code>, at a glance</h2>
            </div>
            <p>The prefixes identify different cryptographic account families, not wallet versions that users upgrade through. <code>tz5</code> is shown last because it is the newer post-quantum research addition.</p>
          </div>
          <ol className="tz5-guide-timeline" aria-label="Tezos user account prefix comparison">
            {addressFamilies.map((family, index) => <li key={family.prefix} className={family.research ? "tz5-guide-timeline-item tz5-guide-timeline-item--research" : "tz5-guide-timeline-item"}>
              <span className="tz5-guide-timeline-line" aria-hidden="true" />
              <div className="tz5-guide-timeline-dot" aria-hidden="true">{index + 1}</div>
              <article>
                <div className="tz5-guide-timeline-card-header"><code>{family.prefix}</code>{family.research && <span>Testnet stage</span>}</div>
                <h3>{family.scheme}</h3>
                <p>{family.detail}</p>
              </article>
            </li>)}
          </ol>
          <p className="tz5-guide-timeline-note"><ShieldCheck size={15} aria-hidden="true" /> <strong>What has not changed:</strong> ordinary Mainnet holders do not need to create or move to a <code>tz5</code> account today.</p>
        </section>

        <div className="tz5-guide-layout">
          <article className="tz5-guide-article">
            <section id="what-is-tz5" aria-labelledby="tz5-meaning">
              <p className="tz5-guide-kicker">01 — Decode the prefix</p>
              <h2 id="tz5-meaning">What does <code>tz5</code> actually mean?</h2>
              <p className="tz5-guide-lead-copy">Think of <code>tz5</code> as a label for a different kind of Tezos account—not as a new wallet you should install. It is part of research that explores how accounts could remain secure in a future with more capable quantum computers.</p>
              <div className="tz5-guide-prefix-grid" aria-label="Address prefix comparison">
                <div className="tz5-guide-prefix-card"><span>Familiar account prefix</span><strong><code>tz1</code></strong><p>The account style many Tezos users already recognise.</p></div>
                <div className="tz5-guide-prefix-arrow" aria-hidden="true"><ArrowRight size={20} /></div>
                <div className="tz5-guide-prefix-card tz5-guide-prefix-card--featured"><span>Post-quantum test account prefix</span><strong><code>tz5</code></strong><p>An ML-DSA-44 account type being evaluated through testnet work.</p></div>
              </div>
              <p>It does not mean today’s Tezos accounts are broken. The point of early testing is to give wallets, custodians and infrastructure teams time to learn before any broader change is needed.</p>
            </section>

            <section id="what-to-do" aria-labelledby="tz5-today">
              <p className="tz5-guide-kicker">02 — What this means today</p>
              <h2 id="tz5-today">One clear action: stay with your normal wallet.</h2>
              <div className="tz5-guide-do-grid">
                <section className="tz5-guide-do-card tz5-guide-do-card--yes" aria-label="What to do">
                  <CheckCircle2 size={20} aria-hidden="true" /><div><h3>Do</h3><p>Keep using your existing wallet and follow confirmed Tezos announcements for future public testing details.</p></div>
                </section>
                <section className="tz5-guide-do-card tz5-guide-do-card--no" aria-label="What not to do">
                  <CircleAlert size={20} aria-hidden="true" /><div><h3>Do not</h3><p>Send real funds to an address or network merely because it mentions <code>tz5</code>, quantum security, or a new wallet tool.</p></div>
                </section>
              </div>
            </section>

            <section id="future-testing" aria-labelledby="tz5-later">
              <p className="tz5-guide-kicker">03 — When testing is announced</p>
              <h2 id="tz5-later">A safer way to approach future testing</h2>
              <p className="tz5-guide-lead-copy">If Tezos publishes a public test network and a wallet separately documents support for that exact network, use this simple checklist.</p>
              <ol className="tz5-guide-steps">
                {futureSteps.map(([number, title, description]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}
              </ol>
            </section>

            <section id="quick-answers" aria-labelledby="tz5-answers">
              <p className="tz5-guide-kicker">04 — Quick answers</p>
              <h2 id="tz5-answers">Common questions</h2>
              <div className="tz5-guide-answers">
                <details open><summary>Do I need to create a <code>tz5</code> wallet now?</summary><p>No. There is no ordinary Mainnet migration for holders to complete today. Wait for a named public testing network and an explicit wallet-support announcement.</p></details>
                <details><summary>Does <code>tz5</code> mean existing Tezos wallets are unsafe?</summary><p>No. The research is preparation for a long-term cryptographic transition, not a warning that today’s accounts have been compromised.</p></details>
                <details><summary>What should I do if someone sends me a <code>tz5</code> link?</summary><p>Do not enter recovery words or private keys. Check the information against official Tezos and your wallet’s own published resources first.</p></details>
              </div>
            </section>
          </article>

          <aside aria-label="tz5 guide navigation and sources" className="tz5-guide-aside">
            <section className="tz5-guide-aside-card">
              <p className="tz5-guide-aside-label">In this guide</p>
              <a href="#what-is-tz5">What <code>tz5</code> means</a>
              <a href="#what-to-do">What to do today</a>
              <a href="#future-testing">Future testing checklist</a>
              <a href="#quick-answers">Quick answers</a>
            </section>
            <section className="tz5-guide-aside-card tz5-guide-aside-card--secure">
              <LockKeyhole aria-hidden="true" size={20} />
              <h2>Keep control</h2>
              <p>A recovery phrase and a private key should stay private. A legitimate guide or helper does not need either one.</p>
            </section>
            <section aria-labelledby="tz5-sources" className="tz5-guide-aside-card tz5-guide-sources">
              <div className="tz5-guide-sources-title"><BookOpen aria-hidden="true" size={17} /><h2 id="tz5-sources">Official reading</h2></div>
              {sourceLinks.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} aria-hidden="true" />{source.label}</a>)}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
