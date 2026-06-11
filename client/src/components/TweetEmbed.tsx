/**
 * TweetEmbed — renders an embedded tweet in XTZ.News dark theme.
 *
 * Usage in article HTML:
 *   <div class="tweet-embed" data-tweet-url="https://twitter.com/xsfunc/status/123456789"></div>
 *
 * Or directly in JSX:
 *   <TweetEmbed url="https://twitter.com/xsfunc/status/123456789" />
 *
 * The component:
 * 1. Loads the Twitter widget.js script (once, globally)
 * 2. Calls twttr.widgets.createTweet() to render the tweet
 * 3. Wraps it in a styled dark container matching XTZ.News theme
 */

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (
          tweetId: string,
          container: HTMLElement,
          options?: Record<string, string | boolean>
        ) => Promise<HTMLElement | undefined>;
        load: () => void;
      };
      ready: (callback: () => void) => void;
    };
  }
}

// Load Twitter widget script once
let scriptLoaded = false;
let scriptLoading = false;
const callbacks: Array<() => void> = [];

function loadTwitterScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded) { resolve(); return; }
    callbacks.push(resolve);
    if (scriptLoading) return;
    scriptLoading = true;

    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    script.onload = () => {
      scriptLoaded = true;
      callbacks.forEach((cb) => cb());
      callbacks.length = 0;
    };
    document.head.appendChild(script);
  });
}

function extractTweetId(url: string): string | null {
  // Handles: https://twitter.com/user/status/123, https://x.com/user/status/123
  const match = url.match(/(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/);
  return match ? match[1] : null;
}

interface TweetEmbedProps {
  url: string;
}

export default function TweetEmbed({ url }: TweetEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    const tweetId = extractTweetId(url);
    if (!tweetId || !containerRef.current) {
      setStatus("error");
      return;
    }

    const container = containerRef.current;
    container.innerHTML = "";

    loadTwitterScript().then(() => {
      if (!window.twttr) { setStatus("error"); return; }

      window.twttr.widgets.createTweet(tweetId, container, {
        theme: "dark",
        dnt: "true",
        align: "center",
        conversation: "none",
      }).then((el) => {
        if (el) {
          setStatus("loaded");
        } else {
          setStatus("error");
        }
      }).catch(() => setStatus("error"));
    });
  }, [url]);

  return (
    <div
      style={{
        margin: "1.75rem auto",
        maxWidth: "550px",
        borderRadius: "12px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: status === "loaded" ? "0" : "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: status === "loading" ? "120px" : undefined,
        transition: "all 0.3s",
      }}
    >
      {status === "loading" && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#1DA1F2", flexShrink: 0 }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Loading tweet…
        </div>
      )}
      {status === "error" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", textAlign: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#1DA1F2" }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>Could not load tweet.</span>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#2c7df7", fontSize: "0.78rem" }}>
            View on X →
          </a>
        </div>
      )}
      {/* The actual tweet widget renders here */}
      <div ref={containerRef} style={{ width: "100%" }} />
    </div>
  );
}
