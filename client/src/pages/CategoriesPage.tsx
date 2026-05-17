import { Link } from "wouter";
import { Tag } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = trpc.categories.all.useQuery();
  const active = categories.filter((c) => (c.postCount ?? 0) > 0);

  return (
    <div>
      <div className="py-12 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container">
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">All Categories</h1>
          <p className="text-sm text-white/40 mt-2">{active.length} categories</p>
        </div>
      </div>

      <div className="container py-10">
        {isLoading ? (
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="skeleton h-8 w-24 rounded" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {active.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-2 px-4 py-2 rounded border border-white/15 text-sm font-semibold text-white/70 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all"
              >
                <Tag size={12} className="text-blue-400" />
                {cat.name}
                <span className="text-xs text-white/30 ml-1">({cat.postCount})</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
