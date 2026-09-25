---
id: curriculum-cyber-core
exam: "CS Roadmap Cyber Foundations and Incident Triage"
code: CS-CYBER-CORE
kind: curriculum-practice
track: cyber
phases: "cyber-01-foundations,cyber-02-networking-and-linux,cyber-03-security-fundamentals,cyber-04-hands-on-labs,cyber-09-cloud-and-identity,cyber-11-incident-response"
scope: "Cyber Phases 1–4, 9, and 11"
questions: 20
source: curriculum
---

# CS Roadmap Cyber Foundations and Incident Triage — curriculum practice exam

**Unofficial curriculum practice exam; not a certification exam or a job-readiness guarantee.** This diagnostic integrates foundational security reasoning, networking and Linux evidence, safe labs, cloud identity, and incident-response triage. It is free practice, not a substitute for supervised operational experience.

## How to use and score it

Answer all questions before checking the marked answers. Give one point per correct answer, then read each explanation, including those for correct guesses. **There is no pass/fail score or readiness threshold.** Use the phase map and missed questions to choose what to review. In real incidents, follow your organization’s escalation, legal, and evidence-handling procedures.

## Domain 1 — Security foundations, identity, and risk (5 questions)

### Q1. A staff member receives an unexpected MFA approval prompt and denies it. What is the most appropriate immediate response?
<!-- phases: cyber-01-foundations, cyber-03-security-fundamentals -->

- [ ] Ask them to approve the next prompt so the analyst can identify the source
- [x] **Treat it as a suspected credential attack, preserve relevant sign-in details, and escalate under policy**
- [ ] Disable MFA for the department
- [ ] Delete the user account without notifying anyone

**Why:** An unrequested prompt can indicate that someone has the password and is attempting the second factor. Record time, application, and sign-in details; use the incident process rather than asking the user to approve anything or making an unauthorized account change.

### Q2. A vulnerability scan reports a critical issue on an isolated lab VM and a medium issue on a public payment server. Which should be prioritized first?
<!-- phases: cyber-03-security-fundamentals -->

- [ ] Always patch the highest CVSS score first, without context
- [x] **Assess exposure, asset importance, exploitability, and likely impact before prioritizing**
- [ ] Ignore the public server because it has a lower score
- [ ] Close both findings because scanning tools are never useful

**Why:** Risk depends on more than a severity number. Exposure, asset value, active exploitation, and potential harm affect prioritization. Record the rationale and follow change procedures rather than treating a scanner score as the complete decision.

### Q3. A user reports a “security incident,” but the only evidence is a failed login from an unfamiliar location. What is the best description at this point?
<!-- phases: cyber-03-security-fundamentals -->

- [ ] Confirmed account compromise
- [x] **A suspicious authentication event that requires context and triage**
- [ ] A harmless event that should be deleted
- [ ] Proof that data was exfiltrated

**Why:** One failed login does not prove compromise or data loss. Correlate with other sign-ins, MFA events, device context, and the user’s activity; preserve the event and avoid overstating the conclusion.

### Q4. A home lab is used to analyze suspicious files. Which design best limits risk to other devices?
<!-- phases: cyber-04-hands-on-labs -->

- [ ] Bridge the analysis VM to the household LAN for convenience
- [ ] Share host folders and clipboard with the sample VM
- [x] **Use an isolated host-only network, snapshots, and controlled sample handling**
- [ ] Disable VM snapshots so the machine cannot be reverted

**Why:** Network isolation limits unintended communication with real systems, while snapshots support controlled recovery. Do not connect malware samples to production, household, or public networks without an authorized, purpose-built containment environment.

### Q5. Which statement best distinguishes a threat, vulnerability, and risk?
<!-- phases: cyber-01-foundations, cyber-03-security-fundamentals -->

- [x] **A threat may exploit a vulnerability, creating a possibility of loss whose likelihood and impact contribute to risk**
- [ ] A vulnerability is the person attacking a server
- [ ] Risk is the software update that fixes a weakness
- [ ] A threat is always proof that a breach occurred

**Why:** A vulnerability is a weakness; a threat is a potential actor or event that may act on it. Risk describes potential loss in context, commonly considering likelihood and impact. None of these terms alone proves an incident occurred.

## Domain 2 — Network and host evidence (5 questions)

### Q6. A workstation reaches a web server by IP but not by hostname. Which check most directly tests the suspected failure?
<!-- phases: cyber-02-networking-and-linux, cyber-03-security-fundamentals -->

