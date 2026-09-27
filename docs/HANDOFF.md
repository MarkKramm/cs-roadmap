# Handoff — the advance track's claim verification pass

**Written 2026-09-28, at the user's request, mid-pass.** Everything below is
committed, the working tree is clean, and the full suite is green. Nothing is in
flight. The pass itself is roughly one-fifth done and the next step is named.

## Where the repository is

| | |
|---|---|
| Branch | `main`, clean tree, **2 commits ahead of the previous checkpoint** |
| This work | `ffe8445` (the worklist and the classes it needed), `faf733e` (CI registration) |
| Previous state | `15c3aa4` — the exam corpus repair pass, which was fully pushed |
| Guards | 22 content guards, 14 control suites, 16 site suites, **148 browser checks** — all green |
| Nothing lost | The interrupted session had committed all of its work before the interruption |

## What this pass is

The IT track (225 claims) and the cyber track (411 claims) have both had every
checkable technical claim verified against a primary source. **The advance track
had none** — 7 phases, 116,214 words, the most senior material in the repository,
and no external verification at all. That was the gap this pass opened.

## What has actually been done

**The instrument is finished and proven.** This was the substantive half.

Running the extractor's existing thirteen classes over the advance phases
produced **140 rows, of which zero** were an AWS policy action, a Sigma field, an
SPL command or a Windows event field — on material that is largely made of those
things. That is the defect this repository has now recorded several times: an
instrument reporting a clean result about the wrong subject, which reads as
coverage. Eight classes were added for the track's actual subject matter, and
the worklist went from 140 to **740 claims, 508 of which need a source**.

Four defects were found *in the instruments* by running them, not by reading
them. All four are in the commit message for `ffe8445`; the two worth carrying
forward:

