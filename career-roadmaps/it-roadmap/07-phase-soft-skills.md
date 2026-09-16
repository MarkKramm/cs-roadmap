---
id: it-07-soft-skills
track: it
phase: 7
order: 70
title: "Phase 7 — Soft Skills for IT Support"
duration: "1–2 weeks"
duration_weeks: 2
energy_mix: [low, normal]
deliverable: "portfolio/it/07-soft-skills.md"
exit_criteria: "You can write a ticket update that is clear, polite, and useful even when the issue is not solved yet."
---

# Phase 7 — Soft Skills for IT Support

## Goal of this phase

Build the communication habits that make remote IT staff trusted: clear writing, calm troubleshooting, expectation-setting, and escalation.

## Estimated time

**1–2 weeks**, then ongoing practice during applications and work.

## Skills you'll gain

- Ask good diagnostic questions.
- Write concise tickets, updates, and handoffs.
- Explain technical issues to non-technical users.
- Handle frustrated users without arguing.
- Use STAR stories for interviews.
- Communicate well in remote teams across chat, email, video calls, and tickets.

## Specific topics to learn

### Support communication

- Acknowledge the issue
- Confirm impact and urgency
- Ask only necessary questions
- Avoid blaming the user
- Explain next steps and ETA
- Close the loop after resolution

### Remote work habits

- Written updates
- Time-zone awareness
- Async communication
- Meeting notes
- Follow-up discipline
- Screenshot-based explanations

### Interview skills

- STAR format: Situation, Task, Action, Result
- Behavioral stories for learning, conflict, mistake, difficult user, troubleshooting
- Explaining no-degree background positively

## Lesson: Soft Skills for IT Support

### Why this lesson exists

There is a comfortable lie in technical education: that soft skills are the easy part, and that if you can fix the problem, communication will take care of itself. Every experienced support technician knows this is backwards.

Here is the reality of the job. You will spend more of your day writing and talking than configuring. The technician who is technically brilliant and communicates badly generates escalations, angry users, and half-solved problems that come back. The technician who is technically adequate and communicates excellently becomes the person the team trusts with the difficult users — and that is the person who gets promoted.

There is also a blunt hiring reason. An entry-level IT role is a lottery on technical depth, because every candidate has roughly the same beginner skills. What separates candidates in the interview is almost entirely: can this person explain a technical problem to a non-technical person, stay calm under pressure, and take ownership? Those three questions *are* the soft skills phase.

**Time to complete:** roughly 10 hours across the phase, and it is the one phase you can practise every single day of your life. Every conversation with a family member about their broken laptop is a free rehearsal. Treat it as one.

**What "soft skills" actually means here.** It is not charm. It is a set of learnable procedures: how to acknowledge, how to ask a diagnostic question that gets a useful answer, how to say "I don't know yet" without losing credibility, how to write for asynchronous readers, and how to tell a story about yourself with a beginning, an action, and a result. All of it is practiceable, which means all of it is learnable.

### Part 1 — Support communication as a procedure

#### The acknowledgement comes before the diagnosis

The first thing out of your mouth, or off your keyboard, is not a question. It is an acknowledgement: **"I understand something is broken and I'm on it."**

This is not politeness for its own sake. It is risk management. A user who feels unheard escalates, and escalation costs the organisation time and money and costs you a reputation. A user who feels heard will wait patiently while you investigate.

Then, in order:

1. **Acknowledge** — "That sounds frustrating, and it's affecting your client call today. Let's get you sorted."
2. **Confirm impact and urgency** — "Is it just you, or is anyone else affected? When do you need this working by?"
3. **Ask only the necessary questions** — one at a time, because a wall of six questions gets three answered.
4. **Explain the next step and give a realistic ETA** — "I'm going to check the mail server logs. Give me fifteen minutes and I'll come back to you either way."
5. **Close the loop after resolution** — and then, crucially, actually come back when you said you would.

**"Either way" is the most important phrase in that list.** A user told "I'll update you in fifteen minutes, even if I have nothing yet" does not need to chase you. A user given silence for two hours has already decided you forgot.

#### The diagnostic question craft

The hardest part of support communication is getting useful information from someone who does not know what information is useful. There is a technique for this.

**Ask about symptoms, not causes.** A user's theory about what is wrong is usually unreliable, and it anchors you on the wrong path. Compare:

| Instead of | Ask |
|---|---|
| "Have you tried clearing your DNS cache?" | "What exactly do you see on screen when it fails?" |
| "Is it a network issue?" | "Does this happen in every program, or just the browser?" |
| "Did you change something?" | "When did it last work correctly? What happened between then and now?" |
| "Is the Outlook account broken?" | "Can you sign in to webmail in a browser right now?" |

That last pair is a masterclass compressed into a table. "Is Outlook broken?" invites a guess. "Can you sign in to webmail?" produces a fact that eliminates half the diagnostic tree.

**Three questions worth memorising:**

- **"What's the exact wording of the error message?"** — Ask for a screenshot, or have them read it verbatim. The difference between "cannot connect to the server" and "your credentials have expired" is the entire diagnosis.
- **"When did it last work, and what changed since then?"** — A startling proportion of IT problems are caused by something that changed, and users do not think to mention it. New laptop, new password, new office, new router, an update installed overnight.
- **"Does it happen for anyone else?"** — This converts an incident into an impact assessment and tells you whether you are in a five-minute problem or a company-wide outage.

