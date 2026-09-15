# Checkpoint

A snapshot of the repository's current state. Update this when a meaningful milestone is reached.

## Current state — 2026-09-15

| Item | Value |
|---|---|
| Branch | `main` |
| Tracked files | 102 |
| Working tree | Clean |
| Line endings | LF everywhere (Windows scripts excepted) |
| Encoding | UTF-8, no BOM |
| Remote | `origin` → https://github.com/MarkKramm/cs-roadmap |
| Visibility | Private — not publicly reachable |
| License | CC BY 4.0 |
| Build step | `learning-site/` — React + Vite. `npm run dev` / `npm run build` |
| Checks | `lint-content` 102 files / 0 issues; `audit-content` 0 issues across 23 phases; `audit-lesson-ast` 23 lessons / 0 loss; `audit-readability` 0 of 23 outside target; `test:smoke` 84 renders / 0 failures; production build clean |
| Task IDs | 228 total (IT 66, cyber 162) |
| CI | `.github/workflows/ci.yml` — two jobs on push to `main` and on PRs (D-008); verified green |
| Deploy | `.github/workflows/deploy-pages.yml` — publishes `learning-site/dist` to GitHub Pages (D-009). Builds with `VITE_BASE=/cs-roadmap/` because a project site is served from a subdirectory, and verifies the emitted HTML so an unprefixed build fails rather than deploying a blank page. Netlify (`netlify.toml`) is configured as a fallback and builds from the repository root, since `build:content` reads `career-roadmaps/` one level above the site |
| Milestone | M3 complete — the site renders the lessons themselves, not just the structured sections |
| Content depth | **Both tracks complete and uniformly deep.** All 23 phases carry `## Lesson` sections. Cyber runs 7,563–12,177 lesson words with all 14 phases inside every readability target; IT runs 5,567–23,657. Every cyber phase sits in the 9,000–9,500 band except Phase 8 (7,563, the job-hunt phase) and the apex modules 13–14 (~12,100, deliberately the deepest) |
| Cyber depth track | Six new modules added as Phases 9–14, because the core path lists cloud, detection, IR, scripting, GRC and web security as target roles but taught none of them: cloud and identity, detection engineering, incident response and DFIR, scripting and automation, GRC and compliance, and web application security. All $0, all with explicit legal-boundary sections |
| Cyber rebalance | Phases 4, 5 and 6 were the thinnest lessons in the track (4,788 / 5,200 / 5,828) and are now level with the rest (9,045 / 9,329 / 9,311). Phase 4 gained a full lab build, a twelve-row troubleshooting table, evidence capture and malware isolation; Phase 5 a weighted decision matrix and the first 90 days of each path; Phase 6 a fourth project, an annotated weak-versus-strong report, and interview follow-ups |
| Lesson rendering | The site parses each lesson into a block AST at build time (`scripts/lesson-ast.mjs`) and renders it with a table of contents and scroll-spy (D-011). Lessons ship as per-phase files loaded on demand, which took the initial bundle from 1.96 MB back to 355 KB (D-012). Two guards protect the path, since a parser bug deletes content rather than crashing: `audit-lesson-ast.mjs` and the lesson assertions in `test:smoke` |
| Site UI | Sidebar is viewport-pinned and scrolls independently; below 860px it becomes an off-canvas drawer with Escape, backdrop-click and scroll locking (D-010). View changes reset scroll to the top. Lesson body has a reading measure, horizontally scrolling tables, and focus-visible states |
| Phase 1 (IT) | Structurally repaired and deepened. Four rendering defects fixed, the legacy task block folded in, and the lesson taken from ~4,400 to ~23,800 words across 13 parts (evidence reading, the local→remote career route, working with real users, and five worked tickets) |
| Phases 2–4 (IT) | Deepened to the Phase 1 standard. Phase 2, 4,337 → 9,709 words. Phase 3, 3,370 → 16,680. Phase 4, 6,137 → 9,482 |
| Phases 5–9 (IT) | Deepened to the same standard, taking the IT lesson prose from roughly 32,800 to roughly 97,300 words. A structural defect was fixed along the way: Phases 6, 7 and 8 each had lesson content stranded after the closing sections |

### Guards fixed in this pass

Five audit scripts matched phase files with `^0[1-9]-`, which covers 01–09 only. Every guard was therefore blind to phases 10 and above — and `audit-lesson-ast.mjs`, written fresh, inherited the same bug and was checking 18 of 23 lessons. All five now match `^(?!00-)\d{2}-`, which includes 10+ while still excluding `00-overview`. The readability script's track summary also hardcoded the original eight cyber phase names, so the six new modules were averaged into the IT track; it now derives the track from the path.

This is worth recording because the failure mode was silence: the guards printed a clean result while covering four fifths of the content.

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
├── learning-site/           (React + Vite; 5 pages, 8 components, 5 hooks;
│                             generated/ and dist/ ignored)
└── career-roadmaps/
    ├── README.md
    ├── it-roadmap/          (12 files)
    ├── cybersec-roadmap/    (19 files)
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