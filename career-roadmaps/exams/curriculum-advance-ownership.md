---
id: curriculum-advance-ownership
exam: "CS Roadmap Security Ownership and Command"
code: CS-ADVANCE-OWNERSHIP
kind: curriculum-practice
track: advance
phases: "advance-01-detection-at-scale,advance-02-threat-hunting,advance-03-incident-command,advance-05-adversary-emulation,advance-06-programme-and-influence,advance-07-detection-as-code"
scope: "Advance Phases 1, 2, 3, 5, 6 and 7"
questions: 20
source: curriculum
---

# CS Roadmap Security Ownership and Command — curriculum practice exam

**Unofficial curriculum practice exam; not a certification exam or a job-readiness guarantee.** This diagnostic integrates the decisions a security professional owns rather than the work they are handed: measuring a detection library, running a hunt, commanding an incident, proving a control, funding a fix, and keeping rules under version control. It is free practice and does not certify readiness for a senior role, an incident commander post, or production authority.

## How to use and score it

Answer all questions before checking the marked answers. Give yourself one point per correct answer, then read every explanation. **There is no pass/fail score or readiness threshold.** Use missed or guessed questions to identify which mapped phase to revisit. Most of these questions ask what an author should *write down*, *measure*, or *decline to claim* — so a wrong answer usually marks a habit worth changing rather than a fact worth memorising. In real environments, work from authorised telemetry, change control, and written procedure; never test a control, run an emulation, or isolate a system outside scope you have been granted.

## Domain 1 — Owning a detection library (4 questions)

### Q1. A rule fires 1,240 times in thirty days with nine confirmed true positives. The phase computes this as 253 analyst hours and 1.58 full-time engineers a month. Which response does the phase give as the *first* move, before any tuning?
<!-- phases: advance-01-detection-at-scale -->

- [ ] Delete the rule, because 99.3% of its output is false
- [ ] Raise every match to critical so the real ones are not missed
- [x] **Change its routing to a hunting queue reviewed in batches, buying time to tune it properly**
- [ ] Leave it alone, because a high-impact technique justifies any cost

**Why:** The phase's Part 4 makes routing the single most effective first fix for a rule you still want. Routing an over-broad rule to a batch-reviewed hunting queue converts 253 hours of triage into roughly a two-hour weekly review with no loss of detection — and the phase is explicit that deleting is wrong here because encoded command execution is genuinely high-impact. The rule is a bad way to detect the technique, not a bad technique to detect.

### Q2. A coverage map marks T1543.003 (Windows Service) as having a rule that fires into a queue with no owner. Under the phase's three-level distinction, what has actually been documented?
<!-- phases: advance-01-detection-at-scale -->

- [ ] Full coverage, because a rule exists and fires
- [ ] Visibility only, because the telemetry exists
- [x] **A detection, not coverage — the third level requires a fired alert to reach a human who will act**
- [ ] Nothing at all, because an unowned queue means the rule never fires

**Why:** The phase separates the three levels precisely: visibility is "the telemetry exists and is queryable", detection is "a rule exists that fires on the behaviour", and coverage is "a fired alert reaches a human who will act." The phase calls an unowned queue the most common lie in a coverage matrix, and notes it is usually not deliberate — a rule that fires into a queue nobody reads produces text, not coverage.

### Q3. An engineer proposes a detection reading proxy logs. The phase's telemetry prerequisites list *collected*, *parsed*, *retained* and *complete*. Proxy logs are retained seven days and are not ingested at all. Which gap type is this, and who owns it?
<!-- phases: advance-01-detection-at-scale -->

- [ ] A detection gap, owned by detection engineering, fixable in hours
- [ ] An operational gap, fixed by a routing change
- [ ] Not a gap, because the logs still exist somewhere
- [x] **A telemetry gap, owned by the platform or network team, fixed in weeks and usually needing a budget request**

