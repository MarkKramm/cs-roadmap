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

# SIEM search language (SPL) — rows 41–66 of this class

This is part 2 of 2. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 41 | `02-phase-threat-hunting.md:871` ▶ | \| where EventID == 1 | |
| | | <sub>↑ \| where Source == "Microsoft-Windows-Sysmon"<br>↓ \| extend Image = tostring(EventData.Image)</sub> | |
| 42 | `02-phase-threat-hunting.md:877` ▶ | \| join kind=inner (procs) on Computer | |
| | | <sub>↑ tasks<br>↓ \| where ProcTime between (TaskTime .. (TaskTime + 5m))</sub> | |
| 43 | `02-phase-threat-hunting.md:878` ▶ | \| where ProcTime between (TaskTime .. (TaskTime + 5m)) | |
| | | <sub>↑ \| join kind=inner (procs) on Computer<br>↓ \| project TaskTime, ProcTime, Computer, CreatedBy, TaskName, Image, CommandLine, ParentImage</sub> | |
| 44 | `02-phase-threat-hunting.md:880` ▶ | \| sort by TaskTime desc | |
| | | <sub>↑ \| project TaskTime, ProcTime, Computer, CreatedBy, TaskName, Image, CommandLine, ParentImage<br>↓ ```</sub> | |
| 45 | `02-phase-threat-hunting.md:896` ▶ | \| where TimeGenerated > start | |
| | | <sub>↑ SecurityEvent<br>↓ \| where EventID == 4698</sub> | |
| 46 | `02-phase-threat-hunting.md:897` ▶ | \| where EventID == 4698 | |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| extend TaskName = tostring(EventData.TaskName)</sub> | |
| 47 | `02-phase-threat-hunting.md:903` ▶ | \| where TimeGenerated > start | |
| | | <sub>↑ Event<br>↓ \| where Source == "Microsoft-Windows-Sysmon"</sub> | |
| 48 | `02-phase-threat-hunting.md:904` ▶ | \| where Source == "Microsoft-Windows-Sysmon" | |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| where EventID == 1</sub> | |
| 49 | `02-phase-threat-hunting.md:905` ▶ | \| where EventID == 1 | |
| | | <sub>↑ \| where Source == "Microsoft-Windows-Sysmon"<br>↓ \| extend Image = tostring(EventData.Image)</sub> | |
| 50 | `02-phase-threat-hunting.md:910` ▶ | \| where Leaf in~ (interpreters) | |
| | | <sub>↑ \| extend Leaf = tolower(tostring(split(Image, "\\")[-1]))<br>↓ or CommandLine has_any (@"\AppData\", @"\Temp\", @"\ProgramData\",</sub> | |
| 51 | `02-phase-threat-hunting.md:915` ▶ | \| join kind=inner (interesting) on Computer | |
| | | <sub>↑ tasks<br>↓ \| where ProcTime between (TaskTime .. (TaskTime + 5m))</sub> | |
| 52 | `02-phase-threat-hunting.md:916` ▶ | \| where ProcTime between (TaskTime .. (TaskTime + 5m)) | |
| | | <sub>↑ \| join kind=inner (interesting) on Computer<br>↓ \| extend SecondsAfter = datetime_diff("second", ProcTime, TaskTime)</sub> | |
| 53 | `02-phase-threat-hunting.md:920` ▶ | \| sort by SecondsAfter asc | |
| | | <sub>↑ Image, CommandLine, ParentImage<br>↓ ```</sub> | |
| 54 | `04-phase-cloud-identity-architecture.md:601` ▶ | aws cloudtrail lookup-events \ --lookup-attributes AttributeKey=Username,AttributeValue=PaymentsApiTaskRole \ --start-time 2025-12-14T00:00:00Z \ --end-time 2026-03-14T00:00:00Z \ --query 'Events[].CloudTrailEvent' \ --output text \ \| jq -r 'fromjson \| "\(.e … | |
| 55 | `04-phase-cloud-identity-architecture.md:1451` ▶ | \| where TimeGenerated > ago(90d) | |
| | | <sub>↑ SigninLogs<br>↓ \| where UserPrincipalName in (</sub> | |
| 56 | `04-phase-cloud-identity-architecture.md:1452` ▶ | \| where UserPrincipalName in ( | |
| | | <sub>↑ \| where TimeGenerated > ago(90d)<br>↓ "breakglass-01@contoso.onmicrosoft.com",</sub> | |
| 57 | `04-phase-cloud-identity-architecture.md:1457` ▶ | \| sort by TimeGenerated desc | |
| | | <sub>↑ ResultType, ResultDescription, ConditionalAccessStatus<br>↓ ```</sub> | |
| 58 | `04-phase-cloud-identity-architecture.md:1464` ▶ | \| where TimeGenerated > ago(7d) | |
| | | <sub>↑ SigninLogs<br>↓ \| where ResultType == 0</sub> | |
| 59 | `04-phase-cloud-identity-architecture.md:1465` ▶ | \| where ResultType == 0 | |
| | | <sub>↑ \| where TimeGenerated > ago(7d)<br>↓ \| where LocationDetails.countryOrRegion != "PH"</sub> | |
| 60 | `04-phase-cloud-identity-architecture.md:1466` ▶ | \| where LocationDetails.countryOrRegion != "PH" | |
| | | <sub>↑ \| where ResultType == 0<br>↓ \| where IPAddress !in ("203.0.113.10", "203.0.113.11")</sub> | |
| 61 | `04-phase-cloud-identity-architecture.md:1467` ▶ | \| where IPAddress !in ("203.0.113.10", "203.0.113.11") | |
| | | <sub>↑ \| where LocationDetails.countryOrRegion != "PH"<br>↓ \| project TimeGenerated, UserPrincipalName, AppDisplayName, IPAddress,</sub> | |
| 62 | `04-phase-cloud-identity-architecture.md:1470` ▶ | \| sort by TimeGenerated desc | |
| | | <sub>↑ LocationDetails.countryOrRegion, ConditionalAccessStatus, RiskLevelDuringSignIn<br>↓ ```</sub> | |
| 63 | `04-phase-cloud-identity-architecture.md:1477` ▶ | \| where TimeGenerated > ago(30d) | |
| | | <sub>↑ AuditLogs<br>↓ \| where OperationName in (</sub> | |
| 64 | `04-phase-cloud-identity-architecture.md:1478` ▶ | \| where OperationName in ( | |
| | | <sub>↑ \| where TimeGenerated > ago(30d)<br>↓ "Add member to role",</sub> | |
| 65 | `04-phase-cloud-identity-architecture.md:1485` ▶ | \| sort by TimeGenerated desc | |
| | | <sub>↑ \| project TimeGenerated, OperationName, Actor, Target, Result<br>↓ ```</sub> | |
| 66 | `07-phase-detection-as-code.md:806` ▶ | grep -rho 'attack\.t[0-9]\{4\}\(\.[0-9]\{3\}\)\?' rules/ \ \| sort \| uniq -c \| sort -rn | |
| | | <sub>↑ # List the technique tags actually present in the repository.<br>↓ ```</sub> | |
