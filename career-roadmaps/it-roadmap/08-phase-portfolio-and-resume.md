---
id: it-08-portfolio-and-resume
track: it
phase: 8
order: 80
title: "Phase 8 — Portfolio and Resume"
duration: "2 weeks"
duration_weeks: 2
energy_mix: [low, normal]
deliverable: ""
exit_criteria: "A stranger can open your portfolio and understand what you practiced, what tools you used, and what role you want."
---

# Phase 8 — Portfolio and Resume

## Goal of this phase

Turn your learning into proof that a hiring manager can understand in under 5 minutes.

## Estimated time

**2 weeks**, then update weekly while applying.

## Skills you'll gain

- Build a simple IT portfolio using GitHub, Google Drive, or Notion.
- Write entry-level resume bullets without fake experience.
- Present home labs professionally.
- Create a LinkedIn profile targeted at remote IT roles.
- Explain your no-degree/self-taught path confidently.

## Portfolio structure

Use GitHub if you are comfortable. If not, use Google Drive first and migrate later.

Recommended folders:

```text
entry-level-it-portfolio/
├── README.md
├── troubleshooting-writeups/
├── networking/
├── windows-linux/
├── ticketing-samples/
├── scripts/
└── resume/
```

## Resume sections

- Name, location: Philippines, remote-ready
- Email, LinkedIn, GitHub/portfolio
- Summary: 2–3 lines
- Skills: Windows, Linux, networking, ticketing, remote support, documentation
- Projects: 3–5 lab projects
- Experience: any work/freelance/customer service/personal projects; be honest
- Education/certs: self-study, courses completed; no fake certs

## Lesson: Portfolio and Resume

### Why this lesson exists

Every phase before this one produced evidence. This phase turns that evidence into something a stranger can evaluate in five minutes — and that is a completely different skill from doing the work.

The uncomfortable truth about entry-level hiring: **a hiring manager reads your resume for about thirty seconds, and they are not really reading.** They are scanning for signals. Can this person do the job? Are they honest about what they can do? Will they be a problem to manage? That is the entire evaluation. Your job in this phase is to make those three answers obvious at a glance.

The phase exit criterion is exactly right, and worth repeating as the design principle for everything you build here: **"A stranger can open your portfolio and understand what you practiced, what tools you used, and what role you want."** Notice that it does not say "is impressed". It says "understands". Comprehension beats impressiveness, every time.

**Time to complete:** roughly 12 hours across two weeks, then a light weekly update while you apply. Most of the work is assembly rather than creation — the artefacts already exist from Phases 1 to 7. You are packaging, not building from nothing.

**The good news about your position.** You have no experience to exaggerate, which removes the temptation that ruins so many junior resumes. Everything on your resume will be genuinely true, verifiable by clicking a link, and something you can discuss in detail — because you actually did it. That is a real advantage over a candidate who claims three years of experience and cannot answer a follow-up question.

### Part 1 — What the hiring manager is actually doing

#### The thirty-second scan

A hiring manager filling an entry-level remote support role has a stack of applications and a screaming deadline. Here is what they do, in order:

1. **Skim the top third of page one.** Name, headline, summary, most recent role. If nothing in that zone matches the role, the scan may stop here.
2. **Look for the keyword match.** Not because ATS software demands it — because a human is checking whether you have encountered the technologies in the job ad. Windows, Active Directory, networking, ticketing, remote support.
3. **Look for proof.** Portfolio link, GitHub link, something that exists outside the resume. This is where most junior candidates have literally nothing, and it is where you will stand out.
4. **Look for red flags.** Exaggerated claims, unexplained gaps, generic objective statements, an obvious uncustomised template.
5. **Decide whether to spend four more minutes.** That is the entire goal of the first thirty seconds.

**Design backwards from that list.** Your portfolio link belongs near the top, not buried at the bottom. Your summary should name the role you want rather than describe your personality. Your skills should mirror the vocabulary of the job ads you are targeting.

#### What makes a lab project readable as experience

The core problem juniors face: "I have no work experience." The solution is not to invent experience. It is to present lab work in the format that *reads* like experience, because the professional format is what conveys competence.

A lab project becomes credible when it contains five things:

| Element | Weak version | Strong version |
|---|---|---|
| **Context** | "Did networking stuff" | "Built a virtual network to practise subnetting and routing" |
| **Tools** | "Used some tools" | "VirtualBox, pfSense, Ubuntu Server, Wireshark" |
| **Action** | "Learned about DHCP" | "Configured a DHCP scope, then captured the DORA exchange in Wireshark to confirm it" |
| **Evidence** | "Took notes" | "Diagram plus packet capture screenshots in the portfolio repository" |
| **Result** | "Understood it better" | "I can now explain and demonstrate DHCP discovery, offer, request and acknowledgement end to end" |

Same activity, five times the credibility. Nothing was exaggerated. The difference is entirely in **specificity and evidence**, which is what a hiring manager is trained to notice.

**The rule that follows from this:** every bullet should name a tool, a specific action, and a verifiable outcome. If you cannot name a tool, you have not done enough to write the bullet yet.

#### Four bullets, rewritten

Read the left column, then the right.

| Weak | Strong |
|---|---|
| "Good with computers." | "Diagnosed and resolved 15 practice helpdesk tickets covering password resets, VPN failures, and printer faults, documented in a public ticket-template repository." |
| "Did some networking." | "Built a routed lab network in VirtualBox with two subnets; verified connectivity and fault isolation with `ping`, `tracert`, and Wireshark captures." |
| "Learned PowerShell." | "Wrote a PowerShell inventory script reporting OS version, disk space, and running services; used to document a 10-device practice asset inventory." |
| "Know Linux." | "Installed and administered Ubuntu Server in a VM: user and group management, `systemctl` service control, permissions with `chmod` and `chown`, log review in `/var/log`." |

None of those strong bullets is dishonest. Every one would survive a follow-up question, because a follow-up question is exactly what practising them prepared you for.

#### Honesty is a strategy, not only a virtue

Two reasons to keep every claim strictly true, beyond the ethical one:

- **Everything on your resume is an interview question.** If you claim "experienced with Active Directory", the next question is "what have you done with it?" and the honest answer ("I studied the concepts and practised local equivalents") is fine — but only if the resume said that too. A resume that overstates converts a good interview into a bad one.
- **Verification is trivially easy now.** Your portfolio has links. A hiring manager who clicks and finds nothing, or finds less than the resume implies, has learned something about your integrity they will not forget.

The correct framing of your self-taught path is neither apology nor inflation. It is **precise**: "I completed this curriculum, built these artefacts, and here they are." Precision is more persuasive than either.

### Part 2 — Portfolio structure

#### The recommended folder layout, and why it is shaped that way

```text
entry-level-it-portfolio/
├── README.md
├── troubleshooting-writeups/
├── networking/
├── windows-linux/
├── ticketing-samples/
├── scripts/
└── resume/
```

Each folder exists because a hiring manager will look for that category:

- **`README.md`** is the front page and the most important file in the repository. It should say, in a few lines: what role you are targeting, what you have studied, what is in each folder, and how to contact you. A reviewer who reads only the README should already understand who you are.
- **`troubleshooting-writeups/`** proves you can diagnose and communicate. This folder is disproportionately valuable for a support role, because it demonstrates the thing the job actually is.
- **`networking/`** holds your diagrams, subnetting notes, and packet captures.
- **`windows-linux/`** holds your admin work: user and group management, permissions, services, and the PowerShell and Bash scripts you wrote.
- **`ticketing-samples/`** holds your templates, sample tickets, and the runbook from Phase 6.
- **`scripts/`** holds the inventory script and anything else runnable.
- **`resume/`** holds the PDF, so a reviewer can grab it without leaving.

**GitHub versus Google Drive.** Use GitHub if you are comfortable with it — it demonstrates version control, a real skill, and reviewers trust it. If not, use Google Drive first and migrate later. Google Drive is completely acceptable and nobody will reject you for it. What matters is that the link works, the structure is obvious, and the content is real.

#### What goes in the README

The README is a landing page, and it should take about three minutes to write well:

```markdown
# IT Support Portfolio — [Your Name]

Entry-level IT support technician (remote). Based in the Philippines.
Target role: remote helpdesk / IT support.

## What's here

| Folder | Contents |
|---|---|
| troubleshooting-writeups/ | Worked examples: symptom → diagnosis → fix, with what I ruled out |
| networking/ | Lab network diagram, subnetting notes, Wireshark walkthroughs |
| windows-linux/ | User/group and permission labs, services, PowerShell and Bash |
| ticketing-samples/ | 5 ticket templates, sample resolved tickets, monitoring runbook |
| scripts/ | PowerShell inventory script |
| resume/ | One-page resume (PDF) |

## Background

Self-taught via a structured IT curriculum, [start date] – present. No degree;
studied deliberately with hands-on labs and written evidence at each stage.

## Contact

Email · LinkedIn · [anything else]
```

