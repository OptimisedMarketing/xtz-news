import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, FilePenLine, Landmark, MessagesSquare } from "lucide-react";
import { buildWebPageSchema, useSEO } from "@/hooks/useSEO";
import CorrectionReportForm from "@/components/CorrectionReportForm";

const updatedLabel = "14 September 2026";

function PolicySection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <section style={{ padding: "1.5rem 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
    <h2 style={{ color: "#fff", margin: 0, display: "flex", gap: "0.6rem", alignItems: "center", fontSize: "1.1rem" }}><span style={{ color: "#5a9fff" }}>{icon}</span>{title}</h2>
    <div style={{ color: "rgba(255,255,255,0.64)", maxWidth: "800px", lineHeight: 1.75, fontSize: "0.92rem", marginTop: "0.75rem" }}>{children}</div>
  </section>;
}

export default function NewsroomEditorialPolicyPage() {
  useSEO({
    title: "Newsroom Editorial Policy | XTZ.News",
    description: "Read how XTZ.News approaches source-led Tezos reporting, corrections, author attribution, and transparent first-party promotions.",
    canonical: "https://xtz.news/newsroom/editorial-policy",
    keywords: "XTZ.News editorial policy, Tezos news sources, Tezos newsroom corrections",
    jsonLd: buildWebPageSchema({ title: "Newsroom Editorial Policy | XTZ.News", description: "XTZ.News editorial policy for source-led Tezos reporting and transparent promotion labels.", url: "https://xtz.news/newsroom/editorial-policy", breadcrumbs: [{ name: "Home", url: "https://xtz.news" }, { name: "Newsroom Editorial Policy", url: "https://xtz.news/newsroom/editorial-policy" }] }),
  });

  return <main>
    <header style={{ background: "linear-gradient(145deg, #071d40, #030e1f 72%)", borderBottom: "1px solid rgba(44,125,247,0.25)" }}>
      <div className="container" style={{ maxWidth: "980px", padding: "2rem 1.25rem 3rem" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.62)", fontSize: "0.76rem", fontWeight: 700, textDecoration: "none" }}><ArrowLeft size={14} /> Back to XTZ.News</Link>
        <p style={{ color: "#5a9fff", fontSize: "0.68rem", letterSpacing: "0.13em", fontWeight: 900, textTransform: "uppercase", margin: "2.2rem 0 0.55rem" }}>Newsroom</p>
        <h1 style={{ color: "#fff", margin: 0, fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.035em" }}>Editorial policy</h1>
        <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: "720px", lineHeight: 1.7, margin: "1rem 0 0" }}>This page explains how XTZ.News presents source-led Tezos coverage, distinguishes editorial work from our own promotions, and handles updates and corrections.</p>
        <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.76rem", margin: "1.15rem 0 0" }}>Last updated {updatedLabel}</p>
      </div>
    </header>
    <div className="container" style={{ maxWidth: "980px", padding: "2.5rem 1.25rem 4rem" }}>
      <PolicySection icon={<Landmark size={18} />} title="Editorial purpose"><p style={{ margin: 0 }}>XTZ.News covers Tezos protocol activity, ecosystem projects, digital art, research, events, and practical reader resources. We aim to provide clear context and link readers to relevant primary or official material whenever it is available.</p></PolicySection>
      <PolicySection icon={<FilePenLine size={18} />} title="Sources, context, and attribution"><p style={{ margin: 0 }}>Articles identify their source material through links, in-story context, or both. We distinguish reported information from commentary and do not present a campaign, project, service, or collection as an endorsement. Dates, availability, and other time-sensitive details can change after publication.</p></PolicySection>
      <PolicySection icon={<CheckCircle2 size={18} />} title="Authors and article updates"><p style={{ margin: 0 }}>Named contributors have public XTZ.News profile pages that identify their declared role and location. Article pages display the original publication date and a Last updated date when stored content is changed. Byline assignments identify editorial responsibility; they do not change the underlying source record.</p></PolicySection>
      <PolicySection icon={<MessagesSquare size={18} />} title="Corrections and transparent promotion"><p style={{ margin: 0 }}>If you believe an article needs a factual correction, use the private form below with the article URL, the detail in question, and a relevant source. We may update an article when warranted and retain its visible update date. Placements labelled “From our network” are first-party promotions for businesses or apps managed by the XTZ.News owner. They are separate from editorial coverage and are not third-party advertising placements.</p><CorrectionReportForm /></PolicySection>
      <div style={{ marginTop: "1.5rem", padding: "1rem 1.15rem", background: "rgba(44,125,247,0.08)", border: "1px solid rgba(44,125,247,0.24)", borderRadius: "8px", color: "rgba(255,255,255,0.68)", fontSize: "0.84rem", lineHeight: 1.6 }}>For general editorial contact or source material, use <a href="mailto:hello@xtz.news" style={{ color: "#5a9fff", fontWeight: 700 }}>hello@xtz.news</a>.</div>
    </div>
  </main>;
}
