---
id: it-04-helpdesk-skills
track: it
phase: 4
order: 40
title: "Phase 4 — Helpdesk Skills"
duration: "3 weeks"
duration_weeks: 3
energy_mix: [low, normal]
deliverable: "portfolio/it/04-helpdesk-skills.md"
exit_criteria: "You can receive a vague complaint like “my internet is broken,” ask good questions, test likely causes, document what happened, and explain when to escalate."
---

# Phase 4 — Helpdesk Skills

## Goal of this phase

Learn the actual daily work of entry-level IT support: intake, troubleshooting, tickets, remote support, escalation, and customer communication.

## Estimated time

**3 weeks**. Start job applications after this phase even if later phases are unfinished.

## Skills you'll gain

- Use a structured troubleshooting process.
- Write professional helpdesk tickets.
- Handle common issues: password reset, MFA problem, email not syncing, printer issue, no internet, slow PC, browser issue, account locked, VPN problem.
- Understand severity, priority, SLA, escalation, and knowledge base articles.
- Communicate calmly with frustrated users.

## Specific topics to learn

### Ticket lifecycle

- New -> assigned -> in progress -> waiting on user -> escalated -> resolved -> closed
- Incident vs service request
- Priority vs severity
- SLA response time vs resolution time
- Internal notes vs user-facing comments

### Troubleshooting structure

- Confirm user identity and issue
- Ask what changed
- Reproduce if possible
- Check simple causes first
- Isolate scope: one user, one device, one network, all users?
- Apply fix or workaround
- Document exact steps
- Escalate with useful evidence

### Common helpdesk scenarios

- Password reset/account unlock
- MFA phone changed
- User cannot connect VPN
- Outlook/Gmail email issue
- Browser cache/cookies issue
- Printer offline
- Slow laptop
- Audio/video not working in Zoom/Teams
- File permission problem
- Suspicious email report

## Lesson: Helpdesk Skills

### Why this lesson exists

Here is the thing nobody tells beginners: **helpdesk is not a technical job with people attached — it is a people job with technology attached.** The technicians who get hired, promoted, and remembered are not the ones who know the most commands. They are the ones who can take a panicking user, calm the situation, find the fault, fix it, and write it down so well that the next person never has to solve it again.

That is a learnable skill set, and it is the single highest-return thing you can build at this stage of your career. Almost every IT career starts here — helpdesk, service desk, desktop support. It is the doorway to sysadmin, networking, and security, and the habits you form in it will follow you.

**How to use this lesson.** Read it once end to end to get the shape of the work. Then come back to it while you do the practice tasks below, because the lesson and the tasks are designed as a pair: the reading tells you what good looks like, and the tasks make you produce it.

Do not try to memorise the scenarios in Part 4 — you will meet them in the wild soon enough. What matters is the method in Part 2 and the communication habits in Part 3, because those transfer to every ticket you will ever touch, in every role, at every level.

**Time to complete:** 10–15 hours across the phase. Roughly half of that is writing: tickets, knowledge base articles, replies, and escalation notes. That is deliberate. Writing is the job.

### Part 1 — The ticket is the unit of work

#### What a ticket actually is

A ticket is a durable, time-stamped record of a request and everything done about it. That definition matters more than it looks, because it explains why the ticket exists at all:

- **Continuity.** If you go home at 5pm, the next technician picks up the thread without calling the user back to re-explain.
- **Accountability.** Someone can answer "what happened with this?" six months later.
- **Measurement.** Management can see volume, response times, and recurring problems.
- **Learning.** The ticket history is the organisation's memory.

This is why "I fixed it, I just didn't log it" is a failure, not a humblebrag. From the organisation's perspective, you fixed one issue and destroyed the evidence that would have prevented the next ten.

Think about the third bullet for a moment, because it is the one beginners underestimate. If the same printer fails every Monday for six weeks, six separate tickets each look like a minor printer problem.

Six tickets in the same pattern is a maintenance contract that has lapsed, or a device that needs replacing. That pattern is only visible if the tickets were written consistently enough to be grouped together. Your records are how your organisation notices its own recurring problems, and how you personally build the case for changing something rather than endlessly patching it.

There is also a self-interested reason to write good tickets: **they are your evidence.** When review time comes, the technician who can point to a year of clear, well-documented work has a much easier conversation than the one whose output is invisible. Nobody remembers the ticket you fixed quietly on a Tuesday. Everybody can read the ticket you wrote well.

#### Fields that matter, and why

Every ticketing system asks for a slightly different set of fields, but a handful appear everywhere because they do real work:

- **Summary / subject** — the one line everyone will see in every list, report, and search result. A bad summary ("It doesn't work", "Urgent!!!") makes a ticket unfindable forever. A good one names the thing and the symptom: "Outlook cannot connect to mailbox — repeated password prompt on floor 3."
- **Description** — the user's own words, quoted where possible. Quote the exact error text rather than paraphrasing it; paraphrasing loses the error code that would have identified the fault instantly.
- **Category** — how the organisation groups work. Somebody reports on these, so misfiling distorts the picture.
- **CI / asset** — which device or service this concerns. This is what lets someone later ask "how many tickets has this laptop had?" and answer it.
- **Priority** — set consistently, per the rules below.
- **Assignment** — who owns it right now. An unassigned ticket in a busy queue is a ticket nobody is working.
- **Resolution notes** — what actually fixed it, written for the next person.
- **Time spent** — often required; it feeds billing, capacity planning, and the argument for hiring another technician.

The pattern across all of them: **each field exists because someone downstream uses it.** Fill them in for that person, not to satisfy the form.

#### The ticket lifecycle

Every ticketing system, from a spreadsheet to ServiceNow, models the same states:

| State | Meaning |
|---|---|
| **New** | Created, nobody has picked it up |
| **Assigned** | Owned by a specific technician |
| **In Progress** | Actively being worked |
| **Waiting on User** | Blocked — the user must act |
| **Escalated** | Passed to a higher tier or another team |
| **Resolved** | Fix applied and confirmed |
| **Closed** | Ticket finalised, no longer active |

Two of these states are where beginners get into trouble.

**Waiting on User** is your friend and you should use it shamelessly. If you have asked the user a question and cannot proceed, the ticket belongs in this state — not "In Progress". A ticket sitting in "In Progress" that is actually blocked distorts every report your manager sees and makes you look slower than you are. Setting it accurately and saying "I've replied to the user and I'm waiting on their response" is professional.

**Resolved versus Closed** also matters. Resolving means the work is done. Closing usually happens after a cooling-off period, or when the user confirms. Jumping straight to Closed on a ticket where the user has not confirmed the fix invites the worst outcome in support: the problem comes back, and there is no ticket open to catch it.

#### Incident versus service request

These are different, and the distinction drives everything downstream:

- An **incident** is something broken: the VPN is down, the printer is dead, an account is locked. It is unplanned. It is normally measured against a **Service Level Agreement (SLA)** with a clock ticking.
- A **service request** is something wanted: a new laptop, access to a folder, a software install. It is planned, it queues, and it usually has a lead time rather than a deadline.

Why care? Because the two are prioritised differently. A service request from three weeks ago does not jump ahead of an incident that is stopping the whole finance team from working. Classifying correctly at intake is the first genuinely valuable thing you do on a ticket.

#### Severity, priority, and SLA

Beginners use these interchangeably. Do not.

- **Severity** is the impact. How bad is this for the business? Is it one person, one team, one site, or everyone? Is there a workaround?
- **Priority** is the urgency — how soon this must be dealt with. It is derived from severity, plus how many people are affected, plus any deadlines involved.
- **SLA (Service Level Agreement)** is the contractual commitment: for a P1 incident, respond within 15 minutes and resolve within 4 hours; for a P4 request, respond within 2 business days.

The practical reason this structure exists: **high severity does not always mean high priority, and vice versa.** A printer that is completely dead in a warehouse at 2am on a Sunday is high severity for that one shift and low priority for the business, because nobody is printing. A single executive's laptop with a flickering screen is low severity and high priority, because it blocks their whole day.

And note the trap: **the user's stated urgency is data, not instruction.** A user saying "this is urgent" is telling you something real about their frustration, and you should acknowledge it — but priority is set by impact, consistently, across all tickets. If you let the loudest voice set priority, you will spend your career firefighting while quiet, genuinely serious problems rot.

There is a second trap, subtler and more common: **treating the SLA clock as a target.** SLAs set the outer bound of acceptable service. If a P2 promises resolution within eight hours, that does not make it acceptable to leave a simple fix sitting for seven hours and fifty minutes. Work the queue in priority order, but take the easy wins as they come — users notice, and your averages improve.

And a third: **an SLA breach is not automatically a catastrophe.** If you are going to miss one, the professional move is to say so early, explain why, and give a realistic new expectation. Managers can defend a missed SLA that was communicated. They cannot defend one they discovered from a report.

#### Internal notes versus user-facing replies

Get this wrong and you will embarrass yourself. Every ticketing system has two channels:

- **Internal notes** are private, visible only to support staff. This is where you think out loud, record uncertainty, note that a user seems to have caused the problem themselves, and hand over context.
- **Public replies** are visible to the user and often to their manager.

The rule is simple and absolute: **anything unkind, uncertain, speculative, or candid goes in an internal note.** Before you press send, check which box you are typing in. Technicians have been fired for writing "user clearly did not read the email" in a public reply. There is no recovery from that.

A practical habit that prevents most of these accidents: **draft the candid version as an internal note first, then write the public reply separately.** Writing them in two passes stops you carrying the tone of one into the other. If you find yourself wanting to add a sigh to a public reply, that sentence belongs in the internal note.

#### Writing a ticket that someone else can actually use

Here is a weak ticket and a strong one, for the same incident.

**Weak:**

```text
Summary: slow
Notes: fixed it. user should be ok now.
```

**Strong:**

```text
Summary: Finance laptop extremely slow — disk at 100% utilisation

Description (user's words): "Everything takes ages, even opening Excel.
Started yesterday afternoon."

Impact: One user, cannot complete month-end tasks. Workaround: none yet.

Investigation:
- Task Manager: disk 100%, CPU 8%, memory 61%
- Startup apps: 14 enabled including 3 updaters
- Disk health: CrystalDiskInfo reports 3 reallocated sectors
- Windows Update had installed a large update yesterday 14:20

Action taken:
- Disabled 11 startup apps
- Ran cleanup, freed 22 GB
- Update completed and system idle after 12 minutes

Verification: Opened Excel, Outlook, and shared drive. Response normal.
User confirmed and reproduced.

Next step: Disk is showing early failure signs. Raised asset-replacement
request (ref 4471). Ticket left open 7 days to confirm stability.
```

The strong version answers every question the next person could have — who, what, how bad, what was tried, what worked, how it was verified, and what happens next — without anyone having to ask. That is the standard to aim for on every ticket you touch, even when it takes three extra minutes. The three minutes are the job.

**A word on the four fields people skip.** Summary, impact, what you tried, and verification. Those four are the ones that carry all the value. If you are ever short of time, write those four properly and leave the rest brief. A ticket with a superb summary and a sloppy category is useful. A ticket with a perfect category and the summary "issue" is worthless.

### Part 2 — A troubleshooting method you can repeat

#### The eight steps

Improvisation is what separates a struggling technician from a reliable one. Use the same structure every single time, even on trivial tickets, until it is automatic.

