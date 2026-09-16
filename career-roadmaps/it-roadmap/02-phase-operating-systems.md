---
id: it-02-operating-systems
track: it
phase: 2
order: 20
title: "Phase 2 — Operating Systems"
duration: "3 weeks"
duration_weeks: 3
energy_mix: [low, normal]
deliverable: "portfolio/it/02-operating-systems.md"
exit_criteria: "You can troubleshoot a basic Windows issue and a basic Linux issue without following every step blindly."
---

# Phase 2 — Operating Systems

## Goal of this phase

Become comfortable using and troubleshooting Windows and Linux at a beginner IT-support level.

## Estimated time

**3 weeks**. Windows: 1.5 weeks. Linux: 1 week. Buffer/review: 0.5 week.

## Skills you'll gain

- Navigate Windows settings, Control Panel, Task Manager, Device Manager, Event Viewer, Services, Disk Management, and the command line.
- Use basic PowerShell and Command Prompt commands.
- Install and use a Linux VM.
- Use Linux commands for files, permissions, processes, packages, services, and logs.
- Understand users, groups, permissions, updates, drivers, startup apps, and services.
- Recognise and respond to malware, and know when to clean versus when to rebuild.
- Find your way around macOS well enough to support it at first-line level, and explain the Windows-to-macOS mapping.

## Specific topics to learn

### Windows administration

- Windows filesystem layout: `C:\`, user profiles, Program Files, AppData
- Local user vs Microsoft account; administrator vs standard user
- UAC (User Account Control) and elevation prompts
- Windows Update, driver updates, and rolling back a bad update
- Task Manager, Device Manager, Event Viewer, Services, Disk Management
- Startup apps: enabling, disabling, and diagnosing slow boot
- Shared folders and NTFS permissions basics
- Windows Defender and basic malware removal steps

### Windows command line

- `ipconfig`, `ping`, `tracert`, `nslookup` for network checks
- `net user` and `net localgroup` for account inspection
- `sfc /scannow` for system file repair
- `chkdsk` and `chkdsk /scan` for disk errors
- `systeminfo` for a full system summary
- PowerShell equivalents: `Get-Process`, `Get-Service`, `Get-EventLog`, `Get-ChildItem`, `Copy-Item`

### Linux fundamentals

- Filesystem hierarchy: `/`, `/home`, `/etc`, `/var/log`, `/tmp`
- Users and groups: `adduser`, `passwd`, `groups`, `usermod`
- Permissions: `chmod`, `chown`, and reading `rwx` notation
- Package management with `apt update` and `apt install`
- Processes and services: `ps`, `top`, `systemctl`
- Logs: `/var/log/auth.log`, `/var/log/syslog`, `journalctl`
- Core navigation commands: `pwd`, `ls`, `cd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`, `grep`, `find`
- Running commands with `sudo` and understanding when it is necessary

### Cross-platform troubleshooting

- Slow performance: identify the resource that is saturated before acting
- Login problems: password reset, locked accounts, profile corruption
- Driver problems: rollback, reinstall, vendor versus Windows Update drivers
- Service failures: reading status, restarting, checking dependent services
- Permission errors: distinguishing file permissions from account permissions

## Lesson: Operating Systems

### Why this lesson exists

An operating system is the layer that turns hardware into something a person can use. It manages memory, schedules processes, controls devices through drivers, enforces permissions, and provides a filesystem. When a user reports almost any problem — "it's slow", "I can't log in", "my printer vanished", "the app won't open" — the investigation passes through the operating system.

This phase covers two of them. **Windows** is what you will meet in the overwhelming majority of entry-level support roles: desktops, laptops, and the corporate fleet. **Linux** is what runs the servers behind nearly every website and cloud service, and it is the operating system of cybersecurity. You need enough of both to be conversational and competent, not expert.

By the end of this lesson you will be able to move around Windows and Linux confidently, read a log, explain the difference between a user and a permission, install software safely, and walk a user through a fix without needing to see their screen.

**Time to complete:** roughly 12–18 hours across the three weeks. The Linux half requires installing a virtual machine, which is itself one of the phase's deliverables — treat that as part of the lesson.

### Part 1 — What an operating system actually does

#### The five jobs

Every operating system, whether Windows, Linux, or macOS, does the same five things. Learning them as a list makes the rest of this lesson click into place.

1. **Process management.** Programs are broken into processes. The OS decides which process gets the processor and for how long. This is why a single runaway process can make a whole machine feel slow — it is holding the processor.
2. **Memory management.** The OS hands out RAM to processes and takes it back when they close. When RAM runs short, the OS moves data to a page file on disk, which is dramatically slower. That is the mechanism behind "my PC slows down when I have too many tabs open".
3. **Device management.** The OS talks to hardware through drivers. A missing or wrong driver means the hardware exists but is invisible or broken — a printer that will not print, a Wi-Fi adapter that will not connect.
4. **Storage management.** The OS presents physical disks as a filesystem: drives, folders, files, permissions. Every "where did my file go" question is a filesystem question.
5. **User and security management.** Accounts, passwords, permissions, and privilege elevation. This is what stops a standard user from deleting system files and what makes "run as administrator" necessary.

When a user reports a problem, ask which of these five jobs is failing. Is it a process problem (something is using all the resources), a memory problem, a driver problem, a storage problem, or a permissions problem? That question alone narrows most tickets enormously.

#### Windows and Linux in one paragraph each

**Windows** is commercial, GUI-first, and dominant in business. Its defining features for a support technician are the Start menu, Settings versus Control Panel (both exist, and you need both), the registry (its internal settings database), Windows Update, Active Directory (the corporate directory that holds domain accounts and groups) in corporate environments, and an enormous library of built-in administrative tools. It is closed source, and it deliberately hides complexity behind friendly screens — which is why so many fixes require you to go behind those screens.

**Linux** is open source, terminal-first, and dominant on servers. It is built from small single-purpose tools that you combine. It is case-sensitive — `File.txt` and `file.txt` are different files, which trips up every Windows user at least once. It has no single standard GUI; different distributions bundle different desktop environments. Its permissions model is central rather than bolted on, and its logs are plain text files you can read with `cat`.

The practical takeaway: on Windows you click, and drop to the terminal when you need precision. On Linux you type, and reach for a GUI only when it is convenient.

#### What failure looks like

Operating system problems cluster into recognisable categories. Learn the categories and you can place almost any symptom.

- **Resource exhaustion** — slow machine, high CPU or memory, a process pinned at 100 %. Task Manager or `top` tells you immediately.
- **Account and permission problems** — cannot log in, access denied, cannot install, cannot open a shared folder. The problem is identity or permission, not the machine.
- **Driver problems** — a device missing, a yellow warning triangle in Device Manager, an external monitor not detected, no sound.
- **Service problems** — a function that should run in the background is stopped: printing, Windows Update, a network service. `Get-Service` or `systemctl status` shows it.
- **Update problems** — a patch failed to install, or installed and broke something. Rollback and update history are your tools.
- **Filesystem problems** — corruption, disk errors, a full disk, a drive that disappears.
- **Boot problems** — the machine will not start, or starts into recovery. This is where OS troubleshooting meets the firmware knowledge from Phase 1.

### Part 2 — Windows: navigating like a technician

#### The filesystem you will actually use

Five locations cover almost all day-to-day support work.

```text
C:\                          The system drive — OS and installed programs
C:\Users\<username>          The user's profile: Desktop, Documents, Downloads, Pictures
C:\Program Files             Installed 64-bit applications
C:\Program Files (x86)       Installed 32-bit applications
C:\Users\<username>\AppData  Per-user settings for applications — hidden by default
```

`AppData` is worth knowing specifically, because it is where the fix for a great many "the app is behaving strangely" tickets lives. It is hidden by default; in File Explorer, turn on **View → Show → Hidden items**. Inside it you will find `Local`, `LocalLow`, and `Roaming` — `Roaming` holds settings that follow a user between machines in a domain, and `Local` holds caches and machine-specific data. Deleting a corrupted `Local` folder for one application is a legitimate fix; deleting `AppData` wholesale is not.

The practical rule for support: **never store anything important only on the Desktop or in Downloads**, and never assume a user's files are where the folder name suggests. Ask.

#### The tools you will open most

These five console tools are the backbone of Windows support. Learn what each is for before you need it.

| Tool | Command | What it is for |
|---|---|---|
| Task Manager | `taskmgr` | Which process is using CPU, memory, disk, or network right now |
| Device Manager | `devmgmt.msc` | Hardware inventory and driver status |
| Services | `services.msc` | Background services: running, stopped, startup type |
| Event Viewer | `eventvwr.msc` | Logs: what happened, when, and what failed |
| Disk Management | `diskmgmt.msc` | Partitions, drive letters, unallocated space |

Two habits make these genuinely useful. First, **open Task Manager sorted by CPU, then by memory, then by disk** — the biggest number is almost always your lead. Second, **in Event Viewer, filter rather than scroll**: use **Filter Current Log** to show only Critical and Error entries for a time window, because the unfiltered log is thousands of routine entries.

#### Users, groups, and the permission model

Windows separates *identity* from *privilege*.

- A **local account** lives only on this machine. A **Microsoft account** is tied to Microsoft's cloud services and follows the user to other machines.
- An **administrator** can change system settings, install software, and modify other users' data. A **standard user** can use the machine but not change it globally.
- **Groups** are collections of accounts that share permissions. The important built-ins are `Administrators`, `Users`, `Remote Desktop Users`, and `Power Users`.

You can inspect all of this without any paid tool:

```powershell
# Who exists on this machine?
Get-LocalUser | Select-Object Name, Enabled, LastLogon

# What groups exist?
Get-LocalGroup | Select-Object Name

