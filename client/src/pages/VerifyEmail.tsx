import { useEffect, useMemo } from "react";
import { Link, useSearch } from "wouter";
import ReaderAuthShell from "@/components/ReaderAuthShell";
import { trpc } from "@/lib/trpc";
import { footerStyle, linkStyle } from "./Login";

export default function VerifyEmail() {
  const search = useSearch();
  const token = useMemo(() => new URLSearchParams(search).get("token") || "", [search]);
  const verify = trpc.customAuth.verifyEmail.useMutation();
  useEffect(() => { if (token && !verify.isPending && !verify.isSuccess) verify.mutate({ token }); }, [token, verify]);
  const title = !token ? "Invalid verification link" : verify.isSuccess ? "Email verified" : verify.isError ? "Unable to verify email" : "Verifying your email";
  const intro = !token ? "This link is missing its verification token." : verify.isSuccess ? "Your reader account is ready. Sign in to follow Tezos topics." : verify.isError ? verify.error.message : "Please wait while we activate your reader account.";
  return <ReaderAuthShell title={title} intro={intro}><p style={footerStyle}>{verify.isSuccess ? <Link href="/login" style={linkStyle}>Sign in</Link> : <Link href="/register" style={linkStyle}>Create a reader account</Link>}</p></ReaderAuthShell>;
}
