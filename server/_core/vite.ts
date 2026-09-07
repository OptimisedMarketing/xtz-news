import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, _server: Server) {
  const serverOptions = {
    middlewareMode: true,
    // The managed preview proxy serves the application HTTP traffic but does
    // not reliably forward this custom middleware-mode WebSocket upgrade.
    // HMR is therefore disabled only for development preview: source changes
    // still rebuild and readers can refresh normally, without a noisy or
    // repeatedly failing localhost:5173 socket in their browser console.
    hmr: false,
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      // Do not call Vite's index transformer in the managed preview. In
      // middleware mode it injects /@vite/client even when HMR is disabled,
      // and that client attempts a WebSocket upgrade the preview proxy cannot
      // reliably forward. The raw template still loads the Vite-served source
      // modules and styles normally, but cannot acquire an HMR socket.
      const page = template;
      // A signed-in preview can otherwise retain an earlier HTML document that
      // referenced Vite's removed HMR client. Never cache development HTML so
      // refreshes always receive the WebSocket-free preview shell.
      res.status(200).set({ "Content-Type": "text/html", "Cache-Control": "no-store" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
