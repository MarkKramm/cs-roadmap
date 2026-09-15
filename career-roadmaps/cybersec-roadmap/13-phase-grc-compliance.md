---
id: cyber-13-grc-compliance
track: cyber
phase: 13
order: 130
title: "Phase 13 — GRC, Compliance, and Risk"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/cyber/13-grc-compliance.md"
exit_criteria: "You can identify an asset, name its risk in business language, score it with a defined scale, map the control that addresses it to a real framework, write the policy that governs it, and describe the evidence an auditor would ask for."
---

# Phase 13 — GRC, Compliance, and Risk

## Goal of this phase

Learn how organisations decide what risk to accept, how controls are chosen and evidenced, and how to produce the documents — risk register, policies, evidence packs — that a governance, risk, and compliance analyst produces every week.

## Estimated time

**6 weeks** at 2–4 focused hours a day, 5 days a week. Roughly 60–75 hours, most of it spent writing documents rather than reading.

## Skills you'll gain

- Distinguish governance, risk, and compliance, and explain what each produces.
- Identify and classify assets, and describe risk in language a business reader can act on.
- Build and score a risk register with a defined, defensible scale.
- Map a control to a framework such as ISO 27001, NIST CSF, SOC 2, PCI DSS, or HIPAA.
- Write a policy a real employee could follow, and the standard it enforces.
- Collect evidence for an audit and describe what an auditor will ask for.
- Assess a vendor's security posture with a questionnaire and a documented decision.
- Explain the privacy obligations in the Philippine Data Privacy Act and the GDPR in outline.
- Describe how a junior GRC analyst actually spends their working day.

## Specific topics to learn

- Governance, risk, and compliance as three separate functions
- Asset inventory and classification: what you have, and what it is worth
- Risk: threat, vulnerability, likelihood, impact, inherent versus residual risk
- Risk appetite, risk tolerance, and risk acceptance with an owner
- Risk scoring with a defined likelihood and impact matrix
- Risk treatment options: mitigate, transfer, avoid, accept
- Control frameworks: ISO/IEC 27001 and Annex A, NIST CSF 2.0, CIS Controls, SOC 2 Trust Services Criteria, PCI DSS, HIPAA
- Control types: preventive, detective, corrective, and administrative, technical, physical
- Control mapping: one control, several frameworks
- Policy hierarchy: policy, standard, procedure, guideline
- Evidence collection, control testing, and audit readiness
- Audit types: internal, external, certification, customer-driven
- Third-party and vendor risk management, and the questionnaire
- Privacy: the Philippine Data Privacy Act of 2012, GDPR principles and data subject rights
- Business continuity and disaster recovery at a governance level
- Security awareness training as a control, and how it is measured
- Metrics and reporting: KPIs, KRIs, and what a board actually reads
- Exception management and risk acceptance workflow
- A junior GRC analyst's actual weekly schedule

## Lesson: GRC Is How an Organisation Decides What to Care About

### Why this lesson exists

Phase 5 said GRC rarely hires directly, and that is still true. It also said GRC is where a large share of security jobs actually are, and that is truer now than it was.

Here is the gap this phase fills. Phase 6 offered a risk register and a policy as optional GRC portfolio projects, and gave one paragraph each. That is enough to know what the artefacts are called. It is not enough to produce one that a hiring manager would believe, and it is certainly not enough to survive the first week of the job.

**This phase is about the artefacts and the reasoning behind them.** By the end you will have built a risk register with defensible scores, written a policy someone could follow, mapped controls across frameworks, and assembled an evidence pack. Those are the deliverables a junior GRC analyst produces, and they are what an interviewer asks you to talk about.

#### What GRC is not

Three misconceptions cost people interviews, and each is worth dispelling directly.

| Misconception | Reality |
|---|---|
| "GRC is the paperwork side of security" | GRC is the decision side. The paperwork is how decisions are recorded so they can be defended |
| "GRC is where you go if you cannot do technical work" | GRC requires reading technical evidence and judging it. An analyst who cannot read a firewall rule cannot test the control that depends on it |
| "Compliance means secure" | Compliance means you can demonstrate you meet a specified standard. You can be compliant and breached, and the frameworks say so themselves |

That third row is the one that matters most, and it is worth stating as a principle:

**Compliance is a floor, not a ceiling.** A framework tells you what a group of people agreed was the minimum. Meeting it does not mean you are secure, and failing it does not mean you are compromised. It means you cannot demonstrate that you meet a defined bar.

#### Why this is employable

Entry-level GRC roles are more numerous than entry-level pentest roles, and they are more open to candidates without prior security experience — because the work is reading, writing, organising, and asking good questions, and those are learnable.

| What the job rewards | Where you have already practised it |
|---|---|
| Reading a document and extracting what it requires | Every phase's reading |
| Writing clearly for a non-technical reader | Phase 6's report writing |
| Organising evidence so someone else can find it | Phase 6's repository structure |
| Asking a question that exposes a gap | Phase 8's interview preparation |
| Understanding technical controls well enough to test them | Phases 2, 3, 4, 9, 10, 11 |

**Your IT support background is genuinely relevant here too.** You have seen how an organisation actually works: how tickets get closed, how access gets granted, how nobody reads the policy that was published last year. That operational realism is exactly what separates a useful policy from a document nobody follows.

#### Time to complete

**Roughly 60–75 hours over 6 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 4–5 | Once, properly |
| Frameworks reading — one in depth, others in outline | 10–12 | Do not try to learn all of them |
| Risk register build and scoring | 12–15 | The core artefact |
| Policy and standard writing | 10–12 | Slower than you expect |
| Control mapping across two frameworks | 8–10 | Where the real skill shows |
| Vendor questionnaire and assessment | 6–8 | Directly used in real roles |
| Evidence pack and audit-readiness notes | 6–8 | The artefact that gets tested in an interview |

#### What this phase is not

It is not a certification study phase. CISA, CISM, and CRISC require years of verified professional experience, as Phase 7 explained, and none of them is available to you now.

It is not a legal phase. You will learn to recognise a privacy obligation and route it. You will not learn to give a legal opinion, and you should not offer one.

### Part 1 — Governance, risk, and compliance, separated

#### Three functions, three outputs

The three words are used as one acronym and they describe three different jobs. Separating them is the first competence this phase builds.

| Function | The question it answers | Who owns it | The artefact |
|---|---|---|---|
| **Governance** | Who decides, and by what authority? | Board, steering committee, CISO | Charter, policy set, roles and responsibilities, reporting |
| **Risk** | What could go wrong, how bad, and what are we doing about it? | Risk owner, with the security team advising | Risk register, risk assessment, treatment plan |
| **Compliance** | Can we demonstrate we meet the standard? | Compliance or audit function | Control matrix, evidence pack, audit report |

The relationships matter more than the definitions. **Governance sets the appetite; risk measures against it; compliance proves it.**

A concrete illustration:

| Layer | Statement | Produced by |
|---|---|---|
| Governance | "We will not accept more than a moderate risk of customer data exposure." | The board, in the risk appetite statement |
| Risk | "The customer database has a high likelihood of exposure because three administrators share one credential." | The risk register |
| Compliance | "Control A.9.2.3 (management of privileged access) is not met; here is the gap, and here is the remediation plan." | The control matrix and audit finding |

Read those three lines in order and you have the whole discipline. The board said what matters. The risk register measured it. Compliance found the specific gap.

#### What a governance failure looks like

Governance failures do not look like mistakes. They look like silence.

| Symptom | What is actually missing |
|---|---|
| Nobody can name who owns the risk register | No assigned accountability |
| The same finding appears in three consecutive audits | No authority to enforce remediation |
| Security reports to nobody senior | No escalation path, so risk is invisible at the level that funds it |
| Policies exist and nobody has read them | No ownership of the policy lifecycle |
| Every risk is rated "medium" | No defined scale, so the register carries no information |

That last row is the most common and the most damaging. **A register where everything is medium is a register that cannot be prioritised**, and it usually means nobody wrote down what "high" means.

#### The policy hierarchy

Governance is expressed through documents, and the documents form a hierarchy. Confusing the levels produces policies that are either unenforceable or unusably long.

| Level | What it says | Length | Changes | Example |
|---|---|---|---|---|
| **Policy** | What we require, and why | 1–3 pages | Rarely, with formal approval | "All access to customer data requires multi-factor authentication." |
| **Standard** | The specific, measurable requirement | 2–10 pages | Occasionally | "MFA must use a phishing-resistant factor for administrative accounts." |
| **Procedure** | How to do it, step by step | Varies | Often | "How to enrol a FIDO2 key in Entra ID." |
| **Guideline** | Recommended but not mandatory | Varies | Often | "Recommended browsers for accessing the finance portal." |
| **Baseline** | The configured state of a system type | Varies | With each platform version | "Windows 11 hardening baseline, v3." |

**The test for whether something belongs in a policy:** if it contains a product name, a version number, or a command, it belongs in a standard or a procedure. Policies survive technology changes; standards do not.

