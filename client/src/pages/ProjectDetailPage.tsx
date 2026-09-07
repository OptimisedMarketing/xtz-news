import { useParams, Link } from "wouter";
import { ExternalLink, Globe, ChevronRight, Home, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO, buildWebPageSchema } from "@/hooks/useSEO";
import { getMediaUrl } from "@/lib/mediaUrl";
import TezOracleSharePanel from "@/components/TezOracleSharePanel";
import TezOracleStatusPanel from "@/components/TezOracleStatusPanel";
import KentoSharePanel from "@/components/KentoSharePanel";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = trpc.projects.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );
  const isTezOracleProject = slug === "tezoracle";
  const isKentoProject = slug === "kento";
  const { data: tezoracleStatus } = trpc.projects.tezoracleStatus.useQuery(undefined, {
    enabled: isTezOracleProject,
    staleTime: 60_000,
  });
  useSEO({
    title: project ? `${project.title} — Tezos Project | XTZ.News` : "Tezos Project | XTZ.News",
    description: project?.excerpt?.replace(/<[^>]*>/g, "").slice(0, 155) || "Explore Tezos ecosystem projects on XTZ.News.",
    keywords: project ? `${project.title}, Tezos project, XTZ ecosystem` : "Tezos projects, XTZ ecosystem",
    canonical: project ? `https://xtz.news/projects/${project.slug}` : "https://xtz.news/projects",
    ogImage: project?.featuredImageUrl || undefined,
  });

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
          ? `linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(5,21,46,0.97) 100%), url('${getMediaUrl(project.featuredImageUrl)}') center/cover no-repeat`
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
                <img src={getMediaUrl(project.featuredImageUrl)} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
              {isTezOracleProject && <TezOracleSharePanel contentType="project" title="TezOracle — Tezos-native oracle infrastructure" url="https://xtz.news/projects/tezoracle" />}
              {isKentoProject && <KentoSharePanel contentType="project" title="Kento — physical art cards from the objkt team" url="https://xtz.news/projects/kento" />}
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
            {isKentoProject && <Link href="/art-on-tezos" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "1.15rem", color: "#f9a8d4", fontSize: "0.78rem", fontWeight: 800, textDecoration: "none" }}>Explore the Art on Tezos collection <ChevronRight size={14} /></Link>}
          </div>

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <InfoCard label="Category" value={project.category || "—"} />
            <InfoCard label="Status" value={isTezOracleProject ? "In development" : "✅ Live & Verified"} />
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

          {isTezOracleProject && <TezOracleStatusPanel status={tezoracleStatus} />}

          {/* GitHub activity */}
          {(project as any).github && <GitHubActivity githubUrl={(project as any).github} projectTitle={project.title} />}

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
                  src={getMediaUrl(post.featuredImageUrl)}
                  alt={post.title}
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

function GitHubActivity({ githubUrl, projectTitle }: { githubUrl: string; projectTitle: string }) {
  const { data: commits = [], isLoading } = trpc.projects.githubCommits.useQuery(
    { githubUrl },
    { enabled: !!githubUrl, staleTime: 5 * 60 * 1000 }
  );

  const fmt = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.75rem" }}>
        <h2 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", margin: "0 0 1.25rem", borderBottom: "2px solid #2c7df7", paddingBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          Recent Development Activity
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
              <div className="skeleton" style={{ width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: "13px", borderRadius: "3px", width: `${60 + i * 10}%`, marginBottom: "0.4rem" }} />
                <div className="skeleton" style={{ height: "10px", borderRadius: "3px", width: "30%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!commits.length) return null;

  // Extract repo info from URL
  const repoMatch = githubUrl.match(/github\.com\/([^/]+\/[^/\s?#]+)/);
  const repoPath = repoMatch ? repoMatch[1].replace(/\.git$/, "") : null;

  return (
    <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "2px solid #2c7df7" }}>
        <h2 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          Recent Development Activity
        </h2>
        {repoPath && (
          <a href={githubUrl} target="_blank" rel="nofollow noopener noreferrer"
            style={{ fontSize: "0.7rem", color: "#2c7df7", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
          >
            {repoPath} →
          </a>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {(commits as any[]).map((commit, i) => (
          <a key={commit.sha} href={commit.url} target="_blank" rel="nofollow noopener noreferrer"
            style={{ textDecoration: "none", display: "flex", gap: "0.875rem", alignItems: "flex-start", padding: "0.875rem 0", borderBottom: i < commits.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", transition: "background 0.15s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.04)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            {/* Commit dot */}
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2c7df7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <line x1="1.05" y1="12" x2="7" y2="12"/>
                <line x1="17.01" y1="12" x2="22.96" y2="12"/>
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "rgba(255,255,255,0.8)", margin: "0 0 0.25rem", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {commit.message}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{commit.author}</span>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>·</span>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{fmt(commit.date)}</span>
                <code style={{ fontSize: "0.6rem", color: "#2c7df7", background: "rgba(44,125,247,0.1)", padding: "1px 5px", borderRadius: "3px", fontFamily: "monospace" }}>{commit.sha}</code>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
