---
id: cyber-11-incident-response
track: cyber
phase: 11
order: 110
title: "Phase 11 — Incident Response and DFIR"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/cyber/11-incident-response.md"
exit_criteria: "You can take an alert from detection to closure: triage it, set severity, preserve and analyse the evidence in the right order, contain the incident without destroying what you need, and write a report a manager and an auditor can both use."
---

# Phase 11 — Incident Response and DFIR

## Goal of this phase

Learn to run an incident from the first alert to the closing report, preserving evidence correctly, containing without destroying what you need, and writing the account that the business, the auditor, and the next analyst will all rely on.

## Estimated time

**6 weeks** at about 9–12 focused hours a week. Roughly 55–74 hours, and the practice tasks dominate.

## Skills you'll gain

- Run the six-stage incident response lifecycle and explain what each stage produces.
- Triage an alert, assign a defensible severity, and decide whether to escalate.
- Preserve evidence in order of volatility and maintain a chain of custody.
- Acquire a forensic image of a disk and of memory, and explain why the order matters.
- Analyse a timeline and build one from multiple log sources.
- Choose a containment strategy that stops the spread without destroying evidence or tipping off the attacker.
- Write an incident report for a technical and a non-technical reader.
- Run and participate in a tabletop exercise.
- Explain when to escalate internally and when law enforcement is the right call.
- Apply the legal and ethical boundaries that govern forensic work on systems you do not own.

## Specific topics to learn

- NIST SP 800-61 incident response lifecycle: preparation, detection and analysis, containment, eradication, recovery, post-incident activity
- Triage: the first fifteen minutes, and what to record
- Severity and priority: functional impact, information impact, recoverability effort
- Evidence handling, integrity hashing, and chain of custody forms
- Order of volatility: registers and cache, memory, network state, running processes, disk, remote logs, archival media
- Forensic imaging with dd, dc3dd, FTK Imager, and write blockers
- Memory acquisition with WinPmem, DumpIt, and LiME
- Disk artefacts: MFT, USN journal, prefetch, shimcache, amcache, LNK files, jump lists, registry hives
- Windows event log analysis and log2timeline and Plaso timelines
- Network artefacts: netflow, DNS logs, proxy logs, packet captures
- Timeline analysis and super-timelines
- Root cause versus mechanism versus contributing factor
- Containment strategies: isolate, disable, block, and their side effects
- Eradication and recovery: rebuild versus clean, and how to decide
- Post-incident activity: lessons learned, detection improvements, and action tracking
- Reporting for management, for legal, and for the regulator
- Tabletop exercises
- Escalation thresholds, legal hold, and law enforcement engagement in the Philippine context

## Lesson: The Incident Is a Process, Not an Event

### Why this lesson exists

An incident feels like an event. It is not. It is a sequence of decisions, and the quality of those decisions depends almost entirely on work done before anything happened.

This is the phase where the skills from every phase before it converge. You read logs from Phase 4 and Phase 10, you think about identity from Phase 9, and you write reports from Phase 6. Risk reasoning from Phase 13 arrives later and is reinforced here, not assumed. What is new is that you are doing all of it under time pressure, against an adversary who is still active, with evidence that is being destroyed by the minute.

**The two mistakes that define this field** are worth naming at the start, because everything else follows from avoiding them.

| Mistake | What it looks like | What it costs |
|---|---|---|
| **Acting before preserving** | Reimaging the machine to stop the spread before anyone captured memory | The case is unprovable; you cannot say how the attacker got in or what they took |
| **Preserving before containing** | Spending six hours imaging a host while the attacker moves laterally | The attacker reaches the rest of the estate while you take a careful photograph of one room |

Notice these pull in opposite directions. That tension is the phase.

The professional answer is not to pick one. It is to **know which evidence is volatile enough that it must be captured in the first minutes, contain in parallel, and accept that some evidence will be lost because stopping the incident comes first.**

#### What the exit criterion actually demands

Read it again closely, because it names five distinct capabilities.

| Requirement | The skill underneath it |
|---|---|
| **Take an alert from detection to closure** | Process discipline — you know what happens at each stage |
| **Triage it, set severity** | Judgement under uncertainty, with a defensible rationale |
| **Preserve and analyse evidence in the right order** | Technical forensics, and the order of volatility |
| **Contain without destroying what you need** | A trade-off, made deliberately and explained |
| **Write a report a manager and an auditor can both use** | Translation — two audiences, two registers, one document |

The last one is the one candidates underestimate, and it is the one hiring managers care most about. Plenty of people can run a tool. Far fewer can explain what happened to a manager who needs to decide whether to notify regulators.

#### Time to complete

**Roughly 55–74 hours over 6 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 4–6 | Once, properly |
| Tool installation and a first forensic image | 8–12 | The slowest part is usually hardware, not skill |
| Analysing the image: artefacts and a timeline | 14–18 | Where the real learning is |
| Practising triage on lab alerts | 8–10 | Deliberately time-boxed |
| The full incident report | 12–16 | The portfolio artefact |
| Tabletop exercise, run or written | 6–8 | Produce the inject list and the findings |
| Legal and escalation notes | 3–4 | The part that protects you |

If your hardware cannot run full forensic tooling, that is a real constraint and it has an honest answer — Part 6 covers the browser-and-CLI route that still produces genuine evidence.

#### What this phase is not

It is not a phase about memorising every Windows artefact. There are hundreds, you will learn a handful well, and the handful you learn will be enough for an entry-level role.

It is not a legal qualification either. This phase teaches you to recognise when a question is legal rather than technical. It does not make you the person who answers it, and knowing the difference is part of the skill.

### Part 1 — The lifecycle, and what each stage actually produces

#### The six stages

The canonical model is NIST SP 800-61, and it is worth learning by its real names because interviewers use them. **Note the revision:** SP 800-61 Rev. 3 (April 2025) superseded Rev. 2, and it restates these same stages as the *previous* life cycle model before mapping each one onto CSF 2.0. The stage names below are unchanged and are still what an interviewer means — Rev. 3 keeps them in a table that pairs each stage with the CSF 2.0 functions it serves.

| Stage | What happens | The artefact you produce |
|---|---|---|
| **1. Preparation** | Before anything: plans, contacts, tools, access, training, logging | The IR plan, the contact list, the jump bag, the log coverage map |
| **2. Detection and Analysis** | Something is noticed, triaged, validated, and scoped | The incident ticket, the initial severity, the scope statement |
| **3. Containment** | Stop the spread, short term and then longer term | The containment decision and its documented rationale |
| **4. Eradication** | Remove the attacker's access and the malware | Evidence of removal, and the rebuilt or cleaned assets |
| **5. Recovery** | Return to normal operation, carefully and watchfully | Restoration records and enhanced monitoring |
| **6. Post-Incident Activity** | Learn, improve, and prove you improved | The incident report, the lessons learned, the action tracker |

Rev. 3 pairs these stages with the CSF 2.0 functions they serve: Preparation maps to **Govern** and **Protect**, Detection and Analysis to **Detect**, Containment through Recovery to **Respond** and **Recover**, and Post-Incident Activity back into **Identify** as an improvement input. If you are asked "how does incident response fit the CSF?", that mapping is the answer.

Three things about this model are frequently misunderstood, and each one costs organisations real money.

**The stages overlap.** Containment often starts while analysis is still running, because you cannot wait. Eradication begins on one host while another is still being analysed. A model drawn as a straight line is a teaching aid, not a workflow.

**Preparation is where the incident is won or lost.** An organisation with no logging, no contact list, and nobody who has done this before will do all six stages badly, regardless of how good the analyst is. The most valuable thing a junior can do in their first year is improve preparation.

**Post-incident activity is the stage that gets skipped**, and skipping it means the same incident happens again. The lessons learned meeting, the action tracker, and the detection improvements are the whole point.

#### The IR plan, and what a small organisation's version looks like

A plan does not need to be a hundred pages. It needs to answer six questions.

| Question | What the answer contains |
|---|---|
| **Who decides?** | Named roles: who declares an incident, who authorises containment, who talks to the press |
| **Who do we call?** | A contact list with phone numbers, not just email, and an out-of-band channel |
| **What counts as an incident?** | Severity definitions with examples, so a junior can classify without asking |
| **What do we do first?** | The first-hour checklist for the three most likely scenarios |
| **What must we keep?** | Evidence handling rules, and the legal hold trigger — a legal hold is a preservation obligation that suspends normal deletion, so once it is in force nothing related to the matter may be destroyed however routine the cleanup looks |
| **How do we get back up?** | Restoration priorities and the order systems come back |

The fourth row is the one that saves time at three in the morning. A first-hour checklist for ransomware, for a compromised account, and for a data-exposure event covers a large share of real incidents.

#### Worked example: a first-hour checklist

```text
FIRST HOUR — Suspected compromised user account

Time-stamp every line. Record who did what, in order. Do not skip.

[ ] 0–5 min   Open an incident ticket. Record the alert source, the time,
              the account, and who is responding.
[ ] 5–10 min  Notify the on-call lead. State what you know and what you
              do not. Do not speculate in writing.
[ ] 10–15 min Preserve the volatile evidence, in this order:
                1. Active sessions and their source addresses
                2. The account's recent sign-in log, exported to a file
                3. Mailbox rules, mailbox forwarding, and delegates
                4. Registered MFA methods, with registration timestamps
[ ] 15–20 min Contain, if authorised:
                - Revoke all sessions and refresh tokens
                - Reset the password
                - Remove MFA methods added in the suspicious window
                - Do NOT disable the account yet — you need the audit trail
[ ] 20–30 min Scope: what else did this account touch? Mailbox, files,
              applications, admin portals, connected cloud services.
[ ] 30–45 min Contact the user out of band — a phone call to a number you
              already had, never a reply to an email.
[ ] 45–60 min Write the initial summary: what is known, what is unknown,
              what was done, what is next. Send it to the lead.
```

Two lines in that checklist are deliberate and worth explaining.

**"Do NOT disable the account yet"** surprises people. Disabling an account stops the attacker and also stops your visibility: many platforms stop recording meaningful activity for a disabled identity, and the account's history becomes the only record of what they did. Revoking sessions while leaving the account enabled, briefly, is often the better first move.

**"Contact the user out of band"** is the control that prevents the second compromise. If the attacker controls the mailbox, an email asking "did you do this?" is answered by the attacker.

### Part 2 — Triage, severity, and the decision to escalate

#### Triage in fifteen minutes

Triage is a decision about how much attention something deserves. It is not an investigation, and confusing the two is how analysts spend three hours on a false positive while a real incident sits unread.

