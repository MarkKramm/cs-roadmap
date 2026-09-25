---
id: exams-readme
title: "Practice exams"
---

# Practice exams

Unofficial practice questions for the certifications this curriculum points at, written to
the **published exam blueprints** so that each question maps to a real objective.

**These are not real exam questions, and none of these vendors endorses them.** They are
study aids written for this repository. Do not memorise them and expect to pass.

## Why this directory exists

The curriculum's own certification phase says the honest answer to "should I buy an exam?"
might be **"spend nothing"**, and names the failure mode directly:

> Choose certifications strategically instead of buying certificates as a substitute for
> skills or projects.

That warning is about *buying*. This directory now contains two distinct kinds of practice:
seven certification-aligned papers and five curriculum-level integration papers. The first
kind helps a learner review a vendor blueprint before considering an exam fee. The second
kind revisits the curriculum's own scenarios across several phases. Neither predicts hiring
outcomes or replaces hands-on work.

**Curriculum integration papers are diagnostic only.** Their scores have no pass/fail meaning
and no threshold implies job readiness. They are free opportunities to find topics to review,
not certification exams or guarantees of competence. The questions are unofficial and written
for this repository.

**Neither kind replaces the labs, portfolio, or phase work.** A practice score is not a skill.
A useful next step after a missed question is to revisit its mapped phase and practise the
underlying task.

The learning site has a **Practice exams** view that presents both the certification-aligned papers and these curriculum diagnostics one question at a time. Answers stay in the current session and are not saved as quiz scores.

## Certification-aligned practice papers

| Exam | Code | Questions in paper | Real exam format | Pass mark | Blueprint checked |
|---|---|---:|---|---|---|
| [CompTIA A+ Core 1](a-plus-core-1.md) | 220-1201 | 40 | 90 questions, 90 min | 675 / 900 | 2026-09-18 |
| [CompTIA A+ Core 2](a-plus-core-2.md) | 220-1202 | 40 | 90 questions, 90 min | 700 / 900 | 2026-09-18 |
| [CompTIA Network+](network-plus.md) | N10-009 | 40 | 90 questions, 90 min | 720 / 900 | 2026-09-18 |
| [CompTIA Security+](security-plus.md) | SY0-701 | 40 | 90 questions, 90 min | 750 / 900 | 2026-09-18 |
| [Microsoft SC-900](sc-900.md) | SC-900 | 40 | ~50 questions, 45 min | 700 / 1000 | 2026-09-18 |
| [Microsoft AZ-900](az-900.md) | AZ-900 | 40 | ~50 questions, 45 min | 700 / 1000 | 2026-09-18 |
| [ISC2 Certified in Cybersecurity](isc2-cc.md) | CC | 40 | 100–125 questions, 120 min | 700 / 1000 | 2026-09-18 |

These papers are shorter than the real exams and are not full simulations. They map questions to
published domains, but do not reproduce full exam length or every question format.

## Curriculum integration diagnostics

These five 20-question papers combine applied scenarios across phases. They use the same
four-option format for convenient self-review, but have **no pass mark, pass/fail verdict, or
readiness threshold**. Treat the score only as a prompt to revisit the mapped lessons.

They are intentionally shorter than the certification papers and focus on decisions learners
can make from this curriculum: observe and scope, choose a safe next step, preserve evidence,
communicate or escalate, and explain why. The questions are scenario-based multiple choice, not
performance-based lab tasks.

| Paper | Code | Curriculum scope | Questions |
|---|---|---|---:|
| [IT Support Triage & Ticketing](curriculum-it-foundations.md) | CS-IT-FOUNDATIONS | IT Phases 1–6 and 9 | 20 |
| [Cyber Foundations and Incident Triage](curriculum-cyber-core.md) | CS-CYBER-CORE | Cyber Phases 1–4, 9, and 11 | 20 |
| [SOC Detection and Response](curriculum-cyber-depth.md) | CS-CYBER-DEPTH | Cyber Phases 10–12 | 20 |
| [Web Application Security Assessment](curriculum-web-app-security.md) | CS-WEB-APP-SECURITY | Cyber Phases 3 and 14 | 20 |
| [Security Ownership and Command](curriculum-advance-ownership.md) | CS-ADVANCE-OWNERSHIP | Advance Phases 1, 2, 3, 5, 6 and 7 | 20 |

