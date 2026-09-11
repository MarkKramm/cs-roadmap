---
id: it-06-tools-and-ticketing
track: it
phase: 6
order: 60
title: "Phase 6 — Tools and Ticketing"
duration: "2 weeks"
duration_weeks: 2
energy_mix: [low, normal]
deliverable: "portfolio/it/06-tools-and-ticketing.md"
exit_criteria: "You can explain how a ticket moves through a support team and show sample tickets that look professional."
---

# Phase 6 — Tools and Ticketing

## Goal of this phase

Get comfortable with the tools and workflows common in remote IT support teams.

## Estimated time

**2 weeks**. This phase is short because you already practiced ticketing in Phase 4.

## Skills you'll gain

- Understand ticketing platforms and ITSM vocabulary.
- Use remote support tools safely.
- Understand asset inventory, monitoring, documentation, and password managers.
- Read vendor documentation without getting overwhelmed.
- Simulate a small IT support workflow from request to resolution.

## Specific topics to learn

- ITSM basics: incident, request, problem, change, asset, knowledge base
- Ticket quality: summary, impact, urgency, steps tried, resolution, closure note
- Remote support security: consent, session recording policy, least privilege, never ask for passwords
- Asset inventory: device owner, serial number, OS, warranty, installed apps
- Documentation: runbooks, KB articles, escalation notes
- Password management: vaults, MFA, recovery codes
- Monitoring alerts: up/down, CPU, disk, memory, latency

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Jira Service Management | Enterprise ITSM/ticketing | Freemium/paid | https://www.atlassian.com/software/jira/service-management | Read docs and create sample workflow if free tier available | osTicket |
| Zendesk | Customer support/ticketing | Paid/trial | https://www.zendesk.com/ | Study ticket fields from docs | osTicket/Spiceworks |
| Freshdesk | Helpdesk/ticketing | Freemium/paid | https://www.freshworks.com/freshdesk/ | Create sample support portal if free tier available | osTicket |
| ServiceNow | Enterprise ITSM | Paid | https://www.servicenow.com/ | Read ITSM glossary and watch demo | Jira free docs/osTicket |
| Snipe-IT | Asset management | Free self-hosted/paid hosted | https://snipeitapp.com/ | Create 5 fake assets | Google Sheets inventory |
| Bitwarden | Password manager | Freemium | https://bitwarden.com/ | Create vault entries for lab accounts | KeePassXC |
| Zabbix | Monitoring | Free/open-source | https://www.zabbix.com/ | Read docs or monitor local host | Uptime Kuma |

## Free/cheap resources

- Atlassian ITSM guide — https://www.atlassian.com/itsm
- ServiceNow ITSM page — https://www.servicenow.com/products/itsm.html
- Snipe-IT documentation — https://snipe-it.readme.io/
- Bitwarden learning center — https://bitwarden.com/learning/
- Zabbix documentation — https://www.zabbix.com/documentation/current/en/manual

## Hands-on practice tasks

1. Create a mini ITSM workflow diagram: request -> triage -> troubleshoot -> resolve -> close.
2. Build a fake asset inventory with 10 devices in Snipe-IT or Google Sheets.
3. Create a password vault for lab-only accounts using Bitwarden or KeePassXC.
4. Create 5 ticket templates: password reset, VPN issue, printer issue, no internet, suspicious email.
5. Create a change request template for “install software for user.”
6. Create a monitoring alert response runbook for “website down” or “router unreachable.”

## Deliverable / proof of work

Create `portfolio/it/06-tools-and-ticketing.md` with:

- ITSM workflow diagram
- 10-row asset inventory
- 5 ticket templates
- 1 change request template
- 1 monitoring alert runbook

## Checklist

- [ ] I understand incident, request, problem, change, asset, and KB. <!-- id: it-06-c01 energy: low -->
- [ ] I compared Jira, Zendesk, Freshdesk, ServiceNow, and osTicket. <!-- id: it-06-c02 energy: normal -->
- [ ] I created an asset inventory. <!-- id: it-06-c03 energy: normal -->
- [ ] I created ticket templates. <!-- id: it-06-c04 energy: normal -->
- [ ] I created a change request template. <!-- id: it-06-c05 energy: normal -->
- [ ] I created a monitoring alert runbook. <!-- id: it-06-c06 energy: normal -->
- [ ] I understand safe remote support behavior. <!-- id: it-06-c07 energy: low -->

## You're ready to move on when...

You can explain how a ticket moves through a support team and show sample tickets that look professional.

## Free vs Paid

### What's free and enough

osTicket, Spiceworks, Snipe-IT self-hosted, Bitwarden free, KeePassXC, Uptime Kuma, and Google Sheets are enough.

### What's paid and why you'd upgrade

Enterprise teams pay for ServiceNow, Zendesk, Freshdesk, Jira, hosted Snipe-IT, and RMM suites because they need automation, SLAs, reporting, compliance, and integrations.

### When it's worth paying

Do not pay. Learn the concepts and free alternatives.
