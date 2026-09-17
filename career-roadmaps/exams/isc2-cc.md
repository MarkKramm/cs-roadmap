---
id: exam-isc2-cc
exam: "ISC2 Certified in Cybersecurity (CC)"
code: CC
questions: 40
real_exam_questions: 125
real_exam_minutes: 120
pass_mark: 700
pass_scale: 1000
blueprint_checked: 2026-09-18
source: "https://www.isc2.org/certifications/cc/cc-certification-exam-outline"
---

# ISC2 Certified in Cybersecurity (CC) — practice questions

**Unofficial.** Written for this repository against ISC2's published CC exam outline. Not real
exam questions, not endorsed by ISC2.

| | |
|---|---|
| **Exam code** | CC |
| **Real exam** | **100–125 items, 2 hours** |
| **Pass mark** | **700** on a scale of 1000 |
| **Format** | **Adaptive (Computerized Adaptive Testing)** |
| **This paper** | **40 questions** — see the note below |

## Before you start

**Do this closed-book, in one sitting, in 40 minutes.** The real exam gives 2 hours for 100–125
items, which is roughly **one minute per question**. 40 minutes for 40 questions matches that pace.

**700/1000 is 70%**, which is **28 questions** out of 40:

| Your score out of 40 | Percentage | Verdict |
|---|---|---|
| 32–40 | 80–100% | Comfortable pass |
| **28–31** | **70–78%** | **Pass** |
| 27 | 67.5% | Fail — just under the line |
| 24–26 | 60–65% | Clear fail |
| below 24 | — | Substantially under-prepared |

### The real exam is adaptive — and this paper is not

This is the most important limitation of this paper, and it is worth understanding rather than
skipping.

**ISC2 CC is delivered by Computerized Adaptive Testing (CAT).** The exam does not hand you a
fixed set of questions. It selects each question based on how you answered the previous ones: get
one right, the next is harder; get one wrong, the next is easier. It converges on an estimate of
your ability and stops when that estimate is precise enough — which is why the item count is a
**range (100–125)** rather than a fixed number.

Three consequences follow, and none of them are captured by a linear 40-question paper:

- **You cannot skip and return.** There is no going back to a question; each answer determines
  what you see next.
- **A hard exam is not a failing exam.** Because the test gets harder as you do well, a run of
  difficult questions is evidence you are *succeeding*, not failing. Candidates routinely misread
  this and lose composure. Do not use how hard it feels as a progress signal.
- **There is no partial credit and no pattern to exploit.** Adaptive delivery makes guessing
  strategy useless beyond "always answer".

**Treat this paper as a knowledge check, not a rehearsal.** It will tell you whether you know the
material. It cannot rehearse the experience.

## How it is weighted

ISC2 publishes five domains with these average weights:

| Domain | Official weight | Questions here | Share of this paper |
|---|---|---|---|
| 1. Security Principles | **24%** | 10 | 25% |
| 2. Security Governance | 17.3% | 7 | 17.5% |
| 3. Identity and Access Management (IAM) Concepts | 20% | 8 | 20% |
| 4. Networking and Cloud Security Concepts | 21.3% | 8 | 20% |
| 5. Security Operations and Incident Response | 17.3% | 7 | 17.5% |

**ISC2 states the weights total 100%**, and they sum to 99.9% as published because 17.33% is
rounded down to 17.3% — twice. The rounding is ISC2's, not a transcription error here.

**Security Principles is the largest domain at 24%** and it is the one that rewards understanding
rather than memorisation: it is about why controls exist, not what they are called.

### A note on the blueprint's date

The outline this paper was written against is **effective 1 September 2026** and has **five**
domains. Earlier CC outlines described a different set, including a combined "Business Continuity,
Disaster Recovery and Incident Response Concepts" domain — **that name is not in the current
blueprint** and this paper does not use it.

You may still find that older structure in third-party study material, because much of it predates
the change. If you are studying from a book or course that lists a BC/DR/IR domain, check its
publication date against the current outline. ISC2 also states that **AI security concepts are
integrated across all five domains** rather than occupying a domain of their own.

