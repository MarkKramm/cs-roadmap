# Session Log

A chronological record of working sessions. Newest first.

## 2026-09-16 (latest) — The first external verification pass, and the shape all three errors shared

**What came back.** The worklist went through a model with web access, checked against primary sources. **Three claims were wrong**, and the interesting part is not the count but that **all three had the identical shape: the name was right and the invocation was broken.**

**IT 02's summary table said `` `DISM /RestoreHealth`, then `sfc /scannow` ``.** That is invalid syntax; it throws. The phase states it correctly 300 lines earlier as `DISM /Online /Cleanup-Image /RestoreHealth`. So the *summary table* — precisely the place a reader copies from — held the only broken form of a command the document gets right elsewhere. A table cell invites shortening, and the shortening silently became a different command.

**IT 01's case-study log said `` `DISM /AnalyzeComponentStore` ``**, missing the same scope flags — while the line immediately after it gets `StartComponentCleanup` fully right. The same slip, in a different file, in the other place an author writes quickly.

**IT 01 told the reader to watch `HealthStatus` for `Caution` or `Bad`.** Those are **CrystalDiskInfo's** ratings. PowerShell's `HealthStatus` returns `Healthy` / `Warning` / `Unhealthy` / `Unknown`. A reader following that sentence would watch for two values the cmdlet never prints — and the phase's own sample output, four lines earlier, prints `Healthy`. It contradicted itself and nothing noticed, because nothing checks whether a sentence is *true*.

**Why no existing guard could see any of them.** The command names were spelled correctly. The sentences were internally consistent. Nothing cross-referenced them, so `audit-refs` had nothing to resolve — it checks that a *name* resolves, not that a *command* runs. This is D-036's thesis arriving as data rather than argument: internal consistency is orthogonal to correctness, and one pass over one track produced three errors from the gap.

**The fix is a guard, not a resolution to be careful.** `scripts/audit-commands.mjs` checks *the exact string a reader would copy* rather than the command it names. It is deliberately narrow — `DISM`, `sfc`, `chkdsk` — because those are the commands where a plausible abbreviation is also a valid-looking but broken command, and a guard that flags valid usage gets ignored, which is worse than not having it. **I proved it can fail before trusting it**: re-injected the original IT 02 defect, got exit 1; removed it, got exit 0. A guard that has never failed is indistinguishable from a comment — and my first injection attempt silently failed to match the text, so the guard "passed" a test that never ran. The second attempt, run through a script file rather than a shell one-liner, is what actually proved it.

**I also corrupted a file and caught it.** Using `Set-Content -Encoding utf8` to inject the test defect wrote a BOM and mangled every typographic character in IT 02 into `â€”` — the exact trap AGENTS.md rule 2 exists to prevent. `git diff` showed 198 insertions and 198 deletions on a file where I had changed one line. Restored from git immediately; content files get edited with the edit tool and never with a shell write.

**Two smaller results.** Port 9100 was confirmed against IANA — `pdl-datastream`, "Printer PDL Data Stream" — so IT 04's "nearly every network printer" holds; `verify-ports` is now 19 checks. And **the changelog guard caught a duplicate `### Fixed` section in this very edit**, which is the guard doing to me what it was built to do.

**The remaining worklist is honest about its verdict distribution.** A large share came back `UNVERIFIABLE` — teaching method, diagnostic heuristics, resume phrasing, case-study narrative, lab instructions. That is the vocabulary being used correctly: those are judgement calls, and marking them OK would have made the OK column mean nothing.

## 2026-09-16 (earlier) — Technical correctness: the claim class no guard could see, and the assumption that had blocked it

## 2026-09-16 (latest) — Technical correctness: the claim class no guard could see, and the assumption that had blocked it

**The task.** With quizzes done, I looked for the highest-value remaining work rather than the next obvious one. The corpus balance guard I had flagged was real but small. The larger item was recorded in `ROADMAP.md` as the thing nothing had ever tested: **whether the content is technically true.**

**The gap, stated precisely.** Every guard in this repository tests *internal consistency* — does the parser lose content, do cross-references resolve, does a table sum to the number the prose claims. Both comprehension passes test whether a beginner can *follow* the text. **Neither can see a sentence that is perfectly consistent, perfectly clear, and factually wrong.** The only error of that class ever found here — `modbus.func_code >= 15`, which also matches function code 43 and every exception response — was caught by a reader who happened to know Modbus. That is not a method.

**The item had been recorded as unclosable by an agent, and that was simply wrong.** It sat blocked on sourcing: `web_search` returning HTTP 401 and Indeed blocking automated fetching. Before proposing anything I tested the assumption, and it did not survive. **Search is broken; direct retrieval of primary sources is not.** RFC Editor returned 200 immediately, Microsoft Learn returned 200, and IANA's full port registry downloaded without trouble. The inference "no search means no verification" had gone unexamined across several passes.

**I demonstrated the method on a known error before proposing it as work.** Fetching the Modbus function-code table settled the old finding from a citable source: function codes run 1–255, 128–255 are exception responses, and **code 43 is Read Device Identification** — so `>= 15` did match it, and the earlier fix was right. That is what verification looks like: not "I checked and it seems right", which is just my recall with extra steps.

**Three tiers, and only two are automatable.** Tier 1 recomputes claims with an answer independent of any document — subnet arithmetic, or a worked example whose result must follow from its own data. Tier 2 checks against the *assigning authority* — the port table against the IANA registry that assigns port numbers, which is the assignment record itself rather than a document that agrees. **Tier 3 is judgement** — whether advice is good, whether an analogy helps — and it is not verifiable at all.

**The tier-3 honesty is the load-bearing part of the design.** A phase calling `/26` "the point where most beginners close the tab" is pedagogy, not fact. Marking it `OK` would launder an opinion into a verified column and make the whole column meaningless, so `UNVERIFIABLE` is an offered verdict in the worklist rather than a failure to try.

**What was built.** `extract-claims.mjs` pulls machine-checkable claims out of the nine IT phases: **954 raw, filtered to 216 that genuinely need a source** after settled classes are removed, emitted as a 432-line worklist with a verdict slot per row and written for pasting into a chat. Two tuning passes were needed — the first returned 233 CIDR hits in IT 03 alone, almost all of them addresses inside worked examples that assert nothing, which buried the ~20 that could be wrong.

