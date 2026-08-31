import { generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { stableJson } from "./translationImportRouter";
import { TEZORACLE_OFFICIAL_STATUS_URL, type TezOracleStatusImportPayload, verifyTezOracleStatusSignature } from "./tezoracleStatusImportRouter";

describe("TezOracle status import signature", () => {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const payload: TezOracleStatusImportPayload = {
    deliveryId: "tezoracle-status-check-0001",
    sentAt: "2026-08-31T20:00:00.000Z",
    sourceUrl: TEZORACLE_OFFICIAL_STATUS_URL,
    sourceHash: "a".repeat(64),
    sourceCheckedAt: "2026-08-31T20:00:00.000Z",
    milestones: { architecture: "Defined", implementation: "Next", testnet: "Planned", production: "Gated" },
    contractAddresses: [],
  };

  it("accepts the exact signed payload and rejects changed content", () => {
    const signature = sign(null, Buffer.from(stableJson(payload)), privateKey).toString("base64");
    expect(verifyTezOracleStatusSignature(payload, signature, publicKey.export({ type: "spki", format: "pem" }).toString())).toBe(true);
    expect(verifyTezOracleStatusSignature({ ...payload, milestones: { ...payload.milestones, testnet: "Gated" } }, signature, publicKey.export({ type: "spki", format: "pem" }).toString())).toBe(false);
  });
});
