# Decisions

A lightweight decision log (ADR-style). Newest first.

## D-015 — The shell centres, and the dashboard gets a reference rail

- **Date:** 2026-09-15
- **Status:** Accepted
- **Context:** With the reader affordances in place (D-014), the dashboard's remaining defect was visible before anything was read: on a 1,919px viewport it filled the left half and left the right half empty. Two causes, and they were separate.
  1. `.content` was capped at `--content-wide` (1,100px) and **left-aligned** against the sidebar. Even a page that wanted the width could not use it, and the dead band was a property of the shell, not of any page.
  2. The dashboard itself was a single column of cards. Nothing in it was wrong, but nothing in it was wide either — and the figures a reader actually checks (how far in, how long left, what is ready) were either absent or buried in prose.
  This matters more here than on a typical site because the curriculum is 34–112 weeks long. A reader returns for years; the page that answers "what should I do today" is the page they see most, and it was the least informative one.
- **Decision:** Two changes.
  1. **The shell centres and widens.** `--content-max` (1,400px) replaces `--content-wide` as the outer cap, applied with `margin-inline: auto`. `--content-wide` remains the cap for the one element allowed past the reading measure (tables). Centring is right here and left-alignment was not: every page is a column of cards, so the fix belongs to the shell.
  2. **The dashboard becomes two columns above 1,180px** — content plus a sticky **reference rail** carrying the progress ring, the plan's dates, three read-only readiness counts, and the next two phases. Phase cards also tile two-up once there is width for two honest cards.
- **Consequences:** The rail is the part that needs a boundary, and it has one. It is a reference column, not a second dashboard: no charts, no streaks, no leaderboards, per the anti-patterns in [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md). Its only interactive elements are links to the page that owns each figure, and every count is phrased as "you have N" rather than "you are missing N".
  - **A rail that owns state would be a second source of truth.** The plan's dates come from `readStarts()`, the counts from `readPortfolio()` and `readApplications()` — plain reads, deliberately **not** the hooks. Two live copies of one `localStorage` key drift, and the stale one writing back would drop a record the reader just added on the page that owns it. The dashboard remounts on every view change, so a read at mount is correct; the hooks keep their subscribing behaviour for the pages that mutate.
  - **`fmtWeeks` and `fmtDate` moved into [`lib/pace.js`](../learning-site/src/lib/pace.js).** The rail and the Schedule page report the same numbers, and two copies of a formatter round them two different ways. `fmtDate` parses and formats as UTC, because formatting a UTC midnight in local time renders the previous day anywhere west of Greenwich — which turns a planned finish date into a wrong one.
  - **The ring is a chart, so it obeys the rule charts obey here.** The percentage and the raw count are rendered as text beside it; the `svg` carries a label rather than being silent; and it animates nothing. A non-numeric or out-of-range value clamps instead of reaching the dash arithmetic as `NaN`, which would render as no arc at all, silently — both cases are now asserted.
  - **Nothing is hidden at a narrow width.** Below the breakpoint the rail lays out as cards under the main column, in the same order. This is a reflow, not a truncation, and the 560px phone layout is unchanged apart from the phase grid dropping to one column.
  - **The main bundle grew by 4 KB raw / 0.7 KB gzipped** — 398 KB and 117.7 KB — because the ring and the rail add code and no dependencies. The search index is untouched.

## D-014 — Progress has two axes, and a phase remembers where you were

- **Date:** 2026-09-15
- **Status:** Accepted
- **Context:** The site renders each lesson body in full (D-011) and ships it as its own file loaded on demand (D-012). Measurement afterwards exposed the shape of a problem that had been invisible while the lessons were only on GitHub: a lesson is **84–95% of its phase file**, IT Phase 1 alone has 66 `###`/`####` subheadings, and the longest runs ~15,500 words. Against that, the only completion signal in the application was the phase checklist — 7–19 items sitting **below** the lesson. A reader four hours into a lesson had no way to record that they had finished the section they were reading, no sense of how far in they were, and no way back to where they stopped. Meanwhile the phase page ended after its exit criteria with **nothing after it**: on a 9–14 phase track whose whole point is sequence, there was no "next" anywhere in the UI, and the only route to the following phase was to scroll to the top and aim at the sidebar.
- **Decision:** Three separate pieces of state, kept deliberately apart.
  1. **Lesson section state** ([`hooks/useLessonProgress.js`](../learning-site/src/hooks/useLessonProgress.js)), keyed by the heading id the lesson parser already emits and namespaced by phase id — `it-01#part-7`. Persisted under its own key, `cs-roadmap:lesson-sections:v1`.
  2. **Reading position** ([`hooks/useReadingState.js`](../learning-site/src/hooks/useReadingState.js)), recording the last phase opened and, per phase, the last heading on screen, under `cs-roadmap:reading:v1`.
  3. **Schedule start date** ([`hooks/useSchedule.js`](../learning-site/src/hooks/useSchedule.js)), one date per track, under `cs-roadmap:schedule:v1`.
  Navigation is derived, not stored: [`data/roadmaps.js`](../learning-site/src/data/roadmaps.js) gained `neighbours(track, phaseId)`, which reads the phase array's order rather than parsing titles.