| Written as a policy | Should be |
|---|---|
| "Passwords must be at least 14 characters and rotated every 90 days using Active Directory Fine-Grained Password Policies" | Policy: "Authentication strength must meet the defined baseline." Standard: the character and rotation requirement |
| "Firewall rules must be reviewed in Palo Alto Panorama each quarter" | Policy: "Network access rules must be reviewed periodically." Procedure: the tool and the cadence |
| "Staff must complete the KnowBe4 training within 30 days" | Policy: "Staff must complete security awareness training within the defined period." Procedure: the platform |

Learners write product names into policies constantly, and it is the fastest way to make a policy obsolete.

### Part 2 — Risk, done properly

#### Asset first, always

You cannot assess the risk to something you have not identified. Asset inventory is the unglamorous foundation of the entire discipline, and its absence is the single most common reason a risk register is useless.

An **asset** is anything of value that the organisation depends on. It is not only hardware.

| Asset type | Examples | Why it belongs in the inventory |
|---|---|---|
| **Information** | Customer records, financial data, source code, contracts | Most risk is ultimately about information |
| **Systems** | Applications, databases, servers, SaaS platforms | Where information lives and moves |
| **Infrastructure** | Networks, endpoints, cloud accounts, identity providers | What everything else depends on |
| **People** | Key staff, third-party contacts | Knowledge and authority that cannot be replaced quickly |
| **Processes** | Payroll, order fulfilment, incident response | A broken process can be a bigger loss than a broken server |
| **Reputation** | Brand, customer trust, regulatory standing | The asset that is hardest to restore |

**Classification** assigns each asset a sensitivity level, and the level drives how much control it needs.

| Classification | Definition | Typical handling |
|---|---|---|
| **Public** | Approved for release | No restrictions beyond accuracy |
| **Internal** | Not secret, but not for outsiders | Access limited to staff |
| **Confidential** | Harm if disclosed | Need-to-know, encrypted, logged |
| **Restricted** | Severe harm if disclosed, or legally regulated | Strict need-to-know, strong controls, monitoring, retention rules |

The classification decision matters more than it looks, because **the same asset can be classified differently by different organisations**. A list of customer email addresses might be Internal for one company and Restricted for another, depending on its regulatory environment and what it promised its customers.

#### The risk statement

A risk is not "the server is unpatched." That is a vulnerability. A risk is a statement with four parts, and writing it in that structure is what makes it scorable.

```text
Risk statement template

  Because <cause or condition>,
  there is a risk that <event>,
  which would result in <impact>.

Example:
  Because three administrators share a single privileged credential for the
  customer database, there is a risk that unauthorised access cannot be
  attributed to an individual, which would result in an undetected data
  breach and a failure to demonstrate accountability to the regulator.
```

Compare that with a common junior version:

| Version | Problem |
|---|---|
| "Weak privileged access management" | A topic, not a risk. It cannot be scored or closed |
| "The database could be hacked" | No cause, no impact, no way to judge likelihood |
| "Shared admin credentials — high risk" | Has a cause and a rating, but no stated impact, so nobody knows what is at stake |

**The impact clause is what makes a risk register persuasive.** It is also the clause that lets a manager decide, because a manager decides based on consequences rather than on technical descriptions.

#### Likelihood, impact, and inherent versus residual

| Term | Question | Scale |
|---|---|---|
| **Likelihood** | How probable is this, given the current controls? | Rare, unlikely, possible, likely, almost certain |
| **Impact** | How bad if it happens? | Insignificant, minor, moderate, major, severe |
| **Inherent risk** | The risk before the current controls are considered | Likelihood × impact, unmitigated |
| **Residual risk** | The risk that remains after the current controls | Likelihood × impact, as it stands |
| **Target risk** | The level you are trying to reach | Set by the risk appetite |

**Inherent and residual are the pair that beginners collapse.** Both matter, for different reasons.

| Measure | What it tells a decision-maker |
|---|---|
| Inherent | How dangerous this would be if we did nothing — which justifies why the control exists |
| Residual | What we are actually living with — which is what gets accepted or remediated |
| Target | The gap between residual and target is the remediation case |

An example makes it concrete.

| Field | Value |
|---|---|
| Risk | Because the customer database accepts connections from the corporate network without segmentation, there is a risk that a compromised workstation reaches the database directly, which would result in bulk customer data exposure |
| Inherent likelihood | Likely (4) |
| Inherent impact | Severe (5) |
| Inherent score | 20 — Critical |
| Existing controls | Network firewall rules restrict the database port to three application servers; database activity is logged |
| Residual likelihood | Unlikely (2) |
| Residual impact | Severe (5) |
| Residual score | 10 — High |
| Target | Moderate (9 or below) |
| Treatment | Segment the database into a dedicated subnet with no workstation route, by Q3 |
| Owner | Head of Infrastructure |

That entry is defensible, and every field is doing work. The inherent score explains why anyone cares; the residual score is what the organisation is living with; the target and the treatment turn it into a plan.

#### The scoring scale, written down

A risk score is meaningless unless the scale is published. This is what "high" means.

| Score | Likelihood | Definition |
|---|---|---|
| 1 | Rare | No known occurrence in the sector; requires an unusual combination of events |
| 2 | Unlikely | Could happen, but no evidence it has in comparable organisations |
| 3 | Possible | Has happened in comparable organisations, or could happen given a single control failure |
| 4 | Likely | Has happened here, or is expected given current controls |
| 5 | Almost certain | Happening now, or unavoidable without a change |

| Score | Impact | Definition |
|---|---|---|
| 1 | Insignificant | No regulatory, financial, or operational consequence |
| 2 | Minor | Recoverable within days, under a defined financial threshold, no data affected |
| 3 | Moderate | Operation disrupted for days, financial loss above the threshold, internal data affected |
| 4 | Major | Service interruption for a week or more, regulated data affected, regulatory notification likely |
| 5 | Severe | Business-threatening, widespread regulated data exposure, sustained loss of customer trust |

Then the matrix, with bands:

| Likelihood \ Impact | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **5 Almost certain** | 5 Medium | 10 High | 15 High | 20 Critical | 25 Critical |
| **4 Likely** | 4 Low | 8 Medium | 12 High | 16 Critical | 20 Critical |
| **3 Possible** | 3 Low | 6 Medium | 9 Medium | 12 High | 15 High |
| **2 Unlikely** | 2 Low | 4 Low | 6 Medium | 8 Medium | 10 High |
| **1 Rare** | 1 Low | 2 Low | 3 Low | 4 Low | 5 Medium |

**The definitions are what make the score defensible.** Without them, two analysts score the same risk four and sixteen, and the register becomes an opinion poll.

#### Risk appetite, tolerance, and acceptance

Governance sets how much risk the organisation is willing to live with, and the register is measured against it.

| Term | Definition | Example |
|---|---|---|
| **Risk appetite** | The amount and type of risk the organisation is willing to pursue or retain, in pursuit of its objectives | "We accept moderate risk in pursuit of faster delivery." |
| **Risk tolerance** | The acceptable variation around the appetite — the operational line | "No risk above Medium may remain unmitigated for more than 90 days." |
| **Risk acceptance** | A documented decision to live with a specific risk | "We accept the residual High risk in the legacy billing system until it is decommissioned next year, because the cost of remediation exceeds the exposure." |

A **risk acceptance** entry needs five things, and an acceptance missing any of them is not an acceptance — it is an unmanaged risk.

| Required field | Why |
|---|---|
| The risk, stated clearly | So the decision is about a specific thing |
| The residual score | So the size of what is being accepted is visible |
| The business justification | Why accepting is better than treating |
| The accepting owner, named | Accountability, at a named person, not a team |
| The review date | Acceptance is time-limited, not permanent |

**The review date is the field that turns acceptance into management.** A risk accepted indefinitely is a risk nobody has thought about since the day it was written.

#### The four treatment options

Every risk gets one of four responses, and knowing the vocabulary makes a register entry sound professional.

| Option | What it means | When it is right | Example |
|---|---|---|---|
| **Mitigate** | Add or improve a control | The cost of the control is less than the expected loss | Segment the database |
| **Transfer** | Move the financial consequence to someone else | Insurance or a contract can carry it | Cyber insurance, or a contractual liability cap |
| **Avoid** | Stop doing the activity | The risk is unacceptable at any cost | Do not store the data at all |
| **Accept** | Live with it, documented and dated | The cost exceeds the exposure, or the timing is wrong | The legacy system being retired next year |

**Transfer is the option people misunderstand.** Insurance transfers the *financial* consequence. It does not transfer the breach, the notification obligation, or the reputational damage.

| Mistaken belief | Reality |
|---|---|
| "We have cyber insurance, so this risk is handled" | The incident still happens; the insurer may dispute the claim; reputational harm is not insurable |
| "The vendor is liable under the contract" | Liability caps and exclusions are usually written by the vendor's lawyers |
| "Outsourcing the service outsources the risk" | You can outsource the processing; you rarely outsource the accountability |

