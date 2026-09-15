# Design System

Visual and interaction tokens for the personal learning site.

**Status: implemented.** Token values live in [`learning-site/src/styles/tokens.css`](../learning-site/src/styles/tokens.css); base styles in `global.css`; components in `learning-site/src/components/`. This document is the design reference — the CSS is authoritative for values.

## Purpose

The site exists to answer one question at a glance:

> What should I do today?

Everything else — navigation, filters, progress bars, tools library — supports that question. No feature earns a place if it does not make the next action clearer.

## Design principles

1. **One next action.** The dashboard's primary element is a single recommended task, not a wall of options.
2. **Progress is visible.** Completed items are obviously complete. Nothing requires opening a menu to see whether you are moving.
3. **Low friction on check.** A checkbox saves immediately. No "save" button, no confirmation dialog.
4. **Calm by default.** Dark-first, low-contrast backgrounds, no flashing, no red alarms except for real blockers.
5. **Mobile-usable.** Most study happens on a laptop, but reading a task on a phone should not require pinch-zoom.

## Color tokens

Dark-first. Names are semantic; concrete hex values land at implementation.

| Token | Role |
|---|---|
| `--bg` | Page background |
| `--bg-elevated` | Cards, panels |
| `--bg-subtle` | Hover states, secondary surfaces |
| `--border` | Dividers, input outlines |
| `--text` | Primary text |
| `--text-muted` | Secondary text, metadata |
| `--accent` | Primary actions, active nav |
| `--accent-hover` | Accent hover state |
| `--success` | Completed checklist items, positive progress |
| `--warning` | Buffer weeks, "consider pausing" hints |
| `--danger` | Errors, blockers only |

Rule: never rely on color alone to convey state. Completed items also get a strikethrough or a check glyph.

## Spacing scale

Powers of the base unit. Use only these values.

```text
--space-1:  4px
--space-2:  8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-7: 48px
--space-8: 64px
```

## Type scale

```text
--text-xs:   12px   metadata, labels
--text-sm:   14px   body secondary
--text-base: 16px   body
--text-lg:   18px   lead paragraphs
--text-xl:   20px   card titles
--text-2xl:  24px   section headings
--text-3xl:  30px   page titles
```

Line height: 1.5 for body, 1.25 for headings.

Font: system stack. No web fonts — the site must work offline and load instantly.

## Component inventory

Named so the same name survives across frameworks.

### `<ProgressBar percentage={n} />`

Horizontal bar. Shows track progress (phase-level) or overall progress. Label shows the percentage as text, not just visually.

### `<PhaseCard phase={...} />`

Summary card for one phase: title, duration, progress, short goal. Click opens the phase detail.

### `<TaskCard task={...} />`

One checklist item. Includes a checkbox, the task text, and an optional energy hint (`low` / `normal` / `high`).

### `<ToolCard tool={...} />`

One tool from the tools table: name, purpose, cost badge, mini-task, free alternative, official link.

### `<ChecklistItem item={...} />`

Lower-level than `TaskCard` — used inside the phase detail. Saves on toggle.

### `<EnergyModeSelector mode={...} />`

Radio group: `Low` / `Normal` / `High`. Changes which tasks appear in the daily picker.

### `<EmptyState message={...} />`

Shown when a list is empty (no applications yet, no artifacts yet). Always suggests a next action, never just "nothing here".

### `<PhaseNav prev={} next={} variant="full"|"compact" />`

Previous/next phase navigation, rendered twice per phase: a compact strip beside Back, and a pair of cards at the bottom. At a track boundary the control stays visible and **says which boundary it is** — a vanished control reads as a rendering bug, so "This is the first phase" is a state, not an absence.

### `<LessonToolbar doneCount total tickMode size />`

Section progress, a tick-mode toggle, and the reading-size control. Sticky under the topbar so it stays reachable inside a 15,000-word lesson. Section progress is deliberately a **different number** from the phase checklist below the lesson; the two are labelled differently and stored separately, because conflating them would make one of them lie.

### `<ReadingBar fraction />` / `<ResumePrompt section firstSectionId />`

The reading-position strip and the "you were reading X" prompt. The bar measures the **lesson region**, not the document — most of a phase page is scaffolding below the lesson, so a document-scoped bar under-reports depth through the material badly. It is `aria-hidden`: it conveys visual position, and the table of contents already names every section and marks the current one for assistive tech. The prompt is a **suggestion, never an automatic jump** — a reader who deliberately scrolled back to the top should not be yanked 15,000 words down on their next visit. It renders nothing when the remembered section is the one the page already opens at.

