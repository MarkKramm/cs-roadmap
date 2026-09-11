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

## Checklist before committing

- [ ] File is LF (no CR bytes) unless it is a Windows-native script.
- [ ] File is UTF-8 without BOM.
- [ ] Typographic characters are real, not `?` substitutes.
- [ ] `git status --short` is clean after committing.