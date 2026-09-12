---
id: it-05-sysadmin-basics
track: it
phase: 5
order: 50
title: "Phase 5 — Sysadmin Basics"
duration: "4 weeks"
duration_weeks: 4
energy_mix: [low, normal]
deliverable: "portfolio/it/05-sysadmin-basics.md"
exit_criteria: "You can explain how you would onboard a new remote employee: create account, assign groups, enable MFA, install apps, document device, and provide first-login instructions."
---

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

## Lesson: Sysadmin Basics

### Why this lesson exists

Helpdesk teaches you to fix one user's problem. This phase teaches you to understand **why the organisation is built the way it is** — and that shift is what moves you from "the person who resets passwords" to "the person who can be trusted with systems".

Here is the practical reason it matters for getting hired. Two candidates apply for the same entry-level IT support role. Both can troubleshoot Windows. One of them can explain what a group is for, why permissions are layered, what a backup actually protects against, and why patching schedules exist. That candidate gets the interview, because the hiring manager hears someone who will not accidentally break something in month two.

You are not becoming a system administrator in four weeks. This phase is deliberately framed as **practical exposure**: enough understanding of identity, access, files, endpoints, and maintenance to be genuinely useful, to follow an admin's instructions, and to ask sensible questions.

**Time to complete:** roughly 15–20 hours across the phase. The reading is a small part of it. Most of the value is in the practice tasks at the bottom — creating real users and groups, breaking and fixing folder permissions, and writing a PowerShell script that actually runs.

**A note on what you cannot do from home.** You cannot stand up a real enterprise Active Directory domain on a laptop without significant effort, and you do not need to. The enterprise tools here are learned by reading authoritative documentation and mapping it onto the concepts you *can* practise locally with local accounts and NTFS permissions. That is a legitimate way to learn, and it is how you will talk about it in interviews: not "I ran a domain controller", but "I understand what a domain controller does and I practised the equivalent concepts with local accounts and NTFS". Honesty about the boundary is a strength.

### Part 1 — Identity and access: the heart of the job

#### Everything starts with identity

Every request in IT support reduces to the same question: **who are you, and what are you allowed to do?**

That is why identity is the first topic in this phase. Local accounts, domain accounts, cloud identities — they are all answers to that question at different scales.

| Type | What it is | Where it lives | Typical use |
|---|---|---|---|
| **Local account** | An account that exists only on one machine | That machine's SAM database | Home PCs, break-glass admin, workgroup machines |
| **Domain account** | An account managed centrally by a directory | Active Directory, on a domain controller | Traditional corporate networks |
| **Cloud identity** | An account managed by a cloud service | Microsoft Entra ID, Google Workspace | Modern and hybrid organisations |

The important distinction is not the technology; it is **centralisation**. A local account has to be created on every machine, one at a time, and its password has to be reset on every machine, one at a time. A domain account is created once and works everywhere in the domain. The moment an organisation has more than a handful of computers, centralisation stops being convenient and becomes essential.

You can read this for yourself in the table above and then verify it on your own machine: open **Computer Management** (`compmgmt.msc`), go to **Local Users and Groups**, and you are looking at the local identity store. Create a test user there and you have done the same *operation* an admin does in Active Directory — just at a smaller scale.

#### Active Directory, in terms a beginner can actually hold

Active Directory (AD) is a database of identities and rules, served by one or more **domain controllers**. The vocabulary you need:

- **Domain** — the security boundary. `company.local` or `company.com`. Everything inside shares the same identity store and rules.
- **Domain controller (DC)** — the server running Active Directory. There are usually at least two, so that losing one does not lose identity for the whole company.
- **Organisational Unit (OU)** — a folder for organising objects. Companies put users in OUs by department, or by location, so that rules can be applied to a group of people at once.
- **User object** — an account: a person, or a service.
- **Group** — a collection of users. **Permissions are assigned to groups, not to people.** This is the single most important design idea in the whole phase.
- **Group Policy Object (GPO)** — a set of settings applied automatically to machines or users in an OU. Password rules, desktop wallpaper, mapped drives, USB restrictions, and hundreds of other things.

