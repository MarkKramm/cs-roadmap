---
id: cyber-05-specialization-choice
track: cyber
phase: 5
order: 50
title: "Phase 5 — Specialization Choice"
duration: "4 weeks"
duration_weeks: 4
energy_mix: [low, normal]
deliverable: "portfolio/cyber/05-specialization-choice.md"
exit_criteria: "You can say: “My target cyber role is ____. My portfolio will prove it using these 3 projects: ____.”"
---

# Phase 5 — Specialization Choice

## Goal of this phase

Choose one realistic cyber direction so your next 3–6 months are focused instead of scattered.

## Estimated time

**4 weeks**. Explore all paths lightly, then choose one primary path and one backup.

## Skills you'll gain

- Understand SOC/Blue Team, GRC, IT Security, and Junior Pentest paths.
- Match your strengths to role requirements.
- Build focused portfolio tasks for your chosen path.
- Avoid wasting months switching tools every week.

## Path options

### Path A: SOC / Blue Team

Best if you like logs, investigation, patterns, alerts, and reports.

Core topics:

- SIEM alerts
- Windows/Linux logs
- Phishing triage
- Incident response
- MITRE mapping
- Basic detection rules

### Path B: GRC

Best if you like writing, organization, policies, risk, compliance, and business communication.

Core topics:

- Risk registers
- Security policies
- Control mapping
- Asset classification
- Vendor risk basics
- NIST/CIS/ISO concepts

### Path C: IT Security Analyst

Best if you want a bridge from IT support/sysadmin into security operations.

Core topics:

- IAM/MFA
- Endpoint hardening
- Vulnerability management
- Patch tracking
- Security awareness
- Basic monitoring

### Path D: Junior Pentest Trainee

Best if you like web apps, Linux, scripting, reports, and legal hacking labs. Harder as first cyber job without experience.

Core topics:

- Web vulnerabilities
- Nmap
- Burp Suite
- Basic exploitation in labs
- Reporting
- Remediation advice

## Lesson: Choosing Where to Specialise

### Why this lesson exists

This is the shortest phase in the cyber track — four weeks — and it makes a decision that shapes the next six months and, realistically, the first several years of your career. Most learners rush it. That is the mistake this phase exists to prevent, and this lesson exists to give you a method for avoiding it.

Look at the exit criterion, because it is different in kind from every previous phase: *"My target cyber role is ____. My portfolio will prove it using these 3 projects: ____."* That is not a statement about knowledge. It is a **decision plus a plan**, and it has two halves that must agree with each other. The role is the target; the three projects are the evidence. A learner who can name a target role but not the three projects that prove it has not finished this phase — they have merely expressed a preference.

**Why deciding matters more than deciding correctly.** There is a real anxiety behind this phase: *what if I choose wrong?* The honest answer is that choosing any of these four paths competently beats choosing none of them perfectly, and by a wide margin. The failure mode this phase is designed against is stated in the skills list — *avoid wasting months switching tools every week.* A learner who spends six months sampling SIEMs, then risk registers, then Burp Suite, then back to logs, has built no depth anywhere and has a portfolio that looks exactly like every other beginner's: a scatter of half-finished labs. A learner who picks one path and goes deep for six months has three coherent projects and a story. Employers can tell the difference in about ten seconds.

The four paths also **overlap far more than beginners expect**. Every one of them uses logs. Every one of them requires written reports — the thing Phase 3 emphasised and Phase 4 reinforced. GRC practitioners need to understand the controls they are writing policy about; SOC analysts increasingly do detection engineering that looks a lot like writing rules for compliance. So the choice is about **emphasis and entry point**, not about locking yourself into a sealed box. That should reduce the pressure considerably.

**Time to complete:** roughly 15–20 hours across the four weeks, and this is genuinely the lowest-effort phase in the track. Do not inflate it. The four mini-tasks are small by design — they are tasters, not projects. The 20 job posts are the substantial work, and they are also the part that most reliably changes people's minds about what they want.

**A note specific to your situation.** You are entering from remote IT support, with a web development background, no degree, no certs, and a $0 budget, targeting the Philippines and remote work. Those facts are not neutral in this decision — they make some paths considerably more accessible than others, and this lesson will be direct about which and why. Being honest about the entry barriers is more useful to you than being encouraging about all four equally.

