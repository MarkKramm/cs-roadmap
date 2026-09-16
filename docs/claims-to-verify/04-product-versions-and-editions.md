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

17 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-computer-fundamentals.md:112` | The same information is available without a terminal: press **Ctrl+Shift+Esc** for Task Manager, click the **Performance** tab, and select **CPU**. You will see the model name, the core count, the current speed, and a live graph. For a fuller report, search th … | |
| 2 | `01-phase-computer-fundamentals.md:449` | 2. **Let Windows Update handle it when it can.** On modern Windows 10 and 11, most drivers install automatically and correctly. Manually chasing the newest driver is rarely necessary and occasionally harmful. | |
| 3 | `06-phase-tools-and-ticketing.md:248` | 4. **Check the version and date.** A guide written for Windows 10 may be subtly wrong on Windows 11. A page about an old admin portal may describe buttons that no longer exist. | |
| 4 | `06-phase-tools-and-ticketing.md:1066` ▶ | Service : Microsoft 365 Outlook desktop, Windows 11, version 2401 build 17231 | |
| | | <sub>↑ Category : Email (client)<br>↓ Repro : 1. Launch Outlook from Start. 2. Splash screen appears.</sub> | |
| 5 | `08-phase-portfolio-and-resume.md:320` ▶ | Operating systems : Windows 10/11 (user and group management, NTFS permissions, services, | |
| | | <sub>↑ TECHNICAL SKILLS<br>↓ Event Viewer), Ubuntu Server (users, systemd, permissions, log review)</sub> | |
| 6 | `08-phase-portfolio-and-resume.md:701` ▶ | Install Ubuntu Server 24.04 in a VirtualBox VM and prove I can do four | |
| | | <sub>↓ things from the command line without a GUI: create a user, put them in a</sub> | |
| 7 | `08-phase-portfolio-and-resume.md:709` ▶ | \| Host \| Windows 11, 8 GB RAM \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Virtualisation \| Enabled in BIOS (see "What went wrong") \|</sub> | |
| 8 | `08-phase-portfolio-and-resume.md:712` ▶ | \| Guest \| Ubuntu Server 24.04 LTS, 2 GB RAM, 20 GB disk \| | |
| | | <sub>↑ \| VirtualBox \| 7.0.14 \|<br>↓ \| Network \| NAT, with a port forward `2222 → 22` so the host can reach SSH \|</sub> | |
| 9 | `08-phase-portfolio-and-resume.md:885` ▶ | Operating systems : [Windows 10/11: users, groups, NTFS permissions, services, Event Viewer] | |
| | | <sub>↑ TECHNICAL SKILLS<br>↓ [Ubuntu Server: users, systemd, permissions, /var/log review]</sub> | |
| 10 | `08-phase-portfolio-and-resume.md:996` | \| After \| Created local users and groups in Windows 11 and demonstrated how inherited and explicit NTFS permissions combine with share permissions to determine effective access. \| | |
| 11 | `08-phase-portfolio-and-resume.md:1035` | \| Name the tool or system \| VirtualBox, Windows 11, osTicket, pfSense \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Name the action \| Built, configured, diagnosed, created, verified \|</sub> | |
| 12 | `08-phase-portfolio-and-resume.md:1067` | \| 2 \| PowerShell 7, `Get-CimInstance` for OS and disk, `Get-Service` filtered to `Running`, `Export-Csv` for the output. \| | |
| 13 | `08-phase-portfolio-and-resume.md:1098` | \| 1 \| I studied how Active Directory organises users, groups, and organisational units, and I read about Group Policy. I practised the equivalent concepts — local users, local groups, permissions — on a standalone Windows 11 machine. \| | |
| 14 | `08-phase-portfolio-and-resume.md:1099` | \| 2 \| Windows 11 local users and groups. I have not installed or administered a domain controller. \| | |
| | | <sub>↑ \| 1 \| I studied how Active Directory organises users, groups, and organisational units, and I read about Group Policy. I practised the equivalent co …<br>↓ \| 3 \| Nothing went wrong, because I did not do it. I followed a tutorial's screenshots rather than running my own domain. \|</sub> | |
| 15 | `08-phase-portfolio-and-resume.md:1108` | \| Experienced with Active Directory and Windows Server administration. \| Studied Active Directory concepts and practised user and group management, permissions, and least privilege on a standalone Windows 11 machine; a Windows Server domain controller lab is … | |
| 16 | `09-phase-job-application-plan.md:535` ▶ | accounts; manage M365 users; troubleshoot Windows 10/11, printers, | |
| | | <sub>↑ Do: triage tickets by email/chat/phone; reset passwords and unlock<br>↓ and VPN; document every ticket in our PSA (professional services automation — the ticketing and billing system MSPs run; here, ConnectWise); escalate</sub> | |
| 17 | `09-phase-job-application-plan.md:578` ▶ | What I can do now: Windows 10/11 troubleshooting, M365 user and | |
| | | <sub>↓ group administration, password resets and account unlocks, TCP/IP</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._
