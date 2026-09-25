---
id: curriculum-it-triage
exam: "CS Roadmap IT Support Triage & Ticketing"
code: CS-IT-FOUNDATIONS
kind: curriculum-practice
track: it
phases: "it-01-computer-fundamentals,it-02-operating-systems,it-03-networking-basics,it-04-helpdesk-skills,it-05-sysadmin-basics,it-06-tools-and-ticketing,it-09-job-application-plan"
scope: "IT Phases 1–6 and 9"
questions: 20
source: curriculum
---

# CS Roadmap IT Support Triage & Ticketing — curriculum practice exam

**Unofficial curriculum practice exam; not a certification exam or a job-readiness guarantee.** This diagnostic set integrates IT Phases 1–6 and 9. It focuses on evidence-first troubleshooting, safe support, ticket workflow, basic systems, and application tracking. It is free and intended for practice, not as a substitute for hands-on work.

## How to use and score it

Answer all 20 questions without looking at the keys. Give yourself one point for each correct answer, then read every explanation. **There is no pass/fail score or readiness threshold.** Use missed or guessed questions to choose what to revisit in the mapped phases. Real support work depends on local procedures, permissions, and escalation policy; follow those rather than treating a practice answer as authorization to change a system.

## Domain 1 — Evidence-first troubleshooting (5 questions)

### Q1. A laptop is reported as “very slow.” Task Manager shows CPU usage near 100% for one process, while memory and disk remain moderate. What is the best next step?
<!-- phases: it-01-computer-fundamentals -->

- [ ] Order more RAM before speaking to the user
- [x] **Identify the process and ask what changed before taking action**
- [ ] Reinstall Windows immediately
- [ ] Disable every startup application

**Why:** The resource graph gives a lead, not permission to remove or disable a process. Identify its publisher and purpose, ask about recent changes, and follow the support procedure. Replacing hardware or making a broad change without a diagnosis risks losing evidence and creating a new problem.

### Q2. A desktop has no display. The monitor’s power light is on, but it reports “No signal.” What should a technician check first?
<!-- phases: it-01-computer-fundamentals -->

- [ ] Replace the motherboard
- [ ] Reinstall the graphics driver
- [x] **Confirm the selected input and check the cable at both ends**
- [ ] Reset the user’s password

**Why:** Start with the simplest physical path between the computer and display: correct input, cable seating, and port. This is reversible and directly tests the symptom. Driver or board replacement is premature before confirming the display connection.

### Q3. A user says a shared folder is empty immediately after a password change. What is the most useful first question?
<!-- phases: it-05-sysadmin-basics -->

- [x] **Does the folder show an access-denied error, or does it open with no files?**
- [ ] Can you delete the user’s profile now?
- [ ] Should the service desk grant Full Control to Everyone?
- [ ] Is the printer on the same subnet?

**Why:** An explicit denial points toward authorization; an apparently empty folder may have another cause, such as a stale session or a different path. Distinguishing the observed states prevents an unnecessary permission change that could expose data.

### Q4. A computer has a 169.254.x.x address and cannot reach the network. Which investigation is most appropriate?
<!-- phases: it-03-networking-basics -->

- [ ] Treat it as a public address and change DNS only
- [x] **Check the link, switch connection, and DHCP path**
- [ ] Set an arbitrary static address from another subnet
- [ ] Disable the firewall permanently

**Why:** A 169.254.x.x IPv4 address is link-local and commonly indicates that a DHCP lease was not obtained. Check the physical connection and DHCP availability before changing configuration. An arbitrary static address can conflict with another device.

### Q5. One employee cannot print; the printer’s own test page succeeds and nearby users can print. What should be compared first?
<!-- phases: it-04-helpdesk-skills -->

- [ ] The print server’s power supply
- [ ] Every user’s password age
- [x] **The affected workstation’s selected queue, port, and connection against a working workstation**
- [ ] The office’s internet provider

**Why:** A successful device test and successful printing by others narrow the issue to the affected user’s path. Compare queue and port configuration before changing shared printer settings that are working for the rest of the office.

## Domain 2 — Operating systems, networking, and safe access (5 questions)

### Q6. A Linux service is “active (running),” but users still cannot connect to its application. What should you inspect next?
<!-- phases: it-02-operating-systems -->

- [ ] Conclude the application is healthy because the process exists
- [x] **Read the service logs and test the expected listening port and network path**
- [ ] Delete the service unit file
- [ ] Change every file permission to 777

