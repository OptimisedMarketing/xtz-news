import React from "react";
import { ExternalLink } from "lucide-react";

type ArticleFeaturedImageCreditProps = {
  credit?: string | null;
  sourceUrl?: string | null;
};

export default function ArticleFeaturedImageCredit({ credit, sourceUrl }: ArticleFeaturedImageCreditProps) {
  if (!credit) return null;

  const content = <>Image: <strong>{credit}</strong></>;

  return (
    <figcaption
      className="mx-auto max-w-[900px] px-4 py-2 text-left text-xs leading-5 text-white/55"
      style={{ background: "#05152e", borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-inherit underline decoration-white/25 underline-offset-4 transition-colors hover:text-white focus-visible:text-white"
        >
          {content}
          <ExternalLink size={12} aria-hidden="true" />
          <span className="sr-only"> — opens official source in a new tab</span>
        </a>
      ) : content}
    </figcaption>
  );
}