### Part 1 — The four paths, described honestly

#### Path A: SOC / Blue Team

**The work.** A Security Operations Centre analyst monitors alerts. Most of the day is queue-driven: an alert fires, you investigate, you decide whether it is real, you escalate or close it, and you document what you did. The tools are a SIEM, a ticketing system, and endpoint or network telemetry. You saw exactly this in Phase 4 when you wrote a Wazuh rule and then investigated what it caught — that loop *is* the job, at larger scale and with higher stakes.

**What the day actually feels like.** Repetitive, and satisfying if repetition does not bother you. The average alert is a false positive, and a large part of the skill is fast, confident triage — recognising within two minutes that this is a known-benign pattern so you can move to the next. The interesting cases are a minority of the volume and the reason people stay.

**Best fit if:** you like logs, patterns, and investigation; you are comfortable with process and checklists; you are patient with repetition; you are good at writing concise summaries. If you enjoyed Phase 4's blue-team labs more than the PortSwigger labs, that is real evidence.

**Entry reality:** this is the **most common entry point into cybersecurity**, and for this roadmap's reader it is the primary target. The reasons are structural rather than arbitrary: SOC roles are numerous, they are genuinely entry-level, they hire on demonstrable skill rather than degrees, and the work is process-heavy in a way that IT support experience directly prepares you for. Tier 1 analyst roles are the classic first cyber job worldwide.

**Entry barrier:** shift work. SOCs run 24/7, which means nights, weekends, and rotating schedules. This is the single biggest reason people decline SOC roles, and it is worth deciding now whether it is acceptable to you, because it is usually non-negotiable for a tier 1 position.

#### Path B: GRC — Governance, Risk, and Compliance

**The work.** Writing and maintaining policies, running risk assessments, mapping the organisation's controls against frameworks, preparing evidence for audits, and assessing vendors. The deliverables are documents: risk registers, policy sets, control matrices, audit responses.

**What the day actually feels like.** Meetings, writing, and spreadsheets — considerably more of all three than most technical people expect. You will spend your time understanding what the business does, what could go wrong, what controls exist, and how to prove to an auditor that they work. The technical depth required is *conceptual* rather than operational: you need to understand what a control does and whether it is adequate, not necessarily how to configure it.

**Best fit if:** you like writing and organising; you are comfortable in business conversations; you can hold a long document in your head; you are detail-oriented about evidence and consistency. Phase 3's five-risk control-mapping table is a small sample of this work — if that was the part you found unexpectedly enjoyable, take it seriously as a signal.

**Entry reality:** genuinely underrated as an entry point, and **the least crowded by technical candidates**, because most people entering cyber want to do the exciting technical work and overlook it. Demand is strong because every regulated organisation needs it.

**Entry barrier — and this one is real.** Entry-level GRC roles frequently ask for **2–3 years of experience**, and often in audit, compliance, or a business function. The reason is that GRC work requires organisational context: you are advising on risk to a business, and that assumes you understand how businesses work. This makes GRC a harder *direct* entry than SOC, and a very natural **second** role — a common and effective path is SOC or IT security first, then GRC. Do not discard it, but understand it is more often a destination than a door. The exception worth knowing: junior GRC and compliance-analyst roles in banking, BPO, and healthcare do exist, especially in the Philippines where those sectors are large and regulated.

#### Path C: IT Security Analyst

**The work.** This is the bridge role, and for you it is the shortest walk. The work sits between IT operations and security: identity and access management, endpoint hardening, vulnerability management and patch tracking, security awareness, and basic monitoring. You are the person applying security controls to systems you already help administer.

**What the day actually feels like.** Closest of the four to your current IT support work. Tickets, users, systems, and a growing security component. You will deploy MFA, review access, chase patch compliance, harden endpoints, and explain security requirements to colleagues. Less queue-driven than a SOC, less document-driven than GRC.

**Best fit if:** you want to move into security without leaving operations behind; you like hands-on systems work; you are comfortable explaining security to non-technical people. If Phase 3's identity material and Phase 4's hardening work were your favourite parts, this is your path.

