---
id: cyber-06-portfolio-projects
track: cyber
phase: 6
order: 60
title: "Phase 6 — Portfolio Projects"
duration: "8–12 weeks"
duration_weeks: 12
energy_mix: [low, normal]
deliverable: "portfolio/cyber/06-portfolio-projects.md"
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
| **Clear** | A wall of technical narration with no summary | A reviewer spends about a minute on your project before deciding. If they cannot find the point, the point does not exist |
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

#### The reviewer, and the minute they give you

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

#### Worked example: a weak finding versus a strong one

Rules about writing are easy to agree with and hard to apply. Here is the same finding written twice. The first version is what most beginners produce. The second is the same work, documented properly.

**The weak version.**

```text
## Findings

I analyzed the traffic in Wireshark and found some suspicious activity.
There were DNS queries to a strange domain and a lot of HTTP traffic.
I also saw an encoded PowerShell command which is very dangerous and
indicates a compromise. The system should be patched and users should
be trained. Overall this shows the importance of security monitoring.
```

**The strong version.**

```text
## Finding 2 — Encoded PowerShell execution from a macro-enabled document

Severity: High. Confidence: High for execution; Medium for intent.

**What was observed**
At 08:14:31 UTC, WINWORD.EXE (PID 4488) spawned powershell.exe (PID 5120)
on LAB-WIN10 with the argument -EncodedCommand SQBFAFgAKA... The parent
process had opened a .docm file received from an external sender thirteen
seconds earlier.

**Evidence**
- Sysmon Event ID 1, host LAB-WIN10, 08:14:31 UTC — process creation with
  full command line (evidence/06-sysmon-eid1-encoded-powershell-0814utc.png)
- Original document retained as evidence/sample-0814-invoice.docm
- Decoded command: `IEX (New-Object Net.WebClient).DownloadString(...)`

**Why this matters**
A document reader spawning a command shell is not normal behaviour on any
system. The decoded command retrieves and executes a remote payload in
memory, which means the activity would not necessarily leave a file on disk
for a signature-based tool to find.

**Business impact**
An attacker with this execution path would run code with the privileges of
the logged-in user. On this host that account has read access to the shared
finance directory, so a single opened attachment could expose financial
records without any further exploitation.

**What I checked next**
- Outbound connection to 203.0.113.44:443 at 08:14:36 UTC (Sysmon Event ID 3)
- Whether the payload persisted: no Run key, no scheduled task, no new service
- Whether the host had been patched against the related Office vector

**Limitations**
I could not determine whether the remote payload executed successfully,
because the host had no network capture running and the connection was
encrypted. I also could not verify the document's original sender, as the
message headers were outside the scope of this lab.
```

Now put the two side by side and the differences become teachable.

| Dimension | Weak | Strong | What changed |
|---|---|---|---|
| **Specificity** | "a strange domain", "some suspicious activity" | Named process, PID, exact time, full command line | Every claim is now checkable |
| **Severity** | Implied by "very dangerous" | Stated as High, with confidence separated from severity | A reviewer can disagree with a stated rating; they cannot disagree with an adjective |
| **Evidence** | None cited | Two artifacts referenced by path, with a caption | The claim traces to something in the repository |
| **Root cause** | "the system should be patched" | Explained the parent-child anomaly and why it is abnormal | Names the behaviour, not just the outcome |
| **Impact** | "indicates a compromise" | Explained which account, which data, what an attacker gains | A manager can act on the second |
| **Next steps** | Absent | Three specific checks, each with a result | Shows method, not just a conclusion |
| **Limitations** | Absent entirely | Two honest gaps, each explaining why | Reads as an analyst rather than a student |

**The single sentence that explains the difference.** In the weak version you are asked to *believe* the author. In the strong version you are invited to *check* them.

That is the whole distinction, and it is why an annotated finding beats a fluent paragraph every time. A reviewer who can verify your work does not have to trust you on faith — and that is what makes them comfortable hiring you.

**Three habits that produce the strong version automatically:**

