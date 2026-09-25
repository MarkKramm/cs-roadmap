---
id: exam-a-plus-core-2
exam: "CompTIA A+ Core 2"
code: 220-1202
questions: 40
real_exam_questions: 90
real_exam_minutes: 90
pass_mark: 700
pass_scale: 900
blueprint_checked: 2026-09-18
source: "https://www.comptia.org/en-us/certifications/a/core-2-v15/"
---

# CompTIA A+ Core 2 — practice questions

**Unofficial.** Written for this repository against CompTIA's published 220-1202 objectives.
Not real exam questions, not endorsed by CompTIA.

| | |
|---|---|
| **Exam code** | 220-1202 (A+ v15) |
| **Real exam** | maximum of 90 questions, 90 minutes |
| **Pass mark** | **700** on a scale of 900 |
| **This paper** | **40 questions** — see the note below |

## Before you start

**Do this closed-book, in one sitting, in 45 minutes.**

**700/900 is 77.8%**, which is **32 questions** out of 40 — close to Network+ and above Core 1's
75%. Note that Core 2 has a **higher pass mark than Core 1** despite both being called A+:

| Your score out of 40 | Percentage | Verdict |
|---|---|---|
| 34–40 | 85–100% | Comfortable pass |
| **32–33** | **80–82.5%** | **Pass** |
| 31 | 77.5% | Fail — just under the line |
| 27–30 | 68–75% | Clear fail |
| below 27 | — | Substantially under-prepared |

**31/40 is 77.5% against a required 77.8% — a fail that looks like a pass.** That is the same
trap as Security+, and it is why the boundary is spelled out in whole questions.

**A+ needs BOTH exams.** Passing this paper means you might pass Core 2. You must also pass
Core 1, at a separate fee. Sit `a-plus-core-1.md` too before booking anything.

## How it is weighted

| Domain | Official weight | Questions here | Share of this paper |
|---|---|---|---|
| 1. Operating systems | **28%** | 11 | **28%** |
| 2. Security | **28%** | 11 | **28%** |
| 3. Software troubleshooting | 23% | 9 | 22% |
| 4. Operational procedures | 21% | 9 | 22% |

**Operating systems and security are tied as the largest domains at 28% each** — together
**56% of the exam**. Core 2 is the exam people underestimate because Core 1 sounds harder: Core 1
is about hardware you can hold, Core 2 is about Windows, malware and documentation, and it has
the higher pass mark. Note that 23% of 40 is 9.2, so Software troubleshooting's share reads 22%
here; every domain is within one question of its official weight.

---

## Domain 1 — Operating systems (28%)

### Q1. Which Windows edition feature allows a computer to join an Active Directory domain?

- [ ] Windows Home
- [x] **Windows Pro**
- [ ] Windows S Mode
- [ ] Any Windows edition can join a domain

**Why:** Joining a **domain** requires Pro, Enterprise or Education — **Home cannot**, which is
one of the most common surprises for a small business that bought a consumer laptop. S Mode is a
restricted mode that only runs Store apps and is a separate limitation entirely.

### Q2. A user needs to run a legacy application that requires administrator rights on every launch. What is the most appropriate solution?

- [ ] Give the user a local administrator account
- [x] **Use the application compatibility setting to always run that program as administrator**
- [ ] Disable UAC
- [ ] Reinstall Windows

**Why:** The fix should be **scoped to the one program**, not to the user's whole account. An
application compatibility flag elevates just that executable. Making the user a local admin
grants far more than the problem requires, and disabling UAC removes the prompt that would warn
about every other elevation — both are far worse than the problem, which is the point of the
question.

### Q3. Which file system is required for a partition larger than 32 GB on a Windows system that must support file permissions?

- [ ] FAT32
- [x] **NTFS**
- [ ] exFAT
- [ ] ext4

