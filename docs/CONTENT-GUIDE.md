# Content Guide

How to write and maintain the study curriculum under `career-roadmaps/`.

This is the authoring standard. Follow it when adding a phase, editing topics, or reviewing content.

## Who this content is for

A beginner in the Philippines with basic past web-dev exposure, no degree, no certs, no professional IT or cybersecurity experience, a $0 budget, and about 2–4 focused hours per day, 5 days a week. They burn out easily and need small, visible wins.

Every writing choice should serve that reader.

## Phase file shape

Every `NN-phase-*.md` file uses the same structure. The **12 mandatory sections**, in order. Ten of these are enforced by the build script (`scripts/build-content.mjs`); `## Lesson` and `## Specific topics to learn` are required by authoring convention and reviewed by hand.

1. **Title + Goal of this phase** — one or two sentences. What the phase produces, not what it "covers".
2. **Estimated time** — realistic weeks, not optimistic ones. Include buffer. Be honest if something takes longer for a beginner.
3. **Skills you'll gain** — observable abilities, written as "can do X".
4. **Specific topics to learn** — concrete subtopics. Not "networking" but "IPv4, IPv6, DNS, DHCP, NAT, TCP/UDP, common ports".
5. **Lesson** — the teaching unit. Minimum 3,000 words. See "The Lesson section" below.
6. **Tools for This Phase** — a table. See the Tools-table contract below.
7. **Free/cheap resources** — actual names and links. Free only; paid resources belong in the Free vs Paid section.
8. **Hands-on practice tasks** — numbered, actionable, doable on a single computer with free software.
9. **Deliverable / proof of work** — one specific file or artifact the learner produces.
10. **Checklist** — `- [ ]` lines. One line per checkable outcome.
11. **You're ready to move on when…** — a single sentence describing the exit bar.
12. **Free vs Paid** — three sub-sections: What's free and enough, What's paid and why you'd upgrade, When it's worth paying.

The order above is the contract: mandatory sections appear in this sequence, with the optional section (if any) slotted after `## Specific topics to learn`.

**Five optional sections** slot in after "Skills you'll gain" when they apply:

- **Specific topics to learn** — most phases (default)
- **Lab setup options** — cyber phases with hardware choices
- **Path options** — specialization-choice phases
- **Required projects** — portfolio phases
- **Recommended order** — certification phases
- **Target roles** — job-application phases

Use one; do not stack them unless the phase genuinely needs more than one view.

## The Lesson section

**`## Lesson` is a mandatory section for every IT roadmap phase, positioned immediately after `## Specific topics to learn` and before `## Tools for This Phase`.** It is deliberately placed after the topic list: the topic list tells the learner *what* to cover, and the lesson explains *why it matters and how it works*.

**When a phase has no `## Specific topics to learn`**, the rule generalises to: the lesson goes after the **last** structural section and before `## Tools for This Phase`. Two IT phases need this case — Phase 8 (`## Portfolio structure` then `## Resume sections`) and Phase 9 (`## Target roles` then `## PH-friendly job boards`) — and in both the lesson follows the final structural section, preserving the order *skills → structure → lesson → tools*. The invariant that matters is the one thing the order never changes: **the lesson always sits after every structural section and before `## Tools for This Phase`.** One intervening section is permitted: Phase 1 carries a `## Common Pitfalls` list between the lesson and the tools table, which the pitfalls policy below explicitly allows. Every other IT phase places the lesson directly against `## Tools for This Phase`.

Requirements:

- **3,000 words is a floor, not a target — there is no upper bound.** A phase lesson is a real teaching unit, not a summary. It is the single largest prose block in the file, and long lessons in this repository run to 8,000+ words. **Never trim a lesson to hit a word count, and never set a ceiling.** When a lesson is already substantial, the fix for a gap is to add the missing explanation, worked example, or table — not to compress existing prose to make room. More depth is the goal; a learner reading this is here to learn the subject, not to finish quickly.
- **Use `### Part N — <title>` sub-headings** to break the lesson into 4–6 parts. Each part covers one coherent idea. A broad phase may carry more parts; match the structure to the material rather than to a count.
- **Open with a "Why this lesson exists" part.** Explain what the learner gets from it and why it is worth their time.
- **Define every term the first time it appears.** There is no glossary to fall back on.
- **Include concrete commands, outputs, and worked examples.** A lesson about networking should contain real `ipconfig` and `nslookup` output; a lesson about tickets should contain real ticket text.
- **Close with "Key takeaways" and "Practice this next"** so the lesson points back at the tasks below.

