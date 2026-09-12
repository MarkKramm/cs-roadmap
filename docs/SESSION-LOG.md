# Session Log

A chronological record of working sessions. Newest first.

## 2026-09-13 — Lessons for IT Phases 5–9: the IT track lesson pass is complete

**Goal:** Apply the `## Lesson` treatment to IT Phases 5–9 at 3,000+ words each, checking each for structural defects first.

**The headline finding — there was nothing to repair.** Unlike Phases 1–4, all five of these phases were structurally clean. Checked before writing, per phase:

- Section order matched the contract, with no duplicated headings.
- No `### Hands-on Tasks` heading — tasks already sat under the contract heading `## Hands-on practice tasks`.
- No lesson prose leaked into `## Specific topics to learn`.
- No stray `## Resources` or `## Common Pitfalls` sections needing reconciliation.
- Markdown task counts matched the extracted JSON exactly: 7 / 6 / 6 / 7 / 7.

So this session was **pure content work, with no repair phase**, and the structural diff confirms it (see Verification).

**One structural wrinkle worth recording.** Phases 8 and 9 have no `## Specific topics to learn`. Phase 8 runs `## Portfolio structure` → `## Resume sections`; Phase 9 runs `## Target roles` → `## PH-friendly job boards`. The lesson was placed after the **last structural section** in both, keeping the order *skills → structure → lesson → tools* and preserving the invariant that actually matters: the lesson always sits immediately before `## Tools for This Phase`. This generalisation is now documented in `docs/CONTENT-GUIDE.md`.

**Lessons written:**

| Phase | Words | Angle |
|---|---|---|
| 05 Sysadmin Basics | 3,039 | Accounts, permissions, services, updates, backups — "why the organisation works this way" |
| 06 Tools and Ticketing | 3,126 | How tools encode process; tickets as audit trail and institutional knowledge |
| 07 Soft Skills | 3,343 | Diagnostic-question craft, plain-language rewriting, STAR stories |
| 08 Portfolio and Resume | 3,214 | What a hiring manager scans for; honest framing of a no-degree path |
| 09 Job Application Plan | 3,757 | Pipeline discipline, honest keyword matching, scam detection |

Every lesson follows the established shape: opens with "Why this lesson exists", splits into `### Part N` sections, includes real worked examples (a rewritten PowerShell inventory script, the same incident written as a weak ticket and a professional one, the same fix explained to a technical colleague and to a user, a STAR project summary with evidence paths), and closes with "Key takeaways" and "Practice this next".

**Verification:**

- `node scripts/lint-content.mjs` — 81 files, 0 issues. (The linter walks the whole repo and counts every file with a checkable extension, including loose `.json` files at the root, so temporary diff artifacts inflate this number while they exist. 81 is the true count and it equals `git ls-files`; the "84" recorded in `CHECKPOINT.md` was stale and has been corrected.)
- `node scripts/build-content.mjs` — 129 phase task IDs, unchanged.
- **`HEAD` vs working tree, built JSON diffed field-by-field:** 3 intended phase-level differences, 0 unintended. IT tools 56 → 56, both tracks 112.
- `npm run build` (Vite) — builds clean.
- `npm run test:smoke` — 31 renders, 0 failures.
- **Structural diff, baseline captured before any edit vs. final `it.json`: 1,585 lines identical, zero diffs.** Stronger than an ID-count comparison: the entire generated document is byte-identical apart from `generatedAt`.
- Per-phase task counts unchanged at 7 / 6 / 6 / 7 / 7; checklist counts unchanged at 8 / 7 / 6 / 7 / 8.
- All five files LF, UTF-8, no BOM; exactly one `## Lesson` heading each; no duplicate headings.

**Process notes:**

- **The chunked-edit hazard from last session was avoided this time.** Every insert was anchored on unique surrounding text, never on a line number, and the `## ` heading map was re-read after each phase. No misplaced sections occurred.
- The editor's `new_text` limit is a hard ~6,000 characters; oversized calls fail outright with no partial write. Lessons were therefore written in roughly 2,000-character anchored chunks.
- The build script's section parser matches `^## (.+)$` **without** checking fenced code blocks. This did not cause a problem here — the Phase 8 README example contains `## What's here`, `## Background`, and `## Contact`, which are read as sections but ignored because unknown section names are not extracted. Recorded because a future edit that puts a code fence around a *recognised* heading name would be misparsed.

