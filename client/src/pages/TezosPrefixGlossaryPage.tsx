import React, { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, ExternalLink, FilterX, Home, Info, Search, ShieldAlert } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { searchTezosPrefixes } from "@/lib/tezosPrefixGlossary";

export default function TezosPrefixGlossaryPage() {
  const [query, setQuery] = useState("");
  const entries = useMemo(() => searchTezosPrefixes(query), [query]);

  useSEO({
    title: "Tezos Address Prefix Glossary: tz1, tz5, KT1 & sr1 | XTZ.News",
    description: "Search and understand common Tezos address prefixes, including tz1–tz5 user accounts, KT1 smart contracts, and sr1 Smart Rollups.",
    keywords: "Tezos prefix glossary, tz1, tz2, tz3, tz4, tz5, KT1, sr1, Tezos addresses",
    canonical: "https://xtz.news/glossary/tezos-prefixes",
  });

  return (
    <main className="pq-page pq-glossary" id="main-content">
      <section className="pq-hero">
        <div className="container pq-shell">
          <nav aria-label="Breadcrumb" className="pq-breadcrumb"><Link href="/" aria-label="XTZ.News home"><Home size={13} /></Link><ChevronRight size={13} aria-hidden="true" /><Link href="/post-quantum">Post-quantum</Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">Prefix glossary</span></nav>
          <div className="pq-hero__grid">
            <div>
              <p className="pq-eyebrow"><Info size={14} aria-hidden="true" /> Searchable reference</p>
              <h1>Tezos address prefixes, explained.</h1>
              <p>Search the compact reference for the account, contract, and rollup prefixes you see in Tezos tools. Each entry separates established address families from the current testnet-stage <code>tz5</code> research work.</p>
            </div>
            <div className="pq-hero__callout"><strong>Start with the prefix</strong><span>An address prefix is a useful clue—not a reason to share keys, recovery words, or funds.</span></div>
          </div>
        </div>
      </section>

      <section className="pq-glossary__content">
        <div className="container pq-shell">
          <div className="pq-search-panel">
            <label htmlFor="prefix-search">Search terms, prefixes, or account types</label>
            <div className="pq-search-field"><Search size={19} aria-hidden="true" /><input id="prefix-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try tz5, contract, BLS, wallet, or rollup" /><span aria-live="polite">{entries.length} {entries.length === 1 ? "match" : "matches"}</span></div>
            {query && <button type="button" onClick={() => setQuery("")} className="pq-clear-search"><FilterX size={15} aria-hidden="true" /> Clear search</button>}
          </div>

          <section aria-labelledby="prefix-results-title">
            <div className="pq-section-title"><div><p>Reference entries</p><h2 id="prefix-results-title">Find the prefix. Understand the context.</h2></div><span>{entries.length} shown</span></div>
            {entries.length ? <div className="pq-glossary-grid">{entries.map((entry) => <article key={entry.prefix} className={entry.status === "Testnet stage" ? "pq-prefix-card pq-prefix-card--research" : "pq-prefix-card"}>
              <div className="pq-prefix-card__head"><code>{entry.prefix}</code><span>{entry.status}</span></div>
              <p className="pq-prefix-card__type">{entry.kind}</p>
              <h3>{entry.title}</h3>
              <p>{entry.summary}</p>
              <div className="pq-prefix-card__detail">{entry.detail}</div>
            </article>)}</div> : <div className="pq-empty"><Search size={22} aria-hidden="true" /><h2>No prefix matches “{query}”</h2><p>Try a short prefix such as <code>KT1</code>, or a term such as “wallet”, “contract”, or “rollup”.</p><button type="button" onClick={() => setQuery("")}>Show all prefixes</button></div>}
          </section>

          <section className="pq-safety-strip" aria-labelledby="prefix-safety-title"><ShieldAlert size={22} aria-hidden="true" /><div><h2 id="prefix-safety-title">Address prefixes help you identify technology—not verify trust.</h2><p>Always check a wallet or network announcement against its official publisher. No legitimate guide needs your recovery phrase or private key.</p></div><Link href="/guides/tz5-wallet">Read the tz5 safety guide <ArrowRight size={16} aria-hidden="true" /></Link></section>
          <p className="pq-source-line">Prefix definitions are based on <a href="https://octez.tezos.com/docs/active/accounts.html" target="_blank" rel="noopener noreferrer">Octez accounts documentation <ExternalLink size={12} aria-hidden="true" /></a> and <a href="https://docs.tezos.com/architecture/accounts" target="_blank" rel="noopener noreferrer">Tezos account architecture <ExternalLink size={12} aria-hidden="true" /></a>.</p>
        </div>
      </section>
    </main>
  );
}
