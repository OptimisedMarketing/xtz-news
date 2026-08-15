import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const clientPath = (file: string) => path.resolve(process.cwd(), "client/src", file);

describe("accessibility foundations", () => {
  it("provides a skip link and a focusable main landmark", async () => {
    const layout = await readFile(clientPath("components/Layout.tsx"), "utf8");

    expect(layout).toContain('href="#main-content"');
    expect(layout).toContain('id="main-content"');
    expect(layout).toContain("tabIndex={-1}");
  });

  it("keeps visible focus styling and reduced-motion support in the global stylesheet", async () => {
    const css = await readFile(clientPath("index.css"), "utf8");

    expect(css).toContain(":focus-visible");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain(".skip-link");
    expect(css).toContain(".scroll-top-btn.visible");
    expect(css).toContain("visibility: hidden");
  });

  it("provides a labelled global scroll-to-top control", async () => {
    const layout = await readFile(clientPath("components/Layout.tsx"), "utf8");

    expect(layout).toContain('aria-label="Scroll to top"');
    expect(layout).toContain('className={`scroll-top-btn ${showScrollTop ? "visible" : ""}`}');
    expect(layout).toContain('window.scrollTo({ top: 0, behavior: "smooth" })');
  });

  it("labels navigation menus and search dialog controls for assistive technology", async () => {
    const header = await readFile(clientPath("components/Header.tsx"), "utf8");
    const search = await readFile(clientPath("components/SearchModal.tsx"), "utf8");

    expect(header).toContain('aria-label="Site header"');
    expect(header).toContain('aria-controls="mobile-navigation"');
    expect(header).toContain('role="menu"');
    expect(search).toContain('role="dialog"');
    expect(search).toContain('aria-modal="true"');
    expect(search).toContain('aria-live="polite"');
  });

  it("exposes labelled article controls, non-visual share feedback, and meaningful image fallbacks", async () => {
    const article = await readFile(clientPath("pages/ArticlePage.tsx"), "utf8");

    expect(article).toContain('aria-labelledby="article-title"');
    expect(article).toContain('aria-label="Article reading tools"');
    expect(article).toContain('aria-label="Article body"');
    expect(article).toContain('aria-label="Article supporting content"');
    expect(article).toContain('aria-labelledby="related-articles-title"');
    expect(article).toContain('aria-controls="article-reading-controls"');
    expect(article).toContain('aria-pressed={fontSize === size}');
    expect(article).toContain('aria-live="polite"');
    expect(article).toContain("Featured image for ${post.title}");
  });
});
