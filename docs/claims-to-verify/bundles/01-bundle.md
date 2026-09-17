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

# This bundle covers 4 claim classes, 59 rows total.

**Answer every row in every table below, in order, and output the tables complete.**
Do not summarise and do not sample. If you run low on room, stop at a row boundary
and say which table and row number to continue from — a continuation is cheap and
an incomplete table is not.

---

<!-- 01-dns-record-types.md — 4 rows -->

# DNS record types

| 1 | `03-phase-networking-basics.md:54` | - DNS: A, AAAA, CNAME, MX, TXT, NS records | |
| | | <sub>↓ - DHCP: Discover, Offer, Request, Acknowledge at a beginner level</sub> | |
| 2 | `03-phase-networking-basics.md:180` | 2. **`AAAA` records are the DNS counterpart to IPv4's `A` records.** If a name resolves over IPv4 but not IPv6, an `AAAA` lookup tells you. | |
| 3 | `03-phase-networking-basics.md:231` ▶ | nslookup google.com # the A record | |
| | | <sub>↑ ```powershell<br>↓ nslookup -type=mx gmail.com # mail servers</sub> | |
| 4 | `03-phase-networking-basics.md:233` ▶ | nslookup -type=txt google.com # TXT records | |
| | | <sub>↑ nslookup -type=mx gmail.com # mail servers<br>↓ nslookup google.com 8.8.8.8 # ask a SPECIFIC server</sub> | |

---

<!-- 02-protocol-and-standard-behaviour.md — 25 rows -->

# Protocol and standard behaviour

| 1 | `03-phase-networking-basics.md:27` | - Understand IPv4, IPv6 basics, subnet mask, gateway, DNS, DHCP, NAT, TCP, UDP, ICMP, ports, and Wi-Fi. | |
| | | <sub>↑ - Explain LAN, WAN, internet, router, switch, firewall, modem, access point, and ISP.<br>↓ - Use `ping`, `tracert/traceroute`, `ipconfig/ifconfig/ip`, `nslookup`, `arp -a`, `route print`, and Wireshark.</sub> | |
| 2 | `03-phase-networking-basics.md:76` | The good news is that the foundation is small. You need to understand addresses, subnets, gateways, DNS, DHCP, ports, and the difference between TCP and UDP. That is genuinely most of it. | |
| 3 | `03-phase-networking-basics.md:185` | **DHCP (Dynamic Host Configuration Protocol)** hands out addresses automatically. The four-step exchange is called **DORA**, and it is worth memorising because it tells you what to check when it fails: | |
| 4 | `03-phase-networking-basics.md:284` | - **TCP** is connection-oriented and reliable. It establishes a connection with a **three-way handshake** — `SYN`, `SYN-ACK`, `ACK` — numbers every byte, acknowledges receipt, and retransmits anything lost. It is used when correctness matters: web browsing, fi … | |
| 5 | `03-phase-networking-basics.md:285` | - **UDP** is connectionless and best-effort. It sends packets with no handshake and no guarantee. It is used when speed matters more than perfection: video streaming, voice calls, DNS queries, games. | |
| 6 | `03-phase-networking-basics.md:289` | You can see the handshake on your own machine. In Wireshark, filter on `tcp` and open any website. You will see the three packets at the start of every connection: `SYN`, then `SYN, ACK`, then `ACK`. Watching that once, with your own eyes, does more for your u … | |
| 7 | `03-phase-networking-basics.md:293` | **TLS (Transport Layer Security)** wraps a connection in encryption and proves the server's identity with a **certificate**. **HTTPS** is simply HTTP carried inside TLS, on port 443. | |
| 8 | `03-phase-networking-basics.md:772` | - **TcpTestSucceeded** is the answer. `True` means the TCP handshake completed: the server accepted your connection on that port. | |
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

---

<!-- 03-product-versions-and-editions.md — 16 rows -->

# Product versions and editions

| 1 | `01-phase-computer-fundamentals.md:112` | The same information is available without a terminal: press **Ctrl+Shift+Esc** for Task Manager, click the **Performance** tab, and select **CPU**. You will see the model name, the core count, the current speed, and a live graph. For a fuller report, search th … | |
| 2 | `01-phase-computer-fundamentals.md:449` | 2. **Let Windows Update handle it when it can.** On modern Windows 10 and 11, most drivers install automatically and correctly. Manually chasing the newest driver is rarely necessary and occasionally harmful. | |
| 3 | `06-phase-tools-and-ticketing.md:248` | 4. **Check the version and date.** A guide written for Windows 10 may be subtly wrong on Windows 11. A page about an old admin portal may describe buttons that no longer exist. | |
| 4 | `06-phase-tools-and-ticketing.md:1066` ▶ | Service : Microsoft 365 Outlook desktop, Windows 11, version 2401 build 17231 | |
| | | <sub>↑ Category : Email (client)<br>↓ Repro : 1. Launch Outlook from Start. 2. Splash screen appears.</sub> | |
| 5 | `08-phase-portfolio-and-resume.md:320` ▶ | Operating systems : Windows 10/11 (user and group management, NTFS permissions, services, | |
| | | <sub>↑ TECHNICAL SKILLS<br>↓ Event Viewer), Ubuntu Server (users, systemd, permissions, log review)</sub> | |
| 6 | `08-phase-portfolio-and-resume.md:701` ▶ | Install Ubuntu Server 24.04 in a VirtualBox VM and prove I can do four | |
| | | <sub>↓ things from the command line without a GUI: create a user, put them in a</sub> | |
| 7 | `08-phase-portfolio-and-resume.md:709` ▶ | \| Host \| Windows 11, 8 GB RAM \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Virtualisation \| Enabled in BIOS (see "What went wrong") \|</sub> | |
| 8 | `08-phase-portfolio-and-resume.md:712` ▶ | \| Guest \| Ubuntu Server 24.04 LTS, 2 GB RAM, 20 GB disk \| | |
| | | <sub>↑ \| VirtualBox \| 7.0.14 \|<br>↓ \| Network \| NAT, with a port forward `2222 → 22` so the host can reach SSH \|</sub> | |
| 9 | `08-phase-portfolio-and-resume.md:885` ▶ | Operating systems : [Windows 10/11: users, groups, NTFS permissions, services, Event Viewer] | |
| | | <sub>↑ TECHNICAL SKILLS<br>↓ [Ubuntu Server: users, systemd, permissions, /var/log review]</sub> | |
| 10 | `08-phase-portfolio-and-resume.md:996` | \| After \| Created local users and groups in Windows 11 and demonstrated how inherited and explicit NTFS permissions combine with share permissions to determine effective access. \| | |
| 11 | `08-phase-portfolio-and-resume.md:1035` | \| Name the tool or system \| VirtualBox, Windows 11, osTicket, pfSense \| | |
| | | <sub>↑ \|---\|---\|<br>↓ \| Name the action \| Built, configured, diagnosed, created, verified \|</sub> | |
| 13 | `08-phase-portfolio-and-resume.md:1098` | \| 1 \| I studied how Active Directory organises users, groups, and organisational units, and I read about Group Policy. I practised the equivalent concepts — local users, local groups, permissions — on a standalone Windows 11 machine. \| | |
| 14 | `08-phase-portfolio-and-resume.md:1099` | \| 2 \| Windows 11 local users and groups. I have not installed or administered a domain controller. \| | |
| | | <sub>↑ \| 1 \| I studied how Active Directory organises users, groups, and organisational units, and I read about Group Policy. I practised the equivalent co …<br>↓ \| 3 \| Nothing went wrong, because I did not do it. I followed a tutorial's screenshots rather than running my own domain. \|</sub> | |
| 15 | `08-phase-portfolio-and-resume.md:1108` | \| Experienced with Active Directory and Windows Server administration. \| Studied Active Directory concepts and practised user and group management, permissions, and least privilege on a standalone Windows 11 machine; a Windows Server domain controller lab is … | |
| 16 | `09-phase-job-application-plan.md:535` ▶ | accounts; manage M365 users; troubleshoot Windows 10/11, printers, | |
| | | <sub>↑ Do: triage tickets by email/chat/phone; reset passwords and unlock<br>↓ and VPN; document every ticket in our PSA (professional services automation — the ticketing and billing system MSPs run; here, ConnectWise); escalate</sub> | |
| 17 | `09-phase-job-application-plan.md:578` ▶ | What I can do now: Windows 10/11 troubleshooting, M365 user and | |
| | | <sub>↓ group administration, password resets and account unlocks, TCP/IP</sub> | |

---

<!-- 04-registry-paths-file-paths-and-filenames.md — 14 rows -->

# Registry paths, file paths and filenames

| 1 | `01-phase-computer-fundamentals.md:71` | - **File Paths:** Location of files (e.g., `C:\Users\YourName\Documents\file.txt`). | |
| | | <sub>↑ - **Extensions:** File type indicators (e.g., `.pdf`, `.jpg`).</sub> | |
| 2 | `01-phase-computer-fundamentals.md:440` | Also worth knowing: minidump files land in `C:\Windows\Minidump`. You do not analyse these at Phase 1, but their **timestamps** tell you exactly when each crash happened, which lets you correlate crashes against what the user was doing. | |
| 3 | `02-phase-operating-systems.md:61` | - Filesystem hierarchy: `/`, `/home`, `/etc`, `/var/log`, `/tmp` | |
| | | <sub>↓ - Users and groups: `adduser`, `passwd`, `groups`, `usermod`</sub> | |
| 4 | `02-phase-operating-systems.md:66` | - Logs: `/var/log/auth.log`, `/var/log/syslog`, `journalctl` | |
| | | <sub>↑ - Processes and services: `ps`, `top`, `systemctl`<br>↓ - Core navigation commands: `pwd`, `ls`, `cd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`, `grep`, `find`</sub> | |
| 5 | `02-phase-operating-systems.md:415` | \| Where apps live \| `C:\Program Files` \| `/usr/bin`, `/opt` \| **`/Applications`** \| | |
| | | <sub>↑ \| File manager \| File Explorer \| (the shell) \| **Finder** \|<br>↓ \| Settings \| Control Panel / Settings \| config files in `/etc` \| **System Settings** \|</sub> | |
| 6 | `02-phase-operating-systems.md:514` | Expected: your username, your **UID** (user ID — the number Linux uses internally for your account) and groups, kernel and distribution details, uptime, a list of login-capable accounts, disk and memory usage, any failed logins, and recent errors. On a desktop … | |
| 7 | `02-phase-operating-systems.md:522` | 1. In Windows, open `C:\Windows\System32\winevt\Logs` in File Explorer. Windows stores logs as binary `.evtx` files that you must open with Event Viewer. | |
| 8 | `02-phase-operating-systems.md:622` | A loaded profile whose path ends in something like `C:\Users\TEMP` or `C:\Users\TEMP.DOMAIN.001` is the temporary profile. That is your diagnosis, and everything else follows from it. | |
| 9 | `02-phase-operating-systems.md:636` | 2. **Copy the data out** from `C:\Users\<broken-profile>` to a location outside it — their Desktop, Documents, Pictures, and Downloads folders, plus any application data they need. | |
| 11 | `02-phase-operating-systems.md:1385` | - **Log analysis:** What you found in `/var/log/auth.log` and `/var/log/syslog`, and how you used `journalctl` to read system logs. | |
| 12 | `06-phase-tools-and-ticketing.md:357` | `C:\Windows\Temp` at 18.41 GB is the answer, and it is not user data. Something has been writing temporary files and never cleaning them up. | |
| 14 | `06-phase-tools-and-ticketing.md:398` | > **Cause:** A nightly job outside the service desk's ownership is writing ~5 GB of temporary dump files to `C:\Windows\Temp` and never removing them. Under four days of accumulation took the volume to the alert threshold, so this will recur within the week un … | |
| 15 | `06-phase-tools-and-ticketing.md:399` | > **Action:** Cleared `C:\Windows\Temp` dump files after confirming their identity and daily pattern. Did **not** delete unfamiliar files. Raised a problem record so the owning team fixes the cleanup, because the files regenerate nightly. | |
| 16 | `06-phase-tools-and-ticketing.md:401` | > **For the next agent:** If this alert fires again, check `C:\Windows\Temp` first and look for `sql_dump_*.tmp`. The root cause is not fixed — the nightly job is with the application team. Growth is ~5 GB per day, so the volume has roughly four days of headro … | |