1. **Confirm identity and issue.** Verify who you are talking to, and get the problem in their words. Do not skip identity verification just because the ticket looks routine — password resets are a classic social engineering target. Then ask for the exact error message, not a summary of it.
2. **Ask what changed.** "Was this working yesterday?" is the most powerful single question in support. Most breakage has a recent cause: an update, a new install, a password change, a move to a different desk.
3. **Reproduce if possible.** If you can make the problem happen, you can prove when it is fixed. If you cannot reproduce it, say so and gather what you can.
4. **Check the simple causes first.** Is it plugged in? Is the Wi-Fi on? Is Caps Lock on? Is it actually a different device than they think? Beginners want to be heroic; professionals want to be fast.
5. **Isolate scope.** Is this one user, or many? One device, one network, one application, or everything? This single question often identifies the answer outright. One user affected is a device problem; everyone affected is an infrastructure problem.
6. **Apply a fix or workaround.** A permanent fix is ideal; a workaround that gets the user working now is often better than a perfect fix in two hours. Say which one you are giving them, and log it.
7. **Document the exact steps.** Not "fixed printer". Write what you checked, what you changed, and what proved it worked.
8. **Escalate with evidence, not with hope.** When you pass a ticket on, the next person should never have to repeat your work.

#### Isolating scope: the question that solves half your tickets

The scope question deserves its own attention, because it does more diagnostic work than any command.

Ask: **who and what is affected?** Then let the answer narrow the search:

- **One user, one device** → that device. Local profile, local software, local hardware.
- **One user, any device** → that account. Permissions, MFA, password, mailbox, licence.
- **Many users, one location** → the network or infrastructure at that site. Switch, Wi-Fi, uplink, power.
- **Many users, one application** → that application or its backend. Service outage, certificate, server.
- **Everyone, everything** → a core service. DNS, ISP, identity provider, a failed change.

That table is genuinely most of helpdesk diagnosis. When you find yourself unsure what to do next, you have almost certainly failed to establish scope.

#### Verify before you close

"The user said it works now" is not verification. Confirmation means you saw the thing function, or the user demonstrably performed the task that was failing. Ask them to do it while you watch, or have them share the screen. It takes thirty seconds and it prevents the re-opened ticket — which costs far more than thirty seconds, and which your metrics will record.

#### When you cannot reproduce it

Some of your tickets will be problems you never manage to see happen. This is normal, and it is not a failure. What matters is how you handle it.

- **Document what you observed**, including that you could not reproduce it. "Issue did not reproduce across three attempts; user unable to demonstrate" is a legitimate, useful finding.
- **Check whether it is already resolved.** Many transient issues fix themselves — a service restarted, a cache expired, a roaming connection returned. Ask when it last happened.
- **Leave a clear path back.** Tell the user exactly what to capture if it recurs: a screenshot of the error, the time it happened, and what they were doing. A user with instructions becomes a better witness than a user who calls back and says "it did it again".
- **Do not close it as fixed.** If you could not reproduce and could not verify, the honest status is unresolved or monitoring. Closing it invites the user to lose confidence in the whole process.

#### Remote support: doing it well

Much of your work will be done remotely, and the tool changes the human dynamic. A remote session is an intrusion into someone's screen, so conduct it deliberately.

**Before connecting:** explain what you are going to do and why. Ask them to close anything personal or confidential they do not want you to see, and tell them you will ask before taking control.

**When you take control:** narrate what you are doing. "I'm opening Event Viewer now to check for errors" keeps the user oriented; silent control feels like being driven by a stranger. Move the mouse slowly. Users find fast, confident cursor movement stressful.

**While you work:** do not open their files, read their email, or look at anything the ticket does not require. If you see something personal incidentally, say nothing about it — ever. Privacy in support is not a policy you follow, it is a habit.

**To finish:** hand control back, show them the fix working, and summarise in plain language what changed and what to do if it recurs. Practise with a willing friend or family member before you do it in a job — the technical part is easy, and the interpersonal part is what needs rehearsal.

#### When documentation becomes your leverage

There is a career argument for all of this that is worth making explicitly. The technician who writes clear tickets and maintains a knowledge base becomes the person other people go to — not because they know more, but because they are reliable. When a team lead is being chosen, they look for the person whose work can be inherited and trusted. Documentation is how you demonstrate that you think about the team rather than just the ticket in front of you.

### Part 3 — Communication is the deliverable

#### The user is not the problem

A frustrated user is not an obstacle between you and the fix. Their frustration is frequently *correct* — something that should work does not, and it is costing them time. Your job includes absorbing that and moving forward.

Three habits carry most of the weight:

**Active listening.** Let them finish. Take notes. Repeat the problem back: "So the printer shows offline, but you can print to the other one — is that right?" This catches misunderstandings before you spend twenty minutes solving the wrong problem, and it visibly demonstrates that you heard them.

**Empathy, briefly and sincerely.** One sentence is enough: "That's frustrating, let's get it sorted." Do not over-apologise — excessive apology sounds like guilt and undermines confidence in you. Do not say "calm down" under any circumstances.

**Plain language.** Users do not know what DNS is, and they should not have to. "The address book your computer uses has a stale entry — I've refreshed it" beats "I flushed your DNS cache". Explain jargon only when the user is genuinely curious.

There is a fourth habit that is easy to miss: **believe the user.** When someone says the printer worked yesterday and nothing changed, they usually mean it. When they say the problem only happens in one meeting room, that is a clue worth chasing. Users are unreliable narrators of *cause* — they will confidently tell you what broke it and be wrong — but they are excellent reporters of *symptom*.

Trust the symptom, investigate the cause yourself, and never let a user feel dismissed. "Are you sure?" is a sentence that costs you their cooperation.

#### The first sixty seconds

How a ticket starts determines how it goes. In the first minute:

1. **Greet and identify yourself.** Name, team, and what you are going to do.
2. **Get the summary in their words.** Let them talk without interruption for the first pass.
3. **Read it back.** "So when you open Outlook it asks for your password over and over — is that right?"
4. **Set the expectation.** "I'm going to look at this now; I expect to have an update for you within the hour." Then meet it.

That last step is the one people skip, and it is the one that buys you the most goodwill. An expectation you set and meet is worth more than a fix you deliver silently.

#### Handling an angry user

Anger in support almost never means the user is angry *at you*. It means something is broken, they are blocked, and they have already explained it once and been bounced around. Treat the anger as information about impact.

What works:

- **Let the venting finish.** Interrupting escalates. A few seconds of silence costs nothing.
- **Agree with the substance, not the volume.** "You're right that this should be working — it should. Let me find out why it isn't."
- **Take ownership of the next step, not the fault.** You did not write the broken software, but you can own getting it fixed. "I'll own this until it's resolved."
- **Give a concrete next action and a time.** Vague reassurance makes it worse; specifics calm it down.

What never works: matching their tone, arguing about who caused it, saying "calm down", transferring them without explanation, or promising something you cannot deliver to end the conversation faster. That last one is the most tempting and the most damaging — it trades a difficult two minutes now for an enraged user in two hours.

#### Regular updates beat perfect silence

The most common complaint about IT support is not slow resolution — it is **silence**. A user will tolerate a problem that takes two hours if they are told what is happening every thirty minutes. The same two hours with no updates feels like being ignored, and that is what they will remember and report.

So: acknowledge on receipt, update at meaningful intervals, and update when the position changes — especially if it is bad news. If you have to escalate and it will take longer, say so immediately. Bad news delivered early is far better received than bad news discovered late.

#### Writing a user-friendly reply

Replies should be scannable and actionable. A good structure:

```text
Hi Sam,

Thanks for reporting this — I can see the issue and I'm on it.

What I did:
- Checked your VPN profile and it had expired
- Reissued the certificate

What you need to do:
1. Disconnect from the VPN completely
2. Reconnect and enter your normal password
3. Try opening the shared drive

If it still fails, reply to this ticket and I'll take another look.

Thanks,
Alex
```

What makes this work: it acknowledges the report, states what you did in language the user can follow, tells them exactly what to do next as numbered steps, and gives a clear path if it fails. No jargon, no blame, no vagueness. Notice it also does not promise anything you have not done.

#### Saying no, and delivering bad news

Sometimes the answer is no: the licence is not available, the data is not recoverable, the deadline cannot be met. Handle it with the same structure:

1. **State the outcome plainly and early.** Do not bury a refusal in the third paragraph.
2. **Give the reason briefly.** One sentence. Users deserve a reason but not a lecture.
3. **Offer the alternative.** What you *can* do is always more useful than what you cannot.
4. **Point to the escalation path.** If it needs a manager's decision, name the route.

"The encrypted drive can't be recovered without the recovery key, and the key wasn't backed up. What I can do is rebuild your machine today and restore your documents from Friday's backup. If you need the files from this week, your manager can approve a data recovery service — here's the request link." That is a hard no, delivered professionally, with a path forward.

#### Escalation notes

An escalation is a handover, and a bad handover wastes the senior engineer's time — which is exactly the time you were trying to save. A good escalation note contains:

- **A one-line summary** of the problem and its scope.
- **Impact** — who is affected and how badly, with the priority and SLA position.
- **What you already tried**, with results. This is the part beginners omit and seniors need most.
- **Evidence** — exact error messages, log excerpts, screenshots, timestamps.
- **Your hypothesis**, clearly labelled as a hypothesis if it is one.
- **What you need** from the other team.

The rule of thumb: the receiving engineer should be able to act without contacting you or the user. If they have to call you to ask what you already did, your escalation was incomplete.

A worked escalation note, for a problem beyond your access:

```text
Summary: Shared drive S: inaccessible for entire Finance team (14 users)
Since 09:05 today.

Impact: 14 users blocked from month-end close. No workaround. P1 —
SLA response breached at 09:20.

What I tried:
- Confirmed scope: all 14 Finance users, across wired and Wi-Fi, both floors
- Other departments can reach their own drives normally
- `ping fileserver01` succeeds; `Test-NetConnection fileserver01 -Port 445`
  fails to connect
- No recent changes made by helpdesk; verified no GPO or permission
  change in the last 24 hours

Evidence:
- Error: "Windows cannot access \\fileserver01\finance" (0x80070035)
- Event 4625 on fileserver01 at 09:04: service account SVC-FIN reads
  "logon failure: the user has not been granted the requested logon type"
- Port 445 open from 10.0.4.x but closed from 10.0.7.x (Finance VLAN)

Hypothesis (not confirmed): a firewall or VLAN change between the
Finance subnet and fileserver01, possibly from last night's core
switch maintenance.

What I need: someone with server and network access to confirm whether
the Finance VLAN can reach fileserver01 on 445, and to review last
night's switch maintenance changes.

Not doing: not restarting fileserver01 — other departments depend on it
and this would widen the outage.
```

Read that last line again, because it is the mark of a professional escalation: **stating what you deliberately did not do, and why.** It shows judgement, and it prevents the receiving engineer from doing something hasty because they assumed nobody had considered the risk.

Notice also that the note contains a clearly-labelled hypothesis. Speculation is valuable in an escalation as long as it is honest about being speculation. Hiding a hunch wastes time; presenting a hunch as fact wastes more.

### Part 4 — The common scenarios, and what they teach

You will handle these constantly. Each one exists in this phase because it teaches a transferable pattern, not because you need the answer memorised.

#### Password reset and account unlock

The most common ticket in the industry. **Access control first:** verify the user's identity before you change anything. A password reset handed to the wrong person is a breach, and attackers know this ticket exists.

Then investigate the cause. One lockout is normal — someone mistyped. Repeated lockouts mean a device somewhere is still trying the old password: a phone with stale mail settings, a mapped drive, a scheduled task, a service account. If you just unlock every time, you will unlock forever. Find the source.

#### MFA problems, especially a changed phone

Multi-factor authentication is the security control that actually works, and it fails in predictable ways: new phone, lost phone, wiped device, no signal, wrong time on the device. Verify identity rigorously — MFA resets are a favourite target for attackers, and "I got a new phone" is the standard pretext. Once verified, re-enrol the factor and advise on backup codes.

#### Email not syncing