- [ ] Change its MAC address
- [x] **Query the configured DNS resolver and compare the returned record with a known-good result**
- [ ] Reinstall the browser
- [ ] Disable the network adapter permanently

**Why:** IP connectivity with hostname failure points toward name resolution, although the application path should still be checked. A targeted DNS query and resolver comparison test the hypothesis without destructive changes.

### Q7. An analyst sees repeated failed SSH logins from one remote address in authentication logs. What is the safest first analytical step?
<!-- phases: cyber-02-networking-and-linux, cyber-03-security-fundamentals -->

- [ ] Immediately delete the log file to stop disk usage
- [ ] Assume a successful compromise without checking for success events
- [x] **Preserve the relevant time window and correlate failures with successful logins and account activity**
- [ ] Run an exploit against the remote host

**Why:** Failed attempts are evidence of probing or guessing, not proof of access. Preserve logs and check for a successful authentication, affected account, and subsequent activity. Do not retaliate or alter evidence.

### Q8. A DNS TXT record contains `v=spf1 ... -all`. What does `-all` mean?
<!-- phases: cyber-02-networking-and-linux -->

- [ ] The receiver is technically forced to reject every message
- [x] **Unauthorized senders receive an SPF fail result; the receiver applies its own mail policy**
- [ ] The domain has no SPF record
- [ ] All email from the domain is encrypted

**Why:** SPF evaluates whether a sending host is authorized for the checked identity. `-all` returns fail for senders not matched earlier in the record. Receiver handling varies by local policy and may consider DMARC and other signals.

### Q9. An IPv4 workstation has 169.254.12.8 after boot. What should an analyst investigate?
<!-- phases: cyber-02-networking-and-linux -->

- [ ] Whether the address is globally routable
- [x] **Whether the host can reach DHCP, including link state, VLAN, and server availability**
- [ ] Whether the IPv6 address uses a /64
- [ ] Whether the user’s browser cache is full

**Why:** A 169.254.x.x address is link-local and commonly appears when DHCP configuration was not obtained. Check physical and network path evidence first; do not assign an arbitrary address that could create a conflict.

### Q10. A security event timestamp appears four hours later than the endpoint’s local clock. What should an analyst verify before building a timeline?
<!-- phases: cyber-03-security-fundamentals -->

- [ ] Delete events that disagree
- [x] **Identify each source’s timezone and normalize timestamps while preserving the original values**
- [ ] Assume the endpoint is malicious
- [ ] Change all log timestamps to local time and overwrite originals

**Why:** Systems may log in UTC, local time, or with incorrect clock settings. Record source timezone and offset, preserve original evidence, and document normalization so events are compared consistently without losing provenance.

## Domain 3 — Cloud identity and incident response (5 questions)

### Q11. A cloud audit log shows a new access key created for a privileged identity. What is the best initial triage action?
<!-- phases: cyber-09-cloud-and-identity -->

- [ ] Delete all keys in the account immediately
- [x] **Preserve the event, identify the principal and change context, and assess whether the action was authorized**
- [ ] Assume the cloud provider created it for billing
- [ ] Publish the key in a ticket so the team can inspect it

**Why:** Establish who made the change, from which session, when, and whether an approved workflow explains it. Treat exposed credentials as secrets; if unauthorized activity is indicated, contain through the approved incident process.

### Q12. A user’s cloud role grants more permissions than their duties require. Which principle should guide remediation?
<!-- phases: cyber-09-cloud-and-identity -->

- [ ] Maximum privilege for operational convenience
- [ ] Shared credentials for the whole team
- [x] **Least privilege, with role ownership and access changes reviewed through policy**
- [ ] Remove audit logging so the role is easier to use

**Why:** Least privilege limits the impact of mistakes and compromised credentials. Inventory actual needs, confirm the owner and dependencies, and make changes through an approved review to avoid breaking legitimate work.

### Q13. During an incident, a compromised workstation may still hold volatile evidence. What is the best general approach?
<!-- phases: cyber-11-incident-response -->

- [ ] Reimage it before recording anything
- [x] **Coordinate containment with rapid capture of high-value volatile evidence according to the response plan**
- [ ] Leave it connected for several days to collect more logs
- [ ] Power it off automatically in every case

**Why:** Preservation and containment pull in different directions. Capture critical volatile state quickly when policy and capability allow, while containing active harm in coordination with incident leadership. The exact order depends on risk and approved procedures.

### Q14. An analyst identifies one compromised account but has not checked its recent sign-ins or related endpoints. What is the main risk of immediately closing the incident?
<!-- phases: cyber-11-incident-response -->

