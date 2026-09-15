# Checkpoint

A snapshot of the repository's current state. Update this when a meaningful milestone is reached.

## Current state — 2026-09-16

| Item | Value |
|---|---|
| Branch | `main` |
| Tracked files | **140** — 131 plus the nine files this pass added: `scripts/shared-content.mjs`, `learning-site/src/lib/today.js`, `learning-site/src/lib/yourWork.js`, `learning-site/src/hooks/useTimeBudget.js`, `learning-site/src/pages/Shared.jsx`, `learning-site/src/pages/YourWork.jsx`, `learning-site/src/components/TimeBudgetSelector.jsx`, `learning-site/scripts/test-work.mjs`, `learning-site/scripts/test-today.mjs` |
| Working tree | **Four files modified, uncommitted**: `.github/workflows/ci.yml` (six suite steps added to the site job — see the "Guards in CI" row), `CHANGELOG.md` and `docs/SESSION-LOG.md` (the same change written up in the same words), and this file. Everything else landed in `3d637e7`, with the `shared.json` contract correction in `CONTENT-SCHEMA.md` in `94fa18c` |
| Unpushed | None — `main` and `origin/main` are level. Run `git --no-pager log --oneline -n 1` for the exact hash, since this file cannot contain its own |
| Line endings | LF everywhere (Windows scripts excepted) |
| Encoding | UTF-8, no BOM |
| Remote | `origin` → https://github.com/MarkKramm/cs-roadmap |
| Visibility | **Public** — `"private": false` via the GitHub API. It was made public for Pages (D-009); the history was audited for secrets before that. This corrects an earlier entry in this file that still said private |
| Deploy | **Live.** `.github/workflows/deploy-pages.yml` publishes `learning-site/dist` to <https://markkramm.github.io/cs-roadmap/>. Builds with `VITE_BASE=/cs-roadmap/` because a project site is served from a subdirectory, and verifies the emitted HTML so an unprefixed build fails rather than deploying a blank page |
| License | CC BY 4.0 |
| Build step | `learning-site/` — React + Vite. `npm run dev` / `npm run build` |
| Curriculum size | **272,959 lesson words** across 23 phases, 464 fenced code blocks, **252 phase task IDs** (IT 90, cyber 162), of which **183 are practice tasks**, every one banded and energy-tagged |
| Hands-on density | **Every phase that can carry practice now does.** Measured as concrete instructions per 1,000 lesson words, IT Phase 4 rose from **0.11 → 2.8** and Phase 6 from 0.17, the two worst in the repository. Nine phases gained work totalling roughly +37,000 words, all additive, after this metric found that four IT and five cyber phases *taught* skills without ever having the reader perform them. The remaining low-density phases — soft skills, specialization choice, certifications, job application — are ones where prose is correct, because you cannot run a terminal command to practise an interview answer |
| Checks | `lint-content` **140** files / 0 issues; `audit-content` 0 issues across 23 phases; `audit-lesson-ast` 23 lessons / 0 loss; `audit-readability` 0 of 23 outside target and **0 paragraphs over 90 words**; `test:highlight` 37; `test:ui` 42; `test:data` **86**; `test:notes` 28; **`test:work` 31**; **`test:today` 77**; `test:lesson-search` 77; `test:search` 41; `test:smoke` **181** renders / 0 failures; production build clean |
| The reader's own writing | **A note per phase and an answer per practice task**, in a `localStorage` key (`cs-roadmap:notes:v1`) — D-019 — and now **readable back** through the new **Your work** view (D-020). It is deliberately unscored: no count, no percentage, nothing on the dashboard, and a smoke assertion forbids an `N of M` pattern from ever appearing in it. Practice tasks carry stable `<phase-id>-tNN` ids, so an answer cannot silently migrate to a different question |
| Shared documents | **The three `career-roadmaps/shared/` documents are reachable from the site for the first time** (D-020) — they never were, because `build-content.mjs` walks for `*-phase-*.md` and they are not phase files. `scripts/shared-content.mjs` emits `generated/shared.json` (**3 documents, 40 blocks, 42 resources, 20 KB**) by reusing the lesson parser through a `headingBase` parameter rather than forking it. `pages/Shared.jsx` renders them as a chip picker and deliberately does **not** reuse `<Lesson>`, which is keyed by phase id throughout |
| Your work | **Every note and every answer, on one page** (D-020) — `pages/YourWork.jsx` over the pure `lib/yourWork.js`, with a link back to the phase that owns each entry. Answers match to tasks **by id, never by position**, and an orphaned answer is **kept** and flagged rather than deleted. It carries **no denominator at all**: `summariseWork()` has no `total`/`percent`/`remaining` field, so the absence is structural rather than a rendering choice. It reads via `readNotes()` rather than `useNotes()`, so it never becomes a second live copy of the storage key |
| Task durations | **All 183 practice tasks carry an authored `band` and `energy`** (D-021), and the dashboard now asks how long the reader has before it suggests one. Bands — quick 23, focused 115, deep 34, ongoing 11. Energy — low 26, normal 128, high 29. **Zero ids are minted from position.** `ongoing` is an exclusion path rather than a length, and `fitsBand` fails closed on it. Every band is an **authored estimate** — nobody has timed a single task — and the UI says so on the page |
| Time budget | A **tenth `localStorage` key**, `cs-roadmap:time-budget:v1` (D-021), owned by `hooks/useTimeBudget.js` and registered in `transfer.js` → `KEYS`, so the backup registry grew **9 → 10**. It defaults to `focused`, because that is where 82% of the tasks actually sit. `ongoing` is deliberately not offered as a budget — that is a property of a task, not an amount of time a person can have |
| Bundle & build output | Initial chunk **429 KB raw / 126 KB gzipped**, unchanged by this pass, with 23 on-demand lesson chunks (**1,997 KB** total). `search.json` **542 KB**; the new `shared.json` adds **20 KB**. **No new dependency** was added for any of the three features |
| Task IDs | 252 total (IT 90, cyber 162) |
| CI | `.github/workflows/ci.yml` — two jobs on push to `main` and on PRs (D-008). Content job: lint, content audit, lesson-parser audit, readability audit. Site job: build, `test:smoke`, `test:search`, `test:highlight`. **`cyber-restructure-check.mjs` is deliberately excluded**: it reads a before-snapshot from `process.env.TEMP`, which is not in the repository, so it can only ever fail on a fresh clone. It is a one-off migration tool for a restructure pass, not a standing guard. CI run **#37 on `94fa18c` is green** (verified through the GitHub API, `completed / success`). **The six steps listed in the next row are uncommitted — they sit on top of that commit — so no CI run has ever executed them**; they are proven locally only, which is a different claim from "CI is green" |
| Guards in CI | **The whole suite is wired into CI, and wired is not the same as observed.** The site job previously ran only smoke, search and highlight, so a regression in the band table, the fitting rule or the addressed rules would have passed CI and been caught only by a local run. `test:ui`, `test:data`, `test:notes`, `test:work`, `test:today` and `test:lesson-search` are now steps in `.github/workflows/ci.yml` — all six are plain node runs with no React and no DOM, so they add seconds and no install. Each was run standalone against the same tree before its step was added. **The workflow change is uncommitted, so no CI run has executed them yet**; until it is pushed, this row describes the file on disk rather than a green result |
| Milestone | M3 complete — the site renders the lessons themselves, not just the structured sections |
| Search | Full-text across all 23 lessons, both tracks (D-013). A build-time inverted index (term → segment id, **no prose**) emitted as `generated/search.json` — **1,128 segments / 11,374 terms / 542 KB, roughly 27% of the lesson bytes** — and **not referenced by `index.html`**, so a reader who never searches pays nothing. Results deep-link across tracks to the matching heading. Three silent-failure bugs were found by testing the index against the engine and are now guarded by `test:search` |
| Content depth | **Both tracks complete and uniformly deep.** All 23 phases carry `## Lesson` sections, and **all 23 are inside every readability target**. Cyber runs 7,563–12,177 lesson words across 14 phases; IT runs 5,567–23,657 across 9 |
| Paragraph density | **Zero paragraphs over 90 words anywhere in the repository.** The readability audit now counts per-paragraph density and fails the build on anything over 150 words; the previous per-phase *average* could not see a single 190-word wall among twenty short paragraphs, which is how 33 of them accumulated in the IT track. All 33 were split at natural seams with every word preserved — proved by `git diff --word-diff`, where inserting a blank line is invisible and four of the five files therefore report 0/0 tokens |
| Cyber depth track | Six new modules added as Phases 9–14, because the core path lists cloud, detection, IR, scripting, GRC and web security as target roles but taught none of them: cloud and identity, detection engineering, incident response and DFIR, scripting and automation, GRC and compliance, and web application security. All $0, all with explicit legal-boundary sections |
| Cyber rebalance | Phases 4, 5 and 6 were the thinnest lessons in the track (4,788 / 5,200 / 5,828) and are now level with the rest (9,045 / 9,329 / 9,311). Phase 4 gained a full lab build, a twelve-row troubleshooting table, evidence capture and malware isolation; Phase 5 a weighted decision matrix and the first 90 days of each path; Phase 6 a fourth project, an annotated weak-versus-strong report, and interview follow-ups |
| Lesson rendering | The site parses each lesson into a block AST at build time (`scripts/lesson-ast.mjs`) and renders it with a table of contents and scroll-spy (D-011). Lessons ship as per-phase files loaded on demand, which took the initial bundle from 1.96 MB back to 394 KB (D-012). Two guards protect the path, since a parser bug deletes content rather than crashing: `audit-lesson-ast.mjs` and the lesson assertions in `test:smoke` |
| Site UI | Sidebar is viewport-pinned and scrolls independently; below 860px it becomes an off-canvas drawer with Escape, backdrop-click and scroll locking (D-010). View changes reset scroll to the top. Lesson body has a reading measure, horizontally scrolling tables, and focus-visible states. **The shell centres and is capped at 1,400px**; the dashboard is two columns above 1,180px with a sticky reference rail — progress ring, plan dates, readiness counts, what comes next — that reflows to cards below the breakpoint rather than hiding anything (D-015). Phase cards tile two-up. |
| Dashboard rail (D-015) | The page that answers "what should I do today" is the one a reader on a 34–112 week curriculum sees most, and it was the least informative: a single column of cards filling the left half of the viewport. It now carries a reference column of the numbers a reader checks rather than acts on. **It is a reference, not a second dashboard** — no charts, no streaks, and its only controls are links to the page that owns each figure. Every count reads "you have N", never "you are missing N". |
| Rail reads, never owns | `readStarts()`, `readPortfolio()` and `readApplications()` are plain reads, deliberately **not** the hooks. Two live copies of one `localStorage` key drift, and the stale one writing back would drop a record the reader just added on the page that owns it. The hooks keep their subscribing behaviour for the pages that mutate. `fmtWeeks` and `fmtDate` moved into `lib/pace.js` so the rail and the Schedule page cannot round one number two ways. |
| Navigation & reading (D-014) | Seven `ROADMAP.md` open items closed in one pass. **Prev/next phase navigation** rendered twice per phase (compact strip + named cards), honest at both track boundaries rather than vanishing. **Per-section done toggles** on every `###`/`####` heading, keyed by heading id and namespaced per phase — a **separate** store from the phase checklist, so neither number lies. **Reading-position bar** measuring the `.lesson` region, not the page, plus a resume prompt that suggests and waits. **Schedule view** comparing work done against calendar elapsed once a start date is set, framed as a readout rather than a verdict. **Keyboard shortcuts** (`/`, `⌘K`, `j`/`k`, `n`/`p`, `g d`, `g s`, `?`) with none bound to a checkbox. **Reading-size control** scaling one custom property on the lesson body. **A second breakpoint at 560px** and a `prefers-reduced-motion` block |
| Phase 1 (IT) | Structurally repaired and deepened. Four rendering defects fixed, the legacy task block folded in, and the lesson taken from ~4,400 to ~23,800 words across 13 parts (evidence reading, the local→remote career route, working with real users, and five worked tickets) |
| Phases 2–4 (IT) | Deepened to the Phase 1 standard. Phase 2, 4,337 → 9,709 words. Phase 3, 3,370 → 16,680. Phase 4, 6,137 → 9,482 |
| Phases 5–9 (IT) | Deepened to the same standard, taking the IT lesson prose from roughly 32,800 to roughly 97,300 words. A structural defect was fixed along the way: Phases 6, 7 and 8 each had lesson content stranded after the closing sections |

