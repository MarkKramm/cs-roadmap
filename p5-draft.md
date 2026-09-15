### Part 4 — Reading access evidence like a technician

#### The shift from knowing to looking

Parts 1 to 3 taught you what identity, permissions, and backups *are*. This part teaches you to **look at a real system and read what it tells you**. That is a different skill, and it is the one an interviewer probes, because anyone can repeat a definition while far fewer people can open a command prompt and explain the output on the screen.

Access troubleshooting has a shape you will use for the rest of your career:

1. Find out **who the machine thinks you are** right now.
2. Find out **what that identity is a member of**.
3. Find out **what the resource actually grants**, and to whom.
4. Compare the three, and the gap is your answer.

Most access tickets are solved by noticing that one of those three does not match what everyone assumed. The user believes they are in the Finance group. The group does exist. But the permission on the folder was granted to a *different* group, or to the user personally, months ago. The evidence shows it; the assumptions hide it.

#### Step one: who does this session think you are?

Open **Windows Terminal** or **PowerShell** and run:

```text
whoami
```

Realistic output:

```text
desktop-7f2a\maria.santos
```

Read it as two halves, separated by the backslash. The left side is the **identity source** — here a local machine named `desktop-7f2a`. The right side is the **account name**. So this session is running as a *local* account, not a domain account. In a corporate environment you would more often see `company\maria.santos`, where the left side is the domain. That difference matters: a local account is validated by this one machine, while a domain account is validated by a domain controller.

If the account is not the user’s, stop and fix that first. Half of “it says I do not have permission” tickets are simply the wrong account logged in — a shared machine, a stale session, or someone signed in with an admin account and forgot.

#### Step two: what is this identity a member of?

```text
whoami /groups
```

Realistic output, trimmed:

```text
GROUP INFORMATION
-----------------

Group Name                             Type             SID                                            Attributes
====================================== ================ ============================================== ==================================================
BUILTIN\Users                          Well-known group S-1-5-32-545                                   Mandatory group, Enabled by default, Enabled group
STUDENT-LAPTOP\Helpdesk-Team           Alias            S-1-5-21-3623811015-3361044348-30300820-1013   Mandatory group, Enabled by default, Enabled group
Everyone                               Well-known group S-1-1-0                                        Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users       Well-known group S-1-5-11                                       Mandatory group, Enabled by default, Enabled group
```

Two things to learn from this, and they are the whole point of the command.

**The SID is the truth; the name is a convenience.** A **security identifier (SID)** is the permanent, unique identifier of an account or group. Windows stores SIDs in permissions, not names. The friendly name you see is looked up from the local account database or the domain when the command runs. That lookup can fail — if a domain is unreachable, or a group was deleted, you will see a raw SID with no name beside it, or a name ending in a long number. When you see a bare SID in a permission listing, that is evidence: something was granted access to an identity that no longer resolves. Do not delete it blindly; find out what it was first.

**The `Attributes` column answers a question you will need later.** Look for entries marked **`Deny`**. A group listed with a `Deny` attribute is a *deny-only* group — membership in it removes rights rather than adding them. In a domain you may see groups with a `Use for Deny Only` attribute, which means the group’s administrative rights are deliberately stripped from this session. Seeing that on a technician’s own account is normal and good; it is the system enforcing least privilege on you.

Two more attributes worth knowing: **`Enabled group`** means the group actually applies to this logon token. **`Mandatory group`** means you cannot leave it — `Everyone`, `Authenticated Users`, and `BUILTIN\Users` are in every session by design.

#### Step three: what privileges does this session hold?

Group membership is about resources. **Privileges** are about what the session can do to the operating system itself — shut the machine down, take ownership of files, load a driver, debug a process.

```text
whoami /priv
```

Realistic output, trimmed:

```text
PRIVILEGES INFORMATION
----------------------

Privilege Name                            Description                                      State
========================================= ================================================ ========
SeShutdownPrivilege                       Shut down the system                             Disabled
SeChangeNotifyPrivilege                   Bypass traverse checking                         Enabled
SeUndoPrivilege                           Undo the last operation on removable media       Disabled
SeIncreaseWorkingSetPrivilege             Increase a process working set                   Disabled
SeTimeZonePrivilege                       Change the time zone                             Disabled
```

The reading rule: **a privilege listed is not a privilege active.** `Disabled` here does not mean the user is forbidden; it means the token *can* enable it when the operation needs it. Windows enables many privileges only for the duration of the specific action. A standard user sees a short list like this; a local administrator’s list is much longer and includes things like `SeDebugPrivilege`, `SeBackupPrivilege`, and `SeTakeOwnershipPrivilege`.

That is why “is this user an admin?” is answered properly by this command rather than by asking them. If you see the long list on an account that is supposed to be a standard user, you have found a real least-privilege finding worth escalating.

#### Step four: inspect the account itself

```text
net user maria.santos
```

Realistic output:

```text
User name                    maria.santos
Full Name                    Maria Santos
Comment
User's comment
Country/region code          000 (System Default)
Account active               Yes
Account expires              Never

Password last set            3/14/2025 9:02:11 AM
Password expires             5/13/2025 9:02:11 AM
Password changeable          3/15/2025 9:02:11 AM
Password required            Yes
User may change password     Yes

Workstations allowed         All
Logon script
User profile
Home directory
Last logon                   4/2/2025 8:41:03 AM

Logon hours allowed          All
Local Group Memberships      *Helpdesk-Team        *Users
Global Group memberships     *None
```

This single command answers most of the questions you would otherwise ask a user. Read it in this order:

- **`Account active`** — `No` means a disabled account, and no amount of permission troubleshooting will help. Check this before anything else.
- **`Password expires`** — a date in the past combined with “I cannot log in” is your answer. Note that `Last logon` being blank or very old is a strong hint the account has not been used successfully.
- **`Local Group Memberships`** — the direct memberships of this account, with asterisks as bullets.
- **`Account expires`** — `Never` is normal for staff; a date is normal for contractors and temporary accounts.

To see the whole picture for a domain account the equivalent is:

```text
net user maria.santos /domain
```

For listing accounts and groups, the `net` commands are still useful because they exist everywhere:

```text
net localgroup
net localgroup Helpdesk-Team
```

Realistic output of the second:

```text
Alias name     Helpdesk-Team
Comment        Front-line support group

Members

-------------------------------------------------------------------------------
maria.santos
Administrator
The command completed successfully.
```

That membership list is exactly what you verify against a joiner/mover/leaver request. If a departed colleague is still listed there, you have found a security issue, not just a support ticket.

#### The PowerShell equivalents, and why you should prefer them

The `net` commands are fine and universal. PowerShell is better for anything you will repeat, because the output is *objects* you can filter, count, and pipe.

```powershell
# Is this account enabled, and when did it last log on?
Get-LocalUser -Name maria.santos |
    Select-Object Name, Enabled, LastLogon, PasswordLastSet, PasswordExpires

# Who is in this group, right now?
Get-LocalGroupMember -Group 'Helpdesk-Team'

# Every group on the machine that has any member
Get-LocalGroup | Where-Object { (Get-LocalGroupMember $_).Count -gt 0 } |
    Select-Object Name, @{N='Members';E={(Get-LocalGroupMember $_).Count}}
```

