import { useParams, Link } from "wouter";
import { ExternalLink, Globe, ChevronRight, Home, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: project, isLoading, error } = trpc.projects.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div style={{ background: "#000", minHeight: "100vh" }}>
        <div className="container" style={{ padding: "3rem 1.25rem" }}>
          <div className="skeleton" style={{ height: "300px", borderRadius: "8px", marginBottom: "1.5rem" }} />
          <div className="skeleton" style={{ height: "200px", borderRadius: "8px" }} />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 900, marginBottom: "1rem" }}>Project Not Found</h1>
          <Link href="/projects" style={{ color: "#2c7df7", textDecoration: "none" }}>← Back to Projects</Link>
        </div>
      </div>
    );
  }

  const tags: string[] = (() => { try { return JSON.parse((project as any).tags || "[]"); } catch { return []; } })();

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        background: project.featuredImageUrl
          ? `linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(5,21,46,0.97) 100%), url('${project.featuredImageUrl}') center/cover no-repeat`
          : "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)",
        borderBottom: "1px solid rgba(44,125,247,0.2)",
        padding: "3rem 0 2.5rem",
      }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.35rem", marginBottom: "1.5rem", fontSize: "0.78rem", fontWeight: 600 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}><Home size={13} /></Link>
            <ChevronRight size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <Link href="/projects" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>Projects</Link>
            <ChevronRight size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.85)" }}>{project.title}</span>
          </nav>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "1.5rem" }}>
            {/* Logo */}
            <div style={{ width: "80px", height: "80px", borderRadius: "12px", overflow: "hidden", flexShrink: 0, background: "#05152e", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {project.featuredImageUrl ? (
                <img src={project.featuredImageUrl} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Globe size={32} style={{ color: "rgba(44,125,247,0.5)" }} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2c7df7", background: "rgba(44,125,247,0.1)", padding: "3px 10px", borderRadius: "2px", display: "inline-block", marginBottom: "0.75rem" }}>
                {project.category}
              </span>
              <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", margin: "0 0 0.75rem", lineHeight: 1.15 }}>
                {project.title}
              </h1>
              {tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.25rem" }}>
                  {tags.map((tag) => (
                    <span key={tag} style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.07)", padding: "3px 8px", borderRadius: "2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{tag}</span>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {project.websiteUrl && (
                  <a href={project.websiteUrl} target="_blank" rel="nofollow noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.5rem", background: "#2c7df7", borderRadius: "3px", color: "#fff", textDecoration: "none", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a6ae0")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c7df7")}
                  >
                    <Globe size={14} /> Visit Website
                  </a>
                )}
                {(project as any).twitter && (
                  <a href={(project as any).twitter} target="_blank" rel="nofollow noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", background: "rgba(29,161,242,0.15)", border: "1px solid rgba(29,161,242,0.4)", borderRadius: "3px", color: "#1DA1F2", textDecoration: "none", fontSize: "0.8rem", fontWeight: 700 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1DA1F2"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(29,161,242,0.15)"; (e.currentTarget as HTMLElement).style.color = "#1DA1F2"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: "2.5rem 1.25rem 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {/* Main description */}
          <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.75rem" }}>
            <h2 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", margin: "0 0 1rem", borderBottom: "2px solid #2c7df7", paddingBottom: "0.75rem" }}>
              About {project.title}
            </h2>
            <div
              className="post-content"
              style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.75 }}
              dangerouslySetInnerHTML={{ __html: project.content || project.excerpt || "" }}
            />
          </div>

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <InfoCard label="Category" value={project.category || "—"} />
            <InfoCard label="Status" value="✅ Live & Verified" />
            {project.websiteUrl && (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.25rem" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", margin: "0 0 0.5rem" }}>Website</p>
                <a href={project.websiteUrl} target="_blank" rel="nofollow noopener noreferrer" style={{ fontSize: "0.85rem", color: "#2c7df7", textDecoration: "none", wordBreak: "break-all", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <ExternalLink size={12} />
                  {project.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              </div>
            )}
          </div>

          {/* Related news */}
          <RelatedNews projectName={project.title} />

          {/* Back link */}
          <div>
            <Link href="/projects"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
            >
              <ArrowLeft size={14} /> Back to All Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.25rem" }}>
      <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", margin: "0 0 0.4rem" }}>{label}</p>
      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", margin: 0, fontWeight: 600 }}>{value}</p>
    </div>
  );
}

function RelatedNews({ projectName }: { projectName: string }) {
  const { data } = trpc.posts.search.useQuery({ q: projectName, limit: 4 });
  const posts = Array.isArray(data) ? data : (data as any)?.posts ?? [];
  if (!posts.length) return null;

  return (
    <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.75rem" }}>
      <h2 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", margin: "0 0 1.25rem", borderBottom: "2px solid #2c7df7", paddingBottom: "0.75rem" }}>
        Related News
      </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {posts.map((post: any) => (
          <Link key={post.id} href={`/${post.slug}`} style={{ textDecoration: "none", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <div style={{ width: "60px", height: "45px", borderRadius: "4px", flexShrink: 0, overflow: "hidden", background: "#05152e" }}>
              {post.featuredImageUrl && (
                <img
                  src={post.featuredImageUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>
            <div>
              <h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.4 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)")}
              >{post.title}</h4>
              {post.publishedAt && (
                <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", margin: "0.2rem 0 0" }}>
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
