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
- `docs/CONTENT-SCHEMA.md` — planned md→JSON contract for the learning site.
- `docs/DESIGN-SYSTEM.md` — framework-agnostic UI tokens for the learning site.
- `CONTRIBUTING.md` — human entry point into the repo.
- `D-005` in `docs/DECISIONS.md` — scoped build-tooling exception for `learning-site/`.
- `LICENSE` — CC BY 4.0, covering the study curriculum and project documentation.

### Changed
- `AGENTS.md` rule 3 scoped: build tooling permitted only under `learning-site/` and `scripts/`.
- `docs/CHECKPOINT.md` refreshed to the current commit and file counts.
- `docs/ROADMAP.md` updated: new docs recorded as done; Learning Site M1 moved to Next.
- `CHANGELOG.md` compare and release links now point at the real repository URL.

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