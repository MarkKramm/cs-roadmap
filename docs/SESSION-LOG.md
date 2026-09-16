# Session Log

A chronological record of working sessions. Newest first.

## 2026-09-16 (latest) — The audit re-read itself, and two of its verdicts did not survive

**Goal:** test the one claim this repository had recorded against itself. `COMPREHENSION-AUDIT.md` closed with the honest caveat that its *findings* were falsifiable — each carried a line number and a quote and was re-checked against source — while its *verdicts* were one reader's judgement. The open item said the only way to test a verdict was a second pass with different readers. This is that pass.

**Eight fresh readers re-read all 23 phases with no sight of the first reports.** Roughly ninety fixes came out of it across sixteen phases, and the useful result is not the count.

**Two of the 23 verdicts changed, in opposite directions.** IT 02's `would abandon` was over-called — the domain-tooling defect it rested on is one ticket, not a wall — and IT 08's `followable with friction` was under-called. That is a two-for-two miss rate on the strongest verdict either pass can issue, from readers given the same brief on the same files, and it is now written into the audit: the findings remain falsifiable, the verdicts are advisory, and a third pass would not be expected to reproduce either set exactly.

**The worst new defect was the same class that keeps winning, in the worst possible place.** IT 06 asks the reader to build a ticketing workbook, and the priority formula at its centre builds a lookup key of `IndividualHigh` and searches `Lists!$A$2:$C$17` — whose first column holds *categories* (`Hardware`, `Software`, …). No cell matches, so every row returns `Check the grid`, and the prose calls that range "the lookup table it encodes" while printing the real grid six lines later. The reader follows the build exactly, gets a worksheet full of an error string, and has been told to trust the material. That is "executable code that cannot run" and "a worked artefact that cannot be produced" in the first thing the phase asks the reader to *do*. Replaced with an `INDEX`/`MATCH` pair against the grid placed explicitly on `Lists`, with the concatenated-helper-column route named as the other honest build.

**Cyber 09 did it twice more.** Its first executable artefact is a POSIX shell loop — `while read`, `$(...)`, backslash continuations, `2>/dev/null` — handed to a reader who may have no Linux shell, while Phase 4 explicitly permits a low-RAM reader to have no local VM; it now says where to run it. And its S3 audit reported `NO BLOCK CONFIGURED` as the only signal, when a bucket *with* a block configured can still be public through a policy — which is precisely what task 5 tells the reader to create. The command now makes three independent checks and the text says why one is not enough.

**The arithmetic class was productive again, and it is the class no structural guard can see.** Cyber 09 stated 60–80 hours over parts summing to 40–56, so the stated minimum exceeded the table's stated maximum. IT 06 called 18.41 GB of ~5 GB nightly dumps "thirteen days" — under four — and the entire worked ticket, including its "four days of headroom" note, was built on the wrong figure. Cyber 01 called a 6 h 51 m gap "nine hours late". Cyber 10–12 each stated a budget larger than their own tables. None of these is visible to a guard that reads one line at a time, because each is a claim about *two* places disagreeing.

**Five reported findings were rejected as false positives** — a well-formed BSSID, a nonexistent timezone line, two "report templates" that are both the top-level README, an acceptance row whose review value is present, and a "seven sections" list naming six plus a header. Five rejections against the first pass's two is the expected direction: a reader primed to find defects finds some that are not there, and the check is what removes them.

**The pass broke two gates itself, and both were caught.** Two edits pushed paragraphs past the 110-word ceiling and one cited "Parts 1–9" in a file with no Part 9. The readability gate and `audit-refs` failed on the next run; both were repaired before anything was committed. That is worth recording because it is the guards doing the job they exist for, on the work that was supposed to be improving the material.

**Verified:** lint **144 files / 0 issues**, readability **0 over 110** and **7 over 90** across 7 phases, `audit-refs` **0 findings**, `audit-content` 0 issues, lesson AST 23 / 0 loss, task IDs **252** unchanged, bands **183/0**, energy **183/183**, site suite 37 / 42 / **86** / 28 / **31** / **77** / 77 / 41, smoke **181 renders / 0 failures**.

**One correction worth recording.** The first draft of this entry said readability was "0 over 90". That was never true — the previous pass left 7 paragraphs in the 90–110 editorial band, and the gate reports that band without failing on it. The claim was written from the failure line rather than the summary line, which is exactly the mistake the two-threshold split exists to make visible: *reported* and *gating* are different columns, and reading only the second one produces a false clean bill. The added SSRF paragraph in cyber 14 briefly made it 8 before a split brought it back.

**Honest caveats, updated rather than repeated.** The verdict divergence is now measured rather than suspected, and it is the strongest argument in this repository against treating any single `would abandon` as fact. `FORWARD_AS_PRIOR` and the acronym scan still print without gating. The browser check is still one engine at two widths. And the largest untested claim is unchanged and now sharper: **nobody has timed a single curriculum task.** Every time budget here is an author's estimate, the second pass proved several of them were also internally inconsistent, and making the arithmetic add up is not the same as making the numbers right. That needs one reader with a timer, not another edit.

## 2026-09-16 (later still) — The density gate moved down, but only once there was nothing left for it to catch

**Goal:** finish the tightening that the previous pass had explicitly deferred. `audit-readability.mjs` gated at 150 words per paragraph while the editorial standard was 90, and the open item said so: *"Consider tightening the gate from 150 to 110 words once the backlog is cleared."* The backlog was not cleared. Four paragraphs sat over 90 — IT 01 at 91, IT 03 at 95, IT 05 at 94, IT 07 at 93 — so the item stayed open and the gate stayed at 150.

**The four paragraphs came first, and they are the whole argument for the order.** Each was a single paragraph carrying two ideas joined at a sentence boundary that already existed. Splitting them moved the break and changed no text — **every word preserved** — which is the same repair the 33 earlier walls of text received. Doing this *after* lowering the gate would have meant either grandfathering four known offenders or failing the build on work that was already on the list, and a gate with a grandfather list is not a gate.

**Then the gate moved to 110, not to 90.** The gap is deliberate and it is the substance of D-024. A gate at the editorial target would fail on every clarification a writer adds — and the four paragraphs that were just split exist *because* the text got easier to follow, not looser. 110 sits above that noise and below a genuine wall of text: it fails on prose a reader has to re-read, and passes prose that merely wants splitting. **The failure that keeps a gate honest is one it can pass.**

**Both thresholds are now named constants.** `EDITORIAL = 90` and `CEILING = 110` replace the five places the numbers used to be written as text — two column headings, two summary lines and the failure message — so the report and the gate cannot drift apart. The comment above them records why they differ, which is the part a future reader would otherwise have to reconstruct from the diff.

**Verified, not assumed.** Readability **0 of 23** phases outside target, `Paragraphs over 90 words: 0 across 0 phases`, `Paragraphs over 110 words: 0`; longest paragraph **90 (IT) / 86 (cyber)**; cross-references **0 findings across 25 files**; build clean; smoke **181 renders across 23 phases and 191 tools, 0 failures**. The site suites from the previous run stand unchanged — 37 / 42 / 86 / 28 / 31 / 77 / 77 / 41 and **50 browser checks / 0 failed**.

**Final state.** `HEAD == origin/main` with a clean tree after the commit. Guards: lint 144 files / 0 issues, content 0, AST 23 / 0 loss, readability 0 of 23 with **0 over 110** and 0 over 90, refs 0 across 25 files, site suite 37 / 42 / 86 / 28 / 31 / 77 / 77 / 41, smoke 181 renders / 0 failures, browser 50 / 0.

**Still carried forward, unchanged by this pass.** The audit's *verdicts* are one reader's judgement — only its findings were re-verified against source. `FORWARD_AS_PRIOR` and the acronym scan print without gating, so each needs a human. The browser check is one engine at two widths, so it is not a cross-browser matrix and does not cover the 561–860px band. And **nobody has timed a single curriculum task** — every band and energy value remains an authored estimate.

## 2026-09-16 (later) — A guard that could not fail, and the documentation that said it was fine

**Goal:** hand the pass over cleanly. What it actually turned up was a guard whose skip path was indistinguishable from its pass path, and four documents still describing the repository as it was several passes ago.

**The defect: a green tick that could mean nothing.** `learning-site/scripts/browser-check.mjs` shipped with an unconditional `process.exit(0)` when no browser was found, justified in its own header comment by "GitHub's ubuntu runner has none at any path this script looks in" — a claim that was **false**. `ubuntu-latest` has Chrome at `/usr/bin/google-chrome`, and CI run #43 already listed `Browser check (real engine)` as a passing step. So the file was both wrong about the runner and, worse, structured so that `completed / success` could not distinguish `50 checks, 0 failed` from `BROWSER CHECK SKIPPED`. This repository had already been bitten by that exact shape three times — the `^0[1-9]-` pattern that hid phases 10+, the storage-key guard that compared the test to itself, and the key-count assertion that threw instead of failing. **A check whose skip path looks like its pass path is not a check.**

**Two failure modes now exist, and both are guarded.** `BROWSER_CHECK_STRICT=1` (set in the workflow, and only there) turns a missing browser into exit 1 with `BROWSER CHECK FAILED`. `MIN_CHECKS = 40` catches the other silent pass — a run that connected to an error page and executed almost no assertions, where assertions that never ran would otherwise look like assertions that held. All four combinations were exercised locally: strict with no browser exits 1, non-strict with no browser exits 0 with an explicit `SKIPPED`, and with Edge present both modes exit 0 at 50 checks.

**The first attempt at testing that was itself broken, and it is worth recording.** It replaced `PATH` with `C:\Windows\System32` to hide the browser — which also hid `node`, so nothing ran at all and both cases reported nothing. The fix was to add a `BROWSER_PATH` override so the skip path is testable on a machine that *does* have a browser. A test that cannot run is not evidence, which is the same lesson as the guard it was testing.

