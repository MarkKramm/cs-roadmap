---
id: advance-03-incident-command
track: advance
phase: 3
order: 30
title: "Phase 3 — Incident Command"
duration: "5 weeks"
duration_weeks: 5
energy_mix: [low, normal]
deliverable: "portfolio/advance/03-incident-command.md"
exit_criteria: "You can take command of a live incident: declare it at a defensible severity, assign roles, run the bridge call and briefing cadence, keep a decision log, hand over a shift cleanly, and facilitate the review that turns it into change."
---

# Phase 3 — Incident Command

## Goal of this phase

Learn to run an incident rather than work one: to stand at the front of a response with other people in it, decide what happens next, keep everyone aligned, and be the person who is accountable for the outcome when the ticket closes.

## Estimated time

**5 weeks** at about 8–11 focused hours a week. Roughly 42–56 hours, and the exercise write-ups are most of it.

## Skills you'll gain

- Declare an incident and assign a severity with a written rationale a reviewer can audit.
- Explain why command and hands-on work are separate jobs, and stay out of the hands-on work.
- Fill the four core command roles and decide when a role must be split or added.
- Keep span of control workable by structuring a large response into teams with their own leads.
- Run a bridge call that produces decisions rather than a status recital.
- Set a communication cadence for technical, management, and executive audiences, and keep to it.
- Brief an executive and a legal or privacy officer in the register each of them needs.
- Write a decision log that records what was decided, by whom, on what evidence, and what was rejected.
- Hand an incident over to another shift without losing the thread or repeating work.
- Facilitate a post-incident review that produces owned, dated actions instead of blame.
- Run a tabletop exercise and write an inject list that exposes real gaps.
- Command credibly when you are the most senior person available and also the least experienced person in the room.

## Specific topics to learn

- Incident command as a concept: the incident command system (ICS), its origin in emergency response, and what adapts cleanly to security and what does not
- The four core roles: incident commander, operations lead, communications lead, and scribe
- Span of control: the practical limit on how many people one person can direct, and how to structure around it
- Command versus doing: why a commander who takes a keyboard stops commanding
- Declaration: who may declare, what declaration changes, and how a declaration is announced
- Severity and priority in a command context: severity drives authority, priority drives order of work
- The unified command idea: when two organisations or two business units must share authority
- Bridge calls: opening one, the standing agenda, the round-robin, and when to close it
- Communication cadence: the update clock, the situation report (SITREP), and the difference between an update and a decision request
- Executive briefing: the five-question shape, and how to say "I do not know yet" without losing confidence
- Legal, privacy, and regulatory briefing: what counsel needs, what triggers a notification question, and why routing is your job and answering is not
- Decision logging: what a decision record contains and why the rejected option matters
- Shift handover: the written handover pack, the verbal walkthrough, and the warm handover
- Running long incidents: fatigue rotation, the second shift, and knowing when to hand off
- Tabletop exercises: scenario design, inject lists, facilitation, and recording findings
- The post-incident review: blameless facilitation, timeline reconstruction, contributing factors, and action ownership
- Commanding without authority: leading peers, contractors, and people more senior than you

## Lesson: Command Is a Job You Do With Your Voice, Not Your Hands

### Why this lesson exists

Everything in the previous phase of this track taught you to work an incident. You triage, you contain, you preserve, you analyse, you write it up. That is a complete skill set and it is enough to be genuinely useful in a security team.

It is not enough to lead one.

The gap between those two things is not technical depth. It is a completely different job, and the uncomfortable part is that the skills that made you good at the first job actively get in the way of the second one. The fastest analyst on the team is often the worst incident commander, because the moment something goes wrong their instinct is to open a terminal and start looking, and the moment they do that, nobody is commanding.

An **incident commander** (IC) is the single person accountable for the response to an incident. They decide what happens next, who does it, what gets communicated, and when the incident is over. They do not personally run the forensic tools, they do not personally reset the passwords, and — this is the part people resist — they do not personally do the thing they are best at, even when they could do it faster than the person who has been assigned it.

This phase teaches that job. It teaches you how to declare an incident and defend the severity you chose, how to fill four roles that most teams have never named, how to run a call that produces decisions instead of a recital of what everyone has already seen, how to tell an executive the truth about something you do not understand yet, how to hand an incident to the next shift without losing an hour, and how to run the meeting afterwards that decides whether any of it was worth doing.

It also teaches the situation you will actually be in, which the textbooks quietly skip: **you will be the most senior person available and the least experienced person in the room.** You will be commanding a response that includes a network engineer with fifteen years of experience, a helpdesk lead who knows where every file lives, and an external consultant the company pays more than your annual salary. You will have been in security for three years and you will be telling them what to do. That is not a hypothetical. That is what being the on-call shift lead at a small company means.

The reason this is teachable is that command is a set of practices, not a personality. You do not need to be the loudest person or the most technically capable. You need a declaration procedure, a role table, a call agenda, a cadence, a decision log, a handover format, and the discipline to keep your hands off the keyboard. Those are all learnable in five weeks, and this lesson is how.

#### What the exit criterion actually demands

| Requirement | The skill underneath it |
|---|---|
| **Take command of a live incident** | Assuming authority deliberately rather than drifting into it |
| **Declare it at a defensible severity** | Judgement, written down, that survives being questioned later |
| **Assign roles** | Knowing which four jobs must exist and who can hold them |
| **Run the bridge call and briefing cadence** | Facilitation, timekeeping, and translating between audiences |
| **Keep a decision log** | The written record that makes the whole response auditable |
| **Hand over a shift cleanly** | Continuity, and the humility to hand off before you are finished |
| **Facilitate the review that turns it into change** | Turning a bad week into owned, dated actions |

The fifth one is the one that gets a candidate promoted and the one most people never practise. Ask a room of analysts what happened in their last incident and they will tell you a story. Ask them what was decided, when, by whom, and what alternatives were considered, and most will go quiet. The decision log is the difference between an incident that was handled and an incident that can be shown to have been handled.

#### Time to complete

**Roughly 45–58 hours over 5 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 3–4 | Once, properly |
| Declarations and severity drills | 5–7 | Short, repeated, uncomfortable at first |
| Writing your own role cards and cadence plan | 6–8 | The reusable artefacts |
| Running or co-running one tabletop | 8–10 | The highest-value practice in the phase |
| Writing two full decision logs | 6–8 | One from a real or recorded incident, one from your tabletop |
| The worked incident run-through | 8–10 | The portfolio centrepiece |
| Executive and legal briefing practice | 4–5 | Recorded, then reviewed |
| The post-incident review you facilitate | 5–6 | Write the report and the action tracker |

Nothing here needs a lab, a licence, or a paid course. A whiteboard, a chat channel, a timer, and two or three willing people are enough for most of it.

#### What this phase is not

It is not a management qualification. You are not learning how to run a team year-round, how to do performance reviews, or how budgets work. You are learning one bounded, high-pressure, temporary role.

It is not a replacement for technical skill. A commander who cannot follow a technical conversation cannot ask the question that exposes a wrong assumption, and asking that question is most of the value you add in the first hour.

And it is not about being in charge for its own sake. The point of command is that someone is accountable. If nobody is, decisions get made by whoever is loudest or fastest, and the response drifts.

### Part 1 — Command is not doing

The single hardest habit to break in this job is reaching for the keyboard.

You are on a bridge call. The analyst reports that an account has a suspicious mail rule. You know exactly where that is in the admin console. It would take you ninety seconds. You open a tab and start clicking, and for those ninety seconds you are not listening to the call, not answering the question the helpdesk lead just asked, and not tracking that the network engineer has been waiting to say something for two minutes.

That is what a commander who does things looks like from the outside. It is not that they are lazy or incompetent. It is that the work absorbs attention, and command is entirely an attention job.

**The rule that follows from this is simple and absolute: an incident commander does not work tickets.** If you find yourself doing hands-on work during an incident, one of two things must be true: either the incident does not need a commander any more, or you should hand the commander role to someone else and go work the ticket properly.

