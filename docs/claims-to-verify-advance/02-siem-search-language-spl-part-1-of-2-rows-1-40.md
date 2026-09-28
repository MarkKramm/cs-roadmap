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

# SIEM search language (SPL) — rows 1–40 of this class

This is part 1 of 2. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 1 | `02-phase-threat-hunting.md:455` ▶ | \| where Timestamp > ago(lookback) | |
| | | <sub>↑ DeviceProcessEvents<br>↓ \| where FileName in~ (proxies)</sub> | |
| 2 | `02-phase-threat-hunting.md:456` ▶ | \| where FileName in~ (proxies) | |
| | | <sub>↑ \| where Timestamp > ago(lookback)<br>↓ \| where ProcessCommandLine has_any (@"\AppData\", @"\Temp\", @"\Downloads\", @"\ProgramData\", @"\Users\Public\")</sub> | |
| 3 | `02-phase-threat-hunting.md:457` ▶ | \| where ProcessCommandLine has_any (@"\AppData\", @"\Temp\", @"\Downloads\", @"\ProgramData\", @"\Users\Public\") | |
| 4 | `02-phase-threat-hunting.md:467` ▶ | \| sort by Timestamp desc | |
| | | <sub>↑ SHA256<br>↓ ```</sub> | |
| 5 | `02-phase-threat-hunting.md:488` ▶ | \| where Timestamp > ago(lookback) | |
| | | <sub>↑ DeviceProcessEvents<br>↓ \| where FileName in~ (proxies)</sub> | |
| 6 | `02-phase-threat-hunting.md:489` ▶ | \| where FileName in~ (proxies) | |
| | | <sub>↑ \| where Timestamp > ago(lookback)<br>↓ \| where ProcessCommandLine has_any (@"\AppData\", @"\Temp\", @"\Downloads\", @"\ProgramData\")</sub> | |
| 7 | `02-phase-threat-hunting.md:490` ▶ | \| where ProcessCommandLine has_any (@"\AppData\", @"\Temp\", @"\Downloads\", @"\ProgramData\") | |
| | | <sub>↑ \| where FileName in~ (proxies)<br>↓ \| project DeviceId, DeviceName, ProcessId = tostring(ProcessId), Timestamp;</sub> | |
| 8 | `02-phase-threat-hunting.md:493` ▶ | \| join kind=inner ( | |
| | | <sub>↑ suspicious<br>↓ DeviceNetworkEvents</sub> | |
| 9 | `02-phase-threat-hunting.md:495` ▶ | \| where Timestamp > ago(lookback) | |
| | | <sub>↑ DeviceNetworkEvents<br>↓ \| where ActionType == "ConnectionSuccess"</sub> | |
| 10 | `02-phase-threat-hunting.md:496` ▶ | \| where ActionType == "ConnectionSuccess" | |
| | | <sub>↑ \| where Timestamp > ago(lookback)<br>↓ \| project DeviceId,</sub> | |
| 11 | `02-phase-threat-hunting.md:503` ▶ | \| where NetworkTime between (Timestamp .. (Timestamp + 10m)) | |
| | | <sub>↑ ) on DeviceId, $left.ProcessId == $right.InitiatingProcessId<br>↓ \| project DeviceName, Timestamp, ProcessId, NetworkTime, RemoteIP, RemotePort</sub> | |
| 12 | `02-phase-threat-hunting.md:505` ▶ | \| sort by Timestamp desc | |
| | | <sub>↑ \| project DeviceName, Timestamp, ProcessId, NetworkTime, RemoteIP, RemotePort<br>↓ ```</sub> | |
| 13 | `02-phase-threat-hunting.md:508` | **The time bound is the part beginners leave out.** Joining on process ID alone across a 30-day window will match a process ID that was reused by an unrelated process days later. `between (Timestamp .. (Timestamp + 10m))` constrains the join to a plausible cau … | |
| 14 | `02-phase-threat-hunting.md:516` ▶ | \| eval ImageLower = lower(Image) | |
| | | <sub>↑ index=windows sourcetype="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational" EventCode=1<br>↓ \| where ImageLower IN ("*\\rundll32.exe", "*\\regsvr32.exe", "*\\mshta.exe", "*\\installutil.exe")</sub> | |
| 15 | `02-phase-threat-hunting.md:517` ▶ | \| where ImageLower IN ("*\\rundll32.exe", "*\\regsvr32.exe", "*\\mshta.exe", "*\\installutil.exe") | |
| | | <sub>↑ \| eval ImageLower = lower(Image)<br>↓ \| where match(CommandLine, "(?i)(\\\\AppData\\\\\|\\\\Temp\\\\\|\\\\Downloads\\\\\|\\\\ProgramData\\\\\|\\\\Users\\\\Public\\\\)")</sub> | |
| 16 | `02-phase-threat-hunting.md:518` ▶ | \| where match(CommandLine, "(?i)(\\\\AppData\\\\\|\\\\Temp\\\\\|\\\\Downloads\\\\\|\\\\ProgramData\\\\\|\\\\Users\\\\Public\\\\)") | |
| 17 | `02-phase-threat-hunting.md:519` ▶ | \| table _time, ComputerName, User, Image, CommandLine, ParentImage, ParentCommandLine | |
| | | <sub>↑ \| where match(CommandLine, "(?i)(\\\\AppData\\\\\|\\\\Temp\\\\\|\\\\Downloads\\\\\|\\\\ProgramData\\\\\|\\\\Users\\\\Public\\\\)")<br>↓ \| sort - _time</sub> | |
| 18 | `02-phase-threat-hunting.md:520` ▶ | \| sort - _time | |
| | | <sub>↑ \| table _time, ComputerName, User, Image, CommandLine, ParentImage, ParentCommandLine<br>↓ ```</sub> | |
| 19 | `02-phase-threat-hunting.md:527` ▶ | \| eval Parent = lower(ParentImage), Child = lower(Image) | |
| | | <sub>↑ index=windows sourcetype="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational" EventCode=1<br>↓ \| stats count by Parent, Child</sub> | |
| 20 | `02-phase-threat-hunting.md:528` ▶ | \| stats count by Parent, Child | |
| | | <sub>↑ \| eval Parent = lower(ParentImage), Child = lower(Image)<br>↓ \| where count < 5</sub> | |
| 21 | `02-phase-threat-hunting.md:529` ▶ | \| where count < 5 | |
| | | <sub>↑ \| stats count by Parent, Child<br>↓ \| sort count</sub> | |
| 22 | `02-phase-threat-hunting.md:530` ▶ | \| sort count | |
| | | <sub>↑ \| where count < 5<br>↓ \| head 100</sub> | |
| 23 | `02-phase-threat-hunting.md:531` ▶ | \| head 100 | |
| | | <sub>↑ \| sort count<br>↓ ```</sub> | |
| 24 | `02-phase-threat-hunting.md:539` ▶ | \| tstats count | |
| | | <sub>↑ ```spl<br>↓ from datamodel=Endpoint.Processes</sub> | |
| 25 | `02-phase-threat-hunting.md:543` ▶ | \| where count > 0 | |
| | | <sub>↑ by Processes.dest, Processes.user, Processes.process, _time span=1d<br>↓ \| eventstats dc(Processes.dest) as host_count by Processes.process</sub> | |
| 26 | `02-phase-threat-hunting.md:544` ▶ | \| eventstats dc(Processes.dest) as host_count by Processes.process | |
| | | <sub>↑ \| where count > 0<br>↓ \| where host_count <= 2</sub> | |
| 27 | `02-phase-threat-hunting.md:545` ▶ | \| where host_count <= 2 | |
| | | <sub>↑ \| eventstats dc(Processes.dest) as host_count by Processes.process<br>↓ \| sort - _time</sub> | |
| 28 | `02-phase-threat-hunting.md:546` ▶ | \| sort - _time | |
| | | <sub>↑ \| where host_count <= 2<br>↓ ```</sub> | |
| 29 | `02-phase-threat-hunting.md:814` ▶ | \| where TimeGenerated > start | |
| | | <sub>↑ SecurityEvent<br>↓ \| where EventID == 4698</sub> | |
| 30 | `02-phase-threat-hunting.md:815` ▶ | \| where EventID == 4698 | |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| extend TaskName = tostring(EventData.TaskName)</sub> | |
| 31 | `02-phase-threat-hunting.md:819` ▶ | \| sort by TimeGenerated desc | |
| | | <sub>↑ \| project TimeGenerated, Computer, CreatedBy, TaskName<br>↓ ```</sub> | |
| 32 | `02-phase-threat-hunting.md:837` ▶ | \| where TimeGenerated > start | |
| | | <sub>↑ SecurityEvent<br>↓ \| where EventID == 4698</sub> | |
| 33 | `02-phase-threat-hunting.md:838` ▶ | \| where EventID == 4698 | |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| extend TaskName = tostring(EventData.TaskName)</sub> | |
| 34 | `02-phase-threat-hunting.md:842` ▶ | \| where TaskLeaf has_any (namePatterns) | |
| | | <sub>↑ \| extend TaskLeaf = tostring(split(TaskName, "\\")[-1])<br>↓ \| project TimeGenerated, Computer, CreatedBy, TaskName</sub> | |
| 35 | `02-phase-threat-hunting.md:844` ▶ | \| sort by TimeGenerated desc | |
| | | <sub>↑ \| project TimeGenerated, Computer, CreatedBy, TaskName<br>↓ ```</sub> | |
| 36 | `02-phase-threat-hunting.md:858` ▶ | \| where TimeGenerated > start | |
| | | <sub>↑ SecurityEvent<br>↓ \| where EventID == 4698</sub> | |
| 37 | `02-phase-threat-hunting.md:859` ▶ | \| where EventID == 4698 | |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| extend TaskName = tostring(EventData.TaskName)</sub> | |
| 38 | `02-phase-threat-hunting.md:863` ▶ | \| where TaskLeaf has_any (dynamic(["updater", "update", "system", "svc", | |
| | | <sub>↑ \| extend TaskLeaf = tostring(split(TaskName, "\\")[-1])<br>↓ "service", "win", "winlog", "ms",</sub> | |
| 39 | `02-phase-threat-hunting.md:869` ▶ | \| where TimeGenerated > start | |
| | | <sub>↑ Event<br>↓ \| where Source == "Microsoft-Windows-Sysmon"</sub> | |
| 40 | `02-phase-threat-hunting.md:870` ▶ | \| where Source == "Microsoft-Windows-Sysmon" | |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| where EventID == 1</sub> | |