**Why:** **NTFS** supports permissions, encryption, journaling and volumes far beyond FAT32's
32 GB practical limit. FAT32 also has a 4 GB single-file limit, which is why a large video file
will not copy to a FAT32 USB stick. exFAT removes the size limits and is ideal for removable
media but has no permissions. ext4 is Linux.

### Q4. What is the purpose of a Windows restore point?

- [ ] To back up user documents
- [x] **To capture system files and settings so the system can be rolled back after a bad change**
- [ ] To create a full disk image
- [ ] To sync files to OneDrive

**Why:** A restore point contains **system** state — registry, drivers, system files — and is
designed to undo a bad update or driver install. It explicitly does **not** protect your
documents, which is the assumption that catches people out: rolling back does not bring back a
deleted file. A full disk image is a different and more complete protection.

### Q5. A user's macOS application will not open because it is from an unidentified developer. What is the correct action?

- [ ] Reinstall macOS
- [x] **Explicitly allow it in Privacy & Security after verifying the source is trustworthy**
- [ ] Disable Gatekeeper permanently
- [ ] Run it from the Terminal as root

**Why:** Gatekeeper blocks unsigned or unnotarised apps by default and can be overridden **per
application**. The important part is "after verifying the source": the protection exists because
malware is often distributed exactly this way. Disabling Gatekeeper permanently removes that
protection for everything, and running unknown software as root is a way to give it your whole
machine.

### Q6. Which command-line tool updates the Group Policy settings on a Windows client immediately?

- [ ] `sfc /scannow`
- [x] **`gpupdate /force`**
- [ ] `chkdsk`
- [ ] `ipconfig /flushdns`

**Why:** `gpupdate /force` re-applies Group Policy without waiting for the background refresh
cycle. `sfc` repairs system files, `chkdsk` checks disks, and `ipconfig /flushdns` clears the DNS
cache. Knowing which command answers which problem is most of what this domain tests — and
`gpupdate` is the one to reach for when a policy change "has not taken effect yet".

### Q7. What does the Windows `sfc /scannow` command do?

- [ ] Scans for malware
- [x] **Scans and repairs protected system files from a cached copy**
- [ ] Defragments the hard drive
- [ ] Resets the network stack

**Why:** **SFC** verifies protected system files against a known-good cached copy and repairs
corruption — the right tool after a failed update or unexplained system instability. It is not
an antivirus, and it does not touch disks or networks. If SFC reports it cannot repair a file,
the next step is usually `DISM`, which repairs the cache SFC reads from — a follow-on worth
knowing.

### Q8. A user wants to keep working on a laptop while travelling without an internet connection. Which Windows feature should be enabled?

- [ ] BitLocker
- [x] **Offline files, or a synced OneDrive folder with files made available offline**
- [ ] Remote Desktop
- [ ] A VPN

**Why:** The requirement is access to files **without connectivity**, so the file data must
already be on the device. Both named options achieve it. Remote Desktop and a VPN both
*require* a connection — they are the opposite of the answer, and the exam uses them as
distractors whenever it asks about offline access. BitLocker is disk encryption.

### Q9. Which Windows tool shows which programs are configured to start automatically with the system?

- [ ] Disk Management
- [x] **Task Manager's Startup tab (or `msconfig`)**
- [ ] Device Manager
- [ ] Event Viewer

**Why:** The **Startup** tab lists auto-start programs and lets you disable them. This is the
first place to look for "my computer takes four minutes to boot" and for unexplained background
load — and it is where a user often finds a dozen programs they do not remember installing.
Device Manager shows hardware, Event Viewer shows logs, Disk Management shows volumes.

### Q10. What is the difference between a Windows upgrade installation and a clean installation?

- [ ] There is no practical difference
- [x] **An upgrade keeps files, settings and applications; a clean install wipes them**
- [ ] A clean install is always faster to perform
- [ ] An upgrade requires new hardware

