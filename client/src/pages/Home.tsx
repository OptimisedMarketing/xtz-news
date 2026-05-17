import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Tag, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
}

// ─── Hero Slider ──────────────────────────────────────────────────────────────
function HeroSlider({ posts }: { posts: any[] }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % posts.length);
    }, 6000);
  };

  useEffect(() => {
    if (posts.length > 1) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [posts.length]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  if (!posts.length) return null;
  const post = posts[current];
  const primaryCat = post.categories?.[0];

  return (
    <div className="relative overflow-hidden" style={{ minHeight: "420px" }}>
      {/* Background */}
      <div className="absolute inset-0">
        {post.featuredImageUrl ? (
          <img
            key={post.id}
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-opacity duration-700"
          />
        ) : (
          <div className="w-full h-full" style={{ background: "var(--xtz-navy)" }} />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(5,21,46,0.97) 0%, rgba(5,21,46,0.75) 50%, rgba(5,21,46,0.2) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative container py-16 flex gap-8">
        {/* Left: article */}
        <div className="flex-1 max-w-lg">
          {primaryCat && (
            <Link href={`/category/${primaryCat.slug}`} className="cat-tag mb-3 inline-flex">
              <Tag size={9} className="cat-tag-icon" />
              {primaryCat.name.toUpperCase()}
            </Link>
          )}
          <p className="text-xs text-white/50 mb-2 uppercase tracking-widest font-semibold">
            {formatDate(post.publishedAt)}
          </p>
          <Link href={`/${post.slug}`}>
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 hover:text-blue-300 transition-colors">
              {post.title}
            </h1>
          </Link>
          {post.excerpt && (
            <p className="text-sm text-white/60 leading-relaxed mb-5 line-clamp-3">
              {stripHtml(post.excerpt)}
            </p>
          )}
          <Link href={`/${post.slug}`} className="btn-read-more">
            READ MORE <ArrowRight size={13} />
          </Link>
        </div>

        {/* Right: navigation panel */}
        <div
          className="hidden lg:flex flex-col w-72 shrink-0 rounded overflow-hidden"
          style={{ background: "rgba(5,21,46,0.85)", backdropFilter: "blur(8px)" }}
        >
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <span className="tab-btn active flex-1 text-center py-3">LATEST STORIES</span>
          </div>
          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {posts.slice(0, 5).map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                className={`w-full text-left p-3 hover:bg-white/5 transition-colors ${i === current ? "bg-white/5 border-l-2 border-blue-500" : ""}`}
              >
                <p className={`text-xs font-semibold leading-snug line-clamp-2 ${i === current ? "text-white" : "text-white/60"}`}>
                  {p.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + posts.length) % posts.length)}
            className="carousel-arrow absolute left-4 top-1/2 -translate-y-1/2"
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => goTo((current + 1) % posts.length)}
            className="carousel-arrow absolute right-4 top-1/2 -translate-y-1/2 lg:right-80"
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}

// ─── News Ticker ──────────────────────────────────────────────────────────────
function NewsTicker({ posts }: { posts: any[] }) {
  if (!posts.length) return null;
  const items = [...posts, ...posts]; // duplicate for seamless loop
  return (
    <div
      className="border-y border-white/10 py-2"
      style={{ background: "var(--xtz-navy)" }}
    >
      <div className="container flex items-center gap-4 overflow-hidden">
        <span
          className="text-xs font-black uppercase tracking-widest shrink-0 px-2 py-0.5 rounded"
          style={{ background: "var(--xtz-blue)", color: "white" }}
        >
          BREAKING
        </span>
        <div className="ticker-wrap flex-1">
          <div className="ticker-content">
            {items.map((p, i) => (
              <span key={`${p.id}-${i}`} className="inline-flex items-center gap-3 mr-10">
                <Link
                  href={`/${p.slug}`}
                  className="text-xs font-semibold text-white/70 hover:text-white transition-colors whitespace-nowrap"
                >
                  {p.title}
                </Link>
                <span className="text-white/20">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Most Popular Carousel ────────────────────────────────────────────────────
function MostPopularCarousel({ posts }: { posts: any[] }) {
  const [start, setStart] = useState(0);
  const visible = 4;

  if (!posts.length) return null;

  return (
    <section className="py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">MOST POPULAR</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setStart(Math.max(0, start - visible))}
              disabled={start === 0}
              className="carousel-arrow disabled:opacity-30"
              aria-label="Previous"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setStart(Math.min(posts.length - visible, start + visible))}
              disabled={start + visible >= posts.length}
              className="carousel-arrow disabled:opacity-30"
              aria-label="Next"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.slice(start, start + visible).map((post) => (
            <PostCard key={post.id} post={post} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured News Grid ───────────────────────────────────────────────────────
function FeaturedNewsGrid({ posts }: { posts: any[] }) {
  if (!posts.length) return null;
  const [main, ...rest] = posts;

  return (
    <section className="py-10" style={{ background: "var(--section-bg-alt)" }}>
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">FEATURED NEWS</h2>
          <Link href="/category/latest-news" className="btn-read-more text-xs py-1.5 px-3">
            VIEW MORE
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main featured */}
          <div className="lg:col-span-2 h-72 lg:h-80">
            <PostCard post={main} variant="hero" />
          </div>
          {/* Side grid */}
          <div className="grid grid-cols-1 gap-4">
            {rest.slice(0, 2).map((post) => (
              <div key={post.id} className="h-36">
                <PostCard post={post} variant="hero" />
              </div>
            ))}
          </div>
        </div>
        {/* Bottom row */}
        {rest.length > 2 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {rest.slice(2, 5).map((post) => (
              <PostCard key={post.id} post={post} variant="default" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Latest News Section ──────────────────────────────────────────────────────
function LatestNewsSection({ posts }: { posts: any[] }) {
  if (!posts.length) return null;
  return (
    <section className="py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">LATEST NEWS</h2>
          <Link href="/category/latest-news" className="btn-read-more text-xs py-1.5 px-3">
            VIEW MORE
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { data: latestPosts = [] } = trpc.posts.latest.useQuery({ limit: 10 });
  const { data: mostReadPosts = [] } = trpc.posts.mostRead.useQuery({ limit: 8 });
  const { data: featuredPosts = [] } = trpc.posts.featured.useQuery({ limit: 6 });

  // Use latest posts for hero if no featured
  const heroPosts = latestPosts.slice(0, 6);
  const featuredToShow = featuredPosts.length >= 3 ? featuredPosts : latestPosts.slice(0, 6);
  const latestToShow = latestPosts.slice(0, 8);

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider posts={heroPosts} />

      {/* News Ticker */}
      <NewsTicker posts={latestPosts.slice(0, 10)} />

      {/* Most Popular */}
      <MostPopularCarousel posts={mostReadPosts} />

      {/* Featured News */}
      <FeaturedNewsGrid posts={featuredToShow} />

      {/* Latest News */}
      <LatestNewsSection posts={latestToShow} />
    </div>
  );
}
