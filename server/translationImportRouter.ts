import crypto from "node:crypto";
import express, { type RequestHandler } from "express";

export interface TranslationImportPayload {
  deliveryId: string;
  sentAt: string;
  translations: Array<{
    postId: number;
    locale: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    metaTitle: string;
    metaDescription: string;
    keyTakeaways: string;
  }>;
}

export function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${stableJson(object[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function verifyTranslationImportSignature(payload: TranslationImportPayload, signature: string | undefined, publicKey: string): boolean {
  if (!signature) return false;
  try {
    return crypto.verify(
      null,
      Buffer.from(stableJson(payload)),
      publicKey,
      Buffer.from(signature, "base64"),
    );
  } catch {
    return false;
  }
}

export interface TranslationImportResult {
  imported: number;
  duplicate?: boolean;
}

export interface TranslationImportDependencies {
  publicKey: string;
  importBatch: (payload: TranslationImportPayload, payloadHash: string) => Promise<TranslationImportResult>;
  now?: () => number;
}

export function createTranslationImportRouter({ publicKey, importBatch, now = Date.now }: TranslationImportDependencies): RequestHandler {
  const router = express.Router();
  router.use(express.json({ limit: "2mb" }));

  router.post("/", async (req, res) => {
    const payload = req.body as TranslationImportPayload;
    const sentAt = Date.parse(payload?.sentAt);
    const isFresh = Number.isFinite(sentAt) && Math.abs(now() - sentAt) <= 10 * 60 * 1000;
    const hasValidPayload = typeof payload?.deliveryId === "string" && payload.deliveryId.length >= 16
      && Array.isArray(payload.translations) && payload.translations.length > 0 && payload.translations.length <= 50;

    if (!isFresh || !hasValidPayload || !verifyTranslationImportSignature(payload, req.header("X-XTZ-Translation-Signature") ?? undefined, publicKey)) {
      return res.status(401).json({ error: "Invalid translation import signature or payload" });
    }

    try {
      const payloadHash = crypto.createHash("sha256").update(stableJson(payload)).digest("hex");
      const result = await importBatch(payload, payloadHash);
      return res.status(result.duplicate ? 200 : 201).json(result);
    } catch (error) {
      console.error("Translation import failed", error instanceof Error ? error.message : error);
      return res.status(500).json({ error: "Translation import failed" });
    }
  });

  return router;
}
