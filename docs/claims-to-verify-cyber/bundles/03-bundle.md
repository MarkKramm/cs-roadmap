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

---

# This bundle covers 3 claim classes, 125 rows total.

**Answer every row in every table below, in order, and output the tables complete.**
Do not summarise and do not sample. If you run low on room, stop at a row boundary
and say which table and row number to continue from — a continuation is cheap and
an incomplete table is not.

---

<!-- 01-mitre-att-ck-technique-identifiers.md — 34 rows -->

# MITRE ATT&CK technique identifiers


*A technique ID resolves to one entry in a versioned, published matrix. The ID and its technique name are both fixed, and the matrix is renumbered between versions.*

**Source to check against:** The MITRE ATT&CK matrix for the named technique ID

34 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-foundations.md:502` | \| **Technique** \| A specific way of achieving that goal \| **T1566 Phishing** under the Initial Access tactic \| | |
| 2 | `01-phase-foundations.md:504` | When you see a phishing email, mapping it to T1566 joins your observation to a global, consistent vocabulary. That is why one of this phase's practice tasks is to pick five techniques and explain them. | |
| 3 | `01-phase-foundations.md:676` | \| Initial Access \| Phishing (T1566) \| Get a foothold by convincing a user to act \| Mail filters, user reports, suspicious sender domains \| | |
| 4 | `03-phase-security-fundamentals.md:387` | That last row introduces **masquerading** — naming a malicious file after a legitimate system process to blend in. It is a MITRE ATT&CK technique (T1036). | |
| 5 | `03-phase-security-fundamentals.md:875` | \| 02:14:03 \| Phishing email delivered to `j.dela+cruz@example.com` \| Mail gateway log \| Initial access attempt (ATT&CK T1566) \| | |
| 6 | `03-phase-security-fundamentals.md:890` | \| ATT&CK T1566 mapping \| Phase 1 \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Event IDs 4624 and 4688, logon types 3 and 10 \| Part 1 \|</sub> | |
| 7 | `04-phase-hands-on-labs.md:494` ▶ | <id>T1110</id> | |
| | | <sub>↑ <mitre><br>↓ </mitre></sub> | |
| 8 | `04-phase-hands-on-labs.md:506` | - **`mitre`** — maps the detection to **T1110, Brute Force** in MITRE ATT&CK. Phase 1 introduced ATT&CK as a shared vocabulary; this is what using it looks like in practice. It means an analyst who sees this alert immediately knows what class of behaviour it r … | |
| 9 | `10-phase-detection-engineering.md:152` | **T1059.001 — Command and Scripting Interpreter: PowerShell.** | |
| 10 | `10-phase-detection-engineering.md:508` | **ATT&CK T1543.003 — Create or Modify System Process: Windows Service.** | |
| 11 | `10-phase-detection-engineering.md:553` ▶ | - https://attack.mitre.org/techniques/T1059/001/ | |
| | | <sub>↑ references:<br>↓ author: Your Name</sub> | |
| 12 | `10-phase-detection-engineering.md:633` ▶ | <id>T1059.001</id> | |
| | | <sub>↑ <mitre><br>↓ </mitre></sub> | |
| 13 | `10-phase-detection-engineering.md:735` ▶ | Invoke-AtomicTest T1543.003 -ShowDetailsBrief | |
| | | <sub>↑ # List the atomic tests for one technique, without running anything.</sub> | |
| 14 | `10-phase-detection-engineering.md:738` ▶ | Invoke-AtomicTest T1543.003 -TestNumbers 1 | |
| | | <sub>↑ # Run one test.</sub> | |
| 15 | `10-phase-detection-engineering.md:741` ▶ | Invoke-AtomicTest T1543.003 -TestNumbers 1 -Cleanup | |
| | | <sub>↑ # Clean up after the test, which also tests your rule's noise profile.<br>↓ ```</sub> | |
| 16 | `10-phase-detection-engineering.md:757` ▶ | ATT&CK T1059.001 | |
| | | <sub>↑ Title Encoded PowerShell outside known management tools</sub> | |
| 17 | `10-phase-detection-engineering.md:760` ▶ | Command Invoke-AtomicTest T1059.001 -TestNumbers 1 | |
| | | <sub>↑ True positive test<br>↓ Result Rule fired 4 seconds after execution</sub> | |
| 18 | `10-phase-detection-engineering.md:848` | A learner writes a rule for T1110, brute force: alert when more than five failed logons occur for one account within five minutes. | |
| 19 | `10-phase-detection-engineering.md:909` | \| **Technique** \| *How* they achieve the goal \| T1059 Command and Scripting Interpreter \| | |
| | | <sub>↑ \| **Tactic** \| The attacker's goal — the *why* \| Execution, Persistence, Credential Access \|<br>↓ \| **Sub-technique** \| A specific variant \| T1059.001 PowerShell \|</sub> | |
| 20 | `10-phase-detection-engineering.md:910` | \| **Sub-technique** \| A specific variant \| T1059.001 PowerShell \| | |
| | | <sub>↑ \| **Technique** \| *How* they achieve the goal \| T1059 Command and Scripting Interpreter \|<br>↓ \| **Procedure** \| The specific implementation an actor used \| `powershell.exe -enc <base64>` in a macro \|</sub> | |
| 21 | `10-phase-detection-engineering.md:919` | \| "We detect T1059.001" \| "We detect T1059.001 via the encoded-command procedure. Non-encoded PowerShell is not covered by this rule and is covered only by process-creation logging." \| | |
| 22 | `10-phase-detection-engineering.md:920` | \| "T1059 — covered" \| "T1059 partially covered by one sub-technique. T1059.003 (Windows Command Shell) is not covered." \| | |
| 23 | `10-phase-detection-engineering.md:931` | \| Initial Access \| T1566 Phishing \| .001 Attachment \| — \| **None** \| No email gateway feed into the SIEM \| | |
| 24 | `10-phase-detection-engineering.md:932` | \| Execution \| T1059 \| .001 PowerShell \| DET-003 \| Partial \| Encoded only; plain PowerShell not covered \| | |
| 25 | `10-phase-detection-engineering.md:933` | \| Execution \| T1059 \| .003 Windows Command Shell \| — \| **None** \| Planned, low priority \| | |
| | | <sub>↑ \| Execution \| T1059 \| .001 PowerShell \| DET-003 \| Partial \| Encoded only; plain PowerShell not covered \|<br>↓ \| Persistence \| T1543 \| .003 Windows Service \| DET-001 \| **Good** \| Signature checks not yet implemented \|</sub> | |
| 26 | `10-phase-detection-engineering.md:934` | \| Persistence \| T1543 \| .003 Windows Service \| DET-001 \| **Good** \| Signature checks not yet implemented \| | |
| 27 | `10-phase-detection-engineering.md:935` | \| Persistence \| T1053 \| .005 Scheduled Task \| DET-006 \| Partial \| Linux cron covered; Windows tasks partial \| | |
| 28 | `10-phase-detection-engineering.md:936` | \| Persistence \| T1136 \| .001 Local Account \| DET-002 \| **Good** \| Requires correlation with the group-change rule \| | |
| 29 | `10-phase-detection-engineering.md:937` | \| Privilege Escalation \| T1098 \| .001 Account Manipulation \| DET-002 \| **Good** \| — \| | |
| | | <sub>↑ \| Persistence \| T1136 \| .001 Local Account \| DET-002 \| **Good** \| Requires correlation with the group-change rule \|<br>↓ \| Credential Access \| T1003 \| .001 LSASS Memory \| DET-004 \| Partial \| Heavily filtered; a documented bypass exists \|</sub> | |
| 30 | `10-phase-detection-engineering.md:938` | \| Credential Access \| T1003 \| .001 LSASS Memory \| DET-004 \| Partial \| Heavily filtered; a documented bypass exists \| | |
| 31 | `10-phase-detection-engineering.md:939` | \| Discovery \| T1087 \| .001 Account Discovery \| — \| **None** \| Not detected \| | |
| | | <sub>↑ \| Credential Access \| T1003 \| .001 LSASS Memory \| DET-004 \| Partial \| Heavily filtered; a documented bypass exists \|<br>↓ \| Command and Control \| T1071 \| .001 Web Protocols \| DET-008 \| Partial \| DNS-based only \|</sub> | |
| 32 | `10-phase-detection-engineering.md:940` | \| Command and Control \| T1071 \| .001 Web Protocols \| DET-008 \| Partial \| DNS-based only \| | |
| | | <sub>↑ \| Discovery \| T1087 \| .001 Account Discovery \| — \| **None** \| Not detected \|<br>↓ \| Exfiltration \| T1041 \| — \| — \| **None** \| No egress anomaly baseline \|</sub> | |
| 33 | `10-phase-detection-engineering.md:941` | \| Exfiltration \| T1041 \| — \| — \| **None** \| No egress anomaly baseline \| | |
| | | <sub>↑ \| Command and Control \| T1071 \| .001 Web Protocols \| DET-008 \| Partial \| DNS-based only \|</sub> | |
| 34 | `10-phase-detection-engineering.md:991` ▶ | ATT&CK T1059.001 | |
| | | <sub>↑ Level High<br>↓ Author / date Your Name, 2026-03-11</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