| Minute | Question | Output |
|---|---|---|
| 0–2 | What fired, on what, and when? | A one-line statement of the alert |
| 2–5 | Is the alert real, or is it a known false positive? | True, false, or genuinely undetermined |
| 5–8 | What is affected — one user, one host, or something shared? | Scope estimate |
| 8–11 | Is the attacker still active? Are there signs of ongoing activity? | Active or dormant |
| 11–13 | What is the worst plausible outcome if I am wrong? | Impact ceiling |
| 13–15 | What is my severity, and who do I tell? | Severity and escalation decision |

**The eleven-to-thirteen minute question is the one that sets severity**, and it is deliberately phrased as "if I am wrong." Severity is about the potential consequence, not the confirmed one, because you rarely have confirmation at fifteen minutes.

#### Severity, defined so two analysts agree

The most common failure in a real SOC is that severity means whatever the analyst felt at the time. The fix is a written scale with examples.

| Severity | Definition | Example | Response |
|---|---|---|---|
| **Critical (S1)** | Confirmed or strongly indicated compromise of a system holding regulated or business-critical data, or an active attacker with privileged access | Ransomware executing; domain admin account confirmed compromised | All-hands, executive notification, containment authorised immediately |
| **High (S2)** | Confirmed compromise of a user account or a single host, with no evidence of spread | A phishing victim entered credentials and MFA was approved | Same-day response, containment authorised, scope investigation begins |
| **Medium (S3)** | Suspicious activity that is not confirmed compromise, or confirmed compromise of a low-value asset | Repeated failed logons against one account; malware blocked at the gateway | Respond within the shift; monitor; escalate if it develops |
| **Low (S4)** | Policy violation, or a detection with a known benign explanation that still warrants a record | User installed unapproved software; a blocked phishing email reported by a user | Ticket and close, with a note |

Two refinements make this scale usable.

**Severity is about impact; priority is about urgency.** A low-impact issue on a system that is about to be used in a public launch can be high priority. Keeping the two separate is what lets you say "medium severity, high priority" without sounding confused.

**Severity can move in both directions.** An S3 that becomes an S2 when the failed logons are followed by a success. An S2 that drops to S3 when the "compromised" account turns out to be a service account with a documented scheduled task.

| Trigger | Change |
|---|---|
| Confirmed data access or exfiltration | Raise to S1 |
| Evidence of spread to another host | Raise one level |
| A privileged account involved | Raise one level |
| The activity is explained by a change record | Lower, and record the explanation |
| The user confirms a legitimate action | Lower, but keep the ticket |

**Never close an alert without a written reason.** "False positive" alone is not a reason. "False positive — the source IP belongs to the corporate VPN pool, and the user confirmed they were working from home, verified by phone" is.

#### Functional impact, information impact, recoverability

NIST's severity model uses three axes, and they are more useful than a single number because they let you describe an incident precisely.

| Axis | Question | Values |
|---|---|---|
| **Functional impact** | What can the organisation no longer do? | None, minimal, moderate, significant |
| **Information impact** | What data was or may have been affected? | None, privacy breach, proprietary breach, integrity loss |
| **Recoverability** | How hard is it to get back to normal? | Regular, supplemented, extended, not recoverable |

An incident described as **functional: significant, information: privacy breach, recoverability: extended** tells a manager more in nine words than a single severity number ever will, because it separates what is broken from what is exposed from how long the fix takes.

#### Worked example: three triages, three severities

**Alert A.** A user reports an email asking them to confirm their password. They did not click. The message passed the spam filter.

| Axis | Assessment |
|---|---|
| Real or false | Real phishing message, no interaction |
| Scope | One mailbox, possibly a wider campaign |
| Active? | No — the user did not click |
| Worst plausible outcome | Credential theft if others clicked |
| Severity | **S4** — block the sender, check whether others received it, record it |

**Alert B.** Five hundred failed logons against one account in ten minutes from a single external address, followed by a successful sign-in from the same address with an MFA approval.

| Axis | Assessment |
|---|---|
| Real or false | Real — the success after the failures is the deciding evidence |
| Scope | One account, but the account is a member of the finance group |
| Active? | Yes, almost certainly |
| Worst plausible outcome | Mailbox access, financial fraud, lateral movement |
| Severity | **S2**, escalating to S1 if finance data is confirmed accessed |

**Alert C.** An endpoint detection alert fires: a process opened `lsass.exe` with credential-dumping access rights, on a workstation belonging to a helpdesk administrator.

| Axis | Assessment |
|---|---|
| Real or false | Probably real — the access rights are specific, but some backup and monitoring software triggers it |
| Scope | One host, and the host holds administrative credentials for many others |
| Active? | Unknown — this needs to be established fast |
| Worst plausible outcome | Domain-wide compromise |
| Severity | **S2 until proven S4.** With a privileged user on the host, you start high and lower it when the evidence supports that |

**The reasoning in Alert C is the one worth internalising.** When the potential impact is domain-wide and the evidence is ambiguous, you start at the higher severity. Lowering a severity costs nothing but a note. Raising one late costs you whatever happened in between.

### Part 3 — Evidence: volatility, integrity, and custody

#### Order of volatility

Some evidence disappears when you power off, and some disappears when you wait. The order of volatility is the rule that prevents you from destroying the most fragile evidence by reaching for the most familiar tool first.

| Priority | Evidence | Survives reboot? | Survives an hour? |
|---|---|---|---|
| **1** | CPU registers and cache | No | No |
| **2** | Memory: running processes, network connections, encryption keys, injected code | **No** | Until the process exits or the host reboots |
| **3** | Network state: active connections, ARP cache, routing table, listening sockets | No | Until connections close |
| **4** | Running system state: logged-in users, scheduled tasks in memory, mounted shares | Partly | Varies |
| **5** | Temporary files and swap or page files | Partly | Until cleaned |
| **6** | Disk: files, registry, event logs, MFT, USN journal | **Yes** | Until overwritten or rotated |
| **7** | Remote logs and monitoring data: SIEM, proxy, DNS, firewall | Yes | **Until the retention window expires** |
| **8** | Physical configuration and network topology | Yes | Yes |
| **9** | Archival media and backups | Yes | Yes |

Two rows in that table are the ones that catch people.

**Row 2 — memory — is the single most valuable and most perishable evidence.** It contains the running malware in its decrypted state, the network connections the attacker opened, the credentials and keys in use, and often the command history. A host that is powered off loses all of it permanently. This is why the first action on a suspected compromised Windows host is a memory capture, not a shutdown.

**Row 7 — remote logs — is the one people forget has an expiry.** Your firewall logs may only be retained for seven days. If you take three weeks to investigate, the network evidence of the intrusion is gone. The retention window is a deadline, and it should be one of the first things you check.

```text
The practical first-fifteen-minutes order, for a suspected Windows host:

  1. Memory capture, to external media.             <- most perishable
  2. Network state: netstat, arp, route, sessions.
  3. Logged-in users and running processes.
  4. Scheduled tasks, services, and startup items.
  5. Then, and only then, consider isolation.
  6. Disk imaging, which can wait — the disk survives.
```

**Step 5 is a decision, not an automatic step.** Isolating a host by disabling its network adapter destroys the attacker's live connection, which is sometimes the only way to identify their infrastructure. Network-isolating at the switch, which preserves the host's memory and processes while cutting the route out, is often the better containment.

#### Hash everything, and understand why

An integrity hash is a fixed-length value computed from a file's contents. Change one bit and the hash changes completely.

| Purpose | What you do |
|---|---|
| Prove the image matches the original | Hash the original media before imaging and the image after, and compare |
| Prove nothing changed afterwards | Re-hash the image at every transfer and note the value |
| Identify a known file | Compare a hash against a public reputation service |
| Detect tampering | A mismatch in a chain-of-custody hash is a serious finding |

```bash
# Hash the source before you image it. Record the output in your notes.
sha256sum /dev/sdb

# Image the disk, hashing as you write, so the hash is computed in one pass.
dc3dd if=/dev/sdb of=/evidence/disk.img hash=sha256 log=/evidence/imaging.log

# Verify the image afterwards and compare with the pre-imaging value.
sha256sum /evidence/disk.img

# A raw dd equivalent, slower but universally available.
dd if=/dev/sdb of=/evidence/disk.img bs=4M conv=noerror,sync status=progress
sha256sum /evidence/disk.img
```

Two details in those commands matter and are commonly skipped.

**`conv=noerror,sync`** stops `dd` from aborting on a read error, and pads the failed block so the output still aligns with the source. Without it, a single bad sector aborts the image and the offsets in your output no longer correspond to the original disk.

**`bs=4M`** matters more than it looks. Small block sizes make a large image take many hours. A 500 GB disk at `bs=512` can take a full day.

#### Chain of custody

Chain of custody is the documented history of who held the evidence, when, and what they did with it. It exists so that a third party can trust your evidence without having watched you.

```text
CHAIN OF CUSTODY RECORD

Case / incident       INC-2026-0314-01
Evidence item         001 of 003
Description           Memory image, host LAB-WIN10, 16 GB
Acquired by           Your Name
Acquisition tool      WinPmem 4.0.1
Acquisition time      2026-03-14 09:12 UTC
SHA-256               9f2c1a...e4b7

  #  Date/time (UTC)     Released by     Received by     Purpose
  1  2026-03-14 09:12    Your Name       Your Name       Acquisition
  2  2026-03-14 09:40    Your Name       Evidence Locker Storage, seal S-4471
  3  2026-03-15 14:05    Evidence Locker Your Name       Analysis, copy made
  4  2026-03-15 18:22    Your Name       Evidence Locker Analysis complete, re-sealed

Storage              Locked cabinet, Room 2, seal S-4471 intact
Notes                A working copy was used for analysis. The original
                     was never modified. Copy hash verified.
```

**The rule that makes this work: analyse a copy, never the original.** The original is sealed and untouched from the moment of acquisition. Every subsequent hash you compute is on the working copy, and the original's hash is the reference.

The line beginners most often miss is the **Purpose** column. "Analysis" is not enough. "Analysis — memory string search for C2 domains" is a description someone else can audit.

#### Write blockers, and why they are not optional

A write blocker is a device or a software setting that allows reads from a disk while preventing any write. Without one, simply attaching a suspect disk to your workstation can modify it — Windows will write to the volume, update timestamps, and mount it, altering the very evidence you are trying to preserve.

| Environment | How you avoid writing |
|---|---|
| Physical acquisition | A hardware write blocker between the disk and your machine |
| Virtual machine | Attach the disk as read-only, and take a snapshot before you start |
| Linux | Mount read-only with `mount -o ro,noload`, and prefer working on the image rather than the device |
| Cloud | Snapshot the volume first, and work only on the snapshot |
| USB device | Registry write-protection, or a hardware blocker |

