---
id: cyber-04-hands-on-labs
track: cyber
phase: 4
order: 40
title: "Phase 4 — Hands-On Labs"
duration: "8–12 weeks"
duration_weeks: 12
energy_mix: [low, normal]
deliverable: "portfolio/cyber/04-hands-on-labs.md"
exit_criteria: "You can show a hiring manager logs flowing into a SIEM, explain what triggered an alert, and write a short incident report."
---

# Phase 4 — Hands-On Labs

## Goal of this phase

Move from theory to practical cyber work by building a safe home lab and completing structured blue-team, web, and basic offensive labs.

## Estimated time

**8–12 weeks**. This phase intentionally includes buffer because labs can break.

## Skills you'll gain

- Build and document a safe lab.
- Use Wazuh as a free SIEM.
- Forward logs from Windows/Linux VMs.
- Write 3 simple detection rules.
- Analyze network traffic, alerts, and web vulnerabilities.
- Produce reports instead of just collecting flags.

## Lab setup options

### Minimum hardware path

If your computer is weak:

- Use TryHackMe free rooms in browser where possible.
- Use PortSwigger Academy in browser.
- Use one Ubuntu VM only.
- Use Wazuh only if your machine can handle it, or document a cloud-free install plan.

### Better local lab path

- VirtualBox
- Ubuntu VM
- Windows evaluation VM if available
- Kali VM optional
- Wazuh server VM or Docker install if hardware allows

## Lesson: Hands-On Labs

### Why this lesson exists

Everything up to this point has been preparation. Phases 1 through 3 gave you
vocabulary, plumbing, and the map of the six domains. This phase is where you
build something a hiring manager can look at.

The exit criterion is unusually concrete, and it is worth reading twice:

> You can show a hiring manager logs flowing into a SIEM, explain what triggered
> an alert, and write a short incident report.

Notice that it does not say "you have completed labs." It says you can **show**,
**explain**, and **write**.

| Standard | What it asks for |
|---|---|
| A study standard | "I have completed labs" |
| **A portfolio standard** | "I can show it, explain it, and write it up" |

This is the phase where the curriculum stops being about what you know and
starts being about what you can demonstrate.

#### Why this phase is 8–12 weeks when others are 4–6

The honest reason is stated in the phase itself: *labs can break.* And they will.

| What breaks | Why |
|---|---|
| Wazuh's installer | Fails on a machine with too little RAM |
| The agent connection | Blocked by a firewall rule you did not know existed |
| A VM | Refuses to boot after an update |

None of this means you are doing it wrong. **Troubleshooting the lab is part of
the lab.**

The buffer is deliberate. Learning to work through a broken environment
methodically is itself a job skill, because production systems break too.

#### The strategic point about what you are building

There are two kinds of cyber learner, and the difference is visible from across
a room.

| The collector | The builder |
|---|---|
| Gathers flags and course completions | Produces artifacts |
| A TryHackMe badge | A lab diagram, detection rules with reasoning, an incident report about something they actually observed |
| Tells an employer you followed instructions | Tells them you can do the job |

The phase's deliverable is entirely the second kind. The goal is stated plainly
in the skills list: **produce reports instead of just collecting flags.**

#### On hardware, and why the phase offers two paths

The `## Lab setup options` section gives a minimum path and a better local path.
This is not a polite formality — it is a recognition that the learner this
roadmap is written for may not have a powerful machine.

| Your RAM | What is realistic |
|---|---|
| 16 GB | The full local lab comfortably |
| 8 GB | The SIEM and one agent, if you are careful |
| 4 GB | Not the local lab — use browser-based labs instead |

Wazuh with a Windows VM and a Linux VM realistically wants 8–16 GB.

**If you have 4 GB, the curriculum explicitly permits you to document that
limitation instead of pretending otherwise.** That is not a lesser outcome.

> I planned a Wazuh deployment in detail and documented why my hardware could
> not host it, then built the equivalent understanding in browser-based labs.

That is a truthful, defensible position — and truthfulness about limits is
something interviewers respect far more than a vague claim to have done
everything.

**Time to complete:** 60–100 hours across the phase, spread unevenly.

| Work | Shape of the effort |
|---|---|
| The lab build | Front-loaded; can consume a whole weekend if something goes wrong |
| The labs themselves | Steady |
| The writing | Where most learners under-invest, and where most of the portfolio value actually is |

