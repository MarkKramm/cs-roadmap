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
| Strategy | `career-roadmaps/README.md` | Explains the three-goal plan and how to use all three tracks |
| IT | `career-roadmaps/it-roadmap/` | First goal — remote entry-level IT in 3–6 months |
| Cybersecurity | `career-roadmaps/cybersec-roadmap/` | Second goal — entry-level cyber in 6–18 months |
| Mid-Level Cyber | `career-roadmaps/advance-roadmap/` | Third goal — the years after your first security role, once the entry-level job is held |
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

`.github/workflows/ci.yml` runs on every push to `main` and every pull request. It has three jobs: **Content integrity** runs the Node-based content lint, structural, readability, cross-reference, time-budget, quiz, encoding, claim, exam and documentation checks, together with their control suites, from the repository root without installing dependencies. **Learning site** uses Node 24, runs `npm ci` and a production build, then runs the 14 site test suites under `learning-site/`. **Browser check (Chromium)** is separate because it installs/builds the site and runs the real-browser layout and interaction suite in Chromium. The Exams view distinguishes curriculum diagnostics from unofficial certification-practice papers; the workflow file remains the source of truth for CI details. The workflow file is the source of truth for the exact checks and their order. CI is check-only; deployment is separate (see [`ROADMAP.md`](ROADMAP.md)).

The browser job starts a preview server, runs `test:browser` against a real engine, and sets `BROWSER_NO_SANDBOX=1` (a container does not grant the capability Chrome's sandbox needs) and `BROWSER_CHECK_STRICT=1` (a missing browser must fail, not skip). `cyber-restructure-check.mjs` is deliberately excluded — its baseline lives outside the repository, so it cannot run on a fresh clone. See [`WORKFLOW.md`](WORKFLOW.md) → "Continuous integration".