**The practical consequence:** if you cannot afford a hardware write blocker, work entirely from an **image** rather than the original device. You take the image once, on a machine you control, having booted from a forensic or Linux environment that does not auto-mount. Everything after that touches only the image file.

### Part 4 — Memory and disk: what each one gives you

#### Memory analysis, and the questions only it can answer

Memory holds what the system was doing, and it holds it in plain form. A great deal of attacker activity leaves no trace on disk at all.

| Question | Why memory answers it and disk does not |
|---|---|
| What process is running that should not be? | Fileless malware never writes an executable to disk |
| What network connections were open? | The connection table lives in memory; a log may not have recorded it |
| What command line launched that process? | Process arguments are in memory, in full |
| What was injected into a legitimate process? | Injection leaves the malicious code in memory, not on disk |
| What credentials or keys were in use? | Credentials in memory are decrypted; on disk they are protected |
| What did the attacker type? | Command history and console buffers live in memory |
| Was there a rootkit hiding files? | Memory may show what the API is concealing |

The first row is the reason this matters most. **Fileless techniques** — PowerShell in memory, .NET assemblies loaded directly, WMI-based execution — are designed specifically to leave no artefact on the disk. If you only ever analyse disks, you will conclude that nothing happened.

```bash
# Linux memory acquisition with LiME. Build against the target kernel first.
# From a matching kernel source tree:
make -C /lib/modules/$(uname -r)/build M=$PWD modules

# Load the module and write memory to a file over the network or to disk.
insmod lime.ko "path=/evidence/memory.lime format=lime"

# Then acquire the disk image, in that order, not the other way round.
dc3dd if=/dev/sda of=/evidence/disk.img hash=sha256 log=/evidence/disk.log
```

```powershell
# Windows memory acquisition with WinPmem, from an elevated prompt,
# running from external media so you do not overwrite anything.
winpmem_mini_x64.exe C:\evidence\memory.raw

# Verify the hash of the acquisition file.
Get-FileHash C:\evidence\memory.raw -Algorithm SHA256 |
  Format-List

# Volatility 3, run from your analysis machine, against the captured image.
vol -f memory.raw windows.info
vol -f memory.raw windows.pslist
vol -f memory.raw windows.netscan
vol -f memory.raw windows.cmdline
```

The four Volatility commands at the end are the first four you run on any Windows memory image, and each answers one of the questions above.

| Plugin | What it lists | What you look for |
|---|---|---|
| `windows.info` | System and image metadata | Confirms the image is usable and gives the kernel version |
| `windows.pslist` | Running processes | Unexpected names, unusual parents, system processes with odd paths |
| `windows.netscan` | Network connections, present and recently closed | Outbound connections to unfamiliar addresses |
| `windows.cmdline` | Command lines per process | Encoded or download-cradle command lines |

**The comparison that matters is `pslist` against the process list you can see on the live host.** A process visible in memory but absent from the live listing suggests something is hiding it. That comparison is the core of rootkit detection, and it takes two commands.

#### Disk artefacts worth knowing

You do not need all of them. You need to know which artefact answers which question.

| Artefact | Where it lives | What it answers |
|---|---|---|
| **MFT** — Master File Table | `$MFT` at the volume root | What files exist and existed, with timestamps, including deleted ones |
| **USN Journal** | `$Extend\$UsnJrnl` | What changed, in order, with reasons — created, written, renamed, deleted |
| **Prefetch** | `C:\Windows\Prefetch` | Which programs ran, when, and how often |
| **ShimCache** | Registry `AppCompatCache` | Which executables existed on the system, even if deleted |
| **AmCache** | `C:\Windows\AppCompat\Programs\Amcache.hve` | Program execution with SHA-1 hashes and install paths |
| **LNK files** | User `Recent` folders | Which files the user opened, and from where |
| **Jump lists** | User `AutomaticDestinations` | Recently and frequently used files per application |
| **Registry hives** | `SYSTEM`, `SOFTWARE`, `SAM`, `NTUSER.DAT` | Services, run keys, installed software, user activity |
| **Event logs** | `C:\Windows\System32\winevt\Logs` | Security, System, Application, and Sysmon records |
| **Browser history** | Per-user profile | Download sources, visited sites, uploaded file names |
| **Recycle Bin** | `$Recycle.Bin` | Deleted files, and the path they came from |

**AmCache is the single most under-used artefact by beginners.** It records executables with their SHA-1 hashes, which means you can take a hash you found in AmCache and check it against a public reputation service without ever having the file.

**The USN Journal is the timeline generator.** It records changes in order with reasons, which is what lets you say "at 09:14:02 the file was created, at 09:14:03 it was renamed, at 09:14:09 it was deleted" without relying on timestamps that an attacker may have altered.

#### The timestomping problem

Attackers can change file timestamps, and Windows stores several of them for different purposes. If you only look at one, you can be misled.

| Timestamp | Field | What sets it |
|---|---|---|
| Created | `$SI` created | When the file was placed on this volume |
| Modified | `$SI` modified | When the content last changed |
| Accessed | `$SI` accessed | When it was last read, and often disabled by default |
| MFT entry modified | `$SI` record changed | When any metadata for the file changed |
| `$FN` created | Filename attribute created | A separate set, harder for user-mode tools to alter |

**The inconsistency is the detection.** A file whose `$SI` timestamps say 2019 but whose `$FN` timestamps say last Tuesday was very likely timestomped. Seeing a single timestamp tells you nothing; comparing the two sets tells you a great deal.

#### Worked example: reading a disk for the first time

You have an image of a Windows 10 workstation, and a hypothesis: the user opened a malicious document, and something executed.

```text
A realistic first pass, in this order.

 1. Mount the image read-only and confirm the hash before you touch anything.
 2. Read Prefetch for anything in the incident window.
       Question: which executables ran between 09:00 and 10:00?
 3. Read the Sysmon operational log, if present, for event IDs 1, 3, 11.
       Question: which process spawned what, with which command line?
 4. Read the Security log for 4624, 4688, and 4672.
       Question: who logged on, and did anything get administrative rights?
 5. Read the USN journal for file activity in the window.
       Question: what appeared and disappeared, and in what order?
 6. Read AmCache for executables in user-writable paths.
       Question: what ran from Downloads, Temp, or AppData?
 7. Read the LNK files and Jump lists.
       Question: what did the user open, from where?
 8. Build the timeline from all of the above into one table.
```

Step 8 is where the answer appears. Individually, each artefact gives you a fragment. Ordered together, they produce a sequence with a cause.

| Time (UTC) | Source | Event |
|---|---|---|
| 09:04:12 | Security 4624 type 2 | User `LAB\jsantos` logs on interactively |
| 09:11:40 | LNK / Jump list | `Invoice_4421.docm` opened from `C:\Users\jsantos\Downloads` |
| 09:11:44 | Sysmon 11 | `C:\Users\jsantos\AppData\Local\Temp\kx8f.tmp` created |
| 09:11:46 | Sysmon 1 | `WINWORD.EXE` spawns `powershell.exe -nop -w hidden -enc ...` |
| 09:11:52 | Sysmon 3 | Outbound HTTPS from `powershell.exe` to `203.0.113.44:443` |
| 09:12:03 | Sysmon 1 | `schtasks.exe /create /tn Updater /tr ...` |
| 09:12:20 | Security 4698 | Scheduled task `Updater` created |
| 09:14:02 | USN journal | `kx8f.tmp` renamed to `svchost.exe` in the same folder |
| 09:14:09 | USN journal | Original `kx8f.tmp` deleted |
| 09:30:00 | Prefetch | `SCHTASKS.EXE` execution recorded |

Read that timeline and the incident is already half-explained: a macro-enabled document, a hidden encoded PowerShell, an outbound connection, and a scheduled task for persistence, with the payload renamed to impersonate a system process and placed in a user directory where a real `svchost.exe` would never live.

**Each row has a source.** That is what makes the table evidence rather than narrative, and it is what allows a reviewer to check your work.

### Part 5 — Containment, eradication, and recovery

#### Containment is a set of trade-offs

Containment stops the spread. Every option has a cost, and the professional skill is choosing deliberately and writing down why.

| Strategy | What it does | Stops the spread? | Preserves evidence? | Cost |
|---|---|---|---|---|
| **Network isolation at the switch** | Cuts the host's network route | Yes | **Yes — memory and processes intact** | Requires switch access and coordination |
| **Disable the network adapter** | Cuts the host's connectivity from the host | Yes | Mostly — memory intact, live connections lost | Loses the attacker's active session detail |
| **Host-based firewall block** | Blocks outbound traffic by rule | Usually | Yes | Attacker may notice and adapt |
| **Disable the user account** | Prevents further authentication | Yes, for that account | Reduces visible activity | Attacker notices; may accelerate |
| **Revoke sessions and tokens** | Kills active cloud sessions | Yes | Yes — logs continue | Attacker notices |
| **Reset credentials** | Invalidates stolen passwords | Partly | Yes | Useless if the attacker has a second path |
| **Power off the host** | Stops everything | Yes | **No — memory is destroyed** | The most destructive containment option |
| **Reimage the host** | Returns to a known-good state | Yes | **Destroys the disk evidence** | Only acceptable after imaging |

**The power-off row is the one to hold onto.** It is the option an inexperienced responder reaches for first, because it is decisive and easy to explain. It is also the one that destroys the evidence that would tell you how the attacker got in — which means you will be doing this again next month.

#### Short-term versus long-term containment

Containment has two phases, and confusing them causes either a slow response or a destroyed investigation.

| | Short-term containment | Long-term containment |
|---|---|---|
| **Timing** | Immediately, during the incident | After the attacker is evicted, before recovery |
| **Goal** | Stop the bleeding | Keep operations running while the fix is built |
| **Typical action** | Isolate the host, block the address, revoke the session | Rebuild on clean infrastructure, with temporary compensating controls |
| **Duration** | Hours | Days to weeks |
| **Risk** | Incomplete — the attacker may have other paths | The attacker may return if the fix is partial |

A strong short-term containment that is documented is better than a perfect one that arrives four hours late. Say so in the report, with the time you decided and the reason.

#### Eradication: clean or rebuild

| Approach | When it is right | Risk |
|---|---|---|
| **Clean in place** | The compromise is well understood, scoped to a small number of files, and you can prove removal | You may miss a persistence mechanism; you cannot prove a negative |
| **Rebuild from a known-good image** | The compromise is unclear, the host held credentials, or the attacker had administrative access | Time, and the risk of reintroducing the vulnerability if the build is not fixed |
| **Replace the hardware or firmware** | A firmware or boot-level compromise is suspected | Cost, and the difficulty of proving the suspicion |