**End-to-end proof, not local proof.** CI run **#45 on `57af97e`** is the first run of the strict-mode version, and the step **passed** — which means a browser was found, because strict mode fails the step otherwise. Before that commit, "it runs in CI" rested on run #43, a run of the version whose skip path exited 0. Recorded in D-023, CHECKPOINT, ROADMAP and CHANGELOG, each now citing both runs and saying which one carries the weight.

**Four documents still described CI as it was several passes ago.** `WORKFLOW.md` claimed two jobs running only lint and build+smoke, said "all 18 lessons" when there are 23, and did not mention `audit-refs` or `test:browser` at all. `ARCHITECTURE.md` and `ROADMAP.md` repeated the two-jobs-three-checks line. `README.md` line 58 said "Deploying the site is the remaining item" while the site has been live for weeks, and its Status paragraph stopped at M2. All four are corrected; the historical entries in this file and D-011 that say "18 phases" are **left alone deliberately**, because a log that describes the state when it was written is doing its job.

**Two documentation corrections were also made to the pass's own record.** The `audit-refs.mjs` false start count in `COMPREHENSION-AUDIT.md` was reconciled against the actual runs, and the CHECKPOINT tracked-file count was corrected from 143 to **144** — `audit-terms.mjs` was also new, and the count had been written before reconciling against `git ls-files`.

**Final state.** `HEAD == origin/main == b93e3f7`, tree clean. Guards: lint **144 files / 0 issues**, content 0, AST 23 / 0 loss, readability 0 of 23 outside target, refs **0 findings across 25 files**, site suite **37 / 42 / 86 / 28 / 31 / 77 / 77 / 41** and **181 renders / 0 failures**, browser **50 checks / 0 failed**. CI run **#46 on `b93e3f7` — `completed/success`, all 11 content steps and all 18 site steps.**

**Carried forward, and it is not nothing.** The audit's *verdicts* are one reader's judgement — only its findings were re-verified against source. `FORWARD_AS_PRIOR` and the acronym scan print without gating, so each needs a human to look. The browser check is one engine at two widths, so it is not a cross-browser matrix and does not cover the 561–860px band. And **nobody has timed a single curriculum task** — every band and energy value is an authored estimate.

## 2026-09-16 — An audit for the defect the guards cannot see, and the first real browser render

**Goal:** Three parts. Audit all 23 phases for beginner-comprehension defects and report only falsifiable findings; fix the real ones and add a mechanical guard for whatever class the audit **proves** detectable; then actually render the six never-verified views in a real browser.

**Part 1 — nine readers, 23 phases, and five real defect classes.** Every guard in this repository tests internal consistency: does the parser lose content, is the prose dense, do the cross-references resolve. None can see a phase that teaches *correctly* but cannot be *followed*. Nine subagents covered three phases each against a six-category brief (undefined term, assumed knowledge, unfollowable step, unearned leap, term avalanche, prerequisite order), each finding carrying a real line number and a verbatim quote. **Every finding was re-read against the source before a fix was applied, and three were rejected as wrong.**

What came out was not a term-density problem. It was:

1. **A demonstration that silently fails.** IT 05 Check 5 denied read on `C:\P5-AccessLab\Child`, then read a file in the *parent* folder and told the reader the Deny had won. The reader's own output contradicted the lesson — and Check 5 is the one exercise whose entire point is proving the permission model.
2. **A worked artefact that is impossible as printed.** Cyber 05's weighted totals (82/63/88/61) cannot come from its own table, whose weights sum to 14 — a ceiling of 70; recomputed to 58/47/61/44, which also inverts the "within 5 points" near-tie remark two lines later. Cyber 06's priority formula encoded 6 of the grid's 16 impact/urgency pairs, returned `P2` where the grid says `P1`, and indexed a 4-row range with entries 5–6. Cyber 14 stated a CVSS of **7.1** for a vector that computes to **6.5**, against its own band table that calls 6.5 Medium. Cyber 11 stated "2 minutes 58 seconds after the document was received" when receipt to execution is 6m29s — 2m58s is the gap from the file write two rows later.
3. **A cross-reference to a section that does not exist, or says the opposite.** IT 06 sent the reader to "Part 5's structure" for the escalation note, which is in Part 4. IT 07 referred to a nonexistent "Part 8". Cyber 03 claimed Phase 1 defined `least privilege` and `access review`, and Phase 1 never does.
4. **A contradiction inside one phase.** IT 09 set two different application targets (5–8 vs 15), three different follow-up intervals, and two different tracker column lists. Cyber 09 advertised a conditional-access lab that its own text later says needs a paid licence.
5. **Executable code that cannot run** — the class that wastes the most reader time, because the failure looks like the reader's own mistake. Cyber 12's corrected auto-closer printed `evaluated`, never defined: a `NameError` in the centrepiece of the lesson. Its `from lookup import` had no `lookup.py`, because the earlier example was never given a filename. Its README setup was Unix-only in a Windows-targeted curriculum. Cyber 10's Wazuh rule used a positive `<field>` match for the parents it meant to *exclude*, so it fired when the parent **was** the management tool — the inverse of the Sigma and SPL versions it was presented as equivalent to. Cyber 10's auditd rules had no target file and no load command, so the exercise could not be performed at all.

**One phase was judged "would abandon": IT 02.** Its Ticket 2 runs entirely on a Windows domain and `Get-ADPrincipalGroupMembership` for a reader whose stated machine is a home PC. It now says so, rather than leaving the reader to conclude they misconfigured something. **Cyber 07 came back clean, and was checked rather than trusted** — CVSS/CVE is taught in cyber 03, the setuid bit in cyber 02, Sysmon and Event IDs in cyber 03, the risk register in cyber 05. A clean bill is a useful result, which is why false positives were penalised in the brief.

**Two claims rejected, and one of them matters.** A subagent asserted that a reader who built IT 09's Part 4 sheet "gets a follow-up date in the wrong column". Part 4 puts Follow-up at position 7; Exercise 1 puts Follow-up date at position 7. `G2` is correct in both. The duplicated column list is a real defect; the stated consequence is not, and it was recorded as such rather than propagated into a fix that would have broken a working formula.

**Part 2 — one class is machine-checkable, and only one.** `scripts/audit-refs.mjs` gates on two things, both arithmetic on the text: a `Part N` reference to a heading the file does not have, and a `Phase N` reference to a number the track does not contain. It found the IT 06 and IT 07 defects, and on its first run against the repaired corpus it flagged `cybersec 11:64` — "you reason about risk from Phase 13" inside Phase 11, in a sentence opening "the skills from every phase before it converge". The cyber 10–12 reader reported the same line independently. **Two routes to one finding is the strongest evidence either produced.**

**The guard was wrong twice before it was right, and both corrections are comments in the file.** Its first run reported `cybersec 04:763` — "Phase 3's Part 4, made concrete" — as broken, because it resolved a phase-qualified reference against the containing file; Phase 3 *does* have a Part 4. Its second run flagged the *repaired* 11:64 sentence, because `PRIOR_CUE` included the bare word `from`, which matches "risk reasoning **from** Phase 13 arrives later" — a clause that explicitly disclaims prior knowledge. So `FORWARD_AS_PRIOR` is printed and does not gate.

**That is the same lesson the acronym scan taught, and it is worth stating once.** `scripts/audit-terms.mjs` was written to catch terms reaching the reader before anything says what the letters mean. Five measurement passes moved the domain count 365 → 232 → 232 → 227 → 72 and the residue was still `AMD`, `USD`, `UTC`, `PID`, `NTFS`, `CMD`, `ISP`, `SSID` — two brands, a currency code, and `PID` flagged on the line that reads "**PID** is the process ID". A targeted diagnostic proved the regexes worked (`MSP` at IT 01:600, `NOC` at 634, `PSU` at 359 — all lines that define the term in prose). **The class is real but not regex-detectable**, so the script is committed as a measurement that always exits 0, never a gate. A class belongs in CI when it is a claim about the text agreeing with itself. It belongs in a periodic human read when it is a claim about the reader's state.

**Part 3 — the six views, rendered at last.** The notes panel, the dashboard rail, the print stylesheet, the Shared view, the Your work view and the time-budget control had **never been rendered by a browser engine**. Two defects in that class had previously been found by a human reading CSS, which does not scale and does not repeat. `learning-site/scripts/browser-check.mjs` drives a real engine over the DevTools Protocol — **zero new dependencies**, because Node 24 ships a global `WebSocket` and the protocol is JSON over one socket, so Puppeteer's ~300 MB buys nothing. Every selector was read out of the component source first, so a selector that does not exist fails loudly rather than passing by finding nothing.

The two assertions no unit test can make are the point:

- **Focus survival.** The driver types one character, asserts the textarea still has focus, types a second, asserts the value accumulated. A parent that recreates the panel on each keystroke remounts the textarea and the reader loses focus after every letter — real, common, and invisible to any test that sets `.value` once.
- **The print media query actually applying.** `Emulation.setEmulatedMedia({media:'print'})`, then assert the sidebar computes to `display: none`, card borders to `none`, `--bg` to `#ffffff`, `break-inside: avoid` on code. The print path had only ever been checked as CSS text.

Both writes are verified through the real storage key (`cs-roadmap:time-budget:v1`, `cs-roadmap:notes:v1`), because a control that renders correctly but never writes is exactly the defect structural tests miss. `Your work` is asserted in the live DOM to carry no `N of M`, no percentage, no `role="progressbar"`. **50 checks, 0 failed** — and the honest result is that it found **no site defects**. Its first run reported three failures, and all three were the driver's own fault: it measured anchors on whichever Shared document opens first, while the resources list is the third. That is recorded in the file's comment and in D-023 rather than quietly fixed, because "the browser check found nothing" is only good news if the check is known to be able to fail. It runs in CI, where `ubuntu-latest` genuinely has Chrome, with the preview server started and torn down inside the step.

