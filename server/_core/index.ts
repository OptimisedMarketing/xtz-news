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
