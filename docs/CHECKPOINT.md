# Checkpoint

A snapshot of the repository's current state. Update this when a meaningful milestone is reached.

## Current state — 2026-09-11

| Item | Value |
|---|---|
| Branch | `main` |
| HEAD | `fe04ed3 docs: record the CI session across checkpoint, roadmap, and changelog` |
| Commits | 33 |
| Tracked files | 81 |
| Working tree | Clean, in sync with `origin/main` |
| Line endings | LF everywhere (Windows scripts excepted) |
| Encoding | UTF-8, no BOM |
| Remote | `origin` → https://github.com/MarkKramm/cs-roadmap |
| Visibility | Private — not publicly reachable |
| License | CC BY 4.0 |
| Build step | `learning-site/` — React + Vite. `npm run dev` / `npm run build` |
| Checks | `npm run lint:content`, `npm run build`, `npm run test:smoke` — all passing |
| CI | `.github/workflows/ci.yml` — two jobs on push to `main` and on PRs (D-008) |
| Milestone | M2 complete — tools library, portfolio tracker, application tracker |

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
├── learning-site/           (React + Vite; 5 pages, 7 components, 5 hooks;
│                             generated/ and dist/ ignored)
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
- [x] `lint-content.mjs` passes — 80 files, 0 issues. (`LICENSE` is scanned; it is extensionless, so it is matched by name.)
- [x] `ToolCard` renders tool data; the M1 crash on opening a phase is fixed.
- [x] `test:smoke` now covers every page as well as every phase — 31 renders.
- [x] Tools library lists all 112 tools with search and cost/track filters.
- [x] Portfolio and application trackers persist under their own `localStorage` keys.
- [x] CI runs the content linter, the production build, and the render smoke test on every push and pull request.

## Open items

- [ ] Deploy the site — blocked on the private-repo visibility decision. GitHub Pages from a private repo generally needs a paid plan, but Netlify, Vercel, and Cloudflare Pages all deploy private repos on free tiers, so this is less blocked than it first appeared.

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