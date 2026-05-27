import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
}

export function useSEO({ title, description, keywords, canonical, ogType = "website", ogImage }: SEOProps) {
  useEffect(() => {
    const siteUrl = "https://xtz.news";
    const defaultImage = `${siteUrl}/manus-storage/xtz-logo-square_c6689606.png`;

    document.title = title;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);

    // Open Graph
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:image", ogImage || defaultImage, "property");
    if (canonical) {
      setMeta("og:url", canonical, "property");
      setLink("canonical", canonical);
    }

    // Twitter
    setMeta("twitter:title", title, "name");
    setMeta("twitter:description", description, "name");
    setMeta("twitter:image", ogImage || defaultImage, "name");

    return () => {
      document.title = "XTZ.News — Tezos News";
    };
  }, [title, description, keywords, canonical]);
}
