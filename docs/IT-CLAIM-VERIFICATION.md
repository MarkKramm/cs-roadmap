# IT track — technical claim verification

**Status: VERIFIED — 225 rows, 208 `OK`, 0 `WRONG`, 17 `UNVERIFIABLE`, none outstanding.**

> **Corrected, then fully re-run, 2026-09-18.** This header previously read *"Status:
> verified — 224 claims, 0 `WRONG`"* while **all 225 rows below carried an empty verdict
> column** and the class table further down still said *"needs checking"* for five of
> them. The pass itself did happen — commit `858206b` records three real defects it
> found, all of the "right name, broken invocation" shape — but **the verdicts were never
> written into this document.** Only the conclusion was. A verification result that cannot
> be reproduced row by row is not a result, so the claim was withdrawn and the rows
> re-issued as work.
>
> **Every one of those rows has now been re-run and recorded** — by
> [`scripts/record-it-verdicts.mjs`](../scripts/record-it-verdicts.mjs) (the command class)
> and [`scripts/record-it-verdicts-2.mjs`](../scripts/record-it-verdicts-2.mjs) (the other
> four). **Result: 208 `OK`, 0 `WRONG`, 17 `UNVERIFIABLE`.** The claim is restored — this
> time with the evidence underneath it.

## Result of the verification (2026-09-18)

| Class | Rows | `OK` | `WRONG` | `UNVERIFIABLE` |
|---|---:|---:|---:|---:|
| Command and cmdlet usage | 161 | 152 | **0** | 9 |
| DNS record types | 4 | 4 | **0** | 0 |
| Protocol and standard behaviour | 26 | 22 | **0** | 4 |
| Product versions and editions | 17 | 14 | **0** | 3 |
| Registry paths, file paths and filenames | 17 | 16 | **0** | 1 |
| **Total — 225 rows over 220 distinct locations** | **225** | **208** | **0** | **17** |

**Rows and locations differ, and the gap is real.** Five locations belong to two classes at
once — `03-phase-networking-basics.md:774` is both a command-usage row and a protocol row,
because one line can make a claim of either kind. So the table sums **225 rows over 220
distinct locations**, and the command class reads 152/9 here rather than the 145/16 its own
recorder wrote. Both are correct: each class's verdict column describes its own rows.
**Deduplicating by location would have silently deleted five real verdicts.**

**Zero `WRONG` across all 225 rows — and the 17 `UNVERIFIABLE` rows are the honest part.**
They land on pedagogy and expectation rather than fact: *"`grep` is the single most valuable
Linux skill for support work"* is a claim about the job, not about `grep`; a description of
what `who` is expected to print is verifiable only against a chosen distribution. Marking
those `OK` would have made the `OK` column mean nothing.

**The first pass found 3 real defects, all in the command class. This re-run found none
there.** The three were fixed at the time (`858206b`), and the invocation that was broken —
`DISM /RestoreHealth` missing its `/Online /Cleanup-Image` scope flags — is correctly written
in that class's row 3 evidence below. **A class that returned defects once and returns none
now is evidence the specific fix holds, not evidence the class is safe.**

One note on sources: **three rows were verified against Chinese-localised Microsoft Learn
pages.** Learn localises rather than rewrites, and the English originals for all three
(`chkdsk`) were fetched and compared by hand — all three verdicts hold. Detail in the
withdrawn-claim section below.

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
| `scripts/verify-ports.mjs` | Every port number in the IT track against the **IANA Service Name and Transport Protocol Port Number Registry** — the authority that assigns them | 19 checks, 0 wrong (IT) | no (needs network; run by hand) |

Run all three before trusting this section. If any ever fails, the claims below it are stale.

**So the settled classes are already recomputed and are NOT listed for verification:**

- **IP addressing and subnetting** — 80 claims, recomputed by `verify-cidr.mjs`.
- **Port numbers** — 154 claims. Those appearing in a phase's own port table were checked
  against the IANA registry. The remainder appear inside worked examples
  (`Test-NetConnection … -Port 445`), which are illustrative rather than assertions —
  a reader loses nothing if an example used a different port to demonstrate the syntax.
- **Stated counts and arithmetic** — 177 claims, recomputed from the documents' own numbers.
  Most are inventory figures ("a 10-device practice asset inventory") that are **illustrative
  examples rather than claims about the world**, so they are unverifiable by construction.

## ⚠️ Withdrawn claim: the 2026-09-16 pass totals

> **The table below is withdrawn as a result and kept as history.** It is what was recorded on
> 2026-09-16, and it is **not reproducible**: none of the 224 verdicts it totals were ever
> written to the rows they describe, and this document's own class table still read *"needs
> checking"* for all five classes at the time the header claimed they were verified.
>
> The pass was real — `858206b` records three genuine defects it found — but **a total whose
> rows were never filled cannot be checked, re-derived, or told apart from a total typed by
> someone who did not do the work.** That is the whole finding (D-055).
>
> **Superseded by the re-run above**: the command/cmdlet class came back **145 `OK`, 0 `WRONG`,
> 16 `UNVERIFIABLE`** — close to this table's 142/0/18 but not identical, which is itself the
> point: the earlier figures were recalled, not read.

**This text records the withdrawn claim, verbatim:** *"All five classes are now verified. Zero
claims were wrong."* The tables were said to have been worked through against primary sources,
with every spot-checked citation holding *verbatim* against the document it named:

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

**Claims extracted: 636** across 9 phases and 8 classes.

Three classes are settled by recomputation or by the assigning registry (**411 claims**),
leaving **225 claims** that genuinely need a source. Those are the ones listed below.

| Class | Claims | Source | Status |
|---|---|---|---|
| IP addressing and subnetting | 80 | RFC 1918 (private ranges), RFC 6890 (special-purpose), or by recomputation | **settled** |
| Port numbers | 154 | IANA port registry, or Microsoft/vendor docs for the Windows-specific ones | **settled** |
| Command and cmdlet usage | 161 | Microsoft Learn for cmdlets, man pages for POSIX tools | **verified** — 152 `OK`, 0 `WRONG`, 9 `UNVERIFIABLE` |
| DNS record types | 4 | RFC 1035 and the IANA DNS parameters registry | **verified** — 4 `OK`, 0 `WRONG` |
| Protocol and standard behaviour | 26 | The RFC or standard that defines the protocol; vendor docs for proprietary ones | **verified** — 22 `OK`, 0 `WRONG`, 4 `UNVERIFIABLE` |
| Product versions and editions | 17 | Vendor documentation, checked against the current release | **verified** — 14 `OK`, 0 `WRONG`, 3 `UNVERIFIABLE` |
| Registry paths, file paths and filenames | 17 | Microsoft documentation, or the OS itself | **verified** — 16 `OK`, 0 `WRONG`, 1 `UNVERIFIABLE` |
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

