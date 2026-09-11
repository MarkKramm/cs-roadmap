# Phase 5 — Sysadmin Basics

## Goal of this phase

Learn beginner admin tasks that make you stronger than a basic script-reading helpdesk applicant.

## Estimated time

**4 weeks**. This is not full sysadmin mastery; it is practical exposure.

## Skills you'll gain

- Understand users, groups, permissions, shared folders, and access requests.
- Understand Active Directory concepts even if you cannot run a full enterprise domain.
- Practice Microsoft 365 and Google Workspace admin concepts through documentation and free trials/docs.
- Understand backups, patching, monitoring, endpoint inventory, and basic automation.
- Use PowerShell and Bash for simple admin tasks.

## Specific topics to learn

### Identity and access

- Local accounts vs domain accounts
- Active Directory basics: domain, domain controller, OU, user, group, GPO
- Microsoft Entra ID basics: cloud identity, MFA, conditional access concept
- Google Workspace basics: users, groups, aliases, shared drives
- Least privilege and access review

### File and endpoint administration

- NTFS permissions vs share permissions
- Shared folder troubleshooting
- Printer management basics
- Software installation/removal
- Patch/update process
- Backups: full, incremental, cloud sync vs real backup

### Monitoring and maintenance

- Disk space checks
- Service status checks
- Event logs
- Uptime/reboot checks
- Basic inventory
- Simple scripts

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Windows Computer Management | Local users, disks, services | Free, built-in | https://learn.microsoft.com/windows | Create local test user and group | PowerShell commands |
| PowerShell | Windows admin automation | Free | https://learn.microsoft.com/powershell/ | Script disk/service inventory | CMD manual checks |
| Windows Admin Center | Server/admin management | Free | https://www.microsoft.com/windows-server/windows-admin-center | Read docs/watch demo; optional lab if Windows Server trial | Server Manager on trial VM |
| Microsoft Learn M365 admin docs | Cloud admin learning | Free docs | https://learn.microsoft.com/microsoft-365/admin/ | Document user/MFA/group workflows | Google Workspace docs |
| Google Admin Help | Google Workspace admin docs | Free docs | https://support.google.com/a/ | Document user/group reset workflow | Microsoft Learn |
| Veeam Agent for Microsoft Windows Free | Endpoint backup | Free | https://www.veeam.com/agent-for-windows-community-edition.html | Create backup plan notes | Windows Backup/File History |
| Uptime Kuma | Simple monitoring | Free/open-source | https://uptime.kuma.pet/ | Monitor your router or local service | Ping script |

## Free/cheap resources

- Microsoft Learn: Windows Server and admin basics — https://learn.microsoft.com/en-us/training/windowsserver/
- Microsoft 365 admin documentation — https://learn.microsoft.com/en-us/microsoft-365/admin/
- Microsoft Entra documentation — https://learn.microsoft.com/en-us/entra/
- Google Workspace Admin Help — https://support.google.com/a/
- PowerShell learning — https://learn.microsoft.com/en-us/training/modules/introduction-to-powershell/

## Hands-on practice tasks

1. Create a local Windows user called `test-support-user` and a local group called `TestSupportGroup`.
2. Create a folder and practice read-only vs modify permissions.
3. Write a PowerShell script that outputs computer name, OS version, disk free space, and running services.
4. Read Microsoft 365 admin docs and document how to reset a password, enable MFA, and add a user to a group.
5. Read Google Workspace admin docs and document how to reset a password, suspend a user, and create a group.
6. Install Uptime Kuma locally or read its docs and design a simple monitoring plan.
7. Create a patching checklist for a small remote company.

## Deliverable / proof of work

Create `portfolio/it/05-sysadmin-basics.md` with:

- Screenshots or notes for local users/groups
- Shared folder permission experiment
- PowerShell inventory script
- Microsoft 365 admin workflow notes
- Google Workspace admin workflow notes
- Small-business patching checklist

## Checklist

- [ ] I understand local vs domain vs cloud identity.
- [ ] I can explain Active Directory at a beginner level.
- [ ] I understand users, groups, OUs, GPOs, and MFA conceptually.
- [ ] I practiced local users/groups.
- [ ] I practiced folder permissions.
- [ ] I wrote a simple PowerShell inventory script.
- [ ] I documented M365 and Google Workspace admin workflows.
- [ ] I created a patching checklist.

## You're ready to move on when...

You can explain how you would onboard a new remote employee: create account, assign groups, enable MFA, install apps, document device, and provide first-login instructions.

## Free vs Paid

### What's free and enough

Microsoft Learn, Google Admin Help, local Windows tools, PowerShell, and free backup/monitoring tools are enough.

### What's paid and why you'd upgrade

Microsoft 365 business tenants, Google Workspace, RMM tools, and enterprise backup platforms are paid because businesses need real user management, compliance, support, and scale.

### When it's worth paying

Do not pay personally in this phase. If you later get a job, your employer provides these tools.
