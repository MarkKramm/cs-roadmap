---
id: it-06-tools-and-ticketing
track: it
phase: 6
order: 60
title: "Phase 6 — Tools and Ticketing"
duration: "2 weeks"
duration_weeks: 2
energy_mix: [low, normal]
deliverable: "portfolio/it/06-tools-and-ticketing.md"
exit_criteria: "You can explain how a ticket moves through a support team and show sample tickets that look professional."
---

# Phase 6 — Tools and Ticketing

## Goal of this phase

Get comfortable with the tools and workflows common in remote IT support teams.

## Estimated time

**2 weeks**. This phase is short because you already practiced ticketing in Phase 4.

## Skills you'll gain

- Understand ticketing platforms and ITSM vocabulary.
- Use remote support tools safely.
- Understand asset inventory, monitoring, documentation, and password managers.
- Read vendor documentation without getting overwhelmed.
- Simulate a small IT support workflow from request to resolution.

## Specific topics to learn

- ITSM basics: incident, request, problem, change, asset, knowledge base
- Ticket quality: summary, impact, urgency, steps tried, resolution, closure note
- Remote support security: consent, session recording policy, least privilege, never ask for passwords
- Asset inventory: device owner, serial number, OS, warranty, installed apps
- Documentation: runbooks, KB articles, escalation notes
- Password management: vaults, MFA, recovery codes
- Monitoring alerts: up/down, CPU, disk, memory, latency

## Lesson: Tools and Ticketing

### Why this lesson exists

Phase 4 taught you to write a good ticket. This phase teaches something slightly different and slightly more important: **tools encode process**. A ticketing system is not a database of complaints — it is a formal model of how work moves through an organisation, and understanding that model is how you stop being a person who answers tickets and start being a person who improves the system that produces them.

Here is the interview version. A hiring manager asks, "How would you handle a request to install software for someone?" A weak candidate says "I'd install it." A strong candidate says "That depends — if it's already approved software, it's a service request and I'd action it under the standard change process. If it's new software, it needs a change request for approval and a licence check, and the ticket should reflect which path it took." Same task. Completely different candidate.

**Time to complete:** roughly 8–10 hours across two weeks. This is deliberately the shortest phase in the track, because you already did the difficult part — writing clear tickets — in Phase 4. Most of the work here is building templates and inventory, which you can do in short sittings.

**What you actually produce:** a workflow diagram, a ten-device asset inventory, five ticket templates, a change request template, and one monitoring runbook. Five small artefacts that together say "I understand how a support team operates." That is a portfolio piece that reads as operational maturity.

### Part 1 — ITSM vocabulary: six words that mean six different things

ITSM (IT Service Management) is the discipline of running IT as a service rather than as a series of emergencies. Learn this vocabulary precisely, because using these words correctly in an interview signals that you have studied, or worked in, a real support environment.

| Term | What it means | Example |
|---|---|---|
| **Incident** | Something is broken and needs restoring *now* | "The shared drive is unreachable" |
| **Service request** | A standard, pre-approved ask | "Add me to the Sales group" |
| **Problem** | The underlying cause behind one or more incidents | "The shared drive keeps crashing because a storage array disk is failing" |
| **Change** | A deliberate modification to a system, with approval and a rollback plan | "Apply the July Windows updates to the finance machines" |
| **Asset** | A managed thing — laptop, phone, licence, printer | "Dell Latitude 5540, asset tag IT-0412" |
| **Knowledge base (KB)** | Documented solutions so the next person does not start from zero | "How to fix Outlook after a password change" |

The incident-versus-problem distinction is the one people get wrong. **An incident is a symptom; a problem is the cause.** You fix incidents, and you investigate problems. When the same incident keeps reappearing, that is your signal to stop closing tickets and start asking why.

#### Urgency and impact are not the same thing

A ticketing system usually asks for both, and beginners conflate them:

- **Impact** — how many people are affected, and how badly. One user cannot print is low impact. The whole office cannot print is high impact.
- **Urgency** — how quickly it needs attention. One user cannot print *on the day of a client presentation* is high urgency.

Priority is derived from both. This is why "it's urgent!" from a user is not enough information — a support team needs to know whether "it" is one person or the entire company. Learning to ask that question politely is a core helpdesk skill, and Phase 7 covers how to phrase it.

### Part 2 — Ticket quality: what a professional ticket looks like

A ticket is three things at once, and beginners usually only see the first:

1. **A request for action** — what needs to happen.
2. **A record of what was done** — the audit trail. If someone asks in three months what changed, the ticket is the answer.
3. **A piece of institutional knowledge** — the solution you wrote may fix the same problem for the next technician with no investigation at all.

That third purpose is why ticket writing is not administration overhead. It is how a support team gets faster over time instead of repeating the same diagnosis forever.

#### The fields, and what belongs in each

| Field | What to write | Common mistake |
|---|---|---|
| **Summary** | A subject line a search would match — "Outlook stuck connecting after password change — J. Donnelly" | "Help!!!" or "Email broken" |
| **Description** | What the user reports, in their words, plus what you observed | Your conclusions instead of the facts |
| **Steps tried** | Every diagnostic step and its result, including the ones that failed | Only the successful one — failed steps are the most useful ones |
| **Resolution** | What actually fixed it, specific enough to repeat | "Fixed it" |
| **Closure note** | Plain-language summary for the user, plus prevention if relevant | Nothing — the user then reopens the ticket |

**Failed diagnostic steps are the most valuable thing in the ticket**, and almost nobody records them. If you flushed DNS and it did not help, that fact saves the next technician ten minutes. Write it down.

#### The same incident, written two ways

Read the weak version, then the professional version.

**Weak ticket:**

```text
Summary : email not working
Detail  : user called, fixed it
Resolved: yes
```

**Professional ticket:**

```text
Summary : Outlook stuck on "Trying to connect" after password change — J. Donnelly
Impact  : Single user, no other users affected. Medium urgency (client calls today).
Detail  : User changed domain password yesterday as prompted. Webmail works fine in
          the browser. Outlook desktop never prompts for the new password. Several
          credential prompts appeared this morning and were dismissed.

Steps tried:
  - Verified webmail login with the new password — SUCCESS, so the account and
    password are valid. Issue is local to Outlook, not the account.
  - Restarted Outlook — no change.
  - Checked Credential Manager — found cached domain credentials from before the
    password change. [Cause identified.]
  - Removed the cached entry for outlook.office.com.
  - Restarted Outlook — prompted for credentials, accepted new password, connected.

Resolution : Removed stale cached credential for outlook.office.com from Windows
             Credential Manager, restarted Outlook, re-authenticated.

Closure    : Hi Jane — your password change left an old saved login on this PC and
             Outlook kept trying to use it. Removed it; Outlook is connected again.
             Webmail was working throughout, so nothing you did wrong. If it happens
             again after a password change, call us and we'll clear it in two minutes.

Prevention : Add this fix to the KB article "Outlook authentication after password
             change" so the next occurrence resolves in one step.
```

Notice what the second version adds: an impact assessment, a fact that eliminated a whole category of causes (webmail works, so the account is fine), the failed steps, the actual root cause, a closure note written to a human being rather than a database, and a suggested prevention. That is what "professional ticket" means, and it is entirely within reach today.

#### Templates are how quality scales

You will not write that carefully from scratch when you are busy. Nobody does. That is why this phase asks for **five ticket templates**: password reset, VPN issue, printer issue, no internet, suspicious email.

A template is a pre-written scaffold with the diagnostic questions already in place. For a suspicious email it might include: sender address, subject, timestamp, did you click anything, did you enter any details, was an attachment opened, have you changed your password yet. Working through that list takes thirty seconds and prevents the one thing that really matters — the user who clicked and did not mention it.

Templates turn a good day's work into every day's work. Build them once, copy them forever.

### Part 3 — The supporting systems: inventory, remote support, monitoring

#### Asset inventory: you cannot manage what you have not recorded

An asset inventory is a list of every device you are responsible for, with enough detail to act on:

| Field | Why it matters |
|---|---|
| Device name | How you identify it remotely |
| Owner / assigned user | Who to contact, and who to hold responsible |
| Serial number and asset tag | Warranty claims and theft recovery |
| Operating system and version | Which patching group it belongs to |
| Purchase date and warranty expiry | Budget planning and replacement scheduling |
| Installed software | Licence compliance and vulnerability scope |

The phase task is to build a ten-device inventory in Snipe-IT or Google Sheets. Do the Google Sheets version even if you also do Snipe-IT, because the flat sheet is what most small businesses actually run on, and showing you can work in either is useful.

**Why the warranty field deserves its own mention:** "this laptop is four years old and out of warranty" changes the answer to almost every hardware ticket. A failing drive in a warrantied device gets replaced; a failing drive in a five-year-old device gets backed up and the machine gets retired. Recording the date is what makes that decision possible.

#### Remote support, and the security rules that come with it

Remote support tools let you see and control a user's screen. They are powerful, and the power cuts both ways — which is exactly why the rules around them are strict and non-negotiable:

- **Consent first, every session.** The user must know you are connecting and must agree. No silent connections, even for a one-second fix.
- **Never ask for a password.** Not to log in as them, not to "verify" anything. Legitimate IT staff do not need it, and a support person who asks for passwords trains users to fall for phishing. This is the single most important rule in the phase. If you take nothing else from this lesson, take this.
- **Least privilege in the session.** Take control only when needed. Prefer instructing the user where practical — it teaches them and reduces what you can touch by accident.
- **Know your organisation's recording policy.** Some environments record sessions and notify the user; some prohibit recording entirely for privacy or compliance reasons. Know which applies before you connect, because "I didn't know" is not a defence.
- **Say what you are doing while you do it.** "I'm opening Event Viewer now" is reassuring, and it builds trust with someone watching their own machine being operated.

The phase checklist calls this "safe remote support behaviour", and it is assessed in interviews. A candidate who volunteers "and I'd always get explicit consent before connecting" stands out immediately, because it is the answer of someone who has thought about the user rather than only the problem.

#### Password vaults: never reuse, never write it on a sticky note

Bitwarden and KeePassXC exist because humans cannot memorise thirty strong unique passwords, and passwords that are memorised are passwords that are weak or reused. A vault gives you one strong master password and different random passwords for everything else.

For your lab, this means every account you create while studying — the local test user, the Snipe-IT admin, the osTicket account — gets a unique generated password stored in the vault. It also means MFA where available, and **recovery codes stored somewhere other than the device they protect**. A recovery code saved only on the phone whose screen has cracked is not a recovery code.

#### Monitoring: alerts are only useful with a response plan

Monitoring tools watch systems and raise an alert when something crosses a threshold — up/down, CPU, disk, memory, latency. The phase task is to write a **runbook** for one alert. The runbook is the interesting part, because an alert with no response plan is just noise that people learn to ignore.

A runbook answers, in order:

