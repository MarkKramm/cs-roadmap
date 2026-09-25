---
id: curriculum-it-career
exam: "CS Roadmap IT Support Communication and Evidence"
code: CS-IT-CAREER
kind: curriculum-practice
track: it
phases: "it-07-soft-skills,it-08-portfolio-and-resume"
scope: "IT Phases 7 and 8"
questions: 20
source: curriculum
---

# CS Roadmap IT Support Communication and Evidence — curriculum practice exam

**Unofficial curriculum practice exam; not a certification exam or a job-readiness guarantee.** This diagnostic covers the two IT phases that are about being believed rather than being right: communicating with a user under pressure, and presenting your work as evidence a stranger can check. It is free practice and does not certify readiness for a support role.

## How to use and score it

Answer all questions before checking the marked answers. Give yourself one point per correct answer, then read every explanation. **There is no pass/fail score or readiness threshold.** Use missed or guessed questions to identify which of the two phases to revisit.

**A note on what kind of question this is.** Phases 7 and 8 are not reference material, and several of their strongest claims are **positions the curriculum takes rather than facts about the world** — that you acknowledge before you diagnose, that one page is the right length for an entry-level resume, that a line reading "fast learner" should be deleted rather than improved. Where a question turns on one of those, the stem asks **what this curriculum says**, and the correct answer is the phase's stated position. You are being tested on whether you read and retained the argument, not on whether the argument is universal. Where the phases themselves refuse to pick a single answer — GitHub against Google Drive, whether LinkedIn is required — the questions avoid the false choice and ask about the reasoning instead.

One further caution, because it is the thing these phases exist to prevent: the portfolio and lab material here is written for systems **you own or have written permission to test**. Never commit a credential, a key, or real client data to a public repository.

## Domain 1 — Support communication as a procedure (6 questions)

### Q1. A user writes: "My computer is slow. Please fix." The phase's fixed support procedure puts acknowledgement before diagnosis. What reason does it give for the ordering?
<!-- phases: it-07-soft-skills -->

- [ ] Politeness is a professional obligation, and the phase treats courtesy as the goal of the first reply
- [x] **A user who feels unheard escalates, so acknowledgement is risk management rather than manners**
- [ ] Acknowledging first buys time to investigate before you have to commit to an answer
- [ ] Users cannot answer technical questions until they have been reassured

**Why:** The phase frames the ordering as risk management, not etiquette: a user who feels unheard escalates, and an escalation costs more than the acknowledgement. The procedure is acknowledge → confirm impact and urgency → ask only the necessary questions → explain the next step with a realistic time → close the loop. The first output is not a question, because a user who has just reported a problem needs to know it landed before they can usefully answer anything.

### Q2. A user says "I think Outlook is broken." The phase contrasts this with asking whether they can sign in to webmail. Why is the second question better?
<!-- phases: it-07-soft-skills -->

- [ ] It is more polite, because it does not contradict the user's diagnosis
- [ ] It avoids the word "broken", which makes users anxious
- [x] **It invites a fact instead of a guess, and that fact eliminates half the diagnostic tree**
- [ ] It is a closed question, and closed questions always produce more reliable information

**Why:** The phase's rule is to ask about symptoms rather than causes, because a user's theory about what is wrong is usually unreliable and it anchors you on the wrong path. "Is Outlook broken?" invites a guess. "Can you sign in to webmail?" produces an observable fact — and if webmail works, the client, the profile, or the local install is implicated rather than the account or the service. Note that the fourth option is wrong for a second reason: the phase pairs the two question types to different purposes, with closed questions to confirm and open questions to explore, not as a universal ranking.

### Q3. A support technician sends six diagnostic questions in one message to avoid interrupting the user repeatedly. What does the phase say about this?
<!-- phases: it-07-soft-skills -->

- [ ] It is correct, because batching respects the user's time and reduces total interruptions
- [ ] It is correct only if the questions are numbered and ordered by importance
- [ ] It is wrong, because users are not obliged to answer technical questions
- [x] **It is wrong, because a wall of six questions gets three answered — ask one at a time**