# Who is in the Administrators group?
Get-LocalGroupMember -Group "Administrators"
```

Typical output:

```text
Name           Enabled LastLogon
----           ------- ---------
Administrator  False
alex           True    13/09/2026 09:14:22
DefaultAccount False
Guest          False
```

That output is a genuine security review. A **Guest** account that is enabled, or an unexpected member of **Administrators**, is exactly the kind of finding that matters in a real support role — and noticing it is a skill you can demonstrate in an interview.

**UAC (User Account Control)** is the prompt that appears when something needs elevation. It exists because most users should never run as administrator for daily work. When a user says "it keeps asking me for permission", the correct response is usually not "disable UAC" — it is "you are running as a standard user, and I will do that step for you". Never advise disabling UAC as a fix.

### Part 3 — Windows from the command line

The command line matters because it is precise, scriptable, and remote-friendly. On a remote support call, you cannot see the user's screen, but you can ask them to type one command and read you the output.

#### The classic commands

```powershell
ipconfig /all          # full network configuration: IP, gateway, DNS, MAC
ping 8.8.8.8           # is there basic connectivity?
ping google.com        # does name resolution work? (this is a DIFFERENT question)
tracert 8.8.8.8        # which hop is slow or dropping packets?
nslookup google.com    # what does DNS return for this name?
net user               # accounts on this machine
net localgroup administrators
systeminfo             # full system summary: OS, RAM, patches, install date
```

The `ping` pair is the single most useful diagnostic in beginner IT, and understanding *why* will set you apart. Pinging `8.8.8.8` tests connectivity by IP address, bypassing DNS entirely. Pinging `google.com` tests connectivity **and** name resolution. So:

- Both fail → the machine is offline. Check the adapter, the cable, Wi-Fi, and the router.
- IP works, name fails → the network is fine and **DNS is broken**. Check the configured DNS servers with `ipconfig /all`.
- Both work → the network and DNS are fine; the problem is somewhere else.

That one comparison takes ten seconds and answers half of all "no internet" tickets. Record it as a script you can run on autopilot.

#### Repair commands and when to use them

```powershell
sfc /scannow           # scan and repair protected system files
chkdsk C: /scan        # online scan for filesystem errors (safe, no reboot)
DISM /Online /Cleanup-Image /RestoreHealth   # repair the component store
```

Order matters. `sfc /scannow` repairs system files, but it draws its replacement files from a component store that can itself be corrupted. If `sfc` reports unfixable errors, run the `DISM` repair, then run `sfc` again. `chkdsk C: /scan` is the modern online scan and is safe to run at any time; the full repair mode (`chkdsk C: /f`) needs a reboot and can take hours.

#### PowerShell: the modern way

PowerShell is object-oriented — commands return structured objects, not just text, which means you can filter and format them without parsing strings. Five commands carry most of the weight:

```powershell
Get-Process                          # running processes, sortable by CPU or memory
Get-Service                          # services and their status
Get-WinEvent -LogName System -MaxEvents 20
Get-ChildItem                        # list files (the PowerShell "dir")
Copy-Item -Path .\report.txt -Destination C:\Backup\
```

The `Get-` verb is a clue to a whole grammar. PowerShell uses consistent verbs — `Get` to read, `Set` to change, `New` to create, `Remove` to delete, `Start` and `Stop` for services and processes. Once you know the verb pattern you can guess commands you have never seen:

```powershell
# Anything with a "Stopped" status in the first 15 services
Get-Service | Where-Object Status -eq 'Stopped' | Select-Object -First 15 Name, DisplayName

# Top five memory consumers
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5 Name, @{N='MB';E={[math]::Round($_.WorkingSet/1MB,1)}}

# Disk usage summary
Get-Volume | Select-Object DriveLetter, FileSystem, @{N='FreeGB';E={[math]::Round($_.SizeRemaining/1GB,1)}}
```

That is the payoff: the first command answers "why is this machine slow" in one line, and the third answers "is the disk full" in another. Learn to compose these and you will look far more experienced than you are.

#### Reading the Event Viewer like a technician

Event Viewer has three logs that matter for support: **Application**, **System**, and **Security**. The System log is where hardware, driver, service, and boot problems appear. The Application log is where individual programs crash.

Three event levels to care about:

- **Error** — something failed. Investigate if it repeats.
- **Warning** — something is degraded or a retry succeeded. Often ignorable.
- **Critical** — a serious failure, frequently a sudden shutdown.

Two event IDs worth memorising for entry-level work. **Event ID 41, Kernel-Power** in the System log means the system shut down without a clean exit — a crash, a power loss, or a hard reset. It tells you *that* the machine died unexpectedly, not why. **Event ID 6008, EventLog** records an unexpected shutdown with a timestamp, which is invaluable for correlating "it restarts randomly" with what the user was doing.

The technique is to filter, note the timestamp, and correlate. A user says "it crashed yesterday afternoon". You filter the System log to Error and Critical for that window and read what happened just before. Consistently, there will be a clue — a disk warning, a driver error, a memory fault.

### Part 4 — Linux: the same ideas, different grammar

#### Why a Windows person should learn Linux

Three reasons. Servers run Linux, so a huge share of the infrastructure behind any job runs it. Cybersecurity tools overwhelmingly run on it. And Linux makes the concepts *visible* — where Windows hides process and permission machinery behind dialogs, Linux exposes it as files and commands, which makes Windows itself easier to understand afterwards.

#### The filesystem hierarchy

```text
/            The root — everything is beneath it. There are no drive letters.
/home        User home directories. Your home is /home/<username>, written ~
/etc         Configuration files for the system and installed services
/var         Variable data that changes at runtime, including /var/log
/var/log     System logs — mostly plain text you can read with cat
/tmp         Temporary files, cleared on reboot
/usr         Installed programs and libraries
/bin, /sbin  Essential system binaries
```

The mental shift from Windows: there is one tree, starting at `/`. A USB drive plugged in appears somewhere in that tree (typically under `/media`), not as a new drive letter. Paths use forward slashes, not backslashes. Case matters everywhere.

#### Permissions: the concept Windows taught you badly

Every file and directory in Linux has an owner, a group, and a set of permissions for each. Run `ls -l` and you see it:

```text
-rwxr-xr--  1 alex  developers  4096 Sep 13 09:20 deploy.sh
```

Reading that string left to right:

- Position 1: `-` for a file, `d` for a directory.
- Positions 2–4: permissions for the **owner** (`rwx` = read, write, execute).
- Positions 5–7: permissions for the **group** (`r-x` = read and execute, no write).
- Positions 8–10: permissions for **everyone else** (`r--` = read only).

So `deploy.sh` can be read, written, and executed by `alex`; read and executed by anyone in `developers`; and only read by anyone else. That single line tells you who can do what — and it is the answer to a large class of "I can't run this" and "permission denied" problems.

The numeric form encodes the same thing: read is 4, write is 2, execute is 1. Add them per set. `755` = `rwxr-xr-x`, `644` = `rw-r--r--`, `600` = `rw-------`.

```bash
chmod 644 notes.txt      # owner reads/writes, everyone else reads only
chmod 755 deploy.sh      # owner can execute it, others can run but not edit
chown alex:developers deploy.sh   # change owner and group
ls -l                    # verify the change
```

**Ownership and permission are different problems.** "Permission denied" means *this account is not allowed*, which may be fixed by `chmod`, `chown`, or using `sudo`. "No such file or directory" means the path is wrong. Confusing the two sends you down the wrong path, so read the error message carefully.

#### The commands you will actually use

Everything in Linux is a small tool. These are the ones that matter first.

**Navigation and files:**

```bash
pwd                 # where am I?
ls -la              # list everything here, including hidden files, with details
cd /var/log         # change directory
cd ~                # go home
cat notes.txt       # print a whole file
less notes.txt      # page through a file — q to quit
cp source dest      # copy
mv old new          # move or rename
rm file.txt         # delete a file (there is no recycle bin)
mkdir newfolder     # create a directory
```

`rm` deserves special respect: **there is no recycle bin and no undo.** `rm -rf` on the wrong path will destroy data instantly. Before you run `rm`, run `ls` on the same path to confirm exactly what you are about to delete. That habit has saved countless careers.

**Searching:**

```bash
grep "Failed password" /var/log/auth.log    # find lines matching text
grep -i error app.log                        # case-insensitive
grep -c "ERROR" app.log                      # count matches instead of printing
find /home -name "*.txt"                     # find files by name
```

`grep` is the single most valuable Linux skill for support work, because logs are huge and the answer is always a few lines. Piping into it is the idiom to learn:

```bash
grep "Failed password" /var/log/auth.log | wc -l
```

That prints a count of failed password attempts — a one-line answer to "has anyone been trying to guess this password?".

**Packages:**

```bash
sudo apt update          # refresh the list of available packages
sudo apt upgrade         # install available updates
sudo apt install nano    # install a package
sudo apt remove nano     # remove it
```

The `update` then `upgrade` pair is a distinction beginners constantly get wrong. `apt update` downloads the *catalogue* of what is available. `apt upgrade` actually installs the newer versions. Running `upgrade` without `update` first installs based on a stale catalogue.

**Processes and services:**

```bash
ps aux                   # every running process with details
top                      # live resource view — q to quit
sudo apt install openssh-server   # Ubuntu Desktop ships no ssh server
systemctl status ssh     # is this service running, and why?
sudo systemctl restart ssh
sudo systemctl enable ssh    # start automatically at boot
```

`systemctl status` is the first thing to run for any "the service isn't working" problem. It reports whether the unit is active, when it last started, its process ID, and — critically — the last few log lines, which usually state the failure reason directly.

#### Logs: where the truth lives

```bash
/var/log/auth.log      Authentication: logins, sudo use, failed attempts
/var/log/syslog        General system messages (on Debian/Ubuntu)
/var/log/kern.log      Kernel messages: hardware, drivers
journalctl             The systemd journal — the modern centralised view
```

Four `journalctl` invocations worth memorising:

```bash
journalctl -xe                       # recent errors with explanations
journalctl -u ssh                    # only the ssh service
journalctl --since "1 hour ago"      # only recent
journalctl -p err -b                 # errors since the last boot
```

Compare this to Windows Event Viewer. Both record the same kinds of events; Linux simply hands them to you as text, which means `grep` and `journalctl` replace an entire GUI. Once you have used `journalctl --since "1 hour ago"` to find why a service died, the Windows equivalent feels clumsy.

#### macOS: the third system, and why you cannot skip it

Everything so far has been Windows and Linux. That is a real gap, and it is worth closing deliberately rather than hoping it does not come up — because **remote work skews heavily toward Macs.** Startups, design agencies, and most US-based software companies issue MacBooks, and "can you support Macs?" is a question asked in the screening call, before anyone has seen your technical work. Answering "I only know Windows" costs you the interview. Answering "I support Macs at first-line level, and here is the mapping" keeps you in it.

The honest framing is this: **macOS is a Unix system with a friendly face.** Underneath, it is close enough to Linux that your Phase 4 skills transfer almost directly. What you need is the vocabulary to move between the three systems, and that is a table, not a course.

| Idea | Windows | Linux | macOS |
|---|---|---|---|
| File manager | File Explorer | (the shell) | **Finder** |
| Where apps live | `C:\Program Files` | `/usr/bin`, `/opt` | **`/Applications`** |
| Settings | Control Panel / Settings | config files in `/etc` | **System Settings** |
| Installer format | `.exe`, `.msi` | `.deb`, `apt` | **`.dmg`** (a disk image you mount, then copy the app out of) |
| Saved passwords | Credential Manager | `~/.ssh`, keyring | **Keychain Access** |
| Backup | File History | `rsync`, Borg | **Time Machine** |
| Task manager | Task Manager | `top`, `htop` | **Activity Monitor** |
| Terminal | PowerShell, cmd | bash, zsh | **Terminal** — and it is zsh |
| Disk utility | Disk Management | `df`, `lsblk` | **Disk Utility** |

**The four macOS tickets you will actually get.** "I can't install this app" — usually a `.dmg` the user opened but never dragged to Applications, or Gatekeeper blocking an unsigned app (System Settings → Privacy & Security → **Open Anyway**). "My Mac is full" — open System Settings → General → Storage; the usual culprits are Photos, old iOS backups, and Downloads, in that order.

"Keychain keeps asking for my password" — Keychain Access, look for the repeatedly-prompting entry, and check whether the login keychain's password still matches the account password, which is what happens after a password change. "It won't connect to the printer" — the same port-and-address logic from Phase 3, via System Settings → Printers & Scanners.

**What carries over, and what does not.** Your troubleshooting *method* is identical on all three: establish scope, read the evidence, change one thing, verify. Your Windows *commands* do not carry over; anyone who tells you to run `sfc /scannow` on a Mac is telling you they have never used one. The macOS equivalents of the evidence you have just read about in Parts 3 and 4 exist — **Console** is Event Viewer, **Activity Monitor** is Task Manager, and `system_profiler` is `systeminfo`.

**Where to practise.** You do not need to buy a Mac. Ask a friend or family member who owns one to let you look through System Settings and Finder for twenty minutes; the interface is the part you are missing, not the concepts. Then write the mapping table into your own notes, in your own words. That table is a genuinely good portfolio artefact, and it is the difference between "I have never used a Mac" and "I have not owned one, but I know where everything is."

### Part 5 — Virtual machines: your safe practice lab

You should not install Linux on your only computer to learn it. Use a **virtual machine**: software that pretends to be a computer, running inside your existing one.

**VirtualBox** (free) is the tool for this phase. The sequence:

1. Download and install VirtualBox from `https://www.virtualbox.org/`.
2. Download an **Ubuntu Desktop** ISO from `https://ubuntu.com/download`.
3. In VirtualBox, click **New**, name the VM, choose **Linux / Ubuntu (64-bit)**.
4. Give it at least **4 GB of RAM** and **25 GB of disk**. Less will work but will feel slow.
5. Attach the ISO when prompted for a startup disk, then start the VM.
6. Choose **Install Ubuntu**, follow the prompts, and create your user account.