**CC is free to take** — ISC2's One Million Certified in Cybersecurity programme has offered the
exam and self-paced training at no cost. Confirm current eligibility with ISC2, because this is
the one exam in this directory where the cost argument may not apply at all. Note the catch: the
exam may be free, but maintaining the certification afterwards carries an annual fee.

---

## Domain 1 — Security Principles (24%)

### Q1. What does the CIA triad represent?

- [ ] Confidentiality, Integrity, Authentication
- [x] **Confidentiality, Integrity, Availability**
- [ ] Control, Inspection, Audit
- [ ] Compliance, Identity, Access

**Why:** The triad is **Confidentiality, Integrity, Availability** — the three properties security
work exists to protect. Confidentiality keeps data secret, integrity keeps it accurate and
unmodified, availability keeps it reachable. **Authentication** is a mechanism used to achieve
these, not one of the three. Every control you will ever meet serves at least one of the three, and
naming which is often the fastest route to the right answer.

### Q2. Which principle states that a user should have only the access required to perform their
job?

- [ ] Separation of duties
- [x] **Least privilege**
- [ ] Defence in depth
- [ ] Need to know

**Why:** **Least privilege** limits access to the minimum necessary. **Need to know** is closely
related but narrower — it applies specifically to *information* rather than access generally, which
is why it is the tempting wrong answer and why questions distinguish them. Separation of duties
splits a process across people; defence in depth layers controls. ISC2 uses these four terms
precisely and expects you to.

### Q3. What is defence in depth?

- [ ] Using the strongest possible single control
- [x] **Layering multiple independent controls so that no single failure compromises security**
- [ ] Encrypting all data
- [ ] Hiring more security staff

**Why:** Defence in depth assumes **any single control can fail**, so you layer them — a firewall,
plus endpoint protection, plus least privilege, plus monitoring. The assumption is the point: not
that each layer is weak, but that no layer is perfect. It is the same logic as "assume breach" in
zero trust, and ISC2 states it as a core principle.

### Q4. An organisation classifies information and restricts access based on that classification.
Which principle is being applied?

- [ ] Least privilege
- [x] **Need to know**
- [ ] Separation of duties
- [ ] Non-repudiation

**Why:** **Need to know** restricts access to information based on whether the person requires it
for their role — and classification is the label that makes that judgement possible. It is
information-specific, which is what distinguishes it from least privilege (Q2), which is about
access in general. Note how the pair interlocks: classification labels the data, need to know
decides who may see it.

### Q5. What is the purpose of separation of duties?

- [ ] To reduce the number of employees needed
- [x] **To ensure that no single person can complete a sensitive action alone**
- [ ] To keep departments independent
- [ ] To enforce working hours

**Why:** Separation of duties splits a sensitive process — creating a payment and approving it —
across two people so fraud requires collusion. This is a **preventive** control against insider
abuse, and it is why it appears alongside mandatory vacation and job rotation in fraud controls:
all three break up the conditions that let one person conceal wrongdoing.

### Q6. Which of these is an example of a physical control?

- [ ] A firewall rule
- [x] **A locked door with badge access**
- [ ] A password policy
- [ ] Encryption at rest

**Why:** Controls are categorised by **type**, and physical controls act on the physical
environment — locks, badges, guards, bollards, CCTV. Firewalls and encryption are technical;
password policies are administrative. ISC2 asks which category a control belongs to, so learning
the three categories (physical, technical, administrative) and being able to sort examples is worth
more than memorising individual controls.

### Q7. What is the difference between a policy, a standard, a procedure and a guideline?

- [ ] They are interchangeable terms
- [x] **A policy states intent; a standard is a mandatory requirement; a procedure is the step-by-step method; a guideline is recommended advice**
- [ ] A policy is technical and a standard is administrative
- [ ] A procedure is optional and a guideline is mandatory

**Why:** The **hierarchy** runs from intent to action, and the distinguishing feature of each is
how binding it is. Policies are high-level and mandatory; standards are specific and mandatory;
procedures are how-to and mandatory for the task; guidelines are recommended and **not** mandatory.
Getting "guideline = optional" the right way round is the usual point of the question.