**Also fixed in passing:** `cybersec-roadmap/checklist-master.md` claimed "I enabled MFA and a conditional access policy in a free cloud tenant". Phase 09 says plainly at line 376 that conditional access needs Entra ID P1 and "this phase does not require you to buy one". A checklist row that cannot be completed honestly teaches the reader to tick anyway.

**Numbers after the content edits.** Readability **0 of 23** phases outside target (cyber 08 held at exactly 18 words/sentence, the ceiling), lint 143 files / 0 issues, lesson AST 23 lessons / 0 content loss, 0 paragraphs over 150 words, cross-references 0 broken, and the site suite 37 + 42 + 86 + 28 + 31 + 77 + 77 + 41 checks plus 181 renders, all green.

**Commits:** `d49c975` (audit fixes + the audit document), `aeb9fc3` (the cross-reference guard + cyber 10–12), `58b941c` (the checklist honesty fix), `fd1d841` (IT 03–04), `e4f2060` (the browser check + D-023 + CI step).

**Honest caveats carried forward.** The audit's verdicts are one reader's judgement per phase, and a different reader would draw the friction lines elsewhere — the *findings* are falsifiable and were checked, the *verdicts* are not. `FORWARD_AS_PRIOR` and the acronym scan both print without gating, so each needs a human to look. And the browser check is one engine on one machine, at two viewport widths; it is not a cross-browser matrix.

## 2026-09-15 (later still) — The writing gets read back, and the dashboard learns what time it is

**Goal:** Three workstreams chosen deliberately rather than by queue order — surface the shared strategy documents, give the reader's writing a reading side, and make "what should I do today?" time-aware.

**Phase 1 — `career-roadmaps/shared/` was unreachable, and had been the whole time.** `build-content.mjs` walks for `*-phase-*.md`; the anti-burnout rules, the 42-resource list and the weekly tracker are not phase files, so three documents written *specifically for the reader on a 34–112 week plan* had no path to them from the site. The fix reuses the existing lesson parser rather than forking it: `lesson-ast.mjs` gained a `headingBase` parameter, because a lesson is authored inside a `## Lesson:` wrapper (headings start at level 3) and a standalone document is authored `# Title` (level 1). **The default path is byte-identical** — the lesson rebuild after the refactor produced exactly the same 1997 KB, 1128 segments, 11374 terms as the baseline, which is the evidence that matters for a change to a parser that 23 lessons depend on.

The resource list is the part worth noting. It is `Name — https://url` lines, `renderInline` deliberately does not autolink, and rendering it as prose would have produced **42 unclickable URLs** — a document that looks complete and is useless. It is parsed into structured data and rendered as real anchors, and **the build fails** if the separator is wrong or a bullet appears before any category heading, because a silently mis-parsed catalogue is worse than a stopped build.

**The checkpoint recorded a gap against itself, and it was real.** Writing the "Guards not yet in CI" row was the useful part of this pass: `test:work` (31 checks) and `test:today` (77) were added the same day and never wired into `.github/workflows/ci.yml`, which ran only smoke, search and highlight. So the band table, the fitting rule and the addressed rules — three things whose failure mode is a wrong sentence rather than an exception — were guarded only on the machine that wrote them. `test:ui`, `test:data`, `test:notes`, `test:lesson-search` had the same status. All six are now CI steps, run standalone against the same tree first, so the workflow edit is verified rather than hoped for. A guard that only runs when someone remembers to run it is not a guard.

**Phase 2 — a workspace with no reading side is a silo.** D-019 shipped the writing and deliberately nothing else: a note was reachable only by navigating to the phase that owned it, so finding your own writing meant remembering where you put it. `Your work` gathers every phase note and every task answer into one page. Answers are matched **by id, never by position**, and an answer whose task no longer exists is **kept and flagged, not dropped** — it is the reader's writing, and deleting it because the curriculum moved would destroy the one thing on this site that cannot be regenerated. It carries no denominator, no percentage, and no ordering by volume; `summariseWork()` has no `total` field at all, so the absence is structural rather than a rendering choice someone can undo by accident.

**Phase 3 — and the defect the new test caught, which is the reason to write the test first.** The dashboard could not answer "I have forty minutes, is this a forty-minute task?" Nothing distinguished "plug in a USB stick" from "install VirtualBox and build a VM". A per-task minute count was rejected *after research, not by assumption*: 82% of the 183 practice tasks sit between 20 and 90 minutes, so any cut inside that range is an arbitrary line through a continuum. Only two honest edges exist — under ~20 minutes is essentially empty (4 tasks), and over ~90 minutes is *structurally* different, not merely longer. Word count and verb choice were measured and carry almost no signal: two tasks both 27 words long differ sixfold in real time, and "Install VirtualBox" (90 min) shares its phrasing family with "Install CrystalDiskInfo" (20 min).

Then `test-today.mjs` failed on its first run, on a case written before the picker existed:

> `✗ it is reported as not fitting — expected "none-fit", got "all-addressed"`

The first `pickToday` collapsed three different reasons into one "does not fit". An unaddressed `ongoing` task left `smallestBlocking` null and fell through to `all-addressed` — so the dashboard would have told a reader **"nothing left" while they still had work**, just not work that fits in one sitting. That is the single sentence this page must never get wrong, and it would have shipped. The taxonomy was split rather than the expectation relaxed: `only-ongoing` and `unjudged` are now distinct reasons with their own honest messages.

**`ongoing` as a band, and what it refuses to be.** Four bands, not three: the fourth is not a duration but a statement that a task is **not a single sitting** — recurring, week-gated, multi-session, or hardware-gated. More time does not turn a weekly retake into an afternoon, so it is an *exclusion path*: `fitsBand` fails closed on it in both directions. It is also deliberately absent from the time control, because it is a property a task can have, not an amount of time a person can have.

**A guard rewritten because it could not fail.** `test-data.mjs` asserted `KEYS.length === 9` and compared the registry against a fixture hand-maintained in the same file — **it compared the test to itself**. It had already broken on two consecutive key additions (8 → 9 → 10) while catching nothing. It now scans `src/` for `cs-roadmap:*:vN` literals and compares against `KEYS` **in both directions**: every key the site writes must be registered, and every registered key must actually be used. The duplicate, weaker assertion in `test-notes.mjs` was deleted for the same reason. That is the third time a key-count change broke this suite and the second time a guard printed nothing and was read as green.

**One content defect fixed in passing.** `it-roadmap/02-phase-operating-systems.md` had orphaned duplicate lines — verbatim copies of tasks 4–7 pasted after a `### When it's worth paying` heading. Pre-existing damage, not migration fallout. Removed.

**The honest caveat.** The notes UI, the dashboard rail, the print stylesheet, the Shared view, the Your work view and the new time control have **never been rendered in a browser** — they are verified structurally, by 181 render smoke tests, and by their unit suites. The print path is verified as CSS, not by printing. And **nobody has timed any curriculum task**, so every band and every energy value is an authored estimate. The UI says so on the page, and the smoke test asserts the word *estimate* survives there.

**Numbers.** 183 practice tasks banded (quick 23, focused 115, deep 34, ongoing 11) and 183 carrying energy (low 26, normal 128, high 29); **0 ids still minted from position**. Ten `localStorage` keys. Guard chain: 37 + 42 + 86 + 28 + 31 + 77 + 77 + 41 checks, 181 renders, build 453 KB raw / 133 KB gzipped, four repo-root audits clean.

## 2026-09-15 (latest) — Four read-only phases, found by a metric that could not lie

**Goal:** Maximise curriculum building while API access lasts. Chosen by measurement rather than by topic.

**The defect no existing guard could see.** Every check in this repository tests internal consistency: does the parser lose content, is the prose dense, do the links resolve. None of them asks whether a reader can *do* anything after finishing a phase. Counting concrete instructions per 1,000 lesson words answered it in one pass: **IT Phase 4 (helpdesk) sat at 0.11 and Phase 6 (ticketing) at 0.17**, against **4.84** for the strongest phase in the repo. Those phases were not thin — 9,478 and 5,734 words — they were *passive*. A reader finished 9,478 words about helpdesk work and had never worked a ticket.

This also retroactively explains an earlier conclusion in this log. A previous session assessed the IT track for depth and found "no pass is needed" for Phases 6 and 7, reasoning from word counts. **Word count was the wrong measure**, and it said two phases were fine that a reader could not act on. The phase that needed the most work was not the shortest — it was the one with the lowest ratio of doing to reading.

**What was added, all additive, roughly +37,000 words across nine phases.** IT 4, 6, 7, 8, 9 and cyber 1, 3, 6, 11, 13. Phase 4 went from 0.11 to **2.8** instructions per 1,000 words, above the strongest phase in the repository.

Every addition ends in something the reader keeps — a healthy baseline, a tracker, a written report, a portfolio artefact — rather than in notes. Every exercise has an answer, a model response, or a scoring key, because **an exercise the reader cannot check is not usable by someone studying alone**. That constraint shaped all of them, and it is why so much of the new material is weak-versus-strong pairs rather than instructions.

Three additions are worth singling out for *what they refuse to do*:

- **Phase 8's defence drill runs to a cut verdict.** It shows the five-question drill working on a resume line that **fails** and should be removed, rather than three clean passes. A drill that only ever validates is not a drill.
- **Phase 11's incident timeline marks every row as fact or inference with its source**, and claims neither that the user opened the attachment deliberately nor that data left the network — because neither was established. The root cause is written at three layers so each line names something a control can close.
- **Phase 13's risk register has one row explicitly accepted**, with residual equal to inherent score, because accepting a risk means the number does not go down. A register where everything is 15–20, or where the accepted row shows improvement, tells a reviewer the author is marking their own homework.

**Two audit failures found by re-running the guards rather than trusting the reports.** Both had been reported green. Phase 4 had *Practice this next* before *Key takeaways*; Phase 7 had new content stranded after the closing pair. Same checks, same files, opposite result twenty minutes apart — because the first run happened while the writes were still in flight. **A guard result only means something once the writes have stopped**, and a report is not evidence.

