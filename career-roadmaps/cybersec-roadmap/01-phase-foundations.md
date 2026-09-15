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

#### Words you have seen, meanings you have not

Cybersecurity has an unusual problem. Almost everyone entering it has already absorbed the vocabulary, and almost nobody has absorbed the meaning.

You have seen the words — hacker, firewall, encryption, breach — in headlines and films. They arrived attached to images rather than definitions. This phase replaces the images with definitions you can defend in a job interview.

#### Why plain explanations win interviews

The single clearest signal separating a candidate who gets a SOC interview from one who does not is plain speech. Can you explain a concept without reaching for jargon?

Anyone can say “the CIA triad is confidentiality, integrity, and availability.” Very few beginners can then take a real incident — a hospital locked out of its patient records — and say which of the three broke, how, and what defenders should have had in place. The first answer is memorisation. The second is understanding, and it is what the interviewer is listening for.

#### The safety reason this phase comes first

There is a second reason this phase exists, and it is about safety. You are about to learn about attacks.

The internet is full of tutorials that hand you a tool and a target with no mention of the law. Getting this wrong is not a matter of a bad grade. In most countries, including the Philippines under Republic Act 10175, unauthorised access to a computer system is a criminal offence regardless of intent. It is a crime whether or not you damaged anything, and whether or not you were “just testing.”

The legal and ethical boundaries covered here are not a formality tacked onto the end of the phase. They are the licence that lets you practise at all.

#### How the time breaks down

| What | Time | Note |
|---|---|---|
| Reading this lesson | 3–4 hours | Once, properly — not skimmed |
| Practice tasks | 8–12 hours | The bulk of the phase |
| Glossary task alone | 4–6 hours | Rewards the most per hour |
| Total | 12–16 hours across 4 weeks | Deliberately unhurried |

Most of that time is the practice tasks rather than this reading. The glossary task, done properly in your own words, will teach you more than reading any summary — including this one.

#### What this phase is not

This is not a hacking phase. You will not run a single offensive tool here, and that is deliberate.

Foundations exist so that when you reach Phase 4's labs, you understand what you are looking at. Learners who skip ahead to the tools tend to plateau quickly. They can follow a walkthrough but cannot explain why any step was necessary.

### Part 1 — The CIA triad: what security actually protects

#### Three properties, not three goals

The **CIA triad** — confidentiality, integrity, availability — is the oldest and most durable model in the field. Its value is not that it is complete. Its value is that it gives you a checklist you can apply to anything.

| Property | Means | Breaks when | Example failure |
|---|---|---|---|
| **Confidentiality** | Information is readable only by those authorised to read it | Data is disclosed to the wrong party | A leaked customer database |
| **Integrity** | Information is accurate and has not been altered without authorisation | Data is changed, corrupted, or forged | An attacker quietly edits a bank transfer amount |
| **Availability** | Information and systems are accessible when legitimate users need them | Access is denied | Ransomware encrypts the data; the organisation cannot reach it |

Read the integrity row again. Nobody stole anything in that example, and it is still a security failure. That is the part beginners miss.

#### Which of the three broke?

The useful habit is to ask, of any incident: **which of the three broke?** Often more than one.

Ransomware is the standard case. It breaks availability first, then confidentiality. Modern ransomware operators steal the data before encrypting it, then threaten to publish it if the victim does not pay.

That combination is why “just restore from backup” is still correct but no longer sufficient on its own. The backup fixes availability. It does nothing about the copy the attacker already has.

#### Worked example: reading a hospital incident

A hospital cannot open patient records. The screen says the files are encrypted and demands payment.

| Question | Answer for this incident |
|---|---|
| Asset | Patient record system |
| Property broken first | Availability — doctors cannot read the records |
| Property broken second | Confidentiality — operators claim they copied the data first |
| Threat | Ransomware crew |
| Vulnerability | Something unpatched, or a credential that was phished |
| Preventive control that would have helped | Patching, MFA, and network segmentation |
| Detective control that should have caught it | Log monitoring and an endpoint alert |
| Corrective control that limits damage | Restore from an offline backup |

That table is the shape of a good interview answer. Notice it covers all three control types, which the interviewer is listening for.

#### Why the order matters in practice

Security decisions are almost always trade-offs between the three. Naming the trade-off is how professionals argue for a decision.

Consider a hospital again, this time on the design side.