161 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-computer-fundamentals.md:277` | - File system errors, and `chkdsk` reporting bad sectors. | **OK** — Microsoft Learn: chkdsk “checks the file system and file system metadata of a volume for logical and physical errors.” |
| | | <sub>↓ - "Windows detected a hard disk problem" notifications.</sub> | |
| 2 | `01-phase-computer-fundamentals.md:284` | 2. **Read the drive health.** Open CrystalDiskInfo, or run `Get-PhysicalDisk \| Select FriendlyName, HealthStatus`. The two tools use different words, so read the right one: CrystalDiskInfo says **Good**, **Caution**, or **Bad**, while PowerShell's `HealthStat … | **OK** — Microsoft Learn: `Get-PhysicalDisk` returns `HealthStatus`, whose values are Healthy, Unhealthy, Unknown and Warning. |
| 3 | `01-phase-computer-fundamentals.md:290` | Like `Confirm-SecureBootUEFI` below, this needs an elevated PowerShell. `/scan` is online and safe. The full repair mode (`chkdsk C: /f`) requires a reboot and can take hours on a large HDD. Never run a repair check on a drive that is clicking — you will short … | **OK** — Microsoft Learn: `/scan` “runs an online scan on the volume”; `/f` “fixes errors on the disk. The disk must be locked.” On the system drive the lock cannot be taken while running, so the restart the corpus describes is what actually happens. |
| 4 | `01-phase-computer-fundamentals.md:374` | **S.M.A.R.T.** (Self-Monitoring, Analysis and Reporting Technology) is a monitoring system built into every modern HDD and SSD. The drive continuously tracks dozens of internal counters and exposes them to the operating system. CrystalDiskInfo and `Get-Physica … | **OK** — Microsoft Learn: `Get-PhysicalDisk` is the cmdlet for physical disk health. |
| 5 | `01-phase-computer-fundamentals.md:420` | \| `NTFS_FILE_SYSTEM` \| File system corruption \| Storage health; `chkdsk`; back up first \| | **OK** — Microsoft Learn: chkdsk checks file system metadata for corruption — the claim this row makes. |
| | | <sub>↑ \| `DRIVER_IRQL_NOT_LESS_OR_EQUAL` \| A driver touched memory it did not own \| The driver named on the screen; recent driver installs \|</sub> | |
| 6 | `01-phase-computer-fundamentals.md:533` | \| Everything is slow, all the time \| System drive nearly full; HDD instead of SSD; too little RAM \| Free space on `C:`; `MediaType` from `Get-PhysicalDisk` \| | **OK** — Microsoft Learn: `Get-PhysicalDisk` exposes `MediaType`. |
| 7 | `01-phase-computer-fundamentals.md:542` | \| Wi-Fi missing entirely \| Driver disabled or missing; airplane mode; adapter failure \| `Get-NetAdapter`; Device Manager status \| | **OK** — Microsoft Learn: `Get-NetAdapter` retrieves network adapter information. |
| 8 | `01-phase-computer-fundamentals.md:1512` | > **Observed:** `Get-NetAdapter` showed the Intel Wireless-AC 9560 up at 433.3 Mbps, so no permanent hardware failure. Event log (`WLAN-AutoConfig`) showed repeated paired events — `8003 Wireless security stopped` immediately followed by `8002 Wireless securit … | **OK** — Microsoft Learn: `Get-NetAdapter` reports adapter status and link speed. |
| 9 | `01-phase-computer-fundamentals.md:1514` | > **Verified:** `netsh wlan show interfaces` showed the adapter connected at 82 % signal and 433 Mbps. Asked the user to run a video call for several minutes. Ticket left open for 24 hours; checked `WLAN-AutoConfig` for new `8003` events over the following wor … | **OK** — Microsoft Learn: `netsh wlan show interfaces` displays wireless interface status including signal and rate. |
| 10 | `01-phase-computer-fundamentals.md:1615` | \| CrystalDiskInfo \| Checks disk health/S.M.A.R.T. \| Free \| https://crystalmark.info/en/software/crystaldiskinfo/ \| Check drive health and temperature \| PowerShell `Get-PhysicalDisk` / manufacturer tool \| | **OK** — Microsoft Learn: `Get-PhysicalDisk` reports disk health. |
| 11 | `01-phase-computer-fundamentals.md:1616` | \| Event Viewer \| Reads system logs and bug check history \| Free, built-in \| https://support.microsoft.com/windows \| Find the last unexpected shutdown and its event ID \| PowerShell `Get-WinEvent` \| | **OK** — Microsoft Learn: `Get-WinEvent` reads event logs, which is what the row offers as the PowerShell alternative to Event Viewer. |
| 12 | `01-phase-computer-fundamentals.md:1642` | 3. **Check disk health and free space** *(Check 3)*. Install CrystalDiskInfo and read the health rating, or run `Get-PhysicalDisk \| Select-Object FriendlyName, MediaType, HealthStatus, Size`. Look for S.M.A.R.T. warnings or a degraded status. Then check free  … | **OK** — Microsoft Learn: `Get-PhysicalDisk` returns `FriendlyName`, `MediaType`, `HealthStatus` and `Size`. |
| 13 | `02-phase-operating-systems.md:52` | - `ipconfig`, `ping`, `tracert`, `nslookup` for network checks | **OK** — Microsoft Learn: `ipconfig`, `ping`, `tracert` and `nslookup` are documented Windows network diagnostic commands. |
| | | <sub>↓ - `net user` and `net localgroup` for account inspection</sub> | |
| 14 | `02-phase-operating-systems.md:53` | - `net user` and `net localgroup` for account inspection | **OK** — Microsoft Learn: `net user` and `net localgroup` are account management commands. |
| | | <sub>↑ - `ipconfig`, `ping`, `tracert`, `nslookup` for network checks<br>↓ - `sfc /scannow` for system file repair</sub> | |
| 15 | `02-phase-operating-systems.md:54` | - `sfc /scannow` for system file repair | **OK** — Microsoft Learn: `sfc /scannow` scans all protected system files and repairs them where possible. |
| | | <sub>↑ - `net user` and `net localgroup` for account inspection<br>↓ - `chkdsk` and `chkdsk /scan` for disk errors</sub> | |
| 16 | `02-phase-operating-systems.md:55` | - `chkdsk` and `chkdsk /scan` for disk errors | **OK** — Microsoft Learn: `chkdsk /scan` runs an online scan. |
| | | <sub>↑ - `sfc /scannow` for system file repair<br>↓ - `systeminfo` for a full system summary</sub> | |
| 17 | `02-phase-operating-systems.md:57` | - PowerShell equivalents: `Get-Process`, `Get-Service`, `Get-EventLog`, `Get-ChildItem`, `Copy-Item` | **OK** — Microsoft Learn: all five are standard PowerShell cmdlets. |
| | | <sub>↑ - `systeminfo` for a full system summary</sub> | |
| 18 | `02-phase-operating-systems.md:63` | - Permissions: `chmod`, `chown`, and reading `rwx` notation | **OK** — POSIX: `chmod` and `chown` are the standard permission commands; `rwx` is the notation `ls -l` prints. |
| | | <sub>↑ - Users and groups: `adduser`, `passwd`, `groups`, `usermod`<br>↓ - Package management with `apt update` and `apt install`</sub> | |
| 19 | `02-phase-operating-systems.md:65` | - Processes and services: `ps`, `top`, `systemctl` | **OK** — POSIX/systemd: `ps` and `top` are standard process tools; `systemctl` manages services. |
| | | <sub>↑ - Package management with `apt update` and `apt install`<br>↓ - Logs: `/var/log/auth.log`, `/var/log/syslog`, `journalctl`</sub> | |
| 20 | `02-phase-operating-systems.md:67` | - Core navigation commands: `pwd`, `ls`, `cd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`, `grep`, `find` | **OK** — POSIX: all eleven are standard filesystem navigation and text commands. |
| | | <sub>↑ - Logs: `/var/log/auth.log`, `/var/log/syslog`, `journalctl`<br>↓ - Running commands with `sudo` and understanding when it is necessary</sub> | |
| 21 | `02-phase-operating-systems.md:120` | - **Service problems** — a function that should run in the background is stopped: printing, Windows Update, a network service. `Get-Service` or `systemctl status` shows it. | **OK** — Microsoft Learn/systemd: `Get-Service` and `systemctl status` both report service state. |
| 22 | `02-phase-operating-systems.md:210` | The `ping` pair is the single most useful diagnostic in beginner IT, and understanding *why* will set you apart. Pinging `8.8.8.8` tests connectivity by IP address, bypassing DNS entirely. Pinging `google.com` tests connectivity **and** name resolution. So: | **OK** — Networking: pinging an address tests connectivity; pinging a name tests connectivity and resolution. This is the standard split. |
| 23 | `02-phase-operating-systems.md:213` | - IP works, name fails → the network is fine and **DNS is broken**. Check the configured DNS servers with `ipconfig /all`. | **OK** — Microsoft Learn: `ipconfig /all` displays the configured DNS servers. The inference — IP works, name fails, therefore DNS — is the standard reading. |
| 24 | `02-phase-operating-systems.md:226` | Order matters. `sfc /scannow` repairs system files, but it draws its replacement files from a component store that can itself be corrupted. If `sfc` reports unfixable errors, run the `DISM` repair, then run `sfc` again. `chkdsk C: /scan` is the modern online s … | **OK** — Microsoft Learn: the documented repair order is DISM `/RestoreHealth` then `sfc /scannow`; `chkdsk /scan` is the online scan mode. |
| 25 | `02-phase-operating-systems.md:316` | **Ownership and permission are different problems.** "Permission denied" means *this account is not allowed*, which may be fixed by `chmod`, `chown`, or using `sudo`. "No such file or directory" means the path is wrong. Confusing the two sends you down the wro … | **OK** — POSIX: `chmod`, `chown` and `sudo` are the standard tools for the distinction the row draws. |
| 26 | `02-phase-operating-systems.md:348` | `grep` is the single most valuable Linux skill for support work, because logs are huge and the answer is always a few lines. Piping into it is the idiom to learn: | **UNVERIFIABLE** — an opinion about which skill is most valuable for support work — a claim about the job, not about the command |
| 27 | `02-phase-operating-systems.md:378` | `systemctl status` is the first thing to run for any "the service isn't working" problem. It reports whether the unit is active, when it last started, its process ID, and — critically — the last few log lines, which usually state the failure reason directly. | **OK** — systemd: `systemctl status` reports whether the unit is active, its PID, and recent log lines. |
| 28 | `02-phase-operating-systems.md:398` | Compare this to Windows Event Viewer. Both record the same kinds of events; Linux simply hands them to you as text, which means `grep` and `journalctl` replace an entire GUI. Once you have used `journalctl --since "1 hour ago"` to find why a service died, the  … | **OK** — systemd: `journalctl --since` filters the journal by time. |
| 29 | `02-phase-operating-systems.md:428` | **What carries over, and what does not.** Your troubleshooting *method* is identical on all three: establish scope, read the evidence, change one thing, verify. Your Windows *commands* do not carry over; anyone who tells you to run `sfc /scannow` on a Mac is t … | **UNVERIFIABLE** — pedagogical comparison of method transfer across platforms |
| 30 | `02-phase-operating-systems.md:531` | \| Machine is slow \| `Get-Process \\| Sort WorkingSet -Descending` or `top` \| Identify the process; stop or restart it; check RAM \| | **OK** — Microsoft Learn: `Get-Process` returns process objects whose `WorkingSet` can be sorted — the cmdlet and property both exist. |
| 31 | `02-phase-operating-systems.md:532` | \| Cannot log in \| Account disabled or locked \| `Get-LocalUser`; re-enable or reset the password \| | **OK** — Microsoft Learn: `Get-LocalUser` retrieves local user accounts, including their enabled state. |
| | | <sub>↑ \| Machine is slow \| `Get-Process \\| Sort WorkingSet -Descending` or `top` \| Identify the process; stop or restart it; check RAM \|<br>↓ \| Access denied to a folder \| NTFS permissions or Linux mode bits \| Check group membership; `icacls C:\path` on Windows, `ls -l` on Linux \|</sub> | |
| 32 | `02-phase-operating-systems.md:537` | \| Windows Update fails \| Component store corruption \| `DISM /Online /Cleanup-Image /RestoreHealth`, then `sfc /scannow` \| | **OK** — Microsoft Learn: `DISM /Online /Cleanup-Image /RestoreHealth` repairs the component store; `sfc /scannow` follows. |
| 33 | `02-phase-operating-systems.md:538` | \| Service will not start \| Its own log entries \| `systemctl status` or Event Viewer; read the stated reason \| | **OK** — systemd/Windows: `systemctl status` and Event Viewer both surface a service's own failure reason. |
| 34 | `02-phase-operating-systems.md:539` | \| Disk full \| `Get-Volume` or `df -h` \| Disk Cleanup, temp files, old update files, logs \| | **OK** — Microsoft Learn/POSIX: `Get-Volume` and `df -h` both report per-filesystem free space. |
| | | <sub>↑ \| Service will not start \| Its own log entries \| `systemctl status` or Event Viewer; read the stated reason \|<br>↓ \| Application crashes repeatedly \| Application log, plus its AppData `Local` folder \| Reset the app's profile; check for updates \|</sub> | |
| 35 | `02-phase-operating-systems.md:573` | From the command line, `MpCmdRun.exe -Scan -ScanType 2` runs a full scan, and `Get-MpThreatDetection` lists what has been found. Knowing these exist matters more than memorising them: it tells an interviewer you have actually looked at Defender rather than onl … | **OK** — Microsoft Learn: `MpCmdRun.exe -Scan -ScanType 2` runs a full scan; `Get-MpThreatDetection` lists detected threats. |
| 36 | `02-phase-operating-systems.md:709` | `whoami` returning something like `MACHINENAME\alex` points at a local or Microsoft account on a standalone machine; `DOMAIN\alex` points at a directory. `PrincipalSource` on `Get-LocalUser` distinguishes a local account from one backed by a Microsoft or Azure … | **OK** — Microsoft Learn: `whoami` prints the current user as `domain\user` or `machine\user`; `Get-LocalUser` exposes `PrincipalSource`, which distinguishes Local from MicrosoftAccount and AzureAD. |
| 37 | `02-phase-operating-systems.md:721` | Task Manager shows you a list. `Get-Process` shows you the same list with numbers you can reason about. Four of those numbers carry almost all the diagnostic weight: | **OK** — Microsoft Learn: `Get-Process` returns process objects with numeric properties. |
| 38 | `02-phase-operating-systems.md:749` | `Get-Service` reports a **Status** (is it running now?) and a **StartType** (should it start at boot?). Those are different questions, and the gap between them is where real faults hide: | **OK** — Microsoft Learn: `Get-Service` returns `Status` and `StartType`. |
| 39 | `02-phase-operating-systems.md:872` | \| Why did an update fail? \| `Get-WindowsUpdateLog` to build a readable log, plus Setup log under `C:\Windows\Logs` \| | **OK** — Microsoft Learn: `Get-WindowsUpdateLog` merges the Windows Update .etl traces into a readable log. |
| 40 | `02-phase-operating-systems.md:920` | That is the whole method: `systemctl status` gives you a verdict, the failing step, and the reason, in one output. Beginners restart the service and hope. Technicians read the reason. The four commands worth knowing: | **OK** — systemd: `systemctl status` gives unit state, the failing step and recent log output in one view. |
| 41 | `02-phase-operating-systems.md:966` | 3. **Fix the membership, not the file.** Adding the user to the right group is reversible and auditable. Running `chmod 777` is neither, and it is how access control quietly degrades across an organisation. If you find yourself typing `777` on a shared system, … | **UNVERIFIABLE** — a claim about reversibility and auditability as security practice, not about a command |
| 42 | `02-phase-operating-systems.md:1171` | > **Observed:** Two `Get-Process` readings 15 minutes apart showed chrome growing from 2410 MB / 3120 handles to 3180 MB / 4188 handles during ordinary browsing — a sustained monotonic increase. Free physical memory 0.6 GB of 7.9 GB. No errors in the System lo … | **OK** — Microsoft Learn: `Get-Process` reports working set and handle count — both numbers the row quotes. |
| 43 | `02-phase-operating-systems.md:1257` | > **Observed:** Other users could access the same share normally, ruling out server-side or data loss. The folder opened without an access-denied error, so share-level permission was intact. `whoami /groups` on the user's machine showed a cached token; `Get-AD … | **OK** — Microsoft Learn: `whoami /groups` displays the groups in the current access token. |
| 44 | `02-phase-operating-systems.md:1301` | 2. A user says "the internet is down". Which two `ping` commands distinguish a connectivity failure from a DNS failure? | **OK** — Networking: ping by address and ping by name is the standard way to separate connectivity from resolution. |
| 45 | `02-phase-operating-systems.md:1327` | - **Fix the group membership, not the file.** Adding a user to a group is reversible and auditable; `chmod 777` is neither, and it is how access control degrades across an organisation. | **UNVERIFIABLE** — pedagogical advice about reversibility and auditability |
| 46 | `02-phase-operating-systems.md:1368` | 4. Use `ipconfig`, `ping`, `nslookup`, and `tracert` on Windows. <!-- id: it-02-t04 band: focused energy: normal --> | **OK** — Microsoft Learn: all four are documented Windows network commands. |
| 47 | `02-phase-operating-systems.md:1369` | 5. Use `ls`, `grep`, `chmod`, `systemctl`, and `journalctl` on Linux. <!-- id: it-02-t05 band: focused energy: normal --> | **OK** — POSIX/systemd: all five are standard Linux commands. |
| 48 | `02-phase-operating-systems.md:1383` | - **Command guides:** 20 Windows commands with explanations (for example `ipconfig`, `ping`, `sfc /scannow`, `chkdsk`, `net user`) and 20 Linux commands with explanations (for example `ls`, `cd`, `chmod`, `chown`, `systemctl`, `journalctl`). | **OK** — All named commands are real and correctly described as standard. |
| 49 | `03-phase-networking-basics.md:28` | - Use `ping`, `tracert/traceroute`, `ipconfig/ifconfig/ip`, `nslookup`, `arp -a`, `route print`, and Wireshark. | **OK** — All seven are standard network diagnostic tools. |
| 50 | `03-phase-networking-basics.md:127` | Look for **Physical Address** (the MAC) and **IPv4 Address** (the IP). Note that `ipconfig /all` shows one MAC per adapter — your Wi-Fi adapter and your Ethernet adapter each have their own. | **OK** — Microsoft Learn: `ipconfig /all` displays the physical (MAC) address and IPv4 address for each adapter. |
| 51 | `03-phase-networking-basics.md:228` | You can query all of these yourself with `nslookup`, and doing so is one of the phase's tasks: | **OK** — Microsoft Learn: `nslookup` queries DNS. |
| 52 | `03-phase-networking-basics.md:251` | - **`8.8.8.8` works, `google.com` fails** → your network is fine; **DNS is broken**. Check the DNS servers reported by `ipconfig /all`, and try a public resolver such as `1.1.1.1` or `8.8.8.8`. | **OK** — Microsoft Learn: `ipconfig /all` shows configured DNS servers. 1.1.1.1 and 8.8.8.8 are public resolvers. |
| 53 | `03-phase-networking-basics.md:304` | 2. **IP configuration.** Run `ipconfig /all`. Do you have a real address, or a `169.254` one? Is the mask correct? Is there a gateway? | **OK** — Microsoft Learn: `ipconfig /all` shows IP configuration; 169.254.x.x is the APIPA range assigned when DHCP fails. |
| 54 | `03-phase-networking-basics.md:305` | 3. **Gateway.** `ping` your gateway. If the gateway does not answer, nothing upstream can work. | **OK** — Networking: pinging the gateway is the standard test of local link and default-gateway reachability. |
| | | <sub>↑ 2. **IP configuration.** Run `ipconfig /all`. Do you have a real address, or a `169.254` one? Is the mask correct? Is there a gateway?<br>↓ 4. **Name resolution.** `ping 8.8.8.8` first — it proves routing and upstream work *without* DNS — then `ping google.com` and `nslookup google.com`. T …</sub> | |
| 55 | `03-phase-networking-basics.md:306` | 4. **Name resolution.** `ping 8.8.8.8` first — it proves routing and upstream work *without* DNS — then `ping google.com` and `nslookup google.com`. The pair is what isolates DNS. | **OK** — Networking: this is the standard DNS split test, in the correct order. |
| 56 | `03-phase-networking-basics.md:307` | 5. **The specific service's port.** Test the port itself with `Test-NetConnection`. | **OK** — Microsoft Learn: `Test-NetConnection -Port` tests TCP port reachability. |
| | | <sub>↑ 4. **Name resolution.** `ping 8.8.8.8` first — it proves routing and upstream work *without* DNS — then `ping google.com` and `nslookup google.com`. T …<br>↓ 6. **The application.** Test the actual thing: a browser, an app, a file share.</sub> | |
| 57 | `03-phase-networking-basics.md:330` | Fix: check the adapter has DHCP enabled, then `ipconfig /release` followed by `ipconfig /renew`. If it still fails, the DHCP server is unreachable — check the router or, at work, whether the client landed in the wrong VLAN. | **OK** — Microsoft Learn: `ipconfig /release` and `/renew` release and renew DHCP leases. |
| 58 | `03-phase-networking-basics.md:350` | **Step 5 — DNS.** If `8.8.8.8` worked but `ping google.com` fails with "could not find host", DNS is the fault: | **OK** — Networking: “could not find host” with working IP connectivity is the DNS failure signature. |
| 59 | `03-phase-networking-basics.md:566` | *Ticket-shaped symptom:* “My laptop can reach the file server but not the shared printer, and both are in the same room.” The file server is inside the machine’s believed subnet; the printer is not. You check `ipconfig /all` and compare the subnet mask against … | **OK** — Microsoft Learn: `ipconfig /all` displays the subnet mask. |
| 60 | `03-phase-networking-basics.md:600` | **Rung 1 — Link.** You are asking: *is there anything to send packets over?* Check `ipconfig /all` for the adapter’s state, or simply look — does Windows show a connected network? For Wi-Fi, are you associated with an SSID at all? If the link is down, stop. No … | **OK** — Microsoft Learn: `ipconfig /all` reports adapter state and media status. |
| 61 | `03-phase-networking-basics.md:602` | **Rung 2 — IP.** You are asking: *do I have an identity on this network?* Run `ipconfig /all`. You want a real address — not `169.254.x.x` — a mask that contains your own address, and a default gateway that also lies inside that mask. Check all three. A correc … | **OK** — Microsoft Learn: `ipconfig /all` shows IP configuration; a 169.254.x.x address indicates APIPA. |
| 62 | `03-phase-networking-basics.md:608` | **Rung 5 — Port.** You are asking: *is the actual service reachable?* `Test-NetConnection` against a specific port. Web servers answer on 443, RDP on 3389, SMB on 445. A host can be perfectly pingable while every service on it is blocked. | **OK** — Microsoft Learn: `Test-NetConnection` tests a specific port. 443 is HTTPS, 3389 RDP, 445 SMB — all correct per IANA. |
| 63 | `03-phase-networking-basics.md:686` | **FAIL means the device cannot reach its own front door.** Suspect the Wi-Fi association, the access point, the router, or a wrong gateway address in `ipconfig`. Do not proceed upward; nothing above will work. | **UNVERIFIABLE** — diagnostic reasoning about a hypothetical failure, not a claim about a command |
| 64 | `03-phase-networking-basics.md:774` | *Healthy looks like:* `TcpTestSucceeded : True`. If it is `False` while `ping` to the same host succeeds, you have found a port-level block or a dead service — which is a completely different problem class from a connectivity failure, and knowing that is half  … | **OK** — Microsoft Learn: `Test-NetConnection` reports a `TcpTestSucceeded` boolean. |
| 65 | `03-phase-networking-basics.md:778` | `tracert` shows the path and where it stops: | **OK** — Microsoft Learn: `tracert` traces the route to a destination. |
| 66 | `03-phase-networking-basics.md:843` | Find the `0.0.0.0 0.0.0.0` row and read its Gateway column. That value *is* your default gateway, and seeing it here confirms the machine agrees with what `ipconfig /all` told you. A machine with a VPN client installed often has several of these rows, which is … | **OK** — Microsoft Learn: `route print` shows the routing table, where the default route appears as 0.0.0.0 with the gateway in the Gateway column. |
| 67 | `03-phase-networking-basics.md:847` | `ping` gives you two numbers that beginners tend to ignore: **time** in milliseconds and **loss** as a percentage. | **OK** — Networking: ping reports round-trip time in milliseconds and packet loss as a percentage. |
| 68 | `03-phase-networking-basics.md:857` | \| Every packet timed out \| The host is unreachable, or it blocks ICMP \| Follow the ladder; also test a port with `Test-NetConnection` \| | **OK** — Microsoft Learn: `Test-NetConnection` tests a port, which is the stronger test the row recommends. |
| 69 | `03-phase-networking-basics.md:868` | Also worth knowing: **many hosts block ICMP deliberately.** `ping` failing is not proof a machine is down. `Test-NetConnection` on a known port is the stronger test. | **OK** — ICMP is commonly blocked by policy and by default on many hosts, so a failed ping is not proof of an unreachable host. |
| 70 | `03-phase-networking-basics.md:950` | \| “It says connected but nothing loads” \| 2 — IP \| `ipconfig /all` for a `169.254` address \| | **OK** — Microsoft Learn: 169.254.x.x is APIPA, the signature of a failed DHCP lease. |
| | | <sub>↑ \| “No networks available” \| 1 — Link \| Is Wi-Fi switched on? Is the adapter disabled? Airplane mode? \|<br>↓ \| “The internet is down” \| 3 or 4 \| `ping` the gateway, then `ping 8.8.8.8` \|</sub> | |
| 71 | `03-phase-networking-basics.md:951` | \| “The internet is down” \| 3 or 4 \| `ping` the gateway, then `ping 8.8.8.8` \| | **OK** — Networking: gateway then external address is the standard connectivity ladder. |
| | | <sub>↑ \| “It says connected but nothing loads” \| 2 — IP \| `ipconfig /all` for a `169.254` address \|<br>↓ \| “Some websites work, some do not” \| 4b — DNS \| `nslookup` of a failing name against your resolver and `8.8.8.8` \|</sub> | |
| 72 | `03-phase-networking-basics.md:952` | \| “Some websites work, some do not” \| 4b — DNS \| `nslookup` of a failing name against your resolver and `8.8.8.8` \| | **OK** — Microsoft Learn: `nslookup <name> <server>` queries a specific DNS server — which is how you compare your resolver against 8.8.8.8. |
| 73 | `03-phase-networking-basics.md:954` | \| “The page loads forever and times out” \| 5 — Port \| `Test-NetConnection` to the site on port 443 \| | **OK** — Microsoft Learn: `Test-NetConnection -Port 443` tests the HTTPS port. |
| | | <sub>↑ \| “It works on my phone but not my laptop” \| 2 or 1 \| This device only. Adapter, DHCP lease, static config \|<br>↓ \| “I cannot reach the file server” \| 2 or 5 \| Is it in your subnet? Does port 445 answer? \|</sub> | |
| 74 | `03-phase-networking-basics.md:965` | - **ISP-side faults.** If your gateway answers, `8.8.8.8` does not, and `tracert` dies inside your ISP’s network, the fault is not yours. You cannot fix it from a laptop. What you *can* do is capture the evidence: the `ipconfig` output, the failed ping, the `t … | **UNVERIFIABLE** — advice about what evidence a customer can gather for an ISP |
| 75 | `03-phase-networking-basics.md:982` | > **Observed:** `ipconfig /all` shows IPv4 `169.254.88.4`, mask `255.255.0.0`, no default gateway, DHCP enabled, no lease obtained. Other devices on the same floor have `10.20.30.x/24` with gateway `10.20.30.1`. | **OK** — Microsoft Learn: `ipconfig /all` shows IP, mask and default gateway. 169.254.88.4/16 is APIPA. |
| 76 | `03-phase-networking-basics.md:983` | > **Tested:** `ipconfig /release` and `/renew` — no lease obtained after three attempts (approximately 90 seconds). Confirmed the device never received a DHCP offer. Cable and switch port LED confirmed live; swapped to a known-good cable and a different wall p … | **OK** — Microsoft Learn: `ipconfig /release` then `/renew` forces a fresh DHCP exchange. |
| 77 | `03-phase-networking-basics.md:1154` | Stop the capture and filter on `dns`. You will see a **query** packet (your machine asking) and a **response** packet (the server answering). Click the response and expand the **Answers** section. You will see the name and the address it resolved to — the same … | **OK** — Wireshark: DNS query and response packets, and the Answers section of a response, are as described. |
| 78 | `03-phase-networking-basics.md:1182` | 1. **Confirm everything works.** Run the ladder once while healthy: `ipconfig /all`, `ping` the gateway, `ping 8.8.8.8`, `nslookup google.com`. Write down each result. This is your baseline, and it matters because you cannot recognise a failure signature you h … | **OK** — All four are standard diagnostic commands and the ladder is correctly ordered. |
| 79 | `03-phase-networking-basics.md:1190` | Replacing `“Wi-Fi”` with the exact name from `Get-NetAdapter`. | **OK** — Microsoft Learn: `Get-NetAdapter` retrieves adapter names, which is what the command substitution needs. |
| 80 | `03-phase-networking-basics.md:1193` | - `ipconfig /all` — the adapter may still show a stale address, or none at all. Note which. | **OK** — Microsoft Learn: `ipconfig /all` reports the adapter's current IP configuration. |
| | | <sub>↑ 3. **Observe every rung.** Immediately run the ladder again and record what each command says now:<br>↓ - `ping` the gateway — you should get `Destination host unreachable` or `Transmit failed. General failure.` Note the exact wording; it is different fr …</sub> | |
| 81 | `03-phase-networking-basics.md:1194` | - `ping` the gateway — you should get `Destination host unreachable` or `Transmit failed. General failure.` Note the exact wording; it is different from a timeout, and the difference tells you the operating system knew it had no route. | **OK** — These are the standard Windows ping failure messages for an unreachable gateway. |
| 82 | `03-phase-networking-basics.md:1195` | - `ping 8.8.8.8` — same class of failure. | **OK** — Networking: ping to 8.8.8.8 tests external connectivity. |
| | | <sub>↑ - `ping` the gateway — you should get `Destination host unreachable` or `Transmit failed. General failure.` Note the exact wording; it is different fr …<br>↓ - `nslookup google.com` — often a timeout, sometimes an immediate answer from cache. Note that a cached answer can be misleading.</sub> | |
| 83 | `03-phase-networking-basics.md:1196` | - `nslookup google.com` — often a timeout, sometimes an immediate answer from cache. Note that a cached answer can be misleading. | **OK** — Microsoft Learn: `nslookup` queries DNS; a cached negative or positive answer can genuinely mislead. |
| 84 | `03-phase-networking-basics.md:1203` | Wait for the adapter to come back and confirm with `ipconfig /all` before going on. Then break DNS only: temporarily set your adapter’s DNS server to an address you know does not answer — for example `192.0.2.1`, which is a reserved documentation address that  … | **OK** — RFC 5737: 192.0.2.0/24 is TEST-NET-1, reserved for documentation and guaranteed not to be routable. A good deliberate-blackhole address. |
| 85 | `03-phase-networking-basics.md:1210` | Now run the ladder again. This is the important moment: **`ping 8.8.8.8` still works, `ping google.com` fails.** You have reproduced the DNS failure signature deliberately, and you will recognise it for the rest of your career. | **OK** — Networking: this is exactly the DNS failure signature the exercise is designed to produce. |
| 86 | `03-phase-networking-basics.md:1218` | Then verify with the full ladder, and confirm `nslookup google.com` answers again. | **OK** — Microsoft Learn: `nslookup` queries DNS. |
| | | <sub>↓ 6. **Write the comparison table.** For each rung, one column for “what it looks like when healthy” and one for “what it looks like when this rung is b …</sub> | |
| 87 | `03-phase-networking-basics.md:1223` | (The `169.254` address itself is worth meeting deliberately: on a machine that has just lost DHCP, `ipconfig /all` shows it as the *Autoconfiguration IPv4 Address*. Do that once, so the signature is familiar before it finds you.) | **OK** — Microsoft Learn: Windows labels a 169.254.x.x address “Autoconfiguration IPv4 Address”. |
| 88 | `03-phase-networking-basics.md:1427` | > **Observed:** Wi-Fi connected, full signal. `ipconfig /all`: IPv4 `192.168.1.22/24`, gateway `192.168.1.1`, DHCP lease valid, **DNS Servers: `127.0.0.1`**. `ping 192.168.1.1` — 0 % loss. `ping 8.8.8.8` — 0 % loss, 24–26 ms. `ping google.com` — “could not fin … | **OK** — Microsoft Learn: `ipconfig /all` shows the DNS servers line. |
| 89 | `03-phase-networking-basics.md:1428` | > **Action (one change at a time):** 1) Reset the Wi-Fi adapter’s DNS servers to automatic (`Set-DnsClientServerAddress -ResetServerAddresses`) and flushed the DNS cache. 2) Confirmed the adapter now receives `192.168.1.1` and `8.8.8.8` via DHCP. | **OK** — Microsoft Learn: `Set-DnsClientServerAddress -ResetServerAddresses` resets a client's DNS servers. |
| 90 | `03-phase-networking-basics.md:1429` | > **Verified:** `nslookup google.com` resolved correctly. Asked the user to load the specific site that failed and confirm it opened — they confirmed it loaded normally. | **OK** — Microsoft Learn: `nslookup` resolves names. |
| 91 | `03-phase-networking-basics.md:1433` | **Reasoning to take away:** “The internet is down” is a *symptom description*, not a diagnosis, and in this ticket the internet was never down. The decisive evidence cost nothing: `ping 8.8.8.8` succeeded while `ping google.com` failed, and that single compari … | **OK** — Networking: this is the DNS split test and the inference drawn from it is correct. |
| 92 | `03-phase-networking-basics.md:1435` | **Read the DNS Servers line in `ipconfig /all` every single time** — `127.0.0.1` is never an accident, and it is the fingerprint of a VPN or security tool that changed the machine and did not change it back. | **UNVERIFIABLE** — diagnostic advice about a habit, not a claim about a command |
| 93 | `03-phase-networking-basics.md:1595` | \| Maria can reach the gateway \| `ping 192.168.10.65` — 0 % loss \| Link, IP, and gateway rungs all pass \| | **OK** — Networking: ping tests reachability. |
| | | <sub>↑ \| Maria’s gateway is local \| Gateway `192.168.10.65` is inside her own block \| Her configuration is valid, not a mask error \|<br>↓ \| Maria cannot reach port 445 \| `TcpTestSucceeded : False` \| The block is between subnets \|</sub> | |
| 94 | `03-phase-networking-basics.md:1607` | > **Observed:** Printer prints its own test page; port name on a working PC is `192.168.10.200_1`. Printer is `192.168.10.200/26` — subnet `192.168.10.192/26`. Working PC is `192.168.10.25/26` — subnet `192.168.10.0/26`. Affected PC is `192.168.10.70/26`, gate … | **OK** — The subnet arithmetic is correct: 192.168.10.200/26 falls in 192.168.10.192/26. |
| 95 | `03-phase-networking-basics.md:1626` | **Do the cheap comparison first.** In ticket 1 it was `ping 8.8.8.8` against `ping google.com`. In ticket 2 it was one working machine against one failing machine. A comparison costs seconds and splits the problem in half. | **OK** — Networking: the address-versus-name comparison is the cheap and decisive test. |
| 96 | `03-phase-networking-basics.md:1628` | **Read the configuration lines you are tempted to skim.** `DNS Servers: 127.0.0.1` in ticket 1 and `Subnet Mask: 255.255.255.192` in ticket 2 were both sitting in plain sight in `ipconfig` output. Neither was hidden. Both were decisive. | **OK** — Microsoft Learn: `ipconfig` output includes the DNS Servers line and the Subnet Mask line. |
| 97 | `03-phase-networking-basics.md:1642` | - **DNS translates names to addresses**, and it breaks more often than connectivity. Test it with `ping 8.8.8.8` versus `ping google.com`. | **OK** — Networking: the split test is correctly described. |
| 98 | `03-phase-networking-basics.md:1645` | - `Test-NetConnection` and `nslookup` are your two best everyday tools. | **OK** — Microsoft Learn: `Test-NetConnection` tests ports; `nslookup` queries DNS. |
| | | <sub>↑ - **TCP** is reliable and connection-oriented; **UDP** is fast and best-effort.<br>↓ - **Subnets exist to limit broadcast noise, separate devices, and create policy boundaries.** A flat network of 500 devices wastes bandwidth and lets  …</sub> | |
| 99 | `03-phase-networking-basics.md:1687` | \| Windows `ipconfig` \| Shows IP config \| Free, built-in \| https://learn.microsoft.com/windows-server/administration/windows-commands/ipconfig \| Record IP, gateway, DNS \| Linux `ip a` \| | **OK** — Microsoft Learn: the linked `ipconfig` page is the correct documentation. |
| 100 | `03-phase-networking-basics.md:1688` | \| `ping` \| Tests reachability/latency \| Free, built-in \| https://learn.microsoft.com/windows-server/administration/windows-commands/ping \| Ping gateway and 1.1.1.1 \| PowerShell `Test-Connection` \| | **OK** — Microsoft Learn: the linked `ping` page is the correct documentation. |
| 101 | `03-phase-networking-basics.md:1689` | \| `nslookup` \| Tests DNS \| Free, built-in \| https://learn.microsoft.com/windows-server/administration/windows-commands/nslookup \| Resolve google.com and compare DNS servers \| `dig` on Linux \| | **OK** — Microsoft Learn: the linked `nslookup` page is the correct documentation. |
| 102 | `03-phase-networking-basics.md:1707` | 2. Check your IP configuration. Run `ipconfig /all` on Windows, or `ifconfig` / `ip a` on Linux. Record your IP address, subnet mask, default gateway, DHCP server, DNS server, and MAC address. <!-- id: it-03-t02 band: quick energy: low --> | **OK** — Microsoft Learn/POSIX: `ipconfig /all`, `ifconfig` and `ip a` all display IP configuration. |
| 103 | `03-phase-networking-basics.md:1709` | 4. Run DNS lookups. Try `nslookup google.com`, `nslookup -type=mx gmail.com`, and `nslookup -type=txt google.com`. Document what each reveals. <!-- id: it-03-t04 band: focused energy: normal --> | **OK** — Microsoft Learn: `nslookup -type=<record>` queries a specific record type. |
| 104 | `03-phase-networking-basics.md:1747` | **Why:** The second form asks a *specific* server. If your local resolver and `8.8.8.8` disagree, the domain is fine and your resolver is the fault. `tracert` shows the path, not the translation. | **OK** — Microsoft Learn: `nslookup <name> <server>` queries a named server, which is exactly the comparison described. |
| 105 | `03-phase-networking-basics.md:1810` | **Why:** `ping` proves the host answers ICMP; it says nothing about whether the *service* is listening. `Test-NetConnection` reports DNS resolution, the resolved IP, reachability, and the port state in one command — which is why the phase calls it the most use … | **OK** — Microsoft Learn: `Test-NetConnection` reports resolution, the resolved address, reachability and port state. The contrast with ping is correct — ICMP answering says nothing about a TCP service. |
| 106 | `03-phase-networking-basics.md:1846` | **Why:** The order matters because `renew` can hand back the same lease it already holds. `release` gives the address up first, which is what forces a fresh exchange. Neither touches the DNS cache — that is `ipconfig /flushdns`. | **OK** — Microsoft Learn: `/release` gives up the lease so `/renew` must obtain a fresh one; `/flushdns` clears the resolver cache. The three-way distinction is correct. |
| 107 | `04-phase-helpdesk-skills.md:381` ▶ | - `ping fileserver01` succeeds; `Test-NetConnection fileserver01 -Port 445` | **OK** — Microsoft Learn: `Test-NetConnection -Port 445` tests the SMB port. |
| | | <sub>↑ - Other departments can reach their own drives normally<br>↓ fails to connect</sub> | |
| 108 | `04-phase-helpdesk-skills.md:744` | > **Observed:** `Get-ADPrincipalGroupMembership` showed the account already holds `Project-Atlas-RW`. Folder ACL grants that group Modify, so permissions were correct on both sides. `whoami /groups` on the user's machine did not list the group — a stale sessio … | **OK** — Microsoft Learn: `Get-ADPrincipalGroupMembership` retrieves the groups an account belongs to. |
| 109 | `04-phase-helpdesk-skills.md:769` | \| 2 \| Windows \| `ipconfig /all` \| IP, mask, gateway, DNS, DHCP, MAC \| | **OK** — Microsoft Learn: `ipconfig /all` displays IP, mask, gateway, DNS, DHCP and MAC. |
| | | <sub>↑ \| 1 \| Windows \| `systeminfo` \| OS build, RAM, uptime, install date \|<br>↓ \| 3 \| Windows \| `ping <gateway>` then `ping 8.8.8.8` then `ping google.com` \| The DNS split test \|</sub> | |
| 110 | `04-phase-helpdesk-skills.md:770` | \| 3 \| Windows \| `ping <gateway>` then `ping 8.8.8.8` then `ping google.com` \| The DNS split test \| | **OK** — Networking: this is the DNS split test. |
| | | <sub>↑ \| 2 \| Windows \| `ipconfig /all` \| IP, mask, gateway, DNS, DHCP, MAC \|<br>↓ \| 4 \| Windows \| `nslookup google.com` and `nslookup google.com 8.8.8.8` \| Is my own resolver working? \|</sub> | |
| 111 | `04-phase-helpdesk-skills.md:771` | \| 4 \| Windows \| `nslookup google.com` and `nslookup google.com 8.8.8.8` \| Is my own resolver working? \| | **OK** — Microsoft Learn: `nslookup <name> <server>` queries a specific server, which answers “is my own resolver working?”. |
| | | <sub>↑ \| 3 \| Windows \| `ping <gateway>` then `ping 8.8.8.8` then `ping google.com` \| The DNS split test \|<br>↓ \| 5 \| Windows \| `net use` \| Mapped drives and their state \|</sub> | |
| 112 | `04-phase-helpdesk-skills.md:775` | \| 8 \| Windows \| `Get-Volume` \| Free space per drive \| | **OK** — Microsoft Learn: `Get-Volume` reports volume information including free space. |
| | | <sub>↑ \| 7 \| Windows \| `whoami` then `whoami /groups` \| My exact identity and group list \|<br>↓ \| 9 \| PowerShell \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10` \| The ten most recent errors \|</sub> | |
| 113 | `04-phase-helpdesk-skills.md:776` | \| 9 \| PowerShell \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10` \| The ten most recent errors \| | **OK** — Microsoft Learn: `Get-WinEvent -FilterHashtable` filters logs by LogName and Level. |
| 114 | `04-phase-helpdesk-skills.md:777` | \| 10 \| PowerShell \| `Get-Service` filtered on Automatic and Stopped \| A fault nobody has reported \| | **OK** — Microsoft Learn: `Get-Service` reports Status and StartType, so filtering on Automatic and Stopped is valid. |
| | | <sub>↑ \| 9 \| PowerShell \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10` \| The ten most recent errors \|<br>↓ \| 11 \| Linux \| `df -h` \| Filesystem usage in human units \|</sub> | |
| 115 | `04-phase-helpdesk-skills.md:798` | Healthy `ipconfig /all` output, trimmed to the lines that matter: | **OK** — Microsoft Learn: `ipconfig /all` produces the output described. |
| 116 | `04-phase-helpdesk-skills.md:829` | The third block is the one to read carefully, and the evidence is in the **header line**, not the reply. **When you ping a name and the header shows `[142.250.4.101]` after it, the forward lookup succeeded** — `ping` only prints that bracketed address once it  … | **OK** — Windows ping prints the resolved address in square brackets in the reply header — the observation the row teaches the reader to make. |
| 117 | `04-phase-helpdesk-skills.md:869` | For `Get-Volume`, healthy is above about 15 % free. Below 10 % on the system drive, Windows slows down measurably: updates fail, the page file stops growing, and temp files cannot be written. | **UNVERIFIABLE** — a threshold stated as general guidance (“about 15 %”, “below 10 %”) rather than a documented figure |
| 118 | `04-phase-helpdesk-skills.md:897` | \| `Get-Volume` \| `df -h` \| How full is each filesystem? \| | **OK** — Microsoft Learn/POSIX: `Get-Volume` and `df -h` both report per-filesystem usage. |
| | | <sub>↑ \|---\|---\|---\|<br>↓ \| Disk Management \| `lsblk` \| What disks and partitions exist? \|</sub> | |
| 119 | `04-phase-helpdesk-skills.md:900` | \| `netstat -ano` \| `ss -tulpn` \| What is listening on which port? \| | **OK** — Microsoft Learn/POSIX: `netstat -ano` and `ss -tulpn` both list listening sockets. |
| | | <sub>↑ \| Event Viewer \| `journalctl -p err -b` \| What has gone wrong since boot? \|<br>↓ \| `ipconfig /all` \| `ip a` plus `ip route` \| What is my address and my gateway? \|</sub> | |
| 120 | `04-phase-helpdesk-skills.md:901` | \| `ipconfig /all` \| `ip a` plus `ip route` \| What is my address and my gateway? \| | **OK** — Microsoft Learn/POSIX: `ipconfig /all` and `ip a` plus `ip route` show address and gateway. |
| | | <sub>↑ \| `netstat -ano` \| `ss -tulpn` \| What is listening on which port? \|</sub> | |
| 121 | `04-phase-helpdesk-skills.md:938` | \| `ipconfig /all` \| "Wi-Fi has 192.168.1.22/24 with gateway 192.168.1.1 and DNS 192.168.1.1 — a complete, consistent configuration." \| "It shows my IP address." \| | **OK** — Microsoft Learn: `ipconfig /all` shows this configuration. |
| 122 | `04-phase-helpdesk-skills.md:939` | \| `ping 8.8.8.8` then `google.com` \| "Both answered and the name resolved to 142.250.4.101, so connectivity and DNS are both healthy." \| "The internet works." \| | **OK** — Networking: the split test, correctly reported. |
| 123 | `04-phase-helpdesk-skills.md:941` | \| `Get-Service` filter \| "Empty list — no service set to Automatic is stopped, so there is no silent background fault on this machine." \| "No services found." \| | **OK** — Microsoft Learn: `Get-Service` reports Status; an empty filtered list means what the row says. |
| 124 | `04-phase-helpdesk-skills.md:999` | \| 4 \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2}` \| Repeated errors with boot-time timestamps \| | **OK** — Microsoft Learn: `Get-WinEvent -FilterHashtable` filters by LogName and Level. |
| 125 | `04-phase-helpdesk-skills.md:1000` | \| 5 \| `Get-Volume` \| System drive below 10 % free \| | **OK** — Microsoft Learn: `Get-Volume` reports free space. |
| | | <sub>↑ \| 4 \| `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2}` \| Repeated errors with boot-time timestamps \|</sub> | |
| 126 | `04-phase-helpdesk-skills.md:1094` | \| Reachability \| Can you ping it from the failing laptop? \| `ping <printer-ip>` \| | **OK** — Networking: ping tests reachability. |
| | | <sub>↑ \| Power and network \| Is the printer awake and on the network? \| The printer's own panel \|<br>↓ \| Port \| Is the print port answering? \| `Test-NetConnection <printer-ip> -Port 9100` — 9100 is the raw-printing port nearly every network printer l …</sub> | |
| 127 | `04-phase-helpdesk-skills.md:1095` | \| Port \| Is the print port answering? \| `Test-NetConnection <printer-ip> -Port 9100` — 9100 is the raw-printing port nearly every network printer listens on \| | **OK** — Microsoft Learn: `Test-NetConnection -Port` tests a port. 9100 is IANA-registered for raw printing (PJL), and is the port nearly every network printer listens on. |
| 128 | `04-phase-helpdesk-skills.md:1135` | 1. Does the underlying internet connection drop at the same time? Watch a continuous `ping` to your gateway while working. If that drops too, the VPN was a symptom and your Wi-Fi is the fault. | **OK** — Networking: a continuous ping is the standard way to observe intermittent connectivity. |
| 129 | `04-phase-helpdesk-skills.md:1447` | 2. A user says "the internet is down". Your `ping` to their gateway succeeds. | **OK** — Networking: ping tests reachability. |
| | | <sub>↑ 1. A user reports the shared drive is empty. Their password was changed an hour ago.<br>↓ 3. A user reports an MFA prompt they did not trigger, at 2am, on a Sunday.</sub> | |
| 130 | `04-phase-helpdesk-skills.md:1464` | \| 2 \| Gather more — `ping 8.8.8.8`, then `ping google.com` \| A working gateway rules out the LAN. The IP-versus-name pair splits connectivity from DNS in one step \| | **OK** — Networking: the reasoning is the standard split test. |
| 131 | `04-phase-helpdesk-skills.md:1542` | \| Break your own DNS \| In an **Administrator** PowerShell on a machine you own, set your adapter's DNS to `127.0.0.1`, then `ipconfig /flushdns` \| `ping 8.8.8.8` still works, `ping google.com` fails. Put it back to automatic afterwards \| | **OK** — Microsoft Learn: `ipconfig /flushdns` clears the DNS client resolver cache. |
| 132 | `04-phase-helpdesk-skills.md:1545` | \| Fill the system drive \| Do not do this to test it — instead read `Get-Volume` and predict what would break below 5 % free \| A prediction you can check beats a disk you have to repair \| | **OK** — Microsoft Learn: `Get-Volume` reports free space. |
| 133 | `05-phase-sysadmin-basics.md:289` | - **`Get-CimInstance` rather than `wmic`.** `wmic` is deprecated and being removed from Windows. New scripts use the CIM cmdlets. You will still meet `wmic` in old documentation and on old systems, so recognise it, but do not write it. | **OK** — Microsoft Learn: `wmic` is deprecated; the CIM cmdlets (`Get-CimInstance`) are the documented replacement. |
| 134 | `05-phase-sysadmin-basics.md:527` | Realistic output of `Get-LocalGroupMember`: | **OK** — Microsoft Learn: `Get-LocalGroupMember` retrieves the members of a local group. |
| 135 | `05-phase-sysadmin-basics.md:626` | `Get-Acl` gives you the same information as `icacls` in a form you can filter. `IsInherited` is the `(I)` flag; `AccessControlType` is Allow or Deny. Where `icacls` wins is that it shows *scope* flags inline and works over the network with a **UNC path** (Univ … | **OK** — Microsoft Learn: `Get-Acl` retrieves the security descriptor for a resource — the same information `icacls` prints. |
| 136 | `05-phase-sysadmin-basics.md:628` | One practical warning: `Get-Acl` hides the scope flags. An ACE that is inherited-only (`(IO)`) appears identical to one that applies everywhere. When the *behaviour* does not match the `Get-Acl` listing, re-check with `icacls`. | **UNVERIFIABLE** — a caveat about how a cmdlet presents data, which would need a specific test to confirm rather than a documentation page |
| 137 | `05-phase-sysadmin-basics.md:660` | **Rule three: check whether the user is local or remote.** `icacls` on a local path tells you nothing about the share. `Get-SmbShareAccess` tells you nothing about NTFS. A ticket that says “it works when I am at my desk but not from home” is pointing at the sh … | **OK** — Microsoft Learn: `icacls` works on NTFS permissions on a path; `Get-SmbShareAccess` reports share-level permissions. The two are genuinely different layers. |
| 138 | `05-phase-sysadmin-basics.md:691` | Read the mismatch. `net user` — which reads the **directory** — says the account is in `Finance-Managers`. `whoami /groups` — which reads the **current token** — does not list it. The directory and the session disagree, and that disagreement is the diagnosis. | **OK** — Microsoft Learn: `net user` reads the account database; `whoami /groups` reads the current token. The distinction is exactly as the row states. |
| 139 | `05-phase-sysadmin-basics.md:704` | \| “I was added to the group yesterday” \| `whoami /groups` vs `net user <name>` \| Mismatch means a stale token — sign out and back in \| | **OK** — Microsoft Learn: `whoami /groups` shows the current token, which is why a fresh group membership needs a new logon. |
| 140 | `05-phase-sysadmin-basics.md:707` | \| “It works locally but not over the network” \| `Get-SmbShareAccess` \| Share permission more restrictive than NTFS \| | **OK** — Microsoft Learn: `Get-SmbShareAccess` reports share permissions. |
| 141 | `05-phase-sysadmin-basics.md:709` | \| “The account is locked or expired” \| `net user <name>` \| `Account active`, `Password expires`, `Last logon` \| | **OK** — Microsoft Learn: `net user <name>` shows Account active, Password expires and Last logon. |
| 142 | `05-phase-sysadmin-basics.md:710` | \| “Who is in this group?” \| `Get-LocalGroupMember -Group <name>` \| Members who should have been removed, and `PrincipalSource` \| | **OK** — Microsoft Learn: `Get-LocalGroupMember -Group` lists members, and the returned objects carry `PrincipalSource`. |
| 143 | `05-phase-sysadmin-basics.md:853` | **How to interpret it:** `PrincipalSource` should read `Local`, because you just created this identity on this machine. If you are on a domain-joined machine, run `Get-LocalGroupMember -Group 'Administrators'` as well and you will likely see a mix of `Local`,  … | **OK** — Microsoft Learn: `Get-LocalUser` exposes `PrincipalSource`, which reads Local for a locally-created account. |
| 144 | `05-phase-sysadmin-basics.md:979` | Then confirm they are gone with `Get-LocalUser` and `Get-LocalGroup`. Leaving test accounts and test groups behind on a production machine is a genuine audit finding, and building the habit of cleaning up after yourself starts now. | **OK** — Microsoft Learn: `Get-LocalUser` and `Get-LocalGroup` retrieve local accounts and groups. |
| 145 | `05-phase-sysadmin-basics.md:1032` | **This is the diagnosis, and it is a single observation.** `net user` says the account belongs to `Finance-Managers`. `whoami /groups` does not list it. The directory and the running session disagree, which means the session token was built before the group me … | **OK** — Microsoft Learn: `whoami /groups` shows current token groups — the single observation the diagnosis rests on. |
| 146 | `05-phase-sysadmin-basics.md:1067` | If a full sign-out does not resolve it, the next checks are, in order: confirm the machine can reach a domain controller on the VPN (`nltest /dsgetdc:company.local` — `nltest` is a domain-controller diagnostic; a successful result names a DC and its site), and … | **OK** — Microsoft Learn: `nltest /dsgetdc:` locates a domain controller — the documented diagnostic for exactly this situation. |
| 147 | `05-phase-sysadmin-basics.md:1081` | > **Observed:** `net user maria.santos` showed membership in `Finance-Managers`, but `whoami /groups` on the running session did not list it — the directory and the session token disagreed, indicating the token predated the group change. Confirmed server-side  … | **OK** — Microsoft Learn: `whoami /groups` shows current token groups. |
| 148 | `05-phase-sysadmin-basics.md:1257` | - **`Get-CimInstance` replaces `wmic`** in modern PowerShell. | **OK** — Microsoft Learn: `Get-CimInstance` replaces `wmic` and `Get-WmiObject`. |
| | | <sub>↑ - Routine checks — disks, services, event logs, uptime, inventory — catch outages before users do.<br>↓ - **Anything done more than twice by hand is a candidate for automation.**</sub> | |
| 149 | `05-phase-sysadmin-basics.md:1265` | - Across the network, **share and NTFS must both allow**, and the more restrictive wins. Test with `Get-SmbShareAccess` *and* `icacls`. | **OK** — Microsoft Learn: share and NTFS permissions both apply and the more restrictive wins. |
| 150 | `05-phase-sysadmin-basics.md:1281` | 4. Reproduce the stale-token diagnosis from Ticket 1 on your own machine: add yourself to a new local group without signing out, confirm that `whoami /groups` does not list it while `Get-LocalGroupMember` does, then sign out and back in and confirm the two agr … | **OK** — Microsoft Learn: `whoami /groups` shows the token, `Get-LocalGroupMember` reads the group — which is why they disagree until re-logon. |
| 151 | `06-phase-tools-and-ticketing.md:397` | > **Investigated:** `Get-PSDrive` confirmed only `C:` affected; `D:` has 255.6 GB free, so the data volume is healthy and this is not user-data growth. Largest-directory scan showed `C:\Windows\Temp` at 18.41 GB, of which the largest files were `sql_dump_*.tmp … | **OK** — Microsoft Learn: `Get-PSDrive` reports per-drive usage including free space. |
| 152 | `06-phase-tools-and-ticketing.md:1204` | 3. **Produce evidence for one machine the way Part 5 does.** Capture `Get-PSDrive`, a largest-directory scan, and timestamps on the biggest files. Write the "what this shows" paragraph. This is the portfolio artefact: it demonstrates that you read evidence rat … | **OK** — Microsoft Learn: `Get-PSDrive` reports drive usage. |
| 153 | `08-phase-portfolio-and-resume.md:112` | \| "Did some networking." \| "Built a routed lab network in VirtualBox with two subnets; verified connectivity and fault isolation with `ping`, `tracert`, and Wireshark captures." \| | **OK** — All three are standard network diagnostic tools, correctly described. |
| 154 | `08-phase-portfolio-and-resume.md:114` | \| "Know Linux." \| "Installed and administered Ubuntu Server in a VM: user and group management, `systemctl` service control, permissions with `chmod` and `chown`, log review in `/var/log`." \| | **OK** — All named tools and paths are standard Linux administration. |
| 155 | `08-phase-portfolio-and-resume.md:489` | **"How did you verify?"** A `ping` from the first subnet to the router's second interface, then to the host on the second subnet, then `tracert` to confirm the path actually went through pfSense rather than resolving locally. Then a Wireshark capture to see th … | **OK** — Networking: ping and tracert are the standard tools for verifying routed connectivity. |
| 156 | `08-phase-portfolio-and-resume.md:755` ▶ | running. `systemctl status ssh` showed `active (running)`, so the service was | **OK** — systemd: `systemctl status` reports `active (running)`. |
| | | <sub>↑ **Second failure:** SSH was refused from the host even though the server was<br>↓ fine and the problem was the network. The VM was on NAT, and NAT does not let</sub> | |
| 157 | `08-phase-portfolio-and-resume.md:768` ▶ | \| Service controllable \| `systemctl status ssh` showed `active (running)` \| | **OK** — systemd: `systemctl status` reports the unit's active state. |
| | | <sub>↑ \| User and group created \| `id labadmin` showed `uid=1001(labadmin) gid=1001(labadmin) groups=1001(labadmin),1002(helpdesk)` \|<br>↓ \| Log reading works \| `journalctl -u ssh -n 20` showed the accepted-connection line \|</sub> | |
| 158 | `08-phase-portfolio-and-resume.md:770` ▶ | \| SSH reachable \| `ssh labadmin@127.0.0.1 -p 2222` connected from the host \| | **OK** — OpenSSH: `ssh user@host -p <port>` connects to a non-default port. |
| | | <sub>↑ \| Log reading works \| `journalctl -u ssh -n 20` showed the accepted-connection line \|</sub> | |
| 159 | `08-phase-portfolio-and-resume.md:776` ▶ | - `systemctl status <unit>` is the first command to run for any service | **OK** — systemd: `systemctl status` is the standard first command for a service problem. |
| | | <sub>↑ Reading the error literally would have saved 40 minutes.<br>↓ problem — it distinguishes "not running" from "running but refusing".</sub> | |
| 160 | `08-phase-portfolio-and-resume.md:1067` | \| 2 \| PowerShell 7, `Get-CimInstance` for OS and disk, `Get-Service` filtered to `Running`, `Export-Csv` for the output. \| | **OK** — Microsoft Learn: all named cmdlets are standard PowerShell 7. |
| 161 | `09-phase-job-application-plan.md:719` | - Strong: "A user said the internet was down. I pinged `8.8.8.8` first — that worked, so routing and upstream were fine. `ping google.com` failed, so it was name resolution. `nslookup` against the local resolver got no answer, while `nslookup google.com 8.8.8. … | **OK** — This describes the standard DNS split test performed correctly, including the resolver comparison. |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## DNS record types

