import { Link } from "wouter";
import { Tag } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = trpc.categories.withImages.useQuery();
  const active = categories.filter((c) => (c.postCount ?? 0) > 0);

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "3rem 0 2.5rem" }}>
        <div className="container">
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.02em", margin: 0 }}>
            ALL CATEGORIES
          </h1>
          {!isLoading && (
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>
              {active.length} categories
            </p>
          )}
        </div>
      </div>

      {/* Category cards grid */}
      <div className="container" style={{ padding: "2.5rem 1.25rem" }}>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "180px", borderRadius: "4px" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {active.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <article
                  style={{
                    position: "relative",
                    height: "180px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Background image from most recent post */}
                  {(cat as any).coverImage ? (
                    <img
                      src={(cat as any).coverImage}
                      alt={cat.name}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #05152e 0%, #123262 100%)" }} />
                  )}

                  {/* Dark gradient overlay */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)",
                  }} />

                  {/* Category name + count */}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                      <Tag size={10} style={{ color: "#2c7df7", flexShrink: 0 }} />
                      <span style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#2c7df7",
                      }}>
                        {cat.postCount} articles
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: "1rem",
                      fontWeight: 900,
                      color: "#fff",
                      margin: 0,
                      lineHeight: 1.2,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    }}>
                      {cat.name}
                    </h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
