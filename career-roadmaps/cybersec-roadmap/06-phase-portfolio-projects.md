---
id: cyber-06-portfolio-projects
track: cyber
phase: 6
order: 60
title: "Phase 6 — Portfolio Projects"
duration: "8–12 weeks"
duration_weeks: 12
energy_mix: [low, normal]
deliverable: "wazuh-siem-lab-report.md"
exit_criteria: "You have 3 portfolio reports that are clear, honest, evidence-based, and aligned with your target cyber role."
---

# Phase 6 — Portfolio Projects

## Goal of this phase

Build 3–5 strong cybersecurity portfolio projects that prove practical ability for your chosen entry-level cyber path.

## Estimated time

**8–12 weeks**. A good project with a clear report is better than 20 unfinished labs.

## Skills you'll gain

- Scope and complete cyber projects.
- Write professional reports.
- Show evidence with screenshots, diagrams, logs, and findings.
- Explain business impact and remediation.
- Build role-specific proof for SOC, GRC, IT security, or pentest.

## Required projects

### Project 1: Wazuh SIEM Lab

- Install Wazuh.
- Forward logs from at least one VM.
- Generate safe events.
- Write or modify 3 detection rules.
- Create alert screenshots.
- Write investigation notes.

### Project 2: Network Traffic Analysis

- Capture DNS, HTTP, TLS handshake metadata, and failed connection attempts.
- Explain protocols and suspicious indicators.
- Include Wireshark filters.

### Project 3: Incident Report

- Use CyberDefenders, BTLO, LetsDefend, or your Wazuh lab.
- Include summary, timeline, evidence, impact, containment, remediation, lessons learned.

### Choose 1–2 specialization projects

SOC:
- Phishing triage report
- Wazuh alert tuning
- MITRE ATT&CK mapping

GRC:
- Risk register
- Acceptable use policy
- Access review checklist
- Vendor security questionnaire

IT Security:
- Vulnerability management report
- MFA rollout plan
- Endpoint hardening checklist

Pentest:
- PortSwigger web vulnerability report
- OWASP Juice Shop report
- Nmap lab assessment report

## Lesson: Turning Labs Into Evidence

### Why this lesson exists

Phase 5 asked you to name three projects that prove your target role. This phase is where you actually build them, and it is the longest in the cyber track — 8 to 12 weeks, longer than any phase before it. That length is not padding. It is the honest amount of time it takes to produce three pieces of work that a hiring manager will believe.

Here is the problem this lesson exists to solve. **Doing the work and proving the work are two different skills**, and beginners almost universally practise only the first. The second skill is not a formality you add at the end — it is a separate craft, and it is the one an employer is actually paying to read.

You have already done a lot of work: Wazuh rules in Phase 4, traffic captures, blue-team labs, PortSwigger challenges. Almost none of it currently exists in a form anyone else can evaluate.

An employer cannot see your screen history. They cannot see the afternoon you spent working out why a decoder was not matching. They see only what you hand them, and what most beginners hand them is a repository of screenshots with filenames like `Screenshot 2024-11-03 141022.png`.

Read the exit criterion again, because the qualifiers are doing real work:
*"3 portfolio reports that are **clear, honest, evidence-based**, and aligned
with your target cyber role."* Four adjectives, four separate failure modes.

It is worth seeing how each one fails on its own, because they are not variations on a single mistake:

| Qualifier | How it fails | What it costs you |
|---|---|---|
| **Clear** | A wall of technical narration with no summary | A reviewer spends ninety seconds on your project. If they cannot find the point, the point does not exist |
| **Honest** | Implying your lab was production, or a synthetic alert was a real intrusion | Reviewers detect this instantly, and it destroys more credibility than a modest project ever would |
| **Evidence-based** | Asserting findings your own screenshots and logs do not support | Every claim should trace to an artifact in the repository |
| **Aligned** | Building what interests you instead of what the role requires | Phase 5 gave you the job posts. This phase is where you obey them |

**Time to complete:** roughly 120–180 hours across the 8–12 weeks. That sounds
like a lot, and it is — but it is spread across three projects.

The phase's own warning is the correct framing: *a good project with a clear
report is better than 20 unfinished labs.* Three finished reports at 40–60 hours
each is a realistic budget.