**Use closed questions to confirm and open questions to explore.** "Is the fan running?" confirms. "Tell me what happens when you press the power button" explores. Beginners ask open questions when they need a yes/no, and closed ones when they need a story. Getting this the right way round speeds up almost every ticket.

**Read back what you heard.** "So to make sure I've got this right — it worked on Friday, and since the password change Outlook keeps asking for your old password. Is that right?" This catches misunderstandings early and makes the user feel listened to at the same time. It is one of the highest-return sentences in support.

**A worked transcript.** Here is the same technique doing its job on a real ticket. The user’s entire opening message was: *“Email not working, please fix ASAP.”*

| Turn | Who | What was said |
|---|---|---|
| 1 | You | “Got it — mail is down and you need it working. Before I dig in, three quick things.” |
| 2 | You | “First: what exactly do you see when you open it? An error, a spinner, or does it open and then refuse your password?” |
| 3 | User | “It says my password is wrong. But it isn’t.” |
| 4 | You | “Second: when did it last work?” |
| 5 | User | “Yesterday morning. It was fine before lunch.” |
| 6 | You | “Third: is anyone else on your team seeing this?” |
| 7 | User | “No, I don’t think so.” |
| 8 | You | “So to check I’ve got this right — it worked yesterday morning, after lunch it started rejecting a password you’re sure is correct, and you’re the only one affected. Right?” |
| 9 | User | “Yes, exactly.” |
| 10 | You | “That combination usually means the saved password on your device has gone stale, not that your password is wrong. I’ll confirm in ten minutes and come back either way.” |

Turn 2 is where the diagnosis comes from. “The password is wrong” and “it cannot connect to the server” point at completely different causes, and you only learn which one you have by asking for the wording rather than the summary. Turn 6 turns a possible outage into a single-user problem. And turn 8 is what lets you commit to an answer in turn 10: you are not guessing, because you have already checked your understanding.

#### Empathy without blame

Never blame the user. Not because they are never responsible — sometimes they are, and sometimes you will both know it — but because blame makes people defensive, and defensive people withhold information. Users start editing their account of what happened to avoid looking foolish, and you lose the detail that actually matters.

How this sounds in practice:

- **Instead of:** "You must have clicked something." **Say:** "These emails are convincingly made, and it's easy to click. The important thing now is what we do next."
- **Instead of:** "You shouldn't have nine tabs open." **Say:** "Let's close a few of these and see whether it speeds up."
- **Instead of:** "That's not how you're supposed to do it." **Say:** "There's an easier way to do this that'll save you time — can I show you?"

Note the shape of the third. It replaces a reprimand with an offer. Users respond to efficiency arguments far better than to correction, because nobody wants to be told they have been doing their job wrong.

#### Saying "I don't know" without losing credibility

This fear holds beginners back for years: the belief that admitting ignorance loses the user's confidence. In reality the opposite is true. False confidence loses the user's confidence, and it does so permanently.

The professional formula is: **acknowledge, commit, and follow through.**

> "I don't know why that's happening yet. I don't want to guess and make it worse. Let me check with the team and come back to you by 3pm with an answer."

That answer contains the three things a user needs: honesty, a plan, and a deadline. It builds more trust than a confident wrong answer ever would, because the user learns you will tell them the truth.

The one thing you must never do is the opposite — guess confidently, apply a change, and leave things worse while asserting it is fixed.

### Part 2 — Writing for asynchronous, remote teams

#### Async is a different medium, and most people write it badly

Remote work runs on writing. Your chat message will be read by someone in a different time zone, several hours after you wrote it, with none of your tone of voice, and possibly without the preceding conversation in view.

That changes what good writing is. Four rules follow:

1. **Lead with the ask.** "Can you check whether the printer on floor 2 is online? User in room 214 cannot print." The reader knows what you want in six words. Burying the ask at the bottom of a paragraph is the most common async mistake.
2. **Give full context the first time.** The reader cannot see your screen, your ticket, or your earlier conversation. Include the device, the user, the error, and what you have already tried.
3. **Separate the fact from your interpretation.** "The event log shows Event ID 41 at 09:14" is a fact. "The machine keeps crashing" is your interpretation. Mark which is which, because the reader will trust a fact more, and rightly so.
4. **Say what you need back, and by when.** "No action needed, just an FYI" and "Please advise by end of day" are different messages. Without them the reader does not know whether to drop everything.

#### Time zones, and the update habit

If you work with colleagues or clients in other time zones, three habits prevent most friction:

- **State times with the zone** — "15:00 UTC" or "10am your time, if that works". An unqualified "10am" across zones is an invitation to a missed meeting.
- **Front-load what you can do asynchronously** and save the meeting for what genuinely needs a conversation. Written updates are searchable; a video call is not.
- **Write the handover note when you finish, not when you start your day.** If someone in another zone picks up your ticket while you sleep, your notes are the only continuity that exists.

**Meeting notes are part of this.** Notes are not transcription; they are decisions and owners. Three lines — what was decided, who owns it, when it is due — are worth more than a paragraph of summary, because they can be acted on.

#### Follow-up discipline, or: never let a ticket die of silence

