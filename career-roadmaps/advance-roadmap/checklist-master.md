# Advance Roadmap Master Checklist

Use this flat checklist to track the full advance roadmap. Every item here is the same item that appears in its phase file, so checking one on this page means the same thing it means in the phase you are working through.

This is the third track. It assumes you already hold a security role and are somewhere in years one to three of it. Nothing on this list is a first job skill.

## Phase 1 — Detection Engineering at Scale

- [ ] I can write a detection rule in a vendor-neutral format and convert it to my platform.
- [ ] I keep rules in Git with a message that names the reason the rule exists.
- [ ] I can review a rule against a written standard and give one of four decisions.
- [ ] I measured the false-positive cost of at least five rules in analyst hours.
- [ ] I can express the cost of a noisy rule as a fraction of a full-time engineer.
- [ ] I built the alert budget for my queue and named the rules consuming most of it.
- [ ] I replayed a rule against 30 days of logs before letting it reach the queue.
- [ ] I can state the telemetry a rule needs, and whether it is actually collected.
- [ ] I verified host coverage for at least one telemetry source against an asset list.
- [ ] I built an ATT&CK layer that distinguishes visibility, detection, and coverage.
- [ ] I can name the telemetry, detection, and operational gaps my coverage map exposes.
- [ ] I tuned one rule against verified benign causes rather than against volume.
- [ ] I can explain why suppressing a behaviour is safe and suppressing a subject is not.
- [ ] I retired one rule and recorded the evidence and the reason.
- [ ] I ran an atomic test and confirmed whether a deployed rule actually fires.
- [ ] I wrote a coverage summary a manager can act on, including its known inaccuracies.

## Phase 2 — Threat Hunting

- [ ] I can explain the difference between monitoring, triage, and hunting, and why the failure modes differ.
- [ ] I wrote a hypothesis with named data sources, a window, a scope, and disconfirming evidence.
- [ ] I built a data-source inventory naming retention and fidelity for each source.
- [ ] I checked retention before hunting, and stated the boundary in the conclusion.
- [ ] I proved my query works against a known-positive before trusting a negative.
- [ ] I expressed one hypothesis in KQL, SPL, and Sigma, and explained where they differ.
- [ ] I ran a rarity or baseline hunt that required no threat intelligence.
- [ ] I wrote a YARA rule that matches behaviour and tuned it to a reviewable hit count.
- [ ] I ran one full hunt end to end and recorded the hours it cost.
- [ ] I documented what I did not find, and the boundary of that conclusion.
- [ ] I turned a hunt finding into a detection rule with an expected rate and an owner.
- [ ] I raised a telemetry gap with the missing field, the fix, the owner, and a ticket reference.
- [ ] I mapped at least three techniques as covered, visible, or blind in an ATT&CK layer.
- [ ] I can summarise a null-result hunt in three sentences without it reading as wasted time.
- [ ] I named the metric I would use to judge my own hunting programme, and what it does not measure.
- [ ] I stopped a hunt early for a stated reason instead of running it to the end of the time box.

## Phase 3 — Incident Command

- [ ] I can explain why an incident commander does not work tickets.
- [ ] I wrote a role card for each of the four command roles.
- [ ] I can name the four roles and say what each one owns.
- [ ] I can structure a 12-person response so nobody exceeds a span of control of seven.
- [ ] I declared five incidents in two minutes each with a written severity rationale.
- [ ] I wrote an escalation trigger into a declaration instead of declaring S1 on a guess.
- [ ] I ran a timed bridge call using the standing agenda and recorded the overruns.
- [ ] I set a communication cadence and kept it for at least two cycles.
- [ ] I briefed an executive in ninety seconds without using a host name or a tool name.
- [ ] I wrote a privacy escalation note that routes the determination instead of making it.
- [ ] I kept a decision log in real time with a rejected alternative per entry.
- [ ] I completed a handover pack and handed command to someone else.
- [ ] I can say out loud why command authority is structural rather than personal.
- [ ] I facilitated a post-incident review and produced dated, owned actions.
- [ ] I wrote a tabletop inject list and recorded the gaps it exposed.

## Phase 4 — Cloud and Identity Architecture

