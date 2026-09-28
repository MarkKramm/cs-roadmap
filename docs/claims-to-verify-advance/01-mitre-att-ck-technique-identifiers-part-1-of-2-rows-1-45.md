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

# MITRE ATT&CK technique identifiers — rows 1–45 of this class

This is part 1 of 2. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 1 | `01-phase-detection-at-scale.md:161` ▶ | - https://attack.mitre.org/techniques/T1059/001/ | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/001/ — "Command and Scripting Interpreter: PowerShell, Sub-technique T1059.001 - Enterprise" |
| | | <sub>↑ references:<br>↓ - https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_powershell_exe</sub> | |
| 2 | `01-phase-detection-at-scale.md:251` ▶ | git commit -m "det: add T1059.001 encoded PowerShell process creation rule | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/001/ — "Command and Scripting Interpreter: PowerShell, Sub-technique T1059.001"; ID and name both correct |
| | | <sub>↑ # The commit message names the technique and the reason. Not "add rule".</sub> | |
| 3 | `01-phase-detection-at-scale.md:320` ▶ | ATT&CK mapping pass — T1059.001 | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/001/ — "ID: T1059.001 ... Sub-technique of: T1059"; ID exists and shape is right (three digits after the dot) |
| | | <sub>↑ Severity pass — level lowered from medium to low<br>↓ Test evidence pass — samples match and do not match as required</sub> | |
| 4 | `01-phase-detection-at-scale.md:608` | MITRE ATT&CK is a catalogue of adversary tactics and techniques, organised as: **tactic** (the goal, such as Execution), **technique** (the method, such as T1059 Command and Scripting Interpreter), and **sub-technique** (the specific variant, such as T1059.001 … | **OK** — MITRE ATT&CK official technique pages, https://attack.mitre.org/techniques/T1059/ — "Command and Scripting Interpreter, Technique T1059" and https://attack.mitre.org/techniques/T1059/001/ — "Sub-technique of: T1059 ... PowerShell"; the parent/sub-technique nesting the row asserts is exactly MITRE's own |
| 5 | `01-phase-detection-at-scale.md:633` ▶ | Process Injection (T1055), as a worked example of the three levels. | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1055/ — "Process Injection, Technique T1055 - Enterprise" |
| | | <sub>↑ ```text</sub> | |
| 6 | `01-phase-detection-at-scale.md:646` | A team that marks T1055 green because a rule exists has documented a detection. It has not documented coverage, and the difference is the entire value of the exercise. | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1055/ — "Process Injection, Technique T1055"; the surrounding argument is pedagogy, not a fact about ATT&CK |
| 7 | `01-phase-detection-at-scale.md:679` | \| T1059.001 \| PowerShell \| Yes \| Yes \| SOC queue 1 \| **Yes** \| DET-014, noisy, routing under review \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/001/ — "Command and Scripting Interpreter: PowerShell, Sub-technique T1059.001" |
| | | <sub>↑ \|---\|---\|---\|---\|---\|---\|---\|<br>↓ \| T1059.003 \| Windows Command Shell \| Yes \| Yes \| SOC queue 1 \| **Yes** \| DET-021, tuned 2026-02 \|</sub> | |
| 8 | `01-phase-detection-at-scale.md:680` | \| T1059.003 \| Windows Command Shell \| Yes \| Yes \| SOC queue 1 \| **Yes** \| DET-021, tuned 2026-02 \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/003/ — "Command and Scripting Interpreter: Windows Command Shell, Sub-technique T1059.003" |
| | | <sub>↑ \| T1059.001 \| PowerShell \| Yes \| Yes \| SOC queue 1 \| **Yes** \| DET-014, noisy, routing under review \|<br>↓ \| T1059.005 \| Visual Basic \| Yes \| No \| — \| **No** \| No rule exists \|</sub> | |
| 9 | `01-phase-detection-at-scale.md:681` | \| T1059.005 \| Visual Basic \| Yes \| No \| — \| **No** \| No rule exists \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/005/ — "Command and Scripting Interpreter: Visual Basic, Sub-technique T1059.005" |
| | | <sub>↑ \| T1059.003 \| Windows Command Shell \| Yes \| Yes \| SOC queue 1 \| **Yes** \| DET-021, tuned 2026-02 \|<br>↓ \| T1547.001 \| Registry Run Keys \| Yes \| Yes \| SOC queue 2 \| **Yes** \| DET-034 \|</sub> | |
| 10 | `01-phase-detection-at-scale.md:682` | \| T1547.001 \| Registry Run Keys \| Yes \| Yes \| SOC queue 2 \| **Yes** \| DET-034 \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1547/001/ — "Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder, Sub-technique T1547.001"; the row's "Registry Run Keys" is a shortening of that name, not a different one |
| | | <sub>↑ \| T1059.005 \| Visual Basic \| Yes \| No \| — \| **No** \| No rule exists \|<br>↓ \| T1543.003 \| Windows Service \| Yes \| Yes \| — \| **No** \| Rule fires into an unowned queue \|</sub> | |
| 11 | `01-phase-detection-at-scale.md:683` | \| T1543.003 \| Windows Service \| Yes \| Yes \| — \| **No** \| Rule fires into an unowned queue \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1543/003/ — "Create or Modify System Process: Windows Service, Sub-technique T1543.003" |
| | | <sub>↑ \| T1547.001 \| Registry Run Keys \| Yes \| Yes \| SOC queue 2 \| **Yes** \| DET-034 \|<br>↓ \| T1055 \| Process Injection \| Partial \| Yes \| SOC queue 2 \| **Partial** \| Sysmon 8 on 412 of 500 endpoints \|</sub> | |
| 12 | `01-phase-detection-at-scale.md:684` | \| T1055 \| Process Injection \| Partial \| Yes \| SOC queue 2 \| **Partial** \| Sysmon 8 on 412 of 500 endpoints \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1055/ — "Process Injection, Technique T1055"; a parent technique, correctly written without a sub-technique suffix |
| 13 | `01-phase-detection-at-scale.md:685` | \| T1071.001 \| Web Protocols \| No \| No \| — \| **No** \| Proxy logs retained 7 days, not ingested \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1071/001/ — "Application Layer Protocol: Web Protocols, Sub-technique T1071.001" |
| | | <sub>↑ \| T1055 \| Process Injection \| Partial \| Yes \| SOC queue 2 \| **Partial** \| Sysmon 8 on 412 of 500 endpoints \|<br>↓ \| T1078.004 \| Cloud Accounts \| Yes \| No \| — \| **No** \| Cloud audit log collected, no rules \|</sub> | |
| 14 | `01-phase-detection-at-scale.md:686` | \| T1078.004 \| Cloud Accounts \| Yes \| No \| — \| **No** \| Cloud audit log collected, no rules \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1078/004/ — "Valid Accounts: Cloud Accounts, Sub-technique T1078.004" |
| | | <sub>↑ \| T1071.001 \| Web Protocols \| No \| No \| — \| **No** \| Proxy logs retained 7 days, not ingested \|</sub> | |
| 15 | `01-phase-detection-at-scale.md:690` | **The `T1071.001` row is the one to study.** There is no detection, and there cannot be one, because the proxy logs are retained for seven days and are not ingested into the platform at all. That is not a detection problem. It is a telemetry problem, and it is … | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1071/001/ — "ID: T1071.001"; the rest of the row is argument about telemetry, not an ATT&CK fact |
| 16 | `01-phase-detection-at-scale.md:797` | \| Coverage map \| T1059.001 is covered \| The rule reads a field that is null on 88 hosts \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/001/ — "ID: T1059.001" |
| | | <sub>↑ \| Deployment \| The rule is live \| The rule was deployed to one tenant, not both \|<br>↓ \| Monitoring \| No alerts means nothing happened \| No alerts meant the rule never matched anything \|</sub> | |
| 17 | `01-phase-detection-at-scale.md:1101` ▶ | 1. Pick the technique. T1059.001, PowerShell, matches the rule you are | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/001/ — "Command and Scripting Interpreter: PowerShell, Sub-technique T1059.001" |
| | | <sub>↓ validating.</sub> | |
| 18 | `01-phase-detection-at-scale.md:1220` ▶ | Technique T1059.001 | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/001/ — "ID: T1059.001 ... Sub-technique of: T1059" |
| | | <sub>↑ Rule DET-014 PowerShell Encoded Command Execution<br>↓ Owner detection-engineering</sub> | |
| 19 | `01-phase-detection-at-scale.md:1242` ▶ | Atomic: T1059.001 test 1, run 2026-03-21, alert observed | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/001/ — "ID: T1059.001"; the rest is a fictional lab record |
| | | <sub>↑ Replay: replay-encoded-powershell.csv, 30 days</sub> | |
| 20 | `01-phase-detection-at-scale.md:1304` | \| Atomic Red Team \| Documented, small tests of individual ATT&CK techniques \| Free/open-source \| https://github.com/redcanaryco/atomic-red-team \| Run the T1059.001 test on a lab host and check whether your rule fires \| Manual PowerShell simulation on a l … | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/001/ — "ID: T1059.001"; the linked repo https://github.com/redcanaryco/atomic-red-team resolves (HTTP 200) and is Atomic Red Team's own |
| 21 | `02-phase-threat-hunting.md:221` ▶ | ATT&CK mapping T1021.002 — Remote Services: SMB/Windows Admin Shares | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1021/002/ — "Remote Services: SMB/Windows Admin Shares, Sub-technique T1021.002" |
| | | <sub>↓ T1569.002 — System Services: Service Execution</sub> | |
| 22 | `02-phase-threat-hunting.md:222` ▶ | T1569.002 — System Services: Service Execution | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1569/002/ — "System Services: Service Execution, Sub-technique T1569.002" |
| | | <sub>↑ ATT&CK mapping T1021.002 — Remote Services: SMB/Windows Admin Shares<br>↓ T1543.003 — Create or Modify System Process: Windows Service</sub> | |
| 23 | `02-phase-threat-hunting.md:223` ▶ | T1543.003 — Create or Modify System Process: Windows Service | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1543/003/ — "Create or Modify System Process: Windows Service, Sub-technique T1543.003" |
| | | <sub>↑ T1569.002 — System Services: Service Execution</sub> | |
| 24 | `02-phase-threat-hunting.md:333` | \| T1053.005 Scheduled Task \| Security 4698, Sysmon 1/11 \| Yes — DET-118 \| Never \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1053/005/ — "Scheduled Task/Job: Scheduled Task, Sub-technique T1053.005" |
| | | <sub>↑ \|---\|---\|---\|---\|<br>↓ \| T1059.001 PowerShell \| Script block logging, EDR process events \| Yes — DET-042 \| 2025-11 \|</sub> | |
| 25 | `02-phase-threat-hunting.md:334` | \| T1059.001 PowerShell \| Script block logging, EDR process events \| Yes — DET-042 \| 2025-11 \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/001/ — "Command and Scripting Interpreter: PowerShell, Sub-technique T1059.001" |
| | | <sub>↑ \| T1053.005 Scheduled Task \| Security 4698, Sysmon 1/11 \| Yes — DET-118 \| Never \|<br>↓ \| T1218.011 Rundll32 \| EDR process events, command lines \| No \| Never \|</sub> | |
| 26 | `02-phase-threat-hunting.md:335` | \| T1218.011 Rundll32 \| EDR process events, command lines \| No \| Never \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1218/011/ — "System Binary Proxy Execution: Rundll32, Sub-technique T1218.011" |
| | | <sub>↑ \| T1059.001 PowerShell \| Script block logging, EDR process events \| Yes — DET-042 \| 2025-11 \|<br>↓ \| T1071.001 Web protocols \| Proxy, DNS, firewall \| Partly — proxy only \| 2025-09 \|</sub> | |
| 27 | `02-phase-threat-hunting.md:336` | \| T1071.001 Web protocols \| Proxy, DNS, firewall \| Partly — proxy only \| 2025-09 \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1071/001/ — "Application Layer Protocol: Web Protocols, Sub-technique T1071.001" |
| | | <sub>↑ \| T1218.011 Rundll32 \| EDR process events, command lines \| No \| Never \|<br>↓ \| T1021.002 SMB/Admin shares \| Security 4624 type 3, 5140 \| No \| Never \|</sub> | |
| 28 | `02-phase-threat-hunting.md:337` | \| T1021.002 SMB/Admin shares \| Security 4624 type 3, 5140 \| No \| Never \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1021/002/ — "Remote Services: SMB/Windows Admin Shares, Sub-technique T1021.002"; the row's "SMB/Admin shares" is a shortening of it |
| | | <sub>↑ \| T1071.001 Web protocols \| Proxy, DNS, firewall \| Partly — proxy only \| 2025-09 \|<br>↓ \| T1562.001 Impair defenses \| EDR tamper events, service state \| No \| Never \|</sub> | |
| 29 | `02-phase-threat-hunting.md:338` | \| T1562.001 Impair defenses \| EDR tamper events, service state \| No \| Never \| | **WRONG** — correct value: **T1685 "Disable or Modify Tools"** (tactic Defense Impairment, TA0112). T1562.001 was revoked in ATT&CK v19 and merged into T1685; and "Impair Defenses" is the name of the PARENT T1562, not of T1562.001, whose pre-v19 name was "Impair Defenses: Disable or Modify Tools". — MITRE ATT&CK official detailed changelog, https://attack.mitre.org/docs/changelogs/v18.1-v19.0/changelog-detailed.html — "[T1562.001] Disable or Modify Tools ... This object has been revoked by [T1685] Disable or Modify Tools". Corroborated in the official STIX bundle, https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json — the T1562.001 attack-pattern carries "revoked": true and a revoked-by relationship to T1685. https://attack.mitre.org/techniques/T1562/001/ now serves only a meta-refresh, "url=/techniques/T1685" |
| | | <sub>↑ \| T1021.002 SMB/Admin shares \| Security 4624 type 3, 5140 \| No \| Never \|<br>↓ \| T1055 Process injection \| EDR memory events \| No \| Never \|</sub> | |
| 30 | `02-phase-threat-hunting.md:339` | \| T1055 Process injection \| EDR memory events \| No \| Never \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1055/ — "Process Injection, Technique T1055" |
| | | <sub>↑ \| T1562.001 Impair defenses \| EDR tamper events, service state \| No \| Never \|<br>↓ \| T1098 Account manipulation \| Cloud audit log, directory audit \| Partly — one rule \| Never \|</sub> | |
| 31 | `02-phase-threat-hunting.md:340` | \| T1098 Account manipulation \| Cloud audit log, directory audit \| Partly — one rule \| Never \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1098/ — "Account Manipulation, Technique T1098"; correctly written as a parent technique with no sub-technique suffix |
| | | <sub>↑ \| T1055 Process injection \| EDR memory events \| No \| Never \|</sub> | |
| 32 | `02-phase-threat-hunting.md:346` | The gap between "T1053.005 is visible in Security 4698" and "I can hunt T1053.005" is a field-level question. For each technique, write down the fields your query will need. | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1053/005/ — "ID: T1053.005"; the surrounding advice about field-level hunting is method, not a claim about ATT&CK |
| 33 | `02-phase-threat-hunting.md:350` | \| T1053.005 Scheduled Task \| Task name, task action (the binary and arguments), creating account, host, time \| Task name yes, action **no** — 4698 TaskContent is not being parsed \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1053/005/ — "Scheduled Task/Job: Scheduled Task, Sub-technique T1053.005" |
| 34 | `02-phase-threat-hunting.md:351` | \| T1059.001 PowerShell \| Full command line, script block text, parent process, user \| Command line yes; script block text yes, 30-day retention only \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1059/001/ — "Command and Scripting Interpreter: PowerShell, Sub-technique T1059.001" |
| 35 | `02-phase-threat-hunting.md:352` | \| T1218.011 Rundll32 \| Full command line, DLL path argument, parent process \| Yes \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1218/011/ — "System Binary Proxy Execution: Rundll32, Sub-technique T1218.011" |
| | | <sub>↑ \| T1059.001 PowerShell \| Full command line, script block text, parent process, user \| Command line yes; script block text yes, 30-day retention onl …<br>↓ \| T1071.001 Web protocols \| Remote host, URL, initiating process, bytes out \| URL and process yes; bytes **no** — proxy logs lack byte counts \|</sub> | |
| 36 | `02-phase-threat-hunting.md:353` | \| T1071.001 Web protocols \| Remote host, URL, initiating process, bytes out \| URL and process yes; bytes **no** — proxy logs lack byte counts \| | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1071/001/ — "Application Layer Protocol: Web Protocols, Sub-technique T1071.001" |
| 37 | `02-phase-threat-hunting.md:392` | \| "Could not hunt scheduled tasks properly, no data." \| "Hunt HUNT-2026-014 could not be completed for T1053.005. Security 4698 is collected with a 180-day retention, but the TaskContent field is not parsed by the current connector, so task actions cannot be … | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1053/005/ — "ID: T1053.005"; the retention and parser details are a fictional scenario |
| 38 | `02-phase-threat-hunting.md:443` | This maps to ATT&CK **T1218 — System Binary Proxy Execution** and its sub-techniques T1218.011 (Rundll32), T1218.010 (Regsvr32), and T1218.005 (Mshta). | **OK** — MITRE ATT&CK official technique pages: https://attack.mitre.org/techniques/T1218/ — "System Binary Proxy Execution, Technique T1218"; /T1218/011/ — "Rundll32"; /T1218/010/ — "Regsvr32"; /T1218/005/ — "Mshta". All four IDs and all three sub-technique names are correct, and all three really are sub-techniques of T1218 |
| 39 | `02-phase-threat-hunting.md:448` ▶ | // Hunt HUNT-2026-021 — T1218 System Binary Proxy Execution | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1218/ — "System Binary Proxy Execution, Technique T1218 - Enterprise" |
| | | <sub>↑ ```kql<br>↓ // Defender XDR advanced hunting. DeviceProcessEvents holds endpoint</sub> | |
| 40 | `02-phase-threat-hunting.md:560` ▶ | pointing into a user-writable directory, consistent with T1218 proxy execution. | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1218/ — "System Binary Proxy Execution, Technique T1218"; the rule it sits in also tags attack.t1218.011, .010 and .005, all real |
| | | <sub>↑ description: Detects rundll32, regsvr32 or mshta launched with an argument<br>↓ references:</sub> | |
| 41 | `02-phase-threat-hunting.md:562` ▶ | - https://attack.mitre.org/techniques/T1218/ | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1218/ — "System Binary Proxy Execution, Technique T1218 - Enterprise"; URL resolves (HTTP 200) and is the right target for the parent technique |
| | | <sub>↑ references:<br>↓ author: Your Name</sub> | |
| 42 | `02-phase-threat-hunting.md:761` ▶ | ATT&CK T1053.005 — Scheduled Task/Job: Scheduled Task | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1053/005/ — "Scheduled Task/Job: Scheduled Task, Sub-technique T1053.005"; full parent-prefixed name is exact |
| | | <sub>↓ Data needed Security 4698 (task created), Sysmon 1 (process creation),</sub> | |
| 43 | `02-phase-threat-hunting.md:1013` ▶ | Technique T1053.005 marked as hunted; next hunt due in 6 months. | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1053/005/ — "ID: T1053.005"; the rest is a fictional register entry |
| | | <sub>↑ Agent coverage for the 12 hosts raised with the endpoint team.<br>↓ ```</sub> | |
| 44 | `02-phase-threat-hunting.md:1151` ▶ | ATT&CK T1003.001 — OS Credential Dumping: LSASS Memory | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1003/001/ — "OS Credential Dumping: LSASS Memory, Sub-technique T1003.001"; full parent-prefixed name is exact |
| 45 | `02-phase-threat-hunting.md:1179` ▶ | 3. T1003.001 marked HUNTED in the coverage map; next | **OK** — MITRE ATT&CK official technique page, https://attack.mitre.org/techniques/T1003/001/ — "ID: T1003.001"; the rest is a fictional report line |
| | | <sub>↑ ticket EPD-2210 opened.<br>↓ hunt due in 6 months.</sub> | |
