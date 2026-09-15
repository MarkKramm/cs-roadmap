# Decisions

A lightweight decision log (ADR-style). Newest first.

## D-012 — Lesson bodies are emitted per phase and loaded on demand

- **Date:** 2026-09-15
- **Status:** Accepted
- **Context:** D-011 added the lesson body to the generated JSON. Measured afterwards, the lesson region is 84–95% of every phase file, and its JSON totals roughly 1.6 MB across both tracks. Because `src/data/roadmaps.js` imported the track files statically, Vite inlined all of it: the JS bundle went from 265 KB to 1.96 MB, so a reader who opened the dashboard downloaded the entire curriculum before seeing anything.
- **Decision:** Keep the track index files small (goal, skills, checklist, tools — about 200 KB total) and emit each lesson as its own file at `generated/lessons/<phase-id>.json`. The site loads one with a dynamic `import()` in `src/hooks/useLesson.js`, keyed by `phase.lessonPath` carried on the phase record, and caches per phase id in memory. The phase record also carries `lessonBlockCount` and `lessonHeadingCount` so the dashboard can describe a lesson without fetching it.
- **Consequences:** The initial bundle returns to ~340 KB and each lesson becomes a 30–170 KB chunk fetched when its phase is opened. This is the first split point in the app; a reader who never opens a phase never downloads a lesson. The cost is a loading state and an error state in `PhaseDetail`, and the requirement that `build-content.mjs` runs before the site is served — already true, since `dev` and `build` both call it. Vite needs a literal `import.meta.glob` pattern to discover the files, so the path is templated rather than computed.

## D-011 — The site renders the lesson body, not just the structured sections

- **Date:** 2026-09-15
- **Status:** Accepted
- **Context:** `build-content.mjs` originally extracted goal, skills, topics, tools, tasks, checklist, and exit criteria — and dropped the `## Lesson:` region entirely. Measured per phase that region is 84–95% of the file, so the site was showing roughly a tenth of the curriculum: a checklist *about* a lesson rather than the lesson. The prose, the worked examples, and the tables were reachable only through a link to GitHub.
- **Decision:** Parse the lesson region into a block AST at build time with `scripts/lesson-ast.mjs`, and render it in the site with `components/Lesson.jsx` and `components/LessonBlock.jsx`, behind a table of contents built from the lesson's `###`/`####` headings. The Markdown stays the single source of truth; the AST is a build artifact like the rest of the JSON. No Markdown dependency is added — the parser supports the subset the curriculum actually uses, which was measured across all 18 phases before being written.
- **Consequences:** The site is now a reader for the curriculum rather than an index of it. Two guards protect the new path, because a parser bug does not crash anything — it just makes content vanish: `audit-lesson-ast.mjs` compares every lesson's AST against its source with markup stripped and fails on any loss or unrecognised construct, and `build-content.mjs` fails the build when the parser reports an unhandled construct. `smoke-render.mjs` renders the lesson for every phase and asserts that tables, code blocks, and headings all appear and that no literal `**` or backtick reaches rendered prose. Inline formatting needed one addition: the curriculum writes bold containing code (``**`/etc`**``), so `renderInline.jsx` now recurses into bold and italic runs instead of a single-pass alternation.

## D-010 — The sidebar is viewport-pinned, and becomes a drawer on small screens

- **Date:** 2026-09-15
- **Status:** Accepted
- **Context:** `.app-shell` is a flex row and `.sidebar` had no height or position constraint, so the sidebar stretched to the full document height and scrolled away with the page. On a long phase the reader had to scroll back to the top to navigate. Below 720px the sidebar also stacked above the content, which pushed the page down and left the nav no closer.
- **Decision:** Give the sidebar `position: sticky; top: 0; height: 100vh; overflow-y: auto` so it stays pinned and scrolls independently. Below 860px, replace the stacked layout with an off-canvas drawer: fixed, translated off-screen, opened by a hamburger button in a sticky topbar, and closed by the backdrop, the close button, or Escape. Background scroll locks while it is open and the open phase is scrolled into view in the list.
- **Consequences:** The nav is reachable from any scroll position. The drawer adds one piece of state to `App.jsx` and needs Escape handling and scroll locking to avoid trapping the page behind an overlay — both are in place. View changes now reset scroll to the top, which also fixes opening a phase at the previous page's scroll offset.

## D-009 — Publishing the site to GitHub Pages, and the base path that makes it work

- **Date:** 2026-09-15
- **Status:** Accepted
- **Context:** D-008 permitted CI but ruled deployment out of scope and noted that "publishing the site would need a decision of its own." This is that decision. The site is a static Vite build, so it can be hosted anywhere; the constraint that shapes the rest is that GitHub Pages serves a *project* site from a subdirectory of a shared domain — `https://markkramm.github.io/cs-roadmap/` — rather than from a domain root.
- **Decision:** Publish the site to GitHub Pages from a dedicated `.github/workflows/deploy-pages.yml` workflow. Because the site is served from a subdirectory, `learning-site/vite.config.js` reads `process.env.VITE_BASE` and falls back to `/`, and the Pages build sets `VITE_BASE=/cs-roadmap/`.
- **Consequences:** Rule 3 in `AGENTS.md` gains a third bounded carve-out: `.github/workflows/` may now contain a deploy step, but only to GitHub Pages, and only for the built site. The content stays dependency-free — the deploy publishes generated output and adds nothing that reading `career-roadmaps/` depends on. Vite emits absolute asset URLs, so without the prefix the published page loads blank and every `/assets/...` request 404s; the workflow therefore *verifies* the emitted HTML and fails the build if the prefix is missing, rather than trusting the environment variable. Hard-coding the prefix was rejected because it would break `npm run dev`, `vite preview`, and the Netlify build, all of which serve from a root. Netlify is left working and unchanged as a fallback host.