**Three classes are now closed by machine, all passing.** `verify-cidr.mjs` — **42 checks** recomputing every CIDR table row, every mask-to-prefix equivalence, each RFC 1918 range's real span, and IT 03's worked `/26` example (`192.168.10.0/26` → network `.0`, broadcast `.63`, 62 usable). `verify-metrics.mjs` — **15 checks** recomputing all five of IT 06's metrics from its own ticket table, including which three tickets qualify as first-contact resolutions and the exactly-15 boundary case. `verify-ports.mjs` — **18 checks** against IANA.

**One deliberate inconsistency, recorded as a decision rather than left implicit.** `verify-ports.mjs` is **not** in CI. It needs the network, so its failure mode would one day be "IANA was unreachable" — a red build with nothing wrong with the content, which is precisely how a guard teaches people to ignore it. The two that recompute from the repository alone do run in CI.

**What is honestly still open:** 216 claims need a human or a model with sources — 153 command/cmdlet usages, 24 protocol assertions, 18 product-version claims (the class most likely to **rot**), 14 registry and path strings, 7 DNS record types. And the method cannot reach the class that matters most in the soft-skill phases.

**Verified:** lint 174/0; audit-content 0; audit-quiz 0; changelog guard 0 with 13 controls; validate-ci 32 steps / 0; verify-cidr 42/0; verify-metrics 15/0; verify-ports 18/0.

## 2026-09-16 (earlier) — Quizzes across the whole IT on-ramp, and the corpus defect the guard could not see

**Goal:** choose the next quiz batch. I recommended IT 03–05 and argued against "finish the three tracks", on the grounds that the IT on-ramp is read first and in order by someone preparing for their first job — where a self-check is worth most — while cyber and advance phases are read later and more often as reference. The choice made was the full IT track: **IT 03–09**.

**Verification came before authoring for the two phases where being wrong is not a matter of taste.** IT 03 is the densest phase in the repository (91 code fences) and carries all the subnet arithmetic. I recomputed every row of its CIDR table and its worked `/26` example independently before writing a single question that depended on them — all seven rows agree, and `192.168.10.0/26` is network `.0`, broadcast `.63`, 62 usable. IT 06's worked metrics week was checked the same way: first-response mean 27.2, MTTR 368.75 (6.1 h), reopen 25%, FCR 37.5%, and the 2,430-of-2,950 minute concentration all reproduce exactly. That is cheap insurance on questions whose wrongness would otherwise be invisible.

**Ninety-four new questions across seven phases, taking coverage to 10 of 31 and the corpus to 128.** Two subagents wrote IT 07 and IT 09; I wrote the other five.

**Three phases had questions that answered a different phase's material.** Writing a batch makes this likelier, not less: IT 08 briefly gained a question about metric definitions, which is IT 06's material, and IT 03's draft leaned on port facts IT 02 already covers. Both were replaced with questions from their own file. A quiz asks "did *this* phase land?", so a question sourced elsewhere measures the wrong thing — and it would have looked fine in every automated check.

**The guard gated three times, and the third one was mine.** IT 09's first draft put nothing in position A. A subagent self-caught an `A=0 C=7` skew in its own draft and fixed it. Then **IT 06 — which I wrote — shipped 8 of 14 in position C with position A unused.** I had pre-planned the answer distribution for IT 03, 04 and 05 and then wrote IT 06 straight through. Pre-planning some phases and not others is exactly how that happens, and the guard caught it before commit.

**Then the defect one level above the guard.** With ten quizzes in place I checked the corpus rather than each set: every quiz passed the 50% gate individually, but the **corpus had drifted to A=17.2% against C=35.2%**, and three phases sat exactly on the 50% line — passing by a hair. A reader working the track in order would notice the pattern across phases, and no per-quiz check can see it. Nineteen answers were reordered to reach **A=25.0% B=25.0% C=27.3% D=22.7%**. The guard was not wrong; a pass is only as strong as the level it inspects. Recorded in `CONTENT-SCHEMA.md` as the obvious next guard, with the numbers it should assert.

**Verified:** lint 169/0; audit-content 0; **audit-quiz 0 findings across 10 quizzes / 128 questions**, corpus positions A=32 B=32 C=35 D=29; changelog guard 0 with 13 controls; the build reports `quizzes: 128 question(s) across 10 of 31 phase(s)`.

## 2026-09-16 (earlier) — Quizzes, and the guard that catches what a per-question check cannot

**Goal:** the curriculum could measure whether the *text* was followable — every comprehension pass did that — but nothing measured whether the *reader* retained it. Add quizzes.

**The request was "go heavy on all the lessons", and the first move was to not do that.** Generating ~400 questions is fast, but a quiz is a *claim that an answer is correct*, and nothing in this repository verifies technical truth. Every pass so far has tested internal consistency — do these two sentences both claim to be true — so writing 400 answer keys from the same unverified text multiplies any error in it by 400 with no way to notice. There is a second reason specific to this reader: they are a beginner studying alone, and the comprehension passes worked because fresh readers hit unknowable gaps. A quiz written by the author of the text tests the author's understanding of it, which is a different claim.

**So: a vertical slice — three phases, one per track, chosen for different register.** IT 02 (procedural), cyber 01 (conceptual), advance 07 (code-heavy). 34 questions. If the format survives three teaching styles, scaling is mechanical.

**Authored in Markdown task-list syntax, and the deciding factor was paper.** `- [x]` marks the correct option, with an authored `<!-- id: phase-qNN energy: … -->` comment. Same syntax the checklist already uses, so it stays readable with `git` and a text editor — and it *prints*. The print stylesheet exists so a phase can be studied offline, and a quiz encoded as HTML or JSON would have been the one section that vanished on paper.

**The guard found, immediately, what two green builds and two author self-checks had missed.** The build validates each question: missing `[x]`, two `[x]`, absent `**Why:**`, duplicate id. What it cannot see is a defect of the *set*. My first draft of IT 02 put **seven of ten correct answers in position C** — every question individually valid, build green, and a reader answering "C" every time scores 70% without reading. Then `audit-quiz.mjs` caught advance 07 at **seven of twelve in C with position A never used**, a skew its own author had verified and reported as "spread" using a max-repeat test that could not detect the pattern. That is the fifth time in this repository a writer's self-check passed while the artifact was wrong.