**The pattern worth carrying forward.** Every wrong number in this project has come from a *measurement* bug, never a content bug: the regex `^0[1-9]-` that silently excluded phases 10+, the per-phase average that could not see a 190-word wall among short paragraphs, and the word-count framing that hid four read-only phases. All three are the same mistake — **a metric that cannot fail is not a metric.**

## 2026-09-15 — Search, five module follow-ups, and a red build that was worth having

**Goal:** Two items chosen from the roadmap queue — write the five module-review follow-ups, and add full-text search across lessons.

**Search: the obvious implementation was measured and thrown away.** The first version stored each segment's text. Measured, that came to **1,438 KB raw / 473 KB gzipped**, because it duplicated every lesson file — and an average lesson gzips to 16 KB, so the index cost roughly *thirty lessons' worth* of download for a feature used occasionally. That is the wrong trade for the audience this curriculum targets. The second attempt, windowing long segments with overlap to improve snippets, was also measured and made it **worse** (1,438 → 1,501 KB), because the overlap duplicated text. What shipped is an inverted index — term to segment id, **no prose** — at 180 KB as its own lazily-fetched chunk, with `index.html` not referencing it at all. The main bundle is unchanged at 105 KB gzipped.

Both rejected designs were killed by *measuring* rather than by reasoning about them, and the second one looked obviously sensible.

**Three bugs that returned the wrong answer without erroring.** None of these would have been caught by reading either the index builder or the query engine — they only appear when the two are run against each other:

| Bug | What a reader would have seen |
|---|---|
| Terms in >20% of segments were **deleted** to save space | `"user account locked"` returned **nothing**, because a query is an AND and `user` was gone |
| Trailing punctuation glued into terms | `"...was timestomped."` indexed `timestomped.` separately from `timestomped` |
| An exact match **suppressed** broader ones | Typing `timestomping` found modules 10 and 12 but not 11 — the *more* precisely you typed, the *fewer* results you got |

The third one has a mirror image that the fix had to respect: merging exact and prefix matches flatly broke `STAR`, which exactly matches the interview method but also prefixes `start`, `startup` and `starved` across 227 segments — the merged set drowned the lesson that actually teaches STAR. The fix is tiered scoring, not a merge.

Each was found because the test asserted on **known-correct hits**, not on the absence of exceptions. That distinction matters for anything in this repository that can be wrong without crashing — the same reason `audit-lesson-ast.mjs` compares content rather than checking for thrown errors.

**1,438 KB → 180 KB, and the honest cost of each option before writing the UI** is the useful habit here. The first design would have shipped and looked fine on a fast connection.

**The five follow-ups were written rather than filed**, 366 lines added and nothing deleted: a worked "wrong first guess" and a five-rung setup ladder in module 09, a reversed wrong-automation case in module 12, a worked risk-scoring disagreement in module 13, and a residual-incompetence statement in all six modules naming what the reader still cannot do.

**I broke CI, and the failure was more useful than the success.** The "Content integrity" job went red. The cause was not the content: `cyber-restructure-check.mjs` reads its baseline from `process.env.TEMP` — a machine-local file that is **not in the repository**. It had been passing locally only because I generated that baseline earlier in the session, and it can never pass on a fresh clone. Adding it to CI guaranteed a permanent red build. It is a one-off migration tool for a restructure pass, not a standing guard, and the pass finished long ago; the permanent guarantee is `audit-lesson-ast.mjs`, which CI does run.

The right response was not to reason about it. I **cloned the repository fresh** and ran every CI step in the clone — which is the environment CI actually uses, and exactly what I had failed to consider when adding the step. All four content audits and all three site steps exit 0 there.

**Two PowerShell traps, both already documented, both hit anyway.** A heredoc (`git commit -F - <<'MSG'`) does not exist in PowerShell and failed loudly. Then a scratch commit-message file got swept into the commit by `git add -A` and had to be removed in a follow-up — the fix is to name paths explicitly rather than stage everything.

**Final state:** lint 106 files / 0 issues; content audit 0 issues; lesson AST 23 lessons / 0 loss; readability 0 of 23 outside target and **0 paragraphs over 90 words**; build clean; smoke 85 renders / 0 failures; search 41 checks / pass; CI and Deploy both green on `2ec1871`.

**Lesson taken:** a check that cannot fail on a fresh clone is not a check. Every guard added to CI should be run once in a clone before it is trusted — and when a build goes red, the environment mismatch is worth more attention than the failing assertion.

## 2026-09-15 (later) — Four roadmap items: a density gate, a module review, an assessment, and a correction

**Goal:** Work the four-item queue from the previous checkpoint — harden the readability audit and split the dense paragraphs, review the six new cyber modules, assess whether the IT track's later phases need the Phase 1 treatment, and deploy the site.

**The user caught a real error before I did.** Asked what to do next, I proposed deploying the site to a free host because the repository was private. The user pushed back: *"isn't our web already hosted on github?"* It was. The GitHub API showed `"private": false`, `"has_pages": true`, and successful `Deploy to GitHub Pages` runs for every recent commit. The site had been live at <https://markkramm.github.io/cs-roadmap/> the whole time, and `docs/CHECKPOINT.md` still claimed the repo was private and unreachable. I had repeated a stale doc instead of checking. **One API call would have settled it.**

**The audit gate found 33 paragraphs that the average had hidden.** `audit-readability.mjs` gated on a per-phase *average*, so a single 193-word wall passed unnoticed among twenty short paragraphs — and it already computed `longest para` without failing on it. Added per-paragraph counts gating at 150 words. The first run found 33 paragraphs over 90 words across five IT files, plus one hard failure.

All 33 are now split, at natural seams, with **every word preserved**. The verification is the interesting part: inserting a blank line is invisible to `git diff --word-diff`, so four of the five files reported `0 removed / 0 added` tokens — which is the *proof* of word-neutrality, not a failure to measure. Phase 1 reported 214/214 from the paragraphs I split by hand.

One reconciliation worth recording: my commit message said Phase 1 had 16 dense paragraphs and a subagent counted 11. Both were right — **16** at the commit before any work, **11** after I hand-split four of them. Checked against git history rather than argued.

**Five real technical errors in modules 09–14, found only by reading.** Structural checks were clean on all six. What a reviewer caught that no automated check can:

| File | Error | Why it mattered |
|---|---|---|
| 10 | auditd comment said "privileged user" above `-F auid>=1000` | `auid` is the *login* uid and root is 0, so the rule does the opposite. Verified against `auditctl(8)`. |
| 09 | wildcard audit hardcoded `--version-id v1` | Arbitrary for customer-managed policies — silently skipped most and reported a clean account. |
| 12 | `Get-ScheduledTask` filtered on `.Date` | `.Date` **exists** but is a *string*, so comparing it to a `DateTime` compares lexically. A "last 30 days" filter returned 14 tasks from **2010**, without erroring. |
| 10 | `sigmac` in the tools table | Retired; the tool is `sigma-cli`. Verified against its repository. |
| 10 | Sysmon config filename implied canonical | It is only a convention. |

The third one is worth dwelling on: the subagent's *fix* was correct but its *explanation* was wrong — it wrote "Get-ScheduledTask has no creation-date property". Running the command showed the property exists as a string. I corrected the comment to teach the real trap, which is more instructive than the imagined one.

**Two measurement failures of my own, same root cause.** I reported "12 dense paragraphs in cyber modules 10–14" and later a phantom 594-word paragraph. Both were wrong, and both came from the same class of mistake — an inline `node -e` string whose backticks PowerShell mangled, corrupting an escape-sensitive regex so bullet-list lines counted as paragraph prose. A separate instance: `git show HEAD:file > out.md` writes **UTF-16LE** in Windows PowerShell 5.1, which produced a false "3,131 words lost". Every one of these was caught by cross-checking against a second measurement, not by the tool erroring. **Escape-sensitive regexes do not belong in an inline shell string, and a number that contradicts another number is a signal to stop and reconcile.**

**The IT depth assessment changed the plan.** The question assumed the later phases were thin. Reading them showed otherwise: Phases 6–9 are **6,457–6,992 words across 8–10 substantial Parts**, and the depth signature (guided walkthrough or worked case) is already present in Phases 2–5 and 8. Phase 1's 24,723 words is the outlier in the *other* direction and not a template. **No depth pass is warranted.** My first two attempts to measure this by keyword matching gave two wrong answers — one from misreading my own table's column alignment, one because Phase 7 teaches by weak-versus-strong comparison rather than a labelled worked case. Reading the files settled it in minutes.

**Two subagent claims I verified rather than accepted.** The review flagged its own uncertainty about `sigmac` and the `Get-ScheduledTask` property, both unverifiable at the time because web search returned HTTP 401. I confirmed `sigma-cli` from its repository and the `.Date` behaviour by running the command — and the second one **contradicted** the subagent's stated reasoning, so I corrected the file rather than filing the report as-is.

**Final state:** lint 102 files / 0 issues; content audit 0 issues; lesson AST 23 lessons / 0 loss; readability 0 of 23 outside target and **0 paragraphs over 90 words**; preservation OK; smoke 84 renders / 0 failures; CI and Deploy green.

**Lesson taken:** every wrong number this session came from a *measurement* bug, never a content bug. The content was fine; my instruments were not. When a tool reports something surprising, suspect the instrument first, and always confirm with a second method.

## 2026-09-15 — The site learns to render lessons, the nav stops running away, and the cyber track grows six modules

**Goal:** Three things the user asked for in one pass — show the lessons in the site UI (the content "feels lacking"), add modules where the curriculum had holes, and fix the sidebar, which scrolled away so navigating a long page meant scrolling back to the top.

**The measurement that reframed the whole task.** Before writing anything I measured how much of each phase file the site was actually showing. The `## Lesson:` region is **84–95% of every phase file**. The build script extracted goal, skills, topics, tools, tasks, checklist and exit criteria, and dropped the rest — so the site rendered roughly **a tenth of the curriculum**, and the teaching content was reachable only via a GitHub link. That turned "show the lessons" from a nice-to-have into the main event.