| The commander does | The commander does not do |
|---|---|
| Decide what happens next | Perform the next technical action |
| Assign an owner to every action | Complete the action personally |
| Ask the question that tests an assumption | Verify the answer themselves |
| Set and announce severity | Investigate to establish severity alone |
| Keep the clock and the cadence | Lose track of time inside a tool |
| Communicate outward | Communicate only with the people in the room |
| Record decisions and rejected options | Remember them later and hope |

Two rows in that table are the ones that get skipped under pressure.

**"Assign an owner to every action"** sounds bureaucratic until you have watched an action be agreed by four people on a bridge and completed by none of them, because everyone assumed the person who said "yeah, we should do that" was going to do it. An action without a named owner is not an action. It is a sentiment.

**"Ask the question that tests an assumption"** is where the commander's technical background actually pays. You are not there to run the tool, but you are there to ask "what would we expect to see on the other hosts if that theory is right, and have we looked?" That question has ended more wrong investigations than any tool.

#### The wrong first guess: the commander who keeps working

This is the most common failure in the first hour of a real incident, and it is worth naming explicitly because it feels like diligence.

```text
WRONG FIRST GUESS — "I will just do the first bit myself, it will be faster."

  01:14  Alert fires. You are the on-call shift lead. You are also the
         best analyst on the shift. You start investigating.
  01:20  You have confirmed it is real. Good.
  01:23  You keep going, because you are already in the data and it
         would be slow to explain it to someone else.
  01:31  You have identified the account and the mail rule. Still good.
  01:44  You are still going. Two more alerts have now arrived that
         nobody has looked at, because the only person who could have
         triaged them is you.
  01:52  You notice the second alert for the first time. It is on a
         second account, and it fired 38 minutes ago.

  What actually happened: the incident grew by 50 percent during the
  38 minutes when the person responsible for noticing was busy
  being useful.
```

The fix is not to be less capable. The fix is to make one decision early: **the moment you accept the commander role, you stop being an analyst for the duration.** You can hand back to yourself later, but you have to say so out loud, name who is taking command, and record it.

If you are the only person available — a very common situation at a small company at 2 a.m. — then you are doing both jobs, and the honest way to do that is to **timebox the hands-on work and keep the command clock running**. Work in ten-minute blocks, and at the end of every block, stop, look outward, and ask what has arrived while you were heads-down.

```bash
# A commander working solo still keeps a clock and a log.
# This is a real pattern, not a metaphor: one file, append-only, UTC.
mkdir -p ~/incidents/INC-2026-0417-01
cd ~/incidents/INC-2026-0417-01 || exit 1

printf 'INCIDENT LOG — INC-2026-0417-01\nCommander: (your name)\n' > log.md

# Timestamp every entry as you type it, so the log is usable later.
log() { printf '%s  %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*" | tee -a log.md; }

log "Declared S2. Working solo. Bridge open in the incident channel."
log "D-001: revoke sessions on acct r.delacruz — approved, owner ops."
sleep 600
log "Ten-minute check: two new alerts arrived while heads-down. Triaging."
```

The last line is the discipline. Ten minutes of hands-on work, then a forced outward look. The log line proves you did it, and it is the line a reviewer will thank you for.

### Part 2 — The four roles, and span of control

The incident command system (ICS) is the structure that emergency services use to run a response, and it was formalised in the United States after a series of wildfires where multiple agencies arrived and could not coordinate. The security industry borrowed it because the problems are identical: an event that crosses organisational boundaries, a response that grows faster than anyone planned, and a need for one person to be accountable.

You do not need the full ICS org chart. You need four roles, and you need to know when each one exists.

| Role | What they own | What they must not do |
|---|---|---|
| **Incident commander (IC)** | The response as a whole: decisions, priorities, severity, declaration, closure | Hands-on technical work |
| **Operations lead** | All the hands-on work: who is doing what, technical direction | Communicate outside the response |
| **Communications lead** | Everything going outward: stakeholders, executives, customers, the status page | Technical decision-making |
| **Scribe** | The written record: timeline, decision log, action list, attendance | Anything else, and this is the point |

**On a small incident, one person may hold two roles.** On a large one, each role is a full-time job. What is never acceptable is a role with no name attached, because an unnamed role is a role nobody is doing.

Three rules make this structure work.

**The incident commander is the only person who declares and closes.** Anyone may detect, anyone may propose a severity, but the IC owns the declaration. This matters because declaration is what turns normal work into an incident, and it is the moment people rearrange their day.

**The operations lead is the only person directing hands-on work.** Nothing wastes more time in a response than four people giving four engineers four different instructions. If you are the IC and you want something technical done, you ask the ops lead, not the engineer.

**The scribe writes in real time.** A scribe who reconstructs the timeline afterwards is writing fiction. The scribe's job is to capture the decision as it is made, including the option that was rejected, because that is the detail that vanishes within an hour.

```text
ROLE CARD — Incident Commander

  You own:      the outcome of the response.
  You decide:   severity, declaration, closure, priorities, and who does what.
  You announce: decisions, with the time and the reason.
  You never:    run a tool, read a log, or edit a ticket while commanding.

  Your first five actions, in order:
    1. Declare, or explicitly decline to declare, with a reason.
    2. Open one channel and one bridge, and say where they are.
    3. Name the roles, out loud, and record who holds each.
    4. Set the update clock: "SITREP every 30 minutes, on the hour and
       half hour, whether or not anything changed."
    5. Write the first decision log entry before the first technical
       action is taken.

  Your four standing questions, at every bridge:
    - What do we now know that we did not know at the last update?
    - What decision is waiting on me?
    - What is the single most likely way this is worse than we think?
    - Who has been working for more than four hours without a break?
```

#### Span of control, and why it forces structure

**Span of control** is the number of people one person can effectively direct. In practice, for a high-tempo incident, it is somewhere between three and seven, and five is a comfortable working number. Beyond that, people wait, information stops flowing, and the person at the centre becomes a bottleneck without noticing.

This is why a response that grows past roughly ten people needs a second layer. You do not get a better commander by giving one commander more people. You get a worse one.

| Response size | Structure | What changes |
|---|---|---|
| 1–3 people | One IC, who may also be the ops lead | The IC works, because there is nothing to command |
| 4–7 people | IC plus ops lead, comms lead, scribe | Command becomes a real job; the IC stops working |
| 8–15 people | Add team leads under the ops lead: an endpoint team and an identity team | The ops lead stops directing individuals and starts directing leads |
| 15+ people | Add a deputy IC, a planning or intelligence function, and a second comms stream for customers | The IC manages the structure, not the work |

```text
INCIDENT ORG — 12 people, ransomware, hour 4

  Incident Commander ................. R. Bautista
    ├── Deputy IC .................... (none yet — add at hour 6)
    ├── Scribe ....................... J. Lim
    ├── Comms Lead ................... A. Cruz
    │     └── Customer comms .......... (split out if external impact confirmed)
    └── Ops Lead ..................... M. Santos
          ├── Endpoint Team Lead ...... K. Reyes
          │     └── 3 analysts
          └── Identity Team Lead ...... D. Ocampo
                └── 2 engineers

  Rule: instructions flow down. Information flows up.
  Rule: anyone may raise a safety or evidence concern directly to the IC,
        bypassing their lead. Say this out loud at the first bridge.
```

The second rule at the bottom is not decoration. In a fast response, a junior analyst who sees the team about to destroy evidence needs a route to the commander that does not depend on persuading their team lead first.

### Part 3 — Declaration, severity, and who gets to say the word

**Declaration** is the act of formally naming something an incident and starting the response structure. It is a decision, it belongs to the incident commander, and it must be announced.

The most common failure in small organisations is not over-declaring. It is never declaring at all: a "weird thing" is worked by two people in a chat thread for six hours, nobody tells the business, and when it turns out to be real, the organisation discovers it has been in an incident for six hours without any of the machinery that an incident needs.

**The bias should be toward declaring.** A declared incident that turns out to be small is closed in an hour with a short note. An undeclared incident that turns out to be large has already cost you the first six hours.

