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

# Windows event IDs, channels and field names

| 1 | `01-phase-detection-at-scale.md:222` ▶ | - Sysmon Event ID 1, or Windows Security Event ID 4688 with | |
| | | <sub>↑ telemetry_required:<br>↓ "Include command line in process creation events" enabled</sub> | |
| 2 | `01-phase-detection-at-scale.md:722` ▶ | Alternative Windows Security Event ID 4688 with command-line | |
| | | <sub>↑ Requires Sysmon Event ID 1 (process creation, with command line)<br>↓ auditing enabled via policy</sub> | |
| 3 | `01-phase-detection-at-scale.md:778` | \| **Security 4688** \| Process creation \| The same as Sysmon 1, where Sysmon is absent \| Free, needs policy \| | |
| 4 | `01-phase-detection-at-scale.md:1302` | \| Sysmon \| Windows process, network, and file telemetry \| Free \| https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon \| Install Sysmon with a community config and confirm Event ID 1 is generated \| Windows Security Event ID 4688 with command-li … | |
| 5 | `01-phase-detection-at-scale.md:1321` | - Windows security auditing event 4688 reference — https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4688 | |
| 6 | `02-phase-threat-hunting.md:192` | \| **A named data source** \| System 7045, Security 4624 \| If you do not know the source, you cannot know whether you collect it \| | |
| 7 | `02-phase-threat-hunting.md:216` ▶ | we will see System event 7045 on the target host, with a | |
| | | <sub>↑ service creation on our Windows estate in the last 90 days,<br>↓ Security 4624 type 3 logon from the source host within the</sub> | |
| 8 | `02-phase-threat-hunting.md:225` ▶ | Data required Windows System log, event 7045 | |
| | | <sub>↓ Windows Security log, event 4624 (type 3)</sub> | |
| 9 | `02-phase-threat-hunting.md:226` ▶ | Windows Security log, event 4624 (type 3) | |
| | | <sub>↑ Data required Windows System log, event 7045<br>↓ Host role inventory (which hosts are management servers)</sub> | |
| 10 | `02-phase-threat-hunting.md:333` | \| T1053.005 Scheduled Task \| Security 4698, Sysmon 1/11 \| Yes — DET-118 \| Never \| | |
| | | <sub>↑ \|---\|---\|---\|---\|<br>↓ \| T1059.001 PowerShell \| Script block logging, EDR process events \| Yes — DET-042 \| 2025-11 \|</sub> | |
| 11 | `02-phase-threat-hunting.md:448` ▶ | // Hunt HUNT-2026-021 — T1218 System Binary Proxy Execution | |
| | | <sub>↑ ```kql<br>↓ // Defender XDR advanced hunting. DeviceProcessEvents holds endpoint</sub> | |
| 12 | `02-phase-threat-hunting.md:762` ▶ | Data needed Security 4698 (task created), Sysmon 1 (process creation), | |
| | | <sub>↑ ATT&CK T1053.005 — Scheduled Task/Job: Scheduled Task<br>↓ Sysmon 11 (file created), the change-management export</sub> | |
| 13 | `02-phase-threat-hunting.md:993` ▶ | 03:41 on 2026-02-11 invoked a hidden PowerShell download | |
| | | <sub>↑ Positive result A scheduled task created by svc_deploy on WKS-0221 at<br>↓ cradle. Three hosts scoped, tasks removed, credentials</sub> | |
| 14 | `02-phase-threat-hunting.md:1065` ▶ | Logic Security 4698 within 5 minutes of Sysmon 1, same host, where | |
| | | <sub>↓ the process is a script interpreter or runs from a</sub> | |
| 15 | `05-phase-adversary-emulation.md:581` | \| 2 \| T1053.005 Scheduled Task \| Persistence \| Windows 10 \| Atomic T1053.005 #1 \| Security 4698, TaskScheduler operational \| Security 4698 present \| **Detected** — rule fired within 90s \| — \| | |
| 16 | `05-phase-adversary-emulation.md:1007` ▶ | account should generate Windows Security event ID 4720, and a rule should | |
| | | <sub>↑ Before execution we wrote the following hypothesis: "Creating a local<br>↓ exist to alert on it."</sub> | |
| 17 | `05-phase-adversary-emulation.md:1013` ▶ | No event ID 4720 was recorded in the Security log for the window. | |
| | | <sub>↑ Get-LocalUser \| Format-Table Name, Enabled, LastLogon<br>↓ We then checked whether event ID 4720 is generated at all on this host:</sub> | |
| 18 | `05-phase-adversary-emulation.md:1014` ▶ | We then checked whether event ID 4720 is generated at all on this host: | |
| | | <sub>↑ No event ID 4720 was recorded in the Security log for the window.</sub> | |
| 19 | `05-phase-adversary-emulation.md:1040` ▶ | event ID 4732 from the same policy area. | |
| | | <sub>↑ reason — adding an account to Administrators is T1098, and it generates</sub> | |
| 20 | `05-phase-adversary-emulation.md:1044` ▶ | scheduled to land, and confirm that event ID 4720 is generated and that | |
| | | <sub>↑ We will re-run T1136.001 on 2026-05-06, ten days after the change is<br>↓ the planned rule fires. We will send the result whether it passes or not.</sub> | |
