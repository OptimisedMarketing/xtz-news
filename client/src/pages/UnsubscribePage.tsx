import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function UnsubscribePage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const token = params.get("token") || "";

  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");

  const unsubMutation = trpc.newsletter.unsubscribe.useMutation({
    onSuccess: (data) => {
      setEmail(data.email);
      setDone(true);
    },
  });

  useEffect(() => {
    if (token && !done && !unsubMutation.isPending) {
      unsubMutation.mutate({ token });
    }
  }, [token]);

  return (
    <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        {!token ? (
          <>
            <XCircle size={48} style={{ color: "#ef4444", margin: "0 auto 1rem" }} />
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: "0 0 0.5rem" }}>Invalid Link</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>This unsubscribe link is missing a token. Please use the link from your email.</p>
            <Link href="/" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>← Back to XTZ.News</Link>
          </>
        ) : unsubMutation.isPending ? (
          <>
            <Loader size={40} style={{ color: "#2c7df7", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: 0 }}>Unsubscribing…</h1>
          </>
        ) : unsubMutation.isError ? (
          <>
            <XCircle size={48} style={{ color: "#ef4444", margin: "0 auto 1rem" }} />
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: "0 0 0.5rem" }}>Link Expired</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>This unsubscribe link is invalid or has already been used.</p>
            <Link href="/" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>← Back to XTZ.News</Link>
          </>
        ) : (
          <>
            <CheckCircle size={48} style={{ color: "#22c55e", margin: "0 auto 1rem" }} />
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: "0 0 0.5rem" }}>Unsubscribed</h1>
            <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "0.5rem" }}>
              <strong style={{ color: "#fff" }}>{email}</strong> has been removed from the XTZ.News newsletter.
            </p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Changed your mind?{" "}
              <Link href={`/manage-subscriptions?token=${token}`} style={{ color: "#2c7df7", textDecoration: "none" }}>
                Re-subscribe or manage preferences
              </Link>
            </p>
            <Link href="/" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>← Back to XTZ.News</Link>
          </>
        )}
      </div>
    </div>
  );
}