**Not a scored test, and that is asserted rather than promised.** The site carries no `N of M` and no percentage anywhere else by the no-shame rule, and a quiz is the one place a number would feel natural and still be wrong. The summary names the questions to revisit: *"A few to look at again — questions 1, 2"* is actionable, *"70%"* is not. The unit suite and the browser check both assert that no percentage or score language reaches the DOM.

**Architecture followed the existing split.** Pure scoring logic in `learning-site/src/lib/quiz.js`, tested under plain Node with 53 checks and no DOM or build step — matching `lib/yourWork.js` and `lib/transfer.js`. The component only renders. A real-browser pass adds 15 more (the suite is now **107 checks, 0 failed**), because a control proven only in a unit test is a control that might not work when clicked.

**Two testing mistakes worth recording, both mine.** A fixture I wrote asserted `[1, 2]` for two missed questions and got `[1]` — the code was right and my fixture was wrong, because I reused position `0` as a "wrong" answer for a question whose correct answer *is* position `0`. The test failed loudly, which is the point of it. And the IT 02 quiz was destroyed mid-session by a `git checkout --` used to undo a deliberately injected test fixture, because the quiz had not been committed yet; it was rewritten. The lesson is the ordering, not the tool: **commit before running a destructive test.**

**Verified:** lint 169/0; content audit 0; AST 31/0 loss; readability 0 over both targets; refs 0 broken; time budgets 31/0; changelog guard 0 with 13 controls; **audit-quiz 0 findings across 34 questions**; validate-ci 30 steps / 0; terms self-test 16/0; **test:quiz 53**; the other twelve site suites unchanged and green; smoke 231 renders; **browser 107 / 0 failed**; build reports `quizzes: 34 question(s) across 3 of 31 phase(s)`.

## 2026-09-16 (earlier) — Two guards: one that could not be built, and one that found a defect immediately

**Goal:** close the last structural gap `CHECKPOINT.md` had carried for several passes — *"No guard reads `CHANGELOG.md`"* — and settle the topic-list guard the roadmap called the highest-value one absent.

**The two decisions are the same decision seen twice, and that is the useful part.** The checkpoint had recorded the CHANGELOG problem and declined to guard it, on the reasoning that nobody had written the check yet. This session wrote both, tested both against defects known to exist, and got opposite answers:

- **The topic-list guard cannot exist** (D-033). A keyword probe for the five already-confirmed-undelivered IT 02 topics returned hits for **all five** — a 0% detection rate. A structural check fired 125 times, on words like `changelog` and `around`. The reason is not tuning: probing `Startup apps` matched the topic list, the skills list, and a *practice task* — **three promises, no teaching** — so a presence-based check counts a promise as delivery, and **its pass path is the same shape as its skip path.** The five defects were closed by writing the content instead.
- **The CHANGELOG guard works, and it proved itself on the first run** (D-034). It asks whether a heading string occurs twice in a version block — arithmetic on the document, where failure and success are distinguishable *by the check itself*. It immediately found a fourth defect nobody had noticed: `[0.1.0]` listed `Fixed` before `Changed`.

**The rule extracted from the pair, which is the actual output:** *before building a guard, test it against ground truth you already have. If it cannot fail on a defect you know exists, do not build it.* The topic-list guard would have printed green on the exact defects it was written for, which is worse than no guard — it converts an unknown into a false assurance and stops the next person looking. This repository has now hit that failure five times.

**The CHANGELOG guard shipped with 13 controls and is verified by reproducing history, not just by passing its own fixtures.** Injecting a second `### Fixed` above the existing `### Added` — the exact `b9f6133` shape — produced two findings and exit 1: the duplicate and the order violation it causes. The controls assert that every defect class exits 1 *and names what it found*, and that three legitimate shapes exit 0 (a release omitting `Security`, a block with one section, a prose-only release note). Both run in CI.

**A third guard fell out of the work: the workflow now checks itself.** No YAML parser is vendored, so a malformed or dangling CI step is invisible locally — CI would fail to start, which reads as "no CI ran" rather than "CI is broken." `scripts/validate-ci.mjs` verifies all 27 steps are well-formed, that no line uses a tab, and that all 9 `node scripts/...` and 14 `npm run ...` references resolve. Verified capable of failing by injecting a reference to a script that does not exist.

**A trap worth recording, because it produced a false pass during this very session.** Reproducing the historical defect with PowerShell's `Set-Content -Encoding utf8NoBOM` silently failed — that enumerator does not exist in Windows PowerShell 5.1 — so the guard ran against an unmodified file and printed `exit=0`. It looked like the guard had missed the defect; in fact the defect was never written. Redone with Node, it fired correctly. **This is the same class as the `git show > out.md` UTF-16 trap already in `CHECKPOINT.md`, and it is the second time a PowerShell write has produced a wrong measurement.**

**Documentation drift fixed while in the files:** `AGENTS.md` described a two-track repository with 14 cyber phases and no `advance-roadmap/` at all; the CI table in `WORKFLOW.md` listed five content guards where nine now run; `CHECKPOINT.md` item 8 still claimed the topic-list guard was merely unwritten.

**Verified:** `validate-ci` 27 steps / 0 problems; lint **165 files / 0 issues**; `audit-changelog` 0 findings; `test-audit-changelog` **13 / 0**; content audit 0; lesson AST **31 / 0 loss**; refs 0 broken; time budgets **31 / 0 findings**; readability 0 over both targets; acronym detector 16 controls / 0 failed; build clean with **390 task IDs and 278 banded, 0 minted from position**; smoke **231 renders / 0 failures**; data 86, ui 42, today 77, work 31, path-order 37.

## 2026-09-16 (earlier) — The five unwritten topics, and a guard that could not be built

**Goal:** close the concrete content debt the comprehension pass had named — five IT 02 bullets in `## Specific topics to learn` with no teaching behind them — and settle whether the topic-list guard `ROADMAP.md` called "the highest-value guard currently absent" could be written.

