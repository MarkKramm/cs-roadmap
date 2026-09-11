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

1. Draw your current home network: ISP modem/router, devices, Wi-Fi, phone, laptop.
2. Run `ipconfig /all` and identify IP, subnet mask, gateway, DHCP server, DNS server, MAC address.
3. Run `ping` to your gateway, `1.1.1.1`, and `google.com`; explain differences.
4. Run `nslookup google.com`, `nslookup -type=mx gmail.com`, and `nslookup -type=txt google.com`.
5. Capture a DNS query in Wireshark using filter `dns`.
6. Capture a TCP handshake in Wireshark using filter `tcp`.
7. Build a Packet Tracer network with 2 PCs, 1 switch, 1 router, DHCP, and DNS labels.
8. Write a troubleshooting guide for “connected to Wi-Fi but no internet.”

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
