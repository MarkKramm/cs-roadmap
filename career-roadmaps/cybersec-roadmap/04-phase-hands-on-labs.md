---
id: cyber-04-hands-on-labs
track: cyber
phase: 4
order: 40
title: "Phase 4 — Hands-On Labs"
duration: "8–12 weeks"
duration_weeks: 12
energy_mix: [low, normal]
deliverable: "portfolio/cyber/04-hands-on-labs.md"
exit_criteria: "You can show a hiring manager logs flowing into a SIEM, explain what triggered an alert, and write a short incident report."
---

# Phase 4 — Hands-On Labs

## Goal of this phase

Move from theory to practical cyber work by building a safe home lab and completing structured blue-team, web, and basic offensive labs.

## Estimated time

**8–12 weeks**. This phase intentionally includes buffer because labs can break.

## Skills you'll gain

- Build and document a safe lab.
- Use Wazuh as a free SIEM.
- Forward logs from Windows/Linux VMs.
- Write 3 simple detection rules.
- Analyze network traffic, alerts, and web vulnerabilities.
- Produce reports instead of just collecting flags.

## Lab setup options

### Minimum hardware path

If your computer is weak:

- Use TryHackMe free rooms in browser where possible.
- Use PortSwigger Academy in browser.
- Use one Ubuntu VM only.
- Use Wazuh only if your machine can handle it, or document a cloud-free install plan.

### Better local lab path

- VirtualBox
- Ubuntu VM
- Windows evaluation VM if available
- Kali VM optional
- Wazuh server VM or Docker install if hardware allows

## Lesson: Hands-On Labs

### Why this lesson exists

Everything up to this point has been preparation. Phases 1 through 3 gave you
vocabulary, plumbing, and the map of the six domains. This phase is where you
build something a hiring manager can look at.

The exit criterion is unusually concrete, and it is worth reading twice:

> You can show a hiring manager logs flowing into a SIEM, explain what triggered
> an alert, and write a short incident report.

Notice that it does not say "you have completed labs." It says you can **show**,
**explain**, and **write**.

| Standard | What it asks for |
|---|---|
| A study standard | "I have completed labs" |
| **A portfolio standard** | "I can show it, explain it, and write it up" |

This is the phase where the curriculum stops being about what you know and
starts being about what you can demonstrate.

#### Why this phase is 8–12 weeks when others are 4–6

The honest reason is stated in the phase itself: *labs can break.* And they will.

| What breaks | Why |
|---|---|
| Wazuh's installer | Fails on a machine with too little RAM |
| The agent connection | Blocked by a firewall rule you did not know existed |
| A VM | Refuses to boot after an update |

None of this means you are doing it wrong. **Troubleshooting the lab is part of
the lab.**

The buffer is deliberate. Learning to work through a broken environment
methodically is itself a job skill, because production systems break too.

#### The strategic point about what you are building

There are two kinds of cyber learner, and the difference is visible from across
a room.

| The collector | The builder |
|---|---|
| Gathers flags and course completions | Produces artifacts |
| A TryHackMe badge | A lab diagram, detection rules with reasoning, an incident report about something they actually observed |
| Tells an employer you followed instructions | Tells them you can do the job |

The phase's deliverable is entirely the second kind. The goal is stated plainly
in the skills list: **produce reports instead of just collecting flags.**

#### On hardware, and why the phase offers two paths

The `## Lab setup options` section gives a minimum path and a better local path.
This is not a polite formality — it is a recognition that the learner this
roadmap is written for may not have a powerful machine.

| Your RAM | What is realistic |
|---|---|
| 16 GB | The full local lab comfortably |
| 8 GB | The SIEM and one agent, if you are careful |
| 4 GB | Not the local lab — use browser-based labs instead |

Wazuh with a Windows VM and a Linux VM realistically wants 8–16 GB.

**If you have 4 GB, the curriculum explicitly permits you to document that
limitation instead of pretending otherwise.** That is not a lesser outcome.

> I planned a Wazuh deployment in detail and documented why my hardware could
> not host it, then built the equivalent understanding in browser-based labs.

That is a truthful, defensible position — and truthfulness about limits is
something interviewers respect far more than a vague claim to have done
everything.

**Time to complete:** 60–100 hours across the phase, spread unevenly.

| Work | Shape of the effort |
|---|---|
| The lab build | Front-loaded; can consume a whole weekend if something goes wrong |
| The labs themselves | Steady |
| The writing | Where most learners under-invest, and where most of the portfolio value actually is |

That middle column is worth reading twice. The lab build is the *prerequisite*, not the deliverable — and it is the part most likely to absorb the whole phase if you let it.

### Part 1 — Design the lab before you build it

#### Why the diagram comes first

Phase task 1 is to build a **lab diagram before installing anything**. This
ordering is the single most important piece of advice in the phase.

Building first and documenting later produces a mess you cannot describe.
Designing first forces you to answer questions that will otherwise ambush you
mid-install:

| Question | Why it matters later |
|---|---|
| How many machines, and what is each one *for*? | Determines your RAM budget |
| How do they reach each other, and the internet? | Determines your adapter setup |
| Where does the traffic get observed? | Determines where the agent goes |
| What are the addresses, and do they survive reboots? | Determines whether your rules keep working |

A lab diagram is a network diagram with purpose labels. It does not need to be
pretty — a hand drawing photographed, or a diagram in any free tool, is fine.

What it needs is: **each host, its role, its IP, its network, and the direction
of the log flow.** Here is a realistic minimal lab that matches the phase's
"better local path":

```text
                    ┌─────────────────────────────┐
                    │      Host machine (your PC)  │
                    │      VirtualBox              │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │   Host-only network          │
                    │   192.168.56.0/24            │
                    └──┬────────────┬───────────┬──┘
                       │            │           │
              ┌────────┴───┐  ┌─────┴─────┐ ┌───┴────────┐
              │ Wazuh      │  │ Ubuntu    │ │ Windows    │
              │ server     │  │ victim    │ │ victim     │
              │ .10        │  │ .20       │ │ .30        │
              │ SIEM       │  │ sshd,     │ │ Sysmon,    │
              │            │  │ cron      │ │ Event Log  │
              └────────────┘  └───────────┘ └────────────┘
                    ▲              │             │
                    └──────────────┴─────────────┘
                       agent log forwarding (1514/tcp)
```

Three design decisions in that diagram are worth understanding, because each one
is a real trade-off you will meet in professional environments.

