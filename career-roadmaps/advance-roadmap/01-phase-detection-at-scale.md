---
id: advance-01-detection-at-scale
track: advance
phase: 1
order: 10
title: "Phase 1 — Detection Engineering at Scale"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/advance/01-detection-at-scale.md"
exit_criteria: "You can own a detection library: write and review rules to a standard, measure their false-positive cost, map coverage honestly including the gaps, and retire what no longer earns its place."
---

# Phase 1 — Detection Engineering at Scale

## Goal of this phase

Move from working the alert queue to owning the rules that fill it: writing and reviewing detections to a shared standard, measuring what each one costs in analyst time, mapping coverage against ATT&CK including the parts you cannot see, and retiring what no longer earns its place.

## Estimated time

**6 weeks** at about 8–11 focused hours a week. Roughly 48–66 hours, and most of it is spent tuning and reviewing rather than writing new rules.

## Skills you'll gain

- Write a detection rule in a vendor-neutral format and convert it to your platform's query language.
- Keep rules in version control with a lifecycle status, an owner, and a change history.
- Review someone else's rule against a written standard and give a decision, not an opinion.
- Compute what a noisy rule costs in analyst hours and money per month, and present the number.
- Treat alert volume as a budget and show where triage capacity is being spent.
- Build a coverage map against MITRE ATT&CK that states its gaps rather than hiding them.
- Identify the telemetry a detection needs, and say plainly when it is not available.
- Decide deliberately between tuning, suppressing, and retiring a rule, and write the decision down.
- Test a rule against known-good and known-bad samples before it reaches production.
- Write a coverage summary a manager can read in two minutes and act on.

## Specific topics to learn

- Detection as code: rules in Git, peer review, pull requests, and a changelog
- The Sigma rule format: `logsource`, `detection`, `selection`, `condition`, and field modifiers such as `|contains`, `|endswith`, `|re`
- Rule conversion with `sigma-cli` to Splunk SPL and to KQL
- The rule review standard: what a reviewer checks before approving
- Rule metadata: id, status, level, owner, ATT&CK tags, false-positive notes, and a test reference
- False-positive economics: cost per alert, cost per true positive, and the loaded hourly cost of an analyst
- Alert volume as a budget: alerts per analyst per shift, and the triage capacity calculation
- Telemetry prerequisites: process creation, command-line auditing, script-block logging, DNS, proxy, and authentication logs
- Coverage measurement with MITRE ATT&CK and the ATT&CK Navigator
- The difference between coverage, visibility, and detection — and why a green square can be a lie
- Tuning a rule: narrowing the selection, adding exclusions, and raising the threshold
- Suppression: allowlists, scheduled suppressions, and the risk of a permanent blind spot
- Retirement: when a rule has stopped earning its maintenance cost
- Rule lifecycle states and the promotion criteria between them
- Testing before shipping: unit tests with good and bad samples, historical replay, and atomic tests
- The alerting and detection strategy document
- Writing a coverage map for a manager, and for an auditor

## Lesson: Owning a Detection Library Is a Different Job From Writing Rules

### Why this lesson exists

Writing a rule is a task. Owning a library of them is a job, and the two require different skills.

When you work a queue, your success is measured by how well you handle what arrives. When you own the rules that fill the queue, your success is measured by whether the right things arrive at all, whether they arrive at a rate a human can process, and whether anyone can explain why each rule exists. Those are not the same measurement, and the habits that make a good analyst do not automatically make a good detection owner.

This is the first phase of this track, so it assumes only what your job has already taught you. You can read a log line. You can triage an alert. You can write a ticket that another person understands. Everything below builds on that and nothing more.

**The problem this phase solves** is easiest to see in a number. A rule that fires 1,200 times a month and is right nine times consumes roughly one analyst's entire working day, every day, forever. Nobody decided that. It accumulated. The rule was written once, in an afternoon, by someone who has since changed teams, and it has been quietly spending the team's capacity ever since.

| What a rule costs when nobody owns it | What it costs when someone does |
|---|---|
| Written once, never revisited | Reviewed on a schedule, with a recorded decision |
| Fires at a rate nobody measured | Fires at a rate someone chose |
| False positives absorbed silently by analysts | False-positive cost stated in hours and money |
| Coverage claimed but never tested | Coverage measured, gaps named |
| Retired only when the platform is replaced | Retired when the cost exceeds the value |

The gap between those two columns is the whole phase.

#### What this phase is not

It is not a phase about writing clever queries. Query syntax is the easy part and it is documented thoroughly by the vendors. The hard parts are judgement — is this rule worth its cost, is this coverage real, is this suppression hiding a genuine gap — and judgement is what this lesson teaches.

It is also not a phase about buying a detection platform. Every technique here works with a free tier, a home lab, or a text editor and Git. The tooling is the least interesting variable.

#### The exit criterion, unpacked

The exit criterion names four capabilities, and each one is a distinct skill.

| Requirement | The skill underneath it |
|---|---|
| **Write and review rules to a standard** | Precision in writing, and the discipline to reject your own work |
| **Measure their false-positive cost** | Arithmetic and honesty about what you already know |
| **Map coverage honestly including the gaps** | Resisting the pressure to colour in a matrix |
| **Retire what no longer earns its place** | Deleting work you or a colleague did, with a reason |

The fourth one is the one people find hardest, and it is the one that separates a library from an archive. A detection library with 900 rules and no retirement process is not a strong library. It is a cost centre with good marketing.

### Part 1 — Detection as code: rules are software, and software has versions

#### Why version control is the foundation

Detection as code means treating a rule the way you treat any other piece of logic that runs in production: it lives in a repository, it has an owner, it changes through a review, and its history is readable.

The reason is not tidiness. It is that a detection rule is a decision that affects other people, and decisions that affect other people need a record.

| Without version control | With version control |
|---|---|
| “Why does this rule exclude `svchost.exe`?” — nobody knows | The commit message says why, and links the ticket |
| A rule is edited during an incident and never reverted | The temporary change is a commit, visible and revertable |
| Two analysts write the same detection differently | The duplicate is caught in review |
| A regulator asks when a control changed | `git log` answers in seconds |
| A rule breaks after a platform upgrade | The change is one commit away from being understood |

That last row is the one people discover the hard way. Detection platforms change their field names and their ingestion pipelines. When a rule stops firing, the difference between a ten-minute fix and a two-day investigation is whether the previous working version is in Git.

#### A repository layout that survives contact with reality

There is no single correct structure, but the one below is close to what most detection teams converge on, and it separates three things that are frequently tangled: the rules, the tests, and the metadata.

```text
detections/
├── rules/
│   ├── windows/
│   │   ├── process_creation/
│   │   │   └── proc_encoded_powershell.yml
│   │   └── registry/
│   ├── linux/
│   └── cloud/
├── tests/
│   ├── samples/
│   │   ├── proc_encoded_powershell.true.json
│   │   └── proc_encoded_powershell.false.json
│   └── run_tests.py
├── mappings/
│   └── coverage.yaml
├── docs/
│   └── review-standard.md
└── README.md
```

The `rules/` tree is organised by **telemetry source**, not by threat actor or by severity. This matters more than it looks. When you need to know “what do we detect from cloud audit logs”, you open one folder. When you organise by threat actor, the same question means reading everything.

`tests/samples/` holds the evidence that a rule works: one JSON file that the rule must match, and one that it must not. This is a unit test, and Part 8 covers it properly.

#### What a rule actually contains

A rule is a selection over a log source plus a decision about what to do when it matches. That is all. The rest is metadata that exists so a human can review it later.

Here is a complete Sigma rule. Sigma is a vendor-neutral detection format: you write the rule once and convert it into the query language of whichever platform you run.

```yaml
title: PowerShell Encoded Command Execution
id: 6c1a3f0e-6a5a-4c2f-9c2e-0d4d8b9e2a11
status: experimental
description: >
  Detects PowerShell or pwsh launched with an encoded command parameter.
  Encoded commands are a normal administrative technique and a very common
  loader pattern, so this rule is deliberately noisy and is intended as a
  hunting input rather than a paging alert.
references:
  - https://attack.mitre.org/techniques/T1059/001/
  - https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_powershell_exe
author: Your Name
date: 2026/03/14
modified: 2026/03/14
logsource:
  category: process_creation
  product: windows
detection:
  selection_image:
    - Image|endswith:
        - '\powershell.exe'
        - '\pwsh.exe'
  selection_encoded:
    CommandLine|contains:
      - '-encodedcommand'
      - '-enc '
      - '-ec '
  condition: selection_image and selection_encoded
fields:
  - CommandLine
  - ParentImage
  - ParentCommandLine
  - User
  - Image
falsepositives:
  - Software deployment and configuration management tools
  - Scheduled tasks created by administrative scripts
  - Some endpoint management agents
level: low
tags:
  - attack.execution
  - attack.t1059.001
```

Read the parts of that file that are not the detection, because those are the parts that get skipped and matter most.