Two practical notes. First, **do not give the VM more than half your physical RAM** — the host still needs to run. Second, **take a snapshot** the moment installation finishes. A snapshot lets you return to a clean state after you break something, which you will. That is the whole point of a lab: you can be reckless because you can undo it.

A VM also lets you safely practice the destructive things you must never do on a real machine — running `rm -rf` in the wrong directory, changing permissions on system files, stopping a critical service. Learn the failure modes there, not on a user's laptop.

### Part 6 — Guided walkthrough

#### Windows checks

Run each of these and record the output. This is deliverable material.

```powershell
# 1. System overview
systeminfo | Select-String "OS Name","OS Version","System Type","Total Physical Memory"

# 2. Who can log in to this machine, and are they enabled?
Get-LocalUser | Select-Object Name, Enabled, LastLogon

# 3. Who is an administrator? (a genuine security check)
Get-LocalGroupMember -Group "Administrators"

# 4. What services are stopped but set to start automatically? (a reliability check)
Get-Service | Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped' } |
  Select-Object Name, DisplayName

# 5. What are the ten most recent system errors?
Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10 |
  Select-Object TimeCreated, LevelDisplayName, ProviderName, Id

# 6. Network configuration in full
ipconfig /all
```

Expected: an OS summary, the enabled and disabled accounts, the administrator list, possibly an empty list of failed services (a clean result is a good result), the recent errors, and your full network config including DNS servers.

The stopped-automatic-service check in step 4 is a genuinely useful one. A service set to Automatic but sitting Stopped is a machine that has a fault nobody has noticed yet — and spotting it before the user does is exactly the difference between reactive and proactive support.

#### Linux checks

Inside your Ubuntu VM:

```bash
# 1. Who am I and what is my identity?
whoami
id
groups

# 2. What is the system?
uname -a
cat /etc/os-release | head -3
uptime

# 3. Users on the system — accounts with a real login shell
grep -E "/(bash|sh)$" /etc/passwd

# 4. Disk and memory
df -h
free -h

# 5. Failed login attempts (a real security check)
sudo grep "Failed password" /var/log/auth.log | tail -20
sudo grep -c "Failed password" /var/log/auth.log
# If /var/log/auth.log does not exist, this image routes logs to the
# journal only. Same evidence, different door:
sudo journalctl -u ssh --no-pager | grep "Failed password" | tail -20

# 6. Recent service errors
journalctl -p err -b --no-pager | tail -30
```

Expected: your username, your **UID** (user ID — the number Linux uses internally for your account) and groups, kernel and distribution details, uptime, a list of login-capable accounts, disk and memory usage, any failed logins, and recent errors. On a desktop image where `/var/log/auth.log` is absent, the `journalctl` line above gives you the same failed-login evidence — an empty result from one door and a populated one from the other is a fact about the logging stack, not about your system's security.

Step 5 is the one to pay attention to. On a freshly installed VM the count is near zero. On a real internet-facing server it can be in the thousands, and recognising that pattern is a foundational security skill you will build on in the cybersecurity track.

#### One idea, both systems

Do this deliberately, because the comparison teaches more than either half alone:

1. In Windows, open `C:\Windows\System32\winevt\Logs` in File Explorer. Windows stores logs as binary `.evtx` files that you must open with Event Viewer.
2. In Linux, run `ls /var/log` and open a log with `cat` or `less`. The logs are plain text.

That is the cultural difference in one exercise. Windows uses proprietary formats and tools; Linux exposes plain text. Neither is better; knowing which you are working with determines your approach.

### Part 7 — Troubleshooting recipes

| Symptom | Where to look first | Likely fix |
|---|---|---|
| Machine is slow | `Get-Process \| Sort WorkingSet -Descending` or `top` | Identify the process; stop or restart it; check RAM |
| Cannot log in | Account disabled or locked | `Get-LocalUser`; re-enable or reset the password |
| Access denied to a folder | NTFS permissions or Linux mode bits | Check group membership; `icacls C:\path` on Windows, `ls -l` on Linux |
| Printer disappeared | Print Spooler service, then driver | Restart the spooler; reinstall the driver |
| No sound | Audio service and the output device | Check the default device; restart the audio service |
| Wi-Fi missing | Adapter driver | Device Manager status; reinstall the vendor driver |
| Windows Update fails | Component store corruption | `DISM /Online /Cleanup-Image /RestoreHealth`, then `sfc /scannow` |
| Service will not start | Its own log entries | `systemctl status` or Event Viewer; read the stated reason |
| Disk full | `Get-Volume` or `df -h` | Disk Cleanup, temp files, old update files, logs |
| Application crashes repeatedly | Application log, plus its AppData `Local` folder | Reset the app's profile; check for updates |
| VM will not start | Host RAM or virtualisation disabled | Reduce VM RAM; enable virtualisation in firmware — restart, press F2 or Del at power-on, open the CPU section, set Intel VT-x or AMD-V to Enabled |
| Forgot a Linux password | Single-user recovery | Boot to recovery, reset from the root shell |
| Slow to boot, or slow to log in | Startup apps (Task Manager → Startup apps); services for pre-login slowness | Disable High-impact entries one at a time — see below |
| "I think I have a virus" | What the user is actually seeing | Triage first — see below. Most are not infections |
| "It broke after the update" | Update history; whether System Protection was on | Uninstall the specific update, roll back the driver, or restore — see below |
| Logged in but the desktop is empty; "we can't sign in to your account" | Whether the loaded profile is a TEMP path | Copy data out first, then rebuild the profile — see below |
| Access denied on a shared folder, but the share permission allows it | The NTFS Security tab, not the Sharing tab | The more restrictive layer wins — see Part 9 |

Notice the pattern in the "where to look first" column: **it is always a log, a status, or a resource reading.** Guessing is what people do when they do not know where the evidence lives. Your job is to always know where the evidence lives.

#### Malware: the four things people call "a virus"

This is the topic listed at the top of this phase, and it deserves its own recipe because the first decision is not *how to clean it* — it is **which of four different problems you are looking at.** They have different fixes, and treating one as another wastes the user's afternoon and can destroy evidence you needed.

| What the user describes | What it usually is | First move |
|---|---|---|
| Pop-ups saying "your PC is infected, call this number" | **Scareware** — a web page, not an infection | Close the browser, do not call the number. Nothing is installed. Clear the site data and check the extension list |
| Browser opens pages you did not ask for; search engine changed | **Browser hijack** — a malicious extension or a changed shortcut | Remove the extension; check the shortcut's target for a trailing URL; reset the browser's search settings |
| Machine is genuinely slow, fan runs constantly, unknown processes present | **Possible real infection** | Do not start deleting files. Disconnect it from the network first, then read the evidence (Part 8) |
| Antivirus already reported something and quarantined it | **A handled detection** | Confirm what it found, when, and that the user did not click "allow". Then scan again |

**One symptom that is a trap, and it comes from Part 8.** The stopped-Automatic-service check you learned there is one of the best proactive checks in this phase — but when the stopped service is the antivirus, the EDR agent, or Windows Update, treat it as a *malware symptom* rather than a fault to fix.

Disabling the protection is one of the first things most malware families do, so "Defender is set to Automatic and is not running" is a finding to investigate, not a service to start and walk away from. Read why it stopped, in the event log, before you restart anything.

**Why the order matters.** Disconnecting a possibly-infected machine from the network before you investigate is the one step that buys time: it stops any command-and-control traffic and stops the thing spreading to the shared drive. It costs nothing and it is reversible. Deleting files, by contrast, destroys the evidence you need to answer "how did this get in?" — and that question is the one your employer actually cares about.

**Windows Defender, concretely.** It is already on every Windows machine and it is enough for first-line work. Open **Windows Security → Virus & threat protection**. A **quick scan** checks the places malware usually hides and takes minutes. A **full scan** checks everything and takes hours.

An **offline scan** — under Scan options — restarts the machine and scans before Windows loads, which is the one that catches malware designed to hide from a running system. **Quarantine** means Defender has moved the file somewhere it cannot run; it is not deleted, and you can review or restore it.

From the command line, `MpCmdRun.exe -Scan -ScanType 2` runs a full scan, and `Get-MpThreatDetection` lists what has been found. Knowing these exist matters more than memorising them: it tells an interviewer you have actually looked at Defender rather than only heard of it.

