// Record the 2026-09-17 cyber verification verdicts back into the worklist.
//
// The verdicts arrived as four tables in a conversation, not as a file. Typing 123
// of them by hand is how transcription errors enter a record whose entire value is
// that it can be trusted, so the returned rows are keyed by LOCATION (file:line)
// and written programmatically. A key that matches no row is reported rather than
// dropped: a silently unmatched verdict looks identical to a verdict that was
// never supplied.
//
// WHAT IS WRITTEN, AND WHY IT IS SHORT
// The full returned text for 123 rows is far too large for one Markdown table cell,
// and the source URL is the part that matters -- a verdict without a source is not
// a verdict. Each row records the verdict plus the authority cited, which is
// enough for a reader to re-derive the detail. Rows the verifier marked with a
// direct quote keep the quote.
//
// Run: node scripts/record-cyber-verdicts.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DOC = path.join(ROOT, "docs", "CYBER-CLAIM-VERIFICATION.md");

// location -> [verdict, source-or-note]
const V = {
  // ---- Standards, frameworks and control identifiers (105) ----
  "01-phase-foundations.md:44": ["UNVERIFIABLE", "curriculum topic outline, not a claim about a standard's content"],
  "01-phase-foundations.md:478": ["OK", "NIST: “The CSF 2.0 is organized by six Functions — Govern, Identify, Protect, Detect, Respond, and Recover.”"],
  "01-phase-foundations.md:480": ["OK", "OWASP: the Top 10 is “The Ten Most Critical Web Application Security Risks.”"],
  "01-phase-foundations.md:510": ["UNVERIFIABLE", "pedagogical advice about interview preparation"],
  "01-phase-foundations.md:737": ["UNVERIFIABLE", "pedagogical characterisation of three frameworks"],
  "01-phase-foundations.md:746": ["UNVERIFIABLE", "curriculum instruction"],
  "01-phase-foundations.md:749": ["OK", "NIST: CSF 2.0 has six functions — Govern, Identify, Protect, Detect, Respond, Recover."],
  "01-phase-foundations.md:760": ["OK", "NIST: the six functions are correctly listed."],
  "01-phase-foundations.md:767": ["OK", "owasp.org — resolves to the official Top 10 project page."],
  "01-phase-foundations.md:776": ["UNVERIFIABLE", "curriculum task instruction"],
  "01-phase-foundations.md:779": ["UNVERIFIABLE", "curriculum task instruction"],
  "01-phase-foundations.md:786": ["UNVERIFIABLE", "deliverable description"],
  "01-phase-foundations.md:789": ["UNVERIFIABLE", "deliverable description"],
  "03-phase-security-fundamentals.md:29": ["UNVERIFIABLE", "curriculum learning objective"],
  "03-phase-security-fundamentals.md:58": ["UNVERIFIABLE", "topic outline"],
  "03-phase-security-fundamentals.md:558": ["UNVERIFIABLE", "curriculum narrative"],
  "03-phase-security-fundamentals.md:652": ["OK", "OWASP: A01:2021 is Broken Access Control, the number one entry."],
  "03-phase-security-fundamentals.md:781": ["OK", "CIS: Critical Security Controls v8 Control 1 is “Inventory and Control of Enterprise Assets.”"],
  "03-phase-security-fundamentals.md:1031": ["UNVERIFIABLE", "pedagogical opinion"],
  "03-phase-security-fundamentals.md:1127": ["OK", "cisecurity.org — CIS Controls are freely available at the cited URL."],
  "03-phase-security-fundamentals.md:1131": ["OK", "owasp.org — resolves to the official Top 10 project page."],
  "03-phase-security-fundamentals.md:1135": ["OK", "cisecurity.org — resolves to the official CIS Controls page."],
  "05-phase-specialization-choice.md:835": ["UNVERIFIABLE", "career-advice narrative"],
  "05-phase-specialization-choice.md:937": ["OK", "NIST CSF is freely available at the cited URL."],
  "05-phase-specialization-choice.md:938": ["OK", "CIS Controls are freely available at the cited URL."],
  "05-phase-specialization-choice.md:950": ["OK", "nist.gov — resolves to the official CSF page."],
  "05-phase-specialization-choice.md:951": ["OK", "cisecurity.org — resolves to the official CIS Controls page."],
  "11-phase-incident-response.md:39": ["OK", "NIST SP 800-61 Rev. 3: the life cycle model is Detect, Respond, Recover."],
  "11-phase-incident-response.md:117": ["OK", "NIST: SP 800-61 Rev. 3 was published in 2025 and supersedes Rev. 2."],
  "11-phase-incident-response.md:1210": ["OK", "csrc.nist.gov — resolves to the SP 800-61 Rev. 3 publication page."],
  "11-phase-incident-response.md:1211": ["OK", "csrc.nist.gov — resolves to the SP 800-86 publication page."],
  "11-phase-incident-response.md:1389": ["UNVERIFIABLE", "curriculum tool-coverage and licensing claim"],
  "13-phase-grc-compliance.md:29": ["UNVERIFIABLE", "learning objective"],
  "13-phase-grc-compliance.md:33": ["UNVERIFIABLE", "learning objective"],
  "13-phase-grc-compliance.md:44": ["OK", "ISO: ISO/IEC 27001 is an ISMS standard with Annex A controls."],
  "13-phase-grc-compliance.md:51": ["OK", "EU: GDPR (Regulation 2016/679) is the EU data protection law."],
  "13-phase-grc-compliance.md:443": ["OK", "NIST: “The CSF 2.0 is organized by six Functions — Govern, Identify, Protect, Detect, Respond, and Recover.”"],
  "13-phase-grc-compliance.md:444": ["OK", "ISO: “ISO/IEC 27001 is the world's best-known standard for information security management systems (ISMS).”"],
  "13-phase-grc-compliance.md:445": ["OK", "CIS: Controls v8 has 18 Controls with numbered Safeguards and Implementation Groups IG1–IG3."],
  "13-phase-grc-compliance.md:446": ["OK", "AICPA: SOC 2 examinations are against the Trust Services Criteria."],
  "13-phase-grc-compliance.md:447": ["OK", "PCI SSC: PCI DSS applies to all entities that store, process or transmit cardholder data."],
  "13-phase-grc-compliance.md:448": ["OK", "HHS: HIPAA is US law governing protected health information."],
  "13-phase-grc-compliance.md:449": ["OK", "EU: GDPR governs processing of EU residents' personal data."],
  "13-phase-grc-compliance.md:452": ["UNVERIFIABLE", "business claim about organisational motivation"],
  "13-phase-grc-compliance.md:454": ["OK", "CIS: v8 has 18 Controls, each broken into Safeguards."],
  "13-phase-grc-compliance.md:456": ["OK", "CIS: “Controls” names the 18 top-level categories; “Safeguards” the numbered items."],
  "13-phase-grc-compliance.md:458": ["OK", "CIS: v8 defines three Implementation Groups as subsets of safeguards."],
  "13-phase-grc-compliance.md:518": ["OK", "AICPA: SOC 2 is an attestation report produced by a CPA."],
  "13-phase-grc-compliance.md:534": ["OK", "PCI SSC: PCI DSS has 12 core requirement groups."],
  "13-phase-grc-compliance.md:535": ["OK", "HHS: the HIPAA Security Rule requires administrative, physical and technical safeguards."],
  "13-phase-grc-compliance.md:537": ["OK", "EU: GDPR Article 33 requires notification within 72 hours."],
  "13-phase-grc-compliance.md:539": ["OK", "PCI SSC: v4.0.1 was published June 2024 as a limited revision of v4.0."],
  "13-phase-grc-compliance.md:541": ["OK", "PCI SSC: v4.0 Requirement 8.5.1 requires MFA for all access into the CDE."],
  "13-phase-grc-compliance.md:543": ["OK", "NIST CSF 2.0 includes PR.AA, DE.CM, PR.AT; SOC 2 Common Criteria are CC1–CC9."],
  "13-phase-grc-compliance.md:547": ["OK", "PCI DSS Requirement 8 addresses MFA; NIST CSF PR.AA covers access control."],
  "13-phase-grc-compliance.md:548": ["OK", "PCI DSS Requirement 10 is “Log and monitor all access.”"],
  "13-phase-grc-compliance.md:549": ["OK", "NIST CSF PR.AT covers “Awareness and Training.”"],
  "13-phase-grc-compliance.md:638": ["UNVERIFIABLE", "career-advice narrative"],
  "13-phase-grc-compliance.md:807": ["OK", "PCI SSC: the Attestation of Compliance is the formal PCI DSS validation document."],
  "13-phase-grc-compliance.md:822": ["UNVERIFIABLE", "vendor questionnaire guidance"],
  "13-phase-grc-compliance.md:842": ["UNVERIFIABLE", "worked example in curriculum material"],
  "13-phase-grc-compliance.md:899": ["OK", "EU: GDPR applies to data subjects in the Union regardless of the controller's location."],
  "13-phase-grc-compliance.md:912": ["UNVERIFIABLE", "table header"],
  "13-phase-grc-compliance.md:992": ["UNVERIFIABLE", "worked example"],
  "13-phase-grc-compliance.md:1019": ["UNVERIFIABLE", "worked example"],
  "13-phase-grc-compliance.md:1048": ["UNVERIFIABLE", "practical advice"],
  "13-phase-grc-compliance.md:1094": ["UNVERIFIABLE", "deliverable description"],
  "13-phase-grc-compliance.md:1121": ["UNVERIFIABLE", "interview advice"],
  "13-phase-grc-compliance.md:1198": ["UNVERIFIABLE", "deliverable description"],
  "13-phase-grc-compliance.md:1273": ["UNVERIFIABLE", "worked example"],
  "13-phase-grc-compliance.md:1277": ["UNVERIFIABLE", "worked example"],
  "13-phase-grc-compliance.md:1296": ["OK", "NIST: CSF 2.0 is freely available and organised by six functions."],
  "13-phase-grc-compliance.md:1298": ["OK", "AICPA: SOC 2 Type II tests operating effectiveness over a period."],
  "13-phase-grc-compliance.md:1316": ["UNVERIFIABLE", "curriculum advice"],
  "13-phase-grc-compliance.md:1329": ["OK", "NIST: CSF 2.0 is voluntary and freely available at the cited URL."],
  "13-phase-grc-compliance.md:1330": ["OK", "CIS Controls are freely available at the cited URL."],
  "13-phase-grc-compliance.md:1331": ["OK", "ISO: ISO/IEC 27001 is certifiable and the standard document is paid."],
  "13-phase-grc-compliance.md:1332": ["OK", "AICPA: the Trust Services Criteria are freely available."],
  "13-phase-grc-compliance.md:1333": ["OK", "PCI SSC: PCI DSS has 12 requirement groups; the document library is free."],
  "13-phase-grc-compliance.md:1334": ["OK", "HHS: HIPAA resources are freely available."],
  "13-phase-grc-compliance.md:1335": ["OK", "Philippine government: the National Privacy Commission is the data privacy regulator."],
  "13-phase-grc-compliance.md:1336": ["OK", "NIST: SP 800-30 Rev. 1 is the Guide for Conducting Risk Assessments, free at the cited URL."],
  "13-phase-grc-compliance.md:1345": ["OK", "csrc.nist.gov — resolves to the SP 800-30 Rev. 1 publication page."],
  "13-phase-grc-compliance.md:1346": ["OK", "csrc.nist.gov — resolves to the SP 800-53 Rev. 5 publication page."],
  "13-phase-grc-compliance.md:1347": ["OK", "cisecurity.org — resolves to the official CIS Controls page."],
  "13-phase-grc-compliance.md:1348": ["OK", "cisecurity.org — resolves to the official CIS Benchmarks page."],
  "13-phase-grc-compliance.md:1349": ["OK", "aicpa-cima.com — resolves to the official AICPA SOC 2 page."],
  "13-phase-grc-compliance.md:1351": ["OK", "iso.org — resolves to the official ISO/IEC 27001 page."],
  "13-phase-grc-compliance.md:1352": ["OK", "hhs.gov — resolves to the official HIPAA Security Rule page."],
  "13-phase-grc-compliance.md:1355": ["OK", "eur-lex.europa.eu — resolves to the official GDPR text."],
  "13-phase-grc-compliance.md:1363": ["UNVERIFIABLE", "curriculum task instruction"],
  "13-phase-grc-compliance.md:1378": ["UNVERIFIABLE", "deliverable description"],
  "13-phase-grc-compliance.md:1493": ["UNVERIFIABLE", "pedagogical guidance"],
  "13-phase-grc-compliance.md:1523": ["OK", "All cited documents are freely available from their issuing authorities."],
  "13-phase-grc-compliance.md:1527": ["OK", "ISO: ISO/IEC 27001 is a paid document; certification requires an accredited body."],
  "13-phase-grc-compliance.md:1531": ["UNVERIFIABLE", "career-advice narrative"],
  "14-phase-web-app-security.md:27": ["UNVERIFIABLE", "learning objective"],
  "14-phase-web-app-security.md:40": ["OK", "owasp.org: “The most current released version is the OWASP Top 10 2025.”"],
  "14-phase-web-app-security.md:63": ["UNVERIFIABLE", "pedagogical narrative"],
  "14-phase-web-app-security.md:252": ["OK", "owasp.org: “The most current released version is the OWASP Top 10 2025.”"],
  "14-phase-web-app-security.md:924": ["OK", "OWASP: A01 is Broken Access Control."],
  "14-phase-web-app-security.md:1271": ["UNVERIFIABLE", "comparison of two approaches"],
  "14-phase-web-app-security.md:1332": ["OK", "owasp.org — resolves to the official Top 10 project page."],
  "14-phase-web-app-security.md:1505": ["UNVERIFIABLE", "learning outcome description"],
  "14-phase-web-app-security.md:1511": ["UNVERIFIABLE", "“best structured web security training that exists” is a subjective superlative"],

  // ---- CVE identifiers and vulnerability claims (4) ----
  "01-phase-foundations.md:203": ["OK", "NVD: “CVE-2021-41773: A flaw was found in a change made to path normalization in Apache HTTP Server 2.4.49.”"],
  "01-phase-foundations.md:629": ["OK", "NVD: CVE-2021-41773 is the Apache HTTP Server path traversal flaw."],
  "03-phase-security-fundamentals.md:723": ["OK", "NVD: CVE-2021-44228 is Log4Shell; the table correctly identifies CVE as an identifier format."],
  "03-phase-security-fundamentals.md:740": ["OK", "FIRST: CVSS metrics include Attack Vector, Privileges Required, and C/I/A Impact."],

  // ---- Cryptography algorithm claims (5) ----
  "02-phase-networking-and-linux.md:677": ["OK", "OpenSSH: `-t ed25519` generates an Ed25519 keypair."],
  "11-phase-incident-response.md:458": ["OK", "Forensics documentation: Amcache.hve in C:\\Windows\\AppCompat\\Programs stores path, size, compile time and SHA-1 hash."],
  "11-phase-incident-response.md:466": ["UNVERIFIABLE", "“single most under-used artefact by beginners” is a subjective judgement; the SHA-1 component is verified at row 2"],
  "11-phase-incident-response.md:1244": ["UNVERIFIABLE", "instruction about what a learner should record"],
  "14-phase-web-app-security.md:392": ["OK", "OWASP Password Storage Cheat Sheet recommends Argon2id and scrypt, and warns against fast hashes such as MD5 and SHA-1."],

  // ---- Product versions and editions (9) ----
  "02-phase-networking-and-linux.md:683": ["OK", "Microsoft: the Windows OpenSSH client does not include `ssh-copy-id`."],
  "04-phase-hands-on-labs.md:814": ["UNVERIFIABLE", "lab environment configuration example"],
  "04-phase-hands-on-labs.md:815": ["UNVERIFIABLE", "lab environment configuration example"],
  "04-phase-hands-on-labs.md:816": ["UNVERIFIABLE", "lab environment configuration example"],
  "11-phase-incident-response.md:486": ["UNVERIFIABLE", "scenario description"],
  "11-phase-incident-response.md:688": ["UNVERIFIABLE", "scenario description"],
  "11-phase-incident-response.md:991": ["UNVERIFIABLE", "scenario description"],
  "12-phase-scripting-automation.md:1240": ["OK", "Python 3.10 is a specific release; “3.10 or newer” is a valid version requirement."],
  "13-phase-grc-compliance.md:164": ["UNVERIFIABLE", "definition plus example"],

  // ---- Command and cmdlet usage (60) ----
  "02-phase-networking-and-linux.md:53": ["UNVERIFIABLE", "curriculum topic outline"],
  "02-phase-networking-and-linux.md:54": ["OK", "systemd: `systemctl` is the control interface for the systemd system and service manager."],
  "02-phase-networking-and-linux.md:56": ["OK", "POSIX/GNU man pages: grep searches text, awk processes fields, sort orders lines, uniq collapses duplicates, zgrep searches compressed files."],
  "02-phase-networking-and-linux.md:57": ["OK", "iproute2/BIND/curl: `ip a` shows addresses, `ip route` routing, `ss -tulpn` listening sockets, `dig` DNS lookups, `curl` transfers data."],
  "02-phase-networking-and-linux.md:58": ["OK", "POSIX: grep, awk and sed are standard text-processing utilities."],
  "02-phase-networking-and-linux.md:115": ["OK", "OpenSSH: `ssh user@host` is the standard login syntax."],
  "02-phase-networking-and-linux.md:405": ["OK", "RFC 792: ICMP defines Echo Request (Type 8), Echo Reply (Type 0), Destination Unreachable (Type 3) and Time Exceeded (Type 11)."],
  "02-phase-networking-and-linux.md:436": ["OK", "Set-Cookie (RFC 6265), Content-Security-Policy (W3C CSP) and Authorization (RFC 7235) are real HTTP headers."],
  "02-phase-networking-and-linux.md:439": ["OK", "curl: `-I` sends a HEAD request and prints response headers."],
  "02-phase-networking-and-linux.md:575": ["OK", "chmod: mode 755 is rwxr-xr-x."],
  "02-phase-networking-and-linux.md:576": ["OK", "chmod: mode 600 is rw-------, which is what SSH requires for a private key."],
  "02-phase-networking-and-linux.md:577": ["OK", "chmod: mode 644 is rw-r--r--."],
  "02-phase-networking-and-linux.md:579": ["OK", "chown: `chown user:group file` changes ownership; only root may give a file away."],
  "02-phase-networking-and-linux.md:607": ["OK", "POSIX umask: “The umask utility shall set the file mode creation mask… affects the initial value of the file permission bits of subsequently created files.”"],
  "02-phase-networking-and-linux.md:609": ["OK", "POSIX umask: a permissive mask yields more permissive permissions on files created afterwards."],
  "02-phase-networking-and-linux.md:661": ["OK", "OpenSSH: sshd is the SSH daemon, configured in /etc/ssh/sshd_config, listening on port 22 by default."],
  "02-phase-networking-and-linux.md:683": ["OK", "Microsoft: the Windows OpenSSH client does not include `ssh-copy-id`."],
  "02-phase-networking-and-linux.md:702": ["OK", "systemd is the system and service manager on modern Linux, controlled through systemctl."],
  "02-phase-networking-and-linux.md:730": ["OK", "systemd: `systemctl list-units --type=service` lists service units; `-t`/`--type` filters by unit type."],
  "02-phase-networking-and-linux.md:757": ["OK", "grep searches file contents; /var/log/auth.log is the standard authentication log on Debian/Ubuntu."],
  "02-phase-networking-and-linux.md:796": ["OK", "grep searches for patterns in files."],
  "02-phase-networking-and-linux.md:797": ["OK", "**Verified by execution.** awk: NF is the field count, so `$(NF-3)` is the fourth from the end. Ran it against the corpus's own example lines: NF=9 → $6, NF=11 → $8, NF=8 → $5, and every one returns 203.0.113.45. It also returns 2001:db8::1 correctly on an IPv6 line — which is why the corpus teaches NF-relative indexing instead of a fixed $6."],
  "02-phase-networking-and-linux.md:813": ["OK", "GNU grep: `--line-buffered` flushes output line by line rather than block-buffering when writing to a pipe."],
  "02-phase-networking-and-linux.md:847": ["OK", "GNU sed: “An address range can be specified by specifying two addresses separated by a comma… matches lines starting from where the first address matches, and continues until the second address matches (inclusively).”"],
  "02-phase-networking-and-linux.md:849": ["UNVERIFIABLE", "pedagogical advice about building pipelines incrementally"],
  "02-phase-networking-and-linux.md:927": ["OK", "grep searches for patterns in files."],
  "02-phase-networking-and-linux.md:928": ["OK", "grep: `-o` outputs only the matched part; `-E` enables extended regular expressions."],
  "02-phase-networking-and-linux.md:929": ["OK", "awk: `{print $2}` extracts the second whitespace-separated field."],
  "02-phase-networking-and-linux.md:935": ["OK", "awk: `{print $N}` extracts the Nth whitespace-separated field."],
  "02-phase-networking-and-linux.md:937": ["OK", "The source address sits at a different field index depending on whether the user is valid or invalid — `invalid user` adds two fields. Verified against the corpus's own examples: field 6 for the valid-root line, field 8 for the invalid-user line."],
  "02-phase-networking-and-linux.md:981": ["OK", "`dig` performs DNS lookups; `curl -I` fetches HTTP headers."],
  "02-phase-networking-and-linux.md:1087": ["OK", "iproute2: `ip a` shows interface addresses; `ping` tests connectivity."],
  "02-phase-networking-and-linux.md:1105": ["UNVERIFIABLE", "description of the OverTheWire Bandit game, not a flag or syntax claim"],
  // The verdict text contains pipes (`grep | awk | sort | ...`). A raw pipe inside a
  // Markdown table cell ENDS the cell, so this would split the row into eight cells
  // and break every reader downstream -- including audit-claim-drift.mjs, which
  // would then compare a truncated claim against the corpus and report drift that
  // does not exist. Escape them, and assert below that no verdict introduced a raw
  // pipe into the table.
  "02-phase-networking-and-linux.md:1142": ["OK", "POSIX: `grep \\| awk \\| sort \\| uniq -c \\| sort -rn \\| head` is the standard count-and-rank pipeline."],
  "02-phase-networking-and-linux.md:1166": ["OK", "OpenSSH: key-based auth uses authorized_keys; `PasswordAuthentication no` in sshd_config disables password login."],
  "02-phase-networking-and-linux.md:1196": ["OK", "BIND dig: supports query types including A, AAAA, MX and TXT."],
  "02-phase-networking-and-linux.md:1204": ["OK", "OpenSSH: key-based auth uses authorized_keys; `PasswordAuthentication no` disables password login."],
  "02-phase-networking-and-linux.md:1298": ["OK", "OpenSSH refuses a private key readable by others, which is the `permissions are too open` error."],
  "02-phase-networking-and-linux.md:1325": ["OK", "systemd: `journalctl -u` matches by unit name, and on Debian/Ubuntu the unit is `ssh.service` rather than `sshd.service`."],
  "03-phase-security-fundamentals.md:429": ["OK", "Microsoft/LOLBAS: powershell.exe, cmd.exe, wmic, certutil, bitsadmin, rundll32 and mshta are legitimate signed Windows binaries frequently abused."],
  "03-phase-security-fundamentals.md:685": ["OK", "curl: `-I` fetches HTTP headers."],
  "04-phase-hands-on-labs.md:239": ["OK", "Microsoft: `netstat -ano` shows all connections and listening ports with numeric addresses and owning PIDs."],
  "04-phase-hands-on-labs.md:275": ["OK", "Microsoft: `Get-PSDrive` reports used and free space per drive."],
  "04-phase-hands-on-labs.md:447": ["OK", "Microsoft: `Get-PSDrive` shows disk usage."],
  "04-phase-hands-on-labs.md:455": ["OK", "curl: `-I` tests HTTP connectivity."],
  "04-phase-hands-on-labs.md:484": ["OK", "Wazuh ships decoders for Windows events and sshd logs."],
  "04-phase-hands-on-labs.md:543": ["OK", "OpenSSH: `ssh fakeuser@localhost` attempts a login as a non-existent user."],
  "04-phase-hands-on-labs.md:662": ["OK", "grep searches; `tail -3` shows the last three lines."],
  "08-phase-job-application.md:294": ["OK", "nslookup: `nslookup name server` queries the specified server, so `nslookup example.com 8.8.8.8` uses Google's resolver."],
  "08-phase-job-application.md:308": ["OK", "chmod: mode 777 is rwxrwxrwx — all permissions for all users."],
  "09-phase-cloud-and-identity.md:268": ["UNVERIFIABLE", "curriculum narrative about one command's context"],
  "11-phase-incident-response.md:516": ["OK", "Microsoft: `schtasks.exe /create /tn <name> /tr <command>` creates a scheduled task."],
  "11-phase-incident-response.md:1065": ["OK", "winpmem_mini_x64.exe acquires memory; netstat -ano, arp -a and route print show network state; Get-Process lists processes; FTK Imager and dc3dd.exe acquire disk images."],
  "12-phase-scripting-automation.md:27": ["OK", "Microsoft: Get-WinEvent, Get-Process and Get-NetTCPConnection are standard PowerShell cmdlets."],
  "12-phase-scripting-automation.md:46": ["OK", "Microsoft: Get-WinEvent, Get-Process, Get-NetTCPConnection and Get-Service are standard cmdlets."],
  "12-phase-scripting-automation.md:49": ["OK", "Python hashlib computes hashes; PowerShell `Get-FileHash` computes file hashes with -Algorithm (SHA1/SHA256/SHA384/SHA512/MD5)."],
  "12-phase-scripting-automation.md:743": ["OK", "Microsoft: `Get-WinEvent -FilterHashtable` filters at the source and is markedly faster than piping to Where-Object."],
  "12-phase-scripting-automation.md:852": ["OK", "Microsoft: Get-NetTCPConnection exposes `OwningProcess`, the PID of the process owning the connection."],
  "12-phase-scripting-automation.md:1396": ["OK", "Microsoft: “将对象沿管道下发到 Where-Object 命令，效率将较低” — piping to Where-Object is less efficient than -FilterHashtable."],
  "12-phase-scripting-automation.md:1397": ["OK", "Microsoft: Get-NetTCPConnection exposes `OwningProcess`."],

  // ---- Security tool commands and flags (99) ----
  "02-phase-networking-and-linux.md:55": ["OK", "systemd/Linux: `journalctl` queries the systemd journal; /var/log/auth.log and /var/log/syslog are the standard logs on Debian/Ubuntu."],
  "02-phase-networking-and-linux.md:89": ["UNVERIFIABLE", "pedagogical comparison of Windows GUI dialogs with Linux commands"],
  "02-phase-networking-and-linux.md:113": ["OK", "Nmap: `-sV` enables version detection."],
  "02-phase-networking-and-linux.md:114": ["OK", "tcpdump captures packets on a network interface."],
  "02-phase-networking-and-linux.md:744": ["OK", "systemd: journalctl queries the systemd journal, which is where logs primarily live on many distributions."],
  "02-phase-networking-and-linux.md:755": ["OK", "systemd: `journalctl -u sshd -f` follows logs for the sshd unit."],
  "02-phase-networking-and-linux.md:798": ["OK", "POSIX: `sort` groups identical lines; `uniq` collapses only ADJACENT duplicates, which is why the sort is required first."],
  "02-phase-networking-and-linux.md:799": ["OK", "POSIX: `uniq -c` prefixes each run with its occurrence count."],
  "02-phase-networking-and-linux.md:800": ["OK", "POSIX: `sort -rn` sorts numerically (`-n`) and reverses (`-r`), giving highest first."],
  "02-phase-networking-and-linux.md:871": ["OK", "iproute2: `ss -tulpn` lists listening sockets; `-p` shows the owning process and needs root to see sockets owned by other users."],
  "02-phase-networking-and-linux.md:930": ["OK", "POSIX: `sort` orders lines so identical addresses become adjacent."],
  "02-phase-networking-and-linux.md:931": ["OK", "POSIX: `uniq -c` collapses duplicates and counts them."],
  "02-phase-networking-and-linux.md:932": ["OK", "POSIX: `sort -rn` sorts by count, descending."],
  "02-phase-networking-and-linux.md:1139": ["OK", "iproute2: `ss -tulpn` shows listening sockets with bind addresses. `0.0.0.0` means all interfaces; `127.0.0.1` means localhost only."],
  "02-phase-networking-and-linux.md:1154": ["OK", "iproute2: `ss -tulpn` lists every listening socket."],
  "02-phase-networking-and-linux.md:1167": ["OK", "tcpdump writes .pcap files, which Wireshark opens."],
  "02-phase-networking-and-linux.md:1198": ["OK", "Nmap: `-sV` enables version detection."],
  "02-phase-networking-and-linux.md:1205": ["OK", "tcpdump writes .pcap files; Wireshark opens and filters them."],
  "03-phase-security-fundamentals.md:302": ["OK", "/var/log/auth.log (Debian/Ubuntu) and /var/log/secure (RHEL/CentOS) are the standard authentication logs."],
  "03-phase-security-fundamentals.md:1037": ["OK", "Nmap: `-sV` performs version detection."],
  "04-phase-hands-on-labs.md:238": ["OK", "iproute2: `ss -tulpn` shows listening sockets."],
  "04-phase-hands-on-labs.md:831": ["OK", "iproute2: `ss -tulpn` shows listening sockets; nothing on 1514 means the agent cannot connect. Consistent with the corpus's own Wazuh troubleshooting scenario."],
  "06-phase-portfolio-projects.md:1020": ["OK", "Nmap: `-sS` performs a TCP SYN scan."],
  "09-phase-cloud-and-identity.md:235": ["OK", "AWS: `aws configure` stores the access key, secret and default region for subsequent commands."],
  "09-phase-cloud-and-identity.md:536": ["OK", "AWS CloudTrail records `userAgent` on each event."],
  "09-phase-cloud-and-identity.md:581": ["OK", "AWS CloudTrail records `userAgent`, which distinguishes scripted from interactive callers."],
  "10-phase-detection-engineering.md:341": ["OK", "Sysinternals: a Sysmon configuration file name is a convention; nothing reads it."],
  "10-phase-detection-engineering.md:350": ["OK", "Linux audit: `auditd` with `auditctl` rules configures syscall and file-watch auditing; `ausearch` and `aureport` query the logs."],
  "10-phase-detection-engineering.md:351": ["OK", "systemd: `journald` collects service and kernel logs; `journalctl` queries them with filters."],
  "10-phase-detection-engineering.md:356": ["OK", "Linux audit: auditd is a Linux-only daemon and does not run on Windows."],
  "10-phase-detection-engineering.md:358": ["OK", "Linux audit: rules live in /etc/audit/rules.d/, are loaded with `augenrules --load`, and listed with `auditctl -l`."],
  "12-phase-scripting-automation.md:47": ["OK", "Microsoft: `Select-Object` operates on objects from the pipeline, which is why it beats parsing formatted text."],
  "12-phase-scripting-automation.md:48": ["OK", "Microsoft: `Invoke-RestMethod` sends HTTP and REST requests."],
  "12-phase-scripting-automation.md:739": ["OK", "Microsoft: `Export-Csv` serialises objects to CSV."],
  "12-phase-scripting-automation.md:1434": ["OK", "GCHQ: CyberChef is a free, open-source web app for decoding and transforming data."],
  "14-phase-web-app-security.md:52": ["OK", "sqlmap is an open-source SQL injection detection and exploitation tool."],
  "14-phase-web-app-security.md:841": ["OK", "Docker: Docker Desktop on Windows requires WSL2."],
  "14-phase-web-app-security.md:865": ["OK", "sqlmap sends a high volume of requests, so it is easily detected and rate-limited."],
  "14-phase-web-app-security.md:1092": ["OK", "W3C CSP: `script-src` specifies the valid sources for JavaScript."],
  "14-phase-web-app-security.md:1133": ["OK", "sqlmap and nikto set identifiable User-Agent strings, which is why they appear in this detection signal."],
  "14-phase-web-app-security.md:1304": ["OK", "sqlmap automates SQL injection detection and exploitation."],
  "14-phase-web-app-security.md:1324": ["OK", "curl is a free, open-source command-line HTTP client."],
  "15-phase-ot-ics-security.md:40": ["OK", "Wireshark, tcpdump and Zeek are all passive network monitoring tools — none transmits to the monitored device."],
  "15-phase-ot-ics-security.md:114": ["UNVERIFIABLE", "“the skill that gets used on day one” is a judgement about career relevance"],
  "15-phase-ot-ics-security.md:823": ["OK", "tcpdump captures raw packets; a switch mirror port is the passive alternative."],
  "15-phase-ot-ics-security.md:1121": ["OK", "Wireshark is a free, open-source packet analyser with protocol dissection."],
  "15-phase-ot-ics-security.md:1122": ["OK", "Zeek is free and open source, and produces structured logs including conn.log."],
  "15-phase-ot-ics-security.md:1123": ["OK", "Suricata is a free, open-source signature and protocol-aware IDS/IPS."],
  "15-phase-ot-ics-security.md:1124": ["OK", "tcpdump is free, open source, and command-line packet capture."],
  "15-phase-ot-ics-security.md:1318": ["OK", "Wireshark, Zeek, Suricata, tcpdump and GRASSMARLIN are all free and open source."],

  // ---- MITRE ATT&CK technique identifiers (34) ----
  // Every ID and tactic in this class was re-checked against attack.mitre.org before
  // recording, because a misattributed technique number is exactly the kind of claim
  // that reads authoritative and is silently wrong.
  "01-phase-foundations.md:502": ["OK", "MITRE ATT&CK: T1566 is Phishing, tactic Initial Access."],
  "01-phase-foundations.md:504": ["OK", "MITRE ATT&CK: T1566 is the Phishing technique."],
  "01-phase-foundations.md:676": ["OK", "MITRE ATT&CK: T1566 Phishing is under Initial Access."],
  "03-phase-security-fundamentals.md:387": ["OK", "MITRE ATT&CK: T1036 is Masquerading."],
  "03-phase-security-fundamentals.md:875": ["OK", "MITRE ATT&CK: T1566 is Phishing, tactic Initial Access."],
  "03-phase-security-fundamentals.md:890": ["OK", "MITRE ATT&CK: T1566 is Phishing."],
  "04-phase-hands-on-labs.md:494": ["OK", "MITRE ATT&CK: T1110 is Brute Force."],
  "04-phase-hands-on-labs.md:506": ["OK", "MITRE ATT&CK: T1110 is Brute Force."],
  "10-phase-detection-engineering.md:152": ["OK", "MITRE ATT&CK: T1059.001 is Command and Scripting Interpreter: PowerShell."],
  "10-phase-detection-engineering.md:508": ["OK", "MITRE ATT&CK: T1543.003 is Create or Modify System Process: Windows Service."],
  "10-phase-detection-engineering.md:553": ["OK", "attack.mitre.org/techniques/T1059/001/ — resolves to the T1059.001 page."],
  "10-phase-detection-engineering.md:633": ["OK", "MITRE ATT&CK: T1059.001 is PowerShell."],
  "10-phase-detection-engineering.md:735": ["OK", "Atomic Red Team: `Invoke-AtomicTest` with `-ShowDetailsBrief` lists a technique's tests."],
  "10-phase-detection-engineering.md:738": ["OK", "Atomic Red Team: `-TestNumbers` selects specific tests."],
  "10-phase-detection-engineering.md:741": ["OK", "Atomic Red Team: `-Cleanup` reverts a test's changes."],
  "10-phase-detection-engineering.md:757": ["OK", "MITRE ATT&CK: T1059.001 is PowerShell."],
  "10-phase-detection-engineering.md:760": ["OK", "Atomic Red Team: `Invoke-AtomicTest T1059.001 -TestNumbers 1` runs the first atomic test for PowerShell."],
  "10-phase-detection-engineering.md:848": ["OK", "MITRE ATT&CK: T1110 is Brute Force."],
  "10-phase-detection-engineering.md:909": ["OK", "MITRE ATT&CK: T1059 is Command and Scripting Interpreter."],
  "10-phase-detection-engineering.md:910": ["OK", "MITRE ATT&CK: T1059.001 is the PowerShell sub-technique."],
  "10-phase-detection-engineering.md:919": ["OK", "MITRE ATT&CK: T1059.001 is PowerShell."],
  "10-phase-detection-engineering.md:920": ["OK", "MITRE ATT&CK: T1059.003 is Windows Command Shell."],
  "10-phase-detection-engineering.md:931": ["OK", "MITRE ATT&CK: T1566.001 is Spearphishing Attachment."],
  "10-phase-detection-engineering.md:932": ["OK", "MITRE ATT&CK: T1059.001 is PowerShell."],
  "10-phase-detection-engineering.md:933": ["OK", "MITRE ATT&CK: T1059.003 is Windows Command Shell."],
  "10-phase-detection-engineering.md:934": ["OK", "MITRE ATT&CK: T1543.003 is Windows Service."],
  "10-phase-detection-engineering.md:935": ["OK", "MITRE ATT&CK: T1053.005 is Scheduled Task/Job: Scheduled Task."],
  "10-phase-detection-engineering.md:936": ["OK", "MITRE ATT&CK: T1136.001 is Create Account: Local Account."],
  "10-phase-detection-engineering.md:937": ["OK", "MITRE ATT&CK: T1098.001 is Account Manipulation: Additional Cloud Credentials, tactics Persistence and Privilege Escalation. The cell gives the PARENT family name rather than the sub-technique's own name — the ID, the tactic and the family are all correct, and T1098 in the preceding column plus `.001` resolves to the right page. Left as written deliberately: it matches the column's use elsewhere as a technique-area label, and for a beginner 'Account Manipulation' is more legible than 'Additional Cloud Credentials'."],
  "10-phase-detection-engineering.md:938": ["OK", "MITRE ATT&CK: T1003.001 is OS Credential Dumping: LSASS Memory."],
  "10-phase-detection-engineering.md:939": ["OK", "MITRE ATT&CK: T1087.001 is Account Discovery: Local Account, tactic Discovery. As with T1098.001 above, the cell gives the parent family name; the ID and tactic are correct."],
  "10-phase-detection-engineering.md:940": ["OK", "MITRE ATT&CK: T1071.001 is Application Layer Protocol: Web Protocols."],
  "10-phase-detection-engineering.md:941": ["OK", "MITRE ATT&CK: T1041 is Exfiltration Over C2 Channel, tactic Exfiltration."],
  "10-phase-detection-engineering.md:991": ["OK", "MITRE ATT&CK: T1059.001 is PowerShell."],

  // ---- Protocol and standard behaviour (44) ----
  "02-phase-networking-and-linux.md:26": ["UNVERIFIABLE", "curriculum learning objective"],
  "02-phase-networking-and-linux.md:41": ["OK", "RFC 9293: “this is called the three-way (or three message) handshake (3WHS)”."],
  "02-phase-networking-and-linux.md:132": ["OK", "OSI model: Layer 4 (Transport) handles ports and reliability with TCP and UDP."],
  "02-phase-networking-and-linux.md:342": ["OK", "DHCP: DORA is DISCOVER, OFFER, REQUEST, ACK."],
  "02-phase-networking-and-linux.md:366": ["OK", "RFC 9293: the three-way handshake establishes a TCP connection."],
  "02-phase-networking-and-linux.md:369": ["OK", "RFC 9293: “A --> B SYN my sequence number is X”."],
  "02-phase-networking-and-linux.md:370": ["OK", "RFC 9293: steps 2 and 3 can be combined in a single message — the SYN-ACK."],
  "02-phase-networking-and-linux.md:383": ["OK", "Nmap: no response to a SYN means the port is filtered or the host is down."],
  "02-phase-networking-and-linux.md:384": ["OK", "Nmap: a RST response means the host is up but nothing is listening on that port."],
  "02-phase-networking-and-linux.md:392": ["OK", "RFC 768: UDP is connectionless, with no handshake, ordering or retransmission."],
  "02-phase-networking-and-linux.md:424": ["OK", "IANA: port 445 is SMB and port 3389 is RDP."],
  "02-phase-networking-and-linux.md:861": ["OK", "iproute2: `ss -tulpn` lists listening TCP/UDP sockets with owning processes."],
  "02-phase-networking-and-linux.md:955": ["OK", "tcpdump: `-i eth0 -n 'tcp port 80'` captures HTTP without name resolution."],
  "02-phase-networking-and-linux.md:970": ["OK", "Wireshark: `tcp.flags.syn == 1` matches SYN packets."],
  "02-phase-networking-and-linux.md:1014": ["OK", "Nmap: an open port completes the TCP handshake, or replies over UDP."],
  "02-phase-networking-and-linux.md:1136": ["OK", "RFC 9293: completed handshake = open, RST = closed, silence = filtered."],
  "02-phase-networking-and-linux.md:1159": ["UNVERIFIABLE", "curriculum task instruction"],
  "02-phase-networking-and-linux.md:1175": ["OK", "Wireshark is a free packet analyser; the cited URL is its home page."],
  "02-phase-networking-and-linux.md:1200": ["UNVERIFIABLE", "curriculum task instruction"],
  "02-phase-networking-and-linux.md:1307": ["OK", "RFC 1034/1035: an authoritative server is the source of truth for its zone; a recursive resolver returns cached answers until the TTL expires."],
  "03-phase-security-fundamentals.md:466": ["OK", "IANA: port 3389 is RDP, an inbound service."],
  "03-phase-security-fundamentals.md:500": ["OK", "JA3 and JA4 are TLS fingerprinting methods derived from handshake metadata."],
  "03-phase-security-fundamentals.md:549": ["OK", "RFC 8484: DNS-over-HTTPS carries DNS queries over HTTPS, bypassing the network resolver."],
  "03-phase-security-fundamentals.md:956": ["UNVERIFIABLE", "security hygiene advice"],
  "06-phase-portfolio-projects.md:45": ["UNVERIFIABLE", "curriculum task outline"],
  "06-phase-portfolio-projects.md:530": ["UNVERIFIABLE", "curriculum narrative"],
  "06-phase-portfolio-projects.md:542": ["OK", "A DNS query and response, the TCP handshake, and a TLS ClientHello are real, observable network events."],
  "06-phase-portfolio-projects.md:555": ["OK", "Wireshark: `tcp.flags.syn == 1 && tcp.flags.ack == 0` matches initial SYN packets."],
  "08-phase-job-application.md:300": ["UNVERIFIABLE", "interview preparation framing"],
  "08-phase-job-application.md:302": ["OK", "RFC 9293: the three-way handshake is SYN, SYN-ACK, ACK."],
  "08-phase-job-application.md:304": ["OK", "Nmap: a completed handshake means connected, no response means filtered or down, and SYN then RST means closed. Standard port-state interpretation."],
  "12-phase-scripting-automation.md:89": ["UNVERIFIABLE", "curriculum topic outline"],
  "14-phase-web-app-security.md:1282": ["UNVERIFIABLE", "conceptual claim about the class of injection bugs, not a protocol behaviour"],
  "15-phase-ot-ics-security.md:87": ["UNVERIFIABLE", "general characterisation of industrial protocol usage"],
  "15-phase-ot-ics-security.md:330": ["OK", "Modbus TCP runs on port 502 and has no authentication."],
  "15-phase-ot-ics-security.md:331": ["OK", "DNP3 runs on port 20000 over TCP or UDP, with optional and often unused authentication."],
  "15-phase-ot-ics-security.md:332": ["OK", "EtherNet/IP uses TCP 44818 and UDP 2222, with the CIP object model."],
  "15-phase-ot-ics-security.md:334": ["OK", "OPC UA commonly uses TCP port 4840 and supports certificates and sessions."],
  "15-phase-ot-ics-security.md:342": ["OK", "Modbus TCP: the MBAP header is 7 bytes, followed by a function code and data."],
  "15-phase-ot-ics-security.md:446": ["OK", "EtherNet/IP implicit messaging uses UDP port 2222."],
  "15-phase-ot-ics-security.md:447": ["OK", "EtherNet/IP explicit messaging uses TCP port 44818."],
  "15-phase-ot-ics-security.md:717": ["OK", "Legacy OT stacks are documented as crashing or hanging on unexpected packets."],
  "15-phase-ot-ics-security.md:767": ["OK", "Wireshark: `ip.src == <addr> && tcp.flags.syn == 1` filters new connections from one source."],
  "15-phase-ot-ics-security.md:802": ["OK", "Modbus TCP: the protocol identifier field is 0 and the function code sits at offset 7."],

  // ---- Registry paths, file paths and filenames (47) ----
  "01-phase-foundations.md:840": ["UNVERIFIABLE", "conceptual explanation of exploit versus vulnerability"],
  "02-phase-networking-and-linux.md:517": ["OK", "FHS: /etc/passwd, /etc/shadow and /etc/ssh/sshd_config are the standard paths; /etc/shadow is root-only."],
  "02-phase-networking-and-linux.md:518": ["OK", "FHS: /var/log holds log files."],
  "02-phase-networking-and-linux.md:625": ["OK", "/etc/sudoers defines sudo privileges."],
  "02-phase-networking-and-linux.md:645": ["OK", "/etc/passwd contains user account information."],
  "02-phase-networking-and-linux.md:652": ["OK", "/usr/sbin/nologin prevents an interactive login and is the standard service-account shell."],
  "02-phase-networking-and-linux.md:738": ["OK", "Debian/Ubuntu: /var/log/auth.log records authentication, sudo and SSH."],
  "02-phase-networking-and-linux.md:739": ["OK", "RHEL/CentOS: /var/log/secure is the authentication log."],
  "02-phase-networking-and-linux.md:740": ["OK", "Debian/Ubuntu: /var/log/syslog holds general system messages."],
  "02-phase-networking-and-linux.md:741": ["OK", "RHEL/CentOS: /var/log/messages holds general system messages."],
  "02-phase-networking-and-linux.md:742": ["OK", "/var/log/apache2/ and /var/log/nginx/ hold web server access and error logs."],
  "02-phase-networking-and-linux.md:839": ["OK", "logrotate names rotated logs .1.gz, .2.gz and so on, so the glob `auth.log*` catches them."],
  "02-phase-networking-and-linux.md:1140": ["OK", "/etc/passwd: UID 0 is root and nothing else should hold it."],
  "02-phase-networking-and-linux.md:1152": ["OK", "/etc/passwd contains the UID field."],
  "02-phase-networking-and-linux.md:1153": ["OK", "/etc/ssh/sshd_config is the SSH server configuration file."],
  "02-phase-networking-and-linux.md:1244": ["OK", "/usr/sbin/nologin is the expected shell for a service account."],
  "02-phase-networking-and-linux.md:1325": ["OK", "systemd: on Debian/Ubuntu the SSH unit is ssh.service, not sshd.service. This row is the answer to the phase's own Q12 troubleshooting exercise at line 1318, which deliberately sets the trap."],
  "03-phase-security-fundamentals.md:302": ["OK", "/var/log/auth.log (Debian/Ubuntu) and /var/log/secure (RHEL/CentOS) are the authentication logs."],
  "03-phase-security-fundamentals.md:393": ["OK", "Windows: C:\\Windows\\System32 is the legitimate location for svchost.exe."],
  "03-phase-security-fundamentals.md:394": ["OK", "Windows: legitimate system binaries do not run from C:\\Users\\Public."],
  "03-phase-security-fundamentals.md:408": ["OK", "Windows: HKCU and HKLM Software\\Microsoft\\Windows\\CurrentVersion\\Run are the standard Run keys."],
  "03-phase-security-fundamentals.md:431": ["OK", "C:\\Users\\Public, C:\\Temp, %APPDATA% and /tmp are all user-writable locations."],
  "03-phase-security-fundamentals.md:1208": ["OK", "Windows: the real svchost.exe lives in C:\\Windows\\System32."],
  "04-phase-hands-on-labs.md:452": ["OK", "Debian/Ubuntu: /var/log/auth.log is the authentication log."],
  "04-phase-hands-on-labs.md:544": ["OK", "/var/log/auth.log on Linux and Event Viewer on Windows are both valid log sources."],
  "10-phase-detection-engineering.md:41": ["OK", "auditd and /var/log/auth.log are Linux log sources."],
  "10-phase-detection-engineering.md:217": ["OK", "Linux: /var/log/auth.log records SSH authentication."],
  "10-phase-detection-engineering.md:218": ["OK", "Linux: cron job definitions live under /etc/cron*."],
  "10-phase-detection-engineering.md:349": ["OK", "/var/log/auth.log and /var/log/secure record authentication, sudo, SSH and su."],
  "10-phase-detection-engineering.md:352": ["OK", "/var/log/syslog and /var/log/messages hold general system messages."],
  "10-phase-detection-engineering.md:353": ["OK", "/etc/passwd and /etc/shadow store account data."],
  "10-phase-detection-engineering.md:354": ["OK", "Cron execution is logged to /var/log/cron or journald."],
  "10-phase-detection-engineering.md:358": ["OK", "Linux audit: rules live in /etc/audit/rules.d/, load with `augenrules --load`, and list with `auditctl -l`."],
  "10-phase-detection-engineering.md:1113": ["OK", "Linux audit: auditd can place file watches on /etc/passwd and /etc/cron.d."],
  "11-phase-incident-response.md:456": ["OK", "Windows: Prefetch is at C:\\Windows\\Prefetch."],
  "11-phase-incident-response.md:458": ["OK", "Windows: Amcache.hve is at C:\\Windows\\AppCompat\\Programs\\Amcache.hve and stores SHA-1 hashes."],
  "11-phase-incident-response.md:462": ["OK", "Windows: event logs are stored in C:\\Windows\\System32\\winevt\\Logs."],
  "11-phase-incident-response.md:512": ["OK", "Windows: C:\\Users\\jsantos\\Downloads is a standard user download directory."],
  "11-phase-incident-response.md:513": ["OK", "Windows: %LOCALAPPDATA%\\Temp is the standard per-user temporary directory."],
  "11-phase-incident-response.md:952": ["OK", "Windows: C:\\Users\\jsantos\\AppData\\Local\\Temp is a user-writable directory — the point the row is making."],
  "12-phase-scripting-automation.md:854": ["OK", "Windows: legitimate service binaries run from C:\\Windows or C:\\Program Files."],
  "12-phase-scripting-automation.md:1133": ["OK", "Windows: C:\\Program Files is a standard installation directory."],
};

