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

A file appearing every day at about 01:00, roughly 5 GB each, never deleted. That is not a Windows problem — something is running a nightly job that writes a dump and fails to clean up after itself. The dates line up with the alert: thirteen days of dumps is roughly 18 GB.

#### What you do, and what you do not

You have found the cause quickly and safely. Now the temptation is to delete the files, close the ticket, and move on. Resist three parts of that:

- **Do not just delete and close.** Something creates these files nightly. Deleting them buys about four days and the alert returns — and now nobody remembers why. The ticket should be linked to a *problem* record so the nightly job gets fixed.
- **Do not delete files you cannot identify.** These are identifiable (name, daily schedule, size, timestamp) and clearly disposable, so clearing them is reasonable. If they had been unfamiliar database files, the same action would have been destructive. Identify first, delete second.
- **Do not skip the recording step.** Volume, growth rate, largest directories, what you cleared, and the pattern you found. That note is what lets the next person (or you in six months) solve the recurrence in two minutes instead of twenty.

#### The ticket note this produces

> **Alert:** Disk space low on FS01, `C:` at 8.2% free (3.9 GB of 47.6 GB), 02:17 UTC.
> **Investigated:** `Get-PSDrive` confirmed only `C:` affected; `D:` has 255.6 GB free, so the data volume is healthy and this is not user-data growth. Largest-directory scan showed `C:\Windows\Temp` at 18.41 GB, of which the largest files were `sql_dump_*.tmp` dated daily from 2026-03-01, ~5 GB each. Backup log checked first per runbook known-false-positive — no backup events, so the false positive was eliminated rather than assumed.
> **Cause:** A nightly job outside the service desk's ownership is writing ~5 GB of temporary dump files to `C:\Windows\Temp` and never removing them. Thirteen days of accumulation took the volume to the alert threshold.
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

The pattern in the right-hand column is the real lesson: **almost every support metric can be improved by making the work look better rather than by doing it better.** Closing tickets without confirming the fix raises FCR and lowers MTTR, while reopen rate quietly rises. This is why mature teams report these together rather than one at a time. When you are asked in an interview how you would measure your own performance, saying "I would look at reopen rate as well, because it is the check on the other numbers" signals that you understand the system rather than just the tool.

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
Get-ADUser -Filter "SamAccountName -eq 'areyes'" -Properties MemberOf, PasswordLastSet, pwdLastSet |
  Select-Object Name, PasswordLastSet, @{n="Groups";e={$_.MemberOf -join "; "}}
