import { useParams, Link } from "wouter";
import { useState } from "react";
import { Home, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";

const PAGE_SIZE = 12;

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);

  const { data: category } = trpc.categories.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data, isLoading } = trpc.posts.byCategory.useQuery(
    { slug: slug || "", limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE },
    { enabled: !!slug }
  );

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      {/* Header */}
      <div
        className="py-12 border-b border-white/10"
        style={{ background: "var(--xtz-navy)" }}
      >
        <div className="container">
          <nav className="breadcrumb mb-3">
            <Link href="/" className="hover:text-white"><Home size={12} /></Link>
            <ChevronRight size={10} className="breadcrumb-sep" />
            <span className="text-white/60">Category</span>
            <ChevronRight size={10} className="breadcrumb-sep" />
            <span className="text-white/80">{category?.name || slug}</span>
          </nav>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">
            {category?.name || slug?.replace(/-/g, " ")}
          </h1>
          {total > 0 && (
            <p className="text-sm text-white/40 mt-2">{total} articles</p>
          )}
        </div>
      </div>

      {/* Posts grid */}
      <div className="container py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-64 rounded" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} variant="default" />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination mt-10">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="page-btn disabled:opacity-30"
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`page-btn ${page === p ? "active" : ""}`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="page-btn disabled:opacity-30"
                >
                  ›
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-white/40">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
