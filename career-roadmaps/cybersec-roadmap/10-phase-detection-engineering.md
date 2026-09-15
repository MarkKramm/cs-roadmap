---
id: cyber-10-detection-engineering
track: cyber
phase: 10
order: 100
title: "Phase 10 — Detection Engineering"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/cyber/10-detection-engineering.md"
exit_criteria: "You can take a behaviour, choose the log source that records it, write a detection rule for it, test it against both malicious and benign activity, and document why it will not drown the analyst who receives it."
---

# Phase 10 — Detection Engineering

## Goal of this phase

Learn to build detections deliberately rather than collecting alerts, so that every rule you write names the behaviour it catches, the log that records it, the false positives it will produce, and the reason it is worth an analyst's attention.

## Estimated time

**6 weeks** at 2–4 focused hours a day, 5 days a week. Roughly 60–80 hours, plus ongoing tuning time.

## Skills you'll gain

- Explain what each major log source records and which question it can answer.
- Read Windows Security, Sysmon, Linux auditd, and web server logs confidently.
- Write detection rules in Sigma and in a SIEM query language.
- Convert a Sigma rule into a platform-specific query.
- Tune a noisy rule deliberately, with the false positive documented rather than hidden.
- Map a detection to MITRE ATT&CK with an honest justification.
- Run a detection through its full lifecycle, from hypothesis to retirement.
- Explain alert fatigue with numbers rather than as an opinion.

## Specific topics to learn

- Log sources and the question each one answers
- Windows Security event IDs: 4624, 4625, 4648, 4672, 4688, 4720, 4728, 4768, 4769, 5140, 7045
- Logon types and why type 3 and type 10 change the meaning of 4624
- Sysmon event IDs: 1, 3, 7, 8, 10, 11, 12, 13, 22
- Linux auditd rules and `/var/log/auth.log` interpretation
- Syslog facilities, priorities, and severity
- Detection rule anatomy: selection, condition, filter, level
- Sigma rule format and the Sigma specification
- SIEM query concepts: KQL, SPL, and Wazuh rule syntax compared
- False positive analysis, tuning, and whitelisting without blinding the rule
- Detection lifecycle: hypothesis, build, test, deploy, tune, retire
- MITRE ATT&CK mapping and the difference between a technique and a tactic
- Alert fatigue, triage load, and fidelity versus coverage
- Atomic Red Team and safe adversary simulation

## Lesson: Detection Is a Product, Not a Rule

### Why this lesson exists

Phase 4 taught you to write three Wazuh rules. That was a beginning, and it is not the same skill this phase teaches.

The difference is best shown with two rules that both work.

| | Rule A | Rule B |
|---|---|---|
| **What it does** | Fires when `powershell.exe` appears in a log | Fires when a non-administrative process spawns PowerShell with an encoded command line, on a host where PowerShell is not used by that user's role |
| **Rule text length** | One line | Six lines, including a filter |
| **Fires on** | Every PowerShell use, including the admin scripts that run hourly | Malicious and unusual use, plus a documented edge case |
| **Analyst experience** | Closes 400 alerts a week without reading them | Reads 6 alerts a week and investigates all of them |
| **Value** | Negative, eventually | Positive |

Both are “detections.” Only one is a product.

**This is the shift the phase makes.** A detection is something an analyst receives, at three in the morning, with fifty other alerts, and has to make a decision about. Everything you build has to survive that context.

That reframing produces the question that drives the whole phase:

> If this fires, what will the analyst do differently?

If the answer is “nothing, they will close it,” the rule is not a detection. It is noise with a name.

#### What you are actually building toward

The exit criterion names five things, and each is a separate skill.

| Requirement | What it means | Where this lesson covers it |
|---|---|---|
| **Take a behaviour** | Start from an attacker action, not from a log field | Part 1 |
| **Choose the log source** | Know which log records that behaviour, and what it misses | Part 2 |
| **Write the rule** | Selection logic, conditions, and filters | Part 4 |
| **Test it both ways** | Prove it fires on malicious activity *and* that you know what benign activity trips it | Part 5 |
| **Document why it is worth attention** | The justification, in writing, including its limits | Part 6 |

That fourth item is where beginners fail, and it is the most important one.

#### Time to complete

**Roughly 60–80 hours over 6 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 4–6 | Once, properly |
| Event log exploration on your own machines | 8–12 | Reading real logs beats reading about them |
| Sysmon installation and configuration | 4–6 | The single highest-value telemetry upgrade available for free |
| Writing rules in Sigma and your SIEM | 12–16 | The core work |
| Testing with Atomic Red Team | 8–10 | Safe, documented adversary simulation |
| Tuning and false-positive documentation | 8–10 | The part that makes you employable |
| Alert-fatigue analysis and write-up | 6–8 | Produces a real artefact |

#### What this phase is not

It is not a threat-hunting phase, though it feeds one. It is not a tool-certification phase — the concepts transfer across Splunk, Sentinel, Elastic, and Wazuh, and you will use whichever is free to you.

It is also not a phase about writing as many rules as possible. **A portfolio with five well-documented detections beats one with fifty undocumented ones**, and the reason is that the documentation is the skill.

### Part 1 — Start from behaviour, not from a log field

#### The beginner's method, and why it fails

Most beginners build detections backwards. They open a log, see a field, and ask *“what could I alert on here?”*

That method produces rules like “alert when a process named `cmd.exe` runs.” It is easy to write, it fires constantly, and it detects a legitimate administrative tool rather than an attack.

The professional method inverts the order.

| Step | Beginner's order | Detection engineer's order |
|---|---|---|
| 1 | Look at available log fields | Name the attacker behaviour you care about |
| 2 | Pick one that looks suspicious | Identify what that behaviour changes in the environment |
| 3 | Write a rule matching it | Find which log source records that change |
| 4 | Deploy | Write the narrowest rule that matches it |
| 5 | React to the volume | Test against both malicious and benign activity |
| 6 | — | Deploy with a documented false positive rate |

Steps 1 to 3 in the right-hand column are where the value is created. Writing the rule is comparatively mechanical once you know what you are looking for.

#### Where the behaviour comes from

You do not need to invent attacker behaviour. It is documented, in public, at a level of detail that would have been unimaginable twenty years ago.

| Source | What it gives you | Cost |
|---|---|---|
| **MITRE ATT&CK** | A structured catalogue of tactics and techniques, with real procedure examples and detection notes | Free |
| **Atomic Red Team** | Executable tests mapped to ATT&CK technique IDs | Free, open source |
| **SigmaHQ** | A large public repository of vendor-neutral detection rules | Free, open source |
| **The DFIR Report** | Full intrusion write-ups with the actual commands attackers ran | Free |
| **Vendor threat research** | Specific campaigns with indicators and behaviour descriptions | Free |
| **Your own incident notes** | The behaviour you actually saw | Free |

The two you should use first are **Atomic Red Team** for generating the behaviour safely and **SigmaHQ** for seeing how experienced engineers express it.

#### Worked example: from technique to detection

Take one ATT&CK technique and walk it all the way to a rule.

**T1059.001 — Command and Scripting Interpreter: PowerShell.**

| Question | Answer |
|---|---|
| What is the attacker trying to do? | Run code on the host using a tool that is already installed and trusted |
| What does that change in the environment? | A process is created, with a command line, by a parent process |
| Which log records it? | Sysmon Event ID 1, or Windows Security 4688 with command-line auditing enabled |
| What distinguishes malicious use? | Encoded commands, download cradles, unusual parents, no window, specific parameter combinations |
| What benign activity looks like this? | Software deployment tools, configuration management agents, administrative scripts, monitoring agents |
| What is the narrowest useful rule? | Encoded command line, **or** a download-cradle pattern, with a filter for the known management tools |

Notice that the last two rows are what make the rule usable, and that they are answered *before* a single line of rule logic is written.

