---
id: curriculum-grc-and-ot
exam: "CS Roadmap Risk, Compliance and Industrial Control Security"
code: CS-GRC-OT
kind: curriculum-practice
track: cyber
phases: "cyber-13-grc-compliance,cyber-15-ot-ics-security"
scope: "Cyber Phases 13 and 15"
questions: 21
source: curriculum
---

# CS Roadmap Risk, Compliance and Industrial Control Security — curriculum practice exam

**Unofficial curriculum practice exam; not a certification exam or a job-readiness guarantee.** This diagnostic covers two phases that are usually taught far apart and belong together: how an organisation decides what to care about and proves it did, and what changes when the thing on the other end of the network can physically hurt someone. It is free practice and does not certify readiness for a GRC role or authority over any industrial system.

## How to use and score it

Answer all questions before checking the marked answers. Give yourself one point per correct answer, then read every explanation. **There is no pass/fail score or readiness threshold.** Use missed or guessed questions to identify which of the two phases to revisit.

**The two phases are paired deliberately.** Phase 13 gives you the vocabulary of risk, control, and evidence. Phase 15 is where that vocabulary meets a system you are not allowed to touch, and where the honest professional output is often a *written record of accepted risk* rather than a fixed vulnerability. Several questions below turn on that connection: a compensating control, a documented risk acceptance, and a residual score are the same idea in both phases.

**Read the safety boundary before the technical questions, because they are not equally weighted.** Phase 15 states its rules as prohibitions rather than guidelines, and the reason is that the failure mode is not a lost record. Where a question involves a live control system, the safe answer is usually the one that involves observing rather than touching. Nothing in this paper authorises any action against a system you do not own, and the phase's own sentence is worth carrying into every question: **never send a packet to a control system you do not own, and never send one to a safety system at all.**

**A note on what is a fact and what is a position.** Phase 13's frameworks are real documents and its arithmetic is real arithmetic, so most of its questions have objectively correct answers. Phase 15 is different: its positions on passive-over-active monitoring and on when a risk acceptance is the right output are the curriculum's professional judgement, argued rather than assumed. Where a question turns on one of those, the explanation says so.

## Domain 1 — Risk, scored and defended (8 questions)

### Q1. Phase 13 lists three misconceptions that cost people interviews. Which one does it state as a principle, and what is the principle?
<!-- phases: cyber-13-grc-compliance -->

- [ ] That GRC is the paperwork side of security, because the artefacts are the work product
- [ ] That GRC is where you go if you cannot do technical work, because the work is not technical
- [x] **That compliance means secure is false — compliance is a floor, not a ceiling**
- [ ] That frameworks are only for large organisations, because small ones lack the staff

**Why:** The phase states it as a principle: compliance is a floor, not a ceiling. A framework tells you what a group of people agreed was the minimum, and meeting it does not mean you are secure while failing it does not mean you are compromised — it means you cannot demonstrate that you meet a defined bar. The phase's correction of the other two misconceptions is also worth retaining: GRC is the **decision** side with paperwork as the record of decisions, and an analyst who cannot read a firewall rule cannot test the control that depends on it.

### Q2. Two analysts score the same risk four and sixteen. What does the phase say prevents this, and what does it say happens without it?
<!-- phases: cyber-13-grc-compliance -->

- [x] **Published scales defining each likelihood and impact value — without them the register becomes an opinion poll**
- [ ] A risk appetite statement, because it sets the acceptable range in advance
- [ ] A calibrated scoring tool, because spreadsheets introduce arithmetic inconsistency
- [ ] A second reviewer, because scoring requires consensus between two analysts

**Why:** The phase's line is that a risk score is meaningless unless the scale is published, and that the definitions are what make a score defensible. It gives both scales explicitly — likelihood from Rare to Almost certain, impact from Insignificant to Severe — with a definition for each value, and the definitions are the part that does the work. Its example of the failure without them is exactly this question: two analysts scoring the same risk four and sixteen, which turns the register into an opinion poll rather than a management document.

