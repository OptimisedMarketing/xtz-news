import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { Home, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";
import CategoryFollowButton from "@/components/CategoryFollowButton";
import { useSEO } from "@/hooks/useSEO";
import RelatedArticles from "@/components/RelatedArticles";

const PAGE_SIZE = 12;

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: category } = trpc.categories.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const catName = category?.name || (slug || "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  useSEO({
    title: `${catName} News | XTZ.News — Tezos ${catName} Updates`,
    description: `The latest Tezos ${catName.toLowerCase()} news and updates. Stay informed on ${catName.toLowerCase()} developments in the Tezos blockchain ecosystem.`,
    keywords: `Tezos ${catName.toLowerCase()}, XTZ ${catName.toLowerCase()}, Tezos ${catName.toLowerCase()} news, Tezos blockchain ${catName.toLowerCase()}`,
    canonical: `https://xtz.news/category/${slug || ""}`,
  });

  const { data, isLoading } = trpc.posts.byCategory.useQuery(
    { slug: slug || "", limit: loadedCount, offset: 0 },
    { enabled: !!slug }
  );

  const allPosts = data?.posts ?? [];
  const total = data?.total ?? 0;

  // Client-side filter and sort
  const posts = allPosts
    .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime();
      if (sortBy === 'popular') return (b.viewCount || 0) - (a.viewCount || 0);
      return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
    });

  const hasMore = allPosts.length < total;

  // Clear loading state when new data arrives
  useEffect(() => {
    if (!isLoading) setLoadingMore(false);
  }, [isLoading, posts.length]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setLoadedCount((c) => c + PAGE_SIZE);
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "3rem 0 2rem" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.35rem", marginBottom: "1rem", fontSize: "0.8rem", fontWeight: 600 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}>
              <Home size={13} />
            </Link>
            <ChevronRight size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <Link href="/categories" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>Categories</Link>
            <ChevronRight size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.85)" }}>{category?.name || slug?.replace(/-/g, " ")}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.02em", margin: 0 }}>
              {category?.name || slug?.replace(/-/g, " ")}
            </h1>
            {category && <CategoryFollowButton categoryId={category.id} categoryName={category.name} />}
          </div>
          {total > 0 && (
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>
              {total} articles
            </p>
          )}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div style={{ background: '#05152e', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search in this category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: '1 1 200px', minWidth: '160px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '0.45rem 0.75rem', color: '#fff', fontSize: '0.82rem', outline: 'none' }}
          />
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {(['newest', 'oldest', 'popular'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', border: sortBy === s ? '1px solid #2c7df7' : '1px solid rgba(255,255,255,0.15)', background: sortBy === s ? '#2c7df7' : 'transparent', color: sortBy === s ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.15s' }}
              >{s}</button>
            ))}
          </div>
          {searchQuery && (
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{posts.length} results</span>
          )}
        </div>
      </div>

      {/* Posts grid */}
      <div className="container" style={{ padding: "2.5rem 1.25rem" }}>
        {isLoading && posts.length === 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "260px", borderRadius: "4px" }} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} variant="default" />
              ))}
            </div>

            {/* Load More button — centred, no page numbers */}
            {hasMore && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3rem", gap: "0.75rem" }}>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>
                  Showing {posts.length} of {total} articles
                </p>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore || isLoading}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.875rem 2.5rem",
                    background: "transparent",
                    border: "2px solid #2c7df7",
                    borderRadius: "3px",
                    color: "#2c7df7",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    opacity: loadingMore ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMore) {
                      (e.currentTarget as HTMLElement).style.background = "#2c7df7";
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#2c7df7";
                  }}
                >
                  {loadingMore ? (
                    <><Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} /> Loading...</>
                  ) : (
                    <><ChevronDown size={15} /> Load More Articles</>
                  )}
                </button>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* All loaded message */}
            {!hasMore && total > PAGE_SIZE && (
              <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
                  All {total} articles loaded
                </p>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No articles found in this category.</p>
          </div>
        )}
      </div>

      {/* Related Articles from other categories */}
      {category && (
        <div className="container" style={{ padding: "0 1.25rem 4rem" }}>
          <RelatedArticles
            postId={0}
            categoryIds={category.id ? [category.id] : []}
            categoryName={category.name}
            categorySlug={slug || ""}
            limit={6}
            heading={`More ${category.name} News`}
            subHeading="Keep reading"
          />
        </div>
      )}
    </div>
  );
}
