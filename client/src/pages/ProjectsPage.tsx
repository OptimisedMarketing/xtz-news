import { useState } from "react";
import { Link } from "wouter";
import { ExternalLink, Twitter, Facebook, Linkedin, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";

const PROJECT_CATEGORIES = ["All", "DeFi", "NFT", "Payments", "Baking", "Games", "Authentication", "Real-World Usecase"];

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: projects = [], isLoading } = trpc.projects.all.useQuery({
    category: activeCategory === "All" ? undefined : activeCategory,
  });

  // Get unique categories from projects
  const { data: allProjects = [] } = trpc.projects.all.useQuery({});
  const availableCategories = ["All", ...Array.from(new Set(allProjects.map((p) => p.category).filter(Boolean) as string[]))];

  return (
    <div>
      {/* Header */}
      <div
        className="py-16 border-b border-white/10"
        style={{ background: "var(--xtz-navy)" }}
      >
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-black text-white uppercase tracking-wide mb-4">
            TEZOS PROJECTS
          </h1>
          <p className="text-sm text-white/60 leading-relaxed mb-6">
            Welcome to XTZ News Tezos Projects, where we showcase the most innovative and groundbreaking
            projects in the Tezos ecosystem. Each entry here is a deep dive into the projects that are
            driving the future of blockchain technology, DeFi, NFTs, gaming, and more.
          </p>
          <Link href="#projects" className="btn-primary">
            VIEW PROJECTS
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        id="projects"
        className="border-b border-white/10 sticky top-[96px] z-30"
        style={{ background: "var(--header-mid-bg)" }}
      >
        <div className="container overflow-x-auto">
          <div className="flex items-center gap-0 py-1 min-w-max">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <div className="container py-10">
        <h2 className="section-title mb-6">EXPLORE PROJECTS</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-48 rounded" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <article
                key={project.id}
                className="news-card flex flex-col md:flex-row gap-0 overflow-hidden"
              >
                {/* Image */}
                <div className="md:w-48 shrink-0">
                  {project.featuredImageUrl ? (
                    <img
                      src={project.featuredImageUrl}
                      alt={project.title}
                      className="w-full h-40 md:h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-40 md:h-full flex items-center justify-center"
                      style={{ background: "var(--xtz-navy)" }}
                    >
                      <span className="text-white/20 text-xs font-bold uppercase">Project</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                  {project.category && (
                    <span className="cat-tag self-start mb-2">{project.category.toUpperCase()}</span>
                  )}
                  <h3 className="font-bold text-white text-lg mb-2">
                    <Link href={`/project/${project.slug}`} className="hover:text-blue-300 transition-colors">
                      {project.title}
                    </Link>
                  </h3>
                  {project.excerpt && (
                    <p className="text-sm text-white/50 line-clamp-2 flex-1">
                      {stripHtml(project.excerpt)}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
                    <Link href={`/project/${project.slug}`} className="btn-read-more text-xs py-1.5 px-3">
                      MORE INFO
                    </Link>
                    <div className="flex items-center gap-1.5">
                      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title)}`} target="_blank" rel="noopener noreferrer" className="share-btn w-7 h-7"><Twitter size={11} /></a>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://xtz.news/project/${project.slug}`)}`} target="_blank" rel="noopener noreferrer" className="share-btn w-7 h-7"><Facebook size={11} /></a>
                      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://xtz.news/project/${project.slug}`)}`} target="_blank" rel="noopener noreferrer" className="share-btn w-7 h-7"><Linkedin size={11} /></a>
                      <a href={`https://t.me/share/url?url=${encodeURIComponent(`https://xtz.news/project/${project.slug}`)}`} target="_blank" rel="noopener noreferrer" className="share-btn w-7 h-7"><Send size={11} /></a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-white/40">No projects found in this category.</p>
          </div>
        )}

        {/* Submit project CTA */}
        <div
          className="mt-12 p-8 rounded text-center"
          style={{ background: "var(--section-bg-alt)", border: "1px solid var(--xtz-border)" }}
        >
          <h3 className="text-xl font-bold text-white mb-3">Submit a Project</h3>
          <p className="text-sm text-white/60 mb-5 max-w-md mx-auto">
            Submit your Tezos project to XTZ.news to have your project featured on the website.
            We only allow projects that are presently interacting with the Tezos ecosystem.
          </p>
          <Link href="/submit-article" className="btn-primary">
            Submit a Project
          </Link>
        </div>
      </div>
    </div>
  );
}
