import { trpc } from "@/lib/trpc";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
}

export default function TimelinePage() {
  const { data: posts = [], isLoading } = trpc.posts.latest.useQuery({ limit: 50 });

  // Group by year
  const grouped: Record<string, typeof posts> = {};
  for (const post of posts) {
    const year = post.publishedAt ? new Date(post.publishedAt).getFullYear().toString() : "Unknown";
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  }
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div>
      <div className="py-12 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container">
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">Timeline</h1>
          <p className="text-sm text-white/40 mt-2">A chronological history of Tezos news</p>
        </div>
      </div>

      <div className="container py-10">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-20 rounded" />)}
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
            <div className="space-y-10">
              {years.map((year) => (
                <div key={year}>
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0"
                      style={{ background: "var(--xtz-blue)" }}
                    >
                      {year.slice(2)}
                    </div>
                    <h2 className="text-xl font-black text-white">{year}</h2>
                  </div>
                  <div className="md:ml-20 space-y-3">
                    {grouped[year].map((post) => (
                      <a
                        key={post.id}
                        href={`/${post.slug}`}
                        className="flex items-start gap-4 p-4 rounded hover:bg-white/5 transition-colors group"
                        style={{ background: "var(--card-bg)" }}
                      >
                        {post.featuredImageUrl && (
                          <img src={post.featuredImageUrl} alt="" className="w-16 h-12 object-cover rounded shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/40 mb-1">{formatDate(post.publishedAt)}</p>
                          <h3 className="font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2 text-sm">
                            {post.title}
                          </h3>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