### Part 1 — Design the lab before you build it

#### Why the diagram comes first

Phase task 1 is to build a **lab diagram before installing anything**. This
ordering is the single most important piece of advice in the phase.

Building first and documenting later produces a mess you cannot describe.
Designing first forces you to answer questions that will otherwise ambush you
mid-install:

| Question | Why it matters later |
|---|---|
| How many machines, and what is each one *for*? | Determines your RAM budget |
| How do they reach each other, and the internet? | Determines your adapter setup |
| Where does the traffic get observed? | Determines where the agent goes |
| What are the addresses, and do they survive reboots? | Determines whether your rules keep working |

A lab diagram is a network diagram with purpose labels. It does not need to be
pretty — a hand drawing photographed, or a diagram in any free tool, is fine.

What it needs is: **each host, its role, its IP, its network, and the direction
of the log flow.** Here is a realistic minimal lab that matches the phase's
"better local path":

```text
                    ┌─────────────────────────────┐
                    │      Host machine (your PC)  │
                    │      VirtualBox              │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │   Host-only network          │
                    │   192.168.56.0/24            │
                    └──┬────────────┬───────────┬──┘
                       │            │           │
              ┌────────┴───┐  ┌─────┴─────┐ ┌───┴────────┐
              │ Wazuh      │  │ Ubuntu    │ │ Windows    │
              │ server     │  │ victim    │ │ victim     │
              │ .10        │  │ .20       │ │ .30        │
              │ SIEM       │  │ sshd,     │ │ Sysmon,    │
              │            │  │ cron      │ │ Event Log  │
              └────────────┘  └───────────┘ └────────────┘
                    ▲              │             │
                    └──────────────┴─────────────┘
                       agent log forwarding (1514/tcp)
```

Three design decisions in that diagram are worth understanding, because each one
is a real trade-off you will meet in professional environments.

| Decision | Why it is right |
|---|---|
| **A host-only network** | Host-only gives your host and the VMs a private network with **no route to your real network**. For a lab containing deliberately vulnerable machines, that isolation is the point: nothing you run can reach anything real |
| **The SIEM as its own VM** | Wazuh's server is resource-hungry, and it is the machine whose logs you care about least. Keeping it separate means you can snapshot and rebuild it independently — and it mirrors how SIEMs are deployed in reality: a central collector, separate from the endpoints it monitors |
| **A direction to the log flow** | The arrow points *from* victims *to* the SIEM. This sounds trivial and it is not |

**On the network:** you will still need NAT or a second adapter on the VMs that
must download updates. A common and effective pattern is **two adapters per
VM** — host-only for lab traffic, NAT for internet access.

**On the log flow direction:** it determines which firewall rules you need, which
way the agent connects, and where you look when it does not work.

Most log-forwarding failures are a direction problem — the agent cannot reach the
manager because you opened the port the wrong way, or a firewall on the victim
is blocking outbound traffic.

#### Static addressing, and why DHCP will waste your weekend

Give the lab VMs **static IP addresses**, or configure DHCP reservations.

This is a small decision with a large payoff. Your detection rules, your
documentation, and your screenshots will all reference IP addresses. If those
change on every reboot, your notes become wrong and your rules stop matching.

| | Static addresses | DHCP without reservations |
|---|---|---|
| Your notes | Stay accurate | Go stale on reboot |
| Your detection rules | Keep matching | Silently stop matching |
| Reproducibility | A reader can rebuild your lab | Nothing is reproducible |

It is also a small lesson in professional practice. In real environments,
servers have stable addresses precisely so that monitoring and rules can depend
on them.

#### Recording baseline state

Before you install anything, note what "clean" looks like: the OS version, the
services running, the listening ports.

This is the **baseline** concept from Phase 3's endpoint material. Building it
explicitly is what makes it possible to detect change later.

A practical method:

| Platform | Command |
|---|---|
| Linux VM | `ss -tulpn` |
| Windows VM | `netstat -ano` |

Save the output to a file in your notes, and keep it. When you later generate a
test event, you will be able to say precisely what changed.

### Part 2 — Building the lab: VMs, and installing a SIEM

#### Getting the VMs running without losing a weekend

The installation order that causes the least pain:

| Order | Step | Why this order |
|---|---|---|
| 1 | Install VirtualBox on the host | Nothing else works without it |
| 2 | Create the host-only network first, in VirtualBox's network settings | Doing this afterwards means editing every VM's configuration |
| 3 | Install Ubuntu Server (no desktop) as the SIEM host | The desktop consumes RAM the SIEM needs, and you will administer it over SSH, which practises Phase 2's skills |
| 4 | Snapshot immediately after install, before configuring anything | The single highest-value habit in the phase |
| 5 | Install the victim VMs, snapshot them too, and install Sysmon on the Windows one | Same reasoning |

**Why step 4 matters most.** Virtual machines are used for security work
specifically because they are **reversible** — that is what makes it safe to run
malicious code or break a configuration.

A learner who snapshots before each experiment can be fearless. One who does not
will hesitate, and hesitation is what stalls progress. Take the snapshot.

**On obtaining Windows.** Microsoft publishes free **evaluation** virtual
machines and ISOs for testing, which is what the phase's "Windows evaluation VM
if available" refers to.

| Situation | What to do |
|---|---|
| You have a Windows evaluation VM | Use it |
| You do not | The Linux victim alone is sufficient |

Wazuh monitors Linux just as well, and you can complete the whole
log-forwarding and detection-rule exercise with a single Ubuntu agent.

**Do not let a missing Windows VM stop you.** The deliverable asks for logs from
"one Windows or Linux VM."

#### What Wazuh is, and what it is not

**Wazuh** is a free, open-source **SIEM** — Security Information and Event
Management — combined with **XDR** (Extended Detection and Response)
capabilities.

Recall the division of labour from Phase 3: Sysmon *records* endpoint activity,
AV *blocks known bad*, EDR *detects behaviour*. Wazuh's role is different again.

| Wazuh's job | What it means |
|---|---|
| **Collect** | Receives logs from many sources: Linux agents, Windows agents, Sysmon events, firewalls, web servers |
| **Normalise** | Parses wildly different log formats into a common structure, so a Windows event and an SSH failure become comparable records |
| **Analyse** | Applies **decoders** (extract fields from raw log lines) and **rules** (match patterns and assign severity) |
| **Alert** | When a rule matches, generates an alert visible in the dashboard |
| **Retain** | Stores everything, which is what makes after-the-fact investigation possible |

**Two components to keep straight**, because the vocabulary appears throughout
the Wazuh documentation:

| Component | What it is |
|---|---|
| **The Wazuh manager** | The server. Receives events, applies decoders and rules, generates alerts |
| **The Wazuh agent** | A small program on each monitored machine. Watches log files and the event log, forwards entries to the manager on port 1514 |

That manager/agent split is why the lab diagram has a direction. The agent
*initiates* the connection outward to the manager.

Which means the firewall rule you need is for the victim to reach the manager's
port 1514 — not the reverse. Getting this backwards is one of the most common
setup failures.

**A note on resource planning.** Wazuh's official **quickstart** (linked in the
resources) is the correct path. It offers an all-in-one installation that puts
the manager, indexer, and dashboard on one machine.

Be aware that the indexer is the memory-hungry component — it is a search engine
— and that the documented minimum requirements are real rather than
conservative. If your machine cannot meet them, the honest options are:

| Option | What you lose |
|---|---|
| Run only the manager without the indexer | The dashboard, but you keep the alerting |
| Use Docker with tight memory limits | Some setup simplicity |
| Plan the install and document the limitation | Nothing — this is a valid outcome |
| Defer to browser-based labs | The local build, but not the understanding |

Any of these is a legitimate outcome.

#### Source, decoder, rule: how detection actually works

This is the conceptual core of the phase. Understanding it is what turns
"I installed a SIEM" into "I can write detection."

The pipeline, in order:

```text
Log source → event arrives → decoder extracts fields → rule matches → alert
```

A **decoder** turns a raw log line into structured fields. Consider a real SSH
failure:

```text
Failed password for invalid user admin from 203.0.113.45 port 51234 ssh2
```

A decoder extracts `user=admin`, `srcip=203.0.113.45`, `srcport=51234`.

Without this step, the line is just text and you cannot write conditions against
it. Wazuh ships with hundreds of decoders for common log formats — which is why
it can understand Windows events and `sshd` logs out of the box.

A **rule** then tests those fields and decides whether the event matters. The structure, in Wazuh's XML format:

```xml
<rule id="100001" level="10" frequency="6" timeframe="120">
  <if_matched_sid>5710</if_matched_sid>
  <same_source_ip />
  <description>Repeated SSH failures for non-existent users from same source</description>
  <mitre>
    <id>T1110</id>
  </mitre>
</rule>
```

Reading that rule piece by piece, because every part matters:

- **`id`** — custom rules conventionally start at 100000, because the range below is reserved for the shipped ruleset.
- **`level`** — severity, 0–15. Wazuh's scale: 0 is ignored, 3 is informational, 7 is notable, 10 is high, 12+ is critical. The level determines whether anyone is woken up.
- **`frequency` and `timeframe`** — this rule fires only on the **6th** matching event within **120 seconds**. That is what makes it a behavioural rule rather than a single-event rule.
- **`if_matched_sid`** — matches against rule **5710**, the built-in rule for "attempt to login using a non-existent user." So this rule is *built on top of* an existing rule rather than on raw log text. This is the key technique: **you compose new detections from the primitives the platform already provides** instead of writing regex against log lines.
- **`same_source_ip`** — all six events must share a source address. Without this, six failures from six different attackers would trigger it. This single clause is what turns "some failures happened" into "someone is spraying."
- **`mitre`** — maps the detection to **T1110, Brute Force** in MITRE ATT&CK. Phase 1 introduced ATT&CK as a shared vocabulary; this is what using it looks like in practice. It means an analyst who sees this alert immediately knows what class of behaviour it represents.

**That rule is a template for the whole exercise.** The phase asks for three detection rules, and the point is not the XML syntax — it is that you chose a behaviour worth detecting, expressed it as a condition over fields, set a severity that reflects its importance, and linked it to a framework. In an interview, explaining *why* you wrote that rule and why `frequency="6"` rather than `frequency="1"` is a far stronger answer than showing the code.

#### Choosing what to detect

The phase's task 5 lists four safe events to generate: a failed login, a new user, a suspicious command string, and a service restart. Each is a good choice for a specific reason, and understanding the reason is what makes the three rules you write defensible:

- **Failed login** — the highest-volume real-world signal, and the one where *pattern* matters more than any single event. Your rule should encode a threshold, as the example above does.
- **New user created** — a persistence technique (Phase 3 listed it as ATT&CK-adjacent behaviour: account creation for continued access). The important detail is that a new user is *legitimate administration* most of the time, which makes it a perfect example of a rule that must be tuned rather than a rule that simply fires.
- **Suspicious command string** — detecting known-abused tooling. Restrict it to your own lab notes and never point it at anything you do not own.
- **Service restart** — availability-relevant, and a useful case for discussing why a restart matters in some contexts (a database) and not others (a printer spooler). It teaches that **not every detection should be an alert**; some are just records.

The rule-writing discipline, in five questions you should be able to answer for each rule you write:

1. **What behaviour am I detecting?** Not "failed logins" but "repeated failures against multiple accounts from one source."
2. **What is the false-positive cost?** Who legitimately triggers this? A password-spraying rule will fire during a real user's forgotten-password morning. How will you tune it?
3. **What severity, and why?** A level 12 alert should mean someone gets woken up. If everything is critical, nothing is.
4. **What should the responder do?** A rule without a response is a notification nobody reads.
5. **How would I test it?** You will generate the event deliberately and watch the rule fire — the phase's tasks 5 and 6 are a matched pair for this reason.

### Part 3 — Generating evidence, and the discipline of writing it up

#### Triggering events safely, and reading the result

Phase task 5 asks you to generate safe test events, and "safe" is doing real work
in that sentence.

On your own isolated lab VMs, you can deliberately fail logins and create users.
Every one of those actions is a crime on a system you do not own. Phase 2's
boundary still applies, and this phase is where the temptation to test a rule
against something real is highest — resist it completely.

The method is the same loop a detection engineer uses professionally.

| Step | Action | Why this step exists |
|---|---|---|
| 1 | **Generate one event** on the victim VM — for example, `su - fakeuser` with a wrong password | You need a known event to trace |
| 2 | **Find it in the raw log** on the victim (`/var/log/auth.log`, or Event Viewer) | Proving it exists *at the source* is what lets you isolate a forwarding failure from a detection failure |
| 3 | **Find it in Wazuh**, first as a raw event, then as a decoded event with fields extracted | Confirms the pipeline works |
| 4 | **Check whether a rule fired.** If no, ask whether no rule exists for it | Often the honest answer — and the reason you are writing your own |
| 5 | **Write or modify a rule** so that it does, then repeat from step 1 | Closes the loop |

