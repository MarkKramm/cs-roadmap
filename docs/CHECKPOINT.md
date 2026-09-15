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
| Visibility | Private — not publicly reachable |
| License | CC BY 4.0 |
| Build step | `learning-site/` — React + Vite. `npm run dev` / `npm run build` |
| Checks | `lint-content` 102 files / 0 issues; `audit-content` 0 issues across 23 phases; `audit-lesson-ast` 23 lessons / 0 loss; `audit-readability` 0 of 23 outside target; `test:smoke` 84 renders / 0 failures; production build clean |
| Task IDs | 228 total (IT 66, cyber 162) |
| CI | `.github/workflows/ci.yml` — two jobs on push to `main` and on PRs (D-008); verified green |
| Deploy | `.github/workflows/deploy-pages.yml` — publishes `learning-site/dist` to GitHub Pages (D-009). Builds with `VITE_BASE=/cs-roadmap/` because a project site is served from a subdirectory, and verifies the emitted HTML so an unprefixed build fails rather than deploying a blank page. Netlify (`netlify.toml`) is configured as a fallback and builds from the repository root, since `build:content` reads `career-roadmaps/` one level above the site |
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
- [x] CI runs the content linter, the production build, and the render smoke test on every push and pull request — previously verified green on GitHub (Node 24, `ubuntu-latest`). **The 9 commits pushed on 2026-09-15 have not been confirmed green** — `gh` is not installed locally, so check the Actions tab rather than assuming. Every check CI runs was run locally and passed, so a red build would most likely be environmental.

## Resuming

Read this first.

1. **Check CI on the latest push.** The work is pushed and the working tree is clean, but the run for `b980d11` had not been confirmed when this was written. If it is red, treat it as environmental first — the same checks pass locally.
2. **Rebuild before running the site.** `learning-site/src/data/generated/` is gitignored, so a fresh clone has no lesson JSON until `npm run build:content` (or `npm run dev` / `npm run build`, which both call it) has run.
3. **Run the guards after touching the parser.** `node scripts/audit-lesson-ast.mjs` is the one that matters; see [`WORKFLOW.md`](WORKFLOW.md) → "Guards on the lesson renderer".
4. **Beware inline `node -e` on Windows.** Backticks inside a PowerShell double-quoted string are mangled, which silently corrupts escape-sensitive regexes. Write a throwaway `.mjs` file instead — this cost two wrong measurements in one session.

## Open items

- [ ] **Confirm the CI run for `b980d11` is green.** Not verifiable locally (`gh` is not installed).
- [ ] **Deploy the site.** `.github/workflows/deploy-pages.yml` is written and its base-path guard was tested, but the repository is private: GitHub Pages from a private repo generally needs a paid plan, while Netlify, Vercel, and Cloudflare Pages all deploy private repos on free tiers. `netlify.toml` is already configured as that fallback.
- [ ] **Audit modules 09–14 against the depth standard.** They meet the section contract and every readability target, but have not had the evidence-reading and worked-ticket review that the IT and cyber core phases received.
- [ ] **Assess the IT track's thin phases.** IT word counts range from 6,219 (Phase 7) to 24,723 (Phase 1). Phase 1 is deep because it was the pilot; whether the later phases deserve the same treatment is a judgement call, not an assumption.
- [ ] **Dense paragraphs still exist in the IT track, and in modules 10–14.** The readability audit gates on a per-phase **average**, so individual long paragraphs do not fail it. Measured per paragraph: the IT track has **33 paragraphs over 90 words**, of which **9 exceed 110** — Phase 1 alone has 16, with the worst at 193 words, followed by Phase 3 (6, worst 136) and Phase 5 (5, worst 120). The six new cyber modules add 12 more, worst 162 words in module 13. The cyber core phases 01–08 are cleanest.
- [ ] **Consider gating the audit on per-paragraph density, not just the average.** `audit-readability.mjs` already computes `longest para` but does not fail on it, which is why ~45 dense paragraphs across the repo pass today while every phase reports a healthy average. A ceiling, or a count of paragraphs over 110 words, would make this visible without displacing the average.

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