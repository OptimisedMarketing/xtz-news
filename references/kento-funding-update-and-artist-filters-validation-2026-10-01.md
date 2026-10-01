# Kento Funding Update and Artist Filter Validation

**Validated:** 1 October 2026

## Updated funding wording

- The published follow-up is now titled **“Kento Season 01 Finishes Funded: 951 Backers Pledge Over $214,000.”**
- Its on-page excerpt, SEO title/description, Key Takeaways and body use the requested **over $214,000** wording rather than the prior exact USD figure.
- The article retains the reported 951-backers figure, first-edition availability caveat and links to Kento’s own updates.

## Project profile update

- `/projects/kento` now carries a visible **“Season 01 funded: 951 backers”** card directly beside its share controls.
- The profile body states that Season 01 closed funded with 951 backers pledging over US$214,000 and links to the new follow-up.
- The old “active crowdfunding campaign” note was removed and replaced with the reported first-edition / later-pre-sale caveat.
- The article and project profile reciprocally link to one another.

## Artist roster filters

- The funding article now contains an inline, keyboard-accessible **Creator Directory** in its Season 01 roster section.
- Readers can search by artist name and use **All artists (40)**, **Verified Objkt (36)** and **Kento profile (4)** filters.
- A direct Objkt profile is marked as verified only where Kento’s public artist page linked to it in the 1 October source check; the remaining artists link to their official Kento artist page rather than to inferred addresses.

## Technical checks

- `pnpm check` completed successfully.
- Full regression suite: **215 tests across 74 files passed**.
- Desktop and 390px mobile visual reviews confirmed the article directory and the updated project-card / profile layout.
- Googlebot output contains canonical metadata and `NewsArticle` structured data for the follow-up; `/news-sitemap.xml` includes its canonical URL.
- Both `/projects/kento` and the funding article returned HTTP 200 locally.