| Field | What it is for | What goes wrong when it is missing |
|---|---|---|
| `id` | A stable UUID for this rule, forever | You cannot reference the rule in a ticket or a suppression request |
| `status` | Where the rule sits in its lifecycle | Nobody knows whether it is safe to depend on |
| `description` | Why the rule exists, in prose | Reviewers guess, and guess wrong |
| `references` | The technique or the write-up it came from | The rule looks invented |
| `falsepositives` | Known benign causes | The first analyst to hit one thinks the rule is broken |
| `level` | How urgent a match is | Everything pages, or nothing does |
| `tags` | ATT&CK technique mapping | Coverage cannot be measured automatically |

`status: experimental` is doing real work in that rule. It is an honest statement that the rule has been written but not yet validated against production traffic. A rule that goes straight to production with no such stage is a rule nobody has agreed to live with.

#### The rule is not the whole artefact

A useful rule file also carries the operational information that a reviewer needs. Some teams put it in the front matter, some in a companion file. Either way, the fields are the same.

```yaml
# metadata.yaml — companion to proc_encoded_powershell.yml
rule_id: 6c1a3f0e-6a5a-4c2f-9c2e-0d4d8b9e2a11
owner: detection-engineering
created: 2026-03-14
review_due: 2026-09-14
lifecycle: experimental
telemetry_required:
  - Sysmon Event ID 1, or Windows Security Event ID 4688 with
    "Include command line in process creation events" enabled
deployment_targets:
  - splunk-prod
  - elastic-prod
known_false_positive_sources:
  - SCCM application deployment
  - Intune script packages
test_reference: tests/samples/proc_encoded_powershell.true.json
cost_baseline:
  measured_on: 2026-04-01
  alerts_per_30d: 1240
  true_positives_per_30d: 9
```

`review_due` is the field that keeps a library alive. A rule with no review date is a rule that will be discovered, years later, still firing, by someone who is trying to work out why their queue is full.

#### Committing a rule properly

```bash
# Create a branch. Never work directly on the main branch, even alone.
git switch -c det/add-encoded-powershell-rule

# Add the rule and its test samples.
git add rules/windows/process_creation/proc_encoded_powershell.yml
git add tests/samples/proc_encoded_powershell.true.json
git add tests/samples/proc_encoded_powershell.false.json

# The commit message names the technique and the reason. Not "add rule".
git commit -m "det: add T1059.001 encoded PowerShell process creation rule

Addresses the detection gap found in INC-2026-0314-01, where a macro
spawned an encoded PowerShell command and no rule existed for it.
Status is experimental pending a 30-day replay against production data."

# Open the review, even if the reviewer is you.
git push -u origin det/add-encoded-powershell-rule
```

Two habits in that block are worth naming.

**The branch exists even when you are the only person on the team.** A branch is a record that this change was considered separately from everything else, and it makes the diff readable.

**The commit message names the reason.** “Add rule” tells a future reader nothing. “Addresses the detection gap found in INC-2026-0314-01” tells them exactly which incident justified the rule, which is the thing they will want to know when they are deciding whether to retire it.

### Part 2 — The rule review standard

#### Why a standard beats a senior reviewer's taste

Every detection team eventually faces the same problem: two reviewers approve different rules for contradictory reasons, and the library drifts. The fix is a written standard that says what gets checked, so that a decision can be argued against the standard rather than against a person.

A review standard is not bureaucracy. It is what lets a junior engineer reject a senior engineer's rule without it being a personal matter.

#### What a reviewer checks

| # | Check | The question behind it | Reject if |
|---|---|---|---|
| 1 | **Purpose** | What behaviour does this detect, and why does it matter? | The description restates the query |
| 2 | **Telemetry** | Is the required log source ingested, parsed, and retained? | It depends on a source that is not collected |
| 3 | **Precision** | What benign activity will match this? | The `falsepositives` list is empty and the rule is broad |
| 4 | **Field correctness** | Do the field names exist in this platform? | The rule uses a field that is not indexed |
| 5 | **Condition logic** | Does the boolean logic do what the description says? | `and` should be `or`, or a modifier is wrong |
| 6 | **Severity** | Does `level` match the consequence of a true positive? | Everything is `critical` |
| 7 | **ATT&CK mapping** | Is the technique tag correct and specific? | The tag is a tactic, not a technique |
| 8 | **Test evidence** | Do the good and bad samples behave as required? | There are no samples |
| 9 | **Cost estimate** | What is the expected alert volume per month? | Nobody has looked |
| 10 | **Duplication** | Does an existing rule already cover this? | It does, and the new rule is a near-copy |
| 11 | **Owner and review date** | Who maintains this, and when is it next looked at? | Both are blank |
| 12 | **Response** | What should an analyst do when it fires? | No runbook or triage note exists |

Checks 3, 9, and 12 are the ones that a technically correct rule most often fails. A rule can be perfectly written and still be a bad rule, because it fires too often, costs too much, or gives the analyst nothing to do.

#### Writing the review as a decision

A review that ends in “looks good to me” has produced nothing. A review ends in one of four decisions, and each one carries an obligation.

| Decision | Meaning | What happens next |
|---|---|---|
| **Approve** | The rule meets the standard as written | Promoted to production, with a monitoring period |
| **Approve with conditions** | Meets the standard, but something must follow | A dated action is attached to the rule |
| **Return for changes** | A specific check failed | The author fixes it and resubmits |
| **Reject** | The detection is not worth its cost, or is already covered | The reasoning is recorded in the review |

```text
REVIEW RECORD

Rule              DET-014 PowerShell Encoded Command Execution
Reviewer          Your Name
Date              2026-03-20
Decision          Approve with conditions

Checks
  Purpose            pass
  Telemetry          pass — Sysmon Event ID 1 collected, 90-day retention
  Precision          FAIL — replay shows 1,240 matches in 30 days, 9 confirmed
  Field correctness  pass
  Condition logic    pass
  Severity           pass — level lowered from medium to low
  ATT&CK mapping     pass — T1059.001
  Test evidence      pass — samples match and do not match as required
  Cost estimate      FAIL — 253 analyst hours per month, roughly 1.6 FTE-months
  Duplication        pass — no overlap with DET-002 or DET-031
  Owner and review   pass — detection-engineering, review due 2026-09-20
  Response           pass — triage note attached

Conditions
  1. Deploy at level "low" and route to the hunting queue, not the
     paging queue, until the tuning work in condition 2 is done.
  2. Tune to reduce matches by at least 90% within 30 days, or move the
     rule to the suppression review in Part 7. Owner: Your Name. Due 2026-04-20.
  3. Re-measure the alert count after tuning and update cost_baseline.
```

Two things in that record are doing real work.

**A failed check does not automatically mean rejection.** The precision check failed on volume, not on logic, and the right answer was a routing change plus a dated commitment rather than a refusal. Reviewers who reject everything noisy end up with no detections.

**The conditions have owners and dates.** “Tune this later” is not a condition. “Reduce matches by 90% by 20 April, owner named” is.

#### The review standard as a document

The standard itself belongs in the repository, next to the rules, so it can be cited in a review.

```markdown
# Detection Rule Review Standard

A rule may be promoted to production when all twelve checks in
`docs/review-checklist.md` pass, or when every failed check carries a
dated condition with a named owner.

Minimum bar, regardless of the checks:

- The rule has a test sample that matches and one that does not.
- The required telemetry is confirmed present in production.
- The expected alert volume is estimated, even roughly.
- A triage note exists that tells the analyst what to do next.
- The rule is committed with a message naming the reason it exists.

A rule that cannot state its expected alert volume is not ready. An
unmeasured rule is a rule that will be measured later, by an analyst,
without warning.
```

That last paragraph is the sentence to keep. Most rules that become a problem were never unmeasured by choice — they were simply never measured at all.

#### Reviewing your own rule

When you are the only person available, review your own rule against the standard anyway, in writing, and date it.

This feels like theatre and it is not. Reviewing your own work against a checklist catches a specific class of error that writing never does: the assumption you did not notice you were making. The most common is assuming a field exists because it appears in a screenshot you saw six months ago.

### Part 3 — False-positive economics: what a noisy rule actually costs

#### The unit that matters is analyst minutes

A false positive is not an annoyance. It is a purchase, made with the most constrained resource the security team has: the attention of a trained person.

The unit to reason in is **minutes of analyst time per month**, converted to money. Not because the money is the point, but because “this rule costs 253 hours a month” is a sentence that changes behaviour and “this rule is noisy” is not.

| Input | Where it comes from | Typical value |
|---|---|---|
| **Minutes per false positive** | Time yourself triaging ten of them | 10–15 |
| **Minutes per true positive** | Time yourself on the last few | 45–120 |
| **Loaded hourly cost** | Finance, or an estimate | Use a defensible number and state it |
| **Alerts per month** | The platform's own count | Pull it, do not guess |

**Loaded cost** means the fully burdened cost of an hour of the analyst's time — salary, benefits, overhead — not take-home pay. If you cannot get a real figure, state your assumption explicitly in the write-up: “assuming a loaded cost of 38 currency units per hour, which is the figure we use for planning.” An assumption that is stated can be corrected. A number invented silently cannot.

#### Measuring, then computing

