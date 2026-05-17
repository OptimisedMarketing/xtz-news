import express from "express";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

export const uploadRouter = express.Router();

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
