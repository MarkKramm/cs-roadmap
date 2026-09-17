---
id: exam-security-plus
exam: "CompTIA Security+"
code: SY0-701
questions: 40
real_exam_questions: 90
real_exam_minutes: 90
pass_mark: 750
pass_scale: 900
blueprint_checked: 2026-09-18
source: "https://www.comptia.org/certifications/security"
---

# CompTIA Security+ — practice questions

**Unofficial.** Written for this repository against CompTIA's published SY0-701 objectives.
Not real exam questions, not endorsed by CompTIA.

| | |
|---|---|
| **Exam code** | SY0-701 (V7, launched November 2023) |
| **Real exam** | maximum of 90 questions, 90 minutes |
| **Pass mark** | **750** on a scale of 100–900 |
| **This paper** | **40 questions** — see the note below |

## Before you start

**Do this closed-book, in one sitting, in 45 minutes.** The real exam gives you 90 minutes
for up to 90 questions, so 45 minutes for 40 is the same pace. An open-book score measures
your search skills; the real exam is closed-book.

**Read the pass mark, not your gut.** Security+ is 750/900 — that is **83.3%**, not 70%. Most
people who fail Security+ do it while believing they scored well. Convert before you decide.

The pass mark is 83.3% of 40, which is **33.3 questions**. There is no such thing as a third
of a question, so the boundary is:

| Your score out of 40 | Percentage | Verdict |
|---|---|---|
| 37–40 | 93–100% | Comfortable pass |
| 34–36 | 85–90% | Pass, but no margin |
| **33** | **82.5%** | **Fail — just under the line** |
| 29–32 | 73–80% | Clear fail |
| 24–28 | 60–70% | Substantially under-prepared |
| below 24 | — | Stop and study, do not book |

**33 out of 40 is a fail.** It is 82.5% against a required 83.3%, and the fact that it *looks*
like a pass is exactly why this table exists. Do not round up in your own favour on the day
you decide whether to spend £250.

**The percentage is arithmetic, not a scaled score.** A real Security+ score is scaled against
the difficulty of the specific questions you receive, so 34/40 does not *guarantee* a pass —
it clears the arithmetic line and nothing more. Give yourself margin above it.

**These 40 questions are not a simulation.** The real exam draws 90 questions from a much
larger objective list and includes performance-based questions this paper cannot represent
at all. Being two questions over the line here is inside the noise.

## How it is weighted

Every question below belongs to one of CompTIA's five published domains, and the paper is
proportioned to the real exam so no domain is over-represented:

| Domain | Official weight | Questions here |
|---|---|---|
| 1. General security concepts | 12% | 5 |
| 2. Threats, vulnerabilities, and mitigations | 22% | 9 |
| 3. Security architecture | 18% | 7 |
| 4. Security operations | **28%** | 11 |
| 5. Security program management and oversight | 20% | 8 |

**Domain 4 is the largest for a reason.** If you are scoring badly there, you are scoring
badly on more than a quarter of the exam, and it is the domain most people under-study
because it is the least exciting to read.

---

## Domain 1 — General security concepts (12%)

### Q1. A company wants to prove that a signed contract has not been altered since it was agreed. Which property of cryptography does this require?

- [ ] Confidentiality
- [x] **Integrity**
- [ ] Availability
- [ ] Non-repudiation

**Why:** Integrity is the property that detects modification. Confidentiality hides content
and non-repudiation prevents a party denying they signed — both are real and both are
*frequently the wrong answer on this exact question*. The question asks what proves the
document was **not altered**, and that is integrity, whether the signature is digital or a
hash comparison.

### Q2. A finance team needs a control that stops a single administrator from both creating a vendor payment and approving it. Which control type is this?

- [ ] Least privilege
- [ ] Job rotation
- [x] **Separation of duties**
- [ ] Mandatory vacation

**Why:** Separation of duties splits a sensitive process across two people so no single
person can complete it alone. Least privilege limits *what* one person can do but does not
prevent them from doing both steps if both are within their rights. Job rotation and
mandatory vacation are detective controls against fraud that is already happening; this
question asks for a preventive split.

