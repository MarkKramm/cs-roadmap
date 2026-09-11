# Content Guide

How to write and maintain the study curriculum under `career-roadmaps/`.

This is the authoring standard. Follow it when adding a phase, editing topics, or reviewing content.

## Who this content is for

A beginner in the Philippines with basic past web-dev exposure, no degree, no certs, no professional IT or cybersecurity experience, a $0 budget, and about 2–4 focused hours per day, 5 days a week. They burn out easily and need small, visible wins.

Every writing choice should serve that reader.

## Phase file shape

Every `NN-phase-*.md` file uses the same structure. The **11 mandatory sections**, in order:

1. **Title + Goal of this phase** — one or two sentences. What the phase produces, not what it "covers".
2. **Estimated time** — realistic weeks, not optimistic ones. Include buffer. Be honest if something takes longer for a beginner.
3. **Skills you'll gain** — observable abilities, written as "can do X".
4. **Specific topics to learn** — concrete subtopics. Not "networking" but "IPv4, IPv6, DNS, DHCP, NAT, TCP/UDP, common ports".
5. **Tools for This Phase** — a table. See the Tools-table contract below.
6. **Free/cheap resources** — actual names and links. Free only; paid resources belong in the Free vs Paid section.
7. **Hands-on practice tasks** — numbered, actionable, doable on a single computer with free software.
8. **Deliverable / proof of work** — one specific file or artifact the learner produces.
9. **Checklist** — `- [ ]` lines. One line per checkable outcome.
10. **You're ready to move on when…** — a single sentence describing the exit bar.
11. **Free vs Paid** — three sub-sections: What's free and enough, What's paid and why you'd upgrade, When it's worth paying.

**Five optional sections** slot in after "Skills you'll gain" when they apply:

- **Specific topics to learn** — most phases (default)
- **Lab setup options** — cyber phases with hardware choices
- **Path options** — specialization-choice phases
- **Required projects** — portfolio phases
- **Recommended order** — certification phases
- **Target roles** — job-application phases

Use one; do not stack them unless the phase genuinely needs more than one view.

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

1. Create `career-roadmaps/<new-track>/00-overview.md`.
2. Add the track to `career-roadmaps/README.md` (the strategy document).
3. Add a `TOOLBOX.md` if the track has tools.
4. Update the content-model table in [`ARCHITECTURE.md`](ARCHITECTURE.md).
5. Commit with a `docs:` prefix.

## Anti-patterns

Do not:

- List concepts without tools. "Learn about SIEMs" is not a task.
- Reference a paid resource without a free alternative.
- Write a phase without a deliverable.
- Use `--` for an em-dash, `?` for a curly quote, or `???` for a tree branch. See [`WORKFLOW.md`](WORKFLOW.md).
- Inflate scope. A phase that claims 2 weeks for 4 weeks of work will cause burnout.
- Copy the same tools table across every phase. Each phase's tools should reflect that phase's work.

## Reviewing content

Before committing a content change, confirm:

- [ ] All 11 mandatory sections present, in order.
- [ ] At most one optional section used, and only where it fits.
- [ ] Tools table has exactly 6 columns, and every paid row has a free alternative.
- [ ] Deliverable is a specific artifact, not a vague outcome.
- [ ] Checklist items are `- [ ]` and each is independently checkable.
- [ ] Typographic characters are real, not ASCII substitutes.