### Q3. A register entry records an inherent score of 20 and a residual score of 10. What does the phase say each of those numbers is for?
<!-- phases: cyber-13-grc-compliance -->

- [ ] Inherent is the auditor's view, and residual is the risk owner's view
- [ ] Inherent justifies the control's cost, and residual justifies the control's removal
- [ ] Inherent is the score before remediation is budgeted, and residual is the score after it is funded
- [x] **Inherent explains why anyone cares, and residual is what the organisation is actually living with**

**Why:** The phase calls inherent and residual the pair that beginners collapse, and distinguishes them by what they tell a decision-maker: inherent describes how dangerous the situation would be if nothing were done, which is what justifies the control existing, while residual is the exposure that gets accepted or remediated. The third number, target risk, is what turns the residual into a plan — the gap between residual and target is the remediation case, which is why the phase's worked entry carries all three plus an owner and a date.

### Q4. Phase 13 says a risk acceptance needs five fields and that an acceptance missing any of them is not an acceptance. Which field does it call the one that turns acceptance into management?
<!-- phases: cyber-13-grc-compliance -->

- [x] **The review date, because acceptance is time-limited rather than permanent**
- [ ] The residual score, because it makes the size of what is being accepted visible
- [ ] The business justification, because it explains why accepting beats treating
- [ ] The named accepting owner, because accountability sits with a person rather than a team

**Why:** The phase's reason is that a risk accepted indefinitely is a risk nobody has thought about since the day it was written, so the review date is the field that converts a decision into an ongoing process. The other three fields are all genuinely required — the phase names the risk statement, the residual score, the business justification, the named owner, and the review date — which is why they work as distractors: they are necessary conditions rather than the one the phase singles out as making acceptance *managed*.

### Q5. A control matrix where every row reads "Pass". What does the phase say this indicates?
<!-- phases: cyber-13-grc-compliance -->

- [ ] A matrix scoped too narrowly, because a full matrix always includes inapplicable requirements
- [ ] A mature control environment, which is the expected result of an effective programme
- [ ] A matrix that was tested but whose findings were remediated before publication
- [x] **A matrix nobody tested, because every experienced auditor knows the two non-pass rows are what make it credible**

**Why:** The phase states it directly: a control matrix where every row says Pass is a matrix nobody tested. Its own worked matrix carries a Partial and a Fail, and the phase explains what each result triggers — Partial produces a finding with a remediation date, Fail produces a finding plus a risk register entry and a remediation plan. The fourth option is a real concept used in the wrong place: "Not applicable" is a legitimate result that ISO 27001 requires a written justification for, but its absence from a matrix is not what an all-Pass result indicates.

### Q6. The phase names one row of its weak-versus-strong evidence table as where most first audits fail. A policy states that access reviews happen quarterly, and no review record exists. What does the phase say the position is?
<!-- phases: cyber-13-grc-compliance -->

- [ ] No finding, because the policy is approved and the control is therefore in place
- [x] **A finding — the evidence is the record and not the intention, so a control with no record of operating cannot be shown to operate**
- [ ] A finding only if the review was also required by a framework the organisation has adopted
- [ ] No finding until the next quarterly cycle completes, since the period is still open

**Why:** The phase's rule is that evidence is the record rather than the intention, and it applies that rule to this exact case: a policy saying reviews happen quarterly with no record of a review ever happening is a finding. The three properties evidence must have — relevant, complete, and attributable — are what make a record usable; the phase's point here is prior to all three, because there is no record to assess at all. Its strong-evidence example for this row is the signed review record for the quarter, listing every account, the reviewer, the date, and the removals made.

### Q7. A control owner offers a screenshot of today's patch dashboard as evidence for a quarterly access review. Which property of evidence does the phase's own table most directly treat this as failing?
<!-- phases: cyber-13-grc-compliance -->

