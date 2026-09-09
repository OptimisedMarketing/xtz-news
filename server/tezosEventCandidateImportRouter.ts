import { createHash, verify } from "node:crypto";
import express, { type RequestHandler } from "express";
import { stableJson } from "./translationImportRouter";

export const TEZOS_EVENT_SOURCE_KEYS = ["thetezoscommunity", "art-on-tezos-luma"] as const;
export type TezosEventSourceKey = (typeof TEZOS_EVENT_SOURCE_KEYS)[number];

export interface TezosEventCandidateImportItem {
  sourceKey: TezosEventSourceKey;
  sourceEventId: string;
  sourceUrl: string;
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  location?: string;
  timezone?: string;
  sourceHash: string;
  sourceCheckedAt: string;
}

export interface TezosEventCandidateImportPayload {
  deliveryId: string;
  sentAt: string;
  candidates: TezosEventCandidateImportItem[];
}

export interface TezosEventCandidateImportResult {
  imported: number;
  refreshed: number;
  duplicate?: boolean;
}

export interface TezosEventCandidateImportDependencies {
  publicKey: string;
  importCandidates: (payload: TezosEventCandidateImportPayload, payloadHash: string) => Promise<TezosEventCandidateImportResult>;
  now?: () => number;
}

function validSourceUrl(sourceKey: TezosEventSourceKey, sourceUrl: string): boolean {
  try {
    const url = new URL(sourceUrl);
    if (url.protocol !== "https:") return false;
    if (sourceKey === "thetezoscommunity") return url.hostname === "thetezos.com" && url.pathname.startsWith("/events/");
    return url.hostname === "luma.com" || url.hostname === "lu.ma";
  } catch {
    return false;
  }
}

export function verifyTezosEventCandidateImportSignature(payload: TezosEventCandidateImportPayload, signature: string | undefined, publicKey: string): boolean {
  if (!signature) return false;
  try {
    return verify(null, Buffer.from(stableJson(payload)), publicKey, Buffer.from(signature, "base64"));
  } catch {
    return false;
  }
}

export function isValidTezosEventCandidateImportPayload(payload: TezosEventCandidateImportPayload): boolean {
  const candidates = payload?.candidates;
  const ids = new Set<string>();
  const validCandidate = (candidate: TezosEventCandidateImportItem) => {
    const sourceKey = candidate?.sourceKey;
    const start = Date.parse(candidate?.startAt);
    const end = candidate?.endAt ? Date.parse(candidate.endAt) : start;
    const checked = Date.parse(candidate?.sourceCheckedAt);
    const sourceId = `${sourceKey}:${candidate?.sourceEventId}`;
    if (ids.has(sourceId)) return false;
    ids.add(sourceId);
    return TEZOS_EVENT_SOURCE_KEYS.includes(sourceKey)
      && typeof candidate.sourceEventId === "string" && candidate.sourceEventId.length >= 8 && candidate.sourceEventId.length <= 512
      && typeof candidate.sourceUrl === "string" && candidate.sourceUrl.length <= 2000 && validSourceUrl(sourceKey, candidate.sourceUrl)
      && typeof candidate.title === "string" && candidate.title.trim().length >= 2 && candidate.title.length <= 500
      && (candidate.description === undefined || (typeof candidate.description === "string" && candidate.description.length <= 1600))
      && Number.isFinite(start) && Number.isFinite(end) && end >= start && Number.isFinite(checked)
      && (candidate.location === undefined || (typeof candidate.location === "string" && candidate.location.length <= 500))
      && (candidate.timezone === undefined || (typeof candidate.timezone === "string" && candidate.timezone.length <= 64))
      && typeof candidate.sourceHash === "string" && /^[a-f0-9]{64}$/i.test(candidate.sourceHash);
  };
  return typeof payload?.deliveryId === "string" && payload.deliveryId.length >= 16 && payload.deliveryId.length <= 128
    && Array.isArray(candidates) && candidates.length <= 100 && candidates.every(validCandidate);
}

export function createTezosEventCandidateImportRouter({ publicKey, importCandidates, now = Date.now }: TezosEventCandidateImportDependencies): RequestHandler {
  const router = express.Router();
  router.use(express.json({ limit: "512kb" }));
  router.post("/", async (req, res) => {
    const payload = req.body as TezosEventCandidateImportPayload;
    const sentAt = Date.parse(payload?.sentAt);
    const isFresh = Number.isFinite(sentAt) && Math.abs(now() - sentAt) <= 10 * 60 * 1000;
    const signature = req.header("X-XTZ-Tezos-Event-Candidate-Signature") ?? undefined;
    if (!isFresh || !isValidTezosEventCandidateImportPayload(payload) || !verifyTezosEventCandidateImportSignature(payload, signature, publicKey)) {
      return res.status(401).json({ error: "Invalid Tezos event candidate import signature or payload" });
    }
    try {
      const payloadHash = createHash("sha256").update(stableJson(payload)).digest("hex");
      const result = await importCandidates(payload, payloadHash);
      return res.status(result.duplicate ? 200 : 201).json(result);
    } catch (error) {
      console.error("Tezos event candidate import failed", error instanceof Error ? error.message : error);
      return res.status(500).json({ error: "Tezos event candidate import failed" });
    }
  });
  return router;
}
