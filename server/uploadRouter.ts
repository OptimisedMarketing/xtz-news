import express from "express";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { ENV } from "./_core/env";

export const uploadRouter = express.Router();

// ─── Media proxy: pipes wp-media images directly (avoids 307 redirect) ─────────
// This endpoint is in uploadRouter.ts which IS deployed (unlike server/_core/*)
uploadRouter.get("/api/media/wp/:key", async (req, res) => {
  const key = `wp-media/${req.params.key}`;
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
    if (!imgResp.ok) return res.redirect(307, url); // fallback to redirect
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

// Multipart file upload endpoint
uploadRouter.post("/api/upload", express.raw({ type: "*/*", limit: "20mb" }), async (req, res) => {
  try {
    const contentType = req.headers["content-type"] || "application/octet-stream";
    const filename = (req.headers["x-filename"] as string) || `file-${nanoid(8)}`;
    const folder = (req.headers["x-folder"] as string) || "submissions";

    // Sanitize filename
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${folder}/${nanoid(12)}_${safeName}`;

    const { url } = await storagePut(key, req.body as Buffer, contentType);

    res.json({ success: true, url, key });
  } catch (err) {
    console.error("[Upload] Error:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});
