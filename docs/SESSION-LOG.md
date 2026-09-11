# Session Log

A chronological record of working sessions. Newest first.

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

**Next:**
- Configure a Git remote and push `main`.
- Decide on a license.