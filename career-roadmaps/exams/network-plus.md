---
id: exam-network-plus
exam: "CompTIA Network+"
code: N10-009
questions: 40
real_exam_questions: 90
real_exam_minutes: 90
pass_mark: 720
pass_scale: 900
blueprint_checked: 2026-09-18
source: "https://www.comptia.org/certifications/network"
---

# CompTIA Network+ — practice questions

**Unofficial.** Written for this repository against CompTIA's published N10-009 objectives.
Not real exam questions, not endorsed by CompTIA.

| | |
|---|---|
| **Exam code** | N10-009 |
| **Real exam** | maximum of 90 questions, 90 minutes |
| **Pass mark** | **720** on a scale of 100–900 |
| **This paper** | **40 questions** — see the note below |

## Before you start

**Do this closed-book, in one sitting, in 45 minutes.** The real exam gives 90 minutes for up
to 90 questions, so 45 for 40 is the same pace.

**720/900 is 80%**, which is 32 questions out of 40. Lower than Security+, and that difference
is worth knowing before you sit either:

| Your score out of 40 | Percentage | Verdict |
|---|---|---|
| 36–40 | 90–100% | Comfortable pass |
| **32–35** | **80–88%** | **Pass** |
| 31 | 77.5% | Fail — just under |
| 27–30 | 68–75% | Clear fail |
| below 27 | — | Substantially under-prepared |

**The percentage is arithmetic, not a scaled score.** A real Network+ score is scaled against
the difficulty of the questions you receive, so clearing the arithmetic line is not a promise.

**These 40 questions are not a simulation.** The real exam draws up to 90 questions from a much
larger objective list and includes performance-based questions — subnetting and CLI
simulations — that a multiple-choice paper cannot represent. **Subnetting in particular is
worth practising on paper or in a lab**, not by reading questions about it.

## How it is weighted

| Domain | Official weight | Questions here |
|---|---|---|
| 1. Networking concepts | 23% | 9 |
| 2. Network implementation | 20% | 8 |
| 3. Network operations | 19% | 8 |
| 4. Network security | 14% | 6 |
| 5. Network troubleshooting | **24%** | 9 |

**Troubleshooting is the largest domain** and the least like reading — it asks what you would
*do*, in order, with a fault in front of you. Concepts is nearly as large and is the most
readable, which is why people over-study it relative to its weight.

---

## Domain 1 — Networking concepts (23%)

### Q1. A workstation has the address 192.168.1.50/24. Which address is its broadcast address?

- [ ] 192.168.1.0
- [ ] 192.168.1.1
- [x] **192.168.1.255**
- [ ] 192.168.255.255

**Why:** A /24 leaves the last octet for hosts, so the broadcast is the all-ones value in that
octet — `.255`. `.0` is the network address and `.1` is conventionally the gateway, but neither
is the broadcast. This is the single most common subnetting question on the exam, and it is
worth being able to do it for other mask lengths too — /25, /26 — because the exam will not
only ask /24.

### Q2. Which protocol provides reliable, ordered delivery and retransmits lost segments?

- [ ] UDP
- [x] **TCP**
- [ ] ICMP
- [ ] ARP

**Why:** TCP's three-way handshake and acknowledgements are what "reliable, ordered, and
retransmits" describe. UDP is faster and connectionless with no such guarantee — which is a
feature for voice and DNS, not a defect. ICMP carries diagnostics like ping, and ARP resolves
IP addresses to MAC addresses on the local segment.

### Q3. A user's laptop connects to a wireless network but cannot reach anything by name, while IP addresses work. What is the most likely cause?

- [ ] The wireless password is wrong
- [x] **DNS resolution is failing**
- [ ] The network cable is faulty
- [ ] The firewall is blocking all traffic

**Why:** The discriminator is "IP addresses work". That proves the link, the addressing and
routing are all fine, and isolates the failure to **name resolution** — the one thing that
differs between the two tests. If the password were wrong the laptop would not associate at
all. This "what still works" reasoning is the core of troubleshooting questions.

### Q4. Which device operates at Layer 2 and forwards frames based on MAC addresses?

- [ ] Router
- [x] **Switch**
- [ ] Hub
- [ ] Firewall

