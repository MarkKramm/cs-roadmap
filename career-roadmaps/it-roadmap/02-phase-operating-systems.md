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

## Lesson: Operating Systems

### Introduction

Operating systems (OS) are the core software that manage hardware and software resources, provide a user interface, and enable applications to run. In this lesson, you'll learn about **Windows** and **Linux**, two of the most widely used operating systems in IT support.

### Key Concepts

- **Windows:** User-friendly, widely used in businesses and homes.
- **Linux:** Open-source, highly customizable, and used in servers, cloud computing, and embedded systems.

## Estimated time

**3 weeks**. Windows: 1.5 weeks. Linux: 1 week. Buffer/review: 0.5 week.

## Skills you'll gain

- Navigate Windows settings, Control Panel, Task Manager, Device Manager, Event Viewer, Services, Disk Management, and command line.
- Use basic PowerShell and Command Prompt commands.
- Install and use a Linux VM.
- Use Linux commands for files, permissions, processes, packages, services, and logs.
- Understand users, groups, permissions, updates, drivers, startup apps, and services.

### Step-by-Step Breakdown

#### Windows Operating System

**1. Filesystem and Navigation:**
- **`C:\`:** Primary drive where the OS and programs are installed.
- **User Profiles:** Each user has a profile folder (e.g., `C:\Users\YourName`).
- **Program Files:** Directory for installed applications (e.g., `C:\Program Files`).
- **AppData:** Stores application settings and data (e.g., `C:\Users\YourName\AppData`).

**2. Users and Permissions:**
- **Local User:** User created directly on the computer.
- **Microsoft Account:** User linked to Microsoft services.
- **Admin vs Standard User:** Admins have full control; standard users have limited permissions.
- **UAC (User Account Control):** Security feature that prompts for admin confirmation.

## Specific topics to learn

#### 3. Updates and Maintenance

- **Windows Update:** Keeps the OS up-to-date with security patches and features.
- **Driver Updates:** Ensures hardware compatibility and performance.
- **Rollback Basics:** Reverting to a previous version if an update causes issues.

#### 4. Tools and Commands

- **Task Manager:** Monitors processes, CPU, memory, and disk usage.
- **Event Viewer:** Logs system events, errors, and warnings.
- **Device Manager:** Manages hardware drivers and devices.
- **Services:** Manages background processes and services.
- **Disk Management:** Manages disk partitions and volumes.

**Basic Commands:**
- `ipconfig`: Displays network configuration.
- `ping`: Tests network connectivity.
- `tracert`: Traces the route packets take to reach a destination.
- `nslookup`: Queries DNS to find IP addresses.
- `net user`: Manages user accounts.
- `sfc /scannow`: Checks and repairs system files.
- `chkdsk`: Checks disk for errors.
- `systeminfo`: Displays detailed system information.

**PowerShell Basics:**
- `Get-Process`: Lists running processes.
- `Get-Service`: Lists running services.
- `Get-EventLog`: Retrieves event logs.
- `Get-ChildItem`: Lists files and directories.
- `Copy-Item`: Copies files.

#### Linux Operating System

**1. Filesystem Structure:**
- **`/` (Root):** The top-level directory.
- **`/home`:** User home directories.
- **`/etc`:** Configuration files.
- **`/var/log`:** System logs.
- **`/tmp`:** Temporary files.

**2. Users and Groups:**
- **User Management:** Commands like `adduser`, `passwd`, and `groups`.
- **Permissions:** Commands like `chmod` and `chown` to manage file permissions.

**3. Packages and Software Management:**
- **`apt update`:** Updates package lists.
- **`apt install`:** Installs software packages.

**4. Processes and Services:**
- **`ps`:** Lists running processes.
- **`top`:** Monitors system processes and resource usage.
- **`systemctl`:** Manages services.

**5. Logs:**
- **`/var/log/auth.log`:** Authentication logs.
- **`/var/log/syslog`:** System logs.
- **`journalctl`:** Queries systemd journal logs.

**Basic Commands:**
- `pwd`: Shows current working directory.
- `ls`: Lists directory contents.
- `cd`: Changes directory.
- `cat`: Displays file contents.
- `less`: Views file contents page by page.
- `cp`: Copies files.
- `mv`: Moves or renames files.
- `rm`: Removes files.
- `mkdir`: Creates directories.
- `grep`: Searches for patterns in files.
- `find`: Locates files based on criteria.
- `chmod`: Changes file permissions.
- `chown`: Changes file ownership.
- `sudo`: Runs commands as superuser.

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

### Hands-On Tasks

#### Windows Tasks
1. **Navigate Windows Settings:**
   - Open Control Panel and explore different categories.
   - Use Task Manager to monitor running processes.

2. **User Management:**
   - Create a new local user and a Microsoft account.
   - Explain the difference between admin and standard users.

3. **Event Viewer:**
   - Open Event Viewer and identify the last 3 warnings/errors.
   - Summarize each event in simple language.

4. **Command Line Practice:**
   - Use `ipconfig`, `ping`, `nslookup`, and `tracert` to troubleshoot network connectivity.
   - Use PowerShell to list services and export the list to a text file.

5. **Troubleshooting:**
   - Disable and re-enable a harmless startup app in Windows.
   - Use `sfc /scannow` to check for and repair system file corruption.

#### Linux Tasks
1. **Install and Configure Ubuntu VM:**
   - Install VirtualBox and set up an Ubuntu VM.
   - Create a standard user and an admin/sudo user.

2. **Basic Commands:**
   - Navigate the filesystem using `ls`, `cd`, and `pwd`.
   - Use `grep` to search for specific patterns in log files.
   - Manage permissions with `chmod` and `chown`.

3. **Package Management:**
   - Update the package list with `apt update`.
   - Install a package (e.g., `nano`) with `apt install`.

4. **Process and Service Management:**
   - Use `ps` and `top` to monitor processes.
   - Use `systemctl` to start, stop, and enable services.

5. **Logs:**
   - Inspect `/var/log/auth.log` and `/var/log/syslog`.
   - Use `journalctl` to view system logs.

### Troubleshooting Common Issues

#### Windows
- **Slow Performance:**
  - Check Task Manager for resource-heavy processes.
  - Use `sfc /scannow` to repair system files.

- **Login Issues:**
  - Reset password using Safe Mode or Command Prompt.
  - Check Event Viewer for login-related errors.

- **Driver Issues:**
  - Update drivers via Device Manager.
  - Use `chkdsk` to check disk integrity.

#### Linux
- **Permission Issues:**
  - Use `chmod` and `chown` to adjust permissions.

- **Package Installation Errors:**
  - Update package lists with `apt update`.
  - Reinstall problematic packages.

- **Service Not Running:**
  - Check service status with `systemctl status`.
  - Restart or enable the service as needed.

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

- **Screenshots:**
  - Ubuntu VM setup and user creation.
  - Task Manager and Event Viewer screenshots from Windows.

- **Command Guides:**
  - **Windows Commands:** 20 basic commands with explanations (e.g., `ipconfig`, `ping`, `sfc /scannow`).
  - **Linux Commands:** 20 basic commands with explanations (e.g., `ls`, `cd`, `chmod`, `systemctl`).

- **Troubleshooting Summaries:**
  - 3 Event Viewer findings explained in simple language.
  - Troubleshooting steps for common issues (e.g., slow performance, login issues, driver issues).

- **Logs Analysis:**
  - Insights from `/var/log/auth.log` and `/var/log/syslog` in Linux.
  - Explanation of how to interpret logs using `journalctl`.

## Resources

- **Microsoft Windows Documentation:** [https://learn.microsoft.com/en-us/windows/](https://learn.microsoft.com/en-us/windows/)
- **Microsoft PowerShell Docs:** [https://learn.microsoft.com/en-us/powershell/](https://learn.microsoft.com/en-us/powershell/)
- **Linux Journey:** [https://linuxjourney.com/](https://linuxjourney.com/)
- **Ubuntu Tutorials:** [https://ubuntu.com/tutorials](https://ubuntu.com/tutorials)
- **OverTheWire Bandit:** [https://overthewire.org/wargames/bandit/](https://overthewire.org/wargames/bandit/)

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
