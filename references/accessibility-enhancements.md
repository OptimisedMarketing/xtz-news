# Usability and Accessibility Enhancements

## Delivered foundations

The shared layout now presents a keyboard-visible **Skip to main content** link before the ticker and header. It targets a focusable `main#main-content` landmark, allowing keyboard and assistive-technology users to bypass repeated navigation.

The global stylesheet now uses a consistent high-contrast `:focus-visible` treatment, while `prefers-reduced-motion` disables non-essential motion and smooth scrolling. This makes keyboard position clear without showing outlines for ordinary pointer interactions.

The desktop navigation exposes menu state and relationships through `aria-expanded`, `aria-controls`, `aria-haspopup`, and menu roles. The mobile menu now has an explicit open/close label and a named controlled navigation region.

Global search now has a labelled modal dialog, labelled clear/close actions, a named input, and polite live result announcements. Article media was also audited: the featured image already uses editorial alt text with a title fallback, and related article images retain descriptive title alternatives.

Article-level controls now expose a labelled reading-tools region, named open/close states, pressed states for text sizing and reading mode, and polite copy-link feedback. The article now has a programmatic title relationship, labelled article-body and supporting-content regions, a labelled related-articles section, and a featured-image fallback of **“Featured image for [article title]”** when editorial alt text is absent.

## Validation

| Check | Result |
|---|---|
| Skip navigation | Tab exposes the skip link first; Enter moves focus to the main landmark. |
| Keyboard search | `Ctrl/Cmd + K` opens the labelled search dialog; `Escape` closes it. |
| Automated regression coverage | `server/accessibility.test.ts` verifies skip navigation, focus/reduced-motion styles, navigation labels, dialog semantics, and live status markup. |
| TypeScript and tests | `pnpm check` passed; **39 tests across 8 files** passed. |
| Mobile layout | `/tmp/xtz-accessibility-mobile.png` confirms reachable logo, mobile menu, primary search, inline search, and category controls at 390 × 844. |
| Article reader | The Ganesha article rendered normally with the labelled content regions, relayed featured image, and reader controls after the enhancement. |
| Keyboard navigation | In the browser preview, Tab exposed **Skip to main content** as the first keyboard target; Ctrl/Cmd+K opened the named search dialog and Escape closed it. |
| Scroll-to-top | The shared layout keeps a labelled global scroll-to-top control hidden with `visibility: hidden` until the page exceeds 400 pixels of vertical scroll, then exposes it with the visible state class. |
| Scroll-to-top interaction | On desktop, Page Down revealed the labelled button at the page footer and activating it completed the smooth return to the top. On mobile, `/tmp/xtz-mobile-scroll-top-proof.png` shows the visible, 44px-plus arrow control at the footer after scrolling. A mobile CDP test focused the labelled control and sent a browser-native **Enter** sequence; it verified `window.scrollY` returned to `0`, while `/tmp/xtz-mobile-scroll-top-after.png` confirms the post-activation top-of-page state. |

These changes improve usability and accessibility directly. They also make page hierarchy and interactive behaviour easier for quality systems and assistive tools to interpret; they do not constitute a guarantee of a search-ranking change.