1. **What triggered** — the alert name and the threshold that fired.
2. **What it means** — one sentence of plain explanation.
3. **First checks** — the fastest things that confirm or eliminate. Is the service up? Is it reachable? Is the host out of disk?
4. **Escalation** — who to contact, and after how long.
5. **What to record** — what goes in the ticket, so the next occurrence is faster.
6. **Known false positives** — situations where the alert fires and nothing is wrong.

That last item separates a useful runbook from a theoretical one. Every monitoring system has alerts that fire routinely and mean nothing. Documenting them saves the on-call technician from investigating the same non-event every week.

#### How a ticket actually moves: the workflow you are asked to draw

The phase task is a workflow diagram: **request → triage → troubleshoot → resolve → close**. Filling in what happens at each stage is the real exercise, because each arrow is a decision:

- **Request** — arrives by phone, email, portal, or walk-up. It gets logged, because an unlogged request is invisible work.
- **Triage** — categorise, set impact and urgency, and route. A wrong priority creates a real problem here: something misrouted as low can sit for days while a client waits.
- **Troubleshoot** — diagnose and fix, or escalate with clear notes about what you have already ruled out.
- **Resolve** — the fix is confirmed *with the user*, not assumed. "I've made a change, please check it now" is the moment the ticket can actually close.
- **Close** — write the closure note in plain language, and note prevention if there is one.

Two arrows most diagrams miss, and most real environments have: **escalation** (from troubleshoot to a specialist, carrying your notes) and **reopen** (from close back to troubleshoot, when the fix did not hold). Drawing them shows you understand support as a loop, not a straight line.

#### The end-of-shift handover

There is a third thing most diagrams miss, and it is one you will do every single working day: the **shift handover**. It is worth its own section because this curriculum puts you on Philippine hours covering US business hours, which means your tickets are picked up by someone else while you sleep — and a ticket handed over badly is a ticket that gets re-investigated from zero.

The principle is the same one that runs through this whole phase: **write so the next person never has to re-investigate.** At the end of a shift, every ticket still open in your queue needs to be safe for a stranger to pick up. "Safe" means four things are written down:

| What the next person needs | Why |
|---|---|
| **Current state** — what you have established so far | So they do not repeat your diagnostics |
| **Next action** — the specific thing you were about to do | So the ticket does not stall waiting for someone to think |
| **Who is waiting** — the user, and any promised callback | So a promise made on your shift is kept on theirs |
| **What you would do if it were yours** — your read on it | This is the difference between a handover and a dump |

A handover note is four lines in the ticket, not a meeting. It looks like this:

> Shift ending 22:00 PHT. Printer at 192.168.1.51 confirmed offline; port was pointed at the wrong address and I corrected it, waiting on the user to test a page before I close. If no reply by morning, call the site contact directly — the user is on leave from Thursday. Sumeet is the only other person who has seen this fault, worth asking if it recurs.

**The habit worth building.** Write the handover note as you go, not at the end. A note written at 21:55 from memory is missing exactly the detail the next person needs, and the details you have forgotten are always the ones you assumed were obvious.

**Why this matters more than it looks.** The handover is the moment a new hire's documentation habits are judged. A colleague who opens your ticket at 2am and finds everything they need forms an opinion of your work in about thirty seconds — and that opinion travels. It is one of the few things in entry-level support that is entirely within your control, costs five minutes, and is visible to the people who decide whether you stay.

### Part 4 — Two skills that make the tools work

#### Reading vendor documentation without drowning

The phase checklist includes "read vendor documentation without getting overwhelmed", and that is a real skill rather than a soft one. Vendor docs are written for people who already know the product, and they are enormous. Nobody reads them end to end.

The technique is **search-driven reading**, and it works like this:

1. **Start from the error message or the exact task**, not from the front page. "How do I reset a user's MFA method in the admin centre" is a searchable question. "Learn Microsoft 365" is not.
2. **Prefer the official domain** (`learn.microsoft.com`, `support.google.com`, `atlassian.com`) over a random blog. Blogs are often faster to read and sometimes wrong; official docs are authoritative and sometimes pedantic. Use blogs for orientation, official docs for the answer.
3. **Skim the headings before reading anything.** Docs are structured — find the heading that matches your task and read only that section.
4. **Check the version and date.** A guide written for Windows 10 may be subtly wrong on Windows 11. A page about an old admin portal may describe buttons that no longer exist.
5. **Note the prerequisites.** Half of "the documentation doesn't work" is a missing permission or a feature that requires a higher licence tier.
6. **Write your own procedure after reading theirs.** If you cannot write the steps in your own words, you did not understand them yet. The workflow documents in this phase's deliverable are exactly that exercise.

This is why the phase's tasks ask you to *document* the workflow rather than just read it. Documentation forces comprehension, and the resulting artefact is both portfolio evidence and a real workplace skill.

#### Escalation: handing over without losing the thread

Sooner or later you will hit something you cannot fix. What you do at that moment is a genuine measure of professionalism, and beginners get it wrong in a specific way: they either keep trying until the user's patience runs out, or they pass it on with "I couldn't fix it, please help."

Good escalation is a structured handover, and it includes:

- **What the user reported**, in their words.
- **What you have already tried**, and what each attempt showed. This is the part that saves the specialist an hour.
- **What you have ruled out.** "Webmail works, so the account is fine" eliminates a whole branch of the diagnostic tree.
- **What you believe it might be**, offered as a hypothesis rather than a conclusion.
- **The impact and urgency**, so the receiving person knows how fast this needs to move.
- **How to reach the user**, and whether they know the ticket is being escalated.

The last point matters more than it sounds. A user who thinks they are being ignored becomes angry; a user who has been told "I've passed this to our specialist, they'll call you within the hour" is patient. **Escalating well is mostly about keeping the user informed**, and that is a skill you can demonstrate in an interview with a two-sentence answer.

The corresponding duty is on the receiving end: when you are handed work, respect the notes you were given. Repeating diagnostics someone already documented wastes everyone's time and signals that you did not read the handover.

### Part 5 — Working a runbook, with real monitoring output

Part 3 explained what a runbook contains. This part shows one being used, because a runbook you have only read about is a document, and a runbook you have followed is a skill.

#### The alert, as it actually arrives

Monitoring alerts do not arrive as tidy sentences. They arrive as a wall of fields, and the first job is to read them fast:

```text
ALERT: Disk space low
Host:     FS01 (file server)
Check:    Free disk space on C:
Value:    8.2% free (3.9 GB of 47.6 GB)
Threshold: below 10% for 15 minutes
Severity: Warning
Fired:    2026-03-14 02:17 UTC
```

Four things matter in that block, and they are the four things to read in any alert:

1. **Which host** — `FS01`. One machine, not a fleet.
2. **What was measured** — free space on `C:`, not on a data volume.
3. **How far past the threshold** — 8.2% against a 10% limit. Marginally over.
4. **When it fired** — 02:17, outside working hours, so nobody is being blocked right now.

That fourth point is the one beginners skip, and it changes the response. An alert at 02:17 on a file server is not an emergency; it is the first task of the morning *unless* something else indicates otherwise. Knowing the difference between "this is on fire" and "this will be on fire by Thursday" is most of what monitoring experience means.

#### Applying the runbook

The runbook for this alert, written in advance, says:

```text
RUNBOOK: Disk space low on a file server

Means:        The volume is filling. At 0% the server stops writing,
              which breaks file shares for everyone who uses them.
First checks: 1. Which volume, and how fast is it growing?
              2. Is it log files, user data, or a runaway process?
              3. Was there a recent large copy or a failed backup writing locally?
Escalate to:  Infrastructure team if growth is unexplained or the volume is
              below 5% and falling.
Record:       Volume, size, free space, growth rate, largest directories,
              and what was cleared (if anything).
Known false
positives:    Fires after the monthly backup job stages files locally; clears
              itself within 24 hours. Verify against the backup log first.
```

Work the checks in order. First, which volume and how fast it is growing:

```powershell
Get-PSDrive -PSProvider FileSystem |
  Select-Object Name, @{n="UsedGB";e={[math]::Round($_.Used/1GB,1)}},
                       @{n="FreeGB";e={[math]::Round($_.Free/1GB,1)}}
```

```text
Name UsedGB FreeGB
---- ------ ------
C     43.7    3.9
D    210.4  255.6
```

So `C:` is the nearly-full volume and `D:` is comfortable. That single comparison already tells you the data volume is not the problem, which means this is probably not "the file server is full of user files" — the more common and more expensive diagnosis.

Second, is it logs or data? Find the largest directories:

```powershell
Get-ChildItem C:\ -Directory -Force -ErrorAction SilentlyContinue |
  ForEach-Object {
    $size = (Get-ChildItem $_.FullName -Recurse -File -Force -ErrorAction SilentlyContinue |
             Measure-Object Length -Sum).Sum
    [PSCustomObject]@{ Folder = $_.FullName; GB = [math]::Round($size/1GB, 2) }
  } | Sort-Object GB -Descending | Select-Object -First 5
```

```text
Folder                    GB
------                    --
C:\Windows\Temp        18.41
C:\Windows\Logs         9.72
C:\Users                8.10
C:\ProgramData          4.02
C:\Program Files        2.88
```

`C:\Windows\Temp` at 18.41 GB is the answer, and it is not user data. Something has been writing temporary files and never cleaning them up.

Check the backup log before going further, because the runbook lists this as a known false positive:

```powershell
Get-WinEvent -LogName Application -MaxEvents 20 |
  Where-Object { $_.ProviderName -like "*Backup*" } |
  Select-Object TimeCreated, Id, Message -First 3
```

No backup entries in the last 20 events, so the false positive is eliminated — this is real growth, not the monthly job.

Third, what is in Temp, and when was it written:

```powershell
Get-ChildItem C:\Windows\Temp -File -Force |
  Sort-Object Length -Descending | Select-Object -First 5 Name, Length, LastWriteTime
```

```text
Name                        Length LastWriteTime
----                        ------ -------------
sql_dump_20260301.tmp   4823449600 2026-03-01 01:04
sql_dump_20260302.tmp   5100273664 2026-03-02 01:02
sql_dump_20260303.tmp   4982162063 2026-03-03 01:01
```

A file appearing every day at about 01:00, roughly 5 GB each, never deleted. That is not a Windows problem — something is running a nightly job that writes a dump and fails to clean up after itself. The dates line up with the alert: at ~5 GB a night, the 18.41 GB in that folder is under four days of accumulation, which is why this escalated quickly.

#### What you do, and what you do not

You have found the cause quickly and safely. Now the temptation is to delete the files, close the ticket, and move on. Resist three parts of that:

- **Do not just delete and close.** Something creates these files nightly. Deleting them buys about four days and the alert returns — and now nobody remembers why. The ticket should be linked to a *problem* record so the nightly job gets fixed.
- **Do not delete files you cannot identify.** These are identifiable (name, daily schedule, size, timestamp) and clearly disposable, so clearing them is reasonable. If they had been unfamiliar database files, the same action would have been destructive. Identify first, delete second.
- **Do not skip the recording step.** Volume, growth rate, largest directories, what you cleared, and the pattern you found. That note is what lets the next person (or you in six months) solve the recurrence in two minutes instead of twenty.

#### The ticket note this produces

> **Alert:** Disk space low on FS01, `C:` at 8.2% free (3.9 GB of 47.6 GB), 02:17 UTC.
> **Investigated:** `Get-PSDrive` confirmed only `C:` affected; `D:` has 255.6 GB free, so the data volume is healthy and this is not user-data growth. Largest-directory scan showed `C:\Windows\Temp` at 18.41 GB, of which the largest files were `sql_dump_*.tmp` dated daily from 2026-03-01, ~5 GB each. Backup log checked first per runbook known-false-positive — no backup events, so the false positive was eliminated rather than assumed.
> **Cause:** A nightly job outside the service desk's ownership is writing ~5 GB of temporary dump files to `C:\Windows\Temp` and never removing them. Under four days of accumulation took the volume to the alert threshold, so this will recur within the week unless the job is fixed.
> **Action:** Cleared `C:\Windows\Temp` dump files after confirming their identity and daily pattern. Did **not** delete unfamiliar files. Raised a problem record so the owning team fixes the cleanup, because the files regenerate nightly.
> **Verified:** `C:` back to 46% free immediately after clearing; alert cleared on the next monitoring cycle.
> **For the next agent:** If this alert fires again, check `C:\Windows\Temp` first and look for `sql_dump_*.tmp`. The root cause is not fixed — the nightly job is with the application team. Growth is ~5 GB per day, so the volume has roughly four days of headroom.

Notice what the note does that a "deleted temp files, disk ok" note would not: it names the growth rate, so the next person knows the urgency without investigating; it records the *problem* as still open, so nobody thinks it is solved; and it says which check was done first and why, so the reasoning is repeatable.

#### The metrics a service desk is actually measured on

You will be asked about these in interviews, and the terms matter more than the numbers. Nobody expects a beginner to quote targets, but you should know what each one means and which way is good.

| Metric | Plain meaning | Watch for |
|---|---|---|
| **First response time** | How long until a human replies to a new ticket | The metric users notice most; a fast holding reply beats a slow perfect one |
| **Mean time to resolve (MTTR)** | Average time from logged to resolved | Can be gamed by closing tickets early — always read it with reopen rate |
| **First contact resolution (FCR)** | Share of tickets fixed on the first interaction | The efficiency number; a high FCR with high reopen rate is a lie |
| **Reopen rate** | Share of tickets that come back after closing | The honesty check on FCR and MTTR |
| **Backlog** | Tickets open and not being worked | The clearest sign a team is understaffed |
| **SLA compliance** | Share of tickets met within their promised time | Always read alongside severity, or teams meet it by ignoring small tickets |
| **Customer satisfaction (CSAT)** | Post-ticket rating | Low response rates make it noisy; treat single low scores as a signal to read the ticket, not a verdict |

The pattern in the right-hand column is the real lesson: **almost every support metric can be improved by making the work look better rather than by doing it better.** Closing tickets without confirming the fix raises FCR and lowers MTTR, while reopen rate quietly rises.

This is why mature teams report these together rather than one at a time. When you are asked in an interview how you would measure your own performance, saying "I would look at reopen rate as well, because it is the check on the other numbers" signals that you understand the system rather than just the tool.

### Part 6 — The ticket that should have been a problem

This is a worked ticket about *process*, not technology, because that is what this phase is about. The fix in it is trivial. The lesson is in recognising what the ticket really is.

**The situation.** Over three weeks, a password-expiry ticket appears eleven times. Each one is closed within twenty minutes. Every agent considers their ticket a success.

```text
INC-4471  Password expired - A. Reyes          resolved  18 min
INC-4498  Password expired - M. Santos        resolved  15 min
INC-4530  Password expired - A. Reyes         resolved  19 min
INC-4556  Password expired - J. Cruz          resolved  12 min
...
INC-4902  Password expired - A. Reyes         resolved  17 min
```

**What a beginner sees.** Eleven tickets, eleven quick fixes, a good week.

**What a technician sees.** The same user appears three times. That repetition is the signal Part 1 described: *an incident is a symptom; a problem is the cause.* Something is making people's passwords expire at a rate that generates eleven tickets in three weeks — and the same person hitting it three times means the fix is not holding.

**What to investigate.**

First, the pattern across users, not the problem in front of you:

```powershell
# Are these users all in the same group, site, or OU?
# Needs the RSAT Active Directory module and a domain — illustration only, not runnable at home.
Get-ADUser -Filter "SamAccountName -eq 'areyes'" -Properties MemberOf, PasswordLastSet, pwdLastSet |
  Select-Object Name, PasswordLastSet, @{n="Groups";e={$_.MemberOf -join "; "}}
```

```text
Name       PasswordLastSet      Groups
----       ---------------      ------
A. Reyes   2026-03-01 09:12:04  CN=Sales,OU=Manila,DC=company,DC=local; CN=VPN-Users,...
```

`PasswordLastSet` is recent — the user *did* change it, and the reset genuinely worked. That is the puzzle, not the answer: if the password was changed days ago and the policy allows thirty days, nothing is expiring it again. So the recurring ticket cannot be the password itself, and the next check rules out the one remaining policy explanation before the real cause appears.

Second, check whether a policy is shorter than the users believe:

```powershell
Get-ADDefaultDomainPasswordPolicy | Select-Object MinPasswordAge, MaxPasswordAge, LockoutThreshold
```

```text
MinPasswordAge    MaxPasswordAge    LockoutThreshold
--------------    --------------    ----------------
1.00:00:00        30.00:00:00       5
```

Thirty days is the maximum password age. `MinPasswordAge` is one day.

**Now the cause is visible.** Somewhere in this organisation there is a scheduled task, a script, or a service account using a *stored* credential for these users — most likely the VPN client profile or a mapped drive with saved credentials. When the password expires and is changed, the stored credential still holds the old one. It retries, fails, and in environments with a lockout policy it can lock the account.

Meanwhile the user's password is fine, so the ticket gets closed as "reset password, user working" — and then it recurs.

That is why A. Reyes appears three times. Each reset fixed the symptom. None of them found the stored credential.

**The actual fix** is to find the stale credential: check the VPN client's saved profile, the Windows Credential Manager, and any scheduled task running as that user. Then the *problem* record says: "Stored credentials in VPN client profiles are not updated on password change. Affects users with saved VPN profiles. Fix: document the update step in the password-change KB, and update the VPN client's saved credential as part of the reset procedure."

**Why this is the most valuable ticket in the phase.** Eleven fast resolutions look like excellent performance on every metric in the table above — low MTTR, high FCR, good CSAT because each user got a quick fix. The only number that tells the truth is the recurring pattern, which no single ticket shows.

**The habit to take away:** when you notice you have fixed the same thing for the same person, or the same team, more than twice, stop closing and start linking. That is the moment an incident becomes a problem, and noticing it is what separates a ticket-taker from a support engineer.

### Part 7 — Build your own ticketing system, for free

Everything so far has been description. This part is construction. By the end you will have a working ticket queue, a dashboard that computes itself, and a screenshot worth putting in your portfolio.

The tools are Google Sheets or LibreOffice Calc. Both are free. Nothing here needs an account, a licence, or a card. If you would rather run real software, the free self-hosted option is **osTicket** on a local virtual machine. Build the sheet version regardless, because a flat sheet is what most small businesses actually run on.

#### The workbook, and why it has four tabs

| Tab | What it holds | Why it exists |
|---|---|---|
| `Tickets` | One row per ticket — the live queue | The work itself |
| `Lists` | The allowed values for category, priority, status | So dropdowns are consistent |
| `Users` | Name, username, email, department, site | So you can group tickets by team |
| `Dashboard` | Formulas only, no typing | So the numbers update themselves |

The `Lists` tab is the one beginners skip, and it is the one that matters. When status values are typed by hand you get `Closed`, `closed`, `CLOSED`, and `Clsed`. Every count you write afterwards is then wrong.

Here is `Lists`, exactly:

```text
Category            Status        Priority   Impact        Urgency
Hardware            New           P1         Enterprise    Critical
Software            Assigned      P2         Department    High
Network             In Progress   P3         Individual    Medium
Account             Pending       P4         Single Site   Low
Email               Resolved
Access              Closed
Other               Cancelled
```

`Cancelled` is not decoration. A ticket that was never real work — a duplicate, a user who solved it themselves — must leave the queue somehow. Without a cancelled state, agents close those as `Resolved`, and your resolution metrics quietly become fiction.

#### The column layout

Set up `Tickets` with these eleven columns, in this order:

| Column | Header | Example value | Why it exists |
|---|---|---|---|
| A | `Ticket ID` | `INC-1001` | The name everyone uses in conversation |
| B | `Date Opened` | `2026-03-02 09:14` | The clock starts here |
| C | `Date Resolved` | `2026-03-02 10:02` | Resolution time is computed from this |
| D | `Requester` | `A. Reyes` | Who reported it; links to `Users` |
| E | `Category` | `Email` | Reporting and routing |
| F | `Summary` | `Outlook stuck after password change` | The searchable subject line |
| G | `Impact` | `Individual` | How many people are affected |
| H | `Urgency` | `High` | How fast it needs attention |
| I | `Priority` | `P3` | Derived from G and H together — this row is Individual + High, which the grid reads as P3 |
| J | `Status` | `Resolved` | Where it sits in the lifecycle |
| K | `Resolution` | `Cleared stale cached credential` | What actually fixed it |

The first-response-time column belongs in the corporate system, and it is worth adding here as column L (`First Response`) if you want to practise the metric in Part 11. Leave it blank on tickets nobody has replied to yet — do not type a zero.

#### Why each field exists, in one line

If you cannot say why a column exists, delete it. Every field costs an agent time on every ticket, forever.

- **Ticket ID** — so two people discussing "the email one" know they mean the same thing.
- **Date Opened** — the start of every time-based metric you will ever report.
- **Date Resolved** — the end of the clock, and only set when the *user* confirms.
- **Requester** — so recurring problems can be spotted per person, as Part 6 showed.
- **Category** — so "what breaks most often" is an answerable question.
- **Summary** — so search returns the right ticket six months later.
- **Impact** — how wide the damage is; a factual question.
- **Urgency** — how fast it needs attention; also factual.
- **Priority** — the decision, derived rather than argued about.
- **Status** — where the ticket is right now, and who is holding it up.
- **Resolution** — the audit trail, and the raw material for your KB article.

#### Making the dropdowns work

Select the `Category` column in `Tickets`, then **Data → Data validation → Add rule → Dropdown**. Set the range to `Lists!$A$2:$A$8`. Repeat for the other columns using their own ranges.