**Know when to stop cleaning.** Reimaging is the correct answer more often than beginners expect. If the machine was infected with something that had administrative access, or if you cannot establish how it got in, or if the user's data is already safely backed up, a rebuild is faster, more certain, and more honest than an hour of cleaning that may leave something behind.

**Cleaning is for a known, contained, low-privilege threat. Rebuilding is for everything else.** Saying that out loud in an interview is a stronger answer than listing removal tools.

**The one thing you never do.** Never tell a user "it's fine now" without evidence. Run the scan, read the result, and record what you found and what you did. A malware ticket closed on hope is the ticket that reopens next week with worse symptoms.

#### A bad update, and how to take it back

"It broke after the update" is one of the most common openers in support, and it is often correct. The good news is that Windows keeps a way back, and knowing it turns a panic into a ten-minute fix.

**Rolling back a specific update.** Settings → Windows Update → **Update history** → **Uninstall updates** lists what has been installed, and lets you remove one. This is the targeted fix: you know which update arrived and which symptom followed, so you remove that one and nothing else. It requires administrative rights — an ordinary user cannot do it, which is usually why they have called you.

```powershell
# What has been installed recently, newest first
Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 10 HotFixID, Description, InstalledOn
```

**Rolling back a driver.** A driver update that broke a device is fixed from **Device Manager** → the device → **Properties** → **Driver** → **Roll Back Driver**. It is greyed out when Windows has no previous driver stored, which happens after a cleanup or on a fresh install — and that greyed-out state is the honest answer to "why can't I roll this back", not a fault.

**The bigger hammer: a system restore point.** Windows can restore system files, drivers, and registry settings to an earlier point while leaving the user's documents alone. It is a different tool from an update rollback and it is worth knowing which is which:

| Tool | What it undoes | What it keeps | When to reach for it |
|---|---|---|---|
| **Uninstall updates** | One specific Windows update | Everything else | You know which update broke it |
| **Roll Back Driver** | One device driver | Everything else | One device stopped after a driver change |
| **System Restore** | System files, drivers, registry, installed programs | Personal files | Several things broke at once, or you cannot identify the cause |
| **Reset this PC** | Nearly everything, with a keep-files option | Personal files (if you choose) | Nothing else worked |

**Two things that decide whether any of this is available, and both are set long before the ticket arrives.** First, **System Protection must have been enabled** on the drive for restore points to exist at all; a machine where it was never turned on has no restore points to offer, no matter how urgently you want one. Second, **restore points are created by updates and installers, not continuously** — so the most recent one may be weeks old, which means restoring loses the software installed since.

That has a support consequence worth stating plainly: **the time to check System Protection is before the problem.** When you next set up or hand over a machine, confirm it is on. It costs nothing and it is the difference between a fixable afternoon and a reimage.

**And the honest limit.** None of these touch the user's own files, which is good until the thing that broke *is* a file. A restore point will not bring back a corrupted document, and it will not remove malware. If a user is hoping a system restore will recover their spreadsheet, they have the wrong tool and you should say so before you run it — because after it finishes, they will believe you told them it would.

#### "My profile is broken": the login that succeeds and the desktop that is not theirs

This is a specific and very common Windows failure, and it looks alarming and is usually straightforward. The user logs in successfully — their password is accepted — but the desktop is wrong. Their wallpaper is gone, their documents are missing, their email client wants to be set up again. Sometimes a notification says it plainly: **"We can't sign in to your account."**

What has happened is that the user's **user profile** — the folder holding their desktop, documents, application settings, and registry hive — has failed to load. Windows has quietly created a **temporary profile** instead, so the user is working in a fresh, empty environment that will be deleted at logoff.

**The tell, and it is decisive.** Look at the path, not the desktop:

```powershell
# Which profiles exist on this machine, and which are temporary?
Get-CimInstance Win32_UserProfile | Select-Object LocalPath, Loaded, Special
```

A loaded profile whose path ends in something like `C:\Users\TEMP` or `C:\Users\TEMP.DOMAIN.001` is the temporary profile. That is your diagnosis, and everything else follows from it.

**Why it happens, in rough order of frequency:**

1. **An antivirus scan quarantined a file inside the profile**, most often `NTUSER.DAT` — the registry hive that *is* the profile. This is the commonest cause and the most ironic one.
2. **A disk problem or an unclean shutdown** damaged the hive while it was being written.
3. **A profile-deletion tool removed the wrong folder**, or a folder was deleted manually while the user was logged in.
4. **A permissions problem** on the profile folder, often after a migration or a restore.

**What you do about it, and what you must not do.** The instinct is to delete the broken profile and let Windows rebuild it. Resist that instinct until you have copied the user's data — the profile folder still contains their files even when their *desktop* does not show them, and deleting it destroys the only copy.

The safe sequence:

1. **Log the user out, and confirm the temporary profile is not loaded.** A profile in use cannot be repaired.
2. **Copy the data out** from `C:\Users\<broken-profile>` to a location outside it — their Desktop, Documents, Pictures, and Downloads folders, plus any application data they need.
3. **Only then** remove the profile (Settings → Accounts → **Access work or school** has no such control; use **System → Advanced system settings → User Profiles → Settings**, or `Win32_UserProfile` via PowerShell), and let the user log in again so Windows builds a clean one.
4. **Copy the data back.**
5. **Find the cause** before you close, because a profile that broke once from a quarantined hive will break again if the antivirus does the same thing next week.

**The honest framing for the user.** Their files were not deleted, and you should say that early — it is the first thing they will ask. And be straight about the second half: some application settings will not survive, because they lived in the part that broke. Their documents come back; their email profile and saved passwords may need setting up again. Promising a perfect restoration and delivering a working-but-reset machine is how a solved ticket still generates a complaint.

### Part 8 — Reading Windows like a technician

Parts 2 to 4 told you *what* to run. This part teaches you to read what comes back. The commands are the easy half; the skill being hired is interpretation.

#### Processes: the four numbers that explain a slow machine

Task Manager shows you a list. `Get-Process` shows you the same list with numbers you can reason about. Four of those numbers carry almost all the diagnostic weight:

```powershell
Get-Process | Sort-Object WS -Descending |
  Select-Object -First 10 Name, Id,
  @{N='MemMB';E={[math]::Round($_.WS/1MB,0)}},
  @{N='CPUsec';E={[math]::Round($_.CPU,1)}},
  @{N='Threads';E={$_.Threads.Count}},
  @{N='Handles';E={$_.HandleCount}}
```

```text
Name          Id  MemMB CPUsec Threads Handles
----          --  ----- ------ ------- -------
chrome      8214   1842  412.7     142    2210
Teams       6108    612  188.3      74    1487
explorer    4020    298   61.2      98    1904
```

- **WS (Working Set)** is the physical RAM the process is actually holding right now, in bytes. This is the number that answers "what is using my memory?" A browser at 1.8 GB on an 8 GB machine is a real constraint, not a fault.
- **CPU (seconds)** is *cumulative* processor time since the process started, not a percentage. A process at 400 CPU-seconds is not necessarily busy now — it may have been busy an hour ago and idle since. To see who is busy *now*, take two readings a few seconds apart and compare, or read Task Manager's live percentage.
- **Threads** are the process's concurrent execution paths. A process with hundreds of threads is usually normal for a browser or a database, and alarming for a small utility.
- **Handles** are references to operating-system resources — files, registry keys, network sockets. This is the number that matters for one specific failure: a **handle leak**. A process whose handle count climbs steadily over hours and never falls is leaking, and it will eventually fail. That is the diagnosis behind "the machine is fine in the morning and everything is broken by 4 p.m."

That last pattern is worth internalising. A **memory leak** shows the same shape in the WS column: climbing steadily, never dropping. If a user reports a machine that degrades predictably over a working day, you are looking for a process with a rising WS or handle count, and the fix is to restart that process or update that application — not to add RAM.

#### Services and their start types

`Get-Service` reports a **Status** (is it running now?) and a **StartType** (should it start at boot?). Those are different questions, and the gap between them is where real faults hide:

| Status | StartType | What it means |
|---|---|---|
| Running | Automatic | Healthy, and the normal state for a critical service |
| Stopped | Automatic | **A fault nobody has noticed yet.** It should be running and is not |
| Running | Manual | Normal. It started on demand |
| Stopped | Disabled | Deliberately turned off. Someone made a decision — find out who and why |

The second row is the one to hunt for:

```powershell
Get-Service | Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped' } |
  Select-Object Name, DisplayName, StartType
```

On a healthy machine this returns nothing or one or two benign entries. On a neglected machine it returns a list — a print spooler that died weeks ago, an update service that never recovered from a failed patch, a backup agent nobody noticed had stopped. Finding those before the user does is the difference between reactive and proactive support, and it is one of the easiest wins available to a new technician.

The third row matters too, for a different reason. A service that is **Disabled** was disabled on purpose, by a person or by an installer. Do not re-enable it reflexively. Find out why it was disabled first, because re-enabling it may reintroduce whatever problem prompted the change.

**Dependent services, and the trap in restarting one.** Services are not independent. A service can require others to be running first, and Windows enforces that order. When you start a service, Windows starts everything it depends on; when you *stop* one, Windows stops everything that depends on it.

That second half is where beginners cause outages. Stopping a service with dependents takes the dependents down with it — sometimes services the user relies on and never mentioned. Before you stop or restart anything, ask what depends on it:

```powershell
# What must be running before this one can start?
(Get-Service -Name Spooler).DependentServices | Select-Object Name, Status

# What does this service itself require?
(Get-Service -Name Spooler).ServicesDependedOn | Select-Object Name, Status
```

Two names, two directions, and they are easy to swap. `ServicesDependedOn` is what this service *needs*; `DependentServices` is what *needs this service*. Getting them the wrong way round means you check the wrong set of services and conclude nothing is at risk.

A worked example. A user reports they cannot print. You find the **Print Spooler** stopped and restart it — a reasonable instinct. But suppose the spooler was stopped because something it depends on is broken:

```text
Name                          Status
----                          ------
RPC Endpoint Mapper          Stopped
```

The spooler will not stay running while the RPC Endpoint Mapper is down. You restart the spooler, it starts, the user tests, and it fails again ten minutes later — and now you have "fixed" it twice. This is the pattern behind a great many repeat tickets: **a service that keeps stopping is usually a symptom, not the fault.** Read what it depends on, and read its own log entries, before restarting it a third time.

The same logic explains why `Start-Service` can fail with an error naming a *different* service than the one you asked for. Windows is telling you the dependency chain could not be satisfied. That error message is the diagnosis, not a nuisance — it names the thing that is actually broken.

#### Startup apps: the other thing that runs at boot

Services are one answer to "what starts when this machine does". **Startup apps** are the other, and they are a different mechanism with a different fix — which is why "it takes four minutes to boot" and "it takes four minutes to log in" are not the same ticket.

