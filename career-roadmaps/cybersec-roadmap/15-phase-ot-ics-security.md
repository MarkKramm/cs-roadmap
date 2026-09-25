---
id: cyber-15-ot-ics-security
track: cyber
phase: 15
order: 150
title: "Phase 15 — OT and ICS Security"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/cyber/15-ot-ics-security.md"
exit_criteria: "You can describe an OT network in Purdue levels, explain why availability and safety outrank confidentiality there, identify an industrial protocol from a packet capture and say what it cannot authenticate, analyse a real incident and name the control that would have stopped it, and state plainly why you never scan a live control network."
---

# Phase 15 — OT and ICS Security

## Goal of this phase

Learn how industrial control systems are built, why their security priorities are the reverse of ordinary IT, how the major industrial protocols behave on the wire, and what a defender can actually do inside a plant where you cannot patch, cannot reboot, and cannot afford to stop the line.

## Estimated time

**6 weeks** at about 10–13 focused hours a week. Roughly 60–78 hours, and most of it is spent in labs rather than reading.

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 5–6 | Once, properly, with the protocol diagrams open |
| Wireshark and Zeek work on OT protocol captures | 14–18 | The single highest-value activity in the phase |
| The protocol deep dives: Modbus, DNP3, EtherNet/IP, OPC UA | 12–16 | One protocol at a time, in the simulator |
| Incident case studies and write-ups | 10–14 | Where the employable judgement is demonstrated |
| Building a small simulation lab | 10–14 | Software PLCs, a simulator, and a separate analysis host |
| Purdue model and segmentation diagramming | 5–6 | Draw it until you can draw it from memory |
| Safety, legal, and standards reading | 4–4 | Non-negotiable, and it comes first |

## Skills you'll gain

- Explain why operational technology inverts the confidentiality, integrity, availability triad that ordinary IT is built around.
- Place any device on a plant network into a Purdue level and justify the placement.
- Identify Modbus TCP, DNP3, EtherNet/IP, PROFINET, and OPC UA traffic from a packet capture by port, framing, and behaviour.
- Say precisely which of those protocols authenticate anything, and what the absence of authentication means for monitoring.
- Capture and analyse control traffic passively with Wireshark, `tcpdump`, and Zeek without sending a single packet at a device.
- Recognise a write to a control register in a capture, and explain why that is the event worth alerting on.
- Explain the role of a safety instrumented system, and why attacking one is categorically different from attacking a business system.
- Trace a real incident from initial access to physical consequence, and name the control that would have interrupted it.
- Describe the IT/OT DMZ, the data diode, and where a firewall actually belongs in a plant.
- State the safety and legal boundary of OT work without hesitating, and refuse a request to scan a live control network.

## Specific topics to learn

- The CIA triad inverted: availability, integrity, and safety above confidentiality
- The Purdue model for industrial control systems, levels 0 through 5, and the boundaries between them
- The IT/OT DMZ, the industrial demilitarised zone, and what is allowed to cross it
- Asset lifecycles measured in decades, and why unpatched-by-design is a real engineering position
- Vendor-locked controllers, proprietary engineering tools, and the support contract that forbids change
- Modbus TCP: function codes, register addressing, and the total absence of authentication
- DNP3: outstations, masters, unsolicited responses, and Secure Authentication
- EtherNet/IP and CIP: implicit and explicit messaging, and what a control engineer means by a tag
- PROFINET: real-time classes, device profiles, and the difference between engineering and operations traffic
- OPC UA: the information model, certificates, and why it is the least bad option in the family
- Historians, engineering workstations, and the HMI as the three highest-value targets in a plant
- Safety instrumented systems, logic solvers, and the boundary you never cross
- Passive network monitoring: network taps, SPAN ports, and why active scanning can stop a controller
- Zeek, Suricata, Wireshark, and GRASSMARLIN as free monitoring and asset-discovery tools
- Stuxnet, the Ukraine grid attacks, Colonial Pipeline, Triton, and Oldsmar as case studies with lessons
- Industrial control system security standards and frameworks, and what each one is actually for
- Network segmentation for flat plant networks, including the VLAN and conduit conversation
- Vendor simulation environments and software PLCs as a free practice range
- Writing an OT security finding for an audience of control engineers rather than IT administrators

## Lesson: The Plant Does Not Care About Your Firewall

### Why this lesson exists

Everything you have learned so far assumes a world where the worst outcome is data. A stolen record, a defaced page, an account taken over. Bad outcomes, all of them, and all of them survivable. This phase is about a world where the worst outcome is a pump running dry, a valve stuck open, or a boiler over-pressurised while a person is standing next to it.

**That difference is not a matter of degree. It is a different discipline.**

Most people arrive here expecting OT security to be IT security with older computers. It is not. It is IT security where the machine you are protecting is physically attached to something that can hurt someone, where the software was written before you were born and will be running after you retire, and where the operator on the night shift is the only thing standing between a bad packet and a bad day.

**This lesson is deliberately conservative.** It will teach you to look and not touch, to read a capture rather than scan a network, and to say “I do not know” rather than guess at a controller's behaviour. That conservatism is not timidity. It is the professional standard in this field.

#### What you already have, and what is genuinely new

You are not starting from nothing. Your networking phase gave you TCP/IP, your detection phase gave you packet analysis and alerting, and your incident response phase gave you the discipline of evidence and timeline. All three transfer directly.

| What you know | How it lands in OT |
|---|---|
| TCP/IP, ports, sessions, and handshakes | Nearly all modern industrial traffic rides on TCP or UDP |
| Wireshark and reading a capture | The core skill of this phase, unchanged in method |
| Segmentation and firewall rules | The central architectural control in a plant |
| Syslog, SIEM, alerting, and tuning | The same craft, applied to different events |
| Incident timelines and evidence handling | Directly reusable, with the forensic limits below |
| Vulnerability management and CVSS | Still useful, and far less actionable than you expect |

| What is genuinely new here | Why it does not transfer from IT |
|---|---|
| Safety as a first-class security goal | Nothing in IT security is measured in human injury |
| Availability before confidentiality | Reboots are outages; an outage can be a physical event |
| Ten to twenty-five year asset lifecycles | Your IT patch cycle assumes a three-to-five year life |
| Protocols with no authentication at all | There is no analogue in mainstream IT |
| Engineering workstations running Windows XP | The host cannot be replaced without replacing the plant |
| Vendors who forbid modification | The support contract is a security control and a constraint |
| Regulatory safety obligations | An auditor can shut a site down; a security team usually cannot |

**Read that second table twice.** Each row is a place where advice that is correct in IT becomes dangerous in OT. Telling a plant to “just patch it” is the OT equivalent of telling a hospital to “just turn it off and on again” during surgery.

#### Time to complete

**Roughly 60–78 hours over 6 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 5–6 | Once, properly |
| Protocol study and simulator work | 12–16 | One protocol at a time |
| Wireshark, `tcpdump`, and Zeek on OT captures | 14–18 | The skill that gets used on day one |
| Building a simulation lab | 10–14 | Software PLCs, a simulator, a separate analysis host |
| Incident case studies and write-ups | 10–14 | Five incidents, each written up in the same format |
| Purdue segmentation diagramming | 5–6 | Practise until it is automatic |
| Safety, legal, and standards reading | 4–4 | Short, and it sets the boundary for everything else |

#### What this phase is not

It is not a licence to test a control network. Part 8 of this lesson is the most important part of it, and it is not a formality. Touching a live OT network can injure people, and the law in most jurisdictions treats that as a criminal matter rather than a professional one.

It is not a phase that makes you an ICS penetration tester. There are people who do that work professionally, inside vendor labs, with written authorisation and a shutdown plan. That is a career destination that comes after years of experience, not a first job.

It is not a phase that requires hardware. A software PLC talking to a simulator on your own laptop teaches the same protocol facts as a rack of equipment costing more than a car.

### Part 1 — Why OT is not IT

#### The triad, inverted

In IT security you learn the CIA triad: confidentiality, integrity, availability — usually in that order of emphasis when you are learning, and roughly in that order of priority when you are protecting business data.

OT security uses the same three words in a different order, and for one additional reason that IT has no equivalent for.

| Priority | Goal | What it means on a plant floor | What happens if it fails |
|---|---|---|---|
| **1** | **Safety** | No person is injured by the process | The failure mode the entire discipline exists to prevent |
| **2** | **Availability** | The process keeps running, or stops in a controlled way | Production loss, and sometimes an unsafe uncontrolled stop |
| **3** | **Integrity** | The commands and readings are the real ones | Operators act on false data; equipment is driven outside limits |
| **4** | **Confidentiality** | Process data is not disclosed | Competitive intelligence loss, and reconnaissance for a later attack |

**Confidentiality is last, and that is not an oversight.** If you leak the recipe for a soft drink, you have a commercial problem. If you close a valve that should be open on a cooling loop, you have a physical problem, and the timescale is seconds.

| IT question | OT question |
|---|---|
| Is the data protected? | Is the process safe? |
| Can I take it offline to patch? | Can I take it offline without stopping production? |
| How do I segment the network? | How do I segment the network without breaking a real-time control loop? |
| What is the worst case? | What is the worst case, and who is standing next to it? |
| Can we reboot it? | Is a reboot safe, and does the equipment come back in a known state? |

That last row of questions is the practical heart of the whole phase. **In IT, a reboot is a fix. In OT, a reboot is an event with physical consequences**, and whether it is safe depends on the process, not on the computer.

#### Twenty years of asset life

A business laptop is replaced every three to five years. A programmable logic controller in a water treatment plant is frequently in service for fifteen to twenty-five years, and the record in this industry is considerably longer. The controller's firmware may have been written for a hardware revision that no longer exists.

| Asset | Typical service life | Typical patch behaviour |
|---|---|---|
| Business laptop or server | 3–5 years | Patched monthly, replaced on a cycle |
| Engineering workstation | 7–12 years | Pinned to a vendor version, patched only when the vendor tests it |
| PLC or RTU | 15–25 years | Firmware updated only for a vendor-issued defect, with a maintenance window |
| Safety controller | 15–25 years and heavily certified | Effectively never changed without re-certification |
| Sensors and actuators | The life of the physical plant | Replaced when they fail, not when they age |

**The engineering workstation is the row that causes most incidents.** It runs the vendor's programming software, that software is certified only against specific versions of Windows, and the vendor's support contract may explicitly say that applying an operating system patch invalidates support for the whole control system.

#### “Just patch it” is not an available answer

This is the sentence that marks an IT person out in a control room, and it is worth understanding exactly why it is wrong, because it is not merely a matter of inconvenience.

| Reason patching is hard in OT | What it actually means |
|---|---|
| **The change window is the annual shutdown** | A patch that is urgent today may wait eleven months |
| **Validation and requalification** | In regulated industries, a change must be re-tested and documented before it is allowed to run |
| **Vendor certification** | The vendor supports one specific version combination, and unsupported means no help at 3 a.m. |
| **No spare capacity** | The controller may be running a process with no redundancy, so any restart is a production stop |
| **Certified safety functions** | A safety controller cannot simply be updated; the certification is attached to the version |
| **The patch may not exist** | Some controllers are out of support entirely, and no patch will ever be issued |
| **Risk of the patch itself** | A vendor patch has bricked controllers before, and bricking a controller during a campaign is worse than the vulnerability |

