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

Understand what a computer is, what each major component does, and how common hardware and software failures look in real IT support — then practise the job itself: working a ticket, reading the evidence a machine leaves behind, and writing it up so someone else can act on it.

## Estimated time

**2 weeks** at 2–4 hours/day, 5 days/week for the hardware and the guided checks. Add 1 buffer week if hardware terms are new.

The lesson also carries substantial material on the job itself — the ticket lifecycle, escalation, and the routes into IT work in the Philippines and into remote work for overseas employers. Read that in the same two weeks if you can; if it feels like too much, treat it as reference you return to when you start applying, rather than something to finish before moving on. **The exit criteria for this phase are hardware skills only** — the career material is context, not a gate.

## Skills you'll gain

- Identify CPU, RAM, storage, motherboard, PSU, GPU, NIC, monitor, keyboard, mouse, webcam, headset, printer, and router.
- Explain boot process at a beginner level: power -> firmware/UEFI -> storage -> OS.
- Understand storage types: HDD, SATA SSD, NVMe SSD, USB flash, external drives.
- Understand memory vs storage.
- Recognize common symptoms: overheating, slow PC, no display, no boot, bad cable, failing storage, low disk space.
- Use basic safety habits: backups, power off before hardware changes, avoid suspicious downloads.
- Read S.M.A.R.T. attributes and judge whether a drive is healthy, degrading, or failing now.
- Interpret a BSOD stop code and find the bug check history in the Windows event log.
- Work a ticket from report to verified resolution, and write a note a colleague can act on.
- Explain the difference between priority and severity, and escalate with a usable handoff.
- Describe the route into IT work in the Philippines and how it leads to remote work for overseas employers.

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

## Lesson: Computer Fundamentals

### Why this lesson exists

Every IT support ticket eventually comes back to hardware. A user says their laptop is slow, and the answer is a nearly full SSD. A user says "my second monitor stopped working," and the answer is a loose DisplayPort cable. A user says "the computer won't turn on," and the answer is a dead CMOS battery.

You cannot troubleshoot what you cannot name. This lesson gives you the vocabulary and the inspection habits to look at any computer — yours, a user's, a virtual machine's — and describe what is inside it, what it is doing, and what is likely wrong. That is the single most valuable beginner skill in remote IT support, because it is what lets you ask a useful question instead of a helpless one.

We will work through the machine in the order a support technician actually thinks about it: processor, memory, storage, motherboard, and then the boot sequence that ties them together. For each part you will learn five things: **what it is**, **how to check yours**, **what the numbers mean**, **what failure looks like**, and **what you would actually do about it**. Then you will run six guided checks on your own computer with real commands and real output.

**Time to complete:** 2–4 hours if you follow along on your own machine. Do not just read this — open the tools and look at your own hardware. The reading is worth a fraction of the doing.

### Part 1 — CPU: the processor

#### What it is

The CPU (Central Processing Unit) executes the instructions that every program is made of. When you open a browser, play a video, or type a letter, the CPU is doing the arithmetic and logic that turns your input into output. In a support conversation you will usually call it "the processor."

Physically, it is a small square chip seated in a socket on the motherboard, under a metal heatsink and fan. On a laptop it is soldered in place and cannot be upgraded. On a desktop it usually can be, though that is rarely worth doing for a beginner.

#### How to check yours

Three reliable ways on Windows:

```powershell
# PowerShell — the fastest check
Get-CimInstance Win32_Processor |
  Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed
```

Typical output:

```text
Name                      : Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz
NumberOfCores             : 4
NumberOfLogicalProcessors : 8
MaxClockSpeed             : 1800
```

The same information is available without a terminal: press **Ctrl+Shift+Esc** for Task Manager, click the **Performance** tab, and select **CPU**. You will see the model name, the core count, the current speed, and a live graph. For a fuller report, search the Start menu for **System Information** (`msinfo32`) and look under **Processor**. You can also run `winver` to confirm which edition and build of Windows you are on, which matters because instructions differ between Windows 10 and 11.

#### What the numbers mean

- **Cores** are independent processing units on the same chip. A 4-core CPU can genuinely work on four things at once. More cores help with multitasking and with workloads that can be split up.
- **Logical processors** (threads) are what the operating system sees. Intel's Hyper-Threading and AMD's SMT let one physical core present two logical processors, so a 4-core chip often reports 8. Threads improve throughput but are not as good as real cores.
- **Clock speed** is measured in GHz and describes how many cycles per second the chip runs at. Higher is generally faster, but only when comparing chips of the same generation and architecture. A modern 2.0 GHz chip routinely beats an old 3.5 GHz one. Never compare clock speed across generations — this is one of the most common beginner mistakes.
- **Max clock speed** is reported in MHz by Windows, so 1800 means 1.8 GHz. That is the base or rated speed, not the turbo speed the chip can briefly reach.

For entry-level IT work, a 4-core / 8-thread processor with 8 GB or more of RAM is enough to do everything in this roadmap. You do not need an expensive machine. You need to be able to describe the one you have.

#### What failure looks like

CPUs rarely fail outright — a genuinely dead CPU means no POST and no display at all. What you will actually see is **thermal throttling**. When a processor gets too hot, it deliberately slows itself down to protect the hardware. The symptoms are unmistakable once you know them:

- The machine is fast for ten minutes, then becomes sluggish.
- The fan runs loudly and constantly, even when idle.
- The case or the area above the keyboard becomes uncomfortably hot.
- Performance drops when a specific program runs — games, video calls, video editing.

The usual cause is dust blocking the heatsink fins, dried-out thermal paste, a failed fan, or a laptop used on a soft surface like a bed that blocks its vents.

#### What you would do

1. Confirm the temperature before guessing. **HWiNFO** (free) shows CPU temperature in real time; anything sustained above about 90 °C under load is a problem.
2. Ask the user how the machine is used. A laptop on a bed is a dust-and-blockage case waiting to happen.
3. Instruct the user to shut down, then check that the fan spins and the vents are clear. For a desktop, compressed air to the heatsink is a legitimate helpdesk action.
4. Escalate if the temperature stays high after cleaning — that points at thermal paste or a failing fan, which needs a hands-on repair on a laptop.

**Writing this up as a ticket** is the skill being tested. "User reported laptop slow, CPU at 96 °C under load, fan audible at idle, dust visible in vents, advised cleaning and raised a hardware inspection" is a professional note. "Laptop slow" is not.

### Part 2 — RAM: working memory

#### What it is

RAM (Random Access Memory) is the short-term workspace where your computer keeps everything it is actively using right now. When you open a spreadsheet, the spreadsheet is loaded from storage into RAM. When you close it, that space is freed. RAM holds the operating system, every running application, every open browser tab, and the data they are working with.

The distinction that trips up beginners: **RAM is not storage**. Storage keeps files when the power is off. RAM forgets everything the instant power is lost. A useful analogy is a desk: storage is the filing cabinet, RAM is the desk surface. A bigger desk means you can spread out more work at once, but nothing on the desk survives a power cut.

#### How to check yours

```powershell
# Total physical memory and speed
Get-CimInstance Win32_PhysicalMemory |
  Select-Object Manufacturer, Capacity, Speed, DeviceLocator
```

```text
Manufacturer : Samsung
Capacity     : 8589934592
Speed        : 2666
DeviceLocator: ChannelA-DIMM0
```

Capacity is in bytes, so 8589934592 ≈ 8 GB. `DeviceLocator` tells you which slot the stick is in — essential when you are advising a user to add memory and need to know whether a slot is free.

Two more ways, both built in:

- **Task Manager → Performance → Memory** shows total capacity, the number of slots used, speed, and the live usage graph.
- **`msinfo32`** shows total physical memory under **System Summary**.

Note that Windows reports slightly less usable memory than the installed capacity, because some is reserved by the system and by integrated graphics. 8 GB installed showing as 7.8 GB usable is normal, not a fault.

#### What the numbers mean

- **8 GB** is the practical minimum today. It works for browsing, email, and Office.
- **16 GB** is the comfortable standard for IT and development work, and what you want if you will run virtual machines.
- **32 GB or more** matters for heavy virtualisation, video editing, or running several VMs at once.

Speed (2400, 2666, 3200 MHz) matters, but only marginally in day-to-day work, and only when matched across sticks. If you mix a 4 GB and an 8 GB stick, the machine runs both at the slower speed and may lose dual-channel benefits. The practical rule: **match capacity and speed when adding RAM**, or replace the pair.

#### What failure looks like

RAM failure is distinctive and rarely subtle:

- **Blue screens (BSOD)** with memory-related stop codes such as `MEMORY_MANAGEMENT` or `PAGE_FAULT_IN_NONPAGED_AREA`.
- **Random crashes or restarts** with no pattern, especially under load.
- **Applications crashing** without warning, often different applications each time.
- **The machine fails to POST** and beeps in a repeating pattern — motherboard beep codes are frequently memory errors.
- **In the worst case, spontaneous reboots** while working.

Constant, reproducible crashes in *one* application usually mean that application is broken. Random crashes across *many* applications point at RAM or storage.

#### What you would do

1. Check the event log for repeated `Kernel-Power` or `BugCheck` events — a real support habit:
   ```powershell
   Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Microsoft-Windows-WER-SystemErrorReporting'} -MaxEvents 10
   ```
2. Run the built-in memory test. Search for **Windows Memory Diagnostic**, or run `mdsched.exe`, and let it restart and test. It takes roughly 10–30 minutes.
3. **Reseat the sticks.** For a desktop, power off, unplug, open the case, release the clips, lift each stick, and push it back firmly until both clips click. A surprising number of "failing RAM" tickets are a stick that was never fully seated — often after a move or a repair.
4. If a stick proves faulty, test one at a time to identify which. Removing a suspect stick and seeing stability return is a valid diagnosis.
5. Document what you found and escalate for replacement if the hardware is confirmed bad.

### Part 3 — Storage: where everything lives

#### What it is

Storage holds your operating system, applications, and files permanently. There are two families you must be able to tell apart, because the *symptoms* of failure are completely different.

**HDD (Hard Disk Drive)** — a mechanical device with spinning magnetic platters and a moving read/write head. Cheap per gigabyte, available in large capacities, and slow. Because it has moving parts, it fails mechanically.

**SSD (Solid State Drive)** — flash memory with no moving parts. Dramatically faster, more shock-resistant, silent, and more expensive per gigabyte. It fails electronically rather than mechanically.

**NVMe SSD** — an SSD that connects over the PCIe bus instead of the older SATA interface, using an M.2 slot. NVMe drives reach several times the speed of SATA SSDs. This is the standard in modern machines.

A workflow worth memorising: a machine still running an HDD feels slow in *everything*, including boot. A machine with an SSD but a failing one feels fine and then freezes or drops a drive entirely. That single distinction directs your whole investigation.

#### How to check yours

```powershell
# Physical disks: type, health, and size
Get-PhysicalDisk | Select-Object FriendlyName, MediaType, BusType, HealthStatus, Size

# Volumes: free space, drive letter, filesystem
Get-Volume | Select-Object DriveLetter, FileSystemLabel, FileSystem, @{N='SizeGB';E={[math]::Round($_.Size/1GB,1)}}, @{N='FreeGB';E={[math]::Round($_.SizeRemaining/1GB,1)}}
```

```text
FriendlyName MediaType BusType HealthStatus        Size
------------ --------- ------- ------------        ----
Samsung SSD  SSD       NVMe    Healthy      512110190592

DriveLetter FileSystemLabel FileSystem SizeGB FreeGB
----------- --------------- ---------- ------ ------
C           Windows         NTFS        476.9   38.4
```

Also available without a terminal:

- **Task Manager → Performance → Disk** shows the active disk type and live activity.
- **File Explorer → This PC** shows free space per drive at a glance.
- **Device Manager → Disk drives** lists the physical devices.
- **Disk Management** (`diskmgmt.msc`) shows partitions, their sizes, and unallocated space.

For drive health specifically, **CrystalDiskInfo** reads the drive's S.M.A.R.T. data and gives a plain-language health rating. It is the free tool to reach for, and it is what you would tell a user to install.

#### What the numbers mean

- **Capacity** — 256 GB is tight for Windows plus applications; 512 GB is comfortable; 1 TB is roomy. On an IT machine that will host virtual machines or multiple OS installs, 512 GB is the realistic floor.
- **Free space** — keep at least 10–15 % of the drive free. Windows needs room for the page file, updates, and temporary files. A drive below 10 % free causes real, measurable slowness. Below about 5 %, updates can fail outright.
- **S.M.A.R.T. health** — "Good" or "Healthy" is a pass. "Caution" means the drive is reporting reallocated or pending sectors and should be replaced. "Bad" means stop using it and recover data now.
- **Partitions** — a single physical disk can be divided into several volumes. `C:` is usually one partition on one disk. Unallocated space is space not assigned to any partition and therefore unusable until it is.

#### What failure looks like

HDD and SSD failures present differently, and knowing which to expect speeds up your diagnosis.

**HDD failure signs:**

- Rhythmic clicking, ticking, or grinding — the classic "click of death".
- Painfully slow file operations, especially on large files.
- Files that open and then fail, or that show as 0 bytes.
- Frequent freezes while the drive is active.

**SSD failure signs:**

- S.M.A.R.T. reporting Caution or Bad, with reallocated sectors climbing.
- The drive disappearing from the system entirely, then reappearing after a reboot.
- Read-only mode — the drive silently becomes unwritable to protect data.
- Sudden boot failures with "no boot device found".

**Both types:**

- File system errors, and `chkdsk` reporting bad sectors.
- "Windows detected a hard disk problem" notifications.
- A drive that shows in BIOS but not in Windows, or the reverse.

#### What you would do

1. **Check free space first.** It is free, instant, and the most common cause of "my computer is slow". If `C:` is above 90 % full, that is your answer — run Disk Cleanup, clear the temp folders, and remove old Windows update files.
2. **Read the drive health.** Open CrystalDiskInfo, or run `Get-PhysicalDisk | Select FriendlyName, HealthStatus`. A Caution or Bad result is a hardware escalation, not a software fix.
3. **Back up before anything else.** If a drive is failing, the first priority is the user's data, not the diagnosis. Copy important files off immediately.
4. **Run a file system check** only when you suspect logical corruption rather than physical failure:
   ```powershell
   chkdsk C: /scan
   ```
   `/scan` is online and safe. The full repair mode (`chkdsk C: /f`) requires a reboot and can take hours on a large HDD. Never run a repair check on a drive that is clicking — you will shorten its life further.
5. **Escalate mechanical noise or S.M.A.R.T. warnings.** These are not fixable at the helpdesk level; they are a drive replacement.
6. **Recommend an SSD upgrade for old HDD machines.** It is the single highest-impact, lowest-cost improvement available to a slow computer, and being the person who knows this makes you useful.

### Part 4 — Motherboard: the part everything plugs into

#### What it is

The motherboard is the main circuit board. Every other component connects to it, directly or through it: the CPU in its socket, RAM in its slots, storage over SATA or M.2, expansion cards in PCIe slots, and every external port on the back panel. It also carries the chipset that manages communication between them.

You will rarely repair a motherboard, but you will constantly reason about it, because it defines what a machine can and cannot do. If a user asks "can I add a second monitor?", the answer depends on the ports on the board and the GPU. If they ask "can I add more RAM?", the answer depends on how many slots there are and how many are free.

#### How to check yours

Model identification matters because every later search depends on it.

