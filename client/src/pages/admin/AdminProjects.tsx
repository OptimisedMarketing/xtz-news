import { Link } from "wouter";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminProjects() {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = trpc.projects.adminList.useQuery();

  if (!user || user.role !== "admin") {
    return <div className="container py-16 text-center"><p className="text-white/50">Access denied.</p></div>;
  }

  return (
    <div>
      <div className="py-8 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container flex items-center gap-3">
          <Link href="/admin" className="text-white/40 hover:text-white"><ChevronLeft size={18} /></Link>
          <h1 className="text-xl font-black text-white">Projects</h1>
          <span className="text-sm text-white/40 ml-2">({projects.length})</span>
        </div>
      </div>
      <div className="container py-6">
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="p-4 rounded" style={{ background: "var(--card-bg)", border: "1px solid var(--xtz-border)" }}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {p.category && <span className="cat-tag mb-2 inline-flex">{p.category}</span>}
                    <h3 className="font-bold text-white text-sm">{p.title}</h3>
                    <p className="text-xs text-white/30 mt-1">{p.slug}</p>
                  </div>
                  {p.featuredImageUrl && <img src={p.featuredImageUrl} alt="" className="w-12 h-10 object-cover rounded shrink-0" />}
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/project/${p.slug}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1"><ExternalLink size={11} /> View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
