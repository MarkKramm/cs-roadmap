---
id: cyber-02-networking-and-linux
track: cyber
phase: 2
order: 20
title: "Phase 2 — Networking and Linux for Cybersecurity"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/cyber/02-networking-linux.md"
exit_criteria: "You can look at a simple Nmap result or Wireshark capture and explain what service/protocol is involved."
---

# Phase 2 — Networking and Linux for Cybersecurity

## Goal of this phase

Deepen networking and Linux skills enough to understand scans, logs, shells, services, and traffic analysis.

## Estimated time

**6 weeks**. This overlaps with IT networking/Linux, but cyber requires more depth.

## Skills you'll gain

- Understand IPv4, IPv6 basics, subnetting, DNS, DHCP, NAT, TCP/UDP, ICMP, TLS, HTTP, and common ports.
- Use Linux confidently for files, permissions, processes, services, SSH, logs, and networking.
- Capture and explain network traffic with Wireshark/tcpdump.
- Use Nmap safely against your own lab targets.

## Specific topics to learn

### Networking depth

- OSI and TCP/IP models
- Ethernet, ARP, MAC addresses
- IPv4 addressing and `/24`, `/25`, `/26` basics
- IPv6 basics: link-local, global unicast, AAAA records, why NAT is less central
- DNS: A, AAAA, CNAME, MX, TXT, NS, recursive resolver, authoritative server
- DHCP process
- TCP handshake and connection teardown
- UDP use cases
- ICMP and ping
- HTTP methods/status codes/headers/cookies
- TLS certificates at a beginner level
- VPN and proxy basics

### Linux depth

- Filesystem hierarchy
- Permissions: rwx, numeric permissions, ownership
- Users/groups/sudo
- SSH keys and `sshd`
- Services with `systemctl`
- Logs with `journalctl`, `/var/log/auth.log`, `/var/log/syslog`
- Networking: `ip a`, `ip route`, `ss -tulpn`, `dig`, `curl`
- Text processing: `grep`, `awk` basics, `sed` basics, pipes/redirection

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Ubuntu VM | Linux lab OS | Free | https://ubuntu.com/download | Create users, SSH, read logs | Debian VM |
| Kali Linux VM | Security-focused Linux | Free | https://www.kali.org/ | Use built-in Nmap/Wireshark in lab | Ubuntu + installed tools |
| Wireshark | Packet analysis | Free | https://www.wireshark.org/ | Capture DNS, HTTP, TCP handshake | tcpdump |
| tcpdump | CLI packet capture | Free/open-source | https://www.tcpdump.org/ | Capture 20 packets to pcap | Wireshark GUI |
| Nmap | Network scanner | Free/open-source | https://nmap.org/ | Scan your own VM only | RustScan free, but Nmap is standard |
| OpenSSH | Remote shell | Free/open-source | https://www.openssh.com/ | SSH from host to VM | PuTTY |
| curl | HTTP testing | Free/open-source | https://curl.se/ | Request headers from a site | Browser dev tools |

## Free/cheap resources

- Linux Journey — https://linuxjourney.com/
- OverTheWire Bandit — https://overthewire.org/wargames/bandit/
- Practical Networking — https://www.practicalnetworking.net/
- Wireshark docs — https://www.wireshark.org/docs/
- Nmap book/reference — https://nmap.org/book/man.html
- MDN HTTP overview — https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview

## Hands-on practice tasks

1. Install Ubuntu or Kali in VirtualBox.
2. Create two Linux users and test file permissions.
3. Enable SSH in your VM and connect from your host.
4. Run `ss -tulpn` and identify listening services.
5. Use `dig` or `nslookup` to inspect A, AAAA, MX, TXT records.
6. Capture DNS and HTTP traffic with Wireshark.
7. Run `nmap -sV` against your own VM IP only.
8. Complete OverTheWire Bandit levels 0–10.
9. Write a mini-report explaining one TCP handshake capture.

## Deliverable / proof of work

Create `portfolio/cyber/02-networking-linux.md` with:

- Linux command cheat sheet
- Nmap scan result against your own VM
- Wireshark DNS/TCP screenshots
- SSH setup notes
- Bandit 0–10 notes without publishing passwords

## Checklist

- [ ] I can explain OSI/TCP-IP models. <!-- id: cyber-02-c01 energy: low -->
- [ ] I understand IPv4, IPv6 basics, DNS, DHCP, NAT, TCP, UDP, ICMP, HTTP, TLS. <!-- id: cyber-02-c02 energy: low -->
- [ ] I can use Linux permissions and users. <!-- id: cyber-02-c03 energy: normal -->
- [ ] I can SSH into my own VM. <!-- id: cyber-02-c04 energy: normal -->
- [ ] I can use Nmap safely on my own lab. <!-- id: cyber-02-c05 energy: normal -->
- [ ] I captured and explained DNS traffic. <!-- id: cyber-02-c06 energy: normal -->
- [ ] I completed Bandit levels 0–10. <!-- id: cyber-02-c07 energy: normal -->

## You're ready to move on when...

You can look at a simple Nmap result or Wireshark capture and explain what service/protocol is involved.

## Free vs Paid

### What's free and enough

Ubuntu, Kali, Nmap, Wireshark, tcpdump, OverTheWire, and docs are enough.

### What's paid and why you'd upgrade

Paid labs provide convenience and guided targets, but local labs are enough here.

### When it's worth paying

Not yet. Finish this phase before considering TryHackMe Premium.