**A regression that the existing checks could not see.** The verification above proves the *structural* document did not move during this session — but that is not the same as proving the structural document was right. So a `git worktree` at `HEAD` was checked out, the build was run there, and its JSON was diffed field-by-field against the working tree's. Three phase-level differences appeared, all intended:

- `it-01` CrystalDiskInfo free alternative — `wmic diskdrive` → `Get-PhysicalDisk`, the deliberate fix for a command Windows has deprecated.
- `it-03` tasks 0 → 8, `it-04` tasks 0 → 6 — the stranded-task recovery from the previous session.

But a row-level comparison of the tools tables showed the IT total had fallen from 56 to 54, and the JSON diff had not flagged it because two rows had *moved rather than vanished*. Phase 4's tools table had lost **`Microsoft Teams`** and **`Google Workspace Admin Help`**; both rows were sitting stranded in the middle of the lesson prose, jammed between two paragraphs. **Fix:** rows removed from the lesson and restored to the table, plus the blank line before `## Free/cheap resources` that went with them. IT tools back to 56, both tracks back to 112, and the smoke test back to reporting 112.

Why every check passed while this was broken: tool rows carry **no IDs**, so `task`/`checklist` ID comparisons cannot see them; and the build, the lint, and the render all succeed with two fewer tools. It rendered less than the content contained — the same class of silent failure as the stranded tasks. **A HEAD-vs-worktree JSON diff is now the check that closes it.** Phase 4's lesson re-measures at 6,137 words; the 44-word difference from the previously recorded 6,181 is exactly the two removed rows.

Worth knowing for next time: **`HEAD` does not build.** Its Phase 2 carries six resource lines with no URL, and `build-content.mjs` refuses to write output when it fails. The repairs exist only in the working tree, so the `HEAD` worktree had to borrow the current Phase 2 to run at all — another reason the working tree needs committing.

**Two Phase 1 findings, deliberately not fixed.** Phase 1 is the only phase whose lesson is not immediately followed by `## Tools for This Phase` — a `## Common Pitfalls` list sits between them. `CONTENT-GUIDE.md` explicitly permits that section, so this is policy-compliant rather than a defect; the invariant in `CONTENT-GUIDE.md` was rewritten to state the exception instead of the file being restructured to satisfy a rule that no longer claims to be universal. Phase 1 also still carries a legacy `### Hands-On Tasks` block of verbose `#### Task 1–5` walkthroughs inside `## Specific topics to learn`, duplicating the five one-line tasks in the real `## Hands-on practice tasks` section. It contributes nothing to the generated JSON — its items are indented sub-bullets and `####` headings, which the extractors ignore — so deleting it would change no output at all. But it holds the step-by-step instructions that the one-line task list does not, so removing it would lose real teaching detail from the Markdown. Left in place and flagged as a candidate for folding *into* the task section rather than being deleted.

**Docs updated:** `docs/ROADMAP.md` (Phases 5–9 moved to Done; Next now lists cyber-track lessons and site deployment), `docs/CHECKPOINT.md` (content depth, tracked-file count corrected 83 → 81, tools back to 112), `docs/CONTENT-GUIDE.md` (lesson placement when `## Specific topics to learn` is absent; the `## Common Pitfalls` exception stated), `CHANGELOG.md` (Phases 5–9 lessons added; Phase 4 tools regression recorded under Fixed), `README.md`, and this log.

**Committed at the end of this session:** three commits on `main` — `fix(it-roadmap)` for the Phase 1–4 repairs, lessons and restored tool rows; `docs(it-roadmap)` for the Phases 5–9 lessons; and `docs` for the doc set. `HEAD` was then verified to build in a scratch worktree and to reproduce the working tree byte-for-byte apart from `generatedAt` (1,602 lines each), which closes the "`HEAD` does not build" problem recorded above.

**Next:** the open questions are scope, not defects: whether to extend lessons to the 8 cyber phases (deliberately syllabus-first today), whether to deploy the site (private-repo visibility — Netlify, Vercel and Cloudflare all deploy private repos on their free tiers), and whether the site should surface lessons at all, given the lesson is deliberately outside the extracted JSON.

