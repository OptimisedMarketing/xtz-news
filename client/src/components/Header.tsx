import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, X, ChevronDown, ExternalLink, Globe, LogIn, LogOut, UserRound } from "lucide-react";
import { SUPPORTED_LOCALES, LOCALE_FLAGS, LOCALE_NAMES, type SupportedLocale } from "@shared/locales";
import DonateButton from "@/components/DonateButton";
import { useAuth } from "@/_core/hooks/useAuth";
import { getReaderLoginUrl } from "@/lib/readerAuth";
import { getMediaUrl } from "@/lib/mediaUrl";

interface HeaderProps {
  onSearchOpen?: () => void;
}

export const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "LATEST NEWS", href: "/category/latest-news" },
  {
    label: "CATEGORIES",
    href: "/categories",
    children: [
      { label: "GAMES", href: "/category/games" },
      { label: "TOKENIZATION", href: "/category/tokenization" },
      { label: "EXHIBITION", href: "/category/exhibition" },
      { label: "MUSIC", href: "/category/music" },
      { label: "WALLETS", href: "/category/wallets" },
      { label: "STABLECOINS", href: "/category/stablecoins" },
      { label: "ALL CATEGORIES", href: "/categories" },
    ],
  },
  { label: "PROJECTS", href: "/projects" },
  { label: "TIMELINE", href: "/timeline" },
  {
    label: "EXPLORE",
    href: "/explorer",
    children: [
      { label: "EXPLORER", href: "/explorer" },
      { label: "STAKING", href: "/staking" },
      { label: "ART & CULTURE", href: "/art" },
      { label: "ART ON TEZOS HUB", href: "/art-on-tezos" },
      { label: "TEZOS EVENTS", href: "/events" },
      { label: "TOOLS", href: "/tools" },
      { label: "TEZOS WALLET STARTER", href: "/wallets" },
      { label: "TEZOS STAKING STARTER", href: "/staking/start" },
      { label: "TZ5 WALLET GUIDE", href: "/guides/tz5-wallet" },
      { label: "POST-QUANTUM HUB", href: "/post-quantum" },
      { label: "ETHERLINK HUB", href: "/etherlink" },
      { label: "TOKEN PRICES", href: "/prices" },
    ],
  },
  { label: "SUPPORT", href: "/support" },
];

const HEADER_LOGO_URL = getMediaUrl("/manus-storage/xtz-logo-square_c6689606.png");