**On LibreOffice Calc** — the other free option named above — the menu path is different: **Data → Validity**, then choose `List` under Allow and enter the range. Everything else about the workbook is identical, and every formula here works in both. Google Sheets is the smoother route if you have the choice, because the dropdown and the `INDEX`/`MATCH` formula below use the same syntax throughout.

Do this for `Status` too, and use exactly these seven values: `New`, `Assigned`, `In Progress`, `Pending`, `Resolved`, `Closed`, `Cancelled`. A status nobody chose deliberately is a status nobody maintains.

#### Writing your own ID

Type `INC-1001` in `A2`. Then in `A3` put this formula and drag it down:

```text
=IF($B3="","", "INC-" & (1000 + ROW() - 1))
```

`ROW()` returns the row number, so row 3 produces `INC-1002`. The formula is self-maintaining: insert a row and every ID below renumbers itself. The `IF` at the front matters more than it looks.

Without it, dragging the formula down twenty rows writes twenty IDs into empty rows, and every count you build on the ID column afterwards reports twenty tickets when you have logged none. With it, a row gets an ID only once you have typed its `Date Opened` — so the sheet stays honest while you grow into it.

#### Deriving priority from impact and urgency

Priority should never be typed. Put this in `I2` and drag it down:

```text
=IF(OR($G2="",$H2=""),"", IFERROR(INDEX(Lists!$B$21:$E$24,
  MATCH($G2,Lists!$A$21:$A$24,0),
  MATCH($H2,Lists!$B$20:$E$20,0)), "Check the grid"))
```

This needs the grid placed on the `Lists` sheet, starting at row 20, exactly as printed below: `B20:E20` holds the four urgency headings, `A21:A24` the four impact labels, and `B21:E24` the sixteen priorities. Paste it there once and the formula works for every row.

It is two lookups rather than one because priority has two inputs, not one. `MATCH($G2, …, 0)` finds the impact row, `MATCH($H2, …, 0)` finds the urgency column, and `INDEX` returns the cell where they meet. A single `VLOOKUP` cannot do this without a concatenated helper column, which is the other honest way to build it: add a column to `Lists` holding `=A21&B20`-style keys, concatenate `$G2&$H2` in the ticket row, and `VLOOKUP` against that. Both work; the `INDEX`/`MATCH` version avoids maintaining a second column.

| Impact \ Urgency | Critical | High | Medium | Low |
|---|---|---|---|---|
| **Enterprise** | P1 | P1 | P2 | P3 |
| **Department** | P1 | P2 | P3 | P4 |
| **Individual** | P2 | P3 | P4 | P4 |
| **Single Site** | P3 | P4 | P4 | P4 |

Read the corners of that grid. `Enterprise` + `Critical` is P1 — the top left. `Single Site` + `Low` is P4 — the bottom right. The grid is the argument-settler: when a user insists something is urgent, you are not disagreeing with them, you are reading a table.

One asymmetry is worth naming, because it is the thing beginners get wrong in both directions. Impact sets how high a ticket can go; urgency decides where in that range it lands. So an `Enterprise` problem at `Low` urgency is **P3**, not P1 — a real problem, but not one that stops the business this hour. And one person's request is **P2 at the very highest**, at `Critical` urgency, however loudly it is described. Nobody's single laptop is ever P1.

#### The dashboard, which is where the value is

Put these five formulas on `Dashboard`. Adjust the row count to match your data.

| Cell | Formula | What it reports |
|---|---|---|
| `A2` | `=COUNTA(Tickets!A2:A200)` | Total tickets logged — correct only because the ID formula leaves empty rows blank |
| `A3` | `=COUNTIF(Tickets!J:J,"Resolved")+COUNTIF(Tickets!J:J,"Closed")` | Resolved or closed |
| `A4` | `=COUNTIF(Tickets!J:J,"New")` | Unassigned backlog |
| `A5` | `=IFERROR((SUMIFS(Tickets!C:C,Tickets!J:J,"Resolved")+SUMIFS(Tickets!C:C,Tickets!J:J,"Closed")-SUMIFS(Tickets!B:B,Tickets!J:J,"Resolved")-SUMIFS(Tickets!B:B,Tickets!J:J,"Closed"))/A3,"n/a")` | Mean time to resolve |
| `A6` | `=IFERROR(A3/A2,"n/a")` | Resolution rate |

The `A5` formula is ugly, and the reason is worth understanding. Sheets stores a date-time as a single decimal number — `1.5` is noon on the first day — so subtracting two of them gives a fraction of a day.

That is also why the formula sums the `Resolved` and `Closed` rows explicitly rather than using a `"<>"` criterion. `AVERAGEIFS` would average *every* row with a non-blank status, including the open ones whose `Date Resolved` is empty, and would then subtract the mean of a different set of rows from the mean of another. Two averages of two different populations do not give you a mean time to resolve. Summing the closed rows and dividing by the same count that `A3` already holds does.

Fix the display by formatting `A5` as **Duration**. If you want a plain number of hours, wrap the whole thing in `*24` — you are **multiplying** by 24, because you are converting a fraction of a day into hours. Dividing by 24 turns six hours into a quarter of an hour.

That `IFERROR` in `A6` is not decoration. With no tickets logged, `A3/A2` is a division by zero and the cell shows `#DIV/0!`. A dashboard that screams red on day one is a dashboard people stop opening.

#### Build it, then use it

Do not build this and admire it. Log your next ten real home IT problems in it. Your own laptop counts, your family's phone counts, the printer counts.

- **Build the four-tab workbook**, with `Lists` populated before any ticket is typed.
- **Add dropdowns driven from `Lists`**, so a status can never be typed by hand.
- **Write the ID formula** and drag it down at least twenty rows — the blank-row guard means the extra rows stay empty until you need them.
- **Derive `Priority` from `Impact` and `Urgency`** with the grid, rather than typing it.
- **Log five real tickets of your own** — your own home problems count.

### Part 8 — Writing tickets from scratch

Part 2 showed one incident written two ways. This part makes you do it five times, which is the only way the habit forms.

The rule underneath all five exercises is the same. **A user gives you a symptom; a ticket needs a shape.** Your job is to convert one into the other without inventing facts you were not given.

#### The six fields you must always fill

| Field | The question it answers | Bad answer | Good answer |
|---|---|---|---|
| **Summary** | What is it, in one searchable line? | "Email problem" | "Outlook cannot connect after password change — A. Reyes" |
| **Impact** | How many people, how badly? | "Urgent" | "Individual — one user, unable to send externally" |
| **Urgency** | How fast must this move? | "ASAP" | "High — client presentation at 14:00 today" |
| **Category** | What kind of work is this? | "Computer" | "Email" |
| **Affected service** | Which system is failing? | "The internet" | "Microsoft 365 Exchange Online (mail send path)" |
| **Steps to reproduce** | What exactly produces the fault? | "It doesn't work" | "1. Open Outlook. 2. Send to any external address. 3. Message sits in Outbox." |

Notice that only two of the six are judgement calls. Impact and urgency are reports of fact; the rest are precision. Most beginner tickets are weak because four fields are vague, not because the judgement was wrong.

#### Report 1 — "it's not working"

**The user says:** *"Hi, it's not working again. Can you look? It was fine yesterday."*

**Weak ticket:**

```text
Summary : not working
Category: Other    Priority: P3    Status: New
```

**Strong ticket:**

```text
Summary : Shared drive S: unavailable on the Manila floor — 6 users
Impact  : Department — six users on the Manila floor cannot reach S:.
          Local work continues; shared documents are blocked.
Urgency : High — month-end reporting is due today.
Category: Network (file share access)
Service : SMB file share \\FS01\shared
Repro   : 1. Open File Explorer. 2. Navigate to \\FS01\shared.
          3. Error: "Windows cannot access \\FS01\shared" (0x80070035).
          Other departments on the same floor are unaffected.
```

**Why:** the weak version is unactionable because "it" has no referent and "again" was thrown away. That word is the whole clue. It means a previous ticket exists, and the previous fix probably did not hold — the Part 6 pattern. The strong version names the host, the path, the error code, and who is *not* affected, which is what narrows the search.

#### Report 2 — "my email is broken"

**The user says:** *"My email is broken. I can't send anything."*

**Weak:** `Summary: email broken. Detail: user cannot send.` — no direction, no scope, no error.

**Strong:**

```text
Summary : Cannot send external mail from Outlook — receives fine (J. Cruz)
Impact  : Individual — one user. Internal mail works; external blocked.
Urgency : Medium — responses to two clients delayed today.
Category: Email
Service : Microsoft 365 Exchange Online (outbound queue)
Repro   : 1. Open Outlook desktop. 2. Compose to an external address.
          3. Send. 4. Message stays in Outbox; no error dialog appears.
Tested  : Webmail sends externally without issue from the same account.
```

**Why:** "broken" covers at least four different faults. This version separates sending from receiving, and desktop from web. The webmail test is the single most valuable line, because it splits the problem in half: account-side or client-side. It also proves the issue is not the mail service itself.

#### Report 3 — "the internet is slow"

**The user says:** *"The internet is so slow today, I can barely do anything."*

**Weak ticket:**

```text
Summary : Internet slow
Category: Network    Priority: P2
```

**Strong ticket:**

```text
Summary : Intermittent slow browsing, 09:00–11:00, one workstation — M. Santos
Impact  : Individual — one user, but work is effectively stopped.
Urgency : Medium — no deadline today, but productivity is affected.
Category: Network
Service : Office LAN and internet gateway
Repro   : 1. Browse to any site at 09:30. 2. Pages take 8–12 seconds.
          3. Same pages load in under 2 seconds from a phone on mobile data.
Scope   : Speed test from this PC: 4 Mbps down, 1 Mbps up.
          Speed test from a neighbouring desk: 88 Mbps down.
```

**Why:** "slow" is a comparison with no reference point. The strong version adds a time window, a comparison device, and two speed-test numbers from two different desks. Those two numbers turn an opinion into a measurement: this is one workstation, not the office connection. Never open a network ticket without a number in it.

#### Report 4 — "I think I got a virus"

**The user says:** *"There's a pop-up saying my computer is infected, I think I got a virus. I clicked something."*

**Weak:** `Summary: possible virus. Action: ran a scan, nothing found. Closed.`

**Strong:**

```text
Summary : Suspected malware — browser pop-up scareware, user clicked (R. Lim)
Impact  : Individual so far. Potential scope unknown — one shared drive
          and one webmail session are reachable from this device.
Urgency : Critical — a possible credential compromise is time-sensitive.
Category: Security (potential incident)
Service : Endpoint RLLAPTOP-04; account rlim@company.local
Repro   : 1. User browsed a coupon site at ~08:40.
          2. Full-screen pop-up claimed the PC was infected.
          3. User clicked "Scan now" and closed the window.
          4. No malware detected by the installed antivirus scan.
Timeline: 08:40 click, 08:55 reported, 09:02 ticket raised.
```

