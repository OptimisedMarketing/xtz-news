# Header Referral Tooltip and Attribution Refinement Validation

**Validated:** 15 September 2026

The decorative `OM` monogram has been removed from the header. The compact logo-row treatment now consists only of non-interactive **Built by** text and the Optimised Marketing external link.

On the homepage, the attribution uses a lower-contrast gray than on internal pages so it recedes into the header background. At 1440px it remains visible beside the logo without competing with the primary navigation. At 390px the attribution remains centered along the logo row with no wrapping, overlap, or intrusion into the menu trigger.

Hovering or keyboard focusing the Optimised Marketing link reveals an accessible referral panel containing the stated **Get 25% websites & Marketing** offer, referral code **XTZ2026**, and a copy action. The panel uses `:focus-within`, so the copy control remains usable after keyboard focus enters it.

The dedicated jsdom test focuses the Optimised Marketing link, confirms the stated offer and code, invokes the copy control, verifies that `XTZ2026` reaches the clipboard API, and confirms the copied state. The full suite passed with **171 tests across 62 files**, and the TypeScript check passed.
