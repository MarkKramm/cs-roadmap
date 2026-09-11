# Session Log

A chronological record of working sessions. Newest first.

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