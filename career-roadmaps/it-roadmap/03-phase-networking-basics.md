---
id: it-03-networking-basics
track: it
phase: 3
order: 30
title: "Phase 3 — Networking Basics"
duration: "4 weeks"
duration_weeks: 4
energy_mix: [low, normal]
deliverable: "portfolio/it/03-networking-basics.md"
exit_criteria: "You can troubleshoot a basic internet issue using IP, gateway, DNS, and Wi-Fi checks, and explain your process clearly in a ticket."
---

# Phase 3 — Networking Basics

## Goal of this phase

Understand the networking topics that appear constantly in helpdesk, NOC, sysadmin, and cybersecurity work.

## Estimated time

**4 weeks**. Networking is deep, so be honest: 2 weeks is usually not enough for a beginner.

## Skills you'll gain

- Explain LAN, WAN, internet, router, switch, firewall, modem, access point, and ISP.
- Understand IPv4, IPv6 basics, subnet mask, gateway, DNS, DHCP, NAT, TCP, UDP, ICMP, ports, and Wi-Fi.
- Use `ping`, `tracert/traceroute`, `ipconfig/ifconfig/ip`, `nslookup`, `netstat/ss`, and Wireshark.
- Build a simple network in Packet Tracer.
- Troubleshoot “no internet,” “DNS not working,” “slow connection,” and “VPN issue.”

## Specific topics to learn

### Core network concepts

- Client, server, peer-to-peer
- LAN vs WAN vs internet
- Router vs switch vs access point vs modem vs firewall
- MAC address vs IP address
- Public IP vs private IP
- NAT and why home networks use it

### IP addressing

- IPv4 format: example `192.168.1.10`
- Private ranges: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
- Subnet mask basics: `/24`, `255.255.255.0`
- Default gateway
- Static IP vs dynamic IP
- IPv6 basics: why it exists, format, link-local addresses, no need for deep subnetting yet

### Name resolution and services

- DNS: A, AAAA, CNAME, MX, TXT, NS records
- DHCP: Discover, Offer, Request, Acknowledge at a beginner level
- Common ports: 20/21 FTP, 22 SSH, 25 SMTP, 53 DNS, 67/68 DHCP, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 445 SMB, 3389 RDP
- TCP vs UDP
- TLS/HTTPS basics

### Troubleshooting flow

- Check physical connection/Wi-Fi first
- Check IP address
- Check gateway
- Check DNS
- Check specific site/service
- Check firewall/VPN/proxy
- Document findings

## Lesson: Networking Basics

### Why this lesson exists

Networking is the subject that shows up in every IT role you will apply for. Helpdesk gets "I can't get online". A NOC watches link failures. A sysadmin debugs a server that cannot reach its database. A security analyst investigates traffic that should not exist. All of it rests on the same foundation: how devices find each other, how names become addresses, and how to prove where a connection is broken.

The good news is that the foundation is small. You need to understand addresses, subnets, gateways, DNS, DHCP, ports, and the difference between TCP and UDP. That is genuinely most of it.

The better news is that you can see it all working on your own home network, for free, tonight. This lesson is built around doing exactly that.

**Time to complete:** 5–8 hours across the phase, most of it spent in Wireshark and Packet Tracer rather than reading. The phase is scheduled at four weeks for good reason — networking rewards repetition more than most subjects.

### Part 1 — The mental model: what a network actually is

#### Networks are just devices that agree on rules

A network is two or more devices that can exchange data. That is the whole definition. What makes it work is **agreement**: agreed formats, agreed addresses, agreed procedures. Those agreements are called **protocols**, and networking is mostly the study of which protocol does what.

The single most useful mental model is the **layered** one. Data does not travel as one indivisible blob; it is built up layer by layer, like posting a letter:

| Layer | What it does | Examples |
|---|---|---|
| Application | The actual thing you wanted to do | HTTP, DNS, SMTP |
| Transport | Break data up, track delivery | TCP, UDP |
| Network | Address it and route it across networks | IP, ICMP |
| Link | Move it one hop across the local medium | Ethernet, Wi-Fi |