**Why:** this is the one report where the weak and strong versions are dangerously far apart. The weak ticket closed a possible credential compromise in twenty minutes with a scan. The strong one records the timeline, because when a compromise happened, "when" decides which logs to pull and which sessions to invalidate. Notice it does not claim there is a virus either — it reports what happened and marks scope as unknown, which is honest.

**This one needs a security phase, not this one.** Record it fully, isolate the endpoint if you have authority, then escalate. Part 4's escalation structure applies exactly here.

#### Report 5 — "the printer won't print"

**The user says:** *"The printer won't print. I've tried everything."*

**Weak:** `Summary: printer issue. Resolution: reinstalled driver. Closed.`

**Strong:**

```text
Summary : Finance printer offline for 3 users since 08:00 — no output
Impact  : Department — three users, invoicing blocked before a 12:00 run.
Urgency : High — invoicing deadline at noon.
Category: Hardware (peripheral)
Service : HP LaserJet M428, queue FINANCE-PRINTER-01, print server PRT01
Repro   : 1. Print a one-page test from any of the three PCs.
          2. Job appears in the queue, status "Error — Printing".
          3. Nothing is produced; the printer panel shows "Ready".
Ruled out: Printer is powered, networked, and shows Ready on its own panel.
          Queue is not paused. A test page prints from the printer's own menu,
          so the hardware is functional.
```

**Why:** "tried everything" is not information, so the strong ticket supplies the tests instead. Look at which branch each test eliminates: the panel eliminates power, the queue state eliminates a paused spooler, and the printer's own self-test proves the hardware works. That third test is the one beginners never run, and it is the one that halves the problem.

#### Your turn

Rewrite each of these five reports yourself before reading the model answers. Then compare field by field.

1. *"The shared drive is gone. Everyone's freaking out."*
2. *"My laptop takes 20 minutes to start up in the morning."*
3. *"I can't log in to the VPN from home. It just spins."*
4. *"Outlook keeps asking for my password over and over."*
5. *"The website is down. Nobody can see it."*

- **Rewrite all five reports** into full ticket structure before checking the models.
- **Write a steps-to-reproduce list** for at least three of them.
- **Explain why each weak version was unactionable**, not merely that it was.

### Part 9 — Ticket lifecycle drill

Read the queue, decide the order, then check the answer key. Do not read ahead.

Every ticket is at `2026-03-04 09:00`. You are the only person on the desk. Work top to bottom only if you can defend it.

| # | Summary | Impact | Urgency | Priority | Status | Age |
|---|---|---|---|---|---|---|
| 1 | CEO's laptop will not power on | Enterprise | Critical | P1 | New | 5 min |
| 2 | Printer jam, third floor | Individual | Low | P4 | New | 3 days |
| 3 | Suspicious email, clicked link | Individual | Unknown | P2 | New | 20 min |
| 4 | Payroll system login failure | Enterprise | High | P1 | In Progress | 4 hours |
| 5 | New starter needs laptop | Individual | Medium | P4 | Pending | 6 days |
| 6 | Wi-Fi drops every 10 minutes | Department | High | P2 | Assigned | 2 hours |
| 7 | Monitor flickering at one desk | Individual | Low | P4 | Assigned | 5 days |
| 8 | Mailbox over quota, cannot send | Individual | Medium | P3 | New | 1 day |
| 9 | VPN down for all remote staff | Enterprise | Critical | P1 | In Progress | 40 min |
| 10 | Password reset for a leaver | Individual | Low | P4 | New | 9 days |

#### The order, and the reasoning

**1. #9 — VPN down for all remote staff.** It is already P1, already In Progress, and it blocks every remote worker. An outage affecting all remote staff outranks one VIP, because the VIP has alternatives and the remote staff do not.

**2. #1 — CEO's laptop will not power on.** P1, brand new, and the impact is a single person. High-urgency single-user tickets usually lose to service outages. This one is the exception in practice, not in theory: a CEO blocked at 09:00 generates pressure that reaches you regardless. Handle it honestly rather than pretending it is not urgent.

**3. #4 — Payroll system login failure.** P1, four hours old, and money is involved. Payroll is time-boxed: a bug on payday costs real trust. Four hours without progress on a P1 is the worst number on this board.

**4. #3 — Suspicious email, clicked link.** P2 with *unknown* impact. Unknown is not low. A credential compromise gets worse with every minute it is left alone, and the evidence is perishable. Where the queue allows, this goes before the cheerful P2 below it.

**5. #6 — Wi-Fi drops every 10 minutes.** P2, a whole department, two hours old. Real work is being lost in small increments, which nobody escalates because it is intermittent.

**6. #8 — Mailbox over quota, cannot send.** P3, one day old. Annoying, not blocking. A single command fixes it, so it takes ten minutes once the P1s are stable.

**7. #5 — New starter needs laptop.** P4, six days old. Someone new is working with no equipment, which is embarrassing for the company and cheap to fix. It has aged into visibility.

**8. #7 — Monitor flickering.** P4, five days. A workaround almost certainly exists, and it is a hardware swap.

**9. #2 — Printer jam.** P4, three days. A jam is physical, a person can walk over, and the workaround is the printer two floors down.

**10. #10 — Password reset for a leaver.** P4, nine days. This is a **security** item wearing a housekeeping costume. The oldest ticket on the board is not the most urgent; it is the one most likely to be a forgotten account.

#### The three traps in that queue

| Trap | The ticket | Why beginners fall in |
|---|---|---|
| Oldest-first is not a policy | #10 at 9 days | Age is a sorting tool, not a priority. A leaver account is a risk, not a queue position |
| "Unknown" gets read as "low" | #3 | Missing information is a reason to investigate, never a reason to deprioritise |
| The loudest person wins | #1 | VIP pressure is real. Say so and schedule around it instead of hiding it in a re-sort |

#### Now do it again, differently

Take the same ten tickets and reorder them for a team of **three** technicians instead of one. Then write one sentence per ticket explaining what changed.

- **Order all ten tickets** before reading the answer key.
- **Write a reason for each** of your top five positions.
- **Re-order for a three-person team** and explain what changed.
- **Spot the leaver ticket as a security item** without reading the trap table first.

### Part 10 — Remote support tooling, hands-on

Remote support is where a support technician's power is greatest, so the rules around it are strictest. Free tools cover every scenario you need to practise.

The four tools below are the free set worth knowing. Each is free for personal or small-scale use, and none requires a paid account to complete the exercises in this part.

| Tool | Purpose | Cost | URL | Task | Free alternative |
|---|---|---|---|---|---|
| RustDesk | Remote desktop control, self-hostable | Free (open source) | https://rustdesk.com/ | Screen-share between two of your own machines | AnyDesk free tier |
| AnyDesk | Remote desktop control | Freemium | https://anydesk.com/ | Install two copies you own and connect | RustDesk |
| Quick Assist | Built-in Windows screen sharing | Free (included) | https://learn.microsoft.com/windows/client-management/quick-assist | Assist a family member's PC | RustDesk |
| Google Meet | Screen sharing with audio, for teaching | Freemium | https://meet.google.com/ | Share your screen and narrate a fix | Jitsi Meet |
| mRemoteNG | One window for many saved RDP/SSH sessions | Free (open source) | https://mremoteng.org/ | Save three connections to your own lab | Windows RDP client |
| PuTTY | SSH and serial terminal | Free (open source) | https://www.putty.org/ | SSH into your own Linux VM | Windows OpenSSH client |

**Authorisation rule, and this is not a formality.** You may connect only to devices you own, or devices whose owner has given you explicit, recorded permission. Connecting to a machine you do not own or have not been asked to help with is unauthorised access, whatever your intention was. In this track, that means your own VMs, your own laptop, and a family member's PC *after they ask you to*.

#### What each tool can and cannot see

This is the part beginners underestimate. When you share a screen, you are not sharing a window. You are sharing whatever the operating system and the tool decide to include.

| Tool | Sees | Does **not** see | Security note |
|---|---|---|---|
| Quick Assist | Full desktop, with the user's explicit session code | Nothing if the user closes the window — sharing is user-initiated each time | The session code is a credential; never let it be posted publicly |
| RustDesk | Full desktop; file transfer and clipboard if enabled | Encrypted content that is not on screen | Self-hosting keeps session metadata on your own relay |
| AnyDesk | Full desktop, unattended access if configured | Screen content while the machine is locked | Unattended access is a permanent door — treat the password as an admin credential |
| Google Meet | The screen or window you select, plus audio | Other windows, if you share a single window rather than the desktop | "Share a tab" leaks browser notifications; "share a window" is safer |
| mRemoteNG | Everything you connect to — it holds saved credentials | Nothing; it is a client, not a guard | Its config file contains credentials. Encrypt it, and never commit it to Git |

Read the AnyDesk row twice. Unattended access is convenient and is also how a support tool becomes a backdoor. If you configure it during practice, remove it afterwards.

#### What to check before you screen-share

Run this list every single time. It takes fifteen seconds and it prevents the incidents people remember you for.

| Check | How | Why |
|---|---|---|
| Consent is explicit | Ask, and wait for a clear yes | "I'll connect now" is not consent; "yes, go ahead" is |
| The right machine | Confirm the hostname before connecting | Connecting to the wrong device is its own incident |
| Nothing sensitive on screen | Ask them to close banking, payroll, and personal tabs | You will see everything they can see |
| Notifications silenced | Windows: **Focus assist**; macOS: **Do Not Disturb** | A message preview on screen is a data leak you caused |
| Recording policy known | Ask your organisation, or decide as the owner | Recording without agreement is a breach of trust |
| The user stays present | They watch; you narrate | Silent remote control trains people to distrust IT |

That fourth row is the one that catches beginners. A desktop notification that pops up mid-session — a personal message, a one-time code, a password reset email — is now on a screen someone else controls, and you did not intend it.

#### What never goes on a shared screen

- **Password fields, and password managers mid-unlock.** Have the user type it themselves, or you type it without them watching.
- **MFA codes and recovery codes.** If you can see it, it is no longer a second factor.
- **Payroll, HR, medical, or legal documents.** Unrelated to the fix; close them first.
- **Other users' tickets or customer data.** If your ticketing system is open, minimise it.
- **Your own credentials, tokens, or browser profile.** Use a dedicated admin session.
- **Personal email and chat.** Share a single window instead of the whole desktop when you can.

#### Practise it properly, tonight

This exercise uses two machines you own. If you only have one laptop, use a virtual machine as the second — Part 5 of the operating systems phase set one up.

```powershell
# Before any session, record the basics in your ticket.
hostname
Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version
Get-LocalUser | Select-Object Name, Enabled, LastLogon
```

