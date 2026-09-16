# Content Schema

The contract between the study content (`career-roadmaps/**/*.md`) and any tool that consumes it. It is implemented by [`scripts/build-content.mjs`](../scripts/build-content.mjs), which runs before every `dev` and `build` and fails loudly on a contract violation.

**Status: implemented.** The build script and the generated JSON exist. Where this document and the script disagree, the script is authoritative — correct this document to match.

## Why this exists

The Markdown files are the single source of truth. A site that renders them must not duplicate their content. Instead, a build script walks the Markdown, extracts structured data, and emits JSON. The UI reads only the JSON.

This file defines what the script looks for and what it emits.

## Source: phase files

Each `NN-phase-*.md` file becomes one object in the generated JSON.

### Front-matter

To be added to every phase file. YAML between `---` delimiters at the very top.

```yaml
---
id: it-03-networking-basics        # stable, unique, never reused
track: it                          # it | cyber | advance
phase: 3                           # numeric phase index
order: 30                          # sort key; phase * 10
title: Networking Basics
duration: 4 weeks
duration_weeks: 4
energy_mix: [low, normal, high]
deliverable: portfolio/it/03-networking-basics.md
exit_criteria: >
  You can troubleshoot a basic internet issue using IP, gateway, DNS,
  and Wi-Fi checks, and explain your process clearly in a ticket.
---
```

Field notes:

- **`id`** is permanent. Renaming the file does not change it. Progress saved against `id` survives reorganization.
- **`track`** is `it`, `cyber`, or `advance` — one per top-level folder. The value must be one of the three names in `KNOWN_TRACKS` in [`scripts/build-content.mjs`](../scripts/build-content.mjs); a phase naming a track that is not listed there **fails the build** rather than being dropped, because the track's own JSON is only emitted for a key that already exists.
- **`order`** is `phase * 10` by convention, leaving room to insert phases later without renumbering.
- **`energy_mix`** lists which of `low` / `normal` / `high` energy modes a phase's tasks suit. Used by the site's daily-task picker.
- **`deliverable`** mirrors the `## Deliverable / proof of work` section's target path.

### Checklist task IDs

Each `- [ ]` line under `## Checklist` gets a trailing HTML comment with a stable ID:

```markdown
- [ ] I can explain LAN, WAN, router, switch, modem, firewall. <!-- id: it-03-c01 energy: low -->
- [ ] I can explain IPv4 address, subnet mask, gateway, DNS, DHCP. <!-- id: it-03-c02 energy: low -->
- [ ] I understand IPv6 basics and AAAA DNS records. <!-- id: it-03-c03 energy: normal -->
```

- **ID format:** `<track>-<phase>-c<NN>`, zero-padded, sequential within the phase. Track is `it`, `cyber`, or `advance`, phase is the two-digit number from the filename. `it-03-c01`, `cyber-09-c01`, `advance-01-c01`.
- **IDs never change.** Adding a task appends a new ID. Removing a task retires its ID but does not renumber.
- IDs must be **globally unique**, not merely unique within a phase — the build fails on a duplicate. The site treats an ID as the identity of a task, so a collision across two phases would make progress on one appear against the other.
- The `energy:` hint is optional. When present, the site's low-energy mode only offers `energy: low` tasks.
- HTML comments are invisible in every Markdown renderer, so the raw file stays clean.

### Practice task IDs

Each line under `## Hands-on practice tasks` gets an id, and every practice task in the curriculum now authors one inline rather than having one minted for it:

```markdown
1. Run `ipconfig /all` and record … <!-- id: it-03-t01 band: quick energy: low -->
```

The comment carries three fields, and the **field order is fixed**: `id`, then `band`, then `energy`. The parser is deliberately not order-tolerant — a reordered comment is a build error rather than a guess, because a task whose metadata was silently misread would produce a wrong suggestion rather than no suggestion.

