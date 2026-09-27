# Advanced track — technical claim verification

**Status: claims extracted. NO verification pass recorded yet.**

Every verdict column below is empty. This is a worklist, not a result.

Nothing in this repository has ever tested whether its content is technically *true*. Every
guard tests internal consistency — does the parser lose content, do cross-references resolve,
does a table sum to the number the prose claims. The comprehension passes test whether a
beginner can *follow* the text. Both are blind to a sentence that is perfectly consistent,
perfectly clear, and factually wrong.

The one error of that class found so far (`modbus.func_code >= 15`, which also matches function
code 43 and every exception response) was caught by a reader who happened to know Modbus. That
is not a method. This file is the method: every checkable claim, in one place, with its
location, so the checking is finite work instead of a re-read of 160,000 words.

## How to verify

For each claim below, fetch the source named for its class and compare. Then fill in the
verdict line. Three outcomes, and the third is the important one:

| Verdict | Meaning |
|---|---|
| `OK` | The claim matches the source. Quote the source line that settles it. |
| `WRONG` | The claim contradicts the source. Give the correct value **and** the source. |
| `UNVERIFIABLE` | The claim is a judgement, an analogy, or a simplification rather than a fact. |

**`UNVERIFIABLE` is a real result, not a failure to try.** A phase may say a `/26` is "the point
where most beginners close the tab" — that is pedagogy, not a fact, and marking it OK would be
laundering an opinion into a verified column. Sorting those out honestly is what makes the
`OK` column mean anything.

## Already verified, without needing a source

**Three classes are settled without an external source.** They need no document to settle, so
they are checked by **recomputation** and against the registry that *assigns* the values — the
strongest tier available, because it does not depend on trusting anyone's documentation:

| Script | What it settles | Result | In CI? |
|---|---|---|---|
| `scripts/verify-cidr.mjs` | Every CIDR table row, every mask-to-prefix equivalence, and each RFC 1918 range's actual span | 42 checks, 0 wrong (IT) | yes |
| `scripts/verify-metrics.mjs` | The stated service-desk metrics, recomputed from their own ticket table | 15 checks, 0 wrong (IT 06) | yes |
| `scripts/verify-ports.mjs` | Every port number in the Advanced track against the **IANA Service Name and Transport Protocol Port Number Registry** — the authority that assigns them | 19 checks, 0 wrong (IT) | no (needs network; run by hand) |

Run all three before trusting this section. If any ever fails, the claims below it are stale.

**So the settled classes are already recomputed and are NOT listed for verification:**

- **IP addressing and subnetting** — 0 claims, recomputed by `verify-cidr.mjs`.
- **Port numbers** — 59 claims. Those appearing in a phase's own port table were checked
  against the IANA registry. The remainder appear inside worked examples
  (`Test-NetConnection … -Port 445`), which are illustrative rather than assertions —
  a reader loses nothing if an example used a different port to demonstrate the syntax.
- **Stated counts and arithmetic** — 173 claims, recomputed from the documents' own numbers.
  Most are inventory figures ("a 10-device practice asset inventory") that are **illustrative
  examples rather than claims about the world**, so they are unverifiable by construction.

## Result of the verification passes

**No verification pass has been recorded for the Advanced track yet.** This file is a
worklist: it says what needs checking and where. It deliberately does **not** carry a results
table, because there are no results to carry — and the previous revision of this file carried
one anyway, copied from the IT pass, which claimed all classes verified and zero claims wrong.

**508 claim(s) below need an external source.** Every verdict column is empty. If you
are reading this expecting a completed result, there is not one.

> **Why there is no results table here.** Verification verdicts live in a conversation, not in
> the repository (D-038), so a generator cannot read them back. Rather than print a stale or
> borrowed number, this file prints none. Record real verdicts in
> [`claims-to-verify-advance/`](claims-to-verify-advance/) when a pass completes.

## `UNVERIFIABLE` is expected to be common, and is not a failure

A great deal of this track is teaching method, diagnostic reasoning, worked examples and career
advice, none of which is a fact about the world. **On the IT pass 48 of 224 rows (21%) came back
`UNVERIFIABLE`, and that was the honest result** — a phase saying a `/26` is "the point where most
beginners close the tab" is pedagogy, not fact, and stamping it OK would have made the OK column
mean nothing. Do not push a verifier to fill a column; an invented URL is worse than a gap,
because it will be acted on.

## What a clean result does NOT mean

**This is not a verdict on the curriculum.** It means the classes above were checked against
sources. The extractor cannot see a bad analogy, a misleading emphasis, or outdated practice that
reads as current — and those are the errors most likely to actually mislead a beginner. That
layer has only ever been tested by the comprehension passes, and it remains the largest
unexamined risk in the repository.

## What this file does NOT claim

- **It is not exhaustive of the content.** It finds claims of the classes above. Prose that is
  wrong in a way no pattern catches — a bad analogy, a misleading emphasis, an outdated practice
  — is invisible here and always will be.
- **It is not a comprehension check.** Whether a beginner can follow the text is a different
  question, answered by [`COMPREHENSION-AUDIT.md`](COMPREHENSION-AUDIT.md).
- **A clean result does not mean the phase is correct.** It means these classes were checked.

**Claims extracted: 740** across 7 phases and 21 classes.

Three classes are settled by recomputation or by the assigning registry (**232 claims**),
leaving **508 claims** that genuinely need a source. Those are the ones listed below.

| Class | Claims | Source | Status |
|---|---|---|---|
| IP addressing and subnetting | 0 | RFC 1918 (private ranges), RFC 6890 (special-purpose), or by recomputation | **settled** |
| Port numbers | 59 | IANA port registry, or Microsoft/vendor docs for the Windows-specific ones | **settled** |
| Command and cmdlet usage | 3 | Microsoft Learn for cmdlets, man pages for POSIX tools | needs checking |
| DNS record types | 0 | RFC 1035 and the IANA DNS parameters registry | needs checking |
| Protocol and standard behaviour | 17 | The RFC or standard that defines the protocol; vendor docs for proprietary ones | needs checking |
| Product versions and editions | 10 | Vendor documentation, checked against the current release | needs checking |
| Registry paths, file paths and filenames | 2 | Microsoft documentation, or the OS itself | needs checking |
| Stated counts, sizes and arithmetic | 173 | Recomputation from the document's own numbers | **settled** |
| CVE identifiers and vulnerability claims | 0 | The NVD or the vendor advisory for that CVE | needs checking |
| MITRE ATT&CK technique identifiers | 83 | The MITRE ATT&CK matrix for the named technique ID | needs checking |
| Standards, frameworks and control identifiers | 12 | The published standard itself (NIST CSRC, ISO, PCI SSC, OWASP) | needs checking |
| Security tool commands and flags | 13 | The tool's own man page or vendor documentation | needs checking |
| Cryptography algorithm claims | 0 | The defining standard (NIST FIPS), or the IETF RFC for the protocol | needs checking |
| Cloud IAM policy and identity artefacts | 139 | AWS Service Authorization Reference, AWS IAM policy elements reference and managed policies reference; Microsoft Learn for Azure role definitions, policy effects and app permissions | needs checking |
| Cloud and infrastructure CLI syntax | 35 | AWS CLI command reference, Microsoft Learn for the `az` CLI, the Terraform CLI reference, Conftest and OPA documentation | needs checking |
| Sigma rule specification | 65 | The Sigma specification (SigmaHQ/sigma-specification) | needs checking |
| Detection-as-code tool flags and status | 20 | The sigma-cli (pySigma) project documentation and source; the pySigma README for the sigmac replacement claim | needs checking |
| SIEM search language (SPL) | 66 | Splunk Search Manual (docs.splunk.com) for the named command or function | needs checking |
| Windows event IDs, channels and field names | 20 | Microsoft Learn (audit event IDs, Sysmon schema, process access rights) for the named event or field | needs checking |
| Living-off-the-land binaries and their command lines | 19 | The LOLBAS project (lolbas-project.github.io) for the named binary and what it can do | needs checking |
| Rego and OPA semantics | 4 | The Open Policy Agent policy language reference | needs checking |

---

## IP addressing and subnetting

*Every value is arithmetic or is fixed by RFC 1918 / RFC 6890. Highest-risk class: a wrong mask teaches a wrong mental model that persists.*

**Source to check against:** RFC 1918 (private ranges), RFC 6890 (special-purpose), or by recomputation

_No claims of this class found._

## Port numbers

*Fixed by the IANA Service Name and Transport Protocol Port Number Registry. A wrong port number is unrecoverable from context.*

**Source to check against:** IANA port registry, or Microsoft/vendor docs for the Windows-specific ones

**59 claim(s) — already verified by recomputation, not listed.**

See "Already verified, without needing a source" above. Re-run the verifying script if you
doubt it; do not re-check these by hand.

---

## Command and cmdlet usage

*Flags, parameters and syntax are fixed by the tool's own documentation. A wrong flag in a worked example is executable code that silently cannot run.*

**Source to check against:** Microsoft Learn for cmdlets, man pages for POSIX tools

