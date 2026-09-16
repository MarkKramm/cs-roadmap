---
id: advance-05-adversary-emulation
track: advance
phase: 5
order: 50
title: "Phase 5 — Adversary Emulation and Purple Teaming"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/advance/05-adversary-emulation.md"
exit_criteria: "You can write an authorised rules-of-engagement document, emulate five ATT&CK techniques in an isolated lab, record honestly what your telemetry did and did not show, and turn each gap into a written detection and a control-failure report."
---

# Phase 5 — Adversary Emulation and Purple Teaming

## Goal of this phase

Learn to run adversary behaviour against systems you own or are authorised to test, measure honestly whether your detection and response controls saw it, and convert every gap you find into a written detection and a report the control owner can act on.

## Estimated time

**6 weeks** at about 8–11 focused hours a week. Roughly 46–62 hours, and the lab work is most of it.

## Skills you'll gain

- Explain the difference between adversary emulation, penetration testing, and red teaming, and say which one you are doing.
- Write a rules-of-engagement document that names the scope, the constraints, the stop condition, and the authorising person.
- Build an isolated emulation lab and demonstrate that nothing in it can reach a production network.
- Plan an emulation by tactic rather than by tool, using MITRE ATT&CK as the planning vocabulary.
- Map a technique to its tactic, technique, and sub-technique identifier, and explain what each level means.
- Run an Atomic Red Team test, confirm its prerequisites, execute it, and clean up after it.
- State, before you execute, what telemetry should record the behaviour and where that telemetry lives.
- Read the result of an emulation honestly, including returning "we have no telemetry for this" as a valid finding.
- Write a Sigma rule from a detection gap you produced yourself.
- Build an ATT&CK Navigator layer that shows coverage as measured rather than as assumed.
- Report a control failure to the person who owns the control, in the language of their system, without blame.
- Explain why unauthorised testing is illegal, and what specifically makes testing authorised.

## Specific topics to learn

- Adversary emulation, purple teaming, penetration testing, and red teaming, and the boundaries between them
- MITRE ATT&CK: tactics, techniques, sub-techniques, procedures, and the difference between them
- The ATT&CK matrices, and which one applies to the estate you are testing
- ATT&CK Navigator layers: scoring, colouring, and honest coverage marking
- Rules of engagement: scope, authorisation, constraints, deconfliction, stop conditions, and emergency contacts
- Written authorisation: who can give it, what it must say, and why a verbal go-ahead is worthless
- Safe lab design: host-only networking, snapshots, no shared folders, no USB passthrough, and a kill switch
- Atomic Red Team and the invoke-atomicredteam runner: prerequisites, execution, and cleanup
- Atomic emulation versus full-scope emulation, and when each is the right choice
- Sysmon configuration and the event IDs that matter for technique coverage
- Sigma as a vendor-neutral rule format, and rule conversion for a specific backend
- The purple team feedback loop: execute, observe, gap, detect, verify, re-test
- Detection coverage measurement: covered, partially covered, no detection, and no telemetry
- The detection gap register, and how it becomes a work queue
- Writing detections from an emulation result, including false-positive reasoning
- Reporting control failures to control owners: evidence, impact, and a proposed fix
- Legal and ethical boundaries: authorisation, consent, and the consequences of exceeding scope
- Philippine legal context: the Cybercrime Prevention Act of 2012 and the Data Privacy Act of 2012 as they bear on testing your own organisation

## Lesson: The Only Honest Way to Know Whether a Control Works

### Why this lesson exists

Every organisation has a document that says what its controls do. Very few organisations have evidence that those controls do what the document says. That gap — between the claim and the measurement — is the space this phase occupies.

This phase is defensive. Read that again before anything else, because the framing matters more than any tool in it. You are not learning to become an offensive operator, and you are not learning to sell penetration tests. You are learning to **produce real adversary behaviour against your own organisation's controls, in a controlled and authorised way, for the sole purpose of measuring whether those controls work and improving the ones that do not.** The output of this phase is a detection and a report, not a shell. If at any point the exercise is producing access rather than producing evidence, something has gone wrong.

That distinction is why the phase opens with authorisation rather than with tooling. A person who knows how to run an Atomic test and does not know who is allowed to authorise it is a liability, and the consequences are legal rather than disciplinary.

**Unauthorised testing is a crime.** Running adversary behaviour against systems you do not own and are not authorised to test is unauthorised access, and it is criminal in the Philippines under the Cybercrime Prevention Act of 2012 and equivalent law almost everywhere else. It is also a fast route to dismissal, to a civil claim, and to the end of a security career before it starts. This phase assumes one condition throughout, and never relaxes it: **you only ever run adversary behaviour against systems you own, or systems for which you hold written permission from someone entitled to grant it.** Everything below is written inside that boundary.

**This phase assumes you already hold a first security job**, roughly one to three years in. So it does not explain what a SIEM is or how to read a firewall log. What it does assume is that you have never been the person who decides what gets emulated, who signs the authorisation, or who has to tell a system owner that the control they built did not fire. Those are the new skills, and they are mostly judgement rather than tooling.

#### The four things this phase is often confused with

People use these terms interchangeably, and the confusion causes both bad security decisions and legal exposure.

| Term | Goal | Who owns the result | Typical authorisation |
|---|---|---|---|
| **Vulnerability assessment** | Find and list weaknesses | The asset owner | Internal, often no written scope for scanning your own estate |
| **Penetration testing** | Prove that a weakness can be exploited, usually to a defined objective | The client who bought the test | A signed statement of work with a scope and a window |
| **Red teaming** | Test the organisation's detection and response end to end, often without the defenders knowing | The organisation's leadership | Written authorisation at a senior level, with a strict scope |
| **Adversary emulation (this phase)** | Measure whether a specific control sees a specific behaviour, and improve the control | The blue team | Written authorisation naming the technique, the targets, and the window |

The row that matters most here is the last one. **Adversary emulation is a measurement activity, not an access activity.** The question it answers is "if an attacker did this, would we know?" and the deliverable is a detection, a coverage number, or an honest "we have no telemetry for this". A penetration test that fails to get in has still succeeded as a test. An emulation that fails to be observed has failed as a test, even if it perfectly achieved access.

The second row's distinction is worth stating plainly too, because it is the one that keeps people out of prison. A penetration test has a client, a contract, and a scope. If you do not have those three things in writing, you are not doing a penetration test. You are doing something else, and the law has a name for it.

#### What the exit criterion actually demands

Read it closely, because it names five distinct capabilities.

| Requirement | The skill underneath it |
|---|---|
| **Write an authorised rules-of-engagement document** | Judgement, precision, and the discipline to stop when the document says stop |
| **Emulate five ATT&CK techniques in an isolated lab** | Technical execution, and the planning that makes five techniques a measurement rather than a demo |
| **Record honestly what your telemetry did and did not show** | Intellectual honesty under mild pressure to look good |
| **Turn each gap into a written detection** | Detection engineering, in a portable format |
| **Write a control-failure report** | Communication with someone whose work you are about to criticise |

The third and fifth are the ones people get wrong. The third because it is far more comfortable to report that a control worked than to report that you could not tell either way. The fifth because most technical people write control-failure reports as if the control owner were the adversary.

#### Time to complete

**Roughly 46–66 hours over 6 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 4–6 | Once, properly |
| Building and verifying the isolated lab | 6–10 | Verifying isolation is the slow part, and the important part |
| ATT&CK reading and building a Navigator layer | 5–7 | Planning work, done before any execution |
| Installing and tuning endpoint telemetry | 5–8 | Most of the measurement capability lives here |
| Running the emulations and capturing results | 12–16 | The core of the phase |
| Writing detections and verifying them | 8–10 | A rule that has not been re-tested is a guess |
| The results matrix, the gap register, and the report | 6–9 | The portfolio artefact |

#### What this phase is not

It is not a phase about becoming a red teamer. There is no section on exploit development, on payload construction, or on evading a real defender. Every technique in this phase is a documented, publicly catalogued behaviour run against a system you control, precisely so that the defender side can learn from it.

It is not a phase about buying an emulation platform. Everything here is achievable for $0, and the commercial platforms that exist mostly automate what you will do by hand — which means doing it by hand is how you learn what they are doing.

It is not legal advice. This phase teaches you to recognise when a question is legal, to insist on written authorisation before you touch anything, and to route the rest to the people whose job it is.

### Part 1 — Emulation, measurement, and the vocabulary you will be judged on

#### Why an adversary catalog is the right starting point

You cannot measure coverage against a shapeless idea of "attacks". You need a list, and the list needs to be structured so that different people describing the same thing end up in the same place.

**MITRE ATT&CK** is that list. It stands for Adversarial Tactics, Techniques, and Common Knowledge, and it is a freely available, publicly documented catalogue of behaviour observed in real intrusions. It is not a tool, not a scanner, and not a checklist of things to go and do. It is a vocabulary.

The vocabulary has four levels, and knowing the difference between them is the first thing that separates a competent emulation from a confused one.

| Level | What it is | Example |
|---|---|---|
| **Tactic** | The adversary's goal, the *why* | Execution (TA0002) |
| **Technique** | The general way of achieving the goal, the *how* | Command and Scripting Interpreter (T1059) |
| **Sub-technique** | A specific variant of the technique | PowerShell (T1059.001) |
| **Procedure** | A specific implementation used by a specific actor or tool | A macro that launches `powershell.exe -nop -w hidden -enc <base64>` |

The distinction between technique and procedure is the one that trips people up, and it has a direct consequence for how you measure coverage.