```text
Detection hypothesis, written down before building anything:

  Behaviour   A process spawns powershell.exe with a base64-encoded
              command line, which is how a large share of initial
              access and lateral movement payloads execute.

  Log source  Sysmon Event ID 1 (process creation), command line
              included in the event.

  Why it is
  suspicious  Legitimate administrators rarely pass base64 on the
              command line. The pattern exists to hide what is
              being run from casual inspection.

  Benign      Software deployment and configuration management
  lookalikes  tools do use encoded commands. Two are known in my
              environment and will be filtered by parent process.

  Analyst     If this fires outside those two parents, treat it as
  action      a potential execution event: capture the decoded
              command line, the parent process, and the network
              connections in the following two minutes.
```

That block is a real deliverable. It is what a detection engineer writes before writing the rule, and in a mature team it is what gets reviewed.

#### The behaviour-to-log mapping

Once you are working from behaviour, you need to know where it lands. This table is the core reference for the phase.

| Behaviour | Primary log source | Event or field | Reliability |
|---|---|---|---|
| Successful interactive logon | Windows Security | 4624, logon type 2 or 10 | High |
| Successful network logon | Windows Security | 4624, logon type 3 | High, but very noisy |
| Failed logon | Windows Security | 4625, with a status sub-code | High |
| Explicit credential use | Windows Security | 4648 | High, rare, valuable |
| Special privileges assigned | Windows Security | 4672 | High, benign for administrators |
| Process created | Windows Security 4688, or Sysmon 1 | `NewProcessName`, `CommandLine` | Sysmon is far richer |
| Account created | Windows Security | 4720 | High |
| Account added to a privileged group | Windows Security | 4728, 4732, 4756 | High |
| Kerberos ticket requested | Windows Security | 4768, 4769 | High, high volume |
| Share accessed | Windows Security | 5140, 5145 | High, very high volume |
| Service installed | System log | 7045 | High, and a persistence favourite |
| Outbound network connection | Sysmon | 3 | High, high volume |
| Image or DLL loaded | Sysmon | 7 | High, extremely high volume |
| Remote thread created | Sysmon | 8 | Medium — noisy with some software |
| Process access | Sysmon | 10 | High for credential access |
| File created | Sysmon | 11 | High, high volume |
| Registry value set | Sysmon | 12 or 13 | High for persistence keys |
| DNS query | Sysmon | 22 | High, high volume but very useful |
| Command executed as root | Linux auditd | `execve` with `auid=0` or a sudo tag | Medium, depends on rules |
| SSH authentication | Linux | `/var/log/auth.log` | High |
| Cron job created | Linux | auditd file watch on `/etc/cron*` | High |
| Web request | Web server access log | Request line, status, user agent | High |
| Cloud API call | CloudTrail, Activity Log | `eventName`, `userIdentity` | High |

Read the **Reliability** column as a warning as much as a guide. A high-volume source is high-value and high-cost, and the cost is analyst attention.

### Part 2 — The log sources, in depth

#### Windows Security log: the events worth memorising

You do not need to memorise hundreds of event IDs. You need perhaps fifteen, and you need to understand them rather than recite them.

| Event ID | Name | What it records | Why it matters |
|---|---|---|---|
| **4624** | An account was successfully logged on | A logon, with a type and an authentication package | The baseline. Meaning depends entirely on the logon type |
| **4625** | An account failed to log on | A failed authentication, with a status sub-code | Password spraying, brute force, and misconfiguration |
| **4648** | A logon was attempted using explicit credentials | A process supplied credentials different from the current user's | RunAs, lateral movement, and scheduled tasks with stored credentials |
| **4672** | Special privileges assigned to new logon | Administrative privileges granted at logon | Benign for administrators, notable for a service account |
| **4688** | A new process has been created | Process creation, with command line **if enabled** | The core execution telemetry, and far weaker than Sysmon |
| **4720** | A user account was created | New account | Persistence and insider activity |
| **4726** | A user account was deleted | Account removal | Anti-forensics, or legitimate offboarding |
| **4728** | A member was added to a security-enabled global group | Group membership change | Domain Admins addition is a critical alert |
| **4732** | A member was added to a security-enabled local group | Local group change | Local Administrators addition is a privilege escalation |
| **4740** | A user account was locked out | Lockout event | Lockout storms, and a side effect of spraying |
| **4768** | A Kerberos authentication ticket was requested | TGT request | Kerberoasting reconnaissance patterns |
| **4769** | A Kerberos service ticket was requested | Service ticket request | Kerberoasting, and encryption downgrade attacks |
| **4776** | The computer attempted to validate credentials | NTLM authentication | NTLM relay and downgrade activity |
| **5140** | A network share object was accessed | Share access | Lateral movement and data collection |
| **7045** | A service was installed in the system | New service, in the **System** log | A classic persistence mechanism |

Two details in that table are worth more than the table itself.

**Event 4688 does not contain a command line by default.** Command-line auditing has to be enabled, by policy locally or by Group Policy in a domain. This is a very common reason a detection does not fire on a system where someone assumed it would.

**Event 7045 lives in the System log, not the Security log.** Analysts hunting for persistence in the Security log alone miss it entirely.

#### Logon types, and why 4624 is not one event

Event 4624 is the most misinterpreted event in Windows logging, because it records very different things under one ID.

| Logon type | Name | What produced it | Security reading |
|---|---|---|---|
| **2** | Interactive | A user at the keyboard or console | A person was physically present, or RDP at the console |
| **3** | Network | A connection to a share, a named pipe, or IIS with Windows auth | Extremely common and usually benign — but it is also how lateral movement authenticates |
| **4** | Batch | A scheduled task | Non-interactive automation |
| **5** | Service | A service starting under an account | Expected for service accounts |
| **7** | Unlock | A workstation unlocked | Benign |
| **8** | NetworkCleartext | Credentials sent in the clear | Rare and notable |
| **9** | NewCredentials | `runas /netonly` | Used legitimately by administrators and by attackers |
| **10** | RemoteInteractive | RDP | A person logged in remotely — the one to watch when it comes from an unexpected source |
| **11** | CachedInteractive | Logon with cached domain credentials | A domain controller was unreachable, or the host is off-network |

The rule of thumb: **type 2 and type 10 mean a human, type 3 means a connection, type 5 means a service.** A type 10 logon to a workstation from an address that has never connected before is a genuine finding. A type 3 logon from a server to a file share is Tuesday.

#### 4625 sub-codes: the failure that tells you the attack

Failed logons have a status code, and the code distinguishes attacks that otherwise look identical.

| Sub-status | Meaning | Typical cause |
|---|---|---|
| `0xC0000064` | User name does not exist | Enumeration with guessed names |
| `0xC000006A` | User name is correct, password is wrong | Password guessing against a known account |
| `0xC000006D` | Bad user name or password, generic | The generic failure |
| `0xC000006E` | Account restriction | Logon hours, workstation restriction, or an empty password |
| `0xC000006F` | Outside logon hours | Time-based policy |
| `0xC0000070` | Workstation restriction | Policy blocking this source |
| `0xC0000071` | Password expired | Expired credential |
| `0xC0000072` | Account disabled | Locked or disabled account |
| `0xC000015B` | Logon type not granted | The account lacks the required right, such as for a service |

**The pattern that matters most:** many `0xC0000064` events followed by a `0xC000006A`, or a success, indicates enumeration followed by a targeted guess. Many `0xC000006A` events across many accounts indicates spraying.

The distinction changes the response. Enumeration suggests an automated tool. Spraying suggests a patient attacker who knows the lockout threshold and is staying below it.

#### Sysmon: what it adds, and why it is the free upgrade that matters

Sysmon is a Microsoft Sysinternals tool that adds rich telemetry to the Windows event log. It is free, it is signed by Microsoft, and it fills gaps that the default Security log leaves open.