That is the whole thing. Notice how much information a reviewer gets in fifteen seconds: the role you want, where you are, what you have done, how it is organised, and how to reach you. **Clarity is the entire objective.**

#### The five-minute stranger test

The exit criterion is that a stranger can open the portfolio and understand it. Test that literally: send the link to someone who does not work in IT and ask them three questions.

1. What job do you think this person is looking for?
2. What do you think they can actually do?
3. Could you find their resume in under a minute?

If they cannot answer all three, the portfolio is not finished — and the fix is usually structural, not more content. Remove cleverness, add headings, and put the plainest version of the facts at the top.

### Part 3 — The resume and LinkedIn

#### One page, and what earns a place on it

For an entry-level role, one page is correct. It is not a constraint you are fighting; it is a filter that improves the document, because it forces you to keep only what matters.

The sections from this phase, in order:

1. **Name and remote-ready location** — "Philippines · Remote-ready". Remote employers filter on this in the first three seconds, so make it findable.
2. **Contact line** — email, LinkedIn, portfolio link. The portfolio link belongs here, at the top.
3. **Summary, two to three lines** — what role you want and what you bring. Not an objective statement about your dreams.
4. **Skills** — a compact list matching the job ads' vocabulary: Windows, Linux, networking fundamentals, ticketing systems, remote support, documentation, PowerShell and Bash basics.
5. **Projects** — three to five lab projects using the context/tools/action/evidence/result structure from Part 1. **This is the section that carries your application.** It takes the place work experience normally occupies.
6. **Experience** — genuine work of any kind: freelance, customer service, retail, family business, volunteer IT help. Customer-facing work is genuinely relevant to support roles, because the job is half communication, and you should say so.
7. **Education and certifications** — self-study and completed courses, listed accurately. **No certificates you have not earned.** Employers do verify.

**On the experience section when you have none:** do not leave it blank and do not invent anything. Rename it if that helps — "Experience and Relevant Activities" — and include the customer-facing work you have actually done. "Handled customer complaints in a retail environment" is a real, relevant qualification for a helpdesk job, and framing it that way is honest.

#### ATS, keywords, and the one rule that matters

Applicant tracking systems (ATS) parse resumes and search for keywords. The practical implications for formatting:

- **Use a simple single-column layout.** Multi-column designs and text boxes confuse parsers, and half your carefully placed content disappears.
- **Avoid tables for critical content** in the resume itself, and avoid headers and footers for contact details, because parsers frequently drop them.
- **Use standard section names** — "Skills", "Projects", "Experience", "Education". Clever titles like "Where I've Been" cost you matches.
- **Export to PDF with selectable text**, not an image, unless the employer asks for another format.

Then keywords. The rule is simple and it is the whole game: **mirror the job ad's vocabulary honestly.** If the ad says "Active Directory" and your honest experience is "studied AD concepts, practised local user and group management", the keyword "Active Directory" belongs on your resume in a project bullet that states exactly what you did. What you must not do is add "Active Directory" to a skills list with no qualifying context, because that is the version that collapses under interview questioning.

**Match keywords; do not fabricate them.** That sentence is the whole summary of keyword strategy.

#### LinkedIn: a search profile, not a social profile

Most people use LinkedIn badly because they treat it as a social network. For job hunting it is a **search index**, and the algorithm shows you to recruiters based on the words in your headline and About section.

The phase task gives you the headline pattern, and it is a good one because it stacks searchable terms in order of importance:

```text
Entry-Level IT Support | Windows, Linux, Networking, Helpdesk Labs | Remote-ready Philippines
```

Why it works:

- **"Entry-Level IT Support"** is what recruiters search, and it sets honest expectations.
- **The technology list** matches how recruiter filters are built.
- **"Remote-ready Philippines"** matches both the location filter and the remote-work filter, which is how most of your target roles will be found.

Then the About section, in three short paragraphs: what you are targeting, what you have studied and built with a link to the portfolio, and what you are looking for. Keep it plain. Recruiters skim it exactly like a resume.

Two consistent habits matter more than any optimisation: **list your portfolio in your contact info**, and **log in weekly**. An inactive profile is shown to fewer people, and it looks stale to anyone who checks.

### Part 4 — Making the portfolio genuinely useful

#### Using GitHub well, if you use it

If you choose GitHub, a few small things separate a portfolio that looks professional from one that looks abandoned:

- **The README is the product.** A repository with a proper README and thin content reads better than a repository full of files with no explanation. Reviewers will not dig; they will read the front page and click one link.
- **Use Markdown deliberately.** Headings, tables, code blocks with language hints, and images render properly and look intentional. The GitHub Markdown guide in the resources list covers everything you need in about twenty minutes.
- **Write useful commit messages.** "Add networking lab diagram and packet capture notes" rather than "update". A reviewer who opens your commit history sees how you work, and a tidy history is a quiet signal of professionalism.
- **Link between artefacts.** A troubleshooting write-up should link to the script it produced; the script should link back to the ticket that prompted it. Links show the portfolio is a body of work rather than a pile of loose files.
- **Put the resume PDF in the repository** and link it from the README's contact section. One click, no hunting.
- **Make sure the repository is public** — and check it in a private browser window, because a surprising number of portfolios are invisible to the people they were built for.

**On secrets: never commit credentials.** No passwords, no API keys, no recovery codes, no real client data. Use placeholder values in examples. This is a genuine habit you will need in the job, and a portfolio is exactly where you should start practising it.

#### Three STAR summaries, as the deliverable requires

The Phase 8 deliverable asks for **three project summaries written in STAR style**, and that is not a repeat of the interview stories from Phase 7 — it is the same structure applied to *projects* rather than to personal experiences. The layout to use:

```text
Project: Routed lab network with DHCP and DNS
Situation : I could explain subnetting on paper but had never configured routing
            across two subnets, and I could not read a packet capture with purpose.
Task      : Build a two-subnet lab in VirtualBox and prove connectivity and
            name resolution actually work across the boundary.
Action    : Installed pfSense as the router with a leg on each subnet; configured
            DHCP scopes for both; installed Ubuntu Server as a client; ran ping and
            tracert across subnets; captured the DHCP exchange in Wireshark to
            confirm the DORA sequence; intentionally broke the gateway setting on
            one client to see how the failure presents.
Result    : A working routed lab, a network diagram, and packet-capture notes in
            the portfolio. I can now explain the DORA sequence from the packets
            rather than from memory, and I recognise a wrong-gateway symptom
            immediately.
Evidence  : portfolio/networking/ — diagram, scope screenshots, pcap notes
```

The **Action** line is where the value is. Note that it includes an intentional failure: breaking the gateway deliberately and observing the symptom. That detail does more for credibility than any claim of proficiency, because it is evidence of curiosity and method rather than memorisation.

#### Making the portfolio a habit, not a one-off

The estimated time note in this phase says it plainly: two weeks to build, then update weekly while applying.

The weekly habit matters because **every interview generates new material.** A question you could not answer well becomes a short write-up. A troubleshooting session with a friend's laptop becomes a portfolio entry. A job ad full of unfamiliar terms becomes a study list. Fifteen minutes a week keeps the portfolio improving, and it means that when a promising role appears, your evidence is already current.

The reverse is also true. A portfolio that was built once and never touched looks exactly like what it is: an assignment finished and abandoned. Reviewers notice dates.

### Part 5 — A complete resume, annotated

Part 1 explained what the hiring manager scans for. This part shows a resume that survives that scan, line by line, with the reasoning attached — because the reasoning is the transferable part.

This is a real structure for an entry-level remote support applicant with no professional IT experience. Read it as a worked example, not a template to copy verbatim; your artefacts are your own.

```text
JUAN DELA CRUZ
Manila, Philippines (UTC+8) · Available 09:00–18:00 UTC+8, flexible for US/EU overlap
juan.delacruz@email.com · linkedin.com/in/juandelacruz · github.com/juandelacruz
```

**What each line is doing.** The location and timezone are the first filter for remote work — a US employer needs to know the overlap before they read anything else. Stating availability pre-empts the question that would otherwise be their first email. All three links are on one line so the thirty-second scan finds them immediately rather than at the bottom of page two.

```text
SUMMARY
Entry-level IT support technician. Self-taught through a structured curriculum covering
Windows administration, networking, and ticketing, with a portfolio of documented
hands-on work. Seeking a remote helpdesk or IT support role.
```

**What this is doing.** Three sentences, three jobs: name the role being applied for, state the basis of the claim, and say what is wanted. It contains no adjectives about personality — "hardworking", "passionate", "detail-oriented" are the words every other applicant used and none of them are verifiable. This summary is entirely checkable.