**Why:** The phase names the efficiency instinct directly and rejects it: "All six at once, so you only interrupt them once" sounds considerate, but a wall of six questions gets three answered, and the three you get may be the three least useful. This is a position the phase takes, and it is worth noticing that the plausible-sounding batching argument is the trap rather than the answer.

### Q4. The phase calls "either way" the most important phrase in support. What does committing to an update *whether or not* there is news actually prevent?
<!-- phases: it-07-soft-skills -->

- [x] **The user chasing you, because a user given silence has already concluded you forgot**
- [ ] The user escalating to a manager before you have finished investigating
- [ ] You having to admit that you do not yet know the cause
- [ ] The ticket being closed automatically by the service desk system

**Why:** The phase's example is exact: a user told "I'll update you in fifteen minutes, even if I have nothing yet" does not need to chase you, whereas a user given two hours of silence has already decided you forgot. The update that carries no news still carries the fact that the work is happening, which is the thing the user cannot otherwise observe.

### Q5. A status update reads: "Still working on it. Will let you know." The phase scores an update by how many of the four questions a user actually has it answers. How does this one score?
<!-- phases: it-07-soft-skills -->

- [ ] It answers all four, because it confirms the issue is being worked
- [x] **It answers one, and only barely — it confirms someone knows, and nothing else**
- [ ] It answers two, because it implies a future update
- [ ] It answers none, because it gives no estimated time

**Why:** The four questions a user has are: does anyone know this is broken; will it be fixed before I need it; should I do something in the meantime; and does anyone know I am blocked. The phase's test is whether your update answers **at least three** of them. "Still working on it" answers the first only, and weakly. The fourth option is the trap the phase's own quiz sets: "none" over-corrects, because the update does establish that the problem is logged and owned.

### Q6. You must explain the same fault to your manager and to the affected user. The phase names four differences between the two versions. Which of these is one of them?
<!-- phases: it-07-soft-skills -->

- [ ] Length, because the manager version may be longer and more technical
- [ ] Tone, because the user version must be warmer and less direct
- [x] **Reassurance, because an unstated fear is still a fear and the user version must address it**
- [ ] Accuracy, because the user version simplifies the mechanism and may therefore be less true

**Why:** The four named differences are vocabulary, causal framing, reassurance, and next action. The technical version names the mechanism while the user version names the experience — for instance "a stale cached credential" against "an old saved login". Reassurance appears only in the user version, because the fear a user holds but does not say is still operating on them. Accuracy is deliberately not one of the four: the phase's closing line is that being able to do this on demand **without losing accuracy** is the skill, so simplification of vocabulary is not licence to simplify the truth.

## Domain 2 — Difficult conversations and owning mistakes (4 questions)

### Q7. A user is angry about an outage and has been talking for two minutes, including several claims you know to be wrong. What is the phase's first step in de-escalation?
<!-- phases: it-07-soft-skills -->

- [x] **Let them finish, including the parts that are wrong**
- [ ] Correct the factual errors early, so the conversation is built on accurate ground
- [ ] Name the impact on the business, to show you understand the seriousness
- [ ] Explain what you are already doing, to demonstrate that the problem is in hand

**Why:** The de-escalation sequence is fixed: let them finish even the parts that are wrong; then name the impact rather than the fault; then say what you are doing now; then keep the promise or re-negotiate before it expires; and do not accept abuse. Correcting the errors first is the instinct the phase is arguing against — interrupting to correct reads as a defence of the facts rather than an acknowledgement of the problem, and it restarts the anger you were trying to discharge.

### Q8. A colleague opens an apology to a user with "I understand, but the account was locked because you entered the wrong password repeatedly." What does the phase say about the word "but" here?
<!-- phases: it-07-soft-skills -->

- [ ] It is acceptable if the explanation that follows is factually correct
- [ ] It should be replaced with "however", which is more formal
- [x] **It deletes everything before it, telling the user their frustration did not count**
- [ ] It is acceptable, because it separates the acknowledgement from the explanation

**Why:** This is one of the phase's explicit linguistic rules: "'I understand, but…' tells the user their frustration did not count." The acknowledgement is retroactively cancelled by the conjunction, and the user hears only the correction. The phase's alternative structures the same content so the acknowledgement is not the thing being negated, and its guidance on blame is why this matters beyond tone: defensive users withhold information and start editing their account of events to avoid looking foolish, so an unnecessary correction costs you the facts you need.