```powershell
# Motherboard manufacturer and model
Get-CimInstance Win32_BaseBoard | Select-Object Manufacturer, Product, Version

# BIOS/UEFI version and date
Get-CimInstance Win32_BIOS | Select-Object Manufacturer, SMBIOSBIOSVersion, ReleaseDate

# Firmware mode: Legacy BIOS or UEFI
Confirm-SecureBootUEFI
```

```text
Manufacturer Product
------------ -------
ASUSTeK       PRIME B450M-A
```

`Confirm-SecureBootUEFI` returning `True` confirms the machine is running UEFI with Secure Boot on. An error means it is likely legacy BIOS mode — worth knowing, because firmware settings menus differ significantly between the two.

Also built in:

- **`msinfo32` → System Summary** shows baseboard manufacturer, product, and BIOS version/date.
- **Device Manager → Firmware** appears on UEFI systems.
- At power-on, pressing **F2**, **Del**, **F10**, or **Esc** (varies by vendor) enters firmware settings, where the boot order and hardware inventory are listed.

#### What the numbers mean

- **Form factor** — ATX, micro-ATX, and mini-ITX determine what fits in a case. Irrelevant for troubleshooting, essential for any upgrade conversation.
- **Chipset** — determines supported CPU generations, RAM speed limits, and available ports. This is why "which CPU can I install?" always starts with the motherboard model number.
- **BIOS/UEFI version and date** — an old firmware date can explain hardware compatibility problems and is often the fix for a new CPU or new RAM not being detected. Updating firmware is a genuine fix, but it is also risky: a power loss mid-update can brick the board. Never start a firmware update on a laptop with a low battery.
- **CMOS battery** — a small coin cell (usually CR2032) that keeps the clock and firmware settings alive when the machine is unplugged. It lasts roughly five to ten years.

#### What failure looks like

- **Clock and date reset on every boot** — the textbook CMOS battery symptom. Users notice it because their browser and email complain about certificates or log them out.
- **"CMOS checksum error" or "CMOS time not set"** at startup — the same root cause, stated by the firmware itself.
- **BIOS settings resetting to defaults** after every power loss.
- **Machine does not POST** — powers on, fans spin, no display, no beep.
- **Specific ports dead** — one USB port works, another does not; the network port is not detected.
- **Visual damage** — bulging or leaking capacitors, scorch marks, a swollen battery on a laptop. Scorch marks and bulged capacitors are a stop-work signal: do not power it on, escalate immediately.
- **Random shutdowns under load** that are not thermal — sometimes a failing power delivery stage.

#### What you would do

1. **For a resetting clock**, the fix is a new CMOS battery. On a desktop this is a five-minute job. On a laptop it is a partial teardown and should be escalated or scheduled carefully.
2. **For a no-POST machine**, strip the diagnosis down: reseat RAM, reseat power connectors, remove non-essential peripherals, and try one RAM stick at a time. Check that the monitor is on the correct input before you open anything — a genuinely frequent cause.
3. **For dead ports**, confirm with a known-good device before condemning the board. Test the cable and the peripheral in another port or on another machine.
4. **If you see physical damage**, stop. Photograph it, report it, and do not attempt further power-ons.
5. **Do not flash firmware on a whim.** Only update firmware when you have a specific reason: a documented compatibility fix, a security advisory, or a vendor instruction. Have stable power and the correct file for the exact board revision.

### Part 5 — The boot process: what happens when you press power

Understanding boot order turns "it won't turn on" from one problem into a sequence of checkable stages.

1. **Power on.** You press the button. The power supply (PSU) delivers stable voltages. Desktop PSUs are rated in watts because every component draws from that budget; an underpowered PSU shows up as shutdowns under load, not as a refusal to start.
2. **Firmware (UEFI or legacy BIOS) initialises.** The motherboard runs the firmware, which wakes the CPU, trains the memory, and enumerates the hardware. This is the **POST** (Power-On Self-Test). If POST fails here, you get a beep code, a diagnostic LED, or silence with spinning fans — and never a display.
3. **Firmware selects a boot device.** The boot order decides whether the machine looks for an internal drive, a USB device, or the network. A USB drive left plugged in is a classic unbootable-machine cause, because the firmware tries it first.
4. **The bootloader starts.** UEFI loads the Windows Boot Manager from the EFI System Partition. A corrupt boot configuration produces "Boot device not found", "Operating system not found", or a recovery screen — all *before* Windows begins to load.
5. **The operating system loads.** Windows initialises drivers, starts services, and presents the sign-in screen. Failures past this point look different: they are Windows-level problems — BSODs, update failures, endless repair loops — not firmware or hardware ones.

That sequence is a diagnostic tool. If the failure happens before the Windows logo, you are looking at power, firmware, or boot configuration. If it happens after, you are looking at Windows itself. Splitting the problem at the logo saves a great deal of time.

### Part 6 — Going deeper: reading the evidence hardware leaves behind

Parts 1 to 5 gave you the vocabulary. This part teaches you to read the *evidence* — the raw signals a machine emits when it is unhappy. You do not need to memorise any of it. You need to know it exists, so that when you see it you recognise it instead of guessing.

#### S.M.A.R.T.: the drive's own health record

**S.M.A.R.T.** (Self-Monitoring, Analysis and Reporting Technology) is a monitoring system built into every modern HDD and SSD. The drive continuously tracks dozens of internal counters and exposes them to the operating system. CrystalDiskInfo and `Get-PhysicalDisk` are just readers for those counters.

The counters are called **attributes**, and each has an ID, a current value, a worst value, a threshold, and a **raw value**. You will see a wall of them, and you do not need to understand all of them. Five carry most of the diagnostic weight:

| Attribute | ID | What it means | Why you care |
|---|---|---|---|
| Reallocated Sectors Count | 05 | Bad sectors the drive has swapped for spare ones | The single most important number. Non-zero and rising means the drive is physically degrading |
| Current Pending Sector Count | C5 | Sectors that read unreliably and await reallocation | A sector that cannot be read *will* become a lost file. Non-zero is a warning |
| Uncorrectable Sector Count | C6 | Sectors that failed and could not be recovered | Data has already been lost at the hardware level |
| Power-On Hours | 09 | Total hours the drive has been powered | Age context. A 60,000-hour HDD is near end of expected life |
| Temperature | C2 | Drive temperature in Celsius | Sustained high temperature shortens drive life |

The interpretation rule is simple, and it is about *direction* rather than absolute numbers:

- **All zeros on 05, C5, and C6** — the drive is healthy. Record the values and move on.
- **Non-zero but stable** — the drive has had problems but is currently coping using spare sectors. Watch it; recheck in a month.
- **Non-zero and climbing** — the drive is failing right now. Back up immediately and escalate for replacement. Do not run a repair utility on it; every extra hour of spinning reduces the chances of recovering the user's data.

**This is the reasoning that separates a technician from a parts-swapper.** "CrystalDiskInfo says Caution" is a fact. "Reallocated sectors are at 248 and climbing, pending sectors appeared since last check, so the drive is degrading and I have backed the user's data up and raised a replacement" is a diagnosis. The second one gets you hired and promoted.

Note that **SSDs report different attributes** and have a **wear-levelling count** and a **percentage used** figure instead of the mechanical attributes above. An SSD does not fail gradually the way a spinning disk does — it works perfectly until it does not. That is why backing up matters more, not less, on an SSD.

#### Memory errors: why they look random

RAM faults are the hardest class of failure for a beginner to accept, because they are **intermittent**. A failing stick may produce no error for hours, then corrupt one bit and crash an application.

That single flipped bit is worth understanding. RAM stores data as electrical charges. A marginal cell may hold its charge correctly most of the time and lose it under specific conditions — heat, a particular access pattern, or a particular physical position on the stick. This explains the classic pattern:

- Crashes happen under load but not at idle, because load means more memory traffic and more heat.
- Crashes move between applications, because different applications occupy different regions of memory.
- A machine that fails a memory test can still boot fine, because booting only touches a small area of memory.

This is why `mdsched.exe` (Windows Memory Diagnostic) may pass a genuinely faulty stick. A single pass touches each address once. A marginal cell might need to be exercised repeatedly, or at temperature, to fail. **A clean memory test does not clear the RAM** — it only means the fault did not manifest during the test window. If the symptoms fit and the test passes, reseating and swapping sticks one at a time is still the right move.

#### BSOD stop codes: the machine telling you where it died

A **BSOD** (Blue Screen of Death, formally a *bug check*) is Windows saying "I detected a condition I cannot safely continue from." It halts deliberately to avoid corrupting data. It is not, by itself, evidence of a broken computer — it is evidence of a specific software or hardware fault, and the **stop code** names the category.

| Stop code | Usually means | First checks |
|---|---|---|
| `MEMORY_MANAGEMENT` | A memory operation was invalid | Memory diagnostic; reseat; test sticks individually |
| `PAGE_FAULT_IN_NONPAGED_AREA` | Tried to read memory that is not there | RAM, then the driver named on the screen |
| `CRITICAL_PROCESS_DIED` | A core Windows process stopped | System file check; recent updates; storage health |
| `INACCESSIBLE_BOOT_DEVICE` | Windows lost the drive during boot | Storage connection; driver; storage health |
| `WHEA_UNCORRECTABLE_ERROR` | Hardware reported an unrecoverable error | CPU, RAM, or overheating — an escalation, not a helpdesk fix |
| `DRIVER_IRQL_NOT_LESS_OR_EQUAL` | A driver touched memory it did not own | The driver named on the screen; recent driver installs |
| `NTFS_FILE_SYSTEM` | File system corruption | Storage health; `chkdsk`; back up first |

The practical technique: **when a BSOD names a driver file, that file is the lead.** A stop code mentioning `nvlddmkm.sys` points at the NVIDIA graphics driver. A code mentioning a third-party antivirus points at that antivirus. Search the exact stop code plus that filename, and you are searching for a specific answer instead of "blue screen".

#### Where the evidence is stored

You do not need to catch a BSOD live. Windows records each one:

```powershell
# The bug check history — one entry per BSOD
Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Microsoft-Windows-WER-SystemErrorReporting'} -MaxEvents 20 |
  Select-Object TimeCreated, Id, Message

# Unexpected shutdowns and power loss events
Get-WinEvent -FilterHashtable @{LogName='System'; Id=41,6008} -MaxEvents 20 |
  Select-Object TimeCreated, Id, ProviderName
```

Event **41** (`Kernel-Power`) means the machine lost power or hard-crashed without shutting down cleanly. Event **6008** means the previous shutdown was unexpected. A cluster of these with no corresponding BSOD entry is a strong hint at a power problem — a failing PSU, an overheating shutdown, or a laptop battery that can no longer hold a charge.

Also worth knowing: minidump files land in `C:\Windows\Minidump`. You do not analyse these at Phase 1, but their **timestamps** tell you exactly when each crash happened, which lets you correlate crashes against what the user was doing.

#### Driver signing, and why "just install a driver" is dangerous

Windows requires kernel-mode drivers to carry a digital signature from a trusted publisher. This exists because a driver runs with the highest privilege on the machine — a malicious or broken driver can do anything.

You will meet this as the **"unsigned driver"** warning, or as a device that refuses to install a driver. Two rules:

1. **Get drivers from the manufacturer.** The laptop vendor's support page, the motherboard vendor, or Windows Update. Not a "driver pack" site, not a bundled updater utility. Those are a common malware route, and the drivers are often older than what Windows already has.
2. **Let Windows Update handle it when it can.** On modern Windows 10 and 11, most drivers install automatically and correctly. Manually chasing the newest driver is rarely necessary and occasionally harmful.

The one genuine exception is graphics drivers, where the vendor's own package (NVIDIA, AMD, Intel) is the right source — and even then, the fix for a flaky display is usually to *roll back* to the previous driver rather than push forward to the newest one.

### Part 7 — Guided walkthrough: inspect your own computer

Work through these six checks on your own machine and record the results. This is the deliverable for the phase, so treat it as real work, not reading.

#### Check 1 — Identify the machine

```powershell
winver
Get-CimInstance Win32_ComputerSystem |
  Select-Object Manufacturer, Model, TotalPhysicalMemory
Get-CimInstance Win32_OperatingSystem |
  Select-Object Caption, Version, BuildNumber, OSArchitecture
```

Expected: your Windows edition, version, and build; the machine make and model; total RAM in bytes. Record the build number — you will need it in later phases when you check update history.

#### Check 2 — Inventory the processor and memory

```powershell
Get-CimInstance Win32_Processor |
  Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed
Get-CimInstance Win32_PhysicalMemory |
  Select-Object Capacity, Speed, DeviceLocator
```

Expected: one row per CPU and one row per installed memory stick. Count the rows — two rows means two sticks, which tells you whether a slot is free for an upgrade.

#### Check 3 — Inventory storage and free space

```powershell
Get-PhysicalDisk | Select-Object FriendlyName, MediaType, BusType, HealthStatus, Size
Get-Volume | Where-Object DriveLetter |
  Select-Object DriveLetter, FileSystem,
    @{N='SizeGB';E={[math]::Round($_.Size/1GB,1)}},
    @{N='FreeGB';E={[math]::Round($_.SizeRemaining/1GB,1)}},
    @{N='FreePct';E={[math]::Round(100*$_.SizeRemaining/$_.Size,1)}}
```

Expected: your drive model, its media type (HDD or SSD), its bus type, a health status, and per-volume free space as both GB and a percentage. If your system drive is below 15 % free, you have found a real, fixable performance issue and should act on it.

#### Check 4 — Inspect the motherboard and firmware

```powershell
Get-CimInstance Win32_BaseBoard | Select-Object Manufacturer, Product
Get-CimInstance Win32_BIOS | Select-Object Manufacturer, SMBIOSBIOSVersion, ReleaseDate
Confirm-SecureBootUEFI
```

Expected: board make and model, firmware version and release date, and `True` if Secure Boot is enabled. Note the firmware release date — if it is several years old, that is worth recording even if you do nothing about it.

#### Check 5 — Watch the machine work in Task Manager

Open **Task Manager** with **Ctrl+Shift+Esc** and click **Performance**. Visit each tab and answer these questions on paper:

- **CPU:** How many cores does it report? What is the current utilisation at idle? What process is using the most CPU? Open a browser with several tabs and watch it rise.
- **Memory:** What is the total? How much is in use at idle? What is the "committed" figure? Open several applications and watch the graph climb, then close them and watch it fall.
- **Disk:** What is the active time at idle? On a healthy SSD at rest it should be near zero. A disk pinned at 100 % with little apparent activity is a strong clue — it is often Windows Update, an antivirus scan, or a failing drive.
- **Network:** What is the link speed — 100 Mbps or 1 Gbps? What is the send/receive rate at idle?

Then use **Device Manager** (search the Start menu, or run `devmgmt.msc`) and expand **Network adapters** and **Display adapters**. Write down the exact device names. Unplug a USB device and watch it disappear; plug it back in and watch it return. That is device enumeration, and it is what you will ask a user to check.

#### Check 6 — Read the event log

```powershell
# Boot time, useful for the classic "my PC takes forever to start" ticket
Get-CimInstance Win32_OperatingSystem | Select-Object LastBootUpTime

# The most recent 20 critical and error events
Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 20 |
  Select-Object TimeCreated, LevelDisplayName, ProviderName, Id
```

