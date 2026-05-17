import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, Moon, Sun, Menu, X, ChevronDown, ExternalLink } from "lucide-react";

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
  const [scrolled, setScrolled] = useState(false);
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
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

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
    <header
      className="sticky top-0 z-50"
      style={{ boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.5)" : "none" }}
    >
      {/* ── Top bar: XTZ.NEWS + Token Tracker (matches original exactly) ── */}
      <div
        style={{
          background: "var(--header-top-bg, #123262)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="container flex items-center justify-between h-9">
          <Link
            href="/"
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.8)",
            }}
            className="hover:text-white transition-colors"
          >
            XTZ.NEWS
          </Link>
          <a
            href="https://crunchy.network/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
            className="hover:text-white transition-colors"
          >
            <ExternalLink size={10} />
            TEZOS TOKEN TRACKER
          </a>
        </div>
      </div>

      {/* ── Main header: Logo | Nav | Controls ── */}
      <div
        style={{
          background: "var(--header-mid-bg, #05152e)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
        ref={dropdownRef}
      >
        <div className="container flex items-center gap-4 h-[80px]">
          {/* Logo — the actual XTZ.news square logo image */}
          <Link href="/" className="shrink-0">
            <img
              src="/manus-storage/xtz-logo-square_c6689606.png"
              alt="XTZ.News"
              style={{ height: "72px", width: "auto" }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center flex-1 justify-center">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                      }
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.8)",
                        background: "none",
                        border: "none",
                        padding: "0.5rem 0.75rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                    >
                      {item.label}
                      <ChevronDown
                        size={11}
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
                          background: "var(--header-mid-bg, #05152e)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "4px",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                          zIndex: 50,
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
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.7)",
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
                      padding: "0.5rem 0.75rem",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.8)",
                      transition: "color 0.2s",
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

          {/* Controls */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <button onClick={onSearchOpen} className="dark-mode-toggle" aria-label="Search">
              <Search size={15} />
            </button>
            <button onClick={toggleDarkMode} className="dark-mode-toggle" aria-label="Toggle dark mode">
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden dark-mode-toggle"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <span
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden cursor-pointer select-none"
              style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.8)" }}
            >
              MENU
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div
          style={{ background: "var(--header-mid-bg, #05152e)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
          className="lg:hidden"
        >
          <nav className="container py-3 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}
                  className="block px-3 py-2.5 hover:bg-white/5 rounded transition-colors"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}
                        className="block px-3 py-2 hover:text-white transition-colors"
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
  );
}