If you remember one sentence from this section, make it the group one. Assigning permissions directly to individual users is the mistake that turns a tidy environment into an unauditable mess. When someone leaves, you cannot tell what they had access to. When someone changes role, you cannot safely update them. When you are asked "who can read the finance folder?", the honest answer becomes "I would have to check."

#### Groups are the answer to almost every access question

The pattern professional environments use:

```text
User → (is a member of) → Group → (is granted) → Permission
```

So instead of "Maria can read the Finance share", you have "Maria is a member of Finance-ReadOnly, and Finance-ReadOnly can read the Finance share." Now:

- A new finance hire joins the same group and gets the same access immediately.
- Someone moves department and is removed from one group, added to another.
- Someone leaves, and their account is disabled — the group membership becomes irrelevant.
- An auditor asks who can read the Finance share, and you read one group's membership.

This is why the phase's hands-on task is to create a local group and assign permissions to *it* rather than to a user. You are practising the pattern, not the keystroke.

#### Least privilege and access review

**Least privilege** means every account has the minimum access needed to do its job, and no more. It is not a policy that exists to make your life harder; it is the difference between one compromised account and a compromised company.

In practice, least privilege looks like:

- Most users are standard users, not local administrators.
- Admin rights are granted temporarily, for a specific task, and removed afterwards.
- Service accounts have access to exactly the resources their service needs.
- Nobody holds "Domain Admin" because it was convenient during setup.

**Access review** is the periodic check that membership is still correct: who is in the finance group, should all of them be, and is anyone still in a group from a role they left two years ago? Access accumulates silently. Access review is how organisations stop it.

#### Microsoft Entra ID and Google Workspace

Cloud identity follows the same logic with different vocabulary:

- **Microsoft Entra ID** (formerly Azure AD) is Microsoft's cloud identity service. Hybrid organisations sync on-premises AD into it, so one account works for both the office network and Microsoft 365.
- **Multi-factor authentication (MFA)** requires a second proof of identity beyond a password — an app code, a hardware key, a push approval. Passwords alone are no longer adequate; credential stuffing is cheap and automated.
- **Conditional access** is the rule engine deciding when MFA is required. Signing in from the usual office on the usual laptop might need nothing extra; signing in from a new country at 3am might be blocked outright. This is where "the VPN is being awkward" tickets come from.
- **Google Workspace** has the same primitives under Google's names: users, groups, **aliases** (extra addresses delivering to one mailbox), **shared drives** (team-owned storage that survives an individual leaving), and suspension rather than deletion when someone departs.

You will not have paid access to these services in this phase. You will read the official admin documentation and write down the workflows — reset a password, enable MFA, add a user to a group, suspend a user — as if you were doing them. That documentation is exactly what a support technician follows in a real job, and being able to read it quickly is a genuinely marketable skill.

### Part 2 — Files, endpoints, and permissions

#### NTFS permissions versus share permissions

This is the topic that confuses beginners more than any other, and it has a clean answer.

When you access a folder across the network on Windows, **two independent permission systems apply, and the most restrictive wins.**

1. **Share permissions** are set on the shared folder itself. They are coarse — typically just Read, Change, or Full Control for a group.
2. **NTFS permissions** are set on the file system folder. They are granular — Read, Write, Modify, Full Control, and many advanced rights, plus inheritance.

The result rule is what matters:

```text
Effective access = the more restrictive of (share permission, NTFS permission)
```

So if the share grants **Read** and NTFS grants **Modify**, the user gets **Read**. A technician who checks only one of the two will spend an hour confused about why a user "has permission" but cannot save. **Check both.** That is the whole lesson of this section, and it is a genuinely common ticket.

Two more NTFS ideas worth holding:

- **Inheritance** means a subfolder inherits permissions from its parent. When you change a parent folder, children usually follow. "It worked yesterday" often means someone changed a parent and did not realise the reach of the change.
- **Explicit versus inherited** permissions matter when troubleshooting: an explicit *Deny* overrides an inherited *Allow*, and deny entries are the usual culprit behind inexplicable access failures.

#### Practice it, safely

The phase task is to create a folder and experiment with read-only versus modify. Do this on a **throwaway folder with test files**, not on your Documents or Desktop. Feel how the permission change behaves: log in as the test user, try to create a file, try to edit one, and note the exact error. Then fix it by adding the group to the NTFS permissions.