## 2026-09-13 — Lessons for IT Phases 1–4, and the stranded-task bug

**Goal:** Write `## Lesson` sections for IT Phases 1–4 at 3,000+ words, starting from the Phase 1 pilot agreed on 2026-09-11.

**What the work uncovered — the phase files were structurally broken:**

Phases 3 and 4 shared a defect pattern that predated this session:

- The `## Lesson` heading sat **between `## Goal of this phase` and `## Estimated time`**, splitting a Goal from its own time estimate, with `## Estimated time` then appearing a second time further down.
- The lesson body had **leaked into `## Specific topics to learn`** as a `### Step-by-Step Breakdown` block, duplicating what the lesson was about to say.
- Tasks sat under **`### Hands-on Tasks`**, a heading the build script does not read, so `it.json` recorded `tasks: 0` for both phases while the tasks were plainly present in the Markdown.
- An undocumented `## Common Pitfalls` section and a redundant `## Resources` section were present in all four phases.

**The most serious finding — silent task loss.** Phase 1, Phase 3, and Phase 4 each generated **zero** practice tasks in `it.json`. The build passed, the lint passed, and the site rendered — it simply rendered less than the content contained. This is the failure mode the pipeline cannot catch on its own, because a missing heading is not a malformed heading. It was found by diffing generated output against the Git originals rather than by any check.

**Repairs applied (all four phases):**

| Phase | Repair |
|---|---|
| 1 | Duplicate `## Deliverable` / `## Checklist` removed; orphaned bullets folded into topics; redundant `## Resources` dropped; `wmic` → `Get-PhysicalDisk` (2 sites); lesson moved after `## Specific topics` |
| 2 | Rebuilt from the Git original to restore the section contract; task list restored from 3 to 7 |
| 3 | Misplaced lesson and duplicate `## Estimated time` removed; 8 tasks recovered from `### Hands-on Tasks`; leaked topic prose removed; redundant `## Resources` dropped |
| 4 | Same treatment as Phase 3; 6 tasks recovered |

**Lessons written:**

| Phase | Words |
|---|---|
| 01 Computer Fundamentals | 4,430 |
| 02 Operating Systems | 4,337 |
| 03 Networking Basics | 3,370 |
| 04 Helpdesk Skills | 6,181 |

Each lesson opens with "Why this lesson exists", is split into 4–6 `### Part N` sections, uses real commands and worked examples, and closes with "Key takeaways" and "Practice this next".

**Verification — structural integrity is the point:**

- `node scripts/lint-content.mjs` — 84 files, 0 issues.
- `node scripts/build-content.mjs` — 129 phase task IDs, up from 116 before the repair.
- `npx vite build` — builds clean in 803 ms.
- **Structural diff, pre-repair baseline vs. current `it.json`: 75 element IDs before, 75 after, zero missing, zero extra, zero count changes.** Progress saved against any task ID in the learner's `localStorage` still resolves.
- Per-phase task counts now: 5 / 7 / 8 / 6 / 7 / 6 / 6 / 7 / 7.

**Process note — a hazard worth recording.** Chunked `editor(insert_line=N)` calls must not be used for multi-step edits. Line numbers drift between calls, and an insert placed against a stale number will silently put a section in the wrong part of the document. This happened mid-session: `## Tools for This Phase` was inserted *inside* the Phase 4 lesson, splitting it in two. It was caught by re-reading the heading map after every insert, and fixed by unique-anchor text replacement. Anchor on surrounding text, not on line numbers.

**Docs updated:** `docs/CONTENT-GUIDE.md` (12 mandatory sections; new "The Lesson section"), `docs/CONTENT-SCHEMA.md` (new "Sections deliberately NOT extracted"), `docs/ROADMAP.md`, `docs/CHECKPOINT.md`, `CHANGELOG.md`, and this log.

**Also noted:** commit `51ecdf6` ("Added detailed lesson sections for Phase 3: Networking Basics and Phase 4: Helpdesk Skills") landed lesson prose on `main` without a `docs:` prefix and without the accompanying documentation updates this session supplied. The lessons themselves were a reasonable first draft but carried every defect described above.