### Q3. Which of the following best describes the difference between a vulnerability and a risk?

- [ ] A vulnerability is technical and a risk is financial
- [x] **A vulnerability is a weakness; a risk is the likelihood and impact of that weakness being exploited**
- [ ] A vulnerability is a weakness in software and a risk is a weakness in process
- [ ] They are synonyms used by different frameworks

**Why:** This distinction appears constantly and is worth being exact about. A vulnerability
is a *thing that is wrong*. A risk is a *judgement about what that could cost* — and the
same vulnerability can be low risk on an isolated lab machine and high risk on a public
payment gateway. Risk is what you prioritise by; a vulnerability list alone does not tell you
what to fix first.

### Q4. A user receives a text message claiming to be from their bank, asking them to confirm a transaction by clicking a link. Which attack is this?

- [ ] Vishing
- [ ] Phishing
- [x] **Smishing**
- [ ] Whaling

**Why:** The channel is the discriminator, and exam questions rely on you knowing each word
precisely. **V**ishing is voice (a phone call), **ph**ishing is email, **sm**ishing is SMS
text, and **wh**aling is phishing aimed at senior executives. Reading "text message" and
answering "phishing" is the common error — phishing is specifically email here.

### Q5. An organisation requires that all administrative access to a server uses a credential that is valid for one hour and cannot be reused. Which concept is this?

- [ ] Single sign-on
- [x] **Ephemeral credentials**
- [ ] Federation
- [ ] Password vaulting

**Why:** Short-lived, non-reusable credentials are exactly what "ephemeral" means, and they
are the reason a leaked admin password is far less dangerous in a modern cloud environment
than it was on a 2010 file server. Single sign-on reduces the *number* of credentials;
federation lets one identity work across systems; vaulting stores secrets. None of them make
a credential expire in an hour.

---

## Domain 2 — Threats, vulnerabilities, and mitigations (22%)

### Q6. An attacker leaves a USB drive labelled "Payroll 2026" in a company car park. Which type of threat actor motivation does this most directly exploit?

- [ ] Financial gain
- [ ] Ideological
- [x] **Human curiosity and the desire to be helpful**
- [ ] Nation-state espionage

**Why:** This is a **baiting** attack, and it works on ordinary human traits rather than on a
technical flaw. The exam expects you to recognise **social engineering** as the category:
the attacker did not hack anything, they relied on someone plugging in a drive. The reason to
know this precisely is that the control is *training and policy*, not antivirus.

### Q7. Which attack involves an attacker positioning themselves between a user and a website to read and modify traffic?

- [ ] SQL injection
- [ ] Cross-site scripting
- [x] **On-path attack**
- [ ] Privilege escalation

**Why:** An on-path attack (the modern name for **man-in-the-middle**) is the interception
and possible *modification* of traffic in transit. Note the modifier: on-path attacks are
what TLS exists to prevent, which is why certificate warnings are a security control and not
an inconvenience. SQL injection targets a database and XSS targets a browser; neither
requires the attacker to sit in the middle.

### Q8. A vulnerability scan reports "CVE-2021-44228 (Log4Shell) — critical" on an internal server that has no internet-facing services. What is the correct next step?

- [ ] Ignore it, since the server is internal
- [ ] Immediately disconnect the server from the network
- [x] **Assess the risk in context — determine whether the vulnerable component is reachable and what data the server holds**
- [ ] Reboot the server to clear the vulnerability

**Why:** A scanner reports a **vulnerability**; it cannot report your **risk**. An internal
server with no path to the vulnerable component may be low risk; an internal server holding
customer data reachable by a compromised workstation may be critical. This is the
vulnerability-versus-risk distinction from Q3 applied to a real decision — and "ignore it
because it is internal" is the answer that gets people breached, because internal-only is a
network position, not a security property.

### Q9. Which of the following is an example of an insider threat?

