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
- Use `ping`, `tracert/traceroute`, `ipconfig/ifconfig/ip`, `nslookup`, `arp -a`, `route print`, and Wireshark.
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

**Time to complete:** roughly 20–32 hours across the phase — the scheduled four weeks at 5–8 hours a week. Most of that is spent in Wireshark, diagrams.net, and Packet Tracer rather than reading. The phase is scheduled at four weeks for good reason — networking rewards repetition more than most subjects.

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

If the exchange fails at any point, the client ends up with a `169.254` address. The usual causes are a DHCP server that is down, a network that is not reaching it (a **VLAN** — a virtual network carved out of one physical switch, covered in Part 9 — or a switch misconfiguration), or the client's DHCP being disabled.

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

Ports you should know cold, because they appear in firewall rules, interview questions, and troubleshooting every week. The table below is the core eleven — the ones you will actually reach for. The phase deliverable asks you to build that out to a twenty-port table, so find and add nine more; the classic study lists are easy to find, and the test of a good addition is that you can say something about the port rather than only its number.

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

**TLS (Transport Layer Security)** wraps a connection in encryption and proves the server's identity with a **certificate**. **HTTPS** is simply HTTP carried inside TLS, on port 443.

The practical support consequence: certificate errors are a common, specific, and diagnosable class of ticket. "Your connection is not private" almost always means an expired certificate, a wrong system clock, a **captive portal** (the login page a hotel or café Wi-Fi shows before it lets you online), or an **inspecting proxy** (a corporate appliance that decrypts and re-signs traffic so it can scan it) — not a virus.

### Part 5 — Troubleshooting, in a fixed order

#### The layered checklist

Troubleshooting is not intuition; it is a fixed sequence you run every time. Bottom layer first, stop at the first failure.

1. **Physical / link.** Is the cable seated? Is Wi-Fi switched on? Check the adapter is not disabled in Device Manager or via `ncpa.cpl`. Does the operating system report a link?
2. **IP configuration.** Run `ipconfig /all`. Do you have a real address, or a `169.254` one? Is the mask correct? Is there a gateway?
3. **Gateway.** `ping` your gateway. If the gateway does not answer, nothing upstream can work.
4. **Name resolution.** `ping 8.8.8.8` first — it proves routing and upstream work *without* DNS — then `ping google.com` and `nslookup google.com`. The pair is what isolates DNS.
5. **The specific service's port.** Test the port itself with `Test-NetConnection`.
6. **The application.** Test the actual thing: a browser, an app, a file share.

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

#### Common pitfalls, and how to avoid them

- **Starting at the top.** Reading browser error messages before checking whether the cable is plugged in wastes time. Always work bottom-up.
- **Confusing private and public addresses.** Seeing `192.168.1.x` and assuming it is "your IP on the internet" leads to nonsense conclusions about what is reachable.
- **Treating DNS failures as outages.** "No internet" is usually "no DNS". Prove it with the `8.8.8.8` versus `google.com` test.
- **Skipping the gateway.** If the gateway does not answer, nothing beyond it can, and every later test is wasted effort.
- **Not reading the APIPA address.** `169.254.x.x` is a specific, actionable diagnosis. Recognise it instantly.
- **Guessing instead of testing.** Every step above produces evidence. Prefer a command's output over a hunch.
- **Failing to document.** The troubleshooting discipline is as valuable as the fix; write down what you tested and what you found.

### Part 6 — Subnetting, actually done

Subnetting is the point where most beginners close the tab. It has a reputation for being hard, and the reputation is doing real damage: people who could otherwise troubleshoot a network perfectly well decide they are “not networking people” because a `/26` frightened them.

Here is the honest version. Subnetting is arithmetic on four small numbers, and you only ever need two facts to do it: what a **subnet mask** does, and how to count in powers of two. Everything else is practice. You will not need to do it at speed for entry-level work — but you will need to *read* a mask and to recognise when two addresses that look like neighbours are not. That is the version of this skill that pays your rent, and it is entirely learnable today.

#### Why subnetting exists at all

Start with a picture. Imagine a single office network with 500 devices on it and no structure at all: every laptop, printer, phone, camera, and server in one flat address range.

Three things go wrong, and they are the reason subnetting was invented.

**One — broadcast traffic consumes everyone’s bandwidth.** A **broadcast** is a frame addressed to “everyone on this network”. Some protocols need them: DHCP, ARP (the protocol that asks “who owns this IP address?”), and various discovery services.

In a flat network of 500 devices, every ARP request and every discovery announcement is delivered to all 500 machines. Each one must interrupt what it is doing, unwrap the frame, and decide whether it cares. Almost none of them do. Scale that to thousands of devices and a measurable slice of your network exists purely to carry noise.

A **broadcast domain** is the set of devices that receive each other’s broadcasts. Subnetting is the act of deciding where one broadcast domain ends and the next begins. One subnet equals one broadcast domain, almost always.

**Two — there is no separation.** In a flat network, a compromised webcam can talk directly to the finance server, because they are neighbours and neighbours talk without asking permission. Put them in different subnets and their traffic must pass through a router, where a rule can stop it. That is the beginning of network security, and it is one reason cybersecurity roles care about this at all.

**Three — there is no policy boundary.** You cannot apply a different rule to the guest Wi-Fi, the printers, and the servers if they are all one undifferentiated pool. Subnets are where policy lives: this range may reach the internet, that range may not; this range may reach the file server, that range may not.

So: **subnets exist to limit broadcast noise, to separate groups of devices, and to create boundaries where rules can be applied.** Everything below is mechanics in service of those three goals.

#### Reading a subnet mask properly

A **subnet mask** is a 32-bit number, written the same way as an IP address, whose whole job is to say: *this many bits at the front identify the network; the rest identify the host.*

The mask is always a run of `1`s followed by a run of `0`s, with no gaps. Those are **binary** digits — base two, where each position is worth double the one to its right, so the only digits are `0` and `1`. Here are a few written out:

```text
255.255.255.0     = 11111111.11111111.11111111.00000000   = 24 ones = /24
255.255.255.128   = 11111111.11111111.11111111.10000000   = 25 ones = /25
255.255.255.192   = 11111111.11111111.11111111.11000000   = 26 ones = /26
255.255.255.224   = 11111111.11111111.11111111.11100000   = 27 ones = /27
255.255.255.240   = 11111111.11111111.11111111.11110000   = 28 ones = /28
255.255.255.248   = 11111111.11111111.11111111.11111000   = 29 ones = /29
255.255.255.252   = 11111111.11111111.11111111.11111100   = 30 ones = /30
```

**CIDR notation** (Classless Inter-Domain Routing) is the shortcut: instead of writing the mask, you write a slash and the number of leading `1` bits. `/24` and `255.255.255.0` are the same thing. `/26` and `255.255.255.192` are the same thing. Windows shows you the dotted-decimal form; almost every other tool, textbook, and colleague speaks in CIDR. You need both directions in your head.

**Converting in your head.** You only need to memorise the fourth octet, and there are only eight values that matter. Each step adds one bit, and each bit is worth a power of two.

| CIDR | Subnet mask | Last octet in binary | Block size (addresses per subnet) | Usable hosts |
|---|---|---|---|---|
| `/24` | `255.255.255.0` | `00000000` | 256 | 254 |
| `/25` | `255.255.255.128` | `10000000` | 128 | 126 |
| `/26` | `255.255.255.192` | `11000000` | 64 | 62 |
| `/27` | `255.255.255.224` | `11100000` | 32 | 30 |
| `/28` | `255.255.255.240` | `11110000` | 16 | 14 |
| `/29` | `255.255.255.248` | `11111000` | 8 | 6 |
| `/30` | `255.255.255.252` | `11111100` | 4 | 2 |

Two patterns make this table easy to hold in your head rather than memorise:

- **The last octet counts up by adding the place values from the left.** `128`, then `128+64=192`, then `+32=224`, then `+16=240`, then `+8=248`, then `+4=252`, then `+2=254`. Each row adds the next lower power of two.
- **The block size is the “interesting” number minus itself from 256.** For `/26` the last octet is `192`, so the block size is `256 − 192 = 64`. For `/27` it is `256 − 224 = 32`. That single subtraction gives you the size of every subnet, which is the number you will actually use.

**Usable hosts = block size − 2.** Every subnet loses two addresses, and the next section explains why.

#### The two addresses you cannot use

In every subnet, two addresses are reserved:

- **The network address** — the first address in the block, where every host bit is `0`. It names the subnet itself. Routers use it in their tables; no device may be assigned it.
- **The broadcast address** — the last address in the block, where every host bit is `1`. A packet sent here goes to every device in the subnet at once.

That is why a `/24` has 256 addresses but only 254 usable hosts: `192.168.1.0` is the network and `192.168.1.255` is the broadcast.

Why does this matter to you in practice? Because if you assign the network or broadcast address to a device by hand, that device will not communicate, and the error will look arbitrary. It is one of the classic consequences of hand-configuring a static IP without doing the arithmetic.

#### A fully worked example: `192.168.10.0/26`

Given the address `192.168.10.0` with a `/26` mask, find the network address, the first and last usable host, the broadcast address, and the number of usable hosts.

**Step 1 — write the mask.**

`/26` means 26 leading `1` bits:

```text
255.255.255.192
11111111.11111111.11111111.11000000
                              ^^
                    these two bits are host bits
```

The first three octets are entirely network. In the fourth octet, the first two bits are network and the last six are host. The line between network and host falls **inside** the last octet — that is the whole trick of subnetting, and it is why the maths lives in octet four.

**Step 2 — find the network address, in binary.**

Take the given address and apply the mask: keep the network bits, zero the host bits.

```text
Address: 192.168.10.0   ->  11000000.10101000.00001010.00000000
Mask /26:                   11111111.11111111.11111111.11000000
                            -----------------------------------
Network:                    11000000.10101000.00001010.00000000
                         =  192.168.10.0

Host bits (the last six):                         000000
```

All six host bits are already zero, so the given address *is* the network address. That will not always be true — keep reading, because the second example is not this tidy.

**Step 3 — find the block size and the broadcast.**

Six host bits means 2⁶ = 64 addresses in this subnet. The block runs from `192.168.10.0` to `192.168.10.63`, so:

```text
Network address:    192.168.10.0      (all host bits 0)
First usable host:  192.168.10.1
Last usable host:   192.168.10.62
Broadcast address:  192.168.10.63     (all host bits 1)
```

**Step 4 — count the usable hosts.**

64 total addresses, minus the network and the broadcast, is **62 usable hosts**.

**Step 5 — the shortcut method, which is what you will actually use.**

You do not need binary on a ticket. You need this:

1. Find the CIDR value and subtract it from 32. That is the number of host bits: `32 − 26 = 6`.
2. Raise two to that power. That is the block size: `2⁶ = 64`.
3. Count up from zero in steps of the block size to find which block the address falls in: `0, 64, 128, 192`. Our address is `192.168.10.0`, so the block is `0–63`.
4. The first address of the block is the network address; the last is the broadcast; everything between is usable.
5. Usable hosts = block size − 2 = **62**.

For a `/26`, every subnet boundary in the last octet is at `0`, `64`, `128`, and `192`. Once you know that, a `/26` question takes about five seconds.

#### A second example in a different octet: `172.16.5.0/25`

Now shift the numbers so you see the pattern rather than memorising one answer.

**Step 1 — mask.** `/25` is `255.255.255.128`. That is 25 network bits, leaving `32 − 25 = 7` host bits.

**Step 2 — block size.** `2⁷ = 128`.

**Step 3 — find the block.** Count up in steps of 128 from zero: `0, 128`. The address `172.16.5.0` has a last octet of `0`, which falls in the `0–127` block.

```text
Network address:    172.16.5.0
First usable host:  172.16.5.1
Last usable host:   172.16.5.126
Broadcast address:  172.16.5.127
Usable hosts:       126
```

**Step 4 — a harder variant, so you see the block-finding rule work.** What is the network address of `172.16.5.80/25`?

The block size is still 128, and the blocks are still `0–127` and `128–255`. The value `80` sits inside `0–127`, so the answer is `172.16.5.0`. It does **not** matter that `.80` is a strange-looking number — it is a host inside the first block, nothing more. Beginners try to make the network address “look neat” and get this wrong. The rule is arithmetic: *which block does this number fall in?*

Notice that `172.16.5.0` itself is a network address, but `172.16.0.0` is the start of the whole `172.16.0.0/12` private range. The same numbers mean completely different things depending on the mask. **The mask is not optional information — an IP address without a mask is an incomplete fact.**

#### One `/24` carved into four `/26`s

This is the table to keep. A single `192.168.10.0/24` contains 256 addresses. Split it into four `/26` subnets and you get this:

| Subnet | Network address | First usable host | Last usable host | Broadcast address | Usable hosts |
|---|---|---|---|---|---|
| `/26` #1 | `192.168.10.0` | `192.168.10.1` | `192.168.10.62` | `192.168.10.63` | 62 |
| `/26` #2 | `192.168.10.64` | `192.168.10.65` | `192.168.10.126` | `192.168.10.127` | 62 |
| `/26` #3 | `192.168.10.128` | `192.168.10.129` | `192.168.10.190` | `192.168.10.191` | 62 |
| `/26` #4 | `192.168.10.192` | `192.168.10.193` | `192.168.10.254` | `192.168.10.255` | 62 |

Look at what happened: four subnets of 62 usable hosts is 248 usable addresses, where the single `/24` gave 254. You spent six usable addresses to buy four separate broadcast domains. That trade — a few addresses for structure, separation, and policy — is the entire economic argument for subnetting, and it is why nobody runs one flat network.

You can also read the table backwards, which is the skill you need on a ticket. If a device has the address `192.168.10.140` with a `/26` mask, `140` falls between `128` and `191`, so the device is in subnet #3 with a gateway that must also be inside `192.168.10.128–192.168.10.191`.

#### Why a support technician cares

Three consequences show up in real tickets over and over.

**Consequence 1 — two devices that look “on the same network” but are not.**

A user has a laptop at `192.168.10.10/26` and a printer at `192.168.10.200/26`. Both start `192.168.10.`, so the user reasonably says “they are on the same network”. They are not. With a `/26` mask, `.10` is in the `0–63` block and `.200` is in the `192–255` block. They are in different broadcast domains. The laptop will not ARP for the printer; it will send the traffic to its gateway and hope the router forwards it. If the router has no route or rule between those subnets, printing fails.

*Ticket-shaped symptom:* “The printer works from the front desk PC but not from mine, and we are on the same network — the IT guy said so.” The answer is that they are not on the same network, and the mask proves it.

**Consequence 2 — a gateway outside the subnet is unreachable by definition.**

If a device’s address and mask define a subnet that does not contain its own gateway address, that device can reach nothing outside itself. It is not a performance problem or a firewall problem; it is arithmetic. The device has no way to send a packet to a router it does not believe is local.

*Ticket-shaped symptom:* “I set a static IP on this machine and now nothing on the internet works, but the network icon looks fine.” The static configuration used a mask that excludes the gateway — for example the address `192.168.10.70/26` (subnet `192.168.10.64–127`) with a gateway of `192.168.10.1` (subnet `0–63`). Changing the mask to `/24` or the address to one inside the gateway’s subnet fixes it instantly.

**Consequence 3 — a mask typo produces “some things work and some don’t”.**

This is the giveaway signature, and it is genuinely common. If a machine has `/24` when the rest of its network uses `/26`, it believes a larger range of addresses is local. It can reach the gateway and anything in the neighbouring blocks directly, so *some* things work.

It fails for the addresses it thinks are remote but the router does not route back, or when its own replies go astray. The result is a machine that half-works — and half-working machines send technicians down the wrong path for an hour if they never look at the mask.

*Ticket-shaped symptom:* “My laptop can reach the file server but not the shared printer, and both are in the same room.” The file server is inside the machine’s believed subnet; the printer is not. You check `ipconfig /all` and compare the subnet mask against what every other working machine on that network reports. That comparison is the whole diagnosis.

#### The honest note

You do **not** need to subnet quickly in your head for entry-level work. Nobody in a first-line helpdesk interview will ask you to carve a `/22` into floor-by-floor subnets.

What you do need is two things:

1. **Read a mask and say what it means.** Given `255.255.255.192`, you should immediately think “`/26`, blocks of 64, 62 usable hosts”.
2. **Recognise when two addresses are not neighbours.** Given two addresses and a mask, you should be able to say whether they share a subnet, and therefore whether their traffic goes direct or through a router.

That second ability is the one that turns “the printer is broken” into “those two machines are in different subnets”, and it is the difference between guessing and diagnosing.

### Part 7 — Reading a network problem like a technician

Parts 1 to 6 taught you what the pieces are. This part teaches you the *method* — how to stand in front of a broken network and find the fault in a fixed, defensible order rather than by trial and error.

This is the most valuable thing in the phase. Commands are easy to look up. A reliable diagnostic sequence is what makes an employer trust you with a client’s network.

#### The ladder, made explicit

Networking fails bottom-up. A cable comes out, and everything above it dies. A DNS server stops answering, and everything above it dies while everything below it keeps working perfectly. So you climb a ladder, and you **stop at the first rung that fails**, because every rung above it is guaranteed to fail too and testing them tells you nothing.

| Rung | Layer | What you check | What a PASS tells you | What a FAIL means |
|---|---|---|---|---|
| 1 | Link | Is the adapter up? Is there a cable or a Wi-Fi association? | The device has a physical or wireless path to something. | Nothing above this can work. Cable, port, adapter, or Wi-Fi association. |
| 2 | IP | Do you have a valid address, mask, and gateway? | The device is a real member of a network and knows where its router is. | DHCP failed, a static address is wrong, or the mask excludes the gateway. |
| 3 | Gateway | Can the device reach its own router? | The local network works. Everything from here on is about the world beyond. | The LAN, the AP, or the router itself is the fault. |
| 4 | DNS | Do names resolve to addresses? | You can find services by name. Connect-by-IP problems are now separate. | The network is fine; name resolution is broken. |
| 5 | Port | Does the specific service’s port respond? | The service is listening and the path to it is not blocked. | A firewall, the service being down, or the wrong port or host. |
| 6 | Application | Does the actual application work? | The network is not the problem. | The fault is in the software, its configuration, or the user’s credentials. |

In prose, the same ladder reads like a conversation you have with the machine:

**Rung 1 — Link.** You are asking: *is there anything to send packets over?* Check `ipconfig /all` for the adapter’s state, or simply look — does Windows show a connected network? For Wi-Fi, are you associated with an SSID at all? If the link is down, stop. Nothing else can pass.

**Rung 2 — IP.** You are asking: *do I have an identity on this network?* Run `ipconfig /all`. You want a real address — not `169.254.x.x` — a mask that contains your own address, and a default gateway that also lies inside that mask. Check all three. A correct-looking address with a wrong mask is a real fault, and it is invisible unless you actually look.

**Rung 3 — Gateway.** You are asking: *can I reach my own front door?* Ping the gateway. This is the cleanest test in networking, because it isolates “my local network” from “everything else” with one command. If the gateway answers, the LAN is healthy and every remaining problem lives beyond the router.

**Rung 4 — DNS.** You are asking: *can I translate a name into an address?* Ping a public IP first (`8.8.8.8`) to prove connectivity without DNS, then ping a name. If the IP works and the name does not, you have found the fault precisely — and it is not “the internet”.

**Rung 5 — Port.** You are asking: *is the actual service reachable?* `Test-NetConnection` against a specific port. Web servers answer on 443, RDP on 3389, SMB on 445. A host can be perfectly pingable while every service on it is blocked.

**Rung 6 — Application.** You are asking: *is this software broken rather than the network?* The network is proven healthy by rungs 1–5, so the fault is in the application, its configuration, a proxy, or the user’s account.

The discipline is not the individual steps. The discipline is **stopping** at the first failure instead of jumping around.

#### One command per rung, with realistic output

The commands below are all built into Windows or free. Nothing here costs anything.

#### Rung 1 and 2 — `ipconfig /all`

```powershell
ipconfig /all
```

```text
Windows IP Configuration

   Host Name . . . . . . . . . . . . : DESKTOP-7KQ2LMP
   Primary Dns Suffix  . . . . . . . :
   Node Type . . . . . . . . . . . . : Hybrid
   IP Routing Enabled. . . . . . . . : No
   WINS Proxy Enabled. . . . . . . . : No

Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . : home
   Description . . . . . . . . . . . : Intel(R) Wi-Fi 6 AX201 160MHz
   Physical Address. . . . . . . . . : A4-5E-60-1C-22-0B
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 192.168.1.14(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Lease Obtained. . . . . . . . . . : Monday, 3 March 2025 08:12:44
   Lease Expires . . . . . . . . . . : Tuesday, 4 March 2025 08:12:43
   Default Gateway . . . . . . . . . : 192.168.1.1
   DHCP Server . . . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 192.168.1.1
                                       8.8.8.8
   NetBIOS over Tcpip. . . . . . . . : Enabled
```

How to read it:

- **Description** names the adapter. Confirm you are looking at the one that is actually carrying your traffic. A machine with both Wi-Fi and Ethernet shows both, and only one is live.
- **Physical Address** is the MAC address.
- **IPv4 Address** should be a real address. `169.254.x.x` means DHCP failed — full stop, no further diagnosis needed on rungs 3 to 6 until that is fixed.
- **Subnet Mask** is where you apply Part 6. `255.255.255.0` is `/24`. Confirm the gateway is inside your subnet.
- **Default Gateway** is your router. If it is blank, you have no way out of the local network.
- **DNS Servers** is where rung 4 points. One entry is your router; two entries means a fallback is configured, which is good practice.
- **Lease Obtained / Expires** tells you DHCP is working and how long ago it renewed.

*Healthy looks like:* a real address, a mask whose subnet contains both the address and the gateway, a named gateway, and at least one DNS server.

#### Rung 3 — `ping` the gateway

```powershell
ping 192.168.1.1
```

```text
Pinging 192.168.1.1 with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64

Ping statistics for 192.168.1.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 1ms, Maximum = 2ms, Average = 1ms
```

*Healthy looks like:* four replies, 0 % loss, and a time under about 5 ms. Your router is in the same room; anything above single-digit milliseconds on a wired or good wireless link deserves a second look.

**PASS means the local network is healthy.** From here on, every remaining fault is beyond the router, which is exactly the information you wanted.

**FAIL means the device cannot reach its own front door.** Suspect the Wi-Fi association, the access point, the router, or a wrong gateway address in `ipconfig`. Do not proceed upward; nothing above will work.

#### Rung 4a — `ping` a public IP

```powershell
ping 8.8.8.8
```

```text
Pinging 8.8.8.8 with 32 bytes of data:
Reply from 8.8.8.8: bytes=32 time=24ms TTL=115
Reply from 8.8.8.8: bytes=32 time=23ms TTL=115
Reply from 8.8.8.8: bytes=32 time=25ms TTL=115
Reply from 8.8.8.8: bytes=32 time=24ms TTL=115

Ping statistics for 8.8.8.8:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 23ms, Maximum = 25ms, Average = 24ms
```

This is the same test as the gateway, but it proves routing works *past* your router and out to the internet. Note that it uses no DNS at all — you gave it a raw address. That is the entire point.

*Healthy looks like:* four replies, 0 % loss. From the Philippines, roughly 10–60 ms to a regional destination and 150–250 ms to a server in the United States or Europe is normal.

#### Rung 4b — `nslookup`

```powershell
nslookup google.com
```

```text
Server:  UnKnown
Address:  192.168.1.1

Non-authoritative answer:
Name:    google.com
Addresses:  2607:f8b0:4003:c02::8a
            142.250.4.101
```

Now the same name, asked of a public resolver:

```powershell
nslookup google.com 8.8.8.8
```

```text
Server:  dns.google
Address:  8.8.8.8

Non-authoritative answer:
Name:    google.com
Addresses:  2607:f8b0:4003:c02::8a
            142.250.4.101
```

How to read it:

- The first two lines tell you **which server answered**. That is the most useful line in the whole output. If it names your router, your router is the resolver.
- `Non-authoritative answer` means the server answered from its cache rather than from the domain’s own records. That is completely normal and not an error.
- The address list is what your machine will actually connect to.
- **Ask twice, of two different servers.** If your router fails and `8.8.8.8` succeeds, your router’s DNS forwarding is broken, and the fault is local and fixable. If both fail for the same name, the domain itself has a problem and there is nothing on your side to fix.

*Healthy looks like:* an answer from your configured server. A failure looks like `*** Request to 192.168.1.1 timed out` or `*** UnKnown can’t find google.com: Server failed`.

#### Rung 5 — `Test-NetConnection` to a port

```powershell
Test-NetConnection google.com -Port 443
```

```text
ComputerName           : google.com
RemoteAddress          : 142.250.4.101
RemotePort             : 443
InterfaceAlias         : Wi-Fi
SourceAddress          : 192.168.1.14
TcpTestSucceeded       : True
```

Read it line by line and note how much is packed into one command:

- **ComputerName and RemoteAddress** prove DNS resolved the name. Rung 4 is implicitly passing.
- **RemotePort** is what you asked for.
- **InterfaceAlias and SourceAddress** confirm *which* adapter and source address the connection used — invaluable on a machine with both Wi-Fi and Ethernet, or with a VPN adapter in the list.
- **TcpTestSucceeded** is the answer. `True` means the TCP handshake completed: the server accepted your connection on that port.

*Healthy looks like:* `TcpTestSucceeded : True`. If it is `False` while `ping` to the same host succeeds, you have found a port-level block or a dead service — which is a completely different problem class from a connectivity failure, and knowing that is half the diagnosis.

#### Supporting commands you will reach for

`tracert` shows the path and where it stops:

```powershell
tracert 8.8.8.8
```

```text
Tracing route to dns.google [8.8.8.8]
over a maximum of 30 hops:

  1     1 ms     1 ms     1 ms  192.168.1.1
  2     4 ms     3 ms     4 ms  10.0.0.1
  3    11 ms    10 ms    12 ms  100.64.0.1
  4    12 ms    11 ms    11 ms  ae-3.r00.manila.ph.isp.net [203.0.113.9]
  5    23 ms    22 ms    23 ms  ae-1.br01.sin.isp.net [203.0.113.44]
  6    24 ms    24 ms    24 ms  8.8.8.8

Trace complete.
```

Each numbered line is one **hop** — one router the packet passed through. Hop 1 is your own router. The last line is the destination.

Read it like this: hops that answer tell you the path; `* * * Request timed out` on a middle hop is **usually normal**, because many routers are configured not to reply to traceroute. What matters is whether the *final* hop answers. A trace that dies a few hops in, consistently, at the same hop, points at a fault in that part of the ISP’s network — which is escalation territory, not something you fix.

`arp -a` shows what your machine has recently talked to on the local network:

```powershell
arp -a
```

```text
Interface: 192.168.1.14 --- 0xb
  Internet Address      Physical Address      Type
  192.168.1.1           a0-04-60-2f-11-9c     dynamic
  192.168.1.20          3c-52-82-aa-71-04     dynamic
  192.168.1.33          b8-27-eb-5c-90-1a     dynamic
  192.168.1.255         ff-ff-ff-ff-ff-ff     static
  224.0.0.22            01-00-5e-00-00-16     static
```

Each `dynamic` row is a device your machine has exchanged traffic with on this subnet, and it pairs an IP address with a MAC address. This is the **ARP cache** — the result of devices asking “who owns this address?” and getting an answer.

Two uses. First, if a device you expect to be reachable is missing from this list, you have never successfully communicated with it locally. Second, the `ff-ff-ff-ff-ff-ff` row is the broadcast address; those multicast rows are normal and you can ignore them.

`route print` shows how your machine decides where to send things:

```powershell
route print -4
```

```text
IPv4 Route Table
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0      192.168.1.1    192.168.1.14     50
        127.0.0.0        255.0.0.0         On-link         127.0.0.1    331
      192.168.1.0    255.255.255.0         On-link     192.168.1.14    306
    192.168.1.14  255.255.255.255         On-link     192.168.1.14    306
  192.168.1.255  255.255.255.255         On-link     192.168.1.14    306
===========================================================================
```

The row that matters most is the first one: destination `0.0.0.0`, netmask `0.0.0.0`, gateway `192.168.1.1`. That is the **default route** — the rule that says “anything I do not otherwise recognise goes to the router”. It is the table form of the default gateway.

Find the `0.0.0.0 0.0.0.0` row and read its Gateway column. That value *is* your default gateway, and seeing it here confirms the machine agrees with what `ipconfig /all` told you. A machine with a VPN client installed often has several of these rows, which is a common cause of “the internet broke when I connected the VPN” — the VPN added a competing default route. Phase 4 works that as a ticket; *seeing* the second default route here is the evidence you would hand over.

#### Latency, packet loss, and what they actually mean

`ping` gives you two numbers that beginners tend to ignore: **time** in milliseconds and **loss** as a percentage.

| Result | What it means | What it suggests |
|---|---|---|
| 1–5 ms | Local, one hop or a good wireless link | Healthy LAN |
| 10–60 ms | Regional internet destination from the Philippines | Healthy |
| 150–250 ms | A server in the US or Europe | Healthy for that distance |
| 250–400 ms | Far away, or a congested path | Usable for browsing, painful for calls |
| 400 ms+ | A long path or a congested link | Investigate: is it every destination or one? |
| Occasional `Request timed out` with others succeeding | Packet loss on that path | Real, but check the loss percentage |
| Every packet timed out | The host is unreachable, or it blocks ICMP | Follow the ladder; also test a port with `Test-NetConnection` |
| Replies, then a sudden jump to high latency, then replies | Congestion or a device competing for bandwidth | Check whether someone is streaming or uploading |

Two things beginners get wrong here.

**First, latency is not the same as a problem.** A 200 ms ping to a server in the United States is physics, not a fault. What matters is whether the number is *stable* and whether packets are being *lost*.

**Second, and more importantly: “ping works but the app does not” is a different problem class.** Ping uses **ICMP**, a completely different protocol from TCP. A host can cheerfully answer ICMP while a specific TCP port is blocked by a firewall, or while the service behind that port is simply not running. So a successful ping proves the *host* is reachable and nothing more.

If ping succeeds and the application fails, you have not proved the network is fine — you have proved you should move on to the port rung and stop testing reachability.

Also worth knowing: **many hosts block ICMP deliberately.** `ping` failing is not proof a machine is down. `Test-NetConnection` on a known port is the stronger test.

#### The Wi-Fi specific checks

Wi-Fi fails in ways that wired links cannot, because there is a negotiation before you get an IP address at all. Windows exposes that negotiation:

```powershell
netsh wlan show interfaces
```

```text
There is 1 interface on the system:

    Name                   : Wi-Fi
    Description            : Intel(R) Wi-Fi 6 AX201 160MHz
    GUID                   : 9a1f0f3e-6c2b-4e77-9c1d-6d9b4a5c2f10
    Physical address       : a4:5e:60:1c:22:0b
    State                  : connected
    SSID                   : HomeWifi_5G
    BSSID                  : a0:04:60:2f:11:9c
    Network type           : Infrastructure
    Radio type             : 802.11ax
    Authentication         : WPA2-Personal
    Cipher                 : CCMP
    Connection mode        : Auto Connect
    Channel                : 44
    Receive rate (Mbps)    : 866.7
    Transmit rate (Mbps)   : 866.7
    Signal                 : 82%
    Profile                : HomeWifi_5G
```

How to read it:

- **State** should be `connected`. Anything else means rung 1 has failed.
- **SSID** is the network name you joined; **BSSID** is the MAC address of the specific access point radio you are associated with. If you have a mesh system with several nodes, the BSSID tells you *which node* you are on — useful when the signal is poor and you suspect you are stuck on a distant node.
- **Radio type and Channel** — the channel number matters when there is interference. Neighbouring networks on the same channel compete.
- **Receive and Transmit rate** are the negotiated link speeds. They drop sharply as signal weakens. A rate of 6 Mbps on a modern adapter means something is wrong.
- **Signal** is a percentage strength. `82%` is good. Below about `50%` you will see real-world problems — video calls stutter and large transfers crawl. Below `30%` is effectively unusable for anything interactive.

