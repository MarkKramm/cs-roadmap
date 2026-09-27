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

# Sigma rule specification — rows 41–65 of this class

This is part 2 of 2. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 41 | `05-phase-adversary-emulation.md:675` ▶ | falsepositives: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### FalsePositives / **Attribute**: falsepositives / **Use:** optional / A list of known false positives that may occur." |
| | | <sub>↑ condition: selection_parent and selection_child and selection_flags<br>↓ - A signed Office add-in that legitimately calls a script host</sub> | |
| 42 | `05-phase-adversary-emulation.md:908` ▶ | status: experimental | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "`experimental`: an experimental rule that could lead to false positives results or be noisy, but could also identify interesting events." |
| | | <sub>↑ id: 3c9a71e0-2d84-4f16-b0a5-6e1c9d5a7f22<br>↓ description: \|</sub> | |
| 43 | `05-phase-adversary-emulation.md:914` ▶ | references: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### References / **Attribute**: reference / **Use:** optional" |
| | | <sub>↑ was being dropped by configuration before any rule could see it.<br>↓ - https://attack.mitre.org/techniques/T1547/001/</sub> | |
| 44 | `05-phase-adversary-emulation.md:916` ▶ | author: Your Name | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Author / **Attribute**: author / **Use:** optional / Creator of the rule. (can be a name, nickname, twitter handle...etc)" |
| | | <sub>↑ - https://attack.mitre.org/techniques/T1547/001/<br>↓ date: 2026/04/09</sub> | |
| 45 | `05-phase-adversary-emulation.md:917` ▶ | date: 2026/04/09 | **WRONG** — the date must be ISO 8601 with `YYYY-MM-DD` dashes, so the value should be `date: 2026-04-09` — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "Creation date of the rule. Use the ISO 8601 date with separator format : YYYY-MM-DD"; the normative schema, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/json-schema/sigma-detection-rule-schema.json — `"pattern": "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$"` |
| | | <sub>↑ author: Your Name<br>↓ logsource:</sub> | |
| 46 | `05-phase-adversary-emulation.md:918` ▶ | logsource: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### LogSource / **Attribute**: logsource / **Use:** mandatory"; `category` and `product` are both documented members and "The `category`, `product` and `service` can be used alone or in any combination." `registry_set` is a SigmaHQ-defined category in the taxonomy appendix, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-appendix-taxonomy.md |
| | | <sub>↑ date: 2026/04/09<br>↓ category: registry_set</sub> | |
| 47 | `05-phase-adversary-emulation.md:921` ▶ | detection: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### Detection / **Attribute**: detection / **Use:** mandatory" |
| | | <sub>↑ product: windows<br>↓ selection:</sub> | |
| 48 | `05-phase-adversary-emulation.md:937` ▶ | condition: selection and not filter_installers and not filter_signed_paths | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — the Condition section documents "Negation with 'not' / `keywords and not filters`" and precedence "or, and, not, x of search-identifier, ( expression )", which is this exact shape |
| | | <sub>↑ - '\Program Files (x86)\'<br>↓ falsepositives:</sub> | |
| 49 | `05-phase-adversary-emulation.md:938` ▶ | falsepositives: | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "### FalsePositives / **Attribute**: falsepositives / **Use:** optional / A list of known false positives that may occur." |
| | | <sub>↑ condition: selection and not filter_installers and not filter_signed_paths<br>↓ - User-installed portable applications that write a Run key</sub> | |
| 50 | `06-phase-programme-and-influence.md:571` ▶ | Decision date: 14 April 2026 | **UNVERIFIABLE** — a field inside the phase's own fictional programme-decision record (a worked artefact for the reader to fill in), not a claim about Sigma or about the world; there is no external source that could settle it |
| | | <sub>↑ Decided by: Head of Infrastructure, 14 April 2026</sub> | |
| 51 | `06-phase-programme-and-influence.md:673` ▶ | Review date: 1 November 2026, or on a change of either role holder. | **UNVERIFIABLE** — a field inside the phase's own template RACI/governance block; a chosen local review date, not a fact about the world |
| | | <sub>↑ Effective: 1 May 2026<br>↓ ```</sub> | |
| 52 | `06-phase-programme-and-influence.md:759` ▶ | Review date: 30 June 2026 (hard expiry — see Expiry) | **UNVERIFIABLE** — a field inside the phase's own template risk-acceptance memo; a scenario date, not a claim about the world |
| | | <sub>↑ Risk owner: Head of Infrastructure<br>↓ Register entry: RISK-0142, "Untested tier-1 recovery capability"</sub> | |
| 53 | `07-phase-detection-as-code.md:256` ▶ | status: experimental | **OK** — the standard itself, https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/specification/sigma-rules-specification.md — "`experimental`: an experimental rule that could lead to false positives results or be noisy, but could also identify interesting events." |
| | | <sub>↑ id: 3f7b2c91-84ae-4d16-9a05-1e6c8b7d4a52<br>↓ description: ></sub> | |
| 54 | `07-phase-detection-as-code.md:261` ▶ | references: | |
| | | <sub>↑ browser or a scripting host.<br>↓ - https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/certutil</sub> | |
| 55 | `07-phase-detection-as-code.md:263` ▶ | author: Your Name | |
| | | <sub>↑ - https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/certutil<br>↓ date: 2026-05-04</sub> | |
| 56 | `07-phase-detection-as-code.md:264` ▶ | date: 2026-05-04 | |
| | | <sub>↑ author: Your Name<br>↓ modified: 2026-05-04</sub> | |
| 57 | `07-phase-detection-as-code.md:266` ▶ | logsource: | |
| | | <sub>↑ modified: 2026-05-04<br>↓ category: process_creation</sub> | |
| 58 | `07-phase-detection-as-code.md:269` ▶ | detection: | |
| | | <sub>↑ product: windows<br>↓ selection_image:</sub> | |
| 59 | `07-phase-detection-as-code.md:277` ▶ | condition: selection_image and selection_download | |
| | | <sub>↑ - 'https://'<br>↓ fields:</sub> | |
| 60 | `07-phase-detection-as-code.md:278` ▶ | fields: | |
| | | <sub>↑ condition: selection_image and selection_download<br>↓ - CommandLine</sub> | |
| 61 | `07-phase-detection-as-code.md:282` ▶ | falsepositives: | |
| | | <sub>↑ - User<br>↓ - Administrators or configuration management scripts that retrieve</sub> | |
| 62 | `07-phase-detection-as-code.md:304` | `status: experimental` is doing real work in that rule. Per the Sigma specification, the status values are `stable`, `test`, `experimental`, `deprecated`, and `unsupported`, and `experimental` is an honest statement that this has not been validated against you … | |
| 63 | `07-phase-detection-as-code.md:751` ▶ | condition: selection_image and selection_download | |
| | | <sub>↑ selection_download: CommandLine contains urlcache OR http:// OR https://</sub> | |
| 64 | `07-phase-detection-as-code.md:939` ▶ | logsource: | |
| | | <sub>↑ agent, which triggers several process creation rules legitimately.<br>↓ category: process_creation</sub> | |
| 65 | `07-phase-detection-as-code.md:948` ▶ | condition: selection | |
| | | <sub>↑ ParentImage\|endswith: '\cfgmgmt-agent.exe'<br>↓ ```</sub> | |