Always the same first question: **is it this device or the account?** Ask the user to open webmail. If webmail works, the account and server are fine and the problem is the local client — a corrupted profile, a stale credential, a full mailbox, a broken cached copy. If webmail also fails, the problem is the account or the service, and you are looking at a much bigger ticket.

#### Printer offline

A running joke, and a legitimate teaching case. Work from the bottom up: powered on? on the network? reachable by ping? the right printer driver? the correct default printer? Is the user even printing to the one they think they are? Printers teach the value of checking the physical and network layers before touching the software.

#### No internet

Covered in depth in Phase 3, and it belongs here too because it is the ticket where scope discipline pays off. One user → the device. The whole office → the network. Check DNS with the `8.8.8.8` versus `google.com` test before you do anything else.

#### Slow laptop

Measure before you fix. Is it slow always, or since a specific change? Check CPU, memory, and disk in Task Manager. High disk on an old spinning drive, or 95% memory, tells you the story instantly. Common real causes: too many startup apps, a failing disk, insufficient RAM, malware, a full system drive, or an update running in the background.

#### Browser cache and cookies

A safe, fast fix for a huge family of problems: stale sessions, broken layouts, login loops, missing content. Clearing cache and cookies is a legitimate troubleshooting step, not a fob-off — but tell the user what it will cost them (saved logins, site preferences) so they can decide.

#### Suspicious email

Treat a report seriously and act carefully. **Never click links or open attachments in a suspected phishing message**, even to "check". Collect the evidence from the report rather than the message where possible, follow your organisation's process, and if there is a security team, they own it from there. If the user already clicked, that is not a scolding moment — it is a containment moment, and speed matters more than blame.

#### File permissions

Usually a permissions or group membership issue rather than a file problem. Identify what the user is trying to reach and which group grants access, then fix the membership rather than the file — changing file permissions directly is how access control quietly degrades over time.

### Part 5 — What good looks like

#### Knowledge base articles are how you multiply yourself

A knowledge base (KB) article is a documented solution to a recurring problem, written so anyone can follow it — including a colleague, a future you, or the user themselves.

The economics are simple and worth stating plainly. If a problem takes you fifteen minutes and it happens twice a month, that is six hours a year. Write it up once, in an hour, and every future occurrence takes five minutes. Over a year that is roughly five hours returned for one hour invested — and the article keeps paying indefinitely. That is why senior technicians are ruthless about writing articles for anything they fix a second time.

A good KB article has:

- **A title phrased as the problem**, in the words a user or colleague would search for: "Outlook repeatedly prompts for password after password change".
- **Symptoms** — what the user sees, so they can confirm it is the right article.
- **Applies to** — which systems, versions, and user groups.
- **The fix**, as numbered steps with exact paths and commands.
- **Verification** — how to confirm it worked.
- **Escalation** — what to do if the steps fail.
- **Metadata** — author, date, and a review date.

The frequently missed ingredient is the last one. **An out-of-date article is worse than no article**, because it wastes time and erodes trust in the whole knowledge base. Every article should carry a review date, and articles should be revisited when the underlying system changes.

#### Self-service and deflecting tickets

Many organisations push users toward self-service portals and KB articles, and some technicians resent it. Do not. A user who solves their own printer problem in three minutes had a better experience than one waiting forty minutes on a ticket queue, and it frees your time for the genuinely difficult problems that a KB article cannot touch.

Writing for a non-technical reader is the skill. Use short sentences, numbered steps, and screenshots where you can. Avoid "simply" and "just" — they make people feel stupid when the step does not work. Test your article on someone who does not know the answer before you publish it; you will discover the step you forgot to write down.

#### Habits that compound

Several small practices separate technicians who get promoted from those who plateau:

- **Write tickets for the next person, not for yourself.** Assume the reader is you in six months with no memory.
- **Never fix the same thing twice without writing it down.** The second time is a knowledge base article waiting to happen.
- **Update your knowledge base as you work.** Ten minutes now saves an hour a week forever.
- **Use the tools the organisation provides.** Ad-hoc fixes and personal scripts create problems when you are on holiday.
- **Protect the user's data and privacy.** Look only at what the ticket requires you to look at.
- **Close the loop.** Tell the user what you found and how to avoid it recurring.

#### What this phase prepares you for

Everything in this phase is portable. The ticket discipline maps directly to incident response in security work. The scope questions and structured method are the same mental tools a network engineer uses. The escalation writing is the same skill as a good incident report. And the communication habits are what make you employable in the first place — a hiring manager will forgive an imperfect answer far more readily than they will forgive someone who cannot explain themselves clearly.

#### Common pitfalls, and how to avoid them

- **Fixing without logging.** The single most damaging helpdesk habit. An unlogged fix helps one person once; a logged fix helps everyone forever.
- **Writing vague summaries.** "Issue" and "not working" make tickets unsearchable. Name the thing and the symptom.
- **Working in the wrong box.** Candid thoughts belong in internal notes. Check before you send.
- **Skipping identity verification on password and MFA tickets.** These are exactly the tickets attackers use. Verify every time.
- **Setting priority from volume, not impact.** The loudest user is not necessarily the most urgent problem.
- **Forgetting to set Waiting on User.** A blocked ticket left "In Progress" distorts every report and makes you look slow.
- **Closing without verification.** "Should be fine now" is not a fix. Watch it work.
- **Escalating without evidence.** If the next engineer has to redo your investigation, you have moved the work rather than shared it.
- **Leaving the user in silence.** The complaint is almost never the wait; it is the not-knowing.
- **Unlocking the same account repeatedly.** A recurring lockout has a cause. Find it instead of resetting forever.
- **Clicking a link to "check" a phishing report.** Never. Collect evidence without engaging.
- **Letting knowledge base articles go stale.** An out-of-date article is worse than none.

### Part 6 — Identity verification, done properly

Part 2 said "verify identity and issue" as step one, and Part 5 listed failing to do so as a pitfall. This part explains *why*, because a rule you do not understand is a rule you will abandon the first time it is inconvenient.

#### Why password resets are the attack, not the chore

To an attacker, the service desk is not an obstacle. It is the **front door**, and it is usually the softest one on the building.

Consider what a password reset actually accomplishes for someone who should not have it. It grants access to an account, and therefore to email, and therefore to everything that trusts email — password reset links for every other system, shared documents, the ability to email colleagues *as* the real user asking for money or credentials. Security teams call this **social engineering**, and the service desk is its favourite target because the desk exists specifically to help people who cannot get in.

The attack has a predictable shape:

1. The attacker gathers a little information. A name from LinkedIn, a manager's name from a press release, a project name from a job posting, the company's email format.
2. They call at a busy time — Monday morning, end of quarter, a Friday afternoon before a holiday — when the queue is long and the agent is moving fast.
3. They sound like an employee in a hurry. They are slightly irritated. They have a meeting. They may already know the answer to a soft question and offer it unprompted, to build rapport.
4. They ask for exactly one thing: a password reset, an MFA reset, or an account unlock.

The whole attack depends on the agent taking a shortcut. Not on technical sophistication.

#### What actually counts as verification

A **knowledge-based question** — mother's maiden name, date of birth, employee ID — is weak on its own, because much of it is publicly discoverable or obtainable from a previous breach. This is why organisations moved to **MFA reset** procedures being treated as the highest-risk request of all: resetting someone's second factor hands over the account completely.

What genuine verification looks like, roughly in order of strength:

| Method | Strength | Why |
|---|---|---|
| Manager confirmation via a known directory number | Strong | Requires the attacker to also compromise the manager |
| Video call with an ID check | Strong | Hard to fake, and expensive to attempt at scale |
| Callback to the number on record, which you look up yourself | Strong | Defeats caller-ID spoofing — you initiate the call |
| A one-time code to a registered device or address | Moderate | Good, unless that channel is what is broken |
| Security questions, employee ID, date of birth | Weak alone | Often public or already breached |
| "I know their name and department" | None | Not verification; this is small talk |

The single highest-value habit: **you initiate the contact, from a number you looked up yourself.** Never from a number the caller gives you, because a confident caller can supply a number that rings back to them.

#### The conversation, when something feels off

The hard part is that verification is a social act, and you must do it without accusing anyone. A useful pattern:

> *"I can absolutely help with that. Before I reset anything, I need to verify your identity — it is the same process for everyone including me, so please do not read anything into it. I am going to call you back on the number we have on file for you. What is your employee ID so I can look up the right record?"*

That response does four things: it accepts the request, it normalises the check, it explains what happens next, and it extracts a detail to verify against. A genuine user cooperates. An attacker usually becomes vague, changes the subject, invents urgency, or asks for an exception:

> *"I am on my mobile, I cannot take a call — can you just do it this once? My manager is in a meeting, she approved it already."*

That sentence is the attack. "Approved already", "just this once", "cannot take a call" — each is a request to skip the process rather than to follow it.

**You do not have to win the argument.** You are not trying to catch anyone. You are trying to complete a request safely, and the answer when verification is not possible is not "no" — it is "not yet, and here is how we get there":

> *"I understand the timing is difficult. I cannot reset credentials without verification — that protects your account, not just the company's. Here is what I can do: I will note the ticket and escalate it, and someone from the team will call you back on your registered number within the hour."*

Then **log it honestly**. A ticket that reads "caller unable to verify identity; declined reset pending verification; escalated" is a good ticket. It may be the single most valuable thing you produce that week, because repeated attempts like this are a signal the security team needs to see.

#### The compromised-account warning signs

You are often the first person in the organisation to notice an account is under attack, because you are the one looking at it. Worth escalating rather than just resetting:

- The same account is locked out **repeatedly**, especially across days. Someone is guessing, or a device is retrying old credentials.
- A user reports MFA prompts they did not initiate. Someone has the password and is trying to satisfy the second factor.
- A reset request arrives shortly after the user's details appeared somewhere public, or after a colleague's account was accessed.
- A user reports mail-rule changes, forwarding, or sent items they do not recognise. That is post-compromise behaviour.
- The request comes from a caller who cannot answer questions about their own manager or team.

**Recognising that something needs escalating rather than resolving is Phase 1-and-4 knowledge. Investigating the compromise is later-phase security work** — do not attempt the investigation, escalate it with the evidence you have.

### Part 7 — Three worked tickets with the evidence

Parts 1 to 5 taught the method. These three tickets show it applied, with the actual evidence and the written note. Read them for the **reasoning**, not the fixes.

#### Ticket 1 — "My email is not working"

**What the user said (ticket description):**

> "My email is not working. I have not been able to send anything all morning. Can you fix it, I have an important client email going out today."

**Step 1 — Confirm identity and issue.**

The ticket is vague, and the scope of "not working" is enormous: cannot log in, can log in but cannot send, mail sits in Outbox, mail bounces, Outlook will not open, mail arrives in the wrong folder. You ask for the exact error:

> "Before I look, can you tell me exactly what you see when you try to send? Not what you think is wrong — the exact wording on screen, and whether it is Outlook or webmail."

The user reads out: *"Your message could not be delivered. The message is still in your Outbox."*

That single sentence eliminates most of the possibilities. The account is authenticated — they are logged in. Outlook is functioning. The problem is transmission, not access.

**Step 2 — Ask what changed.**

> "Was this working yesterday?"

*"Yes, fine. It started this morning."*

The user then volunteers something useful unprompted: *"Actually, my password expired last week and I changed it on Wednesday."*

**Step 3 — Isolate scope.**

> "Is anyone else in your team having trouble sending today?"

*"No, I asked and everyone else is fine."*

One user, one device. Not a mail server outage. You have narrowed from "email is broken" to "one user cannot transmit mail, following a password change."

**Step 4 — The evidence.**

You connect with permission and look at the Outbox and the send/receive log:

```text
Task 'user@company.com - Sending' reported error (0x8004010F):
'The operation failed. An object cannot be found.'
```

