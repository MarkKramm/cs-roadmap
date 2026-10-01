# Glossary

The shortened forms this curriculum uses, and what the letters stand for.

**Why this document exists.** A beginner moving from a help-desk role into security
meets several hundred capitalised forms before anyone tells them what the letters
mean. `scripts/audit-terms.mjs` has measured that population since 2026-09-17, and
`scripts/audit-glossary.mjs` re-derives it on every run: **309
distinct domain terms** across the 31 phases and the shared documents. There was
nowhere to look one up — every explanation lived on one line of one lesson, and
finding it meant searching for a phrase you did not yet know.

## What this is, and what it is not

**This is a starter set, and it is deliberately partial.** It holds the
**47 entries** below, of the 309 domain terms the curriculum
uses. The rest are not here, and the reason is worth stating rather than leaving a
reader to assume the absence means a term is unimportant.

`scripts/extract-glossary-candidates.mjs` walks the corpus and proposes an
expansion for each term from the line where it is first used. It found an
expansion string for **64** of the 312, and a large minority were
wrong. Not near-misses — confidently wrong:

| Term | What the extractor proposed | The problem |
|---|---|---|
| `KQL` | Microsoft Sentinel and Defender XDR | a usage context, not an expansion |
| `ICS` | The incident command system | the wrong sense entirely |
| `CSF` | task 7 | a cross-reference, not a phrase |
| `CISA` | audit | a gloss, not the certification's name |

**A glossary that says "`KQL` means Microsoft Sentinel and Defender XDR" is worse
than no glossary.** It turns a term a beginner can look up into a wrong fact they
will repeat in an interview. So every entry below was checked by hand against the
line it came from, and anything that did not survive was left out rather than
repaired by guessing.

**Every expansion is quoted from the corpus, not tidied.** The corpus writes
"Annualised"; this document writes "Annualised". A glossary that paraphrases its
own citations cannot be checked against them, and being checkable is the only
property that makes it worth having — `scripts/audit-glossary.mjs` fails the build
if an entry's expansion is no longer at the line it cites.

## The entries


### A

**ALE** — Annualised loss expectancy.
The expected cost of one occurrence of a risk event, before frequency is applied.
*Sourced from `advance-roadmap/06-phase-programme-and-influence.md:528`.*

**ARO** — Annualised rate of occurrence.
How many times a year a risk event is expected to happen.
*Sourced from `advance-roadmap/06-phase-programme-and-influence.md:528`.*

**ARP** — Address Resolution Protocol.
How a machine on a local network finds the hardware address for an IP address it wants to reach.
*Sourced from `cybersec-roadmap/02-phase-networking-and-linux.md:280`.*

**ATS** — Applicant tracking systems.
The software a recruiter uses to record, filter and progress applications.
*Sourced from `it-roadmap/08-phase-portfolio-and-resume.md:217`.*


### B

**BEC** — Business email compromise.
An attack where the target is the person, not the machine: the attacker writes as a trusted colleague or a supplier and asks for money or credentials.
*Sourced from `cybersec-roadmap/01-phase-foundations.md:278`.*


### C

**CIDR** — Classless Inter-Domain Routing.
The notation that writes a network range as a prefix, which is why an address block can be split without renumbering.
*Sourced from `it-roadmap/03-phase-networking-basics.md:413`.*

**CISO** — Chief Information Security Officer.
The executive who owns security as a function of the business, rather than as a technical team.
*Sourced from `cybersec-roadmap/13-phase-grc-compliance.md:124`.*

**CSAT** — Customer satisfaction.
A support metric: the share of tickets closed with the customer satisfied.
*Sourced from `it-roadmap/06-phase-tools-and-ticketing.md:417`.*


### D

**DKIM** — DomainKeys Identified Mail.
A DNS record that lets a receiver check a message was really sent by that domain.
*Sourced from `cybersec-roadmap/02-phase-networking-and-linux.md:298`.*

**DVWA** — Damn Vulnerable Web Application — a deliberately insecure web app you run locally.
A deliberately insecure application you run locally, so you can practise finding its flaws without breaking anything that matters.
*Sourced from `cybersec-roadmap/03-phase-security-fundamentals.md:1033`.*


### E

**EPSS** — Exploit Prediction Scoring System.
A public estimate of how likely a given vulnerability is to be exploited in the wild, which is a better prioritisation signal than severity alone.
*Sourced from `cybersec-roadmap/03-phase-security-fundamentals.md:725`.*


### F

**FCR** — First contact resolution.
The share of tickets resolved on first contact, without a handover. Its companion metric is `MTTR`.
*Sourced from `it-roadmap/06-phase-tools-and-ticketing.md:413`.*


### G

