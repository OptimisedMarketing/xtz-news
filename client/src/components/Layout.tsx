import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronUp } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import SearchModal from "./SearchModal";
import PriceTicker from "./PriceTicker";
import BreakingNewsBanner from "./BreakingNewsBanner";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Keep global search discoverable from every reader journey without
  // hijacking typing inside a form field or editor.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;

      if (event.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        return;
      }

      const isCommandSearch = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const isSlashSearch = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;
      if (!isTyping && (isCommandSearch || isSlashSearch)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--body-bg)" }}>
      <BreakingNewsBanner />
      <div className="sticky top-0 z-50">
        <PriceTicker />
        <Header onSearchOpen={() => setSearchOpen(true)} />
      </div>

      <main className="flex-1">{children}</main>

      <Footer />

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`scroll-top-btn ${showScrollTop ? "visible" : ""}`}
        aria-label="Scroll to top"
      >
        <ChevronUp size={18} />
      </button>

      {/* Search modal */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