| Decision | Why it is right |
|---|---|
| **A host-only network** | Host-only gives your host and the VMs a private network with **no route to your real network**. For a lab containing deliberately vulnerable machines, that isolation is the point: nothing you run can reach anything real |
| **The SIEM as its own VM** | Wazuh's server is resource-hungry, and it is the machine whose logs you care about least. Keeping it separate means you can snapshot and rebuild it independently — and it mirrors how SIEMs are deployed in reality: a central collector, separate from the endpoints it monitors |
| **A direction to the log flow** | The arrow points *from* victims *to* the SIEM. This sounds trivial and it is not |

**On the network:** you will still need NAT or a second adapter on the VMs that
must download updates. A common and effective pattern is **two adapters per
VM** — host-only for lab traffic, NAT for internet access.

**On the log flow direction:** it determines which firewall rules you need, which
way the agent connects, and where you look when it does not work.

Most log-forwarding failures are a direction problem — the agent cannot reach the
manager because you opened the port the wrong way, or a firewall on the victim
is blocking outbound traffic.

#### Static addressing, and why DHCP will waste your weekend

Give the lab VMs **static IP addresses**, or configure DHCP reservations.

This is a small decision with a large payoff. Your detection rules, your
documentation, and your screenshots will all reference IP addresses. If those
change on every reboot, your notes become wrong and your rules stop matching.

| | Static addresses | DHCP without reservations |
|---|---|---|
| Your notes | Stay accurate | Go stale on reboot |
| Your detection rules | Keep matching | Silently stop matching |
| Reproducibility | A reader can rebuild your lab | Nothing is reproducible |

It is also a small lesson in professional practice. In real environments,
servers have stable addresses precisely so that monitoring and rules can depend
on them.

#### Recording baseline state

Before you install anything, note what "clean" looks like: the OS version, the
services running, the listening ports.

This is the **baseline** concept from Phase 3's endpoint material. Building it
explicitly is what makes it possible to detect change later.

A practical method:

| Platform | Command |
|---|---|
| Linux VM | `ss -tulpn` |
| Windows VM | `netstat -ano` |

Save the output to a file in your notes, and keep it. When you later generate a
test event, you will be able to say precisely what changed.

### Part 2 — Building the lab: VMs, and installing a SIEM

#### Choosing a hypervisor, and the honest answer

A **hypervisor** is the software that runs virtual machines. It pretends to be a complete computer so that a guest operating system can run inside it, believing it is on real hardware.

The phase's tools table names VirtualBox, with VMware Player as the free alternative. Both are genuinely free, and both will complete this phase.

| | VirtualBox | VMware Workstation Player |
|---|---|---|
| **Cost** | Free, open-source core | Free for personal use |
| **Licence** | GPL — no personal-use caveat | Free *only* for non-commercial personal use |
| **Guest additions** | A separate download per guest OS family | Bundled, and generally smoother |
| **Snapshots** | Unlimited, with a snapshot manager | The free Player build restricts them |
| **Which to pick** | **Default recommendation** | A fine substitute if VirtualBox fights your machine |

**Use VirtualBox for this phase.** Its free tier has no licence ambiguity, its snapshot support is unlimited, and virtually every free tutorial uses its menu names verbatim.

#### Host preparation: four checks before you install

Most hypervisor pain is avoidable in about fifteen minutes.

| Check | How to check it | Why it matters |
|---|---|---|
| **Virtualisation is enabled in BIOS/UEFI** | Task Manager → Performance → CPU → "Virtualisation" | Without it, 64-bit guests refuse to start or run unusably slowly |
| **Hyper-V and related Windows features are off** | `OptionalFeatures.exe` | Hyper-V claims the CPU's virtualisation extensions exclusively, and VirtualBox then fails with `VERR_VMX_NO_VMX` |
| **Enough free disk space** | `Get-PSDrive C` in PowerShell | Guests grow, and a full host disk corrupts running VMs |
| **Windows Defender exclusions** | Add your VM folder and VirtualBox's program folder | Scanning a 20 GB virtual disk file will make your machine crawl |

Windows ships with Hyper-V, Virtualisation-Based Security, Windows Sandbox, the Virtual Machine Platform, and the Windows Hypervisor Platform — any of them holding the virtualisation extensions stops VirtualBox dead.

The classic symptom is VirtualBox reporting `VT-x is not available (VERR_VMX_NO_VMX)` on a machine whose Task Manager says virtualisation is enabled. The CPU supports it, and something else has claimed it. **Reboot after disabling any of these.**

#### Resource allocation on a modest laptop

This is where beginners over-commit and then blame the tools. The rule that matters: **never allocate more than half your physical RAM to the sum of your running VMs.**

| Host RAM | Realistic allocation | What you can run at once | Honest verdict |
|---:|---|---|---|
| 4 GB | 1 GB to one Linux VM | One lightweight VM, occasionally | Not the local Wazuh lab. Use browser labs |
| 8 GB | 2 GB to Ubuntu Server | The SIEM VM alone, or victims alone | Workable if you install the manager without the indexer |
| 16 GB | 4 GB + 2 GB + 2 GB | All three VMs together | The comfortable path |
| 32 GB and above | 4 GB + 4 GB + 4 GB | Room for a fourth VM | More than the phase requires |

**Why half, and not "as much as possible".** The host operating system is also running. A host that is swapping makes every guest feel slow, and a starved guest will silently kill processes — which is usually why the Wazuh installer fails halfway for no visible reason.

**On CPU.** Allocate **one or two virtual CPUs per VM**, not all of them. More cores than a guest can use adds overhead rather than speed.

**On disk.** Budget **20 GB for Ubuntu Server, 40 GB for a Windows guest, and 50 GB for a Wazuh server with the indexer**. Use the **dynamically allocated** disk type, and keep at least **30 GB genuinely free** on the host.

| Disk mistake | What happens |
|---|---|
| A fixed-size disk you cannot shrink | Your host fills up and you cannot reclaim space without rebuilding |
| Running the VM from an external USB drive | Painfully slow, and unplugging it corrupts the guest |
| Storing snapshots indefinitely | Snapshots are deltas, not free points in time, and they grow |

#### VM networking modes, and when each one is right

This is the most confusing part of the lab build. Each mode answers a different question about who the VM can talk to.

| Mode | What the VM can reach | Use it when |
|---|---|---|
| **NAT** | The internet, through the host. Other VMs cannot see it by default | The VM needs updates but should not be discoverable |
| **Bridged** | Everything on your real local network, as a full peer | You need a LAN peer. **Never for vulnerable or malware labs** |
| **Host-only** | The host, and other VMs on the same host-only network | The lab's own traffic: agents to SIEM, attacker to victim |
| **Internal network** | Other VMs on the same named network — not even the host | You want the host out of the loop entirely |
| **Not attached** | Nothing | You want the network severed while the machine runs |

