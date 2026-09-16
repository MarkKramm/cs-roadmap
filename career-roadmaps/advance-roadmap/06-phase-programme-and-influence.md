---
id: advance-06-programme-and-influence
track: advance
phase: 6
order: 60
title: "Phase 6 — Security Programme, Influence, and Mentoring"
duration: "5 weeks"
duration_weeks: 5
energy_mix: [low, normal]
deliverable: "portfolio/advance/06-programme-and-influence.md"
exit_criteria: "On a real control gap you own, you can produce a metrics dashboard, an executive brief, a funded business case, a risk-acceptance memo, a mentoring plan, and a runbook another person could follow."
---

# Phase 6 — Security Programme, Influence, and Mentoring

## Goal of this phase

Learn to own a piece of the security programme rather than a piece of the tooling: measure it honestly, write for the people who fund it, get agreement from people who do not report to you, and bring a junior up behind you.

## Estimated time

**5 weeks** at about 7–10 focused hours a week. Roughly 38–52 hours, and most of it is spent writing artefacts rather than reading.

## Skills you'll gain

- Tell a metric from a vanity metric, and defend the difference to someone who disagrees with you.
- Define a KPI or a KRI with a numerator, a denominator, a source, an owner, and a cadence.
- Report a number that moved in the wrong direction without hiding it and without panicking about it.
- Write a one-page executive brief that a non-technical reader can act on in ninety seconds.
- Build a business case with real options, real costs, and a stated consequence of refusal.
- Ask for money in the budget cycle, from the person who actually controls it.
- Influence an engineer, a peer manager, and a control owner who do not report to you.
- Run a control-owner relationship with a written agreement, a review cadence, and evidence.
- Write a risk-acceptance memo and get it signed by someone with the authority to accept the risk.
- Write a mentoring plan and mentor a junior without taking their work away from them.
- Run a structured interview and score a candidate on evidence rather than on impression.
- Write a runbook that another person can execute at 3am without calling you.
- Recognise an ethically grey request and respond to it without capitulating and without grandstanding.

## Specific topics to learn

- Metrics, indicators, and targets: KPI, KRI, KCI, leading indicators, lagging indicators
- Vanity metrics, and Goodhart's law
- Metric definition: numerator, denominator, data source, owner, cadence, target, threshold
- Distributions instead of averages: median, p90, and why a mean hides the bad day
- The security metrics dashboard, and who each panel is for
- Executive communication: bottom line up front, plain language, the decision frame
- The one-page brief, the pre-read, and the ninety-second rule
- Business cases: options analysis, cost, benefit, risk reduction, and the do-nothing option
- Single loss expectancy, annualised rate of occurrence, annualised loss expectancy
- Risk appetite, risk tolerance, the risk register, and inherent versus residual risk
- Risk treatment: mitigate, transfer, avoid, accept
- Risk ownership, and the authority required to accept a risk
- Influence without authority: expertise, reciprocity, legitimacy, and the other person's incentives
- Stakeholder mapping and the RACI model
- Control ownership: the agreement, the cadence, the evidence pack
- Escalation ladders, and when escalation is the wrong tool
- Mentoring, coaching, and managing, and the difference between them
- The mentoring plan: goals, growth tasks, checkpoints, and an exit
- Feedback models: situation, behaviour, impact
- Blameless review, and separating the person from the defect
- Structured interviewing, work-sample questions, and the interview scorecard
- Runbooks: trigger, preconditions, access, steps, expected output, rollback, escalation
- Testing a runbook by having someone else run it
- Ethics: conflicts of interest, the grey-area request, and how to refuse safely
- Professional obligations: honesty in reporting, confidentiality, and the duty to escalate

## Lesson: A Security Programme Is Measured, Funded, and Persuaded — Not Deployed

### Why this lesson exists

Everything up to this point in your career has been about making a system do something. You configure the control, you write the detection, you run the investigation, and the result is visible and verifiable. That work has a property you have probably stopped noticing: **it is true whether or not anyone agrees with you.** A misconfigured firewall rule does not care about your opinion.

The work in this phase is the opposite. There is no compiler for a budget request. There is no `--dry-run` for a difficult conversation with a peer manager. When you write a metric definition, the question is not "does it run" but "does it change a decision". When you ask for money, the question is not "is the risk real" but "is the risk real to the person holding the budget, in the terms they are measured on".

That change of register is where competent security engineers most often stall. The technical work continues to be available, and it continues to be satisfying, so the programme work gets deferred — and then one day someone less technical and less competent is running the programme, because they were willing to do the part you avoided.

> **What this phase is not.** It is not a soft-skills detour, and it is not about becoming a different person. Every artefact in this lesson has a structure, a pass condition, and a way to be wrong. A risk-acceptance memo that names the wrong signer is a defect in the same way a broken access-control rule is a defect. Treat it that way.

There are three things this lesson will make you good at, and they build on each other.

| Capability | What it produces | Why it matters |
|---|---|---|
| **Measurement** | A dashboard and a metric register that survive scrutiny | You cannot improve, fund, or defend what you cannot state numerically |
| **Persuasion** | Briefs, business cases, and risk memos that get decisions | A control nobody funds is a control that does not exist |
| **Enablement** | Control owners, mentored juniors, and runbooks | You cannot personally hold every control, and the programme outlives your attention |

The order matters. Measurement without persuasion produces accurate documents nobody reads. Persuasion without measurement produces confident documents that fall apart under the first question. Enablement without either produces a team that depends on you being in the room forever.

#### The reader this phase is written for

You have been in a security role for roughly one to three years. You can run the tooling. You have probably been the person who noticed the control gap, and you have probably watched that gap sit open for eighteen months while a different initiative got the budget. You may have been handed a junior to "look after" without anyone telling you what that means. You may have been asked to "own vulnerability management" without anyone telling you what authority came with it.

| What you likely have | What this phase adds |
|---|---|
| The ability to find a control gap | The ability to get it funded and scheduled |
| Opinions about risk | A written register, a treatment decision, and a named owner |
| Knowledge in your own head | Runbooks, mentoring plans, and control-owner agreements that move it out |
| A suspicion that the reporting is dishonest | A metric definition you can defend line by line |

#### Time to complete

**Roughly 40–52 hours over 5 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 3–4 | Once, properly, then returned to per part |
| The metric register and dashboard | 8–10 | The definition file is the hard part, not the chart |
| The executive brief, rewritten three times | 5–7 | The second and third drafts are where the skill is |
| The business case and the funded outcome | 8–10 | Includes the conversations, not just the document |
| The control-owner agreement and cadence | 4–5 | Includes one real review meeting |
| The risk-acceptance memo and the signature | 3–4 | Getting it signed is the exercise |
| The mentoring plan and the interviews | 5–7 | Includes writing the scorecard and running one interview |
| The runbook and its test | 4–5 | Someone else runs it, and you record where they got stuck |

**None of this requires money.** The artefacts are documents, spreadsheets, and conversations. The tools table below is entirely free, and the resources are the actual standards that organisations work from.

### Part 1 — A metric and a vanity metric are not the same thing

#### Definitions, because the words get used loosely

A **metric** is a number that describes something about a system or a process. A **KPI** — key performance indicator — is a metric that describes how well the programme is performing against a target. A **KRI** — key risk indicator — is a metric that describes how much risk is currently present, and it is designed to move *before* something bad happens rather than after. A **KCI** — key control indicator — describes whether a specific control is working as designed.

The distinction that matters day to day is **leading versus lagging**. A lagging indicator tells you what already happened: number of incidents this quarter, number of breaches, number of records exposed. A leading indicator tells you what is building up: percentage of critical assets with current endpoint telemetry, number of accounts with standing administrative privilege, median age of unremediated critical findings.

| Type | Example | Moves when |
|---|---|---|
| **Lagging** | Incidents per quarter | After the bad thing has happened |
| **Leading** | Percentage of production hosts with current agent coverage | Before the bad thing happens |
| **Lagging** | Mean time to contain | After an incident |
| **Leading** | Median age of an unowned critical finding | While the finding sits there |

A programme dashboard made entirely of lagging indicators is a rear-view mirror. It will be accurate and it will be useless for prevention. This is the single most common structural mistake in a first attempt at a security dashboard.

#### The test that separates the two

A **vanity metric** is a number that makes the programme look good and changes no decision. The test is short and it is brutal:

1. **Could this number go up while the organisation is less safe?** If yes, it is probably vanity.
2. **If this number halved overnight, would anyone change what they are doing this week?** If no, it is vanity.
3. **Is the denominator known, or is it assumed?** If it is assumed, the number is not yet a metric.

Apply the test to some numbers you have probably seen on a slide.

| Number as presented | Why it fails the test | What it becomes when fixed |
|---|---|---|
| "98 per cent endpoint coverage" | Coverage of what? The denominator is unknown, so the number cannot fall | "Telemetry installed and reporting within 24 hours on 1,412 of 1,447 in-scope production hosts (97.6 per cent). 35 exceptions listed by hostname and owner." |
| "Blocked 4.2 million malicious emails" | Volume blocked measures inbound noise, not the organisation's safety | "Phishing simulation click rate, 12-month trend, by department" |
| "Ran 14 awareness sessions" | Activity, not outcome | "Percentage of staff who reported a suspicious email in the last 30 days" |
| "Scanned 100 per cent of the estate" | Scan coverage is not remediation | "Median days to remediate a critical finding, p50 and p90" |
| "Achieved ISO 27001 certification" | Certification is a point-in-time assessment, not a state | "Number of control failures found in the last two internal audits, by control" |

**Goodhart's law** is the reason this matters enough to be its own section: *when a measure becomes a target, it ceases to be a good measure.* The moment "98 per cent coverage" becomes the thing a manager is measured on, the fastest route to 98 per cent is redefining what counts as in-scope. A good metric definition is written so that redefining it is visible and costs someone an argument.

#### The anatomy of a metric definition

A number without a definition is an opinion with a decimal point. Every metric on a dashboard you own should have all nine of these fields filled in before it is published.

| Field | Question it answers | Failure if missing |
|---|---|---|
| **Name and ID** | What is this? | Two teams report the same name differently |
| **Question** | What decision does it inform? | It is collected because it was easy |
| **Definition** | What exactly is counted? | Everyone computes it differently |
| **Numerator** | What is on top? | The number is unreproducible |
| **Denominator** | What is it out of? | It cannot go down, so it cannot inform |
| **Statistic** | Average, median, p90, count? | A mean hides the tail where the incidents are |
| **Source** | Which system, which report? | Nobody can verify it |
| **Owner** | Who is accountable for the number? | Nobody fixes it when it is wrong |
| **Cadence and thresholds** | How often, and when does it turn amber? | It is read but never acted on |

