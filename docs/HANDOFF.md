# Handoff — all guards proven able to fail, and the glossary shipped

**Last updated 2026-10-02.** The advance track's claim pass described below was
completed on **2026-09-28** and committed as `e333ce9`; that is a dated record of
one pass, and the sections below it are unchanged. **Twenty-two commits landed after that, and they are recorded here.** The six
most recent close the last unguarded guards, replace a guard whose premise had
become false, and ship the glossary; the ones before them are the browser-suite
and figure work. **The "since then" row below was itself stale when this session
started** — it listed two commits and there were twenty. That is this file's own
recurring failure, caught by reading it against `git log` rather than by reading it.
**Nothing is in flight.** This file does not describe work to do; it records what
was finished and what a later session should know before starting something new.

**If you are reading this to decide what to do next, read "What is settled" and
"Still open" first.** The short version: *every* content guard now has a controls
suite, the glossary is partially shipped on purpose, and the two remaining
workstreams are named under **Still open** below.

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
| Branch | `main`, clean tree, **fully pushed**, in sync with `origin/main` as of **2026-10-02** |
| That pass | `ffe8445` (worklist and the 8 classes it needed), `50e52f8` (Sigma + the new guard), `ea2d55b` (ATT&CK), `77fe6dd` (queries), `e333ce9` (the 508-row result) |
| Since then | **Everything from `7a3ff17` to `90e052e`** — 22 commits, listed newest-first in `git log 090c695..HEAD`. Deliberately a range rather than a list: the two previous versions of this row enumerated commits and were both wrong, because a list goes stale the moment the next commit lands. The three that change what a reader should do next are `04206b5` (a guard replaced), `0841f22` (the last guards, and a suite that dirtied the corpus), and `90e052e` (the glossary) |
| Guards | **27 content guards, 27 control suites, 16 site suites — all green, re-run 2026-10-02.** Every content guard now has a controls suite; the 26th and 27th are `audit-markdown-render.mjs` (replaced, see below) and `audit-glossary.mjs`. The 18th through 27th control suites came from the 2026-10-01/02 work, and **writing them found four real defects** — see **What is settled** |
| Browser suite | **152 checks, 0 failed — re-run 2026-09-30 against a fresh `dist/`, driving local Edge over CDP.** Four of the 152 are new and were added after a screenshot found a defect all 148 had missed: the per-section done control was `opacity: 0` and drawn in a border at 1.47:1, so a done section was 5.7× more visible than an undone one. **Nothing in the suite referenced `.lesson__done` at all** — every check asked whether the control works, none asked whether a reader can see it. The new checks assert perceptibility in a real engine and were proven falsifiable by reintroducing each defect in turn. **This row previously said the suite could not run here at all, and the reason it gave was wrong.** It said "Playwright and Chromium are not installed", but `browser-check.mjs` never needed Playwright: it imports only `node:child_process`, `node:fs`, `node:os` and `node:path`, and drives whichever Chromium-family browser it finds on the machine over the DevTools protocol using Node 24's global `WebSocket`. Playwright was **deliberately declined** under the zero-new-dependencies rule (see **D-023** in `docs/DECISIONS.md` — a few hundred megabytes of browser download for about twenty CDP commands). Edge was installed here the whole time, at the first path the script probes. **The cost of the wrong reason was that the one unverified part of the product was written off as unverifiable**, when it took one command to check. |
| All three tracks | IT 225 rows, cyber 411 rows, advance 508 rows — **1,144 recorded claim rows** |

## What is settled, as of 2026-10-02

**Every content guard now has a controls suite.** On 2026-09-30 nine of the 26
guards had none. All nine were closed over 2026-10-01 and 10-02, and the work found
real defects rather than confirming what was already believed:

- **`PLACEHOLDER` in `audit-content.mjs` could never fire.** The rule put a word
  boundary *after* `TODO:`, demanding a word character where a real marker always
  has a space. It matched only `"TODO:no space"` and the lorem string.
