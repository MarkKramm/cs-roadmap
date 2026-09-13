---
id: cyber-01-foundations
track: cyber
phase: 1
order: 10
title: "Phase 1 — Cybersecurity Foundations"
duration: "4 weeks"
duration_weeks: 4
energy_mix: [low, normal]
deliverable: "portfolio/cyber/01-foundations.md"
exit_criteria: "You can explain basic cybersecurity concepts without memorized buzzwords and can describe one simple attack from attacker action to defender response."
---

# Phase 1 — Cybersecurity Foundations

## Goal of this phase

Rebuild the basics: what cybersecurity protects, how attacks happen, and how defenders think.

## Estimated time

**4 weeks**. Do not rush vocabulary; you need these words for interviews and reports.

## Skills you'll gain

- Explain CIA triad, risk, threat, vulnerability, exploit, control, incident, and asset.
- Understand basic attacker and defender workflows.
- Recognize phishing, malware, weak passwords, misconfiguration, and social engineering.
- Read basic security advisories and CVEs.
- Start safe note-taking and lab documentation.

## Specific topics to learn

- CIA triad: confidentiality, integrity, availability
- Authentication vs authorization vs accounting
- MFA, password managers, password spraying, brute force
- Malware types: virus, worm, trojan, ransomware, spyware
- Phishing: links, attachments, credential harvesting, business email compromise
- Vulnerability vs exploit vs payload
- Patch management
- Security controls: preventive, detective, corrective
- Security roles: SOC, GRC, pentest, IAM, cloud security, DFIR
- Legal/ethical boundaries
- Basic frameworks: NIST CSF, MITRE ATT&CK, OWASP Top 10

## Lesson: Cybersecurity Foundations

### Why this lesson exists

Cybersecurity has an unusual problem: almost everyone entering it has already absorbed the vocabulary, and almost nobody has absorbed the meaning. You have seen the words — hacker, firewall, encryption, breach — used in headlines and films, and they arrived attached to images rather than definitions. This phase is where you replace the images with definitions you can defend in a job interview.

That matters more than it sounds. The single clearest signal separating a candidate who will get a SOC interview from one who will not is whether they can explain a concept in plain words, without reaching for jargon. Anyone can say "the CIA triad is confidentiality, integrity, and availability." Very few beginners can then take a real incident — a hospital locked out of its patient records — and say precisely which of the three broke, how, and what the defenders should have had in place. The first answer is memorisation. The second is understanding, and it is what the interviewer is listening for.

There is a second reason this phase exists, and it is about safety. You are about to learn about attacks. The internet is full of tutorials that will hand you a tool and a target with no mention of the law. Getting this wrong is not a matter of a bad grade; in most countries, including the Philippines under Republic Act 10175, unauthorised access to a computer system is a criminal offence regardless of intent, regardless of whether you damaged anything, and regardless of whether you were "just testing." The legal and ethical boundaries covered here are not a formality appended to the end of the phase. They are the licence that lets you practise at all.

**Time to complete:** roughly 12–16 hours across the four weeks, and most of that is the practice tasks rather than this reading. The glossary task alone, done properly in your own words, will teach you more than reading any summary — including this one.

**A note on what this phase is not.** This is not a hacking phase. You will not run a single offensive tool here, and that is deliberate. Foundations exist so that when you do reach Phase 4's labs, you understand what you are looking at. Learners who skip ahead to the tools tend to plateau quickly, because they can follow a walkthrough but cannot explain why any step was necessary.

### Part 1 — The CIA triad: what security actually protects

#### Three properties, not three goals

The **CIA triad** — confidentiality, integrity, availability — is the oldest and most durable model in the field. Its value is not that it is complete; it is that it gives you a checklist you can apply to anything.

- **Confidentiality** means information is readable only by those authorised to read it. It breaks when data is disclosed to the wrong party. A leaked customer database is a confidentiality failure.
- **Integrity** means information is accurate and has not been altered without authorisation. It breaks when data is changed, corrupted, or forged. An attacker quietly editing a bank transfer amount is an integrity failure, even though nobody stole anything.
- **Availability** means information and systems are accessible when legitimate users need them. It breaks when access is denied. Ransomware is primarily an availability attack — the data still exists, encrypted, and the organisation simply cannot reach it.

