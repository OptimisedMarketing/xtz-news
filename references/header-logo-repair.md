# Header Logo Repair Validation

## Root cause

The header used the direct `/manus-storage/xtz-logo-square_c6689606.png` path. On the custom domain, that storage route can redirect through a signed cross-origin URL, which produced a browser-level image failure even though a command-line request could ultimately resolve successfully.

## Repair

`Header.tsx` now derives both desktop and mobile logo sources from `getMediaUrl()`. The component therefore requests the same-origin `/media/xtz-logo-square_c6689606.png` relay that streams the image bytes reliably.

## Explicit preview evidence

| Viewport | Captured proof | Observed result |
|---|---|---|
| Desktop, 1440 × 900 | `/tmp/xtz-logo-preview.png` | The square blue-and-white **XTZ.news** logo is visible at the top-left of the desktop header. |
| Mobile, 390 × 844 | `/tmp/xtz-logo-mobile-preview.png` | The square blue-and-white **XTZ.news** logo is visible at the top-left, beside the blue Menu control. |

The TypeScript check and full Vitest suite also passed after the change: **36 tests across 7 files**.