**Why:** The distinction determines **whether the user loses their data**, which is why it
matters before you start rather than after. Upgrade preserves; clean install removes everything
and is the more reliable option when a system is badly corrupted. Knowing which one you are about
to perform, and having a backup either way, is the practical point.

### Q11. A Linux user needs to change a file's permissions so the owner can read, write and execute it, and nobody else has any access. Which command does this?

- [ ] `chmod 777 file`
- [x] **`chmod 700 file`**
- [ ] `chown root file`
- [ ] `chmod 644 file`

**Why:** Permissions are three digits — owner, group, other — and read=4, write=2, execute=1. So
**700** is owner read+write+execute (4+2+1) and nothing for anyone else. **777** grants everyone
everything, which is the classic insecure answer. **644** is read/write for the owner and
read-only for others, with no execute. Understanding the arithmetic lets you read any of these
at a glance rather than memorising them.

---

## Domain 2 — Security (28%)

### Q12. Which Windows feature encrypts an entire drive so that data is unreadable if the laptop is stolen?

- [ ] EFS
- [x] **BitLocker**
- [ ] Windows Defender
- [ ] A screen lock PIN

**Why:** **BitLocker** encrypts the whole volume, which is what protects data from someone who
removes the drive. **EFS** encrypts individual files and depends on the user's key, so it does
not protect the drive as a whole. A screen lock PIN is trivially bypassed by removing the disk —
which is exactly the threat BitLocker exists for.

### Q13. A user receives an email with an unexpected invoice attachment. What should they do?

- [ ] Open it to check whether it is legitimate
- [x] **Not open it, and report it to IT or the security team**
- [ ] Forward it to colleagues to ask if it looks real
- [ ] Reply asking for confirmation

**Why:** Reporting is the action that protects **everyone** — the sender has probably mailed the
whole organisation, and a report lets IT block it. Forwarding it spreads the risk to colleagues;
replying confirms your address is live and reaches the attacker; opening it is the thing you were
trying to avoid. This is a social question as much as a technical one, and the exam tests the
process.

### Q14. Which practice best protects against credential theft from a phishing site?

- [ ] Using the same strong password everywhere
- [x] **Multifactor authentication and a password manager that checks the site's domain**
- [ ] Changing the password every 30 days
- [ ] Using a longer password

**Why:** Password reuse is what turns one phishing success into many compromised accounts, and a
manager helps because it will not autofill on the wrong domain — a real defence. **MFA** limits
the damage even when the password is captured. Frequent rotation is now actively discouraged by
NIST and tends to produce weaker, predictable passwords. Note that a longer password alone does
not help against a site that simply asks you for it.

### Q15. What is the purpose of the principle of least privilege?

- [ ] To make administration faster
- [x] **To give users only the access they need to do their jobs, limiting damage if an account is compromised**
- [ ] To reduce the number of passwords
- [ ] To prevent users from installing anything

**Why:** Least privilege is a **blast-radius** control: assume an account will eventually be
compromised and limit what it can reach. This is why daily work should not happen in an admin
account, and why a standard user who clicks a phishing link causes far less damage than an
administrator who does. It does not mean users can do nothing — it means they can do their job
and no more.

### Q16. Which type of malware encrypts files and demands payment?

- [ ] Spyware
- [ ] Rootkit
- [x] **Ransomware**
- [ ] Adware

**Why:** **Ransomware** encrypts and extorts. A **rootkit** hides itself and other malware deep
in the system, making it hard to detect; **spyware** collects information quietly; **adware**
shows unwanted advertising. The reason to know all four precisely is that the *response*
differs — a rootkit often cannot be cleaned reliably and requires reimaging, while ransomware
response is about isolation, scope and backups.

### Q17. A company laptop is lost at an airport. Which combination best protects the data?

- [ ] A strong login password only
- [x] **Full-disk encryption plus a remote wipe capability**
- [ ] Antivirus software
- [ ] A BIOS password only