That last row is the theme of Part 5.

#### Worked example: five risks in one register

Here is a slice of a register for a small Philippine BPO handling customer data for an overseas client.

| ID | Risk statement | Inherent | Existing controls | Residual | Treatment | Owner | Target date |
|---|---|---|---|---|---|---|---|
| R-01 | Because staff access the client portal from personal devices without device management, there is a risk that a compromised personal device accesses customer records, resulting in a reportable data breach | 20 Critical | MFA on the portal; no device control | 16 Critical | Mitigate — conditional access requiring a managed device | IT Manager | Q2 |
| R-02 | Because the legacy billing server runs an unsupported OS, there is a risk that a known exploit compromises it, resulting in an outage during invoicing | 15 High | Network segmentation; no internet exposure | 9 Medium | Accept until decommission, review quarterly | Finance Director | Q4 review |
| R-03 | Because only one engineer holds the backup encryption key, there is a risk that a departure makes backups unreadable, resulting in extended data loss after an incident | 12 High | Key stored in a sealed envelope in the safe | 12 High | Mitigate — split the key across two custodians | Head of Infrastructure | Q2 |
| R-04 | Because vendor security questionnaires are not completed before onboarding, there is a risk that a supplier with weak controls is engaged, resulting in a downstream breach attributed to us | 12 High | Legal review of contracts only | 12 High | Mitigate — add a security review gate | Procurement Lead | Q3 |
| R-05 | Because security awareness training is annual and not measured, there is a risk that phishing succeeds, resulting in credential compromise | 16 Critical | Annual training; MFA | 12 High | Mitigate — quarterly simulation with reporting, plus number-matching MFA | HR and IT jointly | Q2 |

Read those five and notice what makes the register useful.

**R-02 is an acceptance, and it is legitimate.** The residual is Medium, the justification is a decommissioning date, and the review date is set. That is not a failure to act; it is a decision.

**R-03 has the same inherent and residual score.** That is a signal worth reading: the existing control (an envelope in a safe) does almost nothing to reduce the risk. Register entries where inherent equals residual are frequently the ones where the "control" was assumed rather than tested.

**R-05 names two owners.** Joint ownership is usually a warning sign, because shared accountability is often no accountability. In practice one of them should own the risk and the other should own an action.

That observation — noticing that a register entry has a problem — is exactly the kind of thing an interviewer asks about.

### Part 3 — The frameworks, described honestly

#### What a framework is, and is not

A framework is a structured list of things an organisation should consider, written by a group of people who agreed on a minimum. It is not a law, it is not a guarantee of security, and it is not a checklist you tick once.

| Framework | What it is | Who it is for | Cost to read | Certification? |
|---|---|---|---|---|
| **NIST CSF 2.0** | A voluntary framework organised around six functions: Govern, Identify, Protect, Detect, Respond, Recover | Any organisation, any size, any sector | Free | No — it is not a certification scheme |
| **ISO/IEC 27001** | An international standard for an information security management system, with Annex A controls | Organisations wanting a certifiable management system | The standard is paid | **Yes** — certification by an accredited body |
| **CIS Controls** | A prioritised list of 18 safeguards, with implementation groups for different maturity levels | Organisations wanting a practical starting order | Free | No |
| **SOC 2** | An attestation against the Trust Services Criteria — security, availability, processing integrity, confidentiality, privacy | Service organisations whose customers ask | The criteria are free to read; the audit is not | **Yes** — an attestation report, not a certificate |
| **PCI DSS** | A mandatory standard for organisations handling card payments | Anyone storing, processing, or transmitting card data | Free to read | **Yes** — compliance validated by an assessor or self-assessment |
| **HIPAA** | United States law governing protected health information | Anyone handling US patient data | Free | No — it is law, not a scheme |
| **GDPR** | European Union law governing personal data of EU residents | Anyone processing EU residents' data | Free | No |
| **Data Privacy Act of 2012** | Philippine law governing personal data, with the National Privacy Commission as regulator | Most Philippine organisations | Free | No |

**The certification column is the one that drives business decisions.** An organisation pursues ISO 27001 certification or a SOC 2 report because a customer, a tender, or a regulator requires it — not because the framework is better than the alternatives.

#### NIST CSF 2.0: the one to learn first

If you learn one framework, learn this one. It is free, it is short, it is sector-neutral, and its vocabulary is used in job postings and in conversation.

| Function | What it covers | Example outcome |
|---|---|---|
| **Govern** | Organisational context, risk management strategy, roles, policy, supply chain | A documented risk appetite, with named owners |
| **Identify** | Asset management, risk assessment, improvement | A current asset inventory with classifications |
| **Protect** | Identity management, access control, awareness, data security, platform security | MFA everywhere, least privilege, hardened baselines |
| **Detect** | Continuous monitoring, adverse event analysis | Logs collected, detections tuned, alerts triaged |
| **Respond** | Incident management, analysis, reporting, mitigation | A tested incident response plan with named roles |
| **Recover** | Recovery planning, improvements, communication | Restoration priorities and a tested backup |

**Govern was added in CSF 2.0 and it is the function most organisations were missing.** It is the explicit acknowledgement that none of the other five work without someone deciding, funding, and owning them.

The framework is organised further into categories and subcategories, each with a short identifier. Referencing them is how a GRC analyst shows their work:

| Identifier | Statement, paraphrased |
|---|---|
| GV.RR-01 | Organisational leadership is responsible and accountable for cybersecurity risk |
| ID.AM-01 | Inventories of hardware managed by the organisation are maintained |
| PR.AA-03 | Users, services, and hardware are authenticated |
| DE.CM-01 | Networks and network services are monitored to find potentially adverse events |
| RS.MA-01 | The incident response plan is executed once an incident is declared |
| RC.RP-01 | The recovery portion of the incident response plan is executed once initiated |

**That identifier scheme is what a control matrix is built from.** A row per subcategory, a column per control, and the evidence that shows the control operates.

#### ISO/IEC 27001: the certifiable management system

ISO 27001 is different in kind from the others. It certifies a **management system** — the way you run security — rather than a list of technical controls.

| Element | What it requires |
|---|---|
| **Context of the organisation** | You understand your own environment, interested parties, and scope |
| **Leadership** | Top management is demonstrably involved, with a policy and assigned roles |
| **Planning** | You have assessed risk, chosen treatments, and set objectives |
| **Support** | Resources, competence, awareness, documented information |
| **Operation** | You do what you planned, and you keep records |
| **Performance evaluation** | You monitor, measure, audit internally, and review at management level |
| **Improvement** | You fix nonconformities and continually improve |
| **Annex A controls** | A catalogue of controls, from which you select and justify your choices |

**The key insight about ISO 27001 is that Annex A is a menu, not a checklist.** You select the controls that apply, justify why, and document any exclusions. An organisation claiming full Annex A coverage of every control without a justification is an organisation that does not understand the standard.

The four Annex A themes are worth knowing:

| Theme | What it covers |
|---|---|
| **Organisational controls** | Policies, roles, asset management, supplier relationships, incident management, business continuity, compliance |
| **People controls** | Screening, terms of employment, awareness, disciplinary process, remote working |
| **Physical controls** | Physical entry, equipment protection, clear desk, secure disposal |
| **Technological controls** | Access control, cryptography, logging, network security, configuration, secure development |

**The people and physical themes surprise technical candidates**, and they are a good interview talking point. A perfect technical control set with no clear-desk policy and no screening process is not a certified management system.

#### SOC 2: the attestation you will meet in interviews

SOC 2 is not a standard you implement. It is a report an auditor produces about you, against the Trust Services Criteria.

| Element | Detail |
|---|---|
| **Who needs it** | Service organisations whose customers ask for assurance — SaaS, hosting, BPO, managed services |
| **Type I** | Design of controls at a point in time |
| **Type II** | Operating effectiveness of controls over a period, usually 3–12 months |
| **Criteria** | Security (mandatory), plus Availability, Processing Integrity, Confidentiality, and Privacy as selected |
| **Output** | A report containing management's description, the auditor's opinion, and the tested controls |

**The Type I versus Type II distinction is a favourite interview question.** Type I says the controls are designed correctly on one day. Type II says they worked over a period. Type II is the one customers ask for, and it is the one that requires evidence collected continuously rather than assembled at the end.

#### PCI DSS, HIPAA, and the Data Privacy Act

| Framework | Scope trigger | The core obligation | Who enforces |
|---|---|---|---|
| **PCI DSS** | You store, process, or transmit cardholder data | Twelve requirement groups covering network security, protection of stored data, access control, monitoring, and testing | The card brands, through acquiring banks |
| **HIPAA** | You handle protected health information of US individuals | Administrative, physical, and technical safeguards, plus breach notification | US Department of Health and Human Services |
| **Data Privacy Act of 2012** | You process personal data of Philippine residents, or a Philippine entity processes personal data | Lawful basis, data subject rights, security measures, breach notification to the NPC | National Privacy Commission |
| **GDPR** | You process personal data of EU residents | Lawful basis, data subject rights, records of processing, breach notification within 72 hours where required | EU supervisory authorities |

