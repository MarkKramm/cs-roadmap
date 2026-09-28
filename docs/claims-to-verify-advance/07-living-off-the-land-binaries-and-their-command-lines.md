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

# Living-off-the-land binaries and their command lines

| 1 | `01-phase-detection-at-scale.md:108` | \| “Why does this rule exclude `svchost.exe`?” — nobody knows \| The commit message says why, and links the ticket \| | |
| 2 | `01-phase-detection-at-scale.md:908` | \| A specific process path and parent \| `CcmExec.exe` spawning encoded PowerShell \| Yes — a verified benign pattern \| | |
| 3 | `01-phase-detection-at-scale.md:914` | The distinction is between suppressing a **behaviour** and suppressing a **subject**. Suppressing `CcmExec.exe` spawning an encoded command suppresses one specific behaviour. Suppressing a service account suppresses everything that account ever does, forever,  … | |
| 4 | `01-phase-detection-at-scale.md:1394` | **Why:** Suppressing `CcmExec.exe` spawning an encoded command removes one verified benign behaviour. Suppressing an account removes every future action of that account, including the thing the rule was built to catch — a permanent blind spot, not a tuning dec … | |
| 5 | `02-phase-threat-hunting.md:441` | **Hypothesis.** *If an adversary is using a signed Windows system binary to proxy execution of script content from a user-writable directory, we will see `rundll32.exe`, `regsvr32.exe`, or `mshta.exe` launched with an argument pointing into `AppData`, `Temp`,  … | |
| 6 | `02-phase-threat-hunting.md:472` | **`in~`** is the case-insensitive membership operator; `in` would miss `RUNDLL32.EXE`. On Windows filenames, always use the case-insensitive form. | |
| 7 | `02-phase-threat-hunting.md:476` | **`InitiatingProcessParentFileName`** is what turns a list of hits into a story. A `rundll32.exe` launched by `explorer.exe` after a user double-clicked a file is a different situation from one launched by `winword.exe` from a document. | |
| 8 | `02-phase-threat-hunting.md:739` | **The parent lookup is what makes this useful.** A process running from `%LOCALAPPDATA%` is mildly interesting. The same process, when its parent is `explorer.exe` and the user launched it, is a different answer from a parent of `services.exe`. The script reso … | |
| 9 | `02-phase-threat-hunting.md:1098` | **The third row is the one to reach for first.** Almost every noisy detection becomes precise when joined to a second condition that costs an adversary effort. `rundll32.exe` alone is noise. `rundll32.exe` spawned by `winword.exe` is a much sharper signal, and … | |
| 10 | `05-phase-adversary-emulation.md:144` | \| **Procedure** \| A specific implementation used by a specific actor or tool \| A macro that launches `powershell.exe -nop -w hidden -enc <base64>` \| | |
| 11 | `05-phase-adversary-emulation.md:148` | **A detection for the procedure is not a detection for the technique.** If you write a rule that fires on `powershell.exe` with `-enc` in the command line, you have detected one procedure. An attacker who runs `powershell.exe -Command "IEX (...)"` has used the … | |
| 12 | `05-phase-adversary-emulation.md:181` | **Step 5 is the step that makes this a measurement.** If you cannot write the hypothesis — "this technique should generate Sysmon event ID 1 with a parent process of `winword.exe`" — then you have no way to distinguish "the control failed" from "we never had t … | |
| 13 | `05-phase-adversary-emulation.md:580` | \| 1 \| T1059.001 PowerShell \| Execution \| Windows 10 \| Atomic T1059.001 #1 \| Sysmon 1 with `powershell.exe` and full command line \| Sysmon 1 present and correct \| **Partially detected** — recorded, no rule \| GAP-001 \| | |
| 14 | `05-phase-adversary-emulation.md:584` | \| 5 \| T1003.001 LSASS Memory \| Credential Access \| Windows 10 \| Atomic T1003.001 #1 \| Sysmon 10 with `lsass.exe` as target \| Sysmon 10 present, high volume, no rule \| **Partially detected** — noisy, needs scoping \| GAP-004 \| | |
| 15 | `05-phase-adversary-emulation.md:585` | \| 6 \| T1059.003 Windows Command Shell \| Execution \| Windows 10 \| Atomic T1059.003 #1 \| Sysmon 1 with `cmd.exe` \| Present, and a rule fired \| **Detected** \| — \| | |
| 16 | `05-phase-adversary-emulation.md:688` | **The parent-process selection is the discriminator.** `powershell.exe` alone fires constantly in any real environment. `powershell.exe` launched by `WINWORD.EXE` with an encoded command essentially does not. The emulation showed which field carried the signal … | |
| 17 | `05-phase-adversary-emulation.md:753` | \| GAP-004 \| T1003.001 \| Partially detected \| Sysmon 10 is recorded but the volume makes a naive rule unusable \| Detection engineering \| Scope to non-system processes accessing `lsass.exe` with `GrantedAccess` 0x1010 \| Medium \| Rule drafted \| 2026-04-2 … | |
| 18 | `05-phase-adversary-emulation.md:853` | \| `Image` \| `powershell.exe`, or whichever process the atomic used to write the value \| | |
| | | <sub>↑ \| `Details` \| The command the value points at — in this test, a path to a benign payload \|<br>↓ \| `User` \| `LAB-WIN10-01\emul-user` \|</sub> | |
| 19 | `07-phase-detection-as-code.md:1381` | **Why:** The second fixture runs `certutil.exe -p CRL -urlcache http://crl.example-ca.internal/root.crl`, which contains both `urlcache` and `http://`, so the rule fires exactly as designed — the phase stresses that this apparent negative is really a false pos … | |