**A detection for the procedure is not a detection for the technique.** If you write a rule that fires on `powershell.exe` with `-enc` in the command line, you have detected one procedure. An attacker who runs `powershell.exe -Command "IEX (...)"` has used the same sub-technique and the same tactic and will not trip your rule. This is why coverage claims built on a single atomic test are usually overstated, and why the honest verdict for most techniques is "partially covered" rather than "covered".

#### The matrix, and which one you are testing

ATT&CK is published as several matrices, and picking the wrong one produces a plan that does not match your estate.

| Matrix | What it covers | When you use it |
|---|---|---|
| **Enterprise** | Windows, macOS, Linux, cloud, network devices, containers | Almost always, and the default for this phase |
| **Mobile** | Android and iOS | Only if your organisation issues or manages mobile devices |
| **ICS** | Industrial control systems | Only in operational technology environments |

Enterprise is itself divided by platform. A technique that exists for Windows does not exist for Linux, and a coverage number that mixes them is meaningless. When you build your plan, note the platform for every technique you intend to test, and keep the platforms separate in your results.

There is one more list worth knowing: **MITRE Engenuity's ATT&CK Evaluations** publish the results of running real, documented adversary emulations against many commercial security products. They are free to read and they are a worked example of exactly what this phase teaches you to do, at a scale you cannot reach alone. Reading one evaluation's methodology section before you start is the single best preparation for the planning work below.

#### The plan comes before the tool

The most common failure in an emulation programme is starting from the tool. Someone discovers Atomic Red Team, runs whatever tests sound interesting, and produces a folder of screenshots that proves nothing about coverage because no one defined what coverage meant before the tests ran.

The order that works is the reverse.

| Step | Question | Output |
|---|---|---|
| 1 | What is in scope? | A list of hosts, users, and services, and an explicit list of what is out of scope |
| 2 | Which platform are we testing? | Windows endpoints, Linux servers, cloud identity, or a combination |
| 3 | Which tactics are we measuring this round? | Two or three tactics, not all fourteen |
| 4 | Which techniques within those tactics? | Five to ten techniques, chosen for relevance |
| 5 | For each technique, what telemetry should show it? | A written hypothesis, per technique, before anything runs |
| 6 | Where does that telemetry live, and how long is it kept? | Log source, query location, retention window |
| 7 | Who is told, and when? | The deconfliction list and the notification schedule |
| 8 | Only now, which tool executes it? | An Atomic test, a manual command, or a scripted procedure |

**Step 5 is the step that makes this a measurement.** If you cannot write the hypothesis — "this technique should generate Sysmon event ID 1 with a parent process of `winword.exe`" — then you have no way to distinguish "the control failed" from "we never had the data". Writing the hypothesis first forces you to discover, before you run anything, that half your techniques have no plausible telemetry path at all. That discovery is a finding, and it is a much cheaper finding to make before execution than after.

### Part 2 — Authorisation, scope, and rules of engagement

#### Why written authorisation is not a formality

A verbal "sure, go ahead" is worth nothing. It is worth nothing if the person who said it was not entitled to say it. It is worth nothing if they change their mind. It is worth nothing if something breaks and the conversation turns into "I never told you to do that".

Written authorisation does four things that a conversation cannot.

| Function | What it establishes |
|---|---|
| **Identifies the authority** | Names a person whose role actually entitles them to grant this permission |
| **Defines the boundary** | States exactly what may be tested, and by implication what may not |
| **Allocates the risk** | Records that the organisation accepts the risk of the test, in writing |
| **Protects you personally** | Gives you a document that says you were permitted to do what you did |

That fourth function is not cynical. In a real incident where a test causes an outage and the organisation looks for someone to blame, the difference between having the document and not having it is the difference between a difficult meeting and the end of your career.

| Who can authorise | Notes |
|---|---|
| The system owner | For systems they own and are accountable for |
| The CISO or head of security | For estate-wide testing, within their remit |
| A director or executive | For anything touching production, customers, or regulated data |
| **Anyone else** | **Not sufficient. Escalate until you reach one of the above.** |

Two situations deserve a specific warning.

**Your own job title is not authorisation.** Being a security analyst does not make you permitted to run adversary behaviour against your employer's estate. It authorises you to *defend* it. The permission to attack it, even gently, even in a lab-shaped way, comes from a separate and explicit grant.

**Your manager saying yes is not automatically sufficient**, if the affected systems belong to another team or hold regulated data. The permission has to come from someone whose remit covers the thing being tested.

#### Rules of engagement, and what one actually contains

**Rules of engagement**, usually abbreviated ROE, is the document that turns an authorisation into an executable plan. It is written by the person who will do the work and signed by the person who is entitled to permit it.

A rules-of-engagement document that survives contact with reality contains ten things.

```text
RULES OF ENGAGEMENT — Adversary Emulation Exercise AE-2026-004

1. AUTHORISATION
   Requested by        Name, role
   Authorised by       Name, role, signature, date
   Organisation        Name
   Exercise reference  AE-2026-004

2. OBJECTIVE
   Measure whether the current endpoint and identity telemetry detects
   five ATT&CK techniques across Execution, Persistence, and Credential
   Access. Produce detections for every gap found. This is a detection
   measurement exercise. It is NOT a penetration test and gaining access
   is not a goal.

3. SCOPE — IN
   Hosts        LAB-WIN10-01, LAB-WIN10-02 (isolated lab VLAN 90)
   Identity     lab\emul-user, lab\emul-admin
   Services     None in production
   Techniques   T1059.001, T1053.005, T1547.001, T1136.001, T1003.001

4. SCOPE — OUT
   All production systems and networks. All cloud tenants. All user
   mailboxes. All data belonging to real customers or employees.
   Techniques not listed in section 3.

5. CONSTRAINTS
   No exploitation of real vulnerabilities.
   No denial-of-service behaviour of any kind.
   No real credential dumping from a live production host.
   Payloads sourced only from the Atomic Red Team repository.
   No persistence left in place after the exercise window.
   Maximum of four hours of execution per day.

6. SCHEDULE AND WINDOW
   Execution window   2026-04-06 to 2026-04-17, 09:00–17:00 local
   Blackout periods   None
   Notification       24 hours before each execution block

7. DECONFLICTION
   Who is told         SOC lead, endpoint engineering lead, lab owner
   Who is NOT told    No one outside that list. The exercise is not
                       announced to the wider team.
   Contact channel     A dedicated chat channel, monitored during execution

8. STOP CONDITIONS
   Immediately stop and notify the authorised person if:
     - Any technique reaches or attempts to reach a production system
     - Any real user account is affected
     - Any automated response isolates a host outside the lab
     - Any system behaves in a way not predicted by the plan
     - The authorised person says stop, for any reason or none
   The person running the exercise has unilateral authority to stop.

9. DATA HANDLING
   Logs and screenshots may be used in the resulting report.
   No real personal data is to be collected. If encountered, stop and
   notify the authorised person.
   Artefacts retained for 12 months, then destroyed.

10. EGRESS AND CLEANUP
    Every technique is run with its cleanup step immediately after.
    A final sweep confirms no persistence remains.
    The lab VM is reverted to a clean snapshot at the end.
```

Read section 8 again. **The person running the exercise has unilateral authority to stop, and does not have to justify it.** This is not a courtesy. It is the control that makes the whole document work, because the person closest to the behaviour is the person best placed to notice that it is doing something nobody expected. An emulation that cannot be stopped by the person running it is not a controlled exercise.

**Section 4, the out-of-scope list, is the one that saves you.** A scope that says only what is in scope leaves everything else ambiguous. Writing down explicitly what is forbidden removes the argument that a system "wasn't mentioned".

**Section 7 is where the purple team actually starts.** Deciding in advance who knows is a real decision with real trade-offs. Telling the SOC means you measure detection honestly, because a human who knows the test is running will connect the dots faster than the rule did. Not telling the SOC means you measure something closer to reality, but you risk the exercise being escalated as a real incident and consuming the whole team's evening. The common middle ground is to tell one named person in the SOC who does not participate in triage, so that a real escalation can be deconflicted without the responders being tipped off.

### Part 3 — Building a lab that cannot escape

#### The one rule that has no exceptions

**Nothing you run in this phase may be able to reach anything you do not own.** Not your employer's network. Not your home network's other devices. Not the internet, unless you have deliberately decided it should and documented why.

Everything else in the lab design is engineering. This is the requirement.

| Isolation control | What it does | Common mistake |
|---|---|---|
| **Host-only or internal network** | The VM can talk to other lab VMs and nothing else | Using NAT, which gives the VM a route to the internet and your LAN |
| **No bridged networking** | Prevents the VM appearing as a peer on your real network | Leaving it bridged "just for the install" and forgetting to change it |
| **Hypervisor firewall rules** | Blocks outbound traffic from the virtual adapter | Not setting any |
| **Snapshot before every block** | Gives you an instant, complete rollback | Snapshotting only once, at the start |
| **No shared folders** | Prevents a technique writing to your host filesystem | Sharing a folder for convenience |
| **No shared clipboard** | Prevents accidental copy-paste of payloads or data | Leaving the default enabled |
| **No USB passthrough** | Prevents the VM reaching physical devices | Passing through a real disk to test it |
| **No host credentials** | Prevents a credential technique from harvesting something real | Using your own account as the VM's login |

The NAT row is the one that catches people. VirtualBox and Hyper-V both make NAT the default for a new VM, because most people want a VM with internet access. **NAT is not isolation.** A NAT'd VM has a route out through your host, which means it can reach the internet and, depending on configuration, other hosts on your LAN. Host-only networking — called "Internal network" in Hyper-V and "Host-only Adapter" in VirtualBox — is the one you want.

#### Verifying isolation, rather than assuming it

You do not get to claim the lab is isolated because you set the network mode correctly. You prove it.

