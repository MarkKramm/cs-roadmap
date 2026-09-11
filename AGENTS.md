# AGENTS.md

Guidance for AI agents and contributors working in this repository.

## What this repository is

A **content-only** self-study curriculum. It holds Markdown roadmaps for a beginner moving from remote entry-level IT into cybersecurity. There is **no build step, no dependencies, and no runtime code** — just text files.

## Repository structure

```text
.
├── .editorconfig          # Save-time: UTF-8, LF, indent rules
├── .gitattributes         # Git-time: LF normalization, binary markers
├── .gitignore
├── README.md              # Project landing page
├── AGENTS.md              # This file
├── CHANGELOG.md           # Notable changes
├── docs/                  # Meta-documentation about the project
└── career-roadmaps/       # The actual study content
    ├── README.md          # Strategy document (start here)
    ├── it-roadmap/        # 00-overview + 9 phases + checklists
    ├── cybersec-roadmap/  # 00-overview + 8 phases + checklists
    └── shared/            # Anti-burnout rules, resources, weekly tracker
```

## Hard rules

1. **Line endings are LF.** Enforced by `.gitattributes` (`* text=auto eol=lf`) and `.editorconfig`. Windows-native scripts (`.bat`, `.cmd`, `.ps1`) are the only CRLF exception.
2. **Encoding is UTF-8 without BOM.** Use real typographic characters (`—` em-dash, `–` en-dash, `“ ”` curly quotes, `├──` box drawing) — **never** ASCII substitutes like `?` or `--`.
3. **No build tooling.** Do not add `package.json`, bundlers, or dependencies unless the maintainer explicitly asks.
4. **Preserve the pedagogy.** The content is intentionally beginner-friendly and budget-aware ($0). Do not inflate scope or add paid requirements.

## Making changes

- Prefer small, focused commits with a conventional prefix (`docs:`, `chore:`, `fix:`).
- When adding or renaming a roadmap phase file, keep the numeric prefix (`00-`, `01-`, …) so ordering is stable.
- After editing, confirm the file is still LF and UTF-8 (see [`docs/WORKFLOW.md`](docs/WORKFLOW.md)).

## Where to look first

- Content strategy: [`career-roadmaps/README.md`](career-roadmaps/README.md)
- Project meta-docs: [`docs/`](docs/)
- Current state: [`docs/CHECKPOINT.md`](docs/CHECKPOINT.md)