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

# Command and cmdlet usage — rows 153 onward

This is the CONTINUATION of a table whose earlier rows were already verified. **Verify only the rows below.** Do not restate or re-check earlier rows.

| 153 | `08-phase-portfolio-and-resume.md:114` | \| "Know Linux." \| "Installed and administered Ubuntu Server in a VM: user and group management, `systemctl` service control, permissions with `chmod` and `chown`, log review in `/var/log`." \| | |
| 154 | `08-phase-portfolio-and-resume.md:489` | **"How did you verify?"** A `ping` from the first subnet to the router's second interface, then to the host on the second subnet, then `tracert` to confirm the path actually went through pfSense rather than resolving locally. Then a Wireshark capture to see th … | |
| 155 | `08-phase-portfolio-and-resume.md:755` ▶ | running. `systemctl status ssh` showed `active (running)`, so the service was | |
| | | <sub>↑ **Second failure:** SSH was refused from the host even though the server was<br>↓ fine and the problem was the network. The VM was on NAT, and NAT does not let</sub> | |
| 156 | `08-phase-portfolio-and-resume.md:768` ▶ | \| Service controllable \| `systemctl status ssh` showed `active (running)` \| | |
| | | <sub>↑ \| User and group created \| `id labadmin` showed `uid=1001(labadmin) gid=1001(labadmin) groups=1001(labadmin),1002(helpdesk)` \|<br>↓ \| Log reading works \| `journalctl -u ssh -n 20` showed the accepted-connection line \|</sub> | |
| 157 | `08-phase-portfolio-and-resume.md:770` ▶ | \| SSH reachable \| `ssh labadmin@127.0.0.1 -p 2222` connected from the host \| | |
| | | <sub>↑ \| Log reading works \| `journalctl -u ssh -n 20` showed the accepted-connection line \|</sub> | |
| 158 | `08-phase-portfolio-and-resume.md:776` ▶ | - `systemctl status <unit>` is the first command to run for any service | |
| | | <sub>↑ Reading the error literally would have saved 40 minutes.<br>↓ problem — it distinguishes "not running" from "running but refusing".</sub> | |
| 159 | `08-phase-portfolio-and-resume.md:1067` | \| 2 \| PowerShell 7, `Get-CimInstance` for OS and disk, `Get-Service` filtered to `Running`, `Export-Csv` for the output. \| | |
| 160 | `09-phase-job-application-plan.md:719` | - Strong: "A user said the internet was down. I pinged `8.8.8.8` first — that worked, so routing and upstream were fine. `ping google.com` failed, so it was name resolution. `nslookup` against the local resolver got no answer, while `nslookup google.com 8.8.8. … | |