If you find yourself at week six with nothing finished, the problem is almost
always scope, not speed. Part 2 is where you fix it.

**A note specific to your situation.** You have a web development background.
That means you already know something most cyber beginners do not: how to
structure a repository, write a README, and put a project online where someone
can find it.

That is a genuine and underrated advantage in this exact phase. Portfolio work
is a *publishing* problem as much as a technical one, and you have already
solved the publishing half once.

### Part 1 — What a portfolio actually has to do

#### The reviewer, and the ninety seconds they give you

Start by being concrete about who reads this. Writing for nobody in particular
produces the vague reports that fail the exit criterion.

There are two realistic readers, and they read differently.

| | The recruiter or HR screener | The hiring manager or senior analyst |
|---|---|---|
| **When** | First | Second |
| **Time given** | Under a minute | Five to ten minutes per project |
| **Looking for** | Is there a portfolio at all? Does it look organised? Does the README mention this role? | Are you *safe to hire*? |
| **What they read** | The title, the summary, the project list | Your method, your findings, your limitations |
| **How you fail here** | A folder of files with no entry point | Overstating, or asserting what the evidence does not support |

The screener will not read your detection rule. They will notice a clear title, a
one-paragraph summary, and a list of projects with links. Many candidates are
filtered out here, before anyone technical sees anything.

The hiring manager is not checking whether you are impressive. They are checking
whether you can investigate something methodically, write it up accurately, admit
what you did not determine, and not overstate. This is the same judgement Phase 5
identified as the real pentest barrier, and it applies to every path.

They are also, quietly, checking whether your report resembles the reports their
team produces. A junior who already writes in the house format needs less
training.

Everything in this lesson follows from those two readers. The README exists for
the first. The reports exist for the second. Neither is reading for the reason
you think — they are not measuring how much you know. They are measuring whether
they can trust what you say.

#### The anatomy of a portfolio report

Here is a structure that works across all four paths. It is also, not coincidentally, the standard structure of a professional incident report, and using it now means you are practising the format you will be asked for in the job.

```text
# <Project title>

## Summary
Three to five sentences. What was built or investigated, what was found,
and what it means. Written last, read first.

## Objective and scope
What question this project answers. What is in scope and what is out.

## Environment
The lab, the tools and versions, the network layout, the data source.
Enough that someone could rebuild it.

## Method
What you did, in order. Commands where commands were used.
This is the reproducible part.

## Findings
The substance. Numbered findings, each with evidence and impact.

## Evidence
Screenshots, log excerpts, capture files, with captions saying what to look at.

## Impact
Why this matters to a business. Written for a non-technical manager.

## Remediation
Specific, prioritised recommendations. What to do, and in what order.

## Limitations
What you could not determine, and what you would need to go further.

## Lessons learned
What you would do differently. Brief and genuine.

## References
Tools, documentation, frameworks, external material you relied on.
```

Two sections carry disproportionate weight with the reviewer, and beginners
systematically under-write both.

**Limitations** is the honesty test. A report that claims complete success is
suspicious. A report that says:

> I confirmed the process tree but could not determine the parent process,
> because the host was reimaged before I captured volatile data.

That demonstrates you understand investigation. Write this section even when it
feels like admitting fault. It is the single fastest way to sound like an
analyst rather than a student.

**Impact** is the business-translation test. Same finding, two versions:

| Version | Text | Who cares |
|---|---|---|
| Technical finding | "PowerShell spawned with an encoded command line." | An analyst |
| Impact | "An attacker with this execution path could run arbitrary code with the privileges of the user, which here includes access to the shared finance drive — so a single phished account could expose financial records." | A manager |

Only the second tells a manager why they should care. Phase 3 emphasised this
and Phase 5 restated it: every one of the four paths uses logs and requires
written reports. This section is where the writing skill becomes visible.

#### Evidence that survives scrutiny

Evidence is where portfolios are won and lost. The rules are concrete.

**Screenshots need context or they prove nothing.** A screenshot of an alert
should show the alert, the timestamp, and enough surrounding interface that the
source is identifiable. Crop the noise, keep the identifiers.

A terminal screenshot should include the command that produced the output, not
just the output. Otherwise nobody can tell whether the output came from your lab
or a documentation page.

