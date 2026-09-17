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

# This bundle covers 1 claim class, 99 rows total.

**Answer every row in every table below, in order, and output the tables complete.**
Do not summarise and do not sample. If you run low on room, stop at a row boundary
and say which table and row number to continue from — a continuation is cheap and
an incomplete table is not.

---

<!-- 05-security-tool-commands-and-flags.md — 99 rows -->

# Security tool commands and flags


*Flags are fixed by each tool's own manual. A wrong flag in a lab instruction is executable code that cannot run — the same failure shape as IT 02's DISM defect.*

**Source to check against:** The tool's own man page or vendor documentation

99 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:53` | - SSH keys and `sshd` | |
| | | <sub>↑ - Users/groups/sudo<br>↓ - Services with `systemctl`</sub> | |
| 2 | `02-phase-networking-and-linux.md:54` | - Services with `systemctl` | |
| | | <sub>↑ - SSH keys and `sshd`<br>↓ - Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog`</sub> | |
| 3 | `02-phase-networking-and-linux.md:55` | - Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog` | |
| | | <sub>↑ - Services with `systemctl`<br>↓ - Reading logs as evidence: `grep`, `awk`, `sort`, `uniq`, and `zgrep` pipelines that answer a question rather than dumping a file</sub> | |
| 4 | `02-phase-networking-and-linux.md:56` | - Reading logs as evidence: `grep`, `awk`, `sort`, `uniq`, and `zgrep` pipelines that answer a question rather than dumping a file | |
| 5 | `02-phase-networking-and-linux.md:57` | - Networking: `ip a`, `ip route`, `ss -tulpn`, `dig`, `curl` | |
| | | <sub>↑ - Reading logs as evidence: `grep`, `awk`, `sort`, `uniq`, and `zgrep` pipelines that answer a question rather than dumping a file<br>↓ - Text processing: `grep`, `awk` basics, `sed` basics, pipes/redirection</sub> | |
| 6 | `02-phase-networking-and-linux.md:58` | - Text processing: `grep`, `awk` basics, `sed` basics, pipes/redirection | |
| | | <sub>↑ - Networking: `ip a`, `ip route`, `ss -tulpn`, `dig`, `curl`</sub> | |
| 7 | `02-phase-networking-and-linux.md:89` | On Windows, network configuration is buried in GUI dialogs, and logging is abstracted away. On Linux, you type `ip a` and see your interfaces. You type `ss -tulpn` and see every listening service with the process that owns it. You read `/var/log/auth.log` to w … | |
| 8 | `02-phase-networking-and-linux.md:113` | \| `nmap -sV` \| Learning \| Unauthorised access \| | |
| | | <sub>↑ \|---\|---\|---\|<br>↓ \| `tcpdump` on your own interface \| Learning \| Potentially unlawful interception \|</sub> | |
| 9 | `02-phase-networking-and-linux.md:114` | \| `tcpdump` on your own interface \| Learning \| Potentially unlawful interception \| | |
| | | <sub>↑ \| `nmap -sV` \| Learning \| Unauthorised access \|<br>↓ \| `ssh user@your-vm` \| Learning \| Unauthorised access \|</sub> | |
| 10 | `02-phase-networking-and-linux.md:115` | \| `ssh user@your-vm` \| Learning \| Unauthorised access \| | |
| | | <sub>↑ \| `tcpdump` on your own interface \| Learning \| Potentially unlawful interception \|</sub> | |
| 11 | `02-phase-networking-and-linux.md:436` | \| **Headers** \| Metadata about the request or response \| `Set-Cookie` (and whether it has `HttpOnly` and `Secure` flags), `Content-Security-Policy`, `Server` (leaks software versions, useful to an attacker), `Authorization` \| | |
| 12 | `02-phase-networking-and-linux.md:439` | You can read all of this with `curl`, which is phase task 7's companion. `curl -I https://example.com` printing real response headers is worth more than any description. | |
| 13 | `02-phase-networking-and-linux.md:661` | **SSH** gives you an encrypted shell on a remote machine. The server is `sshd` — the SSH *daemon*, where a daemon is a background service. It is configured in `/etc/ssh/sshd_config`, and it listens on port 22 by default. | |
| 14 | `02-phase-networking-and-linux.md:683` | **Windows has no `ssh-copy-id`.** The OpenSSH client ships with Windows 10 and 11, but the key-install helper does not. Append the key yourself instead — from PowerShell: | |
| 15 | `02-phase-networking-and-linux.md:702` | Modern Linux uses **systemd** to manage services, through `systemctl`: | |
| 16 | `02-phase-networking-and-linux.md:730` | The security relevance of this command is direct: **you cannot defend a host whose services you cannot enumerate.** Asking “what is running, and should it be?” is the first question of host hardening, and `systemctl list-units --type=service` answers it. | |
| 17 | `02-phase-networking-and-linux.md:744` | `journalctl` queries the systemd journal, which on many distributions is where logs now primarily live: | |
| 18 | `02-phase-networking-and-linux.md:755` | A workflow worth adopting now. Open one terminal running `journalctl -u sshd -f` on your VM. Try to SSH in from your host with the wrong username, and then with the wrong password. | |
| 19 | `02-phase-networking-and-linux.md:757` | Watch the failures appear. Then use `grep` to pull the failed attempts out of `/var/log/auth.log`. | |
| 20 | `02-phase-networking-and-linux.md:796` | \| `grep "Failed password"` \| Keep only the failure lines \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `awk '{print $(NF-3)}'` \| Print the fourth field **from the end** — which is the source IP in this log format \|</sub> | |
| 21 | `02-phase-networking-and-linux.md:797` | \| `awk '{print $(NF-3)}'` \| Print the fourth field **from the end** — which is the source IP in this log format \| | |
| 22 | `02-phase-networking-and-linux.md:798` | \| `sort` \| Group identical addresses together, because `uniq` only collapses *adjacent* duplicates \| | |
| | | <sub>↑ \| `awk '{print $(NF-3)}'` \| Print the fourth field **from the end** — which is the source IP in this log format \|<br>↓ \| `uniq -c` \| Replace each run with a count \|</sub> | |
| 23 | `02-phase-networking-and-linux.md:799` | \| `uniq -c` \| Replace each run with a count \| | |
| | | <sub>↑ \| `sort` \| Group identical addresses together, because `uniq` only collapses *adjacent* duplicates \|<br>↓ \| `sort -rn` \| Sort numerically, highest first \|</sub> | |
| 24 | `02-phase-networking-and-linux.md:800` | \| `sort -rn` \| Sort numerically, highest first \| | |
| | | <sub>↑ \| `uniq -c` \| Replace each run with a count \|<br>↓ \| `head` \| Show the top ten, because you never want the whole list \|</sub> | |
| 25 | `02-phase-networking-and-linux.md:813` | The `--line-buffered` matters and is easy to miss. Without it, `grep` buffers its output when writing to a pipe, so the lines appear in bursts rather than as they happen. You will think the log is broken. | |
| 26 | `02-phase-networking-and-linux.md:847` | This is `sed`'s range form: print from the line matching the first pattern to the line matching the second. It is the fastest way to reduce a day of logs to the hour that matters. | |
| 27 | `02-phase-networking-and-linux.md:849` | **One safety habit, learned from breaking things.** Write the pipeline in pieces and run each stage before adding the next. `grep ... \| head` first — confirm you are matching the right lines. *Then* add the `awk`. A pipeline that returns nothing is ambiguous: … | |
| 28 | `02-phase-networking-and-linux.md:871` | `ss -tulpn` is the Linux equivalent of a port scan against your own machine. Phase task 4 asks you to run it and identify every listening service. Run it with `sudo`: the `p` flag needs root to read the owning process for sockets that belong to other users, an … | |
| 29 | `02-phase-networking-and-linux.md:927` | \| `grep "Failed password" /var/log/auth.log` \| Find the failed-password lines \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \|</sub> | |
| 30 | `02-phase-networking-and-linux.md:928` | \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \| | |
| | | <sub>↑ \| `grep "Failed password" /var/log/auth.log` \| Find the failed-password lines \|<br>↓ \| `awk '{print $2}'` \| Extract the address — field 2 of `from 203.0.113.45` \|</sub> | |
| 31 | `02-phase-networking-and-linux.md:929` | \| `awk '{print $2}'` \| Extract the address — field 2 of `from 203.0.113.45` \| | |
| | | <sub>↑ \| `grep -oE 'from [0-9.]+'` \| Keep only the `from <address>` fragment \|<br>↓ \| `sort` \| Order them so identical addresses are adjacent \|</sub> | |
| 32 | `02-phase-networking-and-linux.md:930` | \| `sort` \| Order them so identical addresses are adjacent \| | |
| | | <sub>↑ \| `awk '{print $2}'` \| Extract the address — field 2 of `from 203.0.113.45` \|<br>↓ \| `uniq -c` \| Collapse duplicates and count each \|</sub> | |
| 33 | `02-phase-networking-and-linux.md:931` | \| `uniq -c` \| Collapse duplicates and count each \| | |
| | | <sub>↑ \| `sort` \| Order them so identical addresses are adjacent \|<br>↓ \| `sort -rn` \| Sort by count, descending \|</sub> | |
| 34 | `02-phase-networking-and-linux.md:932` | \| `sort -rn` \| Sort by count, descending \| | |
| | | <sub>↑ \| `uniq -c` \| Collapse duplicates and count each \|<br>↓ \| `head` \| Show the top ten \|</sub> | |
| 35 | `02-phase-networking-and-linux.md:935` | That is a real investigation query, built from small pieces, and it is the shape of most log analysis you will do. **`awk '{print $N}'` extracts the Nth whitespace-separated field** — that is the 90% of awk you need at this stage. | |
| 36 | `02-phase-networking-and-linux.md:937` | **Why not just `awk '{print $6}'`?** Because the field number moves. In `Failed password for root from 203.0.113.45 ...` the address is field 6, but in `Failed password for invalid user admin from 203.0.113.45 ...` the words `invalid user` push it to field 8.  … | |
| 37 | `02-phase-networking-and-linux.md:981` | \| 2 \| In another terminal, run `dig example.com` and `curl -I https://example.com` \| | |
| | | <sub>↑ \| 1 \| Start the capture in Wireshark or tcpdump \|<br>↓ \| 3 \| Stop the capture \|</sub> | |
| 38 | `02-phase-networking-and-linux.md:1105` | Each level is an SSH login to a server where the password for the next level is hidden somewhere. Finding it requires exactly the skills this phase covers: reading files, permissions, `grep`, pipes, and later `find` and encoding. | |
| 39 | `02-phase-networking-and-linux.md:1139` | - **`ss -tulpn` is a self-scan, and `0.0.0.0` versus `127.0.0.1` is the finding.** A service bound to all interfaces is reachable from the network; one bound to localhost is not. | |
| 40 | `02-phase-networking-and-linux.md:1142` | - **Pipes build small tools into real investigations.** `grep \| awk \| sort \| uniq -c \| sort -rn \| head` is a genuine top-talkers query, not a toy example. | |
| 41 | `02-phase-networking-and-linux.md:1154` | 4. **Run `ss -tulpn` and identify every listener** (task 4). For each one, decide whether it *should* be listening and whether it is bound to all interfaces. This is host hardening in miniature. | |
| 42 | `02-phase-networking-and-linux.md:1166` | 13. **Prove key-only SSH** (task 13). Generate a keypair, install the public key in `authorized_keys`, disable password authentication in `sshd_config`, and demonstrate that a password login now fails. "Demonstrate the failure" is the checklist item — anyone c … | |
| 43 | `02-phase-networking-and-linux.md:1167` | 14. **Capture and filter with `tcpdump`** (task 14). Save to a `.pcap`, open it in Wireshark, and filter to a single protocol. This is the command-line half of the packet work, and it is what you would actually have on a server with no GUI. | |
| 44 | `02-phase-networking-and-linux.md:1198` | 7. Run `nmap -sV` against your own VM IP only. <!-- id: cyber-02-t07 band: quick energy: normal --> | |
| | | <sub>↑ 6. Capture DNS and HTTP traffic with Wireshark. <!-- id: cyber-02-t06 band: focused energy: normal --><br>↓ 8. Complete OverTheWire Bandit levels 0–10. <!-- id: cyber-02-t08 band: deep energy: high --></sub> | |
| 45 | `02-phase-networking-and-linux.md:1204` | 13. Generate a keypair, place the public key in `authorized_keys`, disable password authentication in `sshd_config`, and prove a password login now fails. <!-- id: cyber-02-t13 band: focused energy: high --> | |
| 46 | `02-phase-networking-and-linux.md:1205` | 14. Use `tcpdump` to capture traffic on your VM's interface, save it to a `.pcap`, then open it in Wireshark and filter to a single protocol. <!-- id: cyber-02-t14 band: focused energy: normal --> | |
| 47 | `02-phase-networking-and-linux.md:1325` | **Why:** `-u sshd` matches a systemd unit by that exact name, and on some distributions the unit is `ssh.service` rather than `sshd.service`, so the filter matches nothing. Separately, not every distribution routes SSH into the journal — Debian and Ubuntu fami … | |
| 48 | `03-phase-security-fundamentals.md:302` | In Linux the equivalent evidence lives where Phase 2 showed you: `/var/log/auth.log` or `/var/log/secure`, read through `journalctl -u sshd`. | |
| 49 | `03-phase-security-fundamentals.md:429` | \| **Living off the land** \| Using legitimate built-in tools for malicious purposes: `powershell.exe`, `cmd.exe`, `wmic`, `certutil`, `bitsadmin`, `rundll32`, `mshta` \| Suspicious not because they are malicious but because they are frequently *abused*, and s … | |
| 50 | `03-phase-security-fundamentals.md:685` | You can check any site's headers with `curl -I`, which is a small, satisfying thing to do on a site you own. | |
| 51 | `03-phase-security-fundamentals.md:1037` | Take five findings — from the `nmap -sV` scan you ran against your own VM in Phase 2, from a Nessus/OpenVAS scan of your own lab, or from the CVE exercise in Phase 1 — and score them. | |
| 52 | `04-phase-hands-on-labs.md:238` | \| Linux VM \| `ss -tulpn` \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Windows VM \| `netstat -ano` \|</sub> | |
| 53 | `04-phase-hands-on-labs.md:239` | \| Windows VM \| `netstat -ano` \| | |
| | | <sub>↑ \| Linux VM \| `ss -tulpn` \|</sub> | |
| 54 | `04-phase-hands-on-labs.md:275` | \| **Enough free disk space** \| `Get-PSDrive C` in PowerShell \| Guests grow, and a full host disk corrupts running VMs \| | |
| 55 | `04-phase-hands-on-labs.md:447` | \| **The host disk is full** \| Snapshot deltas, or dynamically allocated disks that grew \| `Get-PSDrive C` on the host; check the VM folder's size \| Delete finished snapshots, delete unused VMs, move the VM folder to a larger drive \| | |
| 56 | `04-phase-hands-on-labs.md:455` | \| **`apt` or Windows Update fails inside the guest** \| No route out, or a corporate VPN on the host \| `curl -I https://archive.ubuntu.com` inside the guest \| Detach the VPN, or verify the NAT adapter is present and enabled \| | |
| 57 | `04-phase-hands-on-labs.md:484` | it can understand Windows events and `sshd` logs out of the box. | |
| | | <sub>↑ it. Wazuh ships with hundreds of decoders for common log formats — which is why</sub> | |
| 58 | `04-phase-hands-on-labs.md:543` | \| 1 \| **Generate one event** on the victim VM — for example, an SSH login attempt as a user that does not exist (`ssh fakeuser@localhost` and fail it) \| You need a known event to trace \| | |
| 59 | `04-phase-hands-on-labs.md:662` ▶ | `grep "Failed password" /var/log/auth.log \| tail -3` | |
| | | <sub>↑ - Raw excerpt from /var/log/auth.log, three of the six lines, captured with<br>↓ - Wazuh alert for rule 100001, level 10, timestamped 14:32:11 UTC</sub> | |
| 60 | `04-phase-hands-on-labs.md:831` ▶ | **Observed:** `ossec.log` shows `Unable to connect to manager`. `ss -tulpn` | |
| | | <sub>↑ **Did:** Installed the agent, set MANAGER_IP to 192.168.56.10, restarted.<br>↓ on the manager shows nothing listening on 1514.</sub> | |
| 61 | `06-phase-portfolio-projects.md:1020` | \| 14:09 \| Generated test traffic \| `nmap -sS 192.168.56.10` \| 3 open ports found \| `02-scan.png` \| | |
| | | <sub>↑ \| 14:02 \| Started lab VM \| VirtualBox → `lab-ubuntu` → Start \| VM booted, IP 192.168.56.10 \| `01-vm-boot.png` \|<br>↓ \| 14:15 \| Confirmed alert fired \| Wazuh dashboard \| Rule 5710 triggered \| `03-alert.png` \|</sub> | |
| 62 | `09-phase-cloud-and-identity.md:235` | **Before any of this works you need the AWS CLI**: install it, then run `aws configure` once with the IAM user's access key, secret, and a default region. Every command below reads those stored credentials, so a bare `aws` command with no configuration fails i … | |
| 63 | `09-phase-cloud-and-identity.md:268` | Two details in that third command are worth naming, because both are the kind of thing that makes an audit script quietly wrong. The version id has to be fetched rather than assumed, and the `grep` pattern is written loosely enough to catch the several shapes  … | |
| 64 | `09-phase-cloud-and-identity.md:536` | \| `userAgent` \| What client made the call \| `aws-cli` at 3 a.m. from a service account is worth a look \| | |
| | | <sub>↑ \| `sourceIPAddress` \| Where the call came from \| A known office range versus an unfamiliar address \|<br>↓ \| `requestParameters` \| The details of the request \| This is where you see *what* was granted — `AdministratorAccess` here \|</sub> | |
| 65 | `09-phase-cloud-and-identity.md:581` | \| Was it a human or automation? \| `userAgent` of `aws-cli` plus the pattern suggests scripted activity, possibly a human at a terminal \| | |
| 66 | `10-phase-detection-engineering.md:341` | One practical note on the filename: the well-known community configurations publish their file under names such as `sysmonconfig.xml` and `sysmonconfig-export.xml`, and the name is only ever a convention — nothing reads it. What matters is that the file you pa … | |
| 67 | `10-phase-detection-engineering.md:350` | \| `auditd` with `auditctl` rules \| Syscalls and file watches, configurable in detail \| `ausearch` and `aureport` \| | |
| 68 | `10-phase-detection-engineering.md:351` | \| `journald` \| Systemd service logs, kernel messages \| `journalctl` with filters \| | |
| | | <sub>↑ \| `auditd` with `auditctl` rules \| Syscalls and file watches, configurable in detail \| `ausearch` and `aureport` \|<br>↓ \| `/var/log/syslog` or `/var/log/messages` \| General system messages \| Plain text \|</sub> | |
| 69 | `10-phase-detection-engineering.md:356` | **This half needs a Linux host.** The Windows telemetry above runs on your own PC; auditd does not. If you do not have a Linux machine yet, do this section after Phase 11, which walks you through building one in VirtualBox — or on WSL2, which is enough for `au … | |
| 70 | `10-phase-detection-engineering.md:358` | The auditd rules worth writing first, because they cover the persistence and privilege-escalation behaviours that matter. Put them in `/etc/audit/rules.d/10-lab.rules`, load them with `augenrules --load`, and confirm they are live with `auditctl -l` — a rule t … | |
| 71 | `11-phase-incident-response.md:516` | \| 09:12:03 \| Sysmon 1 \| `schtasks.exe /create /tn Updater /tr ...` \| | |
| | | <sub>↑ \| 09:11:52 \| Sysmon 3 \| Outbound HTTPS from `powershell.exe` to `203.0.113.44:443` \|<br>↓ \| 09:12:20 \| Security 4698 \| Scheduled task `Updater` created \|</sub> | |
| 72 | `11-phase-incident-response.md:1065` | **On the Windows host this scenario actually describes, the same four steps are:** `winpmem_mini_x64.exe` for memory; `netstat -ano`, `arp -a`, and `route print` for network state; `Get-Process` for processes; and FTK Imager or `dc3dd.exe` for the disk image.  … | |
| 73 | `12-phase-scripting-automation.md:27` | - Use PowerShell to triage a Windows host with `Get-WinEvent`, `Get-Process`, and `Get-NetTCPConnection`. | |
| | | <sub>↑ - Read and write Python well enough to parse logs, call APIs, and produce a report.<br>↓ - Make authenticated HTTP requests to a real API and handle the responses and errors properly.</sub> | |
| 74 | `12-phase-scripting-automation.md:46` | - PowerShell for triage: `Get-WinEvent`, `Get-Process`, `Get-NetTCPConnection`, `Get-Service` | |
| | | <sub>↑ - Secrets management: environment variables, `.env` files, and `.gitignore`<br>↓ - PowerShell objects and pipes, and why `Select-Object` beats text parsing</sub> | |
| 75 | `12-phase-scripting-automation.md:47` | - PowerShell objects and pipes, and why `Select-Object` beats text parsing | |
| | | <sub>↑ - PowerShell for triage: `Get-WinEvent`, `Get-Process`, `Get-NetTCPConnection`, `Get-Service`<br>↓ - Calling REST APIs from PowerShell with `Invoke-RestMethod`</sub> | |
| 76 | `12-phase-scripting-automation.md:48` | - Calling REST APIs from PowerShell with `Invoke-RestMethod` | |
| | | <sub>↑ - PowerShell objects and pipes, and why `Select-Object` beats text parsing<br>↓ - Hash computation with `hashlib` and `Get-FileHash` for IOC matching</sub> | |
| 77 | `12-phase-scripting-automation.md:49` | - Hash computation with `hashlib` and `Get-FileHash` for IOC matching | |
| | | <sub>↑ - Calling REST APIs from PowerShell with `Invoke-RestMethod`<br>↓ - Defanging indicators so they are safe to paste into reports</sub> | |
| 78 | `12-phase-scripting-automation.md:739` | That `Export-Csv` line is a complete deliverable. Compare it with the text-parsing approach, which requires fixed-width column offsets that change between Windows versions. | |
| 79 | `12-phase-scripting-automation.md:743` | `Get-WinEvent` is the workhorse, and its filtering syntax is worth learning properly because the difference between a good and a bad filter is minutes versus hours. | |
| 80 | `12-phase-scripting-automation.md:852` | The third command is the one to know best. **`Get-NetTCPConnection` joined to the owning process answers "what is this machine talking to, and what program is doing it"** — which is the first question in almost every host investigation. | |
| 81 | `12-phase-scripting-automation.md:1396` | - **`Get-WinEvent -FilterHashtable` is dramatically faster than piping to `Where-Object`**, and positional property indexes are found by inspection rather than memory. | |
| 82 | `12-phase-scripting-automation.md:1397` | - **`Get-NetTCPConnection` joined to the owning process answers the first question of almost every host investigation.** | |
| 83 | `12-phase-scripting-automation.md:1434` | \| CyberChef \| Decoding and transformation \| Free/open-source \| https://gchq.github.io/CyberChef/ \| Decode a base64 command line by hand before scripting it \| Python `base64` and `codecs` \| | |
| 84 | `14-phase-web-app-security.md:52` | - SQL injection testing with manual payloads and `sqlmap` on authorised targets | |
| | | <sub>↑ - Burp Suite Community and OWASP ZAP: proxy, intercept, repeater, and scanning<br>↓ - Content Security Policy and the other security response headers</sub> | |
| 85 | `14-phase-web-app-security.md:392` | **The password-storage rule is the one to know precisely.** Passwords are stored with a slow, salted, memory-hard hash: `bcrypt`, `scrypt`, or `Argon2`. Not SHA-256, and never MD5 or SHA-1. The reason is speed. A modern GPU computes billions of SHA-256 hashes  … | |
| 86 | `14-phase-web-app-security.md:841` | **On Windows, Docker needs WSL2.** Docker Desktop offers to install it on first run, which needs administrator rights and a reboot; if you cannot get either, run Juice Shop inside your Phase 2 Linux VM instead, where the same `docker run` line works. Git Bash  … | |
| 87 | `14-phase-web-app-security.md:865` | **Two cautions about `sqlmap` that matter more than the command.** It sends a large volume of requests, so it will be detected and rate-limited. On a fragile application it can also disrupt service. And running it against anything other than a target you own o … | |
| 88 | `14-phase-web-app-security.md:1092` | \| `script-src` \| Where JavaScript may be loaded from \| | |
| | | <sub>↑ \| `default-src` \| The fallback for every resource type not otherwise specified \|<br>↓ \| `style-src` \| Where stylesheets may be loaded from \|</sub> | |
| 89 | `14-phase-web-app-security.md:1133` | \| Requests with unusual user agents or methods \| `sqlmap`, `nikto`, or unexpected `PUT` \| Automated scanning \| | |
| 90 | `14-phase-web-app-security.md:1304` | 5. **Work through injection properly** (tasks 5 and 6): the SQL injection Apprentice labs by hand first, then confirm one with `sqlmap` against Juice Shop on localhost and compare what the tool reports with what you found manually. | |
| 91 | `14-phase-web-app-security.md:1324` | \| curl \| Command-line HTTP client \| Free/open-source \| https://curl.se/ \| Fetch a response with headers and inspect the security headers \| PowerShell `Invoke-WebRequest` \| | |
| 92 | `15-phase-ot-ics-security.md:40` | - Capture and analyse control traffic passively with Wireshark, `tcpdump`, and Zeek without sending a single packet at a device. | |
| 93 | `15-phase-ot-ics-security.md:114` | \| Wireshark, `tcpdump`, and Zeek on OT captures \| 14–18 \| The skill that gets used on day one \| | |
| | | <sub>↑ \| Protocol study and simulator work \| 12–16 \| One protocol at a time \|<br>↓ \| Building a simulation lab \| 10–14 \| Software PLCs, a simulator, a separate analysis host \|</sub> | |
| 94 | `15-phase-ot-ics-security.md:823` | \| Capture \| `tcpdump`, or a managed switch's mirror port \| Free \| The raw packets \| | |
| | | <sub>↑ \|---\|---\|---\|---\|<br>↓ \| Deep inspection \| Wireshark \| Free \| Understanding one exchange completely \|</sub> | |
| 95 | `15-phase-ot-ics-security.md:1121` | \| Wireshark \| Packet capture and protocol dissection \| Free/open-source \| https://www.wireshark.org/ \| Dissect a Modbus read and a write and annotate the function codes \| `tshark` on the command line \| | |
| 96 | `15-phase-ot-ics-security.md:1122` | \| Zeek \| Network security monitoring that produces structured logs \| Free/open-source \| https://zeek.org/ \| Capture a lab session and find every connection in `conn.log` \| Suricata in its logging mode, or `tcpdump` plus scripts \| | |
| 97 | `15-phase-ot-ics-security.md:1123` | \| Suricata \| Signature and protocol-aware intrusion detection \| Free/open-source \| https://suricata.io/ \| Write a rule that fires on Modbus write function codes \| Zeek scripts, or Python over `tshark` output \| | |
| 98 | `15-phase-ot-ics-security.md:1124` | \| `tcpdump` \| Command-line packet capture \| Free/open-source \| https://www.tcpdump.org/ \| Capture Modbus traffic to a file for later analysis \| Wireshark's own capture, or `dumpcap` \| | |
| 99 | `15-phase-ot-ics-security.md:1318` | Every tool this phase needs is free. Wireshark, Zeek, Suricata, `tcpdump`, and GRASSMARLIN are open source, and together they are a genuine passive monitoring stack rather than a demo. OpenPLC and the free protocol simulators give you a controller to talk to w … | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

