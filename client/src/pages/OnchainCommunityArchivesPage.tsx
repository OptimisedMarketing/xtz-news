import React, { useMemo } from "react";
import { Link } from "wouter";
import { Archive, ArrowRight, BookOpenText, ChevronRight, Home, Landmark, Palette, Sparkles, UsersRound } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getMediaUrl } from "@/lib/mediaUrl";
import { buildWebPageSchema, useSEO } from "@/hooks/useSEO";
import {
  ONCHAIN_COMMUNITY_ARCHIVE_ARTICLE_SLUGS,
  ONCHAIN_COMMUNITY_ARCHIVE_PROJECT_SLUGS,
  selectOnchainArchiveArticles,
  selectOnchainArchiveProjects,
} from "@/lib/onchainCommunityArchives";

function formatDate(value: Date | string | null | undefined) {
  return value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
}

export default function OnchainCommunityArchivesPage() {
  const { data: projects = [], isLoading: projectsLoading } = trpc.projects.all.useQuery({ category: "all" }, { staleTime: 300_000 });
  const { data: artData, isLoading: articlesLoading } = trpc.posts.byCategory.useQuery({ slug: "art", limit: 24, offset: 0 }, { staleTime: 300_000 });
  const archiveProjects = useMemo(() => selectOnchainArchiveProjects(projects), [projects]);
  const archiveArticles = useMemo(() => selectOnchainArchiveArticles(artData?.posts ?? []), [artData?.posts]);
  const wallProject = archiveProjects.find((project) => project.slug === "the-wall-today");
  const wallArticle = archiveArticles.find((article) => article.slug === "the-wall-today-freezes-genesis-board-tezos-archive");

  useSEO({
    title: "Onchain Community Archives | Tezos Culture Projects | XTZ.News",
    description: "Discover Tezos culture projects and editorial coverage that preserve community-made work, shared digital art, and recurring onchain records.",
    keywords: "Tezos culture, onchain community archives, THE WALL Today, Tezos digital art, Teia, Objkt, community records",
    canonical: "https://xtz.news/onchain-community-archives",
    jsonLd: buildWebPageSchema({
      title: "Onchain Community Archives | XTZ.News",
      description: "A source-led discovery hub for Tezos culture projects and community-made onchain records.",
      url: "https://xtz.news/onchain-community-archives",
      breadcrumbs: [
        { name: "Home", url: "https://xtz.news/" },
        { name: "Projects", url: "https://xtz.news/projects" },
        { name: "Onchain Community Archives", url: "https://xtz.news/onchain-community-archives" },
      ],
    }),
  });

  return (
    <main style={{ minHeight: "100vh", background: "#05070d" }}>
      <section style={{ position: "relative", overflow: "hidden", padding: "4rem 0 3.35rem", background: "radial-gradient(circle at 18% 12%, rgba(94,234,212,0.19), transparent 30%), radial-gradient(circle at 78% 6%, rgba(249,168,212,0.18), transparent 30%), linear-gradient(135deg, #071b2e, #160e2d 58%, #071422)" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.22, backgroundImage: "linear-gradient(rgba(94,234,212,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.08) 1px, transparent 1px)", backgroundSize: "34px 34px", maskImage: "linear-gradient(to bottom, #000, transparent)" }} />
        <div className="container" style={{ position: "relative" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.35rem", color: "rgba(255,255,255,0.6)", fontSize: "0.76rem" }}>
            <Link href="/" aria-label="XTZ.News home" style={{ color: "#fff", display: "inline-flex" }}><Home size={14} /></Link>
            <ChevronRight size={13} />
            <Link href="/projects" style={{ color: "#9edff0", textDecoration: "none" }}>Projects</Link>
            <ChevronRight size={13} />
            <span aria-current="page">Onchain Community Archives</span>
          </nav>

          <div className="archive-hub-hero" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(290px, 0.85fr)", gap: "2rem", alignItems: "center" }}>
            <div>
              <p style={{ display: "flex", alignItems: "center", gap: "0.45rem", margin: "0 0 0.8rem", color: "#99f6e4", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}><Archive size={15} aria-hidden="true" /> XTZ.News culture route</p>
              <h1 style={{ margin: "0 0 1rem", color: "#fff", fontSize: "clamp(2.25rem, 5.6vw, 4.65rem)", fontWeight: 950, letterSpacing: "-0.045em", lineHeight: 0.98 }}>Onchain community archives</h1>
              <p style={{ maxWidth: "720px", margin: 0, color: "rgba(255,255,255,0.76)", fontSize: "clamp(1rem, 2vw, 1.18rem)", lineHeight: 1.7 }}>A source-led route through Tezos projects that turn shared culture, community-made work and recurring digital moments into records people can revisit. Start with the current public beta information, then explore related art and culture projects.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", marginTop: "1.55rem" }}>
                <a href="#archive-projects" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: "#99f6e4", color: "#06201e", borderRadius: "6px", padding: "0.72rem 0.95rem", fontSize: "0.79rem", fontWeight: 900, textDecoration: "none" }}>Browse culture projects <ArrowRight size={15} aria-hidden="true" /></a>
                <a href="#archive-coverage" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: "1px solid rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.9)", borderRadius: "6px", padding: "0.72rem 0.95rem", fontSize: "0.79rem", fontWeight: 800, textDecoration: "none" }}>Read coverage <BookOpenText size={15} aria-hidden="true" /></a>
              </div>
            </div>

            <aside aria-label="Featured archive profile" style={{ border: "1px solid rgba(153,246,228,0.34)", background: "rgba(2,9,20,0.62)", borderRadius: "14px", overflow: "hidden", boxShadow: "0 18px 45px rgba(0,0,0,0.22)" }}>
              {wallProject ? <Link href="/projects/the-wall-today" style={{ display: "block", color: "inherit", textDecoration: "none" }}>
                <div style={{ height: "148px", position: "relative", overflow: "hidden", background: "#071321" }}>
                  {wallProject.featuredImageUrl && <img src={getMediaUrl(wallProject.featuredImageUrl)} alt={wallProject.featuredImageAlt || "THE WALL Today September Wall"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  <span style={{ position: "absolute", top: "0.8rem", left: "0.8rem", background: "rgba(4, 32, 38, 0.9)", color: "#99f6e4", border: "1px solid rgba(153,246,228,0.5)", borderRadius: "999px", padding: "0.27rem 0.55rem", fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.09em", textTransform: "uppercase" }}>Early beta profile</span>
                </div>
                <div style={{ padding: "1.2rem" }}>
                  <p style={{ margin: 0, color: "#99f6e4", fontSize: "0.63rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Featured community archive</p>
                  <h2 style={{ margin: "0.5rem 0", color: "#fff", fontSize: "1.35rem", lineHeight: 1.1 }}>THE WALL Today</h2>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", lineHeight: 1.55 }}>{wallProject.shortDescription || wallProject.excerpt}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "1rem", color: "#fff", fontSize: "0.77rem", fontWeight: 900 }}>View project profile <ArrowRight size={14} /></span>
                </div>
              </Link> : <div style={{ minHeight: "300px", padding: "1.2rem" }}><p style={{ color: "#99f6e4", fontSize: "0.64rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Featured community archive</p><div className="skeleton" style={{ height: "24px", marginTop: "1rem" }} /><div className="skeleton" style={{ height: "88px", marginTop: "0.8rem" }} /></div>}
            </aside>
          </div>
        </div>
        <style>{`@media (max-width: 720px) { .archive-hub-hero { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#081321", padding: "1.25rem 0" }}>
        <div className="container archive-hub-paths" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.9rem" }}>
          <Link href="/art-on-tezos" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none", color: "rgba(255,255,255,0.82)", padding: "0.6rem" }}><Palette size={18} color="#f9a8d4" aria-hidden="true" /><span><b style={{ display: "block", fontSize: "0.78rem" }}>Art on Tezos</b><small style={{ color: "rgba(255,255,255,0.5)" }}>Art projects and coverage</small></span></Link>
          <Link href="/art" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none", color: "rgba(255,255,255,0.82)", padding: "0.6rem" }}><Sparkles size={18} color="#99f6e4" aria-hidden="true" /><span><b style={{ display: "block", fontSize: "0.78rem" }}>Art & culture archive</b><small style={{ color: "rgba(255,255,255,0.5)" }}>Editorial reading routes</small></span></Link>
          <Link href="/events" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none", color: "rgba(255,255,255,0.82)", padding: "0.6rem" }}><Landmark size={18} color="#f6c453" aria-hidden="true" /><span><b style={{ display: "block", fontSize: "0.78rem" }}>Events calendar</b><small style={{ color: "rgba(255,255,255,0.5)" }}>Published culture events</small></span></Link>
        </div>
        <style>{`@media (max-width: 640px) { .archive-hub-paths { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      <section id="archive-projects" className="container" style={{ padding: "3.2rem 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.35rem" }}>
          <div><p style={{ margin: 0, color: "#99f6e4", fontSize: "0.66rem", fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase" }}>Project directory</p><h2 style={{ margin: "0.35rem 0 0", color: "#fff", fontSize: "1.6rem" }}>Tezos culture projects to explore</h2></div>
          <Link href="/projects" style={{ color: "#99f6e4", fontWeight: 800, fontSize: "0.78rem", textDecoration: "none" }}>Open all projects <ArrowRight size={14} style={{ display: "inline", verticalAlign: "-2px" }} /></Link>
        </div>
        <p style={{ maxWidth: "760px", margin: "0 0 1.5rem", color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.7 }}>These profiles are connected by culture, community participation or the shared discovery of Tezos-made work. Inclusion is for editorial discovery; readers should review each project’s own public information before participating or collecting.</p>
        {projectsLoading ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}><div className="skeleton" style={{ height: "220px" }} /><div className="skeleton" style={{ height: "220px" }} /></div> : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>{archiveProjects.map((project) => <Link key={project.id} href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}><article style={{ height: "100%", overflow: "hidden", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "#081321", transition: "transform 180ms cubic-bezier(0.23, 1, 0.32, 1), border-color 180ms cubic-bezier(0.23, 1, 0.32, 1)" }} onMouseEnter={(event) => { event.currentTarget.style.transform = "translateY(-3px)"; event.currentTarget.style.borderColor = "rgba(153,246,228,0.5)"; }} onMouseLeave={(event) => { event.currentTarget.style.transform = "translateY(0)"; event.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}><div style={{ height: "128px", background: "#0c1f2f" }}>{project.featuredImageUrl ? <img src={getMediaUrl(project.featuredImageUrl)} alt={project.featuredImageAlt || project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ height: "100%", display: "grid", placeItems: "center" }}><UsersRound size={28} color="#99f6e4" /></div>}</div><div style={{ padding: "1rem" }}><p style={{ margin: 0, color: "#99f6e4", fontSize: "0.61rem", fontWeight: 900, letterSpacing: "0.09em", textTransform: "uppercase" }}>{project.category || "Community"}</p><h3 style={{ margin: "0.42rem 0", color: "#fff", fontSize: "1rem" }}>{project.title}</h3><p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.shortDescription || project.excerpt}</p><span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", marginTop: "0.8rem", color: "#99f6e4", fontSize: "0.72rem", fontWeight: 900 }}>View profile <ArrowRight size={13} /></span></div></article></Link>)}</div>}
      </section>

      <section id="archive-coverage" style={{ padding: "3.2rem 0", borderTop: "1px solid rgba(255,255,255,0.08)", background: "#060913" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.35rem" }}><div><p style={{ margin: 0, color: "#f9a8d4", fontSize: "0.66rem", fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase" }}>XTZ.News coverage</p><h2 style={{ margin: "0.35rem 0 0", color: "#fff", fontSize: "1.6rem" }}>Community records and Tezos culture stories</h2></div><Link href="/art?type=recaps" style={{ color: "#f9a8d4", fontSize: "0.78rem", fontWeight: 800, textDecoration: "none" }}>Browse the art archive <ArrowRight size={14} style={{ display: "inline", verticalAlign: "-2px" }} /></Link></div>
          {articlesLoading ? <div className="skeleton" style={{ height: "260px" }} /> : archiveArticles.length ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>{archiveArticles.map((article) => <Link key={article.id} href={`/${article.slug}`} style={{ textDecoration: "none" }}><article style={{ overflow: "hidden", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "#081321", height: "100%" }}><div style={{ aspectRatio: "16 / 9", background: "#14263b" }}>{article.featuredImageUrl && <img src={getMediaUrl(article.featuredImageUrl)} alt={article.featuredImageAlt || article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</div><div style={{ padding: "1rem" }}><p style={{ margin: 0, color: "rgba(255,255,255,0.43)", fontSize: "0.67rem", fontWeight: 700 }}>{formatDate(article.publishedAt)}</p><h3 style={{ margin: "0.45rem 0", color: "#fff", fontSize: "1rem", lineHeight: 1.35 }}>{article.title}</h3><p style={{ margin: 0, color: "rgba(255,255,255,0.59)", fontSize: "0.78rem", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.excerpt}</p><span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", marginTop: "0.8rem", color: "#f9a8d4", fontSize: "0.72rem", fontWeight: 900 }}>Read article <ArrowRight size={13} /></span></div></article></Link>)}</div> : <div style={{ border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "10px", padding: "2rem", color: "rgba(255,255,255,0.62)" }}>This route will collect related published culture coverage as it is reviewed.</div>}
        </div>
      </section>

      <section style={{ padding: "3rem 0", background: "linear-gradient(135deg, #0d2b35, #171030)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}><div><p style={{ margin: 0, color: "#99f6e4", fontSize: "0.66rem", fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase" }}>Editorial discovery</p><h2 style={{ margin: "0.35rem 0 0", color: "#fff", fontSize: "clamp(1.45rem, 3vw, 2.2rem)" }}>Know a Tezos culture project worth following?</h2><p style={{ maxWidth: "680px", margin: "0.7rem 0 0", color: "rgba(255,255,255,0.7)", lineHeight: 1.65, fontSize: "0.9rem" }}>Send the project’s official link and concise context to the editorial team for review. Profiles and stories are checked before publication.</p></div><Link href="/submit-project" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", borderRadius: "6px", padding: "0.8rem 1rem", color: "#071e25", background: "#99f6e4", fontSize: "0.8rem", fontWeight: 900, textDecoration: "none" }}>Submit a project <ArrowRight size={15} /></Link></div>
      </section>
    </main>
  );
}

export { ONCHAIN_COMMUNITY_ARCHIVE_ARTICLE_SLUGS, ONCHAIN_COMMUNITY_ARCHIVE_PROJECT_SLUGS };
