import { Link, useParams } from "wouter";
import { ArrowLeft, ExternalLink, MapPin, PenLine } from "lucide-react";
import { getMediaUrl } from "@/lib/mediaUrl";
import { useSEO } from "@/hooks/useSEO";
import { trpc } from "@/lib/trpc";
import { getEditorialAuthor } from "@shared/editorialAuthors";

export default function AuthorProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const author = getEditorialAuthor(slug);
  const { data: authoredPosts = [], isLoading: isLoadingArticles } = trpc.posts.byAuthor.useQuery(
    { authorSlug: author?.slug || "unknown", limit: 12 },
    { enabled: !!author },
  );

  useSEO({
    title: author ? `${author.name} | XTZ.News` : "Editorial Team | XTZ.News",
    description: author?.description || "Meet the writers contributing source-led Tezos coverage to XTZ.News.",
    canonical: author ? `https://xtz.news/authors/${author.slug}` : "https://xtz.news/authors",
    ogType: "profile",
    ogImage: author?.imageUrl ? getMediaUrl(author.imageUrl) : undefined,
    jsonLd: author ? {
      "@context": "https://schema.org",
      "@type": "Person",
      name: author.name,
      url: `https://xtz.news/authors/${author.slug}`,
      jobTitle: author.jobTitle,
      description: author.description,
      homeLocation: { "@type": "Place", name: author.location },
      ...(author.imageUrl ? { image: getMediaUrl(author.imageUrl) } : {}),
      ...(author.websiteUrl ? { sameAs: [author.websiteUrl] } : {}),
      worksFor: { "@type": "Organization", name: "XTZ.News", url: "https://xtz.news" },
    } : undefined,
  });

  if (!author) {
    return (
      <main className="container" style={{ padding: "5rem 1.25rem", maxWidth: "760px" }}>
        <p style={{ color: "#5a9fff", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>XTZ.News Editorial</p>
        <h1 style={{ color: "#fff", marginTop: "0.75rem" }}>Author profile not found</h1>
        <Link href="/" style={{ color: "#5a9fff", fontWeight: 700 }}>Return to XTZ.News</Link>
      </main>
    );
  }

  return (
    <main>
      <section style={{ background: "linear-gradient(145deg, #071d40, #030e1f 72%)", borderBottom: "1px solid rgba(44,125,247,0.22)" }}>
        <div className="container" style={{ padding: "2rem 1.25rem 3.5rem", maxWidth: "960px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.62)", fontSize: "0.76rem", fontWeight: 700, textDecoration: "none" }}><ArrowLeft size={14} /> Back to XTZ.News</Link>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 170px) minmax(0, 1fr)", gap: "2rem", alignItems: "center", marginTop: "2rem" }} className="author-profile-grid">
            <div aria-hidden="true" style={{ width: "170px", height: "170px", borderRadius: "50%", overflow: "hidden", border: "4px solid rgba(44,125,247,0.55)", boxShadow: "0 16px 40px rgba(0,0,0,0.3)", background: "linear-gradient(135deg, #2c7df7, #0d2a5e)", display: "grid", placeItems: "center", fontSize: "3rem", fontWeight: 900, color: "#fff" }}>
              {author.imageUrl ? <img src={getMediaUrl(author.imageUrl)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : author.initials}
            </div>
            <div>
              <p style={{ color: "#5a9fff", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase", margin: "0 0 0.55rem" }}>XTZ.News editorial</p>
              <h1 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.5rem)", margin: 0, letterSpacing: "-0.035em" }}>{author.name}</h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginTop: "0.85rem", color: "rgba(255,255,255,0.65)", fontSize: "0.82rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><PenLine size={14} color="#5a9fff" /> {author.jobTitle}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><MapPin size={14} color="#5a9fff" /> Based in {author.location}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.75, maxWidth: "690px", fontSize: "1rem", margin: "1.25rem 0 0" }}>{author.description}</p>
              {author.websiteUrl && <a href={author.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: "#fff", background: "#2c7df7", padding: "0.7rem 1rem", borderRadius: "5px", fontSize: "0.78rem", fontWeight: 800, textDecoration: "none", marginTop: "1.25rem" }}>Visit personal website <ExternalLink size={14} /></a>}
              <Link href="/newsroom/editorial-policy" style={{ display: "inline-flex", alignItems: "center", marginLeft: author.websiteUrl ? "0.65rem" : 0, marginTop: "1.25rem", color: "#8cbcff", fontSize: "0.78rem", fontWeight: 800, textDecoration: "none" }}>Read editorial policy →</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="container" style={{ padding: "2.5rem 1.25rem 4rem", maxWidth: "960px" }}>
        <h2 style={{ color: "#fff", margin: 0, fontSize: "1.25rem" }}>Editorial focus</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "720px", lineHeight: 1.7 }}>XTZ.News author pages identify the named contributors behind articles and link readers to their declared public profiles. Article bylines are updated as stories are assigned to the editorial team.</p>
        <div style={{ marginTop: "2.25rem", paddingTop: "1.6rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 style={{ color: "#fff", margin: 0, fontSize: "1.25rem" }}>Latest from {author.name}</h2>
          {isLoadingArticles ? <p style={{ color: "rgba(255,255,255,0.52)" }}>Loading articles…</p> : authoredPosts.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
              {authoredPosts.map((post) => <Link key={post.id} href={`/${post.slug}`} style={{ display: "block", border: "1px solid rgba(44,125,247,0.24)", borderRadius: "8px", padding: "1rem", textDecoration: "none", background: "rgba(5,21,46,0.75)" }}>
                <p style={{ color: "#5a9fff", fontSize: "0.64rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>{post.categories?.[0]?.name || "Tezos News"}</p>
                <h3 style={{ color: "#fff", fontSize: "0.95rem", lineHeight: 1.4, margin: "0.45rem 0 0" }}>{post.title}</h3>
              </Link>)}
            </div>
          ) : <p style={{ color: "rgba(255,255,255,0.52)", lineHeight: 1.6 }}>Published stories assigned to this byline will appear here.</p>}
        </div>
      </section>
      <style>{`@media (max-width: 560px) { .author-profile-grid { grid-template-columns: 1fr !important; gap: 1.25rem !important; } }`}</style>
    </main>
  );
}