You cannot compute the cost without classifying the alerts. Every alert in the window needs an outcome: true positive, false positive, or undetermined. Most platforms already record this, because somebody closed the ticket.

```python
#!/usr/bin/env python3
"""Estimate the monthly cost of a detection rule from its alert history.

Reads a CSV exported from the ticketing or SIEM system with at least the
columns: rule_id, outcome. Computes the analyst time each rule consumes and
ranks rules by that cost, so tuning effort goes to the most expensive ones.
"""

import csv
from dataclasses import dataclass, field

MINUTES_PER_FALSE_POSITIVE = 12
MINUTES_PER_TRUE_POSITIVE = 45
LOADED_HOURLY_COST = 38.0
WORKING_HOURS_PER_MONTH = 160


@dataclass
class Tally:
    """Running totals for one rule."""
    total: int = 0
    true_positive: int = 0
    false_positive: int = 0
    undetermined: int = 0

    @property
    def false_positive_rate(self):
        return self.false_positive / self.total if self.total else 0.0

    @property
    def minutes(self):
        return (self.false_positive * MINUTES_PER_FALSE_POSITIVE
                + self.true_positive * MINUTES_PER_TRUE_POSITIVE)

    @property
    def cost(self):
        return self.minutes / 60 * LOADED_HOURLY_COST


def classify(outcome):
    """Map a ticket outcome string to tp, fp, or undetermined."""
    value = outcome.strip().lower()
    if value in {"true_positive", "true positive", "tp", "escalated"}:
        return "tp"
    if value in {"false_positive", "false positive", "fp", "benign"}:
        return "fp"
    return "undetermined"


def load(path):
    """Build {rule_id: Tally} from the exported CSV."""
    per_rule = {}
    with open(path, newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            tally = per_rule.setdefault(row["rule_id"], Tally())
            tally.total += 1
            verdict = classify(row["outcome"])
            if verdict == "tp":
                tally.true_positive += 1
            elif verdict == "fp":
                tally.false_positive += 1
            else:
                tally.undetermined += 1
    return per_rule


def report(per_rule):
    header = (f"{'rule':<12}{'alerts':>7}{'fp':>6}{'tp':>5}"
              f"{'undet':>6}{'fp_rate':>9}{'hours':>8}{'cost':>9}{'fte':>6}")
    print(header)
    print("-" * len(header))
    for rule_id, tally in sorted(
            per_rule.items(), key=lambda item: item[1].cost, reverse=True):
        print(f"{rule_id:<12}{tally.total:>7}{tally.false_positive:>6}"
              f"{tally.true_positive:>5}{tally.undetermined:>6}"
              f"{tally.false_positive_rate:>8.1%}"
              f"{tally.minutes / 60:>8.1f}{tally.cost:>9.0f}"
              f"{tally.minutes / 60 / WORKING_HOURS_PER_MONTH:>6.1f}")


if __name__ == "__main__":
    report(load("alerts.csv"))
```

The `fte` column is the one that ends arguments. It expresses the cost as a fraction of a full-time engineer, which is a unit a manager can compare against a hiring plan.

#### Worked example: the cost of one noisy rule

Here is a real-shaped case. The rule is a broad encoded-PowerShell detection, and the number comes from a thirty-day window.

| Measure | Value |
|---|---|
| Alerts in 30 days | 1,240 |
| Confirmed true positives | 9 |
| False positives | 1,231 |
| Undetermined | 0 |
| False-positive rate | 99.3% |
| Minutes per false positive | 12 |
| Minutes per true positive | 45 |
| Analyst minutes spent | 15,177 |
| Analyst hours spent | 253.0 |
| Loaded hourly cost | 38.00 |
| **Monthly cost** | **9,612** |
| Cost per alert | 7.75 |
| True-positive cost | 257 |
| Fraction of a full-time engineer | 1.58 |

Read those numbers as a manager would.

The rule costs **9,612 currency units a month** and consumes **1.58 full-time engineers**. Of the total spend, **2.7%** is spent on the nine things the rule is for. It is, in effect, a machine that turns 253 hours of skilled attention into nine investigations and 1,231 closed tickets.

| Cost per true positive | Verdict |
|---|---|
| Under 1 hour | Healthy — the rule pays for itself |
| 1–4 hours | Acceptable if the technique is high-impact |
| 4–20 hours | Needs tuning; track it |
| Over 20 hours | Tune, suppress, or retire — now |

At 253 hours for nine true positives, the cost per true positive is **28.1 analyst hours**. That is in the bottom band, and the answer is not “delete it”, because the technique it detects — encoded command execution — is genuinely high-impact. The answer is that the rule is currently a bad way to detect it, and Parts 6 and 7 cover the fix.

#### What the number does not capture

The arithmetic is honest but incomplete, and a good write-up says so.

| Hidden cost | Why it is hard to measure |
|---|---|
| **Alert fatigue** | Analysts who triage 60 near-identical false positives a day start closing real ones |
| **Loss of trust in the platform** | When most alerts are noise, the queue is treated as noise |
| **Missed true positives** | A real hit buried at position 400 in the queue may be closed unread |
| **Tuning opportunity cost** | Every hour on this rule is an hour not spent on a gap with no coverage at all |
| **Recruitment and retention** | Nobody stays long in a role that is mostly clearing false positives |

The second row is the one that hurts most over time, and it is invisible in the arithmetic. A queue that is 99% noise is a queue that people stop reading carefully, and the cost of that is not a number you can put in a spreadsheet. Say so in the write-up. “The measured cost is 9,612 per month; the unmeasured cost is that we have taught the team to skim” is a sentence that gets a rule fixed.

#### The cost of a *missing* rule

The arithmetic has a mirror image, and it is worth stating because it is used to justify bad rules.

| | Noisy rule | No rule |
|---|---|---|
| Cost | Measurable, recurring, visible | Unmeasured until something happens |
| Who pays | The security team, every day | The business, eventually |
| Fix | Tune, suppress, retire | Write, test, deploy |

Both are real problems. The mistake is to keep a rule that costs 253 hours a month because *something* might be missed, when the same 253 hours could build three precise rules that cover the same technique properly. Cost is not a reason to have no detection. It is a reason to have a better one.

### Part 4 — Alert volume and triage capacity as a budget

#### Capacity is finite and it is already allocated

Every security team has a triage budget, whether or not anyone has written it down. The budget is analyst minutes per day, and it is fixed by headcount. Rules spend from it. There is no overdraft.

| Step | Calculation | Example |
|---|---|---|
| Shift length | Hours in a shift | 8 hours |
| Minutes available | Hours × 60 | 480 minutes |
| Productive share | Time not in meetings, handover, admin | 60% |
| Usable minutes | 480 × 0.60 | 288 minutes |
| Minutes per alert | Median triage time | 10 minutes |
| **Alerts per analyst per shift** | 288 ÷ 10 | **28.8** |

Twenty-eight alerts per analyst per shift is a comfortable queue. It leaves room for the alert that turns into two hours of work, and it leaves room for the incident that eats the afternoon.

At **40 alerts per analyst per shift**, the queue is tight but survivable. At **60**, the team is triaging and nothing else — no hunting, no tuning, no detection work, no documentation. The moment that happens, the library stops improving, because the people who would improve it are all in the queue.

#### Where the capacity actually goes

The budget is not evenly spent. A handful of rules usually consume most of it.

| Rule | Alerts/month | Minutes each | Hours/month | Share of capacity |
|---|---|---|---|---|
| DET-014 Encoded PowerShell | 1,240 | 12 | 253.0 | 40% |
| DET-002 Multiple Failed Logons | 690 | 8 | 92.0 | 15% |
| DET-031 Admin Group Change | 410 | 15 | 102.5 | 17% |
| DET-007 Outbound to New Domain | 300 | 20 | 100.0 | 16% |
| DET-055 Service Installed | 260 | 6 | 26.0 | 4% |
| 38 other rules | 200 | 15 | 50.0 | 8% |
| **Total** | **3,100** | — | **618.5** | **100%** |

Note what this table shows. **Four rules consume 88% of the team's triage capacity.** The remaining 38 rules together take 8%. This distribution is normal, and it is the reason that tuning work must be aimed, not spread. Tuning the 38 quiet rules is satisfying and nearly worthless. Tuning DET-014 is worth a working day a month, permanently.

#### The capacity conversation with management

The table above is the artefact that gets detection work prioritised, because it converts an abstract complaint into a staffing statement.

| If nothing changes | Consequence |
|---|---|
| The queue grows with the estate | Alerts per analyst rises each quarter |
| No time is spent tuning | The expensive rules stay expensive |
| No time is spent building | Coverage gaps stay open |
| Analysts leave | The remaining analysts inherit the queue |

Two sentences do the work. “Four rules consume 88% of our triage capacity, and one of them is 1.58 engineers.” And: “Every hour we spend tuning DET-014 returns about twelve hours a month.” The second one is the argument that gets the work scheduled, because it is a return on investment stated in the unit the manager already tracks.

#### Alert volume as a design constraint

Once you have the budget, it becomes an input to rule design rather than an afterthought.