```powershell
# From inside the target VM, on Windows. Every one of these should fail.

# 1. The default route should point nowhere useful, or not exist.
route print

# 2. A ping to a public resolver should fail.
Test-NetConnection -ComputerName 1.1.1.1 -InformationLevel Quiet

# 3. A DNS lookup for a public name should fail.
Resolve-DnsName example.com -ErrorAction SilentlyContinue

# 4. A connection to a well-known public address on 443 should fail.
Test-NetConnection -ComputerName 8.8.8.8 -Port 443 -InformationLevel Quiet

# 5. Confirm what the VM can reach at all — this should be the lab
#    network and nothing else.
Get-NetIPConfiguration | Format-List
Get-NetRoute -AddressFamily IPv4 | Format-Table -AutoSize
```

```bash
# From inside the target VM, on Linux. The same five checks.
ip route
ping -c 2 -W 2 1.1.1.1
getent hosts example.com
timeout 3 bash -c 'cat < /dev/null > /dev/tcp/8.8.8.8/443' && echo "REACHABLE - fix this" || echo "blocked"
ss -tulpn
```

**Record the output of these five checks in your lab notes with a timestamp.** That record is what lets you say, in the report, that the exercise ran in an isolated environment — and it is what you will be asked for if anything goes wrong.

#### The second layer: making the measurement possible

An isolated lab with no telemetry measures nothing. The isolation is what makes the exercise safe; the telemetry is what makes it useful.

| Layer | What it provides | Free option |
|---|---|---|
| **Process creation** | What ran, with what command line, from what parent | Sysmon event ID 1, or Security 4688 |
| **Network connections** | What connected where, from which process | Sysmon event ID 3 |
| **File creation** | What was written, including the payload path | Sysmon event ID 11 |
| **Registry modification** | Persistence and configuration changes | Sysmon event ID 13 |
| **Image loads** | Which DLLs a process loaded | Sysmon event ID 7 |
| **Remote thread creation** | A common injection indicator | Sysmon event ID 8 |
| **Process access** | Who opened a handle to a sensitive process | Sysmon event ID 10 |
| **Security auditing** | Logons, account changes, privilege use | Windows Security log, 4624 / 4720 / 4732 / 4672 |
| **Scheduled tasks** | Task creation and modification | Security 4698, and Task Scheduler operational log |

**Sysmon is the single highest-value free telemetry source on Windows**, and it is what most of this phase's measurement depends on. It is a free Microsoft Sysinternals driver and service that logs far more detail than the default Windows Security auditing, including full command lines and file hashes.

It does, however, generate an enormous volume of events with its default configuration. The practical approach is to start from a published configuration rather than writing one from nothing.

```powershell
# Install Sysmon with a published configuration file.
# Run from an elevated prompt. Both the binary and the config are free.

# 1. Download Sysmon and a configuration file (SwiftOnSecurity's is a
#    widely used, well-commented baseline).
#    https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon
#    https://github.com/SwiftOnSecurity/sysmon-config

# 2. Install with the configuration applied.
sysmon64.exe -accepteula -i sysmonconfig-export.xml

# 3. Confirm the service is running and the driver is loaded.
Get-Service sysmon64
Get-Service sysmon | Format-List Name, Status

# 4. Check that events are arriving. Event ID 1 is process creation.
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" -MaxEvents 5 |
  Format-Table TimeCreated, Id, Message -AutoSize

# 5. Count events by ID over the last hour, to see what your config
#    is actually collecting.
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" -MaxEvents 2000 |
  Group-Object Id | Sort-Object Count -Descending |
  Format-Table Count, Name -AutoSize

# 6. To update the configuration later, without reinstalling.
sysmon64.exe -c sysmonconfig-export.xml
```

Step 5 is the one people skip and then regret. A configuration that is silently not logging event ID 10 will produce a "no detection" result for every credential-access technique you test, and you will record a control failure that is actually a configuration gap on your side. **Confirm the telemetry you expect is present before you test the technique that depends on it.** If you are testing credential access and event ID 10 is not in your event log, stop and fix that first.

#### The kill switch

Every exercise needs one action that stops everything, immediately, and that the person running the exercise can take without asking.

| Kill switch | How it works | When it is right |
|---|---|---|
| **Revert to snapshot** | The hypervisor discards all changes and returns to a known state | The default for a lab. Fast, complete, and destroys the evidence — so export logs first |
| **Disable the VM's network adapter** | Cuts the VM's connectivity instantly | When you suspect something is reaching out |
| **Suspend the VM** | Freezes it in place, preserving memory | When you need to look before you destroy |
| **Power off the VM** | Immediate and total | When nothing else is working |

**Export the logs before you revert.** The snapshot revert destroys the disk, and the disk holds the Sysmon event log. The order is: copy the relevant event logs out to the host or to a second lab VM, confirm the copy, then revert.

```powershell
# Export the event logs you need before reverting the snapshot.
$dest = "C:\evidence\2026-04-06"
New-Item -ItemType Directory -Path $dest -Force | Out-Null

wevtutil epl "Microsoft-Windows-Sysmon/Operational" "$dest\sysmon.evtx"
wevtutil epl "Security" "$dest\security.evtx"
wevtutil epl "Microsoft-Windows-TaskScheduler/Operational" "$dest\taskscheduler.evtx"

# Confirm they exist and are not empty before you revert.
Get-ChildItem $dest | Format-Table Name, Length -AutoSize
```

### Part 4 — Atomic versus full-scope emulation

#### Two kinds of emulation, two different questions

There are two broad approaches to producing adversary behaviour, and they answer different questions. Choosing the wrong one wastes the exercise.

| | **Atomic emulation** | **Full-scope emulation** |
|---|---|---|
| **Unit of work** | One technique, isolated | A chain of techniques forming an intrusion |
| **Question answered** | Does our telemetry see this specific behaviour? | Does our detection and response hold up across a realistic sequence? |
| **Duration** | Minutes per technique | Hours to days |
| **Tools** | Atomic Red Team, manual commands | Caldera, a scenario script, or a controlled manual chain |
| **Defender involvement** | Often none during execution; review afterwards | Usually active, with a purple team watching live |
| **Precision of the finding** | High — you know exactly what fired and what did not | Lower — a failure could be any step in the chain |
| **Best for** | Building a coverage map, testing a new detection | Validating a detection programme, exercising response |

**Start with atomic emulation.** It gives you a clean signal per technique, which is exactly what you need when you are building the coverage map for the first time. Full-scope emulation is what you graduate to once you have a map, because a chain of ten techniques where seven are already covered produces a much more informative failure than a chain run against an unknown baseline.

#### Atomic Red Team, and how to run it correctly

**Atomic Red Team** is a free, open-source library maintained by Red Canary. It contains hundreds of small, self-contained tests, each mapped to an ATT&CK technique. Each test has a name, a description, a set of prerequisites, an execution command, and a cleanup command.

The library is the content. **invoke-atomicredteam** is the PowerShell module that runs it.

```powershell
# One-time setup, on the target VM only.

# 1. Install the execution framework.
IEX (IWR 'https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/master/install-atomicredteam.ps1' -UseBasicParsing)
Install-AtomicRedTeam -getAtomics -Force

# 2. Import the module. Adjust the path to where it installed.
Import-Module "C:\AtomicRedTeam\invoke-atomicredteam\Invoke-AtomicRedTeam.psd1" -Force

# 3. See what tests exist for one technique, briefly.
Invoke-AtomicTest T1059.001 -ShowDetailsBrief

# 4. Read one test in full, including its prerequisites and its cleanup.
Invoke-AtomicTest T1059.001 -TestNumbers 1 -ShowDetails

# 5. Install any prerequisites the test needs.
Invoke-AtomicTest T1059.001 -TestNumbers 1 -GetPrereqs

# 6. Verify the prerequisites are actually satisfied.
Invoke-AtomicTest T1059.001 -TestNumbers 1 -CheckPrereqs

# 7. Execute the test, logging the run to a file for your records.
Invoke-AtomicTest T1059.001 -TestNumbers 1 -ExecutionLogPath "C:\evidence\art-log.csv"

# 8. Clean up, immediately. Do this even when the test appears to have
#    failed, because a partially applied change is still a change.
Invoke-AtomicTest T1059.001 -TestNumbers 1 -Cleanup

# 9. Confirm the cleanup worked by checking the artefact it created.
```

Three of those steps are the ones people skip.

**Step 5 and step 6 — prerequisites.** Many atomic tests require something that is not installed by default. A test that silently does nothing because its prerequisite is missing produces a "no detection" result that is actually a "nothing happened" result. Checking prerequisites is how you avoid recording a control failure that does not exist.

**Step 8 — cleanup.** An emulation that leaves persistence in place has not measured your controls; it has added to your attack surface. **Cleanup runs immediately after execution, every time, and you verify it worked.** A test that created a local user leaves a local user behind. A test that wrote a registry run key leaves a run key behind.

**Step 7 — logging.** The execution log is the record that lets you correlate a technique with the telemetry it produced, later, when you are building the results matrix. Without timestamps you are matching by memory.

#### Reading the test before you run it

**Run no atomic test you have not read.** This is not a stylistic preference. The library contains tests that modify system configuration, create accounts, alter firewall rules, and download files. Some of them are disruptive even in a lab.

| What to check before execution | Why |
|---|---|
| The **description** | Confirms it does what the technique name suggests |
| The **prerequisites** | Confirms it will actually run |
| The **executor** | Whether it runs as PowerShell, command prompt, or a binary |
| The **command** itself | You are responsible for what you run, not the library |
| The **cleanup** command | Confirms there is one, and that it is specific |
| The **elevation requirement** | Whether it needs administrative rights, which changes what you are testing |