The single most common failure in support is not incompetence. It is a ticket that went quiet. The technician got busy, the user assumed they were forgotten, and a solvable problem became a complaint.

**Follow-up discipline is a habit, not a personality trait.** The reliable version: every open ticket gets an update at a defined interval — daily, or twice a day for high priority — even when the update is "still investigating, no news yet".

Put it somewhere you will actually see it — a calendar reminder, or the ticket sheet from Phase 6 if you have built one. Studying alone with no live tickets yet, the honest version is to pick one real ongoing task of your own and apply the same interval to it.

#### Explaining with screenshots

A screenshot with an arrow drawn on it replaces a paragraph of description, and it survives language barriers and low technical confidence. Two habits make screenshots genuinely useful:

- **Annotate them.** A red rectangle or arrow turns "click the third option" into something the user can follow without reading.
- **Narrate them.** Put the screenshot in the ticket or message with a sentence of what the user should see, and what to do if what they see differs. Screenshots that assume the reader's screen matches yours cause confusion when it does not.

### Part 3 — Interview stories: the STAR structure

#### What STAR is, and why interviewers use it

**STAR** stands for **Situation, Task, Action, Result**, and it is the structure behind almost every behavioural interview question. Interviewers use it because it forces specificity. Anyone can claim to be a good communicator; only someone with a real story can describe the moment they were one.

| Element | What goes in it | Time |
|---|---|---|
| **Situation** | The context — where, when, what was at stake | ~15 seconds |
| **Task** | What you specifically were responsible for | ~10 seconds |
| **Action** | What *you* did, step by step. "I", not "we" | ~50 seconds |
| **Result** | The outcome, and what changed because of it | ~15 seconds |

The **Action** section is where most candidates fail. They say "we fixed it" and hide inside the plural. The interviewer cannot assess a team — they can only assess you. Say what *you* did.

#### Five stories worth preparing

This phase's topic list names five behavioural themes. Write one real story for each, keep each to about ninety seconds, and rehearse them out loud:

1. **Learning something difficult.** How you taught yourself something with no teacher and no budget. Your entire study history is this story.
2. **Handling conflict or disagreement.** A time you disagreed with someone and stayed professional. The result does not need to be that you won.
3. **A mistake you made.** What you got wrong, and — critically — what you changed afterwards. Candidates who claim never to have made mistakes are believed by nobody.
4. **A difficult user or customer.** How you stayed calm and reached a resolution. The best versions involve discovering the person's real problem was not the thing they were complaining about.
5. **A troubleshooting success.** The full story, from symptom to diagnosis to fix. This is your technical showcase, and it should include the failed attempts, because failures are what prove you actually did the work.

**Prepare the stories as stories, not as scripts.** Memorised wording collapses under a follow-up question. A story you have told five times out loud, to a person, survives anything.

**The misconception that stops people here.** *“I do not have professional experience, so I do not have STAR stories.”* This is the most common reason a beginner stalls on this phase, and it is wrong. STAR is a shape for describing a real event. A real event does not need a job title attached to it.

The learning story is your study history. The difficult-user story is the relative whose laptop you spent a Saturday on. The mistake story is the time you deleted the wrong folder while setting up a virtual machine. None of that happened at work. All of it is true, specific, and structured.

What you must not do is invent an employer, a colleague, or a manager. Interviewers ask follow-ups, and a fabricated story collapses on the first one. Tell the smaller true story instead. A candidate who says “this happened while I was teaching myself, and here is what I learned” is trusted. A candidate who implies a manager they never had is not.

#### Explaining a no-degree background positively

The topic list includes "explaining no-degree background positively", and this deserves its own treatment because it is the question you are most likely to dread.

The mistake is to be defensive: "I know I don't have a degree, but…". The word "but" tells the interviewer you consider it a deficit. You do not have to.

What you actually have is a story about **self-direction**, and it is a strong one:

> "I don't have a degree, and I made a deliberate choice about how I'd build the equivalent skills. I've worked through a structured curriculum covering networking, Windows administration, ticketing systems and security fundamentals — and I have the portfolio to show what I did at each stage. I learned in a way that included building things and writing them up, because I wanted to be able to do the work, not just answer questions about it. I'm looking for a role where I can keep learning in a real environment."

Notice what that answer does. It does not apologise. It states the gap plainly, reframes it as evidence of initiative, points at proof, then redirects to what you want next. That is the structure, and it works precisely because it is honest.

**Back it with artefacts.** A portfolio containing your PowerShell inventory script, your ticket templates, your asset inventory and your lab write-ups does the arguing for you. If you have not built all four yet, name the ones you *do* have and say plainly which are still coming — the honest version of this move is stronger than a claim you cannot back. When you can say "here's what I built", the absence of a degree stops being the topic of conversation. **Evidence beats explanation**, every time.

#### Practising under realistic conditions

Two things make practice work rather than feel like a waste of time:

- **Out loud, to a person.** Reading your story silently is not practice. The gap between what you intended to say and what actually comes out of your mouth is only discoverable by speaking.
- **Under time pressure.** Ninety seconds is shorter than it feels. Record yourself once and find out how long your "short" story really is.

Then expect follow-ups, because interviews are follow-ups. "What would you do differently?" "Why did you choose that approach?" "What did you learn?" If your story collapses when probed, it is not yet a story you own.