Expected: a boot timestamp, and a list of errors. **Do not panic at the list** — every healthy machine has accumulated errors, and most are harmless. What you are looking for is *repetition*: the same error ID, from the same provider, again and again, especially alongside a symptom the user reported. `Kernel-Power` events with no clean shutdown, for instance, indicate the machine is losing power or hard-crashing.

### Part 8 — Symptom → cause reference

This is the table you build throughout the phase. Study the pattern of reasoning, not the individual rows.

| Symptom | Likely first causes | What you check first |
|---|---|---|
| Everything is slow, all the time | System drive nearly full; HDD instead of SSD; too little RAM | Free space on `C:`; `MediaType` from `Get-PhysicalDisk` |
| Fast at first, slow after 10 minutes | Thermal throttling; dust; failed fan | CPU temperature in HWiNFO; noise at idle |
| Random blue screens, many applications | Failing RAM; failing storage; driver conflict | Windows Memory Diagnostic; S.M.A.R.T. health; recent driver changes |
| Clicking, grinding, or ticking noise | Failing mechanical HDD | Back up immediately; check S.M.A.R.T.; escalate |
| Drive vanishes and returns | Failing SSD; loose SATA or M.2 connection | Reseat; check health; reseat data cable |
| Clock and date reset every boot | Dead CMOS battery | Replace CR2032; check for checksum error at POST |
| Powers on, fans spin, no display | RAM not seated; GPU issue; monitor input wrong; POST failure | Reseat RAM; check monitor input; try one RAM stick |
| No boot device found | Boot order changed; USB left in; bootloader corrupt | Enter firmware settings; check boot order; remove USB devices |
| One USB port dead, others fine | Physical port damage; front panel header loose | Test known-good device in another port |
| Wi-Fi missing entirely | Driver disabled or missing; airplane mode; adapter failure | `Get-NetAdapter`; Device Manager status |
| Battery will not charge | Charger, cable, port, or battery | Test with another charger; check battery report |
| Screen flickers or tears | Cable, GPU driver, or panel | Reconnect display cable; update GPU driver from vendor |

### Part 9 — The habits that make this useful on a ticket

Technical knowledge only converts into a job if you communicate it. Four habits separate a technician from someone who has watched a video about computers.

**Ask about change first.** "What changed recently?" is the highest-yield question in support. New software, a Windows update, a new monitor, a move, a spill, a new router — the cause is usually something that changed. Ask before you investigate.

**Reproduce the problem.** If you cannot reproduce it, you cannot confirm you have fixed it. Ask the user to walk you through the steps that trigger it, and ask whether it happens for every user or only them. That question alone distinguishes a machine problem from a permissions or account problem.

**Change one thing at a time.** If you clear the temp files, update the driver, and reseat the RAM in one go, you will never know what fixed it — and it will come back. Change one variable, test, record the result. This is the discipline that makes notes worth reading later.

**Write the note for the next person.** A good ticket note contains what the user reported, what you observed, what you did, what the result was, and what happens next. Assume the next technician knows nothing:

> *User reported laptop slowing down after about an hour of use. Checked Task Manager: CPU at 100 % with clock speed reduced to 0.8 GHz, fan audible at idle. Temperature in HWiNFO 95 °C under light load. Vents visibly dusty. Cleaned vents, advised using the laptop on a hard surface. Temperature now 68 °C under load, clock speed stable. Will monitor; if it recurs, hardware inspection for thermal paste.*

That note is specific, evidence-based, and actionable. It also demonstrates to an employer that you can actually do the job.

#### Two more habits that matter specifically for remote work

If your goal is working for an overseas employer rather than a local office, two further habits carry disproportionate weight, because your manager cannot see you and will judge you almost entirely on written evidence and responsiveness.

**Reply before you have the answer.** In an office, silence is normal — your manager can see you are at your desk working. Remotely, silence is indistinguishable from absence. The habit that marks out a reliable remote technician is a short acknowledgement within minutes: *"Got it, looking now — I'll update you within the hour."* Then actually update within the hour, even if the update is "still investigating, narrowed it to the storage or the cable, next step is X." A stream of honest interim updates reads as competence. Long silence followed by a fix reads as unreliability, and it is the single most common reason remote staff are let go in their first months.

**Write so it can be read without you.** Every note, message, and handover you write will be read by someone in a different timezone who cannot ask you a follow-up question until tomorrow. So write it self-contained: name the machine, name the user, state the symptom, state the evidence, state what you did, state what happens next. Avoid "as discussed" and "the usual issue" — those phrases assume shared context that a remote colleague does not have. This is also exactly the standard you will be held to in a security role later, where the written record is the deliverable.

### Part 10 — Getting in locally, then going remote

Everything up to this point has been about the machine. This part is about the market you are selling your skills into — because a beginner who understands where the jobs are, what they screen for, and what the shift actually feels like will apply to the right places instead of spraying applications at everything.

There are two stages to this, and they are sequential rather than competing:

1. **Get in locally.** Almost everyone starts here, because local entry-level support work is far easier to land than a remote role with a foreign employer. It builds the CV, teaches you the process, and gives you the professional experience that every overseas posting asks for.
2. **Convert that experience into remote work for an overseas employer.** This is the goal for most people in the Philippines, and the reason is partly economic: earning in USD, AUD, or GBP while living on Philippine costs is a genuine advantage. It is also partly about opportunity — the overseas market is bigger, pays better, and cares more about what you can do than where you studied.

Be realistic about the order. The honest truth is that **the overseas remote market is very hard to enter with zero professional experience.** A foreign employer hiring remotely is taking a bigger risk than a local one: they cannot see you, they cannot easily replace you, and they are trusting you across a timezone. Almost all of them want to see that somebody has already paid you to do this work. Local experience is not a detour from the goal — it is usually what unlocks it.

This part is deliberately unromantic. The goal is that you recognise a job posting for what it really is before you spend three weeks on it.

#### Stage one: the four kinds of local employer

Almost every entry-level IT support role in the Philippines sits in one of four buckets. They differ enormously in pay, shift, and how much you actually learn. The local stage is worth taking seriously even if you intend to leave it — the employer type you start in shapes what you learn and how quickly you become employable abroad.

**BPO and call-centre IT helpdesk.** These are the large outsourcing companies with campuses in Metro Manila, Cebu, Davao, Clark, and Iloilo. You are part of a service desk that supports a foreign client's employees — often a US healthcare company, a telco, a bank, or a retail chain. Your day is a queue of tickets and calls, measured on handle time, first-contact resolution, and customer satisfaction scores. The work is narrow and repetitive by design: there is a knowledge base, a script, and a defined set of things you are allowed to do before you escalate. That narrowness is exactly why it is a realistic first job — the employer is not expecting you to already know Windows internals, they are expecting to train you. Most of these roles are **night or shifting**, because the client is awake during US or Australian business hours. Many run rotating shifts, so your "night shift" may change week to week, which is harder on the body than a steady overnight. Equipment is usually provided or a stipend given; the office has backup power and redundant internet, which is the single biggest practical advantage of working on-site.

**Shared services and global capability centres.** These are the in-house back offices of foreign companies — the same bank, insurer, or software vendor, but their Philippine subsidiary. The environment is quieter and more corporate than a BPO floor: fewer calls, more tickets, better documentation culture, sometimes a proper ITIL-style process with change management and defined escalation paths. Shifts can still follow the parent company's timezone, but day and mid-shifts are more common here than in voice-heavy BPO work. These centres often have genuine internal mobility — you can move from service desk to infrastructure, to security operations, to a specialist team — which makes them the best long-term bet if you can get in.

**Local MSPs (managed service providers).** An MSP is a company that provides IT support to other businesses on a contract basis. One MSP might look after thirty small companies: a dental clinic, a logistics firm, a school, a chain of restaurants. You will support many different environments, many different software packages, and many different kinds of user, often remotely and sometimes on-site. The work is messier and more varied than BPO work, and you learn faster because you cannot rely on one client's script. Pay is often lower at entry than BPO, and small MSPs can be chaotic — but if you want breadth of exposure in a short time, nothing else compares. If you intend to move toward cybersecurity, MSP experience is genuinely valuable because you see many networks and many misconfigurations.

**In-house IT at hospitals, schools, retail chains, and government.** Here you support one organisation's own staff. In a hospital that might be ward stations, printers, and clinical software. In a school it is faculty laptops, a computer laboratory, and the network in the admin building. In retail it is point-of-sale terminals and store connectivity. In government it is desktop support, records systems, and procurement paperwork. These roles are usually **day shift, Monday to Friday**, which is their main attraction, and they often come with the stability of a permanent position. The trade-off is that budgets are tight, the technology is often old, and you may spend a lot of time on tasks that are not very technical — reimaging machines, replacing toner, tracking inventory in a spreadsheet. Progression can be slow because there is one IT team and few vacancies above you.

How they compare, in relative terms only:

| Employer type | Shift pattern | Entry pay relative to the others | Typical pay shape | What you learn |
|---|---|---|---|---|
| BPO / call-centre helpdesk | Mostly night or rotating, aligned to US or AU hours; some graveyard differential pay | Strongest entry pay of the four, because shift work and attrition are compensated | Entry is decent, rises slowly with tenure; senior agent and team-lead bands are real but competitive | How to work a queue, follow process, and communicate under pressure |
| Shared services / capability centre | Day, mid, or night depending on the parent company's timezone | Entry pay usually a little below BPO, better benefits and stability | Steady internal bands with clearer promotions than BPO | Structured process, ticketing discipline, and internal mobility |
| Local MSP | Day shift plus on-call rotation | Lowest entry pay; some small MSPs pay very little at the start | Rises with responsibility; senior engineers can earn well | Breadth — many clients, many systems, real troubleshooting |
| In-house IT (hospital, school, retail, government) | Usually day shift, Monday to Friday | Middle — often comparable to BPO base, without the night differential | Flat; promotion depends on someone above you leaving | Patience, asset management, and working with non-technical staff |

Read that table as a set of trade-offs, not a ranking. A night-shift helpdesk role that pays well may be the right first step if you can tolerate the schedule. A day-shift school IT role that pays less may be the right step if you are studying at night. Neither is a mistake.

**Be honest with yourself about the shift.** Night work is the part of this industry that breaks people, not the technology. Before you accept a graveyard role, work out what your actual day looks like: when you sleep, when you eat, when you see your family, when you study. If you are taking this roadmap at 2–4 hours a day, a night shift plus study is a real load. Many people do it. Some people do it for six months and then cannot anymore. Plan for that rather than discovering it.

#### Stage two: what "remote entry-level IT" actually means

"Remote" in a job posting can mean three very different things, and confusing them wastes a lot of your time.

1. **Remote within the Philippines.** You work from home for a Philippine company or a Philippine entity of a foreign company. You are a regular employee with government contributions and, usually, a night differential if you work nights. This is remote work without the contractor complications.
2. **Remote for a foreign employer as a contractor.** You invoice a foreign company, usually monthly, and you are not an employee in the Philippine sense. You handle your own contributions, your own equipment, and your own tax filing. More on this below.
3. **Remote as an offshore staff member through an intermediary.** A Philippine-based outsourcing firm or staffing agency employs you locally and "deploys" you to a foreign client. You get local employment protections and the client gets offshore labour. This is the most common arrangement for genuinely foreign-facing remote work, and it is often the safest.

Roles that **are** genuinely open to Philippines-based applicants with no experience:

- **Helpdesk and service desk** — the largest category by far. Password resets, account unlocks, software installation, printer problems, "my laptop is slow". The work in Parts 11 and 12 of this lesson is exactly this job.
- **NOC monitoring** — a NOC is a Network Operations Centre, a team that watches dashboards and alerts for servers, networks, and services. Entry-level NOC work is about triage: an alert fires, you confirm whether it is real, you check the runbook, and you escalate if it is beyond you. The technical bar is low at entry, the shift work is heavy, and it is an excellent route into infrastructure later. The networking knowledge it needs is Phase 3 material, not Phase 1 — do not apply before you have it, but note it as a target.
- **Technical support for a SaaS product** — a SaaS company is one that sells software as a subscription service. Their support team answers tickets about *their* product, not about Windows in general. These roles value clear writing, patience, and the ability to reproduce a bug, and many are fully remote and English-language. They are often the best-paying entry-level remote option because the employer is a tech company, not a call centre.
- **Chat and email support** — the same job as phone support but in writing. Asynchronous, no voice queue, and much easier to do from a home connection that occasionally wobbles. If your spoken English is weaker than your written English, this is the door to walk through first.

Roles that are **not** realistically open to you yet: anything with "engineer" in the title that expects production access, anything requiring on-call for live customer infrastructure, anything asking for three or more years of experience, and anything asking you to be available during a specific foreign timezone *and* hold a full-time local job. Read the requirements honestly. A posting that says "2+ years in a service desk environment" is not a posting you talk your way into; it is a posting you apply to in two years. Applying anyway is not fatal, but it should not be the bulk of your effort.

**How payment works as a contractor.** If you are engaged as a contractor rather than an employee, the practical realities are:

- **You invoice.** Usually monthly, sometimes semi-monthly. You send an invoice with your details, the period covered, and the amount. Some clients handle this through a platform that pays automatically.
- **You get paid in foreign currency**, commonly USD, AUD, or GBP. The amount you actually receive depends on the exchange rate on the day and on the fees your bank or transfer service charges. A payment that costs nothing to send from the client's side can still cost you a few percent on arrival.
- **Your income is not "net".** As an employee, tax and contributions are withheld before you see the money. As a contractor, the gross amount lands in your account and the obligations are yours to handle. Budget for that from the first payment rather than the fifth — set the money aside, register properly, and file. If this is new to you, treat it as a real task with a real deadline, because penalties are not negotiable.
- **You usually supply your own equipment.** A contractor laptop is your cost. A used business-grade laptop with 16 GB of RAM and an SSD is a perfectly adequate machine and costs a fraction of a new consumer one. Buy business models that come off corporate lease — they are built to be repaired and parts are easy to find.
- **You have no paid leave, no thirteenth month, and no separation pay** unless the contract says so. Price your rate accordingly. A contractor rate is not comparable to an employee salary; it has to cover the days you do not work.

The one thing that genuinely matters for remote contracting is **timezone overlap**. If the client needs you live from 9 a.m. to 6 p.m. US Eastern, that is 10 p.m. to 7 a.m. Philippine time — a night shift, worked alone from your house. If the client is Australian Eastern, the overlap is much friendlier: their morning is your early morning. Some employers only need a few hours of overlap and let you work the rest of your hours whenever you like; that is the arrangement to look for if you want to keep day-shift hours.

**Working from home is a professional skill.** Answer messages promptly. Join calls on time with a working microphone. Keep a quiet space. Tell your client in advance when you will be unavailable. In a remote role nobody can see you working, so reliability is the entire impression you make.

#### What local employers screen for at entry level

This surprises beginners, so read it carefully. For an entry-level service desk role, employers are **not** primarily screening for technical depth. They are screening for four things:

1. **Willingness to work shifts.** The interview question is usually direct: "Are you willing to work night shift, weekends, and holidays?" In a BPO environment this is close to a hard requirement, and a hesitant answer ends the process. If you are genuinely willing, say so plainly and say why. If you are not, target shared services and in-house roles instead of pretending.
2. **Clear spoken English.** Not accentless English — *clear* English. Can you be understood on a bad phone line by a tired user who is already annoyed? Can you slow down and repeat yourself without becoming defensive? Many companies run an initial screening call that exists almost entirely to test this. If you are nervous about it, the fix is practice, not vocabulary: record yourself explaining a simple fix, listen back, and repeat until it sounds natural.
3. **Reliability and attendance.** In a service desk, an absent agent means the queue breaks for everyone. Employers ask about your commute, your backup plans, and your history. The honest answer that helps you is a concrete one: "I live twenty minutes away, I have two routes, and if there is a transport strike I can work from home on my own connection." Reliability is a skill you can demonstrate before you are hired.
4. **The ability to follow a script and document properly.** This is the one that gets underestimated. A large part of the job is doing the same password reset forty times and writing forty clean notes. Employers test for it. A common interview exercise is a written ticket: they describe a scenario and ask what you would do. The candidate who writes "reset the password, confirmed with the user that they could log in, documented the ticket" beats the candidate who writes a technically clever answer that ignores the user.

Here is the honest version of the trade-off. **For entry-level support work, communication and reliability genuinely outweigh technical depth.** You can be taught which menu to click. You cannot easily be taught to show up on time, speak clearly, and not argue with a frustrated caller. That is why beginners with strong soft skills get hired ahead of beginners with stronger labs and no customer manner.

**But technical depth is what gets you out.** The roles described above have ceilings. A service desk agent who is excellent at following scripts gets promoted to senior agent or team lead, which is a modest step. The people who move into infrastructure, systems administration, or security operations are the ones who, in addition to being reliable, can actually diagnose a problem instead of reading a script at it. That is precisely why this roadmap keeps making you look at the machine, read the output, and write down the reasoning. Reliability gets you the job. Diagnosis gets you the career.

#### Internet and power reality

You live in a country with typhoon seasons, scheduled and unscheduled brownouts, and internet that varies enormously by location and by provider. This is a real constraint on remote work, and it is manageable. Manage it before it costs you a job.

**What actually happens and what it costs you.** A brownout takes down your PC, your router, and your modem at once. An unstable connection causes dropped calls, frozen remote sessions, and, worse, a supervisor who notices. A slow uplink — the upload speed, which is far lower than your download speed on most consumer plans — is what breaks video calls and screen sharing, not the download number. Most consumer plans in the Philippines have a much smaller upload than download, and remote support work depends on upload.

**Practical mitigations, cheapest first.**

- **A UPS for the router and modem.** A UPS (Uninterruptible Power Supply) is a battery box that sits between the wall socket and your equipment. A small one will keep a router and modem alive for a while during a short outage, which is often all you need — if the internet is delivered over fibre that stays powered at the other end, your connection can survive the brownout even if your PC does not. Put the router and modem on it first; those are the two devices you cannot swap quickly.
- **A UPS for the PC, or a laptop instead of a desktop.** A laptop *is* a built-in UPS. This is the single strongest argument for doing remote support work from a laptop: when the power drops, you keep working for a few hours, and you can move to somewhere with power. If you use a desktop, a UPS sized to your PC plus monitor gives you time to save work and shut down cleanly.
- **Mobile data as a backup path.** Keep a phone with a data plan and enough hotspot allowance to cover a full shift. Test it *before* you need it: connect your laptop through the hotspot, run a call, and see whether it holds. An untested backup is not a backup. Also know that a hotspot is usually a worse connection than your wired or fibre line, so treat it as a lifeline for voice and chat, not for heavy remote sessions.
- **A second ISP where available.** If your area has two providers — for example a fibre provider and a fixed wireless or cable provider — a second line is the real fix for the recurring-outage problem. It costs money, so most beginners do not start here, but it is the upgrade to plan for once you have income. Some providers offer a prepaid or lower-tier backup line that is cheap enough to justify.
- **Working from a coworking space, a café, or a relative's place during outages.** Coworking spaces in Philippine cities sell day passes and have generator backup and business-grade internet. If your area has frequent brownouts, a day-pass budget is often cheaper than a second ISP. A relative's house with a different provider is the free version of the same idea. Ask your employer in advance whether they allow it, and let your supervisor know when you are relocating so nobody thinks you have vanished.
- **Plan around known events.** Typhoon warnings and scheduled maintenance are usually announced. If you know a storm is coming, charge everything, download what you need offline, and tell your team lead early. Warning your supervisor is always better than disappearing.

**Non-alarmist framing:** you do not need a perfect connection to get hired. You need to be the person who has thought about it. In an interview, "I have a UPS on the router and modem, mobile data as a backup, and a coworking space nearby if my area loses power" is a much stronger answer than "my internet is fine." Nobody expects perfection. Everybody expects a plan.

#### The timezone math

The Philippines is on **UTC+8** and does **not** observe daylight saving time. That last part matters: the United States, the United Kingdom, and Australia all shift their clocks twice a year while you do not, so the offset between you and a client changes even though nothing changed on your end. In the tables below, treat the US and UK columns as "during their summer" — subtract one hour from the PH time for US Eastern and Pacific when they are on standard time, and remember that the UK is one hour closer to you in their winter.

**If you work a Philippine night shift** (a typical 9 p.m. to 6 a.m. PH shift is shown as 10 p.m. PH for a clean comparison point, since a 9 p.m. start corresponds to 9 a.m. US Eastern):

| PH time (UTC+8) | US Eastern (EDT, UTC−4) | US Pacific (PDT, UTC−7) | UK (BST, UTC+1) | Australia Eastern (AEST, UTC+10) |
|---|---|---|---|---|
| 10:00 p.m. | 10:00 a.m. | 7:00 a.m. | 3:00 p.m. | 12:00 a.m. (next day) |
| 12:00 a.m. (midnight) | 12:00 p.m. | 9:00 a.m. | 5:00 p.m. | 2:00 a.m. |
| 3:00 a.m. | 3:00 p.m. | 12:00 p.m. | 8:00 p.m. | 5:00 a.m. |
| 6:00 a.m. | 6:00 p.m. | 3:00 p.m. | 11:00 p.m. | 8:00 a.m. |

Read that first row as the headline: **a 10 p.m. start in Manila is 10 a.m. in New York.** Working Philippine nights is how you cover US business hours. Note also that Philippine nights are *not* Australian business hours — at 10 p.m. in Manila it is midnight in Sydney, so an Australia-facing role generally wants your early morning, not your graveyard.

**If you work a Philippine day shift:**

| PH time (UTC+8) | US Eastern (EDT, UTC−4) | US Pacific (PDT, UTC−7) | UK (BST, UTC+1) | Australia Eastern (AEST, UTC+10) |
|---|---|---|---|---|
| 8:00 a.m. | 8:00 p.m. (prev. day) | 5:00 p.m. (prev. day) | 1:00 a.m. | 10:00 a.m. |
| 10:00 a.m. | 10:00 p.m. (prev. day) | 7:00 p.m. (prev. day) | 3:00 a.m. | 12:00 p.m. |
| 1:00 p.m. | 1:00 a.m. | 10:00 p.m. (prev. day) | 6:00 a.m. | 3:00 p.m. |
| 4:00 p.m. | 4:00 a.m. | 1:00 a.m. | 9:00 a.m. | 6:00 p.m. |

Now read the trade-offs off the table:

- **A day shift in Manila gives you almost no US overlap.** At 8 a.m. in Manila it is 8 p.m. the previous evening in New York, and by the time your afternoon ends, the US East Coast is asleep. A US-facing role and a normal Philippine day shift are fundamentally incompatible unless the employer explicitly wants only a few hours of overlap or asynchronous work.
- **A day shift in Manila overlaps perfectly with Australia Eastern.** Your 8 a.m. is their 10 a.m.; your 4 p.m. is their 6 p.m. If you want to keep day hours and work for a foreign employer, **Australia is the timezone that fits your life** — and AU-facing support roles are common in Philippine BPOs for exactly this reason.
- **A day shift in Manila overlaps with the UK in your afternoon.** Your 4 p.m. is 9 a.m. in London, giving you a few usable hours. A UK-facing role usually wants a mid or afternoon shift rather than a very early one.
- **Night shift is not one thing.** A 10 p.m. start covers US Eastern business hours well, but a 2 a.m. start would put you at 2 p.m. in New York and 5 a.m. in London — useful for US Pacific and late UK, useless for Australia. When you read a posting, convert the stated hours into your own clock before you decide anything. The question is not "is this a night shift?" but "which part of my life does this shift occupy?"

One practical habit: keep a short timezone cheat sheet in your notes — Manila plus the four offsets above, with a note that US and UK shift in March and October or November. When a recruiter asks whether you can cover "9 to 6 EST", you want to answer immediately, not calculate for a minute and look unsure.

### Part 11 — Working with real users

The single most common reason a technically capable beginner struggles in their first IT job is not hardware knowledge. It is that nobody taught them how the human side of the job actually works. Tickets have a lifecycle. Problems have two different kinds of urgency. Escalating is a skill, not an admission of failure. And a large share of the job is writing, not fixing.

This part covers all of it.

#### The ticket lifecycle, end to end

A **ticket** is a record of a request or a problem, created so that the work can be tracked, assigned, and reported on. Every ticketing system — ServiceNow, Jira Service Management, Zendesk, Freshdesk, osTicket, and dozens more — implements roughly the same lifecycle. Learn it once and you can learn any tool in an afternoon.

**1. Report.** The user contacts support. This might be a phone call, an email, a chat, a walk-up, or a form. The person taking the report creates the ticket and captures the essentials: who they are, how to reach them, what they are trying to do, what is happening instead, when it started, and what changed recently. If you take a call and do not create a ticket, the work is invisible — nobody can see the queue, nobody can measure it, and when the problem comes back there is no history. **Never work without a ticket.**

**2. Triage and prioritisation.** Triage means looking at the incoming queue and deciding what to do first and who should do it. Not everything can be first. Triaging well means reading the ticket, judging its impact, and assigning it a priority (more on priority versus severity below). This stage is where a queue is either managed or lost.

**3. Assignment.** The ticket goes to a person or a team. At the entry level, you are usually the assignee, and the assignment comes with an expectation — often a time limit for first response. If you take the ticket and then cannot work on it, say so early. A ticket sitting silently with your name on it is worse than one that was reassigned ten minutes after it arrived.

**4. Investigation.** You gather information and form a hypothesis. This is the technical core, but note what it looks like in practice: ask the user questions, look at the machine, check logs, reproduce the problem, and change one thing at a time. Part 12 of this lesson is five worked examples of exactly this stage.

**5. Resolution.** You apply the fix. "Resolved" is a claim you are making about reality, so make it deliberately: you should be able to say what was wrong, what you changed, and why you believe that addressed the cause rather than a symptom.

**6. Verification with the user.** You ask the user to confirm that the problem is gone, in their own words, doing the thing that was broken. Not "is it working now?" — that question invites a reflexive "yes". Ask them to do it: *"Could you try printing that report again now and tell me what happens?"*

**7. Documentation.** You write the note. What the user reported, what you observed, what you did, what the result was, what happens next. This is the artefact that makes you look competent to your colleagues and your manager, and it is what saves the next technician from starting over.

**8. Closure.** The ticket is marked closed, usually after a short waiting period during which the user can reopen it. Only close when the user has confirmed, not when you believe you are finished.

**Why skipping verification causes reopen tickets.** A **reopen** is a ticket the user sends back because the problem was not actually fixed. Reopens are counted against the team, and an experienced technician treats a reopen as a personal failure, because it is almost always avoidable. Consider a user who says "my printer does not work". You clear a stuck print queue, see the document print from your own test page, and close the ticket. The user's actual problem was that *their* Excel file had a corrupted page range, so their next print job fails again and they reopen the ticket — now annoyed, because they had already been told it was fixed.

The verification step is what catches that. If you had said "please try printing the exact document that failed before", you would have found the real issue in the same call. Verification converts "I believe this is fixed" into "the user confirms this is fixed", and those are very different claims. It also has a second benefit: users who are asked to confirm feel involved rather than processed, which changes how they treat you for the rest of the relationship.

#### Priority versus severity

These two words are used loosely in conversation and precisely in a ticketing system, and beginners conflate them constantly.

- **Severity** measures how bad the *technical* problem is. Is a component broken? Is data at risk? Is a system down? Severity is a property of the fault itself.
- **Priority** measures how urgently the *business* wants it dealt with, relative to everything else. Priority is a property of the impact and the context.

They are independent axes. A single user can have a critical-severity problem and a low priority, and a trivial-severity problem can be top priority. The classic example: the CEO cannot connect to the projector five minutes before a board presentation. Technically this is a minor display issue — severity low. Business impact: very high. Priority: critical. Meanwhile, a senior engineer's workstation has a genuinely dying drive — severity high — but they have a spare machine and are travelling for two days. Priority: medium.

| Ticket | Severity (how bad technically) | Priority (how urgent to the business) | Why |
|---|---|---|---|
| Finance server is down on month-end close day | Critical | Critical | Total outage, and the timing multiplies the impact |
| Finance server is down on a quiet Tuesday with a working failover | Critical | Medium | Same severity, but the business is protected |
| Managing director cannot project during an earnings call in 10 minutes | Low | Critical | A small technical fault with a huge business consequence |
| One warehouse scanner is unresponsive; four other scanners work | Medium | Low | A real fault, but the workflow continues |
| A staff laptop battery lasts 20 minutes and the laptop is used for on-site client visits | Medium | High | The fault is moderate; the person cannot do their job without it |
| A staff laptop battery lasts 20 minutes but the laptop never leaves a desk with power | Medium | Low | The same fault has no practical consequence |
| A new hire's account is not created and they start tomorrow | Low | High | Trivial to fix, but a hard deadline makes it urgent |
| A user asks for a second monitor for convenience | Low | Low | Nice to have; schedule it, do not drop everything |

Two habits follow from this. First, **priority is not yours to set alone.** In a mature organisation, priority comes from an impact matrix agreed with the business, or from your team lead. You propose; the process decides. Second, **when a user asks you to hurry, translate the request into impact.** "This is urgent" is not information. "I have to submit this to the client in twenty minutes" is. Ask what breaks if it waits, and you can prioritise honestly instead of by whoever shouts loudest.

#### Escalation: when, how, and why it is a skill

**Escalation** means passing a ticket to someone with more access, more expertise, or more authority than you. Beginners treat it as an admission that they failed. Experienced technicians treat it as an expected part of the workflow, because no first-line agent can fix everything, and pretending otherwise is what actually causes harm.

**Escalate when:**

- The fix requires access you do not have — server administration rights, a firewall rule change, physical datacentre access, a vendor portal.
- You have exhausted your documented steps and the problem is unchanged.
- The issue is outside your team's scope: a third-party application's bug, an ISP outage, a hardware warranty repair.
- The impact is rising — more users affected, a critical business process stopped, or the problem is crossing into data loss or security territory.
- The user is requesting something your process forbids, such as a policy exception or an account with elevated rights.

**Do not escalate just because it is hard.** Escalating a "slow laptop" ticket before you have checked free space and Task Manager wastes a senior engineer's time on something a first-line agent is expected to solve, and it is obvious in the ticket history that you did not try. The honest test: could a competent colleague, reading your note and nothing else, tell what you already ruled out? If not, you are not ready to escalate — you are ready to write a better note.

**How to escalate well.** A handoff note must let the receiving engineer start working without contacting the user again. It needs:

1. **A one-line summary** of the problem in plain language.
2. **Who is affected and how many** — one user, a team, an entire site.
3. **The impact in business terms** — what work has stopped, and any deadline attached to it.
4. **What you have already checked, and the actual results.** Not "checked the disk" but "`C:` is at 4 % free (11 GB of 476 GB); cleared Temp and ran Disk Cleanup, recovered 3 GB; slowness persists".
5. **What you believe the cause is, and your confidence in it** — clearly labelled as a hypothesis.
6. **What you recommend**, and what you specifically cannot do yourself.
7. **How to reach the user**, their availability and timezone, and whether they are willing to have their machine restarted.
8. **Anything the user said that you could not verify** — this is often where the real clue is.

Escalating at the right moment, with a note like that, is one of the clearest signals that you understand the job. It protects the user, it protects the business, and it makes you look like someone who can be trusted with more. Escalating too late out of pride is the failure mode to avoid: the user suffers, the SLA suffers, and the ticket history shows that you sat on it.

#### SLAs explained

An **SLA** — a Service Level Agreement — is a written commitment about how fast a service will be delivered. It exists between a service provider and its customer: between an MSP and the business it supports, between an IT department and the rest of the company, or between a BPO and its foreign client. The SLA is a contract, and it has numbers in it.

Two numbers matter most at entry level:

- **First response target** — the maximum time from the ticket being logged to a human acknowledging it and starting work. This is often 30 minutes to 4 hours for normal-priority tickets, and much shorter for critical ones. Note what it measures: **acknowledgement, not resolution**. A user who has been told "I have your ticket, I am looking at it now, I will update you within two hours" is a very different user from one who has heard nothing.
- **Resolution target** — the maximum time to actually fix the problem and close the ticket. Normal-priority desktop issues are commonly measured in business days; critical outages in hours.

SLAs are usually tiered by priority, so a critical ticket might carry a one-hour response and a four-hour resolution, while a low-priority request might carry a next-business-day response and a five-day resolution. There are often separate clocks for business hours versus 24-hour coverage, and separate targets for "workaround provided" versus "permanent fix".

**Breaching an SLA** means exceeding the committed time. If the SLA says four hours to respond and nobody touches the ticket until hour five, that is a breach. What it means in practice:

- **It is visible.** SLAs are reported on. Teams have dashboards showing the percentage of tickets answered within target, and breaches appear in monthly reports to management or the client.
- **It has commercial consequences.** For an MSP or a BPO, repeated breaches can trigger service credits — money taken off the invoice — or, if bad enough, the loss of the contract. This is why your manager cares so much about the queue.
- **It damages trust.** On the user's side, an unacknowledged ticket teaches them that the IT team is not responsive. They stop logging tickets and start using workarounds, which is worse for everyone.
- **It is usually recoverable, but only if you say something.** If you can see you will miss a target, updating the ticket with a short note and a new expectation is almost always better than silence. Most SLAs are breached by silence, not by slowness.

Your practical obligations as a first-line agent are small and specific: **read your queue at the start of every shift, respond within the first-response target even if you cannot fix anything yet, update the ticket when something changes, and never leave a ticket without an owner.** If you do those four things, you will not be the reason for a breach.

#### Communicating with a frustrated or angry user

A user who is angry is usually not angry at you. They are angry that their work has stopped, that they have a deadline, and that they have already spent twenty minutes on hold. Your job in the first thirty seconds is not to fix anything — it is to make them feel that a competent person has taken ownership.

**What good looks like:**

- **Acknowledge the impact before the technology.** "That sounds frustrating — you have a report due and you cannot get to your files." Name the consequence, in their terms. This costs you nothing and defuses a remarkable amount.
- **Take ownership of the next step, not of the whole world.** "I am going to look at this with you right now, and I will stay with you until we have an answer or I have handed it to someone who can fix it."
- **Be honest when you do not know.** "I do not know yet what is causing this. What I can tell you is that I will find out, and I will update you by 3 p.m. either way." An honest unknown plus a commitment beats a confident guess every time.
- **Set an expectation and then meet it.** If you say 3 p.m., update at 3 p.m. — even if the update is "still investigating, here is what I have ruled out so far." Users forgive a slow fix. They do not forgive being forgotten.
- **Confirm understanding rather than assuming it.** "Before we go further, can I check I have this right — it started after the update on Tuesday, and it happens on every document, not just that one?"

**What not to say, and why:**

- **"Calm down."** It tells the user their reaction is the problem. It has never once worked.
- **"That is not my job."** Even when it is technically true, the correct sentence is "That is outside what I can change, so let me get you to the person who owns it."
- **"You must have done something."** Blaming the user makes them defensive and, often, makes them stop telling you things you need to know.
- **"It works on my machine."** This is information about your machine, not their problem, and it sounds like an accusation.
- **"Just restart it."** As the first sentence with no explanation, this reads as a brush-off. As a step with a reason — "the print service sometimes holds a stuck job, and restarting clears it" — it is a legitimate action.
- **"I will try."** Vague. Say what you will do and by when.

**Do not argue, ever.** Even when you are right. The goal is a working user, not a corrected one. If a user insists on a theory you believe is wrong, you do not have to win: "That is possible — let us test it. If it is not that, we will have ruled something out and I will keep going." You keep the relationship, you keep the information flowing, and you get to the answer either way. Arguing costs you the call, the ticket, and the user's cooperation on the next one.

Here are six realistic exchanges, with the weak response and a better one:

| What the user says | Weak response | Better response |
|---|---|---|
| "This is the third time I have reported this and nobody has fixed it!" | "I can only deal with today's ticket, ma'am. There is no record of the earlier ones on my end." | "Three times is too many, and I am sorry. Let me pull up the earlier tickets now so I can see what was already tried, and I will keep this one until it is actually resolved." |
| "My laptop has been slow for a month and IT keeps ignoring me." | "Have you tried restarting it?" | "A month is a long time to work like that. Let me look at it with you now — I am going to check your free disk space and what is starting up with Windows, because those are the two most common causes of a slow machine." |
| "I do not know, I am not a computer person. Just fix it." | "I need you to tell me what the error says or I cannot help." | "That is completely fine — you do not need to be. Could you read me the first line of the message on your screen, word for word? That one line usually tells me exactly where to look." |
| "I do not have time for this, I have a meeting in ten minutes." | "Well, you called me. I need at least twenty minutes." | "Understood — let us do the fastest thing first. Try signing in once more now while I watch the account on my side. If it fails, I will set a temporary password you can change later, and we can do the full fix after your meeting." |
| "Are you sure? The last person told me something different." | "Well, they were wrong." | "It is possible they were right and I am missing something. Let me show you what I am seeing on my side, and if it does not match what they found, we will investigate the difference instead of guessing." |
| "I need this fixed NOW." | "There are other people ahead of you in the queue." | "I hear you. Tell me what breaks if this waits an hour, and I will tell you honestly where it sits against everything else I am holding right now." |

Notice the pattern in the better column: name the impact, take ownership, explain the *why* behind the next step, and give a concrete commitment. None of those responses require technical brilliance. They require attention.

#### Remote support mechanics

Most of this work is done remotely, which means you never touch the machine — you guide the user, or you connect to their screen.

**Remote desktop tools** let you see and control another computer over a network. The user installs or runs a small program, gives you a code or accepts a prompt, and their screen appears in a window on yours. You can then move their mouse and type on their keyboard as if you were sitting there. Common tools include **Quick Assist**, which is built into Windows and free, **Windows Remote Assistance**, also built in, and third-party options such as RustDesk or Chrome Remote Desktop. In a corporate environment you will usually use whatever the company has licensed — TeamViewer, AnyDesk, LogMeIn, or a tool built into the service desk platform. The mechanics are the same in all of them, and you can learn a new one in ten minutes.

**Ask permission before you connect. Always.** This is not a formality. You are about to see everything on that person's screen: their email, their personal photos, their banking tab, a half-written message to their manager. State what you are going to do and what you will be able to see, and wait for a clear yes:

> *"I would like to connect to your screen so I can see the error myself. While I am connected I will be able to see whatever is on your display, and I can move your mouse and type. Is that all right? You can end the session at any time by closing the window."*

Never join a session the user did not agree to. Never connect to a machine to "take a quick look" without telling the person using it. Beyond the obvious ethical problem, being seen to do this will end your career in this industry faster than any technical mistake, and in many organisations it is a disciplinary matter on its own.

**Narrate what you are doing.** Say what you are about to do before you do it, and why. "I am opening Task Manager now — I want to see which program is using the disk." This does three things: it keeps the user from being alarmed by the cursor moving on its own, it lets them stop you if they know something you do not, and it teaches them something so they may not need to call next time. It also means that if the connection drops mid-task, the user knows where you were.

**Security basics while you are connected:**

- **Never connect without consent**, and never leave a session open and unattended. End it when you are done and confirm on the call that it has ended.
- **Be careful with credentials on screen.** If a user types a password while you are watching, look away or tell them to type it without saying it aloud. If you must reset a password for them, use a temporary one that they change immediately, and never write a password into the ticket notes. Ticket systems are read by many people.
- **Do not perform actions the user has not agreed to.** Installing software, changing settings, deleting files, or opening their email — all of these need to be said out loud first.
- **Be careful what appears on your own screen.** Notifications, chat windows, and other users' tickets can pop up while screen sharing. Close what you do not need, and know how to pause or stop sharing instantly.
- **If you see something that should not be there** — evidence of a security incident, sensitive data in the wrong place, a personal file that is clearly not work-related — do not comment on it to the user and do not go looking further. Report it through your organisation's process. Handling that correctly is Phase 6 material; recognising that you should stop and report is Phase 1 material.

#### Writing ticket notes a colleague can act on

The note is the product. A ticket with a good note can be picked up by anyone; a ticket with a bad note has to be re-investigated from scratch, which wastes the user's time twice and makes the team look incompetent.

Here is the same ticket written two ways.

| Weak note | Strong note |
|---|---|
| **Ticket:** "User cannot print."<br><br>**Note:** "Checked printer, seems fine now. User will monitor. Closing ticket." | **Ticket:** "User cannot print to the Finance department printer (FIN-HP-02)."<br><br>**Note:** "User reported that documents sent to FIN-HP-02 stay in the queue and never print; started this morning; no changes to their PC reported. Asked the user to print a test page from Notepad — it printed successfully from the printer's own panel test, but the job from their PC stayed queued. Checked Printers and devices: FIN-HP-02 was set as default and showed 'Offline'. The printer's IP address in the port settings did not match the address shown on the printer's network configuration page. Removed the old printer entry and re-added it using the current address; printed a test page from Notepad — printed immediately. Asked the user to print the original Excel report that failed; it printed correctly and they confirmed. Cause: printer's IP address had changed, so the PC was sending jobs to an address nothing was listening on. Note for the next agent: this printer is on DHCP and may change address again — recommend a DHCP reservation." |

The difference is not length for its own sake. Look at exactly what changed:

1. **The problem is specific and named.** "Cannot print" is not a problem description; "cannot print to FIN-HP-02, jobs stay queued" is. A colleague can now tell whether the same fault recurs.
2. **Context is captured.** When it started, and whether anything changed. That is the timeline that makes the ticket searchable later.
3. **Observations are separated from actions.** You can see what was true (the job stayed queued, the port address did not match) before anything was done about it. A colleague reading only the actions cannot tell what the evidence was.
4. **One change at a time.** The technician did not reinstall drivers *and* change the port *and* restart the print spooler. They identified the mismatch and fixed that one thing. That is why the note can claim a cause.
5. **Verification is recorded with the user's words.** Not "tested, works" but "asked the user to print the original document; it printed and they confirmed." This is the difference between *resolved* and *closed without a reopen*.
6. **A hypothesis is stated as a hypothesis, with the evidence.** "The printer's IP address had changed" is supported by the mismatch that was observed. Not "it is probably the network."
7. **There is a handoff line.** The DHCP reservation recommendation tells the next technician what to do when it happens again in three weeks. That single sentence is what turns a fixed ticket into an improved one.

A useful template to keep in your notes while you build the habit:

> **What the user reported:** (their words, plus the impact)
> **What changed recently:** (or "nothing reported")
> **What I observed:** (the evidence — commands run, what was on screen, actual output)
> **What I did:** (one change at a time, in order)
> **How I verified:** (what the user did to confirm, in their words)
> **Cause:** (or "not confirmed — hypothesis is …")
> **Next step / for the next agent:** (what to do if it recurs)

That is six lines. It takes two minutes. It is the difference between a ticket that helps and a ticket that wastes everyone's time.

### Part 12 — A worked ticket set

Reading about tickets teaches you the shape of the process. Writing them teaches you the reasoning. Below are five complete tickets, worked at exactly the level a first-line Phase 1 technician can work them. Each one shows what the user said, what you ask, what you observe, the real command output, what you do, how you verify, and the final note.

Read these for the **reasoning**, not the specific fixes. The pattern in all five is the same: clarify the vague complaint, gather cheap evidence before expensive evidence, change one thing, verify with the user, document the cause.

A note before you start: these tickets deliberately stay inside Phase 1 territory. Where a fix or a diagnosis belongs to a later phase, the ticket says so explicitly rather than pretending you could do it today. Knowing the boundary of your own knowledge is part of the job.

#### Ticket 1 — "My computer is so slow"

**What the user said (ticket description):**

> "My computer is so slow I can barely work. Everything takes forever to open. Can someone please look at it, this is the third day."

**What you ask.**

Never act on "slow". Slow compared to what, when, and doing what? You ask four questions:

1. "Is it slow all the time, or worse at certain times — like first thing in the morning?"
2. "Is it slow opening everything, or mainly when you are in the browser with many tabs?"
3. "Did anything change recently — an update, new software, did the machine move?"
4. "How full is your hard drive? Can you open File Explorer, click This PC, and tell me what it says under your C: drive?"

The user answers: slow all the time, worse in the morning, worst in the browser, no obvious change, and *"the C drive bar is red — it says 4.1 GB free of 237 GB."*

That single answer already tells you a great deal. A system drive with 4 GB free out of 237 GB is under 2 % free. This is a very common cause of a genuinely slow machine, and it costs nothing to check.

**What you observe.**

You ask permission to connect, then look at the machine. In Task Manager, the **Disk** column is pinned near 100 % while the CPU and memory are unremarkable — a classic signature of Windows struggling for free space rather than a processor problem.

```powershell
Get-Volume | Where-Object DriveLetter -eq 'C' |
  Select-Object DriveLetter, FileSystem,
    @{N='SizeGB';E={[math]::Round($_.Size/1GB,1)}},
    @{N='FreeGB';E={[math]::Round($_.SizeRemaining/1GB,1)}},
    @{N='FreePct';E={[math]::Round(100*$_.SizeRemaining/$_.Size,1)}}
```

```text
DriveLetter FileSystem SizeGB FreeGB FreePct
----------- ---------- ------ ------ -------
C           NTFS        236.7    4.1     1.7
```

You also look at what runs at startup, because "worse in the morning" plus a slow browser usually means too many things starting with Windows:

```powershell
Get-CimInstance Win32_StartupCommand |
  Select-Object Name, Command | Format-Table -AutoSize
```

```text
Name              Command
----              -------
OneDrive          "C:\Program Files\Microsoft OneDrive\OneDrive.exe" /background
Spotify           "C:\Users\rj\AppData\Roaming\Spotify\Spotify.exe" --autostart
Adobe Updater     "C:\Program Files\Common Files\Adobe\Updater\Updater.exe"
Steam             "C:\Program Files (x86)\Steam\steam.exe" -silent
Teams             "C:\Users\rj\AppData\Local\Microsoft\Teams\current\Teams.exe" --autostart
Discord           "C:\Users\rj\AppData\Roaming\Discord\Discord.exe" --autostart
```

