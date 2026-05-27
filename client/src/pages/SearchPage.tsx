import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";
import { useSEO } from "@/hooks/useSEO";

export default function SearchPage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialQ = params.get("q") || "";
  const [query, setQuery] = useState(initialQ);

  useSEO({
    title: query ? `Search: "${query}" | XTZ.News` : "Search Tezos News | XTZ.News",
    description: "Search thousands of Tezos news articles, project updates, DeFi news, NFT coverage, and blockchain developments on XTZ.News.",
    keywords: "search Tezos news, find Tezos articles, XTZ news search",
    canonical: "https://xtz.news/search",
  });
  const [debouncedQ, setDebouncedQ] = useState(initialQ);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const { data: results = [], isLoading } = trpc.posts.search.useQuery(
    { q: debouncedQ, limit: 20 },
    { enabled: debouncedQ.length >= 2 }
  );

  return (
    <div>
      <div className="py-10 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container">
          <h1 className="text-2xl font-black text-white mb-4">Search</h1>
          <div className="relative max-w-xl">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="search-input"
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="container py-10">
        {debouncedQ.length < 2 ? (
          <p className="text-white/40 text-center py-12">Enter at least 2 characters to search.</p>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-64 rounded" />)}
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-white/40 mb-5">{results.length} results for &ldquo;{debouncedQ}&rdquo;</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          </>
        ) : (
          <p className="text-white/40 text-center py-12">No results found for &ldquo;{debouncedQ}&rdquo;</p>
        )}
      </div>
    </div>
  );
}