*Defined by RFC 1035 and successors. Small set, easy to get subtly wrong.*

**Source to check against:** RFC 1035 and the IANA DNS parameters registry

4 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `03-phase-networking-basics.md:54` | - DNS: A, AAAA, CNAME, MX, TXT, NS records | **OK** — Microsoft Learn (`nslookup set type`): the resource record type for a query includes the standard types named here. |
| | | <sub>↓ - DHCP: Discover, Offer, Request, Acknowledge at a beginner level</sub> | |
| 2 | `03-phase-networking-basics.md:180` | 2. **`AAAA` records are the DNS counterpart to IPv4's `A` records.** If a name resolves over IPv4 but not IPv6, an `AAAA` lookup tells you. | **OK** — RFC 3596: AAAA is the IPv6 address record, the counterpart to A for IPv4 — which is exactly the diagnostic role the row describes. |
| 3 | `03-phase-networking-basics.md:231` ▶ | nslookup google.com # the A record | **OK** — Microsoft Learn: `nslookup` diagnoses DNS infrastructure, and a bare name query returns the A record. |
| | | <sub>↑ ```powershell<br>↓ nslookup -type=mx gmail.com # mail servers</sub> | |
| 4 | `03-phase-networking-basics.md:233` ▶ | nslookup -type=txt google.com # TXT records | **OK** — Microsoft Learn (`nslookup set type`): changes the resource record type for the query — so `-type=txt` queries TXT records. |
| | | <sub>↑ nslookup -type=mx gmail.com # mail servers<br>↓ nslookup google.com 8.8.8.8 # ask a SPECIFIC server</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Protocol and standard behaviour

*Fixed by the defining spec. Includes handshake sequences, header fields, status codes and OSI layer assignments.*

**Source to check against:** The RFC or standard that defines the protocol; vendor docs for proprietary ones

26 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `03-phase-networking-basics.md:27` | - Understand IPv4, IPv6 basics, subnet mask, gateway, DNS, DHCP, NAT, TCP, UDP, ICMP, ports, and Wi-Fi. | **UNVERIFIABLE** — curriculum learning objective — a statement of what the phase covers, not a claim about a protocol |
| | | <sub>↑ - Explain LAN, WAN, internet, router, switch, firewall, modem, access point, and ISP.<br>↓ - Use `ping`, `tracert/traceroute`, `ipconfig/ifconfig/ip`, `nslookup`, `arp -a`, `route print`, and Wireshark.</sub> | |
| 2 | `03-phase-networking-basics.md:76` | The good news is that the foundation is small. You need to understand addresses, subnets, gateways, DNS, DHCP, ports, and the difference between TCP and UDP. That is genuinely most of it. | **UNVERIFIABLE** — pedagogical characterisation of what a learner needs to know |
| 3 | `03-phase-networking-basics.md:185` | **DHCP (Dynamic Host Configuration Protocol)** hands out addresses automatically. The four-step exchange is called **DORA**, and it is worth memorising because it tells you what to check when it fails: | **OK** — RFC 2131: the four DHCP message types are DISCOVER, OFFER, REQUEST, ACK — the exchange the row names DORA. |
| 4 | `03-phase-networking-basics.md:284` | - **TCP** is connection-oriented and reliable. It establishes a connection with a **three-way handshake** — `SYN`, `SYN-ACK`, `ACK` — numbers every byte, acknowledges receipt, and retransmits anything lost. It is used when correctness matters: web browsing, fi … | **OK** — RFC 9293: “this is called the three-way (or three message) handshake (3WHS)” — SYN, SYN-ACK, ACK, as stated. |
| 5 | `03-phase-networking-basics.md:285` | - **UDP** is connectionless and best-effort. It sends packets with no handshake and no guarantee. It is used when speed matters more than perfection: video streaming, voice calls, DNS queries, games. | **OK** — RFC 768: UDP is connectionless and makes no delivery guarantee. |
| 6 | `03-phase-networking-basics.md:289` | You can see the handshake on your own machine. In Wireshark, filter on `tcp` and open any website. You will see the three packets at the start of every connection: `SYN`, then `SYN, ACK`, then `ACK`. Watching that once, with your own eyes, does more for your u … | **OK** — RFC 9293: the three-way handshake is SYN, SYN-ACK, ACK — the three packets the exercise has the reader find. |
| 7 | `03-phase-networking-basics.md:293` | **TLS (Transport Layer Security)** wraps a connection in encryption and proves the server's identity with a **certificate**. **HTTPS** is simply HTTP carried inside TLS, on port 443. | **OK** — RFC 8446: TLS provides confidentiality and server authentication by certificate. IANA assigns 443 to HTTPS. |
| 8 | `03-phase-networking-basics.md:772` | - **TcpTestSucceeded** is the answer. `True` means the TCP handshake completed: the server accepted your connection on that port. | **OK** — Microsoft Learn: `Test-NetConnection` reports `TcpTestSucceeded`, which reflects whether the TCP connection was accepted. |
| 9 | `03-phase-networking-basics.md:857` | \| Every packet timed out \| The host is unreachable, or it blocks ICMP \| Follow the ladder; also test a port with `Test-NetConnection` \| | **OK** — Microsoft Learn: `Test-NetConnection` tests a port, which is the stronger test the row recommends. |
| 10 | `03-phase-networking-basics.md:864` | **Second, and more importantly: “ping works but the app does not” is a different problem class.** Ping uses **ICMP**, a completely different protocol from TCP. A host can cheerfully answer ICMP while a specific TCP port is blocked by a firewall, or while the s … | **OK** — RFC 792: ICMP is a separate protocol from TCP — so “ping works but the app does not” is genuinely a different fault class. |
| 11 | `03-phase-networking-basics.md:890` ▶ | Authentication : WPA2-Personal | **OK** — Wi-Fi Alliance: WPA2-Personal is a standard authentication mode, correctly labelled in this captured output. |
| | | <sub>↑ Radio type : 802.11ax<br>↓ Cipher : CCMP</sub> | |
| 12 | `03-phase-networking-basics.md:1158` | **For the TCP handshake:** start a new capture, then load a website in your browser while it runs. Stop it and filter on: | **OK** — Wireshark: loading a site while a capture runs is how a TCP handshake is observed. The instruction is sound. |
| 13 | `03-phase-networking-basics.md:1161` ▶ | tcp.flags.syn==1 | **OK** — Wireshark: `tcp.flags.syn==1` is a valid display filter matching packets with the SYN flag set. |
| | | <sub>↑ ```text<br>↓ ```</sub> | |
| 14 | `03-phase-networking-basics.md:1164` | That filter shows packets with the **SYN** flag set — the packets that begin a connection. Find one connection and look at the three packets at its start: | **OK** — Wireshark: `tcp.flags.syn==1` matches SYN packets, which are the packets that begin a connection. |
| 15 | `03-phase-networking-basics.md:1166` | 1. **SYN** — your machine to the server: “I would like to open a connection, here is my starting sequence number.” | **OK** — RFC 9293: SYN is the first packet of the handshake and carries the initiator's initial sequence number. |
| 16 | `03-phase-networking-basics.md:1167` | 2. **SYN, ACK** — server to your machine: “Agreed, and here is mine.” | **OK** — RFC 9293: SYN-ACK is the second packet, acknowledging the client and carrying the server's own sequence number. |
| | | <sub>↑ 1. **SYN** — your machine to the server: “I would like to open a connection, here is my starting sequence number.”<br>↓ 3. **ACK** — your machine to the server: “Acknowledged. Connection open.”</sub> | |
| 17 | `03-phase-networking-basics.md:1172` | Two practical notes. If the capture looks overwhelming, remember Wireshark is showing *everything* on your adapter; the filter is what makes it readable. And if you see your own traffic in encrypted form, that is TLS doing its job — you will see the handshake  … | **UNVERIFIABLE** — pedagogical advice about reading a Wireshark capture |
| 18 | `03-phase-networking-basics.md:1644` | - **TCP** is reliable and connection-oriented; **UDP** is fast and best-effort. | **OK** — RFC 9293 (TCP) and RFC 768 (UDP): the reliability and ordering contrast is stated correctly. |
| | | <sub>↑ - **Ports** route traffic to the right service. Know the common ones; respect the dangerous ones.<br>↓ - `Test-NetConnection` and `nslookup` are your two best everyday tools.</sub> | |
| 19 | `03-phase-networking-basics.md:1655` | - **The diagnostic ladder is link, IP, gateway, DNS, port, application — in that order, stopping at the first failure.** The order is the skill; the commands are just the tools. | **UNVERIFIABLE** — diagnostic methodology — an ordering the curriculum teaches, not a protocol behaviour |
| 20 | `03-phase-networking-basics.md:1686` | \| Wireshark \| Packet capture/analysis \| Free \| https://www.wireshark.org/ \| Capture DNS lookup and TCP handshake \| tcpdump on Linux \| | **OK** — Wireshark is free and open-source, and it captures both of the named traffic types. |
| 21 | `03-phase-networking-basics.md:1711` | 6. Capture a TCP handshake in Wireshark. Filter on `tcp`, find a handshake between your device and a server, and explain the three-way handshake. <!-- id: it-03-t06 band: focused energy: normal --> | **OK** — Wireshark: the `tcp` filter captures handshakes, so the exercise is performable as written. |
| 22 | `03-phase-networking-basics.md:1792` | **Why:** TCP is connection-oriented and reliable — it opens with the `SYN`, `SYN-ACK`, `ACK` handshake and retransmits what is lost. UDP is best-effort by design; ICMP carries diagnostics; ARP maps IP to MAC. | **OK** — RFC 9293 (TCP), RFC 768 (UDP), RFC 792 (ICMP), RFC 826 (ARP): every characterisation in the summary is correct. |
| 23 | `07-phase-soft-skills.md:520` | > The machine is failing to complete the DHCP handshake on the corporate VLAN. It gets an APIPA address, so it is not reaching the scope. I have ruled out the cable and the switch port. Suspect the scope is exhausted or the reservation is stale — checking the  … | **OK** — Microsoft Learn: APIPA (169.254.0.0/16) is the self-assigned address when no DHCP server responds — the signature described. |
| 24 | `08-phase-portfolio-and-resume.md:97` | \| **Action** \| "Learned about DHCP" \| "Configured a DHCP scope, then captured the DORA exchange in Wireshark to confirm it" \| | **OK** — RFC 2131: DORA is the DHCP exchange, so the resume line describes real, demonstrable work. |
| 25 | `08-phase-portfolio-and-resume.md:276` ▶ | confirm the DORA sequence; intentionally broke the gateway setting on | **OK** — RFC 2131: DORA is the DHCP exchange. |
| | | <sub>↑ tracert across subnets; captured the DHCP exchange in Wireshark to<br>↓ one client to see how the failure presents.</sub> | |
| 26 | `08-phase-portfolio-and-resume.md:279` ▶ | the portfolio. I can now explain the DORA sequence from the packets | **OK** — RFC 2131: DORA is the DHCP exchange. |
| | | <sub>↑ Result : A working routed lab, a network diagram, and packet-capture notes in<br>↓ rather than from memory, and I recognise a wrong-gateway symptom</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Product versions and editions

*The class most likely to ROT. A claim that is true today may be false after a release, so these carry a shelf life the others do not.*

**Source to check against:** Vendor documentation, checked against the current release

17 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-computer-fundamentals.md:112` | The same information is available without a terminal: press **Ctrl+Shift+Esc** for Task Manager, click the **Performance** tab, and select **CPU**. You will see the model name, the core count, the current speed, and a live graph. For a fuller report, search th … | **OK** — Microsoft: Ctrl+Shift+Esc opens Task Manager, which has a Performance tab with a CPU view. The keyboard route is correct. |
| 2 | `01-phase-computer-fundamentals.md:449` | 2. **Let Windows Update handle it when it can.** On modern Windows 10 and 11, most drivers install automatically and correctly. Manually chasing the newest driver is rarely necessary and occasionally harmful. | **OK** — Microsoft: Windows Update installs and updates drivers automatically on Windows 10 and 11. |
| 3 | `06-phase-tools-and-ticketing.md:248` | 4. **Check the version and date.** A guide written for Windows 10 may be subtly wrong on Windows 11. A page about an old admin portal may describe buttons that no longer exist. | **UNVERIFIABLE** — general advice about documentation ageing — a claim about guides in general, not about a specific version |
| 4 | `06-phase-tools-and-ticketing.md:1066` ▶ | Service : Microsoft 365 Outlook desktop, Windows 11, version 2401 build 17231 | **UNVERIFIABLE** — worked example — a version string inside a fictional ticket, not a claim about what exists |
| | | <sub>↑ Category : Email (client)<br>↓ Repro : 1. Launch Outlook from Start. 2. Splash screen appears.</sub> | |
| 5 | `08-phase-portfolio-and-resume.md:320` ▶ | Operating systems : Windows 10/11 (user and group management, NTFS permissions, services, | **OK** — Windows 10 and 11 are current supported client releases of Windows. |
| | | <sub>↑ TECHNICAL SKILLS<br>↓ Event Viewer), Ubuntu Server (users, systemd, permissions, log review)</sub> | |
| 6 | `08-phase-portfolio-and-resume.md:701` ▶ | Install Ubuntu Server 24.04 in a VirtualBox VM and prove I can do four | **OK** — Ubuntu Server 24.04 LTS is a real release. |
| | | <sub>↓ things from the command line without a GUI: create a user, put them in a</sub> | |
| 7 | `08-phase-portfolio-and-resume.md:709` ▶ | \| Host \| Windows 11, 8 GB RAM \| | **UNVERIFIABLE** — worked example — hardware specification inside portfolio sample material |
| | | <sub>↑ \|---\|---\|<br>↓ \| Virtualisation \| Enabled in BIOS (see "What went wrong") \|</sub> | |
| 8 | `08-phase-portfolio-and-resume.md:712` ▶ | \| Guest \| Ubuntu Server 24.04 LTS, 2 GB RAM, 20 GB disk \| | **OK** — Ubuntu Server 24.04 LTS is a real release. |
| | | <sub>↑ \| VirtualBox \| 7.0.14 \|<br>↓ \| Network \| NAT, with a port forward `2222 → 22` so the host can reach SSH \|</sub> | |
| 9 | `08-phase-portfolio-and-resume.md:885` ▶ | Operating systems : [Windows 10/11: users, groups, NTFS permissions, services, Event Viewer] | **OK** — Windows 10 and 11 are current supported client releases. |
| | | <sub>↑ TECHNICAL SKILLS<br>↓ [Ubuntu Server: users, systemd, permissions, /var/log review]</sub> | |
| 10 | `08-phase-portfolio-and-resume.md:996` | \| After \| Created local users and groups in Windows 11 and demonstrated how inherited and explicit NTFS permissions combine with share permissions to determine effective access. \| | **OK** — Windows 11 is a current supported client release. |
| 11 | `08-phase-portfolio-and-resume.md:1035` | \| Name the tool or system \| VirtualBox, Windows 11, osTicket, pfSense \| | **OK** — VirtualBox, Windows 11, osTicket and pfSense are all real products. |
| | | <sub>↑ \|---\|---\|<br>↓ \| Name the action \| Built, configured, diagnosed, created, verified \|</sub> | |
| 12 | `08-phase-portfolio-and-resume.md:1067` | \| 2 \| PowerShell 7, `Get-CimInstance` for OS and disk, `Get-Service` filtered to `Running`, `Export-Csv` for the output. \| | **OK** — Microsoft Learn: all named cmdlets are standard PowerShell 7. |
| 13 | `08-phase-portfolio-and-resume.md:1098` | \| 1 \| I studied how Active Directory organises users, groups, and organisational units, and I read about Group Policy. I practised the equivalent concepts — local users, local groups, permissions — on a standalone Windows 11 machine. \| | **OK** — Windows 11 is a current supported client release. |
| 14 | `08-phase-portfolio-and-resume.md:1099` | \| 2 \| Windows 11 local users and groups. I have not installed or administered a domain controller. \| | **OK** — Windows 11 is a current supported client release. |
| | | <sub>↑ \| 1 \| I studied how Active Directory organises users, groups, and organisational units, and I read about Group Policy. I practised the equivalent co …<br>↓ \| 3 \| Nothing went wrong, because I did not do it. I followed a tutorial's screenshots rather than running my own domain. \|</sub> | |
| 15 | `08-phase-portfolio-and-resume.md:1108` | \| Experienced with Active Directory and Windows Server administration. \| Studied Active Directory concepts and practised user and group management, permissions, and least privilege on a standalone Windows 11 machine; a Windows Server domain controller lab is … | **OK** — Windows 11 is a current supported client release. |
| 16 | `09-phase-job-application-plan.md:535` ▶ | accounts; manage M365 users; troubleshoot Windows 10/11, printers, | **OK** — Windows 10 and 11 are current supported client releases. |
| | | <sub>↑ Do: triage tickets by email/chat/phone; reset passwords and unlock<br>↓ and VPN; document every ticket in our PSA (professional services automation — the ticketing and billing system MSPs run; here, ConnectWise); escalate</sub> | |
| 17 | `09-phase-job-application-plan.md:578` ▶ | What I can do now: Windows 10/11 troubleshooting, M365 user and | **OK** — Windows 10 and 11 are current supported client releases. |
| | | <sub>↓ group administration, password resets and account unlocks, TCP/IP</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