- [ ] The account password might be too long
- [x] **Related access or persistence could remain undiscovered, leaving scope and eradication incomplete**
- [ ] The log format might change
- [ ] The ticket would have too many comments

**Why:** One indicator rarely establishes the full scope. Correlate authentication, endpoint, network, and cloud evidence, and document what is known and unknown before declaring containment or closure.

### Q15. A containment action would disable a critical service used by a hospital. What should the response team do?
<!-- phases: cyber-11-incident-response -->

- [ ] Avoid all containment regardless of ongoing harm
- [ ] Let a junior analyst decide alone
- [x] **Escalate the operational safety trade-off to incident leadership and the service owner, then document the decision**
- [ ] Hide the action from the service owner

**Why:** Containment can itself create harm. In a safety- or availability-critical environment, involve authorized decision-makers, assess options and side effects, and record the rationale while still addressing the threat.

## Domain 4 — Reporting and safe practice (5 questions)

### Q16. A report says, “The attacker stole customer data,” but current evidence only shows a suspicious outbound connection. What should be changed?
<!-- phases: cyber-11-incident-response -->

- [ ] Keep the statement because the reader expects a clear conclusion
- [x] **Separate observed facts from inference and state that exfiltration is not yet confirmed**
- [ ] Remove all evidence from the report
- [ ] Replace it with “nothing happened”

**Why:** Reports should distinguish fact, inference, and unknowns. A connection may warrant investigation but does not by itself prove data theft. Accurate uncertainty supports better decisions and avoids misleading management or regulators.

### Q17. Which evidence note is most useful for a later investigation?
<!-- phases: cyber-11-incident-response -->

- [ ] “Found something suspicious around lunch.”
- [x] **“At 14:32 UTC, host WS-22 recorded event X; source is preserved in repository Y with its hash and collector noted.”**
- [ ] “The user probably clicked a link.”
- [ ] “Evidence confirmed,” with no source or timestamp

**Why:** A usable note provides timestamp and timezone, system, event, source location, and integrity information. Label assumptions as assumptions; do not substitute them for evidence.

### Q18. A colleague proposes testing a public IP address that is not part of the authorized lab. What is the correct response?
<!-- phases: cyber-04-hands-on-labs -->

- [ ] Run a “quiet” scan first
- [ ] Try only default passwords
- [x] **Do not probe it; obtain explicit authorization and defined scope before testing**
- [ ] Use a proxy so the test cannot be attributed

**Why:** A public address is not permission. Testing must stay within explicit authorization and scope. Use designated labs or request written approval from the asset owner before conducting security tests.

### Q19. After containment and recovery, what belongs in a lessons-learned review?
<!-- phases: cyber-11-incident-response -->

- [ ] Only names of people to blame
- [x] **Timeline, contributing conditions, what worked, what failed, and assigned follow-up actions**
- [ ] Passwords used during the incident
- [ ] A claim that every future incident is now impossible

**Why:** The review should improve systems and processes. Record evidence-based findings, owners, and due dates; avoid blame and absolute claims that cannot be guaranteed.

### Q20. An analyst wants to automate blocking every address that appears in a suspicious log line. What is the safest design principle?
<!-- phases: cyber-03-security-fundamentals, cyber-11-incident-response -->

- [ ] Automate the block first and review later
- [ ] Feed raw log text into `eval`
- [x] **Automate validated collection or enrichment, but keep high-impact containment decisions under approved human or policy control**
- [ ] Store API credentials in the script repository

**Why:** Automation can scale mistakes. Validate untrusted input, protect secrets, make actions auditable and idempotent, and keep consequential containment decisions within an approved process with safeguards.

## Question-to-phase map

| Question | Main phase(s) |
|---|---|
| Q1, Q5 | `cybersec-roadmap/01-phase-foundations.md`, `cybersec-roadmap/03-phase-security-fundamentals.md` |
| Q2–Q4 | `cybersec-roadmap/03-phase-security-fundamentals.md` |
| Q6–Q10 | `cybersec-roadmap/02-phase-networking-and-linux.md`, `cybersec-roadmap/03-phase-security-fundamentals.md` |
| Q11–Q12 | `cybersec-roadmap/09-phase-cloud-and-identity.md` |
| Q13–Q17, Q19 | `cybersec-roadmap/11-phase-incident-response.md` |
| Q18 | `cybersec-roadmap/04-phase-hands-on-labs.md` |
| Q20 | `cybersec-roadmap/03-phase-security-fundamentals.md`, `cybersec-roadmap/11-phase-incident-response.md` |