**The guard cannot be built, and finding that out was worth more than building it would have been.** The item had been on the roadmap for several passes as an obviously good idea. Testing it against ground truth — the five topics already confirmed undelivered — killed it in three steps: a keyword probe returned hits for **all five** (a 0% detection rate on the exact defects it was for); a structural check fired **125 times**, keyed on words like `changelog` and `around`; and inspecting the hits showed why. Probing `Startup apps` matched the topic list, the skills list, and a *practice task* — three promises, no teaching. Any presence-based check counts that as delivered, so **its pass path and its skip path are the same shape.** Recorded as D-033, because this repository has been burned by that failure four times and a guard that fails open is worse than none: it converts an unknown into false assurance and stops the next person looking.

**So the five defects were closed by writing the content, which is what the guard would never have replaced.** Phase 2 grew **12,272 → 15,431 words** across five sections:

- **Dependent services** — `ServicesDependedOn` versus `DependentServices`, two names pointing opposite ways, and the pattern behind repeat tickets: a service that keeps stopping is usually a symptom, not the fault. Worked example: a spooler that will not stay up because the RPC Endpoint Mapper is down.
- **Startup apps** — the distinction that makes the ticket diagnostic (**services start before login; startup apps start at login**, separating "slow to boot" from "slow to log in"), the four places entries actually hide including Task Scheduler and the registry `Run` keys, and an explicit list of what never to disable.
- **NTFS versus share permissions** — **the more restrictive layer wins**, with a traced example where the Sharing tab reports Full Control and the user cannot save a byte, plus what `(OI)`/`(CI)` inheritance means and why a correct-looking parent permission denies the file actually clicked.
- **Update rollback** — the recipe table had said "Windows Update fails → `DISM`" and stopped there, covering repair but never *undo*. Now uninstall-update, Roll Back Driver, and a four-way comparison against System Restore and Reset this PC. The two facts that decide whether recovery exists at all — System Protection enabled beforehand, restore points created by installers rather than continuously — are why **the time to check is before the problem.**
- **Profile corruption** — the temporary-profile failure, the decisive `Win32_UserProfile` `TEMP`-path diagnostic, and the safe sequence that starts with copying the data out, because the profile folder still holds the user's files even when the desktop does not show them.

**Tasks 385 → 390, checklist 7 → 12, all banded and energy-tagged** (278 of 278). Three deliverable artefacts added, all chosen because they are the artefacts an interviewer asks about — the permissions write-up especially, since "explain share versus NTFS" is a real first-line screening question.

**A guard caught the fixer for the fifth time.** `audit-readability` went red on one paragraph written during this pass (96 words). Split at a sentence boundary, every word kept. The editorial backlog is back to **0 over 90 and 0 over 110**, which is where it has to stay now that the gate is at 110.

**Two stale checkboxes were corrected while in the file.** `ROADMAP.md` had two entries marked `[ ]` whose own text said "Built" — the checkbox and the sentence disagreed. Both are now `[x]`. One further IT 02 topic was found to be partially covered and is named rather than dropped: "local user vs Microsoft account" defines both types but never teaches creation, conversion, or what breaks when a Microsoft account is lost.

**Verified:** lint **162 files / 0 issues**; content audit 0; lesson AST **31 / 0 loss**; refs 0 broken with controls passing; time budgets **31 phases / 0 findings**; readability **0 over 110 and 0 over 90**; build clean with **278 banded, 0 minted from position**; smoke **231 renders across 31 phases and 275 tools, 0 failures**; data 86, today 77, work 31, path-order 37, ui 42; and **browser 92 checks / 0 failed** on Edge.

## 2026-09-16 (earlier) — There is no mid-level IT track, and that is now written down

**Question raised:** the mid-level track is cyber — what about IT? Investigated as a possible gap.

**It is not a gap. It is the design, and the strategy document says so plainly.** `career-roadmaps/README.md` names three goals in order, and Goal C reads: *"once you hold a security role, move from working tickets to owning outcomes. This is the third track, `advance-roadmap/`, and it is deliberately **not** for someone who has not worked in the field yet."* The path diagram directly below shows IT's role — the on-ramp that produces *"real tickets + users + systems"*, which the cyber track then converts into a portfolio. The same document tells a newly-hired reader to *"study cyber 5–8 hours/week"* and *"turn your work experience into security stories."* IT is the on-ramp, not a destination with its own ladder.

**The investigation was still worth running, because the documentation had drifted behind the decision in three places.** The strategy document was titled **"Remote IT First, Cybersecurity Next"** with a section headed **"How to Use Both Roadmaps Together"** — while that same section introduced the third track under Goal C. And **no document anywhere told the reader that the IT path ends**: someone who finishes Phase 9 and prefers IT would reasonably expect `advance-roadmap/` to continue IT, find that Phase 01 is "Detection at Scale", and have to infer the rule unaided.

**That is the real defect — not the missing track, but the missing sentence.** `career-roadmaps/README.md` is retitled, opens by naming all three tracks, and its section now reads "How to Use the Three Roadmaps Together", stating plainly that there is no mid-level IT track. `it-roadmap/00-overview.md` gains a closing **"What Comes After This Track"** section naming both destinations: security, which has a track; and staying in IT, which has the job and the fundamentals but nothing further here.

**Recorded as D-032**, because the advance track has D-026 explaining why it exists and the *absence* of a fourth track deserved the same treatment. `ROADMAP.md` and `CHECKPOINT.md` had recorded it neither as planned nor as considered-and-rejected — it was simply not written anywhere, which is why it read as an oversight. It is now listed under "Explicitly out of scope", with the note that D-032 is the record to amend if a fourth track is ever wanted.

**Verified:** lint **162 files / 0 issues**; `audit-content` 0; `audit-refs` 0 broken with controls passing; `audit-time-budget` **31 phases / 0 findings**; readability **0 over 110 and 0 over 90**; the relative link from the IT overview resolves; and the CHANGELOG's `[Unreleased]` still carries exactly three section headers with no duplicates.

## 2026-09-16 (earlier) — The unread material, read

**Goal:** close the gap the previous two passes created — cyber 15 and advance 07, two whole phases no fresh reader had seen, plus the five IT sections written to a market claim rather than an existing syllabus. Five readers, one per file, working from the same brief the three prior passes used.

**~40 findings were reported and about a dozen were rejected after re-checking** — a false-positive rate near one in three, higher than the advance pass's one in five. The reason is worth recording: the brief tells the reader the highest-yield question is *self-contradiction*, and a reader primed that way starts seeing contradictions in prose that is merely loose. Every finding was re-checked against the source before anything was edited, and the rejections are as much the result as the fixes.