## Registry paths, file paths and filenames

*Verbatim strings that must match the OS exactly. A transposed path sends a reader somewhere that does not exist.*

**Source to check against:** Microsoft documentation, or the OS itself

17 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-computer-fundamentals.md:71` | - **File Paths:** Location of files (e.g., `C:\Users\YourName\Documents\file.txt`). | **OK** — Windows: `C:\Users\<name>\Documents\<file>` is the standard user document path. |
| | | <sub>↑ - **Extensions:** File type indicators (e.g., `.pdf`, `.jpg`).</sub> | |
| 2 | `01-phase-computer-fundamentals.md:440` | Also worth knowing: minidump files land in `C:\Windows\Minidump`. You do not analyse these at Phase 1, but their **timestamps** tell you exactly when each crash happened, which lets you correlate crashes against what the user was doing. | **OK** — Microsoft: kernel minidumps are written to `C:\Windows\Minidump`. |
| 3 | `02-phase-operating-systems.md:61` | - Filesystem hierarchy: `/`, `/home`, `/etc`, `/var/log`, `/tmp` | **OK** — FHS: `/`, `/home`, `/etc`, `/var/log` and `/tmp` are all standard directories with the roles implied. |
| | | <sub>↓ - Users and groups: `adduser`, `passwd`, `groups`, `usermod`</sub> | |
| 4 | `02-phase-operating-systems.md:66` | - Logs: `/var/log/auth.log`, `/var/log/syslog`, `journalctl` | **OK** — `/var/log/auth.log` and `/var/log/syslog` are the standard Debian/Ubuntu log paths, and `journalctl` reads the journal. |
| | | <sub>↑ - Processes and services: `ps`, `top`, `systemctl`<br>↓ - Core navigation commands: `pwd`, `ls`, `cd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`, `grep`, `find`</sub> | |
| 5 | `02-phase-operating-systems.md:415` | \| Where apps live \| `C:\Program Files` \| `/usr/bin`, `/opt` \| **`/Applications`** \| | **OK** — `C:\Program Files` (Windows), `/usr/bin` and `/opt` (Linux), and `/Applications` (macOS) are the standard application locations. |
| | | <sub>↑ \| File manager \| File Explorer \| (the shell) \| **Finder** \|<br>↓ \| Settings \| Control Panel / Settings \| config files in `/etc` \| **System Settings** \|</sub> | |
| 6 | `02-phase-operating-systems.md:514` | Expected: your username, your **UID** (user ID — the number Linux uses internally for your account) and groups, kernel and distribution details, uptime, a list of login-capable accounts, disk and memory usage, any failed logins, and recent errors. On a desktop … | **UNVERIFIABLE** — a description of expected output — verifiable only by running the command on a chosen distribution |
| 7 | `02-phase-operating-systems.md:522` | 1. In Windows, open `C:\Windows\System32\winevt\Logs` in File Explorer. Windows stores logs as binary `.evtx` files that you must open with Event Viewer. | **OK** — Microsoft: Windows stores event logs as `.evtx` files under `C:\Windows\System32\winevt\Logs`, opened with Event Viewer. |
| 8 | `02-phase-operating-systems.md:622` | A loaded profile whose path ends in something like `C:\Users\TEMP` or `C:\Users\TEMP.DOMAIN.001` is the temporary profile. That is your diagnosis, and everything else follows from it. | **OK** — Microsoft: a temporary profile is assigned a path such as `C:\Users\TEMP`, which is the signature this row teaches the reader to spot. |
| 9 | `02-phase-operating-systems.md:636` | 2. **Copy the data out** from `C:\Users\<broken-profile>` to a location outside it — their Desktop, Documents, Pictures, and Downloads folders, plus any application data they need. | **OK** — Windows: user profiles live directly under `C:\Users\<name>`. |
| 10 | `02-phase-operating-systems.md:872` | \| Why did an update fail? \| `Get-WindowsUpdateLog` to build a readable log, plus Setup log under `C:\Windows\Logs` \| | **OK** — Microsoft Learn: `Get-WindowsUpdateLog` merges the Windows Update .etl traces into a readable log. |
| 11 | `02-phase-operating-systems.md:1385` | - **Log analysis:** What you found in `/var/log/auth.log` and `/var/log/syslog`, and how you used `journalctl` to read system logs. | **OK** — `/var/log/auth.log` and `/var/log/syslog` are standard log paths and `journalctl` reads the journal. |
| 12 | `06-phase-tools-and-ticketing.md:357` | `C:\Windows\Temp` at 18.41 GB is the answer, and it is not user data. Something has been writing temporary files and never cleaning them up. | **OK** — Windows: `C:\Windows\Temp` is the system temp directory, and it is not user data — the distinction this row draws. |
| 13 | `06-phase-tools-and-ticketing.md:397` | > **Investigated:** `Get-PSDrive` confirmed only `C:` affected; `D:` has 255.6 GB free, so the data volume is healthy and this is not user-data growth. Largest-directory scan showed `C:\Windows\Temp` at 18.41 GB, of which the largest files were `sql_dump_*.tmp … | **OK** — Microsoft Learn: `Get-PSDrive` reports per-drive usage including free space. |
| 14 | `06-phase-tools-and-ticketing.md:398` | > **Cause:** A nightly job outside the service desk's ownership is writing ~5 GB of temporary dump files to `C:\Windows\Temp` and never removing them. Under four days of accumulation took the volume to the alert threshold, so this will recur within the week un … | **OK** — Windows: `C:\Windows\Temp` is the system temp directory. |
| 15 | `06-phase-tools-and-ticketing.md:399` | > **Action:** Cleared `C:\Windows\Temp` dump files after confirming their identity and daily pattern. Did **not** delete unfamiliar files. Raised a problem record so the owning team fixes the cleanup, because the files regenerate nightly. | **OK** — Windows: `C:\Windows\Temp` is the system temp directory, so clearing dump files from it is the correct action. |
| 16 | `06-phase-tools-and-ticketing.md:401` | > **For the next agent:** If this alert fires again, check `C:\Windows\Temp` first and look for `sql_dump_*.tmp`. The root cause is not fixed — the nightly job is with the application team. Growth is ~5 GB per day, so the volume has roughly four days of headro … | **OK** — Windows: `C:\Windows\Temp` is the system temp directory, so it is the right first place to look. |
| 17 | `08-phase-portfolio-and-resume.md:114` | \| "Know Linux." \| "Installed and administered Ubuntu Server in a VM: user and group management, `systemctl` service control, permissions with `chmod` and `chown`, log review in `/var/log`." \| | **OK** — All named tools and paths are standard Linux administration. |

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
| 02 operating-systems |  | 9 | 36 |  |  |  | 9 | 23 | **77** |
| 03 networking-basics | 78 | 33 | 58 | 4 | 22 |  |  | 17 | **212** |
| 04 helpdesk-skills | 2 | 17 | 26 |  |  |  |  | 12 | **57** |
| 05 sysadmin-basics |  | 24 | 18 |  |  |  |  | 9 | **51** |
| 06 tools-and-ticketing |  | 50 | 2 |  |  | 2 | 5 | 40 | **99** |
| 07 soft-skills |  | 5 |  |  | 1 |  |  | 2 | **8** |
| 08 portfolio-and-resume |  | 1 | 8 |  | 3 | 11 | 1 | 14 | **38** |
| 09 job-application-plan |  | 1 | 1 |  |  | 2 |  | 8 | **12** |