Seven startup entries on an 8 GB machine is enough to make the first twenty minutes of every day feel awful. Spotify, Steam, and Discord are not work software. None of them are *broken* — they are just competing for the same limited resources at the worst possible moment.

**What you do.**

You make **one change at a time** and note the result after each. This matters: if you do everything at once and it gets faster, you cannot tell the user which change fixed it, and you cannot tell the next person either.

*Change 1 — free space, without deleting anything the user needs.*

You do not start deleting files. You start with Windows' own tools, which only remove things Windows can regenerate. **Disk Cleanup** (`cleanmgr`) removes temporary files, thumbnails, recycle bin contents, and old Windows Update leftovers. You run it including the **Clean up system files** option, which exposes the larger categories such as previous Windows installations and delivery optimisation files. You also clear the two temp folders, which is a standard, safe action:

```powershell
# Size before
(Get-ChildItem $env:TEMP -Recurse -Force -ErrorAction SilentlyContinue |
  Measure-Object Length -Sum).Sum / 1GB
```

```text
3.2841
```

```powershell
Get-ChildItem $env:TEMP -Recurse -Force -ErrorAction SilentlyContinue |
  Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
```

Result: `C:` FreeGB moves from **4.1 GB to 24.6 GB**. That is the single largest improvement of the whole ticket, and it took one built-in tool.

*Change 2 — startup programs.*

You do **not** disable items by editing the registry or hunting through folders. You open **Task Manager → Startup apps** and set the non-work entries to **Disabled** — Spotify, Steam, and Discord. You leave OneDrive and Teams alone, because those are work tools and the user relies on them, and you leave the Adobe updater alone unless the user confirms they do not use Adobe. You tell the user exactly what you disabled and why, and that they can re-enable any of them.

You check what is actually running right now, for the note:

```powershell
Get-Process | Sort-Object WS -Descending |
  Select-Object -First 8 Name, @{N='MemMB';E={[math]::Round($_.WS/1MB,0)}}
```

```text
Name          MemMB
----          -----
chrome         1842
Teams           612
explorer        298
Discord         271
Spotify         238
OneDrive        145
```

Chrome at 1.8 GB on an 8 GB machine with several tabs open is a real constraint. You mention it to the user as a behaviour, not a fault: closing tabs they are not using will help, and so will fewer extensions.

*What you do not do.* You do not run a registry cleaner, install a "PC speedup" utility, or delete files out of the user's Documents folder. The first is useless at best, the second is a common route to malware, and the third is how you lose a user's thesis.

**How you verify.**

You do not ask "is it faster?" — that invites a polite yes. You ask the user to do the specific thing that was slow, while you watch:

> *"Could you open Chrome and load your email the way you normally start the day, and tell me whether it feels different?"*

The user opens Chrome, the inbox loads, and they say it is noticeably faster and that the red bar on the drive is gone. You confirm the free space figure remained stable after a reboot, and you reboot once with the user's agreement to make sure the change holds.

**Final ticket note.**

> **Reported:** User reported the computer being "so slow I can barely work" for three days, worst in the first hour each morning and when using the browser.
> **Changed recently:** Nothing reported by the user.
> **Observed:** `C:` had 4.1 GB free of 236.7 GB (1.7 %). Task Manager showed Disk activity pinned near 100 % with CPU and memory normal. User temp folder held 3.28 GB. Startup entries included Spotify, Steam, Discord, Adobe Updater alongside OneDrive and Teams.
> **Action (one change at a time):** 1) Ran Disk Cleanup including system files and cleared the user temp folder — free space rose from 4.1 GB to 24.6 GB. 2) Disabled Spotify, Steam, and Discord from Task Manager → Startup apps; left OneDrive, Teams, and the Adobe updater enabled as work tools. 3) Advised the user on browser tab count (Chrome was using 1.8 GB). No registry cleaners, no third-party tune-up tools, no user files deleted.
> **Verified:** Asked the user to open Chrome and load their inbox; they confirmed the machine felt noticeably faster. Rebooted with the user's agreement and confirmed free space and startup settings persisted.
> **Cause:** System drive effectively full (under 2 % free) plus a long startup list. Both are configuration issues, not hardware faults.
> **For the next agent:** Drive is 237 GB and likely to refill. If the user reports slowness again, check free space first. An SSD upgrade is not applicable here — the machine is already responsive once space is available. If slowness returns with plenty of free space, move to the thermal and memory checks.

**Reasoning to take away:** "Slow" is not a diagnosis. The cheapest evidence — free space and startup list — is checked first because it is free, instant, and accounts for a large share of real slow-computer tickets. Change one thing at a time so the note can state a cause.

#### Ticket 2 — "My second monitor stopped working"

**What the user said:**

> "My second monitor stopped working this morning. The first one is fine. I did not touch anything."

**What you ask.**

1. "When you say stopped working — is the screen black, does it say 'no signal', does it show the desktop but frozen, or does Windows not see it at all?"
2. "Did the machine move, did anyone clean the desk, did you plug anything in or out yesterday?"
3. "Is the second monitor's power light on?"

The user replies: *"It says 'No Signal' and goes to sleep. The power light is blue, so it is on. And yes — actually, someone cleaned the desk yesterday and moved the monitors to dust behind them."*

That last sentence is the answer to most tickets like this, and it also tells you the machine was physically disturbed. "I did not touch anything" is almost never literally true.

**What you observe.**

You ask permission to connect and check what Windows thinks is attached:

```powershell
Get-CimInstance Win32_VideoController |
  Select-Object Name, CurrentHorizontalResolution, CurrentVerticalResolution
```

```text
Name                            CurrentHorizontalResolution CurrentVerticalResolution
----                            --------------------------- -------------------------
Intel(R) UHD Graphics 620                               1920                       1080
```

Only one resolution is reported, and the user told you they normally have two screens — so Windows is seeing one display. That points at the connection between the PC and the second monitor, not at the monitor itself.

Two facts narrow it further. First, **the monitor is powered on** (blue light), so it is not a dead monitor or a dead power cable. Second, **Windows sees only one display**, so the signal is not reaching the PC. "No signal" on the monitor plus one display in Windows means the problem is somewhere on the cable path or in the input selection.

The three candidates are: the cable came loose at either end, the cable was plugged into a different port, or the monitor's input source was changed to the wrong input. A four is that the monitor or the cable has genuinely failed, but that is far less likely than the first three and you test it last.

**What you do.**

You work from the monitor backwards, one thing at a time, asking the user to do each physical step and report what they see. You cannot see their cable, so your questions have to be precise.

1. **Check the monitor's input source.** Most monitors have a button for input selection, often labelled **Source** or **Input**. You ask the user to press it and read out the options. It shows `HDMI 1 / HDMI 2 / DisplayPort / VGA`, and the highlighted input is **HDMI 2**. Their cable is in **HDMI 1**. Changing the input to HDMI 1 brings the second screen back immediately.

If that had not fixed it, the next steps, in order, would be:

2. **Reseat the cable at both ends.** Power off the monitor, unplug the cable at the monitor and at the PC, look at both connectors for bent pins or damage, and push both back in firmly. A DisplayPort cable in particular can look inserted while not being latched, and DisplayPort connectors have a small latch that must be pressed to release them.
3. **Check it is plugged into the right port.** On a desktop with a separate graphics card, the video ports on the motherboard are often disabled while a card is installed. A cable moved from the card to the motherboard during desk cleaning would produce exactly this symptom. You ask the user to describe which row of ports the cable is in, and whether there is only one set.
4. **Swap the cable.** If the monitor has another input, try a different cable type. A spare HDMI cable from a television is a perfectly good test cable.
5. **Test the monitor on something else.** If nothing else works, connect the monitor to a laptop or a game console. If it works there, the monitor is fine and the fault is on the PC side; if it does not, the monitor or its cable is the suspect.

**How you verify.**

The input change restores the display, but restoring the picture is not the same as fixing the ticket. You ask the user to do the exact thing they were doing when it broke:

> *"Could you drag a window from your left screen to your right screen now, and tell me if it moves across smoothly?"*

They do, and it works. You then ask them to check that Windows sees both displays properly:

```powershell
Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.Screen]::AllScreens |
  Select-Object DeviceName, Primary, @{N='Bounds';E={$_.Bounds}}
```

```text
DeviceName Primary Bounds
---------- ------- ------
\\.\DISPLAY1    True {X=0,Y=0,Width=1920,Height=1080}
\\.\DISPLAY2   False {X=1920,Y=0,Width=1920,Height=1080}
```

Two displays, side by side, second one not primary. That is exactly right, and it is a much better piece of evidence for the note than "looks fine now".

**Final ticket note.**

> **Reported:** User reported the second monitor showing "No Signal" and sleeping since that morning; primary monitor unaffected. User initially reported no changes.
> **Changed recently:** On further questioning, the desk was cleaned the previous day and both monitors were moved.
> **Observed:** Monitor power light blue (powered on). `Win32_VideoController` reported only one active resolution (1920×1080), so Windows was detecting a single display. Monitor OSD showed the active input as HDMI 2.
> **Action:** Walked the user through the monitor's input selection. Physical cable was connected to HDMI 1; the monitor had been left on HDMI 2, most likely during the desk clean. User switched the input to HDMI 1. No cable reseat, driver change, or hardware replacement was needed.
> **Verified:** User dragged a window between the two screens successfully. `[System.Windows.Forms.Screen]::AllScreens` confirmed two displays at 1920×1080 side by side, DISPLAY1 primary.
> **Cause:** Monitor input source set to the wrong port after the monitors were moved.
> **For the next agent:** If it recurs, reseat both cable ends before suspecting hardware — the DisplayPort latch in particular can be knocked loose when monitors are moved. Monitor make/model and cable type recorded in the asset notes.

**Reasoning to take away:** "The monitor is broken" is almost never the whole story. Split the signal path into its parts — is the monitor powered, does the PC see a display, is the correct input selected, is the cable seated, is it in the right port — and test the free checks before the paid ones. The user's "I did not touch anything" is worth one more question, every time.

#### Ticket 3 — "The computer won't turn on"

**What the user said:**

> "My computer will not turn on at all. I pressed the power button and nothing happens. I need it for a meeting in an hour."

**What you ask.**

"Won't turn on" covers at least four different failures, and the first job is to find out which one you have:

1. "When you press the power button, does anything happen at all — any light, any fan noise, any beep?"
2. "Is the monitor showing a message, or is it completely black?"
3. "Are the monitor and the PC both plugged in? Is there a switch on the extension cord or the socket?"
4. "Is this a desktop or a laptop? Is it on a UPS or an extension lead?"

The user answers: *"It is a desktop. The fan spins, I can hear it. The monitor is just black — it says 'no signal' and then goes to sleep. It is on an extension cord with a switch."*

Fans spinning changes the diagnosis entirely. That is **not** a machine failing to power on — that is a machine powering on with no display, which this lesson already covered in the symptom table. The power supply is working, the button works, and the components are receiving power. What is missing is the picture.

**What you observe.**

You have three signals to work with, and you collect all three before changing anything.

- **Fans spinning and any panel light on:** the machine has power.
- **"No signal" on the monitor then sleeping:** the monitor is powered and awake but is receiving nothing on its currently selected input. A monitor with no input at all sleeps; that is normal behaviour, not a monitor fault.
- **No beep codes and no diagnostic light on the case:** the motherboard is not reporting a POST failure. If the machine had failed memory training or had a dead GPU, you would often see a repeating beep pattern or a lit diagnostic LED, depending on the board.

So the evidence points at the connection between the PC and the monitor, or at the monitor's input selection — the same two things as Ticket 2, but now with no picture at all rather than a second screen missing.

**What you do.**

The order matters, and the order is: free and physical before anything invasive.

1. **Check the power first, at both ends.** The user confirms the extension cord switch is on and the PC is plugged in. You ask them to confirm the *monitor's* power cable as well, and that the monitor has its own power light. It does. Good — the monitor is powered.

2. **Check the monitor's input.** Same as Ticket 2: press the input/source button and read out the options and which one is highlighted. The user reports the monitor is set to **DisplayPort** and the cable is a **VGA** cable with a blue connector, going into a blue port on the back of the PC. The monitor has a VGA port and a DisplayPort, and the VGA port is empty — the cable in use runs to a different, unused input, or the cable is fine but the monitor was left on the wrong input after somebody unplugged a games console. The user switches the monitor input to **VGA**. The display comes up.

3. **If that had not worked, check the cable seating.** Unplug the VGA connector at both ends, check for bent pins — VGA connectors have fifteen thin pins and bent pins are common — and reseat firmly. VGA connectors have thumbscrews; if they are cross-threaded, the connector can sit at an angle and lose contact on some pins.

4. **If the machine were truly dead** — no fans, no lights at all — the sequence would be different. You would check the socket with a known working device, try a different power cable, check the PSU switch on the back of the desktop (it is easy to knock to **O** by accident when moving a desk), and confirm the extension lead has not tripped. You would *not* open the case at this point, and you would not tell the user to, because mains power inside a desktop is genuinely dangerous and that work belongs to someone qualified.

5. **If it powered on but there was no display and the machine was beeping**, that is a POST failure and belongs to the memory and motherboard checks you already learned in this lesson — reseat RAM, remove peripherals, test one stick at a time — and it escalates if it does not resolve.

**How you verify.**

The picture is back, but you have a meeting in an hour to think about. You verify in the way that matches the user's actual need:

> *"Your screen is back. Before we finish, could you open the file you need for that meeting and confirm it loads — I would rather find a second problem now than five minutes before you present."*

They open the presentation, it loads, and they confirm they can see it on the monitor. You also ask them to leave the monitor input alone and to note which input it should be on, and you suggest they label the cable.

**Final ticket note.**

> **Reported:** User reported the desktop "would not turn on at all"; meeting in one hour; urgent.
> **Changed recently:** Not reported; the desk had been rearranged recently per the user's later comment.
> **Observed:** Fan audible and case power light on, so the machine was receiving power and running. Monitor powered (own power light on) but displaying "No Signal" then sleeping. No beep codes and no diagnostic LED on the case, so no POST failure was indicated. Monitor's active input was DisplayPort while the connected cable was VGA.
> **Action:** Confirmed both the PC and the monitor were powered at both ends. Walked the user through the monitor's input selection and changed it from DisplayPort to VGA, matching the connected cable. No case was opened, no components were reseated, no power supply work was attempted.
> **Verified:** User opened the presentation file required for their meeting and confirmed it displayed correctly on the monitor. Confirmed the machine had been restarted successfully in the same session.
> **Cause:** Monitor input source did not match the connected cable. The machine was never failing to power on — it was powering on with no display.
> **For the next agent:** Advised the user to label the VGA cable and leave the monitor input on VGA. If the user later reports a genuinely dead machine (no fans, no lights), check the socket, the PSU switch, and the power cable first; do not instruct the user to open the case.

**Reasoning to take away:** The user's description of the symptom is the least reliable evidence in the ticket. "Won't turn on" turned out to mean "turns on, shows nothing". One question — *does anything happen at all when you press the button?* — splits the entire diagnosis in two, and it costs nothing to ask.

#### Ticket 4 — "It says low disk space and won't let me update"

**What the user said:**

> "Windows keeps telling me my disk is full and now the updates will not install. It says I need to free up space. I do not know what is safe to delete."