### Q8. What is the purpose of risk management?

- [ ] To eliminate all risk
- [x] **To identify, assess and treat risk so that decisions about it are informed and documented**
- [ ] To purchase insurance
- [ ] To comply with regulations

**Why:** Risk cannot be eliminated — only understood and **treated**: mitigated, transferred,
avoided or accepted. The purpose is informed decision-making, and the four treatment options are
what ISC2 expects you to know by name. Purchasing insurance is one treatment (transfer), not the
discipline; compliance is a driver of risk work, not its purpose.

### Q9. An organisation decides to accept a risk rather than mitigate it. What must accompany that
decision?

- [ ] Nothing — acceptance requires no documentation
- [x] **Documentation and approval by someone with the authority to accept it**
- [ ] A technical control
- [ ] Notification of the regulator

**Why:** Risk acceptance is a **recorded decision by an accountable person** — that is what makes
it acceptance rather than neglect. The distinction matters because unrecorded, unapproved tolerance
of risk is exactly what an auditor will treat as a finding. Someone must own it, and the ownership
must be traceable.

### Q10. Which of these best describes the relationship between a vulnerability, a threat and a
risk?

- [ ] They are the same thing at different scales
- [x] **A threat exploits a vulnerability; the risk is the potential for loss if it does**
- [ ] A risk exploits a threat
- [ ] A vulnerability is always a threat

**Why:** The chain is **threat → exploits → vulnerability → producing → risk**. A vulnerability is
a weakness; a threat is something that could act on it; risk is the potential loss from that
combination. This vocabulary is foundational to the whole exam, and ISC2 tests it directly because
imprecise use of these three words is the most common way security discussions go wrong.

---

## Domain 2 — Security Governance (17.3%)

### Q11. What is the primary purpose of security governance?

- [ ] To configure firewalls
- [x] **To direct and hold the organisation accountable for security through policy, roles and oversight**
- [ ] To perform penetration tests
- [ ] To manage user accounts

**Why:** **Governance** is the direction and accountability layer — who decides, who is responsible,
and how performance is measured. It sits above the technical controls, which implement what
governance decides. This distinction is central to the domain: many controls questions describe
*implementation*, and governance questions describe *decision rights and oversight*.

### Q12. Which document would define the organisation's overall security intent and be approved at
the highest level?

- [ ] An incident response procedure
- [x] **An information security policy**
- [ ] A firewall rule set
- [ ] An asset register

**Why:** The top-level **security policy** states intent and is approved by senior management, which
is what gives everything below it authority. Procedures, rule sets and registers are all
implementation or record-keeping artefacts. If a question describes something approved by the board
or expressing overall intent, it is asking for the policy.

### Q13. What is the purpose of a risk assessment?

- [ ] To fix all identified vulnerabilities
- [x] **To identify assets and threats, and estimate the likelihood and impact of harm**
- [ ] To produce a compliance certificate
- [ ] To test incident response

**Why:** A risk assessment produces **estimates** — likelihood and impact — that allow
prioritisation. It does not fix anything; remediation is a separate decision made *using* the
assessment. That separation is worth holding onto: conflating the assessment with the response is
how organisations end up fixing the loudest finding rather than the largest risk.

### Q14. Who is accountable for risk in an organisation?

- [ ] The security team alone
- [x] **Senior management or the business owner of the asset — risk ownership sits with the business**
- [ ] The IT helpdesk
- [ ] The auditor

**Why:** **Risk is owned by the business**, not by security. The security team identifies and
advises; the business owner decides and accepts the consequences. This is a deliberate principle
rather than an organisational preference: if security owns the risk, the business has no incentive
to make informed trade-offs, and security becomes a blocker rather than an adviser.

### Q15. What does a business impact analysis (BIA) determine?

- [ ] Which staff are most productive
- [x] **Which business functions are critical and what the impact of their disruption would be**
- [ ] Which vulnerabilities are most severe
- [ ] Which controls cost the most

