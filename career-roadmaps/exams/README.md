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

That warning is about *buying*. It is not an argument against being ready, and there is a
gap it leaves open: a reader can finish every phase, build the portfolio, and still have no
idea whether they could pass the exam they are about to pay for. A $250–$400 exam fee is
real money in a $0-budget curriculum.

**That is the only job these papers do.** They tell you whether you would pass today. They
are free, they can be retaken as often as you like, and getting a low score here costs
nothing except the recognition that you are not ready yet — which is the cheapest possible
time to find out.

**They do not replace the labs, the portfolio, or the phase work.** A practice score is not
a skill. If you can pass these and cannot describe a ticket you resolved, you have studied
for the wrong thing — and the certification phase says so at length.

## The papers

| Exam | Code | Questions | Time | Pass mark | Blueprint checked |
|---|---|---|---|---|---|
| [CompTIA A+ Core 1](a-plus-core-1.md) | 220-1201 | 90 | 90 min | 675 / 900 | 2026-09-18 |
| [CompTIA A+ Core 2](a-plus-core-2.md) | 220-1202 | 90 | 90 min | 700 / 900 | 2026-09-18 |
| [CompTIA Network+](network-plus.md) | N10-009 | 90 | 90 min | 720 / 900 | 2026-09-18 |
| [CompTIA Security+](security-plus.md) | SY0-701 | 90 | 90 min | 750 / 900 | 2026-09-18 |
| [Microsoft SC-900](sc-900.md) | SC-900 | ~50 | 45 min | 700 / 1000 | 2026-09-18 |
| [Microsoft AZ-900](az-900.md) | AZ-900 | ~50 | 45 min | 700 / 1000 | 2026-09-18 |
| [ISC2 Certified in Cybersecurity](isc2-cc.md) | CC | 100–125 | 120 min | 700 / 1000 | 2026-09-18 |

Each paper carries **40 questions** in this repository, not the 90 or 125 the real exam asks. That
is deliberate and it is stated on every paper: these are 40 well-mapped questions per
blueprint rather than 90 padded ones, and calling them a full simulation would be a lie that
makes you overconfident.

**Read each paper's own scoring table rather than assuming a percentage.** The pass marks differ
substantially, and two of them have a boundary that falls between whole questions: Security+ needs
**83.3%** (750/900), so **33 out of 40 is a fail** even though it looks like a pass — and AZ-900 and
SC-900 need **70%**, which is a very different bar. Every paper states its boundary in whole
questions for exactly this reason.

**One paper cannot rehearse its exam's format.** ISC2 CC is delivered by **adaptive testing**, where
each question is chosen based on your previous answers and you cannot revisit a question. The CC
paper explains what that means for the sitting and why a run of hard questions is a sign of doing
well, not badly. The CompTIA papers all have performance-based questions — subnetting, simulated
environments, drag-and-drop — which no multiple-choice paper represents.

## How to use one honestly

1. **Sit it closed-book, in one sitting, with a timer.** An open-book practice score measures
   your search skills, not your recall, and the real exam is closed-book.
2. **Score it against the real pass mark in the table above**, not against "how many I got
   right". A raw 70% is a pass on some of these exams and a comfortable fail on others.
3. **Read the explanation for every question, including the ones you got right.** The
   `**Why:**` line is the teaching, and a lucky guess and a correct answer look identical in
   a score.
4. **Re-sit after studying, not after re-reading the answers.** A second attempt inside the
   hour measures short-term memory.
5. **If you score close to the pass mark, that is not a pass.** These papers are a sample of
   40 questions from a much larger objective list, and the real exam draws from all of it.
   Being one question over here is inside the noise.

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