The distinction that matters:

- **A service** starts when Windows starts, before anyone logs in. It runs in the background with no visible window, and it belongs to the system.
- **A startup app** starts when *a user* logs in. It usually has a window, a tray icon, or a splash screen — updaters, chat clients, cloud-sync tools, vendor utilities.

That difference is diagnostic. If boot is slow *before* the login screen, look at services and drivers. If the login screen appears promptly but the desktop is unusable for minutes afterwards, you are looking at startup apps.

**Where they live, and why there are three places.** This is the part that trips people up: Windows has no single list. A program can register itself in more than one place, and the place it chose tells you what kind of thing it is:

| Location | What puts entries there | Notes |
|---|---|---|
| **Task Manager → Startup apps** | Anything a user or installer registered for the current user | The visible, modern list. This is where you start |
| **Task Scheduler** | Installers wanting to run at logon or on a schedule | Invisible in Task Manager, which is why "I disabled it but it still runs" happens |
| **Registry: `Run` keys** | Older installers, and some malware | Two keys — one for the machine, one per user |
| **Startup folder** | The user dragging a shortcut in | `shell:startup` in the Run box opens it |

**Diagnosing slow boot properly, in order.** Resist the urge to disable things at random — that is how a user loses their backup agent and finds out months later.

1. **Measure first.** Task Manager → Startup apps shows an **Impact** column (High/Medium/Low) and, on newer builds, the last BIOS time. You are looking for a small number of High-impact entries, not a long list.
2. **Ask what changed.** Most slow-boot reports follow an install. "It started last week" plus a new app is a much better lead than a list of twenty startup items.
3. **Disable, do not uninstall, and do it one at a time.** Disabling is reversible in seconds; uninstalling is not. Change one entry, restart, and measure again — the same one-change-at-a-time discipline you use everywhere else.
4. **Check the other locations only if Task Manager does not explain it.** If the impact column is all Low and the machine is still slow, look at Task Scheduler and the `Run` keys:

```powershell
# Startup entries in the registry, for this user and for the whole machine
Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
Get-ItemProperty 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Run'
```

**What not to disable.** Be careful with anything that is doing a job the user depends on: backup agents, endpoint security, VPN clients, drive-encryption tools, and vendor management agents. Disabling one of those may "fix" the slowness and quietly break something an employer cares about more. When in doubt, disable, measure, and re-enable with a note in the ticket saying what you tried — that note is what stops the next technician repeating your work.

**The honest limit.** Startup impact is a coarse indicator, not a measurement, and a machine can be slow to boot for reasons that have nothing to do with startup apps at all — a failing disk, insufficient RAM, a driver waiting on a device that is no longer attached. If startup apps do not explain it, go back to reading the evidence in Part 8 rather than continuing to disable things.

#### The event log: three levels, and the discipline of not panicking

Windows logs at five levels. Three of them matter at this level:

- **Error** — something failed. Frequent and often benign on a healthy machine.
- **Warning** — something is degraded or might fail. Easy to ignore, occasionally the earliest clue.
- **Critical** — a severe failure. Rare, and always worth reading.

The discipline: **every healthy machine has hundreds of errors, and most are harmless.** A single `DCOM` error or a `DistributedCOM` timeout is noise — it appears on millions of Windows machines every day. What you are looking for is *repetition and correlation*: the same event ID, from the same provider, repeatedly, especially alongside a symptom the user has reported.

```powershell
# Errors and criticals from the last 24 hours, grouped by what keeps recurring
Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddDays(-1)} |
  Group-Object ProviderName, Id |
  Sort-Object Count -Descending |
  Select-Object -First 10 Count, Name
```

```text
Count Name
----- ----
   47 Disk, 7
    9 Kernel-Power, 41
    3 Service Control Manager, 7000
```

That output is a diagnosis. **Event ID 7 from the `Disk` provider is a bad block** — forty-seven of them in a day is a drive telling you it is failing. **Event 41, Kernel-Power** is an unclean shutdown, and nine of those means the machine is losing power or hard-crashing repeatedly. **Event 7000** is a service that failed to start, which is the event-log shadow of the stopped-Automatic-service check above.

Grouping by provider and ID is the single most useful trick in Windows log analysis, because it converts an unusable wall of text into a ranked list of what is actually wrong. Learn it once and you will use it for the rest of your career.

#### Where each kind of evidence lives

Beginners lose time looking in the wrong log. This is the map:

| Question | Where the answer is |
|---|---|
| Why did the machine reboot unexpectedly? | System log, Event 41 and 6008 |
| Why did an application crash? | Application log, plus the app's own folder under `%LOCALAPPDATA%` |
| Why did a service not start? | System log, Event 7000/7009, and the service's own logged reason |
| Why is the disk slow or erroring? | System log, `Disk` provider; then S.M.A.R.T. (Phase 1) |
| Why did an update fail? | `Get-WindowsUpdateLog` to build a readable log, plus Setup log under `C:\Windows\Logs` |
| Why was a login rejected? | Security log (needs elevated rights to read) |
| Why did a driver misbehave? | System log; look for the driver name on the BSOD (Phase 1) |

### Part 9 — Reading Linux like a technician

The same four skills, in a different grammar. If you can read Windows evidence, you already understand the concepts; you are learning syntax and file locations.

#### Processes, and the one command that ends most arguments

```bash
ps aux --sort=-%mem | head -10        # top ten by memory
ps aux --sort=-%cpu | head -10        # top ten by CPU
top -b -n 1 | head -20                # one-shot snapshot, good for notes
```

Reading `ps aux` output:

```text
USER   PID %CPU %MEM    VSZ   RSS TTY  STAT START   TIME COMMAND
mysql  1187  2.1 18.4 1843200 745216 ?  Ssl  Feb10  88:14 /usr/sbin/mysqld
root      1  0.0  0.1  169436  11264 ?  Ss   Feb10   0:14 /sbin/init
```

- **PID** is the process ID — the handle you use to act on it.
- **%MEM** is the percentage of total RAM. **RSS** is the actual resident memory in kilobytes. `%MEM` is the number you quote in a ticket because it needs no arithmetic.
- **STAT** is the process state, and it is genuinely useful. `S` is sleeping (normal — most processes are idle most of the time). `R` is running. **`D` is uninterruptible sleep, almost always waiting on disk I/O** — a process stuck in `D` is the signature of a storage problem, not a CPU problem. `Z` is a zombie: finished but not yet reaped by its parent, which indicates a bug in the parent.
- **TIME** is cumulative CPU time, same caveat as Windows: not a live percentage.

#### Services, and why `systemctl` is the first thing you run

```bash
systemctl status nginx
```

```text
● nginx.service - A high performance web server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: failed (Result: exit-code) since Wed 2024-02-14 09:41:02 UTC; 3min ago
       Docs: man:nginx(8)
    Process: 2214 ExecStartPre=/usr/sbin/nginx -t -q -g 'daemon on; master_process on;' (code=exited, status=1)
   Main PID: 2214 (code=exited, status=1/FAILURE)

Feb 14 09:41:02 web01 nginx[2214]: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
```

That single command answers the question. Read it top to bottom: the service is **failed**, it exited with **status 1**, the failing step was the **config test** (`ExecStartPre`), and the actual reason is in the last line — **port 80 is already in use**, meaning something else is listening there.

That is the whole method: `systemctl status` gives you a verdict, the failing step, and the reason, in one output. Beginners restart the service and hope. Technicians read the reason. The four commands worth knowing:

```bash
systemctl status <unit>      # what is wrong, and why
systemctl restart <unit>     # try again after fixing the cause
systemctl enable <unit>      # start at boot (persist across reboots)
systemctl list-units --failed   # everything currently broken, in one list
```

`list-units --failed` is the Linux equivalent of the stopped-Automatic-service check, and it is just as good at finding faults nobody reported.

#### Logs, and the difference between reading and searching

Linux logs are plain text, so the skill is not reading them — it is *filtering* them. You never read a log; you query it.

```bash
journalctl -u nginx --since "1 hour ago" --no-pager
journalctl -p err -b                        # errors since this boot
journalctl -u ssh -o short-precise | tail -20
grep -c "Failed password" /var/log/auth.log  # how many failed logins
grep "Failed password" /var/log/auth.log | tail -5   # the last five, with source IPs
```

The distinction that matters: `journalctl -p err` filters by **priority**, `--since` filters by **time**, and `-u` filters by **unit**. Combining all three is how you go from a machine that produces thousands of lines a day to the four lines that answer the question.

One habit worth building early: **note the timestamp of the failure before you search.** "It broke yesterday afternoon" plus `journalctl --since "yesterday 12:00" --until "yesterday 18:00"` is a targeted query. Without the timestamp you are scrolling, and scrolling is not diagnosis.

#### File permissions, read properly

Part 4 showed you `-rw-r--r--`. Here is how to read any permission string in one pass.

```text
-rwxr-xr--  1 alice  devs  4096 Feb 14 09:41 deploy.sh
│└┬┘└┬┘└┬┘
│ │  │  └── others: r--  = read only
│ │  └───── group:  r-x  = read and execute
│ └──────── owner:  rwx  = read, write and execute
└────────── type:   -    = regular file  (d = directory, l = symlink)
```

The three triads are always **owner, group, others**, in that order, and each triad is always **read, write, execute**. Nine characters, three questions. Once you see it that way it stops being a string to decode and becomes three answers.

The support consequence is in the *order of the questions*. When a user cannot open a file:

1. **Is it a permission problem or a path problem?** "Permission denied" and "No such file or directory" are different failures with different fixes. Reading the exact error is the whole job here.
2. **If it is permissions: which triad applies to this user?** Is the user the owner? If not, are they in the group? If neither, only `others` applies — and `others` is often empty.
3. **Fix the membership, not the file.** Adding the user to the right group is reversible and auditable. Running `chmod 777` is neither, and it is how access control quietly degrades across an organisation. If you find yourself typing `777` on a shared system, you have almost certainly misdiagnosed the problem.

#### Shared folders on Windows: two permission systems, and they multiply

Everything above is the Linux model. Windows shared folders have exactly the same idea — identity plus permission — but they add a complication that causes more access-denied tickets than anything else at first-line: **a file on a shared folder is governed by two separate permission systems at once.**

| Layer | Where it is set | Applies to |
|---|---|---|
| **Share permissions** | The folder's *Sharing* tab — the network entry point | Anyone arriving over the network |
| **NTFS permissions** | The folder's *Security* tab — the filesystem itself | Everyone, whether local or over the network |

**The rule that matters, and it is the one to memorise: the two are combined, and the more restrictive one wins.** A user does not get the union of what the two grant. They get the intersection.