**The best finding was a fixture that is not what it claims to be.** Advance 07's certutil rule matches `urlcache` OR `http://` OR `https://`, and the fixture the file introduces as its negative case contains **both** — so it matches, and the file's stated reason for its negativity ("it has no `http://` string") was false about text printed two paragraphs above it. A reader tracing the rule by hand would have concluded the rule was broken. The fixture is now honestly labelled as a second positive, and the genuine negative case is named.

**Cyber 15's closing takeaway reversed its own lesson.** The bullet said "everything above function code 15 is observation", while the table directly above it lists codes 5, 6, 15 and 16 as *writes* — so the takeaway put single-write events, the ones the phase tells you to alert on, into the harmless bucket. A related filter, `modbus.func_code >= 15`, was described as "multi-value writes" while also matching code 43 and every error response from 0x90 up.

**IT 05 had a destructive step ordered before its own safeguard.** The VM exercise ran `sysprep /generalize` as step 3 and said "snapshot before you sysprep" as step 4. A beginner following the list in order runs the step that cannot be undone before taking the snapshot that would undo it. The same file taught conditional access as available on a free tenant — the exact class the previous pass fixed in `checklist-master.md`, and the sibling cyber phase states the Entra ID P1 boundary plainly at its line 380.

**IT 04's new softphone section inverted the phase's own method.** It ordered device → headset → app → network, putting *scope* last, while the same phase teaches scope isolation as step 5 of its eight-step method and calls it "the question that solves half your tickets". Scope now leads, and one-way audio is named as the point where a first-liner stops and escalates.

**The guards caught the fixer again — the fourth time in this repository's history.** While the fixes above were being written, `audit-readability.mjs` went red on three paragraphs written during the fix (121, 142, 124 words) and then on a fourth (125). All four were split at sentence boundaries with every word kept, and the editorial backlog returned to zero. The lesson is the same one `renderInline` and the advance-04 pass taught: a passing suite is not evidence a change was correct, only that the checks it runs did not notice.

**The CHANGELOG drift returned, and was merged mechanically again.** `[Unreleased]` had accumulated a second `### Fixed` — the third time this class has appeared — because this pass's entry was added above a pre-existing one. Merged by script: **351 content lines before and after, multiset-identical**, four headers down to three, exactly one non-empty line removed. The file's own note says a structure check would be a legitimate gate under D-022 and that nobody has written it; that is still true.

**Two `CHECKPOINT.md` facts had drifted two passes behind** and were corrected: the structure block still said `cybersec-roadmap/ (14 phases)` and `advance-roadmap/ (6 phases)` against the actual 15 and 7, and counted 9 pages and 18 components against 10 and 19.

**Verified after all writes stopped:** lint **162 files / 0 issues**; `audit-content` 0; lesson AST **31 / 0 loss**; `audit-refs` 0 broken with controls passing; `audit-time-budget` **31 phases / 0 findings**; readability **0 over 110 and 0 over 90**; build clean; smoke **231 renders across 31 phases and 275 tools, 0 failures**; and the full site suite — render-inline 34, highlight 37, ui 42, data 86, notes 28, work 31, today 77, lesson-search 77, phase-transfer 56, path-order 37, search 41 — plus **browser 92 checks / 0 failed** on Edge `Edg/153.0.4234.32`.

