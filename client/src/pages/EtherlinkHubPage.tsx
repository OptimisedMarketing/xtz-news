import React from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, ChevronRight, ExternalLink, Layers3, Route, ShieldCheck, WalletCards } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { buildFAQSchema, buildWebPageSchema, useSEO } from "@/hooks/useSEO";
import { getMediaUrl } from "@/lib/mediaUrl";

const OFFICIAL_RESOURCES = [
  {
    icon: BookOpen,
    title: "What is Etherlink?",
    text: "Official background on Etherlink as a Tezos execution layer, its EVM and Michelson interfaces, and where to begin.",
    href: "https://docs.etherlink.com/",
  },
  {
    icon: Route,
    title: "Bridge XTZ between layers",
    text: "Read the current official bridge instructions, including deposit and withdrawal timing context, before moving assets.",
    href: "https://docs.etherlink.com/evm/bridging/bridging-tezos/",
  },
  {
    icon: Layers3,
    title: "Explore Etherlink",
    text: "Use the official Etherlink explorer to inspect public addresses, transactions, tokens, and network activity.",
    href: "https://explorer.etherlink.com/",
  },
];

export const ETHERLINK_HUB_FAQS = [
  { question: "What is Etherlink?", answer: "Etherlink is a non-custodial execution layer for Tezos powered by Tezos Smart Rollup technology. Its official documentation describes EVM and Michelson interfaces for the same blockchain." },
  { question: "Can I bridge XTZ between Tezos and Etherlink?", answer: "The official Etherlink bridge supports transfers between Tezos layer 1 and Etherlink EVM. Read the current official bridge instructions and timing information before initiating a transfer." },
  { question: "Is Etherlink a separate token?", answer: "Etherlink uses XTZ as its native coin. Its documentation also describes WXTZ, an ERC-20-compatible wrapped representation for use in relevant EVM applications." },
];

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function EtherlinkHubPage() {
  const { data, isLoading } = trpc.posts.byTag.useQuery({ slug: "etherlink", limit: 12, offset: 0 }, { staleTime: 5 * 60_000 });
  const posts = data?.posts ?? [];

  useSEO({
    title: "Etherlink Hub: Tezos EVM News, Bridge & Resources | XTZ.News",
    description: "A source-led Etherlink hub for Tezos readers: XTZ.News coverage, EVM and Michelson context, bridge documentation, and official network resources.",
    keywords: "Etherlink Tezos, Etherlink EVM, Etherlink bridge, bridge XTZ to Etherlink, Etherlink explorer, Tezos EVM",
    canonical: "https://xtz.news/etherlink",
    jsonLd: [
      buildWebPageSchema({
        title: "Etherlink Hub",
        description: "Source-led Etherlink news, bridge context, and official Tezos ecosystem resources.",
        url: "https://xtz.news/etherlink",
        breadcrumbs: [{ name: "Home", url: "https://xtz.news" }, { name: "Etherlink Hub", url: "https://xtz.news/etherlink" }],
      }),
      buildFAQSchema(ETHERLINK_HUB_FAQS),
    ],
  });

  return (
    <main id="main-content" style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>
      <section style={{ background: "radial-gradient(circle at 85% 5%, rgba(44,125,247,0.36), transparent 34%), linear-gradient(135deg, #05152e 0%, #0a214a 55%, #071631 100%)", borderBottom: "1px solid rgba(96,165,250,0.25)", padding: "3.5rem 0 3rem" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "rgba(255,255,255,0.55)", fontSize: "0.76rem", marginBottom: "1.35rem" }}>
            <Link href="/" aria-label="XTZ.News home" style={{ color: "inherit" }}>Home</Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">Etherlink hub</span>
          </nav>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.55fr) minmax(230px,0.6fr)", gap: "2rem", alignItems: "end" }} className="etherlink-hero-grid">
            <div>
              <p style={{ margin: 0, color: "#86b9ff", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.45rem" }}><Layers3 size={15} aria-hidden="true" /> Tezos execution layer</p>
              <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 4.4rem)", lineHeight: 0.98, letterSpacing: "-0.055em", maxWidth: "12ch", margin: "0.75rem 0 1rem", fontWeight: 950 }}>Etherlink, explained for Tezos readers.</h1>
              <p style={{ maxWidth: "65ch", color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontSize: "1rem", margin: 0 }}>Follow Etherlink news and technical context, then move into the official documentation for bridging, public network data, and getting started.</p>
              <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", marginTop: "1.4rem" }}>
                <a href="#etherlink-coverage" style={{ background: "#2c7df7", color: "#fff", borderRadius: "8px", padding: "0.75rem 1rem", textDecoration: "none", fontWeight: 800, fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>Read XTZ.News coverage <ArrowRight size={15} aria-hidden="true" /></a>
                <a href="https://docs.etherlink.com/" target="_blank" rel="noopener noreferrer" style={{ border: "1px solid rgba(255,255,255,0.23)", color: "#fff", borderRadius: "8px", padding: "0.75rem 1rem", textDecoration: "none", fontWeight: 800, fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>Official docs <ExternalLink size={14} aria-hidden="true" /></a>
              </div>
            </div>
            <aside aria-label="Etherlink reader note" style={{ borderLeft: "1px solid rgba(147,197,253,0.35)", paddingLeft: "1.15rem" }}>
              <span style={{ display: "block", color: "#86b9ff", fontSize: "0.64rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>Read first</span>
              <strong style={{ display: "block", fontSize: "1.05rem", marginTop: "0.35rem" }}>Use current official bridge guidance.</strong>
              <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.82rem", lineHeight: 1.55, margin: "0.45rem 0 0" }}>Bridge paths and timing can differ. Check the official instructions before acting.</p>
            </aside>
          </div>
        </div>
      </section>

      <div className="container" style={{ maxWidth: "1100px", padding: "3rem 1.25rem 4.5rem" }}>
        <section aria-labelledby="etherlink-start-title">
          <p style={{ margin: 0, color: "#68a4ff", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>Start with trusted sources</p>
          <h2 id="etherlink-start-title" style={{ fontSize: "clamp(1.45rem, 3vw, 2.1rem)", margin: "0.4rem 0 1.2rem", letterSpacing: "-0.03em" }}>A clearer path through Etherlink.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "0.9rem" }}>
            {OFFICIAL_RESOURCES.map(({ icon: Icon, title, text, href }) => <article key={title} style={{ padding: "1.2rem", borderRadius: "12px", border: "1px solid rgba(96,165,250,0.2)", background: "linear-gradient(135deg, rgba(7,22,49,0.92), rgba(8,32,72,0.68))" }}>
              <Icon size={20} aria-hidden="true" style={{ color: "#68a4ff" }} />
              <h3 style={{ margin: "0.75rem 0 0.4rem", fontSize: "1.02rem" }}>{title}</h3>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.62)", fontSize: "0.83rem", lineHeight: 1.55 }}>{text}</p>
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", gap: "0.35rem", alignItems: "center", color: "#8abaff", fontWeight: 800, fontSize: "0.76rem", textDecoration: "none", marginTop: "0.9rem" }}>Open official source <ExternalLink size={13} aria-hidden="true" /></a>
            </article>)}
          </div>
        </section>

        <section id="etherlink-coverage" aria-labelledby="etherlink-coverage-title" style={{ marginTop: "3.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap", marginBottom: "1.15rem" }}>
            <div><p style={{ margin: 0, color: "#68a4ff", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>XTZ.News coverage</p><h2 id="etherlink-coverage-title" style={{ margin: "0.35rem 0 0", fontSize: "clamp(1.45rem, 3vw, 2.1rem)", letterSpacing: "-0.03em" }}>Etherlink news and analysis</h2></div>
            <Link href="/tag/etherlink" style={{ color: "#8abaff", fontWeight: 800, fontSize: "0.8rem", textDecoration: "none", display: "inline-flex", gap: "0.35rem", alignItems: "center" }}>View the Etherlink archive <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          {isLoading ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.9rem" }} aria-label="Loading Etherlink coverage"><div className="skeleton" style={{ height: "270px" }} /><div className="skeleton" style={{ height: "270px" }} /></div> : posts.length ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.9rem" }}>{posts.map((post) => <Link key={post.id} href={`/${post.slug}`} style={{ textDecoration: "none", color: "inherit", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", overflow: "hidden", background: "#061a39" }}><div style={{ aspectRatio: "16 / 8", background: "#09234e" }}>{post.featuredImageUrl && <img src={getMediaUrl(post.featuredImageUrl)} alt={post.featuredImageAlt || post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</div><div style={{ padding: "1rem" }}><span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem" }}>{formatDate(post.publishedAt)}</span><h3 style={{ margin: "0.45rem 0", fontSize: "1rem", lineHeight: 1.28 }}>{post.title}</h3><p style={{ color: "rgba(255,255,255,0.56)", margin: 0, fontSize: "0.8rem", lineHeight: 1.5 }}>{post.excerpt}</p><b style={{ display: "inline-flex", marginTop: "0.8rem", color: "#8abaff", fontSize: "0.76rem", alignItems: "center", gap: "0.3rem" }}>Read article <ArrowRight size={13} aria-hidden="true" /></b></div></Link>)}</div> : <div style={{ padding: "1.5rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)", background: "#061a39" }}>Etherlink coverage is being added to the XTZ.News archive. Use the official reading links above for current network guidance.</div>}
        </section>

        <section aria-labelledby="etherlink-faq-title" style={{ marginTop: "3.5rem", maxWidth: "800px" }}>
          <p style={{ margin: 0, color: "#68a4ff", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>Quick answers</p>
          <h2 id="etherlink-faq-title" style={{ margin: "0.35rem 0 1rem", fontSize: "clamp(1.45rem, 3vw, 2.1rem)", letterSpacing: "-0.03em" }}>Etherlink questions, answered carefully</h2>
          {ETHERLINK_HUB_FAQS.map((faq) => <details key={faq.question} style={{ borderTop: "1px solid rgba(255,255,255,0.13)", padding: "0.85rem 0" }}><summary style={{ cursor: "pointer", fontWeight: 800, color: "#fff", fontSize: "0.95rem" }}>{faq.question}</summary><p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.6, margin: "0.7rem 1.4rem 0 0", fontSize: "0.88rem" }}>{faq.answer}</p></details>)}
        </section>

        <section aria-label="Etherlink safety note" style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", marginTop: "3rem", padding: "1.1rem", borderRadius: "12px", border: "1px solid rgba(96,165,250,0.22)", background: "rgba(16,45,92,0.5)" }}><ShieldCheck size={22} style={{ color: "#86b9ff", flexShrink: 0 }} aria-hidden="true" /><div><strong>Keep the purpose clear.</strong><p style={{ color: "rgba(255,255,255,0.62)", margin: "0.35rem 0 0", lineHeight: 1.55, fontSize: "0.85rem" }}>This hub is for ecosystem context and official-source discovery. It does not replace current wallet, bridge, or transaction guidance from the relevant provider.</p></div></section>
      </div>
    </main>
  );
}