The **statistic** field is the one that gets skipped and the one that causes the most damage. Consider remediation times for ten critical vulnerabilities: 3, 4, 4, 5, 5, 6, 6, 7, 8, and 180 days. The mean is 22.8 days.

That mean is a lie about the typical case — eight of the ten closed inside a week — and it is simultaneously a lie about the tail, because a 180-day outlier is exactly the finding an auditor wants to see.

Report the median **and** the p90, and name the outlier separately. Never average a distribution you have not looked at.

#### A worked example: the same programme, two dashboards

Take a programme with these underlying facts: 1,447 production hosts, 1,412 reporting endpoint telemetry, 35 exceptions, 61 critical vulnerabilities open with a median age of 19 days and a p90 of 74 days, 214 accounts with standing administrative privilege, and a mean time to detect of 3.4 hours.

**Dashboard A — the vanity version.**

| Panel | Value | Colour |
|---|---|---|
| Endpoint coverage | 98% | Green |
| Critical vulnerabilities remediated | 312 | Green |
| Security incidents handled | 47 | Green |
| Awareness sessions delivered | 14 | Green |

**Dashboard B — the version that changes decisions.**

| Panel | Value | Threshold | Owner |
|---|---|---|---|
| Telemetry coverage, in-scope production hosts | 1,412 / 1,447 (97.6%) | Amber if < 99% | Infrastructure Manager |
| Uncovered hosts with a named exception | 21 of 35 | Red if any exception exceeds 90 days | Infrastructure Manager |
| Critical findings, median age | 19 days | Green ≤ 14 | Vulnerability Lead |
| Critical findings, p90 age | 74 days | Red > 45 | Vulnerability Lead |
| Critical findings older than 90 days | 9 | Red if > 0 | Vulnerability Lead |
| Accounts with standing admin privilege | 214 | Amber on any increase | Identity Lead |
| Mean time to detect, p50 | 3.4 hours | Green ≤ 4 | SOC Lead |

The two dashboards describe the same organisation. Only the second one has an owner and a threshold on every row, which means only the second one can be acted on in a meeting. **A metric with no threshold cannot be escalated, and a metric with no owner cannot be fixed.**

### Part 2 — Measuring a programme honestly, including when the number gets worse

#### The dashboard definition file

The dashboard is a rendering. The definition file is the artefact. Keep it in version control next to the roadmap, so that a change to a definition is a visible change with an author and a date. This is what makes it possible to say, two quarters later, "the metric did not improve, we redefined it, and here is the commit".

```yaml
# programme-metrics.yaml
# The definition behind the security programme dashboard.
# Rule: nothing appears on the dashboard that is not defined here,
# and nothing is defined here without a named owner.
# Rule: a definition change is a pull request, reviewed by the metric owner
#       and the person who consumes the metric.

dashboard:
  name: "Security Programme Dashboard"
  audience:
    - "CIO — monthly, one page"
    - "Head of IT — fortnightly, full register"
    - "Audit Committee — quarterly, trend and exceptions only"
  refresh: "monthly, first working day"
  source_of_truth: "programme-metrics.yaml + metrics-register.csv, in the repo"
  change_control: "any definition change is a reviewed pull request"

metrics:
  - id: KPI-01
    name: "Critical remediation latency"
    question: "How long does a critical finding take to close?"
    definition: >
      Days from the vendor advisory publication date to verified remediation
      on an affected production host. Verified means the scanner no longer
      reports the finding, or a change record shows the host was rebuilt or
      decommissioned.
    numerator: "sum of (remediation_date - advisory_date) for items closed in period"
    denominator: "count of critical items closed in period"
    statistic: "p50 reported as the headline; p90 and the count older than 90 days reported alongside"
    source: "vulnerability scanner export joined to change records"
    owner: "Vulnerability Lead"
    cadence: monthly
    target: "p50 <= 14 days, p90 <= 45 days, zero items older than 90 days"
    threshold_amber: "p50 > 14 days OR p90 > 45 days"
    threshold_red: "p50 > 21 days OR any item older than 90 days"
    known_limitations: >
      Excludes assets the scanner cannot authenticate to, currently 6 per cent
      of the estate. Decommissioned hosts are excluded and listed separately.
      Advisory date is used rather than discovery date, so a finding that was
      already old when first scanned will show a long latency.

  - id: KRI-04
    name: "Standing privileged access"
    question: "How much permanent administrative privilege exists in the directory?"
    definition: >
      Count of enabled human accounts holding a role with administrative rights
      on more than one system, measured at month end. Service accounts are
      counted in a separate metric and are not included.
    numerator: "count of qualifying accounts"
    denominator: "not applicable — this is a count, not a rate"
    statistic: "count at month end, plus net change over the month"
    source: "directory export and privileged group membership report"
    owner: "Identity Lead"
    cadence: monthly
    target: "no month-on-month increase; 10 per cent reduction per quarter"
    threshold_amber: "any net increase"
    threshold_red: "net increase above 10 per cent, or a new permanent admin grant outside the approval process"
    known_limitations: >
      Does not count nested group membership more than three levels deep.
      Cloud platform roles are reported separately and are not yet merged.

  - id: KCI-02
    name: "Backup restore verification"
    question: "Do the backups we rely on actually restore?"
    definition: >
      Number of systems in the tier-1 recovery scope for which a full restore
      was performed to an isolated environment and verified in the period.
    numerator: "count of tier-1 systems with a verified restore in the period"
    denominator: "count of tier-1 systems in the recovery scope"
    statistic: "percentage, with the list of untested systems named"
    source: "restore test records, signed by the operator"
    owner: "Infrastructure Manager"
    cadence: monthly
    target: "100 per cent of tier-1 systems tested at least once per quarter"
    threshold_amber: "any tier-1 system untested for more than 90 days"
    threshold_red: "a scheduled restore test failing, or a tier-1 system untested for more than 180 days"
    known_limitations: >
      A successful restore of a file is not a successful recovery of the
      business service. Application-level recovery is tested separately.
```

Three rows of that file are worth commenting on.

**`known_limitations` is not an apology.** It is the field that makes the metric defensible. When a manager asks "does this cover everything?", the honest answer is in the file, and the answer being pre-written is what stops the conversation from turning into an argument about your competence.

**`threshold_amber` and `threshold_red` are what make a metric operational.** A number with no threshold is a number somebody has to interpret in a meeting, and interpretation in a meeting is where political arguments live. A pre-agreed threshold turns "is 19 days bad?" into "19 days is above the agreed target of 14, so this is amber, and here is the action owner".

**`question` is the smallest and most valuable field.** If you cannot write a question that a real decision depends on, delete the metric. Programme dashboards accumulate dead panels the way repositories accumulate dead branches.

#### The KPI and KRI register

The dashboard is one page for one audience. The register is the complete list, and it is where the work actually lives.

| ID | Type | Metric | Question it answers | Numerator / denominator | Statistic | Source | Owner | Cadence | Target | Amber | Red |
|---|---|---|---|---|---|---|---|---|---|---|---|
| KPI-01 | Performance | Critical remediation latency | How long does a critical finding take to close? | Sum of days / count closed | p50 + p90 | Scanner + change records | Vulnerability Lead | Monthly | p50 ≤ 14d | p50 > 14d | p50 > 21d |
| KPI-02 | Performance | Mean time to detect | How long before we notice? | Sum of detection deltas / count of incidents | p50 | SIEM ticket timestamps | SOC Lead | Monthly | p50 ≤ 4h | > 4h | > 8h |
| KPI-03 | Performance | Mean time to contain | How long before we stop it? | Detection-to-containment per incident | p50 | Incident records | SOC Lead | Monthly | p50 ≤ 8h | > 8h | > 24h |
| KPI-04 | Performance | Phishing report rate | Are staff reporting rather than clicking? | Reports / simulated phish delivered | Percentage | Mail security + simulation tool | Awareness Lead | Monthly | ≥ 40% | < 40% | < 20% |
| KCI-01 | Control | MFA enforcement on remote access | Is the control actually on? | Accounts with MFA / accounts permitted remote access | Percentage | Identity provider report | Identity Lead | Weekly | 100% | < 100% | Any exception without a dated approval |
| KCI-02 | Control | Backup restore verification | Do our backups restore? | Tier-1 tested / tier-1 in scope | Percentage | Restore test records | Infrastructure Manager | Monthly | 100% per quarter | Any > 90d untested | Any failed test |
| KCI-03 | Control | Privileged session recording | Are admin sessions recorded? | Recorded sessions / privileged sessions | Percentage | PAM platform | Identity Lead | Monthly | ≥ 99% | < 99% | < 95% |
| KRI-01 | Risk | Critical findings older than 90 days | What is rotting? | Count | Count | Scanner | Vulnerability Lead | Monthly | 0 | 1–5 | > 5 |
| KRI-02 | Risk | Exceptions past their expiry | What have we quietly accepted? | Count | Count | Exception register | Programme Owner | Monthly | 0 | 1–3 | > 3 |
| KRI-03 | Risk | Third parties with unexpired assurance | Who have we not checked? | Assessed / in-scope vendors | Percentage | Vendor register | Procurement + Security | Quarterly | ≥ 90% | < 90% | < 75% |
| KRI-04 | Risk | Standing privileged access | How much permanent admin exists? | Count | Count + net change | Directory export | Identity Lead | Monthly | No increase | Any increase | > 10% increase |
| KRI-05 | Risk | Internet-exposed services without an owner | What is exposed and unaccounted for? | Count | Count | External attack surface scan | Security Architect | Monthly | 0 | 1–3 | > 3 |

Read that register as a programme and you can see what it is actually doing. Four KPI rows describe speed. Three KCI rows describe whether controls are switched on. Five KRI rows describe what is accumulating. **Nothing in the register measures activity**, because activity is not a risk and not a control.

#### Reporting a metric that got worse

This is the part of the job that separates people who are trusted from people who are managed. Your median time to detect has gone from 40 minutes to 65 minutes. The instinct is to explain it away, or to quietly change the definition, or to leave it off this month's pack.

**Do none of those three things.** Here is what you do instead, and the reason it works.

The first question a manager asks when a number gets worse is not "why is the number worse". It is **"does this person know, and will they tell me things I do not want to hear?"** Answering that question correctly is worth more than the number itself.