- [ ] Attributable, because a dashboard screenshot has no named source
- [ ] None of them, provided the dashboard is the system of record for the control
- [x] **Relevant, because the phase's rule is that evidence shows the specific control rather than something adjacent**
- [ ] Complete, because a single day is not a quarter

**Why:** The phase defines relevance as showing the specific control rather than something adjacent, and its own weak-evidence table files a screenshot of today's patch dashboard under **patching** — a different control from access review. Both the third and fourth options name real failures, which is why this question turns on which one the phase's table treats this example as: a patch dashboard is evidence about patching, so it is adjacent to the access review rather than a record of it. Testing completeness instead would be defensible in the abstract, which is why the stem asks what the phase's table does with this example rather than what an auditor might ask first.

### Q8. Phase 13 warns about one vocabulary trap in the CIS Controls before you read any framework. What is it?
<!-- phases: cyber-13-grc-compliance -->

- [ ] That CIS uses "control" to mean a technical setting rather than a management process
- [ ] That the Implementation Groups are numbered in reverse order of maturity
- [ ] That CIS Safeguards and NIST subcategories are the same numbering scheme
- [x] **That "CIS Control 5" names a whole topic area while "Safeguard 5.3" names one specific thing to do**

**Why:** The phase explains that CIS has 18 **Controls** — the numbered headings such as *Control 1: Inventory and Control of Enterprise Assets* — and each Control contains several numbered **Safeguards** which are the actionable statements you implement. Mixing the two up in an interview is, in the phase's words, a small tell that you read a summary rather than the document. It also notes the Implementation Groups are subsets of the Safeguards sized to an organisation's maturity, with IG1 as the basic hygiene set and the sensible starting point for a home lab.

## Domain 2 — What the frameworks are for (3 questions)

### Q9. Phase 13 says if you learn one framework, learn NIST CSF 2.0. Which function was added in version 2.0, and why does the phase say it matters?
<!-- phases: cyber-13-grc-compliance -->

- [ ] **Recover**, because restoration priorities were missing from the earlier structure
- [ ] **Detect**, because continuous monitoring became a requirement rather than an option
- [x] **Govern**, because none of the other five work without someone deciding, funding, and owning them
- [ ] **Identify**, because asset inventories are the prerequisite for every other function

**Why:** Govern was added in CSF 2.0, and the phase calls it the function most organisations were missing — the explicit acknowledgement that nothing else works without someone deciding, funding, and owning it. Its example outcome for Govern is a documented risk appetite with named owners, which connects directly to the risk appetite and tolerance vocabulary earlier in the phase. The other three have been in the framework's structure; Recover and Identify are commonly misremembered as the newer additions because they are easy to under-invest in.

### Q10. An organisation claims full coverage of every Annex A control in ISO 27001. What does the phase say about this?
<!-- phases: cyber-13-grc-compliance -->

- [x] **It misunderstands the standard — Annex A is a menu, not a checklist, and exclusions require justification**
- [ ] It is required for certification, which is why the standard is certifiable
- [ ] It is the expected outcome, since Annex A is the standard's control catalogue
- [ ] It is achievable but expensive, and only large organisations pursue it

**Why:** The phase's key insight about ISO 27001 is that Annex A is a menu: you select the controls that apply, justify why, and document any exclusions, so an organisation claiming full coverage of every control without justification does not understand the standard. It also draws the larger distinction that ISO 27001 certifies a **management system** — the way you run security — rather than a list of technical controls, which is why the phase lists context, leadership, planning, support, operation, performance evaluation, and improvement alongside the control catalogue.

### Q11. Phase 13 describes several frameworks as free to read and not certification schemes. Which of these does it place in that category alongside NIST CSF?
<!-- phases: cyber-13-grc-compliance -->

- [ ] SOC 2, because the Trust Services Criteria are free to read
- [x] **CIS Controls, because they are free and have no certification scheme**
- [ ] PCI DSS, because compliance can be self-assessed
- [ ] ISO/IEC 27001, because the standard text is published openly