export const MOBILE_SECTIONS = [
  {
    label: "Read",
    items: [
      { label: "Home", href: "/" },
      { label: "Latest News", href: "/category/latest-news" },
      { label: "Categories", href: "/categories" },
      { label: "Projects", href: "/projects" },
      { label: "Timeline", href: "/timeline" },
    ],
  },
  {
    label: "Explore",
    items: [
      { label: "Explorer", href: "/explorer" },
      { label: "Staking", href: "/staking" },
      { label: "Art & Culture", href: "/art" },
      { label: "Art on Tezos Hub", href: "/art-on-tezos" },
      { label: "Tezos Events", href: "/events" },
      { label: "Tools", href: "/tools" },
      { label: "Tezos Wallet Starter", href: "/wallets" },
      { label: "Tezos Staking Starter", href: "/staking/start" },
      { label: "tz5 Wallet Guide", href: "/guides/tz5-wallet" },
      { label: "Post-quantum Hub", href: "/post-quantum" },
      { label: "Etherlink Hub", href: "/etherlink" },
      { label: "Token Prices", href: "/prices" },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Submit Article", href: "/submit-article" },
      { label: "Support XTZ.News", href: "/support" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const navButtonStyle: React.CSSProperties = {
  fontSize: "0.76rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.82)",
  background: "none",
  border: "none",
  padding: "0.5rem 0.55rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "0.2rem",
  whiteSpace: "nowrap",
};

export default function Header({ onSearchOpen }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const loginHref = getReaderLoginUrl(location.startsWith("/login") || location.startsWith("/register") ? "/" : location);

  useEffect(() => {
    document.body.classList.remove("light-mode");
    localStorage.removeItem("xtz-dark-mode");
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header ref={dropdownRef} aria-label="Site header">
      <div className="hidden lg:flex" style={{ background: "#123262", borderBottom: "1px solid rgba(255,255,255,0.1)", height: "36px", alignItems: "center" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem" }}>
          <DonateButton variant="header" />
          <Link href="/" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>XTZ.NEWS</Link>
          <Link href="/prices" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "0.35rem", textDecoration: "none" }}><ExternalLink size={10} />TEZOS TOKEN TRACKER</Link>
          {!loading && (isAuthenticated ? <button onClick={() => logout()} style={accountButtonStyle}><LogOut size={11} /> Sign out</button> : <Link href={loginHref} style={accountButtonStyle}><LogIn size={11} /> Sign in</Link>)}
          <details style={{ position: "relative" }}>
            <summary style={{ listStyle: "none", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px", padding: "0.2rem 0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", color: "rgba(255,255,255,0.8)", fontSize: "0.65rem", fontWeight: 700 }}><Globe size={10} /> 🇬🇧 EN <ChevronDown size={9} /></summary>
            <div style={{ position: "absolute", right: 0, top: "calc(100% + 0.35rem)", background: "#05152e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", padding: "0.4rem", zIndex: 1000, minWidth: "164px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
              <Link href="/" style={{ display: "block", padding: "0.35rem 0.6rem", textDecoration: "none", fontSize: "0.72rem", color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>🇬🇧 English</Link>
              {SUPPORTED_LOCALES.map((locale: SupportedLocale) => <Link key={locale} href={`/${locale}`} style={{ display: "block", padding: "0.35rem 0.6rem", textDecoration: "none", fontSize: "0.72rem", color: "rgba(255,255,255,0.7)" }}>{LOCALE_FLAGS[locale]} {LOCALE_NAMES[locale]}</Link>)}
            </div>
          </details>
        </div>
      </div>

      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "stretch" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", height: "72px", flex: 1 }}>
          <Link href="/" style={{ flexShrink: 0, marginRight: "1.2rem", display: "flex", alignItems: "center", position: "relative", zIndex: 10 }}>
            <img src={HEADER_LOGO_URL} alt="XTZ.News" style={{ height: "90px", width: "auto", marginTop: "-36px" }} className="hidden lg:block" />
            <img src={HEADER_LOGO_URL} alt="XTZ.News" style={{ height: "56px", width: "auto" }} className="lg:hidden" />
          </Link>

          <nav className="hidden lg:flex" aria-label="Primary navigation" style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            {NAV_ITEMS.map((item) => <div key={item.label} style={{ position: "relative" }}>
              {item.children ? <>
                <button onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)} aria-expanded={openDropdown === item.label} aria-haspopup="menu" aria-controls={`desktop-menu-${item.label.toLowerCase()}`} style={navButtonStyle}>{item.label}<ChevronDown size={10} style={{ transform: openDropdown === item.label ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} /></button>
                {openDropdown === item.label && <div id={`desktop-menu-${item.label.toLowerCase()}`} role="menu" style={{ position: "absolute", top: "100%", left: 0, minWidth: "175px", background: "#05152e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", boxShadow: "0 8px 32px rgba(0,0,0,0.6)", zIndex: 100, padding: "0.3rem 0" }}>
                  {item.children.map((child) => <Link role="menuitem" key={child.label} href={child.href} style={{ display: "block", padding: "0.55rem 0.9rem", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>{child.label}</Link>)}
                </div>}
              </> : <Link href={item.href} style={{ ...navButtonStyle, display: "block", textDecoration: "none" }}>{item.label}</Link>}
            </div>)}
          </nav>

          <div className="hidden lg:flex" style={{ alignItems: "center", marginLeft: "auto" }}>
            <button onClick={onSearchOpen} aria-label="Search XTZ.News" aria-keyshortcuts="Control+K Meta+K /" style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.45rem 0.65rem", color: "rgba(255,255,255,0.72)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: "5px", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700 }}><Search size={16} /><span>Search</span><kbd style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.35)", borderLeft: "1px solid rgba(255,255,255,0.12)", paddingLeft: "0.45rem" }}>⌘K</kbd></button>
          </div>
          <div className="lg:hidden" style={{ marginLeft: "auto" }} />
        </div>

        <button onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close main menu" : "Open main menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="mobile-menu-trigger" style={{ background: "#2c7df7", border: "none", color: "#fff", width: "72px", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.35rem", cursor: "pointer", flexShrink: 0, fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {mobileOpen ? <X size={22} /> : <svg width="24" height="18" viewBox="0 0 24 18" fill="none"><rect width="24" height="3" rx="1.5" fill="white"/><rect y="7.5" width="24" height="3" rx="1.5" fill="white"/><rect y="15" width="24" height="3" rx="1.5" fill="white"/></svg>}
          MENU
        </button>
      </div>

      <div className="lg:hidden" style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "0.5rem 1rem" }}>
        <button onClick={onSearchOpen} aria-label="Search XTZ.News" style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", color: "rgba(255,255,255,0.68)", fontSize: "0.86rem", cursor: "pointer", textAlign: "left" }}><Search size={16} /><span>Search XTZ.News</span></button>
      </div>

      {mobileOpen && <div className="lg:hidden" style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <nav id="mobile-navigation" className="container" aria-label="Mobile navigation" style={{ padding: "0.75rem 0" }}>
          <div style={{ display: "flex", gap: "0.5rem", padding: "0.35rem 0.75rem 0.8rem" }}>
            {!loading && (isAuthenticated ? <button onClick={() => logout()} style={{ ...mobileAccountStyle, flex: 1 }}><UserRound size={14} /> {user?.name || "Signed in"}<span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.55)" }}>Sign out</span></button> : <><Link href={loginHref} style={{ ...mobileAccountStyle, flex: 1 }}><LogIn size={14} /> Sign in</Link><Link href={`/register?returnTo=${encodeURIComponent(location)}`} style={{ ...mobileAccountStyle, flex: 1, background: "#2c7df7", borderColor: "#2c7df7", color: "#fff" }}>Create account</Link></>)}
          </div>
          <div style={{ padding: "0.5rem 0.75rem 0.75rem" }}><DonateButton variant="article" /></div>
          {MOBILE_SECTIONS.map((section) => <section key={section.label} style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ margin: "0 0 0.4rem", color: "#5a9fff", fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.13em" }}>{section.label}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.35rem" }}>{section.items.map((item) => <Link key={item.label} href={item.href} style={{ padding: "0.72rem", borderRadius: "5px", background: "rgba(255,255,255,0.045)", color: "rgba(255,255,255,0.85)", fontSize: "0.74rem", fontWeight: 700, textDecoration: "none" }}>{item.label}</Link>)}</div>
          </section>)}
          <details style={{ margin: "0.8rem 0.75rem", color: "rgba(255,255,255,0.7)" }}><summary style={{ cursor: "pointer", fontSize: "0.72rem", fontWeight: 700 }}>International editions</summary><div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", paddingTop: "0.75rem" }}><Link href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.7rem" }}>🇬🇧 English</Link>{SUPPORTED_LOCALES.map((locale: SupportedLocale) => <Link key={locale} href={`/${locale}`} style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.7rem" }}>{LOCALE_FLAGS[locale]} {LOCALE_NAMES[locale]}</Link>)}</div></details>
        </nav>
      </div>}
      <style>{`
        .mobile-menu-trigger { display: flex; }
        @media (min-width: 1024px) { .mobile-menu-trigger { display: none !important; } }
      `}</style>
    </header>
  );
}

const accountButtonStyle: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a7c9ff", background: "transparent", border: "none", padding: 0, cursor: "pointer", textDecoration: "none" };
const mobileAccountStyle: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.4rem", justifyContent: "center", padding: "0.68rem", borderRadius: "6px", border: "1px solid rgba(44,125,247,0.55)", color: "#a7c9ff", background: "rgba(44,125,247,0.1)", textDecoration: "none", fontSize: "0.72rem", fontWeight: 800, cursor: "pointer" };