**Entry reality:** this is arguably the **most accessible path for your specific background**, and it is the one this roadmap's structure quietly steers toward. Your IT support experience is not a gap to overcome here — it is the primary qualification. Many organisations create this role by promoting a strong support person, and titles vary widely: IT Security Analyst, Security Administrator, Information Security Officer, IAM Analyst, Vulnerability Analyst.

**Entry barrier:** the roles are less standardised than SOC positions, so job titles and requirements vary. There are also fewer of them than SOC roles in absolute terms. But the interview bar is the lowest of the four for someone with your background, because you are being asked to extend skills you already have rather than acquire a new discipline.

#### Path D: Junior Pentest / Offensive Security

**The work.** Testing systems with written authorisation, finding vulnerabilities, exploiting them to demonstrate impact, and writing reports with remediation advice. Tools are Burp Suite, Nmap, and exploitation frameworks. The deliverable is always a report — this is the part beginners underestimate.

**What the day actually feels like.** Far more methodical than the films suggest. A real engagement is mostly reconnaissance, note-taking, careful testing, and then *writing* — often more hours on the report than on the exploitation. Creativity matters, but so does patience and documentation discipline.

**Best fit if:** you like web applications, Linux, and scripting; you enjoy the puzzle of finding a way in; you write well. Given your web development background, the technical material here will come to you faster than to most beginners — you have an advantage in Part 4 of Phase 3's material that is genuinely rare.

**Entry reality — and this is where honesty matters most.** The phase itself flags it: *harder as first cyber job without experience.* That is accurate, and it is worth understanding *why* rather than treating it as gatekeeping. Pentest engagements require judgement: knowing when a finding matters, how far it is safe to go, what the business impact is, and how to phrase a finding so a developer can act on it. That judgement comes from having seen systems in production — from having been the person who had to fix something, or the person who had to defend it. Employers also carry liability for what testers do, so they hire people they can trust with production access, and trust is usually extended on the basis of track record.

This does not mean it is closed to you. It means the realistic route is **not direct**. The common paths in are: IT security or SOC first, then pivot; or build an unusually strong public profile through bug bounties, CTFs, and published write-ups that substitutes for employment history. Both work. What does not work is applying for junior pentest roles with no experience, no certs, and a portfolio of PortSwigger labs — because that describes everyone else applying.

**If pentest is what you genuinely want**, the strategic play is to enter via Path A or C and treat offensive work as a deliberate destination two to three years out, building the web security depth in parallel the whole time. That is slower and it is far more likely to succeed than a direct application.

#### A comparison you can use

| | Path A — SOC | Path B — GRC | Path C — IT Security | Path D — Pentest |
|---|---|---|---|---|
| **Core activity** | Investigating alerts | Writing policy & assessing risk | Applying controls to systems | Finding and reporting vulnerabilities |
| **Main deliverable** | Incident write-up | Risk register, policy, audit evidence | Hardening, IAM, patch compliance | Pentest report |
| **Technical depth** | High (operational) | Low (conceptual) | Medium–high | High (specialist) |
| **Writing load** | Medium | Very high | Medium | High |
| **Ease of entry for you** | **Good** | Hard (often wants 2–3 yrs) | **Best** | Hard as a first role |
| **Main barrier** | Shift work | Experience expectation | Fewer, less standardised roles | Trust and track record |
| **Natural next step** | Tier 2, detection engineering, DFIR | Compliance manager, risk lead | Security engineer, cloud security | Senior pentester, red team |

### Part 2 — How to actually decide

#### The four-axis scoring, and how to use it honestly

Phase task 2 asks you to score each path 1–5 across **interest, difficulty, job availability, and portfolio confidence**. The exercise works, but only if you use the axes correctly, and each one has a trap.

**Interest** is the axis most people over-weight and it is the one they can least trust at this stage. You have done four weeks, not four years. The useful signal is not "which sounds coolest" but **which mini-task from Phase 5 task 1 did you find yourself still thinking about afterwards?** That is behavioural evidence rather than aspiration, and it is worth more than any amount of imagining.