Realistic output of `Get-LocalGroupMember`:

```text
ObjectClass Name                   PrincipalSource
----------- ----                   ---------------
User        DESKTOP-7F2A\maria.santos Local
Group       DESKTOP-7F2A\Helpdesk-Team Local
```

Note the **`PrincipalSource`** column. `Local` means the identity lives on this machine. `ActiveDirectory` means it comes from a domain, and `AzureAD` means it comes from Entra ID. On a machine joined to a domain you will routinely see all three in one list, and knowing which is which stops you from hunting in the wrong identity store — the single most common way a beginner wastes an hour.

#### Step five: read the permissions on the folder

Now the resource. `icacls` is the built-in tool that prints and edits the permission entries, called **access control entries (ACEs)**, on a file or folder.

```text
icacls "C:\Shares\Finance"
```

Realistic output:

```text
C:\Shares\Finance BUILTIN\Administrators:(I)(OI)(CI)(F)
                 FINANCE\Finance-ReadOnly:(I)(OI)(CI)(RX)
                 FINANCE\Finance-Managers:(OI)(CI)(M)
                 FINANCE\maria.santos:(M)
                 FINANCE\jsantos:(DENY)(R)
                 CREATOR OWNER:(I)(OI)(CI)(IO)(F)
                 BUILTIN\Users:(I)(RX)
```

This is the most information-dense output in the phase. Read it one column at a time.

**The ACE itself.** Each line is `identity:(flags)(rights)`. The identity can be a user or a group — and if the identity is a group, everyone in that group receives the rights, which is the design you learned in Part 1.

**Inherited versus explicit — the `(I)` flag.** An ACE marked `(I)` was **inherited** from a parent folder. It is not set on this folder; it flows down from above. An ACE with **no** `(I)` is **explicit** — somebody set it on this folder deliberately.

This distinction is the answer to a huge share of real tickets, and it works like this:

- A folder’s permissions were “fine for months” and then changed. Three people are affected. The change is almost certainly on a *parent* folder, and every affected ACE carries `(I)`.
- Exactly one user is affected, and everyone else is fine. Look for an explicit ACE naming that user, or an explicit Deny.
- An ACE keeps reappearing after you delete it. It is inherited. Delete it at the parent, or break inheritance on the child first.

To break inheritance deliberately — that is, to stop this folder following its parent:

```text
icacls "C:\Shares\Finance\Payroll" /inheritance:d
```

`/inheritance:d` **disables** inheritance and *copies* the currently inherited ACEs into explicit ones, so nothing changes in effect until you edit. `/inheritance:r` **removes** inherited ACEs entirely, which is a much bigger change and will often lock people out. Use `/inheritance:d` when in doubt.

**The inheritance-scope flags.** After `(I)` you may see a combination of these, which describe *where the ACE applies*:

- **`(OI)`** — object inherit: this ACE applies to **files** created inside.
- **`(CI)`** — container inherit: this ACE applies to **folders** created inside.
- **`(IO)`** — inherit only: this ACE applies **only** to children, not to the folder itself. `CREATOR OWNER` almost always carries `(IO)`.
- **`(NP)`** — do not propagate: the ACE applies to this folder and its immediate children, but not deeper.

So `(I)(OI)(CI)(F)` reads as: “inherited, applies to this folder and to every file and folder beneath it, full control.” And `(I)(OI)(CI)(IO)(F)` reads as: “inherited, applies only to children, full control.” Those two look nearly identical and behave very differently — which is why technicians who skim `icacls` output get confused.

**The rights letters.** These are the shorthand you will read most often:

| Shorthand | Meaning | What it allows |
|---|---|---|
| `F` | Full control | Everything, including changing permissions |
| `M` | Modify | Read, write, edit, delete — but not change permissions |
| `RX` | Read and execute | Open, read, run — not write |
| `R` | Read | Read only, no execute |
| `W` | Write | Write only |
| `D` | Delete | Delete the object |

You will also meet the long form — `(READ)`, `(WRITE)`, `(MODIFY)`, `(FULL)`, or a parenthesised combination such as `(R,W,D`) — in `icacls` output and in the **Advanced Security Settings** dialog. They mean the same thing; the letters are just compressed.

**The Deny entries, and why they beat everything.** `FINANCE\jsantos:(DENY)(R)` in the listing above is the most important line in it. **An explicit Deny always wins over any Allow**, inherited or explicit, from any group. It does not matter that the user is also in `Finance-Managers` with `(M)`. If an explicit Deny blocks Read, the user is blocked.

This produces the classic support conversation: “but she is in the group that has access!” — and she is, and it does not matter. When a permission check says a user *should* have access but they cannot get in, **search the ACE list for a Deny before you search anything else**. Deny entries also accumulate invisibly, because they are frequently added by someone troubleshooting a different problem and never removed.

There is one more subtlety worth holding: a Deny on a *group* affects everyone in that group, and a Deny on `Everyone` or `BUILTIN\Users` blocks far more people than intended. Deny is a sharp tool. Professionals avoid it where a simpler design works — for example, by simply not granting Read to the group that should not have it, rather than granting Read broadly and then denying one person.

#### Step six: the same thing, the PowerShell way

```powershell
Get-Acl "C:\Shares\Finance" |
    Select-Object -ExpandProperty Access |
    Select-Object IdentityReference, FileSystemRights, AccessControlType, IsInherited
```

Realistic output:

```text
IdentityReference           FileSystemRights AccessControlType IsInherited
-----------------           ---------------- ----------------- -----------
BUILTIN\Administrators               FullControl Allow              True
FINANCE\Finance-ReadOnly      ReadAndExecute Allow              True
FINANCE\Finance-Managers             Modify Allow             False
FINANCE\maria.santos                 Modify Allow             False
FINANCE\jsantos                        Read Deny              False
```

`Get-Acl` gives you the same information as `icacls` in a form you can filter. `IsInherited` is the `(I)` flag; `AccessControlType` is Allow or Deny. Where `icacls` wins is that it shows *scope* flags inline and works over the network with a UNC path, so you will use both.

One practical warning: `Get-Acl` hides the scope flags. An ACE that is inherited-only (`(IO)`) appears identical to one that applies everywhere. When the *behaviour* does not match the `Get-Acl` listing, re-check with `icacls`.

#### Effective permissions: the reasoning that solves the ticket

Everything above is evidence. This is the reasoning you apply to it.

**Rule one: access is the union of Allow entries, minus any Deny.** The user’s effective rights on a folder are the sum of every Allow they receive from their own account and every group they are a member of. If one group gives Read and another gives Modify, they have Modify. Then any Deny that applies is subtracted, and the Deny wins outright.

**Rule two: over the network, share and NTFS must both allow.** From Part 2: effective access across a share is the *more restrictive* of the two. A user with `M` on the NTFS folder but only `Read` on the share gets Read. And a user with Full Control on the share but nothing on NTFS gets nothing. When a network folder misbehaves, you have two permission systems to inspect:

```powershell
# Share-level permissions
Get-SmbShare -Name Finance | Get-SmbShareAccess

# NTFS-level permissions
icacls "C:\Shares\Finance"
```

Realistic share output:

```text
Name    ScopeName AccountName                AccessControlType AccessRight
----    --------- ---------                  ----------------- -----------
Finance *         FINANCE\Finance-ReadOnly   Allow             Read
Finance *         FINANCE\Finance-Managers   Allow             Change
Finance *         Everyone                   Allow             Read
```

Now you can reason concretely. Suppose `FINANCE\maria.santos` needs to save files. On NTFS she has `Modify` through `Finance-Managers`, so the NTFS side is fine. But the share grants `Finance-Managers` only `Change` — which on a share means read, write, and delete, so she is fine there too. Now suppose a *new* user is added to `Finance-ReadOnly` and complains they cannot save: NTFS gives `ReadAndExecute`, the share gives `Read`. Both sides say read-only, consistently, and the answer is “this is working as designed — tell me what you actually need.” That is a very different outcome from a misconfiguration, and you can only tell them apart if you checked both sides.

**Rule three: check whether the user is local or remote.** `icacls` on a local path tells you nothing about the share. `Get-SmbShareAccess` tells you nothing about NTFS. A ticket that says “it works when I am at my desk but not from home” is pointing at the share layer or the VPN identity, not at NTFS.

**Rule four: the fastest test wins.** When you can, stop reasoning and *try it as the user*. `Test-Path` and an actual open attempt beat deduction every time:

```powershell
Test-Path "\\fileserver\Finance\budget.xlsx"
```

#### The stale token: why `whoami /groups` can disagree with the directory

This is the single most useful “invisible” concept in access troubleshooting, and it explains tickets that otherwise make no sense.

When you log on, Windows builds a **token** — a snapshot of your SID, your group memberships, and your privileges at that moment. Windows then uses that snapshot for every access check until you log off. It does **not** re-read the directory on each file open. That would be far too slow.

The consequence: if someone adds you to a group *after* you logged in, **your token does not change**. You are genuinely a member in the directory, and the permission on the folder genuinely grants your group access, and you still cannot get in — because the running session is carrying the old snapshot.

The evidence looks exactly like this:

```text
C:\> net user maria.santos
Local Group Memberships      *Finance-Managers    *Users

C:\> whoami /groups
GROUP INFORMATION
-----------------
Group Name                             Type             SID           Attributes
====================================== ================ ============= =============
BUILTIN\Users                          Well-known group S-1-5-32-545   Mandatory group, Enabled by default, Enabled group
STUDENT-LAPTOP\Helpdesk-Team           Alias            S-1-5-21-...  Mandatory group, Enabled by default, Enabled group
```

Read the mismatch. `net user` — which reads the **directory** — says the account is in `Finance-Managers`. `whoami /groups` — which reads the **current token** — does not list it. The directory and the session disagree, and that disagreement is the diagnosis.

The fix is not a permission change. It is **log off and log back on**, which rebuilds the token. On a domain, locking and unlocking the screen does not reliably refresh group membership; a full sign-out does. Some changes need the machine restarted, and some group membership changes require the domain controller to be reached at logon, so a remote user on a cached-credentials laptop may need to connect to the VPN first.

Recognising this saves you from the worst possible outcome: changing a correct permission to “make it work,” which fixes the symptom for one user and leaves a permanent, wrong, unauditable permission behind.

Apply the same logic to the other direction. If you *remove* someone from a group and they still have access, their token still contains the group. The change is not broken — the session is stale. Sign out, and it applies.

#### A short evidence reference

| Symptom | First command | What you are looking for |
|---|---|---|
| “I cannot access the folder” | `whoami` | Are they logged in as the account you think? |
| “I was added to the group yesterday” | `whoami /groups` vs `net user <name>` | Mismatch means a stale token — sign out and back in |
| “It works for her but not for me” | `icacls <path>` | An explicit Deny, or access granted to a user rather than a group |
| “It broke for the whole team” | `icacls <parent path>` | A change on a parent; affected ACEs carry `(I)` |
| “It works locally but not over the network” | `Get-SmbShareAccess` | Share permission more restrictive than NTFS |
| “Am I an admin on this box?” | `whoami /priv` | The long privilege list, including `SeDebugPrivilege` |
| “The account is locked or expired” | `net user <name>` | `Account active`, `Password expires`, `Last logon` |
| “Who is in this group?” | `Get-LocalGroupMember -Group <name>` | Members who should have been removed, and `PrincipalSource` |

### Part 5 — Backup truth: what a backup actually protects against

#### Start with the threat, not the tool

Part 3 gave you the vocabulary — full, incremental, differential — and the 3-2-1 rule. This part goes after the question that actually determines whether you are protected: **protected against what?**

A backup is not one thing. It is a set of protections, and each protection fails differently:

| Threat | Does a normal backup help? | Why it can fail |
|---|---|---|
| Disk failure | Yes, well | If the backup lives on the same disk, no |
| Accidental deletion | Yes | If the deletion is not noticed before the retention window closes |
| Bad edit or corrupted file | Yes, if versioning exists | A single-version backup overwrites the good copy with the bad one |
| Ransomware | Only if a copy is unreachable | Ransomware encrypts mapped drives and sync folders too |
| Theft or fire at the office | Only with an off-site copy | Local-only backups die with the building |
| Silent corruption over months | Partially | You restore corrupted data that you had not yet noticed |
| A rogue administrator | Only with immutability | They can delete the backups too |

Read that table twice, because the failures in the right-hand column are the ones that turn “we have backups” into “we had backups.” They are also, almost always, the reason a real organisation loses data despite owning backup software.

#### Backup, snapshot, and sync are three different things

Beginners — and, uncomfortably often, small businesses — use these words interchangeably. They are not interchangeable, and the difference decides whether you recover.

**A backup** is an independent copy of data, stored somewhere else, on a different schedule from the original, and usable to restore the data to an earlier point in time even if the original is destroyed.

**A snapshot** is a point-in-time view of a volume, usually created instantly by the storage system. It is excellent for one specific job: *“I need the file I deleted an hour ago.”* It is not a backup, because a snapshot typically lives on the same physical storage as the original. If that storage dies, is encrypted, or is wiped, the snapshot dies with it. Snapshots are fast recovery, not disaster recovery.

**A sync** keeps two locations identical. This is the important one, because it is the mistake almost every beginner makes and it feels like safety.

**A synced folder is not a backup.** Here is why, in one concrete example. You keep your project folder in a cloud sync client. Ransomware encrypts every file in it at 2am. By 2:05am the sync client has faithfully uploaded the encrypted versions to the cloud, and — depending on configuration — downloaded the encryption over every other synced device. You now have four copies of your encrypted data, all consistent, all useless. Sync did its job perfectly. Its job was to make everything the same, and the mistake became identical everywhere, quickly.