| Rule type | Reasonable volume | Routing |
|---|---|---|
| Paging alert — wakes someone up | A handful per month | On-call queue, high severity |
| Ticket — worked within the shift | Up to the queue's capacity | Standard queue |
| Hunting input — reviewed in batches | Hundreds per month is fine | Hunting queue, never paged |
| Metric — tracked, not triaged | No practical limit | Dashboard |

The single most effective way to fix a noisy rule that you still want is often to change its **routing**, not its logic. Routing an over-broad rule to a hunting queue where it is reviewed in batches of fifty converts 253 hours of triage into a two-hour weekly review, with no loss of detection.

That is the right first move for DET-014, and it buys the time to tune it properly.

### Part 5 — Coverage measurement against ATT&CK, honestly

#### What coverage means, precisely

MITRE ATT&CK is a catalogue of adversary tactics and techniques, organised as: **tactic** (the goal, such as Execution), **technique** (the method, such as T1059 Command and Scripting Interpreter), and **sub-technique** (the specific variant, such as T1059.001 PowerShell).

Coverage is a claim of the form: *if an adversary does this, we will produce an alert that a human will act on.*

Three words in that sentence are load-bearing, and each one is a way the claim can be false.

| Word | The honest question | The dishonest shortcut |
|---|---|---|
| **If** | Is the telemetry that would record this actually collected? | Marking it covered because we could collect it |
| **Produce** | Does a rule exist that would fire? | Marking it covered because a rule mentions the technique |
| **Act on** | Would the alert be routed somewhere a human reads it? | Marking it covered because a rule fires into a queue nobody owns |

The third one is the most common lie in a coverage matrix, and it is usually not deliberate. A rule that fires into a queue nobody reads produces no coverage at all. It produces text.

#### Visibility, detection, and coverage are three different things

Conflating them is how a coverage map becomes fiction. Keep them separate.

| Level | Means | How you verify it |
|---|---|---|
| **Visibility** | The telemetry exists and is queryable | Run a query that returns events, today |
| **Detection** | A rule exists that fires on the behaviour | Run a test sample through the rule and watch it match |
| **Coverage** | A fired alert reaches a human who will act | Name the queue, the owner, and the routing rule |

```text
Process Injection (T1055), as a worked example of the three levels.

  Visibility    Sysmon Event ID 8 is collected on 412 of 500 endpoints.
                Verified by querying the last 24 hours and getting rows back.

  Detection     A rule exists for CreateRemoteThread into a remote process.
                Verified by replaying a test sample; it matched.

  Coverage      NO. The rule routes to a queue with no owner since the
                previous team lead left, and median time to first action
                is 11 days. Nobody acts on it within any useful window.
```

A team that marks T1055 green because a rule exists has documented a detection. It has not documented coverage, and the difference is the entire value of the exercise.

#### Building the layer

The ATT&CK Navigator is a free web tool that renders a matrix you can colour. The workflow is straightforward, and the discipline is in what you refuse to colour.

```text
Building an honest coverage layer

  1. Start from a blank Navigator layer. Not from a colleague's layer,
     and not from a vendor's template.
  2. Take the technique list for the platforms you actually run —
     Windows, Linux, cloud — and do not score techniques on platforms
     you have no presence on. An empty cell is information.
  3. For each technique, answer the three questions in order:
        a. Is the telemetry collected, on the hosts that matter?
        b. Is there a rule, and does it pass its test?
        c. Does a fired alert reach a named owner?
  4. Colour only when all three are yes.
  5. Write the reason in the technique's comment field, with the rule id
     and the date you checked. A colour with no comment is an opinion.
  6. Publish the layer with the date in the filename, and keep the old
     ones. Coverage over time is more useful than coverage today.
```

Step 6 matters and is usually skipped. A single coverage map is a snapshot. A directory of them, dated, is a trend line, and a trend line is what shows whether the detection work is actually reducing risk.

#### An honest coverage map

Here is a fragment of a real map, presented as data rather than as colour, because it forces the gaps into the open.

| Technique | Name | Visibility | Detection | Owner | Coverage | Note |
|---|---|---|---|---|---|---|
| T1059.001 | PowerShell | Yes | Yes | SOC queue 1 | **Yes** | DET-014, noisy, routing under review |
| T1059.003 | Windows Command Shell | Yes | Yes | SOC queue 1 | **Yes** | DET-021, tuned 2026-02 |
| T1059.005 | Visual Basic | Yes | No | — | **No** | No rule exists |
| T1547.001 | Registry Run Keys | Yes | Yes | SOC queue 2 | **Yes** | DET-034 |
| T1543.003 | Windows Service | Yes | Yes | — | **No** | Rule fires into an unowned queue |
| T1055 | Process Injection | Partial | Yes | SOC queue 2 | **Partial** | Sysmon 8 on 412 of 500 endpoints |
| T1071.001 | Web Protocols | No | No | — | **No** | Proxy logs retained 7 days, not ingested |
| T1078.004 | Cloud Accounts | Yes | No | — | **No** | Cloud audit log collected, no rules |

Six of eight rows in that fragment are something other than a clean yes. That is what an honest map looks like, and it is uncomfortable to publish precisely because it is honest.

**The `T1071.001` row is the one to study.** There is no detection, and there cannot be one, because the proxy logs are retained for seven days and are not ingested into the platform at all. That is not a detection problem. It is a telemetry problem, and it is the single highest-value finding on the map, because no amount of rule writing fixes it.

#### The three kinds of gap, and who owns each

| Gap type | Example above | Who fixes it | Typical effort |
|---|---|---|---|
| **Telemetry gap** | Proxy logs not ingested | Platform or network team | Weeks, with a budget request |
| **Detection gap** | No rule for Visual Basic execution | Detection engineering | Hours to days |
| **Operational gap** | Service-creation rule fires into an unowned queue | SOC lead | A routing change |

Sorting gaps into these three categories is the most useful thing you can do with a coverage map, because it turns one overwhelming problem into three differently-sized ones with different owners. A map that says “we have 200 gaps” is demoralising and useless. A map that says “we have 6 telemetry gaps, 41 detection gaps, and 12 operational gaps” is a work plan.

### Part 6 — Telemetry prerequisites: you cannot detect what you do not log

#### The precondition nobody checks

Every rule has a precondition: the log it reads must exist, be parsed, and be retained long enough to be useful. This is stated in the rule review as check 2, and it is the check most often marked “pass” without evidence.

| Precondition | How to verify it, today | What it looks like when it fails |
|---|---|---|
| **Collected** | Query the last hour and get rows | The rule has never fired, and nobody noticed |
| **Parsed** | The fields the rule uses appear in results | The rule works on raw text and breaks on every format change |
| **Retained** | Check the index retention setting | The rule works, but you cannot investigate anything older than 7 days |
| **Complete** | Compare host count against the asset inventory | 88 of 500 endpoints are not sending logs |

The fourth row is the one that produces confident, wrong coverage claims. A rule that reads Sysmon process creation is only as good as the number of endpoints running Sysmon. If 18% of the estate is not covered, then 18% of your detections do not exist on 18% of your hosts, and the coverage map is wrong in a way nobody will notice until an incident happens on the wrong machine.

```text
A telemetry prerequisite note, attached to a rule

  Rule              DET-014 PowerShell Encoded Command Execution
  Requires          Sysmon Event ID 1 (process creation, with command line)
  Alternative       Windows Security Event ID 4688 with command-line
                    auditing enabled via policy
  Verified          2026-03-20 — query returned events from 412 hosts
  Known gap         88 endpoints not reporting; asset list attached
  Retention         90 days in the hot index, 12 months in cold storage
  Failure mode      If Sysmon is uninstalled during an agent upgrade,
                    this rule silently stops firing. Monitor with a
                    heartbeat rule on Sysmon Event ID 4 (service state).
```

That failure mode is worth dwelling on, because it is common and it is invisible. An agent upgrade that removes or reconfigures Sysmon does not break the rule file. It removes the data the rule reads. The rule does not error. It simply never fires again, and a rule that never fires looks exactly like a rule that has nothing to find.

**The countermeasure is a heartbeat.** Write a rule that alerts when a host stops sending the telemetry other rules depend on. It is the least glamorous detection in the library and one of the most valuable.

```yaml
title: Sysmon Service State Changed to Stopped
id: 8a2f5c71-3d44-4b90-a1e2-7f9c0d5b6e33
status: production
description: >
  Detects the Sysmon service stopping, which removes process-creation
  telemetry from that host and silently disables every rule that depends
  on it. This is a telemetry-integrity detection, not a threat detection.
references:
  - https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon
author: Your Name
date: 2026/03/22
logsource:
  product: windows
  service: sysmon
detection:
  selection:
    EventID: 4
    State: 'Stopped'
  condition: selection
fields:
  - Computer
  - State
  - User
falsepositives:
  - Deliberate maintenance or upgrade by the endpoint team
level: medium
tags:
  - attack.defense_evasion
  - attack.t1562.001
```

A rule like this one rarely fires, and each firing is a real finding: either maintenance that should have been scheduled, or something switching off the telemetry.

#### The telemetry sources worth having, and what each one buys