**So what does a defender do instead?** The answer is a set of compensating controls, and every one of them shows up again later in this lesson.

| Compensating control | How it reduces risk without touching the controller |
|---|---|
| **Segmentation and a DMZ** | The controller is not reachable from the business network or the internet |
| **A unidirectional gateway** | Data flows out of the control network and nothing flows back in |
| **Application allowlisting on the workstation** | The engineering workstation runs only the software it is meant to run |
| **Removable media control** | Nothing is plugged into a controller or a workstation without a controlled process |
| **Passive monitoring and alerting** | You detect the exploit attempt, since you cannot remove the vulnerability |
| **Physical and procedural controls** | Locked cabinets, key control, and an escort policy for visitors |
| **A documented risk acceptance** | The residual risk is written down, owned, and reviewed rather than forgotten |

**That last row is a security control**, and it is the one IT people skip. If a plant cannot patch a controller, the correct professional output is not silence and it is not a demand. It is a written record of the vulnerability, the compensating controls in place, the residual risk, and the name of the person who accepted it.

#### Vendor lock-in, as a security fact

A control system is not a collection of interchangeable parts. It is a tightly coupled product in which the programming software, the firmware, the communication protocol dialect, and the support contract all come from one vendor and are validated together.

| Consequence of lock-in | Security effect |
|---|---|
| Only the vendor's tool can program the device | A stolen engineering laptop is a stolen set of credentials to the plant |
| Firmware updates come only from the vendor | You cannot fix what the vendor will not fix |
| The vendor's remote access tool is the support channel | That tool is a remote access path into the control network |
| Proprietary protocol dialects | Generic tools may read the traffic and misread the meaning |
| Replacing a controller means re-engineering the process | A vulnerable controller stays until the plant is rebuilt |

**The second row is the one to sit with.** In IT, an unsupported component is a problem you can usually solve by migration. In OT, an unsupported controller can mean an entire production line is replaced, which is a capital project measured in years.

#### A worked example: the same vulnerability, two verdicts

Consider a high-severity remote code execution vulnerability in a service listening on a plant network.

| Step | IT version | OT version |
|---|---|---|
| Discovery | Vulnerability scanner flags the host | Passive monitoring and a vendor advisory flag the controller |
| Immediate action | Patch tonight | Determine whether the vulnerable service is reachable from anywhere untrusted |
| If unreachable | Still patch it | Document, monitor, and accept |
| If reachable | Patch, or isolate the host | Isolate at the firewall, add a detection, and raise a change request |
| Timeline | Days | Possibly the next scheduled outage |
| Verification | Rescan | Confirm no traffic reaches the service, and watch for exploitation attempts |
| Residual risk | Low | Explicitly accepted, in writing, by a named owner |

**Both columns are correct.** The difference is that the OT column contains a real option that IT does not: the system may be impossible to change, and the compensating controls have to carry the whole risk. Learning to work inside that constraint, rather than fighting it, is the core professional skill of this phase.

### Part 2 — The Purdue model, and where the firewall actually goes

#### The levels, plainly

The Purdue model is a reference architecture for industrial control systems. It is a way of naming layers of a plant so that people can argue about segmentation using the same words. It is a model, not a regulation, and real plants blur it constantly.

| Level | Name | What lives there | Typical technology |
|---|---|---|---|
| **5** | Enterprise | Email, ERP, finance, the corporate website | Cloud services and the business LAN |
| **4** | Site business planning | Site-wide IT, domain controllers, the plant's business systems | Servers and the corporate network at the site |
| **3.5** | **IT/OT DMZ** | The brokers between the two worlds | Firewalls, jump hosts, replica historians, patch and AV servers |
| **3** | Site operations | Historians, engineering workstations, patch and management servers | Windows servers, often old ones |
| **2** | Area supervisory control | HMIs, SCADA servers, operator stations | Windows workstations and thin clients |
| **1** | Basic control | PLCs, RTUs, safety controllers, drives | Embedded controllers on a control network |
| **0** | Process | Sensors, actuators, valves, motors, the physical process | Fieldbus, analogue 4–20 mA loops, and metal |

**Level 3.5 is the level people forget**, and it is the most important one in this phase. It is not part of Purdue's original numbering; it was added in practice because the boundary between business IT and plant operations needs a place to live.

#### The DMZ, explained by what it is for

The IT/OT DMZ exists so that no traffic flows directly between the corporate network and a controller. Every legitimate exchange is brokered by something that lives in the middle and can be inspected, logged, and restricted.

| What crosses the DMZ | Direction | How it is typically done |
|---|---|---|
| Process data for reporting | OT → IT | A historian replica in the DMZ, read by the business network |
| Time synchronisation | IT → OT, initiated from OT | An OT-side NTP source in the DMZ |
| Patches and antivirus definitions | IT → OT | A staging server in the DMZ, with a controlled transfer into OT |
| Vendor remote support | Outside → OT | A jump host in the DMZ, brokered, recorded, and time-limited |
| Engineering file transfer | OT → IT, and back with approval | A managed transfer with scanning and a documented approval |
| Enterprise access to a plant dashboard | IT → OT, read only | A web service in the DMZ reading the replica, never the controller |

**The direction column is where the design lives.** The safe pattern is that the OT side initiates connections outward and the IT side never initiates a connection inward. A firewall rule can enforce that, and it is far more robust than trusting an application to be well written.

#### A worked example: where the firewall belongs

An engineer at a water utility asks you to place a firewall so that the corporate office can read tank levels from the SCADA system. Here is the wrong answer and the right one.

| Option | What it looks like | Verdict |
|---|---|---|
| **A** | Firewall between level 4 and level 3, allowing the office subnet to reach the SCADA server on port 1433 | Wrong. The business network now has a direct path to a level 2 asset |
| **B** | Firewall between level 3.5 and level 3, with a historian replica in the DMZ | Workable, and it is the common pattern |
| **C** | A firewall and a unidirectional gateway at the level 3/3.5 boundary | Best. The replication is one-way by construction |
| **D** | No firewall, but the SCADA server has a strong password and a host firewall | Wrong. This is not segmentation, it is hope |

**Option C is the answer to give**, with the honest caveat that a unidirectional gateway costs money and option B is what most sites actually run. The important part is not the hardware. It is that the business network never has a route to a control device.

| Rule the firewall should enforce | Why |
|---|---|
| No initiate from level 4 to level 3 | The business network is the most exposed and the least trusted |
| Only named source and destination pairs | Blanket subnet rules recreate the flat network you are trying to leave |
| Only the specific port and protocol the application uses | A “temporary” any-any rule is how the DMZ stops existing |
| Log every denied attempt | The deny log is your detection, and your evidence that the rule is working |
| Default deny, documented, and reviewed | Rules accumulate; someone has to own them |

#### Flat networks, and how they happen

Almost every plant you read about in an incident report had, at the time of the incident, a network that was flatter than its diagram. Understanding *how* that happens is more useful than memorising the diagram.

| How a plant ends up flat | The moment it happened |
|---|---|
| “We just need this one laptop on the control network for a week” | A temporary link became permanent, undocumented |
| A cellular router was added for remote support during a maintenance contract | It was never removed when the contract ended |
| The corporate domain was extended onto the plant network for a login policy | Two trust domains became one |
| A wireless access point was added for tablets on the floor | The control network got a radio interface |
| A vendor plugged their own switch in to commission equipment | An unmanaged switch joined two segments |
| Someone enabled routing on a layer 3 switch to “make it work” | The segmentation became cosmetic |

**The cellular router row is the one that appears in almost every public account of a small-utility incident.** A device added for a temporary convenience, left in place, and reachable from the internet with a default or shared credential.

#### Zones and conduits, without the jargon

The formal language for what you have just read comes from industrial security standards, and it is worth knowing because it is how control engineers talk.

A **zone** is a group of assets that share the same security requirements — an assembly area, a packaging line, a safety system. A **conduit** is a communication path between two zones, and every conduit is a place where you can enforce and monitor something.

| Concept | Plain meaning | The security question it answers |
|---|---|---|
| Zone | A group of things with the same risk and the same trust | What am I protecting together? |
| Conduit | A path between two zones | What is allowed to talk to what, and how is it inspected? |
| Security level | How much protection a zone needs | How hard should this be? |
| Conduit monitoring | Watching what crosses | Would I notice an attack in progress? |

**Drawing the zones and conduits of a plant is the single most useful diagram you can produce in this phase.** It is also the artefact most likely to be asked for in an interview, because it demonstrates that you think in architecture rather than in tools.

### Part 3 — The protocols, and why they trust everyone

#### The design assumption you have to internalise

Several of the legacy industrial protocols in this part were designed for networks assumed to be physically isolated, electrically controlled, and reachable only by people already inside the fence. Authentication was often omitted because it was not part of that trust model, and adding it could cost bandwidth and latency. Newer protocols such as OPC UA make different security choices; the protocols in this section should not be treated as one generation or design.

**The isolation assumption is no longer safe for legacy protocols, and their basic unauthenticated behavior remains.** Newer protocols such as OPC UA have different security capabilities, but those protections still need correct configuration.

| What the designer assumed in 1979 | What is true today |
|---|---|
| The network is physically separate | It is bridged, routed, and sometimes on the internet |
| Only trusted engineers can reach it | A vendor's laptop, a contractor's tablet, and a phishing email can reach it |
| Latency matters more than identity | Identity matters enormously, and the field is slowly catching up |
| A malformed packet is a curiosity | A malformed packet can move a valve |

#### The protocol table

| Protocol | Where it came from | Transport and port | What it is for | Authentication |
|---|---|---|---|---|
| **Modbus TCP** | Modicon, 1979, over serial first | TCP, port 502 | Read and write registers and coils on a device | **None** |
| **DNP3** | Utilities, early 1990s | TCP or UDP, port 20000 | Master-to-outstation telemetry for electric and water utilities | Optional, and often unused |
| **EtherNet/IP** | Rockwell and ODVA, late 1990s | TCP port 44818, UDP port 2222 | Industrial device messaging using the CIP object model | **None** by default |
| **PROFINET** | Siemens and PROFIBUS International | Layer 2 Ethernet, and UDP for some services | Real-time I/O between a controller and its devices | **None** for real-time I/O |
| **OPC UA** | The OPC Foundation, 2006 onward | TCP, commonly port 4840 | Vendor-neutral data modelling and transport | **Yes**, with certificates and sessions |

**Read the authentication column again.** Three of the five protocols will accept a command from anyone who can reach the device. This is not a bug that will be fixed in a patch. It is the protocol.

#### Modbus TCP, in enough detail to read a capture

Modbus is the simplest of the family and the one to learn first, because once you can read a Modbus exchange you can read any of them.

A Modbus TCP packet begins with a seven-byte header, then a function code, then data.

