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

**How to use this lesson.** Read it once end to end to get the shape of the work. Then come back to it while you do the practice tasks below, because the lesson and the tasks are designed as a pair: the reading tells you what good looks like, and the tasks make you produce it. Do not try to memorise the scenarios in Part 4 — you will meet them in the wild soon enough. What matters is the method in Part 2 and the communication habits in Part 3, because those transfer to every ticket you will ever touch, in every role, at every level.

**Time to complete:** 10–15 hours across the phase. Roughly half of that is writing: tickets, knowledge base articles, replies, and escalation notes. That is deliberate. Writing is the job.

### Part 1 — The ticket is the unit of work

#### What a ticket actually is

A ticket is a durable, time-stamped record of a request and everything done about it. That definition matters more than it looks, because it explains why the ticket exists at all:

- **Continuity.** If you go home at 5pm, the next technician picks up the thread without calling the user back to re-explain.
- **Accountability.** Someone can answer "what happened with this?" six months later.
- **Measurement.** Management can see volume, response times, and recurring problems.
- **Learning.** The ticket history is the organisation's memory.

This is why "I fixed it, I just didn't log it" is a failure, not a humblebrag. From the organisation's perspective, you fixed one issue and destroyed the evidence that would have prevented the next ten.

Think about the third bullet for a moment, because it is the one beginners underestimate. If the same printer fails every Monday for six weeks, six separate tickets each look like a minor printer problem. Six tickets in the same pattern is a maintenance contract that has lapsed, or a device that needs replacing. That pattern is only visible if the tickets were written consistently enough to be grouped together. Your records are how your organisation notices its own recurring problems, and how you personally build the case for changing something rather than endlessly patching it.

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

There is a fourth habit that is easy to miss: **believe the user.** When someone says the printer worked yesterday and nothing changed, they usually mean it. When they say the problem only happens in one meeting room, that is a clue worth chasing. Users are unreliable narrators of *cause* — they will confidently tell you what broke it and be wrong — but they are excellent reporters of *symptom*. Trust the symptom, investigate the cause yourself, and never let a user feel dismissed. "Are you sure?" is a sentence that costs you their cooperation.

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

### Part 8 — Key takeaways

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

### Part 9 — Practice this next

The exercises below are the phase. Build the tracker, write the ten tickets, produce the knowledge base articles, practise remote support with a family member, write the user-friendly replies, and write the escalation notes. Keep every artefact — they become portfolio evidence and, later, interview stories.

One last piece of advice before you start. When you write those ten sample tickets, write them about real problems you have actually seen — a laptop that would not connect, a printer that vanished from the network, an account locked out twice in a week. Invented tickets read like invented tickets, and a hiring manager can tell. Real ones carry the detail that only comes from having been there: the exact error, the thing you tried that did not work, the moment the cause became obvious. That authenticity is what will make your portfolio convincing, and it is what will make these skills stick.

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

1. Set up a ticketing system. Install or explore the **osTicket** demo, or if that is too complex, build a **Google Sheets ticket tracker** with columns for ticket ID, summary, user, device, impact, status, resolution, and next steps.
2. Write 10 sample tickets using a consistent structure: summary, user, device, impact, troubleshooting steps, resolution, and next step.
3. Write 2 knowledge base articles: one on troubleshooting a no-internet connection (physical checks, IP configuration, DNS), and one on clearing browser cache and cookies in Chrome, Firefox, and Edge.
4. Practise remote support. Use **RustDesk** or **Chrome Remote Desktop** to connect to a family member's device or a second VM, and fix a simple issue such as display settings or a cache problem.
5. Write 5 user-friendly replies to common helpdesk issues — email not syncing, VPN not connecting, printer offline, forgotten password, and a slow laptop. Each reply must be clear, polite, and contain actionable steps.
6. Write 3 escalation notes, each including a detailed description, the troubleshooting already performed, supporting evidence such as error messages or logs, and the reason for escalation.

## Deliverable / proof of work

Create `portfolio/it/04-helpdesk-skills.md` with:

- 10 sample tickets
- 2 knowledge base articles
- 3 escalation examples
- 5 user communication templates

## Checklist

- [ ] I understand incident vs service request. <!-- id: it-04-c01 energy: low -->
- [ ] I understand priority, severity, and SLA. <!-- id: it-04-c02 energy: low -->
- [ ] I created 10 sample tickets. <!-- id: it-04-c03 energy: normal -->
- [ ] I wrote 2 knowledge base articles. <!-- id: it-04-c04 energy: normal -->
- [ ] I practiced or simulated remote support. <!-- id: it-04-c05 energy: normal -->
- [ ] I can troubleshoot 8 common helpdesk issues. <!-- id: it-04-c06 energy: normal -->
- [ ] I can write a calm response to an angry user. <!-- id: it-04-c07 energy: normal -->
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
