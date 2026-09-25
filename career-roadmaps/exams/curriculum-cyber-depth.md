---
id: curriculum-cyber-depth
exam: "CS Roadmap SOC Detection and Response"
code: CS-CYBER-DEPTH
kind: curriculum-practice
track: cyber
phases: "cyber-10-detection-engineering,cyber-11-incident-response,cyber-12-scripting-automation"
scope: "Cyber Phases 10–12"
questions: 20
source: curriculum
---

# CS Roadmap SOC Detection and Response — curriculum practice exam

**Unofficial curriculum practice exam; not a certification exam or a job-readiness guarantee.** This diagnostic integrates SOC detection, incident triage, and security automation. It is free practice and does not certify that someone is ready for a SOC role or production incident work.

## How to use and score it

Answer all questions before checking the marked answers. Give yourself one point per correct answer, then read every explanation. **There is no pass/fail score or readiness threshold.** Use missed or guessed questions to identify which mapped phase to revisit. In real environments, use authorized telemetry, change controls, and incident procedures; do not run tests against systems outside scope.

## Domain 1 — Detection design and telemetry (5 questions)

### Q1. A rule alerts whenever `powershell.exe` starts. It creates hundreds of alerts from approved administration scripts. What is the best next step?
<!-- phases: cyber-10-detection-engineering -->

- [ ] Raise every alert to critical so analysts notice them
- [x] **Review the behavior and telemetry, identify benign patterns, and tune with documented evidence**
- [ ] Disable all PowerShell logging
- [ ] Add a broad exclusion for every administrator

**Why:** Detection quality balances coverage and analyst burden. Use representative benign and suspicious examples to refine conditions, document exclusions narrowly, and remeasure after tuning. Broad exclusions can blind the rule to abuse.

### Q2. A Sigma rule parses and converts into a SIEM query. What does that alone prove?
<!-- phases: cyber-10-detection-engineering -->

- [ ] That the rule detects real attacks in production
- [x] **That the rule has valid structure and can be converted; matching and telemetry still need separate checks**
- [ ] That its false-positive rate is acceptable
- [ ] That the underlying log source is collected everywhere

**Why:** Parsing and conversion validate syntax and backend translation, not event matching or production data quality. A matcher or controlled replay is needed to test fixture outcomes, and representative telemetry is needed to assess deployment performance.

### Q3. A detection uses process-creation event 4688 to identify command-line behavior, but command-line capture is not enabled. What is the primary issue?
<!-- phases: cyber-10-detection-engineering -->

- [ ] The event ID is from a DNS log
- [x] **The required field is absent, so the rule cannot reliably evaluate its intended condition**
- [ ] The event automatically contains every PowerShell script block
- [ ] A higher severity fixes the missing data

**Why:** A rule can only evaluate fields present in collected telemetry. Confirm configuration, scope, and coverage before claiming the detection works. Severity metadata cannot make an absent field available.

### Q4. A new alert has no named owner or response instructions. What is the most important review concern?
<!-- phases: cyber-10-detection-engineering -->

- [ ] The query should be longer
- [x] **An analyst may receive the alert without knowing whether or how to act**
- [ ] ATT&CK tags should be removed from every rule
- [ ] All alerts should be routed to the CEO

**Why:** A detection is a product used by an analyst. Ownership, triage steps, and response guidance help ensure a firing rule produces a meaningful decision rather than unattended noise.

### Q5. An analyst proposes mapping a rule only to “Execution,” an ATT&CK tactic. What is missing?
<!-- phases: cyber-10-detection-engineering -->

- [ ] A password-reset link
- [x] **A justified technique identifier describing the specific behavior detected**
- [ ] The operating system version of the analyst
- [ ] A guaranteed count of future alerts

**Why:** Tactics express an adversary goal; techniques describe how behavior is carried out. A useful mapping identifies the technique that the rule’s telemetry actually supports, rather than adding a broad label without justification.

## Domain 2 — Alert triage and incident response (5 questions)

### Q6. An alert identifies a suspicious encoded PowerShell command on one endpoint. What should the analyst do first?
<!-- phases: cyber-11-incident-response, cyber-10-detection-engineering -->

- [ ] Delete the alert because encoded commands are always benign
- [x] **Preserve the alert details, validate host/user context, and follow the triage and escalation runbook**
- [ ] Immediately wipe the endpoint without collecting evidence
- [ ] Run the command to see what it does

