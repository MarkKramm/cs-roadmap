# Checkpoint

A snapshot of the repository's current state. Update this when a meaningful milestone is reached.

## Current state — 2026-09-13

| Item | Value |
|---|---|
| Branch | `main` |
| Tracked files | 81 |
| Working tree | Clean — the IT lesson pass, all Phase 1–9 structural repairs, and the doc updates are committed |
| Line endings | LF everywhere (Windows scripts excepted) |
| Encoding | UTF-8, no BOM |
| Remote | `origin` → https://github.com/MarkKramm/cs-roadmap |
| Visibility | Private — not publicly reachable |
| License | CC BY 4.0 |
| Build step | `learning-site/` — React + Vite. `npm run dev` / `npm run build` |
| Checks | `node scripts/lint-content.mjs` passes (81 files, 0 issues); `npm run build` passes; `it.json` total phase task IDs: 129 |
| CI | `.github/workflows/ci.yml` — two jobs on push to `main` and on PRs (D-008); verified green |
| Milestone | M2 complete — tools library, portfolio tracker, application tracker |
| Content depth | **IT lesson pass complete** — all 9 IT phases carry `## Lesson` sections of 3,000+ words (4,430 / 4,337 / 3,370 / 6,137 / 3,039 / 3,126 / 3,343 / 3,214 / 3,757). **Cyber in progress** — Phases 1–2 carry lessons (4,965 / 6,841 words); Phases 3–8 remain syllabus-only |

This file deliberately carries no commit hash or commit count: a checkpoint
cannot contain its own hash, so those numbers drift by one commit on every
edit. For the exact current state, run `git --no-pager log --oneline -n 1`.

## Structure

```text
.
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .github/                 (CI workflow — D-008)
├── README.md
├── AGENTS.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── docs/
├── scripts/                 (content tooling)
├── learning-site/           (React + Vite; 5 pages, 6 components, 4 hooks;
│                             generated/ and dist/ ignored)
└── career-roadmaps/
    ├── README.md
    ├── it-roadmap/          (13 files)
    ├── cybersec-roadmap/    (14 files)
    └── shared/              (3 files)
```

## Health checks

- [x] All content files recovered byte-for-byte from Git objects.
- [x] No literal `?` substitutes remain except three genuine question marks.
- [x] All files valid UTF-8; no CR bytes.
- [x] `.gitattributes` and `.editorconfig` in place.
- [x] Remote configured and `main` pushed.
- [x] `lint-content.mjs` passes — 81 files, 0 issues. (`LICENSE` is scanned; it is extensionless, so it is matched by name. The workflow file is scanned too. 81 is the whole repository: every walked file currently has a checkable extension, and it equals `git ls-files`.)
- [x] `build-content.mjs` passes — 129 phase task IDs, up from 116 before the stranded-task repair.
- [x] Structural integrity verified — 75 element IDs in `it.json` before and after the Phase 1–4 repairs, zero missing, zero extra, zero count changes.
- [x] Structural integrity re-verified for Phases 5–9 — `it.json` diffed against a baseline captured before any edit: identical, 1,585 lines, **zero diffs**. Per-phase task counts unchanged at 7 / 6 / 6 / 7 / 7, checklist counts unchanged at 8 / 7 / 6 / 7 / 8. This proves the document did not move; it cannot prove the document was *correct*, because the baseline was taken from a working tree that already contained the Phase 4 tools regression.
- [x] Structural integrity checked against `HEAD` — JSON built from a `git worktree` at `HEAD` and diffed field-by-field against the working tree: 3 intended differences (the `wmic` → `Get-PhysicalDisk` fix, and the tasks recovered on Phases 3 and 4), 0 unintended. **This is the check that found the two missing tools** — tool rows carry no IDs, so ID-based comparisons miss them. IT tools 56, both tracks 112.
- [x] `HEAD` builds — verified in a scratch worktree at `HEAD`: 2 files written, 129 task IDs, and the output is byte-identical to the working tree's apart from `generatedAt` (1,602 lines each). A fresh clone plus `npm run build:content` reproduces the tree.
- [x] `ToolCard` renders tool data; the M1 crash on opening a phase is fixed.
- [x] `test:smoke` now covers every page as well as every phase — 31 renders.
- [x] Tools library lists all 112 tools with search and cost/track filters.
- [x] Portfolio and application trackers persist under their own `localStorage` keys.
- [x] CI runs the content linter, the production build, and the render smoke test on every push and pull request — verified green on GitHub (2 runs, both jobs passing on `ubuntu-latest`, Node 24).

## Open items

- [ ] Phase 1's legacy `### Hands-On Tasks` block — verbose `#### Task 1–5` walkthroughs inside `## Specific topics to learn`, duplicating the five one-line tasks in `## Hands-on practice tasks`. It feeds nothing into the generated JSON, so it is invisible to the site, but it holds the step-by-step detail the task list lacks. Fold it into the task section rather than deleting it.
- [ ] Content-depth continuation — cyber Phases 1–2 are done (4,965 / 6,841 words) and the format is proven, so Phases 3–8 remain. This is a content-writing job now, not an open scope decision. See [`ROADMAP.md`](ROADMAP.md) and [`SESSION-LOG.md`](SESSION-LOG.md).
- [ ] Deploy the site — blocked on the private-repo visibility decision. GitHub Pages from a private repo generally needs a paid plan, but Netlify, Vercel, and Cloudflare Pages all deploy private repos on free tiers, so this is less blocked than it first appeared.

## How to verify quickly

```powershell
git --no-pager log --oneline -n 5
git --no-pager status --short
git --no-pager ls-files
node scripts/lint-content.mjs          # content integrity
cd learning-site
npm run build                          # production build
npm run test:smoke                     # render every phase with real data
```