To see who else is nearby — useful when you are diagnosing congestion — run:

```powershell
netsh wlan show networks mode=bssid
```

This lists every visible network with its channel and signal. If five networks in your building are all on channel 6, you have found a plausible cause for poor wireless performance. **Changing the channel is a router configuration change and belongs to whoever administers the router** — note it, do not do it unsupervised.

**“Connected with full bars but no traffic” is a real, distinct failure.** It happens constantly, and beginners misread it as a signal problem.

Here is why it happens. Connecting to Wi-Fi is three separate steps, in order:

1. **Association** — your adapter and the access point agree to talk. This is what produces the “full bars” icon.
2. **IP configuration** — DHCP gives you an address, a mask, and a gateway.
3. **Name resolution** — DNS servers answer you.

Full bars proves only step 1. If step 2 or 3 failed, Windows still shows a connected icon, because from its perspective the wireless link *is* connected. So “connected but nothing loads” is not a mystery and it is not a weak signal.

You check it with the ladder, in the same order as always:

```text
Full bars + no internet
  -> ipconfig /all
       169.254.x.x  -> DHCP failed (rung 2). Release and renew; check the router's DHCP.
       real address -> continue
  -> ping the gateway
       fails        -> the association is technically up but not passing traffic. Rung 1/3.
       succeeds     -> the LAN is fine
  -> ping 8.8.8.8
       fails        -> the router's upstream is down. Rung 4.
       succeeds     -> continue
  -> nslookup google.com
       fails        -> DNS is the fault. Rung 4b.
```

Notice that **“full bars” is evidence about exactly one rung, and it is the lowest one.** Never let it convince you the problem is elsewhere.

#### Symptom to rung: the decision table

| Symptom the user reports | Failed rung | First thing you check |
|---|---|---|
| “No networks available” | 1 — Link | Is Wi-Fi switched on? Is the adapter disabled? Airplane mode? |
| “It says connected but nothing loads” | 2 — IP | `ipconfig /all` for a `169.254` address |
| “The internet is down” | 3 or 4 | `ping` the gateway, then `ping 8.8.8.8` |
| “Some websites work, some do not” | 4b — DNS | `nslookup` of a failing name against your resolver and `8.8.8.8` |
| “It works on my phone but not my laptop” | 2 or 1 | This device only. Adapter, DHCP lease, static config |
| “The page loads forever and times out” | 5 — Port | `Test-NetConnection` to the site on port 443 |
| “I cannot reach the file server” | 2 or 5 | Is it in your subnet? Does port 445 answer? |
| “It is very slow” | Any | Check latency and packet loss first, then link rate and channel |
| “It worked yesterday and nothing changed” | 2 | Ask again about change; check DHCP lease and static config |
| “IT sent me a new laptop and the printer is gone” | 2 | Different subnet, or the printer is on a stale address |
| “The VPN connected and now nothing works” | 3 | `route print -4` for a competing default route — the evidence Phase 4's VPN ticket starts from |

#### Where the boundary of Phase 3 knowledge is

A technician who knows where their knowledge stops is worth more than one who does not. The following are genuinely **out of scope** at this level, and the professional move is to recognise them, document the evidence, and escalate.

- **ISP-side faults.** If your gateway answers, `8.8.8.8` does not, and `tracert` dies inside your ISP’s network, the fault is not yours. You cannot fix it from a laptop. What you *can* do is capture the evidence: the `ipconfig` output, the failed ping, the `tracert` with the hop where it dies. That evidence is what turns “the internet is broken” into a support call the ISP can act on.
- **Routing protocol problems.** Enterprise networks use protocols like OSPF and BGP so routers can tell each other about paths. If a route is missing or a routing loop exists, that is a network engineer’s job. Recognise it as “traffic reaches the router and goes nowhere” and hand it over.
- **VLAN configuration.** A **VLAN (Virtual LAN)** lets one physical switch act as several separate networks. If a device lands in the wrong VLAN, it gets the wrong subnet, often the wrong gateway, and frequently a `169.254` address. You *can* recognise this — “the client has an APIPA address on a network where every other device has a working lease, and the switch port was recently changed” — but changing VLAN assignments requires switch access and change control. Escalate.
- **Firewall rule changes.** If a specific port is blocked for one machine and open for another, a firewall rule is the likely cause. Do not modify firewall rules on equipment you do not own. Test, document which port and which host, and escalate.
- **Router and switch configuration.** Changing DHCP scope settings on an office router, adjusting channel or channel width, modifying access control lists — these are configuration changes on shared infrastructure. They can take down other people’s work.

**What you do instead, every time: escalate with evidence.** A good handoff contains:

1. What the user reported, in their words.
2. What you observed, with the actual command output.
3. What you tested, and what it ruled out.
4. The full picture: who is affected, whether other devices or sites are affected, and what changed recently.
5. What you need from the other team, stated specifically.

Here is what that looks like in practice:

> **Reported:** User in the Manila office reports no internet on their desk PC since 09:15. Two colleagues in the same row are unaffected.
> **Observed:** `ipconfig /all` shows IPv4 `169.254.88.4`, mask `255.255.0.0`, no default gateway, DHCP enabled, no lease obtained. Other devices on the same floor have `10.20.30.x/24` with gateway `10.20.30.1`.
> **Tested:** `ipconfig /release` and `/renew` — no lease obtained after three attempts (approximately 90 seconds). Confirmed the device never received a DHCP offer. Cable and switch port LED confirmed live; swapped to a known-good cable and a different wall port — same result.
> **Ruled out:** Physical cable fault, adapter fault, and a client-side DHCP setting. Client works correctly when moved to a port on the adjacent floor (receives `10.20.31.55/24` immediately), which points at the switch port or its VLAN assignment.
> **Request:** Please check the switch port this desk is patched to and confirm it is assigned to the correct data VLAN. Client will remain on the adjacent floor port until then.

That note does not fix the VLAN. It does something more valuable: it makes the fix a two-minute job for the person who *can* fix it, and it makes you the person they trust next time.

### Part 8 — Guided walkthrough: map and test your own network

Everything above is theory until you see it on your own connection. This is the phase’s hands-on sequence, in the same style as Phase 1’s guided walkthrough. Each check has a command, something to record, and an interpretation.

Do them in order, and keep a document open as you go. That document is your deliverable, and it is also your interview answer to “tell me about a network problem you have diagnosed.”

#### Check 1 — Identify your own addressing, and read the mask as CIDR

```powershell
ipconfig /all
```

Record, for the adapter that is actually carrying your traffic:

- IPv4 address
- Subnet mask, **and its CIDR form**
- Default gateway
- DNS servers
- DHCP server
- MAC address
- Lease obtained and expires

**The CIDR conversion is the exercise.** Write out the arithmetic rather than looking it up. If your mask is `255.255.255.0`, you should be able to say “that is `/24`, so 8 host bits, block size 256, 254 usable hosts”. If your router hands out `255.255.255.128`, that is `/25` — half the network, 126 usable hosts, and a reminder that home routers sometimes ship with a smaller scope than you assume.

Then answer one question in writing: **is my gateway inside my own subnet?** Apply the mask to your address to find your network number, then apply the same mask to your gateway. If they match, the gateway is local and reachable. If they do not, your machine has a configuration fault.

*What this teaches:* the mask is not decoration. It is the number that decides what “local” means.

#### Check 2 — Find your public IP, and prove NAT to yourself

Your private address is what you have inside the house. Your public address is what the internet sees. They are different, and the gap between them is NAT.

See your public address from the command line:

```powershell
(Invoke-RestMethod https://api.ipify.org?format=json).ip
```

```text
203.0.113.47
```

Now compare it with your private address from Check 1. Your machine says `192.168.1.14`; the internet says `203.0.113.47`.

**That difference is NAT, demonstrated with your own connection.** Every device in your house shares that one public address. Your router rewrites outgoing packets so they all appear to come from it, and it keeps a table of which internal device each reply belongs to. When you see it on your own network, the concept stops being abstract.

Then check who owns that public address:

```powershell
nslookup 203.0.113.47
```

The answer will name a **reverse DNS** entry, usually belonging to your ISP. That tells you which network your traffic exits from — a small but genuinely useful piece of knowledge when you are diagnosing “is this site blocking my country?”.

Also worth doing once: find your public IP through a browser and compare. Both should agree. If they disagree, you have more than one path to the internet, which usually means a VPN is active.

*What this teaches:* private and public addressing, and what NAT actually does.

#### Check 3 — Map your own network

Build a small map, on paper or in diagrams.net.

```powershell
# Who is my gateway?
(Get-NetIPConfiguration | Where-Object {$_.IPv4DefaultGateway}).IPv4DefaultGateway.NextHop

# What are my DNS servers?
(Get-DnsClientServerAddress -AddressFamily IPv4 |
  Where-Object {$_.ServerAddresses}).ServerAddresses

# How far away is something, and by what path?
tracert 8.8.8.8

# Who have I actually talked to locally?
arp -a
```

Record:

- **Gateway.** Note that on many home setups the gateway address is also the DNS server — one box doing both jobs. That is a real observation worth writing down.
- **DNS servers.** If one of them is your router, your router is forwarding to the ISP’s resolvers. If they are `8.8.8.8` or `1.1.1.1`, someone configured public resolvers deliberately.
- **Traceroute hops.** Count them. Hop 1 is always your router. The next hop is usually the ISP’s first router — note its name, because ISP routers often have names that reveal their city, which is useful context.
- **ARP entries.** Every `dynamic` row is a device on your own subnet that your machine has spoken to.

Then draw it: your PC, the router, the ISP, and the internet, with the addresses labelled. Add any other devices you found in the ARP table.

*What this teaches:* the shape of your own network, from its own point of view. Most learners have never seen their network described before.

#### Check 4 — Prove that DNS is what breaks

This is the single most valuable experiment in the phase, because DNS failure masquerading as an outage is the most misdiagnosed home-support problem there is.

Step one: resolve a name normally, using whatever your machine is configured to use.

```powershell
nslookup google.com
```

Step two: resolve the same name against a specific public resolver.

```powershell
nslookup google.com 8.8.8.8
```

Step three: resolve it against a second public resolver.

```powershell
nslookup google.com 1.1.1.1
```

Now compare all three answers. Record for each: **which server answered**, and **what addresses it returned**.

If all three agree, your resolver is working and DNS is not your problem today. If your default resolver times out but the public ones answer, you have directly observed a broken DNS setup — and you now know exactly how to demonstrate it.

