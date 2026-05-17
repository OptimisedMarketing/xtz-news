import { useParams, Link } from "wouter";
import { Home, ChevronRight, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = trpc.projects.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="container py-16 max-w-3xl mx-auto space-y-4">
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton h-64 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
        <Link href="/projects" className="btn-primary">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div>
      {project.featuredImageUrl && (
        <div className="w-full" style={{ maxHeight: "400px", overflow: "hidden" }}>
          <img src={project.featuredImageUrl} alt={project.title} className="w-full object-cover" style={{ maxHeight: "400px" }} />
        </div>
      )}
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <nav className="breadcrumb mb-5">
            <Link href="/"><Home size={12} /></Link>
            <ChevronRight size={10} className="breadcrumb-sep" />
            <Link href="/projects" className="hover:text-white">Projects</Link>
            <ChevronRight size={10} className="breadcrumb-sep" />
            <span className="text-white/60">{project.title}</span>
          </nav>
          {project.category && <span className="cat-tag mb-3 inline-flex">{project.category.toUpperCase()}</span>}
          <h1 className="text-3xl font-black text-white mb-4">{project.title}</h1>
          {project.websiteUrl && (
            <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mb-6 inline-flex">
              <ExternalLink size={14} /> Visit Website
            </a>
          )}
          <div className="post-content" dangerouslySetInnerHTML={{ __html: project.content || "" }} />
          <div className="mt-8">
            <Link href="/projects" className="btn-read-more">← Back to Projects</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
