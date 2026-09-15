# Referral Copy Usability and Aggregate Analytics Validation

**Validated:** 15 September 2026

## Interaction reliability

The referral tooltip now begins directly below the Optimised Marketing trigger and includes an invisible pointer bridge, removing the previous dead zone between the linked label and copy control. The copy action is reachable with pointer movement and remains available through keyboard focus via the existing `:focus-within` state.

After a successful clipboard write, the control temporarily changes to **Copied!** with a green checkmark and an accessible live announcement. The feedback resets after 1.8 seconds.

## Privacy-preserving engagement measurement

Successful copies record only a daily UTC aggregate counter. The stored data is limited to `day`, `copyCount`, and a database-maintained update timestamp. No visitor identity, user account, IP address, session identifier, browser details, tracking cookie, or third-party script is used. Each rendered header records at most one successful copy action.

Administrators can view all-time and trailing-30-day copy totals in **Admin → First-party promotion**. Initial table verification returned no development records, confirming that the test and preview process did not create production engagement events.

## Automated validation

The dedicated header interaction regression test confirms the stated offer, `XTZ2026` code, clipboard invocation, **Copied!** feedback, and aggregate tracking mutation. Server contract coverage confirms public copy recording and administrator-only summary access. The full suite passed with **173 tests across 62 files**, and the TypeScript check passed.
