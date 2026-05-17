import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, Moon, Sun, X, ChevronDown, ExternalLink } from "lucide-react";

interface HeaderProps {
  onSearchOpen?: () => void;
}

const NAV_ITEMS = [
  { label: "LATEST NEWS", href: "/category/latest-news" },
  {
    label: "CATEGORIES",
    href: "/categories",
    children: [
      { label: "ADOPTION", href: "/category/adoption" },
      { label: "DEFI", href: "/category/defi" },
      { label: "GOVERNANCE", href: "/category/governance" },
      { label: "NFTS", href: "/category/nfts" },
      { label: "GAMES", href: "/category/games" },
      { label: "EXHIBITION", href: "/category/exhibition" },
      { label: "MUSIC", href: "/category/music" },
      { label: "MORE", href: "/categories" },
    ],
  },
  { label: "TIMELINE", href: "/timeline" },
  { label: "PROJECTS", href: "/projects" },
  { label: "WATCH", href: "/watch" },
  { label: "SUBMIT ARTICLE", href: "/submit-article" },
  { label: "CONTACT", href: "/contact" },
];

export default function Header({ onSearchOpen }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("xtz-dark-mode");
    const isDark = saved === null ? true : saved === "true";
    setDarkMode(isDark);
    document.body.classList.toggle("light-mode", !isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("xtz-dark-mode", String(next));
    document.body.classList.toggle("light-mode", !next);
  };

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* ── Sticky header wrapper ── */}
      <header
        className="sticky top-0 z-50"
        style={{ position: "sticky", top: 0, zIndex: 50 }}
        ref={dropdownRef}
      >
        {/* ── Top bar: XTZ.NEWS + TEZOS TOKEN TRACKER ── */}
        <div
          style={{
            background: "#123262",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            height: "36px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            className="container"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}
          >
            <Link
              href="/"
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
              }}
            >
              XTZ.NEWS
            </Link>
            <a
              href="https://crunchy.network/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.8)",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                textDecoration: "none",
              }}
            >
              <ExternalLink size={10} />
              TEZOS TOKEN TRACKER
            </a>
          </div>
        </div>

        {/* ── Main header row: Logo | Nav | Controls | MENU button ── */}
        <div
          style={{
            background: "#05152e",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <div
            className="container"
            style={{ display: "flex", alignItems: "center", height: "64px", flex: 1 }}
          >
            {/* Logo */}
            <Link href="/" style={{ flexShrink: 0, marginRight: "1.5rem", display: "flex", alignItems: "center" }}>
              <img
                src="/manus-storage/xtz-logo-square_c6689606.png"
                alt="XTZ.News"
                style={{ height: "68px", width: "auto" }}
              />
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden lg:flex"
              style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 0 }}
            >
              {NAV_ITEMS.map((item) => (
                <div key={item.label} style={{ position: "relative" }}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === item.label ? null : item.label)
                        }
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.8)",
                          background: "none",
                          border: "none",
                          padding: "0.5rem 0.7rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.2rem",
                          transition: "color 0.2s",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)")}
                      >
                        {item.label}
                        <ChevronDown
                          size={10}
                          style={{
                            transform: openDropdown === item.label ? "rotate(180deg)" : "none",
                            transition: "transform 0.2s",
                          }}
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            minWidth: "160px",
                            background: "#05152e",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "4px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                            zIndex: 100,
                            padding: "0.25rem 0",
                          }}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              style={{
                                display: "block",
                                padding: "0.5rem 1rem",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.7)",
                                textDecoration: "none",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.color = "#fff";
                                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                                (e.currentTarget as HTMLElement).style.background = "none";
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      style={{
                        display: "block",
                        padding: "0.5rem 0.7rem",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.8)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)")}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right controls: search + dark mode */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
              <button
                onClick={onSearchOpen}
                className="dark-mode-toggle"
                aria-label="Search"
              >
                <Search size={15} />
              </button>
              <button
                onClick={toggleDarkMode}
                className="dark-mode-toggle"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </div>

          {/* ── MENU button — blue square, spans full header height ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              background: "#2c7df7",
              border: "none",
              color: "#fff",
              width: "80px",
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              cursor: "pointer",
              flexShrink: 0,
              fontSize: "0.6rem",
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a6ae0")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c7df7")}
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                <rect width="20" height="2" rx="1" fill="white"/>
                <rect y="6" width="20" height="2" rx="1" fill="white"/>
                <rect y="12" width="20" height="2" rx="1" fill="white"/>
              </svg>
            )}
            MENU
          </button>
        </div>

        {/* ── Mobile/Full Nav Drawer ── */}
        {mobileOpen && (
          <div
            style={{
              background: "#05152e",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <nav className="container" style={{ padding: "0.75rem 0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    style={{
                      display: "block",
                      padding: "0.6rem 0.75rem",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      borderRadius: "3px",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "none")}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div style={{ paddingLeft: "1rem" }}>
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          style={{
                            display: "block",
                            padding: "0.4rem 0.75rem",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.5)",
                            textDecoration: "none",
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
