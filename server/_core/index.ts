import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { uploadRouter } from "../uploadRouter";
import { createTranslationImportRouter } from "../translationImportRouter";
import { importTranslationBatch, getUntranslatedTranslationJobs } from "../db";
import { XTZ_TRANSLATION_IMPORT_PUBLIC_KEY } from "../translationImportPublicKey";
import { createTranslationJobRouter } from "../translationJobRouter";
import { createTezOracleStatusImportRouter } from "../tezoracleStatusImportRouter";
import { TEZORACLE_STATUS_IMPORT_PUBLIC_KEY } from "../tezoracleStatusImportPublicKey";
import { importTezOracleStatus } from "../db";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  if (XTZ_TRANSLATION_IMPORT_PUBLIC_KEY) {
    app.use("/api/internal/translations/jobs", createTranslationJobRouter({
      publicKey: XTZ_TRANSLATION_IMPORT_PUBLIC_KEY,
      getJobs: getUntranslatedTranslationJobs,
    }));
    app.use("/api/internal/translations/import", createTranslationImportRouter({
      publicKey: XTZ_TRANSLATION_IMPORT_PUBLIC_KEY,
      importBatch: importTranslationBatch,
    }));
  }

  app.use("/api/internal/tezoracle/status", createTezOracleStatusImportRouter({
    publicKey: TEZORACLE_STATUS_IMPORT_PUBLIC_KEY,
    importStatus: importTezOracleStatus,
  }));

  // ─── Custom Image Proxy (overrides framework storageProxy for wp-media) ────
  // The framework storageProxy does a 307 redirect which some browsers don't
  // follow for <img> tags. This intercepts wp-media requests and pipes bytes directly.
  app.get("/manus-storage/wp-media/*", async (req, res) => {
    const key = `wp-media/${(req.params as Record<string, string>)[0]}`;
    const { ENV } = await import("./env");
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      return res.status(500).send("Storage not configured");
    }
    try {
      const forgeUrl = new URL("v1/storage/presign/get", ENV.forgeApiUrl.replace(/\/+$/, "") + "/");
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, { headers: { Authorization: `Bearer ${ENV.forgeApiKey}` } });
      if (!forgeResp.ok) return res.status(502).send("Storage error");
      const { url } = await forgeResp.json() as { url: string };
      if (!url) return res.status(502).send("No URL");
      const imgResp = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!imgResp.ok) return res.redirect(307, url);
      const contentType = imgResp.headers.get("content-type") || "image/jpeg";
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.set("Access-Control-Allow-Origin", "*");
      const buffer = await imgResp.arrayBuffer();
      return res.send(Buffer.from(buffer));
    } catch (e) {
      return res.status(502).send("Proxy error");
    }
  });
  // ─────────────────────────────────────────────────────────────────────────

  // Custom domains reserve /manus-storage and may return signed redirects that
  // fail in image elements. This relay streams storage bytes from same-origin.
  app.get("/media/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) return res.status(400).send("Missing media key");
    try {
      const { ENV } = await import("./env");
      if (!ENV.forgeApiUrl || !ENV.forgeApiKey) return res.status(500).send("Media storage is not configured");
      const forgeUrl = new URL("v1/storage/presign/get", ENV.forgeApiUrl.replace(/\/+$/, "") + "/");
      forgeUrl.searchParams.set("path", key);
      const signed = await fetch(forgeUrl, { headers: { Authorization: `Bearer ${ENV.forgeApiKey}` } });
      if (!signed.ok) return res.status(502).send("Media storage error");
      const { url } = await signed.json() as { url?: string };
      if (!url) return res.status(502).send("Media URL unavailable");
      const media = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (!media.ok) return res.status(502).send("Media file unavailable");
      res.set("Content-Type", media.headers.get("content-type") || "application/octet-stream");
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.set("Access-Control-Allow-Origin", "*");
      return res.send(Buffer.from(await media.arrayBuffer()));
    } catch {
      return res.status(502).send("Media relay error");
    }
  });

  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(uploadRouter);

  // ─── SEO Redirects (WordPress → new site URL structure) ─ v2 2026-05-27 ──────
  // 1. Legacy WordPress /tezos-projects/ → /projects
  app.get("/tezos-projects", (req, res) => res.redirect(301, "/projects"));
  app.get("/tezos-projects/", (req, res) => res.redirect(301, "/projects"));
  // 2-5. Combined WordPress URL normalisation middleware
  // Handles in a single pass (no chained redirects):
  //   a) Trailing slash removal: /slug/ → /slug
  //   b) Language prefix removal: /en/slug → /slug, /fr/slug → /
  //   c) Category-prefixed URLs: /category/article-slug/ → /article-slug
  const KNOWN_ROUTES = new Set([
    'api', 'admin', 'category', 'tag', 'projects', 'timeline', 'watch',
    'contact', 'advertise', 'submit-article', 'submit-project', 'categories',
    'search', 'prices', 'manus-storage', '__manus__', 'img', 'sitemap.xml',
    'robots.txt', 'favicon.ico'
  ]);
  // TRANSLATION_LOCALES: these are valid i18n routes — do NOT redirect them
  const TRANSLATION_LOCALES = new Set(['zh', 'ko', 'ja', 'de', 'es', 'fr', 'pt', 'ru', 'ar', 'tr']);
  // LANG_PREFIXES: legacy language prefixes that should be stripped (not translation routes)
  const LANG_PREFIXES = new Set(['en', 'it', 'uk', 'hi']);

  app.use(async (req, res, next) => {
    if (
      req.path.startsWith('/api/') ||
      req.path.startsWith('/manus-storage/') ||
      req.path.startsWith('/__vite_hmr')
    ) {
      return next();
    }

    // Strip trailing slash first
    let cleanPath = req.path.endsWith('/') && req.path !== '/' ? req.path.slice(0, -1) : req.path;
    const parts = cleanPath.split('/').filter(Boolean);

    // Skip translation locale routes — these are valid i18n pages
    if (parts.length >= 1 && TRANSLATION_LOCALES.has(parts[0])) {
      if (req.path !== cleanPath) return res.redirect(301, cleanPath);
      return next();
    }

    // Language prefix: /en/... → /... (strip legacy lang prefixes)
    if (parts.length >= 1 && LANG_PREFIXES.has(parts[0])) {
      if (parts[0] === 'en' && parts.length >= 2) {
        return res.redirect(301, '/' + parts.slice(1).join('/'));
      }
      return res.redirect(301, '/');
    }

    // Category-prefixed: /category-slug/article-slug → /article-slug
    if (parts.length === 2 && !KNOWN_ROUTES.has(parts[0])) {
      const articleSlug = parts[1];
      try {
        const { getDb } = await import('../db');
        const db = await getDb();
        if (db) {
          const { posts } = await import('../../drizzle/schema');
          const { eq } = await import('drizzle-orm');
          const result = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, articleSlug)).limit(1);
          if (result.length > 0) {
            return res.redirect(301, '/' + articleSlug);
          }
        }
      } catch {}
    }

    // Trailing slash only (no category prefix)
    if (req.path !== cleanPath) {
      return res.redirect(301, cleanPath);
    }

    next();
  });
  // ─────────────────────────────────────────────────────────────────────────

  // ─── Dynamic Sitemap ─────────────────────────────────────────────────────

  // OG Image Generation
  app.get("/api/og", async (req, res) => {
    try {
      const { generateArticleOgImage, generateToolOgImage } = await import("../ogImage");
      const type = (req.query.type as string) || "article";
      let imageBuffer: Buffer;
      if (type === "tool") {
        const name = ((req.query.name as string) || "XTZ Tool").slice(0, 60);
        const description = ((req.query.description as string) || "").slice(0, 160);
        const icon = ((req.query.icon as string) || "");
        imageBuffer = await generateToolOgImage({ name, description, icon });
      } else {
        const title = ((req.query.title as string) || "XTZ.News Article").slice(0, 120);
        const category = ((req.query.category as string) || "TEZOS NEWS").toUpperCase().slice(0, 30);
        imageBuffer = await generateArticleOgImage({ title, category });
      }
      res.set("Content-Type", "image/png");
      res.set("Cache-Control", "public, max-age=86400");
      res.send(imageBuffer);
    } catch (err) {
      console.error("[OG Image] Error:", err);
      res.status(500).send("Error generating OG image");
    }
  });

  // ─── Audio→MP4 Proxy (routes to cloud computer FFmpeg service) ─────────────────────────────────────────────────────────────────────────
  app.post("/api/audio-to-video", async (req, res) => {
    try {
      const CLOUD_SERVICE = 'http://34.52.212.6:8085';
      const body = req.body;
      const upstream = await fetch(`${CLOUD_SERVICE}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(600000), // 10 min timeout
      });
      if (!upstream.ok) {
        const err = await upstream.text();
        return res.status(upstream.status).json({ error: err });
      }
      res.set('Content-Type', 'video/mp4');
      const slug = (body.slug || 'xtz-news-article').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
      res.set('Content-Disposition', `attachment; filename="${slug}-george-elevenlabs.mp4"`);
      // Stream the response
      const arrayBuffer = await upstream.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      console.error('[audio-to-video] error:', err.message);
      res.status(500).json({ error: err.message });
    }
  });
  // ─────────────────────────────────────────────────────────────────────────

  // ─── Podcast RSS Feed ─────────────────────────────────────────────────────────────────────────
  app.get("/podcast.rss", async (req, res) => {
    try {
      const { getDb } = await import("../db");
      const { posts } = await import("../../drizzle/schema");
      const { desc, isNotNull, ne, and, eq } = await import("drizzle-orm");
      const db = await getDb();
      const baseUrl = "https://xtz.news";

      const podcastPosts = db ? await db
        .select({ id: posts.id, title: posts.title, slug: posts.slug, excerpt: posts.excerpt, featuredImageUrl: posts.featuredImageUrl, audioUrl: posts.audioUrl, publishedAt: posts.publishedAt })
        .from(posts)
        .where(and(eq(posts.status, 'publish'), isNotNull(posts.audioUrl), ne(posts.audioUrl, '')))
        .orderBy(desc(posts.publishedAt))
        .limit(100) : [];

      const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

      const items = podcastPosts.map(p => {
        const pubDate = p.publishedAt ? new Date(p.publishedAt).toUTCString() : new Date().toUTCString();
        const description = (p.excerpt || '').replace(/<[^>]+>/g, '').slice(0, 300);
        const audioUrl = p.audioUrl!.startsWith('http') ? p.audioUrl! : baseUrl + p.audioUrl!;
        const imageUrl = p.featuredImageUrl ? (p.featuredImageUrl.startsWith('http') ? p.featuredImageUrl : baseUrl + p.featuredImageUrl.replace(/^\/manus-storage\//, '/media/')) : `${baseUrl}/media/xtz-logo-square_c6689606.png`;
        return `    <item>
      <title>${esc(p.title)}</title>
      <link>${baseUrl}/${p.slug}</link>
      <guid isPermaLink="false">${baseUrl}/${p.slug}</guid>
      <description>${esc(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${audioUrl}" type="audio/mpeg" />
      <itunes:title>${esc(p.title)}</itunes:title>
      <itunes:summary>${esc(description)}</itunes:summary>
      <itunes:image href="${imageUrl}" />
      <itunes:duration>0</itunes:duration>
    </item>`;
      }).join('\n');

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>XTZ.News Podcast — Tezos Blockchain News</title>
    <link>${baseUrl}</link>
    <description>The latest Tezos blockchain news, analysis, and ecosystem updates — narrated by George from ElevenLabs.</description>
    <language>en-us</language>
    <copyright>XTZ.News ${new Date().getFullYear()}</copyright>
    <atom:link href="${baseUrl}/podcast.rss" rel="self" type="application/rss+xml" />
    <itunes:author>XTZ.News</itunes:author>
    <itunes:owner><itunes:name>XTZ.News</itunes:name><itunes:email>hello@xtz.news</itunes:email></itunes:owner>
    <itunes:image href="${baseUrl}/media/xtz-logo-square_c6689606.png" />
    <itunes:category text="Technology" />
    <itunes:category text="News" />
    <itunes:explicit>no</itunes:explicit>
    <image><url>${baseUrl}/media/xtz-logo-square_c6689606.png</url><title>XTZ.News Podcast</title><link>${baseUrl}</link></image>
${items}
  </channel>
</rss>`;

      res.set('Content-Type', 'application/rss+xml; charset=utf-8');
      res.set('Cache-Control', 'public, max-age=1800');
      res.send(rss);
    } catch (err) {
      console.error('[podcast.rss] error:', err);
      res.status(500).send('Error generating podcast feed');
    }
  });
  // ─────────────────────────────────────────────────────────────────────────

  app.get("/sitemap.xml", async (req, res) => {
    try {
      const { getDb } = await import("../db");
      const { posts, categories, tags } = await import("../../drizzle/schema");
      const { eq, desc } = await import("drizzle-orm");

      const db = await getDb();
      const baseUrl = "https://xtz.news";

      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "daily" },
        { url: "/categories", priority: "0.8", changefreq: "weekly" },
        { url: "/timeline", priority: "0.7", changefreq: "monthly" },
        { url: "/projects", priority: "0.8", changefreq: "weekly" },
        { url: "/watch", priority: "0.7", changefreq: "weekly" },
        { url: "/submit-article", priority: "0.5", changefreq: "monthly" },
        { url: "/contact", priority: "0.4", changefreq: "yearly" },
        { url: "/advertise", priority: "0.4", changefreq: "yearly" },
        // Staking & Prices
        { url: "/staking", priority: "0.8", changefreq: "daily" },
        { url: "/prices", priority: "0.8", changefreq: "hourly" },
        // Explorer
        { url: "/explorer", priority: "0.7", changefreq: "daily" },
        { url: "/explorer/bakers", priority: "0.7", changefreq: "daily" },
        // Tools landing
        { url: "/tools", priority: "0.9", changefreq: "weekly" },
        // Individual tools
        { url: "/tools/wallet", priority: "0.8", changefreq: "monthly" },
        { url: "/tools/whale-watcher", priority: "0.8", changefreq: "monthly" },
        { url: "/tools/nft-gallery", priority: "0.7", changefreq: "monthly" },
        { url: "/tools/rewards", priority: "0.8", changefreq: "monthly" },
        { url: "/tools/portfolio", priority: "0.8", changefreq: "monthly" },
        { url: "/tools/address-book", priority: "0.6", changefreq: "monthly" },
        { url: "/tools/token-price", priority: "0.7", changefreq: "monthly" },
        { url: "/tools/airdrop", priority: "0.7", changefreq: "monthly" },
        { url: "/tools/batch-lookup", priority: "0.7", changefreq: "monthly" },
        { url: "/tools/tns", priority: "0.7", changefreq: "monthly" },
        { url: "/tools/live-ops", priority: "0.7", changefreq: "monthly" },
        { url: "/tools/contract", priority: "0.7", changefreq: "monthly" },
        { url: "/tools/defi", priority: "0.8", changefreq: "daily" },
      ];

      let allPosts: { slug: string; title: string; publishedAt: Date | null; updatedAt: Date | null }[] = [];
      let allCats: { slug: string }[] = [];
      let allTagsList: { slug: string }[] = [];
      let allTranslations: { locale: string; slug: string; translatedAt: Date }[] = [];

      if (db) {
        allPosts = await db
          .select({ slug: posts.slug, title: posts.title, publishedAt: posts.publishedAt, updatedAt: posts.updatedAt })
          .from(posts)
          .where(eq(posts.status, "publish"))
          .orderBy(desc(posts.publishedAt))
          .limit(2000);

        allCats = await db.select({ slug: categories.slug }).from(categories);
        allTagsList = await db.select({ slug: tags.slug }).from(tags);

        // Fetch translated articles for sitemap
        try {
          const { postTranslations } = await import("../../drizzle/schema");
          allTranslations = await db
            .select({ locale: postTranslations.locale, slug: postTranslations.slug, translatedAt: postTranslations.translatedAt })
            .from(postTranslations)
            .where(eq(postTranslations.status, "published"))
            .limit(20000);
        } catch (e) { /* table may not exist yet */ }
      }

      const formatDate = (d: Date | null) =>
        d ? new Date(d).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

      const today = new Date().toISOString().split("T")[0];

      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const recentPosts = allPosts.filter(p => p.publishedAt && new Date(p.publishedAt) >= twoDaysAgo);

      const lines: string[] = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
      ];

      // Static pages
      for (const page of staticPages) {
        lines.push(
          `  <url>\n    <loc>${baseUrl}${page.url}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n    <lastmod>${today}</lastmod>\n  </url>`
        );
      }

      // Category pages
      for (const cat of allCats) {
        lines.push(
          `  <url>\n    <loc>${baseUrl}/category/${cat.slug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n    <lastmod>${today}</lastmod>\n  </url>`
        );
      }

      // Tag pages
      for (const tag of allTagsList) {
        lines.push(
          `  <url>\n    <loc>${baseUrl}/tag/${tag.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.5</priority>\n    <lastmod>${today}</lastmod>\n  </url>`
        );
      }

      // Article pages — recent ones get Google News tags
      for (const post of allPosts) {
        const lastmod = formatDate(post.updatedAt || post.publishedAt);
        const isRecent = post.publishedAt && new Date(post.publishedAt) >= twoDaysAgo;
        const newsTag = isRecent
          ? `\n    <news:news>\n      <news:publication>\n        <news:name>XTZ.News</news:name>\n        <news:language>en</news:language>\n      </news:publication>\n      <news:publication_date>${new Date(post.publishedAt!).toISOString()}</news:publication_date>\n      <news:title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</news:title>\n    </news:news>`
          : '';
        lines.push(
          `  <url>\n    <loc>${baseUrl}/${post.slug}</loc>${newsTag}\n    <changefreq>monthly</changefreq>\n    <priority>${isRecent ? '0.9' : '0.8'}</priority>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
        );
      }

      // Locale archive pages (one per supported language)
      const SUPPORTED_LOCALES = ["zh", "ko", "ja", "de", "es", "fr", "pt", "ru", "ar", "tr"];
      for (const locale of SUPPORTED_LOCALES) {
        lines.push(
          `  <url>\n    <loc>${baseUrl}/${locale}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n    <lastmod>${today}</lastmod>\n  </url>`
        );
      }

      // Translated article pages
      for (const t of allTranslations) {
        const lastmod = t.translatedAt ? new Date(t.translatedAt).toISOString().split("T")[0] : today;
        lines.push(
          `  <url>\n    <loc>${baseUrl}/${t.locale}/${t.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
        );
      }

      lines.push("</urlset>");

      res.set("Content-Type", "application/xml");
      res.set("Cache-Control", "public, max-age=3600"); // Cache 1 hour
      res.send(lines.join("\n"));
    } catch (err) {
      console.error("[Sitemap] Error generating sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // ─── robots.txt ──────────────────────────────────────────────────────────
  // Google News Sitemap — articles from last 2 days for fast Google News indexing
  app.get("/news-sitemap.xml", async (req, res) => {
    try {
      const { getDb } = await import("../db");
      const { posts } = await import("../../drizzle/schema");
      const { eq, desc } = await import("drizzle-orm");
      const db = await getDb();
      const baseUrl = "https://xtz.news";
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      let recentPosts: { slug: string; title: string; publishedAt: Date | null }[] = [];
      if (db) {
        const all = await db.select({ slug: posts.slug, title: posts.title, publishedAt: posts.publishedAt })
          .from(posts).where(eq(posts.status, "publish")).orderBy(desc(posts.publishedAt)).limit(500);
        recentPosts = all.filter(p => p.publishedAt && new Date(p.publishedAt) >= twoDaysAgo);
      }
      const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
        ...recentPosts.map(p => {
          const pub = p.publishedAt ? new Date(p.publishedAt).toISOString() : new Date().toISOString();
          return `  <url>\n    <loc>${baseUrl}/${p.slug}</loc>\n    <news:news>\n      <news:publication><news:name>XTZ.News</news:name><news:language>en</news:language></news:publication>\n      <news:publication_date>${pub}</news:publication_date>\n      <news:title>${esc(p.title)}</news:title>\n    </news:news>\n  </url>`;
        }),
        '</urlset>'
      ];
      res.set("Content-Type", "application/xml");
      res.set("Cache-Control", "public, max-age=900");
      res.send(lines.join("\n"));
    } catch (err) {
      res.status(500).send("Error");
    }
  });

  app.get("/robots.txt", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "public, max-age=86400");
    res.send([
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /api/",
      "Disallow: /unsubscribe",
      "Disallow: /manage-subscriptions",
      "",
      "# Crawl-delay for polite bots",
      "Crawl-delay: 1",
      "",
      "# Sitemaps",
      "Sitemap: https://xtz.news/sitemap.xml",
      "Sitemap: https://xtz.news/news-sitemap.xml",
      "",
      "# Google News Bot",
      "User-agent: Googlebot-News",
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /api/",
    ].join("\n"));
  });

  // ─── IndexNow key verification file ───────────────────────────────────────────
  app.get("/xtz-news-indexnow-2026.txt", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "public, max-age=86400");
    res.send("xtz-news-indexnow-2026");
  });

  // ─── Weekly Newsletter Digest ──────────────────────────────────────────────────
  app.post("/api/scheduled/weekly-digest", async (req, res) => {
    try {
      // Allow cloud computer to call with CRON_SECRET_KEY header
      const cronSecret = process.env.CRON_SECRET_KEY;
      const headerSecret = req.headers["x-cron-secret"];
      const isCloudCron = cronSecret && headerSecret === cronSecret;
      if (!isCloudCron) {
        const { sdk } = await import("./sdk");
        const user = await sdk.authenticateRequest(req);
        if (!user.isCron) return res.status(403).json({ error: "cron-only" });
      }

      const { getDb } = await import("../db");
      const { posts, newsletterSubscribers } = await import("../../drizzle/schema");
      const { eq, desc } = await import("drizzle-orm");
      const db = await getDb();
      if (!db) return res.json({ ok: true, skipped: "no-db" });

      // Get top 5 posts from the last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const topPosts = await db.select({
        id: posts.id, title: posts.title, slug: posts.slug,
        excerpt: posts.excerpt, featuredImageUrl: posts.featuredImageUrl,
        publishedAt: posts.publishedAt,
      })
        .from(posts)
        .where(eq(posts.status, "publish"))
        .orderBy(desc(posts.publishedAt))
        .limit(5);

      if (!topPosts.length) return res.json({ ok: true, skipped: "no-posts" });

      // Get all active subscribers (with unsubToken for personalised footer links)
      const subscribers = await db.select({ email: newsletterSubscribers.email, unsubToken: newsletterSubscribers.unsubToken })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.status, "active"));

      if (!subscribers.length) return res.json({ ok: true, skipped: "no-subscribers" });

      // Build the email HTML (per-subscriber for personalised footer links)
      const baseUrl = "https://xtz.news";
      const articlesHtml = topPosts.map(p => {
        const excerpt = (p.excerpt || "").replace(/<[^>]*>/g, "").slice(0, 120);
        const img = p.featuredImageUrl ? `<img src="${p.featuredImageUrl.startsWith('/') ? baseUrl + p.featuredImageUrl.replace(/^\/manus-storage\//, '/media/') : p.featuredImageUrl}" style="width:100%;max-height:200px;object-fit:cover;border-radius:6px;margin-bottom:12px" />` : "";
        return `<div style="margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,0.08)">${img}<h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#fff"><a href="${baseUrl}/${p.slug}" style="color:#fff;text-decoration:none">${p.title}</a></h3><p style="margin:0 0 12px;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6">${excerpt}...</p><a href="${baseUrl}/${p.slug}" style="display:inline-block;padding:8px 18px;background:#2c7df7;color:#fff;text-decoration:none;border-radius:4px;font-size:13px;font-weight:600">Read More</a></div>`;
      }).join("");

      const buildDigestHtml = (token: string | null) => {
        const manageUrl = token ? `${baseUrl}/manage-subscriptions?token=${token}` : `${baseUrl}`;
        const unsubUrl = token ? `${baseUrl}/unsubscribe?token=${token}` : `${baseUrl}`;
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif"><div style="max-width:600px;margin:0 auto;padding:20px"><div style="text-align:center;padding:24px 0;border-bottom:2px solid #2c7df7;margin-bottom:28px"><img src="${baseUrl}/media/xtz-logo-square_c6689606.png" alt="XTZ.News" style="height:60px" /><h1 style="color:#fff;font-size:22px;margin:12px 0 4px">XTZ.News Weekly Digest</h1><p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0">Your weekly roundup of Tezos news</p></div>${articlesHtml}<div style="text-align:center;padding:20px 0;border-top:1px solid rgba(255,255,255,0.08);margin-top:8px"><p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0 0 8px">You're receiving this because you subscribed to XTZ.News. <a href="${baseUrl}" style="color:#2c7df7">Visit XTZ.News</a></p><p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0"><a href="${manageUrl}" style="color:#2c7df7;text-decoration:none">Manage preferences</a> &nbsp;·&nbsp; <a href="${unsubUrl}" style="color:rgba(255,255,255,0.3);text-decoration:none">Unsubscribe</a></p></div></div></body></html>`;
      }

      // Send via Resend if available, otherwise notify owner
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      let sent = 0;
      if (RESEND_API_KEY) {
        // Send individually so each email has personalised unsubscribe link
        const batchSize = 50;
        for (let i = 0; i < subscribers.length; i += batchSize) {
          const batch = subscribers.slice(i, i + batchSize);
          await Promise.all(batch.map((s: any) =>
            fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                from: "XTZ.News <newsletter@xtz.news>",
                to: [s.email],
                subject: `📰 XTZ.News Weekly Digest — Top Tezos Stories`,
                html: buildDigestHtml(s.unsubToken),
              }),
            })
          ));
          sent += batch.length;
        }
      } else {
        const { notifyOwner } = await import("./notification");
        await notifyOwner({
          title: `Weekly Digest Ready — ${topPosts.length} articles, ${subscribers.length} subscribers`,
          content: `Top articles this week:\n${topPosts.map((p: any, i: number) => `${i+1}. ${p.title} — ${baseUrl}/${p.slug}`).join("\n")}\n\nSubscribers: ${subscribers.length}\nNote: Set RESEND_API_KEY to enable actual email delivery.`,
        });
      }

      res.json({ ok: true, articles: topPosts.length, subscribers: subscribers.length, sent });
    } catch (e: any) {
      console.error("[weekly-digest] error:", e);
      res.status(500).json({ error: e.message, timestamp: new Date().toISOString() });
    }
  });
  // ─── Governance Alert — notify subscribers when a new proposal enters voting ──
  app.post("/api/scheduled/governance-alert", async (req, res) => {
    try {
      // Allow cloud computer to call with CRON_SECRET_KEY header
      const cronSecret = process.env.CRON_SECRET_KEY;
      const headerSecret = req.headers["x-cron-secret"];
      const isCloudCron = cronSecret && headerSecret === cronSecret;
      if (!isCloudCron) {
        const { sdk } = await import("./sdk");
        const user = await sdk.authenticateRequest(req);
        if (!user.isCron) return res.status(403).json({ error: "cron-only" });
      }

      const { getDb } = await import("../db");
      const { newsletterSubscribers } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = await getDb();
      if (!db) return res.json({ ok: true, skipped: "no-db" });

      // Fetch current governance epoch from TzKT
      const epochRes = await fetch("https://api.tzkt.io/v1/voting/epochs/current");
      if (!epochRes.ok) return res.json({ ok: true, skipped: "tzkt-error" });
      const epoch = await epochRes.json();

      // Only alert if there are active proposals and we're in proposal or exploration period
      const proposals = epoch.proposals || [];
      const currentPeriod = (epoch.periods || []).at(-1);
      const alertKinds = ["proposal", "exploration", "promotion"];
      if (!proposals.length || !currentPeriod || !alertKinds.includes(currentPeriod.kind)) {
        return res.json({ ok: true, skipped: "no-active-proposal" });
      }

      const proposal = proposals[0];
      const periodLabel = currentPeriod.kind.charAt(0).toUpperCase() + currentPeriod.kind.slice(1);

      // Get active subscribers with unsubToken for personalised footer links
      const subscribers = await db.select({ email: newsletterSubscribers.email, unsubToken: newsletterSubscribers.unsubToken })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.status, "active"));

      if (!subscribers.length) return res.json({ ok: true, skipped: "no-subscribers" });

      const baseUrl = "https://xtz.news";
      const explorerUrl = `${baseUrl}/explorer`;

      // Build email HTML with personalised footer links
      const buildGovHtml = (token: string | null) => {
        const manageUrl = token ? `${baseUrl}/manage-subscriptions?token=${token}` : baseUrl;
        const unsubUrl = token ? `${baseUrl}/unsubscribe?token=${token}` : baseUrl;
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif"><div style="max-width:600px;margin:0 auto;padding:20px"><div style="text-align:center;padding:24px 0;border-bottom:2px solid #2c7df7;margin-bottom:28px"><img src="${baseUrl}/media/xtz-logo-square_c6689606.png" alt="XTZ.News" style="height:60px" /><h1 style="color:#fff;font-size:22px;margin:12px 0 4px">Tezos Governance Alert</h1><p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0">A new proposal is in the ${periodLabel} phase</p></div><div style="background:#05152e;border:1px solid rgba(44,125,247,0.3);border-radius:8px;padding:24px;margin-bottom:24px"><h2 style="color:#2c7df7;font-size:18px;margin:0 0 12px">Epoch #${epoch.index} — ${periodLabel} Phase</h2><p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0 0 16px">A Tezos protocol upgrade proposal is currently in the <strong style="color:#fff">${periodLabel}</strong> voting period. Bakers are casting their votes now.</p><div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:16px;margin-bottom:16px"><div style="font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">Proposal Hash</div><div style="font-family:monospace;font-size:13px;color:#2c7df7;word-break:break-all">${proposal.hash}</div></div><a href="${explorerUrl}" style="display:inline-block;padding:12px 24px;background:#2c7df7;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:700">View Governance Details →</a></div><div style="text-align:center;padding:20px 0;border-top:1px solid rgba(255,255,255,0.08)"><p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0 0 8px">You're receiving this because you opted in to XTZ.News governance alerts. <a href="${baseUrl}" style="color:#2c7df7">Visit XTZ.News</a></p><p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0"><a href="${manageUrl}" style="color:#2c7df7;text-decoration:none">Manage preferences</a> &nbsp;·&nbsp; <a href="${unsubUrl}" style="color:rgba(255,255,255,0.3);text-decoration:none">Unsubscribe</a></p></div></div></body></html>`;
      };

      // Send via Resend if available, otherwise notify owner
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      let sent = 0;
      if (RESEND_API_KEY) {
        const batchSize = 50;
        for (let i = 0; i < subscribers.length; i += batchSize) {
          const batch = subscribers.slice(i, i + batchSize);
          await Promise.all(batch.map((s: any) =>
            fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                from: "XTZ.News <newsletter@xtz.news>",
                to: [s.email],
                subject: `🗳️ Tezos Governance Alert: Epoch #${epoch.index} ${periodLabel} Phase`,
                html: buildGovHtml(s.unsubToken),
              }),
            })
          ));
          sent += batch.length;
        }
      } else {
        // Fallback: notify owner only
        const { notifyOwner } = await import("./notification");
        await notifyOwner({
          title: `Governance Alert: Epoch #${epoch.index} ${periodLabel} Phase`,
          content: `Proposal: ${proposal.hash}\nSubscribers to notify: ${subscribers.length}\nNote: Set RESEND_API_KEY to enable actual email delivery.`,
        });
        sent = 0;
      }

      res.json({ ok: true, epoch: epoch.index, period: currentPeriod.kind, proposal: proposal.hash, subscribers: subscribers.length, sent });
    } catch (e: any) {
      console.error("[governance-alert] error:", e);
      res.status(500).json({ error: e.message, timestamp: new Date().toISOString() });
    }
  });
  // ─────────────────────────────────────────────────────────────────────────
  // ─── Social Crawler OG Meta Injection ────────────────────────────────────
  // Intercepts requests from Twitter/X, Facebook, Slack, Discord, etc. and
  // injects article-specific og:image, og:title, og:description into the HTML
  // so social sharing previews show the featured image instead of the site logo.
  const SOCIAL_BOTS = /Twitterbot|facebookexternalhit|Slackbot|Discordbot|WhatsApp|LinkedInBot|TelegramBot|Pinterest|Googlebot|bingbot|Applebot|redditbot|Embedly|Quora|Facebot|OutboundLink|W3C_Validator/i;

  app.use(async (req, res, next) => {
    const ua = req.headers['user-agent'] || '';
    if (!SOCIAL_BOTS.test(ua)) return next();
    // Only handle page routes (not API, assets, etc.)
    const p = req.path;
    if (p.startsWith('/api/') || p.startsWith('/manus-storage/') || p.includes('.')) return next();

    try {
      const baseUrl = 'https://xtz.news';
      let title = 'XTZ.News — Tezos Blockchain News & Tools';
      let description = 'The leading source for Tezos blockchain news, analysis, tools, and ecosystem updates.';
      let image = `${baseUrl}/media/xtz-logo-square_c6689606.png`;
      let imageWidth = '1200';
      let imageHeight = '630';
      let type = 'website';
      let publishedTime = '';
      let author = 'XTZ.News';

      // Try to match article slug (not a known route prefix)
      const knownPrefixes = new Set(['category', 'tag', 'projects', 'timeline', 'contact', 'admin', 'explorer', 'staking', 'tools', 'art', 'prices', 'search', 'unsubscribe', 'manage-subscriptions']);
      const slug = p.replace(/^\//, '');
      const firstSegment = slug.split('/')[0];

      if (slug && !knownPrefixes.has(firstSegment) && !slug.includes('/')) {
        // Looks like an article slug — fetch from DB
        try {
          const { getDb } = await import('../db');
          const db = await getDb();
          if (db) {
            const { posts } = await import('../../drizzle/schema');
            const { eq } = await import('drizzle-orm');
            const [post] = await db.select({
              title: posts.title, excerpt: posts.excerpt,
              featuredImageUrl: posts.featuredImageUrl, publishedAt: posts.publishedAt,
            }).from(posts).where(eq(posts.slug, slug)).limit(1);

            if (post) {
              title = post.title;
              description = (post.excerpt || '').replace(/<[^>]*>/g, '').slice(0, 200) || description;
              if (post.featuredImageUrl) {
                image = post.featuredImageUrl.startsWith('http') ? post.featuredImageUrl
                  : post.featuredImageUrl.startsWith('/') ? baseUrl + post.featuredImageUrl.replace(/^\/manus-storage\//, '/media/')
                  : post.featuredImageUrl;
              } else {
                image = `${baseUrl}/api/og?type=article&title=${encodeURIComponent(title.slice(0, 80))}`;
              }
              type = 'article';
              publishedTime = post.publishedAt ? new Date(post.publishedAt).toISOString() : '';
            }
          }
        } catch {}
      }

      // Read the index.html and inject meta tags
      let html: string;
      try {
        const fs = await import('fs');
        const path = await import('path');
        const htmlPath = process.env.NODE_ENV === 'development'
          ? path.resolve(import.meta.dirname, '../..', 'client', 'index.html')
          : path.resolve(import.meta.dirname, 'public', 'index.html');
        html = await fs.promises.readFile(htmlPath, 'utf-8');
      } catch {
        return next();
      }

      const metaTags = [
        `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`,
        `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`,
        `<meta property="og:image" content="${image}" />`,
        `<meta property="og:image:width" content="${imageWidth}" />`,
        `<meta property="og:image:height" content="${imageHeight}" />`,
        `<meta property="og:type" content="${type}" />`,
        `<meta property="og:url" content="${baseUrl}${p}" />`,
        `<meta property="og:site_name" content="XTZ.News" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:site" content="@XTZNews" />`,
        `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />`,
        `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />`,
        `<meta name="twitter:image" content="${image}" />`,
        publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : '',
        author ? `<meta name="author" content="${author}" />` : '',
      ].filter(Boolean).join('\n    ');

      // Inject before </head>
      html = html.replace('</head>', `    ${metaTags}\n  </head>`);

      res.set('Content-Type', 'text/html');
      res.set('Cache-Control', 'public, max-age=300');
      return res.send(html);
    } catch (e) {
      return next();
    }
  });
  // ─────────────────────────────────────────────────────────────────────────
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
