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

#### You cannot secure what you do not understand

There is a sentence you will hear repeatedly in this field, and it is worth taking literally: **you cannot secure what you do not understand.**

Networking and Linux are the two subjects that sentence points at hardest. Almost every security tool you will ever use is, underneath, one of three things. It sends packets, it reads packets, or it reads a log file that recorded packets.

| Tool | What it actually is |
|---|---|
| Nmap | Sends crafted packets and interprets the replies |
| Wireshark | A packet viewer |
| A firewall | A rule engine over packets |
| A SIEM | A search engine over logs |

If you cannot read the underlying protocol, all of these tools become magic boxes. They produce output you can copy but not explain.

#### Copying output versus explaining it

That gap — copying output versus explaining it — is exactly what separates candidates in interviews. It is also the phase's stated exit criterion: *you can look at a simple Nmap result or Wireshark capture and explain what service or protocol is involved.*

That is a deliberately modest bar. This lesson is written to get you over it with real understanding rather than memorised command flags.

#### Why these two subjects together

They are paired for a practical reason: Linux is where the networking becomes visible.

On Windows, network configuration is buried in GUI dialogs, and logging is abstracted away. On Linux, you type `ip a` and see your interfaces. You type `ss -tulpn` and see every listening service with the process that owns it. You read `/var/log/auth.log` to watch authentication attempts scroll past in real time.

Linux gives you the observability that makes the concepts concrete. It is also, not coincidentally, the operating system that runs most of the internet's servers, most security tooling, and most CTF environments. Fluency with it compounds across everything that follows.

#### How the time breaks down

| What | Time | Note |
|---|---|---|
| Reading this lesson | ~4 hours | The thinking, not the practice |
| Nine practice tasks | 25–40 hours | The bulk of the phase |
| Bandit wargame | 8–15 hours | Runs across all six weeks |
| Being confused by subnetting | Counts as progress | Nearly everyone hits this wall |
| Total | 40–60 hours across 6 weeks | The heaviest phase in the cyber track |

Budget honestly: this is the longer side, and it is the heaviest phase in the cyber track. Budget for the confusion too — subnetting and permissions are where nearly everyone hits a wall. That is a normal part of learning this material, not a sign you are unsuited to it.

#### Two notes on scope

First, this lesson covers the *why* and the working mental models. It does not attempt to be the complete reference for either subject. The resources section lists Linux Journey, Practical Networking, and the Nmap book — use them alongside this. Repetition across sources is how this material actually sticks.

Second, a safety note that carries over from Phase 1: every command here is safe against **your own virtual machines only**.

| Command | Against your own VM | Against an address you do not own |
|---|---|---|
| `nmap -sV` | Learning | Unauthorised access |
| `tcpdump` on your own interface | Learning | Potentially unlawful interception |
| `ssh user@your-vm` | Learning | Unauthorised access |

The phase's tools table says “Scan your own VM only” for this reason, and it is not boilerplate.

### Part 1 — How networks are built: models, addresses, and layers

#### The two models, and why you need either

The **OSI model** has seven layers. The **TCP/IP model** has four, or five, depending on who is counting.

Beginners often find this pointless until they see what the layers are *for*. They are a shared vocabulary for saying **where** a problem is.

| Layer (OSI) | What it handles | Example | If it breaks |
|---|---|---|---|
| 7 Application | The protocol users care about | HTTP, DNS, SSH | Wrong URL, bad request |
| 6 Presentation | Format, encryption | TLS, encoding | Certificate error |
| 5 Session | Managing conversations | Session setup | Connection drops |
| 4 Transport | Ports, reliability | TCP, UDP | Port closed, timeout |
| 3 Network | Logical addressing, routing | IP, ICMP | Cannot reach the host |
| 2 Data link | Local delivery | Ethernet, ARP, MAC | Cannot reach the gateway |
| 1 Physical | The wire, the radio | Cables, Wi-Fi | Nothing at all |

#### Asking “which layer?” when something fails

The practical value is diagnostic. When something fails, you ask *which layer?*

| Symptom | Layer | What it means |
|---|---|---|
| “I cannot reach the server” | 3 | A routing or addressing problem |
| “I can ping it but SSH is refused” | 4 | The host is reachable, the port is closed |
| “SSH connects but the certificate is wrong” | 5–6 | Session or encryption problem |
| “I cannot ping it but I can reach other things on my own network” | 2 | Your local link works, routing does not |