| Severity | What it means | Command implications |
|---|---|---|
| **S1 — Critical** | Confirmed or strongly indicated compromise of critical or regulated systems, or an active attacker with privileged access | Dedicated IC, full role set, executive notification, 15-minute cadence, containment pre-authorised |
| **S2 — High** | Confirmed compromise of an account or a single host, with no confirmed spread | Named IC, ops lead, scribe, 30-minute cadence, management notified |
| **S3 — Medium** | Suspicious activity, unconfirmed, or confirmed compromise of a low-value asset | Shift lead acts as IC, 60-minute cadence, no executive involvement yet |
| **S4 — Low** | Policy violation or a detection with a known benign explanation that still warrants a record | No command structure. Ticket and close. |

Three things about this scale are specific to command, and they separate it from the analyst's version of the same table.

**Severity determines authority, not just attention.** An S1 declaration is what lets you isolate a production system without a change request. If your severity scale does not unlock any authority, it is a label rather than a tool, and you will spend the incident asking permission.

**Severity sets the cadence.** The update clock is a function of severity. An S1 with a 30-minute cadence is an S1 that executives will stop trusting, because they will go looking for information elsewhere and start making decisions without you.

**Severity can be raised by anyone, but only the IC changes it.** Anyone may say "this feels bigger than S2." The IC decides. Announcing a severity change is a specific act with a specific format, because everyone downstream has to adjust.

```text
DECLARATION ANNOUNCEMENT — the format that works

  INC-2026-0417-01 — DECLARED S2 at 01:31Z by R. Bautista (IC).

  What:  Suspicious authentication and a mail-forwarding rule on the
         account r.delacruz, confirmed by two independent sources.
  Scope: One account confirmed. Two hosts under review.
  Impact: Not yet determined. Payroll file access is suspected.
  Roles: IC — R. Bautista. Ops — J. Lim. Comms — A. Cruz. Scribe — M. Santos.
  Next update: 02:00Z in #inc-2026-0417-01. Bridge is open and stays open.
  Decision needed from you: none yet. Do not start work unless asked.
```

That last line is doing real work. Without it, four well-meaning people start investigating in parallel and the response acquires four conflicting theories in ten minutes.

#### The wrong first guess: declaring S1 in the first ten minutes

There is a real failure mode in the opposite direction, and it is worth naming because it is the one enthusiastic new commander commits.

At 01:14 you see an impossible-travel alert and an unfamiliar mail rule. You declare S1, page the CISO, wake the head of IT, and post in the company-wide channel. By 02:30 you have established that the "impossible travel" was a stale VPN session and the mail rule was created by the user's own Outlook rule wizard three months ago.

You have now spent two executives' Saturday night on a false alarm, and — much worse — you have taught the organisation that your declarations are noise. The next time you declare S1, people will wait to see whether you are serious.

**The correct first guess is not S1 and it is not S4. It is S2 with an explicit escalation trigger.**

```text
S2 with trigger — the phrasing that keeps you honest

  "Declaring S2. We have one confirmed suspicious account and no
   confirmed spread. Escalation trigger: any evidence of file access,
   any second account, or any privileged identity involved — on any of
   those, I raise this to S1 immediately and notify the CISO."

  Why this works: the trigger is written down, so the decision to
  escalate is a lookup rather than a debate at 03:00 when everyone
  is tired and nobody wants to be the one who over-reacted.
```

### Part 4 — The bridge call: cadence, structure, and decisions

A **bridge call** is the shared audio or video line where the response team talks. In a small incident it is a chat channel plus an occasional call. In a large one it is a permanent open line that people join and leave for hours.

The bridge is where command actually happens, and a badly run bridge is worse than no bridge, because it consumes the attention of everyone in the response while producing nothing.

| Bad bridge | Good bridge |
|---|---|
| Everyone recites what they have been doing | The IC states what changed and what is next |
| Long technical debate between two people | A question is framed, an owner is named, the debate moves off the main call |
| Nobody knows when it will end | A stated end time, and a next update time |
| Silent for ten minutes while someone reads a log | Silence is timeboxed: "five minutes, come back with the answer" |
| Decisions made and never restated | Every decision repeated back and logged before moving on |
| Twenty people listening to four people talk | Only the people who need to decide are on the call |

**The standing bridge agenda** is short enough to memorise and rigid enough to survive a tired commander.

```text
BRIDGE AGENDA — Incident INC-2026-0417-01
Target length: 15 minutes. Hard stop at 20. The bridge stays open
between calls; the calls are the cadence, not the conversation.

  1. IC states the current picture. 60 seconds. No new work announced.
        "Here is what we know, here is what we do not know."

  2. Round-robin, in role order, 30 seconds each. IC and ops first,
     then comms, then scribe. Each answer has two parts:
        "I did X. The one thing blocking me is Y."

  3. Decisions needed. The IC takes them one at a time.
        State the decision. State the options. State the chosen option
        and the reason. Then have the scribe read it back.

  4. New actions. Every action gets an owner and a time.
        "Who owns it? By when?" — and if neither answer exists,
        the action is dropped, not carried.

  5. Next update time, stated out loud, every single call.
        "Next bridge at 02:30Z. Written SITREP at 02:15Z."
```

Step 2's two-part answer is the highest-leverage habit on the whole call. "I did X, and the one thing blocking me is Y" turns a status recital into a request for help, and requests for help are what a commander can actually act on.

#### Moving a technical debate off the main call

The most common way a bridge call collapses is that two engineers start a detailed technical argument and fifteen other people listen to it. The commander's job is to recognise this within about thirty seconds and intervene.

```text
IC: "Hold on. You two need ninety seconds on this. Everyone else,
     you are released — go do your next action, I will summarise
     the decision here. Back on the bridge in five."

  Then, at the next bridge, before anything else:

IC: "Decision D-006: we take the offline route on FS-02 because the
     live memory capture is still running and we do not want to disturb
     it. That is what we are doing. Moving on."
```

Two things happen there. The organisation does not spend fifteen person-minutes on a two-person argument, and the decision is announced to everyone including the people who were released — which is what stops the same debate restarting at the next call.

#### The situation report

A **situation report** — almost always shortened to SITREP — is the written update that goes to people who are not on the bridge. It is not a summary of the call. It is a structured statement of the current position.

```text
SITREP-03 — INC-2026-0417-01 — 2026-04-17 02:15Z

STATUS        Active. Contained. Not yet eradicated.
SEVERITY      S2, escalated from S2 at 01:31Z. No change.
WHAT WE KNOW  - Account r.delacruz had a mail-forwarding rule created
                2026-04-16 23:48Z, forwarding to an external address.
              - The account authenticated from two countries within
                40 minutes.
              - The account read 3 files from \\FS-02\Payroll.
WHAT WE DO NOT KNOW
              - Whether the files left the network. Egress is not
                logged on the affected segment.
              - Whether the second account under review is related.
WHAT WE HAVE DONE
              - Sessions revoked 01:52Z. Password reset 01:55Z.
              - Mail rule removed 02:02Z, rule definition preserved.
WHAT HAPPENS NEXT
              - FS-02 isolated at the switch, 02:45Z, owner M. Santos.
              - Egress log gap written up as a finding, owner J. Lim.
DECISIONS NEEDED
              - None at this time.
NEXT UPDATE   03:00Z written. Bridge continuous.
```

Four sections of that template do the work that managers actually need: what we know, what we do not know, what we have done, what happens next. The "what we do not know" section is the one that amateurs omit, and it is the one that makes the report trustworthy, because a reader who is told the boundaries of your knowledge can calibrate.

### Part 5 — Briefing people who are not in the room

There are three audiences outside the response, and they need three different briefings from the same facts. Sending all three the technical SITREP is one of the fastest ways to lose control of an incident's message.