**Lesson rendering (D-011, D-012).** Wrote `scripts/lesson-ast.mjs`, a zero-dependency parser for the Markdown subset the curriculum uses — measured first, not assumed: h3/h4, paragraphs, one level of nesting, tables, fences, blockquotes, inline bold/italic/code; **no** h5, images, footnotes or raw HTML anywhere. `Lesson.jsx` renders it with a TOC and scroll-spy.

The payload problem was real, and the first attempt hit it: inlining lessons into the track indexes took the JS bundle from 265 KB to **1.96 MB**. Emitting per-phase `lessons/*.json` loaded via `import.meta.glob` brought the initial bundle to **355 KB**.

Because a parser bug deletes content instead of crashing, two guards were built: `audit-lesson-ast.mjs` (AST vs source, per block) and lesson assertions in the smoke test.

**A guard that was silently worthless.** `audit-lesson-ast.mjs` reported a clean pass — on 18 of 23 lessons. It matched phase files with `^0[0-9]-`, which stops at 09. Checking the other scripts showed **four more with the same bug**, including the preservation check. All five now use `^(?!00-)\d{2}-`. First run after the fix surfaced 30 real issues that had been invisible. The readability script separately hardcoded the original eight cyber phase names, so the six new modules were being averaged into the IT track; it now derives the track from the path.

**Five parser bugs, each found by a different signal.**

| Bug | How it surfaced |
|---|---|
| Flat siblings nested 17 deep under the first item | Character-level audit (cyber-07 −123 chars, it-03 −311) |
| `\|` escaped pipe split a table cell | Literal `**` on the page (Nmap `open\|filtered`) |
| Pipe inside a code span split a cell | Stray backtick on the page (LDAP payload) |
| ``**`/etc`**`` — bold containing code | Literal `**` and backticks |
| Wrapped paragraph/blockquote line counting | Audit false alarms — **my measurement was wrong, not the parser** |

That last row matters: the audit's first version reported losses in all 18 phases. It was over-counting table delimiter rows and under-counting wrapped blockquotes. A later variant compared one concatenated string, letting digits from adjacent blocks fuse (`7.9 / 0.6` followed by `0.6 GB free on a 7.9 GB`). Fixed by comparing **per block**. The header comment says it plainly: *a guard that always fails gets ignored, which is worse than having none.*

**Also the smoke test was wrong, not the renderer.** It scanned all rendered HTML for literal `**` — but a `markdown` fence legitimately shows `**bold**` as an example. Excluding `<pre>`/`<code>` cleared it.

**Nav fix (D-010).** The sidebar was a flex item with no height constraint, so it stretched to full document height and scrolled away. Now viewport-pinned; below 860px it becomes a drawer with Escape, backdrop-click and scroll locking.

**Content.** Phases 4/5/6 rebalanced to the track standard (4,788/5,200/5,828 → **9,045/9,329/9,311** lesson words), and six new modules added as 09–14 for the gaps the core path names but never taught: cloud and identity, detection engineering, incident response and DFIR, scripting and automation, GRC and compliance, web application security. Each 8,837–12,181 lesson words, $0, with an explicit legal-boundary section.

**Final state:** lint 102 files / 0 issues; content audit 0 issues across 23 phases; lesson AST 23 lessons / 0 loss; readability **0 of 23 outside target**; smoke 84 renders / 0 failures; production build clean; every changed file UTF-8, no BOM, LF-only.

**Lesson taken:** the guards mattered more than the feature. Three of the five parser bugs produced no error — just missing or mangled content — and the audit bug meant the guard itself was asleep. When a check reports success, verify it is looking at what you think it is.

## 2026-09-13 — Cyber Phases 6–8 lessons: the cyber track is complete, and a parser fix

**Goal:** Finish the cyber-track lesson pass — Phases 6, 7, and 8 — following the established pattern (a `## Lesson` section placed after the last structural section and immediately before `## Tools for This Phase`).

**Result — the whole repository is now lesson-complete.** All eight cyber phases carry `## Lesson` sections, joining the nine IT phases:

| Phase | Words | Angle |
|---|---|---|
| 06 Portfolio Projects | 5,672 | Turning labs into evidence — two readers, report anatomy, three Wazuh rules showing three skills, honesty as an advantage |
| 07 Certifications | **8,929** | What a certification actually does — the free-study/paid-exam split, the 30-post filter test, why GRC and pentest creds are not entry points |
| 08 Job Application | 7,358 | Getting hired without experience — the funnel behind "50 applications", the IT-to-security bullet translation table, eight model technical answers |

**No structural repair was required in any of the three phases** — a fourth consecutive clean pass. Section order was already correct, and both `it.json` and `cyber.json` remain **byte-identical to a `HEAD` baseline worktree** (excluding `generatedAt`), confirming the lessons are invisible to the pipeline as intended. Phase 7's counts are 6/7/6 (tasks/checklist/tools) and Phase 8's are 7/8/6 — unchanged.

**The real find: the build parser was fence-blind.** `scripts/build-content.mjs` matched `^## ` and `^### ` without tracking fenced code blocks. This had been recorded as a known latent hazard in an earlier session ("a future edit that puts a code fence around a *recognised* heading name would be misparsed"), and Phase 6's lesson triggered it on the first try.

The Phase 6 lesson includes a report template in a ```text fence. With the template unindented, the parser read `## Summary`, `## Objective and scope`, `## Environment`, `## Method`, `## Findings`, `## Evidence`, `## Impact`, `## Remediation`, `## Limitations`, `## Lessons learned`, and `## References` as eleven real sections — and then treated the template's `## Checklist` as *the* checklist section, failing the build with `checklist line without an id comment`. The section-order listing made it obvious: the file appeared to have twenty-three `## ` sections instead of twelve.

**Two fixes were applied, in the right order.**

1. **Immediate:** the template's headings were indented by two spaces, which the `^## ` regex does not match. This unblocked the content work but left the template slightly awkward to copy — a two-space indent inside a code fence is harmless but untidy.
2. **Root cause:** `fenceTracker()` was added, and both `sections()` and `subsections()` now consult it. A ``` or ~~~ fence opens on its first occurrence, closes on the matching character, and any line inside is passed through without heading detection. The Phase 6 template was then **restored to unindented form**, since the workaround is no longer needed and the template now copies cleanly into a learner's own repository.

**Verification of the parser fix, in both directions** — following the repository's own hardening precedent of a negative test:

- **Output-preserving:** both `it.json` and `cyber.json` built from the working tree are byte-identical to the `HEAD` baseline, so the change alters no existing behaviour.
- **Negative test, old parser:** a fenced `## Checklist` injected into cyber Phase 5 made the `HEAD` parser **fail the build** — exit 1, no JSON emitted, `cyber-05: checklist line without an id comment`. This confirms the vulnerability was real rather than theoretical.
- **Negative test, new parser:** the same injected file built cleanly, and the injected item was absent from the output — Phase 5's checklist still measured exactly 8 items.
- **Isolation:** the test ran in a temp-directory copy, because `build-content.mjs` resolves its paths from `__dirname`. The real repository was never touched, and the fixture was removed afterward.

`docs/CONTENT-GUIDE.md` now documents the rule under a new "Fenced code blocks" section, along with the failure mode the fix introduces: **an unterminated fence reads the remainder of the document as inside it**, which surfaces as a "missing mandatory section" error naming a heading the author can plainly see. That is a real new failure mode and worth recording, though it is strictly less confusing than the old behaviour of silently parsing template headings as structure.

**A word-count ceiling was removed from the authoring standard.** A delegated attempt at Phase 7 stalled and began *shortening* an already-written 7,000-word lesson to fit a 5,000-word target. The user's instruction was unambiguous — more detail is better, drop the target — and the guide now reads: **3,000 words is a floor, not a target; there is no upper bound; never trim a lesson to hit a word count, and close a gap by adding explanation rather than compressing prose.** Phase 7 was then written to 8,929 words, the longest lesson in the repository. Word-count ceilings are recorded in `docs/ROADMAP.md` under "Explicitly out of scope". The Phase 7 lesson was written in-session rather than delegated.

**Verification:**

- `node scripts/lint-content.mjs` — 81 files, 0 issues.
- `node scripts/build-content.mjs` — 129 phase task IDs, unchanged; `it.json` phases=9/taskIds=66, `cyber.json` phases=8/taskIds=63.
- **`HEAD` worktree baseline vs working tree, both JSON files diffed field-by-field: byte-identical** apart from `generatedAt`.
- `npm run test:smoke` — 31 renders across 17 phases and 112 tools, 0 failures.
- `npm run build` — clean, 47 modules, `dist/` produced.
- All three edited phase files LF, UTF-8, no BOM; exactly one `## Lesson` each; section contract intact for all 17 phase files; `git diff` on the content shows insertions only — 627 added lines in Phases 6 and 8 before Phase 7, and **zero deleted lines**, so no pre-existing content was disturbed.
- Encoding checked with explicit UTF-8 decoding after an initial measurement returned zero em-dashes — the `Get-Content` ANSI-decoding pitfall this log has recorded before. Correctly decoded, the new files carry 73 and 91 em-dashes, consistent with Phase 5's 68.

**Process notes:**

- The subagent delegation for Phase 7 **failed without writing anything**, leaving the file untouched — verified before proceeding. The in-session write then succeeded. Delegation remains useful for genuinely independent work, but a content task with a precise structural contract and a strict house voice proved faster to do directly.
- Edits were again anchored on unique surrounding text rather than line numbers, and the `## ` heading map was re-read after every insert. No misplaced sections occurred.
- The fence bug was caught by reading the parser rather than by trusting the build's exit code — the unindented template *did* fail loudly, but only because the template happened to contain a recognised heading with an invalid line under it. A template of purely unrecognised headings (as in IT Phase 8) parses silently and produces no error at all. Worth knowing: **passing build output is not evidence that the parser understood the document.**

