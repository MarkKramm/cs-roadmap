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

43 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-foundations.md:203` | The **asset** is an old web server. The **vulnerability** is a known flaw in an outdated version of its software, published as CVE-2021-41773 in Apache's HTTP Server. The **threat** is an attacker scanning the internet for that exact version. The **exploit** i … | |
| 2 | `01-phase-foundations.md:837` | **Why:** The exploit is the specific technique or piece of code that takes advantage of a vulnerability, and the crafted URL is exactly that. The vulnerability is the flaw in the outdated Apache version itself — it exists whether or not anyone writes a URL. Th … | |
| 3 | `02-phase-networking-and-linux.md:55` | - Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog` | |
| | | <sub>↑ - Services with `systemctl`<br>↓ - Networking: `ip a`, `ip route`, `ss -tulpn`, `dig`, `curl`</sub> | |
| 4 | `02-phase-networking-and-linux.md:88` | On Windows, network configuration is buried in GUI dialogs, and logging is abstracted away. On Linux, you type `ip a` and see your interfaces. You type `ss -tulpn` and see every listening service with the process that owns it. You read `/var/log/auth.log` to w … | |
| 5 | `02-phase-networking-and-linux.md:463` | \| **`/etc`** \| `/etc/passwd` (user accounts), `/etc/shadow` (password hashes, readable only by root), `/etc/ssh/sshd_config` (SSH server configuration), `/etc/hosts` \| Configuration is where misconfiguration is found \| | |
| 6 | `02-phase-networking-and-linux.md:464` | \| **`/var/log`** \| The logs you will investigate \| The evidence lives here \| | |
| | | <sub>↑ \| **`/etc`** \| `/etc/passwd` (user accounts), `/etc/shadow` (password hashes, readable only by root), `/etc/ssh/sshd_config` (SSH server configurati …<br>↓ \| **`/tmp`** \| Temporary files \| World-writable, which makes it a favourite location for attackers to stage files, because anything can be written  …</sub> | |
| 7 | `02-phase-networking-and-linux.md:533` | Every `sudo` invocation is logged, which is why it also serves the **accounting** part of AAA. Reading `/etc/sudoers` shows who has been granted what — and a common finding in security reviews is that far too many users are in the sudo group. | |
| 8 | `02-phase-networking-and-linux.md:553` | Reading `/etc/passwd` carefully is a genuinely useful skill. Two fields carry the security meaning. | |
| 9 | `02-phase-networking-and-linux.md:560` | \| **Login shell** \| `/usr/sbin/nologin` \| The account exists but cannot log in interactively — how service accounts are locked down \| | |
| 10 | `02-phase-networking-and-linux.md:569` | **SSH** gives you an encrypted shell on a remote machine. The server is `sshd` — the SSH *daemon*, where a daemon is a background service. It is configured in `/etc/ssh/sshd_config`, and it listens on port 22 by default. | |
| 11 | `02-phase-networking-and-linux.md:646` | \| `/var/log/auth.log` \| Authentication: logins, `sudo` use, SSH attempts (Debian/Ubuntu) \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `/var/log/secure` \| The same role on RHEL/CentOS family \|</sub> | |
| 12 | `02-phase-networking-and-linux.md:647` | \| `/var/log/secure` \| The same role on RHEL/CentOS family \| | |
| | | <sub>↑ \| `/var/log/auth.log` \| Authentication: logins, `sudo` use, SSH attempts (Debian/Ubuntu) \|<br>↓ \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \|</sub> | |
| 13 | `02-phase-networking-and-linux.md:648` | \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \| | |
| | | <sub>↑ \| `/var/log/secure` \| The same role on RHEL/CentOS family \|<br>↓ \| `/var/log/messages` \| General system messages (RHEL/CentOS) \|</sub> | |
| 14 | `02-phase-networking-and-linux.md:649` | \| `/var/log/messages` \| General system messages (RHEL/CentOS) \| | |
| | | <sub>↑ \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \|<br>↓ \| `/var/log/apache2/`, `/var/log/nginx/` \| Web server access and error logs \|</sub> | |
| 15 | `02-phase-networking-and-linux.md:650` | \| `/var/log/apache2/`, `/var/log/nginx/` \| Web server access and error logs \| | |
| | | <sub>↑ \| `/var/log/messages` \| General system messages (RHEL/CentOS) \|</sub> | |
| 16 | `02-phase-networking-and-linux.md:665` | Watch the failures appear. Then use `grep` to pull the failed attempts out of `/var/log/auth.log`. | |
| 17 | `02-phase-networking-and-linux.md:977` | - **`/etc/passwd` UID 0 is root, and nothing else should be.** A non-root account with UID 0 is a backdoor; a service account with `/bin/bash` where `nologin` belongs is a misconfiguration. | |
| 18 | `02-phase-networking-and-linux.md:989` | 2. **Then permissions** (task 2), because they are the foundation of Linux security thinking. Create two users, put them in a group, create a file, and try to read it as the wrong user. Read `/etc/passwd` and find the UID field. Being denied access is the less … | |
| 19 | `02-phase-networking-and-linux.md:990` | 3. **Then SSH** (task 3), which turns your VM into a remote system you can work with comfortably. Set up keys, not just passwords, and read `/etc/ssh/sshd_config` while you are there. | |
| 20 | `03-phase-security-fundamentals.md:302` | In Linux the equivalent evidence lives where Phase 2 showed you: `/var/log/auth.log` or `/var/log/secure`, read through `journalctl -u sshd`. | |
| 21 | `03-phase-security-fundamentals.md:393` | \| `C:\Windows\System32\svchost.exe` \| The real one \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `C:\Users\Public\svchost.exe` \| Not the real one \|</sub> | |
| 22 | `03-phase-security-fundamentals.md:394` | \| `C:\Users\Public\svchost.exe` \| Not the real one \| | |
| | | <sub>↑ \| `C:\Windows\System32\svchost.exe` \| The real one \|</sub> | |
| 23 | `03-phase-security-fundamentals.md:408` | \| **Registry Run keys** \| `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` and its `HKLM` equivalent \| Causes a program to start at login. The classic location, and still heavily used \| | |
| 24 | `03-phase-security-fundamentals.md:431` | \| **Processes from odd locations** \| `C:\Users\Public\`, `C:\Temp\`, `%APPDATA%`, or `/tmp` on Linux \| Legitimate system binaries do not run from user-writable directories; that is the whole point of the expectation \| | |
| 25 | `04-phase-hands-on-labs.md:447` | \| **The agent checks in but no events arrive** \| The log file is not in the agent's configuration, or nothing is being written to it \| On the victim, generate an event and confirm it appears in `/var/log/auth.log` \| Add the log location to `ossec.conf` on  … | |
| 26 | `04-phase-hands-on-labs.md:539` | \| 2 \| **Find it in the raw log** on the victim (`/var/log/auth.log`, or Event Viewer) \| Proving it exists *at the source* is what lets you isolate a forwarding failure from a detection failure \| | |
| 27 | `10-phase-detection-engineering.md:41` | - Linux auditd rules and `/var/log/auth.log` interpretation | |
| | | <sub>↑ - Sysmon event IDs: 1, 3, 7, 8, 10, 11, 12, 13, 22<br>↓ - Syslog facilities, priorities, and severity</sub> | |
| 28 | `10-phase-detection-engineering.md:217` | \| SSH authentication \| Linux \| `/var/log/auth.log` \| High \| | |
| | | <sub>↑ \| Command executed as root \| Linux auditd \| `execve` with `auid=0` or a sudo tag \| Medium, depends on rules \|<br>↓ \| Cron job created \| Linux \| auditd file watch on `/etc/cron*` \| High \|</sub> | |
| 29 | `10-phase-detection-engineering.md:218` | \| Cron job created \| Linux \| auditd file watch on `/etc/cron*` \| High \| | |
| | | <sub>↑ \| SSH authentication \| Linux \| `/var/log/auth.log` \| High \|<br>↓ \| Web request \| Web server access log \| Request line, status, user agent \| High \|</sub> | |
| 30 | `10-phase-detection-engineering.md:349` | \| `/var/log/auth.log` or `/var/log/secure` \| Authentication, sudo, SSH, su \| Plain text, one event per line \| | |
| 31 | `10-phase-detection-engineering.md:352` | \| `/var/log/syslog` or `/var/log/messages` \| General system messages \| Plain text \| | |
| | | <sub>↑ \| `journald` \| Systemd service logs, kernel messages \| `journalctl` with filters \|<br>↓ \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \|</sub> | |
| 32 | `10-phase-detection-engineering.md:353` | \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \| | |
| | | <sub>↑ \| `/var/log/syslog` or `/var/log/messages` \| General system messages \| Plain text \|<br>↓ \| Cron \| Scheduled job definitions and execution \| `/var/log/cron` or journald \|</sub> | |
| 33 | `10-phase-detection-engineering.md:354` | \| Cron \| Scheduled job definitions and execution \| `/var/log/cron` or journald \| | |
| | | <sub>↑ \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \|</sub> | |
| 34 | `10-phase-detection-engineering.md:358` | The auditd rules worth writing first, because they cover the persistence and privilege-escalation behaviours that matter. Put them in `/etc/audit/rules.d/10-lab.rules`, load them with `augenrules --load`, and confirm they are live with `auditctl -l` — a rule t … | |
| 35 | `10-phase-detection-engineering.md:1113` | \| auditd \| Linux syscall and file auditing \| Free/open-source \| https://man7.org/linux/man-pages/man8/auditd.8.html \| Write file watches for `/etc/passwd` and `/etc/cron.d` \| journald with targeted filters \| | |
| 36 | `11-phase-incident-response.md:454` | \| **Prefetch** \| `C:\Windows\Prefetch` \| Which programs ran, when, and how often \| | |
| | | <sub>↑ \| **USN Journal** \| `$Extend\$UsnJrnl` \| What changed, in order, with reasons — created, written, renamed, deleted \|<br>↓ \| **ShimCache** \| Registry `AppCompatCache` \| Which executables existed on the system, even if deleted \|</sub> | |
| 37 | `11-phase-incident-response.md:456` | \| **AmCache** \| `C:\Windows\AppCompat\Programs\Amcache.hve` \| Program execution with SHA-1 hashes and install paths \| | |
| 38 | `11-phase-incident-response.md:460` | \| **Event logs** \| `C:\Windows\System32\winevt\Logs` \| Security, System, Application, and Sysmon records \| | |
| 39 | `11-phase-incident-response.md:510` | \| 09:11:40 \| LNK / Jump list \| `Invoice_4421.docm` opened from `C:\Users\jsantos\Downloads` \| | |
| | | <sub>↑ \| 09:04:12 \| Security 4624 type 2 \| User `LAB\jsantos` logs on interactively \|<br>↓ \| 09:11:44 \| Sysmon 11 \| `C:\Users\jsantos\AppData\Local\Temp\kx8f.tmp` created \|</sub> | |
| 40 | `11-phase-incident-response.md:511` | \| 09:11:44 \| Sysmon 11 \| `C:\Users\jsantos\AppData\Local\Temp\kx8f.tmp` created \| | |
| | | <sub>↑ \| 09:11:40 \| LNK / Jump list \| `Invoice_4421.docm` opened from `C:\Users\jsantos\Downloads` \|<br>↓ \| 09:11:46 \| Sysmon 1 \| `WINWORD.EXE` spawns `powershell.exe -nop -w hidden -enc ...` \|</sub> | |
| 41 | `11-phase-incident-response.md:950` | \| "Looked at the disk, found malware" \| "Mounted `/evidence/disk.img` read-only at 14:05 UTC. Ran `fls -o 1048576 -r -m C:/`; output to `bodyfile.txt`. Identified `C:\Users\jsantos\AppData\Local\Temp\svchost.exe` with an MFT creation timestamp of 2026-03-14  … | |
| 42 | `12-phase-scripting-automation.md:854` | The filters in commands 5 and 6 are doing the analytical work. A service whose binary lives outside `C:\Windows` is worth looking at; a scheduled task that has *run* recently on a machine nobody changed is worth looking at. | |
| 43 | `12-phase-scripting-automation.md:1133` | **What it got wrong.** Three weeks later, a real intrusion is found during an unrelated review. The entry point was a signed binary dropped into `C:\Program Files\Corp\`, with its timestamps set back by the attacker so the file appeared months old. The matchin … | |