That error code reports a **profile problem**, not a network or server problem. Combined with the recent password change, the likely cause is that the stored credential in the Outlook profile is stale — the Windows credential cache still holds the old password, so the send fails even though the account itself is fine.

**Step 5 — The fix, one change at a time.**

You clear the stale credential from the Windows Credential Manager, then restart Outlook so it re-prompts for the current password. You do not reinstall Office. You do not rebuild the mail profile — which is the nuclear option and would take an hour of the user's time and lose their local settings.

**Step 6 — Verify.**

> "Could you send a test email to yourself now, and tell me when it arrives in your inbox?"

Not "does it work?" — an actual send, with a visible result. It arrives. You then ask them to send the real client email, because that is the thing that actually matters, and you would rather it fail now than after you have closed the ticket.

**Final ticket note.**

> **Reported:** User unable to send mail since that morning; Outlook showed "Your message could not be delivered. The message is still in your Outbox."
> **Changed recently:** On questioning, the user's domain password was changed the previous week on expiry.
> **Observed:** Send/receive reported `0x8004010F — The operation failed. An object cannot be found`, a profile-level error rather than a connectivity error. No service-wide impact: other users in the same team sending normally, ruling out a mail server or transport issue. Windows Credential Manager held a credential entry for the mail account dated before the password change.
> **Action:** Removed the stale cached credential for the mail account and restarted Outlook, which re-prompted for the current password. No profile rebuild and no Office repair were attempted.
> **Verified:** User sent a test message to themselves and confirmed receipt, then sent the client email that had prompted the ticket and confirmed it delivered.
> **Cause:** Stale cached credential in the Windows credential store following a password change. The account was healthy throughout.
> **For the next agent:** This user's mail profile has now failed once after a password change. If it recurs, check the credential store first rather than rebuilding the profile. Other users on the same mail platform are unaffected, so do not raise this as a service issue.

**Reasoning to take away:** The user's summary ("email is not working") was almost useless, and one question for the exact wording turned it into a specific, diagnosable fault. "Was this working yesterday?" and "who else is affected?" cost nothing and removed the two largest branches — a widespread outage and a broken account — before you looked at anything.

#### Ticket 2 — "I got a strange email, I think I clicked it"

**What the user said:**

> "I got an email that looked like it was from HR about a salary review, and I clicked the link. Then it asked me to log in and I typed my password. Now I am worried. Was that a mistake?"

**This ticket is different, and the difference matters.**

Everything up to this point has been about restoring service. This one is about **containment**. The user has likely just handed their credentials to an attacker, and every minute changes the risk. There is a specific order of operations, and getting it wrong makes things worse.

**What you do NOT do.**

- **Do not click the link yourself to "check".** You are on a corporate machine; you would be the second victim, and you may trigger a payload.
- **Do not tell the user to delete the email.** It is evidence.
- **Do not tell them to change their password and leave it at that.** If the attacker is already in the mailbox, a password change alone may not evict them, and it destroys the trail.
- **Do not keep it off the record** because the user is embarrassed. Embarrassed users hide incidents, and hidden incidents become breaches.

**What you do, in order.**

1. **Reassure, and mean it.** *"Thank you for telling me — that is exactly the right thing to do, and it is much better that you called. Let us deal with it now."* The single biggest predictor of whether an incident is contained quickly is whether users report it without fear. You are not there to judge; you are there to contain.
2. **Gather the facts without touching anything.** Which email account? What was the exact subject and sender address? What time did they click? Did they enter credentials, and only credentials — or did anything download or install? Did anything happen after?
3. **Escalate immediately, by whatever your organisation's process is.** A suspected credential compromise is a security incident, not a helpdesk ticket to solve alone. **This is the boundary: recognising and escalating is Phase 4; investigating is later-phase security work.**
4. **Contain what you can, with authorisation.** Depending on your organisation's procedure: force a password reset and revoke active sessions, reset MFA, check for and remove mail-forwarding rules the attacker may have added, and review recent sign-ins for unfamiliar locations. Do these *with* your security team's process, not around it.
5. **Preserve the evidence.** The original message, its headers, the URL, and the time of the click. Do not forward the original to anyone who might click it — share the details, not the live link.

**Final ticket note.**

> **Reported:** User reports clicking a link in an email impersonating HR regarding a salary review, and entering their credentials on the resulting page. User self-reported, concerned.
> **Timeline:** Email received and link clicked at approximately 09:20; credentials entered; user contacted the service desk at 09:47.
> **Observed:** Original message retained for analysis and NOT deleted. Sender address recorded (external domain resembling the company domain). Per user, no file was downloaded and no software was installed; credentials were entered on a web page.
> **Action:** Escalated immediately to the security team as a suspected credential compromise per procedure. Under their direction: forced a password reset, revoked active sessions, reset MFA, and reviewed mail rules and recent sign-in activity for unfamiliar locations. User informed of next steps.
> **Verified:** Security team confirmed no unfamiliar mail-forwarding rules present and no anomalous sign-ins after session revocation. User able to log in with the new credential and MFA re-enrolled.
> **Cause:** Successful phishing of user credentials via a spoofed internal email.
> **For the next agent:** Incident closed from the service desk side; security team holds the investigation. Do not delete the original message. If the user reports further suspicious mail or unexpected MFA prompts, treat as a new incident and escalate immediately.

**Reasoning to take away:** Not every ticket is a repair. When the report involves credentials, a link, or possible data exposure, the goal shifts from restoring service to containing harm — and the correct first action is to escalate, not to investigate. The most valuable thing you did here was thank the user, because a culture where people report quickly is the single best defence an organisation has.

#### Ticket 3 — "I need access to a folder I should already have"

**What the user said:**

> "I started on the new project team this week and I still cannot get into the project folder. My manager says I should have access. Can you add me?"

**What you ask.**

An access request looks trivial and is one of the highest-risk tickets you will handle, because it is the legitimate-looking version of a privilege escalation. Three questions:

1. "Who approved this access, and are they aware of what the folder contains?"
2. "Are you in the group that grants it, or do you need to be added?"
3. "Has anyone else on the project team had trouble getting in?"

**Check before you grant.**

The instinct is to add the user to the group. The correct move is to find out whether that is actually the problem:

```powershell
# What does the account actually hold?
Get-ADPrincipalGroupMembership jdelacruz | Select-Object Name

# What does the folder require?
(Get-Acl "\\fileserver\Projects\Atlas").Access |
  Select-Object IdentityReference, FileSystemRights, AccessControlType
```

Suppose the output shows the user **is** already in `Project-Atlas-RW`, and the folder grants that group Modify. The account is correct. Adding them again changes nothing — and it is a real risk that the agent does it anyway, closes the ticket, and the user still cannot get in.

You then find the actual cause: the user's session began before the group membership was applied, so the machine is holding a stale token. This is the same class of problem as the empty-shared-folder ticket in Phase 2, and it presents identically.

**The security discipline.**

Access tickets are where good helpdesk habits prevent real breaches. Three rules:

- **Verify the approver, not just the requester.** "My manager says I should have it" is a claim. If your process requires a recorded approval, get the approval — not a verbal relay.
- **Check whether access already exists before adding it.** A surprising share of "I need access" tickets are actually "access exists but is not taking effect". Adding permissions that already exist leaves the real fault in place while appearing to have done something.
- **Never widen access to solve a convenience problem.** If the fix for a permissions issue appears to be granting a broader group, you have probably misdiagnosed it. The correct fix is usually to add the person to the right narrow group.

**Final ticket note.**

> **Reported:** New project team member unable to access `\\fileserver\Projects\Atlas`; manager reportedly approved access.
> **Changed recently:** User joined the project team earlier in the week.
> **Observed:** `Get-ADPrincipalGroupMembership` showed the account already holds `Project-Atlas-RW`. Folder ACL grants that group Modify, so permissions were correct on both sides. `whoami /groups` on the user's machine did not list the group — a stale session token, because the membership was applied after the user signed in.
> **Action:** No permissions were changed — the requested access already existed. Had the user sign out fully and sign back in to obtain a fresh token, then re-test access.
> **Verified:** User opened the project folder and successfully created and saved a test document, confirming both read and write access rather than read alone.
> **Cause:** Stale cached group membership from a session that predates the membership change. Not a permissions fault.
> **For the next agent:** A recurring pattern in this organisation after any group change. If a user reports newly granted access not working, check `whoami /groups` on their machine before touching any ACL. Do not add duplicate group memberships.

**Reasoning to take away:** A request to grant access should trigger a check of the *current* state before any change. In this ticket, doing what was asked would have changed nothing, closed the ticket, and left the user still blocked — while silently adding redundant permissions. The same discipline protects you when the request is malicious: if you always verify approver and current state, an attacker's request fails at the same gate an honest user's succeeds through.

### Part 10 — Run the checks yourself, on your own machine

Parts 1 to 7 taught you what to do. This part makes you do it. Every command below is **read-only and safe on a laptop you own**, and each one is followed by what healthy output looks like.

If you have the Ubuntu VM from Phase 2, the Linux half works there. If you do not, install one first — or read the Linux rows and come back to them. No command here needs a second machine, an account, or a peso.

#### The rule for all of these

Run one command, read the output, and write one sentence describing what you see. The sentence is the exercise.

Running commands without interpreting them teaches you nothing, and it is the habit that separates a person who has watched a tutorial from a person who can work a ticket.

#### The command table

| # | Platform | Command | What it answers |
|---|---|---|---|
| 1 | Windows | `systeminfo` | OS build, RAM, uptime, install date |
| 2 | Windows | `ipconfig /all` | IP, mask, gateway, DNS, DHCP, MAC |
| 3 | Windows | `ping <gateway>` then `ping 8.8.8.8` then `ping google.com` | The DNS split test |
| 4 | Windows | `nslookup google.com` and `nslookup google.com 8.8.8.8` | Is my own resolver working? |
| 5 | Windows | `net use` | Mapped drives and their state |
| 6 | Windows | `route print -4` | The default route, and any VPN route |
| 7 | Windows | `whoami` then `whoami /groups` | My exact identity and group list |
| 8 | Windows | `Get-Volume` | Free space per drive |
| 9 | PowerShell | `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10` | The ten most recent errors |
| 10 | PowerShell | `Get-Service` filtered on Automatic and Stopped | A fault nobody has reported |
| 11 | Linux | `df -h` | Filesystem usage in human units |
| 12 | Linux | `lsblk` | Disks and partitions, as a tree |
| 13 | Linux | `journalctl -p err -b --no-pager` | Errors since this boot |
| 14 | Linux | `ss -tulpn` | What is listening, and on which port |
| 15 | Linux | `ip a` and `ip route` | Addresses and the default gateway |

Run each command now, before reading the sections that follow. Then compare your real output against the healthy examples below.

#### Commands 1 to 4 — the network set

```powershell
systeminfo | Select-String "OS Name","OS Version","System Type","Total Physical Memory"
ipconfig /all
ping 192.168.1.1
ping 8.8.8.8
ping google.com
nslookup google.com
nslookup google.com 8.8.8.8
```

Healthy `ipconfig /all` output, trimmed to the lines that matter:

```text
Wireless LAN adapter Wi-Fi:

   Physical Address. . . . . . . . . : A4-5E-60-1C-22-0B
   DHCP Enabled. . . . . . . . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 192.168.1.22(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
   DHCP Server . . . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 192.168.1.1
```

Five things are healthy here, and you should be able to name all five. A real IPv4 address that is not `169.254.x.x`. A subnet mask that contains the address. A default gateway inside the same subnet. A DHCP server that answered. And a DNS server that is not `127.0.0.1` unless something on your machine really is running a resolver.