**Docs updated:** `docs/ROADMAP.md` (Phases 6–8 moved to Done; the fence fix recorded; Next reduced to deployment and the Phase 1 legacy task block; word-count ceilings added to out-of-scope), `docs/CHECKPOINT.md` (content depth now reads "both tracks complete", working-tree row updated, parser and JSON-identity health checks added, the content-depth open item closed), `CHANGELOG.md` (four Added entries, the parser fix under Fixed, the guide changes under Changed), `docs/CONTENT-GUIDE.md`, and this log.

**Next:** deployment (needs the private-repo visibility decision — Netlify, Vercel, and Cloudflare all deploy private repos on free tiers) and the Phase 1 legacy `### Hands-On Tasks` fold-in. The content work is complete across both tracks; what remains is scope and deployment, not defects.

## 2026-09-13 — Lessons for IT Phases 5–9: the IT track lesson pass is complete

**Goal:** Apply the `## Lesson` treatment to IT Phases 5–9 at 3,000+ words each, checking each for structural defects first.

**The headline finding — there was nothing to repair.** Unlike Phases 1–4, all five of these phases were structurally clean. Checked before writing, per phase:

- Section order matched the contract, with no duplicated headings.
- No `### Hands-on Tasks` heading — tasks already sat under the contract heading `## Hands-on practice tasks`.
- No lesson prose leaked into `## Specific topics to learn`.
- No stray `## Resources` or `## Common Pitfalls` sections needing reconciliation.
- Markdown task counts matched the extracted JSON exactly: 7 / 6 / 6 / 7 / 7.

So this session was **pure content work, with no repair phase**, and the structural diff confirms it (see Verification).

**One structural wrinkle worth recording.** Phases 8 and 9 have no `## Specific topics to learn`. Phase 8 runs `## Portfolio structure` → `## Resume sections`; Phase 9 runs `## Target roles` → `## PH-friendly job boards`. The lesson was placed after the **last structural section** in both, keeping the order *skills → structure → lesson → tools* and preserving the invariant that actually matters: the lesson always sits immediately before `## Tools for This Phase`. This generalisation is now documented in `docs/CONTENT-GUIDE.md`.

**Lessons written:**

| Phase | Words | Angle |
|---|---|---|
| 05 Sysadmin Basics | 3,039 | Accounts, permissions, services, updates, backups — "why the organisation works this way" |
| 06 Tools and Ticketing | 3,126 | How tools encode process; tickets as audit trail and institutional knowledge |
| 07 Soft Skills | 3,343 | Diagnostic-question craft, plain-language rewriting, STAR stories |
| 08 Portfolio and Resume | 3,214 | What a hiring manager scans for; honest framing of a no-degree path |
| 09 Job Application Plan | 3,757 | Pipeline discipline, honest keyword matching, scam detection |

Every lesson follows the established shape: opens with "Why this lesson exists", splits into `### Part N` sections, includes real worked examples (a rewritten PowerShell inventory script, the same incident written as a weak ticket and a professional one, the same fix explained to a technical colleague and to a user, a STAR project summary with evidence paths), and closes with "Key takeaways" and "Practice this next".

**Verification:**

- `node scripts/lint-content.mjs` — 81 files, 0 issues. (The linter walks the whole repo and counts every file with a checkable extension, including loose `.json` files at the root, so temporary diff artifacts inflate this number while they exist. 81 is the true count and it equals `git ls-files`; the "84" recorded in `CHECKPOINT.md` was stale and has been corrected.)
- `node scripts/build-content.mjs` — 129 phase task IDs, unchanged.
- **`HEAD` vs working tree, built JSON diffed field-by-field:** 3 intended phase-level differences, 0 unintended. IT tools 56 → 56, both tracks 112.
- `npm run build` (Vite) — builds clean.
- `npm run test:smoke` — 31 renders, 0 failures.
- **Structural diff, baseline captured before any edit vs. final `it.json`: 1,585 lines identical, zero diffs.** Stronger than an ID-count comparison: the entire generated document is byte-identical apart from `generatedAt`.
- Per-phase task counts unchanged at 7 / 6 / 6 / 7 / 7; checklist counts unchanged at 8 / 7 / 6 / 7 / 8.
- All five files LF, UTF-8, no BOM; exactly one `## Lesson` heading each; no duplicate headings.

**Process notes:**

- **The chunked-edit hazard from last session was avoided this time.** Every insert was anchored on unique surrounding text, never on a line number, and the `## ` heading map was re-read after each phase. No misplaced sections occurred.
- The editor's `new_text` limit is a hard ~6,000 characters; oversized calls fail outright with no partial write. Lessons were therefore written in roughly 2,000-character anchored chunks.
- The build script's section parser matches `^## (.+)$` **without** checking fenced code blocks. This did not cause a problem here — the Phase 8 README example contains `## What's here`, `## Background`, and `## Contact`, which are read as sections but ignored because unknown section names are not extracted. Recorded because a future edit that puts a code fence around a *recognised* heading name would be misparsed.

**A regression that the existing checks could not see.** The verification above proves the *structural* document did not move during this session — but that is not the same as proving the structural document was right. So a `git worktree` at `HEAD` was checked out, the build was run there, and its JSON was diffed field-by-field against the working tree's. Three phase-level differences appeared, all intended:

- `it-01` CrystalDiskInfo free alternative — `wmic diskdrive` → `Get-PhysicalDisk`, the deliberate fix for a command Windows has deprecated.
- `it-03` tasks 0 → 8, `it-04` tasks 0 → 6 — the stranded-task recovery from the previous session.

But a row-level comparison of the tools tables showed the IT total had fallen from 56 to 54, and the JSON diff had not flagged it because two rows had *moved rather than vanished*. Phase 4's tools table had lost **`Microsoft Teams`** and **`Google Workspace Admin Help`**; both rows were sitting stranded in the middle of the lesson prose, jammed between two paragraphs. **Fix:** rows removed from the lesson and restored to the table, plus the blank line before `## Free/cheap resources` that went with them. IT tools back to 56, both tracks back to 112, and the smoke test back to reporting 112.

Why every check passed while this was broken: tool rows carry **no IDs**, so `task`/`checklist` ID comparisons cannot see them; and the build, the lint, and the render all succeed with two fewer tools. It rendered less than the content contained — the same class of silent failure as the stranded tasks. **A HEAD-vs-worktree JSON diff is now the check that closes it.** Phase 4's lesson re-measures at 6,137 words; the 44-word difference from the previously recorded 6,181 is exactly the two removed rows.

Worth knowing for next time: **`HEAD` does not build.** Its Phase 2 carries six resource lines with no URL, and `build-content.mjs` refuses to write output when it fails. The repairs exist only in the working tree, so the `HEAD` worktree had to borrow the current Phase 2 to run at all — another reason the working tree needs committing.

**Two Phase 1 findings, deliberately not fixed.** Phase 1 is the only phase whose lesson is not immediately followed by `## Tools for This Phase` — a `## Common Pitfalls` list sits between them. `CONTENT-GUIDE.md` explicitly permits that section, so this is policy-compliant rather than a defect; the invariant in `CONTENT-GUIDE.md` was rewritten to state the exception instead of the file being restructured to satisfy a rule that no longer claims to be universal. Phase 1 also still carries a legacy `### Hands-On Tasks` block of verbose `#### Task 1–5` walkthroughs inside `## Specific topics to learn`, duplicating the five one-line tasks in the real `## Hands-on practice tasks` section. It contributes nothing to the generated JSON — its items are indented sub-bullets and `####` headings, which the extractors ignore — so deleting it would change no output at all. But it holds the step-by-step instructions that the one-line task list does not, so removing it would lose real teaching detail from the Markdown. Left in place and flagged as a candidate for folding *into* the task section rather than being deleted.

**Docs updated:** `docs/ROADMAP.md` (Phases 5–9 moved to Done; Next now lists cyber-track lessons and site deployment), `docs/CHECKPOINT.md` (content depth, tracked-file count corrected 83 → 81, tools back to 112), `docs/CONTENT-GUIDE.md` (lesson placement when `## Specific topics to learn` is absent; the `## Common Pitfalls` exception stated), `CHANGELOG.md` (Phases 5–9 lessons added; Phase 4 tools regression recorded under Fixed), `README.md`, and this log.

**Committed at the end of this session:** three commits on `main` — `fix(it-roadmap)` for the Phase 1–4 repairs, lessons and restored tool rows; `docs(it-roadmap)` for the Phases 5–9 lessons; and `docs` for the doc set. `HEAD` was then verified to build in a scratch worktree and to reproduce the working tree byte-for-byte apart from `generatedAt` (1,602 lines each), which closes the "`HEAD` does not build" problem recorded above.

**Next:** the open questions are scope, not defects: whether to extend lessons to the 8 cyber phases (deliberately syllabus-first today), whether to deploy the site (private-repo visibility — Netlify, Vercel and Cloudflare all deploy private repos on their free tiers), and whether the site should surface lessons at all, given the lesson is deliberately outside the extracted JSON.

## 2026-09-13 — Lessons for IT Phases 1–4, and the stranded-task bug

**Goal:** Write `## Lesson` sections for IT Phases 1–4 at 3,000+ words, starting from the Phase 1 pilot agreed on 2026-09-11.

**What the work uncovered — the phase files were structurally broken:**

Phases 3 and 4 shared a defect pattern that predated this session:

- The `## Lesson` heading sat **between `## Goal of this phase` and `## Estimated time`**, splitting a Goal from its own time estimate, with `## Estimated time` then appearing a second time further down.
- The lesson body had **leaked into `## Specific topics to learn`** as a `### Step-by-Step Breakdown` block, duplicating what the lesson was about to say.
- Tasks sat under **`### Hands-on Tasks`**, a heading the build script does not read, so `it.json` recorded `tasks: 0` for both phases while the tasks were plainly present in the Markdown.
- An undocumented `## Common Pitfalls` section and a redundant `## Resources` section were present in all four phases.