```text
METRIC MOVEMENT NOTE — KPI-02, Mean time to detect

Metric:            Mean time to detect, p50
Period:            March 2026
Previous:          41 minutes (February 2026)
Current:           65 minutes (March 2026)
Direction:         Worse. This is a real regression and it is not a
                   definition change — the definition is unchanged since
                   the register was created in January.

What changed:      On 4 March we enabled two new detection classes covering
                   slow, low-volume credential access and anomalous
                   service-account behaviour. Both classes have a longer
                   true detection window by design, because they key on
                   behaviour accumulated over hours rather than on a single
                   event.

Why the number is worse and the outcome is better:
                   We are now detecting intrusions we previously did not
                   detect at all. The two incidents caught in March by the
                   new classes had been present for 9 days and 14 days.
                   Under the old rules, neither would have generated an
                   alert; they would have been found by a third party or
                   not at all.

Supporting data:   March incidents: 11. Detected by new classes: 2, at 9 and
                   14 days of dwell time. Detected by pre-existing classes: 9,
                   at a p50 of 22 minutes — an improvement on February's
                   41 minutes for the same rule set.

What this does NOT mean:
                   It does not mean the regression is fine. 65 minutes is
                   above target and the metric stays amber. The two new
                   classes have a genuine speed problem and the rule logic
                   is being tuned.

Action:            SOC Lead to reduce the accumulation window on the
                   credential-access class from 6 hours to 90 minutes and
                   re-measure in April. Owner: SOC Lead. Date: 30 April 2026.

Decision required: None. This note is for information. If the metric is still
                   amber in May, it comes back as a decision.
```

**Every one of those headings is doing a job.** `Direction: worse` is stated in the first five lines, before any explanation, because a reader who stops after five lines must still have the truth. `What changed` comes before the justification, because sequencing explanation before fact reads as excuse. `What this does NOT mean` pre-empts the person who will otherwise say "so you are telling me the regression is fine" — you have already said it is not. `Decision required: None` tells the reader how much attention to spend.

**The two failures to avoid are symmetrical.** The first is hiding the regression, which works until someone compares two packs side by side and then works for you forever afterwards. The second is over-explaining it — four pages of justification for one number tells the reader that the presenter is frightened, and frightened presenters get their numbers audited.

There is one more thing worth saying plainly: **sometimes a metric gets worse because you started measuring it properly.** If the first month of a new metric looks bad, that is frequently evidence of a previously invisible problem, not evidence of new failure. Say that once, in writing, and then never use it as an excuse again.

### Part 3 — Writing for an executive reader

#### What the executive is actually doing when they read

An executive reads your document with one question in their head: **"what do you want me to do?"** They are not reading for completeness, they are scanning for a decision, a cost, a risk, a date, and an owner. If those five things are not visible in the first paragraph, the document will be skimmed and filed.

| The reader | What they need in the first 30 seconds | What they will punish |
|---|---|---|
| **CIO** | The decision, the cost, the risk of not deciding | Being asked to decide something you have not framed |
| **CFO** | The number, the range, the alternative | A single-point estimate with no range |
| **Peer manager** | What is being asked of their team, and when | Being surprised in front of their own boss |
| **Audit committee** | Trend, exceptions, and what is being done about the exceptions | A green dashboard with no exceptions listed |
| **Engineer** | The exact change, the exact system, the exact date | Being given a strategy when they need a ticket |

**Bottom line up front** — BLUF — is the structural rule that follows from this. State the conclusion first, then support it. The inverted-pyramid structure of a news article, not the chronological structure of an investigation. Most technically trained writers do the opposite, because the investigation is how they arrived at the answer, and narrating the investigation feels like being rigorous. To a reader with four minutes, it feels like being made to wait.

#### The one-page brief template

This template is the workhorse. It fits on one page, it is written before the meeting rather than during it, and it is designed to be read by someone who was not in the room.

```text
ONE-PAGE BRIEF

Title:            <the decision, phrased as a decision>
Date:             <date issued>
Author:           <you>
Decision owner:   <the person who must decide — one name, not a committee>

BOTTOM LINE
<Three sentences maximum. What is the situation, what are you asking for,
and what happens if nothing is decided. No jargon. No acronyms that are not
expanded on first use.>

WHAT WE KNOW
<Three to five bullets. Each one a fact with a source or a date attached.
If you cannot attach a source, it is not a fact and it belongs in
"what we do not know".>

WHAT WE DO NOT KNOW
<Two to four bullets. The limits of your own analysis, stated by you before
someone else finds them. This section is why the brief is trusted.>

OPTIONS
  Option A — <name>
    What it involves:  <one sentence>
    Cost:              <number or range, with the currency and period>
    Risk reduction:    <what stops being possible>
    Time to effect:    <weeks or months>
    What we give up:   <the honest downside>

  Option B — <name>   [same five fields]

  Option C — Do nothing
    What it involves:  Continuing as we are
    Cost:              <the cost of the current state, if you can state it>
    Risk reduction:    None
    Time to effect:    Not applicable
    What we give up:   <this is the important field — name the exposure>

RECOMMENDATION
<Which option, and one sentence of why. If the recommendation is not the
cheapest option, say what the cheaper option fails to do.>

DECISION REQUIRED BY
<Date. Give a real date and say what it constrains — a procurement window,
a licence renewal, an audit, a go-live. A deadline with no consequence is
not a deadline.>

IF NO DECISION IS MADE
<One sentence. The default outcome, stated neutrally. Not a threat.>

ATTACHMENTS
<The detail. The full analysis, the technical assessment, the quote.>
```

Four fields in that template carry more weight than the rest.

**`What we do not know`** is the field that gets a brief taken seriously. A reader who finds your stated limitation themselves concludes you missed it. A reader who sees you state it first concludes you are competent. The same information, opposite effect, entirely because of who said it first.

**`Option C — Do nothing`** is not a rhetorical device. It is the actual baseline, it is what the organisation is choosing by default, and putting a cost and a downside against it is the single most effective thing in the document. A manager comparing Option A against Option B is choosing between two spends. A manager comparing Option A against Option C is choosing between a spend and an exposure.

**`What we give up`** is what makes the options honest. If you cannot name a real downside of your own recommendation, you have written a pitch rather than a brief, and an experienced reader will notice.

**`If no decision is made`** states the default without adjectives. "The servers remain without endpoint telemetry for a further quarter" is a fact. "We will be completely exposed and it will be a disaster" is a threat, and threats get escalated to your manager's manager in a way you will not enjoy.

#### The wrong first guess: the comprehensive deck

**Wrong first guess.** The first instinct of a technically trained person asked to "present the risk to management" is to build a thorough deck — thirty to forty slides, starting with architecture, then the vulnerability class, then the exploit chain, then the tooling options, then the recommendation on slide thirty-four.

**Why it fails, mechanically.** Not because executives are impatient or anti-technical. It fails because the format puts the decision at the end, and a reader who has not yet been told what is being asked of them has no frame for evaluating anything that precedes it. Slides one to thirty-three are answering a question the reader has not been given. The deck is not too long — it is in the wrong order.

**What the same material looks like when it works.** One page, decision first, options with costs, a recommended option, a date, and the detailed deck attached as an appendix for anyone who wants it. The appendix is what makes the one-pager credible: you are not hiding the detail, you are indexing it.

| Wrong first guess | What actually works |
|---|---|
| 40-slide deck, recommendation at the end | 1-page brief, recommendation in the second paragraph, deck attached |
| Opens with the technical mechanism | Opens with the decision and the cost |
| One option, extensively justified | Three options, including do-nothing, each with a downside |
| "This is critical" | "This is the exposure, this is the fix, this is the cost, decide by the 14th" |
| Sent the night before | Sent three days before, so it is a pre-read rather than a surprise |
| Presented by one person talking for 40 minutes | Presented in 5 minutes, then discussion |

#### Writing in plain language without losing precision

Plain language is not a reduction in rigour. It is a translation step, and it is a skill you can practise. The rule is that every sentence should survive being read by a competent person outside your specialism.

| Instead of | Write |
|---|---|
| "We have a gap in EDR coverage on the legacy server estate" | "Thirty-five servers have no endpoint monitoring. Two of them hold customer records." |
| "The risk is elevated due to the threat landscape" | "This class of attack was used against three companies in our sector in the last six months." |
| "We should leverage the existing tooling to remediate" | "The tool is already licensed. The work is four days of an engineer's time." |
| "There is a potential exfiltration vector" | "Someone with access to these servers could copy the customer database out without being seen." |
| "Mitigating controls are in progress" | "Two of the four controls are in place. The remaining two are scheduled for March." |
| "The residual risk is within appetite" | "With these controls, the remaining exposure is a single day of sales data, which we judge acceptable." |

Three mechanical habits make this easier. **Expand every acronym at first use**, even ones you are certain everyone knows. **Use a number and a unit** wherever a vague quantity would otherwise go — "thirty-five servers", not "several hosts". **Delete the hedge words** — "potentially", "may", "could possibly", "leverage", "utilise", "socialise", "align on". Most of them are a way of avoiding a claim, and an avoidance of a claim is the reason the brief gets deferred.

### Part 4 — The business case, and how to actually get funded

#### The end-to-end worked example

This is the exercise the rest of the phase builds on, carried from a technical finding through to a funded, scheduled fix. Follow the whole path once, then do it on your own gap.

**The finding.** An internal audit of backup and recovery discovers that the tier-1 recovery scope contains 47 systems, and that **restore verification has been performed on 4 of them in the last twelve months.** The backup jobs report success. Nobody has ever tried to restore the whole thing.

**Step 1 — Establish the fact before you establish the risk.** The first version of this finding is not "our backups are broken". It is a countable statement with a source.

| Question | Answer | Source |
|---|---|---|
| How many systems are in the tier-1 recovery scope? | 47 | Recovery plan v3.2, Appendix B |
| How many had a verified full restore in 12 months? | 4 | Restore logs, ticket system |
| Do the backup jobs report success? | Yes, 99.2% job success rate | Backup platform dashboard |
| Has anyone ever restored the directory service? | No record | Ticket search, 36 months |
| What is the RTO for tier-1? | 8 hours | Business continuity plan |
| Has the RTO ever been tested end to end? | No | Business continuity plan review notes |

That table is already a business case in embryo, because it converts a technical suspicion into six facts with sources. **Do this before you talk to anyone about the fix.** A finding with sources survives the first question; a finding without them becomes a conversation about your credibility.

**Step 2 — State the risk in the language of the business.** Not "the RTO is untested". Instead: the business has committed to a service recovery time of eight hours for tier-1 services, and there is no evidence that this is achievable.