| Field | Size | What it means |
|---|---|---|
| **Transaction identifier** | 2 bytes | Lets a client match a response to a request |
| **Protocol identifier** | 2 bytes | Always zero for Modbus |
| **Length** | 2 bytes | Number of bytes that follow |
| **Unit identifier** | 1 byte | Which device behind a gateway the request is for |
| **Function code** | 1 byte | What to do |
| **Data** | Variable | Addresses, quantities, and values |

The function codes are where the security meaning lives, and the distinction that matters is read versus write.

| Code | Name | Effect |
|---|---|---|
| 1 | Read Coils | Read on/off values. Harmless to the process |
| 2 | Read Discrete Inputs | Read on/off inputs. Harmless to the process |
| 3 | Read Holding Registers | Read numeric registers. Harmless to the process |
| 4 | Read Input Registers | Read numeric inputs. Harmless to the process |
| 5 | **Write Single Coil** | **Change an on/off output** |
| 6 | **Write Single Register** | **Change a numeric value** |
| 15 | **Write Multiple Coils** | **Change several outputs at once** |
| 16 | **Write Multiple Registers** | **Change several values at once** |
| 43 | Encapsulated interface transport | Used to read device identification |

**Function codes 1–4 are reads; 5, 6, 15, and 16 are writes. Code 43 reads device-identification information.** A defender's detection strategy for Modbus reduces to one sentence: know what reads normally look like, and alert on writes that do not fit the pattern.

Device identification, reached through function code 43, is worth knowing about because it lets a client ask a device to describe itself. It is a convenient asset-discovery mechanism and a convenient reconnaissance mechanism, depending on who is asking.

#### Reading a Modbus exchange

Here is a simplified capture of a client reading two holding registers, followed by the response. Register values are shown as raw hex and as the decimal a control engineer would recognise.

```text
--- Request: read two holding registers starting at 40001 ---
Modbus/TCP
    Transaction Identifier: 0x0001
    Protocol Identifier:  0x0000
    Length:               0x0006
    Unit Identifier:      0x01
    Function Code:        3 (Read Holding Registers)
    Reference Number:     0x0000
    Word Count:           0x0002

--- Response ---
Modbus/TCP
    Transaction Identifier: 0x0001
    Protocol Identifier:  0x0000
    Length:               0x0007
    Unit Identifier:      0x01
    Function Code:        3 (Read Holding Registers)
    Byte Count:           0x04
    Register 0:           0x00fa  (250)
    Register 1:           0x0064  (100)
```

That exchange is a normal supervisory read. Now compare it with the exchange that should make an analyst sit up.

```text
--- Request: write one coil, turning output 0 ON ---
Modbus/TCP
    Transaction Identifier: 0x0009
    Protocol Identifier:  0x0000
    Length:               0x0006
    Unit Identifier:      0x01
    Function Code:        5 (Write Single Coil)
    Output Address:       0x0000
    Output Value:         0xff00  (ON)

--- Response: an echo of the request, meaning "done" ---
Modbus/TCP
    Transaction Identifier: 0x0009
    Function Code:        5 (Write Single Coil)
    Output Address:       0x0000
    Output Value:         0xff00  (ON)
```

**The response is the whole story.** The device did what it was told, with no credential, no session, and no record beyond what crossed the wire. The only place that write exists as evidence is the packet capture and whatever the controller's own diagnostics kept.

#### DNP3, and what it adds

DNP3 is the utility protocol — electric distribution, water, and gas — and it is more sophisticated than Modbus in ways that matter to a defender.

| Feature | What it does | Security relevance |
|---|---|---|
| **Master and outstation** | One master polls many outstations | The master is a single, high-value target |
| **Unsolicited responses** | An outstation reports a change without being asked | A sudden flood of unsolicited events is a real-world signal |
| **Event buffers** | The outstation stores timestamped changes until collected | Buffer behaviour changes during an incident |
| **Control operations** | Select-before-operate, and direct operate | A control command has a visible two-step form |
| **Time synchronisation** | The master sets outstation clocks | Manipulating time corrupts the evidentiary record |
| **Secure Authentication** | An optional cryptographic authentication of critical messages | Exists, and far from universally deployed |

**The select-before-operate pattern is the one to remember.** A well-behaved DNP3 control operation is two messages: a *select* that arms the operation, then an *operate* that executes it. A direct operate skips the arming step. Both are legitimate, and the pattern differs between implementations, which is exactly why you learn the site's normal before you write a rule.

**Secure Authentication is optional and requires both ends to support it.** When you read that a utility has DNP3, the useful follow-up question is not “is it encrypted” but “is Secure Authentication enabled, and on which points”. The answer is frequently no, on an unknown subset.

#### EtherNet/IP and CIP, and the tag

EtherNet/IP is what you meet in North American manufacturing, and its vocabulary is different enough to trip you up.

Underneath it is **CIP**, the Common Industrial Protocol, an object model where every device exposes objects with attributes and services. Two kinds of messaging ride on top.

| Messaging | Transport | Behaviour | Analogy |
|---|---|---|---|
| **Implicit** | UDP, port 2222, multicast | Repeated at the control loop rate, carrying I/O data | A heartbeat that never stops |
| **Explicit** | TCP, port 44818 | Request and response, for configuration and diagnostics | A conversation |

**A control engineer talks about a tag, not a register.** A tag is a named variable in the controller's program — `Line1_Start`, `Tank2_Level`. The tag name is meaningful and the address is not, which changes how you write a finding: an unusual write is described by tag, and someone has to map the tag to the physical device before you can say what it affects.

| EtherNet/IP observation | What it might mean |
|---|---|
| A new explicit connection to a controller | Someone is commissioning, or someone is enumerating |
| A CIP service that reads the identity object | Asset discovery, from a legitimate tool or otherwise |
| A firmware update via explicit messaging | Either a maintenance window or an attack, and they look similar |
| Implicit traffic stops from one device | The device failed, or the network path did |
| An explicit connection from outside the control VLAN | The rule you thought was in place is not |

**The firmware-update row is genuinely difficult**, and honesty about that difficulty is part of the work. A legitimate firmware flash and a malicious one use the same protocol to the same port on the same device. The control that separates them is procedural — a change window, an approved tool, and a person who is expected to be there — plus a detection on the event, not on the packet contents.

#### PROFINET, and real-time traffic

PROFINET is the Siemens-side answer, and it is genuinely different because much of it is not IP at all. Real-time I/O frames travel directly on Ethernet with a dedicated EtherType, bypassing TCP/IP entirely so that the cycle time stays deterministic.

| Class | What it carries | Timing | Security consequence |
|---|---|---|---|
| **NRT** | Non-real-time: configuration, diagnostics, engineering | Milliseconds to seconds | Ordinary IP traffic, and inspectable with normal tools |
| **RT** | Cyclic I/O between controller and device | Around a millisecond | Layer 2, no IP header, and typically invisible to a layer 3 firewall |
| **IRT** | Isochronous, for motion control | Well under a millisecond | Scheduled by switches, and effectively untouchable |

**This is the part of the phase that most surprises IT-trained people.** A firewall that routes between IP subnets does not see PROFINET RT traffic, because there is no IP header to route. Segregating it means separating it at layer 2 — different physical ports, different VLANs, and switches that understand what they are carrying.

Asset discovery over PROFINET uses DCP, the Discovery and Configuration Protocol, which operates at layer 2 and can also *set* a device name and IP address. That second capability is a reminder worth carrying through the whole phase: some discovery protocols are also configuration protocols.

#### OPC UA, the least bad option

OPC UA is the modern answer to the interoperability problem, and it is the one protocol in this list that was designed with security in mind from the beginning.

| Feature | What it provides |
|---|---|
| **Information model** | Data is described by type and meaning, not just by an address |
| **Sessions** | A client establishes an authenticated session before exchanging data |
| **Certificates** | Both ends can present X.509 certificates and be mutually authenticated |
| **Message security modes** | None, sign, or sign-and-encrypt, chosen per endpoint |
| **User authentication** | Anonymous, username and password, or certificate |
| **Discovery** | A discovery endpoint that describes what a server offers |

**Two endpoints on the same server can have different security policies**, and that is where the misconfiguration lives. A server may offer a fully encrypted endpoint for the historian and a `None`-security endpoint for a legacy client that nobody remembers installing.

| Configuration | What it means in practice |
|---|---|
| Security mode `None`, anonymous user | The endpoint is exactly as open as Modbus, in a modern wrapper |
| Sign only | Tamper-evident, and readable by anyone with network access |
| Sign and encrypt, certificate user | What you should be asking for |
| A `None` endpoint left enabled “for testing” | A permanent bypass of everything else you configured |

**The honest summary of the whole protocol family:** OPC UA gives you the tools, DNP3 Secure Authentication gives you an option, and Modbus, EtherNet/IP, and PROFINET give you a design that assumes you are already safe. Your job as a defender is to supply the safety they assume.

#### The protocol comparison table

| Question | Modbus TCP | DNP3 | EtherNet/IP | PROFINET | OPC UA |
|---|---|---|---|---|---|
| Authenticates the client? | No | Optional | No | No | Yes |
| Encrypts the payload? | No | Optional | No | No | Yes, if configured |
| Visible to a layer 3 firewall? | Yes | Yes | Yes | **Partly** — RT is layer 2 | Yes |
| Readable in Wireshark out of the box? | Yes | Yes | Yes | Partly | Partly |
| Write operation is visually obvious? | Yes — function code | Yes — control operation | Less so — a CIP service | Not in a capture | Yes, with decryption |
| Typical free simulator | Many | Several | Some | Vendor tools | Several |

**That last row matters for this phase's budget.** Every protocol here has a free way to practise. You do not need a controller to learn what a write looks like.

### Part 4 — Real incidents, and the lesson each one teaches

#### How to read this part

Five incidents, in date order, each of which changed how the industry thinks. For each one the structure is the same: what happened, what the attacker actually did, the lesson, and the control that would have helped.

Two cautions before you start. First, **detail varies in quality across public accounts**, and where a detail is uncertain this lesson describes the technique rather than asserting a specific fact. Second, **attribution is not the security lesson**. Who did it matters to governments; what they did matters to you.

#### Stuxnet, discovered in 2010

**What happened.** A worm spread through Windows systems, and its payload did something that had never been seen before in malware: it reached into programmable logic controllers and manipulated the process while feeding the operators falsified readings, so the displayed values stayed normal while the physical equipment was being driven outside its limits.

**What made it different.**

| Technique | Why it was a watershed |
|---|---|
| It targeted a specific industrial process, not a company | The malware was written to recognise particular hardware configurations |
| It reached through to level 1 devices | A compromise of IT systems became a change to physical equipment |
| It replayed recorded normal readings to the HMI | The operators had no way to see what was happening |
| It used multiple Windows zero-days | It was a funded, long-running, purpose-built operation |
| It used valid but stolen signing certificates | Trust mechanisms were turned into a delivery mechanism |