**Why:** A **BIA** establishes what matters and how badly it hurts when it stops — which is what
sets recovery priorities. It is the input to continuity and recovery planning: without a BIA you
cannot know what to restore first. Note it measures **business** impact, not technical severity —
the two often disagree.

### Q16. What is the difference between a business continuity plan and a disaster recovery plan?

- [ ] They are the same document
- [x] **Business continuity keeps critical business functions running through a disruption; disaster recovery restores IT systems and data afterwards**
- [ ] Continuity is for IT and recovery is for staff
- [ ] Recovery is optional

**Why:** Continuity is about **keeping the business operating** — manual workarounds, alternate
sites, agreed priorities. Recovery is about **restoring the technology**. The relationship is
sequential: continuity covers the disruption while recovery restores capability. Conflating them
produces a plan that restores servers while the business has already lost its customers.

### Q17. Which regulation is most directly concerned with the protection of personal data in the EU?

- [ ] HIPAA
- [x] **GDPR**
- [ ] PCI DSS
- [ ] SOX

**Why:** **GDPR** governs personal data of EU residents, with worldwide reach for organisations
handling it. HIPAA is US healthcare, PCI DSS is card data (a standard rather than a law), and SOX
is US financial reporting. ISC2 expects you to recognise the major regulations and what each
governs, because the question is nearly always solved by identifying the **data type** named.

---

## Domain 3 — Identity and Access Management (IAM) Concepts (20%)

### Q18. What is the difference between authentication and authorization?

- [ ] They are the same process
- [x] **Authentication verifies identity; authorization determines what that identity may access**
- [ ] Authorization happens first
- [ ] Authentication applies to systems and authorization to people

**Why:** Authentication is **who you are**; authorization is **what you may do**, and it depends on
the first. Keeping them separate is not pedantry — an account can authenticate perfectly and still
be denied access, and knowing which step failed determines the fix. Option three reverses the
order, which is impossible.

### Q19. Which of these is a biometric authentication factor?

- [ ] A password
- [ ] A smart card
- [x] **A fingerprint**
- [ ] A PIN

**Why:** A **fingerprint** is something you *are*. A password and a PIN are something you *know* —
note that a PIN is not biometric merely because it is short, which is the usual trap. A smart card
is something you *have*. The three factor types are the framework: know, have, are.

### Q20. What is single sign-on (SSO)?

- [ ] Using one password for every account
- [x] **Authenticating once to gain access to multiple systems without re-entering credentials**
- [ ] A password manager
- [ ] Sharing a login between colleagues

**Why:** SSO is **one authentication, many systems**, usually achieved with federation or tokens.
The wrong options describe genuinely bad practices — reusing one password, or sharing accounts — and
the exam uses them because they *sound* similar to SSO while being security failures. SSO reduces
credential sprawl and, importantly, makes revocation central: disabling one identity cuts off
everything.

### Q21. What is the purpose of role-based access control (RBAC)?

- [ ] To assign permissions to each user individually
- [x] **To assign permissions to roles, and users to roles, so access is managed consistently**
- [ ] To encrypt data by role
- [ ] To log user activity

**Why:** RBAC assigns permissions to **roles** rather than individuals, which scales: a new starter
gets the role, not a bespoke set of rights, and permissions are reviewed once per role rather than
per person. Direct per-user assignment is what RBAC replaces. This is also how least privilege
becomes practical rather than an aspiration.

### Q22. Which access control model makes decisions based on attributes such as department, location
and time of day?

- [ ] Discretionary access control (DAC)
- [ ] Mandatory access control (MAC)
- [x] **Attribute-based access control (ABAC)**
- [ ] Role-based access control (RBAC)

**Why:** **ABAC** evaluates **attributes** — of the user, the resource and the context — which
makes it the most granular and the basis of modern conditional-access engines. DAC lets the resource
owner decide; MAC enforces labels set by a central authority. The acronyms are worth learning
precisely, because exam questions describe a scenario and expect you to name the model.

### Q23. What is privileged access management (PAM) designed to address?

