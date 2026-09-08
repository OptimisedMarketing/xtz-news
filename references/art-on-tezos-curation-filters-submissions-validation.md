# Art on Tezos Curation, Filters, and Submission Validation

## Curated profiles

The public project directory contains three new published profiles: **EditArt**, **InfiniteInk**, and **HEK × Tezos Digital Art Programme**. The recorded website URLs and categories were checked directly in the project database. Their descriptions use the source record in [art-on-tezos-curation-sources.md](./art-on-tezos-curation-sources.md); the historical 404_LAND exhibition is not presented as currently open.

## Hub experience

| Area | Validation result |
| --- | --- |
| Curated project cards | Desktop and 390px mobile renders showed all three new profiles with clear collection labels and a visual fallback where no first-party profile image is stored. |
| Filters | The hub presents All art projects, Exhibitions, Marketplaces, and Creator tools. Automated coverage confirms the three selected filter groups return only their assigned entries. |
| Marketplace continuity | Existing Objkt.com, Teia, and fxhash profiles remain assigned to the Marketplaces filter. |
| Submission form | The embedded form requires name, email, submitter type, project group, project name, website, a concise description, and explicit review consent. It says submissions are reviewed and are not published automatically. |
| Submission persistence | The new `art_project_submissions` table records each submission as `pending` by default. The public API validates email, URL, length limits, allowed groups, and explicit consent; editorial listing and status changes are administrator-only. |

## Checks

The complete regression run passed with **121 tests across 47 files**. `pnpm check` passed with no TypeScript errors. Focused tests cover filter groups and outputs, the reviewed submission copy and payload, consent enforcement, and the editor-only queue. A real public submission was not sent during validation, so no test project or contact data was created in the editorial queue.