- [ ] A worm spreading through unpatched SMB shares
- [x] **A departing employee copying the customer database to personal cloud storage**
- [ ] A phishing email that harvests credentials
- [ ] A DDoS attack on the public website

**Why:** An insider threat is abuse of **legitimate access**, which is why it is hard to
detect with perimeter controls — the traffic is authenticated and authorised. A departing
employee with valid credentials looks normal to a firewall. Controls that address it are
data-loss prevention, least privilege, and offboarding process, not antivirus.

### Q10. An attacker registers `micros0ft-support.com` and sends email from it. Which technique is being used?

- [ ] Domain hijacking
- [x] **Typosquatting**
- [ ] DNS poisoning
- [ ] Subdomain takeover

**Why:** Registering a lookalike domain is **typosquatting** (or URL spoofing). Domain
hijacking means taking over a domain someone else already owns; DNS poisoning corrupts
resolution of the *real* domain. The distinction matters because the controls differ —
typosquatting is caught by user training and domain monitoring, DNS poisoning by DNSSEC.

### Q11. Which threat is most likely to be introduced by a third-party software library added to an application?

- [ ] Zero-day in the operating system
- [x] **Supply chain compromise**
- [ ] Physical theft
- [ ] Misconfiguration of the firewall

**Why:** A dependency you did not write, maintained by people you do not know, running with
your application's privileges, is a supply chain risk — and it is the reason a software bill
of materials (SBOM) exists. Most modern applications are mostly third-party code by volume,
so this is not a hypothetical category.

### Q12. A user's account is being used to send spam, but the user's password has not changed and they have not clicked anything suspicious. Which is the most likely explanation?

- [ ] The password was guessed
- [x] **A session token or API key was stolen**
- [ ] The account was brute-forced
- [ ] Email spoofing

**Why:** If nothing the user *did* explains it, stop looking at the user. Stolen session
tokens and API keys grant access without needing the password at all, which is why token
theft has become a primary attack path against cloud accounts. This is also why "reset the
password" does not fix a stolen-token compromise — you must revoke the sessions.

### Q13. Which of these best describes a zero-day vulnerability?

- [ ] A vulnerability that has been known for less than a day
- [x] **A vulnerability for which no vendor patch exists yet**
- [ ] A vulnerability that causes no damage
- [ ] A vulnerability in a brand-new product

**Why:** "Zero-day" is about **patch availability**, not about age. A vulnerability can be a
zero-day for years if the vendor never fixes it. The practical consequence is the reason the
term matters: you cannot patch what has no patch, so your controls for a zero-day are
compensating ones — segmentation, monitoring, least privilege — rather than a patch cycle.

### Q14. An attacker uses a valid employee's credentials to log in from an unusual country at 3am. Which detection approach is most likely to catch this?

- [ ] Signature-based antivirus
- [x] **Behavioural analytics on login patterns**
- [ ] A firewall rule blocking foreign IPs
- [ ] File integrity monitoring

**Why:** The credentials are valid, so nothing signature-based fires and the login is
authorised. What is anomalous is the **behaviour** — impossible travel, unusual hours,
unfamiliar location. This is the case user and entity behaviour analytics (UEBA) exists for,
and it is a good example of why "was the login authorised?" is the wrong question to be
asking.

---

## Domain 3 — Security architecture (18%)

### Q15. A company wants to isolate a compromised workstation from the rest of the network while still allowing it to be investigated. Which approach fits best?

- [ ] Turn off the switch port permanently
- [x] **Move the port to a quarantined VLAN**
- [ ] Block the workstation's MAC address
- [ ] Apply a firewall rule at the perimeter

**Why:** A quarantine VLAN isolates the machine *and* keeps it reachable for investigation,
which is the definition of what is being asked. Powering off the port destroys volatile
evidence. Blocking a MAC address is trivially bypassed by changing it. A perimeter rule does
nothing for lateral movement inside the network, which is what a compromised workstation
threatens.

### Q16. Which cloud model places the greatest responsibility for security on the customer?

- [ ] SaaS
- [ ] PaaS
- [x] **IaaS**
- [ ] All three place equal responsibility on the customer