**Why:** Encryption makes the data unreadable if the drive is removed — the primary protection —
and remote wipe is the backstop for when the machine connects again. A login password alone
protects nothing against physical access; a BIOS password is a boot-time inconvenience that is
easy to clear on many machines; antivirus is irrelevant to a machine someone is holding. Defence
in depth, with the two controls doing different jobs.

### Q18. Which of these is the strongest indicator that an email is phishing?

- [ ] It arrived outside working hours
- [x] **The link's actual destination does not match the organisation's real domain**
- [ ] It uses the company logo
- [ ] It was sent to several people

**Why:** Checking **where a link actually goes** — by hovering, not clicking — is the most
reliable single test, because display text is trivial to fake while the destination is not.
Timing, logos and recipient count are all weak signals: legitimate mail arrives at night, uses
real logos, and goes to groups. The reason "domain mismatch" is the answer is that it is the one
signal the attacker must get right and usually does not.

### Q19. What does a firewall do on a Windows workstation?

- [ ] Encrypts the hard drive
- [x] **Allows or blocks network traffic according to rules, per application and port**
- [ ] Scans email attachments
- [ ] Manages user passwords

**Why:** A host firewall filters **network traffic** — which programs may listen or connect, on
which ports. It is not antivirus and does not examine attachments; it is not encryption; it does
not manage credentials. The host firewall matters because it can block an unwanted *listener*
even when the perimeter is permissive, which is why disabling it to "fix" a connection problem
is a bad habit.

### Q20. Why should a technician avoid browsing the web or checking personal email on a
workstation they are repairing?

- [ ] It uses company bandwidth
- [x] **It can contaminate the system and destroy the integrity of the evidence or diagnosis**
- [ ] It is against licensing terms
- [ ] It slows the repair down

**Why:** For a machine under repair — especially one suspected of malware — your activity changes
the system you are diagnosing. It introduces new programs, new files and new network traffic,
which can mask the original fault or destroy evidence. This is the same reasoning as order of
volatility in incident response, applied to routine bench work.

### Q21. Which account should be used for day-to-day work on a Windows machine?

- [ ] An account in the Administrators group
- [x] **A standard user account, elevating only when a task requires it**
- [ ] The built-in Administrator account
- [ ] A shared account for the whole team

**Why:** This is least privilege (Q15) made concrete. Working as a standard user means malware
that runs as you cannot silently install or modify system files. The built-in Administrator
account should be disabled or renamed and reserved for emergencies — it is a known, targeted
name. A shared account destroys accountability, so you cannot tell who did what.

### Q22. What is a "zero-day" in the context of a workstation antivirus product?

- [ ] A scan that finds nothing
- [x] **A threat with no signature yet, which behaviour-based detection must catch instead**
- [ ] A virus that spreads in one day
- [ ] A definition update released daily

**Why:** Signature-based detection can only catch what it has seen, so a new threat is invisible
to it until definitions update. **Behavioural** detection covers that gap by watching what code
*does* — encrypting many files quickly, for instance. This is why a modern endpoint product has
both, and why "my antivirus is up to date" is not a complete answer to "am I protected".

---

## Domain 3 — Software troubleshooting (23%)

### Q23. An application crashes every time a user opens a specific file. What should you try FIRST?

- [ ] Reinstall the operating system
- [x] **Reproduce the problem and check whether it happens for other users or other files**
- [ ] Replace the computer
- [ ] Reinstall the application immediately

**Why:** Reproducing and **scoping** the fault tells you whether it is the file, the application
or the machine — and it costs nothing. If the file crashes on every machine, the file is
corrupt; if only this machine crashes on every file, the machine is the problem. That answer
determines the whole fix, and skipping it means guessing. This is the same scope reasoning that
runs through both CompTIA exams.

### Q24. After a Windows update a printer stops working. What is the most likely cause?

- [ ] The printer is broken
- [x] **The update replaced or invalidated the printer driver**
- [ ] The paper tray is empty
- [ ] The network cable is faulty