**What is not healthy:** `169.254.x.x` means DHCP failed. No gateway means nothing off your own subnet is reachable. A gateway outside your own subnet is unreachable by definition, and is arithmetic rather than a fault.

Now the split test. Replace `192.168.1.1` with whatever your own `Default Gateway` line says:

```text
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64        <- the LAN is healthy
Reply from 8.8.8.8: bytes=32 time=24ms TTL=115          <- routing and internet work
Reply from 142.250.4.101: bytes=32 time=25ms TTL=115    <- the name resolved
```

The third line is the one to read carefully. **If the reply shows an IP address rather than `google.com`, name resolution worked** — `ping` prints the name only when the forward lookup succeeded. That is the whole test, and it costs three seconds.

If `8.8.8.8` answers and `google.com` fails, you have DNS failure and nothing else. Confirm it with a comparison of two servers:

```text
nslookup google.com              -> Server failed  (your configured resolver)
nslookup google.com 8.8.8.8      -> 142.250.4.101  (a working resolver)
```

That pair is the single most useful comparison in entry-level support. Practise it until you can explain what each result means without notes.

#### Commands 5 to 8 — identity, drives, and mapped shares

```powershell
net use
route print -4
whoami
whoami /groups
Get-Volume | Where-Object DriveLetter |
  Select-Object DriveLetter, FileSystemLabel,
  @{N='FreePct';E={[math]::Round(100*$_.SizeRemaining/$_.Size,1)}}
```

`net use` on a personal laptop usually prints `There are no entries in the list.` That is a **clean result, not a failure** — it means no drive letters are mapped to network shares, which is normal at home and unusual on a corporate machine.

`route print -4` should show exactly one row beginning `0.0.0.0`. That row is your default gateway. **Two or more default routes is the fingerprint of a VPN client**, and it explains "my internet broke when I connected the VPN" better than any other single observation.

`whoami /groups` is the command that would have saved the technician in Part 7's third ticket an hour. It lists every group your session token actually holds right now — which is not the same as the groups your account is a member of. A group added after you signed in does not appear until you sign out and back in.

```text
GROUP INFORMATION
-----------------
BUILTIN\Administrators    Alias    S-1-5-32-544  Enabled by default, Enabled group, Group owner
BUILTIN\Users             Alias    S-1-5-32-545  Mandatory group, Enabled by default, Enabled group
```

Reading it: the `Mandatory group` flag means the group cannot be removed from your token, and an entry marked **`Group used for deny only`** means it is present but grants nothing. That distinction is the difference between "you are an administrator" and "you could become one".

For `Get-Volume`, healthy is above about 15 % free. Below 10 % on the system drive, Windows slows down measurably: updates fail, the page file stops growing, and temp files cannot be written.

#### Commands 9 and 10 — the log and the service

```powershell
Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 10 |
  Select-Object TimeCreated, LevelDisplayName, ProviderName, Id
```

```text
TimeCreated          LevelDisplayName ProviderName             Id
-----------          ---------------- ------------             --
2/14/2025 9:41:02 AM Error            Service Control Manager  7000
```

**Every healthy machine has errors in its log.** Ten errors is not a fault; it is a Tuesday. The question is never "are there errors" but "is this one repeating, and is it recent".

```powershell
Get-Service | Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped' } |
  Select-Object Name, DisplayName, StartType
```

A **short or empty list is the healthy result.** Each entry is a service the machine was told to run automatically and is not running. Look up what each one does before touching anything, and ask whether it is history or a live fault.

#### Commands 11 to 15 — the same questions on Linux

| Windows command | Linux equivalent | The question |
|---|---|---|
| `Get-Volume` | `df -h` | How full is each filesystem? |
| Disk Management | `lsblk` | What disks and partitions exist? |
| Event Viewer | `journalctl -p err -b` | What has gone wrong since boot? |
| `netstat -ano` | `ss -tulpn` | What is listening on which port? |
| `ipconfig /all` | `ip a` plus `ip route` | What is my address and my gateway? |

```bash
df -h
lsblk
journalctl -p err -b --no-pager | tail -30
ss -tulpn
ip -brief address
ip route
```

Reading `lsblk` as a tree:

```text
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sda      8:0    0   25G  0 disk
└─sda3   8:3    0 24.5G  0 part /
```

Read it by indentation. `sda` is a physical disk; `sda3` is a partition on it; the `└─` prefix is the tree drawing, and `/` in the `MOUNTPOINTS` column is the filesystem you are actually using.

Reading `ss -tulpn`:

```text
Netid State  Local Address:Port  Process
udp   UNCONN 127.0.0.53%lo:53      users:(("systemd-resolve",pid=712,fd=13))
tcp   LISTEN 0.0.0.0:22            users:(("sshd",pid=844,fd=3))
```

The columns are protocol, state, local address and port, then the process. `127.0.0.53%lo:53` is Ubuntu's local DNS stub listening only on loopback — normal. `0.0.0.0:22` is SSH listening on **every** interface, which is normal on a server and worth questioning on a laptop. This is exactly the check that proved the networking ticket in Phase 3: nothing listening on port 53 while the adapter was pointed at `127.0.0.1`.

#### Answer key — write your sentence first, then read

Cover this table, run the five commands above on your own machine, write one sentence for each, then uncover and compare.

| Check | A good sentence | What a weak answer looks like |
|---|---|---|
| `ipconfig /all` | "Wi-Fi has 192.168.1.22/24 with gateway 192.168.1.1 and DNS 192.168.1.1 — a complete, consistent configuration." | "It shows my IP address." |
| `ping 8.8.8.8` then `google.com` | "Both answered and the name resolved to 142.250.4.101, so connectivity and DNS are both healthy." | "The internet works." |
| `whoami /groups` | "My token holds Users and Administrators; no deny-only entries, so I am a full local administrator." | "It lists my groups." |
| `Get-Service` filter | "Empty list — no service set to Automatic is stopped, so there is no silent background fault on this machine." | "No services found." |
| `journalctl -p err -b` | "Four errors since boot, all from the same unit repeating — that repetition is the signal, not the count." | "There are some errors." |

The difference in every row is the same: the strong version states a **conclusion with its evidence**, and the weak version restates the output. That difference is the entire skill you are being hired for.

#### Exercise 10A — Build your own healthy baseline

Do this while your machine is working, not after it breaks. It takes about twenty minutes and it becomes a permanent reference.

1. Run commands 1, 2, 5, 6, 7, 8, and 9 from the table, in that order.
2. Paste each result into a file under a heading naming the command.
3. Under each paste, write **two sentences**: what the output shows, and what would look different if it were broken.
4. Save it as `portfolio/it/04-healthy-baseline.md`.

**Model entry, so you know what "good" looks like:**

> **`route print -4` — default route**
> Exactly one `0.0.0.0` row, gateway `192.168.1.1`, interface `192.168.1.22`. This says all traffic that is not local leaves through the home router.
> If it were broken I would expect either no `0.0.0.0` row at all (nothing leaves the subnet) or two of them (a VPN has taken over the default route, which is the classic "VPN connected and now nothing loads").

The second sentence is the part that matters. Anyone can paste output; describing the failure you would recognise beside it is diagnostic skill, and it is what a hiring manager hears when you explain this file in an interview.

### Part 11 — Six tickets, worked and answered

Part 7 gave you three full tickets to read. This part gives you six shorter ones to **work**, each with a weak reply, a strong reply, and the reasoning that separates them.

**How to use them.** Cover everything below the user's words. Write your triage questions, your first three checks, and your reply. Then uncover and compare. An exercise you cannot check yourself is not an exercise, so every ticket here has a model answer.

#### The triage sequence you run on every ticket

This is the ordered procedure from Part 2, written as something you actually execute rather than something you agree with. Run it in this order every time, even when the answer feels obvious.

| Window | Action | Why it is in this position |
|---|---|---|
| 0–30 seconds | Verify identity, then read the ticket twice | Everything after this depends on knowing who you are helping |
| 30–60 seconds | Ask for the exact error text and the last time it worked | One sentence usually eliminates half the possible causes |
| Minute 1–2 | Ask who else and what else is affected | Scope splits the search before you spend effort |
| Minute 2–4 | Compare against something that works | A working reference turns a guess into a measurement |
| Minute 4–5 | Make one change, then retest | Two changes at once means you never learn which one fixed it |
| Minute 5+ | Either set an update time, or escalate with what you have | Silence and hope are both failures |

**Escalate immediately, without the first five minutes, when:** credentials may be compromised, data may be lost or exposed, the fault crosses a team boundary you cannot cross, or a fix would require a change you are not authorised to make.

**Do not escalate merely because the ticket is hard.** Five minutes of evidence gathering turns a bad escalation into one the receiving engineer can act on.

#### Ticket 4 — "My laptop takes ten minutes to become usable"

> "Every morning I turn it on and it just sits there. Fans loud, spinning circle, and I can't do anything for ten minutes. It's fine after that. IT gave me this laptop in March."

**Your questions.** Is the ten minutes every boot or only the first one of the day? Does it happen on battery as well as on mains? Has anything new been installed recently?

**What you check, and where.**

| Step | Command or path | What you are looking for |
|---|---|---|
| 1 | Task Manager, Startup tab | How many apps launch at sign-in |
| 2 | Task Manager, Performance tab | Disk at 100 % with CPU low |
| 3 | `Get-Service` filter from Part 10 | A service retrying and failing at boot |
| 4 | `Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2}` | Repeated errors with boot-time timestamps |
| 5 | `Get-Volume` | System drive below 10 % free |

Disk at 100 % with CPU near 8 % is the signature of a slow or failing drive, not of a slow processor. A drive below 10 % free produces the same symptom through a different route.

**Weak reply:**

> Hi. Your laptop is slow because of too many startup apps. Please disable them in Task Manager. Let me know if it is better.

Why it fails: it names a cause it did not verify, gives no steps a non-technical user can follow, sets no expectation, and asks for a vague judgement — "is it better" — rather than a measurement.

**Strong reply:**

> Hi Maria,
>
> Thanks for the detail — ten minutes every morning, then fine, is a recognisable pattern and I can work with it.
>
> Here is what I found: your laptop has 14 programs set to start automatically at sign-in, and your C: drive has 4 % free. Both of those slow the boot, and the low disk space also explains why it feels sluggish for a while afterwards.
>
> What I have done: removed three unused programs from the startup list and cleared 11 GB of temporary files.
>
> What I need you to do: restart the machine now, and time it with your phone — from pressing the power button to the desktop being usable. Reply with the number in minutes. If it is still over about three minutes, I will look at the drive's health next, because that is the other common cause and I would rather check it than replace the laptop on a guess.
>
> I will check back with you tomorrow morning either way.
>
> Thanks,
> Alex

**Why the strong one works.** It confirms the pattern rather than restating it. It names two findings with evidence. It gives one measurable instruction — "reply with the number in minutes" — instead of asking for a feeling. It pre-announces the next step if the fix fails, which stops the user worrying. And it commits to a follow-up time.

The weak reply took thirty seconds and will generate a second ticket. The strong one took four minutes and will not.

#### Ticket 5 — "I'm locked out and I have a meeting in ten minutes"

> "I typed my password wrong a few times and now it says my account is locked. I have a client call in ten minutes. Please unlock it."

**Your questions.** Is this the first time today, or has it happened more than once this week? Have you changed your password recently? Are you signed in anywhere else — a phone, a tablet, a second laptop?

**Why the third question is the important one.** A single lockout is a typo. A **repeating** lockout has a cause: a device somewhere still using the old password. A phone with stale mail settings, a mapped drive, a scheduled task, a saved credential in a browser. If you unlock without asking, you will unlock again tomorrow.

The lockout threshold also matters, and it is usually lower than people assume — commonly five failed attempts within thirty minutes. That is why "I only typed it wrong twice" and a locked account can both be true.

