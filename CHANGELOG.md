# Changelog

All notable changes to this repository are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- `docs/` meta-documentation: `ARCHITECTURE.md`, `WORKFLOW.md`, `SETUP.md`, `ROADMAP.md`, `DECISIONS.md`, `CHECKPOINT.md`, `SESSION-LOG.md`.
- `AGENTS.md` (contributor/agent guidance) and this `CHANGELOG.md`.

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

[Unreleased]: https://example.com/compare/0.1.0...HEAD
[0.1.0]: https://example.com/releases/tag/0.1.0