The pattern to internalise is the pairing: **NAT for the road out, host-only for the lab road in.** Two adapters on one VM is normal and correct.

| VM | Adapter 1 | Adapter 2 | Reasoning |
|---|---|---|---|
| Wazuh server | Host-only (static `192.168.56.10`) | NAT | Receives agent traffic privately, and reaches the internet only to install and update |
| Ubuntu victim | Host-only (static `192.168.56.20`) | NAT | Forwards logs to the manager, and can patch itself |
| Windows victim | Host-only (static `192.168.56.30`) | NAT | Same |

**Use static addresses, or DHCP reservations.** Your detection rules, your notes, and your screenshots all reference IP addresses; if those change on reboot, your notes become wrong and your rules silently stop matching. In production, servers have stable addresses for exactly this reason.

#### Snapshots and rollback discipline

Virtual machines are used for security work because they are **reversible**. That reversibility is a habit you either build or you do not.

A **snapshot** records the state of a VM's disk at a moment in time. Reverting rolls the VM back to exactly that state, discarding everything since.

| Snapshot discipline | Why it matters |
|---|---|
| Snapshot **immediately after install, before configuring anything** | Gives you a known-good base you can return to in seconds |
| Snapshot **before each experiment** | Makes every experiment reversible, which is what lets you try things |
| Name snapshots meaningfully: `clean-install`, `pre-agent`, `pre-rule-test` | `Snapshot 1` tells you nothing three weeks later |
| Delete snapshots you have finished with | Each one consumes disk and slows the VM down |

A snapshot does not copy the disk. It stores the difference from that point forward, so a VM running for weeks on one snapshot can accumulate a delta as large as the original disk.

**The habit that pays for itself:** before you generate a test event, break a configuration, or install something questionable, take a snapshot. Then you can be genuinely fearless.

#### Safe teardown, and why it is part of the skill

At the end of the phase you will have several large virtual disks and possibly a Wazuh install you no longer need.

| Step | What to do | Why in this order |
|---|---|---|
| 1 | **Export anything you want to keep first** | Screenshots already live in your portfolio repo; the VM disk does not need to survive |
| 2 | **Power the VMs off properly** — `sudo shutdown -h now`, not the window's X button | A hard power-off can corrupt the guest filesystem and the snapshot chain |
| 3 | **Delete snapshots before deleting the VM** | Deleting a VM with snapshots attached leaves orphaned disk files |
| 4 | **Remove the VM and choose "Delete all files"** | Otherwise multi-gigabyte `.vdi` files sit in your user profile forever |
| 5 | **Keep the hypervisor and the lab** | Phase 6 builds on exactly this environment, and rebuilding it costs a weekend you have already spent |

#### Getting the VMs running without losing a weekend

The installation order that causes the least pain:

| Order | Step | Why this order |
|---|---|---|
| 1 | Install VirtualBox on the host | Nothing else works without it |
| 2 | Create the host-only network first, in VirtualBox's network settings | Doing this afterwards means editing every VM's configuration |
| 3 | Install Ubuntu Server (no desktop) as the SIEM host | The desktop consumes RAM the SIEM needs, and you will administer it over SSH, which practises Phase 2's skills |
| 4 | Snapshot immediately after install, before configuring anything | The single highest-value habit in the phase |
| 5 | Install the victim VMs, snapshot them too, and install Sysmon on the Windows one | Same reasoning |

**Why step 4 matters most.** Virtual machines are used for security work
specifically because they are **reversible** — that is what makes it safe to run
malicious code or break a configuration.

A learner who snapshots before each experiment can be fearless. One who does not
will hesitate, and hesitation is what stalls progress. Take the snapshot.

**On obtaining Windows.** Microsoft publishes free **evaluation** virtual
machines and ISOs for testing, which is what the phase's "Windows evaluation VM
if available" refers to.

| Situation | What to do |
|---|---|
| You have a Windows evaluation VM | Use it |
| You do not | The Linux victim alone is sufficient |

Wazuh monitors Linux just as well, and you can complete the whole
log-forwarding and detection-rule exercise with a single Ubuntu agent.

**Do not let a missing Windows VM stop you.** The deliverable asks for logs from
"one Windows or Linux VM."

#### What Wazuh is, and what it is not

**Wazuh** is a free, open-source **SIEM** — Security Information and Event
Management — combined with **XDR** (Extended Detection and Response)
capabilities.

Recall the division of labour from Phase 3: Sysmon *records* endpoint activity,
AV *blocks known bad*, EDR *detects behaviour*. Wazuh's role is different again.

| Wazuh's job | What it means |
|---|---|
| **Collect** | Receives logs from many sources: Linux agents, Windows agents, Sysmon events, firewalls, web servers |
| **Normalise** | Parses wildly different log formats into a common structure, so a Windows event and an SSH failure become comparable records |
| **Analyse** | Applies **decoders** (extract fields from raw log lines) and **rules** (match patterns and assign severity) |
| **Alert** | When a rule matches, generates an alert visible in the dashboard |
| **Retain** | Stores everything, which is what makes after-the-fact investigation possible |

**Two components to keep straight**, because the vocabulary appears throughout
the Wazuh documentation:

| Component | What it is |
|---|---|
| **The Wazuh manager** | The server. Receives events, applies decoders and rules, generates alerts |
| **The Wazuh agent** | A small program on each monitored machine. Watches log files and the event log, forwards entries to the manager on port 1514 |

That manager/agent split is why the lab diagram has a direction. The agent
*initiates* the connection outward to the manager.

Which means the firewall rule you need is for the victim to reach the manager's
port 1514 — not the reverse. Getting this backwards is one of the most common
setup failures.

**A note on resource planning.** Wazuh's official **quickstart** (linked in the
resources) is the correct path. It offers an all-in-one installation that puts
the manager, indexer, and dashboard on one machine.

Be aware that the indexer is the memory-hungry component — it is a search engine
— and that the documented minimum requirements are real rather than
conservative. If your machine cannot meet them, the honest options are:

| Option | What you lose |
|---|---|
| Run only the manager without the indexer | The dashboard, but you keep the alerting |
| Use Docker with tight memory limits | Some setup simplicity |
| Plan the install and document the limitation | Nothing — this is a valid outcome |
| Defer to browser-based labs | The local build, but not the understanding |

Any of these is a legitimate outcome.

#### A troubleshooting table for the failures you will actually hit

Every item below is a failure this phase's learners genuinely meet. Read it now, and read it again when something breaks.

