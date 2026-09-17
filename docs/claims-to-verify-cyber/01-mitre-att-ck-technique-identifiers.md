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

# MITRE ATT&CK technique identifiers


*A technique ID resolves to one entry in a versioned, published matrix. The ID and its technique name are both fixed, and the matrix is renumbered between versions.*

**Source to check against:** The MITRE ATT&CK matrix for the named technique ID

34 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-foundations.md:502` | \| **Technique** \| A specific way of achieving that goal \| **T1566 Phishing** under the Initial Access tactic \| | |
| 2 | `01-phase-foundations.md:504` | When you see a phishing email, mapping it to T1566 joins your observation to a global, consistent vocabulary. That is why one of this phase's practice tasks is to pick five techniques and explain them. | |
| 3 | `01-phase-foundations.md:676` | \| Initial Access \| Phishing (T1566) \| Get a foothold by convincing a user to act \| Mail filters, user reports, suspicious sender domains \| | |
| 4 | `03-phase-security-fundamentals.md:387` | That last row introduces **masquerading** — naming a malicious file after a legitimate system process to blend in. It is a MITRE ATT&CK technique (T1036). | |
| 5 | `03-phase-security-fundamentals.md:875` | \| 02:14:03 \| Phishing email delivered to `j.dela+cruz@example.com` \| Mail gateway log \| Initial access attempt (ATT&CK T1566) \| | |
| 6 | `03-phase-security-fundamentals.md:890` | \| ATT&CK T1566 mapping \| Phase 1 \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Event IDs 4624 and 4688, logon types 3 and 10 \| Part 1 \|</sub> | |
| 7 | `04-phase-hands-on-labs.md:494` ▶ | <id>T1110</id> | |
| | | <sub>↑ <mitre><br>↓ </mitre></sub> | |
| 8 | `04-phase-hands-on-labs.md:506` | - **`mitre`** — maps the detection to **T1110, Brute Force** in MITRE ATT&CK. Phase 1 introduced ATT&CK as a shared vocabulary; this is what using it looks like in practice. It means an analyst who sees this alert immediately knows what class of behaviour it r … | |
| 9 | `10-phase-detection-engineering.md:152` | **T1059.001 — Command and Scripting Interpreter: PowerShell.** | |
| 10 | `10-phase-detection-engineering.md:508` | **ATT&CK T1543.003 — Create or Modify System Process: Windows Service.** | |
| 11 | `10-phase-detection-engineering.md:553` ▶ | - https://attack.mitre.org/techniques/T1059/001/ | |
| | | <sub>↑ references:<br>↓ author: Your Name</sub> | |
| 12 | `10-phase-detection-engineering.md:633` ▶ | <id>T1059.001</id> | |
| | | <sub>↑ <mitre><br>↓ </mitre></sub> | |
| 13 | `10-phase-detection-engineering.md:735` ▶ | Invoke-AtomicTest T1543.003 -ShowDetailsBrief | |
| | | <sub>↑ # List the atomic tests for one technique, without running anything.</sub> | |
| 14 | `10-phase-detection-engineering.md:738` ▶ | Invoke-AtomicTest T1543.003 -TestNumbers 1 | |
| | | <sub>↑ # Run one test.</sub> | |
| 15 | `10-phase-detection-engineering.md:741` ▶ | Invoke-AtomicTest T1543.003 -TestNumbers 1 -Cleanup | |
| | | <sub>↑ # Clean up after the test, which also tests your rule's noise profile.<br>↓ ```</sub> | |
| 16 | `10-phase-detection-engineering.md:757` ▶ | ATT&CK T1059.001 | |
| | | <sub>↑ Title Encoded PowerShell outside known management tools</sub> | |
| 17 | `10-phase-detection-engineering.md:760` ▶ | Command Invoke-AtomicTest T1059.001 -TestNumbers 1 | |
| | | <sub>↑ True positive test<br>↓ Result Rule fired 4 seconds after execution</sub> | |
| 18 | `10-phase-detection-engineering.md:848` | A learner writes a rule for T1110, brute force: alert when more than five failed logons occur for one account within five minutes. | |
| 19 | `10-phase-detection-engineering.md:909` | \| **Technique** \| *How* they achieve the goal \| T1059 Command and Scripting Interpreter \| | |
| | | <sub>↑ \| **Tactic** \| The attacker's goal — the *why* \| Execution, Persistence, Credential Access \|<br>↓ \| **Sub-technique** \| A specific variant \| T1059.001 PowerShell \|</sub> | |
| 20 | `10-phase-detection-engineering.md:910` | \| **Sub-technique** \| A specific variant \| T1059.001 PowerShell \| | |
| | | <sub>↑ \| **Technique** \| *How* they achieve the goal \| T1059 Command and Scripting Interpreter \|<br>↓ \| **Procedure** \| The specific implementation an actor used \| `powershell.exe -enc <base64>` in a macro \|</sub> | |
| 21 | `10-phase-detection-engineering.md:919` | \| "We detect T1059.001" \| "We detect T1059.001 via the encoded-command procedure. Non-encoded PowerShell is not covered by this rule and is covered only by process-creation logging." \| | |
| 22 | `10-phase-detection-engineering.md:920` | \| "T1059 — covered" \| "T1059 partially covered by one sub-technique. T1059.003 (Windows Command Shell) is not covered." \| | |
| 23 | `10-phase-detection-engineering.md:931` | \| Initial Access \| T1566 Phishing \| .001 Attachment \| — \| **None** \| No email gateway feed into the SIEM \| | |
| 24 | `10-phase-detection-engineering.md:932` | \| Execution \| T1059 \| .001 PowerShell \| DET-003 \| Partial \| Encoded only; plain PowerShell not covered \| | |
| 25 | `10-phase-detection-engineering.md:933` | \| Execution \| T1059 \| .003 Windows Command Shell \| — \| **None** \| Planned, low priority \| | |
| | | <sub>↑ \| Execution \| T1059 \| .001 PowerShell \| DET-003 \| Partial \| Encoded only; plain PowerShell not covered \|<br>↓ \| Persistence \| T1543 \| .003 Windows Service \| DET-001 \| **Good** \| Signature checks not yet implemented \|</sub> | |
| 26 | `10-phase-detection-engineering.md:934` | \| Persistence \| T1543 \| .003 Windows Service \| DET-001 \| **Good** \| Signature checks not yet implemented \| | |
| 27 | `10-phase-detection-engineering.md:935` | \| Persistence \| T1053 \| .005 Scheduled Task \| DET-006 \| Partial \| Linux cron covered; Windows tasks partial \| | |
| 28 | `10-phase-detection-engineering.md:936` | \| Persistence \| T1136 \| .001 Local Account \| DET-002 \| **Good** \| Requires correlation with the group-change rule \| | |
| 29 | `10-phase-detection-engineering.md:937` | \| Privilege Escalation \| T1098 \| .001 Account Manipulation \| DET-002 \| **Good** \| — \| | |
| | | <sub>↑ \| Persistence \| T1136 \| .001 Local Account \| DET-002 \| **Good** \| Requires correlation with the group-change rule \|<br>↓ \| Credential Access \| T1003 \| .001 LSASS Memory \| DET-004 \| Partial \| Heavily filtered; a documented bypass exists \|</sub> | |
| 30 | `10-phase-detection-engineering.md:938` | \| Credential Access \| T1003 \| .001 LSASS Memory \| DET-004 \| Partial \| Heavily filtered; a documented bypass exists \| | |
| 31 | `10-phase-detection-engineering.md:939` | \| Discovery \| T1087 \| .001 Account Discovery \| — \| **None** \| Not detected \| | |
| | | <sub>↑ \| Credential Access \| T1003 \| .001 LSASS Memory \| DET-004 \| Partial \| Heavily filtered; a documented bypass exists \|<br>↓ \| Command and Control \| T1071 \| .001 Web Protocols \| DET-008 \| Partial \| DNS-based only \|</sub> | |
| 32 | `10-phase-detection-engineering.md:940` | \| Command and Control \| T1071 \| .001 Web Protocols \| DET-008 \| Partial \| DNS-based only \| | |
| | | <sub>↑ \| Discovery \| T1087 \| .001 Account Discovery \| — \| **None** \| Not detected \|<br>↓ \| Exfiltration \| T1041 \| — \| — \| **None** \| No egress anomaly baseline \|</sub> | |
| 33 | `10-phase-detection-engineering.md:941` | \| Exfiltration \| T1041 \| — \| — \| **None** \| No egress anomaly baseline \| | |
| | | <sub>↑ \| Command and Control \| T1071 \| .001 Web Protocols \| DET-008 \| Partial \| DNS-based only \|</sub> | |
| 34 | `10-phase-detection-engineering.md:991` ▶ | ATT&CK T1059.001 | |
| | | <sub>↑ Level High<br>↓ Author / date Your Name, 2026-03-11</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._