```text
Session log (paste into the ticket)
-----------------------------------
Tool            : Quick Assist
Host            : DESKTOP-8QK2M1
User present    : Yes, throughout
Consent given   : Yes, 09:14, verbal on call
Sensitive items : User closed webmail and banking tabs before connecting
Start / End     : 09:15 / 09:32
Actions         : Cleared stale credential for outlook.office.com;
                  restarted Outlook; user confirmed send/receive works.
Recording       : None (not permitted on personal devices)
```

That block is the evidence. When a session is later questioned, this is what shows you did it properly. Practise writing it every time, even for a five-minute fix on your own VM.

- **Connect only to a device you own**, with explicit consent recorded in the ticket.
- **Run the pre-share checklist** and silence notifications first.
- **Write a session log** with start, end, consent, and actions taken.
- **Explain what unattended access is**, and why leaving it enabled is a risk.

### Part 11 — Metric practice

Part 5 introduced the metrics. This part makes you compute them, because reading a number and producing one are different skills.

Here is one week of data from a fictional service desk. Everything you need is in the table.

| Ticket | Opened | First response | Resolved | Reopened | Status |
|---|---|---|---|---|---|
| INC-101 | Mon 09:00 | Mon 09:20 | Mon 09:45 | No | Closed |
| INC-102 | Mon 11:00 | Mon 11:10 | Mon 16:30 | Yes | Closed |
| INC-103 | Mon 14:00 | Mon 14:05 | — | No | In Progress |
| INC-104 | Tue 08:30 | Tue 09:30 | Tue 10:00 | No | Closed |
| INC-105 | Tue 10:00 | Tue 10:05 | Tue 10:15 | No | Closed |
| INC-106 | Wed 09:00 | Wed 09:15 | Wed 09:15 | No | Closed |
| INC-107 | Wed 13:00 | Wed 13:40 | Thu 11:00 | No | Closed |
| INC-108 | Thu 09:00 | Thu 09:10 | Thu 09:25 | Yes | Closed |
| INC-109 | Thu 15:00 | Thu 16:20 | Fri 09:30 | No | Closed |
| INC-110 | Fri 10:00 | — | — | No | New |

Grab a pen. Compute the five numbers below before reading further.

1. Mean first-response time, over the tickets that have a first response.
2. Mean time to resolve, over the closed tickets only.
3. Reopen rate, over the closed tickets only.
4. First contact resolution: assume it means first response and resolution within 15 minutes.
5. The number of tickets breaching a 4-hour first-response target.

#### The answers, with the arithmetic

**First-response gaps, in minutes:** 20, 10, 5, 60, 5, 15, 40, 10, 80. That is nine tickets with a response; INC-103 has no resolution yet but does have a response, and INC-110 has none at all.

Total = 20 + 10 + 5 + 60 + 5 + 15 + 40 + 10 + 80 = **245 minutes**. Mean = 245 ÷ 9 = **27.2 minutes**. Answer: **about 27 minutes**.

**Resolution times, in minutes:** INC-101 = 45, INC-102 = 330, INC-104 = 90, INC-105 = 15, INC-106 = 15, INC-107 = 1,320, INC-108 = 25, INC-109 = 1,110. Eight closed tickets; INC-103 and INC-110 are excluded.

Total = 45 + 330 + 90 + 15 + 15 + 1,320 + 25 + 1,110 = **2,950 minutes**. Mean = 2,950 ÷ 8 = **368.75 minutes**, which is about **6.1 hours**. Answer: **roughly 6 hours**.

**Reopen rate:** two reopens (INC-102, INC-108) out of eight closed = 2 ÷ 8 = **25%**.

**First contact resolution:** the definition here is *first response and resolution within 15 minutes of each other*. Measure the gap between the response and the resolution, not from the open time. INC-105 is 5 → 15, a 10-minute gap. INC-106 is 15 → 15, a zero-minute gap. INC-108 is 10 → 25, a 15-minute gap, which meets "within 15" exactly. INC-101 is 20 → 45, a 25-minute gap, so it fails. That gives **INC-105, INC-106, and INC-108** = 3 ÷ 8 = **38%**.

Watch the boundary case. INC-108 was open for 25 minutes, so a careless reading of "resolved within 15 minutes" rejects it. The definition says the *response-to-resolution* gap, and 15 minutes passes. State your definition in the report, because the same week of data yields 25% or 38% depending on which rule you chose.

**Breaches of the 4-hour first-response target:** INC-104 at 60 minutes is fine. INC-110 has no response at all and was opened Friday — it has breached by the end of the week. So **1 breach** (and it is the worst kind: a ticket nobody has touched).

#### What those numbers actually say

| Number | Value | What it tells you |
|---|---|---|
| Mean first response | ~27 min | Healthy. The mean is dragged up by two slow responses, not by a general problem |
| MTTR | ~6.1 hours | Misleading on its own — two tickets (INC-107, INC-109) carry most of it |
| Reopen rate | 25% | Bad. One in four closures did not hold |
| FCR | 38% | Middling, and definition-dependent — state the rule you used or the number means nothing |
| 4-hour breaches | 1 | INC-110 was never touched. That is a process failure, not a speed failure |

The four findings that matter, in order of severity:

1. **INC-110 had no first response at all.** Every other problem on this list is a tuning issue. This is a ticket that fell through a gap. The fix is a daily sweep of `Status = New`, which the dashboard formula in Part 7 gives you for free.
2. **The reopen rate is the real story.** INC-102 was resolved in 5.5 hours and came back. INC-108 was resolved in 25 minutes and came back. Neither was confirmed with the user. This is exactly the pattern Part 5 warned about: fast closes raise FCR while reopen rate rises underneath.
3. **MTTR is being carried by two tickets.** INC-107 (22 hours) and INC-109 (18.5 hours) together add 2,430 of the 2,950 minutes. Both span an overnight period, which a professional report would either exclude or explain. A single MTTR figure without that note is a number that misleads its own reader.
4. **The mean first-response figure hides a 80-minute outlier.** INC-109 took 80 minutes to get a response while the median is 15. Report medians alongside means, or one slow ticket makes a good week look average.

#### Your own numbers, next

Log your next ten tickets in the Part 7 sheet, with a `First Response` column. Then compute the same five numbers. Your sample will be tiny and that is fine; the arithmetic is the skill, and the honesty is the habit.

- **Compute all five metrics by hand** before checking the answers.
- **Recompute one of them with your own data** and compare the two.
- **Explain why MTTR alone is misleading**, using the two tickets that carry it.
- **Identify the untouched ticket** as the most serious finding on the board.

### Part 12 — "What did I miss?" drill

Read the closed ticket below and list everything wrong with it. Then check the answer key. There are at least eleven defects, and some are structural rather than cosmetic.

#### The ticket as it was closed

```text
Ticket   : INC-2088
Summary  : email
Opened   : 2026-02-17 14:02
Requester: j.anonymous
Status   : Closed
Priority : P3

Description:
  user says email doesnt work

Notes:
  - looked at it
  - reinstalled outlook
  - seems fine now
  - closing

Resolution: fixed
Closure   : (blank)
Resolved  : 2026-02-17 14:40
```

#### Write your list first

Give yourself three minutes. Write down every problem you can see, in your own words, before scrolling to the key.

#### The answer key

| # | Defect | Why it matters |
|---|---|---|
| 1 | Summary is `email` | Not searchable, not specific, and gives no symptom or name |
| 2 | Requester is `j.anonymous` | No real identity, so you cannot follow up or spot a pattern |
| 3 | Description copies the user verbatim | "doesnt work" is the symptom, not the diagnosis. No observed facts added |
| 4 | No impact recorded | Nothing says whether this was one user or the whole company |
| 5 | No urgency recorded | Priority `P3` was therefore guessed, not derived |
| 6 | No affected service | The reader cannot tell whether the fault was the mail server or one client |
| 7 | No steps to reproduce | The next person cannot confirm the fault ever existed |
| 8 | No failed diagnostic steps | The most valuable content in a ticket is missing entirely |
| 9 | "reinstalled outlook" is unverified | An extreme action with no reason recorded and no licence or profile check |
| 10 | "seems fine now" is not a confirmation | The *user* must confirm the fix, not the agent. This is the classic early close |
| 11 | Resolution says `fixed` | Repeats nothing. It cannot be searched, learned from, or audited |
| 12 | Closure note is blank | The user is told nothing, so they will reopen or call again |
| 13 | No root cause recorded | "Reinstalled and it worked" means the cause is still unknown and will return |
| 14 | No KB link or prevention note | The next identical ticket starts from zero, as Part 2 warned |
| 15 | Resolved 38 minutes after opening | Fast, and meaningless — the metric is being improved by closing early |

Fifteen. If you found eleven, you have the practical defects; the last four are the process ones that separate a ticket-taker from a technician.

#### The rewritten ticket

```text
Ticket   : INC-2088
Summary  : Outlook cannot open — crash on launch after Feb update (J. Donnelly)
Impact   : Individual — one user. Webmail unaffected; no other users reporting.
Urgency  : Medium — user can work in webmail as a temporary workaround.
Category : Email (client)
Service  : Microsoft 365 Outlook desktop, Windows 11, version 2401 build 17231
Repro    : 1. Launch Outlook from Start. 2. Splash screen appears.
           3. Application closes with no error. 4. Event Viewer shows
           Application Error, faulting module olmapi32.dll, event ID 1000.

Steps tried:
  - Verified webmail login — SUCCESS. Account healthy, fault is client-side.
  - Launched Outlook in safe mode (outlook.exe /safe) — still crashes. So the
    fault is not an add-in.
  - Checked Event Viewer — faulting module olmapi32.dll, timestamped 14:09.
  - Compared build number with a working PC — update KB5034441 installed
    here on 2026-02-16, not on the working machine. [Cause identified.]
  - Repaired the Office installation (Settings > Apps > Microsoft 365 >
    Modify > Quick Repair) — no change.
  - Rolled back KB5034441 — Outlook launched normally.

Resolution: Rolled back Windows update KB5034441, which was installed the day
            before the fault began and was present only on the affected PC.
            Confirmed with the user by phone at 15:26.

Closure  : Hi Jane — Outlook was crashing because of a Windows update from
           Tuesday that Outlook did not get along with. We removed it, and
           Outlook is working again. Please keep using it normally and let us
           know if it reappears. We will reinstall the update once Microsoft
           ships a fix.

Prevention: KB article "Outlook crash on launch after KB5034441" written.
            Patch team notified so the update is not redeployed to this group.

Verified : User confirmed by phone, 15:26. Ticket parked for 48 hours before
           final closure rather than closed immediately.
```

Compare the two closures side by side. The weak one saved thirty minutes. The strong one saved the next technician an hour, told the user what happened, and stopped the same update from breaking the whole group.

- **List the defects before reading the answer key**, aiming for at least eleven.
- **Rewrite the ticket** with a real summary, impact, and steps tried.
- **Write a closure note in plain language** for the user, not the database.
- **Name three defects that are process problems**, not typing problems.