| Policy choice | What you gain | What you lose |
|---|---|---|
| Maximum confidentiality — encrypt everything, restrict tightly, approve each record | Records are very hard to read without authorisation | A doctor cannot open a chart during an emergency |
| Maximum availability — every terminal opens every record instantly | Nobody is ever blocked | Anyone at a terminal can read the whole patient database |
| Balanced — tiered access with break-glass emergency accounts | Fast care, logged exceptions | Complexity, and the log must be reviewed |

Neither extreme is a policy. Both are failures waiting to happen. The real work is choosing where on the spectrum each system belongs, and being able to explain why.

A concrete example you can use in an interview: **multi-factor authentication (MFA)** is a confidentiality control that costs a little availability and a little convenience, because logging in takes one extra step. It is almost always worth it, because the attack it blocks — a stolen or guessed password — is one of the most common in the world.

That is the shape of a security argument: *this control costs this much convenience and blocks this much risk, therefore we accept it.*

#### Mapping CIA to real systems

Practise applying the triad until it is automatic.

| System | Confidentiality concern | Integrity concern | Availability concern |
|---|---|---|---|
| Personal email | Someone reads your mail | Someone sends mail as you | You cannot log in |
| Online banking | Someone sees your balance | Someone moves your money | You cannot pay bills |
| Company file share | Competitor reads plans | Plans are silently altered | Staff cannot work |
| Hospital records | Privacy breach | Wrong medication recorded | Doctors cannot treat |

Notice that the *controls* differ per system even when the concern is the same. Confidentiality for personal email might be MFA. For a company file share it might be group-based permissions plus encryption. Same property, different mechanism, chosen to fit the context.

#### Worked example: same property, two mechanisms

| Question | Personal email | Company file share |
|---|---|---|
| Property at risk | Confidentiality | Confidentiality |
| Who the risk comes from | Anyone who guesses the password | A colleague in the wrong team |
| Control chosen | MFA on the account | Group-based permissions plus encryption at rest |
| Why not the other control | Permissions make no sense for a personal mailbox | MFA alone would not stop an authorised insider |
| Cost accepted | One extra login step | Some administrative overhead and occasional access requests |

The property is identical. The control is not, because the threat and the context differ. That is the reasoning you are practising.

### Part 2 — The vocabulary of risk: threat, vulnerability, exploit, control

#### Four words beginners mix up constantly

These four words are used interchangeably in casual conversation and precisely in professional ones. Getting them right is one of the fastest credibility wins available to a beginner.

| Term | Plain-English definition | Example |
|---|---|---|
| **Asset** | Anything of value worth protecting | A laptop, a database, a customer list, your reputation, a factory's control system |
| **Threat** | Anything that could cause harm to an asset — a source of danger | A criminal group, a disgruntled insider, a flood, a careless employee |
| **Vulnerability** | A weakness that a threat could take advantage of | An unpatched server, a reused password, a door propped open, debug mode left on in production |
| **Control** (or **countermeasure**) | Anything that reduces risk | A patch, a lock, a policy, a firewall rule, a training programme |

#### Exploit and payload: the two most confused

| Term | Plain-English definition | Example |
|---|---|---|
| **Exploit** | The specific technique or piece of code that takes advantage of a vulnerability | A crafted URL that walks out of the web root |
| **Payload** | What the exploit delivers once it has succeeded — the action actually performed | Installing ransomware, or opening a remote shell |

The relationship is easiest to hold as a sentence: **a threat exploits a vulnerability, using an exploit, to deliver a payload, against an asset, and a control is what stops or detects it.**

#### Worked example: CVE-2021-41773 in one paragraph

Here is the same sentence applied to something you can verify yourself.

The **asset** is an old web server. The **vulnerability** is a known flaw in an outdated version of its software, published as CVE-2021-41773 in Apache's HTTP Server. The **threat** is an attacker scanning the internet for that exact version. The **exploit** is a crafted URL containing a path-traversal sequence. The **payload** is reading files the attacker should never see — for example `/etc/passwd`, the Linux file that lists user accounts.

The **control** is patching the server, and, failing that, a web application firewall that recognises the malicious pattern.

Every one of those terms is now doing real work. That paragraph is the level of explanation to aim for.

#### Risk, and why it is the word that actually matters

**Risk** combines the other concepts into a decision. The standard formulation is:

```text
Risk = Likelihood × Impact
```

A vulnerability that is trivial to exploit and would destroy the business is a high risk. The same vulnerability on an isolated machine that nobody can reach, holding data nobody wants, is a low risk. The vulnerability has not changed. The risk has.

This is why security teams are constantly triaging rather than fixing everything. There is never enough time to fix everything, so the job is deciding what matters most.