**Why:** A switch is a Layer 2 device that learns MAC addresses and forwards frames only to the
port where the destination lives. A **hub** is also Layer 2 in a loose sense but broadcasts
every frame to every port — it forwards no more intelligently than a repeater. A router works at
Layer 3 and a firewall can inspect far higher layers. The switch-versus-hub distinction is the
common trap.

### Q5. Which of these is a private (RFC 1918) address range?

- [ ] 11.0.0.0/8
- [ ] 192.169.0.0/16
- [x] **172.16.0.0/12**
- [ ] 198.51.100.0/24

**Why:** The three RFC 1918 ranges are **10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16**. Note
`172.16` through `172.31` — the /12, not /16 — which is why `172.16.0.0/12` is right and
`192.169.0.0/16` is wrong by a single digit. `198.51.100.0/24` is documentation space, reserved
for examples like this one.

### Q6. What does a DHCP lease accomplish?

- [ ] It permanently assigns an IP address to a device
- [x] **It grants an IP configuration to a client for a defined period, after which it must be renewed**
- [ ] It encrypts traffic between the client and the gateway
- [ ] It maps a hostname to an IP address

**Why:** A **lease** is temporary by design, which is what lets a pool of addresses serve more
devices than it has addresses. A reservation is the permanent option, and that is a different
configuration. Mapping names to addresses is DNS, and encryption is neither.

### Q7. Which cloud connectivity model gives an organisation a dedicated, private connection to a cloud provider rather than using the public internet?

- [ ] VPN
- [x] **Dedicated private interconnect**
- [ ] SD-WAN
- [ ] MPLS

**Why:** A dedicated interconnect (ExpressRoute, Direct Connect, Cloud Interconnect) is a
private circuit that does not traverse the public internet at all. A **VPN** also provides a
private **tunnel**, but it runs *over* the public internet — that distinction is the whole
question, and it is a commonly tested one. MPLS is a carrier technology that may or may not
reach your cloud provider; SD-WAN is an overlay for managing multiple links.

### Q8. A network uses 10.0.0.0/8 internally and needs to reach the internet. Which technology allows many internal hosts to share one public address?

- [ ] Subnetting
- [x] **NAT**
- [ ] VLANs
- [ ] DNS

**Why:** Network Address Translation rewrites internal addresses to one (or a few) public
addresses on the way out. This is the reason IPv4 has survived far past its address exhaustion
date, and it is why the private ranges in Q5 exist. Subnetting divides a network; a VLAN
segments it at Layer 2; DNS names things.

### Q9. Which cable type is limited to 100 metres for Ethernet?

- [x] **Twisted pair (Cat 5e/6)**
- [ ] Multimode fibre
- [ ] Single-mode fibre
- [ ] Coaxial

**Why:** Copper twisted pair is specified to **100 m** for Ethernet — a number worth knowing
cold, because it explains a whole class of "the far office has intermittent connectivity"
faults. Fibre goes far further (multimode hundreds of metres to a few kilometres, single-mode
tens of kilometres). If a run exceeds 100 m on copper, the fix is fibre or a switch in between,
not a better cable.

---

## Domain 2 — Network implementation (20%)

### Q10. A company wants to separate the finance department's traffic from the rest of the office using the existing switches. What is the most appropriate solution?

- [ ] Buy separate switches for finance
- [x] **Configure VLANs**
- [ ] Assign different IP addresses
- [ ] Use a different wireless SSID

**Why:** A **VLAN** creates a logical Layer 2 segment on the same physical hardware, which is
exactly "separate the traffic using the existing switches". Different IP addresses alone
provide no separation — every host still hears every broadcast and can reach every other host.
A separate SSID is wireless-only and is not a security boundary on its own.

### Q11. A wireless network must serve both staff and guests, with guests unable to reach internal resources. What is the correct approach?

- [ ] One SSID with a shared password
- [x] **Separate SSIDs mapped to separate VLANs, with the guest VLAN restricted**
- [ ] Hide the guest SSID
- [ ] Give guests the staff password but ask them not to access internal systems

**Why:** Isolation is enforced by **network segmentation**, not by hiding the network name or
by asking nicely. Hiding an SSID is not a security control — it is visible to anyone with a
packet capture. A shared password with a verbal rule fails the moment the rule is inconvenient,
which is the first day.

### Q12. Which routing approach requires an administrator to manually configure every route?

- [x] **Static routing**
- [ ] Dynamic routing
- [ ] Default routing
- [ ] Policy-based routing