| Consequence | Who experiences it | How long |
|---|---|---|
| Tier-1 services unavailable past the committed 8 hours | Customers and the operations team | 8 hours to several days |
| Inability to demonstrate recovery capability to a regulator or an auditor | Compliance and the board | At the next audit |
| Reliance on a single untested mechanism for ransomware recovery | The whole organisation | For as long as the gap persists |

**Step 3 — Quantify with ranges, not point estimates.** Two definitions first, because they are the vocabulary of a funding conversation.

**Single loss expectancy (SLE)** is the estimated cost of one occurrence of the event. **Annualised rate of occurrence (ARO)** is the estimated number of times the event happens per year. **Annualised loss expectancy (ALE)** is SLE multiplied by ARO — a rough annual cost of the risk.

| Input | Low estimate | High estimate | Basis |
|---|---|---|---|
| Downtime cost per hour, tier-1 | $4,000 | $11,000 | Operations estimate, revenue plus labour |
| Expected outage length if restore fails | 24 hours | 96 hours | Rebuild times from the last two unplanned outages |
| SLE | $96,000 | $1,056,000 | Downtime × hours |
| ARO | 0.1 | 0.4 | One failure every 2.5 to 10 years, judgement-based |
| **ALE** | **$9,600** | **$422,400** | SLE × ARO |

**Say out loud that these are estimates.** A single-point ALE figure presented with false precision is the fastest way to lose a CFO. A range with a stated basis invites the CFO to argue with your assumptions, which is exactly the conversation you want, because a CFO who argues with your assumptions has engaged with your case.

**Step 4 — Build the options.** Including the do-nothing option, with a cost.

| Option | What it involves | Cost | Risk reduction | Time | What we give up |
|---|---|---|---|---|---|
| **A — Do nothing** | Continue as is | $0 direct | None | — | The exposure stands, and the audit finding is repeated next year |
| **B — Test and document, no new spend** | Quarterly restore tests for tier-1 using existing staff; written evidence; escalation path for failures | 6 days per quarter of an engineer's time, absorbed | Demonstrates capability; finds failures before an incident does | 6 weeks to first full cycle | Nothing discovered; the tests may fail, and failures will need their own funding |
| **C — Build an isolated recovery environment** | Dedicated isolated network segment, automated restore verification, quarterly full rehearsal | One-off hardware $18,000, plus 15 days of engineering | Removes the main failure mode and produces repeatable evidence | 4 months | Budget, and the hardware has a 5-year depreciation tail |
| **D — Managed recovery service** | Third party provides recovery capability and rehearsals | $42,000 per year, ongoing | Transfers part of the risk contractually | 8 weeks | Control, and an annual commitment that is hard to exit |

**Step 5 — Recommend one, and name what the others fail to do.** Recommend B now and C in the next budget cycle, because B produces evidence this quarter at no cost and C is the durable fix. Say explicitly that B is insufficient on its own and that C is the recommendation the evidence supports. A recommendation that pretends a free option is a permanent fix is the thing that destroys trust in the next one.

**Step 6 — Find the budget cycle, and the person who owns it.** This step is where most technically correct business cases die, and it has nothing to do with the quality of the document.

| Question to answer before you send anything | Why |
|---|---|
| When is the budget set for the next period? | A case submitted after the cycle is a case for the cycle after |
| Who signs for capital expenditure of this size? | It is frequently not the CIO |
| What has that person already committed to spend on? | Your case competes with something specific, not with an abstract "no" |
| Is there an existing renewal or contract expiry to ride? | A renewal date is a free deadline you did not have to invent |
| Who else must agree before it is approved? | Finance, procurement, and the business owner of the affected service |

**Step 7 — The funded outcome.** A meeting where a decision is recorded, an owner is named, a date is set, and the action appears in the programme register with an ID. Here is what that looks like when it lands.

```text
PROGRAMME ACTION — PA-2026-041

Title:        Tier-1 backup restore verification programme
Origin:       Internal audit finding AUD-2026-011
Decision:     Option B approved immediately. Option C approved in principle,
              subject to the Q3 capital submission.
Decided by:   Head of Infrastructure, 14 April 2026
Decision date: 14 April 2026

Actions:
  PA-2026-041a  Publish the tier-1 restore test schedule, all 47 systems
                Owner: Infrastructure Manager   Due: 30 April 2026
  PA-2026-041b  Complete the first full quarterly test cycle
                Owner: Backup Engineer          Due: 30 June 2026
  PA-2026-041c  Submit the capital case for the isolated recovery environment
                Owner: Infrastructure Manager   Due: 15 July 2026
  PA-2026-041d  Report restore verification status to the Audit Committee
                Owner: Programme Owner          Due: quarterly, from Q3

Metric:       KCI-02, Backup restore verification — created in the register
              with this action as its origin.

Risk accepted in the interim: the residual exposure until 30 June 2026 is
accepted by the Head of Infrastructure, documented in RA-2026-009, expiring
30 June 2026.

Status:       Open. Reviewed monthly at the programme meeting.
```

**Look at what that block contains.** A decision, a named decision-maker, a date, four actions each with an owner and a date, a metric created to track it, and a time-boxed risk acceptance covering the gap in the meantime. That is the difference between "we raised the issue" and "it is being fixed". The whole phase is aimed at that block.

#### The common failure at this point

**Common failure.** The case is technically sound, the options are real, the cost is accurate — and nothing happens. The author concludes the organisation does not care about security.

The actual cause is almost always one of four things, and none of them is apathy.

| What happened | What it looks like from your side | The actual cause | The fix |
|---|---|---|---|
| Wrong budget cycle | "They ignored it" | The case arrived after the allocation was closed | Ask the finance contact when the cycle closes before you write anything |
| Wrong decision-maker | "It was approved and went nowhere" | The person who agreed is not the person who signs | Ask "who signs for this?" in the first conversation |
| Competing commitment | "Security is never a priority" | The money is already promised to something specific | Find out what, and position against it explicitly |
| No consequence for delay | "It keeps slipping" | The do-nothing option had no cost attached | Attach a date with a real constraint — a renewal, an audit, a go-live |

**The fourth row is the one you control.** A case with no deadline is a case that can always be decided next quarter. A deadline that is real — "the current licence expires on 30 September and the renewal price increases by 40 per cent" — moves a decision from optional to scheduled.

### Part 5 — Influence without authority

#### Why this is not a personality trait

**Influence without authority** means getting a change to happen when the person who must make it happen does not report to you and has no obligation to comply. It is frequently described as a soft skill, which is misleading: it has structure, it can be planned, and it fails in predictable ways.

There are five sources of influence available to you, and a competent operator picks deliberately rather than hoping charm will work.

| Source | What it is | When it is strongest | Its failure mode |
|---|---|---|---|
| **Expertise** | You know the specific thing better than anyone in the room | Technical decisions, incident response, architecture | Being right and being ignored, because you have no relationship |
| **Reciprocity** | You have done something for them, or you can | Cross-team work, favours, shared incidents | Trading favours instead of fixing the process |
| **Legitimacy** | The ask comes from a policy, a standard, or a mandate | Control requirements, audit findings | Reciting the policy at someone who disagrees with the policy |
| **Incentives** | The change helps them hit a target they already have | Nearly every real case | Assuming you know their target and being wrong |
| **Escalation** | Someone above both of you decides | Genuine deadlock with a real deadline | Using it early, which costs you every future conversation |

**The incentives row is the one to build your practice on.** Almost every durable agreement you will get is one where the other person's own objectives are served. That means the work before the conversation is finding out what those objectives are.

| Their likely objective | What you lead with |
|---|---|
| Meeting a delivery date | "This takes two days now and prevents the three-day outage that missed your last date" |
| Reducing support tickets | "Ninety per cent of the tickets from this system come from the thing we are fixing" |
| Passing an audit | "This is the finding that will be raised again if we do not close it" |
| Staying inside a budget | "This is free — it is a configuration change, not a purchase" |
| Not being embarrassed in front of their boss | "You will be the one reporting it as closed, with the evidence" |
| Keeping their team's workload down | "It is one day of your engineer's time, and I will write the runbook" |

#### The control-owner relationship

A **control owner** is the person accountable for a specific control operating correctly. It is usually not you, and it usually is not someone who considers security their main job. A backup control is owned by whoever runs backups. A joiner-mover-leaver control is owned by HR or IT operations.

The relationship fails in a specific, predictable way: the security team treats the control owner as a resource to be chased, and the control owner experiences security as a source of unplanned work with no upside. You fix that with three things, in order.

**1. A written agreement.** Not a policy. A short agreement between you and them that names the control, what "operating correctly" means, what evidence is produced, and how often it is reviewed.

```text
CONTROL OWNERSHIP AGREEMENT — CO-2026-004

Control:        Backup restore verification for tier-1 systems
Control owner:  Infrastructure Manager
Control ID:     KCI-02
Framework ref:  Recovery capability, business continuity plan v3.2

What "operating correctly" means, agreed by both parties:
  - Every tier-1 system in scope is restored to an isolated environment
    and verified at least once per quarter.
  - Every restore produces a record naming the system, the date, the
    operator, the backup set used, and the verification result.
  - Any failed restore is raised as an incident within one working day.

Evidence produced by the owner, reviewed by security:
  - Restore test records, one per system per quarter.
  - A monthly summary: systems tested, systems untested, failures, actions.

What security provides in return:
  - The scope list of tier-1 systems, refreshed quarterly.
  - The test procedure, written and maintained by security.
  - A quarterly review slot, agenda and minutes prepared by security.
  - Escalation support if the owner is blocked by another team.

Review cadence:  Monthly, 30 minutes, standing slot.
Escalation path: Programme Owner, then Head of Infrastructure.
Effective:       1 May 2026
Review date:     1 November 2026, or on a change of either role holder.
```

**2. A cadence.** A standing 30-minute slot with a prepared agenda. The value of a cadence is not the meeting; it is that the owner knows a specific time exists when they will be asked about this, and can prepare rather than be ambushed.

**3. A RACI, written down.** **RACI** stands for Responsible, Accountable, Consulted, Informed. It exists to answer the question "who is actually doing this?" before the week it is due.

| Activity | Security | Infrastructure | Application owner | Programme Owner |
|---|---|---|---|---|
| Define the restore test procedure | **R** | C | I | I |
| Execute the restore test | C | **R** | I | I |
| Verify the application works after restore | C | C | **R** | I |
| Record the evidence | **R** | C | I | I |
| Report failures | C | **R** | I | **A** |
| Accept the residual risk while untested | C | C | I | **A** |