- **`collect()` split backslash-continued commands line by line.** A four-line
  `az account management-group subscription add \` invocation became four rows:
  one naming a verb group with no flags, and three bare `--name "…"` fragments
  whose surrounding context showed two more flags rather than the command they
  belong to. A verifier cannot check any of them. Continuations are now joined.
- **`lint-content.mjs` called KQL's `(?i)` a mojibake character.** The rule was
  "ASCII `?` followed by a letter". A first fix used a lookahead — the wrong
  side; the bracket *precedes* the question mark in `(?i)` — and fired on the very
  line it was written for. Narrowed with a lookbehind and proven in both
  directions.

**The verification itself has not started.** One pack was trialled end-to-end to
confirm the method works: the 4-row Rego/OPA pack, verified against the OPA
policy language reference, all four rows `OK`. That trial was **not written back
to any file** — it exists only in a conversation. Expect to redo it; it took
minutes.

## The next step, precisely

`docs/claims-to-verify-advance/` holds **21 packs, 508 rows**, all with empty
verdict columns. The packs are self-contained: each carries its own instructions
and needs nothing added. Fill each one's Verdict column in place, then record
them.

Suggested order, cheapest and highest-yield first:

| # | Pack(s) | Rows | Why first |
|---|---|---|---|
| 1 | `03-sigma-rule-specification-*` (2) + `05-detection-as-code-tool-flags-and-status` | 85 | The highest-value single claim in the whole track: whether `sigma check` fails on issues by default. |
| 2 | `01-mitre-att-ck-*` (2) | 83 | Pure identifier lookup against attack.mitre.org. Cheapest per row in the set. |
| 3 | `00-cloud-iam-*` (4) | 139 | Largest class. Check `prefix:Action` pairs against the AWS Service Authorization Reference. |
| 4 | `02-siem-search-language-spl-*` (2) | 66 | Splunk Search Manual per command. |
| 5 | everything else (11 packs) | 135 | `cloudcli` 35, `winevent` 20, `lolbin` 19, `protocol` 17, `cybercmd` 13, `standard` 12, `version` 10, `rego` 4, `command` 3, `registry` 2. |

### Two instructions that make the pass better than the last two

The pack header now says both of these (rules 10 and 11). They are new, and they
are the difference between a pass worth recording and a pass that launders the
table format into a result.

1. **A row's text may be truncated at 260 characters. Read the real line before
   judging it** — the Location column gives `<phase-file>:<line>` and the files
   are on disk. An earlier pass returned `UNVERIFIABLE — text truncated` on rows
   that were perfectly checkable, because the pack was all it had been given. An
   unverifiable row costs a reader the knowledge that nobody checked it.
2. **Write the verdict into the table in place**, editing only the empty Verdict
   cell. Do not reformat, reorder, or re-quote the claim text — a script reads
   the verdicts back out by row number.

### The discipline that has not changed

- **Verify every `WRONG` against the primary source yourself before changing any
  content.** D-038: *a model's answer remains not a source.* This is what caught
  three first-pass defects being real, and what would have caught 145 fabricated
  verdicts.
- **`UNVERIFIABLE` is a real result and is expected to be common** — 21% on the
  IT pass, 17% on cyber. Do not push a verifier to fill a column. An invented URL
  is worse than a gap, because it will be acted on.
- **A wrong `OK` is invisible; a wrong `WRONG` sends someone to re-read correct
  content.** Weight the errors accordingly.

## After the packs are filled

1. **Write the verdicts into `docs/ADVANCE-CLAIM-VERIFICATION.md`**, keyed by
   `(class, row number)`. The cyber track's recorders do this from a hardcoded
   list; a recorder that reads the filled packs would remove a whole
   transcription step and its error class. Whichever is chosen, it must **fail
   rather than drop a verdict it cannot place.**
2. **Set `done: true` / `doneThrough`** in the `advance` list in
   `scripts/split-claims.mjs`, so a class stops regenerating. Until then the
   splitter will re-emit its pack.
3. **Rewrite the document's status line and add the results table.** The
   generated one currently reads *"Status: claims extracted. NO verification pass
   recorded yet."* and must not be left contradicting the rows.
4. **`audit-verdict-counts.mjs --track advance` will then start checking the
   table** instead of reporting outstanding work. It already has the advance
   track registered; the results-table branch is the only untested path, so
   expect to fix something there.
5. **Fix every `WRONG` claim in `career-roadmaps/advance-roadmap/`**, then
   re-run the guards — several of them (`audit-doc-figures`, `audit-refs`,
   `lint-content`) will notice the changed text.
6. **Record it**: `docs/ADVANCE-CLAIM-VERIFICATION.md` prose, a `DECISIONS.md`
   entry if a new class of defect is named, a `CHANGELOG.md` entry, and the
   `CHECKPOINT.md` rows that currently say the advance track has no verification
   pass.
7. **Two open items will still need a human** and cannot be closed by any agent:
   the **283 practice tasks, none ever timed**, and the **15–20 posting sample**
   behind the macOS/MDM market claim. Both are recorded in `docs/ROADMAP.md`.

## The guard that will hold the line

`node scripts/audit-verdict-counts.mjs --track advance` currently prints:

```
NO RESULTS PUBLISHED — 508 claim(s) across 15 class(es) await a verdict.
```

and **fails** if any of those 508 rows stops being tracked as outstanding, or if
a class holding rows is missing from the splitter's list, or if the document's
printed outstanding figure disagrees with its own rows. That last one is the
guard the other two tracks' D-038 failure produced, and it is in CI.

## Two loose ends worth knowing about

- **`docs/WORKFLOW.md:149` and `:187`** describe `extract-claims.mjs` without
  mentioning `--track advance`. Not updated; a one-line fix.
- **`scripts/build-cyber-bundles.mjs:114`** hardcodes
  `TRACK_KEY === "it" ? "IT" : "CYBER"` in its closing message — the same
  per-track-string bug just fixed in `extract-claims.mjs`. Untouched, because
  that script is not part of this pass.
