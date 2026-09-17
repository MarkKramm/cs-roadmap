---
id: exam-a-plus-core-1
exam: "CompTIA A+ Core 1"
code: 220-1201
questions: 40
real_exam_questions: 90
real_exam_minutes: 90
pass_mark: 675
pass_scale: 900
blueprint_checked: 2026-09-18
source: "https://www.comptia.org/en-us/certifications/a/core-1-v15/"
---

# CompTIA A+ Core 1 — practice questions

**Unofficial.** Written for this repository against CompTIA's published 220-1201 objectives.
Not real exam questions, not endorsed by CompTIA.

| | |
|---|---|
| **Exam code** | 220-1201 (A+ v15) |
| **Real exam** | maximum of 90 questions, 90 minutes |
| **Pass mark** | **675** on a scale of 900 |
| **This paper** | **40 questions** — see the note below |

## Before you start

**Do this closed-book, in one sitting, in 45 minutes.**

**675/900 is 75%**, which is 30 questions out of 40. A+ has the **lowest pass mark** of the
CompTIA exams in this directory — but read the next paragraph before you take comfort from it.

**A+ is two exams, and you must pass both.** Core 1 (220-1201) and Core 2 (220-1202) are
separate sittings with separate fees. Passing this paper means you might pass *half* of A+.
Sit both papers in this directory before you book anything, and budget for two exam fees.

| Your score out of 40 | Percentage | Verdict |
|---|---|---|
| 34–40 | 85–100% | Comfortable pass |
| **30–33** | **75–82%** | **Pass** |
| 29 | 72.5% | Fail — just under |
| 25–28 | 63–70% | Clear fail |
| below 25 | — | Substantially under-prepared |

**These 40 questions are not a simulation.** The real exam includes drag-and-drop and
performance-based questions — identifying ports from a picture, ordering a boot sequence —
which a multiple-choice paper cannot represent.

## How it is weighted

| Domain | Official weight | Questions here | Share of this paper |
|---|---|---|---|
| 1. Mobile devices | 13% | 5 | 12% |
| 2. Networking | 23% | 9 | 22% |
| 3. Hardware | 25% | 10 | 25% |
| 4. Virtualization and cloud computing | 11% | 5 | 12% |
| 5. Hardware and network troubleshooting | **28%** | 11 | **28%** |

**The last two columns differ slightly, and that is arithmetic rather than carelessness.** The
official weights are proportions of a 90-question exam, and several do not divide evenly into
40: 11% of 40 is 4.4 questions, so the nearest whole numbers are 4 or 5 and this paper uses 5 so
the domain is worth scoring at all. Every domain is within one question of its official share,
and the two largest — Hardware and Troubleshooting — match exactly.

**Troubleshooting and hardware together are more than half the exam.** This is the most
physical of the CompTIA exams: it rewards having opened a machine, not having read about one.

---

## Domain 1 — Mobile devices (13%)

### Q1. A user's laptop battery drains within an hour when it previously lasted six. What should you check FIRST?

- [ ] Replace the battery
- [x] **Which applications are consuming power, and whether the battery reports as healthy**
- [ ] Reinstall the operating system
- [ ] Replace the charging cable

**Why:** You diagnose before you replace. A software process pinning the CPU and a genuinely
degraded battery produce the same symptom but have opposite fixes, and the battery health
report tells you which within seconds. Replacing the battery first is the expensive guess, and
if the cause was a runaway process you have spent money and changed nothing.

### Q2. Which connector is used to charge most modern Android phones?

- [ ] Lightning
- [x] **USB-C**
- [ ] Micro-USB
- [ ] Thunderbolt

**Why:** **USB-C** is the near-universal standard for current Android devices and is now
mandated in the EU for most small electronics. Lightning is Apple's older proprietary
connector (newer iPhones have moved to USB-C as well), micro-USB is the previous Android
standard, and Thunderbolt is a high-bandwidth data protocol that uses the USB-C connector —
which is why "Thunderbolt" is the tempting wrong answer.

### Q3. A tablet's screen does not respond to touch in one corner. What is the most likely cause?

- [ ] A failing battery
- [x] **Digitizer damage from a drop**
- [ ] A software update
- [ ] The charging port is dirty

**Why:** Touch input comes from the **digitizer**, a separate layer from the display panel
itself. Localised dead zones are physical. This distinction matters practically: a cracked
digitizer and a cracked LCD are different repairs at different prices, and a customer asking
"can you just replace the glass" is asking about exactly this layer.