### Q9. You break a lab system at 09:15 and fix it at 09:40. What does the phase say about the relative importance of reporting it quickly versus the size of the mistake?
<!-- phases: it-07-soft-skills -->

- [ ] Speed matters only when the fault affects a system other people depend on
- [ ] Size dominates, because a trivial fault does not merit interrupting anyone
- [x] **Speed matters more, because the same fault found by someone else two hours later is an incident**
- [ ] They are equal, and both should be judged by the impact on the user

**Why:** The phase states the asymmetry plainly: a small fault reported in two minutes is a small problem, while the same fault discovered by someone else two hours later is an incident, because now nobody trusts the reporting. The fault is identical in both cases; what changed is who found it and what that implies about your reliability. The phase also prescribes the order of the response — fix first, apologise in the same breath, then write it up — and says to write the post-incident note **even if nobody asks for it**.

### Q10. A colleague cannot approve a request. What does the phase say is the fastest way to lose credibility permanently while refusing?
<!-- phases: it-07-soft-skills -->

- [ ] Refusing without offering any alternative route
- [ ] Explaining the reason more than once, which sounds defensive
- [ ] Saying "you cannot have it" rather than "I am not able to approve it"
- [x] **Inventing a policy to make the refusal easier, because it will be checked**

**Why:** The five-part refusal structure is: answer quickly; give the reason **once**; separate the decision from the person; offer the route that does exist; and never invent a policy. The phase's justification for the last rule is not moral but practical — a fabricated policy will be checked, and being caught in one is unrecoverable in a way that a plain refusal is not. The other three options are real errors the phase names, but none of them is the one it singles out as permanent.

## Domain 3 — Making your work checkable (6 questions)

### Q11. A hiring manager spends about thirty seconds on a first read. The phase gives a five-step scan and says to design backwards from it. What is the final step of that scan?
<!-- phases: it-08-portfolio-and-resume -->

- [ ] Looking for evidence that the claimed work was actually done
- [ ] Looking for red flags such as unexplained gaps
- [x] **Deciding whether to spend four more minutes on this candidate**
- [ ] Looking for the keyword match against the job advertisement

**Why:** The five steps are: skim the top third of page one; look for the keyword match; look for proof; look for red flags; then decide whether to spend four more minutes. The phase's gloss on the last step is that this decision is the entire goal of the document — everything before it exists to earn the four minutes. The first three options are genuine steps, which is what makes them work as distractors; their position in the sequence is the thing being tested.

### Q12. Which of these does the phase name as one of its four resume red flags?
<!-- phases: it-08-portfolio-and-resume -->

- [ ] A portfolio link placed at the top of the page rather than in the footer
- [ ] A resume that lists projects in place of paid work experience
- [x] **An obvious, uncustomised template**
- [ ] A summary that names the specific role being applied for

**Why:** The four red flags are exaggerated claims, unexplained gaps, generic objective statements, and an obvious uncustomised template. The last of these is the one people miss, because a template feels like a presentation choice rather than a signal — but a manager reading dozens of applications learns to recognise the same layout, and it suggests the candidate did not engage with the specific role. Note that the second and fourth options are things the phase actively **recommends**: projects legitimately take the place that work experience normally occupies, and naming the target role is what a summary is for.

### Q13. Two versions of the same lab bullet: "Set up a DHCP server in VirtualBox" and a version that names the scope configured, the capture taken in Wireshark to confirm the exchange, and what the technician can now demonstrate. The phase says nothing was exaggerated. What, then, accounts for the difference in credibility?
<!-- phases: it-08-portfolio-and-resume -->

- [ ] A longer sentence, which occupies more of the reader's attention
- [x] **Specificity and evidence — the same fact stated in the unit the manager measures in**
- [ ] A more confident tone, which the reader takes as evidence of competence
- [ ] Additional technical detail, which signals a deeper understanding of DHCP