#### Risk acceptance, and why doing nothing can be right

Sometimes the correct decision is to do nothing about a known vulnerability, because the cost of the fix exceeds the risk. This is called **risk acceptance**.

Professionals write that decision down and take responsibility for it. Beginners often assume every risk must be eliminated, which is neither possible nor affordable.

| Likelihood | Impact | Typical response |
|---|---|---|
| High | High | Fix now, or isolate the system immediately |
| High | Low | Automate the fix; it is cheap and frequent |
| Low | High | Monitor closely, patch at the next window |
| Low | Low | Accept the risk, document the decision, review next year |

#### Patch management, in one page

**Patch management** is the process of applying vendor fixes for known vulnerabilities. It is the single highest-value routine activity in defensive security.

The reason is arithmetic. Once a vulnerability is publicly disclosed, every attacker in the world knows about it. Scanning for unpatched systems is fully automated. The window between “patch released” and “someone tries to exploit it” is often measured in hours.

A workable patch process has four steps:

| Step | What you do | Why it matters |
|---|---|---|
| 1. **Inventory** | Know every system and version you own | You cannot patch what you do not know you own |
| 2. **Assess** | Judge severity and exposure; vendors publish CVSS scores to help rank | Not every vulnerability deserves the same urgency |
| 3. **Test** | Try the patch on critical systems before wide deployment | Patches occasionally break things |
| 4. **Deploy and verify** | Apply it, then confirm it applied | “We sent the patch” and “the patch is installed” are different claims |

The failure mode is not usually laziness. It is the absence of step one. Most organisations have systems in a spreadsheet that stopped being updated two years ago.

#### Worked example: triaging three findings

Your scanner reports three findings on a Monday morning. You have time for one today.

| Finding | Likelihood of exploitation | Impact if exploited | Decision and why |
|---|---|---|---|
| Internet-facing web server, critical CVE, exploit code public | High | High | Patch today. It is reachable and the tooling already exists |
| Internal print server, same CVE, on a segmented network | Low | Medium | Schedule for the next change window, and confirm the segmentation holds |
| Old laptop in a storeroom, powered off, no data | Low | Low | Accept the risk, document it, and decommission the laptop instead |

All three findings carry the same CVE. The decision differs because likelihood and impact differ. This is what triage means in practice, and it is exactly the reasoning interviewers want to hear.

### Part 3 — How attacks actually work

#### Phishing: the attack you will meet every week

**Phishing** is a social-engineering attack that uses a message — usually email — to trick a person into doing something harmful.

It is not primarily a technical attack. It targets the human, because the human is the component that cannot be patched.

#### The five variants you should be able to name

| Variant | How it works | Why it is dangerous |
|---|---|---|
| **Mass phishing** | One message, sent to thousands of addresses, hoping a small percentage click | Crude, cheap, and still effective |
| **Spear phishing** | A message tailored to one person or a small group, using real details about them — their manager's name, a project they work on, a conference they attended | Far more convincing, and far more dangerous |
| **Whaling** | Spear phishing aimed at senior executives | Executives often have authority to approve payments and the least time to check carefully |
| **Business email compromise (BEC)** | The attacker impersonates or compromises a real business contact and requests a payment or a change to payment details | Often no malware and no link at all, just a plausible request — so technical controls struggle |
| **Credential harvesting** | The message links to a fake login page that looks exactly like the real one; the victim types their username and password | The attacker now has working credentials. Often combined with MFA fatigue or a real-time proxy that relays the victim's MFA prompt |

BEC deserves a second look, because it is unusual. Nothing technical happens, so there is nothing for a scanner to detect. It is one of the largest categories of financial cybercrime worldwide.

The reason phishing deserves this much space is that it is the entry point for the majority of serious breaches. Attackers rarely break in through a clever technical exploit when they can simply ask someone for the password.

#### Why people fall for it

Phishing works on five levers, and this matters both for defence and for your own self-respect as a learner.

| Lever | What it looks like |
|---|---|
| **Urgency** | “Act now” |
| **Authority** | “The CEO is asking” |
| **Fear** | “Your account will be closed” |
| **Curiosity** | “See the attached invoice” |
| **Familiarity** | It appears to come from a colleague |

It is engineered to bypass deliberate thought. Being intelligent does not protect you. Having a routine does.

#### A usable anti-phishing routine

