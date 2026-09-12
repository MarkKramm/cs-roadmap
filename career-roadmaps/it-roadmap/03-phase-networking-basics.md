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

## Lesson: Networking Basics

### Introduction

Networking is the backbone of IT support. Understanding how devices communicate over networks is essential for troubleshooting common issues like no internet, slow connections, and DNS problems. This lesson will guide you through core networking concepts, IP addressing, name resolution, and troubleshooting techniques.

## Estimated time

**4 weeks**. Networking is deep, so be honest: 2 weeks is usually not enough for a beginner.

### Step-by-Step Breakdown

#### Core Network Concepts

- **LAN (Local Area Network):** A network confined to a small area, like a home or office.
- **WAN (Wide Area Network):** A network spread over a large geographic area, like the internet.
- **Internet:** The global system connecting millions of networks.
- **Router:** Connects multiple networks and routes data between them.
- **Switch:** Connects devices within a LAN and directs traffic.
- **Modem:** Converts signals between your network and the internet.
- **Firewall:** Protects the network from unauthorized access.
- **Access Point:** Provides Wi-Fi connectivity within a network.
- **ISP (Internet Service Provider):** Provides internet access to users.

- **Client, Server, Peer-to-Peer:**
  - **Client:** A device that requests services or resources from a server.
  - **Server:** A device that provides services or resources to clients.
  - **Peer-to-Peer:** Devices share resources directly without a central server.

#### IP Addressing

- **IPv4 Address:** A 32-bit address format, e.g., `192.168.1.10`.
- **Private IP Ranges:**
  - `10.0.0.0/8`
  - `172.16.0.0/12`
  - `192.168.0.0/16`
- **Subnet Mask:** Defines the network portion of an IP address, e.g., `255.255.255.0` or `/24`.
- **Default Gateway:** The IP address of the router that connects your network to other networks.
- **Static IP vs Dynamic IP:**
  - **Static IP:** Manually assigned and does not change.
  - **Dynamic IP:** Assigned automatically by a DHCP server.

- **IPv6 Basics:**
  - **Why IPv6?** To address the limitation of IPv4.
  - **Format:** Uses hexadecimal notation, e.g., `2001:0db8:85a3:0000:0000:8a2e:0370:7334`.
  - **Link-Local Addresses:** Used for local communication within a network.

### Name Resolution and Services

- **DNS (Domain Name System):** Translates domain names to IP addresses.
  - **Records:**
    - **A:** Maps domain to IPv4 address.
    - **AAAA:** Maps domain to IPv6 address.
    - **CNAME:** Alias for another domain.
    - **MX:** Mail exchange server.
    - **TXT:** Text records for verification.
    - **NS:** Name server for the domain.

- **DHCP (Dynamic Host Configuration Protocol):** Automatically assigns IP addresses to devices.
  - **Process:**
    - **Discover:** Client broadcasts a request.
    - **Offer:** DHCP server offers an IP address.
    - **Request:** Client requests the offered IP.
    - **Acknowledge:** DHCP server confirms the assignment.

- **Common Ports:**
  - **20/21:** FTP (File Transfer Protocol)
  - **22:** SSH (Secure Shell)
  - **25:** SMTP (Simple Mail Transfer Protocol)
  - **53:** DNS
  - **67/68:** DHCP
  - **80:** HTTP (Hypertext Transfer Protocol)
  - **110:** POP3 (Post Office Protocol)
  - **143:** IMAP (Internet Message Access Protocol)
  - **443:** HTTPS (HTTP Secure)
  - **445:** SMB (Server Message Block)
  - **3389:** RDP (Remote Desktop Protocol)

- **TCP vs UDP:**
  - **TCP (Transmission Control Protocol):** Connection-oriented, reliable, used for data integrity (e.g., web browsing).
  - **UDP (User Datagram Protocol):** Connectionless, faster, used for real-time applications (e.g., video streaming).

