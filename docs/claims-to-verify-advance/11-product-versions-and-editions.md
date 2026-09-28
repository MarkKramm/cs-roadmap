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

# Product versions and editions

| 1 | `01-phase-detection-at-scale.md:781` | \| **PowerShell 4104** \| Script block logging \| Obfuscated and fileless PowerShell \| Free, needs policy \| | |
| | | <sub>↑ \| **Security 4720/4728/4732** \| Account and group changes \| Privilege escalation \| Free, built in \|<br>↓ \| **DNS query logs** \| Resolved names \| Beaconing, domain generation, exfiltration \| Often requires a licence \|</sub> | |
| 2 | `05-phase-adversary-emulation.md:580` | \| 1 \| T1059.001 PowerShell \| Execution \| Windows 10 \| Atomic T1059.001 #1 \| Sysmon 1 with `powershell.exe` and full command line \| Sysmon 1 present and correct \| **Partially detected** — recorded, no rule \| GAP-001 \| | |
| 3 | `05-phase-adversary-emulation.md:581` | \| 2 \| T1053.005 Scheduled Task \| Persistence \| Windows 10 \| Atomic T1053.005 #1 \| Security 4698, TaskScheduler operational \| Security 4698 present \| **Detected** — rule fired within 90s \| — \| | |
| 4 | `05-phase-adversary-emulation.md:582` | \| 3 \| T1547.001 Registry Run Keys \| Persistence \| Windows 10 \| Atomic T1547.001 #1 \| Sysmon 13 on `...\CurrentVersion\Run` \| Sysmon 13 present but filtered out by config \| **Not detected, telemetry present** \| GAP-002 \| | |
| 5 | `05-phase-adversary-emulation.md:583` | \| 4 \| T1136.001 Create Local Account \| Persistence \| Windows 10 \| Atomic T1136.001 #1 \| Security 4720 \| **No 4720 in the log — account auditing not enabled** \| **Not detected, no telemetry** \| GAP-003 \| | |
| 6 | `05-phase-adversary-emulation.md:584` | \| 5 \| T1003.001 LSASS Memory \| Credential Access \| Windows 10 \| Atomic T1003.001 #1 \| Sysmon 10 with `lsass.exe` as target \| Sysmon 10 present, high volume, no rule \| **Partially detected** — noisy, needs scoping \| GAP-004 \| | |
| 7 | `05-phase-adversary-emulation.md:585` | \| 6 \| T1059.003 Windows Command Shell \| Execution \| Windows 10 \| Atomic T1059.003 #1 \| Sysmon 1 with `cmd.exe` \| Present, and a rule fired \| **Detected** \| — \| | |
| 8 | `05-phase-adversary-emulation.md:772` | \| Platform \| Windows 10, host `LAB-WIN10-01`, isolated lab VLAN 90 \| | |
| | | <sub>↑ \| Tactic \| Persistence \|<br>↓ \| Atomic test \| Atomic Red Team T1547.001, registry run key variant \|</sub> | |
| 9 | `05-phase-adversary-emulation.md:1090` | **The Limitations section is not optional and it is not a formality.** An exercise that tests five techniques in an isolated lab on Windows 10 has measured five techniques, on Windows 10, in a lab. It has not measured the estate. Saying so is what makes the re … | |
| 10 | `05-phase-adversary-emulation.md:1098` ▶ | Windows 10 lab hosts with a fresh Sysmon configuration. It did not | |
| | | <sub>↑ This exercise measured detection coverage for five techniques on two<br>↓ measure:</sub> | |
