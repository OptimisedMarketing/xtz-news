import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

// Wrap text to fit within maxWidth characters per line
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Escape XML special chars for SVG
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function generateArticleOgImage(opts: {
  title: string;
  category?: string;
  featuredImageUrl?: string | null;
}): Promise<Buffer> {
  const title = esc(opts.title || "XTZ.News Article");
  const category = esc(opts.category || "TEZOS NEWS");
  const titleLines = wrapText(opts.title || "", 38);
  const titleSvgLines = titleLines.slice(0, 3).map((line, i) =>
    `<text x="80" y="${340 + i * 72}" font-family="Arial, sans-serif" font-size="58" font-weight="bold" fill="white" dominant-baseline="middle">${esc(line)}</text>`
  ).join("\n");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#000814;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#05152e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#000814;stop-opacity:0.95" />
      <stop offset="70%" style="stop-color:#000814;stop-opacity:0.85" />
      <stop offset="100%" style="stop-color:#000814;stop-opacity:0.3" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />

  <!-- Gradient overlay for text readability -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#overlay)" />

  <!-- Left accent bar -->
  <rect x="0" y="0" width="6" height="${HEIGHT}" fill="#2c7df7" />

  <!-- XTZ.News logo text -->
  <text x="80" y="80" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#2c7df7" dominant-baseline="middle">XTZ</text>
  <text x="120" y="80" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" dominant-baseline="middle">.News</text>

  <!-- Category badge -->
  <rect x="78" y="120" width="${Math.min(category.length * 11 + 30, 300)}" height="36" rx="4" fill="rgba(44,125,247,0.2)" />
  <rect x="78" y="120" width="${Math.min(category.length * 11 + 30, 300)}" height="36" rx="4" fill="none" stroke="#2c7df7" stroke-width="1" />
  <text x="93" y="138" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2c7df7" dominant-baseline="middle" letter-spacing="2">${category}</text>

  <!-- Title lines -->
  ${titleSvgLines}

  <!-- Bottom bar -->
  <rect x="0" y="${HEIGHT - 60}" width="${WIDTH}" height="60" fill="rgba(44,125,247,0.08)" />
  <text x="80" y="${HEIGHT - 30}" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.5)" dominant-baseline="middle">xtz.news — The Tezos News Platform</text>

  <!-- Decorative dots -->
  <circle cx="${WIDTH - 120}" cy="120" r="80" fill="rgba(44,125,247,0.06)" />
  <circle cx="${WIDTH - 80}" cy="200" r="120" fill="rgba(44,125,247,0.04)" />
  <circle cx="${WIDTH - 200}" cy="80" r="50" fill="rgba(44,125,247,0.05)" />
</svg>`;

  return sharp(Buffer.from(svg))
    .png({ quality: 90 })
    .toBuffer();
}

export async function generateToolOgImage(opts: {
  name: string;
  description: string;
  icon?: string;
}): Promise<Buffer> {
  const name = esc(opts.name || "XTZ Tool");
  const descLines = wrapText(opts.description || "", 55);
  const descSvgLines = descLines.slice(0, 3).map((line, i) =>
    `<text x="80" y="${380 + i * 44}" font-family="Arial, sans-serif" font-size="30" fill="rgba(255,255,255,0.65)" dominant-baseline="middle">${esc(line)}</text>`
  ).join("\n");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#000814;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0d2a5e;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />

  <!-- Grid pattern -->
  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(44,125,247,0.06)" stroke-width="1"/>
  </pattern>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" />

  <!-- Left accent bar -->
  <rect x="0" y="0" width="6" height="${HEIGHT}" fill="#2c7df7" />

  <!-- XTZ.News logo -->
  <text x="80" y="80" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#2c7df7" dominant-baseline="middle">XTZ</text>
  <text x="120" y="80" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" dominant-baseline="middle">.News Tools</text>

  <!-- Tool icon emoji (large) -->
  <text x="80" y="230" font-size="80" dominant-baseline="middle">${opts.icon || "🛠️"}</text>

  <!-- Tool name -->
  <text x="80" y="320" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" dominant-baseline="middle">${name}</text>

  <!-- Description -->
  ${descSvgLines}

  <!-- Bottom bar -->
  <rect x="0" y="${HEIGHT - 60}" width="${WIDTH}" height="60" fill="rgba(44,125,247,0.1)" />
  <text x="80" y="${HEIGHT - 30}" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.5)" dominant-baseline="middle">Free Tezos Blockchain Tools — xtz.news/tools</text>

  <!-- Decorative circles -->
  <circle cx="${WIDTH - 100}" cy="${HEIGHT / 2}" r="200" fill="rgba(44,125,247,0.04)" />
  <circle cx="${WIDTH - 50}" cy="${HEIGHT / 2}" r="120" fill="rgba(44,125,247,0.06)" />
</svg>`;

  return sharp(Buffer.from(svg))
    .png({ quality: 90 })
    .toBuffer();
}