**Difficulty** should be scored as *difficulty of entry for you specifically*, not difficulty of the subject. Path D has a hard entry and moderately hard material. Path B has easy material and a hard entry. These get conflated constantly, and separating them is the whole value of the axis.

**Job availability** must be scored from evidence, not from reputation. This is what the 20 job posts are for, and it is the single most valuable task in the phase. Count actual postings that you could plausibly apply for in the next 6–12 months — not senior roles, not roles requiring a degree you do not have, and not roles in countries you cannot work in. Learners are consistently surprised by which path has real, local, junior-level demand versus which merely has a loud online community.

**Portfolio confidence** answers: *can I produce three projects in this area that a hiring manager would find convincing, within the next six months, on my own hardware and $0?* This is where hardware reality enters. If you cannot run a SIEM on your machine, your Path A portfolio confidence should reflect that honestly — unless you demonstrated the equivalent in browser labs, which Phase 4 explicitly permits.

Two warnings about the scoring. First, **do not average the four scores into a single number and pick the winner.** That arithmetic hides the thing that matters: a path scoring 5 on interest and 2 on difficulty is a different proposition from one scoring 3 and 3, even though both average 3.5. Second, **weight the axes deliberately and write down your weighting.** If you cannot afford a long job search, job availability and difficulty matter more than interest. Saying that explicitly is planning; ignoring it is wishful thinking.

#### Reading 20 job posts properly

This is the task that most reliably changes minds, and it is worth doing methodically rather than skimming. For each post, record:

- **Job title** — and note that titles are inconsistent across companies for the same work.
- **Location and work arrangement** — on-site, hybrid, remote, and whether remote is open to candidates in your country.
- **Years of experience required** — the honest gate. Note how many ask for zero to two.
- **Required skills and tools** — the concrete list. These repeat, and the repeats are your study list.
- **Required certifications** — distinguishing "required" from "preferred" matters enormously.
- **Degree requirement** — and whether it says "or equivalent experience." Many do.
- **What the role actually does**, from the responsibilities text rather than the title.

Then look for patterns, because those patterns are the real output of this task. Which three skills appear in almost every posting? Which certifications are actually demanded rather than mentioned? How many junior roles genuinely exist, and where? Twenty posts across four paths is five each — enough to see a shape, not enough for statistics. Treat it as a directional signal and say so, rather than over-claiming.

A specific note for your market: the Philippines has significant **BPO and shared-services** employment, including security operations centres for multinationals, and a growing banking and fintech sector with real compliance demand. Those two facts make Path A and Path B more available locally than a generic global search would suggest. Remote work for overseas employers is a real option, but note that entry-level remote security roles are the most competitive segment of the entire market — so treat local or hybrid as the practical near-term target and remote as the medium-term goal.

#### Matching your background to a path

This is the part the scoring table cannot do for you, and it is short enough to be decisive. Your specific profile:

- **Remote IT support experience** → strongest asset for **Path C** (direct extension), strong for **Path A** (process discipline, ticketing, working a queue, explaining things to users).
- **Web development background** → real advantage for **Path D**, and useful for **Path A** when investigating web-based attacks, which is most of them.
- **No degree** → least obstructive for **Path C**, then **Path A**. Most obstructive for **Path B**, where audit and compliance cultures still lean on credentials.
- **No certs** → addressable; Phase 7 covers it. Relevant now only in that Path B and Path D postings mention certs more often.
- **$0 budget and unknown hardware** → favours **Path B** (needs no lab at all), then **Path A** and **Path D** via browser labs. **Path C** is the only path that benefits from having real systems, which you may already have access to at work.
- **Burnout-prone, needs visible wins** → favours paths with frequent small completions. Path C and Path A both deliver these; Path D has a longer feedback cycle, and Path B's wins are slow and document-shaped.

Read that list and a conclusion is hard to avoid: **Path C is your best entry, Path A is your most likely first cyber title, and Path D is a two-to-three-year destination rather than a first job.** That is not a prediction about your ability. It is a reading of the market against your actual circumstances.

#### Primary and backup, and why the backup is not a failure

Phase task 4 asks for **one primary and one backup**, and the backup is doing real work rather than being a formality. It means:

- If your primary target has no openings in six months, you have a second portfolio direction rather than a stalled search.
- In an interview, "I focused on SOC, and I also built this GRC artifact because I noticed the role touches compliance" reads as maturity, not indecision.
- You can shift the balance without restarting from zero, because the paths share foundations.

Choose the backup for **adjacency, not contrast**. If your primary is SOC, a GRC backup is sensible — both are investigation-and-reporting work, and many SOC roles touch compliance. A pentest backup is a much bigger pivot. Adjacent means your existing portfolio still contributes.

#### The 90-day plan

Phase task 5, and the artifact that proves the phase produced a decision rather than an opinion. A plan that works has five components:

1. **The target** — the specific role title you will apply for, and the market you are targeting.
2. **The three portfolio projects** — named, not described. These must map to the requirements you found in the job posts, not to what you find interesting. This is the direct answer to the exit criterion's second half.
3. **The skill gaps** — what the job posts ask for that you cannot yet do, listed honestly. This becomes Phase 6's work.
4. **The schedule** — which weeks produce which project, with realistic time given your working hours.
5. **The review point** — a date when you will reassess, and the evidence that would make you change course. Without this, a plan becomes a habit.

That fifth component is the one people omit and the one that keeps the plan honest. A 90-day plan written today is a hypothesis about a market you have sampled, not a fact. Deciding in advance what would falsify it is what makes it a plan rather than a hope.

### Part 3 — Making the choice stick

#### The switching trap

The skills list names the failure directly — *avoid wasting months switching tools every week* — and it is worth understanding the mechanism, because it is a trap that feels like progress.

Every new tool produces a fresh sense of learning. Installing a SIEM, opening Burp Suite for the first time, reading about risk frameworks — each gives the sensation of advancement. Going *deeper* into something you have already started produces no such sensation; it produces the discomfort of doing hard, unglamorous work on material that has stopped being novel. So the switching trap is a preference for the feeling of learning over learning itself, and it is reinforced every time a new tool delivers a quick hit of novelty.

The defences, which are concrete:

- **Commit to the primary path for the full 90 days.** Reassessment happens at the review point, not whenever something new looks interesting.
- **Finish before starting.** One completed project beats three started ones, and this is literally true in a portfolio review — an unfinished project is not a weaker artifact, it is *not an artifact*.
- **Judge progress weekly by artifact, not by activity.** "I watched three hours of SIEM content" is activity. "My detection rule fires on the test event" is an artifact. Only the second is evidence.
- **Expect the dip.** There is a point in every project where the novelty is gone and the work is not yet finished. That dip is not a signal that you chose wrong. It is the normal middle of everything.

#### What "focused" buys you

A concrete comparison, because the difference is dramatic and worth being explicit about. Both learners below spent the same six months and the same hours:

**The scattered learner:** tried Wazuh, then read about GRC frameworks, then did a few PortSwigger labs, then started a Python scripting course, then investigated a CyberDefenders challenge, then returned to Wazuh but had forgotten the configuration. Portfolio: six unfinished things. Interview answer to "tell me about a project": vague. Answer to "why this role": "I'm interested in security."

**The focused learner:** chose Path A, built the Wazuh lab in month one, wrote three detection rules and documented them in month two, completed two blue-team labs and wrote them up in month three, then spent months four to six going deeper on one detection area. Portfolio: three finished, related artifacts with evidence. Interview answer to "tell me about a project": specific, with a decision they made and why. Answer to "why this role": credible, and backed by the portfolio.

Same effort. Same time. The only difference is that the second learner made the decision this phase asks you to make, and then stopped re-making it every week. That is the entire return on four weeks of work.

#### When to revisit the decision

Commitment for 90 days does not mean commitment forever, and knowing the legitimate reasons to change course is as important as knowing the trap. Revisit when:

- **The job market disagrees with you.** You followed the evidence, ran the search, and the postings simply are not there. That is data, not failure. This is exactly what the review point is for.
- **You discover the work is not what you thought.** You did the mini-task and found that the reality of daily SOC triage, or of writing policy documents, is genuinely not for you. Four weeks of exploration is enough to learn this — but only if you actually did the mini-tasks rather than reading about them.
- **A real opportunity redirects you.** Your current employer offers a security-adjacent role, or an opening appears that fits. Take it; circumstances outrank plans.