**Next:** apply the same treatment to IT Phases 5–9, checking each for the stranded-task pattern before writing.

## 2026-09-11 — Pause: content-depth assessment

**Goal:** Wrap up for the day, and check whether the curriculum is teachable material or only a syllabus.

**Finding — the content is a syllabus, not a textbook:**
- 29 files, roughly 20,000 words total; 693–916 words per phase.
- Each phase says *what* to learn and *where* to find it (goal → skills → topics → tools → resources → tasks → deliverable → checklist → exit bar). It does not teach the subject itself. `- CPU: cores, threads, clock speed, overheating symptoms` is a topic line, not a lesson.
- `docs/CONTENT-GUIDE.md` calls its 11 sections "mandatory", but none of them is a lesson body.

**Pipeline constraint confirmed (so the plan is safe):**
- `scripts/build-content.mjs` reads only its known `##` headings. An unknown heading is never read, so arbitrary prose under a new heading cannot fail the build.
- `learning-site/src/pages/PhaseDetail.jsx` renders only the extracted fields, so prose in a phase file does not appear in the site. The site's existing "read the full guide" link (`PhaseDetail.jsx:23`) opens the Markdown on GitHub — that is the channel deep content would be read through.

**Agreed next task — planned, NOT executed (no content was written this session):**
- Pilot one phase: `career-roadmaps/it-roadmap/01-phase-computer-fundamentals.md`, adding a `## Lesson` section after `## Specific topics to learn`.
- Target ~3,000 words. Five beats per topic — what it is, how to check yours, what the numbers mean, what failure looks like, what you would do — plus a guided walkthrough with real commands and expected output (`winver`, `msinfo32`, `dxdiag`, the four Task Manager tabs, Device Manager, `Get-PhysicalDisk`).
- Markdown-only: the lesson lives in the phase file and is read via the "read the full guide" link. No pipeline or renderer change, no new dependency.
- Then document `## Lesson` in `docs/CONTENT-GUIDE.md` (allowed authoring section) and `docs/CONTENT-SCHEMA.md` (deliberately not extracted), so a later reader does not delete prose the parser ignores.
- Judge the effort on that one phase before repeating for the other 16.

**Carry-over fix spotted, not yet applied:** `01-phase-computer-fundamentals.md` line 62 offers `wmic diskdrive` as the free alternative to CrystalDiskInfo. `wmic` is deprecated and being removed from Windows; `Get-PhysicalDisk` is the current replacement.

**State verified before pausing:**
- `node scripts/lint-content.mjs` — 81 files, 0 issues.
- `npm run build` — exit 0. `npm run test:smoke` — 31 renders across 17 phases and 112 tools, 0 failures.
- Working tree clean, in sync with `origin/main`.

**Next:** run the IT Phase 1 lesson pilot described above.

## 2026-09-11 — CI verification and docs coherence

**Goal:** Confirm the CI workflow actually runs green on GitHub, then bring the entry-point docs in line with the repository.

**Verified — CI is green:**
- Two runs on `main`, both passing: `fe04ed3` and `8cfc2d4` (the current tip).
- Both jobs pass in each run — **Content integrity** and **Learning site** — on `ubuntu-latest`, Node 24.
- This closes the gap the CI session left open ("the first push is the real test"). The lockfile concern was also checked directly: `learning-site/package-lock.json` carries the Linux optional binaries (`@rollup/rollup-linux-x64-gnu`, `@esbuild/linux-x64`) with correct `os`/`cpu` markers, so `npm ci` resolves on the runner.

**Docs aligned (the entry-point files had drifted):**
- `README.md` — layout tree rebuilt to the real structure; the stale "Content baseline complete" status replaced.
- `CONTRIBUTING.md` — structure block expanded to all four areas plus `.github/`; CI added to the change loop.
- `docs/ARCHITECTURE.md` — the "No dependencies" invariant qualified per D-005/D-008, and CI documented.
- `docs/CHECKPOINT.md` — corrected component/hook counts (7→6, 5→4), file count (80→81), added `.github/` to the tree, and **removed the `HEAD`/`Commits` rows**. A checkpoint cannot contain its own hash, so those numbers drifted on every edit; the file now points at `git log` for the exact commit.
- `docs/DECISIONS.md` — D-003 and D-005 carry an "Amended by D-008" note. The log is ADR-style: entries are dated snapshots, superseded rather than rewritten.