**One control satisfies several frameworks**, and this is the observation that makes control mapping efficient rather than exhausting.

| Control activity | Satisfies |
|---|---|
| Multi-factor authentication on all remote access | NIST CSF PR.AA; ISO 27001 access control; PCI DSS requirement 8; SOC 2 CC6; a Data Privacy Act security measure |
| Centralised log collection with alerting | NIST CSF DE.CM; ISO 27001 logging; PCI DSS requirement 10; SOC 2 CC7 |
| Annual security awareness training with records | NIST CSF PR.AT; ISO 27001 competence and awareness; PCI DSS requirement 12; SOC 2 CC1 and CC2 |

**That table is the answer to "how do you cope with multiple frameworks?"** You do not implement them separately. You implement a control once, document it once, and map it to each framework that requires it.

### Part 4 — Controls, evidence, and audits

#### Control types and how they are described

A control is anything that reduces risk. Describing controls precisely is a GRC skill, and the vocabulary has three useful axes.

| Axis | Values | Example |
|---|---|---|
| **By function** | Preventive, detective, corrective | Block macros; alert on macro execution; rebuild the host |
| **By nature** | Administrative, technical, physical | A policy; a firewall; a locked door |
| **By automation** | Manual, automated, hybrid | A quarterly access review; a conditional access policy; a review with an automated report |

A well-described control names all three. Compare:

| Weak control description | Strong control description |
|---|---|
| "Access is controlled" | "Automated preventive technical control: conditional access requires a compliant device and MFA for all access to the customer portal, evaluated at each sign-in. Implemented in Entra ID. Tested quarterly by sampling five sign-ins." |
| "Backups are taken" | "Automated preventive technical control: nightly incremental and weekly full backups of the customer database to a separate account, encrypted, with a restore test performed and evidenced each quarter." |

**The strong version can be tested.** That is the test of a control description, and it is why auditors ask for exactly this level of specificity.

#### The control matrix

The control matrix is the document that connects a framework requirement, your control, and the evidence that proves it operates.

```text
| Ref        | Requirement (paraphrased)              | Control                      | Type        | Owner      | Evidence                          | Tested     | Result |
|------------|----------------------------------------|------------------------------|-------------|------------|-----------------------------------|------------|--------|
| PR.AA-03   | Users and services are authenticated   | MFA enforced via conditional | Preventive  | IT Manager | Conditional access policy export  | 2026-02-10 | Pass   |
|            |                                        | access for all users         | Technical   |            | plus a 5-user sign-in sample      | Quarterly  |        |
| ID.AM-01   | Hardware inventories are maintained    | Monthly reconciliation of    | Detective   | IT Manager | Reconciliation report, month-end  | 2026-02-28 | Pass   |
|            |                                        | the asset register against   | Administrative |         | screenshots, 3 exceptions logged  | Monthly    |        |
|            |                                        | the discovery tool           |             |            |                                   |            |        |
| DE.CM-01   | Networks are monitored                 | SIEM ingesting firewall,     | Detective   | SOC Lead   | Ingestion report showing 100% of  | 2026-02-15 | Partial|
|            |                                        | endpoint, and identity logs  | Technical   |            | sources; one source has a 3-day   | Monthly    |        |
|            |                                        |                              |             |            | gap in January (finding F-2)      |            |        |
| RS.MA-01   | The IR plan is executed on declaration | Documented plan, tested via  | Corrective  | CISO       | Tabletop report, attendance,      | 2026-01-20 | Pass   |
|            |                                        | an annual tabletop           | Administrative |         | actions tracker                   | Annual     |        |
| RC.RP-01   | Recovery is executed                   | Quarterly restore test of    | Corrective  | Head of    | Restore log with timing and       | 2026-02-05 | Fail   |
|            |                                        | one critical system          | Technical   | Infra      | outcome; Q4 test failed at first  | Quarterly  |        |
|            |                                        |                              |             |            | attempt (finding F-3)             |            |        |
```

**The two non-pass rows are what make this matrix credible.** A control matrix where every row says "Pass" is a matrix nobody tested, and every experienced auditor knows it.

| Result | Meaning | What it triggers |
|---|---|---|
| **Pass** | The control operates as described, with evidence | Nothing beyond the record |
| **Partial** | The control operates with a gap | A finding with a remediation date |
| **Fail** | The control does not operate | A finding, a risk register entry, and a remediation plan |
| **Not applicable** | The requirement does not apply | A written justification, which ISO 27001 requires |
| **Not tested** | Nobody has checked | The most honest and most concerning entry |

#### Evidence: what an auditor actually asks for

Evidence is the artefact that shows a control operated. It has three properties, and missing any one of them means the auditor cannot use it.

| Property | Why |
|---|---|
| **Relevant** | It shows the specific control, not something adjacent |
| **Complete** | It covers the whole period, not a convenient sample |
| **Attributable** | It has a date, a source, and ideally a name |

| Control | Weak evidence | Strong evidence |
|---|---|---|
| Access reviews | "We review access quarterly" | The signed review record for Q1, listing every account, the reviewer, the date, and the three removals made |
| Patching | A screenshot of a patch dashboard today | A monthly report for each month in the audit period, with the percentage patched within SLA |
| Backup restoration | A backup job success log | A restore log showing a real system restored, the time taken, and the outcome |
| Awareness training | A completion percentage | A per-person completion record, and the process for following up non-completers |
| Change management | A ticketing system exists | Five sampled changes with approval, testing, and deployment records |
| Incident response | The IR plan document | A tabletop report, plus one real incident with its timeline and lessons learned |

**The access review row is where most first audits fail.** A policy that says reviews happen quarterly, with no record of a review ever happening, is a finding. The evidence is the record, not the intention.

#### Audit types

| Type | Who performs it | Purpose | Notice |
|---|---|---|---|
| **Internal audit** | Your own team, or a separate internal function | Find gaps before someone else does | Usually scheduled |
| **External audit** | An independent firm | Certify or attest | Scheduled, with a defined period |
| **Certification audit** | An accredited certification body | Award or maintain ISO 27001 certification | Stage 1 and stage 2, then surveillance |
| **Customer audit** | A client or a prospective client | Assure themselves about you | Sometimes with little notice |
| **Regulatory examination** | A regulator | Check compliance with law | Statutory powers, and no refusal |
| **Self-assessment** | You | Prepare | Continuous |

**The customer audit is the one that surprises people in a BPO or SaaS role**, and it is the reason SOC 2 exists. A large client will send a questionnaire, ask for evidence, and sometimes send an assessor. Answering those questionnaires accurately is a substantial part of a junior GRC analyst's job.

#### Worked example: responding to an audit finding

A finding is not a personal attack. It is a documented gap with a required response, and the response follows a predictable structure.

```text
AUDIT FINDING F-3

  Criterion    RC.RP-01 — The recovery portion of the incident response plan
               is executed once initiated.
  Condition    The Q4 restore test failed at the first attempt. The backup
               was readable but the documented restore procedure referenced
               a tool version no longer in use, and the engineer had to
               improvise the final steps.
  Cause        The restore procedure was last updated 22 months ago and was
               not reviewed when the backup platform was upgraded.
  Effect       Recovery time for a critical system is unknown and likely
               exceeds the 4-hour objective in the business continuity plan.
  Risk rating  High — linked to register entry R-07.

  MANAGEMENT RESPONSE

  Action 1     Rewrite the restore procedure against the current platform.
               Owner: Head of Infrastructure. Due: 2026-04-15.
  Action 2     Perform a restore test of each critical system at least
               annually, and evidence the result. Owner: Head of
               Infrastructure. Due: 2026-05-31.
  Action 3     Add a procedure review trigger to the platform upgrade
               checklist. Owner: Change Manager. Due: 2026-04-30.
  Accepted     The 4-hour recovery objective is retained; the Q2 test will
  position     confirm whether it is achievable, and the objective will be
               revised if not.
```

Four elements in that response are what an auditor looks for.

