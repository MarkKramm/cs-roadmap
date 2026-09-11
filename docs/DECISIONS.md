# Decisions

A lightweight decision log (ADR-style). Newest first.

## D-007 — View navigation is local state, not a router

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** M2 adds three destinations (tools library, portfolio tracker, application tracker) alongside the dashboard and the per-phase detail view. D-006 left routing open. The site is a single-user local tool: no server, no shareable URLs, no deep links, no analytics. A router would add a dependency and a URL surface to solve problems this tool does not have.
- **Decision:** Keep navigation in `App.jsx` as a single `view` string — `dashboard` | `phase` | `tools` | `portfolio` | `applications` — alongside the existing `trackId` and `openPhaseId`. No router dependency.
- **Consequences:** No new dependency. The browser's back and forward buttons do not move between views; the sidebar and the in-page Back button are the only navigation, which is why both stay visible on every view. If deep links are ever wanted, the switch in `App.jsx` is the single seam to replace — no component below it needs to change.

## D-006 — Learning site is built with React and Vite

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** Milestone M1 (see [`ROADMAP.md`](ROADMAP.md)) needs a UI with real interactive state: per-task checkboxes, progress computation, energy-mode filtering, and a daily-task recommendation. A hand-written DOM layer would grow quickly and slow iteration.
- **Decision:** Build the learning site with React and Vite under `learning-site/`, scoped by D-005. Plain CSS, no component library, no state-management library. Progress persists in `localStorage`. There is no backend, no auth, and no database.
- **Consequences:** `learning-site/` gains `package.json` and a build step. The study content and `docs/` stay dependency-free, so the rest of the repository is unaffected. Framework-specific choices (routing, icon set, animation) remain open.

## D-005 — Scoped build-tooling exception for the future learning site

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** Rule 3 in `AGENTS.md` forbids build tooling repo-wide. A personal learning site (see [`ROADMAP.md`](ROADMAP.md) → Learning Site M1) will need a bundler and a `package.json`.
- **Decision:** Permit build tooling **only** under `learning-site/` (and `scripts/` for content tooling). The rest of the repository stays build-free, so `career-roadmaps/` and `docs/` remain readable with just `git` and a text editor.
- **Consequences:** Rule 3 in `AGENTS.md` is amended with explicit scope. Future contributors know the exception is bounded.

## D-004 — Add `.editorconfig` alongside `.gitattributes`

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** `.gitattributes` normalizes line endings at Git time, but files can still be written with CRLF on disk by the editor, causing repeated churn.
- **Decision:** Add `.editorconfig` so compliant editors save UTF-8/LF by default. Windows-native scripts keep CRLF.
- **Consequences:** Two layers of protection; contributors get correct behavior automatically.

## D-003 — Keep the repository build-free

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** The content is plain Markdown. A static-site generator was considered but would add dependencies and a toolchain.
- **Decision:** Ship content only. No `package.json`, no bundler. A site, if ever built, must be a separate opt-in.
- **Consequences:** Maximum portability and zero setup cost; less flashy presentation.

## D-002 — Standardize on UTF-8 (no BOM) with real typographic characters

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** A lossy UTF-8→ASCII conversion had replaced em-dashes, en-dashes, curly quotes, and box-drawing characters with literal `?`.
- **Decision:** Require UTF-8 without BOM and real typographic characters; document the mapping in [`WORKFLOW.md`](WORKFLOW.md).
- **Consequences:** Content reads correctly everywhere; contributors must avoid ASCII substitutes.

## D-001 — Normalize all text files to LF

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** Mixed CRLF/LF caused whole-file diffs and obscured real changes.
- **Decision:** `* text=auto eol=lf` in `.gitattributes`; CRLF reserved for `.bat`, `.cmd`, and PowerShell scripts.
- **Consequences:** Clean, reviewable diffs.