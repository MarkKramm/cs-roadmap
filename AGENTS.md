# AGENTS.md

Guidance for AI agents and contributors working in this repository.

## What this repository is

A self-study curriculum for a beginner moving from remote entry-level IT into cybersecurity, plus a small personal learning site that renders it.

The curriculum itself is content-only. `career-roadmaps/` and `docs/` are plain Markdown, readable with nothing but `git` and a text editor, and they stay dependency-free. The site under `learning-site/` is a React + Vite application — build tooling is confined there and in `scripts/`, per rule 3 below.

## Repository structure

```text
.
├── .editorconfig          # Save-time: UTF-8, LF, indent rules
├── .gitattributes         # Git-time: LF normalization, binary markers
├── .gitignore
├── README.md              # Project landing page
├── AGENTS.md              # This file
├── CHANGELOG.md           # Notable changes
├── CONTRIBUTING.md        # Human entry point into the repo
├── LICENSE                # CC BY 4.0
├── docs/                  # Meta-documentation about the project
├── scripts/               # Content tooling — build and lint the Markdown
├── learning-site/         # React + Vite site that renders the curriculum
└── career-roadmaps/       # The actual study content
    ├── README.md          # Strategy document (start here)
    ├── it-roadmap/        # 00-overview + 9 phases + checklists
    ├── cybersec-roadmap/  # 00-overview + 14 phases + checklists
    └── shared/            # Anti-burnout rules, resources, weekly tracker
```

## Hard rules

1. **Line endings are LF.** Enforced by `.gitattributes` (`* text=auto eol=lf`) and `.editorconfig`. Windows-native scripts (`.bat`, `.cmd`, `.ps1`) are the only CRLF exception.
2. **Encoding is UTF-8 without BOM.** Use real typographic characters (`—` em-dash, `–` en-dash, `“ ”` curly quotes, `├──` box drawing) — **never** ASCII substitutes like `?` or `--`.
3. **No build tooling outside `learning-site/`.** The study content and docs must stay dependency-free. Build tooling is permitted only under `learning-site/` and `scripts/` — see [`docs/DECISIONS.md`](docs/DECISIONS.md) → D-005. Continuous integration and deployment under `.github/workflows/` are the two other carve-outs, and both are bounded: CI only checks (D-008), and the deploy workflow only publishes the built site to GitHub Pages (D-009).
4. **Preserve the pedagogy.** The content is intentionally beginner-friendly and budget-aware ($0). Do not inflate scope or add paid requirements.

## Making changes

- Prefer small, focused commits with a conventional prefix (`docs:`, `chore:`, `fix:`).
- When adding or renaming a roadmap phase file, keep the numeric prefix (`00-`, `01-`, …) so ordering is stable.
- After editing, confirm the file is still LF and UTF-8 (see [`docs/WORKFLOW.md`](docs/WORKFLOW.md)).

## Where to look first

- Content strategy: [`career-roadmaps/README.md`](career-roadmaps/README.md)
- Project meta-docs: [`docs/`](docs/)
- Current state: [`docs/CHECKPOINT.md`](docs/CHECKPOINT.md)