The third and fifth rows matter most. If a test has no cleanup command, either do not run it, or plan to restore the VM from a snapshot afterwards. If a test requires administrative rights and your target runs as a standard user, you are testing a scenario that cannot happen in your estate, and the coverage result will be misleading in both directions.

#### The wrong first guess, and why it is so common

Here is a mistake almost everyone makes the first time, described in full because recognising it in yourself is worth more than avoiding it by luck.

You run your first Atomic test. You look at the Sysmon log. You see events. You conclude the technique is **covered**, write it up as green, and move on.

Then, three techniques later, you look at the log again and realise you have been looking at a *different* event the whole time — you have been watching for event ID 3, network connection, when the technique produces event ID 1, process creation, and the ID 3 you saw came from Sysmon itself updating its configuration. Nothing about the technique was detected. What you actually had was a log full of unrelated noise and a strong wish to be finished.

| The wrong first guess | What it produces | The correction |
|---|---|---|
| "Events appeared, so it is covered" | A coverage map that is too generous, and a false sense of safety | Filter to the exact event ID, the exact time window, and the exact process before concluding anything |
| "The technique did not fire, so we are protected" | A control credited for a test that never ran | Check prerequisites and confirm from the log that the behaviour actually happened |
| "No events appeared, so we have no telemetry" | A gap attributed to tooling when the rule simply did not match | Check whether the event ID exists at all in the log before concluding it is missing |
| "The alert fired, so detection works" | A rule credited for firing on something unrelated | Confirm the alert's own fields match the technique you ran |

**The correction for all four is the same discipline: before you record any verdict, prove that the behaviour happened and prove what the log showed.** Two questions, both answered from evidence, both written down.

```powershell
# Prove the behaviour happened: filter to the exact process and window.
$start = (Get-Date).AddMinutes(-15)
Get-WinEvent -FilterHashtable @{
    LogName   = 'Microsoft-Windows-Sysmon/Operational'
    Id        = 1
    StartTime = $start
} | Where-Object { $_.Message -match 'powershell' } |
    Format-List TimeCreated, Id, Message

# Prove what the log actually contained in that window, by event ID,
# so you can tell "the rule did not match" apart from "the event
# was never recorded".
Get-WinEvent -FilterHashtable @{
    LogName   = 'Microsoft-Windows-Sysmon/Operational'
    StartTime = $start
} | Group-Object Id | Sort-Object Count -Descending |
    Format-Table Count, Name -AutoSize
```

The second command is the one that separates the two failure modes. If event ID 1 is absent from the output entirely, you have a **telemetry gap**, and no rule can fix it. If event ID 1 is present in large numbers but none of them match your technique, you have a **detection gap**, and a rule can fix it. Those are different findings with different owners and different fixes, and reporting one as the other wastes someone's quarter.

### Part 5 — Measuring coverage without lying to yourself

#### The four verdicts

A coverage map with two states — covered and not covered — is worse than useless, because it hides the most important finding. There are four honest verdicts, and you have to be willing to write the third and fourth down.

| Verdict | Meaning | What it implies | Colour |
|---|---|---|---|
| **Detected** | A rule fired, the alert was correct, and an analyst would have been told | Nothing to fix for this technique | Green |
| **Partially detected** | Something fired, but it was incomplete, late, or relied on a human noticing | The rule needs work | Amber |
| **Not detected, telemetry present** | The data was recorded and no rule matched it | **Write a rule.** This is the productive finding | Red |
| **Not detected, no telemetry** | The data was never recorded at all | **This is a capability gap, not a detection gap.** It needs a config or budget change, and it needs to be said out loud | Grey |

**The grey verdict is the one people avoid writing.** It is uncomfortable because it says the organisation cannot see something, and the fix is not a rule you can write this afternoon — it is a configuration change, a licence, or an architecture decision that belongs to someone else. But reporting it as "not detected" alongside the red findings buries it, and buries the fact that no amount of detection engineering will close it.

The distinction has a direct practical consequence.

| | Detection gap (red) | Telemetry gap (grey) |
|---|---|---|
| **Owner** | Detection engineering | Endpoint or platform engineering |
| **Fix** | Write and tune a rule | Enable a log source, deploy an agent, or change a policy |
| **Time to fix** | Hours to days | Weeks to months |
| **Cost** | Usually nothing | Often licence, storage, or performance cost |
| **Who must approve** | Usually nobody | Often a budget holder |

Say the grey finding in the report in exactly those terms: **"We have no telemetry for this technique. No detection rule can change that. It requires a configuration change owned by endpoint engineering, and here is what it would cost."** That sentence is useful. "Not detected" is not.

#### The results matrix

Every technique you test produces one row. The row is the record of a measurement, and it should be readable months later by someone who was not there.

| # | Technique | Tactic | Platform | Command / Atomic | Telemetry expected | Telemetry found | Verdict | Gap ID |
|---|---|---|---|---|---|---|---|---|
| 1 | T1059.001 PowerShell | Execution | Windows 10 | Atomic T1059.001 #1 | Sysmon 1 with `powershell.exe` and full command line | Sysmon 1 present and correct | **Partially detected** — recorded, no rule | GAP-001 |
| 2 | T1053.005 Scheduled Task | Persistence | Windows 10 | Atomic T1053.005 #1 | Security 4698, TaskScheduler operational | Security 4698 present | **Detected** — rule fired within 90s | — |
| 3 | T1547.001 Registry Run Keys | Persistence | Windows 10 | Atomic T1547.001 #1 | Sysmon 13 on `...\CurrentVersion\Run` | Sysmon 13 present but filtered out by config | **Not detected, telemetry present** | GAP-002 |
| 4 | T1136.001 Create Local Account | Persistence | Windows 10 | Atomic T1136.001 #1 | Security 4720 | **No 4720 in the log — account auditing not enabled** | **Not detected, no telemetry** | GAP-003 |
| 5 | T1003.001 LSASS Memory | Credential Access | Windows 10 | Atomic T1003.001 #1 | Sysmon 10 with `lsass.exe` as target | Sysmon 10 present, high volume, no rule | **Partially detected** — noisy, needs scoping | GAP-004 |
| 6 | T1059.003 Windows Command Shell | Execution | Windows 10 | Atomic T1059.003 #1 | Sysmon 1 with `cmd.exe` | Present, and a rule fired | **Detected** | — |

That table is the phase's central artefact. Notice three things about it.

**The "Telemetry expected" column was written before execution.** That is what makes the "Telemetry found" column meaningful. If you write both columns afterwards, you are describing, not measuring.

**Row 4 is grey, not red.** The account-creation audit policy was off, so no rule could ever have matched. Recording that as "not detected" would have sent a detection engineer looking for a rule to write for data that does not exist.

**Row 1 is amber despite the data being perfect.** Sysmon recorded exactly what it should have. The reason it is not green is that no rule exists to look at it, and a human reading raw Sysmon events is not a detection. **Telemetry without detection is not coverage** — and it is a distinction that people who build coverage reports from log-source inventories routinely miss.

#### Coverage percentage, and why you should be careful with it

Executives like a number. Coverage percentages are easy to produce and easy to mislead with, and the honest version requires stating the denominator.

| Claim | What it means | Is it honest? |
|---|---|---|
| "We cover 78% of ATT&CK" | 78% of what? All 200+ techniques? The ones you tested? The ones relevant to you? | No — meaningless without the denominator |
| "We cover 78% of the 40 techniques we tested" | A precise statement about a chosen set | Yes, if the set was chosen by relevance |
| "We cover 78% of the 40 techniques we tested, and 12 of the 40 are grey" | Precise, and distinguishes detection from capability | Yes, and this is the version to publish |
| "We improved coverage from 55% to 78% this quarter" | A trend, with the same denominator both times | Yes, and useful — if the set did not change |

**The trap is that the denominator is easy to shrink.** Testing 20 techniques you are confident about produces a much better percentage than testing 40 chosen for relevance. A coverage number is only meaningful next to the list of techniques it was computed over, and that list should be published with it. A number without its list is a marketing claim, not a measurement.

### Part 6 — The purple team loop, and writing detections from a result

#### What purple teaming actually is

**Purple teaming** is the practice of running the offensive and defensive functions together, in a loop, rather than in sequence. The name comes from the idea that the red team and the blue team, working separately, each learn half of what they could learn together.

The loop has six steps, and it only counts as a loop if the last one feeds the first.

| Step | What happens | Who is involved |
|---|---|---|
| **1. Choose** | Select the technique, and write the detection hypothesis | Detection engineer, with the person executing |
| **2. Execute** | Run the behaviour, in scope, with logging | The person running the exercise |
| **3. Observe** | Look at what the telemetry actually recorded | Detection engineer |
| **4. Gap** | Record the verdict, and write it into the gap register | Both |
| **5. Detect** | Write or tune the rule, and validate it fires | Detection engineer |
| **6. Re-test** | Run the same technique again and confirm the new rule fires | Both |

**Step 6 is the step that gets skipped, and skipping it is what makes a purple team programme decorative.** A rule written from an emulation result has never been tested. It may not compile. It may fire on everything. It may not fire at all, because the field you matched on is named something else in your backend. Running the technique a second time, with the new rule live, is the only thing that turns "we wrote a detection" into "we detect this".

The re-test also produces the second data point that makes the whole thing worth doing: **the same technique that was red last week is green this week, and you have a timestamped record of the change.** That record is what a purple team programme actually sells.

#### Writing the rule

Detection rules written from an emulation result have an advantage over rules written from threat intelligence: you have the telemetry in front of you. You know exactly what field holds what, and you can see the false positives your rule will produce before you ship it.