| Audience | What they need | What they must not be given |
|---|---|---|
| **Executive** | Impact, decisions required, confidence level, timeline | Command-line output, host names, tool names |
| **Legal and privacy** | What data may have been affected, when it was accessed, what has been preserved | Speculation about who is responsible |
| **The wider business** | Whether to work, whether systems are down, where to ask | Anything about the attacker or the investigation |

#### The executive briefing

An executive briefing is not a shorter SITREP. It answers a different question. The executive is asking: **do I need to make a decision, and do I need to tell anyone?**

```text
EXECUTIVE BRIEFING — five questions, five answers, ninety seconds

  1. WHAT HAPPENED, IN ONE SENTENCE
     "An employee account was taken over and used to read payroll
      files from an internal server."

  2. WHAT IS AFFECTED TODAY
     "One account is contained. One internal file server is isolated
      as a precaution, affecting 40 users for roughly two hours."

  3. WHAT I NEED FROM YOU
     "Nothing yet. If we confirm payroll data left the network, the
      Data Protection Officer needs to be told tonight, and I will
      come back to you within the hour."

  4. HOW CONFIDENT AM I
     "Confident the account is contained. Not yet able to say whether
      data left the network, because outbound logs on that segment
      are not collected."

  5. WHAT HAPPENS NEXT
     "Next update at 04:00Z, or sooner if the picture changes."
```

The fourth answer is the one people get wrong. Saying "not yet able to say" is not weakness. An executive who is told a confident story that later falls apart will stop believing the next one.

**One rule for executive briefings: never brief on a bridge the executive can also hear.** If the CISO is on the technical bridge and also receives the executive briefing, you will be asked to be both precise and reassuring on the same call, and those two registers conflict.

#### The legal and privacy briefing

You are not a lawyer and this phase does not make you one. What it teaches is the command responsibility: **recognise that a legal or privacy question exists, route it to the person who answers it, and preserve everything in the meantime.**

| Question counsel will ask | What you should be able to answer |
|---|---|
| What categories of data were involved? | From the access logs and the file listing — not a guess |
| When was the data first accessible? | The earliest confirmed access time, with its source |
| When did you know? | The detection time and the declaration time, both timestamped |
| What have you preserved? | The evidence register, with hashes and times |
| Who else has been told? | The notification list you have already used |
| Is the activity still ongoing? | Contained or active, stated plainly |

```text
PRIVACY ESCALATION NOTE — the three-line version

  To: Data Protection Officer       From: R. Bautista, IC
  Time: 2026-04-17 03:40Z           Ref: INC-2026-0417-01

  1. Personal data may have been accessed. Specifically, the payroll
     folder on FS-02 was read by an account we believe was compromised.
     This is a suspicion based on file-access logs, not a confirmation.

  2. Access time window: 2026-04-16 23:51Z to 2026-04-17 00:04Z.

  3. Evidence is preserved and sealed. Nothing has been deleted.
     We are not making a determination about notification — that is
     yours. Tell me what you need and I will get it.

  Awaiting your direction. Next update from me in 60 minutes regardless.
```

The last sentence of that note is the one that makes it work. "Tell me what you need" turns an escalation into a request for instructions rather than a transfer of blame.

#### Briefing when you are the least experienced person in the room

This is the situation the phase exists for, so it gets its own treatment.

You are twenty-six, three years into security, and you have just declared an incident that involves the head of infrastructure, a database administrator with twenty years' experience, and an external DFIR retainer who charges by the hour. You have to tell them what to do.

Three things make this survivable.

**Authority is structural, not personal.** You are not commanding because you know more. You are commanding because the plan names a commander and the organisation needs one person accountable. Saying that out loud — "I am the IC on this incident; that means I own the decisions, not that I know more than any of you" — costs you nothing and buys you enormous credibility.

**Ask for disagreement explicitly, and reward it.** "If you think the containment plan is wrong, say so now, because I would rather be argued with than surprised." A commander who punishes dissent gets a room of silent experts and a decision that ignores what they know.

**Separate the technical question from the command question.** You cannot out-argue a database administrator about replication lag, and you should not try. What you can do is ask: "Given that, what is the risk if we isolate the replica now, and what is the risk if we wait an hour?" You are not supplying the answer. You are forcing the trade-off into the open, and then you own the choice.

```text
THE SENTENCE THAT DEFUSES MOST OF THIS

  "I am not going to pretend I know your systems better than you do.
   I am going to ask you for the trade-off, I am going to decide,
   and I am going to write down why. If I get it wrong, the record
   will show what I was told and what I chose, and that is on me."
```

### Part 6 — Handover, and running an incident that lasts more than a shift

Incidents do not end when your shift does. A response that runs past eight hours will cross a shift boundary, and the handover is where continuity is either preserved or destroyed.

A bad handover looks like this: the outgoing commander gives a fifteen-minute verbal summary of a six-hour investigation, the incoming commander nods, the outgoing commander goes home, and forty minutes later the incoming commander asks a question nobody can answer because the person who knew is asleep.

**A handover is a document plus a conversation, in that order.** The document goes first, so the incoming commander arrives already oriented, and the conversation is for the things that did not make it into writing.

```text
HANDOVER PACK — INC-2026-0417-01

  HANDOVER AT  2026-04-17 06:00Z
  FROM         R. Bautista (IC, night shift)
  TO           L. Tan (IC, day shift)

  CURRENT STATUS
    Contained. One account contained, one file server isolated.
    Not eradicated. Root cause not established.

  SEVERITY      S2, unchanged since 01:31Z. Reason for not escalating
                recorded in D-011: no evidence of spread beyond one
                account, and file access was read-only.

  WHAT IS DONE
    - Sessions revoked, password reset, mail rule removed and preserved
    - FS-02 isolated at the switch (D-007), memory capture in progress
    - Payroll file access window established: 23:51Z to 00:04Z

  WHAT IS OPEN, AND WHO OWNS IT
    - Memory capture of FS-02 ........ M. Santos ..... due 06:30Z
    - Egress gap write-up ............ J. Lim ........ due 12:00Z
    - Second account review .......... K. Reyes ...... due 08:00Z
    - DPO direction on notification .. DPO ............ awaiting

  OPEN QUESTIONS I COULD NOT ANSWER
    - Is the second account genuinely related, or coincidence?
    - Did the attacker have a second persistence mechanism we
      have not looked for? Nobody has checked scheduled tasks
      on FS-02 yet.
    - Retention window on the VPN logs: 14 days. Deadline 2026-04-30.

  DECISIONS I WOULD NOT LET GO OF
    - D-007: FS-02 isolated at the switch rather than powered off.
      Do not power it off. The memory capture depends on it.
    - D-009: no public statement until the DPO has been briefed.

  WHAT I WOULD DO NEXT IF IT WERE STILL MINE
    - Sweep scheduled tasks and services on all servers in the same
      subnet before touching anything else.

  ACCESS AND CREDENTIALS
    - Bridge: incident channel #inc-2026-0417-01, open
    - Evidence locker: seal S-4471, log at /evidence/inc-2026-0417-01
    - Executive contact: CISO mobile on the card, not in chat
```

The sections that make this work are the ones a verbal handover always loses: **open questions I could not answer**, **decisions I would not let go of**, and **what I would do next if it were still mine**.

That last one is generous and it is also the most valuable line in the document. It is not binding on the incoming commander. It is the outgoing commander saying "here is my judgement, you are free to overrule it, but at least you have it."

**The warm handover.** Overlap the two commanders for twenty minutes. The outgoing IC stays on the bridge, does not give instructions, and answers questions. Then they leave, publicly, with one sentence: "L. Tan is now the IC. All decisions go to her." Ambiguity about who is in command is the single most damaging thing a handover can produce.

| Handover failure | What it looks like | The fix |
|---|---|---|
| Verbal only | An hour of the next shift spent reconstructing | Written pack first, always |
| No open-questions list | The incoming IC repeats work already done | The "could not answer" section |
| Ambiguous authority | Two people giving conflicting instructions | An explicit, public transfer |
| A tired commander who stays | Mistakes, irritability, and a decision nobody can reverse | Mandatory rotation at a stated hour |
| No severity rationale | The new IC changes severity for no reason | The recorded reason for the current severity |

