# Beginner-comprehension audit — findings

A read of all 23 phases asking one question the existing guards structurally cannot:
**where does a motivated beginner with no IT background stop reading, and why?**

All three passes together cover every phase that existed when each ran. The first two cover
the 23 entry-level phases; a third, added later, covers the six advance phases — so this file
accounts for **all 29 lessons as of the advance pass**. Read the entry-level sections with that
in mind: every count in them is a count of 23, and it was correct when it was written.

**Two phases were added after the third pass and no pass covered them** — cyber Phase 15 (OT and
ICS security) and advance Phase 07 (detection as code). **Both are now read**, along with the five
IT sections the gap pass added, in [Fourth pass — the unread material](#fourth-pass--the-unread-material)
at the end of this file. The count that section accounts for is not phases but *material*: two whole
phases plus five sections inside phases that had already been read once.

Every guard in this repository tests internal consistency — does the parser lose content,
is the prose dense, do the cross-references resolve. None can see a phase that teaches
correctly but cannot be *followed*. This audit is the human-shaped check for that.

Nine readers covered the 23 phases, three each, working from a six-category brief
(undefined term, assumed knowledge, unfollowable step, unearned leap, term avalanche,
prerequisite order). Findings are falsifiable — each carries a real line number and a
verbatim quote — and false positives were explicitly penalised, because a clean bill is
a useful result. Every finding below was re-checked against the source before a fix was
made; two were rejected as wrong.

**The verdict table below is the first pass.** A second, independent pass re-read all 23
phases with fresh readers who had not seen the first set of reports, and it changed two
verdicts. See [Second pass — the re-review](#second-pass--the-re-review) at the end of this
file. Read both together; neither is final on its own.

---

## What the audit found, by phase

| Phase | Verdict | Findings fixed |
|---|---|---|
| IT 01 computer fundamentals | followable | 4 |
| IT 02 operating systems | **would abandon** | 6 |
| IT 03 networking basics | followable with friction | 5 |
| IT 04 helpdesk skills | followable with friction | 7 |
| IT 05 sysadmin basics | followable with friction | 3 |
| IT 06 tools and ticketing | followable with friction | 3 |
| IT 07 soft skills | followable with friction | 3 |
| IT 08 portfolio and resume | followable with friction | 3 |
| IT 09 job application plan | followable with friction | 5 |
| Cyber 01 foundations | followable with friction | 3 |
| Cyber 02 networking and linux | followable with friction | 4 |
| Cyber 03 security fundamentals | followable with friction | 3 |
| Cyber 04 hands-on labs | followable with friction | 2 |
| Cyber 05 specialization choice | followable with friction | 2 |
| Cyber 06 portfolio projects | followable with friction | 4 |
| Cyber 07 certifications | **followable — clean** | 0 |
| Cyber 08 job application | followable with friction | 2 |
| Cyber 09 cloud and identity | followable with friction | 5 |
| Cyber 10 detection engineering | followable with friction | 3 |
| Cyber 11 incident response | followable with friction | 3 |
| Cyber 12 scripting automation | followable with friction | 4 |
| Cyber 13 grc compliance | followable with friction | 3 |
| Cyber 14 web app security | followable with friction | 4 |

All 23 phases are covered. 18 of them needed at least one fix; one (cyber 07) came back
clean and was checked rather than trusted; one (IT 02) was judged **would abandon**.

Five classes of real defect came out of it, and none of them is a term-density problem:

1. **A demonstration that silently fails.** IT 05 Check 5 denies read on
   `C:\P5-AccessLab\Child`, then reads a file in the *parent* folder and tells the reader
   the Deny won. The reader's own output contradicts the lesson.
2. **A worked artefact that is arithmetically or syntactically impossible.** Cyber 05's
   weighted totals (82/63/88/61) cannot be produced from its own table, whose weights sum
   to 14 — a ceiling of 70. Cyber 06's `I2` formula encodes 6 of the grid's 16 impact/urgency
   pairs, returns `P2` where the grid says `P1`, and indexes a 4-row range with entries 5–6.
   Cyber 14 states a CVSS of 7.1 for a vector that computes to 6.5, against its own band
   table that calls 6.5 Medium.
3. **A cross-reference to a section that does not exist**, or that says the opposite:
   IT 06 sends the reader to "Part 5's structure" for the escalation note, which is in
   Part 4; IT 07 refers to a nonexistent "Part 8"; cyber 03 claims Phase 1 defined least
   privilege and access review, and Phase 1 never does.
4. **A contradiction inside one phase.** IT 09 sets two different application targets,
   three different follow-up intervals, and two different tracker column lists. Cyber 09
   advertises a conditional-access lab that it later says needs a paid licence. Cyber 11
   states a gap of "2 minutes 58 seconds after the document was received" when receipt to
   execution is 6m29s — 2m58s is the gap from the file write two rows later.
5. **Executable code that cannot run.** This class only emerged from the last three reports,
   and it is the one that wastes the most reader time because the failure looks like the
   reader's own mistake. Cyber 12's corrected auto-closer prints `evaluated`, which is never
   defined — a `NameError` in the centrepiece of the lesson. Cyber 12's `from lookup import`
   has no `lookup.py` to import from, because the earlier example was never given a filename.
   Cyber 12's README setup is Unix-only (`export`, `grep`, `cut`) in a Windows-targeted
   curriculum. Cyber 10's Wazuh rule uses a positive `<field>` match for the parents it means
   to *exclude*, so it fires when the parent **is** the management tool — the inverse of the
   Sigma and SPL versions it is presented as equivalent to. Cyber 10's auditd rules are handed
   over with no target file and no load command, so the exercise cannot be performed at all.
   IT 03's "break it on purpose" walkthrough calls `Disable-NetAdapter` without saying the
   shell must be elevated.

Plus one genuine "would abandon": IT 02 Ticket 2 is built entirely on a Windows domain,
Active Directory and `Get-ADPrincipalGroupMembership`, for a reader whose stated machine is
a home PC.

### The recurring shape

Two cross-phase patterns the separate readers found independently, which is why they are
worth naming rather than fixing once:

- **A phase defers to a later phase that does not cover the thing.** IT 03 sends the reader
  to "Phase 4 (VPN)" five times (lines 841, 957, 1407, 1409, 1419). Phase 4 is Helpdesk
  Skills: it has a VPN *ticket* and no VPN *teaching*, and it uses "split tunnelling" at
  line 1107 as though it were already defined. Cyber 03 cites Phase 1 as having defined
  `least privilege` and `access review`; Phase 1 never does. This is the defect
  `scripts/audit-refs.mjs` now catches when it is a plain name, and prints when it is a
  forward-phase claim.
- **Elevation is assumed by phases that come before the phases that teach it.** IT 03 issues
  `Disable-NetAdapter` and `Set-DnsClientServerAddress`; IT 04 sets a DNS server to
  `127.0.0.1`. All need an Administrator shell. IT 02 line 185 and IT 05 line 745 do teach
  elevation — both after the reader first needs it.

## What was rejected

Two subagent findings did not survive checking and were **not** applied:

- IT 09: "a reader who built the Part 4 sheet gets a follow-up date in the wrong column."
  Part 4 puts Follow-up at position 7; Exercise 1 puts Follow-up date at position 7. The
  `G2` formula is correct in both. The duplicated column list is a real defect; the stated
  consequence is not.
- IT 05: the `Start-BackupJob` claim was accepted, but as a labelling fix rather than a
  rewrite — the cmdlet is wrong, and the honest repair is to mark the block illustrative.

Two further "findings" came from the **guard written to catch this class**, not from a reader,
and both were the guard being wrong:

- `scripts/audit-refs.mjs` reported `cybersec 04:763` — "Phase 3's Part 4, made concrete" — as a
  broken reference. It resolved a phase-qualified reference against the containing file. Phase 3
  does have a Part 4 (Web security), so the prose was right. Fixed by resolving `Phase N's Part M`
  against phase N.
- It then flagged the *repaired* `cybersec 11:64` sentence, because `PRIOR_CUE` included the bare
  word `from`, which matches "risk reasoning **from** Phase 13 arrives later" — a clause that
  explicitly disclaims prior knowledge. `FORWARD_AS_PRIOR` is therefore informational and does
  not gate, exactly as the acronym scan is.

Three false starts across two mechanisms is the honest rate, and it is the argument for the
class split rather than against the audit.

A clean bill was also returned for cyber 07, and it was checked rather than assumed: CVSS/CVE
is taught in cyber 03, the setuid bit in cyber 02, Sysmon and Event IDs in cyber 03, the
20-job-post discipline and the risk register in cyber 05.

---

## A negative result: the acronym audit does not converge

`scripts/audit-terms.mjs` was written to catch one class mechanically — a shortened form
reaching the reader before anything says what the letters mean. It is retained as a
**measurement that always exits 0**, never a gate, and the reason is worth recording.

| Iteration | Change | Domain-term count |
|---|---|---|
| 1 | first run | 365 |
| 2 | three-way classification (universal / not-an-initialism / domain) | 232 |
| 3 | whole-line expansion window, four accepted shapes | 232 |
| 4 | exclude the syllabus sections | 227 |
| 5 | actionable tier: >=3 chars, used in >=2 files | 72 |

Five measurement fixes, and the residue is still `AMD`, `USD`, `UTC`, `PID`, `NTFS`, `CMD`,
`ISP`, `SSID`. Two of those are brands, one is a currency code, and `PID` is flagged on a line
that reads "**PID** is the process ID — the handle you use to act on it", i.e. explained in the
very sentence that reports it as unexplained. A targeted diagnostic confirmed the regexes work:
`MSP` matches at IT 01:600, `NOC` at IT 01:634, `PSU` at IT 01:359 — all lines that define the
term in prose rather than in parentheses.

**The class is real but not regex-detectable.** "A term a beginner must decode" versus "a proper
noun that happens to be capitalised" is a semantic judgement about the reader, not a property of
the string. The audit's per-run numbers stay useful as a prompt for a human read — and the human
read found the real defects, which were structural (a Deny that does not deny, a formula that
encodes the wrong table, a CVSS that contradicts its own vector) and which no term scan would
have surfaced.

The fixes for the term findings that *were* real are one-clause glosses at first use: SPF/DKIM/DMARC
in cyber 02, fail2ban in cyber 04, disposition in cyber 05, SID in cyber 06, CISO and the SOC 2 CC
numbering in cyber 13, JWT in cyber 14, PSA and CompTIA A+ in IT 09, tenant and subscription in
cyber 09.

---

## Second pass — the re-review

This file's own closing note said the verdicts were one reader's judgement. This pass tested
that claim: eight fresh readers re-read all 23 phases with no sight of the first reports, and
roughly ninety further fixes came out of it across sixteen phases. The most useful result is
not the fix count — it is that **the two verdict sets disagree**, in both directions.

### Where the verdicts diverged

| Phase | First pass | Second pass | Which held up |
|---|---|---|---|
| IT 02 operating systems | **would abandon** | followable with friction | second pass — the domain-tooling defect is real, but it is one ticket, not a wall |
| IT 08 portfolio and resume | followable with friction | **would abandon** | second pass — the prior audit under-called it |

That is a two-for-two miss rate on the strongest verdict either pass can issue, from readers
given the same brief on the same files. The `would abandon` label is the least reproducible
thing this audit produces, and the fix for that is the second read, not a better first read.

### The new abandon-risk the first pass missed

**IT 06's priority formula cannot return a priority.** Line 555's `VLOOKUP` builds a key from
`$G2&$H2` — `IndividualHigh` — and looks it up in `Lists!$A$2:$C$17`, whose column A holds
*categories* (`Hardware`, `Software`, …). No cell matches, so every row of the showcase
workbook returns `Check the grid` — and the prose at 559 calls that range "the lookup table it
encodes" when the grid printed at 561–566 is not in its range at all. The reader follows the
build instructions exactly, gets a worksheet full of an error string, and has been told to
trust the material. This is class 5 (executable code that cannot run) and class 2 (a worked
artefact that cannot be produced), in the first thing the phase asks the reader to *build*.
Replaced with an `INDEX`/`MATCH` pair against the grid placed explicitly on `Lists`, with the
concatenated-helper-column alternative named as the other honest route.

Three more of the same shape, found in this pass and fixed:

- **Cyber 09's first executable artefact is a POSIX shell loop** handed to a reader who may
  have no Linux shell at all, while Phase 4 explicitly permits a low-RAM reader to have no
  local VM. The loop now says where to run it.
- **Cyber 09's S3 audit measured the wrong thing.** It reported `NO BLOCK CONFIGURED` as the
  only signal, but a bucket with a block configured can still be public through a *policy* —
  which is exactly what task 5 tells the reader to create. The command now makes three checks.
- **Cyber 13 reused R-01…R-05 for different risks** in Part 2 and Part 10 of the same phase,
  both describing the same company. Part 2's slice is renumbered R-11…R-15.

### False positives in this pass

Five reported findings did not survive a re-read and were **not** applied:

- Cyber 03's "malformed BSSID" — the source line is already well-formed.
- Cyber 03's "contradictory timezone prose" — no such line exists.
- Cyber 06's "two report templates" — both are the *top-level README*, not two report shapes.
- Cyber 06's "acceptance omits its review date" — the review value is present in the row.
- Cyber 13's "seven sections" — six are named, and the seventh is the header block.

Two more were downgraded rather than applied. That is five rejections against two in the first
pass, which is the expected direction: a reader primed to find defects finds some that are not
there, and the check is what removes them.

### What the second pass confirmed

The same five defect classes, in the same proportions — and no sixth. The recurring shape is
unchanged: **every one is a claim about two places that disagree**, and none is visible to a
guard that reads one line at a time. The arithmetic class was the most productive again, with
the IT 06 formula and the cyber 09 hour total (a stated 60–80 against parts summing to 40–56)
both caught only by adding the numbers up.

Two limits remain, and both are now recorded rather than assumed away:

- **Every verdict here is still a reader's judgement.** Two passes disagree on 2 of 23 phases,
  so a third would not be expected to reproduce either set exactly. Treat the *findings* as
  falsifiable and the *verdicts* as advisory.
- **Nobody has timed a single curriculum task.** Every time budget in the curriculum — and
  there are dozens — is an author's estimate that no reader has ever measured. That is the
  largest untested claim in the repository, and no amount of re-reading will settle it.

---

## Third pass — the advance track

The two passes above covered the 23 entry-level phases. The advance track — six phases, ~75,000
words — had never been read by anyone but its author, and this pass closed that gap: one reader
per phase, six in total, working from the same brief.

**45 findings were reported, and about nine did not survive re-checking against the source.**
Those nine are not recorded individually, because a finding that does not reproduce has no line
number to cite; what is worth recording is the ratio. Roughly one in five was wrong, which is
between the first entry-level pass (two wrong of many) and the second (five rejected as false
positives). A reader who reports nothing is more suspect than one who reports something wrong.

### The findings that were real

| Class | Phase | What it was |
|---|---|---|
| Arithmetic that does not close | advance 01 | stated 14,880 minutes where its own script computes `1,231 × 12 + 9 × 45 = 15,177` |
| A retired identifier | advance 01 | `T1050` for Process Injection, renumbered to T1055 before ATT&CK v7 |
| Two people in one seat | advance 03 | Ops to J. Lim and Scribe to M. Santos in the declaration, reversed everywhere else |
| A term promised and never delivered | advance 03 | `unified command` in the topic list, absent from all 1,027 lines |
| A promise half-kept | advance 03 | topics offered "what adapts and what does not"; only the first half was covered |
| Wrong tooling in a worked example | advance 05 | `Get-Service SysmonDrv` and a config path that does not exist as printed |
| A table that does not sum | advance 06 | four KPI / three KCI / five KRI rows against prose saying otherwise |
| A stated range against its own parts | advance 05 | 46–62 hours where the parts sum to 46–66 |

### The five that needed verification rather than a sentence

All five are in advance 04, and all five were held back from the first batch of fixes because
each turns on a technical claim. **None needed an external source: the file argues against
itself in every case**, which is the reason they are worth citing here as a class.

- **The break-glass trust policy denied every assumption it was written to allow.** The phase
  defines `aws:MultiFactorAuthPresent` (line 764) as a property of the *AWS credentials making
  the call*, states (768) that the MFA context is not propagated through a chain, and states
  again (1873) that it is false on a chained assumption. It then prints a policy whose Action is
  `sts:AssumeRoleWithSAML` with that key required to be true. A federated role is handed its
  credentials by the IdP's assertion — the MFA happened at the IdP, before the assertion was
  signed, and is invisible to these keys. The policy would have denied the role for everyone,
  including the person who did present MFA.
- **A command-line example read a profile nothing created.** `aws sts assume-role` prints
  credentials to stdout and writes no profile, so `aws configure get role.access_key` was looking
  for something that never existed.
- **A CI workflow described as using OIDC while holding no credential at all.** `permissions:
  contents: read`, no `id-token: write`, no credential step — because it never calls AWS. It
  plans and evaluates policy locally. The OIDC comparison was to a design it does not use.
- **A cross-reference to a pattern that exists nowhere.** `DenyOutsideRegionAndBreakGlass` appeared
  exactly once in the file: in the sentence citing it as being in Part 2.
- **A free-tier claim that was true except for the one policy its own table said to build.**
  Conditional Access is Entra ID **P1**. The sibling cyber phase says so plainly at its line 380,
  which makes this an internal contradiction rather than an external one.

### What this pass says about the method

**The instrument that found the advance-04 defects was the phase's own prose.** Every one of the
five is a place where two statements in one file cannot both be true, and reading for that is a
different activity from reading for "does this teach well". The entry-level passes were mostly
looking for the second thing; the highest-yield findings here came from the first.

**Two guards caught the fixer, not the content.** While the five were being applied, the
readability gate went red on three paragraphs written during the fix (130, 122 and 112 words),
and `audit-refs` flagged `Phase 09` inside a phase-04 file as a reference to advance phase 9.
Both were mine, both were caught before the commit, and both are the same lesson as the
`renderInline` bug: a passing suite is not evidence that a change was correct, only that the
checks it runs did not notice.

## The pattern worth keeping

Every one of the four structural classes above is invisible to a guard that reads a file one
line at a time, because each is a claim about *two* places that disagree. That is not an argument
for a new guard — the acronym experiment shows how badly a semantic guard generalises. It is an
argument for this audit existing as a periodic human read, and for the findings being written
down with line numbers so the next read starts from them.

**The advance pass added one refinement to that.** The highest-yield question was not "can a
beginner follow this" — it was "do these two sentences both claim to be true". That question is
closer to machine-checkable than the comprehension question is, and `audit-refs.mjs` and
`audit-time-budget.mjs` are the two instances of it that already gate. The rest still needs a
reader, and a reader who is told to look for self-contradiction finds more than one told to look
for difficulty.

---

## Fourth pass — the unread material

The previous pass left a named gap: two phases nobody had read (cyber 15, advance 07) and five IT
sections the gap pass had just written, which rested on a **market claim** rather than an existing
syllabus. Five fresh readers covered them, one per file, working from the same brief.

**Roughly 40 findings were reported. About a dozen did not survive re-checking and were not
applied.** That rejection rate — near one in three — is higher than the advance pass's one in five,
and the reason is worth recording: when a reader is told the highest-yield question is
*self-contradiction*, they start seeing contradictions in prose that is merely loose. The check is
what removes them, and it was applied to every finding before anything was edited.

### The findings that were real, and the class they belong to

| Class | Where | What it was |
|---|---|---|
| A fixture that is not what it claims | advance 07:424 | The "negative" fixture's `CommandLine` contains `http://`, and the rule matches on `http://` — so the declared negative case **matches**, and the stated reason was false about the file |
| A takeaway that reverses its own lesson | cyber 15:1089 | "Everything above function code 15 is observation" — the table above it says codes 5, 6, 15 and 16 are *writes*, and 43 (a read) sits above 15 |
| A filter that means something else | cyber 15:761 | `modbus.func_code >= 15` also matches code 43 and every error response (0x90+), so it is not "multi-value writes" |
| "Every part of it is free" | cyber 15:1093 | The same file says a network tap "costs money, and needs an outage to install" (730) |
| A destructive step before its safeguard | IT 05:336 | `sysprep /generalize` was step 3 and "snapshot before you sysprep" was step 4 — the irreversible command preceded the thing that protects it |
| A paid capability taught as free | IT 05:163 | Conditional access needs **Entra ID P1**; the sibling cyber phase states this at its line 380, and this phase's "Free vs Paid" never mentioned it |
| A platform term presented as universal | IT 05:181 | "Work profile" is Android-only; iOS has no OS-level work profile |
| An order that inverts the phase's own method | IT 04:452 | The softphone order was device → headset → app → network, putting *scope* last, while the phase teaches scope isolation as step 5 of its eight-step method (223) |
| A test that does not split what it claims to | IT 01:555 | The dock test says a both-ways failure means "the fault is at the other end"; item 4 says a bandwidth limit produces that same both-ways result |
| A term never defined | IT 01:562 | "alt-mode" was load-bearing twice and defined nowhere in the file |
| A promise not kept | advance 07:47 | Five named Sigma correlation constructs, listed as a topic, appearing **exactly once in 1,348 lines — in that list** |
| A contradiction between two records of one rule | advance 07:1117 | Review due 2026-11-12 against the registry's own 2026-10-02, three months on from `last_reviewed` |
| A harness that over-claims | advance 07:430/495 | "match it against the fixtures" against its own retraction that it "parses, carries fixtures, and converts" |
| A reference to a part that does not exist yet | IT 02:418 | The macOS section is inside Part 4 and cites "Part 8", which does not begin until line 562 |

### The false positives, and what they have in common

- **A time table "that does not close."** Cyber 15 keeps its budget table twice, with the per-topic
  hours redistributed between the two. The reader compared *one row* across the two tables and
  concluded the totals disagreed. Both sum to 60–78. **The sums were never checked** — only the rows.
- **The `enip` filter** as "unfollowable" — the table row is a Wireshark display filter and behaves
  as one; the reader's objection was about capture visibility, which the file addresses for the
  protocol that actually needs it.
- **A "missing" statute route** in cyber 15 — the legal material is present and the phase is
  explicit that it is not legal advice. Disagreement with the depth of a section is not a defect.
- **IT 01's dock "power delivery" gap** — reported as a coverage gap, and it was a genuine thinness
  rather than an error, so it was written in rather than logged as a defect.
- Two IT 02 items where the reader itself flagged that it could not verify externally (a Defender
  scan-type flag and an `Open Anyway` label), correctly declining to assert either way.

The honest headline is the same as the third pass's: **the instrument that found the real defects
was each file's own prose.** Every finding in the table above is a place where two statements
cannot both be true, and the arithmetic and the fixture-tracing were the two techniques that paid.
The false positives came from the same brief being read as *"find tension"* rather than
*"find a claim that fails"*.

### What this pass confirms about method

**A guard caught the fixer again — for the fourth time in this repository's history.** While the
fixes above were being written, `audit-readability.mjs` went red on **three paragraphs written
during the fix** (121, 142 and 124 words) and then on a fourth (125). All four were split at
sentence boundaries with every word kept, and the editorial backlog returned to zero. This is the
same lesson as `renderInline` and the advance-04 pass: **a passing suite is not evidence that a
change was correct, only that the checks it runs did not notice** — and here the suite noticed.

**The material audit found what a fresh read always finds.** Neither of the two new phases was
structurally broken, and both pass every mechanical guard. What they contained was one false
fixture, one reversed takeaway, one filter that means something other than its label, one
"everything is free" claim the file itself contradicts, and one topic list promising five
constructs the body never teaches. None of those is visible to a guard that reads one line at a
time, and all five would have misled a reader who trusted the page.