**The advance-track paper asks a different kind of question, and that is deliberate.** The four
entry-level diagnostics ask what a learner should *do* with a scenario. The advance paper asks
what a practitioner should *write down, measure, or decline to claim* — a detection review, a
handover pack, a decision log, a gap register, a tuning record, a risk acceptance. That is
because the advance track is the one whose work product is a document somebody else acts on.
**Advance Phase 4 (Cloud and Identity Architecture) is outside its scope**, because its subject
is design and policy rather than the measurement, command and lifecycle decisions the other six
phases share; reaching into it with twenty questions would test vocabulary rather than judgement.

**For certification-aligned papers, read the scoring table rather than assuming a percentage.** The vendor pass marks differ
substantially, and two papers have a boundary that falls between whole questions: Security+ needs
**83.3%** (750/900), so **33 out of 40 is a fail** even though it looks like a pass — and AZ-900 and
SC-900 need **70%**, which is a very different bar. Every paper states its boundary in whole
questions for exactly this reason.

**One paper cannot rehearse its exam's format.** ISC2 CC is delivered by **adaptive testing**, where
each question is chosen based on your previous answers and you cannot revisit a question. The CC
paper explains what that means for the sitting and why a run of hard questions is a sign of doing
well, not badly. The CompTIA papers all have performance-based questions — subnetting, simulated
environments, drag-and-drop — which no multiple-choice paper represents.

## How to use one honestly

1. **For certification-aligned papers, use the suggested closed-book timing as practice.** Open-book review can help while learning, but do not compare it with a timed vendor-exam simulation.
2. **Score it against the real pass mark in the table above**, not against "how many I got
   right". A raw 70% is a pass on some of these exams and a comfortable fail on others.
3. **Read the explanation for every question, including the ones you got right.** The
   `**Why:**` line is the teaching, and a lucky guess and a correct answer look identical in
   a score.
4. **Revisit the mapped lessons and practice tasks before retaking a curriculum diagnostic.** Repeating it immediately may only test memory of the questions.
5. **Treat certification-paper scores as a rough study signal, not a prediction.** The real vendor exam may be longer, use other formats, and draw from objectives this sample does not cover.

## Where the blueprints came from

Every paper's domain structure and weighting is taken from the vendor's own published
objectives, checked on the date in the table. Sources:

- CompTIA A+ Core 1 and Core 2 — <https://www.comptia.org/en-us/certifications/a/>
- CompTIA Network+ — <https://www.comptia.org/certifications/network>
- CompTIA Security+ — <https://www.comptia.org/certifications/security>
- Microsoft SC-900 — <https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/sc-900>
- Microsoft AZ-900 — <https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900>
- ISC2 Certified in Cybersecurity — <https://www.isc2.org/certifications/cc/cc-certification-exam-outline>

**Exam codes, question counts, time limits and pass marks change.** They were correct on the
date shown and this repository will drift behind the vendors. If you are booking an exam,
confirm the current details with the vendor rather than trusting this table.

**One blueprint changed recently, and it is worth knowing about.** The ISC2 CC outline was revised
with an effective date of **1 September 2026** and now has **five** domains — earlier outlines
described a different set including a combined business continuity, disaster recovery and incident
response domain. A great deal of third-party study material still teaches the older structure. If
you are working from a course or book, check its publication date against the current outline; the
CC paper here follows the current one and says so.

The script that fetches and prints these blueprints is `scripts/show-blueprints.mjs` — run it
to see the current published structure rather than the one recorded here.
