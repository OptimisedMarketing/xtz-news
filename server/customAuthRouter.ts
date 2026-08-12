import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { Resend } from "resend";
import { z } from "zod";
import { passwordResetTokens, users } from "../drizzle/schema";
import { getDb } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { publicProcedure, router } from "./_core/trpc";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const SALT_ROUNDS = 12;
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;
const DEFAULT_ORIGIN = "https://xtz.news";
const EMAIL_FROM = "XTZ.News <newsletter@xtz.news>";

const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[0-9]/, "Password must include a number.");

const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address.");

function safeOrigin(origin: string) {
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    if (
      url.protocol === "https:" &&
      (host === "xtz.news" || host === "www.xtz.news" || host.endsWith(".manus.space") || host.endsWith(".manus.computer"))
    ) {
      return url.origin;
    }
    if (url.protocol === "http:" && (host === "localhost" || host === "127.0.0.1")) return url.origin;
  } catch {
    // Fall through to the production site for malformed client input.
  }
  return DEFAULT_ORIGIN;
}

function verificationEmailHtml(verifyUrl: string) {
  return `<!doctype html><html><body style="margin:0;background:#020817;font-family:Arial,sans-serif;color:#eef5ff"><div style="max-width:600px;margin:0 auto;padding:32px 20px"><div style="border-bottom:2px solid #2c7df7;padding-bottom:18px;margin-bottom:24px"><img src="https://xtz.news/manus-storage/xtz-logo-square_c6689606.png" alt="XTZ.News" width="64" height="64" style="display:block" /><h1 style="font-size:24px;margin:16px 0 6px;color:#ffffff">Confirm your XTZ.News account</h1><p style="color:#9fb4d6;margin:0">Choose the Tezos topics you want to follow.</p></div><div style="background:#05152e;border:1px solid rgba(44,125,247,.35);border-radius:10px;padding:24px"><p style="line-height:1.6;margin-top:0">Click below to verify your email and activate your reader account.</p><a href="${verifyUrl}" style="display:inline-block;background:#2c7df7;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:700">Verify email address</a><p style="color:#9fb4d6;font-size:13px;line-height:1.5;margin:20px 0 0">If the button does not work, copy this link into your browser:<br/><a href="${verifyUrl}" style="color:#73a8ff;word-break:break-all">${verifyUrl}</a></p></div></div></body></html>`;
}