| Step | What you do | Why |
|---|---|---|
| 1 | **Slow down on anything urgent** | Urgency is the attack |
| 2 | **Check the actual sender address**, not the display name | Display names are trivially forged |
| 3 | **Hover before clicking** and read the real URL | `paypal.com.secure-login.example.net` is not PayPal; the real domain is the last one before the first single slash |
| 4 | **Never enter credentials from a link in a message** | Navigate to the site yourself |
| 5 | **Verify unusual payment requests by a second channel** | A phone call to a number you already had, not one supplied in the message |

#### Worked example: reading a suspicious email

This message lands in your inbox:

```text
From:    "PayPal Service" <billing@paypal-secure.example.net>
To:      you@example.com
Subject: URGENT: Your account will be limited in 24 hours

Dear Customer,

We detected unusual activity. You must confirm your identity
within 24 hours or your account will be permanently limited.

Confirm now: http://paypal.com.secure-login.example.net/verify

Failure to act will result in account closure.

PayPal Security Team
```

Read it against the routine, line by line.

| What you see | What it tells you |
|---|---|
| Display name says PayPal, address is `paypal-secure.example.net` | The display name is forged. The real domain is `example.net` |
| The link is `paypal.com.secure-login.example.net` | The real domain is the **last** label before the first single slash — `example.net`. `paypal.com` here is just a subdomain someone registered |
| “within 24 hours”, “will be permanently limited” | Urgency and fear. Both are levers, not information |
| “Dear Customer” instead of your name | Bulk send, not a real account notification |
| A link asking for credentials | Step 4 applies. Open the site yourself instead |

The correct action is to ignore the link, open `paypal.com` by typing it or using a bookmark, and check for notifications there. Nothing in this message needs a reply.

#### Malware: the taxonomy you should know

**Malware** is any software written to cause harm. The categories overlap in practice, because real-world malicious software combines behaviours. The vocabulary is still worth holding.

| Type | What it is | Key detail |
|---|---|---|
| **Virus** | Malicious code that attaches itself to another file or program and spreads when that file is run | Requires a host and a user action |
| **Worm** | Malicious code that spreads by itself across networks, exploiting vulnerabilities without needing anyone to run anything | WannaCry in 2017 was a worm; it spread to hundreds of thousands of systems in days |
| **Trojan** | Software that appears legitimate but carries a hidden malicious function | Named after the wooden horse: the harm arrives inside something you chose to bring in |
| **Ransomware** | Malware that encrypts files and demands payment for the decryption key | Modern variants also exfiltrate data first and threaten publication, turning one availability problem into a confidentiality and regulatory problem too |
| **Spyware** | Malware that secretly gathers information: keystrokes, screenshots, browsing activity, credentials | Often bundled with legitimate-looking software |
| **Rootkit** | Malware designed to hide its own presence, and often the presence of other malware, by subverting the operating system's own reporting | Rootkits are the reason “the antivirus says it is clean” is not proof of anything |
| **Botnet** | A network of compromised machines, each running a **bot**, controlled remotely by an operator | Botnets are rented out for spam, credential stuffing, and distributed denial of service |

Note the unifying theme. Malware classifications describe **how it spreads** (virus, worm) or **what it does** (ransomware, spyware, rootkit).

That is why a single piece of malware can legitimately be described as “a trojan that drops a rootkit and then installs ransomware.” Each word is answering a different question.

#### Authentication, authorisation, and accounting

These three are collectively the **AAA** framework. Separating them prevents a common beginner confusion.

| Term | Question it answers | Examples |
|---|---|---|
| **Authentication** | *Who are you?* — proving identity | A password, a fingerprint, a hardware key |
| **Authorisation** | *What are you allowed to do?* — permissions and rights, applied after identity is established | File permissions, role assignments, database grants |
| **Accounting** (also called auditing) | *What did you do?* — the log of actions taken | Login records, change history, access logs |

#### Worked example: diagnosing which of the three failed

A useful test is to describe the symptom and name the gap.

| Symptom | What works | What is missing |
|---|---|---|
| The system knows exactly who you are but lets you read anything | Authentication | Authorisation |
| The system lets you in and does what it should, but keeps no record | Authentication and authorisation | Accounting |
| Two people can log in as the same account and nobody can tell them apart | Nothing useful | All three, and accountability is gone |

Most real breaches involve failures in more than one.

#### MFA: three kinds of evidence

**MFA** strengthens authentication by requiring more than one *kind* of evidence.

| Factor | What it is | Examples |
|---|---|---|
| Something you **know** | A secret held in your head | A password, a PIN |
| Something you **have** | A physical object you possess | A phone, a hardware token, a smart card |
| Something you **are** | A physical characteristic | A fingerprint, a face, a retina |