**Captions are part of the evidence.**

| Caption | Verdict |
|---|---|
| `![Wazuh alert 1042 firing at 14:32 UTC on lab-win10](evidence/alert-1042.png)` | Evidence |
| `![](evidence/image1.png)` | Decoration |

The caption is where you tell the reviewer what to conclude, so they reach the
conclusion instead of hunting for it.

**Keep the raw artifacts.** If you captured traffic, commit the pcap. If you
wrote a rule, commit the rule file with its path in the Wazuh tree. If you
produced logs, commit the relevant excerpt.

Screenshots are a convenience for the reader. The artifacts are what prove the
work happened, and a technical reviewer will go looking.

**Sanitise before you publish.** This is the rule people forget and regret.
Before any artifact goes into a public repository, check it for four things.

| Check for | Why |
|---|---|
| Real credentials or API keys | The obvious one, and still the most common |
| Internal hostnames or IP addresses | Belonging to your employer |
| Real usernames or personal data | Including your own colleagues' |
| Licence keys | Especially for commercial tooling |

If you build any part of this portfolio from your actual work environment —
which Phase 5 noted is a real advantage for Path C — sanitise first, and consider
describing the environment without exposing it.

A portfolio that leaks your employer's internal addressing scheme is a portfolio
that gets you a conversation with your manager instead of a job offer.

**State what is synthetic and what is not.** Almost every project here is a lab
you built and an alert you generated yourself. Say so plainly in the Environment
section:

> This is an isolated lab. The alert was generated by executing a
> known-suspicious command on a controlled host; it does not represent a real
> intrusion.

That sentence costs you nothing and buys you credibility. A reviewer who
discovers the work is a lab *and* that you described it accurately trusts you
more than one who reads an ambiguous claim and starts wondering.

#### What "clear" means in practice

Clarity is a writing discipline, not a talent, and it is largely mechanical.

| Rule | Why |
|---|---|
| **Front-load the conclusion** | A reviewer who stops after the summary should still know what you found |
| **One idea per paragraph** | A paragraph holding a finding, a caveat, and a tool recommendation is three paragraphs |
| **Define terms on first use** | Your reader may be a generalist recruiter. Define *false positive*, *decoder*, *lateral movement* in a clause |
| **Prefer numbered findings to prose** | "Finding 3:" is navigable. A narrative paragraph is not |
| **Use tables for anything comparative** | A timeline of timestamps and events beats a paragraph describing the same sequence |
| **Cut the adjectives** | "A critical and severe vulnerability" is one adjective doing the work of two, and reviewers discount both |

Write the Summary and Limitations sections **last**, after everything else
exists. They are the two sections that require knowing the whole result.
Writing them first guarantees they are wrong.

### Part 2 — Building the three projects

#### Project 1 — The Wazuh SIEM lab

This is the flagship, and for Path A or Path C it is the project a reviewer will
spend the most time on. The task list gives six steps. The value is in how you
execute them, and in what the report says about the pipeline you built in
Phase 4.

**Build it in an order that produces a working artifact early.**

| Order | Step |
|---|---|
| 1 | Install the Wazuh server |
| 2 | Confirm the dashboard loads |
| 3 | Onboard a single agent |
| 4 | Confirm *one* log line reaches the dashboard |
| 5 | Only then start generating events |

Learners who try to build the whole architecture before confirming the first log
arrives spend days debugging a system they have never seen work, and cannot tell
which layer is broken.

Get one log through the entire pipeline first — source to decoder to rule to
alert — because that confirms every layer at once.

**Use Sysmon or auditd, and say which.**

| Platform | Telemetry source | What it adds |
|---|---|---|
| Windows | Sysmon | Process creation, network connections, file events — far richer than default Windows logs |
| Linux | auditd | The equivalent event stream |

Naming the telemetry source and the specific event IDs you used is the
difference between two sentences:

| Sentence | What it proves |
|---|---|
| "I installed Wazuh" | Very little |
| "I configured Sysmon with a process-creation configuration and wrote a rule matching Event ID 1" | Specific, verifiable skill |

The second is what a hiring manager is listening for.