A user with *Full Control* on the share but *Read* on the NTFS side can read and cannot write — and the Sharing tab will happily tell you they have Full Control the whole time. That mismatch is why "but the share permission is Full Control" is a sentence that means you have only looked at half the problem.

A worked example, and it is worth tracing because it is the shape of a real ticket:

```text
Share permission (Sharing tab):  Finance  ->  Change     (read + write)
NTFS permission  (Security tab): Finance  ->  Read        (read only)
```

The user reports they cannot save into the folder. They can open every file in it, so "permissions" seems obviously fine. They can open everything because *both* layers grant read. They cannot save because the NTFS layer grants only read, and NTFS is the more restrictive of the two here. The fix is on the Security tab, not the Sharing tab — and changing the share permission, the intuitive move, would change nothing at all.

Read both, every time, with one command. `icacls` shows the NTFS side:

```powershell
# NTFS permissions on a folder
icacls "C:\Shares\Finance"

# Share permissions, which icacls does not show
Get-SmbShareAccess -Name "Finance"
```

The output of `icacls` has one detail worth knowing, because it explains a class of "but I just granted access and nothing changed":

```text
C:\Shares\Finance BUILTIN\Administrators:(OI)(CI)(F)
                 DOMAIN\Finance:(OI)(CI)(R)
```

`(OI)` is **object inherit** — files created inside get this entry. `(CI)` is **container inherit** — subfolders do. `(F)` is full control, `(R)` is read, `(M)` is modify. When an entry shows neither `(OI)` nor `(CI)`, it applies to that folder alone and nothing inside it — which is exactly why a permission can look correct on the parent and still deny access to the file the user actually clicked. If a grant appears not to work, check whether it inherits.

**Two habits that prevent most of these tickets.** First, **use groups, never individual accounts** — grant to `Finance`, not to seven people, because the eighth person then needs a group membership rather than a permission change. Second, **do not break inheritance without a reason**, and never use `Deny` when a missing `Allow` would do. `Deny` overrides every `Allow` from every source, including Administrators, so a stray `Deny` produces an access problem that is genuinely hard to find later.

### Part 10 — Guided walkthrough: read the evidence

Extend Part 6's walkthrough with these reading exercises. Part 6 had you *run* commands; this has you *interpret* their output, which is the skill being tested.

#### Check 1 — Find a leaking process (or prove there is none)

Take two readings of the same process five minutes apart and compare:

```powershell
# First reading
Get-Process chrome | Select-Object Name, @{N='MemMB';E={[math]::Round($_.WS/1MB,0)}}, HandleCount

# Wait five minutes, then take the second
Get-Process chrome | Select-Object Name, @{N='MemMB';E={[math]::Round($_.WS/1MB,0)}}, HandleCount
```

Expected: broadly similar numbers, fluctuating up and down as tabs open and close. A steady, monotonic climb across both readings is a leak. Record which process it was and what the user would experience.

#### Check 2 — Hunt stopped-automatic services

```powershell
Get-Service | Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped' } |
  Select-Object Name, DisplayName, StartType
```

Expected: a short list, possibly empty. **For each entry, find out what it does before doing anything.** Then check whether it has been failing repeatedly:

```powershell
Get-WinEvent -FilterHashtable @{LogName='System'; Id=7000,7009} -MaxEvents 10 |
  Select-Object TimeCreated, Id, Message
```

A service that failed once months ago is history. A service that failed this morning is a live fault.

#### Check 3 — Group the log and rank the faults

```powershell
Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddDays(-7)} |
  Group-Object ProviderName, Id | Sort-Object Count -Descending |
  Select-Object -First 10 Count, Name
```

Expected: a ranked list. **Write down the top three and, for each, state in one sentence what it means and whether it matters.** This is the exercise that converts log-reading from a chore into a skill, and the output is directly usable in a ticket note or an interview answer.

#### Check 4 — Same exercise on Linux

Inside your VM:

```bash
systemctl list-units --failed
journalctl -p err -b --no-pager | tail -30
journalctl -p err -b | awk '{print $5}' | sort | uniq -c | sort -rn | head -10
#   awk '{print $N}' extracts whitespace-separated field N from each line.
#   Here field 5 is the process name in a standard journalctl error line.
```

Expected: the failed-units list, the recent errors, and a ranked count of which process is producing the most errors. Compare the shape of that last output to Check 3 on Windows — **the technique is identical, only the syntax differs.** Noticing that is the point of the exercise.

#### Check 5 — Prove the permission model

Inside your VM, create a file and change who can touch it:

```bash
cd /tmp
touch permtest.txt
ls -l permtest.txt                      # note owner, group, others triads
chmod 640 permtest.txt                  # owner rw, group r, others nothing
ls -l permtest.txt                      # confirm the triads changed as predicted
sudo adduser demo                        # create a second user (if not present)
su - demo -c 'cat /tmp/permtest.txt'    # as someone else: should be denied
```

Expected: the `su - demo -c 'cat /tmp/permtest.txt'` command fails with "Permission denied". **Then answer: which triad applied to `demo`, and why?** If you can answer that without looking anything up, you have understood the model.

### Part 11 — Two worked tickets

Two tickets at operating-system level, worked the way a first-line technician works them. The reasoning is the content; the specific fixes are almost incidental.

#### Ticket 1 — "My computer is fine in the morning and unusable by the afternoon"

**What the user said:**

> "Every day it starts out fine and by about 3pm everything is crawling and I have to restart. It's been like this for two weeks. I've tried restarting more often but it's getting worse."

**What you ask.**

The reported shape — predictable, gradual, fixed by restart — is a strong clue, and you confirm it rather than assume it:

1. "Does restarting actually fix it, and for how long?"
2. "Is it every application, or mainly one — a browser, maybe?"
3. "Does anything specific seem to set it off?"
4. "How much RAM does the machine have?"

The user answers: restarting fixes it for a few hours; it is worst in the browser but eventually everything; nothing specific; and the machine has 8 GB, though "IT said it was enough when I started".

**What you observe.**

The pattern — degrades over hours, fixed by restart, worse over time — points at resource accumulation rather than a fault. You take two readings of the top processes fifteen minutes apart:

```powershell
Get-Process | Sort-Object WS -Descending |
  Select-Object -First 6 Name, Id,
  @{N='MemMB';E={[math]::Round($_.WS/1MB,0)}}, HandleCount
```

First reading:

```text
Name       Id  MemMB HandleCount
----       --  ----- -----------
chrome   8214   2410       3120
Teams    6108    740       1620
```

Fifteen minutes later:

```text
Name       Id  MemMB HandleCount
----       --  ----- -----------
chrome   8214   3180       4188
Teams    6108    795       1706
```

Chrome has grown by 770 MB and over a thousand handles in fifteen minutes while the user was doing ordinary browsing. That is a **leak**, and it is the answer to the ticket. You confirm the machine is genuinely short of memory at the same time:

```powershell
Get-CimInstance Win32_OperatingSystem |
  Select-Object @{N='TotalGB';E={[math]::Round($_.TotalVisibleMemorySize/1MB,1)}},
                @{N='FreeGB';E={[math]::Round($_.FreePhysicalMemory/1MB,1)}}
```

```text
TotalGB FreeGB
------- ------
    7.9    0.6
```

0.6 GB free on a 7.9 GB machine. The machine is not broken; it is full.

**What you do.**

You resist the temptation to declare "you need more RAM" and stop. That is a real answer but an expensive one, and it may not be the right one. Instead:

1. **Identify the cause before spending money.** Chrome grew 770 MB in fifteen minutes. That is abnormal, and the usual cause is extensions — a leaked extension or a corrupted profile grows without bound, while a healthy browser releases memory when tabs close.
2. **Test the hypothesis cheaply.** Ask the user to run for a day in a private window with extensions disabled, or disable extensions one at a time. If the growth stops, you have found it without buying anything. This is the professional move: a free test before a paid fix.
3. **Reduce the baseline while you are there.** Check startup programs and open tabs. On a 7.9 GB machine, every background application is competing for a scarce resource.
4. **Recommend more RAM only if it is genuinely warranted.** 8 GB is the floor for modern work; if this user runs Teams, a browser, and Office all day, 16 GB is the honest long-term answer. Say so — but say it *after* ruling out the leak, not instead of.

**How you verify.**

Not "is it faster?" — that invites a yes. You ask them to work a normal day and report at the end of it:

> "Could you use it as normal tomorrow and message me at the end of the day with how it felt at 3pm — specifically whether you still needed to restart?"

The user reports no forced restart for the first time in two weeks, and free memory at end of day is 2.1 GB instead of 0.6 GB. That is evidence, not sentiment.

**Final ticket note.**

> **Reported:** Machine degrades predictably over the working day, unusable by mid-afternoon, fixed temporarily by restart. Worsening over two weeks. 8 GB RAM.
> **Changed recently:** Nothing reported; gradual onset.
> **Observed:** Two `Get-Process` readings 15 minutes apart showed chrome growing from 2410 MB / 3120 handles to 3180 MB / 4188 handles during ordinary browsing — a sustained monotonic increase. Free physical memory 0.6 GB of 7.9 GB. No errors in the System log correlating with the slowdown; no stopped automatic services.
> **Action:** Identified the leak rather than assuming insufficient RAM. Had the user run a day with browser extensions disabled; growth stopped, confirming a faulty or leaked extension. Removed the offending extension and restarted the browser. Also reviewed startup programs and reduced the baseline load.
> **Verified:** User worked a full day without a forced restart, reporting no 3pm slowdown. Free memory at end of day measured at 2.1 GB.
> **Cause:** A browser extension leaking memory and handles. The machine had adequate RAM for its workload; adding RAM would have masked the fault for a few months and then recurred.
> **For the next agent:** If the slowdown returns, repeat the two-reading check before recommending hardware. 8 GB remains the floor for this workload — a 16 GB upgrade is defensible if the user's application set grows, but document the leak check first so the same fault is not paid for twice.

**Reasoning to take away:** The *shape* of a symptom is diagnostic. "Gradual, predictable, fixed by restart, worsening" is a resource-accumulation signature, and it is different from "sudden, constant, unaffected by restart", which points at a configuration or hardware fault. Take two readings rather than one, because a single snapshot cannot show you a trend — and a trend is the whole diagnosis here.

#### Ticket 2 — "My files are gone" (they are not)

**What the user said:**

> "All my files in the shared drive are gone. I opened it this morning and the folder is empty. I did not delete anything. This is urgent, I have a deadline."

**What you ask.**

An "everything is gone" report has a short list of explanations, and almost none of them involve data loss. You work through them by question:

1. "Are you on the same computer you normally use, or a different one?"
2. "Can anyone else see the files right now?"
3. "Does the folder say it is empty, or does it say you do not have access?"
4. "Did anything change — a password reset, a laptop swap, working from home today?"

The user answers: same computer; a colleague can see everything; the folder opens but shows nothing; and — after a pause — "oh, I was told to change my password yesterday because it was expiring."

That last sentence is the answer. A **password change** plus **an empty folder that opens normally** plus **others can still see the files** is a permissions problem, not a data-loss problem.

**What you observe.**

The distinction in question 3 is the important one, and it is exactly the distinction Part 9 taught on the Linux side: "denied" and "empty" are different errors. The user has access to the share itself but not to the contents, which means the share-level permission is intact and the **file-level** permission is not.

You check group membership:

```powershell
whoami /groups
```

```text
GROUP INFORMATION
-----------------
Group Name                          Type
=================================== ================
CORP\Domain Users                   Group
BUILTIN\Users                       Alias
```

The token on this machine does not carry `Finance-ReadWrite` at all: it is a **cached token from before the password change**, and the new membership has not reached the session.

**Ticket 2 is a domain scenario** — it is the shape of problem you meet on the job, not something you can reproduce on a home PC. The command below needs the RSAT Active Directory module and a domain-joined machine, so read it as an illustration of how the check is made rather than something to run tonight. The technique is to compare the machine's cached view against the server's authoritative one:

```powershell
# What groups does the account actually hold, per the domain?
Get-ADPrincipalGroupMembership jsmith | Select-Object Name
```

```text
Name
----
Domain Users
Finance-ReadWrite
Finance-All
```

The account *does* hold `Finance-ReadWrite`. The machine the user is sitting at is using a stale token. That is the diagnosis: **the session's token was built at an earlier logon and still carries the group list from that moment, so the change the domain already knows about has not reached this session.** The password change is what surfaced it — a fresh sign-in is what resolves it.

**What you do.**

The fix is small, and almost insultingly so given the panic:

1. **Reassure immediately and specifically.** "Your files are safe — I can see them from here, and your colleague can too. This is a permissions refresh, not data loss." The user has been panicking for however long; that sentence is part of the job.
2. **Refresh the session.** Sign out and sign back in — not just lock and unlock, which reuses the existing token. In most cases this alone resolves it.
3. **If it does not, force the group membership to refresh** by having the user reconnect to the share after the new logon.
4. **Confirm the data was never at risk** by checking with the user that the files are visible, and by confirming from your side.

**How you verify.**

You ask the user to do the thing that was actually broken — open a specific known file, not just "look at the folder":

> "Could you open the Q3 budget file — the one you needed for the deadline — and confirm it opens?"

They do, and it does. You also confirm they can save, because read access and write access are separate permissions and a half-fix is worse than none.

**Final ticket note.**

> **Reported:** User reported all files in the Finance shared drive "gone"; folder opened but appeared empty; urgent deadline. User initially stated nothing had changed.
> **Changed recently:** On further questioning, the user's domain password was changed the previous day on expiry.
> **Observed:** Other users could access the same share normally, ruling out server-side or data loss. The folder opened without an access-denied error, so share-level permission was intact. `whoami /groups` on the user's machine showed a cached token; `Get-ADPrincipalGroupMembership` confirmed the account does hold `Finance-ReadWrite` and `Finance-All` on the domain side.
> **Action:** Explained that no data was lost and confirmed the files were present server-side. Had the user sign out fully and sign back in to obtain a fresh token — a lock/unlock cycle would not have been sufficient. Confirmed the new session held the correct group memberships.
> **Verified:** User opened the specific file required for their deadline and confirmed read access; also confirmed they could save to the share, since write is a separate permission.
> **Cause:** Stale session token predating the password change. The account was correct on the domain; the user's session had not refreshed.
> **For the next agent:** A password change followed by an apparently empty share is a recurring pattern in this organisation. If it recurs for this user without a password change, check group membership directly rather than assuming a token problem. No permissions were changed and none needed to be — do not adjust ACLs for this symptom.

**Reasoning to take away:** "Everything is gone" is very rarely data loss. The fast questions — can anyone else see it, does it say denied or empty, what changed — split the problem before you touch anything. And the user's casual afterthought ("oh, I changed my password") is frequently the actual cause; ask twice when the first answer is "nothing changed".

### Part 12 — Preventing the next ticket

First-line support has a reactive half and a proactive half. Everything so far has been reactive: something broke, you diagnosed it. This part is the habit that makes you visibly better than your peers, and it costs nothing.

**After you fix something, ask what would have prevented it.** Not philosophically — concretely:

- A drive filled up → *what would have caught that earlier?* A free-space check, or the stopped-service scan you already know. Tell the user what to watch for.
- A service silently died weeks ago → *why did nobody notice?* That is the `Automatic` + `Stopped` check from Part 8, and it is worth running on every machine you touch for any reason.
- A password change broke access → *how would the user know this is normal?* One sentence of explanation saves the next ticket entirely.
- A browser extension leaked memory → *what else is installed that nobody reviewed?* Extensions, startup programs, and scheduled tasks are the three places unwanted software hides.

**Write the prevention into the ticket.** One line at the end — "recommend a DHCP reservation for this printer", "advise Storage Sense for temp files", "this machine needs a RAM review if workload grows" — converts a closed ticket into an improved environment. It takes seconds and it is the single clearest signal that you understand the job rather than the tool.

**Do the free checks on every machine you touch.** Three commands, under a minute total:

```powershell
# 1. Free space
Get-Volume | Where-Object DriveLetter |
  Select-Object DriveLetter, @{N='FreePct';E={[math]::Round(100*$_.SizeRemaining/$_.Size,1)}}

# 2. Services that should be running and are not
Get-Service | Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped' } |
  Select-Object Name, DisplayName

# 3. The top recurring errors this week
Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddDays(-7)} |
  Group-Object ProviderName, Id | Sort-Object Count -Descending | Select-Object -First 5 Count, Name
```

You will find something on a meaningful share of machines. Fixing what you find — or logging it — is how a junior technician becomes the person whose machines do not generate repeat tickets.

### Part 13 — Self-check

Answer these without looking. If you cannot, go back to the relevant part.

1. Name the five jobs of an operating system, and give one support symptom for each.
2. A user says "the internet is down". Which two `ping` commands distinguish a connectivity failure from a DNS failure?
3. What is the difference between `apt update` and `apt upgrade`?
4. Decode `-rw-r--r--`. Who can write to the file?
5. A service is set to Automatic but shows as Stopped. Why does that matter?
6. What does Event ID 41, Kernel-Power tell you — and what does it *not* tell you?
7. Why should you take a VM snapshot immediately after installation?
8. What is the difference between "permission denied" and "no such file or directory"?
9. Why is `rm` more dangerous than deleting a file in Windows?
10. If a user cannot access a shared folder, which two things do you check, and in what order?
11. Why can a single reading of a process's memory usage never prove a leak, and what do you do instead?
12. A machine degrades predictably over the working day and is fixed by a restart, while another fails suddenly and constantly. What does each pattern suggest?
13. Name the three event levels that matter at this level, and explain why you should not react to a single error.
14. What does it mean when a Linux process shows a state of `D`, and why is that a storage clue rather than a CPU one?
15. A user reports a shared folder that opens but appears empty. List the three questions that resolve it fastest.
16. Why is adding a user to a group better than changing a file's permissions, even when both would fix the symptom?

If you can answer these, you can hold a conversation about operating systems with a hiring manager — which is the actual bar for this phase.

### Part 14 — Key takeaways

- **An operating system does five jobs** — process, memory, storage, device, and user management — and every support symptom maps to one of them. Name the job and you have narrowed the search.
- **Read the trend, not the snapshot.** One reading of memory or handles tells you almost nothing; two readings a few minutes apart reveal a leak, and a leak is invisible in a single measurement.
- **Status and StartType are different questions.** A service that is `Automatic` and `Stopped` is a fault nobody has reported. That query is the highest-value minute in routine support.
- **Every healthy machine has hundreds of log errors.** What matters is repetition and correlation: group by provider and ID, rank by count, and read the top of the list.
- **The technique transfers even when the syntax does not.** Grouping Windows events by provider and ID is the same skill as counting Linux journal errors by process. Learn the reasoning once and you can apply it to an unfamiliar system.
- **"Denied" and "empty" are different failures.** Reading the exact error, rather than the user's summary of it, is often the whole diagnosis.
- **Fix the group membership, not the file.** Adding a user to a group is reversible and auditable; `chmod 777` is neither, and it is how access control degrades across an organisation.
- **Check before you spend.** A free test that isolates a leak beats a RAM upgrade that masks it. Recommend hardware after you have ruled out software, not instead of.
- **"Everything is gone" is rarely data loss.** Can anyone else see it? Does it say denied or empty? What changed? Those three questions resolve most of these tickets before you touch anything.
- **Always ask what changed — and ask twice.** The user's casual afterthought is frequently the cause; "nothing changed" is a first answer, not a final one.
- **Afterwards, ask what would have prevented it.** One prevention line in the ticket turns a closed ticket into an improved environment.

### Part 15 — Practice this next

The lesson is the reasoning; the tasks below are the doing.

1. **Run Part 10's five checks** on your own machine and in your VM, and record the output of each. This is deliverable material.
2. **Take two process readings fifteen minutes apart** and decide, in writing, whether you are looking at normal fluctuation or a leak. Say which evidence supports your conclusion.
3. **Hunt stopped-automatic services**, then look up what each one does before touching it. Write one sentence per service explaining whether it matters.
4. **Group your event log by provider and ID**, and write the top three results in plain English as if for a ticket note. This is directly reusable in an interview answer.
5. **Break and fix your VM.** Stop a service, break a file permission, fill a filesystem, then diagnose each using only the tools in this lesson. Reset from your snapshot afterwards.
6. **Then work the two tickets in Part 11 on paper.** Cover the solution, read only what the user said, and write down what you would ask and check first. Compare your reasoning to the ticket's. This is the most useful exercise in the phase.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| VirtualBox | Runs virtual machines | Free | https://www.virtualbox.org/ | Install Ubuntu VM | VMware Workstation Player personal use |
| Ubuntu Desktop/Server | Linux operating system | Free | https://ubuntu.com/download | Create user, install package, inspect logs | Debian |
| Windows Event Viewer | Reads Windows logs | Free, built-in | https://learn.microsoft.com/windows | Find last error/warning and summarize it | PowerShell Get-EventLog |
| PowerShell | Windows automation shell | Free, built-in | https://learn.microsoft.com/powershell/ | List services and export to text | Command Prompt |
| Sysinternals Process Explorer | Advanced process viewer | Free | https://learn.microsoft.com/sysinternals/ | Find parent/child process relationship | Task Manager |
| Windows Terminal | Terminal app | Free | https://github.com/microsoft/terminal | Open PowerShell and CMD tabs | Built-in console |

