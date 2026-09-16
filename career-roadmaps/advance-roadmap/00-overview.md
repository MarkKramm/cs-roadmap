# Mid-Level Cyber Roadmap Overview

## What this track is

This is the **third track**, and it starts where the other two stop.

The IT roadmap gets you a first remote support job. The cybersecurity roadmap gets you a first security job. Both are honest about what they are: they teach you to be *hireable*, not to be *senior*. They end at the moment you are useful, which is the moment the real learning starts.

This track is for the years after that. It assumes you already hold a security role — SOC Analyst L1, junior security analyst, IT support that has drifted into security work — and that you have been in it long enough to have triaged a few hundred alerts, written tickets someone else acted on, and started to notice that the things you were taught to do are not the things that actually decide outcomes.

**You do not start this track to get hired.** You start it because the job you have is now asking questions your entry-level training does not answer: why does the detection library keep producing noise nobody triages, who is supposed to be in charge when four people are working the same incident, how do you prove a control works rather than assuming it does, and how do you get a fix funded when the person who owns the budget does not report to you.

## Who this is for

Read this honestly before starting, because the wrong reader will not get much out of it.

**You are ready for this track if:**

- You have held a security role for roughly **1–3 years**, or you are an IT person who now spends most of your week on security work.
- You can triage an alert, read a log, and write a report without being walked through it.
- You have used a SIEM, an EDR, or both, and you have opinions about them.
- You have been in a real incident, even a small one, and felt unsure about something that was not a technical gap.
- You can write a script that does something useful, even if it is not elegant.

**You are not ready for this track if:**

- You have not held a security job yet. Do the cybersecurity roadmap first. Every phase here assumes context you only get from working.
- You can triage alerts but have never written a detection that ran in production.
- You are looking for a certification syllabus. This track is not aligned to one and does not try to be.

That is not gatekeeping. It is the same honesty the entry-level tracks apply to themselves: a track that claims to prepare you for something it cannot is worse than no track.

## Where it sits in the sequence

```text
IT roadmap      -> first remote IT job            -> 3–6 months
Cyber roadmap   -> first security job             -> 6–18 months
Advance roadmap -> ownership of security outcomes -> years 1–3 of the job
```

The three tracks are **sequential, not parallel**. This one is last because every phase in it assumes you have already seen real alerts, real users, and real consequences — and the exercises are written so that you bring your own working environment to them rather than a lab you built for a course.

## The six phases

| Phase | Topic | Realistic Time | Take it if |
|---|---|---:|---|
| 1 | Detection Engineering at Scale | 6 weeks | Your detection library has grown past the point where one person can hold it in their head |
| 2 | Threat Hunting | 5 weeks | You want to find things nobody wrote a rule for — and you are prepared to spend a week finding nothing |
| 3 | Incident Command | 5 weeks | You have been the analyst in an incident and now need to be the person running it |
| 4 | Cloud and Identity Architecture | 6 weeks | You can read cloud logs, and you now need to design the controls that produce them |
| 5 | Adversary Emulation and Purple Teaming | 6 weeks | You want to prove whether a control works instead of assuming it does |
| 6 | Security Programme, Influence, and Mentoring | 5 weeks | You are being asked to own something, and the skill you are missing is not technical |

Total: **33 weeks — roughly eight months** — if you take all six in order while working. Most people will not. Read on.

## Take two or three, not all six

This is the most important piece of advice in the overview, and it mirrors the depth track in the cyber roadmap for the same reason.

Nobody needs all six at once. The phases are built so that each one stands alone, and the right choice depends on what your job is actually asking of you this year.

| If your situation is… | Take |
|---|---|
| You are drowning in alerts and your detection library is unmanageable | Phase 1 |
| Your team keeps missing things and you suspect the telemetry, not the people | Phases 1, 2 |
| You keep ending up as the de facto incident lead and you are improvising | Phase 3 |
| Your organisation is moving to the cloud and you are the security voice in the room | Phase 4 |
| You cannot answer "does this control actually work?" with evidence | Phase 5 |
| You are being asked to own a programme, mentor someone, or argue for budget | Phase 6 |
| You want to move from SOC into detection engineering | Phases 1, 2, 5 |
| You want to move from SOC into incident response | Phase 3, then Phase 5 |
| You want to stay technical and go deep | Phases 1, 2, 4, 5 |
| You want to move toward team lead or architect | Phase 3, Phase 6, and one technical phase you can speak fluently about |

The two most commonly paired are **1 and 2** (detection and hunting are the same discipline seen from two ends) and **3 and 6** (leading an incident and leading a programme are both about people who do not report to you).

## How long each phase actually takes

The hour figures below are honest estimates, and that is the whole of their claim. They are **not measured**. Nobody has timed a single task in this repository, and a phase that says "roughly 48–66 hours" is saying *this is what the author thinks*, not *this is what a stopwatch said*. Treat every figure as a budget to plan against, not a promise, and adjust it the moment your own experience disagrees with it.

| Phase | Weeks | Hours | Where the time goes |
|---|---:|---:|---|
| 1 | 6 | 48–66 | Tuning and reviewing rules, plus writing the coverage map |
| 2 | 5 | 41–58 | Running hunts, and writing up the ones that found nothing |
| 3 | 5 | 45–58 | Running and writing up exercises, plus the decision logs |
| 4 | 6 | 50–65 | Writing and testing policy, and reading a lot of documentation |
| 5 | 6 | 46–66 | Lab work, emulation runs, and writing detections from the gaps |
| 6 | 5 | 40–52 | Writing artefacts — briefs, metrics, plans — rather than reading |