- [ ] Ordinary user passwords
- [x] **The risk posed by accounts with elevated rights, through vaulting, rotation and session monitoring**
- [ ] Network bandwidth
- [ ] Data classification

**Why:** PAM targets the accounts that matter most — administrative and service accounts — and
concentrates on **controlling and recording** their use: credentials vaulted rather than known,
rotated after use, sessions monitored. The reasoning is that an attacker with admin rights has
already won, so these accounts get disproportionate protection. It is distinct from general IAM,
which covers all users.

### Q24. What is the purpose of an access review?

- [ ] To test password strength
- [x] **To periodically verify that users still need their current access, and remove what they no longer do**
- [ ] To review security incidents
- [ ] To audit firewall rules

**Why:** Access **accumulates** as people change roles, and unused rights are the raw material of
lateral movement. A periodic review forces an accountable re-check. This is governance work with a
technical outcome, and it is the control that catches the "left the company last year but still has
an account" class of finding.

### Q25. Which of these is a key characteristic of multifactor authentication?

- [ ] It requires two passwords
- [x] **It combines factors of different types, such as something you know and something you have**
- [ ] It requires a long password
- [ ] It is only used for administrators

**Why:** MFA requires **different factor types**. Two passwords, or a password plus a security
question, are both "something you know" and are **not** multifactor no matter how many steps the
login screen has. The reason the distinction matters in practice is that password-plus-security-
question is a common and false sense of MFA protection.

---

## Domain 4 — Networking and Cloud Security Concepts (21.3%)

### Q26. What does a firewall do?

- [ ] Scans files for malware
- [x] **Allows or blocks network traffic according to rules**
- [ ] Encrypts network traffic
- [ ] Assigns IP addresses

**Why:** A firewall filters **traffic** by rule — source, destination, port, protocol. It does not
scan file contents (that is antivirus or an inspection appliance), does not encrypt (that is TLS or
a VPN), and does not allocate addresses (that is DHCP). ISC2 tests control *function* precisely,
and firewalls are the control most often misdescribed.

### Q27. What is the purpose of network segmentation?

- [ ] To increase bandwidth
- [x] **To divide a network into isolated segments so that compromise of one does not expose the others**
- [ ] To simplify routing
- [ ] To reduce cabling costs

**Why:** Segmentation is **containment** — it limits lateral movement after a compromise, on the
assumption that something will eventually be breached. This is why a flat network is dangerous even
when everything is patched. It is the same reasoning that appears in the IT and Network+ papers, and
ISC2 states it as a core network security principle.

### Q28. Which protocol encrypts web traffic between a browser and a server?

- [ ] HTTP
- [x] **TLS (HTTPS)**
- [ ] FTP
- [ ] Telnet

**Why:** **TLS** encrypts and authenticates the connection; HTTPS is HTTP carried over TLS. HTTP,
FTP and Telnet are all cleartext — and Telnet is the classic example of a management protocol whose
credentials are readable by anyone on the path. The exam expects you to know which protocols protect
their traffic and which do not.

### Q29. What is a man-in-the-middle (on-path) attack?

- [ ] An attacker guesses a password
- [x] **An attacker intercepts communications between two parties, reading or altering them**
- [ ] An attacker floods a server with traffic
- [ ] An attacker infects a website

**Why:** An on-path attacker positions themselves **between** the parties, which is what TLS exists
to prevent — and why certificate warnings are a security control rather than an annoyance. Flooding
a server is denial of service; infecting a website is a different attack. The reason ISC2 uses
"on-path" alongside "man-in-the-middle" is that the newer term is more accurate: the attacker need
not be a person in the middle of a physical path.

### Q30. What is the shared responsibility model in cloud computing?

- [ ] The provider is responsible for all security
- [x] **Security duties are divided between the provider and the customer, and the split depends on the service model**
- [ ] The customer is responsible for all security
- [ ] Responsibility is shared equally in all models

