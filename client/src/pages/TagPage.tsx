import { useParams, Link } from "wouter";
import { useState } from "react";
import { Home, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";

const PAGE_SIZE = 12;

export default function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);

  const { data: tag } = trpc.tags.bySlug.useQuery({ slug: slug || "" }, { enabled: !!slug });
  const { data, isLoading } = trpc.posts.byTag.useQuery(
    { slug: slug || "", limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE },
    { enabled: !!slug }
  );

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="py-12 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container">
          <nav className="breadcrumb mb-3">
            <Link href="/"><Home size={12} /></Link>
            <ChevronRight size={10} className="breadcrumb-sep" />
            <span className="text-white/60">Tag</span>
            <ChevronRight size={10} className="breadcrumb-sep" />
            <span className="text-white/80">#{tag?.name || slug}</span>
          </nav>
          <h1 className="text-3xl font-black text-white">#{tag?.name || slug?.replace(/-/g, " ")}</h1>
          {total > 0 && <p className="text-sm text-white/40 mt-2">{total} articles</p>}
        </div>
      </div>

      <div className="container py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-64 rounded" />)}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
            {totalPages > 1 && (
              <div className="pagination mt-10">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="page-btn disabled:opacity-30">‹</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                  <button key={i + 1} onClick={() => setPage(i + 1)} className={`page-btn ${page === i + 1 ? "active" : ""}`}>{i + 1}</button>
                ))}
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="page-btn disabled:opacity-30">›</button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16"><p className="text-white/40">No articles found for this tag.</p></div>
        )}
      </div>
    </div>
  );
}
