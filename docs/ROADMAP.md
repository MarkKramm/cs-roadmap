# Project Roadmap

The roadmap for the **repository itself** (for the study curriculum, see [`../career-roadmaps/`](../career-roadmaps/)).

## Done

- [x] Recover all 29 content files from Git objects after the working tree was emptied.
- [x] Fix encoding corruption (literal `?` where typographic characters belonged).
- [x] Normalize all text to LF via `.gitattributes`.
- [x] Add root `README.md` and `.gitignore`.
- [x] Add `.editorconfig` to enforce UTF-8/LF at save time.
- [x] Add `docs/` meta-documentation, `AGENTS.md`, and `CHANGELOG.md`.
- [x] Add `docs/CONTENT-GUIDE.md`, `docs/FAQ.md`, and `docs/TROUBLESHOOTING.md`.
- [x] Add site-prep specs: `docs/CONTENT-SCHEMA.md` and `docs/DESIGN-SYSTEM.md`.
- [x] Add root `CONTRIBUTING.md`.
- [x] Publish to a Git remote (GitHub) and push `main`.
- [x] Decide on a license — CC BY 4.0.
- [x] Learning Site Milestone M1 — scaffold `learning-site/`, build the content pipeline, add the app shell and dashboard.
- [x] Content linter — `scripts/lint-content.mjs` checks CRLF, BOM, U+FFFD, invalid UTF-8, and stray `?` substitutes.

## In progress

- [ ] Learning Site Milestone M2 — scoped at kickoff: view navigation (D-007), tools library, portfolio tracker, application tracker. Five commits; the render smoke test is extended in the same commit as each new page.

## Later / optional

- [ ] Deploy the site (GitHub Pages or equivalent). Blocked on a visibility decision — Pages from a private repo generally needs a paid plan.

## Explicitly out of scope

- Paid tools or resources that require a budget.
- Anything that adds a runtime dependency to read the content.
- Scope creep that makes the curriculum feel unachievable for a beginner.