**Why:** Static routes are entered by hand and do not adapt when a link fails. Dynamic routing
(OSPF, EIGRP, BGP) exchanges information and reconverges automatically. Static routing is
genuinely right for small, stable networks and for a single default route — the exam is not
asking which is better, but which is manual.

### Q13. What is the purpose of a default gateway on a host?

- [ ] To resolve hostnames
- [x] **To forward traffic destined for networks the host does not know about**
- [ ] To assign IP addresses
- [ ] To filter malicious traffic

**Why:** The default gateway is the "everything else" route. A host sends to its gateway
anything whose destination is not on its own subnet. If the gateway is wrong or missing, local
traffic works and nothing else does — which is a distinct symptom from a DNS failure (Q3) and
worth being able to tell apart.

### Q14. Which technology allows a switch to carry traffic for multiple VLANs over a single link between switches?

- [ ] Port mirroring
- [x] **Trunking (802.1Q)**
- [ ] Spanning Tree
- [ ] Link aggregation

**Why:** 802.1Q **trunking** tags each frame with its VLAN so one physical link can carry
several. This is why a misconfigured trunk shows up as "VLAN 20 works on one switch and not the
other" — the tag is being stripped or the VLAN is not allowed. Spanning Tree prevents loops,
link aggregation combines links for bandwidth, and mirroring copies traffic for analysis.

### Q15. A network designer places a firewall between the internet and the internal network, with a separate segment for publicly accessible servers. What is that segment called?

- [ ] The intranet
- [x] **The DMZ**
- [ ] The backbone
- [ ] The guest network

**Why:** A **DMZ** (demilitarised zone) holds systems that must be reachable from the internet
while keeping them off the internal network. The design assumes a public server *will* be
compromised eventually, so the question is what it can reach afterwards. That is the same
containment reasoning as network segmentation in Security+.

### Q16. Which wireless standard operates in the 5 GHz band and is the basis for Wi-Fi 6?

- [ ] 802.11b
- [ ] 802.11g
- [x] **802.11ax**
- [ ] 802.11n

**Why:** **802.11ax is Wi-Fi 6**. 802.11n (Wi-Fi 4) and 802.11ac (Wi-Fi 5) are the generations
before it; 802.11b and 802.11g are 2.4 GHz-only legacy standards. The generations are numbered
because the letter suffixes stopped being memorable — Wi-Fi 6E adds the 6 GHz band.

### Q17. What is the main benefit of link aggregation (bonding) between two switches?

- [ ] It prevents switching loops
- [x] **It increases bandwidth and provides redundancy if one link fails**
- [ ] It encrypts traffic between the switches
- [ ] It assigns VLANs automatically

**Why:** Aggregating links gives combined throughput *and* survives a single cable failure —
two benefits for one configuration. Note what it does not do: it does not provide loop
prevention, which is Spanning Tree's job, and mixing the two up is a real design error. It
also does not encrypt anything.

---

## Domain 3 — Network operations (19%)

### Q18. A monitoring system should alert when a link's utilisation stays above 80% for five minutes. Which tool provides the data?

- [ ] A syslog server
- [x] **SNMP polling of interface counters**
- [ ] A packet capture
- [ ] NetFlow analysis only

**Why:** **SNMP** exposes interface counters (bytes in/out, errors) and is the standard way to
poll utilisation over time. A packet capture shows content but does not scale to ongoing
monitoring. Syslog carries events, not a continuous utilisation figure. NetFlow gives flow
detail and can answer this too, but the word "only" makes that option wrong — SNMP is the
direct answer.

### Q19. Which document records what each network device is, where it is, and who owns it?

- [ ] A network diagram
- [x] **An asset inventory**
- [ ] A baseline
- [ ] A runbook

**Why:** An **asset inventory** is the authoritative record of what exists and who owns it. A
diagram shows topology and goes stale; a baseline records expected performance; a runbook gives
procedures. You cannot patch, monitor or decommission what you do not know you have — which is
why "you cannot protect what you cannot see" is a cliché in this field.

### Q20. What is the primary purpose of a configuration baseline?

- [ ] To document the network's physical layout
- [x] **To record the known-good state so drift can be detected**
- [ ] To list all user accounts
- [ ] To provide a backup of device firmware