**Fatigue rotation is a command responsibility, not a personal virtue.** A commander at hour eleven makes worse decisions than one at hour three, and the research on this is consistent across every field that has studied it. Write the rotation into the plan before the incident starts, so sending someone home is a procedure rather than an insult.

### Part 7 — The decision log, and why it is the commander's real artefact

The **decision log** is the append-only record of every consequential decision in an incident: what was decided, when, by whom, on what evidence, and — critically — what was rejected and why.

It is not a timeline. A timeline says what happened. A decision log says what was chosen, which is the thing that cannot be reconstructed after the fact.

| Element | Why it exists |
|---|---|
| **ID** | So decisions can be referenced later — "D-007" is shorter than re-explaining it |
| **Time (UTC)** | So the pace of the response can be examined |
| **Decision** | One sentence, in the active voice |
| **Owner** | The person accountable — usually the IC |
| **Evidence** | What was known at the moment of the decision, not what is known now |
| **Alternatives rejected** | The single most valuable column in the whole log |
| **Review point** | When this decision should be revisited, if it is reversible |

```text
DECISION LOG — INC-2026-0417-01

D-001  01:31Z  Declare S2 for the r.delacruz account compromise.
       Owner: IC. Evidence: two independent detections, both confirmed.
       Rejected: S1 — no confirmed file access at this time.
       Revisit: on any evidence of data access.

D-003  01:52Z  Revoke sessions and reset the password on r.delacruz.
       Owner: Ops lead, approved by IC.
       Evidence: active session from an unfamiliar ASN.
       Rejected: disabling the account. Reason: the account audit trail
       keeps recording while the account exists, and we still need it.
       Revisit: at the 03:00Z bridge.

D-007  04:15Z  Isolate FS-02 at the switch; do not power it off.
       Owner: Ops lead. Evidence: the memory capture is still running
       and the server holds the access logs we need.
       Rejected: powering off — it would have stopped the attacker's
       access immediately but destroyed the volatile evidence, which is
       the only record of what was read. Rejected: disabling the NIC —
       it would have cut the live session that identifies the C2 host.
       Revisit: not reversible. Recorded permanently.

D-009  04:50Z  No public statement until the DPO has been briefed.
       Owner: Comms lead, on IC direction.
       Evidence: personal data may be involved; the disclosure question
       belongs to the DPO.
       Rejected: a holding statement at 05:00Z. Reason: it would commit
       the company to a description of the incident that is not yet
       established.
       Revisit: 08:00Z or on DPO direction.

D-011  06:00Z  Keep severity at S2 through the shift handover.
       Owner: Outgoing IC, confirmed by incoming IC.
       Evidence: no confirmed spread, file access read-only, no
       privileged identity involved.
       Rejected: raising to S1 for the handover "to be safe".
       Reason: severity drives notification and cost; inflating it
       without evidence erodes the meaning of the scale.
       Revisit: on the second-account review result at 08:00Z.
```

Read D-007 again, because it is the model entry. It records the decision, the reason, **two** rejected alternatives with the reason each was rejected, and the fact that it is irreversible. If a regulator or an executive asks six months later why a production file server was cut off during business hours, that entry is the answer, and it takes fifteen seconds to find.

#### The log is written in real time or it is not written

A decision log reconstructed after the incident is a summary with better formatting. The value of the log comes from being written at the moment of decision, when the alternatives are still visible in the room.

The practical way to make this happen is to make it the scribe's only job and to make the format mechanical. The commander says the decision out loud in a fixed shape, and the scribe types it.

```bash
# A decision log that survives contact with a real incident.
# One file, append-only, git-friendly if you want diffs later.

cat >> decisions.md <<'EOF'
## D-012 — 2026-04-17 08:20Z
- **Decision:** Extend isolation of FS-02 by 24 hours.
- **Owner:** L. Tan (IC)
- **Evidence:** Memory capture completed at 06:30Z; disk image
  started 07:05Z and will not finish before 09:30Z.
- **Rejected:** Restoring FS-02 to service at 08:00Z on the assumption
  that the read-only access was harmless — rejected because the
  persistence mechanism has not been ruled out.
- **Revisit:** 2026-04-18 08:00Z, or when the image is verified.
EOF

# Confirm the log is append-only and never edited in place.
git diff --stat decisions.md
```

The `git diff` line at the end is a genuine practice in teams that keep incident logs in a repository: it proves the log was appended to rather than rewritten, which is the same integrity idea you met with chain of custody in the previous phase of this track.

#### Recording what you did not do

The rejected-options column is what makes a decision log defensible. An incident review that examines only the choices made cannot answer the question everyone asks afterwards: "why didn't you just do X?"

| Question asked afterwards | Answerable from a log with rejected options | Answerable from a log of actions taken |
|---|---|---|
| Why didn't you isolate the host immediately? | Yes — the reason and the alternative are recorded | No |
| Why didn't you escalate to S1? | Yes — the escalation criteria and the evidence are recorded | No |
| Why didn't you tell the customer on day one? | Yes — the routing to the DPO and the reason are recorded | No |
| Why didn't you power off the machine? | Yes — with the evidence-preservation reason | No |

### Part 8 — The post-incident review as a facilitation skill

The **post-incident review** (PIR) — also called a lessons-learned meeting or, in some organisations, a post-mortem — is the meeting where the response is examined and turned into change. It is the stage that gets skipped, and skipping it is how the same incident happens twice.

Facilitating one is a distinct skill from participating in one, and it is a command skill: the person who ran the incident is usually the right person to run the review, because they know which decisions were hard.

| Element | What it contains |
|---|---|
| **The timeline** | What happened, with times and sources, agreed before the meeting |
| **The decisions** | The decision log, walked through in order |
| **What worked** | Named specifically, so it can be repeated deliberately |
| **What did not** | Named specifically, without naming a person as the cause |
| **Contributing factors** | The control gaps, not the individual actions |
| **Actions** | Each with an owner, a date, and a linked finding |
| **Follow-up** | A date when the actions are reviewed |

#### Blameless does not mean consequence-free

**Blameless** means the review examines the conditions that made an error possible rather than the person who made it. It does not mean nobody is ever accountable for anything, and it does not mean the review avoids uncomfortable conclusions.

The practical test: **an action item that names a person as the thing to be fixed is a bad action item.** "R. should have checked the retention window" fixes nothing. "The retention window for each log source will be recorded in the IR plan and reviewed quarterly" fixes something.

| Blaming | Blameless and specific |
|---|---|
| "The analyst missed the second alert" | "One person was triaging all alerts and had no backup during the first 40 minutes; the on-call rota needs a second person for S2 and above" |
| "The engineer powered off the wrong host" | "The isolation procedure has no confirmation step; we will add a two-person check for production isolation" |
| "Nobody told the DPO" | "The escalation matrix did not name a privacy threshold; the matrix now has one and it is in the plan" |

Notice that the right-hand column is not softer. It is harder, because it names a change the organisation has to make.

#### Facilitation technique

The facilitator's job is to keep the review productive, and there are four moves that do most of the work.

**Reconstruct the timeline before the meeting, and circulate it.** A review that spends its first forty minutes establishing what happened has wasted its time. The timeline goes out in advance; disagreements about it are resolved in the first ten minutes.

**Ask about decisions, not actions.** "What did you know when you made that call?" is a question people can answer honestly. "Why did you do that?" invites a defence.

**Separate the three layers explicitly, out loud.** Mechanism, root cause, and contributing factor — the distinction from the previous phase of this track — belong on a slide, and the facilitator should refuse to let a mechanism be written down as a cause. "The user clicked the link" is not a finding.

**Timebox the emotional part and protect it.** People who have been awake for eighteen hours and made a hard call need five minutes to say so. A facilitator who rushes past that gets a silent room for the rest of the meeting.

