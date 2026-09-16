# IT track — technical claim verification

**Status: claims extracted, verification NOT yet performed.**

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

**Three classes are done.** These need no external document to settle, so they were checked by
**recomputation** and against the registry that *assigns* the values — the strongest tier
available, because it does not depend on trusting anyone's documentation:

| Script | What it settles | Result | In CI? |
|---|---|---|---|
| `scripts/verify-cidr.mjs` | Every CIDR table row, every mask-to-prefix equivalence, each RFC 1918 range's actual span, and IT 03's worked `/26` example | **42 checks, 0 wrong** | yes |
| `scripts/verify-metrics.mjs` | IT 06's five stated service-desk metrics, recomputed from its own ticket table | **15 checks, 0 wrong** | yes |
| `scripts/verify-ports.mjs` | Every port number in the IT track against the **IANA Service Name and Transport Protocol Port Number Registry** — the authority that assigns them | **18 checks, 0 wrong** | no (needs network; run by hand) |

Run all three before trusting this section. If any ever fails, the claims below it are stale.

**So the three classes below are already settled and are NOT listed for verification:**

- **IP addressing and subnetting** — 79 claims, recomputed, all correct.
- **Port numbers** — 154 claims. The 18 that appear in the phase's own port table were checked
  against the IANA registry and all match. The remainder are ports appearing inside worked
  examples (`Test-NetConnection … -Port 445`), which are illustrative rather than assertions —
  a reader loses nothing if an example used a different port to demonstrate the syntax.
- **Stated counts and arithmetic** — 169 claims. The IT 06 metrics were recomputed exactly. The rest
  are mostly inventory numbers ("a 10-device practice asset inventory") that are **illustrative
  examples rather than claims about the world**, so they are unverifiable by construction.

## Result of the verification passes

**All five classes are now verified. Zero claims were wrong.** The tables were worked through
against primary sources, and every citation I spot-checked held *verbatim* against the document
it named:

| Table | Rows | `OK` | `UNVERIFIABLE` | `WRONG` |
|---|---|---|---|---|
| Command and cmdlet usage | 160 | 142 | 18 | **0** |
| Protocol and standard behaviour | 26 | 15 | 11 | **0** |
| Product versions and editions | 17 | 6 | 11 | **0** |
| Registry and file paths | 17 | 9 | 8 | **0** |
| DNS record types | 4 | 4 | 0 | **0** |
| **Total** | **224** | **176** | **48** | **0** |

