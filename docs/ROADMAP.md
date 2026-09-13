# Project Roadmap

The roadmap for the **repository itself** (for the study curriculum, see [`../career-roadmaps/`](../career-roadmaps/)).

## Done

- [x] Recover all 29 content files from Git objects after the working tree was emptied.
- [x] Fix encoding corruption (literal `?` where typographic characters belonged).
- [x] Normalize all text to LF via `.gitattributes`.
- [x] Add root `README.md` and `.gitignore`.
- [x] Add `.editorconfig` to enforce UTF-8/LF at save time.
- [x] Add `docs/` meta-documentation, `AGENTS.md`, and `CHANGELOG.md`.
- [x] Add `docs/CONTENT-GUIDE.md`, `docs/FAQ.md`, and `docs/TROUBLESHOOTING.md`.
- [x] Add site-prep specs: `docs/CONTENT-SCHEMA.md` and `docs/DESIGN-SYSTEM.md`.
- [x] Add root `CONTRIBUTING.md`.
- [x] Publish to a Git remote (GitHub) and push `main`.
- [x] Decide on a license — CC BY 4.0.
- [x] Learning Site Milestone M1 — scaffold `learning-site/`, build the content pipeline, add the app shell and dashboard.
- [x] Content linter — `scripts/lint-content.mjs` checks CRLF, BOM, U+FFFD, invalid UTF-8, and stray `?` substitutes.
- [x] Render smoke test — `learning-site/scripts/smoke-render.mjs` renders every page and every phase with real data, catching the class of bug a build cannot.

- [x] Learning Site Milestone M2 — view navigation (D-007), tools library, portfolio tracker, application tracker. Five commits; the render smoke test was extended in the same commit as each new page.
- [x] Tooling hardening — the linter scans `LICENSE`, and `build-content.mjs` fails loudly on a malformed resource line instead of emitting `url: null`.
- [x] CI — `.github/workflows/ci.yml` runs the three checks on every push to `main` and every pull request, as two jobs: content integrity (no install) and learning site (`npm ci`, build, smoke test). Permitted by D-008.
- [x] **Content-depth pilot** — `career-roadmaps/it-roadmap/01-phase-computer-fundamentals.md` deepened with a 4,430-word `## Lesson` section. Markdown-only: no pipeline or renderer change, no new dependency. Pilot judged successful.
- [x] **IT lesson writing, Phases 1–4** — `## Lesson` sections written for Phases 1–4 (4,430 / 4,337 / 3,370 / 6,181 words). Structural repairs made in the same pass:
  - Phase 1: duplicate `## Deliverable` and `## Checklist` removed; orphaned bullets folded into topics; redundant `## Resources` dropped; deprecated `wmic` replaced with `Get-PhysicalDisk`.
  - Phase 2: rebuilt from the Git original to restore the section contract.
  - Phases 3 and 4: lessons were mis-inserted between `## Goal` and `## Estimated time`, `## Estimated time` was duplicated, tasks were stranded under a non-contract `### Hands-on Tasks` heading, and lesson prose had leaked into `## Specific topics`. All fixed.
- [x] **Stranded-task recovery** — Phases 1, 3, and 4 were generating **zero** practice tasks in `it.json` because their tasks sat under `### Hands-on Tasks` rather than the contract heading `## Hands-on practice tasks`. Restoring the heading took the totals from 0/0/0 to 5/8/6. Structural diff against the pre-repair baseline: 75 IDs before and after, zero missing, zero extra, zero count changes.

- [x] **IT lesson writing, Phases 5–9** — `## Lesson` sections written for Phases 5–9 (3,039 / 3,126 / 3,343 / 3,214 / 3,757 words). **No structural repair was required:** all five phases already had clean section order and their Markdown task counts matched the extracted JSON exactly (7 / 6 / 6 / 7 / 7), so this was pure content work. Phases 8 and 9 have no `## Specific topics to learn`, so the lesson was placed after the last structural section (`## Resume sections` and `## PH-friendly job boards` respectively), keeping the order skills → structure → lesson → tools.
- [x] **IT track lesson pass complete** — all nine IT phases carry 3,000+ word `## Lesson` sections. Structural diff against the pre-edit baseline: `it.json` identical, 1,585 lines, zero diffs. A further diff against a scratch worktree at `HEAD` found a regression no earlier check could see: **Phase 4's tools table had lost two rows** (`Microsoft Teams`, `Google Workspace Admin Help`), which had been left stranded mid-lesson and had quietly cut the tools library from 112 tools to 110. Rows restored; tools back to 112. Tool rows carry no IDs, so ID-based comparison was blind to it — see [`WORKFLOW.md`](WORKFLOW.md).

- [x] **Committed the IT lesson pass** — Phases 1–9, the structural repairs, and the doc updates are in. Verified that `HEAD` builds in a scratch worktree and reproduces the working tree byte-for-byte apart from `generatedAt`.
- [x] **Cyber lesson pilot** — `cybersec-roadmap/01-phase-foundations.md` deepened with a 4,965-word `## Lesson` section, written to the IT standard: a "Why this lesson exists" opener, five `### Part N` sections, and closing "Key takeaways" / "Practice this next" that point back at the seven existing tasks. **No structural repair was required** — the phase already had clean section order. The generated JSON is byte-identical to `HEAD`, confirming the lesson is invisible to the pipeline as intended. Pilot judged successful; the format carries over.

- [x] **Cyber lesson, Phase 2** — `cybersec-roadmap/02-phase-networking-and-linux.md` deepened with a 6,841-word `## Lesson` section, the longest in the cyber track. It is the first cyber lesson to need five `### Part N` sections plus the opener, because the phase spans two subject domains (networking depth, then Linux depth) and closes with lab setup and the Bandit learning path. **No structural repair was required** and the generated JSON is byte-identical to `HEAD`.

## Next

- [ ] **Cyber-track lessons, Phases 3–8** — Phases 1 and 2 are done, so six phases remain: security fundamentals, hands-on labs, specialization choice, portfolio projects, certifications, and job application.
- [ ] **Deploy the site** — blocked on the private-repo visibility decision. GitHub Pages from a private repo generally needs a paid plan, but Netlify, Vercel, and Cloudflare Pages all deploy private repos on free tiers, so this is less blocked than it first appeared.

## Later / optional

- [ ] Cyber track site UI for surfacing lessons, if the lessons need to be reachable in the app rather than only in Markdown.

## Explicitly out of scope

- Paid tools or resources that require a budget.
- Anything that adds a runtime dependency to read the content.
- Scope creep that makes the curriculum feel unachievable for a beginner.