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

| 1 | `01-phase-computer-fundamentals.md:71` | - **File Paths:** Location of files (e.g., `C:\Users\YourName\Documents\file.txt`). | |
| | | <sub>↑ - **Extensions:** File type indicators (e.g., `.pdf`, `.jpg`).</sub> | |
| 2 | `01-phase-computer-fundamentals.md:440` | Also worth knowing: minidump files land in `C:\Windows\Minidump`. You do not analyse these at Phase 1, but their **timestamps** tell you exactly when each crash happened, which lets you correlate crashes against what the user was doing. | |
| 3 | `02-phase-operating-systems.md:61` | - Filesystem hierarchy: `/`, `/home`, `/etc`, `/var/log`, `/tmp` | |
| | | <sub>↓ - Users and groups: `adduser`, `passwd`, `groups`, `usermod`</sub> | |
| 4 | `02-phase-operating-systems.md:66` | - Logs: `/var/log/auth.log`, `/var/log/syslog`, `journalctl` | |
| | | <sub>↑ - Processes and services: `ps`, `top`, `systemctl`<br>↓ - Core navigation commands: `pwd`, `ls`, `cd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`, `grep`, `find`</sub> | |
| 5 | `02-phase-operating-systems.md:415` | \| Where apps live \| `C:\Program Files` \| `/usr/bin`, `/opt` \| **`/Applications`** \| | |
| | | <sub>↑ \| File manager \| File Explorer \| (the shell) \| **Finder** \|<br>↓ \| Settings \| Control Panel / Settings \| config files in `/etc` \| **System Settings** \|</sub> | |
| 6 | `02-phase-operating-systems.md:514` | Expected: your username, your **UID** (user ID — the number Linux uses internally for your account) and groups, kernel and distribution details, uptime, a list of login-capable accounts, disk and memory usage, any failed logins, and recent errors. On a desktop … | |
| 7 | `02-phase-operating-systems.md:522` | 1. In Windows, open `C:\Windows\System32\winevt\Logs` in File Explorer. Windows stores logs as binary `.evtx` files that you must open with Event Viewer. | |
| 8 | `02-phase-operating-systems.md:622` | A loaded profile whose path ends in something like `C:\Users\TEMP` or `C:\Users\TEMP.DOMAIN.001` is the temporary profile. That is your diagnosis, and everything else follows from it. | |
| 9 | `02-phase-operating-systems.md:636` | 2. **Copy the data out** from `C:\Users\<broken-profile>` to a location outside it — their Desktop, Documents, Pictures, and Downloads folders, plus any application data they need. | |
| 11 | `02-phase-operating-systems.md:1385` | - **Log analysis:** What you found in `/var/log/auth.log` and `/var/log/syslog`, and how you used `journalctl` to read system logs. | |
| 12 | `06-phase-tools-and-ticketing.md:357` | `C:\Windows\Temp` at 18.41 GB is the answer, and it is not user data. Something has been writing temporary files and never cleaning them up. | |
| 14 | `06-phase-tools-and-ticketing.md:398` | > **Cause:** A nightly job outside the service desk's ownership is writing ~5 GB of temporary dump files to `C:\Windows\Temp` and never removing them. Under four days of accumulation took the volume to the alert threshold, so this will recur within the week un … | |
| 15 | `06-phase-tools-and-ticketing.md:399` | > **Action:** Cleared `C:\Windows\Temp` dump files after confirming their identity and daily pattern. Did **not** delete unfamiliar files. Raised a problem record so the owning team fixes the cleanup, because the files regenerate nightly. | |
| 16 | `06-phase-tools-and-ticketing.md:401` | > **For the next agent:** If this alert fires again, check `C:\Windows\Temp` first and look for `sql_dump_*.tmp`. The root cause is not fixed — the nightly job is with the application team. Growth is ~5 GB per day, so the volume has roughly four days of headro … | |
