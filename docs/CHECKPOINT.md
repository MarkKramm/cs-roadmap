# Checkpoint

A snapshot of the repository's current state. Update this when a meaningful milestone is reached.

## Current state — 2026-09-11

| Item | Value |
|---|---|
| Branch | `main` |
| HEAD | `chore: add CC BY 4.0 license and fix CHANGELOG links` |
| Commits | 8 |
| Tracked files | 49 |
| Working tree | Clean |
| Line endings | LF everywhere (Windows scripts excepted) |
| Encoding | UTF-8, no BOM |
| Remote | `origin` → https://github.com/MarkKramm/cs-roadmap (pushed, in sync) |
| License | CC BY 4.0 |
| Build step | None (React + Vite pending under `learning-site/`) |

## Structure

```text
.
├── .editorconfig
├── .gitattributes
├── .gitignore
├── README.md
├── AGENTS.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
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
- [x] Remote configured and `main` pushed.

## Open items

- [ ] Learning Site Milestone M1 — scaffold, content pipeline, app shell, dashboard.

## How to verify quickly

```powershell
git --no-pager log --oneline -n 5
git --no-pager status --short
git --no-pager ls-files
```