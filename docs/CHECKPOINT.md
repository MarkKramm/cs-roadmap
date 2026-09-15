# Checkpoint

A snapshot of the repository's current state. Update this when a meaningful milestone is reached.

## Current state — 2026-09-15

| Item | Value |
|---|---|
| Branch | `main` |
| Tracked files | 102 |
| Working tree | Clean — nothing uncommitted, nothing untracked |
| Unpushed | None. `main` and `origin/main` are both at `b980d11` |
| Line endings | LF everywhere (Windows scripts excepted) |
| Encoding | UTF-8, no BOM |
| Remote | `origin` → https://github.com/MarkKramm/cs-roadmap |
| Visibility | **Public** — `"private": false` via the GitHub API. It was made public for Pages (D-009); the history was audited for secrets before that. This corrects an earlier entry in this file that still said private |
| Deploy | **Live.** `.github/workflows/deploy-pages.yml` publishes `learning-site/dist` to <https://markkramm.github.io/cs-roadmap/>. Latest deployment `9629c89`, status `success`. Builds with `VITE_BASE=/cs-roadmap/` because a project site is served from a subdirectory, and verifies the emitted HTML so an unprefixed build fails rather than deploying a blank page |
| License | CC BY 4.0 |
| Build step | `learning-site/` — React + Vite. `npm run dev` / `npm run build` |
| Checks | `lint-content` 102 files / 0 issues; `audit-content` 0 issues across 23 phases; `audit-lesson-ast` 23 lessons / 0 loss; `audit-readability` 0 of 23 outside target; `test:smoke` 84 renders / 0 failures; production build clean |
| Task IDs | 228 total (IT 66, cyber 162) |
| CI | `.github/workflows/ci.yml` — two jobs on push to `main` and on PRs (D-008). Last verified green: `9629c89` |
| Milestone | M3 complete — the site renders the lessons themselves, not just the structured sections |
| Content depth | **Both tracks complete and uniformly deep.** All 23 phases carry `## Lesson` sections, and **all 23 are inside every readability target**. Cyber runs 7,563–12,177 lesson words across 14 phases; IT runs 5,567–23,657 across 9 |
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

All of the following were re-verified against a **from-scratch rebuild** — `generated/` and `dist/` deleted, then `npm run build` — so they describe what a fresh session reproduces, not a stale working tree.

- [x] All content files recovered byte-for-byte from Git objects.
- [x] No literal `?` substitutes remain except three genuine question marks.
- [x] All files valid UTF-8; no CR bytes; no BOM; no mojibake in any edited file (verified at byte level, since a PowerShell console misrenders correct UTF-8).
- [x] `.gitattributes` and `.editorconfig` in place.
- [x] Remote configured. **`main` and `origin/main` are both at `b980d11`; nothing is unpushed.**
- [x] `lint-content.mjs` — 102 files, 0 issues.
- [x] `audit-content.mjs` — 0 issues across 23 phases.
- [x] `audit-lesson-ast.mjs` — all 23 lessons parse with no content loss.
- [x] `audit-readability.mjs` — 0 of 23 phases outside target (avg para ≤ 45, avg sentence ≤ 18, ≥ 8 tables).
- [x] `cyber-restructure-check.mjs` — no phase lost content; 132,563 lesson words.
- [x] `build-content.mjs` — 228 phase task IDs (IT 66, cyber 162), 23 lesson files.
- [x] `npm run test:smoke` — 84 renders across 23 phases and 191 tools, 0 failures.
- [x] `npm run build` — clean; initial bundle 355 KB with 23 on-demand lesson chunks.
- [x] 256 checklist IDs, all globally unique.
- [x] CI and the Pages deploy are **green on `9629c89`**, verified through the GitHub API: `CI` and `Deploy to GitHub Pages` both report `completed / success`, and deployments exist for `e2fbae5`, `b980d11` and `9629c89`. The site is live at <https://markkramm.github.io/cs-roadmap/>.

## Resuming

Read this first.

