# Beginner-comprehension audit — findings

A read of all 23 phases asking one question the existing guards structurally cannot:
**where does a motivated beginner with no IT background stop reading, and why?**

Every guard in this repository tests internal consistency — does the parser lose content,
is the prose dense, do the cross-references resolve. None can see a phase that teaches
correctly but cannot be *followed*. This audit is the human-shaped check for that.

Nine readers covered the 23 phases, three each, working from a six-category brief
(undefined term, assumed knowledge, unfollowable step, unearned leap, term avalanche,
prerequisite order). Findings are falsifiable — each carries a real line number and a
verbatim quote — and false positives were explicitly penalised, because a clean bill is
a useful result. Every finding below was re-checked against the source before a fix was
made; two were rejected as wrong.

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

## The pattern worth keeping

Every one of the four structural classes above is invisible to a guard that reads a file one
line at a time, because each is a claim about *two* places that disagree. That is not an argument
for a new guard — the acronym experiment shows how badly a semantic guard generalises. It is an
argument for this audit existing as a periodic human read, and for the findings being written
down with line numbers so the next read starts from them.