---
id: curriculum-grc-and-ot
exam: "CS Roadmap Risk, Compliance and Industrial Control Security"
code: CS-GRC-OT
kind: curriculum-practice
track: cyber
phases: "cyber-13-grc-compliance,cyber-15-ot-ics-security"
scope: "Cyber Phases 13 and 15"
questions: 49
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

- [ ] The named accepting owner, because accountability sits with a person rather than a team
- [x] **The review date, because acceptance is time-limited rather than permanent**
- [ ] The residual score, because it makes the size of what is being accepted visible
- [ ] The business justification, because it explains why accepting beats treating

**Why:** The phase's reason is that a risk accepted indefinitely is a risk nobody has thought about since the day it was written, so the review date is the field that converts a decision into an ongoing process. The other three fields are all genuinely required — the phase names the risk statement, the residual score, the business justification, the named owner, and the review date — which is why they work as distractors: they are necessary conditions rather than the one the phase singles out as making acceptance *managed*.

### Q5. A control matrix where every row reads "Pass". What does the phase say this indicates?
<!-- phases: cyber-13-grc-compliance -->

- [ ] A matrix scoped too narrowly, because a full matrix always includes inapplicable requirements
- [ ] A mature control environment, which is the expected result of an effective programme
- [ ] A matrix that was tested but whose findings were remediated before publication
- [x] **A matrix nobody tested, because every experienced auditor knows the two non-pass rows are what make it credible**

**Why:** The phase states it directly: a control matrix where every row says Pass is a matrix nobody tested. Its own worked matrix carries a Partial and a Fail, and the phase explains what each result triggers — Partial produces a finding with a remediation date, Fail produces a finding plus a risk register entry and a remediation plan. The option about a matrix scoped too narrowly is a real concept used in the wrong place: "Not applicable" is a legitimate result that ISO 27001 requires a written justification for, but its absence from a matrix is not what an all-Pass result indicates.

### Q6. The phase names one row of its weak-versus-strong evidence table as where most first audits fail. A policy states that access reviews happen quarterly, and no review record exists. What does the phase say the position is?
<!-- phases: cyber-13-grc-compliance -->

- [ ] No finding, because the policy is approved and the control is therefore in place
- [x] **A finding — the evidence is the record and not the intention, so a control with no record of operating cannot be shown to operate**
- [ ] A finding only if the review was also required by a framework the organisation has adopted
- [ ] No finding until the next quarterly cycle completes, since the period is still open

**Why:** The phase's rule is that evidence is the record rather than the intention, and it applies that rule to this exact case: a policy saying reviews happen quarterly with no record of a review ever happening is a finding. The three properties evidence must have — relevant, complete, and attributable — are what make a record usable; the phase's point here is prior to all three, because there is no record to assess at all. Its strong-evidence example for this row is the signed review record for the quarter, listing every account, the reviewer, the date, and the removals made.

### Q7. The phase lists three properties evidence must have. A control owner offers a screenshot of today's patch dashboard as evidence that quarterly access reviews happen. Which of the phase's own definitions does that evidence fail?
<!-- phases: cyber-13-grc-compliance -->

- [ ] None of them, provided the dashboard is the system of record for the control
- [ ] Relevant, because the phase's rule is that evidence shows the specific control rather than something adjacent
- [x] **Complete, because the phase defines it as covering the whole period rather than a convenient sample**
- [ ] Attributable, because a dashboard screenshot has no named source

**Why:** The phase gives three properties — **Relevant** (shows the specific control, not something adjacent), **Complete** (covers the whole period, not a convenient sample), and **Attributable** (has a date, a source, and ideally a name). A single day's dashboard is a convenient sample rather than a record covering the quarter, so **Complete** is the definition it fails most directly. Relevance is the tempting answer and it is not nothing — the screenshot is a patch record rather than an access-review record, so it is arguably adjacent rather than specific — but the phase never classifies that example against a property, and the period gap is the one its own wording names. Note the phase's strong-evidence example for this control is the signed review record for the quarter, listing every account, the reviewer, the date, and the removals made.

### Q8. Phase 13 warns about one vocabulary trap in the CIS Controls before you read any framework. What is it?
<!-- phases: cyber-13-grc-compliance -->

- [x] **That "CIS Control 5" names a whole topic area while "Safeguard 5.3" names one specific thing to do**
- [ ] That CIS uses "control" to mean a technical setting rather than a management process
- [ ] That the Implementation Groups are numbered in reverse order of maturity
- [ ] That CIS Safeguards and NIST subcategories are the same numbering scheme