The same logic applies to an accidental delete: delete a file, and the sync deletes it on every device. Or a bad edit: overwrite a report with nonsense, and the nonsense is now the canonical version everywhere.

Sync tools can be *part* of a backup strategy — many have version history that genuinely helps. But version history is bounded (often 30 days, sometimes 90), and it is not something you have tested. Treat it as a convenience, never as the thing you would bet the business on.

#### The restore test is the only proof

**An untested backup is not a backup. It is a hope with a schedule.**

A backup job that reports “Success” has proven one thing: that data was written somewhere. It has not proven that the data is complete, that it can be read, that the software can restore it, that you know the recovery password, or that restoring it will take the two hours you promised rather than two days.

The only way to know is to **restore something, deliberately, and check it.** A real restore test covers all of these:

1. **Pick a specific file** — not “some data.” Choose a real file, ideally something awkward like a file with a long path, a file someone was editing, or a database.
2. **Restore it to a different location.** Never over the original. You are testing recovery, not creating a second incident.
3. **Open it, and verify the contents.** “It restored” is not the test. “It opened, and the numbers in row 400 are correct” is the test.
4. **Time it.** How long did it take? If it took three hours for one file, your recovery time for the whole share is not what you think.
5. **Write down what you did.** The next person should be able to repeat it without asking you.
6. **Record the result with the date.** A restore test from eleven months ago is a historical document, not a current assurance.

The habit to build is small: once a month, restore one file and one folder from your own backup, and write a one-line note with the date. That is fifteen minutes, it costs nothing, and it will find more broken backups than any dashboard will.

#### Retention and versioning: how far back can you actually go?

**Retention** is how long a backup copy is kept before it is overwritten or expired. **Versioning** is how many distinct points in time you can restore from.

These are the numbers that decide whether a backup helps you, and they are usually wrong in the same direction: shorter than the people relying on them believe.

Consider a backup that runs nightly and overwrites the previous night’s copy. It has **one version**, roughly a day of retention. Now put a real scenario against it. Someone notices on Friday that a spreadsheet has been wrong since Tuesday, and they need Tuesday’s version. It does not exist. The backup has been faithfully running all week, and it cannot help.

The practical minimum worth aiming for is a **generation set**: keep more than one point in time. The classic rotation is grandfather-father-son — daily copies, weekly copies, monthly copies — which gives you recent granularity plus older safety without keeping everything forever. Ask these questions about any backup you are responsible for, and write down the answers:

- **How many restore points exist right now?** Not how many the job schedules — how many are actually on the disk.
- **How far back does the oldest one go?**
- **What happens if we do not notice the problem for two weeks?**
- **Do we have a copy from before the incident, or only after?**

That last question is the one ransomware makes urgent. If your oldest copy is three days old and the intrusion began a month ago, every copy you hold may already be encrypted or backdoored.

#### Ransomware: why the copy has to be unreachable

Modern ransomware does not just encrypt the machine in front of it. It looks for mapped network drives, connected USB disks, and cloud sync clients, and it encrypts those too — because backups are the thing that would let you refuse to pay. Some variants deliberately hunt down and destroy backup files and shadow copies before encrypting anything else.

So the question that matters is not “do we have a backup?” It is:

**Can the person or process running on the compromised machine reach and destroy the backup?**

If the answer is yes, you do not have a ransomware-resistant backup. You have a second target.

The properties that change the answer:

- **Offline copies.** A backup on a USB drive that is disconnected when the job finishes. Physically unreachable is the strongest protection there is, and for a home lab or a small business it is genuinely the best $0 answer.
- **Immutable copies.** Storage configured so that written data cannot be altered or deleted for a fixed period, even by an administrator. This is what “immutability” means in backup products, and it is the property that defeats a rogue or compromised admin account.
- **Credentials isolation.** If the backup job uses a domain administrator account, then compromising the domain compromises the backups. A backup account should have access to the backup target and nothing else.
- **Air-gapped rotation.** Two drives, alternating, with one physically away from the building. Not expensive, and it survives fire and theft as well as ransomware.

For the phase’s purposes you are not designing enterprise backup. You are learning to ask the question. When you see a backup plan, ask where the copies live relative to the thing being protected, and whether the protected machine can delete them. If the same machine can read and erase its own backups, the plan has a hole you can name out loud — and naming it is exactly the kind of thing that gets a junior technician noticed.

#### What “the backup failed” looks like from the support desk

Backup tickets arrive in a few recognisable shapes. Knowing them means you can triage in minutes instead of hours.

**“The backup did not run last night.”** The most common backup ticket, and usually the least alarming. Causes, in rough order of frequency: the machine was powered off or asleep; the external drive was unplugged or reassigned a different drive letter; the destination ran out of space; the backup service was stopped or set to manual after an update; the previous job was still running and the new one skipped.

**“The backup ran but the drive is full.”** Almost always a retention problem. The job has been silently keeping more generations than expected, or a versioning setting was changed, or somebody copied unrelated data onto the backup drive. Never fix this by deleting the oldest copy and moving on — check whether that oldest copy is the only pre-incident one you have.

**“It says the backup succeeded but the file is not there.”** Treat this as serious. The job is running and the data is not arriving, which usually means it is backing up the wrong path — a redirect that changed, a profile that moved, or a source selection that was never right. This is the failure mode that an untested backup hides for months.

**“The backup service will not start.”** Check the service, its logon account, and the event log. A service account whose password was changed and never updated in the service configuration is a classic, and it produces exactly this symptom on exactly this kind of service.

**“We need to restore something.”** This is not a backup ticket; it is a recovery task with a user waiting. Ask three questions immediately: *what* exactly, *from when*, and *is the original still there*. Then restore to a scratch location first so you do not destroy evidence, and confirm the restored file with the user before you touch anything else.

Two habits make all of these faster. First, **check the history, not the status light** — read the last several job results, because one failure is noise and four in a row is a pattern. Second, **record the backup product, the destination, and the schedule in the ticket**, so the next person does not have to rediscover them.

### Part 6 — Guided walkthrough: inspect your own machine’s access

Work through these six checks on your own Windows machine and record the results. You need nothing installed — every command below is built into Windows. Keep a plain text file open and paste in the output as you go; that file becomes portfolio evidence.

If a command needs an elevated prompt, open **Windows Terminal** by right-clicking it and choosing **Run as administrator**. Note which checks needed elevation — that difference is itself information.

#### Check 1 — Establish who you are right now

```text
whoami
whoami /groups
whoami /priv
```

**Record:** your account name in the `MACHINE\user` form, the full group list, and the privilege list.

**How to interpret it:** identify from `whoami` whether this is a local account or a domain account by whether the left-hand side matches your computer name. In `whoami /groups`, find the entries with a `Deny` attribute and note them — most home machines have none, and knowing that is the baseline. In `whoami /priv`, count the privileges and note whether the list is short (standard user) or long (administrator, including `SeDebugPrivilege`).

**What this teaches:** the difference between an account and a session. Everything you do from this prompt is done as this token, with exactly these groups and privileges, regardless of what any account database says.