**The rule that experienced responders use:** if the attacker had administrative access to the host, rebuild it. Cleaning a host you do not fully understand produces a machine you cannot vouch for, and "we think it is clean" is not a statement anyone should make about a compromised system.

#### Recovery, with the watch phase

Recovery is not "turn it back on." It is a staged return with heightened monitoring, because a competent attacker who has been evicted will often try to come back.

| Stage | What you do | What you watch for |
|---|---|---|
| **1. Validate** | Confirm the fix is in place and the vulnerability is closed | The original entry vector still being open |
| **2. Restore** | Bring systems back in priority order, testing as you go | Immediate re-infection |
| **3. Monitor more closely** | Increase logging and alert sensitivity for a defined period | The attacker's return, and the same detection firing again |
| **4. Return to normal** | Reduce the enhanced monitoring once the period passes | Close the incident formally |

**Set a defined monitoring period and write it down.** "Enhanced monitoring for fourteen days, with the original detection rule at elevated severity" is a decision. "We will keep an eye on it" is not.

The most common recovery failure is restoring from a backup that contains the compromise. If the attacker's persistence was established six weeks before detection, a backup from five weeks ago restores the backdoor along with the data.

| Check before restoring | Why |
|---|---|
| When did the attacker first have access? | Determines the oldest safe backup |
| Was the backup system reachable from the compromised network? | A compromised backup is not a recovery point |
| Are the credentials used for restore still valid and clean? | Restoring with a stolen credential re-establishes the compromise |
| Is the vulnerability that let them in actually fixed? | Otherwise restoration is a countdown |

### Part 6 — Doing this on a $0 budget

#### The honest hardware question

Full DFIR practice normally assumes a machine that can run a hypervisor, hold large images, and process them. If your machine cannot, that is a real constraint, and it has three honest answers rather than one.

| Route | What you need | What you produce |
|---|---|---|
| **Full local lab** | 16 GB RAM and 100 GB free disk | Complete disk and memory analysis on your own images |
| **Public forensic images** | An ordinary machine and free tooling | Genuine analysis, on evidence someone else captured |
| **Public challenge platforms** | A browser | Triaged investigations with realistic artefacts |

The second route is the one learners skip and should not. **Forensic images of real, well-documented intrusions are published for free**, and analysing someone else's image is closer to real work than imaging your own laptop, because the answer is unknown to you and the artefacts are realistic.

| Source | What it gives you |
|---|---|
| **DFIR challenge platforms** | Memory and disk images with a scenario and questions |
| **Public case data** | Images published alongside research papers and training exercises |
| **Your own VM snapshots** | Full control, and you already know the answer, which limits the learning |
| **A deliberately infected VM** | Real malware behaviour, in isolation, with all the legal safety that implies |

The fourth entry has a hard condition attached, and it is worth stating precisely. **You may run malware only in an isolated virtual machine with no network route to anything real, on hardware you own, where you accept the risk of complete loss of that machine.**

Host-only networking, no shared clipboard, no USB passthrough, and a snapshot you can discard. The one folder exception is the read-only evidence mount described in Part 6, which carries the capture *out* of the target rather than letting anything *in*.

Anything less is how a learner infects their employer's network.

#### Free tooling that is genuinely enough

| Tool | Purpose | Cost |
|---|---|---|
| **Autopsy** | Disk image analysis with a graphical interface | Free, open source |
| **The Sleuth Kit** | Command-line disk forensics underneath Autopsy | Free, open source |
| **Volatility 3** | Memory analysis | Free, open source |
| **FTK Imager** | Imaging and image mounting | Free |
| **dc3dd / dd** | Command-line imaging with hashing | Free |
| **KAPE** | Targeted artefact collection | Free version |
| **Eric Zimmerman's tools** | Individual artefact parsers: MFTECmd, PECmd, LECmd, JLECmd, AmcacheParser | Free |
| **Plaso / log2timeline** | Automated super-timeline generation | Free, open source |
| **Timeline Explorer** | Large CSV timeline review | Free |
| **CyberChef** | Decoding, deobfuscation, and data transformation | Free, open source |
| **SANS SIFT Workstation** | A Linux distribution with the forensic toolchain preinstalled | Free |
| **Wireshark** | Packet capture analysis | Free, open source |

**CyberChef deserves a specific recommendation for a beginner.** Decoding a base64 PowerShell command, extracting strings, converting a timestamp, or deobfuscating a script is a frequent task, and doing it in a browser-based tool with a visual recipe is far faster than writing a script for a one-off. It runs entirely offline, which means you can use it on real evidence without sending anything anywhere.

```bash
# A minimal end-to-end flow on a Linux analysis machine with SIFT installed.

# 1. Identify the image.
img_stat /evidence/disk.img

# 2. Hash before anything else.
sha256sum /evidence/disk.img | tee /evidence/disk.sha256

# 3. List partitions and note the offsets.
mmls /evidence/disk.img

# 4. Build a filesystem timeline for the partition at offset 1048576.
fls -o 1048576 -r -m C:/ /evidence/disk.img > /evidence/bodyfile.txt

# 5. Convert it into a sortable timeline.
mactime -b /evidence/bodyfile.txt -d > /evidence/timeline.csv

# 6. Add event log records to the same timeline with Plaso.
log2timeline.py --storage-file /evidence/plaso.db /evidence/disk.img
psort.py -o l2tcsv -w /evidence/supertimeline.csv /evidence/plaso.db
```

Those six commands produce the artefact that answers most investigation questions: a single sortable table of everything that happened, from every source, in order.

#### Working from a published challenge

A realistic workflow on a free challenge platform, which is how most learners should start.

| Step | What you do |
|---|---|
| 1 | Read the scenario once, and write down your hypothesis before touching the evidence |
| 2 | Hash the provided image and record the value in your notes |
| 3 | Answer the platform's questions, but keep a separate investigation log as you go |
| 4 | For each question, record the artefact and the exact command or path you used |
| 5 | After the questions, do the parts the platform did not ask for: a full timeline, an impact assessment, and a remediation list |
| 6 | Write the report in the Phase 6 structure, with a limitations section |

Step 3 is what turns a challenge into a portfolio piece. Anyone can complete the questions. The investigation log is what shows a reviewer how you think.

#### The lab you can actually build

If you have a machine that can run one hypervisor and one VM at a time, this is enough.

```text
Minimum viable DFIR lab

  Host machine
    └── Hypervisor (VirtualBox or Hyper-V)
          ├── Analysis VM — Ubuntu with SIFT packages, 4 GB RAM
          │                 Internet access is fine; it holds no malware
          └── Target VM  — Windows 10 evaluation, 4 GB RAM, snapshot taken
                            Host-only network. No shared folders.
                            No shared clipboard. No USB passthrough.

  Workflow
    1. Snapshot the target VM.
    2. Simulate activity: create a user, add it to Administrators, create a
       scheduled task, run an Atomic Red Team test.
    3. Capture memory from inside the target VM to a shared-evidence folder
       that is mounted read-only from the analysis VM.
    4. Roll the target VM back to the snapshot — the disk evidence is gone,
       which is exactly the point of the exercise.
    5. Analyse the memory image on the analysis VM.
    6. Repeat with a disk image instead of a snapshot rollback.
```

Step 4 is deliberate and important. Rolling back destroys the disk evidence, so the memory image is all you have — which is exactly the constraint a real responder faces when a host has already been reimaged. Practising under that constraint teaches you what memory can and cannot tell you.

### Part 7 — Writing the report, and running the exercise

#### Two readers, one document

The incident report has two audiences, and both must be able to use it.

| Reader | What they need | Where they find it |
|---|---|---|
| **The manager or executive** | What happened, what it cost, what is being done, whether they must tell anyone | Executive summary, impact, current status |
| **The technical reviewer** | How you know, what you checked, what you could not determine | Timeline, evidence, analysis, limitations |
| **The auditor or regulator** | When it was detected, how long it took, what controls failed, what changed | Timeline with times, control failures, remediation with dates |
| **The next analyst** | What to look for if this happens again | Detection gaps, indicators, lessons learned |

The document that serves all four is a layered one: a summary a busy person can read in ninety seconds, then detail that a technical reader can verify.

```text
## Incident Report — INC-2026-0314-01

### Executive summary
Three to five sentences. What happened, what was affected, what was done,
and what the reader needs to decide. No jargon.

### Incident details
  Incident ID, classification, severity, priority, current status.
  Detection time, declaration time, containment time, closure time.
  All times in a stated timezone, with UTC in brackets.

### Timeline
A table. Time, event, source. Evidence-backed, in order.

### Analysis
What the evidence supports, and what it does not.
Separate the mechanism from the root cause.

### Impact
Functional impact: what could not be done.
Information impact: what data was or may have been affected.
Recoverability: how the recovery was achieved and how long it took.

### Containment and eradication
What was done, when, by whom, and why each choice was made.
Include the option you rejected and the reason.

### Recovery
How systems were restored, in what order, and with what monitoring.

### Root cause and contributing factors
The control gap, not the user action.

### Recommendations
Specific, owned, and dated. Each one linked to a finding.

### Detection gaps
What should have caught this earlier, and does not yet.

### Appendices
Evidence register, chain of custody, raw log excerpts, tool versions.
```

**The "Detection gaps" section is the one that distinguishes a good report from a great one.** Almost every incident had a detectable signal that nobody was looking for. Saying so plainly, and turning it into a detection to build, is the loop that makes an organisation improve.

#### Root cause, mechanism, and contributing factor

These three are routinely conflated, and the conflation produces recommendations that fix nothing.

| Term | Definition | Example |
|---|---|---|
| **Mechanism** | How the attacker did it, technically | A macro in a document spawned encoded PowerShell |
| **Root cause** | The control gap that allowed the mechanism to work | Macro execution from internet-sourced documents was not blocked, and endpoint script-block logging was not enabled |
| **Contributing factor** | Something that made it worse or easier | The user had local administrative rights; the host had no outbound filtering |

**"The user clicked the link" is not a root cause.** It is a mechanism, and treating it as the cause produces the recommendation "retrain the user," which is the weakest control available and which changes nothing about the next attempt.

Compare the two recommendation sets that follow from those readings.

| If you call the cause "the user clicked" | If you call the cause "macro execution was not blocked" |
|---|---|
| Retrain all staff | Block macros from internet-sourced documents |
| Send a reminder email | Enable script-block logging and alert on it |
| Add a banner to external mail | Enforce MFA with number matching on all accounts |
| *(No technical change at all)* | Remove local admin rights from standard users |

The right-hand column actually reduces the chance of recurrence. The left column produces a training record and an identical incident six months later.

#### Worked example: the incident report summary