For security work the mapping is even more useful.

| Control or attack | Layer |
|---|---|
| A firewall | Mostly 3 and 4 |
| A web application firewall | 7 |
| ARP spoofing | 2 |
| TLS interception | 6 |

When you read an incident report, the layer tells you which control failed.

The TCP/IP model collapses this into **Link → Internet → Transport → Application**. It is what the internet actually implements. OSI is the teaching model. Know both names, and use whichever the conversation is using.

#### IP addresses, and the part everyone gets stuck on

An **IPv4 address** is 32 bits, written as four decimal numbers (`192.168.1.10`). Every address has two logical parts: a **network** portion and a **host** portion.

The **subnet mask** — or its shorthand, the **CIDR** prefix — says where the split falls. `192.168.1.10/24` means the first 24 bits (`192.168.1`) are the network and the last 8 bits are the host.

| Address | Role |
|---|---|
| `192.168.1.0` | Network address — identifies the network itself |
| `192.168.1.1` through `192.168.1.254` | Usable hosts — 254 of them |
| `192.168.1.255` | Broadcast address — sends to every host on the network at once |

The reason `/24` gives 254 usable rather than 256 is that the first and last addresses are reserved. That “minus two” rule holds for every subnet, and it is worth internalising now.

#### Worked example: doing the math for other prefixes

The prefix tells you how many host bits remain: `32 − prefix`.

| Prefix | Host bits | Total addresses | Usable hosts | Calculation |
|---|---|---|---|---|
| `/24` | 8 | 256 | 254 | `2^8 = 256`, minus 2 |
| `/25` | 7 | 128 | 126 | `2^7 = 128`, minus 2 |
| `/26` | 6 | 64 | 62 | `2^6 = 64`, minus 2 |
| `/27` | 5 | 32 | 30 | `2^5 = 32`, minus 2 |

Each step up in prefix halves the block. The phase asks specifically for `/24`, `/25`, and `/26`, and that pattern — halve, subtract two — is all you need for those.

A `/25` splits a `/24` into two halves:

```text
192.168.1.0/25    → hosts .1   – .126   (broadcast .127)
192.168.1.128/25  → hosts .129 – .254   (broadcast .255)
```

Notice the `/25` boundary lands at `.128`, not at a round decimal number. That is because you are doing arithmetic in binary and reading it in decimal.

This is the source of nearly all subnetting confusion. The numbers look arbitrary in decimal but are tidy in binary. If you write the last octet in binary, the pattern becomes obvious — `/25` is “the first bit of the last octet is the network part,” so it splits at 128.

#### Private ranges and what they tell you

Three blocks are reserved for internal use and are not routable on the public internet.

| Range | Typical use |
|---|---|
| `10.0.0.0/8` | Large organisations |
| `172.16.0.0/12` | Mid-size |
| `192.168.0.0/16` | Home and small office |

Seeing `192.168.x.x` in a log tells you it is an internal address. This matters constantly in analysis: an internal address appearing as the source of an attack suggests a compromised insider machine rather than an external attacker.

#### IPv6: the three things you actually need

**IPv6** is 128 bits, written in hexadecimal (`2001:0db8::1`). You do not need to master it in this phase, but you should know three things.

| Thing to know | Detail |
|---|---|
| The `::` shorthand | Means “one or more groups of zeros.” The address above is `2001:0db8:0000:0000:0000:0000:0000:0001` |
| Link-local vs global unicast | **Link-local** (`fe80::/10`) exists automatically on every interface and is how devices on the same segment find each other. **Global unicast** (`2001::/16` range) are internet-routable |
| The security-relevant point | IPv6 was designed with enough address space that **NAT is not necessary**, so every device can have a real address |

That last point removes a layer of accidental protection that IPv4 networks enjoy. It is why IPv6 misconfiguration is a recurring security finding.

#### ARP, MAC addresses, and the layer-2 neighbourhood

Your machine sends data to another machine on the same local network by **MAC address** — a hardware identifier baked into the network card.