### Part 4 — The same explanation, written for two different readers

Part 1 gave you the principles. This part shows the translation being done, because the gap between what you tell a colleague and what you tell a user is the whole skill.

The core translation skill is writing the same information twice: once for a technical colleague, once for the user. Compare these two accounts of an identical fix.

**For a technical colleague:**

> Cleared stale cached credentials for `outlook.office.com` in Credential Manager. Root cause was a password change leaving pre-change credentials cached; Outlook kept replaying them without re-prompting. Webmail was unaffected throughout, which ruled out the account and pointed at the local client.

**For the user:**

> Your password change left an old saved login on this PC, and Outlook kept trying to use it instead of asking you for the new one. I've removed the old saved login, so Outlook will now ask for your current password and connect normally. Nothing you did wrong — this happens to everyone after a password change. If it happens again, call the service desk and it takes about two minutes to fix.

Same facts, same diagnosis, same fix. What changed:

- **Vocabulary** — "stale cached credentials" became "an old saved login".
- **Causal framing** — the technical version names the mechanism; the user version names the experience.
- **Reassurance** — the user version explicitly removes blame, because an unstated fear is still a fear.
- **Next action** — the user version says what to do if it recurs.

Practising this translation, deliberately, is the exercise. Take any ticket you have written and rewrite it for a user who is worried, busy, and not technical. Then compare the two versions. The gap between them is exactly the skill.

#### The four things a user actually needs from a status update

Beginners write updates that answer the question they are interested in — "what have I tried?" — rather than the questions the user actually has. Users have four, in roughly this order:

| The user's question | What your update must contain |
|---|---|
| "Does anyone know this is broken?" | Confirmation it is logged and being worked |
| "Will it be fixed before I need it?" | A realistic time, or an honest "I do not know yet, by 3pm" |
| "Should I do something in the meantime?" | A workaround, or an explicit "there is nothing you need to do" |
| "Does anyone know I am blocked?" | Whether it has been escalated, and who has it |

A useful test: read your update and check whether it answers at least three of those four. An update that says "still investigating, will update soon" answers only the first, and only barely.

**A small exercise: the four-question rewrite.** Fifteen minutes, no tools needed.

1. Find a real status update you have written — a message to a group chat, a note to a classmate, anything where you owed someone a progress report. If you have none, write the worst possible one first: *“still working on it, will update soon.”*
2. Score it against the four questions above. Which of them does it answer?
3. Rewrite it so it answers all four, in under 120 words, with a specific next-update time.
4. Read both versions aloud, one after the other.

The gap between them is the whole lesson of this part. The rewrite is usually shorter than the first version, because structure replaces padding.

### Part 5 — Difficult conversations: the ones that are not really about technology

Sooner or later you will tell someone something they do not want to hear: their device is not repairable, their data cannot be recovered, their request has been refused, or the fix will take three days and they needed it yesterday.

Four principles make these survivable:

1. **Deliver the news early and plainly.** Softening a bad outcome into ambiguity means the user hears "maybe". "Maybe" is worse than "no", because it prevents them from making other plans.
2. **Separate what you know from what you assume.** "The drive is not detected and the data is not currently accessible" is honest. "Your data is gone forever" may be an overstatement; data recovery specialists exist.
3. **Give the alternative if there is one.** "It is not repairable, but everything synced to OneDrive is intact, and I can get you onto a loan machine in an hour." The alternative is the part that restores the user's sense of control.
4. **Do not take anger personally.** A user shouting about a broken laptop is often stressed about the work they cannot do, not about you. Staying calm and factual is the entire response, and it de-escalates faster than matching their tone ever would.

The habit worth building: **state the problem, state the impact, state what happens next, and end with the user's concrete options.** A user who knows their options is no longer helpless, and a user who is not helpless is very rarely angry.

#### The angry user: a sequence, not a talent

De-escalation is the skill beginners fear most and experienced technicians consider routine, because it follows a sequence rather than requiring a gift.

**First, let them finish.** Interrupting an angry person to correct a detail escalates the situation and costs you nothing to avoid. Let the whole complaint land, even the parts that are wrong, even the parts that are about someone else.

**Second, name the impact, not the fault.** "You have been waiting two days, and that has cost you time with a client. That is not acceptable." Notice this contains no "but". The word "but" deletes everything before it, so "I understand, but..." tells the user their frustration did not count.

**Third, say what you are doing now.** Not what went wrong historically, and not who should have done better. "I am taking this ticket personally, I am going to look at the account now, and I will call you within the hour." Concrete, present tense, with a deadline.

**Fourth, keep the promise or re-negotiate before it expires.** A broken promise converts a calming situation back into an angry one, and worse than before. If you cannot make the hour, call at fifty minutes and say so.

**Fifth, do not accept abuse.** De-escalation has a floor. You can stay calm, acknowledge frustration, and still say: "I want to help you, and I will. I need you to stop shouting so I can." If it continues, escalate to a manager — that is a legitimate response, not a failure. Nobody is required to absorb personal abuse, and organisations that expect staff to do so have a retention problem.

**What not to say**, with the reason:

| Do not say | Why it inflames |
|---|---|
| "Calm down." | It implies their reaction is unreasonable, which is a new insult on top of the original problem |
| "That is not my department." | True, sometimes — but it abandons them. Say who owns it and hand them over |
| "You should have logged a ticket." | Blames the user for the organisation's process |
| "I already explained that." | True and useless. Explain it again, differently |
| "There is nothing I can do." | Usually false. There is almost always a next step, even if it is escalation |

#### When you are the one who got it wrong

You will eventually break something. A change you made takes a service down, or you close a ticket that was not fixed, or you delete something you should not have. How you handle that moment is a stronger signal than almost any success.

**Say it immediately, plainly, and to the right person.** "I applied a change to the print server at 14:10 and printing has been down since. I am reverting it now." Notice the structure: what I did, when, what the effect is, what I am doing about it. No hedging, no passive voice, no "mistakes were made". The passive voice is where accountability goes to hide, and everyone can hear it.

**Speed matters more than the size of the mistake.** A small fault reported in two minutes is a small problem. The same fault discovered by someone else two hours later is an incident, because now nobody trusts the reporting.

**Do not apologise instead of acting.** An apology is necessary and it is not a substitute for the rollback. Fix first, apologise in the same breath, then write it up.

**Write the post-incident note** even if nobody asks, in the same shape as a ticket: what happened, when, what the impact was, what you did, and what would prevent it. This is the single artefact that converts a mistake into evidence of professionalism, because it is what a senior engineer does and it is what most beginners avoid.

#### The refusal that keeps the relationship

Sometimes the answer is genuinely no: the software is not approved, the access is not appropriate, the deadline is not achievable. Refusals are where support relationships are lost, and the shape of a good one is consistent:

1. **Answer quickly.** A slow "no" is worse than a fast one, because the user has been planning around a "maybe".
2. **Give the reason, once.** "That licence is not approved for this team" is sufficient. Repeating or over-justifying sounds defensive.
3. **Separate the decision from the person.** "I am not able to approve it" rather than "you cannot have it". You are describing your authority, not their worth.
4. **Offer the route that does exist.** "It can be approved by your manager through the change process — I can start that for you." A refusal with a path attached is a redirection, not a wall.
5. **Never invent a policy.** If you do not know the rule, say you will find out. Inventing one to make a refusal easier is the fastest way to lose credibility permanently, because it will be checked.

### Part 6 — Two interview answers, taken apart

Parts 1 to 5 taught the skills. This part shows them being assessed, because the interview is where this phase pays out.

#### "Tell me about a time you dealt with a difficult user"

This is the most common behavioural question in support hiring, and it is asked because the interviewer wants to know whether you will escalate or de-escalate when it costs you something.

**A weak answer:**

> "I have not really had a difficult user. I am a calm person and I get along with everyone."

Three problems. It claims no experience at the moment experience was requested. "I am a calm person" is a self-assessment, and interviewers discount those. And it gives them nothing to follow up on, so the conversation dies.

**A strong answer** (in STAR shape, ninety seconds):

> **Situation:** "A colleague was locked out of her account for the second time in a week and she was frustrated, which was fair — her deadline was that afternoon and I was the second person she had spoken to."
> **Task:** "I needed to get her working, and I needed her to trust that this attempt would stick rather than being another quick reset."
> **Action:** "I let her finish explaining before I said anything. I told her the pattern was the important part and that a second lockout in a week meant her password was not the problem. I asked whether she had any saved logins — she had a saved VPN profile. I reset the password, then walked her through updating the saved VPN credential, and I did it on a call rather than sending instructions, because that was the step the previous fix had missed."
> **Result:** "She was working inside twenty minutes and has not been locked out since. I wrote the stored-credential check into our password-reset procedure so the next person catches it on the first ticket rather than the second."

What makes it strong: the user's frustration is acknowledged as legitimate rather than painted as unreasonable; the action is specific and uses "I"; the diagnosis explains *why* the previous fix failed; and the result includes a process change. The last sentence is what separates this from a good story into a hiring signal — it shows the candidate improved the system, not just the ticket.

#### "You have no degree and no professional IT experience. Why should we hire you?"

This is the question you are most likely to dread, and it has a reliable structure.

**Do not:** apologise, use the word "but" after "I know I don't have a degree", overclaim ("I basically have the same knowledge as a graduate"), or get defensive about the question itself. The interviewer is not attacking you; they are testing how you handle it.

**Do:** answer the real question, which is *can you do this job and will you be reliable*.

> "That is a fair question. What I have is a deliberate, structured route into this work rather than a degree. I have worked through networking, Windows administration, ticketing systems and security fundamentals, and at every stage I built something rather than only reading — a subnetting worksheet, a PowerShell inventory script, five ticket templates, an asset inventory, and written troubleshooting reports with the evidence in them.
>
> The part that translates directly to this role is that I documented my work as I went, because I knew the portfolio would have to argue for me. So I can show you not just that I studied, but how I diagnose something and how I write it up. I have also been the person my family and friends call when their computer breaks, which has taught me a lot about explaining things to someone who is already frustrated.
>
> What I do not have is experience in a real environment at volume, and I am not going to pretend otherwise. What I would ask is the chance to show that I learn fast and that I do not need to be told something twice."

Why this works: it answers honestly, it points at artefacts, it converts the gap into a specific and bounded admission rather than a general insecurity, and it ends with a request rather than a plea. The final sentence about learning fast is a claim the portfolio has already supported.

