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

# Protocol and standard behaviour


*Fixed by the defining spec. Includes handshake sequences, header fields, status codes and OSI layer assignments.*

**Source to check against:** The RFC or standard that defines the protocol; vendor docs for proprietary ones

43 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `02-phase-networking-and-linux.md:26` | - Understand IPv4, IPv6 basics, subnetting, DNS, DHCP, NAT, TCP/UDP, ICMP, TLS, HTTP, and common ports. | |
| | | <sub>↓ - Use Linux confidently for files, permissions, processes, services, SSH, logs, and networking.</sub> | |
| 2 | `02-phase-networking-and-linux.md:41` | - TCP handshake and connection teardown | |
| | | <sub>↑ - DHCP process<br>↓ - UDP use cases</sub> | |
| 3 | `02-phase-networking-and-linux.md:131` | \| 4 Transport \| Ports, reliability \| TCP, UDP \| Port closed, timeout \| | |
| | | <sub>↑ \| 5 Session \| Managing conversations \| Session setup \| Connection drops \|<br>↓ \| 3 Network \| Logical addressing, routing \| IP, ICMP \| Cannot reach the host \|</sub> | |
| 4 | `02-phase-networking-and-linux.md:288` | **DHCP** (Dynamic Host Configuration Protocol) hands out addresses automatically, through a four-step exchange known as **DORA**. | |
| 5 | `02-phase-networking-and-linux.md:312` | **TCP** is connection-oriented and reliable. It begins with the **three-way handshake**: | |
| 6 | `02-phase-networking-and-linux.md:315` ▶ | Client → Server: SYN ("I would like to connect, my sequence starts here") | |
| | | <sub>↑ ```text<br>↓ Server → Client: SYN-ACK ("Acknowledged, and here is mine")</sub> | |
| 7 | `02-phase-networking-and-linux.md:316` ▶ | Server → Client: SYN-ACK ("Acknowledged, and here is mine") | |
| | | <sub>↑ Client → Server: SYN ("I would like to connect, my sequence starts here")<br>↓ Client → Server: ACK ("Acknowledged — connection established")</sub> | |
| 8 | `02-phase-networking-and-linux.md:329` | \| A `SYN` that gets no reply \| The port is filtered, or the host is down \| | |
| | | <sub>↑ \| A completed handshake \| The port is open and something is listening \|<br>↓ \| A `SYN` answered by `RST` (reset) \| The host is alive but nothing is listening on that port \|</sub> | |
| 9 | `02-phase-networking-and-linux.md:330` | \| A `SYN` answered by `RST` (reset) \| The host is alive but nothing is listening on that port \| | |
| | | <sub>↑ \| A `SYN` that gets no reply \| The port is filtered, or the host is down \|</sub> | |
| 10 | `02-phase-networking-and-linux.md:338` | **UDP** is connectionless and unreliable: no handshake, no ordering, no retransmission. | |
| 11 | `02-phase-networking-and-linux.md:370` | Two of these deserve emphasis. **Port 445 (SMB)** and **port 3389 (RDP)** exposed to the internet are among the most common causes of ransomware incidents in the world, because both are legitimate services that attackers can authenticate to. | |
| 12 | `02-phase-networking-and-linux.md:698` ▶ | sudo ss -tulpn # listening TCP/UDP ports with owning processes | |
| | | <sub>↑ ip neigh # the ARP table — IP-to-MAC mappings<br>↓ dig example.com MX # DNS records</sub> | |
| 13 | `02-phase-networking-and-linux.md:792` ▶ | sudo tcpdump -i eth0 -n 'tcp port 80' # only HTTP, no name resolution | |
| | | <sub>↑ sudo tcpdump -i eth0 port 53 # only DNS<br>↓ sudo tcpdump -r capture.pcap -nn # read a saved capture</sub> | |
| 14 | `02-phase-networking-and-linux.md:807` ▶ | tcp.flags.syn == 1 connection attempts | |
| | | <sub>↑ ip.addr == 192.168.1.50 one host<br>↓ tcp.flags.reset == 1 resets — refused connections</sub> | |
| 15 | `02-phase-networking-and-linux.md:851` | \| **open** \| A completed TCP handshake, or a UDP reply \| Something is listening and accepted the connection \| | |
| 16 | `02-phase-networking-and-linux.md:973` | - **TCP's three-way handshake explains Nmap's output.** Completed handshake = open; `RST` = closed (host is up); silence = filtered. Learn the handshake and port states stop being arbitrary. | |
| 17 | `02-phase-networking-and-linux.md:996` | 9. **Write the TCP handshake mini-report last** (task 9), once the capture work has given you the material. Follow the deliverable's structure and keep it short. If you can explain the handshake from your own capture — including why the packets are in that ord … | |
| 18 | `02-phase-networking-and-linux.md:1004` | \| Wireshark \| Packet analysis \| Free \| https://www.wireshark.org/ \| Capture DNS, HTTP, TCP handshake \| tcpdump \| | |
| 19 | `02-phase-networking-and-linux.md:1029` | 9. Write a mini-report explaining one TCP handshake capture. <!-- id: cyber-02-t09 band: focused energy: normal --> | |
| 20 | `03-phase-security-fundamentals.md:466` | It also explains why the *direction* of a rule is essential context. RDP on port 3389 is an *inbound* service — the thing you are protecting — so an inbound deny on 3389 is the correct posture, and a separate outbound permit on 3389 is ordinary and unrelated t … | |
| 21 | `03-phase-security-fundamentals.md:500` | If TLS hides the content, signature matching cannot see inside without interception. This is why modern detection leans on metadata — connection patterns, volumes, timing, destinations, and JA3/JA4 fingerprints of the TLS handshake itself — rather than payload … | |
| 22 | `03-phase-security-fundamentals.md:549` | \| DNS-over-HTTPS clients \| The lookup is encrypted and leaves the network's resolver entirely \| | |
| | | <sub>↑ \| Direct-to-IP connections \| DNS filtering only works on names \|<br>↓ \| Domain generation algorithms \| Malware generates hundreds of candidate domains, so blocking a list catches only some \|</sub> | |
| 23 | `03-phase-security-fundamentals.md:956` | \| 5 \| Check for old app passwords and OAuth grants \| Access you granted years ago and forgot \| | |
| | | <sub>↑ \| 4 \| Find your recovery options for each \| A stale recovery email is an unlocked back door \|</sub> | |
| 24 | `06-phase-portfolio-projects.md:45` | - Capture DNS, HTTP, TLS handshake metadata, and failed connection attempts. | |
| | | <sub>↓ - Explain protocols and suspicious indicators.</sub> | |
| 25 | `06-phase-portfolio-projects.md:530` | features. The report becomes *"here is a DNS query, here is a TCP handshake, | |
| | | <sub>↑ Wireshark work has a specific failure mode: it turns into a tour of Wireshark's<br>↓ here is a TLS ClientHello"* — a textbook recap that demonstrates you can apply</sub> | |
| 26 | `06-phase-portfolio-projects.md:542` | \| **A name-resolution investigation** \| Browse to a domain: the DNS query and response, the resolved address, the TCP handshake, the TLS negotiation including SNI, the HTTP request if unencrypted \| Which resolver was used? Was the response cached? Did anyth … | |
| 27 | `06-phase-portfolio-projects.md:555` | \| `tcp.flags.syn == 1 && tcp.flags.ack == 0` \| Connection attempts \| | |
| | | <sub>↑ \| `dns` \| Name-resolution activity \|<br>↓ \| `tls.handshake.extensions_server_name` \| Which hostname was requested over TLS \|</sub> | |
| 28 | `08-phase-job-application.md:300` | **TCP — "Why does understanding the TCP three-way handshake matter for security analysis?"** | |
| 29 | `08-phase-job-application.md:302` | *"Because it tells you whether a connection actually completed, which distinguishes a scan or a blocked attempt from a real session. The handshake is SYN, SYN-ACK, ACK.* | |
| 30 | `08-phase-job-application.md:304` | *In a capture, a full handshake means the host connected successfully. A SYN with no response means the port is filtered or the host is down. A SYN followed by RST means the port is closed but the host is reachable — that pattern across many ports is character … | |
| 31 | `12-phase-scripting-automation.md:89` | \| Authentication flows \| API keys, bearer tokens, OAuth — the same patterns, new names \| | |
| | | <sub>↑ \| JSON parsing \| API responses, configuration, and log exports are all JSON \|<br>↓ \| Version control and `.gitignore` \| The habit that prevents the most common security mistake in this phase \|</sub> | |
| 32 | `14-phase-web-app-security.md:1242` | - **Injection is about an interpreter, not about SQL.** NoSQL, LDAP, template, command, and header injection are the same bug in different places. | |
| 33 | `15-phase-ot-ics-security.md:87` | \| TCP/IP, ports, sessions, and handshakes \| Nearly all modern industrial traffic rides on TCP or UDP \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Wireshark and reading a capture \| The core skill of this phase, unchanged in method \|</sub> | |
| 34 | `15-phase-ot-ics-security.md:330` | \| **Modbus TCP** \| Modicon, 1979, over serial first \| TCP, port 502 \| Read and write registers and coils on a device \| **None** \| | |
| 35 | `15-phase-ot-ics-security.md:331` | \| **DNP3** \| Utilities, early 1990s \| TCP or UDP, port 20000 \| Master-to-outstation telemetry for electric and water utilities \| Optional, and often unused \| | |
| 36 | `15-phase-ot-ics-security.md:332` | \| **EtherNet/IP** \| Rockwell and ODVA, late 1990s \| TCP port 44818, UDP port 2222 \| Industrial device messaging using the CIP object model \| **None** by default \| | |
| 37 | `15-phase-ot-ics-security.md:334` | \| **OPC UA** \| The OPC Foundation, 2006 onward \| TCP, commonly port 4840 \| Vendor-neutral data modelling and transport \| **Yes**, with certificates and sessions \| | |
| 38 | `15-phase-ot-ics-security.md:342` | A Modbus TCP packet begins with a seven-byte header, then a function code, then data. | |
| 39 | `15-phase-ot-ics-security.md:446` | \| **Implicit** \| UDP, port 2222, multicast \| Repeated at the control loop rate, carrying I/O data \| A heartbeat that never stops \| | |
| 40 | `15-phase-ot-ics-security.md:447` | \| **Explicit** \| TCP, port 44818 \| Request and response, for configuration and diagnostics \| A conversation \| | |
| 41 | `15-phase-ot-ics-security.md:717` | \| A TCP SYN to an unopened port \| Some older stacks crash or hang on unexpected packets \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| A service probe that speaks half a protocol \| A device may enter a fault state waiting for the rest \|</sub> | |
| 42 | `15-phase-ot-ics-security.md:767` | \| `ip.src == <controller> && tcp.flags.syn == 1` \| New connections to a controller — the highest-value alert \| | |
| 43 | `15-phase-ot-ics-security.md:802` | Read the rule as a sentence. It matches established TCP to port 502, checks that the protocol identifier field is zero, then tests the byte at offset seven — the function code — and alerts when it is fifteen or above. | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._