**Next:** Deploy the site — still the only open `ROADMAP.md` item, and it needs its own decision (D-009) before any config lands.

## 2026-09-11 — CI

**Goal:** Add continuous integration — the only item under `ROADMAP.md` → Next.

**Scope decision:** `.github/workflows/` sits outside the `learning-site/` + `scripts/` carve-out that D-005 granted under `AGENTS.md` rule 3, so the workflow needed a decision before it could exist. Recorded as **D-008**: CI is permitted, deploy is not. The carve-out is deliberately check-only — no deploy step, no secrets, no credentials — so the dependency-free guarantee for `career-roadmaps/` and `docs/` survives.

**Done:**
- `docs/DECISIONS.md` — D-008, inserted newest-first above D-007.
- `AGENTS.md` — rule 3 now names the CI carve-out and cites D-008 alongside the existing D-005 reference.
- `.github/workflows/ci.yml` — two jobs. **Content integrity** runs `node scripts/lint-content.mjs` with no install, so a CRLF, BOM, or stray `?` fails in seconds. **Learning site** runs `npm ci`, `npm run build`, and `npm run test:smoke` under `learning-site/`. Node 24, matching local v24.19.0; `permissions: contents: read`.

**Verified:**
- `node scripts/lint-content.mjs` from the root — clean. It now scans the workflow file itself (`.yml` is already in `CHECK_EXT`), so the new file has to satisfy the rule it enforces.
- `npm run build` and `npm run test:smoke` under `learning-site/`.
- `ci.yml` is LF, UTF-8, no BOM.

**Notes:**
- `npm ci` requires a committed `learning-site/package-lock.json`; confirmed present before writing the job.
- `learning-site/package.json` has no `engines` field, so the Node version is pinned in the workflow rather than read from the manifest. Adding `engines` would be a change to the site's contract, not the CI task, so it was left as a possible follow-up.

**Next:** Deploy the site — still gated on the private-repo visibility decision. GitHub Pages from a private repo generally needs a paid plan; Netlify, Vercel, and Cloudflare Pages all deploy private repos on free tiers.

## 2026-09-11 — Tooling hardening

**Goal:** Close the two deferred defects from the audit, then record the state for a pause.

**Done (two commits):**
- Commit 1 (`80c9055`) — `fix(tooling): scan LICENSE and fail loudly on malformed resource lines`.
- Commit 2 (`4fbccd7`) — `docs: refresh checkpoint and record the tooling fixes`.

**The two defects:**
- `scripts/lint-content.mjs` never scanned `LICENSE`. The file is extensionless, so it missed both the extension allow-list and the three-entry `CHECK_NAMES` set — the repository's own license was the only text file exempt from the text-integrity check. It is matched by name now; the lint count went 79 → 80 files.
- `scripts/build-content.mjs` degraded silently on a malformed resource line. A line that did not match `Name — https://…` produced `{ name, url: null }` and the build passed, so a broken link surfaced later in the UI rather than at the point of the mistake. It now fails with one of two messages — a URL present but the wrong separator, or no URL at all.

**Verified (negative test, four directions):**
- Clean content → exit 0.
- `- Name - https://example.com` (hyphen separator) → exit 1, reporting that a URL is present but the separator is wrong.
- `- Name` (no URL) → exit 1, "resource line has no URL".
- Original bytes restored → exit 0, and `git diff career-roadmaps/` empty. The test left no residue.

**Notes:**
- All 92 existing resource lines already satisfied the rule, so no content changed. The fix closed a latent fragility, not live corruption. An earlier sweep that appeared to show 92 of 92 malformed was a bug in the check, not the repository: PowerShell's `Get-Content` decodes with the ANSI code page, which mangled the em-dash. `build-content.mjs` reads UTF-8 and was always correct.
- Session-log numbers are historical by design. Entries record what was true during their own session; current-state counts live in `docs/CHECKPOINT.md`.

**Next:** CI — run `lint:content`, `build`, and `test:smoke` on every push. Needs a recorded decision first (D-008): `.github/workflows/` sits outside the `learning-site/` + `scripts/` scope that `AGENTS.md` rule 3 permits.