Two passwords are not MFA. They are two of the same factor.

The distinction matters because the threats differ. A password can be phished or guessed. A hardware key cannot be phished remotely, which is why security-conscious organisations are moving to them.

#### The four attacks against authentication

| Attack | How it works | What defeats it |
|---|---|---|
| **Brute force** | Trying many passwords against one account | Slow against a good password; lockout policies and rate limiting |
| **Password spraying** | The reverse: one common password (like `Summer2025!`) against many accounts | Each account sees only one failed attempt, so lockout never triggers — this is why password *reuse* is so dangerous |
| **Credential stuffing** | Taking username/password pairs leaked from one breached site and trying them on other sites | Unique passwords per site; it only works because people reuse them |
| **MFA fatigue** (or push bombing) | Sending repeated MFA prompts until the victim approves one out of irritation | Number matching, and never approving prompts you did not initiate |

Read the spraying row carefully. It is the reason a lockout policy alone is not enough, and it is the entire argument for a password manager.

#### Why a password manager is the practical answer

A **password manager** lets you use a unique, long, random password for every service. A breach of one site cannot become a breach of all of them. You then protect the vault with one strong passphrase and MFA.

That is why Bitwarden or KeePassXC is in this phase's tools table. It is a genuine, immediate improvement to your own security, which is the first thing this phase asks you to do.

### Part 4 — The defender's side: roles, controls, and frameworks

#### Security controls, sorted by when they act

A **security control** is any measure that reduces risk. The most useful way to sort them is by *when* they do their work.

| Control type | When it acts | Examples |
|---|---|---|
| **Preventive** | Stops the event from happening | A firewall rule, MFA, a locked door, encryption, least privilege |
| **Detective** | Notices that something happened | Log monitoring, an intrusion detection system, an alert from an antivirus, a user report |
| **Corrective** | Fixes things after the fact | Restoring from backup, removing malware, resetting credentials, patching the exploited flaw |
| **Deterrent** | Discourages an attempt | A warning banner, visible cameras, a stated policy of prosecuting intruders |
| **Compensating** | Stands in when the ideal control is not possible | If a critical system cannot be patched, isolate it on its own network segment instead |

The reason this taxonomy is worth memorising is that it lets you answer the interview question *“what would you have done?”* in an organised way.

A complete answer names a preventive control that would have helped, a detective control that should have caught it, and a corrective control that limits the damage. Candidates who answer with a single tool sound like they have read a blog post. Candidates who answer across all three sound like they understand defence.

#### Worked example: answering “what would you have done?”

A user's mailbox starts sending spam to the whole company. Walk the three categories.

| Control type | Concrete answer | What it would have achieved |
|---|---|---|
| Preventive | MFA on the mailbox, plus conditional access | The phished password alone would not have been enough |
| Detective | Alert on a new mail-forwarding rule or an unusual login location | The compromise would have been caught in minutes, not days |
| Corrective | Reset the password, revoke sessions, remove the forwarding rule, notify recipients | Limits the damage and stops the outbound spam |

Three sentences, three categories, one incident. That is a complete answer.

#### The security roles, and what the work actually is

The phase lists these roles. You should be able to say what each one does day to day, because your specialisation choice in Phase 5 depends on it.

| Role | What the work actually is | Who it suits |
|---|---|---|
| **SOC Analyst** | Works in a Security Operations Centre, triaging alerts. Mostly reading logs, judging whether an alert is real or noise, escalating what is real, and documenting everything | The most common entry point into cyber, and the closest in feel to helpdesk: queue-driven, process-heavy, learnable |
| **GRC Analyst** | Governance, Risk, and Compliance. Writes and reviews policies, runs risk assessments, prepares for audits, maps controls against frameworks | Far less technical than people expect, and heavily writing-based. A strong route for someone who communicates well |
| **Pentest / Offensive Security** | Hired to find vulnerabilities before attackers do, with written authorisation | The glamour role, and the hardest to enter directly — it assumes broad knowledge of both systems and attacks. Most people arrive here *after* time in a defensive or IT role |
| **IAM Analyst** | Identity and Access Management. Joins, moves, and leaves; access reviews; role design; MFA rollout | Sits between IT administration and security |
| **Cloud Security** | Secures cloud environments: configuration, identity policies, logging, and the endless problem of storage buckets left publicly readable | Suits someone comfortable with cloud consoles and infrastructure as code |
| **DFIR** | Digital Forensics and Incident Response. Investigates what happened after an incident: preserving evidence, reconstructing a timeline, writing the report | Methodical, documentation-heavy, and often on-call |