The useful habit is to ask, of any incident: **which of the three broke?** Often more than one. Ransomware typically breaks availability first, then confidentiality, because modern ransomware operators steal the data before encrypting it and threaten to publish it if the victim does not pay. That combination is why the "just restore from backup" advice, while still correct, is no longer sufficient on its own.

#### Why the order matters in practice

Security decisions are almost always trade-offs between the three, and naming the trade-off is how professionals argue for a decision.

Consider a hospital. If it applies maximum confidentiality — encrypt everything, restrict access tightly, require approval for each record — a doctor cannot open a patient's chart during an emergency. Availability has been sacrificed for confidentiality. If it applies maximum availability — every terminal can open every record instantly — then anyone who reaches a terminal can read the whole patient database. Confidentiality has been sacrificed for availability. Neither extreme is a policy; both are failures waiting to happen. The real work is choosing where on the spectrum each system belongs, and being able to explain why.

A concrete example you can use in an interview: **multi-factor authentication (MFA)** is a confidentiality control that costs a little availability and a little convenience, because logging in takes one extra step. It is almost always worth it, because the attack it blocks — a stolen or guessed password — is one of the most common in the world. That is the shape of a security argument: *this control costs this much convenience and blocks this much risk, therefore we accept it.*

#### Mapping CIA to real systems

Practise applying the triad until it is automatic:

| System | Confidentiality concern | Integrity concern | Availability concern |
|---|---|---|---|
| Personal email | Someone reads your mail | Someone sends mail as you | You cannot log in |
| Online banking | Someone sees your balance | Someone moves your money | You cannot pay bills |
| Company file share | Competitor reads plans | Plans are silently altered | Staff cannot work |
| Hospital records | Privacy breach | Wrong medication recorded | Doctors cannot treat |

Notice that the *controls* differ per system even when the concern is the same. Confidentiality for personal email might be MFA; for a company file share it might be group-based permissions plus encryption. Same property, different mechanism, chosen to fit the context.

### Part 2 — The vocabulary of risk: threat, vulnerability, exploit, control

#### Four words beginners mix up constantly

These four words are used interchangeably in casual conversation and precisely in professional ones. Getting them right is one of the fastest credibility wins available to a beginner.

- An **asset** is anything of value worth protecting: a laptop, a database, a customer list, your reputation, a factory's control system.
- A **threat** is anything that could cause harm to an asset. A threat is a *source of danger* — a criminal group, a disgruntled insider, a flood, a careless employee.
- A **vulnerability** is a weakness that a threat could take advantage of. An unpatched server, a reused password, a door propped open, a developer who left debug mode enabled in production.
- A **control** (or **countermeasure**) is anything that reduces risk: a patch, a lock, a policy, a firewall rule, a training programme.

And the two that get confused most often:

- An **exploit** is the specific technique or piece of code that takes advantage of a vulnerability.
- A **payload** is what the exploit delivers once it has succeeded — the action actually performed, such as installing ransomware or opening a remote shell.

The relationship is easiest to hold as a sentence: **a threat exploits a vulnerability, using an exploit, to deliver a payload, against an asset, and a control is what stops or detects it.**

A worked example, using something you can verify yourself:

> The asset is an old web server. The vulnerability is a known flaw in an outdated version of its software, published as CVE-2021-41773 in Apache's HTTP Server. The threat is an attacker scanning the internet for that exact version. The exploit is a crafted URL containing a path-traversal sequence. The payload is reading files the attacker should never see — for example `/etc/passwd`, the Linux file that lists user accounts. The control is patching the server, and, failing that, a web application firewall that recognises the malicious pattern.

Every one of those terms is now doing real work. That paragraph is the level of explanation to aim for.

#### Risk, and why it is the word that actually matters

**Risk** combines the other concepts into a decision. The standard formulation is:

```text
Risk = Likelihood × Impact
```

A vulnerability that is trivial to exploit and would destroy the business is a high risk. The same vulnerability on an isolated machine that nobody can reach, holding data nobody wants, is a low risk. The vulnerability has not changed; the risk has. This is why security teams are constantly triaging rather than fixing everything: there is never enough time to fix everything, so the job is deciding what matters most.