## D-008 — CI is permitted, deploy is not

- **Date:** 2026-09-11
- **Status:** **Superseded by D-009** for the deploy question only; the CI carve-out still stands as written.
- **Context:** The roadmap's remaining Next item is CI — run `lint:content`, `build`, and `test:smoke` on every push. A GitHub Actions workflow lives at `.github/workflows/`, which is outside the `learning-site/` + `scripts/` scope that D-005 permits under rule 3 of `AGENTS.md`. The rule blocks the workflow file even though CI adds no runtime dependency to the content.
- **Decision:** Permit `.github/workflows/` **solely for continuous integration** — linting, building, and smoke-testing the repository on push and on pull request. No deploy step, no publishing, no secrets, no credentials. Deployment stays out of scope.
- **Consequences:** Rule 3 in `AGENTS.md` gains a second explicit, bounded carve-out. The dependency-free guarantee survives intact, because CI *checks* the content rather than becoming a dependency of reading it — `career-roadmaps/` and `docs/` are still readable with just `git` and a text editor. A future contributor knows CI is allowed and deployment is not; publishing the site would need a decision of its own. **That decision is D-009.**

## D-007 — View navigation is local state, not a router

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** M2 adds three destinations (tools library, portfolio tracker, application tracker) alongside the dashboard and the per-phase detail view. D-006 left routing open. The site is a single-user local tool: no server, no shareable URLs, no deep links, no analytics. A router would add a dependency and a URL surface to solve problems this tool does not have.
- **Decision:** Keep navigation in `App.jsx` as a single `view` string — `dashboard` | `phase` | `tools` | `portfolio` | `applications` — alongside the existing `trackId` and `openPhaseId`. No router dependency.
- **Consequences:** No new dependency. The browser's back and forward buttons do not move between views; the sidebar and the in-page Back button are the only navigation, which is why both stay visible on every view. If deep links are ever wanted, the switch in `App.jsx` is the single seam to replace — no component below it needs to change.

## D-006 — Learning site is built with React and Vite

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** Milestone M1 (see [`ROADMAP.md`](ROADMAP.md)) needs a UI with real interactive state: per-task checkboxes, progress computation, energy-mode filtering, and a daily-task recommendation. A hand-written DOM layer would grow quickly and slow iteration.
- **Decision:** Build the learning site with React and Vite under `learning-site/`, scoped by D-005. Plain CSS, no component library, no state-management library. Progress persists in `localStorage`. There is no backend, no auth, and no database.
- **Consequences:** `learning-site/` gains `package.json` and a build step. The study content and `docs/` stay dependency-free, so the rest of the repository is unaffected. Framework-specific choices (routing, icon set, animation) remain open.

## D-005 — Scoped build-tooling exception for the future learning site

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** Rule 3 in `AGENTS.md` forbids build tooling repo-wide. A personal learning site (see [`ROADMAP.md`](ROADMAP.md) → Learning Site M1) will need a bundler and a `package.json`.
- **Decision:** Permit build tooling **only** under `learning-site/` (and `scripts/` for content tooling). The rest of the repository stays build-free, so `career-roadmaps/` and `docs/` remain readable with just `git` and a text editor.
- **Consequences:** Rule 3 in `AGENTS.md` is amended with explicit scope. Future contributors know the exception is bounded.
- **Amended by:** D-008 (a second, check-only carve-out for `.github/workflows/`).

## D-004 — Add `.editorconfig` alongside `.gitattributes`

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** `.gitattributes` normalizes line endings at Git time, but files can still be written with CRLF on disk by the editor, causing repeated churn.
- **Decision:** Add `.editorconfig` so compliant editors save UTF-8/LF by default. Windows-native scripts keep CRLF.
- **Consequences:** Two layers of protection; contributors get correct behavior automatically.

## D-003 — Keep the repository build-free

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** The content is plain Markdown. A static-site generator was considered but would add dependencies and a toolchain.
- **Decision:** Ship content only. No `package.json`, no bundler. A site, if ever built, must be a separate opt-in.
- **Consequences:** Maximum portability and zero setup cost; less flashy presentation.
- **Amended by:** D-005 (build tooling scoped to `learning-site/` + `scripts/`) and D-008 (CI under `.github/workflows/`). The content itself stays build-free.

## D-002 — Standardize on UTF-8 (no BOM) with real typographic characters

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** A lossy UTF-8→ASCII conversion had replaced em-dashes, en-dashes, curly quotes, and box-drawing characters with literal `?`.
- **Decision:** Require UTF-8 without BOM and real typographic characters; document the mapping in [`WORKFLOW.md`](WORKFLOW.md).
- **Consequences:** Content reads correctly everywhere; contributors must avoid ASCII substitutes.

## D-001 — Normalize all text files to LF

- **Date:** 2026-09-11
- **Status:** Accepted
- **Context:** Mixed CRLF/LF caused whole-file diffs and obscured real changes.
- **Decision:** `* text=auto eol=lf` in `.gitattributes`; CRLF reserved for `.bat`, `.cmd`, and PowerShell scripts.
- **Consequences:** Clean, reviewable diffs.