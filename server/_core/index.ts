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
