import { useState } from "react";
import { Link } from "wouter";
import ReaderAuthShell from "@/components/ReaderAuthShell";
import { trpc } from "@/lib/trpc";
import { buttonStyle, footerStyle, inputStyle, linkStyle } from "./Login";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const request = trpc.customAuth.requestPasswordReset.useMutation({ onSuccess: () => setSent(true) });
  return <ReaderAuthShell title="Reset your password" intro="Enter your email and, if an eligible reader account exists, we will send a reset link.">
    {sent ? <><p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>If an eligible account exists, an email is on its way.</p><p style={footerStyle}><Link href="/login" style={linkStyle}>Back to sign in</Link></p></> : <form onSubmit={(event) => { event.preventDefault(); request.mutate({ email, origin: window.location.origin }); }} style={{ display: "grid", gap: "0.9rem" }}><label style={{ display: "grid", gap: "0.35rem", color: "rgba(255,255,255,0.76)", fontSize: "0.78rem", fontWeight: 700 }}>Email<input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} /></label><button type="submit" disabled={request.isPending} style={buttonStyle}>{request.isPending ? "Sending…" : "Send reset link"}</button></form>}
  </ReaderAuthShell>;
}