<!-- 03-protocol-and-standard-behaviour.md — 44 rows -->

# Protocol and standard behaviour


*Fixed by the defining spec. Includes handshake sequences, header fields, status codes and OSI layer assignments.*

**Source to check against:** The RFC or standard that defines the protocol; vendor docs for proprietary ones

44 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:26` | - Understand IPv4, IPv6 basics, subnetting, DNS, DHCP, NAT, TCP/UDP, ICMP, TLS, HTTP, and common ports. | |
| | | <sub>↓ - Use Linux confidently for files, permissions, processes, services, SSH, logs, and networking.</sub> | |
| 2 | `02-phase-networking-and-linux.md:41` | - TCP handshake and connection teardown | |
| | | <sub>↑ - DHCP process<br>↓ - UDP use cases</sub> | |
| 3 | `02-phase-networking-and-linux.md:132` | \| 4 Transport \| Ports, reliability \| TCP, UDP \| Port closed, timeout \| | |
| | | <sub>↑ \| 5 Session \| Managing conversations \| Session setup \| Connection drops \|<br>↓ \| 3 Network \| Logical addressing, routing \| IP, ICMP \| Cannot reach the host \|</sub> | |
| 4 | `02-phase-networking-and-linux.md:342` | **DHCP** (Dynamic Host Configuration Protocol) hands out addresses automatically, through a four-step exchange known as **DORA**. | |
| 5 | `02-phase-networking-and-linux.md:366` | **TCP** is connection-oriented and reliable. It begins with the **three-way handshake**: | |
| 6 | `02-phase-networking-and-linux.md:369` ▶ | Client → Server: SYN ("I would like to connect, my sequence starts here") | |
| | | <sub>↑ ```text<br>↓ Server → Client: SYN-ACK ("Acknowledged, and here is mine")</sub> | |
| 7 | `02-phase-networking-and-linux.md:370` ▶ | Server → Client: SYN-ACK ("Acknowledged, and here is mine") | |
| | | <sub>↑ Client → Server: SYN ("I would like to connect, my sequence starts here")<br>↓ Client → Server: ACK ("Acknowledged — connection established")</sub> | |
| 8 | `02-phase-networking-and-linux.md:383` | \| A `SYN` that gets no reply \| The port is filtered, or the host is down \| | |
| | | <sub>↑ \| A completed handshake \| The port is open and something is listening \|<br>↓ \| A `SYN` answered by `RST` (reset) \| The host is alive but nothing is listening on that port \|</sub> | |
| 9 | `02-phase-networking-and-linux.md:384` | \| A `SYN` answered by `RST` (reset) \| The host is alive but nothing is listening on that port \| | |
| | | <sub>↑ \| A `SYN` that gets no reply \| The port is filtered, or the host is down \|</sub> | |
| 10 | `02-phase-networking-and-linux.md:392` | **UDP** is connectionless and unreliable: no handshake, no ordering, no retransmission. | |
| 11 | `02-phase-networking-and-linux.md:424` | Two of these deserve emphasis. **Port 445 (SMB)** and **port 3389 (RDP)** exposed to the internet are among the most common causes of ransomware incidents in the world, because both are legitimate services that attackers can authenticate to. | |
| 12 | `02-phase-networking-and-linux.md:861` ▶ | sudo ss -tulpn # listening TCP/UDP ports with owning processes | |
| | | <sub>↑ ip neigh # the ARP table — IP-to-MAC mappings<br>↓ dig example.com MX # DNS records</sub> | |
| 13 | `02-phase-networking-and-linux.md:955` ▶ | sudo tcpdump -i eth0 -n 'tcp port 80' # only HTTP, no name resolution | |
| | | <sub>↑ sudo tcpdump -i eth0 port 53 # only DNS<br>↓ sudo tcpdump -r capture.pcap -nn # read a saved capture</sub> | |
| 14 | `02-phase-networking-and-linux.md:970` ▶ | tcp.flags.syn == 1 connection attempts | |
| | | <sub>↑ ip.addr == 192.168.1.50 one host<br>↓ tcp.flags.reset == 1 resets — refused connections</sub> | |
| 15 | `02-phase-networking-and-linux.md:1014` | \| **open** \| A completed TCP handshake, or a UDP reply \| Something is listening and accepted the connection \| | |
| 16 | `02-phase-networking-and-linux.md:1136` | - **TCP's three-way handshake explains Nmap's output.** Completed handshake = open; `RST` = closed (host is up); silence = filtered. Learn the handshake and port states stop being arbitrary. | |
| 17 | `02-phase-networking-and-linux.md:1159` | 9. **Write the TCP handshake mini-report last** (task 9), once the capture work has given you the material. Follow the deliverable's structure and keep it short. If you can explain the handshake from your own capture — including why the packets are in that ord … | |
| 18 | `02-phase-networking-and-linux.md:1175` | \| Wireshark \| Packet analysis \| Free \| https://www.wireshark.org/ \| Capture DNS, HTTP, TCP handshake \| tcpdump \| | |
| 19 | `02-phase-networking-and-linux.md:1200` | 9. Write a mini-report explaining one TCP handshake capture. <!-- id: cyber-02-t09 band: focused energy: normal --> | |
| 20 | `02-phase-networking-and-linux.md:1307` | **Why:** The authoritative server is the source of truth for its zone and answers fresh every time, while a recursive resolver returns whatever it has cached until the TTL expires. So a disagreement between them is usually a timing difference rather than a con … | |
| 21 | `03-phase-security-fundamentals.md:466` | It also explains why the *direction* of a rule is essential context. RDP on port 3389 is an *inbound* service — the thing you are protecting — so an inbound deny on 3389 is the correct posture, and a separate outbound permit on 3389 is ordinary and unrelated t … | |
| 22 | `03-phase-security-fundamentals.md:500` | If TLS hides the content, signature matching cannot see inside without interception. This is why modern detection leans on metadata — connection patterns, volumes, timing, destinations, and JA3/JA4 fingerprints of the TLS handshake itself — rather than payload … | |
| 23 | `03-phase-security-fundamentals.md:549` | \| DNS-over-HTTPS clients \| The lookup is encrypted and leaves the network's resolver entirely \| | |
| | | <sub>↑ \| Direct-to-IP connections \| DNS filtering only works on names \|<br>↓ \| Domain generation algorithms \| Malware generates hundreds of candidate domains, so blocking a list catches only some \|</sub> | |
| 24 | `03-phase-security-fundamentals.md:956` | \| 5 \| Check for old app passwords and OAuth grants \| Access you granted years ago and forgot \| | |
| | | <sub>↑ \| 4 \| Find your recovery options for each \| A stale recovery email is an unlocked back door \|</sub> | |
| 25 | `06-phase-portfolio-projects.md:45` | - Capture DNS, HTTP, TLS handshake metadata, and failed connection attempts. | |
| | | <sub>↓ - Explain protocols and suspicious indicators.</sub> | |
| 26 | `06-phase-portfolio-projects.md:530` | features. The report becomes *"here is a DNS query, here is a TCP handshake, | |
| | | <sub>↑ Wireshark work has a specific failure mode: it turns into a tour of Wireshark's<br>↓ here is a TLS ClientHello"* — a textbook recap that demonstrates you can apply</sub> | |
| 27 | `06-phase-portfolio-projects.md:542` | \| **A name-resolution investigation** \| Browse to a domain: the DNS query and response, the resolved address, the TCP handshake, the TLS negotiation including SNI, the HTTP request if unencrypted \| Which resolver was used? Was the response cached? Did anyth … | |
| 28 | `06-phase-portfolio-projects.md:555` | \| `tcp.flags.syn == 1 && tcp.flags.ack == 0` \| Connection attempts \| | |
| | | <sub>↑ \| `dns` \| Name-resolution activity \|<br>↓ \| `tls.handshake.extensions_server_name` \| Which hostname was requested over TLS \|</sub> | |
| 29 | `08-phase-job-application.md:300` | **TCP — "Why does understanding the TCP three-way handshake matter for security analysis?"** | |
| 30 | `08-phase-job-application.md:302` | *"Because it tells you whether a connection actually completed, which distinguishes a scan or a blocked attempt from a real session. The handshake is SYN, SYN-ACK, ACK.* | |
| 31 | `08-phase-job-application.md:304` | *In a capture, a full handshake means the host connected successfully. A SYN with no response means the port is filtered or the host is down. A SYN followed by RST means the port is closed but the host is reachable — that pattern across many ports is character … | |
| 32 | `12-phase-scripting-automation.md:89` | \| Authentication flows \| API keys, bearer tokens, OAuth — the same patterns, new names \| | |
| | | <sub>↑ \| JSON parsing \| API responses, configuration, and log exports are all JSON \|<br>↓ \| Version control and `.gitignore` \| The habit that prevents the most common security mistake in this phase \|</sub> | |
| 33 | `14-phase-web-app-security.md:1282` | - **Injection is about an interpreter, not about SQL.** NoSQL, LDAP, template, command, and header injection are the same bug in different places. | |
| 34 | `15-phase-ot-ics-security.md:87` | \| TCP/IP, ports, sessions, and handshakes \| Nearly all modern industrial traffic rides on TCP or UDP \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Wireshark and reading a capture \| The core skill of this phase, unchanged in method \|</sub> | |
| 35 | `15-phase-ot-ics-security.md:330` | \| **Modbus TCP** \| Modicon, 1979, over serial first \| TCP, port 502 \| Read and write registers and coils on a device \| **None** \| | |
| 36 | `15-phase-ot-ics-security.md:331` | \| **DNP3** \| Utilities, early 1990s \| TCP or UDP, port 20000 \| Master-to-outstation telemetry for electric and water utilities \| Optional, and often unused \| | |
| 37 | `15-phase-ot-ics-security.md:332` | \| **EtherNet/IP** \| Rockwell and ODVA, late 1990s \| TCP port 44818, UDP port 2222 \| Industrial device messaging using the CIP object model \| **None** by default \| | |
| 38 | `15-phase-ot-ics-security.md:334` | \| **OPC UA** \| The OPC Foundation, 2006 onward \| TCP, commonly port 4840 \| Vendor-neutral data modelling and transport \| **Yes**, with certificates and sessions \| | |
| 39 | `15-phase-ot-ics-security.md:342` | A Modbus TCP packet begins with a seven-byte header, then a function code, then data. | |
| 40 | `15-phase-ot-ics-security.md:446` | \| **Implicit** \| UDP, port 2222, multicast \| Repeated at the control loop rate, carrying I/O data \| A heartbeat that never stops \| | |
| 41 | `15-phase-ot-ics-security.md:447` | \| **Explicit** \| TCP, port 44818 \| Request and response, for configuration and diagnostics \| A conversation \| | |
| 42 | `15-phase-ot-ics-security.md:717` | \| A TCP SYN to an unopened port \| Some older stacks crash or hang on unexpected packets \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| A service probe that speaks half a protocol \| A device may enter a fault state waiting for the rest \|</sub> | |
| 43 | `15-phase-ot-ics-security.md:767` | \| `ip.src == <controller> && tcp.flags.syn == 1` \| New connections to a controller — the highest-value alert \| | |
| 44 | `15-phase-ot-ics-security.md:802` | Read the rule as a sentence. It matches established TCP to port 502, checks that the protocol identifier field is zero, then tests the byte at offset seven — the function code — and alerts when it is fifteen or above. | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._

