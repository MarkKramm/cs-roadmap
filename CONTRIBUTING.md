# Contributing

This repository is a content-only self-study curriculum. Contributions are welcome, but the content has a specific shape and tone worth understanding before you edit.

## Before you change anything

1. Read [`docs/SETUP.md`](docs/SETUP.md) to get the repo running locally.
2. Read [`docs/WORKFLOW.md`](docs/WORKFLOW.md) for the change loop and the line-ending / encoding rules.
3. If you are changing study content, read [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md) first. It describes the phase file structure and the tone rules.

## Project structure

```text
career-roadmaps/    the study material — this is what most changes touch
docs/               meta-documentation about the project itself
```

Full breakdown in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Making a change

1. Edit the relevant file.
2. Confirm it is LF and UTF-8 (`.editorconfig` should handle this automatically).
3. Stage and review: `git add -A` then `git --no-pager diff --cached`.
4. Commit with a conventional prefix:
   - `docs:` — content or documentation
   - `chore:` — tooling, config, housekeeping
   - `fix:` — corrections to broken content or formatting
5. Verify the tree is clean: `git status --short`.

## Common pitfalls

- **Do not paste ASCII substitutes** for typographic characters. `?` for an em-dash, `--` for an en-dash, `???` for a tree branch — all wrong. See [`docs/WORKFLOW.md`](docs/WORKFLOW.md).
- **Do not add paid tools** without a free alternative in the same row of the tools table.
- **Do not add a phase** without a deliverable.

## Where to ask

- Project-level questions: open an issue or reach out to the maintainer.
- Content questions: check [`docs/FAQ.md`](docs/FAQ.md) first — it covers most of the "why" behind the curriculum.
- Recovery help: [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md).