**Sigma** is a free, open-source, vendor-neutral rule format. You write the rule once in Sigma, and convert it to whatever query language your platform uses — Splunk SPL, Elastic DSL, Microsoft Sentinel KQL, or a plain grep for log triage.

```yaml
title: PowerShell Launched with Encoded Command from Office Application
id: 8b1d0f3c-5e42-4a91-9c07-2f6ab3d81e55
status: experimental
description: |
    Detects a Microsoft Office application spawning PowerShell with an
    encoded command. Written from emulation result GAP-001 in exercise
    AE-2026-004. The original hypothesis was that any PowerShell command
    line would be visible; in practice the parent process is the only
    reliable discriminator between administrative and malicious use.
references:
    - https://attack.mitre.org/techniques/T1059/001/
    - https://attack.mitre.org/techniques/T1204/002/
author: Your Name
date: 2026/04/08
logsource:
    category: process_creation
    product: windows
detection:
    selection_parent:
        ParentImage|endswith:
            - '\WINWORD.EXE'
            - '\EXCEL.EXE'
            - '\POWERPNT.EXE'
            - '\OUTLOOK.EXE'
    selection_child:
        Image|endswith:
            - '\powershell.exe'
            - '\pwsh.exe'
            - '\cmd.exe'
            - '\wscript.exe'
            - '\cscript.exe'
    selection_flags:
        CommandLine|contains:
            - ' -enc'
            - ' -EncodedCommand'
            - ' -nop'
            - ' -w hidden'
            - 'FromBase64String'
    condition: selection_parent and selection_child and selection_flags
falsepositives:
    - A signed Office add-in that legitimately calls a script host
    - Software deployment tooling that launches Office with a macro
level: high
tags:
    - attack.execution
    - attack.defense_evasion
    - attack.t1059.001
    - attack.t1204.002
```

Five things in that rule are the result of having run the emulation first.

**The parent-process selection is the discriminator.** `powershell.exe` alone fires constantly in any real environment. `powershell.exe` launched by `WINWORD.EXE` with an encoded command essentially does not. The emulation showed which field carried the signal.

**The `falsepositives` block is written, not left empty.** It names two plausible benign causes. A rule shipped with an empty false-positive list has not been thought about.

**The `references` block points at the technique and at the procedure.** Someone reviewing the rule in a year can find out why it exists.

**The `level` is `high`, not `critical`.** The rule fires on a small number of events with a strong signal, which is high. Reserving `critical` for confirmed compromise keeps the severity scale meaningful — the same discipline the incident-response phase applies to triage.

**The description records the emulation result it came from.** This is the traceability that makes a detection programme auditable: every rule can be traced to a measurement.

#### Converting and validating

```bash
# Install sigma-cli, the current Sigma conversion tool.
pip install sigma-cli
sigma plugin list

# Install the backend you need. For Splunk:
sigma plugin install splunk

# Convert a rule to a Splunk query and print it.
sigma convert -t splunk -p splunk_windows rules/windows/process_creation/office_spawns_encoded_powershell.yml

# Convert a whole directory to an Elastic query file.
sigma convert -t elasticsearch -p ecs_windows rules/windows/process_creation/ -o out/elastic.json

# Convert to a plain readable form, useful for a manual triage sweep.
sigma convert -t grep rules/windows/process_creation/
```

**Validate against your own data before you ship, using the emulation's own log export.**

```powershell
# Run the converted query against the exported event log from the exercise.
# This is the cheapest possible false-positive test: you know exactly what
# should match, and you can see everything else that does.

$log = "C:\evidence\2026-04-06\sysmon.evtx"

# A crude but effective validation: count matches in the exercise window.
Get-WinEvent -Path $log |
  Where-Object {
    $_.Id -eq 1 -and
    $_.Message -match 'WINWORD\.EXE' -and
    $_.Message -match '\-enc'
  } | Measure-Object | Select-Object Count

# Then count what the rule would match in a quiet window, which is the
# number that predicts your alert volume in production.
Get-WinEvent -Path $log |
  Where-Object { $_.Id -eq 1 } |
  Measure-Object | Select-Object Count
```

The second count is the one to think about. If your rule matches three events during the exercise and four thousand events across a normal day, you have written a rule that will be muted within a week. **Alert volume is a design constraint, not an afterthought**, and the only time you can estimate it cheaply is while you still have the logs from the test.

#### The detection gap register

Every gap becomes a row in a register. The register is the work queue, and it outlives the exercise.

| Gap ID | Technique | Verdict | Finding | Owner | Proposed fix | Priority | Status | Re-test date |
|---|---|---|---|---|---|---|---|---|
| GAP-001 | T1059.001 | Partially detected | Sysmon records the process, no rule matches Office as parent | Detection engineering | Sigma rule `office_spawns_encoded_powershell` | High | Rule written, awaiting re-test | 2026-04-15 |
| GAP-002 | T1547.001 | Not detected, telemetry present | Sysmon 13 events are dropped by the config's registry exclude list | Detection engineering | Narrow the exclude list to keep `\CurrentVersion\Run` | High | Config change proposed | 2026-04-22 |
| GAP-003 | T1136.001 | Not detected, no telemetry | Windows account-management auditing is not enabled | Endpoint engineering | Enable `Audit User Account Management` by GPO | High | Raised to endpoint engineering | 2026-05-06 |
| GAP-004 | T1003.001 | Partially detected | Sysmon 10 is recorded but the volume makes a naive rule unusable | Detection engineering | Scope to non-system processes accessing `lsass.exe` with `GrantedAccess` 0x1010 | Medium | Rule drafted | 2026-04-29 |

**The Owner column is what makes a register a work queue rather than a wish list.** A finding without an owner is a finding nobody will fix. The Priority column exists so that the register can be worked in order when there are more gaps than hours, which there always are.

The Re-test date is the commitment. A gap marked "fixed" without a re-test is a claim, and this entire phase exists to replace claims with measurements.

### Part 7 — One technique, end to end

#### The setup

This is a fully worked emulation run. The lab is synthetic; the technique, the tooling, the event IDs, and the rule are real.

| Field | Value |
|---|---|
| Exercise | AE-2026-004 |
| Technique | T1547.001, Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder |
| Tactic | Persistence |
| Platform | Windows 10, host `LAB-WIN10-01`, isolated lab VLAN 90 |
| Atomic test | Atomic Red Team T1547.001, registry run key variant |
| Authorisation | Signed ROE, section 3 in scope, section 6 window 09:00–17:00 |
| Hypothesis written before execution | "A registry value written under `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` should generate Sysmon event ID 13 with the target object naming that path. A rule should exist to alert on it." |

#### Why this technique

Three reasons, and each one is the kind of reason you should be able to give for every technique you choose.

**It is relevant to the estate.** Registry run keys are one of the most common persistence mechanisms on Windows, and they survive reboot. If the organisation cannot see one being written, that is a real hole rather than a theoretical one.

**It should be observable.** The behaviour writes to a known registry path, and Sysmon's registry event covers exactly that path. This is a technique where the telemetry *should* exist, which makes it a good test of the detection layer rather than the collection layer.

**The cleanup is trivial and verifiable.** The test writes one registry value, and the cleanup removes it. A technique with a simple, checkable cleanup is the right one to learn on.

#### What was executed

```powershell
# Step 1 — confirm the hypothesis is written down, and note the time.
Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Step 2 — note the registry state BEFORE the test, so the change is
# provable rather than assumed.
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" |
  Format-List

# Step 3 — confirm the prerequisites for this atomic are met.
Invoke-AtomicTest T1547.001 -TestNumbers 1 -CheckPrereqs

# Step 4 — read the test before running it. Confirm it has a cleanup.
Invoke-AtomicTest T1547.001 -TestNumbers 1 -ShowDetails

# Step 5 — execute, logging the run.
Invoke-AtomicTest T1547.001 -TestNumbers 1 -ExecutionLogPath "C:\evidence\art-T1547-001.csv"

# Step 6 — confirm the change happened, immediately.
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" |
  Format-List

# Step 7 — look at what Sysmon recorded. Registry value set is event ID 13.
$start = (Get-Date).AddMinutes(-10)
Get-WinEvent -FilterHashtable @{
    LogName   = 'Microsoft-Windows-Sysmon/Operational'
    Id        = 13
    StartTime = $start
} | Format-List TimeCreated, Id, Message

# Step 8 — ask the SIEM whether anything alerted. In this exercise,
# nothing did. The query the SIEM would have needed:
#   index=windows source="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational"
#   EventID=13 TargetObject="*\\CurrentVersion\\Run*"
# | stats count by host, TargetObject, Details

# Step 9 — clean up, then verify the cleanup.
Invoke-AtomicTest T1547.001 -TestNumbers 1 -Cleanup
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" |
  Format-List
```

#### What the defenders saw

Nothing. That is the result, and it is the result you report.

| Layer | What was there | What happened |
|---|---|---|
| **Endpoint telemetry** | Sysmon installed with a published configuration | **No event ID 13 was recorded for the run key path.** The configuration's registry exclude list dropped it |
| **SIEM** | Sysmon events forwarded | Nothing arrived, because nothing was generated |
| **Detection rules** | A rule existed for run-key modification | The rule could not fire on an event that was never written |
| **Analyst** | Nobody was watching live | No alert, no ticket |

#### What the telemetry should have shown

Written down **after** the run, so it can be compared against what was actually recorded.

| Field | Expected value |
|---|---|
| Event ID | 13, Registry value set |
| `TimeCreated` | Within 2 seconds of the execution timestamp recorded in step 1 |
| `EventType` | `SetValue` |
| `TargetObject` | `HKU\<SID>\Software\Microsoft\Windows\CurrentVersion\Run\<value name>` |
| `Details` | The command the value points at — in this test, a path to a benign payload |
| `Image` | `powershell.exe`, or whichever process the atomic used to write the value |
| `User` | `LAB-WIN10-01\emul-user` |