```text
TECHNICAL SKILLS
Operating systems : Windows 10/11 (user and group management, NTFS permissions, services,
                    Event Viewer), Ubuntu Server (users, systemd, permissions, log review)
Networking        : TCP/IP, subnetting, DNS, DHCP, NAT, ping/tracert/nslookup,
                    Wireshark capture and analysis
Identity & access : Local accounts and groups, Active Directory concepts, least privilege,
                    MFA, access review
Tools             : osTicket, Snipe-IT, Bitwarden, VirtualBox, PowerShell, Git/GitHub
```

**What this is doing.** Every line maps to vocabulary that appears in real job ads, which is what the keyword scan is checking. Note the parenthetical detail — it converts a list of nouns into evidence of what was actually done with each. "Windows" is a claim; "NTFS permissions, services, Event Viewer" is a demonstration. And nothing here is claimed that a follow-up question could not be answered honestly.

```text
PROJECTS

Practice helpdesk ticket portfolio
· Resolved 15 documented practice tickets covering password resets, VPN failures,
  printer faults, and account lockouts, each written in the reported/observed/action/
  verified format with the diagnostic reasoning recorded.
· Built five reusable ticket templates and a monitoring runbook for a disk-space alert,
  including known false positives.
· github.com/juandelacruz/ticket-portfolio

Routed home lab network
· Built a two-subnet network in VirtualBox with pfSense routing between them; verified
  connectivity and fault isolation using ping, tracert, and Wireshark packet captures.
· Produced a subnetting worksheet covering /26 and /25 networks with worked host ranges,
  and a network diagram of the finished topology.
· github.com/juandelacruz/networking-labs

Windows administration and permissions lab
· Created users and groups, then demonstrated inherited versus explicit NTFS permissions
  and the effect of share permissions combining with NTFS on effective access.
· Wrote a PowerShell script reporting OS version, disk space, and running services,
  used to populate a 10-device practice asset inventory.
· github.com/juandelacruz/windows-labs
```

**What this is doing, and why it is the centre of the resume.** This section is what replaces "experience" for a candidate who has none, and it works because each project has the same five elements Part 1 described: context, tools, action, evidence, result. Every bullet names a specific technology and a specific action, and every project ends with a link a sceptical reader can click.

The third bullet of each project is the most important line. It is what converts "I studied this" into "here is the thing I made".

```text
EDUCATION AND TRAINING

Self-directed IT curriculum                                    2026 – present
· Completed a structured 9-phase programme covering computer fundamentals, operating
  systems, networking, helpdesk practice, system administration, and security basics.
· Built and documented a hands-on artefact at every phase; portfolio at the link above.

[Any formal education, most recent first — degree, diploma, or senior high school,
with dates. Do not omit it; do not apologise for it.]
```

**What this is doing.** It states the self-taught route as a fact with a structure and a date, not as a confession. The phrase "built and documented a hands-on artefact at every phase" is the sentence that reframes self-teaching as disciplined delivery. Formal education goes below it in plain form — no hedging, no "only", no apology.

```text
LANGUAGES
English (professional working proficiency) · Filipino (native)
```

**Why it is here.** For remote overseas roles this line answers a question the employer is legally restricted from asking directly in some jurisdictions and reluctant to ask anywhere. Volunteering it, with a proficiency level rather than a bare claim, removes an unspoken doubt.

#### What is deliberately absent

- **No photo, age, or marital status.** These are common on Philippine resumes and are a liability for remote international applications, where they invite bias and look dated.
- **No objective statement.** It was replaced by the summary, which says the same thing in half the space and without the word "seeking a challenging position".
- **No references.** "Available on request" wastes a line; every employer assumes you can provide them.
- **No hobbies** unless one is genuinely relevant — a home lab is relevant, and belongs in Projects rather than as a hobby.
- **No skill bars or percentages.** "Windows — 80%" is unverifiable and means nothing to any reader.

### Part 6 — Getting past the software, without lying to it

Part 1 said applicants worry about ATS (applicant tracking systems) — the software that reads, scores, and sometimes filters resumes before a human sees them. Here is the accurate version of that concern, because the internet exaggerates it in both directions.

**What ATS software actually does.** It parses your resume into fields — name, contact details, employer, dates, skills — so a recruiter can search and sort. It may rank candidates by keyword match. In a small company it may do nothing at all. Knocking out a qualified candidate automatically is a real phenomenon but a rarer one than the internet suggests, and it mostly affects badly formatted files rather than honest content.

