import { generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { stableJson } from "./translationImportRouter";
import { isValidMonthlyDigestPayload, verifyMonthlyDigestScheduleSignature } from "./monthlyDigestScheduler";

describe("monthly digest scheduler authentication", () => {
  const payload = {
    deliveryId: "monthly-digest-2026-09-01-abc123",
    sentAt: "2026-09-01T08:00:00.000Z",
    dryRun: true,
  };

  it("accepts a fresh signed scheduler payload", () => {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");
    const signature = sign(null, Buffer.from(stableJson(payload)), privateKey).toString("base64");

    expect(isValidMonthlyDigestPayload(payload, Date.parse("2026-09-01T08:05:00.000Z"))).toBe(true);
    expect(verifyMonthlyDigestScheduleSignature(payload, signature, publicKey.export({ type: "spki", format: "pem" }).toString())).toBe(true);
  });

  it("rejects stale or altered payloads", () => {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");
    const signature = sign(null, Buffer.from(stableJson(payload)), privateKey).toString("base64");
    const publicPem = publicKey.export({ type: "spki", format: "pem" }).toString();

    expect(isValidMonthlyDigestPayload(payload, Date.parse("2026-09-01T08:11:00.000Z"))).toBe(false);
    expect(verifyMonthlyDigestScheduleSignature({ ...payload, dryRun: false }, signature, publicPem)).toBe(false);
  });
});