```text
### Executive summary

On 14 March 2026 at 09:11 UTC, a workstation in the finance department
executed a malicious macro from a document delivered by email. The macro
launched an encoded script that connected to an external server and
installed a scheduled task for persistence. The activity was detected
47 minutes later by an endpoint alert on encoded script execution.

The affected workstation was isolated at 10:04 UTC and rebuilt from a
known-good image. No evidence of data access or transfer was found in the
available logs. The account involved was reset and its sessions revoked.
The scheduled task was identified on one further host and removed.

Two control gaps allowed this: macro execution from internet-sourced
documents was not blocked, and outbound traffic from user workstations was
not filtered. Both are addressed in recommendations 1 and 2, with owners
and target dates.

No personal data was confirmed accessed. Based on the evidence available,
notification to the National Privacy Commission is not required, but this
conclusion depends on log retention that covers only the last 30 days —
see Limitations.
```

Read that summary as a manager and you have everything you need: what happened, what it cost, what was done, what must be decided, and where the uncertainty is.

**The last sentence is the mark of a professional report.** It states the limit of the conclusion rather than presenting the conclusion as certain. A manager can act on a stated uncertainty. They cannot act on a false certainty.

#### Tabletop exercises

A tabletop exercise is a discussion-based rehearsal: you present a scenario, inject events, and watch the team's decisions. It requires no technology and it exposes gaps that no amount of tooling fixes.

| Element | What it contains |
|---|---|
| **Scenario** | A plausible incident, chosen for the organisation: ransomware, a compromised executive account, a data-exposure event |
| **Inject list** | Timed pieces of new information, released as the discussion progresses |
| **Participants** | The people who would actually be in the room, including someone from outside IT |
| **Facilitator** | Someone who does not participate, whose job is to keep time and probe weak answers |
| **Scribe** | Records decisions, disagreements, and assumptions |
| **Findings** | What was unclear, who did not know their role, what could not be answered |
| **Actions** | Specific changes with owners and dates |

A sample inject list for a ransomware scenario:

```text
Tabletop injects — Ransomware, 90 minutes

  T+00  A file server begins showing files with a new extension. A user
        reports it. Begin the discussion.
  T+10  A second server is affected. The backup console is unreachable.
  T+20  A ransom note names a payment deadline of 72 hours and claims
        data was copied before encryption.
  T+35  A journalist calls the main switchboard asking for comment.
  T+45  The CEO asks whether the company should pay.
  T+60  Logs show the initial access was an RDP session using a
        service account, twelve days before the encryption.
  T+75  A regulator's deadline is mentioned. Nobody is sure which
        regulator or what the deadline is.
  T+85  Wrap up. Each participant states their single biggest gap.
```

The T+35 and T+75 injects are the ones that produce the most value, because they test the parts of incident response that have nothing to do with technology. Most technical teams have never decided who talks to a journalist or which regulator applies to them.

#### Escalation, and when law enforcement is the right call

Knowing when to escalate is a core skill, and it has three thresholds.

| Threshold | Trigger | Who decides |
|---|---|---|
| **Technical escalation** | The incident exceeds your authority or skill | You, immediately, and you keep working |
| **Management escalation** | Business impact, cost, or a customer-facing decision | The incident lead, with a defined severity trigger |
| **Legal and regulatory escalation** | Personal data affected, criminal activity suspected, or an obligation triggered | Legal counsel or the designated officer — **not you** |

**The third row is the one to be careful with.** Your job is to recognise that a question exists and route it. It is not to answer it, and a junior analyst who decides unilaterally that a breach is or is not notifiable has taken on a liability that is not theirs.

In the Philippine context, the relevant obligations are set out in the Data Privacy Act of 2012 and its implementing rules, which require notification of personal-data breaches to the National Privacy Commission and, in some circumstances, to affected individuals, within defined periods. **Know that the obligation exists, know roughly what triggers it, and route the question.** Do not attempt to state the specific deadline from memory — it is a legal question with a legal answer, and the answer belongs to counsel.

| Situation | Reasonable next step |
|---|---|
| Personal data confirmed or likely accessed | Notify legal counsel or the Data Protection Officer immediately, and preserve everything |
| Criminal activity with a clear victim and evidence | Escalate to management; they decide on law enforcement |
| An active attacker still present | Contain first, then escalate — containment does not wait for a decision |
| A regulator has an inquiry | Route to counsel; do not respond directly |
| You are unsure | Escalate. An unnecessary escalation is cheap |

Law enforcement engagement itself is a management and legal decision, and it has practical consequences worth knowing: the investigation may become evidence in a criminal proceeding, which changes how you must handle every artefact. **Once law enforcement is involved, your evidence handling standards rise rather than stay the same**, and that has to be decided before you start, not after.

#### End-to-end worked example: a full incident

Here is one incident taken through all six stages, compressed, as a model for the report you will write.

| Stage | Time (UTC) | What happened | Artefact produced |
|---|---|---|---|
| Preparation | — | Endpoint telemetry deployed; Sysmon configured; the encoded-PowerShell rule exists | Detection rule DET-003, in place for four months |
| Detection | 09:58 | DET-003 fires on `LAB-WIN10`, user `LAB\jsantos` | Alert with host, user, parent process, and command line |
| Triage | 10:04 | Confirmed active: the outbound connection is still open; severity set to S2 | Attachment A: triage notes with the five-minute decisions |
| Containment | 10:11 | Host network-isolated at the switch, not powered off | Containment decision with the rejected option recorded |
| Analysis | 10:20–13:40 | Memory captured, then disk imaged; the timeline built from Sysmon, Security, USN, and Prefetch | Attachment B: memory acquisition with hash; Attachment C: timeline table |
| Scope | 13:40 | The scheduled task `Updater` was found on one further host | Attachment D: scope evidence |
| Eradication | 14:10 | Both hosts rebuilt from a known-good image; the payload's persistence removed | Rebuild records with verification |
| Recovery | 15:00 | Hosts returned, with DET-003 at elevated severity for 14 days | Recovery plan with the monitoring period stated |
| Post-incident | +3 days | Lessons learned: no macro policy, no outbound filtering, and a detection that fired 47 minutes after execution | Report, action tracker, two new detections |

Two things in that table are worth pointing at.

**The 47-minute detection gap.** The rule fired 47 minutes after the macro executed. That is a real, measurable gap, and it becomes a detection improvement: an alert on `WINWORD.EXE` spawning a script interpreter would have fired in seconds. Reporting the gap honestly is more valuable than presenting the detection as timely.

**The decision at 10:11 to isolate at the switch rather than power off.** That single choice preserved the memory evidence that identified the outbound address and the scheduled task. Writing the rejected option into the report is what teaches the next responder.

### Part 8 — Legal and ethical boundaries in forensic work

#### Authorisation is what makes the work possible

Forensic work has a legal dimension that ordinary security work does not, and getting it wrong has consequences beyond a disciplinary conversation.

**You may only acquire and analyse systems and data you own, or that you have written authority to examine.** That authority has to come from someone entitled to give it, and it has to describe what you may examine and what you may do with the results.

| Situation | What is required |
|---|---|
| Your own lab machine | Nothing beyond your own judgement — it is yours |
| A training image or challenge platform | Adhere to the platform's terms; do not redistribute the images |
| Your employer's endpoint | Written authority from the employer, and awareness that employee data may be present |
| A colleague's or a manager's device | Explicit authorisation naming that device. Never assume your role covers it |
| A client's systems | A signed engagement letter or statement of work that includes forensic examination |
| A device belonging to a third party | A legal instrument. Do not touch it without one |
| A cloud tenant | Provider terms plus the tenant owner's authorisation; some providers require a legal request |

#### The uncomfortable parts, stated plainly

Forensic work routinely involves data that is not the subject of the investigation. A disk image of a workstation contains personal photographs, private messages, health information, and browsing history. This is normal, and it carries obligations.

| Principle | What it means in practice |
|---|---|
| **Minimum necessary** | Examine what the investigation requires, not everything the image contains |
| **Do not browse** | Curiosity about a colleague's personal files is a serious breach, not a perk |
| **Do not copy** | Evidence goes into the evidence store, not onto your personal drive for convenience |
| **Do not discuss** | What you saw is confidential, including in casual conversation |
| **Report what is relevant** | If you find evidence of unrelated wrongdoing, route it to the appropriate authority rather than acting on it |
| **Expect disclosure** | In a legal proceeding, your examination may be reviewed line by line. Work accordingly |

That last row is the practical one. Write notes as if a lawyer will read them, because in a real case they will.

#### Handling accidental discoveries

Sooner or later you will find something you were not looking for — evidence of wrongdoing by an employee, or a vulnerability in a third party's system.

| Discovery | What to do | What not to do |
|---|---|---|
| Evidence of employee misconduct | Document factually and route to the person who authorised your work | Confront the person, or tell colleagues |
| A vulnerability in a third party's system | Follow the responsible disclosure process from Phase 1: stop, document, find their security contact | Exploit it, publish it, or ask for money |
| Personal data unrelated to the case | Minimise exposure; do not copy it out; note its existence | Include it in the report body |
| Something that may be illegal to possess | Stop immediately and escalate before continuing | Continue on the assumption that context justifies it |

The fourth row is uncommon and it is the one where stopping is unambiguously correct. If you believe examining further would put you in possession of material you should not hold, the decision belongs above you, immediately.

#### Writing notes that survive scrutiny

| Weak note | Strong note |
|---|---|
| "Looked at the disk, found malware" | "Mounted `/evidence/disk.img` read-only at 14:05 UTC. Ran `fls -o 1048576 -r -m C:/`; output to `bodyfile.txt`. Identified `C:\Users\jsantos\AppData\Local\Temp\svchost.exe` with an MFT creation timestamp of 2026-03-14 09:14:02 UTC, inconsistent with its `$FN` timestamp of 2025-08-02" |
| "The user is probably the attacker" | "The account `LAB\jsantos` was used for the interactive logon at 09:04:12 UTC. No evidence has been examined that establishes who physically operated the workstation." |
| "Cleaned the machine" | "Rebuilt the host from image W10-BASE-2026-01 at 14:10 UTC. Verified DET-003 no longer fires on the rebuilt host. Original image retained as evidence item 002." |

The three differences are: **commands and times**, **the boundary between evidence and inference**, and **verification**. Those three habits are what separate a forensic note from a guess.

#### What you still cannot do after this phase

You have practised this on images you built, at your own pace, with no one waiting.

You can now work an incident end to end on a lab image — triage, contain, preserve, analyse, and report. You can also explain order of volatility and chain of custody precisely.

You **cannot** yet do it under a clock. Containment decisions there have a cost, and the business asks for an update before you have finished looking.