---

<!-- 04-registry-paths-file-paths-and-filenames.md — 47 rows -->

# Registry paths, file paths and filenames


*Verbatim strings that must match the OS exactly. A transposed path sends a reader somewhere that does not exist.*

**Source to check against:** Microsoft documentation, or the OS itself

47 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `01-phase-foundations.md:203` | The **asset** is an old web server. The **vulnerability** is a known flaw in an outdated version of its software, published as CVE-2021-41773 in Apache's HTTP Server. The **threat** is an attacker scanning the internet for that exact version. The **exploit** i … | |
| 2 | `01-phase-foundations.md:840` | **Why:** The exploit is the specific technique or piece of code that takes advantage of a vulnerability, and the crafted URL is exactly that. The vulnerability is the flaw in the outdated Apache version itself — it exists whether or not anyone writes a URL. Th … | |
| 3 | `02-phase-networking-and-linux.md:55` | - Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog` | |
| | | <sub>↑ - Services with `systemctl`<br>↓ - Reading logs as evidence: `grep`, `awk`, `sort`, `uniq`, and `zgrep` pipelines that answer a question rather than dumping a file</sub> | |
| 4 | `02-phase-networking-and-linux.md:89` | On Windows, network configuration is buried in GUI dialogs, and logging is abstracted away. On Linux, you type `ip a` and see your interfaces. You type `ss -tulpn` and see every listening service with the process that owns it. You read `/var/log/auth.log` to w … | |
| 5 | `02-phase-networking-and-linux.md:517` | \| **`/etc`** \| `/etc/passwd` (user accounts), `/etc/shadow` (password hashes, readable only by root), `/etc/ssh/sshd_config` (SSH server configuration), `/etc/hosts` \| Configuration is where misconfiguration is found \| | |
| 6 | `02-phase-networking-and-linux.md:518` | \| **`/var/log`** \| The logs you will investigate \| The evidence lives here \| | |
| | | <sub>↑ \| **`/etc`** \| `/etc/passwd` (user accounts), `/etc/shadow` (password hashes, readable only by root), `/etc/ssh/sshd_config` (SSH server configurati …<br>↓ \| **`/tmp`** \| Temporary files \| World-writable, which makes it a favourite location for attackers to stage files, because anything can be written  …</sub> | |
| 7 | `02-phase-networking-and-linux.md:625` | Every `sudo` invocation is logged, which is why it also serves the **accounting** part of AAA. Reading `/etc/sudoers` shows who has been granted what — and a common finding in security reviews is that far too many users are in the sudo group. | |
| 8 | `02-phase-networking-and-linux.md:645` | Reading `/etc/passwd` carefully is a genuinely useful skill. Two fields carry the security meaning. | |
| 9 | `02-phase-networking-and-linux.md:652` | \| **Login shell** \| `/usr/sbin/nologin` \| The account exists but cannot log in interactively — how service accounts are locked down \| | |
| 10 | `02-phase-networking-and-linux.md:661` | **SSH** gives you an encrypted shell on a remote machine. The server is `sshd` — the SSH *daemon*, where a daemon is a background service. It is configured in `/etc/ssh/sshd_config`, and it listens on port 22 by default. | |
| 11 | `02-phase-networking-and-linux.md:738` | \| `/var/log/auth.log` \| Authentication: logins, `sudo` use, SSH attempts (Debian/Ubuntu) \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `/var/log/secure` \| The same role on RHEL/CentOS family \|</sub> | |
| 12 | `02-phase-networking-and-linux.md:739` | \| `/var/log/secure` \| The same role on RHEL/CentOS family \| | |
| | | <sub>↑ \| `/var/log/auth.log` \| Authentication: logins, `sudo` use, SSH attempts (Debian/Ubuntu) \|<br>↓ \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \|</sub> | |
| 13 | `02-phase-networking-and-linux.md:740` | \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \| | |
| | | <sub>↑ \| `/var/log/secure` \| The same role on RHEL/CentOS family \|<br>↓ \| `/var/log/messages` \| General system messages (RHEL/CentOS) \|</sub> | |
| 14 | `02-phase-networking-and-linux.md:741` | \| `/var/log/messages` \| General system messages (RHEL/CentOS) \| | |
| | | <sub>↑ \| `/var/log/syslog` \| General system messages (Debian/Ubuntu) \|<br>↓ \| `/var/log/apache2/`, `/var/log/nginx/` \| Web server access and error logs \|</sub> | |
| 15 | `02-phase-networking-and-linux.md:742` | \| `/var/log/apache2/`, `/var/log/nginx/` \| Web server access and error logs \| | |
| | | <sub>↑ \| `/var/log/messages` \| General system messages (RHEL/CentOS) \|</sub> | |
| 16 | `02-phase-networking-and-linux.md:757` | Watch the failures appear. Then use `grep` to pull the failed attempts out of `/var/log/auth.log`. | |
| 17 | `02-phase-networking-and-linux.md:839` | `zgrep` searches compressed logs too. On a system that has been running a while, `/var/log/auth.log` is only the most recent slice, and the earlier evidence is in `auth.log.1.gz`, `auth.log.2.gz` and so on. `auth.log*` catches all of them. | |
| 18 | `02-phase-networking-and-linux.md:1140` | - **`/etc/passwd` UID 0 is root, and nothing else should be.** A non-root account with UID 0 is a backdoor; a service account with `/bin/bash` where `nologin` belongs is a misconfiguration. | |
| 19 | `02-phase-networking-and-linux.md:1152` | 2. **Then permissions** (task 2), because they are the foundation of Linux security thinking. Create two users, put them in a group, create a file, and try to read it as the wrong user. Read `/etc/passwd` and find the UID field. Being denied access is the less … | |
| 20 | `02-phase-networking-and-linux.md:1153` | 3. **Then SSH** (task 3), which turns your VM into a remote system you can work with comfortably. Set up keys, not just passwords, and read `/etc/ssh/sshd_config` while you are there. | |
| 21 | `02-phase-networking-and-linux.md:1244` | **Why:** Service accounts exist to run processes, not to be logged into, so the expected value is `/usr/sbin/nologin`. An interactive shell on one is a finding because it is an account an attacker can actually log in as, and service accounts are frequently wea … | |
| 22 | `02-phase-networking-and-linux.md:1325` | **Why:** `-u sshd` matches a systemd unit by that exact name, and on some distributions the unit is `ssh.service` rather than `sshd.service`, so the filter matches nothing. Separately, not every distribution routes SSH into the journal — Debian and Ubuntu fami … | |
| 23 | `03-phase-security-fundamentals.md:302` | In Linux the equivalent evidence lives where Phase 2 showed you: `/var/log/auth.log` or `/var/log/secure`, read through `journalctl -u sshd`. | |
| 24 | `03-phase-security-fundamentals.md:393` | \| `C:\Windows\System32\svchost.exe` \| The real one \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| `C:\Users\Public\svchost.exe` \| Not the real one \|</sub> | |
| 25 | `03-phase-security-fundamentals.md:394` | \| `C:\Users\Public\svchost.exe` \| Not the real one \| | |
| | | <sub>↑ \| `C:\Windows\System32\svchost.exe` \| The real one \|</sub> | |
| 26 | `03-phase-security-fundamentals.md:408` | \| **Registry Run keys** \| `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` and its `HKLM` equivalent \| Causes a program to start at login. The classic location, and still heavily used \| | |
| 27 | `03-phase-security-fundamentals.md:431` | \| **Processes from odd locations** \| `C:\Users\Public\`, `C:\Temp\`, `%APPDATA%`, or `/tmp` on Linux \| Legitimate system binaries do not run from user-writable directories; that is the whole point of the expectation \| | |
| 28 | `03-phase-security-fundamentals.md:1208` | **Why:** The phase's masquerading section makes predictability the detection: the real `svchost.exe` lives in `C:\Windows\System32`, and legitimate binaries run from their expected directories, which is exactly what makes impersonation visible. The parent-proc … | |
| 29 | `04-phase-hands-on-labs.md:452` | \| **The agent checks in but no events arrive** \| The log file is not in the agent's configuration, or nothing is being written to it \| On the victim, generate an event and confirm it appears in `/var/log/auth.log` \| Add the log location to `ossec.conf` on  … | |
| 30 | `04-phase-hands-on-labs.md:544` | \| 2 \| **Find it in the raw log** on the victim (`/var/log/auth.log`, or Event Viewer) \| Proving it exists *at the source* is what lets you isolate a forwarding failure from a detection failure \| | |
| 31 | `10-phase-detection-engineering.md:41` | - Linux auditd rules and `/var/log/auth.log` interpretation | |
| | | <sub>↑ - Sysmon event IDs: 1, 3, 7, 8, 10, 11, 12, 13, 22<br>↓ - Syslog facilities, priorities, and severity</sub> | |
| 32 | `10-phase-detection-engineering.md:217` | \| SSH authentication \| Linux \| `/var/log/auth.log` \| High \| | |
| | | <sub>↑ \| Command executed as root \| Linux auditd \| `execve` with `auid=0` or a sudo tag \| Medium, depends on rules \|<br>↓ \| Cron job created \| Linux \| auditd file watch on `/etc/cron*` \| High \|</sub> | |
| 33 | `10-phase-detection-engineering.md:218` | \| Cron job created \| Linux \| auditd file watch on `/etc/cron*` \| High \| | |
| | | <sub>↑ \| SSH authentication \| Linux \| `/var/log/auth.log` \| High \|<br>↓ \| Web request \| Web server access log \| Request line, status, user agent \| High \|</sub> | |
| 34 | `10-phase-detection-engineering.md:349` | \| `/var/log/auth.log` or `/var/log/secure` \| Authentication, sudo, SSH, su \| Plain text, one event per line \| | |
| 35 | `10-phase-detection-engineering.md:352` | \| `/var/log/syslog` or `/var/log/messages` \| General system messages \| Plain text \| | |
| | | <sub>↑ \| `journald` \| Systemd service logs, kernel messages \| `journalctl` with filters \|<br>↓ \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \|</sub> | |
| 36 | `10-phase-detection-engineering.md:353` | \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \| | |
| | | <sub>↑ \| `/var/log/syslog` or `/var/log/messages` \| General system messages \| Plain text \|<br>↓ \| Cron \| Scheduled job definitions and execution \| `/var/log/cron` or journald \|</sub> | |
| 37 | `10-phase-detection-engineering.md:354` | \| Cron \| Scheduled job definitions and execution \| `/var/log/cron` or journald \| | |
| | | <sub>↑ \| `/etc/passwd` and `/etc/shadow` access \| Account changes \| Via auditd file watches \|</sub> | |
| 38 | `10-phase-detection-engineering.md:358` | The auditd rules worth writing first, because they cover the persistence and privilege-escalation behaviours that matter. Put them in `/etc/audit/rules.d/10-lab.rules`, load them with `augenrules --load`, and confirm they are live with `auditctl -l` — a rule t … | |
| 39 | `10-phase-detection-engineering.md:1113` | \| auditd \| Linux syscall and file auditing \| Free/open-source \| https://man7.org/linux/man-pages/man8/auditd.8.html \| Write file watches for `/etc/passwd` and `/etc/cron.d` \| journald with targeted filters \| | |
| 40 | `11-phase-incident-response.md:456` | \| **Prefetch** \| `C:\Windows\Prefetch` \| Which programs ran, when, and how often \| | |
| | | <sub>↑ \| **USN Journal** \| `$Extend\$UsnJrnl` \| What changed, in order, with reasons — created, written, renamed, deleted \|<br>↓ \| **ShimCache** \| Registry `AppCompatCache` \| Which executables existed on the system, even if deleted \|</sub> | |
| 41 | `11-phase-incident-response.md:458` | \| **AmCache** \| `C:\Windows\AppCompat\Programs\Amcache.hve` \| Program execution with SHA-1 hashes and install paths \| | |
| 42 | `11-phase-incident-response.md:462` | \| **Event logs** \| `C:\Windows\System32\winevt\Logs` \| Security, System, Application, and Sysmon records \| | |
| 43 | `11-phase-incident-response.md:512` | \| 09:11:40 \| LNK / Jump list \| `Invoice_4421.docm` opened from `C:\Users\jsantos\Downloads` \| | |
| | | <sub>↑ \| 09:04:12 \| Security 4624 type 2 \| User `LAB\jsantos` logs on interactively \|<br>↓ \| 09:11:44 \| Sysmon 11 \| `C:\Users\jsantos\AppData\Local\Temp\kx8f.tmp` created \|</sub> | |
| 44 | `11-phase-incident-response.md:513` | \| 09:11:44 \| Sysmon 11 \| `C:\Users\jsantos\AppData\Local\Temp\kx8f.tmp` created \| | |
| | | <sub>↑ \| 09:11:40 \| LNK / Jump list \| `Invoice_4421.docm` opened from `C:\Users\jsantos\Downloads` \|<br>↓ \| 09:11:46 \| Sysmon 1 \| `WINWORD.EXE` spawns `powershell.exe -nop -w hidden -enc ...` \|</sub> | |
| 45 | `11-phase-incident-response.md:952` | \| "Looked at the disk, found malware" \| "Mounted `/evidence/disk.img` read-only at 14:05 UTC. Ran `fls -o 1048576 -r -m C:/`; output to `bodyfile.txt`. Identified `C:\Users\jsantos\AppData\Local\Temp\svchost.exe` with an MFT creation timestamp of 2026-03-14  … | |
| 46 | `12-phase-scripting-automation.md:854` | The filters in commands 5 and 6 are doing the analytical work. A service whose binary lives outside `C:\Windows` is worth looking at; a scheduled task that has *run* recently on a machine nobody changed is worth looking at. | |
| 47 | `12-phase-scripting-automation.md:1133` | **What it got wrong.** Three weeks later, a real intrusion is found during an unrelated review. The entry point was a signed binary dropped into `C:\Program Files\Corp\`, with its timestamps set back by the attacker so the file appeared months old. The matchin … | |