Finish by proving the same thing without `nslookup` at all, using the pair from Part 3:

```powershell
ping 8.8.8.8       # connectivity by IP, no DNS involved
ping google.com    # connectivity AND name resolution
```

Write one sentence explaining what a failure of the second but not the first proves. If you can write that sentence without notes, you have learned the phase’s most valuable diagnostic.

*What this teaches:* DNS is a separate service from connectivity, and you can isolate it.

#### Check 5 — Watch a real connection, and understand the port

```powershell
Test-NetConnection google.com -Port 443
```

Then try a port that is not open, to see the difference:

```powershell
Test-NetConnection google.com -Port 81
```

Compare the two. `TcpTestSucceeded : True` on 443 and `False` on 81 is the whole lesson: the host is reachable in both cases, but only one port has a service listening.

Now answer in writing, for each of these ports, **what service number it is and what it tells you**:

```text
Port 22    -> ?
Port 53    -> ?
Port 80    -> ?
Port 443   -> ?
Port 3389  -> ?
```

Port 22 is SSH — if it answers on a public host, someone has remote administration exposed. Port 53 is DNS. Port 80 is unencrypted web. Port 443 is HTTPS. Port 3389 is Remote Desktop — and if it answers on a machine exposed to the internet, that machine is being scanned by attackers right now.

**The point of this check is that a port number is not trivia.** It is how you tell, from outside, what a machine is offering to the world. That skill is the first step into security work, and it starts with one cmdlet.

*What this teaches:* reachability and service availability are different facts, and ports are how you tell them apart.

#### Check 6 — Capture a DNS lookup and a TCP handshake in Wireshark

Install Wireshark (free, from wireshark.org), start a capture on your active adapter, and then:

**For the DNS lookup:** generate one on purpose while the capture is running.

```powershell
nslookup example.com
```

Stop the capture and filter on `dns`. You will see a **query** packet (your machine asking) and a **response** packet (the server answering). Click the response and expand the **Answers** section. You will see the name and the address it resolved to — the same information `nslookup` printed, but now you have watched it cross the wire.

Record: the query name, the answering server’s address, and the resolved address.

**For the TCP handshake:** start a new capture, then load a website in your browser while it runs. Stop it and filter on:

```text
tcp.flags.syn==1
```

That filter shows packets with the **SYN** flag set — the packets that begin a connection. Find one connection and look at the three packets at its start:

1. **SYN** — your machine to the server: “I would like to open a connection, here is my starting sequence number.”
2. **SYN, ACK** — server to your machine: “Agreed, and here is mine.”
3. **ACK** — your machine to the server: “Acknowledged. Connection open.”

Three packets, in that order, and then the actual data starts. That is the **three-way handshake**, and watching it happen once is worth more than any diagram. You will also see the `FIN` or `RST` packets that end the connection — `RST` meaning “reset, go away”, which is what a blocked port typically produces.

Two practical notes. If the capture looks overwhelming, remember Wireshark is showing *everything* on your adapter; the filter is what makes it readable. And if you see your own traffic in encrypted form, that is TLS doing its job — you will see the handshake and the destination, but not the page contents.

*What this teaches:* the abstract protocol diagrams are descriptions of packets you can capture yourself.

#### Check 7 — Break it on purpose, then fix it

This is the check that makes the failure signatures stick, because you will experience them instead of reading about them.

**Before you start:** make sure nothing important is running — no call, no upload, no exam. Open PowerShell **as Administrator** (right-click it in the Start menu → *Run as administrator*). The commands below change adapter and DNS settings, and in a normal window they fail with `Access is denied`.

1. **Confirm everything works.** Run the ladder once while healthy: `ipconfig /all`, `ping` the gateway, `ping 8.8.8.8`, `nslookup google.com`. Write down each result. This is your baseline, and it matters because you cannot recognise a failure signature you have never seen a success beside.
2. **Break it.** Disconnect from Wi-Fi in Windows settings, or disable the adapter:

```powershell
Get-NetAdapter
Disable-NetAdapter -Name "Wi-Fi" -Confirm:$false
```

Replacing `“Wi-Fi”` with the exact name from `Get-NetAdapter`.

3. **Observe every rung.** Immediately run the ladder again and record what each command says now:
   - `ipconfig /all` — the adapter may still show a stale address, or none at all. Note which.
   - `ping` the gateway — you should get `Destination host unreachable` or `Transmit failed. General failure.` Note the exact wording; it is different from a timeout, and the difference tells you the operating system knew it had no route.
   - `ping 8.8.8.8` — same class of failure.
   - `nslookup google.com` — often a timeout, sometimes an immediate answer from cache. Note that a cached answer can be misleading.
4. **Break it differently.** Re-enable the adapter, let it reconnect, then break only DNS instead. The inverse command is the same cmdlet with `Enable`:

```powershell
Enable-NetAdapter -Name "Wi-Fi"
```

Wait for the adapter to come back and confirm with `ipconfig /all` before going on. Then break DNS only: temporarily set your adapter’s DNS server to an address you know does not answer — for example `192.0.2.1`, which is a reserved documentation address that will never respond.

```powershell
Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ServerAddresses 192.0.2.1
ipconfig /flushdns
```

Now run the ladder again. This is the important moment: **`ping 8.8.8.8` still works, `ping google.com` fails.** You have reproduced the DNS failure signature deliberately, and you will recognise it for the rest of your career.
5. **Fix it.** Put DNS back to automatic:

```powershell
Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ResetServerAddresses
ipconfig /flushdns
```

Then verify with the full ladder, and confirm `nslookup google.com` answers again.
6. **Write the comparison table.** For each rung, one column for “what it looks like when healthy” and one for “what it looks like when this rung is broken”. That table is the artifact of this phase — it is something you built from your own machine, and it will be the most useful page in your notes.

*What this teaches:* failure signatures by direct experience. Reading that `169.254` means DHCP failed is knowledge; watching your own machine print `Transmit failed. General failure.` the moment its adapter goes down — and seeing that this is *not* the same wording as a timeout — is recognition, and recognition is what you need at 2 a.m. on a real ticket.

(The `169.254` address itself is worth meeting deliberately: on a machine that has just lost DHCP, `ipconfig /all` shows it as the *Autoconfiguration IPv4 Address*. Do that once, so the signature is familiar before it finds you.)

### Part 9 — Two worked tickets

Reading about tickets teaches you the shape of the process. Working them teaches you the reasoning. Both tickets below are at exactly the level a first-line Phase 3 technician can work, and both state explicitly where the fix belongs to a later phase.

Read them for the reasoning, not the fixes.

#### Ticket 1 — “The internet is down”

**What the user said:**

> “The internet is down again. Nothing loads. I’ve restarted the router twice already and it’s still dead. Can you just fix it, I have a deadline.”

The phrase “nothing loads” is worth noticing. Nothing loading in a *browser* and nothing working on the *network* are different claims, and the user has not distinguished them.

**What you ask.**

You ask four questions before touching anything:

1. “Is it just the browser, or does nothing on the computer work online — email, updates, anything?”
2. “Are other devices in the house working? Your phone, anyone else’s laptop?”
3. “When you say it’s down, is there an error message on the page? Can you read it to me?”
4. “Did anything change today — a reboot, a new device on the network, a power cut?”

The user answers: *“Only the browser, I think. My phone works fine on the same Wi-Fi. The page says ’This site can’t be reached’ and ’DNS_PROBE_FINISHED_NXDOMAIN’. No, nothing changed.”*

Three useful facts are already on the table. The phone works on the same network, which means the internet connection is up and the fault is isolated to this machine. The error names DNS explicitly. And “nothing changed” is a claim you will keep in mind without relying on it.

**What you observe.**

You ask permission to connect to the machine and run the ladder from Part 7 in order.

*Rung 1 — Link.* Wi-Fi is connected, full signal. Rung 1 passes.

*Rung 2 — IP.*

```powershell
ipconfig /all
```

```text
Wireless LAN adapter Wi-Fi:

   Description . . . . . . . . . . . : Intel(R) Wi-Fi 6 AX201 160MHz
   Physical Address. . . . . . . . . : A4-5E-60-1C-22-0B
   DHCP Enabled. . . . . . . . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 192.168.1.22(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
   DHCP Server . . . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 127.0.0.1
```

A real address, a sensible mask, and a gateway. Rung 2 passes. But look at the **DNS Servers** line: `127.0.0.1`. That is **loopback** — the machine’s own address, meaning “ask myself”. This machine has been configured to use a DNS resolver running locally on itself, and there is one very common reason for that: a VPN client or a security tool that hijacks DNS.

This is the finding, and it arrived on rung 2 with one command.

*Rung 3 and 4 — confirm the shape.*

```powershell
ping 192.168.1.1
```

```text
Pinging 192.168.1.1 with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64

Ping statistics for 192.168.1.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
```

```powershell
ping 8.8.8.8
```

```text
Pinging 8.8.8.8 with 32 bytes of data:
Reply from 8.8.8.8: bytes=32 time=26ms TTL=115
Reply from 8.8.8.8: bytes=32 time=25ms TTL=115
Reply from 8.8.8.8: bytes=32 time=24ms TTL=115
Reply from 8.8.8.8: bytes=32 time=25ms TTL=115

Ping statistics for 8.8.8.8:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
```

The gateway answers and the internet answers. **Connectivity is perfect.** Whatever is wrong, it is not the network.

*Rung 4b — the name.*

```powershell
ping google.com
```

```text
Ping request could not find host google.com. Please check the name and try again.
```

There it is. Connectivity by IP works; names do not resolve.

```powershell
nslookup google.com
```

```text
Server:  UnKnown
Address:  127.0.0.1

*** UnKnown can't find google.com: Server failed
```

The resolver your machine is pointed at — itself — is not answering. Now the decisive test: ask a server that is not your machine.

```powershell
nslookup google.com 8.8.8.8
```

```text
Server:  dns.google
Address:  8.8.8.8

Non-authoritative answer:
Name:    google.com
Addresses:  142.250.4.101
```

**The public resolver answers instantly.** So DNS is not broken on the internet, and the network is not broken. The only thing broken is the local resolver this machine was told to use.

You check what is listening on the loopback for DNS:

```powershell
Get-NetTCPConnection -LocalPort 53 -State Listen -ErrorAction SilentlyContinue |
  Select-Object LocalAddress, LocalPort, OwningProcess
Get-NetUDPEndpoint -LocalPort 53 -ErrorAction SilentlyContinue |
  Select-Object LocalAddress, LocalPort, OwningProcess
```

```text
LocalAddress LocalPort OwningProcess
------------ --------- -------------
```
(both empty)

Nothing is listening on port 53 — not TCP, and not UDP either. Check both, because DNS is mostly a UDP protocol: the TCP query alone would only prove that nothing is serving zone transfers, and the UDP endpoint is the one that answers ordinary lookups. Here they agree, so the conclusion is safe: the resolver that was supposed to run locally has stopped, and the machine is still configured to depend on it.

