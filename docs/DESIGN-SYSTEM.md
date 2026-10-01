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
| `--accent-soft` | Washed accent for texture that must not compete with text — selected rows, lesson highlights |
| `--success` | Completed checklist items, positive progress |
| `--warning` | Buffer weeks, "consider pausing" hints |
| `--danger` | Error **borders and fills**, blockers only |
| `--danger-text` | Error **text**. Lighter than `--danger` because `--danger` is a 4.30:1 pairing on `--bg-subtle`, under the 4.5:1 AA floor for body text; this is 6.14:1 there and 6.86:1 on `--bg-elevated` |
| `--focus` | Focus-ring colour where the ring must sit on an accent surface, where an accent ring would vanish |
| `--overlay` | The backdrop scrim behind a modal or the mobile drawer |
| `--text-on-accent` | Text that sits on an accent fill (primary buttons) |

Rule: never rely on color alone to convey state. Completed items also get a strikethrough or a check glyph.

**Contrast, verified 2026-09-17.** Every foreground × surface pairing was computed against the WCAG 2.x relative-luminance formula rather than eyeballed. All pass the 4.5:1 AA floor for body text except the one that motivated `--danger-text` above. The pairing that *looked* most at risk — `--text-muted` on `--bg-subtle` — is clean at **5.84:1**. Other reference values: `--text` 15.15 / 13.85 / 12.39, `--accent` 5.82 / 5.32 / 4.76, `--success` 8.38 / 7.66 / 6.85, `--warning` 8.19 / 7.48 / 6.69, across `--bg` / `--bg-elevated` / `--bg-subtle`. (`--accent` and `--danger` against `--border` measure 3.96:1 and 3.58:1, but `--border` is never used as a background, so those are not real text pairings.)

**Focus rings.** There is one global `:focus-visible` rule giving every focusable element a 2px accent ring. Components add their own ring only where they need a different offset or colour, and always with `:focus-visible` rather than `:focus` — a `:focus` rule of equal-or-higher specificity suppresses the ring for keyboard users too. There is now **no `outline: none` anywhere in the stylesheet**; the last one was on the search input and was removed on 2026-09-17.

**Modality.** A surface that declares `aria-modal="true"` must actually own the tab order, via `useFocusTrap` (`learning-site/src/hooks/useFocusTrap.js`). `body { overflow: hidden }` freezes the scrollbar and does nothing to the tab order, so it is not a substitute. The hook handles the trap, focus restore, and scroll lock together, because three overlays had each implemented roughly one of the three and two were asserting modality they did not enforce.

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

### `<ProgressRing value label />`

