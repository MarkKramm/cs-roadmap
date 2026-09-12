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

### Key takeaways

- **Tools encode process.** A ticketing system is a model of how work flows, not a complaint database.
- **Incident = symptom; problem = cause.** Repeating incidents are a signal to investigate, not to keep closing.
- **Impact and urgency are different inputs** to priority. "It's urgent" is not enough information.
- A good ticket contains **failed diagnostic steps**, because those tell the next technician what they can skip.
- **Templates scale quality.** Build the five, copy them forever.
- **Never ask for a password, and always get consent before a remote session.** These two rules define a trustworthy support technician.
- **Inventory needs a warranty date**, because age changes the repair decision.
- **A runbook without "known false positives"** will be ignored within a month.
- Support workflow is a loop: **escalation out, reopen back in.**

### Practice this next

The tasks below produce five artefacts, and each one is interview evidence. Build the workflow diagram with the escalation and reopen arrows included. Populate the inventory with ten fictional devices. Write the five templates *and use one on a real problem you have* — that is the only way to find out whether your diagnostic questions are the right ones. Then write your one runbook, and finish with the change request template for "install software for user", because it forces you to think about approval, licence, and rollback.

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
