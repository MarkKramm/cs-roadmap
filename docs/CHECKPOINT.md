# Checkpoint

A snapshot of the repository's current state. Update this when a meaningful milestone is reached.

## Current state — 2026-09-13

| Item | Value |
|---|---|
| Branch | `main` |
| Tracked files | 81 |
| Working tree | Cyber Phases 6–8 lessons, the build-parser fence fix, and the doc updates are uncommitted |
| Line endings | LF everywhere (Windows scripts excepted) |
| Encoding | UTF-8, no BOM |
| Remote | `origin` → https://github.com/MarkKramm/cs-roadmap |
| Visibility | Private — not publicly reachable |
| License | CC BY 4.0 |
| Build step | `learning-site/` — React + Vite. `npm run dev` / `npm run build` |
| Checks | `node scripts/lint-content.mjs` passes (81 files, 0 issues); `npm run build` passes; `it.json` total phase task IDs: 129 |
| CI | `.github/workflows/ci.yml` — two jobs on push to `main` and on PRs (D-008); verified green |
| Milestone | M2 complete — tools library, portfolio tracker, application tracker |
| Content depth | **Both tracks complete.** All 9 IT phases carry `## Lesson` sections (3,039–6,137 words). All 8 cyber phases carry lessons (4,969 / 6,848 / 8,162 / 4,510 / 4,919 / 5,672 / **8,929** / 7,358). Every phase in the repository now has full lesson prose |
| Phase 1 | Structurally repaired and deepened. Four rendering defects fixed, the legacy task block folded in, and the lesson taken from ~4,400 to ~23,400 words across 13 parts (evidence reading, the local→remote career route, working with real users, and five worked tickets). `it.json` verified byte-identical to baseline apart from `generatedAt`; 5 tasks / 7 checklists preserved. Tools 6 → 10, resources 4 → 11, skills 6 → 11 |

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
- [x] Tools library lists all 116 tools with search and cost/track filters.
- [x] Portfolio and application trackers persist under their own `localStorage` keys.
- [x] CI runs the content linter, the production build, and the render smoke test on every push and pull request — verified green on GitHub (2 runs, both jobs passing on `ubuntu-latest`, Node 24).
- [x] **Cyber Phases 6–8 lessons verified as pipeline-invisible** — both `it.json` and `cyber.json` built from the working tree are byte-identical (excluding `generatedAt`) to a baseline built in a `git worktree` at `HEAD`. Phase task/checklist/tool counts unchanged at 6/7/6 for Phase 7 and 7/8/6 for Phase 8.
- [x] **Build parser is fence-aware** — `sections()` and `subsections()` now track fenced code blocks, so a report template inside a ```text fence is no longer read as phase structure. Verified output-preserving against the `HEAD` baseline and verified by negative test: a fenced `## Checklist` injection failed the old parser (exit 1, no output) and is ignored by the new one.
- [x] `npm run test:smoke` — 31 renders across 17 phases and 116 tools, 0 failures. `npm run build` — clean, 47 modules.

## Open items

- [ ] Deploy the site — blocked on the private-repo visibility decision. GitHub Pages from a private repo generally needs a paid plan, but Netlify, Vercel, and Cloudflare Pages all deploy private repos on free tiers, so this is less blocked than it first appeared.
- [ ] Apply the Phase 1 depth standard to other IT phases — S.M.A.R.T./BSOD evidence reading and ticket-lifecycle material exist only in Phase 1 so far.

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