**Why:** Encoded commands can be legitimate or malicious. Preserve the exact command and telemetry, identify the endpoint and user context, and follow authorized triage. Executing untrusted content or wiping before evidence capture can increase risk or destroy evidence.

### Q7. A suspicious process is active on a workstation, and the incident commander directs isolation. What should the analyst consider while containing it?
<!-- phases: cyber-11-incident-response -->

- [ ] Whether containment can be skipped to preserve every artifact
- [x] **Capture critical volatile evidence quickly if feasible, then contain without unnecessary delay**
- [ ] Reimage the entire network
- [ ] Publish the process details publicly

**Why:** Volatile evidence may disappear, but an active attacker may spread. Coordinate rapid evidence capture and containment according to the response plan; preserve the decision and any evidence that could not safely be collected.

### Q8. Two alerts concern the same user and endpoint within minutes. What is a useful triage question?
<!-- phases: cyber-11-incident-response, cyber-10-detection-engineering -->

- [ ] Can both be closed to reduce the queue?
- [ ] Are the alert titles spelled the same way?
- [x] **Do their timestamps, process lineage, network activity, and identity events form one coherent sequence?**
- [ ] Can the endpoint name be omitted from the case?

**Why:** Correlation can distinguish related activity from coincidental alerts. Build a timeline from source events and preserve provenance; do not merge cases solely because they share a user or host.

### Q9. A manager asks whether customer data was exfiltrated, but available evidence shows only a suspicious connection. How should the analyst report it?
<!-- phases: cyber-11-incident-response -->

- [ ] Say “data was stolen” to force a response
- [x] **State the observed connection, explain that exfiltration is unconfirmed, and identify the next evidence needed**
- [ ] Say the incident is harmless because bytes are unavailable
- [ ] Remove the connection from the timeline

**Why:** Distinguish observations from inferences and unknowns. A suspicious connection warrants investigation, but does not prove which data, if any, left the environment. Clear uncertainty supports defensible decisions.

### Q10. A response team is deciding between isolating a critical production host and leaving it online for additional monitoring. What should guide the decision?
<!-- phases: cyber-11-incident-response -->

- [ ] The preference of whichever analyst speaks first
- [ ] A rule that all hosts are always wiped
- [x] **Threat activity, business and safety impact, available containment options, and incident authority**
- [ ] Whether the alert has a high severity label only

**Why:** Containment has operational consequences. Incident leadership and service owners should weigh threat, impact, evidence needs, and alternatives under the response plan; record the rationale and authority.

## Domain 3 — Safe automation and repeatable analysis (5 questions)

### Q11. A script parses a CSV of usernames and queries an identity API. One row contains malformed input. What should robust code do?
<!-- phases: cyber-12-scripting-automation -->

- [ ] Pass it directly into a shell command
- [ ] Skip all validation because the file came from a colleague
- [x] **Validate the value, handle the error explicitly, and record a safe, attributable result**
- [ ] Print API secrets to the error log

**Why:** External and internal data can be malformed or adversarial. Validate inputs, avoid shell interpolation, handle errors without silent failure, and never log secrets. A clear error record supports review.

### Q12. An API call intermittently times out. Which behavior is safest for an automated triage tool?
<!-- phases: cyber-12-scripting-automation -->

- [ ] Treat timeout as “no threat found”
- [x] **Use bounded timeouts and controlled retries, then report the result as unavailable if it still fails**
- [ ] Retry forever without a delay
- [ ] Delete local evidence when the API is unavailable

**Why:** A failed lookup is not a negative finding. Bounded retries and explicit unavailable status prevent false certainty and runaway load while preserving the evidence that can still be analyzed.

### Q13. A response script disables accounts. Which design feature most reduces accidental repeated impact?
<!-- phases: cyber-12-scripting-automation -->

- [ ] Make every run disable all accounts
- [x] **Make actions scoped and idempotent, with dry-run or approval controls and an audit record**
- [ ] Hide the script’s output
- [ ] Store a reusable admin password in the source code

**Why:** Idempotent, scoped actions can be safely repeated without multiplying changes. Dry-run, review, least privilege, secret management, and auditable output are important when automation changes access.

### Q14. A script produces a list of suspicious hashes. Who should decide whether to isolate a production server?
<!-- phases: cyber-12-scripting-automation -->