**Why:** The phase's table places NIST CSF and CIS Controls together as free, non-certifying frameworks. The other three options are each partly true and therefore trap-shaped: SOC 2's criteria are free to read but the audit is not and it produces an attestation report rather than a certificate; ISO 27001's standard text is paid and it is certifiable by an accredited body; PCI DSS is free to read and can be validated by self-assessment, but it is a mandatory standard rather than a voluntary non-certifying framework. The phase's larger point is that the certification column is what drives business decisions — organisations pursue certification because a customer, tender, or regulator requires it.

## Domain 3 — OT fundamentals and the safety boundary (6 questions)

### Q12. Phase 15 says OT is not IT security with older computers. Which of its differences is the one that makes the failure modes incomparable?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Ten to twenty-five year asset lifecycles, because patching assumes a shorter cycle
- [ ] Protocols with no authentication at all, because there is no mainstream IT analogue
- [x] **Safety as a first-class security goal, because the worst outcome is physical rather than informational**
- [ ] Vendor lock-in, because replacing a controller means re-engineering the process

**Why:** The phase's framing is that everything prior assumes the worst outcome is data — a stolen record, a defaced page, an account taken over — all survivable, while OT is a world where the worst outcome is a pump running dry or a boiler over-pressurised while someone stands next to it. It states that this difference is not a matter of degree but a different discipline, and its comparison table makes the same point: every other phase's worst realistic outcome is a breach, a downed service, or a lawsuit, while OT adds injury, fire, environmental release, and loss of life. The other three are genuine differences the phase lists; none of them is the one that changes what safety *means*.

### Q13. A high-severity remote code execution vulnerability is found in a controller on a plant network. "Just patch it" is not an available answer. Which of the phase's reasons for this is about the patch itself rather than the logistics?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] No spare capacity, so any restart of the controller is a production stop
- [ ] The change window is the annual shutdown, so an urgent patch may wait eleven months
- [ ] Validation and requalification mean a change must be re-tested before it may run
- [x] **A vendor patch has bricked controllers before, and bricking one during a campaign is worse than the vulnerability**

**Why:** The phase gives seven reasons patching is hard, and the risk of the patch itself is a distinct category from the six that are about windows, process, support, and capacity — it is a reason the patch may be the greater danger rather than merely inconvenient. The vendor certification row is the related one: the vendor supports one specific version combination, and unsupported means no help at three in the morning. The phase's output for this situation is not silence and not a demand but a set of compensating controls plus a documented risk acceptance.

### Q14. A plant cannot patch a controller and the team plans to document the residual risk. What does the phase say is required for that to count as a security control?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] A compensating control in place, because a control is what reduces the risk
- [x] **A written record of the vulnerability, the compensating controls, the residual risk, and the name of the person who accepted it**
- [ ] A vulnerability disclosure to the vendor, because the vendor must be informed
- [ ] Board approval, because unpatched systems are a governance matter

**Why:** The phase singles out the documented risk acceptance as a security control **and** as the row IT people skip, and it names the four things the record must carry. The third option is necessary but not sufficient, which is the trap: the phase requires compensating controls *and* the written acceptance that records them, because the acceptance is what makes the residual risk owned rather than forgotten. This is the point where Phase 13's risk acceptance vocabulary and Phase 15's plant reality are the same idea.

### Q15. Phase 15 says a control network must have no path into the safety instrumented system. What does it call this, and why is that row the whole design?
<!-- phases: cyber-15-ot-ics-security -->

- [x] **An absolute prohibition — if the control network can reach the SIS, every compromise of the control network is also a compromise of the safety system's exposure**
- [ ] A monitored path, because one-way traffic from the SIS is permitted for status
- [ ] A defence-in-depth boundary, because it adds a layer an attacker must cross
- [ ] A network segmentation requirement, because it keeps broadcast traffic separate

