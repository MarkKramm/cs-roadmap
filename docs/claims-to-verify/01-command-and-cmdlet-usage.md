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

# Command and cmdlet usage

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
| 13 | `02-phase-operating-systems.md:52` | - `ipconfig`, `ping`, `tracert`, `nslookup` for network checks | |
| | | <sub>↓ - `net user` and `net localgroup` for account inspection</sub> | |
| 14 | `02-phase-operating-systems.md:53` | - `net user` and `net localgroup` for account inspection | |
| | | <sub>↑ - `ipconfig`, `ping`, `tracert`, `nslookup` for network checks<br>↓ - `sfc /scannow` for system file repair</sub> | |
| 15 | `02-phase-operating-systems.md:54` | - `sfc /scannow` for system file repair | |
| | | <sub>↑ - `net user` and `net localgroup` for account inspection<br>↓ - `chkdsk` and `chkdsk /scan` for disk errors</sub> | |
| 16 | `02-phase-operating-systems.md:55` | - `chkdsk` and `chkdsk /scan` for disk errors | |
| | | <sub>↑ - `sfc /scannow` for system file repair<br>↓ - `systeminfo` for a full system summary</sub> | |
| 17 | `02-phase-operating-systems.md:57` | - PowerShell equivalents: `Get-Process`, `Get-Service`, `Get-EventLog`, `Get-ChildItem`, `Copy-Item` | |
| | | <sub>↑ - `systeminfo` for a full system summary</sub> | |
| 18 | `02-phase-operating-systems.md:63` | - Permissions: `chmod`, `chown`, and reading `rwx` notation | |
| | | <sub>↑ - Users and groups: `adduser`, `passwd`, `groups`, `usermod`<br>↓ - Package management with `apt update` and `apt install`</sub> | |
| 19 | `02-phase-operating-systems.md:65` | - Processes and services: `ps`, `top`, `systemctl` | |
| | | <sub>↑ - Package management with `apt update` and `apt install`<br>↓ - Logs: `/var/log/auth.log`, `/var/log/syslog`, `journalctl`</sub> | |
| 20 | `02-phase-operating-systems.md:67` | - Core navigation commands: `pwd`, `ls`, `cd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`, `grep`, `find` | |
| | | <sub>↑ - Logs: `/var/log/auth.log`, `/var/log/syslog`, `journalctl`<br>↓ - Running commands with `sudo` and understanding when it is necessary</sub> | |
| 21 | `02-phase-operating-systems.md:120` | - **Service problems** — a function that should run in the background is stopped: printing, Windows Update, a network service. `Get-Service` or `systemctl status` shows it. | |
| 22 | `02-phase-operating-systems.md:210` | The `ping` pair is the single most useful diagnostic in beginner IT, and understanding *why* will set you apart. Pinging `8.8.8.8` tests connectivity by IP address, bypassing DNS entirely. Pinging `google.com` tests connectivity **and** name resolution. So: | |
| 23 | `02-phase-operating-systems.md:213` | - IP works, name fails → the network is fine and **DNS is broken**. Check the configured DNS servers with `ipconfig /all`. | |
| 24 | `02-phase-operating-systems.md:226` | Order matters. `sfc /scannow` repairs system files, but it draws its replacement files from a component store that can itself be corrupted. If `sfc` reports unfixable errors, run the `DISM` repair, then run `sfc` again. `chkdsk C: /scan` is the modern online s … | |
| 25 | `02-phase-operating-systems.md:316` | **Ownership and permission are different problems.** "Permission denied" means *this account is not allowed*, which may be fixed by `chmod`, `chown`, or using `sudo`. "No such file or directory" means the path is wrong. Confusing the two sends you down the wro … | |
| 26 | `02-phase-operating-systems.md:348` | `grep` is the single most valuable Linux skill for support work, because logs are huge and the answer is always a few lines. Piping into it is the idiom to learn: | |
| 27 | `02-phase-operating-systems.md:378` | `systemctl status` is the first thing to run for any "the service isn't working" problem. It reports whether the unit is active, when it last started, its process ID, and — critically — the last few log lines, which usually state the failure reason directly. | |
| 28 | `02-phase-operating-systems.md:398` | Compare this to Windows Event Viewer. Both record the same kinds of events; Linux simply hands them to you as text, which means `grep` and `journalctl` replace an entire GUI. Once you have used `journalctl --since "1 hour ago"` to find why a service died, the  … | |
| 29 | `02-phase-operating-systems.md:428` | **What carries over, and what does not.** Your troubleshooting *method* is identical on all three: establish scope, read the evidence, change one thing, verify. Your Windows *commands* do not carry over; anyone who tells you to run `sfc /scannow` on a Mac is t … | |
| 30 | `02-phase-operating-systems.md:531` | \| Machine is slow \| `Get-Process \\| Sort WorkingSet -Descending` or `top` \| Identify the process; stop or restart it; check RAM \| | |
| 31 | `02-phase-operating-systems.md:532` | \| Cannot log in \| Account disabled or locked \| `Get-LocalUser`; re-enable or reset the password \| | |
| | | <sub>↑ \| Machine is slow \| `Get-Process \\| Sort WorkingSet -Descending` or `top` \| Identify the process; stop or restart it; check RAM \|<br>↓ \| Access denied to a folder \| NTFS permissions or Linux mode bits \| Check group membership; `icacls C:\path` on Windows, `ls -l` on Linux \|</sub> | |
| 32 | `02-phase-operating-systems.md:537` | \| Windows Update fails \| Component store corruption \| `DISM /Online /Cleanup-Image /RestoreHealth`, then `sfc /scannow` \| | |
| 33 | `02-phase-operating-systems.md:538` | \| Service will not start \| Its own log entries \| `systemctl status` or Event Viewer; read the stated reason \| | |
| 34 | `02-phase-operating-systems.md:539` | \| Disk full \| `Get-Volume` or `df -h` \| Disk Cleanup, temp files, old update files, logs \| | |
| | | <sub>↑ \| Service will not start \| Its own log entries \| `systemctl status` or Event Viewer; read the stated reason \|<br>↓ \| Application crashes repeatedly \| Application log, plus its AppData `Local` folder \| Reset the app's profile; check for updates \|</sub> | |
| 35 | `02-phase-operating-systems.md:573` | From the command line, `MpCmdRun.exe -Scan -ScanType 2` runs a full scan, and `Get-MpThreatDetection` lists what has been found. Knowing these exist matters more than memorising them: it tells an interviewer you have actually looked at Defender rather than onl … | |
| 36 | `02-phase-operating-systems.md:709` | `whoami` returning something like `MACHINENAME\alex` points at a local or Microsoft account on a standalone machine; `DOMAIN\alex` points at a directory. `PrincipalSource` on `Get-LocalUser` distinguishes a local account from one backed by a Microsoft or Azure … | |
| 37 | `02-phase-operating-systems.md:721` | Task Manager shows you a list. `Get-Process` shows you the same list with numbers you can reason about. Four of those numbers carry almost all the diagnostic weight: | |
| 38 | `02-phase-operating-systems.md:749` | `Get-Service` reports a **Status** (is it running now?) and a **StartType** (should it start at boot?). Those are different questions, and the gap between them is where real faults hide: | |
| 39 | `02-phase-operating-systems.md:872` | \| Why did an update fail? \| `Get-WindowsUpdateLog` to build a readable log, plus Setup log under `C:\Windows\Logs` \| | |
| 40 | `02-phase-operating-systems.md:920` | That is the whole method: `systemctl status` gives you a verdict, the failing step, and the reason, in one output. Beginners restart the service and hope. Technicians read the reason. The four commands worth knowing: | |
| 41 | `02-phase-operating-systems.md:966` | 3. **Fix the membership, not the file.** Adding the user to the right group is reversible and auditable. Running `chmod 777` is neither, and it is how access control quietly degrades across an organisation. If you find yourself typing `777` on a shared system, … | |
| 42 | `02-phase-operating-systems.md:1171` | > **Observed:** Two `Get-Process` readings 15 minutes apart showed chrome growing from 2410 MB / 3120 handles to 3180 MB / 4188 handles during ordinary browsing — a sustained monotonic increase. Free physical memory 0.6 GB of 7.9 GB. No errors in the System lo … | |
| 43 | `02-phase-operating-systems.md:1257` | > **Observed:** Other users could access the same share normally, ruling out server-side or data loss. The folder opened without an access-denied error, so share-level permission was intact. `whoami /groups` on the user's machine showed a cached token; `Get-AD … | |
| 44 | `02-phase-operating-systems.md:1301` | 2. A user says "the internet is down". Which two `ping` commands distinguish a connectivity failure from a DNS failure? | |
| 45 | `02-phase-operating-systems.md:1327` | - **Fix the group membership, not the file.** Adding a user to a group is reversible and auditable; `chmod 777` is neither, and it is how access control degrades across an organisation. | |
| 46 | `02-phase-operating-systems.md:1368` | 4. Use `ipconfig`, `ping`, `nslookup`, and `tracert` on Windows. <!-- id: it-02-t04 band: focused energy: normal --> | |
| 47 | `02-phase-operating-systems.md:1369` | 5. Use `ls`, `grep`, `chmod`, `systemctl`, and `journalctl` on Linux. <!-- id: it-02-t05 band: focused energy: normal --> | |
| 48 | `02-phase-operating-systems.md:1383` | - **Command guides:** 20 Windows commands with explanations (for example `ipconfig`, `ping`, `sfc /scannow`, `chkdsk`, `net user`) and 20 Linux commands with explanations (for example `ls`, `cd`, `chmod`, `chown`, `systemctl`, `journalctl`). | |
| 49 | `03-phase-networking-basics.md:28` | - Use `ping`, `tracert/traceroute`, `ipconfig/ifconfig/ip`, `nslookup`, `arp -a`, `route print`, and Wireshark. | |
| 50 | `03-phase-networking-basics.md:127` | Look for **Physical Address** (the MAC) and **IPv4 Address** (the IP). Note that `ipconfig /all` shows one MAC per adapter — your Wi-Fi adapter and your Ethernet adapter each have their own. | |
| 51 | `03-phase-networking-basics.md:228` | You can query all of these yourself with `nslookup`, and doing so is one of the phase's tasks: | |
| 52 | `03-phase-networking-basics.md:251` | - **`8.8.8.8` works, `google.com` fails** → your network is fine; **DNS is broken**. Check the DNS servers reported by `ipconfig /all`, and try a public resolver such as `1.1.1.1` or `8.8.8.8`. | |
| 53 | `03-phase-networking-basics.md:304` | 2. **IP configuration.** Run `ipconfig /all`. Do you have a real address, or a `169.254` one? Is the mask correct? Is there a gateway? | |
| 54 | `03-phase-networking-basics.md:305` | 3. **Gateway.** `ping` your gateway. If the gateway does not answer, nothing upstream can work. | |
| | | <sub>↑ 2. **IP configuration.** Run `ipconfig /all`. Do you have a real address, or a `169.254` one? Is the mask correct? Is there a gateway?<br>↓ 4. **Name resolution.** `ping 8.8.8.8` first — it proves routing and upstream work *without* DNS — then `ping google.com` and `nslookup google.com`. T …</sub> | |
| 55 | `03-phase-networking-basics.md:306` | 4. **Name resolution.** `ping 8.8.8.8` first — it proves routing and upstream work *without* DNS — then `ping google.com` and `nslookup google.com`. The pair is what isolates DNS. | |
| 56 | `03-phase-networking-basics.md:307` | 5. **The specific service's port.** Test the port itself with `Test-NetConnection`. | |
| | | <sub>↑ 4. **Name resolution.** `ping 8.8.8.8` first — it proves routing and upstream work *without* DNS — then `ping google.com` and `nslookup google.com`. T …<br>↓ 6. **The application.** Test the actual thing: a browser, an app, a file share.</sub> | |
| 57 | `03-phase-networking-basics.md:330` | Fix: check the adapter has DHCP enabled, then `ipconfig /release` followed by `ipconfig /renew`. If it still fails, the DHCP server is unreachable — check the router or, at work, whether the client landed in the wrong VLAN. | |
| 58 | `03-phase-networking-basics.md:350` | **Step 5 — DNS.** If `8.8.8.8` worked but `ping google.com` fails with "could not find host", DNS is the fault: | |
| 59 | `03-phase-networking-basics.md:566` | *Ticket-shaped symptom:* “My laptop can reach the file server but not the shared printer, and both are in the same room.” The file server is inside the machine’s believed subnet; the printer is not. You check `ipconfig /all` and compare the subnet mask against … | |
| 60 | `03-phase-networking-basics.md:600` | **Rung 1 — Link.** You are asking: *is there anything to send packets over?* Check `ipconfig /all` for the adapter’s state, or simply look — does Windows show a connected network? For Wi-Fi, are you associated with an SSID at all? If the link is down, stop. No … | |
| 61 | `03-phase-networking-basics.md:602` | **Rung 2 — IP.** You are asking: *do I have an identity on this network?* Run `ipconfig /all`. You want a real address — not `169.254.x.x` — a mask that contains your own address, and a default gateway that also lies inside that mask. Check all three. A correc … | |
| 62 | `03-phase-networking-basics.md:608` | **Rung 5 — Port.** You are asking: *is the actual service reachable?* `Test-NetConnection` against a specific port. Web servers answer on 443, RDP on 3389, SMB on 445. A host can be perfectly pingable while every service on it is blocked. | |
| 63 | `03-phase-networking-basics.md:686` | **FAIL means the device cannot reach its own front door.** Suspect the Wi-Fi association, the access point, the router, or a wrong gateway address in `ipconfig`. Do not proceed upward; nothing above will work. | |
| 64 | `03-phase-networking-basics.md:774` | *Healthy looks like:* `TcpTestSucceeded : True`. If it is `False` while `ping` to the same host succeeds, you have found a port-level block or a dead service — which is a completely different problem class from a connectivity failure, and knowing that is half  … | |
| 65 | `03-phase-networking-basics.md:778` | `tracert` shows the path and where it stops: | |
| 66 | `03-phase-networking-basics.md:843` | Find the `0.0.0.0 0.0.0.0` row and read its Gateway column. That value *is* your default gateway, and seeing it here confirms the machine agrees with what `ipconfig /all` told you. A machine with a VPN client installed often has several of these rows, which is … | |
| 67 | `03-phase-networking-basics.md:847` | `ping` gives you two numbers that beginners tend to ignore: **time** in milliseconds and **loss** as a percentage. | |
| 68 | `03-phase-networking-basics.md:857` | \| Every packet timed out \| The host is unreachable, or it blocks ICMP \| Follow the ladder; also test a port with `Test-NetConnection` \| | |
| 69 | `03-phase-networking-basics.md:868` | Also worth knowing: **many hosts block ICMP deliberately.** `ping` failing is not proof a machine is down. `Test-NetConnection` on a known port is the stronger test. | |
| 70 | `03-phase-networking-basics.md:950` | \| “It says connected but nothing loads” \| 2 — IP \| `ipconfig /all` for a `169.254` address \| | |
| | | <sub>↑ \| “No networks available” \| 1 — Link \| Is Wi-Fi switched on? Is the adapter disabled? Airplane mode? \|<br>↓ \| “The internet is down” \| 3 or 4 \| `ping` the gateway, then `ping 8.8.8.8` \|</sub> | |
| 71 | `03-phase-networking-basics.md:951` | \| “The internet is down” \| 3 or 4 \| `ping` the gateway, then `ping 8.8.8.8` \| | |
| | | <sub>↑ \| “It says connected but nothing loads” \| 2 — IP \| `ipconfig /all` for a `169.254` address \|<br>↓ \| “Some websites work, some do not” \| 4b — DNS \| `nslookup` of a failing name against your resolver and `8.8.8.8` \|</sub> | |
| 72 | `03-phase-networking-basics.md:952` | \| “Some websites work, some do not” \| 4b — DNS \| `nslookup` of a failing name against your resolver and `8.8.8.8` \| | |
| 73 | `03-phase-networking-basics.md:954` | \| “The page loads forever and times out” \| 5 — Port \| `Test-NetConnection` to the site on port 443 \| | |
| | | <sub>↑ \| “It works on my phone but not my laptop” \| 2 or 1 \| This device only. Adapter, DHCP lease, static config \|<br>↓ \| “I cannot reach the file server” \| 2 or 5 \| Is it in your subnet? Does port 445 answer? \|</sub> | |
| 74 | `03-phase-networking-basics.md:965` | - **ISP-side faults.** If your gateway answers, `8.8.8.8` does not, and `tracert` dies inside your ISP’s network, the fault is not yours. You cannot fix it from a laptop. What you *can* do is capture the evidence: the `ipconfig` output, the failed ping, the `t … | |
| 75 | `03-phase-networking-basics.md:982` | > **Observed:** `ipconfig /all` shows IPv4 `169.254.88.4`, mask `255.255.0.0`, no default gateway, DHCP enabled, no lease obtained. Other devices on the same floor have `10.20.30.x/24` with gateway `10.20.30.1`. | |
| 76 | `03-phase-networking-basics.md:983` | > **Tested:** `ipconfig /release` and `/renew` — no lease obtained after three attempts (approximately 90 seconds). Confirmed the device never received a DHCP offer. Cable and switch port LED confirmed live; swapped to a known-good cable and a different wall p … | |
| 77 | `03-phase-networking-basics.md:1154` | Stop the capture and filter on `dns`. You will see a **query** packet (your machine asking) and a **response** packet (the server answering). Click the response and expand the **Answers** section. You will see the name and the address it resolved to — the same … | |
| 78 | `03-phase-networking-basics.md:1182` | 1. **Confirm everything works.** Run the ladder once while healthy: `ipconfig /all`, `ping` the gateway, `ping 8.8.8.8`, `nslookup google.com`. Write down each result. This is your baseline, and it matters because you cannot recognise a failure signature you h … | |
| 79 | `03-phase-networking-basics.md:1190` | Replacing `“Wi-Fi”` with the exact name from `Get-NetAdapter`. | |
| 80 | `03-phase-networking-basics.md:1193` | - `ipconfig /all` — the adapter may still show a stale address, or none at all. Note which. | |
| | | <sub>↑ 3. **Observe every rung.** Immediately run the ladder again and record what each command says now:<br>↓ - `ping` the gateway — you should get `Destination host unreachable` or `Transmit failed. General failure.` Note the exact wording; it is different fr …</sub> | |
| 81 | `03-phase-networking-basics.md:1194` | - `ping` the gateway — you should get `Destination host unreachable` or `Transmit failed. General failure.` Note the exact wording; it is different from a timeout, and the difference tells you the operating system knew it had no route. | |
| 82 | `03-phase-networking-basics.md:1195` | - `ping 8.8.8.8` — same class of failure. | |
| | | <sub>↑ - `ping` the gateway — you should get `Destination host unreachable` or `Transmit failed. General failure.` Note the exact wording; it is different fr …<br>↓ - `nslookup google.com` — often a timeout, sometimes an immediate answer from cache. Note that a cached answer can be misleading.</sub> | |
| 83 | `03-phase-networking-basics.md:1196` | - `nslookup google.com` — often a timeout, sometimes an immediate answer from cache. Note that a cached answer can be misleading. | |
| 84 | `03-phase-networking-basics.md:1203` | Wait for the adapter to come back and confirm with `ipconfig /all` before going on. Then break DNS only: temporarily set your adapter’s DNS server to an address you know does not answer — for example `192.0.2.1`, which is a reserved documentation address that  … | |
| 85 | `03-phase-networking-basics.md:1210` | Now run the ladder again. This is the important moment: **`ping 8.8.8.8` still works, `ping google.com` fails.** You have reproduced the DNS failure signature deliberately, and you will recognise it for the rest of your career. | |
| 86 | `03-phase-networking-basics.md:1218` | Then verify with the full ladder, and confirm `nslookup google.com` answers again. | |
| | | <sub>↓ 6. **Write the comparison table.** For each rung, one column for “what it looks like when healthy” and one for “what it looks like when this rung is b …</sub> | |
| 87 | `03-phase-networking-basics.md:1223` | (The `169.254` address itself is worth meeting deliberately: on a machine that has just lost DHCP, `ipconfig /all` shows it as the *Autoconfiguration IPv4 Address*. Do that once, so the signature is familiar before it finds you.) | |
| 88 | `03-phase-networking-basics.md:1427` | > **Observed:** Wi-Fi connected, full signal. `ipconfig /all`: IPv4 `192.168.1.22/24`, gateway `192.168.1.1`, DHCP lease valid, **DNS Servers: `127.0.0.1`**. `ping 192.168.1.1` — 0 % loss. `ping 8.8.8.8` — 0 % loss, 24–26 ms. `ping google.com` — “could not fin … | |
| 89 | `03-phase-networking-basics.md:1428` | > **Action (one change at a time):** 1) Reset the Wi-Fi adapter’s DNS servers to automatic (`Set-DnsClientServerAddress -ResetServerAddresses`) and flushed the DNS cache. 2) Confirmed the adapter now receives `192.168.1.1` and `8.8.8.8` via DHCP. | |
| 90 | `03-phase-networking-basics.md:1429` | > **Verified:** `nslookup google.com` resolved correctly. Asked the user to load the specific site that failed and confirm it opened — they confirmed it loaded normally. | |
| 91 | `03-phase-networking-basics.md:1433` | **Reasoning to take away:** “The internet is down” is a *symptom description*, not a diagnosis, and in this ticket the internet was never down. The decisive evidence cost nothing: `ping 8.8.8.8` succeeded while `ping google.com` failed, and that single compari … | |
| 92 | `03-phase-networking-basics.md:1435` | **Read the DNS Servers line in `ipconfig /all` every single time** — `127.0.0.1` is never an accident, and it is the fingerprint of a VPN or security tool that changed the machine and did not change it back. | |
| 93 | `03-phase-networking-basics.md:1595` | \| Maria can reach the gateway \| `ping 192.168.10.65` — 0 % loss \| Link, IP, and gateway rungs all pass \| | |
| | | <sub>↑ \| Maria’s gateway is local \| Gateway `192.168.10.65` is inside her own block \| Her configuration is valid, not a mask error \|<br>↓ \| Maria cannot reach port 445 \| `TcpTestSucceeded : False` \| The block is between subnets \|</sub> | |
| 94 | `03-phase-networking-basics.md:1607` | > **Observed:** Printer prints its own test page; port name on a working PC is `192.168.10.200_1`. Printer is `192.168.10.200/26` — subnet `192.168.10.192/26`. Working PC is `192.168.10.25/26` — subnet `192.168.10.0/26`. Affected PC is `192.168.10.70/26`, gate … | |
| 95 | `03-phase-networking-basics.md:1626` | **Do the cheap comparison first.** In ticket 1 it was `ping 8.8.8.8` against `ping google.com`. In ticket 2 it was one working machine against one failing machine. A comparison costs seconds and splits the problem in half. | |
| 96 | `03-phase-networking-basics.md:1628` | **Read the configuration lines you are tempted to skim.** `DNS Servers: 127.0.0.1` in ticket 1 and `Subnet Mask: 255.255.255.192` in ticket 2 were both sitting in plain sight in `ipconfig` output. Neither was hidden. Both were decisive. | |
| 97 | `03-phase-networking-basics.md:1642` | - **DNS translates names to addresses**, and it breaks more often than connectivity. Test it with `ping 8.8.8.8` versus `ping google.com`. | |
| 98 | `03-phase-networking-basics.md:1645` | - `Test-NetConnection` and `nslookup` are your two best everyday tools. | |
| | | <sub>↑ - **TCP** is reliable and connection-oriented; **UDP** is fast and best-effort.<br>↓ - **Subnets exist to limit broadcast noise, separate devices, and create policy boundaries.** A flat network of 500 devices wastes bandwidth and lets  …</sub> | |
| 99 | `03-phase-networking-basics.md:1687` | \| Windows `ipconfig` \| Shows IP config \| Free, built-in \| https://learn.microsoft.com/windows-server/administration/windows-commands/ipconfig \| Record IP, gateway, DNS \| Linux `ip a` \| | |
| 100 | `03-phase-networking-basics.md:1688` | \| `ping` \| Tests reachability/latency \| Free, built-in \| https://learn.microsoft.com/windows-server/administration/windows-commands/ping \| Ping gateway and 1.1.1.1 \| PowerShell `Test-Connection` \| | |
| 101 | `03-phase-networking-basics.md:1689` | \| `nslookup` \| Tests DNS \| Free, built-in \| https://learn.microsoft.com/windows-server/administration/windows-commands/nslookup \| Resolve google.com and compare DNS servers \| `dig` on Linux \| | |
| 102 | `03-phase-networking-basics.md:1707` | 2. Check your IP configuration. Run `ipconfig /all` on Windows, or `ifconfig` / `ip a` on Linux. Record your IP address, subnet mask, default gateway, DHCP server, DNS server, and MAC address. <!-- id: it-03-t02 band: quick energy: low --> | |
| 103 | `03-phase-networking-basics.md:1709` | 4. Run DNS lookups. Try `nslookup google.com`, `nslookup -type=mx gmail.com`, and `nslookup -type=txt google.com`. Document what each reveals. <!-- id: it-03-t04 band: focused energy: normal --> | |
| 104 | `03-phase-networking-basics.md:1747` | **Why:** The second form asks a *specific* server. If your local resolver and `8.8.8.8` disagree, the domain is fine and your resolver is the fault. `tracert` shows the path, not the translation. | |
| 105 | `03-phase-networking-basics.md:1810` | **Why:** `ping` proves the host answers ICMP; it says nothing about whether the *service* is listening. `Test-NetConnection` reports DNS resolution, the resolved IP, reachability, and the port state in one command — which is why the phase calls it the most use … | |
| 106 | `03-phase-networking-basics.md:1846` | **Why:** The order matters because `renew` can hand back the same lease it already holds. `release` gives the address up first, which is what forces a fresh exchange. Neither touches the DNS cache — that is `ipconfig /flushdns`. | |
| 107 | `04-phase-helpdesk-skills.md:381` ▶ | - `ping fileserver01` succeeds; `Test-NetConnection fileserver01 -Port 445` | |
| | | <sub>↑ - Other departments can reach their own drives normally<br>↓ fails to connect</sub> | |
| 108 | `04-phase-helpdesk-skills.md:744` | > **Observed:** `Get-ADPrincipalGroupMembership` showed the account already holds `Project-Atlas-RW`. Folder ACL grants that group Modify, so permissions were correct on both sides. `whoami /groups` on the user's machine did not list the group — a stale sessio … | |
| 109 | `04-phase-helpdesk-skills.md:769` | \| 2 \| Windows \| `ipconfig /all` \| IP, mask, gateway, DNS, DHCP, MAC \| | |
| | | <sub>↑ \| 1 \| Windows \| `systeminfo` \| OS build, RAM, uptime, install date \|<br>↓ \| 3 \| Windows \| `ping <gateway>` then `ping 8.8.8.8` then `ping google.com` \| The DNS split test \|</sub> | |
| 110 | `04-phase-helpdesk-skills.md:770` | \| 3 \| Windows \| `ping <gateway>` then `ping 8.8.8.8` then `ping google.com` \| The DNS split test \| | |
| | | <sub>↑ \| 2 \| Windows \| `ipconfig /all` \| IP, mask, gateway, DNS, DHCP, MAC \|<br>↓ \| 4 \| Windows \| `nslookup google.com` and `nslookup google.com 8.8.8.8` \| Is my own resolver working? \|</sub> | |
| 111 | `04-phase-helpdesk-skills.md:771` | \| 4 \| Windows \| `nslookup google.com` and `nslookup google.com 8.8.8.8` \| Is my own resolver working? \| | |
| | | <sub>↑ \| 3 \| Windows \| `ping <gateway>` then `ping 8.8.8.8` then `ping google.com` \| The DNS split test \|<br>↓ \| 5 \| Windows \| `net use` \| Mapped drives and their state \|</sub> | |
| 112 | `04-phase-helpdesk-skills.md:775` | \| 8 \| Windows \| `Get-Volume` \| Free space per drive \| | |
| | | <sub>↑ \| 7 \| Windows \| `whoami` then `whoami /groups` \| My exact identity and group list \|<br>↓ \| 9 \| PowerShell \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10` \| The ten most recent errors \|</sub> | |
| 113 | `04-phase-helpdesk-skills.md:776` | \| 9 \| PowerShell \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10` \| The ten most recent errors \| | |
| 114 | `04-phase-helpdesk-skills.md:777` | \| 10 \| PowerShell \| `Get-Service` filtered on Automatic and Stopped \| A fault nobody has reported \| | |
| | | <sub>↑ \| 9 \| PowerShell \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10` \| The ten most recent errors \|<br>↓ \| 11 \| Linux \| `df -h` \| Filesystem usage in human units \|</sub> | |
| 115 | `04-phase-helpdesk-skills.md:798` | Healthy `ipconfig /all` output, trimmed to the lines that matter: | |
| 116 | `04-phase-helpdesk-skills.md:829` | The third block is the one to read carefully, and the evidence is in the **header line**, not the reply. **When you ping a name and the header shows `[142.250.4.101]` after it, the forward lookup succeeded** — `ping` only prints that bracketed address once it  … | |
| 117 | `04-phase-helpdesk-skills.md:869` | For `Get-Volume`, healthy is above about 15 % free. Below 10 % on the system drive, Windows slows down measurably: updates fail, the page file stops growing, and temp files cannot be written. | |
| 118 | `04-phase-helpdesk-skills.md:897` | \| `Get-Volume` \| `df -h` \| How full is each filesystem? \| | |
| | | <sub>↑ \|---\|---\|---\|<br>↓ \| Disk Management \| `lsblk` \| What disks and partitions exist? \|</sub> | |
| 119 | `04-phase-helpdesk-skills.md:900` | \| `netstat -ano` \| `ss -tulpn` \| What is listening on which port? \| | |
| | | <sub>↑ \| Event Viewer \| `journalctl -p err -b` \| What has gone wrong since boot? \|<br>↓ \| `ipconfig /all` \| `ip a` plus `ip route` \| What is my address and my gateway? \|</sub> | |
| 120 | `04-phase-helpdesk-skills.md:901` | \| `ipconfig /all` \| `ip a` plus `ip route` \| What is my address and my gateway? \| | |
| | | <sub>↑ \| `netstat -ano` \| `ss -tulpn` \| What is listening on which port? \|</sub> | |
| 121 | `04-phase-helpdesk-skills.md:938` | \| `ipconfig /all` \| "Wi-Fi has 192.168.1.22/24 with gateway 192.168.1.1 and DNS 192.168.1.1 — a complete, consistent configuration." \| "It shows my IP address." \| | |
| 122 | `04-phase-helpdesk-skills.md:939` | \| `ping 8.8.8.8` then `google.com` \| "Both answered and the name resolved to 142.250.4.101, so connectivity and DNS are both healthy." \| "The internet works." \| | |
| 123 | `04-phase-helpdesk-skills.md:941` | \| `Get-Service` filter \| "Empty list — no service set to Automatic is stopped, so there is no silent background fault on this machine." \| "No services found." \| | |
| 124 | `04-phase-helpdesk-skills.md:999` | \| 4 \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2}` \| Repeated errors with boot-time timestamps \| | |
| 125 | `04-phase-helpdesk-skills.md:1000` | \| 5 \| `Get-Volume` \| System drive below 10 % free \| | |
| | | <sub>↑ \| 4 \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2}` \| Repeated errors with boot-time timestamps \|</sub> | |
| 126 | `04-phase-helpdesk-skills.md:1094` | \| Reachability \| Can you ping it from the failing laptop? \| `ping <printer-ip>` \| | |
| | | <sub>↑ \| Power and network \| Is the printer awake and on the network? \| The printer's own panel \|<br>↓ \| Port \| Is the print port answering? \| `Test-NetConnection <printer-ip> -Port 9100` — 9100 is the raw-printing port nearly every network printer l …</sub> | |
| 127 | `04-phase-helpdesk-skills.md:1095` | \| Port \| Is the print port answering? \| `Test-NetConnection <printer-ip> -Port 9100` — 9100 is the raw-printing port nearly every network printer listens on \| | |
| 128 | `04-phase-helpdesk-skills.md:1135` | 1. Does the underlying internet connection drop at the same time? Watch a continuous `ping` to your gateway while working. If that drops too, the VPN was a symptom and your Wi-Fi is the fault. | |
| 129 | `04-phase-helpdesk-skills.md:1447` | 2. A user says "the internet is down". Your `ping` to their gateway succeeds. | |
| | | <sub>↑ 1. A user reports the shared drive is empty. Their password was changed an hour ago.<br>↓ 3. A user reports an MFA prompt they did not trigger, at 2am, on a Sunday.</sub> | |
| 130 | `04-phase-helpdesk-skills.md:1464` | \| 2 \| Gather more — `ping 8.8.8.8`, then `ping google.com` \| A working gateway rules out the LAN. The IP-versus-name pair splits connectivity from DNS in one step \| | |
| 131 | `04-phase-helpdesk-skills.md:1542` | \| Break your own DNS \| In an **Administrator** PowerShell on a machine you own, set your adapter's DNS to `127.0.0.1`, then `ipconfig /flushdns` \| `ping 8.8.8.8` still works, `ping google.com` fails. Put it back to automatic afterwards \| | |
| 132 | `04-phase-helpdesk-skills.md:1545` | \| Fill the system drive \| Do not do this to test it — instead read `Get-Volume` and predict what would break below 5 % free \| A prediction you can check beats a disk you have to repair \| | |
| 133 | `05-phase-sysadmin-basics.md:289` | - **`Get-CimInstance` rather than `wmic`.** `wmic` is deprecated and being removed from Windows. New scripts use the CIM cmdlets. You will still meet `wmic` in old documentation and on old systems, so recognise it, but do not write it. | |
| 134 | `05-phase-sysadmin-basics.md:527` | Realistic output of `Get-LocalGroupMember`: | |
| 135 | `05-phase-sysadmin-basics.md:626` | `Get-Acl` gives you the same information as `icacls` in a form you can filter. `IsInherited` is the `(I)` flag; `AccessControlType` is Allow or Deny. Where `icacls` wins is that it shows *scope* flags inline and works over the network with a **UNC path** (Univ … | |
| 136 | `05-phase-sysadmin-basics.md:628` | One practical warning: `Get-Acl` hides the scope flags. An ACE that is inherited-only (`(IO)`) appears identical to one that applies everywhere. When the *behaviour* does not match the `Get-Acl` listing, re-check with `icacls`. | |
| 137 | `05-phase-sysadmin-basics.md:660` | **Rule three: check whether the user is local or remote.** `icacls` on a local path tells you nothing about the share. `Get-SmbShareAccess` tells you nothing about NTFS. A ticket that says “it works when I am at my desk but not from home” is pointing at the sh … | |
| 138 | `05-phase-sysadmin-basics.md:691` | Read the mismatch. `net user` — which reads the **directory** — says the account is in `Finance-Managers`. `whoami /groups` — which reads the **current token** — does not list it. The directory and the session disagree, and that disagreement is the diagnosis. | |
| 139 | `05-phase-sysadmin-basics.md:704` | \| “I was added to the group yesterday” \| `whoami /groups` vs `net user <name>` \| Mismatch means a stale token — sign out and back in \| | |
| 140 | `05-phase-sysadmin-basics.md:707` | \| “It works locally but not over the network” \| `Get-SmbShareAccess` \| Share permission more restrictive than NTFS \| | |
| 141 | `05-phase-sysadmin-basics.md:709` | \| “The account is locked or expired” \| `net user <name>` \| `Account active`, `Password expires`, `Last logon` \| | |
| 142 | `05-phase-sysadmin-basics.md:710` | \| “Who is in this group?” \| `Get-LocalGroupMember -Group <name>` \| Members who should have been removed, and `PrincipalSource` \| | |
| 143 | `05-phase-sysadmin-basics.md:853` | **How to interpret it:** `PrincipalSource` should read `Local`, because you just created this identity on this machine. If you are on a domain-joined machine, run `Get-LocalGroupMember -Group 'Administrators'` as well and you will likely see a mix of `Local`,  … | |
| 144 | `05-phase-sysadmin-basics.md:979` | Then confirm they are gone with `Get-LocalUser` and `Get-LocalGroup`. Leaving test accounts and test groups behind on a production machine is a genuine audit finding, and building the habit of cleaning up after yourself starts now. | |
| 145 | `05-phase-sysadmin-basics.md:1032` | **This is the diagnosis, and it is a single observation.** `net user` says the account belongs to `Finance-Managers`. `whoami /groups` does not list it. The directory and the running session disagree, which means the session token was built before the group me … | |
| 146 | `05-phase-sysadmin-basics.md:1067` | If a full sign-out does not resolve it, the next checks are, in order: confirm the machine can reach a domain controller on the VPN (`nltest /dsgetdc:company.local` — `nltest` is a domain-controller diagnostic; a successful result names a DC and its site), and … | |
| 147 | `05-phase-sysadmin-basics.md:1081` | > **Observed:** `net user maria.santos` showed membership in `Finance-Managers`, but `whoami /groups` on the running session did not list it — the directory and the session token disagreed, indicating the token predated the group change. Confirmed server-side  … | |
| 148 | `05-phase-sysadmin-basics.md:1257` | - **`Get-CimInstance` replaces `wmic`** in modern PowerShell. | |
| | | <sub>↑ - Routine checks — disks, services, event logs, uptime, inventory — catch outages before users do.<br>↓ - **Anything done more than twice by hand is a candidate for automation.**</sub> | |
| 149 | `05-phase-sysadmin-basics.md:1265` | - Across the network, **share and NTFS must both allow**, and the more restrictive wins. Test with `Get-SmbShareAccess` *and* `icacls`. | |
| 150 | `05-phase-sysadmin-basics.md:1281` | 4. Reproduce the stale-token diagnosis from Ticket 1 on your own machine: add yourself to a new local group without signing out, confirm that `whoami /groups` does not list it while `Get-LocalGroupMember` does, then sign out and back in and confirm the two agr … | |
| 151 | `06-phase-tools-and-ticketing.md:397` | > **Investigated:** `Get-PSDrive` confirmed only `C:` affected; `D:` has 255.6 GB free, so the data volume is healthy and this is not user-data growth. Largest-directory scan showed `C:\Windows\Temp` at 18.41 GB, of which the largest files were `sql_dump_*.tmp … | |
| 152 | `06-phase-tools-and-ticketing.md:1204` | 3. **Produce evidence for one machine the way Part 5 does.** Capture `Get-PSDrive`, a largest-directory scan, and timestamps on the biggest files. Write the "what this shows" paragraph. This is the portfolio artefact: it demonstrates that you read evidence rat … | |
| 153 | `08-phase-portfolio-and-resume.md:112` | \| "Did some networking." \| "Built a routed lab network in VirtualBox with two subnets; verified connectivity and fault isolation with `ping`, `tracert`, and Wireshark captures." \| | |
| 154 | `08-phase-portfolio-and-resume.md:114` | \| "Know Linux." \| "Installed and administered Ubuntu Server in a VM: user and group management, `systemctl` service control, permissions with `chmod` and `chown`, log review in `/var/log`." \| | |
| 155 | `08-phase-portfolio-and-resume.md:489` | **"How did you verify?"** A `ping` from the first subnet to the router's second interface, then to the host on the second subnet, then `tracert` to confirm the path actually went through pfSense rather than resolving locally. Then a Wireshark capture to see th … | |
| 156 | `08-phase-portfolio-and-resume.md:755` ▶ | running. `systemctl status ssh` showed `active (running)`, so the service was | |
| | | <sub>↑ **Second failure:** SSH was refused from the host even though the server was<br>↓ fine and the problem was the network. The VM was on NAT, and NAT does not let</sub> | |
| 157 | `08-phase-portfolio-and-resume.md:768` ▶ | \| Service controllable \| `systemctl status ssh` showed `active (running)` \| | |
| | | <sub>↑ \| User and group created \| `id labadmin` showed `uid=1001(labadmin) gid=1001(labadmin) groups=1001(labadmin),1002(helpdesk)` \|<br>↓ \| Log reading works \| `journalctl -u ssh -n 20` showed the accepted-connection line \|</sub> | |
| 158 | `08-phase-portfolio-and-resume.md:770` ▶ | \| SSH reachable \| `ssh labadmin@127.0.0.1 -p 2222` connected from the host \| | |
| | | <sub>↑ \| Log reading works \| `journalctl -u ssh -n 20` showed the accepted-connection line \|</sub> | |
| 159 | `08-phase-portfolio-and-resume.md:776` ▶ | - `systemctl status <unit>` is the first command to run for any service | |
| | | <sub>↑ Reading the error literally would have saved 40 minutes.<br>↓ problem — it distinguishes "not running" from "running but refusing".</sub> | |
| 160 | `08-phase-portfolio-and-resume.md:1067` | \| 2 \| PowerShell 7, `Get-CimInstance` for OS and disk, `Get-Service` filtered to `Running`, `Export-Csv` for the output. \| | |
| 161 | `09-phase-job-application-plan.md:719` | - Strong: "A user said the internet was down. I pinged `8.8.8.8` first — that worked, so routing and upstream were fine. `ping google.com` failed, so it was name resolution. `nslookup` against the local resolver got no answer, while `nslookup google.com 8.8.8. … | |
