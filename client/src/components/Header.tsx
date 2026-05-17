import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, Moon, Sun, Menu, X, ChevronDown, ExternalLink } from "lucide-react";

interface HeaderProps {
  onSearchOpen?: () => void;
}

const NAV_ITEMS = [
  { label: "Latest News", href: "/category/latest-news" },
  {
    label: "Categories",
    href: "/categories",
    children: [
      { label: "Adoption", href: "/category/adoption" },
      { label: "DeFi", href: "/category/defi" },
      { label: "Governance", href: "/category/governance" },
      { label: "NFTs", href: "/category/nfts" },
      { label: "Games", href: "/category/games" },
      { label: "Exhibition", href: "/category/exhibition" },
      { label: "Music", href: "/category/music" },
      { label: "More", href: "/categories" },
    ],
  },
  { label: "Timeline", href: "/timeline" },
  { label: "Projects", href: "/projects" },
  { label: "Watch", href: "/watch" },
  { label: "Submit Article", href: "/submit-article" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ onSearchOpen }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Persist dark mode preference
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close dropdown on outside click
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
      style={{ boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none" }}
    >
      {/* ── Top bar: XTZ.NEWS brand + Token Tracker ── */}
      <div
        style={{ background: "var(--header-top-bg)" }}
        className="border-b border-white/10"
      >
        <div className="container flex items-center justify-between h-10">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/manus-storage/logo_324f88b4.svg"
              alt="XTZ.News"
              className="h-7 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
          <a
            href="https://crunchy.network/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <ExternalLink size={11} />
            Tezos Token Tracker
          </a>
        </div>
      </div>

      {/* ── Middle bar: Logo + Nav + Controls ── */}
      <div
        style={{ background: "var(--header-mid-bg)" }}
        className="border-b border-white/8"
      >
        <div className="container flex items-center justify-between h-14" ref={dropdownRef}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col leading-none">
              <span
                className="font-black text-xl tracking-tight"
                style={{ color: "var(--xtz-blue)" }}
              >
                XTZ
              </span>
              <span className="font-bold text-xs tracking-widest text-white/80 -mt-0.5">
                .NEWS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                      }
                      className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors rounded"
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div
                        className="absolute top-full left-0 mt-1 min-w-[180px] rounded shadow-2xl border border-white/10 z-50 py-1"
                        style={{ background: "var(--header-mid-bg)" }}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 transition-colors"
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
                    className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors rounded block"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={onSearchOpen}
              className="dark-mode-toggle"
              aria-label="Search"
            >
              <Search size={15} />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="dark-mode-toggle"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden dark-mode-toggle"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            {/* Mobile MENU label */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-xs font-bold uppercase tracking-widest text-white/80"
            >
              MENU
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Navigation ── */}
      {mobileOpen && (
        <div
          className="lg:hidden border-b border-white/10"
          style={{ background: "var(--header-mid-bg)" }}
        >
          <nav className="container py-3 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 rounded transition-colors"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 flex flex-col gap-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors"
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
