import { Link } from "wouter";
import { ChevronLeft, Download, Mail, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminSubscribers() {
  const { user } = useAuth();
  const { data: subscribers = [], isLoading } = trpc.newsletter.list.useQuery();

  const exportCSV = () => {
    const rows = [
      ["Email", "Name", "Status", "Subscribed At"],
      ...subscribers.map((s) => [s.email, s.name ?? "", s.status, formatDate(s.createdAt)]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xtz-news-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user || user.role !== "admin") {
    return <div className="container py-16 text-center"><p style={{ color: "rgba(255,255,255,0.5)" }}>Access denied.</p></div>;
  }

  const active = subscribers.filter((s) => s.status === "active").length;

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href="/admin" style={{ color: "rgba(255,255,255,0.4)", display: "flex" }}><ChevronLeft size={20} /></Link>
            <div>
              <h1 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff", margin: 0 }}>Newsletter Subscribers</h1>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>
                {active} active · {subscribers.length} total
              </p>
            </div>
          </div>
          <button
            onClick={exportCSV}
            disabled={subscribers.length === 0}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", background: "#2c7df7", border: "none", borderRadius: "3px", color: "#fff", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em", opacity: subscribers.length === 0 ? 0.5 : 1 }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Total Subscribers", value: subscribers.length, icon: <Users size={20} /> },
            { label: "Active", value: active, icon: <Mail size={20} /> },
            { label: "Unsubscribed", value: subscribers.length - active, icon: <Mail size={20} /> },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: "1.25rem", background: "#05152e", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: "#2c7df7", marginBottom: "0.5rem" }}>{stat.icon}</div>
              <p style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", margin: "0 0 0.25rem" }}>{stat.value}</p>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Subscriber list */}
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "48px", borderRadius: "4px" }} />)}
          </div>
        ) : subscribers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <Mail size={40} style={{ color: "rgba(255,255,255,0.2)", marginBottom: "1rem" }} />
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No subscribers yet. Share the newsletter signup to start collecting emails.</p>
          </div>
        ) : (
          <div style={{ overflow: "hidden", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {["Email", "Name", "Status", "Subscribed"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, i) => (
                  <tr key={sub.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#fff", fontWeight: 500 }}>{sub.email}</td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>{sub.name || "—"}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{
                        fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                        padding: "0.2rem 0.5rem", borderRadius: "2px",
                        background: sub.status === "active" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                        color: sub.status === "active" ? "#4ade80" : "#f87171",
                      }}>
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{formatDate(sub.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