```text
PIR AGENDA — 90 minutes, hard stop

  00–05  Purpose and ground rules. Blameless, specific, no naming
         individuals as causes. Say it out loud.
  05–15  Timeline walk-through. Disagreements resolved here or
         taken offline. No new investigation.
  15–35  Decision walk-through, in order, from the decision log.
         For each: what did we know, what did we choose, what did
         we reject, would we choose it again?
  35–50  What worked. Specific, so it can be repeated on purpose.
  50–70  Contributing factors. Mechanism, root cause, contributing —
         written in three separate columns on the board.
  70–85  Actions. Each one gets an owner and a date before the
         meeting ends. No owner, no action.
  85–90  Follow-up date. Booked in the room, not by email afterwards.
```

The last line is the one that decides whether the review mattered. An action tracker with no review date is a wish list.

| Sign the PIR is working | Sign the PIR is theatre |
|---|---|
| Actions have owners who are in the room | Actions assigned to "the team" |
| The hardest decision is discussed first | The hardest decision is mentioned at minute 84 |
| Someone disagrees and is thanked for it | Everyone agrees with everything |
| A control changes within a month | The report is filed and never read |
| The next incident is smaller | The next incident is identical |

### Part 9 — Running a tabletop, and one incident from the commander's chair

#### Tabletop exercises as command practice

A **tabletop exercise** is a discussion-based rehearsal: you present a scenario, release new information at intervals, and watch the decisions the team makes. It needs no technology, and it is the single cheapest way to practise command.

For a commander, the tabletop has one specific purpose that a real incident cannot serve: **you can stop it and ask why.** You cannot pause a live incident to ask "what made you choose that containment option?" You can do that in a tabletop, and that is where the learning happens.

| Element | What it contains | Who owns it |
|---|---|---|
| **Scenario** | One plausible incident, chosen for the organisation | Facilitator |
| **Inject list** | Timed pieces of information, released as the discussion progresses | Facilitator |
| **Participants** | The people who would really be in the room, including one non-technical role | Facilitator |
| **Facilitator** | Does not participate; keeps time and probes weak answers | Not the IC |
| **Scribe** | Records decisions, disagreements, and assumptions | A participant |
| **Findings** | Where nobody knew the answer, or two people disagreed | Facilitator |
| **Actions** | Specific changes with owners and dates | The organisation |

```text
TABLETOP INJECTS — "The Payroll File", 90 minutes
Scenario: a mid-size logistics company. You are the on-call IC.

  T+00   A SIEM alert: impossible travel on the account r.delacruz.
         Two countries, forty minutes apart. Start the discussion.
         Ask: do you declare, and at what severity?

  T+10   The account has a mail-forwarding rule to an external address,
         created 23:48Z last night. Nobody created it on purpose.
         Ask: what is your declaration now? Who do you tell?

  T+20   File access logs show the account read three files from
         \\FS-02\Payroll. The files are named "2026-04 payroll
         register". Ask: what is your next decision, and who owns it?

  T+35   The DPO asks whether this is notifiable. You do not know.
         Ask: who answers this question, and what do you do right now?

  T+45   The external DFIR retainer calls and asks for a scope brief.
         Ask: who briefs them, and what do they get?

  T+60   An engineer says the second account under review is a
         shared service account used by four applications.
         Ask: does this change your severity? Why?

  T+75   It is now 07:00 and your shift ends at 08:00.
         Ask: hand over, or stay? Who decides, and how?

  T+85   Wrap. Each participant states the one thing they did not know.
```

The T+75 inject is the one that exposes the most. Almost every team will say "we would stay" and almost no team has a written rotation rule, which means the decision is being made by tired people at the worst possible time.

#### One incident, end to end, from the commander's chair

The rest of this phase is about you. This section is a single incident run all the way through, written from the commander's seat rather than the analyst's, so you can see what the job actually looks like on a clock.

**This is a composite scenario.** The company, host names, and accounts are fictional. The times are UTC. The commands and formats are real.

**The situation.** You are the on-call shift lead at Meridian Logistics, a 600-person freight company. It is 01:12 on a Tuesday. You have one analyst on shift with you, a helpdesk lead on standby, and a network engineer reachable by phone.

```text
01:12Z  The SIEM fires. Impossible travel on r.delacruz, an accounts
        payable supervisor. Manila at 22:40Z, Amsterdam at 23:20Z.

        You have the alert open. This is the moment the incident either
        has a commander or does not. You have not declared anything yet,
        and the analyst has not started work.
```

| Time (UTC) | Commander action | Who was told, and how | Record produced |
|---|---|---|---|
| 01:14 | Acknowledge the alert, open one channel, name it for the incident | Analyst, in the channel | Channel `#inc-2026-0417-01` |
| 01:16 | Ask the analyst for a five-minute triage: is it real, is it active, what else did the account touch | Analyst, on a call | Triage request, with a timebox |
| 01:22 | Triage returns. Real. Session still active. Declare **S2** and say so out loud | Analyst; SOC manager by SMS | Declaration entry, 01:22Z |
| 01:24 | Name the roles. Yourself IC. Analyst as ops lead. Helpdesk lead as scribe. Comms lead not yet stood up | All three, in the channel | Role assignment |
| 01:31 | Open the bridge. State the picture in one minute. Set the cadence: SITREP every 30 minutes, bridge every 30 minutes | All | First bridge, minuted by the scribe |
| 01:38 | Ops lead reports the mail rule. You ask the question that tests the assumption: "If they set a forwarding rule, what else would they have touched, and how do we know it did not happen to anyone else?" | Ops lead | Action: sweep all tenants for forwarding rules created in the last 72 hours, owner ops |
| 01:52 | Decision D-003: revoke sessions, reset password, do not disable the account | Ops lead executes | Decision log entry |
| 02:02 | Mail rule captured and removed. Rule definition preserved as evidence | Ops lead, scribe | Evidence item 001 |
| 02:05 | SITREP-01 written and sent | CISO, IT manager, helpdesk manager | SITREP-01 |
| 02:20 | File access confirmed: three files read from `\\FS-02\Payroll`. You escalate to **S1** and announce it with the reason | CISO by phone, then channel | Declaration entry, S1, 02:20Z |
| 02:24 | You stand up the comms lead, because an S1 has an external dimension you cannot manage yourself | Comms lead joins the bridge | Role assignment updated |
| 02:30 | Holding statement drafted but not released. Decision D-009: nothing goes out until the DPO is briefed | Comms lead, CISO | Decision log entry |
| 02:45 | Decision D-007: isolate FS-02 at the switch, not at the host, not powered off | Network engineer executes; ops lead confirms | Decision log entry with two rejected alternatives |
| 03:05 | Bridge #3. You deliberately release everyone except the four role holders for five minutes to resolve the isolation method, then announce the decision back to the full group | All | Bridge minutes |
| 03:40 | Privacy escalation note sent to the DPO. You state facts, the access window, and that you are not making a notification determination | DPO, by email and phone | Escalation note |
| 04:15 | Second-account review returns: unrelated, a shared service account with a documented scheduled task | Ops lead | Decision D-013: severity stays S1 pending the DPO's direction, because the data question is unresolved even though the spread question is closed |
| 05:00 | SITREP-04 sent. You state the two things you still cannot answer: whether data left the network, and whether a second persistence mechanism exists | CISO, IT manager, DPO | SITREP-04 |
| 05:30 | You notice the analyst has been working since 01:12 with no break. You take them off the bridge for twenty minutes and hand their work to the helpdesk lead, who has just come online | Ops lead, helpdesk lead | Rotation entry |
| 06:00 | Shift change. You write the handover pack, overlap for twenty minutes with the incoming IC, and transfer command publicly | Incoming IC, all | Handover pack; transfer announcement |
| 06:25 | You hand over and stop commanding. You do not stay on the bridge "just to watch" | — | Log entry: IC change |
| +3 days | You facilitate the post-incident review. The timeline and the decision log were both already written, so the meeting goes straight to contributing factors | All participants, DPO, IT manager | PIR report and action tracker |