That loop — generate, observe at the source, observe in the pipeline, adjust — is
the whole of detection engineering. Doing it three times by hand teaches more
than reading any amount of documentation about it.

**A note on screenshots.** The deliverable asks for them, and they are your
portfolio evidence. Take them at the moment the thing works, and annotate them
in your notes so a reader who was not there understands what they are looking at.

| Screenshot quality | Value |
|---|---|
| Annotated, with a caption explaining what the alert means | Worth ten unannotated ones |
| Unannotated | Proves nothing to a reader who was not present |

Remember that a screenshot proves a state, not an understanding. The explanation
in your write-up is what carries the value.

#### Writing the incident report

The final artifact, and the one that most directly matches the exit criterion.
Phase 3 covered report structure; here it must come from something you actually
observed in your lab, which makes it real in a way a mock is not.

A structure that works, adapted to a lab incident:

| Section | What goes in it |
|---|---|
| **Summary** | One paragraph, plain language: "A brute-force attempt against SSH on the Ubuntu victim was detected by a custom Wazuh rule at 14:32 UTC. No access was gained." |
| **Detection** | Which rule fired, at what level, and **what triggered it**. Explain the `frequency` threshold and the `same_source_ip` clause in your own words |
| **Evidence** | The log lines and the alert, quoted, with timestamps in UTC |
| **Timeline** | A short table, as in Phase 3 |
| **Impact** | In a lab, honestly: none. Saying so is correct and professional |
| **Root cause** | The control gap. For brute force, the honest answer is usually that a control was *absent* — no key-only SSH, no fail2ban — and your detection is what surfaced the behaviour |
| **Recommendations** | Specific and prioritised. "Disable password authentication in favour of keys" is a recommendation; "improve SSH security" is not |

Two things make a lab report read as professional rather than academic.

First, **UTC timestamps everywhere**, stated explicitly. Second, **an honest
impact statement**.

A report that says "this was a controlled test, no impact, and here is what the
detection would have caught in production" demonstrates exactly the judgement an
employer wants. It is far more credible than manufactured drama.

Do not inflate a lab event into a breach narrative; an interviewer will see
through it instantly.

#### Blue-team labs and web labs: different skills, both required

The phase asks for **10 PortSwigger Apprentice labs** and **2 free blue-team
labs** (from CyberDefenders, Blue Team Labs Online, or LetsDefend).

These two families teach genuinely different things, and the combination is
deliberate.

| | PortSwigger labs | Blue-team labs |
|---|---|---|
| **Subject** | Web security — Phase 3's Part 4, made concrete | The defensive side |
| **Format** | Browser-based, no lab hardware, each with a defined objective | You are given evidence — disk images, memory captures, logs, PCAPs — and asked what happened |
| **Your task** | Find and exploit the vulnerability | Determine what occurred and prove it |
| **Closeness to the job** | Useful, especially for pentest | Much closer to daily SOC analyst work |
| **Skills exercised** | Web attack techniques | Reading logs, correlating timestamps, interpreting traffic, writing conclusions |

The count went from five to ten because by now you have the fundamentals and can
work faster.

**The write-up pattern** is the one from Phase 3: what the vulnerability was, how
you found it, the payload, and the fix. Since web security is your strongest
area, use it to build confidence and volume in your portfolio.

**Blue-team write-ups are the most directly employable artifacts you will produce
in this phase.** A write-up that says "I identified the initial access vector,
the persistence mechanism, and the exfiltration destination, and here is the
evidence for each" is a close simulation of what an L1 analyst produces.

Do these two properly rather than rushing them. If the phase forces a choice
about where to spend time, spend it here.

**On TryHackMe.** The Free vs Paid section notes this is the first phase where
**one month of TryHackMe Premium may be worth it** — but only after the
prerequisites in `WHEN-TO-BUY-THM-PREMIUM.md`. Read that file before spending
anything.

| | Free rooms | Premium |
|---|---|---|
| Coverage | Pre Security, Cyber Security 101 — the guided-lab ground adequately | Convenience and more targets |
| Cost | $0 | Paid |

Every other tool in this phase is free. Premium buys convenience, not a
capability you cannot otherwise build.

### Key takeaways

