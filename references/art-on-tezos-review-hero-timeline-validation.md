# Art on Tezos Review, Hero, and Timeline Validation

## Administrative review workspace

The new `/admin/art-project-submissions` page uses the existing authenticated administrator role on both the client and server. Its queue query and status mutation are administrator-only. The page provides search, status filtering, newest/oldest sorting, per-submission selection, optional internal notes, and individual or bulk reviewed, approved, and rejected actions.

Approving a submission changes only the editorial queue status. It cannot publish a directory profile. Desktop and mobile validation confirmed that the secure review interface is reachable for the signed-in administrator, the empty queue is explicit, and the controls remain readable at 390px.

## Weekly curated hero

The Art on Tezos hero selects one established curated project from a fixed list using the current ISO calendar week. This is a deterministic display calculation, rather than a timer, scheduled task, database write, or external check. The weekly feature automatically progresses through Objkt.com, Teia, fxhash, EditArt, and InfiniteInk when the week changes.

## Interactive exhibition timeline

The hub now includes collapsible timeline cards, timing filters for all dates, upcoming, on now, and past, visible timing status, location context, and outbound links to the source listing. It distinguishes historical events from future and current listings. All event entries are documented in [art-on-tezos-exhibitions-timeline-sources.md](./art-on-tezos-exhibitions-timeline-sources.md).

| Check | Result |
| --- | --- |
| Reader desktop and mobile UI | The hero, project filters, date filters, collapsible event cards, official source paths, and submission module displayed clearly at 1280px and 390px widths. |
| Administrator desktop and mobile UI | The review queue header, search, status and sort controls, bulk actions, and safe empty state displayed at 1280px and 390px widths. |
| Security behaviour | Component and server contract coverage preserve the administrator-only queue; non-administrators receive an access-denied state. |
| Automated regression suite | `pnpm test` passed with **125 tests across 48 files**. |
| Type validation | `pnpm check` passed without TypeScript errors. |