The lesson is **not extracted into the generated JSON** — see [`CONTENT-SCHEMA.md`](CONTENT-SCHEMA.md). It exists purely as Markdown reading material. This is intentional: the site renders topic lists, tasks, and checklists as structured data, while the lesson stays a document.

If a phase has a genuine hands-on dimension, a **`### Common pitfalls`** sub-heading inside the lesson is encouraged, as is a **`## Common Pitfalls`** top-level section when the pitfalls are distinct enough to stand apart from the teaching narrative. Keep one or the other; do not duplicate the same list in both places.

## Fenced code blocks

A lesson often shows a template, a sample report, or real command output inside a fenced block, and those blocks legitimately contain lines that begin with `## ` or `### `. `scripts/build-content.mjs` tracks fence state, so a heading inside a fence is **not** read as a section — you can show a report template with real `## Summary`, `## Findings` and `## Checklist` headings without it being parsed as phase structure.

Keep fences **balanced and terminated**. The parser treats every line after an unterminated fence as still inside it, so a missing closing fence silently hides the remainder of the document from section extraction — which surfaces as a "missing mandatory section" error naming a heading that is plainly present in the file. If the build reports a missing section you can see with your own eyes, look for an unbalanced fence first.

## Tools-table contract

Exactly six columns, in this order:

```text
| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
```

- **Cost** is `Free`, `Free/open-source`, `Free, built-in`, `Freemium`, `Paid`, or `Paid optional`. Never leave it blank.
- **Official link** must be a direct URL to the vendor or project, not a blog post.
- **Free alternative** is required whenever the tool is paid or freemium. If the tool is fully free, still name a second free tool where one exists — it teaches that no single tool is the only option.
- **Mini-task** is one concrete action, not a description.

## Tone rules

- Beginner-first. Define a term the first time it appears.
- One idea per bullet.
- Concrete beats abstract. "Run `ipconfig /all` and identify your gateway" beats "learn about network configuration".
- No jargon dumps. If a topic needs five acronyms in one line, split it across bullets.
- Second person ("you will", "you can"). The learner is the subject.
- No marketing language. "This phase teaches X" is better than "Master X in just 4 weeks!".

## Budget rule

Everything must be doable for $0.

- Every paid tool gets a free alternative in the same row.
- The only permitted paid item is one month of TryHackMe Premium, and only where a phase explicitly permits it (`cybersec-roadmap/WHEN-TO-BUY-THM-PREMIUM.md`).
- Never require a paid course, paid exam, or paid cloud account to complete a phase.

## File naming

- `00-overview.md` — the track entry point.
- `NN-phase-<slug>.md` — numbered phase, zero-padded, ordered by prefix.
- `checklist-master.md` — flat track-wide checklist.
- `TOOLBOX.md`, `FREE-TOOL-MAP.md`, `WHEN-TO-BUY-THM-PREMIUM.md` — reference tables (uppercase names).

When adding a phase file, keep the numeric prefix and renumber nothing. Insert gaps (e.g. `05a-`) only if the maintainer explicitly asks.

## Adding a new phase

1. Copy the shape of the nearest existing phase file.
2. Create `career-roadmaps/<track>/NN-phase-<slug>.md`.
3. Update the timeline table in the track's `00-overview.md`.
4. Regenerate `checklist-master.md` so the new checklist items appear there too.
5. Commit with a `docs:` prefix.

## Adding a new track

Adding a track is mostly plumbing, and the plumbing is the part that fails silently. **A new track is invisible to six scripts until it is named in each of them**, and every one of those scripts will print a clean, confident report having never read the new files. That is the same failure this repository has recorded three times in other forms, so the steps below are ordered so that the first thing you do is make the track visible.

