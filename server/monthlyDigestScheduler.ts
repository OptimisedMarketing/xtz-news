import { verify } from "node:crypto";
import { stableJson } from "./translationImportRouter";

export interface MonthlyDigestSchedulePayload {
  deliveryId: string;
  sentAt: string;
  dryRun?: boolean;
}

export function isValidMonthlyDigestPayload(payload: MonthlyDigestSchedulePayload, now: number = Date.now()): boolean {
  const sentAt = Date.parse(payload?.sentAt);
  return typeof payload?.deliveryId === "string"
    && /^[a-z0-9:_-]{16,128}$/i.test(payload.deliveryId)
    && typeof payload?.dryRun === "boolean"
    && Number.isFinite(sentAt)
    && Math.abs(now - sentAt) <= 10 * 60 * 1000;
}

export function verifyMonthlyDigestScheduleSignature(
  payload: MonthlyDigestSchedulePayload,
  signature: string | undefined,
  publicKey: string,
): boolean {
  if (!signature) return false;
  try {
    return verify(null, Buffer.from(stableJson(payload)), publicKey, Buffer.from(signature, "base64"));
  } catch {
    return false;
  }
}