You have also never handled evidence that would go to a court or a regulator. There, a documentation habit is not a study skill. It is a professional obligation.

| You can | You cannot yet |
|---|---|
| Image a disk, hash it, and document custody | Produce evidence that would survive a legal challenge to your method |
| Triage a severity from a prepared scenario | Triage a live alert where half the information is missing and someone is waiting |
| Analyse memory and disk from a lab capture | Decide when to pull the plug on a production system with a revenue impact |
| Write a report with root cause and detection gaps | Brief an executive who wants an answer you do not have yet |
| Run a tabletop exercise with peers | Run a real eradication and prove the attacker is gone |

**Say it plainly:** “I can run the full process on a lab image, and I have written it up properly. I have not done it live. I have also not handled evidence with a legal standard attached.” Both halves of that sentence are useful to an interviewer. The second one tells them you know what you do not know.

### Part 9 — One incident, start to finish

The parts above taught the stages. This one runs a single incident through all of them, with the actual commands and the actual timestamps, so you can see what a complete investigation looks like before you run your own.

**This is a lab.** The image, the user, the hostname and the timestamps are synthetic. The commands are real and safe to run on an image you made yourself. **You may only analyse systems and images you own or have written authorisation to examine.**

#### The scenario

You are the on-call analyst at a small company. At 09:20 on a Tuesday, the SIEM raises an alert on workstation `WKS-014`.

| Field | Value |
|---|---|
| Alert | Suspicious process execution from a user temp directory |
| Host | `WKS-014`, Windows 10, user `LAB\jsantos` |
| Detection | EDR rule firing on `svchost.exe` running from `AppData\Local\Temp` |
| Severity as reported | Medium |
| Time | 09:20 local, 01:20 UTC |

Your job is to determine whether this is real, contain it if it is, and write it up.

#### Stage 1 — Triage: the first ten minutes

Do not open the disk yet. Answer four questions from what you can see right now.

| Question | What you check | What you find |
|---|---|---|
| Is it real or a false positive? | The process path and parent process | `svchost.exe` in `Temp` is never legitimate — real ones run from `System32` |
| Is it still running? | EDR live process view | Yes, PID 4412, started 09:14:02 |
| Is it spreading? | Other hosts with the same rule | One host only |
| What is the business impact? | What the user does, what the host can reach | Finance workstation; has access to a shared drive holding client records |

**Severity decision: upgrade to High.** The original Medium rating was based on a single host. The shared-drive access changes the assessment, because the impact is no longer confined to one machine.

**Write this down now, with times.** Triage reasoning that is not recorded cannot be reviewed later, and "why did you call it High?" is the first question anyone asks.

#### Stage 2 — Containment: isolate before you investigate

The instinct to look around first is wrong. Every minute the process runs is a minute it can move.

**Capture the volatile evidence, then contain — and do both inside the same fifteen minutes.** Part 3's order is the rule for the first minutes: memory, network state, and running processes come before anything that cuts the host off. Once those are captured, isolate at the switch rather than by disabling the adapter, so the attacker's live connection stays visible. What does *not* survive is a power-off, which is why isolation is the containment step and shutdown never is.

| Step | Action | Why this order |
|---|---|---|
| 1 | Network-isolate `WKS-014` via EDR | Stops command-and-control and lateral movement without destroying volatile state |
| 2 | **Do not power it off** | Memory holds what you need most; a shutdown loses it |
| 3 | Notify the user by phone, not email | The account may be compromised |
| 4 | Disable the user's account, keep the mailbox | Stops the attacker using it while preserving mail evidence. Note this is a *host* incident, not a suspected cloud-account compromise — see Part 2's first-hour checklist, where the account is deliberately left enabled for a while so the audit trail keeps recording |
| 5 | Log the time of each action | This is chain of custody starting now |

| Action | Time | Who |
|---|---|---|
| Alert received | 09:20 | SIEM |
| Confirmed suspicious | 09:24 | Analyst |
| Host isolated | 09:31 | Analyst |
| Account disabled | 09:36 | Analyst, approved by IT Manager |

**The chief's question to expect:** "Why did you isolate before analysing?" The answer is that containment preserves more evidence than it destroys, because a live attacker destroys evidence deliberately and continuously.

#### Stage 3 — Evidence acquisition, in volatility order

Now capture, most volatile first. On a lab image, or on a host you own.

```bash
# 0. Create the evidence directory first — every command below writes into it.
sudo mkdir -p /evidence

# 1. Memory first — it disappears when the machine stops
#    On Windows, from an elevated prompt on the live host you own:
#      winpmem_mini_x64.exe C:\evidence\memory.raw
#    On Linux:
sudo dd if=/dev/mem of=/evidence/memory.img bs=1M    # where supported
#    Better on Linux: LiME, which captures full physical memory
sudo insmod lime.ko "path=/evidence/memory.lime format=lime"

# 2. Then network state
ss -tulpn > /evidence/netstat.txt
ip route > /evidence/routes.txt
arp -a > /evidence/arp.txt

# 3. Then running processes
ps auxww > /evidence/processes.txt

# 4. Then a disk image, read-only, hashed as you go
sudo dc3dd if=/dev/sda of=/evidence/disk.img hash=sha256 log=/evidence/acquire.log
sha256sum /evidence/disk.img >> /evidence/hashes.txt
```

**On the Windows host this scenario actually describes, the same four steps are:** `winpmem_mini_x64.exe` for memory; `netstat -ano`, `arp -a`, and `route print` for network state; `Get-Process` for processes; and FTK Imager or `dc3dd.exe` for the disk image. Write them into the same evidence folder and hash each one. The volatility *order* is identical — only the tool names change.

| Evidence item | Method | Hash | Custody |
|---|---|---|---|
| 001 | Memory capture | `sha256: a3f1…` | Analyst → evidence locker 09:48 |
| 002 | Disk image | `sha256: 7b2c…` | Analyst → evidence locker 10:15 |
| 003 | EDR process export | `sha256: 91de…` | Analyst → evidence locker 10:22 |
| 004 | Firewall logs, 24h | `sha256: 4c88…` | Network team → evidence locker 10:40 |

**Hash everything, immediately, and write the hash down somewhere that is not the evidence itself.** A hash recorded only inside the image proves nothing.

#### Stage 4 — Analysis: building the timeline

Now you look. Note that every line pairs a **fact** with its **source**.

| Time (UTC) | Event | Source | Fact or inference? |
|---|---|---|---|
| 01:04:12 | User `jsantos` interactive logon, workstation `WKS-014` | Security event log 4624 | Fact |
| 01:07:33 | Email with attachment `Invoice_2026-03.doc` received | Mail gateway log | Fact |
| 01:11:02 | `WINWORD.EXE` spawns `cmd.exe` | EDR process tree | Fact |
| 01:11:04 | `cmd.exe` writes `%TEMP%\svchost.exe` | EDR file write event | Fact |
| 01:14:02 | `%TEMP%\svchost.exe` executes, PID 4412 | EDR | Fact |
| 01:14:09 | Outbound connection to `203.0.113.47:443` | Firewall log | Fact |
| 01:19:41 | `net use \\FS-02\ClientRecords` succeeds | Security event 5140 | Fact |
| 01:22:16 | 340 files read from `\\FS-02\ClientRecords` | File server audit log | Fact |
| 01:31:00 | Connection to `203.0.113.47` stops | Firewall log | Fact |

**The inference column is where reports go wrong.** Notice what is *not* in the table: nobody has proven the user opened the attachment deliberately, and nobody has proven data left the network. Those are inferences, and they belong in the findings section as stated inferences, not in the timeline as facts.

Two things the timeline *does* establish, and they matter:

1. The malicious process started **2 minutes 58 seconds** after `cmd.exe` wrote the payload to disk (01:11:04 → 01:14:02), and **6 minutes 29 seconds** after the document arrived (01:07:33). Both gaps are consistent with automated execution, not a user manually exploring.
2. Access to the client records share happened **5 minutes after** execution began. The attacker knew where to look, or the malware was configured to.

#### Stage 5 — The root cause, stated properly

Weak: "A user opened a malicious attachment."

That is the mechanism, and it names nothing fixable. Compare:

| Layer | Statement |
|---|---|
| Mechanism | A macro in a received document executed and dropped a payload into a user temp directory |
| Root cause | Macro execution from internet-sourced documents was not blocked by policy, and the user's share access was broader than their role required |
| Contributing | No email attachment sandboxing; EDR alerted but was not configured to auto-isolate |

**Each root-cause line is something a control can close.** That is the test.

#### Stage 6 — Detection gaps found

An incident review that produces only a fix for the specific file has wasted the incident.

| Gap | What should have happened | Change made |
|---|---|---|
| Alert was rated Medium automatically | Severity should account for what the host can reach | Host criticality added to the severity rule |
| Six minutes between execution and first alert; ten to analyst confirmation | Auto-isolation on this rule class | EDR set to auto-isolate on temp-directory process execution |
| Share access far exceeded the role | Least privilege on the file server | Access review scheduled; 42 users found over-provisioned |
| No email sandboxing | Attachment detonation | Free-tier evaluation started |

**The third row is the one worth noting.** The incident exposed an access problem that had nothing to do with malware, and it affected 42 users. Incidents routinely surface the largest findings in the least expected place.

#### Stage 7 — The report, in the shape a reader needs

| Section | Content |
|---|---|
| **Summary** | A finance workstation executed malware delivered by email. The host was isolated 11 minutes after the alert. Files on a shared drive were accessed; no evidence of exfiltration was found. |
| **Impact** | One host rebuilt. Potential exposure of client records on `FS-02` requiring assessment against notification obligations. |
| **Timeline** | The 9-row table above. |
| **Root cause** | Macro execution not blocked; share permissions exceeded role. |
| **Actions taken** | Isolate, disable account, image memory and disk, rebuild host. |
| **Findings requiring decision** | Whether the client-record access triggers notification. Owner: Compliance. |
| **Limitations** | Encryption of the outbound connection means exfiltration cannot be confirmed or excluded from network data alone. No memory artefact was recovered for the payload itself. |
| **Detection improvements** | The four rows above. |

**The limitations section is not a weakness.** "We cannot determine whether data left, because the connection was encrypted and we have no endpoint egress telemetry" is a precise, useful statement. It tells the business exactly what to fix next.

#### Rehearse this out loud

Pick any two of these and answer with no notes. They are what an interviewer actually asks.