**Why:** The split moves with the service model — the customer's share is **largest in IaaS and
smallest in SaaS**, because in IaaS you still manage the operating system, patching and application.
Neither party is responsible for everything, and "equally in all models" is false precisely because
the boundary shifts. Misunderstanding this is the most common source of cloud misconfiguration.

### Q31. Which cloud service model places the greatest security responsibility on the customer?

- [ ] SaaS
- [ ] PaaS
- [x] **IaaS**
- [ ] All models are equal

**Why:** In **IaaS** the customer manages the operating system, runtime, application and data, while
the provider handles the physical layer and hypervisor. That is the **most** customer
responsibility, not the least — which is counterintuitive and therefore tested. It follows directly
from Q30: the lower the abstraction, the more you own.

### Q32. A company stores data in a public cloud. Who remains responsible for classifying that data?

- [ ] The cloud provider
- [x] **The customer — data classification and access decisions remain with the data owner**
- [ ] The regulator
- [ ] Nobody, once it is encrypted

**Why:** **You always own your data.** Classification, who may access it, and how long it is kept
are customer responsibilities in every cloud model, because only you know what the data means and
what obligations attach to it. A provider cannot classify data it does not understand. This is the
line in the shared responsibility model that never moves.

### Q33. What is the purpose of a virtual private network (VPN)?

- [ ] To make the internet faster
- [x] **To create an encrypted tunnel so traffic is protected from interception in transit**
- [ ] To block malware
- [ ] To assign IP addresses

**Why:** A VPN provides a **protected tunnel** over an untrusted network — which addresses
confidentiality and integrity in transit, not malware or speed. This is a recurring exam trap: a VPN
is frequently assumed to provide security it does not. It protects the traffic on the path; it does
nothing about what happens at either end.

---

## Domain 5 — Security Operations and Incident Response (17.3%)

### Q34. What is the FIRST step of the incident response process?

- [ ] Containment
- [x] **Preparation**
- [ ] Eradication
- [ ] Recovery

**Why:** **Preparation** comes first — the plans, tools, access and training that make every later
step possible. The classic sequence is preparation, detection and analysis, containment,
eradication, recovery, and lessons learned. ISC2 tests the **order**, and candidates commonly answer
"containment" because it feels like the urgent first action. Without preparation, containment is
improvised.

### Q35. During an active incident, why does containment come before eradication?

- [ ] Eradication is more expensive
- [x] **To stop the incident spreading before removing the cause, limiting damage**
- [ ] Containment is easier
- [ ] Eradication requires management approval

**Why:** Eradication can take time, and while you are removing the cause the attacker may still be
moving. **Containment first** stops the spread. This ordering is a deliberate risk decision: you
accept that the attacker is still present in order to prevent them reaching more. Note that
containment must not destroy evidence — which is why isolation is preferred over powering off.

### Q36. What is the purpose of a lessons-learned review after an incident?

- [ ] To assign blame
- [x] **To identify improvements to detection, response and controls**
- [ ] To satisfy auditors
- [ ] To close the ticket

**Why:** The review exists to **change something** — a detection gap, a slow escalation, a missing
playbook. Blame destroys the candid reporting the review depends on, which is why blameless
post-mortems are standard. If nothing in a process or control changed afterwards, the review was a
meeting rather than a review.

### Q37. What is the order of volatility, and why does it matter?

- [ ] The order in which systems boot
- [x] **The order in which evidence is lost, most perishable first — memory before disk**
- [ ] The order in which logs are written
- [ ] The severity order of incidents

**Why:** Evidence is collected **most perishable first** — memory, running processes, network
connections, then disk. Powering off a machine destroys everything in the first category, which is
why an investigator does not simply shut a compromised system down. The concept exists to prevent
the single most common destructive mistake in incident response.

### Q38. Which activity is part of security operations rather than security governance?

- [ ] Approving the security policy
- [x] **Monitoring logs and responding to alerts**
- [ ] Defining risk appetite
- [ ] Assigning risk ownership

**Why:** **Operations** is the continuous, day-to-day running of controls — monitoring, triage,
response, patching. Governance is decision rights and oversight (Q11). The two are complementary and
frequently confused in exam questions, so the test is whether the activity is **doing** or
**directing**: approving policy, setting risk appetite and assigning ownership are all direction.