**Why:** The shared responsibility model moves with the service model. In **IaaS** the
provider secures the physical host and hypervisor, and you secure everything above it —
operating system, patching, firewall, application, data. That is the most customer
responsibility, not the least. In **SaaS** the provider carries the most and you are mostly
responsible for your data and your users.

### Q17. A server holds a database encryption key in memory while running. Which attack specifically targets this?

- [ ] Phishing
- [x] **Cold boot attack**
- [ ] SQL injection
- [ ] Cross-site request forgery

**Why:** A cold boot attack freezes or rapidly reboots a machine so that memory contents —
including keys — survive briefly and can be read. It is a **physical access** attack, which
is why full-disk encryption does not protect a running server from someone who can reach the
hardware, and why key management and physical controls matter separately from encryption.

### Q18. Which is the primary purpose of network segmentation?

- [ ] To increase available bandwidth
- [x] **To limit how far an attacker can move after compromising one host**
- [ ] To reduce the cost of switches
- [ ] To simplify DNS configuration

**Why:** Segmentation is a **containment** control. The assumption is that something will
eventually be compromised; the question is what it can reach afterwards. This is why
flattened networks are dangerous even when every host is patched — one phishing email
becomes the whole estate. It is also the assumption behind zero trust.

### Q19. An organisation requires that a user prove identity with a password and a hardware key. What is this called?

- [ ] Single sign-on
- [ ] Multifactor authentication only if the two factors are different types
- [x] **Multifactor authentication**
- [ ] Role-based access control

**Why:** Multifactor authentication requires two or more factors of **different types** —
something you know, have, or are. A password (know) plus a hardware key (have) qualifies.
Note the trap in option two: two passwords, or a password plus a security question, are both
"something you know" and are **not** multifactor, however many steps the login screen has.

### Q20. Which of these is a compensating control?

- [ ] A control that replaces a failed control entirely
- [x] **A control that provides an alternative way to mitigate a risk when the primary control cannot be applied**
- [ ] A control that compensates employees for security work
- [ ] A control applied only in the cloud

**Why:** Compensating controls are what you use when the ideal control is impossible — for
example, a legacy system that cannot be patched, so you segment it and monitor it heavily
instead. The distinction that matters is that the **risk is still addressed**; "we could not
patch it" is not a compensating control, it is an accepted risk, and saying so is part of the
job.

### Q21. Where should a TLS-terminating reverse proxy sit in a typical three-tier web architecture?

- [ ] Behind the database
- [x] **In front of the web servers, between the internet and the application**
- [ ] On the database server
- [ ] On the client's machine

**Why:** TLS termination happens at the edge, in front of the web tier, so that the
certificate and cipher configuration live in one place and the back end can be re-encrypted
or kept on a trusted network. It is also where a WAF and rate limiting usually sit, which is
why this position matters for more than encryption.

---

## Domain 4 — Security operations (28%)

### Q22. An incident responder arrives at a compromised laptop that is still powered on. What should they do first?

- [ ] Shut it down immediately to stop the attack
- [x] **Capture volatile evidence such as memory and running processes before anything changes**
- [ ] Run a full antivirus scan
- [ ] Reimage the machine

**Why:** This is the **order of volatility** and it is one of the most reliably tested ideas in
Security+. Memory and running processes are lost the moment the machine powers off; disk
contents survive. Shutting down first destroys the most perishable evidence. Running a scan
or reimaging both modify the system and destroy evidence as well.

### Q23. A SIEM alerts on 400 failed logins for one account followed by a success. What is the most important immediate action?

- [ ] Close the alert as a false positive — the user probably forgot their password
- [ ] Change the account's password
- [x] **Investigate the successful login, then contain the account**
- [ ] Block the source IP and consider the incident closed

**Why:** The **successful** login is the event that matters, and the failures are only
context. Password spraying ends this way by design, so the question is not "were there
failures" but "what did the attacker do after getting in". Changing the password without
investigating loses the answer, and blocking one IP assumes a single source — which spraying
specifically avoids.