**Why:** The phase gives three gap types with different owners and different timescales: telemetry gaps belong to the platform or network team and take weeks with a budget request, detection gaps belong to detection engineering and take hours to days, and operational gaps are a routing change for the SOC lead. T1071.001 in the phase's worked map is exactly this case, and the phase calls it the highest-value finding on the map because no amount of rule writing fixes it.

### Q4. A rule's telemetry prerequisite note records that 412 of 500 endpoints report Sysmon, and that an agent upgrade can uninstall Sysmon without the rule erroring. What does the phase prescribe as the countermeasure?
<!-- phases: advance-01-detection-at-scale -->

- [x] **A heartbeat detection that alerts when a host stops sending the telemetry other rules depend on**
- [ ] Add a check that fails the rule when its query returns an error
- [ ] Extend retention so older events remain queryable
- [ ] Mark the 88 missing hosts as out of scope on the coverage map

**Why:** The phase's failure mode is precise and invisible: a rule whose telemetry disappears does not error, it simply never fires again — and a rule that never fires looks exactly like a rule with nothing to find. The countermeasure is a heartbeat rule, which the phase calls the least glamorous detection in the library and one of the most valuable. Its own worked example is a Sysmon service-state rule keyed to Event ID 4.

## Domain 2 — Hunting as a deliberate question (3 questions)

### Q5. A hunt runs for its full duration and no query produces a single reviewable row. What does the phase say this most often means, and what must happen before the estate can be called clean?
<!-- phases: advance-02-threat-hunting -->

- [x] **The question may be unanswerable from the available data — you must separately verify the telemetry could have answered it**
- [ ] The estate is clean, and the result can be recorded as a negative finding
- [ ] The hypothesis was wrong, so the hunt should be abandoned and not written up
- [ ] The query should be broadened until it returns rows

**Why:** The phase names hunting's characteristic failure as "asking a question the data cannot answer" and then reporting the empty result as though it were a negative finding — it devotes a whole part to this mistake. The phase's own framing is that the absence of a signal is not evidence of the absence of activity, so an empty result must be separated into "we looked and found nothing" versus "the data could never have told us."

### Q6. Which of these does the phase identify as the permanent, multiplicative output that decides whether a hunting programme keeps its budget after a quiet quarter?
<!-- phases: advance-02-threat-hunting -->

- [ ] A dashboard leading with the number of hunts completed
- [ ] The number of incidents the hunt uncovered
- [ ] The analyst hours spent hunting
- [x] **The durable detection or documented telemetry gap the hunt left behind, plus the write-up**

**Why:** The phase orders the exit criterion's four capabilities from least to most durable and says the last row is the whole phase: "the hunt outlives you — someone else inherits a rule or a ticket." It is equally direct that the write-up is not paperwork after the hunt but the product, because a team that can only justify hunts that produce an incident will be told hunting is a luxury after the first quiet quarter.

### Q7. A finding from a hunt is being converted into a detection. Which property does the phase require the rule to carry on day one?
<!-- phases: advance-02-threat-hunting, advance-01-detection-at-scale -->

- [ ] A severity of critical, because it came from a real hunt
- [ ] A permanent exclusion for every analyst who triages it
- [x] **The same metadata standard as any other rule — owner, review date, telemetry prerequisite and test evidence**
- [ ] Nothing extra, because it can be refined later if it fires too often

**Why:** The phase insists a hunt finding becomes a rule through the same lifecycle as any other detection, which is the standard set in Phase 1: status, owner, review date, the telemetry it depends on, and fixtures that match and do not match. A rule written during a hunt and deployed without that metadata is the "written once, never revisited" column the Phase 1 cost table exists to eliminate.

## Domain 3 — Command, declaration, and the written record (5 questions)

### Q8. You are the on-call shift lead and the best analyst on the shift. An alert fires at 01:14. What does the phase say must happen the moment you accept the commander role?
<!-- phases: advance-03-incident-command -->

- [ ] Work the first part yourself, since you are fastest, then hand off
- [ ] Decline command, because the best analyst should stay on the tools
- [ ] Keep doing both and catch up on the queue afterwards
- [x] **You stop being an analyst for the duration, and if you later hand command back you say so out loud and record it**