This is also where **risk acceptance** enters. Sometimes the correct decision is to do nothing about a known vulnerability, because the cost of the fix exceeds the risk. Professionals write that decision down and take responsibility for it. Beginners often assume every risk must be eliminated, which is neither possible nor affordable.

#### Patch management, in one page

**Patch management** is the process of applying vendor fixes for known vulnerabilities, and it is the single highest-value routine activity in defensive security. The reason is arithmetic: once a vulnerability is publicly disclosed, every attacker in the world knows about it, and scanning for unpatched systems is fully automated. The window between "patch released" and "someone tries to exploit it" is often measured in hours.

A workable patch process has four steps:

1. **Inventory** — you cannot patch what you do not know you own. Asset inventory comes first.
2. **Assess** — how severe is this vulnerability, and is the affected system exposed? Vendors publish severity scores (CVSS) to help rank.
3. **Test** — patches occasionally break things. Critical systems get tested before wide deployment.
4. **Deploy and verify** — apply, then confirm it applied. "We sent the patch" and "the patch is installed" are different claims.

The failure mode is not usually laziness; it is the absence of step one. Most organisations have systems in a spreadsheet that stopped being updated two years ago.

### Part 3 — How attacks actually work

#### Phishing: the attack you will meet every week

**Phishing** is a social-engineering attack that uses a message — usually email — to trick a person into doing something harmful. It is not primarily a technical attack. It targets the human, because the human is the component that cannot be patched.

The variants you should be able to name:

- **Mass phishing** — one message, sent to thousands of addresses, hoping a small percentage click. Crude, cheap, and still effective.
- **Spear phishing** — a message tailored to one person or a small group, using real details about them: their manager's name, a project they work on, a conference they attended. Far more convincing, and far more dangerous.
- **Whaling** — spear phishing aimed at senior executives, who often have the authority to approve payments and the least time to check carefully.
- **Business email compromise (BEC)** — the attacker impersonates or compromises a real business contact and requests a payment or a change to payment details. There is often no malware and no link at all, just a plausible request. Because nothing technical happens, technical controls struggle; BEC is one of the largest categories of financial cybercrime worldwide.
- **Credential harvesting** — the message links to a fake login page that looks exactly like the real one. The victim types their username and password, and the attacker now has working credentials. This is often combined with MFA fatigue or a real-time proxy that relays the victim's MFA prompt.

The reason phishing deserves this much space is that it is the entry point for the majority of serious breaches. Attackers rarely break in through a clever technical exploit when they can simply ask someone for the password.

**Why people fall for it**, and this is important for both defence and for your own self-respect as a learner: phishing works on urgency (act now), authority (the CEO is asking), fear (your account will be closed), curiosity (see the attached invoice), and familiarity (it appears to come from a colleague). It is engineered to bypass deliberate thought. Being intelligent does not protect you. Having a routine does.

A usable routine:

1. **Slow down on anything urgent.** Urgency is the attack.
2. **Check the actual sender address**, not the display name. Display names are trivially forged.
3. **Hover before clicking** and read the real URL. `paypal.com.secure-login.example.net` is not PayPal; the real domain is the last one before the first single slash.
4. **Never enter credentials from a link in a message.** Navigate to the site yourself.
5. **Verify unusual payment requests by a second channel** — a phone call to a number you already had, not one supplied in the message.

#### Malware: the taxonomy you should know

**Malware** is any software written to cause harm. The categories overlap in practice, because real-world malicious software combines behaviours, but the vocabulary is still worth holding:

- **Virus** — malicious code that attaches itself to another file or program and spreads when that file is run. Requires a host and a user action.
- **Worm** — malicious code that spreads by itself across networks, exploiting vulnerabilities without needing anyone to run anything. WannaCry in 2017 was a worm; it spread to hundreds of thousands of systems in days.
- **Trojan** — software that appears legitimate but carries a hidden malicious function. Named after the wooden horse: the harm arrives inside something you chose to bring in.
- **Ransomware** — malware that encrypts files and demands payment for the decryption key. Modern variants also exfiltrate data first and threaten publication, which turns a single availability problem into a confidentiality and regulatory problem too.
- **Spyware** — malware that secretly gathers information: keystrokes, screenshots, browsing activity, credentials. Often bundled with legitimate-looking software.
- **Rootkit** — malware designed to hide its own presence, and often the presence of other malware, by subverting the operating system's own reporting. Rootkits are the reason "the antivirus says it is clean" is not proof of anything.
- **Botnet** — a network of compromised machines, each running a **bot**, controlled remotely by an operator. Botnets are rented out for spam, credential stuffing, and distributed denial of service.

Note the unifying theme: malware classifications describe **how it spreads** (virus, worm) or **what it does** (ransomware, spyware, rootkit). That is why a single piece of malware can legitimately be described as "a trojan that drops a rootkit and then installs ransomware" — each word is answering a different question.

#### Authentication, authorisation, and accounting

These three are collectively the **AAA** framework, and separating them prevents a common beginner confusion.

- **Authentication** answers *who are you?* — proving identity. A password, a fingerprint, a hardware key.
- **Authorisation** answers *what are you allowed to do?* — permissions and rights, applied after identity is established.
- **Accounting** (also called auditing) answers *what did you do?* — the log of actions taken, which is what makes investigation possible.

A useful test: if a system knows exactly who you are but lets you read anything, authentication works and authorisation does not. If it lets you in and does what it should but keeps no record, accounting is the gap. Most real breaches involve failures in more than one.

**MFA** strengthens authentication by requiring more than one *kind* of evidence:

- Something you **know** — a password, a PIN.
- Something you **have** — a phone, a hardware token, a smart card.
- Something you **are** — a fingerprint, a face, a retina.

Two passwords are not MFA; they are two of the same factor. The distinction matters because the threats differ: a password can be phished or guessed, but a hardware key cannot be phished remotely, which is why security-conscious organisations are moving to them.

The attacks against authentication you should be able to name and explain:

- **Brute force** — trying many passwords against one account. Slow against a good password, and usually defeated by lockout policies and rate limiting.
- **Password spraying** — the reverse: trying one common password (like `Summer2025!`) against many accounts. This evades lockout policies, because each individual account sees only one failed attempt. It is the reason password *reuse* is so dangerous.
- **Credential stuffing** — taking username/password pairs leaked from one breached site and trying them on other sites. It only works because people reuse passwords, which is the entire argument for a password manager.
- **MFA fatigue** (or push bombing) — sending repeated MFA prompts until the victim approves one out of irritation. Defeated by number matching and by not approving prompts you did not initiate.

**A password manager** is the practical answer to most of this, and it is why Bitwarden or KeePassXC is in this phase's tools table. It lets you use a unique, long, random password for every service, so that a breach of one site cannot become a breach of all of them. You then protect the vault with one strong passphrase and MFA. That is a genuine, immediate improvement to your own security, which is the first thing this phase asks you to do.

### Part 4 — The defender's side: roles, controls, and frameworks

#### Security controls, sorted by when they act

A **security control** is any measure that reduces risk. The most useful way to sort them is by *when* they do their work:

- **Preventive** — stops the event from happening. A firewall rule, MFA, a locked door, encryption, least privilege.
- **Detective** — notices that something happened. Log monitoring, an intrusion detection system, an alert from an antivirus, a user report.
- **Corrective** — fixes things after the fact. Restoring from backup, removing malware, resetting credentials, patching the exploited flaw.

Two more categories are worth knowing because they are what mature organisations add:

- **Deterrent** — discourages an attempt. A warning banner, visible cameras, a stated policy of prosecuting intruders.
- **Compensating** — an alternative control used when the ideal one is not possible. If a critical system cannot be patched, you might isolate it on its own network segment instead.

The reason this taxonomy is worth memorising is that it lets you answer the interview question *"what would you have done?"* in an organised way. A complete answer names a preventive control that would have helped, a detective control that should have caught it, and a corrective control that limits the damage. Candidates who answer with a single tool sound like they have read a blog post; candidates who answer across all three sound like they understand defence.

#### The security roles, and what the work actually is