1. **Nothing is outstanding on CI or deploy.** Both are green on `9629c89` and the site is live. See the table above.
2. **Rebuild before running the site.** `learning-site/src/data/generated/` is gitignored, so a fresh clone has no lesson JSON until `npm run build:content` (or `npm run dev` / `npm run build`, which both call it) has run.
3. **Run the guards after touching the parser.** `node scripts/audit-lesson-ast.mjs` is the one that matters; see [`WORKFLOW.md`](WORKFLOW.md) → "Guards on the lesson renderer".
4. **Beware inline `node -e` on Windows.** Backticks inside a PowerShell double-quoted string are mangled, which silently corrupts escape-sensitive regexes. Write a throwaway `.mjs` file instead — this cost two wrong measurements in one session.
5. **Beware PowerShell redirection when capturing a file for comparison.** `git show HEAD:file > out.md` writes **UTF-16LE** in Windows PowerShell 5.1, so a naive before/after word count reports a huge phantom loss. Use `git diff --word-diff` or `git show ... | Out-File -Encoding utf8`, and confirm the captured file has no BOM before trusting a number. This produced a false "3,131 words lost" during the paragraph pass.

## Open items

- [ ] **Split the remaining dense paragraphs.** `audit-readability.mjs` now computes per-paragraph density and **fails on any paragraph over 150 words**. See the entry below for the distribution.
- [ ] **Consider tightening the gate from 150 to 110 words** once the backlog is cleared. 150 is a hard ceiling that fails only on genuine walls of text; 110 would enforce the editorial standard.
- [ ] **Five small follow-ups from the module review** — each closes a gap the review identified but deliberately did not fill. Listed in [`ROADMAP.md`](ROADMAP.md) → "Follow-ups from the module review".

### Closed in this pass

- [x] **Audited modules 09–14.** Structurally sound, no restructuring needed, but **five real technical errors** found and fixed that no automated check could catch: a reversed auditd privilege claim, a silently-wrong AWS version-id assumption, a `Get-ScheduledTask` `.Date` string-comparison trap, a retired `sigmac` reference, and a misleading Sysmon filename. Full detail in [`ROADMAP.md`](ROADMAP.md).
- [x] **Assessed the IT track's later phases. Finding: no depth pass is needed.** Phases 6–9 are 6,457–6,992 words across 8–10 substantial Parts — complete lessons, not stubs — and the depth signature (guided walkthrough or worked case) is already present in Phases 2–5 and 8. Phase 1's 24,723 words is the outlier in the other direction and is not a template. The real IT-track defect is **paragraph density, not depth**.
- [x] **Confirmed the site is deployed.** It was already live — see the Deploy row above. No new hosting was needed.

### Dense paragraphs, current state

- **28 paragraphs over 90 words, all in the IT track**: Phase 1 (11), Phase 3 (6), Phase 5 (5), Phase 4 (4), Phase 6 (2). **The cyber track is clean — 0 over 90.** Split them without cutting a word; the gate exists so this cannot regrow.
- The 193-word paragraph in Phase 1 has been split, which is what turned the hard gate from failing to passing.

## How to verify quickly

From the repository root:

```powershell
git --no-pager log --oneline -n 5
git --no-pager status --short          # expect empty
git --no-pager log origin/main..HEAD --oneline   # expect empty after pushing

node scripts/lint-content.mjs            # content integrity
node scripts/audit-content.mjs           # phase structure across all 23 phases
node scripts/audit-lesson-ast.mjs        # parser loses no lesson content
node scripts/audit-readability.mjs       # prose density targets
node scripts/cyber-restructure-check.mjs # no cyber phase shrank

cd learning-site
npm run build                            # production build
npm run test:smoke                       # render every phase with real data
```

Expected results: lint `102 files, 0 issues`; content audit `0 issues`; lesson AST `all 23 lessons, no content loss`; readability `0 of 23` outside target; preservation `OK`; smoke `84 renders across 23 phases and 191 tools, 0 failures`.