**Why:** The phase's table permits only a one-way path from the SIS outward for trip status and health, and states that nothing belongs on a path from the control network into the SIS — on any port, ever. Its reason for calling this the whole design is that a reachable path means the safety system's exposure is bounded by the control network's security, which is the thing an attacker has already demonstrated they can defeat. The phase's rules for the phase are stated as prohibitions rather than guidelines, and this row is why: the failure mode is an uncontrolled release, a fire, or a person being injured.

### Q16. A team wants to inventory the devices on a running plant network. Why does the phase reject a network scan, and what does it prescribe instead?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] A scan is rejected because it requires authorisation the team lacks, and the alternative is a vendor audit
- [ ] A scan is rejected because it is slow on plant networks, and the alternative is reading the asset register
- [x] **Any device might be fragile and you cannot tell which in advance, so passive collection is the default rather than the cautious option**
- [ ] A scan is rejected because plant protocols do not respond to TCP probes, so a scan returns nothing useful

**Why:** The phase's reasoning is that you cannot tell in advance which devices are fragile because the vendor documentation will not say, and the only safe assumption is that any device might be, which makes passive collection the default rather than the cautious option. It lists what active behaviour can do — a SYN to an unopened port crashing older stacks, a half-protocol probe leaving a device waiting, an ARP sweep crowding out control traffic, an SNMP walk crashing older agents — and notes that a scan during a critical process step is the worst timing and the hardest to explain afterwards. Its prescribed alternative is taps or SPAN ports feeding Zeek, Suricata, and Wireshark.

### Q17. Phase 15 says a hardware tap is better than a switch's SPAN port, but not because of the hardware. What does it give as the actual reason?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] A tap is passive by construction, while a SPAN port transmits and can disturb the process
- [ ] A tap sees traffic from multiple links, while a SPAN port sees only one
- [ ] A tap decrypts traffic that a SPAN port can only mirror in ciphertext
- [x] **A tap cannot drop packets under load and cannot be misconfigured by a tired engineer at two in the morning**

**Why:** The phase's reason is explicitly about failure modes rather than capability: a tap cannot drop packets under load and cannot be misconfigured, which are the two ways a SPAN port fails. It adds the practical note that for learning a SPAN port on a managed switch is entirely sufficient and free, which is why the phase's own practice stack is built on it. The fourth option inverts the safety reasoning — SPAN mirroring is a copy operation on the switch and does not transmit onto the monitored link — and it is the kind of plausible-sounding technical claim that would matter if it were true.

## Domain 4 — Boundary, legality, and honest limits (4 questions)

### Q18. A colleague argues that tapping an internal plant network is fine because it is not really someone else's and nothing is changed. How does the phase answer this?
<!-- phases: cyber-15-ot-ics-security -->

- [x] **Ownership decides rather than location, and tapping a network you do not own is interception**
- [ ] Neither point matters, because only physical modification of a controller is actionable
- [ ] Both points hold, provided written approval exists from the plant manager
- [ ] The first holds, but a safety-related interruption is a consequence regardless of intent

**Why:** The phase's legal section pairs each belief with what the law and the plant see: "it is an internal network, so it is not really someone else's" meets "ownership decides, not location", and "I only read traffic" meets "tapping a network you do not own is interception". It names the general offence under Republic Act 10175 and notes that in OT the same act can engage workplace safety law, environmental regulation, and civil liability — which is why the phase says the reason for the boundary is not primarily legal: you cannot predict what a packet will do to a device attached to a physical process.

### Q19. The phase says about the Colonial Pipeline incident in an OT phase. How does it want that explained?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] As a safety system compromise, because it triggered a safety instrumented system response
- [x] **As an IT-side incident whose lesson is about coupling — the operator shut the pipeline down because business systems it depended on were encrypted, not because the control systems were**
- [ ] As a ransomware attack on a controller, because encryption reached the plant floor
- [ ] As an OT network intrusion, because it demonstrated lateral movement into control systems

