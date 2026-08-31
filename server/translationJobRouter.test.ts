// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import crypto from "node:crypto";
import express from "express";
import { createServer, type Server } from "node:http";
import { createTranslationJobRouter, type TranslationJobRequest } from "./translationJobRouter";
import { stableJson } from "./translationImportRouter";

const signingPair = crypto.generateKeyPairSync("ed25519");
const payload: TranslationJobRequest = {
  deliveryId: "job-request-20260831-0001",
  sentAt: new Date().toISOString(),
  locale: "zh",
  limit: 1,
};
let server: Server | undefined;

afterEach(async () => {
  await new Promise<void>((resolve) => server?.close(() => resolve()) ?? resolve());
  server = undefined;
});

describe("signed translation job endpoint", () => {
  it("returns a bounded job only for a valid cloud signature", async () => {
    const app = express();
    app.use("/api/internal/translations/jobs", createTranslationJobRouter({
      publicKey: signingPair.publicKey.export({ type: "spki", format: "pem" }).toString(),
      getJobs: async () => [{ id: 10, title: "Story", slug: "story", excerpt: null, content: "<p>Text</p>", keyTakeaways: "• Key point" }],
    }));
    server = createServer(app);
    await new Promise<void>((resolve) => server!.listen(0, "127.0.0.1", resolve));
    const port = (server.address() as { port: number }).port;
    const signature = crypto.sign(null, Buffer.from(stableJson(payload)), signingPair.privateKey).toString("base64");

    const response = await fetch(`http://127.0.0.1:${port}/api/internal/translations/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-XTZ-Translation-Signature": signature },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ jobs: [{ id: 10, slug: "story" }] });
  });
});
