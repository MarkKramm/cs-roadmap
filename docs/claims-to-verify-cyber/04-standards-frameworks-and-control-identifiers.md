You are verifying technical claims from a training curriculum against
**primary sources** — Microsoft Learn, IANA, RFCs, POSIX man pages, and vendor
documentation.

The table below is complete and self-contained. Every row you need is here.

## What to do

For each row, replace the empty last column with exactly one of:

| Verdict | Format |
|---|---|
| `OK` | `OK` — then the **URL** that settles it, and a short quote from it |
| `WRONG` | `WRONG` — the correct value, **and** the URL that proves it |
| `UNVERIFIABLE` | `UNVERIFIABLE` — say briefly why (judgement, analogy, or simplification) |

## Rules

1. **Every `OK` and every `WRONG` must carry a source URL, and a quote from
   it that settles the claim.** The quote is not decoration: a URL alone says
   only that a page exists. If you cannot quote the line that decides the
   claim, the verdict is `UNVERIFIABLE`. A recollection is not a source.
2. **Prefer the authority over a page that agrees with it.** Rank sources:
   the standard itself (RFC, POSIX, FHS, IANA registry) > the vendor's own
   reference documentation > a vendor tutorial or blog > a forum answer or a
   third-party article. Use the highest rank you can reach, and **name the
   source type** in the verdict. A claim sourced to a forum post or a
   third-party tutorial is weaker evidence than the same claim sourced to the
   spec, and the reader needs to know which they are getting.
3. **Never cite a page you could not open or whose text you could not read.**
   If a source is paywalled, login-gated, blocked, or empty, it does not count
   as a source. Say so.
4. **Cite in the language you read.** If the only page you can reach is a
   localised version of the vendor's documentation, say that explicitly, and
   prefer finding the English original.
5. **Do not guess to fill a row.** An honest `UNVERIFIABLE` is a useful
   result; an invented URL is worse than no answer, because it will be acted on.
6. **Output the complete table, every row, in order.** Do not summarise, do not
   sample, do not stop early. If you run low on room, stop at a row boundary
   and say which row number to continue from.
7. **If any part of a row is unclear, say so in the verdict** (`UNVERIFIABLE —
   text truncated`) rather than inferring the claim. Never reconstruct a claim
   you cannot read.
8. Some short rows are followed by a small grey line showing the text above and
   below them. **That context is part of the claim** — use it.
9. `UNVERIFIABLE` is expected to be common and is not a failure. A great deal
   of this curriculum is teaching method, diagnostic reasoning, and worked
   examples, none of which is a fact about the world.

# Standards, frameworks and control identifiers


*NIST SP numbers, ISO/IEC numbers, PCI DSS requirements and OWASP categories are versioned documents with fixed numbering. A wrong control number points a reader at the wrong requirement.*

**Source to check against:** The published standard itself (NIST CSRC, ISO, PCI SSC, OWASP)