**Carried forward, and one item is now the oldest in the repository.** Nobody has timed a single curriculum task, and this pass added prose without adding a measurement; that item has now survived four consecutive passes unchanged. Two new items are logged: the **IT market claim has still never been checked against a real job posting** (this session's search endpoint returned HTTP 401 and Indeed blocks fetching, so it needs working credentials or a human), and **five IT 02 topic-list bullets are still undelivered** — update rollback, startup apps, NTFS/share permissions, login corruption, and dependent services — which is the concrete instance of the guard `ROADMAP.md` calls the highest-value one absent.

## 2026-09-16 (earlier) — Four hardening tasks, and the same defect class three times

**Goal:** close the four items the previous pass left open, in an order that does not invalidate its own work — comprehension-audit the six never-read advance phases, then a density pass on the paragraphs that audit could not fix, then resolve the two detectors that printed without gating, then extend the browser check to a second engine and the width band it never rendered.

**The comprehension audit produced 45 findings, and about nine of them were wrong.** Six readers, one per advance phase, working from the same brief the entry-level audit used. Every finding was re-checked against the source before a fix was applied, and the ones that did not reproduce were left alone. The real defects were the familiar classes: **arithmetic that does not close** (advance 01's worked example stated 14,880 minutes where its own script computes `1,231 × 12 + 9 × 45 = 15,177` — every alert priced as a false positive, contradicting the row beneath it), **a retired ATT&CK identifier** (`T1050` for Process Injection, renumbered to T1055 before v7, in the phase that teaches the reader to map techniques to IDs), **two people in one seat** (the declaration announcement gave Ops to J. Lim and Scribe to M. Santos while the org chart, action list and SITREP all say the reverse), and **a term the topic list promised and the body never delivered** (`unified command` appeared once, in the subject list, in 1,027 lines).

**The most useful finding was a promise half-kept.** Advance 03's topic list offers "what adapts cleanly to security and what does not", and the body covered only the first half — the four roles and span of control. The reader was told to learn a comparison the phase never made. It now states what does *not* adapt: no clean demobilisation, an adversary who reacts to visible containment, and legal clocks that start on day one rather than after the investigation. That is the class of defect no mechanical guard can see, and it is why the comprehension pass exists.

**The density pass ran second, on purpose, and the count nobody could act on was the actual defect.** `audit-readability` reported **17 paragraphs over the 90-word editorial target and gave no file and no line for any of them** — so an ad-hoc scanner was written, and it disagreed with the guard (41 vs 17) because it scanned whole files while the guard measures only the lesson region and treats lists and tables as boundaries. **The right fix was to make the guard say where, not to trust the second instrument.** `--list` now prints each one with its file and line, and the refactor that added line tracking preserved the count exactly (still 17, still exit 0), which is the check that it changed the reporting and not the measurement.

**All 17 were then split, and "keep every word" was proved rather than assumed.** Each file's **word sequence** was snapshotted before the work (29 files, 398,688 words) and re-compared after. Inserting paragraph breaks cannot change a word sequence, so an identical hash is proof the edits were mechanical and any difference would be proof they were not. All 29 identical. The longest paragraph in the repository was 108 words, in advance 05; nothing now exceeds 90.

**Two detectors were printing without gating, and reading their output settled a question five measurement passes had not.** `FORWARD_AS_PRIOR` in `audit-refs.mjs` was called `(0)` for its whole life and that was **not a clean corpus**: its call site sliced `line.slice(0, m.index + 4)` — four characters from the match start, i.e. `"Phas"` — so the cue regex, which needs the literal word, could never fire. **The detector had never been capable of firing.** Fixed to `m.index + m[0].length`, it now reports 2 real observations and carries 10 controls that run on every invocation.

**The acronym audit had the same disease, four times over.** It reported `**SPF** (Sender Policy Framework)` as never explained **on the line that explains it**, because Markdown emphasis sat between the term and its gloss. Three more shapes were invisible the same way: a noun between term and gloss (`CIDR notation (Classless Inter-Domain Routing)`), the article form the curriculum actually writes (`NOC — a Network Operations Centre`), an em-dash inside the gloss (`UID (user ID — …)`), and table-cell expansions (`| **GRC** | Governance, Risk, and Compliance |`), which have no parenthesis at all. **This is now the third instance of one class in this repository** — after the forward-as-prior slice and the time-budget flag that never cross-checked a table — and in all three the wrong version printed a clean result.

**The gate-or-delete question was answered by splitting the judgement** (D-028). Whether a beginner can decode `SSID` is a claim about *the reader's state*, so the corpus report stays a measurement that always exits 0. Whether a definition is *present on the line* is a claim about *the text agreeing with itself*, so the instrument gates: **16 controls, 6 must-fire and 10 must-not-fire**, running on every invocation, failing loudly before any finding prints. The table-cell shape is tested **by its initials** — the capitalised words of the next cell must spell the acronym — so `Governance, Risk, and Compliance` → `GRC` fires and `Collects logs from many sources` for `SIEM` does not. A shape-based pattern would have accepted the second.

**The controls paid for themselves on the first run.** Wired in and executed, they failed immediately on a shape I had not written a pattern for, and stopped the audit rather than under-reporting quietly. Counts moved as false findings disappeared: actionable 82 → 73.

**The browser check finally rendered the band it had never rendered, and found a defect in its own assertion.** Adding 760px and 620px to a loop that had only ever tested 1440 and 900 produced an immediate failure: `rail: has collapsed by 620px` failed with the rail measuring 573px. **That assertion was wrong about the site, not a defect in it.** `global.css` declares two breakpoints and neither is a rail collapse — `max-width: 860px` makes the *sidebar* an off-canvas drawer, and the rail goes two-column only at `min-width: 1180px`. A full-width rail at 620px is the correct layout. The assertions were rewritten against what the CSS actually declares, with widths on **both sides of each breakpoint** (1180/1179, 861/860) so each flip is observed rather than assumed: **79 checks, 0 failed**, up from 50. The script also now names the engine it measured (`Edg/153.0.4234.32`), because the browser list tries Edge first and every prior run silently measured Edge while reporting only "a real browser".

**Verified:** lint **154 files / 0 issues**; `audit-content` 0; lesson AST **29 / 0 loss**; `audit-refs` 0 findings with 10 controls passing; `audit-time-budget` **29 phases / 0 findings**; readability **0 over 110 and 0 over 90**; `audit-terms --self-test` **16 controls / 0 failed**; browser **79 checks / 0 failed**. CI run **#57 on `11f62e4`** is green **in both jobs, every step**, and it is the run that answers two questions this entry had left open: its Content integrity job shows the new **`Audit acronym detector (self-test)`** step as `success` (its first observation on a runner), and its Learning site job shows **`Browser check (real engine)`** as `success` — the CI runner's **Chrome**, driving the same 79 checks over the same seven widths this machine drives with Edge. Run #55 on `23cc042` was green in both jobs as well.

**Five findings the comprehension audit raised were applied after the docs were first written, because they needed verification rather than a sentence.** All five are in advance 04, and none needed an external source — the file argues against itself in each case. Its break-glass trust policy printed an `sts:AssumeRoleWithSAML` condition on `aws:MultiFactorAuthPresent: true` while the same phase defines that key as a property of *AWS-issued* credentials and states twice that the MFA context is not propagated; a federated role is handed its credentials by the IdP assertion, so the policy would have denied every assumption, including from someone who did present MFA. Its command-line example read `aws configure get role.access_key` for a profile that `sts assume-role` never writes. Its CI workflow was described as using OIDC while holding no credential at all and never calling AWS. A cross-reference named `DenyOutsideRegionAndBreakGlass` as being in Part 2, and Part 2 does not contain it — it is now a description of the shape plus the escape hatch, which is what a reader needs anyway. And the free-tier claim was true except for the one policy its own resource table told the reader to build: Conditional Access is Entra ID **P1**, which the sibling cyber phase states plainly at its line 380. **Two guards caught my own work while I made those edits** — the readability gate went red on three paragraphs I had just written at 130, 122 and 112 words, and `audit-refs` flagged `Phase 09` inside a phase-04 file as a reference to advance phase 9. Both fixed; the splits keep every word.

**One documentation defect was found by accident and is worth recording, because no guard could have found it.** `CHANGELOG.md` had accumulated **eleven** sections under `[Unreleased]` — four `Fixed`, four `Changed`, three `Added` — because each pass appended its own set of headers above the previous ones. Keep-a-Changelog permits one of each per release. The duplication predates this pass (it was already four and three at `23cc042`), and my own documentation commit made it worse by adding a third set. The merge in `b9f6133` is mechanical and proved so: **eight header lines removed, 312 content lines byte-identical, 340 non-empty lines down to 332 with zero lines unique to either side, and the `[0.1.0]` section hashing identically before and after**. **No guard reads `CHANGELOG.md`**, so this can return on the next append; it is recorded rather than guarded, and a structure check would be a legitimate gate under D-022 if someone writes it.

**Carried forward, and one item is now sharper.** The corpus acronym report still needs a human, and a lowercase gloss (`**PID** is the process ID`) is still not recognised — recorded as a limit rather than papered over. The browser check drives one engine per run, and the second-engine evidence now exists as an observed CI run rather than an inference from the script's structure. And the largest untested claim is untouched — **nobody has timed a single curriculum task**, and this pass added prose to the advance track without adding a single measurement.

## 2026-09-16 (earlier) — A third track, and the formatter bug its content exposed

**Goal:** extend the curriculum past entry level — a third track for the years *after* the first security job — while the free API access was still available. Three decisions were taken first: build the mid-level track rather than another entry-level one; write the complete track (overview + all six phases + checklist) in one pass; and teach the pipeline to carry a third track rather than bolting it on later.

**The track is deliberately not completion-oriented.** `career-roadmaps/advance-roadmap/` is six phases — detection at scale, threat hunting, incident command, cloud identity architecture, adversary emulation, programme and influence — and its overview says plainly that it is for someone who already holds a security role, that it is **not** for someone who does not, and that all six are not meant to be taken. The checklist says "a menu, not a syllabus." The two items it calls non-optional are the Phase 5 authorisation reasoning and the Phase 6 ethical boundaries. Every hour figure is labelled an estimate, because nobody has timed a task in this repository and the new track was not going to pretend otherwise.

**A new track is invisible until seven places are told about it, and that is by design** (D-026). `build-content.mjs`, `audit-content.mjs`, `audit-refs.mjs`, `audit-readability.mjs`, `audit-terms.mjs`, `audit-time-budget.mjs`, `add-frontmatter.mjs` and the site's `roadmaps.js` each carried their own two-track assumption in its own list. The first attempt to widen them crashed with `ENOENT` on a directory that did not exist yet — which was the *better* outcome, because it announced the problem rather than passing quietly. Every walker now tolerates a missing directory and **prints a note naming what it skipped**, so a `0 findings` summary can never be mistaken for full coverage.

**The guards going red on a half-built track was correct behaviour, and the temptation to suppress it was the actual risk.** With the overview written and the phase files not yet, `audit-refs` reported 23 `PHASE_DOES_NOT_EXIST` findings and `audit-time-budget` reported 6. Both were true. The response was to finish the track, never to add an "ignore missing phases" exemption — that is how a gate acquires a permanent exception list. Both are back to **0 findings** now, and the red period lasted exactly as long as the track was half-built.

**One user-visible defect came with the third track, and it was a wrong label rather than a crash.** `Search.jsx` read `hit.k === "cyber" ? "Cyber" : "IT"` — true only while there were exactly two tracks. A result from the advance track would have been labelled `IT`, naming the wrong roadmap in a way a reader cannot debug. It now resolves the label from the track registry, and the same two-track wording was corrected in the tools library, the portfolio and the dashboard.

**Then the new content found a real formatter bug, which is the part worth keeping** (D-027). `renderInline.jsx` matched bold, italic and code in one alternation, and its bold branch `\*\*[^*]+\*\*` cannot span an asterisk. `advance-04` contains *The third statement uses `Resource: "*"` inside a key policy, and that is correct.* — so bold failed to match, the engine fell back to `*italic*`, and it paired asterisks **across** the code span. The page showed a literal backtick and lost the bold entirely. `test:smoke` went red on that one lesson and passed on the other 28; the assertion was correct and the content was correct.

**The fix is structural, not a wider regex.** `maskCodeSpans()` extracts every paired `` `code` `` run before the emphasis pattern runs, and `restore()` substitutes the `<code>` element back at the leaves. The emphasis branches now only ever see markers that are genuinely markers — a property no pattern tweak provides, because the old pattern was not failing to match, it was matching the wrong thing. `test-render-inline.mjs` (`npm run test:render-inline`, 34 cases, wired into `npm test` and CI) pins the rule, not just the corpus.

**Three of that new test's own assertions were wrong first, and the third is the interesting one.** Two were harness bugs — I compared against React's HTML-escaped output without decoding `&quot;`. The third was a false expectation: I asserted `2 * 3 * 4` should render literally, but CommonMark genuinely pairs those asterisks and marks `" 3 "` italic — **the formatter was right and the test was wrong.** It now asserts that behaviour and says why, so the next reader does not "fix" the formatter into disagreeing with Markdown.

**Verified:** `lint-content` **154 files / 0 issues**; `audit-content` 0 issues; `audit-lesson-ast` **29 lessons / 0 loss**; `audit-refs` 0 findings; `audit-time-budget` **29 phases / 0 findings**; readability **0 paragraphs over the 110-word ceiling**, **16 over the 90-word editorial target** across 11 phases, and **3 of 29 phases over the sentence-length target** (advance 03/04/05 at 19/21/19 against ≤ 18) — reported, not gated; task IDs **346** (IT 90, cyber 162, advance 94), practice tasks **252** banded (quick 34, focused 144, deep 63, ongoing 11) and **252/252** carrying energy (low 36, normal 158, high 58); build clean at **556 KB raw / 162 KB gzipped**; smoke **219 renders across 29 phases and 251 tools, 0 failures**; render-inline **34 passed**. All documentation figures were re-measured with the repository's own scripts rather than adjusted by arithmetic.

**Carried forward, and one item got worse.** The comprehension audit's verdicts remain advisory. `FORWARD_AS_PRIOR` and the acronym scan still print without gating. The browser check is still one engine at two widths. And the largest untested claim is now larger: **nobody has timed a single curriculum task**, and the new track adds ~90,000 words of prose whose hour figures are all estimates. **None of the six advance phases has been through either comprehension pass** — both ran before the track existed, so they pass every mechanical guard while no fresh reader has yet asked where a beginner would stop in them. A guard that proves the arithmetic is *consistent* is still not a guard that proves the numbers are *right*.

## 2026-09-16 (earlier) — A guard that was never wired to anything

**Goal:** close the gap the second comprehension pass left behind. That pass found its most productive defect class for the third time — arithmetic that only disagrees when you read two places at once — and wrote `scripts/audit-time-budget.mjs` to catch it. The script ran clean, reported `phases checked: 23 / findings: 0`, and was then mentioned in **no document and no workflow**. It was a guard that nothing would ever run, which is the same defect this repository has now recorded three times in other forms: a check that cannot fail, a regex that cannot match, a skip that reads as a pass.

**The fix is three lines of YAML, a checklist line and a decision record, and the work was in noticing it was missing.** `audit-refs.mjs` had a CI step, a `WORKFLOW.md` section and a D-record. `audit-time-budget.mjs` had none of the three, so it lived in the repository as a script a human might one day remember to run. It now runs in the content job beside `audit-refs.mjs`, appears in the commit checklist, and is written up as D-025.

**What it checks is four things, and all four are arithmetic on the text.** A budget table whose parts must sum to the total it prints; a stated week range whose minimum exceeds its maximum; frontmatter `duration`/`duration_weeks` disagreeing with the bold lead of the phase's own "Estimated time" line; and a track overview listing a different week count than the phase file it points at. That is the test D-022 set for a gate — *is this a claim about the text agreeing with itself* — and every check here compares two places in the same repository. The classes that fail that test, term decodability and a forward phase cited as prior knowledge, still print without gating, and that has not changed.

**Two of the script's own checks were wrong first, and both printed a clean result.** Class 1 originally summed bare `4-6` cells in a schedule table by accident and reported success on three tables out of the corpus; it now keys off the table's own `Hours` column header, and a table that *has* an Hours column but no checkable total is a **finding**, not a silent skip — a check whose skip path looks like its pass path is not a check. Class 4 tracked "am I inside a table right now" rather than "have I seen a table row", and since the last table in a file is always followed by prose, the flag was false by the last line and it **never cross-checked a single week count**. Both wrong versions were green. Both are now recorded in the file's own comments rather than quietly fixed, because a guard's false start is evidence about whether the guard can fail.

**The class is worth the guard and the history says so.** Cyber 09 stated 60–80 hours above parts summing to 40–56 — the stated minimum above the table's stated maximum. Cyber 02 stated 40–60 above parts summing to 37–59. Cyber 02 called itself the heaviest phase in the track while cyber 06 budgets 120–180 hours. The cyber overview listed phases 9–14 as 4 weeks each while every one of those phase files says 6 weeks in both frontmatter and prose. IT 03 said "the scheduled four weeks at 5–8 hours a week" for a 20–30 hour total, and 4 × 8 = 32. **Every one of those was introduced by an edit that changed one place and not the other**, which is precisely the regression a standing check prevents and precisely what a human re-read does not.

**Verified:** `audit-time-budget` **23 phases / 0 findings**, `audit-refs` 0 findings, readability **0 of 23** with **0 over 110** and 0 over 90, `lint-content` **145 files / 0 issues**, `audit-content` 0 issues, lesson AST 23 / 0 loss, task IDs **252** unchanged, bands **183/0**, energy **183/183**.

**One documentation correction came with it.** `CHECKPOINT.md` said **144** tracked files and `lint-content` now counts **145**: the script existed before this pass but had never been counted, because the count had been taken from the previous pass's list rather than from `git ls-files`. The same row now names all five files this date added rather than four.

**Carried forward, unchanged.** The comprehension audit's *verdicts* remain advisory — two passes disagreed on 2 of 23 phases, so a third would not reproduce either set. `FORWARD_AS_PRIOR` and the acronym scan still print without gating, so each needs a human. The browser check is still one engine at two widths. And the largest untested claim is untouched by any of this: **nobody has timed a single curriculum task.** A guard that proves the arithmetic is *consistent* is not a guard that proves the numbers are *right*, and the gap between those two statements is now the whole of the remaining risk in the time budgets.

## 2026-09-16 (later still) — The audit re-read itself, and two of its verdicts did not survive

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

## 2026-09-16 (later) — The density gate moved down, but only once there was nothing left for it to catch

**Goal:** finish the tightening that the previous pass had explicitly deferred. `audit-readability.mjs` gated at 150 words per paragraph while the editorial standard was 90, and the open item said so: *"Consider tightening the gate from 150 to 110 words once the backlog is cleared."* The backlog was not cleared. Four paragraphs sat over 90 — IT 01 at 91, IT 03 at 95, IT 05 at 94, IT 07 at 93 — so the item stayed open and the gate stayed at 150.

**The four paragraphs came first, and they are the whole argument for the order.** Each was a single paragraph carrying two ideas joined at a sentence boundary that already existed. Splitting them moved the break and changed no text — **every word preserved** — which is the same repair the 33 earlier walls of text received. Doing this *after* lowering the gate would have meant either grandfathering four known offenders or failing the build on work that was already on the list, and a gate with a grandfather list is not a gate.

**Then the gate moved to 110, not to 90.** The gap is deliberate and it is the substance of D-024. A gate at the editorial target would fail on every clarification a writer adds — and the four paragraphs that were just split exist *because* the text got easier to follow, not looser. 110 sits above that noise and below a genuine wall of text: it fails on prose a reader has to re-read, and passes prose that merely wants splitting. **The failure that keeps a gate honest is one it can pass.**

**Both thresholds are now named constants.** `EDITORIAL = 90` and `CEILING = 110` replace the five places the numbers used to be written as text — two column headings, two summary lines and the failure message — so the report and the gate cannot drift apart. The comment above them records why they differ, which is the part a future reader would otherwise have to reconstruct from the diff.

**Verified, not assumed.** Readability **0 of 23** phases outside target, `Paragraphs over 90 words: 0 across 0 phases`, `Paragraphs over 110 words: 0`; longest paragraph **90 (IT) / 86 (cyber)**; cross-references **0 findings across 25 files**; build clean; smoke **181 renders across 23 phases and 191 tools, 0 failures**. The site suites from the previous run stand unchanged — 37 / 42 / 86 / 28 / 31 / 77 / 77 / 41 and **50 browser checks / 0 failed**.

**Final state.** `HEAD == origin/main` with a clean tree after the commit. Guards: lint 144 files / 0 issues, content 0, AST 23 / 0 loss, readability 0 of 23 with **0 over 110** and 0 over 90, refs 0 across 25 files, site suite 37 / 42 / 86 / 28 / 31 / 77 / 77 / 41, smoke 181 renders / 0 failures, browser 50 / 0.

**Still carried forward, unchanged by this pass.** The audit's *verdicts* are one reader's judgement — only its findings were re-verified against source. `FORWARD_AS_PRIOR` and the acronym scan print without gating, so each needs a human. The browser check is one engine at two widths, so it is not a cross-browser matrix and does not cover the 561–860px band. And **nobody has timed a single curriculum task** — every band and energy value remains an authored estimate.

## 2026-09-16 — A guard that could not fail, and the documentation that said it was fine

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