The `TargetObject` and `Details` fields are the ones that carry the detection. The path identifies the persistence location, and the `Details` field names the executable that will run at logon — which is what an analyst needs in order to decide whether the alert is real.

#### The verdict, and why it is grey rather than red

| Verdict | Reasoning |
|---|---|
| **Not detected, no telemetry** | The registry event was never recorded. This is a **telemetry gap**, not a detection gap |

This is the judgement that separates a careful emulation from a careless one. The lazy reading is "we do not detect registry run keys, write a rule". That reading sends a detection engineer to write a rule against an event that does not exist in the pipeline. The rule gets written, tested against a lab where Sysmon *is* logging it, works, ships, and never fires in production, because production is running the same exclude list the lab was.

**Prove the telemetry exists before you blame the rule.** The check is one command, and it is the command that turns a wrong finding into a right one.

```powershell
# Does ANY event ID 13 exist in the log at all?
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" -MaxEvents 5000 |
  Where-Object { $_.Id -eq 13 } | Measure-Object | Select-Object Count

# If the count is zero, the config is dropping registry events entirely.
# Inspect the config to find the exclude rule responsible.
Select-String -Path "C:\evidence\sysmonconfig-export.xml" -Pattern "RegistryEvent" -Context 0, 25
```

#### The detection written from the gap

Because the finding is a telemetry gap, the deliverable is two-part: the configuration change, and the rule that will be waiting for the data once it arrives.

**Part one — the configuration change, owned by detection engineering.**

```xml
<!-- Excerpt: a narrow change to the Sysmon registry exclude list.
     Before: the Run key path was inside a broad exclude.
     After: the Run key paths are explicitly kept. -->
<Sysmon>
  <EventFiltering>
    <RegistryEvent onmatch="exclude">
      <!-- Broad exclusions retained for volume control -->
      <TargetObject condition="contains">\Software\Microsoft\Windows\CurrentVersion\Explorer\</TargetObject>
      <!-- Run and RunOnce are now explicitly carved back in.
           Sysmon evaluates exclude rules first, so the carve-in has to
           be done by narrowing the exclusion, not by adding an include. -->
    </RegistryEvent>
  </EventFiltering>
</Sysmon>
```

**Part two — the Sigma rule, ready for the data.**

```yaml
title: Registry Run Key Persistence Set by Non-Installer Process
id: 3c9a71e0-2d84-4f16-b0a5-6e1c9d5a7f22
status: experimental
description: |
    Detects a value written under the user or machine Run/RunOnce keys by
    a process that is not a recognised software installer. Written from
    emulation gap GAP-002 in exercise AE-2026-004, where the telemetry
    was being dropped by configuration before any rule could see it.
references:
    - https://attack.mitre.org/techniques/T1547/001/
author: Your Name
date: 2026/04/09
logsource:
    category: registry_set
    product: windows
detection:
    selection:
        TargetObject|contains:
            - '\Software\Microsoft\Windows\CurrentVersion\Run\'
            - '\Software\Microsoft\Windows\CurrentVersion\RunOnce\'
            - '\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Run\'
    filter_installers:
        Image|endswith:
            - '\msiexec.exe'
            - '\TrustedInstaller.exe'
            - '\setup.exe'
            - '\MsiExec.exe'
    filter_signed_paths:
        Details|contains:
            - '\Program Files\'
            - '\Program Files (x86)\'
    condition: selection and not filter_installers and not filter_signed_paths
falsepositives:
    - User-installed portable applications that write a Run key
    - Vendor updaters that write to HKCU Run without an installer context
    - Remote management tooling
level: medium
tags:
    - attack.persistence
    - attack.t1547.001
```

Two deliberate choices in that rule are worth naming.

**The level is `medium`, not `high`.** Registry run keys are written legitimately in almost every environment, by user-installed software and by updaters. A `high` severity here would produce a rule that analysts stop reading. `Medium`, with the two filters reducing volume, is the honest rating — and the emulation is what makes that visible, because you can count how many benign writers exist in your own lab before you ship.

**The two filters reduce volume at the cost of coverage.** A malicious binary copied into `C:\Program Files\` and writing a run key will be filtered out. That is a conscious trade, and it belongs in the rule's description so that the next person to read it knows it was a decision rather than an oversight. **Every filter you add buys quiet at the price of blindness, and the price should be written down.**

#### The re-test, and what it changed

| Re-test | Date | Result |
|---|---|---|
| First run | 2026-04-08 | No event ID 13 recorded. Verdict: **not detected, no telemetry** |
| Config change applied | 2026-04-09 | Registry exclude list narrowed |
| Second run | 2026-04-15 | Event ID 13 recorded with the correct `TargetObject` and `Details`. Rule matched. Alert raised in 41 seconds |
| Verdict after re-test | 2026-04-15 | **Detected** |

**The elapsed time from finding to verified detection was seven days, and it required three different people.** That is a realistic number and it belongs in the report. A purple team programme that claims to close gaps in a day is either closing trivial gaps or not re-testing.

### Part 8 — Reporting a control failure to the person who owns the control

#### The thing that is hard about this

You have found that a control does not work. Someone built that control, or bought it, or argued for it in a budget meeting. And now you have to tell them.

The failure mode is well known and it has two shapes, and both of them end with the finding going unfixed.

| Failure mode | What it sounds like | What happens next |
|---|---|---|
| **The accusation** | "Your control does not work" | The owner defends the control, and the conversation becomes about the control's quality rather than the gap |
| **The dump** | A raw table of forty gaps sent by email | The owner closes the message. Nothing is prioritised, so nothing is started |

The alternative is a report written for the owner's world, and it has a specific shape.

| Section | Content | Why |
|---|---|---|
| **What we did** | The technique, the scope, the authorisation, the date | Establishes that this was a controlled measurement, not an attack |
| **What we expected** | The hypothesis written before execution | Shows the expectation was set in advance, not constructed to fit the result |
| **What we observed** | The evidence: event IDs, counts, timestamps, log excerpts | Removes the argument about whether it happened |
| **Why it matters** | The realistic scenario this gap enables | Connects the technical finding to a risk the owner cares about |
| **What we are not saying** | Explicitly, that the control is worthless or that anyone made a mistake | Disarms the defensive response before it starts |
| **What would close it** | A specific, costed, owned proposal | Turns a finding into a task |
| **What we will do to verify** | The re-test date and method | Makes it a joint measurement rather than a complaint |

#### Worked example: the control-failure note

```text
To          Endpoint Engineering Lead
From        Your Name, Detection Engineering
Subject     Emulation finding GAP-003 — account creation not audited
Date        2026-04-10
Reference   Exercise AE-2026-004, authorised under ROE section 1

WHAT WE DID
On 2026-04-08, as part of exercise AE-2026-004, we ran Atomic Red Team
test T1136.001 on LAB-WIN10-01 in the isolated lab VLAN. The test creates
a local user account. The technique is ATT&CK T1136.001, Create Account:
Local Account, Persistence tactic.

WHAT WE EXPECTED
Before execution we wrote the following hypothesis: "Creating a local
account should generate Windows Security event ID 4720, and a rule should
exist to alert on it."

WHAT WE OBSERVED
The account was created successfully. Confirmed with:
    Get-LocalUser | Format-Table Name, Enabled, LastLogon
No event ID 4720 was recorded in the Security log for the window.
We then checked whether event ID 4720 is generated at all on this host:

    Get-WinEvent -LogName Security -MaxEvents 5000 |
      Where-Object { $_.Id -eq 4720 } | Measure-Object

Result: zero events. Account management auditing is not enabled on this
image.

WHY IT MATTERS
If an adversary creates a local account for persistence on any Windows
host in this estate, we will not see it. There is no rule that can be
written, because the event does not exist. The gap is in collection,
not in detection.

WHAT WE ARE NOT SAYING
This is not a defect in the endpoint agent or in anyone's work. Account
management auditing is off by default on Windows and has to be turned on
deliberately. It is a configuration gap that has simply never been closed.

WHAT WOULD CLOSE IT
Enable Advanced Audit Policy: Account Management > Audit User Account
Management, for Success and Failure, via Group Policy on the server and
workstation OUs. Estimated effort: one GPO change and a day of validation.
Owner proposed: Endpoint Engineering.
We would also recommend Audit Security Group Management, for the same
reason — adding an account to Administrators is T1098, and it generates
event ID 4732 from the same policy area.

WHAT WE WILL DO TO VERIFY
We will re-run T1136.001 on 2026-05-06, ten days after the change is
scheduled to land, and confirm that event ID 4720 is generated and that
the planned rule fires. We will send the result whether it passes or not.

