import { Link } from "wouter";
import { Home, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ToolBreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Reusable breadcrumb navigation for tool and explorer pages.
 * Automatically includes Home > Tools > ... path.
 * Renders visually and also supports structured data via the parent page's JSON-LD.
 */
export default function ToolBreadcrumb({ items }: ToolBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        marginBottom: "1rem",
        fontSize: "0.75rem",
        fontWeight: 600,
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        aria-label="Home"
        style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}
      >
        <Home size={12} />
      </Link>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
          {item.href ? (
            <Link
              href={item.href}
              style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