| Element | Why it is required |
|---|---|
| A **cause**, not just a condition | The condition is the symptom; the cause is what you fix |
| An **owner and a date per action** | Shared and undated actions do not close |
| A **verification** (Action 2's test) | Proves the fix, rather than asserting it |
| An explicit **accepted position** | Where you are not fully remediating, say so and say why |

The last one is the mark of a mature response. An organisation that commits to fixing everything perfectly, every time, is an organisation whose responses are not believed.

### Part 5 — Writing policy, and managing third parties

#### What makes a policy usable

Most security policies fail in the same way: they forbid everything, define nothing, and nobody reads them. A policy that is not followed is worse than no policy, because it creates a documented gap between what you say and what you do.

| Failure | What it looks like | Why it fails |
|---|---|---|
| **Unenforceable** | "Passwords must be strong" | Nobody can determine compliance, including an auditor |
| **Impossible** | "No personal devices may access any company resource" | The CEO uses a personal phone; the policy is now dead |
| **Unactionable** | "Staff must be vigilant against phishing" | No behaviour is specified, so nothing can be measured |
| **Stale** | Names a product that was replaced two years ago | Nobody trusts a document that is visibly out of date |
| **Unread** | Forty pages of legal prose | Nobody can find the part that applies to them |

A usable policy has five properties.

| Property | What it means |
|---|---|
| **Scoped** | It says who and what it applies to, in the first paragraph |
| **Specific** | A reader can tell whether they are complying |
| **Achievable** | The required behaviour is possible with the tools people actually have |
| **Enforceable** | There is a defined consequence, and a way to detect a breach |
| **Owned** | A named role reviews it on a stated cadence |

#### The policy template that works

```text
# Acceptable Use Policy

  Document owner      Head of Information Security
  Approved by         Executive Committee
  Version             2.0
  Effective date      2026-04-01
  Next review         2027-04-01, or on a material change

## 1. Purpose
   One paragraph. Why this document exists, in business terms.

## 2. Scope
   Who it applies to — employees, contractors, interns, third parties —
   and what it covers. State exclusions explicitly, if any.

## 3. Definitions
   Any term a reader might reasonably interpret differently.

## 4. Policy statements
   Numbered requirements. One requirement per line. Each one testable.

## 5. Roles and responsibilities
   Who does what. Named roles, not names.

## 6. Compliance and exceptions
   How compliance is monitored, who may grant an exception, how long an
   exception lasts, and what happens on a breach.

## 7. Related documents
   The standards, procedures, and guidelines that sit under this policy.

## 8. Revision history
   Version, date, author, and what changed.
```

**Section 6 is the one beginners omit, and it is the one that makes a policy real.** A policy with no exception process is a policy that will be broken quietly, because every organisation has a legitimate case that the policy does not cover.

#### A worked policy, written to be followed

```text
## 4. Policy statements

  4.1  Company information must be stored only in approved systems.
       Personal cloud storage, personal email, and unapproved file-sharing
       services must not be used for company information.

  4.2  Company devices must be encrypted, kept patched, and protected by a
       screen lock that engages after no more than 10 minutes of inactivity.

  4.3  Multi-factor authentication must be enabled on every account that
       provides access to company information.

  4.4  Credentials must not be shared. Where a shared credential is
       technically unavoidable, it must be recorded in the privileged access
       register, and the exception must be reviewed quarterly.

  4.5  Company information must be classified before it is shared
       externally, using the classification scheme in the Data
       Classification Standard.

  4.6  Suspected security incidents, including suspected phishing, must be
       reported to the security team within one hour of discovery.
       Reporting in good faith will not result in disciplinary action.

  4.7  Personal use of company systems is permitted within the limits set
       out in section 4.8. Personal use must not compromise security,
       consume resources required for work, or create a legal risk.

  4.8  The following are prohibited on company systems: installing
       unapproved software, connecting unapproved storage devices,
       attempting to bypass a security control, and using company systems
       to access illegal material.
```

Compare that with the version most learners write first.

| Learner's version | Problem | Fixed version |
|---|---|---|
| "Employees must use strong passwords" | Unmeasurable | 4.3 above — MFA on every account, which is checkable |
| "Passwords must never be shared" | Impossible in practice for some legacy systems | 4.4 — prohibited, with a registered and reviewed exception path |
| "Report any security issue immediately" | "Immediately" is undefinable | 4.6 — within one hour, plus the good-faith protection |
| "Personal use is not allowed" | Nobody complies, so the policy is dead | 4.7 and 4.8 — permitted within limits, with the actual prohibitions listed |

**Line 4.6's second sentence is the one that changes behaviour.** Staff who fear discipline for clicking a link do not report clicking a link, and an unreported click is an incident you discover three weeks later. Saying explicitly that good-faith reporting is protected is a security control, not a courtesy.

#### Third-party risk: why it matters more every year

Organisations now depend on suppliers for identity, hosting, payment, payroll, and support. Each one is an access path, and a breach at a supplier becomes your breach in the customer's mind.

| Supplier type | Risk | Typical control |
|---|---|---|
| **SaaS platform** | Data residency, access, sub-processors | Security review before onboarding, contractual clauses, annual reassessment |
| **Cloud provider** | Shared responsibility confusion | Documented configuration ownership, posture scanning |
| **Contractor or freelancer** | Access that outlives the engagement | Time-bound accounts, background checks, named onboarding and offboarding |
| **Managed service provider** | Privileged access to your estate | Contractual security requirements, access logging, right to audit |
| **Software vendor** | Supply chain compromise | Dependency scanning, patch process, vendor notification terms |
| **Payment processor** | Card data and regulatory scope | PCI DSS attestation of compliance |
| **Offshore BPO partner** | Data protection and jurisdiction | Data processing agreement, privacy assessment, audit rights |

**The offboarding row is the one that produces incidents.** Contractors who leave with active accounts are one of the most common findings in access reviews, and the cause is almost always that nobody told the security team the engagement ended.

#### The vendor questionnaire, and how to score it

A vendor security questionnaire is a structured way to ask a supplier the same questions every time, so that answers can be compared.

| Domain | Sample questions | What a weak answer looks like |
|---|---|---|
| **Access control** | Is MFA enforced for all administrative access? | "Yes, where possible" |
| **Encryption** | Is data encrypted in transit and at rest? | "We use industry-standard encryption" with no detail |
| **Incident response** | What is your notification timeline for a breach affecting our data? | "We will notify you promptly" |
| **Sub-processors** | Do you use sub-processors, and are they disclosed? | No answer, or an incomplete list |
| **Certifications** | Do you hold ISO 27001, SOC 2 Type II, or equivalent? | "We follow industry best practice" |
| **Data location** | Where is our data stored and processed? | "In the cloud" |
| **Business continuity** | What is your tested recovery time objective? | "We have backups" |
| **Offboarding** | How is access removed when staff leave? | "HR handles it" |

**"Yes, where possible" and "industry best practice" are non-answers**, and recognising them is a skill. A vendor who cannot say "yes, MFA is enforced for all administrative accounts via our identity provider" either does not enforce it or does not know.

```text
VENDOR ASSESSMENT RECORD

  Vendor          Example Analytics Ltd
  Service         Customer usage analytics
  Data involved   Customer identifiers, usage events. Classified Confidential.
  Annual value    Above the threshold requiring a full review.

  Assessment
    MFA for admin access              Yes — enforced, evidenced by policy extract
    MFA for all users                 Partial — optional for non-admin users
    Encryption in transit             Yes — TLS 1.2 minimum, stated
    Encryption at rest                Yes — AES-256, stated
    SOC 2 Type II                     Yes — report dated 2025-11, no exceptions
    Sub-processors disclosed          Yes — three listed, one in a different jurisdiction
    Breach notification commitment    72 hours, contractual
    Data location                     Primary EU, backups EU
    Deletion on termination           30 days, certified deletion on request

  Decision        Approve with conditions.
  Conditions      1. Require MFA for all users as a contractual term at renewal.
                  2. Obtain the sub-processor list in writing before signing.
                  3. Reassess at renewal, or on any reported breach.

  Residual risk   Medium. The gap is optional MFA for non-admin users, which
                  affects the confidentiality of usage data but not the
                  integrity of customer records.

  Assessed by     Your Name, GRC Analyst
  Date            2026-03-14
  Next review     2027-03-14
```

**The "Approve with conditions" decision is the realistic outcome**, and the ability to reach it is what a GRC analyst is paid for. Very few vendor assessments end in a flat refusal, and very few end in an unconditional yes.

### Part 6 — Privacy, in outline

#### The principles, which are the same in most laws

Privacy law varies by jurisdiction, and the underlying principles are remarkably consistent. Learning them once gives you most of what you need in any of them.

| Principle | What it requires |
|---|---|
| **Lawfulness and fairness** | A lawful basis for processing, and no deceptive practices |
| **Purpose limitation** | Collected for a stated purpose, not repurposed silently |
| **Data minimisation** | Only what is necessary for that purpose |
| **Accuracy** | Kept correct, and corrected when wrong |
| **Storage limitation** | Not kept longer than necessary |
| **Integrity and confidentiality** | Protected with appropriate security measures |
| **Accountability** | You can demonstrate all of the above |

**Data minimisation is the principle that pays for itself.** Data you never collected cannot be breached, cannot be subject to a subject access request, and cannot be retained too long.

#### The Philippine Data Privacy Act of 2012

| Element | Detail |
|---|---|
| **Regulator** | National Privacy Commission |
| **Applies to** | Personal data of Philippine citizens and residents, and Philippine entities processing personal data |
| **Key concepts** | Personal information, sensitive personal information, processing, data subject, personal information controller, personal information processor |
| **Sensitive personal information** | Includes health, race, ethnic origin, marital status, age, religious or philosophical affiliation, political affiliation, and information issued by government agencies such as a Social Security number |
| **Data subject rights** | To be informed, to object, to access, to rectify, to erasure or blocking, to damages, to data portability, and to lodge a complaint |
| **Security obligations** | Organisational, physical, and technical measures appropriate to the sensitivity of the data |
| **Breach notification** | Notification to the NPC and to affected individuals is required in defined circumstances, within defined periods |
| **Accountability** | A Data Protection Officer must be designated where required |

**Two things about this are worth stating carefully.** First, when a breach is notifiable and what the exact deadline is are legal questions with specific answers in the implementing rules — the correct professional behaviour is to know the obligation exists and route the decision. Second, **the penalty structure includes criminal liability for some offences**, which is why a GRC analyst escalates rather than opines.

#### GDPR, in outline

If your employer serves European customers, GDPR applies to the personal data of EU residents regardless of where your organisation is.

| Element | Detail |
|---|---|
| **Lawful bases** | Consent, contract, legal obligation, vital interests, public task, legitimate interests — one must apply |
| **Data subject rights** | Access, rectification, erasure, restriction, portability, objection, and rights relating to automated decision-making |
| **Accountability** | Records of processing activities, and data protection by design |
| **Breach notification** | To the supervisory authority within 72 hours where a breach is likely to result in a risk to rights and freedoms, and to individuals where the risk is high |
| **International transfers** | Transfers outside the EU need an adequacy decision or appropriate safeguards |
| **Penalties** | Administrative fines up to a percentage of global annual turnover, in tiers |

**The 72-hour element is the one that shapes incident response**, and it is why Phase 11 insists on a timeline with real timestamps. You cannot demonstrate a 72-hour notification if you cannot show when you became aware.

| Alignment between GDPR and the Philippine law | Effect on your work |
|---|---|
| Both require a lawful basis | One record of processing serves both |
| Both grant subject rights | One request-handling procedure serves both |
| Both require breach notification | The procedure differs in timing and recipient, so the procedure branches |
| Both require security measures | One control set serves both |

#### What a junior GRC analyst does with privacy

Not legal advice. Four specific things:

| Activity | What it looks like |
|---|---|
| Answering a data subject request | Locating the data, coordinating the response, tracking the deadline |
| Maintaining the record of processing | Keeping the register of what data is processed, why, where, and by whom |
| Supporting a breach assessment | Gathering facts for counsel and the DPO so the notification decision can be made |
| Reviewing a new project | Asking what personal data it collects, on what basis, and for how long |

**The fourth one is where you add the most value**, and it is the one that requires you to be present early. A project that collects unnecessary data and keeps it forever is a liability created in a design meeting, and the cheapest time to fix it is before anything is built.

### Part 7 — The job itself

#### What the week actually looks like

The most useful thing this phase can give you is a realistic picture of the work, because "GRC" means nothing concrete to a candidate who has never done it.

| Activity | Share of a typical week | What it involves |
|---|---|---|
| Evidence collection and chasing | 25% | Asking people for screenshots, reports, and records, and following up |
| Control testing | 20% | Checking whether a control operates, and documenting the result |
| Policy and procedure writing or review | 15% | Updating documents, and a review cycle that never quite finishes |
| Vendor and third-party assessments | 15% | Questionnaires, reviews, and decision records |
| Risk register maintenance | 10% | Adding entries, chasing owners, updating scores |
| Meetings and stakeholder work | 10% | Explained below, and larger than it sounds |
| Reporting and metrics | 5% | Producing the monthly or quarterly pack |

**The evidence-chasing row is the largest and the least glamorous.** Most of the job is asking a busy person for a record and then asking again. Being organised and pleasant about it is a genuine professional skill, not a personality trait.

**The meetings row is the one candidates underestimate.** A GRC analyst is often the only person in the room who asks "what data does this touch, and who owns the risk?" Being able to ask that question in a design meeting, without being obstructive, is how a junior becomes useful quickly.

#### Deliverables you produce regularly

| Deliverable | Cadence | Who reads it |
|---|---|---|
| Risk register update | Monthly | Risk owners, the steering committee |
| Control test results | Monthly or quarterly | The CISO, internal audit |
| Exception register review | Quarterly | Risk owners, audit |
| Vendor assessment | As needed | Procurement, the business owner |
| Policy review | Annual, or on change | All staff |
| Awareness completion report | Monthly | HR, management |
| Board or committee pack | Quarterly | Executive and board |

The **board pack** is worth understanding even at junior level, because it is where security competes for money. It contains trend rather than detail: risk posture over time, the top risks, what has been closed, what has slipped, and what is being asked for.

#### The metrics that actually get read

| Metric | What it tells a reader | Common misuse |
|---|---|---|
| **Percentage of critical vulnerabilities patched within SLA** | Whether the patch process works | Reporting total patched, which hides the overdue ones |
| **Mean time to detect** | How good detection is | Measuring only the incidents you found |
| **Mean time to respond** | How quickly the team acts | Improving it by closing tickets early |
| **Phishing simulation click rate over time** | Whether awareness is improving | Treating it as a punishment metric, which suppresses reporting |
| **Access review completion with removals** | Whether reviews change anything | Reporting completion without the removals |
| **Control test pass rate by framework** | Coverage and gaps | Reporting a single overall percentage that hides the failures |
| **Open findings past their due date** | Whether remediation is real | Excluding findings that were re-baselined |

**Two of those are worth dwelling on.**

The **phishing click rate** becomes a bad metric the moment it is used punitively. Staff who fear the consequences of clicking do not report real phishing, and a low click rate with low reporting is a worse place to be than a higher click rate with high reporting.

The **open findings past due date** metric is the one that tells the truth about an organisation. Everything else can be presented favourably; this one measures whether commitments are kept.

#### Worked example: a week in the life

```text
MONDAY
  09:00  Risk register: R-05 is past its treatment date. Email the owner,
         update the entry, and move it to the steering agenda.
  10:30  Evidence request: three screenshots for the access review sample.
         Chase two people who have not replied.
  14:00  Vendor assessment: a new analytics tool. Read the SOC 2 report,
         note the sub-processors, and draft the decision record.
  16:00  Meeting: a new customer portal project. Ask what personal data it
         collects and where it is stored. Log a risk for the unanswered part.

TUESDAY
  09:00  Control testing: sample five sign-ins from the conditional access
         policy and confirm each had a compliant device. Record the result.
  11:00  Policy review: the acceptable use policy names a product that was
         replaced. Draft the change and route it for approval.
  14:00  Incident support: an analyst needs the notification obligation
         explained. State what you know, and route the decision to counsel.
  16:00  Update the control matrix with Tuesday's test result.

WEDNESDAY
  09:00  Awareness report: completion is at 84%. Identify the 16% and send
         a reminder to their managers, with the date.
  11:00  Internal audit prep: assemble the evidence pack for the quarterly
         audit. Note the two controls with no evidence yet.
  15:00  Exception review: two exceptions are expiring. Confirm with the
         owners whether to extend, close, or treat the risk properly.

THURSDAY
  09:00  Risk workshop with the infrastructure team. Score four new risks
         using the published scale. Argue about one of them, and record
         the disagreement rather than resolving it by averaging.
  13:00  Write up the workshop and update the register.
  15:00  Read the new NIST CSF mapping the auditor sent and check it
         against your control matrix.

FRIDAY
  09:00  Reporting: produce the monthly pack. Top risks, movements,
         controls tested, findings status, open exceptions.
  13:00  Update the policy review calendar for the next quarter.
  15:00  Learning block: read the quarterly threat report for your sector.
```

Three things in that week are worth naming.

**The risk workshop argument on Thursday is normal and healthy.** Two people scoring a risk differently is the scale doing its job, and the resolution is a documented rationale rather than an average. Averaging two scores resolves the disagreement and destroys the information.

**The 84% completion figure on Wednesday is a number, and the 16% is the work.** Anyone can report a percentage. Finding out who has not completed it, telling their manager, and setting a date is what closes it.

**Friday's reporting block produces the only artefact most senior people will ever read.** If the pack is clear and the trend is honest, the function is trusted. If it is a wall of green, nobody believes it, and the next funding request fails.

### Part 8 — Legal and ethical boundaries in GRC work

#### Authorisation is what makes the work possible

GRC work touches confidential information constantly: risk registers naming unpatched systems, audit findings naming people, vendor assessments containing another company's security posture, and incident records containing personal data.

**You may only access and disclose what your role authorises, for the purpose you were given.** That is the same boundary as Phase 1's, applied to documents instead of systems.

| Situation | The boundary |
|---|---|
| Reading a control matrix from your employer | Authorised as part of the role, and confidential afterwards |
| Sharing a vendor's SOC 2 report | Almost always restricted by the vendor's terms; check before circulating |
| Discussing an audit finding outside the audit | A breach of confidentiality, even if the finding seems minor |
| Using a real risk register in a portfolio | **Never without written permission and redaction** |
| Publishing a policy you wrote at work | Usually your employer's intellectual property — write your own version instead |
| Naming a colleague in a finding | Do it where the process requires it, and nowhere else |

That fourth row is the one that affects your portfolio directly, and Part 9 covers how to handle it.

#### Independence and the pressure you will feel

A GRC analyst sits between the people who own risk and the people who are accountable for it. That position creates pressure, and knowing it is coming is most of the defence.

| Pressure | What it sounds like | The right response |
|---|---|---|
| To soften a finding | "That will make the team look bad" | A finding is about a control, not a person. Describe the control |
| To mark a control as tested when it was not | "Just put pass, we all know it is fine" | Record it as not tested. That is the honest answer, and it is defensible |
| To lower a risk score | "Nobody will approve it at High" | Score it honestly, and record the disagreement. Funding decisions are not yours to make by adjusting the score |
| To accept a risk without an owner | "Can we just note it and move on" | An unowned acceptance is not an acceptance |
| To share confidential information | "Send me the vendor's report, I want to see it" | Check whether the vendor's terms permit it, and whether the recipient needs it |

**The second row is the one that ends careers.** Marking an untested control as passed is not a shortcut; it is a false record in a document that may be relied on by a regulator, an auditor, or a court.

#### The privacy of the people in your documents

A risk register and an audit report contain names. Those names are personal data.

| Practice | Why |
|---|---|
| Name roles in findings, not individuals | "The IT Manager" not "Juan" |
| Name individuals only where the process requires it | An access review needs an owner; a controls gap does not need a person |
| Redact before sharing outside the process | Confidentiality obligations survive your leaving the team |
| Do not paste incident details into a public portfolio | Even anonymised detail can re-identify in a small organisation |
| Retain according to the retention schedule | Keeping a document forever is itself a privacy risk |

### Part 9 — Building GRC artefacts you can safely show

#### The portfolio problem, and its solution

Phase 6 asked for a risk register and a policy. The difficulty is obvious: you cannot publish your employer's.

The solution is to build the artefacts for a **scenario you invent**, at a realistic level of detail.

| Artefact | How to make it realistic without using real data |
|---|---|
| **Risk register** | Invent a small company: a 40-person Philippine BPO serving one overseas client. Ten risks, scored with a published scale, with owners and treatment plans |
| **Policy** | Write the acceptable use policy for that company. Use roles rather than names |
| **Control matrix** | Map ten controls to NIST CSF 2.0 subcategories, plus a second column showing the ISO 27001 or PCI DSS requirement each also satisfies |
| **Evidence pack** | Describe the evidence each control would need, and note which of the ten you could not evidence — because no company can |
| **Vendor assessment** | Invent a supplier, answer the questionnaire as that supplier would, and write the decision record |
| **Audit finding response** | Write one finding and a full management response with owners and dates |

**The invented-company approach is standard practice in GRC hiring**, and it is accepted because everyone understands the confidentiality problem. What a reviewer is looking for is not the data. It is the reasoning.

#### What makes a GRC portfolio credible

| Weak artefact | Strong artefact |
|---|---|
| Ten risks all rated High | A spread of scores, with the scale published and at least one acceptance |
| A policy nobody could follow | A policy with roles, an exception process, and review dates |
| A control matrix where everything passes | A matrix with a Partial, a Fail, and a Not-tested row |
| A vendor assessment ending "approved" | "Approved with conditions", and the conditions named |
| A finding with actions and no dates | Actions with owners and dates, plus a stated accepted position |
| No limitations section | An explicit statement of what the artefacts do not cover |

**The fourth and fifth rows carry the most weight in an interview**, because they are where judgement becomes visible. Anyone can approve a vendor. Explaining what you approved, with which conditions, and what residual risk you are carrying, is the job.

#### The interview questions this phase prepares you for

| Question | What a strong answer contains |
|---|---|
| "What is the difference between a risk and a vulnerability?" | A vulnerability is a weakness; a risk is the potential for loss when a threat exploits it, with a stated impact |
| "How would you score this risk?" | Ask for the scale, then apply it. Say what you would need to know first |
| "What is residual risk?" | What remains after controls, and the number the organisation actually lives with |
| "Which framework would you use?" | "It depends on what the business needs to demonstrate" — then name the trigger: a customer asking for SOC 2, a tender requiring ISO 27001, card payments requiring PCI DSS |
| "How do you handle a control you cannot test?" | Record it as not tested, with the reason, and raise it. Never mark it as passed |
| "What would you do if asked to lower a score?" | Score honestly, record the disagreement, and let the accountable owner decide with the true number in front of them |
| "Have you written a policy?" | Show the invented-company policy, and explain the exception process and why it exists |

**The sixth answer is the one that gets people hired in GRC.** It demonstrates that you understand the integrity requirement of the role, and that you have thought about what you would do when it is tested.

### Key takeaways

- **Governance sets the appetite, risk measures against it, compliance proves it.** Three functions, three artefacts, and conflating them is why many security programmes cannot explain themselves.
- **Compliance is a floor, not a ceiling.** You can be compliant and breached, and every framework says so.
- **A risk is a statement with a cause, an event, and an impact.** "Weak patching" is a topic; it cannot be scored or closed.
- **Inherent, residual, and target are three different numbers**, and the gap between residual and target is the remediation case.
- **Publish the scoring scale.** A register where everything is "medium" is a register with no information in it.
- **An acceptance needs an owner and a review date**, or it is an unmanaged risk with a note attached.
- **Transfer moves the financial consequence, not the breach.** Insurance and liability caps do not restore customer trust.
- **Learn NIST CSF 2.0 first.** It is free, sector-neutral, and its six functions are the vocabulary the field actually uses.
- **ISO 27001 Annex A is a menu, not a checklist.** You select controls, justify them, and document exclusions.
- **SOC 2 Type II tests operating effectiveness over a period**; Type I tests design at a point in time, and customers ask for Type II.
- **One control satisfies several frameworks.** Implement once, document once, map to each.
- **A control matrix where everything passes is a matrix nobody tested.** Partial, Fail, and Not-tested rows are what make it credible.
- **Evidence must be relevant, complete, and attributable.** A policy saying reviews happen quarterly is not evidence that a review happened.
- **A policy without an exception process will be broken quietly.** Section 6 is the one beginners omit.
- **"Yes, where possible" is a non-answer** on a vendor questionnaire, and recognising it is a skill.
- **Data minimisation pays for itself**, because data you never collected cannot be breached or retained too long.
- **Know that a privacy notification obligation exists and route the decision.** The specific trigger and deadline are legal questions.
- **Record a control as not tested rather than as passed.** Marking a false result is the thing that ends GRC careers.
- **Build your portfolio on an invented company.** The reasoning is what a reviewer is assessing, and the confidentiality problem is universally understood.

### Practice this next

The nine tasks build a complete GRC artefact set for one invented organisation. Keep the same company throughout, because coherence is what makes the set convincing.

1. **Invent the company and write its asset inventory first** (tasks 1 and 2). A 40-person Philippine BPO serving one overseas client is realistic and gives you a mix of regulated data, cloud services, and third parties. Classify every asset, because the classification drives everything downstream.
2. **Publish the scoring scale before you score anything** (task 2's second half). Write the likelihood definitions, the impact definitions, and the matrix bands. This document is what makes every later score defensible, and it is the artefact most learners skip.
3. **Build a ten-risk register** (task 3) using the cause-event-impact template. Force a spread: at least one Critical, two Highs, several Mediums, and at least one documented acceptance with an owner and a review date. A register with no acceptance is a register that has not faced a real trade-off.
4. **Read one framework properly** (task 4) — NIST CSF 2.0 is the right choice — and write down ten subcategory identifiers with your own paraphrase of each. Do not attempt to learn all of them; learn how the structure works.
5. **Build the control matrix** (task 5) with ten controls mapped to your chosen subcategories, and a second column mapping each control to a second framework. Include at least one Partial, one Fail, and one Not-tested row, and write the finding for the Fail.
6. **Write the policy** (task 6) using the template, including section 6. Then test it against the five properties: scoped, specific, achievable, enforceable, owned. Rewrite anything that fails.
7. **Write the vendor assessment** (task 7) with a decision of "approve with conditions", the conditions named, the residual risk stated, and a review date. Include at least one non-answer in the vendor's responses and note it as a non-answer.
8. **Write the audit finding response** (task 8) for your Fail row, with a cause rather than a condition, actions with owners and dates, a verification step, and an explicit accepted position.
9. **Assemble the evidence pack outline** (task 9): for each of your ten controls, the specific evidence an auditor would ask for, and which of the ten you could not evidence. Then write the limitations section for the whole artefact set.

Then open `portfolio/cyber/13-grc-compliance.md` and assemble the deliverables. **The phase is done when you can identify an asset, name its risk in business language, score it with a defined scale, map the control that addresses it to a real framework, write the policy that governs it, and describe the evidence an auditor would ask for** — and the artefacts should let a reader check every one of those claims.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| NIST Cybersecurity Framework 2.0 | Voluntary risk framework | Free | https://www.nist.gov/cyberframework | Write your own paraphrase of ten subcategories | CIS Controls |
| CIS Controls | Prioritised safeguard list | Free | https://www.cisecurity.org/controls | Map five of your controls to CIS safeguards | NIST CSF |
| ISO/IEC 27001 | Certifiable management system standard | Paid | https://www.iso.org/standard/27001 | Read the public overview and list the Annex A themes | NIST CSF, which is free and covers similar ground |
| SOC 2 Trust Services Criteria | Attestation criteria | Free | https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 | Read the security criteria and note three you could map to | ISO 27001 Annex A, or NIST CSF |
| PCI DSS | Card payment standard | Free | https://www.pcisecuritystandards.org/ | Read the twelve requirement groups and summarise each in a line | PCI SSC document library, free with registration |
| HHS HIPAA resources | US health data rules | Free | https://www.hhs.gov/hipaa/index.html | Read the Security Rule safeguards summary | NIST SP 800-66, free |
| National Privacy Commission | Philippine data privacy regulator | Free | https://privacy.gov.ph/ | Read the breach notification guidance and note who decides | GDPR guidance from the EDPB |
| NIST SP 800-30 | Risk assessment guide | Free | https://csrc.nist.gov/pubs/sp/800/30/r1/final | Use its likelihood and impact language in your scale | ISO 31000 overview material |
| Google Sheets | Risk register and control matrix | Free | https://sheets.google.com/ | Build the register with conditional formatting on the score | LibreOffice Calc |
| draw.io | Risk matrix and process diagrams | Free | https://www.diagrams.net/ | Draw the 5x5 matrix with the bands coloured | Excalidraw |
| Notion or Obsidian | Policy and evidence documentation | Freemium | https://obsidian.md/ | Write the policy set in Markdown with review dates | Plain Markdown files in a Git repository |
| OpenSCAP | Automated control checking | Free/open-source | https://www.open-scap.org/ | Run a compliance scan on a Linux lab VM | Manual checks against a written baseline |

## Free/cheap resources

- NIST Cybersecurity Framework 2.0 — https://www.nist.gov/cyberframework
- NIST SP 800-30 risk assessment guide — https://csrc.nist.gov/pubs/sp/800/30/r1/final
- NIST SP 800-53 control catalogue — https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final
- CIS Controls — https://www.cisecurity.org/controls
- CIS Benchmarks — https://www.cisecurity.org/cis-benchmarks
- AICPA SOC 2 overview — https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2
- PCI Security Standards Council — https://www.pcisecuritystandards.org/
- ISO/IEC 27001 overview — https://www.iso.org/standard/27001
- HHS HIPAA Security Rule — https://www.hhs.gov/hipaa/for-professionals/security/index.html
- National Privacy Commission of the Philippines — https://privacy.gov.ph/
- Philippine Data Privacy Act of 2012 — https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html
- GDPR official text — https://eur-lex.europa.eu/eli/reg/2016/679/oj
- EDPB guidelines and recommendations — https://www.edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_en

## Hands-on practice tasks

1. Invent a small organisation with an asset inventory of at least fifteen assets, each classified.
2. Publish a risk scoring scale with likelihood and impact definitions and matrix bands.
3. Build a risk register with ten risks written as cause, event, and impact, scored inherent and residual.
4. Read NIST CSF 2.0 and write your own paraphrase of ten subcategories with their identifiers.
5. Build a control matrix mapping ten controls to subcategories and to a second framework.
6. Write an acceptable use policy including a compliance and exceptions section.
7. Complete a vendor assessment with a decision of "approve with conditions" and a stated residual risk.
8. Write an audit finding response with a cause, owned actions, dates, and an accepted position.
9. Outline the evidence required for each control and state which ones you could not evidence.

## Deliverable / proof of work

Create `portfolio/cyber/13-grc-compliance.md` with:

- An asset inventory of at least fifteen assets with classifications and a stated classification scheme
- A published risk scoring scale with likelihood and impact definitions and the matrix
- A risk register of ten risks with inherent and residual scores, owners, and treatment plans
- At least one documented risk acceptance with an owner, a justification, and a review date
- A ten-row control matrix mapping to NIST CSF 2.0 and a second framework, including Partial, Fail, and Not-tested rows
- An acceptable use policy with a compliance and exceptions section and a review date
- A vendor assessment record with conditions and residual risk
- An audit finding response with a cause, owned actions, verification, and an accepted position
- An evidence requirements outline per control, naming the ones you could not evidence
- A limitations section stating what the artefact set does not cover

## Checklist

- [ ] I can explain governance, risk, and compliance as three separate functions. <!-- id: cyber-13-grc-three-functions energy: low -->
- [ ] I built an asset inventory with a classification scheme and applied it. <!-- id: cyber-13-asset-inventory energy: normal -->
- [ ] I can write a risk as a cause, an event, and an impact rather than as a topic. <!-- id: cyber-13-risk-statement-writing energy: normal -->
- [ ] I published a likelihood and impact scale before scoring any risk. <!-- id: cyber-13-risk-scoring-scale energy: normal -->
- [ ] I distinguished inherent, residual, and target risk in my register. <!-- id: cyber-13-residual-vs-inherent energy: normal -->
- [ ] I documented a risk acceptance with an owner, a justification, and a review date. <!-- id: cyber-13-risk-acceptance-record energy: normal -->
- [ ] I can name the six NIST CSF 2.0 functions and what each covers. <!-- id: cyber-13-nist-csf-functions energy: low -->
- [ ] I mapped ten controls to framework subcategories with identifiers. <!-- id: cyber-13-control-matrix energy: normal -->
- [ ] My control matrix includes Partial, Fail, and Not-tested rows. <!-- id: cyber-13-honest-test-results energy: normal -->
- [ ] I can explain why ISO 27001 Annex A is a menu rather than a checklist. <!-- id: cyber-13-iso-annex-a-reasoning energy: low -->
- [ ] I wrote a policy with a compliance and exceptions section and a review date. <!-- id: cyber-13-policy-written energy: normal -->
- [ ] I tested my policy against the five properties and rewrote what failed. <!-- id: cyber-13-policy-usability-test energy: normal -->
- [ ] I completed a vendor assessment ending in "approve with conditions". <!-- id: cyber-13-vendor-assessment energy: normal -->
- [ ] I can describe the evidence an auditor would accept for five controls. <!-- id: cyber-13-evidence-requirements energy: normal -->
- [ ] I wrote an audit finding response with a cause, not just a condition. <!-- id: cyber-13-finding-response energy: normal -->
- [ ] I can state what I would do if asked to mark an untested control as passed. <!-- id: cyber-13-grc-integrity-stance energy: low -->
- [ ] I know a privacy notification obligation exists and who decides whether it applies. <!-- id: cyber-13-privacy-escalation-path energy: low -->

## You're ready to move on when...

You can identify an asset, name its risk in business language, score it with a defined scale, map the control that addresses it to a real framework, write the policy that governs it, and describe the evidence an auditor would ask for.

## Free vs Paid

### What's free and enough

NIST CSF 2.0, the CIS Controls and Benchmarks, NIST SP 800-30 and SP 800-53, the AICPA's published SOC 2 criteria, the PCI DSS document library, the HHS HIPAA guidance, the National Privacy Commission's guidance, and the GDPR text are all free and together they are more framework material than you can read in a year. Google Sheets or LibreOffice builds the register and the matrix, draw.io draws the risk matrix, and Markdown files in a Git repository hold the policy set with a genuine revision history. Every artefact this phase requires can be produced for nothing, and the artefacts are what get assessed in an interview.

### What's paid and why you'd upgrade

The ISO/IEC 27001 standard itself is a paid document, and certification requires an accredited certification body, an audit, and annual surveillance — a five-figure commitment for a small organisation. GRC platforms such as ServiceNow GRC, Archer, and Vanta automate evidence collection, control mapping, and continuous monitoring, which is genuinely valuable at scale because it replaces the spreadsheet-chasing that consumes a quarter of a junior analyst's week. Commercial policy templates, vendor questionnaire libraries, and paid threat-intelligence feeds add convenience. GRC certifications such as CISA, CISM, and CRISC require years of verified experience before the credential is awarded, as Phase 7 explained.

### When it's worth paying

Pay when a customer or a tender requires a certification you do not hold, or when the manual evidence collection has grown past what a person can maintain — and at that point the employer pays, not you. For a learner, the honest position is that this phase costs nothing and that the frameworks are free by design, because a standard nobody can afford to read is a standard nobody follows. The one place money genuinely matters is the ISO 27001 standard document, and even there the public overview, the NIST CSF, and the CIS Controls teach the same concepts without the price. If GRC is your target path, spend your effort on the artefacts and on reading one framework properly rather than on any purchase — a register with a published scale, a policy with a real exception process, and a control matrix with an honest Fail row will outperform a certificate in the room where the hiring decision is made.