**Choose three rules that demonstrate three different skills.** Three variations
of the same detection show one skill.

| Rule | What it proves |
|---|---|
| **1. A modified built-in rule** — change a stock Wazuh rule's level, or add a field match | You can read someone else's XML and change it deliberately |
| **2. A custom rule for a specific behaviour** — for example, a command shell spawned as a child of a productivity application, a classic malicious macro pattern | You understand what you are detecting, and why |
| **3. A rule with a tuning story** — a rule you wrote, saw fire noisily on benign activity, and then refined with a whitelist | Judgement — the rarest and most valuable of the three |

That third rule is worth dwelling on. Anyone can make an alert fire. The skill
employers pay for is making alerts fire *usefully*.

Demonstrating that you understand false positives — because you created one and
then fixed it — is direct evidence of that skill. Document the before and after:
the rule as originally written, the benign activity that tripped it, and the
exclusion you added.

**Generate events safely, and be explicit about it.** Run your trigger in an isolated VM with no network route to anything real. Never test detections against a production system, an employer's network, or a live service — this is both an ethics matter and, in some jurisdictions, a legal one. State in the report that the events were self-generated in an isolated lab.

**The report's centrepiece should be an investigation, not an installation.** The installation is the prerequisite; the value is in what you did when the alert fired.

Take one alert end to end:

| Step | What to document |
|---|---|
| **Trigger** | What triggered it |
| **Raw log line** | The raw log line behind it |
| **Checks** | What you checked next — process tree, user context, network connections, file hashes |
| **Conclusion** | What you concluded |
| **Verdict** | Critically, whether you decided it was a true or false positive, and how you justified that call |

That narrative is a miniature version of the daily work of a SOC analyst, and a reviewer reading it can see whether you think like one.

#### Project 2 — Network traffic analysis

Wireshark work has a specific failure mode: it turns into a tour of Wireshark's
features. The report becomes *"here is a DNS query, here is a TCP handshake,
here is a TLS ClientHello"* — a textbook recap that demonstrates you can apply
filters, and nothing else. Reviewers see this constantly, and it is the weakest
kind of portfolio entry.

The fix is to analyse traffic **as a story about behaviour**, not as a catalogue
of protocols. Pick a scenario and follow it.

**Three scenarios that work**, all safe to generate in your own lab:

| Scenario | What you capture | The interesting questions |
|---|---|---|
| **A name-resolution investigation** | Browse to a domain: the DNS query and response, the resolved address, the TCP handshake, the TLS negotiation including SNI, the HTTP request if unencrypted | Which resolver was used? Was the response cached? Did anything resolve that should not have? What did the certificate chain tell you? |
| **A beaconing pattern** | Periodic connections from a lab host — a scheduled request to a fixed address at a regular interval | The interval, the jitter, the payload size, the destination consistency. Attackers introduce jitter precisely to defeat this analysis |
| **Cleartext credential exposure** | A deliberately insecure login over HTTP, then the same transaction over HTTPS | Show the credential in the packet bytes, then show it unreadable. Makes TLS concrete in a way reading about it does not |

The name-resolution scenario is how you determine *what a host was talking to*
when the logs are missing. The beaconing scenario is a small piece of genuine
threat-hunting reasoning.

**Include the filters, and explain what each one hunts for.**

| Filter | What you were looking for |
|---|---|
| `dns` | Name-resolution activity |
| `tcp.flags.syn == 1 && tcp.flags.ack == 0` | Connection attempts |
| `tls.handshake.extensions_server_name` | Which hostname was requested over TLS |
| `http.request.method == "POST"` | Data being submitted |
| `ip.addr == 192.168.56.10` | Everything involving one host |

Each should appear in the report next to a sentence saying what you were looking
for when you used it. A filter list with no explanation is a cheat sheet, not
evidence of skill.

**Commit the pcap.** The capture file is the artifact. Anyone can write a
paragraph claiming they saw a suspicious pattern; the pcap lets a reviewer verify
it. Add a note recording how the traffic was generated, so the capture is
reproducible.

#### Project 3 — The incident report

This is the project that most closely resembles the actual job. For Path A it
may be the single most important artifact in your portfolio.

The task list allows a blue-team lab platform or your own Wazuh lab. Both work,
and the choice affects the framing.