Read the row at 01:38 again, because it is the one that made the incident smaller. The ops lead had found the mail rule and reported it. The commander asked what *else* the same technique would have touched. That question produced a sweep that found two more forwarding rules on two more accounts — both created by the same actor, one of them dormant. Neither was in scope when the day began. That is the commander's contribution: not the finding, but the question that turns one finding into a search pattern.

#### Where this goes wrong: the commander who joins the analysis

At 02:20, the file access is confirmed and you escalate to S1. This is the point of maximum temptation, because the incident just got serious and you are the best analyst in the building.

```text
WRONG PATH — what it looks like when the commander rejoins the work

  02:20  You escalate to S1. Then you open the file-access log yourself,
         "just to understand what we are dealing with."
  02:38  You are deep in the log. The ops lead has asked you twice
         whether to isolate FS-02. You have not answered.
  02:52  The CISO has been waiting for an update since 02:20. Nobody
         has sent one, because you were going to do it.
  03:10  You surface. FS-02 is still not isolated. Twenty-eight minutes
         have passed since the ops lead first asked.

  Cost of that 50 minutes: a production file server stayed reachable
  while the commander was being useful at a keyboard.
```

The correct behaviour at 02:20 is to make the escalation, announce it, and then ask the two questions that a commander can ask and an analyst cannot: "What is the decision waiting on me?" and "Who has not been told?"

#### The PIR for this incident, three days later

You facilitate. The timeline and decision log are already written, so the meeting goes straight to the parts that need human judgement.

| Contributing factor | Finding type | Action | Owner | Date |
|---|---|---|---|---|
| Outbound traffic from the affected segment was not logged | Root cause of the uncertainty | Add egress logging to the payroll segment | Network engineer | +30 days |
| No alert existed for mail-forwarding rules created outside business hours | Detection gap | Build the rule; alert at S3, escalate on external destination | SOC analyst | +14 days |
| The on-call rota has one analyst below S2 | Contributing factor | Second on-call analyst for S2 and above | SOC manager | +45 days |
| The escalation matrix had no privacy threshold | Contributing factor | Add a privacy trigger to the matrix, linked to the DPO contact | IC (you) | +7 days |
| The handover pack format did not exist before this incident | What worked, by accident | Adopt the format from this incident as the standard | IC (you) | +7 days |
| The commander asked the search-pattern question at 01:38 | What worked, deliberately | Add it to the bridge agenda as a standing item | IC (you) | +7 days |

Six actions, five owners, all dated. That is what a review that mattered looks like.

### Key takeaways

- **An incident commander does not work tickets.** Command is an attention job. The moment you open a terminal, you stop commanding, and nobody notices until something has been missed for forty minutes.
- **Four roles must have names attached:** incident commander, operations lead, communications lead, scribe. An unnamed role is a role nobody is doing.
- **Span of control is three to seven people.** Past that, add a layer rather than giving one person more people.
- **Declare early, and declare honestly.** An undeclared incident costs you the first hours. An inflated declaration costs you the credibility of every declaration you make afterwards.
- **S2 with a written escalation trigger beats S1 on a guess.** The trigger turns the 03:00 escalation decision into a lookup instead of a debate.
- **Severity determines authority, not just attention.** If your scale unlocks no authority, it is a label rather than a tool.
- **A bridge call that recites status has failed.** Every participant should answer two things: what I did, and the one thing blocking me.
- **The scribe writes in real time or the record is fiction.** The rejected option is the detail that vanishes within the hour.
- **Brief each audience in its own register.** Executives get impact and decisions. Legal gets data categories and times. Neither gets host names.
- **"I cannot determine that yet" is a professional answer.** An executive can act on a stated uncertainty and cannot recover from a false certainty.
- **Command authority is structural, not personal.** You are not commanding because you know more; you are commanding because the plan names a commander and the response needs one.
- **Ask for disagreement out loud, and thank the person who gives it.** A silent room of experts is how a decision gets made that ignores what they know.
- **Hand over with a document and then a conversation.** Open questions and rejected options are what a verbal handover always loses.
- **Rotate on the clock, not on how someone feels.** Fatigue degrades judgement in every field that has studied it, including this one.
- **The decision log is the commander's real artefact.** Recording what you rejected is what lets you answer "why didn't you just do X?" six months later.
- **Blameless does not mean consequence-free.** An action item that names a person as the thing to be fixed fixes nothing.
- **Book the follow-up date in the room.** An action tracker with no review date is a wish list.

### Practice this next

The ten tasks build one portfolio artefact: a complete incident run from the commander's chair, with every record a real commander produces. The order follows the phases of an incident deliberately, so the artefacts accumulate.

1. **Write your role cards first** (task 1). Four cards, one per role, with what the holder owns and what they must not do. This is the document you will reach for at 02:00, and writing it now is the whole exercise.
2. **Write the declaration announcement template** (task 2), with the escalation-trigger sentence built in. Then run it five times against five different scenarios until the phrasing is automatic.
3. **Time yourself declaring** (task 3). Take five alerts from a public challenge or your own experience, give yourself two minutes each, and write the declaration, the severity, and the trigger. Two minutes is the real constraint.
4. **Run a bridge call with real people** (task 4), even two. Use the standing agenda, keep a hard stop, and have someone time each section. The overrun is the finding.
5. **Write two SITREPs thirty minutes apart** (task 5) for the same scenario, and note what changed between them. The second one is where you learn what a cadence actually costs.
6. **Brief an executive and record yourself** (task 6). Ninety seconds, five questions, no jargon. Watch it back. Most people discover they explained the mechanism instead of the impact.
7. **Write the privacy escalation note** (task 7), three lines, routed to the right person, with a clear statement that you are not making the determination.
8. **Keep a decision log in real time** (task 8) through a tabletop or a lab incident, with a rejected alternative for every entry. Review it afterwards and find the decision you did not record.
9. **Write a handover pack and hand over** (task 9) to someone else, then watch them work for ten minutes without helping. Every question they ask is a gap in your pack.
10. **Facilitate a post-incident review** (task 10) on your own exercise, write the action tracker with owners and dates, and book the follow-up. If nobody else is available, facilitate it for a recorded incident you can read about.

Then open `portfolio/advance/03-incident-command.md` and assemble the deliverables. **The phase is done when you can take command of a live incident** — declare it, assign the roles, run the cadence, keep the decision log, hand over cleanly, and facilitate the review that turns it into change.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Jitsi Meet | Hosts the incident bridge call, no account required | Free/open-source | https://jitsi.org/ | Open a room named for your exercise incident and confirm it works from two devices | Google Meet free tier, or a phone conference bridge |
| HedgeDoc | Collaborative Markdown notes for a live incident log | Free/open-source | https://hedgedoc.org/ | Create a note for your tabletop and share the edit link with your scribe | Etherpad, or a shared document in any office suite |
| Etherpad | Real-time collaborative plain-text editor | Free/open-source | https://etherpad.org/ | Run your inject list as an Etherpad so the scribe and you both see it | HedgeDoc, or a shared text file in a chat channel |
| Excalidraw | Freehand whiteboard for incident org charts and comms plans | Free/open-source | https://excalidraw.com/ | Draw the 12-person incident org from Part 2 and mark who reports to whom | diagrams.net, or paper |
| Mermaid Live Editor | Renders diagrams and timelines from text, so they can be versioned | Free | https://mermaid.live/ | Render a timeline of the worked incident as a Gantt or sequence diagram | Graphviz, or a Markdown table |
| diagrams.net | Network and process diagrams | Free | https://www.drawio.com/ | Diagram your escalation path from alert to executive | Excalidraw, or paper |
| Grafana OnCall | On-call schedules and escalation policies | Free/open-source | https://grafana.com/oss/oncall/ | Build a two-tier escalation policy with a 15-minute acknowledgement window | A rota spreadsheet plus a phone tree |
| PagerDuty | On-call management and escalation | Freemium | https://www.pagerduty.com/ | Model an S1 escalation policy and read the resulting timeline | Grafana OnCall |
| Statuspage | Public status communication during an incident | Paid | https://www.atlassian.com/software/statuspage | Draft three status updates for the worked incident | Cachet, or a static page on GitHub Pages |
| Incident.io | Incident workflow, channels, and post-incident tooling | Paid | https://incident.io/ | Read their public post-incident template and adapt it | The templates in this phase, in a chat channel and a repository |

