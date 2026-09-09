import { generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { isValidTezosEventCandidateImportPayload, verifyTezosEventCandidateImportSignature, type TezosEventCandidateImportPayload } from "./tezosEventCandidateImportRouter";
import { stableJson } from "./translationImportRouter";

describe("Tezos event-candidate import payload", () => {
  const payload: TezosEventCandidateImportPayload = {
    deliveryId: "tezos-events-2026-09-09-abcdef",
    sentAt: "2026-09-09T12:00:00.000Z",
    candidates: [{ sourceKey: "thetezoscommunity", sourceEventId: "https://thetezos.com/events/artz-fridays/", sourceUrl: "https://thetezos.com/events/artz-fridays/", title: "Artz Fridays", startAt: "2026-09-11T18:00:00.000Z", sourceCheckedAt: "2026-09-09T12:00:00.000Z", sourceHash: "a".repeat(64) }],
  };

  it("accepts only a correctly signed source-allowlisted payload", () => {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");
    const signature = sign(null, Buffer.from(stableJson(payload)), privateKey).toString("base64");
    expect(isValidTezosEventCandidateImportPayload(payload)).toBe(true);
    expect(verifyTezosEventCandidateImportSignature(payload, signature, publicKey.export({ type: "spki", format: "pem" }).toString())).toBe(true);
    expect(isValidTezosEventCandidateImportPayload({ ...payload, candidates: [{ ...payload.candidates[0], sourceUrl: "https://example.invalid/event" }] })).toBe(false);
  });
});
