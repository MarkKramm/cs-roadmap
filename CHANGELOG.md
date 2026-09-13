# Changelog

All notable changes to this repository are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- `docs/` meta-documentation: `ARCHITECTURE.md`, `WORKFLOW.md`, `SETUP.md`, `ROADMAP.md`, `DECISIONS.md`, `CHECKPOINT.md`, `SESSION-LOG.md`.
- `AGENTS.md` (contributor/agent guidance) and this `CHANGELOG.md`.
- `docs/CONTENT-GUIDE.md` — authoring standard for phase files.
- `docs/FAQ.md` — design rationale behind the curriculum.
- `docs/TROUBLESHOOTING.md` — recovery playbook for Git and encoding incidents.
- `docs/CONTENT-SCHEMA.md` — the md→JSON contract for the learning site, implemented by `scripts/build-content.mjs`.
- `docs/DESIGN-SYSTEM.md` — UI tokens for the learning site, implemented in `learning-site/src/styles/`.
- `CONTRIBUTING.md` — human entry point into the repo.
- `D-005` in `docs/DECISIONS.md` — scoped build-tooling exception for `learning-site/`.
- `LICENSE` — CC BY 4.0, covering the study curriculum and project documentation.
- `D-006` in `docs/DECISIONS.md` — learning site built with React and Vite.
- `learning-site/` — React + Vite scaffold (Milestone M1, Step 1): app shell, design tokens, base styles, and a local `.gitignore`.
- `scripts/build-content.mjs` — content pipeline (M1 Step 2c) that reads `career-roadmaps/**/*.md` and emits `learning-site/src/data/generated/{it,cyber}.json`. Fails loudly on missing sections, missing task IDs, or paid tools without a free alternative.
- `scripts/add-frontmatter.mjs` — one-time migration helper used in Step 2b.
- `npm run build:content` script, wired to run before `dev` and `build`.
- `learning-site/` app shell (M1 Step 3): sidebar with track switcher and phase list, dashboard with next-task picker, and a phase detail view rendered from the generated JSON.
- `learning-site/` dashboard energy modes (M1 Step 4): low / normal / high selector, persisted in `localStorage`, which filters the recommended next task. `useEnergyMode` hook and `EnergyModeSelector` component.
- Site components: `ProgressBar`, `PhaseCard`, `ChecklistItem`, `ToolCard`, `EnergyModeSelector`.
- `useProgress` hook — progress keyed by stable task IDs and persisted in `localStorage`.
- `src/data/roadmaps.js` — loads the generated JSON and exposes the two tracks.
- `scripts/lint-content.mjs` — text-integrity linter. Flags CRLF, UTF-8 BOM, U+FFFD replacement characters, invalid UTF-8, and ASCII `?` standing in for typographic characters. Read-only; exits non-zero on any issue. Wired as `npm run lint:content`.
- `learning-site/scripts/smoke-render.mjs` — render smoke test (M1 fix, extended through M2). Renders every phase and every page with real data using `react-dom/server` and Vite's `ssrLoadModule`. No new dependencies. Wired as `npm run test:smoke`.
- `D-007` in `docs/DECISIONS.md` — view navigation is local state, not a router.
- Tools library (M2) — `learning-site/src/pages/ToolsLibrary.jsx`. Browse all 112 tools across both tracks, with search over name and purpose, a cost filter, and a track filter. Each result links back to its phase. Cost mapping extracted to `src/data/tools.js` so the badge and the filter cannot drift.
- Portfolio tracker (M2) — `learning-site/src/pages/Portfolio.jsx` and `src/hooks/usePortfolio.js`. Add artifacts you built, link a phase and a repository or live URL, track status. Persisted under `cs-roadmap:portfolio:v1`.
- Application tracker (M2) — `learning-site/src/pages/Applications.jsx` and `src/hooks/useApplications.js`. Company, role, source, dates, status pipeline, and a follow-up date that surfaces when due. Persisted under `cs-roadmap:applications:v1`.
- `EmptyState` component — specified in `docs/DESIGN-SYSTEM.md` since the design pass, implemented here and used by both trackers.
- CI workflow — `.github/workflows/ci.yml` runs on every push to `main` and every pull request. Two jobs, split so a content typo fails fast without paying for a dependency install: **Content integrity** (`node scripts/lint-content.mjs`, no install) and **Learning site** (`npm ci` → `npm run build` → `npm run test:smoke`, under `learning-site/`). Node 24, matching the local toolchain; `permissions: contents: read`. Permitted by D-008.
- CI verification — the workflow was confirmed green on GitHub: 2 runs on `main`, both jobs passing on `ubuntu-latest`, Node 24.
- `## Lesson` sections on IT Phases 1–4 — long-form teaching prose, Markdown-only, 3,000+ words each (4,430 / 4,337 / 3,370 / 6,137). Not extracted into the generated JSON; deliberately absent from the build script's `MANDATORY` list. Documented in `docs/CONTENT-GUIDE.md` ("The Lesson section") and `docs/CONTENT-SCHEMA.md` ("Sections deliberately NOT extracted").
- `## Lesson` sections on IT Phases 5–9 — the lesson pass completed across the whole IT track: Sysadmin Basics (3,039), Tools and Ticketing (3,126), Soft Skills (3,343), Portfolio and Resume (3,214), Job Application Plan (3,757). All nine IT phases now carry full lesson prose. Phases 5–9 needed **no structural repair** — section order was already correct and Markdown task counts matched the extracted JSON exactly (7 / 6 / 6 / 7 / 7), so this was pure content work. Markdown-only: no pipeline, renderer, or dependency change.
- `## Lesson` section on cyber Phase 1 — the cyber lesson pilot: Cybersecurity Foundations (4,965 words). Written to the IT-phase standard: a "Why this lesson exists" opener, five `### Part N` sections (the CIA triad; the vocabulary of risk; how attacks actually work; the defender's side — roles, controls, and frameworks; legal and ethical boundaries), and closing "Key takeaways" / "Practice this next" that point back at the phase's seven existing tasks. **No structural repair was required** — the phase already had clean section order and the generated JSON is byte-identical to `HEAD`, confirming the lesson is invisible to the pipeline as intended. Markdown-only: no pipeline, renderer, or dependency change.
- `## Lesson` section on cyber Phase 2 — Networking and Linux for Cybersecurity (6,841 words), the longest lesson in the cyber track. Structured as an opener, five `### Part N` sections (how networks are built — models, addressing, and layers; Linux filesystem and permissions; Linux services, logs, and the command-line toolkit; packet capture with Wireshark/tcpdump and scan interpretation with Nmap; lab setup and the OverTheWire Bandit learning path), and closing "Key takeaways" / "Practice this next" that give a suggested order for the phase's nine tasks. Includes worked examples of an Nmap result narrated the way a defender should read it, real failed-SSH log lines, and a log-analysis one-liner built from pipes. **No structural repair was required**; the generated JSON is byte-identical to `HEAD`. Markdown-only.
- `## Lesson` section on cyber Phase 3 — Security Fundamentals (8,158 words), now the longest lesson in the repository. The phase spans six topic domains, so the lesson carries six `### Part N` sections — identity security; endpoint and malware behaviour; network security; web security; vulnerability management; incident response — and closes by tying all six together with a worked phishing-incident timeline that demonstrates the phase's exit criterion directly. Includes the Windows Event ID table (4624/4625/4688/4672/4720) with logon-type interpretation, parent-child process detection patterns, the persistence enumeration list, an insecure-versus-secure protocol pairing table, SQL injection and XSS shown as one bug in two interpreters, CVE/CVSS/EPSS contrasted as three different questions, the order-of-volatility principle, and an incident report structure that distinguishes a mechanism from a root cause. **No structural repair was required**; the generated JSON is byte-identical to `HEAD`. Markdown-only.
- `## Lesson` section on cyber Phase 4 — Hands-On Labs (4,506 words). This is the first cyber phase to carry the optional `## Lab setup options` section, so the lesson slots after it and before the tools table, confirming the placement rule generalises. Three `### Part N` sections: designing the lab before building it (an ASCII lab diagram with roles/addresses/log-flow, host-only isolation and why it is what makes the lab safe, static addressing, and capturing a baseline); building it (the install order that avoids rework, snapshot discipline, the manager/agent split and why the agent initiates the connection, what a SIEM does versus Sysmon and AV, and the **source → decoder → rule → alert** pipeline with a real annotated Wazuh rule explaining `if_matched_sid`, `frequency`, `same_source_ip`, severity levels, and the ATT&CK mapping); and generating evidence and writing it up (the generate → observe at source → observe in pipeline → adjust loop, choosing what to detect with the five questions each rule must answer, incident report structure, and why blue-team labs simulate the actual job more closely than offensive ones). Covers the minimum-hardware path honestly, including that documenting a hardware limitation is a legitimate outcome. **No structural repair was required**; the generated JSON is byte-identical to `HEAD`. Markdown-only.
- `## Lesson` section on cyber Phase 5 — Choosing Where to Specialise (4,913 words). This phase carries the optional `## Path options` section, so the lesson slots after it and before the tools table — the second optional-section placement case confirmed. Uniquely among the cyber lessons, its job is to drive a **decision** rather than teach a subject, because the exit criterion is a sentence the learner must be able to say aloud (target role plus the three projects that prove it). Three `### Part N` sections: the four paths described honestly (work, day-to-day feel, best fit, entry reality, and entry barrier for SOC, GRC, IT Security, and Pentest, plus a comparison table); how to decide (the four-axis scoring with the trap in each axis, reading 20 job posts methodically, matching the learner's stated background to a path, primary plus adjacent backup, and the five components of a 90-day plan); and making the choice stick (the switching trap and its mechanism, what focus buys, when revisiting is legitimate, and how this feeds Phases 6–8). Honest about market barriers, including that GRC rarely hires directly and that pentest is a destination rather than a first role. **No structural repair was required**; the generated JSON is byte-identical to `HEAD`. Markdown-only.

### Changed
- `docs/CONTENT-GUIDE.md` — `## Lesson` added as the 5th mandatory section, taking the count from 11 to 12, with a new "The Lesson section" subsection covering the 3,000-word minimum, the `### Part N` structure, and the deliberate exclusion from the build. The review checklist gained a Lesson-length item. `## Common Pitfalls` documented as an accepted optional section.
- `docs/CONTENT-SCHEMA.md` — new "Sections deliberately NOT extracted" subsection recording that `## Lesson` and `## Common Pitfalls` map to no JSON key, and why.
- `README.md`, `CHANGELOG.md`, `docs/CHECKPOINT.md`, `docs/CONTENT-GUIDE.md`, `docs/ROADMAP.md`, `docs/SESSION-LOG.md` — updated for the completed IT lesson pass: the tracked-file count corrected to 81 (it had been recorded as 83, then 84, and the linter counts loose `.json` artifacts at the repo root while they exist), the lesson-placement rule generalised to phases with no `## Specific topics to learn` (Phases 8 and 9), and the `## Common Pitfalls` exception in Phase 1 documented so the "lesson abuts `## Tools for This Phase`" invariant is stated accurately rather than universally.
- `docs/CHECKPOINT.md`, `docs/ROADMAP.md`, `docs/SESSION-LOG.md` — the IT lesson pass is committed and `HEAD` builds again, so the "commit the working tree" item is closed and the checkpoint's working-tree row reads clean. `HEAD` was verified in a scratch worktree to reproduce the working tree byte-for-byte apart from `generatedAt`.

- `docs/ROADMAP.md` — content-depth pilot moved from Next to Done; IT lesson writing for Phases 1–4 and the stranded-task recovery recorded as done; Phases 5–9 queued as the next item.
- `docs/CHECKPOINT.md` — refreshed to 2026-09-13: file count corrected to 81, content-depth row updated from "syllabus only" to "Phases 1–4 carry lessons", health checks extended with the `build-content.mjs` task-ID count and the structural-diff result, open items rebased on Phases 5–9.
- `README.md`, `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`, `docs/CHECKPOINT.md` — entry-point docs aligned with the current repository: CI and `.github/` documented, stale structure trees rebuilt, and the checkpoint's component/hook counts (7→6, 5→4) and file count (80→81) corrected. The checkpoint's `HEAD`/`Commits` rows were removed — a checkpoint cannot contain its own hash, so they drifted by one commit on every edit.
- `docs/DECISIONS.md` — D-003 and D-005 carry an "Amended by" cross-reference to D-008. Entries are dated snapshots and were not rewritten.
- `README.md`, `docs/ROADMAP.md`, `docs/CHECKPOINT.md`, `docs/SESSION-LOG.md` — record a content-depth assessment: the phase files are a syllabus (what to learn, where to find it), not lesson prose, and an unknown `##` heading is ignored by the build. The next task is a Markdown-only `## Lesson` pilot on IT Phase 1, so no content was written yet. The README status no longer claims the curriculum is "complete" without qualification.
- `AGENTS.md` rule 3 scoped: build tooling permitted only under `learning-site/` and `scripts/`.
- `docs/CHECKPOINT.md` refreshed to the current commit and file counts.
- `docs/ROADMAP.md` updated: new docs recorded as done; Learning Site M1 moved to Next.
- `CHANGELOG.md` compare and release links now point at the real repository URL.
- `docs/ROADMAP.md` — publish and license items closed; M1 moved to In progress.
- `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/SETUP.md` — corrected the claim that the repository has no build step or dependencies. The curriculum stays dependency-free; the learning site and content tooling do not.
- `docs/CONTENT-SCHEMA.md`, `docs/DESIGN-SYSTEM.md` — marked as implemented and pointed at the code that implements them, replacing the earlier "planned" and "design intent" status lines.
- `docs/CHECKPOINT.md` — refreshed to the current commit, file count, and checks.
- `docs/SESSION-LOG.md` — added the audit/fix session; corrected the oldest entry's "Next", which still described configuring the remote.
- `learning-site/src/App.jsx` — navigation is now a single `view` string covering Dashboard, Tools, Portfolio, and Applications, replacing the phase-open boolean. See D-007.
- `docs/DESIGN-SYSTEM.md` — sidebar contents updated to the Views list that actually exists; the three M2 pages no longer described as forthcoming.
- `docs/ROADMAP.md` — M2 moved to Done; the render smoke test recorded as a completed item.
- `learning-site/README.md` — removed a duplicated `## Layout` section; documented the new pages, hooks, and commands; status brought up to M2.

### Fixed
- **Two tools were silently deleted from Phase 4's `## Tools for This Phase` table.** `Microsoft Teams` and `Google Workspace Admin Help` lost their rows during the Phase 1–4 lesson work, and those rows were left stranded in the middle of the lesson prose instead of being dropped altogether. The table read 4 rows where it should have held 6, and the site's Tools library quietly fell from 112 tools to 110. The rows were removed from the lesson and restored to the table, and Phase 4's lesson was re-measured at 6,137 words. Found by building structural JSON from a `git worktree` at `HEAD` and diffing it against the working tree — the ID-based comparisons used while the damage happened could not see it, because tool rows carry no IDs.
- **Three IT phase files were feeding the site zero practice tasks.** Phases 1, 3, and 4 kept their tasks under `### Hands-on Tasks`, a heading the build script does not read, so `it.json` carried `tasks: 0` for each while the tasks sat intact in the Markdown. Restoring the contract heading `## Hands-on practice tasks` took the totals from 0/0/0 to 5/8/6 and raised `total phase task IDs` from 116 to 129. This was a silent failure: the build passed, the lint passed, and the site rendered — it simply rendered less than the content contained.
- **Phases 3 and 4 had lessons inserted between `## Goal of this phase` and `## Estimated time`.** The pilot edit split the Goal from its Estimated time and duplicated the `## Estimated time` heading later in the file. Because the parser takes the first occurrence of each heading, the duplicates were latent rather than fatal, but the document read out of order and the second heading was dead weight.
- **Phase 3 and Phase 4 had lesson prose leaked into `## Specific topics to learn`.** The topic sections ended with `### Step-by-Step Breakdown` bodies that belonged to the lesson, doubling content that the lesson was about to state properly.
- **Phases 1, 2, 3 and 4 carried an undocumented `## Common Pitfalls` section and a redundant `## Resources` section.** `## Resources` duplicated a subset of `## Free/cheap resources`; it was removed. `## Common Pitfalls` was kept and is now documented in `docs/CONTENT-GUIDE.md`.
- **Phase 1 contained two occurrences of the deprecated `wmic` command**, removed from Windows and unreliable on current builds. Replaced with `Get-PhysicalDisk`.
- **Phase 2's task list was truncated to 3 of its 7 tasks** during a rebuild and its closing blank line was lost. All 7 restored.
- `learning-site/src/components/ToolCard.jsx` contained `PhaseCard`'s implementation verbatim — same body, same `{ phase, done, total, onOpen }` signature — while its only call site passed `{ tool }`. Opening any phase threw a `TypeError` and blanked the view. Both `npm run build` and `npm run dev` passed, because a component whose signature does not match its call site still compiles. Now renders name, purpose, cost badge, mini-task, free alternative, and the official link.
- `learning-site/src/pages/Dashboard.jsx` pointed at "Settings" for resetting progress; no Settings page exists. Now points at the sidebar.
- `docs/DESIGN-SYSTEM.md` listed sidebar links (Tools / Portfolio / Applications / Settings) that do not exist.
- `scripts/lint-content.mjs` never scanned `LICENSE`. The file is extensionless, so it missed both the extension allow-list and the `CHECK_NAMES` set, and the repository's own license was the one text file exempt from the text-integrity check. Now matched by name; the lint count went 79 → 80 files.
- `scripts/build-content.mjs` degraded silently on a malformed resource line. A line that did not match `Name — https://…` produced `{ name, url: null }` and the build passed, so a broken link surfaced later in the UI rather than at the point of the mistake. It now fails with one of two messages — a URL present but the wrong separator, or no URL at all — matching the script's existing promise that a contract violation stops the build. All 92 existing resource lines already satisfy the rule, so no content changed.

## [0.1.0] — 2026-09-11

### Added
- Root `README.md` (project landing page) and `.gitignore`.
- `.editorconfig` to enforce UTF-8 and LF at save time.
- `.gitattributes` with an LF normalization policy, binary markers, and lockfile handling.

### Fixed
- Recovered the working tree from Git objects after it was emptied, restoring all 29 content files byte-for-byte.
- Restored content corrupted by a lossy UTF-8→ASCII conversion: em-dashes (`—`), en-dashes (`–`), curly quotes (`“ ”`), and box-drawing tree characters that had become literal `?`.
- Normalized all text files to LF (removed CRLF churn).

### Changed
- Established the baseline commit for `career-roadmaps/`.

[Unreleased]: https://github.com/MarkKramm/cs-roadmap/compare/0.1.0...HEAD
[0.1.0]: https://github.com/MarkKramm/cs-roadmap/releases/tag/0.1.0