**Why:** A baseline is the **reference** you compare against. Without one, "this switch is
misconfigured" is an opinion; with one, it is a diff. This is the same integrity logic as
file hashing in forensics, applied to configuration.

### Q21. Which practice best protects the management interface of a switch?

- [ ] Leaving it on the default VLAN with a strong password
- [x] **Placing it on a dedicated management VLAN reachable only from admin hosts**
- [ ] Disabling the web interface and using telnet
- [ ] Using the same credentials as the domain administrator

**Why:** A management interface on the default VLAN is reachable by anything on that VLAN —
including a compromised workstation. A dedicated management VLAN with restricted access is
the **segmentation** answer again. Telnet sends credentials in cleartext and is worse than what
it replaced, and reusing domain admin credentials means one compromise is total.

### Q22. An organisation needs to guarantee uptime for a service and documents a 99.9% availability target. What is this called?

- [ ] A backup policy
- [x] **A service level agreement (SLA)**
- [ ] A disaster recovery plan
- [ ] A change management process

**Why:** An **SLA** is the documented, agreed level of service — 99.9% is a specific commitment
with consequences attached. Note the arithmetic worth knowing: 99.9% still allows roughly
**43 minutes of downtime a month**, which surprises people who read "three nines" as "never
goes down".

### Q23. Which change management practice most reduces the risk of an outage during a network change?

- [ ] Making changes quickly, outside busy hours
- [x] **A documented rollback plan and an approved change window**
- [ ] Notifying users after the change
- [ ] Making several changes at once to save time

**Why:** A **rollback plan** is what turns a failed change from an outage into an incident. The
"several changes at once" option is the classic anti-pattern: when something breaks you cannot
tell which change caused it, and you cannot roll back one without the others.

### Q24. What does a syslog severity level of 0 indicate?

- [ ] Informational
- [ ] Warning
- [x] **Emergency — the system is unusable**
- [ ] Debugging

**Why:** Syslog severity runs **0 (Emergency) to 7 (Debug)** — the scale counts *down* in
severity as the number goes up, which is the opposite of what most people assume. 3 is Error,
4 is Warning, 6 is Informational. Getting this backwards silently breaks alerting rules.

### Q25. Which is the best reason to keep network device firmware current?

- [ ] Newer firmware is always faster
- [x] **It closes known vulnerabilities that attackers actively scan for**
- [ ] It resets the configuration to defaults
- [ ] It is required for the device to pass traffic

**Why:** Firmware updates are primarily **security** updates. Network devices are attractive
targets precisely because they are internet-facing, rarely rebooted, and often forgotten. The
"always faster" option is a common misconception — updates sometimes regress performance, which
is exactly why you test and have a rollback plan (Q23).

---

## Domain 4 — Network security (14%)

### Q26. Which port does HTTPS use by default?

- [ ] 80
- [x] **443**
- [ ] 22
- [ ] 3389

**Why:** **443** is HTTPS; **80** is HTTP; **22** is SSH; **3389** is RDP. These four appear on
almost every Network+ exam and are worth knowing without thinking. Port 3389 in particular is
worth remembering as a security matter — exposed RDP is one of the most commonly attacked
services on the internet.

### Q27. A company wants to allow remote workers to access the internal network securely over the internet. Which solution fits best?

- [ ] Port forwarding to each workstation
- [x] **A VPN concentrator**
- [ ] A public IP address for each worker
- [ ] Telnet access to the gateway

**Why:** A **VPN concentrator** terminates many encrypted tunnels and is the standard remote
access solution. Forwarding ports to individual workstations exposes them directly to the
internet, which is how RDP (Q26) ends up attacked. Telnet is cleartext — using it for remote
access to a gateway is a serious finding, not a solution.

### Q28. What is the purpose of 802.1X?

- [ ] To encrypt wireless traffic
- [x] **To require devices to authenticate before being granted network access**
- [ ] To assign IP addresses automatically
- [ ] To prioritise voice traffic

**Why:** 802.1X is **port-based network access control** — the switch or access point holds the
port closed until the device authenticates. It is what stops an unknown laptop from simply
plugging in and getting a network. It is authentication for **admission**, distinct from
encryption (WPA) and from addressing (DHCP).

### Q29. Which attack involves overwhelming a target with traffic from many sources?