1. **Write the evidence reference before the claim.** If you cannot point to an artifact, you cannot make the assertion.
2. **Separate severity from confidence.** "High severity, medium confidence" is a professional statement. "Critical" alone is an opinion.
3. **Write the limitation even when it feels like a weakness.** Every real investigation has one, and naming it is what proves you understand the boundary of what you did.

#### Repository presentation: the sixty-second scan

A hiring manager opening your repository is doing something specific and fast. Understanding what they scan for lets you design for it.

Here is what happens in roughly the first minute, in order.

| Seconds | What they look at | What they decide |
|---:|---|---|
| 0–5 | The repository name and description | Is this a security portfolio, or a personal scratch folder? |
| 5–15 | The top-level README, first screen only | What is this person's target role, and is there a project list? |
| 15–30 | Whether the projects are named and linked | Can I get to the evidence in one click? |
| 30–45 | One project README's title and Summary | Does this person write clearly about their own work? |
| 45–60 | Whether there is a Limitations section, and evidence files | Can I trust what they say? |

Every one of those decisions is made from the README alone. That is why the top-level README is the file worth rewriting repeatedly.

**What a strong top-level README contains, in order.**

```markdown
# Cyber Security Portfolio — <Your Name>

Aspiring <target role> with two years of remote IT support experience.
This repository documents three self-built lab projects with full evidence.

## Projects

| Project | What it demonstrates | Report |
|---|---|---|
| Wazuh SIEM lab | Detection engineering and alert investigation | [Read](wazuh-siem-lab/README.md) |
| Network traffic analysis | Behaviour analysis from packet captures | [Read](network-traffic-analysis/README.md) |
| Incident report | Timeline reconstruction and response | [Read](incident-report/README.md) |

## Tools used
Wazuh · Sysmon · Wireshark · VirtualBox · MITRE ATT&CK

## About the evidence
Everything here was built in an isolated home lab on host-only networking.
Where work is synthetic, the report says so. Each project lists what I could
not determine.

## Contact
<email> · <LinkedIn or site>
```

Four short sections and a table. Not a life story, and not empty either.

| What a reviewer notices in the first minute | What loses them in the first minute |
|---|---|
| A stated target role in the first two lines | No indication of what role you want |
| A table of projects with one-line descriptions | A wall of prose about your motivation |
| Links that open the reports directly | Folders the reader has to explore |
| An explicit statement about lab conditions | An ambiguous claim that invites suspicion |
| Evidence files visible in each project folder | Only screenshots, with no raw artifacts |
| A Limitations section in each report | Reports that claim complete success |

#### What hiring managers look for, stated plainly

The sixty-second scan is about getting past the filter. This is about what the technical reviewer concludes once they read properly.

| What they are actually assessing | How they judge it from your repository |
|---|---|
| **Can this person investigate methodically?** | Is there a visible order to the work — trigger, evidence, checks, conclusion? |
| **Do they know what they do not know?** | Is there a Limitations section, and is it specific? |
| **Can they communicate to a non-technical reader?** | Does the Impact section stand alone without jargon? |
| **Will they overstate to look good?** | Do the claims match the evidence, including where the evidence is thin? |
| **Do they finish things?** | Three finished projects, not six half-built folders |
| **Will they need less training than the average junior?** | Does the report resemble the format their team already uses? |
| **Are they safe to give production access to?** | Do they state boundaries, and did they stay inside them? |

Notice that **none of these is "do they know a lot"**. Knowledge is assumed to be learnable. What is being assessed is judgement, method, honesty, and follow-through — and all four are visible in how you wrote the report, not in what tools you listed.

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

**Commit the pcap — as `.pcap`, not `.pcapng`.** The capture file is the artifact. Anyone can write a
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
| 08:14:36 | Outbound HTTPS to `203.0.113.44:443` | Sysmon Event ID 3 — the host had no capture running, so the process-network event is the evidence here, not a packet record |
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

#### Project 4 — Threat intelligence briefing *(a fourth project option)*

