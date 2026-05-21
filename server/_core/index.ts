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
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(uploadRouter);

  // ─── SEO Redirects (WordPress → new site URL structure) ───────────────────
  // 1. Legacy WordPress /tezos-projects/ → /projects
  app.get("/tezos-projects", (req, res) => res.redirect(301, "/projects"));
  app.get("/tezos-projects/", (req, res) => res.redirect(301, "/projects"));
  // 2. Remove trailing slashes (WordPress used /slug/, new site uses /slug)
  app.use((req, res, next) => {
    if (req.path !== "/" && req.path.endsWith("/") && !req.path.startsWith("/api/")) {
      const newPath = req.path.slice(0, -1) + (req.url.includes("?") ? req.url.slice(req.path.length) : "");
      return res.redirect(301, newPath);
    }
    next();
  });
  // 3. Legacy WordPress /en/ prefix (WPML) → remove prefix
  app.get("/en/*", (req, res) => {
    const newPath = req.path.replace(/^\/en/, "") || "/";
    res.redirect(301, newPath);
  });
  // 4. Legacy /fr/, /de/, /es/, /it/, /ja/, /ko/, /zh/ language prefixes → homepage
  for (const lang of ["fr", "de", "es", "it", "ja", "ko", "zh", "uk", "hi"]) {
    app.get(`/${lang}/*`, (req, res) => res.redirect(301, "/"));
    app.get(`/${lang}`, (req, res) => res.redirect(301, "/"));
  }
  // ─────────────────────────────────────────────────────────────────────────

  // ─── Dynamic Sitemap ─────────────────────────────────────────────────────
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
      ];

      let allPosts: { slug: string; publishedAt: Date | null; updatedAt: Date | null }[] = [];
      let allCats: { slug: string }[] = [];
      let allTagsList: { slug: string }[] = [];

      if (db) {
        allPosts = await db
          .select({ slug: posts.slug, publishedAt: posts.publishedAt, updatedAt: posts.updatedAt })
          .from(posts)
          .where(eq(posts.status, "publish"))
          .orderBy(desc(posts.publishedAt))
          .limit(2000);

        allCats = await db.select({ slug: categories.slug }).from(categories);
        allTagsList = await db.select({ slug: tags.slug }).from(tags);
      }

      const formatDate = (d: Date | null) =>
        d ? new Date(d).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

      const today = new Date().toISOString().split("T")[0];

      const lines: string[] = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
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

      // Article pages
      for (const post of allPosts) {
        const lastmod = formatDate(post.updatedAt || post.publishedAt);
        lines.push(
          `  <url>\n    <loc>${baseUrl}/${post.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
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
  app.get("/robots.txt", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: https://xtz.news/sitemap.xml\n`
    );
  });

  // ─── Weekly Newsletter Digest ──────────────────────────────────────────────────
  app.post("/api/scheduled/weekly-digest", async (req, res) => {
    try {
      const { sdk } = await import("./_core/sdk").catch(() => import("./sdk"));
      const sdkModule = await import("./sdk");
      const user = await sdkModule.sdk.authenticateRequest(req);
      if (!user.isCron) return res.status(403).json({ error: "cron-only" });

      const { getDb } = await import("../db");
      const { posts, newsletterSubscribers } = await import("../../drizzle/schema");
      const { eq, desc, gte } = await import("drizzle-orm");
      const { invokeLLM } = await import("./_core/llm").catch(() => import("./llm"));
      const llmModule = await import("./llm");
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

      // Get all active subscribers
      const subscribers = await db.select({ email: newsletterSubscribers.email })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.status, "active"));

      if (!subscribers.length) return res.json({ ok: true, skipped: "no-subscribers" });

      // Build the email HTML
      const baseUrl = "https://xtz.news";
      const articlesHtml = topPosts.map(p => {
        const excerpt = (p.excerpt || "").replace(/<[^>]*>/g, "").slice(0, 120);
        const img = p.featuredImageUrl ? `<img src="${p.featuredImageUrl.startsWith('/') ? baseUrl + p.featuredImageUrl : p.featuredImageUrl}" style="width:100%;max-height:200px;object-fit:cover;border-radius:6px;margin-bottom:12px" />` : "";
        return `<div style="margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,0.08)">${img}<h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#fff"><a href="${baseUrl}/${p.slug}" style="color:#fff;text-decoration:none">${p.title}</a></h3><p style="margin:0 0 12px;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6">${excerpt}...</p><a href="${baseUrl}/${p.slug}" style="display:inline-block;padding:8px 18px;background:#2c7df7;color:#fff;text-decoration:none;border-radius:4px;font-size:13px;font-weight:600">Read More</a></div>`;
      }).join("");

      const emailHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif"><div style="max-width:600px;margin:0 auto;padding:20px"><div style="text-align:center;padding:24px 0;border-bottom:2px solid #2c7df7;margin-bottom:28px"><img src="${baseUrl}/manus-storage/xtz-logo-square_c6689606.png" alt="XTZ.News" style="height:60px" /><h1 style="color:#fff;font-size:22px;margin:12px 0 4px">XTZ.News Weekly Digest</h1><p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0">Your weekly roundup of Tezos news</p></div>${articlesHtml}<div style="text-align:center;padding:20px 0;border-top:1px solid rgba(255,255,255,0.08);margin-top:8px"><p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0">You're receiving this because you subscribed to XTZ.News. <a href="${baseUrl}" style="color:#2c7df7">Visit XTZ.News</a></p></div></div></body></html>`;

      // Send via Manus notification system (owner notification as proxy for now)
      // In production, integrate with an email service like Resend or SendGrid
      const { notifyOwner } = await import("./_core/notification").catch(() => import("./notification"));
      const notifyModule = await import("./_core/notification");
      await notifyModule.notifyOwner({
        title: `Weekly Digest Ready — ${topPosts.length} articles, ${subscribers.length} subscribers`,
        content: `Top articles this week:\n${topPosts.map((p, i) => `${i+1}. ${p.title} — ${baseUrl}/${p.slug}`).join("\n")}\n\nSubscribers: ${subscribers.length}`,
      });

      res.json({ ok: true, articles: topPosts.length, subscribers: subscribers.length });
    } catch (e: any) {
      console.error("[weekly-digest] error:", e);
      res.status(500).json({ error: e.message, timestamp: new Date().toISOString() });
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
