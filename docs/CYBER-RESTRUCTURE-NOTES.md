# Cyber lesson restructure — style guide

Working notes for the readability pass over `career-roadmaps/cybersec-roadmap/01-08`.
Not part of the curriculum; delete when the pass is done.

## The goal

The cyber lessons are accurate but **dense**. Measured against the IT track:

| | IT (9 phases) | Cyber (8 phases) | Target |
|---|---|---|---|
| Average paragraph | 34.8 words | 52.4 words | **≤ 45** |
| Average sentence | 15.6 words | 19.8 words | **≤ 18** |
| Tables per phase | 41.7 | 21.1 | **≥ 15** |
| Longest paragraph | 193 | 183 | **≤ 120** |

Density is what makes a lesson feel like work. Same knowledge, better
presentation, reads in half the time.

## The one hard rule

**Never remove content.** This pass adds and reorganises; it does not cut.

- Every fact, command, flag, number, example, and warning survives.
- Word count must **not decrease**. If it drops, something was lost — stop.
- Adding is encouraged. These lessons average 6,040 words against IT's 10,368,
  so most have room to grow.

Restructure means: split long paragraphs, break long sentences, convert
enumerations into tables, add subheadings, add worked examples.

## The rules

### Paragraphs
- **One idea per paragraph.** If a paragraph makes two points, split it.
- **Target 25–45 words.** Three sentences maximum.
- Never exceed 120 words. A 180-word paragraph is a wall.

### Sentences
- **Target 12–18 words.** One clause where possible.
- Split on "and", "but", "which", "because" when both halves stand alone.
- Keep sentences that are long *because the idea is long* — a list of six
  related items reads fine. Cut padding, not substance.

### Tables — the highest-value fix
Convert these into tables:
- Any run of three or more parallel `-` or `1.` items with the same shape
- Comparisons ("X does A, Y does B")
- Command → what it does
- Symptom → likely cause → first check
- Term → plain-English definition

A table is almost always better than a paragraph listing three or more things.
Phases 4, 5, 6 need the most work here.

### Subheadings
- A subheading every **150–250 words**. Cyber currently sits at ~259.
- `####` for sub-parts, `###` for major parts.
- A subheading should be specific enough to navigate by: "Reading a packet
  capture" beats "More detail".

### Worked examples
This is the biggest gap. Every major concept needs at least one concrete
worked example — a real command with real output, a real scenario walked
through step by step. Prefer:

- **Real command, real output**, with a line-by-line reading of what it shows
- **A scenario**: "A user reports X. Here is how you narrow it down."
- **A failure case**: what it looks like when it goes wrong, and why

### Tone
- Second person, direct: "you run", "you see", not "one might run".
- Explain *why* before *how*. The reason is what sticks.
- Beginner-friendly and budget-aware ($0). Do not add paid requirements.

## Hard constraints from AGENTS.md

1. **LF line endings**, no CR.
2. **UTF-8 without BOM.**
3. **Real typographic characters** — `—` `–` `“ ”` `’`. Never `?` or `--` as a
   substitute.
4. `## Lesson` must stay where it is, and the closing `### Key takeaways` and
   `### Practice this next` must remain the **last** things before the next
   `##` section. Nothing may be stranded after them.
5. Resources lines keep the URL last: `Name — https://…`.

## Verification

Every phase must pass all of these before it is committed:

```bash
node scripts/lint-content.mjs                     # encoding, typography
node scripts/audit-content.mjs                    # section structure
node scripts/audit-readability.mjs                # the readability targets
node scripts/build-content.mjs                    # JSON builds
node scripts/verify-counts.mjs <baseline.json>    # task counts unchanged
cd learning-site && npm run test:smoke            # renders
```

Then compare against the baseline:

```bash
node scripts/cyber-restructure-check.mjs
```

The check fails if any phase's lesson word count went down.

## What this pass is NOT

- Not a rewrite from scratch. The research is sound; the presentation is not.
- Not a place to add new phases or paid tools.
- Not a reason to touch the IT track. It already meets the targets.