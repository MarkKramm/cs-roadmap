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

## You're ready to move on when...

You can show a hiring manager logs flowing into a SIEM, explain what triggered an alert, and write a short incident report.

## Free vs Paid

### What's free and enough

Wazuh, VirtualBox, Sysmon, PortSwigger Academy, CyberDefenders free labs, BTLO free labs, and TryHackMe free rooms are enough.

### What's paid and why you'd upgrade

TryHackMe Premium unlocks more guided rooms and attack boxes. Burp Pro and paid blue-team platforms add convenience, not required skill.

### When it's worth paying

This is the first phase where **one month of TryHackMe Premium may be worth it**, but only after completing the prerequisites in `WHEN-TO-BUY-THM-PREMIUM.md`.
