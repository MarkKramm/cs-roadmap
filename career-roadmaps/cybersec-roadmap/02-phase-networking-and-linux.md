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

## Lesson: Networking and Linux for Cybersecurity

### Why this lesson exists

There is a sentence you will hear repeatedly in this field, and it is worth taking literally: **you cannot secure what you do not understand.** Networking and Linux are the two subjects that sentence points at hardest. Almost every security tool you will ever use is, underneath, either sending packets, reading packets, or reading a log file that recorded packets. Nmap sends crafted packets and interprets the replies. Wireshark is a packet viewer. A firewall is a rule engine over packets. A SIEM is a search engine over logs. If you cannot read the underlying protocol, all of these tools become magic boxes that produce output you can copy but not explain.

That gap — copying output versus explaining it — is exactly what separates candidates in interviews, and it is the phase's stated exit criterion: *you can look at a simple Nmap result or Wireshark capture and explain what service or protocol is involved.* That is a deliberately modest bar, and this lesson is written to get you over it with real understanding rather than memorised command flags.

**Why these two subjects together.** They are paired for a practical reason: Linux is where the networking becomes visible. On Windows, network configuration is buried in GUI dialogs, and logging is abstracted away. On Linux, you type `ip a` and see your interfaces, you type `ss -tulpn` and see every listening service with the process that owns it, and you read `/var/log/auth.log` to watch authentication attempts scroll past in real time. Linux gives you the observability that makes the concepts concrete. It is also, not coincidentally, the operating system that runs most of the internet's servers, most security tooling, and most CTF environments — so fluency with it compounds across everything that follows.

**Time to complete:** roughly 40–60 hours across the six weeks, and honestly, the longer side. This is the heaviest phase in the cyber track. The reading below is perhaps four hours of it; the rest is the nine practice tasks, the Bandit wargame, and the time you will spend being confused by subnetting before it suddenly clicks. Budget for that confusion — it is a normal part of learning this material, not a sign you are unsuited to it. Nearly everyone hits a wall at subnetting and again at permissions.

**Two notes on scope.** First, this lesson covers the *why* and the working mental models; it does not attempt to be the complete reference for either subject. The resources section lists Linux Journey, Practical Networking, and the Nmap book — use them alongside this, because repetition across sources is how this material actually sticks. Second, a safety note that carries over from Phase 1: every command here is safe against **your own virtual machines only**. `nmap -sV` against a VM you created is learning. The same command against an address you do not own is unauthorised access. The phase's tools table says "Scan your own VM only" for this reason, and it is not boilerplate.

### Part 1 — How networks are built: models, addresses, and layers

#### The two models, and why you need either

The **OSI model** has seven layers and the **TCP/IP model** has four (or five, depending on who is counting). Beginners often find this pointless until they see what the layers are *for*: they are a shared vocabulary for saying **where** a problem is.

| Layer (OSI) | What it handles | Example | If it breaks |
|---|---|---|---|
| 7 Application | The protocol users care about | HTTP, DNS, SSH | Wrong URL, bad request |
| 6 Presentation | Format, encryption | TLS, encoding | Certificate error |
| 5 Session | Managing conversations | Session setup | Connection drops |
| 4 Transport | Ports, reliability | TCP, UDP | Port closed, timeout |
| 3 Network | Logical addressing, routing | IP, ICMP | Cannot reach the host |
| 2 Data link | Local delivery | Ethernet, ARP, MAC | Cannot reach the gateway |
| 1 Physical | The wire, the radio | Cables, Wi-Fi | Nothing at all |

The practical value: when something fails, you ask *which layer?* "I cannot reach the server" is a layer 3 problem. "I can ping it but SSH is refused" is layer 4 — the host is reachable, the port is closed. "SSH connects but the certificate is wrong" is a layer 5–6 problem. "I cannot ping it but I can reach other things on my own network" is layer 2 — your local link works, routing does not.

For security work the mapping is even more useful. A firewall mostly filters layers 3 and 4. A web application firewall works at layer 7. ARP spoofing is a layer 2 attack. TLS interception is layer 6. When you read an incident report, the layer tells you which control failed.

The TCP/IP model collapses this into **Link → Internet → Transport → Application**. It is what the internet actually implements; OSI is the teaching model. Know both names, use whichever the conversation is using.

#### IP addresses, and the part everyone gets stuck on

An **IPv4 address** is 32 bits, written as four decimal numbers (`192.168.1.10`). Every address has two logical parts: a **network** portion and a **host** portion. The **subnet mask** — or its shorthand, the **CIDR** prefix — says where the split falls.

