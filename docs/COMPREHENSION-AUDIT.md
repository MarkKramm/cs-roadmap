# Beginner-comprehension audit — findings

A read of all 23 phases asking one question the existing guards structurally cannot:
**where does a motivated beginner with no IT background stop reading, and why?**

The two passes below cover the 23 entry-level phases. A third pass, added later, covers the
six advance phases — so this file now accounts for **all 29**. Read the entry-level sections
with that in mind: every count in them is a count of 23, and it was correct when it was written.

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