#### Check 2 — Create a group, add a user, and prove the token is a snapshot

```powershell
# Elevated prompt. Create a test group and a test user.
New-LocalGroup -Name 'P5-TestGroup' -Description 'Phase 5 permission test'
New-LocalUser -Name 'p5test' -Password (Read-Host -AsSecureString 'Password') -PasswordNeverExpires
Add-LocalGroupMember -Group 'P5-TestGroup' -Member 'p5test'

# Now prove membership landed
Get-LocalGroupMember -Group 'P5-TestGroup'
```

**Record:** the membership list, and the `PrincipalSource` value of your test user.

**How to interpret it:** `PrincipalSource` should read `Local`, because you just created this identity on this machine. If you are on a domain-joined machine, run `Get-LocalGroupMember -Group 'Administrators'` as well and you will likely see a mix of `Local`, `ActiveDirectory`, and `AzureAD` sources in one list.

**What this teaches:** how identity is created and confirmed locally, and that the group memberships you read from the database are not necessarily the ones a running session is using. You will prove that in the next check.

#### Check 3 — Build a folder, set permissions, and read the result

```powershell
# Create a throwaway folder well away from your Documents
New-Item -ItemType Directory -Path 'C:\P5-AccessLab' | Out-Null
Set-Content -Path 'C:\P5-AccessLab\sample.txt' -Value 'Phase 5 permission lab'

# Grant the test group read-only, explicitly
icacls 'C:\P5-AccessLab' /grant 'P5-TestGroup:(OI)(CI)(RX)'

# Read the whole permission list back
icacls 'C:\P5-AccessLab'
```

**Record:** the complete `icacls` output, and mark which ACEs carry `(I)` and which do not.

**How to interpret it:** the `P5-TestGroup` line you just created has **no** `(I)` — it is explicit, because you set it on this folder. Every other line inherited from `C:\` and carries `(I)`. Both kinds of line are “permissions on this folder,” and they are maintained completely differently. Now run the PowerShell view of the same thing:

```powershell
Get-Acl 'C:\P5-AccessLab' |
    Select-Object -ExpandProperty Access |
    Select-Object IdentityReference, FileSystemRights, AccessControlType, IsInherited |
    Format-Table -AutoSize
```

Confirm that `P5-TestGroup` shows `IsInherited = False` while your own user and `BUILTIN\Administrators` show `True`.

**What this teaches:** explicit versus inherited, read from both tools. You have now seen the same fact expressed as `(I)` in one tool and `IsInherited` in another, which is the translation you will do for the rest of your career.

#### Check 4 — Break inheritance on purpose, and observe what changes

```powershell
New-Item -ItemType Directory -Path 'C:\P5-AccessLab\Child' | Out-Null

# Disable inheritance and COPY the inherited entries down as explicit ones
icacls 'C:\P5-AccessLab\Child' /inheritance:d

# Compare before and after
icacls 'C:\P5-AccessLab\Child'
```

**Record:** the child folder’s ACE list before and after the change.

**How to interpret it:** before, every ACE on `Child` carried `(I)`. After `/inheritance:d`, the same ACEs are still there with the same rights — but the `(I)` is gone. Nothing about access changed; only the *source* of the entries changed. Now the folder will no longer follow its parent.

Then prove the difference between the two switches, on a second child folder:

```powershell
New-Item -ItemType Directory -Path 'C:\P5-AccessLab\Child2' | Out-Null
icacls 'C:\P5-AccessLab\Child2' /inheritance:r
icacls 'C:\P5-AccessLab\Child2'
```

**How to interpret it:** `/inheritance:r` produced a much shorter list, because it *removed* the inherited entries rather than copying them. This is why `/inheritance:r` locks people out and `/inheritance:d` usually does not. If you ever run `:r` on a real folder, you have to grant access back deliberately and immediately.

**What this teaches:** inheritance is a live relationship, not a one-time copy. Changing a parent changes every child that still inherits from it — and “it worked yesterday for eight people” is almost always a parent-level change.

#### Check 5 — Add a Deny, watch it win, then clean up

```powershell
# Deny read to your own user account — replace with your actual account name
icacls 'C:\P5-AccessLab\Child' /deny "$env:USERNAME:(R)"

icacls 'C:\P5-AccessLab\Child'

# Try to read the file you put in the parent folder
Get-Content 'C:\P5-AccessLab\sample.txt'
```

**Record:** the ACE list showing a `(DENY)` entry, and what happened when you tried to work in that folder.

**How to interpret it:** you are a member of `BUILTIN\Users` and of `BUILTIN\Administrators`, both of which still have Allow entries on this folder — and the Deny stripped access anyway. That is the rule from Part 4 demonstrated on your own machine: **an explicit Deny beats every Allow, including inherited ones and including ones from groups you belong to.**

If you are running elevated, you may find that Administrator access still works, because administrators can take ownership and override. That is not the Deny failing; it is a different mechanism, and it is exactly why “run it as admin and see” is a terrible diagnostic habit.

Now remove the Deny, because leaving one behind is the exact mistake that creates next month’s ticket:

```powershell
icacls 'C:\P5-AccessLab\Child' /remove:d "$env:USERNAME"
icacls 'C:\P5-AccessLab\Child'
```

**What this teaches:** a Deny is powerful, invisible to the person it blocks, and easy to leave behind. When you finish any permission change, re-read the ACL and confirm the state you intend — not the state you typed.

#### Check 6 — Inspect your own backup situation, honestly

```powershell
# Is File History configured, and where does it write?
Get-Service -Name 'fhsvc' | Select-Object Name, Status, StartType

# What backup-related scheduled tasks exist?
Get-ScheduledTask |
    Where-Object { $_.TaskName -match 'Backup|Restore|File History' } |
    Select-Object TaskName, State

# What volumes exist, and which are removable?
Get-Volume | Select-Object DriveLetter, FileSystemLabel, DriveType,
    @{N='SizeGB';E={[math]::Round($_.Size/1GB,1)}}