**The three things that genuinely cause parse failures**, all of which are formatting rather than wording:

| Cause | What breaks | Fix |
|---|---|---|
| **Tables and text boxes** | Parsers read columns in the wrong order, scrambling your history | Single-column layout for the resume itself |
| **Headers and footers** | Contact details in a Word header are frequently dropped entirely | Put contact details in the body text, at the top |
| **Images and icons** | Skill icons and logos parse as nothing; the meaning is lost | Write the skill as text |

**The honest way to handle keywords.** Read ten job ads for the role you want and write down the words that keep appearing: *Windows*, *Active Directory*, *ticketing system*, *remote support*, *TCP/IP*, *customer service*. Then check whether your resume contains the ones that are **truthfully** yours.

That last word is doing the work. If you have genuinely done it — studied NTFS permissions, built a lab network, worked practice tickets — then the keyword is honest and should appear. If you have not, adding the keyword converts a weak resume into a dishonest one, and the interview will find out. **You are matching vocabulary to real experience, not inventing experience to match vocabulary.**

A practical test for every keyword you add: *if the interviewer says "tell me about your experience with this", can I answer specifically for ninety seconds?* If not, the word does not belong on the page yet.

#### One resume per role family, not per application

Customising every application is exhausting and, past a point, pointless. The workable compromise:

- **Keep one master resume** containing everything true.
- **Maintain two or three variants** by role family — helpdesk/support, networking-focused, sysadmin-focused. Change the summary, reorder the skills, and promote the most relevant project to the top.
- **Tailor the summary only** for a specific application, because that is the one paragraph a human always reads, and it costs two minutes.

That gets you most of the benefit of customisation for a fraction of the effort, and it keeps you applying when the alternative is burning out on resume editing.

### Part 7 — LinkedIn, and why it is not optional for remote work

For local walk-in hiring, LinkedIn is optional. **For remote overseas roles it is close to mandatory**, because it is where a recruiter checks that you exist, that your story is consistent with your resume, and often that you are reachable before they ever email you.

#### The four sections that matter

| Section | What to write | Common mistake |
|---|---|---|
| **Headline** | The role and the skills: "IT Support Technician · Windows, Networking, Ticketing" | "Aspiring IT professional" — aspiration is not a search term |
| **About** | Three short paragraphs: what you do, what you have built, what you want | A wall of text, or a list of soft-skill adjectives |
| **Experience** | Your projects, entered as entries with dates — this is what makes the profile look active | Leaving it empty because you have no employer |
| **Skills** | The same truthful keywords as your resume | Adding 50 skills to look broad; it reads as unfocused |

That third row is the one people get wrong. You do not need an employer to populate the Experience section — you list your projects with date ranges, in the same way the resume does. A profile with real entries reads as someone working; an empty one reads as someone who made an account.

#### The About section, written out

```text
I am an entry-level IT support technician, self-taught through a structured
curriculum covering Windows administration, networking, and helpdesk practice.

I learn by building. My portfolio includes 15 documented practice tickets, a
routed two-subnet lab network, and a PowerShell inventory script — each written
up with the diagnostic reasoning, not just the outcome. I am most useful at the
part of a ticket where the user has described the symptom and someone needs to
work out what is actually happening.

I am looking for a remote helpdesk or IT support role. I am based in the
Philippines (UTC+8) and available to overlap with US and EU hours.

Portfolio: github.com/juandelacruz
```

**What this is doing.** First paragraph: who and what basis. Second: evidence with a specific strength named, which is more memorable than a list of skills. Third: what is wanted and the practical constraint. It is under 150 words, it names real artefacts, and every sentence would survive being questioned.

#### Networking without feeling like a fraud

The instinct for a newcomer is to avoid connecting with anyone until there is something worth showing. That is backwards. **Connect while you are still learning**, with a short honest note:

> "Hello — I am studying toward entry-level IT support and working through hands-on labs in Windows and networking. I have been following your work in [specific area]. I would be glad to connect and learn from what you post."

Two rules: say something specific about why *that* person, and never ask for a job in the connection request. A connection request is not an application; asking for work in it converts a possible ally into someone who ignores you. Build thirty to fifty genuine connections during study, and the profile stops looking new at exactly the moment you start applying.

### Part 8 — Defending every line in the interview

This is the section that determines whether the resume helps or hurts. Everything on the page is a question waiting to be asked, and the difference between a strong and weak candidate is not the resume — it is what happens in the two minutes after the interviewer points at a bullet.

