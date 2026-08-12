import { useState } from "react";
import { Link } from "wouter";
import { Tag } from "lucide-react";
import { getMediaUrl } from "@/lib/mediaUrl";

export interface PostCardData {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  publishedAt?: Date | string | null;
  categories?: Array<{ id: number; name: string; slug: string }>;
}

interface PostCardProps {
  post: PostCardData;
  variant?: "default" | "hero" | "horizontal" | "compact";
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

/** Image with graceful fallback to navy placeholder on error */
function PostImage({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [failed, setFailed] = useState(false);
  // Don't show fallback for manus-storage URLs — they use 307 redirects which can
  // trigger onError in some browsers even when the image loads successfully
  const imageSrc = getMediaUrl(src);
  const isManus = imageSrc.startsWith('/media/');
  if (failed && !isManus) {
    return (
      <div className={className} style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" opacity="0.15">
          <rect width="40" height="40" rx="6" fill="#2c7df7"/>
          <text x="20" y="28" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="Arial">X</text>
        </svg>
      </div>
    );
  }
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => { if (!isManus) setFailed(true); }}
    />
  );
}

export default function PostCard({ post, variant = "default" }: PostCardProps) {
  const primaryCat = post.categories?.[0];
  const excerpt = post.excerpt ? stripHtml(post.excerpt).slice(0, 160) : "";

  if (variant === "hero") {
    return (
      <article className="relative h-full group overflow-hidden rounded">
        {/* Background image */}
        <div className="absolute inset-0">
          {post.featuredImageUrl ? (
            <PostImage
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full" style={{ background: "var(--xtz-navy)" }} />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5,21,46,0.95) 0%, rgba(5,21,46,0.5) 50%, transparent 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-5">
          {primaryCat && (
            <Link href={`/category/${primaryCat.slug}`} className="cat-tag mb-2 self-start">
              <Tag size={9} className="cat-tag-icon" />
              {primaryCat.name.toUpperCase()}
            </Link>
          )}
          <Link href={`/${post.slug}`}>
            <h2 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-blue-300 transition-colors line-clamp-3">
              {post.title}
            </h2>
          </Link>
          {excerpt && (
            <p className="text-sm text-white/60 line-clamp-2 mb-3">{excerpt}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">{formatDate(post.publishedAt)}</span>
            <Link href={`/${post.slug}`} className="btn-read-more text-xs py-1.5 px-3">
              READ MORE
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="flex gap-3 group">
        <Link href={`/${post.slug}`} className="shrink-0">
          {post.featuredImageUrl ? (
            <PostImage
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-20 h-14 object-cover rounded transition-opacity group-hover:opacity-80"
            />
          ) : (
            <div className="w-20 h-14 rounded flex items-center justify-center" style={{ background: "var(--xtz-navy)" }}>
              <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "0.5rem", fontWeight: 700 }}>XTZ</span>
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          {primaryCat && (
            <Link href={`/category/${primaryCat.slug}`} className="cat-tag mb-1 inline-flex">
              {primaryCat.name.toUpperCase()}
            </Link>
          )}
          <Link href={`/${post.slug}`}>
            <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="text-xs text-white/40 mt-1">{formatDate(post.publishedAt)}</p>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group">
        <Link href={`/${post.slug}`}>
          <h3 className="text-sm font-semibold text-white/80 leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-xs text-white/40 mt-1">{formatDate(post.publishedAt)}</p>
      </article>
    );
  }

  // Default card
  return (
    <article className="news-card group flex flex-col h-full">
      {/* Image */}
      <Link href={`/${post.slug}`} className="block overflow-hidden aspect-[16/9] shrink-0">
        {post.featuredImageUrl ? (
          <PostImage
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "var(--xtz-navy)" }}
          >
            <span className="text-white/20 text-xs font-bold uppercase tracking-widest">XTZ.News</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category tags */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.categories.slice(0, 3).map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="cat-tag">
                <Tag size={9} className="cat-tag-icon" />
                {cat.name.toUpperCase()}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/${post.slug}`} className="flex-1">
          <h3 className="font-bold text-white leading-snug line-clamp-3 group-hover:text-blue-300 transition-colors text-base">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-white/50 line-clamp-2 mt-2">{excerpt}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
          <span className="text-xs text-white/40">{formatDate(post.publishedAt)}</span>
          <Link href={`/${post.slug}`} className="btn-read-more text-xs py-1 px-2.5">
            READ MORE
          </Link>
        </div>
      </div>
    </article>
  );
}
