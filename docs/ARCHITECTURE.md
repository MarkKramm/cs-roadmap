# Architecture

This document describes how the repository is organized and why.

## Design philosophy

The project is deliberately **content-first and build-free**:

- **Markdown is the source of truth.** The curriculum ships as plain Markdown. A newcomer with `git` and a text editor can read and edit all of it without installing anything.
- **Build tooling is quarantined.** The learning site (`learning-site/`) and the content tooling (`scripts/`) are the only places that carry dependencies. Neither is required to read the curriculum.
- **Zero cost.** Every resource referenced is free or free-tier. The repo mirrors that constraint.
- **Portable.** Files render correctly on GitHub, in a local editor, or in any Markdown viewer.

## Content model

Study material lives under `career-roadmaps/` in three tracks:

| Track | Path | Role |
|---|---|---|
| Strategy | `career-roadmaps/README.md` | Explains the two-goal plan and how to use both tracks |
| IT | `career-roadmaps/it-roadmap/` | First goal — remote entry-level IT in 3–6 months |
| Cybersecurity | `career-roadmaps/cybersec-roadmap/` | Second goal — entry-level cyber in 6–18 months |
| Shared | `career-roadmaps/shared/` | Cross-cutting rules, resources, tracker |

### File naming convention

- `00-overview.md` — the track's entry point and timeline.
- `NN-phase-<name>.md` — a numbered phase, ordered by the numeric prefix.
- `checklist-master.md` — flat, trackable checklist for the whole track.
- `TOOLBOX.md`, `FREE-TOOL-MAP.md`, etc. — reference tables.

### Standard phase shape

Each `NN-phase-*.md` file follows a consistent structure:

1. Title + goal
2. Estimated time
3. Skills you'll gain
4. Specific topics to learn
5. Tools for this phase (table: tool, purpose, cost, link, task, free alternative)
6. Free/cheap resources
7. Hands-on practice tasks
8. Deliverable / proof of work
9. Checklist
10. "You're ready to move on when…"
11. Free vs Paid

Keep new phases consistent with this shape.

## Meta-documentation

`docs/` describes the *project itself* (not the study content): architecture, workflow, setup, roadmap, decisions, and session history.

## Cross-cutting invariants

- **Encoding:** UTF-8 without BOM, real typographic characters.
- **Line endings:** LF everywhere except Windows-native scripts.
- **Dependencies are confined:** the content (`career-roadmaps/`, `docs/`) has no dependencies and stays readable with just `git` and a text editor. Build tooling lives only under `learning-site/` and `scripts/` (D-005), and CI lives only under `.github/workflows/` (D-008). The CI carve-out is check-only — no deploy, no secrets — so it never becomes a dependency of reading the content.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and every pull request, as two jobs, split so a content typo fails in seconds without paying for a dependency install. **Content integrity** runs `lint-content`, `audit-content`, `audit-lesson-ast`, `audit-readability` and `audit-refs` at the repository root with no install. **Learning site** runs `npm ci`, `npm run build`, then the eleven site suites — `test:smoke`, `test:search`, `test:highlight`, `test:ui`, `test:data`, `test:notes`, `test:work`, `test:today`, `test:lesson-search` and `test:browser` — under `learning-site/`. Node 24. It is check-only; deployment is a separate concern (see [`ROADMAP.md`](ROADMAP.md)).

`test:browser` is the only step needing a real engine and a process manager: it starts `vite preview`, polls it with `curl` until it answers, runs the check, and kills the server on both paths. It sets `BROWSER_NO_SANDBOX=1` (a container does not grant the capability Chrome's sandbox needs) and `BROWSER_CHECK_STRICT=1` (a missing browser must fail, not skip). `cyber-restructure-check.mjs` is deliberately excluded — its baseline lives outside the repository, so it can only fail on a fresh clone. See [`WORKFLOW.md`](WORKFLOW.md) → "Continuous integration".