| Sysmon event ID | What it records | Detection value |
|---|---|---|
| **1** | Process creation, with full command line and hashes | The highest-value event in the set |
| **2** | A process changed a file creation time | Timestomping, which is anti-forensics |
| **3** | Network connection, with process attribution | Which process talked to which address |
| **4** | Sysmon service state changed | Someone stopped your telemetry |
| **5** | Process terminated | Timeline completion |
| **6** | Driver loaded | Vulnerable driver abuse, kernel malware |
| **7** | Image loaded, with signature status | DLL side-loading and unsigned module loading |
| **8** | CreateRemoteThread | Process injection |
| **10** | ProcessAccess | Credential dumping, for example against `lsass.exe` |
| **11** | FileCreate | Dropped files, including in startup locations |
| **12 / 13 / 14** | Registry object added, value set, key renamed | Run-key persistence, and disabling security tools |
| **15** | FileCreateStreamHash | Mark-of-the-Web on downloaded files |
| **17 / 18** | Pipe created, pipe connected | Named-pipe lateral movement and C2 |
| **22** | DNS query | Which names the host resolved, directly from the endpoint |
| **23 / 26** | File delete, file delete logged | Anti-forensics and clean-up |

Three of these deserve a sentence each because they are frequently misunderstood.

**Event ID 1 is the one that matters most**, and its power is the command line. Windows Security 4688 gives you a process name; Sysmon 1 gives you the entire command line as typed. A process name tells you `powershell.exe` ran. A command line tells you it ran `-EncodedCommand SQBFAFgA...`, which is a different conversation.

**Event ID 10 is noisy and indispensable.** It records one process opening another with specific access rights. Legitimate software triggers it constantly, so it needs a filter. But a process requesting `lsass.exe` with `0x1010` or `0x1410` access rights is the signature of credential dumping, and almost nothing legitimate does that.

**Event ID 22 gives you endpoint DNS visibility without a network sensor.** When a host resolves a domain that no other host in the estate resolves, and it does so on a fixed schedule, you are looking at beaconing.

**Sysmon does not install itself with a sensible configuration.** The default configuration is close to useless. You install a community configuration — SwiftOnSecurity's or Olaf Hartong's — and you read it before you deploy it. The configuration *is* the detection engineering, and it is why "I installed Sysmon" is a much weaker statement than "I deployed Sysmon with a configuration that captures process creation, network connections, and image loads, and I modified it to reduce noise from two applications."

```powershell
# Install Sysmon with a community configuration, from an elevated prompt.
# Read the configuration file before you run this.
sysmon64.exe -accepteula -i sysmonconfig-export.xml

# Confirm it is running and check which events it is producing.
Get-Service Sysmon64
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" -MaxEvents 20 |
  Select-Object TimeCreated, Id, Message | Format-List
```

#### Linux: auditd, auth.log, and syslog

Linux telemetry is different in shape and equally valuable.

| Source | What it records | How you read it |
|---|---|---|
| `/var/log/auth.log` or `/var/log/secure` | Authentication, sudo, SSH, su | Plain text, one event per line |
| `auditd` with `auditctl` rules | Syscalls and file watches, configurable in detail | `ausearch` and `aureport` |
| `journald` | Systemd service logs, kernel messages | `journalctl` with filters |
| `/var/log/syslog` or `/var/log/messages` | General system messages | Plain text |
| `/etc/passwd` and `/etc/shadow` access | Account changes | Via auditd file watches |
| Cron | Scheduled job definitions and execution | `/var/log/cron` or journald |

The auditd rules worth writing first, because they cover the persistence and privilege-escalation behaviours that matter:

```bash
# Watch account files for any change.
-w /etc/passwd -p wa -k identity_change
-w /etc/shadow -p wa -k identity_change
-w /etc/sudoers -p wa -k privilege_change

# Watch all cron locations, which are a persistence favourite.
-w /etc/cron.d/ -p wa -k cron_persistence
-w /etc/crontab -p wa -k cron_persistence

# Record every command executed by a privileged user.
-a always,exit -F arch=b64 -S execve -F auid>=1000 -F auid!=-1 -k command_exec

# Watch SSH key material, which is quietly a persistence mechanism.
-w /root/.ssh/ -p wa -k ssh_key_change
```

The `-k` value is a **key**, and it is how you find the records afterwards. That naming discipline is the Linux equivalent of a detection rule ID.

```bash
# Search the audit log for one of those keys, over a time window.
ausearch -k cron_persistence -ts recent

# Human-readable interpretation of a raw audit record.
ausearch -k identity_change -i --start today

# Summary of the most frequent audit keys, which shows what is noisy.
aureport --key --summary
```

That last command is the tuning tool. `aureport --key --summary` shows which of your watches generates the most records, which tells you which one is about to become an alert-fatigue problem.

#### Reading a real auth log

```text
Mar 11 04:52:11 web-01 sshd[21483]: Failed password for invalid user admin from 203.0.113.44 port 51234 ssh2
Mar 11 04:52:12 web-01 sshd[21483]: Invalid user oracle from 203.0.113.44 port 51240 ssh2
Mar 11 04:52:13 web-01 sshd[21483]: Failed password for invalid user postgres from 203.0.113.44 port 51248 ssh2
Mar 11 04:52:14 web-01 sshd[21483]: Failed password for root from 203.0.113.44 port 51256 ssh2
Mar 11 04:52:15 web-01 sshd[21483]: Accepted publickey for deploy from 203.0.113.44 port 51264 ssh2: RSA SHA256:9xK...
```

| Line | Reading |
|---|---|
| 1 | A guess against a username that does not exist — enumeration |
| 2 | Another guessed name, `oracle` — this is a dictionary of service accounts |
| 3 | A third guessed name, `postgres` — a database service account, a common target |
| 4 | A guess against `root` — the attacker working down a list |
| 5 | **An accepted login from the same address, one second later** |

Line 5 is the detection. The first four lines are noise that a volume-based rule would catch; the fifth line is the one that says an attacker got in. A rule that counts failures catches the noise. A rule that correlates a success **from an address that just produced failures** catches the breach.

That single correlation is worth more than every volume-based alert in the log.

#### Syslog severity, and why it is a trap

Syslog has both a facility and a severity, and the severity numbers run the opposite way to intuition.

| Severity number | Name | Meaning |
|---|---|---|
| 0 | Emergency | System is unusable |
| 1 | Alert | Action must be taken immediately |
| 2 | Critical | Critical condition |
| 3 | Error | Error condition |
| 4 | Warning | Warning condition |
| 5 | Notice | Normal but significant |
| 6 | Informational | Informational |
| 7 | Debug | Debug-level |

**Lower number means more severe**, which is the opposite of most systems. A rule that filters for "severity greater than 4" is looking for *less* urgent messages.

The trap in practice: many applications log authentication failures at `notice` (5) or even `info` (6), so a detection that filters on severity misses them entirely. This is a common reason a rule works in a lab and does not fire in production.

### Part 3 — What makes a good detection

#### The five properties

Before writing rules, it is worth agreeing on what "good" means, because "it fires on the attack" is only one of five requirements.

| Property | Question it answers | How you prove it |
|---|---|---|
| **Accurate** | Does it fire when the behaviour happens? | Run the behaviour and watch the rule fire |
| **Specific** | Does it stay silent when benign activity happens? | Run the benign lookalikes and watch it not fire |
| **Actionable** | Does the alert tell the analyst what to do? | Write the analyst action before you deploy |
| **Attributable** | Does it name the host, user, and process involved? | Check the alert output contains enough to pivot |
| **Maintainable** | Can someone else understand and change it? | Someone else reads it and can edit it |

The fourth one is the one that surprises people. A detection that fires correctly but does not tell the analyst *which host, which user, which process* is a detection that costs more time than it saves, because the analyst has to go hunting for context the rule already had.

#### Fidelity versus coverage, and the real trade

These two pull in opposite directions, and pretending otherwise is the most common mistake in the field.

| Approach | Effect on false positives | Effect on missed attacks | Analyst experience |
|---|---|---|---|
| **Broad rule** — matches a technique generally | Many | Few missed | Drowning |
| **Narrow rule** — matches one specific procedure | Few | Many missed | Comfortable, and blindsided |
| **Layered rules** — several narrow rules covering a technique's common procedures | Controlled | Fewer missed, deliberately | Manageable, with known gaps |