| Source | Records | Buys you | Cost |
|---|---|---|---|
| **Sysmon Event ID 1** | Process creation with command line | Most execution detections | Free |
| **Sysmon Event ID 3** | Network connections per process | Command-and-control detection, egress anomalies | Free |
| **Sysmon Event ID 11** | File creation | Dropper and staging detection | Free |
| **Sysmon Event ID 8** | CreateRemoteThread | Process injection | Free, but noisy |
| **Security 4688** | Process creation | The same as Sysmon 1, where Sysmon is absent | Free, needs policy |
| **Security 4624/4625** | Logon success and failure | Authentication and lateral movement | Free, built in |
| **Security 4720/4728/4732** | Account and group changes | Privilege escalation | Free, built in |
| **PowerShell 4104** | Script block logging | Obfuscated and fileless PowerShell | Free, needs policy |
| **DNS query logs** | Resolved names | Beaconing, domain generation, exfiltration | Often requires a licence |
| **Proxy or web gateway logs** | HTTP requests and user agents | Web-based command and control | Usually present already |
| **Cloud audit logs** | API calls per identity | Cloud persistence, credential abuse | Free from the provider |

**Script-block logging deserves a specific mention.** It records PowerShell script content as it executes, which means obfuscated and fileless techniques that never touch disk become visible. It is free, it requires a policy change and a Group Policy Object, and it is one of the highest-value telemetry additions a junior engineer can propose.

#### A common failure: the rule that was never tested

Here is the failure this part exists to prevent, and it is worth walking through because it looks like success at every step.

An engineer writes a good detection rule. The logic is correct. The field names are right. The reviewer approves it. It is committed, deployed, and shown as green on the coverage map. Six months later there is an incident, and the technique the rule covers is exactly what the attacker used. The rule did not fire.

| Step | What everyone assumed | What was true |
|---|---|---|
| Deployment | The rule is live | The rule was deployed to one tenant, not both |
| Coverage map | T1059.001 is covered | The rule reads a field that is null on 88 hosts |
| Monitoring | No alerts means nothing happened | No alerts meant the rule never matched anything |
| Review | Approved at the review meeting | Nobody ran a test sample through the deployed rule |
| Incident | The detection will catch this | The technique was in the logs; the rule condition was wrong |

The root cause of that failure is not a bad rule. It is the absence of one specific step: **running a known-bad sample through the rule after deployment, and confirming it fires.** Not in a test harness — in production, on the deployed rule, with the deployed field names.

The cost of that step is twenty minutes. The cost of skipping it was an incident that a written rule should have caught.

| If you test before shipping | If you do not |
|---|---|
| Twenty minutes per rule | An unknown number of silent no-ops |
| Confidence that a green square is real | A coverage map that is a work of fiction |
| A failing rule discovered by you | A failing rule discovered by an attacker |

The rule to internalise: **a rule is not deployed when it is committed. It is deployed when you have seen it fire on real data.**

### Part 7 — Tuning, suppression, and retirement

#### Three different answers to a rule that costs too much

When a rule has been measured and found expensive, there are three responses, and choosing the right one is a judgement call that should be written down.

| Response | What it does | Cost | Risk |
|---|---|---|---|
| **Tuning** | Narrows the rule so fewer benign events match | Analyst time, and a real possibility of breaking the detection | Introducing a blind spot for the tuned-out case |
| **Suppression** | Keeps the rule but discards specified matches | Little, and reversible | The suppressed case becomes permanently invisible |
| **Retirement** | Removes the rule | A small amount of documentation | Losing the detection entirely |

They are not ranked. They solve different problems, and the choice follows from *why* the rule is expensive.

| Why it is expensive | Correct response |
|---|---|
| The condition is broader than the behaviour | **Tune** — the logic does not match the intent |
| The behaviour has a small set of known-benign causes | **Suppress those causes** — the rule is right, the environment is noisy |
| The detection target no longer exists | **Retire** — the software was decommissioned |
| Another rule now covers it better | **Retire the worse one** — duplicates are pure cost |
| The technique is real but low-impact for us | **Tune, or route to hunting** — do not page on it |
| The telemetry is unreliable | **Retire, and log a telemetry gap** — a rule that cannot be trusted is worse than none |

That last row is the one people resist. A rule reading flaky telemetry produces a stream of alerts that are neither true nor false, and analysts cannot resolve them. That is worse than no rule, because it teaches the team to close alerts without investigating.

#### Tuning properly

Tuning means changing the selection so it matches the behaviour you meant to detect, and nothing more. It is not the same as adding exclusions to silence alerts.

**Before — a rule that matches every PowerShell launch with an encoded parameter.**

```yaml
detection:
  selection_image:
    Image|endswith: '\powershell.exe'
  selection_encoded:
    CommandLine|contains: '-enc'
  condition: selection_image and selection_encoded
```

Replay shows 1,240 matches in 30 days. Examining a sample of the false positives produces the causes.

| Benign cause | Count in sample | Is it genuinely benign? |
|---|---|---|
| SCCM application deployment scripts | 412 | Yes — known, scheduled, from one parent process |
| Intune management agent | 301 | Yes — known parent, known path |
| Backup software with a fixed command line | 188 | Yes — one exact command line repeats |
| Scheduled administrative scripts | 122 | Yes — known task names |
| Undetermined, needs looking at | 217 | Unknown |

The last row is the important one. **It is not acceptable to tune away 217 unexplained matches.** Those are the cases the rule exists for, and the entire value of the rule is in finding out what they are.

**After — tuning against the three benign causes, not against the volume.**

```yaml
detection:
  selection_image:
    - Image|endswith:
        - '\powershell.exe'
        - '\pwsh.exe'
  selection_encoded:
    CommandLine|contains:
      - '-encodedcommand'
      - '-enc '
      - '-ec '
  # Benign cause 1: the software deployment client, with its known parent.
  filter_sccm:
    ParentImage|endswith: '\CcmExec.exe'
  # Benign cause 2: the device management agent.
  filter_intune:
    ParentImage|endswith:
      - '\Microsoft.Management.Services.IntuneWindowsAgent.exe'
      - '\OmadmClient.exe'
  # Benign cause 3: the backup agent's one fixed command line.
  filter_backup:
    CommandLine|contains: '-enc JABzAD0A'
  condition: selection_image and selection_encoded
             and not filter_sccm and not filter_intune and not filter_backup
```

Three things about that tuned rule.

**Every filter names a specific, verified benign cause.** Not “common processes”, not a wildcard over an entire directory. A filter you cannot explain is a blind spot you have not documented.

**The filters are attached to the rule, not to the platform.** If the rule moves to another platform, the filters move with it. If they lived only as a platform-side allowlist, they would be lost in the migration and the rule would silently become noisy again.

**The undetermined cases are still matching.** That is correct. A tuned rule that matches nothing has been silenced, not tuned.

#### Suppression, and its specific danger

Suppression is when you keep the rule as written and tell the platform to discard matches that meet a condition. It is fast and it is frequently overused.

| Suppression scope | Example | Acceptable? |
|---|---|---|
| A specific process path and parent | `CcmExec.exe` spawning encoded PowerShell | Yes — a verified benign pattern |
| A specific recurring command line | The backup agent's exact command | Yes — one known string |
| A user account | “The IT admin does this a lot” | **No** — an account is not a behaviour |
| A whole host | “The build server is always noisy” | **Rarely** — and it must have an end date |
| A technique across the estate | “Encoded PowerShell is used by our tooling” | **Never** — this removes the detection |

The distinction is between suppressing a **behaviour** and suppressing a **subject**. Suppressing `CcmExec.exe` spawning an encoded command suppresses one specific behaviour. Suppressing a service account suppresses everything that account ever does, forever, including the thing the rule was built to find.

**Every suppression needs an expiry date and an owner.** A suppression with no end date is a permanent blind spot with better documentation than usual, and it will outlive the person who created it.

#### Retirement

Retirement is the hardest of the three, because it means deleting work and telling someone who wrote it.

| Retirement trigger | Evidence required |
|---|---|
| The technique is no longer possible | The software or protocol has been removed from the estate |
| Another rule covers it better | Both rules replayed against the same window; the replacement catches everything the original did |
| The rule has produced no true positives in 12 months | The alert history for the rule, exported |
| The rule depends on telemetry that no longer exists | The telemetry prerequisite note, marked failed |
| The rule is genuinely duplicated | A diff of the two conditions |

**“No true positives in 12 months” is not automatically a retirement reason.** A rule that never fires may be detecting a technique that has not been attempted, which is exactly what you want. The question is whether the rule is *capable* of firing, and that is answered by testing it, not by its history. Retire a quiet rule only when you can show it cannot fire, or that something else fires in its place.

#### The lifecycle, and the promotion criteria

A rule moves through states, and each transition has a condition.

| State | Meaning | Enters when | Leaves when |
|---|---|---|---|
| **Draft** | Being written, not deployed | Work starts | Test samples exist |
| **Experimental** | Deployed to a limited or hunting queue | Tests pass, telemetry verified | It has run against production traffic |
| **Production** | Fully deployed, alerting to a real queue | Cost measured, review passed | It fails its review, or becomes a candidate for tuning |
| **Deprecated** | Still running, no longer maintained | A replacement exists or it is being tuned | It is removed or replaced |
| **Retired** | Removed from the platform | Retirement is approved and recorded | — |