The phase's required list is three projects plus one or two specialization projects. This is a **fourth full project** you can substitute for a specialization project, or add as a fifth if you want to demonstrate a skill none of the other three cover.

It is a **threat intelligence briefing**: take a real, currently-reported threat and explain what it means for a specific organisation. It is the one project in this phase that produces a document a non-technical executive would actually read.

**Why it exists as an option.** The three required projects are all retrospective — you investigate something that already happened. A threat intelligence briefing is **prospective**, and it exercises a different set of muscles: reading primary sources critically, assessing relevance, and writing for someone who will make a spending decision from your paragraph.

It also fits every path. For SOC it demonstrates that you can turn intelligence into detection priorities. For GRC it demonstrates risk assessment from external input. For IT Security it demonstrates vulnerability prioritisation against a live threat. For pentest it demonstrates that you understand why a finding matters beyond its CVSS score.

**The scope, written down before you start.**

| Element | What it contains |
|---|---|
| **A threat** | One specific, currently-documented campaign, vulnerability, or actor. Not "ransomware" — a named campaign with a CVE or a vendor report |
| **A named organisation** | A fictional but concrete profile: sector, size, likely technology stack, likely data held. Public-sector healthcare, a regional logistics firm, an online retailer |
| **Relevance assessment** | Which of their assets are exposed, and why you believe so. This is the analytical core |
| **Indicators** | Concrete technical indicators from the source — file hashes, domains, event IDs, TTPs mapped to MITRE ATT&CK |
| **Detection opportunities** | What a defender in that organisation could actually log and alert on |
| **Recommendations** | Prioritised, with reasons, and honest about cost |
| **Confidence statement** | What you know, what you inferred, and what you could not verify |

**Where the source material comes from, for $0.** Use primary or near-primary sources rather than news summaries of them.

| Source | What it gives you |
|---|---|
| **MITRE ATT&CK** | Technique descriptions and real-world procedure examples, grouped by actor |
| **CISA advisories** | Joint advisories with concrete IOCs, and the KEV catalog for what is actively exploited |
| **Vendor threat reports** | Companies publish free annual and campaign reports. Read the technical sections, not the marketing |
| **The CVE record and NVD entry** | Affected versions, CVSS vector, and often the vendor's own advisory |
| **CISA KEV** | Whether the threat is confirmed as exploited in the wild — the single most important relevance signal |

**A worked structure.** Notice how much of it is *analysis* rather than summary. A briefing that recites the vendor report is worth nothing; a briefing that says what it means for one named organisation is the whole exercise.

```text
# Threat Briefing — <Campaign or CVE> and <Organisation>

## Bottom line
Two sentences. What the threat is, and whether this organisation should act.
Written for someone who reads only this.

## Why this organisation
Sector, size, stack, and the specific reason this threat is relevant
(or the honest reason it is not).

## The threat, in plain language
What it does, how it spreads, what an attacker gains. No jargon.

## Technical detail
Affected versions, the exploitation path, and the ATT&CK techniques.
This is the section a technical reader checks.

## Relevance assessment
| Their asset | Exposed? | Why |
|---|---|---|
| Internet-facing VPN appliance | Yes | Version X is affected and it is on the perimeter |
| Internal file server | No | Not the affected product |

## Detection opportunities
What to log, what to alert on, and what a false positive looks like.

## Recommendations, prioritised
1. Patch the appliance — highest impact, lowest effort.
2. Enable the specific log source so the detection is possible at all.
3. Only then invest in the longer-term control.

## Confidence and limitations
What the source confirms, what I inferred, and what I could not verify.
```

**The two sections that make it credible, and that beginners skip.**

*The relevance assessment* is where the analytical work lives. It is easy to write "this ransomware is dangerous". It is a skill to write "this ransomware exploits an appliance this organisation runs on its perimeter, at a version confirmed vulnerable, and they hold the patient data the actors target — so this is a top priority this week."

*The confidence statement* is what separates intelligence from opinion. Say what the source actually states, what you inferred from it, and what you could not establish. An honest "I could not confirm whether they run the affected version, so I have listed it as an assumption to verify" is a professional sentence.

