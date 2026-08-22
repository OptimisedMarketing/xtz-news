/**
 * ArticleContent — renders article HTML with tweet embeds processed.
 *
 * Scans the HTML for <div class="tweet-embed" data-tweet-url="..."></div>
 * and replaces them with the TweetEmbed React component.
 *
 * All other HTML is rendered as-is via dangerouslySetInnerHTML.
 */

import { useMemo } from "react";
import TweetEmbed from "./TweetEmbed";
import MidArticleNewsletter from "./MidArticleNewsletter";

interface ArticleContentProps {
  html: string;
  className?: string;
  style?: React.CSSProperties;
  newsletterPreviewSuccess?: boolean;
}

// Split HTML into segments: either plain HTML strings or tweet URLs
type Segment =
  | { type: "html"; content: string }
  | { type: "tweet"; url: string }
  | { type: "newsletter" };

export function parseSegments(html: string): Segment[] {
  const segments: Segment[] = [];
  const EMBED_RE = /<div[^>]+class=["']tweet-embed["'][^>]*data-tweet-url=["']([^"']+)["'][^>]*>[\s\S]*?<\/div>|<div[^>]+data-tweet-url=["']([^"']+)["'][^>]*class=["']tweet-embed["'][^>]*>[\s\S]*?<\/div>|<div[^>]+(?:class=["'][^"']*newsletter-cta[^"']*["']|data-article-newsletter=["'][^"']+["'])[^>]*>\s*<\/div>/gi;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = EMBED_RE.exec(html)) !== null) {
    // Add HTML before this match
    if (match.index > lastIndex) {
      segments.push({ type: "html", content: html.slice(lastIndex, match.index) });
    }
    if (/newsletter-cta|data-article-newsletter/i.test(match[0])) {
      segments.push({ type: "newsletter" });
      lastIndex = match.index + match[0].length;
      continue;
    }

    // Add tweet segment (first or second capture group)
    const url = match[1] || match[2];
    if (url) {
      segments.push({ type: "tweet", url });
    }
    lastIndex = match.index + match[0].length;
  }

  // Add remaining HTML
  if (lastIndex < html.length) {
    segments.push({ type: "html", content: html.slice(lastIndex) });
  }

  return segments;
}

export default function ArticleContent({ html, className, style, newsletterPreviewSuccess = false }: ArticleContentProps) {
  const segments = useMemo(() => parseSegments(html), [html]);

  // If no tweets found, render as plain HTML (fast path)
  const hasEmbeds = segments.some((s) => s.type === "tweet" || s.type === "newsletter");
  if (!hasEmbeds) {
    return (
      <div
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className={className} style={style}>
      {segments.map((seg, i) => {
        if (seg.type === "tweet") {
          return <TweetEmbed key={`tweet-${i}`} url={seg.url} />;
        }
        if (seg.type === "newsletter") {
          return <MidArticleNewsletter key={`newsletter-${i}`} previewSuccess={newsletterPreviewSuccess} />;
        }
        if (!seg.content.trim()) return null;
        return (
          <div
            key={`html-${i}`}
            dangerouslySetInnerHTML={{ __html: seg.content }}
          />
        );
      })}
    </div>
  );
}