The third row is the professional answer, and it requires honesty about the gaps rather than a claim of complete coverage.

**Write the gap down.** A detection document that says "this rule does not cover PowerShell that is not encoded, which is a known limitation" is more valuable than one that implies complete coverage, because the first tells the next engineer where to build.

#### Alert fatigue, with numbers

Alert fatigue is usually discussed as a feeling. It is much more useful as arithmetic.

| Scenario | Alerts per day | Per analyst | Minutes each | Analyst hours per day | Result |
|---|---|---|---|---|---|
| A small estate with 3 broad rules | 900 | 900 | 1 | 15 | Analysts triage by title and close without reading |
| The same estate, after tuning | 40 | 40 | 6 | 4 | Real investigation is possible |
| An estate with 500 untuned rules | 6,000 | 1,500 | 1 | 25 | The queue never clears; nobody reads anything |
| A tuned estate with coverage gaps documented | 60 | 60 | 8 | 8 | Full shift, but every alert is examined |

The second and fourth rows are what good detection engineering produces. The third is what happens when a team measures success by rule count.

**The arithmetic has a consequence worth stating plainly.** Once alerts per analyst per day exceed the available hours, the queue can only be cleared by not reading. At that point, adding rules makes the organisation *less* secure, because it dilutes the rules that worked.

This is why the phase's exit criterion includes the words *why it will not drown the analyst who receives it*. It is not a courtesy requirement. It is the technical bar.

#### The detection hypothesis

Every rule should start with a written hypothesis, and the hypothesis has four parts.

```text
Hypothesis template

  Behaviour   What the attacker does, in one sentence, in plain language.

  Signal      What that behaviour changes in the environment — a process,
              a file, a registry key, a network connection, an API call.

  Source      Which log records that signal, including which fields
              carry the specifics.

  Falsifier   What benign activity would produce the same signal.
              If you cannot name one, you have not thought about it yet.
```

The **falsifier** is the part beginners omit and reviewers look for first. Naming what would make your rule fire wrongly is proof that you understand the environment rather than the tool.

#### Worked example: a hypothesis for one behaviour

**ATT&CK T1543.003 — Create or Modify System Process: Windows Service.**

```text
Behaviour   An attacker installs a new Windows service to run their
            payload at every boot, which is a durable persistence
            mechanism and a common post-exploitation step.

Signal      A new service is registered on the host. The service has a
            binary path, a start type, and an account it runs as.
            Attackers often use a binary in a user-writable path, a
            random-looking service name, or a path with a space that
            is not quoted.

Source      Windows System log, event ID 7045. Fields: ServiceName,
            ImagePath, ServiceType, StartType, AccountName.

Falsifier   Legitimate software installers create services constantly:
            endpoint agents, backup software, management tools,
            monitoring agents. On a managed estate this is the
            dominant source of 7045 events.

Analyst     On alert: read ImagePath. If it points into C:\Users\,
action      C:\ProgramData\, C:\Temp\, or another user-writable
            location, escalate immediately and isolate. If it points
            into Program Files with a valid signature, check the
            change record and close.
```

Notice that the analyst action is already phrased as a decision with two branches. That is what makes an alert triageable in two minutes instead of twenty.

And notice that the falsifier dictates the rule's filter: legitimate installers. That link — from falsifier to filter — is the whole craft in one step.

### Part 4 — Writing rules

#### Anatomy of a Sigma rule

Sigma is a vendor-neutral rule format. You write one rule and convert it to Splunk SPL, Microsoft Sentinel KQL, Elastic DSL, or a Wazuh rule. It is the closest thing the field has to a standard, and it is free.

```yaml
title: Encoded PowerShell Command Execution
id: 8f2a1c40-1234-4b7e-9d10-0a1b2c3d4e5f
status: experimental
description: Detects PowerShell executed with a base64-encoded command line,
  a technique commonly used to obscure payloads during execution.
references:
  - https://attack.mitre.org/techniques/T1059/001/
author: Your Name
date: 2026/03/11
tags:
  - attack.execution
  - attack.t1059.001
logsource:
  category: process_creation
  product: windows
detection:
  selection_img:
    - Image|endswith: '\powershell.exe'
    - Image|endswith: '\pwsh.exe'
  selection_flags:
    CommandLine|contains:
      - ' -enc '
      - ' -encodedcommand '
      - ' -e '
  filter_management:
    ParentImage|endswith:
      - '\SCCMExec.exe'
      - '\msiexec.exe'
  condition: selection_img and selection_flags and not filter_management
falsepositives:
  - Software deployment tools that use encoded commands
  - Configuration management agents
level: high
```

Every part of that file is doing a job, and reading it is the fastest way to learn the format.

| Section | Purpose | What beginners get wrong |
|---|---|---|
| `title` and `id` | Identification and a stable identifier | Using a title so vague it could match five rules |
| `description` | What the rule detects, in plain language | Restating the title instead of explaining the behaviour |
| `references` | Where the behaviour is documented | Omitting it, which makes the rule unauditable |
| `tags` | ATT&CK mapping | Tagging a tactic as though it were a technique |
| `logsource` | Which log the rule expects | Omitting it, so the rule cannot be converted |
| `detection` | The matching logic | Putting everything in one selection with no filter |
| `falsepositives` | Known benign sources | Writing "unknown", which means "uninvestigated" |
| `level` | Severity hint | Setting everything to `critical` |

**The `falsepositives` field is the honesty test of the whole rule.** A rule with `falsepositives: Unknown` is a rule nobody has run against real data, and experienced engineers read that field before they read the detection logic.

#### The conversion: Sigma to platform query

The same rule, expressed in three platforms.

```text
Splunk SPL
------------
index=windows source="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational"
  EventCode=1
  (Image="*\\powershell.exe" OR Image="*\\pwsh.exe")
  (CommandLine="* -enc *" OR CommandLine="* -encodedcommand *" OR CommandLine="* -e *")
  NOT (ParentImage="*\\SCCMExec.exe" OR ParentImage="*\\msiexec.exe")
| table _time, host, User, ParentImage, Image, CommandLine
```

```text
Microsoft Sentinel KQL
-----------------------
DeviceProcessEvents
| where FileName in~ ("powershell.exe", "pwsh.exe")
| where ProcessCommandLine has_any (" -enc ", " -encodedcommand ")
| where InitiatingProcessFileName !in~ ("SCCMExec.exe", "msiexec.exe")
| project Timestamp, DeviceName, AccountName, InitiatingProcessFileName,
          FileName, ProcessCommandLine
```

```xml
<!-- Wazuh rule, matching the same behaviour in the Sysmon decoder -->
<group name="windows,sysmon,detection,">
  <rule id="100310" level="12">
    <if_sid>61603</if_sid>
    <field name="win.eventdata.image">powershell\.exe$</field>
    <field name="win.eventdata.commandLine">-enc|encodedcommand</field>
    <field name="win.eventdata.parentImage">SCCMExec\.exe$|msiexec\.exe$</field>
    <description>Encoded PowerShell execution outside known management tools</description>
    <mitre>
      <id>T1059.001</id>
    </mitre>
  </rule>
</group>
```

The three are structurally identical: select the image, select the flags, exclude the known-benign parents. That is the point of learning the logic rather than the syntax.

| Platform | Strengths | Trade-off |
|---|---|---|
| **Sigma** | Portable, readable, version-controlled, community-reviewed | Needs a converter; not executable on its own |
| **Splunk SPL** | Extremely expressive, huge community | Licensing cost at scale; SPL is not portable |
| **Sentinel KQL** | Clean syntax, integrates with Microsoft estate | Azure dependency; ingestion cost |
| **Wazuh rules** | Free and open source, XML, integrates with decoders | Less expressive; the rule language is idiosyncratic |
| **Elastic EQL / DSL** | Powerful sequence matching, open source | Steeper learning curve, JSON-heavy |