## 2026-09-11 — Learning Site Milestone M2

**Goal:** Build the three features M2 committed to — a tools library, a portfolio tracker, and an application tracker.

**Done (five commits):**
- Commit 1 (`7642aa3`) — `feat(site): add view navigation and EmptyState`. `App.jsx` navigation became a single `view` string; recorded as D-007. `EmptyState` implemented against the spec and the `.empty-state` class that already existed.
- Commit 2 (`9fe6360`) — `feat(site): add the tools library`. 112 tools flattened with track/phase provenance. Search, cost filter, track filter. `costTone()` moved out of `ToolCard` into `src/data/tools.js` so the badge and the filter share one definition.
- Commit 3 (`dedd8ec`) — `feat(site): add the portfolio tracker`. `usePortfolio` hook, `Portfolio` page, status filter, phase and URL links.
- Commit 4 (`7056e21`) — `feat(site): add the application tracker`. `useApplications` hook, `Applications` page, status pipeline, follow-up dates flagged when due.
- Commit 5 — docs: CHECKPOINT, ROADMAP, SESSION-LOG, CHANGELOG, `learning-site/README.md`.

**Scope decision:** the three features were approved as a set at kickoff. The nav work was split so that each destination's sidebar link landed in the same commit as its page — no commit in the sequence ships a link to a page that does not exist.

**Verified after every commit:**
- `npm run test:smoke` — grew 26 → 31 renders as pages were added; 0 failures. Each new page was added to the smoke test in the same commit that created it.
- `npm run lint:content` — 79 files, 0 issues.
- `npm run build` — succeeds.
- All edited files LF, no BOM, no U+FFFD.

**Notes:**
- The editor's 6000-character cap was hit twice (`Portfolio.jsx`, `Applications.jsx`). Both were split into create-then-append writes and verified afterward — the hazard was known and did not cause a silent drop.
- The portfolio tracker's `update()` was removed before commit: nothing called it, and dead mutators in a fresh file are worth deleting rather than keeping "just in case".
- `crypto.randomUUID` was deliberately avoided in both new hooks — it requires a secure context, which a local `file://` page is not.

**Next:** deploy the site, still blocked on the private-repo visibility decision (see `ROADMAP.md` → Later / optional).

## 2026-09-11 — Audit, ToolCard fix, and doc-accuracy pass

**Goal:** Audit the M1 work for real bugs and false claims, then fix what the audit found.

**Done (four commits):**
- Commit 1 (`ead116a`) — `fix(site): render ToolCard correctly and add a render smoke test`. Test-first: `learning-site/scripts/smoke-render.mjs` was written and run against the broken code first (19 failures), then `ToolCard.jsx` was rewritten to do its actual job, then the test was re-run (0 failures). Both landed in one commit.
- Commit 2 (`56d17dc`) — `docs: correct statements that the repository has no build step`. `AGENTS.md` prose and structure tree, `CONTRIBUTING.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/SETUP.md`.
- Commit 3 (`8adfd58`) — `docs: mark site-prep specs as implemented`. `CONTENT-SCHEMA.md` and `DESIGN-SYSTEM.md` no longer describe themselves as future work.
- Commit 4 — `docs: refresh checkpoint and correct dead UI references`.

**The bug:** `ToolCard.jsx` was a verbatim copy of `PhaseCard.jsx` — it exported a function named `PhaseCard` from a file named `ToolCard.jsx`, destructured `{ phase, done, total, onOpen }`, and its only call site passed `{ tool }`. Opening any phase threw `TypeError: Cannot read properties of undefined (reading 'title')`. Both `npm run build` and `npm run dev` passed, which is why it survived M1 verification: a component whose signature does not match its call site still compiles cleanly. Only rendering it with real props catches that.

**Verified:**
- Smoke test: 26 renders across 17 phases and 112 tools. Fails on the old code, passes on the new — the failure was reproduced before the fix, not after.
- Vite's `ssrLoadModule` worked on Windows with Vite 6; the esbuild fallback was not needed. No new dependencies — the test uses `react-dom/server`, already installed.
- Content lint: 72 files, 0 issues. Production build: 40 modules, `dist/` produced.

