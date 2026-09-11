# Changelog

All notable changes to this repository are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- `docs/` meta-documentation: `ARCHITECTURE.md`, `WORKFLOW.md`, `SETUP.md`, `ROADMAP.md`, `DECISIONS.md`, `CHECKPOINT.md`, `SESSION-LOG.md`.
- `AGENTS.md` (contributor/agent guidance) and this `CHANGELOG.md`.
- `docs/CONTENT-GUIDE.md` — authoring standard for phase files.
- `docs/FAQ.md` — design rationale behind the curriculum.
- `docs/TROUBLESHOOTING.md` — recovery playbook for Git and encoding incidents.
- `docs/CONTENT-SCHEMA.md` — the md→JSON contract for the learning site, implemented by `scripts/build-content.mjs`.
- `docs/DESIGN-SYSTEM.md` — UI tokens for the learning site, implemented in `learning-site/src/styles/`.
- `CONTRIBUTING.md` — human entry point into the repo.
- `D-005` in `docs/DECISIONS.md` — scoped build-tooling exception for `learning-site/`.
- `LICENSE` — CC BY 4.0, covering the study curriculum and project documentation.
- `D-006` in `docs/DECISIONS.md` — learning site built with React and Vite.
- `learning-site/` — React + Vite scaffold (Milestone M1, Step 1): app shell, design tokens, base styles, and a local `.gitignore`.
- `scripts/build-content.mjs` — content pipeline (M1 Step 2c) that reads `career-roadmaps/**/*.md` and emits `learning-site/src/data/generated/{it,cyber}.json`. Fails loudly on missing sections, missing task IDs, or paid tools without a free alternative.
- `scripts/add-frontmatter.mjs` — one-time migration helper used in Step 2b.
- `npm run build:content` script, wired to run before `dev` and `build`.
- `learning-site/` app shell (M1 Step 3): sidebar with track switcher and phase list, dashboard with next-task picker, and a phase detail view rendered from the generated JSON.
- `learning-site/` dashboard energy modes (M1 Step 4): low / normal / high selector, persisted in `localStorage`, which filters the recommended next task. `useEnergyMode` hook and `EnergyModeSelector` component.
- Site components: `ProgressBar`, `PhaseCard`, `ChecklistItem`, `ToolCard`, `EnergyModeSelector`.
- `useProgress` hook — progress keyed by stable task IDs and persisted in `localStorage`.
- `src/data/roadmaps.js` — loads the generated JSON and exposes the two tracks.
- `scripts/lint-content.mjs` — text-integrity linter. Flags CRLF, UTF-8 BOM, U+FFFD replacement characters, invalid UTF-8, and ASCII `?` standing in for typographic characters. Read-only; exits non-zero on any issue. Wired as `npm run lint:content`.

### Changed
- `AGENTS.md` rule 3 scoped: build tooling permitted only under `learning-site/` and `scripts/`.
- `docs/CHECKPOINT.md` refreshed to the current commit and file counts.
- `docs/ROADMAP.md` updated: new docs recorded as done; Learning Site M1 moved to Next.
- `CHANGELOG.md` compare and release links now point at the real repository URL.
- `docs/ROADMAP.md` — publish and license items closed; M1 moved to In progress.
- `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/SETUP.md` — corrected the claim that the repository has no build step or dependencies. The curriculum stays dependency-free; the learning site and content tooling do not.
- `docs/CONTENT-SCHEMA.md`, `docs/DESIGN-SYSTEM.md` — marked as implemented and pointed at the code that implements them, replacing the earlier "planned" and "design intent" status lines.
- `docs/CHECKPOINT.md` — refreshed to the current commit, file count, and checks.
- `docs/SESSION-LOG.md` — added the audit/fix session; corrected the oldest entry's "Next", which still described configuring the remote.

### Fixed
- `learning-site/src/components/ToolCard.jsx` contained `PhaseCard`'s implementation verbatim — same body, same `{ phase, done, total, onOpen }` signature — while its only call site passed `{ tool }`. Opening any phase threw a `TypeError` and blanked the view. Both `npm run build` and `npm run dev` passed, because a component whose signature does not match its call site still compiles. Now renders name, purpose, cost badge, mini-task, free alternative, and the official link.
- `learning-site/src/pages/Dashboard.jsx` pointed at "Settings" for resetting progress; no Settings page exists. Now points at the sidebar.
- `docs/DESIGN-SYSTEM.md` listed sidebar links (Tools / Portfolio / Applications / Settings) that do not exist.

## [0.1.0] — 2026-09-11

### Added
- Root `README.md` (project landing page) and `.gitignore`.
- `.editorconfig` to enforce UTF-8 and LF at save time.
- `.gitattributes` with an LF normalization policy, binary markers, and lockfile handling.

### Fixed
- Recovered the working tree from Git objects after it was emptied, restoring all 29 content files byte-for-byte.
- Restored content corrupted by a lossy UTF-8→ASCII conversion: em-dashes (`—`), en-dashes (`–`), curly quotes (`“ ”`), and box-drawing tree characters that had become literal `?`.
- Normalized all text files to LF (removed CRLF churn).

### Changed
- Established the baseline commit for `career-roadmaps/`.

[Unreleased]: https://github.com/MarkKramm/cs-roadmap/compare/0.1.0...HEAD
[0.1.0]: https://github.com/MarkKramm/cs-roadmap/releases/tag/0.1.0