**The practical route for a learner on $0:** write in Sigma, keep the rules in a Git repository, and convert them into Wazuh rules for your lab. You demonstrate portability, version control, and a working SIEM in one artefact.

#### Sequence detection: when one event is not enough

Single-event rules catch single events. Many real attacks are a *sequence*, and the sequence is what makes them detectable.

| Sequence | Events | What the sequence means |
|---|---|---|
| Spraying | Many 4625 across many accounts, then one 4624 | Guessing succeeded |
| Successful breach after failures | Several 4625 from one address, then a 4624 from the same address | The login is not a coincidence |
| Credential dumping | Sysmon 10 against `lsass.exe`, then Sysmon 11 writing a `.dmp` file | Access then exfiltration of the dump |
| Persistence | 4720 creating an account, then 4728 adding it to a privileged group | Account creation with escalation |
| Lateral movement | 4648 explicit credentials, then a type 3 logon from the same source | Credential use followed by a remote connection |

Sequence rules are far more specific than single-event rules, which means far fewer false positives — and they are harder to write, which is why they are valuable.

```text
Sentinel KQL — the classic spray-then-success correlation.

let window = 15m;
let failures =
  SecurityEvent
  | where EventID == 4625
  | summarize FailCount = count(), Accounts = dcount(TargetUserName)
      by IpAddress, bin(TimeGenerated, window)
  | where FailCount >= 10 and Accounts >= 5;
let successes =
  SecurityEvent
  | where EventID == 4624 and LogonType in (3, 10)
  | project TimeGenerated, IpAddress, TargetUserName, LogonType;
failures
| join kind=inner successes on IpAddress
| where TimeGenerated between (TimeGenerated - window .. TimeGenerated + window)
| project TimeGenerated, IpAddress, TargetUserName, FailCount, Accounts, LogonType
```

That query answers a question no single-event rule can: *did a burst of failures from this address get followed by a success?* It is the detection that catches a real breach rather than the noise around it.

#### Rules that are worth writing first

If you are building a detection library from nothing, this is a reasonable order, and each one teaches a different skill.

| Order | Detection | Event | Skill it teaches |
|---|---|---|---|
| 1 | Service installed from a user-writable path | System 7045 | Filtering by path rather than by name |
| 2 | Account added to a privileged group | Security 4728 / 4732 | Correlating two events |
| 3 | Encoded PowerShell outside known tools | Sysmon 1 | Parent-process filtering |
| 4 | Credential dumping shape | Sysmon 10 | Access-rights reasoning, and heavy tuning |
| 5 | New cron job or scheduled task | auditd file watch, Security 4698 | Cross-platform thinking |
| 6 | Successful login after failures | 4625 plus 4624 | Sequence detection |
| 7 | Security tool or logging disabled | Sysmon 4, CloudTrail `StopLogging` | Detecting the defence being removed |
| 8 | DNS query to a newly registered domain | Sysmon 22, or DNS logs | Enrichment and allowlisting |

Rule 7 is the one that separates a detection library from a list of alerts. **An attacker's first move against a monitored environment is usually to stop the monitoring**, and a library with no rule for that has a hole at the exact point that matters.

### Part 5 — Testing, tuning, and false positives

#### Test both directions, or you have not tested

A rule has two failure modes, and testing only one of them is the field's most common shortcut.

| Test | What you do | What failure looks like |
|---|---|---|
| **True positive test** | Run the malicious behaviour and confirm the rule fires | The rule is broken; you have coverage you do not have |
| **False positive test** | Run the benign lookalikes and confirm the rule stays silent | The rule is noise; you have a queue problem you do not know about |

The second test is the one people skip, and it is the one that determines whether the rule survives contact with a real environment.

#### Atomic Red Team: generating the behaviour safely

Atomic Red Team is an open-source library of small, documented tests mapped to ATT&CK technique IDs. Each atomic test is a YAML file describing how to run it and how to clean up.

```powershell
# Install the Atomic Red Team execution framework on an isolated lab VM only.
IEX (IWR 'https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/master/install-atomicredteam.ps1' -UseBasicParsing)
Install-AtomicRedTeam -getAtomics

# List the atomic tests for one technique, without running anything.
Invoke-AtomicTest T1543.003 -ShowDetailsBrief

# Run one test.
Invoke-AtomicTest T1543.003 -TestNumbers 1

# Clean up after the test, which also tests your rule's noise profile.
Invoke-AtomicTest T1543.003 -TestNumbers 1 -Cleanup
```

**Run these only inside an isolated lab VM with no route to anything real.** They execute actual attacker techniques. Running an atomic test on a work machine, a shared network, or anything attached to a production account is exactly the boundary Phase 1 described, and the consequences are identical whether or not you intended harm.

The cleanup step is not optional. It resets the host, and it also tells you whether your detection fires on the clean-up — which is itself a false positive test.

#### Writing the test record

The test record is what turns "I wrote a rule" into "I built and validated a detection." It is a table, and it is the centrepiece of the phase's deliverable.

```text
Detection test record

  Rule ID        DET-003
  Title          Encoded PowerShell outside known management tools
  ATT&CK         T1059.001

  True positive test
    Command      Invoke-AtomicTest T1059.001 -TestNumbers 1
    Result       Rule fired 4 seconds after execution
    Alert fields Host: LAB-WIN10  User: LAB\analyst
                 Parent: explorer.exe  CmdLine: powershell -enc SQBFAFgA...
    Verdict      Pass

  False positive test 1
    Activity     SCCM software deployment of a packaged application
    Result       Rule did not fire (filter matched ParentImage SCCMExec.exe)
    Verdict      Pass

  False positive test 2
    Activity     A scheduled administrative script using -EncodedCommand
                 for a legitimate reason, run from Task Scheduler
    Result       Rule FIRED — ParentImage was taskeng.exe, not filtered
    Verdict      Fail — new filter required

  Tuning applied
    Added Task Scheduler parent paths to the filter, after confirming with
    the administrator that the scheduled script is approved and recurring.

  Re-test
    False positive test 2 re-run: rule did not fire. Pass.
    True positive test re-run: rule still fired. Pass.
```

That record contains a **failed test and a fix**, and that is precisely why it is credible. A test record where everything passes on the first attempt describes a rule that was never tested against a real environment.

#### The four honest tuning options

When a rule is noisy, there are four things you can do, and they have very different consequences.

| Option | What you do | Cost |
|---|---|---|
| **Narrow the detection** | Add a more specific condition, so fewer events match | You may miss variants of the behaviour |
| **Add a filter** | Exclude a known-benign source | You create a blind spot for that source, permanently |
| **Lower the severity** | Keep the detection, reduce the alert priority | The alert still consumes queue space |
| **Disable the rule** | Turn it off | You lose the coverage entirely, and nobody documents why |

The trap is the second option, because it is the easiest and it silently creates a hole.

**Consider a concrete case.** Your rule fires 200 times a day because a backup product opens `lsass.exe`. You add a filter on the backup product's process name. That is a reasonable tuning decision.

Six months later, an attacker uses the same access pattern from a renamed binary impersonating the backup product. Your filter is now a documented bypass, and nobody remembers it exists.

| Tuning the filter properly | Tuning it badly |
|---|---|
| Filter on the parent process **and** the target process **and** the allowed time window | Filter on the process name alone |
| Record the filter in the rule's `falsepositives` field with a date and a reason | Add the exclusion with no comment |
| Add a separate low-severity rule that alerts on *any* process accessing `lsass.exe`, as a safety net | Remove the detection value entirely |
| Review the filter at least twice a year | Never look at it again |

The third row is the professional move. You accept the noisy rule at low severity so that the filter is never a complete blind spot. It costs queue space and it buys back the coverage you gave away.

#### Documenting a false positive, with a template

