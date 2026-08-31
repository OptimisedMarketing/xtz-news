import express, { type RequestHandler } from "express";
import { createHash, verify } from "node:crypto";
import { stableJson } from "./translationImportRouter";

export const TEZORACLE_OFFICIAL_STATUS_URL = "https://tezoracle.com/";
export const TEZORACLE_STATUS_VALUES = ["Defined", "Next", "Planned", "Gated", "Unknown"] as const;
export type TezOracleStatusValue = (typeof TEZORACLE_STATUS_VALUES)[number];

export interface TezOracleContractAddress {
  network: string;
  address: string;
  label?: string;
}

export interface TezOracleStatusImportPayload {
  deliveryId: string;
  sentAt: string;
  sourceUrl: string;
  sourceHash: string;
  sourceCheckedAt: string;
  milestones: {
    architecture: TezOracleStatusValue;
    implementation: TezOracleStatusValue;
    testnet: TezOracleStatusValue;
    production: TezOracleStatusValue;
  };
  contractAddresses: TezOracleContractAddress[];
}

export interface TezOracleStatusImportResult {
  changed: boolean;
  duplicate?: boolean;
}

export interface TezOracleStatusImportDependencies {
  publicKey: string;
  importStatus: (payload: TezOracleStatusImportPayload, payloadHash: string) => Promise<TezOracleStatusImportResult>;
  now?: () => number;
}

export function verifyTezOracleStatusSignature(payload: TezOracleStatusImportPayload, signature: string | undefined, publicKey: string): boolean {
  if (!signature) return false;
  try {
    return verify(null, Buffer.from(stableJson(payload)), publicKey, Buffer.from(signature, "base64"));
  } catch {
    return false;
  }
}

function hasValidPayload(payload: TezOracleStatusImportPayload): boolean {
  const sourceCheckedAt = Date.parse(payload?.sourceCheckedAt);
  const statuses = payload?.milestones;
  const validStatus = (value: unknown): value is TezOracleStatusValue => typeof value === "string" && TEZORACLE_STATUS_VALUES.includes(value as TezOracleStatusValue);
  const validAddresses = Array.isArray(payload?.contractAddresses)
    && payload.contractAddresses.length <= 20
    && payload.contractAddresses.every((entry) => typeof entry?.network === "string" && entry.network.length > 0 && entry.network.length <= 64
      && typeof entry.address === "string" && entry.address.length >= 3 && entry.address.length <= 256
      && (entry.label === undefined || (typeof entry.label === "string" && entry.label.length <= 120)));

  return typeof payload?.deliveryId === "string" && payload.deliveryId.length >= 16 && payload.deliveryId.length <= 128
    && payload.sourceUrl === TEZORACLE_OFFICIAL_STATUS_URL
    && typeof payload.sourceHash === "string" && /^[a-f0-9]{64}$/i.test(payload.sourceHash)
    && Number.isFinite(sourceCheckedAt)
    && validStatus(statuses?.architecture) && validStatus(statuses?.implementation)
    && validStatus(statuses?.testnet) && validStatus(statuses?.production)
    && validAddresses;
}

export function createTezOracleStatusImportRouter({ publicKey, importStatus, now = Date.now }: TezOracleStatusImportDependencies): RequestHandler {
  const router = express.Router();
  router.use(express.json({ limit: "64kb" }));

  router.post("/", async (req, res) => {
    const payload = req.body as TezOracleStatusImportPayload;
    const sentAt = Date.parse(payload?.sentAt);
    const isFresh = Number.isFinite(sentAt) && Math.abs(now() - sentAt) <= 10 * 60 * 1000;
    if (!isFresh || !hasValidPayload(payload) || !verifyTezOracleStatusSignature(payload, req.header("X-XTZ-TezOracle-Status-Signature") ?? undefined, publicKey)) {
      return res.status(401).json({ error: "Invalid TezOracle status import signature or payload" });
    }

    try {
      const payloadHash = createHash("sha256").update(stableJson(payload)).digest("hex");
      const result = await importStatus(payload, payloadHash);
      return res.status(result.duplicate ? 200 : 201).json(result);
    } catch (error) {
      console.error("TezOracle status import failed", error instanceof Error ? error.message : error);
      return res.status(500).json({ error: "TezOracle status import failed" });
    }
  });

  return router;
}