- **`audit-time-budget.mjs` had never checked one real budget table.**
  `advance-roadmap/01-phase-detection-at-scale.md:564` was out of scope because its
  column header is `Hours/month` and the matcher required exactly `Hours`.
- **`audit-markdown-render.mjs` was REPLACED, not repaired.** Its premise —
  "learning-site has no Markdown renderer" — had been false since `renderInline.jsx`
  landed, so it was reporting **1,458 correctly-rendered spans as defects**, read
  only 2 of 6 generated files, and had no `process.exit` at all. **A guard whose
  premise is false cannot be made true by testing it.**
- **The CI comment for `audit-quiz.mjs` misattributed three of its four claims.**
  The guard catches one; a `why` flag was parsed and never read, and a second
  `[x]` overwrites the answer index rather than being counted. All three were
  enforced elsewhere all along, so nothing was ever unenforced — but a reader
  debugging a quiz would have looked there, seen nothing, and concluded the check
  did not exist.

**The glossary is shipped, partially, and says so.**
`career-roadmaps/shared/GLOSSARY.md` holds **47 verified entries of 309 domain
terms (15%)** and is rendered in the site as the seventh shared document. It is
partial **by design**: the extractor proposes an expansion for 64 terms and a large
minority are confidently wrong (`KQL` → "Microsoft Sentinel and Defender XDR",
`ICS` → "The incident command system"). 17 were rejected with the reason recorded
in the document, because a rejected candidate is a place where the **corpus**
currently implies something wrong. `scripts/audit-glossary.mjs` fails the build if
an entry's expansion is no longer at the line it cites. Coverage is deliberately not
gated. **D-080.**

**Three things the work cost, because they are the parts worth remembering:**

1. **`docs/CHECKPOINT.md` was emptied by a text edit** — 401 lines to 0, restored
   with `git checkout`. Every change to that file afterwards went through a script
   that asserts its anchors and the result size *before* writing.
2. **A control suite wrote a defect into the corpus.** `test-audit-lesson-code.mjs`
   left a mutated SCP policy in `advance-04`, and the next guard run reported it as
   a genuine finding — **a defect the test wrote, reported as a defect in the
   content.** All three write/restore pairs in that file are now paired, and the
   suite is verified idempotent. **D-079.**
3. **A checked figure silently stopped existing.** `audit-doc-figures.mjs` read a
   sentence from `DESIGN-SYSTEM.md`; a rewrite removed it; the pattern then matched
   nothing and the guard reported **DOC CLAIMS OK**. An absent claim and a
   satisfied claim were indistinguishable — the `^0[1-9]-` bug in a document rather
   than a file list.

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

## Still open, as of 2026-10-02

**Three bodies of work remain.** None is urgent, and all three are recorded so a
new session does not have to rediscover them.

1. **The glossary backlog — 262 domain terms with no entry.** 248 have no findable
   expansion; **17 have one that is wrong and should be fixed at the source line**;
   the rest are glosses where an expansion belongs. The 17 are the best-value
   content work available, because the corpus is currently misleading readers in 17
   places and fixing a phase is better than annotating the mistake.
2. **Two rot classes still unguarded** — ATT&CK revoked IDs and tactic slugs, and
   NIST *retitles* (`audit-nist-current.mjs` catches *withdrawn* only; SP 800-50
   Rev. 1 was retitled in September 2024 and stayed live). Both need a dated
   snapshot with its own expiry, which the handoff already names as its own piece
   of work. Do not add a version-free guard; that is D-066's shape.
3. **Routing (D-007)** — views are local state, so there is no URL and no history
   entry, and refreshing or sharing a link loses the reader's place in a 495,000-word
   curriculum. This reverses a recorded decision, so it is deliberately last.

**And the two items that need a human, unchanged and still open:** the **283
practice tasks, none ever timed**, and the **15–20 posting sample** behind the
macOS/MDM market claim. No agent can close either.

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