### Q24. Which document defines the steps to follow during a specific type of incident?

- [ ] Business continuity plan
- [x] **Incident response playbook**
- [ ] Disaster recovery plan
- [ ] Acceptable use policy

**Why:** A **playbook** is the step-by-step procedure for a specific scenario — ransomware,
phishing, data loss. An incident response *plan* is the overall framework; the playbook is
what an analyst actually opens at 3am. Business continuity and disaster recovery are about
keeping the organisation running and restoring systems, which is a different question from
handling an intruder.

### Q25. An analyst wants to identify which internal hosts are communicating with a known malicious IP address. Which data source is most useful?

- [ ] Antivirus logs
- [x] **Firewall and proxy logs**
- [ ] Asset inventory
- [ ] Password policy

**Why:** Outbound connection records are exactly what firewall and proxy logs contain, and
matching them against threat intelligence is the standard detection for command-and-control
traffic. Antivirus logs record file-based detections, which may never fire for a
network-only compromise. The exam pairs "who talked to a bad IP" with network logs almost
every time.

### Q26. Which of these is the best example of a detective control?

- [ ] A firewall
- [ ] Encryption at rest
- [x] **Log monitoring with alerting**
- [ ] A locked server room door

**Why:** Detective controls **identify** events after or during them; preventive controls stop
them. Log monitoring detects; a firewall and a lock prevent; encryption protects
confidentiality but neither stops nor detects an intrusion. Getting the control *category*
right matters because exam questions routinely ask which category a given measure belongs to.

### Q27. A user reports that their files are encrypted and a ransom note demands payment in cryptocurrency. What is the FIRST priority?

- [ ] Pay quickly to get a discount
- [ ] Run a decryption tool downloaded from the internet
- [x] **Contain the spread and preserve evidence, then determine the scope**
- [ ] Reboot the machine

**Why:** Ransomware is an **active** incident, so stopping propagation comes before recovery —
an encrypted laptop is a loss, an encrypted domain controller is a catastrophe. Reboots
destroy memory evidence and can trigger further encryption. Downloading "decryption tools"
from a search result is a well-known second-stage attack targeting exactly the people in this
situation.

### Q28. Which log source would best help determine whether an attacker moved laterally from a workstation to a server?

- [ ] The workstation's antivirus log
- [x] **Authentication logs on the server, showing logons from the workstation**
- [ ] The server's disk usage
- [ ] The workstation's browser history

**Why:** Lateral movement is **authentication** from one host to another, so the
discriminating evidence is on the destination — who logged in, from where. This is why
centralising authentication logs matters: the server's own log is the only one that records
the successful pivot, and it may be the machine the attacker later wipes.

### Q29. An organisation wants to test its incident response process without the knowledge of most staff. Which exercise type is this?

- [ ] Tabletop exercise
- [x] **Red team engagement**
- [ ] Vulnerability scan
- [ ] Compliance audit

**Why:** A **red team** engagement is a full adversary simulation and, by design, most of the
organisation does not know it is happening — which is what makes it a test of the *response*,
not just the defences. A **tabletop** is discussion-based and everyone knows. That contrast
is the whole question: the word to notice is "without the knowledge of most staff".

### Q30. What is the purpose of hashing a file and recording the hash during forensic collection?

- [ ] To compress the file
- [x] **To demonstrate the file has not been altered since collection**
- [ ] To encrypt the file
- [ ] To make the file smaller

**Why:** A hash is an **integrity** check — if the file changes, the hash changes. This is what
makes evidence admissible: not that it is secret, but that you can show it is unmodified. It
is why forensic copies are verified and why the original is preserved. Note that hashing is
not encryption and does not hide anything.

### Q31. Which identity control most directly limits the damage from a compromised service account?

- [ ] Longer, more complex passwords
- [x] **Granting the account only the permissions it actually needs**
- [ ] Rotating the password every 30 days
- [ ] Enabling account lockout after failed attempts

