---
id: cyber-03-security-fundamentals
track: cyber
phase: 3
order: 30
title: "Phase 3 — Security Fundamentals"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/cyber/03-security-fundamentals.md"
exit_criteria: "You can explain a simple attack like phishing or web login abuse and name the logs, controls, and response steps involved."
---

# Phase 3 — Security Fundamentals

## Goal of this phase

Learn the core security concepts used across SOC, GRC, IT security, and pentesting before choosing a specialization.

## Estimated time

**6 weeks**. This phase is broad; the goal is working literacy, not mastery.

## Skills you'll gain

- Understand identity security, endpoint security, network security, web security, cloud basics, logging, vulnerability management, and incident response.
- Read alerts and logs with basic context.
- Understand common weaknesses and controls.
- Map simple attacks to MITRE ATT&CK and OWASP Top 10.

## Specific topics to learn

### Identity and access

- Authentication, authorization, accounting
- MFA, SSO, password policies
- Least privilege, RBAC, access reviews
- Account lockout, suspicious login, impossible travel

### Endpoint and malware basics

- EDR/AV purpose
- Malware persistence concept
- Suspicious processes
- Windows Event IDs at beginner level: 4624 successful login, 4625 failed login, 4688 process creation if enabled
- Linux auth logs

### Network security

- Firewalls and rules
- IDS/IPS concepts
- VPNs and segmentation
- Secure ports/protocols
- DNS filtering concept

### Web security

- OWASP Top 10
- SQL injection concept
- XSS concept
- Authentication/session weaknesses
- IDOR concept
- Security headers basics

### Vulnerability management

- CVE, CVSS, EPSS concept
- Asset inventory
- Prioritization
- Remediation vs mitigation
- Patch verification

### Incident response

- Preparation, identification, containment, eradication, recovery, lessons learned
- Evidence handling basics
- Incident timeline
- Reporting

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Windows Event Viewer | View Windows logs | Free | https://learn.microsoft.com/windows | Find login-related events | PowerShell log commands |
| Sysmon | Adds detailed Windows telemetry | Free | https://learn.microsoft.com/sysinternals/downloads/sysmon | Install in lab and view process events | Windows Security logs only |
| Wazuh | SIEM/XDR/log analysis | Free/open-source | https://wazuh.com/ | Read install docs and plan lab | Elastic/Splunk free tier |
| Greenbone Community Edition | Vulnerability scanning | Free/open-source | https://greenbone.github.io/docs/latest/ | Study scanner workflow; optional local scan | Nmap scripts |
| OWASP ZAP | Web app security testing | Free/open-source | https://www.zaproxy.org/ | Passive scan a local/test app | Burp Suite Community |
| Burp Suite Community | Web proxy | Free/community | https://portswigger.net/burp/communitydownload | Intercept a PortSwigger lab request | OWASP ZAP |
| CIS Controls | Security controls framework | Free | https://www.cisecurity.org/controls | Map 5 controls to home lab | NIST CSF |

## Free/cheap resources

- OWASP Top 10 — https://owasp.org/www-project-top-ten/
- PortSwigger Web Security Academy — https://portswigger.net/web-security
- MITRE ATT&CK — https://attack.mitre.org/
- Wazuh documentation — https://documentation.wazuh.com/
- CIS Controls — https://www.cisecurity.org/controls
- Microsoft security documentation — https://learn.microsoft.com/en-us/security/
- CISA known exploited vulnerabilities catalog — https://www.cisa.gov/known-exploited-vulnerabilities-catalog

## Hands-on practice tasks

1. Install Sysmon on a Windows VM or your own lab machine if safe.
2. Generate a few safe events: open PowerShell, create a file, fail a login, install/uninstall a harmless app.
3. Find related logs in Event Viewer.
4. Complete 5 PortSwigger Apprentice-level labs.
5. Use Burp Community or OWASP ZAP to intercept your own browser traffic to a training lab.
6. Pick 5 CVEs from CISA KEV and summarize affected product, impact, and fix.
7. Write a mock incident timeline for a phishing login.

## Deliverable / proof of work

Create `portfolio/cyber/03-security-fundamentals.md` with:

- Event Viewer/Sysmon screenshots
- 5 PortSwigger lab notes
- 5 CVE summaries
- One mock incident timeline
- Table mapping 5 risks to CIS or NIST controls

## Checklist

- [ ] I understand identity security basics. <!-- id: cyber-03-c01 energy: low -->
- [ ] I understand endpoint security basics. <!-- id: cyber-03-c02 energy: low -->
- [ ] I understand network security basics. <!-- id: cyber-03-c03 energy: low -->
- [ ] I understand OWASP Top 10 at a basic level. <!-- id: cyber-03-c04 energy: low -->
- [ ] I completed 5 PortSwigger labs. <!-- id: cyber-03-c05 energy: normal -->
- [ ] I inspected Windows security/process logs. <!-- id: cyber-03-c06 energy: normal -->
- [ ] I summarized 5 CVEs. <!-- id: cyber-03-c07 energy: normal -->
- [ ] I wrote a mock incident timeline. <!-- id: cyber-03-c08 energy: normal -->

## You're ready to move on when...

You can explain a simple attack like phishing or web login abuse and name the logs, controls, and response steps involved.

## Free vs Paid

### What's free and enough

Event Viewer, Sysmon, Wazuh docs, PortSwigger Academy, Burp Community, OWASP ZAP, MITRE, CIS, and NIST are enough.

### What's paid and why you'd upgrade

Burp Suite Professional, commercial SIEMs, and paid vulnerability scanners add speed, automation, and enterprise features.

### When it's worth paying

Not in this phase. Burp Community and free labs are enough.