**The pattern worth noticing:** from Phase 3 onward, most of the hours are spent *writing*, not reading. That is not padding. At this level, the work product is a document somebody else acts on — a report, a decision log, a runbook, a business case — and the writing is the job.

## What this track deliberately does not cover

Naming the exclusions is more useful than a longer list of inclusions.

- **No certification preparation.** CISSP, CISM, OSCP, and GCIH are not taught here and this track is not aligned to them. A certification is a separate decision with its own trade-offs.
- **No offensive-security-for-hire skills.** Phase 5 teaches adversary emulation against systems you are authorised to test, for the purpose of measuring your own controls. It does not teach exploitation for its own sake, and it is not a penetration-testing course.
- **No management theory.** Phase 6 teaches the specific, concrete skills of getting a fix funded and a junior developer unblocked. It is not a leadership book.
- **No vendor products.** Every phase teaches the technique and names free tooling that does the job. If your employer runs a commercial platform, the concepts transfer and the interface takes a week.
- **No claim that this makes you senior.** It gives you the vocabulary and the artefacts. Seniority is a judgement other people make about you after watching you work, and no curriculum can award it.

## How this track uses your actual job

The exercises assume you have a working environment and are deliberately written to be doable **with what you already have**, not with a purpose-built course lab.

Some tasks explicitly ask you to use a real system you have access to, or a sanitised version of one. Where a task would require access you may not have, it says so and gives a free alternative — a public dataset, a free-tier tenant, a home lab, or a documented substitute. **No task requires you to use production data**, and every task that touches something real tells you to sanitise it first.

If a task asks you to do something you cannot do at work — because you lack permission, the tool, or the access — that is not a reason to skip it. Write down *why* you cannot, what you would need, and who would have to approve it. That note is itself a professional artefact, and it is the honest answer to an interview question about how you handle a blocker.

## The $0 rule still applies

The budget rule from the other two tracks carries over unchanged: **everything here is doable at $0.**

Every paid or freemium tool in every Tools table names a free alternative in the same row. Where a phase names a commercial platform — because you will meet it at work and should recognise it — the free path to learn the underlying skill is stated beside it. A free-tier cloud account, a home lab, public datasets, and free challenge platforms are enough for every exercise in this track.

There is no permitted paid item in this track. The single TryHackMe Premium exception in the cyber roadmap does not carry over, because nothing here depends on it.

## Safety, authorisation, and the law

This matters most in Phase 5, and it is stated here so it is never read as a footnote.

**Only ever test systems you own or have explicit written permission to test.** In Phase 5 that means a lab you built, a system your employer has formally authorised you to test through a signed scope, or a public training platform whose rules permit it. It never means a production system you happen to have access to, a client network, a school or employer network you were not authorised on, or anything on the public internet that is not yours.

Unauthorised access is a crime in the Philippines under the Cybercrime Prevention Act of 2012 (Republic Act 10175) and in essentially every other jurisdiction, and "I was practising" is not a defence. A security professional who breaks this rule loses the job, not just the argument. Phase 5 states the authorisation requirement in full before any technique is taught.

The other boundary is **personal data**. Every phase here may put you in contact with real people's information — their names, their tickets, their sign-in logs. Handle it the way your organisation's privacy policy requires, sanitise anything you put in a portfolio, and never put a real user's data into a public repository. The repository you are reading is public; treat that as a standing constraint.

## Portfolio target

By the time you finish the phases you choose, aim for **two to four artefacts that prove you own an outcome**, not that you can follow a procedure:

1. A **detection coverage map** with documented false-positive rates and the honest gaps named — from Phase 1.
2. A **threat hunt write-up** that includes a hunt which found nothing, and why that was the right result — from Phase 2.
3. A **full incident command record** with a decision log, a comms cadence, and a post-incident review you facilitated — from Phase 3.
4. A **cloud control design** with the policy that enforces it, the break-glass path, and the rejected alternative — from Phase 4.

The strongest portfolio artefact at this level is the one that shows your **reasoning**, including the option you rejected and the thing you could not determine. A candidate who says "we had no telemetry for that technique, and here is the ticket I raised to get it" reads as more senior than one who claims total coverage.

## When to stop

The entry-level tracks end at a hire. This one does not have a natural ending, because the job does not either.

A reasonable stopping point is: **you have taken the two or three phases your current role actually needs, produced the artefacts, and can talk about them with a colleague without notes.** That is enough. The rest of the track will still be here when the job changes, and the correct time to read a phase is when you have a problem it solves.

Do not work through all six because the list has six items. The tracks before this one reward completion; this one rewards relevance.

## Weekly rhythm

| Day | Focus | Time |
|---|---|---|
| Monday | Read the phase material | 1 hr |
| Tuesday | Apply it to a real system or lab | 1–2 hrs |
| Wednesday | Write the artefact | 1–2 hrs |
| Thursday | Apply it again, correcting from what the writing exposed | 1–2 hrs |
| Friday | Review the week, update the artefact | 1 hr |
| Weekend | Optional deep block | 0–3 hrs |

The rhythm differs from the entry-level tracks in one way that matters: **Wednesday is writing, not reading.** At this level the writing is where the thinking happens, and a week that produced no artefact produced nothing you can show.

## Files to start with

1. `01-phase-detection-at-scale.md` — the phase almost everyone should take first, because a detection library that produces noise makes every other phase harder.
2. `checklist-master.md` — the flat track-wide checklist.
3. Phase 6 if you are being asked to own something and the gap you feel is not technical.