### Guards fixed in this pass

Five audit scripts matched phase files with `^0[1-9]-`, which covers 01–09 only. Every guard was therefore blind to phases 10 and above — and `audit-lesson-ast.mjs`, written fresh, inherited the same bug and was checking 18 of 23 lessons. All five now match `^(?!00-)\d{2}-`, which includes 10+ while still excluding `00-overview`. The readability script's track summary also hardcoded the original eight cyber phase names, so the six new modules were averaged into the IT track; it now derives the track from the path.

This is worth recording because the failure mode was silence: the guards printed a clean result while covering four fifths of the content.

### The storage-key guard was rewritten, because the old one could not fail

`learning-site/scripts/test-data.mjs` asserted `KEYS.length === 9` and compared the registry against a fixture **hand-maintained in the same file**. It was therefore comparing the test to itself, and could not detect the failure it existed to prevent: a storage key the site writes but the backup does not know about. It had already broken on **two consecutive key additions (8 → 9 → 10)** while catching nothing — a hardcoded length can only restate what someone already knew.

It now scans `src/` for `cs-roadmap:*:vN` string literals and compares against `KEYS` in **both directions**: every key the site writes must be registered, and every registered key must actually be used. The duplicate, weaker `KEYS.length === 9` assertion in `scripts/test-notes.mjs` was deleted for the same reason. `test:data` is at **86 checks**.