**The blank-cell test for a RACI:** if two people are Responsible for the same activity, nobody is. If an activity has no Accountable, it will not happen. Read your RACI against both rules before you publish it.

#### Asking a busy manager for something

A request that gets a yes has four properties: it is **specific**, it is **small**, it is **dated**, and it names **what happens if it does not happen**. Compare.

| Request that gets deferred | Request that gets a decision |
|---|---|
| "We need to improve backup testing across the estate." | "Can your team restore two systems to the isolated environment in the next three weeks? Here is the procedure. I will write the record and attend." |
| "Ownership of the control needs to move." | "Please confirm by Friday that your team owns restore verification for these 47 systems. If not, I will take it to the programme meeting as unowned." |
| "There are too many exceptions on the register." | "Three exceptions expire this month. One is yours. Do you want to renew it, or should we plan the fix?" |

**Note the pattern in the third pair.** The ask is not for a large change. It is for a decision about a specific item with a date attached. Small, dated asks accumulate into a relationship; large, vague asks accumulate into a reputation for nagging.

#### Disagreeing in public, and disagreeing well

At some point you will be in a meeting where a decision you think is wrong is being made by people senior to you. There is a way to do this that preserves both the decision quality and the relationship.

| Do | Do not |
|---|---|
| State the concern, the evidence, and the specific consequence, once | Repeat it in three different ways to make sure it lands |
| Frame it as a question: "have we considered what happens if the restore fails mid-quarter?" | Frame it as a verdict: "that will not work" |
| Say what would change your mind | Imply that only an idiot would disagree |
| Ask for it to be recorded in the minutes | Ask for it to be escalated immediately |
| After the decision, commit to it publicly and note your dissent privately | Continue to relitigate it in corridors |

**The last row is the whole skill.** Once a decision is made, your job is to make it work and to have recorded your view. An engineer who keeps fighting a settled decision becomes the person who is not invited to the next decision.

### Part 6 — Risk acceptance, and who signs it

#### The vocabulary, defined before it is used

**Risk** is the combination of the likelihood of a threat event and its consequence. **Inherent risk** is the risk before controls. **Residual risk** is the risk that remains after controls. **Risk appetite** is how much risk the organisation is willing to take in pursuit of its objectives; **risk tolerance** is the acceptable variation around that appetite for a specific area. A **risk register** is the list of identified risks with owners, treatments, and review dates.

**Risk treatment** has exactly four options, and naming them precisely stops most arguments.

| Treatment | What it means | Example |
|---|---|---|
| **Mitigate** | Reduce the likelihood or the impact | Add MFA, patch, add monitoring |
| **Transfer** | Move the financial consequence to a third party | Cyber insurance, contractual liability |
| **Avoid** | Stop doing the activity that creates the risk | Retire the service, do not collect the data |
| **Accept** | Decide to live with the residual risk, knowingly and with a named owner | Documented, dated, and signed |

**Accept is not the same as ignoring.** Ignoring is what happens when nobody writes it down. Accepting is a decision with a signature.

#### The rule that governs the whole exercise

**The person who accepts the risk must have the authority to spend the money that would fix it.** This is the only rule in this part that matters, and it resolves almost every case.

If a manager can authorise the fix and chooses not to, they are the right signer. If they cannot authorise the fix — because the budget sits elsewhere, or the priority sits elsewhere — then they are not accepting a risk, they are absorbing a consequence they cannot control. Their signature on your memo is worthless, and presenting it to an auditor as evidence of a managed risk is worse than having no memo at all.

| Situation | Wrong signer | Right signer |
|---|---|---|
| A £30,000 control gap in a business unit | The business unit manager who has a £5,000 discretionary budget | The director who holds the £30,000 |
| An unpatched system owned by a supplier | Your own security manager | The contract owner, with procurement |
| A risk created by a product decision | The engineering manager | The product owner who chose the design |
| A risk that a regulation applies to | Anyone in IT | Legal counsel or the Data Protection Officer |
| A risk in a service you are decommissioning in six months | The service owner, indefinitely | The service owner, **time-boxed to the decommissioning date** |

That last row introduces the second rule: **acceptance is time-boxed.** An acceptance with no expiry is a permanent decision made by someone who may leave. Every memo carries an expiry date and a review trigger.

#### The risk-acceptance memo

```text
RISK ACCEPTANCE MEMO

Memo ID:          RA-2026-009
Date raised:      14 April 2026
Raised by:        <you>, Security Programme
Risk owner:       Head of Infrastructure
Review date:      30 June 2026  (hard expiry — see Expiry)
Register entry:   RISK-0142, "Untested tier-1 recovery capability"

RISK STATEMENT
Tier-1 recovery capability has been verified on 4 of 47 systems in the last
twelve months. If a recovery is required before the verification programme
completes, the organisation cannot state with evidence whether it will meet
its committed 8-hour recovery time objective.

WHAT IS BEING ACCEPTED
The residual exposure between 14 April 2026 and 30 June 2026, during which
restore verification will be incomplete. Specifically:
  - The possibility that a restore attempt fails and the outage extends
    beyond the committed recovery time.
  - The absence of documentary evidence of recovery capability if an audit
    or a regulator asks for it during this window.

WHAT IS NOT BEING ACCEPTED
  - Any extension beyond 30 June 2026 without a new memo.
  - Any reduction in the tier-1 scope list to make the metric look better.
  - Any change to the restore test schedule without the owner's agreement.

COMPENSATING MEASURES IN PLACE DURING THE WINDOW
  1. The 4 verified systems are documented and can be named on request.
  2. Backup job success rate is monitored daily; failures page the on-call.
  3. A restore capability statement has been issued to the audit committee
     stating that verification is in progress and incomplete.
  4. The first full test cycle is scheduled and staffed, with a named owner.

WHY THE RISK CANNOT BE CLOSED IMMEDIATELY
Testing 47 systems requires an isolated environment that does not exist yet.
Building it is a capital item outside the current allocation. The interim
programme (Option B) closes the evidence gap within the window at no
incremental cost.

DECISION
I accept the residual risk described above, for the period stated, on the
understanding that the verification programme proceeds to the schedule in
programme action PA-2026-041.

Name:      ______________________________
Role:      ______________________________
Signature: ______________________________
Date:      ______________________________

EXPIRY
This acceptance expires on 30 June 2026. It renews only by a new memo. If the
verification programme has not reached 100 per cent of tier-1 systems by that
date, the risk returns to the register as unaccepted and is escalated to the
Programme Owner.

ATTACHMENTS
  A. Audit finding AUD-2026-011
  B. Tier-1 scope list, 47 systems
  C. Restore test procedure
  D. Programme action PA-2026-041
```

Five things in that memo are load-bearing.

**`What is not being accepted`** is the section that prevents scope creep. Without it, a memo accepting an untested estate for ten weeks can quietly become a memo accepting it indefinitely.

**`Compensating measures`** is what makes the acceptance a managed position rather than a surrender. It also gives the risk owner something to defend with if the question comes from above.

**`Why the risk cannot be closed immediately`** is a factual statement about constraints, not an excuse. If you cannot write this section honestly, the risk is probably closable and you should close it rather than memo it.

**The signature block is physical, or a recorded approval.** A risk acceptance that exists as a verbal agreement in a corridor did not happen. An email reply saying "agreed, proceed" is acceptable; a recollection is not.

**`Expiry`** is what turns a memo into a control. An acceptance that cannot lapse is a decision nobody has to revisit.

#### When you disagree with the accepted risk

You will. Someone senior to you will accept a risk you believe is not acceptable. What you do next is part of the job.

| Do | Do not |
|---|---|
| Record your dissent in the memo, factually, at the time | Refuse to write the memo, which leaves the risk undocumented |
| Keep the metric on the dashboard, unchanged | Quietly remove the metric so the number looks better |
| Note the acceptance in your handover documentation | Take it to an external party without going through the internal path first |
| Ask for a review date sooner than the expiry | Relitigate it in every meeting until it changes |
| Escalate once, through the defined path, if the risk is genuinely outside appetite | Escalate repeatedly, which converts a risk dispute into a personal conflict |

**You have a professional obligation to record, and a defined route to escalate once.** What you do not have is the authority to override a decision that the organisation is entitled to make. Documenting it properly is what protects both the organisation and you.

### Part 7 — Mentoring a junior without doing their work for them

#### Three different jobs that get called the same thing

**Managing** is about performance, workload, and accountability. **Coaching** is about drawing the answer out of someone who already has it. **Mentoring** is about transferring judgement and context over time, usually outside the reporting line. You are probably being asked to do the third, and you may have been given none of the first.

| | Managing | Coaching | Mentoring |
|---|---|---|---|
| **Focus** | Output and behaviour | A specific problem in front of them | Long-term capability and judgement |
| **Relationship** | Reporting line | Any | Usually outside the reporting line |
| **Who holds the answer** | You, and you are accountable | They do | Mixed — you share context, they decide |
| **Typical cadence** | Continuous | Ad hoc | Scheduled, over months |
| **Fails when** | It becomes friendship | It becomes instruction | It becomes doing their work for them |

#### The mentoring plan

A mentoring relationship with no plan becomes a series of corridor conversations, which are pleasant and produce nothing. A plan takes thirty minutes to write and it changes what the relationship is for.