### `<ShortcutHelp open onClose />`

The keyboard shortcut list, opened by `?` or from the sidebar. Moves focus into the panel and restores it on close, so a keyboard user who opened it with `?` can dismiss it with Escape and carry on from where they were.

## Layout rules

- **Sidebar:** fixed left, ~260px on desktop. Collapses to a drawer on mobile.
- **Content max-width:** ~760px for reading. Wider (~1100px) for tables and dashboards.
- **Sidebar contents:** a Views list (Dashboard, Schedule, Search, Tools, Portfolio, Applications), the track switcher (IT / Cyber), the current track's phase list, Keyboard shortcuts, and Reset progress. There is no Settings page; the preferences that would live there sit next to the thing they affect — energy mode and reading size on the page they change, the schedule's start date on the Schedule page.
- **Header:** on the dashboard, shows the current recommended task and the current energy mode.

## Interaction rules

- Toggling a checklist item updates progress immediately and persists to local storage.
- Switching tracks does not lose scroll position or progress.
- Every page that lists content has a clear "add" or "start" affordance.
- No modal dialogs for anything that can be inline. The two exceptions are `<ShortcutHelp>` and the mobile sidebar, and both dismiss on Escape and restore focus.
- No toast notifications for actions the user can see succeeded (checking a box).
- **Progress means two different things and they are never merged.** The phase checklist is the completion test; lesson sections are a within-lesson reading aid. Different storage keys, different labels, different counts. A phase's progress bar counts only its checklist.
- **A suggestion never acts on its own.** The resume prompt offers a jump and waits; the schedule offers a re-baseline and waits. Nothing scrolls, navigates, or re-dates itself without a click.

## Keyboard

Global shortcuts live in [`learning-site/src/hooks/useShortcuts.js`](../learning-site/src/hooks/useShortcuts.js). `/` and `Ctrl`/`⌘`+`K` focus search; `j`/`n` and `k`/`p` move between phases; `g d` and `g s` go to the dashboard and schedule; `?` toggles the shortcut list; `Escape` closes it or blurs the focused field. Every shortcut is documented in the help panel, because a shortcut nobody knows about is not a feature.

Two rules are load-bearing:

1. **Keys are ignored while the target is an input, textarea, select, or anything `contentEditable`.** Typing `jk` into a job-notes field must not navigate away from it.
2. **No shortcut toggles a checkbox.** A single unlabelled keystroke that mutates saved progress is how a reader marks four tasks done by leaning on the keyboard, and progress is the one piece of state here that is not cheap to rebuild.

## Anti-patterns

Do not:

- Build a dashboard full of charts. Progress bars and counts only.
- Add gamification badges, streaks with penalties, or leaderboards. This is a solo tool.
- Animate anything that delays reading. Transitions under 150ms.
- Use red or warning colors for missed days. Burnout prevention means no shame UI.
- Hide progress behind a click. It should be visible on load.

## Accessibility

- All interactive elements keyboard-reachable.
- Focus states visible.
- Contrast ratios meet WCAG AA for text.
- No information conveyed by color alone.

## Decided at M1

- **Framework.** React 18 + Vite 6 — see [`DECISIONS.md`](DECISIONS.md) → D-006.
- **CSS approach.** Plain CSS with custom-property tokens. No utility framework, no CSS-in-JS.

## Breakpoints

Two, and both are load-bearing.

| Width | What changes |
|---|---|
| ≤ 860px | The sidebar becomes an off-canvas drawer behind a hamburger button in a sticky topbar, with Escape, backdrop-click and scroll locking. The lesson TOC drops to one column. |
| ≤ 560px | Phone layout. Spacing tightens, the pager and plan rows stack, page headings step down a size, and the smallest touch target is brought to **40px** — a mis-tap on a 24,000-word lesson loses the reader's place. The per-section done control stops relying on hover and is always visible, since a touch device has no hover to reveal it with. That is the same rule the code-block copy button follows. |

## Still open

- **Icon set.** None. Components use text labels and a single check glyph.
- **Animation library.** None. Transitions are CSS-only and under 150ms, per the anti-patterns above. A `prefers-reduced-motion` block zeroes the duration for readers who ask the system for less motion.
- **Print stylesheet.** A phase cannot yet be taken offline on paper.
- **Progress export.** Progress, portfolio and applications live in three `localStorage` keys with no way to move them between machines or back them up.