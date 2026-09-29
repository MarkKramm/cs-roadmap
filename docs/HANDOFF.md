# Handoff — all three tracks claim-verified

**Last updated 2026-09-29.** The advance track's claim pass described below was
completed on **2026-09-28** and committed as `e333ce9`; that is a dated record of
one pass. The two commits since it — `0169b5c` (an audit of this handoff's own
accuracy, which found it stale) and `090c695` (the lesson-code guard and the four
content defects it found) — are covered under **What is settled** below rather
than in the state table. **Nothing is in flight.** This file does not describe
work to do; it records what was finished and what a later session should know
before starting something new.

**Why the preamble is shaped this way.** A commit hash in a table headed *current
state* is wrong the moment the next commit lands, and it can never be
machine-checked, because the commit that added the check would itself invalidate
it. So the state table carries a **date** rather than a hash, and hashes appear
only in rows explicitly about a finished pass. `docs/DECISIONS.md`'s preamble
already states the rule: a record says what was true when it was written, and
correcting it would destroy the record.

## Where the repository is

| | |
|---|---|
| Branch | `main`, clean tree, **fully pushed**, in sync with `origin/main` as of **2026-09-29** |
| That pass | `ffe8445` (worklist and the 8 classes it needed), `50e52f8` (Sigma + the new guard), `ea2d55b` (ATT&CK), `77fe6dd` (queries), `e333ce9` (the 508-row result) |
| Since then | `0169b5c` (this handoff audited against reality — it had gone stale), `090c695` (`audit-lesson-code.mjs` + its controls, D-075; four content defects fixed) |
| Guards | 24 content guards, 16 control suites, 16 site suites — **all green, re-run 2026-09-29** |
| Browser suite | **148 checks, 0 failed — re-run 2026-09-29 against a fresh `dist/`, driving local Edge over CDP.** **This row previously said the suite could not run here at all, and the reason it gave was wrong.** It said "Playwright and Chromium are not installed", but `browser-check.mjs` never needed Playwright: it imports only `node:child_process`, `node:fs`, `node:os` and `node:path`, and drives whichever Chromium-family browser it finds on the machine over the DevTools protocol using Node 24's global `WebSocket`. Playwright was **deliberately declined** under the zero-new-dependencies rule (see **D-023** in `docs/DECISIONS.md` — a few hundred megabytes of browser download for about twenty CDP commands). Edge was installed here the whole time, at the first path the script probes. **The cost of the wrong reason was that the one unverified part of the product was written off as unverifiable**, when it took one command to check. |
| All three tracks | IT 225 rows, cyber 411 rows, advance 508 rows — **1,144 recorded claim rows** |

## The advance track's result

`docs/ADVANCE-CLAIM-VERIFICATION.md`: **508 rows — 444 `OK`, 17 `WRONG`, 47
`UNVERIFIABLE`, none outstanding.** All 17 wrong claims are fixed in the corpus.

The figures in that document are **re-derived from its own rows** by
`audit-verdict-counts.mjs --track advance`, so the record cannot drift from its
evidence. `scripts/record-advance-verdicts.mjs` reads the verdicts back out of
the worklist packs rather than carrying a hardcoded copy, which is the
difference from the IT track — whose header once read "verified" over 225 empty
verdict columns for sixteen days (D-055).

### The 17 wrong claims, by class

- `date: 2026/03/14` in **six places** — the spec mandates ISO 8601 with dashes and
  the schema constrains the value with a regex slashes cannot match. Phase 07 was
  already conformant, so the corpus contradicted itself.
- `sigma check --fail-on-issues` **cannot** enforce an empty `falsepositives`
  list; the phase said it could in four places.
- A hunt query that **returned nothing** — `where X IN ("*\\rundll32.exe", …)`; the
  `in` function forbids wildcards.
- A revoked ATT&CK ID (`T1562.001` → `T1685`) and Defense Evasion's retirement as
  a tactic.
- An Entra audit filter missing the `(permanent)` suffix that makes the string real.
- A `kubectl describe` claim the tool does not support, a NIST publication under
  its superseded title, an AWS CLI payload with the wrong nesting, a process-tree
  column off by one generation.

**The guard written from the Sigma constraints then found an eighth date instance
in the *cyber* track**, in a phase whose verification was marked complete since
2026-09-18. Seven phases of reading missed what a regex catches — the argument
for a guard over a pass.

**A verifier's `WRONG` verdict was also wrong once.** The first report on the
policy walkthrough concluded a deny statement permits nothing; the JSON beside it
re-denies five services. D-038's rule is symmetric and this pass is the case that
proves it.