That loop — break it deliberately, observe the failure, fix it properly — is worth more than reading three articles about it. You will recognise that error message for years.

#### Printers, software, and patching

- **Printer management** is mostly working bottom-up: is it powered, on the network, reachable, correctly installed, and is the user printing to the one they think? Most printer tickets resolve in that order.
- **Software installation and removal** is where packaging and privilege meet. Users usually cannot install software themselves (least privilege again), so support does it for them — and on a managed fleet, consistently, not by clicking through an installer on each machine.
- **Patch and update process** is the routine of applying vendor security updates on a schedule, testing before broad rollout, and tracking which machines are behind. This is unglamorous and it is one of the highest-value things an IT team does, because the overwhelming majority of real-world compromises exploit vulnerabilities that had a patch available.

#### Backups: the part where people fool themselves

**A backup is only a backup if you have restored from it.** Everything else is optimism.

| Term | What it copies | Restore cost |
|---|---|---|
| **Full** | Everything | Fastest restore, largest storage, slowest backup |
| **Incremental** | Only what changed since the last backup of any kind | Smallest and fastest backup; restore needs the full plus every increment |
| **Differential** | Everything changed since the last *full* | Middle ground; restore needs the full plus the latest differential |

Then the trap:

- **Cloud sync is not a backup.** OneDrive, Google Drive, and Dropbox keep files in step — including in step with ransomware encryption, an accidental deletion, or a bad edit. Sync propagates the mistake. A backup keeps an independent copy you can go back to.
- **The 3-2-1 rule** is the professional habit: three copies of the data, on two different media, with one copy off-site. For a home lab, "the original, an external drive, and cloud storage" is a faithful $0 approximation.
- **Unverified backups fail when you need them.** The most valuable habit is a **test restore** — pick a file, restore it, confirm it opens. Do this once and you will never trust an untested backup again.

### Part 3 — Monitoring, maintenance, and automation

#### The routine checks that prevent incidents

Most serious outages are preceded by warnings nobody looked at. The routine checks in this phase exist to catch those warnings:

- **Disk space** — a full system drive is a predictable outage. Check on a schedule rather than after it fills.
- **Service status** — critical services should be running. A stopped print spooler or a stalled backup service is visible now and invisible later.
- **Event logs** — Windows records disk errors, service failures, and application faults long before users notice. Reading Event Viewer is a core support skill.
- **Uptime and reboot status** — some machines have not rebooted in months. Pending updates and memory leaks are the usual reasons that matters.
- **Basic inventory** — what machines exist, who has them, what is on them. You cannot patch, back up, or secure a device you do not know about.

Run each by hand once, so you know what "normal" looks like. Then automate them.

#### Writing a PowerShell inventory script

The phase task asks for a script reporting computer name, OS version, disk free space, and running services. Here is one you can actually run — read it line by line:

```powershell
# Basic machine inventory — save as inventory.ps1
$os    = Get-CimInstance Win32_OperatingSystem
$disks = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3"

Write-Output "Computer : $env:COMPUTERNAME"
Write-Output "OS       : $($os.Caption) $($os.Version)"
Write-Output "Last boot: $($os.LastBootUpTime)"
Write-Output ""

foreach ($d in $disks) {
    $freeGB  = [math]::Round($d.FreeSpace / 1GB, 1)
    $totalGB = [math]::Round($d.Size / 1GB, 1)
    Write-Output "Drive $($d.DeviceID) — $freeGB GB free of $totalGB GB"
}

Write-Output ""
Write-Output "Auto-start services currently running:"
Get-Service |
    Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -eq 'Running' } |
    Select-Object -First 10 Name, DisplayName |
    Format-Table -AutoSize
```

Why these choices, and not others:

- **`Get-CimInstance` rather than `wmic`.** `wmic` is deprecated and being removed from Windows. New scripts use the CIM cmdlets. You will still meet `wmic` in old documentation and on old systems, so recognise it, but do not write it.
- **`[math]::Round(..., 1)`** turns raw bytes into readable gigabytes. Raw byte counts are technically correct and useless to a human.
- **`-Filter "DriveType=3"`** restricts the query to local fixed disks, excluding removable drives and CD-ROMs.
- **Filtering services to automatic-and-running** is the useful view. Listing all 200 services buries the signal.

