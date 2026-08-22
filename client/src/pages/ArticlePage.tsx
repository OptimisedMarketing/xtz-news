import { useParams, Link } from "wouter";
import { useEffect, useState, useRef } from "react";
import { Twitter, Facebook, Linkedin, Send, Copy, Home, ChevronRight, Settings2, Share2 } from "lucide-react";
import XtzPriceWidget from "@/components/XtzPriceWidget";
import ArticleNewsletterSignup from "@/components/ArticleNewsletterSignup";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";
import { toast } from "sonner";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import ArticleContent from "@/components/ArticleContent";
import DonateButton from "@/components/DonateButton";
import AudioPlayer from "@/components/AudioPlayer";
import KeyTakeaways from "@/components/KeyTakeaways";
import { LOCALE_FLAGS, LOCALE_NAMES, type SupportedLocale } from "@shared/locales";
import { getMediaUrl } from "@/lib/mediaUrl";
import GaneshaSharePanel from "@/components/GaneshaSharePanel";
import GatewayExplainer from "@/components/GatewayExplainer";
import { isGaneshaStory, prioritiseGaneshaRelatedStories } from "@/lib/ganeshaStory";

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
    // Use dynamic OG image if no featured image — generates branded 1200x630 PNG
    const dynamicOgImage = `${siteUrl}/api/og?type=article&title=${encodeURIComponent(post.title.slice(0, 100))}&category=${encodeURIComponent(post.categories?.[0]?.name || 'Tezos News')}`;
    const image = post.featuredImageUrl || dynamicOgImage;

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

    // Schema.org NewsArticle + BreadcrumbList JSON-LD structured data
    const schemaId = 'schema-newsarticle';
    let schemaEl = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schemaEl) {
      schemaEl = document.createElement('script');
      schemaEl.id = schemaId;
      schemaEl.type = 'application/ld+json';
      document.head.appendChild(schemaEl);
    }
    const publishedIso = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;
    const category = post.categories?.[0]?.name || 'Tezos News';
    const catSlug = (post.categories?.[0] as any)?.slug || 'latest-news';
    const keywords = post.categories?.map((c: { name: string }) => c.name).join(', ') || 'Tezos, XTZ, blockchain';
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'headline': post.title,
        'description': description,
        'image': [{ '@type': 'ImageObject', 'url': image, 'width': 1200, 'height': 630 }],
        'url': url,
        'datePublished': publishedIso,
        'dateModified': publishedIso,
        'inLanguage': 'en-GB',
        'isAccessibleForFree': true,
        'keywords': keywords,
        'author': [{ '@type': 'Organization', 'name': 'XTZ.News', 'url': 'https://xtz.news', 'sameAs': ['https://twitter.com/XTZNews'] }],
        'publisher': {
          '@type': 'Organization',
          'name': 'XTZ.News',
          'url': 'https://xtz.news',
          'logo': { '@type': 'ImageObject', 'url': 'https://xtz.news/manus-storage/xtz-logo-square_c6689606.png', 'width': 512, 'height': 512 },
          'sameAs': ['https://twitter.com/XTZNews', 'https://www.facebook.com/xtz.news', 'https://www.linkedin.com/company/xtz-news'],
        },
        'mainEntityOfPage': { '@type': 'WebPage', '@id': url },
        'articleSection': category,
        'thumbnailUrl': image,
        'copyrightYear': publishedIso ? new Date(publishedIso).getFullYear() : new Date().getFullYear(),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://xtz.news' },
          { '@type': 'ListItem', 'position': 2, 'name': category, 'item': `https://xtz.news/category/${catSlug}` },
          { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': url },
        ],
      },
    ];
    schemaEl.textContent = JSON.stringify(schemas);

    // Reset title when leaving the page
    return () => {
      document.title = "XTZ.News — Tezos News";
      // Remove schema on unmount
      const el = document.getElementById(schemaId);
      if (el) el.remove();
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
  const [shareStatus, setShareStatus] = useState("");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("Article link copied to clipboard.");
      toast.success("Link copied to clipboard!");
    } catch {
      setShareStatus("Article link could not be copied. Please copy the page address manually.");
      toast.error("Unable to copy the link.");
    }
  };

  const shareOrCopy = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // A dismissed native share sheet is not an error state for readers.
      }
    }
    copyLink();
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
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{shareStatus}</p>
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

  // Compact variant for the sticky reader toolbar: keep attention on reading
  // rather than presenting a row of individual social-network controls.
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{shareStatus}</p>
      <button onClick={shareOrCopy} aria-label="Share this article" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.6rem", borderRadius: "20px", background: "rgba(44,125,247,0.16)", border: "1px solid rgba(44,125,247,0.3)", color: "#8cbcff", cursor: "pointer", fontSize: "0.68rem", fontWeight: 700 }}><Share2 size={13} /> Share</button>
      <button
        onClick={copyLink}
        aria-label="Copy article link"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "20px",
          background: "rgba(255,255,255,0.12)",
          border: "none",
          color: "rgba(255,255,255,0.7)",
          cursor: "pointer",
          transition: "background 0.2s, transform 0.1s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.22)"; (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
      >
        <Copy size={13} />
      </button>
    </div>
  );
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [readProgress, setReadProgress] = useState(0);
  const [showStickyShare, setShowStickyShare] = useState(false);
  const [readingMode, setReadingMode] = useState<"dark" | "light">("dark");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [readingControlsOpen, setReadingControlsOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const fontSizeMap = { sm: "0.95rem", md: "1.125rem", lg: "1.3rem" };

  // Reading progress bar + sticky share bar trigger
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) { setReadProgress(100); return; }
      setReadProgress(Math.min(100, Math.round((scrollTop / scrollHeight) * 100)));
      // Show sticky share bar after scrolling past 300px
      setShowStickyShare(scrollTop > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { data: post, isLoading, error } = trpc.posts.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data: related = [] } = trpc.posts.related.useQuery(
    {
      postId: post?.id ?? 0,
      categoryIds: post?.categories?.map((c) => c.id) ?? [],
      limit: 6,
    },
    { enabled: !!post }
  );
  const uniqueRelated = related.filter(
    (item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index,
  );

  // Fetch available translations for hreflang tags
  const { data: availableTranslations = [] } = trpc.translations.byPostId.useQuery(
    { postId: post?.id ?? 0 },
    { enabled: !!post?.id }
  );

  // Inject hreflang link tags for SEO
  useEffect(() => {
    if (!post?.slug) return;
    // Remove existing hreflang tags
    document.querySelectorAll('link[hreflang]').forEach((el) => el.remove());
    // Add x-default and en
    const addHreflang = (lang: string, href: string) => {
      const el = document.createElement('link');
      el.setAttribute('rel', 'alternate');
      el.setAttribute('hreflang', lang);
      el.setAttribute('href', href);
      document.head.appendChild(el);
    };
    addHreflang('en', `https://xtz.news/${post.slug}`);
    addHreflang('x-default', `https://xtz.news/${post.slug}`);
    availableTranslations.forEach((t: { locale: string; slug: string }) => {
      addHreflang(t.locale, `https://xtz.news/${t.locale}/${t.slug}`);
    });
    return () => { document.querySelectorAll('link[hreflang]').forEach((el) => el.remove()); };
  }, [post?.slug, availableTranslations]);

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
  const isGaneshaArticle = isGaneshaStory(post.slug);
  const displayedRelated = isGaneshaArticle ? prioritiseGaneshaRelatedStories(uniqueRelated) : uniqueRelated;
  const wordCount = post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length : 0;
  const readMins = Math.max(1, Math.round(wordCount / 200));

  return (
    <article aria-labelledby="article-title">
      {/* 1. Reading progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, width: `${readProgress}%`, height: "3px", background: "linear-gradient(to right, #2c7df7, #5a9fff)", zIndex: 9999, transition: "width 0.1s linear", pointerEvents: "none" }} />

      {/* 8. Sticky share bar — appears after scrolling past hero */}
      <div aria-label="Article reading tools" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, transform: showStickyShare ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)", background: "rgba(5,21,46,0.97)", borderTop: "1px solid rgba(44,125,247,0.2)", backdropFilter: "blur(12px)", padding: "0.6rem 1rem" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>{post.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginRight: "0.25rem" }}>{readProgress}% read</span>
            <div style={{ position: "relative" }}>
              <button onClick={() => setReadingControlsOpen((open) => !open)} aria-label={readingControlsOpen ? "Close reading controls" : "Open reading controls"} aria-expanded={readingControlsOpen} aria-controls="article-reading-controls" style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.6rem", background: readingControlsOpen ? "rgba(44,125,247,0.2)" : "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "20px", color: "rgba(255,255,255,0.72)", fontSize: "0.68rem", fontWeight: 700, cursor: "pointer" }}>
                <Settings2 size={13} /> Reading
              </button>
              {readingControlsOpen && (
                <div id="article-reading-controls" role="region" aria-labelledby="reading-controls-title" style={{ position: "absolute", bottom: "calc(100% + 0.65rem)", right: 0, width: "230px", padding: "0.85rem", background: "#071a35", border: "1px solid rgba(44,125,247,0.35)", boxShadow: "0 12px 32px rgba(0,0,0,0.45)", borderRadius: "8px" }}>
                  <p id="reading-controls-title" style={{ margin: "0 0 0.65rem", fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Reading controls</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Text size</span>
                    <div style={{ display: "flex", gap: "0.2rem" }}>
                      {(["sm", "md", "lg"] as const).map((size, i) => <button key={size} onClick={() => { setFontSize(size); setReadingControlsOpen(false); }} aria-label={`Use ${size === "sm" ? "small" : size === "md" ? "medium" : "large"} text`} aria-pressed={fontSize === size} style={{ padding: "0.28rem 0.48rem", background: fontSize === size ? "#2c7df7" : "rgba(255,255,255,0.08)", border: "none", borderRadius: "4px", color: "#fff", fontSize: ["0.6rem", "0.72rem", "0.85rem"][i], fontWeight: 800, cursor: "pointer" }}>A</button>)}
                    </div>
                  </div>
                  <button onClick={() => { setReadingMode((mode) => mode === "dark" ? "light" : "dark"); setReadingControlsOpen(false); }} aria-label={readingMode === "dark" ? "Switch to light reading mode" : "Switch to dark reading mode"} aria-pressed={readingMode === "light"} style={{ width: "100%", marginTop: "0.65rem", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.55rem 0.6rem", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.75)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>
                    <span>{readingMode === "dark" ? "Light reading mode" : "Dark reading mode"}</span><span>{readingMode === "dark" ? "☀️" : "🌙"}</span>
                  </button>
                </div>
              )}
            </div>
            <ShareButtons title={post.title} url={pageUrl} />
          </div>
        </div>
      </div>

      {/* 1. Featured image — full-bleed, NO text overlay (avoids covering image content) */}
      {post.featuredImageUrl && (
        <figure ref={heroRef} aria-labelledby="article-title" style={{ position: "relative", width: "100%", margin: 0, background: `#05152e url("${getMediaUrl(post.featuredImageUrl)}") center / contain no-repeat`, textAlign: "center" }}>
          <img
            src={getMediaUrl(post.featuredImageUrl)}
            alt={post.featuredImageAlt?.trim() || `Featured image for ${post.title}`}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            style={{ width: "100%", maxWidth: "900px", height: "auto", display: "block", margin: "0 auto", opacity: 1 }}
            onError={(e) => { (e.currentTarget as HTMLElement).parentElement!.style.display = "none"; }}
          />
          {/* Skeleton shimmer while image loads */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #05152e 25%, #0d2a5e 50%, #05152e 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", zIndex: -1 }} />
        </figure>
      )}

      {/* 1b. Title block — always below image, never overlaid */}
      <div style={{ background: "linear-gradient(180deg, #05152e 0%, #030e1f 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "2rem 0 1.75rem" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.35rem", marginBottom: "0.75rem", fontSize: "0.75rem", fontWeight: 600 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}><Home size={12} /></Link>
            <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.25)" }} />
            {post.categories?.[0] && (
              <Link href={`/category/${post.categories[0].slug}`} style={{ color: "#5a9fff", textDecoration: "none", fontWeight: 700, textTransform: "capitalize" }}>{post.categories[0].name}</Link>
            )}
          </nav>
          {/* Category badges */}
          {post.categories && post.categories.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
              {post.categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`} style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", padding: "3px 9px", background: "#2c7df7", color: "#fff", borderRadius: "3px", textDecoration: "none" }}>{cat.name}</Link>
              ))}
            </div>
          )}
          {/* Title — clean, always readable */}
          <h1 id="article-title" style={{ fontSize: "clamp(1.6rem, 4vw, 2.75rem)", fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 1.25rem", maxWidth: "820px" }}>
            {post.title}
          </h1>
          {/* Meta row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#2c7df7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 900, color: "#fff", flexShrink: 0 }}>X</div>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>XTZ News</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>{formatDate(post.publishedAt)}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.68rem", fontWeight: 700, padding: "3px 9px", background: "rgba(255,255,255,0.08)", borderRadius: "20px", color: "rgba(255,255,255,0.7)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {readMins} min read
            </span>
            {readProgress > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.68rem", fontWeight: 700, padding: "3px 9px", background: "rgba(44,125,247,0.2)", borderRadius: "20px", color: "#5a9fff" }}>
                {readProgress}% read
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Two-column layout: article body + sticky sidebar */}
      <div className="container" style={{ padding: "2.5rem 1.25rem 4rem" }}>
        <div className="article-layout">

          {/* ── Main article column ── */}
          <section aria-label="Article body">
            {/* Audio Player — only shown when pre-generated audio exists (generated by cloud cron, no Manus credits) */}
            {(post as any).audioUrl && (
              <AudioPlayer src={(post as any).audioUrl} title={post.title} postId={post.id} featuredImageUrl={post.featuredImageUrl} slug={post.slug} />
            )}

            {/* Key Takeaways — shown when available, improves readability & AI search */}
            <KeyTakeaways takeaways={(post as any).keyTakeaways} />

            {isGaneshaArticle && <GatewayExplainer />}

            <details style={{ marginBottom: "1.75rem", padding: "0.8rem 1rem", borderRadius: "6px", background: "rgba(44,125,247,0.045)", border: "1px solid rgba(44,125,247,0.14)", color: "rgba(255,255,255,0.55)" }}>
              <summary style={{ cursor: "pointer", color: "rgba(255,255,255,0.72)", fontSize: "0.76rem", fontWeight: 700 }}>Reader note &amp; support XTZ.News</summary>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", paddingTop: "0.75rem", fontSize: "0.76rem", lineHeight: 1.55 }}>
                <span>This article is for informational purposes only and does not constitute financial advice. <Link href="/disclaimer" style={{ color: "#5a9fff", fontWeight: 700 }}>Full Disclaimer →</Link></span>
                <DonateButton variant="article" />
              </div>
            </details>

            {/* Article body — reading mode + font size aware */}
            <ArticleContent
              html={post.content || ""}
              className={`post-content${readingMode === "light" ? " reading-light" : ""}`}
              style={{ transition: "background 0.3s, color 0.3s, font-size 0.2s", fontSize: fontSizeMap[fontSize] }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", alignSelf: "center", marginRight: "0.25rem" }}>Tags:</span>
                {post.tags.map((tag) => (
                  <Link key={tag.id} href={`/tag/${tag.slug}`} style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}>
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Translation options — shown when translations are available */}
            {availableTranslations.length > 0 && (
              <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", background: "rgba(44,125,247,0.06)", border: "1px solid rgba(44,125,247,0.15)", borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(44,125,247,0.8)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Read this article in</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {availableTranslations.map((t: { locale: string; slug: string; title: string }) => (
                    <Link
                      key={t.locale}
                      href={`/${t.locale}/${t.slug}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.6)",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "20px",
                        padding: "0.3rem 0.75rem",
                        textDecoration: "none",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "#fff";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.4)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                      }}
                    >
                      {LOCALE_FLAGS[t.locale as SupportedLocale]} {LOCALE_NAMES[t.locale as SupportedLocale]}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share at bottom */}
            {isGaneshaArticle && <GaneshaSharePanel title={post.title} url={pageUrl} />}
            <div style={{ marginTop: "2rem" }}>
              <ShareButtons title={post.title} url={pageUrl} variant="full" />
            </div>

            {/* 6. Author card */}
            <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg, #2c7df7, #1a6ae0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", fontWeight: 900, color: "#fff", flexShrink: 0 }}>X</div>
              <div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.95rem", marginBottom: "0.2rem" }}>XTZ.News Editorial</div>
                <div style={{ fontSize: "0.72rem", color: "#2c7df7", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Tezos News Team</div>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>XTZ.News is the leading independent news platform covering the Tezos blockchain ecosystem — from protocol upgrades and DeFi to digital art and community projects.</p>
              </div>
            </div>

            {/* Newsletter Signup */}
            <ArticleNewsletterSignup />
          </section>

          {/* ── Sticky sidebar ── */}
          <aside className="article-sidebar" aria-label="Article supporting content">
            {/* XTZ Price Widget */}
            <XtzPriceWidget />

            {/* Related articles in sidebar */}
            {displayedRelated.length > 0 && (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "3px", height: "16px", background: "#2c7df7", borderRadius: "2px" }} />
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)" }}>Related</span>
                </div>
                {displayedRelated.slice(0, 5).map((p, i) => (
                  <Link key={p.id} href={`/${p.slug}`} style={{ display: "flex", gap: "0.75rem", padding: "0.875rem 1rem", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none", textDecoration: "none", transition: "background 0.15s" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.05)";
                      const img = (e.currentTarget as HTMLElement).querySelector("img");
                      if (img) { img.style.transform = "scale(1.06)"; img.style.borderColor = "rgba(44,125,247,0.4)"; }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      const img = (e.currentTarget as HTMLElement).querySelector("img");
                      if (img) { img.style.transform = "scale(1)"; img.style.borderColor = "transparent"; }
                    }}>
                    {p.featuredImageUrl && (
                      <div style={{ width: "52px", height: "52px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, border: "2px solid transparent", transition: "border-color 0.2s" }}>
                        <img src={getMediaUrl(p.featuredImageUrl)} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = "none"; }} />
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.title}</div>
                      {p.publishedAt && <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem" }}>{new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Share in sidebar */}
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "1rem" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>Share this article</div>
              <ShareButtons title={post.title} url={pageUrl} />
            </div>
          </aside>
        </div>

        {/* Related Posts — full grid below */}
        {displayedRelated.length > 0 && (
          <section aria-labelledby="related-articles-title" style={{ marginTop: "4rem" }}>
            {/* Section header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.75rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "4px", height: "28px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: isGaneshaArticle ? "#63f7b1" : "#2c7df7", marginBottom: "2px" }}>{isGaneshaArticle ? "Continue exploring Etherlink & Tezos" : "You might also like"}</p>
                  <h2 id="related-articles-title" style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>{isGaneshaArticle ? "More Etherlink and Tezos News" : "Related Articles"}</h2>
                </div>
              </div>
              {post.categories?.[0] && (
                <Link
                  href={`/category/${post.categories[0].slug}`}
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#2c7df7",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.4rem 0.875rem",
                    border: "1px solid rgba(44,125,247,0.35)",
                    borderRadius: "4px",
                    transition: "background 0.2s, border-color 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "#2c7df7"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.35)"; }}
                >
                  More from {post.categories[0].name} →
                </Link>
              )}
            </div>

            {/* Article cards grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}>
              {displayedRelated.map((p) => (
                <Link key={p.id} href={`/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <div
                    style={{
                      background: "#05152e",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(-3px)";
                      el.style.borderColor = "rgba(44,125,247,0.4)";
                      el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(0)";
                      el.style.borderColor = "rgba(255,255,255,0.07)";
                      el.style.boxShadow = "none";
                    }}
                  >
                    {/* Card image */}
                    <div style={{ position: "relative", paddingTop: "56.25%", background: "#0d2a5e", overflow: "hidden" }}>
                      {p.featuredImageUrl && (
                        <img
                          src={getMediaUrl(p.featuredImageUrl)}
                          alt={p.title}
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                      {/* Category badge */}
                      {p.categories?.[0] && (
                        <div style={{
                          position: "absolute",
                          top: "0.625rem",
                          left: "0.625rem",
                          background: "#2c7df7",
                          color: "#fff",
                          fontSize: "0.55rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          padding: "2px 7px",
                          borderRadius: "3px",
                        }}>
                          {p.categories[0].name}
                        </div>
                      )}
                    </div>
                    {/* Card content */}
                    <div style={{ padding: "1rem" }}>
                      <h3 style={{
                        margin: "0 0 0.5rem",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {p.title}
                      </h3>
                      {p.publishedAt && (
                        <p style={{ margin: 0, fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                          {new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