When a user says "the internet is down", they are describing a symptom at the top. Your job is to find the lowest layer that is broken. Is the link up (cable, Wi-Fi)? Is there an IP address? Is the gateway reachable? Does DNS resolve? Does the application respond? You work bottom-up, and you stop at the first failure. That method is called **layered troubleshooting**, and it is the structure of everything else in this lesson.

#### The device vocabulary

- **Client** requests. **Server** provides. **Peer-to-peer** means both at once, with no central authority.
- **LAN (Local Area Network)** is a small, local network — your home, one office floor. **WAN (Wide Area Network)** spans distance. **The internet** is the largest WAN of all: a network of networks.
- **Switch** connects devices *within* one LAN and forwards traffic by MAC address.
- **Router** connects *different* networks and forwards traffic by IP address. Your home "router" is usually three devices in one box: router, switch, and wireless access point.
- **Modem** converts between your ISP's medium (fibre, coax, DSL) and Ethernet.
- **Access point** provides Wi-Fi.
- **Firewall** permits or denies traffic according to rules.
- **ISP** is the company that connects you to the internet.

The distinction that matters most in support is **switch versus router**. A switch moves data inside a network; a router moves it between networks. If two devices on the same Wi-Fi cannot reach each other, you are looking at a switch/AP problem. If nothing can reach the internet, you are looking at a router or upstream problem. That single question — "is this inside the network or between networks?" — splits your investigation in half.

#### MAC addresses versus IP addresses

Two addresses, two purposes, and beginners conflate them constantly.

- A **MAC address** is the hardware address burned into the network adapter. It is 48 bits, written like `a4:5e:60:1c:22:0b`. It is used *within* a local network and does not change when you move the machine.
- An **IP address** is the logical address assigned to a device for as long as it is on a network. It changes when you change networks. It is what makes routing across the internet possible.

The analogy: a MAC address is your name; an IP address is your current postal address. Letters get routed by postal address, but the final handover at the door happens by name.

You can see both on your own machine right now:

```powershell
ipconfig /all
```

Look for **Physical Address** (the MAC) and **IPv4 Address** (the IP). Note that `ipconfig /all` shows one MAC per adapter — your Wi-Fi adapter and your Ethernet adapter each have their own.

#### What failure looks like

Networking failures have a small set of recognisable shapes. Learn their names and you will recognise them for the rest of your career.

- **No link at all** — the cable is unplugged, the Wi-Fi is off, the adapter is disabled. The operating system usually shows "no network access" or a disconnected icon.
- **Link up, no IP address** — you get a `169.254.x.x` address in Windows (called an APIPA address). This means the device asked DHCP for an address and got no answer. It is one of the most useful signals in support: the link works but the DHCP conversation failed.
- **IP address, no gateway** — you can reach local devices but nothing beyond them.
- **Gateway reachable, DNS broken** — pinging `8.8.8.8` works, pinging `google.com` fails. This is the classic DNS failure, and it is the single most misdiagnosed problem in home support.
- **Everything resolves, application fails** — the network is fine and the problem is a specific service, a firewall rule, or the application itself.

That list is a decision tree. Run down it in order and you will locate the fault in under two minutes.
### Part 2 — IP addressing without the fear

#### IPv4, in plain terms

An IPv4 address is 32 bits, written as four numbers separated by dots: `192.168.1.10`. Each number is a byte, so each is 0–255. That is the entire format.

The address has two parts: a **network** portion and a **host** portion. The **subnet mask** tells you where the split is. `255.255.255.0` — or `/24` in shorthand — means the first three numbers identify the network and the last identifies the device. So:

```text
Network: 192.168.1.0/24
Address: 192.168.1.10     -> device 10 on network 192.168.1.0
Mask:    255.255.255.0
Gateway: 192.168.1.1      -> the router, which is also on this network
```

Two devices are on the same network if their addresses match in the network portion. `192.168.1.10` and `192.168.1.20` are neighbours and can talk directly. `192.168.2.10` is on a different network and must go through a router. **That is the whole point of subnetting**, and it is why your gateway must be on the same network as you — a gateway address outside your subnet is unreachable by definition.

#### Private versus public addresses

Some ranges are reserved for private use and are never routed on the internet:

```text
10.0.0.0/8          10.x.x.x           — large networks
172.16.0.0/12       172.16.x.x–172.31.x.x
192.168.0.0/16      192.168.x.x        — home and small office
169.254.0.0/16      169.254.x.x        — APIPA, means DHCP failed
```

Anything else is public and globally unique. Your home devices use private addresses; your router holds one public address on its internet-facing side. **NAT (Network Address Translation)** is the trick that makes this work: the router rewrites outgoing packets so they appear to come from its public address, and remembers which internal device each reply belongs to. That is why ten devices at home can share one public IP.

The `169.254` range deserves special attention. If you see an address starting `169.254`, the device never received a DHCP lease. Check that DHCP is enabled, that the DHCP server is running, and that the device can reach it. Naming this problem specifically — rather than "the internet is broken" — is what a good technician does.

#### IPv6, briefly and honestly

IPv6 exists because IPv4 ran out of addresses. It is 128 bits, written in hexadecimal with colons: `2001:0db8:85a3::8a2e:0370:7334`. The `::` means "however many zero groups are needed here", a shortening rule you will see constantly.

You do not need to subnet IPv6 for entry-level work. You do need to know three things:

1. **It is already running on your network.** Most modern operating systems prefer IPv6 when available.
2. **`AAAA` records are the DNS counterpart to IPv4's `A` records.** If a name resolves over IPv4 but not IPv6, an `AAAA` lookup tells you.
3. **Link-local addresses (`fe80::`) are the IPv6 equivalent of APIPA** — automatically assigned for local communication, not routable.

#### DHCP: how you get an address

**DHCP (Dynamic Host Configuration Protocol)** hands out addresses automatically. The four-step exchange is called **DORA**, and it is worth memorising because it tells you what to check when it fails:

1. **Discover** — the client broadcasts "is there a DHCP server?"
2. **Offer** — a server replies "I can give you `192.168.1.10`".
3. **Request** — the client asks for that specific address.
4. **Acknowledge** — the server confirms the lease.

If the exchange fails at any point, the client ends up with a `169.254` address. The usual causes are a DHCP server that is down, a network that is not reaching it (VLAN or switch misconfiguration), or the client's DHCP being disabled.

To see your own lease details:

```powershell
ipconfig /all
```

And to deliberately release and renew it — a genuinely useful support step:

```powershell
ipconfig /release
ipconfig /renew
```

Order matters: `release` then `renew`. Running `renew` alone often just re-uses the existing lease.

### Part 3 — DNS: the piece that breaks most often

#### What DNS does

Computers route by IP address; humans remember names. **DNS (Domain Name System)** is the translation service between them. When you type `google.com`, your machine asks a DNS server "what is the address for this name?", gets `142.250.x.x`, and connects there.

That is why a DNS failure looks exactly like an internet outage to a user. They type a name, nothing loads, and they report "no internet" — when in fact the network is working perfectly and only the translation is broken.

#### The record types you will actually meet

| Record | Purpose | Example |
|---|---|---|
| `A` | Name to IPv4 address | `google.com -> 142.250.x.x` |
| `AAAA` | Name to IPv6 address | `google.com -> 2607:f8b0::...` |
| `CNAME` | An alias for another name | `www.example.com -> example.com` |
| `MX` | Where to deliver mail | `gmail.com -> alt1.gmail-smtp-in.l.google.com` |
| `TXT` | Arbitrary text; used for verification and SPF | SPF/DKIM records |
| `NS` | Which name servers are authoritative | `example.com -> ns1.example.com` |

You can query all of these yourself with `nslookup`, and doing so is one of the phase's tasks:

```powershell
nslookup google.com                      # the A record
nslookup -type=mx gmail.com              # mail servers
nslookup -type=txt google.com            # TXT records
nslookup google.com 8.8.8.8              # ask a SPECIFIC server
```

That last form is the interesting one. Comparing what your local resolver returns against what `8.8.8.8` returns is how you prove a DNS problem is your resolver's fault rather than the domain's.

#### The DNS decision test

This is the single most valuable diagnostic in the phase. Run both of these:

```powershell
ping 8.8.8.8        # connectivity by IP — no DNS involved
ping google.com     # connectivity AND name resolution
```

Then read the result:

- **Both fail** → you have no connectivity at all. Check the adapter, cable, Wi-Fi, and gateway.
- **`8.8.8.8` works, `google.com` fails** → your network is fine; **DNS is broken**. Check the DNS servers reported by `ipconfig /all`, and try a public resolver such as `1.1.1.1` or `8.8.8.8`.
- **Both work** → the network and DNS are healthy. Look elsewhere: the specific site, a firewall, a VPN, or the application.

Memorise this pair. It resolves the majority of "no internet" tickets before the user has finished describing the problem.

### Part 4 — Ports, TCP, and UDP

#### IP gets you to the machine; ports get you to the service

An IP address identifies a device. But a device runs many services at once — a web server, a mail server, and remote access all on one machine. **Ports** are how traffic is sorted to the right service. A connection is identified by the pair `IP:port`, and a conversation by the four-tuple of source and destination `IP:port`.

Ports you should know cold, because they appear in firewall rules, interview questions, and troubleshooting every week:

| Port | Protocol | What it is |
|---|---|---|
| 20/21 | FTP | File transfer (unencrypted) |
| 22 | SSH | Secure remote shell |
| 25 | SMTP | Sending mail |
| 53 | DNS | Name resolution |
| 67/68 | DHCP | Address assignment |
| 80 | HTTP | Web, unencrypted |
| 110 | POP3 | Receiving mail (downloads and deletes) |
| 143 | IMAP | Receiving mail (stays on server) |
| 443 | HTTPS | Web, encrypted with TLS |
| 445 | SMB | Windows file and printer sharing |
| 3389 | RDP | Windows Remote Desktop |

Two of these matter disproportionately in security work. **Port 3389 (RDP)** exposed to the internet is one of the most commonly attacked services in existence. **Port 445 (SMB)** was the vector for WannaCry and remains a favourite. Knowing why a port is dangerous is as important as knowing what it does.

#### TCP versus UDP

Two transport protocols, two philosophies:

- **TCP** is connection-oriented and reliable. It establishes a connection with a **three-way handshake** — `SYN`, `SYN-ACK`, `ACK` — numbers every byte, acknowledges receipt, and retransmits anything lost. It is used when correctness matters: web browsing, file transfer, email.
- **UDP** is connectionless and best-effort. It sends packets with no handshake and no guarantee. It is used when speed matters more than perfection: video streaming, voice calls, DNS queries, games.

The trade-off is simple: TCP buys reliability with overhead; UDP buys speed by giving up guarantees.

You can see the handshake on your own machine. In Wireshark, filter on `tcp` and open any website. You will see the three packets at the start of every connection: `SYN`, then `SYN, ACK`, then `ACK`. Watching that once, with your own eyes, does more for your understanding than any diagram — which is exactly why it is a task in this phase.

#### TLS and HTTPS in one paragraph

**TLS (Transport Layer Security)** wraps a connection in encryption and proves the server's identity with a **certificate**. **HTTPS** is simply HTTP carried inside TLS, on port 443. The practical support consequence: certificate errors are a common, specific, and diagnosable class of ticket. "Your connection is not private" almost always means an expired certificate, a wrong system clock, a captive portal, or an inspecting proxy — not a virus.
### Part 5 — Troubleshooting, in a fixed order

#### The layered checklist

Troubleshooting is not intuition; it is a fixed sequence you run every time. Bottom layer first, stop at the first failure.

1. **Physical / link.** Is the cable seated? Is Wi-Fi switched on? Check the adapter is not disabled in Device Manager or via `ncpa.cpl`. Does the operating system report a link?
2. **IP configuration.** Run `ipconfig /all`. Do you have a real address, or a `169.254` one? Is the mask correct? Is there a gateway?
3. **Gateway.** `ping` your gateway. If the gateway does not answer, nothing upstream can work.
4. **External connectivity by IP.** `ping 8.8.8.8`. This tests routing and upstream without involving DNS.
5. **Name resolution.** `ping google.com` and `nslookup google.com`. This isolates DNS.
6. **The specific service.** Test the actual thing: a browser, an app, a file share. Check the port with `Test-NetConnection`.

```powershell
Test-NetConnection google.com -Port 443
```