**What you check.**

```powershell
# Is the account locked, and when did it last work?
net user mdelacruz /domain

# What is failing, and from where? (needs rights you may not have)
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4740} -MaxEvents 5 |
  Select-Object TimeCreated, Message
```

Event **4740** is "a user account was locked out", and it names the **caller computer** — the machine that is still sending the bad password. That single field is the whole diagnosis when it is available. If you cannot read the Security log, that is itself the escalation: the receiving engineer needs exactly this event.

**Weak reply:**

> Unlocked. Try again.

Three words, no verification, no cause, and it guarantees the same ticket tomorrow. It also skips identity verification on the one ticket type attackers use most.

**Strong reply:**

> Hi Juan,
>
> I have unlocked your account — you should be able to sign in now.
>
> One thing I need to ask, because it will decide whether this happens again: has your password changed in the last few weeks, and do you have email set up on your phone or a tablet?
>
> The reason I ask is that this is the second lockout on your account this week. A device still holding your old password will keep retrying it in the background, and each retry counts as a failed attempt — so the lockout comes back even when you type everything correctly. If that is what is happening, unlocking is only a temporary fix.
>
> If you do have mail on a phone, the fastest test is to open the mail app and see whether it asks for your password. Reply here and I will walk you through it.
>
> Your meeting should be fine now — sign in and let me know if it does not work in the next five minutes and I will call you.
>
> Thanks,
> Alex

**Why the strong one works.** It solves the emergency first, in the first line, which is the right order for a user with ten minutes. It then asks a diagnostic question the user can actually answer. It explains *why* the question matters in plain language — background retries counting as failed attempts — which turns the user into a partner instead of a suspect. And it offers a fast path if the fix did not work.

Note what it does **not** do: it does not reset the password. An unlock is reversible and low-risk; a password reset on an unverified caller is the attack described in Part 6. If identity cannot be verified, the answer is "not yet, and here is how we get there".

#### Ticket 6 — "The printer works for him but not for me"

> "The shared printer in the office works fine for everyone else but my laptop always says it is offline. I have reinstalled it twice."

**Your questions.** Does the printer print a test page from its own panel? Do you see the printer in the list, or is it missing entirely? Did you ever print from this laptop successfully, or has it never worked? Is there another printer on your machine that does work?

**Why "reinstalled twice" is a clue.** Reinstalling a driver is the most common wasted hour in support. If the others can print, the driver is almost never the fault — the fault is in the path between this machine and the device, and the path is address, name, queue, or permissions.

**What you check, bottom to top.**

| Layer | Check | Toolkit |
|---|---|---|
| Power and network | Is the printer awake and on the network? | The printer's own panel |
| Reachability | Can you ping it from the failing laptop? | `ping <printer-ip>` |
| Port | Is the print port answering? | `Test-NetConnection <printer-ip> -Port 9100` |
| Queue | Is a job stuck on the local spooler? | Settings, Printers, see the queue |
| Driver and port | Is the port pointing at the right address? | Printer properties, Ports tab |
| Permissions | Can this user print to this queue? | Who else uses it successfully? |

**Compare against a working machine — that is the whole method.** On a laptop that can print, open **Printer properties → Ports** and read the address. If it says `192.168.1.50` and the failing laptop's port says `192.168.1.51`, you have found it without touching a driver. A printer that changed address after a power cut produces exactly this ticket.

**Weak reply:**

> Please uninstall the printer and add it again, then restart.

The user has already done this twice. Telling them to do it a third time tells them you did not read the ticket, and it is how a support desk loses a user's confidence.

**Strong reply:**

> Hi Sam,
>
> Thanks — and I noticed you have already reinstalled it twice, so I will not ask you to do that again. Reinstalling rarely helps when everyone else can print, because it means the printer itself is fine.
>
> I have looked at your laptop's printer settings and the port is pointing at 192.168.1.51. The printer is actually at 192.168.1.50, and the address changed when the printer was power-cycled last week. Your laptop is sending jobs to an address where nothing is listening, which is why it reports offline.
>
> I have changed your port to the correct address and sent a test page — could you check the printer tray and tell me whether it came out?
>
> This will happen again to anyone whose printer was set up by address. I am asking our network team to reserve a fixed address for that printer so it stops moving, and I have noted it on this ticket.
>
> Thanks,
> Alex

**Why the strong one works.** It acknowledges what the user already tried, which is worth more goodwill than the fix itself. It explains the cause in one sentence of plain language — "sending jobs to an address where nothing is listening". It gives one concrete check. And it goes one step beyond the ticket, to the change that stops the repeat.

#### Ticket 7 — "The VPN keeps dropping"

> "The VPN disconnects every twenty minutes or so. I reconnect and it works for a while, then drops again. I use it all day from home."

**Your questions.** Is there a pattern — every twenty minutes, or only during large transfers? Does it drop on Wi-Fi and on a cable? Does anyone else on the team have the same problem? What are you doing when it drops?

**A regular interval is a specification, not bad luck.** "Every twenty minutes" is the shape of an idle timeout, a re-keying interval, or a session limit, and each of those points somewhere specific. "Only on large transfers" points at an MTU problem instead. Ask the shape question before you touch anything.

**What you check, in order.**

1. Does the underlying internet connection drop at the same time? Watch a continuous `ping` to your gateway while working. If that drops too, the VPN was a symptom and your Wi-Fi is the fault.
2. Are there two default routes? `route print -4` shows this — a VPN adds one, and two can fight.
3. Is the DNS server still reachable during the drop? Split tunnelling changes which resolver is used.
4. Does the drop correlate with a time or a size?

```powershell
# Continuous reachability while you reproduce the drop
ping -t 192.168.1.1      # press Ctrl+C to stop — your gateway, must not drop
ping -t 8.8.8.8          # is the internet itself the problem?
route print -4           # one 0.0.0.0 row, or two?
```

If your gateway is stable and `8.8.8.8` drops, the fault is upstream of your laptop. If both are stable and only the VPN drops, the fault is the VPN client, its configuration, or the server side.

**Weak reply:**

> Have you tried restarting your router?

If the router were at fault, the user's whole internet would drop, not one encrypted tunnel. Restarting your own equipment is the client-side equivalent of reinstalling the driver: plausible-looking work that changes nothing.

**Strong reply:**

> Hi Ana,
>
> A drop every twenty minutes is a very useful detail — that regular timing usually means a session or idle timeout rather than a network fault, so I would like to test that rather than guess.
>
> Two things, both quick:
>
> 1. Next time it drops, do not reconnect straight away. Look at whether your normal internet still works — open any website. Reply and tell me which happened: everything stopped, or only the VPN stopped.
> 2. Separately, disconnect the VPN and leave it off for an hour. If your internet is stable for that hour, we have ruled out your home connection.
>
> With that, I can tell whether this is your line, your VPN client, or the VPN server. If it is the client or the server, that is not something you can fix from your laptop and I will pass it to the team that owns it — with your timings, which is exactly what they need.
>
> Thanks for the precise detail on the timing; it saves us both a lot of guessing.
>
> Alex

**Why the strong one works.** It treats the timing as evidence and says so. It gives the user two small, unambiguous tests — one for the next drop, one that can run in the background. It pre-announces the escalation honestly, including why the user's timings are the valuable part. And it refuses to pretend the fix is on the user's side when it probably is not.

#### Ticket 8 — "My S: drive disappeared"

> "My S: drive is gone. It was there yesterday. I have a deadline tomorrow and everything is on it."

**Your questions, in this order.** Does the file server open if you type its name? Does the error say *denied* or does it say *cannot find*? Did anyone else lose it, or just you? Did anything change yesterday — a password change, a Windows update, a different network?

**Why those two errors are different tickets.** "Access is denied" means the share exists and you are not being let in — permissions, group membership, or a stale session token. "Windows cannot find" means the path itself is not resolving — network, DNS, or a renamed server. The message you were given tells you which hunt you are on, and the user's summary ("it's gone") tells you neither.

**What you check.**

```powershell
net use
whoami /groups
Test-NetConnection fileserver01 -Port 445
nslookup fileserver01
```

`net use` lists mapped drives and their state, including a `Disconnected` or `Unavailable` marker that tells you whether Windows still believes the mapping exists. `whoami /groups` answers the permissions question without needing the server, because a group added after sign-in will not be in your token — the exact cause in Part 7's third ticket.

**Weak reply:**

> I have remapped your drive. Try now.

It may even work. But nothing was learned, nothing was recorded, and if the cause was a stale token the user will be back on Monday with the same ticket.

**Strong reply:**

> Hi Paolo,
>
> Good news first: nothing is lost. The S: drive is a shortcut to a folder on our file server, and the folder is intact — I can see your files in it from here. What broke is your laptop's connection to it, not the files.
>
> Here is what I found: your account is in the right group, so this is not a permissions problem. Your laptop's session was started before your group membership was updated this week, so it has been carrying an old copy of your permissions all day — that is why the drive vanished with no warning and no error message you could act on.
>
> What you need to do: save anything open, then choose **Start → your name → Sign out** — sign out, not restart, because a restart can keep the old session. Sign back in and open File Explorer. S: should be there with your files in it.
>
> If it is not back within five minutes of signing in, reply straight away and I will remap it manually. Either way, your deadline tomorrow is safe.
>
> Thanks,
> Alex

**Why the strong one works.** It leads with the reassurance the user actually needs, and it is specific about *why* nothing is lost. It states the diagnosis in plain language without using the words "token" or "group policy". It distinguishes **sign out** from **restart** and says why — a restart can preserve the session, which is the difference between the fix working and the user calling back. And it keeps a fallback open.

#### Ticket 9 — "I got an email saying my password expires today"

> "I got an email saying my password expires today and I need to click a link to keep the same password. Is that real?"

**Your questions.** What is the sender's full email address, not the display name? Did you click anything? Have you entered your password anywhere as a result?

The user did the right thing by asking. Your first job is to make sure they know that, because a user who feels stupid for asking does not ask next time — and next time they click.

Whatever the answer, do not open the link, do not forward the live message, and do not delete it. Treat it as evidence. If the user already clicked and entered credentials, this stops being a helpdesk ticket and becomes the containment sequence in Part 7's second ticket.

**Weak reply:**

> That is a phishing email. Delete it and don't click links.

Technically correct, practically useless. You have not established whether the user already clicked, you have destroyed the evidence, and you have answered a security report with a telling-off.

**Strong reply:**

> Hi Grace,
>
> Thank you for checking before clicking — that is exactly the right instinct and it is genuinely what keeps us safe.
>
> Yes, that message is not from us. We never email a link asking you to keep your existing password, and we would never ask you to confirm a password by email at all.
>
> Three things, and the first is the important one:
>
> 1. Please do not delete it yet — I need it as evidence. Leave it in your inbox.
> 2. Did you click the link, or type your password anywhere after reading it? Either answer is fine and neither gets you in trouble — I only need to know so I can check your account properly.
> 3. If you did click, tell me and I will take it from there immediately.
>
> I have reported it to our security team either way.
>
> Thanks,
> Alex

**Why the strong one works.** It thanks the user first, and means it. It names the specific tell in plain language — "we never email a link asking you to keep your existing password". It preserves the evidence instead of destroying it. It asks the containment question without any hint of blame, and it says so explicitly. And it tells the user what happens next.

### Part 12 — Escalation writing practice

Part 3 gave you the escalation template and one worked example. This part makes you write one, and shows you the two ways people get it wrong.

#### What the receiving engineer actually needs

An escalation is not a request for help. It is a **handover**, and the receiving engineer is deciding one thing: can I act on this without redoing the work?