**The lesson.** The air gap is not a security control on its own. Stuxnet reached an isolated environment, and the most widely accepted route was removable media carried across the boundary by people with legitimate access. **If a human can move a file into a plant, the plant is connected.**

**What would have helped.** Strict, enforced removable-media control with a dedicated scanning host; application allowlisting on engineering workstations so that unexpected code cannot run; and monitoring for controller program changes, since the ladder logic itself was modified. That last control is the one that did not exist as a product category at the time and does now.

#### The Ukraine grid attacks, 2015, 2016, and 2022

**What happened.** Three separate campaigns against electric distribution utilities, each more capable than the last. The industry treats them as one continuous story about escalation.

| Campaign | What the attackers did | What was new |
|---|---|---|
| **2015** | Opened breakers at distribution substations, leaving customers without power for hours | Remote control of field devices by an unauthorised party |
| **2016** | Used purpose-built malware that spoke the utility's own protocols automatically | Automation of control operations across many devices |
| **2022** | Combined the control malware with destructive activity on IT systems | An attempt to slow the response as well as cause the outage |

**The 2015 campaign is the one to study first**, because every technique in it is ordinary IT tradecraft.

| Step | Technique | The IT equivalent |
|---|---|---|
| 1 | Spear-phishing emails to utility staff | The most common initial access in any sector |
| 2 | Credential theft and lateral movement | Ordinary enterprise intrusion |
| 3 | Access to the SCADA environment via stolen credentials | Privilege escalation, unchanged |
| 4 | Learning the HMI, then using it as designed | The attacker used the operator's own tool |
| 5 | Opening breakers remotely | The physical consequence |
| 6 | Disabling communications and rendering HMIs unusable | Denying the operator the ability to see and respond |
| 7 | A telephone denial-of-service against the call centre | Denying the utility the ability to hear about it |

**The lesson.** The attackers did not need a zero-day in a controller. They needed a stolen password and an HMI, and the HMI did exactly what it was built to do. **The most dangerous tool in a control network is the legitimate one**, because it is authorised by definition.

**What would have helped.** Multi-factor authentication on every remote and administrative path into the control environment; network segmentation between the business network and the SCADA network so that lateral movement has a boundary to stop at; monitoring for control operations issued from unexpected sources or at unexpected times; and a manual fallback so that operators can still operate when the HMI is gone.

**The 2016 campaign** automated the same idea, using a framework that implemented the native protocols directly. That is the detail worth carrying: an attacker who understands Modbus or IEC 60870-5-104 does not need the operator's screen at all. The defence that changes is detection — a protocol-aware alert on control operations from a device that has no business issuing them.

**The 2022 campaign** added destructive activity alongside the control operations, which is a deliberate attempt to extend the outage by complicating recovery. The lesson there is about resilience rather than prevention: how quickly can you restore, and do you still have the documentation and the spare equipment to do it manually?

#### Colonial Pipeline, 2021

**What happened.** A ransomware group gained access to the corporate IT environment through a compromised password for an account that was not protected by multi-factor authentication. The company shut down the pipeline, and fuel supply across the south-eastern United States was disrupted for days.

**The point that is almost always got wrong.** This was an IT-side incident. The control systems of the pipeline were not encrypted, and the public reporting does not describe the OT network being compromised. The pipeline stopped because the business systems that support billing, scheduling, and customer management were encrypted, and the operator judged that it could not safely run the pipeline without them.

| Layer | What happened there |
|---|---|
| Level 4–5 business IT | Ransomware encrypted it. **This is where the attack happened** |
| Level 3.5 boundary | Not described as breached in public reporting |
| Level 3–2 operations | Not described as compromised |
| Level 1–0 control and process | Not described as compromised |
| The physical outcome | The pipeline was shut down, deliberately, by the operator |

**The lesson is about coupling, not about controllers.** If a business system is a prerequisite for safely running a physical process, then the security of that business system *is* an OT safety concern. Most companies do not have a documented answer to the question “could we keep operating if the billing system were gone for a week”.

**What would have helped.** Multi-factor authentication on the account that was used, which was the single missing control; a tested manual operating mode so that the business outage did not require a physical outage; segmentation and independent logging so that IT ransomware does not reach an OT management network; and a rehearsed decision process for the “do we shut down” question, made before the day it is asked.

**This case belongs in the phase because it teaches the reverse of the usual OT lesson.** Nothing exotic happened at the controller level. The consequence was physical anyway.

#### Triton, discovered in 2017

**What happened.** Malware was found on the engineering workstation of a plant's safety instrumented system. It had been written specifically to interact with the safety controllers, and the capability it was building toward was the ability to modify or disable the safety logic and the controller's own safety state.

**Why this one is different from every other incident in this part.**

| Stuxnet and the grid attacks targeted | Triton targeted |
|---|---|
| Production processes | The system that exists to stop the process safely |
| Availability of a service | The last line of defence against physical harm |
| Equipment and output | People |

**The lesson, stated plainly.** An attacker who can disable a safety system is not trying to cause an outage. They are trying to remove the barrier between a process and a catastrophe. **A safety instrumented system is never an attack surface you investigate, and never a network you scan.**

**The operational difficulty the incident exposed** is that engineering workstations are, by necessity, connected to safety controllers during maintenance. The tooling that lets an engineer verify safety logic is the same tooling that can change it. There is no version of the workflow that removes the connection, which is why the controls have to be procedural and physical.

**What would have helped.** Physical and logical separation of the safety network from the control network, so that an SIS engineer's workstation is not reachable by ordinary lateral movement; strict control of the engineering workstation and its removable media; monitoring for changes to the safety program and for the specific protocols used to program safety controllers; and a safety-specific procedure that requires two people for any change.

#### Oldsmar water treatment, 2021

**What happened.** An unauthorised person accessed a workstation at a small municipal water treatment plant through a remote access tool, and used the plant's own HMI to raise the setpoint for the chemical that adjusts the water's pH to an extreme value. An operator noticed the change on screen and reversed it within minutes.

**What actually mattered here.**

| Factor | Detail |
|---|---|
| The entry point | A remote access application that was already installed and running |
| Shared credentials | The remote access was reachable with credentials shared among staff |
| No MFA | Nothing beyond a password stood between the internet and the HMI |
| The interface used | The legitimate HMI, exactly as designed |
| The outcome | No harm, because a human was watching and acted |
| The timescale | Minutes |

**The lesson is about scale, not sophistication.** A small utility with a small budget and no dedicated security staff is a realistic target, and the path in was a consumer-grade remote access tool that nobody had threat-modelled. **Every small utility in the world has this problem**, and the fix is unglamorous: remove remote access that is not required, require MFA where it is, give every user their own credentials, and watch for setpoint changes.

**What would have helped.** A remote access path that terminates in the DMZ with MFA and a jump host rather than directly on an HMI; individual named accounts so that the access is attributable; alerting on setpoint changes outside the normal operating band; and a second person required to authorise a change of that magnitude.

#### The five lessons on one page

| Incident | Root capability the attacker needed | The control that interrupts it |
|---|---|---|
| Stuxnet | A path across an air gap, and the ability to change logic | Removable-media control, allowlisting, program-change monitoring |
| Ukraine 2015 | A stolen credential and a legitimate HMI | MFA, segmentation, control-operation monitoring |
| Ukraine 2016 | Protocol knowledge | Protocol-aware detection of unexpected control operations |
| Colonial Pipeline | A password with no second factor | MFA, a manual operating mode, IT/OT separation |
| Triton | Access to a safety engineering workstation | Safety network isolation, procedural control, safety program monitoring |
| Oldsmar | An exposed remote access tool | Remove it, or put it behind MFA and a jump host |

**Notice what is not in that table.** No memory corruption exploit, no unpatched controller, and no exotic malware technique that a defender could not address. The interruptible control in every row is architectural, procedural, or detective — not a patch.

### Part 5 — Safety instrumented systems, and the line you never cross

#### What a SIS is for

A **safety instrumented system** is an independent layer of protection whose only job is to bring a process to a safe state when the normal control system fails to. It has its own sensors, its own logic solver, its own final elements, and its own separate philosophy.

The word doing the work in that sentence is **independent**. A SIS that shares sensors or final elements with the control system it is protecting is not protecting anything, because the failure that takes out the control system takes out the protection too.

| Layer | Who owns it | What it does |
|---|---|---|
| **Basic process control** | The control system, level 1–2 | Runs the process at the setpoints the operator chooses |
| **Alarms and operator response** | The operator, at the HMI | Notices and intervenes |
| **Safety instrumented system** | The safety logic solver, level 1 | Acts automatically, without asking anyone |
| **Physical protection** | Relief valves, rupture discs, bunding | Contains the consequence when everything else fails |

This layered arrangement is the standard way the process industries think about risk, and the safety system is the layer that must work when people and control systems have both failed.

#### What a safety system actually does

A safety controller is not a smarter PLC. It is a different kind of device with a different certification and a different design goal: fail safe.

| Design property | Meaning |
|---|---|
| **Fail-safe** | A loss of power, a loss of signal, or an internal fault drives the process to the safe state |
| **Redundancy** | Voting arrangements such as two-out-of-three, so one failed channel does not cause a trip |
| **Certification** | The device and its configuration are certified against a safety standard for a target level |
| **Restricted logic** | The programming environment permits only certified function blocks |
| **Diagnostics** | Continuous self-testing that reports degradation before failure |
| **Proof testing** | Periodic testing that the whole loop still works, with the results recorded |

**Both directions of failure are dangerous, and this is the concept IT people miss.** A safety system that fails to act when it should causes an accident. A safety system that acts when it should not causes a spurious trip, which stops production, and — far more seriously — trains operators to bypass it. A plant where the safety system trips constantly is a plant where someone will eventually disable it.

#### Why Triton was a watershed

Before Triton, safety systems were discussed in security terms as an asset to be inventoried and left alone. After it, they were discussed as a target, and the entire industry changed its language.

| Before | After |
|---|---|
| “The SIS is separate, so it is out of scope” | The separation is the thing an attacker attacks |
| “Nobody would target a safety system” | Someone built tooling specifically to do it |
| Safety engineers and security teams worked separately | The two functions had to start talking |
| SIS networks were connected to control networks for convenience | Safety network isolation became an explicit requirement |
| Monitoring was aimed at the process | Monitoring was extended to the safety program itself |

**The capability that made it a watershed was not exploitation of a memory bug.** It was the ability to interact with the safety controller through its own engineering interface. That means the control that matters most is not a patch. It is who can reach the safety network, with what tool, and with whose approval.

#### The rules for this phase, stated without hedging

These are not guidelines. Treat them as prohibitions.

| Never | Because |
|---|---|
| Scan, ping, or probe a live safety network | A scan can put a safety controller into a degraded or faulted state |
| Send any packet to a safety controller you do not own | You cannot predict the effect, and the effect may be physical |
| Test a SIS in a production environment | The safety function may be unavailable at the moment it is needed |
| Attempt to read or modify safety logic outside a vendor lab | The logic is the protection, and you would be removing it |
| Assume a SIS is “just another PLC” | It is a certified device whose behaviour is part of a safety case |

