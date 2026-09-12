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
   - PowerShell: `Get-PhysicalDisk | Select-Object FriendlyName, MediaType, HealthStatus, Size`.
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

1. Check the event log for repeated `Kernel-Power` or `BugCheck` events — a real support habit:
   ```powershell
   Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Microsoft-Windows-WER-SystemErrorReporting'} -MaxEvents 10
   ```
2. Run the built-in memory test. Search for **Windows Memory Diagnostic**, or run `mdsched.exe`, and let it restart and test. It takes roughly 10–30 minutes.
3. **Reseat the sticks.** For a desktop, power off, unplug, open the case, release the clips, lift each stick, and push it back firmly until both clips click. A surprising number of "failing RAM" tickets are a stick that was never fully seated — often after a move or a repair.
4. If a stick proves faulty, test one at a time to identify which. Removing a suspect stick and seeing stability return is a valid diagnosis.
5. Document what you found and escalate for replacement if the hardware is confirmed bad.
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

### Part 5 — The boot process: what happens when you press power

Understanding boot order turns "it won't turn on" from one problem into a sequence of checkable stages.

1. **Power on.** You press the button. The power supply (PSU) delivers stable voltages. Desktop PSUs are rated in watts because every component draws from that budget; an underpowered PSU shows up as shutdowns under load, not as a refusal to start.
2. **Firmware (UEFI or legacy BIOS) initialises.** The motherboard runs the firmware, which wakes the CPU, trains the memory, and enumerates the hardware. This is the **POST** (Power-On Self-Test). If POST fails here, you get a beep code, a diagnostic LED, or silence with spinning fans — and never a display.
3. **Firmware selects a boot device.** The boot order decides whether the machine looks for an internal drive, a USB device, or the network. A USB drive left plugged in is a classic unbootable-machine cause, because the firmware tries it first.
4. **The bootloader starts.** UEFI loads the Windows Boot Manager from the EFI System Partition. A corrupt boot configuration produces "Boot device not found", "Operating system not found", or a recovery screen — all *before* Windows begins to load.
5. **The operating system loads.** Windows initialises drivers, starts services, and presents the sign-in screen. Failures past this point look different: they are Windows-level problems — BSODs, update failures, endless repair loops — not firmware or hardware ones.

That sequence is a diagnostic tool. If the failure happens before the Windows logo, you are looking at power, firmware, or boot configuration. If it happens after, you are looking at Windows itself. Splitting the problem at the logo saves a great deal of time.

### Part 6 — Guided walkthrough: inspect your own computer

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
#### What you would do

1. **For a resetting clock**, the fix is a new CMOS battery. On a desktop this is a five-minute job. On a laptop it is a partial teardown and should be escalated or scheduled carefully.
2. **For a no-POST machine**, strip the diagnosis down: reseat RAM, reseat power connectors, remove non-essential peripherals, and try one RAM stick at a time. Check that the monitor is on the correct input before you open anything — a genuinely frequent cause.
3. **For dead ports**, confirm with a known-good device before condemning the board. Test the cable and the peripheral in another port or on another machine.
4. **If you see physical damage**, stop. Photograph it, report it, and do not attempt further power-ons.
5. **Do not flash firmware on a whim.** Only update firmware when you have a specific reason: a documented compatibility fix, a security advisory, or a vendor instruction. Have stable power and the correct file for the exact board revision.
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

### Part 7 — Symptom → cause reference

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
## Common Pitfalls

- **Ignoring Overheating:** Overheating can damage your CPU. Always clean fans and check temps.
- **Not Backing Up Data:** Regularly back up important files to prevent data loss.
- **Reseating RAM/Storage:** If a device isn’t detected, reseating can help. Try it before assuming hardware failure.
- **Updating Drivers Incorrectly:** Always download drivers from the manufacturer’s website, not random sources.

## Tools for This Phase
### Part 8 — The habits that make this useful on a ticket

Technical knowledge only converts into a job if you communicate it. Four habits separate a technician from someone who has watched a video about computers.

**Ask about change first.** "What changed recently?" is the highest-yield question in support. New software, a Windows update, a new monitor, a move, a spill, a new router — the cause is usually something that changed. Ask before you investigate.

**Reproduce the problem.** If you cannot reproduce it, you cannot confirm you have fixed it. Ask the user to walk you through the steps that trigger it, and ask whether it happens for every user or only them. That question alone distinguishes a machine problem from a permissions or account problem.

**Change one thing at a time.** If you clear the temp files, update the driver, and reseat the RAM in one go, you will never know what fixed it — and it will come back. Change one variable, test, record the result. This is the discipline that makes notes worth reading later.

**Write the note for the next person.** A good ticket note contains what the user reported, what you observed, what you did, what the result was, and what happens next. Assume the next technician knows nothing:

> *User reported laptop slowing down after about an hour of use. Checked Task Manager: CPU at 100 % with clock speed reduced to 0.8 GHz, fan audible at idle. Temperature in HWiNFO 95 °C under light load. Vents visibly dusty. Cleaned vents, advised using the laptop on a hard surface. Temperature now 68 °C under load, clock speed stable. Will monitor; if it recurs, hardware inspection for thermal paste.*

That note is specific, evidence-based, and actionable. It also demonstrates to an employer that you can actually do the job.

### Part 9 — Self-check

Answer these without looking. If you cannot, go back to the relevant part.

1. What are the three ways to check a CPU's core count, and what does the logical processor count tell you that the core count does not?
2. Explain the difference between RAM and storage to someone who has never opened a computer.
3. A user says their machine is slow. What is the first thing you check, and why?
4. What does a S.M.A.R.T. status of "Caution" mean, and what is your next action?
5. What single symptom points most reliably at a failing CMOS battery?
6. A machine powers on with fans spinning but shows no display. List the first three things you check, in order.
7. Why does "what changed recently?" save more time than any diagnostic tool?
8. Write a two-sentence ticket note for a user whose laptop will not charge.

If you can answer all eight, you are ready for the phase checklist. If not, that is useful information — the checklist is what you are working toward, and nothing here is beyond you.

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Windows System Information | Shows hardware/OS details | Free, built-in | https://support.microsoft.com/windows | Record CPU, RAM, OS version, BIOS mode | Speccy free version |
| Task Manager | Shows CPU/RAM/disk/network usage | Free, built-in | https://support.microsoft.com/windows | Screenshot performance tab and explain each graph | Process Explorer |
| Device Manager | Shows hardware and drivers | Free, built-in | https://support.microsoft.com/windows | Find network adapter and display adapter names | HWiNFO |
| HWiNFO | Detailed hardware inventory | Free | https://www.hwinfo.com/ | Export summary of your PC specs | Windows System Information |
| CrystalDiskInfo | Checks disk health/S.M.A.R.T. | Free | https://crystalmark.info/en/software/crystaldiskinfo/ | Check drive health and temperature | PowerShell `Get-PhysicalDisk` / manufacturer tool |
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