| Approach | Strength | Weakness |
|---|---|---|
| **A platform lab** (CyberDefenders, BTLO, LetsDefend) | Realistic scenario with realistic artifacts, and a known answer to check against | The scenario is shared — thousands have written it up — so it shows skill but not originality |
| **Your own Wazuh lab** | An original scenario nobody else has | You generated the event, so you know the answer before you investigate |

The strongest version uses a platform lab and goes **beyond** the platform's
questions. Complete the challenge, then write the report the platform did not
ask for: a full timeline with timestamps, an impact assessment for a
hypothetical business, a prioritised remediation list, and a limitations
section.

That combination gives you realistic artifacts *and* original analysis.

**A worked timeline is the core of this report.** A table, in order, with the
evidence for each row:

| Time (UTC) | Event | Source of evidence |
|---|---|---|
| 08:14:02 | User opens attachment from external sender | Mail gateway log, message ID `a3f9…` |
| 08:14:31 | `WINWORD.EXE` spawns `powershell.exe -enc …` | Sysmon Event ID 1, host `LAB-WIN10` |
| 08:14:33 | Encoded command decodes to a download cradle | Local decode, command captured in Event ID 1 |
| 08:14:36 | Outbound HTTPS to `203.0.113.44:443` | Sysmon Event ID 3 / pcap |
| 08:15:10 | Wazuh rule 100002 fires, level 12 | Wazuh alert, rule `100002` |

Then the analysis that follows from it: what the initial access was, what the
attacker did next, whether the activity succeeded, and what data could have been
reached.

Then the question that separates a good report from a great one: **what would
have stopped this, and at which point?**

| Control | Where it breaks the chain |
|---|---|
| An email gateway rule | Before the user ever sees it |
| A macro policy | At document open |
| Application control | At process creation |
| A network block | At the outbound connection |

Naming the control and the stage it intervenes at demonstrates that you
understand defence as a sequence rather than a checklist.

**Include containment and remediation as separate sections, because they are
different things.**

| | Containment | Remediation |
|---|---|---|
| **What it is** | The immediate action that stops the spread | The durable fix |
| **Examples** | Isolate the host, disable the account, block the address | Patch, reconfigure, retrain, add the control |
| **Timescale** | Now | This week, or this quarter |

Beginners merge them. Reviewers notice.

#### Choosing and scoping your specialization projects

The phase asks for one or two additional projects from your path's list. Choose
based on your Phase 5 primary, and choose the one where you can produce
**evidence** — not the one that sounds most impressive.

| Path | Strongest choice | Why, and the key detail |
|---|---|---|
| **SOC** | The phishing triage report | Phishing triage is a large fraction of tier 1 workload. Take a sample from a public corpus such as PhishTank or a platform's sample set, never a live mailbox, and analyse without executing: headers, SPF/DKIM/DMARC results, URLs, attachment type, verdict with reasoning |
| **SOC** (second) | MITRE ATT&CK mapping | Mapping your *own* Wazuh lab's three rules to techniques is more original than mapping a public write-up |
| **GRC** | The risk register | A real entry has an asset, a threat, a vulnerability, a likelihood and impact rating with a stated scale, an existing control, a residual risk, and an owner |
| **GRC** (second) | The acceptable use policy | Deceptively hard — a policy that forbids everything is unusable. Write one a real employee could follow |
| **IT Security** | The vulnerability management report | Its most important section is prioritisation: why you would patch finding 3 before finding 1 |
| **Pentest** | PortSwigger labs | The report matters more than the exploit. Write one lab as a real finding: description, affected component, reproduction, evidence, impact, remediation, and a CVSS vector with reasoning for each metric |
| **Pentest** (second) | OWASP Juice Shop | A broader application to work across, closer to a real engagement |

**The rating scale matters.** *"High"* means nothing unless you have written
down what makes something High.

**On prioritisation:** a report that lists findings by CVSS score alone is a
beginner's report. One that weighs exploitability, exposure, and business
context is not.

**On cost:** a Nessus or OpenVAS scan of your own isolated lab is free and
sufficient.