- **The exit criterion is a demonstration, not a completion.** Show logs flowing, explain an alert, write a report. Badges are not the deliverable.
- **Design the lab before installing anything.** The diagram forces you to answer addressing, connectivity, and log-flow questions before they ambush you mid-install.
- **Host-only networking is what makes the lab safe.** No route to your real network is the entire point when the VMs are deliberately vulnerable.
- **Static addresses keep your rules and your notes valid.** Reproducibility is the reason servers have stable addresses in production too.
- **Snapshot before every experiment.** Reversibility is why VMs are used for security work; it is what lets you be fearless.
- **Wazuh is manager plus agent, and the agent initiates the connection.** That direction determines your firewall rules and is the most common setup failure.
- **Source → decoder → rule → alert** is the detection pipeline. Decoders extract fields; rules test them; without decoding you cannot write a condition.
- **Compose rules from existing rules.** `if_matched_sid` against a built-in rule, plus `frequency` and `same_source_ip`, is how a real behavioural detection is built — and `same_source_ip` is what turns noise into signal.
- **Severity must mean something.** If everything is level 12, nothing is. Not every detection deserves an alert; some are just records.
- **Document the hardware limitation honestly if it applies.** "I documented why my machine could not host a Wazuh install" is a legitimate, respected outcome — far better than a vague claim.
- **Troubleshooting the lab is part of the lab.** The 8–12 week estimate exists because labs break, and working through that methodically is a job skill.
- **Find the event in the raw log before blaming the SIEM.** Isolating a forwarding failure from a detection failure requires checking both ends.
- **Honest impact statements make reports credible.** "Controlled test, no impact, here is what it would have caught in production" is stronger than manufactured drama.
- **Blue-team labs simulate the actual job** more closely than offensive ones. If time is short, this is where to spend it.

### Practice this next

The nine tasks form a dependency chain — later tasks genuinely cannot be done without earlier ones — so the order is not a preference:

1. **Draw the diagram first** (task 1). Even a rough one. Decide machine roles, addresses, and log-flow direction before touching VirtualBox, because changing these later means rebuilding.
2. **Build the VMs, creating the host-only network before the VMs** (task 2), and **snapshot immediately after each install**. If you have 4–8 GB of RAM, start with Ubuntu Server alone and add the SIEM only if it fits.
3. **Attempt Wazuh next** (task 3) using the official quickstart. If it fails on resources, do not force it — write down exactly what you tried, what the machine did, and what the requirement is. That write-up satisfies the checklist item and belongs in the deliverable.
4. **Forward logs from one VM** (task 4), and treat a failure here as diagnostic practice: confirm the event exists in the local log first, then confirm the agent is running, then confirm the connection to port 1514. That order isolates the fault in three steps instead of twenty.
5. **Generate the four test events** (task 5) and find each one in both the raw log and Wazuh. Watch for an event that matches *no* rule — that is your opening for step 6.
6. **Write the three detection rules** (task 6), using the `if_matched_sid` + `frequency` + `same_source_ip` pattern as a model. For each, be able to answer the five questions from Part 2, and **test each one by regenerating its event**. A rule you have not seen fire is a rule you have not written.
7. **Run the PortSwigger labs throughout** (task 7), ten Apprentice level, written up in the Phase 3 format. These need no hardware, so they are what you do on days when the lab is broken — which is a real scheduling benefit, not just a fallback.
8. **Do the two blue-team labs** (task 8) as close to the end as you can, because they exercise everything: log reading, timeline building, network interpretation, and reporting. Write them up as if for an employer, because that is exactly what they are.
9. **Write the incident report last** (task 9), from a real event in your own lab, using your own detection rule. Use UTC, state the impact honestly, and check the root-cause line names a control gap rather than a user action.