**Why:** A service account's password is stored somewhere and may leak; the factor you control
is its **blast radius**. Least privilege means a compromised service account can do little.
Password complexity and rotation help against guessing but do nothing about what an attacker
can reach once in — and mandatory rotation, done badly, often results in secrets committed to
repositories.

### Q32. A vulnerability scan and a penetration test differ mainly in that a penetration test:

- [ ] Is automated and a scan is manual
- [x] **Actively attempts to exploit findings and chains them together**
- [ ] Only covers web applications
- [ ] Requires no authorisation

**Why:** A scan **lists** potential issues; a pen test **exploits** them and, crucially, chains
them — two medium findings can combine into a critical path. That chaining is what a scanner
structurally cannot do, and it is why the two are complementary rather than substitutes.
Note that a pen test absolutely requires written authorisation; testing without it is a crime
in most jurisdictions, not a grey area.

---

## Domain 5 — Security program management and oversight (20%)

### Q33. Which framework is most commonly used to assess and improve an organisation's cybersecurity posture through a voluntary, prioritised set of safeguards?

- [ ] PCI DSS
- [x] **NIST Cybersecurity Framework**
- [ ] GDPR
- [ ] ISO 9001

**Why:** The NIST CSF is the voluntary framework — Identify, Protect, Detect, Respond,
Recover — and it is deliberately outcome-based so any organisation can use it. PCI DSS is
mandatory for card data and prescriptive; GDPR is a privacy **law**, not a security framework;
ISO 9001 is quality management. Read the question for "voluntary" and "prioritised
safeguards" and the answer is unambiguous.

### Q34. A company must comply with a regulation requiring cardholder data to be protected. Which standard applies?

- [ ] HIPAA
- [x] **PCI DSS**
- [ ] SOC 2
- [ ] NIST CSF

**Why:** Cardholder data is PCI DSS by definition. HIPAA covers health information, SOC 2 is an
audit report about controls (not a prescriptive standard for cards), and NIST CSF is voluntary.
These four appear together constantly, so it is worth knowing what each is *for*: the question
is almost always solved by identifying the data type named.

### Q35. Which of these is a *risk acceptance* response?

- [ ] Installing a patch that fixes the vulnerability
- [ ] Purchasing cyber insurance and continuing unchanged
- [x] **Documenting that a low-impact vulnerability will not be fixed, with sign-off**
- [ ] Removing the vulnerable service entirely

**Why:** Risk acceptance is a **decision, recorded, with authority** — not an oversight.
Option two is risk **transfer** (insurance moves the financial consequence). Patching is risk
mitigation and removing the service is risk avoidance. The reason exam questions like this is
that "we just did not get around to it" is not acceptance; it is an undocumented risk, and the
difference is whether anyone with authority agreed to it.

### Q36. What is the primary purpose of a data classification policy?

- [ ] To reduce storage costs
- [x] **To determine the handling and protection requirements appropriate to each type of data**
- [ ] To encrypt everything
- [ ] To comply with GDPR automatically

**Why:** Classification exists so that protection can be **proportionate** — public marketing
material and customer payment records should not be handled the same way, and without labels
you cannot write a meaningful rule. Encryption is one possible control that follows from
classification, not the point of it.

### Q37. An organisation wants to verify that a vendor's security controls are effective. Which document would it request?

- [ ] The vendor's privacy policy
- [x] **A SOC 2 Type II report**
- [ ] The vendor's penetration test scan output
- [ ] The vendor's ISO 9001 certificate

**Why:** SOC 2 **Type II** covers the **effectiveness of controls over a period of time**,
which is exactly what is being asked. Type I covers design at a point in time — a real and
frequently tested distinction. A raw scan output is unaudited and shows findings, not whether
controls work; a privacy policy is a statement of intent.

### Q38. Which is the best example of a security awareness training failure that a technical control cannot compensate for?

- [ ] An unpatched server
- [x] **An employee reading a credit card number aloud to a caller claiming to be IT**
- [ ] A weak Wi-Fi password
- [ ] A misconfigured firewall