**The reason these rules read as absolute is that the failure mode is not a lost record or a downtime charge.** It is an uncontrolled release, a fire, or a person being injured. That is not a rhetorical escalation; it is the definition of what a safety system exists to prevent.

#### Where the safety boundary sits in a diagram

| Location | Reachable from | What belongs there |
|---|---|---|
| Safety network | Safety engineering workstations only | Safety logic solvers and their I/O |
| A one-way path from the SIS to the control system | Outbound only, for status | Trip status and health, read by the control system |
| A path from the control network into the SIS | Nowhere | Nothing. There is no legitimate reason for it |
| A path from the business network into the SIS | Nowhere | Nothing, on any port, ever |

**The third row is the whole design.** If a control network can reach a safety network, then every compromise of the control network is also a compromise of the safety system's exposure. That path is the thing to look for first when you review a plant.

### Part 6 — Passive monitoring, which is your actual job

#### Why passive is not a preference

In every other phase, scanning a network to see what is on it is a normal, expected activity. In OT it is a decision with consequences, and the default answer is no.

| Active scanning behaviour | What it can do to a fragile device |
|---|---|
| A TCP SYN to an unopened port | Some older stacks crash or hang on unexpected packets |
| A service probe that speaks half a protocol | A device may enter a fault state waiting for the rest |
| An ARP sweep of a whole subnet | Some devices respond slowly enough to miss control traffic |
| An SNMP walk | Older agents have crashed on unusual object identifiers |
| A large number of simultaneous connections | A device with a tiny connection table stops answering legitimate clients |
| A scan during a critical process step | The worst timing, and the hardest to explain afterwards |

**You cannot tell in advance which devices are fragile.** The vendor documentation will not say. The only safe assumption is that any device might be, which makes passive collection the default rather than the cautious option.

#### Passive collection, mechanically

| Method | How it works | Trade-offs |
|---|---|---|
| **Network tap** | A hardware device physically copies the link's traffic to a monitor port | Sees everything on that link; costs money, and needs an outage to install |
| **SPAN or mirror port** | A managed switch copies selected traffic to a port | Free if the switch supports it; drops packets under load; misconfiguration is common |
| **A hub** | Every port sees every frame | Only works at low speed, and is hard to find for gigabit links |
| **A managed switch with port monitoring** | The same as SPAN, configured per port | The practical choice in a lab |
| **An inline device in a passive mode** | The device is in the path but does not transmit | Reliable, and risky if the device fails |

**A tap is not better than a SPAN port because of the hardware. It is better because it cannot drop packets under load and it cannot be misconfigured by a tired engineer at two in the morning.** For learning, a SPAN port on a managed switch is entirely sufficient, and it is free.

#### What to monitor, in priority order

| Priority | What | Why it is worth the effort |
|---|---|---|
| 1 | **Control writes** | A write is a change to the physical world, and it is the highest-signal event on the wire |
| 2 | **New connections to level 1 and 2 devices** | Almost nothing new should be talking to a controller |
| 3 | **Engineering protocol sessions** | Programming a controller should be a planned, attended event |
| 4 | **Changes to controller logic or configuration** | Detecting the change is the control when you cannot patch |
| 5 | **Removable media and workstation file writes** | The Stuxnet route into an isolated plant |
| 6 | **Authentication to engineering workstations** | The credential theft that starts most campaigns |
| 7 | **The safety network, watched and nothing else** | You monitor it, and you never send to it |
| 8 | **Outbound traffic from the control network** | A plant network reaching the internet is always a finding |

**That last row deserves its own sentence.** In a correctly built plant, level 0 through 3 devices have no reason to originate traffic to the internet. Any such connection is either a misconfiguration or an incident, and both are worth knowing about today.

#### Wireshark, on an industrial capture

You already know Wireshark. What changes is which columns and filters you care about.

| Filter | What it shows |
|---|---|
| `modbus` | Every Modbus/TCP exchange, dissected |
| `modbus.func_code == 5 \|\| modbus.func_code == 6` | Single writes to coils and registers |
| `modbus.func_code == 15 \|\| modbus.func_code == 16` | Multi-value writes, which are the higher-impact ones |
| `dnp3` | DNP3 traffic, including control operations |
| `enip` | EtherNet/IP and CIP messaging |
| `pn_rt` | PROFINET real-time frames, if the capture saw them at layer 2 |
| `opcua` | OPC UA sessions and service calls |
| `tcp.port == 502` | Anything on the Modbus port, including malformed traffic |
| `ip.src == <controller> && tcp.flags.syn == 1` | New connections to a controller — the highest-value alert |

**The last filter is the one to build a habit around.** New connections to a controller are rare, meaningful, and easy to explain to a non-specialist.

#### Zeek, for the record rather than the packet

Wireshark answers “what happened in this exchange”. Zeek answers “what has been happening on this link for the last six months”, which is the question an investigation actually asks.

| Zeek output | What it gives you |
|---|---|
| `conn.log` | Every connection, with duration and byte counts — your inventory of who talks to what |
| Protocol logs | Structured records of Modbus, DNP3, and other dissected sessions |
| `notice.log` | Policy violations and anomalies from your own scripts |
| `weird.log` | Protocol violations, which often accompany malformed or crafted traffic |
| Scripts | Custom detection written in Zeek's own language |

**`weird.log` is underrated in OT.** Legitimate industrial devices are usually well behaved and boringly consistent. Crafted or fuzzed traffic produces protocol violations, and the weird log is where they surface without you having to know in advance what to look for.

#### Suricata, for signatures and rules

Suricata is a signature engine, and for ICS the useful application is a rule that fires on a specific protocol operation rather than on a known exploit. You write these yourself, because generic rules do not know your plant.

```text
# Illustrative Suricata-style rule: flag a Modbus write function code on the
# control network. This is a teaching example, not a production rule — in a
# real deployment you would scope it to the specific clients that are allowed
# to write, and alert only on everyone else.

alert tcp any any -> any 502 (msg:"Modbus write function code observed"; \
  flow:established,to_server; \
  content:"|00 00|"; offset:2; depth:2; \
  byte_test:1,>=,15,7; \
  classtype:attempted-admin; sid:1000001; rev:1;)
```

Read the rule as a sentence. It matches established TCP to port 502, checks that the protocol identifier field is zero, then tests the byte at offset seven — the function code — and alerts when it is fifteen or above.

**The rule is deliberately crude**, and that crudeness is the honest starting point. It will fire on legitimate writes. Tuning it means learning which clients are allowed to write to which devices, which is the same inventory work that makes the firewall rules sensible. Detection and architecture converge on the same artefact: an accurate map of who talks to what.

#### GRASSMARLIN, and the asset inventory problem

You cannot monitor what you have not inventoried, and in OT the inventory is usually a spreadsheet that is years out of date. GRASSMARLIN is a free tool from the US National Security Agency that builds a network topology map from passively captured traffic, grouping devices by the protocols they speak.

| What it does | Why it matters |
|---|---|
| Reads a packet capture and infers hosts and links | No scanning, so no risk to the devices |
| Classifies devices by the industrial protocols they use | You learn which devices are controllers without asking |
| Produces a visual topology | The diagram nobody in the plant has |
| Exports the inventory | A starting point for the asset register |

**Its honest limitation is that a passive map is only as complete as the capture.** A device that was silent during the capture window will not appear, and a SPAN port that missed traffic will produce a map with holes. Say so when you present it.

#### The passive monitoring stack, assembled for free

| Layer | Tool | Cost | What it contributes |
|---|---|---|---|
| Capture | `tcpdump`, or a managed switch's mirror port | Free | The raw packets |
| Deep inspection | Wireshark | Free | Understanding one exchange completely |
| Continuous record | Zeek | Free | Connection and protocol logs you can search later |
| Signature detection | Suricata | Free | Alerts on the operations you decided matter |
| Asset inventory | GRASSMARLIN | Free | A topology from captures, without touching a device |
| Storage and search | A SIEM you already built in Phase 10 | Free | Where the alerts land and get correlated |

**That stack is genuinely competitive with commercial offerings for a small site**, and the limiting factor is not the tooling. It is whether anyone has done the work of deciding which writes are legitimate.

#### A worked example: reviewing a week of control traffic

```text
CONTROL NETWORK REVIEW — passive, capture-based, no packets sent
Source: a 7-day capture from a SPAN port on the plant's core switch.
Scope: my own simulation lab. No production network was touched.

  Observation A — a workstation writing to a controller outside any window
    Evidence    Modbus function code 6 writes from 10.20.3.14 to the
                packaging controller at 02:14 on three nights.
    Impact      Either an automated job nobody documented, or an
                unauthorised change. Both need an answer.
    Fix         Identify the process, and if it is legitimate, restrict it
                to a named source and log it. If it is not, remove it.

  Observation B — a controller initiating outbound connections
    Evidence    The filler controller opened TCP sessions to a public
                address on port 443 twice in the week.
    Impact      A level 1 device reaching the internet is a finding on its
                own, regardless of what it sent.
    Fix         Block it at the firewall, then find out why it was allowed.

  Observation C — no writes logged for the pasteuriser at all
    Evidence    The device is on the network and responds to polls, and
                the capture shows no supervisory control traffic.
    Impact      Either the operator uses local control only, or the
                capture is missing a segment. Both change the assessment.
    Fix         Confirm the SPAN configuration covers both VLANs, then
                re-check. Do not assume silence means safety.

  Limitations
    The capture covers one switch. Any device reachable only through
    another segment is invisible here, and the asset list is therefore
    incomplete rather than authoritative. No active discovery was used,
    deliberately: the devices are fragile and the plant was running.
```

**Observation C is the most valuable entry in that review.** A defender who reports only what they saw has reported half of an assessment. Reporting what the data cannot tell you — and why — is what makes the map trustworthy.

### Part 7 — Building a practice range for nothing

#### The rule that governs your lab

Everything in this part happens on equipment you own, on a network that is not connected to anything that matters. That constraint is not an inconvenience. It is what makes the practice safe, repeatable, and legal.

| Rule | Why |
|---|---|
| One machine, or one isolated switch, that is yours | No production network, no shared infrastructure |
| No connection between your lab and any plant | A lab that can reach a plant is a plant attack waiting to happen |
| Powered-off when you are not using it | A software PLC is still a device listening on a port |
| Documented as a lab, in writing | If anyone asks, the answer should be obvious |
| Nothing from a real site, ever | No production captures with real process data in a portfolio |

#### What is free and what it gives you

| Environment | What it provides | Cost | Why it is worth your time |
|---|---|---|---|
| **Software PLCs** | A controller implemented as a program on your own computer | Free | The protocol facts are identical to hardware |
| **Protocol simulators** | Tools that answer Modbus, DNP3, or OPC UA requests | Free | You can generate the traffic you need to study |
| **Open-source SCADA and HMI projects** | A supervisory layer and a screen | Free | You see the operator's view, which is the attacker's target |
| **Vendor virtual environments** | A vendor's own simulated plant, for training and demos | Free | The closest thing to the real product without buying it |
| **A Raspberry Pi** | A small, cheap host that can run a PLC or a collector | Low, and often already owned | Makes the lab physical without being expensive |
| **Wireshark, Zeek, Suricata, GRASSMARLIN** | The whole monitoring stack | Free | The same tools used in production |
| **Public protocol documentation** | Frame formats and function codes | Free | The reference you will return to constantly |
| **Published incident reports** | Real cases with real detail | Free | The case-study material for your portfolio |