#### The two-minute drill

For every line on your resume, be able to answer these without hesitating:

1. **What specifically did you do?** Not the topic — the action.
2. **What tools did you use, exactly?**
3. **What went wrong, and how did you get past it?** The failed attempts are what prove you did the work.
4. **How did you know it was finished?** The evidence question. "The user said thanks" is a weak answer; "connectivity was confirmed by ping and the capture showed the full handshake" is a strong one.
5. **What would you do differently now?**

If any line on your resume cannot survive those five, either do the work behind it or remove the line. Those are the only two honest options, and removing is always available.

#### Worked example: defending a bullet

Take this bullet from Part 5:

> Built a two-subnet network in VirtualBox with pfSense routing between them; verified connectivity and fault isolation using ping, tracert, and Wireshark packet captures.

**"Walk me through building it."** Two VirtualBox internal networks, an Ubuntu Server VM on each, and a pfSense VM with one interface on each network acting as the router and DHCP server. The point was to force traffic between subnets through the router rather than letting everything sit on one flat network.

**"What went wrong?"** The two guests could not reach each other at first. I had assigned the interfaces to the same internal network by mistake, so they were on one segment and had no router between them — which also meant the routing I was trying to test was not being exercised at all. Finding that taught me to check the topology before the config.

**"How did you verify?"** A `ping` from the first subnet to the router's second interface, then to the host on the second subnet, then `tracert` to confirm the path actually went through pfSense rather than resolving locally. Then a Wireshark capture to see the traffic crossing the interface. The `tracert` mattered most, because a successful ping alone would not have proven the router was doing the work.

**"What would you do differently?"** I would draw the topology before building it. I fixed the interface mix-up by inspecting the config, but a diagram would have made the mistake visible before I wasted time on it — and it is what I do first now.

That is a two-minute answer to a single resume line, and it contains a real failure, a specific verification method, and a changed habit. **That is the standard.** Not perfect knowledge — demonstrable work.

#### The question behind the question

When an interviewer probes a resume bullet, they are usually not testing the technology. They are testing three things:

- **Did you actually do this?** A candidate who did the work has texture — specific problems, specific fixes. A candidate who read about it is smooth and vague.
- **Can you explain it to someone who does not know?** This is the job. If you cannot explain your own lab network clearly, you cannot explain a user's problem clearly.
- **Do you know the edges of your own knowledge?** The strongest answer to "do you know X?" is often "I know this part well and I have not touched that part yet." Overclaiming is what destroys interviews; accurate self-assessment is what builds credibility.

### Part 9 — Key takeaways

- **The hiring manager is scanning for signals, not reading.** Design the top third of page one for a thirty-second skim.
- **Comprehension beats impressiveness.** A stranger must understand what you did, not be dazzled by it.
- **A lab project reads as experience** when it carries context, tools, action, evidence, and result.
- **Every bullet names a tool, a specific action, and a verifiable outcome.** If you cannot name a tool, you have not done enough to write the bullet.
- **Everything on your resume is an interview question.** Keep every claim strictly true so the question is one you can answer.
- **Honesty is a strategy, not only a virtue.** Verification is trivially easy when your portfolio has links.
- **Precision beats both apology and inflation.** "I completed this curriculum and built these artefacts" is the framing.
- **Put contact details and links in the body text, not a header**, and keep the layout single-column — those are the formatting failures that break parsing.
- **Match keywords to experience you actually have.** The test is whether you can talk about it for ninety seconds.
- **Two or three resume variants by role family** beats rewriting for every application, and it keeps you applying.
- **For remote work, LinkedIn is close to mandatory.** List your projects under Experience so the profile reads as active.
- **A headline is a search term, not an aspiration.** "Aspiring IT professional" is invisible.
- **Never ask for a job in a connection request.** Build the network while you are still learning.
- **Prepare a two-minute defence for every resume line.** The texture of a real answer — specific problems, specific fixes — is what proves you did the work.
- **"I know this part well and I have not touched that part" is a strong answer.** Accurate self-assessment builds credibility; overclaiming destroys it.

### Part 10 — Practice this next

The tasks below produce three artefacts and one demonstration. The artefacts are a static site with your write-ups and diagrams, a README that ties the work together, and the workbook PDF. The demonstration is a recorded walkthrough, and it is the one that changes how people read everything else.

Then work this list, which turns the artefacts into something a stranger can actually evaluate:

1. **Write the two-minute defence for every bullet on your resume.** Do it in writing first, then say each one aloud and time it. Any bullet you cannot defend in two minutes is either not finished work or not a resume line yet.
2. **Run the thirty-second test on yourself.** Show the top third of your resume to someone who does not work in IT, give them thirty seconds, then ask: what job is this person applying for, and what have they built? If either answer is wrong, that zone needs rewriting.
3. **Build the master resume plus two variants** — support-focused and networking-focused. Change only the summary, the skills order, and which project is first. Then compare them side by side and confirm each is truthful.
4. **Parse-test your resume.** Paste the plain text into a `.txt` file, or open the PDF and try to select the text in reading order. If your contact details are missing or the columns scramble, fix the layout before anything else.
5. **Collect ten real job ads** for the role you want and list the words that repeat. Check each against your resume, and add only the ones where you can answer "tell me about this" for ninety seconds.
6. **Write your LinkedIn headline and About section** using the Part 7 structure, then read them against the rule that every sentence must be checkable. Delete any adjective you cannot prove.
7. **Enter three projects under LinkedIn Experience with date ranges**, even though they have no employer. This is what makes the profile read as active rather than new.
8. **Send five connection requests** with a specific, honest note and no request for work. Then keep doing it weekly — the network is what makes the profile useful on the day you start applying.
9. **Record yourself answering the five drill questions** for your strongest project, then watch it back. You are checking for two things: whether the explanation is clear to a non-specialist, and whether you say "we" when you mean "I".
10. **Write the honest-limits sentence for your three weakest areas.** For each, one sentence that states what you do know and what you have not touched yet — then say it aloud until it sounds like confidence rather than apology, because that is what it is.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| GitHub | Portfolio hosting | Free | https://github.com/ | Create `entry-level-it-portfolio` repo | Google Drive folder |
| Google Drive | File sharing | Free/freemium | https://drive.google.com/ | Host PDFs/screenshots | OneDrive free |
| Canva | Resume design | Freemium | https://www.canva.com/ | Create clean one-page resume | Google Docs template |
| Google Docs | Resume writing | Free | https://docs.google.com/ | Write ATS-friendly resume | LibreOffice Writer |
| diagrams.net | Network diagrams | Free | https://www.diagrams.net/ | Draw portfolio architecture diagrams | Excalidraw |
| LinkedIn | Job profile | Free/freemium | https://www.linkedin.com/ | Build IT support headline/About | OnlineJobs.ph profile |

## Free/cheap resources

- Harvard resume guide — https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/
- GitHub Markdown guide — https://guides.github.com/features/mastering-markdown/
- Google technical writing — https://developers.google.com/tech-writing
- LinkedIn Help profile basics — https://www.linkedin.com/help/linkedin/

## Hands-on practice tasks

1. Create portfolio folder/repo.
2. Add a README explaining your target role and labs.
3. Add at least 5 artifacts from earlier phases.
4. Write a one-page IT support resume.
5. Create 8 project bullets using action verbs.
6. Update LinkedIn headline: `Entry-Level IT Support | Windows, Linux, Networking, Helpdesk Labs | Remote-ready Philippines`.
7. Ask one person or AI tool to review clarity, not exaggeration.

## Deliverable / proof of work

- Portfolio link/folder
- One-page resume PDF
- LinkedIn profile draft or updated profile
- 3 project summaries written in STAR style

## Checklist

- [ ] I created a portfolio folder or GitHub repo. <!-- id: it-08-c01 energy: normal -->
- [ ] I added at least 5 proof-of-work artifacts. <!-- id: it-08-c02 energy: normal -->
- [ ] I wrote a one-page resume. <!-- id: it-08-c03 energy: normal -->
- [ ] I added 3–5 projects to my resume. <!-- id: it-08-c04 energy: normal -->
- [ ] I updated LinkedIn headline/About. <!-- id: it-08-c05 energy: normal -->
- [ ] I removed exaggerated claims. <!-- id: it-08-c06 energy: normal -->
- [ ] I can explain every resume bullet honestly. <!-- id: it-08-c07 energy: low -->

## You're ready to move on when...

A stranger can open your portfolio and understand what you practiced, what tools you used, and what role you want.

## Free vs Paid

### What's free and enough

GitHub, Google Docs, Google Drive, diagrams.net, and LinkedIn free are enough.

### What's paid and why you'd upgrade

Canva Pro and LinkedIn Premium may help design/visibility but are not required.

### When it's worth paying

Do not pay now. A clear plain resume beats a pretty but vague resume.
