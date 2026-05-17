import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search, X, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading } = trpc.posts.search.useQuery(
    { q: debouncedQuery, limit: 8 },
    { enabled: debouncedQuery.length >= 2 }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleResultClick = (slug: string) => {
    navigate(`/${slug}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-16 px-4"
      style={{ background: "rgba(5,21,46,0.95)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl rounded-lg border border-white/10 overflow-hidden shadow-2xl"
        style={{ background: "var(--card-bg)" }}
      >
        {/* Search input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 border-b border-white/10">
          <Search size={18} className="text-white/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, projects..."
            className="flex-1 bg-transparent text-white placeholder-white/30 text-base outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-white/40 hover:text-white">
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            className="btn-primary py-1.5 px-3 text-xs"
          >
            Search
          </button>
        </form>

        {/* Results */}
        {debouncedQuery.length >= 2 && (
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-white/40 text-sm">Searching...</div>
            ) : results && results.length > 0 ? (
              <ul>
                {results.map((post) => (
                  <li key={post.id}>
                    <button
                      onClick={() => handleResultClick(post.slug)}
                      className="w-full flex items-start gap-3 p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5"
                    >
                      {post.featuredImageUrl && (
                        <img
                          src={post.featuredImageUrl}
                          alt=""
                          className="w-14 h-10 object-cover rounded shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">
                          {post.title}
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : ""}
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-white/30 shrink-0 mt-1" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-white/40 text-sm">
                No results found for &ldquo;{debouncedQuery}&rdquo;
              </div>
            )}
          </div>
        )}

        {/* Hint */}
        {debouncedQuery.length < 2 && (
          <div className="p-4 text-xs text-white/30 text-center">
            Type at least 2 characters to search
          </div>
        )}
      </div>
    </div>
  );
}
