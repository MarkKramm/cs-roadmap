# Session Log

A chronological record of working sessions. Newest first.

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