### Q4. Which is a legitimate reason to use a mobile hotspot instead of public Wi-Fi?

- [ ] It is always faster
- [x] **It is not shared with unknown users on the same untrusted network**
- [ ] It does not use mobile data
- [ ] It bypasses all security controls

**Why:** The advantage is **trust**, not speed — public Wi-Fi is a shared network you do not
control, and an on-path attacker on it can intercept unencrypted traffic. Note that option
three is wrong and worth understanding: a hotspot absolutely uses your mobile data allowance,
which is why people avoid it. And it bypasses *your organisation's* controls, which is usually
a reason NOT to use it, not a benefit.

### Q5. A laptop's screen is very dim even at maximum brightness. Which component is most likely failing?

- [ ] The GPU
- [x] **The backlight or inverter**
- [ ] The RAM
- [ ] The hard drive

**Why:** The **backlight** illuminates the LCD panel. If an image is faintly visible with a
torch, the panel is working and the backlight is not — that test is the classic way to
separate a backlight fault from a dead display. The GPU produces the image, so a GPU fault
gives no image or a corrupted one, not a uniformly dim one.

---

## Domain 2 — Networking (23%)

### Q6. Which port does RDP use by default?

- [ ] 22
- [ ] 443
- [x] **3389**
- [ ] 25

**Why:** **3389** is RDP. 22 is SSH, 443 is HTTPS, 25 is SMTP. Worth knowing well beyond the
exam: RDP exposed to the internet is one of the most heavily attacked services there is, and
recognising 3389 in a firewall rule or a log is a practical skill, not trivia.

### Q7. A user needs to connect a laptop to a wired network, but the laptop has no Ethernet port. What is the correct solution?

- [ ] A USB-to-Ethernet adapter
- [x] **A USB-to-Ethernet adapter or a docking station with one**
- [ ] A wireless card
- [ ] A different router

**Why:** Modern thin laptops dropped the built-in port, and the standard fix is an adapter or
dock. Note that this is a case where two options are nearly identical — the discriminator is
that a docking station is the better answer in an office context because it also restores
display and power connections. Read for the option that covers the real requirement rather
than only the literal one.

### Q8. Which cable connects a computer directly to a router's Ethernet port?

- [ ] Crossover cable
- [x] **Straight-through (patch) cable**
- [ ] Rollover cable
- [ ] Console cable

**Why:** A **straight-through** cable connects unlike devices — a computer to a switch or
router. A crossover cable historically connected like devices (switch to switch). In practice
modern hardware auto-detects and either works, which is why the distinction has faded in the
field but still appears on exams. A rollover cable is Cisco console.

### Q9. What does a DHCP server provide to a client?

- [ ] A hostname
- [x] **An IP address, subnet mask, gateway and DNS servers**
- [ ] A MAC address
- [ ] A default password

**Why:** DHCP supplies the whole **IP configuration**, not just an address — which is why a
client with a valid IP but no gateway (Q10) has a DHCP problem, not an addressing one. A MAC
address is burned into the network card by the manufacturer and is not assigned. This is one of
the most commonly tested facts in A+.

### Q10. A computer has an IP address of 169.254.10.5. What does this indicate?

- [ ] It has a valid public address
- [x] **It could not reach a DHCP server and assigned itself an address**
- [ ] It is on the 10.x private range
- [ ] It has a static configuration

**Why:** **169.254.x.x is APIPA** — the address Windows assigns itself when DHCP fails. Seeing
it means "no DHCP", so the fault is the cable, the switch port, or the DHCP server, not the
address itself. This single fact resolves an enormous number of real helpdesk tickets, and it
is why the number is worth recognising on sight.

### Q11. Which wireless security standard is currently recommended?

- [ ] WEP
- [ ] WPA
- [ ] WPA2
- [x] **WPA3**

**Why:** **WPA3** is the current standard. WEP is broken and trivially cracked; WPA is
deprecated; WPA2 is still widely deployed and acceptable but is not the recommendation. The
progression matters because a router still offering WEP is a finding, and "it has a password"
is not the same as "it is secure".

### Q12. What is the purpose of a DNS server on a small network?

- [ ] To assign IP addresses
- [x] **To resolve hostnames to IP addresses**
- [ ] To route traffic between subnets
- [ ] To filter malicious websites