- [ ] ARP spoofing
- [x] **DDoS**
- [ ] VLAN hopping
- [ ] DNS poisoning

**Why:** A distributed denial of service uses many sources — often a botnet — so blocking one
address achieves nothing. That distribution is the "distributed" part and the reason a single
firewall rule cannot fix it. ARP spoofing and DNS poisoning are redirection attacks; VLAN
hopping escapes a segment.

### Q30. Why is Telnet considered unsuitable for managing network devices?

- [ ] It is too slow
- [x] **It transmits credentials and session data in cleartext**
- [ ] It only works on switches
- [ ] It cannot handle multiple sessions

**Why:** Telnet sends everything unencrypted, so anyone on the path can read the password —
which is the same on-path interception risk that Security+ frames as an on-path attack. **SSH**
is the replacement, and disabling Telnet is a standard hardening step on any network device.

### Q31. A firewall rule allows traffic from any source to any destination on port 22. What is the main concern?

- [ ] SSH uses too much bandwidth
- [x] **Management access is exposed to the entire internet and should be restricted**
- [ ] Port 22 is not a real port
- [ ] SSH cannot be firewalled

**Why:** "Any source, any destination" for a management port means the entire internet can
attempt to authenticate. SSH itself is encrypted and sound; the problem is **who can reach
it**. Restricting to known addresses, or requiring a VPN first, is the fix. This is the
"any/any" rule pattern that shows up constantly in firewall audits.

---

## Domain 5 — Network troubleshooting (24%)

### Q32. A user reports no network connectivity. Which step should come FIRST?

- [ ] Replace the network cable
- [x] **Identify the problem and gather information**
- [ ] Escalate to the network team
- [ ] Reboot the switch

**Why:** The troubleshooting methodology is **ordered**, and "identify the problem" is always
first. Replacing hardware before understanding the fault is how you change two variables at
once and lose the ability to tell what fixed it — or what broke. The exam tests the sequence,
not just the plausible actions.

### Q33. Multiple users on the same floor report slow network access, but users on other floors are fine. What should you check first?

- [ ] The internet service provider
- [x] **The switch or uplink serving that floor**
- [ ] The DNS server
- [ ] Each user's individual computer

**Why:** The **scope** narrows the fault. One floor affected and others not points at shared
infrastructure for that floor, not at the ISP (which would affect everyone) or at individual
machines (which would be one user). Reading the scope correctly is the single most valuable
troubleshooting skill and the one these questions test most.

### Q34. A ping to 8.8.8.8 succeeds but a ping to google.com fails. What does this indicate?

- [ ] There is no internet connectivity
- [x] **IP connectivity works; name resolution does not**
- [ ] The default gateway is down
- [ ] The firewall is blocking ICMP

**Why:** This is Q3 as a diagnostic pair, and the reasoning is worth having automatic. If raw
IP works, the stack, addressing, routing and gateway are all fine. The only thing that changed
between the two commands is the **name**, so the fault is DNS. If the gateway were down, the
first ping would have failed too.

### Q35. A cable tester shows a cable passes but the link negotiates at 100 Mbps on a gigabit switch. What is the most likely cause?

- [ ] The switch port is faulty
- [x] **The cable has a damaged or miswired pair, so it cannot support all four pairs**
- [ ] The NIC is set to half duplex
- [ ] The cable is too short

**Why:** Gigabit Ethernet needs **all four pairs**. A cable with a split or damaged pair can
still pass a basic continuity test and negotiate *down* to 100 Mbps, which uses two pairs. This
is a classic "the tester says it is fine" fault, and it is why a cable tester that only checks
continuity is not enough.

### Q36. Users report that a web application is slow, but network utilisation is normal and the server CPU is at 20%. Where should you look next?

- [ ] The switch is failing
- [x] **The application or its database layer**
- [ ] The internet connection
- [ ] The users' wireless signal strength

**Why:** Two healthy measurements eliminate two layers. Normal utilisation rules out a network
capacity problem; 20% CPU rules out server compute. The remaining suspect is the **application
stack** — a slow query, a lock, an external API call. Eliminating by measurement rather than
by guessing is the method these questions reward.

### Q37. A wireless user experiences intermittent disconnections when walking between rooms. What is the most likely cause?

- [ ] The wireless password is expiring
- [x] **Weak signal or poor roaming between access points**
- [ ] The DHCP lease is too short
- [ ] The DNS server is overloaded