| Symptom | Most likely cause | How to confirm | Fix |
|---|---|---|---|
| **The VM has no internet** | No NAT adapter, or no default route | `ip route` shows no `default via` line | Add a NAT adapter in the VM's network settings, or restore DHCP on the NAT interface |
| **NAT and bridged confusion** | The VM is bridged and picked up an address from your real router | The guest's IP is in your home range (for example `192.168.1.x`) while your lab is `192.168.56.x` | Switch that adapter to NAT. **If the VM is deliberately vulnerable, this is urgent, not cosmetic** |
| **The host disk is full** | Snapshot deltas, or dynamically allocated disks that grew | `Get-PSDrive C` on the host; check the VM folder's size | Delete finished snapshots, delete unused VMs, move the VM folder to a larger drive |
| **Guest additions will not install or the display is wrong** | The guest additions ISO is not mounted, or the guest lacks build tools | VirtualBox → Devices → Insert Guest Additions CD image; then inside the guest, check for a mounted volume | Mount the ISO, run the installer from inside the guest, and on Ubuntu install `build-essential` and the matching `linux-headers` package first |
| **Windows guest is unusably slow** | No guest additions, no virtualisation extensions, or antivirus scanning the disk | Task Manager on the host shows sustained disk at 100% | Install guest additions, enable VT-x/AMD-V, and add the VM folder to antivirus exclusions |
| **Nested virtualisation — a VM inside a VM will not start** | The hypervisor is not exposing virtualisation extensions to the guest | VirtualBox → Settings → System → Processor → "Enable Nested VT-x/AMD-V" is greyed out or unticked | Tick nested virtualisation if your CPU and host permit it. On many laptops it is unavailable — use a browser lab rather than fighting it |
| **A SIEM agent never checks in** | Firewall, wrong manager address, or the service is not running | On the victim: `sudo systemctl status wazuh-agent` and `sudo tail -f /var/ossec/logs/ossec.log` | Confirm the agent's `MANAGER_IP` points at the host-only address, that outbound TCP 1514 and UDP 1514 are open, and then restart the agent |
| **The agent checks in but no events arrive** | The log file is not in the agent's configuration, or nothing is being written to it | On the victim, generate an event and confirm it appears in `/var/log/auth.log` | Add the log location to `ossec.conf` on the agent, then restart the agent |
| **Clock skew breaks your timeline** | The VM suspended, or timezone drift between guest and host | Compare `date -u` inside the guest with the host's UTC time | Enable guest time synchronisation and an NTP client in each guest. Log correlations fail silently otherwise |
| **The SSH connection to the lab drops** | The host-only network changed, or DHCP reassigned the address | `ip -brief addr` inside the guest | Fix the address statically, as Part 1 describes |
| **`apt` or Windows Update fails inside the guest** | No route out, or a corporate VPN on the host | `curl -I https://archive.ubuntu.com` inside the guest | Detach the VPN, or verify the NAT adapter is present and enabled |
| **Snapshots will not restore** | The snapshot chain is broken, or the disk is full | VirtualBox shows the snapshot as "corrupt" or the restore fails immediately | Free disk space first. If the chain is genuinely broken, revert to the clean-install snapshot and rebuild — this is exactly why you made one |

**How to use that table well.** Identify the symptom as precisely as you can before you act. "The lab is broken" is not a symptom; "the agent service is running and its log says `Unable to connect to manager`" is, and it points at a single fix.

**Clock skew deserves a warning of its own**, because it produces *confidently wrong* output rather than an error. If your Ubuntu victim reports 14:32 local while the Wazuh manager timestamps the same event at 06:32 UTC, your timeline is nonsense and nothing anywhere tells you so. Enable time synchronisation in every guest, and take every timestamp in **UTC** from the start.

#### Source, decoder, rule: how detection actually works

This is the conceptual core of the phase. Understanding it is what turns
"I installed a SIEM" into "I can write detection."

The pipeline, in order:

```text
Log source → event arrives → decoder extracts fields → rule matches → alert
```

A **decoder** turns a raw log line into structured fields. Consider a real SSH
failure:

```text
Failed password for invalid user admin from 203.0.113.45 port 51234 ssh2
```

A decoder extracts `user=admin`, `srcip=203.0.113.45`, `srcport=51234`.

Without this step, the line is just text and you cannot write conditions against
it. Wazuh ships with hundreds of decoders for common log formats — which is why
it can understand Windows events and `sshd` logs out of the box.

A **rule** then tests those fields and decides whether the event matters. The structure, in Wazuh's XML format:

```xml
<rule id="100001" level="10" frequency="6" timeframe="120">
  <if_matched_sid>5710</if_matched_sid>
  <same_source_ip />
  <description>Repeated SSH failures for non-existent users from same source</description>
  <mitre>
    <id>T1110</id>
  </mitre>
</rule>
```

Reading that rule piece by piece, because every part matters:

- **`id`** — custom rules conventionally start at 100000, because the range below is reserved for the shipped ruleset.
- **`level`** — severity, 0–15. Wazuh's scale: 0 is ignored, 3 is informational, 7 is notable, 10 is high, 12+ is critical. The level determines whether anyone is woken up.
- **`frequency` and `timeframe`** — this rule fires only on the **6th** matching event within **120 seconds**. That is what makes it a behavioural rule rather than a single-event rule.
- **`if_matched_sid`** — matches against rule **5710**, the built-in rule for "attempt to login using a non-existent user." So this rule is *built on top of* an existing rule rather than on raw log text. This is the key technique: **you compose new detections from the primitives the platform already provides** instead of writing regex against log lines.
- **`same_source_ip`** — all six events must share a source address. Without this, six failures from six different attackers would trigger it. This single clause is what turns "some failures happened" into "someone is spraying."
- **`mitre`** — maps the detection to **T1110, Brute Force** in MITRE ATT&CK. Phase 1 introduced ATT&CK as a shared vocabulary; this is what using it looks like in practice. It means an analyst who sees this alert immediately knows what class of behaviour it represents.

**That rule is a template for the whole exercise.** The phase asks for three detection rules, and the point is not the XML syntax — it is that you chose a behaviour worth detecting, expressed it as a condition over fields, set a severity that reflects its importance, and linked it to a framework. In an interview, explaining *why* you wrote that rule and why `frequency="6"` rather than `frequency="1"` is a far stronger answer than showing the code.

#### Choosing what to detect

The phase's task 5 lists four safe events to generate: a failed login, a new user, a suspicious command string, and a service restart. Each is a good choice for a specific reason, and understanding the reason is what makes the three rules you write defensible:

- **Failed login** — the highest-volume real-world signal, and the one where *pattern* matters more than any single event. Your rule should encode a threshold, as the example above does.
- **New user created** — a persistence technique (Phase 3 listed it as ATT&CK-adjacent behaviour: account creation for continued access). The important detail is that a new user is *legitimate administration* most of the time, which makes it a perfect example of a rule that must be tuned rather than a rule that simply fires.
- **Suspicious command string** — detecting known-abused tooling. Restrict it to your own lab notes and never point it at anything you do not own.
- **Service restart** — availability-relevant, and a useful case for discussing why a restart matters in some contexts (a database) and not others (a printer spooler). It teaches that **not every detection should be an alert**; some are just records.

The rule-writing discipline, in five questions you should be able to answer for each rule you write:

1. **What behaviour am I detecting?** Not "failed logins" but "repeated failures against multiple accounts from one source."
2. **What is the false-positive cost?** Who legitimately triggers this? A password-spraying rule will fire during a real user's forgotten-password morning. How will you tune it?
3. **What severity, and why?** A level 12 alert should mean someone gets woken up. If everything is critical, nothing is.
4. **What should the responder do?** A rule without a response is a notification nobody reads.
5. **How would I test it?** You will generate the event deliberately and watch the rule fire — the phase's tasks 5 and 6 are a matched pair for this reason.

### Part 3 — Generating evidence, and the discipline of writing it up

#### Triggering events safely, and reading the result

Phase task 5 asks you to generate safe test events, and "safe" is doing real work
in that sentence.

On your own isolated lab VMs, you can deliberately fail logins and create users.
Every one of those actions is a crime on a system you do not own. Phase 2's
boundary still applies, and this phase is where the temptation to test a rule
against something real is highest — resist it completely.

The method is the same loop a detection engineer uses professionally.

| Step | Action | Why this step exists |
|---|---|---|
| 1 | **Generate one event** on the victim VM — for example, `su - fakeuser` with a wrong password | You need a known event to trace |
| 2 | **Find it in the raw log** on the victim (`/var/log/auth.log`, or Event Viewer) | Proving it exists *at the source* is what lets you isolate a forwarding failure from a detection failure |
| 3 | **Find it in Wazuh**, first as a raw event, then as a decoded event with fields extracted | Confirms the pipeline works |
| 4 | **Check whether a rule fired.** If no, ask whether no rule exists for it | Often the honest answer — and the reason you are writing your own |
| 5 | **Write or modify a rule** so that it does, then repeat from step 1 | Closes the loop |

That loop — generate, observe at the source, observe in the pipeline, adjust — is
the whole of detection engineering. Doing it three times by hand teaches more
than reading any amount of documentation about it.

**A note on screenshots.** The deliverable asks for them, and they are your
portfolio evidence. Take them at the moment the thing works, and annotate them
in your notes so a reader who was not there understands what they are looking at.

| Screenshot quality | Value |
|---|---|
| Annotated, with a caption explaining what the alert means | Worth ten unannotated ones |
| Unannotated | Proves nothing to a reader who was not present |

Remember that a screenshot proves a state, not an understanding. The explanation
in your write-up is what carries the value.

#### Evidence capture: what a screenshot proves, and what it does not

The word "evidence" is used loosely by beginners, and tightening it up changes how your work reads.

**A screenshot proves that a particular screen displayed particular content at some point.** That is all. It does not prove who produced it, from which machine, using which command, at what time, or whether the screen was a lab you built.

| A screenshot does prove | A screenshot does not prove |
|---|---|
| The interface showed those values | Which host produced them |
| The state existed when you captured it | What command created that state |
| The tool was running | That the result is reproducible |

So the job of your evidence is to close those gaps with context. Three rules do most of the work.

**Rule 1: include the command, not just the output.** A terminal screenshot showing only a result is unverifiable. Include the prompt and the command that produced it.

```bash
analyst@lab-ubuntu:~$ sudo grep "Failed password" /var/log/auth.log | tail -3
Jan 14 14:32:07 lab-ubuntu sshd[3187]: Failed password for invalid user admin from 192.168.56.30 port 51234 ssh2
Jan 14 14:32:09 lab-ubuntu sshd[3189]: Failed password for invalid user admin from 192.168.56.30 port 51236 ssh2
Jan 14 14:32:11 lab-ubuntu sshd[3191]: Failed password for invalid user admin from 192.168.56.30 port 51239 ssh2
```

That block says what ran, on which host, as which user, and what came back. It is evidence rather than a picture.

**Rule 2: include the timestamp and the timezone.** An alert screenshot with no visible time is nearly worthless, because the first question a reviewer asks is *when*.

**Rule 3: keep the identifiers, crop the noise.** Crop the browser chrome and the unrelated tabs. Keep the hostname, the rule identifier, the severity, and the time.

#### Capturing a clean log excerpt

Screenshots of logs are usually worse than the text of the logs, because text can be searched, diffed, and pasted into a ticket.

The excerpt you want is **short, contiguous, and self-describing**.

| Quality | Example | Why |
|---|---|---|
| **Weak** | A screenshot of a scrolling terminal | Not searchable, unreadable at GitHub's image width, impossible to quote |
| **Acceptable** | Ten lines pasted into a fenced block | Searchable and quotable, but context is guesswork |
| **Strong** | A three-line excerpt with the command above it, the host named, and timestamps in UTC | A reviewer can reproduce the command and compare |

Two commands make this easy, and the second is worth learning now:

```bash
# The command visible in the transcript, with the last few matches
grep "Failed password" /var/log/auth.log | tail -3

# A window around a known time, rather than the whole file
journalctl -u sshd --since "14:30" --until "14:35" --no-pager
```

"Here is a four-minute window around the alert" is far more useful than "here are 4,000 lines", and it is the same instinct a real analyst uses.

**Sanitise log excerpts before publishing.** Log lines contain usernames, internal addresses, and sometimes tokens. Replace them consistently and say you did — `user_a`, `192.168.56.x`.

#### Naming conventions for evidence files

Filenames are part of the evidence, because a reviewer navigating your repository sees them before they see anything else.

| Weak | Strong | Why the strong one wins |
|---|---|---|
| `Screenshot 2024-11-03 141022.png` | `04-wazuh-alert-100001-ssh-bruteforce-1432utc.png` | States the project, the alert, the rule, and the time |
| `image1.png` | `04-authlog-bruteforce-excerpt.txt` | Says what the artifact is and which project it belongs to |
| `final_v2_FINAL.png` | `04-loglab-network-diagram.png` | Stable, and versioning belongs in git, not the filename |
| `evidence/` with 40 loose files | `04-loglab/evidence/` with 8 named files | Grouped by project, and each name carries meaning |

The pattern to adopt: **`<project>-<what it shows>-<when>.ext`**, with the timestamp in UTC and compressed, like `1432utc`. Keep filenames lowercase with hyphens.

