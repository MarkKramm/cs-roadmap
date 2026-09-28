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

# Security tool commands and flags

| 1 | `02-phase-threat-hunting.md:441` | **Hypothesis.** *If an adversary is using a signed Windows system binary to proxy execution of script content from a user-writable directory, we will see `rundll32.exe`, `regsvr32.exe`, or `mshta.exe` launched with an argument pointing into `AppData`, `Temp`,  … | |
| 2 | `02-phase-threat-hunting.md:1265` | \| osquery \| SQL-ified endpoint telemetry \| Free/open-source \| https://osquery.io/ \| Join `processes` to `listening_ports` and sort by name \| `Get-CimInstance` in PowerShell \| | |
| 3 | `04-phase-cloud-identity-architecture.md:664` | \| Add a `Condition` on `aws:PrincipalArn` or a source VPC endpoint \| Makes the policy useless if the role's credentials are lifted and used from elsewhere \| | |
| 4 | `04-phase-cloud-identity-architecture.md:764` | **`aws:MultiFactorAuthPresent`** is a condition key that is true when the credentials used to make the request were obtained with multi-factor authentication. Putting it in a trust policy is a standard hardening step, and it has a failure mode that has confuse … | |
| 5 | `04-phase-cloud-identity-architecture.md:766` | > **Common failure:** A trust policy requires `aws:MultiFactorAuthPresent: true`. It works when a human signs in and assumes the role directly. Then someone builds a pipeline that assumes a role, then assumes this role from that session — **role chaining** — a … | |
| 6 | `04-phase-cloud-identity-architecture.md:782` | **Which roles those are is the part worth getting right, because the key above does not mean what it looks like it means here.** `aws:MultiFactorAuthPresent` describes whether *the AWS credentials making the call* were obtained with MFA. | |
| 7 | `04-phase-cloud-identity-architecture.md:786` | So a trust policy for a federated role that requires `aws:MultiFactorAuthPresent: true` does not enforce fresh MFA. It denies the assumption, every time, including for the person who did present MFA. The `sts:AssumeRole` path — where a human authenticates to A … | |
| 8 | `04-phase-cloud-identity-architecture.md:818` | `aws:MultiFactorAuthAge` is measured in seconds, so on the roles it *does* apply to, `900` means the MFA had to happen within the last fifteen minutes. That is the setting that turns MFA from “you have it” into “you used it, recently, for this.” | |
| 9 | `04-phase-cloud-identity-architecture.md:1006` | \| A secret containing a static cloud key \| Mounted into the pod as an environment variable or file \| The key is now in etcd, in any backup, and in anyone's `kubectl describe` output \| | |
| 10 | `04-phase-cloud-identity-architecture.md:1891` | - **The MFA context does not survive role chaining.** `aws:MultiFactorAuthPresent` is false on the second assumption, which is why workload identity beats a chain. | |
| 11 | `05-phase-adversary-emulation.md:1170` | \| Chainsaw \| Fast Sigma-based triage and hunting over event logs \| Free/open-source \| https://github.com/WithSecureLabs/chainsaw \| Hunt an exported Sysmon log with the Sigma rule set \| Hayabusa, or manual `Get-WinEvent` filters \| | |
| 12 | `05-phase-adversary-emulation.md:1171` | \| Windows Event Log and wevtutil \| Native log storage and export \| Free, built-in \| https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil \| Export the Sysmon and Security logs to files before reverting a snapshot \| Pow … | |
| 13 | `07-phase-detection-as-code.md:1151` | \| Monitor \| `registry/lifecycle.csv`, precision columns \| Someone measured it \| | |
| | | <sub>↑ \| Deploy \| The rule ID recorded against the deployed query \| You can map a firing alert back to the source \|<br>↓ \| Tune \| `tuning/DET-042-2026-07.md` \| The exclusion has evidence and a re-measure date \|</sub> | |