**Why:** DNS maps **names to addresses** — without it you would type IP addresses. Assigning
addresses is DHCP (Q9); routing between subnets is the router's job. Note that a DNS service
*can* be used for filtering, but that is a feature layered on top, not its purpose.

### Q13. A technician needs to connect two switches on different floors with a run of about 150 metres. What is the correct choice?

- [ ] Cat 6 copper
- [x] **Fibre optic**
- [ ] Cat 5e copper
- [ ] A longer patch cable

**Why:** Copper twisted pair is limited to **100 m** (and the question says 150 m), so no
copper option works however good the cable is. Fibre is the answer for any run beyond that
limit. This is the same 100 m figure as Network+ Q9, and it is worth having automatic because
"the run is too long" is a real and frequently misdiagnosed fault.

### Q14. Which device connects two different networks and forwards traffic between them?

- [ ] Switch
- [x] **Router**
- [ ] Hub
- [ ] Access point

**Why:** A **router** joins separate networks — that is its defining job. A switch connects
devices *within* one network; a hub does the same without intelligence; an access point bridges
wireless clients into a wired network, which is a Layer 2 function. The router-versus-switch
distinction is fundamental and appears in many forms.

---

## Domain 3 — Hardware (25%)

### Q15. A desktop beeps repeatedly and shows no display. What should you check first?

- [ ] The hard drive
- [x] **The RAM seating and the POST beep code**
- [ ] The operating system
- [ ] The monitor cable only

**Why:** POST beep codes are the motherboard telling you what failed, and **RAM** is the most
common cause of a repeated beep pattern with no display. Reseating costs nothing and fixes it
often. The point of the question is that the beeps are *information* — a technician who ignores
them and starts swapping parts is working blind while the machine is describing its own fault.

### Q16. Which storage type has no moving parts and is fastest for a boot drive?

- [ ] HDD
- [x] **SSD**
- [ ] Optical drive
- [ ] Tape

**Why:** An **SSD** has no platters or heads, so it has no seek time — which is why it
transforms boot and application loading more than any other single upgrade. An HDD is cheaper
per gigabyte and fine for bulk storage. This difference is large enough that "replace the HDD
with an SSD" is the standard first answer to "this old laptop is slow".

### Q17. A motherboard has a CPU socket that does not match the processor. What is the consequence?

- [ ] It will run at reduced speed
- [x] **The processor physically will not fit; the socket and CPU must match**
- [ ] It will work with an adapter
- [ ] The BIOS will correct it

**Why:** CPU sockets are **physically and electrically** specific — LGA versus PGA, and pin
counts that differ between generations. There is no adapter and no BIOS setting. This is why
"which CPU fits my board" is answered by the socket type first, and why buying a CPU by clock
speed alone is a common and expensive mistake.

### Q18. Which component converts AC power from the wall into the DC voltages the computer uses?

- [ ] The motherboard
- [x] **The power supply unit (PSU)**
- [ ] The CPU
- [ ] The UPS

**Why:** The **PSU** does the conversion. Note the trap: a **UPS** is a battery backup that keeps
the machine running during an outage — it is not the converter, and its name sounds like one.
A PSU of insufficient wattage is a real fault, and it often appears as intermittent shutdowns
under load rather than an obvious failure.

### Q19. What is the purpose of thermal paste between a CPU and its heatsink?

- [ ] To glue the heatsink in place
- [x] **To fill microscopic air gaps and improve heat transfer**
- [ ] To conduct electricity
- [ ] To prevent corrosion

**Why:** Metal surfaces look flat but are microscopically rough, and trapped **air** is a
terrible conductor of heat. Paste displaces it. Too much is a real problem — it insulates
rather than conducts — which is why "a thin, even layer" is the correct instruction. It is not
adhesive, and using it as glue is a way to destroy a CPU.

### Q20. A laptop will not power on at all and shows no charging light. What should you try first?

- [ ] Replace the motherboard
- [x] **A known-good charger and a different wall outlet**
- [ ] Replace the battery
- [ ] Reinstall Windows

**Why:** You start with the cheapest, most likely cause — power delivery — before opening the
machine. A dead outlet or a failed charger produces exactly this symptom and costs nothing to
rule out. Troubleshooting order in A+ is generally **external before internal, cheap before
expensive**, and a question where the answer is a major component replacement is almost always
testing whether you will skip that.