**Why:** The phase explains that CIS has 18 **Controls** — the numbered headings such as *Control 1: Inventory and Control of Enterprise Assets* — and each Control contains several numbered **Safeguards** which are the actionable statements you implement. Mixing the two up in an interview is, in the phase's words, a small tell that you read a summary rather than the document. It also notes the Implementation Groups are subsets of the Safeguards sized to an organisation's maturity, with IG1 as the basic hygiene set and the sensible starting point for a home lab.

## Domain 2 — What the frameworks are for (3 questions)

### Q9. Phase 13 says if you learn one framework, learn NIST CSF 2.0. Which function was added in version 2.0, and why does the phase say it matters?
<!-- phases: cyber-13-grc-compliance -->

- [ ] **Recover**, because restoration priorities were missing from the earlier structure
- [ ] **Detect**, because continuous monitoring became a requirement rather than an option
- [x] **Govern**, because none of the other five work without someone deciding, funding, and owning them
- [ ] **Identify**, because asset inventories are the prerequisite for every other function

**Why:** Govern was added in CSF 2.0, and the phase calls it the function most organisations were missing — the explicit acknowledgement that nothing else works without someone deciding, funding, and owning it. Its example outcome for Govern is a documented risk appetite with named owners, which connects directly to the risk appetite and tolerance vocabulary earlier in the phase. The other three functions have been in the framework's structure since before 2.0, which is why they are the wrong answers here.

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

## Domain 3 — Why OT is not IT: incidents, the safety boundary, and fragility (12 questions)

### Q12. Phase 15 says OT is not IT security with older computers. Which of its differences is the one that makes the failure modes incomparable?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Vendor lock-in, because replacing a controller means re-engineering the process
- [ ] Ten to twenty-five year asset lifecycles, because patching assumes a shorter cycle
- [ ] Protocols with no authentication at all, because there is no mainstream IT analogue
- [x] **Safety as a first-class security goal, because the worst outcome is physical rather than informational**

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

**Why:** The phase singles out the documented risk acceptance as a security control **and** as the row IT people skip, and it names the four things the record must carry. the disclosure option is necessary but not sufficient, which is the trap: the phase requires compensating controls *and* the written acceptance that records them, because the acceptance is what makes the residual risk owned rather than forgotten. This is the point where Phase 13's risk acceptance vocabulary and Phase 15's plant reality are the same idea.

### Q15. Phase 15 says a control network must have no path into the safety instrumented system. What does it call this, and why is that row the whole design?
<!-- phases: cyber-15-ot-ics-security -->

- [x] **An absolute prohibition — if the control network can reach the SIS, every compromise of the control network is also a compromise of the safety system's exposure**
- [ ] A monitored path, because one-way traffic from the SIS is permitted for status
- [ ] A defence-in-depth boundary, because it adds a layer an attacker must cross
- [ ] A network segmentation requirement, because it keeps broadcast traffic separate

**Why:** The phase's table permits only a one-way path from the SIS outward for trip status and health, and states that nothing belongs on a path from the control network into the SIS, with no legitimate reason for it. Its reason for calling this the whole design is that a reachable path means the safety system's exposure is bounded by the control network's security, which is the thing an attacker has already demonstrated they can defeat. The phase's rules for the phase are stated as prohibitions rather than guidelines, and this row is why: the failure mode is an uncontrolled release, a fire, or a person being injured.

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

**Why:** The phase's reason is explicitly about failure modes rather than capability: a tap cannot drop packets under load and cannot be misconfigured, which are the two trade-offs it lists against SPAN. It adds the practical note that for learning a SPAN port on a managed switch is entirely sufficient and free, which is why the phase's own practice stack is built on it. The first option is the trap — it sounds like the safety argument, but the phase attributes "does not transmit" to a different row entirely: **an inline device in a passive mode**, which is in the path without transmitting and is described as reliable but risky if the device fails.

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

- [ ] It was the first to cross from the business network into a plant network
- [ ] It was the first to cause a physical process to operate outside its safe limits
- [x] **It targeted the safety instrumented system itself, which had previously been treated as a protected boundary rather than a target**
- [ ] It was the first attack to use a zero-day vulnerability against a controller

**Why:** Triton's significance in the phase is that it attacked the safety layer — the system whose whole purpose is to bring a process to a safe state — which is why the phase uses it to introduce the rule that you never send a packet to a safety controller you do not own, and why the phase says the safety-system design question is whether anything can reach the SIS. The phase's rule about a SIS sharing sensors with the control system it protects is the related architectural lesson: a shared sensor is a shared point of failure for both the process and its protection.