**Why:** The phase's wrong-first-guess walkthrough follows exactly this scenario: 38 minutes of being useful let the incident grow by 50 percent, because the only person who could have triaged the second alert was heads-down. The rule is absolute — an incident commander does not work tickets — and handing the role to yourself later is allowed only if you name who is taking command and record it. When you genuinely are alone, the honest pattern is ten-minute blocks with a forced outward look, which the phase shows as a real append-only log.

### Q9. You see an impossible-travel alert and an unfamiliar mail rule at 01:14. Why does the phase call declaring S1 immediately the wrong first guess?
<!-- phases: advance-03-incident-command -->

- [x] **Because spending two executives' Saturday night on a false alarm teaches the organisation that your declarations are noise**
- [ ] Because S1 requires CISO approval before it can be declared
- [ ] Because an S1 declaration removes your authority to isolate systems
- [ ] Because impossible-travel alerts are never accurate

**Why:** The phase is explicit that the failure in small organisations is usually under-declaring, not over-declaring — but it names the opposite failure too, and the cost is credibility rather than time. Its prescribed answer is neither S1 nor S4 but **S2 with a written escalation trigger**, so that at 03:00 escalating is a lookup rather than a debate. Note also that the phase says an S1 declaration is what *unlocks* authority to isolate production, not what removes it.

### Q10. An IC wants a technical action performed during a live incident, and sees the engineer who should do it on the bridge. Who does the IC ask?
<!-- phases: advance-03-incident-command -->

- [ ] The engineer directly, since the IC outranks them
- [x] **The operations lead, who is the only person directing hands-on work**
- [ ] The scribe, who records the request and passes it on
- [ ] Whoever is least busy on the call

**Why:** The phase's second structural rule is that the operations lead is the only person directing hands-on work, because nothing wastes more time than four people giving four engineers four different instructions. The four roles also carry explicit prohibitions — the IC does no hands-on work, the ops lead does not communicate outside the response, the comms lead makes no technical decisions, and the scribe does nothing else.

### Q11. A response has grown to twelve people. What does the phase say must change structurally?
<!-- phases: advance-03-incident-command -->

- [ ] The IC should start directing each analyst individually
- [ ] A second IC should be appointed to share the load
- [x] **Add team leads under the ops lead, so the ops lead directs leads rather than individuals**
- [ ] The bridge cadence should drop to once per hour regardless of severity

**Why:** The phase ties structure to span of control, which it puts at three to seven people with five comfortable, and states plainly that a response past roughly ten people needs a second layer because "you do not get a better commander by giving one commander more people — you get a worse one." At 8–15 people the phase adds an endpoint team and an identity team under the ops lead; a deputy IC arrives at 15+.

### Q12. Your shift ends at 08:00 and the incident is still open. Which three sections does the phase name as the ones a verbal handover always loses?
<!-- phases: advance-03-incident-command -->

- [x] **Open questions I could not answer, decisions I would not let go of, and what I would do next if it were still mine**
- [ ] The timeline, the attendance list and the current severity
- [ ] The tool inventory, the access list and the evidence locker location
- [ ] The cost so far, the headcount and the next update time

**Why:** The phase's handover pack is written first and always, and it names those three sections as the ones verbal handover drops — with the last called the most valuable line in the document, because it hands over judgement while explicitly leaving the incoming commander free to overrule it. The phase also requires a public, unambiguous transfer of authority, since ambiguity about who is in command is the single most damaging thing a handover can produce.

## Domain 4 — Proving a control works (3 questions)

### Q13. After a registry run key emulation, no Event ID 13 appears in the log at all. What is the correct verdict?
<!-- phases: advance-05-adversary-emulation -->

- [ ] Not detected, telemetry present — write a rule
- [x] **Not detected, no telemetry — a capability gap requiring a configuration or budget change, not a rule**
- [ ] Detected, because the rule did not produce a false positive
- [ ] Partially detected, because the technique ran successfully

