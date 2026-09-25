---
id: curriculum-cloud-identity
exam: "CS Roadmap Cloud and Identity Architecture"
code: CS-CLOUD-IDENTITY
kind: curriculum-practice
track: advance
phases: "advance-04-cloud-identity-architecture"
scope: "Advance Phase 4"
questions: 20
source: curriculum
---

# CS Roadmap Cloud and Identity Architecture — curriculum practice exam

**Unofficial curriculum practice exam; not a certification exam or a job-readiness guarantee.** This diagnostic covers the phase that turns "least privilege" from a slogan into a measured, enforced, version-controlled control: landing zones and guardrails, the difference between a control that exists and one that is enforced, workload identity, break-glass design, and policy as code. It is free practice and does not certify readiness for a cloud security engineering role or production authority over any account.

## How to use and score it

Answer all questions before checking the marked answers. Give yourself one point per correct answer, then read every explanation. **There is no pass/fail score or readiness threshold.** Use missed or guessed questions to identify which part of the phase to revisit.

**This phase is the one the advance track's other paper deliberately excluded.** The Security Ownership and Command paper covers Advance Phases 1, 2, 3, 5, 6 and 7 and says in its own scope note that Phase 4 is outside it, because Phase 4's subject is design and policy rather than the measurement, command and lifecycle decisions those six phases share. This paper is that exclusion filled in rather than reversed — the material was always worth twenty questions, just not those twenty.

**Nearly every question here turns on a distinction rather than a fact.** The phase's whole argument is that the words people use confidently in design reviews — guardrail, least privilege, enforced, boundary — each hide a specific distinction that decides whether a control protects anything. That is why several questions ask you to choose between two statements that are both true and differ in what they protect against, and why the explanations spend more time on the reasoning than on the answer.

**A note on what is a fact and what is a position.** The mechanics here are real: SCPs genuinely do not apply to the management account, service-linked roles genuinely are exempt, and the confused deputy problem is genuinely why an external ID exists. But the phase's prescriptions — that elevation should change duration rather than scope, that a break-glass path needs a rehearsal, that thirty days is the observation window — are engineering judgement. Where a question turns on one of those, the stem asks what the phase prescribes, and the explanation says so.

**Nothing here authorises any action against an account you do not own.** Work in your own account, and note that the phase's thirty-day observation step and its break-glass rehearsal are both things you can do on a personal account this week without spending anything.

## Domain 1 — Hierarchy and guardrails that hold (5 questions)

### Q1. The phase says an assignment at a management group in Azure is inherited by every subscription beneath it, including subscriptions that do not exist yet. Why does it call this property important?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] Because it reduces the number of policy assignments an administrator must maintain
- [x] **Because inherit-on-creation is what makes a hierarchy a control rather than a filing system**
- [ ] Because it prevents a subscription from being moved to a different management group
- [ ] Because it applies retroactively to subscriptions that predate the assignment

**Why:** The phase names this as the property worth internalising, and the distinction it draws is between a structure that organises accounts and one that governs them: a policy attached to a node applies to accounts created later without anyone remembering to attach it. That is the difference between a guardrail and a convention. The phase's companion warning is that a hierarchy with nothing attached to it changes nothing about what an identity can do, so the hierarchy only matters because it is the thing that carries the attachment.

### Q2. An organisation has a four-level management group hierarchy with no policies assigned to any node. What does the phase say this achieves?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] Baseline isolation, because separate management groups cannot access each other's resources
- [ ] Least privilege, because permissions must be granted explicitly at each level
- [x] **Nothing — a hierarchy with nothing attached changes nothing about what an identity can do**
- [ ] Delegated administration, because each level can be owned by a different team

**Why:** The phase states this as its own correction to the natural assumption that the structure itself is the control. Its line is that the hierarchy does not stop anyone, and that every guardrail in the phase is an attachment to a node — so the hierarchy's value is entirely in what it carries. This is the same distinction the phase draws later between a control that exists and one that is enforced, applied to the structure rather than to a policy.

### Q3. The phase lists what a service control policy applies to and, more usefully, what it does not. Which principal is outside an SCP's reach?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] The account root user in a member account, because root cannot be restricted
- [x] **The management account, along with service-linked roles and the organisation's own APIs**
- [ ] Federated human identities, because they are authenticated by an external provider
- [ ] Roles assumed across account boundaries through `sts:AssumeRole`