## Free/cheap resources

- NIST SP 800-61 Computer Security Incident Handling Guide — https://csrc.nist.gov/pubs/sp/800/61/r2/final
- FEMA IS-100.C Introduction to the Incident Command System — https://training.fema.gov/is/courseoverview.aspx?code=IS-100.c
- FEMA IS-200.C Basic Incident Command System for Initial Response — https://training.fema.gov/is/courseoverview.aspx?code=IS-200.c
- FEMA IS-700.B An Introduction to the National Incident Management System — https://training.fema.gov/is/courseoverview.aspx?code=IS-700.b
- CISA Tabletop Exercise Packages — https://www.cisa.gov/resources-tools/services/cisa-tabletop-exercise-packages
- CISA Federal Incident and Vulnerability Response Playbooks — https://www.cisa.gov/resources-tools/resources/federal-incident-and-vulnerability-response-playbooks
- PagerDuty Incident Response documentation — https://response.pagerduty.com/
- Google SRE Book — Managing Incidents — https://sre.google/sre-book/managing-incidents/
- Google SRE Workbook — Incident Response — https://sre.google/workbook/incident-response/
- Atlassian Incident Management Handbook — https://www.atlassian.com/incident-management/handbook
- FIRST CSIRT Services Framework — https://www.first.org/standards/frameworks/csirts/
- The DFIR Report — https://thedfirreport.com/

## Hands-on practice tasks

1. Write four role cards — incident commander, operations lead, communications lead, scribe — each with what the holder owns and what they must not do. <!-- id: advance-03-t01 band: focused energy: normal -->
2. Write the declaration announcement template, including the S2-with-escalation-trigger sentence and the roles block. <!-- id: advance-03-t02 band: quick energy: low -->
3. Declare five incidents in two minutes each from five different alert scenarios, writing the severity, the reason, and the escalation trigger every time. <!-- id: advance-03-t03 band: focused energy: normal -->
4. Run a timed bridge call with at least two other people using the standing agenda, and record how long each of the five sections actually took. <!-- id: advance-03-t04 band: deep energy: high -->
5. Write two SITREPs thirty minutes apart for the same scenario, and list every field that changed between them. <!-- id: advance-03-t05 band: focused energy: normal -->
6. Record a ninety-second executive briefing for a scenario of your choice, watch it back, and rewrite any sentence that explains a mechanism instead of an impact. <!-- id: advance-03-t06 band: focused energy: normal -->
7. Write a three-line privacy escalation note with the access window, the data category, and an explicit statement that you are not making the notification determination. <!-- id: advance-03-t07 band: quick energy: low -->
8. Keep a decision log in real time through a tabletop or lab incident, with a rejected alternative recorded for every entry. <!-- id: advance-03-t08 band: deep energy: high -->
9. Write a full handover pack and hand command to another person, then observe for ten minutes without helping and log every question they ask. <!-- id: advance-03-t09 band: deep energy: high -->
10. Facilitate a ninety-minute post-incident review on a real or recorded incident, producing an action tracker where every action has an owner, a date, and a booked follow-up. <!-- id: advance-03-t10 band: deep energy: high -->

## Deliverable / proof of work

Create `portfolio/advance/03-incident-command.md` with:

- Four completed role cards, one per command role
- A declaration announcement template with the escalation-trigger sentence
- Five timed declaration records with severity, reason, and trigger
- A bridge call agenda with the observed timings from your run-through
- Two SITREPs for the same incident, with a note of what changed between them
- A recorded or scripted ninety-second executive briefing and a self-review of it
- A three-line privacy escalation note
- A decision log with at least eight entries, each with a rejected alternative
- A completed handover pack, plus the list of questions the incoming commander asked
- A post-incident review pack: timeline, contributing factors, action tracker with owners and dates, and the booked follow-up

## Checklist

- [ ] I can explain why an incident commander does not work tickets. <!-- id: advance-03-command-vs-doing energy: low -->
- [ ] I wrote a role card for each of the four command roles. <!-- id: advance-03-role-cards energy: normal -->
- [ ] I can name the four roles and say what each one owns. <!-- id: advance-03-four-roles energy: low -->
- [ ] I can structure a 12-person response so nobody exceeds a span of control of seven. <!-- id: advance-03-span-of-control energy: normal -->
- [ ] I declared five incidents in two minutes each with a written severity rationale. <!-- id: advance-03-declaration-drill energy: normal -->
- [ ] I wrote an escalation trigger into a declaration instead of declaring S1 on a guess. <!-- id: advance-03-escalation-trigger energy: normal -->
- [ ] I ran a timed bridge call using the standing agenda and recorded the overruns. <!-- id: advance-03-bridge-call energy: high -->
- [ ] I set a communication cadence and kept it for at least two cycles. <!-- id: advance-03-comm-cadence energy: normal -->
- [ ] I briefed an executive in ninety seconds without using a host name or a tool name. <!-- id: advance-03-exec-briefing energy: normal -->
- [ ] I wrote a privacy escalation note that routes the determination instead of making it. <!-- id: advance-03-privacy-routing energy: low -->
- [ ] I kept a decision log in real time with a rejected alternative per entry. <!-- id: advance-03-decision-log energy: high -->
- [ ] I completed a handover pack and handed command to someone else. <!-- id: advance-03-handover-pack energy: normal -->
- [ ] I can say out loud why command authority is structural rather than personal. <!-- id: advance-03-authority-structural energy: low -->
- [ ] I facilitated a post-incident review and produced dated, owned actions. <!-- id: advance-03-pir-facilitation energy: high -->
- [ ] I wrote a tabletop inject list and recorded the gaps it exposed. <!-- id: advance-03-tabletop-injects energy: normal -->

## You're ready to move on when...

You can take command of a live incident: declare it at a defensible severity, assign roles, run the bridge call and briefing cadence, keep a decision log, hand over a shift cleanly, and facilitate the review that turns it into change.

## Free vs Paid

### What's free and enough

Every practice in this phase runs at $0. A Jitsi room is a bridge call, HedgeDoc or Etherpad is a scribe's log, and a shared document is a decision log; none of that changes the skill being built. The authoritative material is free as well: FEMA's ICS courses teach the command structure from the people who invented it, NIST SP 800-61 is the incident handling standard the industry works from, and CISA publishes complete tabletop exercise packages with scenarios and injects you can run as-is. PagerDuty's public incident response documentation and Google's SRE chapters are free and describe real on-call practice at scale. The only genuinely scarce resource is other people willing to sit through a tabletop, and that costs an hour of somebody's attention rather than money.

### What's paid and why you'd upgrade

Commercial on-call platforms such as PagerDuty and Opsgenie add scheduling, escalation automation, and an audit trail of who was paged and when. Incident management platforms such as incident.io and Rootly add automatic channel creation, role assignment, status-page updates, and post-incident workflow, which matters when a company runs dozens of incidents a month and the coordination overhead is real. Statuspage adds a hosted, reliable public communication surface. Paid training exists too, and it is expensive; the command content in commercial incident-response courses is largely the same material as FEMA's free ICS courses with a security vocabulary layered on top.

### When it's worth paying

Pay when coordination overhead has become the bottleneck rather than the incident — when a team is running enough incidents that manual channel creation and manual status updates are themselves consuming responder time. Pay when a customer contract or an audit requires a documented, timestamped escalation trail that a spreadsheet cannot credibly provide. Do not pay to learn the skill. The command decisions in a paid platform are the same decisions this phase teaches with a timer and a chat channel, and an interview assesses your judgement about declaring, escalating, and handing over rather than your familiarity with a particular console. Build the artefacts here first; if you later join an organisation that runs one of these platforms, you will learn the interface in a day because you already understand what it is for.