- **`id`** is `<phase-id>-t<NN>`, zero-padded and sequential within the phase, on the same permanent-identity principle as checklist ids: adding a task appends an id, and a reader's *answer* is stored against the id (see `DECISIONS.md` → D-019), so it cannot migrate to a different question.
- **`band`** describes how long one sitting takes. There are four values:

  | Band | Meaning |
  |---|---|
  | `quick` | Under 30 minutes. |
  | `focused` | 30–90 minutes. |
  | `deep` | Over 90 minutes. |
  | `ongoing` | **Not a single timed sitting.** Recurring, week-gated, multi-session or hardware-gated work. |

  `ongoing` is an exclusion rather than a length: it means *more time would not help*, so a task carrying it is never offered as a time-boxed suggestion (see `DECISIONS.md` → D-021).
- **`energy`** is one of `low`, `normal`, `high`, matching the checklist's `energy:` hint. All 252 practice tasks carry a value.

**Positional minting is now a fallback, not the normal path.** The build still mints `<phase-id>-tNN` from position for any task line that carries no `<!-- id: … -->` comment, so a partially migrated file cannot fail the build — but it **reports the count**, because a silently minted id is the one thing that would let an answer follow a position rather than a question. The build prints both numbers on every run:

```text
task bands:  252 banded, 0 authored without a band, 0 still minted from position
task energy: 252 of 252 practice task(s) carry an energy value
```

The minted-from-position count is currently **0**. A future edit that adds a task without its comment raises that number instead of passing quietly, which is the signal to author the comment rather than to accept the mint.

The same `band`/`energy` pair is parsed for the dashboard's "what should I do today?" picker; `scripts/lesson-ast.mjs` and the site's `src/lib/today.js` both fail **closed** on an unknown or missing band, so an unrecognised value can never be treated as fitting every budget.

### Sections to extract

The build script reads these `##` headings. Missing mandatory headings are a build error.

| Heading | Maps to JSON key | Notes |
|---|---|---|
| `## Goal of this phase` | `goal` | Plain text, first paragraph only |
| `## Estimated time` | `duration` | Also parsed for `durationWeeks` |
| `## Skills you'll gain` | `skills` | Array of bullet strings |
| `## Tools for This Phase` | `tools` | Table rows → array of tool objects |
| `## Free/cheap resources` | `resources` | Array of `{ name, url }` |
| `## Hands-on practice tasks` | `tasks` | Array of numbered strings |
| `## Deliverable / proof of work` | `deliverableItems` | Array of bullet strings |
| `## Checklist` | `checklist` | Array of `{ id, text, energy }` |
| `## Quiz` | `quiz` | Array of question objects — see "The quiz section" below |
| `## You're ready to move on when...` | `exitCriteria` | Plain text |
| `## Free vs Paid` | `freeVsPaid` | Object with three sub-fields |

Optional headings (`## Specific topics to learn`, `## Quiz`, `## Lab setup options`, `## Path options`, `## Required projects`, `## Recommended order`, `## Target roles`) map to `topics` as an array of `{ heading, items }` — except `## Quiz`, which is parsed into its own structure rather than into `topics`.

### The quiz section

`## Quiz` is optional and currently present in **3 of 31 phases** — a deliberate vertical slice, one phase per track, so the format was proven before it was scaled. The build reports coverage on every run rather than assuming it, because silent partial coverage reads as "every phase is quizzed" to anyone who only sees the build succeed.

The format reuses **Markdown task-list syntax**: `- [x]` marks the correct option. That choice is load-bearing rather than cosmetic — the print stylesheet exists so a phase can be studied offline, and a quiz encoded as HTML or JSON would be the one section that vanished on paper. Authored this way, the quiz reads correctly on GitHub, in a text editor, and in print, with no new vocabulary to learn.

```markdown
### Q1. A user can read a file but cannot save changes. Most likely cause? <!-- id: it-02-q01 energy: normal -->

- [x] The share permission allows Read but NTFS allows Change
- [ ] The file is marked read-only in Windows Explorer
- [ ] The account is a standard user rather than an administrator
- [ ] The disk is full

**Why:** Read succeeds, write fails — that split points at a permission layer that grants reading and denies writing.
```

