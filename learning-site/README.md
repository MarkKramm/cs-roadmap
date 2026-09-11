# Learning Site

The personal learning site for the [`career-roadmaps/`](../career-roadmaps/) curriculum.

Build tooling is permitted **only** in this directory — see [`docs/DECISIONS.md`](../docs/DECISIONS.md) → D-005. The study content and `docs/` stay dependency-free.

## Stack

React + Vite, plain CSS, no component library, no state-management library. Progress persists in `localStorage`. No backend, no auth, no database. See D-006.

## Commands

```powershell
cd learning-site
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the built output
```

`npm run build:content` generates `src/data/generated/{it,cyber}.json` from the Markdown via [`scripts/build-content.mjs`](../scripts/build-content.mjs). It runs automatically before `dev` and `build`. The generated files are git-ignored — the Markdown is the single source of truth.

## Layout

```text
learning-site/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          entry point
    ├── App.jsx           app shell
    └── styles/
        ├── tokens.css    design tokens (docs/DESIGN-SYSTEM.md)
        └── global.css    base styles
```

## Status

Milestone M1, Step 1: scaffold only. Navigation, phase rendering, and the dashboard are Steps 3–4. The site does not read the Markdown directly — a build script will emit JSON and the UI will read only that, per [`docs/CONTENT-SCHEMA.md`](../docs/CONTENT-SCHEMA.md).

## Conventions

Same as the repository: LF line endings, UTF-8 without BOM, no ASCII substitutes for typographic characters. See [`docs/WORKFLOW.md`](../docs/WORKFLOW.md).