| Signal of a weak briefing | Signal of a strong one |
|---|---|
| Summarises a news article | Works from the advisory, the CVE record, and KEV |
| Recommends "patch and train users" | Recommends three specific actions in priority order with reasons |
| Says the threat is "critical" | Says whether it applies *here*, and rates confidence |
| No named organisation | One concrete profile, assessed asset by asset |
| Lists IOCs with no context | Explains what each indicator would look like in a log |

**What it proves in an interview.** This project answers the question every interviewer asks in some form: *can you tell me what matters, and explain why, to someone who is not technical?* That is a scarce skill, and it is the same skill the Impact section of every other report depends on.

#### Choosing and scoping your specialization projects

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

The checklist's eighth item — *I can explain every project in interviews* — is the
real acceptance test. Rehearse it before you consider the phase finished, and pair
it with the ninth, which asks you to answer the likely follow-up questions without
notes. Those two together are the exit criterion.

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

#### Anticipating the follow-up questions

The five questions above are the opening. A real interview continues, and the follow-ups are where most candidates unravel — not because they did not do the work, but because they did not anticipate being asked about it.

Each of your projects invites a specific set of follow-ups. Prepare them per project.

**For Project 1, the Wazuh SIEM lab:**

| Follow-up you will be asked | What a good answer contains |
|---|---|
| "Why did you choose that threshold?" | The reasoning behind your `frequency` value, and what happens at a lower or higher one |
| "What was your false-positive rate?" | An honest number or an honest "I did not measure it systematically, but here is what I saw" |
| "How would you deploy this at scale?" | The manager/agent split, and that one manager would not carry thousands of agents |
| "What would you alert on that you did not?" | One specific gap, showing you still think about it |

**For Project 2, the traffic analysis:**

| Follow-up you will be asked | What a good answer contains |
|---|---|
| "Was that traffic encrypted? How did you tell?" | Whether you saw a TLS ClientHello, and what you could and could not conclude from metadata |
| "How would an attacker defeat this analysis?" | Encryption, jitter, domain fronting, or using a legitimate service |
| "Could this pattern have been benign?" | The alternative explanation you considered, and why you rejected it |
| "Why these filters and not others?" | What each filter was hunting for, not a memorised list |

**For Project 3, the incident report:**

| Follow-up you will be asked | What a good answer contains |
|---|---|
| "How confident are you in the timeline?" | Which rows rest on strong evidence and which rely on inference |
| "What would you have done differently?" | A real decision you would change, with the reason |
| "Was this a true positive?" | Your verdict and the reasoning, stated without hedging |
| "What was the root cause?" | A control gap, not "the user clicked a link" |

**For Project 4, the threat briefing:**

| Follow-up you will be asked | What a good answer contains |
|---|---|
| "How did you decide this was relevant?" | The asset-by-asset reasoning, and what you assumed |
| "What is your confidence?" | What the source confirmed versus what you inferred |
| "What would change your assessment?" | A specific fact that would move it up or down |

**Three general principles for handling any follow-up.**

| Principle | Why it works |
|---|---|
| **Answer the question that was asked, then stop** | Rambling past the answer is what makes a reviewer suspect you are padding |
| **Say "I do not know" when you do not** | A specific "I did not test that, and here is how I would" is stronger than a guess |
| **Never inflate under pressure** | The follow-up exists to test exactly this. One exposed exaggeration costs you the whole portfolio's credibility |

**A preparation method that works.** Write each follow-up question on a card, then answer out loud with no notes. Where you hesitate is where you do not yet understand your own project — and that gap is worth fixing before the interview rather than during it.

#### Writing about work you cannot publish

Not everything you do will be publishable. If you work in IT support at a company with any security function, you may have done real work — a control you implemented, an incident you helped handle — that you cannot put on GitHub.

This is common, and it has an honest answer. Three approaches, in order of preference.

