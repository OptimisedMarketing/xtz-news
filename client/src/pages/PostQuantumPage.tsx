import React from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, ChevronRight, Database, ExternalLink, FlaskConical, GitBranch, Home, KeyRound, Layers3, LibraryBig, Search, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import { getMediaUrl } from "@/lib/mediaUrl";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export const POST_QUANTUM_FEATURED_RESOURCES = [
  { icon: KeyRound, title: "tz5 wallet guide", text: "A plain-English explanation of tz5, what ordinary holders should do today, and how to approach future public testing safely.", href: "/guides/tz5-wallet", label: "Read the guide" },
  { icon: FlaskConical, title: "Quantumnet: experimental testnet", text: "Read XTZ.News reporting on Tezos’ live public testnet for evaluating post-quantum accounts, baking rights, consensus and data availability.", href: "/quantumnet-live-tezos-experimental-post-quantum-testnet", label: "Read the Quantumnet story" },
  { icon: Search, title: "Tezos prefix glossary", text: "Search tz1–tz5, KT1 and sr1 to understand the address families and account types you encounter.", href: "/glossary/tezos-prefixes", label: "Search the glossary" },
  { icon: BookOpen, title: "Official post-quantum explainer", text: "Read the Tezos Spotlight overview of the planned post-quantum previewnet and its technical context.", href: "https://spotlight.tezos.com/why-post-quantum-why-now/", label: "Open official source", external: true },
];

export const POST_QUANTUM_VISUAL_GLOSSARY = [
  {
    key: "ml-dsa-44",
    icon: KeyRound,
    step: "01",
    area: "Account signatures",
    term: "ML-DSA-44",
    plainEnglish: "A post-quantum digital-signature algorithm: it helps prove that an authorised account approved a transaction.",
    quantumnetRole: "Quantumnet uses it for tz5 accounts instead of the elliptic-curve signatures used by current account types.",
    readerNote: "For readers: it is research-stage account technology, not a request to move funds or replace a wallet today.",
    sourceLabel: "NIST FIPS 204",
    sourceHref: "https://csrc.nist.gov/pubs/fips/204/final",
  },
  {
    key: "xmss",
    icon: GitBranch,
    step: "02",
    area: "Consensus attestations",
    term: "XMSS",
    plainEnglish: "A hash-based digital-signature scheme designed around cryptographic hash functions rather than the usual elliptic-curve approach.",
    quantumnetRole: "Quantumnet uses XMSS signatures for consensus attestations in place of the BLS signature approach used on Tezos mainnet.",
    readerNote: "For readers: this is validator and protocol plumbing, not a new public address format.",
    sourceLabel: "RFC 8391",
    sourceHref: "https://www.rfc-editor.org/rfc/rfc8391",
  },
  {
    key: "stark-aggregation",
    icon: Layers3,
    step: "03",
    area: "Batch proof layer",
    term: "STARK aggregation",
    plainEnglish: "A compact cryptographic proof for checking a batch of work together, rather than handling every attestation as a separate full-sized record.",
    quantumnetRole: "The testnet pairs XMSS attestations with a post-quantum STARK aggregation system developed by the LeanEthereum project.",
    readerNote: "For readers: it is part of the experiment to keep consensus data workable at network scale.",
    sourceLabel: "Tezos Spotlight",
    sourceHref: "https://spotlight.tezos.com/introducing-quantumnet/",
  },
  {
    key: "zoda",
    icon: Database,
    step: "04",
    area: "Data availability",
    term: "ZODA",
    plainEnglish: "A data-availability design based on two-dimensional tensor codes: it is being evaluated as a way for network participants to check that required data is available.",
    quantumnetRole: "Quantumnet evaluates ZODA instead of the KZG commitments and proofs currently used by Tezos’ Data Availability Layer.",
    readerNote: "For readers: it concerns how network data is verified and shared, not ownership of an asset.",
    sourceLabel: "Tezos Spotlight",
    sourceHref: "https://spotlight.tezos.com/introducing-quantumnet/",
  },
];