```

**Record:** whether a backup service is running, whether any backup task exists, and which of your volumes are `Fixed` versus `Removable`.

**How to interpret it:** most home machines return a stopped `fhsvc` and no backup tasks at all, which means there is no backup — only files that happen to be synced somewhere. If you do have a backup, answer the three questions from Part 5 in writing: how many restore points exist, how far back the oldest goes, and whether the machine can reach and delete its own backup destination.

Then do one thing that is worth more than all the reading: **restore a single file from it.** Create a throwaway file, let it back up or sync, delete it, and retrieve it. Time the whole exercise and write down how long it took.

**What this teaches:** the difference between believing you are backed up and being able to prove it. Six months from now, the note you wrote today with a date and a restore time is the only evidence that will mean anything.

#### Cleanup

When you have finished, remove the lab so it does not become a permanent, undocumented permission oddity:

```powershell
# Elevated prompt
Remove-LocalGroup -Name 'P5-TestGroup'
Remove-LocalUser -Name 'p5test'
Remove-Item -Path 'C:\P5-AccessLab' -Recurse -Force
```

Then confirm they are gone with `Get-LocalUser` and `Get-LocalGroup`. Leaving test accounts and test groups behind on a production machine is a genuine audit finding, and building the habit of cleaning up after yourself starts now.

### Part 7 — Two worked tickets

These are two tickets in the style you will actually receive. The diagnosis is the point — the fix at the end is usually small, and that is exactly the lesson. Read the evidence and try to reach the conclusion before you read it.

#### Ticket 1 — “I cannot get into the Finance folder and I need it today”

**The ticket as received.**

> User reports they cannot open the shared Finance folder. Says “it worked last week and now it says access is denied.” Deadline today. Priority set to High by the user.

**Step 1 — Get the exact wording, not the summary.**

> “Before I change anything, can you read me the exact message on screen, and tell me whether you are in the office or working from home?”

*“It says: You do not have permission to access this folder. And I am at home on the VPN.”*

That is a specific error, not a vague one. It rules out the folder being deleted, the share being offline, and the server being down — in all of those cases the message is different. “You do not have permission” is an authorisation problem, and it means the network path was reached. Also note **VPN**: the user is remote, so this is a network access check, and **both** share and NTFS permissions apply.

**Step 2 — Establish identity and membership.**

You ask the user to open a command prompt and read you the output, or you connect to their session and run it yourself with their permission:

```text
whoami
student-laptop\maria.santos

net user maria.santos
User name                    maria.santos
Account active               Yes
Password last set            3/14/2025 9:02:11 AM
Last logon                   4/2/2025 8:41:03 AM
Local Group Memberships      *Finance-Managers     *Users
Global Group memberships     *None
```

The account is active, the password is not expired, and — importantly — the account **is** a member of `Finance-Managers`. So the user’s claim that they should have access is not wishful thinking. Something else is wrong.

**Step 3 — Compare the directory against the token.**

```text
whoami /groups
GROUP INFORMATION
-----------------

Group Name                             Type             SID          Attributes
====================================== ================ ============ ==================================================
BUILTIN\Users                          Well-known group S-1-5-32-545 Mandatory group, Enabled by default, Enabled group
STUDENT-LAPTOP\Helpdesk-Team           Alias            S-1-5-21-... Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users       Well-known group S-1-5-11    Mandatory group, Enabled by default, Enabled group
```

**This is the diagnosis, and it is a single observation.** `net user` says the account belongs to `Finance-Managers`. `whoami /groups` does not list it. The directory and the running session disagree, which means the session token was built before the group membership was added — a **stale token**.

Before you accept that, though, check the second possibility, because a stale token and broken permissions produce identical user-facing symptoms. Ask the one question that separates them:

> “When were you added to the Finance group?”

*“Yesterday afternoon, by Ate Joy in IT.”*

That settles it. The change was made yesterday; the user’s session has been running since this morning at the earliest, and on a laptop that is rarely shut down, likely much longer. There is nothing wrong with the permissions at all.

**Step 4 — Rule out the other causes anyway, quickly.**

A good technician confirms rather than assumes. Two commands from the server side:

```text
icacls "C:\Shares\Finance"
C:\Shares\Finance FINANCE\Finance-Managers:(I)(OI)(CI)(M)
                 FINANCE\Finance-ReadOnly:(I)(OI)(CI)(RX)
                 BUILTIN\Administrators:(I)(OI)(CI)(F)
```

```text
Get-SmbShare -Name Finance | Get-SmbShareAccess
Name    AccountName               AccessControlType AccessRight
----    ---------                 ----------------- -----------
Finance FINANCE\Finance-Managers   Allow             Change
Finance FINANCE\Finance-ReadOnly   Allow             Read
```

The group has `Modify` on NTFS and `Change` on the share. Both sides allow, so effective access is allowed. There is no Deny anywhere. **The permissions are correct.** This is the moment where a less careful technician starts “fixing” things — adding the user directly to the folder, or adding a Deny, or granting Everyone access — and creates a permanent problem to solve a temporary one.

**Step 5 — The fix.**

Have the user **sign out completely and sign back in**. Not lock the screen — sign out. On a domain machine this rebuilds the token from the domain controller, and since the user is on the VPN, the domain controller is reachable.

If a full sign-out does not resolve it, the next checks are, in order: confirm the machine can reach a domain controller on the VPN (`nltest /dsgetdc:company.local`), and confirm the group change actually replicated (checking the group’s membership from the server rather than from `net user` on the laptop, which may be reading a cached profile). Only after those do you touch a permission — and you would still not touch it, because the evidence says it is correct.

**Step 6 — Verify.**

> “Please sign out, sign back in, and try opening the Finance folder. Tell me when you can see the file list, and then open the specific document you need.”

The user signs back in, opens the folder, and opens the document. You ask them to confirm the *file they actually needed* opens, not just that the folder does. Then you tell them — plainly — what happened and that it was not their fault.

**The ticket note.**

> **Reported:** User unable to open the shared Finance folder from home over VPN. Error shown: “You do not have permission to access this folder.” Reported as working the previous week. User flagged the deadline as urgent.
> **Changed recently:** User was added to the domain group `FINANCE\Finance-Managers` by IT the previous afternoon. No permission changes were made to the share or to the NTFS ACL in that period.
> **Observed:** `net user maria.santos` showed membership in `Finance-Managers`, but `whoami /groups` on the running session did not list it — the directory and the session token disagreed, indicating the token predated the group change. Confirmed server-side that the permissions were correct: NTFS grants `FINANCE\Finance-Managers (I)(OI)(CI)(M)`, and the share grants the same group `Change`. Neither side is more restrictive, and there are no Deny entries in either ACL. Error message wording (“you do not have permission”) confirmed the network path was reachable, ruling out VPN or share-availability faults.
> **Action:** No permission changes made. Directed the user to sign out of Windows completely and sign back in, which rebuilds the session token from the domain controller. Specifically advised a full sign-out rather than a screen lock.
> **Verified:** User signed back in, opened the Finance folder, and opened the specific document the deadline depended on. Confirmed working.
> **Cause:** Stale session token. The user’s Windows session began before their group membership was changed, and Windows does not refresh group membership within an existing session. The permissions themselves were correct throughout.
> **For the next agent:** Group membership changes do not take effect in a running session. When adding a user to a group, tell them at the same time that they must sign out and back in — that one sentence prevents this ticket. No permission defect exists here, so do not change the Finance ACL if this recurs; check the session first.

**Reasoning to take away.** The user’s own framing (“it worked last week, so something is broken”) was wrong, and so was the instinct to fix a permission. The diagnosis came from comparing two sources of truth — the directory and the token — and noticing they disagreed. That comparison costs two commands and would have solved this ticket in three minutes instead of an hour of permission archaeology.

#### Ticket 2 — “The nightly backup has been failing all week”

**The ticket as received.**

> Monitoring alert: nightly backup job `FILESERVER-Daily` has reported a failed or aborted result on five consecutive nights. No user has reported a problem.

**Step 1 — Read the ticket properly before acting.**

The second sentence is the important one. **No user has reported a problem**, which means this is a preventive ticket, not an outage. That changes your urgency and your communication entirely: there is no one blocked, and you have time to diagnose properly instead of applying the first fix that comes to mind. It also means nobody else knows about it, so your ticket note is the only record.

Priority rule for the desk: a failed backup is **not** automatically urgent. A failed backup on the *only* copy of data that cannot be recreated is a different matter entirely. Establish which one this is.

**Step 2 — Read the job history, not the status light.**

```text
Job: FILESERVER-Daily
Last 6 results:
  2025-04-07 23:00  Failed     The process cannot access the file because it is being used by another process.
  2025-04-06 23:00  Failed     The process cannot access the file because it is being used by another process.
  2025-04-05 23:00  Failed     The process cannot access the file because it is being used by another process.
  2025-04-04 23:00  Failed     The process cannot access the file because it is being used by another process.
  2025-04-03 23:00  Failed     The process cannot access the file because it is being used by another process.
  2025-04-02 23:00  Completed  1,284 GB written.