**Vendor simulation environments are the most underused free resource in this field.** Several major automation vendors publish virtualised versions of their engineering software and simulated controllers for training purposes. The terms vary and some require registration, so read the licence before you rely on one, and never assume a training licence permits anything beyond the vendor's own simulated environment.

#### A $0 lab, built in an afternoon

```text
LAB TOPOLOGY — one host, entirely virtual, no connection out

  [ Windows or Linux host ]
        |
        +-- (Virtual switch, host-only network, no NAT)
        |
        +-- [ VM 1: the "plant" ]
        |      A software PLC listening on 502
        |      A DNP3 outstation if you have one
        |      A second instance on a different port for a second device
        |
        +-- [ VM 2: the "operator" ]
        |      A simple HMI or a scripting client
        |      The engineering tool for the software PLC
        |
        +-- [ VM 3: the analyst ]
               Zeek capturing on the host-only interface
               Wireshark for inspection
               GRASSMARLIN fed with saved captures

  Important: the virtual switch is host-only. Nothing in this lab can
  reach your home network, and nothing outside can reach the lab.
```

**Every VM in that diagram is free.** The software PLC is free, the HMI can be a free project or a few lines of Python, and the analysis tools are all open source. The only cost is disk space.

#### A worked example: your first Modbus capture

```text
WHAT I DID (my own lab, my own VM, no external target)

  1. Started a software PLC in a VM, listening on TCP 502, and noted the
     starting values of its holding registers.
  2. Started Zeek on the host-only interface and began capturing.
  3. From the client VM, issued a read: function code 3, two registers
     from address 0.
  4. In Wireshark, filtered on `modbus` and confirmed the request and
     the response.
  5. Then issued a write: function code 6, address 0, a new value.
  6. Confirmed in the HMI that the displayed value changed.
  7. Wrote a Zeek or Suricata rule that fires on any write function code,
     and reran the read and the write to confirm it fires on one and
     not the other.

WHAT I WROTE UP
  - The two captures, with the function codes annotated.
  - A one-paragraph explanation of why the device accepted the write
    from an unauthenticated client, and what that means for a plant.
  - The detection rule, and an honest note on what it would need in a
    real plant to avoid alerting on legitimate writes.
  - The limitation: this is a simulator, and a real controller may
    behave differently under load, on a lossy link, or during a fault.
```

**Step seven is the one that turns a lab exercise into a portfolio artefact.** Anyone can capture traffic. Producing a detection from it, and stating honestly what it would take to deploy it, is the work.

#### Where the free depth runs out, and what to do about it

| You cannot practise this for free | The honest substitute |
|---|---|
| A real safety instrumented system | Read about the architecture and never touch one; simulate the concept, not the device |
| A certified redundant controller | Understand the concept; a software PLC teaches the protocol, not the hardware |
| PROFINET IRT timing behaviour | Read the specification, and say in an interview that you have not worked with it |
| A real historian at scale | A database and a collector script teach the data flow |
| A plant with real consequences | Nothing substitutes for this, which is why the field is learned on the job |

**Naming that last row honestly in an interview is a strength, not a weakness.** The people hiring for these roles know that nobody arrives with production OT experience, because there is no safe way to get it outside employment.

### Part 8 — The safety, legal, and ethical boundary

#### The sentence to memorise

**Never send a packet to a control system you do not own, and never send one to a safety system at all.**

Everything else in this part elaborates that sentence. Nothing in it is negotiable, and the reason is not primarily legal. It is that you cannot predict what a packet will do to a device attached to a physical process.

#### Why OT is more dangerous than anything else in this roadmap

The previous phases warned you about unauthorised access. This phase has to warn you about something worse.

| Phase | Worst realistic outcome of careless testing | OT |
|---|---|---|
| Web application security | A breach, a downed service, a lawsuit | The same, plus a physical process driven outside its limits |
| Cloud and identity | Exposed data and a large bill | The same, plus a control plane attached to equipment |
| OT and ICS | Not applicable | Injury, fire, environmental release, and loss of life |

**That table is the reason this phase has a longer boundary section than any other.** The technology is not more complicated. The consequence is categorically different.

#### What a network scan can do to a fragile device

| Action you might consider harmless | What can happen on old or odd hardware |
|---|---|
| A ping sweep | Some devices log a fault, some stop answering for a period, a few have crashed |
| An Nmap service scan | Half-open protocol probes put devices into unexpected states |
| An SNMP walk | Agents have crashed on unusual object identifiers |
| A connection flood | A device with a small connection table stops serving its real clients |
| A protocol fuzz | There is no expectation of graceful handling |
| Any of the above during a batch or a start-up sequence | The worst possible moment, and the hardest to explain |

**The correct assumption is that the device is fragile until proven otherwise, and the proof involves risk you do not get to take on someone else's behalf.**

#### The legal position

Unauthorised access to a computer system is a criminal offence in most jurisdictions, and the Philippines is no exception under Republic Act 10175. In OT that general position is sharper, because the same act can also engage workplace safety law, environmental regulation, and civil liability for the consequences of disrupting a process.

| What you might believe | What the law and the plant see |
|---|---|
| “It is an internal network, so it is not really someone else's” | Ownership decides, not location |
| “I only read traffic” | Tapping a network you do not own is interception |
| “Nothing changed, so nothing happened” | A safety-related interruption is a consequence regardless of intent |
| “I was hired to look, so I can look anywhere” | The scope document is the authorisation, and it has edges |
| “The vendor said I could” | The asset owner's authorisation is the one that matters |
| “I used the vendor's own tool” | The tool is not the permission |
| “It was a test system” | A test system attached to a live process is a live process |
| “Nobody was hurt” | Outcome affects sentencing, not whether an offence occurred |

**The fourth row is where professional engagements go wrong.** An OT assessment needs a scope that names the zones, the assets, the techniques permitted, the windows, and the exclusion of the safety system — in writing, signed, before anyone connects anything.

#### The instruments that make OT work possible

| Instrument | What it must say for OT specifically |
|---|---|
| **Rules of engagement** | Zones in scope, techniques permitted, and an explicit safety-system exclusion |
| **Change and permit process** | Who has authorised this, for which window, and who can call a stop |
| **A shutdown or rollback plan** | What happens if a device does not come back |
| **Vendor involvement** | Who from the vendor is present or on call |
| **A stop-work authority** | Anyone in the room can halt the work for a safety reason, without justifying it |
| **Insurance and indemnity** | Who carries the consequence if a process stops |

**The stop-work authority row is the mark of a mature OT engagement.** If the person closest to the process cannot stop the assessment with a word, the assessment is not being run safely.

#### Where you practise, which is free and unlimited

| Target | What it teaches | Cost |
|---|---|---|
| **Your own virtual lab** | Protocols, captures, detection rules, and the whole monitoring stack | Free |
| **A software PLC on your own machine** | Controller behaviour and engineering workflows | Free |
| **Public protocol simulators** | Generating traffic you can study and detect | Free |
| **Vendor simulation environments, under their terms** | The real product in a sanctioned sandbox | Free |
| **Publicly released malware analyses and incident reports** | The case-study material for your write-ups | Free |
| **A capture someone else published for training** | Traffic you did not have to generate | Free |

**There is no reason to test a live OT network**, and the reason is stronger here than anywhere else in the roadmap. A lab gives you a known answer and a device that cannot hurt anyone. A live plant gives you neither, and the person who pays for your mistake is not you.

#### If you find a vulnerability in a control system

| Step | What you do | What you do not do |
|---|---|---|
| 1 | Stop, and do not confirm it | Connect to the device to see how far it goes |
| 2 | Record what you have, factually | Access any more of the system than you already did |
| 3 | Notify the asset owner immediately | Post about it, or discuss it in a public forum |
| 4 | Notify the vendor through its security contact or its product security process | Publish a proof of concept |
| 5 | Keep every message, timestamped | Delete anything |
| 6 | Let the vendor and the owner coordinate disclosure | Set your own deadline |

**Step one is different from its equivalent in the web phase, and the difference is important.** On the web, continuing to explore is a legal risk. On a control system, continuing to explore is a physical risk to people who are not part of the conversation.

#### What you still cannot do after this phase

You will be able to read control traffic, name what you are looking at, explain why it is unauthenticated, and describe what a defender should do about it. That is a genuine and uncommon skill.

You **cannot** design a segmentation scheme for a real plant. You have not modelled a process, you have not worked inside a change-control process that can take eleven months to approve a rule, and you have never had to justify a firewall change to someone who is measured on production uptime. You have also never seen a real historian at scale, a redundant controller in a voting arrangement, or a live safety system — and you should not have.

| You can | You cannot yet |
|---|---|
| Name the Purdue level of a device and justify it | Design and defend a segmentation scheme inside a real change process |
| Identify Modbus, DNP3, EtherNet/IP, PROFINET, and OPC UA traffic | Tune a protocol-aware detection against a real plant's legitimate traffic |
| Explain why the protocols do not authenticate and what that costs | Assess a vendor's product security claims from the inside |
| Build a passive monitoring stack from free tools | Operate a monitoring stack under a plant's availability constraints |
| Analyse an incident and name the control that would have interrupted it | Lead an OT incident response with a process running and a clock ticking |
| State the safety boundary precisely and refuse to cross it | Work safely in a live plant, which comes with experience and supervision |

**In an interview, say:** “I understand the Purdue model and the inverted triad. I can read Modbus, DNP3, EtherNet/IP, and OPC UA traffic in a capture and explain why they trust the network, and I have built a passive monitoring lab with Zeek and Suricata against software PLCs. I have deliberately never touched a live control network or a safety system — that is the boundary I work to, and I would expect to learn a real plant under supervision.”

Naming that boundary as a professional choice, rather than as a gap, is the thing that lands.

### Key takeaways

