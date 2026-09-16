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

26 claim(s).

| # | Location | Text as written | Verdict |
|---|---|---|---|
| 1 | `03-phase-networking-basics.md:27` | - Understand IPv4, IPv6 basics, subnet mask, gateway, DNS, DHCP, NAT, TCP, UDP, ICMP, ports, and Wi-Fi. | |
| | | <sub>↑ - Explain LAN, WAN, internet, router, switch, firewall, modem, access point, and ISP.<br>↓ - Use `ping`, `tracert/traceroute`, `ipconfig/ifconfig/ip`, `nslookup`, `arp -a`, `route print`, and Wireshark.</sub> | |
| 2 | `03-phase-networking-basics.md:76` | The good news is that the foundation is small. You need to understand addresses, subnets, gateways, DNS, DHCP, ports, and the difference between TCP and UDP. That is genuinely most of it. | |
| 3 | `03-phase-networking-basics.md:185` | **DHCP (Dynamic Host Configuration Protocol)** hands out addresses automatically. The four-step exchange is called **DORA**, and it is worth memorising because it tells you what to check when it fails: | |
| 4 | `03-phase-networking-basics.md:284` | - **TCP** is connection-oriented and reliable. It establishes a connection with a **three-way handshake** — `SYN`, `SYN-ACK`, `ACK` — numbers every byte, acknowledges receipt, and retransmits anything lost. It is used when correctness matters: web browsing, fi … | |
| 5 | `03-phase-networking-basics.md:285` | - **UDP** is connectionless and best-effort. It sends packets with no handshake and no guarantee. It is used when speed matters more than perfection: video streaming, voice calls, DNS queries, games. | |
| 6 | `03-phase-networking-basics.md:289` | You can see the handshake on your own machine. In Wireshark, filter on `tcp` and open any website. You will see the three packets at the start of every connection: `SYN`, then `SYN, ACK`, then `ACK`. Watching that once, with your own eyes, does more for your u … | |
| 7 | `03-phase-networking-basics.md:293` | **TLS (Transport Layer Security)** wraps a connection in encryption and proves the server's identity with a **certificate**. **HTTPS** is simply HTTP carried inside TLS, on port 443. | |
| 8 | `03-phase-networking-basics.md:772` | - **TcpTestSucceeded** is the answer. `True` means the TCP handshake completed: the server accepted your connection on that port. | |
| 9 | `03-phase-networking-basics.md:857` | \| Every packet timed out \| The host is unreachable, or it blocks ICMP \| Follow the ladder; also test a port with `Test-NetConnection` \| | |
| 10 | `03-phase-networking-basics.md:864` | **Second, and more importantly: “ping works but the app does not” is a different problem class.** Ping uses **ICMP**, a completely different protocol from TCP. A host can cheerfully answer ICMP while a specific TCP port is blocked by a firewall, or while the s … | |
| 11 | `03-phase-networking-basics.md:890` ▶ | Authentication : WPA2-Personal | |
| | | <sub>↑ Radio type : 802.11ax<br>↓ Cipher : CCMP</sub> | |
| 12 | `03-phase-networking-basics.md:1158` | **For the TCP handshake:** start a new capture, then load a website in your browser while it runs. Stop it and filter on: | |
| 13 | `03-phase-networking-basics.md:1161` ▶ | tcp.flags.syn==1 | |
| | | <sub>↑ ```text<br>↓ ```</sub> | |
| 14 | `03-phase-networking-basics.md:1164` | That filter shows packets with the **SYN** flag set — the packets that begin a connection. Find one connection and look at the three packets at its start: | |
| 15 | `03-phase-networking-basics.md:1166` | 1. **SYN** — your machine to the server: “I would like to open a connection, here is my starting sequence number.” | |
| 16 | `03-phase-networking-basics.md:1167` | 2. **SYN, ACK** — server to your machine: “Agreed, and here is mine.” | |
| | | <sub>↑ 1. **SYN** — your machine to the server: “I would like to open a connection, here is my starting sequence number.”<br>↓ 3. **ACK** — your machine to the server: “Acknowledged. Connection open.”</sub> | |
| 17 | `03-phase-networking-basics.md:1172` | Two practical notes. If the capture looks overwhelming, remember Wireshark is showing *everything* on your adapter; the filter is what makes it readable. And if you see your own traffic in encrypted form, that is TLS doing its job — you will see the handshake  … | |
| 18 | `03-phase-networking-basics.md:1644` | - **TCP** is reliable and connection-oriented; **UDP** is fast and best-effort. | |
| | | <sub>↑ - **Ports** route traffic to the right service. Know the common ones; respect the dangerous ones.<br>↓ - `Test-NetConnection` and `nslookup` are your two best everyday tools.</sub> | |
| 19 | `03-phase-networking-basics.md:1655` | - **The diagnostic ladder is link, IP, gateway, DNS, port, application — in that order, stopping at the first failure.** The order is the skill; the commands are just the tools. | |
| 20 | `03-phase-networking-basics.md:1686` | \| Wireshark \| Packet capture/analysis \| Free \| https://www.wireshark.org/ \| Capture DNS lookup and TCP handshake \| tcpdump on Linux \| | |
| 21 | `03-phase-networking-basics.md:1711` | 6. Capture a TCP handshake in Wireshark. Filter on `tcp`, find a handshake between your device and a server, and explain the three-way handshake. <!-- id: it-03-t06 band: focused energy: normal --> | |
| 22 | `03-phase-networking-basics.md:1792` | **Why:** TCP is connection-oriented and reliable — it opens with the `SYN`, `SYN-ACK`, `ACK` handshake and retransmits what is lost. UDP is best-effort by design; ICMP carries diagnostics; ARP maps IP to MAC. | |
| 23 | `07-phase-soft-skills.md:520` | > The machine is failing to complete the DHCP handshake on the corporate VLAN. It gets an APIPA address, so it is not reaching the scope. I have ruled out the cable and the switch port. Suspect the scope is exhausted or the reservation is stale — checking the  … | |
| 24 | `08-phase-portfolio-and-resume.md:97` | \| **Action** \| "Learned about DHCP" \| "Configured a DHCP scope, then captured the DORA exchange in Wireshark to confirm it" \| | |
| 25 | `08-phase-portfolio-and-resume.md:276` ▶ | confirm the DORA sequence; intentionally broke the gateway setting on | |
| | | <sub>↑ tracert across subnets; captured the DHCP exchange in Wireshark to<br>↓ one client to see how the failure presents.</sub> | |
| 26 | `08-phase-portfolio-and-resume.md:279` ▶ | the portfolio. I can now explain the DORA sequence from the packets | |
| | | <sub>↑ Result : A working routed lab, a network diagram, and packet-capture notes in<br>↓ rather than from memory, and I recognise a wrong-gateway symptom</sub> | |

_▶ marks a line inside a code block — executable, so a wrong flag or path is worse than a wrong sentence._