**Why:** "When walking between rooms" is the scope, and it points at **coverage and roaming** —
overlapping cells, transmit power, or a client clinging to a distant AP. A DHCP or DNS problem
would affect the user wherever they sat. Reading the trigger condition in the question is how
you distinguish these.

### Q38. After a switch replacement, one VLAN is unreachable while others work. What is the most likely cause?

- [ ] The new switch is faulty
- [x] **The VLAN was not created on the new switch, or the trunk is not allowing it**
- [ ] The cables are the wrong colour
- [ ] The users need new IP addresses

**Why:** One VLAN failing while others work localises the fault to **that VLAN's configuration**
— its definition on the new device or its permission on the trunk (Q14). Physical faults affect
whole ports or whole switches, not one logical segment. This is the same scope reasoning as
Q33, applied to a Layer 2 configuration change.

### Q39. Which command would show whether a host can reach a specific destination and where the path fails?

- [ ] ipconfig
- [x] **traceroute (or tracert)**
- [ ] nslookup
- [ ] arp -a

**Why:** **Traceroute** shows each hop and where responses stop, which is exactly "where the
path fails". `ipconfig` shows local addressing, `nslookup` queries DNS, and `arp -a` shows the
local ARP cache. Knowing which tool answers which question is the practical half of
troubleshooting — the exam expects you to reach for the right one from the symptom.

### Q40. A technician fixes an intermittent fault and the user reports it recurred a week later. What should the technician have done differently?

- [ ] Nothing — intermittent faults recur by nature
- [x] **Documented the findings, the change made, and verified the fix held**
- [ ] Replaced more hardware pre-emptively
- [ ] Escalated immediately without investigating

**Why:** "Documented and verified" is the step in the methodology everyone skips, and it is
exactly what determines whether a recurrence is solved in five minutes or re-diagnosed from
scratch. Note that the first option is the tempting wrong answer: intermittent faults do recur,
but a *documented* fault that recurs is a known problem with a history, while an undocumented
one is a new problem every time.

---

## Scoring

**One mark per question, 40 total. No marks deducted for wrong answers — answer everything.**

The pass mark is 720/900 = **80%**, which is **32 questions**.

| Score | Percentage | What it means |
|---|---|---|
| 36–40 | 90–100% | Comfortable pass |
| **32–35** | **80–88%** | **Pass** |
| 31 | 77.5% | Just under the line — a fail |
| 27–30 | 68–75% | Clear fail |
| below 27 | — | Do not book yet |

### If you scored under 32

Network+ rewards **doing** over reading, more than either Security+ or A+. If your weak domain
is troubleshooting (24%) or implementation (20%), the fix is not re-reading — it is building
the thing. Packet Tracer is free, and a home router with two VLANs teaches subnetting and
trunking faster than any chapter.

**Subnetting specifically:** if you lost marks on Q1 or anything like it, practise on paper
until you can do /25, /26 and /27 without counting on your fingers. It appears throughout the
exam, not only in the concepts domain.

### If you scored 36 or above

The real exam includes **performance-based questions** — simulated switch and router
configuration, and subnetting exercises — which no multiple-choice paper represents. Practise
in a simulator before booking, and confirm the current exam code and objectives with CompTIA:
N10-009 will be retired eventually and the objectives will change.

---

## Where each domain is taught

| Domain | Curriculum phases |
|---|---|
| 1. Networking concepts | `it-roadmap/03-phase-networking-basics.md` |
| 2. Network implementation | `it-roadmap/03-phase-networking-basics.md`, `it-roadmap/04-phase-helpdesk-skills.md` |
| 3. Network operations | `it-roadmap/03-phase-networking-basics.md`, `it-roadmap/05-phase-sysadmin-basics.md` |
| 4. Network security | `cybersec-roadmap/02-phase-networking-and-linux.md`, `cybersec-roadmap/03-phase-security-fundamentals.md` |
| 5. Network troubleshooting | `it-roadmap/04-phase-helpdesk-skills.md`, `it-roadmap/06-phase-tools-and-ticketing.md` |

---

*Unofficial practice questions written for this repository against CompTIA's published
N10-009 objectives. Not affiliated with or endorsed by CompTIA. Exam details checked
2026-09-18 — confirm current details with CompTIA before booking.*