```text
False positive record

  Rule          DET-005 — Process access to lsass.exe
  Date          2026-03-14
  Frequency     180–220 alerts per day

  Benign source  Backup agent "AcmeBackup" (AcmeBackupSvc.exe),
                 which reads process memory of lsass.exe as part of its
                 application-consistent backup feature.

  Evidence      180 matching Sysmon Event ID 10 records in 24 hours,
                 all with SourceImage ending AcmeBackupSvc.exe, all with
                 the same GrantedAccess value, clustered at 02:00.

  Decision       Filter on SourceImage ending AcmeBackupSvc.exe AND
                 GrantedAccess 0x1410 AND the 01:30–02:30 window.
                 Keep a companion rule at level 3 for any lsass access
                 outside that filter.

  Risk accepted  An attacker who can run a binary named AcmeBackupSvc.exe
                 from the same path during the backup window would be
                 missed by the primary rule and caught only by the
                 low-severity companion.

  Review date    2026-09-14
```

The **Risk accepted** field is the one that makes this document matter. It states the bypass you have created, in writing, so that a future engineer can find it.

#### Worked example: the rule that was right and useless

A learner writes a rule for T1110, brute force: alert when more than five failed logons occur for one account within five minutes.

**The test results:**

| Test | Result |
|---|---|
| True positive: 20 failed RDP attempts | Fired. Correct. |
| False positive: a user with an expired cached password, retrying | Fired — one alert |
| False positive: a mobile device with a stale saved password | Fired — repeatedly, every 15 minutes, all night |
| False positive: a misconfigured monitoring agent | Fired — 400 alerts in one night across 12 hosts |
| Volume in a small estate | 600 alerts per day |

The rule is *correct*. It detects brute force accurately. And it produced 600 alerts a day in an environment where brute force was not happening.

| Reading of the situation | Response |
|---|---|
| "The rule is correct, the environment is noisy" | No change. The queue becomes unworkable |
| "Raise the threshold to 50 failures" | Fewer alerts, and a slow brute-force attack now slips through |
| "Correlate instead of counting" | Alert only when failures are followed by a **success** from the same source |
| "Add a companion rule" | Keep the count rule at low severity for visibility, add the correlation rule at high severity |

The third and fourth options are the right answer, and they are what a detection engineer adds that a beginner does not.

**The lesson:** a threshold is a guess about your environment. Changing the threshold is not tuning — it is moving the guess. The real fix is to detect the thing you actually care about, which in this case is not the failures. It is the success that follows them.

### Part 6 — The detection lifecycle

#### Six stages, and the one nobody plans for

A detection is not a permanent asset. It has a life, and most detections die of neglect rather than being retired deliberately.

| Stage | What happens | The artefact you produce |
|---|---|---|
| **1. Hypothesis** | Someone identifies a behaviour worth detecting | The written hypothesis |
| **2. Build** | The rule is written and tested locally | The rule file, in version control |
| **3. Deploy** | The rule runs against production data | A tuning period, with the volume tracked |
| **4. Tune** | False positives are analysed and handled | The false positive record with a review date |
| **5. Operate** | The rule fires, analysts act on it | Triage notes that feed back into improvement |
| **6. Retire** | The rule stops being useful | A written reason, and the coverage gap it leaves |

**Stage 6 is the one that never happens**, and the consequence is a detection library that grows forever. Rules accumulate for behaviours that no longer exist, on systems that were decommissioned, generating alerts nobody can justify.

A retirement decision is legitimate for several reasons, and each deserves recording:

| Reason to retire | Why it is legitimate |
|---|---|
| The behaviour is no longer possible | The vulnerable software was removed, or the protocol was disabled |
| A better rule supersedes it | Two rules for one behaviour doubles the noise |
| The false positive rate cannot be reduced | The signal is genuinely ambiguous in this environment |
| The underlying log source was removed | Sometimes for licensing or performance reasons, which is itself a finding |
| The rule has never fired in twelve months | Either the control works, or the rule is broken — find out which |

That last row is worth a task in itself. **A rule that has never fired is an unanswered question**, and answering it is how you find the rule that was broken on the day it was deployed.

#### Mapping to MITRE ATT&CK, honestly

ATT&CK is a catalogue of adversary tactics and techniques. It is free, it is widely used, and it is widely misused.

| Layer | What it is | Example |
|---|---|---|
| **Tactic** | The attacker's goal — the *why* | Execution, Persistence, Credential Access |
| **Technique** | *How* they achieve the goal | T1059 Command and Scripting Interpreter |
| **Sub-technique** | A specific variant | T1059.001 PowerShell |
| **Procedure** | The specific implementation an actor used | `powershell.exe -enc <base64>` in a macro |

**The single most common mapping error is tagging a rule to a tactic instead of a technique.** A rule that detects encoded PowerShell is tagged `attack.t1059.001`, not `attack.execution`. The tactic is one of fourteen broad categories, and tagging to it tells a reader nothing.

The second error is claiming coverage you do not have.

| Dishonest mapping | Honest mapping |
|---|---|
| "We detect T1059.001" | "We detect T1059.001 via the encoded-command procedure. Non-encoded PowerShell is not covered by this rule and is covered only by process-creation logging." |
| "T1059 — covered" | "T1059 partially covered by one sub-technique. T1059.003 (Windows Command Shell) is not covered." |
| A coverage heat map with no caveats | A heat map with a documented list of the gaps behind each covered cell |

The honest version is far more useful and is what an experienced interviewer wants to hear. A candidate who says "I detect everything" is a candidate who has not looked.

#### Worked example: a coverage map you can defend

Here is ATT&CK coverage for a small detection library of eight rules, written the honest way.

| Tactic | Technique | Sub-technique | Rule | Coverage | Known gap |
|---|---|---|---|---|---|
| Initial Access | T1566 Phishing | .001 Attachment | — | **None** | No email gateway feed into the SIEM |
| Execution | T1059 | .001 PowerShell | DET-003 | Partial | Encoded only; plain PowerShell not covered |
| Execution | T1059 | .003 Windows Command Shell | — | **None** | Planned, low priority |
| Persistence | T1543 | .003 Windows Service | DET-001 | **Good** | Signature checks not yet implemented |
| Persistence | T1053 | .005 Scheduled Task | DET-006 | Partial | Linux cron covered; Windows tasks partial |
| Persistence | T1136 | .001 Local Account | DET-002 | **Good** | Requires correlation with the group-change rule |
| Privilege Escalation | T1098 | .001 Account Manipulation | DET-002 | **Good** | — |
| Credential Access | T1003 | .001 LSASS Memory | DET-004 | Partial | Heavily filtered; a documented bypass exists |
| Discovery | T1087 | .001 Account Discovery | — | **None** | Not detected |
| Command and Control | T1071 | .001 Web Protocols | DET-008 | Partial | DNS-based only |
| Exfiltration | T1041 | — | — | **None** | No egress anomaly baseline |

That table is defensible in an interview, and it demonstrates more competence than a claim of full coverage. Four explicit gaps, two of them marked as planned and two as genuinely unaddressed, is what a real programme looks like.

**Note the "no egress baseline" row.** It is the gap that hurts most in real incidents and it is honest to say so. Volume-baselining is a real project, and pretending it is done is worse than admitting it is not.

### Part 7 — Running detections without burning out

#### The weekly discipline

Detection engineering fails in a predictable way: rules are written in a burst, then never revisited. A weekly cadence prevents it.

| Activity | Frequency | Time | Output |
|---|---|---|---|
| Review the week's alerts by rule | Weekly | 45 min | The noisiest three rules, named |
| Pick the worst one and investigate it | Weekly | 60 min | A false positive record, or a tuning change |
| Add one new detection | Weekly | 90 min | One rule, tested both directions |
| Re-test one existing rule | Monthly | 30 min | Confirmation the rule still fires |
| Review the coverage map | Quarterly | 60 min | Updated gaps and priorities |
| Retire one rule, or justify keeping it | Quarterly | 30 min | A written decision |

The **re-test one existing rule** line deserves a note. Rules break silently: a log source is renamed, a configuration changes, an agent is upgraded and the event format shifts. A rule that stopped working produces no alerts, which is indistinguishable from a rule that is working perfectly and finding nothing.

**That indistinguishability is the field's central operational hazard**, and scheduled re-testing is the only defence against it.