**Scope ruthlessly, and write the scope down before you start.** The most common failure in this phase is not a bad project, it is an unfinished one. For each project, decide in advance: what is in scope, what is explicitly out, and what "done" means. *"Done" for Project 2 is: a pcap, five filters with explanations, three behavioural findings, and a limitations section.* With that written down, you can stop. Without it, every project expands to fill whatever time you have.

A realistic schedule for the 8–12 weeks, assuming 10–15 hours a week:

- **Weeks 1–4** — Project 1. Week 1 is installation and one log line through the pipeline; weeks 2–3 are the three rules; week 4 is the investigation write-up and the report.
- **Weeks 5–7** — Project 2. Generate the captures, analyse, then write.
- **Weeks 8–10** — Project 3, using whichever lab source you chose.
- **Weeks 11–12** — the specialization project, plus the portfolio polish described in Part 3.

If you fall behind, cut the specialization project to one and shorten the others' scope. Do not extend the timeline indefinitely — a finished three-project portfolio in twelve weeks is worth far more than a five-project portfolio that never ships.

### Part 3 — Packaging it so it gets read

#### The repository is part of the deliverable

The phase's first task is to create the portfolio repo, and it is easy to treat this as a formality. It is not. For the first reader — the one giving you ninety seconds — the repository structure *is* the portfolio.

A structure that works:

```text
cyber-portfolio/
├── README.md                  ← the entry point; this is the most important file
├── wazuh-siem-lab/
│   ├── README.md              ← the full report
│   ├── rules/                 ← the actual XML rule files
│   └── evidence/              ← screenshots, log excerpts, with captions
├── network-traffic-analysis/
│   ├── README.md
│   ├── captures/              ← the pcap files
│   └── evidence/
├── incident-report/
│   ├── README.md
│   └── evidence/
└── specialization/
    └── ...
```

The top-level `README.md` is the one file you should rewrite until it is genuinely good, because it is the only file the first reader is guaranteed to see. It needs, in order: what this is, who you are and what role you are targeting, a list of the projects with one line each and a link, the tools used, and how to reach you. Four paragraphs and a list. Not a life story, and not empty either.

The project-level `README.md` files are the reports themselves. Keeping each report as a directory README rather than a PDF has a practical advantage: GitHub renders it automatically, so the reviewer reads it in the browser with no download, and you get version history for free. The phase's tools table lists Google Docs for PDF output — do that too, at the end, as a downloadable copy for anyone who wants one. Both formats, one source of truth.

#### Writing for the reader who is skimming

Beyond the structure, a few small things disproportionately affect whether a
report gets read.

| Do this | Not this |
|---|---|
| **Start every project README with the Summary** | A preamble about how you became interested in security |
| **Make headings do the work**: `## Finding 2 — Encoded PowerShell execution from a macro-enabled document` | `## Analysis` |
| **Put the most interesting finding first** | Chronological order of discovery — chronology belongs in the timeline |
| **Keep the front page free of unfinished work** | A half-built directory that says "coming soon", which is worse than no directory |

Work on a branch, or in a separate folder, and merge it in when it is done.

#### Honesty, and why it is a competitive advantage

The exit criterion lists honesty as a requirement rather than a virtue. It is
worth being explicit about why.

The reviewer's central question is *can I trust what this person tells me?*
Every claim in your portfolio is a test of that, and the tests are cheap to fail.

| Failure mode | What it looks like | Why it costs you |
|---|---|---|
| **Overstating the environment** | Calling a home lab a "production-like enterprise environment" | Invites a question you cannot answer well |
| **Overstating the finding** | "I detected an active intrusion attempt" when you generated the alert yourself | One follow-up question exposes it |
| **Hiding the limitations** | No limitations section at all | Reads as inexperienced or evasive |
| **Claiming tools you did not really use** | Listing Burp Suite after five labs | You will be asked to defend it in an interview |

Call it a lab, and then explain what you built in it — the second half is what
impresses. Real investigations always have gaps, so the skill being tested is
whether you know where yours are.

List what you can talk about for ten minutes without notes, and nothing else.

**Why honesty is an advantage rather than merely safe.** The alternative is
fragile. An overstated portfolio creates a surface you have to keep defending,
and the first technical interviewer will find the weak point.

A modest, accurate portfolio with real evidence has no weak point to find. It
lets you spend the interview talking about the work instead of protecting a
claim.

