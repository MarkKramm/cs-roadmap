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

---

# This bundle covers 1 claim class, 48 rows total.

**Answer every row in every table below, in order, and output the tables complete.**
Do not summarise and do not sample. If you run low on room, stop at a row boundary
and say which table and row number to continue from — a continuation is cheap and
an incomplete table is not.

---

<!-- 09-command-and-cmdlet-usage.md — 48 rows -->

# Command and cmdlet usage


*Flags, parameters and syntax are fixed by the tool's own documentation. A wrong flag in a worked example is executable code that silently cannot run.*

**Source to check against:** Microsoft Learn for cmdlets, man pages for POSIX tools

48 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:53` | - SSH keys and `sshd` | |
| | | <sub>↑ - Users/groups/sudo<br>↓ - Services with `systemctl`</sub> | |
| 2 | `02-phase-networking-and-linux.md:54` | - Services with `systemctl` | |
| | | <sub>↑ - SSH keys and `sshd`<br>↓ - Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog`</sub> | |
| 3 | `02-phase-networking-and-linux.md:56` | - Networking: `ip a`, `ip route`, `ss -tulpn`, `dig`, `curl` | |
| | | <sub>↑ - Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog`<br>↓ - Text processing: `grep`, `awk` basics, `sed` basics, pipes/redirection</sub> | |
| 4 | `02-phase-networking-and-linux.md:57` | - Text processing: `grep`, `awk` basics, `sed` basics, pipes/redirection | |
| | | <sub>↑ - Networking: `ip a`, `ip route`, `ss -tulpn`, `dig`, `curl`</sub> | |
| 5 | `02-phase-networking-and-linux.md:114` | \| `ssh user@your-vm` \| Learning \| Unauthorised access \| | |
| | | <sub>↑ \| `tcpdump` on your own interface \| Learning \| Potentially unlawful interception \|</sub> | |
| 6 | `02-phase-networking-and-linux.md:351` | **ICMP** is the diagnostic protocol behind `ping` (echo request / echo reply) and the “destination unreachable” and “time exceeded” messages. | |
| 7 | `02-phase-networking-and-linux.md:382` | \| **Headers** \| Metadata about the request or response \| `Set-Cookie` (and whether it has `HttpOnly` and `Secure` flags), `Content-Security-Policy`, `Server` (leaks software versions, useful to an attacker), `Authorization` \| | |
| 8 | `02-phase-networking-and-linux.md:385` | You can read all of this with `curl`, which is phase task 7's companion. `curl -I https://example.com` printing real response headers is worth more than any description. | |
| 9 | `02-phase-networking-and-linux.md:521` | \| `chmod 755 script.sh` \| Owner full rights; everyone else read-and-execute \| A script other people need to run \| | |
| 10 | `02-phase-networking-and-linux.md:522` | \| `chmod 600 id_rsa` \| Only the owner may read and write \| Exactly what SSH requires for a private key — and the reason you will see “permissions are too open” errors when you get it wrong \| | |
| 11 | `02-phase-networking-and-linux.md:523` | \| `chmod 644 file.txt` \| Owner reads and writes; everyone else reads \| The ordinary setting for a non-executable file \| | |
| 12 | `02-phase-networking-and-linux.md:525` | Ownership changes with `chown user:group file`. Only root can give a file away to another user, which is a deliberate restriction. | |
| 13 | `02-phase-networking-and-linux.md:569` | **SSH** gives you an encrypted shell on a remote machine. The server is `sshd` — the SSH *daemon*, where a daemon is a background service. It is configured in `/etc/ssh/sshd_config`, and it listens on port 22 by default. | |
| 14 | `02-phase-networking-and-linux.md:591` | **Windows has no `ssh-copy-id`.** The OpenSSH client ships with Windows 10 and 11, but the key-install helper does not. Append the key yourself instead — from PowerShell: | |
| 15 | `02-phase-networking-and-linux.md:610` | Modern Linux uses **systemd** to manage services, through `systemctl`: | |
| 16 | `02-phase-networking-and-linux.md:638` | The security relevance of this command is direct: **you cannot defend a host whose services you cannot enumerate.** Asking “what is running, and should it be?” is the first question of host hardening, and `systemctl list-units --type=service` answers it. | |
| 17 | `02-phase-networking-and-linux.md:665` | Watch the failures appear. Then use `grep` to pull the failed attempts out of `/var/log/auth.log`. | |
| 18 | `02-phase-networking-and-linux.md:764` | \| `grep "Failed password" /var/log/auth.log` \| Find the failed-password lines \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \|</sub> | |
| 19 | `02-phase-networking-and-linux.md:765` | \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \| | |
| | | <sub>↑ \| `grep "Failed password" /var/log/auth.log` \| Find the failed-password lines \|<br>↓ \| `awk '{print $2}'` \| Extract the address — field 2 of `from 203.0.113.45` \|</sub> | |
| 20 | `02-phase-networking-and-linux.md:766` | \| `awk '{print $2}'` \| Extract the address — field 2 of `from 203.0.113.45` \| | |
| | | <sub>↑ \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \|<br>↓ \| `sort` \| Order them so identical addresses are adjacent \|</sub> | |
| 21 | `02-phase-networking-and-linux.md:772` | That is a real investigation query, built from small pieces, and it is the shape of most log analysis you will do. **`awk '{print $N}'` extracts the Nth whitespace-separated field** — that is the 90% of awk you need at this stage. | |
| 22 | `02-phase-networking-and-linux.md:774` | **Why not just `awk '{print $6}'`?** Because the field number moves. In `Failed password for root from 203.0.113.45 ...` the address is field 6, but in `Failed password for invalid user admin from 203.0.113.45 ...` the words `invalid user` push it to field 8.  … | |
| 23 | `02-phase-networking-and-linux.md:818` | \| 2 \| In another terminal, run `dig example.com` and `curl -I https://example.com` \| | |
| | | <sub>↑ \| 1 \| Start the capture in Wireshark or tcpdump \|<br>↓ \| 3 \| Stop the capture \|</sub> | |
| 24 | `02-phase-networking-and-linux.md:924` | For this phase's scanning and SSH tasks, **Host-only** or **Bridged** is usually what you want, because you need your host and the VM to reach each other. Check the VM's address with `ip a` inside it, and verify connectivity with `ping` before concluding anyth … | |
| 25 | `02-phase-networking-and-linux.md:942` | Each level is an SSH login to a server where the password for the next level is hidden somewhere. Finding it requires exactly the skills this phase covers: reading files, permissions, `grep`, pipes, and later `find` and encoding. | |
| 26 | `02-phase-networking-and-linux.md:979` | - **Pipes build small tools into real investigations.** `grep \| awk \| sort \| uniq -c \| sort -rn \| head` is a genuine top-talkers query, not a toy example. | |
| 27 | `02-phase-networking-and-linux.md:1025` | 5. Use `dig` or `nslookup` to inspect A, AAAA, MX, TXT records. <!-- id: cyber-02-t05 band: quick energy: low --> | |
| 28 | `03-phase-security-fundamentals.md:429` | \| **Living off the land** \| Using legitimate built-in tools for malicious purposes: `powershell.exe`, `cmd.exe`, `wmic`, `certutil`, `bitsadmin`, `rundll32`, `mshta` \| Suspicious not because they are malicious but because they are frequently *abused*, and s … | |
| 29 | `03-phase-security-fundamentals.md:685` | You can check any site's headers with `curl -I`, which is a small, satisfying thing to do on a site you own. | |
| 30 | `04-phase-hands-on-labs.md:239` | \| Windows VM \| `netstat -ano` \| | |
| | | <sub>↑ \| Linux VM \| `ss -tulpn` \|</sub> | |
| 31 | `04-phase-hands-on-labs.md:270` | \| **Enough free disk space** \| `Get-PSDrive C` in PowerShell \| Guests grow, and a full host disk corrupts running VMs \| | |
| 32 | `04-phase-hands-on-labs.md:442` | \| **The host disk is full** \| Snapshot deltas, or dynamically allocated disks that grew \| `Get-PSDrive C` on the host; check the VM folder's size \| Delete finished snapshots, delete unused VMs, move the VM folder to a larger drive \| | |
| 33 | `04-phase-hands-on-labs.md:450` | \| **`apt` or Windows Update fails inside the guest** \| No route out, or a corporate VPN on the host \| `curl -I https://archive.ubuntu.com` inside the guest \| Detach the VPN, or verify the NAT adapter is present and enabled \| | |
| 34 | `04-phase-hands-on-labs.md:479` | it can understand Windows events and `sshd` logs out of the box. | |
| | | <sub>↑ it. Wazuh ships with hundreds of decoders for common log formats — which is why</sub> | |
| 35 | `04-phase-hands-on-labs.md:538` | \| 1 \| **Generate one event** on the victim VM — for example, an SSH login attempt as a user that does not exist (`ssh fakeuser@localhost` and fail it) \| You need a known event to trace \| | |
| 36 | `04-phase-hands-on-labs.md:657` ▶ | `grep "Failed password" /var/log/auth.log \| tail -3` | |
| | | <sub>↑ - Raw excerpt from /var/log/auth.log, three of the six lines, captured with<br>↓ - Wazuh alert for rule 100001, level 10, timestamped 14:32:11 UTC</sub> | |
| 37 | `08-phase-job-application.md:294` | *I'd test resolution directly: `nslookup example.com` tells me whether the name resolves and which server answered. If it fails, I'd try a public resolver like `nslookup example.com 8.8.8.8`. If that works, the problem is our internal DNS server or its forward … | |
| 38 | `08-phase-job-application.md:308` | **Linux permissions — "What does `chmod 777` do, and why is it a finding in a security review?"** | |
| 39 | `09-phase-cloud-and-identity.md:268` | Two details in that third command are worth naming, because both are the kind of thing that makes an audit script quietly wrong. The version id has to be fetched rather than assumed, and the `grep` pattern is written loosely enough to catch the several shapes  … | |
| 40 | `11-phase-incident-response.md:514` | \| 09:12:03 \| Sysmon 1 \| `schtasks.exe /create /tn Updater /tr ...` \| | |
| | | <sub>↑ \| 09:11:52 \| Sysmon 3 \| Outbound HTTPS from `powershell.exe` to `203.0.113.44:443` \|<br>↓ \| 09:12:20 \| Security 4698 \| Scheduled task `Updater` created \|</sub> | |
| 41 | `11-phase-incident-response.md:1063` | **On the Windows host this scenario actually describes, the same four steps are:** `winpmem_mini_x64.exe` for memory; `netstat -ano`, `arp -a`, and `route print` for network state; `Get-Process` for processes; and FTK Imager or `dc3dd.exe` for the disk image.  … | |
| 42 | `12-phase-scripting-automation.md:27` | - Use PowerShell to triage a Windows host with `Get-WinEvent`, `Get-Process`, and `Get-NetTCPConnection`. | |
| | | <sub>↑ - Read and write Python well enough to parse logs, call APIs, and produce a report.<br>↓ - Make authenticated HTTP requests to a real API and handle the responses and errors properly.</sub> | |
| 43 | `12-phase-scripting-automation.md:46` | - PowerShell for triage: `Get-WinEvent`, `Get-Process`, `Get-NetTCPConnection`, `Get-Service` | |
| | | <sub>↑ - Secrets management: environment variables, `.env` files, and `.gitignore`<br>↓ - PowerShell objects and pipes, and why `Select-Object` beats text parsing</sub> | |
| 44 | `12-phase-scripting-automation.md:49` | - Hash computation with `hashlib` and `Get-FileHash` for IOC matching | |
| | | <sub>↑ - Calling REST APIs from PowerShell with `Invoke-RestMethod`<br>↓ - Defanging indicators so they are safe to paste into reports</sub> | |
| 45 | `12-phase-scripting-automation.md:743` | `Get-WinEvent` is the workhorse, and its filtering syntax is worth learning properly because the difference between a good and a bad filter is minutes versus hours. | |
| 46 | `12-phase-scripting-automation.md:852` | The third command is the one to know best. **`Get-NetTCPConnection` joined to the owning process answers "what is this machine talking to, and what program is doing it"** — which is the first question in almost every host investigation. | |
| 47 | `12-phase-scripting-automation.md:1396` | - **`Get-WinEvent -FilterHashtable` is dramatically faster than piping to `Where-Object`**, and positional property indexes are found by inspection rather than memory. | |
| 48 | `12-phase-scripting-automation.md:1397` | - **`Get-NetTCPConnection` joined to the owning process answers the first question of almost every host investigation.** | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