#### Two honest observations for a beginner

First, **SOC Analyst is the realistic first target** for most people on this path. It is the role this roadmap's exit criteria are written toward.

Second, your **IT support experience is not a detour from cyber — it is the qualification.** Understanding how users, accounts, and systems actually behave in an organisation is what separates a candidate who has done labs from one who can be trusted with production. Lean into it rather than treating it as time served.

#### The three frameworks, and what each is for

Beginners often see frameworks as bureaucratic overhead. They are actually shared vocabularies, and shared vocabulary is what lets you work with people you have never met.

| Framework | What it is | Its value to you |
|---|---|---|
| **NIST CSF** | Organises security work into five functions: Identify, Protect, Detect, Respond, Recover | A coverage checklist. It shows you which part of the job an organisation is neglecting |
| **MITRE ATT&CK** | A knowledge base of real attacker **tactics, techniques, and procedures (TTPs)**, observed in the wild and organised into a matrix | Lets you describe behaviour rather than tools — and behaviour survives tool changes |
| **OWASP Top 10** | The ten most critical web application security risks, maintained by the Open Worldwide Application Security Project | Web-specific. Because your background includes web development, this is the framework you are best positioned to understand quickly |

#### NIST CSF: the five functions

| Function | What it covers | Example activities |
|---|---|---|
| 1. **Identify** | Know what you have and what matters | Asset inventory, risk assessment |
| 2. **Protect** | Put controls in place | Access control, training, patching |
| 3. **Detect** | Notice incidents | Monitoring, logging, detection rules |
| 4. **Respond** | Act on incidents | Containment, communication, analysis |
| 5. **Recover** | Restore and improve | Backups, lessons learned, resilience |

Many breaches are Respond failures more than Protect failures. The organisation had controls, but no plan for what to do when one failed.

#### MITRE ATT&CK: tactics versus techniques

| Term | What it means | Example |
|---|---|---|
| **Tactic** | The attacker's goal at a stage | “Initial access”, “persistence”, “exfiltration” |
| **Technique** | A specific way of achieving that goal | **T1566 Phishing** under the Initial Access tactic |

When you see a phishing email, mapping it to T1566 joins your observation to a global, consistent vocabulary. That is why one of this phase's practice tasks is to pick five techniques and explain them.

#### OWASP Top 10: why it is your fastest win

OWASP covers broken access control, injection, cryptographic failures, misconfiguration, and so on. It is web-specific, and you already write web code.

It is genuinely useful in interviews. Being able to say “I have read the OWASP Top 10 and I understand why injection happens when you concatenate user input into a query” is a concrete, verifiable claim.

### Part 5 — Legal and ethical boundaries

#### The line you do not cross

Everything in this roadmap assumes a hard boundary: **you only test systems you own, or systems you have explicit written permission to test.**

Not implied permission. Not “they did not say no.” Not “it was only a scan.” Written permission, from someone with the authority to grant it, describing what you may do.

In professional practice this document is called a **scope** or a **rules of engagement** agreement, and it exists to protect both parties.

#### What the law actually says

The legal reality in the Philippines is Republic Act 10175, the Cybercrime Prevention Act of 2012, which criminalises unauthorised access to a computer system.

The key word is *unauthorised*, not *malicious*. Running a port scan against a server you do not own is unauthorised access in most jurisdictions, including this one. So is using a default password you guessed to log into a device you found. Intent is not a defence, and “I was learning” is not a defence.

| What you might think | What the law sees |
|---|---|
| “It was only a scan — I did not damage anything” | Unauthorised access. Damage is not the test |
| “I was learning, not stealing” | Intent is not a defence |
| “They never said no” | Silence is not permission |
| “It was a default password, so it was open” | Guessing a credential you were not given is still unauthorised |
| “It is my school, so it is basically mine” | An institution's network is not yours because you study there |

#### Five rules to hold yourself to

| Rule | What it means in practice |
|---|---|
| **Use only legitimate targets** | Your own machines, machines you have been given in writing, and intentionally vulnerable platforms designed for practice — TryHackMe, Hack The Box, PortSwigger Web Security Academy, CyberDefenders, and local virtual machines |
| **Never touch the four traps** | Your school network, your employer's network, your ISP, a neighbour's Wi-Fi, or a website you found interesting. These are the most common ways beginners commit a crime by accident |
| **Know your home network boundary** | Your router and your own devices are yours. Your ISP's infrastructure beyond the router is not |
| **Keep notes of what you did and why** | Good practice for learning, and, if there is ever a question, your evidence of legitimate purpose |
| **Handle accidental discoveries correctly** | If you find a real vulnerability in someone else's system by accident, do not exploit it, do not tell the internet, and do not ask for money. Stop, document, and look up that organisation's **responsible disclosure** or security contact |