The registry that tracks these states can be a single YAML file, and it is what makes the library auditable.

```yaml
# rules-registry.yaml — the state of every rule in the library
- rule_id: DET-014
  title: PowerShell Encoded Command Execution
  state: production
  owner: detection-engineering
  created: 2026-03-14
  last_reviewed: 2026-03-20
  review_due: 2026-09-20
  cost_baseline_alerts_30d: 1240
  routing: hunting-queue
  conditions_open:
    - Tune to reduce matches by 90% by 2026-04-20

- rule_id: DET-009
  title: RDP from External Address to Domain Controller
  state: retired
  owner: detection-engineering
  created: 2024-11-02
  retired: 2026-02-15
  retirement_reason: >
    Duplicate of DET-041, which matches the same behaviour with a
    session-length threshold that reduces false positives by 94%.
    Both rules replayed against 90 days of production data; DET-041
    caught every true positive DET-009 caught.
  evidence: retire/DET-009-replay-2026-02.csv
```

The `retirement_reason` field is what makes retirement survivable in a team. It is not “we deleted your rule.” It is “we replaced it with a better one, here is the evidence, here is the file.”

### Part 8 — Testing a rule before it ships

#### Three kinds of test, cheapest first

A rule can be tested at three levels, and the cheap ones catch most of the errors.

| Test | What it proves | Effort | Catches |
|---|---|---|---|
| **Unit test** | The rule matches a good sample and not a bad one | Minutes | Wrong field names, wrong logic, wrong modifiers |
| **Historical replay** | How often the rule would have fired on real traffic | Minutes to hours | Volume problems before they reach the queue |
| **Atomic test** | The rule fires on a real execution of the technique | An hour | Deployment problems, missing telemetry, wrong routing |

The first two are done by the rule author before review. The third is done after deployment and is the step described in Part 6 as the difference between a rule that is committed and a rule that is live.

#### Unit tests

A unit test is two small files: one log event that the rule must match, and one that it must not.

```json
{
  "EventID": 1,
  "Channel": "Microsoft-Windows-Sysmon/Operational",
  "Computer": "WKS-014",
  "Image": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
  "CommandLine": "powershell.exe -encodedcommand SQBFAFgAKAAnAGgAdAB0AHAAOgAvAC8AMQA5ADIALgAwAC4AMgAuADEAMAAvAGEAJwApAA==",
  "ParentImage": "C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE",
  "User": "LAB\\jsantos",
  "_expected": "match"
}
```

```json
{
  "EventID": 1,
  "Channel": "Microsoft-Windows-Sysmon/Operational",
  "Computer": "WKS-014",
  "Image": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
  "CommandLine": "powershell.exe -ExecutionPolicy Bypass -File C:\\Scripts\\Inventory.ps1",
  "ParentImage": "C:\\Windows\\System32\\schtasks.exe",
  "User": "LAB\\svc-inventory",
  "_expected": "no_match"
}
```

The negative sample is the more valuable of the two, and it is the one people forget to write. A rule that matches everything passes every positive test.

#### Historical replay

Replay answers the question that unit tests cannot: **how often will this fire in our environment?**

```powershell
# Dry-run a proposed process-creation detection against the last 30 days of
# Sysmon data before it reaches the queue. This does not create alerts; it
# only counts what would have matched.
#
# Run from a workstation that can read the log, or adapt the query for your
# SIEM's API. Requires Sysmon Event ID 1 with command-line capture enabled.

$windowDays = 30
$start = (Get-Date).AddDays(-$windowDays)

$events = Get-WinEvent -FilterHashtable @{
    LogName   = 'Microsoft-Windows-Sysmon/Operational'
    Id        = 1
    StartTime = $start
} -ErrorAction SilentlyContinue

if (-not $events) {
    Write-Warning "No Sysmon process-creation events in the window. Check the prerequisite before shipping this rule."
    return
}

$matches = foreach ($event in $events) {

    $xml = [xml]$event.ToXml()

    # Sysmon writes its fields as named <Data Name="..."> elements.
    $field = @{}
    foreach ($node in $xml.Event.EventData.Data) {
        $field[$node.Name] = $node.'#text'
    }

    $isPowerShell = $field['Image'] -like '*\powershell.exe' -or
                    $field['Image'] -like '*\pwsh.exe'
    $isEncoded    = $field['CommandLine'] -match '-encodedcommand\b|-enc\b'

    if ($isPowerShell -and $isEncoded) {
        [pscustomobject]@{
            Time        = $event.TimeCreated
            Computer    = $event.MachineName
            User        = $field['User']
            ParentImage = $field['ParentImage']
            CommandLine = $field['CommandLine']
        }
    }
}

$summary = $matches | Group-Object ParentImage |
    Sort-Object Count -Descending |
    Select-Object Count, Name

"Window: $windowDays days"
"Total candidate alerts: $($matches.Count)"
"Alerts per day: {0:N1}" -f ($matches.Count / $windowDays)
"Distinct parent processes: $($summary.Count)"
""
"Top parent processes by volume:"
$summary | Select-Object -First 10 | Format-Table -AutoSize

# Keep the raw matches so the false-positive causes can be examined properly.
$matches | Sort-Object Time |
    Export-Csv -Path .\replay-encoded-powershell.csv -NoTypeInformation
```

The grouping by parent process is the part that makes replay worth running. It answers “what will this cost” and “what is causing it” in the same output. In the DET-014 case, that grouping is what produced the benign-cause table in Part 7.

**Note what the script does not do: it does not create alerts.** A replay that pages the on-call engineer is a replay nobody will run a second time.

#### Atomic tests

An atomic test is a single, small, documented execution of one technique. Atomic Red Team publishes them, openly and for free.

```text
Running one atomic test and closing the loop

  1. Pick the technique. T1059.001, PowerShell, matches the rule you are
     validating.
  2. Read the test before running it. Know exactly what it will do.
  3. Run it on a lab host you own, in an isolated network. Never on a
     production system, and never on a system you do not own or have
     written authority to test.
  4. Watch for the alert. Note the time the test ran.
  5. If the alert arrives, confirm the routing — where did it land, and
     is there an owner?
  6. If it does not arrive within the expected window, investigate in
     this order: telemetry present? rule deployed to this host?
     condition correct against the real fields? routing correct?
  7. Record the result against the rule id, with the date.
```

Step 6 is the whole point. When an atomic test does not produce an alert, the cause is one of four things, and they live in four different places.

| Symptom | Likely cause | Where to look |
|---|---|---|
| No events at all for this host | Telemetry not collected | Agent status, Sysmon service |
| Events present, rule did not match | Condition or field name wrong | The query, run by hand against the raw event |
| Rule matched, no alert created | Deployment scope | Which tenants, groups, or index the rule targets |
| Alert created, nobody saw it | Routing | The queue, its owner, and the notification rule |

Walking that list is the skill. It takes about twenty minutes the first time and five minutes thereafter, and it is the difference between a detection library and a folder of YAML.

### Part 9 — Writing a coverage map a manager can read

#### The audience problem

The coverage layer in the Navigator is for you. The map a manager needs is a different document, and the difference is what it leaves out.

| The engineer's view | The manager's view |
|---|---|
| 200 technique rows | 6–10 rows, grouped by adversary goal |
| Colour per technique | Counts, trend, and named gaps |
| Rule ids and conditions | Owner, effort, and cost |
| “Coverage is partial” | “We would detect this. We would not detect that.” |

A manager cannot act on a colour. They can act on “we have no coverage for web-based command and control, and closing it needs proxy log ingestion, which costs a licence we do not have.”

#### The one-page coverage summary

```text
DETECTION COVERAGE SUMMARY — 2026-03-31

Bottom line
  We detect 41 of 128 techniques that apply to our environment.
  Four rules consume 88% of triage capacity. Three gaps need a
  decision from you; the rest are work we can absorb.

By adversary goal
  Goal                  Techniques   Covered   Partial   None
  Initial Access             18         6        3        9
  Execution                  14         9        2        3
  Persistence                19         8        4        7
  Privilege Escalation       13         4        2        7
  Defense Evasion            31        10        6       15
  Credential Access          12         2        2        8
  Discovery                  11         1        1        9
  Lateral Movement            9         3        1        5
  Collection                  7         2        1        4
  Command and Control        13         4        1        8

Decisions needed
  1. Proxy log ingestion — 8 Command and Control techniques have no
     visibility because proxy logs are retained 7 days and are not
     ingested. Cost: licence plus platform work. Owner: platform team.
  2. Triage capacity — DET-014 consumes 1.58 engineers for 9 true
     positives a month. Tuning work is scheduled; if it fails, the
     recommendation is retirement plus two narrower rules.
  3. Detection engineering time — closing the 41 detection gaps in
     Execution, Persistence, and Privilege Escalation is roughly 6
     weeks of one engineer. No new headcount requested.

What is working
  Execution coverage is the strongest area: 9 of 14 techniques, with
  tested rules and a named queue owner.

Known inaccuracies in this map
  Visibility is claimed on 412 of 500 endpoints. The 88 endpoints
  without Sysmon are not detected on, and are counted here as gaps.
  This map is therefore optimistic by approximately 18% on every
  Windows technique.

Next review
  2026-06-30
```

