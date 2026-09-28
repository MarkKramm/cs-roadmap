# Handoff — all three tracks claim-verified

**Written 2026-09-28. The advance track's claim pass is complete, committed as
`e333ce9`, and pushed.** Nothing is in flight. This file no longer describes work
to do; it records what was finished and what a later session should know before
starting something new.

## Where the repository is

| | |
|---|---|
| Branch | `main`, clean tree, **fully pushed** — `d83fb25..e333ce9` |
| This pass | `ffe8445` (worklist and the 8 classes it needed), `50e52f8` (Sigma + the new guard), `ea2d55b` (ATT&CK), `77fe6dd` (queries), `e333ce9` (the 508-row result) |
| Guards | 23 content guards, 15 control suites, 16 site suites, **148 browser checks** — all green |
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
"completed" track.

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