| Question | What a strong answer does |
|---|---|
| Why isolate before analysing? | Explains that a live attacker destroys evidence, and containment preserves more than it costs |
| Why not power off the machine? | Names memory as the most volatile and often most valuable artefact |
| How do you know it was malware? | Points at the path and parent process, not at a feeling |
| What would you do differently? | Names a real gap — the Medium rating, or the ten minutes between execution and analyst confirmation |
| What did this incident teach the business? | Names the over-provisioned share access, which was the biggest finding and unrelated to malware |

If you can give the fourth answer and the fifth, you have done the exercise properly. If you cannot, you have followed the steps without reviewing them.

### Key takeaways

- **An incident is a process, not an event.** The quality of the response depends almost entirely on preparation done before anything happened.
- **The two classic mistakes pull in opposite directions.** Acting before preserving loses the case; preserving before containing loses the estate. You capture the most volatile evidence in the first minutes and contain in parallel.
- **Memory is the most valuable and most perishable evidence.** A powered-off host loses it permanently, which is why powering off is the most destructive containment option.
- **Order of volatility sets your first fifteen minutes:** registers, memory, network state, running system, temporary files, disk, then remote logs.
- **Remote logs have an expiry date.** Check the retention window on day one, because it is a deadline you cannot extend after the fact.
- **Hash before you image and after, and analyse a copy, never the original.** `conv=noerror,sync` and a large block size make the difference between a usable image and an abandoned one.
- **Chain of custody is what lets a third party trust your evidence**, and the Purpose column is the one beginners write too vaguely.
- **Severity is about potential impact, priority is about urgency**, and they are independent. Start high when the ceiling is high — lowering a severity costs a note, raising one late costs whatever happened in between.
- **Prefer isolation at the switch over powering off.** It stops the spread and preserves the memory that tells you how the attacker got in.
- **If the attacker had administrative access, rebuild the host.** "We cleaned it" is not a statement anyone should make about a system they do not fully understand.
- **Check the age of your backup against the attacker's dwell time.** Restoring a backup from after the initial access restores the backdoor.
- **Root cause is a control gap, not a user action.** "The user clicked" leads to training; "macro execution was not blocked" leads to a fix.
- **Every incident report needs a detection-gaps section**, because almost every incident had a signal nobody was watching for.
- **State your uncertainties in the report.** A manager can act on a stated limitation; a false certainty is worse than a known gap.
- **Route legal and regulatory questions; do not answer them.** Recognising that a notification obligation may exist is your job. Deciding whether it applies is counsel's.
- **Forensic work exposes data that is not the subject of the investigation.** Minimum necessary, do not browse, do not copy, and write notes as if a lawyer will read them — because in a real case, they will.

### Practice this next

The nine tasks build toward one artefact — a complete incident, run end to end and written up — and the order follows the lifecycle deliberately.

1. **Write the first-hour checklist for your three most likely scenarios** (task 1) before you need it: a compromised account, a suspected malware execution, and a data-exposure event. Time-stamp every line. This is the task that pays off in a real job.
2. **Check the retention window on every log source you can reach** (task 2) — your SIEM, your endpoint telemetry, your router, your cloud audit logs. Write the shortest window down. That number is your investigation deadline.
3. **Practise triage under a clock** (task 3). Take ten alerts — from a lab, a challenge platform, or your own SIEM — and give yourself fifteen minutes each. Write the severity and the escalation decision with a reason. Then review whether your severities were consistent.
4. **Capture memory before anything else** (task 4) on a lab VM, and hash the output. Then deliberately roll the VM back and try to answer three questions from the memory image alone. That constraint teaches you what memory is for.
5. **Image a disk and verify the hash** (task 5), then analyse the image rather than the original. Build a timeline with `fls` and `mactime`, and add event log records with Plaso. The single sorted timeline is the deliverable.
6. **Find the inconsistencies** (task 6). Deliberately create a timestomped file, a renamed binary in a user directory, and a scheduled task, then find all three from the image. Inconsistency between `$SI` and `$FN` timestamps is the specific thing to look for.
7. **Run a tabletop exercise** (task 7), even alone. Write the inject list, work through it in one sitting, and record every point where you did not know the answer. Those points are your findings, and they are usually about communication rather than technology.
8. **Write the report** (task 8) using the structure in Part 7, on a real challenge or your own lab incident. Include the detection-gaps section and a limitations section, and state your uncertainties rather than resolving them by assumption.
9. **Write the legal and ethical boundary note** (task 9): what systems you may examine, who authorises it, what you would do on discovering unrelated personal data, and who you would route a regulatory question to. This document is short and it is the one that protects you.

Then open `portfolio/cyber/11-incident-response.md` and assemble the deliverables. **The phase is done when you can take an alert from detection to closure** — triage it, set severity, preserve and analyse the evidence in the right order, contain it without destroying what you need, and write a report a manager and an auditor can both use.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Volatility 3 | Memory forensics framework | Free/open-source | https://github.com/volatilityfoundation/volatility3 | Run `windows.pslist` and `windows.netscan` on a memory image | Bulk Extractor, or strings plus manual review |
| Autopsy | Disk image analysis with a GUI | Free/open-source | https://www.autopsy.com/ | Ingest an image and review the timeline view | The Sleuth Kit on the command line |
| The Sleuth Kit | Command-line disk forensics | Free/open-source | https://www.sleuthkit.org/ | Build a body file with `fls` and convert it with `mactime` | Autopsy graphical analysis |
| FTK Imager | Imaging and image mounting | Free | https://www.exterro.com/ftk-imager | Create a forensic image and verify its hash | dc3dd or plain dd |
| dc3dd | Command-line imaging with hashing | Free/open-source | https://sourceforge.net/projects/dc3dd/ | Image a USB drive with `hash=sha256` and a log | dd with a separate sha256sum |
| Eric Zimmerman tools | Windows artefact parsers | Free | https://ericzimmerman.github.io/ | Parse MFT, Prefetch, and AmCache from an image | Autopsy ingest modules |
| KAPE | Targeted artefact collection | Free version | https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kape | Collect triage artefacts from a lab VM | Manual copy of the artefact folders |
| Plaso / log2timeline | Automated super-timeline generation | Free/open-source | https://plaso.readthedocs.io/ | Generate a CSV super-timeline from an image | Manual body file plus event log export |
| Timeline Explorer | Large CSV timeline review | Free | https://ericzimmerman.github.io/ | Filter a super-timeline to one hour | LibreOffice Calc with filters |
| CyberChef | Decoding and deobfuscation | Free/open-source | https://gchq.github.io/CyberChef/ | Decode a base64 PowerShell command line | Command-line base64 and xxd |
| SIFT Workstation | Forensic Linux distribution | Free | https://www.sans.org/tools/sift-workstation/ | Boot it and run `mmls` on an image | Ubuntu with the same packages installed manually |
| WinPmem | Windows memory acquisition | Free/open-source | https://github.com/Velocidex/WinPmem | Capture memory on a lab VM and hash it | DumpIt, or LiME on Linux |
| DFIR challenge platforms | Practice investigations | Freemium | https://cyberdefenders.org/ | Complete one memory-analysis challenge | Public case images and your own lab |

## Free/cheap resources

- NIST SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management — https://csrc.nist.gov/pubs/sp/800/61/r3/final
- NIST SP 800-86 Guide to Integrating Forensic Techniques into Incident Response — https://csrc.nist.gov/pubs/sp/800/86/final
- Volatility 3 documentation — https://volatility3.readthedocs.io/
- The Sleuth Kit documentation — https://www.sleuthkit.org/sleuthkit/docs.php
- Autopsy user documentation — https://sleuthkit.org/autopsy/docs/user-docs/
- SANS DFIR cheat sheets — https://www.sans.org/posters/
- Eric Zimmerman's forensic tools — https://ericzimmerman.github.io/
- Plaso documentation — https://plaso.readthedocs.io/
- CyberDefenders DFIR challenges — https://cyberdefenders.org/
- Blue Team Labs Online — https://blueteamlabs.online/
- The DFIR Report — https://thedfirreport.com/
- National Privacy Commission of the Philippines — https://privacy.gov.ph/
- Republic Act 10173, Data Privacy Act of 2012 — https://privacy.gov.ph/data-privacy-act/
- Republic Act 10175, Cybercrime Prevention Act of 2012 — https://lawphil.net/statutes/repacts/ra2012/ra_10175_2012.html

## Hands-on practice tasks

1. Write a first-hour checklist for three scenarios: a compromised account, suspected malware execution, and a data-exposure event. <!-- id: cyber-11-t01 band: focused energy: normal -->
2. Check and record the retention window of every log source you can reach, and note the shortest one. <!-- id: cyber-11-t02 band: focused energy: normal -->
3. Triage ten alerts in fifteen minutes each, recording severity, escalation decision, and the reason. <!-- id: cyber-11-t03 band: deep energy: high -->
4. Capture memory from a lab VM, hash it, roll the VM back, and answer three questions from the memory image alone. <!-- id: cyber-11-t04 band: deep energy: high -->
5. Image a disk with hashing, verify the hash, and build a timeline with `fls`, `mactime`, and Plaso. <!-- id: cyber-11-t05 band: deep energy: high -->
6. Create a timestomped file, a renamed binary in a user directory, and a scheduled task, then find all three from the image. <!-- id: cyber-11-t06 band: focused energy: normal -->
7. Write and run a tabletop exercise inject list for a ransomware scenario, recording every point you could not answer. <!-- id: cyber-11-t07 band: deep energy: high -->
8. Write a full incident report with timeline, analysis, impact, root cause, recommendations, detection gaps, and limitations. <!-- id: cyber-11-t08 band: deep energy: high -->
9. Write a legal and ethical boundary note covering authorisation, personal data you may encounter, and who you route regulatory questions to. <!-- id: cyber-11-t09 band: quick energy: low -->

## Deliverable / proof of work

Create `portfolio/cyber/11-incident-response.md` with:

- The first-hour checklist for three scenarios
- A log retention table naming the shortest window you depend on
- Triage records for ten alerts with severity and escalation reasoning
- A memory acquisition record with tool, time, and SHA-256 hash
- A disk image hash verification and a timeline table built from at least three sources
- Evidence of finding a timestomped file by comparing `$SI` and `$FN` timestamps
- A chain of custody record, completed properly including the Purpose column
- A tabletop exercise inject list and the findings it produced
- A full incident report using the structure in Part 7
- A legal and ethical boundary note

## Quiz

### Q1. An alert fires on a workstation and the process is still running. Why does this phase say to isolate the host rather than power it off? <!-- id: cyber-11-q01 energy: high -->

- [x] Because memory is the most perishable evidence and a shutdown loses it permanently
- [ ] Because powering off takes longer than isolating at the switch
- [ ] Because a powered-off host keeps its network connections open
- [ ] Because the attacker can reconnect to a host that was powered down