### Q21. Which expansion slot is used for a discrete graphics card?

- [ ] PCI
- [x] **PCIe x16**
- [ ] M.2
- [ ] SATA

**Why:** **PCIe x16** is the wide slot designed for graphics bandwidth. M.2 and SATA are
storage interfaces — M.2 is worth knowing as an NVMe SSD slot, which is a common confusion
because both are long thin connectors on the board. A graphics card in an M.2 slot is not a
thing; recognising the two on sight is.

### Q22. What does a laptop's CMOS battery do?

- [ ] It powers the laptop when unplugged
- [x] **It maintains the BIOS settings and system clock when power is removed**
- [ ] It charges the main battery
- [ ] It powers the display backlight

**Why:** The **CMOS battery** is a small coin cell that keeps the real-time clock and BIOS
configuration alive. When it dies, the classic symptom is a clock that resets and settings that
are lost on every power-off. It is not the main battery and cannot run the laptop — a
distinction worth having, because "the clock resets" is often misdiagnosed as a failing main
battery.

### Q23. Which display type provides the deepest blacks?

- [ ] LCD
- [ ] LED
- [x] **OLED**
- [ ] Plasma

**Why:** **OLED** pixels emit their own light, so a black pixel is genuinely off — giving true
black and very high contrast. LCD and LED (which is an LCD with LED backlighting) rely on a
backlight that bleeds through, so blacks are dark grey. The trade-off to know is burn-in, which
is why OLED is common on phones and premium laptops and less so on static dashboards.

### Q24. A user needs to add storage to a desktop that has no free drive bays. What is the best option?

- [ ] Replace the power supply
- [x] **An external drive over USB, or an M.2 drive if the board has a free slot**
- [ ] Add more RAM
- [ ] Replace the CPU

**Why:** The constraint is **physical** — no bays — so the answer must avoid needing one. M.2
mounts directly to the motherboard with no bay or cable at all, which is why it is often the
best answer on a modern board. RAM and CPU answers are unrelated to storage entirely; when two
options are irrelevant, the third is usually the intended one.

---

## Domain 4 — Virtualization and cloud computing (11%)

### Q25. What is the primary benefit of virtualizing several servers onto one physical host?

- [ ] Each virtual machine runs faster than on dedicated hardware
- [x] **Better hardware utilisation and lower cost than one physical server per service**
- [ ] It removes the need for backups
- [ ] It eliminates the need for patching

**Why:** Virtualisation exists because most servers are **idle most of the time**, so
consolidating them uses hardware you already paid for. It does not make anything faster — there
is overhead — and it certainly does not remove patching or backup needs; both become *more*
important because one host now holds several workloads. That single point of failure is the
trade-off.

### Q26. Which cloud service model provides a complete application over the internet, such as webmail?

- [ ] IaaS
- [ ] PaaS
- [x] **SaaS**
- [ ] DaaS

**Why:** **SaaS** is finished software you use — webmail, an online office suite. IaaS gives you
raw compute and storage you manage; PaaS gives a platform to deploy your own code onto. The
test is what the customer is responsible for, and it decreases as you move IaaS → PaaS → SaaS.

### Q27. An organisation runs its own servers but uses cloud storage for backups. What is this called?

- [ ] A public cloud
- [ ] A private cloud
- [x] **A hybrid cloud**
- [ ] A community cloud

**Why:** **Hybrid** combines on-premises infrastructure with cloud services — which is the
overwhelmingly common real-world arrangement and why it is a distinct answer. A private cloud is
cloud technology operated for one organisation; a public cloud is shared provider
infrastructure; a community cloud is shared by organisations with common requirements.

### Q28. What must be enabled in the BIOS to run a virtual machine efficiently on a desktop?

- [ ] Secure Boot
- [x] **Hardware virtualization extensions (Intel VT-x / AMD-V)**
- [ ] XMP memory profile
- [ ] Wake-on-LAN

**Why:** Without the CPU's **virtualisation extensions** enabled, a hypervisor must emulate in
software and performance collapses — or the hypervisor refuses to start at all. This is the
single most common reason a first-time VM install fails on a machine that should easily handle
it, and it is one BIOS setting.

### Q29. Which is a genuine risk specific to consolidating many virtual machines onto fewer hosts?