**This is the second time in this project a guard printed nothing and was read as green** — the first was the `^0[1-9]-` pattern that hid phases 10+. It is also the third time a key-count change broke the suite. The pattern is consistent: a check that restates a number someone already believes is not a check, and its failure mode is silence rather than a red result.

### Never rendered in a browser

An honest caveat that belongs at the top of any future session: **the notes UI, the dashboard rail, the print stylesheet, the Shared view, the Your work view and the new time-budget control have never been rendered in a browser.** They are verified structurally, by render smoke tests, and by their unit suites only. The print path has been verified as CSS, not by actually printing a page. `test:smoke` renders to a string and asserts on markup — it cannot see layout, CSS specificity, focus order, or a control that is present but unreachable. Two real responsive defects in the 561–860px band were found by reading the CSS against the markup rather than by any guard, and that remains the only method this project has for that class of bug.

A second caveat of the same kind: **nobody has timed any curriculum task.** Every band and every energy value is an authored estimate, not a measurement, and the UI says so on the page.

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
├── learning-site/           (React + Vite; 9 pages, 18 components, 13 hooks;
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
- [x] Remote configured. **The pass landed in `3d637e7`, and the `shared.json` contract correction in `94fa18c`; nothing is unpushed.**
- [x] `lint-content.mjs` — **140 files, 0 issues**.
- [x] `audit-content.mjs` — 0 issues across 23 phases.
- [x] `audit-lesson-ast.mjs` — all 23 lessons parse with no content loss.
- [x] `audit-readability.mjs` — 0 of 23 phases outside target (avg para ≤ 45, avg sentence ≤ 18, ≥ 8 tables).
- [x] `test:highlight` 37, `test:ui` 42, `test:data` **86**, `test:notes` 28, **`test:work` 31**, **`test:today` 77**, `test:lesson-search` 77, `test:search` 41 — all pass.
- [x] `cyber-restructure-check.mjs` — no phase lost content; 132,563 lesson words.
- [x] `build-content.mjs` — **183 practice tasks banded and 183 carrying energy, 0 still minted from position**; 252 total task IDs (IT 90, cyber 162), 23 lesson files.
- [x] `npm run test:smoke` — **181 renders** across 23 phases and 191 tools, 0 failures.
- [x] `npm run test:ui` — 42 checks across pace arithmetic, phase navigation, shortcut targeting and section-key namespacing.
- [x] `npm run build` — clean; initial bundle 429 KB (126 KB gzipped) with 23 on-demand lesson chunks, **1,997 KB** of lesson JSON, `search.json` **542 KB** and the new `shared.json` **20 KB**. Size unchanged by this pass.
- [x] 252 phase task IDs (IT 90, cyber 162), all globally unique — the build prints `total phase task IDs: 252` itself.
- [x] CI is **green on `94fa18c`** — the newest commit — re-checked through the GitHub API: run **#37** on `main`, `push`, `completed / success`. An earlier run was verified green on `9629c89`, and deployments exist for `e2fbae5`, `b980d11` and `9629c89`. The site is live at <https://markkramm.github.io/cs-roadmap/>. **But a green run describes the workflow file that was committed at that hash, not the one on disk**: `94fa18c` predates the six suite steps, which are still uncommitted, so no CI run has ever executed them — see the CI row and item 1 under Resuming.

## Resuming

Read this first.

1. **Commit and push the CI change, then re-check CI.** `.github/workflows/ci.yml` is modified but uncommitted, and those six steps have never executed in CI. Until they do, "CI is green" describes a workflow file that is not the one on disk. CI is green on `94fa18c` (run #37), but that run used the committed workflow, which does not contain these six steps — so "CI is green" and "these six steps pass" are two different claims and only the first is currently evidenced. The site is live. See the CI row and the "Guards in CI" row above.
2. **Rebuild before running the site.** `learning-site/src/data/generated/` is gitignored, so a fresh clone has no lesson JSON until `npm run build:content` (or `npm run dev` / `npm run build`, which both call it) has run.
3. **Run the guards after touching the parser.** `node scripts/audit-lesson-ast.mjs` is the one that matters; see [`WORKFLOW.md`](WORKFLOW.md) → "Guards on the lesson renderer".
4. **Beware inline `node -e` on Windows.** Backticks inside a PowerShell double-quoted string are mangled, which silently corrupts escape-sensitive regexes. Write a throwaway `.mjs` file instead — this cost two wrong measurements in one session.
5. **Beware PowerShell redirection when capturing a file for comparison.** `git show HEAD:file > out.md` writes **UTF-16LE** in Windows PowerShell 5.1, so a naive before/after word count reports a huge phantom loss. Use `git diff --word-diff` or `git show ... | Out-File -Encoding utf8`, and confirm the captured file has no BOM before trusting a number. This produced a false "3,131 words lost" during the paragraph pass.

## Open items

- [ ] **Split the remaining dense paragraphs.** `audit-readability.mjs` now computes per-paragraph density and **fails on any paragraph over 150 words**. See the entry below for the distribution.
- [ ] **Consider tightening the gate from 150 to 110 words** once the backlog is cleared. 150 is a hard ceiling that fails only on genuine walls of text; 110 would enforce the editorial standard.
- [x] **Migrate practice-task ids from minted to authored — done, and it went further than the id.** `build-content.mjs` no longer mints any id: all 183 practice tasks author `<!-- id: … band: … energy: … -->`, and the build reports `0 still minted from position`. The same comment carries the new duration band and energy value (D-021). A future task line without its comment raises the minted count rather than silently passing, which is the signal to author it. See D-019, D-021.
- [ ] **Exercise the new views in a real browser.** The notes UI, the dashboard rail, the print stylesheet, the Shared view, the Your work view and the time-budget control are verified structurally and by unit suites only — see "Never rendered in a browser" above. The project has no guard that can see layout, CSS or focus order, and both defects it has found in that class were found by reading the CSS by hand.
- [ ] **Five small follow-ups from the module review** — each closes a gap the review identified but deliberately did not fill. Listed in [`ROADMAP.md`](ROADMAP.md) → "Follow-ups from the module review".

### Closed in this pass

- [x] **Surfaced the shared documents, and made the reader's writing readable back** (D-020). `career-roadmaps/shared/` had no path to it from the site at all; a `Shared` view now renders all three documents from a new `shared.json` (3 documents, 40 blocks, 42 resources, 20 KB) built by `scripts/shared-content.mjs`, which reuses the lesson parser via a `headingBase` parameter rather than forking it. A `Your work` view gathers every note and every answer across all 23 phases onto one page, matching answers **by id and never by position**, keeping orphans, and carrying **no denominator** at all — `summariseWork()` has no `total`/`percent`/`remaining` field, so the absence is structural rather than a rendering choice. Guarded by `test:work`, 31 checks.
- [x] **Gave every task a duration, and asked the reader how long they have** (D-021). All 183 practice tasks now carry an authored band and energy value, and the dashboard draws its suggestion from practice tasks rather than the checklist. `ongoing` is an exclusion path, `fitsBand` fails closed, and a real defect was caught by the new test: an unaddressed `ongoing` task used to fall through to `all-addressed`, telling a reader **"nothing left" while they still had work**. Guarded by `test:today`, 77 checks. The time budget is a tenth `localStorage` key, and the backup registry grew 9 → 10.
- [x] **Rewrote the storage-key guard so it can fail.** See "The storage-key guard was rewritten" above — it compared the test to itself and had broken twice while catching nothing.
- [x] **Gave the reader somewhere to write** (D-019). A note per phase and an answer per practice task, in a ninth `localStorage` key. Deliberately unscored, and asserted to stay that way. Practice tasks gained stable ids for it, which they had never had.
- [x] **A guard that failed silently, found by adding a key.** `test-data.mjs` hardcoded “eight keys” and seeded eight, so registering the ninth made its round-trip loop call `JSON.parse(undefined)` — which threw a stack trace and took the whole suite down, reporting **nothing** rather than reporting a failure. It now reports a missing fixture value as a failed check. This is the second time in this project that a guard printed nothing and was read as green; the first was the `^0[1-9]-` pattern that hid phases 10+.
- [x] **Split every dense paragraph, and gated the audit so they stay split.** 33 paragraphs over 90 words → **0**. The old gate measured a per-phase *average*, which a single wall of text does not move.
- [x] **Audited modules 09–14.** Structurally sound, no restructuring needed, but **five real technical errors** found and fixed that no automated check could catch: a reversed auditd privilege claim, a silently-wrong AWS version-id assumption, a `Get-ScheduledTask` `.Date` string-comparison trap, a retired `sigmac` reference, and a misleading Sysmon filename. Full detail in [`ROADMAP.md`](ROADMAP.md).
- [x] **Assessed the IT track's later phases. Finding: no depth pass is needed.** Phases 6–9 are 6,457–6,992 words across 8–10 substantial Parts — complete lessons, not stubs — and the depth signature (guided walkthrough or worked case) is already present in Phases 2–5 and 8. Phase 1's 24,723 words is the outlier in the other direction and is not a template. The real IT-track defect is **paragraph density, not depth**.
- [x] **Wrote the five module-review follow-ups.** A worked "wrong first guess" and a five-rung setup diagnostic ladder in module 09, a reversed wrong-automation case in module 12, a worked risk-scoring disagreement in module 13, and a residual-incompetence statement in all six modules — each naming a real limitation rather than a humble generality. 366 lines added, nothing deleted.
- [x] **Added full-text search.** See the Search row above and D-013.
- [x] **Confirmed the site is deployed.** It was already live — see the Deploy row above. No new hosting was needed.
- [x] **Gave the reader somewhere to go** (D-014). The phase page had no "next"; a 15,500-word lesson reported no depth and offered no place to stop; "0/90 · 0%" had no reference point. All three were consequences of the same thing the earlier work established — the lesson is 84–95% of a phase file — so the application had grown a reader without growing the affordances a reader needs. Closed with prev/next phase navigation, per-section done toggles stored separately from the checklist, a lesson-scoped reading bar, a resume prompt that suggests rather than jumps, a Schedule view, keyboard shortcuts with none bound to a checkbox, a reading-size control, and a 560px breakpoint.

### Paragraph density, current state

- **Zero paragraphs over 90 words, in either track.** The gate fails the build on anything over 150 and the audit reports any over 90, so this cannot regrow silently.
- Raising the 90-word reporting threshold into a hard gate is the next tightening step, now that the backlog it was waiting on is cleared.

## How to verify quickly

From the repository root:

```powershell
git --no-pager log --oneline -n 5
git --no-pager status --short          # expect ci.yml, CHANGELOG.md, CHECKPOINT.md and SESSION-LOG.md, then empty
git --no-pager log origin/main..HEAD --oneline   # expect empty after pushing

node scripts/lint-content.mjs            # content integrity
node scripts/audit-content.mjs           # phase structure across all 23 phases
node scripts/audit-lesson-ast.mjs        # parser loses no lesson content
node scripts/audit-readability.mjs       # prose density targets
node scripts/cyber-restructure-check.mjs # no cyber phase shrank

cd learning-site
npm run build                            # production build
npm run test:smoke                       # render every phase with real data
npm run test:ui                          # pace, navigation, shortcuts, section keys
npm run test:data                        # backup export/import, incl. the rejection cases
npm run test:notes                       # the notes store and its merge rule
npm run test:work                        # every note and answer reads back, orphans kept
npm run test:today                       # bands, fitting, addressed rules, every reason
npm run test:lesson-search               # in-lesson find agrees with the corpus engine
npm run test:search                      # index and query engine agree
```

Note: `cyber-restructure-check.mjs` exits 2 on a fresh clone because its baseline lives in `TEMP`. That is expected and it is why CI does not run it.

Expected results: lint `140 files, 0 issues`; content audit `0 issues`; lesson AST `23 lessons, 0 loss`; readability `0 of 23` outside target and `0 paragraphs over 90 words`; smoke `181 renders across 23 phases and 191 tools, 0 failures`; highlight `37 checks, pass`; ui `42 checks, pass`; data `86 checks, pass`; notes `28 checks, pass`; work `31 checks, pass`; today `77 checks, pass`; lesson-search `77 checks, pass`; search `41 checks, pass`.