### Q21. Phase 15 says the correct assumption is that a device is fragile until proven otherwise, and that the proof involves risk you do not get to take on someone else's behalf. What follows from that for the first step when you find a vulnerability in a control system?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Immediately capture forensic evidence, because the window before remediation is short
- [ ] Notify the vendor first, because only the vendor can issue a fix for the firmware
- [x] **Stop and do not confirm it — continuing to explore is a physical risk to people who are not part of the conversation, where on the web it is a legal one**
- [ ] Isolate the affected controller from the network, because containment precedes investigation

**Why:** The phase's six steps begin with stop, and do not confirm it, and its gloss on why step one differs from the equivalent in the web phase is the sentence this question turns on: on the web, continuing to explore is a legal risk, on a control system it is a physical risk to people who are not part of the conversation. The remaining steps record what you have factually, notify the asset owner immediately, notify the vendor through its security contact, keep every message timestamped, and let the vendor and owner coordinate disclosure rather than setting your own deadline. Every wrong option here is a real practice in other phases — evidence capture, vendor notification, and containment are all correct moves in incident response — which is why the phase's point is that this discipline inverts the usual first reflex.

### Q22. Why does the phase call the legitimate tool the most dangerous thing in a control network?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Because legitimate tools run with the highest privilege level on the network
- [ ] Because legitimate tools are rarely patched by the vendor
- [ ] Because legitimate tools are the ones exposed to the internet
- [x] **Because they are authorised by definition — the attacker in 2015 needed a stolen password and an HMI, and the HMI did exactly what it was built to do**

**Why:** The phase's lesson from the 2015 campaign is that **the attackers did not need a zero-day in a controller** — they needed a stolen password and an HMI, and the HMI performed its designed function. The most dangerous tool is therefore the legitimate one **because it is authorised by definition**, which means its actions are indistinguishable from normal operations by any check that asks whether the action is permitted. This is why the phase's monitoring priorities include new connections and unexpected sources rather than relying on authorisation alone.

### Q23. The phase contrasts web application security with OT by their worst realistic outcome of careless testing. What distinction does it draw?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Both risk an outage, but OT outages last longer
- [x] **Web work risks a breach, a downed service, or a lawsuit; OT work risks the same physical process driven outside its limits, and the phase's table gives injury, fire, environmental release, and loss of life**
- [ ] Web testing is legal with authorisation; OT testing requires a government permit
- [ ] Web testing risks data loss; OT testing risks regulatory fines

**Why:** The phase's comparison table puts web application security's worst realistic outcome as **a breach, a downed service, a lawsuit**, and adds that the same careless action on a process carries the additional consequence of driving it outside its limits. For OT and ICS the row reads **injury, fire, environmental release, and loss of life**. That is the reason the phase's legal position is described as *sharper* in OT: the same unauthorised act can additionally engage workplace safety law, environmental regulation, and civil liability.

## Domain 4 — Reading industrial protocols on the wire (9 questions)

### Q24. A capture shows a Modbus-shaped frame on port 502 whose protocol identifier field reads `0x0004`. What does the phase say that field should be, and what does a non-zero value suggest?
<!-- phases: cyber-15-ot-ics-security -->

- [x] **It is always zero for Modbus, so a non-zero value suggests traffic that is crafted or not really Modbus**
- [ ] It should equal the unit identifier, so `0x0004` means the request targets device four
- [ ] It is set by the client's vendor, so any value is normal
- [ ] It varies per transaction, so `0x0004` means this is the fourth request in the session

**Why:** The phase's Modbus TCP header table gives the protocol identifier as two bytes and **always zero for Modbus**. That makes it one of the few cheap integrity checks available on a protocol with no authentication: a frame on port 502 whose protocol identifier is not zero is either malformed or deliberately constructed, which is why the phase's own Suricata example tests this field before it tests anything else. The other three options describe real Modbus fields — the transaction identifier matches responses to requests, the unit identifier names the device behind a gateway, and the length field counts the bytes that follow — but none of them is this field.

### Q25. A Modbus write is executed against a controller at 03:00. Where does evidence of that write exist afterwards?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] The switch's session table, which records the client's identity
- [x] **The packet capture and whatever the controller's own diagnostics kept — the device did what it was told, with no credential, no session, and no record beyond the wire**
- [ ] The vendor's cloud telemetry, which logs all writes to supported controllers
- [ ] The controller's authentication log, since the write was accepted

