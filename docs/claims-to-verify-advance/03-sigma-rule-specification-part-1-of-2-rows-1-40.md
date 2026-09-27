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

# Sigma rule specification — rows 1–40 of this class

This is part 1 of 2. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 1 | `01-phase-detection-at-scale.md:154` ▶ | status: experimental | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "`experimental`: an experimental rule that could lead to false positives results or be noisy, but could also identify interesting events." (also `json-schema/sigma-detection-rule-schema.json`: `{"const": "experimental", "description": "A new rule that hasn't been tested outside of lab environments and could lead to many false positives"}`) |
| | | <sub>↑ id: 6c1a3f0e-6a5a-4c2f-9c2e-0d4d8b9e2a11<br>↓ description: ></sub> | |
| 2 | `01-phase-detection-at-scale.md:160` ▶ | references: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — the file-structure listing shows `references [optional]`, and the References section says "References to the sources that the rule was derived from. These could be blog articles, technical papers, presentations or even tweets." |
| | | <sub>↑ hunting input rather than a paging alert.<br>↓ - https://attack.mitre.org/techniques/T1059/001/</sub> | |
| 3 | `01-phase-detection-at-scale.md:163` ▶ | author: Your Name | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Author / **Attribute**: author / **Use:** optional / Creator of the rule. (can be a name, nickname, twitter handle...etc) If there is more than one, they are separated by a comma." |
| | | <sub>↑ - https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_powershell_exe<br>↓ date: 2026/03/14</sub> | |
| 4 | `01-phase-detection-at-scale.md:164` ▶ | date: 2026/03/14 | **WRONG** — the date must be ISO 8601 with `YYYY-MM-DD` dashes, so the value should be `date: 2026-03-14` — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Date / **Attribute**: date / **Use:** optional / Creation date of the rule. Use the ISO 8601 date with separator format : YYYY-MM-DD"; and the normative schema, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/json-schema/sigma-detection-rule-schema.json — `"date": { "type": "string", "description": "Creation date of the rule. Use the ISO 8601 format YYYY-MM-DD", "pattern": "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$" }` — `2026/03/14` does not match that pattern |
| | | <sub>↑ author: Your Name<br>↓ modified: 2026/03/14</sub> | |
| 5 | `01-phase-detection-at-scale.md:166` ▶ | logsource: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### LogSource / **Attribute**: logsource / **Use:** mandatory" |
| | | <sub>↑ modified: 2026/03/14<br>↓ category: process_creation</sub> | |
| 6 | `01-phase-detection-at-scale.md:169` ▶ | detection: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Detection / **Attribute**: detection / **Use:** mandatory / A set of search-identifiers that represent properties of searches on log data." |
| | | <sub>↑ product: windows<br>↓ selection_image:</sub> | |
| 7 | `01-phase-detection-at-scale.md:179` ▶ | condition: selection_image and selection_encoded | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Condition / **Attribute**: condition / **Use:** mandatory" and the expression list includes "Logical AND/OR / `keywords1 or keywords2`"; also "Operator Precedence (least to most binding): or, and, not, x of search-identifier, ( expression )" |
| | | <sub>↑ - '-ec '<br>↓ fields:</sub> | |
| 8 | `01-phase-detection-at-scale.md:180` ▶ | fields: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Fields / **Attribute**: fields / **Use:** optional / A list of log fields that could be interesting in further analysis of the event and should be displayed to the analyst." |
| | | <sub>↑ condition: selection_image and selection_encoded<br>↓ - CommandLine</sub> | |
| 9 | `01-phase-detection-at-scale.md:186` ▶ | falsepositives: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### FalsePositives / **Attribute**: falsepositives / **Use:** optional / A list of known false positives that may occur." |
| | | <sub>↑ - Image<br>↓ - Software deployment and configuration management tools</sub> | |
| 10 | `01-phase-detection-at-scale.md:208` | `status: experimental` is doing real work in that rule. It is an honest statement that the rule has been written but not yet validated against production traffic. A rule that goes straight to production with no such stage is a rule nobody has agreed to live wi … | **OK** — the standard itself (JSON schema, the normative machine-readable part of the spec), https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/json-schema/sigma-detection-rule-schema.json — `{"const": "experimental", "description": "A new rule that hasn't been tested outside of lab environments and could lead to many false positives"}`, which supports the "written but not yet validated" reading; the closing remark about what a team has agreed to live with is the author's commentary, not a spec claim |
| 11 | `01-phase-detection-at-scale.md:744` ▶ | references: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### References / **Attribute**: reference / **Use:** optional / References to the sources that the rule was derived from." |
| | | <sub>↑ on it. This is a telemetry-integrity detection, not a threat detection.<br>↓ - https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon</sub> | |
| 12 | `01-phase-detection-at-scale.md:746` ▶ | author: Your Name | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Author / **Attribute**: author / **Use:** optional / Creator of the rule. (can be a name, nickname, twitter handle...etc)" |
| | | <sub>↑ - https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon<br>↓ date: 2026/03/22</sub> | |
| 13 | `01-phase-detection-at-scale.md:747` ▶ | date: 2026/03/22 | **WRONG** — the date must be ISO 8601 with `YYYY-MM-DD` dashes, so the value should be `date: 2026-03-22` — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "Creation date of the rule. Use the ISO 8601 date with separator format : YYYY-MM-DD"; the normative schema, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/json-schema/sigma-detection-rule-schema.json — `"date": { "description": "Creation date of the rule. Use the ISO 8601 format YYYY-MM-DD", "pattern": "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$" }` — `2026/03/22` fails the pattern |
| | | <sub>↑ author: Your Name<br>↓ logsource:</sub> | |
| 14 | `01-phase-detection-at-scale.md:748` ▶ | logsource: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### LogSource / **Attribute**: logsource / **Use:** mandatory"; `product: windows` and `service: sysmon` are both documented members: "product - examples: windows, apache, check point fw1" and "service - examples: sshd, applocker" |
| | | <sub>↑ date: 2026/03/22<br>↓ product: windows</sub> | |
| 15 | `01-phase-detection-at-scale.md:751` ▶ | detection: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Detection / **Attribute**: detection / **Use:** mandatory / A set of search-identifiers that represent properties of searches on log data." |
| | | <sub>↑ service: sysmon<br>↓ selection:</sub> | |
| 16 | `01-phase-detection-at-scale.md:755` ▶ | condition: selection | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Condition / **Attribute**: condition / **Use:** mandatory" and the spec's own example uses the single-identifier form: `detection: selection: EventLog: Security ... condition: selection` |
| | | <sub>↑ State: 'Stopped'<br>↓ fields:</sub> | |
| 17 | `01-phase-detection-at-scale.md:756` ▶ | fields: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Fields / **Attribute**: fields / **Use:** optional / A list of log fields that could be interesting in further analysis of the event and should be displayed to the analyst." |
| | | <sub>↑ condition: selection<br>↓ - Computer</sub> | |
| 18 | `01-phase-detection-at-scale.md:760` ▶ | falsepositives: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### FalsePositives / **Attribute**: falsepositives / **Use:** optional / A list of known false positives that may occur." |
| | | <sub>↑ - User<br>↓ - Deliberate maintenance or upgrade by the endpoint team</sub> | |
| 19 | `01-phase-detection-at-scale.md:846` ▶ | detection: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Detection / **Attribute**: detection / **Use:** mandatory"; the fragment shown is a legal `detection:` map of named selections (`selection_image`, `selection_encoded`) with a `condition`, matching the spec's "Maps (or dictionaries) consist of key/value pairs" |
| | | <sub>↑ ```yaml<br>↓ selection_image:</sub> | |
| 20 | `01-phase-detection-at-scale.md:851` ▶ | condition: selection_image and selection_encoded | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Condition / **Attribute**: condition / **Use:** mandatory" with supported "Logical AND/OR"; the `Image|endswith` and `CommandLine|contains` modifiers used above it are documented in the modifiers appendix, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-appendix-modifiers.md — "`endswith`: The value is expected at the end of the field's content" and "`contains`: Puts `*` wildcards around the values" |
| | | <sub>↑ CommandLine\|contains: '-enc'<br>↓ ```</sub> | |
| 21 | `01-phase-detection-at-scale.md:869` ▶ | detection: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Detection / **Attribute**: detection / **Use:** mandatory"; the list-of-maps form used here is the spec's own shape: "Example for list of maps: ... selection: - Image\|endswith: '\\\\example.exe' - Description\|contains: 'Test executable'" |
| | | <sub>↑ ```yaml<br>↓ selection_image:</sub> | |
| 22 | `01-phase-detection-at-scale.md:890` ▶ | condition: selection_image and selection_encoded | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — the condition section documents "Negation with 'not' / `keywords and not filters`" and "Operator Precedence (least to most binding) - or - and - not - x of search-identifier - ( expression )", which is exactly the form used by the continued line `and not filter_sccm and not filter_intune and not filter_backup` |
| | | <sub>↑ CommandLine\|contains: '-enc JABzAD0A'<br>↓ and not filter_sccm and not filter_intune and not filter_backup</sub> | |
| 23 | `02-phase-threat-hunting.md:55` | - From finding to detection: rule logic, tuning, false-positive rate, and ownership | **UNVERIFIABLE** — a phase-contents table of contents, not a claim about the world; no source can confirm or deny which topics a curriculum phase covers |
| | | <sub>↑ - The hunt document: a template with fixed fields<br>↓ - Hunt metrics: what to measure, and what measuring hunts badly does to a team</sub> | |
| 24 | `02-phase-threat-hunting.md:472` | **`in~`** is the case-insensitive membership operator; `in` would miss `RUNDLL32.EXE`. On Windows filenames, always use the case-insensitive form. | **OK** — the vendor's own language reference, https://learn.microsoft.com/en-us/kusto/query/in-operator — operator table: "| `in` | Equals to any of the elements | **Yes** (case-sensitive) |" and "| `in~` | Equals to any of the elements | **No** (case-insensitive) |", plus "Case-insensitive operators are currently supported only for ASCII-text." (This is KQL, not Sigma — the claim sits in a Sentinel query block, and the "always use the case-insensitive form" is a house rule, not spec text.) |
| 25 | `02-phase-threat-hunting.md:474` | **`has_any`** is a term-level match that respects word boundaries and is much faster than `contains`. For path fragments with backslashes, the verbatim string literal `@"...\"` avoids escaping confusion. | **OK** — the vendor's own language reference, https://learn.microsoft.com/en-us/kusto/query/has-any-operator — "`has_any` searches for indexed terms, where an indexed term is three or more characters. If your term is fewer than three characters, the query scans the values in the column, which is slower than looking up the term in the term index." (The `@"..."` verbatim-literal advice is a KQL idiom; I did not open the separate string-literal page, so treat that half as unverified.) |
| 26 | `02-phase-threat-hunting.md:558` ▶ | status: experimental | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — the Status section lists exactly five values, of which "`experimental`: an experimental rule that could lead to false positives results or be noisy, but could also identify interesting events." |
| | | <sub>↑ id: 4f2a9c31-7b6e-4d18-9c05-8e0a1d2f3b47<br>↓ description: Detects rundll32, regsvr32 or mshta launched with an argument</sub> | |
| 27 | `02-phase-threat-hunting.md:561` ▶ | references: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### References / **Attribute**: reference / **Use:** optional"; a URL list is the canonical form shown in the spec's own example rule (https://speakerdeck.com/…) |
| | | <sub>↑ pointing into a user-writable directory, consistent with T1218 proxy execution.<br>↓ - https://attack.mitre.org/techniques/T1218/</sub> | |
| 28 | `02-phase-threat-hunting.md:563` ▶ | author: Your Name | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Author / **Attribute**: author / **Use:** optional / Creator of the rule. (can be a name, nickname, twitter handle...etc)" |
| | | <sub>↑ - https://attack.mitre.org/techniques/T1218/<br>↓ date: 2026/04/06</sub> | |
| 29 | `02-phase-threat-hunting.md:564` ▶ | date: 2026/04/06 | **WRONG** — the date must be ISO 8601 with `YYYY-MM-DD` dashes, so the value should be `date: 2026-04-06` — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "Creation date of the rule. Use the ISO 8601 date with separator format : YYYY-MM-DD"; the normative schema, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/json-schema/sigma-detection-rule-schema.json — `"pattern": "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$"` |
| | | <sub>↑ author: Your Name<br>↓ tags:</sub> | |
| 30 | `02-phase-threat-hunting.md:570` ▶ | logsource: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### LogSource / **Attribute**: logsource / **Use:** mandatory"; the taxonomy appendix documents this exact pairing, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-appendix-taxonomy.md — "category : process_creation / product : windows" |
| | | <sub>↑ - attack.t1218.005<br>↓ category: process_creation</sub> | |
| 31 | `02-phase-threat-hunting.md:573` ▶ | detection: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Detection / **Attribute**: detection / **Use:** mandatory" |
| | | <sub>↑ product: windows<br>↓ selection_image:</sub> | |
| 32 | `02-phase-threat-hunting.md:586` ▶ | condition: selection_image and selection_path | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Condition / **Attribute**: condition / **Use:** mandatory" and the "Logical AND/OR" expression `keywords1 or keywords2` establishes identifier-to-identifier boolean composition; the claim at line 597 that `1 of selection_*` would be broader is consistent with the spec's "1 of them means that one of the defined search identifiers must appear" |
| | | <sub>↑ - '\Users\Public\'<br>↓ falsepositives:</sub> | |
| 33 | `02-phase-threat-hunting.md:587` ▶ | falsepositives: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### FalsePositives / **Attribute**: falsepositives / **Use:** optional / A list of known false positives that may occur." |
| | | <sub>↑ condition: selection_image and selection_path<br>↓ - Software installers that register components from a per-user directory</sub> | |
| 34 | `05-phase-adversary-emulation.md:638` ▶ | status: experimental | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "`experimental`: an experimental rule that could lead to false positives results or be noisy, but could also identify interesting events." The SigmaHQ convention additionally mandates it as the starting value: https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/sigmahq/sigmahq-rule-convention.md — "All newly created rules must start with a status of `experimental`" |
| | | <sub>↑ id: 8b1d0f3c-5e42-4a91-9c07-2f6ab3d81e55<br>↓ description: \|</sub> | |
| 35 | `05-phase-adversary-emulation.md:645` ▶ | references: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### References / **Attribute**: reference / **Use:** optional / References to the sources that the rule was derived from." Note the SigmaHQ repo convention is stricter than the spec here: https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/sigmahq/sigmahq-rule-convention.md — "References to the MITRE ATT&CK website are not allowed. Instead they should be expressed as tags using the appropriate MITRE tags." These ATT&CK URLs are legal Sigma but would be rejected by the SigmaHQ repository — a convention, not a spec violation. |
| | | <sub>↑ reliable discriminator between administrative and malicious use.<br>↓ - https://attack.mitre.org/techniques/T1059/001/</sub> | |
| 36 | `05-phase-adversary-emulation.md:648` ▶ | author: Your Name | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Author / **Attribute**: author / **Use:** optional / Creator of the rule. (can be a name, nickname, twitter handle...etc)" |
| | | <sub>↑ - https://attack.mitre.org/techniques/T1204/002/<br>↓ date: 2026/04/08</sub> | |
| 37 | `05-phase-adversary-emulation.md:649` ▶ | date: 2026/04/08 | **WRONG** — the date must be ISO 8601 with `YYYY-MM-DD` dashes, so the value should be `date: 2026-04-08` — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "Creation date of the rule. Use the ISO 8601 date with separator format : YYYY-MM-DD"; the normative schema, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/json-schema/sigma-detection-rule-schema.json — `"pattern": "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$"` |
| | | <sub>↑ author: Your Name<br>↓ logsource:</sub> | |
| 38 | `05-phase-adversary-emulation.md:650` ▶ | logsource: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### LogSource / **Attribute**: logsource / **Use:** mandatory"; the taxonomy appendix documents `category : process_creation` + `product : windows` as the generic process-creation log source, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-appendix-taxonomy.md |
| | | <sub>↑ date: 2026/04/08<br>↓ category: process_creation</sub> | |
| 39 | `05-phase-adversary-emulation.md:653` ▶ | detection: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Detection / **Attribute**: detection / **Use:** mandatory"; three named selections (`selection_parent`, `selection_child`, `selection_flags`) are the spec's search-identifier form |
| | | <sub>↑ product: windows<br>↓ selection_parent:</sub> | |
| 40 | `05-phase-adversary-emulation.md:674` ▶ | condition: selection_parent and selection_child and selection_flags | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Condition / **Attribute**: condition / **Use:** mandatory" with "Logical AND/OR" and precedence "or / and / not / x of search-identifier / ( expression )" |
| | | <sub>↑ - 'FromBase64String'<br>↓ falsepositives:</sub> | |
