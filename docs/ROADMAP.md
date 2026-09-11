# Project Roadmap

The roadmap for the **repository itself** (for the study curriculum, see [`../career-roadmaps/`](../career-roadmaps/)).

## Done

- [x] Recover all 29 content files from Git objects after the working tree was emptied.
- [x] Fix encoding corruption (literal `?` where typographic characters belonged).
- [x] Normalize all text to LF via `.gitattributes`.
- [x] Add root `README.md` and `.gitignore`.
- [x] Add `.editorconfig` to enforce UTF-8/LF at save time.
- [x] Add `docs/` meta-documentation, `AGENTS.md`, and `CHANGELOG.md`.

## Next

- [ ] Publish to a Git remote (GitHub) and push `main`.
- [ ] Decide on a license (or keep private).
- [ ] Optionally add `docs/CONTENT-SCHEMA.md` if the phase format needs a formal spec.

## Later / optional

- [ ] Static learning site that renders the roadmaps (only if the maintainer opts in; the repo is intentionally build-free).
- [ ] A script to lint content for stray `?` substitutes and CRLF.

## Explicitly out of scope

- Paid tools or resources that require a budget.
- Anything that adds a runtime dependency to read the content.
- Scope creep that makes the curriculum feel unachievable for a beginner.