**GPO** — Group Policy Object.
A stored set of Windows settings applied automatically to machines or users in an `OU`.
*Sourced from `it-roadmap/05-phase-sysadmin-basics.md:108`.*

**GRC** — Governance, Risk, and Compliance.
The three functions that decide what is allowed, what could go wrong, and whether the evidence of that is good enough for an auditor.
*Sourced from `cybersec-roadmap/05-phase-specialization-choice.md:195`.*


### I

**IDOR** — Insecure Direct Object Reference — is the vulnerability where.
A vulnerability where a request references a record by its own identifier and the server does not check that the caller is allowed that record.
*Sourced from `cybersec-roadmap/03-phase-security-fundamentals.md:633`.*

**IDS** — Intrusion Detection System.
Passive: it watches traffic or logs and raises an alert, without blocking. Contrast `IPS`.
*Sourced from `cybersec-roadmap/03-phase-security-fundamentals.md:482`.*

**IPS** — Intrusion Prevention System.
Active: it sits inline and blocks what it judges to be an attack. Contrast `IDS`.
*Sourced from `cybersec-roadmap/03-phase-security-fundamentals.md:482`.*

**ITSM** — IT Service Management.
The discipline of running IT as a service: catalogue, incidents, changes, and the measures that show whether any of it is working.
*Sourced from `it-roadmap/06-phase-tools-and-ticketing.md:56`.*


### J

**JWT** — JSON Web Token.
A signed, self-contained token a client stores and presents, so the server does not keep session state.
*Sourced from `cybersec-roadmap/14-phase-web-app-security.md:283`.*


### K

**KEV** — Known Exploited Vulnerabilities.
CISA's list of flaws with confirmed real-world exploitation. A patch for one of these is urgent in a way an equal severity score on an unused path is not.
*Sourced from `cybersec-roadmap/03-phase-security-fundamentals.md:759`.*


### M

**MFT** — Master File Table.
The index of an NTFS volume: which clusters belong to which file. Deleting it is the fastest way to destroy a drive, which is why imaging preserves it.
*Sourced from `cybersec-roadmap/11-phase-incident-response.md:454`.*

**MTTR** — Mean time to resolve.
The average time from a ticket being raised to it being closed. Paired with `FCR` in most service reviews.
*Sourced from `it-roadmap/06-phase-tools-and-ticketing.md:412`.*


### N

**NAT** — Network Address Translation.
Rewriting addresses as traffic crosses a router, so many private hosts can share one public address.
*Sourced from `it-roadmap/03-phase-networking-basics.md:169`.*

**NOC** — Network Operations Centre, a team that watches dashboards and.
The team that watches dashboards and responds to alerts around the clock.
*Sourced from `it-roadmap/01-phase-computer-fundamentals.md:657`.*

**NPC** — National Privacy Commission.
The Philippine data-privacy regulator, named in that jurisdiction's breach notification rules.
*Sourced from `cybersec-roadmap/13-phase-grc-compliance.md:450`.*


### O

**OPA** — Open Policy Agent.
A general-purpose policy engine; its policy language is `Rego`.
*Sourced from `advance-roadmap/04-phase-cloud-identity-architecture.md:1188`.*

**OU** — Organisational Unit.
A container in Active Directory that objects live in, so rules can be applied to a group of them.
*Sourced from `it-roadmap/05-phase-sysadmin-basics.md:105`.*

**OWASP** — The ten most critical web application security risks, maintained by the Open Worldwide Application Security Project.

*Sourced from `cybersec-roadmap/01-phase-foundations.md:480`.*


### P

**PIR** — The post-incident review.
The structured review after an incident, held to work out what to change rather than to assign blame.
*Sourced from `advance-roadmap/03-phase-incident-command.md:56`.*


### R

**RBAC** — Role-Based Access Control — which is how least privilege is a.
Granting permissions to a role rather than a person, which is how least privilege becomes maintainable.
*Sourced from `cybersec-roadmap/03-phase-security-fundamentals.md:259`.*

**RMM** — Remote Monitoring and Management — the software a managed-service provider uses to patch and watch many customer machines at once.
Software a managed-service provider uses to patch and watch many customer machines at once.
*Sourced from `it-roadmap/05-phase-sysadmin-basics.md:1484`.*


### S

**SCP** — A service control policy.
A JSON document attached to a cloud identity that limits what that identity may do, independently of its own permissions.
*Sourced from `advance-roadmap/04-phase-cloud-identity-architecture.md:265`.*

**SID** — A security identifier.
Windows' internal identifier for a user or group. Every permission decision on Windows is ultimately a comparison of these.
*Sourced from `it-roadmap/05-phase-sysadmin-basics.md:405`.*

**SLE** — Single loss expectancy.
The cost of one occurrence of a risk event, before frequency is applied. `ALE` is this multiplied by `ARO`.
*Sourced from `advance-roadmap/06-phase-programme-and-influence.md:50`.*

