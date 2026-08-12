import { useState } from "react";
import { Link, useSearch } from "wouter";
import ReaderAuthShell from "@/components/ReaderAuthShell";
import { trpc } from "@/lib/trpc";
import { getSafeReturnTo } from "@/lib/readerAuth";
import { buttonStyle, errorStyle, footerStyle, inputStyle, linkStyle } from "./Login";

const requirements = [
  ["At least 8 characters", (value: string) => value.length >= 8],
  ["One uppercase letter", (value: string) => /[A-Z]/.test(value)],
  ["One lowercase letter", (value: string) => /[a-z]/.test(value)],
  ["One number", (value: string) => /\d/.test(value)],
] as const;

export default function Register() {
  const search = useSearch();
  const returnTo = getSafeReturnTo(new URLSearchParams(search).get("returnTo"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const register = trpc.customAuth.register.useMutation({ onSuccess: () => setSent(true), onError: (err) => setError(err.message) });

  if (sent) return <ReaderAuthShell title="Check your email" intro="We sent a verification link to activate your reader account."><p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6, fontSize: "0.86rem" }}>Once verified, return here to sign in and follow the Tezos topics you care about.</p><p style={footerStyle}><Link href="/login" style={linkStyle}>Go to sign in</Link></p></ReaderAuthShell>;
  return <ReaderAuthShell title="Create your reader account" intro="Follow topics and get a compact Tezos news feed shaped by your choices.">
    <form onSubmit={(event) => { event.preventDefault(); setError(""); if (password !== confirm) return setError("Passwords do not match."); register.mutate({ name, email, password, origin: window.location.origin }); }} style={{ display: "grid", gap: "0.82rem" }}>
      <label style={labelStyle}>Name<input autoComplete="name" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} style={inputStyle} /></label>
      <label style={labelStyle}>Email<input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} /></label>
      <label style={labelStyle}>Password<input autoComplete="new-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} /></label>
      <div style={{ display: "grid", gap: "0.22rem", color: "rgba(255,255,255,0.52)", fontSize: "0.7rem" }}>{requirements.map(([label, test]) => <span key={label} style={{ color: test(password) ? "#5fe4b1" : "rgba(255,255,255,0.44)" }}>{test(password) ? "✓" : "○"} {label}</span>)}</div>
      <label style={labelStyle}>Confirm password<input autoComplete="new-password" type="password" required value={confirm} onChange={(event) => setConfirm(event.target.value)} style={inputStyle} /></label>
      {error && <p role="alert" style={errorStyle}>{error}</p>}
      <button type="submit" disabled={register.isPending} style={buttonStyle}>{register.isPending ? "Creating account…" : "Create account"}</button>
    </form>
    <p style={footerStyle}>Already registered? <Link href={`/login?returnTo=${encodeURIComponent(returnTo)}`} style={linkStyle}>Sign in</Link></p>
  </ReaderAuthShell>;
}

const labelStyle: React.CSSProperties = { display: "grid", gap: "0.35rem", color: "rgba(255,255,255,0.76)", fontSize: "0.78rem", fontWeight: 700 };
