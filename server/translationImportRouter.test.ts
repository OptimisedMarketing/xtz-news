// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import crypto from "node:crypto";
import express from "express";
import { createServer, type Server } from "node:http";
import { createTranslationImportRouter, stableJson, type TranslationImportPayload } from "./translationImportRouter";

const secret = process.env.XTZ_TRANSLATION_INGEST_SECRET;
const signingPair = crypto.generateKeyPairSync("ed25519");
const payload: TranslationImportPayload = {
  deliveryId: "test-delivery-20260831-0001",
  sentAt: new Date().toISOString(),
  translations: [{
    postId: 1,
    locale: "zh",
    title: "测试标题",
    slug: "test-story",
    excerpt: "测试摘要",
    content: "<p>测试内容</p>",
    metaTitle: "测试标题",
    metaDescription: "测试描述",
    keyTakeaways: "• 要点一\n• 要点二",
  }],
};

let server: Server | undefined;

afterEach(async () => {
  await new Promise<void>((resolve) => server?.close(() => resolve()) ?? resolve());
  server = undefined;
});

describe("signed translation import endpoint", () => {
  it("accepts a request signed with the configured translation ingestion secret", async () => {
    expect(secret).toBeTruthy();
    const app = express();
    app.use("/api/internal/translations/import", createTranslationImportRouter({
      publicKey: signingPair.publicKey.export({ type: "spki", format: "pem" }).toString(),
      importBatch: async () => ({ imported: 1 }),
    }));
    server = createServer(app);
    await new Promise<void>((resolve) => server!.listen(0, "127.0.0.1", resolve));
    const port = (server.address() as { port: number }).port;

    const response = await fetch(`http://127.0.0.1:${port}/api/internal/translations/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-XTZ-Translation-Signature": crypto.sign(null, Buffer.from(stableJson(payload)), signingPair.privateKey).toString("base64"),
      },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ imported: 1 });
  });
});