The phase lists these, and you should be able to say what each one does day to day — because your specialisation choice in Phase 5 depends on it.

- **SOC Analyst** — works in a Security Operations Centre, triaging alerts. Most of the work is reading logs, judging whether an alert is a real threat or noise, escalating what is real, and documenting everything. This is the most common entry point into cyber, and the closest in feel to helpdesk: queue-driven, process-heavy, learnable.
- **GRC Analyst** — Governance, Risk, and Compliance. Writes and reviews policies, runs risk assessments, prepares for audits, maps the organisation's controls against frameworks. Far less technical than people expect, and heavily writing-based. A strong route for someone who communicates well.
- **Pentest / Offensive Security** — hired to find vulnerabilities before attackers do, with written authorisation. The glamour role, and the hardest to enter directly, because it assumes broad knowledge of both systems and attacks. Most people arrive here *after* time in a defensive or IT role.
- **IAM Analyst** — Identity and Access Management. Joins, moves, and leaves; access reviews; role design; MFA rollout. Sits between IT administration and security.
- **Cloud Security** — secures cloud environments: configuration, identity policies, logging, and the endless problem of storage buckets left publicly readable.
- **DFIR** — Digital Forensics and Incident Response. Investigates what happened after an incident: preserving evidence, reconstructing a timeline, writing the report. Methodical, documentation-heavy, and often on-call.

Two honest observations for a beginner with no degree and no experience. First, **SOC Analyst is the realistic first target** for most people on this path, and it is the role this roadmap's exit criteria are written toward. Second, your **IT support experience is not a detour from cyber — it is the qualification.** Understanding how users, accounts, and systems actually behave in an organisation is what separates a candidate who has done labs from one who can be trusted with production. Lean into it rather than treating it as time served.

#### The three frameworks, and what each is for

Beginners often see frameworks as bureaucratic overhead. They are actually shared vocabularies, and shared vocabulary is what lets you work with people you have never met.

**NIST Cybersecurity Framework (CSF)** organises security work into five functions:

1. **Identify** — know what you have and what matters. Asset inventory, risk assessment.
2. **Protect** — put controls in place. Access control, training, patching.
3. **Detect** — notice incidents. Monitoring, logging, detection rules.
4. **Respond** — act on incidents. Containment, communication, analysis.
5. **Recover** — restore and improve. Backups, lessons learned, resilience.

Its value is as a coverage checklist: it shows you which part of the job an organisation is neglecting. Many breaches are Respond failures more than Protect failures — the organisation had controls, but no plan for what to do when one failed.

**MITRE ATT&CK** is a knowledge base of real attacker **tactics, techniques, and procedures (TTPs)**, observed in the wild and organised into a matrix. A *tactic* is the attacker's goal at a stage ("initial access", "persistence", "exfiltration"); a *technique* is a specific way of achieving it. ATT&CK's value to a defender is that it lets you describe behaviour rather than tools — and behaviour survives tool changes. When you see a phishing email, you can map it to **T1566 Phishing** under the Initial Access tactic, and suddenly your observation joins a global, consistent vocabulary. This is why one of this phase's practice tasks is to pick five techniques and explain them.

**OWASP Top 10** is a list of the ten most critical web application security risks, maintained by the Open Worldwide Application Security Project. It is web-specific — broken access control, injection, cryptographic failures, misconfiguration, and so on. Because your background includes web development, this is the framework you are best positioned to understand quickly, and it is genuinely useful in interviews: being able to say "I have read the OWASP Top 10 and I understand why injection happens when you concatenate user input into a query" is a concrete, verifiable claim.

### Part 5 — Legal and ethical boundaries

#### The line you do not cross

Everything in this roadmap assumes a hard boundary: **you only test systems you own, or systems you have explicit written permission to test.**

Not implied permission. Not "they did not say no." Not "it was only a scan." Written permission, from someone with the authority to grant it, describing what you may do. In professional practice this document is called a **scope** or a **rules of engagement** agreement, and it exists to protect both parties.

The legal reality in the Philippines is Republic Act 10175, the Cybercrime Prevention Act of 2012, which criminalises unauthorised access to a computer system. The key word is *unauthorised*, not *malicious*. Running a port scan against a server you do not own is unauthorised access in most jurisdictions, including this one. So is using a default password you guessed to log into a device you found. Intent is not a defence, and "I was learning" is not a defence.