#### Proving it in an interview

The checklist's last item — *I can explain every project in interviews* — is the
real acceptance test. Rehearse it before you consider the phase finished.

For each of your three projects, you should be able to answer, out loud, without
notes:

| Question | What it demonstrates |
|---|---|
| **1. What problem did this solve, and for whom?** | One sentence. Tests whether you understand the point |
| **2. What did you actually build or do?** | The method, briefly |
| **3. What was the hardest part?** | Real work. A decoder that would not match, a capture with too much noise, a risk rating you could not justify — far more convincing than a smooth story |
| **4. What would you do differently?** | Reflection, and honesty again |
| **5. What would you do next with more time?** | You understand the work continues — exactly what a junior hire is for |

Notice that none of these questions is "what tools did you use." The tools are
visible in the report.

The interview is checking whether *you* did the work. The way to prove that is to
be able to talk about the moments where it was difficult.

### Key takeaways

- **Doing the work and proving the work are different skills**, and this phase exists to close the gap. Your screen history is invisible to an employer; only the artifacts count.
- **Two readers, two jobs.** The screener gives you under a minute at the repository front page; the hiring manager gives five to ten minutes per report. The README serves the first, the reports serve the second.
- **The reviewer is testing trustworthiness, not brilliance.** They want to know whether your report is accurate and whether you can investigate methodically.
- **Summary first, limitations written last.** The Summary is the only section guaranteed to be read; the Limitations section is the fastest way to sound like an analyst.
- **Impact is the business translation, and beginners under-write it.** Your technical finding is not the point — what it means for the business is.
- **Evidence needs captions and context.** A screenshot with no caption proves nothing. Commit the raw artifacts — rule files, pcaps, log excerpts — because the screenshots are the convenience and the artifacts are the proof.
- **Sanitise before publishing.** Check every artifact for credentials, internal addressing, personal data, and licence keys. A leak is worse than a thin portfolio.
- **Say what is synthetic.** Lab work described accurately earns more credit than ambiguous claims, and costs nothing.
- **Your three Wazuh rules should show three skills:** modifying a built-in, writing a custom detection, and tuning a noisy rule. The tuning story is the rarest and most valuable.
- **The SIEM report's centrepiece is an investigation, not an installation.** One alert taken end to end, with the true/false-positive call justified, is the miniature of the actual job.
- **Analyse traffic as behaviour, not as a protocol tour.** A scenario with a question — what was this host talking to, and why does the pattern look automated — beats a catalogue of filters.
- **The timeline is the core of the incident report**, and the best analysis names what would have stopped the attack and at which stage.
- **Scope ruthlessly and write "done" down before starting.** Unfinished projects are the dominant failure mode in this phase, and a defined done is what lets you stop.
- **The repository structure is part of the deliverable.** Each report as a directory README renders on GitHub, keeps version history, and needs no download.
- **Honesty is a competitive advantage, not just a rule.** An overstated portfolio must be defended; an accurate one lets you talk about the work.
- **Rehearse the five interview questions.** The hardest-part question is where you prove you did the work — tools are already in the report.

### Practice this next

The seven tasks build in a deliberate order — the container first, then the three projects, then the specialization, then the polish that makes all of it readable. Work them in sequence:

1. **Create the portfolio repo before writing any report** (task 1). Structure it as shown in Part 3, and write a first version of the top-level README immediately, even though the projects are empty. Having the container ready means each finished project has somewhere to go, and that alone reduces the chance of abandoning one.
2. **Build Project 1 in the order that fails fast** (task 2): server, one agent, one log line all the way through the pipeline, and only then the three rules. Write the investigation narrative around a single alert, and include the tuning story for your third rule — the one where you created a false positive and then fixed it.
3. **Build Project 2 around a scenario, not a protocol list** (task 3). Pick one of the three scenarios in Part 2, generate the traffic in your isolated lab, commit the pcap, and write five filters with a sentence each explaining what they hunt for.
4. **Complete one blue-team lab and go beyond its questions** (task 4). Answer the platform's prompts, then write the report it did not ask for: a timestamped timeline table, a business impact statement, separate containment and remediation sections, and a limitations section. If you use public phishing samples for any part of this, never open them in a live environment.
5. **Choose your specialization project by evidence, not by impressiveness** (task 5), based on your Phase 5 primary path. Write its scope and its definition of done before you begin, and cut it to one project if the schedule is tight.
6. **Do the evidence and limitations pass** (task 6) on all three reports at once, as a separate review rather than while writing. Check every claim against an artifact, add a caption to every image, sanitise every file, and confirm each report has an honest Limitations and Lessons learned section.
7. **Do the rewrite for a non-technical manager last** (task 7). Read each Summary and Impact section as though you know nothing about security and have three minutes. If you cannot state the business consequence in one sentence, that section is not finished.