**Why:** A running process does not prove that it is listening on the intended port, has healthy dependencies, or can be reached through the network. Logs and a narrow connectivity check provide evidence without destructive changes.

### Q7. A user can reach a website by IP address but not by its hostname. Which layer should be investigated first?
<!-- phases: it-03-networking-basics -->

- [ ] Display resolution
- [ ] Disk partitions
- [x] **Name resolution, including the configured DNS server and response**
- [ ] The monitor cable

**Why:** If the IP address works but the hostname does not, DNS resolution is a strong first hypothesis. Confirm with a targeted lookup and compare known-good configuration; do not claim the entire network is healthy from one test alone.

### Q8. A technician needs to help a user remotely with a problem involving a confidential document. What is the safest approach?
<!-- phases: it-04-helpdesk-skills, it-06-tools-and-ticketing -->

- [ ] Start an unattended remote session without telling the user
- [ ] Ask the user to send their password in chat
- [x] **Obtain consent, use the approved tool, and avoid viewing or copying unrelated data**
- [ ] Record the session on a personal account

**Why:** Consent, approved tools, least privilege, and data minimization protect both the user and organization. A remote session is not permission to browse unrelated information, and credentials should never be collected through chat.

### Q9. An employee asks for access to a restricted finance folder and says their manager approved it. What should support do before granting access?
<!-- phases: it-05-sysadmin-basics -->

- [ ] Grant access because the requester sounds confident
- [x] **Verify the approval through the organization’s authorized process and check existing access**
- [ ] Share another employee’s account
- [ ] Add the user to every finance group temporarily

**Why:** Access changes require verified authorization, not a verbal claim alone. Checking current membership may also reveal that access already exists but has not taken effect. Broad or temporary grants can expose sensitive data and are difficult to audit.

### Q10. A system update appears to have caused a user-facing fault. What is the best first response?
<!-- phases: it-02-operating-systems, it-06-tools-and-ticketing -->

- [ ] Remove all updates from every computer
- [ ] Disable update services permanently
- [x] **Record the symptoms and update timing, check approved rollback guidance, and assess scope**
- [ ] Delete the user’s files to make space

**Why:** Establish the timeline and number of affected systems, then follow the change and rollback process. A controlled rollback may be appropriate, but broad or undocumented changes can worsen the incident and obscure its cause.

## Domain 3 — Service workflow, tickets, and monitoring (5 questions)

### Q11. A monitoring alert reports high disk usage on one server. What should the ticket’s first update contain?
<!-- phases: it-06-tools-and-ticketing -->

- [ ] “Fixed” before checking the host
- [x] **The affected asset, alert time, current measurement, impact, and the next diagnostic step**
- [ ] The administrator’s password
- [ ] A guess that the disk is failing

**Why:** A useful ticket preserves observed facts and makes the next action clear. High utilization may have several causes; record the measurement and investigate before labeling the drive defective or claiming resolution.

### Q12. Several users report the same application failure after a scheduled deployment. How should the work be classified initially?
<!-- phases: it-06-tools-and-ticketing -->

- [ ] A personal preference request for each user
- [x] **Related incidents, linked to the deployment/change record, with scope assessed**
- [ ] A confirmed security breach without further evidence
- [ ] A closed problem because the deployment was approved

**Why:** A service outage is an incident requiring restoration. Link related reports and investigate the common change; an approved change can still produce an unintended fault. Do not claim a security incident without evidence, but preserve the possibility if indicators warrant escalation.

### Q13. A support analyst fixed an issue but did not write down which setting changed. Why is this a workflow defect?
<!-- phases: it-06-tools-and-ticketing -->

- [ ] Documentation is only for managers
- [ ] It guarantees the issue cannot recur
- [x] **The record cannot support verification, repeatable resolution, or later investigation**
- [ ] A ticket must never contain technical details

**Why:** The ticket is both a work record and institutional knowledge. Without the change and its result, another technician cannot safely verify or repeat the fix, and recurring incidents cannot be analyzed.

### Q14. A ticket has high urgency because a user is presenting soon, but only that user is affected and a safe workaround exists. What does this tell the analyst?
<!-- phases: it-06-tools-and-ticketing -->

- [ ] Urgency and impact are identical
- [x] **Assess urgency and impact separately before deriving priority**
- [ ] Close the ticket because a workaround exists
- [ ] Escalate every high-urgency ticket to security

**Why:** Urgency describes time sensitivity; impact describes scope and consequence. Priority should use both under the organization’s matrix. A workaround may reduce impact, but should be recorded and verified rather than used to dismiss the report.