#### What to do when a rule fires

A detection engineer's job does not end at deployment. The alerts are the feedback loop, and they are the source of the next improvement.

| What the analyst reports | What the engineer does |
|---|---|
| "This is a false positive" | Write the record, tune the filter, add a companion rule |
| "I could not tell what to do next" | Add an analyst action to the rule documentation |
| "The alert did not name the host" | Add the missing field to the alert output |
| "This fired 200 times" | Volume analysis; the rule needs narrowing or a sequence condition |
| "This would have been useful last month" | Note the log source gap and whether it can be filled |
| "I could not find the raw event" | Add a link or a query to the alert |

The last one is worth building early. An alert that takes four minutes of navigation to reach the raw event costs an analyst four minutes on every single occurrence.

#### The detection document

Each rule should have a companion document, and the document is often more valuable than the rule.

```text
DET-003 — Encoded PowerShell Outside Known Management Tools

  Rule file      sigma/encoded_powershell.yml
  Status         Production
  Level          High
  ATT&CK         T1059.001
  Author / date  Your Name, 2026-03-11
  Last reviewed  2026-03-14

  What it detects
    PowerShell invoked with a base64-encoded command line by a parent
    process that is not a known software deployment or configuration
    management tool.

  Why it matters
    Encoded command lines are used to hide payloads from casual
    inspection. A large share of initial access and lateral movement
    payloads execute this way.

  Log source and prerequisites
    Sysmon Event ID 1, with command-line capture enabled.
    Requires Sysmon to be deployed and running. If the Sysmon service
    is stopped, this rule produces nothing — see DET-007.

  False positives and filters
    Filtered parents: SCCMExec.exe, msiexec.exe, taskeng.exe.
    See the false positive record for 2026-03-14, including the risk
    accepted and the companion rule.

  Analyst action
    1. Decode the command line: [Convert]::FromBase64String()
    2. Capture the parent process and its command line.
    3. Check Sysmon Event ID 3 for connections in the next 2 minutes.
    4. If the decoded command is a download or an obfuscated script,
       isolate the host and escalate.

  Known limitations
    Does not detect plain, unencoded PowerShell. Does not detect
    PowerShell invoked through a named pipe. Does not detect the
    technique on hosts without Sysmon.

  Test evidence
    See detection-test-record.md, tests 1 through 4.
```

That document answers every question an analyst will ask at three in the morning, and answering them in advance is the difference between a rule that helps and a rule that interrupts.

#### The portfolio artefact this produces

Phase 6 taught that a portfolio needs evidence, not claims. This phase produces a very specific and very legible piece of evidence.

| Artefact | What it proves |
|---|---|
| Three to five Sigma rules in a Git repository | You can write in the portable format, and you understand version control |
| A detection test record with a **failed test and a fix** | You tested both directions, and you are honest |
| A false positive document with a risk-accepted field | You understand that tuning creates blind spots |
| An ATT&CK coverage map with named gaps | You do not overstate, which is the rarest quality in a junior |
| An analyst action for every rule | You think about the person receiving the alert |
| A tuning history with dates | You operate a library rather than writing rules once |

That set is unusual in an entry-level portfolio, and it is directly relevant to SOC work. Most junior candidates present a list of tools. A candidate who presents a detection library with documented false positives and an honest coverage map is describing work they have actually done.

### Key takeaways

- **A detection is a product an analyst receives at three in the morning.** The only question that matters is: if this fires, what will they do differently?
- **Start from behaviour, not from a log field.** Name the attacker action, identify what it changes, then find the log that records it.
- **4624 is not one event — the logon type changes its meaning entirely.** Types 2 and 10 are people, type 3 is a connection, type 5 is a service.
- **4625 sub-codes distinguish enumeration from guessing.** Many `0xC0000064` means name enumeration; `0xC000006A` against a real account means targeted password guessing.
- **4688 does not contain a command line unless command-line auditing is enabled**, and 7045 lives in the System log, not the Security log.
- **Sysmon is the highest-value free telemetry upgrade available**, but the default configuration is nearly useless. The configuration is the detection engineering.
- **A success after a burst of failures is the detection that matters.** Volume-based brute-force rules catch the noise; correlation rules catch the breach.
- **Lower syslog severity numbers are more severe**, and authentication failures are frequently logged at `notice` or `info`, which is why severity filters miss them.
- **Every rule needs a falsifier — the benign activity that would trip it.** If you cannot name one, you have not thought about the environment.
- **Test both directions.** A rule that fires on the attack and is never tested against benign activity is a queue problem waiting to be discovered.
- **Tuning by filter creates a permanent blind spot.** Record the filter, the reason, the risk accepted, and a review date — and add a low-severity companion rule so the filter is never a total gap.
- **A threshold is a guess about your environment. Moving it is not tuning.** If a counting rule is noisy, detect the correlated outcome instead.
- **Tag techniques, not tactics.** `attack.t1059.001` is useful; `attack.execution` tells a reader nothing.
- **Rules break silently, and a broken rule looks exactly like a quiet one.** Schedule re-tests, because nothing else will reveal it.
- **A coverage map with named gaps is worth more than a claim of complete coverage.** Four honest gaps demonstrate more competence than a green heat map.
- **Retire rules deliberately.** A library that only grows eventually drowns the analysts it was built to help.

### Practice this next

The nine tasks build a single artefact — a tested, documented detection library — and the order matters, because each step supplies what the next one needs.

1. **Write the behaviour-to-log mapping for your own environment first** (task 1). For each of the eight behaviours in Part 1's table, note which of your log sources would record it and which would not. The gaps you find are your real starting point, and they are usually larger than expected.
2. **Install Sysmon with a community configuration and read the configuration file** (task 2). Do not deploy a configuration you have not read. Note the specific lines that capture process creation, network connections, and image loads, and change one exclusion so you understand what tuning feels like.
3. **Explore your own logs until you can answer questions without looking them up** (task 3). Find a successful interactive logon, a failed one, a new service, and a process creation with its command line. Quote the raw events in your notes — event ID, key fields, and what each field means.
4. **Write the hypothesis before the rule, every time** (task 4). Use the four-part template: behaviour, signal, source, falsifier. If you cannot write the falsifier, you are not ready to write the rule.
5. **Write three Sigma rules and convert them** (task 5) into your lab SIEM's language. Keep them in a Git repository so the history is visible. At least one should be a sequence or correlation rule rather than a single-event match.
6. **Test both directions and record a failure** (task 6). Run the behaviour with Atomic Red Team in an isolated lab VM and confirm the rule fires. Then run the benign lookalikes until you find one that trips it. Fix it, re-test, and keep the failed test in the record.
7. **Document one false positive properly** (task 7), using the template from Part 5, including the risk-accepted field and a review date. This document is the single most convincing artefact in the phase, because most candidates have never written one.
8. **Map your library to ATT&CK with named gaps** (task 8). Use sub-technique IDs, and produce the coverage table with a "known gap" column that is honestly populated. Count the rules with no coverage at all.
9. **Do the alert-fatigue arithmetic for your own lab** (task 9) using the table in Part 3, substituting your real volumes. Then state, in writing, which of your rules you would retire if you had to cut the library in half, and why.