- [ ] Higher electricity use per service
- [x] **One physical host failure takes down every VM running on it**
- [ ] Virtual machines cannot be backed up
- [ ] VMs cannot be networked

**Why:** Consolidation concentrates **risk** as well as hardware — this is the trade-off in Q26
stated directly. The answer to it is redundancy and clustering, and knowing the risk exists is
what makes the mitigation make sense. The other options are all false: VMs are backed up and
networked routinely.

---

## Domain 5 — Hardware and network troubleshooting (28%)

### Q30. A user's computer runs slowly, and Task Manager shows memory near 100% with disk activity near zero. What is the most likely cause?

- [ ] A failing hard drive
- [x] **Insufficient RAM, causing paging**
- [ ] A failing CPU
- [ ] A virus

**Why:** Memory pinned at the ceiling with an **idle** disk is the RAM-exhaustion signature —
there is nothing to read because the data is already in the page file being thrashed. A failing
disk would show high disk *activity* or errors, and would typically be slow in bursts rather
than uniformly. The combination is the tell.

### Q31. A workstation has no network connectivity. The link light on the NIC is off. What does this indicate?

- [ ] A DNS problem
- [x] **A physical layer problem — cable, port or NIC**
- [ ] An IP address conflict
- [ ] A firewall rule

**Why:** **No link light means no Layer 1** — the two ends are not electrically talking. Nothing
above it can work, so DNS, addressing and firewalls are all irrelevant until the link is up.
Checking the link light first is a habit worth forming: it eliminates the entire stack above it
in one glance.

### Q32. A laptop's fan runs constantly and the case is hot to the touch. What should you do first?

- [ ] Replace the fan
- [x] **Clean the vents and check for dust blockage and obstructed airflow**
- [ ] Replace the CPU
- [ ] Reinstall the operating system

**Why:** A fan running constantly is doing its job — the question is why it needs to. **Dust**
is the usual answer, and it is free to fix. Replacing the fan replaces the component that is
demonstrably working. Worth adding: a laptop used on a bed or sofa blocks its own intake, which
is a cause the user created and does not know about.

### Q33. A printer shows as offline for all users. What should you check first?

- [ ] Each user's printer driver
- [x] **The printer's own power, network connection and status**
- [ ] Reinstall Windows on each machine
- [ ] Replace the printer

**Why:** The **scope** is "all users", so the fault is shared — the printer or its connection,
not any individual machine. Per-user drivers cannot explain a fault affecting everyone equally.
This is the same scope reasoning as the Network+ questions and it is the highest-value habit
across all these papers.

### Q34. A user reports that a monitor displays "no signal" but the computer's fans are running. What is the first thing to check?

- [ ] The hard drive
- [x] **The video cable connection and the monitor's selected input**
- [ ] The operating system version
- [ ] The network cable

**Why:** Fans spinning prove the machine has power, so the question is whether the **signal
path** is intact. A monitor set to HDMI while the cable is in DisplayPort produces exactly this
symptom, and it is a genuinely common callout that costs nothing to fix. Checking the input
selection before opening the case is the correct order.

### Q35. Which Windows tool would you use to check whether a disk has physical errors?

- [ ] Task Manager
- [x] **chkdsk**
- [ ] Device Manager
- [ ] Disk Cleanup

**Why:** **chkdsk** scans the file system and the disk surface for errors and bad sectors. Task
Manager shows live performance, Device Manager shows hardware and drivers, and Disk Cleanup
frees space — none of them test the disk. Reaching for the right tool from the symptom is what
this domain mostly tests.

### Q36. A user reports that their laptop will not connect to the office Wi-Fi, but their phone connects fine. What should you check first?

- [ ] The wireless access point
- [x] **Whether the laptop is in airplane mode or has its wireless adapter disabled**
- [ ] The office internet connection
- [ ] The DNS server

**Why:** The **scope** is one device — the phone works — so the fault is on the laptop, not the
network. Airplane mode and a disabled adapter are checked first because they cost nothing and
are extremely common: a function key pressed by accident disables the radio and the user has no
idea they did it. Investigating the access point for a fault that affects a single laptop is
looking in the wrong place, and it is the most common way a support call takes three times
longer than it needed to.

### Q37. A desktop's clock loses several minutes a day and its BIOS settings reset after the machine is unplugged. What is the most likely cause?

- [ ] The operating system needs updating
- [x] **The CMOS battery is failing**
- [ ] The power supply is under-rated
- [ ] The hard drive is failing