## Free/cheap resources

- Microsoft Windows documentation — https://learn.microsoft.com/en-us/windows/
- Microsoft PowerShell docs — https://learn.microsoft.com/en-us/powershell/
- Linux Journey — https://linuxjourney.com/
- Ubuntu tutorials — https://ubuntu.com/tutorials
- OverTheWire Bandit — https://overthewire.org/wargames/bandit/

## Hands-on practice tasks

1. Install VirtualBox and Ubuntu VM. <!-- id: it-02-t01 band: deep energy: normal -->
2. Create one standard user and one admin/sudo user in Linux. <!-- id: it-02-t02 band: focused energy: normal -->
3. In Windows, open Event Viewer and identify 3 warnings/errors. <!-- id: it-02-t03 band: focused energy: normal -->
4. Use `ipconfig`, `ping`, `nslookup`, and `tracert` on Windows. <!-- id: it-02-t04 band: focused energy: normal -->
5. Use `ls`, `grep`, `chmod`, `systemctl`, and `journalctl` on Linux. <!-- id: it-02-t05 band: focused energy: normal -->
6. Disable and re-enable a harmless startup app in Windows. <!-- id: it-02-t06 band: quick energy: low -->
7. Export a list of running services using PowerShell. <!-- id: it-02-t07 band: quick energy: low -->
8. Find a service with dependents and write down what would stop if you stopped it. <!-- id: it-02-t08 band: focused energy: normal -->
9. Diagnose a slow login: open Task Manager → Startup apps, record every High-impact entry, and disable them one at a time, measuring after each restart. <!-- id: it-02-t09 band: deep energy: normal -->
10. Create a shared folder in your VM, set the share permission to allow change and the NTFS permission to read only, then prove that the more restrictive layer wins by trying to save a file. <!-- id: it-02-t10 band: deep energy: normal -->
11. In your VM, create a system restore point, install something harmless, restore the point, and record what came back and what did not. <!-- id: it-02-t11 band: focused energy: normal -->
12. Explain, in writing, why a machine with no restore points cannot be fixed by a system restore — and what you would check on a new machine to prevent that. <!-- id: it-02-t12 band: quick energy: low -->

## Deliverable / proof of work

Create `portfolio/it/02-operating-systems.md` containing:

- **Screenshots:** Ubuntu VM setup and user creation, plus Task Manager and Event Viewer from Windows.
- **Command guides:** 20 Windows commands with explanations (for example `ipconfig`, `ping`, `sfc /scannow`, `chkdsk`, `net user`) and 20 Linux commands with explanations (for example `ls`, `cd`, `chmod`, `chown`, `systemctl`, `journalctl`).
- **Troubleshooting summaries:** 3 Event Viewer findings explained in plain language, plus your steps for three common issues — slow performance, login problems, and driver problems.
- **Log analysis:** What you found in `/var/log/auth.log` and `/var/log/syslog`, and how you used `journalctl` to read system logs.
- **Boot and login diagnosis:** What you found in Task Manager → Startup apps, which entries you disabled, and what changed after each restart. Include the registry `Run` keys you checked and what was in them.
- **A permissions write-up:** Your shared-folder experiment — the share permission, the NTFS permission, which one won, and why. This is a strong interview artefact because it is the exact question a first-line interviewer asks.
- **A recovery write-up:** What a system restore point did and did not bring back in your VM, and your one-paragraph answer to "the user's profile did not load — what do you do, and in what order?"

## Quiz

Ten questions on the material in this phase. Each has one correct answer and a short explanation — read the explanation even when you get it right, because it usually names the mistake the wrong answers represent.

Part 13 asked you to *recall* these answers from nothing. This asks you to *recognise* the right one among plausible alternatives, which is the same knowledge tested the way an interview or a ticket will test it.

### Q1. A user can read a file but cannot save changes to it. What is the single most likely cause? <!-- id: it-02-q01 energy: normal -->

- [x] The file is on a share where the share permission allows Read but NTFS allows Change
- [ ] The file is marked read-only in Windows Explorer
- [ ] The user's account is a standard user rather than an administrator
- [ ] The disk is full

**Why:** Read succeeds, write fails — that split points at a permission layer that grants reading and denies writing, and on a share there are two layers. The more restrictive one wins, so a permissive share still loses to a Read-only NTFS entry. "Read-only attribute" is the tempting distractor, but it produces a different message and is rare on a share; a standard user can usually write to their own files; and a full disk fails writes everywhere, not just here.

### Q2. A service is set to Automatic, and it shows as Stopped. What does this tell you? <!-- id: it-02-q02 energy: normal -->

- [ ] Nothing — Automatic services are stopped until a user logs in
- [ ] The start type was changed but not saved
- [ ] The service has been disabled by Group Policy
- [x] It should have started and did not, so there is a real failure to investigate

**Why:** Automatic means "start at boot". Stopped means it tried and failed — so there is a cause, and Event Viewer or the service's own log will have it. An Automatic service that is stopped is a symptom, not a setting; the setting is what makes the stopped state meaningful.

### Q3. Why is a service that keeps stopping usually a symptom rather than the fault? <!-- id: it-02-q03 energy: normal -->

- [x] Because it often depends on something else that is failing, and you are seeing the consequence
- [ ] Because services are restarted automatically by Windows
- [ ] Because stopping is how a service reports an error
- [ ] Because service logs are unreliable

**Why:** Dependencies run one way — a service needs others running first. If the thing it depends on is broken, the dependent service crashes or refuses to start, and it is the one you notice. Restarting the visible service fixes nothing; the fault is upstream.

### Q4. Which command tells you whether a failure is connectivity or DNS? <!-- id: it-02-q04 energy: normal -->

- [ ] `ipconfig /all`
- [x] `ping` by IP address, then `ping` by name
- [ ] `nslookup` alone
- [ ] `tracert` to the default gateway

**Why:** Pinging an IP address skips name resolution entirely. If the IP responds but the name does not, connectivity is fine and DNS is the fault. If neither responds, you have a connectivity problem and DNS is not yet worth testing.

### Q5. You take a VM snapshot *before* installing anything. Why does the order matter? <!-- id: it-02-q05 energy: low -->

- [ ] Snapshots are faster on a clean install
- [ ] It is a convention with no technical basis
- [ ] Windows requires an activated snapshot to restore
- [x] A snapshot captures the state at that moment, so a clean snapshot is one you can always return to

**Why:** A snapshot is a point you can return to, not a backup of your work. Taking one after the install means your "clean" fallback already contains whatever you installed — including the thing you are about to break. The clean state is only available if you captured it while it was clean.

### Q6. A user's desktop is empty and their documents are missing, but their password was accepted. What is the most likely explanation? <!-- id: it-02-q06 energy: normal -->

- [x] Their profile failed to load and Windows gave them a temporary one
- [ ] Their files were deleted by malware
- [ ] They logged in with the wrong account
- [ ] The disk has failed

**Why:** Successful authentication plus an unfamiliar desktop is the signature of a temporary profile. The files are usually still in the real profile folder — which is exactly why the first action is to copy data out, not to delete the broken profile.

### Q7. Before deleting a corrupted user profile, what must you do first? <!-- id: it-02-q07 energy: normal -->

- [ ] Restart the machine twice
- [ ] Remove the machine from the domain
- [x] Copy the user's data out of the profile folder
- [ ] Run `sfc /scannow`

**Why:** The profile folder still holds the user's files even when the desktop does not show them, and deleting the profile destroys them. This is the step people skip because the empty desktop looks like the data is already gone.

### Q8. `-rw-r--r--` — who can write to this file? <!-- id: it-02-q08 energy: normal -->

- [ ] Everyone
- [x] Only the owner
- [ ] The owner and the group
- [ ] Nobody

**Why:** The three triplets are owner, group, other. `rw-` gives the owner read and write; `r--` gives the group read only; `r--` gives everyone else read only. One `w` in the whole string, in the owner's triplet.

### Q9. A user cannot reach a shared folder. Which do you check first? <!-- id: it-02-q09 energy: normal -->

- [ ] Whether the file is corrupted
- [x] The NTFS permissions, then the share permissions
- [ ] Whether the network cable is connected
- [ ] Whether the user's password has expired

**Why:** There are two permission layers and the more restrictive wins. Checking only the share permission is the classic error — it can report Full Control while NTFS denies everything. The sharing tab is the one people look at, which is precisely why it misleads.

### Q10. A machine gets slower through the day and a restart fixes it. What does that pattern suggest? <!-- id: it-02-q10 energy: normal -->

- [ ] Failing hardware
- [ ] A malware infection
- [ ] A failing disk
- [x] Something accumulating — a leak, a filling log, or a growing process

**Why:** Gradual degradation that a restart clears is the shape of accumulation, not failure. Failing hardware and malware tend to be erratic rather than predictable. The pattern is the diagnosis: what grows over a working day, and what does a restart reset?

## Checklist

- [ ] I installed a Linux VM. <!-- id: it-02-c01 energy: normal -->
- [ ] I can navigate Windows system tools. <!-- id: it-02-c02 energy: normal -->
- [ ] I can explain admin vs standard user. <!-- id: it-02-c03 energy: low -->
- [ ] I can use 20 basic Windows commands. <!-- id: it-02-c04 energy: normal -->
- [ ] I can use 20 basic Linux commands. <!-- id: it-02-c05 energy: normal -->
- [ ] I can check logs in Windows and Linux. <!-- id: it-02-c06 energy: normal -->
- [ ] I can install/update software safely. <!-- id: it-02-c07 energy: normal -->
- [ ] I can diagnose a slow boot or slow login and explain startup apps versus services. <!-- id: it-02-c08 energy: normal -->
- [ ] I can explain why a service stopped, including what depends on it. <!-- id: it-02-c09 energy: normal -->
- [ ] I can explain share permissions versus NTFS permissions, and which one wins. <!-- id: it-02-c10 energy: normal -->
- [ ] I can roll back a bad update, and I know what a system restore does not cover. <!-- id: it-02-c11 energy: normal -->
- [ ] I know what to do — and what never to do — when a user profile fails to load. <!-- id: it-02-c12 energy: normal -->

## You're ready to move on when...

You can troubleshoot a basic Windows issue and a basic Linux issue without following every step blindly.

## Free vs Paid

### What's free and enough

VirtualBox, Ubuntu, Windows built-in tools, PowerShell, and Microsoft/Linux docs are enough.

### What's paid and why you'd upgrade

Paid VM tools like VMware Workstation Pro offer advanced features, but they are unnecessary here.

### When it's worth paying

Not worth paying in this phase.