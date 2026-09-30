import { useEffect, useMemo, useState } from "react";
import { CalendarDays, GalleryVerticalEnd, Layers3, SlidersHorizontal } from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import PostCard, { type PostCardData } from "@/components/PostCard";

export const ART_ARCHIVE_FILTERS = [
  { id: "all", label: "All coverage", description: "Every published art story" },
  { id: "recaps", label: "Weekly recaps", description: "Official Art on Tezos round-ups" },
  { id: "exhibitions", label: "Exhibitions", description: "Shows, institutions and installations" },
  { id: "releases", label: "Artist releases", description: "Works, projects and collecting updates" },
] as const;

export type ArtArchiveFilter = (typeof ART_ARCHIVE_FILTERS)[number]["id"];
export type ArtArchiveType = Exclude<ArtArchiveFilter, "all">;

type ArchiveCategory = { id: number; name: string; slug: string };
export type ArtArchivePost = PostCardData & {
  categories?: ArchiveCategory[];
  tags?: Array<{ name: string; slug: string }>;
};

const VALID_FILTERS = new Set<ArtArchiveFilter>(ART_ARCHIVE_FILTERS.map((filter) => filter.id));

export function getArtArchiveFilter(search: string): ArtArchiveFilter {
  const type = new URLSearchParams(search).get("type");
  return type && VALID_FILTERS.has(type as ArtArchiveFilter) ? (type as ArtArchiveFilter) : "all";
}

export function getArtArchiveType(post: ArtArchivePost): ArtArchiveType {
  const titleAndExcerpt = `${post.title} ${post.excerpt ?? ""}`.toLowerCase();
  const categorySlugs = post.categories?.map((category) => category.slug.toLowerCase()) ?? [];
  const tagSlugs = post.tags?.map((tag) => tag.slug.toLowerCase()) ?? [];

  if (/\b(art on tezos\s+(?:weekly|friday)?\s*recap|art recap|weekly recap)\b/.test(titleAndExcerpt)) {
    return "recaps";
  }

  if (
    categorySlugs.includes("exhibition") ||
    tagSlugs.includes("exhibitions") ||
    /\b(exhibition|museum|gallery|installation|biennale|art basel|art salon|show)\b/.test(titleAndExcerpt)
  ) {
    return "exhibitions";
  }

  return "releases";
}

export function filterArtArchivePosts(posts: ArtArchivePost[], filter: ArtArchiveFilter): ArtArchivePost[] {
  return filter === "all" ? posts : posts.filter((post) => getArtArchiveType(post) === filter);
}

function filterIcon(filter: ArtArchiveFilter) {
  if (filter === "recaps") return CalendarDays;
  if (filter === "exhibitions") return GalleryVerticalEnd;
  if (filter === "releases") return Layers3;
  return SlidersHorizontal;
}

export default function ArtArchiveFilters({ posts, isLoading }: { posts: ArtArchivePost[]; isLoading?: boolean }) {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState<ArtArchiveFilter>(() => getArtArchiveFilter(search));

  useEffect(() => {
    setActiveFilter(getArtArchiveFilter(search));
  }, [search]);

  const sortedPosts = useMemo(
    () => [...posts].sort((left, right) => new Date(right.publishedAt ?? 0).getTime() - new Date(left.publishedAt ?? 0).getTime()),
    [posts],
  );
  const filteredPosts = useMemo(() => filterArtArchivePosts(sortedPosts, activeFilter), [sortedPosts, activeFilter]);
  const counts = useMemo(
    () => Object.fromEntries(ART_ARCHIVE_FILTERS.map((filter) => [filter.id, filterArtArchivePosts(sortedPosts, filter.id).length])) as Record<ArtArchiveFilter, number>,
    [sortedPosts],
  );

  const selectFilter = (filter: ArtArchiveFilter) => {
    setActiveFilter(filter);
    setLocation(filter === "all" ? "/art" : `/art?type=${filter}`);
  };

  const activeLabel = ART_ARCHIVE_FILTERS.find((filter) => filter.id === activeFilter)?.label ?? "All coverage";

  return (
    <section id="art-news-archive" style={{ padding: "3rem 0", background: "#000" }} aria-labelledby="art-news-archive-title">
      <div className="container">
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "4px", height: "28px", background: "#2c7df7", borderRadius: "2px" }} />
            <div>
              <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2c7df7" }}>Browse by story type</p>
              <h2 id="art-news-archive-title" style={{ margin: "0.15rem 0 0", fontSize: "1.25rem", fontWeight: 900, color: "#fff" }}>Art on Tezos news archive</h2>
            </div>
          </div>
          <Link href="/art-on-tezos" style={{ color: "#8abaff", fontSize: "0.78rem", fontWeight: 800, textDecoration: "none" }}>Open the Art on Tezos hub →</Link>
        </div>
        <p style={{ margin: "0 0 1.15rem", maxWidth: "680px", color: "rgba(255,255,255,0.56)", fontSize: "0.84rem", lineHeight: 1.55 }}>Use a clear story type to move between weekly round-ups, exhibitions, and artist or project releases without losing the wider Tezos art archive.</p>

        <div role="group" aria-label="Filter Art on Tezos archive" style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginBottom: "1.25rem" }}>
          {ART_ARCHIVE_FILTERS.map((filter) => {
            const Icon = filterIcon(filter.id);
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => selectFilter(filter.id)}
                aria-pressed={isActive}
                title={filter.description}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", minHeight: "40px", padding: "0.5rem 0.8rem", borderRadius: "999px", cursor: "pointer", border: isActive ? "1px solid #2c7df7" : "1px solid rgba(255,255,255,0.16)", background: isActive ? "rgba(44,125,247,0.18)" : "rgba(255,255,255,0.025)", color: isActive ? "#9bc1ff" : "rgba(255,255,255,0.7)", fontSize: "0.74rem", fontWeight: 800 }}
              >
                <Icon size={14} aria-hidden="true" /> {filter.label} <span aria-label={`${counts[filter.id]} articles`} style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.42)" }}>{counts[filter.id]}</span>
              </button>
            );
          })}
        </div>

        <p aria-live="polite" style={{ margin: "0 0 1rem", color: "rgba(255,255,255,0.44)", fontSize: "0.76rem" }}>{filteredPosts.length} {activeLabel.toLowerCase()} article{filteredPosts.length === 1 ? "" : "s"} shown</p>

        {isLoading ? (
          <div aria-label="Loading Art on Tezos archive" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            <div className="skeleton" style={{ height: "260px", borderRadius: "8px" }} />
            <div className="skeleton" style={{ height: "260px", borderRadius: "8px" }} />
            <div className="skeleton" style={{ height: "260px", borderRadius: "8px" }} />
          </div>
        ) : filteredPosts.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {filteredPosts.map((post) => <PostCard key={post.id} post={post} variant="default" />)}
          </div>
        ) : (
          <div style={{ padding: "2rem", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "8px", background: "rgba(5,21,46,0.56)", color: "rgba(255,255,255,0.62)" }}>
            <strong style={{ display: "block", color: "#fff", marginBottom: "0.35rem" }}>No {activeLabel.toLowerCase()} articles are published yet.</strong>
            Try another story type or return to all coverage.
          </div>
        )}
      </div>
    </section>
  );
}