To find the MAC for a given IP, it uses **ARP** (Address Resolution Protocol). It broadcasts “who has `192.168.1.1`?” and the owner replies with its MAC.

ARP has no authentication. Anyone on the segment can answer, and anyone can announce false mappings. This is the basis of **ARP spoofing**, where an attacker tells the network “the gateway's IP is at *my* MAC address,” causing traffic to flow through the attacker.

It is one of the clearest examples in networking of a protocol designed for a trusting environment being deployed in an untrusting one — a theme you will see repeatedly in security.

You can see your own ARP table with `ip neigh` on Linux or `arp -a` on Windows. Doing this once makes the concept concrete.

#### DNS record types you should know by heart

**DNS** (Domain Name System) translates names to addresses. Its record types appear constantly in investigations.

| Record | Meaning | Security relevance |
|---|---|---|
| **A** | Name → IPv4 address | Where traffic actually goes |
| **AAAA** | Name → IPv6 address | Same, for IPv6 |
| **CNAME** | Alias to another name | Common in phishing infrastructure |
| **MX** | Mail server for the domain | Used to judge whether email *could* be legitimate |
| **TXT** | Arbitrary text | Holds SPF/DKIM/DMARC anti-spoofing records |
| **NS** | Authoritative nameservers | Who controls the domain |

#### Recursive resolvers versus authoritative servers

The architecture matters too.

| Role | What it does | Examples |
|---|---|---|
| **Recursive resolver** | Does the legwork of asking around on your behalf | Your ISP's resolver, `8.8.8.8`, `1.1.1.1` |
| **Authoritative server** | Holds the real records for a domain and gives final answers | The domain owner's nameservers |

The distinction is useful in incident response. A hijacked or malicious resolver can lie to you while the authoritative record stays correct.

You can inspect all of this from a terminal, and the phase's task 5 asks you to. `dig example.com MX` returns the mail records, and `dig example.com TXT` shows the anti-spoofing policy. Reading a real TXT record for a domain you care about is a small revelation — it shows you that email authentication is public information.

#### Worked example: reading a real dig query

You run:

```bash
dig example.com TXT +short
```

And you get back something like:

```text
"v=spf1 include:_spf.example.com -all"
```

Read it left to right.

| Piece | What it means |
|---|---|
| `v=spf1` | This is an SPF record, version 1 — the list of servers allowed to send mail as this domain |
| `include:_spf.example.com` | Mail sent through that host is authorised |
| `-all` | Everything else is a **hard fail**. Any other server claiming to be this domain should be rejected |

That last token is the security decision. A domain ending in `-all` is enforcing its policy strictly. A domain ending in `~all` is only marking it as suspicious, and a domain with no SPF record at all is trivially spoofable.

You have just read an anti-spoofing policy straight from public DNS, using one command.

#### DHCP and the DORA exchange

**DHCP** (Dynamic Host Configuration Protocol) hands out addresses automatically, through a four-step exchange known as **DORA**.

| Step | What happens |
|---|---|
| **D**iscover | Client broadcasts “is anyone there?” |
| **O**ffer | Server proposes an address |
| **R**equest | Client asks for it |
| **A**cknowledge | Server confirms |

The security angle is that a rogue DHCP server can hand out a malicious gateway or DNS server, redirecting an entire network's traffic. This is why enterprise networks use **DHCP snooping**.

#### NAT: address conservation, not a security control

**NAT** (Network Address Translation) lets many private devices share one public address. Your home router rewrites outgoing packets so they appear to come from its public IP, and tracks which internal machine each reply belongs to.

Two consequences worth holding:

| Consequence | Why it matters |
|---|---|
| Your internal `192.168.1.10` is invisible from outside | You cannot be reached directly from the internet |
| NAT is *not* a security control | It is an address-conservation mechanism that happens to hide internal structure. It behaves like a control by accident |

#### TCP, UDP, and ICMP

**TCP** is connection-oriented and reliable. It begins with the **three-way handshake**:

```text
Client → Server:  SYN       ("I would like to connect, my sequence starts here")
Server → Client:  SYN-ACK   ("Acknowledged, and here is mine")
Client → Server:  ACK       ("Acknowledged — connection established")
```

This handshake is the single most useful thing to understand for reading captures, and the phase's task 9 asks you to write it up.

