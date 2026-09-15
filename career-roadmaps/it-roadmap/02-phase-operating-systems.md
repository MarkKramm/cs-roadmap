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

**Time to complete:** 4–6 hours, spread over the phase. The Linux half requires installing a virtual machine, which is itself one of the phase's deliverables — treat that as part of the lesson.

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

**Windows** is commercial, GUI-first, and dominant in business. Its defining features for a support technician are the Start menu, Settings versus Control Panel (both exist, and you need both), the registry, Windows Update, Active Directory in corporate environments, and an enormous library of built-in administrative tools. It is closed source, and it deliberately hides complexity behind friendly screens — which is why so many fixes require you to go behind those screens.

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
Get-EventLog -LogName System -Newest 20
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

# 6. Recent service errors
journalctl -p err -b --no-pager | tail -30
```

Expected: your username, your UID and groups, kernel and distribution details, uptime, a list of login-capable accounts, disk and memory usage, any failed logins, and recent errors.

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
| Access denied to a folder | NTFS permissions or Linux mode bits | Check group membership; `icacls` or `ls -l` |
| Printer disappeared | Print Spooler service, then driver | Restart the spooler; reinstall the driver |
| No sound | Audio service and the output device | Check the default device; restart the audio service |
| Wi-Fi missing | Adapter driver | Device Manager status; reinstall the vendor driver |
| Windows Update fails | Component store corruption | `DISM /RestoreHealth`, then `sfc /scannow` |
| Service will not start | Its own log entries | `systemctl status` or Event Viewer; read the stated reason |
| Disk full | `Get-Volume` or `df -h` | Disk Cleanup, temp files, old update files, logs |
| Application crashes repeatedly | Application log, plus its AppData `Local` folder | Reset the app's profile; check for updates |
| VM will not start | Host RAM or virtualisation disabled | Reduce VM RAM; enable VT-x/AMD-V in firmware |
| Forgot a Linux password | Single-user recovery | Boot to recovery, reset from the root shell |

Notice the pattern in the "where to look first" column: **it is always a log, a status, or a resource reading.** Guessing is what people do when they do not know where the evidence lives. Your job is to always know where the evidence lives.

### Part 8 — Self-check

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

If you can answer these, you can hold a conversation about operating systems with a hiring manager — which is the actual bar for this phase.

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

1. Install VirtualBox and Ubuntu VM.
2. Create one standard user and one admin/sudo user in Linux.
3. In Windows, open Event Viewer and identify 3 warnings/errors.
4. Use `ipconfig`, `ping`, `nslookup`, and `tracert` on Windows.
5. Use `ls`, `grep`, `chmod`, `systemctl`, and `journalctl` on Linux.
6. Disable and re-enable a harmless startup app in Windows.
7. Export a list of running services using PowerShell.

## Deliverable / proof of work

Create `portfolio/it/02-operating-systems.md` containing:

- **Screenshots:** Ubuntu VM setup and user creation, plus Task Manager and Event Viewer from Windows.
- **Command guides:** 20 Windows commands with explanations (for example `ipconfig`, `ping`, `sfc /scannow`, `chkdsk`, `net user`) and 20 Linux commands with explanations (for example `ls`, `cd`, `chmod`, `chown`, `systemctl`, `journalctl`).
- **Troubleshooting summaries:** 3 Event Viewer findings explained in plain language, plus your steps for three common issues — slow performance, login problems, and driver problems.
- **Log analysis:** What you found in `/var/log/auth.log` and `/var/log/syslog`, and how you used `journalctl` to read system logs.

## Checklist

- [ ] I installed a Linux VM. <!-- id: it-02-c01 energy: normal -->
- [ ] I can navigate Windows system tools. <!-- id: it-02-c02 energy: normal -->
- [ ] I can explain admin vs standard user. <!-- id: it-02-c03 energy: low -->
- [ ] I can use 20 basic Windows commands. <!-- id: it-02-c04 energy: normal -->
- [ ] I can use 20 basic Linux commands. <!-- id: it-02-c05 energy: normal -->
- [ ] I can check logs in Windows and Linux. <!-- id: it-02-c06 energy: normal -->
- [ ] I can install/update software safely. <!-- id: it-02-c07 energy: normal -->

## You're ready to move on when...

You can troubleshoot a basic Windows issue and a basic Linux issue without following every step blindly.

## Free vs Paid

### What's free and enough

VirtualBox, Ubuntu, Windows built-in tools, PowerShell, and Microsoft/Linux docs are enough.

### What's paid and why you'd upgrade

Paid VM tools like VMware Workstation Pro offer advanced features, but they are unnecessary here.

### When it's worth paying

Not worth paying in this phase.
4. Use `ipconfig`, `ping`, `nslookup`, and `tracert` on Windows.
5. Use `ls`, `grep`, `chmod`, `systemctl`, and `journalctl` on Linux.
6. Disable and re-enable a harmless startup app in Windows.
7. Export a list of running services using PowerShell.