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

### Key takeaways

- **The resume gets about thirty seconds.** Design for a scan, not for a read.
- **Specificity creates credibility.** Name the tool, the action, and the verifiable outcome.
- **Evidence beats claims.** A working portfolio link outweighs any adjective on the resume.
- **The projects section replaces work experience** for entry-level candidates, and it carries the application.
- **No exaggeration, ever.** Every resume line is a future interview question, and links are clickable.
- **README first.** A reviewer who reads only your portfolio front page should already understand you.
- **One page, single column, standard headings** — for human readers and parsers alike.
- **Mirror the job ad's keywords honestly; never fabricate them.**
- **LinkedIn is a search index.** Headline and About are the fields that get you found.
- **"Remote-ready Philippines"** belongs where a recruiter filter can see it.
- **Test with a stranger.** If they cannot say what role you want, the portfolio is not done.

### Practice this next

The tasks below are assembly work, and you can start with the smallest one. Create the folder structure, then write the README before you add anything else — it is the file that does the most work per minute spent. Pull in the artefacts from earlier phases, write the eight project bullets using the context/tools/action/evidence/result pattern, and turn three of them into STAR summaries for the deliverable. Then write the resume, and finish with the review task in the list: have one person, or an AI tool, read it for clarity *and for anything that overstates what you did*. That last instruction is not a formality. An outside reader will catch the one bullet that says more than you can defend, and finding it now is far better than finding it in an interview.

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
