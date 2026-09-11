# CS Roadmap

A self-study roadmap for a beginner in the Philippines moving from **remote entry-level IT** to **cybersecurity**, built for a **$0 budget** and about **2–4 focused hours/day, 5 days/week**.

The full study material lives in [`career-roadmaps/`](career-roadmaps/).

## What's inside

| Track | Folder | Purpose |
|---|---|---|
| IT (first) | [`career-roadmaps/it-roadmap/`](career-roadmaps/it-roadmap/) | Land a remote entry-level IT job in **3–6 months** |
| Cybersecurity (next) | [`career-roadmaps/cybersec-roadmap/`](career-roadmaps/cybersec-roadmap/) | Move into entry-level cyber in **6–18 months** |
| Shared | [`career-roadmaps/shared/`](career-roadmaps/shared/) | Anti-burnout rules, free resources, and a weekly tracker |

Start here: [`career-roadmaps/README.md`](career-roadmaps/README.md) — it explains the strategy, the weekly rhythm, and how to use both tracks together.

## Quick start

1. Read [`career-roadmaps/shared/anti-burnout-rules.md`](career-roadmaps/shared/anti-burnout-rules.md).
2. Skim [`career-roadmaps/it-roadmap/00-overview.md`](career-roadmaps/it-roadmap/00-overview.md).
3. Track progress with [`career-roadmaps/it-roadmap/checklist-master.md`](career-roadmaps/it-roadmap/checklist-master.md).
4. Plan each week with [`career-roadmaps/shared/weekly-tracker-template.md`](career-roadmaps/shared/weekly-tracker-template.md).
5. Only after IT Phase 2, open [`career-roadmaps/cybersec-roadmap/00-overview.md`](career-roadmaps/cybersec-roadmap/00-overview.md).

## Repository layout

```text
.
├── .editorconfig          # Save-time: UTF-8, LF, indent rules
├── .gitattributes         # LF normalization policy (see below)
├── .gitignore
├── README.md              # this file
├── AGENTS.md              # Guidance for contributors and agents
├── CHANGELOG.md           # Notable changes
├── CONTRIBUTING.md        # Human entry point into the repo
├── LICENSE                # CC BY 4.0
├── .github/workflows/     # CI — lint, build, smoke test (see below)
├── docs/                  # Meta-documentation about the project
├── scripts/               # Content tooling — build and lint the Markdown
├── learning-site/         # React + Vite site that renders the curriculum
└── career-roadmaps/
    ├── README.md          # main strategy document
    ├── it-roadmap/        # 00-overview + 9 phases + checklists
    ├── cybersec-roadmap/  # 00-overview + 8 phases + checklists
    └── shared/            # anti-burnout rules, resources, weekly tracker
```

## Conventions

- **Line endings:** all text files are normalized to **LF** via [`.gitattributes`](.gitattributes) (`* text=auto eol=lf`). Windows-native scripts (`.bat`, `.cmd`, `.ps1`) stay CRLF; binary assets are declared `binary`.
- **Encoding:** all files are **UTF-8 without BOM**, using real typographic characters (`—` em-dash, `–` en-dash, `“ ”` curly quotes) instead of ASCII substitutes.
- **Format:** the curriculum is plain Markdown and text. The learning site under [`learning-site/`](learning-site/) is React + Vite and has its own dependencies — see [`learning-site/README.md`](learning-site/README.md).

## Status

Curriculum content complete. Learning Site M2 complete (dashboard, tools library, portfolio tracker, application tracker). CI runs the content linter, the production build, and the render smoke test on every push and pull request — verified green.

Deploying the site is the one open item; see [`docs/ROADMAP.md`](docs/ROADMAP.md).