#### Worked example: how the handshake explains Nmap's port states

What the handshake means in practice:

| What you observe | What it proves |
|---|---|
| A completed handshake | The port is open and something is listening |
| A `SYN` that gets no reply | The port is filtered, or the host is down |
| A `SYN` answered by `RST` (reset) | The host is alive but nothing is listening on that port |

That third row is precisely how Nmap distinguishes open, closed, and filtered ports. Once you know the handshake, Nmap's output stops being arbitrary.

Teardown uses `FIN` or `RST`, either side can initiate, and TCP tracks state throughout. That state tracking is what lets it retransmit lost data and deliver in order.

#### Why UDP drops all of that on purpose

**UDP** is connectionless and unreliable: no handshake, no ordering, no retransmission.

That sounds like a downgrade, and for some uses it is exactly right. DNS lookups, video streaming, and voice calls all prefer speed over guaranteed delivery, because a retransmitted video frame arrives too late to matter.

The security relevance runs two ways:

| Property | Security consequence |
|---|---|
| No handshake | Easier to spoof, because there is no session to establish |
| Harder to scan reliably | UDP services are often overlooked in hardening |

#### ICMP and the trap of “ping fails”

**ICMP** is the diagnostic protocol behind `ping` (echo request / echo reply) and the “destination unreachable” and “time exceeded” messages.

It is how `traceroute` works, by sending packets with deliberately short lifetimes and listening for the resulting errors.

Note that many networks block ICMP, so “ping fails” does not reliably mean “host is down.” That lesson matters in both troubleshooting and reconnaissance.

#### Common ports to recognise on sight

You should recognise these without looking them up. They appear in scans, logs, and firewall rules constantly.

| Port | Protocol | Notes |
|---:|---|---|
| 22 | SSH | Encrypted remote shell |
| 25 / 587 | SMTP | Mail sending; 587 is the submission port |
| 53 | DNS | Often UDP, TCP for large answers |
| 80 / 443 | HTTP / HTTPS | Web traffic |
| 139 / 445 | SMB | Windows file sharing; 445 is heavily attacked |
| 3389 | RDP | Windows remote desktop; a favourite ransomware entry point |

Two of these deserve emphasis. **Port 445 (SMB)** and **port 3389 (RDP)** exposed to the internet are among the most common causes of ransomware incidents in the world, because both are legitimate services that attackers can authenticate to.

Seeing either open on an internet-facing host is a finding, not a curiosity. This is exactly the kind of judgement the phase wants you to be able to make from an Nmap result.

#### HTTP through a security lens

**HTTP** is the protocol you already know from web development, so the security framing is what matters here.

| Element | What it is | Security relevance |
|---|---|---|
| **Methods** | `GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS` — they describe intent | A server that accepts `DELETE` from anyone has an authorisation problem |
| **Status codes** | Grouped by first digit: `2xx` success, `3xx` redirect, `4xx` client error, `5xx` server error | `401` versus `403` distinguishes “not authenticated” from “authenticated but not permitted” — a real difference when testing access control |
| **Headers** | Metadata about the request or response | `Set-Cookie` (and whether it has `HttpOnly` and `Secure` flags), `Content-Security-Policy`, `Server` (leaks software versions, useful to an attacker), `Authorization` |
| **Cookies** | How sessions persist across requests | Stealing a session cookie can bypass login entirely |

You can read all of this with `curl`, which is phase task 7's companion. `curl -I https://example.com` printing real response headers is worth more than any description.

#### Worked example: reading response headers

You run:

```bash
curl -I https://example.com
```

And you get back something like:

```text
HTTP/2 200
content-type: text/html; charset=UTF-8
server: ECS (dcb/7F84)
strict-transport-security: max-age=31536000
```

| Line | What it tells a defender |
|---|---|
| `HTTP/2 200` | The request succeeded, and the server speaks HTTP/2 |
| `content-type: text/html; charset=UTF-8` | The body is HTML in UTF-8 — no MIME confusion expected here |
| `server: ECS (dcb/7F84)` | The software is identifiable. That is a version-disclosure decision the owner made, and attackers read it the same way |
| `strict-transport-security: max-age=31536000` | HSTS is on. Browsers will refuse plain HTTP to this host for a year, which blocks downgrade attacks |

