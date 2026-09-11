# Workflow

How to make changes safely in this repository.

## Prerequisites

See [`SETUP.md`](SETUP.md). In short: Git plus any editor that reads `.editorconfig`.

## The change loop

1. **Edit** the relevant Markdown file.
2. **Check line endings and encoding** (see below) — this is the step that prevents the corruption this repo already recovered from once.
3. **Stage and review:** `git add -A` then `git --no-pager diff --cached`.
4. **Commit** with a conventional prefix: `docs:`, `chore:`, or `fix:`.
5. **Verify** the tree is clean: `git status --short`.

## Line-ending and encoding rules

These are enforced two ways:

- `.gitattributes` normalizes on the Git side (index and checkout).
- `.editorconfig` normalizes on the editor side (on save).

If a file still arrives with CRLF on disk, re-materialize it from Git:

```powershell
Remove-Item -Force <file>
git checkout -- <file>
```

To audit a file's raw bytes on Windows PowerShell:

```powershell
$b = [System.IO.File]::ReadAllBytes('<file>')
($b | Where-Object { $_ -eq 13 }).Count   # CR count; should be 0 for text files
```

## Typographic characters

Use real characters, not ASCII substitutes:

| Instead of | Use |
|---|---|
| `?` or `--` for a break | `—` (em-dash, U+2014), ` ? ` → ` — ` |
| `-` between numbers | `–` (en-dash, U+2013), e.g. `3–6 months` |
| `"..."` for quoted UI text | `“ ”` (curly quotes, U+201C/U+201D) |
| `???` for tree branches | `├──` / `└──` (U+251C / U+2514 + U+2500) |

## Commit message conventions

- `docs:` — content or documentation changes.
- `chore:` — tooling, config, housekeeping.
- `fix:` — corrections to broken content or formatting.

Keep the subject line imperative and under ~72 characters.

## Linting

Run the text-integrity linter before committing content or docs:

```powershell
node scripts/lint-content.mjs
```

It flags CRLF, UTF-8 BOM, U+FFFD replacement characters, invalid UTF-8, and ASCII `?` standing in for typographic characters. Exit code is non-zero on any issue, so it can gate a commit. It does not rewrite files — repair procedures are in [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md).

Note: when creating a new file, the editor in this environment has repeatedly written CRLF and, once, a U+FFFD pair. Run the linter after creating any file. If it reports CRLF, normalize with the `Remove-Item` + `git checkout --` recipe above, or a direct UTF-8 rewrite for untracked files.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and every pull request. It has two jobs, split so a content typo fails fast without paying for a dependency install:

| Job | What it runs | Working directory |
|---|---|---|
| Content integrity | `node scripts/lint-content.mjs` | repository root |
| Learning site | `npm ci` → `npm run build` → `npm run test:smoke` | `learning-site/` |

Both jobs use Node 24, matching the local toolchain. The workflow is check-only: it does not deploy, publish, or touch secrets — see [`DECISIONS.md`](DECISIONS.md) → D-008. To reproduce it locally, run the commands under "How to verify quickly" in [`CHECKPOINT.md`](CHECKPOINT.md).

## Checklist before committing

- [ ] `node scripts/lint-content.mjs` reports no issues.
- [ ] File is LF (no CR bytes) unless it is a Windows-native script.
- [ ] File is UTF-8 without BOM.
- [ ] Typographic characters are real, not `?` substitutes.
- [ ] `git status --short` is clean after committing.