| Element | Requirement |
|---|---|
| Heading | `### Q<n>. <question> <!-- id: <phase-id>-q<nn> energy: <low\|normal\|high> -->` |
| `id` | Authored, unique, matching the phase's own prefix — never minted from position (D-019) |
| Options | At least 3, each `- [ ]` or `- [x]`, with **exactly one** `[x]` |
| Explanation | A single-line `**Why:**` after the options |
| `energy` | Reuses the checklist vocabulary so anything that reads energy already understands a question |

`energy` is `low` for quick factual recall, `normal` for reasoning about a scenario, `high` for multi-step judgement.

**The build fails rather than skipping** on a missing `[x]`, two `[x]` marks, a missing `**Why:**`, a duplicate id, an unknown energy, or a section with prose but no parseable questions. A quiz is a claim that one answer is right, so a malformed one is worse than a missing one — it tells the reader their correct answer is wrong.

**The set is validated separately**, in `scripts/audit-quiz.mjs`, because a per-question check cannot see a defect of the collection. The first quiz written for this repository put **seven of its ten correct answers in position C**: every question was individually valid and the build was green, yet a reader answering "C" every time scored 70% without reading. The guard gates position skew above 50%, unused positions, and erratic option counts.

### Sections deliberately NOT extracted

Two headings appear in phase files but are **not** mapped to any JSON key. This is intentional, not an omission:

| Heading | Why it is excluded |
|---|---|
| `## Lesson` | Long-form teaching prose, minimum 3,000 words. It is reading material, not structured data. Rendering it in the UI as a field would duplicate the Markdown, which this schema exists to prevent — and it would bloat the generated JSON for every phase. The lesson stays in the Markdown file and is read there. |
| `## Common Pitfalls` | Present in some phases as a distinct list of mistakes to avoid. It is advisory prose rather than a checklist or task list, and the site has no pitfalls component. Kept in Markdown only. |

Because neither is extracted, the build does **not** validate their presence or contents. The authoring requirements for `## Lesson` live in [`CONTENT-GUIDE.md`](CONTENT-GUIDE.md).

### Headings inside fenced code blocks

Section detection **tracks fence state**. A line beginning with `## ` or `### ` inside a ```` ``` ```` or `~~~` fence is body text, not a heading, so a lesson can safely show a report template, a sample file, or real command output containing genuine Markdown headings.

This matters because a lesson often demonstrates a document structure, and that example legitimately contains headings that collide by name with real contract sections — a portfolio report template, for instance, carries `## Summary`, `## Findings`, and `## Checklist`. Before fence tracking, such a template was parsed as phase structure: the phantom headings appeared in the section map, and the template's `## Checklist` was taken as *the* checklist section, failing the build with `checklist line without an id comment`.

Fences must be **balanced**. Every line after an unterminated fence is read as still inside it, so a missing closing fence hides the remainder of the document from extraction — which surfaces as a missing-mandatory-section error naming a heading that is plainly present in the file.

### Tools table parsing

Each row becomes:

```json
{
  "name": "Wazuh",
  "purpose": "Free SIEM/XDR",
  "cost": "Free/open-source",
  "url": "https://wazuh.com/",
  "task": "Install Wazuh, forward logs from a VM, write 3 detection rules",
  "freeAlternative": "Elastic/Splunk free tier"
}
```

Column order is fixed by [`CONTENT-GUIDE.md`](CONTENT-GUIDE.md).

## The lesson region

Everything between `## Lesson: <Title>` and the next `## ` heading is the lesson — the part that actually teaches. Measured across all three tracks it is **84–95% of every phase file**, so it is the largest thing the schema carries and the reason the site is worth opening.

The build parses it with [`scripts/lesson-ast.mjs`](../scripts/lesson-ast.mjs) into a block AST. The parser supports exactly the Markdown subset the curriculum uses, which was measured rather than assumed: `###`/`####`/`#####` headings, paragraphs, bullet and ordered lists (including one level of nesting), tables, fenced code blocks, and blockquotes. Inline `**bold**`, `*italic*`, and `` `code` `` are carried through as raw text and formatted by the site's `renderInline.jsx`.

Block shapes:

```json
[
  { "type": "heading", "level": 3, "text": "Part 1 — …", "id": "part-1" },
  { "type": "para",    "text": "…" },
  { "type": "code",    "lang": "powershell", "text": "…" },
  { "type": "quote",   "paras": ["…"] },
  { "type": "table",   "head": ["Tool", "Purpose"], "rows": [["Wazuh", "SIEM"]] },
  { "type": "list",    "ordered": false,
    "items": [{ "text": "…", "children": [] }] }
]
```

Two rules the parser keeps:

- **Nothing is dropped.** A line that matches no block becomes a paragraph, and any construct the parser does not recognise is recorded in `unknown`, which **fails the build**. Content that cannot be rendered must be a loud error, not a silently missing paragraph.
- **Heading IDs are unique.** Duplicates get a numeric suffix so a table of contents never links two entries to the same anchor.

`node scripts/audit-lesson-ast.mjs` verifies both across every phase by comparing the AST's characters against the source with markup stripped. It currently reports zero loss on all 29 lessons. **Run it after any change to the parser.**

## Output: generated JSON

The build script emits a small index per track plus one file per lesson:

```text
learning-site/src/data/generated/it.json
learning-site/src/data/generated/cyber.json
learning-site/src/data/generated/advance.json
learning-site/src/data/generated/lessons/<phase-id>.json
learning-site/src/data/generated/search.json
learning-site/src/data/generated/shared.json
```

### `shared.json` — the standalone shared documents

`career-roadmaps/shared/` holds three documents that are part of the curriculum but are **not phase files**, so `build-content.mjs`'s `*-phase-*.md` walk never reaches them. [`scripts/shared-content.mjs`](../scripts/shared-content.mjs) reads them separately and emits one file:

`{ "generatedAt": "…", "docs": [ … ] }`, where each entry carries `id`, `kind`, `title`, `blurb` and `sourcePath`, and then one of two bodies depending on `kind`:

```json
{
  "generatedAt": "2026-09-15T00:00:00.000Z",
  "docs": [
    { "id": "anti-burnout-rules", "kind": "doc",
      "title": "Anti-Burnout Rules", "blurb": "…", "sourcePath": "career-roadmaps/shared/anti-burnout-rules.md",
      "blocks": [ … ], "toc": [ … ], "blockCount": 21 },

    { "id": "resource-list", "kind": "resources",
      "title": "Free Resource List", "blurb": "…", "sourcePath": "career-roadmaps/shared/resource-list.md",
      "groups": [ { "heading": "CompTIA A+",
                    "resources": [ { "name": "Professor Messer CompTIA A+", "url": "https://…" } ] } ],
      "resourceCount": 42 }
  ]
}
```

- **`kind: "doc"`** — the anti-burnout rules and the weekly tracker. Prose, tables and lists, parsed into the lesson AST's own block shape, so `LessonBlock` renders them unchanged.
- **`kind: "resources"`** — the resource list. A catalogue rather than prose: `Name — https://url` lines are extracted into `{ name, url }` pairs under their category heading, so the site can render real anchors. `renderInline` handles bold, code and italic only and deliberately does not autolink, so as prose this document would be 42 unclickable URLs.
- **The block shape is the lesson AST's**, because the same parser builds it. The parser takes a `headingBase` parameter: lessons are authored inside a `## Lesson:` wrapper so their headings start at level 3, while a standalone document is authored `# Title` / `## Section` and starts at level 1. One parser, two corpora.
- **The build fails rather than skipping quietly.** A wrong resource separator, a bullet before any category heading, or an unparsed block stops the build — the same contract `build-content.mjs` enforces for phase resources, and for the same reason: an unlinked resource far from its cause is a mystery, while a named error at build time is a five-second fix.

### Why the lessons are separate files

The lesson bodies total roughly 2.5 MB of JSON. Inlining them into the track indexes made the site's single JS bundle 1.9 MB, which delayed first paint for content the reader had not asked for. Each lesson is therefore its own file, imported dynamically by `src/hooks/useLesson.js` when a phase is opened, and cached per phase id in memory.

### `search.json` — the full-text index

Search needs to find a phrase across all 29 lessons without loading all of them. This file holds an inverted index — term to segment id — and **no prose**, so it does not duplicate the lesson files. See [`DECISIONS.md`](DECISIONS.md) → D-013 for the measurements behind that choice; storing segment text came to 473 KB gzipped against 180 KB for this.