Notice what is *absent*. There is no `set-cookie` here, so this response establishes no session. On a login response, a missing `HttpOnly` or `Secure` flag on that cookie would be the finding.

#### TLS: what makes HTTPS trustworthy

**TLS** is what makes HTTPS trustworthy. At beginner level, the useful mental model is this: the server presents a **certificate** proving its identity, signed by a **certificate authority** the client already trusts. The two sides then negotiate keys and encrypt everything after.

Two failure modes to know:

| Failure mode | What it means |
|---|---|
| An expired certificate | A configuration problem — the owner forgot to renew |
| A **valid but wrong** certificate | Right domain, so the browser is happy, but not the host you think you are talking to. This is a potential interception |

That distinction is why certificate inspection is a real investigative step rather than a formality.

#### VPNs and proxies: which is which

Finally, **VPNs and proxies** both relay your traffic, for different reasons.

| Mechanism | What it does | Where it operates |
|---|---|---|
| **VPN** | Encrypts a tunnel from your device to a server, hiding traffic from your local network and presenting a different source IP | Network layer |
| **Proxy** | Forwards requests on the client's behalf | Application layer |
| **Reverse proxy** | Does it on the server side, in front of the real application | Application layer |

Knowing which is which matters when analysing logs. The address you see may be the relay rather than the origin — a recurring theme in incident investigation.

### Part 2 — Linux: the filesystem and permissions

#### The filesystem hierarchy, and why it is organised this way

Linux has no drive letters. Everything hangs off a single root, `/`, and the directories have conventional purposes.

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

#### Where you will actually spend your time

For security work, three of these matter most.

| Directory | What is in it | Why it matters |
|---|---|---|
| **`/etc`** | `/etc/passwd` (user accounts), `/etc/shadow` (password hashes, readable only by root), `/etc/ssh/sshd_config` (SSH server configuration), `/etc/hosts` | Configuration is where misconfiguration is found |
| **`/var/log`** | The logs you will investigate | The evidence lives here |
| **`/tmp`** | Temporary files | World-writable, which makes it a favourite location for attackers to stage files, because anything can be written there |

#### Two structural properties that are security-relevant

| Property | Security consequence |
|---|---|
| `/etc` is separated from `/var` | Configuration and data change at different rates, and can be backed up and protected differently |
| System binaries live in known paths (`/bin`, `/sbin`) | This is what allows integrity tools to detect tampering. If `/bin/ls` has changed, that is detectable only because its location is predictable |

#### Permissions: the part that takes practice

Every file has an owner, a group, and three sets of permissions. Reading `-rwxr-xr--`:

```text
-   rwx   r-x   r--
│    │     │     └── others:  read only
│    │     └──────── group:   read and execute
│    └────────────── owner:   read, write, execute
└─────────────────── type:    - file, d directory, l symlink
```

#### The same permission letter means two things

This is the single most important table in this section.

| Letter | On a file | On a directory |
|---|---|---|
| **r** (read) | Read its contents | List its contents |
| **w** (write) | Modify it | Create or delete files *inside* it |
| **x** (execute) | Run it | **Enter** it |

That last row is the one that trips people up, and it has a real security consequence.

| Directory permission set | What it actually allows |
|---|---|
| `w` but not `x` | Someone can create files but not see what is there |
| `x` but not `r` | Someone can access a file *if they already know its name*, but cannot list the directory |

Confusing these leads to permissions that look restrictive and are not.

#### Numeric (octal) permissions

**Numeric permissions** are the same information in shorthand. Each permission is a bit: read = 4, write = 2, execute = 1. Add them within each triad.

| Symbolic | Numeric | Meaning |
|---|---|---|
| `rwx` | 7 | 4 + 2 + 1 |
| `rw-` | 6 | 4 + 2 |
| `r-x` | 5 | 4 + 1 |
| `r--` | 4 | 4 |
| `---` | 0 | nothing |

#### Worked example: three chmod commands you will actually type

| Command | What it sets | Why you would use it |
|---|---|---|
| `chmod 755 script.sh` | Owner full rights; everyone else read-and-execute | A script other people need to run |
| `chmod 600 id_rsa` | Only the owner may read and write | Exactly what SSH requires for a private key — and the reason you will see “permissions are too open” errors when you get it wrong |
| `chmod 644 file.txt` | Owner reads and writes; everyone else reads | The ordinary setting for a non-executable file |