| Approach | How it works | When to use it |
|---|---|---|
| **Describe the shape, not the details** | "I implemented MFA enrolment for a 200-user organisation, including the exception process for users without smartphones" — the method and the scale, with no names, systems, or data | Almost always. This is the default |
| **Build a sanitised equivalent** | Rebuild the same control or investigation in your own lab, with synthetic data, and present that | When the method is the interesting part and the environment is not identifiable |
| **Keep it for the interview only** | Do not publish it. Describe it verbally, at the level of abstraction your NDA or employer policy allows | When any written version would identify the organisation or expose a control gap |

**The rule that keeps you safe: never publish anything you did not build yourself in your own environment.** Your employer's internal addressing, hostnames, tool configurations, ticket contents, and control gaps are theirs. Publishing them is not a portfolio decision — it is a potential disciplinary or contractual matter, and in some cases a legal one.

**What you may say about employer work, without risk:**

| Safe to say | Not safe to say |
|---|---|
| The type of control you implemented | Which product, at which version, with which configuration |
| The approximate scale, rounded | Exact user counts, hostnames, or IP ranges |
| The process you followed | The organisation's actual process documentation |
| That you handled a phishing report | The contents of the reported message |

**How to write the sanitised equivalent honestly.** A rebuilt lab project must say what it is. This paragraph belongs in the Environment section:

> The control described here is one I implemented in a professional
> environment. This repository contains a rebuilt version in my own lab, with
> synthetic data, because the original environment is confidential. The
> method and the exception process are the same; the organisation, systems,
> and data are not.

That sentence does two things at once. It tells the reviewer you have *real* professional experience — which is more valuable than a lab — and it demonstrates that you understand confidentiality as a professional obligation.

**Why this is an advantage rather than a limitation.** A candidate who says "I cannot share the details, but here is the method, and here is a lab version I built to demonstrate it" has just shown an interviewer three things: they have real experience, they understand discretion, and they can rebuild something from scratch. Candidates who accidentally leak their employer's internals have shown only one thing.

**The one thing never to do.** Do not sanitise by deleting a couple of hostnames and calling it done. Sanitisation means the artifact is genuinely non-identifying, and if you cannot make it so, do not publish it. A partial sanitisation is worse than none, because it creates the appearance of care without the substance.

### Part 4 — Build it, step by step

Parts 1 to 3 explained what the portfolio has to do. This part is the actual work, in order, with the commands and the templates you type over.

Work it top to bottom. Do not skip to the reports — the container, the evidence habit and the sanitisation pass are what separate a portfolio that gets read from a folder of screenshots.

#### Step 1 — Create the container first

Create the repository before you have anything to put in it. An empty structure is a commitment device, and it means each finished project has somewhere to go instead of sitting in a downloads folder.

```bash
mkdir cyber-portfolio
cd cyber-portfolio
git init
mkdir -p wazuh-siem-lab network-traffic-analysis incident-report
mkdir -p assets
```

Create a `.gitignore` immediately, because lab work generates files that should never be published:

```gitignore
# Never commit these raw exports.
# Note: save the capture you *do* want reviewed as .pcap, and copy the log
# lines you quote into your write-up — an ignored extension cannot be committed.
*.pcapng
*.evtx
*.log
.env
*.key
*.pem
secrets/
node_modules/
```

The `.gitignore` is not housekeeping. A pcap or an EVTX file can contain real network data, real usernames and real hostnames. Committing one is the most common way a beginner leaks something.

**Check yourself:** `git status` should show the directories and the `.gitignore`, and nothing else.

#### Step 2 — Write the top-level README while the projects are empty

This is counter-intuitive and it works. The README is the page a reviewer actually reads, and writing it first tells you what each project has to demonstrate.

Type over this template. Replace every bracketed section.