#### Why the ethics matter beyond the law

The professional reason is straightforward: this field runs on trust. Employers grant security staff privileged access to everything — customer data, financial systems, other people's credentials.

A candidate with a story about the time they tested a school's website is not an impressive candidate. They are an uninsurable one.

#### Authorisation is what makes the work possible

The practical reason is that *authorisation is what makes the work possible*. A penetration test is valuable precisely because it is bounded and reported.

The deliverable is not “I got in.” It is a report the organisation can act on. Learning to work inside a scope, document as you go, and write up findings for someone who was not there is the skill you are actually building in Phases 4 and 6.

Attackers do not write reports. Professionals do.

#### Getting permission in the real world

When you eventually want to practise against something that is not a purpose-built lab, the route is:

| Step | What you do |
|---|---|
| 1 | Identify the correct contact — a security team, a **security.txt** contact, or a bug-bounty programme page |
| 2 | Ask for explicit, written, scoped permission. Say exactly what you intend to do and when |
| 3 | Accept “no” without argument, and stay strictly inside whatever scope you are given |
| 4 | Report findings privately, factually, and without drama |

If there is no programme and no contact, the answer is no. There are more than enough legal practice environments to keep you busy for years. There is no version of this where testing an unapproved target is worth it.

### Part 6 — Your first hands-on work

Parts 1 to 5 taught the vocabulary and the boundaries. This part is where you stop reading and start doing, because a definition you have never applied is a definition you cannot defend in an interview.

Every exercise below runs on the laptop you already own, costs nothing, and touches nothing you do not control. **Everything here is on your own machine or an account you created** — that is what makes it practice rather than an incident.

#### Exercise 1 — Write your own glossary, in your own words

The phase glossary has about 50 terms. Copying definitions is not learning; rewriting them is.

Work through the terms and for each one write **one sentence in your own words** plus, for at least ten of them, a concrete example. A term with no example you can produce is a term you have not understood yet — go back rather than move on.

Here is the difference between a copied definition and an owned one:

| Term | Copied | Owned |
|---|---|---|
| Vulnerability | “A weakness in a system” | “The unlocked back window — a flaw that exists whether or not anyone finds it” |
| Exploit | “Code that takes advantage of a vulnerability” | “The person who tries the window — the vulnerability is the flaw; the exploit is the action” |
| Risk | “Potential for loss” | “The window is unlocked (vulnerability), the neighbourhood has burglars (threat), so the chance of a break-in is the risk” |

**Self-check:** cover the left column and explain each term aloud from memory. If you stall, that term needs another pass.

#### Exercise 2 — Audit your own account security

This is the only exercise in the phase that improves your life immediately, so do it in week one.

| Step | What you do | What healthy looks like |
|---|---|---|
| 1 | Install a password manager (Bitwarden free, or KeePassXC offline) | You can unlock it and it stores at least one entry |
| 2 | Check your email at **haveibeenpwned.com** | You know exactly which breaches include you — most people are in several |
| 3 | Change the password on your email account, and make it unique | The email account is the master key to everything else; it goes first |
| 4 | Turn on MFA for that email account | A code, an app, or a hardware key — not SMS if you can avoid it |
| 5 | Turn on MFA for your bank and any account holding money | Same |
| 6 | Write down which accounts still lack MFA | That list is your next week's work |

**Why email first:** whoever controls your email can reset the password on almost everything else. Securing it first protects every other account you own.

**Self-check:** can you name the one account that, if compromised, would cause you the most damage? If you cannot, you have not finished the audit.

#### Exercise 3 — Read a real advisory and extract the facts

Go to the National Vulnerability Database (nvd.nist.gov) and search for **CVE-2021-41773**, the Apache path-traversal flaw used as an example earlier in this lesson.

Answer these six questions from the page alone. Do not read a news article first — learn to read the primary source.

| Question | What you are looking for |
|---|---|
| What software and version is affected? | The affected product and version range |
| What is the flaw, in one sentence? | The description, in your own words |
| What can an attacker do with it? | Impact — read files, execute code, deny service |
| What is the severity score, and what does it mean? | The CVSS base score and its vector |
| What is the fix? | The patched version |
| How would you know if you were affected? | Version check, or log evidence |