**Why:** The phase's table names the management account, service-linked roles, and the organisation's own APIs as the exemptions, and calls the first two the ones that catch people. The management account exemption is why the phase's design puts nothing in the management account but billing and organisation administration, and why access to it is a break-glass process rather than a role. The first option is a genuine restriction that exists elsewhere in AWS, but it is not the SCP exemption the phase names — under an SCP the member-account root **is** in scope, which is what makes the phase's root-confinement example work.

### Q4. The phase distinguishes a service control policy from a permission boundary. Which statement describes what each actually protects against?
<!-- phases: advance-04-cloud-identity-architecture -->

- [x] **An SCP protects against an account-level mistake or a compromised account administrator; a permission boundary protects against a single role being over-privileged**
- [ ] An SCP is preventive and a permission boundary is detective, so the two are complements rather than alternatives
- [ ] Both set a permissions ceiling; an SCP is simply the account-wide version of the same idea
- [ ] An SCP protects a single role from being over-privileged; a permission boundary protects the whole account

**Why:** The phase's side-by-side table gives this directly, and it also gives the honest limitation of each: an SCP does not protect against anything in the management account, while a permission boundary does not protect against an administrator removing the boundary. The fourth option applies a distinction the phase makes elsewhere — between preventive and detective controls, in its policy-as-code discussion of `deny` against `audit` — to a pair that differs by scope rather than by control type. The phase's reason for drawing the comparison at all is that confusing them produces designs that protect nothing.

### Q5. A role is given `AdministratorAccess` for an urgent task, with a ticket raised to remove it later. Two years later seventeen roles hold it. What does the phase say this problem actually is, and what is its architecturally correct fix?
<!-- phases: advance-04-cloud-identity-architecture -->

- [x] **A process problem manifesting as a permissions problem, fixed by time-bound elevation so that broad access is a session rather than a state**
- [ ] A governance problem, fixed by requiring management approval before any broad policy is attached
- [ ] A permissions problem, fixed by removing the broad policy from every role that no longer needs it
- [ ] A monitoring problem, fixed by alerting whenever `AdministratorAccess` is attached to a role

**Why:** The phase names it as a process problem that manifests as a permissions problem, and it gives three fixes that work together: a permission boundary on every human role, a standing query over attached policies, and a time-bound elevation process. The third is what it calls the architecturally correct answer, and the sentence it asks you to write down is that **elevation should change duration, not scope** — the elevated role still cannot exceed the boundary, so elevation raises the ceiling temporarily reachable within a fixed envelope. The first two options are real fixes the phase lists, which is why they are the distractors: each is necessary and neither is sufficient on its own.

## Domain 2 — Existing, enforced, monitored (4 questions)

### Q6. A standard says developers must not create IAM users, and an SCP denies `iam:CreateUser` in the workload OU. Which column of the phase's three-way distinction does each land in?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] The standard is enforced and the SCP is monitored, because the SCP can be logged
- [x] **The standard merely exists; the SCP is enforced, because it cannot be bypassed by the people it applies to**
- [ ] Both exist, and enforcement only begins once a Config rule is attached
- [ ] Both are enforced, because a documented standard and a policy are both controls

**Why:** The phase's three-way distinction is that a control which **exists** is written down somewhere, a control which is **enforced** cannot be bypassed by the people it applies to, and a control which is **monitored** is not enforced but you will find out when it is violated. Its own table puts a wiki page in the first column and the SCP in the second. This is why the phase says the transition from column one to column two is most of what a cloud security engineer is paid to do, and why everything else in the lesson is machinery for making that transition repeatable.

### Q7. The phase's worked design decision rejects a proposal for a monthly access review as the primary control on an administrator role. Why does it reject it?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] Because a monthly review is too expensive to run at organisational scale
- [ ] Because the reviewers would lack the technical knowledge to judge the permissions
- [x] **Because review is a detective control with a lag measured in weeks, and the window between an over-privileged action and its discovery is the exposure**
- [ ] Because a review cannot be evidenced to an auditor without an automated report

**Why:** The phase's rejected-alternatives step makes this argument explicitly, and it is the reason the phase reaches for a boundary rather than a cadence: a detective control operating on a monthly cycle leaves an exposure window measured in weeks, during which the over-privileged action has already happened. That is the same reasoning behind the phase's preference for `deny` over `audit` where a preventive control is possible. The fourth option inverts a real requirement — the phase's own control description standard is that a control must be testable and evidenced, which a review with a signed record satisfies.

### Q8. A team writes a policy in Rego and runs it in CI with `deny`. What does the phase say this choice gives up compared with `audit`?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] Coverage, because `deny` can only evaluate resources that already exist
- [ ] Nothing, because `audit` and `deny` report the same information
- [ ] The ability to detect violations, since a denied change never gets recorded
- [x] **Some delivery speed and some tolerance for legitimate exceptions — and the phase says the choice is never purely technical**