#### The follow-up questions, and why your stories must survive them

Interviewers probe, because a memorised answer has no depth beneath it. Prepare for these on every story:

- "What would you do differently?" — Have a real answer. "Nothing" reads as no reflection.
- "Why did you choose that approach?" — If you cannot explain the reasoning, the story sounds borrowed.
- "How did you know it was fixed?" — This is a verification question. Answer with the evidence, not "the user said thanks".
- "What did you learn?" — The weakest possible answer is a platitude. A specific behaviour change is the strongest.
- "What was your actual role, versus the team's?" — The implicit "we" check. Be ready to draw the line precisely.

### Part 7 — Model answers you can compare against

Parts 1 to 6 taught the moves, and the practice list at the end of the phase is where you get your reps. This part gives you the thing that is missing when you study alone: **something to check your work against**.

Soft skills are the hardest thing to self-teach, because there is no compiler to tell you that you got it wrong. Below is a weak attempt and a strong attempt for each of the situations this phase covers. Write yours first, then compare. Do not read the strong version first — the gap between your attempt and it is the lesson.

#### Model 1 — The opening reply to a vague ticket

Ticket: *"My computer is slow. Please fix."*

**Weak:**

> Hi, can you give me more details? What do you mean by slow?

Three problems. It asks the user to do the diagnostic work, gives no acknowledgement, and offers no time commitment. The user now has to think about what "slow" means, which they cannot do.

**Strong:**

> Hi Maria — thanks for flagging this. Slow machines are usually fixable, so let's get it sorted.
>
> Three quick questions so I can start looking:
> 1. Is it slow all the time, or only with certain programs?
> 2. Roughly when did it start — today, or has it been getting worse over weeks?
> 3. Is anyone else on your team seeing the same thing?
>
> I will pick this up as soon as I hear back, and I will update you either way by end of day.

**Why it works:** acknowledges first, asks questions the user can actually answer, explains why each question matters, and commits to an update even if there is no progress. "I will update you either way" is the sentence that stops people chasing you.

#### Model 2 — The status update with no ETA

The hardest update to write, because "I do not know when" has to be delivered without losing confidence.

**Weak:**

> Still working on it. Will let you know.

That is not an update. It answers none of the four questions a user has.

**Strong:**

> **Update on your printing issue — still open, no fix yet.**
>
> **What I know:** the printer is dropping off the network after about ten minutes, and it affects three people on your floor.
> **What I am doing:** I have a replacement unit arriving tomorrow morning and will swap it before 10am.
> **What you need to do:** nothing right now. If you need to print urgently today, the printer by reception is working.
> **Escalated?** Not yet. If the swap does not fix it, I will escalate to the network team tomorrow.
>
> Next update: tomorrow by 11am, whether or not it is fixed.

**Why it works:** it answers all four questions — is it known, when, what do I do, has it escalated — and gives a workaround. The workaround is what turns a frustrating update into a usable one.

#### Model 3 — The "I don't know yet"

**Weak:**

> I am not sure, I will look into it.

**Strong:**

> I do not know yet, and I would rather tell you that than guess and be wrong.
>
> Here is what I do know: the error is coming from the mail server, not your laptop, which means it is probably affecting other people too.
> Here is my plan: I am checking the server logs now, and I have asked the mail admin whether anything changed overnight.
> I will come back to you within the hour with either an answer or a clearer picture.

**Why it works:** naming what you *do* know demonstrates that your not-knowing is informed rather than helpless. The specific time commitment is what makes it credible.

#### Model 4 — The "I broke something" note

Send this **immediately**, in active voice, under 100 words.

**Weak:**

> It appears that some issues may have been experienced with printing this morning due to a change that was made. This is being looked into.

Passive voice throughout. Nobody did anything, nothing is being owned, and the reader has to decode it.

**Strong:**

> I broke printing this morning and I am fixing it now.
>
> At 09:15 I applied a driver update to the print server. It was the wrong version for two of our printers, and they have been offline since.
>
> I rolled the change back at 09:40 and both are printing again. If yours is still failing, restart it once and tell me.
>
> I am sorry for the disruption. I will test driver updates on one printer before rolling them out, starting today.

**Why it works:** active voice, the cause is named, the fix is already done, the times are exact, and it ends with a changed process — which is what turns a mistake into evidence of competence rather than a mark against you.

#### Model 5 — The refusal that keeps the relationship

Request: a user wants software installed that is not approved.

**Weak:**

> That is not my department, you will need to raise a request.

The user now has to find out which department, and their problem has been moved rather than answered.

**Strong:**

> I can't install that one, and I want to be straight with you about why: it is not on our approved list, so I am not able to put it on a company machine.
>
> Here is what I can do instead. If there is a business reason you need it, I will help you put the request together and send it to the person who can approve it — that usually takes a couple of days.
>
> If you just need to do the task now, tell me what you are trying to achieve and I will find you an approved tool that does it.

**Why it works:** fast, the reason is given once without over-explaining, the decision is separated from the person, and two real routes are offered. It never invents a policy it cannot back up.

#### Model 6 — Same problem, two readers

This is the exercise the whole phase is really about.

**To a technical colleague:**

> The machine is failing to complete the DHCP handshake on the corporate VLAN. It gets an APIPA address, so it is not reaching the scope. I have ruled out the cable and the switch port. Suspect the scope is exhausted or the reservation is stale — checking the lease table next.