**Append every image with a caption.** A caption is one line, and it says what the reviewer should conclude:

```markdown
![Wazuh rule 100001 firing at level 10 at 14:32 UTC on lab-ubuntu, showing source 192.168.56.30](evidence/04-wazuh-alert-100001-1432utc.png)
```

#### Worked example: documenting one alert properly

Here is one alert from the lab, written up as it should appear in your deliverable. Notice how much of the value is in the framing rather than the screenshot.

```text
## Finding 1 — Repeated SSH authentication failures for non-existent users

Verdict: true positive (behaviour confirmed); no successful access.
Severity: level 10 (high), custom rule 100001.

What happened
 Between 14:32:07 and 14:32:11 UTC on 14 January, the Ubuntu victim
 (lab-ubuntu, 192.168.56.20) received six SSH authentication failures for
 non-existent usernames, all from a single source, 192.168.56.30.

What triggered the alert
 Custom rule 100001 matches the built-in rule 5710 ("attempt to login using
 a non-existent user") and requires six matching events within 120 seconds
 sharing one source IP. Six events from one address in four seconds satisfied
 all three conditions.

Evidence
 - Raw excerpt from /var/log/auth.log, three of the six lines, captured with
   `grep "Failed password" /var/log/auth.log | tail -3`
 - Wazuh alert for rule 100001, level 10, timestamped 14:32:11 UTC
 - The rule definition at /var/ossec/etc/rules/local_rules.xml

What I checked next
 - Whether any authentication succeeded from 192.168.56.30 in the same window:
   no 4624 or "Accepted password" events.
 - The source address: 192.168.56.30 is the Windows victim VM in this lab, so
   the source is expected for the test and is not an external host.
 - Whether the usernames exist on the host: they do not.

Conclusion
 The behaviour is a username-spraying pattern against SSH. In this lab it was
 generated deliberately. The detection works as intended.

Limitations
 - The six failures are the whole sample; I could not test how the rule behaves
   against a slow spray spread over an hour, which would evade the 120-second
   window entirely.
```

| What makes that write-up strong | Why |
|---|---|
| A stated verdict with reasoning | A reviewer sees you making the true/false-positive call, which is the job |
| The trigger explained in plain language | Proves you understand your own rule rather than pasting it |
| Evidence listed as artifacts, not adjectives | Every claim traces to something in the repository |
| A clearly labelled Limitations section | Shows you know where your test stops, which is what makes the rest credible |
| No inflation | It says "generated deliberately", and that honesty buys the rest of the report its trust |

#### Isolated malware handling, and the boundary you never cross

The phase's tasks do not require you to run real malware. You can build a defensible, useful lab without ever executing a live sample.

But you should understand what "isolated" genuinely means, because the word is used loosely and the failure mode is serious.

**Isolation is a property of the network path, not of the VM.** A VM is isolated when nothing it can reach is real. That is a stronger condition than "it is a VM", because a VM with a bridged adapter is a full participant on your home network.

| Configuration | Is it isolated? | Why |
|---|---|---|
| Host-only adapter only | **Yes** — for lab-to-lab traffic | No route to your real network or the internet |
| Host-only plus NAT | **Partially** — the guest can reach the internet | Outbound access is a path back out. Fine for patching, not for a live sample |
| Bridged | **No. Never.** | The VM has a real address on your real network and can reach your router, your NAS, and every device on it |
| Internal network, host excluded | **Yes** — stricter than host-only | Even the host cannot reach the guest |

**Why you never use a bridged adapter for a malware lab.** A bridged VM is a peer on your local network. Malware that scans the local subnet — and much of it does, because that is how it spreads — will scan your household or office devices. You would have released live malware onto a network you do not own and cannot contain.

| Risk | What actually happens |
|---|---|
| Lateral spread from the bridged VM | Other devices on your LAN become targets, and reverting a snapshot cannot undo it |
| A phone-home beacon from your real IP | Your household or employer's public address appears in someone else's threat intelligence |
| Employer network involvement | If you lab on a work device or network, this becomes a disciplinary matter |
| Legal exposure | Unauthorised access to systems you do not own is an offence in most jurisdictions, including the Philippines' Cybercrime Prevention Act |

**What to do instead, if you want to study malware behaviour.** Take the free, safe routes, which teach the same concepts without the risk:

| Safe route | What you learn |
|---|---|
| **Static analysis only** — never execute the sample | File type, strings, imports, embedded URLs, packer indicators |
| **Public sandbox reports** — read the vendor's own dynamic analysis output | Behaviour, persistence, network indicators, without running anything |
| **Platform lab environments** — CyberDefenders, BTLO, LetsDefend | Malware *artifacts* (disk images, memory captures, pcaps) rather than live code |
| **Your own harmless binaries** — a small program that beacons on an interval | The detection engineering, which is what the phase actually asks for |

**The ethical and legal boundary, stated plainly.** You may attack systems you own and have built yourself, on hardware you control, with no route to anything else. You may not attack anything else — not an employer's system, not a friend's server, not a public service, not "just to test whether a rule works". Every one of those is unauthorised access, and the intent does not change the offence.

A useful rule of thumb for the whole track: **if you cannot describe the environment in one sentence that ends with "and it cannot reach anything else", it is not a lab.**

#### Writing the incident report

The final artifact, and the one that most directly matches the exit criterion.
Phase 3 covered report structure; here it must come from something you actually
observed in your lab, which makes it real in a way a mock is not.

A structure that works, adapted to a lab incident:

| Section | What goes in it |
|---|---|
| **Summary** | One paragraph, plain language: "A brute-force attempt against SSH on the Ubuntu victim was detected by a custom Wazuh rule at 14:32 UTC. No access was gained." |
| **Detection** | Which rule fired, at what level, and **what triggered it**. Explain the `frequency` threshold and the `same_source_ip` clause in your own words |
| **Evidence** | The log lines and the alert, quoted, with timestamps in UTC |
| **Timeline** | A short table, as in Phase 3 |
| **Impact** | In a lab, honestly: none. Saying so is correct and professional |
| **Root cause** | The control gap. For brute force, the honest answer is usually that a control was *absent* — no key-only SSH, no fail2ban — and your detection is what surfaced the behaviour |
| **Recommendations** | Specific and prioritised. "Disable password authentication in favour of keys" is a recommendation; "improve SSH security" is not |

Two things make a lab report read as professional rather than academic.

First, **UTC timestamps everywhere**, stated explicitly. Second, **an honest
impact statement**.

A report that says "this was a controlled test, no impact, and here is what the
detection would have caught in production" demonstrates exactly the judgement an
employer wants. It is far more credible than manufactured drama.