Concrete rules to hold yourself to:

- The only targets you touch are your own machines, machines you have been given in writing, and intentionally vulnerable platforms designed for practice — TryHackMe, Hack The Box, PortSwigger Web Security Academy, CyberDefenders, and local virtual machines.
- **Never** scan or test your school network, your employer's network, your ISP, a neighbour's Wi-Fi, or a website you found interesting. These are the four most common ways beginners commit a crime by accident.
- Know your own home network boundary. Your router and your own devices are yours. Your ISP's infrastructure beyond the router is not.
- Keep notes of what you did and why. This is good practice for learning and, if there is ever a question, it is your evidence of legitimate purpose.
- If you discover a real vulnerability in someone else's system by accident, do not exploit it, do not tell the internet, and do not ask for money. Stop, document, and look up that organisation's **responsible disclosure** or security contact.

#### Why the ethics matter beyond the law

The professional reason is straightforward: this field runs on trust. Employers grant security staff privileged access to everything — customer data, financial systems, other people's credentials. A candidate with a story about the time they tested a school's website is not an impressive candidate; they are an uninsurable one.

The practical reason is that *authorisation is what makes the work possible*. A penetration test is valuable precisely because it is bounded and reported. The deliverable is not "I got in" — it is a report the organisation can act on. Learning to work inside a scope, document as you go, and write up findings for someone who was not there is the skill you are actually building in Phases 4 and 6. Attackers do not write reports. Professionals do.

#### Getting permission in the real world

When you eventually want to practise against something that is not a purpose-built lab, the route is:

1. Identify the correct contact — a security team, a **security.txt** contact, or a bug-bounty programme page.
2. Ask for explicit, written, scoped permission. Say exactly what you intend to do and when.
3. Accept "no" without argument, and stay strictly inside whatever scope you are given.
4. Report findings privately, factually, and without drama.

If there is no programme and no contact, the answer is no. There are more than enough legal practice environments to keep you busy for years; there is no version of this where testing an unapproved target is worth it.

### Key takeaways

- **The CIA triad is a checklist, not a slogan.** Ask which property broke. Most real incidents break more than one.
- **Threat, vulnerability, exploit, payload, control** are five distinct things. Being able to use them precisely in one sentence is a visible marker of competence.
- **Risk = likelihood × impact.** Security is deciding what matters most, not fixing everything. Not fixing something can be a correct, documented decision.
- **Phishing is the most common way in**, because it targets the person rather than the machine. Urgency is the attack; a routine is the defence.
- **Malware names describe how it spreads or what it does** — which is why real malware can honestly be several categories at once.
- **Authentication asks who you are; authorisation asks what you may do; accounting records what you did.** MFA means two different *kinds* of factor, not two passwords.
- **Controls come in three useful flavours** — preventive, detective, corrective. Answering "what would you have done?" across all three is what makes an answer sound professional.
- **SOC Analyst is the realistic entry point**, and IT support experience is the qualification for it rather than a detour from it.
- **Frameworks are shared vocabularies.** NIST CSF is a coverage checklist, MITRE ATT&CK describes attacker behaviour, OWASP Top 10 covers web risk specifically.
- **Written permission is the boundary, and it is not negotiable.** Unauthorised access is a crime regardless of intent. Purpose-built labs exist so that you never need to test anything else.

### Practice this next

The tasks below all build on this lesson, so a suggested order:

1. **Start the glossary now, not at the end of the phase** (task 1). Write each of the 50 terms in your own words and, for at least ten of them, add a real-world example. "Ransomware: malware that encrypts files and demands payment — for example, an attack that locks a hospital out of patient records." If you cannot write an example, you have not understood the term yet, and that is the signal to go back rather than move on.
2. **Do the password manager and MFA tasks in week one** (tasks 2 and 3). These are the only tasks in the phase that improve your *own* security immediately, and MFA is the single highest-value change most people can make to their digital life.
3. **Read the OWASP Top 10 through the lens of your web development background** (task 4). You have an advantage here over most beginners: you have probably written code that was vulnerable to injection without knowing it. Write your summary with that in mind.
4. **Do the MITRE ATT&CK task as a mapping exercise** (task 5). Take five techniques and, for each, write the attacker's goal and one way a defender would detect it. This is exactly the thinking a SOC analyst does.
5. **Write the phishing analysis last** (task 6), after you have read Part 3, and structure it as: what the attacker wanted, which technique they used, why the message is convincing, and what a defender or a user should have done. Keep it to one page — concise reporting is a skill and this is your first rep at it.
6. **Close with the NIST CSF task** (task 7) and read your own one-page summary back. If you can explain all five functions using an example of your own rather than one from this lesson, the phase's exit criteria are met and you are ready for Phase 2.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Bitwarden | Password manager | Freemium | https://bitwarden.com/ | Store lab passwords and enable MFA | KeePassXC |
| KeePassXC | Offline password manager | Free/open-source | https://keepassxc.org/ | Create local password vault | Bitwarden free |
| Have I Been Pwned | Breach lookup | Free | https://haveibeenpwned.com/ | Check your email safely | Firefox Monitor |
| VirusTotal | File/URL reputation | Free/freemium | https://www.virustotal.com/ | Check a known safe URL/hash from docs | urlscan.io |
| MITRE ATT&CK | Attack technique knowledge base | Free | https://attack.mitre.org/ | Map phishing to ATT&CK techniques | OWASP WSTG for web |
| NIST CSF | Security framework | Free | https://www.nist.gov/cyberframework | Summarize Identify/Protect/Detect/Respond/Recover | CIS Controls |

## Free/cheap resources

- TryHackMe free beginner rooms — https://tryhackme.com/
- NIST Cybersecurity Framework — https://www.nist.gov/cyberframework
- MITRE ATT&CK — https://attack.mitre.org/
- OWASP Top 10 — https://owasp.org/www-project-top-ten/
- CISA security tips — https://www.cisa.gov/news-events/news/cybersecurity-tips
- PortSwigger basic web security concepts — https://portswigger.net/web-security

## Hands-on practice tasks

1. Create a cybersecurity glossary with 50 terms in your own words.
2. Set up Bitwarden or KeePassXC and move lab passwords into it.
3. Enable MFA on your important personal accounts where possible.
4. Read OWASP Top 10 and summarize each risk in 2–3 sentences.
5. Pick 5 MITRE ATT&CK techniques and explain them simply.
6. Write a one-page phishing analysis of a sample email from a safe training source.
7. Read NIST CSF and write one example control for each function.

## Deliverable / proof of work

Create `portfolio/cyber/01-foundations.md` with:

- 50-term glossary
- OWASP Top 10 summary
- 5 MITRE technique summaries
- One phishing analysis report
- NIST CSF one-page summary

## Checklist

- [ ] I can explain CIA triad. <!-- id: cyber-01-c01 energy: low -->
- [ ] I can explain risk, threat, vulnerability, exploit, and control. <!-- id: cyber-01-c02 energy: low -->
- [ ] I created a 50-term glossary. <!-- id: cyber-01-c03 energy: normal -->
- [ ] I enabled MFA on important accounts. <!-- id: cyber-01-c04 energy: normal -->
- [ ] I summarized OWASP Top 10. <!-- id: cyber-01-c05 energy: normal -->
- [ ] I summarized 5 MITRE ATT&CK techniques. <!-- id: cyber-01-c06 energy: normal -->
- [ ] I wrote a phishing analysis report. <!-- id: cyber-01-c07 energy: normal -->
- [ ] I understand legal boundaries for labs. <!-- id: cyber-01-c08 energy: low -->

## You're ready to move on when...

You can explain basic cybersecurity concepts without memorized buzzwords and can describe one simple attack from attacker action to defender response.

## Free vs Paid

### What's free and enough

NIST, MITRE, OWASP, Bitwarden/KeePassXC, and free beginner rooms are enough.

### What's paid and why you'd upgrade

Paid beginner courses can add structure but are not necessary.

### When it's worth paying

Not worth paying yet. Do not buy TryHackMe Premium in Phase 1.