`192.168.1.10/24` means the first 24 bits (`192.168.1`) are the network and the last 8 bits are the host. So:

- Network address: `192.168.1.0` — identifies the network itself
- Usable hosts: `192.168.1.1` through `192.168.1.254` — 254 of them
- Broadcast address: `192.168.1.255` — sends to every host on the network at once

The reason `/24` gives 254 usable rather than 256 is that the first and last addresses are reserved. That "minus two" rule holds for every subnet, and it is worth internalising now.

**Doing the math for other prefixes.** The prefix tells you how many host bits remain: `32 − prefix`. `/25` leaves 7 bits, so `2^7 = 128` addresses, 126 usable. `/26` leaves 6 bits, 64 addresses, 62 usable. `/27` → 32 addresses, 30 usable. Each step up in prefix halves the block. The phase asks specifically for `/24`, `/25`, and `/26`, and that pattern — halve, subtract two — is all you need for those.

A `/25` splits a `/24` into two halves:

```text
192.168.1.0/25    → hosts .1   – .126   (broadcast .127)
192.168.1.128/25  → hosts .129 – .254   (broadcast .255)
```

Notice the `/25` boundary lands at `.128`, not at a round decimal number. That is because you are doing arithmetic in binary and reading it in decimal. This is the source of nearly all subnetting confusion: the numbers look arbitrary in decimal but are tidy in binary. If you write the last octet in binary, the pattern becomes obvious — `/25` is "the first bit of the last octet is the network part," so it splits at 128.

**Private ranges.** Three blocks are reserved for internal use and are not routable on the public internet:

- `10.0.0.0/8` — large organisations
- `172.16.0.0/12` — mid-size
- `192.168.0.0/16` — home and small office

Seeing `192.168.x.x` in a log tells you it is an internal address. This matters constantly in analysis: an internal address appearing as the source of an attack suggests a compromised insider machine rather than an external attacker.

**IPv6** is 128 bits, written in hexadecimal (`2001:0db8::1`). You do not need to master it in this phase, but you should know three things. First, the `::` shorthand means "one or more groups of zeros" — the address above is `2001:0db8:0000:0000:0000:0000:0000:0001`. Second, **link-local** addresses (`fe80::/10`) exist automatically on every interface and are how devices on the same segment find each other; **global unicast** (`2001::/16` range) are internet-routable. Third, and this is the security-relevant point: IPv6 was designed with enough address space that **NAT is not necessary**, so every device can have a real address. That removes a layer of accidental protection that IPv4 networks enjoy, and it is why IPv6 misconfiguration is a recurring security finding.

#### ARP, MAC addresses, and the layer-2 neighbourhood

Your machine sends data to another machine on the same local network by **MAC address** — a hardware identifier baked into the network card. To find the MAC for a given IP, it uses **ARP** (Address Resolution Protocol): it broadcasts "who has `192.168.1.1`?" and the owner replies with its MAC.

ARP has no authentication. Anyone on the segment can answer, and anyone can announce false mappings. This is the basis of **ARP spoofing**, where an attacker tells the network "the gateway's IP is at *my* MAC address," causing traffic to flow through the attacker. It is one of the clearest examples in networking of a protocol designed for a trusting environment being deployed in an untrusting one — a theme you will see repeatedly in security.

You can see your own ARP table with `ip neigh` on Linux or `arp -a` on Windows. Doing this once makes the concept concrete.

#### DNS, DHCP, and NAT: the three services that make everything else work

**DNS** (Domain Name System) translates names to addresses, and its record types are worth knowing by heart because they appear constantly in investigations:

| Record | Meaning | Security relevance |
|---|---|---|
| **A** | Name → IPv4 address | Where traffic actually goes |
| **AAAA** | Name → IPv6 address | Same, for IPv6 |
| **CNAME** | Alias to another name | Common in phishing infrastructure |
| **MX** | Mail server for the domain | Used to judge whether email *could* be legitimate |
| **TXT** | Arbitrary text | Holds SPF/DKIM/DMARC anti-spoofing records |
| **NS** | Authoritative nameservers | Who controls the domain |