**Why:** "It worked before the update" makes the update the prime suspect, and printer drivers
are among the most commonly affected. The fix is usually to roll back or reinstall the driver
rather than replace hardware. Note the diagnostic value of the **timing**: when a fault starts
immediately after a change, the change is the cause until proven otherwise.

### Q25. A user reports that their browser is being redirected to unfamiliar search engines and
their homepage keeps changing. What is the most likely cause?

- [ ] A failing hard drive
- [x] **Browser hijacker malware or an unwanted extension**
- [ ] A DNS server fault
- [ ] An out-of-date browser

**Why:** Redirected searches and a homepage that resets are the classic **browser hijacker**
signature, and the persistence is the tell — something is re-applying the setting. Cleaning it
means removing the extension or program, not just resetting the homepage, because a reset alone
will be undone. This is a real and common helpdesk call.

### Q26. An application will not install because of a missing .NET Framework version. What should you do?

- [ ] Reinstall Windows
- [x] **Install the required .NET Framework version**
- [ ] Run the installer as a different user
- [ ] Disable the antivirus

**Why:** The error names its own fix — the prerequisite is missing, so install the prerequisite.
This is worth internalising as a general pattern: read the error before acting on it. Disabling
antivirus to make an installer run is a genuinely dangerous habit, and it is not what the error
is asking for.

### Q27. A user's computer is stuck in a boot loop and cannot reach the desktop. Which tool should
you try?

- [ ] Task Manager
- [x] **Windows Recovery Environment (WinRE), including Startup Repair and System Restore**
- [ ] Disk Cleanup
- [ ] The printer troubleshooter

**Why:** If Windows cannot boot, the recovery environment is the only thing that can run —
Task Manager and Disk Cleanup require a running desktop. WinRE offers Startup Repair, System
Restore (Q4) and a command prompt for `sfc` and `chkdsk`. Reaching for a tool that needs a
working desktop to fix a machine that will not boot is a common and understandable error.

### Q28. A user complains that their laptop is slow, but a check shows low CPU, low RAM usage and
plenty of free disk space. What should you check next?

- [ ] Replace the processor
- [x] **Startup programs, background processes, and whether the disk itself is failing or nearly full**
- [ ] Reinstall the operating system
- [ ] Add more RAM

**Why:** With CPU and RAM eliminated, the remaining suspects are things that do not show as load:
programs launching at boot (Q9), a disk that is **mechanically** failing or above ~90% full, and
background syncing. Note that "plenty of free disk space" and "a healthy disk" are different
claims, and a failing drive causes slowness long before it fails outright.

### Q29. Which action is most likely to fix a mobile app that crashes immediately on launch?

- [ ] Replacing the phone
- [x] **Updating the app, clearing its cache, or reinstalling it**
- [ ] Restoring the phone to factory settings
- [ ] Replacing the battery

**Why:** Order matters — the cheap, reversible, app-scoped fixes come first. Clearing the cache
fixes a large share of crash-on-launch faults because corrupted cached data is a common cause. A
factory reset is the last resort, not the first move, and it destroys the user's data. "Reinstall
the app" before "wipe the device" is the principle.

### Q30. What is the purpose of a clean boot in Windows troubleshooting?

- [ ] To boot faster
- [x] **To start Windows with minimal drivers and startup programs, isolating whether third-party software causes the fault**
- [ ] To reset the BIOS
- [ ] To reinstall Windows

**Why:** A **clean boot** is a **diagnostic**, not a fix: by removing third-party startup
software, you can see whether the problem persists. If it disappears, you re-enable items in
groups to find the culprit. Note the verdict option — "reinstall Windows" — is what people do
*instead* of diagnosing, and it destroys the chance to learn what was wrong.

### Q31. A user reports that a program they use daily has been removed from the Start menu after an
update. What should you check first?