**Why:** The phase's four verdicts exist precisely to separate these outcomes, and it says the grey verdict is the one people avoid writing because the fix is not a rule you can write this afternoon. The discrimination is mechanical: if the event ID is absent from the output entirely, the data was never recorded and no rule can fix it; if it is present in large numbers but none match, you have a detection gap. The phase warns that reporting one as the other wastes someone's quarter.

### Q14. A coverage figure is published as "we cover 78% of ATT&CK." What does the phase say is wrong with it?
<!-- phases: advance-05-adversary-emulation -->

- [ ] Nothing, provided the same figure is reported every quarter
- [ ] It is too low, and should be improved before publication
- [ ] It should be expressed per tactic instead of as a total
- [x] **It is meaningless without the denominator — 78% of which techniques, and chosen by whom?**

**Why:** The phase's table contrasts "we cover 78% of ATT&CK" against "we improved coverage from 55% to 78% this quarter" and passes only the second, because a trend uses the same denominator both times. It also names the trap that makes the first number dangerous: the denominator is easy to shrink, since testing twenty techniques you are confident about produces a far better percentage than testing forty chosen for risk.

### Q15. An emulation run finds a rule that fires correctly but routes to a queue with no owner and an 11-day median time to first action. How does the phase classify that?
<!-- phases: advance-05-adversary-emulation, advance-01-detection-at-scale -->

- [ ] Detected, because the rule fired and the alert was correct
- [ ] Not detected, because no analyst acted on it
- [x] **Partially detected — something fired, but it relied on a human noticing and nobody did within a useful window**
- [ ] A telemetry gap, because the routing problem hides the data

**Why:** The four verdicts include "Partially detected" for exactly this shape: something fired, but it was incomplete, late, or relied on a human noticing. The phase and Phase 1 agree on the underlying claim — an alert that reaches no owner is a detection without coverage — and Phase 1's own worked example of T1055 uses an unowned queue as the reason a rule that exists still does not constitute coverage.

## Domain 5 — Fuel, funding and the lifecycle (5 questions)

### Q16. A dashboard leads with "98 per cent endpoint coverage." Which test does the phase give for deciding whether that is a metric or a vanity metric?
<!-- phases: advance-06-programme-and-influence -->

- [ ] Whether the number is higher than last quarter
- [x] **Could it go up while the organisation is less safe, and would anyone change what they are doing this week if it halved?**
- [ ] Whether it appears on an executive slide
- [ ] Whether it is produced by a commercial tool

**Why:** The phase gives three tests and calls them brutal: could this number go up while the organisation is less safe; if it halved overnight would anyone change what they are doing this week; and is the denominator known or assumed. The third is what fixes the coverage example — it becomes a real metric only when it reads as a count against a named denominator with exceptions listed by hostname and owner. The phase anchors the whole section in Goodhart's law, because the fastest route to a target percentage is redefining what counts as in-scope.

### Q17. A risk-acceptance memo for a £30,000 control gap is signed by a manager whose discretionary budget is £5,000, and it carries no expiry date. What does the phase say about it?
<!-- phases: advance-06-programme-and-influence -->

- [x] **Both are defects — the signer must have authority over the risk, and an acceptance with no expiry is a permanent decision made by someone who may leave**
- [ ] The signature is fine, because any manager can accept risk on their own systems
- [ ] The amount is the only problem; the missing expiry is a documentation preference
- [ ] Neither is a defect if the gap is recorded in the exception register

**Why:** The phase ties acceptance to authority and to time, and treats the expiry as substantive rather than cosmetic: an acceptance with no end date outlives the person who made it, which is the same failure it names for suppressions in Phase 1. It also names the specific section of the memo that prevents scope creep, so the memo is written to be re-read rather than filed.

### Q18. A junior analyst's report reads badly. Which response does the phase give as the useful one?
<!-- phases: advance-06-programme-and-influence -->

- [ ] Rewrite it yourself so the final version is good
- [ ] Send it back with "make this clearer" and a deadline
- [x] **Teach the specific structural fix, so the next report is better without you**
- [ ] Accept it, since the analysis underneath is correct