105 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-foundations.md:44` | - Basic frameworks: NIST CSF, MITRE ATT&CK, OWASP Top 10 | |
| | | <sub>↑ - Legal/ethical boundaries</sub> | |
| 2 | `01-phase-foundations.md:478` | \| **NIST CSF** \| Organises security work into six functions: Govern, Identify, Protect, Detect, Respond, Recover \| A coverage checklist. It shows you which part of the job an organisation is neglecting \| | |
| 3 | `01-phase-foundations.md:480` | \| **OWASP Top 10** \| The ten most critical web application security risks, maintained by the Open Worldwide Application Security Project \| Web-specific. Because your background includes web development, this is the framework you are best positioned to under … | |
| 4 | `01-phase-foundations.md:510` | It is genuinely useful in interviews. Being able to say “I have read the OWASP Top 10 and I understand why injection happens when you concatenate user input into a query” is a concrete, verifiable claim. | |
| 5 | `01-phase-foundations.md:737` | - **Frameworks are shared vocabularies.** NIST CSF is a coverage checklist, MITRE ATT&CK describes attacker behaviour, OWASP Top 10 covers web risk specifically. | |
| 6 | `01-phase-foundations.md:746` | 3. **Read the OWASP Top 10 through the lens of your web development background** (task 4). You have an advantage here over most beginners: you have probably written code that was vulnerable to injection without knowing it. Write your summary with that in mind. | |
| 7 | `01-phase-foundations.md:749` | 6. **Close with the NIST CSF task** (task 7) and read your own one-page summary back. If you can explain all six functions using an example of your own rather than one from this lesson, the phase's exit criteria are met and you are ready for Phase 2. | |
| 8 | `01-phase-foundations.md:760` | \| NIST CSF \| Security framework \| Free \| https://www.nist.gov/cyberframework \| Summarize Govern/Identify/Protect/Detect/Respond/Recover \| CIS Controls \| | |
| 9 | `01-phase-foundations.md:767` | - OWASP Top 10 — https://owasp.org/www-project-top-ten/ | |
| | | <sub>↑ - MITRE ATT&CK — https://attack.mitre.org/<br>↓ - CISA security tips — https://www.cisa.gov/news-events/news/cybersecurity-tips</sub> | |
| 10 | `01-phase-foundations.md:776` | 4. Read OWASP Top 10 and summarize each risk in 2–3 sentences. <!-- id: cyber-01-t04 band: focused energy: normal --> | |
| 11 | `01-phase-foundations.md:779` | 7. Read NIST CSF and write one example control for each function. <!-- id: cyber-01-t07 band: focused energy: normal --> | |
| 12 | `01-phase-foundations.md:786` | - OWASP Top 10 summary | |
| | | <sub>↑ - 50-term glossary<br>↓ - 5 MITRE technique summaries</sub> | |
| 13 | `01-phase-foundations.md:789` | - NIST CSF one-page summary | |
| | | <sub>↑ - One phishing analysis report</sub> | |
| 14 | `03-phase-security-fundamentals.md:29` | - Map simple attacks to MITRE ATT&CK and OWASP Top 10. | |
| | | <sub>↑ - Understand common weaknesses and controls.</sub> | |
| 15 | `03-phase-security-fundamentals.md:58` | - OWASP Top 10 | |
| | | <sub>↓ - SQL injection concept</sub> | |
| 16 | `03-phase-security-fundamentals.md:558` | The OWASP Top 10 was introduced in Phase 1 as a shared vocabulary. This part is where you learn to actually find and reason about the categories, and where your web development history becomes an asset. | |
| 17 | `03-phase-security-fundamentals.md:652` | **Broken access control** is the wider category — the OWASP Top 10's number one entry in recent editions. It covers IDOR plus two related bugs. | |
| 18 | `03-phase-security-fundamentals.md:781` | This is why CIS Controls puts inventory as Control 1 — first, before anything else — and why the phase's task asks you to map five controls to your home lab. Start where you are: for your home lab, list every machine, its OS, its services, and its purpose. Tha … | |
| 19 | `03-phase-security-fundamentals.md:1031` | If you have an old project, you will almost certainly find that your session cookie lacks `HttpOnly`. That discovery is worth more than reading the OWASP Top 10, because you found it yourself in your own code. | |
| 20 | `03-phase-security-fundamentals.md:1127` | \| CIS Controls \| Security controls framework \| Free \| https://www.cisecurity.org/controls \| Map 5 controls to home lab \| NIST CSF \| | |
| 21 | `03-phase-security-fundamentals.md:1131` | - OWASP Top 10 — https://owasp.org/www-project-top-ten/ | |
| | | <sub>↓ - PortSwigger Web Security Academy — https://portswigger.net/web-security</sub> | |
| 22 | `03-phase-security-fundamentals.md:1135` | - CIS Controls — https://www.cisecurity.org/controls | |
| | | <sub>↑ - Wazuh documentation — https://documentation.wazuh.com/<br>↓ - Microsoft security documentation — https://learn.microsoft.com/en-us/security/</sub> | |
| 23 | `05-phase-specialization-choice.md:835` | A pivot from SOC to GRC is mostly a **re-framing** exercise. Your Wazuh lab report becomes a control-effectiveness case study: the detection rule is a detective control, its tuning is a control gap you identified and closed, and the findings map to CIS Control … | |
| 24 | `05-phase-specialization-choice.md:937` | \| NIST CSF \| GRC framework \| Free \| https://www.nist.gov/cyberframework \| Map 10 controls \| CIS Controls \| | |
| 25 | `05-phase-specialization-choice.md:938` | \| CIS Controls \| Control framework \| Free \| https://www.cisecurity.org/controls \| Create small-business checklist \| NIST CSF \| | |
| 26 | `05-phase-specialization-choice.md:950` | - NIST CSF — https://www.nist.gov/cyberframework | |
| | | <sub>↑ - PortSwigger Academy — https://portswigger.net/web-security<br>↓ - CIS Controls — https://www.cisecurity.org/controls</sub> | |
| 27 | `05-phase-specialization-choice.md:951` | - CIS Controls — https://www.cisecurity.org/controls | |
| | | <sub>↑ - NIST CSF — https://www.nist.gov/cyberframework<br>↓ - OWASP Web Security Testing Guide — https://owasp.org/www-project-web-security-testing-guide/</sub> | |
| 28 | `11-phase-incident-response.md:39` | - NIST SP 800-61 incident response lifecycle: preparation, detection and analysis, containment, eradication, recovery, post-incident activity | |
| 29 | `11-phase-incident-response.md:117` | The canonical model is NIST SP 800-61, and it is worth learning by its real names because interviewers use them. **Note the revision:** SP 800-61 Rev. 3 (April 2025) superseded Rev. 2, and it restates these same stages as the *previous* life cycle model before … | |
| 30 | `11-phase-incident-response.md:1210` | - NIST SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management — https://csrc.nist.gov/pubs/sp/800/61/r3/final | |
| 31 | `11-phase-incident-response.md:1211` | - NIST SP 800-86 Guide to Integrating Forensic Techniques into Incident Response — https://csrc.nist.gov/pubs/sp/800/86/final | |
| 32 | `11-phase-incident-response.md:1389` | Volatility 3, Autopsy and The Sleuth Kit, FTK Imager, dc3dd, Eric Zimmerman's parsers, Plaso, CyberChef, WinPmem, and the SIFT Workstation together cover every technique this phase teaches, and every one of them is free and open source or free for the professi … | |
| 33 | `13-phase-grc-compliance.md:29` | - Map a control to a framework such as ISO 27001, NIST CSF, SOC 2, PCI DSS, or HIPAA. | |
| | | <sub>↑ - Build and score a risk register with a defined, defensible scale.<br>↓ - Write a policy a real employee could follow, and the standard it enforces.</sub> | |
| 34 | `13-phase-grc-compliance.md:33` | - Explain the privacy obligations in the Philippine Data Privacy Act and the GDPR in outline. | |
| | | <sub>↑ - Assess a vendor's security posture with a questionnaire and a documented decision.<br>↓ - Describe how a junior GRC analyst actually spends their working day.</sub> | |
| 35 | `13-phase-grc-compliance.md:44` | - Control frameworks: ISO/IEC 27001 and Annex A, NIST CSF 2.0, CIS Controls, SOC 2 Trust Services Criteria, PCI DSS, HIPAA | |
| 36 | `13-phase-grc-compliance.md:51` | - Privacy: the Philippine Data Privacy Act of 2012, GDPR principles and data subject rights | |
| | | <sub>↑ - Third-party and vendor risk management, and the questionnaire<br>↓ - Business continuity and disaster recovery at a governance level</sub> | |
| 37 | `13-phase-grc-compliance.md:443` | \| **NIST CSF 2.0** \| A voluntary framework organised around six functions: Govern, Identify, Protect, Detect, Respond, Recover \| Any organisation, any size, any sector \| Free \| No — it is not a certification scheme \| | |
| 38 | `13-phase-grc-compliance.md:444` | \| **ISO/IEC 27001** \| An international standard for an information security management system, with Annex A controls \| Organisations wanting a certifiable management system \| The standard is paid \| **Yes** — certification by an accredited body \| | |
| 39 | `13-phase-grc-compliance.md:445` | \| **CIS Controls** \| A prioritised set of 18 **Controls**, each broken into numbered **Safeguards**, with Implementation Groups for different maturity levels \| Organisations wanting a practical starting order \| Free \| No \| | |
| 40 | `13-phase-grc-compliance.md:446` | \| **SOC 2** \| An attestation against the 2017 Trust Services Criteria (revised 2022) — security, availability, processing integrity, confidentiality, privacy \| Service organisations whose customers ask \| The criteria are free to read; the audit is not \| * … | |
| 41 | `13-phase-grc-compliance.md:447` | \| **PCI DSS** \| A mandatory standard for organisations handling card payments \| Anyone storing, processing, or transmitting card data \| Free to read \| **Yes** — compliance validated by an assessor or self-assessment \| | |
| 42 | `13-phase-grc-compliance.md:448` | \| **HIPAA** \| United States law governing protected health information \| Anyone handling US patient data \| Free \| No — it is law, not a scheme \| | |
| 43 | `13-phase-grc-compliance.md:449` | \| **GDPR** \| European Union law governing personal data of EU residents \| Anyone processing EU residents' data \| Free \| No \| | |
| 44 | `13-phase-grc-compliance.md:452` | **The certification column is the one that drives business decisions.** An organisation pursues ISO 27001 certification or a SOC 2 report because a customer, a tender, or a regulator requires it — not because the framework is better than the alternatives. | |
| 45 | `13-phase-grc-compliance.md:454` | **One vocabulary trap worth knowing before you read any of them.** These frameworks each use the word "control" differently, and the CIS Controls are the easiest to get wrong. CIS has **18 Controls** — the numbered headings, such as *Control 1: Inventory and C … | |
| 46 | `13-phase-grc-compliance.md:456` | So when someone says "CIS Control 5", they mean a whole topic area, and when they say "Safeguard 5.3", they mean one specific thing to do. Mixing the two up in an interview is a small tell that you read a summary rather than the document. | |
| 47 | `13-phase-grc-compliance.md:458` | CIS also publishes **Implementation Groups (IG1, IG2, IG3)**, which are subsets of the Safeguards sized to an organisation's maturity and resources. IG1 is the basic hygiene set for a small organisation with limited security staff, and it is the sensible start … | |
| 48 | `13-phase-grc-compliance.md:518` | SOC 2 is not a standard you implement. It is a report an auditor produces about you, against the Trust Services Criteria. | |
| 49 | `13-phase-grc-compliance.md:534` | \| **PCI DSS** \| You store, process, or transmit cardholder data \| Twelve requirement groups covering network security, protection of stored data, access control, monitoring, and testing \| The card brands, through acquiring banks \| | |
| 50 | `13-phase-grc-compliance.md:535` | \| **HIPAA** \| You handle protected health information of US individuals \| Administrative, physical, and technical safeguards, plus breach notification \| US Department of Health and Human Services \| | |
| 51 | `13-phase-grc-compliance.md:537` | \| **GDPR** \| You process personal data of EU residents \| Lawful basis, data subject rights, records of processing, breach notification within 72 hours of becoming aware where required \| EU supervisory authorities \| | |
| 52 | `13-phase-grc-compliance.md:539` | **On PCI DSS versions:** the current standard is v4.0.1, a limited revision of v4.0 that adds clarifications but no new or deleted requirements. v3.2.1 retired on 31 March 2024. The **future-dated** requirements inside v4 — the ones that were best practice at  … | |
| 53 | `13-phase-grc-compliance.md:541` | **One control satisfies several frameworks**, and this is the observation that makes control mapping efficient rather than exhausting. Note how the first row is worded: **wherever card data is reachable**, not "on remote access". PCI DSS v4.0 requires MFA for  … | |
| 54 | `13-phase-grc-compliance.md:543` | The identifiers in the right-hand column are framework-specific. `PR.AA`, `DE.CM` and `PR.AT` are NIST CSF categories; `CC1`–`CC9` are the SOC 2 Common Criteria (CC6 is logical access, CC7 is system operations, CC1 and CC2 cover the control environment and com … | |
| 55 | `13-phase-grc-compliance.md:547` | \| Multi-factor authentication wherever card data is reachable \| NIST CSF PR.AA; ISO 27001 access control; PCI DSS requirement 8; SOC 2 CC6; a Data Privacy Act security measure \| | |
| 56 | `13-phase-grc-compliance.md:548` | \| Centralised log collection with alerting \| NIST CSF DE.CM; ISO 27001 logging; PCI DSS requirement 10; SOC 2 CC7 \| | |
| 57 | `13-phase-grc-compliance.md:549` | \| Annual security awareness training with records \| NIST CSF PR.AT; ISO 27001 competence and awareness; PCI DSS requirement 12; SOC 2 CC1 and CC2 \| | |
| 58 | `13-phase-grc-compliance.md:638` | **The customer audit is the one that surprises people in a BPO or SaaS role**, and it is the reason SOC 2 exists. A large client will send a questionnaire, ask for evidence, and sometimes send an assessor. Answering those questionnaires accurately is a substan … | |
| 59 | `13-phase-grc-compliance.md:807` | \| **Payment processor** \| Card data and regulatory scope \| PCI DSS attestation of compliance \| | |
| | | <sub>↑ \| **Software vendor** \| Supply chain compromise \| Dependency scanning, patch process, vendor notification terms \|<br>↓ \| **Offshore BPO partner** \| Data protection and jurisdiction \| Data processing agreement, privacy assessment, audit rights \|</sub> | |
| 60 | `13-phase-grc-compliance.md:822` | \| **Certifications** \| Do you hold ISO 27001, SOC 2 Type II, or equivalent? \| "We follow industry best practice" \| | |
| 61 | `13-phase-grc-compliance.md:842` ▶ | SOC 2 Type II Yes — report dated 2025-11, no exceptions | |
| | | <sub>↑ Encryption at rest Yes — AES-256, stated<br>↓ Sub-processors disclosed Yes — three listed, one in a different jurisdiction</sub> | |
| 62 | `13-phase-grc-compliance.md:899` | If your employer serves European customers, GDPR applies to the personal data of EU residents regardless of where your organisation is. | |
| 63 | `13-phase-grc-compliance.md:912` | \| Alignment between GDPR and the Philippine law \| Effect on your work \| | |
| | | <sub>↓ \|---\|---\|</sub> | |
| 64 | `13-phase-grc-compliance.md:992` ▶ | 14:00 Vendor assessment: a new analytics tool. Read the SOC 2 report, | |
| | | <sub>↑ Chase two people who have not replied.<br>↓ note the sub-processors, and draft the decision record.</sub> | |
| 65 | `13-phase-grc-compliance.md:1019` ▶ | 15:00 Read the new NIST CSF mapping the auditor sent and check it | |
| | | <sub>↑ 13:00 Write up the workshop and update the register.<br>↓ against your control matrix.</sub> | |
| 66 | `13-phase-grc-compliance.md:1048` | \| Sharing a vendor's SOC 2 report \| Almost always restricted by the vendor's terms; check before circulating \| | |
| 67 | `13-phase-grc-compliance.md:1094` | \| **Control matrix** \| Map ten controls to NIST CSF 2.0 subcategories, plus a second column showing the ISO 27001 or PCI DSS requirement each also satisfies \| | |
| 68 | `13-phase-grc-compliance.md:1121` | \| "Which framework would you use?" \| "It depends on what the business needs to demonstrate" — then name the trigger: a customer asking for SOC 2, a tender requiring ISO 27001, card payments requiring PCI DSS \| | |
| 69 | `13-phase-grc-compliance.md:1198` | Ten controls mapped to NIST CSF 2.0, plus the second framework each also satisfies. Note that three rows are not "pass". | |
| 70 | `13-phase-grc-compliance.md:1273` | \| Independent assurance? \| SOC 2 report from 2023 \| Acceptable with **condition** — request the current report at renewal \| | |
| 71 | `13-phase-grc-compliance.md:1277` | **Residual risk accepted:** the 2023 SOC 2 report does not cover the current year. Accepted by the Compliance Manager, recorded in the risk register as R-05, with re-review at contract renewal. | |
| 72 | `13-phase-grc-compliance.md:1296` | - **Learn NIST CSF 2.0 first.** It is free, sector-neutral, and its six functions are the vocabulary the field actually uses. | |
| 73 | `13-phase-grc-compliance.md:1298` | - **SOC 2 Type II tests operating effectiveness over a period**; Type I tests design at a point in time, and customers ask for Type II. | |
| 74 | `13-phase-grc-compliance.md:1316` | 4. **Read one framework properly** (task 4) — NIST CSF 2.0 is the right choice — and write down ten subcategory identifiers with your own paraphrase of each. Do not attempt to learn all of them; learn how the structure works. | |
| 75 | `13-phase-grc-compliance.md:1329` | \| NIST Cybersecurity Framework 2.0 \| Voluntary risk framework \| Free \| https://www.nist.gov/cyberframework \| Write your own paraphrase of ten subcategories \| CIS Controls \| | |
| 76 | `13-phase-grc-compliance.md:1330` | \| CIS Controls \| Prioritised safeguard list \| Free \| https://www.cisecurity.org/controls \| Map five of your controls to CIS safeguards \| NIST CSF \| | |
| 77 | `13-phase-grc-compliance.md:1331` | \| ISO/IEC 27001 \| Certifiable management system standard \| Paid \| https://www.iso.org/standard/27001 \| Read the public overview and list the Annex A themes \| NIST CSF, which is free and covers similar ground \| | |
| 78 | `13-phase-grc-compliance.md:1332` | \| SOC 2 Trust Services Criteria \| Attestation criteria \| Free \| https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 \| Read the security criteria and note three you could map to \| ISO 27001 Annex A, or NIST CSF \| | |
| 79 | `13-phase-grc-compliance.md:1333` | \| PCI DSS \| Card payment standard \| Free \| https://www.pcisecuritystandards.org/ \| Read the twelve requirement groups and summarise each in a line \| PCI SSC document library, free with registration \| | |
| 80 | `13-phase-grc-compliance.md:1334` | \| HHS HIPAA resources \| US health data rules \| Free \| https://www.hhs.gov/hipaa/index.html \| Read the Security Rule safeguards summary \| NIST SP 800-66, free \| | |
| 81 | `13-phase-grc-compliance.md:1335` | \| National Privacy Commission \| Philippine data privacy regulator \| Free \| https://privacy.gov.ph/ \| Read the breach notification guidance and note who decides \| GDPR guidance from the EDPB \| | |
| 82 | `13-phase-grc-compliance.md:1336` | \| NIST SP 800-30 \| Risk assessment guide \| Free \| https://csrc.nist.gov/pubs/sp/800/30/r1/final \| Use its likelihood and impact language in your scale \| ISO 31000 overview material \| | |
| 83 | `13-phase-grc-compliance.md:1345` | - NIST SP 800-30 risk assessment guide — https://csrc.nist.gov/pubs/sp/800/30/r1/final | |
| | | <sub>↑ - NIST Cybersecurity Framework 2.0 — https://www.nist.gov/cyberframework<br>↓ - NIST SP 800-53 control catalogue — https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final</sub> | |
| 84 | `13-phase-grc-compliance.md:1346` | - NIST SP 800-53 control catalogue — https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final | |
| | | <sub>↑ - NIST SP 800-30 risk assessment guide — https://csrc.nist.gov/pubs/sp/800/30/r1/final<br>↓ - CIS Controls — https://www.cisecurity.org/controls</sub> | |
| 85 | `13-phase-grc-compliance.md:1347` | - CIS Controls — https://www.cisecurity.org/controls | |
| | | <sub>↑ - NIST SP 800-53 control catalogue — https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final<br>↓ - CIS Benchmarks — https://www.cisecurity.org/cis-benchmarks</sub> | |
| 86 | `13-phase-grc-compliance.md:1348` | - CIS Benchmarks — https://www.cisecurity.org/cis-benchmarks | |
| | | <sub>↑ - CIS Controls — https://www.cisecurity.org/controls<br>↓ - AICPA SOC 2 overview — https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2</sub> | |
| 87 | `13-phase-grc-compliance.md:1349` | - AICPA SOC 2 overview — https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 | |
| 88 | `13-phase-grc-compliance.md:1351` | - ISO/IEC 27001 overview — https://www.iso.org/standard/27001 | |
| | | <sub>↑ - PCI Security Standards Council — https://www.pcisecuritystandards.org/<br>↓ - HHS HIPAA Security Rule — https://www.hhs.gov/hipaa/for-professionals/security/index.html</sub> | |
| 89 | `13-phase-grc-compliance.md:1352` | - HHS HIPAA Security Rule — https://www.hhs.gov/hipaa/for-professionals/security/index.html | |
| | | <sub>↑ - ISO/IEC 27001 overview — https://www.iso.org/standard/27001<br>↓ - National Privacy Commission of the Philippines — https://privacy.gov.ph/</sub> | |
| 90 | `13-phase-grc-compliance.md:1355` | - GDPR official text — https://eur-lex.europa.eu/eli/reg/2016/679/oj | |
| | | <sub>↑ - Philippine Data Privacy Act of 2012 — https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html<br>↓ - EDPB guidelines and recommendations — https://www.edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_en</sub> | |
| 91 | `13-phase-grc-compliance.md:1363` | 4. Read NIST CSF 2.0 and write your own paraphrase of ten subcategories with their identifiers. <!-- id: cyber-13-t04 band: focused energy: normal --> | |
| 92 | `13-phase-grc-compliance.md:1378` | - A ten-row control matrix mapping to NIST CSF 2.0 and a second framework, including Partial, Fail, and Not-tested rows | |
| 93 | `13-phase-grc-compliance.md:1493` | **Why:** The phase asks for the privacy obligations in outline — the DPA and the GDPR principles and rights — not an exhaustive legal reading. Assuming the Act stops at cloud-hosted data is the trap, because where the data is stored does not decide whether the … | |
| 94 | `13-phase-grc-compliance.md:1523` | NIST CSF 2.0, the CIS Controls and Benchmarks, NIST SP 800-30 and SP 800-53, the AICPA's published SOC 2 criteria, the PCI DSS document library, the HHS HIPAA guidance, the National Privacy Commission's guidance, and the GDPR text are all free and together the … | |
| 95 | `13-phase-grc-compliance.md:1527` | The ISO/IEC 27001 standard itself is a paid document, and certification requires an accredited certification body, an audit, and annual surveillance — a five-figure commitment for a small organisation. GRC platforms such as ServiceNow GRC, Archer, and Vanta au … | |
| 96 | `13-phase-grc-compliance.md:1531` | Pay when a customer or a tender requires a certification you do not hold, or when the manual evidence collection has grown past what a person can maintain — and at that point the employer pays, not you. For a learner, the honest position is that this phase cos … | |
| 97 | `14-phase-web-app-security.md:27` | - Identify which OWASP Top 10 category a flaw belongs to, and explain why. | |
| | | <sub>↑ - Read an HTTP request and response in full, including headers that carry security meaning.<br>↓ - Test for injection, cross-site scripting, CSRF, IDOR, and SSRF on an authorised target.</sub> | |
| 98 | `14-phase-web-app-security.md:40` | - OWASP Top 10 in depth: all ten categories, taught by name rather than by number because the numbering moves between editions (the current edition is **2025**; 2021 is still widely quoted) | |
| 99 | `14-phase-web-app-security.md:63` | Most people arriving at web application security have to learn two things at once: how the web works, and how it breaks. You already know the first. You know what a POST request is, and you know what a session cookie does. You have almost certainly written cod … | |
| 100 | `14-phase-web-app-security.md:252` | **Read this before the sections below, because the numbering has moved.** The current edition is **OWASP Top 10:2025**, and it reordered six of the ten categories relative to 2021. The sections below are ordered and named to match **2025**. Learn the categorie … | |
| 101 | `14-phase-web-app-security.md:924` ▶ | **OWASP Top 10:** A01 Broken Access Control | |
| | | <sub>↑ **CVSS 3.1:** 6.5 — AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N<br>↓ **CWE:** CWE-639 — Authorization Bypass Through User-Controlled Key (CWE is the Common Weakness Enumeration, the shared catalogue of flaw types; the n …</sub> | |
| 102 | `14-phase-web-app-security.md:1271` | \| Work the OWASP Top 10 as a checklist \| Prioritise findings against a real threat model and a real deadline \| | |
| 103 | `14-phase-web-app-security.md:1332` | - OWASP Top 10 — https://owasp.org/www-project-top-ten/ | |
| | | <sub>↓ - OWASP Web Security Testing Guide — https://owasp.org/www-project-web-security-testing-guide/</sub> | |
| 104 | `14-phase-web-app-security.md:1505` | You can read a web application's request and response, identify which OWASP Top 10 category a flaw belongs to, demonstrate it safely against an authorised lab target with Burp Suite, and write a finding with reproduction steps and a specific remediation. | |
| 105 | `14-phase-web-app-security.md:1511` | PortSwigger Web Security Academy is free and is the best structured web security training that exists, covering every OWASP category from Apprentice to Expert. OWASP Juice Shop, DVWA, WebGoat, and bWAPP are free and you run them locally. Burp Suite Community a … | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._