Revisit at the review point, or when one of those three things happens — not because a different tool looked interesting on a Tuesday.

#### Connecting forward

This phase's output feeds the rest of the track directly, and it is worth seeing the chain, because it explains why a four-week decision phase sits between the labs and the portfolio work.

Your **primary path** determines **Phase 6's three portfolio projects** — that is the exit criterion's second half, and Phase 6 is where you build them. Your **skill gaps** determine what Phase 6 emphasises and what you keep studying afterwards. Your **certification decisions in Phase 7** should follow the path: Security+ is broadly useful across A and C, while cloud or GRC certifications matter far more for specific directions. And your **job search in Phase 8** targets the role and market you named here.

So the deliverable for this phase is not an essay about four options. It is the input to the next three phases — which is why the exit criterion is phrased as a sentence you must be able to say out loud. If you can say it, and the three projects are named and mapped to real job requirements, this phase is done.

### Key takeaways

- **The exit criterion is a decision plus evidence**, not knowledge. Naming a role without naming the three projects that prove it means the phase is not finished.
- **Choosing any path competently beats choosing none perfectly.** Six months of depth in one direction outperforms six months of sampling in four.
- **The four paths overlap more than they appear to.** All of them involve logs and written reports; the choice is about emphasis and entry point, not a sealed box.
- **SOC is the most common entry point, and Path C is your most accessible one.** For a background of remote IT support with no degree, Path C extends what you already do; SOC is the most likely first cyber title.
- **GRC is underrated but rarely a direct entry.** Entry-level roles often want 2–3 years of audit or business experience, making it a common second role rather than a door.
- **Pentest is a destination, not a first job — and the phase says so explicitly.** The barrier is trust and track record, not gatekeeping. The realistic route is via SOC or IT security.
- **Score difficulty as difficulty of entry for you, not difficulty of the subject.** Path D has hard material and a hard entry; Path B has easy material and a hard entry. Conflating them ruins the scoring.
- **Job availability must come from counted postings, not reputation.** This is what the 20 job posts are for, and it is the task most likely to change your mind.
- **Do not average your scores into one number.** A 5/2 path and a 3/3 path are not equivalent. Weight the axes deliberately and write the weighting down.
- **Choose the backup for adjacency, not contrast**, so your existing portfolio still contributes if you switch.
- **The switching trap is a preference for the feeling of learning over learning.** Novelty feels like progress; depth does not. Finish before starting.
- **Commit for 90 days and set a review point.** Deciding in advance what would change your mind is what keeps a plan honest rather than habitual.
- **Your background is not neutral in this decision.** Web development favours pentest; IT support favours Path C and A; no degree and $0 budget disfavour GRC and hardware-heavy labs respectively.

### Practice this next

The five tasks are ordered as a funnel — broad exploration narrowing to a written commitment — and the order matters more than usual:

1. **Do the four mini-tasks first** (task 1), one per path, and do them properly rather than reading about the paths. This is the only way to get behavioural evidence about what you enjoy. Investigate one alert for SOC; build the 10-risk register for GRC; write the MFA rollout checklist for IT Security; do the five PortSwigger labs with remediation notes for pentest. Note *which one you were reluctant to stop doing* — that observation is more valuable than any score.
2. **Score the four paths** (task 2) on interest, difficulty, job availability, and portfolio confidence — but interpret "difficulty" as difficulty of entry for you. Write down your axis weighting and why. Then look at the shape of the scores rather than a single average.
3. **Read 20 job posts before deciding anything** (task 3). Five per path, recorded against the fields listed in Part 2, and hunt specifically for junior-level and zero-to-two-years roles. Let the postings correct your assumptions — they usually do.
4. **Choose one primary and one backup** (task 4), and choose the backup because it is adjacent rather than because it is a fallback. Write one sentence justifying each, referring to the evidence rather than to your feelings.
5. **Write the 90-day plan last** (task 5), with all five components — target, three named projects, honest skill gaps, schedule, and a review date with falsifying evidence. The three projects should map to requirements you actually saw in the job posts, because that is what makes the exit criterion's second half true rather than aspirational.