**Why:** The phase names the failure mode of mentoring directly: doing the work for someone produces a good artefact and no capability, so the programme ends up depending on you permanently. Its stated purpose for mentoring is to move knowledge out of your own head — the same reasoning it gives for runbooks, where the test is not whether the author can follow the steps but whether somebody else can execute them at 3am without calling.

### Q19. A rule deployed to Elasticsearch uses a five-minute correlation window, and events that straddle a clock boundary do not trigger it. Which conversion-drift cause is this, and what does the phase require?
<!-- phases: advance-07-detection-as-code -->

- [ ] An unsupported feature; the backend should have errored, so the pipeline is at fault
- [x] **Time-boundary behaviour — the window is aligned to clock buckets rather than sliding, and it must be documented because it produces false negatives**
- [ ] A modifier mismatch, fixed by escaping the field
- [ ] Nothing; correlation rules are expected to be approximate

**Why:** The phase lists four drift causes and says only one is a bug. Time-boundary behaviour is the one it tells you to dwell on, because the query deploys cleanly, looks correct, and produces false negatives rather than errors — so it never shows up as a failure. The discipline it prescribes is to convert once and read the output properly the first time you target a new platform, not to skim it.

### Q20. A rule measures 3% precision, and 22 of its 29 benign matches come from one cause: the PKI service retrieving a certificate revocation list. What does the phase steer you toward?
<!-- phases: advance-07-detection-as-code -->

- [ ] Retirement, because 3% precision is not survivable as a paging rule
- [x] **Tuning — one dominant benign cause is a clean fix, whereas a long tail of unrelated causes would not be**
- [ ] Publishing it unchanged, since the one true positive was real
- [ ] Deleting the 22 PKI matches from the measurement

**Why:** The phase's rule is that grouping the benign causes before deciding is the step people skip: twenty-two alerts from one cause is a tuning problem with a clean fix, five alerts from five different causes is a rule that will never be precise enough to page on. Its own worked record adds a filter requiring three conditions together, so that a malicious use of the same binary from the same parent context but not retrieving a CRL would still match — and it sets a re-measurement date with a demotion to hunting if precision stays low.

## Question-to-phase map

| Question | Main phase(s) |
|---|---|
| Q1–Q4 | `advance-roadmap/01-phase-detection-at-scale.md` |
| Q5–Q6 | `advance-roadmap/02-phase-threat-hunting.md` |
| Q7 | `advance-roadmap/02-phase-threat-hunting.md`, `advance-roadmap/01-phase-detection-at-scale.md` |
| Q8–Q12 | `advance-roadmap/03-phase-incident-command.md` |
| Q13–Q14 | `advance-roadmap/05-phase-adversary-emulation.md` |
| Q15 | `advance-roadmap/05-phase-adversary-emulation.md`, `advance-roadmap/01-phase-detection-at-scale.md` |
| Q16–Q18 | `advance-roadmap/06-phase-programme-and-influence.md` |
| Q19–Q20 | `advance-roadmap/07-phase-detection-as-code.md` |

**Phase 4 (Cloud and Identity Architecture) is deliberately outside this paper's scope.** Its subject matter is design and policy rather than the measurement, command and lifecycle decisions the other six phases share, and a twenty-question diagnostic that reached into it would test vocabulary rather than judgement. Read it directly; the phase's own exit criteria are the check.

## What a score does and does not mean

There is no pass mark here, and no number on this page implies readiness for a senior role, an incident commander post, or authority over production systems. **The questions are written to the decisions the track asks you to own, not to a certification blueprint**, because the advance track is deliberately aligned to no certification.

A useful reading of a miss is narrower than "I got this wrong." Most of these questions turn on something an author writes down — a review record, a handover pack, a decision log, a gap register, a tuning record, a risk acceptance. If you missed several, the likely gap is not knowledge but the habit of producing the artefact, and the phase that maps to the question is where to practise it.