That cmdlet is the single most useful modern Windows network command. It tells you DNS resolution, the resolved IP, reachability, and whether the specific port responds — in one shot. Learn it now; you will use it constantly.

#### A worked walkthrough

A user reports: *"I'm connected to the Wi-Fi but there's no internet."* Here is the whole investigation, in order.

**Step 1 — Link.** They are connected to the Wi-Fi, so the link layer is up. One down, five to go.

**Step 2 — IP configuration.**

```powershell
ipconfig /all
```

Suppose it shows `169.254.14.7`. That is the answer, and it took one command. The device never got a DHCP lease. You are not dealing with "no internet"; you are dealing with "no DHCP".

Fix: check the adapter has DHCP enabled, then `ipconfig /release` followed by `ipconfig /renew`. If it still fails, the DHCP server is unreachable — check the router or, at work, whether the client landed in the wrong VLAN.

Now suppose instead it shows a proper `192.168.1.14` with gateway `192.168.1.1`. Continue.

**Step 3 — Gateway.**

```powershell
ping 192.168.1.1
```

If this fails, the device cannot even reach the router. Suspect the Wi-Fi association, the AP, or the router itself. If it succeeds, the local network is healthy.

**Step 4 — External by IP.**

```powershell
ping 8.8.8.8
```

Fails → the problem is upstream of the router: the ISP, the modem, the WAN link. Not something you fix from the laptop.

**Step 5 — DNS.** If `8.8.8.8` worked but `ping google.com` fails with "could not find host", DNS is the fault:

```powershell
nslookup google.com            # fails
nslookup google.com 1.1.1.1    # succeeds -> your resolver is the problem
```