Happy to walk through the reproduction steps with anyone on your team.
```

Four things in that note are doing work.

**"What we are not saying" is the most valuable section.** It removes the implication that someone failed, which removes the reason to argue. A finding that arrives without blame gets fixed faster than one that arrives with it.

**"What would close it" names a specific change and an estimated effort.** "Improve auditing" is not a task. "Enable this specific audit subcategory by GPO in these OUs, one day of validation" is.

**The owner is proposed rather than assigned.** If they disagree, that is a conversation about who owns it, which is a much easier conversation than one about whether the finding is real.

**The verification commitment is unconditional** — "whether it passes or not". This is what makes the note a measurement agreement rather than a request. It also means the sender has to follow up, which is the difference between a report and a complaint.

#### When the owner disagrees

They will sometimes. The control may be intentionally designed the way you observed, and your finding may be a misunderstanding of its purpose.

| Their objection | What it probably means | Your move |
|---|---|---|
| "The control is not meant to catch that" | The scope of the control is different from what you assumed | Accept it, and ask what the control *is* meant to catch, then test that instead |
| "It did not fire because the test was unrealistic" | Your technique may not reflect a real procedure | Ask them to describe a realistic procedure, and test that |
| "We have a compensating control" | The gap is real but covered elsewhere | Ask them to demonstrate it, and re-test with both controls in the picture |
| "That alert goes to a queue nobody watches" | A genuine and common finding | This is a detection gap of a different kind — the rule exists but the process does not. Record it as such |
| "You are testing it wrong" | Possibly true | Ask them to show you the correct way, and re-run |

**The third and fourth objections are the ones to take most seriously**, because they describe a real category of failure this phase does not otherwise reach: **a control that fires correctly into a process that does not act on it.** A rule that fires and generates an alert that nobody triages is, from the perspective of detection, indistinguishable from no rule at all. Recording that as a finding — "the rule works, the response path does not" — is a valuable and frequently missed result.

#### How the report lands

The full exercise report goes to the person who authorised it, and it has a shape of its own.

| Section | Content |
|---|---|
| **Authorisation and scope** | The ROE reference, the authorising person, the dates, and the technique list |
| **Method** | How the tests were run, in what environment, with what telemetry, and how isolation was verified |
| **Results matrix** | The full table, every technique, every verdict |
| **Coverage summary** | The number, its denominator, and the technique list it was computed over |
| **Gap register** | Every gap, with owner, proposed fix, priority, and re-test date |
| **Detections written** | The rules produced, with their conversion status and their validation result |
| **Detections verified** | Which rules have been re-tested and confirmed, and which have not |
| **Limitations** | What this exercise does not cover, stated plainly |
| **Navigator layer** | Before and after, as an attachment |

**The Limitations section is not optional and it is not a formality.** An exercise that tests five techniques in an isolated lab on Windows 10 has measured five techniques, on Windows 10, in a lab. It has not measured the estate. Saying so is what makes the rest of the report trustworthy.

A realistic limitations paragraph reads like this.

```text
LIMITATIONS

This exercise measured detection coverage for five techniques on two
Windows 10 lab hosts with a fresh Sysmon configuration. It did not
measure:

  - Any technique on Linux, macOS, or cloud identity.
  - Any technique in the Credential Access or Lateral Movement tactics
    beyond T1003.001.
  - Whether the rules that fired would have been triaged correctly by an
    analyst, only that they generated an alert.
  - Behaviour in an environment with the normal volume of legitimate
    activity, which is where most rules fail.
  - Any technique involving a real user, a real mailbox, or production
    data.