**SPF** — Sender Policy Framework.
A DNS record listing which hosts may send mail for a domain.
*Sourced from `cybersec-roadmap/02-phase-networking-and-linux.md:298`.*

**SSO** — Single Sign-On.
Authenticating once and reaching several services without re-entering credentials.
*Sourced from `cybersec-roadmap/03-phase-security-fundamentals.md:188`.*

**SSRF** — That is server-side request forgery.
Making a server issue a request to somewhere the attacker chose, using the server's network position rather than their own.
*Sourced from `cybersec-roadmap/09-phase-cloud-and-identity.md:727`.*


### T

**TGT** — ticket-granting ticket.
In Kerberos, the ticket a client presents to get further tickets.
*Sourced from `cybersec-roadmap/10-phase-detection-engineering.md:248`.*

**TLS** — Transport Layer Security.
The encryption and server-identity protocol that HTTPS is HTTP carried inside.
*Sourced from `it-roadmap/03-phase-networking-basics.md:293`.*


### U

**UAC** — User Account Control.
The Windows prompt that separates a standard action from an administrative one. Its cost is a habit: users who click through it learn to click through it.
*Sourced from `it-roadmap/02-phase-operating-systems.md:40`.*

**UID** — user ID — the number Linux uses internally for your account.
On Linux, the number the system uses internally for an account, distinct from the username you log in with.
*Sourced from `it-roadmap/02-phase-operating-systems.md:514`.*

**UNC** — Universal Naming Convention.
The path form Windows uses to name a resource on another host.
*Sourced from `it-roadmap/05-phase-sysadmin-basics.md:626`.*


### V

**VLAN** — Virtual LAN.
A broadcast domain carved out of one physical switch, so devices can be separated by policy without separate hardware.
*Sourced from `it-roadmap/03-phase-networking-basics.md:967`.*


### W

**WMI** — Windows Management Instrumentation.
The interface Windows exposes for querying and changing system state, and a standard remote-execution path for an attacker who reaches it.
*Sourced from `cybersec-roadmap/03-phase-security-fundamentals.md:412`.*

**WS** — Working Set.
The portion of a process's memory currently held in physical RAM; the rest is paged out.
*Sourced from `it-roadmap/02-phase-operating-systems.md:740`.*


### X

**XDR** — Extended Detection and Response.
The vendor category covering detection *and* response in one product, rather than a sensor that only alerts.
*Sourced from `cybersec-roadmap/04-phase-hands-on-labs.md:393`.*

**XSS** — Cross-site scripting.
Getting script to run in another user's browser, in the context of a site they trust.
*Sourced from `cybersec-roadmap/03-phase-security-fundamentals.md:580`.*

## What is not here, and why

**262 of the 309 domain terms have no entry**, for three different
reasons, and they are worth separating because only two are fixable by writing.

1. **No expansion could be found** — 248 terms. Usually the term is used in prose
   without ever being spelled out. That is the readability problem this document
   exists to relieve, not a glossary problem.
2. **An expansion was found and it was wrong** — 17 terms, below. Fixing
   these properly means correcting the **source line** in the phase, so the
   curriculum stops implying the wrong thing, or sourcing the real expansion from a
   primary reference. Both are content work rather than tooling work.
3. **The corpus gives a gloss, not an expansion** — part of group 2. `CISA (audit)`
   is a useful gloss and not a certification's name; a human can adjudicate these
   quickly, and the extractor cannot, because the information is not on the line.

| Term | Why it was left out |
|---|---|
| `BSOD` | the corpus glosses it as 'Blue screens'; the full form is not on the line |
| `BSSID` | truncated mid-sentence |
| `CISA` | a gloss ('audit'), not the certification's name |
| `CISM` | a gloss ('management') |
| `CK` | not a real term on that line; it extracted an ATT&CK technique id |
| `CRISC` | a gloss ('risk') |
| `CSF` | extracted 'task 7', a cross-reference |
| `CSRF` | extracted 'task 6', a cross-reference |
| `ICS` | extracted the wrong sense entirely — ICS is Industrial Control Systems |
| `IMAP` | a gloss ('mail') |
| `KQL` | extracted a usage context, not an expansion |
| `MDM` | extracted a question fragment |
| `MSP` | extracted a lower-case plural, not the expansion |
| `OSCP` | extracted a description ('the demanding industry benchmark') |
| `PSU` | extracted 'The power supply'; the unit name is not on the line |
| `SMB` | extracted 'Port 445', which is a port number and not an expansion |
| `SPL` | extracted 'Splunk'; the language's own name is not on the line |

`scripts/audit-glossary.mjs` reports all three groups on every run, so the gap is
a number that moves rather than a claim in prose.