```json
{
  "v": 2,
  "segments": [
    { "h": "Part 4 — Reading cloud logs", "a": "part-4-reading-cloud-logs",
      "p": "cyber-09-cloud-and-identity", "pt": "Phase 9 — Cloud and Identity Security",
      "k": "cyber" }
  ],
  "terms": "auditd:a,b,c\nazure:1d,2f",
  "common": "the\nand\nuser"
}
```

| Field | Meaning |
| --- | --- |
| `v` | Index format version. The site reads this and a mismatch is a bug, not a fallback case. |
| `segments[].h` | The heading this segment sits under. Taken from the lesson's `###`/`####` headings. |
| `segments[].a` | The heading's anchor id, used to scroll to the hit. Empty for the lesson-level opening segment. |
| `segments[].p` | Phase id. Resolves to a lesson file at `lessons/<p>.json`. |
| `segments[].pt` | Phase title, for the result row. |
| `segments[].k` | Track id — `it`, `cyber`, or `advance`. Resolved against `tracks` in `src/data/roadmaps.js` to label the result row; a hardcoded two-track test here once labelled every non-cyber hit as IT. |
| `terms` | One line per term, `term:delta,delta,…`, where the deltas are ascending segment indices encoded in base36. |
| `common` | Terms appearing in more than 20% of segments. Kept so the engine can match and report them, but excluded from the query's AND — see D-013. |

Segment indices are positions in `segments`, so **the two arrays must stay in sync**; both are emitted from one pass. Segments are cut at `###`/`####` headings rather than per block or per lesson: per block gives a result list too long to read, per lesson gives 23 hits too broad to use.

An index file contains:

```json
{
  "track": "it",
  "generatedAt": "2026-09-11T00:00:00Z",
  "phaseCount": 9,
  "phases": [
    {
      "id": "it-03-networking-basics",
      "order": 30,
      "title": "Networking Basics",
      "duration": "4 weeks",
      "durationWeeks": 4,
      "goal": "...",
      "skills": ["...", "..."],
      "topics": [{ "heading": "IP addressing", "items": ["...", "..."] }],
      "tools": [{ "name": "Wazuh", "purpose": "...", "cost": "...", "url": "...", "task": "...", "freeAlternative": "..." }],
      "resources": [{ "name": "Practical Networking", "url": "https://..." }],
      "tasks": [{ "id": "it-03-t01", "text": "...", "band": "quick", "energy": "low" }],
      "deliverableItems": ["...", "..."],
      "checklist": [{ "id": "it-03-c01", "text": "...", "energy": "low" }],
      "lessonTitle": "Networking Without the Jargon",
      "lessonPath": "lessons/it-03-networking-basics.json",
      "lessonBlockCount": 478,
      "lessonHeadingCount": 59,
      "exitCriteria": "...",
      "freeVsPaid": {
        "freeEnough": "...",
        "paidUpgrade": "...",
        "whenWorthPaying": "..."
      },
      "sourcePath": "career-roadmaps/it-roadmap/03-phase-networking-basics.md"
    }
  ]
}
```

A lesson file contains `{ id, title, blocks, toc }`. The UI never reads the Markdown directly. It reads this JSON.

## Validation rules

The build script fails on:

- A phase file missing front-matter.
- A phase file missing any of the 10 mandatory headings.
- A checklist line without an `<!-- id: ... -->` comment.
- Two checklist items in the same phase sharing an `id`.
- Two phase files sharing a top-level `id`.
- A tools table row with fewer than 6 columns.
- A paid or freemium row without a `freeAlternative` value.

Failures are reported with file path and line number.

## What is deliberately not specified here

- **The build tool** (Node? Python? make?). Decided when the site is scaffolded.
- **The output location** relative to the site's source tree. Changes with the framework.
- **Site-side state shape** (progress, filters, view state). Belongs in [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) and the site's own docs.

## Migration path

Completed. Front-matter, checklist IDs and practice-task IDs are on all 23 phase files, and every practice task additionally carries a duration band and an energy value. There is no pending migration; the contract above describes the files as they are.