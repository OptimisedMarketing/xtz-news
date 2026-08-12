import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function ReaderAuthShell({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main style={{ minHeight: "calc(100vh - 240px)", background: "radial-gradient(circle at 80% -10%, rgba(44,125,247,0.22), transparent 38%), #020914", padding: "4rem 1rem" }}>
      <section style={{ width: "100%", maxWidth: "460px", margin: "0 auto", padding: "1.6rem", borderRadius: "14px", border: "1px solid rgba(97,151,240,0.28)", background: "rgba(5,21,46,0.94)", boxShadow: "0 18px 48px rgba(0,0,0,0.32)" }}>
        <Link href="/" style={{ display: "inline-flex", gap: "0.35rem", alignItems: "center", color: "#9cc2ff", textDecoration: "none", fontSize: "0.75rem", fontWeight: 800 }}><ArrowLeft size={14} /> Back to news</Link>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginTop: "1.35rem" }}>
          <div style={{ width: "38px", height: "38px", flexShrink: 0, borderRadius: "10px", display: "grid", placeItems: "center", color: "#a7c9ff", background: "rgba(44,125,247,0.16)" }}><ShieldCheck size={20} /></div>
          <div>
            <h1 style={{ margin: 0, color: "#fff", fontSize: "1.45rem", letterSpacing: "-0.02em" }}>{title}</h1>
            <p style={{ margin: "0.4rem 0 0", color: "rgba(255,255,255,0.62)", lineHeight: 1.55, fontSize: "0.86rem" }}>{intro}</p>
          </div>
        </div>
        <div style={{ marginTop: "1.45rem" }}>{children}</div>
      </section>
    </main>
  );
}