**What you ask.**

1. "Can you read me the exact message, and tell me which drive it names?"
2. "Have you tried deleting anything already?"
3. "Do you use this machine for work files, photos, or anything you would be upset to lose?"

The user reads out: *"Your device is low on space. Windows needs more space to install updates. Free up space on C:."* They have not deleted anything. The machine holds work documents and some personal photos of their children, and they are worried about losing them.

That last answer changes your approach. Anything that risks the photos is off the table. You also confirm the drive is `C:` and not an external drive or a phone.

**What you observe.**

```powershell
Get-Volume | Where-Object DriveLetter |
  Select-Object DriveLetter, FileSystemLabel, FileSystem,
    @{N='SizeGB';E={[math]::Round($_.Size/1GB,1)}},
    @{N='FreeGB';E={[math]::Round($_.SizeRemaining/1GB,1)}},
    @{N='FreePct';E={[math]::Round(100*$_.SizeRemaining/$_.Size,1)}}
```

```text
DriveLetter FileSystemLabel FileSystem SizeGB FreeGB FreePct
----------- --------------- ---------- ------ ------ -------
C           Windows         NTFS        118.2    3.6     3.0
D           Data            NTFS        931.5  612.4    65.7
```

Two useful facts here. First, `C:` is at 3.0 % free — below the threshold where Windows Update will refuse to install, which matches the message exactly. Second, there is a second drive `D:` with 612 GB free. The user's photos may not even need to be deleted; they may need to be *moved*, which is a much better answer for a worried user.

You find out what is using the space before deleting anything:

```powershell
Get-ChildItem C:\Users\rj -Directory -Force -ErrorAction SilentlyContinue |
  ForEach-Object {
    [PSCustomObject]@{
      Folder = $_.Name
      SizeGB = [math]::Round((Get-ChildItem $_.FullName -Recurse -Force -ErrorAction SilentlyContinue |
        Measure-Object Length -Sum).Sum / 1GB, 2)
    }
  } | Sort-Object SizeGB -Descending | Select-Object -First 8
```

```text
Folder        SizeGB
------        ------
AppData        21.47
Downloads      12.83
Pictures        9.62
Documents       4.15
Videos          2.07
Desktop         1.34
Music           0.41
```

`AppData` at 21 GB is normal on a machine that has been used for years — it holds application data, browser profiles, and caches, and you must not delete it wholesale, because doing so destroys browser profiles, saved settings, and sometimes application licences. `Downloads` at 12.8 GB is the safest large target, but it is also where a user's important files often end up. So you **look at it with the user**, sorted by size, rather than clearing it.

**What you do.**

Again, one change at a time, safest options first.

*Change 1 — Windows' own cleanup tools.*

You run **Disk Cleanup** (`cleanmgr`) as yourself first, then as **Clean up system files** to expose the larger categories. The categories that matter are:

- **Temporary files** — safe, Windows regenerates them.
- **Recycle Bin** — you confirm with the user first, in case they intentionally put something there.
- **Delivery Optimisation Files** — cached update content Windows can re-download. Safe.
- **Previous Windows installation(s)** — the old operating system from an upgrade, often 10–20 GB. Safe *if* the user is not planning to roll back, which you confirm.
- **Windows Update Cleanup** — superseded update files. This is the big one for this ticket, and it is exactly what the user needs to remove so that new updates can install.

You also use the modern equivalent, which is scriptable and shows you what it would remove:

```powershell
# Report what Windows Update cleanup would free
Dism.exe /Online /Cleanup-Image /AnalyzeComponentStore
```

```text
Component Store (WinSxS) information:

Windows Explorer Reported Size of Component Store : 9.41 GB
Actual Size of Component Store : 8.92 GB
    Shared with Windows : 5.30 GB
    Backups and Disabled Features : 3.12 GB
    Cache and Temporary Data : 0.50 GB
Date of Last Cleanup : 2024-01-11 09:22:41
Number of Reclaimable Packages : 6
Component Store Cleanup Recommended : Yes
```

`Component Store Cleanup Recommended : Yes` is the machine telling you there is safe space to reclaim. You run the cleanup:

```powershell
Dism.exe /Online /Cleanup-Image /StartComponentCleanup
```

*Change 2 — move, do not delete.*

You ask the user to open `Downloads` in File Explorer sorted by size, and you go through it **with them**, not for them. Files they recognise as installers for software they already have (`Setup.exe`, `installer.msi`, old driver packages) are deleted. Work documents and photos are **moved to `D:`** into an organised folder, not deleted. This respects the user's fear and solves the problem: 12.8 GB of `Downloads` becomes about 2 GB, and nothing is lost.

You also point out that their `Pictures` folder at 9.6 GB can live on `D:` permanently, and you offer to help set that up later — but you do not move personal photos without being asked, because you cannot know which ones matter.

*What you do not do.* You do not delete the `AppData` folder, you do not run a script that clears every temp and cache location system-wide, you do not "compress" the whole drive, and you do not remove the user's restore points without telling them. Each of those either breaks something or trades a real problem for a hidden one.

*Then run the update.* Only after space is available do you install the pending updates. You check the state first:

```powershell
Get-WindowsUpdateLog -LogPath $env:TEMP\wu.log
Get-CimInstance Win32_QuickFixEngineering | Select-Object -Last 5 HotFixID, InstalledOn
```

```text
HotFixID  InstalledOn
--------  -----------
KB5034123 01/09/2024
KB5032190 11/14/2023
KB5031354 10/11/2023
```

Then you trigger the update check from **Settings → Windows Update → Check for updates**, and let it install. You do not force anything; the update failing was a *symptom* of the full disk, and fixing the disk is the actual repair.

**How you verify.**

Two things must be true: the updates install, and the space stays free.

```powershell
Get-Volume | Where-Object DriveLetter -eq 'C' |
  Select-Object DriveLetter,
    @{N='FreeGB';E={[math]::Round($_.SizeRemaining/1GB,1)}},
    @{N='FreePct';E={[math]::Round(100*$_.SizeRemaining/$_.Size,1)}}
```

```text
DriveLetter FreeGB FreePct
----------- ------ -------
C             38.9    32.9
```

And you ask the user to confirm the thing that was actually broken:

> *"Could you go to Windows Update and click Check for updates now, and tell me whether it completes and whether you still see the low space warning?"*

The user reports the update installed, the machine restarted, and the warning is gone. They also confirm their photos are still present in the new `D:` folder, which matters as much as the fix.

**Final ticket note.**

> **Reported:** User reported repeated "Your device is low on space … free up space on C:" messages and Windows updates refusing to install. User explicitly did not want to risk personal photos stored on the machine.
> **Changed recently:** Not applicable — gradual accumulation over years of use.
> **Observed:** `C:` 118.2 GB total, 3.6 GB free (3.0 %) — below the threshold where Windows Update will proceed. `D:` has 612.4 GB free. Profile scan: AppData 21.5 GB, Downloads 12.8 GB, Pictures 9.6 GB. `DISM /AnalyzeComponentStore` reported 9.41 GB component store with 6 reclaimable packages and "Component Store Cleanup Recommended: Yes".
> **Action (one change at a time):** 1) Ran Disk Cleanup with system files; removed temporary files, delivery optimisation files, and superseded Windows Update data. 2) Ran `DISM /Online /Cleanup-Image /StartComponentCleanup` to reclaim superseded component store packages. 3) Reviewed the Downloads folder **with the user**, deleted only software installers the user confirmed were no longer needed, and moved work documents and photos to `D:`. 4) Installed the pending Windows updates from Settings. Nothing in AppData was deleted; no drive compression; no restore points removed; no user photos deleted.
> **Verified:** `C:` free space confirmed at 38.9 GB (32.9 %). User ran Windows Update themselves, reported the update completed and the low-space warning no longer appears. User confirmed their photos are present in the new location on `D:`.
> **Cause:** System volume filled to the point where Windows Update had insufficient working space. The update failure was a symptom, not the fault.
> **For the next agent:** Machine has a large secondary drive and a small system drive, so this will recur. Recommend redirecting the Pictures and Documents libraries to `D:` and enabling Storage Sense to clear temp files automatically. Recheck free space if the user reports update failures again.

**Reasoning to take away:** A failed update is often not an update problem. Read the *exact* message — it named the drive and the cause. Then prefer moving to deleting where the user's data is involved, always operate inside the storage your own account can reach rather than reaching for system folders, and use Windows' own cleanup tools rather than third-party "cleaners", which mostly delete things you needed.

#### Ticket 5 — "My Wi-Fi keeps disconnecting"

**What the user said:**

> "My Wi-Fi keeps disconnecting. It drops for a minute and comes back. It happens all day and it is making calls impossible. My phone is fine on the same network."

**What you ask.**

That last sentence is the most valuable thing the user said, and you should always ask for it explicitly, because it splits the problem in half:

1. "Does any other device on the same Wi-Fi drop at the same time — your phone, a tablet, a TV?"
2. "Does it happen everywhere in the house, or only in one room?"
3. "Does it happen on a wired connection, or does the machine not have one?"
4. "Did anything change — a new router, a new device, new furniture, or a Windows update?"
5. "When it drops, do other Wi-Fi networks disappear from the list too, or only yours?"

The user answers: **only this laptop drops; the phone stays connected.** It happens everywhere, including next to the router. There is no Ethernet cable. No new router. And when it drops, the network still appears in the Wi-Fi list, sometimes with full bars — it just will not pass traffic.

That combination is informative. If the whole house were dropping, or if every device dropped at once, you would be looking at the router, the ISP, or the line — and none of those are Phase 1 work; you would escalate or advise the user to contact their provider. Because **only this machine** is affected, and the network **still appears** but stops passing traffic, the layered troubleshooting points at this laptop's Wi-Fi adapter and its software: the **driver**.

**What you observe.**

You connect (with permission) and gather the adapter's state and history:

```powershell
Get-NetAdapter | Select-Object Name, InterfaceDescription, Status, LinkSpeed
```

```text
Name        InterfaceDescription                    Status LinkSpeed
----        --------------------                    ------ ---------
Wi-Fi       Intel(R) Wireless-AC 9560 160MHz        Up     433.3 Mbps
Ethernet    Realtek PCIe GbE Family Controller      Disconnected 0 bps
```

The adapter is up and negotiating a good rate right now — which is exactly what you expect from an intermittent fault. You check whether Windows has been logging disconnects:

```powershell
Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Microsoft-Windows-WLAN-AutoConfig'} -MaxEvents 8 |
  Select-Object TimeCreated, Id, LevelDisplayName, Message
```

```text
TimeCreated          Id LevelDisplayName Message
-----------          -- -------------- --------------
2/14/2024 9:41:02 AM 8003 Warning        Wireless security stopped.
2/14/2024 9:41:02 AM 8002 Information    Wireless security started.
2/14/2024 10:12:47 AM 8003 Warning       Wireless security stopped.
2/14/2024 10:12:47 AM 8002 Information   Wireless security started.
```

Those paired `8003` / `8002` events are the machine tearing the wireless security association down and immediately rebuilding it — a disconnect followed by an instant reconnect, which is precisely the "drops for a minute and comes back" symptom the user described. And it is happening repeatedly, roughly every half hour, which is the *pattern* Part 6 told you to look for in the event log.

You note the adapter model — **Intel Wireless-AC 9560** — because that is the exact string you will need to find the correct driver, and you note that a driver that has never been updated since the machine was built is a strong candidate.

```powershell
Get-CimInstance Win32_PnPSignedDriver |
  Where-Object DeviceName -like '*Wireless-AC 9560*' |
  Select-Object DeviceName, DriverVersion, DriverDate
```

```text
DeviceName                        DriverVersion DriverDate
----------                        ------------- -----------
Intel(R) Wireless-AC 9560 160MHz  20.70.0.7     4/2/2019 12:00:00 AM
```

A driver from 2019 on a machine that is otherwise current is a real finding, and it is consistent with everything else: this adapter, this machine, intermittent, and the network itself healthy for every other device.

**What you do.**

Here you must be careful about the boundary of your own knowledge, and say so.

*What you do not do.* You do not change router settings. You do not select a different Wi-Fi **channel** — that is a networking concept (Phase 3), it requires access to the router's administration page, and changing it affects every device in the household, not just this laptop. You do not install a random driver from a download site that claims to have "Intel drivers". You do not disable the adapter and hope.

*What you do, in order:*

1. **Check for a driver update through Windows itself.** **Settings → Windows Update → Advanced options → Optional updates → Driver updates**, and **Device Manager → Network adapters → Intel Wireless-AC 9560 → Update driver → Search automatically**. Windows first, always.
2. **If Windows has nothing, get the driver from the vendor.** For a laptop this means the *laptop manufacturer's* support page — Lenovo, Dell, HP, Acer, ASUS — searched by the exact machine model, not the chipset vendor, because laptop makers ship customised wireless drivers. This is a free download and it is the correct source. You note this and walk the user through it, or install it during the remote session with their permission.
3. **Check the power management setting, which is a genuinely common cause of exactly this symptom.** In **Device Manager → Network adapters → the wireless adapter → Properties → Power Management**, there is a checkbox: *"Allow the computer to turn off this device to save power."* When Windows decides to save power, it can drop the adapter — and the user sees a brief disconnect. Unchecking it is a one-click, reversible change and it is a legitimate fix, not a guess. You make this change *separately* from the driver change so you know which one mattered.
4. **Note what is out of scope.** Investigating which Wi-Fi channel is congested, or whether the router is misconfigured, is **Phase 3** material and needs router access and knowledge you do not have yet. If the driver and power settings do not fix it, the correct action is to escalate to a network technician with a note saying exactly what you ruled out — which is what your note will contain. That is not a failure; that is the right call at the right time.

*Important safety note for the note-writing stage:* when you advise the user about the driver download, tell them to get it from the manufacturer's own support site and to check that the URL is the manufacturer's domain. A "driver updater" site that offers a bundled installer is a common way to get unwanted software onto a machine — a habit worth building early, and the reason this lesson keeps pointing you at vendor sites.

**How you verify.**

You cannot verify an intermittent fault in five minutes, and pretending you can is how you get a reopen. The honest verification is: the change persists, the specific log evidence stops, and the user tests it under load.

```powershell
netsh wlan show interfaces
```

```text
    Name                   : Wi-Fi
    Description            : Intel(R) Wireless-AC 9560 160MHz
    State                  : connected
    SSID                   : HomeNetwork_5G
    Signal                 : 82%
    Receive rate (Mbps)    : 433.3
    Transmit rate (Mbps)   : 433.3
```

Then you ask the user to do the thing that actually breaks it:

> *"Could you run a video call for a few minutes now — that is what usually drops it — and message me if it drops? I will leave the ticket open until tomorrow and check the logs myself rather than closing it now."*

That is the professional move on an intermittent fault: **do not close the ticket on a hopeful fix.** You change the ticket status to pending or leave it open with a scheduled follow-up, and you check the event log for new `8003` events before you close it.

```powershell
Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Microsoft-Windows-WLAN-AutoConfig';
  StartTime=(Get-Date).AddHours(-6)} | Measure-Object
```

If the count is zero after a normal working day, you have evidence. If it is not, you escalate with that evidence.

**Final ticket note.**