**To the user:**

> Your laptop is not being given an address on the network, which is why nothing loads. I have checked the cable and the wall port, so it is not a physical problem. I am looking at the network side now and will update you within the hour.

**The four differences to notice:**

| | Technical colleague | User |
|---|---|---|
| Vocabulary | DHCP, VLAN, APIPA, scope | "not being given an address" |
| Ruled out | Named specifically | Stated as a conclusion, with no jargon |
| Uncertainty | Suspects, will check | "I am looking at it now" |
| Next step | Checking the lease table | An update within the hour |

The facts are identical. Only the packaging changed. **Being able to do this on demand, without losing accuracy, is the skill.**

#### Model 7 — The no-degree answer, and the follow-up

**Weak:**

> I do not have a degree, but I have been teaching myself IT and I am a fast learner.

"But" deletes everything before it, and "fast learner" is a claim with no evidence.

**Strong:**

> I do not have a degree. What I have is a year of self-directed study and a portfolio you can check.
>
> I built the ticket set and the runbook from my own home lab and wrote up three investigations from it, including one where my first alert threshold fired on a known false positive and I had to work out why. Those write-ups are in the portfolio I sent you.
>
> What that shows is not that I know everything. It is that when I do not know something, I can find it and prove I found it.

**The follow-up you will get:** *"But why should we take you over a graduate?"*

**Weak answer:** "I work harder than most graduates."

**Strong answer:**

> A graduate has two years of theory I do not have, and I would not pretend otherwise. What I have that a fresh graduate often does not is a habit of documenting my work and showing my reasoning, because nobody was grading me — I had to be able to check myself.
>
> In this role, the first six months are learning your environment anyway. What matters is whether I can be trusted to investigate something and report it accurately. The portfolio is my evidence for that, and I would rather you judge me on it than on my answer right now.

**Why it works:** it concedes the real gap instead of denying it, redirects to something true and checkable, and reframes what the role actually needs in the first six months. That reframe is honest — it is also the strongest thing you can say.

#### How to use this section

Do not read these and nod. That produces recognition, not skill.

| Step | What to do |
|---|---|
| 1 | Cover the model answers. Read only the scenario |
| 2 | Write your own version. Do not aim for perfect — aim for done |
| 3 | Uncover the model and compare **sentence by sentence**, not overall |
| 4 | Name the specific difference: was it the acknowledgement, a missing time commitment, a hedge, an invented policy |
| 5 | Rewrite yours once, using what you found |
| 6 | Say it out loud. Written answers and spoken answers are different skills |

**Repeat at least three of these a week apart.** The first pass teaches you the structure. The second pass is where it starts to become automatic.

#### The self-check that matters

You cannot ask a teacher whether your answer was good, so use these four questions instead:

| Question | If the answer is no |
|---|---|
| Did I acknowledge before I asked or explained? | You will get less information than you need |
| Did I commit to a specific time for the next contact? | The user will chase you, and you will lose control of the ticket |
| Did I separate what I know from what I am guessing? | You are about to be wrong in public |
| If I refused or said no, did I offer a route that exists? | You have moved the problem, not answered it |

Four questions, and they work on almost every piece of support writing you will produce.

### Key takeaways

- **Acknowledge before you diagnose.** The user needs to know they were heard before they can answer your questions.
- **"I'll come back to you either way"** is the sentence that prevents users from chasing you.
- **Ask about symptoms, not causes.** A user's theory of the problem is usually unreliable.
- **Three questions to memorise:** exact error wording, when it last worked and what changed, does it affect others.
- **Never blame the user.** Blame makes people defensive, and defensive people withhold information.
- **"I don't know yet, here's my plan, here's when I'll update you"** builds more trust than a confident guess.
- **Lead async messages with the ask**, and separate fact from interpretation.
- **Update every open ticket on a schedule**, even when the update is "no news yet".
- **STAR: Situation, Task, Action, Result** — and say "I", not "we".
- **No degree is a self-direction story, not an apology.** Support it with artefacts, not explanations.
- **Evidence beats explanation.** The portfolio argues for you.
- **Every status update answers four user questions:** is it known, when will it be fixed, do I need to do anything, and has it been escalated.
- **De-escalation is a sequence, not a talent:** let them finish, name the impact, say what you are doing now, keep the promise, and do not accept abuse.
- **"But" deletes everything before it.** "I understand, but..." tells the user their frustration did not count.
- **When you break something, say it immediately and in active voice.** The passive voice is where accountability hides, and speed matters more than the size of the mistake.
- **A good refusal answers fast, gives the reason once, separates the decision from the person, and offers the route that does exist.** Never invent a policy.
- **Your STAR stories must survive follow-ups.** If "what would you do differently?" collapses the story, you do not own it yet.
- **The strongest story ending is a process change**, because it shows you improved the system rather than only the ticket.

### Practice this next

The tasks below turn this into reps. Draft your five STAR stories and tell each one out loud to a real person, timing it. Write the same explanation of a technical problem twice — once for a technical colleague, once for a non-technical user — and compare them.

Then take the ticket you wrote in Phase 4 (or any of the worked tickets in this roadmap) and rewrite its closure note for a nervous user who is afraid they broke something, because that is the writing you will do most often in your first job. If you have no live tickets yet, that rewrite is the exercise — the reading of a real closure note is what you are practising, not the owning of the queue.