The architecture matters too. A **recursive resolver** (your ISP's, or `8.8.8.8`, or `1.1.1.1`) does the legwork of asking around on your behalf. An **authoritative server** holds the real records for a domain and gives final answers. The distinction is useful in incident response because a hijacked or malicious resolver can lie to you while the authoritative record stays correct.

You can inspect all of this from a terminal, and the phase's task 5 asks you to. `dig example.com MX` returns the mail records; `dig example.com TXT` shows the anti-spoofing policy. Reading a real TXT record for a domain you care about is a small revelation — it shows you that email authentication is public information.

**DHCP** (Dynamic Host Configuration Protocol) hands out addresses automatically, through a four-step exchange known as **DORA**: Discover (client broadcasts "is anyone there?"), Offer (server proposes an address), Request (client asks for it), Acknowledge (server confirms). The security angle is that a rogue DHCP server can hand out a malicious gateway or DNS server, redirecting an entire network's traffic — which is why enterprise networks use **DHCP snooping**.

**NAT** (Network Address Translation) lets many private devices share one public address. Your home router rewrites outgoing packets so they appear to come from its public IP, and tracks which internal machine each reply belongs to. Two consequences worth holding: NAT is why your internal `192.168.1.10` is invisible from outside, and NAT is *not* a security control even though it behaves like one by accident. It is an address-conservation mechanism that happens to hide internal structure.

#### TCP, UDP, and ICMP

**TCP** is connection-oriented and reliable. It begins with the **three-way handshake**:

```text
Client → Server:  SYN       ("I would like to connect, my sequence starts here")
Server → Client:  SYN-ACK   ("Acknowledged, and here is mine")
Client → Server:  ACK       ("Acknowledged — connection established")
```

This handshake is the single most useful thing to understand for reading captures, and the phase's task 9 asks you to write it up. What it means in practice: a completed handshake proves the port is open and something is listening. A `SYN` that gets no reply means the port is filtered or the host is down. A `SYN` answered by `RST` (reset) means the host is alive but nothing is listening on that port — this is precisely how Nmap distinguishes open, closed, and filtered ports. Once you know the handshake, Nmap's output stops being arbitrary.

Teardown uses `FIN` or `RST`, either side can initiate, and TCP tracks state throughout so it can retransmit lost data and deliver in order.

**UDP** is connectionless and unreliable: no handshake, no ordering, no retransmission. That sounds like a downgrade, and for some uses it is exactly right — DNS lookups, video streaming, and voice calls all prefer speed over guaranteed delivery, because a retransmitted video frame arrives too late to matter. The security relevance: UDP's lack of handshake makes it easier to spoof, and UDP services are often overlooked in hardening because they are harder to scan reliably.

**ICMP** is the diagnostic protocol behind `ping` (echo request / echo reply) and the "destination unreachable" and "time exceeded" messages. It is how `traceroute` works, by sending packets with deliberately short lifetimes and listening for the resulting errors. Note that many networks block ICMP, so "ping fails" does not reliably mean "host is down" — a lesson that matters in both troubleshooting and reconnaissance.

#### Common ports, and HTTP

You should recognise these without looking them up; they appear in scans, logs, and firewall rules constantly:

| Port | Protocol | Notes |
|---:|---|---|
| 22 | SSH | Encrypted remote shell |
| 25 / 587 | SMTP | Mail sending; 587 is the submission port |
| 53 | DNS | Often UDP, TCP for large answers |
| 80 / 443 | HTTP / HTTPS | Web traffic |
| 139 / 445 | SMB | Windows file sharing; 445 is heavily attacked |
| 3389 | RDP | Windows remote desktop; a favourite ransomware entry point |

Two of these deserve emphasis. **Port 445 (SMB)** and **port 3389 (RDP)** exposed to the internet are among the most common causes of ransomware incidents in the world, because both are legitimate services that attackers can authenticate to. Seeing either open on an internet-facing host is a finding, not a curiosity — and this is exactly the kind of judgement the phase wants you to be able to make from an Nmap result.

**HTTP** is the protocol you already know from web development, so the security framing is what matters here. **Methods** (`GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`) describe intent; a server that accepts `DELETE` from anyone has an authorisation problem. **Status codes** group by first digit: `2xx` success, `3xx` redirect, `4xx` client error, `5xx` server error. In security work, `401` versus `403` distinguishes "not authenticated" from "authenticated but not permitted" — a real difference when you are testing access control. **Headers** carry metadata that matters: `Set-Cookie` (and whether it has `HttpOnly` and `Secure` flags), `Content-Security-Policy`, `Server` (which leaks software versions, useful to an attacker), and `Authorization`. **Cookies** are how sessions persist — which is why stealing a session cookie can bypass login entirely.

You can read all of this with `curl` (phase task 7's companion), and `curl -I https://example.com` printing real response headers is worth more than any description.

**TLS** is what makes HTTPS trustworthy. At beginner level, the useful mental model is: the server presents a **certificate** proving its identity, signed by a **certificate authority** the client already trusts; the two sides then negotiate keys and encrypt everything after. Two failure modes to know — an expired certificate is a configuration problem, while a **valid but wrong** certificate (right domain, so the browser is happy, but not the host you think you are talking to) is a potential interception. That distinction is why certificate inspection is a real investigative step rather than a formality.

Finally, **VPNs and proxies** both relay your traffic, for different reasons. A **VPN** encrypts a tunnel from your device to a server, hiding traffic from your local network and presenting a different source IP. A **proxy** forwards requests at the application layer; a **reverse proxy** does it on the server side, in front of the real application. Knowing which is which matters when analysing logs, because the address you see may be the relay rather than the origin — a recurring theme in incident investigation.

### Part 2 — Linux: the filesystem and permissions

#### The filesystem hierarchy, and why it is organised this way

Linux has no drive letters. Everything hangs off a single root, `/`, and the directories have conventional purposes:

```text
/       the root; everything is beneath this
/etc    configuration files — the first place to look
/var    variable data that grows: logs, mail, databases, web content
/home   user home directories
/root   the root user's home
/tmp    temporary files, world-writable, cleared on reboot
/bin    essential binaries; /usr/bin has the rest
/sbin   system administration binaries
/opt    optional third-party software
/proc   a virtual filesystem exposing kernel and process state
```

For security work, three of these are where you will spend most of your time. **`/etc`** holds configuration — `/etc/passwd` (user accounts), `/etc/shadow` (password hashes, readable only by root), `/etc/ssh/sshd_config` (SSH server configuration), `/etc/hosts`. **`/var/log`** holds the logs you will investigate. **`/tmp`** is world-writable, which makes it a favourite location for attackers to stage files, because anything can be written there.

Two properties of this layout are security-relevant in themselves. The separation of `/etc` from `/var` means configuration and data change at different rates and can be backed up and protected differently. And the convention that system binaries live in known paths (`/bin`, `/sbin`) is what allows integrity tools to detect tampering — if `/bin/ls` has changed, that is detectable only because its location is predictable.

#### Permissions: the part that takes practice

Every file has an owner, a group, and three sets of permissions. Reading `-rwxr-xr--`:

```text
-   rwx   r-x   r--
│    │     │     └── others:  read only
│    │     └──────── group:   read and execute
│    └────────────── owner:   read, write, execute
└─────────────────── type:    - file, d directory, l symlink
```

- **r** (read) — for a file, read its contents; for a directory, list its contents
- **w** (write) — for a file, modify it; for a directory, create or delete files *inside* it
- **x** (execute) — for a file, run it; for a directory, **enter** it

That last row is the one that trips people up, and it has a real security consequence: a directory with `w` but not `x` lets someone create files but not see what is there; a directory with `x` but not `r` lets someone access a file *if they already know its name* but not list the directory. Confusing these leads to permissions that look restrictive and are not.

**Numeric (octal) permissions** are the same information in shorthand. Each permission is a bit: read = 4, write = 2, execute = 1. Add them within each triad:

| Symbolic | Numeric | Meaning |
|---|---|---|
| `rwx` | 7 | 4 + 2 + 1 |
| `rw-` | 6 | 4 + 2 |
| `r-x` | 5 | 4 + 1 |
| `r--` | 4 | 4 |
| `---` | 0 | nothing |

So `chmod 755 script.sh` gives the owner full rights and everyone else read-and-execute. `chmod 600 id_rsa` gives only the owner read-and-write — which is exactly what SSH requires for a private key, and the reason you will see "permissions are too open" errors when you get it wrong. `chmod 644 file.txt` is the ordinary setting for a non-executable file.

Ownership changes with `chown user:group file`. Only root can give a file away to another user, which is a deliberate restriction.

**`sudo`** lets a permitted user run a command as root. It is the mechanism behind **least privilege** (Phase 1): instead of logging in as root, you work as a normal user and escalate only for the specific command that needs it. Every `sudo` invocation is logged, which is why it also serves the **accounting** part of AAA. Reading `/etc/sudoers` shows who has been granted what — and a common finding in security reviews is that far too many users are in the sudo group.

**The setuid bit** is worth knowing because it is a classic privilege-escalation vector. A file with setuid set runs with the *owner's* permissions rather than the caller's. If root owns a setuid binary and the binary can be made to run arbitrary commands, any user can become root. This is why enumeration of setuid binaries is a standard step in Linux privilege escalation.

#### Users, groups, and where they are recorded

```bash
whoami                 # who am I right now
id                     # my user id, group id, and group memberships
cat /etc/passwd        # all accounts; fields are name:x:UID:GID:comment:home:shell
sudo cat /etc/shadow   # password hashes — root only, and a key target for attackers
groups                 # the groups I belong to
```

Reading `/etc/passwd` carefully is a genuinely useful skill: the **UID** field tells you whether an account is a normal user (typically 1000+), a system account (below 1000), or root (0). Any account *other than root* with UID 0 is a backdoor, full stop. The final field — the **login shell** — is how service accounts are locked down: `/usr/sbin/nologin` means the account exists but cannot log in interactively. An account that should have `nologin` but has `/bin/bash` is a finding.

The phase's task 2 asks you to create two users and test permissions. Do that literally: create them, put them in a group, create a file, and then try to read it as the other user. Being *denied* by the system is the moment permissions stop being abstract.

### Part 3 — Linux: services, logs, and the command-line toolkit

#### SSH: the tool you will use daily

**SSH** gives you an encrypted shell on a remote machine. The server is `sshd` (the SSH *daemon* — a daemon is a background service), configured in `/etc/ssh/sshd_config`, and it listens on port 22 by default.

**Key-based authentication** replaces passwords with a cryptographic keypair: a **private key** that never leaves your machine and a **public key** you place on the server in `~/.ssh/authorized_keys`. The server challenges you to prove you hold the private key; it never sees it. This is stronger than a password because there is nothing to guess, phish, or reuse — and it is why production servers usually disable password authentication entirely.

```bash
ssh-keygen -t ed25519 -C "lab key"        # generate a keypair
ssh-copy-id user@192.168.1.50             # install the public key on the server
ssh user@192.168.1.50                     # connect
scp file.txt user@192.168.1.50:/tmp/      # copy a file over SSH
```

Two configuration items are worth recognising in `sshd_config` because they are the difference between a hardened and a vulnerable server: `PermitRootLogin` (should be `no` — direct root login is unnecessary when `sudo` exists) and `PasswordAuthentication` (should be `no` once keys work). Phase task 3 asks you to enable SSH in your VM and connect from your host; when you do, read the config file and see these settings for yourself.

#### systemctl: managing services

Modern Linux uses **systemd** to manage services, through `systemctl`:

```bash
systemctl status sshd        # is it running? recent log lines included
systemctl is-enabled sshd    # does it start at boot?
sudo systemctl start sshd
sudo systemctl stop sshd
sudo systemctl restart sshd
sudo systemctl enable sshd
```

A service that is `active (running)` but `disabled` will not survive a reboot — a distinction that causes real incidents. And the security relevance of this command is direct: **you cannot defend a host whose services you cannot enumerate.** Asking "what is running, and should it be?" is the first question of host hardening, and `systemctl list-units --type=service` answers it.

#### Logs: where the evidence lives

Logs are the raw material of detection and investigation, and Linux puts them in predictable places:

| Path | What it records |
|---|---|
| `/var/log/auth.log` | Authentication: logins, `sudo` use, SSH attempts (Debian/Ubuntu) |
| `/var/log/secure` | The same role on RHEL/CentOS family |
| `/var/log/syslog` | General system messages (Debian/Ubuntu) |
| `/var/log/messages` | General system messages (RHEL/CentOS) |
| `/var/log/apache2/`, `/var/log/nginx/` | Web server access and error logs |

`journalctl` queries the systemd journal, which on many distributions is where logs now primarily live:

```bash
journalctl -u sshd              # logs for the SSH service only
journalctl -u sshd --since "1 hour ago"
journalctl -p err               # errors and above
journalctl -f                   # follow live, like tail -f
```

A workflow worth adopting now: open one terminal running `journalctl -u sshd -f` on your VM, and try to SSH in from your host with the wrong username and then the wrong password. Watch the failures appear. Then use `grep` to pull the failed attempts out of `/var/log/auth.log`. That single exercise teaches log reading, SSH, and grep simultaneously — and it is the same pattern a SOC analyst uses all day, at larger scale.

Recognising what **failed SSH attempts look like** matters specifically, because brute-force attempts against internet-facing SSH are constant background noise:

```text
Failed password for invalid user admin from 203.0.113.45 port 51234 ssh2
Failed password for root from 203.0.113.45 port 51236 ssh2
Invalid user test from 203.0.113.45 port 51240 ssh2
```

The pattern — one source address, many usernames, rapid repetition — is a brute-force or spraying attempt. Seeing the same *source* trying many *usernames* is spraying; many passwords against one account is brute force. You learned both terms in Phase 1; this is what they look like in production.

#### The networking and text-processing toolkit

These commands are the core of the phase, and every one of them is worth running at least once:

**Networking:**

```bash
ip a                    # interfaces and their IP addresses
ip route                # the routing table — where does traffic go?
ip neigh                # the ARP table — IP-to-MAC mappings
ss -tulpn               # listening TCP/UDP ports with owning processes
dig example.com MX      # DNS records
dig +short example.com  # just the answer
curl -I https://example.com   # response headers only
ping -c 4 8.8.8.8       # four ICMP echoes
traceroute example.com  # the path packets take
```

`ss -tulpn` is broken down as: **t** CP, **u** DP, **l** istening, **p** rocesses, **n** umeric (do not resolve names). It is the Linux equivalent of a port scan against your own machine, and phase task 4 asks you to run it and identify every listening service. What you are looking for: anything listening on `0.0.0.0` (all interfaces, so reachable from the network) that you did not expect. A service bound to `127.0.0.1` is local-only and much safer. That single distinction — `0.0.0.0` versus `127.0.0.1` — is one of the most common security findings on Linux hosts.

**Text processing:**

```bash
grep "Failed password" /var/log/auth.log      # find matching lines
grep -c "Failed password" /var/log/auth.log   # count them
grep -i "error" app.log                       # case-insensitive
awk '{print $1, $9}' access.log               # print chosen columns
sed 's/old/new/g' file.txt                    # substitute text
command | grep pattern | wc -l                # pipes and counting
command > file.txt                            # redirect output to a file
command >> file.txt                           # append instead
```

The pipe (`|`) is the concept to internalise: it takes one command's output and makes it the next command's input, letting you build small tools from small tools. This works because Unix programs follow a convention — read text in, write text out — and that convention is why a security analyst can answer "how many distinct IPs failed to log in today?" with one line:

```bash
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head
```

Read that left to right: find failed passwords, extract the source IP column, sort, count unique, sort by count descending, show the top ten. That is a real investigation query, built from five small pieces, and it is the shape of most log analysis you will do. **`awk '{print $N}'` extracts the Nth whitespace-separated field** — that is the 90% of awk you need at this stage.

### Part 4 — Seeing it happen: packet capture and scanning

#### Wireshark and tcpdump

**Wireshark** is a graphical packet analyser; **tcpdump** is its command-line counterpart. Both read the same `.pcap` files, and both see what is actually on the wire rather than what a program claims to be doing.

```bash
sudo tcpdump -i eth0 -w capture.pcap        # capture to a file
sudo tcpdump -i eth0 port 53                # only DNS
sudo tcpdump -i eth0 -n 'tcp port 80'       # only HTTP, no name resolution
sudo tcpdump -r capture.pcap -nn            # read a saved capture
```

The single most valuable Wireshark skill is **display filters**, because a capture contains far more than you want to look at:

```text
dns                          show only DNS
http                         show only HTTP
tcp.port == 443              one port
ip.addr == 192.168.1.50      one host
tcp.flags.syn == 1           connection attempts
tcp.flags.reset == 1         resets — refused connections
```

Phase task 6 asks you to capture DNS and HTTP traffic. Do it deliberately: start the capture, run `dig example.com` and `curl -I https://example.com` in another terminal, stop the capture, and then find those packets. You will see the DNS query and its response as plain text — **DNS is unencrypted**, which is why anyone on the path can see every domain you look up, and why DNS-over-HTTPS exists. You will also see the TCP handshake for the HTTP connection, showing the three packets you read about in Part 1 actually happening.

For HTTP specifically, note the difference between `http` and `https` traffic in a capture: plain HTTP is fully readable, including URLs, headers, and any credentials sent; HTTPS shows the handshake and then encrypted bytes. This is the single clearest demonstration of why TLS matters, and it takes about two minutes to see for yourself.

**Following a TCP stream** (right-click a packet → Follow → TCP Stream) reconstructs a whole conversation. It is the fastest way to understand that "a connection" is really a sequence of packets, and it is a technique you will use constantly in analysis.

#### Nmap: reading a scan instead of just running one

**Nmap** sends packets and interprets the replies. The exit criterion for this phase is being able to explain a result, so the goal is understanding the output, not memorising flags.

```bash
nmap 192.168.1.50                 # default: are common ports open?
nmap -sV 192.168.1.50             # also identify service versions
nmap -p 22,80,443 192.168.1.50    # specific ports
nmap -sn 192.168.1.0/24           # ping sweep: which hosts are up?
nmap -O 192.168.1.50              # guess the operating system
```

Now the interpretation, which is the actual skill. Port states:

- **open** — something is listening and accepted the connection. A completed TCP handshake, or a UDP reply.
- **closed** — the host is reachable but nothing is listening. Nmap got a `RST` back. This is *information*: it proves the host is up.
- **filtered** — no reply at all. Something — usually a firewall — silently dropped the packet. You cannot tell whether the port is open behind the filter.
- **open|filtered** — Nmap cannot distinguish. Common with UDP, where the absence of a reply is ambiguous.

A worked example, of the kind you should be able to narrate after this phase:

```text
PORT     STATE  SERVICE  VERSION
22/tcp   open   ssh      OpenSSH 8.9p1 Ubuntu 3ubuntu0.1
80/tcp   open   http     Apache httpd 2.4.52
3306/tcp open   mysql    MySQL 8.0.32
```

What a defender should say about this: SSH is open, which is expected but should be key-only and not exposed publicly. HTTP is open with no HTTPS — traffic is unencrypted. **MySQL is listening on a network interface**, which is the real finding: a database should almost never be reachable from the network, only from the application that uses it. And `-sV` disclosed exact version numbers, which map directly to known CVEs — which is why version disclosure is itself a hardening item.

That paragraph is the level to aim for. It uses the port states, the service identification, and the security meaning together, and it comes from understanding rather than from a tool's summary line.

**Two safety points.** First, `-sV` and `-O` are noticeably more intrusive than a plain scan, and `-O` is unreliable. Second, and more importantly: scanning generates real, attributable traffic. Phase task 7 says "against your own VM IP only," and that restriction is absolute. Use `ip a` inside the VM to find its address, and confirm you are scanning a machine you created.

#### Putting the two together

The natural workflow, and the one to practise: scan with Nmap to find what is listening, then capture with Wireshark while you connect to a discovered service, then read the log that service wrote. Three views of the same event — the scanner's inference, the wire's truth, and the service's record. Understanding that these are three perspectives on one reality is a large part of what this phase is teaching.

### Part 5 — Lab setup and the learning path

#### VirtualBox and why you want virtual machines

A **virtual machine (VM)** is a complete computer running as software inside your real one, managed by a **hypervisor**. VirtualBox is the free hypervisor this phase assumes. The phase's task 1 is to install Ubuntu or Kali in VirtualBox, and both are free.

The reason VMs are non-negotiable here is not convenience; it is **safety and reversibility**. A VM can be snapshotted before you experiment and rolled back afterwards, so mistakes cost nothing. This is what makes it legitimate to learn about attacks: you are working on an isolated machine that is yours, with no risk of touching anything real. It is also why Kali — a Linux distribution preloaded with security tools — belongs in a VM rather than on your daily machine.

**Networking modes matter and are easy to get wrong.** VirtualBox offers several, and two are relevant: **NAT** (the VM can reach out, but your host cannot easily reach in — fine for browsing, awkward for SSH or scanning) and **Bridged** (the VM appears as another device on your real network with its own address — easy to connect to, but it is now visible to your actual network). For this phase's scanning and SSH tasks, **Host-only** or **Bridged** is usually what you want, because you need your host and the VM to reach each other. Check the VM's address with `ip a` inside it, and verify connectivity with `ping` before concluding anything is broken.

A note on resources, since the roadmap targets a modest machine: Ubuntu Server (no desktop) uses far less RAM than Ubuntu Desktop, and it is what you should use for the SSH and log tasks. Kali's desktop is heavier still. If you have 8 GB of RAM, running one VM at a time with 2–4 GB allocated is realistic; running two simultaneously will be painful.

#### OverTheWire Bandit: the best free Linux practice there is

**OverTheWire Bandit** (phase task 8, levels 0–10) is a free wargame that teaches Linux by making you use it. Each level is an SSH login to a server where the password for the next level is hidden somewhere, and finding it requires exactly the skills this phase covers: reading files, permissions, `grep`, pipes, and later `find` and encoding.

It is worth doing properly rather than looking up answers, and worth understanding *why* it works as a teaching tool: it gives you immediate, unambiguous feedback. Either you found the password or you did not, and no amount of theory substitutes for that. It also builds the habit of reading `man` pages and exploring a system you do not fully know — which is the actual job.

Two practical points. First, the deliverable explicitly says to record Bandit notes **without publishing passwords**. That is a professional habit, not a formality: publishing working credentials to a shared system is exactly the behaviour that would end an employment relationship. Second, expect to be stuck. Being stuck on a Bandit level for an hour and then solving it teaches more than ten levels solved by searching for hints.

#### Where this phase fits

Looking back, this phase exists to make Phase 3's material intelligible. Security fundamentals are largely about *how things fail*, and things fail in the layers and services described here. Looking forward, Phase 4's labs will hand you tools that only make sense once you can read a port list, a packet capture, and an auth log — which is precisely what the exit criteria measure. If Phase 4 feels overwhelming when you reach it, the usual cause is a rushed Phase 2.

### Key takeaways

- **The layered models are a diagnostic vocabulary.** When something fails, ask which layer — that question alone resolves most confusion.
- **A CIDR prefix splits network from host.** Each step up halves the block; usable hosts are always total minus two. Write the last octet in binary and subnetting stops looking arbitrary.
- **DNS record types are investigative currency** — A, AAAA, CNAME, MX, TXT, and NS. TXT holds the anti-spoofing policy and is publicly readable.
- **TCP's three-way handshake explains Nmap's output.** Completed handshake = open; `RST` = closed (host is up); silence = filtered. Learn the handshake and port states stop being arbitrary.
- **Ports 445 (SMB) and 3389 (RDP) exposed to the internet are a finding**, not a curiosity. So is MySQL or any database reachable from the network.
- **Permissions are rwx plus a target.** Read/write/execute mean different things on a directory than on a file, and `x` on a directory means *enter*.
- **`ss -tulpn` is a self-scan, and `0.0.0.0` versus `127.0.0.1` is the finding.** A service bound to all interfaces is reachable from the network; one bound to localhost is not.
- **`/etc/passwd` UID 0 is root, and nothing else should be.** A non-root account with UID 0 is a backdoor; a service account with `/bin/bash` where `nologin` belongs is a misconfiguration.
- **Failed SSH attempts show a recognisable pattern**, and the source-versus-username shape distinguishes spraying from brute force — both terms from Phase 1, now visible in real logs.
- **Pipes build small tools into real investigations.** `grep | awk | sort | uniq -c | sort -rn | head` is a genuine top-talkers query, not a toy example.
- **DNS and plain HTTP are readable on the wire.** Seeing that in Wireshark is the fastest way to understand what TLS protects.
- **VMs make learning safe and reversible.** Snapshot first; the point is that mistakes cost nothing.
- **Bandit gives unambiguous feedback**, which is why it teaches faster than reading. Doing it honestly, without looking up answers, is the whole value.

### Practice this next

The nine tasks are ordered roughly as a progression, and this is the reasoning behind that order:

1. **Build the lab first** (task 1), because nothing else is possible without it. Get Ubuntu Server running in VirtualBox, confirm you can log in, run `ip a` and note the address. If networking is fiddly, fix it now rather than during the scanning tasks.
2. **Then permissions** (task 2), because they are the foundation of Linux security thinking. Create two users, put them in a group, create a file, and try to read it as the wrong user. Read `/etc/passwd` and find the UID field. Being denied access is the lesson.
3. **Then SSH** (task 3), which turns your VM into a remote system you can work with comfortably. Set up keys, not just passwords, and read `/etc/ssh/sshd_config` while you are there.
4. **Run `ss -tulpn` and identify every listener** (task 4). For each one, decide whether it *should* be listening and whether it is bound to all interfaces. This is host hardening in miniature.
5. **Then DNS** (task 5). Run `dig` for A, AAAA, MX, TXT, and NS on a domain you care about, and read the TXT record to see the anti-spoofing policy. This connects the abstract record table to something real.
6. **Then the capture** (task 6). Start Wireshark, generate DNS and HTTP traffic, and find those packets. This is the task that makes Part 4 concrete, and it is worth doing slowly — do not move on until you can point at the handshake packets and say what each one is doing.
7. **Nmap against your own VM** (task 7), and then do the part the task does not spell out: **write down what each open port means and which one you would flag**. `-sV` and plain scan, and narrate the result the way the worked example in Part 4 does.
8. **Bandit 0–10 throughout the phase** (task 8), not in one sitting. It is deliberately the task that spans the whole six weeks — start it in week two and let it run in parallel. Record notes as you go, but never the passwords.
9. **Write the TCP handshake mini-report last** (task 9), once the capture work has given you the material. Follow the deliverable's structure and keep it short. If you can explain the handshake from your own capture — including why the packets are in that order and what each one proves — the exit criteria are met and Phase 3 will make sense.

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
