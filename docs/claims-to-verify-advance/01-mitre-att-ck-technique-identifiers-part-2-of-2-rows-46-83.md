You are verifying technical claims from a training curriculum against
**primary sources** — Microsoft Learn, IANA, RFCs, POSIX man pages, and vendor
documentation.

The table below is complete and self-contained. Every row you need is here.

## What to do

For each row, replace the empty last column with exactly one of:

| Verdict | Format |
|---|---|
| `OK` | `OK` — then the **URL** that settles it, and a short quote from it |
| `WRONG` | `WRONG` — the correct value, **and** the URL that proves it |
| `UNVERIFIABLE` | `UNVERIFIABLE` — say briefly why (judgement, analogy, or simplification) |

## Rules

1. **Every `OK` and every `WRONG` must carry a source URL, and a quote from
   it that settles the claim.** The quote is not decoration: a URL alone says
   only that a page exists. If you cannot quote the line that decides the
   claim, the verdict is `UNVERIFIABLE`. A recollection is not a source.
2. **Prefer the authority over a page that agrees with it.** Rank sources:
   the standard itself (RFC, POSIX, FHS, IANA registry) > the vendor's own
   reference documentation > a vendor tutorial or blog > a forum answer or a
   third-party article. Use the highest rank you can reach, and **name the
   source type** in the verdict. A claim sourced to a forum post or a
   third-party tutorial is weaker evidence than the same claim sourced to the
   spec, and the reader needs to know which they are getting.
3. **Never cite a page you could not open or whose text you could not read.**
   If a source is paywalled, login-gated, blocked, or empty, it does not count
   as a source. Say so.
4. **Cite in the language you read.** If the only page you can reach is a
   localised version of the vendor's documentation, say that explicitly, and
   prefer finding the English original.
5. **Do not guess to fill a row.** An honest `UNVERIFIABLE` is a useful
   result; an invented URL is worse than no answer, because it will be acted on.
6. **Output the complete table, every row, in order.** Do not summarise, do not
   sample, do not stop early. If you run low on room, stop at a row boundary
   and say which row number to continue from.
7. **If any part of a row is unclear, say so in the verdict** (`UNVERIFIABLE —
   text truncated`) rather than inferring the claim. Never reconstruct a claim
   you cannot read.
8. Some short rows are followed by a small grey line showing the text above and
   below them. **That context is part of the claim** — use it.
9. `UNVERIFIABLE` is expected to be common and is not a failure. A great deal
   of this curriculum is teaching method, diagnostic reasoning, and worked
   examples, none of which is a fact about the world.
10. **A row's text may be cut off with a trailing `…` at 260 characters. Read
    the real line before judging it.** The Location column gives you
    `<phase-file>:<line>`, and the phase files are on disk at
    `career-roadmaps/advance-roadmap/` (IT: `it-roadmap/`, cyber:
    `cybersec-roadmap/`). Open that file, go to that line number, and judge the
    whole claim.

    This rule exists because of a recorded result, not a precaution. An earlier
    pass returned `UNVERIFIABLE — text truncated` on rows that were, in fact,
    fully checkable, because the pack was the only thing it was given — and an
    unverifiable row costs a reader the knowledge that nobody checked it. The
    truncation is a property of the TABLE FORMAT, not of the claim. Use
    `UNVERIFIABLE — text truncated` only when you genuinely cannot retrieve the
    line, and say that you tried.
11. **Write the verdict into the table in place.** Edit only the empty Verdict
    cell of each row. Do not reformat, reorder, re-quote the claim text, or add
    rows. The file must remain a valid markdown table with the same row numbers,
    because a script reads the verdicts back out of it by row number.
12. **Escape every `|` inside a verdict as `\|`.** A verdict that quotes a
    regex or a JSON schema — `^d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$`
    is the shape that causes it — puts a literal pipe in the cell, and each one
    silently becomes a column boundary. The row still starts with a number and
    still looks plausible; it is simply no longer a four-column row, and a
    script reading verdicts by row number will read a fragment of one.