**What you do.**

You make **one change** and record the result. The machine’s DNS is set to `127.0.0.1`, which is wrong while nothing runs on that port.

1. You reset the adapter’s DNS to obtain servers automatically, so it inherits the router’s DNS from DHCP:

```powershell
Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ResetServerAddresses
ipconfig /flushdns
```

2. You confirm the change took effect:

```powershell
(Get-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -AddressFamily IPv4).ServerAddresses
```

```text
192.168.1.1
8.8.8.8
```

3. You verify name resolution works again:

```powershell
nslookup google.com
```

```text
Server:  UnKnown
Address:  192.168.1.1

Non-authoritative answer:
Name:    google.com
Addresses:  142.250.4.101
```

**Why the machine was misconfigured is the actual ticket.** A `127.0.0.1` DNS server does not appear by accident. You check what is installed and find a leftover VPN client that the user stopped using — it installed a local DNS proxy, set the adapter to point at it, and then was uninstalled or disabled, leaving the setting behind. You check the routes for the same fingerprint:

```powershell
route print -4
```

The single `0.0.0.0 0.0.0.0` default route now points at `192.168.1.1`, with no competing VPN route. That confirms the router is once again the only path out, and it is the evidence you record for the note.

**What you do not do.** You do not “fix” this by disabling DNS entirely, you do not install a third-party DNS changer, and you do not reboot the router a third time. The router was never involved.

**Where the fix belongs.** Removing the leftover VPN client’s virtual adapter cleanly, and understanding why VPN clients install a local DNS proxy in the first place, goes beyond this phase. Phase 4 works a VPN drop ticket from the same `route print -4` evidence you gathered here, but it is not a prerequisite for anything above — the correct move at your level is to escalate to whoever owns the VPN client.

At Phase 3, the correct action is the one taken above: identify that the configured resolver is unreachable, restore working resolution, and note the cause for the next technician. If the user needs the VPN client reinstalled, that is a ticket to whoever owns the VPN.

**Final ticket note.**

> **Reported:** User reported “the internet is down” — no pages loading in the browser. Two router restarts had already been attempted by the user. Phone on the same Wi-Fi working normally.
> **Changed recently:** Nothing reported by the user. No router change, no power event.
> **Observed:** Wi-Fi connected, full signal. `ipconfig /all`: IPv4 `192.168.1.22/24`, gateway `192.168.1.1`, DHCP lease valid, **DNS Servers: `127.0.0.1`**. `ping 192.168.1.1` — 0 % loss. `ping 8.8.8.8` — 0 % loss, 24–26 ms. `ping google.com` — “could not find host”. `nslookup google.com` against `127.0.0.1` — “Server failed”. `nslookup google.com 8.8.8.8` — answered immediately. No process listening on TCP or UDP 53 on the local machine. `route print -4` showed a single default route via `192.168.1.1`.
> **Action (one change at a time):** 1) Reset the Wi-Fi adapter’s DNS servers to automatic (`Set-DnsClientServerAddress -ResetServerAddresses`) and flushed the DNS cache. 2) Confirmed the adapter now receives `192.168.1.1` and `8.8.8.8` via DHCP.
> **Verified:** `nslookup google.com` resolved correctly. Asked the user to load the specific site that failed and confirm it opened — they confirmed it loaded normally.
> **Cause:** The adapter was statically configured to use `127.0.0.1` as its DNS server, with no resolver running on that address. Traced to a leftover configuration from a discontinued VPN client. Connectivity was never at fault.
> **For the next agent / out of scope:** The VPN client that created this configuration is still installed. If the user resumes using it, or if the DNS setting reverts, do not keep resetting the adapter — escalate to whoever owns the VPN client, with these notes. Does not require ISP involvement; the router and line were healthy throughout.

**Reasoning to take away:** “The internet is down” is a *symptom description*, not a diagnosis, and in this ticket the internet was never down. The decisive evidence cost nothing: `ping 8.8.8.8` succeeded while `ping google.com` failed, and that single comparison split “connectivity” from “name resolution” in under five seconds. Then comparing your own resolver against `8.8.8.8` proved the fault was local rather than global.

**Read the DNS Servers line in `ipconfig /all` every single time** — `127.0.0.1` is never an accident, and it is the fingerprint of a VPN or security tool that changed the machine and did not change it back.

#### Ticket 2 — “The printer works for me but not for her”

**What the user said:**

> “The shared printer in the back office works fine from my PC, but Maria can’t print from hers. She gets ’Windows cannot connect to the printer’. We’re both on the same network, I checked. It’s been like this since she moved desks last week.”

This ticket is a subnetting ticket wearing a printer costume. Read the last sentence twice.

**What you ask.**

1. “Can Maria print from the printer’s own control panel — a test page from the device itself?”
2. “Does she see the printer in the list at all, or does it not appear?”
3. “Has she ever printed successfully from that desk, or has it never worked there?”
4. “When she moved desks, did anything else change — a different network cable, a different socket, a new laptop?”

The user answers: *“The printer prints its own test page fine. She can see the printer in the list but connecting fails. It worked at her old desk. Same laptop, different desk — she just moved the network cable with her.”*

Five facts, and three of them matter enormously. The printer hardware is fine (test page works). The failure is at connect time, not discovery. And it worked at the old desk with the same laptop — which means the laptop is not the fault, and something about the **new desk** is.

**What you observe.**

You start with the printer, because a printer that prints its own test page is a healthy printer and you want its real address:

```powershell
# From a PC that CAN print
Get-Printer -Name "BackOffice-HP" | Select-Object Name, PortName, PrinterStatus
```

```text
Name           PortName            PrinterStatus
----           --------            -------------
BackOffice-HP  192.168.10.200_1    Normal
```

The port name embeds the printer’s address: `192.168.10.200`. Record it.

Now the two machines.

```powershell
# On the working PC
ipconfig | Select-String "IPv4", "Subnet"
```

```text
   IPv4 Address. . . . . . . . . . . : 192.168.10.25
   Subnet Mask . . . . . . . . . . . : 255.255.255.192
```

```powershell
# On Maria's PC
ipconfig | Select-String "IPv4", "Subnet"
```

```text
   IPv4 Address. . . . . . . . . . . : 192.168.10.70
   Subnet Mask . . . . . . . . . . . : 255.255.255.192
```

Now apply Part 6, in the order you learned it.

**Step 1 — read the mask.** `255.255.255.192` is a `/26`. That means `32 − 26 = 6` host bits, block size `2⁶ = 64`, and 62 usable hosts per subnet. Block boundaries in the last octet are at `0`, `64`, `128`, `192`.

**Step 2 — place the printer.** `192.168.10.200` falls in the `192–255` block. **The printer is in subnet `192.168.10.192/26`.**

**Step 3 — place the working PC.** `192.168.10.25` falls in the `0–63` block. **Subnet `192.168.10.0/26`.**

So the working PC and the printer are already in *different* subnets. That is not automatically fatal, because the two subnets are reachable through the router — the working PC’s traffic goes to its gateway, and the gateway forwards to the printer’s subnet. Something must be permitting that.

**Step 4 — place Maria’s PC.** `192.168.10.70` falls in the `64–127` block. **Subnet `192.168.10.64/26`.**

That is the key finding. Maria’s machine is in a **third** subnet — neither the printer’s nor the working PC’s.

Wait — you wrote that subnet in Part 6 as a working example where a `192.168.10.70/26` machine with a gateway of `192.168.10.1` fails, because `192.168.10.1` is in the `0–63` block and therefore not local. Check that against Maria’s actual configuration:

```powershell
# On Maria's PC
ipconfig /all
```

```text
Ethernet adapter Ethernet:

   Description . . . . . . . . . . . : Realtek PCIe GbE Family Controller
   Physical Address. . . . . . . . . : 3C-52-82-AA-71-04
   DHCP Enabled. . . . . . . . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 192.168.10.70(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.192
   Default Gateway . . . . . . . . . : 192.168.10.65
   DHCP Server . . . . . . . . . . . : 192.168.10.65
   DNS Servers . . . . . . . . . . . : 192.168.10.65
```

`192.168.10.70/26` with gateway `192.168.10.65`. Apply the mask to the gateway: `192.168.10.65` falls in the `64–127` block, which is Maria’s own subnet. **The gateway is local and reachable.** So Maria’s machine can leave its subnet. The configuration is internally consistent.

The machine is fully working as a network device. So the fault is not on Maria’s machine at all — it is in what the network will *let* her reach.

Confirm reachability at the port level, which is rung 5:

```powershell
# On Maria's PC
Test-NetConnection 192.168.10.200 -Port 445
```

```text
ComputerName           : 192.168.10.200
RemoteAddress          : 192.168.10.200
RemotePort             : 445
InterfaceAlias         : Ethernet
SourceAddress          : 192.168.10.70
PingSucceeded          : False
TcpTestSucceeded       : False
```

`TcpTestSucceeded : False`. Maria cannot open a connection to port 445 — SMB, the Windows file and printer sharing protocol — on the printer. But she *can* reach her gateway:

```powershell
# On Maria's PC
ping 192.168.10.65
```

```text
Pinging 192.168.10.65 with 32 bytes of data:
Reply from 192.168.10.65: bytes=32 time=1ms TTL=64
Reply from 192.168.10.65: bytes=32 time=1ms TTL=64
Reply from 192.168.10.65: bytes=32 time=1ms TTL=64
Reply from 192.168.10.65: bytes=32 time=1ms TTL=64
```

And for comparison, the working PC’s test:

```powershell
# On the working PC
Test-NetConnection 192.168.10.200 -Port 445
```

```text
ComputerName           : 192.168.10.200
RemoteAddress          : 192.168.10.200
RemotePort             : 445
InterfaceAlias         : Ethernet
SourceAddress          : 192.168.10.25
TcpTestSucceeded       : True
```

The working PC reaches the printer on 445. Maria’s does not. Maria reaches her gateway fine. Nothing is broken on her machine — **her subnet is not permitted to reach the printer’s subnet.**

**What the diagnosis actually is.**

Maria’s new desk is patched to a switch port in a different VLAN than her old desk, and that VLAN hands out the `192.168.10.64/26` range, which was meant for guests or for a different department. Guest and departmental subnets typically have an inter-subnet firewall rule that blocks them from reaching internal devices like printers. Her old desk was in the same subnet group as the printer’s, or in a subnet with permission.

You now have every piece of evidence needed:

| Fact | Evidence | What it proves |
|---|---|---|
| Printer hardware healthy | Prints its own test page | Not a printer fault |
| Printer address and subnet | `192.168.10.200/26`, subnet `192.168.10.192` | Where the printer actually lives |
| Maria’s address and subnet | `192.168.10.70/26`, subnet `192.168.10.64` | Maria is in a different subnet |
| Maria’s gateway is local | Gateway `192.168.10.65` is inside her own block | Her configuration is valid, not a mask error |
| Maria can reach the gateway | `ping 192.168.10.65` — 0 % loss | Link, IP, and gateway rungs all pass |
| Maria cannot reach port 445 | `TcpTestSucceeded : False` | The block is between subnets |
| Another PC can reach port 445 | `TcpTestSucceeded : True` from `192.168.10.25` | The printer and its service are fine |
| It worked at the old desk | User report | Points at the port or VLAN, not the laptop |

**What you do — and what you deliberately do not do.**

You **do not** restart the print spooler, reinstall the printer driver, or remove and re-add the printer. None of those touch the actual cause, and all of them make the ticket longer. You also do not change Maria’s IP address by hand to a working one: that would place a manually configured device inside a subnet it does not belong to, cause an address conflict risk, and hide the real fault.

What you do is **escalate with evidence**. This is a VLAN assignment on a managed switch. It requires switch access and change control, and it is explicitly outside Phase 3 knowledge.

> **Reported:** User at the back-office desk cannot print to the shared printer `BackOffice-HP`. Error: “Windows cannot connect to the printer”. Colleague at an adjacent desk prints normally. User moved desks last week; same laptop, same cable.
> **Observed:** Printer prints its own test page; port name on a working PC is `192.168.10.200_1`. Printer is `192.168.10.200/26` — subnet `192.168.10.192/26`. Working PC is `192.168.10.25/26` — subnet `192.168.10.0/26`. Affected PC is `192.168.10.70/26`, gateway `192.168.10.65` — subnet `192.168.10.64/26`. Affected PC’s gateway is inside its own subnet, so its configuration is valid. `ping 192.168.10.65` from the affected PC: 4/4 replies, 0 % loss. `Test-NetConnection 192.168.10.200 -Port 445` from the affected PC: `TcpTestSucceeded : False`. The same test from the working PC: `TcpTestSucceeded : True`. Printer reachable on port 445 from one subnet and not the other.
> **Tested / ruled out:** Printer hardware (self-test passes), printer service (port 445 answers from another subnet), affected PC’s cabling and adapter (gateway responds, DHCP lease valid), affected PC’s addressing (mask and gateway are internally consistent), and the printer driver and spooler (not touched — the failure is at the network layer, before any driver involvement).
> **Action:** No changes made to the affected PC. Confirmed the printer is reachable from a PC in a permitted subnet and documented the exact failing source and destination.
> **Cause (probable, requires switch access to confirm):** The desk the user moved to is patched to a switch port assigned to a different VLAN, which issues addresses in `192.168.10.64/26`. That subnet is not permitted to reach the printer’s subnet on port 445. The laptop and printer are both healthy.
> **Request / out of scope for Phase 3:** Please review the switch port assignment for the back-office desk occupied by Maria and move it to the VLAN used by the adjacent desks (`192.168.10.0/26`), or add an inter-subnet rule permitting `192.168.10.64/26` to reach `192.168.10.192/26` on TCP 445. VLAN and firewall changes are outside first-line scope; no changes have been made pending that review.
> **Workaround in place:** User can print from the adjacent shared PC until the port is moved.

**Reasoning to take away:** “We’re on the same network” is a claim, not a fact, and the subnet mask is what settles it. Three addresses that all begin `192.168.10.` turned out to live in three different subnets, and doing the `/26` arithmetic — block size 64, boundaries at 0, 64, 128, 192 — answered the ticket before any fix was attempted.

Then the ladder confirmed it: the user could reach her gateway (rungs 1–3 pass) but not port 445 on the printer (rung 5 fails), which placed the fault precisely between two subnets rather than on either machine.

Finally, the discipline that makes this professional: **when the fix requires switch or firewall access you do not have, you stop, document the evidence, and escalate.** Reinstalling the print driver would have looked like work and changed nothing.

#### What both tickets have in common

Two different symptoms — “the internet is down” and “the printer works for me but not for her” — and the same method underneath.

**The user’s description is a starting point, not a diagnosis.** “The internet is down” was false; the internet was fine and one machine’s resolver was misconfigured. “We’re on the same network” was also false. In both tickets, the user’s confident framing would have sent you in the wrong direction if you had accepted it.

**Do the cheap comparison first.** In ticket 1 it was `ping 8.8.8.8` against `ping google.com`. In ticket 2 it was one working machine against one failing machine. A comparison costs seconds and splits the problem in half.

**Read the configuration lines you are tempted to skim.** `DNS Servers: 127.0.0.1` in ticket 1 and `Subnet Mask: 255.255.255.192` in ticket 2 were both sitting in plain sight in `ipconfig` output. Neither was hidden. Both were decisive.

**Ask what changed, and believe the answer.** “Since she moved desks last week” was the most valuable sentence in ticket 2, and the user volunteered it without realising.

**Confirm where a fault is before you fix it.** In ticket 2 the technician never touched the printer driver, because the port test had already located the problem between subnets. Testing is cheaper than fixing, and it prevents the most common beginner error: changing things until something works, without ever learning what was broken.

**Know your boundary and escalate with evidence.** Ticket 2 ends with a request, not a change. A handoff that names the exact source address, destination address, port, and suspected cause is faster to action than a fix attempted without authority — and it is what makes you the person the network team is glad to hear from.

### Key takeaways

- Networks are layered; troubleshoot bottom-up and stop at the first broken layer.
- A **MAC address** is the local hardware identity; an **IP address** is the routable logical one.
- The **subnet mask** splits network from host. You can talk directly only to devices in your subnet; everything else goes via the **gateway**.
- **`169.254.x.x` means DHCP failed.** That is a diagnosis, not a mystery.
- **DNS translates names to addresses**, and it breaks more often than connectivity. Test it with `ping 8.8.8.8` versus `ping google.com`.
- **Ports** route traffic to the right service. Know the common ones; respect the dangerous ones.
- **TCP** is reliable and connection-oriented; **UDP** is fast and best-effort.
- `Test-NetConnection` and `nslookup` are your two best everyday tools.
- **Subnets exist to limit broadcast noise, separate devices, and create policy boundaries.** A flat network of 500 devices wastes bandwidth and lets anything talk to anything.
- **CIDR is just a count of leading `1` bits.** `/26` and `255.255.255.192` are the same mask written two ways, and you need both directions in your head.
- **Every subnet loses two addresses** — the network address and the broadcast address — so a `/26` block of 64 gives you 62 usable hosts.
- **The shortcut is three steps: host bits are 32 minus the CIDR, block size is two to that power, and the block you are in tells you everything else.** Practise it until a `/26` question takes five seconds.
- **An IP address without a mask is incomplete information.** The same address means different things under a `/24` and a `/26`.
- **Two devices that look like neighbours may not be.** `192.168.10.10/26` and `192.168.10.200/26` share a first three octets and nothing else.
- **A gateway outside your subnet is unreachable by definition.** That is arithmetic, not a firewall or a hardware fault.
- **A mask typo produces “some things work and some don’t”.** When a machine half-works, compare its mask against a machine that works.
- **You do not need to subnet at speed for entry-level work.** You do need to read a mask and recognise when two addresses are not neighbours.
- **The diagnostic ladder is link, IP, gateway, DNS, port, application — in that order, stopping at the first failure.** The order is the skill; the commands are just the tools.
- **A PASS at each rung tells you something specific.** Gateway reachable means the LAN is healthy and every remaining fault is beyond the router.
- **“Ping works but the app does not” is a different problem class.** ICMP and TCP are different protocols; a host can answer ping while every service on it is blocked.
- **“Connected with full bars but no traffic” is a real failure.** Association succeeded; IP configuration or DNS did not. Full bars are evidence about rung 1 only.
- **Learn what healthy looks like.** You cannot recognise a failure signature you have never seen beside a healthy result.
- **`127.0.0.1` as a DNS server is never an accident.** It is the fingerprint of a VPN or security tool that configured the machine and did not configure it back.
- **`route print -4` shows your default route.** The `0.0.0.0` row *is* your gateway, and a second one usually means a VPN.
- **Some faults are not yours to fix.** ISP-side faults, routing protocols, VLAN assignments, and enterprise firewall rules are escalation territory.
- **Escalate with evidence, not with a shrug.** Source, destination, port, command output, what you ruled out, and the specific thing you need — that handoff is professional competence.

### Practice this next

The exercises in *Hands-on practice tasks* below are not optional extras — they are the lesson. Draw your network, run the commands, watch a handshake in Wireshark, and build the Packet Tracer topology. If you can explain the DNS test and the DHCP failure mode out loud, without notes, you have learned this phase.

Then work the new material in the same way, in this order:

1. **Do the Part 6 arithmetic by hand, on paper, three times.** Take `192.168.20.0/27`, `10.0.0.0/28`, and `172.16.8.64/26`. For each, write out the network address, first and last usable host, broadcast address, and usable host count — using the shortcut method, then check one of them in binary, the way Part 6 Step 2 lays it out. Do not use a subnet calculator until you have done all three yourself; the calculator is for checking, not for thinking.
2. **Redraw the four-subnet table from Part 6 from memory.** A `/24` split into four `/26`s, with every network, host, and broadcast address. If you get one wrong, work out which block boundary you missed.
3. **Answer the two mask questions in words.** Ask yourself: *“Is `192.168.10.10/26` in the same subnet as `192.168.10.200/26`, and how do you know?”* Then: *“Why can a device not use a gateway outside its own subnet?”* If you can answer both without hesitating, you have the part of subnetting that actually earns money.
4. **Run the Part 8 walkthrough end to end** on your own network and record every result. Checks 1–7, in order. The comparison table from Check 7 is the single most useful artifact in this phase — it is your own, measured, and you will still be using it in a year.
5. **Build the symptom-to-rung table from Part 7 with the symptoms covered.** Cover the right-hand columns, read only the symptom, and say aloud which rung failed and what you would check first. Then uncover and compare. This is the exercise that turns the command list into a diagnostic reflex.
6. **Work both tickets in Part 9 on paper.** Cover the solution, read only what the user said, and write your questions, your expected findings, and your escalation note before you read the answer. Then compare your reasoning against the ticket — including whether you correctly identified what was out of scope, because that judgement is assessed as much as the technical fix.
7. **Deliberately break your own network, twice.** Part 8 Check 7 walks you through it: disable the adapter and observe every rung fail, then break DNS only and observe the specific signature where `8.8.8.8` works and names do not. Doing this once on purpose is worth an hour of reading.
8. **Practise one escalation note.** Write a five-line handoff for a fault you cannot fix at Phase 3 — a `169.254` address that survives a renew, or a port blocked for one machine only. Include what you observed, what you ruled out, and what you need. This is the skill that gets a first-line technician noticed.
9. **Then update your deliverable and the checklist.** Add your subnetting worksheet, your network map with CIDR masks, your Wireshark DNS capture, your healthy-versus-broken comparison table, and both ticket write-ups. If you can read any mask at a glance, trace a fault down the ladder to a named rung, and hand off what you cannot fix with evidence instead of a guess, you have met the exit criteria for this phase.

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