**Why:** The phase's five-element structure is context, tools, action, evidence, result, and its claim about the rewrite is that it is not a boast but the same fact restated with specificity and evidence. The derived rule is sharper still: every bullet should name a tool, a specific action, and a verifiable outcome, and **if you cannot name a tool, you have not done enough to write the bullet yet**. That last clause matters, because it means the fix for a weak bullet is sometimes more work rather than better wording.

### Q14. The phase lists three specific formatting features that break automated resume parsing. Which of these is one of them?
<!-- phases: it-08-portfolio-and-resume -->

- [ ] Dates written in month-and-year form
- [ ] A single-column layout with section headings
- [x] **Tables and text boxes**
- [ ] Bullet points and numbered lists

**Why:** The three parse failures the phase names are tables and text boxes, headers and footers, and images and icons — all of which are formatting rather than wording. The phase's broader correction is that the internet exaggerates the applicant tracking system problem in both directions: automatic rejection of qualified candidates is real but rarer than commonly claimed, and it mostly affects badly formatted files rather than honest content. Bullet points, standard date formats, and a single-column layout are all things the phase's own model resume uses.

### Q15. A posting asks for a tool you have read about but never used. The phase gives a test for whether the keyword belongs on your resume. What is it?
<!-- phases: it-08-portfolio-and-resume -->

- [ ] Whether you have completed a tutorial or course covering the tool
- [x] **Whether you could answer "tell me about your experience with this" specifically for ninety seconds**
- [ ] Whether the posting lists the tool as required rather than preferred
- [ ] Whether you could pass a multiple-choice test on what the tool does

**Why:** The phase's summary of keyword strategy is "match keywords; do not fabricate them", and its operational test is whether you can speak specifically to the tool for around ninety seconds. The failure mode it names is a keyword added to a skills list with no qualifying context, because that is the version that collapses under interview questioning. The remedy is not to drop the tool but to give it a home in a project bullet that states exactly what you did with it.

### Q16. A resume line reads "Fast learner and hardworking." What does the phase say to do with it?
<!-- phases: it-08-portfolio-and-resume -->

- [ ] Rewrite it with a concrete example of a time you learned something quickly
- [ ] Replace it with "quick to learn new systems", which is more specific
- [x] **Delete it, because asserting a trait you could demonstrate instead is the weakest available move**
- [ ] Move it to the summary, where self-description is expected

**Why:** This is a rare ruling in the phase: the correct action is deletion rather than improvement, and the phase's line is that every applicant writes this, it is unverifiable, and asserting a trait you could demonstrate is the weakest move available. The pattern that governs the phase's workshop is "add the tool, add the action, add the evidence, remove the adjective", which is why the ending is a cut rather than a rewrite. The first option is tempting but is a different fix: it works for many weak bullets, and the phase's point is that this particular line has no work behind it to cite.

## Domain 4 — Defending what you claimed (4 questions)

### Q17. The phase's five-question defence drill includes "what went wrong and how did you get past it". What does it say a write-up with no failures actually reads as?
<!-- phases: it-08-portfolio-and-resume -->

- [ ] Theoretical, because the writer may not have run the lab at all
- [x] **Copied, because it is the section most beginners delete and the one that does the most work**
- [ ] Concise, because a smooth process needs no lengthy explanation
- [ ] Unlucky, because most lab work involves some trial and error

**Why:** The phase is emphatic that the failure section is what distinguishes a real write-up from a transcribed procedure: a write-up with no failures reads as copied, while one honest dead end reads as experience. The reason is that a failure is the part of an account that cannot be predicted from the documentation, so its presence is evidence that the work happened. This is why the phase calls the strong version of its model write-up not better written but better **evidenced**.

### Q18. The five-question drill is used to decide which resume bullets to cut. The phase says to mark a bullet for cutting when two particular questions have no real answer. Which two?
<!-- phases: it-08-portfolio-and-resume -->

- [ ] "What would you do differently?" and "What specifically did you do?"
- [ ] "What tools exactly did you use?" and "What would you do differently?"
- [ ] "What specifically did you do?" and "What tools exactly did you use?"
- [x] **"What went wrong and how did you get past it?" and "How did you know it was finished?"**

