---
id: it-01-computer-fundamentals
track: it
phase: 1
order: 10
title: "Phase 1 — Computer Fundamentals"
duration: "2 weeks"
duration_weeks: 2
energy_mix: [low, normal]
deliverable: "portfolio/it/01-computer-fundamentals.md"
exit_criteria: "You can explain your own computer specs to a non-technical person and troubleshoot at least three simple issues: slow PC, low storage, and device not detected."
---

# Phase 1 — Computer Fundamentals

## Goal of this phase

Understand what a computer is, what each major component does, and how common hardware/software failures look in real IT support.

## Estimated time

**2 weeks** at 2–4 hours/day, 5 days/week. Add 1 buffer week if hardware terms are new.

## Skills you'll gain

- Identify CPU, RAM, storage, motherboard, PSU, GPU, NIC, monitor, keyboard, mouse, webcam, headset, printer, and router.
- Explain boot process at a beginner level: power -> firmware/UEFI -> storage -> OS.
- Understand storage types: HDD, SATA SSD, NVMe SSD, USB flash, external drives.
- Understand memory vs storage.
- Recognize common symptoms: overheating, slow PC, no display, no boot, bad cable, failing storage, low disk space.
- Use basic safety habits: backups, power off before hardware changes, avoid suspicious downloads.

## Specific topics to learn

### Hardware

- CPU: cores, threads, clock speed, overheating symptoms
- RAM: capacity, multitasking, memory errors, reseating concept
- Storage: HDD vs SSD vs NVMe, SMART health, partitions, free space
- Motherboard: ports, BIOS/UEFI, CMOS battery
- PSU and battery: laptop charging issues, power symptoms
- GPU/display: HDMI/DisplayPort/VGA, driver issues, resolution
- Network adapter: Ethernet vs Wi-Fi, MAC address
- Peripherals: keyboard, mouse, headset, webcam, printer/scanner

### Software basics

- Operating system role
- Applications vs services vs drivers
- Files, folders, extensions, file paths
- Updates, patches, reboots
- Backups and restore points

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Windows System Information | Shows hardware/OS details | Free, built-in | https://support.microsoft.com/windows | Record CPU, RAM, OS version, BIOS mode | Speccy free version |
| Task Manager | Shows CPU/RAM/disk/network usage | Free, built-in | https://support.microsoft.com/windows | Screenshot performance tab and explain each graph | Process Explorer |
| Device Manager | Shows hardware and drivers | Free, built-in | https://support.microsoft.com/windows | Find network adapter and display adapter names | HWiNFO |
| HWiNFO | Detailed hardware inventory | Free | https://www.hwinfo.com/ | Export summary of your PC specs | Windows System Information |
| CrystalDiskInfo | Checks disk health/S.M.A.R.T. | Free | https://crystalmark.info/en/software/crystaldiskinfo/ | Check drive health and temperature | Windows `wmic diskdrive` / manufacturer tool |
| LibreOffice Writer | Write notes and cheat sheets | Free | https://www.libreoffice.org/ | Create PC parts cheat sheet | Google Docs |

## Free/cheap resources

- Professor Messer A+ Core 1 hardware videos — https://www.professormesser.com/free-a-plus-training/220-1101/220-1101-video/220-1101-training-course/
- PowerCert Animated Videos — https://www.youtube.com/@PowerCertAnimatedVideos
- Crucial computer hardware basics — https://www.crucial.com/articles/pc-users/computer-hardware
- Microsoft Windows help — https://support.microsoft.com/windows

## Hands-on practice tasks

1. Open your PC/laptop system information and write down CPU, RAM, storage, OS version, and Wi-Fi adapter.
2. Open Task Manager, sort by CPU, RAM, disk, and network.
3. Check disk health with CrystalDiskInfo or a free built-in method.
4. Plug/unplug a USB device and watch Device Manager change.
5. Create a table of 10 common symptoms and likely causes.

## Deliverable / proof of work

Create `portfolio/it/01-computer-fundamentals.md` containing:

- Your PC specs
- Screenshots of Task Manager and System Information
- A PC parts glossary in your own words
- A 10-row troubleshooting symptom table

## Checklist

- [ ] I can explain CPU vs RAM vs storage. <!-- id: it-01-c01 energy: low -->
- [ ] I can identify common laptop/desktop ports. <!-- id: it-01-c02 energy: normal -->
- [ ] I can open Task Manager and explain CPU/RAM/disk/network usage. <!-- id: it-01-c03 energy: normal -->
- [ ] I can open Device Manager and identify a driver/device issue. <!-- id: it-01-c04 energy: normal -->
- [ ] I can check storage health and free disk space. <!-- id: it-01-c05 energy: normal -->
- [ ] I created my PC parts cheat sheet. <!-- id: it-01-c06 energy: normal -->
- [ ] I documented 10 common hardware symptoms and possible causes. <!-- id: it-01-c07 energy: normal -->

## You're ready to move on when...

You can explain your own computer specs to a non-technical person and troubleshoot at least three simple issues: slow PC, low storage, and device not detected.

## Free vs Paid

### What's free and enough

Windows built-in tools, HWiNFO, CrystalDiskInfo, YouTube lessons, and your own computer are enough.

### What's paid and why you'd upgrade

Paid diagnostic suites exist, but entry-level IT roles do not require them.

### When it's worth paying

Not worth paying in this phase.