Then open `portfolio/cyber/10-detection-engineering.md` and assemble the deliverables. **The phase is done when you can take a behaviour, choose the log source that records it, write a rule, test it against both malicious and benign activity, and document why it will not drown the analyst who receives it** — and the artefacts should let a reader check every one of those claims.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Sysmon | Windows endpoint telemetry | Free | https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon | Install with a community config and capture Event ID 1 | Windows Security audit policy with command-line auditing |
| Wazuh | Free SIEM/XDR with rule engine | Free/open-source | https://wazuh.com/ | Load three custom rules and generate matching events | Elastic Security free tier |
| Sigma | Vendor-neutral detection rule format | Free/open-source | https://sigmahq.io/ | Write one rule and validate it with sigmac or pySigma | Direct platform-native rules |
| SigmaHQ rules | Public rule repository | Free/open-source | https://github.com/SigmaHQ/sigma | Convert a community rule and compare it with yours | Elastic detection-rules repository |
| Atomic Red Team | Safe adversary simulation tests | Free/open-source | https://github.com/redcanaryco/atomic-red-team | Run one atomic test in an isolated VM and confirm your rule fires | Manual command execution following ATT&CK procedure examples |
| MITRE ATT&CK | Adversary technique catalogue | Free | https://attack.mitre.org/ | Map three rules to sub-technique IDs | Sigma rule tags, which already carry ATT&CK mappings |
| MITRE ATT&CK Navigator | Coverage visualisation | Free/open-source | https://mitre-attack.github.io/attack-navigator/ | Build a coverage layer with honest gaps | A Markdown coverage table |
| Splunk Free | SIEM search practice | Free | https://www.splunk.com/en_us/download/splunk-free.html | Write three SPL searches over sample data | Wazuh, or Elastic Security |
| Microsoft Sentinel | Cloud SIEM | Paid | https://azure.microsoft.com/en-us/products/microsoft-sentinel | Complete a Microsoft Learn KQL exercise in a free sandbox | Wazuh plus KQL reading on Microsoft Learn |
| Microsoft Learn KQL training | Free query language training | Free | https://learn.microsoft.com/en-us/training/ | Complete the KQL modules | Splunk free tutorials |
| auditd | Linux syscall and file auditing | Free/open-source | https://man7.org/linux/man-pages/man8/auditd.8.html | Write file watches for `/etc/passwd` and `/etc/cron.d` | journald with targeted filters |
| Wazuh rule documentation | Custom rule syntax reference | Free | https://documentation.wazuh.com/current/user-manual/ruleset/rules/custom.html | Write a rule with a filter and a MITRE tag | Elastic detection rule documentation |

## Free/cheap resources

- MITRE ATT&CK — https://attack.mitre.org/
- Sigma documentation — https://sigmahq.io/docs/guide/getting-started.html
- SigmaHQ rule repository — https://github.com/SigmaHQ/sigma
- Atomic Red Team — https://github.com/redcanaryco/atomic-red-team
- Microsoft Sysmon documentation — https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon
- SwiftOnSecurity Sysmon configuration — https://github.com/SwiftOnSecurity/sysmon-config
- Olaf Hartong Sysmon modular configuration — https://github.com/olafhartong/sysmon-modular
- Windows Security event ID reference — https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/advanced-security-audit-policy-settings
- Linux auditd documentation — https://man7.org/linux/man-pages/man8/auditd.8.html
- Wazuh custom rules — https://documentation.wazuh.com/current/user-manual/ruleset/rules/custom.html
- The DFIR Report — https://thedfirreport.com/
- Microsoft Learn KQL training — https://learn.microsoft.com/en-us/training/

## Hands-on practice tasks

1. Write a behaviour-to-log-source mapping for eight attacker behaviours in your own environment, noting the gaps.
2. Install Sysmon with a community configuration, read the configuration file, and change one exclusion.
3. Find and quote a successful logon, a failed logon, a service installation, and a process creation with its command line from your own logs.
4. Write a four-part detection hypothesis — behaviour, signal, source, falsifier — for each of three detections.
5. Write three Sigma rules and convert them into your lab SIEM's native language; keep them in a Git repository.
6. Test each rule both ways using Atomic Red Team in an isolated VM, and record at least one failed test and its fix.
7. Document one false positive fully, including the filter, the risk accepted, and a review date.
8. Build an ATT&CK coverage map for your rules using sub-technique IDs, with a populated known-gap column.
9. Do the alert-fatigue arithmetic for your lab's real volumes and state which rules you would retire first.

## Deliverable / proof of work

Create `portfolio/cyber/10-detection-engineering.md` with:

- A behaviour-to-log-source mapping table with the gaps you found named
- Sysmon installation notes, the configuration you deployed, and the change you made to it
- Three to five detection rules in Sigma, plus their converted platform versions, in a Git repository
- A detection test record for each rule showing a true positive test and a false positive test
- At least one false positive document with filter, risk accepted, and review date
- An ATT&CK coverage map using sub-technique IDs with an honest known-gap column
- An analyst action written for every rule
- An alert-fatigue calculation using your lab's real alert volumes
- A short statement of which rules you would retire first and why

## Checklist

- [ ] I can name which log source records a given attacker behaviour. <!-- id: c10-behaviour-log-mapping energy: low -->
- [ ] I installed Sysmon with a configuration I read and modified myself. <!-- id: c10-sysmon-configured energy: normal -->
- [ ] I can interpret the Windows logon types and explain why 4624 differs by type. <!-- id: c10-logon-type-reading energy: low -->
- [ ] I can read 4625 sub-codes and distinguish enumeration from password guessing. <!-- id: c10-4625-subcodes energy: low -->
- [ ] I wrote three Sigma rules with references, ATT&CK tags, and a false-positives field. <!-- id: c10-sigma-rules-written energy: normal -->
- [ ] I converted a Sigma rule into at least one platform-specific query. <!-- id: c10-sigma-conversion energy: normal -->
- [ ] I wrote at least one sequence or correlation rule, not only single-event matches. <!-- id: c10-sequence-rule energy: normal -->
- [ ] I ran a true positive test and confirmed the rule fires on the behaviour. <!-- id: c10-true-positive-test energy: normal -->
- [ ] I ran a false positive test, found a benign lookalike, and fixed the rule. <!-- id: c10-false-positive-test energy: normal -->
- [ ] I documented one false positive with a risk accepted and a review date. <!-- id: c10-false-positive-record energy: normal -->
- [ ] I mapped my rules to ATT&CK sub-techniques and named the gaps. <!-- id: c10-attack-coverage-map energy: normal -->
- [ ] I wrote an analyst action for every rule in my library. <!-- id: c10-analyst-action energy: low -->
- [ ] I calculated the alert volume my library would produce and stated what I would retire. <!-- id: c10-alert-fatigue-math energy: normal -->
- [ ] I can explain why tuning by filter creates a bypass and how I document it. <!-- id: c10-filter-risk-explanation energy: low -->
- [ ] I explained how a broken rule is indistinguishable from a quiet one and how I re-test. <!-- id: c10-silent-failure-awareness energy: low -->

## You're ready to move on when...

You can take a behaviour, choose the log source that records it, write a detection rule for it, test it against both malicious and benign activity, and document why it will not drown the analyst who receives it.

## Free vs Paid

### What's free and enough

Sysmon with a community configuration, Wazuh as a SIEM with a working rule engine, Sigma and the SigmaHQ repository, Atomic Red Team, MITRE ATT&CK and the ATT&CK Navigator, auditd on Linux, and Microsoft Learn's KQL modules are enough to build a real, tested detection library and to talk about it credibly in an interview. Everything this phase requires is free, and the artefacts a free stack produces are indistinguishable in quality from the ones a commercial stack produces — because the quality lives in the test records and the false positive documentation, not in the licence.

### What's paid and why you'd upgrade

Splunk and Microsoft Sentinel are the two SIEMs most often named in job postings, and their free tiers are limited by ingestion volume or licence terms. Enterprise endpoint detection platforms such as CrowdStrike, SentinelOne, and Defender for Endpoint provide kernel-level telemetry and pre-built detections that open-source tooling requires far more work to approach. Threat intelligence platforms add automated enrichment. A SIEM certification buys a hiring filter. None of these improves the skill this phase teaches, which is deciding what is worth detecting and proving that your rule works.

### When it's worth paying

Pay when an employer requires a specific platform and you are already working with it daily, or when the free ingestion limit genuinely blocks a project you have already started and mostly finished. The order that matters is the one Phase 7 describes: free material first, evidence second, money last. Do not buy a SIEM licence to learn detection engineering — write rules in Sigma, run them in Wazuh, and spend the money on nothing at all until a specific role demands a specific platform that you can then learn quickly because you already understand the logic underneath it.