Then open `portfolio/cyber/05-specialization-choice.md` and check it against the deliverable list. The test is the exit criterion, said out loud in one breath: **"My target cyber role is X, and my portfolio will prove it using these three projects: A, B, and C."** If you can say that sentence and each project clearly serves the role, Phase 6 has everything it needs to start.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Wazuh | SOC/SIEM practice | Free | https://wazuh.com/ | Investigate 5 alerts | Splunk free training |
| Splunk Free Training | SIEM/search learning | Free | https://www.splunk.com/en_us/training/free-courses/overview.html | Complete Intro to Splunk | Wazuh dashboards |
| NIST CSF | GRC framework | Free | https://www.nist.gov/cyberframework | Map 10 controls | CIS Controls |
| CIS Controls | Control framework | Free | https://www.cisecurity.org/controls | Create small-business checklist | NIST CSF |
| Burp Suite Community | Web testing proxy | Free | https://portswigger.net/burp/communitydownload | Complete 5 auth/session labs | OWASP ZAP |
| OWASP ZAP | Web scanner/proxy | Free | https://www.zaproxy.org/ | Passive scan Juice Shop | Burp Community |
| Greenbone CE | Vulnerability scanning | Free | https://greenbone.github.io/docs/latest/ | Scan lab target if hardware allows | Nmap NSE scripts |
| TryHackMe Premium | Guided labs | Paid optional | https://tryhackme.com/ | One-month focused path if prerequisites done | THM free + PortSwigger + BTLO |

## Free/cheap resources

- LetsDefend SOC path/free labs — https://letsdefend.io/
- CyberDefenders — https://cyberdefenders.org/
- Blue Team Labs Online — https://blueteamlabs.online/
- PortSwigger Academy — https://portswigger.net/web-security
- NIST CSF — https://www.nist.gov/cyberframework
- CIS Controls — https://www.cisecurity.org/controls
- OWASP Web Security Testing Guide — https://owasp.org/www-project-web-security-testing-guide/

## Hands-on practice tasks

1. Do one mini-task from each path:
   - SOC: investigate one alert/lab and write summary.
   - GRC: create a 10-risk register for a small remote company.
   - IT Security: create an MFA rollout checklist.
   - Pentest: complete 5 PortSwigger labs and write remediation notes.
2. Score each path from 1–5 for interest, difficulty, job availability, and portfolio confidence.
3. Search PH/remote job boards for each role and list common requirements.
4. Choose one primary path and one backup path.
5. Write a 90-day specialization plan.

## Deliverable / proof of work

Create `portfolio/cyber/05-specialization-choice.md` with:

- One mini-project per path
- Job-market notes from 20 job posts
- Your scoring table
- Chosen primary and backup path
- 90-day plan

## Checklist

- [ ] I explored SOC/Blue Team. <!-- id: cyber-05-c01 energy: normal -->
- [ ] I explored GRC. <!-- id: cyber-05-c02 energy: normal -->
- [ ] I explored IT Security Analyst work. <!-- id: cyber-05-c03 energy: normal -->
- [ ] I explored Junior Pentest labs. <!-- id: cyber-05-c04 energy: normal -->
- [ ] I reviewed 20 job posts. <!-- id: cyber-05-c05 energy: normal -->
- [ ] I chose one primary path. <!-- id: cyber-05-c06 energy: normal -->
- [ ] I chose one backup path. <!-- id: cyber-05-c07 energy: normal -->
- [ ] I wrote a 90-day specialization plan. <!-- id: cyber-05-c08 energy: normal -->

## You're ready to move on when...

You can say: “My target cyber role is ____. My portfolio will prove it using these 3 projects: ____.”

## Free vs Paid

### What's free and enough

Wazuh, Splunk free training, NIST, CIS, PortSwigger, OWASP ZAP, CyberDefenders/BTLO free labs are enough.

### What's paid and why you'd upgrade

TryHackMe Premium can be useful now because you already know enough to use one month intensely.

### When it's worth paying

Only if you can commit to 20–30 focused hours in that month and have completed the prerequisites in `WHEN-TO-BUY-THM-PREMIUM.md`.