**Notes:**
- `smoke-render.mjs` lives in `learning-site/scripts/`, not the repo-root `scripts/` as first planned: Node resolves modules by walking up from the script's own directory, so a root-level script would never see `learning-site/node_modules`.
- Limitation: server rendering runs no `useEffect` and no event handlers. The smoke test catches render-time crashes, not interaction bugs. Reaching every phase detail view is what makes it useful — the dashboard never mounts `PhaseDetail`.

**Next:** Learning Site M2 — tools library, portfolio tracker, application tracker.

## 2026-09-11 — Learning Site Milestone M1

**Goal:** Turn the roadmap Markdown into a working personal learning site.

**Done (M1, five commits):**
- Step 0 (`06f9b6b`) — `D-006` recorded: React + Vite. `ROADMAP.md` and `CHECKPOINT.md` refreshed.
- Step 1 (`3f4bf0b`) — scaffolded `learning-site/` by hand-writing `package.json` rather than running `npm create vite`, which can prompt and hang a non-interactive shell. Vite 6.4.3, React 18.3.1, `@vitejs/plugin-react` 4.7.0.
- Step 2a (`f33b217`) — renamed two IT phase files to match the documented `NN-phase-*` convention. Verified zero inbound references first.
- Step 2b (`f380ce3`) — migrated all 17 phase files: YAML front-matter plus 129 stable task IDs appended as HTML comments. Insert-only; no existing character rewritten.
- Step 2c (`fbf0ab0`) — `scripts/build-content.mjs` parses the Markdown and emits `it.json` (9 phases) and `cyber.json` (8 phases). Wired as `build:content`, runs before `dev` and `build`. Output is git-ignored.
- Step 3 (`a22fb02`) — app shell: sidebar with track switcher and phase list, dashboard, phase detail rendered from JSON.
- Step 4 (`f64cad1`) — energy modes (low / normal / high) filtering the recommended next task, persisted in `localStorage`.

**Verified:**
- Build: 40 modules, `dist/` produced.
- Dev server boots and releases the port on shutdown.
- `it.json` + `cyber.json` parse; 66 + 63 task IDs; only 1 `?` per file (a legitimate quoted string).
- Negative test: a deliberately broken phase file produced 10 named errors and exit code 1.
- All new files LF, no BOM.

**Notes:**
- Two bugs caught before commit: the migration script first emitted IDs as `it-03-phase-networking-basics-c01` (spec requires `it-03-c01`), and took the *lower* bound of a duration range (`8–12` → 8). Both fixed by reverting the migration and re-running. The upper bound is correct for a curriculum that builds in buffer weeks.
- The editor silently dropped two files during an over-batched write. Caught by an import-resolution check, re-created, and confirmed present.
- Parallel write-then-verify raced twice more (generated JSON, file inventory). Both re-checked sequentially.

**Next:** Learning Site M2 — tools library, portfolio tracker, application tracker.

## 2026-09-11 — Baseline recovery, encoding fix, and scaffolding

**Goal:** Stabilize the repository and add project hygiene.

**Done:**
- Initialized Git (`main`) and set a local identity.
- Added `.gitattributes` (LF normalization, binary markers, lockfile handling).
- Recovered all 29 content files from dangling Git blobs after the working tree had been emptied, verified byte-for-byte with `git hash-object --no-filters`.
- Fixed encoding corruption: restored em-dashes, en-dashes, curly quotes, and box-drawing characters that a lossy conversion had turned into literal `?`. Only three genuine question marks remain.
- Committed the baseline: `chore: baseline career-roadmaps with LF + encoding fixes`.
- Added root `README.md` and `.gitignore`.
- Added `.editorconfig` to enforce UTF-8/LF at save time.
- Added `docs/` meta-documentation, `AGENTS.md`, and `CHANGELOG.md` (this batch).

**Notes:**
- Avoided parallel write+verify on the same files; a race earlier left a file staged-but-uncommitted, since resolved by running steps sequentially.
- One snag: the editor wrote CRLF on disk; fixed by removing and re-checking out files from Git so the working tree matches the LF policy.

**Next (at the time):** configure a Git remote and push `main`; decide on a license. Both were completed in later sessions — see the entries above.