# MITRE ATT&CK technique identifiers — rows 46–83 of this class

This is part 2 of 2. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 46 | `05-phase-adversary-emulation.md:142` | \| **Technique** \| The general way of achieving the goal, the *how* \| Command and Scripting Interpreter (T1059) \| | |
| 47 | `05-phase-adversary-emulation.md:143` | \| **Sub-technique** \| A specific variant of the technique \| PowerShell (T1059.001) \| | |
| | | <sub>↑ \| **Technique** \| The general way of achieving the goal, the *how* \| Command and Scripting Interpreter (T1059) \|<br>↓ \| **Procedure** \| A specific implementation used by a specific actor or tool \| A macro that launches `powershell.exe -nop -w hidden -enc <base64>`  …</sub> | |
| 48 | `05-phase-adversary-emulation.md:239` ▶ | Techniques T1059.001, T1053.005, T1547.001, T1136.001, T1003.001 | |
| | | <sub>↑ Services None in production</sub> | |
| 49 | `05-phase-adversary-emulation.md:464` ▶ | Invoke-AtomicTest T1059.001 -ShowDetailsBrief | |
| | | <sub>↑ # 3. See what tests exist for one technique, briefly.</sub> | |
| 50 | `05-phase-adversary-emulation.md:467` ▶ | Invoke-AtomicTest T1059.001 -TestNumbers 1 -ShowDetails | |
| | | <sub>↑ # 4. Read one test in full, including its prerequisites and its cleanup.</sub> | |
| 51 | `05-phase-adversary-emulation.md:470` ▶ | Invoke-AtomicTest T1059.001 -TestNumbers 1 -GetPrereqs | |
| | | <sub>↑ # 5. Install any prerequisites the test needs.</sub> | |
| 52 | `05-phase-adversary-emulation.md:473` ▶ | Invoke-AtomicTest T1059.001 -TestNumbers 1 -CheckPrereqs | |
| | | <sub>↑ # 6. Verify the prerequisites are actually satisfied.</sub> | |
| 53 | `05-phase-adversary-emulation.md:476` ▶ | Invoke-AtomicTest T1059.001 -TestNumbers 1 -ExecutionLogPath "C:\evidence\art-log.csv" | |
| | | <sub>↑ # 7. Execute the test, logging the run to a file for your records.</sub> | |
| 54 | `05-phase-adversary-emulation.md:480` ▶ | Invoke-AtomicTest T1059.001 -TestNumbers 1 -Cleanup | |
| | | <sub>↑ # failed, because a partially applied change is still a change.</sub> | |
| 55 | `05-phase-adversary-emulation.md:580` | \| 1 \| T1059.001 PowerShell \| Execution \| Windows 10 \| Atomic T1059.001 #1 \| Sysmon 1 with `powershell.exe` and full command line \| Sysmon 1 present and correct \| **Partially detected** — recorded, no rule \| GAP-001 \| | |
| 56 | `05-phase-adversary-emulation.md:581` | \| 2 \| T1053.005 Scheduled Task \| Persistence \| Windows 10 \| Atomic T1053.005 #1 \| Security 4698, TaskScheduler operational \| Security 4698 present \| **Detected** — rule fired within 90s \| — \| | |
| 57 | `05-phase-adversary-emulation.md:582` | \| 3 \| T1547.001 Registry Run Keys \| Persistence \| Windows 10 \| Atomic T1547.001 #1 \| Sysmon 13 on `...\CurrentVersion\Run` \| Sysmon 13 present but filtered out by config \| **Not detected, telemetry present** \| GAP-002 \| | |
| 58 | `05-phase-adversary-emulation.md:583` | \| 4 \| T1136.001 Create Local Account \| Persistence \| Windows 10 \| Atomic T1136.001 #1 \| Security 4720 \| **No 4720 in the log — account auditing not enabled** \| **Not detected, no telemetry** \| GAP-003 \| | |
| 59 | `05-phase-adversary-emulation.md:584` | \| 5 \| T1003.001 LSASS Memory \| Credential Access \| Windows 10 \| Atomic T1003.001 #1 \| Sysmon 10 with `lsass.exe` as target \| Sysmon 10 present, high volume, no rule \| **Partially detected** — noisy, needs scoping \| GAP-004 \| | |
| 60 | `05-phase-adversary-emulation.md:585` | \| 6 \| T1059.003 Windows Command Shell \| Execution \| Windows 10 \| Atomic T1059.003 #1 \| Sysmon 1 with `cmd.exe` \| Present, and a rule fired \| **Detected** \| — \| | |
| 61 | `05-phase-adversary-emulation.md:646` ▶ | - https://attack.mitre.org/techniques/T1059/001/ | |
| | | <sub>↑ references:<br>↓ - https://attack.mitre.org/techniques/T1204/002/</sub> | |
| 62 | `05-phase-adversary-emulation.md:647` ▶ | - https://attack.mitre.org/techniques/T1204/002/ | |
| | | <sub>↑ - https://attack.mitre.org/techniques/T1059/001/<br>↓ author: Your Name</sub> | |
| 63 | `05-phase-adversary-emulation.md:750` | \| GAP-001 \| T1059.001 \| Partially detected \| Sysmon records the process, no rule matches Office as parent \| Detection engineering \| Sigma rule `office_spawns_encoded_powershell` \| High \| Rule written, awaiting re-test \| 2026-04-15 \| | |
| 64 | `05-phase-adversary-emulation.md:751` | \| GAP-002 \| T1547.001 \| Not detected, telemetry present \| Sysmon 13 events are dropped by the config's registry exclude list \| Detection engineering \| Narrow the exclude list to keep `\CurrentVersion\Run` \| High \| Config change proposed \| 2026-04-22 \ … | |
| 65 | `05-phase-adversary-emulation.md:752` | \| GAP-003 \| T1136.001 \| Not detected, no telemetry \| Windows account-management auditing is not enabled \| Endpoint engineering \| Enable `Audit User Account Management` by GPO \| High \| Raised to endpoint engineering \| 2026-05-06 \| | |
| 66 | `05-phase-adversary-emulation.md:753` | \| GAP-004 \| T1003.001 \| Partially detected \| Sysmon 10 is recorded but the volume makes a naive rule unusable \| Detection engineering \| Scope to non-system processes accessing `lsass.exe` with `GrantedAccess` 0x1010 \| Medium \| Rule drafted \| 2026-04-2 … | |
| 67 | `05-phase-adversary-emulation.md:770` | \| Technique \| T1547.001, Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder \| | |
| | | <sub>↑ \| Exercise \| AE-2026-004 \|<br>↓ \| Tactic \| Persistence \|</sub> | |
| 68 | `05-phase-adversary-emulation.md:773` | \| Atomic test \| Atomic Red Team T1547.001, registry run key variant \| | |
| | | <sub>↑ \| Platform \| Windows 10, host `LAB-WIN10-01`, isolated lab VLAN 90 \|<br>↓ \| Authorisation \| Signed ROE, section 3 in scope, section 6 window 09:00–17:00 \|</sub> | |
| 69 | `05-phase-adversary-emulation.md:799` ▶ | Invoke-AtomicTest T1547.001 -TestNumbers 1 -CheckPrereqs | |
| | | <sub>↑ # Step 3 — confirm the prerequisites for this atomic are met.</sub> | |
| 70 | `05-phase-adversary-emulation.md:802` ▶ | Invoke-AtomicTest T1547.001 -TestNumbers 1 -ShowDetails | |
| | | <sub>↑ # Step 4 — read the test before running it. Confirm it has a cleanup.</sub> | |
| 71 | `05-phase-adversary-emulation.md:805` ▶ | Invoke-AtomicTest T1547.001 -TestNumbers 1 -ExecutionLogPath "C:\evidence\art-T1547-001.csv" | |
| | | <sub>↑ # Step 5 — execute, logging the run.</sub> | |
| 72 | `05-phase-adversary-emulation.md:826` ▶ | Invoke-AtomicTest T1547.001 -TestNumbers 1 -Cleanup | |
| | | <sub>↑ # Step 9 — clean up, then verify the cleanup.<br>↓ Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" \|</sub> | |
| 73 | `05-phase-adversary-emulation.md:915` ▶ | - https://attack.mitre.org/techniques/T1547/001/ | |
| | | <sub>↑ references:<br>↓ author: Your Name</sub> | |
| 74 | `05-phase-adversary-emulation.md:1001` ▶ | test T1136.001 on LAB-WIN10-01 in the isolated lab VLAN. The test creates | |
| | | <sub>↑ On 2026-04-08, as part of exercise AE-2026-004, we ran Atomic Red Team<br>↓ a local user account. The technique is ATT&CK T1136.001, Create Account:</sub> | |
| 75 | `05-phase-adversary-emulation.md:1002` ▶ | a local user account. The technique is ATT&CK T1136.001, Create Account: | |
| | | <sub>↑ test T1136.001 on LAB-WIN10-01 in the isolated lab VLAN. The test creates<br>↓ Local Account, Persistence tactic.</sub> | |
| 76 | `05-phase-adversary-emulation.md:1039` ▶ | reason — adding an account to Administrators is T1098, and it generates | |
| | | <sub>↑ We would also recommend Audit Security Group Management, for the same<br>↓ event ID 4732 from the same policy area.</sub> | |
| 77 | `05-phase-adversary-emulation.md:1043` ▶ | We will re-run T1136.001 on 2026-05-06, ten days after the change is | |
| | | <sub>↑ WHAT WE WILL DO TO VERIFY<br>↓ scheduled to land, and confirm that event ID 4720 is generated and that</sub> | |
| 78 | `05-phase-adversary-emulation.md:1103` ▶ | beyond T1003.001. | |
| | | <sub>↑ - Any technique in the Credential Access or Lateral Movement tactics<br>↓ - Whether the rules that fired would have been triaged correctly by an</sub> | |
| 79 | `07-phase-detection-as-code.md:325` ▶ | ATT&CK T1105." | |
| | | <sub>↑ Status experimental pending a 30-day replay against production data.</sub> | |
| 80 | `07-phase-detection-as-code.md:1020` ▶ | DET-042,Certutil remote download,Your Name,stable,2026-05-14,2026-07-02,2026-10-02,31%,T1105,tuned twice | |
| | | <sub>↑ rule_id,title,owner,status,deployed,last_reviewed,review_due,precision_30d,attck,notes<br>↓ DET-057,Archive creation in user dirs,Peer Reviewer,stable,2026-06-01,2026-06-01,2026-09-01,34%,T1560,replaced DET-018</sub> | |
| 81 | `07-phase-detection-as-code.md:1021` ▶ | DET-057,Archive creation in user dirs,Peer Reviewer,stable,2026-06-01,2026-06-01,2026-09-01,34%,T1560,replaced DET-018 | |
| 82 | `07-phase-detection-as-code.md:1022` ▶ | DET-018,Suspicious archive creation,None,retired,2026-02-10,2026-07-15,NA,0.5%,T1560,retired 2026-07-15 | |
| | | <sub>↑ DET-057,Archive creation in user dirs,Peer Reviewer,stable,2026-06-01,2026-06-01,2026-09-01,34%,T1560,replaced DET-018<br>↓ ```</sub> | |
| 83 | `07-phase-detection-as-code.md:1099` ▶ | ATT&CK T1105, Ingress Tool Transfer. | |
