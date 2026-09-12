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

## Lesson: Computer Fundamentals

### Introduction

This lesson will guide you through understanding the core components of a computer and how they work together. By the end, you'll be able to explain your own PC specs to a non-technical person and troubleshoot basic hardware issues.

### Step-by-Step Breakdown

#### 1. Understanding Computer Components

**CPU (Central Processing Unit):**
- The "brain" of the computer. It executes instructions from programs.
- **Key terms:** 
  - **Cores:** Number of independent processing units (e.g., 4-core CPU).
  - **Threads:** Each core can handle multiple threads (e.g., 8 threads = 4 cores with hyper-threading).
  - **Clock Speed:** Measured in GHz (e.g., 3.5 GHz). Higher speed = faster processing, but not always better.
  - **Overheating:** Common symptom: PC shuts down, fan spins loudly, or performance drops.

#### 2. RAM (Random Access Memory)

- Temporary memory for active programs.
- **Key terms:**
  - **Capacity:** Measured in GB (e.g., 8GB, 16GB). More RAM = more programs can run simultaneously.
  - **Multitasking:** Running multiple apps at once (e.g., browser + video editor).
  - **Memory Errors:** Blue screen of death (BSOD) or crashes.
  - **Reseating:** Physically moving RAM sticks to ensure they connect properly.

#### 3. Storage

- **HDD (Hard Disk Drive):** Mechanical, slower, but cheaper. Common failure: clicking noise, slow performance.
- **SSD (Solid State Drive):** Faster, no moving parts, more reliable. Common failure: SMART errors, degraded health.
- **NVMe SSD:** High-speed SSD using PCIe interface. Best for performance.
- **Storage vs Memory:**
  - **Storage** = Long-term data (e.g., documents, photos).
  - **RAM** = Short-term data (e.g., open apps).

#### 4. Motherboard

- The main circuit board that connects all components.
- **Key terms:**
  - **Ports:** USB, HDMI, Ethernet, SATA, M.2 slots.
  - **BIOS/UEFI:** Firmware that initializes hardware during boot.
  - **CMOS Battery:** Powers BIOS settings.

### Step-by-Step Breakdown (Continued)

#### 5. Boot Process

The boot process is how your computer starts up:
1. **Power On:** You press the power button.
2. **Firmware/UEFI:** The motherboard's firmware checks hardware.
3. **Storage:** The OS (e.g., Windows, Linux) is loaded from storage.
4. **OS:** The operating system starts and you're ready to use the PC.

#### 6. Common Hardware Symptoms and Troubleshooting

| Symptom | Possible Cause | Quick Fix |
|---------|----------------|-------------|
| Slow PC | Too many programs running, low RAM, or slow storage | Close unnecessary apps, add more RAM, upgrade storage |
| No Display | Faulty GPU, loose cable, or monitor issue | Check cables, restart GPU drivers, test monitor |
| No Boot | Dead battery, failing storage, or hardware failure | Replace battery, check storage health, test with external drive |

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

### Software Basics

#### 1. Operating System Role

- Manages hardware and software resources.
- Provides a user interface (e.g., Windows desktop, Linux terminal).

#### 2. Applications vs Services vs Drivers

- **Applications:** Programs you use (e.g., Chrome, Word).
- **Services:** Background processes (e.g., Windows Update, Antivirus).
- **Drivers:** Software that allows hardware to communicate with the OS (e.g., GPU driver).

#### 3. Files, Folders, Extensions, and File Paths

- **Files:** Individual data units (e.g., `document.pdf`).
- **Folders:** Containers for files (e.g., `Downloads`, `Documents`).
- **Extensions:** File type indicators (e.g., `.pdf`, `.jpg`).
- **File Paths:** Location of files (e.g., `C:\Users\YourName\Documents\file.txt`).

### Hands-On Tasks

#### Task 1: Identify Your PC Components
1. Open **Windows System Information** (search for it in Start Menu).
2. Write down:
   - CPU model and number of cores.
   - RAM capacity (e.g., 16GB).
   - Storage type and size (e.g., 500GB SSD).
   - OS version.
   - Wi-Fi adapter model.

#### Task 2: Use Task Manager to Monitor Performance
1. Open **Task Manager** (Ctrl+Shift+Esc).
2. Sort by **CPU, RAM, Disk, and Network usage**.
3. Take a screenshot of the performance tab.
4. Explain:
   - What each graph represents (CPU usage, RAM usage, disk I/O, network usage).
   - How to interpret high usage (e.g., a program is consuming too much RAM).

#### Task 3: Check Disk Health
1. Use **CrystalDiskInfo** (free tool) or check disk health via:
   - Command prompt: `wmic diskdrive get status, size, model`.
   - Look for **SMART errors** or degraded health.
2. Check free disk space (right-click drive > Properties > General tab).

#### Task 4: Plug/Unplug a USB Device
1. Plug in a USB device (e.g., flash drive, mouse).
2. Open **Device Manager** (search for it in Start Menu).
3. Note any changes (e.g., new device added, driver updates).
4. Unplug the device and observe changes in Device Manager.

#### Task 5: Create a Troubleshooting Symptom Table
1. Create a table with 10 common symptoms and their likely causes.
2. Include quick fixes for each symptom.

## Common Pitfalls

- **Ignoring Overheating:** Overheating can damage your CPU. Always clean fans and check temps.
- **Not Backing Up Data:** Regularly back up important files to prevent data loss.
- **Reseating RAM/Storage:** If a device isn’t detected, reseating can help. Try it before assuming hardware failure.
- **Updating Drivers Incorrectly:** Always download drivers from the manufacturer’s website, not random sources.

## Resources

- **Free Tutorials:**
  - [Professor Messer A+ Core 1 Hardware Videos](https://www.professormesser.com/free-a-plus-training/220-1101/220-1101-video/220-1101-training-course/)
  - [PowerCert Animated Videos](https://www.youtube.com/@PowerCertAnimatedVideos)
- **Tools:**
  - **Windows System Information:** Built-in tool to check hardware specs.
  - **Task Manager:** Built-in tool to monitor performance.
  - **CrystalDiskInfo:** Free tool to check disk health (download from [CrystalDiskInfo](https://crystalmark.info/en/software/crystaldiskinfo/)).

## Deliverable / proof of work

Create `portfolio/it/01-computer-fundamentals.md` containing:

- Your PC specs (CPU, RAM, storage, OS version, Wi-Fi adapter).
- Screenshots of Task Manager and System Information.
- A **PC parts glossary** in your own words (e.g., definitions for CPU, RAM, SSD, etc.).
- A **10-row troubleshooting symptom table** with symptoms, likely causes, and quick fixes.

## Checklist

- [ ] I can explain CPU vs RAM vs storage. <!-- id: it-01-c01 energy: low -->
- [ ] I can identify common laptop/desktop ports. <!-- id: it-01-c02 energy: normal -->
- [ ] I can open Task Manager and explain CPU/RAM/disk/network usage. <!-- id: it-01-c03 energy: normal -->
- [ ] I can open Device Manager and identify a driver/device issue. <!-- id: it-01-c04 energy: normal -->
- [ ] I can check storage health and free disk space. <!-- id: it-01-c05 energy: normal -->
- [ ] I created my PC parts cheat sheet. <!-- id: it-01-c06 energy: normal -->
- [ ] I documented 10 common hardware symptoms and possible causes. <!-- id: it-01-c07 energy: normal -->
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