3 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-threat-hunting.md:1265` | \| osquery \| SQL-ified endpoint telemetry \| Free/open-source \| https://osquery.io/ \| Join `processes` to `listening_ports` and sort by name \| `Get-CimInstance` in PowerShell \| | |
| 2 | `05-phase-adversary-emulation.md:1170` | \| Chainsaw \| Fast Sigma-based triage and hunting over event logs \| Free/open-source \| https://github.com/WithSecureLabs/chainsaw \| Hunt an exported Sysmon log with the Sigma rule set \| Hayabusa, or manual `Get-WinEvent` filters \| | |
| 3 | `05-phase-adversary-emulation.md:1171` | \| Windows Event Log and wevtutil \| Native log storage and export \| Free, built-in \| https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil \| Export the Sysmon and Security logs to files before reverting a snapshot \| Pow … | |

---

## DNS record types

*Defined by RFC 1035 and successors. Small set, easy to get subtly wrong.*

**Source to check against:** RFC 1035 and the IANA DNS parameters registry

_No claims of this class found._

## Protocol and standard behaviour

*Fixed by the defining spec. Includes handshake sequences, header fields, status codes and OSI layer assignments.*

**Source to check against:** The RFC or standard that defines the protocol; vendor docs for proprietary ones

17 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `04-phase-cloud-identity-architecture.md:50` | - Federation and SSO: SAML, OIDC, SCIM provisioning, and permission sets | |
| | | <sub>↑ - Role chaining and the MFA context that does not survive it<br>↓ - Workload identity: OIDC federation for pipelines, managed identities, IAM roles for service accounts</sub> | |
| 2 | `04-phase-cloud-identity-architecture.md:743` ▶ | "Federated": "arn:aws:iam::444455556666:saml-provider/ContosoEntraID" | |
| | | <sub>↑ "Principal": {<br>↓ },</sub> | |
| 3 | `04-phase-cloud-identity-architecture.md:748` ▶ | "SAML:aud": "https://signin.aws.amazon.com/saml" | |
| | | <sub>↑ "StringEquals": {<br>↓ }</sub> | |
| 4 | `04-phase-cloud-identity-architecture.md:756` | **That policy looks empty of constraints, and it is not.** The constraint is upstream, in the identity provider: only members of a specific group are assigned this role in the SAML application. The trust policy says “the identity provider may assert this role” … | |
| 5 | `04-phase-cloud-identity-architecture.md:814` | What the AWS trust policy can usefully constrain is the assertion itself: `SAML:aud` to pin the audience, `SAML:sub` to pin who may assert it, and `sts:SourceIdentity` with `sts:SetSourceIdentity` so the originating human survives into CloudTrail. | |
| 6 | `04-phase-cloud-identity-architecture.md:877` | \| **SAML 2.0** \| Enterprise SSO into the cloud console, older and very widely deployed \| A signed XML document, usually delivered through the browser \| | |
| 7 | `04-phase-cloud-identity-architecture.md:1420` ▶ | Federated = "arn:aws:iam::444455556666:saml-provider/ContosoEntraID" | |
| | | <sub>↑ Principal = {<br>↓ }</sub> | |
| 8 | `04-phase-cloud-identity-architecture.md:1425` ▶ | "SAML:aud" = "https://signin.aws.amazon.com/saml" | |
| | | <sub>↑ StringEquals = {<br>↓ }</sub> | |
| 9 | `04-phase-cloud-identity-architecture.md:1706` ▶ | Federated = "arn:aws:iam::444455556666:saml-provider/ContosoEntraID" | |
| | | <sub>↑ Principal = {<br>↓ }</sub> | |
| 10 | `04-phase-cloud-identity-architecture.md:1711` ▶ | "SAML:aud" = "https://signin.aws.amazon.com/saml" | |
| | | <sub>↑ StringEquals = {<br>↓ }</sub> | |
| 11 | `04-phase-cloud-identity-architecture.md:1761` ▶ | Federated = "arn:aws:iam::444455556666:saml-provider/ContosoEntraID" | |
| | | <sub>↑ Principal = {<br>↓ }</sub> | |
| 12 | `04-phase-cloud-identity-architecture.md:1766` ▶ | "SAML:aud" = "https://signin.aws.amazon.com/saml" | |
| | | <sub>↑ StringEquals = {<br>↓ }</sub> | |
| 13 | `04-phase-cloud-identity-architecture.md:1848` ▶ | Actions performed Inspected the SAML application assignment; | |
| | | <sub>↑ Session ended 03:22 UTC, 41 minutes<br>↓ corrected a group mapping that had been changed</sub> | |
| 14 | `04-phase-cloud-identity-architecture.md:1856` ▶ | Follow-up ticket SEC-2026-0314-07 — SAML group mapping change was | |
| | | <sub>↑ than those listed above.<br>↓ not covered by change control. Owner: IAM team.</sub> | |
| 15 | `04-phase-cloud-identity-architecture.md:1869` | **“Follow-up ticket”** is what turns the incident into an improvement. In this example, the root cause was a change to a SAML group mapping that bypassed change control — which is a finding about a different control entirely, and exactly the kind of finding a  … | |
| 16 | `04-phase-cloud-identity-architecture.md:1932` | \| Microsoft Entra ID \| Identity provider, Conditional Access, and the sign-in and audit logs used for detection \| Freemium \| https://learn.microsoft.com/en-us/entra/identity/ \| Write the Conditional Access policy that would require MFA for a privileged ro … | |
| 17 | `04-phase-cloud-identity-architecture.md:1933` | \| AWS IAM Identity Center \| Central SSO, permission sets, and account assignment \| Free, built-in \| https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html \| Create a permission set and assign it to one group in one account \| Keycloak or E … | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Product versions and editions

*The class most likely to ROT. A claim that is true today may be false after a release, so these carry a shelf life the others do not.*

**Source to check against:** Vendor documentation, checked against the current release

10 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
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

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Registry paths, file paths and filenames

*Verbatim strings that must match the OS exactly. A transposed path sends a reader somewhere that does not exist.*

**Source to check against:** Microsoft documentation, or the OS itself

2 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `05-phase-adversary-emulation.md:775` | \| Hypothesis written before execution \| "A registry value written under `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` should generate Sysmon event ID 13 with the target object naming that path. A rule should exist to alert on it." \| | |
| 2 | `05-phase-adversary-emulation.md:952` | **The two filters reduce volume at the cost of coverage.** A malicious binary copied into `C:\Program Files\` and writing a run key will be filtered out. That is a conscious trade, and it belongs in the rule's description so that the next person to read it kno … | |

---

## Stated counts, sizes and arithmetic

*Checkable by RECOMPUTATION, which needs no source at all — the strongest tier of verification available.*

**Source to check against:** Recomputation from the document's own numbers

**173 claim(s) — already verified by recomputation, not listed.**

See "Already verified, without needing a source" above. Re-run the verifying script if you
doubt it; do not re-check these by hand.

---

## CVE identifiers and vulnerability claims

*A CVE ID resolves to exactly one published record. The ID, the affected product, and the described impact are all fixed by that record — and an ID paired with the wrong product is a fabrication that reads as authoritative.*

**Source to check against:** The NVD or the vendor advisory for that CVE

_No claims of this class found._

## MITRE ATT&CK technique identifiers

*A technique ID resolves to one entry in a versioned, published matrix. The ID and its technique name are both fixed, and the matrix is renumbered between versions.*

**Source to check against:** The MITRE ATT&CK matrix for the named technique ID

83 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-detection-at-scale.md:161` ▶ | - https://attack.mitre.org/techniques/T1059/001/ | |
| | | <sub>↑ references:<br>↓ - https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_powershell_exe</sub> | |
| 2 | `01-phase-detection-at-scale.md:251` ▶ | git commit -m "det: add T1059.001 encoded PowerShell process creation rule | |
| | | <sub>↑ # The commit message names the technique and the reason. Not "add rule".</sub> | |
| 3 | `01-phase-detection-at-scale.md:320` ▶ | ATT&CK mapping pass — T1059.001 | |
| | | <sub>↑ Severity pass — level lowered from medium to low<br>↓ Test evidence pass — samples match and do not match as required</sub> | |
| 4 | `01-phase-detection-at-scale.md:608` | MITRE ATT&CK is a catalogue of adversary tactics and techniques, organised as: **tactic** (the goal, such as Execution), **technique** (the method, such as T1059 Command and Scripting Interpreter), and **sub-technique** (the specific variant, such as T1059.001 … | |
| 5 | `01-phase-detection-at-scale.md:633` ▶ | Process Injection (T1055), as a worked example of the three levels. | |
| | | <sub>↑ ```text</sub> | |
| 6 | `01-phase-detection-at-scale.md:646` | A team that marks T1055 green because a rule exists has documented a detection. It has not documented coverage, and the difference is the entire value of the exercise. | |
| 7 | `01-phase-detection-at-scale.md:679` | \| T1059.001 \| PowerShell \| Yes \| Yes \| SOC queue 1 \| **Yes** \| DET-014, noisy, routing under review \| | |
| | | <sub>↑ \|---\|---\|---\|---\|---\|---\|---\|<br>↓ \| T1059.003 \| Windows Command Shell \| Yes \| Yes \| SOC queue 1 \| **Yes** \| DET-021, tuned 2026-02 \|</sub> | |
| 8 | `01-phase-detection-at-scale.md:680` | \| T1059.003 \| Windows Command Shell \| Yes \| Yes \| SOC queue 1 \| **Yes** \| DET-021, tuned 2026-02 \| | |
| | | <sub>↑ \| T1059.001 \| PowerShell \| Yes \| Yes \| SOC queue 1 \| **Yes** \| DET-014, noisy, routing under review \|<br>↓ \| T1059.005 \| Visual Basic \| Yes \| No \| — \| **No** \| No rule exists \|</sub> | |
| 9 | `01-phase-detection-at-scale.md:681` | \| T1059.005 \| Visual Basic \| Yes \| No \| — \| **No** \| No rule exists \| | |
| | | <sub>↑ \| T1059.003 \| Windows Command Shell \| Yes \| Yes \| SOC queue 1 \| **Yes** \| DET-021, tuned 2026-02 \|<br>↓ \| T1547.001 \| Registry Run Keys \| Yes \| Yes \| SOC queue 2 \| **Yes** \| DET-034 \|</sub> | |
| 10 | `01-phase-detection-at-scale.md:682` | \| T1547.001 \| Registry Run Keys \| Yes \| Yes \| SOC queue 2 \| **Yes** \| DET-034 \| | |
| | | <sub>↑ \| T1059.005 \| Visual Basic \| Yes \| No \| — \| **No** \| No rule exists \|<br>↓ \| T1543.003 \| Windows Service \| Yes \| Yes \| — \| **No** \| Rule fires into an unowned queue \|</sub> | |
| 11 | `01-phase-detection-at-scale.md:683` | \| T1543.003 \| Windows Service \| Yes \| Yes \| — \| **No** \| Rule fires into an unowned queue \| | |
| | | <sub>↑ \| T1547.001 \| Registry Run Keys \| Yes \| Yes \| SOC queue 2 \| **Yes** \| DET-034 \|<br>↓ \| T1055 \| Process Injection \| Partial \| Yes \| SOC queue 2 \| **Partial** \| Sysmon 8 on 412 of 500 endpoints \|</sub> | |
| 12 | `01-phase-detection-at-scale.md:684` | \| T1055 \| Process Injection \| Partial \| Yes \| SOC queue 2 \| **Partial** \| Sysmon 8 on 412 of 500 endpoints \| | |
| 13 | `01-phase-detection-at-scale.md:685` | \| T1071.001 \| Web Protocols \| No \| No \| — \| **No** \| Proxy logs retained 7 days, not ingested \| | |
| | | <sub>↑ \| T1055 \| Process Injection \| Partial \| Yes \| SOC queue 2 \| **Partial** \| Sysmon 8 on 412 of 500 endpoints \|<br>↓ \| T1078.004 \| Cloud Accounts \| Yes \| No \| — \| **No** \| Cloud audit log collected, no rules \|</sub> | |
| 14 | `01-phase-detection-at-scale.md:686` | \| T1078.004 \| Cloud Accounts \| Yes \| No \| — \| **No** \| Cloud audit log collected, no rules \| | |
| | | <sub>↑ \| T1071.001 \| Web Protocols \| No \| No \| — \| **No** \| Proxy logs retained 7 days, not ingested \|</sub> | |
| 15 | `01-phase-detection-at-scale.md:690` | **The `T1071.001` row is the one to study.** There is no detection, and there cannot be one, because the proxy logs are retained for seven days and are not ingested into the platform at all. That is not a detection problem. It is a telemetry problem, and it is … | |
| 16 | `01-phase-detection-at-scale.md:797` | \| Coverage map \| T1059.001 is covered \| The rule reads a field that is null on 88 hosts \| | |
| | | <sub>↑ \| Deployment \| The rule is live \| The rule was deployed to one tenant, not both \|<br>↓ \| Monitoring \| No alerts means nothing happened \| No alerts meant the rule never matched anything \|</sub> | |
| 17 | `01-phase-detection-at-scale.md:1101` ▶ | 1. Pick the technique. T1059.001, PowerShell, matches the rule you are | |
| | | <sub>↓ validating.</sub> | |
| 18 | `01-phase-detection-at-scale.md:1220` ▶ | Technique T1059.001 | |
| | | <sub>↑ Rule DET-014 PowerShell Encoded Command Execution<br>↓ Owner detection-engineering</sub> | |
| 19 | `01-phase-detection-at-scale.md:1242` ▶ | Atomic: T1059.001 test 1, run 2026-03-21, alert observed | |
| | | <sub>↑ Replay: replay-encoded-powershell.csv, 30 days</sub> | |
| 20 | `01-phase-detection-at-scale.md:1304` | \| Atomic Red Team \| Documented, small tests of individual ATT&CK techniques \| Free/open-source \| https://github.com/redcanaryco/atomic-red-team \| Run the T1059.001 test on a lab host and check whether your rule fires \| Manual PowerShell simulation on a l … | |
| 21 | `02-phase-threat-hunting.md:221` ▶ | ATT&CK mapping T1021.002 — Remote Services: SMB/Windows Admin Shares | |
| | | <sub>↓ T1569.002 — System Services: Service Execution</sub> | |
| 22 | `02-phase-threat-hunting.md:222` ▶ | T1569.002 — System Services: Service Execution | |
| | | <sub>↑ ATT&CK mapping T1021.002 — Remote Services: SMB/Windows Admin Shares<br>↓ T1543.003 — Create or Modify System Process: Windows Service</sub> | |
| 23 | `02-phase-threat-hunting.md:223` ▶ | T1543.003 — Create or Modify System Process: Windows Service | |
| | | <sub>↑ T1569.002 — System Services: Service Execution</sub> | |
| 24 | `02-phase-threat-hunting.md:333` | \| T1053.005 Scheduled Task \| Security 4698, Sysmon 1/11 \| Yes — DET-118 \| Never \| | |
| | | <sub>↑ \|---\|---\|---\|---\|<br>↓ \| T1059.001 PowerShell \| Script block logging, EDR process events \| Yes — DET-042 \| 2025-11 \|</sub> | |
| 25 | `02-phase-threat-hunting.md:334` | \| T1059.001 PowerShell \| Script block logging, EDR process events \| Yes — DET-042 \| 2025-11 \| | |
| | | <sub>↑ \| T1053.005 Scheduled Task \| Security 4698, Sysmon 1/11 \| Yes — DET-118 \| Never \|<br>↓ \| T1218.011 Rundll32 \| EDR process events, command lines \| No \| Never \|</sub> | |
| 26 | `02-phase-threat-hunting.md:335` | \| T1218.011 Rundll32 \| EDR process events, command lines \| No \| Never \| | |
| | | <sub>↑ \| T1059.001 PowerShell \| Script block logging, EDR process events \| Yes — DET-042 \| 2025-11 \|<br>↓ \| T1071.001 Web protocols \| Proxy, DNS, firewall \| Partly — proxy only \| 2025-09 \|</sub> | |
| 27 | `02-phase-threat-hunting.md:336` | \| T1071.001 Web protocols \| Proxy, DNS, firewall \| Partly — proxy only \| 2025-09 \| | |
| | | <sub>↑ \| T1218.011 Rundll32 \| EDR process events, command lines \| No \| Never \|<br>↓ \| T1021.002 SMB/Admin shares \| Security 4624 type 3, 5140 \| No \| Never \|</sub> | |
| 28 | `02-phase-threat-hunting.md:337` | \| T1021.002 SMB/Admin shares \| Security 4624 type 3, 5140 \| No \| Never \| | |
| | | <sub>↑ \| T1071.001 Web protocols \| Proxy, DNS, firewall \| Partly — proxy only \| 2025-09 \|<br>↓ \| T1562.001 Impair defenses \| EDR tamper events, service state \| No \| Never \|</sub> | |
| 29 | `02-phase-threat-hunting.md:338` | \| T1562.001 Impair defenses \| EDR tamper events, service state \| No \| Never \| | |
| | | <sub>↑ \| T1021.002 SMB/Admin shares \| Security 4624 type 3, 5140 \| No \| Never \|<br>↓ \| T1055 Process injection \| EDR memory events \| No \| Never \|</sub> | |
| 30 | `02-phase-threat-hunting.md:339` | \| T1055 Process injection \| EDR memory events \| No \| Never \| | |
| | | <sub>↑ \| T1562.001 Impair defenses \| EDR tamper events, service state \| No \| Never \|<br>↓ \| T1098 Account manipulation \| Cloud audit log, directory audit \| Partly — one rule \| Never \|</sub> | |
| 31 | `02-phase-threat-hunting.md:340` | \| T1098 Account manipulation \| Cloud audit log, directory audit \| Partly — one rule \| Never \| | |
| | | <sub>↑ \| T1055 Process injection \| EDR memory events \| No \| Never \|</sub> | |
| 32 | `02-phase-threat-hunting.md:346` | The gap between "T1053.005 is visible in Security 4698" and "I can hunt T1053.005" is a field-level question. For each technique, write down the fields your query will need. | |
| 33 | `02-phase-threat-hunting.md:350` | \| T1053.005 Scheduled Task \| Task name, task action (the binary and arguments), creating account, host, time \| Task name yes, action **no** — 4698 TaskContent is not being parsed \| | |
| 34 | `02-phase-threat-hunting.md:351` | \| T1059.001 PowerShell \| Full command line, script block text, parent process, user \| Command line yes; script block text yes, 30-day retention only \| | |
| 35 | `02-phase-threat-hunting.md:352` | \| T1218.011 Rundll32 \| Full command line, DLL path argument, parent process \| Yes \| | |
| | | <sub>↑ \| T1059.001 PowerShell \| Full command line, script block text, parent process, user \| Command line yes; script block text yes, 30-day retention onl …<br>↓ \| T1071.001 Web protocols \| Remote host, URL, initiating process, bytes out \| URL and process yes; bytes **no** — proxy logs lack byte counts \|</sub> | |
| 36 | `02-phase-threat-hunting.md:353` | \| T1071.001 Web protocols \| Remote host, URL, initiating process, bytes out \| URL and process yes; bytes **no** — proxy logs lack byte counts \| | |
| 37 | `02-phase-threat-hunting.md:392` | \| "Could not hunt scheduled tasks properly, no data." \| "Hunt HUNT-2026-014 could not be completed for T1053.005. Security 4698 is collected with a 180-day retention, but the TaskContent field is not parsed by the current connector, so task actions cannot be … | |
| 38 | `02-phase-threat-hunting.md:443` | This maps to ATT&CK **T1218 — System Binary Proxy Execution** and its sub-techniques T1218.011 (Rundll32), T1218.010 (Regsvr32), and T1218.005 (Mshta). | |
| 39 | `02-phase-threat-hunting.md:448` ▶ | // Hunt HUNT-2026-021 — T1218 System Binary Proxy Execution | |
| | | <sub>↑ ```kql<br>↓ // Defender XDR advanced hunting. DeviceProcessEvents holds endpoint</sub> | |
| 40 | `02-phase-threat-hunting.md:560` ▶ | pointing into a user-writable directory, consistent with T1218 proxy execution. | |
| | | <sub>↑ description: Detects rundll32, regsvr32 or mshta launched with an argument<br>↓ references:</sub> | |
| 41 | `02-phase-threat-hunting.md:562` ▶ | - https://attack.mitre.org/techniques/T1218/ | |
| | | <sub>↑ references:<br>↓ author: Your Name</sub> | |
| 42 | `02-phase-threat-hunting.md:761` ▶ | ATT&CK T1053.005 — Scheduled Task/Job: Scheduled Task | |
| | | <sub>↓ Data needed Security 4698 (task created), Sysmon 1 (process creation),</sub> | |
| 43 | `02-phase-threat-hunting.md:1013` ▶ | Technique T1053.005 marked as hunted; next hunt due in 6 months. | |
| | | <sub>↑ Agent coverage for the 12 hosts raised with the endpoint team.<br>↓ ```</sub> | |
| 44 | `02-phase-threat-hunting.md:1151` ▶ | ATT&CK T1003.001 — OS Credential Dumping: LSASS Memory | |
| 45 | `02-phase-threat-hunting.md:1179` ▶ | 3. T1003.001 marked HUNTED in the coverage map; next | |
| | | <sub>↑ ticket EPD-2210 opened.<br>↓ hunt due in 6 months.</sub> | |
| 46 | `05-phase-adversary-emulation.md:142` | \| **Technique** \| The general way of achieving the goal, the *how* \| Command and Scripting Interpreter (T1059) \| | |
| 47 | `05-phase-adversary-emulation.md:143` | \| **Sub-technique** \| A specific variant of the technique \| PowerShell (T1059.001) \| | |
| | | <sub>↑ \| **Technique** \| The general way of achieving the goal, the *how* \| Command and Scripting Interpreter (T1059) \|<br>↓ \| **Procedure** \| A specific implementation used by a specific actor or tool \| A macro that launches `powershell.exe -nop -w hidden -enc <base64>`  …</sub> | |
| 48 | `05-phase-adversary-emulation.md:239` ▶ | Techniques T1059.001, T1053.005, T1547.001, T1136.001, T1003.001 | |
| | | <sub>↑ Services None in production</sub> | |
| 49 | `05-phase-adversary-emulation.md:464` ▶ | Invoke-AtomicTest T1059.001 -ShowDetailsBrief | |
| | | <sub>↑ # 3. See what tests exist for one technique, briefly.</sub> | |
| 50 | `05-phase-adversary-emulation.md:467` ▶ | Invoke-AtomicTest T1059.001 -TestNumbers 1 -ShowDetails | |
| | | <sub>↑ # 4. Read one test in full, including its prerequisites and its cleanup.</sub> | |
| 51 | `05-phase-adversary-emulation.md:470` ▶ | Invoke-AtomicTest T1059.001 -TestNumbers 1 -GetPrereqs | |
| | | <sub>↑ # 5. Install any prerequisites the test needs.</sub> | |
| 52 | `05-phase-adversary-emulation.md:473` ▶ | Invoke-AtomicTest T1059.001 -TestNumbers 1 -CheckPrereqs | |
| | | <sub>↑ # 6. Verify the prerequisites are actually satisfied.</sub> | |
| 53 | `05-phase-adversary-emulation.md:476` ▶ | Invoke-AtomicTest T1059.001 -TestNumbers 1 -ExecutionLogPath "C:\evidence\art-log.csv" | |
| | | <sub>↑ # 7. Execute the test, logging the run to a file for your records.</sub> | |
| 54 | `05-phase-adversary-emulation.md:480` ▶ | Invoke-AtomicTest T1059.001 -TestNumbers 1 -Cleanup | |
| | | <sub>↑ # failed, because a partially applied change is still a change.</sub> | |
| 55 | `05-phase-adversary-emulation.md:580` | \| 1 \| T1059.001 PowerShell \| Execution \| Windows 10 \| Atomic T1059.001 #1 \| Sysmon 1 with `powershell.exe` and full command line \| Sysmon 1 present and correct \| **Partially detected** — recorded, no rule \| GAP-001 \| | |
| 56 | `05-phase-adversary-emulation.md:581` | \| 2 \| T1053.005 Scheduled Task \| Persistence \| Windows 10 \| Atomic T1053.005 #1 \| Security 4698, TaskScheduler operational \| Security 4698 present \| **Detected** — rule fired within 90s \| — \| | |
| 57 | `05-phase-adversary-emulation.md:582` | \| 3 \| T1547.001 Registry Run Keys \| Persistence \| Windows 10 \| Atomic T1547.001 #1 \| Sysmon 13 on `...\CurrentVersion\Run` \| Sysmon 13 present but filtered out by config \| **Not detected, telemetry present** \| GAP-002 \| | |
| 58 | `05-phase-adversary-emulation.md:583` | \| 4 \| T1136.001 Create Local Account \| Persistence \| Windows 10 \| Atomic T1136.001 #1 \| Security 4720 \| **No 4720 in the log — account auditing not enabled** \| **Not detected, no telemetry** \| GAP-003 \| | |
| 59 | `05-phase-adversary-emulation.md:584` | \| 5 \| T1003.001 LSASS Memory \| Credential Access \| Windows 10 \| Atomic T1003.001 #1 \| Sysmon 10 with `lsass.exe` as target \| Sysmon 10 present, high volume, no rule \| **Partially detected** — noisy, needs scoping \| GAP-004 \| | |
| 60 | `05-phase-adversary-emulation.md:585` | \| 6 \| T1059.003 Windows Command Shell \| Execution \| Windows 10 \| Atomic T1059.003 #1 \| Sysmon 1 with `cmd.exe` \| Present, and a rule fired \| **Detected** \| — \| | |
| 61 | `05-phase-adversary-emulation.md:646` ▶ | - https://attack.mitre.org/techniques/T1059/001/ | |
| | | <sub>↑ references:<br>↓ - https://attack.mitre.org/techniques/T1204/002/</sub> | |
| 62 | `05-phase-adversary-emulation.md:647` ▶ | - https://attack.mitre.org/techniques/T1204/002/ | |
| | | <sub>↑ - https://attack.mitre.org/techniques/T1059/001/<br>↓ author: Your Name</sub> | |
| 63 | `05-phase-adversary-emulation.md:750` | \| GAP-001 \| T1059.001 \| Partially detected \| Sysmon records the process, no rule matches Office as parent \| Detection engineering \| Sigma rule `office_spawns_encoded_powershell` \| High \| Rule written, awaiting re-test \| 2026-04-15 \| | |
| 64 | `05-phase-adversary-emulation.md:751` | \| GAP-002 \| T1547.001 \| Not detected, telemetry present \| Sysmon 13 events are dropped by the config's registry exclude list \| Detection engineering \| Narrow the exclude list to keep `\CurrentVersion\Run` \| High \| Config change proposed \| 2026-04-22 \ … | |
| 65 | `05-phase-adversary-emulation.md:752` | \| GAP-003 \| T1136.001 \| Not detected, no telemetry \| Windows account-management auditing is not enabled \| Endpoint engineering \| Enable `Audit User Account Management` by GPO \| High \| Raised to endpoint engineering \| 2026-05-06 \| | |
| 66 | `05-phase-adversary-emulation.md:753` | \| GAP-004 \| T1003.001 \| Partially detected \| Sysmon 10 is recorded but the volume makes a naive rule unusable \| Detection engineering \| Scope to non-system processes accessing `lsass.exe` with `GrantedAccess` 0x1010 \| Medium \| Rule drafted \| 2026-04-2 … | |
| 67 | `05-phase-adversary-emulation.md:770` | \| Technique \| T1547.001, Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder \| | |
| | | <sub>↑ \| Exercise \| AE-2026-004 \|<br>↓ \| Tactic \| Persistence \|</sub> | |
| 68 | `05-phase-adversary-emulation.md:773` | \| Atomic test \| Atomic Red Team T1547.001, registry run key variant \| | |
| | | <sub>↑ \| Platform \| Windows 10, host `LAB-WIN10-01`, isolated lab VLAN 90 \|<br>↓ \| Authorisation \| Signed ROE, section 3 in scope, section 6 window 09:00–17:00 \|</sub> | |
| 69 | `05-phase-adversary-emulation.md:799` ▶ | Invoke-AtomicTest T1547.001 -TestNumbers 1 -CheckPrereqs | |
| | | <sub>↑ # Step 3 — confirm the prerequisites for this atomic are met.</sub> | |
| 70 | `05-phase-adversary-emulation.md:802` ▶ | Invoke-AtomicTest T1547.001 -TestNumbers 1 -ShowDetails | |
| | | <sub>↑ # Step 4 — read the test before running it. Confirm it has a cleanup.</sub> | |
| 71 | `05-phase-adversary-emulation.md:805` ▶ | Invoke-AtomicTest T1547.001 -TestNumbers 1 -ExecutionLogPath "C:\evidence\art-T1547-001.csv" | |
| | | <sub>↑ # Step 5 — execute, logging the run.</sub> | |
| 72 | `05-phase-adversary-emulation.md:826` ▶ | Invoke-AtomicTest T1547.001 -TestNumbers 1 -Cleanup | |
| | | <sub>↑ # Step 9 — clean up, then verify the cleanup.<br>↓ Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" \|</sub> | |
| 73 | `05-phase-adversary-emulation.md:915` ▶ | - https://attack.mitre.org/techniques/T1547/001/ | |
| | | <sub>↑ references:<br>↓ author: Your Name</sub> | |
| 74 | `05-phase-adversary-emulation.md:1001` ▶ | test T1136.001 on LAB-WIN10-01 in the isolated lab VLAN. The test creates | |
| | | <sub>↑ On 2026-04-08, as part of exercise AE-2026-004, we ran Atomic Red Team<br>↓ a local user account. The technique is ATT&CK T1136.001, Create Account:</sub> | |
| 75 | `05-phase-adversary-emulation.md:1002` ▶ | a local user account. The technique is ATT&CK T1136.001, Create Account: | |
| | | <sub>↑ test T1136.001 on LAB-WIN10-01 in the isolated lab VLAN. The test creates<br>↓ Local Account, Persistence tactic.</sub> | |
| 76 | `05-phase-adversary-emulation.md:1039` ▶ | reason — adding an account to Administrators is T1098, and it generates | |
| | | <sub>↑ We would also recommend Audit Security Group Management, for the same<br>↓ event ID 4732 from the same policy area.</sub> | |
| 77 | `05-phase-adversary-emulation.md:1043` ▶ | We will re-run T1136.001 on 2026-05-06, ten days after the change is | |
| | | <sub>↑ WHAT WE WILL DO TO VERIFY<br>↓ scheduled to land, and confirm that event ID 4720 is generated and that</sub> | |
| 78 | `05-phase-adversary-emulation.md:1103` ▶ | beyond T1003.001. | |
| | | <sub>↑ - Any technique in the Credential Access or Lateral Movement tactics<br>↓ - Whether the rules that fired would have been triaged correctly by an</sub> | |
| 79 | `07-phase-detection-as-code.md:325` ▶ | ATT&CK T1105." | |
| | | <sub>↑ Status experimental pending a 30-day replay against production data.</sub> | |
| 80 | `07-phase-detection-as-code.md:1020` ▶ | DET-042,Certutil remote download,Your Name,stable,2026-05-14,2026-07-02,2026-10-02,31%,T1105,tuned twice | |
| | | <sub>↑ rule_id,title,owner,status,deployed,last_reviewed,review_due,precision_30d,attck,notes<br>↓ DET-057,Archive creation in user dirs,Peer Reviewer,stable,2026-06-01,2026-06-01,2026-09-01,34%,T1560,replaced DET-018</sub> | |
| 81 | `07-phase-detection-as-code.md:1021` ▶ | DET-057,Archive creation in user dirs,Peer Reviewer,stable,2026-06-01,2026-06-01,2026-09-01,34%,T1560,replaced DET-018 | |
| 82 | `07-phase-detection-as-code.md:1022` ▶ | DET-018,Suspicious archive creation,None,retired,2026-02-10,2026-07-15,NA,0.5%,T1560,retired 2026-07-15 | |
| | | <sub>↑ DET-057,Archive creation in user dirs,Peer Reviewer,stable,2026-06-01,2026-06-01,2026-09-01,34%,T1560,replaced DET-018<br>↓ ```</sub> | |
| 83 | `07-phase-detection-as-code.md:1099` ▶ | ATT&CK T1105, Ingress Tool Transfer. | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Standards, frameworks and control identifiers

*NIST SP numbers, ISO/IEC numbers, PCI DSS requirements and OWASP categories are versioned documents with fixed numbering. A wrong control number points a reader at the wrong requirement.*

**Source to check against:** The published standard itself (NIST CSRC, ISO, PCI SSC, OWASP)

12 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `03-phase-incident-command.md:972` | - NIST SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management — https://csrc.nist.gov/pubs/sp/800/61/r3/final | |
| 2 | `03-phase-incident-command.md:1153` | Every practice in this phase runs at $0. A Jitsi room is a bridge call, HedgeDoc or Etherpad is a scribe's log, and a shared document is a decision log; none of that changes the skill being built. The authoritative material is free as well: FEMA's ICS courses  … | |
| 3 | `04-phase-cloud-identity-architecture.md:1957` | - NIST SP 800-207, Zero Trust Architecture — https://csrc.nist.gov/pubs/sp/800/207/final | |
| | | <sub>↑ - Terraform AWS provider documentation — https://registry.terraform.io/providers/hashicorp/aws/latest/docs<br>↓ - CIS Benchmarks — https://www.cisecurity.org/cis-benchmarks</sub> | |
| 4 | `04-phase-cloud-identity-architecture.md:1958` | - CIS Benchmarks — https://www.cisecurity.org/cis-benchmarks | |
| | | <sub>↑ - NIST SP 800-207, Zero Trust Architecture — https://csrc.nist.gov/pubs/sp/800/207/final<br>↓ - Cloud Security Alliance Cloud Controls Matrix — https://cloudsecurityalliance.org/research/cloud-controls-matrix</sub> | |
| 5 | `04-phase-cloud-identity-architecture.md:1960` | - NIST SP 800-63C Rev. 4, Federation and Assertions — https://csrc.nist.gov/pubs/sp/800/63/c/4/final | |
| | | <sub>↑ - Cloud Security Alliance Cloud Controls Matrix — https://cloudsecurityalliance.org/research/cloud-controls-matrix</sub> | |
| 6 | `04-phase-cloud-identity-architecture.md:2130` | Everything this phase teaches can be built on free tiers, with **one scoped exception stated plainly rather than glossed**: Conditional Access is an Entra ID **P1** feature and is not in the free tier — the same licence boundary the cyber track's cloud-and-ide … | |
| 7 | `05-phase-adversary-emulation.md:1194` | - NIST SP 800-115, Technical Guide to Information Security Testing and Assessment — https://csrc.nist.gov/pubs/sp/800/115/final | |
| 8 | `06-phase-programme-and-influence.md:1225` | - NIST SP 800-30 Rev. 1, Guide for Conducting Risk Assessments — https://csrc.nist.gov/pubs/sp/800/30/r1/final | |
| 9 | `06-phase-programme-and-influence.md:1226` | - NIST SP 800-39, Managing Information Security Risk — https://csrc.nist.gov/pubs/sp/800/39/final | |
| | | <sub>↑ - NIST SP 800-30 Rev. 1, Guide for Conducting Risk Assessments — https://csrc.nist.gov/pubs/sp/800/30/r1/final<br>↓ - NIST SP 800-50 Rev. 1, Building an IT Security Awareness and Training Program — https://csrc.nist.gov/pubs/sp/800/50/r1/final</sub> | |
| 10 | `06-phase-programme-and-influence.md:1227` | - NIST SP 800-50 Rev. 1, Building an IT Security Awareness and Training Program — https://csrc.nist.gov/pubs/sp/800/50/r1/final | |
| 11 | `06-phase-programme-and-influence.md:1228` | - NIST SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management — https://csrc.nist.gov/pubs/sp/800/61/r3/final | |
| 12 | `06-phase-programme-and-influence.md:1413` | Every artefact in this phase is a document, a spreadsheet, or a conversation, and none of them requires a licence. LibreOffice Calc or Google Sheets carries the metric register and the dashboard; GitHub Issues or GitLab Issues carries the action tracker; a Mar … | |

---

## Security tool commands and flags

*Flags are fixed by each tool's own manual. A wrong flag in a lab instruction is executable code that cannot run — the same failure shape as IT 02's DISM defect.*

**Source to check against:** The tool's own man page or vendor documentation

13 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
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

---

## Cryptography algorithm claims

*Key sizes, hash lengths and the broken/sound status of an algorithm are fixed facts. Telling a beginner MD5 or SHA-1 is acceptable is the kind of error that persists into their work.*

**Source to check against:** The defining standard (NIST FIPS), or the IETF RFC for the protocol

_No claims of this class found._

## Cloud IAM policy and identity artefacts

*A policy action name, a condition key, a managed policy name and a role definition name are all fixed strings in a vendor reference. `iam:CreateUser` paired with the wrong service prefix, or a condition key that does not exist, is a policy that never fires — and it fails silently, which is the worst way for a control to fail.*

**Source to check against:** AWS Service Authorization Reference, AWS IAM policy elements reference and managed policies reference; Microsoft Learn for Azure role definitions, policy effects and app permissions

139 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `04-phase-cloud-identity-architecture.md:48` | - Role assumption: trust policies, `sts:AssumeRole`, session duration, external IDs, source identity, and confused-deputy problems | |
| 2 | `04-phase-cloud-identity-architecture.md:287` ▶ | "organizations:LeaveOrganization", | |
| | | <sub>↑ "Action": [<br>↓ "organizations:DeleteOrganization",</sub> | |
| 3 | `04-phase-cloud-identity-architecture.md:288` ▶ | "organizations:DeleteOrganization", | |
| | | <sub>↑ "organizations:LeaveOrganization",<br>↓ "organizations:RemoveAccountFromOrganization"</sub> | |
| 4 | `04-phase-cloud-identity-architecture.md:289` ▶ | "organizations:RemoveAccountFromOrganization" | |
| | | <sub>↑ "organizations:DeleteOrganization",<br>↓ ],</sub> | |
| 5 | `04-phase-cloud-identity-architecture.md:297` ▶ | "cloudtrail:StopLogging", | |
| | | <sub>↑ "Action": [<br>↓ "cloudtrail:DeleteTrail",</sub> | |
| 6 | `04-phase-cloud-identity-architecture.md:298` ▶ | "cloudtrail:DeleteTrail", | |
| | | <sub>↑ "cloudtrail:StopLogging",<br>↓ "cloudtrail:UpdateTrail",</sub> | |
| 7 | `04-phase-cloud-identity-architecture.md:299` ▶ | "cloudtrail:UpdateTrail", | |
| | | <sub>↑ "cloudtrail:DeleteTrail",<br>↓ "cloudtrail:PutEventSelectors",</sub> | |
| 8 | `04-phase-cloud-identity-architecture.md:300` ▶ | "cloudtrail:PutEventSelectors", | |
| | | <sub>↑ "cloudtrail:UpdateTrail",<br>↓ "config:DeleteConfigurationRecorder",</sub> | |
| 9 | `04-phase-cloud-identity-architecture.md:301` ▶ | "config:DeleteConfigurationRecorder", | |
| | | <sub>↑ "cloudtrail:PutEventSelectors",<br>↓ "config:StopConfigurationRecorder",</sub> | |
| 10 | `04-phase-cloud-identity-architecture.md:302` ▶ | "config:StopConfigurationRecorder", | |
| | | <sub>↑ "config:DeleteConfigurationRecorder",<br>↓ "config:DeleteDeliveryChannel",</sub> | |
| 11 | `04-phase-cloud-identity-architecture.md:303` ▶ | "config:DeleteDeliveryChannel", | |
| | | <sub>↑ "config:StopConfigurationRecorder",<br>↓ "config:PutConfigurationRecorder"</sub> | |
| 12 | `04-phase-cloud-identity-architecture.md:304` ▶ | "config:PutConfigurationRecorder" | |
| | | <sub>↑ "config:DeleteDeliveryChannel",<br>↓ ],</sub> | |
| 13 | `04-phase-cloud-identity-architecture.md:312` ▶ | "iam:CreateServiceLinkedRole", | |
| | | <sub>↑ "NotAction": [<br>↓ "iam:DeleteServiceLinkedRole",</sub> | |
| 14 | `04-phase-cloud-identity-architecture.md:313` ▶ | "iam:DeleteServiceLinkedRole", | |
| | | <sub>↑ "iam:CreateServiceLinkedRole",<br>↓ "iam:GetAccountSummary",</sub> | |
| 15 | `04-phase-cloud-identity-architecture.md:314` ▶ | "iam:GetAccountSummary", | |
| | | <sub>↑ "iam:DeleteServiceLinkedRole",<br>↓ "iam:ListAccountAliases",</sub> | |
| 16 | `04-phase-cloud-identity-architecture.md:315` ▶ | "iam:ListAccountAliases", | |
| | | <sub>↑ "iam:GetAccountSummary",<br>↓ "account:EnableRegion",</sub> | |
| 17 | `04-phase-cloud-identity-architecture.md:316` ▶ | "account:EnableRegion", | |
| | | <sub>↑ "iam:ListAccountAliases",<br>↓ "account:DisableRegion",</sub> | |
| 18 | `04-phase-cloud-identity-architecture.md:317` ▶ | "account:DisableRegion", | |
| | | <sub>↑ "account:EnableRegion",<br>↓ "account:ListRegions",</sub> | |
| 19 | `04-phase-cloud-identity-architecture.md:318` ▶ | "account:ListRegions", | |
| | | <sub>↑ "account:DisableRegion",<br>↓ "account:GetAccountInformation",</sub> | |
| 20 | `04-phase-cloud-identity-architecture.md:319` ▶ | "account:GetAccountInformation", | |
| | | <sub>↑ "account:ListRegions",<br>↓ "aws-portal:ViewBilling",</sub> | |
| 21 | `04-phase-cloud-identity-architecture.md:328` ▶ | "s3:PutAccountPublicAccessBlock", | |
| | | <sub>↑ "cur:*",<br>↓ "s3:GetAccountPublicAccessBlock"</sub> | |
| 22 | `04-phase-cloud-identity-architecture.md:329` ▶ | "s3:GetAccountPublicAccessBlock" | |
| | | <sub>↑ "s3:PutAccountPublicAccessBlock",<br>↓ ],</sub> | |
| 23 | `04-phase-cloud-identity-architecture.md:334` ▶ | "aws:PrincipalArn": "arn:aws:iam::*:root" | |
| | | <sub>↑ "StringLike": {<br>↓ }</sub> | |
| 24 | `04-phase-cloud-identity-architecture.md:348` | **`ProtectTheAuditTrail` denies the actions rather than the resource.** `cloudtrail:StopLogging` with `Resource: "*"` denies stopping any trail in the account. Writing `Resource` as a specific trail ARN would leave the next trail unprotected, which is the fail … | |
| 25 | `04-phase-cloud-identity-architecture.md:411` ▶ | "ec2:Describe*", | |
| | | <sub>↑ "sqs:*",<br>↓ "ecr:*",</sub> | |
| 26 | `04-phase-cloud-identity-architecture.md:414` ▶ | "sts:GetCallerIdentity", | |
| | | <sub>↑ "ecs:*",<br>↓ "tag:GetResources"</sub> | |
| 27 | `04-phase-cloud-identity-architecture.md:415` ▶ | "tag:GetResources" | |
| | | <sub>↑ "sts:GetCallerIdentity",<br>↓ ],</sub> | |
| 28 | `04-phase-cloud-identity-architecture.md:423` ▶ | "iam:Get*", | |
| | | <sub>↑ "Action": [<br>↓ "iam:List*",</sub> | |
| 29 | `04-phase-cloud-identity-architecture.md:424` ▶ | "iam:List*", | |
| | | <sub>↑ "iam:Get*",<br>↓ "iam:PassRole"</sub> | |
| 30 | `04-phase-cloud-identity-architecture.md:425` ▶ | "iam:PassRole" | |
| | | <sub>↑ "iam:List*",<br>↓ ],</sub> | |
| 31 | `04-phase-cloud-identity-architecture.md:440` ▶ | "ec2:Describe*", | |
| | | <sub>↑ "sqs:*",<br>↓ "ecr:*",</sub> | |
| 32 | `04-phase-cloud-identity-architecture.md:443` ▶ | "sts:GetCallerIdentity", | |
| | | <sub>↑ "ecs:*",<br>↓ "tag:GetResources",</sub> | |
| 33 | `04-phase-cloud-identity-architecture.md:444` ▶ | "tag:GetResources", | |
| | | <sub>↑ "sts:GetCallerIdentity",<br>↓ "iam:Get*",</sub> | |
| 34 | `04-phase-cloud-identity-architecture.md:445` ▶ | "iam:Get*", | |
| | | <sub>↑ "tag:GetResources",<br>↓ "iam:List*",</sub> | |
| 35 | `04-phase-cloud-identity-architecture.md:446` ▶ | "iam:List*", | |
| | | <sub>↑ "iam:Get*",<br>↓ "iam:PassRole"</sub> | |
| 36 | `04-phase-cloud-identity-architecture.md:447` ▶ | "iam:PassRole" | |
| | | <sub>↑ "iam:List*",<br>↓ ],</sub> | |
| 37 | `04-phase-cloud-identity-architecture.md:455` ▶ | "iam:CreateUser", | |
| | | <sub>↑ "Action": [<br>↓ "iam:CreateAccessKey",</sub> | |
| 38 | `04-phase-cloud-identity-architecture.md:456` ▶ | "iam:CreateAccessKey", | |
| | | <sub>↑ "iam:CreateUser",<br>↓ "iam:CreateLoginProfile",</sub> | |
| 39 | `04-phase-cloud-identity-architecture.md:457` ▶ | "iam:CreateLoginProfile", | |
| | | <sub>↑ "iam:CreateAccessKey",<br>↓ "iam:UpdateLoginProfile",</sub> | |
| 40 | `04-phase-cloud-identity-architecture.md:458` ▶ | "iam:UpdateLoginProfile", | |
| | | <sub>↑ "iam:CreateLoginProfile",<br>↓ "iam:AttachUserPolicy",</sub> | |
| 41 | `04-phase-cloud-identity-architecture.md:459` ▶ | "iam:AttachUserPolicy", | |
| | | <sub>↑ "iam:UpdateLoginProfile",<br>↓ "iam:PutUserPolicy",</sub> | |
| 42 | `04-phase-cloud-identity-architecture.md:460` ▶ | "iam:PutUserPolicy", | |
| | | <sub>↑ "iam:AttachUserPolicy",<br>↓ "iam:AddUserToGroup",</sub> | |
| 43 | `04-phase-cloud-identity-architecture.md:461` ▶ | "iam:AddUserToGroup", | |
| | | <sub>↑ "iam:PutUserPolicy",<br>↓ "organizations:*",</sub> | |
| 44 | `04-phase-cloud-identity-architecture.md:477` | **The fourth statement denies even the things the first allows.** `iam:PassRole` is in the first statement because roles that create compute need it. `iam:CreateUser` and `iam:CreateAccessKey` are not, and the fourth statement makes that explicit rather than r … | |
| 45 | `04-phase-cloud-identity-architecture.md:508` ▶ | "sts:GetCallerIdentity", | |
| | | <sub>↑ "s3:*", "dynamodb:*", "lambda:*", "logs:*", "cloudwatch:*",<br>↓ ]</sub> | |
| 46 | `04-phase-cloud-identity-architecture.md:534` | \| **Who can change it** \| Only the organisation's management account \| Anyone with `iam:PutRolePermissionsBoundary` on the role \| | |
| 47 | `04-phase-cloud-identity-architecture.md:548` | \| “Developers must not create IAM users” \| A wiki page says so \| SCP denies `iam:CreateUser` in the workload OU \| — \| | |
| 48 | `04-phase-cloud-identity-architecture.md:551` | \| “Root user must not have access keys” \| An onboarding checklist \| SCP denies `iam:CreateAccessKey` for root \| Config rule with automatic remediation \| | |
| 49 | `04-phase-cloud-identity-architecture.md:611` | The output of that pipeline is a list like `s3:GetObject`, `s3:PutObject`, `dynamodb:Query`, `kms:Decrypt`, `logs:CreateLogStream`. That list is the *observed* set, and it is the input to step three, not the answer. | |
| 50 | `04-phase-cloud-identity-architecture.md:623` ▶ | "s3:GetObject", | |
| | | <sub>↑ "Action": [<br>↓ "s3:PutObject"</sub> | |
| 51 | `04-phase-cloud-identity-architecture.md:624` ▶ | "s3:PutObject" | |
| | | <sub>↑ "s3:GetObject",<br>↓ ],</sub> | |
| 52 | `04-phase-cloud-identity-architecture.md:632` ▶ | "dynamodb:Query", | |
| | | <sub>↑ "Action": [<br>↓ "dynamodb:GetItem",</sub> | |
| 53 | `04-phase-cloud-identity-architecture.md:633` ▶ | "dynamodb:GetItem", | |
| | | <sub>↑ "dynamodb:Query",<br>↓ "dynamodb:PutItem"</sub> | |
| 54 | `04-phase-cloud-identity-architecture.md:634` ▶ | "dynamodb:PutItem" | |
| | | <sub>↑ "dynamodb:GetItem",<br>↓ ],</sub> | |
| 55 | `04-phase-cloud-identity-architecture.md:641` ▶ | "Action": "kms:Decrypt", | |
| | | <sub>↑ "Effect": "Allow",<br>↓ "Resource": "arn:aws:kms:ap-southeast-1:444455556666:key/6f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8"</sub> | |
| 56 | `04-phase-cloud-identity-architecture.md:648` ▶ | "logs:CreateLogStream", | |
| | | <sub>↑ "Action": [<br>↓ "logs:PutLogEvents"</sub> | |
| 57 | `04-phase-cloud-identity-architecture.md:649` ▶ | "logs:PutLogEvents" | |
| | | <sub>↑ "logs:CreateLogStream",<br>↓ ],</sub> | |
| 58 | `04-phase-cloud-identity-architecture.md:661` | \| Drop `s3:PutObject` if the workload only ever wrote during a migration \| Observation includes the migration; the steady state is narrower \| | |
| 59 | `04-phase-cloud-identity-architecture.md:662` | \| Scope the KMS grant to the specific key and add `kms:ViaService` \| Prevents the key being used from anywhere except S3, DynamoDB, or Lambda as intended \| | |
| 60 | `04-phase-cloud-identity-architecture.md:664` | \| Add a `Condition` on `aws:PrincipalArn` or a source VPC endpoint \| Makes the policy useless if the role's credentials are lifted and used from elsewhere \| | |
| 61 | `04-phase-cloud-identity-architecture.md:672` ▶ | "Action": "kms:Decrypt", | |
| | | <sub>↑ "Effect": "Allow",<br>↓ "Resource": "arn:aws:kms:ap-southeast-1:444455556666:key/6f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8",</sub> | |
| 62 | `04-phase-cloud-identity-architecture.md:676` ▶ | "kms:ViaService": "s3.ap-southeast-1.amazonaws.com" | |
| | | <sub>↑ "StringEquals": {<br>↓ }</sub> | |
| 63 | `04-phase-cloud-identity-architecture.md:720` ▶ | "Action": "sts:AssumeRole", | |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 64 | `04-phase-cloud-identity-architecture.md:723` ▶ | "sts:ExternalId": "c1f4b0a7-2d8e-4a3f-9b21-6a0e5d7c4f88" | |
| | | <sub>↑ "StringEquals": {<br>↓ }</sub> | |
| 65 | `04-phase-cloud-identity-architecture.md:745` ▶ | "Action": "sts:AssumeRoleWithSAML", | |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 66 | `04-phase-cloud-identity-architecture.md:764` | **`aws:MultiFactorAuthPresent`** is a condition key that is true when the credentials used to make the request were obtained with multi-factor authentication. Putting it in a trust policy is a standard hardening step, and it has a failure mode that has confuse … | |
| 67 | `04-phase-cloud-identity-architecture.md:766` | > **Common failure:** A trust policy requires `aws:MultiFactorAuthPresent: true`. It works when a human signs in and assumes the role directly. Then someone builds a pipeline that assumes a role, then assumes this role from that session — **role chaining** — a … | |
| 68 | `04-phase-cloud-identity-architecture.md:775` | \| Add `sts:SetSourceIdentity` and require `sts:SourceIdentity` \| The originating identity is carried into CloudTrail, so the chain is auditable \| Almost always — this is the correct hardening \| | |
| 69 | `04-phase-cloud-identity-architecture.md:782` | **Which roles those are is the part worth getting right, because the key above does not mean what it looks like it means here.** `aws:MultiFactorAuthPresent` describes whether *the AWS credentials making the call* were obtained with MFA. | |
| 70 | `04-phase-cloud-identity-architecture.md:784` | A role assumed through `sts:AssumeRoleWithSAML` is handed its credentials by the identity provider's assertion. The MFA that actually happened took place at the identity provider, before the assertion was ever signed, and it is not visible to these condition k … | |
| 71 | `04-phase-cloud-identity-architecture.md:786` | So a trust policy for a federated role that requires `aws:MultiFactorAuthPresent: true` does not enforce fresh MFA. It denies the assumption, every time, including for the person who did present MFA. The `sts:AssumeRole` path — where a human authenticates to A … | |
| 72 | `04-phase-cloud-identity-architecture.md:797` ▶ | "Action": "sts:AssumeRole", | |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 73 | `04-phase-cloud-identity-architecture.md:800` ▶ | "aws:MultiFactorAuthPresent": "true" | |
| | | <sub>↑ "Bool": {<br>↓ },</sub> | |
| 74 | `04-phase-cloud-identity-architecture.md:803` ▶ | "aws:MultiFactorAuthAge": "900" | |
| | | <sub>↑ "NumericLessThan": {<br>↓ }</sub> | |
| 75 | `04-phase-cloud-identity-architecture.md:812` | **The federated version is enforced on the other side of the boundary.** For `sts:AssumeRoleWithSAML`, fresh MFA belongs in the identity provider's policy — a Conditional Access rule requiring an authentication strength for the group assigned to that role. | |
| 76 | `04-phase-cloud-identity-architecture.md:814` | What the AWS trust policy can usefully constrain is the assertion itself: `SAML:aud` to pin the audience, `SAML:sub` to pin who may assert it, and `sts:SourceIdentity` with `sts:SetSourceIdentity` so the originating human survives into CloudTrail. | |
| 77 | `04-phase-cloud-identity-architecture.md:818` | `aws:MultiFactorAuthAge` is measured in seconds, so on the roles it *does* apply to, `900` means the MFA had to happen within the last fifteen minutes. That is the setting that turns MFA from “you have it” into “you used it, recently, for this.” | |
| 78 | `04-phase-cloud-identity-architecture.md:909` ▶ | "Action": "sts:AssumeRoleWithWebIdentity", | |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 79 | `04-phase-cloud-identity-architecture.md:956` ▶ | Action = "sts:AssumeRoleWithWebIdentity" | |
| | | <sub>↑ }<br>↓ Condition = {</sub> | |
| 80 | `04-phase-cloud-identity-architecture.md:1024` ▶ | "Action": "sts:AssumeRoleWithWebIdentity", | |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 81 | `04-phase-cloud-identity-architecture.md:1100` ▶ | "kms:Create*", | |
| | | <sub>↑ "Action": [<br>↓ "kms:Describe*",</sub> | |
| 82 | `04-phase-cloud-identity-architecture.md:1101` ▶ | "kms:Describe*", | |
| | | <sub>↑ "kms:Create*",<br>↓ "kms:Enable*",</sub> | |
| 83 | `04-phase-cloud-identity-architecture.md:1102` ▶ | "kms:Enable*", | |
| | | <sub>↑ "kms:Describe*",<br>↓ "kms:List*",</sub> | |
| 84 | `04-phase-cloud-identity-architecture.md:1103` ▶ | "kms:List*", | |
| | | <sub>↑ "kms:Enable*",<br>↓ "kms:Put*",</sub> | |
| 85 | `04-phase-cloud-identity-architecture.md:1104` ▶ | "kms:Put*", | |
| | | <sub>↑ "kms:List*",<br>↓ "kms:Update*",</sub> | |
| 86 | `04-phase-cloud-identity-architecture.md:1105` ▶ | "kms:Update*", | |
| | | <sub>↑ "kms:Put*",<br>↓ "kms:Revoke*",</sub> | |
| 87 | `04-phase-cloud-identity-architecture.md:1106` ▶ | "kms:Revoke*", | |
| | | <sub>↑ "kms:Update*",<br>↓ "kms:Disable*",</sub> | |
| 88 | `04-phase-cloud-identity-architecture.md:1107` ▶ | "kms:Disable*", | |
| | | <sub>↑ "kms:Revoke*",<br>↓ "kms:Get*",</sub> | |
| 89 | `04-phase-cloud-identity-architecture.md:1108` ▶ | "kms:Get*", | |
| | | <sub>↑ "kms:Disable*",<br>↓ "kms:TagResource",</sub> | |
| 90 | `04-phase-cloud-identity-architecture.md:1109` ▶ | "kms:TagResource", | |
| | | <sub>↑ "kms:Get*",<br>↓ "kms:UntagResource",</sub> | |
| 91 | `04-phase-cloud-identity-architecture.md:1110` ▶ | "kms:UntagResource", | |
| | | <sub>↑ "kms:TagResource",<br>↓ "kms:ScheduleKeyDeletion",</sub> | |
| 92 | `04-phase-cloud-identity-architecture.md:1111` ▶ | "kms:ScheduleKeyDeletion", | |
| | | <sub>↑ "kms:UntagResource",<br>↓ "kms:CancelKeyDeletion"</sub> | |
| 93 | `04-phase-cloud-identity-architecture.md:1112` ▶ | "kms:CancelKeyDeletion" | |
| | | <sub>↑ "kms:ScheduleKeyDeletion",<br>↓ ],</sub> | |
| 94 | `04-phase-cloud-identity-architecture.md:1123` ▶ | "kms:Decrypt", | |
| | | <sub>↑ "Action": [<br>↓ "kms:DescribeKey",</sub> | |
| 95 | `04-phase-cloud-identity-architecture.md:1124` ▶ | "kms:DescribeKey", | |
| | | <sub>↑ "kms:Decrypt",<br>↓ "kms:GenerateDataKey"</sub> | |
| 96 | `04-phase-cloud-identity-architecture.md:1125` ▶ | "kms:GenerateDataKey" | |
| | | <sub>↑ "kms:DescribeKey",<br>↓ ],</sub> | |
| 97 | `04-phase-cloud-identity-architecture.md:1134` ▶ | "kms:DeleteImportedKeyMaterial" | |
| | | <sub>↑ "Action": [<br>↓ ],</sub> | |
| 98 | `04-phase-cloud-identity-architecture.md:1146` | **The second and third statements are deliberately disjoint.** `KeyAdministratorRole` has `kms:Create*` and `kms:ScheduleKeyDeletion` but not `kms:Decrypt`. `PaymentsApiTaskRole` has `kms:Decrypt` but cannot change the key policy. An administrator who cannot r … | |
| 99 | `04-phase-cloud-identity-architecture.md:1150` | **`kms:ScheduleKeyDeletion` is granted to administrators and denied to nobody.** That looks like a gap and it is a deliberate one: deleting a key is sometimes necessary, and the control that prevents an accident is the mandatory waiting period AWS enforces, pl … | |
| 100 | `04-phase-cloud-identity-architecture.md:1177` | \| **At apply time, by the platform** \| A change that bypasses the pipeline entirely \| An SCP that denies `iam:CreateUser` \| | |
| 101 | `04-phase-cloud-identity-architecture.md:1422` ▶ | Action = "sts:AssumeRoleWithSAML" | |
| | | <sub>↑ }<br>↓ Condition = {</sub> | |
| 102 | `04-phase-cloud-identity-architecture.md:1527` | \| Egress firewall permitting a destination list \| A `kms:ViaService` condition \| | |
| | | <sub>↑ \| Security group allowing one port from one source \| A trust policy pinned to one repository and one branch \|<br>↓ \| VPC endpoint policy \| A resource-based policy that refuses anything the identity policy missed \|</sub> | |
| 103 | `04-phase-cloud-identity-architecture.md:1606` ▶ | "iam:Get*", | |
| | | <sub>↑ "Action": [<br>↓ "iam:List*",</sub> | |
| 104 | `04-phase-cloud-identity-architecture.md:1607` ▶ | "iam:List*", | |
| | | <sub>↑ "iam:Get*",<br>↓ "iam:PassRole",</sub> | |
| 105 | `04-phase-cloud-identity-architecture.md:1608` ▶ | "iam:PassRole", | |
| | | <sub>↑ "iam:List*",<br>↓ "iam:TagRole",</sub> | |
| 106 | `04-phase-cloud-identity-architecture.md:1609` ▶ | "iam:TagRole", | |
| | | <sub>↑ "iam:PassRole",<br>↓ "iam:UntagRole",</sub> | |
| 107 | `04-phase-cloud-identity-architecture.md:1610` ▶ | "iam:UntagRole", | |
| | | <sub>↑ "iam:TagRole",<br>↓ "sts:GetCallerIdentity",</sub> | |
| 108 | `04-phase-cloud-identity-architecture.md:1611` ▶ | "sts:GetCallerIdentity", | |
| | | <sub>↑ "iam:UntagRole",<br>↓ "sts:AssumeRole"</sub> | |
| 109 | `04-phase-cloud-identity-architecture.md:1612` ▶ | "sts:AssumeRole" | |
| | | <sub>↑ "sts:GetCallerIdentity",<br>↓ ],</sub> | |
| 110 | `04-phase-cloud-identity-architecture.md:1636` ▶ | "iam:Get*", | |
| | | <sub>↑ "resource-groups:*",<br>↓ "iam:List*",</sub> | |
| 111 | `04-phase-cloud-identity-architecture.md:1637` ▶ | "iam:List*", | |
| | | <sub>↑ "iam:Get*",<br>↓ "iam:PassRole",</sub> | |
| 112 | `04-phase-cloud-identity-architecture.md:1638` ▶ | "iam:PassRole", | |
| | | <sub>↑ "iam:List*",<br>↓ "iam:TagRole",</sub> | |
| 113 | `04-phase-cloud-identity-architecture.md:1639` ▶ | "iam:TagRole", | |
| | | <sub>↑ "iam:PassRole",<br>↓ "iam:UntagRole",</sub> | |
| 114 | `04-phase-cloud-identity-architecture.md:1640` ▶ | "iam:UntagRole", | |
| | | <sub>↑ "iam:TagRole",<br>↓ "sts:GetCallerIdentity",</sub> | |
| 115 | `04-phase-cloud-identity-architecture.md:1641` ▶ | "sts:GetCallerIdentity", | |
| | | <sub>↑ "iam:UntagRole",<br>↓ "sts:AssumeRole"</sub> | |
| 116 | `04-phase-cloud-identity-architecture.md:1642` ▶ | "sts:AssumeRole" | |
| | | <sub>↑ "sts:GetCallerIdentity",<br>↓ ],</sub> | |
| 117 | `04-phase-cloud-identity-architecture.md:1650` ▶ | "iam:CreateUser", | |
| | | <sub>↑ "Action": [<br>↓ "iam:CreateAccessKey",</sub> | |
| 118 | `04-phase-cloud-identity-architecture.md:1651` ▶ | "iam:CreateAccessKey", | |
| | | <sub>↑ "iam:CreateUser",<br>↓ "iam:CreateLoginProfile",</sub> | |
| 119 | `04-phase-cloud-identity-architecture.md:1652` ▶ | "iam:CreateLoginProfile", | |
| | | <sub>↑ "iam:CreateAccessKey",<br>↓ "iam:UpdateLoginProfile",</sub> | |
| 120 | `04-phase-cloud-identity-architecture.md:1653` ▶ | "iam:UpdateLoginProfile", | |
| | | <sub>↑ "iam:CreateLoginProfile",<br>↓ "iam:DeleteLoginProfile",</sub> | |
| 121 | `04-phase-cloud-identity-architecture.md:1654` ▶ | "iam:DeleteLoginProfile", | |
| | | <sub>↑ "iam:UpdateLoginProfile",<br>↓ "iam:AttachUserPolicy",</sub> | |
| 122 | `04-phase-cloud-identity-architecture.md:1655` ▶ | "iam:AttachUserPolicy", | |
| | | <sub>↑ "iam:DeleteLoginProfile",<br>↓ "iam:PutUserPolicy",</sub> | |
| 123 | `04-phase-cloud-identity-architecture.md:1656` ▶ | "iam:PutUserPolicy", | |
| | | <sub>↑ "iam:AttachUserPolicy",<br>↓ "iam:AddUserToGroup",</sub> | |
| 124 | `04-phase-cloud-identity-architecture.md:1657` ▶ | "iam:AddUserToGroup", | |
| | | <sub>↑ "iam:PutUserPolicy",<br>↓ "iam:CreatePolicyVersion",</sub> | |
| 125 | `04-phase-cloud-identity-architecture.md:1658` ▶ | "iam:CreatePolicyVersion", | |
| | | <sub>↑ "iam:AddUserToGroup",<br>↓ "iam:SetDefaultPolicyVersion",</sub> | |
| 126 | `04-phase-cloud-identity-architecture.md:1659` ▶ | "iam:SetDefaultPolicyVersion", | |
| | | <sub>↑ "iam:CreatePolicyVersion",<br>↓ "iam:DeleteRolePermissionsBoundary",</sub> | |
| 127 | `04-phase-cloud-identity-architecture.md:1660` ▶ | "iam:DeleteRolePermissionsBoundary", | |
| | | <sub>↑ "iam:SetDefaultPolicyVersion",<br>↓ "iam:PutRolePermissionsBoundary",</sub> | |
| 128 | `04-phase-cloud-identity-architecture.md:1661` ▶ | "iam:PutRolePermissionsBoundary", | |
| | | <sub>↑ "iam:DeleteRolePermissionsBoundary",<br>↓ "iam:UpdateAssumeRolePolicy",</sub> | |
| 129 | `04-phase-cloud-identity-architecture.md:1662` ▶ | "iam:UpdateAssumeRolePolicy", | |
| | | <sub>↑ "iam:PutRolePermissionsBoundary",<br>↓ "organizations:*",</sub> | |
| 130 | `04-phase-cloud-identity-architecture.md:1665` ▶ | "cloudtrail:StopLogging", | |
| | | <sub>↑ "account:*",<br>↓ "cloudtrail:DeleteTrail",</sub> | |
| 131 | `04-phase-cloud-identity-architecture.md:1666` ▶ | "cloudtrail:DeleteTrail", | |
| | | <sub>↑ "cloudtrail:StopLogging",<br>↓ "cloudtrail:UpdateTrail",</sub> | |
| 132 | `04-phase-cloud-identity-architecture.md:1667` ▶ | "cloudtrail:UpdateTrail", | |
| | | <sub>↑ "cloudtrail:DeleteTrail",<br>↓ "config:StopConfigurationRecorder",</sub> | |
| 133 | `04-phase-cloud-identity-architecture.md:1668` ▶ | "config:StopConfigurationRecorder", | |
| | | <sub>↑ "cloudtrail:UpdateTrail",<br>↓ "config:DeleteConfigurationRecorder",</sub> | |
| 134 | `04-phase-cloud-identity-architecture.md:1669` ▶ | "config:DeleteConfigurationRecorder", | |
| | | <sub>↑ "config:StopConfigurationRecorder",<br>↓ "config:DeleteDeliveryChannel"</sub> | |
| 135 | `04-phase-cloud-identity-architecture.md:1670` ▶ | "config:DeleteDeliveryChannel" | |
| | | <sub>↑ "config:DeleteConfigurationRecorder",<br>↓ ],</sub> | |
| 136 | `04-phase-cloud-identity-architecture.md:1708` ▶ | Action = "sts:AssumeRoleWithSAML" | |
| | | <sub>↑ }<br>↓ Condition = {</sub> | |
| 137 | `04-phase-cloud-identity-architecture.md:1763` ▶ | Action = "sts:AssumeRoleWithSAML" | |
| | | <sub>↑ }<br>↓ Condition = {</sub> | |
| 138 | `04-phase-cloud-identity-architecture.md:1830` | **Write the result of the second command into the design document, with the date.** That record — “on 14 March 2026, `iam:CreateAccessKey` was denied for the `PlatformAdmin` role” — is the evidence that the control is enforced rather than intended, and it is t … | |
| 139 | `04-phase-cloud-identity-architecture.md:1891` | - **The MFA context does not survive role chaining.** `aws:MultiFactorAuthPresent` is false on the second assumption, which is why workload identity beats a chain. | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Cloud and infrastructure CLI syntax

*Flags are fixed by each tool's own reference. A wrong flag name in a policy-as-code pipeline is a command that cannot run, and the reader's first evidence that their control is untested is a CLI error.*

**Source to check against:** AWS CLI command reference, Microsoft Learn for the `az` CLI, the Terraform CLI reference, Conftest and OPA documentation

35 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `04-phase-cloud-identity-architecture.md:241` ▶ | az account management-group create --name "contoso" --display-name "Contoso" | |
| | | <sub>↑ # A four-level management group hierarchy.<br>↓ az account management-group create --name "contoso-platform" --display-name "Platform" --parent "contoso"</sub> | |
| 2 | `04-phase-cloud-identity-architecture.md:242` ▶ | az account management-group create --name "contoso-platform" --display-name "Platform" --parent "contoso" | |
| | | <sub>↑ az account management-group create --name "contoso" --display-name "Contoso"<br>↓ az account management-group create --name "contoso-landing-zones" --display-name "Landing Zones" --parent "contoso"</sub> | |
| 3 | `04-phase-cloud-identity-architecture.md:243` ▶ | az account management-group create --name "contoso-landing-zones" --display-name "Landing Zones" --parent "contoso" | |
| 4 | `04-phase-cloud-identity-architecture.md:244` ▶ | az account management-group create --name "contoso-corp" --display-name "Corp" --parent "contoso-landing-zones" | |
| 5 | `04-phase-cloud-identity-architecture.md:245` ▶ | az account management-group create --name "contoso-online" --display-name "Online" --parent "contoso-landing-zones" | |
| 6 | `04-phase-cloud-identity-architecture.md:246` ▶ | az account management-group create --name "contoso-sandbox" --display-name "Sandbox" --parent "contoso" | |
| | | <sub>↑ az account management-group create --name "contoso-online" --display-name "Online" --parent "contoso-landing-zones"</sub> | |
| 7 | `04-phase-cloud-identity-architecture.md:250` ▶ | az account management-group subscription add \ --name "contoso-corp" \ --subscription "00000000-1111-2222-3333-444444444444" | |
| 8 | `04-phase-cloud-identity-architecture.md:353` ▶ | aws organizations create-policy \ --name DenyRootUserExceptAllowlisted \ --description "Confine the root user and protect the audit trail" \ --type SERVICE_CONTROL_POLICY \ --content file://scp-root-lockdown.json | |
| 9 | `04-phase-cloud-identity-architecture.md:359` ▶ | aws organizations attach-policy \ --policy-id p-9klmnopqrs \ --target-id ou-abcd-11111111 | |
| | | <sub>↓ ```</sub> | |
| 10 | `04-phase-cloud-identity-architecture.md:482` ▶ | aws iam create-policy \ --policy-name OrgDeveloperBoundary \ --description "Maximum permissions any developer role may hold" \ --policy-document file://boundary-developer.json | |
| 11 | `04-phase-cloud-identity-architecture.md:487` ▶ | aws iam put-role-permissions-boundary \ --role-name DeveloperRole \ --permissions-boundary arn:aws:iam::444455556666:policy/OrgDeveloperBoundary | |
| 12 | `04-phase-cloud-identity-architecture.md:582` ▶ | aws accessanalyzer start-policy-generation \ --policy-generation-details '{ | |
| | | <sub>↑ # Generate a candidate policy from 90 days of CloudTrail activity for a role.<br>↓ "principalArn": "arn:aws:iam::444455556666:role/PaymentsApiTaskRole",</sub> | |
| 13 | `04-phase-cloud-identity-architecture.md:594` ▶ | aws accessanalyzer get-generated-policy --job-id <job-id> | |
| | | <sub>↑ # Poll for the job, then retrieve the generated policy.<br>↓ ```</sub> | |
| 14 | `04-phase-cloud-identity-architecture.md:601` ▶ | aws cloudtrail lookup-events \ --lookup-attributes AttributeKey=Username,AttributeValue=PaymentsApiTaskRole \ --start-time 2025-12-14T00:00:00Z \ --end-time 2026-03-14T00:00:00Z \ --query 'Events[].CloudTrailEvent' \ --output text \ \| jq -r 'fromjson \| "\(.e … | |
| 15 | `04-phase-cloud-identity-architecture.md:826` ▶ | aws sts assume-role \ --role-arn arn:aws:iam::222233334444:role/OrgAuditReadOnly \ --role-session-name audit-2026-03-14 \ --external-id c1f4b0a7-2d8e-4a3f-9b21-6a0e5d7c4f88 \ --duration-seconds 3600 | |
| 16 | `04-phase-cloud-identity-architecture.md:850` ▶ | aws sts get-caller-identity --query 'Arn' --output text | |
| | | <sub>↑ # Who am I, and through which path did I get here?<br>↓ ```</sub> | |
| 17 | `04-phase-cloud-identity-architecture.md:859` ▶ | az account show --query '{user:user.name, tenant:tenantId, subscription:name}' --output json | |
| | | <sub>↑ # Who am I signed in as, and against which subscription?</sub> | |
| 18 | `04-phase-cloud-identity-architecture.md:862` ▶ | az role assignment list \ --scope "/subscriptions/00000000-1111-2222-3333-444444444444" \ --include-inherited \ --query '[].{principal:principalName, type:principalType, role:roleDefinitionName, scope:scope}' \ --output table | |
| 19 | `04-phase-cloud-identity-architecture.md:976` ▶ | az identity create \ --name "id-payments-api" \ --resource-group "rg-payments-prod" | |
| | | <sub>↑ # Create a user-assigned managed identity for the workload.</sub> | |
| 20 | `04-phase-cloud-identity-architecture.md:981` ▶ | az identity federated-credential create \ --name "github-main" \ --identity-name "id-payments-api" \ --resource-group "rg-payments-prod" \ --issuer "https://token.actions.githubusercontent.com" \ --subject "repo:acme/payments-api:ref:refs/heads/main" \ --audie … | |
| 21 | `04-phase-cloud-identity-architecture.md:990` ▶ | az role assignment create \ --assignee-object-id "$(az identity show --name id-payments-api \ --resource-group rg-payments-prod --query principalId --output tsv)" \ --assignee-principal-type ServicePrincipal \ --role "Key Vault Secrets User" \ --scope "/subscr … | |
| 22 | `04-phase-cloud-identity-architecture.md:1006` | \| A secret containing a static cloud key \| Mounted into the pod as an environment variable or file \| The key is now in etcd, in any backup, and in anyone's `kubectl describe` output \| | |
| 23 | `04-phase-cloud-identity-architecture.md:1056` ▶ | az keyvault create \ --name "kv-payments-prod" \ --resource-group "rg-payments-prod" \ --location "southeastasia" \ --enable-rbac-authorization true \ --enable-purge-protection true \ --retention-days 90 | |
| 24 | `04-phase-cloud-identity-architecture.md:1065` ▶ | az role assignment create \ --assignee-object-id "$(az identity show --name id-payments-api \ --resource-group rg-payments-prod --query principalId --output tsv)" \ --assignee-principal-type ServicePrincipal \ --role "Key Vault Secrets User" \ --scope "/subscr … | |
| 25 | `04-phase-cloud-identity-architecture.md:1190` ▶ | terraform plan -out=tfplan.binary | |
| | | <sub>↑ # 1. Produce a plan.</sub> | |
| 26 | `04-phase-cloud-identity-architecture.md:1193` ▶ | terraform show -json tfplan.binary > tfplan.json | |
| | | <sub>↑ # 2. Convert it to JSON, which is the format policy engines consume.</sub> | |
| 27 | `04-phase-cloud-identity-architecture.md:1196` ▶ | conftest test --policy policy/ tfplan.json | |
| | | <sub>↑ # 3. Evaluate the policies against the plan.</sub> | |
| 28 | `04-phase-cloud-identity-architecture.md:1199` ▶ | opa eval --data policy/ --input tfplan.json "data.terraform.aws.deny" | |
| | | <sub>↑ # 4. Or run OPA directly if you prefer not to use the conftest wrapper.<br>↓ ```</sub> | |
| 29 | `04-phase-cloud-identity-architecture.md:1311` ▶ | az policy definition create \ --name "deny-public-ip-on-nics" \ --display-name "Deny public IP addresses on network interfaces" \ --rules @policy-rule-deny-public-ip.json \ --mode All | |
| 30 | `04-phase-cloud-identity-architecture.md:1318` ▶ | az policy assignment create \ --name "audit-public-ip" \ --policy "deny-public-ip-on-nics" \ --scope "/providers/Microsoft.Management/managementGroups/contoso-corp" \ --enforcement-mode DoNotEnforce | |
| 31 | `04-phase-cloud-identity-architecture.md:1325` ▶ | az policy assignment update \ --name "audit-public-ip" \ --scope "/providers/Microsoft.Management/managementGroups/contoso-corp" \ --enforcement-mode Default | |
| 32 | `04-phase-cloud-identity-architecture.md:1494` ▶ | aws cloudtrail lookup-events \ --lookup-attributes AttributeKey=EventName,AttributeValue=AssumeRole \ --start-time 2025-12-14T00:00:00Z \ --query 'Events[].CloudTrailEvent' \ --output text \ \| jq -r 'fromjson | |
| 33 | `04-phase-cloud-identity-architecture.md:1819` ▶ | aws ec2 describe-instances --region ap-southeast-1 --max-items 1 >/dev/null && echo "ec2: allowed as expected" | |
| 34 | `04-phase-cloud-identity-architecture.md:1822` ▶ | aws iam create-access-key --user-name some-existing-user | |
| | | <sub>↑ # 2. As the platform admin role, attempt the thing the boundary denies.<br>↓ # Expected: AccessDenied. If it succeeds, the boundary is not attached to this role.</sub> | |
| 35 | `04-phase-cloud-identity-architecture.md:1827` ▶ | aws sts get-caller-identity --query 'Arn' --output text | |
| | | <sub>↑ # number of "the boundary is broken" reports are "I am not that role".<br>↓ ```</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Sigma rule specification

*The Sigma specification fixes the field names a rule may carry, the values `status` may take, and the condition syntax. A rule with a field that does not exist validates on nobody's CI and converts to nothing on any backend.*

**Source to check against:** The Sigma specification (SigmaHQ/sigma-specification)

65 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-detection-at-scale.md:154` ▶ | status: experimental | |
| | | <sub>↑ id: 6c1a3f0e-6a5a-4c2f-9c2e-0d4d8b9e2a11<br>↓ description: ></sub> | |
| 2 | `01-phase-detection-at-scale.md:160` ▶ | references: | |
| | | <sub>↑ hunting input rather than a paging alert.<br>↓ - https://attack.mitre.org/techniques/T1059/001/</sub> | |
| 3 | `01-phase-detection-at-scale.md:163` ▶ | author: Your Name | |
| | | <sub>↑ - https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_powershell_exe<br>↓ date: 2026/03/14</sub> | |
| 4 | `01-phase-detection-at-scale.md:164` ▶ | date: 2026/03/14 | |
| | | <sub>↑ author: Your Name<br>↓ modified: 2026/03/14</sub> | |
| 5 | `01-phase-detection-at-scale.md:166` ▶ | logsource: | |
| | | <sub>↑ modified: 2026/03/14<br>↓ category: process_creation</sub> | |
| 6 | `01-phase-detection-at-scale.md:169` ▶ | detection: | |
| | | <sub>↑ product: windows<br>↓ selection_image:</sub> | |
| 7 | `01-phase-detection-at-scale.md:179` ▶ | condition: selection_image and selection_encoded | |
| | | <sub>↑ - '-ec '<br>↓ fields:</sub> | |
| 8 | `01-phase-detection-at-scale.md:180` ▶ | fields: | |
| | | <sub>↑ condition: selection_image and selection_encoded<br>↓ - CommandLine</sub> | |
| 9 | `01-phase-detection-at-scale.md:186` ▶ | falsepositives: | |
| | | <sub>↑ - Image<br>↓ - Software deployment and configuration management tools</sub> | |
| 10 | `01-phase-detection-at-scale.md:208` | `status: experimental` is doing real work in that rule. It is an honest statement that the rule has been written but not yet validated against production traffic. A rule that goes straight to production with no such stage is a rule nobody has agreed to live wi … | |
| 11 | `01-phase-detection-at-scale.md:744` ▶ | references: | |
| | | <sub>↑ on it. This is a telemetry-integrity detection, not a threat detection.<br>↓ - https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon</sub> | |
| 12 | `01-phase-detection-at-scale.md:746` ▶ | author: Your Name | |
| | | <sub>↑ - https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon<br>↓ date: 2026/03/22</sub> | |
| 13 | `01-phase-detection-at-scale.md:747` ▶ | date: 2026/03/22 | |
| | | <sub>↑ author: Your Name<br>↓ logsource:</sub> | |
| 14 | `01-phase-detection-at-scale.md:748` ▶ | logsource: | |
| | | <sub>↑ date: 2026/03/22<br>↓ product: windows</sub> | |
| 15 | `01-phase-detection-at-scale.md:751` ▶ | detection: | |
| | | <sub>↑ service: sysmon<br>↓ selection:</sub> | |
| 16 | `01-phase-detection-at-scale.md:755` ▶ | condition: selection | |
| | | <sub>↑ State: 'Stopped'<br>↓ fields:</sub> | |
| 17 | `01-phase-detection-at-scale.md:756` ▶ | fields: | |
| | | <sub>↑ condition: selection<br>↓ - Computer</sub> | |
| 18 | `01-phase-detection-at-scale.md:760` ▶ | falsepositives: | |
| | | <sub>↑ - User<br>↓ - Deliberate maintenance or upgrade by the endpoint team</sub> | |
| 19 | `01-phase-detection-at-scale.md:846` ▶ | detection: | |
| | | <sub>↑ ```yaml<br>↓ selection_image:</sub> | |
| 20 | `01-phase-detection-at-scale.md:851` ▶ | condition: selection_image and selection_encoded | |
| | | <sub>↑ CommandLine\|contains: '-enc'<br>↓ ```</sub> | |
| 21 | `01-phase-detection-at-scale.md:869` ▶ | detection: | |
| | | <sub>↑ ```yaml<br>↓ selection_image:</sub> | |
| 22 | `01-phase-detection-at-scale.md:890` ▶ | condition: selection_image and selection_encoded | |
| | | <sub>↑ CommandLine\|contains: '-enc JABzAD0A'<br>↓ and not filter_sccm and not filter_intune and not filter_backup</sub> | |
| 23 | `02-phase-threat-hunting.md:55` | - From finding to detection: rule logic, tuning, false-positive rate, and ownership | |
| | | <sub>↑ - The hunt document: a template with fixed fields<br>↓ - Hunt metrics: what to measure, and what measuring hunts badly does to a team</sub> | |
| 24 | `02-phase-threat-hunting.md:472` | **`in~`** is the case-insensitive membership operator; `in` would miss `RUNDLL32.EXE`. On Windows filenames, always use the case-insensitive form. | |
| 25 | `02-phase-threat-hunting.md:474` | **`has_any`** is a term-level match that respects word boundaries and is much faster than `contains`. For path fragments with backslashes, the verbatim string literal `@"...\"` avoids escaping confusion. | |
| 26 | `02-phase-threat-hunting.md:558` ▶ | status: experimental | |
| | | <sub>↑ id: 4f2a9c31-7b6e-4d18-9c05-8e0a1d2f3b47<br>↓ description: Detects rundll32, regsvr32 or mshta launched with an argument</sub> | |
| 27 | `02-phase-threat-hunting.md:561` ▶ | references: | |
| | | <sub>↑ pointing into a user-writable directory, consistent with T1218 proxy execution.<br>↓ - https://attack.mitre.org/techniques/T1218/</sub> | |
| 28 | `02-phase-threat-hunting.md:563` ▶ | author: Your Name | |
| | | <sub>↑ - https://attack.mitre.org/techniques/T1218/<br>↓ date: 2026/04/06</sub> | |
| 29 | `02-phase-threat-hunting.md:564` ▶ | date: 2026/04/06 | |
| | | <sub>↑ author: Your Name<br>↓ tags:</sub> | |
| 30 | `02-phase-threat-hunting.md:570` ▶ | logsource: | |
| | | <sub>↑ - attack.t1218.005<br>↓ category: process_creation</sub> | |
| 31 | `02-phase-threat-hunting.md:573` ▶ | detection: | |
| | | <sub>↑ product: windows<br>↓ selection_image:</sub> | |
| 32 | `02-phase-threat-hunting.md:586` ▶ | condition: selection_image and selection_path | |
| | | <sub>↑ - '\Users\Public\'<br>↓ falsepositives:</sub> | |
| 33 | `02-phase-threat-hunting.md:587` ▶ | falsepositives: | |
| | | <sub>↑ condition: selection_image and selection_path<br>↓ - Software installers that register components from a per-user directory</sub> | |
| 34 | `05-phase-adversary-emulation.md:638` ▶ | status: experimental | |
| | | <sub>↑ id: 8b1d0f3c-5e42-4a91-9c07-2f6ab3d81e55<br>↓ description: \|</sub> | |
| 35 | `05-phase-adversary-emulation.md:645` ▶ | references: | |
| | | <sub>↑ reliable discriminator between administrative and malicious use.<br>↓ - https://attack.mitre.org/techniques/T1059/001/</sub> | |
| 36 | `05-phase-adversary-emulation.md:648` ▶ | author: Your Name | |
| | | <sub>↑ - https://attack.mitre.org/techniques/T1204/002/<br>↓ date: 2026/04/08</sub> | |
| 37 | `05-phase-adversary-emulation.md:649` ▶ | date: 2026/04/08 | |
| | | <sub>↑ author: Your Name<br>↓ logsource:</sub> | |
| 38 | `05-phase-adversary-emulation.md:650` ▶ | logsource: | |
| | | <sub>↑ date: 2026/04/08<br>↓ category: process_creation</sub> | |
| 39 | `05-phase-adversary-emulation.md:653` ▶ | detection: | |
| | | <sub>↑ product: windows<br>↓ selection_parent:</sub> | |
| 40 | `05-phase-adversary-emulation.md:674` ▶ | condition: selection_parent and selection_child and selection_flags | |
| | | <sub>↑ - 'FromBase64String'<br>↓ falsepositives:</sub> | |
| 41 | `05-phase-adversary-emulation.md:675` ▶ | falsepositives: | |
| | | <sub>↑ condition: selection_parent and selection_child and selection_flags<br>↓ - A signed Office add-in that legitimately calls a script host</sub> | |
| 42 | `05-phase-adversary-emulation.md:908` ▶ | status: experimental | |
| | | <sub>↑ id: 3c9a71e0-2d84-4f16-b0a5-6e1c9d5a7f22<br>↓ description: \|</sub> | |
| 43 | `05-phase-adversary-emulation.md:914` ▶ | references: | |
| | | <sub>↑ was being dropped by configuration before any rule could see it.<br>↓ - https://attack.mitre.org/techniques/T1547/001/</sub> | |
| 44 | `05-phase-adversary-emulation.md:916` ▶ | author: Your Name | |
| | | <sub>↑ - https://attack.mitre.org/techniques/T1547/001/<br>↓ date: 2026/04/09</sub> | |
| 45 | `05-phase-adversary-emulation.md:917` ▶ | date: 2026/04/09 | |
| | | <sub>↑ author: Your Name<br>↓ logsource:</sub> | |
| 46 | `05-phase-adversary-emulation.md:918` ▶ | logsource: | |
| | | <sub>↑ date: 2026/04/09<br>↓ category: registry_set</sub> | |
| 47 | `05-phase-adversary-emulation.md:921` ▶ | detection: | |
| | | <sub>↑ product: windows<br>↓ selection:</sub> | |
| 48 | `05-phase-adversary-emulation.md:937` ▶ | condition: selection and not filter_installers and not filter_signed_paths | |
| | | <sub>↑ - '\Program Files (x86)\'<br>↓ falsepositives:</sub> | |
| 49 | `05-phase-adversary-emulation.md:938` ▶ | falsepositives: | |
| | | <sub>↑ condition: selection and not filter_installers and not filter_signed_paths<br>↓ - User-installed portable applications that write a Run key</sub> | |
| 50 | `06-phase-programme-and-influence.md:571` ▶ | Decision date: 14 April 2026 | |
| | | <sub>↑ Decided by: Head of Infrastructure, 14 April 2026</sub> | |
| 51 | `06-phase-programme-and-influence.md:673` ▶ | Review date: 1 November 2026, or on a change of either role holder. | |
| | | <sub>↑ Effective: 1 May 2026<br>↓ ```</sub> | |
| 52 | `06-phase-programme-and-influence.md:759` ▶ | Review date: 30 June 2026 (hard expiry — see Expiry) | |
| | | <sub>↑ Risk owner: Head of Infrastructure<br>↓ Register entry: RISK-0142, "Untested tier-1 recovery capability"</sub> | |
| 53 | `07-phase-detection-as-code.md:256` ▶ | status: experimental | |
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

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Detection-as-code tool flags and status

*`sigma check` is the gate a detection-as-code pipeline stands on, and its flags decide whether a bad rule can merge. Whether `--fail-on-issues` is the default is exactly the kind of fact a pipeline gets silently wrong.*

**Source to check against:** The sigma-cli (pySigma) project documentation and source; the pySigma README for the sigmac replacement claim

20 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-detection-at-scale.md:1299` | \| Sigma and sigma-cli \| Vendor-neutral rule format, and a converter to platform query languages \| Free/open-source \| https://sigmahq.io/ \| Write one rule and convert it with `sigma convert -t splunk rule.yml` \| Hand-written SPL or KQL kept in Git \| | |
| 2 | `02-phase-threat-hunting.md:616` | The older `sigmac` script you will find in blog posts is deprecated. Use `sigma-cli`. | |
| 3 | `07-phase-detection-as-code.md:51` | - `sigma-cli` and pySigma: the current toolchain, and why `sigmac` is not in it | |
| | | <sub>↑ - Unit testing rules with pytest, and the difference between a schema test and a logic test<br>↓ - Validation with `sigma check`, validator plugins, and a validation configuration file</sub> | |
| 4 | `07-phase-detection-as-code.md:52` | - Validation with `sigma check`, validator plugins, and a validation configuration file | |
| | | <sub>↑ - `sigma-cli` and pySigma: the current toolchain, and why `sigmac` is not in it<br>↓ - CI/CD for detections: a GitHub Actions pipeline, artifacts, and required status checks</sub> | |
| 5 | `07-phase-detection-as-code.md:384` | **That table is not a disclaimer; it is the reason you need three kinds of test.** A simple fixture harness checks that examples are present; a backend validation with `sigma check` covers structure and conventions. To test whether the rule matches positive an … | |
| 6 | `07-phase-detection-as-code.md:532` | `sigma check` is the real subcommand, and its flags are worth knowing precisely: `--fail-on-error` (the default) fails on parsing errors, `--fail-on-issues` fails on validation issues, `--validation-config` or `-c` points at a YAML configuration file, `--exclu … | |
| 7 | `07-phase-detection-as-code.md:550` | You will find `sigmac` in blog posts, in older internal documentation, and in half the conversion recipes on the internet. **It is the retired legacy Sigma toolchain.** pySigma describes itself in its own README as "a replacement for the legacy Sigma toolchain … | |
| 8 | `07-phase-detection-as-code.md:552` | \| \| `sigmac` (retired) \| `sigma-cli` (current) \| | |
| | | <sub>↓ \|---\|---\|---\|</sub> | |
| 9 | `07-phase-detection-as-code.md:557` | \| Discovery \| Read the source to find supported targets \| `sigma list`, `sigma plugin list` \| | |
| | | <sub>↑ \| Pipelines \| Configuration files \| Processing pipeline objects, also plugin-provided \|<br>↓ \| Validation \| Not provided \| `sigma check` with validator plugins \|</sub> | |
| 10 | `07-phase-detection-as-code.md:558` | \| Validation \| Not provided \| `sigma check` with validator plugins \| | |
| | | <sub>↑ \| Discovery \| Read the source to find supported targets \| `sigma list`, `sigma plugin list` \|<br>↓ \| Status \| Legacy, replaced \| Current, a replacement for the legacy toolchain \|</sub> | |
| 11 | `07-phase-detection-as-code.md:561` | If you follow a tutorial that tells you to run `sigmac`, you are following a tutorial written for a tool that the project it belongs to has replaced. The correct response is to find the current tool's equivalent, not to install the old one. | |
| 12 | `07-phase-detection-as-code.md:654` | **`--fail-on-issues` is not the default.** `sigma check` fails on errors by default but passes on validation issues unless you ask for the stricter behaviour. If you want an empty `falsepositives` list to block a merge, you must say so. | |
| 13 | `07-phase-detection-as-code.md:666` | \| `sigma check` reports a parse error \| YAML indentation or an unquoted special character \| Fix the rule; commonly a backslash or a leading `*` \| | |
| 14 | `07-phase-detection-as-code.md:718` | \| Output directory \| `--output-dir` \| One file per rule, which is what you want in Git \| | |
| | | <sub>↑ \| Backend option \| `-O` \| Backend-specific behaviour, as `key=value` \|</sub> | |
| 15 | `07-phase-detection-as-code.md:1187` | **In an interview, say:** “I run my detections as code — Sigma rules in Git, fixtures for positive, negative, and near-miss cases, a CI pipeline that validates with `sigma check` and runs the tests, and conversion artifacts for each backend. I have measured pr … | |
| 16 | `07-phase-detection-as-code.md:1202` | - **`sigmac` is the retired legacy toolchain.** pySigma describes itself as its replacement and `sigma-cli` as the command-line equivalent. Use `sigma-cli`. | |
| 17 | `07-phase-detection-as-code.md:1203` | - **`sigma check` fails on errors by default but passes on issues unless you pass `--fail-on-issues`.** If you want an empty `falsepositives` list to block a merge, you must ask for the stricter behaviour. | |
| 18 | `07-phase-detection-as-code.md:1223` | 5. **Wire the pipeline** (task 5) as a GitHub Actions workflow that validates with `sigma check`, runs the tests, converts for two targets, and uploads the artifacts. Then open a PR that deliberately breaks a rule and confirm CI blocks it. | |
| 19 | `07-phase-detection-as-code.md:1239` | \| sigma-cli \| Converts Sigma rules to backend query languages and validates them \| Free/open-source \| https://github.com/SigmaHQ/sigma-cli \| Run `sigma check --fail-on-error --fail-on-issues rules/` on your migrated rules \| Hand-written queries per platf … | |
| 20 | `07-phase-detection-as-code.md:1302` | - A GitHub Actions workflow that validates with `sigma check`, runs the tests, converts, and uploads artifacts | |

---

## SIEM search language (SPL)

*A hunt query that does not parse is a hunt that never runs, and a query that parses but means something else is worse — it returns confident nonsense. Both are invisible to a reader who cannot run Splunk.*

**Source to check against:** Splunk Search Manual (docs.splunk.com) for the named command or function

66 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
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
| 41 | `02-phase-threat-hunting.md:871` ▶ | \| where EventID == 1 | |
| | | <sub>↑ \| where Source == "Microsoft-Windows-Sysmon"<br>↓ \| extend Image = tostring(EventData.Image)</sub> | |
| 42 | `02-phase-threat-hunting.md:877` ▶ | \| join kind=inner (procs) on Computer | |
| | | <sub>↑ tasks<br>↓ \| where ProcTime between (TaskTime .. (TaskTime + 5m))</sub> | |
| 43 | `02-phase-threat-hunting.md:878` ▶ | \| where ProcTime between (TaskTime .. (TaskTime + 5m)) | |
| | | <sub>↑ \| join kind=inner (procs) on Computer<br>↓ \| project TaskTime, ProcTime, Computer, CreatedBy, TaskName, Image, CommandLine, ParentImage</sub> | |
| 44 | `02-phase-threat-hunting.md:880` ▶ | \| sort by TaskTime desc | |
| | | <sub>↑ \| project TaskTime, ProcTime, Computer, CreatedBy, TaskName, Image, CommandLine, ParentImage<br>↓ ```</sub> | |
| 45 | `02-phase-threat-hunting.md:896` ▶ | \| where TimeGenerated > start | |
| | | <sub>↑ SecurityEvent<br>↓ \| where EventID == 4698</sub> | |
| 46 | `02-phase-threat-hunting.md:897` ▶ | \| where EventID == 4698 | |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| extend TaskName = tostring(EventData.TaskName)</sub> | |
| 47 | `02-phase-threat-hunting.md:903` ▶ | \| where TimeGenerated > start | |
| | | <sub>↑ Event<br>↓ \| where Source == "Microsoft-Windows-Sysmon"</sub> | |
| 48 | `02-phase-threat-hunting.md:904` ▶ | \| where Source == "Microsoft-Windows-Sysmon" | |
| | | <sub>↑ \| where TimeGenerated > start<br>↓ \| where EventID == 1</sub> | |
| 49 | `02-phase-threat-hunting.md:905` ▶ | \| where EventID == 1 | |
| | | <sub>↑ \| where Source == "Microsoft-Windows-Sysmon"<br>↓ \| extend Image = tostring(EventData.Image)</sub> | |
| 50 | `02-phase-threat-hunting.md:910` ▶ | \| where Leaf in~ (interpreters) | |
| | | <sub>↑ \| extend Leaf = tolower(tostring(split(Image, "\\")[-1]))<br>↓ or CommandLine has_any (@"\AppData\", @"\Temp\", @"\ProgramData\",</sub> | |
| 51 | `02-phase-threat-hunting.md:915` ▶ | \| join kind=inner (interesting) on Computer | |
| | | <sub>↑ tasks<br>↓ \| where ProcTime between (TaskTime .. (TaskTime + 5m))</sub> | |
| 52 | `02-phase-threat-hunting.md:916` ▶ | \| where ProcTime between (TaskTime .. (TaskTime + 5m)) | |
| | | <sub>↑ \| join kind=inner (interesting) on Computer<br>↓ \| extend SecondsAfter = datetime_diff("second", ProcTime, TaskTime)</sub> | |
| 53 | `02-phase-threat-hunting.md:920` ▶ | \| sort by SecondsAfter asc | |
| | | <sub>↑ Image, CommandLine, ParentImage<br>↓ ```</sub> | |
| 54 | `04-phase-cloud-identity-architecture.md:601` ▶ | aws cloudtrail lookup-events \ --lookup-attributes AttributeKey=Username,AttributeValue=PaymentsApiTaskRole \ --start-time 2025-12-14T00:00:00Z \ --end-time 2026-03-14T00:00:00Z \ --query 'Events[].CloudTrailEvent' \ --output text \ \| jq -r 'fromjson \| "\(.e … | |
| 55 | `04-phase-cloud-identity-architecture.md:1451` ▶ | \| where TimeGenerated > ago(90d) | |
| | | <sub>↑ SigninLogs<br>↓ \| where UserPrincipalName in (</sub> | |
| 56 | `04-phase-cloud-identity-architecture.md:1452` ▶ | \| where UserPrincipalName in ( | |
| | | <sub>↑ \| where TimeGenerated > ago(90d)<br>↓ "breakglass-01@contoso.onmicrosoft.com",</sub> | |
| 57 | `04-phase-cloud-identity-architecture.md:1457` ▶ | \| sort by TimeGenerated desc | |
| | | <sub>↑ ResultType, ResultDescription, ConditionalAccessStatus<br>↓ ```</sub> | |
| 58 | `04-phase-cloud-identity-architecture.md:1464` ▶ | \| where TimeGenerated > ago(7d) | |
| | | <sub>↑ SigninLogs<br>↓ \| where ResultType == 0</sub> | |
| 59 | `04-phase-cloud-identity-architecture.md:1465` ▶ | \| where ResultType == 0 | |
| | | <sub>↑ \| where TimeGenerated > ago(7d)<br>↓ \| where LocationDetails.countryOrRegion != "PH"</sub> | |
| 60 | `04-phase-cloud-identity-architecture.md:1466` ▶ | \| where LocationDetails.countryOrRegion != "PH" | |
| | | <sub>↑ \| where ResultType == 0<br>↓ \| where IPAddress !in ("203.0.113.10", "203.0.113.11")</sub> | |
| 61 | `04-phase-cloud-identity-architecture.md:1467` ▶ | \| where IPAddress !in ("203.0.113.10", "203.0.113.11") | |
| | | <sub>↑ \| where LocationDetails.countryOrRegion != "PH"<br>↓ \| project TimeGenerated, UserPrincipalName, AppDisplayName, IPAddress,</sub> | |
| 62 | `04-phase-cloud-identity-architecture.md:1470` ▶ | \| sort by TimeGenerated desc | |
| | | <sub>↑ LocationDetails.countryOrRegion, ConditionalAccessStatus, RiskLevelDuringSignIn<br>↓ ```</sub> | |
| 63 | `04-phase-cloud-identity-architecture.md:1477` ▶ | \| where TimeGenerated > ago(30d) | |
| | | <sub>↑ AuditLogs<br>↓ \| where OperationName in (</sub> | |
| 64 | `04-phase-cloud-identity-architecture.md:1478` ▶ | \| where OperationName in ( | |
| | | <sub>↑ \| where TimeGenerated > ago(30d)<br>↓ "Add member to role",</sub> | |
| 65 | `04-phase-cloud-identity-architecture.md:1485` ▶ | \| sort by TimeGenerated desc | |
| | | <sub>↑ \| project TimeGenerated, OperationName, Actor, Target, Result<br>↓ ```</sub> | |
| 66 | `07-phase-detection-as-code.md:806` ▶ | grep -rho 'attack\.t[0-9]\{4\}\(\.[0-9]\{3\}\)\?' rules/ \ \| sort \| uniq -c \| sort -rn | |
| | | <sub>↑ # List the technique tags actually present in the repository.<br>↓ ```</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Windows event IDs, channels and field names

*An event ID and its field names are published by Microsoft. A detector built on a field that does not exist compiles, deploys, and matches nothing — the failure a detection engineer can least afford, because it looks like the absence of threats.*

**Source to check against:** Microsoft Learn (audit event IDs, Sysmon schema, process access rights) for the named event or field

20 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
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

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Living-off-the-land binaries and their command lines

*These are signed Windows binaries whose abuse is documented by the LOLBAS project. A wrong command-line claim teaches a reader to search for the wrong thing, which is a rule that never fires.*

**Source to check against:** The LOLBAS project (lolbas-project.github.io) for the named binary and what it can do

19 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
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

---

## Rego and OPA semantics

*A policy-as-code rule's behaviour depends on how the language treats an undefined value. `field == null` and `not field` are not the same test, and the difference decides whether a rule fires on a resource that lacks the field entirely.*

**Source to check against:** The Open Policy Agent policy language reference

4 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `04-phase-cloud-identity-architecture.md:1238` ▶ | policy := json.unmarshal(resource.change.after.assume_role_policy) | |
| | | <sub>↑ resource.type == "aws_iam_role"<br>↓ statement := policy.Statement[_]</sub> | |
| 2 | `04-phase-cloud-identity-architecture.md:1257` | **`not resource.change.after.permissions_boundary` is the correct test for absence**, not `== null`. In Rego, comparing a missing field to null is undefined, and an undefined body does not make the rule fire — so the check silently passes when the attribute is … | |
| 3 | `04-phase-cloud-identity-architecture.md:1898` | - **Use `not field` in Rego, not `field == null`.** A missing field makes the comparison undefined and the rule silently passes. | |
| 4 | `04-phase-cloud-identity-architecture.md:2092` | **Why:** A missing field makes the equality comparison undefined, and the rule passes without evaluating anything — a guardrail that fails open. Assuming a syntax problem is the trap: the expression is valid, and the danger is precisely that it looks correct w … | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Claims per phase

| Phase | cidr | port | command | record | protocol | version | registry | number | cve | attack | standard | cybercmd | crypto | cloudpolicy | cloudcli | detectionspec | detectiontool | siem | winevent | lolbin | rego | total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 detection-at-scale |  |  |  |  |  | 1 |  | 33 |  | 20 |  |  |  |  |  | 22 | 1 |  | 5 | 4 |  | **86** |
| 02 threat-hunting |  | 4 | 1 |  |  |  |  | 56 |  | 25 |  | 2 |  |  |  | 11 | 1 | 53 | 9 | 5 |  | **167** |
| 03 incident-command |  | 41 |  |  |  |  |  | 23 |  |  | 2 |  |  |  |  |  |  |  |  |  |  | **66** |
| 04 cloud-identity-architecture |  | 11 |  |  | 17 |  |  | 8 |  |  | 4 | 8 |  | 139 | 35 |  |  | 12 |  |  | 4 | **238** |
| 05 adversary-emulation |  | 3 | 2 |  |  | 9 | 2 | 4 |  | 33 | 1 | 2 |  |  |  | 16 |  |  | 6 | 9 |  | **87** |
| 06 programme-and-influence |  |  |  |  |  |  |  | 42 |  |  | 5 |  |  |  |  | 3 |  |  |  |  |  | **50** |
| 07 detection-as-code |  |  |  |  |  |  |  | 7 |  | 5 |  | 1 |  |  |  | 13 | 18 | 1 |  | 1 |  | **46** |

