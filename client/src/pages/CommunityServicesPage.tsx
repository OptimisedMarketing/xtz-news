import { useMemo } from "react";
import { Link } from "wouter";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ChevronRight, Home, UsersRound } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getMediaUrl } from "@/lib/mediaUrl";
import { buildWebPageSchema, useSEO } from "@/hooks/useSEO";

const COMMUNITY_SERVICES_CATEGORY = "Community Services";
const SUBMIT_AGENCY_HREF = `/submit-project?category=${encodeURIComponent(COMMUNITY_SERVICES_CATEGORY)}`;

export default function CommunityServicesPage() {
  const { data: projects = [], isLoading } = trpc.projects.all.useQuery({ category: "all" });
  const serviceProviders = useMemo(
    () => projects.filter((project) => project.category === COMMUNITY_SERVICES_CATEGORY),
    [projects],
  );

  useSEO({
    title: "Tezos Community Services | Agencies, Studios & Marketing | XTZ.News",
    description: "Discover Tezos-facing agencies, development studios and marketing providers in the XTZ.News Community Services directory.",
    keywords: "Tezos agencies, Tezos development studios, Tezos marketing, Tezos website development, Tezos community services",
    canonical: "https://xtz.news/community-services",
    jsonLd: buildWebPageSchema({
      title: "Tezos Community Services | XTZ.News",
      description: "A source-linked directory of Tezos-facing agencies, development studios and marketing providers.",
      url: "https://xtz.news/community-services",
      breadcrumbs: [
        { name: "Home", url: "https://xtz.news/" },
        { name: "Projects", url: "https://xtz.news/projects" },
        { name: "Community Services", url: "https://xtz.news/community-services" },
      ],
    }),
  });

  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
      <section style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.25)", padding: "3.5rem 0 3rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.045, backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 34px, rgba(44,125,247,0.9) 34px, rgba(44,125,247,0.9) 35px)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.35rem", marginBottom: "1.5rem", fontSize: "0.78rem", fontWeight: 600 }}>
            <Link href="/" aria-label="Home" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}><Home size={13} /></Link>
            <ChevronRight size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <Link href="/projects" style={{ color: "#69a7ff", textDecoration: "none" }}>Projects</Link>
            <ChevronRight size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.86)" }}>Community Services</span>
          </nav>

          <div style={{ maxWidth: "860px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: "#a8cbff", fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.85rem" }}>
              <BriefcaseBusiness size={15} aria-hidden="true" /> Tezos project directory
            </div>
            <h1 style={{ fontSize: "clamp(2.35rem, 6vw, 4.4rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.025em", lineHeight: 1, margin: 0 }}>Community Services</h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(1rem, 2vw, 1.15rem)", lineHeight: 1.7, maxWidth: "770px", margin: "1.1rem 0 0" }}>
              A directory for Tezos-facing agencies, development studios and marketing providers. Explore teams that help projects present, build and grow within the wider Tezos community.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.6rem" }}>
              <Link href={SUBMIT_AGENCY_HREF} style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", padding: "0.78rem 1.15rem", background: "#2c7df7", borderRadius: "4px", color: "#fff", textDecoration: "none", fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                <UsersRound size={16} aria-hidden="true" /> Submit your agency <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/projects" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.78rem 1.1rem", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "4px", color: "rgba(255,255,255,0.86)", textDecoration: "none", fontSize: "0.78rem", fontWeight: 800 }}>
                Browse all projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: "2.5rem 1.25rem 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", alignItems: "start", marginBottom: "2.25rem" }}>
          <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
            <h2 style={{ color: "#fff", fontSize: "1.15rem", margin: "0 0 0.75rem", fontWeight: 800 }}>What this directory covers</h2>
            <p style={{ color: "rgba(255,255,255,0.68)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>
              Profiles may include website design and development, applications, marketing, SEO, automation and launch support. Each listing should identify its own scope and official contact path. Inclusion is for discovery and does not amount to an editorial endorsement.
            </p>
          </div>
          <aside style={{ background: "rgba(44,125,247,0.09)", border: "1px solid rgba(44,125,247,0.28)", borderRadius: "8px", padding: "1.5rem" }}>
            <CheckCircle2 size={20} style={{ color: "#79afff", marginBottom: "0.75rem" }} aria-hidden="true" />
            <h2 style={{ color: "#fff", fontSize: "1rem", margin: "0 0 0.45rem", fontWeight: 800 }}>For service providers</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", lineHeight: 1.65, margin: 0 }}>Submit a concise, source-linked profile. Listings are reviewed before they appear in the directory.</p>
          </aside>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.1rem" }}>
          <div>
            <p style={{ color: "#71aaff", fontSize: "0.66rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.13em", margin: 0 }}>Directory listings</p>
            <h2 style={{ color: "#fff", fontSize: "1.55rem", fontWeight: 900, margin: "0.3rem 0 0" }}>Tezos community service providers</h2>
          </div>
          {!isLoading && <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.78rem", margin: 0 }}>{serviceProviders.length} listing{serviceProviders.length === 1 ? "" : "s"}</p>}
        </div>

        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))", gap: "1.15rem" }}>
            <div className="skeleton" style={{ height: "310px", borderRadius: "8px" }} />
          </div>
        ) : serviceProviders.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))", gap: "1.15rem" }}>
            {serviceProviders.map((project) => <ServiceProviderCard key={project.id} project={project} />)}
          </div>
        ) : (
          <div style={{ background: "#05152e", border: "1px dashed rgba(255,255,255,0.18)", borderRadius: "8px", padding: "2.5rem", textAlign: "center" }}>
            <h2 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>Be the first listed provider</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: "0.65rem auto 1.2rem", maxWidth: "500px" }}>Tell readers how your agency, studio or marketing service supports projects in the Tezos ecosystem.</p>
            <Link href={SUBMIT_AGENCY_HREF} style={{ color: "#8dbdff", fontWeight: 800, textDecoration: "none" }}>Submit your agency <ArrowRight size={14} style={{ display: "inline", verticalAlign: "middle" }} /></Link>
          </div>
        )}
      </section>
    </main>
  );
}

function ServiceProviderCard({ project }: { project: any }) {
  return (
    <Link href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
      <article style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", transition: "transform 180ms cubic-bezier(0.23, 1, 0.32, 1), border-color 180ms cubic-bezier(0.23, 1, 0.32, 1)" }}>
        <div style={{ height: "145px", position: "relative", overflow: "hidden" }}>
          {project.featuredImageUrl ? <img src={getMediaUrl(project.featuredImageUrl)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0d2a5e, #05152e)" }} />}
          <span style={{ position: "absolute", top: "0.7rem", left: "0.7rem", background: "rgba(44,125,247,0.9)", color: "#fff", borderRadius: "3px", padding: "0.22rem 0.5rem", fontSize: "0.57rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.09em" }}>Community Services</span>
        </div>
        <div style={{ padding: "1.1rem", display: "flex", flexDirection: "column", flex: 1 }}>
          <h3 style={{ color: "#fff", fontSize: "1.05rem", margin: "0 0 0.55rem", fontWeight: 800 }}>{project.title}</h3>
          <p style={{ color: "rgba(255,255,255,0.63)", fontSize: "0.82rem", lineHeight: 1.6, margin: "0 0 1rem", flex: 1 }}>{project.shortDescription || project.excerpt || ""}</p>
          <span style={{ color: "#79afff", fontSize: "0.76rem", fontWeight: 800 }}>View profile <ArrowRight size={13} style={{ verticalAlign: "middle" }} /></span>
        </div>
      </article>
    </Link>
  );
}
