# Learning Site

The personal learning site for the [`career-roadmaps/`](../career-roadmaps/) curriculum.

Build tooling is permitted **only** in this directory — see [`docs/DECISIONS.md`](../docs/DECISIONS.md) → D-005. The study content and `docs/` stay dependency-free.

## Stack

React + Vite, plain CSS, no component library, no state-management library. No router — view state is a single string in `App.jsx` (see D-007). Progress, the two trackers, the reader's own notes and the two preferences persist in `localStorage` — **ten keys in total**, all covered by Back up & restore (see D-016, D-019, D-021). No backend, no auth, no database. See D-006.

## Commands

```powershell
cd learning-site
npm install
npm run dev          # local dev server
npm run build        # production build into dist/
npm run preview      # serve the built output
npm run test:smoke   # render every page and phase, fail on a render crash
npm run test:notes   # the notes store, its validator and its merge rule
npm run test:work    # reading the notes back: ordering, id matching, orphans
npm run test:today   # the time-aware picker: band fitting and every reason
npm run lint:content # text-integrity check over the Markdown (needs ../scripts)
```

`npm test` runs the whole guard chain: `test:highlight`, `test:ui`, `test:data`,
`test:notes`, `test:work`, `test:today`, `test:lesson-search`, `test:search` and
`test:smoke`. The content audits (`lint:content`, `audit-content`,
`audit-lesson-ast`, `audit-readability`) live in `../scripts/` and are run from
the repository root.

`npm run build:content` generates `src/data/generated/{it,cyber}.json`, the per-phase lesson files, `search.json` and `shared.json` from the Markdown via [`scripts/build-content.mjs`](../scripts/build-content.mjs) and [`scripts/shared-content.mjs`](../scripts/shared-content.mjs). It runs automatically before `dev` and `build`. The generated files are git-ignored — the Markdown is the single source of truth.

## Status

**M1 complete** — the site renders both tracks from generated JSON, tracks progress in `localStorage` (keyed by stable task IDs), and answers "what should I do today?" with a next-task picker filtered by an energy mode.

**M2 complete** — view navigation (see [`docs/DECISIONS.md`](../docs/DECISIONS.md) → D-007), a tools library over all 191 tools with search and a cost filter, a portfolio tracker, and an application tracker with follow-up dates. The tools library reads the generated JSON; the two trackers store your own entries in `localStorage` under separate keys.

**M3 complete** — a print stylesheet (D-017), in-lesson find (D-018), a notes workspace (D-019), a **Shared** view over `career-roadmaps/shared/` and a **Your work** view that reads every note and answer back (D-020), and a **time-aware dashboard**: tasks carry an authored duration band and the picker asks how long you have (D-021). Bands are estimates, not measurements, and the UI says so.

The site never reads the Markdown directly. `scripts/build-content.mjs` emits JSON and the UI reads only that, per [`docs/CONTENT-SCHEMA.md`](../docs/CONTENT-SCHEMA.md).

## Layout

```text
learning-site/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                      entry point
    ├── App.jsx                       shell, view state, sidebar
    ├── data/
    │   ├── roadmaps.js               loads the generated JSON
    │   ├── tools.js                  flattens tools, maps cost to a badge
    │   └── generated/                build output (git-ignored)
    ├── hooks/
    │   ├── useProgress.js            task progress in localStorage
    │   ├── useEnergyMode.js          energy preference in localStorage
    │   ├── useTimeBudget.js          how long the reader has today
    │   ├── usePortfolio.js           portfolio entries in localStorage
    │   ├── useApplications.js        job applications in localStorage
    │   └── useNotes.js               the reader's own notes and answers
    ├── lib/
    │   ├── today.js                  the time-aware picker (pure, no React)
    │   └── yourWork.js               reads the notes back (pure, no React)
    ├── components/
    │   ├── ProgressBar.jsx
    │   ├── PhaseCard.jsx
    │   ├── ChecklistItem.jsx
    │   ├── ToolCard.jsx
    │   ├── EmptyState.jsx
    │   ├── EnergyModeSelector.jsx
    │   ├── TimeBudgetSelector.jsx    how long you have, with the estimate note
    │   ├── NotesPanel.jsx            the reader's workspace for a phase
    │   └── TaskList.jsx              practice tasks, with an answer box
    ├── pages/
    │   ├── Dashboard.jsx
    │   ├── PhaseDetail.jsx
    │   ├── ToolsLibrary.jsx
    │   ├── Portfolio.jsx
    │   ├── Applications.jsx
    │   ├── Shared.jsx                the shared strategy documents
    │   └── YourWork.jsx              every note and answer, in one place
    └── styles/
        ├── tokens.css                design tokens (docs/DESIGN-SYSTEM.md)
        └── global.css                base styles
```

Verification lives in [`scripts/smoke-render.mjs`](scripts/smoke-render.mjs): it renders every phase and every page with real data. A component whose props do not match its call site still compiles, so `vite build` alone would not catch that class of bug — the smoke test is what does.

## Conventions

Same as the repository: LF line endings, UTF-8 without BOM, no ASCII substitutes for typographic characters. See [`docs/WORKFLOW.md`](../docs/WORKFLOW.md).