export default function PostQuantumPage() {
  const { data, isLoading } = trpc.posts.byTag.useQuery({ slug: "post-quantum", limit: 12, offset: 0 }, { staleTime: 5 * 60_000 });
  const posts = data?.posts ?? [];

  useSEO({
    title: "Tezos Post-Quantum Hub: tz5 Guides, News & Resources | XTZ.News",
    description: "A practical hub for Tezos post-quantum research: the tz5 wallet guide, address-prefix glossary, relevant news, and official technical resources.",
    keywords: "Tezos post-quantum, tz5, ML-DSA-44, Tezos quantum, Tezos previewnet, Tezos wallet guide",
    canonical: "https://xtz.news/post-quantum",
  });

  return (
    <main className="pq-page pq-hub" id="main-content">
      <section className="pq-hero pq-hub__hero">
        <div className="container pq-shell">
          <nav aria-label="Breadcrumb" className="pq-breadcrumb"><Link href="/" aria-label="XTZ.News home"><Home size={13} /></Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">Post-quantum hub</span></nav>
          <div className="pq-hero__grid">
            <div>
              <p className="pq-eyebrow"><FlaskConical size={14} aria-hidden="true" /> Tezos research hub</p>
              <h1>Post-quantum Tezos, without the noise.</h1>
              <p>One place for the latest XTZ.News reporting, a clear <code>tz5</code> guide, a searchable address-prefix reference, and the official material behind the conversation.</p>
              <div className="pq-hero__actions"><Link href="/guides/tz5-wallet">Start with the tz5 guide <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/glossary/tezos-prefixes">Search address prefixes</Link></div>
            </div>
            <div className="pq-hub__status"><span>Reader status</span><strong>Experimental research</strong><p><code>tz5</code> is not an ordinary Mainnet wallet migration. Follow named official announcements before participating in any public testing.</p></div>
          </div>
        </div>
      </section>

      <section className="pq-hub__content">
        <div className="container pq-shell">
          <section aria-labelledby="pq-start-title"><div className="pq-section-title"><div><p>Featured resources</p><h2 id="pq-start-title">Start with what you need.</h2></div></div><div className="pq-resource-grid">{POST_QUANTUM_FEATURED_RESOURCES.map(({ icon: Icon, title, text, href, label, external }) => <article key={title} className="pq-resource-card"><span><Icon size={20} aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p>{external ? <a href={href} target="_blank" rel="noopener noreferrer">{label} <ExternalLink size={15} aria-hidden="true" /></a> : <Link href={href}>{label} <ArrowRight size={15} aria-hidden="true" /></Link>}</article>)}</div></section>

          <section className="pq-visual-glossary" aria-labelledby="pq-glossary-title">
            <div className="pq-section-title"><div><p>Visual glossary</p><h2 id="pq-glossary-title">Four terms behind Quantumnet.</h2></div><p className="pq-visual-glossary__intro">A quick map of what each component does in the experimental testnet—not a guide to moving funds or changing wallets.</p></div>
            <div className="pq-visual-glossary-grid">{POST_QUANTUM_VISUAL_GLOSSARY.map(({ key, icon: Icon, step, area, term, plainEnglish, quantumnetRole, readerNote, sourceLabel, sourceHref }) => <article key={key} id={`pq-glossary-${key}`} className="pq-visual-glossary-card">
              <div className="pq-visual-glossary-card__top"><span className="pq-visual-glossary-card__step" aria-hidden="true">{step}</span><span className="pq-visual-glossary-card__glyph"><Icon size={22} aria-hidden="true" /></span><span className="pq-visual-glossary-card__area">{area}</span></div>
              <h3>{term}</h3>
              <p className="pq-visual-glossary-card__plain"><strong>Plain English:</strong> {plainEnglish}</p>
              <p className="pq-visual-glossary-card__role"><strong>In Quantumnet:</strong> {quantumnetRole}</p>
              <p className="pq-visual-glossary-card__note">{readerNote}</p>
              <a href={sourceHref} target="_blank" rel="noopener noreferrer">Source: {sourceLabel} <ExternalLink size={13} aria-hidden="true" /></a>
            </article>)}</div>
          </section>

          <section className="pq-hub__news" aria-labelledby="pq-news-title"><div className="pq-section-title"><div><p>XTZ.News coverage</p><h2 id="pq-news-title">Post-quantum reporting and context</h2></div><Link href="/tag/post-quantum">View the topic archive <ArrowRight size={15} aria-hidden="true" /></Link></div>{isLoading ? <div className="pq-article-grid" aria-label="Loading post-quantum articles"><div className="skeleton pq-card-skeleton" /><div className="skeleton pq-card-skeleton" /></div> : posts.length ? <div className="pq-article-grid">{posts.map((post) => <Link key={post.id} href={`/${post.slug}`} className="pq-article-card"><div className="pq-article-card__image">{post.featuredImageUrl ? <img src={getMediaUrl(post.featuredImageUrl)} alt={post.featuredImageAlt || post.title} /> : <div aria-hidden="true" />}</div><div className="pq-article-card__body"><span>{formatDate(post.publishedAt)}</span><h3>{post.title}</h3><p>{post.excerpt}</p><b>Read article <ArrowRight size={15} aria-hidden="true" /></b></div></Link>)}</div> : <div className="pq-empty"><LibraryBig size={22} aria-hidden="true" /><h2>More coverage is on the way</h2><p>Use the guide and official reading links while XTZ.News continues to follow public post-quantum updates.</p></div>}</section>

          <section className="pq-hub__principle" aria-label="Post-quantum reader principle"><ShieldCheck size={24} aria-hidden="true" /><div><strong>Keep the distinction clear.</strong><p>Research, test networks and address formats are not instructions to move real funds. Check official publisher and wallet guidance before taking action.</p></div></section>
        </div>
      </section>
    </main>
  );
}