```

```text
Name       PasswordLastSet      Groups
----       ---------------      ------
A. Reyes   2026-03-01 09:12:04  CN=Sales,OU=Manila,DC=company,DC=local; CN=VPN-Users,...
```

`PasswordLastSet` is recent — the user *did* change it. So the reset is working and something is expiring it again.

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

**Now the cause is visible.** Somewhere in this organisation there is a scheduled task, a script, or a service account using a *stored* credential for these users — most likely the VPN client profile or a mapped drive with saved credentials. When the password expires and is changed, the stored credential still holds the old one. It retries, fails, and in environments with a lockout policy it can lock the account. Meanwhile the user's password is fine, so the ticket gets closed as "reset password, user working" — and then it recurs.

That is why A. Reyes appears three times. Each reset fixed the symptom. None of them found the stored credential.

**The actual fix** is to find the stale credential: check the VPN client's saved profile, the Windows Credential Manager, and any scheduled task running as that user. Then the *problem* record says: "Stored credentials in VPN client profiles are not updated on password change. Affects users with saved VPN profiles. Fix: document the update step in the password-change KB, and update the VPN client's saved credential as part of the reset procedure."

**Why this is the most valuable ticket in the phase.** Eleven fast resolutions look like excellent performance on every metric in the table above — low MTTR, high FCR, good CSAT because each user got a quick fix. The only number that tells the truth is the recurring pattern, which no single ticket shows.

**The habit to take away:** when you notice you have fixed the same thing for the same person, or the same team, more than twice, stop closing and start linking. That is the moment an incident becomes a problem, and noticing it is what separates a ticket-taker from a support engineer.

### Part 7 — Key takeaways

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

### Part 8 — Practice this next

The tasks below produce five artefacts, and each one is interview evidence. Build the workflow diagram with the escalation and reopen arrows included. Populate the inventory with ten fictional devices. Write the five templates *and use one on a real problem you have* — that is the only way to find out whether your diagnostic questions are the right ones. Then write your one runbook, and finish with the change request template for "install software for user", because it forces you to think about approval, licence, and rollback.

Then extend that work:

1. **Write your runbook with a real threshold and a real false positive.** Pick an alert you can actually observe on your own machine — low disk, high CPU, a service that stops. Give it a specific threshold, a first-check list, an escalation line, and at least one known false positive you have genuinely seen. A runbook with no false positives is untested.
2. **Trigger your own alert deliberately.** Fill a volume, or stop a service you do not need. Watch the alert fire, then follow your runbook exactly as written. Where you had to improvise is where the runbook is incomplete — rewrite those steps.
3. **Produce evidence for one machine the way Part 5 does.** Capture `Get-PSDrive`, a largest-directory scan, and timestamps on the biggest files. Write the "what this shows" paragraph. This is the portfolio artefact: it demonstrates that you read evidence rather than guessing.
4. **Reconstruct the eleven-ticket pattern from Part 6 with your own numbers.** Invent a recurring ticket that appears across three weeks and write the query or search that would reveal the pattern. Then write the problem record that links them.
5. **Take the metrics table and argue against yourself.** Pick one metric and describe precisely how you could improve it without improving support. Being able to explain the gaming of a metric is what shows you understand it.
6. **Write the escalation note from Part 5's structure** — reported, tried, ruled out, hypothesis, impact and urgency, how to reach the user — for a problem you cannot fix, and keep it under 150 words. Brevity here is a real skill.
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

1. Create a mini ITSM workflow diagram: request -> triage -> troubleshoot -> resolve -> close.
2. Build a fake asset inventory with 10 devices in Snipe-IT or Google Sheets.
3. Create a password vault for lab-only accounts using Bitwarden or KeePassXC.
4. Create 5 ticket templates: password reset, VPN issue, printer issue, no internet, suspicious email.
5. Create a change request template for “install software for user.”
6. Create a monitoring alert response runbook for “website down” or “router unreachable.”

## Deliverable / proof of work

Create `portfolio/it/06-tools-and-ticketing.md` with:

- ITSM workflow diagram
- 10-row asset inventory
- 5 ticket templates
- 1 change request template
- 1 monitoring alert runbook

## Checklist

- [ ] I understand incident, request, problem, change, asset, and KB. <!-- id: it-06-c01 energy: low -->
- [ ] I compared Jira, Zendesk, Freshdesk, ServiceNow, and osTicket. <!-- id: it-06-c02 energy: normal -->
- [ ] I created an asset inventory. <!-- id: it-06-c03 energy: normal -->
- [ ] I created ticket templates. <!-- id: it-06-c04 energy: normal -->
- [ ] I created a change request template. <!-- id: it-06-c05 energy: normal -->
- [ ] I created a monitoring alert runbook. <!-- id: it-06-c06 energy: normal -->
- [ ] I understand safe remote support behavior. <!-- id: it-06-c07 energy: low -->

## You're ready to move on when...

You can explain how a ticket moves through a support team and show sample tickets that look professional.

## Free vs Paid

### What's free and enough

osTicket, Spiceworks, Snipe-IT self-hosted, Bitwarden free, KeePassXC, Uptime Kuma, and Google Sheets are enough.

### What's paid and why you'd upgrade

Enterprise teams pay for ServiceNow, Zendesk, Freshdesk, Jira, hosted Snipe-IT, and RMM suites because they need automation, SLAs, reporting, compliance, and integrations.

### When it's worth paying

Do not pay. Learn the concepts and free alternatives.