**Why:** The phase states this as the closing point of its Modbus write example: the response is the whole story, because the device did what it was told with **no credential, no session, and no record beyond what crossed the wire**. The only place the write exists as evidence is the capture and the controller's diagnostics — which is why the phase puts control writes at the top of its monitoring priorities and why passive collection matters so much in OT. The first option assumes an authentication event that the protocol does not produce.

### Q26. You need to alert on control writes across a mixed plant. Which pair of protocols is hardest to alert on from packet contents alone, and why does the phase say so?
<!-- phases: cyber-15-ot-ics-security -->

- [x] **PROFINET and EtherNet/IP — a PROFINET write is not visible in a capture at all, and an EtherNet/IP write is a CIP service rather than an obvious operation**
- [ ] OPC UA and Modbus — because OPC UA encrypts and Modbus has no function codes for writes
- [ ] DNP3 and OPC UA — because both use select-before-operate
- [ ] Modbus and DNP3 — because both write to registers rather than to named tags

**Why:** The phase's cross-protocol comparison answers this directly. Modbus and DNP3 writes are **visually obvious** — a function code and a control operation respectively. EtherNet/IP is **"less so — a CIP service"**, and PROFINET is **"not in a capture"** at all, because real-time frames carry no IP header and bypass TCP/IP. OPC UA is readable **only with decryption**, which is a different problem from invisibility. This is why the phase's guidance is to learn the site's normal rather than to write a generic write-detection rule.

### Q27. A site has VLANs and an inter-VLAN firewall, and its owner states that PROFINET is segmented. What does the phase say is missing?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] An ACL on the firewall that permits only the controller's IP addresses
- [ ] A SPAN port on the switch carrying the PROFINET traffic to a monitor
- [ ] TLS termination at the zone boundary
- [x] **Layer 2 separation — a firewall that routes between IP subnets does not see PROFINET RT traffic, because there is no IP header to route, so segregation means different physical ports, different VLANs, and switches that understand what they carry**

**Why:** The phase calls this **the part that most surprises IT-trained people**. Real-time I/O frames travel directly on Ethernet with a dedicated EtherType, so a routing firewall has nothing to route and nothing to inspect. The phase's consequence is architectural rather than configurational: segregation at layer 2, which means the switches themselves must be able to handle the traffic. A SPAN port is a visibility measure and does nothing for separation, which is the trap in the second option.

### Q28. In a DNP3 deployment, which node carries the concentrated risk, and why?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Each outstation, because outstations are physically exposed in the field
- [ ] The historian, because it aggregates every outstation's data
- [x] **The master — one master polls many outstations, so compromising it gives control of the whole set**
- [ ] The DMZ jump host, because it brokers every remote session

**Why:** The phase's DNP3 feature table gives this as its first row: **master and outstation**, where one master polls many outstations, with the consequence stated as **the master is a single, high-value target**. That shape is the opposite of a segmented network's usual risk distribution, and it is why DNP3 architecture questions focus on where the master sits rather than on how many outstations exist. The phase treats the master as the node whose compromise is a fleet compromise.

### Q29. A well-behaved DNP3 control operation is two messages. What are they, and what does the phase say about seeing only one?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] An authenticate and an execute — seeing only the execute means authentication was bypassed
- [x] **A select that arms the operation and an operate that executes it; direct operate skips the arming step, and both forms are legitimate, so learn the site's normal before writing a rule**
- [ ] A read and a write — seeing only the write means the read was cached
- [ ] A poll and a response — seeing only the poll means the response was lost

**Why:** The phase calls **select-before-operate the pattern to remember**, and describes it as two messages: a *select* that arms the operation, then an *operate* that executes it. Critically, it adds that **direct operate skips the arming step and both are legitimate**, and that the pattern differs between implementations — which is exactly why the phase says to learn the site's normal before writing a rule. A single control message is therefore not automatically malicious, and a rule written without knowing the site's pattern will produce false positives.

### Q30. A utility states that it runs DNP3 with Secure Authentication. What does the phase say the useful follow-up question is?
<!-- phases: cyber-15-ot-ics-security -->

- [x] **Whether Secure Authentication is enabled on which points — it is optional, requires both ends to support it, and the answer is frequently no on an unknown subset**
- [ ] Whether the master is reachable from the internet
- [ ] Whether the traffic is encrypted with TLS 1.3
- [ ] Which cipher suite the master and outstations negotiated