- **OT inverts the triad: safety first, then availability, then integrity, and confidentiality last.** If you remember one thing from this phase, remember that ordering and why it is not a mistake.
- **“Just patch it” is not an available answer.** The change window may be an annual shutdown, the vendor may not support the patch, and the controller may have no redundancy.
- **Compensating controls carry the risk you cannot patch away**, and a written, owned risk acceptance is one of those controls, not an admission of failure.
- **Purdue level 3.5, the IT/OT DMZ, is where the design lives.** The safe rule is that the OT side initiates outward and the business side never initiates inward.
- **Flat networks happen by accident, one temporary link at a time.** The cellular router installed for a maintenance contract is the most common culprit in public accounts of small-utility incidents.
- **Thinking in zones and conduits is the skill that gets hired.** It is architecture, and it is what a control engineer can actually act on.
- **Modbus, EtherNet/IP, and PROFINET authenticate nothing.** This is the design, not a bug awaiting a patch.
- **DNP3 Secure Authentication and OPC UA security modes exist and are frequently left unconfigured.** Ask which endpoints, not whether the protocol supports it.
- **In Modbus, codes 1–4 are reads and codes 5, 6, 15 and 16 are writes.** That single distinction is most of your detection strategy. Do not turn it into a numeric threshold: code 43 sits above the writes and is a read.
- **PROFINET real-time traffic has no IP header**, so a routing firewall does not see it. Layer 2 separation is a different control from subnet separation.
- **A safety instrumented system is a human-safety control, not a PLC.** You monitor it and you never send to it, and Triton is the reason the whole industry changed its language.
- **Passive monitoring is the core defensive technique in OT**, because active scanning can put a fragile controller into a fault state.
- **A SPAN port plus Zeek, Suricata, Wireshark, and GRASSMARLIN is a real monitoring stack**, and every software part of it is free. The hardware tap you would rather have is the one paid item, and a managed switch's mirror port does the same job in a lab.
- **New connections to a controller and any write outside the normal pattern are the two highest-signal events on a plant network.**
- **Colonial Pipeline was an IT-side ransomware incident with an OT consequence.** The lesson is about business-system coupling and a missing second factor, not about controllers.
- **Stuxnet proved the air gap is not a control.** If a person can carry a file into a plant, the plant is connected.
- **The most dangerous tool in a control network is the legitimate one**, because it is authorised by definition. That is why the operator's HMI was the weapon in 2015 and in Oldsmar.
- **Never send a packet to a control system you do not own, and never send one to a safety system at all.** The legal position is serious; the safety position is the one that should stop you.

### Practice this next

The ten tasks build an OT security capability entirely on free software and your own hardware, and they end with write-ups rather than flags. Work them in order, and do the reading task first.

1. **Read the boundary first** (task 1), before you open a single tool. Write down the rules you will not break, and keep the note where you will see it while you work. Everything else in this phase depends on that note being real.
2. **Draw the Purdue diagram from memory** (task 2), then check it against this lesson. Move on only when you can place a historian, a safety controller, an engineering workstation, a jump host, and a replica historian correctly without looking.
3. **Build the lab before you study the protocols** (task 3). A software PLC, an HMI, a client, and an analyst VM on a host-only virtual switch. Confirm the lab cannot reach your home network before you go further.
4. **Learn Modbus by capturing it, not by reading about it** (task 4). Make a read happen, make a write happen, and annotate both in Wireshark. Then explain in writing why the device accepted the write.
5. **Turn the capture into a detection** (task 5). Write a rule that fires on writes and not on reads, then run both again to prove it. Note honestly what would need tuning before it could run in a real plant.
6. **Do the same for DNP3 and one IP-based protocol** (task 6), so that you have met a utility protocol and a manufacturing one. For each, write down what a select-before-operate looks like and what a direct operate looks like.
7. **Build the passive asset map** (task 7). Save a long capture, feed it to GRASSMARLIN, and compare the map it produces with what you know is in the lab. Then write down what the map missed and why.
8. **Write the five incident case studies** (task 8) in one consistent format: what happened, the technique, the lesson, and the control that would have interrupted it. Include Colonial Pipeline and explain why it belongs in an OT phase despite being an IT incident.
9. **Produce the segmentation design and the monitoring plan** (task 9) for your simulated plant, as documents a control engineer could review. Include the deny log as a detection source, and state one thing you deliberately chose not to monitor and why.
10. **Write the boundary note and the limitations section** (task 10) that will close your portfolio entry. It should say what you can do, what you have never touched, and why that is a professional choice rather than an accident.

Then open `portfolio/cyber/15-ot-ics-security.md` and assemble the deliverables. **The phase is done when you can describe an OT network in Purdue levels, read the protocol traffic on it, explain why it trusts everyone, analyse an incident and name the control that would have interrupted it, and state the safety boundary without hesitating** — and the write-ups should be good enough that a control engineer reading them would recognise their own plant.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Wireshark | Packet capture and protocol dissection | Free/open-source | https://www.wireshark.org/ | Dissect a Modbus read and a write and annotate the function codes | `tshark` on the command line |
| Zeek | Network security monitoring that produces structured logs | Free/open-source | https://zeek.org/ | Capture a lab session and find every connection in `conn.log` | Suricata in its logging mode, or `tcpdump` plus scripts |
| Suricata | Signature and protocol-aware intrusion detection | Free/open-source | https://suricata.io/ | Write a rule that fires on Modbus write function codes | Zeek scripts, or Python over `tshark` output |
| `tcpdump` | Command-line packet capture | Free/open-source | https://www.tcpdump.org/ | Capture Modbus traffic to a file for later analysis | Wireshark's own capture, or `dumpcap` |
| GRASSMARLIN | Passive network topology and asset mapping for ICS | Free | https://github.com/nsacyber/GRASSMARLIN | Build a topology map from a saved lab capture | Zeek `conn.log` analysis, or a hand-drawn map from captures |
| NetworkMiner | Passive host, session, and file extraction from captures | Freemium | https://www.netresec.com/?page=NetworkMiner | List hosts and sessions from your lab capture | Wireshark's conversations view |
| OpenPLC | Free software PLC runtime for protocol practice | Free/open-source | https://openplcproject.com/ | Run a controller and make it answer Modbus requests | Any free Modbus server simulator |
| Scapy | Packet crafting in Python, for building test traffic | Free/open-source | https://scapy.net/ | Build a Modbus read request by hand in a packet — **against your own simulator only** | `pymodbus` in client mode |
| pymodbus | Python library for Modbus clients and servers | Free/open-source | https://pymodbus.readthedocs.io/ | Write a script that reads and writes a register in your lab | `libmodbus`, or Scapy |
| Wazuh | Free SIEM for collecting and alerting on logs | Free/open-source | https://wazuh.com/ | Ship Zeek logs into it and build one alert | Elastic Stack, or Splunk Free |
| Shodan | Search engine for internet-exposed devices | Freemium | https://www.shodan.io/ | Read public documentation on exposed industrial services | Censys free tier, or reading published research instead |
| VirtualBox | Run the lab VMs for a simulated plant | Free | https://www.virtualbox.org/ | Build a host-only network with three VMs | Hyper-V, KVM, or VMware Workstation Pro (free) |

## Free/cheap resources

- CISA ICS publications and advisories — https://www.cisa.gov/topics/industrial-control-systems
- CISA ICS training courses, including the free online foundations course — https://www.cisa.gov/ics-training-available-through-cisa
- NIST Guide to Operational Technology Security — https://csrc.nist.gov/pubs/sp/800/82/r3/final
- MITRE ATT&CK for ICS — https://attack.mitre.org/matrices/ics/
- SANS ICS security posters and reading room — https://www.sans.org/ics/
- Wireshark user's guide — https://www.wireshark.org/docs/
- Zeek documentation — https://docs.zeek.org/
- Suricata documentation — https://docs.suricata.io/
- Modbus Application Protocol specification — https://modbus.org/specs.php
- DNP3 primer and technical documentation — https://www.dnp.org/
- OPC Foundation specifications and overview — https://opcfoundation.org/
- ODVA resources on EtherNet/IP and CIP — https://www.odva.org/
- OpenPLC project documentation — https://openplcproject.com/docs/
- GRASSMARLIN on GitHub — https://github.com/nsacyber/GRASSMARLIN

## Hands-on practice tasks

1. Write a one-page safety and legal boundary note for OT work, listing what you will never scan or touch, before you open any tool. <!-- id: cyber-15-t01 band: quick energy: low -->
2. Draw the Purdue model for a plant you invent, placing a historian, an HMI, an engineering workstation, a safety controller, a jump host, and a firewall, then check it against this lesson. <!-- id: cyber-15-t02 band: focused energy: normal -->
3. Build a host-only virtual lab with a software PLC, a client, an HMI, and a separate analyser host, and confirm it cannot reach your home network. <!-- id: cyber-15-t03 band: deep energy: high -->
4. Capture a Modbus read and a Modbus write in your lab, annotate the function codes in Wireshark, and explain why the write was accepted. <!-- id: cyber-15-t04 band: focused energy: normal -->
5. Write a detection rule that fires on Modbus write function codes and not on reads, and prove it by replaying both. <!-- id: cyber-15-t05 band: focused energy: normal -->
6. Capture and describe one DNP3 exchange and one EtherNet/IP or OPC UA exchange, noting what each protocol does and does not authenticate. <!-- id: cyber-15-t06 band: deep energy: high -->
7. Generate a long lab capture, build a passive asset map with GRASSMARLIN, and write down what the map missed and why. <!-- id: cyber-15-t07 band: focused energy: normal -->
8. Write up Stuxnet, the Ukraine 2015 campaign, Colonial Pipeline, Triton, and Oldsmar in one consistent four-part format. <!-- id: cyber-15-t08 band: deep energy: high -->
9. Produce a zones-and-conduits design and a passive monitoring plan for your simulated plant, including what you would alert on and what you would not. <!-- id: cyber-15-t09 band: deep energy: high -->
10. Write the limitations section for your portfolio entry, stating what you have practised and what you have deliberately never touched. <!-- id: cyber-15-t10 band: quick energy: low -->

## Deliverable / proof of work

Create `portfolio/cyber/15-ot-ics-security.md` with:

- A safety and legal boundary note written before any tool was opened
- A Purdue model diagram for an invented plant with every asset placed and justified
- A description and diagram of your host-only simulation lab, with the isolation confirmed
- Annotated Wireshark captures of a Modbus read and a Modbus write, with the function codes named
- A working detection rule for control writes, with evidence that it fires on writes and not on reads
- A capture-based comparison of two protocols, stating what each one authenticates
- A passive asset map built with GRASSMARLIN, with an honest note on what it missed
- Five incident case studies in a consistent four-part format
- A zones-and-conduits segmentation design with a firewall rule list for a simulated plant
- A passive monitoring plan naming the events you would alert on and the ones you would not
- A limitations section stating what you have not touched and why that is a professional choice

## Quiz

### Q1. A plant manager asks why confidentiality is not the top priority on the control network. What is the right answer from this phase? <!-- id: cyber-15-q01 energy: normal -->

- [x] Because safety and availability come first, with integrity next and confidentiality last
- [ ] Because control networks hold no data worth protecting
- [ ] Because confidentiality is impossible to achieve on industrial protocols
- [ ] Because the vendor contract forbids encrypting control traffic

**Why:** OT inverts the usual triad — safety, then availability, then integrity, with confidentiality last — because the process must keep running and must not harm anyone. Saying control networks hold nothing valuable is the trap: the point is the ordering, not a claim that the data is worthless.

### Q2. You have a passive capture and see a frame with function code 6 sent to TCP port 502. What is happening? <!-- id: cyber-15-q02 energy: normal -->

- [ ] A read of a single holding register from a Modbus server
- [x] A write of a single register, which is a change to the physical world
- [ ] A DNP3 select-before-operate sequence
- [ ] A PROFINET real-time frame with no IP header

