# Checkpoint

A snapshot of the repository's current state. Update this when a meaningful milestone is reached.

## Current state — 2026-09-11

| Item | Value |
|---|---|
| Branch | `main` |
| HEAD | `chore: add .editorconfig to enforce LF/UTF-8 at save time` |
| Commits | 3 |
| Tracked files | 33 (before this docs batch) |
| Working tree | Clean |
| Line endings | LF everywhere (Windows scripts excepted) |
| Encoding | UTF-8, no BOM |
| Remote | Not configured |
| Build step | None |

## Structure

```text
.
├── .editorconfig
├── .gitattributes
├── .gitignore
├── README.md
├── AGENTS.md
├── CHANGELOG.md
├── docs/
└── career-roadmaps/
    ├── README.md
    ├── it-roadmap/          (13 files)
    ├── cybersec-roadmap/    (14 files)
    └── shared/              (3 files)
```

## Health checks

- [x] All content files recovered byte-for-byte from Git objects.
- [x] No literal `?` substitutes remain except three genuine question marks.
- [x] All files valid UTF-8; no CR bytes.
- [x] `.gitattributes` and `.editorconfig` in place.

## Open items

- [ ] Configure a Git remote and push.
- [ ] Choose whether to add a license.

## How to verify quickly

```powershell
git --no-pager log --oneline -n 5
git --no-pager status --short
git --no-pager ls-files
```