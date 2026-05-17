import { Link } from "wouter";
import { ChevronLeft, Tag } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminCategories() {
  const { user } = useAuth();
  const { data: categories = [], isLoading } = trpc.categories.all.useQuery();

  if (!user || user.role !== "admin") {
    return <div className="container py-16 text-center"><p className="text-white/50">Access denied.</p></div>;
  }

  return (
    <div>
      <div className="py-8 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container flex items-center gap-3">
          <Link href="/admin" className="text-white/40 hover:text-white"><ChevronLeft size={18} /></Link>
          <h1 className="text-xl font-black text-white">Categories</h1>
          <span className="text-sm text-white/40 ml-2">({categories.length})</span>
        </div>
      </div>
      <div className="container py-6">
        {isLoading ? (
          <div className="flex flex-wrap gap-2">{Array.from({ length: 20 }).map((_, i) => <div key={i} className="skeleton h-8 w-24 rounded" />)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-3 rounded" style={{ background: "var(--card-bg)", border: "1px solid var(--xtz-border)" }}>
                <div className="flex items-center gap-2">
                  <Tag size={13} className="text-blue-400" />
                  <span className="font-semibold text-white text-sm">{cat.name}</span>
                </div>
                <span className="text-xs text-white/30">{cat.postCount} posts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