**Why:** The phase states that Secure Authentication is **optional and requires both ends to support it**, and that the useful follow-up is not "is it encrypted" but **"is Secure Authentication enabled, and on which points"**. The reason is that the answer is frequently no on an unknown subset, so a blanket claim about the protocol tells you nothing about a specific link. This is the same shape as the OPC UA endpoint problem: the protocol's capability and the deployed configuration are separate facts.

### Q31. Two endpoints on the same OPC UA server can present different security policies. What does the phase say this means for a review?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Nothing, because security modes are negotiated per session and are always equivalent
- [ ] The server is misconfigured, because one policy applies to the whole server
- [x] **That is exactly where the misconfiguration lives — a server may offer a fully encrypted endpoint for the historian and a `None`-security endpoint for a legacy client nobody remembers installing**
- [ ] The `None` endpoint is the safer default, because legacy clients cannot support certificates

**Why:** The phase states that **two endpoints on the same server can have different security policies, and that is where the misconfiguration lives**, giving the historian-versus-forgotten-legacy-client example. So confirming TLS on the endpoint you thought about does not finish the assessment — you have to enumerate what the server offers, because the exposure is on the endpoint nobody is looking at. The phase compares a `None` endpoint with an anonymous user to being **exactly as open as Modbus, in a modern wrapper**.

### Q32. A plant offers OPC UA with message security mode "sign only" and claims confidentiality. What does the phase say is wrong?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Nothing is wrong, because signing implies encryption in OPC UA
- [ ] Signatures are forgeable without a trusted certificate chain
- [ ] Only the client is authenticated in sign-only mode
- [x] **Sign only is tamper-evident but readable by anyone with network access — the traffic is protected against modification, not against reading**

**Why:** The phase's OPC UA security-mode table is precise about the difference: **sign only is tamper-evident, and readable by anyone with network access**, while sign-and-encrypt is the mode that protects confidentiality. The distinction matters because "we enabled security on OPC UA" is a claim that can be true of a configuration that still leaks process data to anyone on the segment. The phase's third mode, `None`, is the one it compares to Modbus.

## Domain 5 — Assessment, monitoring, and the legal boundary (17 questions)

### Q33. Across the phase's five case studies, what type of control is shown interrupting the attack in every case?
<!-- phases: cyber-15-ot-ics-security -->

- [x] **Architectural, procedural, or detective — the phase notes that no memory corruption exploit, unpatched controller, or exotic technique appears in its lessons table, so the interruptible control is not a patch**
- [ ] A network IPS rule blocking the industrial protocol
- [ ] A vendor patch for the exploited vulnerability
- [ ] An antivirus or EDR signature for the malware

**Why:** The phase draws attention to what is **not** in its five-lessons table: no memory corruption exploit, no unpatched controller, and no exotic malware technique a defender could not address. In every row the interruptible control is architectural, procedural, or detective. This is a deliberate corrective to the IT reflex that a vulnerability is answered by a patch, and it is the same argument the phase makes about Stuxnet — where the control that did not exist as a product category was **monitoring for controller program changes**.

### Q34. A client says "it is an internal network, so it is not really someone else's." What is the phase's correction?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] It depends on whether the network crosses a VLAN boundary
- [x] **Ownership decides, not location — the network is someone else's because they own it, not because of where it sits**
- [ ] The vendor's written permission resolves the question
- [ ] Internal networks are exempt only if the tester is an employee

**Why:** The phase's legal-misconceptions table gives this line and answers it in four words: **ownership decides, not location**. The same table corrects the neighbouring claims that "I only read traffic" is harmless — tapping a network you do not own is **interception** — and that "the vendor said I could" is sufficient, since **the asset owner's authorisation is the one that matters**. The pattern across all of them is that authorisation attaches to ownership rather than to topology or to a third party's consent.

### Q35. A tester only runs `tcpdump` and sends no packets. Does the phase treat that as requiring authorisation?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Only if the traffic crosses a subnet the tester does not control
- [ ] No, because passive collection cannot affect a device
- [ ] No, provided the capture is not saved to disk
- [x] **Yes — tapping a network you do not own is interception, and the phase lists "I only read traffic" as a misconception**

**Why:** The phase's misconception table includes **"I only read traffic"** and answers it with **tapping a network you do not own is interception**. Two separate facts are being kept apart here: passively capturing does avoid the *availability* risk that the phase documents for scanning, fuzzing and connection floods, but it does not avoid the *authorisation* requirement. The phase's related correction, "nothing changed, so nothing happened", makes the same separation on the outcome side — a safety-related interruption is a consequence regardless of intent.