**Why:** In Modbus, codes 1–4 are reads while 5, 6, 15, and 16 are writes, which makes code 6 a single-register write. Reading it as a read is the trap, and it is the mistake the phase warns about directly — the read/write split is most of the detection strategy.

### Q3. You are asked to inventory the devices on a running plant network. Why does this phase reject an Nmap scan? <!-- id: cyber-15-q03 energy: high -->

- [ ] Because Nmap produces an inventory too incomplete to be useful
- [ ] Because the plant's firewall would block the scan and waste the effort
- [ ] Because the scan requires a licence the plant does not hold
- [x] Because scans and probes can put fragile devices into a degraded or faulted state

**Why:** The correct assumption is that any device might be fragile, and you cannot tell in advance which — so passive collection is the default. Worrying only about scan completeness is the trap, because the risk is not a bad inventory but a controller that stops answering or trips.

### Q4. A safety instrumented system shares its sensors with the control system it is meant to protect. Why is that a problem? <!-- id: cyber-15-q04 energy: high -->

- [ ] It makes the SIS slower to respond than the control system
- [x] The failure that takes out the control system takes out the protection too
- [ ] It requires the SIS to be patched on the same schedule as the PLC
- [ ] It causes the SIS to authenticate against the control network

**Why:** The word doing the work in the definition is *independent* — the SIS must have its own sensors, logic solver, and final elements. Assuming the issue is speed or patching is the trap: shared components mean a single failure removes both the control and the layer meant to catch it.

### Q5. A level 1 controller is observed opening an outbound TCP session to a public address on port 443. What does this phase say about that? <!-- id: cyber-15-q05 energy: normal -->

- [ ] It is normal, because controllers push telemetry to vendor clouds by design
- [ ] It is harmless as long as the traffic is encrypted
- [ ] It only matters if the controller also accepts inbound connections
- [x] It is a finding on its own, regardless of what was sent

**Why:** In a correctly built plant, level 0 through 3 devices have no reason to originate traffic to the internet, so any such connection is either a misconfiguration or an incident. Calling it normal telemetry is the trap — the phase states there is no legitimate reason for these devices to reach outward.

### Q6. Why does this phase describe Triton as a watershed for the industry? <!-- id: cyber-15-q06 energy: high -->

- [x] It made the safety system a target, because the capability was reaching it through its own engineering interface
- [ ] It proved that air-gapped networks can be reached by removable media
- [ ] It showed that a business network compromise can halt a pipeline
- [ ] It was the first case of ransomware with a physical consequence

**Why:** What changed the language was the ability to interact with a safety controller through its engineering interface, which is why the control that matters is who can reach the safety network. Attributing it to removable media is the trap — that is the Stuxnet lesson, a different incident with a different mechanism.

### Q7. You are building a free lab to practise OT protocols. Which isolation property does this phase require? <!-- id: cyber-15-q07 energy: normal -->

- [ ] The lab may share the home network as long as production is not targeted
- [ ] The lab may reach a real plant if a weekly capture is scheduled
- [x] The lab must be host-only, with no path to any real network in either direction
- [ ] The lab needs a firewall rule allowing inbound only from the analyst host

**Why:** A lab that can reach a plant is a plant attack waiting to happen, so the virtual switch must be host-only. Allowing inbound only from the analyst host is the trap — a rule with any inbound path still leaves a route into the lab from outside it.

### Q8. In a Wireshark capture of a plant network, which filter does this phase call the highest-value alert to build a habit around? <!-- id: cyber-15-q08 energy: normal -->

- [ ] `tcp.port == 502`, which catches every Modbus packet
- [ ] `modbus`, which dissects every Modbus exchange
- [ ] `weird.log`, which lists protocol violations
- [x] New connections to a controller, matched by a SYN to that controller's address

**Why:** New connections to a controller are rare, meaningful, and easy to explain to a non-specialist, which is what makes them worth alerting on. Picking the broad port filter is the trap — it matches all normal polling traffic too, so it would drown the signal it was meant to surface.

### Q9. Colonial Pipeline appears in an OT phase. How does this phase want you to explain it? <!-- id: cyber-15-q09 energy: high -->

- [x] As an IT-side ransomware incident with an OT consequence, about business-system coupling and a missing second factor
- [ ] As a controller exploit that drove a physical process outside its limits
- [ ] As a safety system attack that required disabling the SIS
- [ ] As a supply-chain attack on an industrial vendor's engineering software

**Why:** The lesson is about business-system coupling and a single missing factor, not about controllers at all — which is exactly why it belongs in the phase. Calling it a controller exploit is the trap, and the phase says so directly because the distinction is the point of the case study.

### Q10. Which of these protocols authenticates nothing, by design rather than through a missing patch? <!-- id: cyber-15-q10 energy: low -->

- [ ] DNP3, because Secure Authentication is optional and left unconfigured
- [ ] OPC UA, because its security modes are frequently left off
- [x] Modbus, EtherNet/IP, and PROFINET, which authenticate nothing at all
- [ ] All of them, because no industrial protocol supports authentication

**Why:** These three trust the network entirely — this is the design, not a bug awaiting a patch. Lumping DNP3 and OPC UA in with them is the trap: those two *do* have security mechanisms, and the correct question is which endpoints have them configured.

### Q11. A colleague proposes using the switch's SPAN port instead of buying a hardware tap. What does this phase say a tap is actually better at? <!-- id: cyber-15-q11 energy: high -->

- [ ] A tap decrypts industrial protocols that a SPAN port cannot
- [x] A tap cannot drop packets under load and cannot be misconfigured by a tired engineer
- [ ] A tap can send selective probes that a SPAN port cannot
- [ ] A tap captures layer 2 frames that a SPAN port never sees

**Why:** The advantage is reliability rather than hardware capability — a tap is physically in the path and has no configuration to get wrong. Expecting a tap to decrypt or probe is the trap, because a passive tap transmits nothing and industrial protocols carry no encryption to break.

### Q12. You find a vulnerability in a control system while reading a capture. What is the first step this phase gives you? <!-- id: cyber-15-q12 energy: high -->

- [ ] Connect to the device to see how far the flaw goes
- [ ] Publish a proof of concept so the vendor responds faster
- [ ] Set a disclosure deadline and tell the vendor you will publish
- [x] Stop, do not confirm it, record what you have, and notify the asset owner immediately

**Why:** On a control system, continuing to explore is a physical risk to people who are not part of the conversation, so step one is to stop. Connecting to confirm is the trap — on the web that is a legal risk, and here it can also move a real process.

## Checklist

- [ ] I can explain the inverted triad and why confidentiality comes last in OT. <!-- id: cyber-15-inverted-triad energy: low -->
- [ ] I can place any device into a Purdue level and justify the placement. <!-- id: cyber-15-purdue-placement energy: normal -->
- [ ] I can explain what an IT/OT DMZ is for and where a firewall belongs. <!-- id: cyber-15-dmz-design energy: normal -->
- [ ] I can explain why "just patch it" is not an available answer in a plant. <!-- id: cyber-15-patching-constraints energy: low -->
- [ ] I can identify Modbus TCP traffic from a capture and name the function code. <!-- id: cyber-15-modbus-reading energy: normal -->
- [ ] I can say precisely which industrial protocols authenticate anything. <!-- id: cyber-15-protocol-auth energy: normal -->
- [ ] I can explain why active scanning is dangerous on a control network. <!-- id: cyber-15-scanning-risk energy: low -->
- [ ] I built a passive monitoring stack from free tools and captured control traffic. <!-- id: cyber-15-passive-monitoring energy: normal -->
- [ ] I wrote a detection rule for control writes and proved it does not fire on reads. <!-- id: cyber-15-write-detection energy: normal -->
- [ ] I can explain what a safety instrumented system is and why it is never touched. <!-- id: cyber-15-sis-boundary energy: low -->
- [ ] I can analyse an incident and name the control that would have interrupted it. <!-- id: cyber-15-incident-analysis energy: normal -->
- [ ] I can explain why Colonial Pipeline was an IT incident with an OT consequence. <!-- id: cyber-15-colonial-reasoning energy: low -->
- [ ] I can describe zones and conduits in plain language and draw them. <!-- id: cyber-15-zones-conduits energy: normal -->
- [ ] I built a simulated plant lab that cannot reach any real network. <!-- id: cyber-15-lab-isolation energy: normal -->
- [ ] I used GRASSMARLIN and stated honestly what the passive map missed. <!-- id: cyber-15-asset-mapping energy: normal -->
- [ ] I wrote the safety and legal boundary down before I started working. <!-- id: cyber-15-ot-legal-boundaries energy: low -->
- [ ] I can state what I have not touched and why that is a professional choice. <!-- id: cyber-15-limitations-honesty energy: low -->

## You're ready to move on when...

You can describe an OT network in Purdue levels, explain why availability and safety outrank confidentiality there, identify an industrial protocol from a packet capture and say what it cannot authenticate, analyse a real incident and name the control that would have stopped it, and state plainly why you never scan a live control network.

## Free vs Paid

### What's free and enough

Every tool this phase needs is free. Wireshark, Zeek, Suricata, `tcpdump`, and GRASSMARLIN are open source, and together they are a genuine passive monitoring stack rather than a demo. OpenPLC and the free protocol simulators give you a controller to talk to without buying hardware. The CISA ICS publications, the free CISA online foundations course, the NIST operational technology security guidance, and the MITRE ATT&CK for ICS matrix are free and are the documents practitioners actually use. This phase is unusual in the roadmap because the free material is not a substitute for the paid material — for a beginner, it is simply the material. Nothing here requires you to spend anything.

### What's paid and why you'd upgrade

Commercial OT monitoring platforms such as Nozomi, Claroty, Dragos, and Microsoft Defender for IoT add deep protocol coverage, continuous asset discovery in a single appliance, and support contracts that a plant needs when something goes wrong at three in the morning. A physical lab — a rack, a real PLC, a managed switch with port mirroring — teaches hardware behaviour that no simulator reproduces. Hardware taps cost money and are more reliable than SPAN ports. Vendor training and certification in OT security carries weight in industrial hiring, and the SANS ICS courses are the recognised benchmark and are priced accordingly. Paid capture libraries and a subscription to an OT threat intelligence feed save the time you would spend collecting your own.

### When it's worth paying

Pay for hardware only once you have finished everything free and can name the specific behaviour you cannot reproduce without it — a real controller's handling of a fault, a managed switch's behaviour under a mirror port load, or the timing of a real control loop. Pay for vendor OT training when you are already working in or adjacent to an industrial environment and an employer will sponsor it, because the courses assume plant context you will not have as an outsider. Pay for a commercial monitoring platform never as an individual: it is a plant-scale purchase with a plant-scale support contract, and no home lab justifies it. For a learner on a $0 budget, this phase is genuinely completable to a credible standard for nothing, and the differentiator in an interview will not be which tools you own. It will be whether you can read a Modbus write in a capture, explain in one sentence why the device accepted it, and describe the control that would have prevented it — along with the boundary you refuse to cross.
