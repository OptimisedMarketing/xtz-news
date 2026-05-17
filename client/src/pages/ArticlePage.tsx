import { useParams, Link } from "wouter";
import { Twitter, Facebook, Linkedin, Send, Copy, Home, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";
import { toast } from "sonner";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => toast.success("Link copied!"));
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-widest text-white/40 mr-1">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-btn"
        aria-label="Share on Twitter"
      >
        <Twitter size={13} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-btn"
        aria-label="Share on Facebook"
      >
        <Facebook size={13} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-btn"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={13} />
      </a>
      <a
        href={`https://t.me/share/url?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-btn"
        aria-label="Share on Telegram"
      >
        <Send size={13} />
      </a>
      <button onClick={copyLink} className="share-btn" aria-label="Copy link">
        <Copy size={13} />
      </button>
    </div>
  );
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = trpc.posts.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data: related = [] } = trpc.posts.related.useQuery(
    {
      postId: post?.id ?? 0,
      categoryIds: post?.categories?.map((c) => c.id) ?? [],
      limit: 4,
    },
    { enabled: !!post }
  );

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-64 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-4/5" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
        <p className="text-white/50 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="btn-primary">
          <Home size={14} /> Back to Home
        </Link>
      </div>
    );
  }

  const pageUrl = typeof window !== "undefined" ? window.location.href : `https://xtz.news/${slug}`;

  return (
    <article>
      {/* Featured image hero — capped at 220px on mobile, 480px on desktop */}
      {post.featuredImageUrl && (
        <div
          className="w-full"
          style={{ maxHeight: "clamp(220px, 40vw, 480px)", overflow: "hidden" }}
        >
          <img
            src={post.featuredImageUrl}
            alt={post.featuredImageAlt || post.title}
            className="w-full object-cover"
            style={{ maxHeight: "clamp(220px, 40vw, 480px)" }}
          />
        </div>
      )}

      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="breadcrumb mb-5">
            <Link href="/" className="hover:text-white transition-colors">
              <Home size={12} />
            </Link>
            <ChevronRight size={10} className="breadcrumb-sep" />
            {post.categories?.[0] && (
              <>
                <Link
                  href={`/category/${post.categories[0].slug}`}
                  className="hover:text-white transition-colors capitalize"
                >
                  {post.categories[0].name}
                </Link>
                <ChevronRight size={10} className="breadcrumb-sep" />
              </>
            )}
            <span className="text-white/60 truncate max-w-xs">{post.title}</span>
          </nav>

          {/* Category tags */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="cat-tag">
                  {cat.name.toUpperCase()}
                </Link>
              ))}
            </div>
          )}

          {/* Title — responsive size: smaller on mobile, larger on desktop */}
          <h1
            className="font-black text-white leading-tight mb-4"
            style={{ fontSize: "clamp(1.2rem, 4vw, 1.875rem)", lineHeight: 1.25 }}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "var(--xtz-blue)" }}
              >
                X
              </div>
              <span className="text-sm font-semibold text-white/70">XTZ News</span>
            </div>
            <span className="text-sm text-white/40">{formatDate(post.publishedAt)}</span>
            <ShareButtons title={post.title} url={pageUrl} />
          </div>

          {/* Disclaimer */}
          <div
            className="flex items-start gap-2 p-3 rounded mb-6 text-xs text-white/50"
            style={{ background: "rgba(44,125,247,0.06)", border: "1px solid rgba(44,125,247,0.15)" }}
          >
            <span className="text-blue-400 font-bold shrink-0">ℹ</span>
            <span>
              Disclaimer: The information provided in this article is for informational purposes only and does not constitute financial advice. Always do your own research.
            </span>
          </div>

          {/* Content */}
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40 mr-1">Tags:</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="text-xs px-2.5 py-1 rounded border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Share again at bottom */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <ShareButtons title={post.title} url={pageUrl} />
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">RELATED ARTICLES</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <PostCard key={p.id} post={p} variant="default" />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