Four things in that summary are worth copying.

**The bottom line is a number and a decision.** “We detect 41 of 128” is memorable. “Coverage is improving” is not.

**The decisions section is short and each item has an owner.** A coverage map that lists 200 gaps has asked the reader to do the sorting. A map that names three decisions has done it for them.

**There is a “what is working” section.** A map that is only gaps gets ignored, because it reads as a complaint. One that credits real progress gets read.

**The inaccuracies are stated.** That last paragraph is what separates a professional document from a sales document. An 18% optimistic bias is a real number, and a manager who knows it can act sensibly on the rest.

#### The trend line

One map is a snapshot. The value appears when you publish it quarterly and can show direction.

| Quarter | Techniques covered | Expensive rules | Telemetry gaps |
|---|---|---|---|
| 2025 Q4 | 33 | 6 | 9 |
| 2026 Q1 | 41 | 4 | 6 |
| 2026 Q2 | 47 | 3 | 4 |

That table, at three lines, is the strongest thing a detection engineer can bring to a review. It says: the library is growing, the expensive rules are being dealt with, and the visibility problems are being closed. It is also the evidence that the tuning work is worth funding.

#### The alerting and detection strategy document

For each significant rule, a short strategy document turns a query into an owned detection. It is one page, and it answers the questions a reviewer or a future owner will ask.

```text
ALERTING AND DETECTION STRATEGY

Rule              DET-014 PowerShell Encoded Command Execution
Technique         T1059.001
Owner             detection-engineering
State             production, routed to hunting queue

Goal
  Surface encoded PowerShell execution so that loaders and
  fileless techniques are visible without paging an analyst on
  every administrative script.

Blind spots we accept
  Encoded commands invoked through a parent we have filtered.
  This is a deliberate, documented trade, and the filters are
  reviewed at each review date.

False-positive profile
  1,231 of 1,240 alerts in the 30 days to 2026-03-31. Causes are
  listed in the rule's falsepositives field; the three largest are
  filtered in the rule itself rather than in the platform.

Validation
  Unit samples: tests/samples/proc_encoded_powershell.*.json
  Replay: replay-encoded-powershell.csv, 30 days
  Atomic: T1059.001 test 1, run 2026-03-21, alert observed

Response
  Hunting queue. Review in weekly batches. Escalate any match whose
  parent is an Office application or a web browser, which is the
  pattern that indicates a loader rather than an administrative task.

Change history
  2026-03-14  created, experimental
  2026-03-20  reviewed, approved with conditions, routed to hunting
  2026-03-31  cost measured, tuning scheduled
```

The **blind spots we accept** section is the one that turns a rule into a professional artefact. Every detection has a blind spot. A rule whose blind spot is written down can be reasoned about. A rule whose blind spot is unknown is a false sense of security.

### Key takeaways

- **Owning a library is a different job from writing rules.** Writing is a task; owning means measuring what the library costs and deciding what stays.
- **Detection as code means rules in version control**, with an owner, a review, a status, and a history. The commit message names the reason, not the change.
- **A rule review is a decision, not an opinion.** Approve, approve with conditions, return, or reject — and failed checks can carry dated conditions with named owners instead of a refusal.
- **State the expected alert volume before deployment.** An unmeasured rule will be measured later, by an analyst, without warning.
- **False-positive cost is best expressed in analyst hours and money.** “1,240 alerts, 9 true positives, 253 hours, 1.58 engineers a month” changes behaviour in a way that “this rule is noisy” never will.
- **Triage capacity is a budget with no overdraft.** At 10 minutes an alert and 288 usable minutes a shift, an analyst handles about 28 alerts. Four rules consuming 88% of that is normal, and it is where tuning effort belongs.
- **Routing is often a better fix than logic.** Sending an over-broad rule to a hunting queue reviewed in batches can convert 253 hours of triage into two hours a week with no loss of detection.
- **Visibility, detection, and coverage are three different claims.** Telemetry exists, a rule fires, and a human acts. A rule firing into an unowned queue is not coverage.
- **An honest coverage map is mostly not-green.** Sorting gaps into telemetry, detection, and operational categories turns one overwhelming problem into three work plans with different owners.
- **Tune against verified benign causes, never against volume.** Filters must name a specific cause you have examined, and they belong in the rule so they survive a platform migration.
- **Suppress behaviours, never subjects.** Filtering a known parent process is tuning; filtering a service account is a permanent, undocumented blind spot.
- **Retirement is a normal outcome, not a failure.** Record the reason and the evidence, so removing someone's rule is a decision rather than an insult.
- **A rule is deployed when you have seen it fire on real data**, not when it is committed. Test before review, replay before deployment, and confirm with an atomic test afterwards.
- **Telemetry is the precondition nobody checks.** A rule reads a log; if 88 of 500 endpoints are not sending it, the coverage claim is wrong by 18% and nobody will notice until the wrong incident happens.
- **Write the blind spot down.** A rule whose limitations are documented can be reasoned about. A rule whose limitations are unknown is a false sense of security.
- **Publish a coverage map quarterly and keep the old ones.** A trend line is what justifies the work; a single snapshot is just a complaint.

### Practice this next

The twelve tasks build toward one artefact: a detection library you can defend, with measured costs, a tested review standard, and an honest coverage map. The order follows the work rather than the reading — measure first, then tune, then map.

1. **Write a "what would make this fire wrongly" note for ten existing rules** (task 1). One line each. This is the fastest way to see which rules in your queue are load-bearing and which are noise.
2. **Inventory every telemetry source you can actually query** (task 2), with retention and host coverage. The shortest retention window and the lowest host coverage figure are the two numbers that limit everything else you do.
3. **Write one Sigma rule and convert it** (task 3) to your platform's query language with `sigma-cli`. Commit it to a Git repository with a message naming the reason it exists.
4. **Replay a rule against 30 days of real logs before shipping it** (task 4). Record the hit count, the alerts per day, and the top parent processes. This is the dry run that prevents a noisy rule from reaching the queue.
5. **Build the alert budget for your own queue** (task 5). Total alerts per month, minutes per alert, hours consumed, and the share taken by the top five rules. Present it as a table.
6. **Write the rule review checklist you will actually use** (task 6), with the twelve checks from Part 2 adapted to your platform. Keep it under one page.
7. **Build an ATT&CK Navigator layer for your current coverage** (task 7) and colour it using the three-level rule from Part 5. Most of the map should not be green, and that is the point.
8. **Compute the cost of your noisiest rule** (task 8) with the script in Part 3, and write the two-sentence summary a manager would read. Include the hours and the fraction of a full-time engineer.
9. **Take one expensive rule through tune, suppress, or retire** (task 9), and write the decision with its evidence. Include the benign causes you verified and the ones you deliberately left matching.
10. **Write a one-page coverage summary for a manager** (task 10) using the structure in Part 9: bottom line, by goal, decisions needed, what is working, and the known inaccuracies.
11. **Run one Atomic Red Team test against a lab host** (task 11) and record whether your rule fired, where the alert landed, and who owns the queue. If it did not fire, work the four-cause list in Part 8.
12. **Put your rules in Git with a lifecycle registry** (task 12) and open a pull request against your own repository. Review it against your own checklist and write the review record.

Then open `portfolio/advance/01-detection-at-scale.md` and assemble the deliverables. **The phase is done when you can own a detection library** — write and review rules to a standard, measure their false-positive cost, map coverage honestly including the gaps, and retire what no longer earns its place.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Sigma and sigma-cli | Vendor-neutral rule format, and a converter to platform query languages | Free/open-source | https://sigmahq.io/ | Write one rule and convert it with `sigma convert -t splunk rule.yml` | Hand-written SPL or KQL kept in Git |
| Splunk Free | Log search and alerting platform | Free | https://www.splunk.com/en_us/download.html | Install Splunk Free, index a sample log, and save a search as an alert | Elastic Stack with Kibana |
| Elastic Stack | Search, dashboards, and detection rules | Free/open-source | https://www.elastic.co/elastic-stack | Index Sysmon logs with Winlogbeat and query them in Kibana | Splunk Free, or OpenSearch |
| Sysmon | Windows process, network, and file telemetry | Free | https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon | Install Sysmon with a community config and confirm Event ID 1 is generated | Windows Security Event ID 4688 with command-line auditing |
| ATT&CK Navigator | Build and publish coverage layers against ATT&CK | Free | https://mitre-attack.github.io/attack-navigator/ | Build a layer for the techniques your current rules cover and export the JSON | A spreadsheet coverage matrix |
| Atomic Red Team | Documented, small tests of individual ATT&CK techniques | Free/open-source | https://github.com/redcanaryco/atomic-red-team | Run the T1059.001 test on a lab host and check whether your rule fires | Manual PowerShell simulation on a lab VM |
| Hayabusa | Sigma-based EVTX timeline and detection scanner | Free/open-source | https://github.com/Yamato-Security/hayabusa | Run `hayabusa csv-timeline -d ./logs -o timeline.csv` on a sample EVTX set | Chainsaw with the same rule set |
| Chainsaw | Fast Sigma-based hunting over Windows event logs | Free/open-source | https://github.com/WithSecureLabs/chainsaw | Hunt a sample EVTX folder with a Sigma rule directory | Hayabusa |
| BOTS datasets | Realistic multi-source security datasets for practice | Free | https://github.com/splunk/botsv3 | Index one dataset and replay a rule against it | Your own lab logs, or public challenge data |
| Blue Team Labs Online | Browser-based detection and investigation challenges | Freemium | https://blueteamlabs.online/ | Complete one detection-focused challenge and write up your rule reasoning | BOTS datasets, or CyberDefenders |