**Before task 7 — Packet Tracer.** This phase teaches the *networking*; it does not teach the Cisco tool. Task 7 assumes you can already drop devices onto the canvas and open a device's CLI, and the checklist gates on it, so cover that first. The free **Introduction to Packet Tracer** course on Cisco NetAcad takes about two hours and is enough to build the topology below.

If you would rather not create an account, the same objectives are reachable in the VirtualBox lab you built in Phase 2 — build the two subnets and the router there instead, and say in your write-up which route you took. Either is a real answer; skipping the routing entirely is not.

1. Draw your home network in diagrams.net. Include the ISP modem/router, your devices, Wi-Fi access points, and how they connect. <!-- id: it-03-t01 band: focused energy: normal -->
2. Check your IP configuration. Run `ipconfig /all` on Windows, or `ifconfig` / `ip a` on Linux. Record your IP address, subnet mask, default gateway, DHCP server, DNS server, and MAC address. <!-- id: it-03-t02 band: quick energy: low -->
3. Test connectivity. Ping your gateway, `1.1.1.1`, `8.8.8.8`, and `google.com`. Explain why the responses differ. <!-- id: it-03-t03 band: focused energy: normal -->
4. Run DNS lookups. Try `nslookup google.com`, `nslookup -type=mx gmail.com`, and `nslookup -type=txt google.com`. Document what each reveals. <!-- id: it-03-t04 band: focused energy: normal -->
5. Capture DNS traffic in Wireshark. Filter on `dns`, identify a query, and explain how the name resolved to an IP address. <!-- id: it-03-t05 band: focused energy: normal -->
6. Capture a TCP handshake in Wireshark. Filter on `tcp`, find a handshake between your device and a server, and explain the three-way handshake. <!-- id: it-03-t06 band: focused energy: normal -->
7. Build a Packet Tracer network with 2 PCs, 1 switch, and 1 router. Configure DHCP and DNS on the router, then label every component and connection. <!-- id: it-03-t07 band: deep energy: normal -->
8. Write a step-by-step troubleshooting guide for "connected to Wi-Fi but no internet", covering physical checks, IP configuration, DNS, and firewall considerations. <!-- id: it-03-t08 band: focused energy: normal -->

## Deliverable / proof of work

Create `portfolio/it/03-networking-basics.md` with:

- Home network diagram
- Packet Tracer screenshot
- Wireshark DNS screenshot
- Table of 20 common ports
- Troubleshooting write-up for no internet

## Quiz

Fourteen questions on the material in this phase. Each has one correct answer and a short explanation — read the explanation even when you get it right, because it usually names the mistake the wrong answers represent.

Parts of this phase asked you to *recall* things from nothing. This asks you to *recognise* the right answer among plausible alternatives, which is how a ticket or an interview will actually test it. Several questions here are the arithmetic from Part 6 done on numbers you have not seen before — that is deliberate, because the point of subnetting is being able to do it on an address you were handed rather than the one in the example.

### Q1. A user's Wi-Fi shows "Connected" but nothing loads. `ipconfig` reports `169.254.14.7`. What is the actual problem? <!-- id: it-03-q01 energy: normal -->

- [ ] The DNS server is unreachable
- [ ] The Wi-Fi password is wrong
- [x] The device never got a DHCP lease
- [ ] The gateway is down

**Why:** A `169.254` address is the address a device gives *itself* when DHCP does not answer. It is not "no internet" — it is "no DHCP", which is a much narrower thing to investigate.

### Q2. You need to know whether a DNS problem is your resolver's fault or the domain's. Which comparison answers that? <!-- id: it-03-q02 energy: normal -->

- [ ] `ping google.com` twice to check for packet loss
- [ ] `ipconfig /all` against `ipconfig /displaydns`
- [ ] `tracert google.com` against `tracert 8.8.8.8`
- [x] `nslookup google.com` against `nslookup google.com 8.8.8.8`

**Why:** The second form asks a *specific* server. If your local resolver and `8.8.8.8` disagree, the domain is fine and your resolver is the fault. `tracert` shows the path, not the translation.

### Q3. A `/27` subnet — how many usable host addresses does it give you? <!-- id: it-03-q03 energy: normal -->

- [x] 30
- [ ] 32
- [ ] 62
- [ ] 14

**Why:** `/27` is `255.255.255.224`, so the block size is `256 − 224 = 32`. Every subnet loses two addresses to the network and broadcast, so usable is `32 − 2 = 30`. Picking 32 forgets those two; 62 is `/26`; 14 is `/28`.

### Q4. Which port would you check first for a Windows file-share problem? <!-- id: it-03-q04 energy: low -->

- [ ] 3389
- [ ] 143
- [x] 445
- [ ] 22

**Why:** 445 is SMB, which carries Windows file and printer sharing. 3389 is RDP (remote desktop), 143 is IMAP (mail), 22 is SSH.

### Q5. `ping 8.8.8.8` succeeds but `ping google.com` fails. What does that pair prove? <!-- id: it-03-q05 energy: normal -->

- [x] The network is fine and DNS is broken
- [ ] There is no connectivity at all
- [ ] The gateway is misconfigured
- [ ] The firewall is blocking ICMP

**Why:** `8.8.8.8` proves routing and upstream work with no DNS involved. Adding the name and failing isolates the break to name resolution — which is why this is the phase's most valuable single diagnostic.

### Q6. A user says a site shows "Your connection is not private". Which is the LEAST likely cause? <!-- id: it-03-q06 energy: high -->

- [ ] An expired certificate on the site
- [ ] The laptop's system clock is wrong
- [ ] A corporate proxy inspecting traffic
- [x] The laptop has a virus

**Why:** Certificate errors are a specific, diagnosable class: expiry, a wrong clock, a captive portal, or an inspecting proxy. Reaching for "virus" skips the four things it almost always is.

### Q7. Which protocol guarantees delivery by numbering bytes, acknowledging receipt, and retransmitting losses? <!-- id: it-03-q07 energy: low -->

- [ ] UDP
- [x] TCP
- [ ] ICMP
- [ ] ARP

**Why:** TCP is connection-oriented and reliable — it opens with the `SYN`, `SYN-ACK`, `ACK` handshake and retransmits what is lost. UDP is best-effort by design; ICMP carries diagnostics; ARP maps IP to MAC.

### Q8. You are handed `192.168.10.100/26`. What is the broadcast address? <!-- id: it-03-q08 energy: high -->

- [ ] 192.168.10.255
- [ ] 192.168.10.128
- [x] 192.168.10.127
- [ ] 192.168.10.63

**Why:** `/26` has a block size of 64, so the subnets are `.0`, `.64`, `.128`, `.192`. The address `.100` sits inside the `.64` block, which runs `.64`–`.127`. The last address in a block is the broadcast. `.255` assumes a `/24`; `.63` is the broadcast of the *previous* subnet — the classic off-by-one-block error.

### Q9. What does `Test-NetConnection google.com -Port 443` tell you that `ping google.com` does not? <!-- id: it-03-q09 energy: normal -->

- [x] Whether the specific port is actually answering
- [ ] Whether the site's certificate is valid
- [ ] Whether DNS resolution is working at all
- [ ] The physical route to the server

**Why:** `ping` proves the host answers ICMP; it says nothing about whether the *service* is listening. `Test-NetConnection` reports DNS resolution, the resolved IP, reachability, and the port state in one command — which is why the phase calls it the most useful modern Windows command.

### Q10. A subnet mask is always which of these? <!-- id: it-03-q10 energy: low -->

- [ ] A run of `0`s followed by a run of `1`s
- [x] A run of `1`s followed by a run of `0`s, with no gaps
- [ ] Any arrangement of 32 bits
- [ ] Always `255.255.255.0`

**Why:** The leading `1`s identify the network portion and the trailing `0`s the host portion, with no gap between them. That no-gaps rule is what makes CIDR notation possible at all — a slash and a count would be meaningless otherwise.

### Q11. A device is hand-configured with the address `192.168.1.0` on a `/24` network. What happens? <!-- id: it-03-q11 energy: normal -->

- [ ] It works, but with no internet access
- [ ] It works and takes the gateway's role
- [ ] It gets a duplicate-address warning and is reassigned by DHCP
- [x] It cannot communicate, and the failure looks arbitrary

**Why:** `.0` is the *network address* — it names the subnet itself and no device may hold it. This is the phase's argument for doing the arithmetic before setting a static IP, because the resulting fault does not obviously point at its own cause.

### Q12. Which tool maps a hostname to its IPv4 address? <!-- id: it-03-q12 energy: low -->

- [x] An `A` record
- [ ] An `MX` record
- [ ] A `CNAME` record
- [ ] A `TXT` record

**Why:** `A` maps a name to an IPv4 address. `AAAA` does the same for IPv6, `CNAME` is an alias to another name, `MX` says where mail goes, and `TXT` carries arbitrary text.

### Q13. `ipconfig /renew` alone did not fix a missing DHCP lease. Why does the phase tell you to run `release` first? <!-- id: it-03-q13 energy: normal -->

- [ ] `release` clears the DNS cache
- [ ] `renew` is deprecated without it
- [x] `renew` alone often just re-uses the existing lease
- [ ] `release` resets the network adapter driver

**Why:** The order matters because `renew` can hand back the same lease it already holds. `release` gives the address up first, which is what forces a fresh exchange. Neither touches the DNS cache — that is `ipconfig /flushdns`.

### Q14. In the phase's fixed troubleshooting order, which layer comes immediately after checking IP configuration? <!-- id: it-03-q14 energy: normal -->

- [x] The gateway
- [ ] Name resolution
- [ ] The application
- [ ] The specific service's port

**Why:** The order is physical/link → IP configuration → gateway → name resolution → the service's port → the application. Gateway comes before DNS because if the router is unreachable, nothing upstream can work regardless of what DNS says.

## Checklist

- [ ] I can explain LAN, WAN, router, switch, modem, firewall, and access point. <!-- id: it-03-c01 energy: low -->
- [ ] I can explain IPv4 address, subnet mask, gateway, DNS, and DHCP. <!-- id: it-03-c02 energy: low -->
- [ ] I understand IPv6 basics and AAAA DNS records. <!-- id: it-03-c03 energy: low -->
- [ ] I memorized at least 20 common ports. <!-- id: it-03-c04 energy: low -->
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