1. **Choose the track id.** It is a single lowercase word (`it`, `cyber`, `advance`) and it appears in three places that must agree: the phase front-matter's `track:` field, the directory name's mapping, and the JSON filename. The directory name is *not* the id — `cybersec-roadmap/` holds `track: cyber` — so a track needs a directory-to-id mapping rather than a string prefix test.
2. **Name it in every script that walks tracks.** There is no single registry; the list is deliberately duplicated so each script's scope is readable in the script itself. Search for the existing two names and add the third:
   - `scripts/build-content.mjs` → `KNOWN_TRACKS` (a phase naming an unlisted track fails the build)
   - `scripts/audit-content.mjs`, `scripts/audit-refs.mjs`, `scripts/audit-readability.mjs`, `scripts/audit-terms.mjs`, `scripts/audit-time-budget.mjs` → each has its own `TRACKS` / `tracks` list
   - `scripts/add-frontmatter.mjs` → `TRACK_BY_DIR`, which maps a directory to an id and **throws** on an unmapped one
   - `learning-site/src/data/roadmaps.js` → the `import` and the `tracks` entry, which is what the sidebar, dashboard and search read
3. **Make every walker tolerate a track that has no directory yet.** A track is named in those lists before its first phase file is written, so `readdirSync` on a path that does not exist throws `ENOENT`. Catch it and **print a note** — `note: <track> — no directory yet, skipped` — because a silent skip makes "0 findings" indistinguishable from "looked at nothing". The guards do this; copy that pattern.
4. **Create `career-roadmaps/<new-track>/00-overview.md`**, including a timeline table whose week counts match each phase file's front-matter. `audit-time-budget.mjs` cross-checks this table against the phase files and will fail on a mismatch.
5. **Write the phases**, then generate `checklist-master.md` from their `## Checklist` sections.
6. **Add the track to `career-roadmaps/README.md`** (the strategy document) and to the content-model table in [`ARCHITECTURE.md`](ARCHITECTURE.md).
7. **Run the full guard suite** before committing. `audit-content.mjs`, `audit-refs.mjs` and `audit-readability.mjs` each print how many files they read; confirm that number went up.
8. Commit with a `docs:` prefix.

**Verifying the plumbing, without writing content.** The cheapest way to prove a new track is actually wired is to declare it, create the empty directory structure, and run everything: the build should emit a `<track>.json` with `phaseCount: 0`, and each guard should print a note naming the track it skipped. If a guard reports clean with no note, the track is invisible to it — which is the bug this whole section exists to prevent.

## Anti-patterns

Do not:

- List concepts without tools. "Learn about SIEMs" is not a task.
- Reference a paid resource without a free alternative.
- Write a phase without a deliverable.
- Use `--` for an em-dash, `?` for a curly quote, or `???` for a tree branch. See [`WORKFLOW.md`](WORKFLOW.md).
- Leave a code fence unterminated. Everything after it is read as inside the fence, so the rest of the document vanishes from section extraction.
- **Put a heading directly under a paragraph with no blank line between them.** Markdown folds the heading into the paragraph, so it renders as body text and the section silently disappears. This defect shipped seven times in this repository before it was automated — including a `### Part` heading and a mandatory `## Tools for This Phase` heading. `scripts/lint-content.mjs` now checks it, fence-aware, so a heading inside a code fence is not flagged.
- Inflate scope. A phase that claims 2 weeks for 4 weeks of work will cause burnout.
- Copy the same tools table across every phase. Each phase's tools should reflect that phase's work.

## Reviewing content

Before committing a content change, confirm:

- [ ] All 12 mandatory sections present, in order.
- [ ] `## Lesson` is at least 3,000 words and sits after `## Specific topics to learn`.
- [ ] At most one optional section used, and only where it fits.
- [ ] Tools table has exactly 6 columns, and every paid row has a free alternative.
- [ ] Deliverable is a specific artifact, not a vague outcome.
- [ ] Checklist items are `- [ ]` and each is independently checkable.
- [ ] Typographic characters are real, not ASCII substitutes.