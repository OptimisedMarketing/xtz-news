import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import ReaderAuthShell from "@/components/ReaderAuthShell";
import { trpc } from "@/lib/trpc";
import { getSafeReturnTo } from "@/lib/readerAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const returnTo = getSafeReturnTo(new URLSearchParams(search).get("returnTo"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const utils = trpc.useUtils();
  const login = trpc.customAuth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      setLocation(returnTo);
    },
    onError: (err) => setError(err.message),
  });

  return <ReaderAuthShell title="Sign in to XTZ.News" intro="Keep the Tezos categories you follow and make your For You feed your own.">
    <form onSubmit={(event) => { event.preventDefault(); setError(""); login.mutate({ email, password }); }} style={{ display: "grid", gap: "0.85rem" }}>
      <label style={{ display: "grid", gap: "0.35rem", color: "rgba(255,255,255,0.76)", fontSize: "0.78rem", fontWeight: 700 }}>Email<input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} /></label>
      <label style={{ display: "grid", gap: "0.35rem", color: "rgba(255,255,255,0.76)", fontSize: "0.78rem", fontWeight: 700 }}>Password<input autoComplete="current-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} /></label>
      {error && <p role="alert" style={errorStyle}>{error}</p>}
      <button type="submit" disabled={login.isPending} style={buttonStyle}>{login.isPending ? "Signing in…" : "Sign in"}</button>
    </form>
    <p style={footerStyle}><Link href="/forgot-password" style={linkStyle}>Forgot password?</Link><span>·</span><Link href={`/register?returnTo=${encodeURIComponent(returnTo)}`} style={linkStyle}>Create account</Link></p>
  </ReaderAuthShell>;
}

export const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "0.72rem 0.78rem", background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: "7px", color: "#fff", outline: "none" };
export const buttonStyle: React.CSSProperties = { padding: "0.78rem 1rem", border: "none", borderRadius: "7px", background: "#2c7df7", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: "0.86rem" };
export const errorStyle: React.CSSProperties = { margin: 0, padding: "0.62rem 0.72rem", borderRadius: "6px", border: "1px solid rgba(248,113,113,0.5)", background: "rgba(127,29,29,0.22)", color: "#fecaca", fontSize: "0.78rem", lineHeight: 1.45 };
export const footerStyle: React.CSSProperties = { display: "flex", justifyContent: "center", gap: "0.5rem", margin: "1rem 0 0", color: "rgba(255,255,255,0.45)", fontSize: "0.77rem" };
export const linkStyle: React.CSSProperties = { color: "#9cc2ff", fontWeight: 700, textDecoration: "none" };