```

Six lines, and already three facts: the job worked on the 2nd, the failures started on the 3rd, and the message is identical every night. An identical message on five consecutive nights is not a transient fault — it is a **persistent condition**. That is the pattern-versus-noise judgement from Part 5, and it is the reason you read history rather than a single result.

The error is a **file lock**: something held a file open at 23:00 and the backup could not read it.

**Step 3 — Find what changed on the 3rd.**

The failures began on a specific date. Something changed on or shortly before it. Ask, then check:

```text
Get-WinEvent -FilterHashtable @{LogName='System'; StartTime=(Get-Date).AddDays(-7)} -MaxEvents 200 |
    Where-Object { $_.ProviderName -match 'Service Control Manager|Windows Update|Backup' } |
    Select-Object TimeCreated, ProviderName, Id, Message -First 20
```

Among the output you find a service installation event on the evening of the 2nd:

```text
2025-04-02 21:14:07  Service Control Manager  7045  A service was installed in the system.
Service Name:  VeeamEndpointAgent
Service File Name:  "C:\Program Files\Backup Agent\agent.exe" -service
```

**There it is.** A new agent was installed on the file server on the evening of the 2nd. The backup succeeded that night — it ran at 23:00, after the 21:14 install, and completed. So the install itself did not break it directly. But the agent is now running continuously, and the question becomes what it is holding open.

**Step 4 — Identify what is locking the files.**

```powershell
Get-Process -Name 'agent' -ErrorAction SilentlyContinue |
    Select-Object Id, ProcessName, StartTime, Path

Get-Service | Where-Object { $_.Name -match 'Backup|Agent|Veeam' } |
    Select-Object Name, DisplayName, Status, StartType, StartName
```

Realistic output:

```text
Name              DisplayName            Status StartType StartName
----              -----------            ------ --------- ---------
VeeamEndpointAgent Backup Agent Service  Running Automatic LocalSystem
```

The service is running as **`LocalSystem`**, it is set to **Automatic**, and it starts at boot. This is enough to explain the lock: a service running as `LocalSystem` has unrestricted access to local files, and a backup agent scanning files to index them will hold handles open on exactly the kind of large, continuously-written database file that the nightly job needs.

**Step 5 — Confirm the overlap, and decide the fix.**

Two facts together are the diagnosis: the new agent runs continuously as `LocalSystem`, and the nightly backup runs at 23:00. The agent’s scan and the backup job are competing for the same files.

There are three legitimate fixes, and choosing correctly matters:

1. **Reschedule the backup** so it does not overlap the agent’s scan window. Cheapest, lowest risk, reversible.
2. **Configure the agent to exclude** the data folder the backup reads, if the agent is not meant to protect it.
3. **Change the agent’s service account** to a lower-privileged account so it cannot open those handles at all.

You do **not** stop the service and declare victory, and you do **not** change the backup job’s source selection. Stopping a service that was deliberately installed to protect the machine reintroduces whatever risk it was installed to address — and on a file server, unprotected endpoint data is a real gap.

**Step 6 — Apply, then verify with a real run.**

Reschedule the nightly job to 01:30, clear of the agent’s scan window, then **run the job manually** rather than waiting until tomorrow:

```text
Start-BackupJob -Name 'FILESERVER-Daily'
```

Result: `Completed — 1,286 GB written.` The job succeeds.

Then do the thing that separates a technician from a button-presser: **restore one file from the newly completed backup**, and confirm it opens. The backup reporting success and the backup being usable are two different claims, and you have only verified the first one until you restore something.

**The ticket note.**

> **Reported:** Monitoring alert — nightly backup job `FILESERVER-Daily` failed or aborted on five consecutive nights (3–7 April). No user-reported impact; raised by alert only.
> **Changed recently:** Backup agent `VeeamEndpointAgent` was installed on the file server on 2 April at 21:14 (confirmed via Service Control Manager event ID 7045). No other change found in the preceding week.
> **Observed:** Job history showed an identical failure message each night — “The process cannot access the file because it is being used by another process” — indicating a persistent file lock rather than a transient fault. The job completed normally on 2 April. The new agent service is configured as Automatic and runs under the `LocalSystem` account, which gives it unrestricted access to local files, and it scans continuously. Its scan window overlaps the 23:00 backup start.
> **Action:** Rescheduled `FILESERVER-Daily` to 01:30 to clear the agent’s scan window. Did not stop or disable the agent service, and did not change the backup source selection — the agent is protecting the machine by design and the backup scope was correct. Then ran the job manually rather than waiting for the next cycle. Restored one file from the completed backup to a scratch location and confirmed it opened.
> **Verified:** Manual job run completed with 1,286 GB written. Restored file opened correctly and matched the expected contents. Next scheduled run at 01:30 is to be confirmed on the following morning’s alert report.
> **Cause:** Overlapping file access. The newly installed endpoint backup agent scans continuously as `LocalSystem` and held open handles on files that the nightly backup job needed to read at 23:00. The backup job and its permissions were correct throughout.
> **For the next agent:** Any new agent, scanner, or indexing service installed on a machine with a scheduled backup job can break that job without any error on the agent side. When adding software to a backed-up server, check the job history the next morning. The backup job source selection is correct — do not change it if this recurs; check for new services and scheduling conflicts instead.

**Reasoning to take away.** The alert said only “backup failed.” The history said *same error, five nights, starting on a specific date*. The date said *what changed*. The service list said *who changed it and with what privileges*. Each step narrowed the next, and no step required guessing. The fix was a schedule change — small, reversible, and provably verified — because the evidence pointed at a conflict rather than at a fault.

### Part 8 — Preventing the next ticket

#### Every repeated ticket is a process that failed

You will notice something after a few months on a helpdesk: the same tickets come back. The same user, the same folder, the same group membership, the same backup alarm. Each one is solvable in isolation — and solving them in isolation forever is what makes a support desk exhausting.

The shift is to ask, after the second time: **what would stop this from being a ticket at all?** That question is the beginning of systems thinking, and it is what this whole phase has been building towards.

The levers a junior technician actually controls are small and real:

**Name things so they explain themselves.** `Finance-ReadOnly` and `Finance-Managers` tell you what they do. `Group1`, `TempAccess`, and `Maria-Access` do not — and in a year nobody, including you, will know whether they are safe to delete. Naming is not bureaucracy; it is the difference between a group you can audit and a group you are afraid to touch. The same applies to folders, shares, backup jobs, and tickets: `FILESERVER-Daily` is a far better job name than `Backup 2`.

**Assign access to groups, never to people.** Part 1 said this and it is worth repeating here, because it is the single highest-leverage habit on this list. Every permission granted to an individual creates a thing that must be found and removed by hand when that person changes role. Every permission granted to a group is maintained by group membership, which is one line in one place.

**Document what you changed, at the moment you change it.** Not at the end of the week, not in a message that scrolls away. A short line in a shared change log:

```text
2025-04-08 10:22  maria.santos  Added FINANCE\Finance-Managers to
                                C:\Shares\Finance\Reports (inherited from parent).
                                Requested by J. Cruz, approved ticket #4821.
