import { useMemo, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import ReaderAuthShell from "@/components/ReaderAuthShell";
import { trpc } from "@/lib/trpc";
import { buttonStyle, errorStyle, footerStyle, inputStyle, linkStyle } from "./Login";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const token = useMemo(() => new URLSearchParams(search).get("token") || "", [search]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const reset = trpc.customAuth.resetPassword.useMutation({ onSuccess: () => setLocation("/login"), onError: (err) => setError(err.message) });
  if (!token) return <ReaderAuthShell title="Invalid reset link" intro="This password-reset link is missing its token."><p style={footerStyle}><Link href="/forgot-password" style={linkStyle}>Request a new reset link</Link></p></ReaderAuthShell>;
  return <ReaderAuthShell title="Choose a new password" intro="Use at least 8 characters with uppercase, lowercase and a number."><form onSubmit={(event) => { event.preventDefault(); setError(""); if (password !== confirm) return setError("Passwords do not match."); reset.mutate({ token, password }); }} style={{ display: "grid", gap: "0.85rem" }}><label style={labelStyle}>New password<input autoComplete="new-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} /></label><label style={labelStyle}>Confirm password<input autoComplete="new-password" type="password" required value={confirm} onChange={(event) => setConfirm(event.target.value)} style={inputStyle} /></label>{error && <p role="alert" style={errorStyle}>{error}</p>}<button type="submit" disabled={reset.isPending} style={buttonStyle}>{reset.isPending ? "Saving…" : "Save new password"}</button></form></ReaderAuthShell>;
}

const labelStyle: React.CSSProperties = { display: "grid", gap: "0.35rem", color: "rgba(255,255,255,0.76)", fontSize: "0.78rem", fontWeight: 700 };