**Why:** The phase flags this as "the point that is almost always got wrong": the ransomware reached the corporate IT environment through an account without multi-factor authentication, the control systems were not encrypted, and the pipeline stopped because the operator judged it could not safely run without the billing, scheduling, and customer systems that were. The lesson it draws is about **coupling** rather than controllers — if a business system is a prerequisite for safely running a physical process, then the security of that business system is an OT safety concern. That is why the phase says this case belongs in an OT phase while teaching the reverse of the usual OT lesson: nothing exotic happened at the controller level, and the consequence was physical anyway.

### Q20. Phase 15 describes Triton as a watershed for the industry. What was new about it?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] It was the first attack to use a zero-day vulnerability against a controller
- [ ] It was the first to cross from the business network into a plant network
- [ ] It was the first to cause a physical process to operate outside its safe limits
- [x] **It targeted the safety instrumented system itself, which had previously been treated as a protected boundary rather than a target**

**Why:** Triton's significance in the phase is that it attacked the safety layer — the system whose whole purpose is to bring a process to a safe state — which is why the phase uses it to introduce the rule that you never send a packet to a safety controller you do not own, and why the phase says the safety-system design question is whether anything can reach the SIS. The phase's rule about a SIS sharing sensors with the control system it protects is the related architectural lesson: a shared sensor is a shared point of failure for both the process and its protection.

### Q21. Phase 15 says the correct assumption is that a device is fragile until proven otherwise, and that the proof involves risk you do not get to take on someone else's behalf. What follows from that for the first step when you find a vulnerability in a control system?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Immediately capture forensic evidence, because the window before remediation is short
- [ ] Notify the vendor first, because only the vendor can issue a fix for the firmware
- [x] **Stop and do not confirm it — continuing to explore is a physical risk to people who are not part of the conversation, where on the web it is a legal one**
- [ ] Isolate the affected controller from the network, because containment precedes investigation

**Why:** The phase's six steps begin with stop, and do not confirm it, and its gloss on why step one differs from the equivalent in the web phase is the sentence this question turns on: on the web, continuing to explore is a legal risk, on a control system it is a physical risk to people who are not part of the conversation. The remaining steps record what you have factually, notify the asset owner immediately, notify the vendor through its security contact, keep every message timestamped, and let the vendor and owner coordinate disclosure rather than setting your own deadline. Every wrong option here is a real practice in other phases — evidence capture, vendor notification, and containment are all correct moves in incident response — which is why the phase's point is that this discipline inverts the usual first reflex.

## Question-to-phase map

| Question | Main phase(s) |
|---|---|
| Q1–Q10 | `cybersec-roadmap/13-phase-grc-compliance.md` |
| Q11–Q21 | `cybersec-roadmap/15-phase-ot-ics-security.md` |

**These two phases are adjacent in a way worth noticing while you review.** Three questions here — the residual score, the documented risk acceptance, and evidence that proves a control operated — are Phase 13 vocabulary applied to Phase 15 situations. If you missed Q4 and Q14 together, the gap is probably the risk-acceptance record rather than either phase separately.

## What a score does and does not mean

There is no pass mark here, and no number on this page implies readiness for a GRC analyst role or authority over any industrial system. **The questions are written to the decisions these two phases teach, not to a certification blueprint**, because neither phase is aligned to a certification — Phase 13 says so directly, noting that CISA, CISM, and CRISC require years of verified professional experience and are not entry points.

**Nothing in this paper authorises any action against a system you do not own.** Phase 15's boundary is stated as prohibitions rather than guidance, and its legal position is that the scope document is the authorisation and it has edges. A practice environment is where this material is meant to be exercised, and the phase describes a free one built from vendor simulation environments and software PLCs.

A useful reading of a miss is narrower than "I got this wrong." Phase 13's questions mostly turn on whether you can produce a **defensible artefact** — a scored register, a control description specific enough to test, evidence covering a whole period. Phase 15's mostly turn on whether you can recognise the moment when the correct professional output is a written record rather than a technical fix. Both are habits rather than facts, and the mapped phase is where to practise them.
