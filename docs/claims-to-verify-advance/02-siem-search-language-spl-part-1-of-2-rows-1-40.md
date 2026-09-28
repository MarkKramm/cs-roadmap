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

| 1 | `02-phase-threat-hunting.md:455` ▶ | \| where Timestamp > ago(lookback) | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time." `d` is a valid timespan literal: the `between` page example `between (datetime(2007-07-27) .. 3d)`, https://learn.microsoft.com/en-us/kusto/query/between-operator?view=microsoft-fabric |
| | | <sub>↑ DeviceProcessEvents<br>↓ \| where FileName in~ (proxies)</sub> | |
| 2 | `02-phase-threat-hunting.md:456` ▶ | \| where FileName in~ (proxies) | **OK** — vendor KQL reference (in~ operator), https://learn.microsoft.com/en-us/kusto/query/in-operator?view=microsoft-fabric — "Filters a record set for data with a case-insensitive string"; the page's operator table marks `in~` case-insensitive and `in` case-sensitive, and shows `let states = dynamic([...]); StormEvents \| where State in~ (states)`. **Finding not in this row:** the phase's prose at :472 ("On Windows filenames, always use the case-insensitive form") contradicts the same page's tip "When possible, use the case-sensitive `in`." |
| | | <sub>↑ \| where Timestamp > ago(lookback)<br>↓ \| where ProcessCommandLine has_any (@"\AppData\", @"\Temp\", @"\Downloads\", @"\ProgramData\", @"\Users\Public\")</sub> | |
| 3 | `02-phase-threat-hunting.md:457` ▶ | \| where ProcessCommandLine has_any (@"\AppData\", @"\Temp\", @"\Downloads\", @"\ProgramData\", @"\Users\Public\") | **OK** — vendor KQL reference (has_any operator), https://learn.microsoft.com/en-us/kusto/query/has-any-operator?view=microsoft-fabric — "searches for indexed terms, where an indexed term is three or more characters"; term-level and faster than `contains`: https://learn.microsoft.com/en-us/kusto/query/datatypes-string-operators?view=microsoft-fabric — "`has` works faster than `contains`, `startswith`, or `endswith`". Verbatim literal `@"..."` confirmed, https://learn.microsoft.com/en-us/kusto/query/scalar-data-types/string?view=microsoft-fabric. **Caveat:** terms are "maximal sequences of alphanumeric characters", so `@"\AppData\"` reduces to the term `AppData` — this matches the word anywhere, not the `\AppData\` path fragment the comment implies. |
| 4 | `02-phase-threat-hunting.md:467` ▶ | \| sort by Timestamp desc | **OK** — vendor KQL reference (sort operator), https://learn.microsoft.com/en-us/kusto/query/sort-operator?view=microsoft-fabric — "`asc` sorts into ascending order, low to high. Default is `desc`, high to low." **Finding not in this row:** the adjacent prose at :478 says SHA256 is included "so that a triaged hit can be pivoted on immediately", but the Defender schema says `SHA256` "This field is usually not populated — use the SHA1 column when available.", https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table |
| | | <sub>↑ SHA256<br>↓ ```</sub> | |
| 5 | `02-phase-threat-hunting.md:488` ▶ | \| where Timestamp > ago(lookback) | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time." |
| | | <sub>↑ DeviceProcessEvents<br>↓ \| where FileName in~ (proxies)</sub> | |
| 6 | `02-phase-threat-hunting.md:489` ▶ | \| where FileName in~ (proxies) | **OK** — vendor KQL reference (in~ operator), https://learn.microsoft.com/en-us/kusto/query/in-operator?view=microsoft-fabric — "Filters a record set for data with a case-insensitive string." Same :472 prose finding as row 2: the page advises "When possible, use the case-sensitive `in`." |
| | | <sub>↑ \| where Timestamp > ago(lookback)<br>↓ \| where ProcessCommandLine has_any (@"\AppData\", @"\Temp\", @"\Downloads\", @"\ProgramData\")</sub> | |
| 7 | `02-phase-threat-hunting.md:490` ▶ | \| where ProcessCommandLine has_any (@"\AppData\", @"\Temp\", @"\Downloads\", @"\ProgramData\") | **OK** — vendor KQL reference (has_any operator), https://learn.microsoft.com/en-us/kusto/query/has-any-operator?view=microsoft-fabric — "searches for indexed terms, where an indexed term is three or more characters." Same term-vs-substring caveat as row 3. |
| | | <sub>↑ \| where FileName in~ (proxies)<br>↓ \| project DeviceId, DeviceName, ProcessId = tostring(ProcessId), Timestamp;</sub> | |
| 8 | `02-phase-threat-hunting.md:493` ▶ | \| join kind=inner ( | **OK** — vendor KQL reference (join operator), https://learn.microsoft.com/en-us/kusto/query/join-operator?view=microsoft-fabric — "The type of join to perform: `innerunique`, `inner`, `leftouter`, `rightouter`, `fullouter`, `leftanti`, `rightanti`, `leftsemi`, `rightsemi`." The same page confirms the closing `on DeviceId, $left.ProcessId == $right.InitiatingProcessId` form: "To specify multiple conditions, you can either use the "and" keyword or separate them with commas. If you use commas, the conditions are evaluated using the "and" logical operator." |
| | | <sub>↑ suspicious<br>↓ DeviceNetworkEvents</sub> | |
| 9 | `02-phase-threat-hunting.md:495` ▶ | \| where Timestamp > ago(lookback) | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time." |
| | | <sub>↑ DeviceNetworkEvents<br>↓ \| where ActionType == "ConnectionSuccess"</sub> | |
| 10 | `02-phase-threat-hunting.md:496` ▶ | \| where ActionType == "ConnectionSuccess" | **UNVERIFIABLE** — `ActionType` is a real `DeviceNetworkEvents` column, but Microsoft's published schema declines to enumerate its values: "Type of activity that triggered the event. See the in-portal schema reference for details." https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table — so no page I could open confirms the literal `ConnectionSuccess` |
| | | <sub>↑ \| where Timestamp > ago(lookback)<br>↓ \| project DeviceId,</sub> | |
| 11 | `02-phase-threat-hunting.md:503` ▶ | \| where NetworkTime between (Timestamp .. (Timestamp + 10m)) | **OK** — vendor KQL reference (between operator), https://learn.microsoft.com/en-us/kusto/query/between-operator?view=microsoft-fabric — "`between` can operate on any numeric, datetime, or timespan expression." and "This value can only be of type `timespan` if *expr* and *leftRange* are both of type `datetime`." All three terms here are datetime, so `between` is well typed after the join. Note the range is inclusive: "Rows in *T* for which the predicate of (*expr* >= *leftRange* and *expr* <= *rightRange*) evaluates to `true`." |
| | | <sub>↑ ) on DeviceId, $left.ProcessId == $right.InitiatingProcessId<br>↓ \| project DeviceName, Timestamp, ProcessId, NetworkTime, RemoteIP, RemotePort</sub> | |
| 12 | `02-phase-threat-hunting.md:505` ▶ | \| sort by Timestamp desc | **OK** — vendor KQL reference (sort operator), https://learn.microsoft.com/en-us/kusto/query/sort-operator?view=microsoft-fabric — "`asc` sorts into ascending order, low to high. Default is `desc`, high to low." |
| | | <sub>↑ \| project DeviceName, Timestamp, ProcessId, NetworkTime, RemoteIP, RemotePort<br>↓ ```</sub> | |
| 13 | `02-phase-threat-hunting.md:508` | **The time bound is the part beginners leave out.** Joining on process ID alone across a 30-day window will match a process ID that was reused by an unrelated process days later. `between (Timestamp .. (Timestamp + 10m))` constrains the join to a plausible cau … | **UNVERIFIABLE** — teaching judgement, not a documented fact. The premise is corroborated: Microsoft warns about PID reuse in joins — "even if process IDs get reused over time" — https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-best-practices — but "the part beginners leave out", "a false-positive generator", and the choice of a 10-minute bound are method. (The `between (a .. b)` syntax itself is verified at row 11.) |
| 14 | `02-phase-threat-hunting.md:516` ▶ | \| eval ImageLower = lower(Image) | **OK** — vendor SPL reference (Text functions), https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/text-functions — "lower(<str>) ... This function takes one string argument and returns the string in lowercase." and "You can use this function with the `eval`, `fieldformat`, and `where` commands"; the page's own example is `\| eval username=lower(username)` |
| | | <sub>↑ index=windows sourcetype="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational" EventCode=1<br>↓ \| where ImageLower IN ("*\\rundll32.exe", "*\\regsvr32.exe", "*\\mshta.exe", "*\\installutil.exe")</sub> | |
| 15 | `02-phase-threat-hunting.md:517` ▶ | \| where ImageLower IN ("*\\rundll32.exe", "*\\regsvr32.exe", "*\\mshta.exe", "*\\installutil.exe") | **WRONG** — wildcard characters are not permitted in the `IN` function when used with `where`. Correct: use the `like()` function, e.g. `\| where like(ImageLower, "%\\rundll32.exe")` (repeated per value), or match the leaf filename with `\| eval Leaf = split(Image, "\\")[-1] \| where Leaf IN ("rundll32.exe", "regsvr32.exe", "mshta.exe", "installutil.exe")` — https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/comparison-and-conditional-functions — "You cannot specify wildcard characters with the values to specify a group of similar values, such as HTTP error codes or CIDR IP address ranges. Use the IN operator instead." Also https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search — "There is also an IN function that you can use with the `eval` and `where` commands. Wild card characters are not allowed in the values list when the IN function is used with the `eval` and `where` commands." (The IN *operator* does accept wildcards, but only with `search` and `tstats`.) |
| | | <sub>↑ \| eval ImageLower = lower(Image)<br>↓ \| where match(CommandLine, "(?i)(\\\\AppData\\\\\|\\\\Temp\\\\\|\\\\Downloads\\\\\|\\\\ProgramData\\\\\|\\\\Users\\\\Public\\\\)")</sub> | |
| 16 | `02-phase-threat-hunting.md:518` ▶ | \| where match(CommandLine, "(?i)(\\\\AppData\\\\\|\\\\Temp\\\\\|\\\\Downloads\\\\\|\\\\ProgramData\\\\\|\\\\Users\\\\Public\\\\)") | **OK** — vendor SPL reference (Comparison and Conditional functions), https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/comparison-and-conditional-functions — "match(<str>, <regex>) ... This function returns TRUE if the regular expression `<regex>` finds a match against any substring of the string value `<str>`. Otherwise returns FALSE." Splunk regex is PCRE, which supports the inline `(?i)` flag: "using perl-compatible regular expressions (PCRE) syntax", https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/text-functions |
| 17 | `02-phase-threat-hunting.md:519` ▶ | \| table _time, ComputerName, User, Image, CommandLine, ParentImage, ParentCommandLine | **OK** — vendor SPL reference (table command), https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Table — "The `table` command returns a table that is formed by only the fields that you specify in the arguments. Columns are displayed in the same order that fields are specified." **Caveat:** `table` semantics are confirmed, but the field names themselves are context, and I could not open a Splunk-published field list for the Sysmon add-on (the Splunkbase app page does not publish one) to confirm that the TA extracts them under exactly these names |
| | | <sub>↑ \| where match(CommandLine, "(?i)(\\\\AppData\\\\\|\\\\Temp\\\\\|\\\\Downloads\\\\\|\\\\ProgramData\\\\\|\\\\Users\\\\Public\\\\)")<br>↓ \| sort - _time</sub> | |
| 18 | `02-phase-threat-hunting.md:520` ▶ | \| sort - _time | **OK** — vendor SPL reference (sort command), https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Sort — "The `sort` command sorts all of the results by the specified fields."; the sort-by-clause grammar "[ - \| + ] <sort-field>" confirms the `-` descending prefix |
| | | <sub>↑ \| table _time, ComputerName, User, Image, CommandLine, ParentImage, ParentCommandLine<br>↓ ```</sub> | |
| 19 | `02-phase-threat-hunting.md:527` ▶ | \| eval Parent = lower(ParentImage), Child = lower(Image) | **OK** — vendor SPL reference (Text functions), https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/text-functions — "lower(<str>) ... This function takes one string argument and returns the string in lowercase."; the `eval` command accepts multiple comma-separated assignments |
| | | <sub>↑ index=windows sourcetype="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational" EventCode=1<br>↓ \| stats count by Parent, Child</sub> | |
| 20 | `02-phase-threat-hunting.md:528` ▶ | \| stats count by Parent, Child | **OK** — vendor SPL reference (stats command), https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Stats — "If a `BY` clause is used, one row is returned for each distinct value specified in the `BY` clause." `count` is a documented aggregation: "Syntax: c() \| count() \| dc() \| mean() ..." |
| | | <sub>↑ \| eval Parent = lower(ParentImage), Child = lower(Image)<br>↓ \| where count < 5</sub> | |
| 21 | `02-phase-threat-hunting.md:529` ▶ | \| where count < 5 | **OK** — vendor SPL reference (comparison operators), https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search — "Comparison expressions with greater than or less than operators `< > <= >=` numerically compare two numbers and lexicographically compare other values." (Cited from the `search` command page's boolean/comparison section; I did not open the `where` page itself.) |
| | | <sub>↑ \| stats count by Parent, Child<br>↓ \| sort count</sub> | |
| 22 | `02-phase-threat-hunting.md:530` ▶ | \| sort count | **OK** — vendor SPL reference (sort command), https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Sort — "The `sort` command sorts all of the results by the specified fields."; sort-by-clause grammar "[ - \| + ] <sort-field>" confirms a bare field name with no prefix is ascending |
| | | <sub>↑ \| where count < 5<br>↓ \| head 100</sub> | |
| 23 | `02-phase-threat-hunting.md:531` ▶ | \| head 100 | **OK** — vendor SPL reference (head command), https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Head — "Returns the first N number of specified results in search order." (Relevant to :523's prose: the shown search does **not** use the `rare` command, which the `rare` page defines as "Displays the least common values in a field.") |
| | | <sub>↑ \| sort count<br>↓ ```</sub> | |
| 24 | `02-phase-threat-hunting.md:539` ▶ | \| tstats count | **OK** — vendor SPL reference (tstats command), https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Tstats — "Use the `tstats` command to perform statistical queries on indexed fields in tsidx files." and "By default, the `tstats` command runs over accelerated and unaccelerated data models." |
| | | <sub>↑ ```spl<br>↓ from datamodel=Endpoint.Processes</sub> | |
| 25 | `02-phase-threat-hunting.md:543` ▶ | \| where count > 0 | **OK** — vendor SPL reference (comparison operators), https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search — "Comparison expressions with greater than or less than operators `< > <= >=` numerically compare two numbers and lexicographically compare other values." |
| | | <sub>↑ by Processes.dest, Processes.user, Processes.process, _time span=1d<br>↓ \| eventstats dc(Processes.dest) as host_count by Processes.process</sub> | |
| 26 | `02-phase-threat-hunting.md:544` ▶ | \| eventstats dc(Processes.dest) as host_count by Processes.process | **OK** — vendor SPL reference (eventstats command), https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Eventstats — "Generates summary statistics from fields in your events and saves those statistics in a new field." and "Only those events that have fields pertinent to the aggregation are used in generating the summary statistics." `dc()` is the documented distinct-count aggregation, https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Stats — "Syntax: c() \| count() \| dc() \| mean() ...". The `as ... by ...` form is the documented `<stats-agg-term> ... [<by-clause>]` syntax. |
| | | <sub>↑ \| where count > 0<br>↓ \| where host_count <= 2</sub> | |
| 27 | `02-phase-threat-hunting.md:545` ▶ | \| where host_count <= 2 | **OK** — vendor SPL reference (comparison operators), https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search — "Comparison expressions with greater than or less than operators `< > <= >=` numerically compare two numbers". `host_count` is a real field by this point: eventstats "saves those statistics in a new field", https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Eventstats |
| | | <sub>↑ \| eventstats dc(Processes.dest) as host_count by Processes.process<br>↓ \| sort - _time</sub> | |
| 28 | `02-phase-threat-hunting.md:546` ▶ | \| sort - _time | **OK** — vendor SPL reference (sort command), https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Sort — "The `sort` command sorts all of the results by the specified fields."; sort-by-clause grammar "[ - \| + ] <sort-field>" confirms the `-` descending prefix |
| | | <sub>↑ \| where host_count <= 2<br>↓ ```</sub> | |
| 29 | `02-phase-threat-hunting.md:814` ▶ | \| where TimeGenerated > start | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time."; `let start = ago(90d)` binds the scalar and `d` is a valid timespan literal, https://learn.microsoft.com/en-us/kusto/query/between-operator?view=microsoft-fabric |
| | | <sub>↑ SecurityEvent<br>↓ \| where EventID == 4698</sub> | |
| 30 | `02-phase-threat-hunting.md:815` ▶ | \| where EventID == 4698 | **OK** — vendor event reference (Microsoft Learn, archived Windows 10 reference), https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4698 — "4698(S) A scheduled task was created." The same page's Event XML confirms the context field names: `<Data Name="SubjectUserName">` and `<Data Name="TaskName">`. Current (non-archived) cross-reference: https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/appendix-l--events-to-monitor — "4698 \| 602 \| Low \| A scheduled task was created." |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| extend TaskName = tostring(EventData.TaskName)</sub> | |
| 31 | `02-phase-threat-hunting.md:819` ▶ | \| sort by TimeGenerated desc | **OK** — vendor KQL reference (sort operator), https://learn.microsoft.com/en-us/kusto/query/sort-operator?view=microsoft-fabric — "`asc` sorts into ascending order, low to high. Default is `desc`, high to low." |
| | | <sub>↑ \| project TimeGenerated, Computer, CreatedBy, TaskName<br>↓ ```</sub> | |
| 32 | `02-phase-threat-hunting.md:837` ▶ | \| where TimeGenerated > start | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time." |
| | | <sub>↑ SecurityEvent<br>↓ \| where EventID == 4698</sub> | |
| 33 | `02-phase-threat-hunting.md:838` ▶ | \| where EventID == 4698 | **OK** — vendor event reference (Microsoft Learn, archived Windows 10 reference), https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4698 — "4698(S) A scheduled task was created." |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| extend TaskName = tostring(EventData.TaskName)</sub> | |
| 34 | `02-phase-threat-hunting.md:842` ▶ | \| where TaskLeaf has_any (namePatterns) | **OK** — vendor KQL reference (has_any operator), https://learn.microsoft.com/en-us/kusto/query/has-any-operator?view=microsoft-fabric — the documented let-statement form is exactly this: "let states = dynamic([...]); StormEvents \| where State has_any (states)". The context line `tostring(split(TaskName, "\\")[-1])` is also valid: `arr[(-1)]` — "Retrieves the last value in the array", https://learn.microsoft.com/en-us/kusto/query/scalar-data-types/dynamic?view=microsoft-fabric |
| | | <sub>↑ \| extend TaskLeaf = tostring(split(TaskName, "\\")[-1])<br>↓ \| project TimeGenerated, Computer, CreatedBy, TaskName</sub> | |
| 35 | `02-phase-threat-hunting.md:844` ▶ | \| sort by TimeGenerated desc | **OK** — vendor KQL reference (sort operator), https://learn.microsoft.com/en-us/kusto/query/sort-operator?view=microsoft-fabric — "`asc` sorts into ascending order, low to high. Default is `desc`, high to low." |
| | | <sub>↑ \| project TimeGenerated, Computer, CreatedBy, TaskName<br>↓ ```</sub> | |
| 36 | `02-phase-threat-hunting.md:858` ▶ | \| where TimeGenerated > start | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time." |
| | | <sub>↑ SecurityEvent<br>↓ \| where EventID == 4698</sub> | |
| 37 | `02-phase-threat-hunting.md:859` ▶ | \| where EventID == 4698 | **OK** — vendor event reference (Microsoft Learn, archived Windows 10 reference), https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4698 — "4698(S) A scheduled task was created." |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| extend TaskName = tostring(EventData.TaskName)</sub> | |
| 38 | `02-phase-threat-hunting.md:863` ▶ | \| where TaskLeaf has_any (dynamic(["updater", "update", "system", "svc", | **OK** — vendor KQL reference (has_any operator), https://learn.microsoft.com/en-us/kusto/query/has-any-operator?view=microsoft-fabric — the inline dynamic-array form is a documented example: "\| where State has_any (dynamic(['south', 'north']))". "Filters a record set for data with any set of case-insensitive strings." |
| | | <sub>↑ \| extend TaskLeaf = tostring(split(TaskName, "\\")[-1])<br>↓ "service", "win", "winlog", "ms",</sub> | |
| 39 | `02-phase-threat-hunting.md:869` ▶ | \| where TimeGenerated > start | **OK** — vendor KQL reference (ago function), https://learn.microsoft.com/en-us/kusto/query/ago-function?view=microsoft-fabric — "Subtracts the given timespan from the current UTC time." `TimeGenerated` is a real column of the `Event` table: "TimeGenerated \| datetime \| Date and time the record was created.", https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/event |
| | | <sub>↑ Event<br>↓ \| where Source == "Microsoft-Windows-Sysmon"</sub> | |
| 40 | `02-phase-threat-hunting.md:870` ▶ | \| where Source == "Microsoft-Windows-Sysmon" | **OK** — vendor table reference (Azure Monitor `Event` table), https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/event — "Source \| string \| Source of the event." **Caveat on the context line:** the same page types `EventData` as `string` — "All event data in raw format" — so the adjacent `tostring(EventData.Image)` relies on weak-typed JSON access rather than a documented dynamic accessor; the documented form is `parse_json(EventData).Image` |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| where EventID == 1</sub> | |