| What they need | Why | What beginners send instead |
|---|---|---|
| Scope: who and what is affected | Decides priority and how many people to wake up | "User cannot work" |
| Timeline: when it started, when it changed | Points straight at a change window | Nothing |
| Exact error text and codes | Searchable, and often names the cause | A paraphrase |
| What you already tried, with results | Stops duplicate work — the most valuable section | Omitted |
| What you ruled out | Narrows the search as much as what you found | Omitted |
| The evidence, in copyable form | They will paste it into their own tools | A screenshot of a phone photo |
| What you need from them, specifically | Turns a mystery into an assignment | "Please look into this" |
| What you deliberately did not do | Prevents a hasty action that widens the outage | Omitted |

#### The template

```text
Summary:        one line — the thing, the symptom, and the scope
Since:          the time it started, and the last time it worked
Impact:         who is affected, how badly, workaround if any, priority, SLA
                position

What I confirmed:
- scope, established how (who did you ask, what did you compare)
- the exact error text, verbatim, with codes
- the evidence, as copyable output rather than a description

What I tried, and what happened:
- each attempt, with its result — including the ones that did nothing

What I ruled out:
- the causes you eliminated, and the evidence that eliminated them

Hypothesis (not confirmed): best guess, clearly labelled as a guess

What I need from you: the specific action, on the specific system

Not doing, and why: the risky step you avoided
```

#### Worked example A — escalated too early, with too little

```text
Subject: Problem with shared drive

Hi team,

Can you please look at the shared drive, it is not working for
one of our users. I have tried a few things but no luck. Let me
know when it is fixed.

Thanks
```

**What is wrong with it, line by line:**

- **No scope.** One user or fourteen? Nobody can set a priority from this.
- **No scope of *what*.** Which drive? Which server? Which path?
- **No error.** "Not working" could be permissions, network, or a typo in a path.
- **No timeline.** When did it start? Did it ever work?
- **"I have tried a few things"** tells the engineer nothing and guarantees they will repeat all of them.
- **No evidence.** Nothing to search, nothing to compare.
- **No ask.** "Let me know when it is fixed" is not a handover, it is a delegation with no information.
- **No priority or SLA position.** The receiving team cannot tell whether this is due now or next week.

The cost is real: the engineer starts from zero, contacts the user, repeats the first-line investigation, and the outage lasts longer for exactly the person who was already blocked.

#### Worked example B — the same ticket, escalated correctly

```text
Summary: S: (\\fileserver01\finance) inaccessible for one user since 08:40
         today; other Finance users unaffected

Since:   Last successful access 17:30 yesterday. Fails from 08:40 today.

Impact:  One user (Paolo Reyes) cannot reach Finance month-end files.
         Workaround: none confirmed yet — files are Finance-only.
         Priority P3 by impact (single user, no workaround).
         SLA: response due 12:40, currently within SLA.

What I confirmed:
- Scope: 4 other Finance users on the same floor access S: normally
  as of 09:10. So this is one user, not the share.
- Error text, verbatim: "Windows cannot access \\fileserver01\finance"
  (0x80070035, "The network path was not found"). Not an access-denied
  error — the path is not resolving, not being refused.
- From the affected laptop:
    Test-NetConnection fileserver01 -Port 445  -> TcpTestSucceeded: True
    nslookup fileserver01                      -> 10.20.30.15
    net use                                    -> S:  Unavailable
- From a working nearby laptop: same lookup, same port result, S: Available.

What I tried, and what happened:
- `net use S: /delete` then remap to the same path -> remap succeeds,
  but opening S: fails with the same 0x80070035.
- Signed the user out and back in (fresh session token) -> no change.
  I checked this specifically because a group change was made for this
  user yesterday, but `whoami /groups` shows the group present both
  before and after signing in, so a stale token is ruled out.

What I ruled out:
- Share outage: 4 other users working normally.
- Server unreachable: TCP 445 answers from the affected laptop.
- Name resolution: nslookup returns the expected address.
- The user's own permissions: identical group membership to a working
  colleague in Finance.
- The user's credentials: no lockouts, no recent password change.

Hypothesis (not confirmed): a per-user Windows credential for the
fileserver has been stored incorrectly — the error is raised before
authentication, but a cached credential can produce a path-level
failure like this. I cannot see the Credential Manager entry contents
from my access level.

What I need from you: please check on fileserver01 whether this
account has a duplicate or stale session, and confirm whether the
share's access-based enumeration setting is per-user. If you need it,
the user is available on extension 214 until 17:00.

Not doing, and why: I have not restarted the Workstation service on
the user's laptop or removed their cached credentials, because that
would clear saved credentials for other shares they use daily and I
cannot restore them. I have also not touched the share's permissions
— no permissions change is indicated by the evidence.
```

**Why this one is acted on within minutes.** A reader knows exactly how big the problem is, how long it has been happening, what has been eliminated and how, and what single action is being asked of them. They can start work without opening a chat window.

Notice the **"Not doing, and why"** section again. It is what stops a receiving engineer from taking a step — restarting a service, clearing credentials — that would fix nothing and cost the user something else.

#### Exercise 12A — Write one, then grade it against the table

Pick a fault **you have actually experienced** on your own machine, and write the escalation as if you could not fix it. Then score your draft: one point for each row of the table at the top of this part that your note satisfies.

Nothing in this exercise involves anyone else's system. You are writing about your own laptop, and the escalation is a portfolio artefact rather than a real handover.

| Score | What it means |
|---|---|
| 0–3 | The note is a request for help, not a handover. Rewrite it. |
| 4–5 | Usable, but the engineer will still have questions. Add what you tried and what you ruled out. |
| 6–7 | A professional handover. This is the standard to hold yourself to. |
| 8 | You have included the hypothesis and the "not doing" line. This reads like a senior engineer's note. |

**Common self-scoring mistake:** counting "I restarted it and it did not work" as *what I tried*. It only counts if you say what the restart was meant to prove and what its result ruled out.

#### Ticket blackjack

A short drill you can run in five minutes without an instructor or a second machine.

Write down one realistic ticket number, then draw that many keyword cards from the six below. You must handle the ticket using exactly those constraints — the constraints force you to communicate instead of just fixing.

| # | Keyword card |
|---|---|
| 1 | **Wait** — you must ask the user for something before you can proceed |
| 2 | **Escalate** — the fault is outside your access |
| 3 | **No repro** — you cannot make the fault happen |
| 4 | **Angry** — the user is already frustrated |
| 5 | **Workaround** — you must restore work before you find the cause |
| 6 | **Document** — the ticket must be usable by someone else tomorrow |

**Model answer for card 1 on Ticket 5** (a lockout, and you must wait): you unlock the account, then ask whether the user has mail on a phone, and set the ticket to **Waiting on User** with a note that the cause is unresolved until that answer arrives. The card did not change the fix; it changed the status, the note, and the reply.

**Model answer for card 3 on Ticket 6** (a printer, and you cannot reproduce): you say so explicitly in the ticket, ask the user to capture a photo of the error and the exact time next time it happens, leave the ticket open in monitoring rather than closing it as fixed, and give them a workaround — print from the neighbouring machine.

Working through the cards is worth more than reading another ten pages, because each card is a real constraint you will meet on a live queue.

#### Exercise 12B — Repair the bad escalation

Take worked example A above. Without reading example B, rewrite it as a complete escalation. You will have to invent the details — that is deliberate, because choosing *which* details matter is the skill.

Then compare your version against example B and answer three questions in writing:

1. Which details did you invent that example B did not need?
2. Which details did example B have that you did not think to include?
3. Which single addition to your version would have helped the receiving engineer most?

Question 3 is the one worth keeping. **The gap between your answer and the model is your specific next thing to practise**, and it is different for everyone.

### Part 13 — What would you do next? Drill and answer key

Twelve situations. For each, decide **one** next action and write down why you chose it over the alternatives.

**Do not read the answer key first.** Write all twelve answers, with a reason each, and only then compare. The reason matters more than the action — on a real queue there is often more than one defensible next step, and what is being assessed is whether you can justify yours.

#### The twelve situations

For each, your choices are: **resolve it now**, **gather one more piece of evidence**, **set Waiting on User**, or **escalate now**.

1. A user reports the shared drive is empty. Their password was changed an hour ago.
2. A user says "the internet is down". Your `ping` to their gateway succeeds.
3. A user reports an MFA prompt they did not trigger, at 2am, on a Sunday.
4. A user says their laptop is slow, and reports "it was fine yesterday".
5. A printer shows offline for one user; the printer prints its own test page.
6. A user reports a suspicious email. They have not opened it.
7. A user's account has locked out four times this week.
8. A user says a website is blocked. Their colleague on the same floor can reach it.
9. A user cannot hear anything in a video call. The call connects normally.
10. A user says their laptop will not turn on. They are on their way to a meeting.
11. A user asks for access to a folder their manager says they should have.
12. A user says the VPN dropped three times in an hour, always mid-transfer.

#### Answer key

| # | Next action | The reasoning you should have reached |
|---|---|---|
| 1 | Gather one more piece — ask whether the error is *denied* or *empty* | Denied means permissions; empty after a password change usually means a stale session token. The two answers lead to different fixes, so ask before changing anything |
| 2 | Gather more — `ping 8.8.8.8`, then `ping google.com` | A working gateway rules out the LAN. The IP-versus-name pair splits connectivity from DNS in one step |
| 3 | **Escalate now** | An unrequested MFA prompt means someone has the password and is trying the second factor. That is a suspected compromise, not a helpdesk fault |
| 4 | Gather more — ask what changed, then measure CPU, memory, and disk | "Slow" is a symptom, not a measurement. Two readings beat one, and the change question is the cheapest test available |
| 5 | Resolve it — check the port address against a machine that can print | One user plus a working self-test means the printer is healthy. The fault is in that machine's path, and the port address is the usual suspect |
| 6 | Escalate per policy, or resolve with guidance — but never open it | Nothing is compromised yet, so there is no containment emergency. Preserve the message, follow the reporting process, and never click to check |
| 7 | Escalate or investigate the source — do not simply unlock again | A repeating lockout has a cause. Event 4740 names the machine still sending the old password |
| 8 | Gather more — compare the two machines' DNS and proxy settings | One user and one site is a device or profile problem. Comparing a working machine against a failing one is the fastest route to the difference |
| 9 | Resolve it — check the default output device, then the app's own audio settings | Video works, so the network is fine. Audio device selection is the cause in most of these, and it takes thirty seconds |
| 10 | Set an expectation, then gather — triage the power and the charger first | A meeting deadline does not change the diagnosis. Give a realistic update time, then work the hardware checks in order |
| 11 | Gather more — check whether the access already exists before granting | Many of these are "granted but not taking effect". Verify the approver as well as the requester, per Part 7's third ticket |
| 12 | Gather more — watch for two default routes, and ask whether the whole connection drops | Drops mid-transfer point at MTU or a network change rather than the VPN client. The route table and the user's own observation separate them |

#### Scoring yourself honestly

| Score | What it means |
|---|---|
| 10–12 correct | You are thinking in the right order and would not be a liability on a first-line queue |
| 7–9 | Solid instincts, with a few places where you acted before you had the evidence |
| 4–6 | Reread Part 2's eight steps, then retake this. Do not worry yet — this is the normal first score |
| 0–3 | Read Part 11 again, working each ticket on paper, then retake. The vocabulary is there; the order is not yet |

**The most common miss is 3**, and it is the one that matters most. Beginners file it as "an MFA annoyance" and reset the factor, which is precisely what the attacker wanted.

**The second most common miss is 10.** Beginners jump to hardware diagnosis while the user is waiting, and end up with a frustrated user and no useful finding. Setting an expectation costs one sentence and buys the time you need.

#### Exercise 13A — Write the two replies

Choose any two situations from the twelve that you answered **escalate now**. For each, write the user-facing reply *and* the internal note, in that order.

