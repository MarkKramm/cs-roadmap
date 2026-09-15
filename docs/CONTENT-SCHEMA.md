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
track: it                          # it | cyber
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
- **`track`** is `it` or `cyber` — one per top-level folder.
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

- **ID format:** `<track>-<phase>-c<NN>`, zero-padded, sequential within the phase. Track is `it` or `cyber`, phase is the two-digit number from the filename. `it-03-c01`, `cyber-09-c01`.
- **IDs never change.** Adding a task appends a new ID. Removing a task retires its ID but does not renumber.
- IDs must be **globally unique**, not merely unique within a phase — the build fails on a duplicate. The site treats an ID as the identity of a task, so a collision across two phases would make progress on one appear against the other.
- The `energy:` hint is optional. When present, the site's low-energy mode only offers `energy: low` tasks.
- HTML comments are invisible in every Markdown renderer, so the raw file stays clean.

### Practice task IDs

Each line under `## Hands-on practice tasks` gets an id at build time, `<phase-id>-t<NN>`:

```json
{ "id": "it-03-t01", "text": "Run `ipconfig /all` and record …" }
```

These are **minted from position, not authored in the Markdown**, which is the one place this schema differs from checklist ids. The reason is that a reader's *answer* to a practice task is stored against the task's id (see `DECISIONS.md` → D-019), so an answer keyed by array position would silently reappear under a different question the moment a task was inserted above it.

The limitation that follows is real and is recorded rather than hidden: **appending** a task is safe, **reordering** one is not — the ids shift with the position, so an existing answer would follow the position rather than the question. Migrating to an authored `<!-- id: … -->` comment on each task line, as the checklist already does, removes the caveat. It has not been needed because these lists have only ever been appended to.

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
| `## You're ready to move on when...` | `exitCriteria` | Plain text |
| `## Free vs Paid` | `freeVsPaid` | Object with three sub-fields |

Optional headings (`## Specific topics to learn`, `## Lab setup options`, `## Path options`, `## Required projects`, `## Recommended order`, `## Target roles`) map to `topics` as an array of `{ heading, items }`.

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

Everything between `## Lesson: <Title>` and the next `## ` heading is the lesson — the part that actually teaches. Measured across both tracks it is **84–95% of every phase file**, so it is the largest thing the schema carries and the reason the site is worth opening.

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

`node scripts/audit-lesson-ast.mjs` verifies both across every phase by comparing the AST's characters against the source with markup stripped. It currently reports zero loss on all 18 lessons. **Run it after any change to the parser.**

## Output: generated JSON

The build script emits a small index per track plus one file per lesson:

```text
learning-site/src/data/generated/it.json
learning-site/src/data/generated/cyber.json
learning-site/src/data/generated/lessons/<phase-id>.json
learning-site/src/data/generated/search.json
```

### Why the lessons are separate files

The lesson bodies total roughly 1.7 MB of JSON. Inlining them into the track indexes made the site's single JS bundle 1.9 MB, which delayed first paint for content the reader had not asked for. Each lesson is therefore its own file, imported dynamically by `src/hooks/useLesson.js` when a phase is opened, and cached per phase id in memory.

### `search.json` — the full-text index

Search needs to find a phrase across all 23 lessons without loading all of them. This file holds an inverted index — term to segment id — and **no prose**, so it does not duplicate the lesson files. See [`DECISIONS.md`](DECISIONS.md) → D-013 for the measurements behind that choice; storing segment text came to 473 KB gzipped against 180 KB for this.

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
| `segments[].k` | Track id — `it` or `cyber`. |
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
      "tasks": ["...", "..."],
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

Adding front-matter and task IDs touches all 17 phase files. The migration is one scripted pass, committed as a single change, then reviewed. Until that pass runs, this document is a design artifact.