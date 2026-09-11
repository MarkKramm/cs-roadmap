# Decisions

A lightweight decision log (ADR-style). Newest first.

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