```text
MENTORING PLAN — <name>

Mentor:            <you>
Mentee:            <them>
Start / review:    1 May 2026 / 1 August 2026 (12 weeks)
Cadence:          30 minutes, fortnightly, standing slot. Mentee sets the
                  agenda and sends it the day before.

CURRENT ROLE AND WHERE THEY ARE TRYING TO GET
  Now:   Security analyst, 10 months in.
  Next:  Analyst with ownership of a detection area, able to triage
         without a second opinion and to write it up for a non-technical
         reader.

WHERE THEY ARE STRONG, BASED ON OBSERVED WORK
  - Systematic triage; the notes are consistently complete.
  - Willing to say "I do not know" rather than guess.

WHERE THE GAP IS, BASED ON OBSERVED WORK
  - Escalates decisions that are within their remit — 6 of the last 10
    escalations needed no input.
  - Writes only for a technical reader. Two incident summaries this quarter
    were unusable by the business.

GOALS FOR THE 12 WEEKS
  G1  Triage and close S3 and S4 alerts without escalation, using the
      written severity scale, for four consecutive weeks.
      Success measure: escalation rate on S3/S4 drops and no misclassified
      severity is found on review.
  G2  Write three incident summaries that a non-technical reader can act on.
      Success measure: the summaries pass the review checklist in Part 3,
      assessed by two different reviewers.

GROWTH TASKS
  T1  Own the weekly phishing-report triage, start to finish, including the
      close-out note. (Weeks 1–12)
  T2  Write one executive summary per month, reviewed against the Part 3
      brief checklist. (Weeks 2, 6, 10)
  T3  Shadow one control-owner review meeting, then present one agenda item
      at the next. (Weeks 5 and 9)
  T4  Write the runbook for the phishing triage process they own. (Week 8)
  T5  Run one peer review of another analyst's investigation notes, using a
      written checklist. (Week 11)

WHAT THE MENTOR WILL DO
  - Answer questions with a question where the answer is already knowable.
  - Review written work against the checklist, not against my preference.
  - Say "I do not know" when I do not know.
  - Give feedback within one working day, using situation-behaviour-impact.
  - Not take over a task, even when it would be faster.

WHAT THE MENTOR WILL NOT DO
  - Rewrite their documents. Comment, do not edit.
  - Take their ticket the night before a deadline.
  - Answer a question they have not yet attempted.
  - Discuss their performance with their manager without telling them first.

BOUNDARIES
  - Anything about their pay, promotion, or formal performance is for their
    manager, not me. If it comes up, I say so and redirect.
  - If they are struggling with something outside work, I listen, and I do
    not become their clinician.

CHECKPOINTS
  Week 4   Review G1 progress. Are they escalating less, and correctly?
  Week 8   Review G2 progress. Read the three summaries together.
  Week 12  Close-out: what changed, what did not, and what the next goal is.
           Written summary shared with the mentee, and with their manager
           only by agreement.
```

Three things in that plan do the work. **The gap section is based on observed work**, not on a feeling — "6 of the last 10 escalations needed no input" is a number the mentee can verify and argue with. **Every goal has a success measure**, so the review is a review rather than a reassurance. **The `will not` section exists**, because the failure mode of mentoring is not neglect, it is over-helpfulness.

#### The rule that matters most

**Never take the keyboard.**

The moment you type the command, write the sentence, or send the message on their behalf, you have converted a learning task into a completed task, and you have taught them that the way to get something done is to hand it to you. This is genuinely hard, because you can see the answer and the deadline is real, and helping feels kind.

| Their situation | The unhelpful response | The useful response |
|---|---|---|
| Stuck on a triage decision | "It's an S3, close it." | "Which severity definition row does the evidence match? Read me the row." |
| A report reads badly | Rewriting it | "Read paragraph two aloud. Where does your attention drift?" |
| Cannot find the log they need | Sending the path | "What have you checked so far, and what did each check rule out?" |
| About to miss a deadline | Doing it yourself | "What is the smallest version of this you can finish today? Send me that." |
| Made a mistake that broke something | Fixing it and saying nothing | "Walk me through what you did and what you expected. Then we fix it together." |

**The last row is the one that decides whether they trust you.** A junior who is afraid of you will hide their next mistake, and a hidden mistake in security is a much larger problem than a disclosed one.

#### Feedback that lands

Use **situation, behaviour, impact** — SBI. Name the specific situation, describe the observable behaviour, state the impact. No adjectives about the person.

| Weak feedback | SBI feedback |
|---|---|
| "You need to be more proactive." | "In Tuesday's handover, you had the alert details but waited for me to ask before sharing them. That meant the handover took twenty minutes longer and the next shift started late." |
| "Your report was great." | "Your report on the phishing cluster named the three affected mailboxes and the exact rule that caught it. The business owner was able to block the sender the same afternoon without asking me anything." |
| "You are not ready for that yet." | "The control-owner review needs a presenter who can hold a budget conversation. The phishing runbook you wrote is the first half of that skill. Let's do one meeting where you present and I answer questions, then reassess." |

**Positive SBI matters more than negative SBI**, because it tells a junior exactly which behaviour to repeat. "Good work" is not feedback; "the exact rule that caught it" is.

#### When they get it wrong

A junior will eventually do something with a real consequence: delete the wrong record, send a report to the wrong distribution list, or misjudge a severity. The response is the same as the response to an incident.

| Do | Do not |
|---|---|
| Separate the person from the defect: "the process allowed this" | "You should have known better" |
| Establish the facts before the meeting | Arrive with a conclusion |
| Ask what they would change about the process | Ask what they were thinking |
| Record the change so it does not recur | Record the mistake in their file |
| Tell them plainly what was serious | Soften it until they cannot tell |

**Blameless does not mean consequence-free.** It means the analysis of *why* it happened does not stop at a name. There may still be a conversation about performance, and it should be a different conversation from the technical review.

### Part 8 — Hiring well: running an interview that predicts performance

#### Structured interviewing, defined

**Structured interviewing** means asking every candidate for the same role the same set of questions, in the same order, and scoring them against a written rubric before discussing them with anyone else. It is the single most reliable improvement available to an interviewer, and the reason is not fairness alone — it is that unstructured interviews mostly measure how much the interviewer liked the candidate.

Three properties make an interview useful.

**A work sample.** Ask the candidate to do something close to the job. For a security analyst: here is a set of log lines, here is the severity scale, what is your severity and why. There is no better predictor available to you for a technical role.

**A scorecard completed before discussion.** Write your score immediately after the candidate leaves, before you talk to the other interviewer. The moment you discuss, you anchor, and independent judgement is gone.

**The same questions for everyone.** Not identical scripts read verbatim — but the same competencies assessed by the same core questions for every candidate, so that candidates can be compared on evidence.

#### The interview scorecard

| Competency | What it looks like when strong | Question | 1 — No evidence | 3 — Adequate | 5 — Strong | Score | Evidence |
|---|---|---|---|---|---|---|---|
| **Technical reasoning** | Explains a decision from evidence rather than pattern-matching | "Here are six log lines. What is your severity, and what would change it?" | Names a severity with no reason | Names a severity with one reason | Names a severity, states what would raise or lower it, and names what they would check next | | |
| **Handling uncertainty** | Says "I do not know" and names what they would do about it | "You have a memory image and the disk is gone. What can you not answer?" | Guesses confidently | Names one limitation | Names what memory can and cannot show, and what they would do to close the gap | | |
| **Writing** | Writes for the reader, not for themselves | "Here is a technical summary. Rewrite the first paragraph for a CFO." | Cannot simplify | Simplifies but loses accuracy | Simplifies, keeps the decision visible, and states the uncertainty | | |
| **Ownership** | Describes a failure they owned | "Tell me about a time you got something wrong. What did you change?" | Blames others or has no example | Names a mistake | Names a mistake, the consequence, and a change that outlived it | | |
| **Working with others** | Describes influencing someone who did not report to them | "Tell me about a time you needed something from someone who did not have to give it to you." | No example, or a coercion story | Names an example | Names the other person's incentive, and what they traded | | |
| **Curiosity** | Asks a question that shows they have thought about the work | "What would you want to know in your first month here?" | Asks only about pay or schedule | Asks about the team | Asks about a real problem the team has and how it is being addressed | | |

**The scoring discipline is the whole method.** Score every competency before discussing. Write the evidence in the box, not the score alone — a score with no evidence cannot be defended to a hiring manager, and it cannot be compared across interviewers.

#### What not to ask, and why

| Do not ask | Why | Ask instead |
|---|---|---|
| "Do you have children?" or plans for them | Not job-related, and it is discriminatory in effect | Nothing — it is not relevant |
| "Where are you originally from?" | Same | Nothing |
| "Are you planning to take leave soon?" | Same | "The role requires on-call. Is that workable for you?" |
| "What is your current salary?" | Anchors unfairly and may be unlawful where you are | "What range are you looking for?" |
| "How would you fix our vulnerability backlog?" | It is free consulting on a real problem | "Tell me about a backlog you have worked on. What made it move?" |
| "Would you say you are a perfectionist?" | Measures rehearsal, not anything real | A work-sample question |

**The free-consulting row is the one people break without noticing.** Asking a candidate to solve your actual, current problem is a way of getting unpaid work and it also produces a useless comparison, because you cannot score candidates against each other when each one was given a different piece of your real estate.

#### The common failure in hiring

**Common failure.** Choosing the candidate who is most confident, most similar to the existing team, and best able to talk fluently about technology — and calling that a culture fit.

| What it looks like | What it actually measures | The consequence |
|---|---|---|
| "They just seemed to get it" | Rapport with you | A team that agrees with itself and misses what it does not already believe |
| "They knew the tool we use" | Familiarity, which takes a week to acquire | A hire who plateaus because nobody tested reasoning |
| "They were the strongest communicator" | Confidence, which is not the same as clarity | Someone who presents well and writes badly |
| "They would fit right in" | Similarity to the current team | A team with a shared blind spot that no one can name |
| "They had all the certifications" | Exam-taking, which correlates weakly with the job | A hire who has not demonstrated any of the actual work |

**A work-sample question fixes most of these**, because confidence does not survive a task. The candidate who talks well but cannot reason from six log lines becomes visible in about four minutes.

### Part 9 — Runbooks, ethics, and what you owe the job

#### The runbook

A **runbook** is a written procedure for a specific operational task, written so that someone who did not write it can execute it correctly, under stress, without contacting the author. The test of a runbook is not whether it is accurate. It is whether **someone else can follow it at 3am while the service is down and the author is asleep.**

| Element | What it contains | Why it is there |
|---|---|---|
| **Trigger** | What causes this runbook to be used, stated as a condition | Prevents it being used for the wrong scenario |
| **Scope** | What it covers and what it explicitly does not | Prevents partial application to a similar-looking problem |
| **Preconditions** | What must be true before step 1 | Stops a step-by-step that cannot be executed |
| **Access required** | Which accounts, which systems, how to get them | The 3am failure is usually an access problem |
| **Steps** | Numbered, with the exact command and the expected output | The expected output is what makes a step verifiable |
| **Decision points** | "If X, do this; if Y, do that" | Removes judgement from a stressed reader |
| **Verification** | How you know it worked | Prevents premature closure |
| **Rollback** | How to undo it | The step everyone forgets until they need it |
| **Escalation** | Who to call, when, and with what information | The step that must exist even if never used |
| **Revision history** | Who changed what, and when | A runbook without a history is a rumour |