**Why:** Memory holds what you need most — the outbound address and any injected code — and it disappears the moment the machine stops. Assuming speed is the reason is the trap: isolation preserves memory, while a power-off destroys the very artefact you were trying to collect.

### Q2. You are capturing evidence from a live host. Which order does this phase require? <!-- id: cyber-11-q02 energy: normal -->

- [x] Memory and network state first, then the running system, then the disk
- [ ] Disk first, then memory, because the disk holds the persistent artefacts
- [ ] Whichever is quickest, so that containment can start sooner
- [ ] Remote logs first, because their retention window may expire

**Why:** Order of volatility starts with registers and memory, moves through network state and running processes, and reaches disk and remote logs last. Starting with the disk is the trap: memory is gone within minutes, while a disk image will still be there afterwards.

### Q3. A workstation image contains the user's personal photographs and private messages. How does this phase say you handle that? <!-- id: cyber-11-q03 energy: high -->

- [ ] Copy anything relevant to your own drive so the analysis is portable
- [ ] Report everything you found so the investigation is complete
- [x] Examine only what the investigation requires, and do not browse or copy the rest
- [ ] Delete the unrelated material from the image to protect the user's privacy

**Why:** Minimum necessary means examining what the case requires, and unrelated personal material carries an obligation not to browse, copy, or discuss it. Deleting it is the trap — you would be altering evidence, which is far worse than leaving it untouched in the image.

### Q4. An incident report says the user opened a malicious attachment. What is wrong with that as a root cause? <!-- id: cyber-11-q04 energy: high -->

- [ ] It names a person rather than a system, which is unfair to the user
- [ ] It is a contributing factor, and root cause must be a single event
- [ ] Nothing is wrong; that is the root cause and the fix follows from it
- [x] It states the mechanism rather than the control gap, so it names nothing fixable

**Why:** A root cause is a control gap — here, that macro execution from internet-sourced documents was not blocked — and each line must be something a control can close. Accepting the user action as the cause is the trap, because it leads to retraining and the identical incident six months later.

### Q5. You are triaging an alert and the host turns out to be a finance workstation with access to a shared drive of client records. What does this phase tell you to do with the severity? <!-- id: cyber-11-q05 energy: high -->

- [ ] Leave it as reported, because severity must match the detection rule
- [x] Raise it, because severity reflects potential impact, and the shared-drive access widens it
- [ ] Lower it, because only one host is affected
- [ ] Set priority instead, and leave severity to the incident lead

**Why:** Severity is about potential impact, so what the host can reach changes the assessment even when only one host is involved. Leaving it as reported is the trap — the automatic rating was based on a single machine and never considered the share access.

### Q6. Which of these belongs in the timeline as a fact rather than as an inference? <!-- id: cyber-11-q06 energy: normal -->

- [ ] The user deliberately opened the attachment
- [x] An outbound connection to a specific address, taken from the firewall log
- [ ] The attacker intended to steal the client records
- [ ] The malware was configured to find the file share

**Why:** A timeline row pairs an observable event with its source, and a firewall log entry is directly observable. Stating intent is the trap — whether the user acted deliberately or the malware was configured a certain way are inferences, and they belong in the findings as stated inferences.

### Q7. A workstation was infected and the attacker had administrative access. What does this phase say about cleaning it? <!-- id: cyber-11-q07 energy: high -->

- [ ] Clean it with an antivirus scan and return it to the user
- [ ] Cleaning is fine as long as the detection rule no longer fires
- [ ] Clean it and keep the original disk image as the only record
- [x] Rebuild it, because “we cleaned it” is not a statement you can make about a system you do not fully understand

**Why:** Administrative access means you cannot enumerate every change, so a rebuild from a known-good image is the only defensible recovery. Trusting a clean scan is the trap — the absence of a detection is not evidence that nothing remains.

### Q8. Your only backup of a server predates the attacker's initial access, but a newer one exists from after it. Which do you restore? <!-- id: cyber-11-q08 energy: high -->

- [ ] The newer one, because it is the most recent and loses the least data
- [ ] Either one, because the persistence will be found by the EDR on restore
- [x] The older, pre-compromise one, because a backup from after initial access restores the backdoor
- [ ] Neither; restore from the original installation media only

**Why:** The age of the backup must be checked against the attacker's dwell time, because a backup taken after initial access carries the persistence back in with it. Choosing the newer backup is the trap — recency is a virtue only when the image predates the compromise.

### Q9. Logs show the malicious process started under three minutes after the payload was written to disk. What does this phase say that timing establishes? <!-- id: cyber-11-q09 energy: high -->

- [ ] That the user manually ran the file from the temp directory
- [ ] That the EDR agent was disabled during execution
- [x] That the execution was automated rather than a user exploring manually
- [ ] That the payload was downloaded rather than dropped locally

**Why:** A gap of minutes between the write and the execution is consistent with automated execution, which is why the phase points at both measured gaps. Reading it as manual action is the trap — a person navigating to a temp folder and running a file takes longer and leaves different traces.

### Q10. Personal data may have been accessed, and you are unsure whether it must be notified. What does this phase say your job is? <!-- id: cyber-11-q10 energy: normal -->

- [x] Recognise that an obligation may exist and route the question to counsel or the DPO
- [ ] Decide whether the breach is notifiable so the report is complete
- [ ] State the deadline from the Data Privacy Act from memory
- [ ] Wait until the investigation closes before mentioning it to anyone

**Why:** Recognising that a legal question exists is the analyst's job, and answering it is counsel's — this is a liability that is not yours to take on. Quoting a deadline from memory is the trap, because the phase says explicitly that the answer belongs to counsel.

### Q11. Which question does this phase call one to be careful with, because a junior should route it rather than answer it? <!-- id: cyber-11-q11 energy: normal -->

- [ ] Whether the host should be isolated at the switch
- [x] Whether the incident triggers a regulatory notification obligation
- [ ] Whether memory or the disk should be captured first
- [ ] Whether the alert should be escalated to the incident lead

**Why:** The legal and regulatory threshold is decided by legal counsel or the designated officer, not by the analyst, and your part is to notice and route it. Choosing the technical questions is the trap — isolation and capture order are squarely within an analyst's own judgement.

### Q12. What does this phase say a tabletop exercise is for? <!-- id: cyber-11-q12 energy: normal -->

- [ ] Testing whether the detection rules fire on a simulated attack
- [ ] Measuring how quickly the team can contain a real intrusion
- [ ] Validating that the backup restore procedure still works
- [x] Rehearsing decisions and exposing gaps, including who talks to a journalist or which regulator applies

**Why:** A tabletop is a discussion-based rehearsal, and its most valuable injects test the parts of response that have nothing to do with technology. Expecting it to test detections is the trap — no technology is involved at all, which is precisely why it surfaces the gaps tooling cannot fix.

## Checklist

- [ ] I can name the six NIST incident response stages and what each produces. <!-- id: cyber-11-nist-lifecycle energy: low -->
- [ ] I wrote a first-hour checklist for my three most likely scenarios. <!-- id: cyber-11-first-hour-checklist energy: normal -->
- [ ] I can triage an alert in fifteen minutes and set a defensible severity. <!-- id: cyber-11-triage-drill energy: normal -->
- [ ] I recorded the retention window of every log source I depend on. <!-- id: cyber-11-log-retention-audit energy: normal -->
- [ ] I can state the order of volatility and capture evidence in that order. <!-- id: cyber-11-order-of-volatility energy: low -->
- [ ] I captured a memory image, hashed it, and analysed it with Volatility. <!-- id: cyber-11-memory-acquisition energy: normal -->
- [ ] I imaged a disk, verified the hash, and analysed a copy rather than the original. <!-- id: cyber-11-disk-imaging energy: normal -->
- [ ] I built a timeline from at least three independent evidence sources. <!-- id: cyber-11-timeline-build energy: normal -->
- [ ] I found a timestomped file by comparing `$SI` and `$FN` timestamps. <!-- id: cyber-11-timestomp-detection energy: normal -->
- [ ] I completed a chain of custody record including the Purpose column. <!-- id: cyber-11-chain-of-custody energy: normal -->
- [ ] I chose a containment strategy and documented the option I rejected. <!-- id: cyber-11-containment-decision energy: normal -->
- [ ] I can explain why powering off a host is the most destructive containment choice. <!-- id: cyber-11-poweroff-reasoning energy: low -->
- [ ] I distinguished mechanism, root cause, and contributing factor in my report. <!-- id: cyber-11-root-cause-analysis energy: normal -->
- [ ] I wrote a incident report with a detection-gaps and a limitations section. <!-- id: cyber-11-incident-report-written energy: high -->
- [ ] I ran or wrote a tabletop exercise and recorded the gaps it exposed. <!-- id: cyber-11-tabletop-exercise energy: normal -->
- [ ] I wrote down what I may examine, who authorises it, and who I route legal questions to. <!-- id: cyber-11-forensic-legal-boundaries energy: low -->

## You're ready to move on when...

You can take an alert from detection to closure: triage it, set severity, preserve and analyse the evidence in the right order, contain the incident without destroying what you need, and write a report a manager and an auditor can both use.

## Free vs Paid

### What's free and enough

Volatility 3, Autopsy and The Sleuth Kit, FTK Imager, dc3dd, Eric Zimmerman's parsers, Plaso, CyberChef, WinPmem, and the SIFT Workstation together cover every technique this phase teaches, and every one of them is free and open source or free for the professional edition you need. Public forensic images and free DFIR challenge platforms supply the evidence to practise on, which matters more than the tooling, because the tooling is a means and the practice images are the material. NIST SP 800-61 and SP 800-86 are free and are the actual standards the industry works from.

### What's paid and why you'd upgrade

Commercial forensic suites such as EnCase, Magnet AXIOM, and Cellebrite add automation, wider artefact support, mobile extraction, and validated workflows that hold up more easily in court, plus vendor support when a case is on a deadline. Enterprise DFIR platforms add remote triage at scale and threat-intelligence enrichment. Paid challenge subscriptions add more scenarios and guided answers. Paid training and certifications such as the SANS GIAC courses are the most expensive items in the entire field and are almost always employer-funded rather than self-funded.

### When it's worth paying

Pay when an employer requires a specific suite for the work you are already doing, or when a live case has a legal deadline that automation would meet and manual work would not. For a learner building capability, none of that applies: the free toolchain produces identical findings on the same artefacts, and the skill being assessed in an interview is your reasoning about evidence rather than your familiarity with a particular interface. Follow the Phase 7 order strictly here — study free, build the artefacts, and let the artefacts be the reason someone hires you. If you later move into a dedicated DFIR role, the employer will pay for the suite, and you will learn it in a week because you already understand the evidence underneath it.