**Why:** The phase states that the choice between `deny` and `audit` is the choice between a preventive and a detective control, and that it is never a purely technical decision. `deny` is stronger and it blocks legitimate edge cases until someone updates the policy, which is why the phase treats the decision as one to make with the teams affected rather than for them. The second option is the tempting inversion: a denied change is still recorded by the plan and the pipeline, so the visibility is retained — what changes is whether the change is allowed to proceed.

### Q9. The phase's break-glass design has six components and says a design missing any of them will fail an audit or a real incident. It singles out two as the ones organisations get wrong, and explains why they are related. What is that explanation?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] Both depend on staff discipline, so both fail when the person who wrote the procedure leaves
- [ ] Both are discovered only during an audit, because neither produces a log entry
- [ ] Both are administrative controls, so neither can be enforced by a policy
- [x] **A credential easy to use is easy to use casually, while a genuinely offline one may have been resealed wrong or expired — which is why the rehearsal exists**

**Why:** The phase explains the relationship through the same trade-off: if the credential is stored in a form that is easy to use it is also easy to use casually, and if it is stored in a form that is genuinely offline then the first time anyone uses it they will discover the envelope was resealed wrong, the password expired, or the phone number in the procedure belongs to somebody who has left. That is the phase's stated reason the rehearsal exists, and why it calls the rehearsal record the portfolio artefact for this part — the record proves you have done the thing rather than described it. **Note that this question deliberately tests the phase's stated reasoning rather than its ordinal**, because the phase says "the second and fifth rows" and then discusses the offline-credential row together with the rehearsal, which is the sixth. The ordinal is inconsistent with the phase's own explanation; the explanation is what the book teaches, and it is what you will be asked to reproduce.

## Domain 3 — Least privilege as engineering (6 questions)

### Q10. A policy is generated from thirty days of CloudTrail observations. What does the phase say observation cannot tell you, and why does that matter?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] It cannot tell you which actions were denied, so the policy may be too narrow
- [ ] It cannot tell you which resources were accessed, so the policy needs broad resource scope
- [x] **It tells you what was used but cannot tell you what must remain available — a backup restore role unused for ninety days is insurance, not waste**
- [ ] It cannot tell you the identity of the caller, so the policy may grant access too widely

**Why:** This is the sentence the phase says separates a policy generated by a tool from a policy a human will accept, and it names the third of its four steps — review — as where the judgement lives and the step a purely automated approach gets wrong. Its examples are a backup restore role unused for ninety days and a role handling a year-end process unused for eleven months: neither is unused, because low frequency is what insurance looks like in an access log. This is also the sentence the phase recommends using in an interview when asked how you would approach least privilege.

### Q11. The phase lists a four-step loop for least privilege. Which step does it say cannot be automated?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] Observing, because turning on the audit log requires a decision about scope
- [ ] Generating, because the tool cannot infer resource ARNs from observed actions
- [x] **Reviewing, because observation cannot see break paths, rare operations, or future needs**
- [ ] Shipping and re-measuring, because `AccessDenied` events are noisy to interpret

**Why:** The four steps are observe, generate, review, and ship and re-measure, and the phase says the review is the step that cannot be automated because it adds what observation missed: break paths, rare operations, and future needs. Its reasoning is that a purely observational policy is one that will break the first time an unusual-but-legitimate operation runs, which is a production incident rather than a security improvement. That is why the phase describes least privilege as a slogan until you measure it — and why the engineering version is a loop rather than a one-time tightening.

### Q12. The phase says almost every cloud identity incident involves one policy being too permissive, and almost none involve the other. Which one, and what is the asymmetry?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] The SCP, because an organisation-level deny is rarely reviewed after it is written
- [ ] The identity-based policy, because attached policies drift as roles change
- [x] **The trust policy — it says who may become the role, and it deserves more review attention than the permissions attached**
- [ ] The permission boundary, because a boundary that is too wide is invisible

**Why:** The phase states the asymmetry directly and draws the conclusion from it: almost every incident involves a trust policy that was too permissive and almost none involve an identity policy that was too permissive, which is why a trust policy deserves more of your review attention than the permissions attached to the role. Its worked example is a trust policy allowing a partner account to assume a role with only an external ID as a constraint. The distinction matters because an identity policy that is too broad is a misconfiguration, while a trust policy that is too broad is an open door.

