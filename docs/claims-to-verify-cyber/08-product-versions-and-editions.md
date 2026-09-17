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

# Product versions and editions


*The class most likely to ROT. A claim that is true today may be false after a release, so these carry a shelf life the others do not.*

**Source to check against:** Vendor documentation, checked against the current release

9 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:683` | **Windows has no `ssh-copy-id`.** The OpenSSH client ships with Windows 10 and 11, but the key-install helper does not. Append the key yourself instead — from PowerShell: | |
| 2 | `04-phase-hands-on-labs.md:814` ▶ | \| lab-wazuh \| SIEM manager \| 192.168.56.10 \| Ubuntu Server 24.04 \| clean-install \| | |
| | | <sub>↑ \|---\|---\|---\|---\|---\|<br>↓ \| lab-ubuntu \| Victim \| 192.168.56.20 \| Ubuntu Server 24.04 \| clean-install \|</sub> | |
| 3 | `04-phase-hands-on-labs.md:815` ▶ | \| lab-ubuntu \| Victim \| 192.168.56.20 \| Ubuntu Server 24.04 \| clean-install \| | |
| | | <sub>↑ \| lab-wazuh \| SIEM manager \| 192.168.56.10 \| Ubuntu Server 24.04 \| clean-install \|<br>↓ \| lab-win10 \| Victim \| 192.168.56.30 \| Windows 10 Eval \| clean-install \|</sub> | |
| 4 | `04-phase-hands-on-labs.md:816` ▶ | \| lab-win10 \| Victim \| 192.168.56.30 \| Windows 10 Eval \| clean-install \| | |
| | | <sub>↑ \| lab-ubuntu \| Victim \| 192.168.56.20 \| Ubuntu Server 24.04 \| clean-install \|</sub> | |
| 5 | `11-phase-incident-response.md:486` | You have an image of a Windows 10 workstation, and a hypothesis: the user opened a malicious document, and something executed. | |
| 6 | `11-phase-incident-response.md:688` ▶ | └── Target VM — Windows 10 evaluation, 4 GB RAM, snapshot taken | |
| | | <sub>↑ │ Internet access is fine; it holds no malware<br>↓ Host-only network. No shared folders.</sub> | |
| 7 | `11-phase-incident-response.md:991` | \| Host \| `WKS-014`, Windows 10, user `LAB\jsantos` \| | |
| | | <sub>↑ \| Alert \| Suspicious process execution from a user temp directory \|<br>↓ \| Detection \| EDR rule firing on `svchost.exe` running from `AppData\Local\Temp` \|</sub> | |
| 8 | `12-phase-scripting-automation.md:1240` ▶ | - Python 3.10 or newer | |
| | | <sub>↓ - A VirusTotal API key (the free public API is sufficient)</sub> | |
| 9 | `13-phase-grc-compliance.md:164` | \| **Baseline** \| The configured state of a system type \| Varies \| With each platform version \| "Windows 11 hardening baseline, v3." \| | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._