### Q39. What is the purpose of a vulnerability scan?

- [ ] To exploit vulnerabilities
- [x] **To identify and report known weaknesses so they can be prioritised and remediated**
- [ ] To replace patching
- [ ] To test employee awareness

**Why:** A scan **identifies**; it does not exploit, and it does not fix. Exploitation is a
penetration test, and remediation is a separate decision made using the report. A scanner cannot
tell you your risk — it reports vulnerabilities, and judging which matter requires knowing what the
asset holds and whether the weakness is reachable. Treating the scan output as a to-do list in
severity order is a common and expensive mistake.

### Q40. An organisation wants to test its incident response capability without risking production
systems. Which approach is most appropriate?

- [ ] A full-scale live red team engagement
- [x] **A tabletop exercise walking through a scenario with the response team**
- [ ] A vulnerability scan
- [ ] A penetration test

**Why:** A **tabletop** is discussion-based and carries no risk to production — which is exactly
the requirement stated. A red team engagement tests defences by actually attacking, and a
penetration test does the same on a narrower scope; both carry real risk and neither is what "without
risking production systems" describes. Tabletop exercises are also the cheapest way to find the
gaps that only appear when people have to talk through a scenario together.

---

## Scoring

**One mark per question, 40 total. No marks deducted for wrong answers — answer everything.**

The pass mark is 700/1000 = **70%**, which is **28 questions**.

| Score | Percentage | What it means |
|---|---|---|
| 32–40 | 80–100% | Comfortable pass |
| **28–31** | **70–78%** | **Pass** |
| 27 | 67.5% | Just under the line — a fail |
| 24–26 | 60–65% | Clear fail |
| below 24 | — | Do not book yet |

### If you scored under 28

CC is a **foundational** exam, and its questions are mostly conceptual rather than product-specific
— which means they reward understanding *why* a control exists rather than what it is called. If
you lost marks on Domain 1 (24%, the largest), go back to the principles rather than the products:
CIA, least privilege, need to know, separation of duties, defence in depth, and the
policy/standard/procedure/guideline hierarchy. Those six ideas answer a large share of the paper.

If you lost marks in Domain 4, the networking vocabulary is worth shoring up — the IT roadmap's
networking phase covers it, and the Network+ paper in this directory will tell you where you stand.

### If you scored 32 or above

Remember two things before you book.

**The exam is adaptive.** Your experience on the day will not resemble this paper: questions get
harder as you do well, and a run of difficult questions is a sign of success, not failure. The
item count is a range because the test stops when its estimate of your ability is precise enough.

**CC is an entry-level certification, and ISC2 says so.** It demonstrates foundational knowledge —
it is not a qualification to practise, and it does not carry the weight of CISSP or even SSCP. It
is a reasonable first credential and a genuinely cheap way to learn the vocabulary. It is not a
substitute for the labs, and the curriculum's certification phase makes that argument at length.

---

## Where each domain is taught

| Domain | Curriculum phases |
|---|---|
| 1. Security Principles | `cybersec-roadmap/01-phase-foundations.md`, `03-phase-security-fundamentals.md` |
| 2. Security Governance | `cybersec-roadmap/13-phase-grc-compliance.md` |
| 3. Identity and Access Management | `cybersec-roadmap/03-phase-security-fundamentals.md`, `advance-roadmap/04-phase-cloud-identity-architecture.md` |
| 4. Networking and Cloud Security | `cybersec-roadmap/02-phase-networking-and-linux.md`, `cybersec-roadmap/09-phase-cloud-and-identity.md` |
| 5. Security Operations and Incident Response | `cybersec-roadmap/10-phase-detection-engineering.md`, `cybersec-roadmap/11-phase-incident-response.md` |

---

*Unofficial practice questions written for this repository against ISC2's published CC exam
outline (effective 1 September 2026). Not affiliated with or endorsed by ISC2. Exam details
checked 2026-09-18 — confirm current details with ISC2 before booking.*
