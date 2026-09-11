# Checkpoint

A snapshot of the repository's current state. Update this when a meaningful milestone is reached.

## Current state — 2026-09-11

| Item | Value |
|---|---|
| Branch | `main` |
| HEAD | `8adfd58 docs: mark site-prep specs as implemented` |
| Commits | 21 |
| Tracked files | 73 |
| Working tree | Clean, in sync with `origin/main` |
| Line endings | LF everywhere (Windows scripts excepted) |
| Encoding | UTF-8, no BOM |
| Remote | `origin` → https://github.com/MarkKramm/cs-roadmap |
| Visibility | Private — not publicly reachable |
| License | CC BY 4.0 |
| Build step | `learning-site/` — React + Vite. `npm run dev` / `npm run build` |
| Checks | `npm run lint:content`, `npm run build`, `npm run test:smoke` — all passing |
| Milestone | M1 complete — site renders both tracks, tracks progress, picks a daily task |

The HEAD and count above describe the last commit before this file's own
commit — a checkpoint cannot contain its own hash. For the exact current
state, run `git --no-pager log --oneline -n 1`.

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
├── scripts/                 (content tooling)
├── learning-site/           (React + Vite; generated/ and dist/ ignored)
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
- [x] `lint-content.mjs` passes — 72 files, 0 issues.
- [x] `test:smoke` passes — 26 renders across 17 phases and 112 tools.
- [x] `ToolCard` renders tool data; the M1 crash on opening a phase is fixed.

## Open items

- [ ] Learning Site Milestone M2 — scope to be defined at kickoff (tools library, portfolio tracker, application tracker).

## How to verify quickly

```powershell
git --no-pager log --oneline -n 5
git --no-pager status --short
git --no-pager ls-files
node scripts/lint-content.mjs          # content integrity
cd learning-site
npm run build                          # production build
npm run test:smoke                     # render every phase with real data
```