Then push further:

1. **Rewrite three real messages from Part 5's "do not say" table.** Take "calm down", "that is not my department", and "there is nothing I can do", and write what you would actually say instead, in a specific scenario you invent. The replacement must still refuse or redirect where that is the honest outcome.
2. **Script the sequence for an angry user, then say it aloud.** Write your five de-escalation moves into your own words and record yourself delivering them. Then listen back and find the place where you would naturally have interrupted — that is the reflex you are training out.
3. **Write your own "I broke something" note.** Invent a realistic mistake — you applied a change that took printing down — and write the immediate message you would send, under 100 words. Then write the post-incident note. The first must contain no hedging and no passive voice.
4. **Prepare the no-degree answer and have someone attack it.** Deliver it, then have the person ask "but why should we take you over a graduate?" and answer that follow-up without repeating yourself. The follow-up is the real question.
5. **Take each of your five STAR stories and write three follow-up questions** a hostile-but-fair interviewer would ask. Then answer them out loud. Any story that does not survive this is not finished.
6. **Record a ninety-second story and time it precisely.** Most people's "short" story runs three minutes. Cut it to ninety seconds without losing the result, then deliver the shorter version — that is the discipline the timing table in Part 3 is asking for.
7. **Write one status update using the four user questions** from Part 4, for a ticket that is genuinely stuck and has no ETA. This is the hardest version, because "I do not know when" has to be delivered without losing the user's confidence.
8. **Take a refusal you have actually received or given** and reshape it into the five-part structure from Part 5 — fast, reason once, decision not person, route that exists, no invented policy.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Grammarly | Writing checker | Freemium | https://www.grammarly.com/ | Rewrite 5 ticket replies clearly | LanguageTool |
| LanguageTool | Writing checker | Freemium/open-source | https://languagetool.org/ | Check grammar of resume/tickets | Grammarly free |
| Google Docs | Documents and comments | Free | https://docs.google.com/ | Draft support templates | LibreOffice Writer |
| Loom | Screen recording | Freemium | https://www.loom.com/ | Record 2-minute troubleshooting demo | OBS Studio |
| OBS Studio | Screen recording | Free/open-source | https://obsproject.com/ | Record walkthrough of no-internet checks | Windows Snipping Tool + notes |
| LinkedIn | Professional networking | Free/freemium | https://www.linkedin.com/ | Write About section and connect with 10 IT people | OnlineJobs profile |

## Free/cheap resources

- STAR interview method — https://www.themuse.com/advice/star-interview-method
- Harvard resume/communication career resources — https://careerservices.fas.harvard.edu/resources/
- Atlassian remote work guides — https://www.atlassian.com/blog/remote-work
- Google technical writing courses — https://developers.google.com/tech-writing

## Hands-on practice tasks

1. Rewrite 5 bad ticket responses into professional responses. <!-- id: it-07-t01 band: focused energy: normal -->
2. Create 10 troubleshooting questions for “internet is slow.” <!-- id: it-07-t02 band: focused energy: normal -->
3. Create 10 troubleshooting questions for “I cannot log in.” <!-- id: it-07-t03 band: focused energy: normal -->
4. Record a 2-minute screen walkthrough explaining how to check IP/DNS. <!-- id: it-07-t04 band: focused energy: normal -->
5. Write 5 STAR stories: learning fast, fixing a problem, dealing with conflict, admitting a mistake, helping a user. <!-- id: it-07-t05 band: focused energy: normal -->
6. Draft a short LinkedIn About section. <!-- id: it-07-t06 band: quick energy: normal -->

## Deliverable / proof of work

Create `portfolio/it/07-soft-skills.md` with:

- 5 polished support replies
- 20 diagnostic questions
- 5 STAR stories
- Link or notes for a 2-minute troubleshooting recording
- LinkedIn About draft

When Phase 8 has you build the six-folder portfolio repository, this file belongs in `ticketing-samples/` alongside the Phase 6 templates — the support replies and diagnostic questions are ticket-shaped work, and that is the folder a reviewer will look in for it.

## Checklist

- [ ] I wrote 5 professional support replies. <!-- id: it-07-c01 energy: normal -->
- [ ] I wrote diagnostic questions for login and network issues. <!-- id: it-07-c02 energy: normal -->
- [ ] I created 5 STAR stories. <!-- id: it-07-c03 energy: normal -->
- [ ] I recorded or scripted a 2-minute troubleshooting explanation. <!-- id: it-07-c04 energy: normal -->
- [ ] I drafted my LinkedIn About section. <!-- id: it-07-c05 energy: normal -->
- [ ] I can explain technical steps without sounding condescending. <!-- id: it-07-c06 energy: low -->

## You're ready to move on when...

You can write a ticket update that is clear, polite, and useful even when the issue is not solved yet.

## Free vs Paid

### What's free and enough

Google Docs, LanguageTool, Grammarly free, OBS, and LinkedIn free are enough.

### What's paid and why you'd upgrade

Paid Grammarly/Loom/LinkedIn Premium can improve convenience or visibility, but they are not required.

### When it's worth paying

Not worth paying while your budget is $0. Spend time improving writing samples instead.