```markdown
# Cybersecurity Portfolio

Entry-level security analyst portfolio. Each project below is a lab I built
and documented myself, running on hardware I own.

## Projects

| # | Project | What it demonstrates | Skills |
|---|---|---|---|
| 1 | [Wazuh SIEM lab](wazuh-siem-lab/) | Building detections and tuning out false positives | Log analysis, rule writing, triage |
| 2 | [Network traffic analysis](network-traffic-analysis/) | Answering a question from packet data | Wireshark, protocol analysis, reporting |
| 3 | [Incident report](incident-report/) | Working an incident end to end | Timeline reconstruction, containment, reporting |

## How to read these

Each project folder contains:
- `README.md` — the summary, the question it answers, and the result
- `report.md` — the full write-up with an evidence table
- `evidence/` — screenshots and sanitised artifacts

## Environment

All work is in an isolated lab on my own hardware, using no live or
third-party systems. Sample data is either synthetic or publicly available
training data.

## Contact

[your email] · [your LinkedIn or GitHub]
```

**Why the table matters:** a reviewer gives your repository the minute described earlier in this phase. The table is what they read in that time. If they cannot tell what you can do from three rows, the rest of the repository does not get opened.

#### Step 3 — Build the evidence habit before you need it

The single most common portfolio failure is finishing a project and then discovering you cannot prove any of it. Screenshots taken after the fact look staged because they are.

While you work, keep an evidence log. One line per action, with a timestamp.

| Time | Action | Command or click | Result | Evidence file |
|---|---|---|---|---|
| 14:02 | Started lab VM | VirtualBox → `lab-ubuntu` → Start | VM booted, IP 192.168.56.10 | `01-vm-boot.png` |
| 14:09 | Generated test traffic | `nmap -sS 192.168.56.10` | 3 open ports found | `02-scan.png` |
| 14:15 | Confirmed alert fired | Wazuh dashboard | Rule 5710 triggered | `03-alert.png` |

Rule: **capture at the moment it happens, not afterwards.** A screenshot of a terminal you can no longer reproduce is worth very little, and an interviewer may ask you to reproduce it.

#### Step 4 — The investigation narrative template

Every report in this portfolio follows the same shape. Consistency is what makes three projects read as one body of work rather than three attempts.

```markdown
# [Project name]

## Summary
[Three sentences. What the question was, what you found, what it means.]

## Question
[The specific thing this project answers. One sentence.]

## Environment
[Your lab. Be specific about what is yours and what is synthetic.]

## What I did
[Numbered steps. Enough that someone could repeat it.]

## Evidence
| # | Time | What it shows | File |
|---|---|---|---|
| 1 | 14:15 | Rule 5710 firing on the scan | `03-alert.png` |

## Findings
[What the data actually showed. Facts, not conclusions yet.]

## What this means
[The conclusion, and the business consequence in one sentence.]

## What I got wrong
[The false positive you created and how you fixed it. This section
is the one that gets interviews.]

## Limitations
[What this project does not prove. Be honest and specific.]

## What I would do next
[The obvious next step, and why you did not do it here.]
```

**The "What I got wrong" section is not optional.** Every candidate's portfolio looks polished. Almost none of them show a mistake and its correction, which is the single strongest signal that you actually did the work rather than following a tutorial.

#### Step 5 — Write the tuning story properly

The most valuable 200 words in this portfolio are the account of a rule you wrote that fired on something harmless, and what you changed.

Weak version:

> I tuned the rule to reduce false positives.

Strong version:

> My first rule alerted on any failed login, which fired 340 times in the first
> hour because a service account retries on a schedule. I narrowed it to five
> failures from the same source within sixty seconds, excluding the service
> account by SID (the Windows security identifier for that account). Alerts dropped to two that hour, and both were worth
> investigating. The tradeoff is that a slow password spray — one attempt per
> minute across many accounts — would now be missed, which is why I added a
> second rule for that pattern.

The strong version proves four things: you built it, you measured it, you understand the tradeoff, and you know what your fix does not catch. That last clause is what separates a practitioner from someone who followed instructions.

#### Step 6 — The sanitisation pass, as a checklist

Run this before every commit. It takes two minutes and it is the step people skip.

