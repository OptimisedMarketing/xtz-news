/**
 * ArticleContent — renders article HTML with tweet embeds processed.
 *
 * Scans the HTML for <div class="tweet-embed" data-tweet-url="..."></div>
 * and replaces them with the TweetEmbed React component.
 *
 * All other HTML is rendered as-is via dangerouslySetInnerHTML.
 */

import React, { useMemo } from "react";
import TweetEmbed from "./TweetEmbed";
import MidArticleNewsletter from "./MidArticleNewsletter";
import KentoArtistDirectory from "./KentoArtistDirectory";
import { linkArticleGlossaryTerms } from "@/lib/articleGlossary";
import { getMediaUrl } from "@/lib/mediaUrl";

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
  | { type: "newsletter" }
  | { type: "kentoArtists" };

/**
 * Article HTML is stored in the database, so image tags cannot call the React
 * media helper directly. Normalize first-party storage URLs before rendering
 * to retain the site's same-origin relay across legacy and newly added media.
 */
export function normaliseArticleMediaUrls(html: string): string {
  return html.replace(
    /((?:src|poster)\s*=\s*["'])(?:https?:\/\/(?:www\.)?xtz\.news)?\/manus-storage\/([^"']+)(["'])/gi,
    (_match, prefix: string, storageKey: string, suffix: string) => `${prefix}${getMediaUrl(`/manus-storage/${storageKey}`)}${suffix}`,
  );
}

export function parseSegments(html: string): Segment[] {
  const segments: Segment[] = [];
  const EMBED_RE = /<div[^>]+class=["']tweet-embed["'][^>]*data-tweet-url=["']([^"']+)["'][^>]*>[\s\S]*?<\/div>|<div[^>]+data-tweet-url=["']([^"']+)["'][^>]*class=["']tweet-embed["'][^>]*>[\s\S]*?<\/div>|<div[^>]+(?:class=["'][^"']*newsletter-cta[^"']*["']|data-article-newsletter=["'][^"']+["'])[^>]*>\s*<\/div>|<div[^>]+data-kento-artist-directory=["'][^"']+["'][^>]*>\s*<\/div>/gi;

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
    if (/data-kento-artist-directory/i.test(match[0])) {
      segments.push({ type: "kentoArtists" });
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
  const articleHtml = useMemo(() => linkArticleGlossaryTerms(normaliseArticleMediaUrls(html)), [html]);
  const segments = useMemo(() => parseSegments(articleHtml), [articleHtml]);

  // If no tweets found, render as plain HTML (fast path)
  const hasEmbeds = segments.some((s) => s.type === "tweet" || s.type === "newsletter" || s.type === "kentoArtists");
  if (!hasEmbeds) {
    return (
      <div
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: articleHtml }}
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
        if (seg.type === "kentoArtists") {
          return <KentoArtistDirectory key={`kento-artists-${i}`} />;
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