> **Reported:** User reported the laptop's Wi-Fi dropping for about a minute and reconnecting, repeatedly, all day; video calls unusable. Other devices on the same network unaffected.
> **Changed recently:** Nothing reported by the user; no router change.
> **Observed:** `Get-NetAdapter` showed the Intel Wireless-AC 9560 up at 433.3 Mbps, so no permanent hardware failure. Event log (`WLAN-AutoConfig`) showed repeated paired events — `8003 Wireless security stopped` immediately followed by `8002 Wireless security started` — roughly every 30 minutes, matching the reported symptom. Installed driver version 20.70.0.7 dated 2019. Other devices on the same SSID were unaffected, and the network remained visible during drops.
> **Action (one change at a time):** 1) Checked Windows Update optional driver updates and Device Manager "Update driver" — no newer driver offered. 2) Obtained the current wireless driver from the laptop manufacturer's support page using the exact machine model and installed it. 3) Separately, unchecked "Allow the computer to turn off this device to save power" in the adapter's Power Management properties.
> **Verified:** `netsh wlan show interfaces` showed the adapter connected at 82 % signal and 433 Mbps. Asked the user to run a video call for several minutes. Ticket left open for 24 hours; checked `WLAN-AutoConfig` for new `8003` events over the following working day — none recorded. Ticket closed after that.
> **Cause:** Outdated wireless adapter driver combined with Windows power management switching the adapter off. Both are software configuration on this machine; the network itself is healthy for other devices.
> **Out of scope / escalate if it recurs:** Wi-Fi channel selection, router configuration, and wireless interference analysis are **Phase 3 (Networking)** topics and require router access. If disconnects return with a current driver and power saving disabled, escalate to a network technician with these logs — do not start changing router settings.

**Reasoning to take away:** The user's comparison to their phone was the most valuable sentence in the ticket. Isolating "only this device" versus "everything" halves the problem before you touch anything. Then use the event log to turn a vague intermittent complaint into a **pattern** with timestamps — repetition from the same provider is the signature you were taught to look for. And when a fault is intermittent, do not close the ticket on optimism: leave it open, set a follow-up, and check the evidence later.

#### What these five tickets have in common

Five different symptoms — slowness, a dead monitor, a machine that "would not turn on", a full disk, and dropping Wi-Fi — and the same reasoning pattern underneath every one of them.

**The user's description is a starting point, not a diagnosis.** "Slow", "won't turn on", "keeps disconnecting" are all vague, and in two of these five tickets the stated symptom was actively misleading: the machine *did* turn on, and the "connection problem" was on the laptop, not the network. Your first move is always to convert the vague complaint into a specific, checkable observation. Ask what they see, when it started, what changed, and whether anyone else or any other device is affected.

**Cheap evidence before expensive evidence.** Free space before S.M.A.R.T. Task Manager before event logs. The monitor input button before a new cable. Whether other devices are affected before touching the network. The cost of a check is measured in seconds and in the user's risk, not in how technical it looks. The best technicians are not the ones who know the most obscure commands; they are the ones whose first three checks are well chosen.

**Ask what changed — every time.** Desk cleaned. Monitors moved. A Windows update. It appears in four of these five tickets, and in one of them ("the computer won't turn on") the user initially said nothing had changed at all. Ask twice if the answer feels wrong.

**Split the problem in half before you investigate.** Does anything happen when you press power? Is the monitor powered? Is the adapter up? Is it one device or all of them? Does it print from the printer's own panel but not from the PC? A single well-chosen question eliminates half the possible causes, and that is worth more than any tool.

**Change one thing at a time.** In all five tickets the technician made changes in sequence and noted the result. This is not tidiness for its own sake. It is the only way you can write a note that says **what the cause was** rather than **what you happened to do**. If you change four things and the problem goes away, you have learned nothing, and it will come back.

**Verification is a step, not a formality.** In every ticket, the technician asked the user to do the specific thing that was broken: load the inbox, drag a window between screens, open the presentation, check for updates, run a video call. "Is it working now?" produces a polite yes. "Please do the thing that failed and tell me what happens" produces evidence — and evidence is what keeps a ticket closed.

**Know where your knowledge stops, and say so.** The Wi-Fi ticket is the clearest example. Driver and power management are Phase 1 work. Channel selection and router configuration are Phase 3, and the ticket says so explicitly. Escalating or deferring with a precise note about what you ruled out is professional competence, not a gap. The dangerous technician is not the one who knows less — it is the one who does not know where the edge is.

**The note is the job.** Look back at the weakest and strongest notes in these tickets. The difference is never length. It is that the strong note separates **what the user reported** from **what you observed** from **what you did** from **how you verified** — so that a stranger can pick it up, trust the conclusions, and either finish it or prevent it from recurring.

That is the whole of first-line IT support in one sentence: **turn a vague human complaint into a specific, verified, documented fact.** The hardware knowledge in Parts 1–9 is what lets you do it. The reasoning in Parts 10–12 is what turns it into a career.

### Part 13 — Self-check

Answer these without looking. If you cannot, go back to the relevant part.

1. What are the three ways to check a CPU's core count, and what does the logical processor count tell you that the core count does not?
2. Explain the difference between RAM and storage to someone who has never opened a computer.
3. A user says their machine is slow. What is the first thing you check, and why?
4. What does a S.M.A.R.T. status of "Caution" mean, and what is your next action?
5. What single symptom points most reliably at a failing CMOS battery?
6. A machine powers on with fans spinning but shows no display. List the first three things you check, in order.
7. Why does "what changed recently?" save more time than any diagnostic tool?
8. Write a two-sentence ticket note for a user whose laptop will not charge.
9. A drive reports reallocated sectors at 248 and rising, with a new pending sector since last month. What do you do first, and why is that the first thing rather than the diagnosis?
10. A user's machine blue-screens with `PAGE_FAULT_IN_NONPAGED_AREA` twice a week, but Windows Memory Diagnostic passes. Does that clear the RAM? Explain your reasoning.
11. Why is a BSOD that names a specific driver file more useful than a BSOD without one?
12. A remote client's monitoring shows you went quiet for three hours on an open ticket. Why does that damage your standing more than it would in an office, and what should you have done?
13. You are based in the Philippines (UTC+8) and a US Pacific-time client needs graveyard coverage. Explain why this is an advantage for you rather than a disadvantage.
14. A user says their machine is slow. Name the first three checks you make, in order, and say why each is cheaper than the one after it.
15. What is the difference between priority and severity? Give one example of a low-severity, high-priority ticket and one of a high-severity, low-priority ticket.
16. Write the eight things a good escalation handoff note must contain.
17. An SLA says four hours to respond. You cannot fix the problem. What do you do at hour three, and why is that better than saying nothing until hour five?
18. A user is angry that this is their third report of the same fault. Write your first two sentences to them.
19. Why must you ask permission before connecting to a user's screen, and what specifically should you tell them before you do?
20. A user says their Wi-Fi "keeps disconnecting" and adds that their phone is fine on the same network. What does that second sentence tell you, and what does it rule out?
21. You update a driver and the intermittent fault stops. Why should you not close the ticket immediately, and what do you do instead?

If you can answer all twenty-one, you are ready for the phase checklist. If not, that is useful information — the checklist is what you are working toward, and nothing here is beyond you.

### Key takeaways

- **A computer is five subsystems and a sequence.** CPU, RAM, storage, motherboard, and power. Almost every "it won't turn on" or "it's slow" ticket resolves to one of them, and the boot sequence tells you which stage failed.
- **RAM and storage fail in completely different ways.** Random crashes across many applications point at RAM. Slowness, clicking, or a drive that vanishes points at storage. Learn to tell those apart and you have skipped half the diagnostic work.
- **Free space is the most common cause of "slow computer".** Check it first, because it is instant, free, and frequently the whole answer.
- **Most "hardware failures" are loose connections.** Reseating RAM and storage resolves a genuinely large share of detection problems. Try it before condemning a part.
- **Back up before you diagnose.** If a drive is making noise, the user's data outranks your curiosity.
- **Ask what changed.** New software, an update, a move, a spill, a new peripheral — the cause is usually recent, and the user knows something you do not.
- **Hardware leaves evidence.** S.M.A.R.T. counters, bug check history, and power-loss events are recorded whether or not anyone was watching. Read the record instead of guessing from the symptom.
- **A passing test is not a clean bill of health.** Memory faults are intermittent by nature. If the symptoms fit the fault, keep investigating even when the test passes.
- **On a failing drive, back up before you diagnose.** The user's data outranks your curiosity, every time.
- **For remote work, responsiveness is the product.** Acknowledge quickly, update honestly, and write notes that stand alone — because nobody can see your desk.
- **The user's description is a starting point, not a diagnosis.** "Slow", "won't turn on", and "keeps disconnecting" are vague, and sometimes actively misleading. Convert the complaint into a specific, checkable observation before you investigate.
- **Split the problem in half with one good question.** Does anything happen when you press power? Is only this device affected? Does it print from the printer's own panel? One well-chosen question eliminates half the possible causes.
- **Cheap evidence before expensive evidence.** Free space before S.M.A.R.T., Task Manager before event logs, the monitor input button before a new cable. The best technicians are not the ones with the most obscure commands — they are the ones whose first three checks are well chosen.
- **Verify with the user's hands, not their word.** "Is it working now?" invites a polite yes. "Please do the thing that failed and tell me what happens" produces evidence — and evidence is what keeps a ticket closed.
- **Escalating well is a skill, not a failure.** A precise handoff note that says what you ruled out is professional competence. The dangerous technician is not the one who knows less — it is the one who does not know where the edge of their knowledge is.
- **Getting in locally and working overseas are stages, not rivals.** Local experience is the on-ramp; remote work for a foreign employer is the goal, and the timezone makes you a natural fit for coverage hours the client's own staff will not work.

### Practice this next

The lesson above is the reasoning; the tasks below are the doing. Work through them in this order:

1. **Run Checks 1–6** in Part 7 on your own machine and record every result. That record *is* your deliverable.
2. **Build the symptom table** from Part 8 in your own words — ten symptoms, likely causes, first check. Do not copy the table; rewrite it from memory and correct yourself against the original.
3. **Work the five tickets in Part 12 on paper.** For each, cover the solution, read only what the user said, and write down what you would ask and check first. Then compare your reasoning against the ticket. This is the single most useful exercise in the phase.
4. **Answer the Part 13 self-check** without looking back. Anything you miss tells you exactly which part to reread.
5. **Then do the five hands-on tasks** and finish the checklist. If you can explain your own specs to a non-technical person and fix a slow PC, a full disk, and a device that is not detected, you have met the exit criteria for this phase.

## Common Pitfalls

- **Ignoring overheating.** Sustained heat degrades a CPU and shortens hardware life. Check temperatures and clean fans before deciding a machine is "just slow".
- **Not backing up data first.** On a suspect drive, the data comes before the diagnosis. Back up, then investigate.
- **Skipping the reseat.** If a device is not detected, reseating it — RAM, storage, a cable — resolves it more often than beginners expect. Try that before assuming the part is dead.
- **Installing drivers from the wrong source.** Always get drivers from the manufacturer's own site or Windows Update. Random "driver updater" sites and bundled utilities are a common route to malware and instability.
- **Changing five things at once.** If you clear temp files, update a driver, and reseat RAM together, you learn nothing and the fault returns. One change, then test.
- **Closing a ticket without a useful note.** "Fixed" is not documentation. Record what the user reported, what you observed, what you did, and what happens next.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Windows System Information | Shows hardware/OS details | Free, built-in | https://support.microsoft.com/windows | Record CPU, RAM, OS version, BIOS mode | Speccy free version |
| Task Manager | Shows CPU/RAM/disk/network usage | Free, built-in | https://support.microsoft.com/windows | Screenshot performance tab and explain each graph | Process Explorer |
| Device Manager | Shows hardware and drivers | Free, built-in | https://support.microsoft.com/windows | Find network adapter and display adapter names | HWiNFO |
| HWiNFO | Detailed hardware inventory | Free | https://www.hwinfo.com/ | Export summary of your PC specs | Windows System Information |
| CrystalDiskInfo | Checks disk health/S.M.A.R.T. | Free | https://crystalmark.info/en/software/crystaldiskinfo/ | Check drive health and temperature | PowerShell `Get-PhysicalDisk` / manufacturer tool |
| Event Viewer | Reads system logs and bug check history | Free, built-in | https://support.microsoft.com/windows | Find the last unexpected shutdown and its event ID | PowerShell `Get-WinEvent` |
| Windows Memory Diagnostic | Tests RAM for faults | Free, built-in | https://support.microsoft.com/windows | Run `mdsched.exe` and record the result | MemTest86 |
| Autoruns | Shows everything that starts with Windows | Free | https://learn.microsoft.com/sysinternals/ | Find a startup program you do not recognise | Task Manager → Startup apps |
| Joplin | Keeps your own ticket and study notes | Free/open-source | https://joplinapp.org/ | Create a notebook for this phase and log every check | Notepad / Google Docs |
| LibreOffice Writer | Write notes and cheat sheets | Free | https://www.libreoffice.org/ | Create PC parts cheat sheet | Google Docs |

## Free/cheap resources

- Professor Messer A+ Core 1 hardware videos — https://www.professormesser.com/free-a-plus-training/220-1101/220-1101-video/220-1101-training-course/
- PowerCert Animated Videos — https://www.youtube.com/@PowerCertAnimatedVideos
- Crucial computer hardware basics — https://www.crucial.com/articles/pc-users/computer-hardware
- Microsoft Windows help — https://support.microsoft.com/windows
- Microsoft Sysinternals utilities — https://learn.microsoft.com/sysinternals/
- Microsoft Learn training — https://learn.microsoft.com/training/
- We Work Remotely — https://weworkremotely.com/
- Remote OK — https://remoteok.com/
- Remote.co — https://remote.co/remote-jobs/
- Wellfound — https://wellfound.com/
- Dynamite Jobs — https://dynamitejobs.com/

## Hands-on practice tasks

Each task below maps to a guided check in the lesson. The check gives you the commands; the task is where you record what you found. Do not skip the recording — that record is your deliverable.

1. **Identify your machine** *(Checks 1–2)*. Open Windows System Information, or run the PowerShell in Part 7. Write down: CPU model and core count, RAM capacity, storage type and size, OS version and build, and Wi-Fi adapter model.
2. **Watch the machine work** *(Check 5)*. Open Task Manager with **Ctrl+Shift+Esc**, click **Performance**, and visit CPU, Memory, Disk, and Network. For each, note what the graph measures and what normal looks like at idle. Then sort the Processes tab by CPU, RAM, and Disk in turn. Take a screenshot of the performance tab and explain each graph in your own words.
3. **Check disk health and free space** *(Check 3)*. Install CrystalDiskInfo and read the health rating, or run `Get-PhysicalDisk | Select-Object FriendlyName, MediaType, HealthStatus, Size`. Look for S.M.A.R.T. warnings or a degraded status. Then check free space — right-click the drive, choose **Properties**, and read the **General** tab, or compare `SizeGB` against `FreeGB` in the Part 7 output. Record both the health status and the free-space percentage.
4. **Watch device enumeration** *(Check 5)*. Plug in a USB device — a flash drive or a mouse. Open **Device Manager** (`devmgmt.msc`) and note what appeared, including any driver installation. Unplug it and watch the entry disappear. This is the exact check you will walk a user through on a call.
5. **Build your symptom table** *(Part 8)*. Create a table of 10 common hardware symptoms with likely causes and a quick fix for each. Write it in your own words rather than copying Part 8 — the point is to practise the reasoning from symptom to cause.

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