**Why:** The three wrong options are all **technical** problems with technical fixes. A social
engineering success against a trained employee is the case where no firewall helps — which is
why awareness training is a required control in every framework rather than a nice-to-have.
The scenario is **vishing** (Q4), now applied as a programme question.

### Q39. A third-party vendor will process customer data. What should be established before the work begins?

- [ ] A verbal agreement on security expectations
- [x] **A contract with defined security and data-handling obligations, plus a right to audit**
- [ ] Nothing — the vendor's certification is sufficient
- [ ] A firewall rule allowing the vendor access

**Why:** Third-party risk is managed **contractually** and verifiably. A certificate is a
point-in-time statement about a scope you have not seen; a verbal agreement is
unenforceable; a firewall rule is a technical access decision, not a governance one. The
right to audit is the clause that makes the rest checkable, which is why it appears in the
correct answer.

### Q40. After an incident, what is the primary purpose of a lessons-learned review?

- [ ] To assign blame
- [x] **To identify changes that would improve future detection and response**
- [ ] To satisfy the insurer
- [ ] To close the ticket

**Why:** The review exists to change something — a detection gap, a slow escalation, a missing
playbook. Blame destroys the honest reporting the review depends on, which is why
blameless post-mortems are standard practice rather than a courtesy. If a review produces no
change to a process or a control, it did not do its job.

---

## Scoring

**One mark per question, 40 total. No marks deducted for wrong answers — answer everything.**

The pass mark is 750/900 = **83.3%**, which is **33.3 questions**. So:

| Score | Percentage | What it means |
|---|---|---|
| 37–40 | 93–100% | Comfortable pass |
| 34–36 | 85–90% | Pass, but with no margin |
| **33** | **82.5%** | **Just under the line — a fail** |
| 29–32 | 73–80% | Clear fail |
| 24–28 | 60–70% | Substantially under-prepared |
| below 24 | — | Do not book yet |

### If you scored under 34

Find your weakest **domain** in the table at the top, not your weakest topic. Domain 4
(Security operations, 28%) carries more of this exam than any other, and it is the one people
skip because it is the least technical to read. A domain you scored 2/11 in is worth more
than three topics you scored 1/2 in.

**Study the phases, not this paper.** Every question here maps to material in
`career-roadmaps/cybersec-roadmap/` and `it-roadmap/`. Re-sitting this paper after reading
the answers measures your memory of *this paper*, which is not what the exam tests.

### If you scored 37 or above

Do not conclude you are ready. These are 40 questions; the real exam draws up to 90 from
objectives this paper samples, and it includes **performance-based questions** — drag-and-drop
and simulated environments — which no multiple-choice paper can represent. Book when you can
also explain *why* each answer is right, out loud, without the options in front of you.

---

## Where each domain is taught

| Domain | Curriculum phases |
|---|---|
| 1. General security concepts | `cybersec-roadmap/01-phase-foundations.md` |
| 2. Threats, vulnerabilities, and mitigations | `cybersec-roadmap/01-phase-foundations.md`, `cybersec-roadmap/03-phase-security-fundamentals.md` |
| 3. Security architecture | `it-roadmap/03-phase-networking-basics.md`, `cybersec-roadmap/09-phase-cloud-and-identity.md` |
| 4. Security operations | `cybersec-roadmap/10-phase-detection-engineering.md`, `cybersec-roadmap/11-phase-incident-response.md` |
| 5. Programme management and oversight | `cybersec-roadmap/13-phase-grc-compliance.md`, `advance-roadmap/06-phase-programme-and-influence.md` |

**Read the certification phase before you book anything.**
`cybersec-roadmap/07-phase-certifications.md` argues that a certificate can replace the
feeling of progress without producing the substance of it, and that the honest answer to
"should I pay for this exam?" is sometimes *no*. This paper tells you whether you would pass.
It cannot tell you whether passing is the right use of your money.

---

*Unofficial practice questions written for this repository against CompTIA's published
SY0-701 objectives. Not affiliated with or endorsed by CompTIA. Exam details checked
2026-09-18 — confirm current details with CompTIA before booking.*