function resetEmailHtml(resetUrl: string) {
  return `<!doctype html><html><body style="margin:0;background:#020817;font-family:Arial,sans-serif;color:#eef5ff"><div style="max-width:600px;margin:0 auto;padding:32px 20px"><div style="border-bottom:2px solid #2c7df7;padding-bottom:18px;margin-bottom:24px"><img src="https://xtz.news/manus-storage/xtz-logo-square_c6689606.png" alt="XTZ.News" width="64" height="64" style="display:block" /><h1 style="font-size:24px;margin:16px 0 6px;color:#ffffff">Reset your XTZ.News password</h1></div><div style="background:#05152e;border:1px solid rgba(44,125,247,.35);border-radius:10px;padding:24px"><p style="line-height:1.6;margin-top:0">Use the link below to choose a new password. It expires in one hour.</p><a href="${resetUrl}" style="display:inline-block;background:#2c7df7;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:700">Reset password</a><p style="color:#9fb4d6;font-size:13px;line-height:1.5;margin:20px 0 0">If you did not request this, you can safely ignore this email.</p></div></div></body></html>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Email delivery is not configured.");
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({ from: EMAIL_FROM, to: [to], subject, html });
  if (result.error) throw new Error(result.error.message);
}

function genericEmailSuccess() {
  return {
    success: true,
    message: "If an eligible account exists, an email is on its way.",
  } as const;
}

export const customAuthRouter = router({
  register: publicProcedure
    .input(z.object({ name: z.string().trim().min(2).max(100), email: emailSchema, password: passwordSchema, origin: z.string().url() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Registration is temporarily unavailable." });

      const verifyToken = crypto.randomBytes(32).toString("hex");
      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
      const [existing] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

      if (existing?.passwordHash) {
        // Return the same message as a new registration so the endpoint does not
        // reveal whether a reader account already exists for an email address.
        return { success: true, requiresVerification: true, message: "Check your email to verify your account." } as const;
      }

      if (existing) {
        await db.update(users).set({ name: input.name, passwordHash, emailVerified: false, emailVerifyToken: verifyToken, loginMethod: "email" }).where(eq(users.id, existing.id));
      } else {
        await db.insert(users).values({
          openId: `local_${crypto.randomBytes(16).toString("hex")}`,
          name: input.name,
          email: input.email,
          loginMethod: "email",
          passwordHash,
          emailVerified: false,
          emailVerifyToken: verifyToken,
          lastSignedIn: new Date(),
        });
      }

      const verifyUrl = `${safeOrigin(input.origin)}/verify-email?token=${encodeURIComponent(verifyToken)}`;
      try {
        await sendEmail(input.email, "Verify your XTZ.News reader account", verificationEmailHtml(verifyUrl));
      } catch (error) {
        console.error("[CustomAuth] Verification email failed", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "We could not send the verification email. Please try again shortly." });
      }

      return { success: true, requiresVerification: true, message: "Check your email to verify your account." } as const;
    }),

  login: publicProcedure
    .input(z.object({ email: emailSchema, password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Sign-in is temporarily unavailable." });
      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      const isValid = Boolean(user?.passwordHash) && await bcrypt.compare(input.password, user.passwordHash!);
      if (!isValid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect email or password." });
      if (!user!.emailVerified) throw new TRPCError({ code: "FORBIDDEN", message: "Please verify your email before signing in." });

      await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user!.id));
      const sessionToken = await sdk.createSessionToken(user!.openId, { name: user!.name || "XTZ.News Reader" });
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS });
      return { success: true, user: { id: user!.id, name: user!.name, email: user!.email, role: user!.role } } as const;
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string().min(1).max(128) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Verification is temporarily unavailable." });
      const [user] = await db.select().from(users).where(eq(users.emailVerifyToken, input.token)).limit(1);
      if (!user) throw new TRPCError({ code: "BAD_REQUEST", message: "This verification link is invalid or has already been used." });
      await db.update(users).set({ emailVerified: true, emailVerifyToken: null }).where(eq(users.id, user.id));
      return { success: true } as const;
    }),

  resendVerification: publicProcedure
    .input(z.object({ email: emailSchema, origin: z.string().url() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return genericEmailSuccess();
      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (!user || user.emailVerified || !user.passwordHash) return genericEmailSuccess();
      const verifyToken = crypto.randomBytes(32).toString("hex");
      await db.update(users).set({ emailVerifyToken: verifyToken }).where(eq(users.id, user.id));
      const verifyUrl = `${safeOrigin(input.origin)}/verify-email?token=${encodeURIComponent(verifyToken)}`;
      try {
        await sendEmail(input.email, "Verify your XTZ.News reader account", verificationEmailHtml(verifyUrl));
      } catch (error) {
        console.error("[CustomAuth] Resend verification failed", error);
      }
      return genericEmailSuccess();
    }),

  requestPasswordReset: publicProcedure
    .input(z.object({ email: emailSchema, origin: z.string().url() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return genericEmailSuccess();
      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (!user?.passwordHash) return genericEmailSuccess();

      const resetToken = crypto.randomBytes(32).toString("hex");
      await db.insert(passwordResetTokens).values({ userId: user.id, token: resetToken, expiresAt: new Date(Date.now() + RESET_TOKEN_EXPIRY_MS), used: false });
      const resetUrl = `${safeOrigin(input.origin)}/reset-password?token=${encodeURIComponent(resetToken)}`;
      try {
        await sendEmail(input.email, "Reset your XTZ.News password", resetEmailHtml(resetUrl));
      } catch (error) {
        console.error("[CustomAuth] Password reset email failed", error);
      }
      return genericEmailSuccess();
    }),

  resetPassword: publicProcedure
    .input(z.object({ token: z.string().min(1).max(128), password: passwordSchema }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Password reset is temporarily unavailable." });
      const [reset] = await db.select().from(passwordResetTokens).where(and(eq(passwordResetTokens.token, input.token), eq(passwordResetTokens.used, false), gt(passwordResetTokens.expiresAt, new Date()))).limit(1);
      if (!reset) throw new TRPCError({ code: "BAD_REQUEST", message: "This password reset link is invalid or has expired." });
      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
      await db.update(users).set({ passwordHash, emailVerified: true }).where(eq(users.id, reset.userId));
      await db.update(passwordResetTokens).set({ used: true }).where(eq(passwordResetTokens.id, reset.id));
      return { success: true } as const;
    }),
});