// A raw pipe in a verdict would terminate the table cell, splitting the row and
// silently truncating the claim for every downstream reader -- including
// audit-claim-drift.mjs, which would then report drift that does not exist. This
// actually happened: one verdict quoting `grep | awk | sort` produced a phantom
// GONE finding against content that was present and byte-identical at the cited
// line. Refuse rather than repair silently.
const rawPipe = Object.entries(V).filter(([, v]) => v[1].includes("|") && !v[1].includes("\\|"));
if (rawPipe.length) {
  console.error("REFUSING TO WRITE: these verdicts contain an unescaped '|', which would");
  console.error("split the table row. Escape it as \\| :\n");
  for (const [k, v] of rawPipe) console.error(`  ${k}: ${v[1].slice(0, 80)}`);
  process.exit(1);
}

const src = fs.readFileSync(DOC, "utf8");
const lines = src.split("\n");

// Rows to fill: | n | `file:line` | text | (empty verdict) |
//
// Some locations carry a `▶` marker after the closing backtick, marking a row the
// splitter considered high-value. The first version of this regex required the pipe
// immediately after the backtick, so those rows matched NOTHING and their verdicts
// were reported as unmatched -- 10 of 123. Allowing the optional marker is the fix;
// the guard now also reports the total filled so a future miss cannot pass as a
// clean run.
const ROW = /^\|\s*(\d+)\s*\|\s*`([^`]+?):(\d+)`\s*▶?\s*\|/;
const used = new Set();
let filled = 0;
let already = 0;

for (let i = 0; i < lines.length; i++) {
  const m = ROW.exec(lines[i]);
  if (!m) continue;
  const key = `${m[2]}:${m[3]}`;
  const v = V[key];
  if (!v) continue;
  used.add(key);
  // Only fill a row whose verdict cell is still empty.
  if (!/\|\s*\|\s*$/.test(lines[i])) {
    already++;
    continue;
  }
  lines[i] = lines[i].replace(/\|\s*\|\s*$/, `| **${v[0]}** — ${v[1]} |`);
  filled++;
}

fs.writeFileSync(DOC, lines.join("\n"), "utf8");

const missing = Object.keys(V).filter((k) => !used.has(k));
// `used` is every location the script FOUND a row for, whether it filled it now or
// found it already filled. That is the number that must equal the verdicts supplied
// -- NOT `filled + already`, which double-counts across runs: on a second run the
// rows written by the first appear as `already`, so filled+already exceeds the
// total and a correct run reports a mismatch. Caught by running it twice.
console.log(`verdicts supplied : ${Object.keys(V).length}`);
console.log(`rows located      : ${used.size}`);
console.log(`  filled now      : ${filled}`);
console.log(`  already set     : ${already}`);
console.log(`supplied but UNMATCHED in the doc: ${missing.length}`);
for (const k of missing) console.log("   ! " + k);
// A run that places fewer verdicts than were supplied has dropped some, and a
// dropped verdict is indistinguishable from one never given. Fail loudly.
if (missing.length || used.size !== Object.keys(V).length) {
  console.error(
    `\nMISMATCH: ${Object.keys(V).length} supplied, ${used.size} placed. ` +
      `A verdict that cannot be placed must not disappear.`,
  );
  process.exit(1);
}
console.log("\nAll supplied verdicts are recorded.");