## Free/cheap resources

- MITRE ATT&CK — https://attack.mitre.org/
- ATT&CK Navigator — https://mitre-attack.github.io/attack-navigator/
- Sigma project — https://sigmahq.io/
- Sigma specification — https://sigmahq.io/sigma-specification/
- Sigma rule repository — https://github.com/SigmaHQ/sigma
- Elastic detection rules — https://github.com/elastic/detection-rules
- Splunk security content — https://github.com/splunk/security_content
- Palantir alerting and detection strategy framework — https://github.com/palantir/alerting-detection-strategy-framework
- Microsoft Sysmon documentation — https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon
- Windows security auditing event 4688 reference — https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4688
- Splunk search reference — https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/WhatsInThisManual
- KQL quick reference — https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/
- Atomic Red Team — https://github.com/redcanaryco/atomic-red-team
- Hayabusa — https://github.com/Yamato-Security/hayabusa
- Chainsaw — https://github.com/WithSecureLabs/chainsaw
- Florian Roth's signature base — https://github.com/Neo23x0/signature-base
- The DFIR Report — https://thedfirreport.com/
- Detection Engineering Weekly — https://www.detectionengineering.net/
- MITRE Engenuity ATT&CK Evaluations — https://attackevals.mitre-engenuity.org/

## Hands-on practice tasks

1. Write a one-line "what would make this fire wrongly" note for ten rules that currently reach your queue. <!-- id: advance-01-t01 band: quick energy: low -->
2. Inventory every telemetry source you can query, with its retention window and the number of hosts it covers. <!-- id: advance-01-t02 band: focused energy: normal -->
3. Write one Sigma rule, convert it with `sigma-cli` to Splunk SPL and to KQL, and commit it with a message naming the reason it exists. <!-- id: advance-01-t03 band: focused energy: normal -->
4. Replay a proposed rule against 30 days of real logs and record the hit count, alerts per day, and top parent processes. <!-- id: advance-01-t04 band: deep energy: high -->
5. Build the alert budget for your queue: total alerts, minutes per alert, hours consumed, and the share taken by the top five rules. <!-- id: advance-01-t05 band: focused energy: normal -->
6. Write the rule review checklist you will use on every change, adapted to your platform and kept under one page. <!-- id: advance-01-t06 band: quick energy: low -->
7. Build an ATT&CK Navigator layer for your current coverage, colouring only where telemetry, detection, and an owned queue all exist. <!-- id: advance-01-t07 band: deep energy: high -->
8. Compute the monthly cost of your noisiest rule and write the two-sentence summary a manager would read. <!-- id: advance-01-t08 band: focused energy: normal -->
9. Take one expensive rule through tune, suppress, or retire, and write the decision with the benign causes you verified. <!-- id: advance-01-t09 band: deep energy: high -->
10. Write a one-page coverage summary with a bottom line, counts by goal, decisions needed, what is working, and known inaccuracies. <!-- id: advance-01-t10 band: focused energy: normal -->
11. Run one Atomic Red Team test on a lab host and record whether your rule fired, where the alert landed, and who owns that queue. <!-- id: advance-01-t11 band: deep energy: high -->
12. Put your rules in Git with a lifecycle registry and open a pull request against your own repository, with a written review record. <!-- id: advance-01-t12 band: quick energy: normal -->

## Deliverable / proof of work

Create `portfolio/advance/01-detection-at-scale.md` with:

- A repository layout and at least three rules committed with reasons in the commit messages
- One complete Sigma rule plus its converted Splunk SPL and KQL equivalents
- A written rule review record showing all twelve checks and a decision with conditions
- A cost table for at least five rules, with alerts, true positives, hours, and monthly cost
- The alert budget for your queue, showing where triage capacity is actually spent
- A 30-day replay result for one rule, with the benign causes grouped and examined
- An ATT&CK Navigator layer plus a written explanation of what is not covered and why
- A telemetry prerequisite note naming host coverage and retention for at least three sources
- A lifecycle registry entry for one rule you tuned, one you suppressed, and one you retired
- A one-page coverage summary written for a manager, including the known inaccuracies
- A test result from one atomic test, recorded against a rule id with the date

## Checklist

- [ ] I can write a detection rule in a vendor-neutral format and convert it to my platform. <!-- id: advance-01-sigma-authoring energy: normal -->
- [ ] I keep rules in Git with a message that names the reason the rule exists. <!-- id: advance-01-rule-version-control energy: low -->
- [ ] I can review a rule against a written standard and give one of four decisions. <!-- id: advance-01-review-standard energy: normal -->
- [ ] I measured the false-positive cost of at least five rules in analyst hours. <!-- id: advance-01-fp-cost-measurement energy: normal -->
- [ ] I can express the cost of a noisy rule as a fraction of a full-time engineer. <!-- id: advance-01-cost-per-alert energy: low -->
- [ ] I built the alert budget for my queue and named the rules consuming most of it. <!-- id: advance-01-alert-budget energy: normal -->
- [ ] I replayed a rule against 30 days of logs before letting it reach the queue. <!-- id: advance-01-historical-replay energy: normal -->
- [ ] I can state the telemetry a rule needs, and whether it is actually collected. <!-- id: advance-01-telemetry-prerequisites energy: low -->
- [ ] I verified host coverage for at least one telemetry source against an asset list. <!-- id: advance-01-host-coverage-audit energy: normal -->
- [ ] I built an ATT&CK layer that distinguishes visibility, detection, and coverage. <!-- id: advance-01-attack-coverage-map energy: high -->
- [ ] I can name the telemetry, detection, and operational gaps my coverage map exposes. <!-- id: advance-01-gap-triage energy: normal -->
- [ ] I tuned one rule against verified benign causes rather than against volume. <!-- id: advance-01-rule-tuning energy: normal -->
- [ ] I can explain why suppressing a behaviour is safe and suppressing a subject is not. <!-- id: advance-01-suppression-risk energy: low -->
- [ ] I retired one rule and recorded the evidence and the reason. <!-- id: advance-01-rule-retirement energy: normal -->
- [ ] I ran an atomic test and confirmed whether a deployed rule actually fires. <!-- id: advance-01-atomic-validation energy: normal -->
- [ ] I wrote a coverage summary a manager can act on, including its known inaccuracies. <!-- id: advance-01-manager-coverage-summary energy: high -->

## You're ready to move on when...

You can own a detection library: write and review rules to a standard, measure their false-positive cost, map coverage honestly including the gaps, and retire what no longer earns its place.

## Free vs Paid

### What's free and enough

Sigma, `sigma-cli`, the Sigma rule repository, Elastic detection rules, and Splunk security content give you more real rules to read than you will get through in six weeks, all free. Sysmon, Windows Security event logging, and PowerShell script-block logging supply production-grade telemetry at no cost, and Splunk Free, Elastic Stack, or OpenSearch gives you a platform to query it. The ATT&CK Navigator is free and does the coverage work. Atomic Red Team and Hayabusa or Chainsaw let you test and hunt without buying anything. The BOTS datasets provide realistic multi-source logs to replay against, which is the closest thing to production traffic a learner can get.

The gap between that stack and a commercial one is operational, not analytical. You will do the same arithmetic on cost, the same review against a standard, and the same honest coverage mapping, on data that is smaller but structurally identical.

### What's paid and why you'd upgrade

Commercial SIEM and detection platforms add retention at volume, correlation across many sources, managed parsing, and the automation that makes tuning at scale practical. Endpoint detection platforms add kernel-level visibility and response actions that free tooling cannot match. Threat-intelligence subscriptions add curated indicators and context that shorten the work of deciding whether a match matters. Detection-as-code platforms add CI that validates and deploys rules across tenants automatically.

None of that changes the judgement this phase teaches. It changes the volume of data the judgement is applied to, and it removes manual steps that a smaller environment can afford to do by hand.

### When it's worth paying

Pay when the estate is large enough that manual deployment is the bottleneck, when retention requirements exceed what a free tier holds, or when an employer's platform of record is already licensed and the marginal cost of using it is zero. Follow the repository's budget rule otherwise: a learner at $0 can complete every task in this phase with the free stack, because the artefact that gets you hired is a measured cost table and an honest coverage map, not familiarity with a particular console. If you later work somewhere with a commercial platform, you will learn its interface in a week, because the reasoning underneath it is the same.