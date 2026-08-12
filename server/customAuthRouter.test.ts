import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { customAuthRouter } from "./customAuthRouter";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { cookie: () => {}, clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("customAuthRouter input validation", () => {
  const caller = customAuthRouter.createCaller(createPublicContext());
  const validOrigin = "https://xtz.news";

  it("rejects weak registration passwords and invalid registration details before database access", async () => {
    await expect(caller.register({ name: "A", email: "not-an-email", password: "weak", origin: validOrigin })).rejects.toThrow();
    await expect(caller.register({ name: "Reader", email: "reader@example.com", password: "alllowercase1", origin: validOrigin })).rejects.toThrow();
    await expect(caller.register({ name: "Reader", email: "reader@example.com", password: "ALLUPPERCASE1", origin: validOrigin })).rejects.toThrow();
    await expect(caller.register({ name: "Reader", email: "reader@example.com", password: "NoNumbersHere", origin: validOrigin })).rejects.toThrow();
  });

  it("rejects malformed login input", async () => {
    await expect(caller.login({ email: "bad", password: "" })).rejects.toThrow();
  });

  it("rejects an empty email verification token", async () => {
    await expect(caller.verifyEmail({ token: "" })).rejects.toThrow();
  });

  it("rejects malformed email and origin inputs for verification resends", async () => {
    await expect(caller.resendVerification({ email: "bad", origin: "not-a-url" })).rejects.toThrow();
  });

  it("rejects malformed email and origin inputs for password resets", async () => {
    await expect(caller.requestPasswordReset({ email: "bad", origin: "not-a-url" })).rejects.toThrow();
  });

  it("rejects reset attempts with an empty token or weak password", async () => {
    await expect(caller.resetPassword({ token: "", password: "ValidPass1" })).rejects.toThrow();
    await expect(caller.resetPassword({ token: "a-valid-token", password: "weak" })).rejects.toThrow();
  });
});