The coverage percentage in this report applies to the 40 techniques
listed in Appendix A and to nothing else.
```

That paragraph costs ten minutes to write and it is the difference between a measurement and a claim.

### Key takeaways

- **This phase is defensive.** You are emulating adversary behaviour to measure your own controls and improve them. The deliverable is a detection and a report, not access.
- **Unauthorised testing is a crime.** Only ever run adversary behaviour against systems you own or hold written permission to test, from someone entitled to grant it. A verbal go-ahead is worth nothing.
- **Adversary emulation is a measurement activity, not an access activity.** An emulation that fails to be observed has failed as a test even if it achieved access perfectly.
- **ATT&CK is a vocabulary, not a tool.** Learn tactic, technique, sub-technique, and procedure, and be able to say which level you are testing.
- **A detection for one procedure is not a detection for the technique.** This is why most coverage claims built on a single atomic test are overstated, and why "partially covered" is usually the honest verdict.
- **The plan comes before the tool.** Choose the tactic, the technique, the scope, and the hypothesis before you choose what runs it.
- **Write the detection hypothesis before you execute.** If you write it afterwards you are describing, not measuring.
- **Rules of engagement is the document that makes the work legal and stoppable.** The out-of-scope list and the unilateral stop condition are the two sections that matter most.
- **NAT is not isolation.** Host-only or internal networking, no shared folders, no clipboard, no USB passthrough, and a verified kill switch.
- **Verify isolation rather than assuming it**, and keep the output as a timestamped record.
- **Check that the telemetry exists before you blame the rule.** "No event was recorded" and "the event was recorded and no rule matched" are different findings with different owners and different fixes.
- **Four verdicts, not two.** Detected, partially detected, not detected with telemetry present, and not detected with no telemetry. The fourth is a capability gap and it has to be written down as one.
- **Telemetry without detection is not coverage.** A log source you collect and never query is not a control.
- **A coverage percentage without its denominator is a marketing claim.** Always publish the technique list alongside the number.
- **Run no atomic test you have not read, and clean up immediately every time.** Verify the cleanup worked.
- **The purple team loop only counts as a loop if the last step feeds the first.** A rule written from an emulation result has never been tested until you re-run the technique against it.
- **Every filter you add to a rule buys quiet at the price of blindness.** Write the trade-off down in the rule itself.
- **Report control failures without blame, with evidence, with a costed fix, and with an unconditional re-test commitment.** The "what we are not saying" section is what gets a finding fixed.
- **A rule that fires into a queue nobody watches is a detection gap of a different kind.** Record it, because it is common and it is invisible to a coverage map.
- **State your limitations.** An exercise on two lab hosts measured two lab hosts. Saying so is what makes the rest of the report trustworthy.

### Practice this next

The twelve tasks build toward one artefact — an authorised emulation exercise, measured honestly and turned into detections — and the order follows the loop deliberately. Nothing in tasks 5 onward is safe or meaningful until tasks 1 and 2 are done.

1. **Write the rules-of-engagement document before anything else** (task 1). Ten sections, an out-of-scope list, and a unilateral stop condition. If you cannot get a signature for the system you had in mind, that is the answer to the question, and you build a lab instead.
2. **Build and verify the isolated lab** (task 2). Five isolation checks, with the output recorded and timestamped. Do not proceed until every check fails the way it should.
3. **Build the Navigator layer before you test anything** (task 3). Every technique starts as unknown. The layer is a hypothesis about coverage, and the exercise is what turns it into a measurement.
4. **Get the telemetry working and confirm it** (task 4). Install Sysmon with a published configuration and verify that event IDs 1, 3, 11, and 13 are actually being written. You cannot measure what you are not recording.
5. **Run five tests across five tactics** (task 5), reading each one before it runs and cleaning up immediately after. Five different tactics, because a coverage map built on one tactic is not a coverage map.
6. **Write the hypothesis for each one before you run it** (task 6). Expected event ID, expected fields, expected timing. Then record what was actually found.
7. **Write one Sigma rule from a gap you produced** (task 7) and convert it for a backend. A rule that exists only as a note in a report is not a detection.
8. **Hunt your own logs with those rules** (task 8). Chainsaw or Hayabusa will run Sigma rules against exported event logs, and seeing a rule fire on your own data is the moment the format stops being abstract.
9. **Run one technique twice, once clean and once blended** (task 9). The clean version and the disguised version produce different telemetry, and the difference is what tells you whether your rule detects the technique or the procedure.
10. **Complete the results matrix** (task 10), one row per technique, with the verdict and the gap ID. This is the artefact that outlives the exercise.
11. **Write the control-failure note for one gap** (task 11), including the "what we are not saying" section. Getting that section right is harder than writing the rule.
12. **Present the whole exercise as a readout** (task 12), with the Navigator layer before and after, and the coverage number with its denominator stated out loud.

Then open `portfolio/advance/05-adversary-emulation.md` and assemble the deliverables. **The phase is done when you can write an authorised rules-of-engagement document, emulate five ATT&CK techniques in an isolated lab, record honestly what your telemetry did and did not show, and turn each gap into a written detection and a control-failure report.**

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| MITRE ATT&CK | Knowledge base of adversary tactics and techniques | Free | https://attack.mitre.org/ | Pick one technique and write down its tactic, technique, and sub-technique ID | The offline ATT&CK STIX data, browsed in a text editor |
| ATT&CK Navigator | Web tool for building coverage layers | Free/open-source | https://mitre-attack.github.io/attack-navigator/ | Build a layer with 20 techniques marked as unknown | A spreadsheet with one row per technique ID |
| Atomic Red Team | Library of small emulation tests mapped to ATT&CK | Free/open-source | https://github.com/redcanaryco/atomic-red-team | Read one test in full, including its prerequisites and cleanup | Manual commands taken from the ATT&CK technique page |
| Invoke-AtomicRedTeam | PowerShell runner for the Atomic library | Free/open-source | https://github.com/redcanaryco/invoke-atomicredteam | List the tests for one technique and check their prerequisites | Running an atomic's command manually from the YAML |
| Sigma | Vendor-neutral detection rule format and rule repository | Free/open-source | https://github.com/SigmaHQ/sigma | Write one rule from an emulation result | Your SIEM's native rule syntax |
| sigma-cli | Converts Sigma rules to a specific backend query language | Free/open-source | https://github.com/SigmaHQ/sigma-cli | Convert one rule to a Splunk or Elastic query | Hand-writing the query in the platform |
| Sysmon | Detailed Windows endpoint telemetry | Free | https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon | Install it with a config and confirm event IDs 1, 3, 11, and 13 are written | Windows Security 4688 process auditing, or auditd on Linux |
| Chainsaw | Fast Sigma-based triage and hunting over event logs | Free/open-source | https://github.com/WithSecureLabs/chainsaw | Hunt an exported Sysmon log with the Sigma rule set | Hayabusa, or manual `Get-WinEvent` filters |
| Windows Event Log and wevtutil | Native log storage and export | Free, built-in | https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil | Export the Sysmon and Security logs to files before reverting a snapshot | PowerShell `Get-WinEvent` with `-Path` |
| MITRE Caldera | Automated adversary emulation platform for chains of techniques | Free/open-source | https://github.com/mitre/caldera | Deploy the server and run one operation against a lab agent | Chaining Atomic tests manually in sequence |

## Free/cheap resources

- MITRE ATT&CK — https://attack.mitre.org/
- MITRE ATT&CK training and resources — https://attack.mitre.org/resources/
- ATT&CK Navigator — https://mitre-attack.github.io/attack-navigator/
- MITRE Engenuity ATT&CK Evaluations — https://attackevals.mitre-engenuity.org/
- Atomic Red Team — https://github.com/redcanaryco/atomic-red-team
- Atomic Red Team documentation — https://www.atomicredteam.io/
- invoke-atomicredteam — https://github.com/redcanaryco/invoke-atomicredteam
- SigmaHQ rule repository — https://github.com/SigmaHQ/sigma
- Sigma documentation — https://sigmahq.io/docs/basics/rules.html
- sigma-cli — https://github.com/SigmaHQ/sigma-cli
- Sysmon — https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon
- SwiftOnSecurity sysmon-config — https://github.com/SwiftOnSecurity/sysmon-config
- Olaf Hartong sysmon-modular — https://github.com/olafhartong/sysmon-modular
- Chainsaw — https://github.com/WithSecureLabs/chainsaw
- Hayabusa — https://github.com/Yamato-Security/hayabusa
- MITRE Caldera — https://github.com/mitre/caldera
- Purple Team Exercise Framework — https://github.com/scythe-io/purple-team-exercise-framework
- Vectr — https://github.com/SecurityRiskAdvisors/Vectr
- NIST SP 800-115, Technical Guide to Information Security Testing and Assessment — https://csrc.nist.gov/pubs/sp/800/115/final
- NCSC CBEST threat-intelligence-led assessments guidance — https://www.ncsc.gov.uk/guidance/cbest-threat-intelligence-led-assessments
- Elastic detection rules — https://github.com/elastic/detection-rules
- Splunk Security Content research — https://research.splunk.com/
- Cybercrime Prevention Act of 2012, Republic Act 10175 — https://lawphil.net/statutes/repacts/ra2012/ra_10175_2012.html
- National Privacy Commission of the Philippines — https://privacy.gov.ph/

## Hands-on practice tasks

1. Write a one-page rules-of-engagement and authorisation document for a lab you own, with an out-of-scope list and a stop condition. <!-- id: advance-05-t01 band: focused energy: normal -->
2. Build an isolated lab VM and prove the isolation with five checks whose output you save and timestamp. <!-- id: advance-05-t02 band: deep energy: high -->
3. Build an ATT&CK Navigator layer of 25 techniques relevant to your estate, every one marked as unknown coverage. <!-- id: advance-05-t03 band: focused energy: normal -->
4. Install Sysmon with a published configuration and confirm event IDs 1, 3, 11, and 13 are being recorded. <!-- id: advance-05-t04 band: focused energy: normal -->
5. Run five Atomic Red Team tests across five different tactics, reading each test first and cleaning up immediately after. <!-- id: advance-05-t05 band: deep energy: high -->
6. Write the detection hypothesis for each of the five tests before you run it, then record what the telemetry actually showed. <!-- id: advance-05-t06 band: deep energy: high -->
7. Write one Sigma rule from a gap you found, convert it to a backend query, and validate it against your exported logs. <!-- id: advance-05-t07 band: deep energy: high -->
8. Hunt your exported event logs with Chainsaw or Hayabusa and the Sigma rule set, and record which rules fired. <!-- id: advance-05-t08 band: focused energy: normal -->
9. Run one technique twice, once as a plain command and once written to blend into normal activity, and compare the telemetry each produced. <!-- id: advance-05-t09 band: deep energy: high -->
10. Complete the results matrix for every technique you tested, with a verdict and a gap ID on each row. <!-- id: advance-05-t10 band: focused energy: normal -->
11. Write a control-failure note for one gap, including the section stating what you are not saying. <!-- id: advance-05-t11 band: focused energy: normal -->
12. Present the exercise as a 20-minute readout with the Navigator layer before and after, and the coverage number stated with its denominator. <!-- id: advance-05-t12 band: deep energy: high -->

## Deliverable / proof of work

Create `portfolio/advance/05-adversary-emulation.md` with:

- The signed rules-of-engagement document, including the out-of-scope list and the stop conditions
- The isolation verification record: five checks, their output, and the timestamp
- The ATT&CK Navigator layer built before the exercise, with unknown coverage marked honestly
- The detection hypotheses written before execution, one per technique
- The results matrix with a verdict and a gap ID for every technique tested
- Evidence of at least one grey verdict — a technique where no telemetry existed — stated as a capability gap rather than a detection gap
- At least one Sigma rule written from a gap you produced, with its converted backend query
- The validation result for that rule, including an estimate of its alert volume
- The detection gap register with owners, priorities, and re-test dates
- The control-failure note sent to a control owner, with the "what we are not saying" section
- The full exercise report with the coverage number and its denominator, and a limitations section
- The Navigator layer after the exercise, showing which techniques moved and which did not

## Checklist

- [ ] I can explain the difference between adversary emulation and penetration testing without prompting. <!-- id: advance-05-emulation-vs-pentest energy: low -->
- [ ] I wrote a rules-of-engagement and authorisation document before running anything. <!-- id: advance-05-roe-written energy: normal -->
- [ ] I have a written scope that names the in-scope hosts, the out-of-scope hosts, and the stop condition. <!-- id: advance-05-scope-defined energy: normal -->
- [ ] I built an isolated lab and demonstrated it has no route to a production network. <!-- id: advance-05-lab-isolation energy: high -->
- [ ] I can map a technique to ATT&CK and name the tactic, technique, and sub-technique. <!-- id: advance-05-attack-mapping energy: low -->
- [ ] I built an ATT&CK Navigator layer and marked coverage honestly, including the unknown rows. <!-- id: advance-05-navigator-layer energy: normal -->
- [ ] I ran at least five Atomic tests across five different tactics and cleaned up after each. <!-- id: advance-05-atomic-execution energy: high -->
- [ ] I wrote every detection hypothesis before execution rather than after. <!-- id: advance-05-hypothesis-first energy: normal -->
- [ ] I recorded, for each test, what telemetry should have existed and what actually existed. <!-- id: advance-05-telemetry-record energy: normal -->
- [ ] I wrote a Sigma rule from a gap I found and converted it for a backend. <!-- id: advance-05-sigma-rule energy: normal -->
- [ ] I stated "we have no telemetry for this" as a capability gap rather than marking it undetected. <!-- id: advance-05-honest-coverage energy: normal -->
- [ ] I re-tested a technique after writing its rule, and confirmed the rule fired. <!-- id: advance-05-retest-verification energy: high -->
- [ ] I completed the results matrix with a verdict and a gap ID for every technique tested. <!-- id: advance-05-results-matrix energy: normal -->
- [ ] I reported one control failure to its owner with evidence and a proposed fix, without blame. <!-- id: advance-05-control-failure-report energy: normal -->
- [ ] I can explain why unauthorised testing is illegal and what specifically makes testing authorised. <!-- id: advance-05-authorisation-reasoning energy: low -->

## You're ready to move on when...

You can write an authorised rules-of-engagement document, emulate five ATT&CK techniques in an isolated lab, record honestly what your telemetry did and did not show, and turn each gap into a written detection and a control-failure report.

## Free vs Paid

### What's free and enough

MITRE ATT&CK and the ATT&CK Navigator are free and are the entire planning vocabulary this phase uses. Atomic Red Team and invoke-atomicredteam are free, open-source, and cover the execution side completely — several hundred tests mapped to techniques, each with its own cleanup. Sigma and sigma-cli are free and open-source, and the rule repository they come with is a decade of community detection work you can read, adapt, and convert to your own backend. Sysmon is a free Microsoft download, and two well-maintained community configurations exist for it. Chainsaw and Hayabusa run Sigma rules against exported logs for free, which means you can do real hunting with no SIEM licence at all. Caldera is free and open-source if you later want to run chained operations. The ROE template, the results matrix, the gap register, and the control-failure note are all documents you write, and they cost nothing. Every part of this phase is achievable for $0.

### What's paid and why you'd upgrade

Commercial adversary emulation platforms such as AttackIQ, Pentera, Cymulate, and SafeBreach automate the execute-and-measure loop at scale: continuous testing, orchestration across an estate, built-in coverage reporting, and a library curated and updated by a vendor. Commercial detection engineering platforms such as Panther, Anvilogic, and the detection-management tiers of larger SIEMs add rule lifecycle management, testing frameworks, and alert-volume analytics. Commercial endpoint products carry the telemetry in their own console, and their higher tiers add the longer retention and richer process-level data that detection work depends on. The ATT&CK Evaluations programme is worth noting here: it is free to read, and reading a vendor's evaluation results is a cheaper way to learn what commercial emulation platforms do than buying one.

### When it's worth paying

Pay when the organisation already runs a commercial emulation platform and you need to operate it, because operating an existing tool is a job and learning it is a week of work once you understand what it is measuring. Pay when the estate is large enough that running five tests by hand is not a meaningful sample — automation becomes necessary somewhere past a few hundred endpoints. Pay when a licence provides the telemetry retention that detection work needs and free tooling genuinely cannot, which is a real constraint on some platforms. For a learner building capability, none of that applies. The measurement skills in this phase — writing a hypothesis before execution, distinguishing a telemetry gap from a detection gap, writing a rule from evidence, re-testing to verify, and reporting a failure without blame — are identical whether the emulation is orchestrated by a paid platform or typed by hand. A commercial platform automates the loop you have already learned to run, and the interview question is never which platform you used. It is what you found, and what you did about it.