**Why:** Both symptoms point at the one small component that maintains the clock and the BIOS
configuration: the **CMOS battery**. Either symptom alone has other possible causes, but read
as a **set** they narrow to one. Learning to combine symptoms rather than diagnosing them one
at a time is the skill this question tests — and it matters here because the fix costs a few
pounds and is easy to miss.

### Q38. A desktop shuts down randomly under heavy load but runs fine when idle. What is the most likely cause?

- [ ] A failing keyboard
- [x] **An inadequate or failing power supply**
- [ ] A slow network connection
- [ ] Too many browser tabs

**Why:** Load-dependent shutdowns point at **power delivery** — the PSU cannot sustain the draw
when the CPU and GPU ramp up. It runs fine at idle because idle draw is far lower. This pattern
is worth recognising because it is often misdiagnosed as overheating; the two are distinguished
by whether the shutdown tracks *load* or *temperature and time*.

### Q39. After installing a new graphics card, the display resolution is stuck at a low setting. What should you do?

- [ ] Replace the monitor
- [x] **Install the correct driver for the new card**
- [ ] Reinstall the operating system
- [ ] Buy a new cable

**Why:** A low fixed resolution on new hardware is the classic **missing driver** symptom — the
generic driver provides only basic modes. The card is working; Windows simply does not know what
it can do yet. This is a very common real-world scenario and a favourite exam question because
it tests whether you reach for software before hardware.

### Q40. A technician resolves a fault but the user calls back a week later with the same issue. What was most likely skipped?

- [ ] Replacing the hardware
- [x] **Verifying the fix held and documenting what was done**
- [ ] Escalating to a senior technician
- [ ] Running antivirus

**Why:** The final steps of the troubleshooting methodology — **verify full functionality and
document** — are the ones people skip, and they are what turn a recurrence from a five-minute
fix into a fresh investigation. The same point closes the Network+ paper, for the same reason:
it is the step that separates a technician from someone who happens to fix things.

---

## Scoring

**One mark per question, 40 total. No marks deducted for wrong answers — answer everything.**

The pass mark is 675/900 = **75%**, which is **30 questions**.

| Score | Percentage | What it means |
|---|---|---|
| 34–40 | 85–100% | Comfortable pass |
| **30–33** | **75–82%** | **Pass** |
| 29 | 72.5% | Just under the line — a fail |
| 25–28 | 63–70% | Clear fail |
| below 25 | — | Do not book yet |

### Remember this is half of A+

Passing this paper means you might pass **Core 1**. A+ requires **both** exams, at two fees.
Sit `a-plus-core-2.md` before you book anything.

### If you scored under 30

Hardware and troubleshooting together are **53%** of this exam. If you lost marks there, the
fix is not more reading — it is opening a machine. Take an old desktop apart and put it back
together, or watch the disassembly and follow along. A+ rewards having seen the inside of a
computer, and this is the domain where reading alone plateaus fastest.

**If you lost marks on Q10** (the 169.254 address), that single fact resolves a large share of
real first-line tickets. Learn it properly rather than recognising it.

### If you scored 34 or above

The real exam has drag-and-drop and performance-based items — identifying ports and cables from
images, ordering a POST sequence. Practise those separately; a multiple-choice paper cannot
represent them at all. And confirm the current exam code with CompTIA: 220-1201 is the A+ v15
series and will eventually be replaced.

---

## Where each domain is taught

| Domain | Curriculum phases |
|---|---|
| 1. Mobile devices | `it-roadmap/01-phase-computer-fundamentals.md`, `it-roadmap/02-phase-operating-systems.md` |
| 2. Networking | `it-roadmap/03-phase-networking-basics.md` |
| 3. Hardware | `it-roadmap/01-phase-computer-fundamentals.md` |
| 4. Virtualization and cloud computing | `it-roadmap/05-phase-sysadmin-basics.md`, `cybersec-roadmap/09-phase-cloud-and-identity.md` |
| 5. Hardware and network troubleshooting | `it-roadmap/04-phase-helpdesk-skills.md`, `06-phase-tools-and-ticketing.md` |

---

*Unofficial practice questions written for this repository against CompTIA's published
220-1201 objectives. Not affiliated with or endorsed by CompTIA. Exam details checked
2026-09-18 — confirm current details with CompTIA before booking.*