Run it, and note the moment the output appears on your screen. That is the difference between having read about PowerShell and having used it. The second is what you talk about in interviews.

#### Where automation is heading

You do not need to be a scripter to be good at entry-level IT support. You do need to recognise the pattern: **anything you do more than twice by hand is a candidate for a script or a process.**

That instinct is what turns a support technician into an administrator. An admin asked to check disk space on forty machines does not check forty machines — they write nine lines of PowerShell and read a report. The script above is that instinct in miniature.

#### Onboarding a remote employee: the integration exercise

The phase's exit criterion is that you can explain how you would onboard a new remote employee. This is the best rehearsal for an interview, because it touches every topic in the phase at once. A complete answer covers:

1. **Create the account** in the identity system (M365, Google Workspace, or AD), with the correct naming convention.
2. **Assign groups** rather than individual permissions, so access matches the role from day one.
3. **Enable MFA** and provide enrolment instructions, including what to do if the phone is lost.
4. **Provision the device** — image it, join it to management, install the standard software set, apply the patching policy.
5. **Record it in inventory** — asset tag, assigned user, date, warranty, expected replacement.
6. **Provide first-login instructions** — how to sign in, connect to the VPN, reach the service desk, and who their buddy is.
7. **Confirm it works** — do not hand over and walk away. Watch them sign in successfully.
8. **Schedule the follow-up** — a check-in after a week catches small problems before they become tickets.

Practise saying that list out loud, in order, in about ninety seconds. It is a genuinely strong interview answer, and it demonstrates systems thinking rather than tool knowledge.

### Key takeaways

- Identity answers one question: **who are you and what are you allowed to do?** Local, domain, and cloud accounts are the same answer at different scales.
- **Permissions are assigned to groups, not people.** Everything else depends on this.
- **Least privilege** means minimum access, granted deliberately. **Access review** is how you stop access accumulating.
- **Effective access is the more restrictive of share and NTFS permissions.** Check both when troubleshooting.
- **An untested backup is not a backup.** Cloud sync is not a backup either — it propagates mistakes.
- **3-2-1**: three copies, two media, one off-site.
- Routine checks — disks, services, event logs, uptime, inventory — catch outages before users do.
- **`Get-CimInstance` replaces `wmic`** in modern PowerShell.
- **Anything done more than twice by hand is a candidate for automation.**
- You cannot run enterprise systems from home, and that is fine — **reading the official admin documentation and documenting the workflow is legitimate, and honesty about the boundary is a strength.**

### Practice this next

The tasks below are the phase. Create the user and group, break and fix folder permissions, run the inventory script, and write both admin workflow documents from the official docs. Assemble them into the portfolio deliverable, and rehearse the remote-onboarding answer out loud — it is the exit criterion and the most likely interview question this phase prepares you for.

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

- [ ] I understand local vs domain vs cloud identity. <!-- id: it-05-c01 energy: low -->
- [ ] I can explain Active Directory at a beginner level. <!-- id: it-05-c02 energy: low -->
- [ ] I understand users, groups, OUs, GPOs, and MFA conceptually. <!-- id: it-05-c03 energy: low -->
- [ ] I practiced local users/groups. <!-- id: it-05-c04 energy: normal -->
- [ ] I practiced folder permissions. <!-- id: it-05-c05 energy: normal -->
- [ ] I wrote a simple PowerShell inventory script. <!-- id: it-05-c06 energy: normal -->
- [ ] I documented M365 and Google Workspace admin workflows. <!-- id: it-05-c07 energy: normal -->
- [ ] I created a patching checklist. <!-- id: it-05-c08 energy: normal -->

## You're ready to move on when...

You can explain how you would onboard a new remote employee: create account, assign groups, enable MFA, install apps, document device, and provide first-login instructions.

## Free vs Paid

### What's free and enough

Microsoft Learn, Google Admin Help, local Windows tools, PowerShell, and free backup/monitoring tools are enough.

### What's paid and why you'd upgrade

Microsoft 365 business tenants, Google Workspace, RMM tools, and enterprise backup platforms are paid because businesses need real user management, compliance, support, and scale.

### When it's worth paying

Do not pay personally in this phase. If you later get a job, your employer provides these tools.
