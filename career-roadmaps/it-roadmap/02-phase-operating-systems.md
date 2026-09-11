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

- Navigate Windows settings, Control Panel, Task Manager, Device Manager, Event Viewer, Services, Disk Management, and command line.
- Use basic PowerShell and Command Prompt commands.
- Install and use a Linux VM.
- Use Linux commands for files, permissions, processes, packages, services, and logs.
- Understand users, groups, permissions, updates, drivers, startup apps, and services.

## Specific topics to learn

### Windows

- Filesystem: `C:\`, user profiles, Program Files, AppData
- Users: local user, Microsoft account, admin vs standard user
- Permissions: read/write/execute concept, UAC
- Updates: Windows Update, driver updates, rollback basics
- Tools: Task Manager, Event Viewer, Device Manager, Services, Disk Management
- Commands: `ipconfig`, `ping`, `tracert`, `nslookup`, `net user`, `sfc /scannow`, `chkdsk`, `systeminfo`
- PowerShell basics: `Get-Process`, `Get-Service`, `Get-EventLog`, `Get-ChildItem`, `Copy-Item`

### Linux

- Filesystem: `/`, `/home`, `/etc`, `/var/log`, `/tmp`
- Commands: `pwd`, `ls`, `cd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`, `grep`, `find`, `chmod`, `chown`, `sudo`
- Users/groups: `adduser`, `passwd`, `groups`
- Packages: `apt update`, `apt install`
- Processes/services: `ps`, `top`, `systemctl`
- Logs: `/var/log/auth.log`, `/var/log/syslog` or `journalctl`

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

Create `portfolio/it/02-operating-systems.md` with:

- Screenshots of Ubuntu VM
- 20 Windows commands with explanations
- 20 Linux commands with explanations
- 3 Event Viewer findings explained in simple language

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