A single-value ring, used once — on the dashboard's reference rail, for how far through the track the reader is. It is a chart, so it carries the same duty `ProgressBar` does and one more: the percentage and the raw count are rendered as text beside it, and the `svg` is labelled rather than left silent. **It animates nothing.** The arc is drawn at its final length with no transition, because this is a readout and not a reward. A non-numeric or out-of-range value clamps instead of reaching the dash arithmetic as `NaN`, which would render as no arc at all, silently — both cases are asserted in `test:smoke`.

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
- **Content max-width:** the shell is capped at `--content-max` (1,400px) and **centred**, not pinned against the sidebar — a page capped and left-aligned on a 1,900px screen leaves a dead band nothing can use. Within that, the reading measure is ~760px and tables are allowed the full content width.
- **Dashboard:** two columns above 1,180px — the next action and the phase list on the left, a **reference rail** on the right holding the progress ring, the plan's dates, three read-only readiness counts, and what comes up next. The rail is a reference column, not a second dashboard: no charts, no streaks, and its only controls are links to the page that owns each figure. Below the breakpoint it lays out as cards under the main column, in the same order, so nothing is hidden at a narrow width.
- **Phase cards tile two-up** once there is width for two honest cards. A single column of fourteen full-width cards is a lot of scrolling for very little information per card.
- **Sidebar contents:** a Views list (Dashboard, Schedule, Search, Shared, Your work, Where you've been, Tools, Portfolio, Applications, Certifications, Practice exams), the track switcher (IT / Cyber / Advance), the current track's phase list, Keyboard shortcuts, and Reset progress. There is no Settings page; the preferences that would live there sit next to the thing they affect — energy mode and reading size on the page they change, the schedule's start date on the Schedule page. Practice exams are session-only diagnostics; they do not add another saved score or progress signal.
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

## Control boundaries

**A control's edge is not a separator.** `--border` is for separators, where low contrast is
the point — a rule between two sections should not compete with the text. It is **1.47:1** on
`--bg`, and WCAG 2.5.8 asks **3:1** for a control's boundary, so a ring drawn in `--border` is
not a quiet control. It is an absent one.

`--control-border` (`#6a7180`, **3.76:1** on `--bg`, 3.44:1 on `--bg-elevated`) exists for
control edges. It is dimmer than `--text-muted` (7.14:1) on purpose: a resting control should
recede, but it has to be perceivable first. It clears 3:1 with margin on both surfaces rather
than sitting on the line, so a future surface change does not push it under.

The per-section done control is the worked example, and it took two faults to find. It was
`opacity: 0` and drawn in `--border`, so a reader saw no circle at all until hovering — and a
completed section was **5.7× more visible** than an undone one (8.38:1 against 1.47:1), which
made a half-finished lesson look finished, with nothing to click anywhere in it. The
"present but quiet" intent was right; the execution defeated it, because a control nobody can
see is not quiet. It is now always visible at 24px (26px under 560px), still recessive: no
fill, a 1px ring, and motion only on interaction.

The states are distinguished by the **tick glyph**, not by colour alone, so they survive
greyscale and colour-blindness.

## Target size, and what the audit deliberately did not fix

**This is enforced.** `browser-check.mjs` sweeps every interactive control across seven views and
a lesson, and fails if any is under 24x24 (WCAG 2.5.8) or painted invisible. The **total** is
asserted as well as the failure count, so a broken selector cannot pass on an empty sweep, and
reaching the lesson is a check in its own right: the first version of the sweep omitted the
lesson and **passed green with a control hidden at `opacity: 0`**, which only mutation testing
found.

Three rules the sweep has to encode, each of which is a false positive if you skip it:

- **Measure the effective target, not the element.** A radio input is 13x13, but it is wrapped in
  a `<label>` measuring 139x31, and clicking anywhere on the label activates the radio. The label
  is what a reader aims at. Measuring the input reported six failures that did not exist.
- **The inline exemption is decided from the element's own text, not guessed.** A link with words
  around it in the same block is constrained by the surrounding line-height and is exempt under
  2.5.8; a bare link with nothing around it is counted.
- **A control needs a class to be fixable.** Eleven resource links were bare `<a>` elements at
  21px that no stylesheet could target and no selector could measure.

Controls that were under 24px, all fixed by padding the hit area with **no visual change**:

| Control | Was | Now | How |
|---|---|---|---|
| `.link-btn` — a bare text button, used 12+ times including inline in prose | 21px | 25px | `padding: 2px 0` with an equal `margin: -2px 0` |
| `.tool-card__link` — "Official site" | 19px | 25px | `padding: 3px 0`; padding on a non-replaced inline box does not move the line box, so no compensation is needed |
| `.resource-link` - the phase's resource links, previously classless | 21px | 24px | `padding: 3px 0` |
| `.tool-result__from` | 22px | 24px | top padding, growing into space that was already empty |

**The compensation on `.link-btn` is not optional.** It is a `button`, so vertical padding
expands the line box, and it sits inside prose in several places. Without the negative margin
the vertical rhythm of a paragraph changes — which is not a trade worth making for a target-size
win. The hit area grows; nothing moves.

**One was left unfixed, on purpose.** A bare "Read the source" link in lesson prose measures
21px. WCAG 2.5.8 exempts a target that *is in a sentence or is otherwise constrained by the
line-height of non-target text*, and this one plausibly is. The alternative was to pad every
link in lesson prose, which is a broad change to the reading column for a borderline case.
**A named non-fix is better than a silent one** — a future pass that disagrees has something to
disagree with, rather than having to rediscover that the option was considered.

### What the audit got wrong, which is the part worth keeping

Running it produced **three false positives, and all three were the audit's own reasoning**:

- **Every element's background was compared against itself** (the walk for "what is behind
  this" started at the element rather than its parent), so 19 controls reported a boundary
  contrast of exactly 1:1. A ratio of 1.00 is a bug report about the bug reporter.
- **A control with no border and no fill was counted as having "no visible edge"** — 1,050 of
  1,142, which is a nonsense number that would have filled this file. Those controls are
  identified by their **text**, at 4.76:1 to 13.85:1. WCAG 1.4.11 requires 3:1 for the boundary
  *where the boundary is what identifies the control*; a text button at 13.85:1 is about as
  visible as anything on the page. **The site has no contrast defects. Its surfaces are
  deliberately quiet and its text deliberately loud, and that is a coherent choice, not a bug.**
  Contrast is therefore **not** in the enforced sweep, with this paragraph as the reason.
- **The radio inputs described above**, which are a failure to identify the target rather than a
  failure of the site.

**The general form:** a whole-site audit finds the audit's own assumptions first, because the
audit is the only thing in the repository making claims it has not checked. The findings that
survived were the ones that survived a second look.

## Breakpoints

Three, and all three are load-bearing.
| Width | What changes |
|---|---|
| ≥ 1180px | The dashboard becomes two columns: content plus the reference rail, which sticks so a figure you are checking against stays on screen. Below this the rail lays out as cards under the main column, in the same order — nothing is dropped, it just stops being a column. |
| ≤ 860px | The sidebar becomes an off-canvas drawer behind a hamburger button in a sticky topbar, with Escape, backdrop-click and scroll locking. The reading bar runs the full width, because the sidebar no longer occupies a column. The lesson toolbar stops being sticky — the topbar owns the single `top: 0` slot and would otherwise sit over it. The lesson TOC drops to one column. |
| ≤ 560px | Phone layout. Spacing tightens, the pager and plan rows stack, page headings step down a size, and the smallest touch target is brought to **40px** — a mis-tap on a 24,000-word lesson loses the reader's place. The per-section done control grows to 26px, since a 24px ring beside a heading is close to the text and benefits from the extra pixels. The phase grid drops to a single column. |

## Still open

**This list is checked against the code, not carried forward.** Two entries here —
the print stylesheet and progress export — were listed as open long after both had
shipped, and they are recorded in `DECISIONS.md` as **D-017** and **D-016**. A
"still open" list that names finished work is worse than no list: it is the one
place in this repository that could tell a future contributor to build something
that already exists, and it did so for a version of this file's whole lifetime.
**When an item here ships, delete it in the same commit.**

- **Icon set.** None. Components use text labels and a single check glyph.
- **Animation library.** None. Transitions are CSS-only and under 150ms, per the anti-patterns above. A `prefers-reduced-motion` block zeroes the duration for readers who ask the system for less motion.
- ~~**A glossary.**~~ **Shipped on 2026-10-02, partially, and the way it shipped matters more than that it did.** `career-roadmaps/shared/GLOSSARY.md` holds **47 verified entries**, is rendered in the site beside the other shared documents, and is listed second in `scripts/shared-content.mjs` because it is the one a reader reaches for by name rather than in order.

  This entry previously said the glossary needed "new build tooling to produce the data first", which was the wrong blocker. The tooling was straightforward; **the extraction was not trustworthy.** `scripts/extract-glossary-candidates.mjs` proposes an expansion for **64** of the **309** domain terms, and a large minority are confidently wrong — `KQL` came back as "Microsoft Sentinel and Defender XDR", `ICS` as "The incident command system", `CSF` as "task 7". A glossary that says those is worse than no glossary, because it converts a term a beginner can look up into a wrong fact they repeat in an interview.

  So every entry was checked by hand against the line it came from, **17 were rejected with the reason recorded in the document**, and the rest are quoted from the corpus verbatim — including its spelling, so that a citation can be checked against its own source. `scripts/audit-glossary.mjs` fails the build if an entry's expansion is no longer at the line it cites, and `test-audit-glossary.mjs` holds that to 12 controls.

  **What remains open, stated rather than implied:** coverage is **15%**, and the document accounts for the other 262 by reason — no expansion findable, an expansion found and wrong, or a gloss where an expansion belongs. Fixing group 2 is content work on the *source lines*, not glossary work. Coverage is deliberately not gated: refusing the 47 verified entries or inventing the other 262 are both worse than a partial glossary that is true.