Fix: point the device (or the router's DHCP scope) at a working resolver. This is the classic home-router failure where the ISP's DNS servers have gone dark.

**Step 6 — The service.** If everything above passes and the user still cannot load a site, the network is not the problem. Check the specific site, any proxy or VPN, and the firewall.

**How to write it up.** Record which step failed and what proved it. "Device had a `169.254` address; DHCP lease renewal failed; DHCP server unreachable from client VLAN; escalated to network team" is a professional note. "Rebooted, worked" is not — it teaches nobody anything and cannot be trended.

### Common pitfalls, and how to avoid them

- **Starting at the top.** Reading browser error messages before checking whether the cable is plugged in wastes time. Always work bottom-up.
- **Confusing private and public addresses.** Seeing `192.168.1.x` and assuming it is "your IP on the internet" leads to nonsense conclusions about what is reachable.
- **Treating DNS failures as outages.** "No internet" is usually "no DNS". Prove it with the `8.8.8.8` versus `google.com` test.
- **Skipping the gateway.** If the gateway does not answer, nothing beyond it can, and every later test is wasted effort.
- **Not reading the APIPA address.** `169.254.x.x` is a specific, actionable diagnosis. Recognise it instantly.
- **Guessing instead of testing.** Every step above produces evidence. Prefer a command's output over a hunch.
- **Failing to document.** The troubleshooting discipline is as valuable as the fix; write down what you tested and what you found.

### Key takeaways

- Networks are layered; troubleshoot bottom-up and stop at the first broken layer.
- A **MAC address** is the local hardware identity; an **IP address** is the routable logical one.
- The **subnet mask** splits network from host. You can talk directly only to devices in your subnet; everything else goes via the **gateway**.
- **`169.254.x.x` means DHCP failed.** That is a diagnosis, not a mystery.
- **DNS translates names to addresses**, and it breaks more often than connectivity. Test it with `ping 8.8.8.8` versus `ping google.com`.
- **Ports** route traffic to the right service. Know the common ones; respect the dangerous ones.
- **TCP** is reliable and connection-oriented; **UDP** is fast and best-effort.
- `Test-NetConnection` and `nslookup` are your two best everyday tools.

### Practice this next

The exercises in *Hands-on practice tasks* below are not optional extras — they are the lesson. Draw your network, run the commands, watch a handshake in Wireshark, and build the Packet Tracer topology. If you can explain the DNS test and the DHCP failure mode out loud, without notes, you have learned this phase.
## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Cisco Packet Tracer | Network simulation | Free account | https://www.netacad.com/courses/packet-tracer | Build PC-switch-router-DNS lab | draw.io diagram only |
| Wireshark | Packet capture/analysis | Free | https://www.wireshark.org/ | Capture DNS lookup and TCP handshake | tcpdump on Linux |
| Windows `ipconfig` | Shows IP config | Free, built-in | https://learn.microsoft.com/windows-server/administration/windows-commands/ipconfig | Record IP, gateway, DNS | Linux `ip a` |
| `ping` | Tests reachability/latency | Free, built-in | https://learn.microsoft.com/windows-server/administration/windows-commands/ping | Ping gateway and 1.1.1.1 | PowerShell `Test-Connection` |
| `nslookup` | Tests DNS | Free, built-in | https://learn.microsoft.com/windows-server/administration/windows-commands/nslookup | Resolve google.com and compare DNS servers | `dig` on Linux |
| diagrams.net | Draw diagrams | Free | https://www.diagrams.net/ | Draw your home network | Excalidraw |

## Free/cheap resources

- Practical Networking — https://www.practicalnetworking.net/
- Cisco Networking Basics — https://skillsforall.com/course/networking-basics
- Cloudflare Learning Center DNS — https://www.cloudflare.com/learning/dns/
- Wireshark docs — https://www.wireshark.org/docs/
- Professor Messer Network+ study groups/videos — https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-training-course/

## Hands-on practice tasks

1. Draw your home network in diagrams.net. Include the ISP modem/router, your devices, Wi-Fi access points, and how they connect.
2. Check your IP configuration. Run `ipconfig /all` on Windows, or `ifconfig` / `ip a` on Linux. Record your IP address, subnet mask, default gateway, DHCP server, DNS server, and MAC address.
3. Test connectivity. Ping your gateway, `1.1.1.1`, `8.8.8.8`, and `google.com`. Explain why the responses differ.
4. Run DNS lookups. Try `nslookup google.com`, `nslookup -type=mx gmail.com`, and `nslookup -type=txt google.com`. Document what each reveals.
5. Capture DNS traffic in Wireshark. Filter on `dns`, identify a query, and explain how the name resolved to an IP address.
6. Capture a TCP handshake in Wireshark. Filter on `tcp`, find a handshake between your device and a server, and explain the three-way handshake.
7. Build a Packet Tracer network with 2 PCs, 1 switch, and 1 router. Configure DHCP and DNS on the router, then label every component and connection.
8. Write a step-by-step troubleshooting guide for "connected to Wi-Fi but no internet", covering physical checks, IP configuration, DNS, and firewall considerations.

## Deliverable / proof of work

Create `portfolio/it/03-networking-basics.md` with:

- Home network diagram
- Packet Tracer screenshot
- Wireshark DNS screenshot
- Table of 20 common ports
- Troubleshooting write-up for no internet

## Checklist

- [ ] I can explain LAN, WAN, router, switch, modem, firewall, and access point. <!-- id: it-03-c01 energy: low -->
- [ ] I can explain IPv4 address, subnet mask, gateway, DNS, and DHCP. <!-- id: it-03-c02 energy: low -->
- [ ] I understand IPv6 basics and AAAA DNS records. <!-- id: it-03-c03 energy: low -->
- [ ] I memorized at least 15 common ports. <!-- id: it-03-c04 energy: low -->
- [ ] I can use `ipconfig`, `ping`, `tracert`, and `nslookup`. <!-- id: it-03-c05 energy: normal -->
- [ ] I captured DNS traffic in Wireshark. <!-- id: it-03-c06 energy: normal -->
- [ ] I built a simple Packet Tracer network. <!-- id: it-03-c07 energy: normal -->
- [ ] I wrote a no-internet troubleshooting guide. <!-- id: it-03-c08 energy: normal -->

## You're ready to move on when...

You can troubleshoot a basic internet issue using IP, gateway, DNS, and Wi-Fi checks, and explain your process clearly in a ticket.

## Free vs Paid

### What's free and enough

Packet Tracer, Wireshark, diagrams.net, and free networking lessons are enough.

### What's paid and why you'd upgrade

Paid Network+ courses or labs can add structure, but they are optional.

### When it's worth paying

Only pay later if you decide to take Network+ or CCNA. For entry-level IT applications, free resources are enough.