Ownership changes with `chown user:group file`. Only root can give a file away to another user, which is a deliberate restriction.

#### sudo, least privilege, and the accounting trail

**`sudo`** lets a permitted user run a command as root.

It is the mechanism behind **least privilege** (Phase 1): instead of logging in as root, you work as a normal user and escalate only for the specific command that needs it.

Every `sudo` invocation is logged, which is why it also serves the **accounting** part of AAA. Reading `/etc/sudoers` shows who has been granted what — and a common finding in security reviews is that far too many users are in the sudo group.

#### The setuid bit: a classic privilege-escalation vector

**The setuid bit** is worth knowing because it is a classic privilege-escalation vector. A file with setuid set runs with the *owner's* permissions rather than the caller's.

If root owns a setuid binary and the binary can be made to run arbitrary commands, any user can become root. This is why enumeration of setuid binaries is a standard step in Linux privilege escalation.

#### Users, groups, and where they are recorded

```bash
whoami                 # who am I right now
id                     # my user id, group id, and group memberships
cat /etc/passwd        # all accounts; fields are name:x:UID:GID:comment:home:shell
sudo cat /etc/shadow   # password hashes — root only, and a key target for attackers
groups                 # the groups I belong to
```

#### Worked example: reading /etc/passwd like an analyst

Reading `/etc/passwd` carefully is a genuinely useful skill. Two fields carry the security meaning.

| Field | What to look for | What it means |
|---|---|---|
| **UID** | Typically 1000+ | A normal user |
| **UID** | Below 1000 | A system account |
| **UID** | 0 | Root. Any account *other than root* with UID 0 is a backdoor, full stop |
| **Login shell** | `/usr/sbin/nologin` | The account exists but cannot log in interactively — how service accounts are locked down |
| **Login shell** | `/bin/bash` on a service account | A finding. That account should have had `nologin` |

The phase's task 2 asks you to create two users and test permissions. Do that literally: create them, put them in a group, create a file, and then try to read it as the other user. Being *denied* by the system is the moment permissions stop being abstract.

### Part 3 — Linux: services, logs, and the command-line toolkit

#### SSH: the tool you will use daily

**SSH** gives you an encrypted shell on a remote machine. The server is `sshd` — the SSH *daemon*, where a daemon is a background service. It is configured in `/etc/ssh/sshd_config`, and it listens on port 22 by default.

#### Why key-based authentication beats passwords

**Key-based authentication** replaces passwords with a cryptographic keypair.

| Part | Where it lives | What it does |
|---|---|---|
| **Private key** | Never leaves your machine | Proves who you are |
| **Public key** | Placed on the server in `~/.ssh/authorized_keys` | The server uses it to challenge you |

The server challenges you to prove you hold the private key. It never sees it.

This is stronger than a password because there is nothing to guess, phish, or reuse. It is why production servers usually disable password authentication entirely.

```bash
ssh-keygen -t ed25519 -C "lab key"        # generate a keypair
ssh-copy-id user@192.168.1.50             # install the public key on the server
ssh user@192.168.1.50                     # connect
scp file.txt user@192.168.1.50:/tmp/      # copy a file over SSH
```

#### The two sshd_config settings that matter most

Two configuration items are worth recognising because they are the difference between a hardened and a vulnerable server.

| Setting | Should be | Why |
|---|---|---|
| `PermitRootLogin` | `no` | Direct root login is unnecessary when `sudo` exists |
| `PasswordAuthentication` | `no` once keys work | Removes the entire guessing and phishing surface |

Phase task 3 asks you to enable SSH in your VM and connect from your host. When you do, read the config file and see these settings for yourself.

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

#### Worked example: the status/state trap

A service that is `active (running)` but `disabled` will not survive a reboot. That distinction causes real incidents, and it is worth seeing once.

```text
$ systemctl status sshd
● sshd.service - OpenSSH Daemon
     Loaded: loaded (/usr/lib/systemd/system/sshd.service; disabled; preset: disabled)
     Active: active (running) since Mon 2025-03-10 09:14:22 UTC; 3h 2min ago
```