### Q13. A trust policy allows a partner account to assume a role, constrained only by an external ID. The phase says the external ID is not a secret and not authentication. What is it for?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] It limits the session duration, so it reduces the window for misuse
- [x] **It solves the confused deputy problem, so a partner cannot be pointed at your role by one of its other customers**
- [ ] It records which customer the request came from, for audit purposes only
- [ ] It proves the partner's identity, so it functions as a shared credential

**Why:** The phase's explanation is that without an external ID any customer of that partner could point the partner at your role ARN, because the partner is a trusted service acting on behalf of whoever asks it to. The external ID makes the partner supply a unique customer-specific value that both accounts associate with this relationship, which is what distinguishes your request from another customer's. The first option is the misconception the phase pre-empts: an external ID is neither secret nor authentication, and treating it as a credential leads to storing and rotating it as though it were one.

### Q14. A Kubernetes workload needs to read from a cloud storage bucket. The phase prefers workload identity over a stored secret. What does that mean concretely?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] The secret is scoped to a single bucket and mounted as a read-only volume
- [x] **The workload proves who it is to the platform with a short-lived token the platform can verify, so there is no long-lived secret to steal**
- [ ] The workload assumes a role using a secret stored in the platform's own secret manager
- [ ] The secret is encrypted at rest and rotated automatically on a schedule

**Why:** The phase's distinction is that workload identity replaces a secret with proof: the workload presents a short-lived token that the platform can verify, so a stolen file or an exposed environment variable yields nothing durable. The fourth option is the near-miss, because it still has a long-lived secret at the centre — the phase's argument is against the secret rather than against where it is kept. This is also why the phase's next warning matters: it notes that replacing the subject condition with a wildcard lets every service account in the cluster assume the role, which is the cluster-level version of a repository-wide wildcard.

### Q15. A KMS key policy grants `kms:ScheduleKeyDeletion` to administrators and denies it to nobody. The phase calls this a deliberate gap. Why?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] Because only the account root can actually schedule a deletion, so the grant is inert
- [ ] Because deleting a key is reversible within the waiting period, so the risk is low
- [x] **Because deleting a key is sometimes necessary, and the phase prefers an alertable administrative action to no path at all**
- [ ] Because a key policy cannot deny actions, so no deny statement was possible

**Why:** The phase flags this as looking like a gap and being a deliberate one: deleting a key is sometimes necessary, so the design keeps a path and relies on its being administrative, named, and visible rather than removing the capability. This is the same reasoning the phase applies to break-glass access — an emergency path that does not exist is not a control, it is a workaround built by the first person who needs one. The fourth option is worth noticing as a genuine property of key policies that is not the reason here; the phase's point is about the decision to allow the action, not about the mechanism for refusing it.

## Domain 4 — Proving and rehearsing (5 questions)

### Q16. The phase's break-glass rehearsal is described as the portfolio artefact for its part. What does a rehearsal produce that a diagram does not?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] An assurance that the alert fires, which is the component most likely to be missing
- [ ] A tested role definition, which proves the trust policy is correct
- [ ] A shorter time to access, because the procedure is memorised after the first run
- [x] **A record of the date, the person, the time from decision to access, what broke, and the credential rotation afterwards**

**Why:** The phase says the rehearsal produces a record with exactly those elements, and that the record is worth more in an interview than any diagram because it proves you have actually done the thing rather than described it. Its reasoning follows from why the rehearsal exists at all: the first use of a genuinely offline credential is when you discover the envelope was resealed wrong, the password expired, or the procedure names someone who left, so a rehearsal is the only way to find that out before an outage does. The third option is a real outcome of a rehearsal but not the artefact the phase names.

### Q17. An alert must catch break-glass use, and the phase says "an alert that nobody can silence is an alert with a query behind it." What makes the query find the right roles without a maintained list?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] A dedicated account for break-glass roles, because account boundaries are the strongest grouping
- [ ] An enumerated list in the query, reviewed quarterly alongside the access review
- [ ] A naming convention on the role, because a prefix is easier to enforce than a tag
- [x] **A tag on the role, because the tag lets the query find every break-glass role without anybody maintaining a list**

**Why:** The phase says the tag is not decoration: it is what lets the alerting query find every break-glass role without anyone maintaining a list, and it is also what the Rego rule checks for. The fourth option is the anti-pattern the tag exists to avoid, since a maintained list drifts from reality and fails silently. The reasoning generalises to the phase's whole approach: an attribute carried by the resource scales with the estate, while a list maintained beside it does not.