- [ ] I can explain why the account or subscription is the boundary and a folder is not.
- [ ] I designed a landing zone and justified every boundary by blast radius.
- [ ] I attached a service control policy or Azure Policy and confirmed a new account inherited it.
- [ ] I wrote a permission boundary and proved with an `AccessDenied` that it caps an over-permissive role.
- [ ] I generated a least-privilege policy from real activity and shrank it with written justification.
- [ ] I wrote a trust policy that constrains who may assume a role, under what conditions, and for how long.
- [ ] I can explain why the MFA context does not survive a chained role assumption.
- [ ] I gave a workload an identity with no static credential and deleted the key it used to hold.
- [ ] No long-lived credential exists for any identity in my design that does not have to exist.
- [ ] I encoded a guardrail as policy-as-code and made it fail a real plan in CI.
- [ ] I designed and rehearsed a break-glass path and wrote the post-use record, including the time to access.
- [ ] I wrote a key policy that separates key administration from key use.
- [ ] I can explain why egress control and flow logs change incident outcomes.
- [ ] I designed organisational logging with a stated retention period and treated it as an evidence deadline.
- [ ] I classified every guardrail I own as exists, enforced, or monitored, with the evidence behind the classification.
- [ ] I wrote the rejected alternatives for one design decision, with the reason each alternative lost.

## Phase 5 — Adversary Emulation and Purple Teaming

- [ ] I can explain the difference between adversary emulation and penetration testing without prompting.
- [ ] I wrote a rules-of-engagement and authorisation document before running anything.
- [ ] I have a written scope that names the in-scope hosts, the out-of-scope hosts, and the stop condition.
- [ ] I built an isolated lab and demonstrated it has no route to a production network.
- [ ] I can map a technique to ATT&CK and name the tactic, technique, and sub-technique.
- [ ] I built an ATT&CK Navigator layer and marked coverage honestly, including the unknown rows.
- [ ] I ran at least five Atomic tests across five different tactics and cleaned up after each.
- [ ] I wrote every detection hypothesis before execution rather than after.
- [ ] I recorded, for each test, what telemetry should have existed and what actually existed.
- [ ] I wrote a Sigma rule from a gap I found and converted it for a backend.
- [ ] I stated "we have no telemetry for this" as a capability gap rather than marking it undetected.
- [ ] I re-tested a technique after writing its rule, and confirmed the rule fired.
- [ ] I completed the results matrix with a verdict and a gap ID for every technique tested.
- [ ] I reported one control failure to its owner with evidence and a proposed fix, without blame.
- [ ] I can explain why unauthorised testing is illegal and what specifically makes testing authorised.

## Phase 6 — Security Programme, Influence, and Mentoring

- [ ] I can explain the difference between a metric and a vanity metric without notes.
- [ ] I rewrote every panel on my team's report that failed the three vanity tests.
- [ ] I wrote a metric register where every row has a denominator, a source, and a threshold.
- [ ] I published the dashboard definition as a versioned file with known limitations.
- [ ] I reported a metric that got worse, leading with the direction rather than the excuse.
- [ ] I wrote a one-page brief that fits on one page after three drafts.
- [ ] I built a business case that includes the do-nothing option with a stated cost.
- [ ] I found out when the budget cycle closes before setting a decision deadline.
- [ ] I got a control-owner agreement signed, with a cadence and a RACI.
- [ ] I got a risk-acceptance memo signed by someone who could have funded the fix.
- [ ] I set an expiry date on the risk acceptance rather than leaving it open.
- [ ] I wrote a mentoring plan with success measures and a `will not do` list.
- [ ] I mentored without taking the keyboard, including when it would have been faster.
- [ ] I wrote an interview scorecard and scored a candidate before discussing them.
- [ ] I watched someone else run my runbook and recorded every hesitation verbatim.
- [ ] I wrote down the lines I will not cross and how I refuse a request safely.

## Reading this checklist honestly

Ninety-four items across six phases, and the overview says plainly that nobody needs all six at once. The checklist is a menu, not a syllabus. Pick the two or three phases your current role is asking of you, and check the boxes inside those.

Two items on this list are not optional for anyone who touches a real system at work. The authorisation reasoning in Phase 5 and the ethical boundaries in Phase 6 are the two places where a wrong answer ends a career rather than costing a week. Everything else on this page is a skill you can get wrong and correct.