### Q36. A scan causes a nuisance trip but changes no configuration. What does the phase say about the legal position?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] It is a civil matter only, resolved by the vendor contract
- [ ] It is an offence only if the trip caused production loss
- [x] **A safety-related interruption is a consequence regardless of intent, and the phase says outcome affects sentencing rather than whether an offence occurred**
- [ ] No offence occurred, because no configuration was modified

**Why:** The phase corrects three related claims in its misconception table. **"Nothing changed, so nothing happened"** is answered with **a safety-related interruption is a consequence regardless of intent**, and **"nobody was hurt"** is answered with **outcome affects sentencing, not whether an offence occurred**. Together they separate the existence of an offence from its severity, which is why the phase insists the correct assumption is that a device is fragile until proven otherwise and that the proof involves risk you do not get to take on someone else's behalf.

### Q37. An OT assessment is being scoped. Which document does the phase say must name an explicit safety-system exclusion?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] The change and permit process
- [ ] The shutdown or rollback plan
- [x] **The rules of engagement — zones in scope, techniques permitted, and an explicit safety-system exclusion**
- [ ] The insurance and indemnity agreement

**Why:** The phase's six engagement instruments each answer a distinct question, and the **rules of engagement** is the one carrying scope: zones in scope, techniques permitted, and the explicit safety-system exclusion. The **change and permit process** answers who authorised the work and for which window, the **shutdown or rollback plan** answers what happens if a device does not come back, and **insurance and indemnity** answers who carries the consequence if a process stops. The phase calls the scope document the authorisation itself, which is why "I was hired to look, so I can look anywhere" is a misconception.

### Q38. In a mature OT engagement, who holds stop-work authority and on what basis?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] The lead tester, on a technical assessment of risk
- [ ] The client's security officer, in writing and in advance
- [ ] The automation vendor, on contractual grounds
- [x] **Anyone in the room, for a safety reason and without having to justify it — the phase calls this row the mark of a mature OT engagement**

**Why:** The phase's engagement instrument is stated as **anyone in the room can halt the work for a safety reason, without justifying it**, and it draws a strong conclusion: **if the person closest to the process cannot stop the assessment with a word, the assessment is not being run safely**. The design point is that the authority belongs to whoever has the best view of the physical process rather than to the most senior or most technical person, because the person who notices a valve in the wrong state may be the operator standing next to the tester.

### Q39. A vulnerability is confirmed in a control system. Which of the phase's disclosure steps covers who coordinates the public disclosure?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] The asset owner posts a summary once the vendor has been told
- [x] **The vendor and the owner coordinate disclosure together — the finder's steps are to record factually, notify the owner immediately, notify the vendor through its security contact, keep every message timestamped, and let them coordinate**
- [ ] The finder sets a 90-day deadline and publishes when it expires
- [ ] The finder publishes a proof of concept alongside the vendor advisory

**Why:** The phase's disclosure workflow gives six steps and an explicit list of things not to do, among them **post about it or discuss it in a public forum**, **publish a proof of concept**, **delete anything**, and **set your own deadline**. Coordination belongs to the vendor and the owner. The phase's separate warning about step one explains why the whole workflow is more conservative than its web equivalent: **on the web, continuing to explore is a legal risk; on a control system, continuing to explore is a physical risk to people who are not part of the conversation**.

### Q40. Which activity does the phase say harms a controller by exhausting its connection table, so that it stops serving its real clients?
<!-- phases: cyber-15-ot-ics-security -->

- [x] **A connection flood — a device with a small connection table stops serving the clients it exists to serve**
- [ ] An SNMP walk of the device's management interface
- [ ] A protocol fuzz against the device's stack
- [ ] A ping sweep across the control subnet

**Why:** The phase's active-scan risk table pairs each action with its specific failure mode: a **ping sweep** makes some devices log a fault, some stop answering for a period, and **a few have crashed**; an **Nmap service scan** puts devices into unexpected states through half-open probes; a **connection flood** exhausts a small connection table so the device stops serving real clients; and a **protocol fuzz** has **no expectation of graceful handling** at all. The phase adds that any of these during a batch or a start-up sequence is the worst possible moment and the hardest to explain.

### Q41. Where does the phase rank "changes to controller logic or configuration" in its monitoring priorities, and what is the reason for that rank?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] First, because a logic change is the end state an attacker wants
- [ ] Last, because logic changes cannot be detected passively
- [x] **Fourth, because detecting the change is the control when you cannot patch**
- [ ] It is not on the list, because logic changes are a change-management concern