- [ ] Whether the disk has failed
- [x] **Whether the application is still installed and merely missing its shortcut**
- [ ] Whether the monitor is faulty
- [ ] Whether the network is down

**Why:** A missing shortcut and a missing application look identical to a user and are entirely
different problems. Checking the installed programs list distinguishes them in seconds. This is
another case where the fix is trivial once you verify the actual state rather than acting on the
report's wording — a habit that saves a great deal of time.

---

## Domain 4 — Operational procedures (21%)

### Q32. What is the FIRST thing to do before opening a computer to work inside it?

- [ ] Remove all the screws
- [x] **Power it down, disconnect it, and use ESD protection**
- [ ] Put on latex gloves
- [ ] Back up the data

**Why:** Power off and **ESD** protection come first because they protect the hardware from
damage — a static discharge can destroy components in a way that is not visible. Note that
backing up the data is also important, but it comes *before* powering down, not after. Reading
the sequence carefully matters in these questions.

### Q33. Why should you document a ticket as you work rather than at the end?

- [ ] It is a policy requirement
- [x] **Because details are lost, and the next technician needs an accurate record**
- [ ] It makes the ticket look longer
- [ ] It is required for billing

**Why:** Memory is unreliable and a busy day erases details within hours. Documentation written
as you go captures the actual error message and the actual change, which is exactly what the
next person needs when it recurs (as Q23 and Network+ Q40 both show it will). Writing it up at
the end produces a plausible summary rather than a record, which is worse than nothing because
it is trusted.

### Q34. A customer is angry about a recurring fault. What is the most professional response?

- [ ] Explain that it is not your fault
- [x] **Acknowledge the impact, explain what you will do next, and give a realistic timeframe**
- [ ] Escalate immediately without speaking to them
- [ ] Promise it will never happen again

**Why:** Acknowledging the **impact** is what defuses the situation — the customer's frustration
is about lost work, not about you personally. A realistic timeframe is a commitment you can keep;
"never again" is not, and breaking it costs far more trust than the original fault. Deflecting
blame is technically true and professionally useless.

### Q35. Why is a change record required before making a significant system change?

- [ ] To slow the process down
- [x] **So the change, its risk and its rollback are agreed and traceable if something breaks**
- [ ] To bill the customer
- [ ] To satisfy the vendor

**Why:** A change record exists so that when something breaks, you know **what changed and how
to undo it** — the same rollback logic as the Network+ question on change windows. It also
provides the audit trail that answers "why is this configured this way" six months later. If a
change record has no rollback plan, it is not a change record.

### Q36. What is the correct way to dispose of a hard drive containing customer data?

- [ ] Delete the files and empty the recycle bin
- [x] **Physically destroy it, or securely wipe it to a recognised standard, and document the disposal**
- [ ] Reformat it
- [ ] Give it to a colleague for personal use

**Why:** Deleting files removes only the **reference**, not the data — it is recoverable with
free tools. A quick format is barely better. Secure wiping (overwriting to a standard) or
physical destruction are the real options, and the **documentation** is what proves it happened.
This appears on the exam because it is a genuine compliance requirement in most organisations.

### Q37. Which is a legitimate reason to use a scripting tool such as PowerShell in support work?

- [ ] To bypass security policy
- [x] **To perform the same task reliably across many machines and record exactly what was done**
- [ ] To avoid documenting the work
- [ ] To make changes without approval

**Why:** Scripting gives **consistency and a record** — the script is the documentation, and it
does the same thing every time, which manual work does not. The wrong options describe using
automation to evade governance, which is exactly what change management (Q35) exists to prevent.
Scripting and documentation are partners, not substitutes.

### Q38. A technician must work in a server room. Which safety consideration applies specifically
to that environment?

- [ ] Wear a hard hat
- [x] **Check that the environment is safe to enter and be aware of power, weight and hot equipment**
- [ ] Work alone to avoid distraction
- [ ] Disable the air conditioning to reduce noise