### Q15. A service desk receives a request for a software package that is not in the approved catalogue. What is the correct next step?
<!-- phases: it-06-tools-and-ticketing -->

- [ ] Install it from a download site to save time
- [ ] Ask the requester to disable endpoint protection
- [x] **Route it through the software/change approval and licensing process**
- [ ] Close all other tickets until it is approved

**Why:** A standard request may be fulfilled through an approved process. New or unapproved software needs review for authorization, licensing, security, and deployment impact. The requester’s need does not bypass change control.

## Domain 4 — Job-search workflow and professional judgment (5 questions)

### Q16. You plan to apply for remote support roles. A posting lists Windows, ticketing, and user communication as requirements. What is the strongest way to tailor your application?
<!-- phases: it-09-job-application-plan -->

- [ ] Copy every keyword into the resume whether or not you have used it
- [x] **Match truthful examples of your experience to the listed requirements and point to evidence**
- [ ] Claim five years of enterprise experience because the posting asks for it
- [ ] Remove all project details to keep the resume short

**Why:** Tailoring means making relevant evidence easy to find, not inventing experience. A lab, portfolio artifact, or real support example can show what you can do while remaining honest about its context.

### Q17. An application tracker shows many applications but no interviews. What is the most useful first review?
<!-- phases: it-09-job-application-plan -->

- [ ] Increase the application count without changing anything
- [ ] Mark every application as a rejection
- [x] **Check targeting and resume fit, then look for patterns in the roles and outcomes**
- [ ] Delete the tracker because it has no value

**Why:** The funnel stage is evidence. No interviews may indicate a mismatch in targeting or screening materials; review a sample of postings and submissions before changing strategy. Counts alone do not diagnose the cause.

### Q18. A recruiter requests payment for a guaranteed remote helpdesk job and asks for identity documents before an interview. What should you do?
<!-- phases: it-09-job-application-plan -->

- [ ] Pay immediately to reserve the position
- [ ] Send documents through a personal messaging account
- [x] **Treat it as a potential scam, verify the employer independently, and do not pay or send sensitive data**
- [ ] Install software the recruiter sends without checking it

**Why:** Upfront payment and premature requests for sensitive documents are warning signs. Verify contact details through the employer’s official channels and protect identity data. Do not open unexpected files or install unknown software.

### Q19. You receive a rejection after a technical screen. What is a constructive next step?
<!-- phases: it-09-job-application-plan -->

- [ ] Assume the interviewer disliked you and change every career goal
- [x] **Record what the process tested, identify one evidence-based improvement, and continue the search**
- [ ] Claim the company discriminated without supporting evidence
- [ ] Stop applying until you can guarantee success

**Why:** A rejection is one data point, not a verdict on a person’s worth. Note the stage and any specific feedback, then choose a reasonable adjustment. If there is a concrete fairness concern, preserve facts and use an appropriate channel rather than making unsupported assumptions.

### Q20. You are asked in an interview to describe a ticket you have not personally handled. What is the best response?
<!-- phases: it-09-job-application-plan -->

- [ ] Invent a customer story and present it as real
- [ ] Say you can resolve any issue without escalation
- [x] **Be clear that you have not handled that exact case, then explain a safe diagnostic approach and when you would escalate**
- [ ] Refuse to answer because you lack the job title

**Why:** Honest boundaries plus structured reasoning are more credible than fabricated experience. Explain what evidence you would gather, what you would avoid changing, and where policy or a senior specialist would guide the next step.

## Question-to-phase map

| Question | Main phase(s) |
|---|---|
| Q1–Q2 | `it-roadmap/01-phase-computer-fundamentals.md` |
| Q3, Q9 | `it-roadmap/05-phase-sysadmin-basics.md` |
| Q4, Q7 | `it-roadmap/03-phase-networking-basics.md` |
| Q5 | `it-roadmap/04-phase-helpdesk-skills.md` |
| Q6 | `it-roadmap/02-phase-operating-systems.md` |
| Q8 | `it-roadmap/04-phase-helpdesk-skills.md`, `it-roadmap/06-phase-tools-and-ticketing.md` |
| Q10 | `it-roadmap/02-phase-operating-systems.md`, `it-roadmap/06-phase-tools-and-ticketing.md` |
| Q11–Q15 | `it-roadmap/06-phase-tools-and-ticketing.md` |
| Q16–Q20 | `it-roadmap/09-phase-job-application-plan.md` |