```

Four facts and a timestamp. It takes twenty seconds, and it is the difference between a colleague being able to reason about the environment and a colleague having to guess — or having to ask you at 2am.

**Keep a change log, and read it before you diagnose.** The most valuable line in a change log is the one that explains the ticket you are working on right now. Almost every “it worked yesterday” ticket has an entry. The second-most valuable thing a change log does is protect you: when someone asks why a permission is the way it is, the answer is written down, with a requester and a ticket number.

**Tell the user what to expect.** If you add someone to a group, say “you will need to sign out and back in.” If you change a backup schedule, say “the first run under the new schedule is at 01:30 tomorrow.” Half of the tickets in this phase exist because a change was correct and the user was not told, so they reported a problem that was really just a change taking effect.

**Close the loop on temporary access.** Temporary access that is not tracked becomes permanent access. If you grant something “just for this week,” put a dated reminder somewhere you will actually look — a calendar entry, a ticket, a checklist item. Access accumulates silently, and the only defence is a habit.

#### “I fixed it” without a note is a debt

This is the one to internalise, because it is the mistake that separates a technician who is trusted with more from one who is not.

You fix something. It works. You close the ticket. You wrote nothing.

Now consider what you have actually done. You have **changed the state of a system** in a way that exists only in your memory. Tomorrow, someone asks why the finance folder has an unusual permission. Nobody knows. Next month, the problem recurs and the next technician starts from zero — and may well “fix” it in a way that undoes your change. In a year, you leave, and the knowledge leaves with you. Every organisation has a few of these: permissions nobody understands, scheduled tasks nobody remembers creating, service accounts with passwords in a document nobody can find. They are all the residue of fixes that were never written down.

A note costs two minutes and converts a private fix into shared knowledge. At minimum, record:

- **What you changed** — the exact object and the exact setting, not “fixed permissions.”
- **When** — the date and time, so it can be correlated with other events.
- **Why** — the request, the ticket number, the person who approved it.
- **How to undo it** — the previous value, so the change is reversible by someone who is not you.

That last point is the mark of someone who thinks about systems rather than tasks. A change with a documented reversal path is safe to make. A change without one is a small, permanent risk that nobody agreed to.

None of this requires seniority, budget, or permission. It requires only that you write the sentence while it is still in front of you. Do that consistently for a year and you will be the person whose changes are trusted — which is the entire premise of this phase.

### Part 9 — Key takeaways

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
- **The SID is the truth; the friendly name is a lookup.** A raw SID with no name in a permission listing means the identity no longer resolves.
- **`(I)` means inherited, and no `(I)` means explicit.** A change that affects many people at once usually happened on a parent folder; a change that affects one person is almost always an explicit ACE.
- **An explicit Deny beats every Allow**, from any group, inherited or not. When a user should have access and cannot get it, search the ACL for a Deny first.
- **`whoami /groups` reading differently from group membership in the directory means a stale token.** Sign out and back in. Do not change a permission that is already correct.
- **`whoami /priv` shows what the session can do**, not what the account is called. A long privilege list on an account that should be a standard user is a real finding.
- Across the network, **share and NTFS must both allow**, and the more restrictive wins. Test with `Get-SmbShareAccess` *and* `icacls`.
- **A snapshot is not a backup and a sync is not a backup.** A sync makes the mistake identical everywhere, quickly.
- **Retention and versioning decide whether a backup helps you.** Ask how many restore points exist and how far back the oldest goes — and remember that a one-version nightly backup cannot recover last Tuesday.
- **A backup the compromised machine can reach and delete is a second target.** Offline and immutable copies are what make ransomware recovery possible.
- **The restore test is the only proof.** Restore a real file, to a different location, open it, time it, and write down the date.
- **“The backup failed” has a small set of usual causes** — a machine that was off, an unplugged or re-lettered drive, a full destination, a stopped service, a competing process. Read the history, not the status light.
- **Every repeated ticket is a process that failed.** Name things clearly, assign access to groups, and say what you changed at the moment you change it.
- **“I fixed it” without a note is a debt** paid by whoever comes next. Record what you changed, when, why, and how to undo it.

### Part 10 — Practice this next

The tasks below are the phase. Create the user and group, break and fix folder permissions, run the inventory script, and write both admin workflow documents from the official docs. Assemble them into the portfolio deliverable, and rehearse the remote-onboarding answer out loud — it is the exit criterion and the most likely interview question this phase prepares you for.

1. Run `whoami`, `whoami /groups`, and `whoami /priv` on your own machine and write a short paragraph explaining, in your own words, the difference between the account, the token, and the privileges. Add the output to your portfolio.
2. Complete the six checks in Part 6 and save the raw command output into a single file. Mark every ACE in your `icacls` output as inherited or explicit, and note which checks needed an elevated prompt.
3. Deliberately create a Deny entry on your lab folder, prove that it blocks you despite your group memberships, then remove it and re-read the ACL to confirm it is gone. Write one sentence on why leaving a Deny behind is dangerous.
4. Reproduce the stale-token diagnosis from Ticket 1 on your own machine: add yourself to a new local group without signing out, confirm that `whoami /groups` does not list it while `Get-LocalGroupMember` does, then sign out and back in and confirm the two agree.
5. Audit your own backup situation honestly using the commands in Check 6. Record how many restore points exist, how far back the oldest goes, and whether the machine can reach and delete its own backup destination. Then restore one file from it and time the restore.
6. Take one real folder or share you control and answer four questions in writing: share permissions, NTFS permissions, which is more restrictive, and what the effective access is for a standard user.
7. Write a one-page “backup failed” triage checklist for a small company, listing the usual causes in the order you would check them and the exact command or screen you would use for each.
8. Write a ticket note for a fix you have made recently — a home machine counts — using the full structure from Part 7: Reported, Changed recently, Observed, Action, Verified, Cause, For the next agent. The discipline is in the sections, not the subject.
9. Start a change log for your home lab as a plain text or Markdown file, and add an entry for every lab change you make for the rest of this phase. Include what you changed, when, why, and how to undo it.