```text
RUNBOOK — RB-014
Suspected phishing report: triage, block, and close-out

TRIGGER
A user forwards a suspicious email to the phishing report mailbox, or a
phishing simulation report is received from the awareness platform.

SCOPE
Covers inbound email delivered to a corporate mailbox that a user reports as
suspicious. Does NOT cover: credential theft already confirmed (see RB-002,
compromised account), or messages delivered to external recipients.

PRECONDITIONS
  - You have access to the phishing report mailbox.
  - You have the mail security console open and can create a block rule.
  - You have the ticketing system open.

ACCESS REQUIRED
  Mail security console: role "Security Analyst". Request via the IT portal
  if not present — allow 4 hours during business hours; if out of hours and
  the console is unavailable, go to ESCALATION.

DECISION POINT 0 — Is anyone already compromised?
  If any recipient has clicked and entered credentials, STOP THIS RUNBOOK.
  Go to RB-002 and treat this as a compromised account.

STEPS
  1. Open the reported message. Record the sender address, the subject, the
     received time, and the message ID in the ticket.
     Expected: a ticket exists with all four fields populated.

  2. Check the URL or attachment without clicking. Use the sandbox detonation
     link in the console, never the live link.
     Expected: a verdict of malicious, suspicious, or clean, with a
     timestamped report URL.

  3. Query the mail security console for all recipients of the same message
     ID and for the sender address across the last 30 days.
     Expected: a count of recipients. Record it. If the count is above 50,
     notify the SOC Lead before proceeding — a bulk campaign is a different
     response.

  4. If the verdict is malicious or suspicious, create a block rule for the
     sender domain and for the URL or file hash.
     Expected: the console confirms the rule is active, with a rule ID.
     Record the rule ID in the ticket.

  5. Check whether any recipient interacted: clicked, replied, or forwarded.
     Expected: a list of addresses, or an explicit "none" recorded in the
     ticket. Do not leave this field blank.

  6. If any recipient clicked, raise an incident and notify the SOC Lead.
     Do not contact the user by email — call them on a number from the
     directory.
     Expected: an incident ID exists, linked to this ticket.

  7. Reply to the reporter within 4 working hours. Use the standard template.
     Do not state the verdict if it is "suspicious and under analysis".
     Expected: a sent reply, recorded on the ticket.

VERIFICATION
  - The block rule is active and its rule ID is on the ticket.
  - The recipient count is recorded.
  - The interaction check is recorded, including when the answer is "none".
  - The reporter has received a reply or the reply is scheduled and noted.

ROLLBACK
  Removing a block rule requires SOC Lead approval. False-positive blocks
  have blocked legitimate business mail twice in the last year. If a block
  rule is found to be catching legitimate mail, disable it, record the
  reason, and notify the SOC Lead within the hour.

ESCALATION
  SOC Lead — directory number, out of hours via the on-call rota.
  Escalate immediately if: a recipient has entered credentials; the
  recipient count exceeds 50; the console is unavailable; or you are unsure.
  Escalating unnecessarily costs nothing. Not escalating costs an incident.

REVISION HISTORY
  2026-02-11  v1.0  <author>   Created from the January phishing cluster.
  2026-03-04  v1.1  <author>   Added step 5 after a click was missed.
  2026-04-22  v1.2  <author>   Added the rollback section after a false
                               positive blocked a supplier's invoices.
```

**The revision history at the bottom is the section that proves the runbook is alive.** A runbook that has never been revised has either never been used or never been reviewed. Both are problems.

**Test a runbook by having someone else run it**, and watch without helping. Every place they hesitate is a defect in the document, not in them. Record the hesitations verbatim; "I did not know which console they meant in step 3" is a fixable defect and a valuable piece of evidence that your documentation works.

#### The ethics of the job

This is a phase about influence, and influence has an ethics, because the same skills that get a good control funded can get a bad one funded.

| Situation | The pull | What the job requires |
|---|---|---|
| A metric that would look better with a narrower denominator | Redefine the scope | Change it only through the reviewed definition process, and record the change |
| A risk you believe is unacceptable, accepted by someone senior | Escalate repeatedly until it changes | Record your dissent, escalate once through the defined route, and then support the decision |
| An incident that is embarrassing to your team | Emphasise the detection | Report the detection gap, including when the gap was yours |
| A vendor who offers a conference trip during an evaluation | Accept, because it is normal in the industry | Decline, or disclose it in writing to your manager |
| A request to look at a colleague's mailbox "informally" | Do it, because you have the access | Ask for the authorisation in writing, and route it to whoever grants it |
| A test you could run against a third party to prove a point | Run it quietly | Get written authorisation or do not run it |
| A finding that makes your predecessor look bad | Say nothing, or say everything | State the finding and the date it became possible to know, and leave the motive out |
| A junior who will be blamed for a process failure | Let it land on them | Say plainly that the process allowed it, in the meeting where it matters |

**The honesty-in-metrics row is the most important one**, because it is the one that is never caught immediately. A programme that reports comfortable numbers for two years and then fails an audit has not had a reporting problem; it has had a governance problem, and the person who wrote the reports is part of it.

**Refusing safely.** When you are asked to do something you should not, the useful response is not a lecture. It is: state what you can do instead, and put the request in writing.

| Do not say | Say |
|---|---|
| "That would be unethical." | "I can do that with written authorisation from the data owner. Who should I ask?" |
| "I am not comfortable with that." | "I can give you the aggregate numbers today, and the per-user breakdown once the privacy review is complete." |
| "You cannot ask me to do that." | "I can do it, and I need the request in an email so the authorisation is recorded. Here is the format." |
| "That is a compliance violation." | "The control requires a documented exception. I can draft the exception memo today." |

Each of those replies converts a confrontation into a process step, and a process step is much harder to override than a person's discomfort.

**What you owe the job.** Honest numbers. Documented decisions. The names of the people who helped. A junior who can do more in a year than they could when they arrived. A runbook that works without you. And a clear record of the risks you flagged that were accepted, so that when someone asks in three years why nobody saw it coming, the answer is in the repository.

### Key takeaways

- **A metric is a number that changes a decision; a vanity metric is a number that makes the programme look good.** The test: could it improve while the organisation gets less safe, and would anyone change what they are doing this week if it halved?
- **Every metric needs nine fields before it is published** — name, question, definition, numerator, denominator, statistic, source, owner, and thresholds. A metric with no denominator cannot go down, and a metric with no owner cannot be fixed.
- **Report the median and the p90, and never average a distribution you have not looked at.** A mean of 22.8 days across values of 3 to 180 describes nobody's experience and hides the outlier that matters.
- **State a regression in the first five lines, before the explanation.** `Direction: worse` comes before `what changed`, because sequencing explanation before fact reads as an excuse.
- **Bottom line up front.** Executives read for the decision, the cost, the risk, the date, and the owner. If those are not in the first paragraph, the document is in the wrong order — not too long.
- **Always include the do-nothing option, with a cost and a downside.** A reader comparing two spends is choosing between costs. A reader comparing a spend against an exposure is making a decision about risk.
- **Quantify with ranges and state the basis.** A single-point annualised loss expectancy invites a fight about precision; a range invites a useful argument about assumptions.
- **The person who accepts the risk must be able to authorise the money that would fix it.** A signature from someone who cannot fund the fix is worthless, and presenting it to an auditor is worse than having no memo.
- **Risk acceptance is time-boxed.** Every memo carries an expiry date and a review trigger, and an acceptance with no expiry is a permanent decision made by someone who may leave.
- **Influence without authority has five sources** — expertise, reciprocity, legitimacy, incentives, and escalation. Build on incentives, because an agreement that serves the other person's own objectives is the only kind that holds.
- **A control-owner relationship needs three things:** a written agreement naming what "operating correctly" means, a standing cadence, and a RACI with no blank accountable cells.
- **Mentoring fails through over-helpfulness, not neglect.** Never take the keyboard. The moment you do their work because the deadline is close, you have taught them that handing it to you is the way work gets done.
- **Score every interview before you discuss it.** The moment you talk to the other interviewer you have anchored, and independent judgement is gone. Ask every candidate the same core questions and use a work sample.
- **A runbook is tested by having someone else run it while you watch and do not help.** Every hesitation is a defect in the document, and the revision history is what proves it is alive.
- **Refuse by converting the request into a process step.** "I can do that with written authorisation — who should I ask?" is much harder to override than a statement of personal discomfort.

### Practice this next

The twelve tasks build toward one artefact: a programme pack for a control gap you genuinely own, carried from measurement through to a funded action. The order matters — you cannot write the business case before you have the metric, and you cannot mentor anyone before you have something worth handing over.

1. **Audit your own dashboard for vanity metrics** (task 1). Take the report your team currently produces and apply the three tests in Part 1 to every panel. Cut or rewrite each one that fails.
2. **Write the metric register** (task 2) for the control area you own, using the twelve-row shape in Part 2. Every row needs a numerator, a denominator, a source, an owner, and a threshold.
3. **Publish the dashboard definition file** (task 3) as YAML in version control, with a `known_limitations` field on every metric. This is the file that makes the dashboard defensible.
4. **Write one metric movement note** (task 4) for a number that got worse. Real or reconstructed. Lead with the direction, then the cause, then the action.
5. **Write the one-page brief** (task 5) for a decision that is actually pending at your workplace, and send it three days before the meeting. Rewrite it twice — the third draft is the one that fits on a page.
6. **Build the business case** (task 6) with four options including do-nothing, costs as ranges, and a named decision owner. Find out when the budget cycle closes before you write the deadline.
7. **Negotiate the control-owner agreement** (task 7) with one real control owner, using the three-part structure in Part 5 (agreement, cadence, RACI). Get it agreed, not just written.
8. **Write the risk-acceptance memo** (task 8) for a gap you cannot close immediately, and get it signed by someone with the authority to fund the fix. If nobody with that authority will sign, that is the finding.
9. **Write the mentoring plan** (task 9) for a junior you actually work with, with two goals, five growth tasks, and an explicit `will not do` list.
10. **Write the interview scorecard** (task 10) for a role on your team — six competencies, three questions, and a five-point scale with evidence boxes — then run one practice interview with a colleague and score it independently.
11. **Write the runbook** (task 11) for a task you currently do from memory, then have someone else execute it while you watch without helping. Record every hesitation verbatim.
12. **Write the ethical-boundary note** (task 12) covering metrics you would not change, requests you would route rather than answer, and the two or three lines you will not cross. Keep it short and keep it somewhere you can find it.