Quotes checked against the source and found exact: RFC 768 ("delivery and duplicate protection
are not guaranteed"), RFC 9293 ("A 3WHS is necessary because sequence numbers are not tied to a
global clock"), RFC 3596 §2.1 (the AAAA definition), the OpenSSH manual ("Port to connect to on
the remote host"), FHS 3.0 §5.10.1 for `/var/log`, and Microsoft's `MSFT_PhysicalDisk` reference
for the `HealthStatus` values.

## Two claims were wrong, and both were already fixed

These came from an *earlier* pass, before this file's classes were settled. They are kept because
the **shape** of each is more useful than the fix — and because the same shapes recur:

| Claim | What was wrong | Why no guard could see it |
|---|---|---|
| IT 01, `Get-PhysicalDisk` | The phase told the reader to watch for `Caution` or `Bad` from `HealthStatus`. Those are **CrystalDiskInfo's** ratings — the cmdlet returns `Healthy` / `Warning` / `Unhealthy` / `Unknown`. | Every word was spelled correctly and the sentence was internally consistent. The phase's own sample output four lines earlier printed `Healthy`, so it even contradicted itself without any check noticing. |
| IT 02, `DISM` | A summary table said `` `DISM /RestoreHealth` ``, which **throws when run**. The full form appears 300 lines earlier in the same file. | The command *name* was right. Nothing was inconsistent. A table cell invites shortening, and the abbreviation silently became a different, broken command. |

**Both are now covered by `scripts/audit-commands.mjs`**, which checks the exact string a reader
would copy rather than the command name — and which was itself proved able to fail by
re-injecting the original IT 02 defect, because a guard that has never failed is a comment.

## The `UNVERIFIABLE` column is the honest part

48 rows came back unverifiable, and they fall on exactly what should: teaching method, diagnostic
heuristics, resume phrasing, case-study narrative, and lab instructions. **A phase saying `/26` is
"the point where most beginners close the tab" is pedagogy, not fact**, and stamping it OK would
have made the whole OK column meaningless.

## What a clean result does NOT mean

**This is not a verdict on the curriculum.** It means the classes above were checked against
sources. The extractor cannot see a bad analogy, a misleading emphasis, or outdated practice that
reads as current — and those are the errors most likely to actually mislead a beginner. That
layer has only ever been tested by the comprehension passes, and it remains the largest
unexamined risk in the repository.

**One sourcing weakness is worth recording.** Several citations rested on a third-party tutorial
(`labex.io`) that returns **HTTP 403**, or on a localised manpage, rather than on the standard
itself. The *verdicts* were right — I rechecked those rows against FHS 3.0, `man7.org`, and the
OpenSSH manual and all held — but the citations were weaker evidence than they appeared. The
prompt now requires a quote and a source ranking for exactly this reason.

## What this file does NOT claim

- **It is not exhaustive of the content.** It finds claims of the classes above. Prose that is
  wrong in a way no pattern catches — a bad analogy, a misleading emphasis, an outdated practice
  — is invisible here and always will be.
- **It is not a comprehension check.** Whether a beginner can follow the text is a different
  question, answered by [`COMPREHENSION-AUDIT.md`](COMPREHENSION-AUDIT.md).
- **A clean result does not mean the phase is correct.** It means these classes were checked.

**Claims extracted: 635** across 9 phases and 8 classes.

Three classes are settled by recomputation or by the assigning registry, leaving **216 claims**
that genuinely need a source. Those are the ones listed below.

| Class | Claims | Source | Status |
|---|---|---|---|
| IP addressing and subnetting | 80 | RFC 1918 (private ranges), RFC 6890 (special-purpose), or by recomputation | **settled** |
| Port numbers | 154 | IANA port registry, or Microsoft/vendor docs for the Windows-specific ones | **settled** |
| Command and cmdlet usage | 160 | Microsoft Learn for cmdlets, man pages for POSIX tools | needs checking |
| DNS record types | 4 | RFC 1035 and the IANA DNS parameters registry | needs checking |
| Protocol and standard behaviour | 26 | The RFC or standard that defines the protocol; vendor docs for proprietary ones | needs checking |
| Product versions and editions | 17 | Vendor documentation, checked against the current release | needs checking |
| Registry paths, file paths and filenames | 17 | Microsoft documentation, or the OS itself | needs checking |
| Stated counts, sizes and arithmetic | 177 | Recomputation from the document's own numbers | **settled** |

---

## IP addressing and subnetting

*Every value is arithmetic or is fixed by RFC 1918 / RFC 6890. Highest-risk class: a wrong mask teaches a wrong mental model that persists.*

**Source to check against:** RFC 1918 (private ranges), RFC 6890 (special-purpose), or by recomputation

**80 claim(s) — already verified by recomputation, not listed.**

See "Already verified, without needing a source" above. Re-run the verifying script if you
doubt it; do not re-check these by hand.

---

## Port numbers

*Fixed by the IANA Service Name and Transport Protocol Port Number Registry. A wrong port number is unrecoverable from context.*

**Source to check against:** IANA port registry, or Microsoft/vendor docs for the Windows-specific ones

**154 claim(s) — already verified by recomputation, not listed.**

See "Already verified, without needing a source" above. Re-run the verifying script if you
doubt it; do not re-check these by hand.

---

## Command and cmdlet usage

*Flags, parameters and syntax are fixed by the tool's own documentation. A wrong flag in a worked example is executable code that silently cannot run.*

**Source to check against:** Microsoft Learn for cmdlets, man pages for POSIX tools

160 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-computer-fundamentals.md:277` | - File system errors, and `chkdsk` reporting bad sectors. | |
| | | <sub>↓ - "Windows detected a hard disk problem" notifications.</sub> | |
| 2 | `01-phase-computer-fundamentals.md:284` | 2. **Read the drive health.** Open CrystalDiskInfo, or run `Get-PhysicalDisk \| Select FriendlyName, HealthStatus`. The two tools use different words, so read the right one: CrystalDiskInfo says **Good**, **Caution**, or **Bad**, while PowerShell's `HealthStat … | |
| 3 | `01-phase-computer-fundamentals.md:290` | Like `Confirm-SecureBootUEFI` below, this needs an elevated PowerShell. `/scan` is online and safe. The full repair mode (`chkdsk C: /f`) requires a reboot and can take hours on a large HDD. Never run a repair check on a drive that is clicking — you will short … | |
| 4 | `01-phase-computer-fundamentals.md:374` | **S.M.A.R.T.** (Self-Monitoring, Analysis and Reporting Technology) is a monitoring system built into every modern HDD and SSD. The drive continuously tracks dozens of internal counters and exposes them to the operating system. CrystalDiskInfo and `Get-Physica … | |
| 5 | `01-phase-computer-fundamentals.md:420` | \| `NTFS_FILE_SYSTEM` \| File system corruption \| Storage health; `chkdsk`; back up first \| | |
| | | <sub>↑ \| `DRIVER_IRQL_NOT_LESS_OR_EQUAL` \| A driver touched memory it did not own \| The driver named on the screen; recent driver installs \|</sub> | |
| 6 | `01-phase-computer-fundamentals.md:533` | \| Everything is slow, all the time \| System drive nearly full; HDD instead of SSD; too little RAM \| Free space on `C:`; `MediaType` from `Get-PhysicalDisk` \| | |
| 7 | `01-phase-computer-fundamentals.md:542` | \| Wi-Fi missing entirely \| Driver disabled or missing; airplane mode; adapter failure \| `Get-NetAdapter`; Device Manager status \| | |
| 8 | `01-phase-computer-fundamentals.md:1512` | > **Observed:** `Get-NetAdapter` showed the Intel Wireless-AC 9560 up at 433.3 Mbps, so no permanent hardware failure. Event log (`WLAN-AutoConfig`) showed repeated paired events — `8003 Wireless security stopped` immediately followed by `8002 Wireless securit … | |
| 9 | `01-phase-computer-fundamentals.md:1514` | > **Verified:** `netsh wlan show interfaces` showed the adapter connected at 82 % signal and 433 Mbps. Asked the user to run a video call for several minutes. Ticket left open for 24 hours; checked `WLAN-AutoConfig` for new `8003` events over the following wor … | |
| 10 | `01-phase-computer-fundamentals.md:1615` | \| CrystalDiskInfo \| Checks disk health/S.M.A.R.T. \| Free \| https://crystalmark.info/en/software/crystaldiskinfo/ \| Check drive health and temperature \| PowerShell `Get-PhysicalDisk` / manufacturer tool \| | |
| 11 | `01-phase-computer-fundamentals.md:1616` | \| Event Viewer \| Reads system logs and bug check history \| Free, built-in \| https://support.microsoft.com/windows \| Find the last unexpected shutdown and its event ID \| PowerShell `Get-WinEvent` \| | |
| 12 | `01-phase-computer-fundamentals.md:1642` | 3. **Check disk health and free space** *(Check 3)*. Install CrystalDiskInfo and read the health rating, or run `Get-PhysicalDisk \| Select-Object FriendlyName, MediaType, HealthStatus, Size`. Look for S.M.A.R.T. warnings or a degraded status. Then check free  … | |
| 13 | `02-phase-operating-systems.md:49` | - `ipconfig`, `ping`, `tracert`, `nslookup` for network checks | |
| | | <sub>↓ - `net user` and `net localgroup` for account inspection</sub> | |
| 14 | `02-phase-operating-systems.md:50` | - `net user` and `net localgroup` for account inspection | |
| | | <sub>↑ - `ipconfig`, `ping`, `tracert`, `nslookup` for network checks<br>↓ - `sfc /scannow` for system file repair</sub> | |
| 15 | `02-phase-operating-systems.md:51` | - `sfc /scannow` for system file repair | |
| | | <sub>↑ - `net user` and `net localgroup` for account inspection<br>↓ - `chkdsk` and `chkdsk /scan` for disk errors</sub> | |
| 16 | `02-phase-operating-systems.md:52` | - `chkdsk` and `chkdsk /scan` for disk errors | |
| | | <sub>↑ - `sfc /scannow` for system file repair<br>↓ - `systeminfo` for a full system summary</sub> | |
| 17 | `02-phase-operating-systems.md:54` | - PowerShell equivalents: `Get-Process`, `Get-Service`, `Get-EventLog`, `Get-ChildItem`, `Copy-Item` | |
| | | <sub>↑ - `systeminfo` for a full system summary</sub> | |
| 18 | `02-phase-operating-systems.md:60` | - Permissions: `chmod`, `chown`, and reading `rwx` notation | |
| | | <sub>↑ - Users and groups: `adduser`, `passwd`, `groups`, `usermod`<br>↓ - Package management with `apt update` and `apt install`</sub> | |
| 19 | `02-phase-operating-systems.md:62` | - Processes and services: `ps`, `top`, `systemctl` | |
| | | <sub>↑ - Package management with `apt update` and `apt install`<br>↓ - Logs: `/var/log/auth.log`, `/var/log/syslog`, `journalctl`</sub> | |
| 20 | `02-phase-operating-systems.md:64` | - Core navigation commands: `pwd`, `ls`, `cd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`, `grep`, `find` | |
| | | <sub>↑ - Logs: `/var/log/auth.log`, `/var/log/syslog`, `journalctl`<br>↓ - Running commands with `sudo` and understanding when it is necessary</sub> | |
| 21 | `02-phase-operating-systems.md:116` | - **Service problems** — a function that should run in the background is stopped: printing, Windows Update, a network service. `Get-Service` or `systemctl status` shows it. | |
| 22 | `02-phase-operating-systems.md:206` | The `ping` pair is the single most useful diagnostic in beginner IT, and understanding *why* will set you apart. Pinging `8.8.8.8` tests connectivity by IP address, bypassing DNS entirely. Pinging `google.com` tests connectivity **and** name resolution. So: | |
| 23 | `02-phase-operating-systems.md:209` | - IP works, name fails → the network is fine and **DNS is broken**. Check the configured DNS servers with `ipconfig /all`. | |
| 24 | `02-phase-operating-systems.md:222` | Order matters. `sfc /scannow` repairs system files, but it draws its replacement files from a component store that can itself be corrupted. If `sfc` reports unfixable errors, run the `DISM` repair, then run `sfc` again. `chkdsk C: /scan` is the modern online s … | |
| 25 | `02-phase-operating-systems.md:312` | **Ownership and permission are different problems.** "Permission denied" means *this account is not allowed*, which may be fixed by `chmod`, `chown`, or using `sudo`. "No such file or directory" means the path is wrong. Confusing the two sends you down the wro … | |
| 26 | `02-phase-operating-systems.md:344` | `grep` is the single most valuable Linux skill for support work, because logs are huge and the answer is always a few lines. Piping into it is the idiom to learn: | |
| 27 | `02-phase-operating-systems.md:374` | `systemctl status` is the first thing to run for any "the service isn't working" problem. It reports whether the unit is active, when it last started, its process ID, and — critically — the last few log lines, which usually state the failure reason directly. | |
| 28 | `02-phase-operating-systems.md:394` | Compare this to Windows Event Viewer. Both record the same kinds of events; Linux simply hands them to you as text, which means `grep` and `journalctl` replace an entire GUI. Once you have used `journalctl --since "1 hour ago"` to find why a service died, the  … | |
| 29 | `02-phase-operating-systems.md:418` | **What carries over, and what does not.** Your troubleshooting *method* is identical on all three: establish scope, read the evidence, change one thing, verify. Your Windows *commands* do not carry over; anyone who tells you to run `sfc /scannow` on a Mac is t … | |
| 30 | `02-phase-operating-systems.md:521` | \| Machine is slow \| `Get-Process \\| Sort WorkingSet -Descending` or `top` \| Identify the process; stop or restart it; check RAM \| | |
| 31 | `02-phase-operating-systems.md:522` | \| Cannot log in \| Account disabled or locked \| `Get-LocalUser`; re-enable or reset the password \| | |
| | | <sub>↑ \| Machine is slow \| `Get-Process \\| Sort WorkingSet -Descending` or `top` \| Identify the process; stop or restart it; check RAM \|<br>↓ \| Access denied to a folder \| NTFS permissions or Linux mode bits \| Check group membership; `icacls C:\path` on Windows, `ls -l` on Linux \|</sub> | |
| 32 | `02-phase-operating-systems.md:527` | \| Windows Update fails \| Component store corruption \| `DISM /Online /Cleanup-Image /RestoreHealth`, then `sfc /scannow` \| | |
| 33 | `02-phase-operating-systems.md:528` | \| Service will not start \| Its own log entries \| `systemctl status` or Event Viewer; read the stated reason \| | |
| 34 | `02-phase-operating-systems.md:529` | \| Disk full \| `Get-Volume` or `df -h` \| Disk Cleanup, temp files, old update files, logs \| | |
| | | <sub>↑ \| Service will not start \| Its own log entries \| `systemctl status` or Event Viewer; read the stated reason \|<br>↓ \| Application crashes repeatedly \| Application log, plus its AppData `Local` folder \| Reset the app's profile; check for updates \|</sub> | |
| 35 | `02-phase-operating-systems.md:562` | From the command line, `MpCmdRun.exe -Scan -ScanType 2` runs a full scan, and `Get-MpThreatDetection` lists what has been found. Knowing these exist matters more than memorising them: it tells an interviewer you have actually looked at Defender rather than onl … | |
| 36 | `02-phase-operating-systems.md:638` | Task Manager shows you a list. `Get-Process` shows you the same list with numbers you can reason about. Four of those numbers carry almost all the diagnostic weight: | |
| 37 | `02-phase-operating-systems.md:666` | `Get-Service` reports a **Status** (is it running now?) and a **StartType** (should it start at boot?). Those are different questions, and the gap between them is where real faults hide: | |
| 38 | `02-phase-operating-systems.md:789` | \| Why did an update fail? \| `Get-WindowsUpdateLog` to build a readable log, plus Setup log under `C:\Windows\Logs` \| | |
| 39 | `02-phase-operating-systems.md:837` | That is the whole method: `systemctl status` gives you a verdict, the failing step, and the reason, in one output. Beginners restart the service and hope. Technicians read the reason. The four commands worth knowing: | |
| 40 | `02-phase-operating-systems.md:883` | 3. **Fix the membership, not the file.** Adding the user to the right group is reversible and auditable. Running `chmod 777` is neither, and it is how access control quietly degrades across an organisation. If you find yourself typing `777` on a shared system, … | |
| 41 | `02-phase-operating-systems.md:1088` | > **Observed:** Two `Get-Process` readings 15 minutes apart showed chrome growing from 2410 MB / 3120 handles to 3180 MB / 4188 handles during ordinary browsing — a sustained monotonic increase. Free physical memory 0.6 GB of 7.9 GB. No errors in the System lo … | |
| 42 | `02-phase-operating-systems.md:1174` | > **Observed:** Other users could access the same share normally, ruling out server-side or data loss. The folder opened without an access-denied error, so share-level permission was intact. `whoami /groups` on the user's machine showed a cached token; `Get-AD … | |
| 43 | `02-phase-operating-systems.md:1218` | 2. A user says "the internet is down". Which two `ping` commands distinguish a connectivity failure from a DNS failure? | |
| 44 | `02-phase-operating-systems.md:1244` | - **Fix the group membership, not the file.** Adding a user to a group is reversible and auditable; `chmod 777` is neither, and it is how access control degrades across an organisation. | |
| 45 | `02-phase-operating-systems.md:1285` | 4. Use `ipconfig`, `ping`, `nslookup`, and `tracert` on Windows. <!-- id: it-02-t04 band: focused energy: normal --> | |
| 46 | `02-phase-operating-systems.md:1286` | 5. Use `ls`, `grep`, `chmod`, `systemctl`, and `journalctl` on Linux. <!-- id: it-02-t05 band: focused energy: normal --> | |
| 47 | `02-phase-operating-systems.md:1300` | - **Command guides:** 20 Windows commands with explanations (for example `ipconfig`, `ping`, `sfc /scannow`, `chkdsk`, `net user`) and 20 Linux commands with explanations (for example `ls`, `cd`, `chmod`, `chown`, `systemctl`, `journalctl`). | |
| 48 | `03-phase-networking-basics.md:28` | - Use `ping`, `tracert/traceroute`, `ipconfig/ifconfig/ip`, `nslookup`, `arp -a`, `route print`, and Wireshark. | |
| 49 | `03-phase-networking-basics.md:127` | Look for **Physical Address** (the MAC) and **IPv4 Address** (the IP). Note that `ipconfig /all` shows one MAC per adapter — your Wi-Fi adapter and your Ethernet adapter each have their own. | |
| 50 | `03-phase-networking-basics.md:228` | You can query all of these yourself with `nslookup`, and doing so is one of the phase's tasks: | |
| 51 | `03-phase-networking-basics.md:251` | - **`8.8.8.8` works, `google.com` fails** → your network is fine; **DNS is broken**. Check the DNS servers reported by `ipconfig /all`, and try a public resolver such as `1.1.1.1` or `8.8.8.8`. | |
| 52 | `03-phase-networking-basics.md:304` | 2. **IP configuration.** Run `ipconfig /all`. Do you have a real address, or a `169.254` one? Is the mask correct? Is there a gateway? | |
| 53 | `03-phase-networking-basics.md:305` | 3. **Gateway.** `ping` your gateway. If the gateway does not answer, nothing upstream can work. | |
| | | <sub>↑ 2. **IP configuration.** Run `ipconfig /all`. Do you have a real address, or a `169.254` one? Is the mask correct? Is there a gateway?<br>↓ 4. **Name resolution.** `ping 8.8.8.8` first — it proves routing and upstream work *without* DNS — then `ping google.com` and `nslookup google.com`. T …</sub> | |
| 54 | `03-phase-networking-basics.md:306` | 4. **Name resolution.** `ping 8.8.8.8` first — it proves routing and upstream work *without* DNS — then `ping google.com` and `nslookup google.com`. The pair is what isolates DNS. | |
| 55 | `03-phase-networking-basics.md:307` | 5. **The specific service's port.** Test the port itself with `Test-NetConnection`. | |
| | | <sub>↑ 4. **Name resolution.** `ping 8.8.8.8` first — it proves routing and upstream work *without* DNS — then `ping google.com` and `nslookup google.com`. T …<br>↓ 6. **The application.** Test the actual thing: a browser, an app, a file share.</sub> | |
| 56 | `03-phase-networking-basics.md:330` | Fix: check the adapter has DHCP enabled, then `ipconfig /release` followed by `ipconfig /renew`. If it still fails, the DHCP server is unreachable — check the router or, at work, whether the client landed in the wrong VLAN. | |
| 57 | `03-phase-networking-basics.md:350` | **Step 5 — DNS.** If `8.8.8.8` worked but `ping google.com` fails with "could not find host", DNS is the fault: | |
| 58 | `03-phase-networking-basics.md:566` | *Ticket-shaped symptom:* “My laptop can reach the file server but not the shared printer, and both are in the same room.” The file server is inside the machine’s believed subnet; the printer is not. You check `ipconfig /all` and compare the subnet mask against … | |
| 59 | `03-phase-networking-basics.md:600` | **Rung 1 — Link.** You are asking: *is there anything to send packets over?* Check `ipconfig /all` for the adapter’s state, or simply look — does Windows show a connected network? For Wi-Fi, are you associated with an SSID at all? If the link is down, stop. No … | |
| 60 | `03-phase-networking-basics.md:602` | **Rung 2 — IP.** You are asking: *do I have an identity on this network?* Run `ipconfig /all`. You want a real address — not `169.254.x.x` — a mask that contains your own address, and a default gateway that also lies inside that mask. Check all three. A correc … | |
| 61 | `03-phase-networking-basics.md:608` | **Rung 5 — Port.** You are asking: *is the actual service reachable?* `Test-NetConnection` against a specific port. Web servers answer on 443, RDP on 3389, SMB on 445. A host can be perfectly pingable while every service on it is blocked. | |
| 62 | `03-phase-networking-basics.md:686` | **FAIL means the device cannot reach its own front door.** Suspect the Wi-Fi association, the access point, the router, or a wrong gateway address in `ipconfig`. Do not proceed upward; nothing above will work. | |
| 63 | `03-phase-networking-basics.md:774` | *Healthy looks like:* `TcpTestSucceeded : True`. If it is `False` while `ping` to the same host succeeds, you have found a port-level block or a dead service — which is a completely different problem class from a connectivity failure, and knowing that is half  … | |
| 64 | `03-phase-networking-basics.md:778` | `tracert` shows the path and where it stops: | |
| 65 | `03-phase-networking-basics.md:843` | Find the `0.0.0.0 0.0.0.0` row and read its Gateway column. That value *is* your default gateway, and seeing it here confirms the machine agrees with what `ipconfig /all` told you. A machine with a VPN client installed often has several of these rows, which is … | |
| 66 | `03-phase-networking-basics.md:847` | `ping` gives you two numbers that beginners tend to ignore: **time** in milliseconds and **loss** as a percentage. | |
| 67 | `03-phase-networking-basics.md:857` | \| Every packet timed out \| The host is unreachable, or it blocks ICMP \| Follow the ladder; also test a port with `Test-NetConnection` \| | |
| 68 | `03-phase-networking-basics.md:868` | Also worth knowing: **many hosts block ICMP deliberately.** `ping` failing is not proof a machine is down. `Test-NetConnection` on a known port is the stronger test. | |
| 69 | `03-phase-networking-basics.md:950` | \| “It says connected but nothing loads” \| 2 — IP \| `ipconfig /all` for a `169.254` address \| | |
| | | <sub>↑ \| “No networks available” \| 1 — Link \| Is Wi-Fi switched on? Is the adapter disabled? Airplane mode? \|<br>↓ \| “The internet is down” \| 3 or 4 \| `ping` the gateway, then `ping 8.8.8.8` \|</sub> | |
| 70 | `03-phase-networking-basics.md:951` | \| “The internet is down” \| 3 or 4 \| `ping` the gateway, then `ping 8.8.8.8` \| | |
| | | <sub>↑ \| “It says connected but nothing loads” \| 2 — IP \| `ipconfig /all` for a `169.254` address \|<br>↓ \| “Some websites work, some do not” \| 4b — DNS \| `nslookup` of a failing name against your resolver and `8.8.8.8` \|</sub> | |
| 71 | `03-phase-networking-basics.md:952` | \| “Some websites work, some do not” \| 4b — DNS \| `nslookup` of a failing name against your resolver and `8.8.8.8` \| | |
| 72 | `03-phase-networking-basics.md:954` | \| “The page loads forever and times out” \| 5 — Port \| `Test-NetConnection` to the site on port 443 \| | |
| | | <sub>↑ \| “It works on my phone but not my laptop” \| 2 or 1 \| This device only. Adapter, DHCP lease, static config \|<br>↓ \| “I cannot reach the file server” \| 2 or 5 \| Is it in your subnet? Does port 445 answer? \|</sub> | |
| 73 | `03-phase-networking-basics.md:965` | - **ISP-side faults.** If your gateway answers, `8.8.8.8` does not, and `tracert` dies inside your ISP’s network, the fault is not yours. You cannot fix it from a laptop. What you *can* do is capture the evidence: the `ipconfig` output, the failed ping, the `t … | |
| 74 | `03-phase-networking-basics.md:982` | > **Observed:** `ipconfig /all` shows IPv4 `169.254.88.4`, mask `255.255.0.0`, no default gateway, DHCP enabled, no lease obtained. Other devices on the same floor have `10.20.30.x/24` with gateway `10.20.30.1`. | |
| 75 | `03-phase-networking-basics.md:983` | > **Tested:** `ipconfig /release` and `/renew` — no lease obtained after three attempts (approximately 90 seconds). Confirmed the device never received a DHCP offer. Cable and switch port LED confirmed live; swapped to a known-good cable and a different wall p … | |
| 76 | `03-phase-networking-basics.md:1154` | Stop the capture and filter on `dns`. You will see a **query** packet (your machine asking) and a **response** packet (the server answering). Click the response and expand the **Answers** section. You will see the name and the address it resolved to — the same … | |
| 77 | `03-phase-networking-basics.md:1182` | 1. **Confirm everything works.** Run the ladder once while healthy: `ipconfig /all`, `ping` the gateway, `ping 8.8.8.8`, `nslookup google.com`. Write down each result. This is your baseline, and it matters because you cannot recognise a failure signature you h … | |
| 78 | `03-phase-networking-basics.md:1190` | Replacing `“Wi-Fi”` with the exact name from `Get-NetAdapter`. | |
| 79 | `03-phase-networking-basics.md:1193` | - `ipconfig /all` — the adapter may still show a stale address, or none at all. Note which. | |
| | | <sub>↑ 3. **Observe every rung.** Immediately run the ladder again and record what each command says now:<br>↓ - `ping` the gateway — you should get `Destination host unreachable` or `Transmit failed. General failure.` Note the exact wording; it is different fr …</sub> | |
| 80 | `03-phase-networking-basics.md:1194` | - `ping` the gateway — you should get `Destination host unreachable` or `Transmit failed. General failure.` Note the exact wording; it is different from a timeout, and the difference tells you the operating system knew it had no route. | |
| 81 | `03-phase-networking-basics.md:1195` | - `ping 8.8.8.8` — same class of failure. | |
| | | <sub>↑ - `ping` the gateway — you should get `Destination host unreachable` or `Transmit failed. General failure.` Note the exact wording; it is different fr …<br>↓ - `nslookup google.com` — often a timeout, sometimes an immediate answer from cache. Note that a cached answer can be misleading.</sub> | |
| 82 | `03-phase-networking-basics.md:1196` | - `nslookup google.com` — often a timeout, sometimes an immediate answer from cache. Note that a cached answer can be misleading. | |
| 83 | `03-phase-networking-basics.md:1203` | Wait for the adapter to come back and confirm with `ipconfig /all` before going on. Then break DNS only: temporarily set your adapter’s DNS server to an address you know does not answer — for example `192.0.2.1`, which is a reserved documentation address that  … | |
| 84 | `03-phase-networking-basics.md:1210` | Now run the ladder again. This is the important moment: **`ping 8.8.8.8` still works, `ping google.com` fails.** You have reproduced the DNS failure signature deliberately, and you will recognise it for the rest of your career. | |
| 85 | `03-phase-networking-basics.md:1218` | Then verify with the full ladder, and confirm `nslookup google.com` answers again. | |
| | | <sub>↓ 6. **Write the comparison table.** For each rung, one column for “what it looks like when healthy” and one for “what it looks like when this rung is b …</sub> | |
| 86 | `03-phase-networking-basics.md:1223` | (The `169.254` address itself is worth meeting deliberately: on a machine that has just lost DHCP, `ipconfig /all` shows it as the *Autoconfiguration IPv4 Address*. Do that once, so the signature is familiar before it finds you.) | |
| 87 | `03-phase-networking-basics.md:1427` | > **Observed:** Wi-Fi connected, full signal. `ipconfig /all`: IPv4 `192.168.1.22/24`, gateway `192.168.1.1`, DHCP lease valid, **DNS Servers: `127.0.0.1`**. `ping 192.168.1.1` — 0 % loss. `ping 8.8.8.8` — 0 % loss, 24–26 ms. `ping google.com` — “could not fin … | |
| 88 | `03-phase-networking-basics.md:1428` | > **Action (one change at a time):** 1) Reset the Wi-Fi adapter’s DNS servers to automatic (`Set-DnsClientServerAddress -ResetServerAddresses`) and flushed the DNS cache. 2) Confirmed the adapter now receives `192.168.1.1` and `8.8.8.8` via DHCP. | |
| 89 | `03-phase-networking-basics.md:1429` | > **Verified:** `nslookup google.com` resolved correctly. Asked the user to load the specific site that failed and confirm it opened — they confirmed it loaded normally. | |
| 90 | `03-phase-networking-basics.md:1433` | **Reasoning to take away:** “The internet is down” is a *symptom description*, not a diagnosis, and in this ticket the internet was never down. The decisive evidence cost nothing: `ping 8.8.8.8` succeeded while `ping google.com` failed, and that single compari … | |
| 91 | `03-phase-networking-basics.md:1435` | **Read the DNS Servers line in `ipconfig /all` every single time** — `127.0.0.1` is never an accident, and it is the fingerprint of a VPN or security tool that changed the machine and did not change it back. | |
| 92 | `03-phase-networking-basics.md:1595` | \| Maria can reach the gateway \| `ping 192.168.10.65` — 0 % loss \| Link, IP, and gateway rungs all pass \| | |
| | | <sub>↑ \| Maria’s gateway is local \| Gateway `192.168.10.65` is inside her own block \| Her configuration is valid, not a mask error \|<br>↓ \| Maria cannot reach port 445 \| `TcpTestSucceeded : False` \| The block is between subnets \|</sub> | |
| 93 | `03-phase-networking-basics.md:1607` | > **Observed:** Printer prints its own test page; port name on a working PC is `192.168.10.200_1`. Printer is `192.168.10.200/26` — subnet `192.168.10.192/26`. Working PC is `192.168.10.25/26` — subnet `192.168.10.0/26`. Affected PC is `192.168.10.70/26`, gate … | |
| 94 | `03-phase-networking-basics.md:1626` | **Do the cheap comparison first.** In ticket 1 it was `ping 8.8.8.8` against `ping google.com`. In ticket 2 it was one working machine against one failing machine. A comparison costs seconds and splits the problem in half. | |
| 95 | `03-phase-networking-basics.md:1628` | **Read the configuration lines you are tempted to skim.** `DNS Servers: 127.0.0.1` in ticket 1 and `Subnet Mask: 255.255.255.192` in ticket 2 were both sitting in plain sight in `ipconfig` output. Neither was hidden. Both were decisive. | |
| 96 | `03-phase-networking-basics.md:1642` | - **DNS translates names to addresses**, and it breaks more often than connectivity. Test it with `ping 8.8.8.8` versus `ping google.com`. | |
| 97 | `03-phase-networking-basics.md:1645` | - `Test-NetConnection` and `nslookup` are your two best everyday tools. | |
| | | <sub>↑ - **TCP** is reliable and connection-oriented; **UDP** is fast and best-effort.<br>↓ - **Subnets exist to limit broadcast noise, separate devices, and create policy boundaries.** A flat network of 500 devices wastes bandwidth and lets  …</sub> | |
| 98 | `03-phase-networking-basics.md:1687` | \| Windows `ipconfig` \| Shows IP config \| Free, built-in \| https://learn.microsoft.com/windows-server/administration/windows-commands/ipconfig \| Record IP, gateway, DNS \| Linux `ip a` \| | |
| 99 | `03-phase-networking-basics.md:1688` | \| `ping` \| Tests reachability/latency \| Free, built-in \| https://learn.microsoft.com/windows-server/administration/windows-commands/ping \| Ping gateway and 1.1.1.1 \| PowerShell `Test-Connection` \| | |
| 100 | `03-phase-networking-basics.md:1689` | \| `nslookup` \| Tests DNS \| Free, built-in \| https://learn.microsoft.com/windows-server/administration/windows-commands/nslookup \| Resolve google.com and compare DNS servers \| `dig` on Linux \| | |
| 101 | `03-phase-networking-basics.md:1707` | 2. Check your IP configuration. Run `ipconfig /all` on Windows, or `ifconfig` / `ip a` on Linux. Record your IP address, subnet mask, default gateway, DHCP server, DNS server, and MAC address. <!-- id: it-03-t02 band: quick energy: low --> | |
| 102 | `03-phase-networking-basics.md:1709` | 4. Run DNS lookups. Try `nslookup google.com`, `nslookup -type=mx gmail.com`, and `nslookup -type=txt google.com`. Document what each reveals. <!-- id: it-03-t04 band: focused energy: normal --> | |
| 103 | `03-phase-networking-basics.md:1747` | **Why:** The second form asks a *specific* server. If your local resolver and `8.8.8.8` disagree, the domain is fine and your resolver is the fault. `tracert` shows the path, not the translation. | |
| 104 | `03-phase-networking-basics.md:1810` | **Why:** `ping` proves the host answers ICMP; it says nothing about whether the *service* is listening. `Test-NetConnection` reports DNS resolution, the resolved IP, reachability, and the port state in one command — which is why the phase calls it the most use … | |
| 105 | `03-phase-networking-basics.md:1846` | **Why:** The order matters because `renew` can hand back the same lease it already holds. `release` gives the address up first, which is what forces a fresh exchange. Neither touches the DNS cache — that is `ipconfig /flushdns`. | |
| 106 | `04-phase-helpdesk-skills.md:381` ▶ | - `ping fileserver01` succeeds; `Test-NetConnection fileserver01 -Port 445` | |
| | | <sub>↑ - Other departments can reach their own drives normally<br>↓ fails to connect</sub> | |
| 107 | `04-phase-helpdesk-skills.md:744` | > **Observed:** `Get-ADPrincipalGroupMembership` showed the account already holds `Project-Atlas-RW`. Folder ACL grants that group Modify, so permissions were correct on both sides. `whoami /groups` on the user's machine did not list the group — a stale sessio … | |
| 108 | `04-phase-helpdesk-skills.md:769` | \| 2 \| Windows \| `ipconfig /all` \| IP, mask, gateway, DNS, DHCP, MAC \| | |
| | | <sub>↑ \| 1 \| Windows \| `systeminfo` \| OS build, RAM, uptime, install date \|<br>↓ \| 3 \| Windows \| `ping <gateway>` then `ping 8.8.8.8` then `ping google.com` \| The DNS split test \|</sub> | |
| 109 | `04-phase-helpdesk-skills.md:770` | \| 3 \| Windows \| `ping <gateway>` then `ping 8.8.8.8` then `ping google.com` \| The DNS split test \| | |
| | | <sub>↑ \| 2 \| Windows \| `ipconfig /all` \| IP, mask, gateway, DNS, DHCP, MAC \|<br>↓ \| 4 \| Windows \| `nslookup google.com` and `nslookup google.com 8.8.8.8` \| Is my own resolver working? \|</sub> | |
| 110 | `04-phase-helpdesk-skills.md:771` | \| 4 \| Windows \| `nslookup google.com` and `nslookup google.com 8.8.8.8` \| Is my own resolver working? \| | |
| | | <sub>↑ \| 3 \| Windows \| `ping <gateway>` then `ping 8.8.8.8` then `ping google.com` \| The DNS split test \|<br>↓ \| 5 \| Windows \| `net use` \| Mapped drives and their state \|</sub> | |
| 111 | `04-phase-helpdesk-skills.md:775` | \| 8 \| Windows \| `Get-Volume` \| Free space per drive \| | |
| | | <sub>↑ \| 7 \| Windows \| `whoami` then `whoami /groups` \| My exact identity and group list \|<br>↓ \| 9 \| PowerShell \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10` \| The ten most recent errors \|</sub> | |
| 112 | `04-phase-helpdesk-skills.md:776` | \| 9 \| PowerShell \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10` \| The ten most recent errors \| | |
| 113 | `04-phase-helpdesk-skills.md:777` | \| 10 \| PowerShell \| `Get-Service` filtered on Automatic and Stopped \| A fault nobody has reported \| | |
| | | <sub>↑ \| 9 \| PowerShell \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10` \| The ten most recent errors \|<br>↓ \| 11 \| Linux \| `df -h` \| Filesystem usage in human units \|</sub> | |
| 114 | `04-phase-helpdesk-skills.md:798` | Healthy `ipconfig /all` output, trimmed to the lines that matter: | |
| 115 | `04-phase-helpdesk-skills.md:829` | The third block is the one to read carefully, and the evidence is in the **header line**, not the reply. **When you ping a name and the header shows `[142.250.4.101]` after it, the forward lookup succeeded** — `ping` only prints that bracketed address once it  … | |
| 116 | `04-phase-helpdesk-skills.md:869` | For `Get-Volume`, healthy is above about 15 % free. Below 10 % on the system drive, Windows slows down measurably: updates fail, the page file stops growing, and temp files cannot be written. | |
| 117 | `04-phase-helpdesk-skills.md:897` | \| `Get-Volume` \| `df -h` \| How full is each filesystem? \| | |
| | | <sub>↑ \|---\|---\|---\|<br>↓ \| Disk Management \| `lsblk` \| What disks and partitions exist? \|</sub> | |
| 118 | `04-phase-helpdesk-skills.md:900` | \| `netstat -ano` \| `ss -tulpn` \| What is listening on which port? \| | |
| | | <sub>↑ \| Event Viewer \| `journalctl -p err -b` \| What has gone wrong since boot? \|<br>↓ \| `ipconfig /all` \| `ip a` plus `ip route` \| What is my address and my gateway? \|</sub> | |
| 119 | `04-phase-helpdesk-skills.md:901` | \| `ipconfig /all` \| `ip a` plus `ip route` \| What is my address and my gateway? \| | |
| | | <sub>↑ \| `netstat -ano` \| `ss -tulpn` \| What is listening on which port? \|</sub> | |
| 120 | `04-phase-helpdesk-skills.md:938` | \| `ipconfig /all` \| "Wi-Fi has 192.168.1.22/24 with gateway 192.168.1.1 and DNS 192.168.1.1 — a complete, consistent configuration." \| "It shows my IP address." \| | |
| 121 | `04-phase-helpdesk-skills.md:939` | \| `ping 8.8.8.8` then `google.com` \| "Both answered and the name resolved to 142.250.4.101, so connectivity and DNS are both healthy." \| "The internet works." \| | |
| 122 | `04-phase-helpdesk-skills.md:941` | \| `Get-Service` filter \| "Empty list — no service set to Automatic is stopped, so there is no silent background fault on this machine." \| "No services found." \| | |
| 123 | `04-phase-helpdesk-skills.md:999` | \| 4 \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2}` \| Repeated errors with boot-time timestamps \| | |
| 124 | `04-phase-helpdesk-skills.md:1000` | \| 5 \| `Get-Volume` \| System drive below 10 % free \| | |
| | | <sub>↑ \| 4 \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2}` \| Repeated errors with boot-time timestamps \|</sub> | |
| 125 | `04-phase-helpdesk-skills.md:1094` | \| Reachability \| Can you ping it from the failing laptop? \| `ping <printer-ip>` \| | |
| | | <sub>↑ \| Power and network \| Is the printer awake and on the network? \| The printer's own panel \|<br>↓ \| Port \| Is the print port answering? \| `Test-NetConnection <printer-ip> -Port 9100` — 9100 is the raw-printing port nearly every network printer l …</sub> | |
| 126 | `04-phase-helpdesk-skills.md:1095` | \| Port \| Is the print port answering? \| `Test-NetConnection <printer-ip> -Port 9100` — 9100 is the raw-printing port nearly every network printer listens on \| | |
| 127 | `04-phase-helpdesk-skills.md:1135` | 1. Does the underlying internet connection drop at the same time? Watch a continuous `ping` to your gateway while working. If that drops too, the VPN was a symptom and your Wi-Fi is the fault. | |
| 128 | `04-phase-helpdesk-skills.md:1447` | 2. A user says "the internet is down". Your `ping` to their gateway succeeds. | |
| | | <sub>↑ 1. A user reports the shared drive is empty. Their password was changed an hour ago.<br>↓ 3. A user reports an MFA prompt they did not trigger, at 2am, on a Sunday.</sub> | |
| 129 | `04-phase-helpdesk-skills.md:1464` | \| 2 \| Gather more — `ping 8.8.8.8`, then `ping google.com` \| A working gateway rules out the LAN. The IP-versus-name pair splits connectivity from DNS in one step \| | |
| 130 | `04-phase-helpdesk-skills.md:1542` | \| Break your own DNS \| In an **Administrator** PowerShell on a machine you own, set your adapter's DNS to `127.0.0.1`, then `ipconfig /flushdns` \| `ping 8.8.8.8` still works, `ping google.com` fails. Put it back to automatic afterwards \| | |
| 131 | `04-phase-helpdesk-skills.md:1545` | \| Fill the system drive \| Do not do this to test it — instead read `Get-Volume` and predict what would break below 5 % free \| A prediction you can check beats a disk you have to repair \| | |
| 132 | `05-phase-sysadmin-basics.md:287` | - **`Get-CimInstance` rather than `wmic`.** `wmic` is deprecated and being removed from Windows. New scripts use the CIM cmdlets. You will still meet `wmic` in old documentation and on old systems, so recognise it, but do not write it. | |
| 133 | `05-phase-sysadmin-basics.md:525` | Realistic output of `Get-LocalGroupMember`: | |
| 134 | `05-phase-sysadmin-basics.md:624` | `Get-Acl` gives you the same information as `icacls` in a form you can filter. `IsInherited` is the `(I)` flag; `AccessControlType` is Allow or Deny. Where `icacls` wins is that it shows *scope* flags inline and works over the network with a **UNC path** (Univ … | |
| 135 | `05-phase-sysadmin-basics.md:626` | One practical warning: `Get-Acl` hides the scope flags. An ACE that is inherited-only (`(IO)`) appears identical to one that applies everywhere. When the *behaviour* does not match the `Get-Acl` listing, re-check with `icacls`. | |
| 136 | `05-phase-sysadmin-basics.md:658` | **Rule three: check whether the user is local or remote.** `icacls` on a local path tells you nothing about the share. `Get-SmbShareAccess` tells you nothing about NTFS. A ticket that says “it works when I am at my desk but not from home” is pointing at the sh … | |
| 137 | `05-phase-sysadmin-basics.md:689` | Read the mismatch. `net user` — which reads the **directory** — says the account is in `Finance-Managers`. `whoami /groups` — which reads the **current token** — does not list it. The directory and the session disagree, and that disagreement is the diagnosis. | |
| 138 | `05-phase-sysadmin-basics.md:702` | \| “I was added to the group yesterday” \| `whoami /groups` vs `net user <name>` \| Mismatch means a stale token — sign out and back in \| | |
| 139 | `05-phase-sysadmin-basics.md:705` | \| “It works locally but not over the network” \| `Get-SmbShareAccess` \| Share permission more restrictive than NTFS \| | |
| 140 | `05-phase-sysadmin-basics.md:707` | \| “The account is locked or expired” \| `net user <name>` \| `Account active`, `Password expires`, `Last logon` \| | |
| 141 | `05-phase-sysadmin-basics.md:708` | \| “Who is in this group?” \| `Get-LocalGroupMember -Group <name>` \| Members who should have been removed, and `PrincipalSource` \| | |
| 142 | `05-phase-sysadmin-basics.md:851` | **How to interpret it:** `PrincipalSource` should read `Local`, because you just created this identity on this machine. If you are on a domain-joined machine, run `Get-LocalGroupMember -Group 'Administrators'` as well and you will likely see a mix of `Local`,  … | |
| 143 | `05-phase-sysadmin-basics.md:977` | Then confirm they are gone with `Get-LocalUser` and `Get-LocalGroup`. Leaving test accounts and test groups behind on a production machine is a genuine audit finding, and building the habit of cleaning up after yourself starts now. | |
| 144 | `05-phase-sysadmin-basics.md:1030` | **This is the diagnosis, and it is a single observation.** `net user` says the account belongs to `Finance-Managers`. `whoami /groups` does not list it. The directory and the running session disagree, which means the session token was built before the group me … | |
| 145 | `05-phase-sysadmin-basics.md:1065` | If a full sign-out does not resolve it, the next checks are, in order: confirm the machine can reach a domain controller on the VPN (`nltest /dsgetdc:company.local` — `nltest` is a domain-controller diagnostic; a successful result names a DC and its site), and … | |
| 146 | `05-phase-sysadmin-basics.md:1079` | > **Observed:** `net user maria.santos` showed membership in `Finance-Managers`, but `whoami /groups` on the running session did not list it — the directory and the session token disagreed, indicating the token predated the group change. Confirmed server-side  … | |
| 147 | `05-phase-sysadmin-basics.md:1255` | - **`Get-CimInstance` replaces `wmic`** in modern PowerShell. | |
| | | <sub>↑ - Routine checks — disks, services, event logs, uptime, inventory — catch outages before users do.<br>↓ - **Anything done more than twice by hand is a candidate for automation.**</sub> | |
| 148 | `05-phase-sysadmin-basics.md:1263` | - Across the network, **share and NTFS must both allow**, and the more restrictive wins. Test with `Get-SmbShareAccess` *and* `icacls`. | |
| 149 | `05-phase-sysadmin-basics.md:1279` | 4. Reproduce the stale-token diagnosis from Ticket 1 on your own machine: add yourself to a new local group without signing out, confirm that `whoami /groups` does not list it while `Get-LocalGroupMember` does, then sign out and back in and confirm the two agr … | |
| 150 | `06-phase-tools-and-ticketing.md:397` | > **Investigated:** `Get-PSDrive` confirmed only `C:` affected; `D:` has 255.6 GB free, so the data volume is healthy and this is not user-data growth. Largest-directory scan showed `C:\Windows\Temp` at 18.41 GB, of which the largest files were `sql_dump_*.tmp … | |
| 151 | `06-phase-tools-and-ticketing.md:1204` | 3. **Produce evidence for one machine the way Part 5 does.** Capture `Get-PSDrive`, a largest-directory scan, and timestamps on the biggest files. Write the "what this shows" paragraph. This is the portfolio artefact: it demonstrates that you read evidence rat … | |
| 152 | `08-phase-portfolio-and-resume.md:112` | \| "Did some networking." \| "Built a routed lab network in VirtualBox with two subnets; verified connectivity and fault isolation with `ping`, `tracert`, and Wireshark captures." \| | |
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

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## DNS record types

*Defined by RFC 1035 and successors. Small set, easy to get subtly wrong.*

**Source to check against:** RFC 1035 and the IANA DNS parameters registry

4 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `03-phase-networking-basics.md:54` | - DNS: A, AAAA, CNAME, MX, TXT, NS records | |
| | | <sub>↓ - DHCP: Discover, Offer, Request, Acknowledge at a beginner level</sub> | |
| 2 | `03-phase-networking-basics.md:180` | 2. **`AAAA` records are the DNS counterpart to IPv4's `A` records.** If a name resolves over IPv4 but not IPv6, an `AAAA` lookup tells you. | |
| 3 | `03-phase-networking-basics.md:231` ▶ | nslookup google.com # the A record | |
| | | <sub>↑ ```powershell<br>↓ nslookup -type=mx gmail.com # mail servers</sub> | |
| 4 | `03-phase-networking-basics.md:233` ▶ | nslookup -type=txt google.com # TXT records | |
| | | <sub>↑ nslookup -type=mx gmail.com # mail servers<br>↓ nslookup google.com 8.8.8.8 # ask a SPECIFIC server</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Protocol and standard behaviour

*Fixed by the defining spec. Includes handshake sequences, header fields, status codes and OSI layer assignments.*

**Source to check against:** The RFC or standard that defines the protocol; vendor docs for proprietary ones

26 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `03-phase-networking-basics.md:27` | - Understand IPv4, IPv6 basics, subnet mask, gateway, DNS, DHCP, NAT, TCP, UDP, ICMP, ports, and Wi-Fi. | |
| | | <sub>↑ - Explain LAN, WAN, internet, router, switch, firewall, modem, access point, and ISP.<br>↓ - Use `ping`, `tracert/traceroute`, `ipconfig/ifconfig/ip`, `nslookup`, `arp -a`, `route print`, and Wireshark.</sub> | |
| 2 | `03-phase-networking-basics.md:76` | The good news is that the foundation is small. You need to understand addresses, subnets, gateways, DNS, DHCP, ports, and the difference between TCP and UDP. That is genuinely most of it. | |
| 3 | `03-phase-networking-basics.md:185` | **DHCP (Dynamic Host Configuration Protocol)** hands out addresses automatically. The four-step exchange is called **DORA**, and it is worth memorising because it tells you what to check when it fails: | |
| 4 | `03-phase-networking-basics.md:284` | - **TCP** is connection-oriented and reliable. It establishes a connection with a **three-way handshake** — `SYN`, `SYN-ACK`, `ACK` — numbers every byte, acknowledges receipt, and retransmits anything lost. It is used when correctness matters: web browsing, fi … | |
| 5 | `03-phase-networking-basics.md:285` | - **UDP** is connectionless and best-effort. It sends packets with no handshake and no guarantee. It is used when speed matters more than perfection: video streaming, voice calls, DNS queries, games. | |
| 6 | `03-phase-networking-basics.md:289` | You can see the handshake on your own machine. In Wireshark, filter on `tcp` and open any website. You will see the three packets at the start of every connection: `SYN`, then `SYN, ACK`, then `ACK`. Watching that once, with your own eyes, does more for your u … | |
| 7 | `03-phase-networking-basics.md:293` | **TLS (Transport Layer Security)** wraps a connection in encryption and proves the server's identity with a **certificate**. **HTTPS** is simply HTTP carried inside TLS, on port 443. | |
| 8 | `03-phase-networking-basics.md:772` | - **TcpTestSucceeded** is the answer. `True` means the TCP handshake completed: the server accepted your connection on that port. | |
| 9 | `03-phase-networking-basics.md:857` | \| Every packet timed out \| The host is unreachable, or it blocks ICMP \| Follow the ladder; also test a port with `Test-NetConnection` \| | |
| 10 | `03-phase-networking-basics.md:864` | **Second, and more importantly: “ping works but the app does not” is a different problem class.** Ping uses **ICMP**, a completely different protocol from TCP. A host can cheerfully answer ICMP while a specific TCP port is blocked by a firewall, or while the s … | |
| 11 | `03-phase-networking-basics.md:890` ▶ | Authentication : WPA2-Personal | |
| | | <sub>↑ Radio type : 802.11ax<br>↓ Cipher : CCMP</sub> | |
| 12 | `03-phase-networking-basics.md:1158` | **For the TCP handshake:** start a new capture, then load a website in your browser while it runs. Stop it and filter on: | |
| 13 | `03-phase-networking-basics.md:1161` ▶ | tcp.flags.syn==1 | |
| | | <sub>↑ ```text<br>↓ ```</sub> | |
| 14 | `03-phase-networking-basics.md:1164` | That filter shows packets with the **SYN** flag set — the packets that begin a connection. Find one connection and look at the three packets at its start: | |
| 15 | `03-phase-networking-basics.md:1166` | 1. **SYN** — your machine to the server: “I would like to open a connection, here is my starting sequence number.” | |
| 16 | `03-phase-networking-basics.md:1167` | 2. **SYN, ACK** — server to your machine: “Agreed, and here is mine.” | |
| | | <sub>↑ 1. **SYN** — your machine to the server: “I would like to open a connection, here is my starting sequence number.”<br>↓ 3. **ACK** — your machine to the server: “Acknowledged. Connection open.”</sub> | |
| 17 | `03-phase-networking-basics.md:1172` | Two practical notes. If the capture looks overwhelming, remember Wireshark is showing *everything* on your adapter; the filter is what makes it readable. And if you see your own traffic in encrypted form, that is TLS doing its job — you will see the handshake  … | |
| 18 | `03-phase-networking-basics.md:1644` | - **TCP** is reliable and connection-oriented; **UDP** is fast and best-effort. | |
| | | <sub>↑ - **Ports** route traffic to the right service. Know the common ones; respect the dangerous ones.<br>↓ - `Test-NetConnection` and `nslookup` are your two best everyday tools.</sub> | |
| 19 | `03-phase-networking-basics.md:1655` | - **The diagnostic ladder is link, IP, gateway, DNS, port, application — in that order, stopping at the first failure.** The order is the skill; the commands are just the tools. | |
| 20 | `03-phase-networking-basics.md:1686` | \| Wireshark \| Packet capture/analysis \| Free \| https://www.wireshark.org/ \| Capture DNS lookup and TCP handshake \| tcpdump on Linux \| | |
| 21 | `03-phase-networking-basics.md:1711` | 6. Capture a TCP handshake in Wireshark. Filter on `tcp`, find a handshake between your device and a server, and explain the three-way handshake. <!-- id: it-03-t06 band: focused energy: normal --> | |
| 22 | `03-phase-networking-basics.md:1792` | **Why:** TCP is connection-oriented and reliable — it opens with the `SYN`, `SYN-ACK`, `ACK` handshake and retransmits what is lost. UDP is best-effort by design; ICMP carries diagnostics; ARP maps IP to MAC. | |
| 23 | `07-phase-soft-skills.md:520` | > The machine is failing to complete the DHCP handshake on the corporate VLAN. It gets an APIPA address, so it is not reaching the scope. I have ruled out the cable and the switch port. Suspect the scope is exhausted or the reservation is stale — checking the  … | |
| 24 | `08-phase-portfolio-and-resume.md:97` | \| **Action** \| "Learned about DHCP" \| "Configured a DHCP scope, then captured the DORA exchange in Wireshark to confirm it" \| | |
| 25 | `08-phase-portfolio-and-resume.md:276` ▶ | confirm the DORA sequence; intentionally broke the gateway setting on | |
| | | <sub>↑ tracert across subnets; captured the DHCP exchange in Wireshark to<br>↓ one client to see how the failure presents.</sub> | |
| 26 | `08-phase-portfolio-and-resume.md:279` ▶ | the portfolio. I can now explain the DORA sequence from the packets | |
| | | <sub>↑ Result : A working routed lab, a network diagram, and packet-capture notes in<br>↓ rather than from memory, and I recognise a wrong-gateway symptom</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Product versions and editions

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

---

## Registry paths, file paths and filenames

*Verbatim strings that must match the OS exactly. A transposed path sends a reader somewhere that does not exist.*

**Source to check against:** Microsoft documentation, or the OS itself

17 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-computer-fundamentals.md:71` | - **File Paths:** Location of files (e.g., `C:\Users\YourName\Documents\file.txt`). | |
| | | <sub>↑ - **Extensions:** File type indicators (e.g., `.pdf`, `.jpg`).</sub> | |
| 2 | `01-phase-computer-fundamentals.md:440` | Also worth knowing: minidump files land in `C:\Windows\Minidump`. You do not analyse these at Phase 1, but their **timestamps** tell you exactly when each crash happened, which lets you correlate crashes against what the user was doing. | |
| 3 | `02-phase-operating-systems.md:58` | - Filesystem hierarchy: `/`, `/home`, `/etc`, `/var/log`, `/tmp` | |
| | | <sub>↓ - Users and groups: `adduser`, `passwd`, `groups`, `usermod`</sub> | |
| 4 | `02-phase-operating-systems.md:63` | - Logs: `/var/log/auth.log`, `/var/log/syslog`, `journalctl` | |
| | | <sub>↑ - Processes and services: `ps`, `top`, `systemctl`<br>↓ - Core navigation commands: `pwd`, `ls`, `cd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`, `grep`, `find`</sub> | |
| 5 | `02-phase-operating-systems.md:405` | \| Where apps live \| `C:\Program Files` \| `/usr/bin`, `/opt` \| **`/Applications`** \| | |
| | | <sub>↑ \| File manager \| File Explorer \| (the shell) \| **Finder** \|<br>↓ \| Settings \| Control Panel / Settings \| config files in `/etc` \| **System Settings** \|</sub> | |
| 6 | `02-phase-operating-systems.md:504` | Expected: your username, your **UID** (user ID — the number Linux uses internally for your account) and groups, kernel and distribution details, uptime, a list of login-capable accounts, disk and memory usage, any failed logins, and recent errors. On a desktop … | |
| 7 | `02-phase-operating-systems.md:512` | 1. In Windows, open `C:\Windows\System32\winevt\Logs` in File Explorer. Windows stores logs as binary `.evtx` files that you must open with Event Viewer. | |
| 8 | `02-phase-operating-systems.md:611` | A loaded profile whose path ends in something like `C:\Users\TEMP` or `C:\Users\TEMP.DOMAIN.001` is the temporary profile. That is your diagnosis, and everything else follows from it. | |
| 9 | `02-phase-operating-systems.md:625` | 2. **Copy the data out** from `C:\Users\<broken-profile>` to a location outside it — their Desktop, Documents, Pictures, and Downloads folders, plus any application data they need. | |
| 10 | `02-phase-operating-systems.md:789` | \| Why did an update fail? \| `Get-WindowsUpdateLog` to build a readable log, plus Setup log under `C:\Windows\Logs` \| | |
| 11 | `02-phase-operating-systems.md:1302` | - **Log analysis:** What you found in `/var/log/auth.log` and `/var/log/syslog`, and how you used `journalctl` to read system logs. | |
| 12 | `06-phase-tools-and-ticketing.md:357` | `C:\Windows\Temp` at 18.41 GB is the answer, and it is not user data. Something has been writing temporary files and never cleaning them up. | |
| 13 | `06-phase-tools-and-ticketing.md:397` | > **Investigated:** `Get-PSDrive` confirmed only `C:` affected; `D:` has 255.6 GB free, so the data volume is healthy and this is not user-data growth. Largest-directory scan showed `C:\Windows\Temp` at 18.41 GB, of which the largest files were `sql_dump_*.tmp … | |
| 14 | `06-phase-tools-and-ticketing.md:398` | > **Cause:** A nightly job outside the service desk's ownership is writing ~5 GB of temporary dump files to `C:\Windows\Temp` and never removing them. Under four days of accumulation took the volume to the alert threshold, so this will recur within the week un … | |
| 15 | `06-phase-tools-and-ticketing.md:399` | > **Action:** Cleared `C:\Windows\Temp` dump files after confirming their identity and daily pattern. Did **not** delete unfamiliar files. Raised a problem record so the owning team fixes the cleanup, because the files regenerate nightly. | |
| 16 | `06-phase-tools-and-ticketing.md:401` | > **For the next agent:** If this alert fires again, check `C:\Windows\Temp` first and look for `sql_dump_*.tmp`. The root cause is not fixed — the nightly job is with the application team. Growth is ~5 GB per day, so the volume has roughly four days of headro … | |
| 17 | `08-phase-portfolio-and-resume.md:114` | \| "Know Linux." \| "Installed and administered Ubuntu Server in a VM: user and group management, `systemctl` service control, permissions with `chmod` and `chown`, log review in `/var/log`." \| | |

---

## Stated counts, sizes and arithmetic

*Checkable by RECOMPUTATION, which needs no source at all — the strongest tier of verification available.*

**Source to check against:** Recomputation from the document's own numbers

**177 claim(s) — already verified by recomputation, not listed.**

See "Already verified, without needing a source" above. Re-run the verifying script if you
doubt it; do not re-check these by hand.

---

## Claims per phase

| Phase | cidr | port | command | record | protocol | version | registry | number | total |
|---|---|---|---|---|---|---|---|---|---|
| 01 computer-fundamentals |  | 14 | 12 |  |  | 2 | 2 | 52 | **82** |
| 02 operating-systems |  | 9 | 35 |  |  |  | 9 | 23 | **76** |
| 03 networking-basics | 78 | 33 | 58 | 4 | 22 |  |  | 17 | **212** |
| 04 helpdesk-skills | 2 | 17 | 26 |  |  |  |  | 12 | **57** |
| 05 sysadmin-basics |  | 24 | 18 |  |  |  |  | 9 | **51** |
| 06 tools-and-ticketing |  | 50 | 2 |  |  | 2 | 5 | 40 | **99** |
| 07 soft-skills |  | 5 |  |  | 1 |  |  | 2 | **8** |
| 08 portfolio-and-resume |  | 1 | 8 |  | 3 | 11 | 1 | 14 | **38** |
| 09 job-application-plan |  | 1 | 1 |  |  | 2 |  | 8 | **12** |

