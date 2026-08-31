import crypto from "node:crypto";
import express, { type RequestHandler } from "express";
import { stableJson } from "./translationImportRouter";
import { SUPPORTED_LOCALES } from "../shared/locales";

export interface TranslationJobRequest {
  deliveryId: string;
  sentAt: string;
  locale: string;
  limit: number;
  slug?: string;
}

export interface TranslationJob {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  keyTakeaways: string | null;
}

export function verifyTranslationJobSignature(payload: TranslationJobRequest, signature: string | undefined, publicKey: string): boolean {
  if (!signature) return false;
  try {
    return crypto.verify(null, Buffer.from(stableJson(payload)), publicKey, Buffer.from(signature, "base64"));
  } catch {
    return false;
  }
}

export interface TranslationJobDependencies {
  publicKey: string;
  getJobs: (locale: string, limit: number, slug?: string) => Promise<TranslationJob[]>;
  now?: () => number;
}

export function createTranslationJobRouter({ publicKey, getJobs, now = Date.now }: TranslationJobDependencies): RequestHandler {
  const router = express.Router();
  router.use(express.json({ limit: "32kb" }));

  router.post("/", async (req, res) => {
    const payload = req.body as TranslationJobRequest;
    const sentAt = Date.parse(payload?.sentAt);
    const validRequest = typeof payload?.deliveryId === "string" && payload.deliveryId.length >= 16
      && Number.isInteger(payload?.limit) && payload.limit >= 1 && payload.limit <= 5
      && SUPPORTED_LOCALES.includes(payload?.locale as typeof SUPPORTED_LOCALES[number])
      && Number.isFinite(sentAt) && Math.abs(now() - sentAt) <= 10 * 60 * 1000;

    if (!validRequest || !verifyTranslationJobSignature(payload, req.header("X-XTZ-Translation-Signature") ?? undefined, publicKey)) {
      return res.status(401).json({ error: "Invalid translation job request" });
    }

    const jobs = await getJobs(payload.locale, payload.limit, payload.slug);
    return res.json({ jobs });
  });

  return router;
}
