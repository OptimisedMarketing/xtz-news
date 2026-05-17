import { useParams, Link } from "wouter";
import { useEffect } from "react";
import { Twitter, Facebook, Linkedin, Send, Copy, Home, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";
import AudioPlayer from "@/components/AudioPlayer";
import { toast } from "sonner";

/** Injects / updates Open Graph + Twitter Card meta tags in <head> */
function useOpenGraph(post: {
  title: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  slug: string;
  publishedAt?: Date | string | null;
  categories?: Array<{ name: string }> | null;
} | undefined) {
  useEffect(() => {
    if (!post) return;

    const siteUrl = "https://xtz.news";
    const url = `${siteUrl}/${post.slug}`;
    const title = `${post.title} | XTZ.News`;
    const description = post.excerpt
      ? post.excerpt.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim().slice(0, 160)
      : "The latest Tezos blockchain news, projects and updates.";
    const image = post.featuredImageUrl || `${siteUrl}/manus-storage/xtz-logo-square_c6689606.png`;

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setNameMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Page title
    document.title = title;

    // Open Graph
    setMeta("og:type", "article");
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:url", url);
    setMeta("og:image", image);
    setMeta("og:image:width", "1200");
    setMeta("og:image:height", "630");
    setMeta("og:site_name", "XTZ.News");
    if (post.publishedAt) {
      setMeta("article:published_time", new Date(post.publishedAt).toISOString());
    }
    if (post.categories?.[0]) {
      setMeta("article:section", post.categories[0].name);
    }

    // Twitter Card
    setNameMeta("twitter:card", "summary_large_image");
    setNameMeta("twitter:site", "@XTZNews");
    setNameMeta("twitter:title", title);
    setNameMeta("twitter:description", description);
    setNameMeta("twitter:image", image);

    // Standard meta
    setNameMeta("description", description);

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Reset title when leaving the page
    return () => {
      document.title = "XTZ.News — Tezos News";
    };
  }, [post?.slug]);
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface ShareButtonsProps {
  title: string;
  url: string;
  variant?: "compact" | "full";
}

function ShareButtons({ title, url, variant = "compact" }: ShareButtonsProps) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => toast.success("Link copied to clipboard!"));
  };

  const buttons = [
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
      icon: <Twitter size={variant === "full" ? 16 : 13} />,
      color: "#1DA1F2",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      icon: <Facebook size={variant === "full" ? 16 : 13} />,
      color: "#1877F2",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      icon: <Linkedin size={variant === "full" ? 16 : 13} />,
      color: "#0A66C2",
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encoded}&text=${encodedTitle}`,
      icon: <Send size={variant === "full" ? 16 : 13} />,
      color: "#26A5E4",
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
      icon: (
        <svg width={variant === "full" ? 16 : 13} height={variant === "full" ? 16 : 13} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      color: "#25D366",
    },
    {
      label: "Reddit",
      href: `https://reddit.com/submit?url=${encoded}&title=${encodedTitle}`,
      icon: (
        <svg width={variant === "full" ? 16 : 13} height={variant === "full" ? 16 : 13} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ),
      color: "#FF4500",
    },
  ];

  if (variant === "full") {
    return (
      <div style={{ padding: "1.5rem", background: "rgba(44,125,247,0.05)", border: "1px solid rgba(44,125,247,0.15)", borderRadius: "4px" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", marginBottom: "1rem" }}>
          Share this article
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {buttons.map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${btn.label}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.55rem 1rem",
                background: "rgba(255,255,255,0.06)",
                border: `1px solid rgba(255,255,255,0.12)`,
                borderRadius: "3px",
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                fontSize: "0.78rem",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = btn.color;
                (e.currentTarget as HTMLElement).style.borderColor = btn.color;
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
              }}
            >
              {btn.icon}
              {btn.label}
            </a>
          ))}
          <button
            onClick={copyLink}
            aria-label="Copy link"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.55rem 1rem",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "3px",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#2c7df7";
              (e.currentTarget as HTMLElement).style.borderColor = "#2c7df7";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
            }}
          >
            <Copy size={16} />
            Copy Link
          </button>
        </div>
      </div>
    );
  }

  // Compact variant (top of article)
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-widest text-white/40 mr-1">Share:</span>
      {buttons.map((btn) => (
        <a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn"
          aria-label={`Share on ${btn.label}`}
        >
          {btn.icon}
        </a>
      ))}
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

  // Inject Open Graph + Twitter Card meta tags
  useOpenGraph(post);

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

          {/* Audio Player — shown when article has audio narration */}
          {(post as any).audioUrl && (
            <AudioPlayer
              src={(post as any).audioUrl}
              title={post.title}
            />
          )}

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

          {/* Share again at bottom — full labelled variant */}
          <div className="mt-8">
            <ShareButtons title={post.title} url={pageUrl} variant="full" />
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section
            style={{
              marginTop: "3rem",
              paddingTop: "2.5rem",
              borderTop: "2px solid #2c7df7",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>RELATED ARTICLES</h2>
              {post.categories?.[0] && (
                <Link
                  href={`/category/${post.categories[0].slug}`}
                  className="btn-read-more"
                  style={{ fontSize: "0.65rem", padding: "0.4rem 1rem" }}
                >
                  MORE FROM {post.categories[0].name.toUpperCase()}
                </Link>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
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