- [ ] The hash parser, without policy or review
- [x] **An authorized analyst or response process using the evidence and operational context**
- [ ] The script’s author’s personal social-media account
- [ ] The first person who sees the file

**Why:** Automate mechanical collection and matching, but keep consequential decisions under authorized human or policy control. A hash hit may need context, validation, and an approved response.

### Q15. A script works on one sample log but fails on a larger real export. What should be reviewed first?
<!-- phases: cyber-12-scripting-automation -->

- [ ] Whether to claim the tool is production-ready anyway
- [x] **Input assumptions, encoding, malformed records, resource use, and error handling**
- [ ] Whether to remove all logging
- [ ] Whether to change the source log to match the script

**Why:** Real data may vary in encoding, missing fields, size, and format. Test against representative, safely handled inputs, make assumptions explicit, and report skipped or invalid rows rather than silently losing them.

## Domain 4 — Detection lifecycle and communication (5 questions)

### Q16. A new detection fires 50 times a day, and analysts close nearly all alerts as expected activity. What measurement helps evaluate tuning?
<!-- phases: cyber-10-detection-engineering -->

- [ ] The number of lines in the rule file
- [x] **A defined precision measure from reviewed alerts, alongside alert volume and coverage impact**
- [ ] The number of ATT&CK tactics in the rule
- [ ] The analyst’s guess without a review sample

**Why:** A tuning decision needs a defined numerator, denominator, time window, and reviewed outcomes. Measure precision and volume, and consider what coverage a filter might remove before changing the rule.

### Q17. A rule is no longer useful because its data source has been retired. What is the responsible lifecycle action?
<!-- phases: cyber-10-detection-engineering, cyber-11-incident-response -->

- [ ] Leave it enabled forever in case it works
- [x] **Document the reason and accepted detection gap, notify the owner, and retire it through change control**
- [ ] Delete it without recording the change
- [ ] Rename it as a new rule so dashboards keep showing it

**Why:** Retirement is a managed decision, not silent deletion. Document what coverage is lost, who accepts the risk, and what replaces the rule if anything; update the deployed platform and lifecycle record.

### Q18. An alert review discovers a false positive caused by an approved admin tool. What should the detection engineer do?
<!-- phases: cyber-10-detection-engineering -->

- [ ] Exclude every process from that administrator
- [ ] Hide the alert from metrics
- [x] **Record the benign behavior, test a narrow evidence-based tuning change, and remeasure**
- [ ] Change the detection’s description only

**Why:** A narrow, tested filter may reduce predictable noise while preserving malicious cases. Document why it is safe, add regression examples where possible, and measure the result rather than concealing alert volume.

### Q19. A detection handoff goes to another analyst. Which information is most useful?
<!-- phases: cyber-11-incident-response -->

- [ ] “Looks bad; investigate.”
- [ ] A screenshot without timestamp or source
- [x] **Behavior detected, relevant fields and time range, known benign matches, query location, and recommended triage steps**
- [ ] A guarantee that the rule cannot miss an attack

**Why:** A useful handoff makes the rule reviewable and actionable. Include data source, fields, scope, expected false positives, owner, and next steps; never claim perfect coverage.

### Q20. A detection review finds that the rule’s precision improved after tuning, but the change might suppress a less common malicious variant. What is the best next step?
<!-- phases: cyber-10-detection-engineering -->

- [ ] Ship the change without checking coverage
- [ ] Delete all historical measurements
- [x] **Test known malicious and benign cases, assess the coverage trade-off, and document the residual risk before promotion**
- [ ] Declare the technique impossible to detect

**Why:** Better precision can reduce noise but may also remove useful coverage. Test representative cases and understand the behavior excluded. Record residual risk and obtain the appropriate review before deploying.

## Question-to-phase map

| Question | Main phase(s) |
|---|---|
| Q1–Q5, Q16, Q18, Q20 | `cybersec-roadmap/10-phase-detection-engineering.md` |
| Q6–Q10, Q17 | `cybersec-roadmap/11-phase-incident-response.md` |
| Q11–Q15 | `cybersec-roadmap/12-phase-scripting-automation.md` |
| Q8–Q10 | `cybersec-roadmap/11-phase-incident-response.md`, `cybersec-roadmap/10-phase-detection-engineering.md` |
