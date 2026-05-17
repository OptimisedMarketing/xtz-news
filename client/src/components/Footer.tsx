import { Link } from "wouter";
import { Twitter, Facebook, Linkedin, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer>
      {/* ── Top footer ── */}
      <div
        className="border-t border-white/10 py-10"
        style={{ background: "var(--footer-top-bg)" }}
      >
        <div className="container">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/manus-storage/logo_324f88b4.svg"
                alt="XTZ.News"
                className="h-12 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>

            {/* Nav links */}
            <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Latest News", href: "/category/latest-news" },
                { label: "Timeline", href: "/timeline" },
                { label: "Contact", href: "/contact" },
                { label: "Advertise", href: "/advertise" },
                { label: "Submit Article", href: "/submit-article" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com/XTZNews"
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
                aria-label="Twitter"
              >
                <Twitter size={14} />
              </a>
              <a
                href="https://www.facebook.com/xtz.news"
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
                aria-label="Facebook"
              >
                <Facebook size={14} />
              </a>
              <a
                href="https://www.linkedin.com/company/xtz-news"
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://t.me/xtznews"
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
                aria-label="Telegram"
              >
                <Send size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom footer ── */}
      <div
        className="py-4 border-t border-white/8"
        style={{ background: "var(--footer-bottom-bg)" }}
      >
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} XTZ.News. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Disclaimer", href: "/disclaimer" },
              { label: "Terms & Conditions", href: "/terms-and-conditions" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