**Why:** The phase's ordered priority list puts **control writes first** — a write is a change to the physical world and the highest-signal event on the wire — then new connections to level 1 and 2 devices, then engineering protocol sessions, and **changes to controller logic or configuration fourth**, with the reason that **detecting the change is the control when you cannot patch**. This is the same argument the phase makes about Stuxnet, where program-change monitoring was the control that did not exist as a product category at the time.

### Q42. An engineering protocol session to a controller begins at 02:00 with nobody on site. Which monitoring priority does the phase's rationale point to?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Priority 6, authentication to engineering workstations, because a credential was used
- [x] **Priority 3, engineering protocol sessions — programming a controller should be a planned, attended event**
- [ ] Priority 8, outbound traffic, because remote sessions leave the network
- [ ] Priority 1, control writes, because the session will produce one

**Why:** The phase gives each priority a rationale, and the one attached to **engineering protocol sessions** is that **programming a controller should be a planned, attended event**. That is what makes an unattended 02:00 session a detection rather than merely a log entry: the rule is not that engineering sessions are forbidden but that they are expected to be scheduled and watched. The phase's related observation is that authentication to engineering workstations ranks sixth because credential theft starts most campaigns.

### Q43. Which Zeek log does the phase describe as the inventory of who talks to what, for how long, and how many bytes?
<!-- phases: cyber-15-ot-ics-security -->

- [x] **`conn.log` — every connection with duration and byte counts, which is your inventory of who talks to what**
- [ ] The protocol logs, which hold structured records of dissected Modbus and DNP3 sessions
- [ ] `notice.log`, which records policy violations from your own scripts
- [ ] `weird.log`, which records protocol violations

**Why:** The phase lists five Zeek outputs and gives each a distinct job: **`conn.log`** is the connection inventory with durations and byte counts, **protocol logs** hold structured records of dissected sessions, **`notice.log`** carries policy violations and anomalies from your own scripts, **`weird.log`** carries protocol violations, and **scripts** are custom detection in Zeek's own language. The phase's reason for preferring Zeek over Wireshark for an investigation is that Wireshark answers what happened in one exchange while Zeek answers **what has been happening on this link for the last six months**.

### Q44. Why does the phase call `weird.log` underrated in OT specifically?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Because it decrypts protocol sessions that Wireshark cannot read
- [ ] Because it records payload contents that other logs discard
- [ ] Because it maps protocol violations to known CVEs automatically
- [x] **Because legitimate industrial devices are well behaved and boringly consistent, so crafted or fuzzed traffic surfaces there without you having to know in advance what to look for**

**Why:** The phase's argument is a property of the environment rather than of the tool: **legitimate industrial devices are usually well behaved and boringly consistent**, so deviations are rare and therefore informative. Crafted or fuzzed traffic produces protocol violations, and `weird.log` is where they appear **without you having to know in advance what to look for** — which is what distinguishes it from a signature engine, since a signature requires you to have anticipated the technique. It is the same reflex the phase recommends for tuning the Suricata rule: learn what normal looks like, and let the deviations surface.

### Q45. In the phase's Suricata example, what does the `byte_test:1,>=,15,7` component check?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] The TCP flags, to confirm the session is established
- [ ] The length field, to confirm the frame is well formed
- [x] **The byte at offset seven — the function code — alerting when it is fifteen or above**
- [ ] The unit identifier, to confirm which device behind the gateway is targeted

**Why:** The phase reads its own rule as a sentence: it matches established TCP to port 502, checks that the protocol identifier field is zero, then **tests the byte at offset seven — the function code — and alerts when it is fifteen or above**. The offset follows from the protocol's shape, since a Modbus TCP packet begins with a **seven-byte header** before the function code. The phase is honest that the rule is **deliberately crude** and that tuning it means learning which clients may write to which devices — the same inventory work that makes firewall rules sensible. It also warns against reading that threshold as a write detector: the write codes are 5, 6, 15, and 16, while **code 43 sits above the writes and is a read**, so a numeric threshold both fires on a read and misses writes 5 and 6. The phase's actual guidance is to use the read-versus-write distinction rather than a number.

### Q46. You present a passive network map and it omits a controller you know exists. What does the phase say is the correct explanation?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] The controller uses an encrypted protocol the tool cannot parse
- [x] **A passive map is only as complete as the capture — a device that was silent during the capture window will not appear, and a mirror port that missed traffic produces a map with holes**
- [ ] The controller's management interface is firewalled from the monitoring segment
- [ ] The tool cannot classify that vendor's controllers