The lesson being tested is that the two are not the same text. The reply tells the user what is happening and what they should do; the internal note records what you actually suspect, which the user may never see.

```text
User-facing reply:
Hi <name>,

[acknowledge the report]
[what you are doing about it, in plain language]
[what you need from them, as numbered steps if any]
[when they will hear from you next]

Thanks,
<your name>

Internal note (not visible to the user):
Scope established: ...
Evidence: ...
Suspected cause: ...
Escalated to: ...
Next action and owner: ...
```

**Model reply for situation 3** (an unexpected MFA prompt), because it is the hardest one to write without alarming the user:

> Hi Ravi,
>
> Thank you for telling me — reporting an MFA prompt you did not trigger is exactly the right thing to do, and it is genuinely helpful.
>
> What it means: someone has your password and tried to use it, but they could not get past the second factor. Your account is not open to them, and nothing has been changed.
>
> What I am doing: I have passed this to our security team as a priority, and we will reset your password and your MFA registration together this morning. Please do not change your password yourself yet — we want to do it in a way that also signs out anyone already connected.
>
> What I need from you now: if you get another prompt, tap **Deny**, and reply here with the time it happened.
>
> I will call you within thirty minutes to walk through the reset.
>
> Thanks,
> Alex

**Why this reply works.** It thanks before it alarms. It explains the actual risk accurately without either hiding it or overstating it. It tells the user what *not* to do, and why, which prevents them from undoing your containment. And it commits to a specific time.

The internal note for the same ticket is a different document entirely — it says what you suspect, what you have ruled out, and who owns it now. Write that one as if the security team will read it before they speak to anyone.

#### Practice scenarios that need only one laptop

Every exercise in this part works with a single machine. Two of them are worth doing deliberately, because they reproduce a failure you will otherwise only read about.

| Scenario | What you do | What you should observe |
|---|---|---|
| Break your own DNS | Set your adapter's DNS to `127.0.0.1`, then `ipconfig /flushdns` | `ping 8.8.8.8` still works, `ping google.com` fails. Put it back to automatic afterwards |
| Break your own Wi-Fi | Disable the adapter, then try each Part 10 command | Every network check fails at the first step — link down means nothing else can pass |
| Fill a folder path | Create a folder with a very long name and map it, then rename the folder | The mapping reports unavailable. This is Ticket 8 with the serial numbers filed off |
| Fill the system drive | Do not do this to test it — instead read `Get-Volume` and predict what would break below 5 % free | A prediction you can check beats a disk you have to repair |
| One laptop plus one phone | Use the phone's hotspot for the laptop, then disable the hotspot | The laptop's whole network fails at once. Comparing that to a single-command failure teaches the scope idea physically |

**Do these on your own machine only, and put every setting back afterwards.** Changing an adapter's DNS on a work laptop, or on a machine you do not own, is not an exercise — it is an incident. The rule is simple: you may only test systems you own or have written authorisation for, and at this stage that means your own laptop and your own VM.

The value of breaking things on purpose is that you see the failure signature while you are calm. A technician who has deliberately broken DNS once recognises it in four seconds on a real ticket, and spends the next four minutes fixing it instead of reading documentation.

### Key takeaways

- A ticket is a **record**, not a receipt. Write so the next person never has to re-investigate.
- **Incidents are broken things; service requests are wanted things.** Classify at intake.
- **Severity is impact, priority is urgency, SLA is the clock.** Users' stated urgency is data, not instruction.
- Use **Waiting on User** honestly and never confuse **Resolved** with **Closed**.
- **Internal notes are private; public replies are permanent.** Check the box.
- Follow the **eight-step method** and always **isolate scope** — one user versus everyone solves most tickets.
- **Verify the fix** before closing; do not take "it works now" on faith.
- **Silence is the real complaint.** Regular updates make slow resolutions acceptable.
- **Escalate with evidence and what you already tried**, not with hope.
- **Verify identity before every access change.** Password and MFA resets are attack targets, and the service desk is the front door, not an obstacle.
- **You initiate the verification contact**, from a number you looked up yourself — never one the caller supplies.
- **Not every ticket is a repair.** When credentials, links, or possible data exposure are involved, the goal becomes containment and the first action is escalation.
- **Check the current state before changing anything.** Many "I need access" tickets are "access exists but has not taken effect", and granting again fixes nothing.
- **Thank people who report their own mistakes.** A culture where users report phishing quickly is the strongest control an organisation has.

### Part 14 — Practice this next

The exercises below are the phase. Build the tracker, write the ten tickets, produce the knowledge base articles, practise remote support with a family member, write the user-friendly replies, and write the escalation notes. Keep every artefact — they become portfolio evidence and, later, interview stories.

Parts 10 to 13 are the doing half of this lesson, and they are meant to be worked in order. Part 10 has you run the checks on your own machine and build a healthy baseline. Part 11 walks six tickets end to end, each with a weak reply and a strong one. Part 12 is escalation writing. Part 13 is a drill with an answer key so you can mark your own work.

**Time to complete:** 12–18 hours if you do all four parts properly, which is more than the reading takes and is the point. Write your answers down before you look at any model answer, because a model answer read first teaches you nothing except that the text exists.

Every exercise from here on has an answer, a model response, or a scoring table. Nothing in this lesson asks you to guess whether you got it right.

One last piece of advice before you start. When you write those ten sample tickets, write them about real problems you have actually seen — a laptop that would not connect, a printer that vanished from the network, an account locked out twice in a week. Invented tickets read like invented tickets, and a hiring manager can tell.

Real ones carry the detail that only comes from having been there: the exact error, the thing you tried that did not work, the moment the cause became obvious. That authenticity is what will make your portfolio convincing, and it is what will make these skills stick.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| osTicket | Open-source ticketing system | Free | https://osticket.com/ | Create 10 sample tickets | Google Sheets ticket tracker |
| Spiceworks Cloud Help Desk | Simple helpdesk/ticketing | Free/freemium | https://www.spiceworks.com/free-help-desk-software/ | Build sample ticket queue | osTicket |
| RustDesk | Remote desktop support | Free/open-source | https://rustdesk.com/ | Remote into your own second device/VM if available | Chrome Remote Desktop |
| Chrome Remote Desktop | Remote access | Free | https://remotedesktop.google.com/ | Practice connecting to your own device | RustDesk |
| Microsoft Teams | Work communication | Freemium | https://www.microsoft.com/microsoft-teams/ | Write a professional support reply | Google Meet/Chat |
| Google Workspace Admin Help | Admin reference | Free docs | https://support.google.com/a/ | Study user reset and groups docs | Microsoft Learn |

## Free/cheap resources

- Google IT Support syllabus/topics — https://www.coursera.org/professional-certificates/google-it-support
- Microsoft support docs — https://support.microsoft.com/
- Atlassian incident management guide — https://www.atlassian.com/incident-management
- Spiceworks IT articles — https://community.spiceworks.com/
- HubSpot customer service communication tips — https://blog.hubspot.com/service/customer-service-skills

## Hands-on practice tasks

1. Set up a ticketing system. Install or explore the **osTicket** demo, or if that is too complex, build a **Google Sheets ticket tracker** with columns for ticket ID, summary, user, device, impact, status, resolution, and next steps. <!-- id: it-04-t01 band: focused energy: normal -->
2. Write 10 sample tickets using a consistent structure: summary, user, device, impact, troubleshooting steps, resolution, and next step. <!-- id: it-04-t02 band: deep energy: normal -->
3. Write 2 knowledge base articles: one on troubleshooting a no-internet connection (physical checks, IP configuration, DNS), and one on clearing browser cache and cookies in Chrome, Firefox, and Edge. <!-- id: it-04-t03 band: focused energy: normal -->
4. Practise remote support. Use **RustDesk** or **Chrome Remote Desktop** to connect to a family member's device or a second VM, and fix a simple issue such as display settings or a cache problem. <!-- id: it-04-t04 band: focused energy: normal -->
5. Write 5 user-friendly replies to common helpdesk issues — email not syncing, VPN not connecting, printer offline, forgotten password, and a slow laptop. Each reply must be clear, polite, and contain actionable steps. <!-- id: it-04-t05 band: focused energy: normal -->
6. Write 3 escalation notes, each including a detailed description, the troubleshooting already performed, supporting evidence such as error messages or logs, and the reason for escalation. Score each draft against the eight rows of the Part 12 handover table, and rewrite any that scores below six. <!-- id: it-04-t06 band: focused energy: high -->
7. Run every command in the Part 10 command table on your own machine, and write down what each result tells you. Add the output to `portfolio/it/04-healthy-baseline.md` with one sentence describing what would look different if it were broken. <!-- id: it-04-t07 band: focused energy: normal -->
8. Work Part 11's six tickets on paper before reading the model replies. Write your triage questions, your reply to the user, and the internal note for each. Then compare your reply against the strong example and write two sentences on what you would change. <!-- id: it-04-t08 band: focused energy: high -->
9. Retake the Part 13 drill a week later, without rereading the answer key first. Anything you get wrong twice is the thing to practise, and the two most commonly missed situations are the ones worth checking first. <!-- id: it-04-t09 band: ongoing energy: normal -->
10. Write one knowledge base article from a fault you fixed on your own machine while running the Part 10 checks. Use a command's unexpected output as the subject — it is a real finding, it is yours, and it is more convincing in a portfolio than a generic article. <!-- id: it-04-t10 band: focused energy: normal -->

## Deliverable / proof of work

Create `portfolio/it/04-helpdesk-skills.md` with:

- 10 sample tickets
- 2 knowledge base articles
- 3 escalation examples
- 5 user communication templates
- A healthy baseline note for your own machine, with what broken would look like beside each reading
- Your written answers to the twelve Part 13 drill situations, with your reasons, kept even where you scored them wrong

## Checklist

- [ ] I understand incident vs service request. <!-- id: it-04-c01 energy: low -->
- [ ] I understand priority, severity, and SLA. <!-- id: it-04-c02 energy: low -->
- [ ] I created 10 sample tickets. <!-- id: it-04-c03 energy: normal -->
- [ ] I wrote 2 knowledge base articles. <!-- id: it-04-c04 energy: normal -->
- [ ] I practiced or simulated remote support. <!-- id: it-04-c05 energy: normal -->
- [ ] I can troubleshoot 8 common helpdesk issues. <!-- id: it-04-c06 energy: normal -->
- [ ] I can write a calm response to an angry user. <!-- id: it-04-c07 energy: normal -->
- [ ] I can run the Part 10 checks on my own machine and say what healthy output looks like. <!-- id: it-04-c09 energy: normal -->
- [ ] I built my own healthy baseline and wrote what broken would look like beside it. <!-- id: it-04-c10 energy: normal -->
- [ ] I worked all six tickets in Part 11 on paper before reading the model replies. <!-- id: it-04-c11 energy: normal -->
- [ ] I scored myself against the Part 13 drill and reworked every answer I got wrong. <!-- id: it-04-c12 energy: normal -->
- [ ] I wrote an escalation note that satisfies at least six rows of the Part 12 table. <!-- id: it-04-c13 energy: normal -->
- [ ] I started applying for entry-level IT roles after this phase. <!-- id: it-04-c08 energy: normal -->

## You're ready to move on when...

You can receive a vague complaint like “my internet is broken,” ask good questions, test likely causes, document what happened, and explain when to escalate.

## Free vs Paid

### What's free and enough

osTicket, Spiceworks free options, Google Sheets, Chrome Remote Desktop, and free docs are enough.

### What's paid and why you'd upgrade

Zendesk, Freshdesk, Jira Service Management, and ServiceNow are common paid enterprise tools. Companies pay because they need scale, automation, reporting, and integrations.

### When it's worth paying

Do not pay personally. Learn concepts using free tools and read vendor docs.