Do not inflate a lab event into a breach narrative; an interviewer will see
through it instantly.

#### Blue-team labs and web labs: different skills, both required

The phase asks for **10 PortSwigger Apprentice labs** and **2 free blue-team
labs** (from CyberDefenders, Blue Team Labs Online, or LetsDefend).

These two families teach genuinely different things, and the combination is
deliberate.

| | PortSwigger labs | Blue-team labs |
|---|---|---|
| **Subject** | Web security — Phase 3's Part 4, made concrete | The defensive side |
| **Format** | Browser-based, no lab hardware, each with a defined objective | You are given evidence — disk images, memory captures, logs, PCAPs — and asked what happened |
| **Your task** | Find and exploit the vulnerability | Determine what occurred and prove it |
| **Closeness to the job** | Useful, especially for pentest | Much closer to daily SOC analyst work |
| **Skills exercised** | Web attack techniques | Reading logs, correlating timestamps, interpreting traffic, writing conclusions |

The count went from five to ten because by now you have the fundamentals and can
work faster.

**The write-up pattern** is the one from Phase 3: what the vulnerability was, how
you found it, the payload, and the fix. Since web security is your strongest
area, use it to build confidence and volume in your portfolio.

**Blue-team write-ups are the most directly employable artifacts you will produce
in this phase.** A write-up that says "I identified the initial access vector,
the persistence mechanism, and the exfiltration destination, and here is the
evidence for each" is a close simulation of what an L1 analyst produces.

Do these two properly rather than rushing them. If the phase forces a choice
about where to spend time, spend it here.

**On TryHackMe.** The Free vs Paid section notes this is the first phase where
**one month of TryHackMe Premium may be worth it** — but only after the
prerequisites in `WHEN-TO-BUY-THM-PREMIUM.md`. Read that file before spending
anything.

| | Free rooms | Premium |
|---|---|---|
| Coverage | Pre Security, Cyber Security 101 — the guided-lab ground adequately | Convenience and more targets |
| Cost | $0 | Paid |

Every other tool in this phase is free. Premium buys convenience, not a
capability you cannot otherwise build.

#### The lab notebook, and why it saves you twice

A **lab notebook** is one file you keep open while you work, where you write down what you did, what broke, and what you concluded — as you go, not afterwards.

It saves you twice. Once immediately, because you stop re-solving the same error three weeks later. And once at the end, because the incident report writes itself out of notes you already took.

```markdown
# Lab notebook — Phase 4

## Lab inventory
| Host | Role | IP | OS | Snapshot base |
|---|---|---|---|---|
| lab-wazuh | SIEM manager | 192.168.56.10 | Ubuntu Server 24.04 | clean-install |
| lab-ubuntu | Victim | 192.168.56.20 | Ubuntu Server 24.04 | clean-install |
| lab-win10 | Victim | 192.168.56.30 | Windows 10 Eval | clean-install |

## Entry template

### YYYY-MM-DD HH:MM UTC — <short title>
**Goal:** what I set out to do, in one sentence.
**Did:** the commands I ran, in order, pasted verbatim.
**Observed:** what actually happened, including the exact error text.
**Next:** what I will try next, or the decision I made.

## Entries

### 2026-01-14 15:40 UTC — Agent installed but not checking in
**Goal:** Get lab-ubuntu forwarding to lab-wazuh.
**Did:** Installed the agent, set MANAGER_IP to 192.168.56.10, restarted.
**Observed:** `ossec.log` shows `Unable to connect to manager`. `ss -tulpn`
on the manager shows nothing listening on 1514.
**Next:** Check whether the manager service is running at all — probably I
installed the agent before the manager finished initialising.

## Recurring problems
| Problem | Cause | Fix that worked |
|---|---|---|
| (add a row each time you solve something twice) | | |
```

| Why that template works | Reason |
|---|---|
| The entry prompts are short and fixed | No entry takes more than two minutes |
| Commands are pasted verbatim | The notebook becomes a source of quotations for your report |
| Every entry records the failure text exactly | Paraphrased errors cannot be searched for later |
| It ends with a "recurring problems" table | This is the section you will read most, and it becomes interview answers |

**Use plain Markdown in your portfolio repository.** Do not use a proprietary notes app for lab work — the notebook is evidence, and evidence should be readable with `git` and a text editor, in ten years, without an account.

### Key takeaways

- **The exit criterion is a demonstration, not a completion.** Show logs flowing, explain an alert, write a report. Badges are not the deliverable.
- **Design the lab before installing anything.** The diagram forces you to answer addressing, connectivity, and log-flow questions before they ambush you mid-install.
- **Host-only networking is what makes the lab safe.** No route to your real network is the entire point when the VMs are deliberately vulnerable.
- **Static addresses keep your rules and your notes valid.** Reproducibility is the reason servers have stable addresses in production too.
- **Snapshot before every experiment.** Reversibility is why VMs are used for security work; it is what lets you be fearless.
- **Wazuh is manager plus agent, and the agent initiates the connection.** That direction determines your firewall rules and is the most common setup failure.
- **Source → decoder → rule → alert** is the detection pipeline. Decoders extract fields; rules test them; without decoding you cannot write a condition.
- **Compose rules from existing rules.** `if_matched_sid` against a built-in rule, plus `frequency` and `same_source_ip`, is how a real behavioural detection is built — and `same_source_ip` is what turns noise into signal.
- **Severity must mean something.** If everything is level 12, nothing is. Not every detection deserves an alert; some are just records.
- **Document the hardware limitation honestly if it applies.** "I documented why my machine could not host a Wazuh install" is a legitimate, respected outcome — far better than a vague claim.
- **Troubleshooting the lab is part of the lab.** The 8–12 week estimate exists because labs break, and working through that methodically is a job skill.
- **Find the event in the raw log before blaming the SIEM.** Isolating a forwarding failure from a detection failure requires checking both ends.
- **Honest impact statements make reports credible.** "Controlled test, no impact, here is what it would have caught in production" is stronger than manufactured drama.
- **Blue-team labs simulate the actual job** more closely than offensive ones. If time is short, this is where to spend it.

### Practice this next

The nine tasks form a dependency chain — later tasks genuinely cannot be done without earlier ones — so the order is not a preference:

1. **Draw the diagram first** (task 1). Even a rough one. Decide machine roles, addresses, and log-flow direction before touching VirtualBox, because changing these later means rebuilding.
2. **Build the VMs, creating the host-only network before the VMs** (task 2), and **snapshot immediately after each install**. If you have 4–8 GB of RAM, start with Ubuntu Server alone and add the SIEM only if it fits.
3. **Attempt Wazuh next** (task 3) using the official quickstart. If it fails on resources, do not force it — write down exactly what you tried, what the machine did, and what the requirement is. That write-up satisfies the checklist item and belongs in the deliverable.
4. **Forward logs from one VM** (task 4), and treat a failure here as diagnostic practice: confirm the event exists in the local log first, then confirm the agent is running, then confirm the connection to port 1514. That order isolates the fault in three steps instead of twenty.
5. **Generate the four test events** (task 5) and find each one in both the raw log and Wazuh. Watch for an event that matches *no* rule — that is your opening for step 6.
6. **Write the three detection rules** (task 6), using the `if_matched_sid` + `frequency` + `same_source_ip` pattern as a model. For each, be able to answer the five questions from Part 2, and **test each one by regenerating its event**. A rule you have not seen fire is a rule you have not written.
7. **Run the PortSwigger labs throughout** (task 7), ten Apprentice level, written up in the Phase 3 format. These need no hardware, so they are what you do on days when the lab is broken — which is a real scheduling benefit, not just a fallback.
8. **Do the two blue-team labs** (task 8) as close to the end as you can, because they exercise everything: log reading, timeline building, network interpretation, and reporting. Write them up as if for an employer, because that is exactly what they are.
9. **Write the incident report last** (task 9), from a real event in your own lab, using your own detection rule. Use UTC, state the impact honestly, and check the root-cause line names a control gap rather than a user action.

Then assemble `portfolio/cyber/04-hands-on-labs.md` against the deliverable checklist, and read it back asking one question: **if a hiring manager opened this file for ninety seconds, would they see evidence of someone who can operate a SIEM?** If the diagram, the rules with reasoning, and the reports are there, the answer is yes — and you are ready for Phase 5's specialisation choice, which will be much easier to make because you will have discovered which of these activities you actually enjoyed.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Wazuh | Free SIEM/XDR | Free/open-source | https://wazuh.com/ | Install Wazuh, forward logs from a VM, write 3 detection rules | Elastic/Splunk free tier |
| VirtualBox | VM platform | Free | https://www.virtualbox.org/ | Run Windows/Linux lab VMs | VMware Player personal use |
| Sysmon | Windows telemetry | Free | https://learn.microsoft.com/sysinternals/downloads/sysmon | Send process logs to Wazuh | Windows logs only |
| Security Onion | Blue-team monitoring distro | Free/open-source | https://securityonionsolutions.com/software/ | Optional: review docs or install if hardware allows | Wazuh + Wireshark |
| TryHackMe | Guided cyber labs | Free/freemium | https://tryhackme.com/ | Finish free Pre Security/Cyber Security 101 rooms | PortSwigger/CyberDefenders free |
| CyberDefenders | Blue-team labs | Freemium | https://cyberdefenders.org/ | Complete one free beginner lab | Blue Team Labs Online free |
| Blue Team Labs Online | SOC-style labs | Freemium | https://blueteamlabs.online/ | Complete one free challenge | CyberDefenders free |
| PortSwigger Academy | Web security labs | Free | https://portswigger.net/web-security | Complete 10 Apprentice labs | OWASP Juice Shop local |
| OWASP Juice Shop | Vulnerable web app | Free/open-source | https://owasp.org/www-project-juice-shop/ | Run locally and find 3 beginner issues | PortSwigger labs |

## Free/cheap resources

- Wazuh quickstart — https://documentation.wazuh.com/current/quickstart.html
- Wazuh custom rules docs — https://documentation.wazuh.com/current/user-manual/ruleset/rules/custom.html
- TryHackMe free rooms — https://tryhackme.com/
- PortSwigger Academy — https://portswigger.net/web-security
- CyberDefenders — https://cyberdefenders.org/
- Blue Team Labs Online — https://blueteamlabs.online/
- OWASP Juice Shop docs — https://pwning.owasp-juice.shop/

## Hands-on practice tasks

1. Build a lab diagram before installing anything.
2. Install VirtualBox and at least one Linux VM.
3. Install Wazuh using the official quickstart if your machine can handle it.
4. Forward logs from one Windows or Linux VM to Wazuh.
5. Generate safe test events: failed login, new user, suspicious command string in lab notes, service restart.
6. Write 3 detection rules or rule modifications for your lab events.
7. Complete 10 PortSwigger Apprentice labs.
8. Complete 2 free blue-team labs from CyberDefenders/BTLO/LetsDefend.
9. Write one incident report from a lab.
10. Start a lab notebook and record at least 5 entries: the goal, the commands, the exact error text, and what you did next.

## Deliverable / proof of work

Create `portfolio/cyber/04-hands-on-labs.md` with:

- Lab network diagram
- Wazuh install notes or documented hardware limitation
- Log forwarding screenshot
- 3 detection rules with explanation
- 10 web lab notes
- 2 blue-team lab reports
- 1 incident report

## Checklist

- [ ] I built a lab diagram. <!-- id: cyber-04-c01 energy: normal -->
- [ ] I installed at least one Linux VM. <!-- id: cyber-04-c02 energy: normal -->
- [ ] I installed Wazuh or documented why hardware blocks it. <!-- id: cyber-04-c03 energy: normal -->
- [ ] I forwarded logs from a VM. <!-- id: cyber-04-c04 energy: normal -->
- [ ] I generated safe test events. <!-- id: cyber-04-c05 energy: normal -->
- [ ] I wrote 3 detection rules or rule modifications. <!-- id: cyber-04-c06 energy: normal -->
- [ ] I completed 10 PortSwigger labs. <!-- id: cyber-04-c07 energy: normal -->
- [ ] I completed 2 blue-team labs. <!-- id: cyber-04-c08 energy: normal -->
- [ ] I wrote one incident report. <!-- id: cyber-04-c09 energy: normal -->
- [ ] I kept a lab notebook with dated entries, exact error text, and what I tried. <!-- id: cyber-04-c10-lab-notebook energy: low -->

## You're ready to move on when...

You can show a hiring manager logs flowing into a SIEM, explain what triggered an alert, and write a short incident report.

## Free vs Paid

### What's free and enough

Wazuh, VirtualBox, Sysmon, PortSwigger Academy, CyberDefenders free labs, BTLO free labs, and TryHackMe free rooms are enough.

### What's paid and why you'd upgrade

TryHackMe Premium unlocks more guided rooms and attack boxes. Burp Pro and paid blue-team platforms add convenience, not required skill.

### When it's worth paying

This is the first phase where **one month of TryHackMe Premium may be worth it**, but only after completing the prerequisites in `WHEN-TO-BUY-THM-PREMIUM.md`.
