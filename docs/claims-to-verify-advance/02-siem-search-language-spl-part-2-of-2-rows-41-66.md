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

# SIEM search language (SPL) — rows 41–66 of this class

This is part 2 of 2. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 41 | `02-phase-threat-hunting.md:871` ▶ | \| where EventID == 1 | **OK** — vendor table reference (Azure Monitor `Event` table), https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/event — "EventID \| int \| Number of the event." Sysmon EID 1 is the process-creation record. Same `EventData`-is-`string` caveat as row 40 for the context line `tostring(EventData.Image)`. |
| | | <sub>↑ \| where Source == "Microsoft-Windows-Sysmon"<br>↓ \| extend Image = tostring(EventData.Image)</sub> | |
| 42 | `02-phase-threat-hunting.md:877` ▶ | \| join kind=inner (procs) on Computer | **OK** — vendor KQL reference (join operator), https://learn.microsoft.com/en-us/kusto/query/join-operator?view=microsoft-fabric — "The type of join to perform: `innerunique`, `inner`, `leftouter`, `rightouter`, `fullouter`, `leftanti`, `rightanti`, `leftsemi`, `rightsemi`." and "If the columns you want to match have the same name in both tables, use the syntax `ON`*ColumnName*." |
| | | <sub>↑ tasks<br>↓ \| where ProcTime between (TaskTime .. (TaskTime + 5m))</sub> | |
| 43 | `02-phase-threat-hunting.md:878` ▶ | \| where ProcTime between (TaskTime .. (TaskTime + 5m)) | **OK** — vendor KQL reference (between operator), https://learn.microsoft.com/en-us/kusto/query/between-operator?view=microsoft-fabric — "`between` can operate on any numeric, datetime, or timespan expression." and "This value can only be of type `timespan` if *expr* and *leftRange* are both of type `datetime`." All three terms are datetime, and the range is inclusive. |
| | | <sub>↑ \| join kind=inner (procs) on Computer<br>↓ \| project TaskTime, ProcTime, Computer, CreatedBy, TaskName, Image, CommandLine, ParentImage</sub> | |
| 44 | `02-phase-threat-hunting.md:880` ▶ | \| sort by TaskTime desc | **OK** — vendor KQL reference (sort operator), https://learn.microsoft.com/en-us/kusto/query/sort-operator?view=microsoft-fabric — "`asc` sorts into ascending order, low to high. Default is `desc`, high to low." |
| | | <sub>↑ \| project TaskTime, ProcTime, Computer, CreatedBy, TaskName, Image, CommandLine, ParentImage<br>↓ ```</sub> | |
| 45 | `02-phase-threat-hunting.md:896` ▶ | \| where TimeGenerated > start | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time." |
| | | <sub>↑ SecurityEvent<br>↓ \| where EventID == 4698</sub> | |
| 46 | `02-phase-threat-hunting.md:897` ▶ | \| where EventID == 4698 | **OK** — vendor event reference (Microsoft Learn, archived Windows 10 reference), https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4698 — "4698(S) A scheduled task was created." |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| extend TaskName = tostring(EventData.TaskName)</sub> | |
| 47 | `02-phase-threat-hunting.md:903` ▶ | \| where TimeGenerated > start | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time." |
| | | <sub>↑ Event<br>↓ \| where Source == "Microsoft-Windows-Sysmon"</sub> | |
| 48 | `02-phase-threat-hunting.md:904` ▶ | \| where Source == "Microsoft-Windows-Sysmon" | **OK** — vendor table reference (Azure Monitor `Event` table), https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/event — "Source \| string \| Source of the event." `EventData` is typed `string` on the same page; see row 40 caveat on `EventData.Image`. |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| where EventID == 1</sub> | |
| 49 | `02-phase-threat-hunting.md:905` ▶ | \| where EventID == 1 | **OK** — vendor table reference (Azure Monitor `Event` table), https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/event — "EventID \| int \| Number of the event." Same `EventData`-is-`string` caveat as row 40 for the context line `tostring(EventData.ParentImage)`. |
| | | <sub>↑ \| where Source == "Microsoft-Windows-Sysmon"<br>↓ \| extend Image = tostring(EventData.Image)</sub> | |
| 50 | `02-phase-threat-hunting.md:910` ▶ | \| where Leaf in~ (interpreters) | **OK** — vendor KQL reference (in~ operator), https://learn.microsoft.com/en-us/kusto/query/in-operator?view=microsoft-fabric — "Filters a record set for data with a case-insensitive string", and the let-statement form is documented: "let states = dynamic([...]); StormEvents \| where State in~ (states)". The context line `tolower(tostring(split(Image, "\\")[-1]))` is valid: "Converts the input string to lower case", https://learn.microsoft.com/en-us/kusto/query/tolower-function?view=microsoft-fabric, and `arr[(-1)]` "Retrieves the last value in the array", https://learn.microsoft.com/en-us/kusto/query/scalar-data-types/dynamic?view=microsoft-fabric |
| | | <sub>↑ \| extend Leaf = tolower(tostring(split(Image, "\\")[-1]))<br>↓ or CommandLine has_any (@"\AppData\", @"\Temp\", @"\ProgramData\",</sub> | |
| 51 | `02-phase-threat-hunting.md:915` ▶ | \| join kind=inner (interesting) on Computer | **OK** — vendor KQL reference (join operator), https://learn.microsoft.com/en-us/kusto/query/join-operator?view=microsoft-fabric — "The type of join to perform: `innerunique`, `inner`, `leftouter`, `rightouter`, `fullouter`, `leftanti`, `rightanti`, `leftsemi`, `rightsemi`." |
| | | <sub>↑ tasks<br>↓ \| where ProcTime between (TaskTime .. (TaskTime + 5m))</sub> | |
| 52 | `02-phase-threat-hunting.md:916` ▶ | \| where ProcTime between (TaskTime .. (TaskTime + 5m)) | **OK** — vendor KQL reference (between operator), https://learn.microsoft.com/en-us/kusto/query/between-operator?view=microsoft-fabric — "`between` can operate on any numeric, datetime, or timespan expression." The following `datetime_diff("second", ProcTime, TaskTime)` is also correct: "Returns an integer that represents the amount of *periods* in the result of subtraction (*datetime1* - *datetime2*)", https://learn.microsoft.com/en-us/kusto/query/datetime-diff-function?view=microsoft-fabric |
| | | <sub>↑ \| join kind=inner (interesting) on Computer<br>↓ \| extend SecondsAfter = datetime_diff("second", ProcTime, TaskTime)</sub> | |
| 53 | `02-phase-threat-hunting.md:920` ▶ | \| sort by SecondsAfter asc | **OK** — vendor KQL reference (sort operator), https://learn.microsoft.com/en-us/kusto/query/sort-operator?view=microsoft-fabric — "`asc` sorts into ascending order, low to high. Default is `desc`, high to low." |
| | | <sub>↑ Image, CommandLine, ParentImage<br>↓ ```</sub> | |
| 54 | `04-phase-cloud-identity-architecture.md:601` ▶ | aws cloudtrail lookup-events \ --lookup-attributes AttributeKey=Username,AttributeValue=PaymentsApiTaskRole \ --start-time 2025-12-14T00:00:00Z \ --end-time 2026-03-14T00:00:00Z \ --query 'Events[].CloudTrailEvent' \ --output text \ \| jq -r 'fromjson \| "\(.e … | **OK** — vendor CLI reference (AWS CLI Command Reference), https://docs.aws.amazon.com/cli/latest/reference/cloudtrail/lookup-events.html — `Username` is a valid lookup key: "AttributeKey ... Possible values: `EventId`, `EventName`, `ReadOnly`, `Username`, `ResourceType`, `ResourceName`, `EventSource`, `AccessKeyId`"; `--query` is "A JMESPath query to use in filtering the response data"; `Events[].CloudTrailEvent` is valid because the output element is "CloudTrailEvent -> (string) A JSON string that contains a representation of the event returned." **Material caveat:** "The default number of results returned is 50, with a maximum of 50 possible" and "`lookup-events` is a paginated operation" — so as written this returns at most the 50 most recent events of the 90-day window and does not answer "what did this role do in the last 90 days" without `--page-size`/`--max-items`/token paging. |
| 55 | `04-phase-cloud-identity-architecture.md:1451` ▶ | \| where TimeGenerated > ago(90d) | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time."; `d` is a valid timespan literal (see the `between` page example `between (datetime(2007-07-27) .. 3d)`), https://learn.microsoft.com/en-us/kusto/query/between-operator?view=microsoft-fabric |
| | | <sub>↑ SigninLogs<br>↓ \| where UserPrincipalName in (</sub> | |
| 56 | `04-phase-cloud-identity-architecture.md:1452` ▶ | \| where UserPrincipalName in ( | **OK** — vendor KQL reference (in operator), https://learn.microsoft.com/en-us/kusto/query/in-operator?view=microsoft-fabric — `in` is the case-sensitive membership form, and the page's comparison table marks `in` case-sensitive and `in~` not. `UserPrincipalName` is a real `SigninLogs` column: "UserPrincipalName \| string \| The UPN of the user.", https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/signinlogs |
| | | <sub>↑ \| where TimeGenerated > ago(90d)<br>↓ "breakglass-01@contoso.onmicrosoft.com",</sub> | |
| 57 | `04-phase-cloud-identity-architecture.md:1457` ▶ | \| sort by TimeGenerated desc | **OK** — vendor KQL reference (sort operator), https://learn.microsoft.com/en-us/kusto/query/sort-operator?view=microsoft-fabric — "`asc` sorts into ascending order, low to high. Default is `desc`, high to low." |
| | | <sub>↑ ResultType, ResultDescription, ConditionalAccessStatus<br>↓ ```</sub> | |
| 58 | `04-phase-cloud-identity-architecture.md:1464` ▶ | \| where TimeGenerated > ago(7d) | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time." |
| | | <sub>↑ SigninLogs<br>↓ \| where ResultType == 0</sub> | |
| 59 | `04-phase-cloud-identity-architecture.md:1465` ▶ | \| where ResultType == 0 | **OK** — vendor table reference (Azure Monitor `SigninLogs`), https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/signinlogs — "ResultType \| string \| Provides the 5-6 digit error code that's generated during a sign-in event. 0 indicates success; other values are failures." |
| | | <sub>↑ \| where TimeGenerated > ago(7d)<br>↓ \| where LocationDetails.countryOrRegion != "PH"</sub> | |
| 60 | `04-phase-cloud-identity-architecture.md:1466` ▶ | \| where LocationDetails.countryOrRegion != "PH" | **OK** — vendor table reference (Azure Monitor `SigninLogs`), https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/signinlogs — "LocationDetails \| dynamic \| Provides the city, state, country/region and latitude and longitude from where the sign-in happened."; `countryOrRegion` is the Graph property name: "Provides the city, state, and country code where the sign-in originated. Supports `$filter` ( `eq` , `startsWith` ) on `city` , `state` , and `countryOrRegion` properties.", https://learn.microsoft.com/en-us/graph/api/resources/signin?view=graph-rest-1.0 |
| | | <sub>↑ \| where ResultType == 0<br>↓ \| where IPAddress !in ("203.0.113.10", "203.0.113.11")</sub> | |
| 61 | `04-phase-cloud-identity-architecture.md:1467` ▶ | \| where IPAddress !in ("203.0.113.10", "203.0.113.11") | **OK** — vendor KQL reference (in operator), https://learn.microsoft.com/en-us/kusto/query/in-operator?view=microsoft-fabric — the comparison table defines `!in` as "Not equals to any of the elements", case-sensitive. `IPAddress` is a real column: "IPAddress \| string \| The IP address of the client from where the sign-in occurred.", https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/signinlogs |
| | | <sub>↑ \| where LocationDetails.countryOrRegion != "PH"<br>↓ \| project TimeGenerated, UserPrincipalName, AppDisplayName, IPAddress,</sub> | |
| 62 | `04-phase-cloud-identity-architecture.md:1470` ▶ | \| sort by TimeGenerated desc | **OK** — vendor KQL reference (sort operator), https://learn.microsoft.com/en-us/kusto/query/sort-operator?view=microsoft-fabric — "`asc` sorts into ascending order, low to high. Default is `desc`, high to low." |
| | | <sub>↑ LocationDetails.countryOrRegion, ConditionalAccessStatus, RiskLevelDuringSignIn<br>↓ ```</sub> | |
| 63 | `04-phase-cloud-identity-architecture.md:1477` ▶ | \| where TimeGenerated > ago(30d) | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time." `AuditLogs` is a real Log Analytics table, https://learn.microsoft.com/en-us/entra/identity/monitoring-health/tutorial-configure-log-analytics-workspace — "Under **Logs**, select **AuditLogs** and **SigninLogs**." |
| | | <sub>↑ AuditLogs<br>↓ \| where OperationName in (</sub> | |
| 64 | `04-phase-cloud-identity-architecture.md:1478` ▶ | \| where OperationName in ( | **WRONG** — the third literal matches nothing. Correct value: `"Add member to role outside of PIM (permanent)"` — the documented activity name includes the trailing " (permanent)". As written, `OperationName in ("Add member to role", "Add eligible member to role", "Add member to role outside of PIM")` silently returns zero rows for the interesting case the comment calls out. Source: https://learn.microsoft.com/en-us/entra/identity/monitoring-health/reference-audit-activities — "RoleManagement \| Add member to role outside of PIM (permanent)". The first two literals are exact: "RoleManagement \| Add eligible member to role" and "RoleManagement \| Add member to role" |
| | | <sub>↑ \| where TimeGenerated > ago(30d)<br>↓ "Add member to role",</sub> | |
| 65 | `04-phase-cloud-identity-architecture.md:1485` ▶ | \| sort by TimeGenerated desc | **OK** — vendor KQL reference (sort operator), https://learn.microsoft.com/en-us/kusto/query/sort-operator?view=microsoft-fabric — "`asc` sorts into ascending order, low to high. Default is `desc`, high to low." |
| | | <sub>↑ \| project TimeGenerated, OperationName, Actor, Target, Result<br>↓ ```</sub> | |
| 66 | `07-phase-detection-as-code.md:806` ▶ | grep -rho 'attack\.t[0-9]\{4\}\(\.[0-9]\{3\}\)\?' rules/ \ \| sort \| uniq -c \| sort -rn | **OK** — upstream tool manual (GNU Grep 3.12), https://www.gnu.org/software/grep/manual/grep.html — `-r` "read and process all files in the directory, recursively"; `-o` "Print only the matched non-empty parts of matching lines, with each such part on a separate output line"; `-h` "Suppress the prefixing of file names on output". The BRE constructs are documented: `\{n\}` "matches exactly n times" and `\?` "The preceding item is optional and is matched at most once". The trailing `sort \| uniq -c \| sort -rn` is a standard POSIX pipeline and is not separately cited. |
| | | <sub>↑ # List the technique tags actually present in the repository.<br>↓ ```</sub> | |