| Check | Pass condition |
|---|---|
| Hostnames | No real internal names. Replace with `dc01`, `ws01`, `web01` |
| IP addresses | Only RFC 1918 lab ranges (`10.`, `192.168.`, `172.16-31.`) or documentation ranges (`192.0.2.`, `198.51.100.`) |
| Usernames | No real people. `jsmith` becomes `user1` |
| Email addresses | No real addresses, including your own if you did not mean to publish it |
| Screenshots | Re-read every one. Window titles, browser tabs and terminal prompts leak more than you expect |
| File metadata | Check `git log` for your real email if you did not want it public |
| Employer references | Nothing identifying the organisation, the product version, or the actual process |

**Screenshots are the one people get wrong.** A terminal screenshot has your username in the prompt, your hostname in the prompt, and often a real internal IP in the output. Zoom in and check before you commit.

#### Step 7 — Rehearse the five questions out loud

The portfolio is finished when you can talk about it, not when the files exist. Do this aloud, with no notes, for each project.

| Question | What a strong answer does |
|---|---|
| What was the question? | States the specific thing you set out to answer |
| What did you find? | Gives the finding, not the process |
| How do you know? | Points at the evidence, by name |
| What would you do differently? | Names a real mistake or limitation |
| What does this mean for the business? | Answers in consequence, not in tooling |

If you cannot answer the fourth one, your project is missing the "What I got wrong" section or you have not written it honestly. If you cannot answer the fifth, read your own Summary section as though you were a manager with three minutes.

#### A note on what this portfolio does and does not prove

Be precise about this in interviews, because a reviewer will probe it.

| This portfolio shows | This portfolio does not show |
|---|---|
| You can build a lab and run it end to end | Production scale, or data volume beyond your own lab |
| You can write detections and tune them | Tuning against a real queue with a real SLA |
| You can investigate an incident you generated | An incident under time pressure with real consequences |
| You can write for a non-technical reader | Writing reviewed by a security team or an auditor |
| You can handle evidence and sanitise it | Evidence meeting a legal or forensic chain-of-custody standard |

State that boundary yourself, before you are asked. A candidate who says "this is a lab, so it does not show production tuning — but here is how I would approach tuning at volume" is more credible than one who lets the interviewer discover the limit.

### Key takeaways

- **Doing the work and proving the work are different skills**, and this phase exists to close the gap. Your screen history is invisible to an employer; only the artifacts count.
- **Two readers, two jobs.** The screener gives you about a minute at the repository front page; the hiring manager gives five to ten minutes per report. The README serves the first, the reports serve the second.
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

1. Create a cyber portfolio repo/folder. <!-- id: cyber-06-t01 band: quick energy: low -->
2. Build Project 1 and write a report. <!-- id: cyber-06-t02 band: deep energy: high -->
3. Build Project 2 and write a report. <!-- id: cyber-06-t03 band: deep energy: high -->
4. Complete one blue-team lab and write Project 3 incident report. <!-- id: cyber-06-t04 band: deep energy: high -->
5. Choose 1–2 specialization projects. <!-- id: cyber-06-t05 band: quick energy: low -->
6. Add screenshots, commands used, lessons learned, and limitations. <!-- id: cyber-06-t06 band: focused energy: normal -->
7. Rewrite reports so a non-technical manager can understand the impact. <!-- id: cyber-06-t07 band: focused energy: normal -->
8. Write out the follow-up questions each project invites and answer them out loud without notes. <!-- id: cyber-06-t08 band: focused energy: normal -->

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
- [ ] I can answer the likely follow-up questions for each project without notes. <!-- id: cyber-06-c09-followup-questions energy: normal -->

## You're ready to move on when...

You have 3 portfolio reports that are clear, honest, evidence-based, and aligned with your target cyber role.

## Free vs Paid

### What's free and enough

GitHub, Wazuh, Wireshark, PortSwigger, free blue-team labs, Google Docs, and diagrams.net are enough.

### What's paid and why you'd upgrade

Paid lab subscriptions provide more scenarios. They are useful only if you are consistently finishing free projects.

### When it's worth paying

If you used THM Premium in Phase 4/5, do not renew automatically. Finish and polish reports first.