**Why:** Server rooms carry specific hazards: **live power**, heavy and awkward equipment that is
easy to drop or pull over, hot surfaces, and raised floors. Two-person lifting is standard rather
than optional for rack equipment. Disabling cooling is the worst possible answer — it endangers
the systems, which is why it is included as a distractor.

### Q39. What does an acceptable use policy define?

- [ ] The technical controls on the network
- [x] **What employees may and may not do with company systems and data**
- [ ] The backup schedule
- [ ] The password complexity rules

**Why:** An AUP is a **behavioural** policy — it sets expectations for people, and it is what
makes a disciplinary process possible when someone misuses systems. Technical controls implement
policy but are not policy themselves; a backup schedule and password rules are specific technical
standards. The distinction matters because an AUP that nobody has read is nearly unenforceable.

### Q40. A user asks you to help with a personal device issue during a work call. What is the most
appropriate response?

- [ ] Refuse without explanation
- [x] **Explain the scope of your support and, where possible, point them to an appropriate resource**
- [ ] Help with it anyway since it is quick
- [ ] Ask them to submit a ticket for the personal device

**Why:** Being clear about **scope** protects your time and sets expectations, and pointing to a
resource keeps the interaction helpful rather than a flat refusal. Doing unpaid personal work
during company time quietly expands what is expected of you and of the team. Professional
boundaries communicated kindly are the answer the exam is looking for — and it is the same
answer that works in practice.

---

## Scoring

**One mark per question, 40 total. No marks deducted for wrong answers — answer everything.**

The pass mark is 700/900 = **77.8%**, which is **32 questions**.

| Score | Percentage | What it means |
|---|---|---|
| 34–40 | 85–100% | Comfortable pass |
| **32–33** | **80–82.5%** | **Pass** |
| 31 | 77.5% | Just under the line — a fail |
| 27–30 | 68–75% | Clear fail |
| below 27 | — | Do not book yet |

### Remember this is half of A+

A+ requires **both** Core 1 and Core 2, at two fees. Sit `a-plus-core-1.md` as well before you
book. Core 2 has the **higher pass mark** of the two, which surprises people who assume the
hardware exam is the harder one.

### If you scored under 32

Operating systems and security are **56%** of this exam. If you lost marks there, the work is
practical: build a Windows VM, join it to a domain if you can, set up BitLocker, create a
standard user, and use `gpupdate`, `sfc` and the Startup tab until they are reflexes. Security is
28% of this exam and is where the *Behavioural* questions live, so read the
`cybersec-roadmap/` foundation phases alongside the IT ones.

**If you lost marks on Q2 or Q21**, go back and read about least privilege properly. It is the
idea underneath several questions here and a large part of the cybersecurity track.

### If you scored 34 or above

Core 2 has performance-based items — simulated Windows environments and command-line tasks —
which a multiple-choice paper cannot represent. Practise the commands in a VM before booking,
and confirm the current exam code with CompTIA: 220-1202 is the A+ v15 series and will
eventually be replaced.

---

## Where each domain is taught

| Domain | Curriculum phases |
|---|---|
| 1. Operating systems | `it-roadmap/02-phase-operating-systems.md` |
| 2. Security | `it-roadmap/02-phase-operating-systems.md`, `cybersec-roadmap/03-phase-security-fundamentals.md` |
| 3. Software troubleshooting | `it-roadmap/04-phase-helpdesk-skills.md`, `it-roadmap/06-phase-tools-and-ticketing.md` |
| 4. Operational procedures | `it-roadmap/06-phase-tools-and-ticketing.md`, `it-roadmap/07-phase-soft-skills.md` |

---

*Unofficial practice questions written for this repository against CompTIA's published
220-1202 objectives. Not affiliated with or endorsed by CompTIA. Exam details checked
2026-09-18 — confirm current details with CompTIA before booking.*