Then open `portfolio/advance/06-programme-and-influence.md` and assemble the deliverables. **The phase is done when you have carried one real control gap from a number on a dashboard to a dated, owned, funded action — and when someone else can execute one of your processes without asking you how.**

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| LibreOffice Calc | Spreadsheet for the metric register and the dashboard | Free/open-source | https://www.libreoffice.org/ | Build the KPI/KRI register with a RAG formula driven by the threshold columns | Google Sheets |
| Google Sheets | Shared spreadsheet several people can update | Free | https://sheets.google.com/ | Publish a read-only dashboard tab for one stakeholder and check it renders on a phone | LibreOffice Calc |
| GitHub Issues | Tracks programme actions, control gaps, and owners | Free | https://github.com/features/issues | Open one issue per control gap with an owner, a due date, and a label | GitLab Issues |
| Jira | Workflow tracking for control-owner requests and SLAs | Freemium | https://www.atlassian.com/software/jira | Model one control-owner request as a ticket with a due date and an assignee | GitHub Issues |
| Confluence | Wiki for runbooks, agreements, and programme documentation | Freemium | https://www.atlassian.com/software/confluence | Publish the runbook and give a colleague edit access, then watch where they get stuck | HedgeDoc, or Markdown committed to a Git repository |
| HedgeDoc | Collaborative Markdown writing for briefs and memos | Free/open-source | https://hedgedoc.org/ | Co-author the one-page brief live with the person who will present it | Markdown in a Git repository |
| diagrams.net | Draws the RACI, the programme roadmap, and the escalation path | Free/open-source | https://www.drawio.com/ | Draw the control-owner RACI for one control and check every row has an accountable cell | Mermaid |
| Mermaid | Text-defined diagrams that live in version control and review like code | Free/open-source | https://mermaid.js.org/ | Render the programme roadmap from a Mermaid block in the repository | diagrams.net |
| NIST Cybersecurity Framework 2.0 | Shared vocabulary for programme functions and outcomes | Free | https://www.nist.gov/cyberframework | Map your existing controls to the six CSF functions and name the emptiest one | CIS Critical Security Controls |
| CIS Critical Security Controls | Prioritised control set with implementation groups, useful for scoping a first programme | Free | https://www.cisecurity.org/controls | Score your estate against Implementation Group 1 and list the gaps with owners | NIST Cybersecurity Framework 2.0 |

## Free/cheap resources

- NIST Cybersecurity Framework 2.0 — https://www.nist.gov/cyberframework
- NIST SP 800-30 Rev. 1, Guide for Conducting Risk Assessments — https://csrc.nist.gov/pubs/sp/800/30/r1/final
- NIST SP 800-39, Managing Information Security Risk — https://csrc.nist.gov/pubs/sp/800/39/final
- NIST SP 800-50 Rev. 1, Building an IT Security Awareness and Training Program — https://csrc.nist.gov/pubs/sp/800/50/r1/final
- NIST SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management — https://csrc.nist.gov/pubs/sp/800/61/r3/final
- CIS Critical Security Controls — https://www.cisecurity.org/controls
- OWASP Risk Rating Methodology — https://owasp.org/www-community/OWASP_Risk_Rating_Methodology
- OWASP Security Culture project — https://owasp.org/www-project-security-culture/
- FAIR Institute, What is FAIR — https://www.fairinstitute.org/what-is-fair
- FIRST CVSS specification — https://www.first.org/cvss/
- Google SRE Book — https://sre.google/sre-book/table-of-contents/
- PagerDuty Incident Response, Writing Runbooks — https://response.pagerduty.com/before/runbooks/
- Google re:Work, Use Structured Interviewing — https://rework.withgoogle.com/guides/hiring-use-structured-interviewing/steps/introduction/
- The Manager's Handbook — https://themanagershandbook.com/
- Google Technical Writing course — https://developers.google.com/tech-writing
- Plain English Campaign, How to write in plain English — https://www.plainenglish.co.uk/how-to-write-in-plain-english.html
- GOV.UK content design guidance — https://www.gov.uk/guidance/content-design
- CISO Series podcast — https://cisoseries.com/
- Data Privacy Act of 2012, Philippines — https://privacy.gov.ph/data-privacy-act/

## Hands-on practice tasks

1. Audit the report your team currently produces and apply the three vanity-metric tests to every panel. <!-- id: advance-06-t01 band: focused energy: normal -->
2. Write the full metric register for the control area you own, twelve rows, with numerator, denominator, source, owner, and thresholds. <!-- id: advance-06-t02 band: deep energy: high -->
3. Publish the dashboard definition as a YAML file in version control, with a `known_limitations` field on every metric. <!-- id: advance-06-t03 band: focused energy: normal -->
4. Write a metric movement note for a number that got worse, leading with the direction before the cause. <!-- id: advance-06-t04 band: quick energy: low -->
5. Write a one-page executive brief for a pending decision, rewrite it twice, and send it three days before the meeting. <!-- id: advance-06-t05 band: deep energy: high -->
6. Build a business case with four options including do-nothing, ranges for cost, and a named decision owner. <!-- id: advance-06-t06 band: deep energy: high -->
7. Negotiate and sign a control-owner agreement for one control, using the three-part structure from Part 5 (agreement, cadence, RACI). <!-- id: advance-06-t07 band: focused energy: normal -->
8. Write a risk-acceptance memo for a gap you cannot close now, and get it signed by someone who can fund the fix. <!-- id: advance-06-t08 band: deep energy: high -->
9. Write a twelve-week mentoring plan for a junior you work with, including an explicit `will not do` list. <!-- id: advance-06-t09 band: focused energy: normal -->
10. Write an interview scorecard for a role on your team and run one practice interview, scoring it independently. <!-- id: advance-06-t10 band: focused energy: normal -->
11. Write a runbook for a task you do from memory, then have someone else run it while you watch and do not help. <!-- id: advance-06-t11 band: deep energy: high -->
12. Write a short ethical-boundary note: metrics you will not redefine, requests you route rather than answer, and your lines. <!-- id: advance-06-t12 band: quick energy: low -->

## Deliverable / proof of work

Create `portfolio/advance/06-programme-and-influence.md` with:

- A vanity-metric audit of your current reporting, with the rewrite for each panel that failed
- A twelve-row metric register with numerator, denominator, source, owner, cadence, and thresholds
- The YAML dashboard definition file, including a `known_limitations` field on every metric
- One metric movement note for a number that moved in the wrong direction
- A one-page executive brief, with the first and third drafts shown side by side
- A business case with four options including do-nothing, cost ranges, and a named decision owner
- A signed control-owner agreement with an agreed cadence and a RACI
- A signed risk-acceptance memo with an expiry date and compensating measures
- A twelve-week mentoring plan with two goals, five growth tasks, and a `will not do` list
- An interview scorecard with six competencies and a practice interview scored on it
- A runbook, plus the record of a second person executing it and where they hesitated
- The ethical-boundary note

## Checklist

- [ ] I can explain the difference between a metric and a vanity metric without notes. <!-- id: advance-06-metric-vs-vanity energy: low -->
- [ ] I rewrote every panel on my team's report that failed the three vanity tests. <!-- id: advance-06-vanity-audit energy: normal -->
- [ ] I wrote a metric register where every row has a denominator, a source, and a threshold. <!-- id: advance-06-metric-register energy: normal -->
- [ ] I published the dashboard definition as a versioned file with known limitations. <!-- id: advance-06-dashboard-definition energy: normal -->
- [ ] I reported a metric that got worse, leading with the direction rather than the excuse. <!-- id: advance-06-regression-report energy: normal -->
- [ ] I wrote a one-page brief that fits on one page after three drafts. <!-- id: advance-06-executive-brief energy: high -->
- [ ] I built a business case that includes the do-nothing option with a stated cost. <!-- id: advance-06-business-case energy: high -->
- [ ] I found out when the budget cycle closes before setting a decision deadline. <!-- id: advance-06-budget-cycle energy: low -->
- [ ] I got a control-owner agreement signed, with a cadence and a RACI. <!-- id: advance-06-control-owner energy: normal -->
- [ ] I got a risk-acceptance memo signed by someone who could have funded the fix. <!-- id: advance-06-risk-acceptance energy: high -->
- [ ] I set an expiry date on the risk acceptance rather than leaving it open. <!-- id: advance-06-acceptance-expiry energy: low -->
- [ ] I wrote a mentoring plan with success measures and a `will not do` list. <!-- id: advance-06-mentoring-plan energy: normal -->
- [ ] I mentored without taking the keyboard, including when it would have been faster. <!-- id: advance-06-no-keyboard energy: normal -->
- [ ] I wrote an interview scorecard and scored a candidate before discussing them. <!-- id: advance-06-interview-scorecard energy: normal -->
- [ ] I watched someone else run my runbook and recorded every hesitation verbatim. <!-- id: advance-06-runbook-test energy: normal -->
- [ ] I wrote down the lines I will not cross and how I refuse a request safely. <!-- id: advance-06-ethical-boundaries energy: low -->

## You're ready to move on when...

You have carried one real control gap from a number on a dashboard to a dated, owned, funded action — with a signed risk acceptance covering the gap in the meantime, a control owner who has agreed to run it, a junior who is growing into part of it, and a runbook someone else has executed without you.

## Free vs Paid

### What's free and enough

Every artefact in this phase is a document, a spreadsheet, or a conversation, and none of them requires a licence. LibreOffice Calc or Google Sheets carries the metric register and the dashboard; GitHub Issues or GitLab Issues carries the action tracker; a Markdown file in the repository carries the brief, the memo, the mentoring plan, and the runbook. NIST CSF 2.0, the CIS Controls, NIST SP 800-30 and SP 800-39, the OWASP Risk Rating Methodology, and the FAIR Institute's public material are the actual frameworks practitioners work from, and all of them are free to read. Google's technical writing course and the Plain English Campaign guide are free and will improve your briefs more than any tool will.

### What's paid and why you'd upgrade

Dedicated GRC platforms such as ServiceNow GRC, Archer, or OneTrust replace the spreadsheet register with workflow, evidence collection, control testing, and audit trails that survive a regulator's questions. Continuous control-monitoring products automate the evidence collection that a spreadsheet relies on someone remembering. Enterprise communication coaching and executive presence training exist and are usually employer-funded. Paid interviewing and hiring courses are widely available and are almost entirely unnecessary, because the free structured-interviewing guidance from Google re:Work covers the method.

### When it's worth paying

Pay when an organisation is large enough that a spreadsheet register becomes the bottleneck — typically when the register passes a few hundred risks with multiple owners, or when an external auditor requires a tamper-evident evidence trail. Pay when a regulator or a certification body requires a maintained GRC system as a condition. Do not pay for any of it while you are building the skill: the artefacts are the skill, and a spreadsheet register you wrote and can defend line by line teaches you far more than a platform you configured from a template. If you later move into a programme or GRC role, the employer will buy the platform, and you will be productive on it in a fortnight because you already understand the register underneath it.