**The most serious finding — silent task loss.** Phase 1, Phase 3, and Phase 4 each generated **zero** practice tasks in `it.json`. The build passed, the lint passed, and the site rendered — it simply rendered less than the content contained. This is the failure mode the pipeline cannot catch on its own, because a missing heading is not a malformed heading. It was found by diffing generated output against the Git originals rather than by any check.

**Repairs applied (all four phases):**

| Phase | Repair |
|---|---|
| 1 | Duplicate `## Deliverable` / `## Checklist` removed; orphaned bullets folded into topics; redundant `## Resources` dropped; `wmic` → `Get-PhysicalDisk` (2 sites); lesson moved after `## Specific topics` |
| 2 | Rebuilt from the Git original to restore the section contract; task list restored from 3 to 7 |
| 3 | Misplaced lesson and duplicate `## Estimated time` removed; 8 tasks recovered from `### Hands-on Tasks`; leaked topic prose removed; redundant `## Resources` dropped |
| 4 | Same treatment as Phase 3; 6 tasks recovered |

**Lessons written:**

| Phase | Words |
|---|---|
| 01 Computer Fundamentals | 4,430 |
| 02 Operating Systems | 4,337 |
| 03 Networking Basics | 3,370 |
| 04 Helpdesk Skills | 6,181 |

Each lesson opens with "Why this lesson exists", is split into 4–6 `### Part N` sections, uses real commands and worked examples, and closes with "Key takeaways" and "Practice this next".

**Verification — structural integrity is the point:**

- `node scripts/lint-content.mjs` — 84 files, 0 issues.
- `node scripts/build-content.mjs` — 129 phase task IDs, up from 116 before the repair.
- `npx vite build` — builds clean in 803 ms.
- **Structural diff, pre-repair baseline vs. current `it.json`: 75 element IDs before, 75 after, zero missing, zero extra, zero count changes.** Progress saved against any task ID in the learner's `localStorage` still resolves.
- Per-phase task counts now: 5 / 7 / 8 / 6 / 7 / 6 / 6 / 7 / 7.

**Process note — a hazard worth recording.** Chunked `editor(insert_line=N)` calls must not be used for multi-step edits. Line numbers drift between calls, and an insert placed against a stale number will silently put a section in the wrong part of the document. This happened mid-session: `## Tools for This Phase` was inserted *inside* the Phase 4 lesson, splitting it in two. It was caught by re-reading the heading map after every insert, and fixed by unique-anchor text replacement. Anchor on surrounding text, not on line numbers.

**Docs updated:** `docs/CONTENT-GUIDE.md` (12 mandatory sections; new "The Lesson section"), `docs/CONTENT-SCHEMA.md` (new "Sections deliberately NOT extracted"), `docs/ROADMAP.md`, `docs/CHECKPOINT.md`, `CHANGELOG.md`, and this log.

**Also noted:** commit `51ecdf6` ("Added detailed lesson sections for Phase 3: Networking Basics and Phase 4: Helpdesk Skills") landed lesson prose on `main` without a `docs:` prefix and without the accompanying documentation updates this session supplied. The lessons themselves were a reasonable first draft but carried every defect described above.

**Next:** apply the same treatment to IT Phases 5–9, checking each for the stranded-task pattern before writing.

## 2026-09-11 — Pause: content-depth assessment

**Goal:** Wrap up for the day, and check whether the curriculum is teachable material or only a syllabus.

**Finding — the content is a syllabus, not a textbook:**
- 29 files, roughly 20,000 words total; 693–916 words per phase.
- Each phase says *what* to learn and *where* to find it (goal → skills → topics → tools → resources → tasks → deliverable → checklist → exit bar). It does not teach the subject itself. `- CPU: cores, threads, clock speed, overheating symptoms` is a topic line, not a lesson.
- `docs/CONTENT-GUIDE.md` calls its 11 sections "mandatory", but none of them is a lesson body.

**Pipeline constraint confirmed (so the plan is safe):**
- `scripts/build-content.mjs` reads only its known `##` headings. An unknown heading is never read, so arbitrary prose under a new heading cannot fail the build.
- `learning-site/src/pages/PhaseDetail.jsx` renders only the extracted fields, so prose in a phase file does not appear in the site. The site's existing "read the full guide" link (`PhaseDetail.jsx:23`) opens the Markdown on GitHub — that is the channel deep content would be read through.

**Agreed next task — planned, NOT executed (no content was written this session):**
- Pilot one phase: `career-roadmaps/it-roadmap/01-phase-computer-fundamentals.md`, adding a `## Lesson` section after `## Specific topics to learn`.
- Target ~3,000 words. Five beats per topic — what it is, how to check yours, what the numbers mean, what failure looks like, what you would do — plus a guided walkthrough with real commands and expected output (`winver`, `msinfo32`, `dxdiag`, the four Task Manager tabs, Device Manager, `Get-PhysicalDisk`).
- Markdown-only: the lesson lives in the phase file and is read via the "read the full guide" link. No pipeline or renderer change, no new dependency.
- Then document `## Lesson` in `docs/CONTENT-GUIDE.md` (allowed authoring section) and `docs/CONTENT-SCHEMA.md` (deliberately not extracted), so a later reader does not delete prose the parser ignores.
- Judge the effort on that one phase before repeating for the other 16.

**Carry-over fix spotted, not yet applied:** `01-phase-computer-fundamentals.md` line 62 offers `wmic diskdrive` as the free alternative to CrystalDiskInfo. `wmic` is deprecated and being removed from Windows; `Get-PhysicalDisk` is the current replacement.

**State verified before pausing:**
- `node scripts/lint-content.mjs` — 81 files, 0 issues.
- `npm run build` — exit 0. `npm run test:smoke` — 31 renders across 17 phases and 112 tools, 0 failures.
- Working tree clean, in sync with `origin/main`.

**Next:** run the IT Phase 1 lesson pilot described above.

## 2026-09-11 — CI verification and docs coherence

**Goal:** Confirm the CI workflow actually runs green on GitHub, then bring the entry-point docs in line with the repository.

**Verified — CI is green:**
- Two runs on `main`, both passing: `fe04ed3` and `8cfc2d4` (the current tip).
- Both jobs pass in each run — **Content integrity** and **Learning site** — on `ubuntu-latest`, Node 24.
- This closes the gap the CI session left open ("the first push is the real test"). The lockfile concern was also checked directly: `learning-site/package-lock.json` carries the Linux optional binaries (`@rollup/rollup-linux-x64-gnu`, `@esbuild/linux-x64`) with correct `os`/`cpu` markers, so `npm ci` resolves on the runner.

**Docs aligned (the entry-point files had drifted):**
- `README.md` — layout tree rebuilt to the real structure; the stale "Content baseline complete" status replaced.
- `CONTRIBUTING.md` — structure block expanded to all four areas plus `.github/`; CI added to the change loop.
- `docs/ARCHITECTURE.md` — the "No dependencies" invariant qualified per D-005/D-008, and CI documented.
- `docs/CHECKPOINT.md` — corrected component/hook counts (7→6, 5→4), file count (80→81), added `.github/` to the tree, and **removed the `HEAD`/`Commits` rows**. A checkpoint cannot contain its own hash, so those numbers drifted on every edit; the file now points at `git log` for the exact commit.
- `docs/DECISIONS.md` — D-003 and D-005 carry an "Amended by D-008" note. The log is ADR-style: entries are dated snapshots, superseded rather than rewritten.

**Next:** Deploy the site — still the only open `ROADMAP.md` item, and it needs its own decision (D-009) before any config lands.

## 2026-09-11 — CI

**Goal:** Add continuous integration — the only item under `ROADMAP.md` → Next.

**Scope decision:** `.github/workflows/` sits outside the `learning-site/` + `scripts/` carve-out that D-005 granted under `AGENTS.md` rule 3, so the workflow needed a decision before it could exist. Recorded as **D-008**: CI is permitted, deploy is not. The carve-out is deliberately check-only — no deploy step, no secrets, no credentials — so the dependency-free guarantee for `career-roadmaps/` and `docs/` survives.

**Done:**
- `docs/DECISIONS.md` — D-008, inserted newest-first above D-007.
- `AGENTS.md` — rule 3 now names the CI carve-out and cites D-008 alongside the existing D-005 reference.
- `.github/workflows/ci.yml` — two jobs. **Content integrity** runs `node scripts/lint-content.mjs` with no install, so a CRLF, BOM, or stray `?` fails in seconds. **Learning site** runs `npm ci`, `npm run build`, and `npm run test:smoke` under `learning-site/`. Node 24, matching local v24.19.0; `permissions: contents: read`.

**Verified:**
- `node scripts/lint-content.mjs` from the root — clean. It now scans the workflow file itself (`.yml` is already in `CHECK_EXT`), so the new file has to satisfy the rule it enforces.
- `npm run build` and `npm run test:smoke` under `learning-site/`.
- `ci.yml` is LF, UTF-8, no BOM.

**Notes:**
- `npm ci` requires a committed `learning-site/package-lock.json`; confirmed present before writing the job.
- `learning-site/package.json` has no `engines` field, so the Node version is pinned in the workflow rather than read from the manifest. Adding `engines` would be a change to the site's contract, not the CI task, so it was left as a possible follow-up.

**Next:** Deploy the site — still gated on the private-repo visibility decision. GitHub Pages from a private repo generally needs a paid plan; Netlify, Vercel, and Cloudflare Pages all deploy private repos on free tiers.

## 2026-09-11 — Tooling hardening

**Goal:** Close the two deferred defects from the audit, then record the state for a pause.

**Done (two commits):**
- Commit 1 (`80c9055`) — `fix(tooling): scan LICENSE and fail loudly on malformed resource lines`.
- Commit 2 (`4fbccd7`) — `docs: refresh checkpoint and record the tooling fixes`.