**Why:** The phase states the limitation plainly as part of presenting the result: **a passive map is only as complete as the capture**. The reason follows from the method — the map is inferred from observed traffic, so a device that said nothing during the window contributes nothing, regardless of whether the tool would have understood it. The phase's instruction is to **say so when you present it**, which is the same discipline it applies to the worked traffic review, where an observation of silence is a finding about the capture rather than evidence that nothing is there.

### Q47. The phase's free tooling stack has a limiting factor that is not the tooling. What is it?
<!-- phases: cyber-15-ot-ics-security -->

- [x] **Whether anyone has done the work of deciding which writes are legitimate — the stack is competitive with commercial offerings, and that decision is what it cannot supply**
- [ ] Access to the industrial protocols' specification documents
- [ ] The cost of a managed switch that supports port mirroring
- [ ] The processing power needed to run Zeek and Suricata continuously

**Why:** The phase says the free stack is **genuinely competitive with commercial offerings for a small site**, and then names the real constraint: **it is whether anyone has done the work of deciding which writes are legitimate**. That is why the phase's monitoring guidance emphasises learning the site's normal, why its Suricata rule is expected to fire on legitimate traffic until tuned, and why it says detection and architecture converge on the same artefact — **an accurate map of who talks to what**.

### Q48. A site deploys the passive stack and gets no useful alerts. What does the phase identify as the likely cause?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] The capture point is on the wrong VLAN
- [ ] The tools are inadequate for OT protocols
- [ ] The hardware is too slow to inspect traffic at line rate
- [x] **Nobody has decided which writes are legitimate — the tooling is competitive, and the missing work is the inventory judgement**

**Why:** This is the phase's stated diagnosis rather than a guess: the limiting factor is **not the tooling** but whether anyone has done the work of deciding which control operations are legitimate. The consequence the phase draws is that the same artefact serves both purposes — tuning a detection rule and writing a firewall rule both require knowing which clients are allowed to write to which devices. The phase's worked review demonstrates the judgement in practice, treating a recurring overnight write as something that **needs an answer** rather than as noise.

### Q49. A capture shows no control traffic at all to a device that is definitely in production. What does the phase instruct you to do?
<!-- phases: cyber-15-ot-ics-security -->

- [ ] Record it as air-gapped, since no traffic reached it
- [ ] Record it as safe, since nothing can attack a device that is not talking
- [ ] Escalate immediately as suspected tampering
- [x] **Re-check the capture — do not assume silence means safety, because the absence of traffic may mean the mirror covers only one VLAN, and reporting what the data cannot tell you is what makes the map trustworthy**

**Why:** The phase's worked review makes this its most valuable entry: a defender who **reports only what they saw has reported half of an assessment**, and reporting what the data cannot tell you — and why — is what makes the map trustworthy. The instruction attached to the observation is to re-check the capture, because a device with local-only control and a device on a segment the mirror never saw produce identical evidence. This is the same discipline as the passive-map limitation: absence in the data is a statement about the data.

## Question-to-phase map

| Question | Main phase(s) |
|---|---|
| Q1–Q11 | `cybersec-roadmap/13-phase-grc-compliance.md` |
| Q12–Q49 | `cybersec-roadmap/15-phase-ot-ics-security.md` |

**These two phases are adjacent in a way worth noticing while you review.** Three questions here — the residual score, the documented risk acceptance, and evidence that proves a control operated — are Phase 13 vocabulary applied to Phase 15 situations. If you missed Q4 and Q14 together, the gap is probably the risk-acceptance record rather than either phase separately.

## What a score does and does not mean

There is no pass mark here, and no number on this page implies readiness for a GRC analyst role or authority over any industrial system. **The questions are written to the decisions these two phases teach, not to a certification blueprint**, because neither phase is aligned to a certification — Phase 13 says so directly, noting that CISA, CISM, and CRISC require years of verified professional experience and are not entry points.

**Nothing in this paper authorises any action against a system you do not own.** Phase 15's boundary is stated as prohibitions rather than guidance, and its legal position is that the scope document is the authorisation and it has edges. A practice environment is where this material is meant to be exercised, and the phase describes a free one built from vendor simulation environments and software PLCs.

A useful reading of a miss is narrower than "I got this wrong." Phase 13's questions mostly turn on whether you can produce a **defensible artefact** — a scored register, a control description specific enough to test, evidence covering a whole period. Phase 15's mostly turn on whether you can recognise the moment when the correct professional output is a written record rather than a technical fix. Both are habits rather than facts, and the mapped phase is where to practise them.