- **Consequences:** The application gains a reason to distinguish *reading* from *completing*, and the distinction is enforced structurally rather than by convention — three storage keys, three labels, two counters on a phase page that never merge. This is the part worth recording, because the easy version of this feature is one progress bar, and one progress bar would make one of the two numbers lie: either section ticks would inflate the phase completion test the exit criteria depend on, or finishing a phase would silently discard the reader's place in a lesson.
  - **A heading id is the identity, and it derives from the heading text.** Rewording a heading retires its state rather than mis-attributing it — the same rule the checklist IDs follow ([`CONTENT-SCHEMA.md`](CONTENT-SCHEMA.md) → Checklist task IDs). A scroll offset was rejected for the same reason: an offset into content that can be regenerated is a number with no meaning after the next content edit.
  - **"Reset progress" does not clear reading state.** The button says "Reset all progress" and the reader means the checklist. Deleting their place in a lesson they were halfway through would be a surprise the label did not warn about.
  - **The resume prompt suggests and waits.** Nothing jumps on load. A reader who deliberately scrolled to the top has said something by doing so.
  - **The reading bar measures the lesson, not the page.** A document-scoped bar would count the checklist, tools, tasks, deliverable and exit criteria as reading, and would report a reader halfway through a lesson as a fraction of the whole page.
  - **A keyboard shortcut must not be able to change saved state.** Navigation, search and view switching are bound; checkbox toggling is not, and that omission is a decision rather than an oversight.
  - **`test-ui.mjs` was added because none of the existing guards could see any of this.** `smoke-render.mjs` runs no effects and no handlers, so it cannot observe a shortcut that never fires, a pace figure wrong by a week, or two phases colliding on a section key — and a collision would render a tick in one phase as a tick in another, which is invisible in every screenshot and every render assertion. The section-key namespacing has its own test for exactly that reason.

## D-013 — Search uses a build-time inverted index, not the lesson text

- **Date:** 2026-09-15
- **Status:** Accepted
- **Context:** With 23 lessons rendering in the site, reaching a specific answer meant browsing — the sidebar gets you to a phase, not to the paragraph. Full-text search was the obvious next step, but the naive implementation is a trap here. The lesson JSON is 1.7 MB and is deliberately loaded one file at a time (D-012); an index that stored segment text was **measured** at 1,438 KB raw / **473 KB gzipped**, because it duplicated every lesson. An average lesson gzips to about 16 KB, so that index cost the reader roughly thirty lessons' worth of download for a feature used occasionally — the wrong trade for an audience on modest connections, which is exactly who this curriculum targets. A second attempt, windowing long segments with overlap to improve snippets, was also measured and made it **worse** (1,438 KB to 1,501 KB), because the overlap duplicated text.
- **Decision:** Emit an inverted index — term to segment id — and no prose. `scripts/search-index.mjs` builds it at build time into `generated/search.json`; `hooks/useSearch.js` fetches it once, lazily, on the reader's first search, and renders snippets from the lesson file the site already downloads when a phase is opened. Segments are cut at `###`/`####` headings, which lands a result on roughly a screenful and gives every hit a natural title. Postings are delta-encoded in base36 against document order. The index measures **471 KB raw / 180 KB as a delivered chunk**, and `index.html` does not reference it — the main bundle is unchanged at 105 KB gzipped, so a reader who never searches pays nothing.
- **Consequences:** The site gets search without undoing D-012. Three defects were found by testing the index against the query engine rather than by reading either one, and all three produced *silent* wrongness — a search box that returns nothing or the wrong thing without erroring:
  - **Pruned common terms.** Terms appearing in more than 20% of segments were originally *deleted* to save space. Since a query is an AND over its terms, one deleted term made the whole query return zero results: `"user account locked"` found nothing because `user` was gone. Common terms are now kept and flagged, so the engine matches them but does not let them narrow the result set, and the UI says which words it ignored.
  - **Punctuation glued into terms.** A sentence ending `"...was timestomped."` indexed the term with the period attached, so `timestomped.` and `timestomped` were different entries. Trailing separators are now stripped; interior punctuation is kept, because `get-adprincipalgroupmembership` and `page_fault_in_nonpaged_area` are exactly what a reader pastes in.
  - **Exact matches suppressed broader ones.** Searching `timestomping` matched only that exact term (modules 10 and 12) and never consulted the stem that would also have found module 11's `timestomped` — so typing *more precisely* returned *fewer* results. Exact and prefix matches are now collected separately and scored in tiers, with an exact-match bonus. Simply merging them was also wrong in the other direction: `STAR` exactly matches the interview method but also prefixes `start`, `startup` and `starved` (227 segments across all 23 lessons), and a merged set drowned the lesson that actually teaches STAR.
  - `learning-site/scripts/test-search.mjs` guards all three, plus ID range and ordering, empty and nonsense queries, and that every result points at a lesson file that exists. Like the lesson parser, a search bug does not crash the page — it just returns the wrong answer — so the guard has to assert on known-correct hits rather than on the absence of exceptions.

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
- **Amended by D-014:** the view list gained `schedule`, and keyboard shortcuts now reach every view — but navigation is still local state, and the browser's back button still does not move between views. D-014 added a second, complementary route through the content (`j`/`k` between phases, `g d` and `g s` between views) rather than a URL surface.

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