| Line | What it tells you |
|---|---|
| `disabled` in the Loaded line | It will **not** start at boot |
| `active (running)` in the Active line | It is running right now, because someone started it manually |
| The combination | Everything looks fine until the next reboot, and then SSH is gone |

The security relevance of this command is direct: **you cannot defend a host whose services you cannot enumerate.** Asking “what is running, and should it be?” is the first question of host hardening, and `systemctl list-units --type=service` answers it.

#### Logs: where the evidence lives

Logs are the raw material of detection and investigation, and Linux puts them in predictable places.

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

#### Exercise: watch a failed login happen

A workflow worth adopting now. Open one terminal running `journalctl -u sshd -f` on your VM. Try to SSH in from your host with the wrong username, and then with the wrong password.

Watch the failures appear. Then use `grep` to pull the failed attempts out of `/var/log/auth.log`.

That single exercise teaches log reading, SSH, and grep simultaneously — and it is the same pattern a SOC analyst uses all day, at larger scale.

#### What failed SSH attempts look like

Recognising this pattern matters specifically, because brute-force attempts against internet-facing SSH are constant background noise.

```text
Failed password for invalid user admin from 203.0.113.45 port 51234 ssh2
Failed password for root from 203.0.113.45 port 51236 ssh2
Invalid user test from 203.0.113.45 port 51240 ssh2
```

#### Worked example: spraying versus brute force in a real log

You learned both terms in Phase 1. Here is what they look like in production.

| Pattern in the log | What it is | Why |
|---|---|---|
| One source address, many **usernames**, rapid repetition | Password spraying | The attacker is trying a few common passwords across many accounts |
| One source address, one username, many **passwords** | Brute force | Every attempt is against the same account |

In the sample above, the same source `203.0.113.45` tries `admin`, `root`, and `test`. That is the spraying shape. A brute-force attempt would show the same username over and over.

#### The networking toolkit

These commands are the core of the phase, and every one of them is worth running at least once.

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

#### Decoding ss -tulpn, flag by flag

`ss -tulpn` is the Linux equivalent of a port scan against your own machine. Phase task 4 asks you to run it and identify every listening service.

| Flag | Meaning |
|---|---|
| **t** | TCP |
| **u** | UDP |
| **l** | Listening sockets only |
| **p** | Show the owning processes |
| **n** | Numeric — do not resolve names |

#### Worked example: reading ss output for a finding

You run `sudo ss -tulpn` and see something like:

```text
Netid State  Local Address:Port   Process
tcp   LISTEN 127.0.0.1:631        cupsd
tcp   LISTEN 0.0.0.0:22           sshd
tcp   LISTEN 0.0.0.0:3306         mysqld
```

| Line | Reading it |
|---|---|
| `127.0.0.1:631 cupsd` | Printing service. Bound to localhost only, so it is not reachable from the network. Low concern |
| `0.0.0.0:22 sshd` | SSH is reachable from the network. Expected, but it should be key-only |
| `0.0.0.0:3306 mysqld` | **The finding.** A database listening on all interfaces is reachable by anyone who can route to this host |

That single distinction — `0.0.0.0` versus `127.0.0.1` — is one of the most common security findings on Linux hosts. A service bound to `127.0.0.1` is local-only and much safer.

#### Text processing: the second half of the toolkit

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

#### The pipe, and one real investigation query

The pipe (`|`) is the concept to internalise. It takes one command's output and makes it the next command's input, letting you build small tools from small tools.

This works because Unix programs follow a convention — read text in, write text out. That convention is why a security analyst can answer “how many distinct IPs failed to log in today?” with one line:

```bash
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head
```

Read that left to right.

| Stage | What it does |
|---|---|
| `grep "Failed password" /var/log/auth.log` | Find the failed-password lines |
| `awk '{print $11}'` | Extract the source IP column |
| `sort` | Order them so identical addresses are adjacent |
| `uniq -c` | Collapse duplicates and count each |
| `sort -rn` | Sort by count, descending |
| `head` | Show the top ten |

That is a real investigation query, built from five small pieces, and it is the shape of most log analysis you will do. **`awk '{print $N}'` extracts the Nth whitespace-separated field** — that is the 90% of awk you need at this stage.

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