### Part 13 — Guided build: your first week as a solo desk

This is the consolidation exercise. You are the only support person for a fictional twenty-person company. Nothing here needs software you do not already have.

#### The setup

| Item | Value |
|---|---|
| Company | Mabini Trading, 20 staff, one office, hybrid Fridays |
| Systems | Microsoft 365, one file server `FS01`, one printer, 20 laptops |
| Your tools | The Part 7 sheet, Quick Assist, Bitwarden or KeePassXC |
| Your authority | You own the workbook and the lab. You do not have production access |
| Time budget | Four hours, split over two sittings |

#### The week's incoming work

Log every one of these as a ticket in your sheet. Fill every column. Then triage all fifteen using the Part 7 priority grid.

1. *"Laptop won't turn on, it's dead."* — Sales, Monday 08:40.
2. *"Can't access the shared drive from home."* — Sales, Monday 09:10.
3. *"Printer is out of toner again."* — Finance, Monday 10:00.
4. *"Outlook asks for my password every hour."* — Ops, Monday 13:20.
5. *"New starter begins Monday, needs a laptop and email."* — HR, Tuesday 09:00.
6. *"Suspicious email from 'the CEO' asking for gift cards."* — Finance, Tuesday 09:30.
7. *"Wi-Fi is slow in the meeting room."* — Ops, Tuesday 11:00.
8. *"I'm locked out, too many wrong passwords."* — Sales, Tuesday 14:15.
9. *"Excel file corrupted, can you restore yesterday's version."* — Finance, Wednesday 08:50.
10. *"VPN client says 'authentication failed' but my password is right."* — Ops, Wednesday 10:30.
11. *"Monitor has a line down the middle."* — HR, Wednesday 15:00.
12. *"Can you install the design software we discussed?"* — Sales, Thursday 09:00.
13. *"Email to a client bounced back."* — Sales, Thursday 11:20.
14. *"Teams call audio is crackly."* — Ops, Thursday 14:00.
15. *"I'm leaving Friday, what happens to my accounts?"* — Finance, Friday 09:00.

#### The triage model answer

| # | Priority | Category | Reasoning |
|---|---|---|---|
| 1 | P1 | Hardware | A user cannot work at all. Swap the device the same morning |
| 2 | P2 | Network | One user, but shared documents are blocked. Check VPN first, then share permissions |
| 3 | P4 | Hardware | Consumable, not a fault. Log it, order it, close it |
| 4 | P2 | Email | Recurring password prompts point at a stale credential — the Part 6 pattern |
| 5 | P3 | Service request | Scheduled work with a known date. Needs a change request, not urgency |
| 6 | P2 | Security | Possible phishing and possible fraud — Individual + Critical, which is as high as a single-user ticket goes. Work it before anything else on this list |
| 7 | P3 | Network | Intermittent and location-specific. Measure before acting |
| 8 | P2 | Account | User cannot work. Lockout may be caused by item 4's stale credential |
| 9 | P2 | Software | Data loss risk. Check the volume shadow copy before anything else |
| 10 | P2 | Network | Same root cause as item 4 — a stored credential after a password change |
| 11 | P4 | Hardware | Cosmetic or a failing panel. Book a swap |
| 12 | P3 | Service request | Needs approval, a licence check, and a rollback plan. This is a change |
| 13 | P3 | Email | One message, one recipient. Send logs first, then decide |
| 14 | P3 | Network | Intermittent audio is usually the network or the headset. Test the cheap thing first |
| 15 | P2 | Account | Offboarding is a security task with a deadline. Raise the checklist today |

#### The three things this week is really testing

**Items 4, 8, and 10 are one problem.** Recurring password prompts, a lockout, and VPN authentication failure after a password change are the same stored-credential fault from three angles. Spotting that is the single highest-value observation available this week, and it is exactly what Part 6 described. Link them to one problem record.

**Item 6 is not a P3 because it was unsuccessful.** A gift-card phishing attempt that reached a finance mailbox means someone is targeting you, and the sender may have mailed other staff. Containment is the priority, not the fact that nobody clicked.

**Items 5, 12, and 15 are not incidents.** They are service requests and changes. Logging them as incidents inflates your incident count and hides the real queue. This distinction is the first thing Part 1 taught, and it is the most common beginner error in triage.

#### What to produce

Write this up as `portfolio/it/06-tools-and-ticketing.md`. Include the fifteen logged tickets, the triage table, the linked problem record for items 4, 8, and 10, and one change request for item 12.

- **Log all fifteen requests** with every column filled in your sheet.
- **Assign a priority to each** and be able to justify every one.
- **Link items 4, 8, and 10** into a single problem record.
- **Write the change request for item 12**, with approval and rollback steps.
- **Write the offboarding checklist** for item 15.

### Part 14 — Key takeaways

- **Tools encode process.** A ticketing system is a model of how work flows, not a complaint database.
- **Incident = symptom; problem = cause.** Repeating incidents are a signal to investigate, not to keep closing.
- **Impact and urgency are different inputs** to priority. "It's urgent" is not enough information.
- A good ticket contains **failed diagnostic steps**, because those tell the next technician what they can skip.
- **Templates scale quality.** Build the five, copy them forever.
- **Never ask for a password, and always get consent before a remote session.** These two rules define a trustworthy support technician.
- **Inventory needs a warranty date**, because age changes the repair decision.
- **A runbook without "known false positives"** will be ignored within a month.
- Support workflow is a loop: **escalation out, reopen back in.**
- Read an alert for **four things**: which host, what was measured, how far past the threshold, and when it fired. The time tells you whether it is an emergency or tomorrow's first task.
- A runbook's **known false positives** are what stop you investigating the same non-event weekly — check them before you investigate.
- **Identify before you delete.** Clearing 18 GB of identifiable daily temp files is routine; the same action on unfamiliar files is destructive.
- A fix that does not address the **recurrence** is about four days of headroom, not a resolution.
- **Almost every support metric can be gamed** by making work look better rather than doing it better. Read reopen rate alongside FCR and MTTR, because it is the honesty check.
- When you have fixed **the same thing for the same person twice**, stop closing and start linking tickets. That is the moment an incident becomes a problem.

### Part 15 — Practice this next

The tasks below produce five artefacts, and each one is interview evidence. Build the workflow diagram with the escalation and reopen arrows included. Populate the inventory with ten fictional devices. Write the five templates *and use one on a real problem you have* — that is the only way to find out whether your diagnostic questions are the right ones. Then write your one runbook, and finish with the change request template for "install software for user", because it forces you to think about approval, licence, and rollback.

Then extend that work:

1. **Write your runbook with a real threshold and a real false positive.** Pick an alert you can actually observe on your own machine — low disk, high CPU, a service that stops. Give it a specific threshold, a first-check list, an escalation line, and at least one known false positive you have genuinely seen. A runbook with no false positives is untested.
2. **Trigger your own alert deliberately.** Fill a volume, or stop a service you do not need. Watch the alert fire, then follow your runbook exactly as written. Where you had to improvise is where the runbook is incomplete — rewrite those steps.
3. **Produce evidence for one machine the way Part 5 does.** Capture `Get-PSDrive`, a largest-directory scan, and timestamps on the biggest files. Write the "what this shows" paragraph. This is the portfolio artefact: it demonstrates that you read evidence rather than guessing.
4. **Reconstruct the eleven-ticket pattern from Part 6 with your own numbers.** Invent a recurring ticket that appears across three weeks and write the query or search that would reveal the pattern. Then write the problem record that links them.
5. **Take the metrics table and argue against yourself.** Pick one metric and describe precisely how you could improve it without improving support. Being able to explain the gaming of a metric is what shows you understand it.
6. **Write the escalation note from Part 4's structure** — reported, tried, ruled out, hypothesis, impact and urgency, how to reach the user — for a problem you cannot fix, and keep it under 150 words. Brevity here is a real skill.
7. **Build your ten-device inventory with a warranty date and a patch group** for each device, then answer this question from the sheet alone: which two devices would you replace first next quarter, and why? If the sheet cannot answer it, the sheet is missing a field.
8. **Write one KB article from a ticket you have already closed.** The test is whether someone else could follow it without asking you a question. If they could not, the article is a note, not a KB article.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Jira Service Management | Enterprise ITSM/ticketing | Freemium/paid | https://www.atlassian.com/software/jira/service-management | Read docs and create sample workflow if free tier available | osTicket |
| Zendesk | Customer support/ticketing | Paid/trial | https://www.zendesk.com/ | Study ticket fields from docs | osTicket/Spiceworks |
| Freshdesk | Helpdesk/ticketing | Freemium/paid | https://www.freshworks.com/freshdesk/ | Create sample support portal if free tier available | osTicket |
| ServiceNow | Enterprise ITSM | Paid | https://www.servicenow.com/ | Read ITSM glossary and watch demo | Jira free docs/osTicket |
| Snipe-IT | Asset management | Free self-hosted/paid hosted | https://snipeitapp.com/ | Create 5 fake assets | Google Sheets inventory |
| Bitwarden | Password manager | Freemium | https://bitwarden.com/ | Create vault entries for lab accounts | KeePassXC |
| Zabbix | Monitoring | Free/open-source | https://www.zabbix.com/ | Read docs or monitor local host | Uptime Kuma |

## Free/cheap resources

- Atlassian ITSM guide — https://www.atlassian.com/itsm
- ServiceNow ITSM page — https://www.servicenow.com/products/itsm.html
- Snipe-IT documentation — https://snipe-it.readme.io/
- Bitwarden learning center — https://bitwarden.com/learning/
- Zabbix documentation — https://www.zabbix.com/documentation/current/en/manual

## Hands-on practice tasks

1. Create a mini ITSM workflow diagram: request -> triage -> troubleshoot -> resolve -> close. <!-- id: it-06-t01 band: quick energy: low -->
2. Build a fake asset inventory with 10 devices in Snipe-IT or Google Sheets. <!-- id: it-06-t02 band: focused energy: normal -->
3. Create a password vault for lab-only accounts using Bitwarden or KeePassXC. <!-- id: it-06-t03 band: quick energy: low -->
4. Create 5 ticket templates: password reset, VPN issue, printer issue, no internet, suspicious email. <!-- id: it-06-t04 band: focused energy: normal -->
5. Create a change request template for “install software for user.” <!-- id: it-06-t05 band: quick energy: low -->
6. Create a monitoring alert response runbook for “website down” or “router unreachable.” <!-- id: it-06-t06 band: focused energy: normal -->
7. Build the four-tab ticket queue from Part 7 and log five real tickets in it. <!-- id: it-06-t07 band: focused energy: normal -->
8. Rewrite the five vague reports in Part 8 into structured tickets, then compare with the models. <!-- id: it-06-t08 band: focused energy: normal -->
9. Work the ten-ticket lifecycle drill in Part 9 and justify your ordering in writing. <!-- id: it-06-t09 band: focused energy: normal -->
10. Run one remote session on a device you own and write the session log. <!-- id: it-06-t10 band: focused energy: normal -->
11. Compute the five metrics in Part 11 by hand, then recompute with your own ticket data. <!-- id: it-06-t11 band: focused energy: normal -->
12. Complete the “what did I miss?” drill in Part 12 and produce the rewritten ticket. <!-- id: it-06-t12 band: focused energy: normal -->
13. Triage the fifteen requests in Part 13 and link the three related tickets into one problem record. <!-- id: it-06-t13 band: deep energy: high -->