**Why:** The phase's operational rule is to mark any bullet where the failure question or the verification question has no real answer, because those are the cuts. They are the two questions that cannot be satisfied by reading: one asks whether you struggled, and the other asks whether you verified or merely stopped. When a bullet fails the drill the phase is explicit about the remedy: either do the work behind it or remove the line, and **removing is always available**.

### Q19. Asked in an interview about a topic you have touched only partly, the phase recommends a specific answer shape. What distinguishes it?
<!-- phases: it-08-portfolio-and-resume -->

- [ ] Describing the topic in general terms, since the interviewer cannot verify the depth
- [x] **Naming the part you know well and the part you have not touched, because accurate self-assessment builds credibility**
- [ ] Answering confidently and steering to a related area you know better
- [ ] Answering briefly and changing the subject to your strongest project

**Why:** The phase's maxim is that "I know this part well and I have not touched that part" is a strong answer, because accurate self-assessment builds credibility while overclaiming destroys it. The drill exists to detect the opposite behaviour: a candidate who read about a subject rather than doing it tends to be smooth and vague. Related advice from the phases is to volunteer a limitation rather than be caught by it, and to answer verification questions with the evidence rather than "the user said thanks".

### Q20. A learner has a portfolio repository with a good README and only a little content, and is deciding whether to wait until more is finished. What does the phase say about an unfinished or empty repository?
<!-- phases: it-08-portfolio-and-resume -->

- [x] **An empty scaffold looks worse than none, and repositories for coursework you never finished count as negative evidence**
- [ ] Commit the scaffold privately first, then make the repository public when it is ready
- [ ] Wait until at least three projects are complete, since the phase recommends three to five
- [ ] An empty scaffold is fine, because it shows the intended structure and that work is planned

**Why:** The phase's position on this section is unusually dense: an empty scaffold looks worse than none, unfinished coursework repositories are negative evidence rather than neutral placeholders, and a repository with a proper README and thin content reads better than one full of files with no explanation. The third option is wrong for a further reason the phase states directly: a private repository is invisible to the reviewers it was built for. Checking your own repository in a private browser window is the phase's suggested habit, because a surprising number of portfolios are invisible to their audience.

## Question-to-phase map

| Question | Main phase(s) |
|---|---|
| Q1–Q6 | `it-roadmap/07-phase-soft-skills.md` |
| Q7–Q10 | `it-roadmap/07-phase-soft-skills.md` |
| Q11–Q16 | `it-roadmap/08-phase-portfolio-and-resume.md` |
| Q17–Q20 | `it-roadmap/08-phase-portfolio-and-resume.md` |

The questions are grouped as four domains rather than one per phase, because the two phases interleave: communication judgement in Domain 1 and 2, and evidence judgement in Domain 3 and 4.

**Several answers here are positions rather than facts, and are marked as such in the explanations.** The curriculum argues for acknowledging before diagnosing, for one question at a time, for deleting a "fast learner" line, and for one page and two resume variants. A reasonable practitioner could disagree with any of them. They are the curriculum's stated reasoning, and the explanations say so where it matters — but if you disagree with one, the disagreement is with the phase, not with the answer key.

**Two places where these phases refuse a single answer, and this paper does not manufacture one.** Whether to host a portfolio on GitHub or Google Drive is left open — the phase calls Drive completely acceptable. Whether LinkedIn is necessary depends on the market being applied to, being close to mandatory for remote overseas roles and optional for local walk-in hiring. Questions that depend on either choice are written to test the reasoning rather than the choice.

## What a score does and does not mean

There is no pass mark here, and no number on this page implies readiness for a support role. **The questions are written to the judgement the phases teach, not to a certification blueprint**, because neither of these phases is aligned to a certification.

A useful reading of a miss is narrower than "I got this wrong." Almost every question here turns on something you either write down or say out loud — an acknowledgement before a question, an update that commits to a time, a bullet that names a tool, a failure you chose to keep in the write-up. If you missed several, the likely gap is not knowledge but the habit of producing those artefacts, and the mapped phase is where to practise it. The phases' own advice on this is to compare your answer against a model sentence by sentence rather than overall, and to repeat the comparison about a week apart.
