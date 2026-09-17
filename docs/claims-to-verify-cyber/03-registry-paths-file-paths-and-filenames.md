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

# Registry paths, file paths and filenames


*Verbatim strings that must match the OS exactly. A transposed path sends a reader somewhere that does not exist.*

**Source to check against:** Microsoft documentation, or the OS itself

47 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-foundations.md:203` | The **asset** is an old web server. The **vulnerability** is a known flaw in an outdated version of its software, published as CVE-2021-41773 in Apache's HTTP Server. The **threat** is an attacker scanning the internet for that exact version. The **exploit** i … | **OK** — NVD: “CVE-2021-41773: A flaw was found in a change made to path normalization in Apache HTTP Server 2.4.49.” |
| 2 | `01-phase-foundations.md:840` | **Why:** The exploit is the specific technique or piece of code that takes advantage of a vulnerability, and the crafted URL is exactly that. The vulnerability is the flaw in the outdated Apache version itself — it exists whether or not anyone writes a URL. Th … | |
| 3 | `02-phase-networking-and-linux.md:55` | - Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog` | **OK** — systemd/Linux: `journalctl` queries the systemd journal; /var/log/auth.log and /var/log/syslog are the standard logs on Debian/Ubuntu. |
| | | <sub>↑ - Services with `systemctl`<br>↓ - Reading logs as evidence: `grep`, `awk`, `sort`, `uniq`, and `zgrep` pipelines that answer a question rather than dumping a file</sub> | |
| 4 | `02-phase-networking-and-linux.md:89` | On Windows, network configuration is buried in GUI dialogs, and logging is abstracted away. On Linux, you type `ip a` and see your interfaces. You type `ss -tulpn` and see every listening service with the process that owns it. You read `/var/log/auth.log` to w … | **UNVERIFIABLE** — pedagogical comparison of Windows GUI dialogs with Linux commands |
| 5 | `02-phase-networking-and-linux.md:517` | \| **`/etc`** \| `/etc/passwd` (user accounts), `/etc/shadow` (password hashes, readable only by root), `/etc/ssh/sshd_config` (SSH server configuration), `/etc/hosts` \| Configuration is where misconfiguration is found \| | |
| 6 | `02-phase-networking-and-linux.md:518` | \| **`/var/log`** \| The logs you will investigate \| The evidence lives here \| | |
| | | <sub>↑ \| **`/etc`** \| `/etc/passwd` (user accounts), `/etc/shadow` (password hashes, readable only by root), `/etc/ssh/sshd_config` (SSH server configurati …<br>↓ \| **`/tmp`** \| Temporary files \| World-writable, which makes it a favourite location for attackers to stage files, because anything can be written  …</sub> | |
| 7 | `02-phase-networking-and-linux.md:625` | Every `sudo` invocation is logged, which is why it also serves the **accounting** part of AAA. Reading `/etc/sudoers` shows who has been granted what — and a common finding in security reviews is that far too many users are in the sudo group. | |
| 8 | `02-phase-networking-and-linux.md:645` | Reading `/etc/passwd` carefully is a genuinely useful skill. Two fields carry the security meaning. | |
| 9 | `02-phase-networking-and-linux.md:652` | \| **Login shell** \| `/usr/sbin/nologin` \| The account exists but cannot log in interactively — how service accounts are locked down \| | |
| 10 | `02-phase-networking-and-linux.md:661` | **SSH** gives you an encrypted shell on a remote machine. The server is `sshd` — the SSH *daemon*, where a daemon is a background service. It is configured in `/etc/ssh/sshd_config`, and it listens on port 22 by default. | **OK** — OpenSSH: sshd is the SSH daemon, configured in /etc/ssh/sshd_config, listening on port 22 by default. |
| 11 | `02-phase-networking-and-linux.md:738` | \| `/var/log/auth.log` \| Authentication: logins, `sudo` use, SSH attempts (Debian/Ubuntu) \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `/var/log/secure` \| The same role on RHEL/CentOS family \|</sub> | |
| 12 | `02-phase-networking-and-linux.md:739` | \| `/var/log/secure` \| The same role on RHEL/CentOS family \| | |
| | | <sub>↑ \| `/var/log/auth.log` \| Authentication: logins, `sudo` use, SSH attempts (Debian/Ubuntu) \|<br>↓ \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \|</sub> | |
| 13 | `02-phase-networking-and-linux.md:740` | \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \| | |
| | | <sub>↑ \| `/var/log/secure` \| The same role on RHEL/CentOS family \|<br>↓ \| `/var/log/messages` \| General system messages (RHEL/CentOS) \|</sub> | |
| 14 | `02-phase-networking-and-linux.md:741` | \| `/var/log/messages` \| General system messages (RHEL/CentOS) \| | |
| | | <sub>↑ \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \|<br>↓ \| `/var/log/apache2/`, `/var/log/nginx/` \| Web server access and error logs \|</sub> | |
| 15 | `02-phase-networking-and-linux.md:742` | \| `/var/log/apache2/`, `/var/log/nginx/` \| Web server access and error logs \| | |
| | | <sub>↑ \| `/var/log/messages` \| General system messages (RHEL/CentOS) \|</sub> | |
| 16 | `02-phase-networking-and-linux.md:757` | Watch the failures appear. Then use `grep` to pull the failed attempts out of `/var/log/auth.log`. | **OK** — grep searches file contents; /var/log/auth.log is the standard authentication log on Debian/Ubuntu. |
| 17 | `02-phase-networking-and-linux.md:839` | `zgrep` searches compressed logs too. On a system that has been running a while, `/var/log/auth.log` is only the most recent slice, and the earlier evidence is in `auth.log.1.gz`, `auth.log.2.gz` and so on. `auth.log*` catches all of them. | |
| 18 | `02-phase-networking-and-linux.md:1140` | - **`/etc/passwd` UID 0 is root, and nothing else should be.** A non-root account with UID 0 is a backdoor; a service account with `/bin/bash` where `nologin` belongs is a misconfiguration. | |
| 19 | `02-phase-networking-and-linux.md:1152` | 2. **Then permissions** (task 2), because they are the foundation of Linux security thinking. Create two users, put them in a group, create a file, and try to read it as the wrong user. Read `/etc/passwd` and find the UID field. Being denied access is the less … | |
| 20 | `02-phase-networking-and-linux.md:1153` | 3. **Then SSH** (task 3), which turns your VM into a remote system you can work with comfortably. Set up keys, not just passwords, and read `/etc/ssh/sshd_config` while you are there. | |
| 21 | `02-phase-networking-and-linux.md:1244` | **Why:** Service accounts exist to run processes, not to be logged into, so the expected value is `/usr/sbin/nologin`. An interactive shell on one is a finding because it is an account an attacker can actually log in as, and service accounts are frequently wea … | |
| 22 | `02-phase-networking-and-linux.md:1325` | **Why:** `-u sshd` matches a systemd unit by that exact name, and on some distributions the unit is `ssh.service` rather than `sshd.service`, so the filter matches nothing. Separately, not every distribution routes SSH into the journal — Debian and Ubuntu fami … | **OK** — systemd: `journalctl -u` matches by unit name, and on Debian/Ubuntu the unit is `ssh.service` rather than `sshd.service`. |
| 23 | `03-phase-security-fundamentals.md:302` | In Linux the equivalent evidence lives where Phase 2 showed you: `/var/log/auth.log` or `/var/log/secure`, read through `journalctl -u sshd`. | **OK** — /var/log/auth.log (Debian/Ubuntu) and /var/log/secure (RHEL/CentOS) are the standard authentication logs. |
| 24 | `03-phase-security-fundamentals.md:393` | \| `C:\Windows\System32\svchost.exe` \| The real one \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `C:\Users\Public\svchost.exe` \| Not the real one \|</sub> | |
| 25 | `03-phase-security-fundamentals.md:394` | \| `C:\Users\Public\svchost.exe` \| Not the real one \| | |
| | | <sub>↑ \| `C:\Windows\System32\svchost.exe` \| The real one \|</sub> | |
| 26 | `03-phase-security-fundamentals.md:408` | \| **Registry Run keys** \| `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` and its `HKLM` equivalent \| Causes a program to start at login. The classic location, and still heavily used \| | |
| 27 | `03-phase-security-fundamentals.md:431` | \| **Processes from odd locations** \| `C:\Users\Public\`, `C:\Temp\`, `%APPDATA%`, or `/tmp` on Linux \| Legitimate system binaries do not run from user-writable directories; that is the whole point of the expectation \| | |
| 28 | `03-phase-security-fundamentals.md:1208` | **Why:** The phase's masquerading section makes predictability the detection: the real `svchost.exe` lives in `C:\Windows\System32`, and legitimate binaries run from their expected directories, which is exactly what makes impersonation visible. The parent-proc … | |
| 29 | `04-phase-hands-on-labs.md:452` | \| **The agent checks in but no events arrive** \| The log file is not in the agent's configuration, or nothing is being written to it \| On the victim, generate an event and confirm it appears in `/var/log/auth.log` \| Add the log location to `ossec.conf` on  … | |
| 30 | `04-phase-hands-on-labs.md:544` | \| 2 \| **Find it in the raw log** on the victim (`/var/log/auth.log`, or Event Viewer) \| Proving it exists *at the source* is what lets you isolate a forwarding failure from a detection failure \| | |
| 31 | `10-phase-detection-engineering.md:41` | - Linux auditd rules and `/var/log/auth.log` interpretation | |
| | | <sub>↑ - Sysmon event IDs: 1, 3, 7, 8, 10, 11, 12, 13, 22<br>↓ - Syslog facilities, priorities, and severity</sub> | |
| 32 | `10-phase-detection-engineering.md:217` | \| SSH authentication \| Linux \| `/var/log/auth.log` \| High \| | |
| | | <sub>↑ \| Command executed as root \| Linux auditd \| `execve` with `auid=0` or a sudo tag \| Medium, depends on rules \|<br>↓ \| Cron job created \| Linux \| auditd file watch on `/etc/cron*` \| High \|</sub> | |
| 33 | `10-phase-detection-engineering.md:218` | \| Cron job created \| Linux \| auditd file watch on `/etc/cron*` \| High \| | |
| | | <sub>↑ \| SSH authentication \| Linux \| `/var/log/auth.log` \| High \|<br>↓ \| Web request \| Web server access log \| Request line, status, user agent \| High \|</sub> | |
| 34 | `10-phase-detection-engineering.md:349` | \| `/var/log/auth.log` or `/var/log/secure` \| Authentication, sudo, SSH, su \| Plain text, one event per line \| | |
| 35 | `10-phase-detection-engineering.md:352` | \| `/var/log/syslog` or `/var/log/messages` \| General system messages \| Plain text \| | |
| | | <sub>↑ \| `journald` \| Systemd service logs, kernel messages \| `journalctl` with filters \|<br>↓ \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \|</sub> | |
| 36 | `10-phase-detection-engineering.md:353` | \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \| | |
| | | <sub>↑ \| `/var/log/syslog` or `/var/log/messages` \| General system messages \| Plain text \|<br>↓ \| Cron \| Scheduled job definitions and execution \| `/var/log/cron` or journald \|</sub> | |
| 37 | `10-phase-detection-engineering.md:354` | \| Cron \| Scheduled job definitions and execution \| `/var/log/cron` or journald \| | |
| | | <sub>↑ \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \|</sub> | |
| 38 | `10-phase-detection-engineering.md:358` | The auditd rules worth writing first, because they cover the persistence and privilege-escalation behaviours that matter. Put them in `/etc/audit/rules.d/10-lab.rules`, load them with `augenrules --load`, and confirm they are live with `auditctl -l` — a rule t … | **OK** — Linux audit: rules live in /etc/audit/rules.d/, are loaded with `augenrules --load`, and listed with `auditctl -l`. |
| 39 | `10-phase-detection-engineering.md:1113` | \| auditd \| Linux syscall and file auditing \| Free/open-source \| https://man7.org/linux/man-pages/man8/auditd.8.html \| Write file watches for `/etc/passwd` and `/etc/cron.d` \| journald with targeted filters \| | |
| 40 | `11-phase-incident-response.md:456` | \| **Prefetch** \| `C:\Windows\Prefetch` \| Which programs ran, when, and how often \| | |
| | | <sub>↑ \| **USN Journal** \| `$Extend\$UsnJrnl` \| What changed, in order, with reasons — created, written, renamed, deleted \|<br>↓ \| **ShimCache** \| Registry `AppCompatCache` \| Which executables existed on the system, even if deleted \|</sub> | |
| 41 | `11-phase-incident-response.md:458` | \| **AmCache** \| `C:\Windows\AppCompat\Programs\Amcache.hve` \| Program execution with SHA-1 hashes and install paths \| | **OK** — Forensics documentation: Amcache.hve in C:\Windows\AppCompat\Programs stores path, size, compile time and SHA-1 hash. |
| 42 | `11-phase-incident-response.md:462` | \| **Event logs** \| `C:\Windows\System32\winevt\Logs` \| Security, System, Application, and Sysmon records \| | |
| 43 | `11-phase-incident-response.md:512` | \| 09:11:40 \| LNK / Jump list \| `Invoice_4421.docm` opened from `C:\Users\jsantos\Downloads` \| | |
| | | <sub>↑ \| 09:04:12 \| Security 4624 type 2 \| User `LAB\jsantos` logs on interactively \|<br>↓ \| 09:11:44 \| Sysmon 11 \| `C:\Users\jsantos\AppData\Local\Temp\kx8f.tmp` created \|</sub> | |
| 44 | `11-phase-incident-response.md:513` | \| 09:11:44 \| Sysmon 11 \| `C:\Users\jsantos\AppData\Local\Temp\kx8f.tmp` created \| | |
| | | <sub>↑ \| 09:11:40 \| LNK / Jump list \| `Invoice_4421.docm` opened from `C:\Users\jsantos\Downloads` \|<br>↓ \| 09:11:46 \| Sysmon 1 \| `WINWORD.EXE` spawns `powershell.exe -nop -w hidden -enc ...` \|</sub> | |
| 45 | `11-phase-incident-response.md:952` | \| "Looked at the disk, found malware" \| "Mounted `/evidence/disk.img` read-only at 14:05 UTC. Ran `fls -o 1048576 -r -m C:/`; output to `bodyfile.txt`. Identified `C:\Users\jsantos\AppData\Local\Temp\svchost.exe` with an MFT creation timestamp of 2026-03-14  … | |
| 46 | `12-phase-scripting-automation.md:854` | The filters in commands 5 and 6 are doing the analytical work. A service whose binary lives outside `C:\Windows` is worth looking at; a scheduled task that has *run* recently on a machine nobody changed is worth looking at. | |
| 47 | `12-phase-scripting-automation.md:1133` | **What it got wrong.** Three weeks later, a real intrusion is found during an unrelated review. The entry point was a signed binary dropped into `C:\Program Files\Corp\`, with its timestamps set back by the attacker so the file appeared months old. The matchin … | |