**The interview version of this question** is: “Tell me about a vulnerability you have read about recently.” You now have a real answer with specifics, which is worth far more than a memorised definition.

#### Exercise 4 — Classify five findings by CIA

Sorting real findings into Confidentiality, Integrity and Availability is the fastest way to make the triad useful rather than abstract.

For each finding below, decide which property is primarily affected, and say what the *secondary* effect is. Answers follow.

| # | Finding |
|---|---|
| 1 | A database backup is stored unencrypted on a shared drive |
| 2 | An attacker alters the amount on a bank transfer record |
| 3 | Ransomware encrypts the file server |
| 4 | A website is flooded with traffic until it stops responding |
| 5 | An employee emails a customer list to their personal address |

**Answers:**

| # | Primary | Why | Secondary |
|---|---|---|---|
| 1 | Confidentiality | The data is readable by anyone with drive access | Integrity — you may never know who read it |
| 2 | Integrity | The record no longer reflects reality | Availability — the correct data is effectively gone |
| 3 | Availability | The files cannot be used | Confidentiality — stolen copies may also exist |
| 4 | Availability | The service is unreachable | Integrity — logs may be incomplete |
| 5 | Confidentiality | Data left the boundary | Integrity — no record of who else received it |

**Self-check:** for each answer you got wrong, write one sentence on why the primary property was the other one. Nearly every real incident touches two properties; naming the primary one is the skill.

#### Exercise 5 — Map phishing to MITRE ATT&CK

Open **attack.mitre.org** and find the technique for phishing. Then build this table for three more techniques a beginner should know.

| Tactic | Technique | What the attacker is trying to do | One way a defender would see it |
|---|---|---|---|
| Initial Access | Phishing (T1566) | Get a foothold by convincing a user to act | Mail filters, user reports, suspicious sender domains |
| Credential Access | *(find it yourself)* | | |
| Execution | *(find it yourself)* | | |
| Exfiltration | *(find it yourself)* | | |

**Why this matters in an interview:** “tactics are the *why*, techniques are the *how*” is a sentence that separates candidates who have used ATT&CK from candidates who have read about it. Filling this table is what earns you the right to say it.

#### Exercise 6 — Analyse a phishing email properly

Find a phishing email in your own spam folder. **Do not click anything in it**, and do not open attachments. Open the raw headers if you know how, or just read the message.

Write a one-page analysis with these four sections, in this order:

1. **What the attacker wanted** — credentials, a payment, a click, malware.
2. **Which technique they used** — name the ATT&CK technique and the psychological lever (urgency, authority, fear, curiosity).
3. **Why it is convincing** — the specifics: correct logo, plausible sender, a real-looking invoice number.
4. **What a defender or user should have done** — reporting, filtering, verifying out of band.

**Self-check:** keep it to one page. Concise reporting is a skill, and this is your first rep at it. If your analysis runs long, you are describing the email rather than analysing it.

#### Exercise 7 — Answer “what would you have done?”

Reading about an incident is easy. Deciding what you would have done, out loud, is the interview.

Pick one widely reported breach — a major retailer, a hospital group, a software supply chain — and write answers to these five questions. Use only public reporting.

| Question | What a strong answer does |
|---|---|
| What was the initial access? | Names the vector and how the attacker got in |
| Which control failed? | Names a specific control from Part 4, not “security was bad” |
| Which CIA property was affected? | Picks the primary one and justifies it |
| What would have detected it earlier? | Names a detection, not a product |
| What would you have done in the first hour? | Shows a sequence — contain, preserve evidence, escalate, communicate |

**This is the exercise to do last**, because it uses everything in Parts 1 to 5 at once. If you can answer all five from what you know rather than from the article, you are ready for Phase 2.

#### A note on what you have and have not done

You have now applied the core vocabulary to real material and secured your own accounts. That is genuinely more than most beginners do.

Be honest about the boundary when you talk about it:

| You can now | You cannot yet |
|---|---|
| Explain CIA, threat, vulnerability, exploit, control and risk with your own examples | Configure or harden a real system — that starts in Phase 2 |
| Read a CVE advisory and extract the facts that matter | Assess a vulnerability's real impact in a specific environment |
| Name phishing variants and map them to ATT&CK | Investigate a live phishing campaign or write detection logic |
| Say which control failed in a published breach | Build or tune that control yourself |

Saying that plainly in an interview is a strength. Overclaiming is the thing that ends the conversation.

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