## What is settled, and what is not

**Done and guarded.** The advance track's claims. The Sigma schema guard
(`audit-sigma.mjs`, 13 controls) is in CI and already found a real defect in a
"completed" track. **And now the code itself**, which until 2026-09-29 nothing
had ever parsed: `audit-lesson-code.mjs` (36 controls) reads all 62 Markdown
files under `career-roadmaps/` and checks all 650 fenced blocks, and it is the
first guard to cover the defect D-036 named. Three of its four tiers gate; the
fourth reports, on purpose.

**It found one real defect on its first run, and that defect is now fixed.**
`advance-02:482` was stage 2 of a hunt and named three proxy binaries where
stage 1 named four, dropping `installutil.exe` and `\Users\Public\`. Because the
two stages are linked by re-typing the same filter rather than by inheriting
stage 1's output, an `installutil` hit that stage 1 returned could never reach
stage 2 — and the query still returned rows, just never the interesting ones. The
filter now matches and the phase explains why it must.

**Read that guard's coverage table, not its exit code.** It ends every run with
an explicit list of what it does *not* check — whether a Python or PowerShell
block compiles, whether a block *runs*, whether a query is a good detection — and
a count of how many blocks sit under a fence label that opts them out entirely.
**The cross-notation tier reports rather than gates**, because whether a hunt's
second stage *should* be narrower than its first is a judgement about intent,
not a fact about the text. It reports only the narrowing direction, since a wider
second stage loses nothing; an earlier version reported any difference at all and
produced four findings for that one real defect, which is the number that trains
people to skip a report.

**One blind spot worth knowing about, because it is a design decision and not an
oversight:** the guard is checked against real PowerShell 5.1 by hand, and an
independent reimplementation of it found a live false negative — a dropped `)`
inside a `$( )` subexpression, which occurs six times in the corpus and is
balanced six times by luck rather than by rule. That is fixed and now has its own
control. **It is the reason a guard's controls should be written by something that
is not the guard.**

**Two rot classes found and deliberately left unguarded**, recorded in the pass
document rather than left implicit:

- **ATT&CK revoked IDs and tactic slugs** — a guard would need a dated snapshot of
  the matrix, and the snapshot needs its own expiry date.
- **NIST *retitles*** — the existing `audit-nist-current.mjs` catches *withdrawn*
  publications only. A retitle is a different rot class (SP 800-50 Rev. 1 was
  retitled in September 2024).

An honest guard for either is a snapshot with an expiry date, and writing that
snapshot is its own piece of work. **Do not add a version-free guard that looks
for the current answer** — that is D-066's shape.

**Two open items need a human** and cannot be closed by any agent: the **283
practice tasks, none ever timed**, and the **15–20 posting sample** behind the
macOS/MDM market claim. Both are in `docs/ROADMAP.md`.

## Loose ends, both closed 2026-09-28

- ~~`docs/WORKFLOW.md` describes `extract-claims.mjs` without mentioning `--track advance`.~~ **Fixed**,
  along with a warning the omission was hiding: **the extractor overwrites the worklist, so running it
  after a pass has recorded verdicts destroys them.** Its own checklist line said to re-run it after any
  phase prose change, which on a completed track would have thrown the pass away. The class set is also
  per-track, and a worklist reporting 140 rows for the senior material was the absence of coverage
  reading as coverage.
- ~~`scripts/build-cyber-bundles.mjs:114` hardcodes the track name in its closing message.~~ **Fixed
  2026-09-28.** It read `TRACK_KEY === "it" ? "IT" : "CYBER"`, which printed a link to
  `docs/cybersec-CLAIM-VERIFICATION.md` for the default run — a filename that has never existed. The
  folder key is `cybersec` and the document key is `CYBER`, and deriving one from the other is the
  whole bug. It is now a lookup that fails loudly if a track has no mapped document.

## The method, if another pass is ever run

The discipline that produced three tracks' worth of claims and did not fabricate a
single one:

- **A `WRONG` is checked against the primary source before any content changes.**
  D-038: a model's answer remains not a source.
- **`UNVERIFIABLE` is a real result** and is expected to be common — 21% on IT,
  17% on cyber, 9% here (the advance track is denser in design reasoning, which
  no source settles). **An invented URL is worse than a gap**, because it will be
  acted on.
- **A wrong `OK` is invisible; a wrong `WRONG` sends someone to re-read correct
  content.** Weight the errors accordingly.
- **A verdict may only be transcribed from a verifier's results, never authored**
  (D-057). Keys are read out of the pack or not written at all.

The recorders exist so the last point is mechanical rather than a matter of
restraint.