**The two defects:**
- `scripts/lint-content.mjs` never scanned `LICENSE`. The file is extensionless, so it missed both the extension allow-list and the three-entry `CHECK_NAMES` set — the repository's own license was the only text file exempt from the text-integrity check. It is matched by name now; the lint count went 79 → 80 files.
- `scripts/build-content.mjs` degraded silently on a malformed resource line. A line that did not match `Name — https://…` produced `{ name, url: null }` and the build passed, so a broken link surfaced later in the UI rather than at the point of the mistake. It now fails with one of two messages — a URL present but the wrong separator, or no URL at all.

**Verified (negative test, four directions):**
- Clean content → exit 0.
- `- Name - https://example.com` (hyphen separator) → exit 1, reporting that a URL is present but the separator is wrong.
- `- Name` (no URL) → exit 1, "resource line has no URL".
- Original bytes restored → exit 0, and `git diff career-roadmaps/` empty. The test left no residue.

**Notes:**
- All 92 existing resource lines already satisfied the rule, so no content changed. The fix closed a latent fragility, not live corruption. An earlier sweep that appeared to show 92 of 92 malformed was a bug in the check, not the repository: PowerShell's `Get-Content` decodes with the ANSI code page, which mangled the em-dash. `build-content.mjs` reads UTF-8 and was always correct.
- Session-log numbers are historical by design. Entries record what was true during their own session; current-state counts live in `docs/CHECKPOINT.md`.

**Next:** CI — run `lint:content`, `build`, and `test:smoke` on every push. Needs a recorded decision first (D-008): `.github/workflows/` sits outside the `learning-site/` + `scripts/` scope that `AGENTS.md` rule 3 permits.

## 2026-09-11 — Learning Site Milestone M2

**Goal:** Build the three features M2 committed to — a tools library, a portfolio tracker, and an application tracker.

**Done (five commits):**
- Commit 1 (`7642aa3`) — `feat(site): add view navigation and EmptyState`. `App.jsx` navigation became a single `view` string; recorded as D-007. `EmptyState` implemented against the spec and the `.empty-state` class that already existed.
- Commit 2 (`9fe6360`) — `feat(site): add the tools library`. 112 tools flattened with track/phase provenance. Search, cost filter, track filter. `costTone()` moved out of `ToolCard` into `src/data/tools.js` so the badge and the filter share one definition.
- Commit 3 (`dedd8ec`) — `feat(site): add the portfolio tracker`. `usePortfolio` hook, `Portfolio` page, status filter, phase and URL links.
- Commit 4 (`7056e21`) — `feat(site): add the application tracker`. `useApplications` hook, `Applications` page, status pipeline, follow-up dates flagged when due.
- Commit 5 — docs: CHECKPOINT, ROADMAP, SESSION-LOG, CHANGELOG, `learning-site/README.md`.

**Scope decision:** the three features were approved as a set at kickoff. The nav work was split so that each destination's sidebar link landed in the same commit as its page — no commit in the sequence ships a link to a page that does not exist.

**Verified after every commit:**
- `npm run test:smoke` — grew 26 → 31 renders as pages were added; 0 failures. Each new page was added to the smoke test in the same commit that created it.
- `npm run lint:content` — 79 files, 0 issues.
- `npm run build` — succeeds.
- All edited files LF, no BOM, no U+FFFD.

**Notes:**
- The editor's 6000-character cap was hit twice (`Portfolio.jsx`, `Applications.jsx`). Both were split into create-then-append writes and verified afterward — the hazard was known and did not cause a silent drop.
- The portfolio tracker's `update()` was removed before commit: nothing called it, and dead mutators in a fresh file are worth deleting rather than keeping "just in case".
- `crypto.randomUUID` was deliberately avoided in both new hooks — it requires a secure context, which a local `file://` page is not.

**Next:** deploy the site, still blocked on the private-repo visibility decision (see `ROADMAP.md` → Later / optional).

## 2026-09-11 — Audit, ToolCard fix, and doc-accuracy pass

**Goal:** Audit the M1 work for real bugs and false claims, then fix what the audit found.

**Done (four commits):**
- Commit 1 (`ead116a`) — `fix(site): render ToolCard correctly and add a render smoke test`. Test-first: `learning-site/scripts/smoke-render.mjs` was written and run against the broken code first (19 failures), then `ToolCard.jsx` was rewritten to do its actual job, then the test was re-run (0 failures). Both landed in one commit.
- Commit 2 (`56d17dc`) — `docs: correct statements that the repository has no build step`. `AGENTS.md` prose and structure tree, `CONTRIBUTING.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/SETUP.md`.
- Commit 3 (`8adfd58`) — `docs: mark site-prep specs as implemented`. `CONTENT-SCHEMA.md` and `DESIGN-SYSTEM.md` no longer describe themselves as future work.
- Commit 4 — `docs: refresh checkpoint and correct dead UI references`.

**The bug:** `ToolCard.jsx` was a verbatim copy of `PhaseCard.jsx` — it exported a function named `PhaseCard` from a file named `ToolCard.jsx`, destructured `{ phase, done, total, onOpen }`, and its only call site passed `{ tool }`. Opening any phase threw `TypeError: Cannot read properties of undefined (reading 'title')`. Both `npm run build` and `npm run dev` passed, which is why it survived M1 verification: a component whose signature does not match its call site still compiles cleanly. Only rendering it with real props catches that.

**Verified:**
- Smoke test: 26 renders across 17 phases and 112 tools. Fails on the old code, passes on the new — the failure was reproduced before the fix, not after.
- Vite's `ssrLoadModule` worked on Windows with Vite 6; the esbuild fallback was not needed. No new dependencies — the test uses `react-dom/server`, already installed.
- Content lint: 72 files, 0 issues. Production build: 40 modules, `dist/` produced.

**Notes:**
- `smoke-render.mjs` lives in `learning-site/scripts/`, not the repo-root `scripts/` as first planned: Node resolves modules by walking up from the script's own directory, so a root-level script would never see `learning-site/node_modules`.
- Limitation: server rendering runs no `useEffect` and no event handlers. The smoke test catches render-time crashes, not interaction bugs. Reaching every phase detail view is what makes it useful — the dashboard never mounts `PhaseDetail`.

**Next:** Learning Site M2 — tools library, portfolio tracker, application tracker.

## 2026-09-11 — Learning Site Milestone M1

**Goal:** Turn the roadmap Markdown into a working personal learning site.

**Done (M1, five commits):**
- Step 0 (`06f9b6b`) — `D-006` recorded: React + Vite. `ROADMAP.md` and `CHECKPOINT.md` refreshed.
- Step 1 (`3f4bf0b`) — scaffolded `learning-site/` by hand-writing `package.json` rather than running `npm create vite`, which can prompt and hang a non-interactive shell. Vite 6.4.3, React 18.3.1, `@vitejs/plugin-react` 4.7.0.
- Step 2a (`f33b217`) — renamed two IT phase files to match the documented `NN-phase-*` convention. Verified zero inbound references first.
- Step 2b (`f380ce3`) — migrated all 17 phase files: YAML front-matter plus 129 stable task IDs appended as HTML comments. Insert-only; no existing character rewritten.
- Step 2c (`fbf0ab0`) — `scripts/build-content.mjs` parses the Markdown and emits `it.json` (9 phases) and `cyber.json` (8 phases). Wired as `build:content`, runs before `dev` and `build`. Output is git-ignored.
- Step 3 (`a22fb02`) — app shell: sidebar with track switcher and phase list, dashboard, phase detail rendered from JSON.
- Step 4 (`f64cad1`) — energy modes (low / normal / high) filtering the recommended next task, persisted in `localStorage`.

**Verified:**
- Build: 40 modules, `dist/` produced.
- Dev server boots and releases the port on shutdown.
- `it.json` + `cyber.json` parse; 66 + 63 task IDs; only 1 `?` per file (a legitimate quoted string).
- Negative test: a deliberately broken phase file produced 10 named errors and exit code 1.
- All new files LF, no BOM.

**Notes:**
- Two bugs caught before commit: the migration script first emitted IDs as `it-03-phase-networking-basics-c01` (spec requires `it-03-c01`), and took the *lower* bound of a duration range (`8–12` → 8). Both fixed by reverting the migration and re-running. The upper bound is correct for a curriculum that builds in buffer weeks.
- The editor silently dropped two files during an over-batched write. Caught by an import-resolution check, re-created, and confirmed present.
- Parallel write-then-verify raced twice more (generated JSON, file inventory). Both re-checked sequentially.

**Next:** Learning Site M2 — tools library, portfolio tracker, application tracker.

## 2026-09-11 — Baseline recovery, encoding fix, and scaffolding

**Goal:** Stabilize the repository and add project hygiene.

**Done:**
- Initialized Git (`main`) and set a local identity.
- Added `.gitattributes` (LF normalization, binary markers, lockfile handling).
- Recovered all 29 content files from dangling Git blobs after the working tree had been emptied, verified byte-for-byte with `git hash-object --no-filters`.
- Fixed encoding corruption: restored em-dashes, en-dashes, curly quotes, and box-drawing characters that a lossy conversion had turned into literal `?`. Only three genuine question marks remain.
- Committed the baseline: `chore: baseline career-roadmaps with LF + encoding fixes`.
- Added root `README.md` and `.gitignore`.
- Added `.editorconfig` to enforce UTF-8/LF at save time.
- Added `docs/` meta-documentation, `AGENTS.md`, and `CHANGELOG.md` (this batch).

**Notes:**
- Avoided parallel write+verify on the same files; a race earlier left a file staged-but-uncommitted, since resolved by running steps sequentially.
- One snag: the editor wrote CRLF on disk; fixed by removing and re-checking out files from Git so the working tree matches the LF policy.

**Next (at the time):** configure a Git remote and push `main`; decide on a license. Both were completed in later sessions — see the entries above.