## Deliverable / proof of work

Create `portfolio/it/06-tools-and-ticketing.md` with:

- ITSM workflow diagram
- 10-row asset inventory
- 5 ticket templates
- 1 change request template
- 1 monitoring alert runbook
- Ticket queue workbook with a working dashboard
- Five structured tickets rewritten from the Part 8 reports
- The Part 12 rewritten ticket with its defect list
- The Part 13 fifteen-ticket triage table and linked problem record

## Quiz

Fourteen questions on the material in this phase. Each has one correct answer and a short explanation — read the explanation even when you get it right, because it usually names the mistake the wrong answers represent.

Two of these use the fictional week of ticket data from Part 11, on tickets other than the ones worked there. The arithmetic is the same; recognising which tickets belong in the denominator is the part people get wrong.

### Q1. What is the difference between an incident and a problem? <!-- id: it-06-q01 energy: normal -->

- [ ] An incident is urgent; a problem is not
- [x] An incident is a symptom; a problem is the underlying cause
- [ ] An incident affects one user; a problem affects many
- [ ] An incident is unplanned; a problem is scheduled

**Why:** You fix incidents and investigate problems. The phase's practical signal is repetition: when the same incident keeps reappearing, stop closing tickets and start asking why. Severity and user count are impact, which is a different axis.

### Q2. A user says "this is urgent!" What does a support team still need to know? <!-- id: it-06-q02 energy: normal -->

- [ ] How long the problem has existed
- [ ] Whether they have tried restarting
- [x] Whether it affects one person or the whole company
- [ ] Which operating system they are running

**Why:** Urgency and impact are separate inputs and priority comes from both. "Urgent" tells you how quickly it needs attention and nothing about scope — and the team cannot set a priority without knowing whether "it" is one person or the entire company.

### Q3. Which part of a ticket does the phase call the most valuable, and almost nobody records? <!-- id: it-06-q03 energy: normal -->

- [x] The diagnostic steps that failed
- [ ] The closure note sent to the user
- [ ] The resolution steps that worked
- [ ] The user's original description

**Why:** If you flushed DNS and it did not help, that fact saves the next technician ten minutes of trying it again. Failed steps narrow the search for whoever picks the ticket up next, and they are routinely left out because they feel like evidence of wasted effort.

### Q4. What is a service request? <!-- id: it-06-q04 energy: low -->

- [ ] Something broken that needs restoring now
- [x] A standard, pre-approved ask
- [ ] The underlying cause of repeated incidents
- [ ] A deliberate change with a rollback plan

**Why:** "Add me to the Sales group" is a service request — routine, pre-approved, no incident behind it. A broken thing needing restoration is an incident; a cause behind repeated incidents is a problem; a modification with approval and rollback is a change.

### Q5. Which summary line would a search actually match, months later? <!-- id: it-06-q05 energy: normal -->

- [ ] "Help!!!"
- [ ] "Email broken"
- [ ] "User called, fixed it"
- [x] "Outlook stuck connecting after password change — J. Donnelly"

**Why:** A summary is a subject line a search would match, so it names the symptom, the trigger, and the user. "Email broken" is not searchable and not specific; "fixed it" belongs in the resolution field, not the summary.

### Q6. Why do templates matter more than writing one perfect ticket? <!-- id: it-06-q06 energy: normal -->

- [ ] They are required by most ticketing systems
- [ ] They make tickets shorter to read
- [x] They turn a good day's work into every day's work
- [ ] They remove the need for a knowledge base

**Why:** Nobody writes that carefully when they are busy — which is why the phase asks for five templates with the diagnostic questions already in place. The suspicious-email template is the clearest case: working its list takes thirty seconds and catches the user who clicked and did not mention it.

### Q7. In the Part 11 week, what is the reopen rate? <!-- id: it-06-q07 energy: normal -->

- [ ] 2 ÷ 10 = 20%
- [ ] 2 ÷ 9 = 22%
- [x] 2 ÷ 8 = 25%
- [ ] 3 ÷ 8 = 38%

**Why:** Two tickets were reopened (INC-102 and INC-108), and the denominator is the **eight closed** tickets — INC-103 is still in progress and INC-110 was never touched, so neither can have been reopened. A denominator of 10 quietly counts tickets that were never closed.

### Q8. In that same week, why is the mean time to resolve a misleading figure? <!-- id: it-06-q08 energy: high -->

- [ ] Because it excludes the tickets that were never closed
- [ ] Because the sample of eight tickets is too small to mean anything
- [x] Because two tickets carry most of it, and both span an overnight period
- [ ] Because it is measured from the first response rather than from the open time

**Why:** INC-107 and INC-109 together add 2,430 of the 2,950 minutes. Both span an overnight period that a professional report would exclude or explain — so one MTTR figure with no note misleads its own reader. Excluding unclosed tickets is correct, not the flaw.

### Q9. Tickets INC-101, INC-105 and INC-106 all have a first response of 5–20 minutes and were resolved in 45, 15 and 15 minutes. Under the phase's definition, which count as first-contact resolutions? <!-- id: it-06-q09 energy: high -->

- [x] INC-105 and INC-106, because the response-to-resolution gap is 10 and 0 minutes
- [ ] All three — they were all handled the same day
- [ ] Only INC-105, because 15 minutes is the fastest
- [ ] None — first contact resolution requires a single interaction

**Why:** The definition measures the gap between the *response* and the *resolution*, not from the open time. INC-101's gap is 20 → 45, which is 25 minutes, so it fails. State your definition in any report, because the same week yields 25% or 38% depending on the rule chosen.

### Q10. Which is the single most serious finding in the Part 11 week? <!-- id: it-06-q10 energy: high -->

- [ ] The 25% reopen rate
- [ ] The 6.1-hour mean time to resolve
- [x] INC-110 had no first response at all
- [ ] The 80-minute outlier on INC-109

**Why:** Every other problem on that board is a tuning issue. INC-110 is a ticket nobody touched — a process failure, not a speed failure — and the fix is a daily sweep of `Status = New`. A high reopen rate is bad, but it is a pattern you can work on; an untouched ticket may never be seen again.

### Q11. What does an asset record describe? <!-- id: it-06-q11 energy: low -->

- [ ] A documented solution to a known issue
- [ ] A deliberate modification awaiting approval
- [ ] The cause behind a group of related incidents
- [x] A managed thing — laptop, phone, licence, printer

**Why:** "Dell Latitude 5540, asset tag IT-0412" is an asset. The documented solution is the knowledge base, the modification awaiting approval is a change, and the shared cause is a problem.

### Q12. A dashboard shows fast closes and rising first-contact resolution. What does the phase warn you to check alongside it? <!-- id: it-06-q12 energy: high -->

- [ ] The mean first-response time
- [x] The reopen rate
- [ ] The number of open tickets
- [ ] The asset inventory count

**Why:** Speed metrics can be improved by closing tickets before the fix has actually held — which is exactly what the 25% reopen rate in that week shows. Chasing FCR without watching reopens is how a desk looks fast and leaves users still broken.

### Q13. What is the practical signal that an incident should become a problem record? <!-- id: it-06-q13 energy: normal -->

- [x] The same incident keeps reappearing
- [ ] The user asks for it to be escalated
- [ ] The ticket breaches its service target
- [ ] More than one technician has touched it

**Why:** Repetition is the signal to stop closing tickets and start asking why. A single incident, however slow or however many people touched it, does not by itself indicate an underlying cause worth investigating.

### Q14. In the Part 11 week, why does INC-109 not count toward the 4-hour breach figure, while INC-110 does? <!-- id: it-06-q14 energy: high -->

- [x] INC-109's 80-minute response is inside 4 hours; INC-110 has no response at all
- [ ] INC-109 was resolved, so it cannot breach
- [ ] INC-109 had a fast response, and INC-110 had none
- [ ] Both breach, and the phase's answer of one is an error

**Why:** The target is a 4-hour *first response*, and 80 minutes is well inside it — the 80-minute figure is an outlier worth noting, not a breach. INC-110 was opened Friday and never answered, so it has breached by the end of the week. Being resolved has nothing to do with a response target.

## Checklist

- [ ] I understand incident, request, problem, change, asset, and KB. <!-- id: it-06-c01 energy: low -->
- [ ] I compared Jira, Zendesk, Freshdesk, ServiceNow, and osTicket. <!-- id: it-06-c02 energy: normal -->
- [ ] I created an asset inventory. <!-- id: it-06-c03 energy: normal -->
- [ ] I created ticket templates. <!-- id: it-06-c04 energy: normal -->
- [ ] I created a change request template. <!-- id: it-06-c05 energy: normal -->
- [ ] I created a monitoring alert runbook. <!-- id: it-06-c06 energy: normal -->
- [ ] I understand safe remote support behavior. <!-- id: it-06-c07 energy: low -->
- [ ] I built a working ticket queue with derived priority and a live dashboard. <!-- id: it-06-c08 energy: high -->
- [ ] I rewrote five vague user reports into structured tickets. <!-- id: it-06-c09 energy: normal -->
- [ ] I completed the ten-ticket lifecycle drill and justified my ordering. <!-- id: it-06-c10 energy: normal -->
- [ ] I ran a remote session on a device I own, with consent and a session log. <!-- id: it-06-c11 energy: normal -->
- [ ] I computed first-response time, MTTR, reopen rate, and FCR by hand. <!-- id: it-06-c12 energy: normal -->
- [ ] I completed the "what did I miss?" drill and rewrote the closed ticket. <!-- id: it-06-c13 energy: normal -->
- [ ] I triaged the fifteen-request solo-desk week into a portfolio write-up. <!-- id: it-06-c14 energy: high -->

## You're ready to move on when...

You can explain how a ticket moves through a support team and show sample tickets that look professional.

## Free vs Paid

### What's free and enough

osTicket, Spiceworks, Snipe-IT self-hosted, Bitwarden free, KeePassXC, Uptime Kuma, and Google Sheets are enough.

### What's paid and why you'd upgrade

Enterprise teams pay for ServiceNow, Zendesk, Freshdesk, Jira, hosted Snipe-IT, and RMM suites because they need automation, SLAs, reporting, compliance, and integrations.

### When it's worth paying

Do not pay. Learn the concepts and free alternatives.