Then open `portfolio/cyber/06-portfolio-projects.md`, link the three repository directories, and run the interview rehearsal from Part 3 out loud — all five questions, all three projects, no notes. **The phase is done when you can explain every project in an interview**, not when the files exist. If a project survives the questions, it is finished; if it does not, the gap you found is the last thing to fix.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| GitHub | Publish portfolio | Free | https://github.com/ | Create cyber portfolio repo | Google Drive |
| Wazuh | SIEM project | Free | https://wazuh.com/ | Build SIEM lab report | Splunk free training screenshots |
| Wireshark | Traffic analysis | Free | https://www.wireshark.org/ | Create protocol analysis report | tcpdump |
| CyberDefenders | Blue-team labs | Freemium | https://cyberdefenders.org/ | Complete one reportable lab | BTLO/LetsDefend free |
| PortSwigger Academy | Web labs | Free | https://portswigger.net/web-security | Complete and report 10 labs | OWASP Juice Shop |
| Google Docs | Report writing | Free | https://docs.google.com/ | Write PDF report | LibreOffice |
| diagrams.net | Diagrams | Free | https://www.diagrams.net/ | Draw lab architecture | Excalidraw |

## Free/cheap resources

- Wazuh documentation — https://documentation.wazuh.com/
- Wireshark display filters — https://wiki.wireshark.org/DisplayFilters
- CyberDefenders — https://cyberdefenders.org/
- PortSwigger Academy — https://portswigger.net/web-security
- OWASP report writing references — https://owasp.org/www-project-web-security-testing-guide/
- MITRE ATT&CK — https://attack.mitre.org/

## Hands-on practice tasks

1. Create a cyber portfolio repo/folder.
2. Build Project 1 and write a report.
3. Build Project 2 and write a report.
4. Complete one blue-team lab and write Project 3 incident report.
5. Choose 1–2 specialization projects.
6. Add screenshots, commands used, lessons learned, and limitations.
7. Rewrite reports so a non-technical manager can understand the impact.

## Deliverable / proof of work

A portfolio with at least 3 completed reports:

- `wazuh-siem-lab-report.md`
- `network-traffic-analysis-report.md`
- `incident-report.md`
- Optional specialization reports

## Checklist

- [ ] I created a cyber portfolio repo/folder. <!-- id: cyber-06-c01 energy: normal -->
- [ ] I completed Wazuh SIEM lab report. <!-- id: cyber-06-c02 energy: normal -->
- [ ] I completed network traffic analysis report. <!-- id: cyber-06-c03 energy: normal -->
- [ ] I completed an incident report. <!-- id: cyber-06-c04 energy: normal -->
- [ ] I completed at least one specialization project. <!-- id: cyber-06-c05 energy: normal -->
- [ ] I included screenshots/evidence. <!-- id: cyber-06-c06 energy: normal -->
- [ ] I included remediation advice. <!-- id: cyber-06-c07 energy: normal -->
- [ ] I can explain every project in interviews. <!-- id: cyber-06-c08 energy: low -->

## You're ready to move on when...

You have 3 portfolio reports that are clear, honest, evidence-based, and aligned with your target cyber role.

## Free vs Paid

### What's free and enough

GitHub, Wazuh, Wireshark, PortSwigger, free blue-team labs, Google Docs, and diagrams.net are enough.

### What's paid and why you'd upgrade

Paid lab subscriptions provide more scenarios. They are useful only if you are consistently finishing free projects.

### When it's worth paying

If you used THM Premium in Phase 4/5, do not renew automatically. Finish and polish reports first.