Then assemble `portfolio/cyber/04-hands-on-labs.md` against the deliverable checklist, and read it back asking one question: **if a hiring manager opened this file for ninety seconds, would they see evidence of someone who can operate a SIEM?** If the diagram, the rules with reasoning, and the reports are there, the answer is yes — and you are ready for Phase 5's specialisation choice, which will be much easier to make because you will have discovered which of these activities you actually enjoyed.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Wazuh | Free SIEM/XDR | Free/open-source | https://wazuh.com/ | Install Wazuh, forward logs from a VM, write 3 detection rules | Elastic/Splunk free tier |
| VirtualBox | VM platform | Free | https://www.virtualbox.org/ | Run Windows/Linux lab VMs | VMware Player personal use |
| Sysmon | Windows telemetry | Free | https://learn.microsoft.com/sysinternals/downloads/sysmon | Send process logs to Wazuh | Windows logs only |
| Security Onion | Blue-team monitoring distro | Free/open-source | https://securityonionsolutions.com/software/ | Optional: review docs or install if hardware allows | Wazuh + Wireshark |
| TryHackMe | Guided cyber labs | Free/freemium | https://tryhackme.com/ | Finish free Pre Security/Cyber Security 101 rooms | PortSwigger/CyberDefenders free |
| CyberDefenders | Blue-team labs | Freemium | https://cyberdefenders.org/ | Complete one free beginner lab | Blue Team Labs Online free |
| Blue Team Labs Online | SOC-style labs | Freemium | https://blueteamlabs.online/ | Complete one free challenge | CyberDefenders free |
| PortSwigger Academy | Web security labs | Free | https://portswigger.net/web-security | Complete 10 Apprentice labs | OWASP Juice Shop local |
| OWASP Juice Shop | Vulnerable web app | Free/open-source | https://owasp.org/www-project-juice-shop/ | Run locally and find 3 beginner issues | PortSwigger labs |

## Free/cheap resources

- Wazuh quickstart — https://documentation.wazuh.com/current/quickstart.html
- Wazuh custom rules docs — https://documentation.wazuh.com/current/user-manual/ruleset/rules/custom.html
- TryHackMe free rooms — https://tryhackme.com/
- PortSwigger Academy — https://portswigger.net/web-security
- CyberDefenders — https://cyberdefenders.org/
- Blue Team Labs Online — https://blueteamlabs.online/
- OWASP Juice Shop docs — https://pwning.owasp-juice.shop/

## Hands-on practice tasks

1. Build a lab diagram before installing anything.
2. Install VirtualBox and at least one Linux VM.
3. Install Wazuh using the official quickstart if your machine can handle it.
4. Forward logs from one Windows or Linux VM to Wazuh.
5. Generate safe test events: failed login, new user, suspicious command string in lab notes, service restart.
6. Write 3 detection rules or rule modifications for your lab events.
7. Complete 10 PortSwigger Apprentice labs.
8. Complete 2 free blue-team labs from CyberDefenders/BTLO/LetsDefend.
9. Write one incident report from a lab.

## Deliverable / proof of work

Create `portfolio/cyber/04-hands-on-labs.md` with:

- Lab network diagram
- Wazuh install notes or documented hardware limitation
- Log forwarding screenshot
- 3 detection rules with explanation
- 10 web lab notes
- 2 blue-team lab reports
- 1 incident report

## Checklist

- [ ] I built a lab diagram. <!-- id: cyber-04-c01 energy: normal -->
- [ ] I installed at least one Linux VM. <!-- id: cyber-04-c02 energy: normal -->
- [ ] I installed Wazuh or documented why hardware blocks it. <!-- id: cyber-04-c03 energy: normal -->
- [ ] I forwarded logs from a VM. <!-- id: cyber-04-c04 energy: normal -->
- [ ] I generated safe test events. <!-- id: cyber-04-c05 energy: normal -->
- [ ] I wrote 3 detection rules or rule modifications. <!-- id: cyber-04-c06 energy: normal -->
- [ ] I completed 10 PortSwigger labs. <!-- id: cyber-04-c07 energy: normal -->
- [ ] I completed 2 blue-team labs. <!-- id: cyber-04-c08 energy: normal -->
- [ ] I wrote one incident report. <!-- id: cyber-04-c09 energy: normal -->

## You're ready to move on when...

You can show a hiring manager logs flowing into a SIEM, explain what triggered an alert, and write a short incident report.

## Free vs Paid

### What's free and enough

Wazuh, VirtualBox, Sysmon, PortSwigger Academy, CyberDefenders free labs, BTLO free labs, and TryHackMe free rooms are enough.

### What's paid and why you'd upgrade

TryHackMe Premium unlocks more guided rooms and attack boxes. Burp Pro and paid blue-team platforms add convenience, not required skill.

### When it's worth paying

This is the first phase where **one month of TryHackMe Premium may be worth it**, but only after completing the prerequisites in `WHEN-TO-BUY-THM-PREMIUM.md`.