- **TLS/HTTPS Basics:**
  - **TLS (Transport Layer Security):** Encrypts data between client and server.
  - **HTTPS:** Secure version of HTTP using TLS.

### Troubleshooting Flow

- **Check Physical Connection/Wi-Fi:** Ensure cables are connected and Wi-Fi is enabled.
- **Check IP Address:** Use `ipconfig` (Windows) or `ifconfig` (Linux/Mac) to verify IP settings.
- **Check Gateway:** Ensure the gateway IP is correct.
- **Check DNS:** Use `nslookup` to verify DNS resolution.
- **Check Specific Site/Service:** Test connectivity to specific websites or services.
- **Check Firewall/VPN/Proxy:** Ensure no restrictions are blocking traffic.
- **Document Findings:** Record all steps and observations for future reference.

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

## Hands-on Tasks

#### Task 1: Draw Your Home Network
1. Use **diagrams.net** to draw your current home network.
   - Include ISP modem/router, devices (laptop, phone, etc.), Wi-Fi access points, and connections.

#### Task 2: Check IP Configuration
1. Open **Command Prompt** (Windows) or **Terminal** (Linux/Mac) and run:
   - **Windows:** `ipconfig /all`
   - **Linux/Mac:** `ifconfig` or `ip a`
2. Identify:
   - IP address
   - Subnet mask
   - Default gateway
   - DHCP server
   - DNS server
   - MAC address

#### Task 3: Test Connectivity
1. Run `ping` to:
   - Your gateway (e.g., `ping 192.168.1.1`)
   - Public DNS server (e.g., `ping 1.1.1.1`)
   - Google’s DNS server (e.g., `ping 8.8.8.8`)
   - `google.com`
2. Explain the differences in responses.

#### Task 4: DNS Lookup
1. Run `nslookup` commands:
   - `nslookup google.com`
   - `nslookup -type=mx gmail.com`
   - `nslookup -type=txt google.com`
2. Document the results and explain what each command reveals.

#### Task 5: Capture DNS Traffic with Wireshark
1. Open **Wireshark** and capture traffic using the filter `dns`.
2. Identify a DNS query and explain how it resolves a domain name to an IP address.

#### Task 6: Capture TCP Handshake
1. Open **Wireshark** and capture traffic using the filter `tcp`.
2. Identify a TCP handshake between your device and a server (e.g., `google.com`).
3. Explain the three-way handshake process.

#### Task 7: Build a Packet Tracer Network
1. Open **Cisco Packet Tracer** and build a simple network with:
   - 2 PCs
   - 1 Switch
   - 1 Router
   - Configure DHCP and DNS on the router.
2. Label all components and connections.

#### Task 8: Write a Troubleshooting Guide
1. Create a step-by-step guide for troubleshooting the issue: “Connected to Wi-Fi but no internet.”
   - Include physical checks, IP configuration, DNS checks, and firewall considerations.

## Common Pitfalls

- **Ignoring Physical Connections:** Always check cables and Wi-Fi before diving into software.
- **Misinterpreting IP Addresses:** Ensure you understand the difference between private and public IPs.
- **Overlooking DNS Issues:** DNS problems can mimic internet connectivity issues.
- **Not Documenting Steps:** Always record your troubleshooting process for future reference.

## Resources

- **Practical Networking:** [https://www.practicalnetworking.net/](https://www.practicalnetworking.net/)
- **Cisco Networking Basics:** [https://skillsforall.com/course/networking-basics](https://skillsforall.com/course/networking-basics)
- **Cloudflare DNS Learning Center:** [https://www.cloudflare.com/learning/dns/](https://www.cloudflare.com/learning/dns/)
- **Wireshark Documentation:** [https://www.wireshark.org/docs/](https://www.wireshark.org/docs/)
- **Professor Messer Network+ Study Materials:** [https://www.professormesser.com/network-plus/](https://www.professormesser.com/network-plus/)

## Hands-on practice tasks

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