### Q18. The phase's Rego rule uses `not resource.change.after.permissions_boundary` rather than `== null`. Why does the distinction matter?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] Because `== null` is slower to evaluate across a large plan
- [ ] Because `== null` matches an empty string as well as a missing field
- [x] **Because comparing a missing field to null is undefined in Rego, so the check does not do what it appears to do**
- [ ] Because `not` also matches a boundary set to a value the policy does not recognise

**Why:** The phase states that the correct test for absence is the bare negation rather than a comparison with null, because in Rego comparing a missing field to null is undefined and an undefined result is not the `false` you were expecting. This is the kind of error that matters because the rule still runs and can still appear to work on the cases you test — a policy that fails to fire is indistinguishable from a policy whose condition was never met. The phase's broader point about policy as code is that the rule must fail a pull request, which requires it to evaluate to a definite result.

### Q19. The phase says proving a ceiling works is a step in its own right. What does that step require, and why is it not satisfied by reading the policy?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] A code review by a second engineer, because policy errors are easy to miss
- [ ] A recorded risk acceptance, because some permissions cannot be narrowed
- [x] **An actual attempt to exceed the boundary and a record of the denial, because a boundary nobody has tested is a claim rather than a control**
- [ ] A comparison against the previous version, because drift is what erodes a ceiling over time

**Why:** The phase's design walkthrough includes proving the ceiling as its own step, which follows directly from its central distinction between a control that exists and one that is enforced: a boundary is written down, and only an attempt that is actually denied shows it cannot be bypassed. The same logic is why the phase's break-glass design includes a rehearsal rather than only a procedure, and why it calls an untested plan the thing nobody discovers is broken until the outage. The fourth option is a real practice for a different problem — detecting drift in a control that already works.

### Q20. The phase says the transition from a control that exists to one that is enforced is most of what a cloud security engineer is paid to do. Which of its four example controls is enforced rather than merely monitored?
<!-- phases: advance-04-cloud-identity-architecture -->

- [ ] "Developers must not create IAM users", with a wiki page describing the rule
- [ ] "All S3 buckets must block public access", with a Config rule and an alert
- [x] **"Root user must not have access keys", with an SCP denying `iam:CreateAccessKey` for root**
- [ ] "Break-glass use must be approved", with an alert to the on-call channel

**Why:** The phase's table places the root-access-key rule in the enforced column because an SCP denies the action, and it notes that this row additionally carries a Config rule with automatic remediation, which is what a mature control looks like on all three columns at once. The first option is the subtle one: a Config rule with an alert is **monitored**, not enforced, because the bucket can still be made public and you find out afterwards. The third is monitored for the same reason, and the fourth merely exists — which is the full span of the distinction the phase is built on.

## Question-to-phase map

| Question | Main phase(s) |
|---|---|
| Q1–Q5 | `advance-roadmap/04-phase-cloud-identity-architecture.md` |
| Q6–Q9 | `advance-roadmap/04-phase-cloud-identity-architecture.md` |
| Q10–Q15 | `advance-roadmap/04-phase-cloud-identity-architecture.md` |
| Q16–Q20 | `advance-roadmap/04-phase-cloud-identity-architecture.md` |

All twenty questions map to the single phase, so the domains group by part rather than by source file: hierarchy and guardrails, the three-way control distinction, least privilege as engineering, and proving a control rather than describing it.

**This paper fills a gap the advance track's other paper names.** `curriculum-advance-ownership.md` covers Phases 1, 2, 3, 5, 6 and 7 and states that Phase 4 is deliberately outside its scope because its subject is design and policy. That exclusion was about what kind of question belongs in that paper, not about whether this phase could carry a diagnostic — and with every phase in all three tracks now covered, the corpus is complete.

## What a score does and does not mean

There is no pass mark here, and no number on this page implies readiness for a cloud security engineering role or any authority over a production account. **The questions are written to the design decisions this phase teaches, not to a certification blueprint**, because the advance track is deliberately aligned to no certification.

Many questions here have a wrong answer that is a real control described at the wrong strength — a Config rule where an SCP is needed, a secret in a managed store where workload identity is the point, a procedure where a rehearsal is the artefact. That pattern is deliberate, because the phase's argument is that the gap between a control that exists and one that is enforced is where the actual work is. If you missed several, the likely gap is that distinction rather than the vocabulary, and Part 2 of the phase is where to revisit it.

A useful reading of a miss is narrower than "I got this wrong." Almost every question turns on something you would have to **produce and show** rather than know: a boundary you attempted to exceed, a break-glass rehearsal record, a tag that makes a query work without a list, a policy that fails a pull request. Those are artefacts, and the phase's own worked design decision — a permission boundary and break-glass path for an administrator role — is the exercise that produces all of them at once.
